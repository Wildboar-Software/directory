/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { sabayonProfileName } from '../SabayonSchema/sabayonProfileName.oa';
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
export { sabayonProfileName } from '../SabayonSchema/sabayonProfileName.oa';

/* START_OF_SYMBOL_DEFINITION sabayonProfileNameObject */
/**
 * @summary sabayonProfileNameObject
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * sabayonProfileNameObject OBJECT-CLASS ::= {
 *     SUBCLASS OF         { top }
 *     KIND                auxiliary
 *     MUST CONTAIN        { sabayonProfileName }
 *     LDAP-NAME           { "sabayonProfileNameObject" }
 *     LDAP-DESC           "contains sabayon profile name"
 *     ID                  { 1 3 6 1 4 1 2312 4 3 4 2 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const sabayonProfileNameObject: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [sabayonProfileName] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['sabayonProfileNameObject'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'contains sabayon profile name' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 2312, 4, 3, 4, 2,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION sabayonProfileNameObject */

/* eslint-enable */
