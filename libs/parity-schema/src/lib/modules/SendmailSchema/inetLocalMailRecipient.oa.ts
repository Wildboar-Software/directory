/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { mailHost } from '../SendmailSchema/mailHost.oa';
import { mailLocalAddress } from '../SendmailSchema/mailLocalAddress.oa';
import { mailRoutingAddress } from '../SendmailSchema/mailRoutingAddress.oa';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
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
} from '@wildboar/x500/InformationFramework';
export { mailHost } from '../SendmailSchema/mailHost.oa';
export { mailLocalAddress } from '../SendmailSchema/mailLocalAddress.oa';
export { mailRoutingAddress } from '../SendmailSchema/mailRoutingAddress.oa';

/* START_OF_SYMBOL_DEFINITION inetLocalMailRecipient */
/**
 * @summary inetLocalMailRecipient
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * inetLocalMailRecipient OBJECT-CLASS ::= {
 *     SUBCLASS OF         { top }
 *     KIND                auxiliary
 *     MAY CONTAIN         {
 *         mailLocalAddress
 *         | mailHost
 *         | mailRoutingAddress
 *     }
 *     LDAP-NAME           { "inetLocalMailRecipient" }
 *     LDAP-DESC           "Internet local mail recipient"
 *     ID                  { 2 16 840 1 113730 3 2 147 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const inetLocalMailRecipient: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        mailLocalAddress,
        mailHost,
        mailRoutingAddress,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['inetLocalMailRecipient'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Internet local mail recipient' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        2, 16, 840, 1, 113730, 3, 2, 147,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION inetLocalMailRecipient */

/* eslint-enable */
