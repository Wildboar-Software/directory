import type { Context } from "../types";
import type {
    SearchResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchResult.ta";
import type {
    SearchResultData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchResultData.ta";
import type {
    SearchResultData_searchInfo,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchResultData-searchInfo.ta";
import { EOL } from "node:os";
import stringifyDN from "../utils/stringifyDN";
import { printEntryInformation } from "./EntryInformation";
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

const BEGIN = cyan(":::::BEGIN SEARCH RESULT:::::");
const END = cyan(":::::END SEARCH RESULT:::::");

function printInfo (ctx: Context, info: SearchResultData_searchInfo, indent: number = 0): string {
    let ret: string = "";
    if (info.name) {
        const dnstr = stringifyDN(ctx, info.name.rdnSequence);
        ret += "\t".repeat(indent) + `NAME: ${dnstr}` + EOL
    }
    ret += "\t".repeat(indent)
        + `ALT MATCHING: ${(info.altMatching ?? false).toString().toUpperCase()}`
        + EOL;
    ret += "\t".repeat(indent)
        + `ALIAS DEREFERENCED: ${(info.aliasDereferenced ?? false).toString().toUpperCase()}`
        + EOL;
    if (info.performer) {
        ret += `PERFORMER: ${stringifyDN(ctx, info.performer)}` + EOL;
    }
    if (info.partialOutcomeQualifier) {
        ret += "\t".repeat(indent) + printPOQ(ctx, info.partialOutcomeQualifier);
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
    ret += "ENTRIES:" + EOL;
    const entries = info.entries ?? [];
    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        ret += (printEntryInformation(ctx, entry) + EOL + EOL);
    }
    return ret;
}

function printData (ctx: Context, data: SearchResultData): string {
    if ("searchInfo" in data) {
        return printInfo(ctx, data.searchInfo);
    } else if ("uncorrelatedSearchInfo" in data) {
        return (
            dim(`(Composed of the next ${data.uncorrelatedSearchInfo.length} uncorrelated result sets)`)
            + EOL
            + data.uncorrelatedSearchInfo
                .map((sub) => print(ctx, sub))
                .join(EOL)
        );
    } else {
        return "ERROR: UNRECOGNIZED SEARCH RESULT DATA SYNTAX" + EOL;
    }
}

export
function print (ctx: Context, result: SearchResult): string {
    if ("signed" in result) {
        // FIXME: Print signature information.
        return BEGIN + EOL + printData(ctx, result.signed.toBeSigned) + EOL + END;
    } else if ("unsigned" in result) {
        return BEGIN + EOL + printData(ctx, result.unsigned) + EOL + END;
    } else {
        return BEGIN + EOL + "ERROR: UNRECOGNIZED SEARCH RESULT SYNTAX" + EOL + END;
    }
}

export default print;
