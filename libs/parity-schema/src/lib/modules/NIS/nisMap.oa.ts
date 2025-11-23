/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { id_nis_oc } from '../NIS/id-nis-oc.va';
import { nisMapName } from '../NIS/nisMapName.oa';
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
export { description } from '@wildboar/x500/SelectedAttributeTypes';
export { id_nis_oc } from '../NIS/id-nis-oc.va';
export { nisMapName } from '../NIS/nisMapName.oa';

/* START_OF_SYMBOL_DEFINITION nisMap */
/**
 * @summary nisMap
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * nisMap OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            structural
 *     MUST CONTAIN    {nisMapName}
 *     MAY CONTAIN        {description}
 *     LDAP-NAME        {"nisMap"}
 *     LDAP-DESC        "A generic abstraction of a NIS map"
 *     ID                { id-nis-oc 9 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const nisMap: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [nisMapName] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [description] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['nisMap'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'A generic abstraction of a NIS map' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [9],
        id_nis_oc
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION nisMap */

/* eslint-enable */
