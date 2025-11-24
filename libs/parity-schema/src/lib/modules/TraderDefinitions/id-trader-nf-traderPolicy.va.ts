/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_trader_nf } from '../TraderDefinitions/id-trader-nf.va';

/* START_OF_SYMBOL_DEFINITION id_trader_nf_traderPolicy */
/**
 * @summary id_trader_nf_traderPolicy
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-trader-nf-traderPolicy OBJECT IDENTIFIER ::= {id-trader-nf 3}
 * ```
 *
 * @constant
 */
export const id_trader_nf_traderPolicy: OBJECT_IDENTIFIER = _OID.fromParts(
    [3],
    id_trader_nf
);
/* END_OF_SYMBOL_DEFINITION id_trader_nf_traderPolicy */

/* eslint-enable */
