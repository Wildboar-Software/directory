/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
import { id_aa_implCompressAlgs } from '../OtherAttributes/id-aa-implCompressAlgs.va';
import {
    ImplementedCompressAlgorithms,
    _decode_ImplementedCompressAlgorithms,
    _encode_ImplementedCompressAlgorithms,
} from '../OtherImplicitlyTaggedTypes/ImplementedCompressAlgorithms.ta';

/* START_OF_SYMBOL_DEFINITION implCompressAlgs */
/**
 * @summary implCompressAlgs
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * implCompressAlgs ATTRIBUTE ::= {
 *     WITH SYNTAX         ImplementedCompressAlgorithms
 *     ID                  id-aa-implCompressAlgs }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<ImplementedCompressAlgorithms>}
 * @implements {ATTRIBUTE<ImplementedCompressAlgorithms>}
 */
export const implCompressAlgs: ATTRIBUTE<ImplementedCompressAlgorithms> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_ImplementedCompressAlgorithms,
    },
    encoderFor: {
        '&Type': _encode_ImplementedCompressAlgorithms,
    },
    '&id': id_aa_implCompressAlgs /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION implCompressAlgs */

/* eslint-enable */
