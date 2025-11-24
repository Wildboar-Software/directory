/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { id_uddi } from '../UDDI-Schema/id-uddi.va';
import { uddiBusinessKey } from '../UDDI-Schema/uddiBusinessKey.oa';
import { uddiCategoryBag } from '../UDDI-Schema/uddiCategoryBag.oa';
import { uddiDescription } from '../UDDI-Schema/uddiDescription.oa';
import { uddiIsProjection } from '../UDDI-Schema/uddiIsProjection.oa';
import { uddiName } from '../UDDI-Schema/uddiName.oa';
import { uddiServiceKey } from '../UDDI-Schema/uddiServiceKey.oa';
import { uddiv3BusinessKey } from '../UDDI-Schema/uddiv3BusinessKey.oa';
import { uddiv3DigitalSignature } from '../UDDI-Schema/uddiv3DigitalSignature.oa';
import { uddiv3EntityCreationTime } from '../UDDI-Schema/uddiv3EntityCreationTime.oa';
import { uddiv3EntityModificationTime } from '../UDDI-Schema/uddiv3EntityModificationTime.oa';
import { uddiv3NodeId } from '../UDDI-Schema/uddiv3NodeId.oa';
import { uddiv3ServiceKey } from '../UDDI-Schema/uddiv3ServiceKey.oa';


/* START_OF_SYMBOL_DEFINITION uddiBusinessService */
/**
 * @summary uddiBusinessService
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uddiBusinessService OBJECT-CLASS ::= {
 *     SUBCLASS OF     { top }
 *     KIND            structural
 *     MUST CONTAIN    {uddiServiceKey}
 *     MAY CONTAIN     {
 *         uddiName
 *         | uddiBusinessKey
 *         | uddiDescription
 *         | uddiCategoryBag
 *         | uddiIsProjection
 *         | uddiv3ServiceKey
 *         | uddiv3BusinessKey
 *         | uddiv3DigitalSignature
 *         | uddiv3EntityCreationTime
 *         | uddiv3EntityModificationTime
 *         | uddiv3NodeId
 *     }
 *     LDAP-NAME       {"uddiBusinessService"}
 *     ID              { id-uddi 6 4 } }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const uddiBusinessService: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [uddiServiceKey] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        uddiName,
        uddiBusinessKey,
        uddiDescription,
        uddiCategoryBag,
        uddiIsProjection,
        uddiv3ServiceKey,
        uddiv3BusinessKey,
        uddiv3DigitalSignature,
        uddiv3EntityCreationTime,
        uddiv3EntityModificationTime,
        uddiv3NodeId,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['uddiBusinessService'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [6, 4],
        id_uddi
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiBusinessService */

/* eslint-enable */
