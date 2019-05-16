export interface SeleniumConfig {
    seleniumServerAddress: string;
    baseUrl?: string;
    multiBrowserTest?: boolean;

    /**
     * mark the elements the driver is about to interact with
     */
    annotateElement?: boolean;

    /**
     * display (inject) the test messages
     */
    displayTestMessages?: boolean;
}



