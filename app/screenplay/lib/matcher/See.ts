import {AnswersQuestions} from "../../Actor";
import {Question}         from "./Question";
import {Oracle}           from "../actions/Activities";

export class See<U> implements Oracle {
    matcher: (value: U) => boolean | Promise<boolean>;
    private repeater: number = 1;
    private ms: number = 1000;

    static if <T>(question: Question<T>): See<T> {
        return new See(question)
    }

    fulfills(matcher: (text: U) => boolean | Promise<boolean>): See<U> {
        this.matcher = matcher;
        return this;
    }

    repeatFor(times: number, interval: number = 1000): See<U> {

        if(times < 1 || times > 1000)
            throw new Error(`The repeat value should be between 1 and 1000. But its: ${times}`);

        if(interval < 0 || interval > 60000)
            throw new Error(`The interval value should be between 1 and 60000 ms (1 minute). But its: ${interval}`);

        this.repeater = times;
        this.ms = interval;
        return this;
    }


    constructor(
        private question: Question<U>
    ) {}

    async performAs(actor: AnswersQuestions): Promise<void> {

        const loop = async (counter: number): Promise<boolean> => {
            const nextLoop = () => {
                return new Promise(resolve => setTimeout(resolve, this.ms))
                    .then(() => {
                        return loop(counter -1);
                    });
            };

            if(counter < 1)
                return Promise.resolve((this.matcher(await actor.toAnswer(this.question))));

            try {
                let promise = Promise.resolve((this.matcher(await actor.toAnswer(this.question))));
            } catch (e) {
                return nextLoop();
            }


            return Promise.resolve((this.matcher(await actor.toAnswer(this.question))))
                .then((matched: boolean) => {
                    if(!matched) {
                        return nextLoop();
                    } else {
                        return matched;
                    }
                })
                .catch((e) => {
                    return nextLoop();

                })
        };

        return await loop(this.repeater - 1).then((a) => {return});
    }
}