import {
    verifyCertPath,
    VerifyCertPathArgs,
} from "../pki/verifyCertPath.js";
import type {
    CertificationPath,
} from "@wildboar/x500/AuthenticationFramework";
import {
    anyPolicy,
} from "@wildboar/x500/CertificateExtensions";
import { MeerkatContext } from "../ctx.js";
import { OBJECT_IDENTIFIER } from "@wildboar/asn1";
import type { SigningInfo } from "../types/index.js";

/**
 * @summary Verify a certification path using common-sense defaults.
 * @description
 *
 * This is a function to cut down on boilerplate initialization of the
 * arguments, since `verifyCertPath` takes a pretty complicated argument.
 *
 * @param ctx The context object
 * @param certPath The certification path to be verified
 * @param acceptableCertificatePolicies An array of object identifiers of
 *  certificate policies that are acceptable. If none are specified, no policy
 *  requirements are imposed upon the certification path validation.
 * @param options Options related to signing and signature verification.
 * @returns A promise that resolves to a certification path validation result
 *
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
                // This is kind of the best thing I can do in this case.
                ?.filter((pair) => !!pair.issuedToThisCA)
                .map((pair) => pair.issuedToThisCA!)
                ?? [],
        ],
        initial_permitted_subtrees_set: [],
        initial_excluded_subtrees_set: [],
        initial_explicit_policy: !!acceptableCertificatePolicies?.length,
        initial_inhibit_any_policy: false,
        initial_policy_mapping_inhibit: false,
        initial_policy_set: acceptableCertificatePolicies ?? [ anyPolicy ],
        initial_required_name_forms: [],
        trustAnchors: ctx.config.signing.trustAnchorList,
    };
    return verifyCertPath(ctx, vcpArgs, options);
}
