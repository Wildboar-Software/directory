/* eslint-disable */
import { MATCHING_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca';
import { integer } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/integer.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';
export { MATCHING_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca';
export { integer } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/integer.oa';

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
    '&id': new _OID([1, 2, 840, 113556, 1, 4, 803]),
};
/* END_OF_SYMBOL_DEFINITION integerBitAndMatch */

/* eslint-enable */
