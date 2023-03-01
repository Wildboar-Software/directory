import { Context, ClientAssociation, Vertex, ServiceError } from "@wildboar/meerkat-types";
import type { OperationDispatcherState } from "./OperationDispatcher";
import {
    SearchArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData.ta";
import {
    administrativeRole,
} from "@wildboar/x500/src/lib/modules/InformationFramework/administrativeRole.oa";
import {
    id_ar_autonomousArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-autonomousArea.va";
import {
    id_ar_serviceSpecificArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-serviceSpecificArea.va";
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    ServiceProblem_unwillingToPerform,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import {
    serviceError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/serviceError.oa";
import createSecurityParameters from "../x500/createSecurityParameters";
import printInvokeId from "../utils/printInvokeId";

const ID_AUTONOMOUS: Buffer = id_ar_autonomousArea.toBytes();
const ID_SERVICE: Buffer = id_ar_serviceSpecificArea.toBytes();

export
async function searchRuleCheckProcedure_ii (
    ctx: Context,
    assn: ClientAssociation,
    state: OperationDispatcherState,
    target: Vertex,
    searchArg: SearchArgumentData,
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
