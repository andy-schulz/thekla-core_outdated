/* eslint-disable quotes */

import {ElementRefIO} from "../wdio/wrapper/WebElementIO";

export interface Actions {
    actions: SourceAction[];
}

export type SourceAction = PointerActionSequence | KeyActionSequence | NoneActionSequence;

/**
 * None Action Type
 */
export interface NoneActionSequence {
    type: "none";
    id: string;
    actions: NoneAction[];
}

export type NoneAction = PauseAction

/**
 * Key Action Type
 */
export interface KeyActionSequence {
    type: "key";
    id: string;
    action: KeyAction[];
}

export type KeyAction = KeyPressAction | PauseAction

export interface KeyPressAction {
    type: KeyPressActionType;
    value: number;
}

export type KeyPressActionType = "keyDown" | "keyUp"

/**
 * Pointer Action Type
 */
export interface PointerActionSequence {
    type: "pointer";
    id: string;
    parameters: PointerParameters;
    actions: PointerAction[];
}

export type PointerAction = PauseAction | PointerPressAction | PointerMoveAction

export interface PointerParameters {
    pointerType: PointerType;
}

export type PointerType = "touch" | "mouse" | "pen";

export interface PointerPressAction {
    type: PointerPressActionType;
    button: number;
}

export type PointerPressActionType = "pointerUp" | "pointerDown";

export interface PointerMoveAction {
    type: "pointerMove";
    duration: number;
    origin: "viewport" | "pointer" | ElementRefIO;
    x: number;
    y: number;
}

/**
 * General Actions
 */
export interface PauseAction {
    type: "pause";
    duration: number;
}