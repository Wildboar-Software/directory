/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { id_uddi } from '../UDDI-Schema/id-uddi.va';
import { uddiAuthorizedName } from '../UDDI-Schema/uddiAuthorizedName.oa';
import { uddiBusinessKey } from '../UDDI-Schema/uddiBusinessKey.oa';
import { uddiCategoryBag } from '../UDDI-Schema/uddiCategoryBag.oa';
import { uddiDescription } from '../UDDI-Schema/uddiDescription.oa';
import { uddiDiscoveryURLs } from '../UDDI-Schema/uddiDiscoveryURLs.oa';
import { uddiIdentifierBag } from '../UDDI-Schema/uddiIdentifierBag.oa';
import { uddiName } from '../UDDI-Schema/uddiName.oa';
import { uddiOperator } from '../UDDI-Schema/uddiOperator.oa';
import { uddiv3BusinessKey } from '../UDDI-Schema/uddiv3BusinessKey.oa';
import { uddiv3DigitalSignature } from '../UDDI-Schema/uddiv3DigitalSignature.oa';
import { uddiv3EntityModificationTime } from '../UDDI-Schema/uddiv3EntityModificationTime.oa';
import { uddiv3NodeId } from '../UDDI-Schema/uddiv3NodeId.oa';


/* START_OF_SYMBOL_DEFINITION uddiBusinessEntity */
/**
 * @summary uddiBusinessEntity
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uddiBusinessEntity OBJECT-CLASS ::= {
 *     SUBCLASS OF     { top }
 *     KIND            structural
 *     MUST CONTAIN    {uddiBusinessKey | uddiName}
 *     MAY CONTAIN     {
 *         uddiAuthorizedName
 *         | uddiOperator
 *         | uddiDiscoveryURLs
 *         | uddiDescription
 *         | uddiIdentifierBag
 *         | uddiCategoryBag
 *         | uddiv3BusinessKey
 *         | uddiv3DigitalSignature
 *         | uddiv3EntityModificationTime
 *         | uddiv3NodeId
 *     }
 *     LDAP-NAME       {"uddiBusinessEntity"}
 *     ID              { id-uddi 6 1 } }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const uddiBusinessEntity: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        uddiBusinessKey,
        uddiName,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        uddiAuthorizedName,
        uddiOperator,
        uddiDiscoveryURLs,
        uddiDescription,
        uddiIdentifierBag,
        uddiCategoryBag,
        uddiv3BusinessKey,
        uddiv3DigitalSignature,
        uddiv3EntityModificationTime,
        uddiv3NodeId,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['uddiBusinessEntity'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [6, 1],
        id_uddi
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiBusinessEntity */

/* eslint-enable */
