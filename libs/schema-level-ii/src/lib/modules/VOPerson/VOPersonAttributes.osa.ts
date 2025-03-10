/* eslint-disable */
import { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
import { voPersonAffiliation } from "../VOPerson/voPersonAffiliation.oa";
import { voPersonApplicationPassword } from "../VOPerson/voPersonApplicationPassword.oa";
import { voPersonApplicationUID } from "../VOPerson/voPersonApplicationUID.oa";
import { voPersonAuthorName } from "../VOPerson/voPersonAuthorName.oa";
import { voPersonCertificateDN } from "../VOPerson/voPersonCertificateDN.oa";
import { voPersonCertificateIssuerDN } from "../VOPerson/voPersonCertificateIssuerDN.oa";
import { voPersonExternalAffiliation } from "../VOPerson/voPersonExternalAffiliation.oa";
import { voPersonExternalID } from "../VOPerson/voPersonExternalID.oa";
import { voPersonID } from "../VOPerson/voPersonID.oa";
import { voPersonPolicyAgreement } from "../VOPerson/voPersonPolicyAgreement.oa";
import { voPersonScopedAffiliation } from "../VOPerson/voPersonScopedAffiliation.oa";
import { voPersonSoRID } from "../VOPerson/voPersonSoRID.oa";
import { voPersonStatus } from "../VOPerson/voPersonStatus.oa";
import { voPersonToken } from "../VOPerson/voPersonToken.oa";
import { voPersonVerifiedEmail } from "../VOPerson/voPersonVerifiedEmail.oa";








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
