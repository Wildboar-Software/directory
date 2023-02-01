import type { Context } from "../types";
import type {
    ListResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResult.ta";
import type {
    ListResultData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResultData.ta";
import type {
    ListResultData_listInfo,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResultData-listInfo.ta";
import type {
    ListResultData_listInfo_subordinates_Item as Subordinate,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResultData-listInfo-subordinates-Item.ta";
import { EOL } from "node:os";
import stringifyDN from "../utils/stringifyDN";
import chalk from "chalk";
import { print as printPOQ } from "./poq";
import { print as printAttribute } from "./Attribute";
import { print as printSP } from "./SecurityParameters";

const cyan: (str: string) => string = process.env.NO_COLOR
    ? (str: string): string => str
    : chalk.cyanBright;

const dim: (str: string) => string = process.env.NO_COLOR
    ? (str: string): string => str
    : chalk.dim;

const magenta: (str: string) => string = process.env.NO_COLOR
    ? (str: string): string => str
    : chalk.magenta;

const BEGIN = cyan(":::::BEGIN LIST RESULT:::::");
const END = cyan(":::::END LIST RESULT:::::");

function printSubordinate (ctx: Context, sub: Subordinate, index: number): string {
    const rdn = stringifyDN(ctx, [ sub.rdn ]);
    const num: string = (index + 1).toString().padStart(4, "0");
    const alias = sub.aliasEntry ? cyan("@") : dim("-");
    const entry = (sub.fromEntry ?? true) ? dim("-") : magenta("!");
    return `#${num}: ${alias} ${entry} ${rdn}`;
}

function printInfo (ctx: Context, info: ListResultData_listInfo, indent: number = 0): string {
    let ret: string = "";
    if (info.name) {
        const dnstr = stringifyDN(ctx, info.name.rdnSequence);
        ret += "\t".repeat(indent) + `NAME: ${dnstr}` + EOL
    }
    ret += "\t".repeat(indent)
        + `ALIAS DEREFERENCED: ${(info.aliasDereferenced ?? false).toString().toUpperCase()}`
        + EOL;
    if (info.performer) {
        ret += "\t".repeat(indent)
            + `PERFORMER: ${stringifyDN(ctx, info.performer)}`
            + EOL;
    }
    if (info.partialOutcomeQualifier) {
        ret += "\t".repeat(indent)
            + printPOQ(ctx, info.partialOutcomeQualifier)
            + EOL;
    }
    if (info.notification?.length) {
        ret += ("----- Notification Attributes -----");
        for (const attr of info.notification) {
            ret += (printAttribute(ctx, attr)) + EOL;
        }
        ret += ("----- End of Notification Attributes -----");
    }
    if (info.securityParameters) {
        ret += printSP(ctx, info.securityParameters) + EOL;
    }
    ret += "\t".repeat(indent) + "SUBORDINATES:" + EOL;
    const subordinates = info.subordinates ?? [];
    for (let i = 0; i < subordinates.length; i++) {
        const sub = subordinates[i];
        ret += (printSubordinate(ctx, sub, i) + EOL);
    }
    return ret;
}

function printData (ctx: Context, data: ListResultData): string {
    if ("listInfo" in data) {
        return printInfo(ctx, data.listInfo);
    } else if ("uncorrelatedListInfo" in data) {
        return (
            dim(`(Composed of the next ${data.uncorrelatedListInfo.length} uncorrelated result sets)`)
            + EOL
            + data.uncorrelatedListInfo
                .map((sub) => print(ctx, sub))
                .join(EOL)
        );
    } else {
        return "ERROR: UNRECOGNIZED LIST RESULT DATA SYNTAX" + EOL;
    }
}

export
function print (ctx: Context, result: ListResult): string {
    if ("signed" in result) {
        // FIXME: Print signature information.
        return BEGIN + EOL + printData(ctx, result.signed.toBeSigned) + EOL + END;
    } else if ("unsigned" in result) {
        return BEGIN + EOL + printData(ctx, result.unsigned) + EOL + END;
    } else {
        return BEGIN + EOL + "ERROR: UNRECOGNIZED LIST RESULT SYNTAX" + EOL + END;
    }
}

export default print;
