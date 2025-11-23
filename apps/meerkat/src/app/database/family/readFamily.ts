import type { Context, Vertex } from "@wildboar/meerkat-types";
import readSubordinates from "../../dit/readSubordinates.js";
import {
    id_oc_parent,
} from "@wildboar/x500/InformationFramework";
import {
    id_oc_child,
} from "@wildboar/x500/InformationFramework";

const PARENT: string = id_oc_parent.toString();
const CHILD: string = id_oc_child.toString();

/**
 * @summary Create a new subtree of vertices that represent a compound entry
 * @description
 *
 * This function is given an entry that may or may not be a parent within a
 * compound entry. If it is not a parent, it simply returns immediately with no
 * subordinates.
 *
 * If it is of object class `parent`, this function will recurse into its
 * subordinates of object class `child`, producing an in-memory subtree of the
 * DIT that represents the compound entry alone.
 *
 * @param ctx The context object
 * @param ancestor The ancestor of a (potentially) compound entry
 * @returns A new vertex whose subordinates are only family members
 *
 * @function
 * @async
 */
export
async function readFamily (ctx: Context, ancestor: Vertex): Promise<Vertex> {
    if (!ancestor.dse.objectClass.has(PARENT)) {
        return {
            ...ancestor,
            subordinates: [],
        };
    }
    const subordinates = await readSubordinates(
        ctx,
        ancestor,
        undefined,
        undefined,
        undefined,
        {
            EntryObjectClass: {
                some: {
                    object_class: CHILD,
                },
            },
        },
    );
    return {
        ...ancestor,
        subordinates: await Promise.all(
            subordinates
                .filter((sub) => sub.dse.objectClass.has(CHILD))
                .map((sub) => readFamily(ctx, sub))
        ),
    };
}

export default readFamily;
