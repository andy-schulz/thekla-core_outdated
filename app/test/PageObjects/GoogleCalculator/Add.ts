import {Activity, Task}   from "../../../screenplay/lib/actions/Activities";
import {Click}            from "../../../screenplay/web/actions/Click";
import {PerformsTask}     from "../../../screenplay/Actor";
import {GoogleCalculator} from "./GoogleCalculator";

export class Add extends Task {
    private secondNumber: number;

    public static number(firstNumber: number): Add {
        return new Add(firstNumber);
    }

    public to(secondNumber: number): Activity {
        this.secondNumber = secondNumber;
        return this;
    }

    public performAs(actor: PerformsTask): Promise<void> {
        return actor.attemptsTo(
            ...this.enterNumber(this.firstNumber),
            Click.on(GoogleCalculator.plus),
            ...this.enterNumber(this.secondNumber),
            Click.on(GoogleCalculator.res)
        )
    }

    private constructor(private firstNumber: number) {
        super();
    }


    public enterNumber(number: number): Activity[] {
        const clickFlow: Activity[] = [];
        if(number < 0) {
            clickFlow.push(Click.on(GoogleCalculator.minus));
        }

        for (let char of number.toString()) {
            switch(char) {
                case `1`:
                    clickFlow.push(Click.on(GoogleCalculator.one));
                    break;
                case `2`:
                    clickFlow.push(Click.on(GoogleCalculator.two));
                    break;
                case `3`:
                    clickFlow.push(Click.on(GoogleCalculator.three));
                    break;
                case `4`:
                    clickFlow.push(Click.on(GoogleCalculator.four));
                    break;
                case `5`:
                    clickFlow.push(Click.on(GoogleCalculator.five));
                    break;
                case `6`:
                    clickFlow.push(Click.on(GoogleCalculator.six));
                    break;
                case `7`:
                    clickFlow.push(Click.on(GoogleCalculator.seven));
                    break;
                case `8`:
                    clickFlow.push(Click.on(GoogleCalculator.eight));
                    break;
                case `9`:
                    clickFlow.push(Click.on(GoogleCalculator.nine));
                    break;
                case `0`:
                    clickFlow.push(Click.on(GoogleCalculator.zero));
                    break;
            }
        }
        return clickFlow;
    }


}