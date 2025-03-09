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
import { regCtrl_regToken } from "../PKIXCRMF-2009/regCtrl-regToken.oa";
export { regCtrl_regToken } from "../PKIXCRMF-2009/regCtrl-regToken.oa";
import { regCtrl_authenticator } from "../PKIXCRMF-2009/regCtrl-authenticator.oa";
export { regCtrl_authenticator } from "../PKIXCRMF-2009/regCtrl-authenticator.oa";
import { regCtrl_pkiPublicationInfo } from "../PKIXCRMF-2009/regCtrl-pkiPublicationInfo.oa";
export { regCtrl_pkiPublicationInfo } from "../PKIXCRMF-2009/regCtrl-pkiPublicationInfo.oa";
import { regCtrl_pkiArchiveOptions } from "../PKIXCRMF-2009/regCtrl-pkiArchiveOptions.oa";
export { regCtrl_pkiArchiveOptions } from "../PKIXCRMF-2009/regCtrl-pkiArchiveOptions.oa";
import { regCtrl_oldCertID } from "../PKIXCRMF-2009/regCtrl-oldCertID.oa";
export { regCtrl_oldCertID } from "../PKIXCRMF-2009/regCtrl-oldCertID.oa";
import { regCtrl_protocolEncrKey } from "../PKIXCRMF-2009/regCtrl-protocolEncrKey.oa";
export { regCtrl_protocolEncrKey } from "../PKIXCRMF-2009/regCtrl-protocolEncrKey.oa";


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
 *     regCtrl-pkiPublicationInfo | regCtrl-pkiArchiveOptions |
 *     regCtrl-oldCertID | regCtrl-protocolEncrKey, ... }
 * ```
 * 
 * @constant
 * @type {ATTRIBUTE[]}
 * 
 */
export
const RegControlSet: (ATTRIBUTE)[] = [ regCtrl_regToken, regCtrl_authenticator, regCtrl_pkiPublicationInfo, regCtrl_pkiArchiveOptions, regCtrl_oldCertID, regCtrl_protocolEncrKey, ];
/* END_OF_SYMBOL_DEFINITION RegControlSet */

/* eslint-enable */
