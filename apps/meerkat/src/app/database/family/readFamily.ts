import type { Context, Vertex } from "@wildboar/meerkat-types";
import readSubordinates from "../../dit/readSubordinates";
import {
    id_oc_parent,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oc-parent.va";
import {
    id_oc_child,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oc-child.va";

const PARENT: string = id_oc_parent.toString();
const CHILD: string = id_oc_child.toString();

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
