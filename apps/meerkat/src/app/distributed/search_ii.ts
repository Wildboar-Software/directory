import type { Context, Vertex } from "../types";
import { TRUE_BIT } from "asn1-ts";
import {
    SearchArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgument.ta";
import type {
    SearchResultData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchResultData.ta";
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
import readChildren from "../dit/readChildren";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import checkSuitabilityProcedure from "./checkSuitability";
import {
    search,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/search.oa";
import search_i from "./search_i";

export
interface SearchReturn {
    chaining: ChainingResults;
    result: Extract<SearchResultData, { searchInfo: any }>;
}

export
async function search_ii (
    ctx: Context,
    target: Vertex,
    admPoints: Vertex[],
    argument: SearchArgument,
    chaining: ChainingArguments,
    SRcontinuationList: ContinuationReference[],
    ret: SearchReturn,
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
            subordinate,
            admPoints,
            argument,
            chaining,
            SRcontinuationList,
            ret,
        );
    }
}
