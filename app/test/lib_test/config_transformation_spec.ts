import {DesiredCapabilities}   from "../../config/DesiredCapabilities";
import {ServerConfig}          from "../../config/ServerConfig";
import {transformToWdioConfig} from "../../driver/lib/config/config_transformation";

describe(`creating the wdio config`, (): void => {
    describe(`with no serverAddress values`, (): void => {
        it(`should return an object only containing the capabilities (serverAddress is undefined)
        - (test case id: c84c4b74-fd06-413c-b402-5a8265c439bf)`, (): void => {
            const serverConfig: ServerConfig = {};

            const capabilities: DesiredCapabilities = {
                browserName: process.env.BROWSERNAME ? process.env.BROWSERNAME : `chrome`
            };

            expect(transformToWdioConfig(serverConfig, capabilities))
                .toEqual({capabilities: {browserName: process.env.BROWSERNAME ? process.env.BROWSERNAME : `chrome`}})
        });

        it(`should return an object only containing the capabilities (serverAddress is empty)
        - (test case id: c9363f5f-095d-4128-90e2-e28aefbb4279)`, (): void => {
            const serverConfig: ServerConfig = {
                serverAddress: {}
            };

            const capabilities: DesiredCapabilities = {
                browserName: process.env.BROWSERNAME ? process.env.BROWSERNAME : `chrome`
            };

            expect(transformToWdioConfig(serverConfig, capabilities))
                .toEqual({capabilities: {browserName: process.env.BROWSERNAME ? process.env.BROWSERNAME : `chrome`}})
        });

        it(`should return an object only containing the capabilities (serverAddress contains empty values)
        - (test case id: 516bdcf4-7450-4915-b88c-a892ff69d87e)`, (): void => {
            const serverConfig: ServerConfig = {
                serverAddress: {
                    hostname: undefined,
                    port: undefined,
                    protocol: undefined,
                    path: undefined,
                }
            };

            const capabilities: DesiredCapabilities = {
                browserName: process.env.BROWSERNAME ? process.env.BROWSERNAME : `chrome`
            };

            expect(transformToWdioConfig(serverConfig, capabilities))
                .toEqual({capabilities: {browserName: process.env.BROWSERNAME ? process.env.BROWSERNAME : `chrome`}})
        });
    });

    describe(`with an populated serverAddress`, () => {
        it(`should return an object containing all address values 
        - (test case id: f09ca2bd-d6d1-4dba-9a46-e3bad8e8165b)`, () => {
            const serverConfig: ServerConfig = {
                serverAddress: {
                    hostname: `my.hostname.com`,
                    port: 1234,
                    protocol: `https`,
                    path: `/test/all`,
                }
            };

            const capabilities: DesiredCapabilities = {
                browserName: `chrome`
            };

            expect(transformToWdioConfig(serverConfig, capabilities))
                .toEqual({
                    hostname: `my.hostname.com`,
                    port: 1234,
                    protocol: `https`,
                    path: `/test/all`,
                    capabilities: {browserName: `chrome`}
                })
        });
    });

    describe(`with a proxy property`, (): void => {
        it(`should set noproxy when direct is given 
        - (test case id: 8d140c38-25e7-4896-8b53-043324aef4b7)`, (): void => {
            const serverConfig: ServerConfig = {
            };

            const capabilities: DesiredCapabilities = {
                browserName: process.env.BROWSERNAME ? process.env.BROWSERNAME : `chrome`,
                proxy: {
                    type: `direct`
                }
            };

            expect(transformToWdioConfig(serverConfig, capabilities))
                .toEqual({
                    capabilities: {
                        browserName: `chrome`,
                        proxy: {
                            proxyType: `noproxy`
                        }
                    }
                })
        });

        it(`should set system when system is given 
        - (test case id: b4f498d9-3f51-4a74-98ea-23a3f2c988ce)`, (): void => {
            const serverConfig: ServerConfig = {
            };

            const capabilities: DesiredCapabilities = {
                browserName: process.env.BROWSERNAME ? process.env.BROWSERNAME : `chrome`,
                proxy: {
                    type: `system`
                }
            };

            expect(transformToWdioConfig(serverConfig, capabilities))
                .toEqual({
                    capabilities: {
                        browserName: `chrome`,
                        proxy: {
                            proxyType: `system`
                        }
                    }
                })
        });
    });
});