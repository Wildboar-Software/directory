/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { integer } from '@wildboar/x500/SelectedAttributeTypes';
import { integerMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { integerOrderingMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { id_aa_binarySigningTime } from '../OtherAttributes/id-aa-binarySigningTime.va';
import {
    BinarySigningTime,
    _decode_BinarySigningTime,
    _encode_BinarySigningTime,
} from '../OtherImplicitlyTaggedTypes/BinarySigningTime.ta';

/* START_OF_SYMBOL_DEFINITION binarySigningTime */
/**
 * @summary binarySigningTime
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * binarySigningTime ATTRIBUTE ::= {
 *     WITH SYNTAX                        BinarySigningTime
 *     EQUALITY MATCHING RULE            integerMatch
 *     ORDERING MATCHING RULE            integerOrderingMatch
 *     LDAP-SYNTAX                        integer.&id
 *     LDAP-NAME                        {"binarySigningtime"}
 *     LDAP-DESC                        "IETF RFC 4049: The time at which the signer (purportedly) performed the signing process."
 *     ID                                id-aa-binarySigningTime
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<BinarySigningTime>}
 * @implements {ATTRIBUTE<BinarySigningTime>}
 */
export const binarySigningTime: ATTRIBUTE<BinarySigningTime> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_BinarySigningTime,
    },
    encoderFor: {
        '&Type': _encode_BinarySigningTime,
    },
    '&equality-match': integerMatch /* OBJECT_FIELD_SETTING */,
    '&ordering-match': integerOrderingMatch /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': integer['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['binarySigningtime'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'IETF RFC 4049: The time at which the signer (purportedly) performed the signing process.' /* OBJECT_FIELD_SETTING */,
    '&id': id_aa_binarySigningTime /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION binarySigningTime */

/* eslint-enable */
