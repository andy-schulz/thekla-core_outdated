import {element, SppWebElementFinder} from "../../../screenplay/web/SppWebElements";
import {By}                           from "../../..";

export class GoogleCalculator {
    public static input: SppWebElementFinder =          element(By.css("[id='cwtltblr']")).called("the calculator input field");
    public static inputNumber: SppWebElementFinder =    element(By.css("#cwos"));
    public static minus: SppWebElementFinder =          element(By.css(".cwbt36")).called("the subtraction button");
    public static plus: SppWebElementFinder =           element(By.css(".cwbt46")).called("the add button");

    public static zero: SppWebElementFinder =           element(By.css(".cwbt43")).called("number zero");
    public static one: SppWebElementFinder =            element(By.css(".cwbt33")).called("number one");
    public static two: SppWebElementFinder =            element(By.css(".cwbt34")).called("number two");
    public static three: SppWebElementFinder =          element(By.css(".cwbt35")).called("number three");
    public static four: SppWebElementFinder =           element(By.css(".cwbt23")).called("number four");
    public static five: SppWebElementFinder =           element(By.css(".cwbt24")).called("number five");
    public static six: SppWebElementFinder =            element(By.css(".cwbt25")).called("number six");
    public static seven: SppWebElementFinder =          element(By.css(".cwbt13")).called("number seven");
    public static eight: SppWebElementFinder =          element(By.css(".cwbt14")).called("number eight");
    public static nine: SppWebElementFinder =           element(By.css(".cwbt15")).called("number nine");
    public static res: SppWebElementFinder =            element(By.css(".cwbt45")).called("calculate the result (aka the equal sign)");
}


