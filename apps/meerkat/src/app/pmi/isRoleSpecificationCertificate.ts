import type { AttributeCertificate } from "@wildboar/pki-stub";
import { groupAC, role, roleSpecCertIdentifier } from "@wildboar/x500/AttributeCertificateDefinitions";

/*
TODO: Report error in the spec

Where more than one role
value is present in roleName , a group member must be assigned all the role values (in one or more role assignment
certificates) in order to be assigned the attributes in this group attribute certificate.

roleName takes just a single role name.
*/

/**
 * @summary Checks if an attribute certificate is a role specification certificate.
 * 
 * Quoting ITU-T X.509 (2019), Section 16.5.1:
 * 
 * > An attribute of [the role] attribute type may be used to populate the
 * > attributes component of a role assignment certificate or to populate the
 * > holder component of a role specification or group attribute certificate,
 * > or both.
 * 
 * Unfortunately, the specification does not seem to clarify where in the
 * holder component the role attribute is expected to be: I assume the
 * entityName field as a directoryName?
 * 
 * In ITU-T X.509 (2019), Section 16.4.2, regarding group role naming:
 * 
 * > In group role naming, the holder component of the group attribute
 * > certificate takes the entityName option and holds the role(s) of the group
 * > members who are being assigned the attributes in this group attribute
 * > certificate. The GeneralNames should contain a single GeneralName
 * > containing a directoryName with a single relative distinguished name
 * > (RDN), whose attribute type is the role attribute defined in clause
 * > 16.5.1.
 * 
 * The definition of group role naming just sounds like a role specification
 * certificate. I cannot find any explicit distinction. Further, the term
 * "group role naming" or even "group role" appears nowhere else in the
 * specification. I kind of think this is just an artifact from when the
 * terms for these things were in flux.
 * 
 * > a role specification or group attribute certificate, or both.
 * 
 * Okay, so clearly they are different.
 * 
 * I _think_ the difference is that a role specification certificate does NOT
 * have the `groupAC` extension, therefore is not a group attribute certificate.
 * I think if it has the `groupAC` extension, the attributes of the certificate
 * do not apply to the definition of the role, but rather, are added to all
 * members of the role.
 * 
 * @param acert The attribute certificate to check.
 * @returns True if the attribute certificate is a role specification certificate, false otherwise. 
 * 
 * @function
 */
export
function isRoleSpecificationCertificate (
    acert: AttributeCertificate,
): boolean {
    if (acert.toBeSigned.holder.entityName?.length !== 1) {
        return false;
    }
    const entityName = acert.toBeSigned.holder.entityName[0];
    if (!("directoryName" in entityName)) {
        return false;
    }
    const rdns = entityName.directoryName.rdnSequence;
    if (rdns.length !== 1) {
        return false;
    }
    const rdn = rdns[0];
    if (rdn.length !== 1) {
        return false;
    }
    const atav = rdn[0];
    if (!atav.type_.isEqualTo(role["&id"])) {
        return false;
    }
    const exts = acert.toBeSigned.extensions ?? [];
    for (const ext of exts) {
        if (ext.extnId.isEqualTo(roleSpecCertIdentifier["&id"]!)) {
            return false;
        }
        if (ext.extnId.isEqualTo(groupAC["&id"]!)) {
            return false;
        }
        // TODO: Check for basically any AA extensions
    }
    return true;
}

export default isRoleSpecificationCertificate;
