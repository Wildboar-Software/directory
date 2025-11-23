/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import { regCtrl_authenticator } from '../PKIXCRMF-2009/regCtrl-authenticator.oa';
import { regCtrl_oldCertID } from '../PKIXCRMF-2009/regCtrl-oldCertID.oa';
import { regCtrl_pkiArchiveOptions } from '../PKIXCRMF-2009/regCtrl-pkiArchiveOptions.oa';
import { regCtrl_pkiPublicationInfo } from '../PKIXCRMF-2009/regCtrl-pkiPublicationInfo.oa';
import { regCtrl_protocolEncrKey } from '../PKIXCRMF-2009/regCtrl-protocolEncrKey.oa';
import { regCtrl_regToken } from '../PKIXCRMF-2009/regCtrl-regToken.oa';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export { regCtrl_authenticator } from '../PKIXCRMF-2009/regCtrl-authenticator.oa';
export { regCtrl_oldCertID } from '../PKIXCRMF-2009/regCtrl-oldCertID.oa';
export { regCtrl_pkiArchiveOptions } from '../PKIXCRMF-2009/regCtrl-pkiArchiveOptions.oa';
export { regCtrl_pkiPublicationInfo } from '../PKIXCRMF-2009/regCtrl-pkiPublicationInfo.oa';
export { regCtrl_protocolEncrKey } from '../PKIXCRMF-2009/regCtrl-protocolEncrKey.oa';
export { regCtrl_regToken } from '../PKIXCRMF-2009/regCtrl-regToken.oa';

/* START_OF_SYMBOL_DEFINITION RegControlSet */
/**
 * @summary RegControlSet
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * RegControlSet ATTRIBUTE ::= {
 *     regCtrl-regToken | regCtrl-authenticator |
 *
 *     regCtrl-pkiPublicationInfo | regCtrl-pkiArchiveOptions |
 *     regCtrl-oldCertID | regCtrl-protocolEncrKey, ... }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE[]}
 *
 */
export const RegControlSet: ATTRIBUTE[] = [
    regCtrl_regToken,
    regCtrl_authenticator,
    regCtrl_pkiPublicationInfo,
    regCtrl_pkiArchiveOptions,
    regCtrl_oldCertID,
    regCtrl_protocolEncrKey,
];
/* END_OF_SYMBOL_DEFINITION RegControlSet */

/* eslint-enable */
