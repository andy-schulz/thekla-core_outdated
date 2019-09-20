import {By, element, SppElement} from "../../..";

export class GoogleSearch {
    public static searchField: SppElement = element(By.css(`[name='q']`));
}

