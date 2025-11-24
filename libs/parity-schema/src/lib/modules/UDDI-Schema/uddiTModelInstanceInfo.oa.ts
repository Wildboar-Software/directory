/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { id_uddi } from '../UDDI-Schema/id-uddi.va';
import { uddiDescription } from '../UDDI-Schema/uddiDescription.oa';
import { uddiInstanceDescription } from '../UDDI-Schema/uddiInstanceDescription.oa';
import { uddiInstanceParms } from '../UDDI-Schema/uddiInstanceParms.oa';
import { uddiOverviewDescription } from '../UDDI-Schema/uddiOverviewDescription.oa';
import { uddiOverviewURL } from '../UDDI-Schema/uddiOverviewURL.oa';
import { uddiTModelKey } from '../UDDI-Schema/uddiTModelKey.oa';
import { uddiv3TModelKey } from './uddiv3TModelKey.oa';


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
    '&id': _OID.fromParts(
        [6, 6],
        id_uddi
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiTModelInstanceInfo */

/* eslint-enable */
