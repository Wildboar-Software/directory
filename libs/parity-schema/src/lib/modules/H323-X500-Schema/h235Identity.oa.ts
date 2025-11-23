/* eslint-disable */
import { authorityRevocationList } from '@wildboar/x500/AuthenticationFramework';
import { cACertificate } from '@wildboar/x500/AuthenticationFramework';
import { certificateRevocationList } from '@wildboar/x500/AuthenticationFramework';
import { crossCertificatePair } from '@wildboar/x500/AuthenticationFramework';
import { userCertificate } from '@wildboar/x500/AuthenticationFramework';
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { h235_id_oc } from '../H323-X500-Schema/h235-id-oc.va';
import { h235IdentityEndpointID } from '../H323-X500-Schema/h235IdentityEndpointID.oa';
import { h235IdentityPassword } from '../H323-X500-Schema/h235IdentityPassword.oa';
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
export { h235_id_oc } from '../H323-X500-Schema/h235-id-oc.va';
export { h235IdentityEndpointID } from '../H323-X500-Schema/h235IdentityEndpointID.oa';
export { h235IdentityPassword } from '../H323-X500-Schema/h235IdentityPassword.oa';

/* START_OF_SYMBOL_DEFINITION h235Identity */
/**
 * @summary h235Identity
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * h235Identity OBJECT-CLASS ::= {
 *   SUBCLASS OF  {top}
 *   MAY CONTAIN
 *     {h235IdentityEndpointID | h235IdentityPassword | userCertificate |
 *       cACertificate | authorityRevocationList | certificateRevocationList |
 *       crossCertificatePair}
 *   ID           {h235-id-oc  1}
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const h235Identity: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        h235IdentityEndpointID,
        h235IdentityPassword,
        userCertificate,
        cACertificate,
        authorityRevocationList,
        certificateRevocationList,
        crossCertificatePair,
    ] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [1],
        h235_id_oc
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION h235Identity */

/* eslint-enable */
