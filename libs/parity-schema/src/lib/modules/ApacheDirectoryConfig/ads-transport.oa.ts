/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ads_base } from '../ApacheDirectoryConfig/ads-base.oa';
import { ads_systemPort } from '../ApacheDirectoryConfig/ads-systemPort.oa';
import { ads_transportAddress } from '../ApacheDirectoryConfig/ads-transportAddress.oa';
import { ads_transportBacklog } from '../ApacheDirectoryConfig/ads-transportBacklog.oa';
import { ads_transportEnableSSL } from '../ApacheDirectoryConfig/ads-transportEnableSSL.oa';
import { ads_transportId } from '../ApacheDirectoryConfig/ads-transportId.oa';
import { ads_transportNbThreads } from '../ApacheDirectoryConfig/ads-transportNbThreads.oa';


/* START_OF_SYMBOL_DEFINITION ads_transport */
/**
 * @summary ads_transport
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ads-transport OBJECT-CLASS ::= {
 *     SUBCLASS OF     {ads-base}
 *     KIND            abstract
 *     MUST CONTAIN    {
 *         ads-transportId
 *         | ads-systemPort
 *         | ads-transportAddress
 *     }
 *     MAY CONTAIN     {
 *         ads-transportBacklog
 *         | ads-transportEnableSSL
 *         | ads-transportNbThreads
 *     }
 *     LDAP-NAME       {"ads-transport"}
 *     LDAP-DESC       "A transport (TCP or UDP)"
 *     ID              { 1 3 6 1 4 1 18060 0 4 1 3 18 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const ads_transport: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [ads_base] /* OBJECT_FIELD_SETTING */,
    '&kind': abstract /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        ads_transportId,
        ads_systemPort,
        ads_transportAddress,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        ads_transportBacklog,
        ads_transportEnableSSL,
        ads_transportNbThreads,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ads-transport'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'A transport (TCP or UDP)' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 3, 18,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ads_transport */

/* eslint-enable */
