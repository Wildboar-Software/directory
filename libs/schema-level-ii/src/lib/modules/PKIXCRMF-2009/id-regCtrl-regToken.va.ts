/* eslint-disable */
import {
    ObjectIdentifier as _OID,
    OBJECT_IDENTIFIER
} from "asn1-ts";
import { id_regCtrl } from "../PKIXCRMF-2009/id-regCtrl.va";
export { id_regCtrl } from "../PKIXCRMF-2009/id-regCtrl.va";


/* START_OF_SYMBOL_DEFINITION id_regCtrl_regToken */
/**
 * @summary id_regCtrl_regToken
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-regCtrl-regToken OBJECT IDENTIFIER ::= { id-regCtrl 1 }
 * ```
 *
 * @constant
 */
export
const id_regCtrl_regToken: OBJECT_IDENTIFIER = new _OID([
    1,
], id_regCtrl);
/* END_OF_SYMBOL_DEFINITION id_regCtrl_regToken */

/* eslint-enable */
