/* eslint-disable */
import { MATCHING_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca';
import { ia5String } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/ia5String.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';
export { MATCHING_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca';
export { ia5String } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/ia5String.oa';

/* START_OF_SYMBOL_DEFINITION caseExactIA5SubstringsMatch */
/**
 * @summary caseExactIA5SubstringsMatch
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * caseExactIA5SubstringsMatch MATCHING-RULE ::= {
 *     SYNTAX                  IA5String
 *     LDAP-SYNTAX             ia5String.&id
 *     LDAP-NAME               {"caseExactIA5SubstringsMatch"}
 *     ID                      { 1 3 6 1 4 1 4203 1 2 1 }
 * }
 * ```
 *
 * @constant
 * @type {MATCHING_RULE}
 * @implements {MATCHING_RULE}
 */
export const caseExactIA5SubstringsMatch: MATCHING_RULE = {
    class: 'MATCHING-RULE',
    decoderFor: {
        '&AssertionType': $._decodeIA5String,
    },
    encoderFor: {
        '&AssertionType': $._encodeIA5String,
    },
    '&AssertionType': 0 as never,
    '&ldapSyntax': ia5String['&id'],
    '&ldapName': ['caseExactIA5SubstringsMatch'],
    '&id': new _OID([1, 3, 6, 1, 4, 1, 4203, 1, 2, 1]),
};
/* END_OF_SYMBOL_DEFINITION caseExactIA5SubstringsMatch */

/* eslint-enable */
