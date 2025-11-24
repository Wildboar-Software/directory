/* eslint-disable */
import type { NAME_FORM } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { id_uddi } from '../UDDI-Schema/id-uddi.va';
import { uddiUUID } from '../UDDI-Schema/uddiUUID.oa';
import { uddiv3Subscription } from '../UDDI-Schema/uddiv3Subscription.oa';

/* START_OF_SYMBOL_DEFINITION uddiv3SubscriptionNameForm */
/**
 * @summary uddiv3SubscriptionNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uddiv3SubscriptionNameForm NAME-FORM ::= {
 *     NAMES               uddiv3Subscription
 *     WITH ATTRIBUTES     { uddiUUID }
 *     LDAP-NAME           {"uddiv3SubscriptionNameForm"}
 *     ID                  { id-uddi 15 9 } }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const uddiv3SubscriptionNameForm: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': uddiv3Subscription /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [uddiUUID] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['uddiv3SubscriptionNameForm'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [15, 9],
        id_uddi
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiv3SubscriptionNameForm */

/* eslint-enable */
