import {DesiredCapabilities, ServerConfig}  from "../..";
import {transformToWdioConfig}              from "../../driver/lib/config/config_transformation";
import Options = WebDriver.Options;

describe(`creating the wdio config`, (): void => {

    describe(`with pupulated cloud information`, function () {

        it(`should set user and key in wdio config
        - (test case id: 2643fb6e-0d7c-45c1-9529-39b39a099b32)`, (): void => {

            const serverConfig: ServerConfig = {
                user: `user`,
                key: `key`
            };

            const capabilities: DesiredCapabilities = {
                browserName: process.env.BROWSERNAME ? process.env.BROWSERNAME : `chrome`
            };

            const expected = {
                user: `user`,
                key: `key`,
                capabilities: {browserName: process.env.BROWSERNAME ? process.env.BROWSERNAME : `chrome`}
            };

            expect(transformToWdioConfig(serverConfig, capabilities)).toEqual(expected)
        });
    });

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
            const serverConfig: ServerConfig = {};

            const capabilities: DesiredCapabilities = {
                browserName: `chrome`,
                proxy: {
                    proxyType: `direct`
                }
            };

            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore // bug in webdriver: "direct" is not defined for option ... typings says "noproxy"
            expect(transformToWdioConfig(serverConfig, capabilities)).toEqual({
                capabilities: {
                    browserName: `chrome`,
                    proxy: {
                        proxyType: `direct`,
                    }
                }
            })
        });

        it(`should set system when system is given 
        - (test case id: b4f498d9-3f51-4a74-98ea-23a3f2c988ce)`, (): void => {
            const serverConfig: ServerConfig = {};

            const capabilities: DesiredCapabilities = {
                browserName: `chrome`,
                proxy: {
                    proxyType: `system`
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

    describe(`with chrome options`, (): void => {
        it(`should return the chrome options inside capabilities 
        - (test case id: e404f1b6-5171-4e47-a982-112228fb0e3a)`, (): void => {
            const serverConfig: ServerConfig = {};

            const capabilities: DesiredCapabilities = {
                browserName: `chrome`,
                "goog:chromeOptions": {
                    binary: `/doesNotExist`
                }
            };

            const expectedConf = {
                capabilities: {
                    browserName: `chrome`,
                    "goog:chromeOptions": {
                        binary: `/doesNotExist`
                    }
                }
            };

            const transformedOpts = transformToWdioConfig(serverConfig, capabilities);
            expect(transformedOpts).toEqual(expectedConf)
        });
    });

    describe(`with firefox options`, (): void => {
        it(`should return the firefox options inside capabilities 
        - (test case id: 62ae6161-4894-4d37-83bc-00ee8cfb56cb)`, (): void => {
            const serverConfig: ServerConfig = {};

            const capabilities: DesiredCapabilities = {
                "moz:firefoxOptions": {
                    binary: `/doesNotExist`
                }
            };

            const expectedConf = {
                capabilities: {
                    "moz:firefoxOptions": {
                        binary: `/doesNotExist`
                    }
                }
            };
            expect(transformToWdioConfig(serverConfig, capabilities)).toEqual(expectedConf)
        });
    });

    describe(`with appium options`, (): void => {

        it(`should return the options without general appium options set
        - (test case id: e42526bc-bdf9-4d26-9ff0-4fd009617460)`, (): void => {
            const serverConfig: ServerConfig = {};

            const capabilities: DesiredCapabilities = {
                platformName: `android`
            };

            const expectedConf = {
                capabilities: {
                    platformName: `android`
                }
            };
            expect(transformToWdioConfig(serverConfig, capabilities)).toEqual(expectedConf)

        });

        it(`should return the options when only appium options are set
        - (test case id: e42526bc-bdf9-4d26-9ff0-4fd009617460)`, (): void => {
            const serverConfig: ServerConfig = {};

            const capabilities: DesiredCapabilities = {
                appium: {
                    deviceName: `testdevice`
                }
            };

            const expectedConf = {
                capabilities: {
                    deviceName: `testdevice`
                }
            };
            expect(transformToWdioConfig(serverConfig, capabilities)).toEqual(expectedConf)

        });

        it(`should return the options when android options are set 
        - (test case id: 15127cfb-4f50-4a2a-b335-fd594995e4db)`, (): void => {
            const serverConfig: ServerConfig = {};

            const capabilities: DesiredCapabilities = {
                appium: {
                    deviceName: `testdevice`,
                    android: {
                        appPackage: `thePackage`
                    }
                }
            };

            const expectedConf = {
                capabilities: {
                    deviceName: `testdevice`,
                    appPackage: `thePackage`
                }
            };
            expect(transformToWdioConfig(serverConfig, capabilities)).toEqual(expectedConf)
        });

        it(`should return the options when iOS options are set 
        - (test case id: a76fe9b3-9a69-48b8-8d1c-e30e144f3300)`, (): void => {
            const serverConfig: ServerConfig = {};

            const capabilities: DesiredCapabilities = {
                appium: {
                    deviceName: `testdevice`,
                    ios: {
                        appName: `TheAppName`
                    }
                }
            };

            const expectedConf = {
                capabilities: {
                    deviceName: `testdevice`,
                    appName: `TheAppName`
                }
            };
            expect(transformToWdioConfig(serverConfig, capabilities)).toEqual(expectedConf)
        });
    });

    describe(`with BrowserStack options`, (): void => {

        it(`should return the options when browserstack options are set 
        - (test case id: eed4a856-609b-4058-b795-9814affcfa89)`, (): void => {
            const serverConfig: ServerConfig = {};

            const capabilities: DesiredCapabilities = {
                browserName: `firefox`,
                "bstack:options": {
                    userName: `myUser`,
                    accessKey: `myKey`,

                    os: `Windows`,
                    osVersion: `10`,

                    buildName: `1.2.3`,
                    sessionName: `myName`,
                    projectName: `MyProject`,
                    video: false,
                    local: true,
                    networkLogs: true,
                    seleniumVersion: `1.2.3`
                }
            };

            const expectedConf = {
                capabilities: {
                    browserName: `firefox`,
                    "bstack:options": {
                        userName: `myUser`,
                        accessKey: `myKey`,

                        buildName: `1.2.3`,
                        sessionName: `myName`,
                        projectName: `MyProject`,

                        os: `Windows`,
                        osVersion: `10`,

                        video: false,
                        local: true,
                        networkLogs: true,
                        seleniumVersion: `1.2.3`
                    }
                }
            };
            const opts = transformToWdioConfig(serverConfig, capabilities);
            expect(transformToWdioConfig(serverConfig, capabilities)).toEqual(expectedConf);
        });

        it(`should ignore an empty browserstack option set 
        - (test case id: 2feb0192-8c90-4270-a8c3-bd8f1be72cf9)`, (): void => {
            const serverConfig: ServerConfig = {};

            const capabilities: DesiredCapabilities = {
                browserName: `firefox`,
                browserStack: {
                    user: `MyUser`,
                    key: `MyKey`
                }
            };

            const expectedConf = {
                capabilities: {
                    browserName: `firefox`,
                    userName: `MyUser`,
                    accessKey: `MyKey`,
                }
            };

            expect(transformToWdioConfig(serverConfig, capabilities)).toEqual(expectedConf)
        });
    });
});