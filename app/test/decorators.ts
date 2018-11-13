export function PropertyDecorator(
    target: any,
    propertyKey: string,
) {
    console.log(
        `Decorating property ${propertyKey}` +
        ` from ${target.constructor.name}`,
    );
}

export function FindBy(name: string) {
    return function (
        target: any,
        propertyKey: string,
    ) {
        console.log(
            `Decorating property ${propertyKey}` +
            ` from ${target.constructor.name}` +
            ` search string: ${name}`,
        );
    }
}


class GoogleSearchPO {
    public url: string = "www.google.de";

    @FindBy("css")
    public searchField: string = "Test";
}