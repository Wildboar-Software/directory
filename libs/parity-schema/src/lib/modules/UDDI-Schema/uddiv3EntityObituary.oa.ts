/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { id_uddi } from '../UDDI-Schema/id-uddi.va';
import { uddiAuthorizedName } from '../UDDI-Schema/uddiAuthorizedName.oa';
import { uddiUUID } from '../UDDI-Schema/uddiUUID.oa';
import { uddiv3EntityCreationTime } from '../UDDI-Schema/uddiv3EntityCreationTime.oa';
import { uddiv3EntityDeletionTime } from '../UDDI-Schema/uddiv3EntityDeletionTime.oa';
import { uddiv3EntityKey } from '../UDDI-Schema/uddiv3EntityKey.oa';
import { uddiv3NodeId } from '../UDDI-Schema/uddiv3NodeId.oa';


/* START_OF_SYMBOL_DEFINITION uddiv3EntityObituary */
/**
 * @summary uddiv3EntityObituary
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uddiv3EntityObituary OBJECT-CLASS ::= {
 *     SUBCLASS OF     { top }
 *     KIND            structural
 *     MUST CONTAIN    {uddiv3EntityKey | uddiUUID}
 *     MAY CONTAIN     {
 *         uddiAuthorizedName
 *         | uddiv3EntityCreationTime
 *         | uddiv3EntityDeletionTime
 *         | uddiv3NodeId
 *     }
 *     LDAP-NAME       {"uddiv3EntityObituary"}
 *     ID              { id-uddi 6 10 } }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const uddiv3EntityObituary: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        uddiv3EntityKey,
        uddiUUID,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        uddiAuthorizedName,
        uddiv3EntityCreationTime,
        uddiv3EntityDeletionTime,
        uddiv3NodeId,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['uddiv3EntityObituary'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [6, 10],
        id_uddi
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiv3EntityObituary */

/* eslint-enable */
