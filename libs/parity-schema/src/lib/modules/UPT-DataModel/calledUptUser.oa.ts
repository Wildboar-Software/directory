/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { name } from '@wildboar/x500/SelectedAttributeTypes';
import { allowedRegistrationAddress } from '../UPT-DataModel/allowedRegistrationAddress.oa';
import { defaultChargingReference } from '../UPT-DataModel/defaultChargingReference.oa';
import { icRegistrationAddress } from '../UPT-DataModel/icRegistrationAddress.oa';
import { id_oc_calledUptUser } from '../UPT-DataModel/id-oc-calledUptUser.va';
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
export { description } from '@wildboar/x500/SelectedAttributeTypes';
export { name } from '@wildboar/x500/SelectedAttributeTypes';
export { allowedRegistrationAddress } from '../UPT-DataModel/allowedRegistrationAddress.oa';
export { defaultChargingReference } from '../UPT-DataModel/defaultChargingReference.oa';
export { icRegistrationAddress } from '../UPT-DataModel/icRegistrationAddress.oa';
export { id_oc_calledUptUser } from '../UPT-DataModel/id-oc-calledUptUser.va';

/* START_OF_SYMBOL_DEFINITION calledUptUser */
/**
 * @summary calledUptUser
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * calledUptUser OBJECT-CLASS ::= {
 *   MUST CONTAIN  {name}
 *   MAY CONTAIN
 *     {description | icRegistrationAddress | allowedRegistrationAddress |
 *       defaultChargingReference}
 *   ID            id-oc-calledUptUser
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const calledUptUser: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&MandatoryAttributes': [name] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        description,
        icRegistrationAddress,
        allowedRegistrationAddress,
        defaultChargingReference,
    ] /* OBJECT_FIELD_SETTING */,
    '&id': id_oc_calledUptUser /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION calledUptUser */

/* eslint-enable */
