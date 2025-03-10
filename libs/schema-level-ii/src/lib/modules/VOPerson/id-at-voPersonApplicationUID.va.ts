/* eslint-disable */
import {
    ObjectIdentifier as _OID
} from "asn1-ts";
import { ID } from "../VOPerson/ID.ta";
import { id_voPersonObjectClass } from "../VOPerson/id-voPersonObjectClass.va";
export { ID, _decode_ID, _encode_ID } from "../VOPerson/ID.ta";
export { id_voPersonObjectClass } from "../VOPerson/id-voPersonObjectClass.va";


/* START_OF_SYMBOL_DEFINITION id_at_voPersonApplicationUID */
/**
 * @summary id_at_voPersonApplicationUID
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-voPersonApplicationUID        ID ::= { id-voPersonObjectClass 1 }
 * ```
 *
 * @constant
 */
export
const id_at_voPersonApplicationUID: ID = new _OID([
    1,
], id_voPersonObjectClass);
/* END_OF_SYMBOL_DEFINITION id_at_voPersonApplicationUID */

/* eslint-enable */
