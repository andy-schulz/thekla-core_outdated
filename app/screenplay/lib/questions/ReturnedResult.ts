import {Question}            from "../../lib/questions/Question";
import {UsesAbilities}       from "../../Actor";

export class ReturnedResult<PT> implements Question<PT,PT> {
    private value: PT | undefined;

    public static ofLastActivity<PT>(): ReturnedResult<PT>  {
        return new ReturnedResult()
    }

    public static ofDirectValue<PT>(value: PT): ReturnedResult<PT> {
        return new ReturnedResult<PT>(value)
    }


    public answeredBy(actor: UsesAbilities, activityResult: PT): Promise<PT> {
        return this.value ? Promise.resolve(this.value) : Promise.resolve(activityResult);
    }

    private constructor(value?: PT) {
        this.value = value;
    }
}