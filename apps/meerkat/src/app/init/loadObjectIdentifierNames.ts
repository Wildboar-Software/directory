import type { Context } from "@wildboar/meerkat-types";
import { ObjectIdentifier } from "asn1-ts";
import {
    id_oc_alias,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oc-alias.va";

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
    // See https://www.ietf.org/proceedings/48/I-D/ldup-subentry-03.txt
    // Apache Directory Studio will fail to enumerate subentries without this.
    // NOTE: ADS's capitalization is different! ADS lowercases the E.
    ctx.objectIdentifierToName.set("2.16.840.1.113719.2.142.6.1.1", "ldapSubentry");
    ctx.nameToObjectIdentifier.set("ldapSubentry", new ObjectIdentifier([ 2,16,840,1,113719,2,142,6,1,1 ]));
    /**
     * For some reason, LDAP redefines `aliasedEntryName` as `aliasedObjectName`.
     */
    ctx.nameToObjectIdentifier.set("aliasedObjectName", id_oc_alias);
}

export default loadObjectIdentifierNames;
