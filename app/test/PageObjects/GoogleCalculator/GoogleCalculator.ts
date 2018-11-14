import {element, SppWebElementFinder} from "../../../screenplay/SppWebElements";
import {By} from "../../..";

export class GoogleCalculator {
    public static input: SppWebElementFinder = element(By.css("[id='cwtltblr']"));
    public static minus: SppWebElementFinder = element(By.css("#cwbt36"));
    public static plus: SppWebElementFinder = element(By.css("#cwbt46"));

    public static zero: SppWebElementFinder = element(By.css("#cwbt43"));
    public static one: SppWebElementFinder = element(By.css("#cwbt33"));
    public static two: SppWebElementFinder = element(By.css("#cwbt34"));
    public static three: SppWebElementFinder = element(By.css("#cwbt35"));
    public static four: SppWebElementFinder = element(By.css("#cwbt23"));
    public static five: SppWebElementFinder = element(By.css("#cwbt24"));
    public static six: SppWebElementFinder = element(By.css("#cwbt25"));
    public static seven: SppWebElementFinder = element(By.css("#cwbt13"));
    public static eight: SppWebElementFinder = element(By.css("#cwbt14"));
    public static nine: SppWebElementFinder = element(By.css("#cwbt15"));
    public static res: SppWebElementFinder = element(By.css("#cwbt45"));
}


