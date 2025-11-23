/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_regCtrl } from '../PKIXCRMF-2009/id-regCtrl.va';
export { id_regCtrl } from '../PKIXCRMF-2009/id-regCtrl.va';

/* START_OF_SYMBOL_DEFINITION id_regCtrl_pkiPublicationInfo */
/**
 * @summary id_regCtrl_pkiPublicationInfo
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-regCtrl-pkiPublicationInfo OBJECT IDENTIFIER ::= { id-regCtrl 3 }
 * ```
 *
 * @constant
 */
export const id_regCtrl_pkiPublicationInfo: OBJECT_IDENTIFIER = _OID.fromParts(
    [3],
    id_regCtrl
);
/* END_OF_SYMBOL_DEFINITION id_regCtrl_pkiPublicationInfo */

/* eslint-enable */
