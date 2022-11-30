/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { id_uddi } from '../UDDI-Schema/id-uddi.va';
import { uddiDescription } from '../UDDI-Schema/uddiDescription.oa';
import { uddiInstanceDescription } from '../UDDI-Schema/uddiInstanceDescription.oa';
import { uddiInstanceParms } from '../UDDI-Schema/uddiInstanceParms.oa';
import { uddiOverviewDescription } from '../UDDI-Schema/uddiOverviewDescription.oa';
import { uddiOverviewURL } from '../UDDI-Schema/uddiOverviewURL.oa';
import { uddiTModelKey } from '../UDDI-Schema/uddiTModelKey.oa';
import { uddiv3TModelKey } from './uddiv3TModelKey.oa';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
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
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
export { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
export { id_uddi } from '../UDDI-Schema/id-uddi.va';
export { uddiDescription } from '../UDDI-Schema/uddiDescription.oa';
export { uddiInstanceDescription } from '../UDDI-Schema/uddiInstanceDescription.oa';
export { uddiInstanceParms } from '../UDDI-Schema/uddiInstanceParms.oa';
export { uddiOverviewDescription } from '../UDDI-Schema/uddiOverviewDescription.oa';
export { uddiOverviewURL } from '../UDDI-Schema/uddiOverviewURL.oa';
export { uddiTModelKey } from '../UDDI-Schema/uddiTModelKey.oa';

/* START_OF_SYMBOL_DEFINITION uddiTModelInstanceInfo */
/**
 * @summary uddiTModelInstanceInfo
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uddiTModelInstanceInfo OBJECT-CLASS ::= {
 *     SUBCLASS OF     { top }
 *     KIND            structural
 *     MUST CONTAIN    {uddiTModelKey}
 *     MAY CONTAIN     {
 *         uddiDescription
 *         | uddiInstanceDescription
 *         | uddiInstanceParms
 *         | uddiOverviewDescription
 *         | uddiOverviewURL
 *         | uddiv3TmodelKey
 *     }
 *     LDAP-NAME       {"uddiTModelInstanceInfo"}
 *     ID              { id-uddi 6 6 } }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const uddiTModelInstanceInfo: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [uddiTModelKey] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        uddiDescription,
        uddiInstanceDescription,
        uddiInstanceParms,
        uddiOverviewDescription,
        uddiOverviewURL,
        uddiv3TModelKey,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['uddiTModelInstanceInfo'] /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [6, 6],
        id_uddi
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiTModelInstanceInfo */

/* eslint-enable */
