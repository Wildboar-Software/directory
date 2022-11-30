/* eslint-disable */
import { SYNTAX_NAME } from '@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca';
import { ASN1Element as _Element } from 'asn1-ts';
import { id_lsx_open } from '../RFC3687ComponentMatching/id-lsx-open.va';
export { SYNTAX_NAME } from '@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca';
export { id_lsx_open } from '../RFC3687ComponentMatching/id-lsx-open.va';

/* START_OF_SYMBOL_DEFINITION open */
/**
 * @summary open
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * open SYNTAX-NAME ::= {
 *     LDAP-DESC               "OpenAssertionType"
 *     DIRECTORY SYNTAX        TYPE-IDENTIFIER.&Type
 *     ID                      id-lsx-open
 * }
 * ```
 *
 * @constant
 * @type {SYNTAX_NAME}
 * @implements {SYNTAX_NAME}
 */
export const open: SYNTAX_NAME<_Element> = {
    class: 'SYNTAX-NAME',
    decoderFor: {
        '&Type': (e) => e,
    },
    encoderFor: {
        '&Type': (e) => e,
    },
    '&Type': 0 as never,
    '&id': id_lsx_open,
    '&ldapDesc': 'OpenAssertionType',
};
/* END_OF_SYMBOL_DEFINITION open */

/* eslint-enable */
