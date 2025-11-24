/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { id_uddi } from '../UDDI-Schema/id-uddi.va';
import { uddiAccessPoint } from '../UDDI-Schema/uddiAccessPoint.oa';
import { uddiBindingKey } from '../UDDI-Schema/uddiBindingKey.oa';
import { uddiCategoryBag } from '../UDDI-Schema/uddiCategoryBag.oa';
import { uddiDescription } from '../UDDI-Schema/uddiDescription.oa';
import { uddiHostingRedirector } from '../UDDI-Schema/uddiHostingRedirector.oa';
import { uddiServiceKey } from '../UDDI-Schema/uddiServiceKey.oa';
import { uddiv3BindingKey } from '../UDDI-Schema/uddiv3BindingKey.oa';
import { uddiv3DigitalSignature } from '../UDDI-Schema/uddiv3DigitalSignature.oa';
import { uddiv3EntityCreationTime } from '../UDDI-Schema/uddiv3EntityCreationTime.oa';
import { uddiv3NodeId } from '../UDDI-Schema/uddiv3NodeId.oa';
import { uddiv3ServiceKey } from '../UDDI-Schema/uddiv3ServiceKey.oa';


/* START_OF_SYMBOL_DEFINITION uddiBindingTemplate */
/**
 * @summary uddiBindingTemplate
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uddiBindingTemplate OBJECT-CLASS ::= {
 *     SUBCLASS OF     { top }
 *     KIND            structural
 *     MUST CONTAIN    {uddiBindingKey}
 *     MAY CONTAIN     {
 *         uddiServiceKey
 *         | uddiDescription
 *         | uddiAccessPoint
 *         | uddiHostingRedirector
 *         | uddiCategoryBag
 *         | uddiv3BindingKey
 *         | uddiv3ServiceKey
 *         | uddiv3DigitalSignature
 *         | uddiv3EntityCreationTime
 *         | uddiv3NodeId
 *     }
 *     LDAP-NAME       {"uddiBindingTemplate"}
 *     ID              { id-uddi 6 5 } }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const uddiBindingTemplate: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [uddiBindingKey] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        uddiServiceKey,
        uddiDescription,
        uddiAccessPoint,
        uddiHostingRedirector,
        uddiCategoryBag,
        uddiv3BindingKey,
        uddiv3ServiceKey,
        uddiv3DigitalSignature,
        uddiv3EntityCreationTime,
        uddiv3NodeId,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['uddiBindingTemplate'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [6, 5],
        id_uddi
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiBindingTemplate */

/* eslint-enable */
