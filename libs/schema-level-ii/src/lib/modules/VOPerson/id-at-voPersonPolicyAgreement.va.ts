/* eslint-disable */
import {
    ObjectIdentifier as _OID
} from "@wildboar/asn1";
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
const id_at_voPersonPolicyAgreement: ID = _OID.fromParts([
    7,
], id_voPersonObjectClass);
/* END_OF_SYMBOL_DEFINITION id_at_voPersonPolicyAgreement */

/* eslint-enable */
