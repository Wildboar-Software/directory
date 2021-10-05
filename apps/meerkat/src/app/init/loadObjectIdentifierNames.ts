import type { Context } from "../types";
import { ObjectIdentifier } from "asn1-ts";

export
async function loadObjectIdentifierNames (ctx: Context): Promise<void> {
    const namedOids = await ctx.db.namedObjectIdentifier.findMany({
        select: { // We do not need the database ID.
            name: true,
            oid: true,
        },
    });
    for (const noid of namedOids) {
        ctx.nameToObjectIdentifier.set(noid.name, ObjectIdentifier.fromString(noid.oid));
        ctx.objectIdentifierToName.set(noid.oid, noid.name);
    }
}

export default loadObjectIdentifierNames;
