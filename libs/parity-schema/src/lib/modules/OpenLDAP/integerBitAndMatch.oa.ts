/* eslint-disable */
import type { MATCHING_RULE } from '@wildboar/x500/InformationFramework';
import { integer } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION integerBitAndMatch */
/**
 * @summary integerBitAndMatch
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * integerBitAndMatch MATCHING-RULE ::= {
 *     SYNTAX                  INTEGER
 *     LDAP-SYNTAX             integer.&id
 *     LDAP-NAME               {"integerBitAndMatch"}
 *     ID                      { 1 2 840 113556 1 4 803 }
 * }
 * ```
 *
 * @constant
 * @type {MATCHING_RULE}
 * @implements {MATCHING_RULE}
 */
export const integerBitAndMatch: MATCHING_RULE = {
    class: 'MATCHING-RULE',
    decoderFor: {
        '&AssertionType': $._decodeInteger,
    },
    encoderFor: {
        '&AssertionType': $._encodeInteger,
    },
    '&AssertionType': 0 as never,
    '&ldapSyntax': integer['&id'],
    '&ldapName': ['integerBitAndMatch'],
    '&id': _OID.fromParts([1, 2, 840, 113556, 1, 4, 803]),
};
/* END_OF_SYMBOL_DEFINITION integerBitAndMatch */

/* eslint-enable */
