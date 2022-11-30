/* eslint-disable */
import { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
import { name } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/name.oa';
import { calledUptUser } from '../UPT-DataModel/calledUptUser.oa';
import { id_nf_calledUptUserNameForm } from '../UPT-DataModel/id-nf-calledUptUserNameForm.va';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
export { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
export { name } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/name.oa';
export { calledUptUser } from '../UPT-DataModel/calledUptUser.oa';
export { id_nf_calledUptUserNameForm } from '../UPT-DataModel/id-nf-calledUptUserNameForm.va';

/* START_OF_SYMBOL_DEFINITION calledUptUserNameForm */
/**
 * @summary calledUptUserNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * calledUptUserNameForm NAME-FORM ::= {
 *   NAMES            calledUptUser
 *   WITH ATTRIBUTES  {name}
 *   ID               id-nf-calledUptUserNameForm
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const calledUptUserNameForm: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': calledUptUser /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [name] /* OBJECT_FIELD_SETTING */,
    '&id': id_nf_calledUptUserNameForm /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION calledUptUserNameForm */

/* eslint-enable */
