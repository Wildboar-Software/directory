import type { Context, ClientConnection } from "../types";
import * as errors from "../errors";
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
    EntryInformation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation.ta";
import {
    AbandonedData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonedData.ta";
import readChildren from "../dit/readChildren";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import checkSuitabilityProcedure from "./checkSuitability";
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    abandoned,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/abandoned.oa";
import {
    search,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/search.oa";
import search_i from "./search_i";
import type { OperationDispatcherState } from "./OperationDispatcher";

export
interface SearchIIReturn {
    chaining: ChainingResults;
    results: EntryInformation[];
}

export
async function search_ii (
    ctx: Context,
    conn: ClientConnection,
    state: OperationDispatcherState,
    argument: SearchArgument,
    ret: SearchIIReturn,
): Promise<void> {
    const target = state.foundDSE;
    const data = getOptionallyProtectedValue(argument);
    const subset = data.subset ?? SearchArgumentData._default_value_for_subset;
    const serviceControlOptions = data.serviceControls?.options;
    const dontUseCopy: boolean = (serviceControlOptions?.[ServiceControlOptions_dontUseCopy] === TRUE_BIT);
    const copyShallDo: boolean = (serviceControlOptions?.[ServiceControlOptions_copyShallDo] === TRUE_BIT);
    const subordinates = await readChildren(ctx, target); // TODO: Pagination
    for (const subordinate of subordinates) {
        if ("present" in state.invokeId) {
            const op = conn.invocations.get(state.invokeId.present);
            if (op?.abandonTime) {
                throw new errors.AbandonError(
                    "Abandoned.",
                    new AbandonedData(
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            conn.boundNameAndUID?.dn,
                            undefined,
                            abandoned["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                );
            }
        }
        if (!subordinate.dse.cp) {
            continue;
        }
        const suitable = checkSuitabilityProcedure(
            ctx,
            subordinate,
            search["&operationCode"]!,
            dontUseCopy,
            copyShallDo,
            state.chainingArguments.excludeShadows ?? ChainingArguments._default_value_for_excludeShadows,
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
            state,
            newArgument,
            ret,
        );
    }
}

export default search_ii;
