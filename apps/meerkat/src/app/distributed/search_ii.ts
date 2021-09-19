import type { Context, ClientConnection, WithRequestStatistics, WithOutcomeStatistics } from "../types";
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
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    ServiceProblem_unwillingToPerform,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import {
    id_errcode_serviceError,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-errcode-serviceError.va";

const SEARCH_II_PAGE_SIZE: number = 100;

export
interface SearchIIReturn extends Partial<WithRequestStatistics>, Partial<WithOutcomeStatistics> {
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

    /**
     * NOTE: Joins are going to be ENTIRELY UNSUPPORTED, because many details
     * are unspecified:
     *
     * - The `relatedEntry` attribute that joining depends on is _undefined_ by any ITU specification.
     * - ~~It is not clear what `JoinArgument.domainLocalID` even is, nor how to handle if it is not understood.~~
     *   - I rescined this statement^. `domainLocalID` is defined in X.518.
     *   - However, it is still undefined what to do if it is not recognized.
     *
     * If this is ever implemented, the code below will also need to perform
     * pagination before joining. The code below is _extremely unscalable_.
     * Because every entry has to be compared against every other entry
     * (and indexing attribute values generally is not viable), the compute
     * time will grow a O(n^2) or even worse time (because all attributes of
     * each entry must be compared, and the same for all values of said
     * attributes.) This is so unscalable, I had doubts about implementing it
     * in the first place.
     *
     * Also, if the code below is ever implemented, another deduplication may be
     * necessary, because the additional entries brought in by the joins may
     * overlap. On the other hand, maybe it's fine to allow the user to do this?
     *
     * For now, if a join is attempted, the server should just return an
     * unwillingToPerform error.
     */
    if (data.joinArguments) {
        throw new errors.ServiceError(
            "Joins are entirely unsupported by this server.",
            new ServiceErrorData(
                ServiceProblem_unwillingToPerform,
                [],
                createSecurityParameters(
                    ctx,
                    conn.boundNameAndUID?.dn,
                    undefined,
                    id_errcode_serviceError,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
        );
    }

    let cursorId: number | undefined;
    let subordinatesInBatch = await readChildren(
        ctx,
        target,
        SEARCH_II_PAGE_SIZE,
        undefined,
        cursorId,
    );
    while (subordinatesInBatch.length) {
        for (const subordinate of subordinatesInBatch) {
            cursorId = subordinate.dse.id;
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
        subordinatesInBatch = await readChildren(
            ctx,
            target,
            SEARCH_II_PAGE_SIZE,
            undefined,
            cursorId,
        );
    }
}

export default search_ii;
