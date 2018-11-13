import {element, SppWebElementFinder} from "../../../screenplay/WebElementSpp";
import {By} from "../../../index";

export class GoogleSearch {
    public static searchField: SppWebElementFinder = element(By.css("[name='q'"));
}

