/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { id_aa_encrypKeyPref } from '../OtherAttributes/id-aa-encrypKeyPref.va';
import {
    SMIMEEncryptionKeyPreference,
    _decode_SMIMEEncryptionKeyPreference,
    _encode_SMIMEEncryptionKeyPreference,
} from '../OtherImplicitlyTaggedTypes/SMIMEEncryptionKeyPreference.ta';


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
