/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { corbaIor } from '../CORBA/corbaIor.oa';
import { corbaObject } from '../CORBA/corbaObject.oa';
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
export { corbaIor } from '../CORBA/corbaIor.oa';
export { corbaObject } from '../CORBA/corbaObject.oa';

/* START_OF_SYMBOL_DEFINITION corbaObjectReference */
/**
 * @summary corbaObjectReference
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * corbaObjectReference OBJECT-CLASS ::= {
 *     SUBCLASS OF     {corbaObject}
 *     KIND            auxiliary
 *     MUST CONTAIN    {corbaIor}
 *     LDAP-NAME       {"corbaObjectReference"}
 *     LDAP-DESC       "CORBA interoperable object reference"
 *     ID              { 1 3 6 1 4 1 42 2 27 4 2 11 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const corbaObjectReference: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [corbaObject] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [corbaIor] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['corbaObjectReference'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'CORBA interoperable object reference' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 42, 2, 27, 4, 2, 11,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION corbaObjectReference */

/* eslint-enable */
