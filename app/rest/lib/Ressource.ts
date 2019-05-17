export class On{
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