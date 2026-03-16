import type { Certificate, CertificateSerialNumber } from "@wildboar/x500/AuthenticationFramework";
import type { Name } from "@wildboar/x500/InformationFramework";
import { type SubjectKeyIdentifier, authorityKeyIdentifier } from "@wildboar/x500/CertificateExtensions";
import type { AttributeCertificate, GeneralName } from "@wildboar/pki-stub";
import { authorityInfoAccess, id_ad_caIssuers } from "@wildboar/x500/PkiPmiExternalDataTypes";
import { DERElement } from "@wildboar/asn1";

/**
 * NOTE: `issuerName`, `serialNumber`, and `keyIdentifier` can all be taken
 * from the `authorityKeyIdentifier` extension in the certificate you have.
 */
export
interface IssuerCertInfo {

    /**
     * Subject name on the sought certificate. When building a PKI path, this
     * is going to come from the `issuer` field of the certificate you have.
     */
    subjectName: Name;

    /**
     * Issuer names of the sought certificate. When building a PKI path, this
     * is going to come from the `authorityCertIssuer` field of the
     * `authorityKeyIdentifier` extension in the certificate you have.
     */
    issuerNames: GeneralName[];

    /**
     * Serial number of the sought certificate. When building a PKI path, this
     * is going to come from the `authorityCertSerialNumber` field of the
     * `authorityKeyIdentifier` extension in the certificate you have.
     */
    serialNumber: CertificateSerialNumber;

    /**
     * Key identifier of the sought certificate. When building a PKI path, this
     * is going to come from the `keyIdentifier` field of the
     * `authorityKeyIdentifier` extension in the certificate you have.
     */
    keyIdentifier: SubjectKeyIdentifier;

    /**
     * Locations of the CA issuer certificates. This will come from the
     * `authorityInfoAccess` extension in the subject's certificate.
     */
    caIssuerLocations: GeneralName[];

}

// TODO: Write a unit test for this. Just one should be fine.

/**
 * @summary Extract information about a certificate issuer from an issued certificate.
 * @description
 * 
 * If an error is thrown while decoding or reading an extension, the extension
 * is skipped.
 * 
 * @param cert The issued certificate from which to extract information about
 *  the next certificate in the path.
 * @returns The information about the next certificate in the path.
 * 
 * @function
 */
export
function getInfoForNextCertInPath(cert: Certificate): Partial<IssuerCertInfo> {
    const exts = cert.toBeSigned.extensions ?? [];
    const returnValue: Partial<IssuerCertInfo> = {
        subjectName: cert.toBeSigned.issuer,
        caIssuerLocations: [],
    };
    for (const ext of exts) {
        try {
            if (ext.extnId.isEqualTo(authorityKeyIdentifier["&id"]!)) {
                if (
                    returnValue.issuerNames
                    || returnValue.serialNumber
                    || returnValue.keyIdentifier
                ) {
                    continue; // Error case: cannot have multiple AKIs
                }
                const el = new DERElement();
                if (el.fromBytes(ext.extnValue) !== ext.extnValue.length) {
                    continue; // Error case: malformed AKI
                }
                const aki = authorityKeyIdentifier.decoderFor["&ExtnType"]!(el);
                returnValue.issuerNames = aki.authorityCertIssuer;
                returnValue.serialNumber = aki.authorityCertSerialNumber;
                returnValue.keyIdentifier = aki.keyIdentifier;
            }
            if (ext.extnId.isEqualTo(authorityInfoAccess["&id"]!)) {
                const el = new DERElement();
                if (el.fromBytes(ext.extnValue) !== ext.extnValue.length) {
                    continue; // Error case: malformed AIA
                }
                const aia = authorityInfoAccess.decoderFor["&ExtnType"]!(el);
                for (const adesc of aia) {
                    if (adesc.accessMethod.isEqualTo(id_ad_caIssuers)) {
                        returnValue.caIssuerLocations!.push(adesc.accessLocation);
                    }
                }
            }
        } catch {
            continue;
        }
    }
    if (returnValue.caIssuerLocations!.length === 0) {
        delete returnValue.caIssuerLocations;
    }
    return returnValue;
}

/**
 * @summary Extract information about a certificate issuer from an attribute certificate.
 * @description
 * 
 * If an error is thrown while decoding or reading an extension, the extension
 * is skipped. Note that  the `authorityInfoAccess` extension cannot be used to
 * extract information about the next certificate: in the case of attribute
 * certificates, locations of type CA issuer are supposed to point to the AA's
 * attribute certificates, rather than public key certificates.
 * 
 * @param acert The attribute certificate from which to extract information about
 *  the next certificate in the path.
 * @returns The information about the next certificate in the path.
 * 
 * @function
 */
export
function getInfoForNextCertInPath2(acert: AttributeCertificate): Partial<IssuerCertInfo> {
    const exts = acert.toBeSigned.extensions ?? [];
    const returnValue: Partial<IssuerCertInfo> = {};
    const issuer = acert.toBeSigned.issuer;
    if (issuer.baseCertificateID) {
        returnValue.issuerNames = issuer.baseCertificateID.issuer;
        returnValue.serialNumber = issuer.baseCertificateID.serial;
    }
    const issuerDirectoryNames = issuer.issuerName
        ?.map((gn) => ("directoryName" in gn) && gn.directoryName)
        .filter((n): n is Name => !!n);
    if (issuerDirectoryNames?.length === 1) {
        returnValue.subjectName = issuerDirectoryNames[0];
    }
    for (const ext of exts) {
        try {
            if (ext.extnId.isEqualTo(authorityKeyIdentifier["&id"]!)) {
                if (
                    returnValue.issuerNames
                    || returnValue.serialNumber
                    || returnValue.keyIdentifier
                ) {
                    continue; // Error case: cannot have multiple AKIs
                }
                const el = new DERElement();
                if (el.fromBytes(ext.extnValue) !== ext.extnValue.length) {
                    continue; // Error case: malformed AKI
                }
                const aki = authorityKeyIdentifier.decoderFor["&ExtnType"]!(el);
                returnValue.issuerNames ??= aki.authorityCertIssuer;
                returnValue.serialNumber ??= aki.authorityCertSerialNumber;
                returnValue.keyIdentifier = aki.keyIdentifier;
            }
        } catch {
            continue;
        }
    }
    return returnValue;
}
