import type { ClientAssociation } from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../../ctx";
import {
    HierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/HierarchicalAgreement.ta";
import {
    SuperiorToSubordinate,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SuperiorToSubordinate.ta";
import {
    SubordinateToSuperior,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SubordinateToSuperior.ta";
import dnToVertex from "../../dit/dnToVertex";
import { Knowledge, OperationalBindingInitiator } from "@prisma/client";
import * as errors from "@wildboar/meerkat-types";
import {
    SecurityErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import {
    UpdateErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateErrorData.ta";
import {
    UpdateProblem_entryAlreadyExists,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateProblem.ta";
import {
    updateError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/updateError.oa";
import {
    SecurityProblem_insufficientAccessRights,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import { OpBindingErrorParam } from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OpBindingErrorParam.ta";
import {
    OpBindingErrorParam_problem_roleAssignment,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OpBindingErrorParam-problem.ta";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import getContextPrefixInfo from "../../hob/getContextPrefixInfo";
import createSecurityParameters from "../../x500/createSecurityParameters";
import {
    securityError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/securityError.oa";
import createEntry from "../../database/createEntry";
import checkIfNameIsAlreadyTakenInNSSR from "../../distributed/checkIfNameIsAlreadyTakenInNSSR";
import { operationalBindingError } from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/operationalBindingError.oa";
import saveAccessPoint from "../../database/saveAccessPoint";
import type {
    InvokeId,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/InvokeId.ta";
import DOPAssociation from "../DOPConnection";
import {
    ServiceProblem_unwillingToPerform,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    serviceError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/serviceError.oa";
import { getEntryAttributesToShareInOpBinding } from "../../dit/getEntryAttributesToShareInOpBinding";
import { id_op_binding_shadow } from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-shadow.va";
import { updateShadowConsumer } from "../../disp/createShadowUpdate";

/**
 * @summary Create a new subr reference, thereby becoming a superior DSA
 * @description
 *
 * This function establishes a hierarchical operational binding as a superior
 * DSA, which means that it merely creates the subr DSE used to route requests
 * to the subordinate DSA, after validation. It also constructs a reciprocal
 * result that can be used in a Directory Operational Binding Management
 * Protocol (DOP) result.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param invokeId The InvokeId of the operation used to establish the
 *  operational binding
 * @param agreement The hierarchical agreement
 * @param sub2sup The `SubordinateToSuperior` argument of the HOB
 * @param signErrors Whether to cryptographically sign errors
 * @returns A `SuperiorToSubordinate` that can be returned to the superior DSA
 *  in a Directory Operational Binding Management Protocol (DOP) result
 *
 * @function
 * @async
 */
export
async function becomeSuperior (
    ctx: MeerkatContext,
    assn: ClientAssociation,
    invokeId: InvokeId,
    agreement: HierarchicalAgreement,
    sub2sup: SubordinateToSuperior,
    signErrors: boolean,
): Promise<SuperiorToSubordinate> {
    const superior = await dnToVertex(ctx, ctx.dit.root, agreement.immediateSuperior);
    if (!superior) {
        throw new errors.SecurityError(
            ctx.i18n.t("err:no_such_superior"),
            new SecurityErrorData(
                SecurityProblem_insufficientAccessRights,
                undefined,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    undefined,
                    undefined,
                    securityError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
            signErrors,
        );
    }
    if (superior.dse.shadow || superior.dse.subentry || superior.dse.alias) {
        if (assn instanceof DOPAssociation) {
            throw new errors.OperationalBindingError(
                ctx.i18n.t("err:parent_dse_not_permissible"),
                new OpBindingErrorParam(
                    OpBindingErrorParam_problem_roleAssignment,
                    undefined,
                    undefined,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        operationalBindingError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    undefined,
                    undefined,
                ),
                signErrors,
            );
        } else {
            throw new errors.ServiceError(
                ctx.i18n.t("err:parent_dse_not_permissible"),
                new ServiceErrorData(
                    ServiceProblem_unwillingToPerform,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        serviceError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    undefined,
                    undefined,
                ),
                signErrors,
            );
        }

    }
    const itinerantDN = [ ...agreement.immediateSuperior, agreement.rdn ];
    const existing = await dnToVertex(ctx, ctx.dit.root, itinerantDN);
    if (existing) {
        throw new errors.UpdateError(
            ctx.i18n.t("err:entry_already_exists"),
            new UpdateErrorData(
                UpdateProblem_entryAlreadyExists,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
            signErrors,
        );
    }

    if (superior.dse.nssr) {
        await checkIfNameIsAlreadyTakenInNSSR(
            ctx,
            assn,
            invokeId,
            false,
            superior.dse.nssr.nonSpecificKnowledge,
            itinerantDN,
        );
    }

    const subr = await createEntry(
        ctx,
        superior,
        agreement.rdn,
        { subr: true },
        sub2sup.entryInfo ?? [],
        ctx.dsa.accessPoint.ae_title.rdnSequence,
    );
    await Promise.all(
        sub2sup.accessPoints
            ?.map((ap) => saveAccessPoint(ctx, ap, Knowledge.SPECIFIC, subr.dse.id)) ?? [],
    );
    const now = new Date();
    const possibly_related_sobs = await ctx.db.operationalBinding.findMany({
        where: {
            /**
             * This is a hack for getting the latest version: we are selecting
             * operational bindings that have no next version.
             */
            next_version: {
                none: {},
            },
            binding_type: id_op_binding_shadow.toString(),
            entry_id: {
                in: (() => {
                    const dse_ids: number[] = [];
                    let current: errors.Vertex | undefined = subr;
                    while (current) {
                        dse_ids.push(current.dse.id);
                        current = current.immediateSuperior;
                    }
                    return dse_ids;
                })(),
            },
            accepted: true,
            terminated_time: null,
            validity_start: {
                lte: now,
            },
            AND: [
                {
                    OR: [
                        {
                            validity_end: null,
                        },
                        {
                            validity_end: {
                                gte: now,
                            },
                        },
                    ],
                },
                {
                    OR: [ // This DSA is the supplier if one of these conditions are true.
                        { // This DSA initiated an OB in which it is the supplier.
                            initiator: OperationalBindingInitiator.ROLE_A,
                            outbound: true,
                        },
                        { // This DSA accepted an OB from a consumer.
                            initiator: OperationalBindingInitiator.ROLE_B,
                            outbound: false,
                        },
                    ],
                },
            ],
        },
        select: {
            id: true,
            binding_identifier: true,
            agreement_ber: true,
        },
    });
    // TODO: Cascade the incremental updates to secondary shadows instead of performing a total refresh.
    // A total refresh is the only mechanism that updates extended knowledge, currently!
    await Promise.all(possibly_related_sobs.map((sob) => updateShadowConsumer(ctx, sob.id, true)));
    const immediateSuperiorInfo: Attribute[] = await getEntryAttributesToShareInOpBinding(ctx, superior);
    return new SuperiorToSubordinate(
        await getContextPrefixInfo(ctx, subr.immediateSuperior!),
        sub2sup.entryInfo,
        immediateSuperiorInfo,
    );
}

export default becomeSuperior;
