/* eslint-disable quotes*/
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
    protocol?: "http" | "https";
    port?: number;
    path?: string;
}

export type LogLevel =  "trace" | "debug" | "info" | "warn" | "error" | "silent";

export interface AutomationFramework {
    type?: "wdio";
    logLevel?: LogLevel;
}
