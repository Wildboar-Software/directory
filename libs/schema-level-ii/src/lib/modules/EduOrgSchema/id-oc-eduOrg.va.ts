/* eslint-disable */
import {
    ObjectIdentifier as _OID,
    OBJECT_IDENTIFIER
} from "asn1-ts";
import { id_eduOrg } from "../EduOrgSchema/id-eduOrg.va";


/* START_OF_SYMBOL_DEFINITION id_oc_eduOrg */
/**
 * @summary id_oc_eduOrg
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-oc-eduOrg                        OBJECT IDENTIFIER ::= { id-eduOrg 2 }
 * ```
 *
 * @constant
 */
export
const id_oc_eduOrg: OBJECT_IDENTIFIER = new _OID([
    2,
], id_eduOrg);
/* END_OF_SYMBOL_DEFINITION id_oc_eduOrg */

/* eslint-enable */
