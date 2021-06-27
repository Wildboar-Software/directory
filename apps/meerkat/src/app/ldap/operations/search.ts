import type {
    Context,
    Entry,
    AttributeInfo,
    ObjectClassInfo,
    LDAPSyntaxInfo,
    IndexableOID,
    StoredAttributeValueWithContexts
} from "../../types";
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
import readEntryAttributes from "../../database/readEntryAttributes";
import {
    PartialAttribute,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/PartialAttribute.ta";
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
import compareAttributeDescription from "@wildboar/ldap/src/lib/compareAttributeDescription";
import evaluateFilter from "@wildboar/ldap/src/lib/evaluateFilter";
import type { OBJECT_IDENTIFIER } from "asn1-ts";
import type EqualityMatcher from "@wildboar/ldap/src/lib/types/EqualityMatcher";
import type SubstringsMatcher from "@wildboar/ldap/src/lib/types/SubstringsMatcher";
import type OrderingMatcher from "@wildboar/ldap/src/lib/types/OrderingMatcher";
import type ApproxMatcher from "@wildboar/ldap/src/lib/types/ApproxMatcher";
import type {
    LDAPString,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPString.ta";
import LDAPSyntaxDecoder from "@wildboar/ldap/src/lib/types/LDAPSyntaxDecoder";
import isAttributeSubtype from "../../x500/isAttributeSubtype";

type EntryInfo = [
    entry: Entry,
    user: StoredAttributeValueWithContexts[],
    operational: StoredAttributeValueWithContexts[],
];

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
        ret += ` SUP ${attrSpec.parent.toString()}`;
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
    if (info.obsolete) {
        ret += " OBSOLETE";
    }
    if (info.superclasses.size === 1) {
        const oids = Array.from(info.superclasses);
        ret += ` SUP ${oids[0]}`;
    } else if (info.superclasses.size > 1) {
        const oids = Array.from(info.superclasses);
        ret += ` SUP ( ${oids.join(" $ ")} )`;
    }
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



// function isSubtype (ad: LDAPString, parent: LDAPString): boolean {
//     const parentDesc = normalizeAttributeDescription(parent);
//     const childDesc = normalizeAttributeDescription(ad);
//     const

//     return isAttributeSubtype(ctx)
// };

export
async function search (
    ctx: Context,
    req: SearchRequest,
    onEntry: (entry: SearchResultEntry) => Promise<void>,
): Promise<SearchResultDone> {
    const startTime = new Date();
    const dn = decodeLDAPDN(ctx, req.baseObject);
    const entry = findEntry(ctx, ctx.database.data.dit, dn, req.derefAliases !== 0); // FIXME
    if (!entry) {
        ctx.log.warn(`Entry ${Buffer.from(req.baseObject).toString("utf-8")} not found.`);
        return objectNotFound;
    }
    ctx.log.info(`Searching for ${Buffer.from(req.baseObject).toString("utf-8")} with scope ${req.scope}.`);
    const subset = getSubset(entry, req.scope);
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
        // Zero attributes means return all user attributes.
        // We also skip this step if we are returning no attributes anyway.
        (req.attributes.length && !returnNoAttributes)
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

    const candidates: EntryInfo[] = await Promise.all(
        subset
            .map(async (subsetMember): Promise<EntryInfo> => {
                const {
                    userAttributes,
                    operationalAttributes,
                } = await readEntryAttributes(ctx, subsetMember, {
                    attributesSelect: (
                        returnAllUserAttributesExclusively
                        || returnAllUserAttributesInclusively
                    )
                        ? undefined
                        : req.attributes
                        .map((desc: Uint8Array): OBJECT_IDENTIFIER | undefined => {
                            const attributeType = normalizeAttributeDescription(desc);
                            const spec = ctx.attributes.get(attributeType);
                            if (!spec) {
                                return undefined;
                            }
                            return spec.id;
                        })
                        .filter((oid: OBJECT_IDENTIFIER | undefined): oid is OBJECT_IDENTIFIER => !!oid),
                    contextSelection: undefined,
                    returnContexts: false,
                });
                return [ subsetMember, userAttributes, operationalAttributes ];
            }),
    );

    // TODO: Filter attributes by permission before they are used for filtering!

    const sizeLimit = (req.sizeLimit > 0)
        ? req.sizeLimit
        : Number.MAX_SAFE_INTEGER;
    const timeLimit = (req.timeLimit > 0)
        ? req.timeLimit
        : 3600; // We automatically restrict the run-time of the query to one hour.
    let returnedResults: number = 0;
    for (const [ candidate, userAttrs, opAttrs ] of candidates) {
        if (req.filter) {
            const dn = getDistinguishedName(candidate);
            const groupedByType = groupByOID([
                ...userAttrs,
                ...opAttrs,
            ], (attr) => attr.id);
            const attrs = Object.values(groupedByType)
                .map((attrsOfSameType): PartialAttribute | undefined => {
                    const attrSpec = ctx.attributes.get(attrsOfSameType[0].id.toString());
                    if (!attrSpec?.ldapSyntax) {
                        return undefined;
                    }
                    const ldapSyntax = ctx.ldapSyntaxes.get(attrSpec.ldapSyntax.toString());
                    if (!ldapSyntax?.encoder) {
                        return undefined;
                    }
                    const encode = ldapSyntax.encoder;
                    return new PartialAttribute(
                        Buffer.from(attrsOfSameType[0].id.toString(), "utf-8"),
                        attrsOfSameType.map((attr) => encode(attr.value)),
                    );
                })
                .filter((attr): attr is PartialAttribute => !!attr);
            const matched: boolean | undefined = evaluateFilter(
                req.filter,
                dn.map((rdn) => rdn.map((atav) => [ atav.type_, atav.value ])),
                attrs,
                {
                    getLDAPSyntaxDecoder: (ad: LDAPString): LDAPSyntaxDecoder | undefined => {
                        const desc = normalizeAttributeDescription(ad);
                        return ctx.ldapSyntaxes.get(desc)?.decoder;
                    },
                    getEqualityMatcher: (ad: LDAPString): EqualityMatcher | undefined => {
                        const desc = normalizeAttributeDescription(ad);
                        return ctx.attributes.get(desc)?.equalityMatcher;
                    },
                    getSubstringsMatcher: (ad: LDAPString): SubstringsMatcher | undefined => {
                        const desc = normalizeAttributeDescription(ad);
                        return ctx.attributes.get(desc)?.substringsMatcher;
                    },
                    getOrderingMatcher: (ad: LDAPString): OrderingMatcher | undefined => {
                        const desc = normalizeAttributeDescription(ad);
                        return ctx.attributes.get(desc)?.orderingMatcher;
                    },
                    getApproxMatcher: (ad: LDAPString): ApproxMatcher | undefined => {
                        const desc = normalizeAttributeDescription(ad);
                        return ctx.attributes.get(desc)?.approxMatcher;
                    },
                    isSubtype: (ad: LDAPString, parent: LDAPString): boolean => {
                        const parentDesc = normalizeAttributeDescription(parent);
                        const childDesc = normalizeAttributeDescription(ad);
                        const parentSpec = ctx.attributes.get(parentDesc);
                        const childSpec = ctx.attributes.get(childDesc);
                        if (!parentSpec || !childSpec) {
                            return compareAttributeDescription(ad, parent);
                        }
                        return Boolean(isAttributeSubtype(ctx, childSpec.id, parentSpec.id));
                    },
                },
            );
            if (matched === false) {
                break;
            }
        }

        let attrsToReturn: StoredAttributeValueWithContexts[] = [];
        if (returnAllUserAttributesExclusively) {
            attrsToReturn = userAttrs;
        } else if (returnAllUserAttributesInclusively && selectedAttributes) {
            attrsToReturn = [
                ...userAttrs,
                ...opAttrs
                    .filter((oa) => (selectedAttributes.has(oa.id.toString())))
            ];
        } else if (returnNoAttributes) {
            attrsToReturn = [];
        } else {
            attrsToReturn = attrsToReturn
                .filter((attr) => !selectedAttributes || selectedAttributes.has(attr.id.toString()));
        }

        const groupedByType = groupByOID(attrsToReturn, (attr) => attr.id);
        const dn = getDistinguishedName(candidate);
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
                    const ldapSyntax = ctx.ldapSyntaxes.get(attrSpec.ldapSyntax.toString());
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
            ]
                .map((pa) => {
                    if (req.typesOnly) {
                        return new PartialAttribute(
                            pa.type_,
                            [],
                        );
                    } else {
                        return pa;
                    }
                }),
        );
        await onEntry(entryRes);
        returnedResults++;
        if (returnedResults >= sizeLimit) {
            break;
        }
        const entryTime = new Date();
        if ((entryTime.valueOf() - startTime.valueOf()) > (timeLimit * 1000)) {
            break;
        }
    }

    return new LDAPResult(
        0, // Success
        req.baseObject,
        Buffer.from("Success", "utf-8"),
        undefined,
    );
}

export default search;
