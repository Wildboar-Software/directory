/* eslint-disable */
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION operationalBinding */
/**
 * @summary operationalBinding
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * operationalBinding                       ID ::= {ds 19}
 * ```
 *
 * @constant
 */
export const operationalBinding: ID = _OID.fromParts([19], ds);
/* END_OF_SYMBOL_DEFINITION operationalBinding */

/* eslint-enable */
