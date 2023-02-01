import type {
    PartialOutcomeQualifier,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PartialOutcomeQualifier.ta";
import {
    LimitProblem,
    LimitProblem_administrativeLimitExceeded,
    LimitProblem_sizeLimitExceeded,
    LimitProblem_timeLimitExceeded,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/LimitProblem.ta";
import { print as printAttribute } from "./Attribute";
import { print as printContinuationRef } from "./ContinuationReference";
import Context from "../types";
import { EOL } from "node:os";

function printLimitProblem (lp: LimitProblem): string {
    return ({
        [Number(LimitProblem_administrativeLimitExceeded)]: "ADMIN",
        [Number(LimitProblem_sizeLimitExceeded)]: "SIZE",
        [Number(LimitProblem_timeLimitExceeded)]: "TIME",
    })[Number(lp)] ?? "UNKNOWN";
}

// * PartialOutcomeQualifier ::= SET {
// *   limitProblem                  [0]  LimitProblem OPTIONAL,
// *   unexplored                    [1]  SET SIZE (1..MAX) OF ContinuationReference OPTIONAL,
// *   unavailableCriticalExtensions [2]  BOOLEAN DEFAULT FALSE,
// *   unknownErrors                 [3]  SET SIZE (1..MAX) OF ABSTRACT-SYNTAX.&Type OPTIONAL,
// *   queryReference                [4]  OCTET STRING OPTIONAL,
// *   overspecFilter                [5]  Filter OPTIONAL,
// *   notification                  [6]  SEQUENCE SIZE (1..MAX) OF
// *                                        Attribute{{SupportedAttributes}} OPTIONAL,
// *   entryCount                         CHOICE {
// *     bestEstimate                  [7]  INTEGER,
// *     lowEstimate                   [8]  INTEGER,
// *     exact                         [9]  INTEGER,
// *     ...} OPTIONAL
// *   --                            [10] Not to be used -- }
export
function print (ctx: Context, poq: PartialOutcomeQualifier): string {
    const lines: string[] = [];
    if (poq.limitProblem !== undefined) {
        lines.push(`LIMIT: ${printLimitProblem(poq.limitProblem)}`);
    }
    lines.push(`UNAVAILABLE CRITICAL EXTENSIONS: ${(poq.unavailableCriticalExtensions ?? false).toString().toUpperCase()}`);
    if (poq.queryReference) {
        lines.push(`QUERY REF: 0x${Buffer.from(poq.queryReference).toString("hex")}`);
    }
    // TODO: Print overSpecFilter?
    if (poq.entryCount) {
        if ("bestEstimate" in poq.entryCount) {
            lines.push(`ENTRY COUNT (BEST ESTIMATE): ${poq.entryCount.bestEstimate}`);
        }
        else if ("lowEstimate" in poq.entryCount) {
            lines.push(`ENTRY COUNT (LOW ESTIMATE): ${poq.entryCount.lowEstimate}`);
        }
        else if ("exact" in poq.entryCount) {
            lines.push(`ENTRY COUNT: ${poq.entryCount.exact}`);
        }
    }
    if (poq.notification?.length) {
        lines.push("----- Notification Attributes -----");
        for (const attr of poq.notification) {
            lines.push(printAttribute(ctx, attr));
        }
        lines.push("----- End of Notification Attributes -----");
    }
    if (poq.unexplored?.length) {
        for (let i = 0; i < poq.unexplored.length; i++) {
            const cr = poq.unexplored[i];
            lines.push(`----- Unexplored Continuation Reference #${(i + 1).toString().padStart(2, "0")} -----`);
            lines.push(printContinuationRef(ctx, cr));
        }
        lines.push("----- End of Unexplored Continuation References -----");
    }
    return lines.join(EOL);
}
