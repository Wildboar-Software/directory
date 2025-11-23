/* eslint-disable */
import { NAME_FORM } from '@wildboar/x500/InformationFramework';
import { name } from '@wildboar/x500/SelectedAttributeTypes';
import { callingUptUser } from '../UPT-DataModel/callingUptUser.oa';
import { id_nf_callingUptUserNameForm } from '../UPT-DataModel/id-nf-callingUptUserNameForm.va';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export { NAME_FORM } from '@wildboar/x500/InformationFramework';
export { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
export { name } from '@wildboar/x500/SelectedAttributeTypes';
export { callingUptUser } from '../UPT-DataModel/callingUptUser.oa';
export { id_nf_callingUptUserNameForm } from '../UPT-DataModel/id-nf-callingUptUserNameForm.va';

/* START_OF_SYMBOL_DEFINITION callingUptUserNameForm */
/**
 * @summary callingUptUserNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * callingUptUserNameForm NAME-FORM ::= {
 *   NAMES            callingUptUser
 *   WITH ATTRIBUTES  {name}
 *   ID               id-nf-callingUptUserNameForm
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const callingUptUserNameForm: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': callingUptUser /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [name] /* OBJECT_FIELD_SETTING */,
    '&id': id_nf_callingUptUserNameForm /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION callingUptUserNameForm */

/* eslint-enable */
