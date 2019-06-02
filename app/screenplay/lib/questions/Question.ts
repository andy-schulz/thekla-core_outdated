import {UsesAbilities} from "../../Actor";

export interface Question<PT,RT> {
    answeredBy(actor: UsesAbilities, activityResult: PT): Promise<RT>;
}