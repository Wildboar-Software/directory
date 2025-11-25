import type {
    ContinuationReference, OperationProgress,
} from "@wildboar/x500/DistributedOperations";
import {
    OperationProgress_nameResolutionPhase_proceeding as proceeding,
    OperationProgress_nameResolutionPhase_notStarted as notStarted,
    OperationProgress_nameResolutionPhase_completed as completed,
} from "@wildboar/x500/DistributedOperations";
import Context from "../types.js";
import stringifyDN from "../utils/stringifyDN.js";
import { EOL } from "node:os";
import {
    ReferenceType,
    ReferenceType_superior,
    ReferenceType_subordinate,
    ReferenceType_cross,
    ReferenceType_nonSpecificSubordinate,
    ReferenceType_supplier,
    ReferenceType_master,
    ReferenceType_immediateSuperior,
    ReferenceType_self,
    ReferenceType_ditBridge,
} from "@wildboar/x500/DistributedOperations";
import { print as printAPI } from "./AccessPointInformation.js";

function printOperationProgress (op: OperationProgress): string {
    return ({
        [proceeding]: "proceeding",
        [notStarted]: "notStarted",
        [completed]: "completed",
    })[op.nameResolutionPhase] ?? "UNRECOGNIZED"
        + ((op.nextRDNToBeResolved === undefined)
            ? ""
            : ` (Next RDN: ${op.nextRDNToBeResolved})`);
}

function printReferenceType (rt: ReferenceType): string {
    return ({
        [ReferenceType_superior]: "superior",
        [ReferenceType_subordinate]: "subordinate",
        [ReferenceType_cross]: "cross",
        [ReferenceType_nonSpecificSubordinate]: "nonSpecificSubordinate",
        [ReferenceType_supplier]: "supplier",
        [ReferenceType_master]: "master",
        [ReferenceType_immediateSuperior]: "immediateSuperior",
        [ReferenceType_self]: "self",
        [ReferenceType_ditBridge]: "ditBridge",
    })[rt] ?? rt.toString();

}

export
function print (ctx: Context, cr: ContinuationReference): string {
    const lines: string[] = [
        `NAME: ${stringifyDN(ctx, cr.targetObject.rdnSequence)}`,
        `OP PROGRESS: ${printOperationProgress(cr.operationProgress)}`,
        `REF TYPE: ${printReferenceType(cr.referenceType)}`,
        `ENTRY ONLY: ${(cr.entryOnly ?? false).toString().toUpperCase()}`,
        `RETURN TO DUA: ${(cr.returnToDUA ?? false).toString().toUpperCase()}`,
        `NAME RESOLVE ON MASTER: ${(cr.nameResolveOnMaster ?? false).toString().toUpperCase()}`,
    ];
    if (cr.aliasedRDNs !== undefined) {
        lines.push(`ALIASED RDNS: ${cr.aliasedRDNs}`);
    }
    if (cr.rdnsResolved !== undefined) {
        lines.push(`RDNS RESOLVED: ${cr.rdnsResolved}`);
    }
    for (const exclusion of cr.exclusions ?? []) {
        lines.push(`EXCLUSION: ${stringifyDN(ctx, exclusion)}`);
    }
    for (let i = 0; i < cr.accessPoints.length; i++) {
        lines.push(printAPI(ctx, cr.accessPoints[i], i)); // Not technically a "line" but whatever.
    }
    return lines.join(EOL);
}
