/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_ac } from '../IN-CS3-object-identifiers/id-ac.va';
export { id_ac } from '../IN-CS3-object-identifiers/id-ac.va';

/* START_OF_SYMBOL_DEFINITION id_ac_trafficFlowControlAC */
/**
 * @summary id_ac_trafficFlowControlAC
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-ac-trafficFlowControlAC OBJECT IDENTIFIER ::= {id-ac trafficFlowControlAC(28) version1(0)}
 * ```
 *
 * @constant
 */
export const id_ac_trafficFlowControlAC: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* trafficFlowControlAC */ 28, /* version1 */ 0],
    id_ac
);
/* END_OF_SYMBOL_DEFINITION id_ac_trafficFlowControlAC */

/* eslint-enable */
