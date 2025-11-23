/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_pkix } from '../PKIXCRMF-2009/id-pkix.va';
export { id_pkix } from '../PKIXCRMF-2009/id-pkix.va';

/* START_OF_SYMBOL_DEFINITION id_pkip */
/**
 * @summary id_pkip
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-pkip OBJECT IDENTIFIER ::= { id-pkix 5 }
 * ```
 *
 * @constant
 */
export const id_pkip: OBJECT_IDENTIFIER = _OID.fromParts([5], id_pkix);
/* END_OF_SYMBOL_DEFINITION id_pkip */

/* eslint-enable */
