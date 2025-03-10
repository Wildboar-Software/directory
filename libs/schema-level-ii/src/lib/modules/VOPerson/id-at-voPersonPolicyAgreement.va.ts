/* eslint-disable */
import {
    ObjectIdentifier as _OID
} from "asn1-ts";
import { ID } from "../VOPerson/ID.ta";
import { id_voPersonObjectClass } from "../VOPerson/id-voPersonObjectClass.va";


/* START_OF_SYMBOL_DEFINITION id_at_voPersonPolicyAgreement */
/**
 * @summary id_at_voPersonPolicyAgreement
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-voPersonPolicyAgreement       ID ::= { id-voPersonObjectClass 7 }
 * ```
 *
 * @constant
 */
export
const id_at_voPersonPolicyAgreement: ID = new _OID([
    7,
], id_voPersonObjectClass);
/* END_OF_SYMBOL_DEFINITION id_at_voPersonPolicyAgreement */

/* eslint-enable */
