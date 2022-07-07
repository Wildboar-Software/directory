import { BERElement, ASN1TruncationError, OBJECT_IDENTIFIER } from "asn1-ts";
import { DER } from "asn1-ts/dist/node/functional";
import type {
    DistributionPoint,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/DistributionPoint.ta";
import type {
    DistributionPointName,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/DistributionPointName.ta";
import {
    CertificateList,
    _decode_CertificateList,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/CertificateList.ta";
import type {
    Name,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Name.ta";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import type {
    GeneralNames,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/GeneralNames.ta";
import { strict as assert } from "assert";
import { URL } from "url";
import * as http from "http";
import * as https from "https";
import * as net from "net";
import { randomInt, randomUUID } from "crypto";
import type { TlsOptions } from "tls";
import {
    LDAPMessage, _decode_LDAPMessage, _encode_LDAPMessage,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPMessage.ta";
import {
    BindRequest,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/BindRequest.ta";
import {
    SearchRequest,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/SearchRequest.ta";
import {
    SearchRequest_scope_baseObject,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/SearchRequest-scope.ta";
import {
    SearchRequest_derefAliases_derefFindingBaseObj,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/SearchRequest-derefAliases.ta";
import type {
    SearchResultEntry,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/SearchResultEntry.ta";
import {
    success,
} from "@wildboar/ldap/src/lib/resultCodes";
import type {
    ReadArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadArgument.ta";
import {
    ReadArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadArgumentData.ta";
import {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import type {
    ReadResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadResult.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import {
    certificateRevocationList,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/certificateRevocationList.oa";
import {
    deltaRevocationList,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/deltaRevocationList.oa";
import {
    authorityRevocationList,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/authorityRevocationList.oa";
import {
    eepkCertificateRevocationList,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/eepkCertificateRevocationList.oa";
import {
    TypeAndContextAssertion,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/TypeAndContextAssertion.ta";
import { NOW_CONTEXT_ASSERTION } from "../constants";
import * as ftp from "basic-ftp";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";
import { differenceInSeconds } from "date-fns";

const MAX_LDAP_RESPONSE_SIZE: number = 100_000;
const CRL_CACHE_TTL_SECONDS: number = 3600;
const CACHE_SIZE_LIMIT: number = 1000;

const crlCache: Map<string, [ Date, CertificateList[] ]> = new Map();

export type ReadDispatcherFunction = (readArg: ReadArgument) => Promise<ReadResult>;

const crlAttributeTypes: OBJECT_IDENTIFIER[] = [
    certificateRevocationList["&id"],
    deltaRevocationList["&id"],
    authorityRevocationList["&id"],
    eepkCertificateRevocationList["&id"],
];

export
async function crlCurlDAP (
    dn: DistinguishedName,
    readDispatcher: ReadDispatcherFunction,
): Promise<CertificateList[] | null> {
    const arg: ReadArgument = {
        unsigned: new ReadArgumentData(
            {
                rdnSequence: dn,
            },
            new EntryInformationSelection(
                {
                    select: crlAttributeTypes,
                },
                undefined,
                undefined,
                { // We use a context assertion of "now" so we only get current CRLs.
                    selectedContexts: crlAttributeTypes
                        .map((attr) => new TypeAndContextAssertion(
                            attr,
                            {
                                all: [NOW_CONTEXT_ASSERTION],
                            },
                        )),
                },
            ),
        ),
    };
    try {
        const readResult = await readDispatcher(arg);
        const data = getOptionallyProtectedValue(readResult);
        // TODO: Check signature, being mindful of recursion perils.
        // NOTE: The signature on the read results still should be checked.
        // Actually, I don't think the signature needs to be checked because the
        // CRL itself is digitally signed. If somebody wanted to spoof the
        // signature, they could just return an unsigned result instead.
        // Also, this _should not_ be signed, since we do not request it.
        return data.entry.information
            ?.flatMap((info) => ("attribute" in info)
            ? [
                ...info.attribute.values,
                ...info.attribute.valuesWithContext
                    ?.map((vwc) => vwc.value) ?? [],
            ].map((value) => _decode_CertificateList(value))
            : []) ?? [];
    } catch {
        return null;
    }
}

export
async function crlCurlHTTP (
    url: URL,
    tlsOptions?: TlsOptions,
    timeoutInMilliseconds: number = 5000,
): Promise<CertificateList | null> {
    const transportClient = (url.protocol.toLowerCase() === "https:")
        ? https
        : http;
    // TODO: Check that response is application/ocsp-response
    // TODO: Accept: application/ocsp-response
    return new Promise((resolve, reject) => {
        const httpReq = transportClient.request(url, {
            ...(tlsOptions ?? {}),
            timeout: timeoutInMilliseconds,
        }, (res) => {
            const chunks: Buffer[] = [];
            res.on("data", (chunk: Buffer) => chunks.push(chunk));
            res.once("error", reject);
            res.once("timeout", reject);
            res.once("pause", reject); // This should not happen.
            res.once("end", () => {
                const responseBytes = Buffer.concat(chunks);
                const el = new BERElement();
                el.fromBytes(responseBytes);
                const ocspResponse = _decode_CertificateList(el);
                resolve(ocspResponse);
            });
            setTimeout(reject, timeoutInMilliseconds);
        });
        httpReq.once("error", reject);
        httpReq.once("timeout", reject);
        httpReq.end();
    });
}

export
function crlCurlLDAP (url: URL): Promise<CertificateList[] | null> {
    const firstMessageId: number = randomInt(1, 100_000_000);
    const attributes: string[] = url.searchParams
        ? Array.from(url.searchParams.values())
        : [ "certificateRevocationList;binary" ];
    let messageId: number = firstMessageId;
    const bind: LDAPMessage = new LDAPMessage(
        messageId,
        {
            bindRequest: new BindRequest(
                3,
                new Uint8Array(),
                {
                    simple: new Uint8Array(),
                },
            ),
        },
        undefined,
    );
    const read: LDAPMessage = new LDAPMessage(
        messageId,
        {
            searchRequest: new SearchRequest(
                Buffer.from(url.pathname.slice(1)),
                SearchRequest_scope_baseObject,
                SearchRequest_derefAliases_derefFindingBaseObj,
                1,
                5,
                false,
                { and: [] },
                attributes.map((attr) => Buffer.from(attr)),
            ),
        },
        undefined,
    );
    const unbind: LDAPMessage = new LDAPMessage(
        messageId,
        {
            unbindRequest: null,
        },
        undefined,
    );

    messageId++;
    const conn = net.createConnection(Number.parseInt(url.port, 10), url.hostname);
    let receivedData: Buffer = Buffer.allocUnsafe(0);
    return new Promise((resolve, reject) => {
        let entry: SearchResultEntry | undefined;
        function onFail () {
            reject();
            conn.removeAllListeners();
            conn.write(_encode_LDAPMessage(unbind, DER).toBytes());
            messageId++;
            conn.end();
        }
        function onMessage (msg: LDAPMessage) {
            if ("bindResponse" in msg.protocolOp) {
                if (msg.protocolOp.bindResponse.resultCode !== success) {
                    onFail();
                    return;
                }
                conn.write(_encode_LDAPMessage(read, DER).toBytes());
                messageId++;
            } else if ("searchResEntry" in msg.protocolOp) {
                if (entry) { // There should only be one entry.
                    onFail();
                    return;
                }
                entry = msg.protocolOp.searchResEntry;
            } else if ("searchResDone" in msg.protocolOp) {
                if (entry) {
                    resolve(entry.attributes.flatMap((attr) => attr
                        .vals
                        .map((val) => {
                            const crlEl = new BERElement();
                            crlEl.fromBytes(val);
                            return _decode_CertificateList(crlEl);
                        })));
                    conn.removeAllListeners();
                    conn.write(_encode_LDAPMessage(unbind, DER).toBytes());
                    messageId++;
                    conn.end();
                    return;
                } else {
                    onFail();
                    return;
                }
            } else { // Unexpected response.
                onFail();
                return;
            }
        }
        conn.on("connect", () => {
            conn.write(_encode_LDAPMessage(bind, DER).toBytes());
        });
        conn.on("data", (chunk: Buffer) => {
            receivedData = Buffer.concat([ receivedData, chunk ]);
            if (receivedData.length > MAX_LDAP_RESPONSE_SIZE) {
                reject();
                conn.removeAllListeners();
                conn.end();
                return;
            }
            let bytesRead = 0;
            while (bytesRead < receivedData.length) {
            const el = new BERElement();
                try {
                    bytesRead += el.fromBytes(receivedData);
                } catch (e) {
                    if (e instanceof ASN1TruncationError) {
                        return;
                    } else {
                        reject();
                        conn.removeAllListeners();
                        conn.end();
                        return;
                    }
                }
                const receivedMessage: LDAPMessage = _decode_LDAPMessage(el);
                onMessage(receivedMessage);
            }
        });
    });
}

/**
 *
 * Unfortunately, it does not seem like the `basic-ftp` NPM package supports
 * downloads into an in-memory buffer, so this implementation saves the download
 * to a temporary location on disk, then immediately reads it into memory.
 *
 * @param url
 * @returns
 */
export
async function crlCurlFTP (
    url: URL,
    tlsOptions?: TlsOptions,
): Promise<CertificateList | null> {
    const client = new ftp.Client();
    try {
        await client.access({
            host: url.hostname,
            port: Number.parseInt(url.port, 10),
            user: url.username,
            password: url.password,
            secure: false,
            secureOptions: {
                ...tlsOptions,
                pskCallback: undefined,
            },
        });
        const tempDir = await mkdtemp(path.join(os.tmpdir(), "ftp_dl_"));
        const randomBaseName: string = randomUUID();
        const fileName: string = `${randomBaseName}.crl`;
        const localFilePath: string = path.join(tempDir, fileName);
        await client.downloadTo(localFilePath, url.pathname);
        const contents = await readFile(localFilePath);
        const el = new BERElement();
        el.fromBytes(contents);
        rm(localFilePath).then().catch(); // Errors are just ignored.
        return _decode_CertificateList(el);
    } catch (e) {
        return null;
    } finally {
        client.close();
    }
}

export
async function crlCurl (
    dp: DistributionPoint,
    issuerName: Name,
    readDispatcher: ReadDispatcherFunction,
): Promise<CertificateList[] | null> {
    const crlIssuerName: GeneralNames = dp.cRLIssuer ?? [
        {
            directoryName: issuerName,
        },
    ];
    const dpn: DistributionPointName = dp.distributionPoint ?? {
        fullName: crlIssuerName,
    };
    if ("nameRelativeToCRLIssuer" in dpn) {
        const firstDN = crlIssuerName.find((cin) => ("directoryName" in cin));
        if (!firstDN) {
            return null;
        }
        assert("directoryName" in firstDN);
        const crlIssuerDN = firstDN.directoryName.rdnSequence;
        const name: DistinguishedName = [ ...crlIssuerDN, dpn.nameRelativeToCRLIssuer ];
        return crlCurlDAP(name, readDispatcher);
    }
    assert("fullName" in dpn);
    for (const generalName of dpn.fullName) {
        if ("directoryName" in generalName) {
            return crlCurlDAP(
                generalName.directoryName.rdnSequence,
                readDispatcher,
            );
        } else if ("uniformResourceIdentifier" in generalName) {
            /**
             * NOTE: You MUST NOT lowercase the URL, because there are some LDAP
             * attributes that are case-sensitive that may appear in LDAP DNs.
             *
             * The only normalization that can be done is to trim it, and maybe
             * lowercase the protocol.
             */
            const urlStr: string = generalName.uniformResourceIdentifier.trim();
            const cachedResult = crlCache.get(urlStr);
            const now = new Date();
            if (
                cachedResult
                && (Math.abs(differenceInSeconds(cachedResult[0], now)) <= CRL_CACHE_TTL_SECONDS)
            ) { // If there is a cached result and the result is not expired.
                return cachedResult[1];
            }
            try {
                const url: URL = new URL(urlStr);
                switch (url.protocol.toLowerCase()) {
                    case ("http:"):
                    case ("https:"): {
                        const res = await crlCurlHTTP(url);
                        const ret = res ? [ res ] : res;
                        if (ret) {
                            if (crlCache.size > CACHE_SIZE_LIMIT) {
                                crlCache.clear();
                            }
                            crlCache.set(urlStr, [ new Date(), ret ]);
                        }
                        return ret;
                    }
                    case ("ftp:"):
                    case ("ftps:"): {
                        const res = await crlCurlFTP(url);
                        const ret = res ? [ res ] : res;
                        if (ret) {
                            if (crlCache.size > CACHE_SIZE_LIMIT) {
                                crlCache.clear();
                            }
                            crlCache.set(urlStr, [ new Date(), ret ]);
                        }
                        return ret;
                    }
                    case ("ldap:"):
                    case ("ldaps:"): {
                        const ret = await crlCurlLDAP(url);
                        if (ret) {
                            if (crlCache.size > CACHE_SIZE_LIMIT) {
                                crlCache.clear();
                            }
                            crlCache.set(urlStr, [ new Date(), ret ]);
                        }
                        return ret;
                    }
                    default: {
                        continue;
                    }
                }
            } catch {
                continue;
            }
        }
    }
    return null;
}
