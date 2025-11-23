/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { sip_id_oc } from '../H323-X500-Schema/sip-id-oc.va';
import { sIPIdentityAddress } from '../H323-X500-Schema/sIPIdentityAddress.oa';
import { sIPIdentityPassword } from '../H323-X500-Schema/sIPIdentityPassword.oa';
import { sIPIdentityProxyAddress } from '../H323-X500-Schema/sIPIdentityProxyAddress.oa';
import { sIPIdentityRegistrarAddress } from '../H323-X500-Schema/sIPIdentityRegistrarAddress.oa';
import { sIPIdentityServiceLevel } from '../H323-X500-Schema/sIPIdentityServiceLevel.oa';
import { sIPIdentitySIPURI } from '../H323-X500-Schema/sIPIdentitySIPURI.oa';
import { sIPIdentityUserName } from '../H323-X500-Schema/sIPIdentityUserName.oa';
import { userSMIMECertificate } from '../H323-X500-Schema/userSMIMECertificate.oa';
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
export { sip_id_oc } from '../H323-X500-Schema/sip-id-oc.va';
export { sIPIdentityAddress } from '../H323-X500-Schema/sIPIdentityAddress.oa';
export { sIPIdentityPassword } from '../H323-X500-Schema/sIPIdentityPassword.oa';
export { sIPIdentityProxyAddress } from '../H323-X500-Schema/sIPIdentityProxyAddress.oa';
export { sIPIdentityRegistrarAddress } from '../H323-X500-Schema/sIPIdentityRegistrarAddress.oa';
export { sIPIdentityServiceLevel } from '../H323-X500-Schema/sIPIdentityServiceLevel.oa';
export { sIPIdentitySIPURI } from '../H323-X500-Schema/sIPIdentitySIPURI.oa';
export { sIPIdentityUserName } from '../H323-X500-Schema/sIPIdentityUserName.oa';

/* START_OF_SYMBOL_DEFINITION sIPIdentity */
/**
 * @summary sIPIdentity
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * sIPIdentity OBJECT-CLASS ::= {
 *   SUBCLASS OF  {top}
 *   MAY CONTAIN
 *     {sIPIdentitySIPURI | sIPIdentityRegistrarAddress | sIPIdentityProxyAddress
 *       | sIPIdentityAddress | sIPIdentityPassword | sIPIdentityUserName |
 *       sIPIdentityServiceLevel | userSMIMECertificate}
 *   ID           {sip-id-oc  1}
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const sIPIdentity: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        sIPIdentitySIPURI,
        sIPIdentityRegistrarAddress,
        sIPIdentityProxyAddress,
        sIPIdentityAddress,
        sIPIdentityPassword,
        sIPIdentityUserName,
        sIPIdentityServiceLevel,
        userSMIMECertificate,
    ] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [1],
        sip_id_oc
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION sIPIdentity */

/* eslint-enable */
