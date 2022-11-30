/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { forwardedToNumber } from '../UPT-DataModel/forwardedToNumber.oa';
import { id_oc_callForwarding } from '../UPT-DataModel/id-oc-callForwarding.va';
import { noReplyConditionTimer } from '../UPT-DataModel/noReplyConditionTimer.oa';
import { supplementaryService } from '../UPT-DataModel/supplementaryService.oa';
import { typesOfNotification } from '../UPT-DataModel/typesOfNotification.oa';
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
export { forwardedToNumber } from '../UPT-DataModel/forwardedToNumber.oa';
export { id_oc_callForwarding } from '../UPT-DataModel/id-oc-callForwarding.va';
export { noReplyConditionTimer } from '../UPT-DataModel/noReplyConditionTimer.oa';
export { supplementaryService } from '../UPT-DataModel/supplementaryService.oa';
export { typesOfNotification } from '../UPT-DataModel/typesOfNotification.oa';

/* START_OF_SYMBOL_DEFINITION callForwarding */
/**
 * @summary callForwarding
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * callForwarding OBJECT-CLASS ::= {
 *   SUBCLASS OF   {supplementaryService}
 *   MUST CONTAIN  {forwardedToNumber | typesOfNotification}
 *   MAY CONTAIN   {noReplyConditionTimer}
 *   ID            id-oc-callForwarding
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const callForwarding: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [supplementaryService] /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        forwardedToNumber,
        typesOfNotification,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [noReplyConditionTimer] /* OBJECT_FIELD_SETTING */,
    '&id': id_oc_callForwarding /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION callForwarding */

/* eslint-enable */
