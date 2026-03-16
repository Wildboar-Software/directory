import type { MeerkatContext } from "../ctx.js";
import {
    _decode_Certificate,
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
import { type OBJECT_IDENTIFIER, TRUE_BIT } from "@wildboar/asn1";
import { getOptionallyProtectedValue } from "@wildboar/x500";
import { stringifyDN } from "../x500/stringifyDN.js";
import util from "node:util";
import type { AttributeCertificate } from "@wildboar/pki-stub";
import {
    _decode_AttributeCertificate,
    aACertificate,
    attributeCertificateAttribute,
    delegationPath,
} from "@wildboar/x500/AttributeCertificateDefinitions";
import { DER } from "@wildboar/asn1/functional";
import {
    temporalContext,
    TimeAssertion,
} from "@wildboar/x500/SelectedAttributeTypes";
import type { LookupViaX500Options } from "../types/fetch.js";

/**
 * @summary Fetch an attribute certificate using the X.500 Directory Access Protocol (DAP).
 * @description
 * 
 * This function uses the X.500 Directory Access Protocol (DAP) `read` operation
 * to query the attribute certificate for a given entry. It queries the `delegationPath`
 * and `aACertificate` attributes, also including the `attributeCertificate` attribute
 * if `forEndEntity` is `true`.
 * 
 * If multiple attribute certificates are found, `null` is returned, since we
 * cannot unambiguously determine which certificate to return, unless all of
 * them are byte-for-byte equal.
 * 
 * @param ctx The context object
 * @param holderName The directory name of the holder of the attribute certificate
 * @param forEndEntity Whether the attribute certificate is for an end entity.
 *  If present, the query also includes the `attributeCertificate` attribute.
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
 * @returns The attribute certificate, or `null` if it could not be obtained.
 * 
 * @async
 * @function
 */
export
async function lookupAttrCertViaX500 (
    ctx: MeerkatContext,
    holderName: Name, // entry to read
    forEndEntity: boolean,
    asOfTime?: Date, // TODO: Test that certs not applicable to this time are not returned.
    options: LookupViaX500Options = {},
): Promise<AttributeCertificate | null> {
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
        delegationPath["&id"],
        aACertificate["&id"],
    ];
    if (forEndEntity) {
        selectedAttributeTypes.push(attributeCertificateAttribute["&id"]);
    }

    const timeAssertion: TimeAssertion = asOfTime
        ? {
            at: asOfTime,
        }
        : {
            now: null,
        };

    // Due to poor implementation on my part, I can't really use a local search
    let dapData: ReadResultData | undefined;
    try {
        const readOutcome = await OperationDispatcher.dispatchLocalReadRequest(
            ctx,
            {
                unsigned: new ReadArgumentData(
                    holderName,
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
        ctx.log.debug(ctx.i18n.t("log:error_looking_up_attr_cert", {
            holder: stringifyDN(ctx, holderName.rdnSequence),
            e,
        }));
        return null;
    }
    const matchingCertificates: AttributeCertificate[] = [];
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
            if (attribute.type_.isEqualTo(delegationPath["&id"])) {
                if (values.length > 1) {
                    return null; // Cannot choose one.
                }
                for (const value of values) {
                    const seqof = value.sequenceOf;
                    const lastCert = seqof[seqof.length - 1];
                    const cert = _decode_AttributeCertificate(lastCert);
                    matchingCertificates.push(cert);
                }
            }
            else if (
                attribute.type_.isEqualTo(aACertificate["&id"])
                || attribute.type_.isEqualTo(attributeCertificateAttribute["&id"])
            ) {
                if (values.length > 1) {
                    return null; // Cannot choose one.
                }
                for (const value of values) {
                    const cert = _decode_AttributeCertificate(value);
                    matchingCertificates.push(cert);
                }
            }
        } catch (e) {
            ctx.log.trace(util.inspect(e));
            continue;
        }
    }
    if (matchingCertificates.length > 1) {
        // If multiple attribute certificates are found, we can still return a
        // single attribute certificate if all of them are the same. In this
        // case "same" means byte-for-byte identical.
        const allCertsEqual = matchingCertificates
            .every((cert) => (
                cert.originalDER
                && matchingCertificates[0].originalDER
                && !Buffer.compare(
                    cert.originalDER,
                    matchingCertificates[0].originalDER)
                )
            );
        return allCertsEqual
            ? matchingCertificates[0]
            : null;
    }
    if (matchingCertificates.length === 1) {
        // We only accept the outcome if a single unambiguous cert is found.
        return matchingCertificates[0];
    }
    return null;
}

export default lookupAttrCertViaX500;
