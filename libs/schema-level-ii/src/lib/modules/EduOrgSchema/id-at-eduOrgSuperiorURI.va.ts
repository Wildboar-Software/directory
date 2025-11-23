/* eslint-disable */
import {
    ObjectIdentifier as _OID,
    OBJECT_IDENTIFIER
} from "@wildboar/asn1";
import { id_eduOrg } from "../EduOrgSchema/id-eduOrg.va";


/* START_OF_SYMBOL_DEFINITION id_at_eduOrgSuperiorURI */
/**
 * @summary id_at_eduOrgSuperiorURI
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-eduOrgSuperiorURI             OBJECT IDENTIFIER ::= { id-eduOrg 1 5 }
 * ```
 *
 * @constant
 */
export
const id_at_eduOrgSuperiorURI: OBJECT_IDENTIFIER = _OID.fromParts([
    1,
    5,
], id_eduOrg);
/* END_OF_SYMBOL_DEFINITION id_at_eduOrgSuperiorURI */

/* eslint-enable */
