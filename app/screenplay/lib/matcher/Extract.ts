import {AnswersQuestions} from "../../Actor";
import {Question}         from "../questions/Question";
import {Oracle}           from "../actions/Activities";

export class Extract<PT, EPT> implements Oracle<PT,void> {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private matcher: (value: EPT) => any;

    public static the <PT, QRT>(question: Question<PT, QRT>): Extract<PT,QRT> {
        return new Extract(question)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public by(matcher: (text: EPT) => void): Extract<PT,EPT> {
        this.matcher = matcher;
        return this;
    }

    private constructor(
        private question: Question<PT,EPT>
    ) {}

    public async performAs(actor: AnswersQuestions, activityResult: PT): Promise<void> {
        return (this.matcher(await actor.toAnswer(this.question, activityResult)))
    }
}