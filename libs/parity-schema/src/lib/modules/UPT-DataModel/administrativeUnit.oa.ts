/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { organizationalUnit } from '@wildboar/x500/src/lib/modules/SelectedObjectClasses/organizationalUnit.oa';
import { id_oc_administrativeUnit } from '../UPT-DataModel/id-oc-administrativeUnit.va';
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
export { organizationalUnit } from '@wildboar/x500/src/lib/modules/SelectedObjectClasses/organizationalUnit.oa';
export { id_oc_administrativeUnit } from '../UPT-DataModel/id-oc-administrativeUnit.va';

/* START_OF_SYMBOL_DEFINITION administrativeUnit */
/**
 * @summary administrativeUnit
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * administrativeUnit OBJECT-CLASS ::= {
 *   SUBCLASS OF  {organizationalUnit}
 *   ID           id-oc-administrativeUnit
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const administrativeUnit: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [organizationalUnit] /* OBJECT_FIELD_SETTING */,
    '&id': id_oc_administrativeUnit /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION administrativeUnit */

/* eslint-enable */
