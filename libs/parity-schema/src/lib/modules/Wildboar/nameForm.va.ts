/* eslint-disable */
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION nameForm */
/**
 * @summary nameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * nameForm                                 ID ::= {ds 15}
 * ```
 *
 * @constant
 */
export const nameForm: ID = new _OID([15], ds);
/* END_OF_SYMBOL_DEFINITION nameForm */

/* eslint-enable */
