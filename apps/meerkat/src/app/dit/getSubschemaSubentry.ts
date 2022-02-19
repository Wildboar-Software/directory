import type { Context, Vertex } from "@wildboar/meerkat-types";
import {
    id_ar_autonomousArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-autonomousArea.va";
import {
    id_ar_subschemaAdminSpecificArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-subschemaAdminSpecificArea.va";
import {
    id_soc_subschema,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/id-soc-subschema.va";
import readSubordinates from "./readSubordinates";
import { MAX_TRAVERSAL } from "../constants";

const AUTONOMOUS: string = id_ar_autonomousArea.toString();
const SUBSCHEMA: string = id_ar_subschemaAdminSpecificArea.toString();
const SUBSCHEMA_OC: string = id_soc_subschema.toString();

/**
 * @summary Get the subschema subentry that applies to a specified entry
 * @description
 *
 * Gets the subschema subentry that applies to the entry specified with the
 * `entry` parameter. Note that, in the X.500 specifications, subschema
 * subentries are required to have a subtree specification that encompasses the
 * entire administrative area, and there may not be more than one subschema
 * subentry within a subschema administrative area.
 *
 * @param ctx The contxt object
 * @param entry The DSE whose applicable subschema is to be located
 * @returns A the vertex of the applicable subschema, if it can be found, or
 *  `undefined` otherwise
 *
 * @function
 * @async
 */
export
async function getSubschemaSubentry (
    ctx: Context,
    entry: Vertex,
): Promise<Vertex | undefined> {
    let current = entry;
    let i: number = 0;
    while (i < MAX_TRAVERSAL) {
        if (current.dse.admPoint?.administrativeRole.has(SUBSCHEMA)) {
            const results = await readSubordinates(ctx, current, undefined, undefined, undefined, {
                subentry: true,
                EntryObjectClass: {
                    some: {
                        object_class: SUBSCHEMA_OC,
                    },
                },
            });
            // Return the first one that we find, since there is only supposed
            // to be one subschema anyway.
            return results
                .find((result) => result.dse.objectClass.has(SUBSCHEMA_OC));
        }
        if (current.dse.admPoint?.administrativeRole.has(AUTONOMOUS)) {
            return;
        }
        if (!current.immediateSuperior) {
            return;
        }
        current = current.immediateSuperior;
        i++;
    }
}

export default getSubschemaSubentry;
