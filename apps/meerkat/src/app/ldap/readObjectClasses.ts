import type { Context } from "@wildboar/meerkat-types";
import {
    ObjectClassKind,
    ObjectClassKind_abstract,
    ObjectClassKind_auxiliary,
    ObjectClassKind_structural,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";

function escape (str: string): string {
    return str
        .replace(/'/g, "\\27")
        .replace(/\\/g, "\\5C")
        ;
}

function ock2str (ock: ObjectClassKind): string {
    switch (ock) {
        case (ObjectClassKind_abstract): return "ABSTRACT";
        case (ObjectClassKind_auxiliary): return "AUXILIARY";
        case (ObjectClassKind_structural): return "STRUCTURAL";
        default: return "STRUCTURAL";
    }
}

let cachedValues: Buffer[] | null = null;

/**
 * @description
 *
 * This function exists just to read object classes directly into LDAP
 * object class descriptions.
 *
 * @param ctx
 * @returns
 */
export
function readObjectClasses (
    ctx: Readonly<Context>,
): Buffer[] {
    if (cachedValues) {
        return cachedValues;
    }
    cachedValues = Array.from(ctx.objectClasses.entries())
        .filter(([ k ]) => (k.indexOf(".") > -1)) // Dedupes entries by only using OIDs, not descriptors.
        .map(([ , v ]) => v)
        .map((oc) => {
            const fields: string[] = [
                oc.id.toString(),
            ];
            if (oc.ldapNames?.length) {
                fields.push(`NAME ( ${oc.ldapNames.map((n) => `'${escape(n)}'`).join(" ")} )`);
            }
            if (oc.ldapDescription) {
                fields.push(`DESC '${escape(oc.ldapDescription)}'`);
            }
            if (oc.obsolete) {
                fields.push("OBSOLETE");
            }
            if (oc.superclasses.size) {
                const superclasses = Array.from(oc.superclasses);
                fields.push(`SUP ( ${superclasses.join(" $ ")} )`);
            }
            fields.push(ock2str(oc.kind));
            if (oc.mandatoryAttributes.size) {
                const mandatory = Array.from(oc.mandatoryAttributes);
                fields.push(`MUST ( ${mandatory.join(" $ ")} )`);
            }
            if (oc.optionalAttributes.size) {
                const optional = Array.from(oc.optionalAttributes);
                fields.push(`MAY ( ${optional.join(" $ ")} )`);
            }
            return Buffer.from(`( ${fields.join(" ")} )`, "utf-8");
        });
    return cachedValues;
}

export default readObjectClasses;
