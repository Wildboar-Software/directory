/* eslint-disable */
import {
    RelativeDistinguishedName,
    _decode_RelativeDistinguishedName,
    _encode_RelativeDistinguishedName,
} from '@wildboar/pki-stub/src/lib/modules/PKI-Stub/RelativeDistinguishedName.ta';
import { SYNTAX_NAME } from '@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca';
import { id_lsx_rdn } from '../RFC3687ComponentMatching/id-lsx-rdn.va';
export { SYNTAX_NAME } from '@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca';
export { id_lsx_rdn } from '../RFC3687ComponentMatching/id-lsx-rdn.va';

/* START_OF_SYMBOL_DEFINITION rdn */
/**
 * @summary rdn
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * rdn SYNTAX-NAME ::= {
 *     LDAP-DESC               "RDN"
 *     DIRECTORY SYNTAX        RelativeDistinguishedName
 *     ID                      id-lsx-rdn
 * }
 * ```
 *
 * @constant
 * @type {SYNTAX_NAME}
 * @implements {SYNTAX_NAME}
 */
export const rdn: SYNTAX_NAME<RelativeDistinguishedName> = {
    class: 'SYNTAX-NAME',
    decoderFor: {
        '&Type': _decode_RelativeDistinguishedName,
    },
    encoderFor: {
        '&Type': _encode_RelativeDistinguishedName,
    },
    '&Type': 0 as never,
    '&id': id_lsx_rdn,
    '&ldapDesc': 'RDN',
};
/* END_OF_SYMBOL_DEFINITION rdn */

/* eslint-enable */
