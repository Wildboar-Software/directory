/* eslint-disable */
import {
    ObjectIdentifier as _OID
} from "asn1-ts";
import { ID } from "../VOPerson/ID.ta";
import { id_voPersonObjectClass } from "../VOPerson/id-voPersonObjectClass.va";
export { ID, _decode_ID, _encode_ID } from "../VOPerson/ID.ta";
export { id_voPersonObjectClass } from "../VOPerson/id-voPersonObjectClass.va";


/* START_OF_SYMBOL_DEFINITION id_at_voPersonStatus */
/**
 * @summary id_at_voPersonStatus
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-voPersonStatus                ID ::= { id-voPersonObjectClass 9 }
 * ```
 *
 * @constant
 */
export
const id_at_voPersonStatus: ID = new _OID([
    9,
], id_voPersonObjectClass);
/* END_OF_SYMBOL_DEFINITION id_at_voPersonStatus */

/* eslint-enable */
