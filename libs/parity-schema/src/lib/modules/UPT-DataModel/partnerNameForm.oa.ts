/* eslint-disable */
import { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
import { id_nf_partnerNameForm } from '../UPT-DataModel/id-nf-partnerNameForm.va';
import { partner } from '../UPT-DataModel/partner.oa';
import { providerId } from '../UPT-DataModel/providerId.oa';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
export { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
export { id_nf_partnerNameForm } from '../UPT-DataModel/id-nf-partnerNameForm.va';
export { partner } from '../UPT-DataModel/partner.oa';
export { providerId } from '../UPT-DataModel/providerId.oa';

/* START_OF_SYMBOL_DEFINITION partnerNameForm */
/**
 * @summary partnerNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * partnerNameForm NAME-FORM ::= {
 *   NAMES            partner
 *   WITH ATTRIBUTES  {providerId}
 *   ID               id-nf-partnerNameForm
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const partnerNameForm: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': partner /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [providerId] /* OBJECT_FIELD_SETTING */,
    '&id': id_nf_partnerNameForm /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION partnerNameForm */

/* eslint-enable */
