import type { Context } from "../../types";
import {
    HierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/HierarchicalAgreement.ta";
import type {
    SuperiorToSubordinate,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SuperiorToSubordinate.ta";
import {
    MasterAndShadowAccessPoints,
    SubordinateToSuperior,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SubordinateToSuperior.ta";
import {
    administrativeRole,
} from "@wildboar/x500/src/lib/modules/InformationFramework/administrativeRole.oa";
import {
    accessControlScheme,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/accessControlScheme.oa";
import {
    subentryACI,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/subentryACI.oa";
import {
    entryACI,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/entryACI.oa";
import {
    prescriptiveACI,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/prescriptiveACI.oa";
import {
    ACIItem,
    _decode_ACIItem,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/ACIItem.ta";
import {
    MasterOrShadowAccessPoint,
    _encode_MasterOrShadowAccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterOrShadowAccessPoint.ta";
import {
    MasterOrShadowAccessPoint_category_master,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterOrShadowAccessPoint-category.ta";
import { OBJECT_IDENTIFIER, DERElement } from "asn1-ts";
import findEntry from "../../x500/findEntry";
import rdnToJson from "../../x500/rdnToJson";
import writeACI from "../../database/writeACI";
import writeEntryAttributes from "../../database/writeEntryAttributes";
import entryFromDatabaseEntry from "../../database/entryFromDatabaseEntry";
import valuesFromAttribute from "../../memory/valuesFromAttribute";
import { ACIScope, Knowledge } from "@prisma/client";

const DER = () => new DERElement();

// TODO: If context prefix initialization fails, undo all changes.
export
async function becomeSubordinate (
    ctx: Context,
    agreement: HierarchicalAgreement,
    sup2sub: SuperiorToSubordinate,
): Promise<SubordinateToSuperior> {
    let currentRoot = ctx.dit.root;
    for (let i = 0; i < sup2sub.contextPrefixInfo.length; i++) {
        const vertex = sup2sub.contextPrefixInfo[i];
        let immSuprAccessPoints: MasterAndShadowAccessPoints | undefined = undefined;
        const last: boolean =( sup2sub.contextPrefixInfo.length === (i + 1));
        const existingEntry = await findEntry(ctx, currentRoot, [ vertex.rdn ]);
        if (!existingEntry) {
            immSuprAccessPoints = vertex.accessPoints;
            const administrativeRoles: OBJECT_IDENTIFIER[] = vertex.admPointInfo
                ?.filter((attr) => attr.type_.isEqualTo(administrativeRole["&id"]))
                .flatMap((attr) => [
                    ...attr.values,
                    ...(attr.valuesWithContext ?? []).map((vwc) => vwc.value),
                ])
                .map((value) => value.objectIdentifier) ?? [];
            const accessControlSchemeOIDs: OBJECT_IDENTIFIER[] = vertex.admPointInfo
                ?.filter((attr) => attr.type_.isEqualTo(accessControlScheme["&id"]))
                .flatMap((attr) => [
                    ...attr.values,
                    ...(attr.valuesWithContext ?? []).map((vwc) => vwc.value),
                ])
                .map((value) => value.objectIdentifier) ?? [];
            const subentryACIs: ACIItem[] = vertex.admPointInfo
                ?.filter((attr) => attr.type_.isEqualTo(subentryACI["&id"]))
                .flatMap((attr) => [
                    ...attr.values,
                    ...(attr.valuesWithContext ?? []).map((vwc) => vwc.value),
                ])
                .map((value) => _decode_ACIItem(value)) ?? [];
            const entryACIs: ACIItem[] = vertex.admPointInfo
                ?.filter((attr) => attr.type_.isEqualTo(entryACI["&id"]))
                .flatMap((attr) => [
                    ...attr.values,
                    ...(attr.valuesWithContext ?? []).map((vwc) => vwc.value),
                ])
                .map((value) => _decode_ACIItem(value)) ?? [];
            const immSupr: boolean = Boolean(immSuprAccessPoints && last);
            const createdEntry = await ctx.db.entry.create({
                data: {
                    dit_id: ctx.dit.id,
                    rdn: rdnToJson(vertex.rdn),
                    immediate_superior_id: currentRoot.dse.id,
                    glue: (!vertex.admPointInfo && !vertex.accessPoints),
                    rhob: Boolean(vertex.admPointInfo),
                    admPoint: Boolean(vertex.admPointInfo),
                    immSupr,
                    creatorsName: [],
                    modifiersName: [],
                    administrativeRole: administrativeRoles.length
                        ? administrativeRoles.map((ar) => ar.toString())
                        : undefined,
                    accessControlScheme: (accessControlSchemeOIDs.length === 1)
                        ? accessControlSchemeOIDs.toString()
                        : undefined,
                    AccessPoint: immSupr
                        ? {
                            createMany: {
                                data: vertex.accessPoints
                                    ? vertex.accessPoints.map((ap) => ({
                                        ae_title: ap.ae_title.rdnSequence.map((rdn) => rdnToJson(rdn)),
                                        knowledge_type: Knowledge.SPECIFIC,
                                        category: ap.category,
                                        chainingRequired: ap.chainingRequired,
                                        ber: Buffer.from(_encode_MasterOrShadowAccessPoint(ap, DER).toBytes()),
                                    }))
                                    : [],
                            }
                        }
                        : undefined,
                },
            });
            for (const aci of entryACIs) {
                await writeACI(ctx, createdEntry.id, aci, ACIScope.ENTRY);
            }
            for (const aci of subentryACIs) {
                await writeACI(ctx, createdEntry.id, aci, ACIScope.SUBENTRY);
            }
            currentRoot = await entryFromDatabaseEntry(ctx, currentRoot, createdEntry, true);
            currentRoot.dse.entryACI = entryACIs;
            if (currentRoot.dse.admPoint && subentryACIs.length) {
                currentRoot.dse.admPoint.subentryACI = subentryACIs;
            }
            for (const subentry of (vertex.subentries ?? [])) {
                const entryACIs_for_subentry: ACIItem[] = subentry.info
                    ?.filter((attr) => attr.type_.isEqualTo(entryACI["&id"]))
                    .flatMap((attr) => [
                        ...attr.values,
                        ...(attr.valuesWithContext ?? []).map((vwc) => vwc.value),
                    ])
                    .map((value) => _decode_ACIItem(value)) ?? [];
                const prescriptiveACIs: ACIItem[] = subentry.info
                    ?.filter((attr) => attr.type_.isEqualTo(prescriptiveACI["&id"]))
                    .flatMap((attr) => [
                        ...attr.values,
                        ...(attr.valuesWithContext ?? []).map((vwc) => vwc.value),
                    ])
                    .map((value) => _decode_ACIItem(value)) ?? [];
                const createdSubentry = await ctx.db.entry.create({
                    data: {
                        dit_id: ctx.dit.id,
                        rdn: rdnToJson(subentry.rdn),
                        immediate_superior_id: createdEntry.id,
                        subentry: true,
                        creatorsName: [],
                        modifiersName: [],
                    },
                });
                for (const aci of entryACIs_for_subentry) {
                    await writeACI(ctx, createdSubentry.id, aci, ACIScope.ENTRY);
                }
                for (const aci of prescriptiveACIs) {
                    await writeACI(ctx, createdSubentry.id, aci, ACIScope.SUBENTRY);
                }
            }
        } else {
            currentRoot = existingEntry;
        }
    }
    const createdCP = await ctx.db.entry.create({
        data: {
            dit_id: ctx.dit.id,
            rdn: rdnToJson(agreement.rdn),
            immediate_superior_id: currentRoot.dse.id,
            cp: true,
            immSupr: false, // This is supposed to be on the superior of this entry.
            supr: false, // This is supposed to be on the Root DSE.
            entry: true,
            alias: false, // This should be flipped by `writeEntryAttributes()`, if applicable.
            creatorsName: [],
            modifiersName: [],
        },
    });
    const subr = await entryFromDatabaseEntry(ctx, currentRoot, createdCP, true);
    if (sup2sub.immediateSuperiorInfo) {
        const values = sup2sub.immediateSuperiorInfo.flatMap((attr) => valuesFromAttribute(attr));
        await writeEntryAttributes(ctx, currentRoot.immediateSuperior!, values);
    }
    if (sup2sub.entryInfo) {
        const values = sup2sub.entryInfo.flatMap((attr) => valuesFromAttribute(attr));
        await writeEntryAttributes(ctx, subr, values);
    }
    // TODO: Update the knowledge references of the root DSE (supr) if the highest NC has changed.
    const myAccessPoint = ctx.dsa.accessPoint;
    return new SubordinateToSuperior(
        [
            // TODO: NOTE 1 – The master access point within accessPoints is the same
            // as that passed in the accessPoint parameter of the Establish and
            // Modify Operational Binding operations.
            new MasterOrShadowAccessPoint(
                myAccessPoint.ae_title,
                myAccessPoint.address,
                myAccessPoint.protocolInformation,
                MasterOrShadowAccessPoint_category_master,
                false,
            ),
            /** REVIEW:
             * ITU Recommendation X.518 (2016), Section 23.1.2, says that:
             *
             * > The values of the consumerKnowledge and secondaryShadows (both
             * > held in the subordinate context prefix DSE) are used to form
             * > additional elements in accessPoints with category having the
             * > value shadow.
             *
             * But the context prefix is newly created by the operation itself,
             * so how could it possibly have shadows at that time?
             */
        ],
        Boolean(subr.dse.alias),
        sup2sub.entryInfo,
        undefined,
    );
}

export default becomeSubordinate;
