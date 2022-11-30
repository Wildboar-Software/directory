/* eslint-disable */
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';
export { ds } from '../Wildboar/ds.va';
export { ID, _decode_ID, _encode_ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION id_methodOfDisposition */
/**
 * @summary id_methodOfDisposition
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-methodOfDisposition                   ID ::= {ds 55}
 * ```
 *
 * @constant
 */
export const id_methodOfDisposition: ID = new _OID([55], ds);
/* END_OF_SYMBOL_DEFINITION id_methodOfDisposition */

/* eslint-enable */
