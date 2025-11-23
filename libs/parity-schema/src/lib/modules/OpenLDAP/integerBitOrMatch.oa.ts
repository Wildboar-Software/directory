/* eslint-disable */
import { MATCHING_RULE } from '@wildboar/x500/InformationFramework';
import { integer } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
export { MATCHING_RULE } from '@wildboar/x500/InformationFramework';
export { integer } from '@wildboar/x500/SelectedAttributeTypes';

/* START_OF_SYMBOL_DEFINITION integerBitOrMatch */
/**
 * @summary integerBitOrMatch
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * integerBitOrMatch MATCHING-RULE ::= {
 *     SYNTAX                  INTEGER
 *     LDAP-SYNTAX             integer.&id
 *     LDAP-NAME               {"integerBitOrMatch"}
 *     ID                      { 1 2 840 113556 1 4 804 }
 * }
 * ```
 *
 * @constant
 * @type {MATCHING_RULE}
 * @implements {MATCHING_RULE}
 */
export const integerBitOrMatch: MATCHING_RULE = {
    class: 'MATCHING-RULE',
    decoderFor: {
        '&AssertionType': $._decodeInteger,
    },
    encoderFor: {
        '&AssertionType': $._encodeInteger,
    },
    '&AssertionType': 0 as never,
    '&ldapSyntax': integer['&id'],
    '&ldapName': ['integerBitOrMatch'],
    '&id': _OID.fromParts([1, 2, 840, 113556, 1, 4, 804]),
};
/* END_OF_SYMBOL_DEFINITION integerBitOrMatch */

/* eslint-enable */
