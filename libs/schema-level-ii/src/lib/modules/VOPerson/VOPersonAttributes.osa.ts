/* eslint-disable */
import type { ATTRIBUTE } from "@wildboar/x500/InformationFramework";
import { voPersonAffiliation } from "../VOPerson/voPersonAffiliation.oa.js";
import { voPersonApplicationPassword } from "../VOPerson/voPersonApplicationPassword.oa.js";
import { voPersonApplicationUID } from "../VOPerson/voPersonApplicationUID.oa.js";
import { voPersonAuthorName } from "../VOPerson/voPersonAuthorName.oa.js";
import { voPersonCertificateDN } from "../VOPerson/voPersonCertificateDN.oa.js";
import { voPersonCertificateIssuerDN } from "../VOPerson/voPersonCertificateIssuerDN.oa.js";
import { voPersonExternalAffiliation } from "../VOPerson/voPersonExternalAffiliation.oa.js";
import { voPersonExternalID } from "../VOPerson/voPersonExternalID.oa.js";
import { voPersonID } from "../VOPerson/voPersonID.oa.js";
import { voPersonPolicyAgreement } from "../VOPerson/voPersonPolicyAgreement.oa.js";
import { voPersonScopedAffiliation } from "../VOPerson/voPersonScopedAffiliation.oa.js";
import { voPersonSoRID } from "../VOPerson/voPersonSoRID.oa.js";
import { voPersonStatus } from "../VOPerson/voPersonStatus.oa.js";
import { voPersonToken } from "../VOPerson/voPersonToken.oa.js";
import { voPersonVerifiedEmail } from "../VOPerson/voPersonVerifiedEmail.oa.js";








/* START_OF_SYMBOL_DEFINITION VOPersonAttributes */
/**
 * @summary VOPersonAttributes
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * VOPersonAttributes ATTRIBUTE ::= {
 *     voPersonAffiliation
 *     | voPersonApplicationPassword
 *     | voPersonApplicationUID
 *     | voPersonAuthorName
 *     | voPersonCertificateDN
 *     | voPersonCertificateIssuerDN
 *     | voPersonExternalAffiliation
 *     | voPersonExternalID
 *     | voPersonID
 *     | voPersonPolicyAgreement
 *     | voPersonScopedAffiliation
 *     | voPersonSoRID
 *     | voPersonStatus
 *     | voPersonToken
 *     | voPersonVerifiedEmail,
 *     ...
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE[]}
 *
 */
export
const VOPersonAttributes: (ATTRIBUTE)[] = [ voPersonAffiliation, voPersonApplicationPassword, voPersonApplicationUID, voPersonAuthorName, voPersonCertificateDN, voPersonCertificateIssuerDN, voPersonExternalAffiliation, voPersonExternalID, voPersonID, voPersonPolicyAgreement, voPersonScopedAffiliation, voPersonSoRID, voPersonStatus, voPersonToken, voPersonVerifiedEmail, ];
/* END_OF_SYMBOL_DEFINITION VOPersonAttributes */

/* eslint-enable */
