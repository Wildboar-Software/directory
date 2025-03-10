/* eslint-disable */
import {
    ObjectIdentifier as _OID
} from "asn1-ts";
import { ID } from "../VOPerson/ID.ta";
import { id_geant } from "../VOPerson/id-geant.va";


/* START_OF_SYMBOL_DEFINITION id_voPersonRoot */
/**
 * @summary id_voPersonRoot
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-voPersonRoot                     ID ::= {id-geant 4}
 * ```
 *
 * @constant
 */
export
const id_voPersonRoot: ID = new _OID([
    4,
], id_geant);
/* END_OF_SYMBOL_DEFINITION id_voPersonRoot */

/* eslint-enable */
