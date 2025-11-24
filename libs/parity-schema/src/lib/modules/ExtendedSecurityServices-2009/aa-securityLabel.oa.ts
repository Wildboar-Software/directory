/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import {
    ESSSecurityLabel,
    _decode_ESSSecurityLabel,
    _encode_ESSSecurityLabel,
} from '../ExtendedSecurityServices-2009/ESSSecurityLabel.ta';
import { id_aa_securityLabel } from '../ExtendedSecurityServices-2009/id-aa-securityLabel.va';

export {
    ESSSecurityLabel,
    _decode_ESSSecurityLabel,
    _encode_ESSSecurityLabel,
} from '../ExtendedSecurityServices-2009/ESSSecurityLabel.ta';

/* START_OF_SYMBOL_DEFINITION aa_securityLabel */
/**
 * @summary aa_securityLabel
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * aa-securityLabel ATTRIBUTE ::= {
 *     WITH SYNTAX     ESSSecurityLabel
 *     ID              id-aa-securityLabel }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<ESSSecurityLabel>}
 * @implements {ATTRIBUTE<ESSSecurityLabel>}
 */
export const aa_securityLabel: ATTRIBUTE<ESSSecurityLabel> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_ESSSecurityLabel,
    },
    encoderFor: {
        '&Type': _encode_ESSSecurityLabel,
    },
    '&id': id_aa_securityLabel /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION aa_securityLabel */

/* eslint-enable */
