import {AbilitySet, Ability}                                         from "../../lib/abilities/Ability";
import {Browser}                            from "../../../index";
import {UsesAbilities}                                               from "../../Actor";
import {FindElements}                                                from "./FindElements";
import {UseBrowserFeatures}                                          from "./UseBrowserFeatures";

export class OperateOnMobileDevice implements AbilitySet {

    private abilities: Ability[] = [];


    public isAbilityList(): boolean {
        return true;
    }

    public getAbilities(): Ability[] {
        return this.abilities;
    }

    public static using(client: Browser): OperateOnMobileDevice {
        return new OperateOnMobileDevice(client);
    }

    public static as(actor: UsesAbilities): OperateOnMobileDevice {
        return actor.withAbilityTo(OperateOnMobileDevice) as OperateOnMobileDevice;
    }

    public constructor(private client: Browser) {
        this.abilities.push(FindElements.using(client));
    }
}