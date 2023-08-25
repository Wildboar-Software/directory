import { Context } from "@wildboar/meerkat-types";
import { Certificate } from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/Certificate.ta";
import { GeneralName } from "@wildboar/x500/src/lib/modules/CertificateExtensions/GeneralName.ta";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";
import { compareGeneralName, compareName } from "@wildboar/x500";
import { DERElement } from "asn1-ts";
import { subjectAltName } from "@wildboar/x500/src/lib/modules/CertificateExtensions/subjectAltName.oa";

/**
 * @summary Determine whether a general name matches a public key certificate
 * @description
 *
 * This function returns `true` if an asserted `GeneralName` matches a public
 * key certificate. In addition to the `subject` field, this function also
 * checks the subject alternative names, if there are any.
 *
 * @param ctx The context object
 * @param cert The public key certificate
 * @param gn The general name to check against the public key certificate
 * @param alt_names Any alternative names (to avoid recalculating this between iterations)
 * @returns A `boolean` indicating whether the general name matches the certificate
 *
 * @function
 */
export
function general_name_matches_cert (
    ctx: Context,
    cert: Certificate,
    gn: GeneralName,
    alt_names?: GeneralName[],
): boolean {
    const namingMatcher = getNamingMatcherGetter(ctx);
    if (
        ("directoryName" in gn)
        && compareName(gn.directoryName, cert.toBeSigned.subject, namingMatcher)
    ) {
        return true;
    }
    let sans = alt_names;
    if (!alt_names) {
        const sanExt = cert.toBeSigned.extensions?.find((ext) => ext.extnId.isEqualTo(subjectAltName["&id"]!));
        if (sanExt) {
            const el = new DERElement();
            el.fromBytes(sanExt.extnValue);
            sans = subjectAltName.decoderFor["&ExtnType"]!(el);
        }
    }
    for (const san of sans ?? []) {
        if (compareGeneralName(san, gn, namingMatcher)) {
            return true;
        }
    }
    return false;
}

export default general_name_matches_cert;
