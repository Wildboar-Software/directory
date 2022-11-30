/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
import { id_aa_decryptKeyID } from '../OtherAttributes/id-aa-decryptKeyID.va';
import {
    DecryptKeyIdentifier,
    _decode_DecryptKeyIdentifier,
    _encode_DecryptKeyIdentifier,
} from '../OtherImplicitlyTaggedTypes/DecryptKeyIdentifier.ta';

/* START_OF_SYMBOL_DEFINITION decryptKeyID */
/**
 * @summary decryptKeyID
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * decryptKeyID ATTRIBUTE ::= {
 *     WITH SYNTAX         DecryptKeyIdentifier
 *     ID                  id-aa-decryptKeyID }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<DecryptKeyIdentifier>}
 * @implements {ATTRIBUTE<DecryptKeyIdentifier>}
 */
export const decryptKeyID: ATTRIBUTE<DecryptKeyIdentifier> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_DecryptKeyIdentifier,
    },
    encoderFor: {
        '&Type': _encode_DecryptKeyIdentifier,
    },
    '&id': id_aa_decryptKeyID /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION decryptKeyID */

/* eslint-enable */
