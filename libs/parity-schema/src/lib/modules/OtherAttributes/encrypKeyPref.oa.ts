/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
import { id_aa_encrypKeyPref } from '../OtherAttributes/id-aa-encrypKeyPref.va';
import {
    SMIMEEncryptionKeyPreference,
    _decode_SMIMEEncryptionKeyPreference,
    _encode_SMIMEEncryptionKeyPreference,
} from '../OtherImplicitlyTaggedTypes/SMIMEEncryptionKeyPreference.ta';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export {
    AttributeUsage,
    AttributeUsage_directoryOperation /* IMPORTED_LONG_ENUMERATION_ITEM */,
    AttributeUsage_distributedOperation /* IMPORTED_LONG_ENUMERATION_ITEM */,
    AttributeUsage_dSAOperation /* IMPORTED_LONG_ENUMERATION_ITEM */,
    AttributeUsage_userApplications /* IMPORTED_LONG_ENUMERATION_ITEM */,
    directoryOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    distributedOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    dSAOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    _decode_AttributeUsage,
    _encode_AttributeUsage,
    _enum_for_AttributeUsage,
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
export { MATCHING_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca';
export { SYNTAX_NAME } from '@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca';
export { id_aa_encrypKeyPref } from '../OtherAttributes/id-aa-encrypKeyPref.va';

/* START_OF_SYMBOL_DEFINITION encrypKeyPref */
/**
 * @summary encrypKeyPref
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * encrypKeyPref ATTRIBUTE ::= {
 *     WITH SYNTAX         SMIMEEncryptionKeyPreference
 *     ID                  id-aa-encrypKeyPref }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<SMIMEEncryptionKeyPreference>}
 * @implements {ATTRIBUTE<SMIMEEncryptionKeyPreference>}
 */
export const encrypKeyPref: ATTRIBUTE<SMIMEEncryptionKeyPreference> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_SMIMEEncryptionKeyPreference,
    },
    encoderFor: {
        '&Type': _encode_SMIMEEncryptionKeyPreference,
    },
    '&id': id_aa_encrypKeyPref /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION encrypKeyPref */

/* eslint-enable */
