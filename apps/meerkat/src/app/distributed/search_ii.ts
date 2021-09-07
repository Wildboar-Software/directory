import type { Context, Vertex, ClientConnection } from "../types";
import { OBJECT_IDENTIFIER, ObjectIdentifier, TRUE_BIT } from "asn1-ts";
import * as errors from "../errors";
import {
    SearchArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgument.ta";
import {
    ServiceControlOptions_dontUseCopy,
    ServiceControlOptions_copyShallDo,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import {
    ChainingArguments,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingArguments.ta";
import type {
    ChainingResults,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingResults.ta";
import {
    ContinuationReference,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ContinuationReference.ta";
import {
    EntryInformation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation.ta";
import readChildren from "../dit/readChildren";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import checkSuitabilityProcedure from "./checkSuitability";
import {
    search,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/search.oa";
import search_i from "./search_i";
import { SecurityErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import {
    SecurityProblem_noInformation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import getRelevantSubentries from "../dit/getRelevantSubentries";
import accessControlSchemesThatUseEntryACI from "../authz/accessControlSchemesThatUseEntryACI";
import accessControlSchemesThatUsePrescriptiveACI from "../authz/accessControlSchemesThatUsePrescriptiveACI";
import type ACDFTuple from "@wildboar/x500/src/lib/types/ACDFTuple";
import type ACDFTupleExtended from "@wildboar/x500/src/lib/types/ACDFTupleExtended";
import bacACDF, {
    PERMISSION_CATEGORY_ADD,
    PERMISSION_CATEGORY_REMOVE,
    PERMISSION_CATEGORY_MODIFY,
} from "@wildboar/x500/src/lib/bac/bacACDF";
import getACDFTuplesFromACIItem from "@wildboar/x500/src/lib/bac/getACDFTuplesFromACIItem";
import type EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import getIsGroupMember from "../bac/getIsGroupMember";
import userWithinACIUserClass from "@wildboar/x500/src/lib/bac/userWithinACIUserClass";

export
interface SearchIIReturn {
    chaining: ChainingResults;
    results: EntryInformation[];
}

export
async function search_ii (
    ctx: Context,
    conn: ClientConnection,
    target: Vertex,
    admPoints: Vertex[],
    argument: SearchArgument,
    chaining: ChainingArguments,
    SRcontinuationList: ContinuationReference[],
    ret: SearchIIReturn,
): Promise<void> {
    const data = getOptionallyProtectedValue(argument);
    const serviceControlOptions = data.serviceControls?.options;
    const dontUseCopy: boolean = (
        serviceControlOptions?.[ServiceControlOptions_dontUseCopy] === TRUE_BIT);
    const copyShallDo: boolean = (
        serviceControlOptions?.[ServiceControlOptions_copyShallDo] === TRUE_BIT);
    const subordinates = await readChildren(ctx, target);
    for (const subordinate of subordinates) {
        if (!subordinate.dse.cp) {
            continue;
        }
        const suitable = checkSuitabilityProcedure(
            ctx,
            subordinate,
            search["&operationCode"]!,
            dontUseCopy,
            copyShallDo,
            chaining.excludeShadows ?? ChainingArguments._default_value_for_excludeShadows,
        );
        if (!suitable) {
            continue;
        }
        // TODO: set entryOnly = TRUE iff dse type == alias and subset === oneLevel
        await search_i(
            ctx,
            conn,
            subordinate,
            admPoints,
            argument,
            chaining,
            SRcontinuationList,
            ret,
        );
    }
}

export default search_ii;
