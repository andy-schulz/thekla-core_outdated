export class On{
    public function: string | Function = "";
    public args: any[];
    public searchText: string = "";

    constructor(
        public resource: string) {
    }

    public static ressource(resource: string): On {
        return new On(resource);
    }

    public toString() {
        return `${this.resource}`
    }
}