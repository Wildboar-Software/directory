import { getDateFromTime } from "@wildboar/x500";
import {
    SecurityParameters,
} from "@wildboar/x500/DirectoryAbstractService";
import { EOL } from "node:os";
import Context from "../types";
import stringifyDN from "../utils/stringifyDN";
import { print as printCode } from "./Code";

export
function print (ctx: Context, sp: SecurityParameters): string {
    const ret: string[] = [
        "SECURITY PARAMETERS",
    ];
    if (sp.name) {
        ret.push(`| NAME: ${stringifyDN(ctx, sp.name)}`);
    }
    if (sp.time) {
        const date = getDateFromTime(sp.time);
        ret.push(`| TIME: ${date.toString()}`);
    }
    if (sp.random) {
        ret.push(`| RANDOM: ${Array.from(sp.random).join("")}`);
    }
    if (sp.target) {
        ret.push(`| TARGET: ${sp.target}`);
    }
    if (sp.operationCode) {
        ret.push(`| OPCODE: ${printCode(sp.operationCode)}`);
    }
    if (sp.errorProtection) {
        ret.push(`| ERROR PROTECTION: ${sp.errorProtection}`);
    }
    if (sp.errorCode) {
        ret.push(`| ERRCODE: ${printCode(sp.errorCode)}`);
    }
    // TODO: Print certification-path?
    return ret.join(EOL);
}
