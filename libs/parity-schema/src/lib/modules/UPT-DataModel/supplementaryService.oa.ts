/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { description } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa';
import { name } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/name.oa';
import { id_ao_supplementaryService } from '../UPT-DataModel/id-ao-supplementaryService.va';
import { supplServiceStatus } from '../UPT-DataModel/supplServiceStatus.oa';
import { supplServId } from '../UPT-DataModel/supplServId.oa';
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
export { id_ao_supplementaryService } from '../UPT-DataModel/id-ao-supplementaryService.va';
export { supplServiceStatus } from '../UPT-DataModel/supplServiceStatus.oa';
export { supplServId } from '../UPT-DataModel/supplServId.oa';

/* START_OF_SYMBOL_DEFINITION supplementaryService */
/**
 * @summary supplementaryService
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * supplementaryService OBJECT-CLASS ::= {
 *   KIND          abstract
 *   MUST CONTAIN  {supplServId | supplServiceStatus}
 *   MAY CONTAIN   {name | description}
 *   ID            id-ao-supplementaryService
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const supplementaryService: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&kind': abstract /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        supplServId,
        supplServiceStatus,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [name, description] /* OBJECT_FIELD_SETTING */,
    '&id': id_ao_supplementaryService /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION supplementaryService */

/* eslint-enable */
