import type { Context, Vertex } from "@wildboar/meerkat-types";
import {
    id_oc_child,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oc-child.va";

const CHILD: string = id_oc_child.toString();

/**
 * @summary Delete children within a compound entry
 * @description
 *
 * Deletes children from a compound entry
 *
 * @param ctx The context object
 * @param id the ID of the immediate superior whose children are to be deleted
 *
 * @function
 * @async
 */
async function deleteChildren (ctx: Context, id: number): Promise<void> {
    const children = await ctx.db.entry.findMany({
        where: {
            immediate_superior_id: id,
            EntryObjectClass: {
                some: {
                    object_class: CHILD,
                },
            },
        },
        select: {
            id: true,
        },
    });
    await Promise.all(children.map((child) => deleteChildren(ctx, child.id)));
    await ctx.db.$transaction([
        ctx.db.attributeValue.deleteMany({
            where: {
                entry_id: id,
            },
        }),
        ctx.db.entry.updateMany({
            where: {
                id: id,
            },
            data: {
                deleteTimestamp: new Date(),
            },
        }),
    ]);
}

/**
 * @summary Delete a DSE
 * @description
 *
 * Deletes a DSE from the database and from the subordinates of the superior, if
 * the superior has its subordinates in memory.
 *
 * @param ctx The context object
 * @param entry The vertex to be deleted
 * @param alsoDeleteFamily Whether to also delete childre
 *
 * @function
 * @async
 */
export
async function deleteEntry (
    ctx: Context,
    entry: Vertex,
    alsoDeleteFamily: boolean = false,
): Promise<void> {
    if (entry.dse.root && !entry.immediateSuperior) {
        return; // Protects us from accidentally deleting the Root DSE.
    }
    if (alsoDeleteFamily) {
        await deleteChildren(ctx, entry.dse.id);
    } else {
        await ctx.db.$transaction([
            ctx.db.attributeValue.deleteMany({
                where: {
                    entry_id: entry.dse.id,
                },
            }),
            ctx.db.entry.update({
                where: {
                    id: entry.dse.id,
                },
                data: {
                    deleteTimestamp: new Date(),
                },
                select: null,
            }),
        ]);
        if (entry.immediateSuperior?.subordinates?.length) {
            const entryIndex = entry.immediateSuperior.subordinates
                .findIndex((child) => (child.dse.uuid === entry.dse.uuid));
            entry.immediateSuperior.subordinates.splice(entryIndex, 1);
        }
    }
}

export default deleteEntry;

