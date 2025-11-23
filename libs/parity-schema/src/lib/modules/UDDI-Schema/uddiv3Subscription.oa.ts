/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { id_uddi } from '../UDDI-Schema/id-uddi.va';
import { uddiAuthorizedName } from '../UDDI-Schema/uddiAuthorizedName.oa';
import { uddiUUID } from '../UDDI-Schema/uddiUUID.oa';
import { uddiv3BindingKey } from '../UDDI-Schema/uddiv3BindingKey.oa';
import { uddiv3BriefResponse } from '../UDDI-Schema/uddiv3BriefResponse.oa';
import { uddiv3ExpiresAfter } from '../UDDI-Schema/uddiv3ExpiresAfter.oa';
import { uddiv3MaxEntities } from '../UDDI-Schema/uddiv3MaxEntities.oa';
import { uddiv3NodeId } from '../UDDI-Schema/uddiv3NodeId.oa';
import { uddiv3NotificationInterval } from '../UDDI-Schema/uddiv3NotificationInterval.oa';
import { uddiv3SubscriptionFilter } from '../UDDI-Schema/uddiv3SubscriptionFilter.oa';
import { uddiv3SubscriptionKey } from '../UDDI-Schema/uddiv3SubscriptionKey.oa';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
export {
    abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    ObjectClassKind,
    ObjectClassKind_abstract /* IMPORTED_LONG_ENUMERATION_ITEM */,
    ObjectClassKind_auxiliary /* IMPORTED_LONG_ENUMERATION_ITEM */,
    ObjectClassKind_structural /* IMPORTED_LONG_ENUMERATION_ITEM */,
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    _decode_ObjectClassKind,
    _encode_ObjectClassKind,
    _enum_for_ObjectClassKind,
} from '@wildboar/x500/InformationFramework';
export { top } from '@wildboar/x500/InformationFramework';
export { id_uddi } from '../UDDI-Schema/id-uddi.va';
export { uddiAuthorizedName } from '../UDDI-Schema/uddiAuthorizedName.oa';
export { uddiUUID } from '../UDDI-Schema/uddiUUID.oa';
export { uddiv3BindingKey } from '../UDDI-Schema/uddiv3BindingKey.oa';
export { uddiv3BriefResponse } from '../UDDI-Schema/uddiv3BriefResponse.oa';
export { uddiv3ExpiresAfter } from '../UDDI-Schema/uddiv3ExpiresAfter.oa';
export { uddiv3MaxEntities } from '../UDDI-Schema/uddiv3MaxEntities.oa';
export { uddiv3NodeId } from '../UDDI-Schema/uddiv3NodeId.oa';
export { uddiv3NotificationInterval } from '../UDDI-Schema/uddiv3NotificationInterval.oa';
export { uddiv3SubscriptionFilter } from '../UDDI-Schema/uddiv3SubscriptionFilter.oa';
export { uddiv3SubscriptionKey } from '../UDDI-Schema/uddiv3SubscriptionKey.oa';

/* START_OF_SYMBOL_DEFINITION uddiv3Subscription */
/**
 * @summary uddiv3Subscription
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uddiv3Subscription OBJECT-CLASS ::= {
 *     SUBCLASS OF     { top }
 *     KIND            structural
 *     MUST CONTAIN    {uddiv3SubscriptionFilter | uddiUUID}
 *     MAY CONTAIN     {
 *         uddiAuthorizedName
 *         | uddiv3SubscriptionKey
 *         | uddiv3BindingKey
 *         | uddiv3NotificationInterval
 *         | uddiv3MaxEntities
 *         | uddiv3ExpiresAfter
 *         | uddiv3BriefResponse
 *         | uddiv3NodeId
 *     }
 *     LDAP-NAME       {"uddiv3Subscription"}
 *     ID              { id-uddi 6 9 } }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const uddiv3Subscription: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        uddiv3SubscriptionFilter,
        uddiUUID,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        uddiAuthorizedName,
        uddiv3SubscriptionKey,
        uddiv3BindingKey,
        uddiv3NotificationInterval,
        uddiv3MaxEntities,
        uddiv3ExpiresAfter,
        uddiv3BriefResponse,
        uddiv3NodeId,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['uddiv3Subscription'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [6, 9],
        id_uddi
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiv3Subscription */

/* eslint-enable */
