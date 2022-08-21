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
import { aa_receiptRequest } from "../ExtendedSecurityServices-2009/aa-receiptRequest.oa";
export { aa_receiptRequest } from "../ExtendedSecurityServices-2009/aa-receiptRequest.oa";
import { aa_contentIdentifier } from "../ExtendedSecurityServices-2009/aa-contentIdentifier.oa";
export { aa_contentIdentifier } from "../ExtendedSecurityServices-2009/aa-contentIdentifier.oa";
import { aa_contentHint } from "../ExtendedSecurityServices-2009/aa-contentHint.oa";
export { aa_contentHint } from "../ExtendedSecurityServices-2009/aa-contentHint.oa";
import { aa_msgSigDigest } from "../ExtendedSecurityServices-2009/aa-msgSigDigest.oa";
export { aa_msgSigDigest } from "../ExtendedSecurityServices-2009/aa-msgSigDigest.oa";
import { aa_contentReference } from "../ExtendedSecurityServices-2009/aa-contentReference.oa";
export { aa_contentReference } from "../ExtendedSecurityServices-2009/aa-contentReference.oa";
import { aa_securityLabel } from "../ExtendedSecurityServices-2009/aa-securityLabel.oa";
export { aa_securityLabel } from "../ExtendedSecurityServices-2009/aa-securityLabel.oa";
import { aa_equivalentLabels } from "../ExtendedSecurityServices-2009/aa-equivalentLabels.oa";
export { aa_equivalentLabels } from "../ExtendedSecurityServices-2009/aa-equivalentLabels.oa";
import { aa_mlExpandHistory } from "../ExtendedSecurityServices-2009/aa-mlExpandHistory.oa";
export { aa_mlExpandHistory } from "../ExtendedSecurityServices-2009/aa-mlExpandHistory.oa";
import { aa_signingCertificate } from "../ExtendedSecurityServices-2009/aa-signingCertificate.oa";
export { aa_signingCertificate } from "../ExtendedSecurityServices-2009/aa-signingCertificate.oa";
import { aa_signingCertificateV2 } from "../ExtendedSecurityServices-2009/aa-signingCertificateV2.oa";
export { aa_signingCertificateV2 } from "../ExtendedSecurityServices-2009/aa-signingCertificateV2.oa";


/* START_OF_SYMBOL_DEFINITION EssSignedAttributes */
/**
 * @summary EssSignedAttributes
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * EssSignedAttributes ATTRIBUTE ::= {
 *     aa-receiptRequest | aa-contentIdentifier | aa-contentHint |
 *     aa-msgSigDigest | aa-contentReference | aa-securityLabel |
 *     aa-equivalentLabels | aa-mlExpandHistory | aa-signingCertificate |
 *     aa-signingCertificateV2, ... }
 * ```
 * 
 * @constant
 * @type {ATTRIBUTE[]}
 * 
 */
export
const EssSignedAttributes: (ATTRIBUTE)[] = [ aa_receiptRequest, aa_contentIdentifier, aa_contentHint, aa_msgSigDigest, aa_contentReference, aa_securityLabel, aa_equivalentLabels, aa_mlExpandHistory, aa_signingCertificate, aa_signingCertificateV2, ];
/* END_OF_SYMBOL_DEFINITION EssSignedAttributes */

/* eslint-enable */
