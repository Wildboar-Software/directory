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
import {
    objectClass,
} from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
import {
    entryACI,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/entryACI.oa";
import {
    _encode_ACIItem,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/ACIItem.ta";
import {
    ASN1Construction,
    ASN1TagClass,
    ASN1UniversalType,
    DERElement,
    ObjectIdentifier,
} from "asn1-ts";
import dnToVertex from "../../dit/dnToVertex";
import valuesFromAttribute from "../../x500/valuesFromAttribute";
import { Knowledge } from "@prisma/client";
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
import { DER } from "asn1-ts/dist/node/functional";
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
        sub2sup.entryInfo?.flatMap((attr) => valuesFromAttribute(attr)) ?? [],
        ctx.dsa.accessPoint.ae_title.rdnSequence,
    );
    await Promise.all(
        sub2sup.accessPoints
            ?.map((ap) => saveAccessPoint(ctx, ap, Knowledge.SPECIFIC, subr.dse.id)) ?? [],
    );

    const immediateSuperiorInfo: Attribute[] = [
        new Attribute(
            objectClass["&id"],
            Array.from(superior.dse.objectClass)
                .map((oc) => ObjectIdentifier.fromString(oc))
                .map((oid) => new DERElement(
                    ASN1TagClass.universal,
                    ASN1Construction.primitive,
                    ASN1UniversalType.objectIdentifier,
                    oid,
                )),
            undefined,
        ),
    ];
    if (superior.dse.entryACI) {
        // This means that the OB needs modification if the superior's entryACI changes.
        immediateSuperiorInfo.push(new Attribute(
            entryACI["&id"],
            superior.dse.entryACI.map((aci) => _encode_ACIItem(aci, DER)),
            undefined,
        ));
    }

    return new SuperiorToSubordinate(
        await getContextPrefixInfo(ctx, subr.immediateSuperior!),
        sub2sup.entryInfo,
        immediateSuperiorInfo,
    );
}

export default becomeSuperior;
