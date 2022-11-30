/* eslint-disable */
import { ID } from '../Wildboar/ID.ta';
import { idmProtocol } from '../Wildboar/idmProtocol.va';
export { ID, _decode_ID, _encode_ID } from '../Wildboar/ID.ta';
export { idmProtocol } from '../Wildboar/idmProtocol.va';

/* START_OF_SYMBOL_DEFINITION id_idm */
/**
 * @summary id_idm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-idm                                   ID ::= idmProtocol
 * ```
 *
 * @constant
 */
export const id_idm: ID = idmProtocol;
/* END_OF_SYMBOL_DEFINITION id_idm */

/* eslint-enable */
