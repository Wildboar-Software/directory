/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_nsds } from './id-nsds.va';

/* START_OF_SYMBOL_DEFINITION id_nsdsoc */
/**
 * @summary id_nsdsoc
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-nsdsoc           OBJECT IDENTIFIER ::= { nsds 2 }
 * ```
 *
 * @constant
 */
export const id_nsdsoc: OBJECT_IDENTIFIER = _OID.fromParts([2], id_nsds);
/* END_OF_SYMBOL_DEFINITION id_nsdsoc */

/* eslint-enable */
