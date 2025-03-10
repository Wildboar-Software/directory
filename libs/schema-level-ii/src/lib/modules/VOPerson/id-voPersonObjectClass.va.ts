/* eslint-disable */
import {
    ObjectIdentifier as _OID
} from "asn1-ts";
import { ID } from "../VOPerson/ID.ta";
import { id_voPersonRoot } from "../VOPerson/id-voPersonRoot.va";
export { ID, _decode_ID, _encode_ID } from "../VOPerson/ID.ta";
export { id_voPersonRoot } from "../VOPerson/id-voPersonRoot.va";


/* START_OF_SYMBOL_DEFINITION id_voPersonObjectClass */
/**
 * @summary id_voPersonObjectClass
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-voPersonObjectClass              ID ::= {id-voPersonRoot 1}
 * ```
 *
 * @constant
 */
export
const id_voPersonObjectClass: ID = new _OID([
    1,
], id_voPersonRoot);
/* END_OF_SYMBOL_DEFINITION id_voPersonObjectClass */

/* eslint-enable */
