import {
    ReturnTaskValue,
    See,
    ReturnedResult,
    Actor,
    Expected,
    Question, DelayedResult
} from "../../..";



describe(`Using the See interaction`, (): void => {
    const Josh = Actor.named(`Josh`);

    describe(`with repeater method`, (): void => {
        let John: Actor = Actor.named(`John`);

        it(`should throw an error when the repeater 'times' value is 0. ` +
            `- (test case id: e0e5340d-294f-4795-ab31-08a3a71c58a4)`, async (): Promise<void> => {
            const testString = `e0e5340d-294f-4795-ab31-08a3a71c58a4`;

            try {
                await John.attemptsTo(
                    See.if(DelayedResult.returnsValue(testString).after(10000))
                        .is(Expected.toEqual(testString))
                        .repeatFor(0,500)
                )
            } catch (e) {
                expect(e.toString()).toContain(`The repeat 'times' value should be between 1 and 1000. But its: 0`)
            }
        });

        it(`should throw an error when the repeater 'times' value is less then 0.
            - (test case id: 7908172d-940c-4828-91c4-aee20f9141d7)`, async (): Promise<void> => {
            const testString = `7908172d-940c-4828-91c4-aee20f9141d7`;

            try {
                await John.attemptsTo(
                    See.if(DelayedResult.returnsValue(`Error`).after(10000))
                        .is(Expected.toEqual(testString))
                        .repeatFor(-1,1000)
                )
            } catch (e) {
                expect(e.toString()).toContain(`The repeat 'times' value should be between 1 and 1000. But its: -1`)
            }
        });

        it(`should throw an error when the repeater 'times' value is greater than 1000.
            - (test case id: f8eea631-5473-44d1-9005-a1e7d8e3ef36)`, async (): Promise<void> => {
            const testString = `f8eea631-5473-44d1-9005-a1e7d8e3ef36`;

            try {
                await John.attemptsTo(
                    See.if(DelayedResult.returnsValue(`Error`).after(10000))
                        .is(Expected.toEqual(testString))
                        .repeatFor(1001,1000)
                )
            } catch (e) {
                expect(e.toString()).toContain(`The repeat 'times' value should be between 1 and 1000. But its: 1001`)
            }
        });

        it(`should throw an error when the repeater 'interval' value is less than 0
            - (test case id: 0676e29a-529e-474c-8413-da4c29897ab5)`, async (): Promise<void> => {
            const testString = `0676e29a-529e-474c-8413-da4c29897ab5`;
            try {
                await John.attemptsTo(
                    See.if(DelayedResult.returnsValue(`Error`).after(10000))
                        .is(Expected.toEqual(testString))
                        .repeatFor(2,-1)
                )
            } catch (e) {
                expect(e.toString()).toContain(`The interval value should be between 1 and 60000 ms (1 minute). But its: -1`)
            }
        });

        it(`should throw an error when the repeater 'interval' value is greater than 60000
            - (test case id: 17b6dc70-44bd-4f6f-b051-b1bce4776c4c)`, async (): Promise<void> => {
            const testString = `17b6dc70-44bd-4f6f-b051-b1bce4776c4c`;
            try {
                await John.attemptsTo(
                    See.if(DelayedResult.returnsValue(`Error`).after(10000))
                        .is(Expected.toEqual(testString))
                        .repeatFor(6,60001)
                )
            } catch (e) {
                expect(e.toString()).toContain(`The interval value should be between 1 and 60000 ms (1 minute). But its: 60001`)
            }
        });

        it(`should pass without a repeater action` +
            `- (test case id: 6458382e-d95d-49b6-972c-56fa68bede94)`, async (): Promise<void> => {
            await John.attemptsTo(
                See.if(ReturnedResult.ofDirectValue(`12345`))
                    .is(Expected.toEqual(`12345`))
            )
        });

        it(`should poll the status until the value is set` +
            `- (test case id: 0d5c98b2-9975-4c30-a81f-5a8ef862a0aa)`, async (): Promise<void> => {
            const testString = `0d5c98b2-9975-4c30-a81f-5a8ef862a0aa`;

            await John.attemptsTo(
                See.if(DelayedResult.returnsValue(testString).after(1000))
                    .is(Expected.toEqual(testString))
                    .repeatFor(12,100)
            )
        });

        it(`should poll the status and throws an error after the maximum number of tries is reached
            - (test case id: b1afa0cd-bb66-432a-b6d3-755b422d6506)`, async (): Promise<void> => {
            const testString = `b1afa0cd-bb66-432a-b6d3-755b422d6506`;

            try {
                await John.attemptsTo(
                    See.if(DelayedResult.returnsValue(testString).after(1000))
                        .is(Expected.toEqual(testString))
                        .repeatFor(5,100)
                );
                expect(true).toBeFalsy(`call should have thrown an error. But it did not.`);
            } catch (e) {
                expect(e.toString()).toContain(
                    `AssertionError [ERR_ASSERTION]: 'Default value. Timeout of 1000 ms not reached. Second value not set yet.' === 'b1afa0cd-bb66-432a-b6d3-755b422d6506'`)
            }

        });

        it(`should throw an error on first` +
            `- (test case id: 29bbbf6f-4741-48fb-9c44-7ecec23d1240)`, async (): Promise<void> => {
            const testString =`29bbbf6f-4741-48fb-9c44-7ecec23d1240`;
            try {
                await John.attemptsTo(
                    See.if(DelayedResult.returnsValue(testString).after(1000))
                        .is(Expected.toEqual(testString))
                );
                expect(true).toBeFalsy(`call should have thrown an error. But it did not.`)

            } catch (e) {
                expect(e.toString()).toContain(`AssertionError [ERR_ASSERTION]: 'Default value. Timeout of 1000 ms not reached. Second value not set yet.' === '29bbbf6f-4741-48fb-9c44-7ecec23d1240'`)
            }

        });
    });

    describe(`with the then method`, (): void => {

        it(`should be rejected if matcher returns false
            - (test case id: 18ef8895-a0a2-4e5b-a3b6-60068378b54f)`,(): Promise<void | {}> => {
            const testString = `18ef8895-a0a2-4e5b-a3b6-60068378b54f`;
            return Josh.attemptsTo(
                See
                    .if(DelayedResult.returnsValue(testString).after(0))
                    .is((): boolean => {
                        return false;
                    })
            ).then((): void => {
                expect(true).toBeFalsy(`Promise should be rejected but it wasn't`);
            }).catch((e): Promise<void> => {
                expect(e.toString()).toContain(`Matcher function of See Question called 'DelayedResult with timeout of 0 ms'`);
                expect(e.toString()).toContain(`returned false. No 'then' activities were given`);
                return Promise.resolve();
            })
        });

        it(`should be reject if matcher throws an error
            - (test case id: b206bc37-59c1-4bb8-b04d-eb1a7517ba19)`,(): Promise<void | {}> => {
            const testString = `b206bc37-59c1-4bb8-b04d-eb1a7517ba19`;

            return Josh.attemptsTo(
                See
                    .if(DelayedResult.returnsValue(testString).after(0))
                    .is((): boolean => {
                        throw new Error(`found a bug on See interaction`)
                    })
            ).then((): void => {
                expect(true).toBeFalsy(`Promise should be rejected but it wasn't`);
            }).catch((e): Promise<void> => {
                expect(e.toString()).toContain(`found a bug on See interaction`);
                return Promise.resolve();
            })
        });

        it(`should be resolved if matcher returns true
            - (test case id: 95d87af1-7376-4268-9d78-7a26a4ee15cf)`,(): Promise<void | {}> => {
            const testString = `95d87af1-7376-4268-9d78-7a26a4ee15cf`;

            return Josh.attemptsTo(
                See
                    .if(DelayedResult.returnsValue(testString).after(0))
                    .is((): boolean => {
                        return true;
                    })
            )
        });

        it(`should not throw an error on success in "then-tree"` +
            `- (test case id: b8d1361b-a9cc-4569-9009-ed8a71084fcd)`,(): Promise<void> => {
            const testString = `b8d1361b-a9cc-4569-9009-ed8a71084fcd`;
            try {
                return Josh.attemptsTo(
                    See
                        .if(DelayedResult.returnsValue(testString).after(0))
                        .is(Expected.toEqual(testString))
                        .then(
                            See
                                .if(DelayedResult.returnsValue(testString).after(0))
                                .is(Expected.toEqual(testString))
                        )
                );

            } catch (e) {
                console.error(e.toString());
                expect(true).toBeFalsy(`should not throw an error, but it did`);
                return Promise.resolve(e)
            }
        });

        it(`should throw error raised in "then-tree"` +
            `- (test case id: c8141330-3c00-43e2-828b-e574ccc366c2)`, async (): Promise<void> => {
            const testString = `c8141330-3c00-43e2-828b-e574ccc366c2`;
            try {
                await Josh.attemptsTo(
                    See
                        .if(ReturnedResult.ofDirectValue(testString))
                        .is(Expected.toEqual(testString))
                        .then(
                            See
                                .if(ReturnedResult.ofDirectValue(`Should: throw: `))
                                .is(Expected.toEqual(`Expectation error in then tree`))
                        )
                );
                expect(true).toBeFalsy(`should throw an error, but it didn't`);

            } catch (e) {
                expect(e.toString()).toContain(`'Should: throw: ' === 'Expectation error in then tree'`);
            }
        });

    });

    describe(`with the otherwise method`, (): void => {
        it(`should throw the first error when the otherwise-tree is empty` +
            `- (test case id: cd5b5dc9-a231-4f7c-9607-3f4fe0573f8d)`, async (): Promise<void> => {
            try {
                await Josh.attemptsTo(
                    See
                        .if(ReturnedResult.ofDirectValue(`Thrown error: `))
                        .is(Expected.toEqual(`in first See interaction`))
                        .otherwise(
                        )
                );
                expect(true).toBeFalsy(`call should have thrown an error. But it didn't.`)

            } catch (e) {
                expect(e.toString()).toContain(`'Thrown error: ' === 'in first See interaction'`)
            }

        });

        it(`should throw the error raised in "otherwise-tree"` +
            `- (test case id: b76d457a-5459-4479-a975-c0a9df9fb77c)`, async (): Promise<void> => {
            try {
                await Josh.attemptsTo(
                    See
                        .if(ReturnedResult.ofDirectValue(`Error thrown: `))
                        .is(Expected.toEqual(`in first see interaction tree`))
                        .otherwise(
                            See
                                .if(ReturnedResult.ofDirectValue(`Error thrown:`))
                                .is(Expected.toEqual(`in otherwise tree`))
                        )
                );

                expect(true).toBeFalsy(`should throw an error, but it didn't`);

            } catch (e) {
                expect(e.toString()).toContain(`'Error thrown:' === 'in otherwise tree'`);
            }
        });

        it(`should succeed when otherwise tree is not throwing an error` +
            `- (test case id: 77f977ee-d79d-4b8f-9890-a6e173659e01)`, async (): Promise<void> => {
            const testString = `77f977ee-d79d-4b8f-9890-a6e173659e01`;

            try {
                await Josh.attemptsTo(
                    See
                        .if(ReturnedResult.ofDirectValue(`Error thrown: `))
                        .is(Expected.toEqual(`in first See interaction`))
                        .otherwise(
                            See
                                .if(ReturnedResult.ofDirectValue(testString))
                                .is(Expected.toEqual(testString))
                        )
                );

            } catch (e) {
                expect(true).toBeFalsy(`call should not have thrown an error. But it did.`);
            }

        });
    });

    describe(`with a primitive String`, (): void => {
        it(`should pass the string to the matcher 
        - (test case id: e7007ed2-3a01-4c90-8c0e-dfbfb66737a5)`, (): Promise<void> => {
            const testString = `myString`;
            return Josh.attemptsTo(
                See
                    .if(ReturnedResult.ofDirectValue(testString))
                    .is((actual: string): boolean => {
                        expect(actual).toBe(testString);
                        return true;
                    })
            )
        });

        it(`should pass the object to the matcher 
        - (test case id: 5032d5aa-0cf1-437c-a7f5-995c9a676d23)`, (): Promise<void> => {
            const testObject = {
                val1: `a`,
                val2: `b`
            };
            
            return Josh.attemptsTo(
                See
                    .if(ReturnedResult.ofDirectValue(testObject))
                    .is((actual: {}): boolean => {
                        expect(actual).toEqual(testObject);
                        return true;
                    })
            )
        });
    });

    describe(`with the Result of the last Activity`, (): void => {
        it(`should succeed and pass the result to the Expected matcher 
        - (test case id: 782cbc05-aa9c-46ff-beac-639ba968547b)`, async (): Promise<void> => {

            await Josh.attemptsTo(
                ReturnTaskValue.of({a:1}),
                See
                    .if(ReturnedResult.ofLastActivity())
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .is((actual: any): boolean => {
                        expect(actual).toEqual({a:1});
                        return true;
                    })
            )
        });
    });
});