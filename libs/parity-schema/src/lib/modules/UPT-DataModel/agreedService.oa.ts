/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { description } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa';
import { id_oc_agreement } from '../UPT-DataModel/id-oc-agreement.va';
import { providedLocations } from '../UPT-DataModel/providedLocations.oa';
import { providedServiceId } from '../UPT-DataModel/providedServiceId.oa';
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
export { id_oc_agreement } from '../UPT-DataModel/id-oc-agreement.va';
export { providedLocations } from '../UPT-DataModel/providedLocations.oa';
export { providedServiceId } from '../UPT-DataModel/providedServiceId.oa';

/* START_OF_SYMBOL_DEFINITION agreedService */
/**
 * @summary agreedService
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * agreedService OBJECT-CLASS ::= {
 *   MUST CONTAIN  {providedServiceId}
 *   MAY CONTAIN   {providedLocations | description}
 *   ID            id-oc-agreement
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const agreedService: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&MandatoryAttributes': [providedServiceId] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        providedLocations,
        description,
    ] /* OBJECT_FIELD_SETTING */,
    '&id': id_oc_agreement /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION agreedService */

/* eslint-enable */
