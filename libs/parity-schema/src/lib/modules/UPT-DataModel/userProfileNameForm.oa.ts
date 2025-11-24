/* eslint-disable */
import type { NAME_FORM } from '@wildboar/x500/InformationFramework';
import { id_nf_userProfileNameForm } from '../UPT-DataModel/id-nf-userProfileNameForm.va';
import { pui } from '../UPT-DataModel/pui.oa';
import { userProfile } from '../UPT-DataModel/userProfile.oa';

/* START_OF_SYMBOL_DEFINITION userProfileNameForm */
/**
 * @summary userProfileNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * userProfileNameForm NAME-FORM ::= {
 *   NAMES            userProfile
 *   WITH ATTRIBUTES  {pui}
 *   ID               id-nf-userProfileNameForm
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const userProfileNameForm: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': userProfile /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [pui] /* OBJECT_FIELD_SETTING */,
    '&id': id_nf_userProfileNameForm /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION userProfileNameForm */

/* eslint-enable */
