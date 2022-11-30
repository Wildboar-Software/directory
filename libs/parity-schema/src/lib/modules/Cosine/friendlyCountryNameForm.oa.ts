/* eslint-disable */
import { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
import { countryName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/countryName.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { friendlyCountry } from '../Cosine/friendlyCountry.oa';
import { id_nf } from '../Wildboar/id-nf.va';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
export { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
export { countryName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/countryName.oa';
export { friendlyCountry } from '../Cosine/friendlyCountry.oa';
export { id_nf } from '../Wildboar/id-nf.va';

/* START_OF_SYMBOL_DEFINITION friendlyCountryNameForm */
/**
 * @summary friendlyCountryNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * friendlyCountryNameForm NAME-FORM ::= {
 *     NAMES                friendlyCountry
 *     WITH ATTRIBUTES        {countryName}
 *     LDAP-NAME            {"friendlyCountryNameForm"}
 *     ID                    { id-nf 58 }
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const friendlyCountryNameForm: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': friendlyCountry /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [countryName] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['friendlyCountryNameForm'] /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [58],
        id_nf
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION friendlyCountryNameForm */

/* eslint-enable */
