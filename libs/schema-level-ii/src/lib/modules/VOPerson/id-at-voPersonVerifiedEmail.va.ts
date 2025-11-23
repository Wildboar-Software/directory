/* eslint-disable */
import {
    ObjectIdentifier as _OID
} from "@wildboar/asn1";
import { ID } from "../VOPerson/ID.ta";
import { id_voPersonObjectClass } from "../VOPerson/id-voPersonObjectClass.va";


/* START_OF_SYMBOL_DEFINITION id_at_voPersonVerifiedEmail */
/**
 * @summary id_at_voPersonVerifiedEmail
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-voPersonVerifiedEmail         ID ::= { id-voPersonObjectClass 14 }
 * ```
 *
 * @constant
 */
export
const id_at_voPersonVerifiedEmail: ID = _OID.fromParts([
    14,
], id_voPersonObjectClass);
/* END_OF_SYMBOL_DEFINITION id_at_voPersonVerifiedEmail */

/* eslint-enable */
