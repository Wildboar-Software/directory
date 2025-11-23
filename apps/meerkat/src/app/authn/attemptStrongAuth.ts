import {
    Context,
    DirectoryBindError,
    DSABindError,
    BindReturn,
    MistypedArgumentError,
} from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../ctx.js";
import {
    NameAndOptionalUID,
} from "@wildboar/x500/SelectedAttributeTypes";
import dnToVertex from "../dit/dnToVertex";
import {
    AuthenticationLevel_basicLevels,
} from "@wildboar/x500/BasicAccessControl";
import {
    AuthenticationLevel_basicLevels_level_strong,
} from "@wildboar/x500/BasicAccessControl";
import {
    SecurityProblem_invalidCredentials,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    DirectoryBindError_OPTIONALLY_PROTECTED_Parameter1 as DirectoryBindErrorData,
} from "@wildboar/x500/DirectoryAbstractService";
import versions from "../versions";
import {
    id_oc_pkiCertPath,
} from "@wildboar/x500/AuthenticationFramework";
import {
    pkiPath,
} from "@wildboar/x500/AuthenticationFramework";
import readValuesOfType from "../utils/readValuesOfType";
import {
    CertificatePair,
    CertificationPath,
} from "@wildboar/x500/AuthenticationFramework";
import { compareAlgorithmIdentifier } from "@wildboar/x500";
import { compareDistinguishedName } from "@wildboar/x500";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";
import { getDateFromTime } from "@wildboar/x500";
import {
    verifyToken,
    VT_RETURN_CODE_OK,
    VT_RETURN_CODE_MALFORMED,
    VT_RETURN_CODE_INVALID_SIG,
    VT_RETURN_CODE_UNTRUSTED, // FIXME: Why is this not used?
} from "../pki/verifyToken";
import { strict as assert } from "assert";
import {
    StrongCredentials,
    Token,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    AttributeCertificationPath,
} from "@wildboar/x500/AttributeCertificateDefinitions";
import type { Socket } from "node:net";
import type { TLSSocket } from "node:tls";
import { read_unique_id, read_clearance } from "../database/utils";
import { clearance } from "@wildboar/x500/EnhancedSecurity";
import {
    verifyAttrCert,
    VAC_OK,
    VAC_NOT_BEFORE,
    VAC_NOT_AFTER,
    VAC_MISSING_BASE_CERT,
    VAC_HOLDER_MISMATCH,
    VAC_UNSUPPORTED_HOLDER_DIGEST,
    VAC_UNSUPPORTED_HOLDER_DIGESTED_OBJECT,
    VAC_NO_ASSERTION,
    VAC_NO_SOA_CERT,
    VAC_UNTRUSTED_SOA,
    VAC_INTERNAL_ERROR,
    VAC_UNUSABLE_AC_PATH,
    VAC_INVALID_DELEGATION,
    VAC_UNSUPPORTED_SIG_ALG,
    VAC_INVALID_SIGNATURE,
    VAC_SINGLE_USE,
    VAC_ACERT_REVOKED,
    VAC_INVALID_TARGET,
    VAC_INVALID_TIME_SPEC,
    VAC_AMBIGUOUS_GROUP,
    VAC_NOT_GROUP_MEMBER,
    VAC_DUPLICATE_EXT,
    VAC_UNKNOWN_CRIT_EXT,
    VAC_INVALID_EXT_CRIT,
    VAC_CRL_REVOKED,
    VAC_OCSP_OTHER,
    VAC_OCSP_REVOKED,
} from "../pki/verifyAttrCertPath";
import { Clearance } from "@wildboar/x500/EnhancedSecurity";
import { subjectDirectoryAttributes } from "@wildboar/x500/CertificateExtensions";
import { DERElement, unpackBits } from "@wildboar/asn1";
import { TokenContent, _encode_TokenContent } from "@wildboar/x500/DirectoryAbstractService";
import { getAlgorithmInfoFromKey } from "../pki/getAlgorithmInfoFromKey";
import { addSeconds } from "date-fns";
import { randomBytes } from "crypto";
import { DER } from "@wildboar/asn1/functional";
import { SIGNED } from "@wildboar/pki-stub";
import { sign, createSign } from "node:crypto";
import { DistinguishedName } from "@wildboar/x500/InformationFramework";

const ID_OC_PKI_CERT_PATH: string = id_oc_pkiCertPath.toString();

async function clearancesFromAttrCertPath (
    ctx: MeerkatContext,
    path: AttributeCertificationPath,
    certification_path: CertificationPath,
    source: string,
    socket: Socket | TLSSocket,
): Promise<Clearance[]> {
    if (!ctx.config.rbac.getClearancesFromAttributeCertificates) {
        return [];
    }
    const logInfo = {
        host: source,
        remoteFamily: socket.remoteFamily,
        remoteAddress: socket.remoteAddress,
        remotePort: socket.remotePort,
    };
    if (path.acPath?.length) {
        ctx.log.debug(ctx.i18n.t("log:attr_cert_path_unsupported", logInfo), logInfo);
        return [];
    }
    const acert = path.attributeCertificate;
    const has_attributes_of_interest: boolean = acert
        .toBeSigned
        .attributes
        .some((attr) => attr.type_.isEqualTo(clearance["&id"]));
    if (!has_attributes_of_interest) {
        ctx.log.debug(ctx.i18n.t("log:attr_cert_path_not_verified", logInfo), logInfo);
        return [];
    }

    const pkiPath = [
        ...certification_path.theCACertificates
            ?.flatMap((arc) => arc.issuedToThisCA ?? []) ?? [],
        certification_path.userCertificate,
    ];
    const attr_cert_verif_code = await verifyAttrCert(
        ctx,
        acert,
        pkiPath,
        ctx.config.rbac.clearanceAuthorities,
    );
    if (attr_cert_verif_code === VAC_OK) {
        return acert.toBeSigned.attributes
            .filter((attr) => attr.type_.isEqualTo(clearance["&id"]))
            .flatMap((attr) => attr.values)
            .map((value) => clearance.decoderFor["&Type"]!(value));
    }
    const logMessageContext = ({
        [VAC_NOT_BEFORE]: "not_before",
        [VAC_NOT_AFTER]: "not_after",
        [VAC_MISSING_BASE_CERT]: "missing_base_cert",
        [VAC_HOLDER_MISMATCH]: "holder_mismatch",
        [VAC_UNSUPPORTED_HOLDER_DIGEST]: "unsupported_holder_digest",
        [VAC_UNSUPPORTED_HOLDER_DIGESTED_OBJECT]: "unsupported_holder_digested_object",
        [VAC_NO_ASSERTION]: "no_assertion",
        [VAC_NO_SOA_CERT]: "no_soa_cert",
        [VAC_UNTRUSTED_SOA]: "untrusted_soa",
        [VAC_INTERNAL_ERROR]: "internal_error",
        [VAC_UNUSABLE_AC_PATH]: "unusable_ac_path",
        [VAC_INVALID_DELEGATION]: "invalid_delegation",
        [VAC_UNSUPPORTED_SIG_ALG]: "unsupported_sig_alg",
        [VAC_INVALID_SIGNATURE]: "invalid_signature",
        [VAC_SINGLE_USE]: "single_use",
        [VAC_ACERT_REVOKED]: "acert_revoked",
        [VAC_INVALID_TARGET]: "invalid_target",
        [VAC_INVALID_TIME_SPEC]: "invalid_time_spec",
        [VAC_AMBIGUOUS_GROUP]: "ambiguous_group",
        [VAC_NOT_GROUP_MEMBER]: "not_group_member",
        [VAC_DUPLICATE_EXT]: "duplicate_ext",
        [VAC_UNKNOWN_CRIT_EXT]: "unknown_crit_ext",
        [VAC_INVALID_EXT_CRIT]: "invalid_ext_crit",
        [VAC_CRL_REVOKED]: "crl_revoked",
        [VAC_OCSP_OTHER]: "ocsp_other",
        [VAC_OCSP_REVOKED]: "ocsp_revoked",
    })[attr_cert_verif_code];
    ctx.log.debug(ctx.i18n.t("log:verify_attr_cert", {
        ...logInfo,
        context: logMessageContext,
    }), logInfo);
    return [];
}

function createReverseAuth (ctx: Context, requester: DistinguishedName): StrongCredentials | null {
    const pkiPath = ctx.config.signing.certPath;
    const key = ctx.config.signing.key;
    if (!pkiPath?.length) {
        return null;
    }
    if (!key) {
        return null;
    }
    const alg_info = getAlgorithmInfoFromKey(key);
    if (!alg_info) {
        return null;
    }
    const [ sig_alg_id, hash_str ] = alg_info;
    const token_content = new TokenContent(
        sig_alg_id,
        requester,
        {
            generalizedTime: addSeconds(new Date(), 60),
        },
        unpackBits(randomBytes(4)),
    );
    const tbs_bytes = _encode_TokenContent(token_content, DER).toBytes();
    let token: Token | undefined;
    if (hash_str) {
        const signer = createSign(hash_str);
        signer.update(tbs_bytes);
        const signature = signer.sign(key);
        token = new SIGNED(
            token_content,
            sig_alg_id,
            unpackBits(signature),
            undefined,
            undefined,
        );
    } else {
        const signature = sign(null, tbs_bytes, key);
        token = new SIGNED(
            token_content,
            sig_alg_id,
            unpackBits(signature),
            undefined,
            undefined,
        );
    }
    if (!token) {
        return null;
    }
    const eeCert = pkiPath[pkiPath.length - 1];
    const certPath = new CertificationPath(
        eeCert,
        [ ...pkiPath ]
            .slice(0, -1)
            .reverse()
            .map((cert) => new CertificatePair(
                cert,
                undefined,
            )),
    );
    return new StrongCredentials(
        certPath,
        token,
        certPath.userCertificate.toBeSigned.subject.rdnSequence,
        ctx.config.authn.attributeCertificationPath,
    );
}

/**
 * @summary Attempts strong authentication
 * @description
 *
 * This function attempts strong authentication, as defined in
 * [ITU Recommendation X.511 (2019)](https://www.itu.int/rec/T-REC-X.511/en),
 * Section 9.1.2.
 *
 * @param ctx The context object
 * @param BindErrorClass The class constructor for the error of the given bind operation
 * @param credentials The strong credentials asserted
 * @param signErrors Whether to cryptographically sign errors
 * @param localQualifierPoints The local qualifier points associated with the authenticating association
 * @param source A string identifying the source of the request
 * @param socket The underlying socket from whence the request originated
 * @returns Information regarding the bind result
 *
 * @async
 * @function
 */
export
async function attemptStrongAuth (
    ctx: MeerkatContext,
    BindErrorClass: (typeof DirectoryBindError) | (typeof DSABindError),
    credentials: StrongCredentials,
    signErrors: boolean,
    localQualifierPoints: number,
    source: string,
    socket: Socket | TLSSocket,
    no_reply: boolean = false,
): Promise<BindReturn> {
    // NOTE: This was copied from `apps/meerkat/src/app/dap/bind.ts`
    const {
        name,
        bind_token,
        certification_path,
        attributeCertificationPath,
    } = credentials;
    const logInfo = {
        host: source,
        remoteFamily: socket.remoteFamily,
        remoteAddress: socket.remoteAddress,
        remotePort: socket.remotePort,
    };

    const invalidCredentialsData = new DirectoryBindErrorData(
        versions,
        {
            securityError: SecurityProblem_invalidCredentials,
        },
        // No security parameters will be provided for failed auth attempts.
    );
    if (!name && !certification_path) {
        throw new BindErrorClass(
            ctx.i18n.t("err:strong_creds_must_have_name_or_cp", { host: source }),
            invalidCredentialsData,
            signErrors,
        );
    }

    const expiryTime: Date = getDateFromTime(bind_token.toBeSigned.time);
    const now = new Date();
    if (expiryTime <= now) {
        throw new BindErrorClass(
            ctx.i18n.t("err:strong_creds_expired", { time: expiryTime.toISOString() }),
            invalidCredentialsData,
            signErrors,
        );
    }

    if (!compareAlgorithmIdentifier(bind_token.algorithmIdentifier, bind_token.toBeSigned.algorithm)) {
        if (bind_token.algorithmIdentifier.algorithm.isEqualTo(bind_token.toBeSigned.algorithm.algorithm)) {
            throw new BindErrorClass(
                ctx.i18n.t("err:strong_creds_algorithm_parameters_mismatch", {
                    host: source,
                    oid: bind_token.algorithmIdentifier.algorithm.toString(),
                }),
                invalidCredentialsData,
                signErrors,
            );
        } else {
            throw new BindErrorClass(
                ctx.i18n.t("err:strong_creds_algorithm_mismatch", {
                    host: source,
                    a: bind_token.algorithmIdentifier.algorithm.toString(),
                    b: bind_token.toBeSigned.algorithm.algorithm.toString(),
                }),
                invalidCredentialsData,
                signErrors,
            );
        }
    }

    const namingMatcherGetter = getNamingMatcherGetter(ctx);
    if (!compareDistinguishedName(
        bind_token.toBeSigned.name,
        ctx.dsa.accessPoint.ae_title.rdnSequence,
        namingMatcherGetter,
    )) {
        throw new BindErrorClass(
            ctx.i18n.t("err:strong_creds_token_wrong_name", { host: source }),
            invalidCredentialsData,
            signErrors,
        );
    }

    // attributeCertificationPath was deprecated in ITU Recommendation X.511 (2008), Cor 3.
    // but it seems like later versions were never updated.
    // I cannot find any elaboration on what bind_token.response means or how it is determined or checked.

    if (certification_path) {
        if (name) {
            if (!compareDistinguishedName(
                name,
                certification_path.userCertificate.toBeSigned.subject.rdnSequence,
                namingMatcherGetter,
            )) {
                throw new BindErrorClass(
                    ctx.i18n.t("err:strong_creds_name_cert_mismatch", { host: source }),
                    invalidCredentialsData,
                    signErrors,
                );
            }
        }

        const effectiveName = name ?? certification_path.userCertificate.toBeSigned.subject.rdnSequence;
        const tokenResult = await verifyToken(ctx, certification_path, bind_token);
        const logMessageContext = ({
            [VT_RETURN_CODE_MALFORMED]: "malformed",
            [VT_RETURN_CODE_INVALID_SIG]: "invalid_sig",
            // [VT_RETURN_CODE_UNTRUSTED]: "untrusted",
        })[tokenResult];
        if (logMessageContext) {
            ctx.log.debug(ctx.i18n.t("log:strong_cred_error", {
                ...logInfo,
                context: logMessageContext,
            }), logInfo);
        } else if (tokenResult < 0) {
            ctx.log.debug(ctx.i18n.t("log:strong_cred_error", {
                ...logInfo,
                context: tokenResult.toString(),
            }), logInfo);
        }
        switch (tokenResult) {
            case (VT_RETURN_CODE_OK): {
                const foundEntry = await dnToVertex(ctx, ctx.dit.root, effectiveName);
                const unique_id = foundEntry && await read_unique_id(ctx, foundEntry);
                const clearances = foundEntry
                    ? await read_clearance(ctx, foundEntry)
                    : [];
                if (ctx.config.rbac.getClearancesFromPublicKeyCert) {
                    const sdaExt = certification_path
                        .userCertificate
                        .toBeSigned
                        .extensions
                        ?.find((ext) => ext.extnId.isEqualTo(subjectDirectoryAttributes["&id"]!));
                    if (sdaExt) {
                        const sdaEl = new DERElement();
                        sdaEl.fromBytes(sdaExt.extnValue);
                        const sda = subjectDirectoryAttributes.decoderFor["&ExtnType"]!(sdaEl);
                        const sdaClearances = sda
                            .filter((attr) => attr.type_.isEqualTo(clearance["&id"]))
                            .flatMap((attr) => attr.values)
                            .map((value) => clearance.decoderFor["&Type"]!(value));
                        clearances.push(...sdaClearances);
                    }
                }
                if (attributeCertificationPath) {
                    const attrCertClearances = await clearancesFromAttrCertPath(
                        ctx,
                        attributeCertificationPath,
                        certification_path,
                        source,
                        socket,
                    );
                    clearances.push(...attrCertClearances);
                }
                const reverseCreds = !no_reply && createReverseAuth(ctx, name ?? effectiveName);
                return {
                    boundVertex: foundEntry,
                    boundNameAndUID: new NameAndOptionalUID(
                        effectiveName,
                        unique_id, // We just use the first unique identifier.
                    ),
                    authLevel: {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_strong,
                            localQualifierPoints,
                            undefined,
                        ),
                    },
                    clearances,
                    reverseCredentials: reverseCreds
                        ? { strong: reverseCreds }
                        : undefined,
                };
            }
            case (VT_RETURN_CODE_MALFORMED): {
                throw new MistypedArgumentError(
                    ctx.i18n.t("err:cert_path_issuedToThisCA", {
                        context: "token",
                    }),
                );
            }
            /**
             * We don't want to indicate what trust anchors are trusted, so
             * we just return a vague "invalid credentials"
             */
            default: {
                ctx.log.warn(ctx.i18n.t("log:invalid_credentials", {
                    context: "strong",
                    ...logInfo,
                    vtr: tokenResult,
                }), logInfo);
                throw new BindErrorClass(
                    ctx.i18n.t("err:invalid_credentials"),
                    invalidCredentialsData,
                    signErrors,
                );
            }
        }
    } else if (ctx.config.authn.lookupPkiPathForUncertifiedStrongAuth) {
        /**
         * Note: "name === certPath.userCert.name" is not checked in this
         * code path, because the association of the pkiPath with the entry
         * itself is considered to be authoritative enough, even if the
         * subject of the end-entity certificate contradicts the entry's
         * real distinguished name.
         */
        assert(name);
        const attemptedVertex = await dnToVertex(ctx, ctx.dit.root, name);
        if (!attemptedVertex || !attemptedVertex.dse.objectClass.has(ID_OC_PKI_CERT_PATH)) {
            ctx.log.warn(ctx.i18n.t("log:invalid_credentials", logInfo), logInfo);
            throw new BindErrorClass(
                ctx.i18n.t("err:invalid_credentials"),
                invalidCredentialsData,
                signErrors,
            );
        }
        const values = await readValuesOfType(ctx, attemptedVertex, pkiPath["&id"]);
        for (const value of values) {
            const path = pkiPath.decoderFor["&Type"]!(value.value);
            const eeCert = path[path.length - 1];
            if (!eeCert) {
                continue;
            }
            const certPath: CertificationPath = new CertificationPath(
                eeCert,
                [ ...path ]
                    .slice(0, -1)
                    .reverse()
                    .map((cert) => new CertificatePair(
                        cert,
                        undefined,
                    )),
            );
            const tokenResult = await verifyToken(ctx, certPath, bind_token);
            if (tokenResult === VT_RETURN_CODE_OK) {
                const unique_id = attemptedVertex && await read_unique_id(ctx, attemptedVertex);
                const clearances = attemptedVertex
                    ? await read_clearance(ctx, attemptedVertex)
                    : [];
                if (ctx.config.rbac.getClearancesFromPublicKeyCert) {
                    const sdaExt = certPath
                        .userCertificate
                        .toBeSigned
                        .extensions
                        ?.find((ext) => ext.extnId.isEqualTo(subjectDirectoryAttributes["&id"]!));
                    if (sdaExt) {
                        const sdaEl = new DERElement();
                        sdaEl.fromBytes(sdaExt.extnValue);
                        const sda = subjectDirectoryAttributes.decoderFor["&ExtnType"]!(sdaEl);
                        const sdaClearances = sda
                            .filter((attr) => attr.type_.isEqualTo(clearance["&id"]))
                            .flatMap((attr) => attr.values)
                            .map((value) => clearance.decoderFor["&Type"]!(value));
                        clearances.push(...sdaClearances);
                    }
                }

                if (attributeCertificationPath) {
                    const attrCertClearances = await clearancesFromAttrCertPath(
                        ctx,
                        attributeCertificationPath,
                        certPath,
                        source,
                        socket,
                    );
                    clearances.push(...attrCertClearances);
                }
                const reverseCreds = !no_reply && createReverseAuth(ctx, name);
                return {
                    boundVertex: attemptedVertex,
                    boundNameAndUID: new NameAndOptionalUID(
                        name,
                        unique_id, // We just use the first unique identifier.
                    ),
                    authLevel: {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_strong,
                            localQualifierPoints,
                            undefined,
                        ),
                    },
                    clearances,
                    reverseCredentials: reverseCreds
                        ? { strong: reverseCreds }
                        : undefined,
                };
            }
        }
        ctx.log.warn(ctx.i18n.t("log:invalid_credentials", logInfo), logInfo);
        throw new BindErrorClass(
            ctx.i18n.t("err:invalid_credentials"),
            invalidCredentialsData,
            signErrors,
        );
    }
    throw new BindErrorClass(
        ctx.i18n.t("err:strong_creds_must_have_cp", { host: source }),
        invalidCredentialsData,
        signErrors,
    );
}
