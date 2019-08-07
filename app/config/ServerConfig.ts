export type AutomationFramework = "wdjs" | "wdio" // eslint-disable-line quotes

export interface ServerConfig {
    serverAddress?: ServerAddress;

    baseUrl?: string;

    multiBrowserTest?: boolean;

    automationFramework?: AutomationFramework;

    /**
     * mark the elements the driver is about to interact with
     */
    annotateElement?: boolean;

    /**
     * display (inject) the test messages
     */
    displayTestMessages?: boolean;

}

export interface ServerAddress {
    hostname?: string;
    // eslint-disable-next-line
    protocol?: "http" | "https";
    port?: number;
    path?: string;
}

