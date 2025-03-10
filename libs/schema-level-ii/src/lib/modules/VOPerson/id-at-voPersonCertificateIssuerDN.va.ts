/* eslint-disable */
import {
    ObjectIdentifier as _OID
} from "asn1-ts";
import { ID } from "../VOPerson/ID.ta";
import { id_voPersonObjectClass } from "../VOPerson/id-voPersonObjectClass.va";


/* START_OF_SYMBOL_DEFINITION id_at_voPersonCertificateIssuerDN */
/**
 * @summary id_at_voPersonCertificateIssuerDN
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-voPersonCertificateIssuerDN   ID ::= { id-voPersonObjectClass 4 }
 * ```
 *
 * @constant
 */
export
const id_at_voPersonCertificateIssuerDN: ID = new _OID([
    4,
], id_voPersonObjectClass);
/* END_OF_SYMBOL_DEFINITION id_at_voPersonCertificateIssuerDN */

/* eslint-enable */
