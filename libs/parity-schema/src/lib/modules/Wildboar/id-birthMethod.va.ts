/* eslint-disable */
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION id_birthMethod */
/**
 * @summary id_birthMethod
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-birthMethod                           ID ::= {ds 51}
 * ```
 *
 * @constant
 */
export const id_birthMethod: ID = _OID.fromParts([51], ds);
/* END_OF_SYMBOL_DEFINITION id_birthMethod */

/* eslint-enable */
