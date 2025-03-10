/* eslint-disable */
import {
    ObjectIdentifier as _OID
} from "asn1-ts";
import { ID } from "../VOPerson/ID.ta";
import { id_voPersonObjectClass } from "../VOPerson/id-voPersonObjectClass.va";


/* START_OF_SYMBOL_DEFINITION id_at_voPersonAffiliation */
/**
 * @summary id_at_voPersonAffiliation
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-voPersonAffiliation           ID ::= { id-voPersonObjectClass 10 }
 * ```
 *
 * @constant
 */
export
const id_at_voPersonAffiliation: ID = new _OID([
    10,
], id_voPersonObjectClass);
/* END_OF_SYMBOL_DEFINITION id_at_voPersonAffiliation */

/* eslint-enable */
