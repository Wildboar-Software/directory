/* eslint-disable */
import type { MATCHING_RULE } from '@wildboar/x500/InformationFramework';
import { directoryString } from '@wildboar/x500/SelectedAttributeTypes';
import {
    _decode_UnboundedDirectoryString,
    _encode_UnboundedDirectoryString,
} from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';


/* START_OF_SYMBOL_DEFINITION directoryStringApproxMatch */
/**
 * @summary directoryStringApproxMatch
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * directoryStringApproxMatch MATCHING-RULE ::= {
 *     SYNTAX                  UnboundedDirectoryString
 *     LDAP-SYNTAX             directoryString.&id
 *     LDAP-NAME               {"directoryStringApproxMatch"}
 *     ID                      { 1 3 6 1 4 1 4203 666 4 4 }
 * }
 * ```
 *
 * @constant
 * @type {MATCHING_RULE}
 * @implements {MATCHING_RULE}
 */
export const directoryStringApproxMatch: MATCHING_RULE = {
    class: 'MATCHING-RULE',
    decoderFor: {
        '&AssertionType': _decode_UnboundedDirectoryString,
    },
    encoderFor: {
        '&AssertionType': _encode_UnboundedDirectoryString,
    },
    '&AssertionType': 0 as never,
    '&ldapSyntax': directoryString['&id'],
    '&ldapName': ['directoryStringApproxMatch'],
    '&id': _OID.fromParts([1, 3, 6, 1, 4, 1, 4203, 666, 4, 4]),
};
/* END_OF_SYMBOL_DEFINITION directoryStringApproxMatch */

/* eslint-enable */
