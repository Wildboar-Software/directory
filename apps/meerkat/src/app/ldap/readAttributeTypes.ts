import type { Context } from "@wildboar/meerkat-types";
import {
    AttributeUsage,
    AttributeUsage_dSAOperation,
    AttributeUsage_directoryOperation,
    AttributeUsage_distributedOperation,
    AttributeUsage_userApplications,
} from "@wildboar/x500/InformationFramework";

function escape (str: string): string {
    return str
        .replace(/'/g, "\\27")
        .replace(/\\/g, "\\5C")
        ;
}

function au2str (au: AttributeUsage): string {
    switch (au) {
        case (AttributeUsage_userApplications): return "userApplications";
        case (AttributeUsage_directoryOperation): return "directoryOperation";
        case (AttributeUsage_distributedOperation): return "distributedOperation";
        case (AttributeUsage_dSAOperation): return "dSAOperation";
        default: return "userApplications";
    }
}

let cachedValues: Buffer[] | null = null;

/**
 * @summary Read attribute types directly into LDAP attribute type descriptions
 * @description
 *
 * This function exists just to read attribute types directly into LDAP
 * attribute type descriptions. This bypasses the conversion to X.500
 * `AttributeTypeDescription` as an intermediary.
 *
 * @param ctx The context object
 * @returns Bytes that encode the LDAP string values of the `attributeTypes` type
 *
 * @function
 */
export
function readAttributeTypes (
    ctx: Readonly<Context>,
): Buffer[] {
    if (cachedValues) {
        return cachedValues;
    }
    cachedValues = Array.from(ctx.attributeTypes.entries())
        .filter(([ k ]) => (k.indexOf(".") > -1)) // Dedupes entries by only using OIDs, not descriptors.
        .map(([ , v ]) => v)
        .map((attr) => {
            const fields: string[] = [
                attr.id.toString(),
            ];
            if (attr.ldapNames?.length) {
                fields.push(`NAME ( ${attr.ldapNames.map((n) => `'${escape(n)}'`).join(" ")} )`);
            }
            if (attr.ldapDescription) {
                fields.push(`DESC '${escape(attr.ldapDescription)}'`);
            }
            if (attr.obsolete) {
                fields.push("OBSOLETE");
            }
            if (attr.parent) {
                fields.push(`SUP ${attr.parent.toString()}`);
            }
            if (attr.equalityMatchingRule) {
                fields.push(`EQUALITY ${attr.equalityMatchingRule.toString()}`);
            }
            if (attr.orderingMatchingRule) {
                fields.push(`ORDERING ${attr.orderingMatchingRule.toString()}`);
            }
            if (attr.substringsMatchingRule) {
                fields.push(`SUBSTR ${attr.substringsMatchingRule.toString()}`);
            }
            if (attr.ldapSyntax) {
                fields.push(`SYNTAX ${attr.ldapSyntax.toString()}`);
            }
            if (attr.singleValued) {
                fields.push("SINGLE-VALUE");
            }
            if (attr.collective) {
                fields.push("COLLECTIVE");
            }
            if (attr.noUserModification) {
                fields.push("NO-USER-MODIFICATION");
            }
            fields.push(`USAGE ${au2str(attr.usage)}`);
            return Buffer.from(`( ${fields.join(" ")} )`, "utf-8");
        });
    return cachedValues;
}

export default readAttributeTypes;
