/* eslint-disable */
import { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
import { agreedService } from '../UPT-DataModel/agreedService.oa';
import { id_nf_agreedServiceNameForm } from '../UPT-DataModel/id-nf-agreedServiceNameForm.va';
import { providedServiceId } from '../UPT-DataModel/providedServiceId.oa';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
export { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
export { agreedService } from '../UPT-DataModel/agreedService.oa';
export { id_nf_agreedServiceNameForm } from '../UPT-DataModel/id-nf-agreedServiceNameForm.va';
export { providedServiceId } from '../UPT-DataModel/providedServiceId.oa';

/* START_OF_SYMBOL_DEFINITION agreedServiceNameForm */
/**
 * @summary agreedServiceNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * agreedServiceNameForm NAME-FORM ::= {
 *   NAMES            agreedService
 *   WITH ATTRIBUTES  {providedServiceId}
 *   ID               id-nf-agreedServiceNameForm
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const agreedServiceNameForm: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': agreedService /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [providedServiceId] /* OBJECT_FIELD_SETTING */,
    '&id': id_nf_agreedServiceNameForm /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION agreedServiceNameForm */

/* eslint-enable */
