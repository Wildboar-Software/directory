/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_trader_nf } from '../TraderDefinitions/id-trader-nf.va';

/* START_OF_SYMBOL_DEFINITION id_trader_nf_serviceOffer */
/**
 * @summary id_trader_nf_serviceOffer
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-trader-nf-serviceOffer OBJECT IDENTIFIER ::= {id-trader-nf 1}
 * ```
 *
 * @constant
 */
export const id_trader_nf_serviceOffer: OBJECT_IDENTIFIER = _OID.fromParts(
    [1],
    id_trader_nf
);
/* END_OF_SYMBOL_DEFINITION id_trader_nf_serviceOffer */

/* eslint-enable */
