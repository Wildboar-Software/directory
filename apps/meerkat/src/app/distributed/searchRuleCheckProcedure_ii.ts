import type { Buffer } from "node:buffer";
import type { Context, ClientAssociation, Vertex } from "../types/index.js";
import { ServiceError } from "../types/index.js";
import type { OperationDispatcherState } from "./OperationDispatcher.js";
import {
    administrativeRole,
    id_ar_autonomousArea,
    id_ar_serviceSpecificArea,
} from "@wildboar/x500/InformationFramework";
import {
    SearchArgumentData,
    ServiceErrorData,
    ServiceProblem_unwillingToPerform,
    serviceError,
} from "@wildboar/x500/DirectoryAbstractService";
import createSecurityParameters from "../x500/createSecurityParameters.js";
import printInvokeId from "../utils/printInvokeId.js";

const ID_AUTONOMOUS = id_ar_autonomousArea.toBytes() as Buffer<ArrayBuffer>;
const ID_SERVICE = id_ar_serviceSpecificArea.toBytes() as Buffer<ArrayBuffer>;

/**
 * @summary The Search Rule Check Procedure (II) defined in ITU Recommendation X.518.
 * @description
 *
 * This function implements the procedure defined in
 * [ITU Recommendation X.518 (2019)](https://www.itu.int/rec/T-REC-X.518/en),
 * Section 19.3.2.2.3: the Search Rule Check Procedure (II).
 *
 * @param ctx The context object
 * @param assn The client association
 * @param state The operation dispatcher state
 * @param target The target DSE
 * @param signErrors Whether to digitally sign errors
 * @returns Nothing. This function only checks if any subordinate is a
 *  continuation of the preceeding search's service administrative area and
 *  throws an error if not.
 * @throws {ServiceError} if there are no subordinates of the same service
 *  administrative area in which to continue the chained search
 *
 * @function
 * @async
 */
export
async function searchRuleCheckProcedure_ii (
    ctx: Context,
    assn: ClientAssociation,
    state: OperationDispatcherState,
    target: Vertex,
    signErrors: boolean,
): Promise<void> {
    const searchRuleId = state.chainingArguments.searchRuleId;
    const viable_subordinates = await ctx.db.entry.count({
        where: {
            immediate_superior_id: target.dse.id,
            AttributeValue: {
                none: {
                    type_oid: administrativeRole["&id"].toBytes(),
                    content_octets: searchRuleId
                        ? {
                            not: {
                                in: [
                                    ID_AUTONOMOUS,
                                    ID_SERVICE,
                                ],
                            },
                        }
                        : {
                            not: ID_SERVICE,
                        },
                },
            },
        },
    });
    // If there are no subordinates that are not service or autonomous
    // administrative areas, return unwillingToPerform.
    if (viable_subordinates === 0) {
        throw new ServiceError(
            ctx.i18n.t("err:search_escaped_svc_admin_area", {
                iid: printInvokeId(state.invokeId),
            }),
            new ServiceErrorData(
                ServiceProblem_unwillingToPerform,
                undefined,
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    serviceError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
            ),
        );
    }
}

export default searchRuleCheckProcedure_ii;
