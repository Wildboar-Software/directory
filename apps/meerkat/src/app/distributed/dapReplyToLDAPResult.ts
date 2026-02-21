import { Buffer } from "node:buffer";
import type { Context, Vertex } from "../types/index.js";
import {
    BERElement,
    DERElement,
    ASN1TagClass,
    ASN1Construction,
    ASN1UniversalType,
} from "@wildboar/asn1";
import { DER } from "@wildboar/asn1/functional";
import type { Result } from "@wildboar/x500";
import { LDAPMessage } from "@wildboar/ldap";
import { compareCode } from "@wildboar/x500";
import {
    abandon,
    administerPassword,
    addEntry,
    changePassword,
    compare,
    modifyDN,
    modifyEntry,
    read,
    removeEntry,
    search,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    LDAPResult,
    LDAPResult_resultCode_success,
    LDAPResult_resultCode_compareTrue,
    LDAPResult_resultCode_compareFalse,
    SearchResultEntry,
    _encode_SearchResultEntry,
    PartialAttribute,
    LDAPDN,
    ExtendedResponse,
    encodeLDAPOID,
    Control,
    controls,
    extensions,
} from "@wildboar/ldap";
import { getOptionallyProtectedValue } from "@wildboar/x500";
import getDistinguishedName from "../x500/getDistinguishedName.js";
import encodeLDAPDN from "../ldap/encodeLDAPDN.js";
import type {
    SearchResult,
} from "@wildboar/x500/DirectoryAbstractService";
import getPartialAttributesFromEntryInformation from "../ldap/getPartialAttributesFromEntryInformation.js";
import { decodeLDAPOID } from "@wildboar/ldap";
import { strict as assert } from "node:assert";
import LDAPAssociation from "../ldap/LDAPConnection.js";
import util from "node:util";

const {
    postread: postreadOID,
    sortRequest: sortRequestOID,
    simpledPagedResults: sprOID,
    sortResponse: sortResponseOID,
} = controls;

const {
    cancel,
    dynamicRefresh,
    modifyPassword
} = extensions;

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
function getSearchResultEntries (
    ctx: Context,
    searchResult: SearchResult,
    onEntry: (entry: SearchResultEntry) => void,
): number {
    const data = getOptionallyProtectedValue(searchResult);
    let count: number = 0;
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
                if (process.env.MEERKAT_LOG_JSON !== "1") {
                    ctx.log.error(util.inspect(e));
                }
                ctx.log.error(ctx.i18n.t("err:error_converting_entry_to_ldap", { e }));
            }
        }
        count += data.searchInfo.entries.length;
    } else if ("uncorrelatedSearchInfo" in data) {
        for (const resultSet of data.uncorrelatedSearchInfo) {
            count += getSearchResultEntries(ctx, resultSet, onEntry);
        }
    }
    return count;
}

/**
 * @summary Converts a DAP reply into an LDAP result
 * @description
 *
 * This procedure is not specified in the X.500 series, but can be inferred from
 * ITU X.518 (2016), Section 20.7.
 *
 * @param ctx The context object
 * @param assn The LDAP association.
 * @param res The X.500 directory result that is to be translated to an LDAP result
 * @param req The message of the original LDAP request
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
    assn: LDAPAssociation,
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
                        _encode_SearchResultEntry(sre).toBytes(),
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
        const count = getSearchResultEntries(ctx, result, onEntry);
        const logInfo = {
            remoteFamily: assn.socket.remoteFamily,
            remoteAddress: assn.socket.remoteAddress,
            remotePort: assn.socket.remotePort,
            association_id: assn.id,
        };
        ctx.log.debug(ctx.i18n.t("log:ldap_search_result", {
            cid: assn.id,
            mid: req.messageID,
            count,
        }), logInfo);
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
    } else if (
        compareCode(res.opCode, modifyEntry["&operationCode"]!)
        && ("extendedReq" in req.protocolOp)
        && decodeLDAPOID(req.protocolOp.extendedReq.requestName).isEqualTo(dynamicRefresh)
    ) {
        if (!req.protocolOp.extendedReq.requestValue) {
            throw new Error("d89730dc-49a4-4ced-9219-1a176d1c121b");
        }
        const el = new BERElement();
        el.fromBytes(req.protocolOp.extendedReq.requestValue);
        const components = el.sequence;
        if (components.length !== 2) {
            throw new Error("0bede648-7126-4c78-be8a-75b3e0e0ff93");
        }
        const [ , requestTtlElement ] = components;
        const requestTtl = requestTtlElement.integer;
        return new LDAPMessage(
            req.messageID,
            {
                extendedResp: new ExtendedResponse(
                    LDAPResult_resultCode_success,
                    Buffer.alloc(0),
                    Buffer.from(successMessage, "utf-8"),
                    undefined,
                    Buffer.from(dynamicRefresh.toString()),
                    DERElement.fromSequence([
                        new DERElement(
                            ASN1TagClass.universal,
                            ASN1Construction.primitive,
                            ASN1UniversalType.integer,
                            requestTtl,
                        ),
                    ]).toBytes(),
                ),
            },
            undefined,
        );
    } else {
        throw new Error("74ffb55d-f745-49df-9eea-0fc91227f562");
    }
}

export default dapReplyToLDAPResult;
