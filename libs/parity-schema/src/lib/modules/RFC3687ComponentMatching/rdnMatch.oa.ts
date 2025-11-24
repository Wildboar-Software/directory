/* eslint-disable */
import {
    RelativeDistinguishedName,
    _decode_RelativeDistinguishedName,
    _encode_RelativeDistinguishedName,
} from '@wildboar/pki-stub';
import type { MATCHING_RULE } from '@wildboar/x500/InformationFramework';
import { id_mr_rdnMatch } from '../RFC3687ComponentMatching/id-mr-rdnMatch.va';
import { rdn } from '../RFC3687ComponentMatching/rdn.oa';

/* START_OF_SYMBOL_DEFINITION rdnMatch */
/**
 * @summary rdnMatch
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * rdnMatch MATCHING-RULE ::= {
 *     SYNTAX                  RelativeDistinguishedName
 *     LDAP-SYNTAX             rdn.&id
 *     LDAP-NAME               {"rdnMatch"}
 *     ID                      id-mr-rdnMatch
 * }
 * ```
 *
 * @constant
 * @type {MATCHING_RULE<RelativeDistinguishedName>}
 * @implements {MATCHING_RULE<RelativeDistinguishedName>}
 */
export const rdnMatch: MATCHING_RULE<RelativeDistinguishedName> = {
    class: 'MATCHING-RULE',
    decoderFor: {
        '&AssertionType': _decode_RelativeDistinguishedName,
    },
    encoderFor: {
        '&AssertionType': _encode_RelativeDistinguishedName,
    },
    '&ldapSyntax': rdn['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['rdnMatch'] /* OBJECT_FIELD_SETTING */,
    '&id': id_mr_rdnMatch /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&AssertionType':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION rdnMatch */

/* eslint-enable */
