/* eslint-disable */
import {
    ObjectIdentifier as _OID
} from "asn1-ts";
import { ID } from "../VOPerson/ID.ta";
import { id_voPersonObjectClass } from "../VOPerson/id-voPersonObjectClass.va";
export { ID, _decode_ID, _encode_ID } from "../VOPerson/ID.ta";
export { id_voPersonObjectClass } from "../VOPerson/id-voPersonObjectClass.va";


/* START_OF_SYMBOL_DEFINITION id_at_voPersonScopedAffiliation */
/**
 * @summary id_at_voPersonScopedAffiliation
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-voPersonScopedAffiliation     ID ::= { id-voPersonObjectClass 12 }
 * ```
 *
 * @constant
 */
export
const id_at_voPersonScopedAffiliation: ID = new _OID([
    12,
], id_voPersonObjectClass);
/* END_OF_SYMBOL_DEFINITION id_at_voPersonScopedAffiliation */

/* eslint-enable */
