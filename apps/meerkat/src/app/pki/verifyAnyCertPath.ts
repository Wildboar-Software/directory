import {
    verifyCertPath,
    VerifyCertPathArgs,
} from "../pki/verifyCertPath";
import type {
    CertificationPath,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/CertificationPath.ta";
import {
    anyPolicy,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/anyPolicy.va";
import { MeerkatContext } from "../ctx";
import { OBJECT_IDENTIFIER } from "asn1-ts";
import type { SigningInfo } from "@wildboar/meerkat-types";

/**
 * @description
 *
 * A function to cut down on boilerplate initialization of the arguments.
 *
 * @param ctx
 * @param certPath
 * @returns
 *
 * @async
 * @function
 */
export
function verifyAnyCertPath (
    ctx: MeerkatContext,
    certPath: CertificationPath,
    acceptableCertificatePolicies?: OBJECT_IDENTIFIER[],
    options?: Partial<SigningInfo>,
): ReturnType<typeof verifyCertPath> {
    /**
     * This set of parameters was suggested by ITU Recommendation X.509
     * (2019) Annex J.3.
     */
    const vcpArgs: VerifyCertPathArgs = {
        validityTime: new Date(),
        certPath: [
            certPath.userCertificate,
            ...certPath.theCACertificates
                ?.map((pair) => pair.issuedToThisCA!) // FIXME: What to do about this non-null assertion?
                ?? [],
        ],
        initial_permitted_subtrees_set: [],
        initial_excluded_subtrees_set: [],
        initial_explicit_policy: !!acceptableCertificatePolicies,
        initial_inhibit_any_policy: false,
        initial_policy_mapping_inhibit: false,
        initial_policy_set: acceptableCertificatePolicies ?? [ anyPolicy ],
        initial_required_name_forms: [],
        trustAnchors: ctx.config.signing.trustAnchorList,
    };
    return verifyCertPath(ctx, vcpArgs, options);
}
