/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { id_oc_dynamicObject } from '../RFC2589DynamicDirectory/id-oc-dynamicObject.va';
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
export { id_oc_dynamicObject } from '../RFC2589DynamicDirectory/id-oc-dynamicObject.va';

/* START_OF_SYMBOL_DEFINITION dynamicObject */
/**
 * @summary dynamicObject
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * dynamicObject OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            auxiliary
 *     LDAP-NAME        {"dynamicObject"}
 *     LDAP-DESC       "This class, if present in an entry, indicates that this entry has a limited lifetime and may disappear automatically when its time-to-live has reached 0.  There are no mandatory attributes of this class, however if the client has not supplied a value for the entryTtl attribute, the server will provide one."
 *     ID                id-oc-dynamicObject
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const dynamicObject: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['dynamicObject'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'This class, if present in an entry, indicates that this entry has a limited lifetime and may disappear automatically when its time-to-live has reached 0.  There are no mandatory attributes of this class, however if the client has not supplied a value for the entryTtl attribute, the server will provide one.' /* OBJECT_FIELD_SETTING */,
    '&id': id_oc_dynamicObject /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION dynamicObject */

/* eslint-enable */
