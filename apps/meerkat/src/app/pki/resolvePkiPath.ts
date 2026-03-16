import type { MeerkatContext } from "../ctx.js";
import { _decode_Certificate, type Certificate, type CertificateSerialNumber, type PkiPath } from "@wildboar/x500/AuthenticationFramework";
import type { AttributeType, Name } from "@wildboar/x500/InformationFramework";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter.js";
import { compareName, EqualityMatcher } from "@wildboar/x500";
import { getInfoForNextCertInPath, type IssuerCertInfo } from "./getInfoForNextCertInPath.js";
import { lookupPkiPathViaX500 } from "./lookupPkiPath.js";
import certsCurl from "./certCurl.js";
import { TrustAnchorChoice } from "@wildboar/tal";
import { isCertInTrustAnchor } from "./isCertInTrustAnchor.js";

// FIXME: This function never returns except by recursing too deep.
// It has to take a list of certificate authorities 

const MAX_CERT_SIZE_BYTES = 1_000_000; // 1MB should be enough for a cert.

async function handleNextCert(
    ctx: MeerkatContext,
    certsBySerialNumberLowerHex: Map<string, Certificate[]>,
    certsByKeyIdLowerHex: Map<string, Certificate[]>,
    trustAnchors: TrustAnchorChoice[],
    recursionTTL: number,
    cert: Certificate,
    namingMatcher: (attrType: AttributeType) => EqualityMatcher | undefined,
): Promise<PkiPath | null> {
    const certIsTrusted = trustAnchors.some((ta) => isCertInTrustAnchor(cert, ta));
    const certIsSelfSigned = compareName(
        cert.toBeSigned.issuer,
        cert.toBeSigned.subject,
        namingMatcher,
    );
    if (certIsTrusted || certIsSelfSigned) {
        return [cert];
    }
    const nextInfo = getInfoForNextCertInPath(cert);
    const ret = await resolvePkiPath(
        ctx,
        false,
        nextInfo,
        certsBySerialNumberLowerHex,
        certsByKeyIdLowerHex,
        trustAnchors,
        recursionTTL - 1,
    );
    if (!ret) {
        return null;
    }
    ret.push(cert);
    return ret;
}

function sortCertsIntoPkiPath(
    certs: Certificate[],
    firstIssuerName: Name,
    namingMatcher: (attrType: AttributeType) => EqualityMatcher | undefined,
    recursionTTL: number,
): PkiPath | null {
    /* We prevent a large number of inputs, since the many-to-many
    search below runs with O(n^2) time complexity. Sad! */
    // TODO: Implement a DNSet type
    if (recursionTTL > certs.length) {
        return null;
    }
    let currentIssuerName = firstIssuerName;
    const pkiPath: PkiPath = [];
    while (recursionTTL > 0) {
        recursionTTL--;
        const nextCert = certs.find((cert) => compareName(cert.toBeSigned.subject, currentIssuerName, namingMatcher));
        if (!nextCert) {
            break;
        }
        pkiPath.push(nextCert);
        currentIssuerName = nextCert.toBeSigned.issuer;
    }
    return pkiPath;
}

export
async function resolvePkiPath(
    ctx: MeerkatContext,
    endEntityIsNext: boolean,
    info: Partial<IssuerCertInfo>,
    certsBySerialNumberLowerHex: Map<string, Certificate[]>,
    certsByKeyIdLowerHex: Map<string, Certificate[]>,
    trustAnchors: TrustAnchorChoice[],
    recursionTTL: number = 5,
): Promise<PkiPath | null> {
    if (recursionTTL <= 0) {
        return null;
    }
    recursionTTL--;
    const namingMatcher = getNamingMatcherGetter(ctx);
    const issuerDirectoryNames = info.issuerNames
        ?.map((gn) => ("directoryName" in gn) && gn.directoryName)
        .filter((n): n is Name => !!n)
        .slice(0, 100) ?? []; // 100 is a reasonable limit to prevent DoS attacks by large inputs.

    // Try to find the cert via serial number first.
    if (info.serialNumber && issuerDirectoryNames.length) {
        const key = Buffer.from(
            info.serialNumber.buffer,
            info.serialNumber.byteOffset,
            info.serialNumber.byteLength,
        ).toString("hex");
        const certsWithMatchingSerialNumber = certsBySerialNumberLowerHex.get(key);
        // WARNING: O(n^2) complexity
        const cert = certsWithMatchingSerialNumber
            // Realistically, there should not be >= 1 cert with the same serial number.
            ?.slice(0, 10)
            .find((cert) => issuerDirectoryNames.some((idn) => compareName(cert.toBeSigned.issuer, idn, namingMatcher)))
        if (cert) {
            return handleNextCert(
                ctx,
                certsBySerialNumberLowerHex,
                certsByKeyIdLowerHex,
                trustAnchors,
                recursionTTL,
                cert,
                namingMatcher,
            );
        }
    }

    // Try to find the cert via key identifier next.
    // Mostly copied from the block above.
    if (info.keyIdentifier && issuerDirectoryNames.length) {
        const key = Buffer.from(
            info.keyIdentifier.buffer,
            info.keyIdentifier.byteOffset,
            info.keyIdentifier.byteLength,
        ).toString("hex");
        const certsWithMatchingKeyId = certsByKeyIdLowerHex.get(key);
        // WARNING: O(n^2) complexity
        const cert = certsWithMatchingKeyId
            // Realistically, there should not be >= 1 cert with the same serial number.
            ?.slice(0, 10)
            .find((cert) => issuerDirectoryNames.some((idn) => compareName(cert.toBeSigned.issuer, idn, namingMatcher)))
        if (cert) {
            return handleNextCert(
                ctx,
                certsBySerialNumberLowerHex,
                certsByKeyIdLowerHex,
                trustAnchors,
                recursionTTL,
                cert,
                namingMatcher,
            );
        }
    }

    /* Looking up via X.500 is preferable, because we could resolve the entire
    PKI path in one operation and the data could reside locally, meaning low
    latency and computational overhead. */
    if (info.subjectName) {
        const pkiPathOrCert = await lookupPkiPathViaX500(
            ctx,
            info.subjectName,
            endEntityIsNext,
            info.issuerNames,
            info.serialNumber,
            info.keyIdentifier,
            undefined,
            {
                // TODO: Set options
            },
        );
        if (Array.isArray(pkiPathOrCert)) {
            // If we got the full PKI path, we're done.
            return pkiPathOrCert;
        }
        
        // If we got a single certificate, we need to resolve the rest of the path.
        if (pkiPathOrCert) {
            const cert = pkiPathOrCert;
            return handleNextCert(
                ctx,
                certsBySerialNumberLowerHex,
                certsByKeyIdLowerHex,
                trustAnchors,
                recursionTTL,
                cert,
                namingMatcher,
            );
        }
        // ...otherwise, try CA issuer locations.
    }
    if (info.caIssuerLocations) {
        let caIssuerLocationsTried: number = 0;
        for (const loc of info.caIssuerLocations) {
            if (caIssuerLocationsTried >= 10) {
                break;
            }
            if ("directoryName" in loc) {
                caIssuerLocationsTried++;
                const dn = loc.directoryName.rdnSequence;
                if (dn.length === 0) {
                    continue;
                }
                const pkiPathOrCert = await lookupPkiPathViaX500(
                    ctx,
                    loc.directoryName,
                    endEntityIsNext,
                    info.issuerNames,
                    info.serialNumber,
                    info.keyIdentifier,
                    undefined,
                    {
                        // TODO: Set options
                    },
                );
                if (Array.isArray(pkiPathOrCert)) {
                    // If we got the full PKI path, we're done.
                    return pkiPathOrCert;
                }
        
                // If we got a single certificate, we need to resolve the rest of the path.
                if (pkiPathOrCert) {
                    const cert = pkiPathOrCert;
                    return handleNextCert(
                        ctx,
                        certsBySerialNumberLowerHex,
                        certsByKeyIdLowerHex,
                        trustAnchors,
                        recursionTTL,
                        cert,
                        namingMatcher,
                    );
                }
            }
            if ("uniformResourceIdentifier" in loc) {
                caIssuerLocationsTried++;
                /**
                 * NOTE: You MUST NOT lowercase the URL, because there are some LDAP
                 * attributes that are case-sensitive that may appear in LDAP DNs.
                 *
                 * The only normalization that can be done is to trim it, and maybe
                 * lowercase the protocol.
                 */
                const urlStr: string = loc.uniformResourceIdentifier.trim();
                const url: URL = new URL(urlStr);
                const certs = await certsCurl(url, endEntityIsNext);
                if (!certs) {
                    continue;
                }
                // TODO: Handle differently if only one cert is returned.
                if (certs.length === 1) {
                    return handleNextCert(
                        ctx,
                        certsBySerialNumberLowerHex,
                        certsByKeyIdLowerHex,
                        trustAnchors,
                        recursionTTL,
                        certs[0],
                        namingMatcher,
                    );
                }
                if (info.subjectName) {
                    const sortedCerts = sortCertsIntoPkiPath(
                        certs,
                        info.subjectName,
                        namingMatcher,
                        recursionTTL,
                    );
                    if (sortedCerts) {
                        return sortedCerts;
                    }
                }
            }
        }
    }

    return null;
}
