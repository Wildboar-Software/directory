/* eslint-disable */
import type { ATTRIBUTE } from "@wildboar/x500/InformationFramework";
import { voPersonAffiliation } from "../VOPerson/voPersonAffiliation.oa.mjs";
import { voPersonApplicationPassword } from "../VOPerson/voPersonApplicationPassword.oa.mjs";
import { voPersonApplicationUID } from "../VOPerson/voPersonApplicationUID.oa.mjs";
import { voPersonAuthorName } from "../VOPerson/voPersonAuthorName.oa.mjs";
import { voPersonCertificateDN } from "../VOPerson/voPersonCertificateDN.oa.mjs";
import { voPersonCertificateIssuerDN } from "../VOPerson/voPersonCertificateIssuerDN.oa.mjs";
import { voPersonExternalAffiliation } from "../VOPerson/voPersonExternalAffiliation.oa.mjs";
import { voPersonExternalID } from "../VOPerson/voPersonExternalID.oa.mjs";
import { voPersonID } from "../VOPerson/voPersonID.oa.mjs";
import { voPersonPolicyAgreement } from "../VOPerson/voPersonPolicyAgreement.oa.mjs";
import { voPersonScopedAffiliation } from "../VOPerson/voPersonScopedAffiliation.oa.mjs";
import { voPersonSoRID } from "../VOPerson/voPersonSoRID.oa.mjs";
import { voPersonStatus } from "../VOPerson/voPersonStatus.oa.mjs";
import { voPersonToken } from "../VOPerson/voPersonToken.oa.mjs";
import { voPersonVerifiedEmail } from "../VOPerson/voPersonVerifiedEmail.oa.mjs";








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
