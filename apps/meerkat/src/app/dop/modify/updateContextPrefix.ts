import type { Context, Vertex } from "../../types";
import {
    HierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/HierarchicalAgreement.ta";
import type {
    SuperiorToSubordinate,
    SuperiorToSubordinateModification,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SuperiorToSubordinateModification.ta";
import {
    MasterAndShadowAccessPoints,
    SubordinateToSuperior,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SubordinateToSuperior.ta";
import {
    MasterOrShadowAccessPoint,
    _encode_MasterOrShadowAccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterOrShadowAccessPoint.ta";
import {
    MasterOrShadowAccessPoint_category_master,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterOrShadowAccessPoint-category.ta";
import {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import findEntry from "../../x500/findEntry";
import rdnToJson from "../../x500/rdnToJson";
import valuesFromAttribute from "../../x500/valuesFromAttribute";
import { Knowledge } from "@prisma/client";
import deleteEntry from "../../database/deleteEntry";
import { DER } from "asn1-ts/dist/node/functional";
import createEntry from "../../database/createEntry";

// NOTE: This is for RECEIVING an update to the CP, not creating one.
// TODO: If context prefix initialization fails, undo all changes.
export
async function updateContextPrefix (
    ctx: Context,
    oldAgreement: HierarchicalAgreement,
    newAgreement: HierarchicalAgreement,
    init: SuperiorToSubordinate,
    mod: SuperiorToSubordinateModification,
): Promise<SubordinateToSuperior> {

    // Because we use the agreement's RDN to find the entry, it's critical that
    // the agreement in the database is kept in sync with the entry's RDN.
    const oldDN: DistinguishedName = [
        ...oldAgreement.immediateSuperior,
        oldAgreement.rdn,
    ];
    const oldCP = await findEntry(ctx, ctx.dit.root, oldDN);
    if (!oldCP) {
        throw new Error(); // FIXME:
    }

    /**
     * Remove all entries from the old CP, ascending the DIT up until and
     * including the first CP. We have to use this approach because the naming
     * context superior to this OB's immediate superior naming context (the
     * "grandfather" naming context, if that helps) might actually belong
     * to this DSA! That would mean that we could accidentally delete our own
     * data! There is no problem (that I can see) with having dangling `glue`
     * DSEs lying around.
     */
    const oldImmediateSuperior = oldCP.immediateSuperior;
    let currentOld: Vertex | undefined = oldImmediateSuperior;
    if (!currentOld) {
        throw new Error(); // FIXME:
    }
    while (currentOld) {
        await deleteEntry(ctx, currentOld);
        if (currentOld.dse.cp) {
            break;
        }
        currentOld = currentOld.immediateSuperior;
    }

    let currentRoot = ctx.dit.root;
    for (let i = 0; i < mod.contextPrefixInfo.length; i++) {
        const vertex = mod.contextPrefixInfo[i];
        let immSuprAccessPoints: MasterAndShadowAccessPoints | undefined = undefined;
        const last: boolean =( mod.contextPrefixInfo.length === (i + 1));
        const existingEntry = await findEntry(ctx, currentRoot, [ vertex.rdn ]);
        if (existingEntry) {
            currentRoot = existingEntry;
            /**
             * We have already deleted any entries belonging to the superior
             * naming context ...
             *
             * Actually, I just realized a problem with this: what if the
             * grandfather naming context does NOT belong to this DSA and its
             * admin points or subentries have changed?
             *
             * Could you just bail out if the existing DSE is of type subr?
             */
            continue;
        }
        immSuprAccessPoints = vertex.accessPoints;
        const immSupr: boolean = Boolean(immSuprAccessPoints && last);
        const createdEntry = await createEntry(
            ctx,
            currentRoot,
            vertex.rdn,
            {
                glue: (!vertex.admPointInfo && !vertex.accessPoints),
                rhob: Boolean(vertex.admPointInfo),
                immSupr,
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
            vertex.admPointInfo?.flatMap(valuesFromAttribute) ?? [],
            [],
        );
        for (const subentry of (vertex.subentries ?? [])) {
            await createEntry(
                ctx,
                createdEntry,
                subentry.rdn,
                {
                    subentry: true,
                },
                subentry.info?.flatMap(valuesFromAttribute) ?? [],
                [],
            );
        }
    }
    const createdCP = await createEntry(
        ctx,
        currentRoot,
        newAgreement.rdn,
        {
            cp: true,
            immSupr: false, // This is supposed to be on the superior of this entry.
            entry: true,
        },
        mod.immediateSuperiorInfo?.flatMap((attr) => valuesFromAttribute(attr)) ?? [],
        [],
    );

    // This should not be present in a Sup2SubModification.
    // if (sup2sub.entryInfo) {
    //     const values = sup2sub.entryInfo.flatMap((attr) => valuesFromAttribute(attr));
    //     await writeEntryAttributes(ctx, subr, values);
    // }

    // TODO: Update the knowledge references of the root DSE (supr) if the highest NC has changed.
    // TODO: I think you need supr knowledge in the root DSE.
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
        Boolean(createdCP.dse.alias),
        mod.entryInfo,
        undefined,
    );
}

export default updateContextPrefix;
