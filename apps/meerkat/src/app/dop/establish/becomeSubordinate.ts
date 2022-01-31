import type { Context, PendingUpdates } from "@wildboar/meerkat-types";
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
    MasterOrShadowAccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterOrShadowAccessPoint.ta";
import {
    MasterOrShadowAccessPoint_category_master,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterOrShadowAccessPoint-category.ta";
import findEntry from "../../x500/findEntry";
import valuesFromAttribute from "../../x500/valuesFromAttribute";
import { Knowledge } from "@prisma/client";
import { DER } from "asn1-ts/dist/node/functional";
import createEntry from "../../database/createEntry";
import addValues from "../../database/entry/addValues";
import {
    superiorKnowledge,
} from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/superiorKnowledge.oa";
import {
    addValue,
} from "../../database/drivers/superiorKnowledge";
import {
    AccessPoint,
    _encode_AccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import saveAccessPoint from "../../database/saveAccessPoint";

export
async function becomeSubordinate (
    ctx: Context,
    superiorAccessPoint: AccessPoint,
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
            const immSupr: boolean = Boolean(immSuprAccessPoints && last);
            const createdEntry = await createEntry(
                ctx,
                currentRoot,
                vertex.rdn,
                {
                    glue: (!vertex.admPointInfo && !vertex.accessPoints),
                    rhob: Boolean(vertex.admPointInfo),
                    immSupr,
                },
                vertex.admPointInfo?.flatMap(valuesFromAttribute) ?? [],
                [],
            );
            await Promise.all(
                vertex.accessPoints?.map((ap) => saveAccessPoint(
                    ctx, ap, Knowledge.SPECIFIC, createdEntry.dse.id)) ?? [],
            );
            currentRoot = createdEntry;
            for (const subentry of (vertex.subentries ?? [])) {
                await createEntry(
                    ctx,
                    currentRoot,
                    subentry.rdn,
                    {
                        subentry: true,
                        rhob: true,
                    },
                    subentry.info?.flatMap(valuesFromAttribute) ?? [],
                    [],
                );
            }
        } else {
            currentRoot = existingEntry;
        }
    }
    const createdCP = await createEntry(
        ctx,
        currentRoot,
        agreement.rdn,
        {
            cp: true,
            immSupr: false, // This is supposed to be on the superior of this entry.
        },
        sup2sub.entryInfo?.flatMap(valuesFromAttribute) ?? [],
    );
    const itinerantDN = [ ...agreement.immediateSuperior, agreement.rdn ];
    const existing = await findEntry(ctx, ctx.dit.root, itinerantDN, false);
    /**
     * These steps below "swap out" an existing entry with the entry created by
     * the HOB, keeping the immediate superior and the subordinates the same in
     * the process.
     *
     * Note that this does NOT throw an error when the entry already exists.
     * This is so Meerkat DSA can do what is called "Subordinate Repatriation."
     * When an HOB is terminated, the subordinate's entries are not deleted.
     * They are kept, and the HOB is simply never updated again. Once a new HOB
     * is established with the same context prefix, the existing entry, and all
     * of its subordinates are "repatriated," so that an expired or deleted HOB
     * can "pick up where it left off."
     */
    if (existing) {
        await ctx.db.$transaction([
            ctx.db.entry.updateMany({
                where: {
                    immediate_superior_id: existing.dse.id,
                },
                data: {
                    immediate_superior_id: createdCP.dse.id,
                },
            }),
            ctx.db.entry.update({
                where: {
                    id: existing.dse.id,
                },
                data: {
                    deleteTimestamp: new Date(),
                },
            }),
            ...await addValues(
                ctx,
                currentRoot.immediateSuperior!,
                sup2sub.immediateSuperiorInfo?.flatMap(valuesFromAttribute) ?? [],
                [],
            ),
        ]);
        // Take on the subordinates of the existing entry.
        createdCP.subordinates = existing.subordinates;
        // Set the existing entry's subordinates to `null`, just to free up a reference.
        existing.subordinates = null;
        if (existing.immediateSuperior?.subordinates?.length) {
            // Remove the existing entry from its parent.
            existing.immediateSuperior.subordinates = existing
                .immediateSuperior
                .subordinates
                .filter((sub) => sub.dse.id !== existing.dse.id);
            // Add the new entry to the subordinates.
            existing.immediateSuperior.subordinates.push(createdCP);
        }
    } else {
        await ctx.db.$transaction(
            await addValues(
                ctx,
                currentRoot.immediateSuperior!,
                sup2sub.immediateSuperiorInfo?.flatMap(valuesFromAttribute) ?? [],
                [],
            ),
        );
    }

    { // Update superiorKnowledge
        const pendingUpdates: PendingUpdates = {
            entryUpdate: {},
            otherWrites: [],
        };
        await addValue(ctx, ctx.dit.root, {
            type: superiorKnowledge["&id"],
            value: _encode_AccessPoint(superiorAccessPoint, DER),
        }, pendingUpdates);
        await ctx.db.$transaction([
            ctx.db.entry.update({
                where: {
                    id: ctx.dit.root.dse.id,
                },
                data: {
                    ...pendingUpdates.entryUpdate,
                },
            }),
            ...pendingUpdates.otherWrites,
        ]);
    }

    const myAccessPoint = ctx.dsa.accessPoint;
    return new SubordinateToSuperior(
        [
            new MasterOrShadowAccessPoint(
                myAccessPoint.ae_title,
                myAccessPoint.address,
                myAccessPoint.protocolInformation,
                MasterOrShadowAccessPoint_category_master, // Could not be otherwise.
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
        sup2sub.entryInfo,
        undefined,
    );
}

export default becomeSubordinate;
