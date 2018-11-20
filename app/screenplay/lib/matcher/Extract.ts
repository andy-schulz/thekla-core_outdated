import {AnswersQuestions} from "../../Actor";
import {Question}         from "./Question";
import {Matcher}          from "../actions/Activities";

export class Extract<U> implements Matcher {
    matcher: (value: U) => any;

    static the <T>(question: Question<T>): Extract<T> {
        return new Extract(question)
    }

    by(matcher: (text: U) => any): Extract<U> {
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