/* eslint-disable */
import { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
import { id_nf_uptProviderNameForm } from '../UPT-DataModel/id-nf-uptProviderNameForm.va';
import { providerId } from '../UPT-DataModel/providerId.oa';
import { uptProvider } from '../UPT-DataModel/uptProvider.oa';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
export { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
export { id_nf_uptProviderNameForm } from '../UPT-DataModel/id-nf-uptProviderNameForm.va';
export { providerId } from '../UPT-DataModel/providerId.oa';
export { uptProvider } from '../UPT-DataModel/uptProvider.oa';

/* START_OF_SYMBOL_DEFINITION uptProviderNameForm */
/**
 * @summary uptProviderNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uptProviderNameForm NAME-FORM ::= {
 *   NAMES            uptProvider
 *   WITH ATTRIBUTES  {providerId}
 *   ID               id-nf-uptProviderNameForm
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const uptProviderNameForm: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': uptProvider /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [providerId] /* OBJECT_FIELD_SETTING */,
    '&id': id_nf_uptProviderNameForm /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uptProviderNameForm */

/* eslint-enable */
