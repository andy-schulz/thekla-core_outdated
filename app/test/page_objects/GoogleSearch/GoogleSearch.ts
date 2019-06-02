import {By, element, SppWebElementFinder} from "../../..";

export class GoogleSearch {
    public static searchField: SppWebElementFinder = element(By.css(`[name='q']`));
}

