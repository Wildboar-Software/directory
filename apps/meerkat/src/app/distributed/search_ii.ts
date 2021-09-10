import type { Context, Vertex, ClientConnection } from "../types";
import { TRUE_BIT, TRUE } from "asn1-ts";
import {
    SearchArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgument.ta";
import {
    SearchArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData.ta";
import {
    SearchArgumentData_subset_oneLevel,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData-subset.ta";
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
    const subset = data.subset ?? SearchArgumentData._default_value_for_subset;
    const serviceControlOptions = data.serviceControls?.options;
    const dontUseCopy: boolean = (serviceControlOptions?.[ServiceControlOptions_dontUseCopy] === TRUE_BIT);
    const copyShallDo: boolean = (serviceControlOptions?.[ServiceControlOptions_copyShallDo] === TRUE_BIT);
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
        const newArgument: SearchArgument = (
            (subset !== SearchArgumentData_subset_oneLevel)
            && (target.dse.alias)
        )
            ? argument
            : {
                unsigned: new SearchArgumentData(
                    data.baseObject,
                    data.subset,
                    data.filter,
                    data.searchAliases,
                    data.selection,
                    data.pagedResults,
                    data.matchedValuesOnly,
                    data.extendedFilter,
                    data.checkOverspecified,
                    data.relaxation,
                    data.extendedArea,
                    data.hierarchySelections,
                    data.searchControlOptions,
                    data.joinArguments,
                    data.joinType,
                    data._unrecognizedExtensionsList,
                    data.serviceControls,
                    data.securityParameters,
                    data.requestor,
                    data.operationProgress,
                    data.aliasedRDNs,
                    data.criticalExtensions,
                    data.referenceType,
                    TRUE, // data.entryOnly,
                    data.exclusions,
                    data.nameResolveOnMaster,
                    data.operationContexts,
                    data.familyGrouping,
                ),
            };
        await search_i(
            ctx,
            conn,
            subordinate,
            admPoints,
            newArgument,
            chaining,
            SRcontinuationList,
            ret,
        );
    }
}

export default search_ii;
