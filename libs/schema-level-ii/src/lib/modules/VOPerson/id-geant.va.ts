/* eslint-disable */
import {
    ObjectIdentifier as _OID
} from "@wildboar/asn1";
import { ID } from "../VOPerson/ID.ta";
import { pen_geant } from "./pen-geant.va";


/* START_OF_SYMBOL_DEFINITION id_geant */
/**
 * @summary id_geant
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-geant                            ID ::= {id-pen pen-geant}
 * ```
 *
 * @constant
 */
export
const id_geant: ID = _OID.fromParts([ 1,3,6,1,4,1, pen_geant ]);
/* END_OF_SYMBOL_DEFINITION id_geant */

/* eslint-enable */
