/* eslint-disable */
import type { MATCHING_RULE } from '@wildboar/x500/InformationFramework';
import { ia5String } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION ia5StringApproxMatch */
/**
 * @summary ia5StringApproxMatch
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ia5StringApproxMatch MATCHING-RULE ::= {
 *     SYNTAX                  IA5String
 *     LDAP-SYNTAX             ia5String.&id
 *     LDAP-NAME               {"ia5StringApproxMatch"}
 *     ID                      { 1 3 6 1 4 1 4203 666 4 5 }
 * }
 * ```
 *
 * @constant
 * @type {MATCHING_RULE}
 * @implements {MATCHING_RULE}
 */
export const ia5StringApproxMatch: MATCHING_RULE = {
    class: 'MATCHING-RULE',
    decoderFor: {
        '&AssertionType': $._decodeIA5String,
    },
    encoderFor: {
        '&AssertionType': $._encodeIA5String,
    },
    '&AssertionType': 0 as never,
    '&ldapSyntax': ia5String['&id'],
    '&ldapName': ['ia5StringApproxMatch'],
    '&id': _OID.fromParts([1, 3, 6, 1, 4, 1, 4203, 666, 4, 5]),
};
/* END_OF_SYMBOL_DEFINITION ia5StringApproxMatch */

/* eslint-enable */
