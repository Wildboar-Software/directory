import type { Context } from "@wildboar/meerkat-types";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import rdnToID from "./rdnToID";

export
async function dnToID (
    ctx: Context,
    root_id: number,
    dn: DistinguishedName,
): Promise<number | undefined> {
    let currentRootId: number = root_id;
    for (let i = 0; i < dn.length; i++) {
        const id = await rdnToID(ctx, currentRootId, dn[i]);
        if (!id) {
            return undefined;
        }
        currentRootId = id;
    }
    return currentRootId;
}

export default dnToID;
