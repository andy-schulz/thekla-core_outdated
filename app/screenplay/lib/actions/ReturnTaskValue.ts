import {Task} from "./Activities";

export class ReturnTaskValue<PT> extends Task<void, PT>{

    public performAs(): Promise<PT> {
        return Promise.resolve(this.value);
    }

    public static of<SPT>(value: SPT): ReturnTaskValue<SPT> {
        return new ReturnTaskValue(value);
    }

    private constructor(private value: PT) {
        super();
    }
}