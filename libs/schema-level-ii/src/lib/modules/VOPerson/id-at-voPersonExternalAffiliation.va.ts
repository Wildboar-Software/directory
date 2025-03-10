/* eslint-disable */
import {
    ObjectIdentifier as _OID
} from "asn1-ts";
import { ID } from "../VOPerson/ID.ta";
import { id_voPersonObjectClass } from "../VOPerson/id-voPersonObjectClass.va";


/* START_OF_SYMBOL_DEFINITION id_at_voPersonExternalAffiliation */
/**
 * @summary id_at_voPersonExternalAffiliation
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-voPersonExternalAffiliation   ID ::= { id-voPersonObjectClass 11 }
 * ```
 *
 * @constant
 */
export
const id_at_voPersonExternalAffiliation: ID = new _OID([
    11,
], id_voPersonObjectClass);
/* END_OF_SYMBOL_DEFINITION id_at_voPersonExternalAffiliation */

/* eslint-enable */
