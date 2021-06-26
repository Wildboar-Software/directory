import type { Context, AttributeInfo, ObjectClassInfo, LDAPSyntaxInfo, IndexableOID, StoredAttributeValueWithContexts } from "../../types";
import type {
    SearchRequest,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/SearchRequest.ta";
import {
    SearchResultEntry,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/SearchResultEntry.ta";
import type {
    SearchResultDone,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/SearchResultDone.ta";
import {
    LDAPResult,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult.ta";
import findEntry from "../../x500/findEntry";
import decodeLDAPDN from "../decodeLDAPDN";
import encodeLDAPDN from "../encodeLDAPDN";
import encodeLDAPOID from "@wildboar/ldap/src/lib/encodeLDAPOID";
import getDistinguishedName from "../../x500/getDistinguishedName";
import getSubset from "../../x500/getSubset";
import readEntry from "../../database/readEntry";
import { PartialAttribute } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/PartialAttribute.ta";
import groupByOID from "../../utils/groupByOID";
import {
    AttributeUsage,
    AttributeUsage_dSAOperation,
    AttributeUsage_directoryOperation,
    AttributeUsage_distributedOperation,
    AttributeUsage_userApplications,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import {
    ObjectClassKind,
    ObjectClassKind_abstract,
    ObjectClassKind_auxiliary,
    ObjectClassKind_structural,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import { objectNotFound } from "../results";
import normalizeAttributeDescription from "@wildboar/ldap/src/lib/normalizeAttributeDescription";

function usageToString (usage: AttributeUsage): string | undefined {
    return {
        [AttributeUsage_dSAOperation]: "dSAOperation",
        [AttributeUsage_directoryOperation]: "directoryOperation",
        [AttributeUsage_distributedOperation]: "distributedOperation",
        [AttributeUsage_userApplications]: "userApplications",
    }[usage];
}

function attributeInfoToLDAPAttributeType (attrSpec: AttributeInfo): string {
    let ret = `( ${attrSpec.id.toString()}`;
    if (attrSpec.ldapNames) {
        if (attrSpec.ldapNames.length > 1) {
            ret += ` NAME ( ${attrSpec.ldapNames.map((ln) => `'${ln}'`).join(" ")} )`;
        } else {
            ret += ` NAME '${attrSpec.ldapNames[0]}'`;
        }
    }
    if (attrSpec.ldapDescription) {
        ret += ` DESC '${attrSpec.ldapDescription.replace(/'/, "")}'`;
    }
    if (attrSpec.obsolete) {
        ret += " OBSOLETE";
    }
    if (attrSpec.parent) {
        ret += ` SUP ${attrSpec.parent.id.toString()}`;
    }
    if (attrSpec.ldapSyntax) {
        ret += ` SYNTAX ${attrSpec.ldapSyntax}`;
    }
    if (attrSpec.singleValued) {
        ret += " SINGLE-VALUE";
    }
    if (attrSpec.collective) {
        ret += " COLLECTIVE";
    }
    if (attrSpec.noUserModification) {
        ret += " NO-USER-MODIFICATION";
    }
    if (attrSpec.usage !== undefined) {
        const str = usageToString(attrSpec.usage);
        if (str) {
            ret += ` USAGE ${str}`;
        }
    }
    ret += " )";
    return ret;
}

function objectClassKindToString (kind: ObjectClassKind): string {
    return {
        [ObjectClassKind_abstract]: "ABSTRACT",
        [ObjectClassKind_auxiliary]: "AUXILIARY",
        [ObjectClassKind_structural]: "STRUCTURAL",
    }[kind];
}

function objectClassInfoToLDAPObjectClass (info: ObjectClassInfo): string {
    let ret = `( ${info.id}`;
    if (info.ldapNames) {
        if (info.ldapNames.length > 1) {
            ret += ` NAME ( ${info.ldapNames.map((ln) => `'${ln}'`).join(" ")} )`;
        } else {
            ret += ` NAME '${info.ldapNames[0]}'`;
        }
    }
    if (info.ldapDescription) {
        ret += ` DESC '${info.ldapDescription.replace(/'/, "")}'`;
    }
    // TODO: OBSOLETE
    // TODO: SUP
    if (info.kind !== undefined) {
        ret += ` ${objectClassKindToString(info.kind)}`;
    }
    if (info.mandatoryAttributes.size) {
        const oids = Array.from(info.mandatoryAttributes);
        ret += ` MUST ( ${oids.join(" $ ")} )`;
    }
    if (info.optionalAttributes.size) {
        const oids = Array.from(info.optionalAttributes);
        ret += ` MAY ( ${oids.join(" $ ")} )`;
    }
    ret += " )";
    return ret;
}

function ldapSyntaxToLDAPSyntax (info: LDAPSyntaxInfo): string {
    let ret = `( ${info.id}`;
    if (info.description) {
        ret += ` DESC '${info.description.replace(/'/, "")}'`;
    }
    ret += " )";
    return ret;
}

export
async function search (
    ctx: Context,
    req: SearchRequest,
    onEntry: (entry: SearchResultEntry) => Promise<void>,
): Promise<SearchResultDone> {
    const dn = decodeLDAPDN(ctx, req.baseObject);
    const entry = findEntry(ctx, ctx.database.data.dit, dn, req.derefAliases !== 0); // FIXME
    if (!entry) {
        ctx.log.warn(`Entry ${Buffer.from(req.baseObject).toString("utf-8")} not found.`);
        return objectNotFound;
    }
    ctx.log.info(`Searching for ${Buffer.from(req.baseObject).toString("utf-8")} with scope ${req.scope}.`);
    const results = getSubset(entry, req.scope);
    /**
     * These three variables correspond to the three cases defined in
     * IETF RFC 4511, Section 4.5.1.8.
     */
    const returnAllUserAttributesExclusively: boolean = (req.attributes.length === 0); // Case #1
    const returnAllUserAttributesInclusively: boolean = req.attributes.some((attr) => attr[0] === 0x2A); // Case #2
    const returnNoAttributes: boolean = (
        (req.attributes.length === 1)
        && (req.attributes[0].length === 3)
        && (req.attributes[0][0] === 0x31) // 1
        && (req.attributes[0][1] === 0x2E) // .
        && (req.attributes[0][2] === 0x31) // 1
    ); // Case #3
    const selectedAttributes: Set<IndexableOID> | null =
        (req.attributes.length) // Zero attributes means return all user attributes.
            ? new Set(
                req.attributes
                    .map((desc: Uint8Array) => normalizeAttributeDescription(desc))
                    .map((attr: string): string | undefined => {
                        if (attr === "1.1") {
                            return undefined;
                        }
                        const attrSpec = ctx.attributes.get(attr);
                        /**
                         * From IETF RFC 4511:
                         * > If an attribute description in the list is not recognized,
                         * > it is ignored by the server.
                         */
                        if (!attrSpec) {
                            return undefined;
                        }
                        return attrSpec.id.toString();
                    })
                    .filter((oid: string | undefined): oid is string => !!oid),
            )
            : null;
    await Promise.all(
        results.map(async (result) => {
            const attrs = await readEntry(ctx, result);
            let attrsToReturn = attrs;
            if (returnAllUserAttributesExclusively) {
                attrsToReturn = attrsToReturn
                    .filter((attr) => {
                        const ATTR_TYPE: string = attr.id.toString();
                        const attrSpec = ctx.attributes.get(ATTR_TYPE);
                        if (!attrSpec) {
                            return undefined;
                        }
                        return (attrSpec.usage === AttributeUsage_userApplications);
                    })
                    .filter((attr): attr is StoredAttributeValueWithContexts => !!attr);
            } else if (returnAllUserAttributesInclusively) {
                // FIXME: To be implemented.
            } else if (returnNoAttributes) {
                attrsToReturn = [];
            } else {
                attrsToReturn = attrsToReturn
                    .filter((attr) => !selectedAttributes || selectedAttributes.has(attr.id.toString()));
            }

            const groupedByType = groupByOID(attrsToReturn, (attr) => attr.id);
            const dn = getDistinguishedName(result);
            const entryRes = new SearchResultEntry(
                encodeLDAPDN(ctx, dn),
                [
                    ...Object.entries(groupedByType).map(([ , vals ]) => {
                        const attrType = vals[0].id;
                        const attrSpec = ctx.attributes.get(attrType.toString());
                        if (!attrSpec?.ldapSyntax) {
                            ctx.log.warn(`No LDAP syntax defined for attribute ${attrType.toString()}.`);
                            return undefined;
                        }
                        const ldapSyntax = ctx.ldapSyntaxes.get(attrSpec.ldapSyntax);
                        if (!ldapSyntax?.encoder) {
                            ctx.log.warn(`LDAP Syntax ${attrSpec.ldapSyntax} not understood or had no encoder.`);
                            return undefined;
                        }
                        // Note: some LDAP programs will not display the value if the attribute description is an OID.
                        return new PartialAttribute(
                            (attrSpec.ldapNames && attrSpec.ldapNames.length > 0)
                                ? Buffer.from(attrSpec.ldapNames[0], "utf-8")
                                : encodeLDAPOID(attrType),
                            vals.map((val) => ldapSyntax.encoder!(val.value)),
                        );
                    }).filter((attr): attr is PartialAttribute => !!attr),
                    new PartialAttribute(
                        Buffer.from("subschemaSubentry", "utf-8"),
                        [Buffer.from([])], // The RootDSE is always the schema subentry.
                    ),
                    ...(dn.length === 0) // This is a Root DSE.
                        ? [
                            new PartialAttribute(
                                Buffer.from("1.3.6.1.4.1.1466.115.121.1.3", "utf-8"), // Attribute Types
                                (Array.from(new Set(ctx.attributes.values()))
                                    .filter((attrSpec) => (
                                        attrSpec.ldapSyntax
                                        // && attrSpec.ldapNames
                                        // &&
                                    ))
                                    .map((attrSpec) => Buffer.from(
                                        attributeInfoToLDAPAttributeType(attrSpec),
                                        "utf-8",
                                    ))
                                ),
                            ),
                            new PartialAttribute(
                                Buffer.from("1.3.6.1.4.1.1466.115.121.1.37", "utf-8"), // Object Classes
                                (Array.from(new Set(ctx.objectClasses.values()))
                                    .map((oc) => Buffer.from(
                                        objectClassInfoToLDAPObjectClass(oc),
                                        "utf-8",
                                    ))
                                ),
                            ),
                            new PartialAttribute(
                                Buffer.from("1.3.6.1.4.1.1466.115.121.1.54", "utf-8"), // LDAP Syntaxes
                                (Array.from(new Set(ctx.ldapSyntaxes.values()))
                                    .map((ls) => Buffer.from(
                                        ldapSyntaxToLDAPSyntax(ls),
                                        "utf-8",
                                    ))
                                ),
                            ),
                            new PartialAttribute(
                                Buffer.from("supportedLDAPVersion", "utf-8"),
                                [Buffer.from("3", "utf-8")],
                            ),
                            new PartialAttribute(
                                Buffer.from("namingContexts", "utf-8"),
                                [Buffer.from("", "utf-8")], // Indicates this is a root-level directory.
                            ),
                            // new PartialAttribute(
                            //     Buffer.from("supportedControl", "utf-8"),
                            //     [], // No controls supported.
                            // ),
                            // new PartialAttribute(
                            //     Buffer.from("supportedExtension", "utf-8"),
                            //     [], // No extensions supported.
                            // ),
                            // new PartialAttribute(
                            //     Buffer.from("supportedFeatures", "utf-8"),
                            //     [], // No features supported.
                            // ),
                            new PartialAttribute(
                                Buffer.from("supportedSASLMechanisms", "utf-8"),
                                [
                                    Buffer.from("PLAIN"),
                                ],
                            ),
                        ]
                        : [],
                ],
            );
            await onEntry(entryRes);
        }),
    );
    return new LDAPResult(
        0, // Success
        req.baseObject,
        Buffer.from("Success", "utf-8"),
        undefined,
    );
}

export default search;
