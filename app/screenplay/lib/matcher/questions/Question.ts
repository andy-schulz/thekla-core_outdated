import {UsesAbilities} from "../../../Actor";

export interface Question<T> {
    answeredBy(actor: UsesAbilities): Promise<T>;
}