import type { AttributeCertificate } from "@wildboar/pki-stub";
import {
    role,
    type RoleSyntax,
    _decode_RoleSyntax,
} from "@wildboar/x500/AttributeCertificateDefinitions";

/**
 * @summary Returns the `role` value from the `holder` component
 * 
 * @description
 * 
 * This is used in both role specification certificates and group role
 * naming certificates (the latter of which seems to be not well-defined in
 * the specification). In both cases a single-valued RDN with attribute
 * type `role` is used to populate the `directoryName` of the
 * `entityName` field of the `holder` component of the attribute certificate.
 * 
 * Per ITU-T X.509 (2019), Section 16.4.2, regarding group role naming:
 * 
 * > In group role naming, the holder component of the group attribute
 * > certificate takes the entityName option and holds the role(s) of the group
 * > members who are being assigned the attributes in this group attribute
 * > certificate. The GeneralNames should contain a single GeneralName
 * > containing a directoryName with a single relative distinguished name
 * > (RDN), whose attribute type is the role attribute defined in clause
 * > 16.5.1.
 * 
 * @param acert The attribute certificate to extract the role from.
 * @returns A `RoleSyntax` value if the role can be extracted, or `null` otherwise.
 * @throws An error if the role cannot be decoded from the attribute value.
 * 
 * @function
 */
export
function getRoleFromSpecificationCertificate (
    acert: AttributeCertificate,
): RoleSyntax | null {
    if (acert.toBeSigned.holder.entityName?.length !== 1) {
        return null;
    }
    const entityName = acert.toBeSigned.holder.entityName[0];
    if (!("directoryName" in entityName)) {
        return null;
    }
    const rdns = entityName.directoryName.rdnSequence;
    if (rdns.length !== 1) {
        return null;
    }
    const rdn = rdns[0];
    if (rdn.length !== 1) {
        return null;
    }
    const atav = rdn[0];
    if (!atav.type_.isEqualTo(role["&id"])) {
        return null;
    }
    return _decode_RoleSyntax(atav.value);
}

export default getRoleFromSpecificationCertificate;
