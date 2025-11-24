/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import {
    BiometricInformationTemplateorPointer,
    _decode_BiometricInformationTemplateorPointer,
    _encode_BiometricInformationTemplateorPointer,
} from '../TAI/BiometricInformationTemplateorPointer.ta';
import { id_tai_at_BiometricInformationTemplate } from '../TAI/id-tai-at-BiometricInformationTemplate.va';

/* START_OF_SYMBOL_DEFINITION biometricInformationTemplate */
/**
 * @summary biometricInformationTemplate
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * biometricInformationTemplate ATTRIBUTE ::= {
 *   WITH SYNTAX  BiometricInformationTemplateorPointer
 *   ID           id-tai-at-BiometricInformationTemplate
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<BiometricInformationTemplateorPointer>}
 * @implements {ATTRIBUTE<BiometricInformationTemplateorPointer>}
 */
export const biometricInformationTemplate: ATTRIBUTE<BiometricInformationTemplateorPointer> =
    {
        class: 'ATTRIBUTE',
        decoderFor: {
            '&Type': _decode_BiometricInformationTemplateorPointer,
        },
        encoderFor: {
            '&Type': _encode_BiometricInformationTemplateorPointer,
        },
        '&id': id_tai_at_BiometricInformationTemplate /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
        '&Type':
            0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
        '&single-valued':
            false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
        '&collective':
            false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
        '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
        '&no-user-modification':
            false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
        '&usage':
            userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
        '&obsolete':
            false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    };
/* END_OF_SYMBOL_DEFINITION biometricInformationTemplate */

/* eslint-enable */
