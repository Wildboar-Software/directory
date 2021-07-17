import type {
    Context,
    Vertex,
    AttributeInfo,
    ObjectClassInfo,
    LDAPSyntaxInfo,
    IndexableOID,
    StoredAttributeValueWithContexts
} from "../../types";
import type LDAPConnection from "../LDAPConnection";
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
import {
    LDAPResult_resultCode_insufficientAccessRights,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult-resultCode.ta";
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
import { OBJECT_IDENTIFIER, ASN1Element } from "asn1-ts";
import type EqualityMatcher from "@wildboar/ldap/src/lib/types/EqualityMatcher";
import type SubstringsMatcher from "@wildboar/ldap/src/lib/types/SubstringsMatcher";
import type OrderingMatcher from "@wildboar/ldap/src/lib/types/OrderingMatcher";
import type ApproxMatcher from "@wildboar/ldap/src/lib/types/ApproxMatcher";
import type {
    LDAPString,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPString.ta";
import LDAPSyntaxDecoder from "@wildboar/ldap/src/lib/types/LDAPSyntaxDecoder";
import isAttributeSubtype from "../../x500/isAttributeSubtype";
import type { Control } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/Control.ta";
import {
    NameAndOptionalUID,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/NameAndOptionalUID.ta";
import getACIItems from "../../dit/getACIItems";
import getACDFTuplesFromACIItem from "@wildboar/x500/src/lib/bac/getACDFTuplesFromACIItem";
import type ACDFTuple from "@wildboar/x500/src/lib/types/ACDFTuple";
import type ACDFTupleExtended from "@wildboar/x500/src/lib/types/ACDFTupleExtended";
import bacACDF, {
    PERMISSION_CATEGORY_READ,
    PERMISSION_CATEGORY_FILTER_MATCH,
} from "@wildboar/x500/src/lib/bac/bacACDF";
import getAdministrativePoint from "../../dit/getAdministrativePoint";
import type {
    AuthenticationLevel,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel.ta";
import {
    AuthenticationLevel_basicLevels,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels.ta";
import checkDiscoverabilityOfEntry from "../../bac/checkDiscoverabilityOfEntry";
import {
    AttributeValue,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/AttributeValue.ta";
import { AttributeTypeAndValue } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
import getIsGroupMember from "../../bac/getIsGroupMember";
import userWithinACIUserClass from "@wildboar/x500/src/lib/bac/userWithinACIUserClass";
import { subentries } from "@wildboar/ldap/src/lib/controls";
import decodeLDAPOID from "@wildboar/ldap/src/lib/decodeLDAPOID";
import {
    SearchRequest_scope_baseObject,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/SearchRequest-scope.ta"

type EntryInfo = [
    entry: Vertex,
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

function rootDSEAttributes (ctx: Context): PartialAttribute[] {
    return [
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
    ];
}

export
async function search (
    ctx: Context,
    conn: LDAPConnection,
    req: SearchRequest,
    onEntry: (entry: SearchResultEntry) => Promise<void>,
    controls: Control[] = [],
): Promise<SearchResultDone> {
    const useSubentries: boolean = controls
        .some((control) => (
            decodeLDAPOID(control.controlType).isEqualTo(subentries)
            && (control.controlValue?.[2] === 0xFF) // BOOLEAN TRUE
        ));
    const EQUALITY_MATCHER = (
        attributeType: OBJECT_IDENTIFIER,
    ): EqualityMatcher | undefined => ctx.attributes.get(attributeType.toString())?.equalityMatcher;
    const isMemberOfGroup = getIsGroupMember(ctx, EQUALITY_MATCHER);
    const authLevel: AuthenticationLevel = {
        basicLevels: new AuthenticationLevel_basicLevels(
            conn.authLevel,
            undefined,
            undefined,
        ),
    };
    const userDN = conn.boundEntry
        ? getDistinguishedName(conn.boundEntry)
        : undefined;
    const userName = userDN
        ? new NameAndOptionalUID(userDN, undefined)
        : undefined;

    const startTime = new Date();
    const dn = decodeLDAPDN(ctx, req.baseObject);
    const entry = await findEntry(ctx, ctx.dit.root, dn, req.derefAliases !== 0); // FIXME
    if (!entry) {
        ctx.log.warn(`Entry ${Buffer.from(req.baseObject).toString("utf-8")} not found.`);
        return objectNotFound;
    }

    // const admPoint = getAdministrativePoint(entry);
    // const admPointDN = admPoint
    //     ? getDistinguishedName(admPoint)
    //     : undefined;
    const entryACIs = await getACIItems(ctx, entry);
    const entryACDFTuples: ACDFTuple[] = (entryACIs ?? [])
        .flatMap((aci) => getACDFTuplesFromACIItem(aci));
    if (entryACDFTuples) {
        if (!userName) {
            return new LDAPResult(
                LDAPResult_resultCode_insufficientAccessRights,
                req.baseObject,
                Buffer.from("Anonymous users not permitted. Please authenticate first."),
                undefined,
            );
        }
        const canDiscoverBaseObject: boolean = await checkDiscoverabilityOfEntry(ctx, userName, authLevel, entry);
        if (!canDiscoverBaseObject) {
            return objectNotFound;
        }
    }

    const subset = await getSubset(ctx, entry, req.scope);
    const permittedSubset: Vertex[] = [];
    for (const result of subset) {
        if (
            result.dse.subentry
            && !(useSubentries || (req.scope === SearchRequest_scope_baseObject))
        ) {
            continue;
        }
        if (entryACDFTuples) {
            const canDiscover: boolean = await checkDiscoverabilityOfEntry(ctx, userName!, authLevel, result);
            if (canDiscover) {
                permittedSubset.push(result);
            }
        } else {
            permittedSubset.push(result);
        }
    }

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
        permittedSubset
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

    const sizeLimit = (req.sizeLimit > 0)
        ? req.sizeLimit
        : Number.MAX_SAFE_INTEGER;
    const timeLimit = (req.timeLimit > 0)
        ? req.timeLimit
        : 3600; // We automatically restrict the run-time of the query to one hour.
    let returnedResults: number = 0;
    for (const [ candidate, userAttrs, opAttrs ] of candidates) {

        const admPoint = getAdministrativePoint(entry);
        const admPointDN = admPoint
            ? getDistinguishedName(admPoint)
            : undefined;
        const resultACIs = await getACIItems(ctx, entry);
        const resultACDFTuples: ACDFTuple[] = (resultACIs ?? []).flatMap((aci) => getACDFTuplesFromACIItem(aci));
        const relevantTuples: ACDFTupleExtended[] = (admPointDN && userName)
            ? (await Promise.all(
                entryACDFTuples.map(async (tuple): Promise<ACDFTupleExtended> => [
                    ...tuple,
                    await userWithinACIUserClass(admPointDN, tuple[0], userName, dn, EQUALITY_MATCHER, isMemberOfGroup),
                ]),
            )).filter((tuple) => (tuple[5] > 0))
            : [];
        const canDoOnAttributeTypeOrValue = (permissions: number[]) => {
            return (attributeType: OBJECT_IDENTIFIER, value?: ASN1Element): boolean => {
                if (!resultACDFTuples) {
                    return true;
                }
                const { authorized } = bacACDF(
                    relevantTuples,
                    authLevel,
                    value
                        ? {
                            value: new AttributeTypeAndValue(
                                attributeType,
                                value,
                            ),
                        }
                        : {
                            attributeType,
                        },
                    permissions,
                    EQUALITY_MATCHER,
                );
                return authorized;
            };
        };
        const canMatchAttributeTypeOrValue = canDoOnAttributeTypeOrValue([PERMISSION_CATEGORY_FILTER_MATCH]);
        const canReadAttributeTypeOrValue = canDoOnAttributeTypeOrValue([PERMISSION_CATEGORY_READ]);

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
                    permittedToMatch: (ad: LDAPString, value?: AttributeValue): boolean => {
                        const desc = normalizeAttributeDescription(ad);
                        const spec = ctx.attributes.get(desc);
                        if (!spec) {
                            return false;
                        }
                        if (value) {
                            const ldapSyntaxDecoder = ctx.ldapSyntaxes.get(desc)?.decoder;
                            if (!ldapSyntaxDecoder) {
                                return false;
                            }
                            const decodedValue = ldapSyntaxDecoder(value);
                            return canMatchAttributeTypeOrValue(spec.id, decodedValue);
                        } else {
                            return canMatchAttributeTypeOrValue(spec.id);
                        }
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
        const attributesToReturn = [
            ...Object.entries(groupedByType)
                .filter(([ , vals ]) => canReadAttributeTypeOrValue(vals[0].id))
                .map(([ , vals ]) => {
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
                        vals
                            .filter((val) => canReadAttributeTypeOrValue(val.id, val.value))
                            .map((val) => ldapSyntax.encoder!(val.value)),
                    );
                }).filter((attr): attr is PartialAttribute => !!attr),
            new PartialAttribute(
                Buffer.from("subschemaSubentry", "utf-8"),
                [Buffer.from([])], // The RootDSE is always the schema subentry.
            ),
            ...(dn.length === 0) // This is a Root DSE.
                ? rootDSEAttributes(ctx)
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
            });
        const entryRes = new SearchResultEntry(
            encodeLDAPDN(ctx, dn),
            attributesToReturn,
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
