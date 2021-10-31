import type { Context } from "@wildboar/meerkat-types";
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
import { ASN1Construction, ASN1TagClass, ASN1UniversalType, DERElement, ObjectIdentifier } from "asn1-ts";
import findEntry from "../../x500/findEntry";
import rdnToJson from "../../x500/rdnToJson";
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
    _encode_MasterOrShadowAccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterOrShadowAccessPoint.ta";
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

// TODO: If context prefix initialization fails, undo all changes.
export
async function becomeSubordinate (
    ctx: Context,
    agreement: HierarchicalAgreement,
    sub2sup: SubordinateToSuperior,
): Promise<SuperiorToSubordinate> {
    const superior = await findEntry(ctx, ctx.dit.root, agreement.immediateSuperior, false);
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
        );
    }
    if (superior.dse.shadow || superior.dse.subentry || superior.dse.alias) {
        throw new errors.OperationalBindingError(
            ctx.i18n.t("err:parent_dse_not_permissible"),
            {
                unsigned: new OpBindingErrorParam(
                    OpBindingErrorParam_problem_roleAssignment,
                    undefined,
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
            },
        );
    }
    const itinerantDN = [ ...agreement.immediateSuperior, agreement.rdn ];
    const existing = await findEntry(ctx, ctx.dit.root, itinerantDN, false);
    if (existing) {
        throw new errors.UpdateError(
            ctx.i18n.t("err:entry_already_exists"),
            new UpdateErrorData(
                UpdateProblem_entryAlreadyExists,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    undefined,
                    undefined,
                    updateError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
        );
    }

    if (superior.dse.nssr) {
        // TODO: Follow procedures in clause 19.1.5.
    }

    const subr = await createEntry(
        ctx,
        superior,
        agreement.rdn,
        {
            subr: true,
            AccessPoint: {
                createMany: {
                    data: sub2sup.accessPoints
                        ? sub2sup.accessPoints.map((ap) => ({
                            ae_title: ap.ae_title.rdnSequence.map((rdn) => rdnToJson(rdn)),
                            knowledge_type: Knowledge.SPECIFIC,
                            category: ap.category,
                            chainingRequired: ap.chainingRequired,
                            ber: Buffer.from(_encode_MasterOrShadowAccessPoint(ap, DER).toBytes()),
                        }))
                        : [],
                },
            },
        },
        sub2sup.entryInfo?.flatMap((attr) => valuesFromAttribute(attr)) ?? [],
        ctx.dsa.accessPoint.ae_title.rdnSequence,
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

export default becomeSubordinate;
