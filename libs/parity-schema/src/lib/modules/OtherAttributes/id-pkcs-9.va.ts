/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_pkcs } from '../OtherAttributes/id-pkcs.va';
export { id_pkcs } from '../OtherAttributes/id-pkcs.va';

/* START_OF_SYMBOL_DEFINITION id_pkcs_9 */
/**
 * @summary id_pkcs_9
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-pkcs-9                       OBJECT IDENTIFIER ::= { id-pkcs pkcs-9(9) }
 * ```
 *
 * @constant
 */
export const id_pkcs_9: OBJECT_IDENTIFIER = new _OID([/* pkcs-9 */ 9], id_pkcs);
/* END_OF_SYMBOL_DEFINITION id_pkcs_9 */

/* eslint-enable */
