/* eslint-disable */
import { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
import { regInfo_certReq } from "../PKIXCRMF-2009/regInfo-certReq.oa";
import { regInfo_utf8Pairs } from "../PKIXCRMF-2009/regInfo-utf8Pairs.oa";
export { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
export { regInfo_certReq } from "../PKIXCRMF-2009/regInfo-certReq.oa";
export { regInfo_utf8Pairs } from "../PKIXCRMF-2009/regInfo-utf8Pairs.oa";


/* START_OF_SYMBOL_DEFINITION RegInfoSet */
/**
 * @summary RegInfoSet
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * RegInfoSet ATTRIBUTE ::= { regInfo-utf8Pairs | regInfo-certReq }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE[]}
 *
 */
export
const RegInfoSet: (ATTRIBUTE)[] = [ regInfo_utf8Pairs, regInfo_certReq, ];
/* END_OF_SYMBOL_DEFINITION RegInfoSet */

/* eslint-enable */
