export class On{
    public function: string | Function = ``;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public args: any[];
    public searchText: string = ``;

    private constructor(
        public resource: string) {
    }

    public static resource(resource: string): On {
        return new On(resource);
    }

    public toString(): string {
        return `${this.resource}`
    }
}