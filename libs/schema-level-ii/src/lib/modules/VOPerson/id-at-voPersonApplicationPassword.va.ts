/* eslint-disable */
import {
    ObjectIdentifier as _OID
} from "@wildboar/asn1";
import { ID } from "../VOPerson/ID.ta";
import { id_voPersonObjectClass } from "../VOPerson/id-voPersonObjectClass.va";


/* START_OF_SYMBOL_DEFINITION id_at_voPersonApplicationPassword */
/**
 * @summary id_at_voPersonApplicationPassword
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-voPersonApplicationPassword   ID ::= { id-voPersonObjectClass 13 }
 * ```
 *
 * @constant
 */
export
const id_at_voPersonApplicationPassword: ID = _OID.fromParts([
    13,
], id_voPersonObjectClass);
/* END_OF_SYMBOL_DEFINITION id_at_voPersonApplicationPassword */

/* eslint-enable */
