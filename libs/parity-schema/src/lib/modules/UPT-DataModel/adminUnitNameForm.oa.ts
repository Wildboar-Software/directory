/* eslint-disable */
import { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
import { organizationalUnitName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationalUnitName.oa';
import { administrativeUnit } from '../UPT-DataModel/administrativeUnit.oa';
import { id_nf_adminUnitNameForm } from '../UPT-DataModel/id-nf-adminUnitNameForm.va';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
export { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
export { organizationalUnitName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationalUnitName.oa';
export { administrativeUnit } from '../UPT-DataModel/administrativeUnit.oa';
export { id_nf_adminUnitNameForm } from '../UPT-DataModel/id-nf-adminUnitNameForm.va';

/* START_OF_SYMBOL_DEFINITION adminUnitNameForm */
/**
 * @summary adminUnitNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * adminUnitNameForm NAME-FORM ::= {
 *   NAMES            administrativeUnit
 *   WITH ATTRIBUTES  {organizationalUnitName}
 *   ID               id-nf-adminUnitNameForm
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const adminUnitNameForm: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': administrativeUnit /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [organizationalUnitName] /* OBJECT_FIELD_SETTING */,
    '&id': id_nf_adminUnitNameForm /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION adminUnitNameForm */

/* eslint-enable */
