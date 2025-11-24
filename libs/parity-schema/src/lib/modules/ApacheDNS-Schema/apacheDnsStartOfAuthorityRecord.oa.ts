/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { apacheDnsAbstractRecord } from '../ApacheDNS-Schema/apacheDnsAbstractRecord.oa';
import { apacheDnsClass } from '../ApacheDNS-Schema/apacheDnsClass.oa';
import { apacheDnsSoaExpire } from '../ApacheDNS-Schema/apacheDnsSoaExpire.oa';
import { apacheDnsSoaMinimum } from '../ApacheDNS-Schema/apacheDnsSoaMinimum.oa';
import { apacheDnsSoaMName } from '../ApacheDNS-Schema/apacheDnsSoaMName.oa';
import { apacheDnsSoaRefresh } from '../ApacheDNS-Schema/apacheDnsSoaRefresh.oa';
import { apacheDnsSoaRetry } from '../ApacheDNS-Schema/apacheDnsSoaRetry.oa';
import { apacheDnsSoaRName } from '../ApacheDNS-Schema/apacheDnsSoaRName.oa';
import { apacheDnsSoaSerial } from '../ApacheDNS-Schema/apacheDnsSoaSerial.oa';


/* START_OF_SYMBOL_DEFINITION apacheDnsStartOfAuthorityRecord */
/**
 * @summary apacheDnsStartOfAuthorityRecord
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * apacheDnsStartOfAuthorityRecord OBJECT-CLASS ::= {
 *     SUBCLASS OF     {apacheDnsAbstractRecord}
 *     KIND            structural
 *     MUST CONTAIN    {apacheDnsSoaMName | apacheDnsSoaRName | apacheDnsSoaMinimum}
 *     MAY CONTAIN     {apacheDnsClass | apacheDnsSoaSerial | apacheDnsSoaRefresh | apacheDnsSoaRetry | apacheDnsSoaExpire}
 *     LDAP-NAME       {"apacheDnsStartOfAuthorityRecord"}
 *     LDAP-DESC       "A start of authority SOA record"
 *     ID              { 1 3 6 1 4 1 18060 0 4 2 3 5 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const apacheDnsStartOfAuthorityRecord: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [apacheDnsAbstractRecord] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        apacheDnsSoaMName,
        apacheDnsSoaRName,
        apacheDnsSoaMinimum,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        apacheDnsClass,
        apacheDnsSoaSerial,
        apacheDnsSoaRefresh,
        apacheDnsSoaRetry,
        apacheDnsSoaExpire,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['apacheDnsStartOfAuthorityRecord'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'A start of authority SOA record' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 2, 3, 5,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION apacheDnsStartOfAuthorityRecord */

/* eslint-enable */
