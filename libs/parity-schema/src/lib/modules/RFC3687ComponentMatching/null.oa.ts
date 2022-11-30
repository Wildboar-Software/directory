/* eslint-disable */
import { SYNTAX_NAME } from '@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca';
import { NULL } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';
import { id_lsx_null } from '../RFC3687ComponentMatching/id-lsx-null.va';
export { SYNTAX_NAME } from '@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca';
export { id_lsx_null } from '../RFC3687ComponentMatching/id-lsx-null.va';

/* START_OF_SYMBOL_DEFINITION null_ */
/**
 * @summary null_
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * null SYNTAX-NAME ::= {
 *     LDAP-DESC               "NULL"
 *     DIRECTORY SYNTAX        NULL
 *     ID                      id-lsx-null
 * }
 * ```
 *
 * @constant
 * @type {SYNTAX_NAME}
 * @implements {SYNTAX_NAME}
 */
export const null_: SYNTAX_NAME<NULL> = {
    class: 'SYNTAX-NAME',
    decoderFor: {
        '&Type': $._decodeNull,
    },
    encoderFor: {
        '&Type': $._encodeNull,
    },
    '&Type': 0 as never,
    '&id': id_lsx_null,
    '&ldapDesc': 'NULL',
};
/* END_OF_SYMBOL_DEFINITION null_ */

/* eslint-enable */
