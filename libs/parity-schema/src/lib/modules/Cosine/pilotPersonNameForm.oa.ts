/* eslint-disable */
import { NAME_FORM } from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { pilotPerson } from '../Cosine/pilotPerson.oa';
import { id_nf } from '../Wildboar/id-nf.va';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export { NAME_FORM } from '@wildboar/x500/InformationFramework';
export { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
export { commonName } from '@wildboar/x500/SelectedAttributeTypes';
export { pilotPerson } from '../Cosine/pilotPerson.oa';
export { id_nf } from '../Wildboar/id-nf.va';

/* START_OF_SYMBOL_DEFINITION pilotPersonNameForm */
/**
 * @summary pilotPersonNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * pilotPersonNameForm NAME-FORM ::= {
 *     NAMES                pilotPerson
 *     WITH ATTRIBUTES        {commonName}
 *     LDAP-NAME            {"pilotPersonNameForm"}
 *     ID                    { id-nf 52 }
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const pilotPersonNameForm: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': pilotPerson /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [commonName] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['pilotPersonNameForm'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [52],
        id_nf
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION pilotPersonNameForm */

/* eslint-enable */
