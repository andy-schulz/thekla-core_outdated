import {AnswersQuestions, PerformsTask} from "../../Actor";
import {Question}                       from "../questions/Question";
import {Activity, Oracle}               from "../actions/Activities";
// import {step}                           from "../../..";

export class See<PT, MPT> implements Oracle<PT, void> {
    private matcher: (value: MPT) => boolean | Promise<boolean>;
    private repeater: number = 1;
    private ms: number = 1000;

    private thenActivities: Activity<PT, void>[] = [];
    private otherwiseActivities: Activity<PT, void>[] = [];


    // @step<AnswersQuestions>("to ask Question <<question>> and see if the the result meets <<matcher>>")
    public async performAs(actor: AnswersQuestions | PerformsTask, activityResult?: PT): Promise<void> {

        const loop = async (counter: number): Promise<boolean> => {
            const nextLoop = (): Promise<boolean> => {
                return new Promise((resolve): number => window.setTimeout(resolve, this.ms))
                    .then((): Promise<boolean> => {
                        return loop(counter -1);
                    });
            };

            if(counter < 1)
                return Promise.resolve((this.matcher(await (actor as AnswersQuestions).toAnswer(this.question, activityResult))));

            let promise;
            try {
                const answer: MPT = (await (actor as AnswersQuestions).toAnswer(this.question, activityResult));
                promise = Promise.resolve((
                    this.matcher(answer)
                ));
            } catch (e) {
                return nextLoop();
            }

            return promise
                .then((matched: boolean): Promise<boolean> | boolean => {
                    if(!matched) {
                        return nextLoop();
                    } else {
                        return matched;
                    }
                })
                .catch((): Promise<boolean> => {
                    return nextLoop();
                })
        };

        return loop(this.repeater - 1)
            .then((/*match: boolean*/): Promise<void> => {
                if(this.thenActivities.length > 0) {
                    return (actor as PerformsTask).attemptsTo(...this.thenActivities);
                }
                else {
                    return Promise.resolve();
                }
            })
            .catch((e): Promise<void> => {
                if(this.otherwiseActivities.length > 0)
                    return (actor as PerformsTask).attemptsTo(...this.otherwiseActivities);
                else
                    return Promise.reject(e);
            });
    }

    public static if <SPT, SMPT>(question: Question<SPT, SMPT>): See<SPT, SMPT> {
        return new See(question)
    }

    public then(...activities: Activity<PT, void>[]): See<PT, MPT> {
        this.thenActivities = activities;
        return this;
    }

    public otherwise(...activities: Activity<PT, void>[]): See<PT, MPT> {
        this.otherwiseActivities = activities;
        return this;
    }

    public is(matcher: (text: MPT) => boolean | Promise<boolean>): See<PT,MPT> {
        this.matcher = matcher;
        return this;
    }

    public repeatFor(times: number, interval: number = 1000): See<PT,MPT> {

        if(times < 1 || times > 1000)
            throw new Error(`The repeat 'times' value should be between 1 and 1000. But its: ${times}`);

        if(interval < 0 || interval > 60000)
            throw new Error(`The interval value should be between 1 and 60000 ms (1 minute). But its: ${interval}`);

        this.repeater = times;
        this.ms = interval;
        return this;
    }

    private constructor(
        private question: Question<PT, MPT>
    ) {}
}