import {all, element, SppWebElementFinder} from "../../../screenplay/web/SppWebElements";
import {By}                                from "../../../index";

export class GoogleSearch {
    public static searchField: SppWebElementFinder = element(By.css("[name='q']"));
    public static searchFieldAll: SppWebElementFinder = all(By.css("[name='q']"));
}

