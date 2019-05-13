import {AnswersQuestions} from "../../Actor";
import {Question}         from "./Question";
import {Oracle}           from "../actions/Activities";

export class Extract<U> implements Oracle {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private matcher: (value: U) => any;

    public static the <T>(question: Question<T>): Extract<T> {
        return new Extract(question)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public by(matcher: (text: U) => any): Extract<U> {
        this.matcher = matcher;
        return this;
    }

    private constructor(
        private question: Question<U>
    ) {}

    public async performAs(actor: AnswersQuestions): Promise<void> {
        return (this.matcher(await actor.toAnswer(this.question)))
    }
}