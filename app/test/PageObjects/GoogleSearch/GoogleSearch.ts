import {all, element, SppWebElementFinder, SppWebElementListFinder} from "../../../screenplay/web/SppWebElements";
import {By}                                                         from "../../../index";

export class GoogleSearch {
    public static searchField: SppWebElementFinder = element(By.css(`[name='q']`));
    public static searchFieldAll: SppWebElementListFinder = all(By.css(`[name='q']`));
}

