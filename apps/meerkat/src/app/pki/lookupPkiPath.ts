import { type MeerkatContext } from "../ctx.js";
import { Certificate, type PkiPath, pkiPath, _decode_Certificate, cACertificate } from "@wildboar/x500/AuthenticationFramework";
import { OperationDispatcher } from "../distributed/OperationDispatcher.js";
import {
    EntryInformationSelection,
    ReadArgumentData,
    type ServiceControlOptions,
    ServiceControlOptions_localScope,
    ServiceControlOptions_chainingProhibited,
    ServiceControlOptions_noSubtypeSelection,
    ServiceControlOptions_dontUseCopy,
    ServiceControlOptions_copyShallDo,
    ServiceControlOptions_dontDereferenceAliases,
    ServiceControls,
    _decode_ReadResult,
} from "@wildboar/x500/DirectoryAbstractService";
import { _decode_Name, type Name } from "@wildboar/x500/InformationFramework";
import { type CertificateSerialNumber } from "@wildboar/x500/AuthenticationFramework";
import { type ASN1Element, OBJECT_IDENTIFIER, TRUE_BIT } from "@wildboar/asn1";
import { compareName, EqualityMatcher, getOptionallyProtectedValue } from "@wildboar/x500";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter.js";
import { stringifyDN } from "../x500/stringifyDN.js";
import util from "node:util";

/**
 * @description
 * 
 * Decoding the a certificate is computationally expensive.
 * Instead, we can just drill down into the certificate serial
 * number without decoding full data structures. If there's a
 * match, we then check the issuer name, then we decode fully
 * after that.
 * 
 * @param undecodedCert An ASN.1 element representing an undecoded certificate.
 * @param issuerName The issuer name to match against.
 * @param serialNumber The serial number to match against.
 * @param namingMatcher A function that returns an equality matcher for a given attribute type.
 * @returns A boolean indicating whether the issuer name and serial number match the certificate.
 */
function matchIssuerSerialInUndecodedCert(
    undecodedCert: ASN1Element,
    issuerName: Name,
    serialNumber: CertificateSerialNumber,
    namingMatcher: (attributeType: OBJECT_IDENTIFIER) => EqualityMatcher | undefined,
): boolean {
    const tbs = undecodedCert.sequence[0];
    const tbsComponents = tbs.sequence;
    const hasVersion = tbsComponents[0].tagNumber === 0;
    const valueSerialNumber = tbsComponents[hasVersion ? 1 : 0].octetString;
    if (Buffer.compare(valueSerialNumber, serialNumber)) {
        // Serial numbers don't match. Ignore.
        return false;
    }
    const valueIssuer = _decode_Name(tbsComponents[hasVersion ? 3 : 2]);
    if (!compareName(valueIssuer, issuerName, namingMatcher)) {
        // Issuer names don't match. Ignore.
        return false;
    }
    return true;
}

/*
You can obtain the PKI path from:
- Attribute certificate's baseCertificateID
- Certificate's issuer and serial number

- Search the DIT:
  - Select `pkiPath`, `userCertificate`, `cACertificate` from the entry corresponding to the issuer DN
  - Recurse up the certification chain
  - Chaining, localScope should be configurable.
*/

export interface LookupPkiPathOptions {
    chaining: boolean;
    localScope: boolean;
    dontUseCopy: boolean;
    copyShallDo: boolean;
    dontDereferenceAliases: boolean;
    timeLimitInSeconds: number;
}

// TODO: Take a time parameter that populates a temporalContext assertion.
// TODO: Recursion?
export
async function lookupPkiPathViaX500 (
    ctx: MeerkatContext,
    subjectName: Name,
    issuerName: Name,
    serialNumber: CertificateSerialNumber,
    options: Partial<LookupPkiPathOptions> = {},
): Promise<PkiPath | null> {
    if (
        subjectName.rdnSequence.length === 0
        || issuerName.rdnSequence.length === 0
        || serialNumber.length === 0
    ) {
        return null;
    }
    const sco: ServiceControlOptions = new Uint8ClampedArray(11);
    // TODO: If time parameter is provided, disable chaining.
    // We don't want a temporalContext to get dropped as a DAP request is converted to LDAP.
    if (!options.chaining) {
        sco[ServiceControlOptions_chainingProhibited] = TRUE_BIT; // TODO: Make configurable.
    }
    if (options.localScope) {
        sco[ServiceControlOptions_localScope] = TRUE_BIT; // TODO: Make configurable.
    }
    if (options.dontUseCopy) {
        sco[ServiceControlOptions_dontUseCopy] = TRUE_BIT;
    }
    if (options.copyShallDo) {
        sco[ServiceControlOptions_copyShallDo] = TRUE_BIT;
    }
    if (options.dontDereferenceAliases) {
        sco[ServiceControlOptions_dontDereferenceAliases] = TRUE_BIT;
    }
    // We set this because the OIDs used are hard-coded; we don't know
    // whether a subtype is a subtype of pkiPath or userCertificate.
    sco[ServiceControlOptions_noSubtypeSelection] = TRUE_BIT;
    // Due to poor implementation on my part, I can't really use a local search
    try {
        const readOutcome = await OperationDispatcher.dispatchLocalReadRequest(
            ctx,
            {
                unsigned: new ReadArgumentData(
                    subjectName,
                    new EntryInformationSelection(
                        {
                            select: [
                                pkiPath["&id"],
                                cACertificate["&id"],
                            ],
                        },
                    ),
                    undefined,
                    undefined,
                    new ServiceControls(
                        sco,
                        undefined,
                        options.timeLimitInSeconds ?? 30,
                        undefined,
                        undefined,
                        65535, // This should be enough, even for 99%+ of PQC certificate chains.
                    ),
                    undefined,
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                ),
            }
        );
        const dspData = getOptionallyProtectedValue(readOutcome.result);
        const dapResult = _decode_ReadResult(dspData.result);
        const dapData = getOptionallyProtectedValue(dapResult);
        const namingMatcher = getNamingMatcherGetter(ctx);
        for (const info of dapData.entry.information ?? []) {
            if (!("attribute" in info)) {
                continue;
            }
            const attribute = info.attribute;
            if (attribute.type_.isEqualTo(pkiPath["&id"])) {
                const values = [
                    ...attribute.values,
                    ...attribute.valuesWithContext?.map((vwc) => vwc.value) ?? [],
                ];
                for (const value of values) {
                    /* Decoding the full PKI path is computationally expensive.
                    Instead, we just drill down into the certificate serial
                    number without decoding full data structures. If there's a
                    match, we then check the issuer name, then decode fully. */
                    const seqof = value.sequenceOf;
                    const lastCert = seqof[seqof.length - 1];
                    if (!matchIssuerSerialInUndecodedCert(
                        lastCert,
                        issuerName,
                        serialNumber,
                        namingMatcher,
                    )) {
                        continue;
                    }
                    return pkiPath.decoderFor["&Type"]!(value);
                }
            }
            else if (attribute.type_.isEqualTo(cACertificate["&id"])) {
                const values = [
                    ...attribute.values,
                    ...attribute.valuesWithContext?.map((vwc) => vwc.value) ?? [],
                ];
                for (const value of values) {
                    /* Decoding the full certificate is computationally expensive.
                    Instead, we just drill down into the certificate serial
                    number without decoding full data structures. If there's a
                    match, we then check the issuer name, then decode fully. */
                    if (!matchIssuerSerialInUndecodedCert(
                        value,
                        issuerName,
                        serialNumber,
                        namingMatcher,
                    )) {
                        continue;
                    }
                    // Return a PKI path with a single CA certificate.
                    return [
                        cACertificate.decoderFor["&Type"]!(value),
                    ];
                }
                return null;
            }
        }
        return null;
    } catch (e) {
        // if (process.env.MEERKAT_LOG_JSON !== "1") {
        //     ctx.log.error(util.inspect(e));
        // }
        console.error(e);
        ctx.log.error(ctx.i18n.t("log:error_looking_up_pki_path", {
            subject: stringifyDN(ctx, subjectName.rdnSequence),
            issuer: stringifyDN(ctx, issuerName.rdnSequence),
            serial: serialNumber.toString(),
            e,
        }));
    }
    return null;
}
