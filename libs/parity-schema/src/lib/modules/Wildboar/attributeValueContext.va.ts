/* eslint-disable */
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION attributeValueContext */
/**
 * @summary attributeValueContext
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * attributeValueContext                    ID ::= {ds 31}
 * ```
 *
 * @constant
 */
export const attributeValueContext: ID = _OID.fromParts([31], ds);
/* END_OF_SYMBOL_DEFINITION attributeValueContext */

/* eslint-enable */
