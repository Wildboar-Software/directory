/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { description } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { javaClassName } from '../Java/javaClassName.oa';
import { javaClassNames } from '../Java/javaClassNames.oa';
import { javaCodebase } from '../Java/javaCodebase.oa';
import { javaDoc } from '../Java/javaDoc.oa';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
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
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
export { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
export { javaClassName } from '../Java/javaClassName.oa';
export { javaClassNames } from '../Java/javaClassNames.oa';
export { javaCodebase } from '../Java/javaCodebase.oa';
export { javaDoc } from '../Java/javaDoc.oa';

/* START_OF_SYMBOL_DEFINITION javaObject */
/**
 * @summary javaObject
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * javaObject OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            abstract
 *     MUST CONTAIN    {javaClassName}
 *     MAY CONTAIN     {javaClassNames | javaCodebase | javaDoc | description}
 *     LDAP-NAME       {"javaObject"}
 *     LDAP-DESC       "Java object representation"
 *     ID              { 1 3 6 1 4 1 42 2 27 4 2 4 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const javaObject: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': abstract /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [javaClassName] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        javaClassNames,
        javaCodebase,
        javaDoc,
        description,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['javaObject'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Java object representation' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID([
        1, 3, 6, 1, 4, 1, 42, 2, 27, 4, 2, 4,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION javaObject */

/* eslint-enable */
