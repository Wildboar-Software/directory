/* eslint-disable */
import {
    ObjectIdentifier as _OID,
    OBJECT_IDENTIFIER
} from "asn1-ts";
import { id_eduOrg } from "../EduOrgSchema/id-eduOrg.va";
export { id_eduOrg } from "../EduOrgSchema/id-eduOrg.va";


/* START_OF_SYMBOL_DEFINITION id_at_eduOrgHomePageURI */
/**
 * @summary id_at_eduOrgHomePageURI
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-eduOrgHomePageURI             OBJECT IDENTIFIER ::= { id-eduOrg 1 2 }
 * ```
 *
 * @constant
 */
export
const id_at_eduOrgHomePageURI: OBJECT_IDENTIFIER = new _OID([
    1,
    2,
], id_eduOrg);
/* END_OF_SYMBOL_DEFINITION id_at_eduOrgHomePageURI */

/* eslint-enable */
