/* eslint-disable */
import { NAME_FORM } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { id_uddi } from '../UDDI-Schema/id-uddi.va';
import { uddiUUID } from '../UDDI-Schema/uddiUUID.oa';
import { uddiv3EntityObituary } from '../UDDI-Schema/uddiv3EntityObituary.oa';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export { NAME_FORM } from '@wildboar/x500/InformationFramework';
export { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
export { id_uddi } from '../UDDI-Schema/id-uddi.va';
export { uddiUUID } from '../UDDI-Schema/uddiUUID.oa';
export { uddiv3EntityObituary } from '../UDDI-Schema/uddiv3EntityObituary.oa';

/* START_OF_SYMBOL_DEFINITION uddiv3EntityObituaryNameForm */
/**
 * @summary uddiv3EntityObituaryNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uddiv3EntityObituaryNameForm NAME-FORM ::= {
 *     NAMES               uddiv3EntityObituary
 *     WITH ATTRIBUTES     { uddiUUID }
 *     LDAP-NAME           {"uddiv3EntityObituaryNameForm"}
 *     ID                  { id-uddi 15 10 } }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const uddiv3EntityObituaryNameForm: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': uddiv3EntityObituary /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [uddiUUID] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['uddiv3EntityObituaryNameForm'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [15, 10],
        id_uddi
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiv3EntityObituaryNameForm */

/* eslint-enable */
