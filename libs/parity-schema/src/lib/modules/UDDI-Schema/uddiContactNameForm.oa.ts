/* eslint-disable */
import { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { id_uddi } from '../UDDI-Schema/id-uddi.va';
import { uddiContact } from '../UDDI-Schema/uddiContact.oa';
import { uddiUUID } from '../UDDI-Schema/uddiUUID.oa';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
export { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
export { id_uddi } from '../UDDI-Schema/id-uddi.va';
export { uddiContact } from '../UDDI-Schema/uddiContact.oa';
export { uddiUUID } from '../UDDI-Schema/uddiUUID.oa';

/* START_OF_SYMBOL_DEFINITION uddiContactNameForm */
/**
 * @summary uddiContactNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uddiContactNameForm NAME-FORM ::= {
 *     NAMES               uddiContact
 *     WITH ATTRIBUTES     { uddiUUID }
 *     LDAP-NAME           {"uddiContactNameForm"}
 *     ID                  { id-uddi 15 2 } }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const uddiContactNameForm: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': uddiContact /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [uddiUUID] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['uddiContactNameForm'] /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [15, 2],
        id_uddi
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiContactNameForm */

/* eslint-enable */
