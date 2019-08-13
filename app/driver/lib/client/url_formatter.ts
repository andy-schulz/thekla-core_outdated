import {ServerConfig} from "../../../config/ServerConfig";

export const formatNavigateToUrl = (serverConfig: ServerConfig, url: string): string => {
    return serverConfig.baseUrl && !url.startsWith(`http`) ? `${serverConfig.baseUrl}${url}` : url;
};