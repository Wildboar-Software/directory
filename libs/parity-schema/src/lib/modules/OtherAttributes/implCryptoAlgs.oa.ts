/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { id_aa_implCryptoAlgs } from '../OtherAttributes/id-aa-implCryptoAlgs.va';
import {
    ImplementedCryptoAlgorithms,
    _decode_ImplementedCryptoAlgorithms,
    _encode_ImplementedCryptoAlgorithms,
} from '../OtherImplicitlyTaggedTypes/ImplementedCryptoAlgorithms.ta';

/* START_OF_SYMBOL_DEFINITION implCryptoAlgs */
/**
 * @summary implCryptoAlgs
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * implCryptoAlgs ATTRIBUTE ::= {
 *     WITH SYNTAX         ImplementedCryptoAlgorithms
 *     ID                  id-aa-implCryptoAlgs }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<ImplementedCryptoAlgorithms>}
 * @implements {ATTRIBUTE<ImplementedCryptoAlgorithms>}
 */
export const implCryptoAlgs: ATTRIBUTE<ImplementedCryptoAlgorithms> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_ImplementedCryptoAlgorithms,
    },
    encoderFor: {
        '&Type': _encode_ImplementedCryptoAlgorithms,
    },
    '&id': id_aa_implCryptoAlgs /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION implCryptoAlgs */

/* eslint-enable */
