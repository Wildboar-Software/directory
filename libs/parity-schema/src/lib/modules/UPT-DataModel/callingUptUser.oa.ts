/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { description } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa';
import { name } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/name.oa';
import { allowedDestinations } from '../UPT-DataModel/allowedDestinations.oa';
import { id_oc_callingUptUser } from '../UPT-DataModel/id-oc-callingUptUser.va';
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
export { description } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa';
export { name } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/name.oa';
export { allowedDestinations } from '../UPT-DataModel/allowedDestinations.oa';
export { id_oc_callingUptUser } from '../UPT-DataModel/id-oc-callingUptUser.va';

/* START_OF_SYMBOL_DEFINITION callingUptUser */
/**
 * @summary callingUptUser
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * callingUptUser OBJECT-CLASS ::= {
 *   MUST CONTAIN  {name | allowedDestinations
 *                   -- callRecords??--}
 *   MAY CONTAIN   {description}
 *   ID            id-oc-callingUptUser
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const callingUptUser: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&MandatoryAttributes': [
        name,
        allowedDestinations,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [description] /* OBJECT_FIELD_SETTING */,
    '&id': id_oc_callingUptUser /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION callingUptUser */

/* eslint-enable */
