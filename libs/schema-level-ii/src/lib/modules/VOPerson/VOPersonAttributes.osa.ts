/* eslint-disable */
import {
    itu_t,
    itu_r,
    ccitt,
    iso,
    joint_iso_itu_t,
    joint_iso_ccitt,
    OPTIONAL,
    BOOLEAN,
    INTEGER,
    BIT_STRING,
    OCTET_STRING,
    NULL,
    OBJECT_IDENTIFIER,
    ObjectDescriptor,
    EXTERNAL,
    REAL,
    INSTANCE_OF,
    ENUMERATED,
    EMBEDDED_PDV,
    UTF8String,
    RELATIVE_OID,
    SEQUENCE,
    SEQUENCE_OF,
    SET,
    SET_OF,
    GraphicString,
    NumericString,
    VisibleString,
    PrintableString,
    ISO646String,
    TeletexString,
    GeneralString,
    T61String,
    UniversalString,
    VideotexString,
    BMPString,
    IA5String,
    CharacterString,
    UTCTime,
    GeneralizedTime,
    TIME,
    DATE,
    TIME_OF_DAY,
    DATE_TIME,
    DURATION,
    OID_IRI,
    RELATIVE_OID_IRI,
    TRUE,
    FALSE,
    TRUE_BIT,
    FALSE_BIT,
    PLUS_INFINITY,
    MINUS_INFINITY,
    NOT_A_NUMBER,
    TYPE_IDENTIFIER,
    ABSTRACT_SYNTAX,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    ASN1Construction as _Construction,
    ASN1UniversalType as _UniversalType,
    ObjectIdentifier as _OID,
    External as _External,
    EmbeddedPDV as _PDV,
    ASN1ConstructionError as _ConstructionError,
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";
import { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
export { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
import { voPersonAffiliation } from "../VOPerson/voPersonAffiliation.oa";
export { voPersonAffiliation } from "../VOPerson/voPersonAffiliation.oa";
import { voPersonApplicationPassword } from "../VOPerson/voPersonApplicationPassword.oa";
export { voPersonApplicationPassword } from "../VOPerson/voPersonApplicationPassword.oa";
import { voPersonApplicationUID } from "../VOPerson/voPersonApplicationUID.oa";
export { voPersonApplicationUID } from "../VOPerson/voPersonApplicationUID.oa";
import { voPersonAuthorName } from "../VOPerson/voPersonAuthorName.oa";
export { voPersonAuthorName } from "../VOPerson/voPersonAuthorName.oa";
import { voPersonCertificateDN } from "../VOPerson/voPersonCertificateDN.oa";
export { voPersonCertificateDN } from "../VOPerson/voPersonCertificateDN.oa";
import { voPersonCertificateIssuerDN } from "../VOPerson/voPersonCertificateIssuerDN.oa";
export { voPersonCertificateIssuerDN } from "../VOPerson/voPersonCertificateIssuerDN.oa";
import { voPersonExternalAffiliation } from "../VOPerson/voPersonExternalAffiliation.oa";
export { voPersonExternalAffiliation } from "../VOPerson/voPersonExternalAffiliation.oa";
import { voPersonExternalID } from "../VOPerson/voPersonExternalID.oa";
export { voPersonExternalID } from "../VOPerson/voPersonExternalID.oa";
import { voPersonID } from "../VOPerson/voPersonID.oa";
export { voPersonID } from "../VOPerson/voPersonID.oa";
import { voPersonPolicyAgreement } from "../VOPerson/voPersonPolicyAgreement.oa";
export { voPersonPolicyAgreement } from "../VOPerson/voPersonPolicyAgreement.oa";
import { voPersonScopedAffiliation } from "../VOPerson/voPersonScopedAffiliation.oa";
export { voPersonScopedAffiliation } from "../VOPerson/voPersonScopedAffiliation.oa";
import { voPersonSoRID } from "../VOPerson/voPersonSoRID.oa";
export { voPersonSoRID } from "../VOPerson/voPersonSoRID.oa";
import { voPersonStatus } from "../VOPerson/voPersonStatus.oa";
export { voPersonStatus } from "../VOPerson/voPersonStatus.oa";
import { voPersonToken } from "../VOPerson/voPersonToken.oa";
export { voPersonToken } from "../VOPerson/voPersonToken.oa";
import { voPersonVerifiedEmail } from "../VOPerson/voPersonVerifiedEmail.oa";
export { voPersonVerifiedEmail } from "../VOPerson/voPersonVerifiedEmail.oa";


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
