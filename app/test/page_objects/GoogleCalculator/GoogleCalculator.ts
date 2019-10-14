import {By, element, SppElement} from "../../..";

export class GoogleCalculator {
    public static input: SppElement =          element(By.css(`.card-section [role='presentation']`)).called(`the calculator input field`);
    // public static inputNumber: SppElement =    element(By.css(`#cwos`));
    public static minus: SppElement =          element(By.css(`[jsname='pPHzQc']`)).called(`the subtraction button`);
    public static plus: SppElement =           element(By.css(`[jsname='XSr6wc']`)).called(`the add button`);

    public static zero: SppElement =           element(By.css(`[jsname='bkEvMb']`)).called(`number zero`);
    public static one: SppElement =            element(By.css(`[jsname='N10B9']`)).called(`number one`);
    public static two: SppElement =            element(By.css(`[jsname='lVjWed']`)).called(`number two`);
    public static three: SppElement =          element(By.css(`[jsname='KN1kY']`)).called(`number three`);
    public static four: SppElement =           element(By.css(`[jsname='xAP7E']`)).called(`number four`);
    public static five: SppElement =           element(By.css(`[jsname='Ax5wH']`)).called(`number five`);
    public static six: SppElement =            element(By.css(`[jsname='abcgof']`)).called(`number six`);
    public static seven: SppElement =          element(By.css(`[jsname='rk7bOd']`)).called(`number seven`);
    public static eight: SppElement =          element(By.css(`[jsname='T7PMFe']`)).called(`number eight`);
    public static nine: SppElement =           element(By.css(`[jsname='XoxYJ']`)).called(`number nine`);
    public static res: SppElement =            element(By.css(`[jsname='Pt8tGc']`)).called(`calculate the result (aka the equal sign)`);
}


