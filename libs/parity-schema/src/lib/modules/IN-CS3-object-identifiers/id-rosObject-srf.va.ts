/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_rosObject } from '../IN-CS3-object-identifiers/id-rosObject.va';
export { id_rosObject } from '../IN-CS3-object-identifiers/id-rosObject.va';

/* START_OF_SYMBOL_DEFINITION id_rosObject_srf */
/**
 * @summary id_rosObject_srf
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-rosObject-srf OBJECT IDENTIFIER ::= {id-rosObject srf(3)}
 * ```
 *
 * @constant
 */
export const id_rosObject_srf: OBJECT_IDENTIFIER = new _OID(
    [/* srf */ 3],
    id_rosObject
);
/* END_OF_SYMBOL_DEFINITION id_rosObject_srf */

/* eslint-enable */
