import {element, SppWebElementFinder} from "../../../screenplay/web/SppWebElements";
import {By}                           from "../../..";

export class GoogleCalculator {
    public static input: SppWebElementFinder =          element(By.css(`.card-section [role='presentation']`)).called(`the calculator input field`);
    public static inputNumber: SppWebElementFinder =    element(By.css(`#cwos`));
    public static minus: SppWebElementFinder =          element(By.css(`[jsname='pPHzQc']`)).called(`the subtraction button`);
    public static plus: SppWebElementFinder =           element(By.css(`[jsname='XSr6wc']`)).called(`the add button`);

    public static zero: SppWebElementFinder =           element(By.css(`[jsname='bkEvMb']`)).called(`number zero`);
    public static one: SppWebElementFinder =            element(By.css(`[jsname='N10B9']`)).called(`number one`);
    public static two: SppWebElementFinder =            element(By.css(`[jsname='lVjWed']`)).called(`number two`);
    public static three: SppWebElementFinder =          element(By.css(`[jsname='KN1kY']`)).called(`number three`);
    public static four: SppWebElementFinder =           element(By.css(`[jsname='xAP7E']`)).called(`number four`);
    public static five: SppWebElementFinder =           element(By.css(`[jsname='Ax5wH']`)).called(`number five`);
    public static six: SppWebElementFinder =            element(By.css(`[jsname='abcgof']`)).called(`number six`);
    public static seven: SppWebElementFinder =          element(By.css(`[jsname='rk7bOd']`)).called(`number seven`);
    public static eight: SppWebElementFinder =          element(By.css(`[jsname='T7PMFe']`)).called(`number eight`);
    public static nine: SppWebElementFinder =           element(By.css(`[jsname='XoxYJ']`)).called(`number nine`);
    public static res: SppWebElementFinder =            element(By.css(`[jsname='Pt8tGc']`)).called(`calculate the result (aka the equal sign)`);
}


