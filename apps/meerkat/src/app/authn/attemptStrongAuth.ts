import {
    DirectoryBindError,
    DSABindError,
    BindReturn,
    MistypedArgumentError,
} from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../ctx";
import {
    NameAndOptionalUID,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/NameAndOptionalUID.ta";
import dnToVertex from "../dit/dnToVertex";
import {
    AuthenticationLevel_basicLevels,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels.ta";
import {
    AuthenticationLevel_basicLevels_level_strong,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels-level.ta";
import {
    SecurityProblem_invalidCredentials,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import {
    DirectoryBindError_OPTIONALLY_PROTECTED_Parameter1 as DirectoryBindErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/DirectoryBindError-OPTIONALLY-PROTECTED-Parameter1.ta";
import versions from "../dap/versions";
import {
    id_oc_pkiCertPath,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/id-oc-pkiCertPath.va";
import {
    pkiPath,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/pkiPath.oa";
import readValuesOfType from "../utils/readValuesOfType";
import {
    CertificatePair,
    CertificationPath,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/CertificationPath.ta";
import compareAlgorithmIdentifier from "@wildboar/x500/src/lib/comparators/compareAlgorithmIdentifier";
import compareDistinguishedName from "@wildboar/x500/src/lib/comparators/compareDistinguishedName";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";
import getDateFromTime from "@wildboar/x500/src/lib/utils/getDateFromTime";
import {
    verifyToken,
    VT_RETURN_CODE_OK,
    VT_RETURN_CODE_MALFORMED,
    VT_RETURN_CODE_INVALID_SIG,
    VT_RETURN_CODE_UNTRUSTED,
} from "../pki/verifyToken";
import { strict as assert } from "assert";
import type {
    StrongCredentials,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/StrongCredentials.ta";

const ID_OC_PKI_CERT_PATH: string = id_oc_pkiCertPath.toString();


export
async function attemptStrongAuth (
    ctx: MeerkatContext,
    BindErrorClass: (typeof DirectoryBindError) | (typeof DSABindError),
    credentials: StrongCredentials,
    signErrors: boolean,
    localQualifierPoints: number,
    source: string,
): Promise<BindReturn> {
    // NOTE: This was copied from `apps/meerkat/src/app/dap/bind.ts`
    const {
        name,
        bind_token,
        certification_path,
    } = credentials;

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
        throw new BindErrorClass(
            ctx.i18n.t("err:strong_creds_algorithm_mismatch", { host: source }),
            invalidCredentialsData,
            signErrors,
        );
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
            [VT_RETURN_CODE_UNTRUSTED]: "untrusted",
        })[tokenResult];
        if (logMessageContext) {
            ctx.log.debug(ctx.i18n.t("log:strong_cred_error", {
                context: logMessageContext,
            }));
        }
        switch (tokenResult) {
            case (VT_RETURN_CODE_OK): {
                const foundEntry = await dnToVertex(ctx, ctx.dit.root, effectiveName);
                return {
                    boundVertex: foundEntry,
                    boundNameAndUID: new NameAndOptionalUID(
                        effectiveName,
                        foundEntry?.dse.uniqueIdentifier?.[0], // We just use the first unique identifier.
                    ),
                    authLevel: {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_strong,
                            localQualifierPoints,
                            undefined,
                        ),
                    },
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
                throw new BindErrorClass(
                    ctx.i18n.t("err:invalid_credentials", { host: source }),
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
            throw new BindErrorClass(
                ctx.i18n.t("err:invalid_credentials", { host: source }),
                invalidCredentialsData,
                signErrors,
            );
        }
        // TODO: Check that this is not too slow where it could be used in a timing oracle.
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
                    .reverse()
                    .map((cert) => new CertificatePair(
                        cert,
                        undefined,
                    )),
            );
            const tokenResult = await verifyToken(ctx, certPath, bind_token);
            if (tokenResult === VT_RETURN_CODE_OK) {
                return {
                    boundVertex: attemptedVertex,
                    boundNameAndUID: new NameAndOptionalUID(
                        name,
                        attemptedVertex?.dse.uniqueIdentifier?.[0], // We just use the first unique identifier.
                    ),
                    authLevel: {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_strong,
                            localQualifierPoints,
                            undefined,
                        ),
                    },
                };
            }
        }
        throw new BindErrorClass(
            ctx.i18n.t("err:invalid_credentials", { host: source }),
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
