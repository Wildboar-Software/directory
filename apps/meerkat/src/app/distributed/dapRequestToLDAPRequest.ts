import { Context, ServiceError } from "@wildboar/meerkat-types";
import * as errors from "@wildboar/meerkat-types";
import type { Request } from "@wildboar/x500/src/lib/types/Request";
import { TRUE_BIT, FALSE, ObjectIdentifier } from "asn1-ts";
import { LDAPMessage } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPMessage.ta";
import encodeLDAPOID from "@wildboar/ldap/src/lib/encodeLDAPOID";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import { objectClass } from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
import encodeLDAPDN from "../ldap/encodeLDAPDN";
import compareCode from "@wildboar/x500/src/lib/utils/compareCode";
import { administerPassword } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/administerPassword.oa";
import { addEntry } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/addEntry.oa";
import { changePassword } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/changePassword.oa";
import { compare } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/compare.oa";
import { list } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/list.oa";
import { modifyDN } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/modifyDN.oa";
import { modifyEntry } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/modifyEntry.oa";
import { read } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/read.oa";
import { removeEntry } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/removeEntry.oa";
import { search } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/search.oa";
import { SearchRequest } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/SearchRequest.ta";
import { ModifyRequest } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/ModifyRequest.ta";
import { AddRequest } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/AddRequest.ta";
import { ModifyDNRequest } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/ModifyDNRequest.ta";
import { CompareRequest } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/CompareRequest.ta";
import {
    SearchRequest_scope_baseObject,
    SearchRequest_scope_singleLevel,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/SearchRequest-scope.ta";
import {
    SearchRequest_derefAliases_neverDerefAliases,
    SearchRequest_derefAliases_derefFindingBaseObj,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/SearchRequest-derefAliases.ta";
import {
    ServiceControlOptions_dontDereferenceAliases,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import {
    EntryInformationSelection_infoTypes_attributeTypesOnly,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection-infoTypes.ta";
import type {
    AttributeSelection,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/AttributeSelection.ta";
import type {
    AttributeValueAssertion,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeValueAssertion.ta";
import {
    AttributeValueAssertion as LDAPAttributeValueAssertion,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/AttributeValueAssertion.ta";
import type {
    Filter as DAPFilter,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/Filter.ta";
import type {
    Filter as LDAPFilter,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/Filter.ta";
import type {
    FilterItem as DAPFilterItem,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FilterItem.ta";
import {
    MatchingRuleAssertion,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/MatchingRuleAssertion.ta";
import {
    SubstringFilter,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/SubstringFilter.ta";
import {
    SubstringFilter_substrings_substring,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/SubstringFilter-substrings-substring.ta";
import {
    PartialAttribute,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/PartialAttribute.ta";
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
import type {
    AttributeType,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";
import {
    AttributeErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData.ta";
import {
    AttributeErrorData_problems_Item,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData-problems-Item.ta";
import {
    AttributeProblem_undefinedAttributeType,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeProblem.ta";
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    id_errcode_attributeError,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-errcode-attributeError.va";
import {
    id_errcode_serviceError,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-errcode-serviceError.va";
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    ServiceProblem_notSupportedByLDAP,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import generateUnusedInvokeID from "../net/generateUnusedInvokeID";
import { strict as assert } from "assert";
import getLDAPEncoder from "../ldap/getLDAPEncoder";

const DEFAULT_LDAP_FILTER: LDAPFilter = {
    present: encodeLDAPOID(objectClass["&id"]),
};

function createAttributeErrorData (ctx: Context, type_: AttributeType): [ string, AttributeErrorData ] {
    return [
        ctx.i18n.t("err:attribute_type_cannot_be_encoded_to_ldap", {
            oid: type_.toString(),
        }),
        new AttributeErrorData(
            {
                rdnSequence: [],
            },
            [
                new AttributeErrorData_problems_Item(
                    AttributeProblem_undefinedAttributeType,
                    type_,
                    undefined,
                ),
            ],
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

/**
 * @summary Converts a DAP modification to an LDAP modification
 * @description
 *
 * Converts a DAP modification to an LDAP modification.
 *
 * @param ctx The context object
 * @param mod The entry modification
 * @returns The LDAP changes
 *
 * @function
 */
function convert_dap_mod_to_ldap_mod (
    ctx: Context,
    mod: EntryModification,
): LDAPEntryModification {
    if ("addAttribute" in mod) {
        const encoder = getLDAPEncoder(ctx, mod.addAttribute.type_);
        if (!encoder) {
            throw new errors.AttributeError(...createAttributeErrorData(ctx, mod.addAttribute.type_));
        }
        const values = mod.addAttribute.values.map(encoder);
        if (mod.addAttribute.valuesWithContext?.length) {
            values.push(...mod.addAttribute.valuesWithContext.map((vwc) => encoder(vwc.value)));
        }
        return new LDAPEntryModification(
            ModifyRequest_changes_change_operation_add,
            new PartialAttribute(
                encodeLDAPOID(mod.addAttribute.type_),
                values,
            ),
        );
    }
    else if ("removeAttribute" in mod) {
        return new LDAPEntryModification(
            ModifyRequest_changes_change_operation_delete_,
            new PartialAttribute(
                encodeLDAPOID(mod.removeAttribute),
                [],
            ),
        );
    }
    else if ("addValues" in mod) {
        const encoder = getLDAPEncoder(ctx, mod.addValues.type_);
        if (!encoder) {
            throw new errors.AttributeError(...createAttributeErrorData(ctx, mod.addValues.type_));
        }
        const values = mod.addValues.values.map(encoder);
        if (mod.addValues.valuesWithContext?.length) {
            values.push(...mod.addValues.valuesWithContext.map((vwc) => encoder(vwc.value)));
        }
        return new LDAPEntryModification(
            ModifyRequest_changes_change_operation_add,
            new PartialAttribute(
                encodeLDAPOID(mod.addValues.type_),
                values,
            ),
        );
    }
    else if ("removeValues" in mod) {
        const encoder = getLDAPEncoder(ctx, mod.removeValues.type_);
        if (!encoder) {
            throw new errors.AttributeError(...createAttributeErrorData(ctx, mod.removeValues.type_));
        }
        const values = mod.removeValues.values.map(encoder);
        if (mod.removeValues.valuesWithContext?.length) {
            values.push(...mod.removeValues.valuesWithContext.map((vwc) => encoder(vwc.value)));
        }
        return new LDAPEntryModification(
            ModifyRequest_changes_change_operation_delete_,
            new PartialAttribute(
                encodeLDAPOID(mod.removeValues.type_),
                values,
            ),
        );
    }
    else if ("alterValues" in mod) {
        throw new errors.ServiceError(
            ctx.i18n.t("err:cannot_use_altervalues_in_ldap", {
                oid: mod.alterValues.type_.toString(),
            }),
            new ServiceErrorData(
                ServiceProblem_notSupportedByLDAP,
                [],
                createSecurityParameters(
                    ctx,
                    undefined,
                    undefined,
                    id_errcode_serviceError,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
        );
    }
    else if ("resetValue" in mod) {
        throw new errors.ServiceError(
            ctx.i18n.t("err:cannot_use_resetvalue_in_ldap", {
                oid: mod.resetValue.toString(),
            }),
            new ServiceErrorData(
                ServiceProblem_notSupportedByLDAP,
                [],
                createSecurityParameters(
                    ctx,
                    undefined,
                    undefined,
                    id_errcode_serviceError,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
        );
    }
    else if ("replaceValues" in mod) {
        const encoder = getLDAPEncoder(ctx, mod.replaceValues.type_);
        if (!encoder) {
            throw new errors.AttributeError(...createAttributeErrorData(ctx, mod.replaceValues.type_));
        }
        const values = mod.replaceValues.values.map(encoder);
        if (mod.replaceValues.valuesWithContext?.length) {
            values.push(...mod.replaceValues.valuesWithContext.map((vwc) => encoder(vwc.value)));
        }
        return new LDAPEntryModification(
            ModifyRequest_changes_change_operation_replace,
            new PartialAttribute(
                encodeLDAPOID(mod.replaceValues.type_),
                values,
            ),
        );
    }
    else {
        throw new Error();
    }
}

/**
 * @summary Convert an X.500 `AttributeValueAssertion` to an LDAP `AttributeValueAssertion`
 * @description
 *
 * Converts an X.500 `AttributeValueAssertion` to an LDAP `AttributeValueAssertion`.
 *
 * @param ctx The context object
 * @param ava An X.500 `AttributeValueAssertion`
 * @returns An LDAP `AttributeValueAssertion`
 *
 * @function
 */
function convert_dap_ava_to_ldap_ava (ctx: Context, ava: AttributeValueAssertion): LDAPAttributeValueAssertion {
    const encoder = getLDAPEncoder(ctx, ava.type_);
    if (!encoder) {
        throw new Error();
    }
    return new LDAPAttributeValueAssertion(
        encodeLDAPOID(ava.type_),
        encoder(ava.assertion),
    );
}

/**
 * @summary Default filter if a filter cannot be converted to LDAP.
 * @constant
 */
const NOT_UNDERSTOOD: LDAPFilter = {
    and: [],
};

/**
 * @summary Convert an X.500 `FilterItem` to an LDAP `FilterItem`
 * @description
 *
 * Converts an X.500 `FilterItem` to an LDAP `FilterItem`.
 *
 * @param ctx The context object
 * @param fi An X.500 `FilterItem`
 * @returns An LDAP `FilterItem`
 *
 * @function
 */
function convertDAPFilterItemToLDAPFilterItem (ctx: Context, fi: DAPFilterItem): LDAPFilter {
    if ("equality" in fi) {
        return {
            equalityMatch: convert_dap_ava_to_ldap_ava(ctx, fi.equality),
        };
    }
    else if ("substrings" in fi) {
        if (!fi.substrings.type_) {
            return NOT_UNDERSTOOD;
        }
        const spec = ctx.attributeTypes.get(fi.substrings.type_.toString());
        if (!spec?.ldapSyntax) {
            return NOT_UNDERSTOOD;
        }
        const ldapSyntax = ctx.ldapSyntaxes.get(spec.ldapSyntax.toString());
        if (!ldapSyntax?.encoder) {
            return NOT_UNDERSTOOD;
        }
        const encoder = ldapSyntax.encoder;
        return {
            substrings: new SubstringFilter(
                encodeLDAPOID(fi.substrings.type_),
                fi.substrings.strings
                    .map((str): SubstringFilter_substrings_substring | null => {
                        if ("initial" in str) {
                            return {
                                initial: encoder(str.initial),
                            }
                        } else if ("any_" in str) {
                            return {
                                any_: encoder(str.any_),
                            };
                        } else if ("final" in str) {
                            return {
                                final: encoder(str.final),
                            };
                        } else {
                            return null;
                        }
                    })
                        .filter((str): str is SubstringFilter_substrings_substring => !!str),
            ),
        };
    }
    else if ("greaterOrEqual" in fi) {
        return {
            greaterOrEqual: convert_dap_ava_to_ldap_ava(ctx, fi.greaterOrEqual),
        };
    }
    else if ("lessOrEqual" in fi) {
        return {
            lessOrEqual: convert_dap_ava_to_ldap_ava(ctx, fi.lessOrEqual),
        };
    }
    else if ("present" in fi) {
        return {
            present: encodeLDAPOID(fi.present),
        };
    }
    else if ("approximateMatch" in fi) {
        return {
            approxMatch: convert_dap_ava_to_ldap_ava(ctx, fi.approximateMatch),
        };
    }
    else if ("extensibleMatch" in fi) {
        if (!fi.extensibleMatch.type_) {
            return NOT_UNDERSTOOD;
        }
        const spec = ctx.attributeTypes.get(fi.extensibleMatch.type_.toString());
        if (!spec?.ldapSyntax) {
            return NOT_UNDERSTOOD;
        }
        const ldapSyntax = ctx.ldapSyntaxes.get(spec.ldapSyntax.toString());
        if (!ldapSyntax?.encoder) {
            return NOT_UNDERSTOOD;
        }
        const encoder = ldapSyntax.encoder;
        const mra = new MatchingRuleAssertion(
            fi.extensibleMatch.matchingRule?.length
                ? encodeLDAPOID(fi.extensibleMatch.matchingRule[0])
                : undefined,
            fi.extensibleMatch.type_
                ? encodeLDAPOID(fi.extensibleMatch.type_)
                : undefined,
            encoder(fi.extensibleMatch.matchValue),
            fi.extensibleMatch.dnAttributes,
        );
        return {
            extensibleMatch: mra,
        };
    }
    else if ("contextPresent" in fi) {
        return NOT_UNDERSTOOD;
    } else {
        return NOT_UNDERSTOOD;
    }
}

/**
 * @summary Convert an X.500 `Filter` into an LDAP `Filter`
 * @description
 *
 * Converts an X.500 `Filter` into an LDAP `Filter`.
 *
 * @param ctx The context object
 * @param filter An X.500 `Filter`
 * @returns An LDAP `Filter`
 *
 * @function
 */
function convertDAPFilterToLDAPFilter (ctx: Context, filter: DAPFilter): LDAPFilter {
    if ("and" in filter) {
        return {
            and: filter.and.map((sub) => convertDAPFilterToLDAPFilter(ctx, sub)),
        };
    } else if ("or" in filter) {
        return {
            or: filter.or.map((sub) => convertDAPFilterToLDAPFilter(ctx, sub)),
        };
    } else if ("not" in filter) {
        return {
            not: convertDAPFilterToLDAPFilter(ctx, filter.not),
        };
    } else if ("item" in filter) {
        return convertDAPFilterItemToLDAPFilterItem(ctx, filter.item);
    } else {
        return {
            and: [],
        };
    }
}

/**
 * @summary Converts an X.500 directory request to an LDAP request
 * @description
 *
 * This procedure is not specified in the X.500 series, but can be inferred from
 * ITU X.518 (2016), Section 20.6.
 *
 * @param ctx The context object
 * @param req The X.500 directory request that is to be converted to an LDAP request
 * @returns An LDAP message equivalent of the X.500 directory request
 *
 * @function
 */
export
function dapRequestToLDAPRequest (ctx: Context, req: Request): LDAPMessage {
    assert(req.opCode);
    const messageId: number = generateUnusedInvokeID(ctx);
    if (compareCode(req.opCode, administerPassword["&operationCode"]!)) {
        throw new errors.ServiceError(
            ctx.i18n.t("err:cannot_use_apw_in_ldap"),
            new ServiceErrorData(
                ServiceProblem_notSupportedByLDAP,
                [],
                createSecurityParameters(
                    ctx,
                    undefined,
                    undefined,
                    id_errcode_serviceError,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
        );
    }
    else if (compareCode(req.opCode, addEntry["&operationCode"]!)) {
        assert(req.argument);
        const arg = addEntry.decoderFor["&ArgumentType"]!(req.argument);
        const data = getOptionallyProtectedValue(arg);
        return new LDAPMessage(
            messageId,
            {
                addRequest: new AddRequest(
                    encodeLDAPDN(ctx, data.object.rdnSequence),
                    data.entry.map((attr) => {
                        const spec = ctx.attributeTypes.get(attr.type_.toString());
                        if (!spec?.ldapSyntax) {
                            throw new ServiceError(
                                ctx.i18n.t("err:not_supported_by_ldap"),
                                new ServiceErrorData(
                                    ServiceProblem_notSupportedByLDAP,
                                    [],
                                    createSecurityParameters(
                                        ctx,
                                        undefined,
                                        undefined,
                                        id_errcode_serviceError,
                                    ),
                                    undefined,
                                    undefined,
                                    undefined,
                                ),
                            );
                        }
                        const ldapSyntax = ctx.ldapSyntaxes.get(spec.ldapSyntax.toString());
                        if (!ldapSyntax?.encoder) {
                            throw new ServiceError(
                                ctx.i18n.t("err:not_supported_by_ldap"),
                                new ServiceErrorData(
                                    ServiceProblem_notSupportedByLDAP,
                                    [],
                                    createSecurityParameters(
                                        ctx,
                                        undefined,
                                        undefined,
                                        id_errcode_serviceError,
                                    ),
                                    undefined,
                                    undefined,
                                    undefined,
                                ),
                            );
                        }
                        const encoder = ldapSyntax.encoder;
                        const values: Uint8Array[] = attr.values.map(encoder);
                        if (attr.valuesWithContext?.length) {
                            values.push(...attr.valuesWithContext.map((vwc) => encoder(vwc.value)));
                        }
                        return new PartialAttribute(
                            encodeLDAPOID(attr.type_),
                            values,
                        );
                    }),
                ),
            },
            undefined,
        );
    }
    else if (compareCode(req.opCode, changePassword["&operationCode"]!)) {
        throw new errors.ServiceError(
            ctx.i18n.t("err:cannot_use_cpw_in_ldap"),
            new ServiceErrorData(
                ServiceProblem_notSupportedByLDAP,
                [],
                createSecurityParameters(
                    ctx,
                    undefined,
                    undefined,
                    id_errcode_serviceError,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
        );
    }
    else if (compareCode(req.opCode, compare["&operationCode"]!)) {
        assert(req.argument);
        const arg = compare.decoderFor["&ArgumentType"]!(req.argument);
        const data = getOptionallyProtectedValue(arg);
        const spec = ctx.attributeTypes.get(data.purported.type_.toString());
        if (!spec?.ldapSyntax) {
            throw new ServiceError(
                ctx.i18n.t("err:not_supported_by_ldap"),
                new ServiceErrorData(
                    ServiceProblem_notSupportedByLDAP,
                    [],
                    createSecurityParameters(
                        ctx,
                        undefined,
                        undefined,
                        id_errcode_serviceError,
                    ),
                    undefined,
                    undefined,
                    undefined,
                ),
            );
        }
        const ldapSyntax = ctx.ldapSyntaxes.get(spec.ldapSyntax.toString());
        if (!ldapSyntax?.encoder) {
            throw new ServiceError(
                ctx.i18n.t("err:not_supported_by_ldap"),
                new ServiceErrorData(
                    ServiceProblem_notSupportedByLDAP,
                    [],
                    createSecurityParameters(
                        ctx,
                        undefined,
                        undefined,
                        id_errcode_serviceError,
                    ),
                    undefined,
                    undefined,
                    undefined,
                ),
            );
        }
        const encoder = ldapSyntax.encoder;
        return new LDAPMessage(
            messageId,
            {
                compareRequest: new CompareRequest(
                    encodeLDAPDN(ctx, data.object.rdnSequence),
                    new LDAPAttributeValueAssertion(
                        encodeLDAPOID(data.purported.type_),
                        encoder(data.purported.assertion),
                    ),
                ),
            },
            undefined,
        );
    }
    else if (compareCode(req.opCode, list["&operationCode"]!)) {
        assert(req.argument);
        const arg = list.decoderFor["&ArgumentType"]!(req.argument);
        const data = getOptionallyProtectedValue(arg);
        const dontDereferenceAliases: boolean = (
            data.serviceControls?.options?.[ServiceControlOptions_dontDereferenceAliases] === TRUE_BIT);
        return new LDAPMessage(
            messageId,
            {
                searchRequest: new SearchRequest(
                    encodeLDAPDN(ctx, data.object.rdnSequence),
                    SearchRequest_scope_singleLevel,
                    dontDereferenceAliases
                        ? SearchRequest_derefAliases_neverDerefAliases
                        : SearchRequest_derefAliases_derefFindingBaseObj,
                    data?.serviceControls?.sizeLimit ?? 0,
                    data.serviceControls?.timeLimit ?? 0,
                    FALSE,
                    DEFAULT_LDAP_FILTER,
                    [
                        encodeLDAPOID(new ObjectIdentifier([ 1, 1 ])),
                    ],
                ),
            },
            undefined,
        );
    }
    else if (compareCode(req.opCode, modifyDN["&operationCode"]!)) {
        assert(req.argument);
        const arg = modifyDN.decoderFor["&ArgumentType"]!(req.argument);
        const data = getOptionallyProtectedValue(arg);
        return new LDAPMessage(
            messageId,
            {
                modDNRequest: new ModifyDNRequest(
                    encodeLDAPDN(ctx, data.object),
                    encodeLDAPDN(ctx, [ data.newRDN ]),
                    data.deleteOldRDN ?? false,
                    data.newSuperior
                        ? encodeLDAPDN(ctx, data.newSuperior)
                        : undefined,
                ),
            },
            undefined,
        );
    }
    else if (compareCode(req.opCode, modifyEntry["&operationCode"]!)) {
        assert(req.argument);
        const arg = modifyEntry.decoderFor["&ArgumentType"]!(req.argument);
        const data = getOptionallyProtectedValue(arg);
        return new LDAPMessage(
            messageId,
            {
                modifyRequest: new ModifyRequest(
                    encodeLDAPDN(ctx, data.object.rdnSequence),
                    data.changes.map((c) => convert_dap_mod_to_ldap_mod(ctx, c)),
                ),
            },
            undefined,
        );
    }
    else if (compareCode(req.opCode, read["&operationCode"]!)) {
        assert(req.argument);
        const arg = read.decoderFor["&ArgumentType"]!(req.argument);
        const data = getOptionallyProtectedValue(arg);
        const dontDereferenceAliases: boolean = (
            data.serviceControls?.options?.[ServiceControlOptions_dontDereferenceAliases] === TRUE_BIT);
        const selection: AttributeSelection = [];
        if (data.selection?.attributes && ("select" in data.selection.attributes)) {
            selection.push(...data.selection.attributes.select.map((s) => encodeLDAPOID(s)));
        }
        if (data.selection?.extraAttributes) {
            if ("allOperationalAttributes" in data.selection.extraAttributes) {
                selection.push(Buffer.from("*", "utf-8"));
            } else if ("select" in data.selection.extraAttributes) {
                selection.push(...data.selection.extraAttributes.select.map((s) => encodeLDAPOID(s)));
            }
        }
        return new LDAPMessage(
            messageId,
            {
                searchRequest: new SearchRequest(
                    encodeLDAPDN(ctx, data.object.rdnSequence),
                    SearchRequest_scope_baseObject,
                    dontDereferenceAliases
                        ? SearchRequest_derefAliases_neverDerefAliases
                        : SearchRequest_derefAliases_derefFindingBaseObj,
                    0, // Required by the specification.
                    data.serviceControls?.timeLimit ?? 0,
                    (data.selection?.infoTypes === EntryInformationSelection_infoTypes_attributeTypesOnly),
                    DEFAULT_LDAP_FILTER,
                    selection,
                ),
            },
            undefined,
        );
    }
    else if (compareCode(req.opCode, removeEntry["&operationCode"]!)) {
        assert(req.argument);
        const arg = removeEntry.decoderFor["&ArgumentType"]!(req.argument);
        const data = getOptionallyProtectedValue(arg);
        return new LDAPMessage(
            messageId,
            {
                delRequest: encodeLDAPDN(ctx, data.object.rdnSequence),
            },
            undefined,
        );
    }
    else if (compareCode(req.opCode, search["&operationCode"]!)) {
        assert(req.argument);
        const arg = search.decoderFor["&ArgumentType"]!(req.argument);
        const data = getOptionallyProtectedValue(arg);
        const dontDereferenceAliases: boolean = (
            data.serviceControls?.options?.[ServiceControlOptions_dontDereferenceAliases] === TRUE_BIT);
        const selection: AttributeSelection = [];
        if (data.selection?.attributes && ("select" in data.selection.attributes)) {
            selection.push(...data.selection.attributes.select.map((s) => encodeLDAPOID(s)));
        }
        if (data.selection?.extraAttributes) {
            if ("allOperationalAttributes" in data.selection.extraAttributes) {
                selection.push(Buffer.from("*", "utf-8"));
            } else if ("select" in data.selection.extraAttributes) {
                selection.push(...data.selection.extraAttributes.select.map((s) => encodeLDAPOID(s)));
            }
        }
        return new LDAPMessage(
            messageId,
            {
                searchRequest: new SearchRequest(
                    encodeLDAPDN(ctx, data.baseObject.rdnSequence),
                    Number(data.subset ?? SearchRequest_scope_baseObject),
                    dontDereferenceAliases
                        ? SearchRequest_derefAliases_neverDerefAliases
                        : SearchRequest_derefAliases_derefFindingBaseObj,
                    data?.serviceControls?.sizeLimit ?? 0,
                    data.serviceControls?.timeLimit ?? 0,
                    (data.selection?.infoTypes === EntryInformationSelection_infoTypes_attributeTypesOnly),
                    data.filter
                        ? convertDAPFilterToLDAPFilter(ctx, data.filter)
                        : DEFAULT_LDAP_FILTER,
                    selection,
                ),
            },
            undefined,
        );
    } else {
        throw new Error();
    }
}

export default dapRequestToLDAPRequest;
