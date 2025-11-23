/* eslint-disable */
import {
    ObjectIdentifier as _OID
} from "@wildboar/asn1";
import { ID } from "../VOPerson/ID.ta";
import { id_voPersonObjectClass } from "../VOPerson/id-voPersonObjectClass.va";


/* START_OF_SYMBOL_DEFINITION id_at_voPersonAuthorName */
/**
 * @summary id_at_voPersonAuthorName
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-voPersonAuthorName            ID ::= { id-voPersonObjectClass 2 }
 * ```
 *
 * @constant
 */
export
const id_at_voPersonAuthorName: ID = _OID.fromParts([
    2,
], id_voPersonObjectClass);
/* END_OF_SYMBOL_DEFINITION id_at_voPersonAuthorName */

/* eslint-enable */
