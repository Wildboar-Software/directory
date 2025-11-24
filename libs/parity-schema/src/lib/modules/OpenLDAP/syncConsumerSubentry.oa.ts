/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { syncreplCookie } from './syncreplCookie.oa';


/* START_OF_SYMBOL_DEFINITION syncConsumerSubentry */
/**
 * @summary syncConsumerSubentry
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * syncConsumerSubentry OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            auxiliary
 *     MAY CONTAIN     {syncreplCookie}
 *     LDAP-NAME        {"syncConsumerSubentry"}
 *     LDAP-DESC       "Persistent Info for SyncRepl Consumer"
 *     ID                { 1 3 6 1 4 1 4203 666 3 5 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const syncConsumerSubentry: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [syncreplCookie] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['syncConsumerSubentry'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'Persistent Info for SyncRepl Consumer' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 4203, 666, 3, 5,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION syncConsumerSubentry */

/* eslint-enable */
