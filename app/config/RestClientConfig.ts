// eslint-disable-next-line @typescript-eslint/no-empty-interface
import {RequestPromiseOptions} from "request-promise-native";

export interface RestClientConfig {

    // eslint-disable-next-line quotes
    restClient?: "request";

    restClientOptions?: RequestPromiseOptions;
}