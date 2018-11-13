import {element, SppWebElementFinder} from "../../../screenplay/WebElementSpp";
import {By} from "../../../index";

class GoogleCalculator {
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
// public enterNumber = async (number: number): Promise<void> => {
//     if(number < 0) {
//         this.minus.click();
//     }
//
//     for (let char of number.toString()) {
//         switch(char) {
//             case '1':
//                 await this.one.click();
//                 break;
//             case '2':
//                 await this.two.click();
//                 break;
//             case '3':
//                 await this.three.click();
//                 break;
//             case '4':
//                 await this.four.click();
//                 break;
//             case '5':
//                 await this.five.click();
//                 break;
//             case '6':
//                 await this.six.click();
//                 break;
//             case '7':
//                 await this.seven.click();
//                 break;
//             case '8':
//                 await this.eight.click();
//                 break;
//             case '9':
//                 await this.nine.click();
//                 break;
//             case '0':
//                 await this.zero.click();
//                 break;
//         }
//     }
//     return Promise.resolve();
// };