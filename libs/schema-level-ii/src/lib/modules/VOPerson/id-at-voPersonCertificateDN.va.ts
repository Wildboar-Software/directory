/* eslint-disable */
import {
    ObjectIdentifier as _OID
} from "asn1-ts";
import { ID } from "../VOPerson/ID.ta";
import { id_voPersonObjectClass } from "../VOPerson/id-voPersonObjectClass.va";
export { ID, _decode_ID, _encode_ID } from "../VOPerson/ID.ta";
export { id_voPersonObjectClass } from "../VOPerson/id-voPersonObjectClass.va";


/* START_OF_SYMBOL_DEFINITION id_at_voPersonCertificateDN */
/**
 * @summary id_at_voPersonCertificateDN
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-voPersonCertificateDN         ID ::= { id-voPersonObjectClass 3 }
 * ```
 *
 * @constant
 */
export
const id_at_voPersonCertificateDN: ID = new _OID([
    3,
], id_voPersonObjectClass);
/* END_OF_SYMBOL_DEFINITION id_at_voPersonCertificateDN */

/* eslint-enable */
