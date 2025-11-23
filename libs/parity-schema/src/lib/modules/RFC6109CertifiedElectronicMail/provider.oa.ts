/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ldifLocationURL } from '../RFC6109CertifiedElectronicMail/ldifLocationURL.oa';
import { mailReceipt } from '../RFC6109CertifiedElectronicMail/mailReceipt.oa';
import { managedDomains } from '../RFC6109CertifiedElectronicMail/managedDomains.oa';
import { providerCertificate } from '../RFC6109CertifiedElectronicMail/providerCertificate.oa';
import { providerCertificateHash } from '../RFC6109CertifiedElectronicMail/providerCertificateHash.oa';
import { providerName } from '../RFC6109CertifiedElectronicMail/providerName.oa';
import { providerUnit } from '../RFC6109CertifiedElectronicMail/providerUnit.oa';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
export {
    abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    ObjectClassKind,
    ObjectClassKind_abstract /* IMPORTED_LONG_ENUMERATION_ITEM */,
    ObjectClassKind_auxiliary /* IMPORTED_LONG_ENUMERATION_ITEM */,
    ObjectClassKind_structural /* IMPORTED_LONG_ENUMERATION_ITEM */,
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    _decode_ObjectClassKind,
    _encode_ObjectClassKind,
    _enum_for_ObjectClassKind,
} from '@wildboar/x500/InformationFramework';
export { top } from '@wildboar/x500/InformationFramework';
export { ldifLocationURL } from '../RFC6109CertifiedElectronicMail/ldifLocationURL.oa';
export { mailReceipt } from '../RFC6109CertifiedElectronicMail/mailReceipt.oa';
export { managedDomains } from '../RFC6109CertifiedElectronicMail/managedDomains.oa';
export { providerCertificate } from '../RFC6109CertifiedElectronicMail/providerCertificate.oa';
export { providerCertificateHash } from '../RFC6109CertifiedElectronicMail/providerCertificateHash.oa';
export { providerName } from '../RFC6109CertifiedElectronicMail/providerName.oa';
export { providerUnit } from '../RFC6109CertifiedElectronicMail/providerUnit.oa';

/* START_OF_SYMBOL_DEFINITION provider */
/**
 * @summary provider
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * provider OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            structural
 *     MUST CONTAIN    {
 *         providerCertificateHash
 *         | providerCertificate
 *         | providerName
 *         | mailReceipt
 *         | managedDomains
 *     }
 *     MAY CONTAIN     {
 *         description
 *         | ldifLocationURL
 *         | providerUnit
 *     }
 *     LDAP-NAME       {"provider"}
 *     ID              { 1 3 6 1 4 1 16572 2 1 2 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const provider: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        providerCertificateHash,
        providerCertificate,
        providerName,
        mailReceipt,
        managedDomains,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        description,
        ldifLocationURL,
        providerUnit,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['provider'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 16572, 2, 1, 2,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION provider */

/* eslint-enable */
