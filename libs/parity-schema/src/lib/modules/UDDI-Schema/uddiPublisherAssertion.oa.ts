/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { id_uddi } from '../UDDI-Schema/id-uddi.va';
import { uddiFromKey } from '../UDDI-Schema/uddiFromKey.oa';
import { uddiKeyedReference } from '../UDDI-Schema/uddiKeyedReference.oa';
import { uddiToKey } from '../UDDI-Schema/uddiToKey.oa';
import { uddiUUID } from '../UDDI-Schema/uddiUUID.oa';
import { uddiv3DigitalSignature } from '../UDDI-Schema/uddiv3DigitalSignature.oa';
import { uddiv3NodeId } from '../UDDI-Schema/uddiv3NodeId.oa';


/* START_OF_SYMBOL_DEFINITION uddiPublisherAssertion */
/**
 * @summary uddiPublisherAssertion
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uddiPublisherAssertion OBJECT-CLASS ::= {
 *     SUBCLASS OF     { top }
 *     KIND            structural
 *     MUST CONTAIN    {uddiFromKey | uddiToKey | uddiKeyedReference | uddiUUID}
 *     MAY CONTAIN     {uddiv3DigitalSignature | uddiv3NodeId}
 *     LDAP-NAME       {"uddiPublisherAssertion"}
 *     ID              { id-uddi 6 8 } }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const uddiPublisherAssertion: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        uddiFromKey,
        uddiToKey,
        uddiKeyedReference,
        uddiUUID,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        uddiv3DigitalSignature,
        uddiv3NodeId,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['uddiPublisherAssertion'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [6, 8],
        id_uddi
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiPublisherAssertion */

/* eslint-enable */
