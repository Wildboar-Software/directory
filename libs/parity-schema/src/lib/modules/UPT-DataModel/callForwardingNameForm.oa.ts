/* eslint-disable */
import { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
import { callForwarding } from '../UPT-DataModel/callForwarding.oa';
import { id_nf_callForwardingNameForm } from '../UPT-DataModel/id-nf-callForwardingNameForm.va';
import { supplServId } from '../UPT-DataModel/supplServId.oa';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
export { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
export { callForwarding } from '../UPT-DataModel/callForwarding.oa';
export { id_nf_callForwardingNameForm } from '../UPT-DataModel/id-nf-callForwardingNameForm.va';
export { supplServId } from '../UPT-DataModel/supplServId.oa';

/* START_OF_SYMBOL_DEFINITION callForwardingNameForm */
/**
 * @summary callForwardingNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * callForwardingNameForm NAME-FORM ::= {
 *   NAMES            callForwarding
 *   WITH ATTRIBUTES  {supplServId}
 *   ID               id-nf-callForwardingNameForm
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const callForwardingNameForm: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': callForwarding /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [supplServId] /* OBJECT_FIELD_SETTING */,
    '&id': id_nf_callForwardingNameForm /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION callForwardingNameForm */

/* eslint-enable */
