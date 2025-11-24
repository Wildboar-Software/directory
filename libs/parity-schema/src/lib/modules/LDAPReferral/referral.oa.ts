/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ref } from '../LDAPReferral/ref.oa';


/* START_OF_SYMBOL_DEFINITION referral */
/**
 * @summary referral
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * referral OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            structural
 *     MUST CONTAIN    {ref}
 *     LDAP-NAME        {"referral"}
 *     LDAP-DESC        "named subordinate reference object"
 *     ID                { 2 16 840 1 113730 3 2 6 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const referral: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [ref] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['referral'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'named subordinate reference object' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        2, 16, 840, 1, 113730, 3, 2, 6,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION referral */

/* eslint-enable */
