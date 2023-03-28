import type { ClientAssociation } from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../../ctx";
import {
    SuperiorToSubordinate,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SuperiorToSubordinate.ta";
import dnToVertex from "../../dit/dnToVertex";
import { Knowledge } from "@prisma/client";
import * as errors from "@wildboar/meerkat-types";
import {
    SecurityErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import {
    SecurityProblem_insufficientAccessRights,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import {
    OpBindingErrorParam,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OpBindingErrorParam.ta";
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
import {
    operationalBindingError,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/operationalBindingError.oa";
import saveAccessPoint from "../../database/saveAccessPoint";
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
import {
    NHOBSubordinateToSuperior,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/NHOBSubordinateToSuperior.ta";
import {
    NHOBSuperiorToSubordinate,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/NHOBSuperiorToSubordinate.ta";
import {
    NonSpecificHierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/NonSpecificHierarchicalAgreement.ta";
import { randomInt } from "crypto";

/**
 * @summary Create a new nssr reference, thereby becoming a superior DSA in an NHOB
 * @description
 *
 * This function establishes a non-specific hierarchical operational binding as
 * a superior DSA, which means that it merely creates the subr DSE used to route requests
 * to the subordinate DSA, after validation. It also constructs a reciprocal
 * result that can be used in a Directory Operational Binding Management
 * Protocol (DOP) result.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param agreement The hierarchical agreement
 * @param sub2sup The `SubordinateToSuperior` argument of the NHOB
 * @param signErrors Whether to cryptographically sign errors
 * @returns A `SuperiorToSubordinate` that can be returned to the superior DSA
 *  in a Directory Operational Binding Management Protocol (DOP) result
 *
 * @function
 * @async
 */
export
async function becomeNonSpecificSuperior (
    ctx: MeerkatContext,
    assn: ClientAssociation,
    agreement: NonSpecificHierarchicalAgreement,
    sub2sup: NHOBSubordinateToSuperior,
    signErrors: boolean,
): Promise<NHOBSuperiorToSubordinate> {
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
    if (
        superior.dse.shadow
        || superior.dse.subentry
        || superior.dse.alias
        || superior.dse.subr
    ) {
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

    await ctx.db.entry.update({
        where: {
            id: superior.dse.id,
        },
        data: {
            nssr: true,
        },
    });

    await Promise.all(
        sub2sup.accessPoints
            ?.map((ap) => saveAccessPoint(
                ctx,
                ap,
                Knowledge.NON_SPECIFIC,
                superior.dse.id,
                undefined,
                BigInt(randomInt(1_000_000_000)),
            )) ?? [],
    );
    const immediateSuperiorInfo: Attribute[] = await getEntryAttributesToShareInOpBinding(ctx, superior);
    return new SuperiorToSubordinate(
        await getContextPrefixInfo(ctx, superior),
        undefined, // entryInfo MUST be absent in NHOBSuperiorToSubordinate
        immediateSuperiorInfo,
    );
}

export default becomeNonSpecificSuperior;
