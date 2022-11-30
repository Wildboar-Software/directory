/* eslint-disable */
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';
export { ds } from '../Wildboar/ds.va';
export { ID, _decode_ID, _encode_ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION operationalAttributeType */
/**
 * @summary operationalAttributeType
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * operationalAttributeType                 ID ::= {ds 18}
 * ```
 *
 * @constant
 */
export const operationalAttributeType: ID = new _OID([18], ds);
/* END_OF_SYMBOL_DEFINITION operationalAttributeType */

/* eslint-enable */
