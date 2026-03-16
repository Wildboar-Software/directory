import type { MeerkatContext } from "../ctx.js";
import {
    type Certificate,
    type PkiPath,
    pkiPath,
    _decode_Certificate,
    cACertificate,
    userCertificate,
    crossCertificatePair,
    _decode_Extension,
} from "@wildboar/x500/AuthenticationFramework";
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
    ServiceControlOptions_dontSelectFriends,
    ServiceControls,
    _decode_ReadResult,
    type ReadResultData,
    TypeAndContextAssertion,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    _decode_Name,
    ContextAssertion,
    id_oa_allAttributeTypes,
    type Name,
} from "@wildboar/x500/InformationFramework";
import type {
    CertificateSerialNumber,
} from "@wildboar/x500/AuthenticationFramework";
import {
    type ASN1Element,
    ASN1TagClass,
    DERElement,
    type OBJECT_IDENTIFIER,
    TRUE_BIT,
} from "@wildboar/asn1";
import { compareName, EqualityMatcher, getOptionallyProtectedValue } from "@wildboar/x500";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter.js";
import { stringifyDN } from "../x500/stringifyDN.js";
import util from "node:util";
import { subjectKeyIdentifier, type SubjectKeyIdentifier } from "@wildboar/x500/CertificateExtensions";
import type { GeneralName } from "@wildboar/pki-stub";
import { temporalContext, TimeAssertion } from "@wildboar/x500/SelectedAttributeTypes";
import { DER } from "@wildboar/asn1/functional";
import type { LookupViaX500Options } from "../types/fetch.js";

// TODO: Test this
/**
 * @summary Without fully decoding, check if a cert matches the issuer name and serial number.
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
 * @param keyIdentifier The subject key identifier expected in a matching certificate.
 * @param namingMatcher A function that returns an equality matcher for a given attribute type.
 * @returns A boolean indicating whether the issuer name and serial number match the certificate.
 * 
 * @function
 */
function matchUndecodedCert(
    undecodedCert: ASN1Element,
    issuerNames: GeneralName[] | undefined,
    serialNumber: CertificateSerialNumber | undefined,
    keyIdentifier: SubjectKeyIdentifier | undefined,
    namingMatcher: (attributeType: OBJECT_IDENTIFIER) => EqualityMatcher | undefined,
): boolean {
    try {
        const issuerDirectoryNames = issuerNames
            ?.map((gn) => ("directoryName" in gn) && gn.directoryName)
            .filter((n): n is Name => !!n)
            .slice(0, 100); // 100 is a reasonable limit to prevent DoS attacks by large inputs.

        const tbs = undecodedCert.sequence[0];
        const tbsComponents = tbs.sequence;
        const hasVersion = tbsComponents[0].tagNumber === 0;
        const valueSerialNumber = tbsComponents[hasVersion ? 1 : 0].octetString;
        if (serialNumber && Buffer.compare(valueSerialNumber, serialNumber)) {
            return false; // Serial numbers don't match. Ignore.
        }
        const valueIssuer = _decode_Name(tbsComponents[hasVersion ? 3 : 2]);
        if (
            issuerDirectoryNames
            && !issuerDirectoryNames.some((idn) => compareName(valueIssuer, idn, namingMatcher))
        ) {
            return false; // Issuer names don't match. Ignore.
        }
        if (!keyIdentifier) {
            return true; // Nothing more to check.
        }
        const extensionsEl = tbsComponents
            .find((c) => (c.tagClass === ASN1TagClass.context) && (c.tagNumber == 3));
        if (!extensionsEl) {
            return true; // Nothing more to check.
        }
        const extensions = extensionsEl.sequenceOf;
        for (const extension of extensions) {
            const extnType = extension.sequence[0]?.objectIdentifier;
            if (!extnType) {
                return false; // Malformed extension.
            }
            if (extnType.isEqualTo(subjectKeyIdentifier["&id"]!)) {
                const ext = _decode_Extension(extension);
                const extEl = new DERElement();
                if (extEl.fromBytes(ext.extnValue) !== ext.extnValue.length) {
                    return false; // Malformed extension.
                }
                const ski = subjectKeyIdentifier.decoderFor["&ExtnType"]!(extEl);
                if (Buffer.compare(ski, keyIdentifier)) {
                    return false; // Key identifiers don't match.
                }
            }
        }
        return true;
    } catch {
        // A cert that fails to decode is treated as not matching.
        return false;
    }
}

/**
 * @summary Fetch an PKI path using the X.500 Directory Access Protocol (DAP).
 * @description
 * 
 * This function uses the X.500 Directory Access Protocol (DAP) `read` operation
 * to obtain either a single public key certificate, or a full PKI path for a
 * given entry. It queries the `pkiPath`, `cACertificate`, and
 * `crossCertificatePair` attributes, also including the `userCertificate`
 * attribute if `forEndEntity` is `true`.
 * 
 * If an entry contains both a PKI path and a public key certificate, the full
 * PKI path will be returned.
 * 
 * @param ctx The context object
 * @param subjectName The directory entry to query, which is typically expected
 *  to be the `subject` in the obtained public key certificate.
 * @param forEndEntity Whether the public key certificate is for an end entity.
 *  If present, the query also includes the `userCertificate` attribute.
 * @param issuerNames The issuer names to match against.
 * @param serialNumber The serial number to match against.
 * @param keyIdentifier The subject key identifier expected in a matching certificate.
 * @param asOfTime Fetch the attribute certificates that were applicable as of
 *  this time. If omitted, defaults to now. Used to populate a temporalContext
 *  assertion in the `read` request.
 * @param options Options for the fetch
 * @param options.chaining Whether to tolerate chaining to remote DSAs.
 * @param options.localScope Whether to limit the scope of the search to the local DSA.
 * @param options.dontUseCopy Whether to do not accept shadow DSEs, nor copies of any kind.
 * @param options.copyShallDo Whether to accept shadow DSEs, even if they don't have all desired
 *  attributes replicated.
 * @param options.dontDereferenceAliases If `true`, do not dereference aliases.
 * @param options.timeLimitInSeconds The time limit in seconds for the operation.
 * @returns The public key certificate, the full PKI path, or `null` if
 *  neither could be obtained.
 * 
 * @async
 * @function
 */
export
async function lookupPkiPathViaX500 (
    ctx: MeerkatContext,
    subjectName: Name, // entry to read
    forEndEntity: boolean,
    issuerNames?: GeneralName[],
    serialNumber?: CertificateSerialNumber,
    keyIdentifier?: SubjectKeyIdentifier,
    asOfTime?: Date,
    options: LookupViaX500Options = {},
): Promise<Certificate | PkiPath | null> {
    const sco: ServiceControlOptions = new Uint8ClampedArray(13);
    // We don't want a temporalContext to get dropped as a DAP request is converted to LDAP.
    if (!options.chaining && !asOfTime) {
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
    // We definitely do not want friend attributes, which could be have a
    // purpose other than building the certification chain.
    sco[ServiceControlOptions_dontSelectFriends] = TRUE_BIT;

    const selectedAttributeTypes: OBJECT_IDENTIFIER[] = [
        pkiPath["&id"],
        cACertificate["&id"],
        /* This is not specified in ITU-T Rec. X.509. This is prescribed by
        IETF RFC 5280. */
        crossCertificatePair["&id"],
    ];
    if (forEndEntity) {
        selectedAttributeTypes.push(userCertificate["&id"]);
    }

    const timeAssertion: TimeAssertion = asOfTime
        ? {
            at: asOfTime,
        }
        : {
            now: null,
        };

    const namingMatcher = getNamingMatcherGetter(ctx);
    // Due to poor implementation on my part, I can't really use a local search
    let dapData: ReadResultData | undefined;
    try {
        const readOutcome = await OperationDispatcher.dispatchLocalReadRequest(
            ctx,
            {
                unsigned: new ReadArgumentData(
                    subjectName,
                    new EntryInformationSelection(
                        { select: selectedAttributeTypes },
                        undefined,
                        undefined,
                        {
                            selectedContexts: [
                                new TypeAndContextAssertion(
                                    id_oa_allAttributeTypes,
                                    {
                                        all: [
                                            new ContextAssertion(
                                                temporalContext["&id"],
                                                [
                                                    temporalContext.encoderFor["&Assertion"]!(timeAssertion, DER),
                                                ],
                                            ),
                                        ],
                                    },
                                ),
                            ]
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
        dapData = getOptionallyProtectedValue(dapResult);
    } catch (e) {
        if (process.env.MEERKAT_LOG_JSON !== "1") {
            ctx.log.debug(util.inspect(e));
        }
        ctx.log.debug(ctx.i18n.t("log:error_looking_up_pki_path", {
            subject: stringifyDN(ctx, subjectName.rdnSequence),
            serial: serialNumber?.toString(),
            e,
        }));
        return null;
    }
    const matchingCertificates: Certificate[] = [];
    for (const info of dapData?.entry.information ?? []) {
        if (!("attribute" in info)) {
            continue;
        }
        const attribute = info.attribute;
        const values = [
            ...attribute.values,
            ...attribute.valuesWithContext?.map((vwc) => vwc.value) ?? [],
        ];
        try {
            if (attribute.type_.isEqualTo(pkiPath["&id"])) {
                for (const value of values) {
                    /* Decoding the full PKI path is computationally expensive.
                    Instead, we just drill down into the certificate serial
                    number without decoding full data structures. If there's a
                    match, we then check the issuer name, then decode fully. */
                    const seqof = value.sequenceOf;
                    const lastCert = seqof[seqof.length - 1];
                    if (!matchUndecodedCert(
                        lastCert,
                        issuerNames,
                        serialNumber,
                        keyIdentifier,
                        namingMatcher,
                    )) {
                        continue;
                    }
                    return pkiPath.decoderFor["&Type"]!(value);
                }
            }
            else if (
                attribute.type_.isEqualTo(cACertificate["&id"])
                || attribute.type_.isEqualTo(userCertificate["&id"])
            ) {
                for (const value of values) {
                    /* Decoding the full certificate is computationally expensive.
                    Instead, we just drill down into the certificate serial
                    number without decoding full data structures. If there's a
                    match, we then check the issuer name, then decode fully. */
                    if (!matchUndecodedCert(
                        value,
                        issuerNames,
                        serialNumber,
                        keyIdentifier,
                        namingMatcher,
                    )) {
                        continue;
                    }
                    const cert = _decode_Certificate(value);
                    matchingCertificates.push(cert);
                }
            }
            else if (attribute.type_.isEqualTo(crossCertificatePair["&id"])) {
                for (const value of values) {
                    /* Decoding the full PKI path is computationally expensive.
                    Instead, we just drill down into the certificate serial
                    number without decoding full data structures. If there's a
                    match, we then check the issuer name, then decode fully. */
                    const maybeIssuedToThisCA = value.sequence[0];
                    if (
                        !maybeIssuedToThisCA
                        || maybeIssuedToThisCA.tagNumber !== 0
                        || maybeIssuedToThisCA.tagClass !== ASN1TagClass.context
                    ) {
                        // There is no issuedToThisCA.
                        continue;
                    }
                    const issuedToThisCACert = maybeIssuedToThisCA.inner;
                    if (!matchUndecodedCert(
                        issuedToThisCACert,
                        issuerNames,
                        serialNumber,
                        keyIdentifier,
                        namingMatcher,
                    )) {
                        continue;
                    }
                    return pkiPath.decoderFor["&Type"]!(value);
                }
            }
        } catch (e) {
            ctx.log.trace(util.inspect(e));
            continue;
        }
    }
    if (matchingCertificates.length === 1) {
        // We only accept the outcome if a single unambiguous cert is found.
        return matchingCertificates[0];
    }
    return null;
}

export default lookupPkiPathViaX500;
