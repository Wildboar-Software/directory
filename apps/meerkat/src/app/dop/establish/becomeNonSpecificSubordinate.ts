import type { Context, PendingUpdates } from "../../types/index.js";
import {
    MasterOrShadowAccessPoint,
} from "@wildboar/x500/DistributedOperations";
import {
    MasterOrShadowAccessPoint_category_master,
} from "@wildboar/x500/DistributedOperations";
import dnToVertex from "../../dit/dnToVertex.js";
import valuesFromAttribute from "../../x500/valuesFromAttribute.js";
import { DER } from "@wildboar/asn1/functional";
import addValues from "../../database/entry/addValues.js";
import {
    superiorKnowledge,
} from "@wildboar/x500/DSAOperationalAttributeTypes";
import {
    addValue,
} from "../../database/drivers/superiorKnowledge.js";
import {
    AccessPoint,
    _encode_AccessPoint,
} from "@wildboar/x500/DistributedOperations";
import isFirstLevelDSA from "../../dit/isFirstLevelDSA.js";
import {
    NHOBSubordinateToSuperior,
} from "@wildboar/x500/HierarchicalOperationalBindings";
import {
    NHOBSuperiorToSubordinate,
} from "@wildboar/x500/HierarchicalOperationalBindings";
import { createContextPrefixEntry } from "./becomeSubordinate.js";
import saveAccessPoint from "../../database/saveAccessPoint.js";
import { Knowledge } from "../../generated/client.js";

/**
 * @summary Create the necessary DSEs to establish a new non-specifi context prefix
 * @description
 *
 * This functions makes the local DSA a subordinate within a non-specific
 * hierarchical operational binding. That is, it creates all of the DSEs (or
 * just leaves them alone if they already exist) from the Root DSE all the way
 * down to the new context prefix.
 *
 * @param ctx The context object
 * @param superiorAccessPoint The superior DSA's access point
 * @param sup2sub The `NHOBSuperiorToSubordinate` argument of the HOB
 * @returns A `NHOBSubordinateToSuperior` that can be returned to the superior
 *  DSA in a Directory Operational Binding Management Protocol (DOP) result
 *
 * @function
 * @async
 */
export
async function becomeNonSpecificSubordinate (
    ctx: Context,
    superiorAccessPoint: AccessPoint,
    sup2sub: NHOBSuperiorToSubordinate,
    signErrors: boolean,
): Promise<NHOBSubordinateToSuperior> {
    let currentRoot = ctx.dit.root;
    for (let i = 0; i < sup2sub.contextPrefixInfo.length; i++) {
        const vertex = sup2sub.contextPrefixInfo[i];
        const last: boolean = (sup2sub.contextPrefixInfo.length === (i + 1));
        const existingEntry = await dnToVertex(ctx, currentRoot, [ vertex.rdn ]);
        if (!existingEntry) {
            const createdEntry = await createContextPrefixEntry(ctx, vertex, currentRoot, last, signErrors);
            currentRoot = createdEntry;
        } else {
            /**
             * In theory, this entry being of type "glue" should mean that it
             * has no attributes, and therefore, there should be no problem with
             * fully replacing it.
             *
             * Ideally, creating the entry and swapping it should be done as a
             * transaction, but unfortunately, this cannot be with Meerkat DSA!
             */
            if (existingEntry.dse.glue) {
                const createdEntry = await createContextPrefixEntry(ctx, vertex, currentRoot, last, signErrors);
                await ctx.db.entry.updateMany({
                    where: {
                        immediate_superior_id: existingEntry.dse.id,
                    },
                    data: {
                        immediate_superior_id: createdEntry.dse.id,
                    },
                });
            } else if (last) { // The superior DSA may update access points on the immSupr.
                await Promise.all(
                    vertex.accessPoints
                        ?.map((ap) => saveAccessPoint(
                            ctx,
                            ap,
                            Knowledge.SPECIFIC,
                            existingEntry.dse.id,
                        )) ?? [],
                );
            }
            currentRoot = existingEntry;
        }
    }

    await ctx.db.$transaction([
        /* This is in response to noticing that the administrative role values
        were doubled up from being present in both the contextPrefixInfo and
        immediateSuperiorInfo, but we just delete all attribute values to be
        thorough. This is important, since we do not check whether these values
        exist in this entry already or not. */
        ctx.db.attributeValue.deleteMany({
            where: {
                entry_id: currentRoot.dse.id,
            },
        }),
        ...await addValues(
            ctx,
            currentRoot,
            sup2sub.immediateSuperiorInfo?.flatMap(valuesFromAttribute) ?? [],
            undefined,
            false, // Do not check for existing values. This is essential for things like createTimestamp.
            signErrors,
        ),
    ]);

    const firstLevel: boolean = await isFirstLevelDSA(ctx);
    if (!firstLevel) { // Update superiorKnowledge
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
                select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
            }),
            ...pendingUpdates.otherWrites,
        ]);
    }

    const myAccessPoint = ctx.dsa.accessPoint;
    return new NHOBSubordinateToSuperior(
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
        undefined,
    );
}

export default becomeNonSpecificSubordinate;
