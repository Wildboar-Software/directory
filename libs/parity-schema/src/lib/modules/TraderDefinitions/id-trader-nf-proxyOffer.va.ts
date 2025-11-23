/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_trader_nf } from '../TraderDefinitions/id-trader-nf.va';
export { id_trader_nf } from '../TraderDefinitions/id-trader-nf.va';

/* START_OF_SYMBOL_DEFINITION id_trader_nf_proxyOffer */
/**
 * @summary id_trader_nf_proxyOffer
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-trader-nf-proxyOffer OBJECT IDENTIFIER ::= {id-trader-nf 4}
 * ```
 *
 * @constant
 */
export const id_trader_nf_proxyOffer: OBJECT_IDENTIFIER = _OID.fromParts(
    [4],
    id_trader_nf
);
/* END_OF_SYMBOL_DEFINITION id_trader_nf_proxyOffer */

/* eslint-enable */
