import type { Context, ClientAssociation } from "@wildboar/meerkat-types";
import * as errors from "@wildboar/meerkat-types";
import {
    DERElement,
    ObjectIdentifier,
    FALSE_BIT,
    TRUE_BIT,
    BIT_STRING,
    BERElement,
    OCTET_STRING,
    INTEGER,
    OBJECT_IDENTIFIER,
} from "asn1-ts";
import { DER } from "asn1-ts/dist/node/functional";
import type { Request } from "@wildboar/x500/src/lib/types/Request";
import type {
    LDAPMessage,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPMessage.ta";
import { AbandonArgument, _encode_AbandonArgument } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonArgument.ta";
import { AddEntryArgument, _encode_AddEntryArgument } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AddEntryArgument.ta";
import { AdministerPasswordArgument, _encode_AdministerPasswordArgument } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AdministerPasswordArgument.ta";
import { ChangePasswordArgument, _encode_ChangePasswordArgument } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ChangePasswordArgument.ta";
import { CompareArgument, _encode_CompareArgument } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareArgument.ta";
import { ModifyDNArgument, _encode_ModifyDNArgument } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyDNArgument.ta";
import { ModifyEntryArgument, _encode_ModifyEntryArgument } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyEntryArgument.ta";
import { RemoveEntryArgument, _encode_RemoveEntryArgument } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/RemoveEntryArgument.ta";
import { SearchArgument, _encode_SearchArgument } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgument.ta";
import { AbandonArgumentData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonArgumentData.ta";
import { AddEntryArgumentData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AddEntryArgumentData.ta";
import { AdministerPasswordArgumentData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AdministerPasswordArgumentData.ta";
import { ChangePasswordArgumentData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ChangePasswordArgumentData.ta";
import { CompareArgumentData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareArgumentData.ta";
import { ModifyDNArgumentData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyDNArgumentData.ta";
import { ModifyEntryArgumentData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyEntryArgumentData.ta";
import { RemoveEntryArgumentData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/RemoveEntryArgumentData.ta";
import { SearchArgumentData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData.ta";
import { abandon } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/abandon.oa";
import { addEntry } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/addEntry.oa";
import { administerPassword } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/administerPassword.oa";
import { changePassword } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/changePassword.oa";
import { compare } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/compare.oa";
import { modifyDN } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/modifyDN.oa";
import { modifyEntry } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/modifyEntry.oa";
import { removeEntry } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/removeEntry.oa";
import { search } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/search.oa";
import decodeLDAPDN from "../ldap/decodeLDAPDN";
import type LDAPSyntaxDecoder from "@wildboar/ldap/src/lib/types/LDAPSyntaxDecoder";
import type {
    AttributeType,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";
import {
    AttributeErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData.ta";
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    id_errcode_attributeError,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-errcode-attributeError.va";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import { InvokeId } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/InvokeId.ta";
import {
    AttributeValueAssertion,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeValueAssertion.ta";
import normalizeAttributeDescription from "@wildboar/ldap/src/lib/normalizeAttributeDescription";
import {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import {
    EntryInformationSelection_infoTypes_attributeTypesAndValues,
    EntryInformationSelection_infoTypes_attributeTypesOnly,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection-infoTypes.ta";
import {
    AttributeValueAssertion as LDAPAttributeValueAssertion,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/AttributeValueAssertion.ta";
import type {
    Filter as DAPFilter,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/Filter.ta";
import type {
    Filter as LDAPFilter,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/Filter.ta";
import {
    MatchingRuleAssertion,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/MatchingRuleAssertion.ta";
import {
    FilterItem_substrings,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FilterItem-substrings.ta";
import {
    ServiceControls,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControls.ta";
import type {
    EntryModification,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryModification.ta";
import {
    ModifyRequest_changes_change as LDAPEntryModification
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/ModifyRequest-changes-change.ta";
import {
    ModifyRequest_changes_change_operation_add,
    ModifyRequest_changes_change_operation_delete_,
    ModifyRequest_changes_change_operation_replace,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/ModifyRequest-changes-change-operation.ta";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
import {
    Attribute_valuesWithContext_Item,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute-valuesWithContext-Item.ta";
import {
    Context as X500Context,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Context.ta";
import {
    ldapAttributeOptionContext,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/ldapAttributeOptionContext.oa";
import {
    languageContext
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/languageContext.oa";
import {
    modifyPassword,
    cancel,
} from "@wildboar/ldap/src/lib/extensions";
import {
    subentries as subentriesOID,
    managedDSAIT as manageDSAITOID,
    dontUseCopy as dontUseCopyOID,
    postread as postreadOID,
    sortRequest as sortRequestOID,
    simpledPagedResults as sprOID,
} from "@wildboar/ldap/src/lib/controls";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import decodeLDAPOID from "@wildboar/ldap/src/lib/decodeLDAPOID";
import {
    ServiceControlOptions,
    ServiceControlOptions_dontUseCopy,
    ServiceControlOptions_manageDSAIT,
    ServiceControlOptions_subentries,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import {
    EXT_BIT_MANAGE_DSA_IT,
    EXT_BIT_SUBENTRIES,
} from "@wildboar/x500/src/lib/dap/extensions";
import type {
    Control,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/Control.ta";
import {
    AttributeSelection,
    _decode_AttributeSelection,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/AttributeSelection.ta";
import {
    SortKey,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SortKey.ta";
import type {
    PagedResultsRequest,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PagedResultsRequest.ta";
import {
    PagedResultsRequest_newRequest,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PagedResultsRequest-newRequest.ta";
import generateUnusedInvokeID from "../net/generateUnusedInvokeID";
import { ContextAssertion } from "@wildboar/x500/src/lib/modules/InformationFramework/ContextAssertion.ta";
import {
    TypeAndContextAssertion,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/TypeAndContextAssertion.ta";
import {
    TimeAssertion,
    _encode_TimeAssertion,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/TimeAssertion.ta";
import { temporalContext } from "@wildboar/x500/src/lib/collections/contexts";
import {
    SearchControlOptions,
    SearchControlOptions_separateFamilyMembers,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchControlOptions.ta";
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    ServiceProblem_unavailableCriticalExtension,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import {
    serviceError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/serviceError.oa";
import getAttributeParentTypes from "../x500/getAttributeParentTypes";

const now: TimeAssertion = {
    now: null,
};
const encodedTimeAssertion = _encode_TimeAssertion(now, DER);
const temporalContextAssertion = new ContextAssertion(
    temporalContext["&id"],
    [ encodedTimeAssertion ],
);

const NOT_UNDERSTOOD: DAPFilter = {
    and: [],
};

function getLDAPDecoder (ctx: Context, descriptor: string): LDAPSyntaxDecoder | null {
    const spec = ctx.attributeTypes.get(descriptor.toLowerCase());
    if (!spec) {
        return null;
    }
    const parentTypes: AttributeType[] = Array.from(getAttributeParentTypes(ctx, spec.id));
    const ldapSyntaxOID: OBJECT_IDENTIFIER | undefined = [
        spec.id,
        ...parentTypes,
    ]
        .map((spec) => ctx.attributeTypes.get(spec.toString())?.ldapSyntax)
        .find((oid) => oid);
    if (!ldapSyntaxOID) {
        return null;
    }
    const ldapSyntax = ctx.ldapSyntaxes.get(ldapSyntaxOID.toString());
    if (!ldapSyntax?.decoder) {
        return null;
    }
    return ldapSyntax.decoder;
}

function getLDAPDecoderForEqualityMatcher (ctx: Context, descriptor: string): LDAPSyntaxDecoder | null {
    const spec = ctx.attributeTypes.get(descriptor.toLowerCase());
    if (!spec) {
        return null;
    }
    const parentTypes: AttributeType[] = Array.from(getAttributeParentTypes(ctx, spec.id));
    const equalityMatcherOID: OBJECT_IDENTIFIER | undefined = [
        spec.id,
        ...parentTypes,
    ]
        .map((oid) => ctx.attributeTypes.get(oid.toString())?.equalityMatchingRule)
        .find((oid) => oid);
    if (!equalityMatcherOID) {
        return null;
    }
    const equalityMatching = ctx.equalityMatchingRules.get(equalityMatcherOID.toString());
    if (!equalityMatching?.ldapAssertionSyntax) {
        return null;
    }
    const ldapSyntax = ctx.ldapSyntaxes.get(equalityMatching.ldapAssertionSyntax.toString());
    if (!ldapSyntax?.decoder) {
        return null;
    }
    return ldapSyntax.decoder;
}

function createAttributeErrorData (ctx: Context, descriptor: string): [ string, AttributeErrorData ] {
    return [
        `Attribute type ${descriptor} could not be decoded from LDAP.`,
        new AttributeErrorData(
            {
                rdnSequence: [],
            },
            [],
            [],
            createSecurityParameters(
                ctx,
                undefined,
                undefined,
                id_errcode_attributeError,
            ),
            ctx.dsa.accessPoint.ae_title.rdnSequence,
            undefined,
            undefined,
        ),
    ];
}

function convert_ldap_mod_to_dap_mod (ctx: Context, mod: LDAPEntryModification): EntryModification {
    const desc = normalizeAttributeDescription(mod.modification.type_);
    const spec = ctx.attributeTypes.get(desc.toLowerCase());
    if (!spec?.ldapSyntax) {
        throw new errors.AttributeError(...createAttributeErrorData(ctx, desc));
    }
    const ldapSyntax = ctx.ldapSyntaxes.get(spec.ldapSyntax.toString());
    if (!ldapSyntax?.decoder) {
        throw new errors.AttributeError(...createAttributeErrorData(ctx, desc));
    }
    const decoder = ldapSyntax.decoder;
    const options: string[] = Buffer.from(mod.modification.type_)
        .toString("utf-8")
        .split(";")
        .slice(1)
        .map((opt) => opt.trim().replace(/[^A-Za-z0-9-]/g, ""))
        ;
    const languages: string[] = options
        .filter((opt) => opt.toLowerCase().startsWith("lang-"))
        .map((opt) => opt.slice(5, 7));
    const contexts: X500Context[] = [];
    if (options.length) {
        contexts.push(new X500Context(
            ldapAttributeOptionContext["&id"],
            [
                ldapAttributeOptionContext.encoderFor["&Type"]!(options, DER),
            ],
            false,
        ));
    }
    if (languages.length) {
        contexts.push(new X500Context(
            languageContext["&id"],
            languages
                .map((lang) => languageContext.encoderFor["&Type"]!(lang, DER)),
            false,
        ));
    }
    switch (mod.operation) {
    // NOTE: You have to cast as a `number` to prevent some weird TypeScript bug.
    case (ModifyRequest_changes_change_operation_add as number): {
        if (contexts.length) {
            return {
                addValues: new Attribute(
                    spec.id,
                    [],
                    mod.modification.vals
                        .map((val) => new Attribute_valuesWithContext_Item(
                            decoder(val),
                            contexts,
                        )),
                ),
            };
        } else {
            return {
                addValues: new Attribute(
                    spec.id,
                    mod.modification.vals.map(decoder),
                    undefined,
                ),
            };
        }
    }
    case (ModifyRequest_changes_change_operation_delete_): {
        if (mod.modification.vals.length === 0) {
            return {
                removeAttribute: spec.id,
            };
        }
        if (contexts.length) {
            return {
                removeValues: new Attribute(
                    spec.id,
                    [],
                    mod.modification.vals
                        .map((val) => new Attribute_valuesWithContext_Item(
                            decoder(val),
                            contexts,
                        )),
                ),
            };
        } else {
            return {
                removeValues: new Attribute(
                    spec.id,
                    mod.modification.vals.map(decoder),
                    undefined,
                ),
            };
        }
    }
    case (ModifyRequest_changes_change_operation_replace as number): {
        if (contexts.length) {
            return {
                replaceValues: new Attribute(
                    spec.id,
                    [],
                    mod.modification.vals
                        .map((val) => new Attribute_valuesWithContext_Item(
                            decoder(val),
                            contexts,
                        )),
                ),
            };
        } else {
            return {
                replaceValues: new Attribute(
                    spec.id,
                    mod.modification.vals.map(decoder),
                    undefined,
                ),
            };
        }
    }
    case (3): { // increment
        if (mod.modification.vals.length !== 1) {
            throw new Error();
        }
        return {
            alterValues: new AttributeTypeAndValue(
                spec.id,
                decoder(mod.modification.vals[0]),
            ),
        };
    }
    default: {
        throw new Error();
    }
    }
}

function convert_ldap_ava_to_dap_ava (ctx: Context, ava: LDAPAttributeValueAssertion): AttributeValueAssertion {
    const desc = normalizeAttributeDescription(ava.attributeDesc);
    const spec = ctx.attributeTypes.get(desc.toLowerCase());
    if (!spec) {
        throw new errors.AttributeError(...createAttributeErrorData(ctx, desc));
    }
    const options: string[] = Buffer.from(ava.attributeDesc)
        .toString("utf-8")
        .split(";")
        .slice(1)
        .map((opt) => opt.trim().replace(/[^A-Za-z0-9-]/g, ""))
        ;
    const languages: string[] = options
        .filter((opt) => opt.toLowerCase().startsWith("lang-"))
        .map((opt) => opt.slice(5, 7));
    const contextAssertions: ContextAssertion[] = [
        temporalContextAssertion,
    ];
    if (options.length) {
        contextAssertions.push(new ContextAssertion(
            ldapAttributeOptionContext["&id"],
            [
                ldapAttributeOptionContext.encoderFor["&Assertion"]!(options, DER),
            ],
        ));
    }
    if (languages.length) {
        contextAssertions.push(new ContextAssertion(
            languageContext["&id"],
            languages
                .map((lang) => languageContext.encoderFor["&Type"]!(lang, DER)),
        ));
    }
    const decoder = getLDAPDecoderForEqualityMatcher(ctx, desc);
    if (!decoder) {
        throw new errors.AttributeError(...createAttributeErrorData(ctx, desc));
    }
    return new AttributeValueAssertion(
        spec.id,
        decoder(ava.assertionValue),
        contextAssertions.length
            ? {
                selectedContexts: contextAssertions,
            }
            : undefined,
    );
}

function convert_ldap_filter_to_dap_filter (ctx: Context, filter: LDAPFilter): DAPFilter {
    if ("and" in filter) {
        return {
            and: filter.and.map((sub) => convert_ldap_filter_to_dap_filter(ctx, sub)),
        };
    }
    else if ("or" in filter) {
        return {
            or: filter.or.map((sub) => convert_ldap_filter_to_dap_filter(ctx, sub)),
        };
    }
    else if ("not" in filter) {
        return {
            not: convert_ldap_filter_to_dap_filter(ctx, filter.not),
        };
    }
    else if ("equalityMatch" in filter) {
        return {
            item: {
                equality: convert_ldap_ava_to_dap_ava(ctx, filter.equalityMatch),
            },
        };
    }
    else if ("substrings" in filter) {
        const desc = normalizeAttributeDescription(filter.substrings.type_);
        const spec = ctx.attributeTypes.get(desc.toLowerCase());
        if (!spec?.ldapSyntax) {
            throw new errors.AttributeError(...createAttributeErrorData(ctx, desc));
        }
        const ldapSyntax = ctx.ldapSyntaxes.get(spec.ldapSyntax.toString());
        if (!ldapSyntax?.decoder) {
            throw new errors.AttributeError(...createAttributeErrorData(ctx, desc));
        }
        const decoder = ldapSyntax.decoder;
        return {
            item: {
                substrings: new FilterItem_substrings(
                    spec.id,
                    filter.substrings.substrings.map((str) => {
                        if ("initial" in str) {
                            return {
                                initial: decoder(str.initial),
                            };
                        } else if ("any_" in str) {
                            return {
                                any_: decoder(str.any_),
                            };
                        } else if ("final" in str) {
                            return {
                                final: decoder(str.final),
                            };
                        } else {
                            throw new Error();
                        }
                    }),
                ),
            },
        };
    }
    else if ("greaterOrEqual" in filter) {
        return {
            item: {
                greaterOrEqual: convert_ldap_ava_to_dap_ava(ctx, filter.greaterOrEqual),
            },
        };
    }
    else if ("lessOrEqual" in filter) {
        return {
            item: {
                lessOrEqual: convert_ldap_ava_to_dap_ava(ctx, filter.lessOrEqual),
            },
        };
    }
    else if ("present" in filter) {
        const desc = normalizeAttributeDescription(filter.present);
        const spec = ctx.attributeTypes.get(desc.toLowerCase());
        if (!spec) {
            throw new errors.AttributeError(...createAttributeErrorData(ctx, desc));
        }
        return {
            item: {
                present: spec.id,
            },
        };
    }
    else if ("approxMatch" in filter) {
        return {
            item: {
                approximateMatch: convert_ldap_ava_to_dap_ava(ctx, filter.approxMatch),
            },
        };
    }
    else if ("extensibleMatch" in filter) {
        if (!filter.extensibleMatch.type_) {
            return NOT_UNDERSTOOD;
        }
        const mrDesc = filter.extensibleMatch.matchingRule
            ? normalizeAttributeDescription(filter.extensibleMatch.matchingRule).toLowerCase()
            : undefined;
        const matchingRule = mrDesc
            ? ctx.equalityMatchingRules.get(mrDesc)
                ?? ctx.orderingMatchingRules.get(mrDesc)
                ?? ctx.substringsMatchingRules.get(mrDesc)
            : undefined;
        const desc = normalizeAttributeDescription(filter.extensibleMatch.type_);
        const spec = ctx.attributeTypes.get(desc.toLowerCase());
        const ldapSyntaxOID = (
            matchingRule?.ldapAssertionSyntax
            && ctx.ldapSyntaxes.get(matchingRule.ldapAssertionSyntax.toString())
        )
            ?? (spec?.ldapSyntax && ctx.ldapSyntaxes.get(spec.ldapSyntax.toString()));
        if (!ldapSyntaxOID) {
            throw new errors.AttributeError(...createAttributeErrorData(ctx, desc));
        }
        const ldapSyntax = ctx.ldapSyntaxes.get(ldapSyntaxOID.toString());
        if (!ldapSyntax?.decoder) {
            throw new errors.AttributeError(...createAttributeErrorData(ctx, desc));
        }
        const decoder = ldapSyntax.decoder;
        matchingRule?.ldapAssertionSyntax
        return {
            item: {
                extensibleMatch: new MatchingRuleAssertion(
                    matchingRule?.id
                        ? [ matchingRule.id ]
                        : [],
                    spec?.id,
                    decoder(filter.extensibleMatch.matchValue),
                    filter.extensibleMatch.dnAttributes,
                ),
            },
        };
    }
    else {
        return NOT_UNDERSTOOD;
    }
}

function convertAttributeSelectiontoEIS (
    ctx: Context,
    selection: AttributeSelection,
    typesOnly?: boolean,
): EntryInformationSelection {
    const selectedContexts: TypeAndContextAssertion[] = [];
    const returnAllUserAttributesExclusively: boolean = (selection.length === 0); // Case #1
    const returnAllUserAttributesInclusively: boolean = selection
        .some((attr) => (attr[0] === 0x2A)); // Case #2 "*"
    const returnNoAttributes: boolean = (
        (selection.length === 1)
        && !Buffer.compare(selection[0], Buffer.from([ 0x31, 0x2E, 0x31 ]))
    ); // Case #3
    const returnAllOperationalAttributes: boolean = selection
        .some((attr) => (attr[0] === 0x2B)); // See: https://www.rfc-editor.org/rfc/rfc3673.html
    const selectedAttributes: AttributeType[] = selection
        .flatMap((attr) => {
            const desc = normalizeAttributeDescription(attr);
            if (desc.startsWith("@")) { // See: https://www.rfc-editor.org/rfc/rfc4529.html
                const oc = ctx.objectClasses.get(desc.slice(1).toLowerCase());
                if (!oc) {
                    return [];
                }
                return [
                    ...Array.from(oc.mandatoryAttributes.values()).map(ObjectIdentifier.fromString),
                    ...Array.from(oc.optionalAttributes.values()).map(ObjectIdentifier.fromString),
                ];
            }
            const spec = ctx.attributeTypes.get(desc.toLowerCase());
            if (!spec) {
                return [];
            }
            const contextAssertions: ContextAssertion[] = [
                temporalContextAssertion,
            ];
            const options: string[] = Buffer.from(attr)
                .toString("utf-8")
                .split(";")
                .slice(1)
                .map((opt) => opt.trim().replace(/[^A-Za-z0-9-]/g, ""))
                ;
            const languages: string[] = options
                .filter((opt) => opt.toLowerCase().startsWith("lang-"))
                .map((opt) => opt.slice(5, 7));
            if (options.length) {
                contextAssertions.push(new ContextAssertion(
                    ldapAttributeOptionContext["&id"],
                    [
                        ldapAttributeOptionContext.encoderFor["&Assertion"]!(options, DER),
                    ],
                ));
            }
            if (languages.length) {
                contextAssertions.push(new ContextAssertion(
                    languageContext["&id"],
                    languages
                        .map((lang) => languageContext.encoderFor["&Type"]!(lang, DER)),
                ));
            }
            if (contextAssertions.length) {
                selectedContexts.push(new TypeAndContextAssertion(
                    spec.id,
                    {
                        all: contextAssertions,
                    },
                ));
            }
            return [ spec.id ];
        });

    return new EntryInformationSelection(
        (returnAllUserAttributesExclusively || returnAllUserAttributesInclusively)
            ? {
                allUserAttributes: null,
            }
            : returnNoAttributes
                ? {
                    select: [],
                }
                : {
                    select: selectedAttributes,
                },
        typesOnly
            ? EntryInformationSelection_infoTypes_attributeTypesOnly
            : EntryInformationSelection_infoTypes_attributeTypesAndValues,
        ((): EntryInformationSelection["extraAttributes"] => {
            if (returnNoAttributes || returnAllUserAttributesExclusively) {
                return undefined;
            } else if (returnAllOperationalAttributes) {
                return {
                    allOperationalAttributes: null,
                };
            } else if (returnAllUserAttributesInclusively) {
                return {
                    select: selectedAttributes,
                };
            } else {
                return {
                    select: selectedAttributes,
                };
            }
        })(),
        selectedContexts.length
            ? {
                selectedContexts: selectedContexts,
            }
            : undefined,
        false,
        undefined,
    );
}

export
function ldapRequestToDAPRequest (
    ctx: Context,
    assn: ClientAssociation,
    req: LDAPMessage,
): Request | null {
    const invokeId: InvokeId = {
        present: generateUnusedInvokeID(ctx),
    };
    let subentriesControl: Control | undefined; // See: https://www.rfc-editor.org/rfc/rfc3672.html
    let managedDSAITControl: Control | undefined; // See: https://www.rfc-editor.org/rfc/rfc3296.html
    let dontUseCopyControl: Control | undefined; // See: https://www.rfc-editor.org/rfc/rfc6171.html
    let postreadControl: Control | undefined; // See: https://www.rfc-editor.org/rfc/rfc4527.html
    let sortRequestControl: Control | undefined; // See: https://www.rfc-editor.org/rfc/rfc2891.html
    let simplePagedResultsControl: Control | undefined;
    for (const control of req.controls ?? []) {
        const oid = decodeLDAPOID(control.controlType);
        switch (oid.toString()) {
            case (subentriesOID.toString()): {
                subentriesControl = control;
                break;
            }
            case (manageDSAITOID.toString()): {
                managedDSAITControl = control;
                break;
            }
            case (dontUseCopyOID.toString()): {
                dontUseCopyControl = control;
                break;
            }
            case (postreadOID.toString()): {
                postreadControl = control;
                break;
            }
            case (sortRequestOID.toString()): {
                sortRequestControl = control;
                break;
            }
            case (sprOID.toString()): {
                simplePagedResultsControl = control;
                break;
            }
            default: {
                if (control.criticality) {
                    throw new errors.ServiceError(
                        ctx.i18n.t("err:unrecognized_ldap_extension", {
                            ext: oid.toString(),
                        }),
                        new ServiceErrorData(
                            ServiceProblem_unavailableCriticalExtension,
                            [],
                            createSecurityParameters(
                                ctx,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                serviceError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            false,
                            undefined,
                        ),
                    );
                }
            }
        }
    }

    const manageDSAIT: boolean = Boolean(managedDSAITControl);
    const dontUseCopy: boolean = Boolean(dontUseCopyControl);

    const critex: BIT_STRING = new Uint8ClampedArray((new Array(36)).fill(FALSE_BIT));
    const sco: ServiceControlOptions = new Uint8ClampedArray((new Array(14)).fill(FALSE_BIT));
    if (subentriesControl?.controlValue?.[2] === 0xFF) {
        sco[ServiceControlOptions_subentries] = TRUE_BIT;
        critex[EXT_BIT_SUBENTRIES] = TRUE_BIT;
    }
    if (manageDSAIT) {
        sco[ServiceControlOptions_manageDSAIT] = TRUE_BIT;
        critex[EXT_BIT_MANAGE_DSA_IT] = TRUE_BIT;
    }
    if (dontUseCopy) {
        sco[ServiceControlOptions_dontUseCopy] = TRUE_BIT;
    }

    if ("bindRequest" in req.protocolOp) {
        throw new Error();
    }
    else if ("unbindRequest" in req.protocolOp) {
        throw new Error();
    }
    else if ("searchRequest" in req.protocolOp) {
        const attrs: AttributeSelection = req.protocolOp.searchRequest.attributes;
        const eis = convertAttributeSelectiontoEIS(ctx, attrs, req.protocolOp.searchRequest.typesOnly);
        let reverse: boolean = false;
        let sortKey: SortKey | undefined;
        let queryReference: OCTET_STRING | undefined;
        let pageSize: INTEGER | undefined;
        if (simplePagedResultsControl?.controlValue) {
            const el = new BERElement();
            el.fromBytes(simplePagedResultsControl.controlValue);
            // See: https://www.rfc-editor.org/rfc/rfc2696.html
            // realSearchControlValue ::= SEQUENCE {
            //     size            INTEGER (0..maxInt),
            //     cookie          OCTET STRING }
            const [ sizeElement, cookieElement ] = el.sequence;
            pageSize = sizeElement.integer;
            queryReference = cookieElement.value.length
                ? cookieElement.octetString
                : undefined;
        }
        if (sortRequestControl?.controlValue) {
            const el = new BERElement();
            el.fromBytes(sortRequestControl.controlValue);
            const sortKeysInControl = el.sequence;
            if (sortKeysInControl.length) {
                // From https://www.rfc-editor.org/rfc/rfc2891.html
                // SortKeyList ::= SEQUENCE OF SEQUENCE {
                //     attributeType   AttributeDescription,
                //     orderingRule    [0] MatchingRuleId OPTIONAL,
                //     reverseOrder    [1] BOOLEAN DEFAULT FALSE }
                const skElements = sortKeysInControl[0].sequence;
                const attributeTypeDesc = Buffer.from(skElements[0].octetString).toString("utf-8");
                const orderingRuleDesc: string | undefined = (skElements[1]?.tagNumber === 0)
                    ? Buffer.from(skElements[1].octetString).toString("utf-8")
                    : undefined;
                reverse = skElements
                    .find((ske) => (ske.tagNumber === 1))?.boolean ?? false;
                const attrSpec = ctx.attributeTypes.get(attributeTypeDesc.toLowerCase());
                if (attrSpec) {
                    const mrSpec = orderingRuleDesc
                        ? ctx.orderingMatchingRules.get(orderingRuleDesc.toLowerCase())
                        : undefined;
                    sortKey = new SortKey(
                        attrSpec?.id,
                        mrSpec?.id,
                    );
                } else if (sortRequestControl.criticality) {
                    // Attribute type not understood.
                    throw new errors.ServiceError(
                        ctx.i18n.t("err:unrecognized_sort_key"),
                        new ServiceErrorData(
                            ServiceProblem_unavailableCriticalExtension,
                            [],
                            createSecurityParameters(
                                ctx,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                serviceError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            false,
                            undefined,
                        ),
                    );
                }
            }
        }
        const prr: PagedResultsRequest | undefined = (() => {
            if (queryReference) {
                if (pageSize === 0) {
                    return {
                        abandonQuery: queryReference,
                    };
                }
                return { queryReference };
            }
            if ((sortKey !== undefined) || (pageSize !== undefined)) {
                return {
                    newRequest: new PagedResultsRequest_newRequest(
                        pageSize ?? 10_000_000,
                        sortKey
                            ? [ sortKey ]
                            : undefined,
                        reverse,
                        undefined,
                        undefined,
                    ),
                };
            }
            return undefined;
        })();
        const searchControlOptions: SearchControlOptions = new Uint8ClampedArray(12);
        /**
         * We separate family members, because there is no LDAP syntax for
         * family-information, but we might want to interact with child entries
         * via LDAP. This allows us to return child entries separately for LDAP.
         */
        searchControlOptions[SearchControlOptions_separateFamilyMembers] = TRUE_BIT;
        const dapReq: SearchArgument = {
            unsigned: new SearchArgumentData(
                {
                    rdnSequence: decodeLDAPDN(ctx, req.protocolOp.searchRequest.baseObject),
                },
                req.protocolOp.searchRequest.scope,
                req.protocolOp.searchRequest.filter
                    ? convert_ldap_filter_to_dap_filter(ctx, req.protocolOp.searchRequest.filter)
                    : undefined,
                Boolean(req.protocolOp.searchRequest.derefAliases),
                eis,
                prr,
                false, // matchedValuesOnly has a different meaning in LDAP.
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                searchControlOptions,
                undefined,
                undefined,
                [],
                new ServiceControls(
                    sco,
                    (req.protocolOp.searchRequest.timeLimit > 0)
                        ? req.protocolOp.searchRequest.timeLimit
                        : undefined,
                    (req.protocolOp.searchRequest.sizeLimit > 0)
                        ? req.protocolOp.searchRequest.sizeLimit
                        : undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ),
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        };
        const argument = _encode_SearchArgument(dapReq, DER);
        return {
            invokeId,
            opCode: search["&operationCode"],
            argument,
        };
    }
    else if ("modifyRequest" in req.protocolOp) {
        let eis: EntryInformationSelection | undefined;
        if (postreadControl?.controlValue) {
            const el = new BERElement();
            el.fromBytes(postreadControl.controlValue);
            const selection: AttributeSelection = _decode_AttributeSelection(el);
            eis = convertAttributeSelectiontoEIS(ctx, selection, false);
        }
        const dapReq: ModifyEntryArgument = {
            unsigned: new ModifyEntryArgumentData(
                {
                    rdnSequence: decodeLDAPDN(ctx, req.protocolOp.modifyRequest.object),
                },
                req.protocolOp.modifyRequest.changes.map((c) => convert_ldap_mod_to_dap_mod(ctx, c)),
                eis,
                [],
                new ServiceControls(
                    sco,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ),
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        };
        const argument = _encode_ModifyEntryArgument(dapReq, DER);
        return {
            invokeId,
            opCode: modifyEntry["&operationCode"],
            argument,
        };
    }
    else if ("addRequest" in req.protocolOp) {
        const dapReq: AddEntryArgument = {
            unsigned: new AddEntryArgumentData(
                {
                    rdnSequence: decodeLDAPDN(ctx, req.protocolOp.addRequest.entry),
                },
                req.protocolOp.addRequest.attributes
                    .map((attr): Attribute | undefined => {
                        const desc = normalizeAttributeDescription(attr.type_);
                        const spec = ctx.attributeTypes.get(desc.toLowerCase());
                        const decoder = getLDAPDecoder(ctx, desc);
                        if (!decoder) {
                            throw new errors.AttributeError(...createAttributeErrorData(ctx, desc));
                        }
                        const options: string[] = Buffer.from(attr.type_)
                            .toString("utf-8")
                            .split(";")
                            .slice(1)
                            .map((opt) => opt.trim().replace(/[^A-Za-z0-9-]/g, ""))
                            ;
                        const languages: string[] = options
                            .filter((opt) => opt.toLowerCase().startsWith("lang-"))
                            .map((opt) => opt.slice(5, 7));
                        try {
                            if (options.length) {
                                return new Attribute(
                                    spec!.id,
                                    [],
                                    attr.vals
                                        .map((val) => new Attribute_valuesWithContext_Item(
                                            decoder(val),
                                            [
                                                new X500Context(
                                                    ldapAttributeOptionContext["&id"],
                                                    [
                                                        ldapAttributeOptionContext.encoderFor["&Type"]!(options, DER),
                                                    ],
                                                    false,
                                                ),
                                                languages.length
                                                    ? new X500Context(
                                                        languageContext["&id"],
                                                        languages.map((lang) => languageContext.encoderFor["&Type"]!(lang, DER)),
                                                        false,
                                                    )
                                                    : null,
                                            ]
                                                .filter((c): c is X500Context => !!c),
                                        )),
                                );
                            } else {
                                return new Attribute(
                                    spec!.id,
                                    attr.vals.map(decoder),
                                    undefined,
                                );
                            }
                        } catch (e) {
                            ctx.log.warn(ctx.i18n.t("log:could_not_decode_ldap_attribute", {
                                desc,
                                e: e.message,
                            }), {
                                remoteFamily: assn.socket.remoteFamily,
                                remoteAddress: assn.socket.remoteAddress,
                                remotePort: assn.socket.remotePort,
                                association_id: assn.id,
                            });
                            return undefined;
                        }
                    })
                        .filter((attr): attr is Attribute => !!attr),
                undefined,
                [],
                new ServiceControls(
                    sco,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ),
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        };
        const argument = _encode_AddEntryArgument(dapReq, DER);
        return {
            invokeId,
            opCode: addEntry["&operationCode"],
            argument,
        };
    }
    else if ("delRequest" in req.protocolOp) {
        const dapReq: RemoveEntryArgument = {
            unsigned: new RemoveEntryArgumentData(
                {
                    rdnSequence: decodeLDAPDN(ctx, req.protocolOp.delRequest),
                },
                [],
                new ServiceControls(
                    sco,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ),
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        };
        const argument = _encode_RemoveEntryArgument(dapReq, DER);
        return {
            invokeId,
            opCode: removeEntry["&operationCode"],
            argument,
        };
    }
    else if ("modDNRequest" in req.protocolOp) {
        const dapReq: ModifyDNArgument = {
            unsigned: new ModifyDNArgumentData(
                decodeLDAPDN(ctx, req.protocolOp.modDNRequest.entry),
                decodeLDAPDN(ctx, req.protocolOp.modDNRequest.newrdn)[0],
                req.protocolOp.modDNRequest.deleteoldrdn,
                req.protocolOp.modDNRequest.newSuperior
                    ? decodeLDAPDN(ctx, req.protocolOp.modDNRequest.newSuperior)
                    : undefined,
                [],
                new ServiceControls(
                    sco,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ),
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        };
        const argument = _encode_ModifyDNArgument(dapReq, DER);
        return {
            invokeId,
            opCode: modifyDN["&operationCode"],
            argument,
        };
    }
    else if ("compareRequest" in req.protocolOp) {
        const desc = normalizeAttributeDescription(req.protocolOp.compareRequest.ava.attributeDesc);
        const spec = ctx.attributeTypes.get(desc.toLowerCase());
        if (!spec?.ldapSyntax) {
            throw new errors.AttributeError(...createAttributeErrorData(ctx, desc));
        }
        const decoder = getLDAPDecoderForEqualityMatcher(ctx, desc);
        if (!decoder) {
            throw new errors.AttributeError(...createAttributeErrorData(ctx, desc));
        }
        const options: string[] = Buffer.from(req.protocolOp.compareRequest.ava.attributeDesc)
            .toString("utf-8")
            .split(";")
            .slice(1)
            .map((opt) => opt.trim().replace(/[^A-Za-z0-9-]/g, ""))
            ;
        const languages: string[] = options
            .filter((opt) => opt.toLowerCase().startsWith("lang-"))
            .map((opt) => opt.slice(5, 7));
        const contextAssertions: ContextAssertion[] = [
            temporalContextAssertion,
        ];
        if (options.length) {
            contextAssertions.push(new ContextAssertion(
                ldapAttributeOptionContext["&id"],
                [
                    ldapAttributeOptionContext.encoderFor["&Assertion"]!(options, DER),
                ],
            ));
        }
        if (languages.length) {
            contextAssertions.push(new ContextAssertion(
                languageContext["&id"],
                languages
                    .map((lang) => languageContext.encoderFor["&Type"]!(lang, DER)),
            ));
        }
        const dapReq: CompareArgument = {
            unsigned: new CompareArgumentData(
                {
                    rdnSequence: decodeLDAPDN(ctx, req.protocolOp.compareRequest.entry),
                },
                new AttributeValueAssertion(
                    spec.id,
                    decoder(req.protocolOp.compareRequest.ava.assertionValue),
                    contextAssertions.length
                        ? {
                            selectedContexts: contextAssertions,
                        }
                        : undefined,
                ),
                [],
                new ServiceControls(
                    sco,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ),
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        };
        const argument = _encode_CompareArgument(dapReq, DER);
        return {
            invokeId,
            opCode: compare["&operationCode"],
            argument,
        };
    }
    else if ("abandonRequest" in req.protocolOp) {
        const messageID = req.protocolOp.abandonRequest;
        ctx.log.debug(ctx.i18n.t("log:abandon_ldap_op", { mid: messageID }), {
            remoteFamily: assn.socket.remoteFamily,
            remoteAddress: assn.socket.remoteAddress,
            remotePort: assn.socket.remotePort,
            association_id: assn.id,
        });
        const abandonedOperationInvokeID: number | undefined = assn.messageIDToInvokeID.get(Number(messageID));
        ctx.log.debug(ctx.i18n.t("log:abandoning_invocation_from_ldap", {
            iid: abandonedOperationInvokeID,
            mid: messageID,
        }), {
            remoteFamily: assn.socket.remoteFamily,
            remoteAddress: assn.socket.remoteAddress,
            remotePort: assn.socket.remotePort,
            association_id: assn.id,
        });
        if (abandonedOperationInvokeID === undefined) {
            return null;
        }
        const ar: AbandonArgument = {
            unsigned: new AbandonArgumentData(
                {
                    present: abandonedOperationInvokeID,
                },
            ),
        };
        return {
            invokeId,
            opCode: abandon["&operationCode"],
            argument: _encode_AbandonArgument(ar, DER),
        };
    }
    else if ("extendedReq" in req.protocolOp) {
        const oid = ObjectIdentifier.fromString(Buffer.from(req.protocolOp.extendedReq.requestName).toString("utf-8"));
        if (oid.isEqualTo(modifyPassword)) {
            if (!req.protocolOp.extendedReq.requestValue) {
                throw new Error();
            }
            const passwdModifyRequestElement = new DERElement();
            passwdModifyRequestElement.fromBytes(req.protocolOp.extendedReq.requestValue);
            const elements = passwdModifyRequestElement.sequence;
            const userIdentityElement = elements.find((el) => (el.tagNumber === 0));
            const oldPasswd = elements.find((el) => (el.tagNumber === 1))?.octetString;
            const newPasswd = elements.find((el) => (el.tagNumber === 2))?.octetString;
            const dn: DistinguishedName | undefined = userIdentityElement
                ? decodeLDAPDN(ctx, userIdentityElement.octetString)
                : assn.boundNameAndUID?.dn;
            if (!dn) {
                throw new Error();
            }
            if (!newPasswd) {
                throw new Error(); // Not specified what to do if no new password is provided.
            }
            if (oldPasswd) { // Create changePassword request
                const dapReq: ChangePasswordArgument = {
                    unsigned: new ChangePasswordArgumentData(
                        dn,
                        {
                            clear: Buffer.from(oldPasswd).toString("utf-8"),
                        },
                        {
                            clear: Buffer.from(newPasswd).toString("utf-8"),
                        },
                    ),
                };
                const argument = _encode_ChangePasswordArgument(dapReq, DER);
                return {
                    invokeId,
                    opCode: changePassword["&operationCode"],
                    argument,
                };
            } else { // Create administerPassword request
                const dapReq: AdministerPasswordArgument = {
                    unsigned: new AdministerPasswordArgumentData(
                        dn,
                        {
                            clear: Buffer.from(newPasswd).toString("utf-8"),
                        },
                    ),
                };
                const argument = _encode_AdministerPasswordArgument(dapReq, DER);
                return {
                    invokeId,
                    opCode: administerPassword["&operationCode"],
                    argument,
                };
            }
        } else if (oid.isEqualTo(cancel)) {
            if (!req.protocolOp.extendedReq.requestValue) {
                throw new Error();
            }
            const el = new BERElement();
            el.fromBytes(req.protocolOp.extendedReq.requestValue);
            const cancelIDElement = el.sequence[0];
            if (!cancelIDElement) {
                throw new Error();
            }
            const messageID: number = Number(cancelIDElement.integer);
            const abandonedOperationInvokeID: number | undefined = assn.messageIDToInvokeID.get(messageID);
            if (abandonedOperationInvokeID === undefined) {
                return null;
            }
            const ar: AbandonArgument = {
                unsigned: new AbandonArgumentData(
                    {
                        present: abandonedOperationInvokeID,
                    },
                ),
            };
            return {
                invokeId,
                opCode: abandon["&operationCode"],
                argument: _encode_AbandonArgument(ar, DER),
            };
        } else {
            throw new Error(); // We don't recognize the extended request.
        }
    } else {
        throw new Error();
    }
}

export default ldapRequestToDAPRequest;
