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
     *
     * This is already handled.
     */
    // ctx.nameToObjectIdentifier.set("aliasedObjectName", id_oc_alias);

    for (const [ oid, attr ] of ctx.attributeTypes.entries()) {
        if (oid.indexOf(".") === -1) {
            continue;
        }
        for (const name of attr.ldapNames ?? []) {
            const normalized: string = name.trim().toLowerCase();
            if (
                ctx.nameToObjectIdentifier.has(name)
                || ctx.nameToObjectIdentifier.has(normalized)
            ) {
                ctx.log.warn(ctx.i18n.t("log:duplicate_name", {
                    name,
                }));
                ctx.nameToObjectIdentifier.delete(name);
                ctx.nameToObjectIdentifier.delete(normalized);
                ctx.duplicatedLDAPNames.add(name);
                ctx.duplicatedLDAPNames.add(normalized);
                continue;
            }
            ctx.nameToObjectIdentifier.set(name, attr.id);
            ctx.nameToObjectIdentifier.set(normalized, attr.id);
            ctx.objectIdentifierToName.set(attr.id.toString(), name);
            ctx.objectIdentifierToName.set(attr.id.toString(), normalized);
        }
    }

    for (const [ oid, oc ] of ctx.objectClasses.entries()) {
        if (oid.indexOf(".") === -1) {
            continue;
        }
        for (const name of oc.ldapNames ?? []) {
            const normalized: string = name.trim().toLowerCase();
            if (
                ctx.nameToObjectIdentifier.has(name)
                || ctx.nameToObjectIdentifier.has(normalized)
            ) {
                ctx.log.warn(ctx.i18n.t("log:duplicate_name", {
                    name,
                }));
                ctx.nameToObjectIdentifier.delete(name);
                ctx.nameToObjectIdentifier.delete(normalized);
                ctx.duplicatedLDAPNames.add(name);
                ctx.duplicatedLDAPNames.add(normalized);
                continue;
            }
            ctx.nameToObjectIdentifier.set(name, oc.id);
            ctx.nameToObjectIdentifier.set(normalized, oc.id);
            ctx.objectIdentifierToName.set(oc.id.toString(), name);
            ctx.objectIdentifierToName.set(oc.id.toString(), normalized);
        }
    }

    for (const [ oid, ct ] of ctx.contextTypes.entries()) {
        if (oid.indexOf(".") === -1) {
            continue;
        }
        for (const name of ct.name ?? []) {
            const normalized: string = name.trim().toLowerCase();
            if (
                ctx.nameToObjectIdentifier.has(name)
                || ctx.nameToObjectIdentifier.has(normalized)
            ) {
                ctx.log.warn(ctx.i18n.t("log:duplicate_name", {
                    name,
                }));
                ctx.nameToObjectIdentifier.delete(name);
                ctx.nameToObjectIdentifier.delete(normalized);
                ctx.duplicatedLDAPNames.add(name);
                ctx.duplicatedLDAPNames.add(normalized);
                continue;
            }
            ctx.nameToObjectIdentifier.set(name, ct.id);
            ctx.nameToObjectIdentifier.set(normalized, ct.id);
            ctx.objectIdentifierToName.set(ct.id.toString(), name);
            ctx.objectIdentifierToName.set(ct.id.toString(), normalized);
        }
    }

    const matchingRules = [
        ...ctx.equalityMatchingRules.entries(),
        ...ctx.orderingMatchingRules.entries(),
        ...ctx.substringsMatchingRules.entries(),
    ];
    for (const [ oid, mr ] of matchingRules) {
        if (oid.indexOf(".") === -1) {
            continue;
        }
        for (const name of mr.name ?? []) {
            const normalized: string = name.trim().toLowerCase();
            if (
                ctx.nameToObjectIdentifier.has(name)
                || ctx.nameToObjectIdentifier.has(normalized)
            ) {
                ctx.log.warn(ctx.i18n.t("log:duplicate_name", {
                    name,
                }));
                ctx.nameToObjectIdentifier.delete(name);
                ctx.nameToObjectIdentifier.delete(normalized);
                ctx.duplicatedLDAPNames.add(name);
                ctx.duplicatedLDAPNames.add(normalized);
                continue;
            }
            ctx.nameToObjectIdentifier.set(name, mr.id);
            ctx.nameToObjectIdentifier.set(normalized, mr.id);
            ctx.objectIdentifierToName.set(mr.id.toString(), name);
            ctx.objectIdentifierToName.set(mr.id.toString(), normalized);
        }
    }
}

export default loadObjectIdentifierNames;
