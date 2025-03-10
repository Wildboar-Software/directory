/* eslint-disable */
import {
    ObjectIdentifier as _OID,
    OBJECT_IDENTIFIER
} from "asn1-ts";
import { id_eduOrg } from "../EduOrgSchema/id-eduOrg.va";
export { id_eduOrg } from "../EduOrgSchema/id-eduOrg.va";


/* START_OF_SYMBOL_DEFINITION id_at_eduOrgIdentityAuthNPolicyURI */
/**
 * @summary id_at_eduOrgIdentityAuthNPolicyURI
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-eduOrgIdentityAuthNPolicyURI  OBJECT IDENTIFIER ::= { id-eduOrg 1 3 }
 * ```
 *
 * @constant
 */
export
const id_at_eduOrgIdentityAuthNPolicyURI: OBJECT_IDENTIFIER = new _OID([
    1,
    3,
], id_eduOrg);
/* END_OF_SYMBOL_DEFINITION id_at_eduOrgIdentityAuthNPolicyURI */

/* eslint-enable */
