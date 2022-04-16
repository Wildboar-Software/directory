import type { Context, Vertex } from "@wildboar/meerkat-types";
import {
    DERElement,
    ASN1TagClass,
    ASN1Construction,
    ASN1UniversalType,
} from "asn1-ts";
import { DER } from "asn1-ts/dist/node/functional";
import type { Result } from "@wildboar/x500/src/lib/types/Result";
import { LDAPMessage } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPMessage.ta";
import compareCode from "@wildboar/x500/src/lib/utils/compareCode";
import { abandon } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/abandon.oa";
import { administerPassword } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/administerPassword.oa";
import { addEntry } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/addEntry.oa";
import { changePassword } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/changePassword.oa";
import { compare } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/compare.oa";
// import { list } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/list.oa";
import { modifyDN } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/modifyDN.oa";
import { modifyEntry } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/modifyEntry.oa";
import { read } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/read.oa";
import { removeEntry } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/removeEntry.oa";
import { search } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/search.oa";
import {
    LDAPResult,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult.ta";
import {
    LDAPResult_resultCode_success,
    LDAPResult_resultCode_compareTrue,
    LDAPResult_resultCode_compareFalse,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult-resultCode.ta";
import {
    SearchResultEntry,
    _encode_SearchResultEntry,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/SearchResultEntry.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import getDistinguishedName from "../x500/getDistinguishedName";
import encodeLDAPDN from "../ldap/encodeLDAPDN";
import {
    PartialAttribute,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/PartialAttribute.ta";
import type {
    SearchResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchResult.ta";
import type {
    LDAPDN,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPDN.ta";
import getPartialAttributesFromEntryInformation from "../ldap/getPartialAttributesFromEntryInformation";
import {
    ExtendedResponse,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/ExtendedResponse.ta";
import encodeLDAPOID from "@wildboar/ldap/src/lib/encodeLDAPOID";
import {
    Control,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/Control.ta";
import {
    postread as postreadOID,
    sortRequest as sortRequestOID,
    simpledPagedResults as sprOID,
    sortResponse as sortResponseOID,
} from "@wildboar/ldap/src/lib/controls";
import {
    cancel,
    modifyPassword
} from "@wildboar/ldap/src/lib/extensions";
import decodeLDAPOID from "@wildboar/ldap/src/lib/decodeLDAPOID";
import { strict as assert } from "assert";

/**
 * @summary Break apart an X.500 SearchResult into LDAP search results
 * @description
 *
 * This function takes an X.500 `SearchResult` and breaks it up into individual
 * LDAP `SearchResultEntry` and pass each result into the `onEntry()` handler.
 *
 * @param ctx The context object
 * @param searchResult The X.500 search result
 * @param onEntry The `onEntry()` callback used to send results to an LDAP client.
 *
 * @function
 * @async
 */
async function getSearchResultEntries (
    ctx: Context,
    searchResult: SearchResult,
    onEntry: (entry: SearchResultEntry) => void,
): Promise<void> {
    const data = getOptionallyProtectedValue(searchResult);
    if ("searchInfo" in data) {
        for (const einfo of data.searchInfo.entries) {
            try {
                const dn: LDAPDN = encodeLDAPDN(ctx, einfo.name.rdnSequence);
                const attrs: PartialAttribute[] = getPartialAttributesFromEntryInformation(ctx, einfo.information ?? []);
                const entry = new SearchResultEntry(
                    dn,
                    attrs,
                );
                onEntry(entry);
            } catch (e) {
                ctx.log.error(ctx.i18n.t("err:error_converting_entry_to_ldap", { e }));
            }
        }
    } else if ("uncorrelatedSearchInfo" in data) {
        for (const resultSet of data.uncorrelatedSearchInfo) {
            getSearchResultEntries(ctx, resultSet, onEntry);
        }
    }
}

/**
 * @summary Converts a DAP reply into an LDAP result
 * @description
 *
 * This procedure is not specified in the X.500 series, but can be inferred from
 * ITU X.518 (2016), Section 20.7.
 *
 * @param ctx The context object
 * @param res The X.500 directory result that is to be translated to an LDAP result
 * @param messageId The message ID of the original LDAP request
 * @param onEntry A callback that takes a search result
 * @param foundDSE The DSE returned by the Find DSE procedure.
 * @returns An LDAP message response
 *
 * @function
 * @async
 */
export
function dapReplyToLDAPResult (
    ctx: Context,
    res: Result,
    req: LDAPMessage,
    onEntry: (entry: SearchResultEntry) => void,
    foundDSE?: Vertex,
): LDAPMessage {
    assert(res.opCode);
    const successMessage = ctx.i18n.t("main:success");
    let sortRequestControl: Control | undefined; // See: https://www.rfc-editor.org/rfc/rfc2891.html
    let simplePagedResultsControl: Control | undefined;
    for (const control of req.controls ?? []) {
        const oid = decodeLDAPOID(control.controlType);
        switch (oid.toString()) {
            case (sortRequestOID.toString()): {
                sortRequestControl = control;
                break;
            }
            case (sprOID.toString()): {
                simplePagedResultsControl = control;
                break;
            }
            default: continue;
        }
    }

    if (compareCode(res.opCode, addEntry["&operationCode"]!)) {
        return new LDAPMessage(
            req.messageID,
            {
                addResponse: new LDAPResult(
                    LDAPResult_resultCode_success,
                    Buffer.alloc(0),
                    Buffer.from(successMessage, "utf-8"),
                    undefined,
                ),
            },
            undefined,
        );
    }
    if (
        compareCode(res.opCode, administerPassword["&operationCode"]!)
        || compareCode(res.opCode, changePassword["&operationCode"]!)
    ) {
        const emptySeq = DERElement.fromSequence([]);
        return new LDAPMessage(
            req.messageID,
            {
                extendedResp: new ExtendedResponse(
                    LDAPResult_resultCode_success,
                    Buffer.alloc(0),
                    Buffer.from(successMessage, "utf-8"),
                    undefined,
                    encodeLDAPOID(modifyPassword),
                    emptySeq.toBytes(),
                ),
            },
            undefined,
        );
    }
    if (compareCode(res.opCode, compare["&operationCode"]!)) {
        const result = compare.decoderFor["&ResultType"]!(res.result!);
        const data = getOptionallyProtectedValue(result);
        return new LDAPMessage(
            req.messageID,
            {
                compareResponse: new LDAPResult(
                    data.matched
                        ? LDAPResult_resultCode_compareTrue
                        : LDAPResult_resultCode_compareFalse,
                    Buffer.alloc(0),
                    Buffer.from(successMessage, "utf-8"),
                    undefined,
                ),
            },
            undefined,
        );
    }
    if (compareCode(res.opCode, modifyDN["&operationCode"]!)) {
        return new LDAPMessage(
            req.messageID,
            {
                modDNResponse: new LDAPResult(
                    LDAPResult_resultCode_success,
                    Buffer.alloc(0),
                    Buffer.from(successMessage, "utf-8"),
                    undefined,
                ),
            },
            undefined,
        );
    }
    if (compareCode(res.opCode, modifyEntry["&operationCode"]!)) {
        const result = modifyEntry.decoderFor["&ResultType"]!(res.result!);
        let sre: SearchResultEntry | undefined;
        if ("information" in result) {
            const data = getOptionallyProtectedValue(result.information);
            if (data.entry) {
                const dn: LDAPDN = encodeLDAPDN(ctx, data.entry.name.rdnSequence);
                const attrs: PartialAttribute[] = getPartialAttributesFromEntryInformation(
                    ctx, data.entry.information ?? []);
                sre = new SearchResultEntry(
                    dn,
                    attrs,
                );
            }
        }
        return new LDAPMessage(
            req.messageID,
            {
                modifyResponse: new LDAPResult(
                    LDAPResult_resultCode_success,
                    Buffer.alloc(0),
                    Buffer.from(successMessage, "utf-8"),
                    undefined,
                ),
            },
            sre
                ? [
                    new Control(
                        encodeLDAPOID(postreadOID),
                        false,
                        _encode_SearchResultEntry(sre, DER).toBytes(),
                    ),
                ]
                : undefined,
        );
    }
    if (compareCode(res.opCode, read["&operationCode"]!)) {
        const result = read.decoderFor["&ResultType"]!(res.result!);
        const data = getOptionallyProtectedValue(result);
        const attrs: PartialAttribute[] = getPartialAttributesFromEntryInformation(ctx, data.entry.information ?? []);
        const foundDN: LDAPDN = foundDSE
            ? encodeLDAPDN(ctx, getDistinguishedName(foundDSE))
            : new Uint8Array();
        const entry = new SearchResultEntry(
            foundDN,
            attrs,
        );
        onEntry(entry);
        return new LDAPMessage(
            req.messageID,
            {
                searchResDone: new LDAPResult(
                    LDAPResult_resultCode_success,
                    Buffer.alloc(0),
                    Buffer.from(successMessage, "utf-8"),
                    undefined,
                ),
            },
            undefined,
        );
    }
    if (compareCode(res.opCode, removeEntry["&operationCode"]!)) {
        return new LDAPMessage(
            req.messageID,
            {
                delResponse: new LDAPResult(
                    LDAPResult_resultCode_success,
                    Buffer.alloc(0),
                    Buffer.from(successMessage, "utf-8"),
                    undefined,
                ),
            },
            undefined,
        );
    }
    if (compareCode(res.opCode, search["&operationCode"]!)) {
        const result = search.decoderFor["&ResultType"]!(res.result!);
        const data = getOptionallyProtectedValue(result);
        getSearchResultEntries(ctx, result, onEntry);
        const responseControls: Control[] = [];
        if (sortRequestControl) {
            responseControls.push(new Control(
                encodeLDAPOID(sortResponseOID),
                false,
                DERElement.fromSequence([
                    new DERElement(
                        ASN1TagClass.universal,
                        ASN1Construction.primitive,
                        ASN1UniversalType.enumerated,
                        0, // Success in sorting.
                    ),
                ]).toBytes(),
            ));
        }
        if (
            simplePagedResultsControl
            && ("searchInfo" in data)
        ) {
            responseControls.push(new Control(
                encodeLDAPOID(sprOID),
                false,
                DERElement.fromSequence([
                    /**
                     * From IETF RFC 2696, Section 3:
                     *
                     * > Servers that cannot provide such an estimate MAY set
                     * > this size to zero (0).
                     */
                    new DERElement(
                        ASN1TagClass.universal,
                        ASN1Construction.primitive,
                        ASN1UniversalType.integer,
                        0,
                    ),
                    /**
                     * From IETF RFC 2696, Section 3:
                     *
                     * > The cookie MUST be set to an empty value if there are
                     * > no more entries to return (i.e., the page of search
                     * > results returned was the last)
                     */
                    new DERElement(
                        ASN1TagClass.universal,
                        ASN1Construction.primitive,
                        ASN1UniversalType.octetString,
                        data.searchInfo.partialOutcomeQualifier?.queryReference
                            ? data.searchInfo.partialOutcomeQualifier.queryReference
                            : new Uint8Array(),
                    ),
                ]).toBytes(),
            ));
        }
        return new LDAPMessage(
            req.messageID,
            {
                searchResDone: new LDAPResult(
                    LDAPResult_resultCode_success,
                    Buffer.alloc(0),
                    Buffer.from(successMessage, "utf-8"),
                    undefined,
                ),
            },
            responseControls?.length
                ? responseControls
                : undefined,
        );
    } else if (
        compareCode(res.opCode, abandon["&operationCode"]!)
        && ("extendedReq" in req.protocolOp)
        && decodeLDAPOID(req.protocolOp.extendedReq.requestName).isEqualTo(cancel)
    ) {
        return new LDAPMessage(
            req.messageID,
            {
                extendedResp: new ExtendedResponse(
                    LDAPResult_resultCode_success,
                    Buffer.alloc(0),
                    Buffer.from(successMessage, "utf-8"),
                    undefined,
                    undefined,
                    undefined,
                ),
            },
            undefined,
        );
    } else {
        throw new Error("74ffb55d-f745-49df-9eea-0fc91227f562");
    }
}

export default dapReplyToLDAPResult;
