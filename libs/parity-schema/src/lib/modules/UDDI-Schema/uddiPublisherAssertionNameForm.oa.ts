/* eslint-disable */
import { NAME_FORM } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { id_uddi } from '../UDDI-Schema/id-uddi.va';
import { uddiPublisherAssertion } from '../UDDI-Schema/uddiPublisherAssertion.oa';
import { uddiUUID } from '../UDDI-Schema/uddiUUID.oa';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export { NAME_FORM } from '@wildboar/x500/InformationFramework';
export { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
export { id_uddi } from '../UDDI-Schema/id-uddi.va';
export { uddiPublisherAssertion } from '../UDDI-Schema/uddiPublisherAssertion.oa';
export { uddiUUID } from '../UDDI-Schema/uddiUUID.oa';

/* START_OF_SYMBOL_DEFINITION uddiPublisherAssertionNameForm */
/**
 * @summary uddiPublisherAssertionNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uddiPublisherAssertionNameForm NAME-FORM ::= {
 *     NAMES               uddiPublisherAssertion
 *     WITH ATTRIBUTES     { uddiUUID }
 *     LDAP-NAME           {"uddiPublisherAssertionNameForm"}
 *     ID                  { id-uddi 15 8 } }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const uddiPublisherAssertionNameForm: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': uddiPublisherAssertion /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [uddiUUID] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['uddiPublisherAssertionNameForm'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [15, 8],
        id_uddi
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiPublisherAssertionNameForm */

/* eslint-enable */
