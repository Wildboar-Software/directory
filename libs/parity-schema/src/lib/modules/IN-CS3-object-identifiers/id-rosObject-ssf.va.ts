/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_rosObject } from '../IN-CS3-object-identifiers/id-rosObject.va';
export { id_rosObject } from '../IN-CS3-object-identifiers/id-rosObject.va';

/* START_OF_SYMBOL_DEFINITION id_rosObject_ssf */
/**
 * @summary id_rosObject_ssf
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-rosObject-ssf OBJECT IDENTIFIER ::= {id-rosObject ssf(2)}
 * ```
 *
 * @constant
 */
export const id_rosObject_ssf: OBJECT_IDENTIFIER = new _OID(
    [/* ssf */ 2],
    id_rosObject
);
/* END_OF_SYMBOL_DEFINITION id_rosObject_ssf */

/* eslint-enable */
