import type { Context } from "../../types";
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
import writeEntryAttributes from "../../database/writeEntryAttributes";
import entryFromDatabaseEntry from "../../database/entryFromDatabaseEntry";
import valuesFromAttribute from "../../memory/valuesFromAttribute";
import { Knowledge } from "@prisma/client";
import * as errors from "../../errors";
import {
    SecurityErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
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

const DER = () => new DERElement();

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
            "No such superior or not authorized to know about it.",
            new SecurityErrorData(
                SecurityProblem_insufficientAccessRights,
                undefined,
                undefined,
                [],
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        );
    }
    if (superior.dse.shadow || superior.dse.subentry || superior.dse.alias) {
        throw new errors.OperationalBindingError(
            "Parent DSE is not of a permissible DSE type.",
            {
                unsigned: new OpBindingErrorParam(
                    OpBindingErrorParam_problem_roleAssignment,
                    undefined,
                    undefined,
                    undefined,
                    [],
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ),
            },
        );
    }
    const itinerantDN = [ ...agreement.immediateSuperior, agreement.rdn ];
    const existing = await findEntry(ctx, ctx.dit.root, itinerantDN, false);
    if (existing) {
        throw new errors.SecurityError(
            "Entry already exists.",
            new SecurityErrorData(
                SecurityProblem_insufficientAccessRights,
                undefined,
                undefined,
                [],
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        );
    }

    if (superior.dse.nssr) {
        // Follow procedures in clause 19.1.5.
    }

    const createdEntry = await ctx.db.entry.create({
        data: {
            dit_id: ctx.dit.id,
            immediate_superior_id: superior.dse.id,
            rdn: rdnToJson(agreement.rdn),
            creatorsName: [],
            modifiersName: [],
            subr: true,
            alias: sub2sup.alias,
            sa: sub2sup.alias,
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
                }
            }
        },
    });
    const subr = await entryFromDatabaseEntry(ctx, superior, createdEntry, true);
    const values = sub2sup.entryInfo?.flatMap((attr) => valuesFromAttribute(attr)) ?? [];
    await writeEntryAttributes(ctx, subr, values);

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
            superior.dse.entryACI
                .map((aci) => _encode_ACIItem(aci, DER)),
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
