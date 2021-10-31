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
import readChildren from "./readChildren";

const MAX_TRAVERSAL: number = 100000;
const AUTONOMOUS: string = id_ar_autonomousArea.toString();
const SUBSCHEMA: string = id_ar_subschemaAdminSpecificArea.toString();
const SUBSCHEMA_OC: string = id_soc_subschema.toString();

export
async function getSubschemaSubentry (
    ctx: Context,
    entry: Vertex,
): Promise<Vertex | undefined> {
    let current = entry;
    let i: number = 0;
    while (i < MAX_TRAVERSAL) {
        if (current.dse.admPoint?.administrativeRole.has(SUBSCHEMA)) {
            const results = await readChildren(ctx, current, undefined, undefined, undefined, {
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
                .filter((result) => result.dse.objectClass.has(SUBSCHEMA_OC))[0];
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
