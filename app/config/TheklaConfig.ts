export interface TheklaConfig {
    seleniumConfig?: SeleniumConfig;
    restConfig?: RestConfig;
    params?: {
        [key: string]: string | object
    };
}

export interface SeleniumConfig {
    multiBrowserTest?: boolean;
    capabilities: Capabilities[] | CapabilitiesFunction;
}

type CapabilitiesFunction = () => Capabilities[]

export interface Capabilities {
    [key: string]: any;

    browserName: string;
    seleniumServerAddress?: string;
    baseUrl?: string;


    firefoxConfig?: {
        path: string
    };

    chromeConfig?: {
        path: string;
    };
}

export interface RestConfig {}