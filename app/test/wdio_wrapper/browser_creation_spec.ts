import {ClientWdio}                                 from "../../driver/wdio/ClientWdio";
import {Browser, DesiredCapabilities, ServerConfig} from "../..";

const conf: ServerConfig = {
    serverAddress: {
        hostname: `localhost`
    },
};

const capabilities: DesiredCapabilities = {
    browserName: `chrome`,
};

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe(`When using the ClientWdio class`, (): void => {
    beforeAll(async (): Promise<void> => {
        await ClientWdio.cleanup();
    }, 10000);

    afterEach(async (): Promise<void> => {
        await ClientWdio.cleanup();
    }, 10000);

    describe(`to start a single client`, (): void => {
        it(`with an empty client name, it should throw an invalid client name error ` +
            `- (test case id: 60ec6b4a-0e3b-4372-8ff4-30f2208476ba)`, (): void => {
            try {
                ClientWdio.create(conf,capabilities, ``);
                expect(true).toBeFalsy(`Creating a client with an empty string should throw an error, but it doesnt`);
            } catch (e) {
                expect(e.toString()).toContain(`invalid client name ''`);
            }
        }, 20000);

        it(`with invalid client name characters, it should throw an invalid character error ` +
            `- (test case id: cbbc5a1b-efe9-4152-800e-dab0a1ba5d8b)`, (): void => {
            const clientNames: string[] = [`A1 2`, `!test`, `$Test`, `A123 `];

            clientNames.map(async (clientName: string): Promise<void> => {
                try {
                    ClientWdio.create(conf, capabilities, clientName);
                    expect(true). toBeFalsy(`Creating a client with invalid characters should throw an error, but it doesnt!`);
                }
                catch (e) {expect(e.toString()).toMatch(/^Error: client name (.*) contains invalid characters. Allowed characters are: (.*)/)}

            });
        }, 20000);

        it(`without a name,it should be created with a default name ` +
            `- (test case id: 92f1df53-f16e-4e7d-9def-340910a2d054)`, (): void => {
            const client: Browser = ClientWdio.create(conf, capabilities);

            expect(ClientWdio.availableClients.length).toBe(1, `length check for # of client in ClientWdio failed`);
            expect(ClientWdio.availableClients[0]).toBe(`client1`);
            expect(ClientWdio.getClient(`client1`)).toEqual(client);
        }, 20000);

        it(`with a name, it should set this name ` +
            `- (test case id: f2e8b6f5-d639-445c-95a6-ce2ebd82a1ed)`, (): void => {
            const client: Browser = ClientWdio.create(conf, capabilities, `theNewClientName`);

            expect(ClientWdio.availableClients.length).toBe(1, `length check for # of client in ClientWdio failed`);
            expect(ClientWdio.availableClients[0]).toBe(`theNewClientName`);
            expect(ClientWdio.getClient(`theNewClientName`)).toEqual(client);

        }, 20000);

        it(`with a name and an client instance, it should set this name ` +
            `- (test case id: f2e8b6f5-d639-445c-95a6-ce2ebd82a1ed)`, async (): Promise<void> => {
            const client: Browser = ClientWdio.create(conf, capabilities, `theNewClientName`);
            await client.get(`http://framework-tester.test-steps.de`);

            expect(ClientWdio.availableClients.length).toBe(1, `length check for # of client in ClientWdio failed`);
            expect(ClientWdio.availableClients[0]).toBe(`theNewClientName`);
            expect(ClientWdio.getClient(`theNewClientName`)).toEqual(client);

        }, 20000);
    });

    describe(`to start multiple clients`, (): void => {
        it(`without a name, they should be created with a default name ` +
            `- (test case id: 126d1e0a-1b89-4d74-8774-69c0f446084c)`,(): void => {
            const client1: Browser = ClientWdio.create(conf, capabilities);
            const client2: Browser = ClientWdio.create(conf, capabilities);

            expect(ClientWdio.availableClients.length).toBe(2, `length check for # of client in ClientWdio failed`);
            expect(ClientWdio.availableClients[0]).toBe(`client1`);
            expect(ClientWdio.availableClients[1]).toBe(`client2`);
            expect(ClientWdio.getClient(`client1`)).toEqual(client1);
            expect(ClientWdio.getClient(`client2`)).toEqual(client2);
        }, 20000);

        it(`and only the first client gets a name, the second client should get a default name ` +
            `- (test case id: 83b28cf5-7fba-4597-b5ec-64495caa5053)`, (): void => {
            const client1: Browser = ClientWdio.create(conf, capabilities, `theFirstclient`);
            const client2: Browser = ClientWdio.create(conf, capabilities);

            expect(ClientWdio.availableClients.length).toBe(2, `length check for # of client in ClientWdio failed`);
            expect(ClientWdio.availableClients[0]).toBe(`theFirstclient`);
            expect(ClientWdio.availableClients[1]).toBe(`client2`);
            expect(ClientWdio.getClient(`theFirstclient`)).toEqual(client1);
            expect(ClientWdio.getClient(`client2`)).toEqual(client2);

        }, 20000);

        it(`and only the second client gets a name, the first client should get a default name ` +
            `- (test case id: 83b28cf5-7fba-4597-b5ec-64495caa5053)`, (): void => {
            const client1: Browser = ClientWdio.create(conf, capabilities);
            const client2: Browser = ClientWdio.create(conf, capabilities, `theSecondclient`);

            expect(ClientWdio.availableClients.length).toBe(2, `length check for # of client in ClientWdio failed`);
            expect(ClientWdio.availableClients[0]).toBe(`client1`);
            expect(ClientWdio.availableClients[1]).toBe(`theSecondclient`);
            expect(ClientWdio.getClient(`client1`)).toEqual(client1);
            expect(ClientWdio.getClient(`theSecondclient`)).toEqual(client2);
        },20000);

        it(`and both client get a name, they should be set ` +
            `- (test case id: 83b28cf5-7fba-4597-b5ec-64495caa5053)`, (): void => {
            const client1: Browser = ClientWdio.create(conf, capabilities,`theFirstclient`);
            const client2: Browser = ClientWdio.create(conf, capabilities,`theSecondclient`);

            expect(ClientWdio.availableClients.length).toBe(2, `length check for # of client in ClientWdio failed`);
            expect(ClientWdio.availableClients[0]).toBe(`theFirstclient`);
            expect(ClientWdio.availableClients[1]).toBe(`theSecondclient`);
            expect(ClientWdio.getClient(`theFirstclient`)).toEqual(client1);
            expect(ClientWdio.getClient(`theSecondclient`)).toEqual(client2);
        }, 20000);
    });

    describe(`to delete a single client`, (): void => {

        afterEach(async (): Promise<void> => {
            await ClientWdio.cleanup();
        });

        it(`the client map should be empty when the client is deleted ` +
            `- (test case id: 7125c259-247f-4535-a94a-e753a82c1582)`, async (): Promise<void> => {
            const client = ClientWdio.create(conf, capabilities);

            expect(ClientWdio.availableClients.length).toBe(1,
                `After creating a client the length should be 1 but its not.`);
            await ClientWdio.cleanup([client]);
            expect(ClientWdio.availableClients.length).toBe(0,
                `After deleting the sole client the # of available client should be 0 but its not`);
        });
    });

    describe(`to delete multiple clients`, (): void => {
        let client1: Browser;
        let client2: Browser;
        let client3: Browser;
        let client4: Browser;

        beforeEach((): void => {
            client1 = ClientWdio.create(conf, capabilities, `client_1`);
            client2 = ClientWdio.create(conf, capabilities, `client_2`);
            client3 = ClientWdio.create(conf, capabilities, `client_3`);
            client4 = ClientWdio.create(conf, capabilities, `client_4`);
        });

        afterEach(async (): Promise<void> => {
            await ClientWdio.cleanup();
        });

        it(`at once should remove the client form the list ` +
            `- (test case id: f6ee38b0-22a9-4eb2-a9d6-7e98c635550f)`, async (): Promise<void> => {
            expect(ClientWdio.availableClients.length).toEqual(4,
                `4 clients should be available`);
            await ClientWdio.cleanup([client1, client2, client4]);
            expect(ClientWdio.availableClients.length).toEqual(1,
                `deleting 3 of 4 clients shall lead to 1 remaining client`);
            expect(ClientWdio.availableClients).toEqual([`client_3`]);
        }, 20000);

        it(`after another should remove the client from the client map ` +
            `- (test case id: 343a1085-4414-4e2c-8f42-c76545462dcb)`, async (): Promise<void> => {
            expect(ClientWdio.availableClients.length).toEqual(4,
                `4 clients should be available`);

            // remove the first client
            await ClientWdio.cleanup([client2]);
            expect(ClientWdio.availableClients.length).toEqual(3,
                `deleting 1 of 4 clients shall lead to 3 remaining clients`);
            expect(ClientWdio.availableClients).toEqual([`client_1`, `client_3`,`client_4`]);

            // remove the second client
            await ClientWdio.cleanup([client4]);
            expect(ClientWdio.availableClients.length).toEqual(2,
                `deleting 1 of 3 clients shall lead to 2 remaining clients`);
            expect(ClientWdio.availableClients).toEqual([`client_1`, `client_3`]);

            // remove the third client
            await ClientWdio.cleanup([client1]);
            expect(ClientWdio.availableClients.length).toEqual(1,
                `deleting 1 of 2 clients shall lead to 1 remaining client`);
            expect(ClientWdio.availableClients).toEqual([`client_3`]);
        }, 20000);


        it(`which dont exist, should not change the client map ` +
            `- (test case id: 8e74188b-0a1a-41d0-ad2b-188a9a5884e4)`, async (): Promise<void> => {
            expect(ClientWdio.availableClients.length).toEqual(4,
                `4 clients should be available`);

            // remove 2 client
            await ClientWdio.cleanup([client2, client4]);
            expect(ClientWdio.availableClients.length).toEqual(2,
                `deleting 2 of 4 clients shall lead to 2 remaining clients`);
            expect(ClientWdio.availableClients).toEqual([`client_1`, `client_3`]);

            // remove the same client
            await ClientWdio.cleanup([client2, client4]);
            expect(ClientWdio.availableClients.length).toEqual(2,
                `deleting non existing client shall not change the client list`);
            expect(ClientWdio.availableClients).toEqual([`client_1`, `client_3`]);

            // remove the same client
            await ClientWdio.cleanup([client2]);
            expect(ClientWdio.availableClients.length).toEqual(2,
                `deleting non existing client shall not change the client list`);
            expect(ClientWdio.availableClients).toEqual([`client_1`, `client_3`]);

            // remove the same client
            await ClientWdio.cleanup([client4]);
            expect(ClientWdio.availableClients.length).toEqual(2,
                `deleting non existing client shall not change the client list`);
            expect(ClientWdio.availableClients).toEqual([`client_1`, `client_3`]);
        }, 20000);
    });

});