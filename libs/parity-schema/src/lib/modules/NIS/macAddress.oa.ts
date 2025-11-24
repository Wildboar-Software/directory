/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { caseIgnoreIA5Match } from '@wildboar/x500/SelectedAttributeTypes';
import { caseIgnoreIA5SubstringsMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { ia5String } from '@wildboar/x500/SelectedAttributeTypes';
import { IA5String, ObjectIdentifier as _OID } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import { id_nis_at } from '../NIS/id-nis-at.va';


/* START_OF_SYMBOL_DEFINITION macAddress */
/**
 * @summary macAddress
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * macAddress ATTRIBUTE ::= {
 *     WITH SYNTAX                 IA5String (SIZE (0..128))
 *     EQUALITY MATCHING RULE         caseIgnoreIA5Match
 *     SUBSTRINGS MATCHING RULE     caseIgnoreIA5SubstringsMatch
 *     LDAP-SYNTAX                 ia5String.&id
 *     LDAP-NAME                     {"macAddress"}
 *     LDAP-DESC                   "MAC address"
 *     ID { id-nis-at 22 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<IA5String>}
 * @implements {ATTRIBUTE<IA5String>}
 */
export const macAddress: ATTRIBUTE<IA5String> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': $._decodeIA5String,
    },
    encoderFor: {
        '&Type': $._encodeIA5String,
    },
    '&equality-match': caseIgnoreIA5Match /* OBJECT_FIELD_SETTING */,
    '&substrings-match':
        caseIgnoreIA5SubstringsMatch /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': ia5String['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['macAddress'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'MAC address' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [22],
        id_nis_at
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&single-valued':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&collective':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&no-user-modification':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&usage':
        userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&obsolete': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION macAddress */

/* eslint-enable */
