/* eslint-disable */
import {
    ObjectIdentifier as _OID
} from "@wildboar/asn1";
import { ID } from "../VOPerson/ID.ta";
import { id_voPersonObjectClass } from "../VOPerson/id-voPersonObjectClass.va";


/* START_OF_SYMBOL_DEFINITION id_at_voPersonSoRID */
/**
 * @summary id_at_voPersonSoRID
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-voPersonSoRID                 ID ::= { id-voPersonObjectClass 8 }
 * ```
 *
 * @constant
 */
export
const id_at_voPersonSoRID: ID = _OID.fromParts([
    8,
], id_voPersonObjectClass);
/* END_OF_SYMBOL_DEFINITION id_at_voPersonSoRID */

/* eslint-enable */
