import type { RemoteCRLOptions } from "@wildboar/meerkat-types";
import { curlHTTP, curlHTTP2, curlFTP, curlLDAP } from "./curl";
import { BERElement, OBJECT_IDENTIFIER } from "asn1-ts";
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
import { differenceInSeconds } from "date-fns";
import type { MeerkatContext } from "../ctx";
import {
    ServiceControls,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControls.ta";
import { getAttributeSize } from "@wildboar/x500";

const CRL_CACHE_TTL_SECONDS: number = 3600;
const CACHE_SIZE_LIMIT: number = 1000;

/**
 * @summary The internal cache of fetched remote CRLs by URL.
 * @description
 *
 * Fetching remote CRLs can be time-consuming, and it may be costly to decode
 * large ones. This cache stores recently fetched remote CRLs by their URL.
 * This URL MUST NOT be lowercased to normalize it, because some URLs are
 * case-sensitive.
 *
 * @const
 */
export
const crlCache: Map<string, [ Date, CertificateList[] ]> = new Map();

/**
 * @summary A function that will perform a local `read` operation.
 *
 * A function that will perform a local `read` operation using the supplied
 * read argument, and return a promise that resolves to a read result.
 */
export type ReadDispatcherFunction = (readArg: ReadArgument) => Promise<ReadResult>;

const crlAttributeTypes: OBJECT_IDENTIFIER[] = [
    certificateRevocationList["&id"],
    deltaRevocationList["&id"],
    authorityRevocationList["&id"],
    eepkCertificateRevocationList["&id"],
];

/**
 * @summary Fetches CRLs using the Directory Access Protocol (DAP)
 * @description
 *
 * This function uses the X.500 Directory Access Protocol (DAP) `read` operation
 * to query the certificate revocation lists (CRLs) for a given entry.
 *
 * @param dn The distinguished name to query
 * @param readDispatcher The read dispatcher function
 * @param timeoutInMilliseconds A timeout in milliseconds for the operation to complete
 * @param sizeLimit The maximum size of the CRL attribute (not individual values of it)
 * @returns An array of decoded CRLs, or `null` if they could not be obtained.
 *
 * @async
 * @function
 */
export
async function crlCurlDAP (
    dn: DistinguishedName,
    readDispatcher: ReadDispatcherFunction,
    timeoutInMilliseconds: number = 5000,
    sizeLimit: number = 1_000_000,
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
            undefined,
            undefined,
            new ServiceControls(
                undefined,
                undefined,
                Math.max(Math.floor(timeoutInMilliseconds / 1000), 1),
                undefined, // sizeLimit is only applicable to list and search.
                undefined,
                sizeLimit,
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
            ?.flatMap((info) => ("attribute" in info) && (getAttributeSize(info.attribute) <= sizeLimit)
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

/**
 * @summary Fetchs remote CRLs for a given distribution point
 * @description
 *
 * Fetches retmote certificate revocation lists (CRLs) from a given distribution
 * point, with configurable support for these protocols:
 *
 * - HyperText Transport Protocol (HTTP)
 * - Directory Access Protocol (DAP)
 * - Lightweight Directory Access Protocol (LDAP)
 * - File Transfer Protocol (FTP)
 *
 * @param ctx The context object
 * @param dp The CRL distribution point
 * @param issuerName The issuer's directory name
 * @param readDispatcher The read dispatcher function
 * @param options Options
 * @returns An array of decoded CRLs, or `null` if they could not be obtained.
 *
 * @async
 * @function
 */
export
async function crlCurl (
    ctx: MeerkatContext,
    dp: DistributionPoint,
    issuerName: Name,
    readDispatcher: ReadDispatcherFunction,
    options: RemoteCRLOptions,
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
        return crlCurlDAP(
            name,
            readDispatcher,
            (options.remoteCRLTimeout * 1000),
            options.remoteCRLFetchSizeLimit,
        );
    }
    assert("fullName" in dpn);
    let attemptBudget: number = options.endpointsToAttemptPerDistributionPoint;
    for (const generalName of dpn.fullName) {
        if ("directoryName" in generalName) {
            if (attemptBudget === 0) {
                break;
            }
            attemptBudget--;
            return crlCurlDAP(
                generalName.directoryName.rdnSequence,
                readDispatcher,
                (options.remoteCRLTimeout * 1000),
                options.remoteCRLFetchSizeLimit,
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
            const url: URL = new URL(urlStr);
            if (options.remoteCRLSupportedProtocols
                ?.has(url.protocol.toLowerCase().replace(":", ""))) {
                continue;
            }
            if (attemptBudget === 0) {
                break;
            }
            attemptBudget--;
            const cachedResult = crlCache.get(urlStr);
            const now = new Date();
            if (
                cachedResult
                && (Math.abs(differenceInSeconds(cachedResult[0], now)) <= CRL_CACHE_TTL_SECONDS)
            ) { // If there is a cached result and the result is not expired.
                return cachedResult[1];
            }
            try {
                switch (url.protocol.toLowerCase()) {
                    case ("http:"):
                    case ("https:"): {
                        const res = await curlHTTP(
                            url,
                            ctx.config.tls,
                            (options.remoteCRLTimeout * 1000),
                            options.remoteCRLFetchSizeLimit,
                        );
                        if (!res) {
                            return res;
                        }
                        const crlEl = new BERElement();
                        crlEl.fromBytes(res);
                        const ret = [ _decode_CertificateList(crlEl) ];
                        if (crlCache.size > CACHE_SIZE_LIMIT) {
                            crlCache.clear();
                        }
                        crlCache.set(urlStr, [ new Date(), ret ]);
                        return ret;
                    }
                    // Technically, HTTP/2 should just use a http:// URL scheme.
                    case ("http2:"):
                    case ("http2s:"): {
                        const res = await curlHTTP2(
                            url,
                            ctx.config.tls,
                            (options.remoteCRLTimeout * 1000),
                            options.remoteCRLFetchSizeLimit,
                        );
                        if (!res) {
                            return res;
                        }
                        const crlEl = new BERElement();
                        crlEl.fromBytes(res);
                        const ret = [ _decode_CertificateList(crlEl) ];
                        if (crlCache.size > CACHE_SIZE_LIMIT) {
                            crlCache.clear();
                        }
                        crlCache.set(urlStr, [ new Date(), ret ]);
                        return ret;
                    }
                    case ("ftp:"):
                    case ("ftps:"): {
                        const res = await curlFTP(
                            url,
                            ctx.config.tls,
                            (options.remoteCRLTimeout * 1000),
                            options.remoteCRLFetchSizeLimit,
                            ctx.log.debug,
                        );
                        if (!res) {
                            return res;
                        }
                        const crlEl = new BERElement();
                        crlEl.fromBytes(res);
                        const ret = [ _decode_CertificateList(crlEl) ];
                        if (crlCache.size > CACHE_SIZE_LIMIT) {
                            crlCache.clear();
                        }
                        crlCache.set(urlStr, [ new Date(), ret ]);
                        return ret;
                    }
                    case ("ldap:"):
                    case ("ldaps:"): {
                        const res = await curlLDAP(
                            url,
                            [ "certificateRevocationList;binary" ],
                            ctx.config.tls,
                            (options.remoteCRLTimeout * 1000),
                            options.remoteCRLFetchSizeLimit,
                        );
                        if (!res) {
                            return res;
                        }
                        const ret = res.map((r) => {
                            const crlEl = new BERElement();
                            crlEl.fromBytes(r);
                            return _decode_CertificateList(crlEl);
                        });
                        if (crlCache.size > CACHE_SIZE_LIMIT) {
                            crlCache.clear();
                        }
                        crlCache.set(urlStr, [ new Date(), ret ]);
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
