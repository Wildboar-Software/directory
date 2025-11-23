/* eslint-disable */
import { userCertificate } from '@wildboar/x500/AuthenticationFramework';
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { businessCategory } from '@wildboar/x500/SelectedAttributeTypes';
import { givenName } from '@wildboar/x500/SelectedAttributeTypes';
import { initials } from '@wildboar/x500/SelectedAttributeTypes';
import { organizationName } from '@wildboar/x500/SelectedAttributeTypes';
import { uid } from '@wildboar/x500/SelectedAttributeTypes';
import { uniqueIdentifier } from '@wildboar/x500/SelectedAttributeTypes';
import { organizationalPerson } from '@wildboar/x500/SelectedObjectClasses';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { audio } from '../Cosine/audio.oa';
import { homePostalAddress } from '../Cosine/homePostalAddress.oa';
import { homeTelephoneNumber } from '../Cosine/homeTelephoneNumber.oa';
import { mail } from '../Cosine/mail.oa';
import { mobileTelephoneNumber } from '../Cosine/mobileTelephoneNumber.oa';
import { pagerTelephoneNumber } from '../Cosine/pagerTelephoneNumber.oa';
import { roomNumber } from '../Cosine/roomNumber.oa';
import { secretary } from '../Cosine/secretary.oa';
import { userSMIMECertificate } from '../H323-X500-Schema/userSMIMECertificate.oa';
import { carLicense } from '../InetOrgPerson/carLicense.oa';
import { departmentNumber } from '../InetOrgPerson/departmentNumber.oa';
import { displayName } from '../InetOrgPerson/displayName.oa';
import { employeeNumber } from '../InetOrgPerson/employeeNumber.oa';
import { employeeType } from '../InetOrgPerson/employeeType.oa';
import { netscapeDirectory } from '../InetOrgPerson/netscapeDirectory.va';
import { labeledURI } from '../OpenLDAPCoreSchema/labeledURI.oa';
import { preferredLanguage } from './preferredLanguage.oa';
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
export { businessCategory } from '@wildboar/x500/SelectedAttributeTypes';
export { givenName } from '@wildboar/x500/SelectedAttributeTypes';
export { initials } from '@wildboar/x500/SelectedAttributeTypes';
export { organizationalPerson } from '@wildboar/x500/SelectedObjectClasses';
export { audio } from '../Cosine/audio.oa';
export { homePostalAddress } from '../Cosine/homePostalAddress.oa';
export { homeTelephoneNumber } from '../Cosine/homeTelephoneNumber.oa';
export { carLicense } from '../InetOrgPerson/carLicense.oa';
export { departmentNumber } from '../InetOrgPerson/departmentNumber.oa';
export { displayName } from '../InetOrgPerson/displayName.oa';
export { employeeNumber } from '../InetOrgPerson/employeeNumber.oa';
export { employeeType } from '../InetOrgPerson/employeeType.oa';
export { netscapeDirectory } from '../InetOrgPerson/netscapeDirectory.va';

/* START_OF_SYMBOL_DEFINITION inetOrgPerson */
/**
 * @summary inetOrgPerson
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * inetOrgPerson OBJECT-CLASS ::= {
 *     SUBCLASS OF     {organizationalPerson}
 *     KIND            structural
 *     MAY CONTAIN        {
 *         audio
 *         | businessCategory
 *         | carLicense
 *         | departmentNumber
 *         | displayName
 *         | employeeNumber
 *         | employeeType
 *         | givenName
 *         | homeTelephoneNumber
 *         | homePostalAddress
 *         | initials
 *         -- | jpegPhoto
 *         | labeledURI
 *         | mail
 *         | manager
 *         | mobileTelephoneNumber
 *         | organizationName
 *         | pagerTelephoneNumber
 *         -- | photo
 *         | roomNumber
 *         | secretary
 *         | uid
 *         | userCertificate
 *         | uniqueIdentifier
 *         | preferredLanguage
 *         -- | userSMIMECertificate
 *         -- | userPKCS12
 *     }
 *     LDAP-NAME        {"inetOrgPerson"}
 *     LDAP-DESC        "RFC2798: Internet Organizational Person"
 *     ID                { netscapeDirectory 2 2 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const inetOrgPerson: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [organizationalPerson] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        audio,
        businessCategory,
        carLicense,
        departmentNumber,
        displayName,
        employeeNumber,
        employeeType,
        givenName,
        homeTelephoneNumber,
        homePostalAddress,
        initials,
        labeledURI,
        mail,
        mobileTelephoneNumber,
        organizationName,
        pagerTelephoneNumber,
        roomNumber,
        secretary,
        uid,
        userCertificate,
        uniqueIdentifier,
        preferredLanguage,
        userSMIMECertificate,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['inetOrgPerson'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'RFC2798: Internet Organizational Person' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [2, 2],
        netscapeDirectory
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION inetOrgPerson */

/* eslint-enable */
