export function PropertyDecorator(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: any,
    propertyKey: string,
): void {
    console.log(
        `Decorating property ${propertyKey}` +
        ` from ${target.constructor.name}`,
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FindBy(name: string): (target: any, propertyKey: string) => void {
    return function (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        target: any,
        propertyKey: string,
    ): void {
        console.log(
            `Decorating property ${propertyKey}` +
            ` from ${target.constructor.name}` +
            ` search string: ${name}`,
        );
    }
}


// class GoogleSearchPO {
//     public url: string = "www.google.de";
//
//     @FindBy("css")
//     public searchField: string = "Test";
// }