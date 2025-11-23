/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { javaObject } from '../Java/javaObject.oa';
import { javaSerializedData } from '../Java/javaSerializedData.oa';
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
export { javaObject } from '../Java/javaObject.oa';
export { javaSerializedData } from '../Java/javaSerializedData.oa';

/* START_OF_SYMBOL_DEFINITION javaMarshalledObject */
/**
 * @summary javaMarshalledObject
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * javaMarshalledObject OBJECT-CLASS ::= {
 *     SUBCLASS OF     {javaObject}
 *     KIND            auxiliary
 *     MUST CONTAIN    {javaSerializedData}
 *     LDAP-NAME       {"javaMarshalledObject"}
 *     LDAP-DESC       "Java marshalled object"
 *     ID              { 1 3 6 1 4 1 42 2 27 4 2 8 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const javaMarshalledObject: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [javaObject] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [javaSerializedData] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['javaMarshalledObject'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Java marshalled object' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 42, 2, 27, 4, 2, 8,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION javaMarshalledObject */

/* eslint-enable */
