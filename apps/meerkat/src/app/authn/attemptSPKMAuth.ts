import { MeerkatContext } from "../ctx";
import { Context, BindReturn, MistypedArgumentError, Vertex, DirectoryBindError, DSABindError } from "@wildboar/meerkat-types";
import { REQ_TOKEN } from "@wildboar/x500/src/lib/modules/SpkmGssTokens/SPKM-REQ.ta";
import { verifyAnyCertPath } from "../pki/verifyAnyCertPath";
import { VCP_RETURN_OK, VerifyCertPathResult } from "../pki/verifyCertPath";
import { SpkmCredentials } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SpkmCredentials.ta";
import { differenceInSeconds } from "date-fns";
import { compareName, getDateFromTime } from "@wildboar/x500";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";
import { DERElement, TRUE_BIT, packBits } from "asn1-ts";
import {
    Options_delegation_state,
    Options_sequence_state,
} from "@wildboar/x500/src/lib/modules/SpkmGssTokens/Options.ta";
import {
    CertificatePair,
    CertificationPath,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/CertificationPath.ta";
import { verifySignature } from "../pki/verifyCertPath";
import {
    _encode_Req_contents,
} from "@wildboar/x500/src/lib/modules/SpkmGssTokens/Req-contents.ta";
import { DER } from "asn1-ts/dist/node/functional";
import { Name } from "@wildboar/x500/src/lib/modules/InformationFramework/Name.ta";
import dnToVertex from "../dit/dnToVertex";
import { read_clearance, read_unique_id } from "../database/utils";
import {
    AuthenticationLevel_basicLevels,
    AuthenticationLevel_basicLevels_level_strong,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels.ta";
import readValuesOfType from "../utils/readValuesOfType";
import { NameAndOptionalUID } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/NameAndOptionalUID.ta";
import { clearance, pkiPath } from "@wildboar/x500/src/lib/collections/attributes";
import { subjectDirectoryAttributes } from "@wildboar/x500/src/lib/modules/CertificateExtensions/subjectDirectoryAttributes.oa";
import getDistinguishedName from "../x500/getDistinguishedName";
import { general_name_matches_cert } from "../pki/general_name_matches_cert";
import versions from "../versions";
import {
    DirectoryBindError_OPTIONALLY_PROTECTED_Parameter1 as DirectoryBindErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/DirectoryBindError-OPTIONALLY-PROTECTED-Parameter1.ta";
import { SecurityProblem_invalidCredentials, SecurityProblem_unsupportedAuthenticationMethod } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import { Socket } from "node:net";
import { TLSSocket } from "node:tls";
import { ServiceProblem_unwillingToPerform } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";

async function success (
    ctx: Context,
    localQualifierPoints: number,
    certPath: CertificationPath,
    vertex?: Vertex
): Promise<BindReturn> {
    const unique_id = vertex && await read_unique_id(ctx, vertex);
    const clearances = vertex
        ? await read_clearance(ctx, vertex)
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
    const dn = vertex
        ? getDistinguishedName(vertex)
        : certPath.userCertificate.toBeSigned.subject.rdnSequence;
    return {
        boundVertex: vertex,
        boundNameAndUID: new NameAndOptionalUID(
            dn,
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
    };
}

const invalidCredentialsData = new DirectoryBindErrorData(
    versions,
    {
        securityError: SecurityProblem_invalidCredentials,
    },
    // No security parameters will be provided for failed auth attempts.
);

async function verify_token_sig (
    ctx: MeerkatContext,
    token: REQ_TOKEN,
    certPath: CertificationPath,
    BindErrorClass: (typeof DirectoryBindError) | (typeof DSABindError),
    signErrors: boolean,
): Promise<VerifyCertPathResult> {
    // TODO: Add originalDER to the @wildboar/x500 library.
    const bytes = _encode_Req_contents(token.req_contents, DER).toBytes();
    const sigResult: boolean | undefined = verifySignature(
        bytes,
        token.algId,
        packBits(token.req_integrity),
        certPath.userCertificate.toBeSigned.subjectPublicKeyInfo,
    );
    if (!sigResult) {
        throw new BindErrorClass(
            ctx.i18n.t("err:spkm_invalid_signature"),
            invalidCredentialsData,
            signErrors,
        );
    }
    return verifyAnyCertPath(
        ctx,
        certPath,
        ctx.config.signing.acceptableCertificatePolicies,
        ctx.config.signing,
    );
}

export
async function attemptSPKMAuth (
    ctx: MeerkatContext,
    BindErrorClass: (typeof DirectoryBindError) | (typeof DSABindError),
    creds: SpkmCredentials,
    localQualifierPoints: number,
    signErrors: boolean,
    source: string,
    // socket: Socket | TLSSocket,
): Promise<BindReturn> {
    if (!("req" in creds)) {
        throw new MistypedArgumentError(ctx.i18n.t("err:client_sent_spkm_rep"));
    }
    const req = creds.req;
    if (req.requestToken.req_contents.tok_id != 256) {
        throw new MistypedArgumentError(ctx.i18n.t("err:invalid_spkm_req_token_id"));
    }
    const presentedCert = req.certif_data?.certificationPath?.userCertif;
    const src_name = req.requestToken.req_contents.src_name;

    // const logInfo = {
    //     host: source,
    //     remoteFamily: socket.remoteFamily,
    //     remoteAddress: socket.remoteAddress,
    //     remotePort: socket.remotePort,
    // };

    if (!presentedCert && !src_name) {
        // We cannot determine the bind name if neither of these are present.
        // throw new MistypedArgumentError();
        throw new BindErrorClass(
            ctx.i18n.t("err:strong_creds_must_have_name_or_cp", { host: source }),
            invalidCredentialsData,
            signErrors,
        );
    }

    if (
        (req.requestToken.req_contents.pvno.length !== 0)
        || !(req.requestToken.req_contents.pvno[0] !== TRUE_BIT)
    ) {
        throw new BindErrorClass(
            ctx.i18n.t("err:unsupported_spkm_version"),
            new DirectoryBindErrorData(
                versions,
                {
                    securityError: SecurityProblem_unsupportedAuthenticationMethod,
                },
            ),
            signErrors,
        );
    }
    const now = new Date();
    if (
        req.requestToken.req_contents.timestamp
        && (differenceInSeconds(req.requestToken.req_contents.timestamp, now) > 30)
    ) {
        throw new BindErrorClass(
            ctx.i18n.t("err:spkm_token_replay"),
            invalidCredentialsData,
            signErrors,
        );
    }
    const namingMatcher = getNamingMatcherGetter(ctx);
    if (!compareName(req.requestToken.req_contents.targ_name, ctx.dsa.accessPoint.ae_title, namingMatcher)) {
        throw new BindErrorClass(
            ctx.i18n.t("err:spkm_token_replay"),
            invalidCredentialsData,
            signErrors,
        );
    }
    const validity = req.requestToken.req_contents.validity;
    if (
        validity
        && (
            (now < getDateFromTime(validity.notBefore))
            || (now > getDateFromTime(validity.notAfter))
        )
    ) {
        throw new BindErrorClass(
            ctx.i18n.t("err:spkm_outside_validity"),
            invalidCredentialsData,
            signErrors,
        );
    }
    if (req.requestToken.req_contents.req_data.channelId) {
        throw new BindErrorClass(
            ctx.i18n.t("err:spkm_channel_binding"),
            new DirectoryBindErrorData(
                versions,
                {
                    serviceError: ServiceProblem_unwillingToPerform,
                },
            ),
            signErrors,
        );
    }
    if (req.requestToken.req_contents.req_data.seq_number) {
        throw new BindErrorClass(
            ctx.i18n.t("err:spkm_seq_number"),
            new DirectoryBindErrorData(
                versions,
                {
                    serviceError: ServiceProblem_unwillingToPerform,
                },
            ),
            signErrors,
        );
    }
    const options = req.requestToken.req_contents.req_data.options;
    if (options[Options_delegation_state] === TRUE_BIT) {
        // There is no concept of delegating a context with X.500 directories.
        throw new BindErrorClass(
            ctx.i18n.t("err:spkm_delegation_state"),
            new DirectoryBindErrorData(
                versions,
                {
                    serviceError: ServiceProblem_unwillingToPerform,
                },
            ),
            signErrors,
        );
    }
    if (options[Options_sequence_state] === TRUE_BIT) {
        // There is no sequence numbering of messaging.
        throw new BindErrorClass(
            ctx.i18n.t("err:spkm_seq_number"),
            new DirectoryBindErrorData(
                versions,
                {
                    serviceError: ServiceProblem_unwillingToPerform,
                },
            ),
            signErrors,
        );
    }

    // TODO: Verify that the integrity algorithms can be provided by this DSA.

    // As far as I can tell:
    // - delegation-state is totally unsupported
    // - mutual-state is provided by the bind result DSA's credentials.
    // - replay-det-state is already covered by the signed result / error nonces / timestamps
    // - sequence-state is totally unsupported
    // - conf-avail is ambiguous
    // - integ-avail is supported by signed results / errors
    // - target-certif-data-required is supported

    const bindName: Name = req.requestToken.req_contents.src_name ?? presentedCert!.toBeSigned.subject!;
    const attemptedVertex = await dnToVertex(ctx, ctx.dit.root, bindName.rdnSequence);
    if (presentedCert) {
        if (src_name && !general_name_matches_cert(ctx, presentedCert, { directoryName: src_name })) {
            throw new MistypedArgumentError(ctx.i18n.t("err:spkm_src_name_mismatch"));
        }
        const certPath = new CertificationPath(
            presentedCert,
            req.certif_data.certificationPath.theCACertificates,
        );
        const verifyResult = await verify_token_sig(ctx, req.requestToken, certPath, BindErrorClass, signErrors);
        if (verifyResult.returnCode !== VCP_RETURN_OK) {
            throw new BindErrorClass(
                ctx.i18n.t("err:spkm_untrusted_cert_path"),
                invalidCredentialsData,
                signErrors,
            );
        }
        return success(ctx, localQualifierPoints, certPath, attemptedVertex);
    } else if (ctx.config.authn.lookupPkiPathForUncertifiedStrongAuth && attemptedVertex) {
        const values = await readValuesOfType(ctx, attemptedVertex, pkiPath["&id"]);
        for (const value of values) {
            const path = pkiPath.decoderFor["&Type"]!(value.value);
            const eeCert = path[path.length - 1];
            if (!eeCert) {
                continue;
            }
            if (src_name && !general_name_matches_cert(ctx, eeCert, { directoryName: src_name })) {
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
            try {
                const verifyResult = await verify_token_sig(
                    ctx,
                    req.requestToken,
                    certPath,
                    BindErrorClass,
                    signErrors,
                );
                if (verifyResult.returnCode === VCP_RETURN_OK) {
                    return success(ctx, localQualifierPoints, certPath, attemptedVertex);
                }
            } catch {
                continue;
            }
        }
    }
    throw new BindErrorClass(
        ctx.i18n.t("err:invalid_credentials"),
        invalidCredentialsData,
        signErrors,
    );
    // TODO: Set expiration time to upper bound of validity so connection dies then.
}

export default attemptSPKMAuth;
