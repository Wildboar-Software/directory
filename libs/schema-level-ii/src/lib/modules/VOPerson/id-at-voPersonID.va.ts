/* eslint-disable */
import {
    ObjectIdentifier as _OID
} from "asn1-ts";
import { ID } from "../VOPerson/ID.ta";
import { id_voPersonObjectClass } from "../VOPerson/id-voPersonObjectClass.va";


/* START_OF_SYMBOL_DEFINITION id_at_voPersonID */
/**
 * @summary id_at_voPersonID
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-voPersonID                    ID ::= { id-voPersonObjectClass 6 }
 * ```
 *
 * @constant
 */
export
const id_at_voPersonID: ID = new _OID([
    6,
], id_voPersonObjectClass);
/* END_OF_SYMBOL_DEFINITION id_at_voPersonID */

/* eslint-enable */
