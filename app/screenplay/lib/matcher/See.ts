import {AnswersQuestions} from "../../Actor";
import {Question}         from "./Question";
import {Oracle}           from "../actions/Activities";

export class See<U> implements Oracle {
    matcher: (value: U) => any;

    static if <T>(question: Question<T>): See<T> {
        return new See(question)
    }

    fulfills(matcher: (text: U) => any): See<U> {
        this.matcher = matcher;
        return this;
    }

    constructor(
        private question: Question<U>
    ) {}

    async performAs(actor: AnswersQuestions): Promise<void> {
        return await (this.matcher(await actor.toAnswer(this.question)))
    }
}