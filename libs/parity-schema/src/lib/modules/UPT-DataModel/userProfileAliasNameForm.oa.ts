/* eslint-disable */
import { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
import { id_nf_userProfileAliasNameForm } from '../UPT-DataModel/id-nf-userProfileAliasNameForm.va';
import { uptNumber } from '../UPT-DataModel/uptNumber.oa';
import { userProfileAlias } from '../UPT-DataModel/userProfileAlias.oa';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
export { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
export { id_nf_userProfileAliasNameForm } from '../UPT-DataModel/id-nf-userProfileAliasNameForm.va';
export { uptNumber } from '../UPT-DataModel/uptNumber.oa';
export { userProfileAlias } from '../UPT-DataModel/userProfileAlias.oa';

/* START_OF_SYMBOL_DEFINITION userProfileAliasNameForm */
/**
 * @summary userProfileAliasNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * userProfileAliasNameForm NAME-FORM ::= {
 *   NAMES            userProfileAlias
 *   WITH ATTRIBUTES  {uptNumber}
 *   ID               id-nf-userProfileAliasNameForm
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const userProfileAliasNameForm: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': userProfileAlias /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [uptNumber] /* OBJECT_FIELD_SETTING */,
    '&id': id_nf_userProfileAliasNameForm /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION userProfileAliasNameForm */

/* eslint-enable */
