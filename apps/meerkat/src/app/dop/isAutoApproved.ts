import type {
    CertificationPath,
    PkiPath,
} from "@wildboar/x500/AuthenticationFramework";
import * as types from "../types/types.js";
import { compareDistinguishedName, EqualityMatcher } from "@wildboar/x500";
import type { OBJECT_IDENTIFIER } from "@wildboar/asn1";

export default
function isAutoApproved(
    autoAcceptSetting: types.OBAutoAcceptSetting,
    your: CertificationPath | undefined,
    my: PkiPath | undefined,
    namingMatcher: (attributeType: OBJECT_IDENTIFIER) => EqualityMatcher | undefined,
): boolean {
    const yourcert = your?.userCertificate;
    // TODO: Make sure you are using issuedToThisCA for the CA certs
    // I might have been misusing the issuedByThisCA field, which is irrelevant to the certification path
    const yourissuer = your?.theCACertificates?.[0]?.issuedToThisCA;
    // In a certification path, the last element is not the trust anchor.
    // It is the intermediate CA issued by the trust anchor
    const yourrootca = your
        ?.theCACertificates
        ?.[your.theCACertificates.length - 1]
        ?.issuedToThisCA
        ?.toBeSigned.issuer;
    const mycert = my?.[my.length - 1];
    const myissuer = my?.[my.length - 2];
    const myrootca = my?.[0].toBeSigned.subject;
    return !!(
        autoAcceptSetting === types.OB_AUTO_ACCEPT_ALL
        || (
            autoAcceptSetting === types.OB_AUTO_ACCEPT_SELF
            && yourcert
            && mycert
            && yourcert.signature === mycert.signature
            && yourcert.toBeSigned.serialNumber == mycert.toBeSigned.serialNumber
        )
        || (
            autoAcceptSetting === types.OB_AUTO_ACCEPT_MYISSUER
            && yourissuer
            && myissuer
            && yourissuer.signature === myissuer.signature
            && yourissuer.toBeSigned.serialNumber == myissuer.toBeSigned.serialNumber
        )
        || (
            autoAcceptSetting === types.OB_AUTO_ACCEPT_MYROOTCA
            && yourrootca
            && myrootca
            && compareDistinguishedName(
                yourrootca.rdnSequence,
                myrootca.rdnSequence,
                namingMatcher,
            )
        )
    );
}
