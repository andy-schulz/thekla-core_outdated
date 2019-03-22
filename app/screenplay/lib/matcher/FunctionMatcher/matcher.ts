import {strictEqual as se} from "assert";
import {curryRight} from "lodash";


export const strictEqual = curryRight(se);