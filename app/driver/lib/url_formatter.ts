import {ServerAddress}                   from "../../config/ServerConfig";
import fp                                from "lodash/fp"
import { ConfigurationValidationFailed } from "../errors/ConfigurationValidationFailed";

function addProtocol(serverAddress: ServerAddress | undefined): (serverString: string) => string {
    return function (serverString: string): string {
        if(!serverAddress || !serverAddress.protocol || serverAddress.protocol == `http`)
            return `http://`;
        else if(serverAddress.protocol == `https`)
            return `https://`;
        else throw new Error(`Configuration Error: given protocol '${serverAddress.protocol}' is unknown. Use 'http' or 'https' instead.`)
    }
}

function addHostName(serverAddress: ServerAddress | undefined): (serverString: string) => string {
    return function (serverString: string): string {
        if(! serverAddress || !serverAddress.hostname)
            return `${serverString}localhost`;

        if(typeof serverAddress.hostname !== `string`) // just in case it is used with javascript and not typescript
            throw ConfigurationValidationFailed.forAttribute(`ServerConfig.serverAddress.hostname`)
                .got(`type of value: ${typeof serverAddress.hostname}`)
                .expected(`a <string>`);

        return `${serverString}${serverAddress.hostname.replace(/^\/+|\/+$/g, ``)}`
    }
}

function addPort(serverAddress: ServerAddress | undefined): (serverString: string) => string {
    return function (serverString: string): string {
        if(!serverAddress)
            return `${serverString}:4444`;

        if(serverAddress.protocol == `https` && !serverAddress.port)
            return `${serverString}:443`;

        if(!serverAddress.port)
            return `${serverString}:4444`;

        if(typeof serverAddress.port !== `number`)
            throw ConfigurationValidationFailed.forAttribute(`ServerConfig.serverAddress.port`)
                .got(`attribute type: ${typeof serverAddress.port}`)
                .expected(`attribute type number`);

        if(serverAddress.port < 0 || serverAddress.port > 65535)
            throw ConfigurationValidationFailed.forAttribute(`ServerConfig.serverAddress.port`)
                .got(`port ${serverAddress.port}`)
                .expected(`port in range 0 - 65535`);

        return `${serverString}:${serverAddress.port}`
    }
}

function addPath(serverAddress: ServerAddress | undefined): (serverString: string) => string {
    return function (serverString: string): string {

        if(!serverAddress || serverAddress.path == undefined || serverAddress.path == null)
            return `${serverString}/wd/hub`;

        if(serverAddress.path == ``)
            return `${serverString}`;

        return `${serverString}${serverAddress.path}`;
    }
}

export function getServerUrl(serverAddress: ServerAddress | undefined): string {

    return fp.flow(
        addProtocol(serverAddress),
        addHostName(serverAddress),
        addPort(serverAddress),
        addPath(serverAddress)
    )(``)
}