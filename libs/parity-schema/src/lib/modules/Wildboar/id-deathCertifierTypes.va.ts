/* eslint-disable */
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';
export { ds } from '../Wildboar/ds.va';
export { ID, _decode_ID, _encode_ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION id_deathCertifierTypes */
/**
 * @summary id_deathCertifierTypes
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-deathCertifierTypes                   ID ::= {ds 57}
 * ```
 *
 * @constant
 */
export const id_deathCertifierTypes: ID = _OID.fromParts([57], ds);
/* END_OF_SYMBOL_DEFINITION id_deathCertifierTypes */

/* eslint-enable */
