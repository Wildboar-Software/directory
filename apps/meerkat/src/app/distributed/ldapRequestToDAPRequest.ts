import type { Context } from "../types";
import * as errors from "../errors";
import { DER } from "asn1-ts/dist/node/functional";
import type { Request } from "@wildboar/x500/src/lib/types/Request";
import type {
    LDAPMessage,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPMessage.ta";
import { randomInt } from "crypto";
import { AddEntryArgument, _encode_AddEntryArgument } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AddEntryArgument.ta";
import { CompareArgument, _encode_CompareArgument } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareArgument.ta";
import { ModifyDNArgument, _encode_ModifyDNArgument } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyDNArgument.ta";
import { ModifyEntryArgument, _encode_ModifyEntryArgument } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyEntryArgument.ta";
import { RemoveEntryArgument, _encode_RemoveEntryArgument } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/RemoveEntryArgument.ta";
import { SearchArgument, _encode_SearchArgument } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgument.ta";
import { AddEntryArgumentData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AddEntryArgumentData.ta";
import { CompareArgumentData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareArgumentData.ta";
import { ModifyDNArgumentData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyDNArgumentData.ta";
import { ModifyEntryArgumentData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyEntryArgumentData.ta";
import { RemoveEntryArgumentData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/RemoveEntryArgumentData.ta";
import { SearchArgumentData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData.ta";
import { addEntry } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/addEntry.oa";
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

const MAX_INVOKE_ID: number = 2147483648;

const NOT_UNDERSTOOD: DAPFilter = {
    and: [],
};

function getLDAPDecoder (ctx: Context, descriptor: string): LDAPSyntaxDecoder | null {
    const spec = ctx.attributes.get(descriptor);
    if (!spec?.ldapSyntax) {
        return null;
    }
    const ldapSyntax = ctx.ldapSyntaxes.get(spec.ldapSyntax.toString());
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
    const spec = ctx.attributes.get(desc);
    if (!spec?.ldapSyntax) {
        throw new errors.AttributeError(...createAttributeErrorData(ctx, desc));
    }
    const ldapSyntax = ctx.ldapSyntaxes.get(spec.ldapSyntax.toString());
    if (!ldapSyntax?.decoder) {
        throw new errors.AttributeError(...createAttributeErrorData(ctx, desc));
    }
    const decoder = ldapSyntax.decoder;
    switch (mod.operation) {
    case (ModifyRequest_changes_change_operation_add): {
        return {
            addValues: new Attribute(
                spec.id,
                mod.modification.vals.map(decoder),
                undefined,
            ),
        };
    }
    case (ModifyRequest_changes_change_operation_delete_): {
        if (mod.modification.vals.length === 0) {
            return {
                removeAttribute: spec.id,
            };
        }
        return {
            removeValues: new Attribute(
                spec.id,
                mod.modification.vals.map(decoder),
                undefined,
            ),
        };
    }
    case (ModifyRequest_changes_change_operation_replace): {
        return {
            replaceValues: new Attribute(
                spec.id,
                mod.modification.vals.map(decoder),
                undefined,
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
    const spec = ctx.attributes.get(desc);
    if (!spec?.ldapSyntax) {
        throw new errors.AttributeError(...createAttributeErrorData(ctx, desc));
    }
    const ldapSyntax = ctx.ldapSyntaxes.get(spec.ldapSyntax.toString());
    if (!ldapSyntax?.decoder) {
        throw new errors.AttributeError(...createAttributeErrorData(ctx, desc));
    }
    const decoder = ldapSyntax.decoder;
    return new AttributeValueAssertion(
        spec.id,
        decoder(ava.assertionValue),
        undefined,
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
        const spec = ctx.attributes.get(desc);
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
                            throw new Error(); // TODO:
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
        const spec = ctx.attributes.get(desc);
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
        const matchingRule = filter.extensibleMatch.matchingRule
            ? ctx.attributes.get(normalizeAttributeDescription(filter.extensibleMatch.matchingRule))?.id
            : undefined;
        const desc = normalizeAttributeDescription(filter.extensibleMatch.type_);
        const spec = ctx.attributes.get(desc);
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
                extensibleMatch: new MatchingRuleAssertion(
                    matchingRule
                        ? [ matchingRule ]
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

export
function ldapRequestToDAPRequest (ctx: Context, req: LDAPMessage): Request {
    const invokeId: InvokeId = {
        present: randomInt(MAX_INVOKE_ID),
    };
    if ("bindRequest" in req.protocolOp) {
        throw new Error();
    }
    else if ("unbindRequest" in req.protocolOp) {
        throw new Error();
    }
    else if ("searchRequest" in req.protocolOp) {
        const attrs = req.protocolOp.searchRequest.attributes;
        const returnAllUserAttributesExclusively: boolean = (attrs.length === 0); // Case #1
        const returnAllUserAttributesInclusively: boolean = attrs.some((attr) => attr[0] === 0x2A); // Case #2
        const returnNoAttributes: boolean = (
            (attrs.length === 1)
            && (attrs[0].length === 3)
            && (attrs[0][0] === 0x31) // 1
            && (attrs[0][1] === 0x2E) // .
            && (attrs[0][2] === 0x31) // 1
        ); // Case #3
        const selectedAttributes: AttributeType[] = attrs
            .filter((attr) => (attr.length > 1))
            .map((attr) => {
                const desc = normalizeAttributeDescription(attr);
                if (desc === "1.1") {
                    return null;
                }
                const spec = ctx.attributes.get(desc);
                return spec?.id;
            })
                .filter((id): id is AttributeType => !!id);
        const eis: EntryInformationSelection = new EntryInformationSelection(
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
            req.protocolOp.searchRequest.typesOnly
                ? EntryInformationSelection_infoTypes_attributeTypesOnly
                : EntryInformationSelection_infoTypes_attributeTypesAndValues,
            returnAllUserAttributesExclusively
                ? undefined
                : {
                    select: selectedAttributes,
                },
            undefined,
            false,
            undefined,
        );
        const dapReq: SearchArgument = {
            unsigned: new SearchArgumentData(
                {
                    rdnSequence: decodeLDAPDN(ctx, req.protocolOp.searchRequest.baseObject),
                },
                req.protocolOp.searchRequest.scope,
                // req.protocolOp.searchRequest.filter
                //     ? convert_ldap_filter_to_dap_filter(ctx, req.protocolOp.searchRequest.filter)
                //     : undefined,
                undefined,
                Boolean(req.protocolOp.searchRequest.derefAliases),
                undefined, // FIXME: eis,
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
                [],
                new ServiceControls(
                    undefined,
                    undefined,
                    // req.protocolOp.searchRequest.timeLimit,
                    undefined,
                    // req.protocolOp.searchRequest.sizeLimit,
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
        const dapReq: ModifyEntryArgument = {
            unsigned: new ModifyEntryArgumentData(
                {
                    rdnSequence: decodeLDAPDN(ctx, req.protocolOp.modifyRequest.object),
                },
                req.protocolOp.modifyRequest.changes.map((c) => convert_ldap_mod_to_dap_mod(ctx, c)),
                undefined,
                [],
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
        // TODO: targetSystem support.
        const dapReq: AddEntryArgument = {
            unsigned: new AddEntryArgumentData(
                {
                    rdnSequence: decodeLDAPDN(ctx, req.protocolOp.addRequest.entry),
                },
                req.protocolOp.addRequest.attributes
                    .map((attr): Attribute | undefined => {
                        const desc = normalizeAttributeDescription(attr.type_);
                        const spec = ctx.attributes.get(desc);
                        const decoder = getLDAPDecoder(ctx, desc);
                        if (!decoder) {
                            throw new errors.AttributeError(...createAttributeErrorData(ctx, desc));
                        }
                        try {
                            return new Attribute(
                                spec!.id,
                                attr.vals.map(decoder),
                                undefined,
                            );
                        } catch (e) {
                            ctx.log.warn(`Could not encode attribute type ${desc}: ${e}`);
                            return undefined;
                        }
                    })
                        .filter((attr): attr is Attribute => !!attr),
                undefined,
                [],
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
        const spec = ctx.attributes.get(desc);
        if (!spec?.ldapSyntax) {
            throw new errors.AttributeError(...createAttributeErrorData(ctx, desc));
        }
        const decoder = getLDAPDecoder(ctx, desc);
        if (!decoder) {
            throw new errors.AttributeError(...createAttributeErrorData(ctx, desc));
        }
        const dapReq: CompareArgument = {
            unsigned: new CompareArgumentData(
                {
                    rdnSequence: decodeLDAPDN(ctx, req.protocolOp.compareRequest.entry),
                },
                new AttributeValueAssertion(
                    spec.id,
                    decoder(req.protocolOp.compareRequest.ava.assertionValue),
                    undefined,
                ),
                [],
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
        throw new Error();
    }
    else if ("extendedReq" in req.protocolOp) {
        throw new Error();
    } else {
        throw new Error();
    }
}

export default ldapRequestToDAPRequest;
