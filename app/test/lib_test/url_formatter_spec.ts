import {ServerAddress} from "../../config/ServerConfig";
import {getServerUrl}  from "../../driver/lib/config/url_formatter";

describe(`creating the url`, (): void => {

    describe(`from an empty serverAddress`, (): void => {
        it(`should return the standard selenium location 
        - (test case id: 74226fcd-1475-4196-8a56-4954ca6134bc)`, (): void => {
            expect(getServerUrl(undefined)).toEqual(`http://localhost:4444/wd/hub`)
        });
    });

    describe(`from standard values`, (): void => {
        it(`should return the standard selenium address 
        - (test case id: b0728e7d-f1cd-4109-8610-9751938b4f44)`, (): void => {
            const serverAddress: ServerAddress = {
                hostname: `my.hostname.test`
            };
            expect(getServerUrl(serverAddress)).toEqual(`http://my.hostname.test:4444/wd/hub`)
        });
    });

    describe(`from hostname`, (): void => {
        it(`should return the standard selenium address 
        - (test case id: 55a16a8e-0a6e-469f-88ff-9b766a58de13)`, (): void => {
            const serverAddress: ServerAddress = {
                hostname: ``
            };
            expect(getServerUrl(serverAddress)).toEqual(`http://localhost:4444/wd/hub`)
        });

        it(`should trim trailing / from hostname 
        - (test case id: db49560f-dc28-418f-9dcc-13eae1d4fe33)`, (): void => {
            const serverAddress: ServerAddress = {
                hostname: `my.hostname.com/`
            };

            expect(getServerUrl(serverAddress)).toEqual(`http://my.hostname.com:4444/wd/hub`);

            const serverAddress2: ServerAddress = {
                hostname: `my.hostname.com//`
            };

            expect(getServerUrl(serverAddress2)).toEqual(`http://my.hostname.com:4444/wd/hub`);
        });
    });

    describe(`from protocol`, (): void => {
        it(`should add the http protocol to the server string 
        - (test case id: 389151db-0f51-43b7-8512-55fed690a695)`, (): void => {
            const serverAddress: ServerAddress = {
                hostname: `my.hostname.com`,
                protocol: "http" //eslint-disable-line
            };

            expect(getServerUrl(serverAddress)).toEqual(`http://my.hostname.com:4444/wd/hub`)
        });

        it(`should add the https protocol and port 443 to the server string 
        - (test case id: 389151db-0f51-43b7-8512-55fed690a695)`, (): void => {
            const serverAddress: ServerAddress = {
                hostname: `my.hostname.com`,
                protocol: "https" //eslint-disable-line
            };

            expect(getServerUrl(serverAddress)).toEqual(`https://my.hostname.com:443/wd/hub`)
        });
    });

    describe(`from path`, (): void => {
        it(`should omit the path when it is set to '' 
        - (test case id: bf583ccb-ef3d-43b2-987e-ae614a4f13cf)`, (): void => {
            const serverAddress: ServerAddress = {
                hostname: `my.hostname.com`,
                path: ``
            };

            expect(getServerUrl(serverAddress)).toEqual(`http://my.hostname.com:4444`)
        });
    });

    describe(`from protocol and port`, (): void => {
        it(`should set the given port even with https set 
        - (test case id: c32163c7-83f9-4188-b399-e6a8b978563f)`, (): void => {
            const serverAddress: ServerAddress = {
                hostname: `my.hostname.com`,
                protocol: `https`,
                port: 1234
            };

            expect(getServerUrl(serverAddress)).toEqual(`https://my.hostname.com:1234/wd/hub`)
        });
    })
});