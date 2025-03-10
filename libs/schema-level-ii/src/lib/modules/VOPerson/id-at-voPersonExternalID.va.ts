/* eslint-disable */
import {
    ObjectIdentifier as _OID
} from "asn1-ts";
import { ID } from "../VOPerson/ID.ta";
import { id_voPersonObjectClass } from "../VOPerson/id-voPersonObjectClass.va";
export { ID, _decode_ID, _encode_ID } from "../VOPerson/ID.ta";
export { id_voPersonObjectClass } from "../VOPerson/id-voPersonObjectClass.va";


/* START_OF_SYMBOL_DEFINITION id_at_voPersonExternalID */
/**
 * @summary id_at_voPersonExternalID
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-voPersonExternalID            ID ::= { id-voPersonObjectClass 5 }
 * ```
 *
 * @constant
 */
export
const id_at_voPersonExternalID: ID = new _OID([
    5,
], id_voPersonObjectClass);
/* END_OF_SYMBOL_DEFINITION id_at_voPersonExternalID */

/* eslint-enable */
