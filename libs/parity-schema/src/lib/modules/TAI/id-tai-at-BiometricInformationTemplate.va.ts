/* eslint-disable */
import { iso, ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';

/* START_OF_SYMBOL_DEFINITION id_tai_at_BiometricInformationTemplate */
/**
 * @summary id_tai_at_BiometricInformationTemplate
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-tai-at-BiometricInformationTemplate OBJECT IDENTIFIER ::= {iso registration-authority cbeff(19785) biometric-organization(0)
 *    jtc1-sc37(257) patronformat(1) tlv-encoded(5)}
 * ```
 *
 * @constant
 */
export const id_tai_at_BiometricInformationTemplate: OBJECT_IDENTIFIER =
    _OID.fromParts(
        [
            1, 1, /* cbeff */ 19785, /* biometric-organization */ 0,
            /* jtc1-sc37 */ 257, /* patronformat */ 1, /* tlv-encoded */ 5,
        ],
        iso
    );
/* END_OF_SYMBOL_DEFINITION id_tai_at_BiometricInformationTemplate */

/* eslint-enable */
