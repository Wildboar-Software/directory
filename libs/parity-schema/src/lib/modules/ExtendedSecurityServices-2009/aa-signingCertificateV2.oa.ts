/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { id_aa_signingCertificateV2 } from '../ExtendedSecurityServices-2009/id-aa-signingCertificateV2.va';
import {
    SigningCertificateV2,
    _decode_SigningCertificateV2,
    _encode_SigningCertificateV2,
} from '../ExtendedSecurityServices-2009/SigningCertificateV2.ta';

export {
    SigningCertificateV2,
    _decode_SigningCertificateV2,
    _encode_SigningCertificateV2,
} from '../ExtendedSecurityServices-2009/SigningCertificateV2.ta';

/* START_OF_SYMBOL_DEFINITION aa_signingCertificateV2 */
/**
 * @summary aa_signingCertificateV2
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * aa-signingCertificateV2 ATTRIBUTE ::= {
 *     WITH SYNTAX     SigningCertificateV2
 *     ID              id-aa-signingCertificateV2 }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<SigningCertificateV2>}
 * @implements {ATTRIBUTE<SigningCertificateV2>}
 */
export const aa_signingCertificateV2: ATTRIBUTE<SigningCertificateV2> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_SigningCertificateV2,
    },
    encoderFor: {
        '&Type': _encode_SigningCertificateV2,
    },
    '&id': id_aa_signingCertificateV2 /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&single-valued':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&collective':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&no-user-modification':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&usage':
        userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&obsolete': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION aa_signingCertificateV2 */

/* eslint-enable */
