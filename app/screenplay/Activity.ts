import {Actor} from "./Actor";

export interface Activity {
    performAs(actor: Actor): Promise<void>;
}