export interface SeleniumConfig {
    multiBrowserTest?: boolean;
    capabilities: Capabilities | Capabilities[] | CapabilitiesFunction;
}

type CapabilitiesFunction = () => Capabilities[]

export interface Capabilities {
    [key: string]: any;

    browserName: string;
    seleniumServerAddress?: string;
    baseUrl?: string;

    proxy?: ProxyConfig;

    firefoxConfig?: {
        path: string
    };

    chromeConfig?: {
        path: string;
    };
}

export interface ProxyConfig {
    type: "direkt" | "system" | "manual";
    manualConfig?: ManualProxyConfig;
}
export interface ManualProxyConfig {
    default?: string;
    ftp?: string;
    http?: string;
    https?: string;
    bypass?: string[]
}

export interface RestConfig {}