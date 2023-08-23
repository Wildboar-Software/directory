/* eslint-disable */
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { id_pen } from '../Wildboar/id-pen.va';
import { ID } from '../Wildboar/ID.ta';
import { pen_wildboar } from '../Wildboar/pen-wildboar.va';

/* START_OF_SYMBOL_DEFINITION id_wildboar */
/**
 * @summary id_wildboar
 * @description
 *
 * The full, expanded value of this OID is `1.3.6.1.4.1.56490`.
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-wildboar     ID ::= {id-pen pen-wildboar}
 * ```
 *
 * @constant
 */
export const id_wildboar: ID = new _OID([Number(pen_wildboar)], id_pen);
/* END_OF_SYMBOL_DEFINITION id_wildboar */

/* eslint-enable */
