/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
import { id_at_clearance_rfc3281 } from '../OtherAttributes/id-at-clearance-rfc3281.va';
import {
    Clearance_rfc3281,
    _decode_Clearance_rfc3281,
    _encode_Clearance_rfc3281,
} from '../OtherImplicitlyTaggedTypes/Clearance-rfc3281.ta';
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
export { id_at_clearance_rfc3281 } from '../OtherAttributes/id-at-clearance-rfc3281.va';
export {
    Clearance_rfc3281,
    _decode_Clearance_rfc3281,
    _encode_Clearance_rfc3281,
} from '../OtherImplicitlyTaggedTypes/Clearance-rfc3281.ta';

/* START_OF_SYMBOL_DEFINITION clearance_RFC3281 */
/**
 * @summary clearance_RFC3281
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * clearance-RFC3281 ATTRIBUTE ::= {
 *     WITH SYNTAX     Clearance-rfc3281
 *     ID              id-at-clearance-rfc3281 }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<Clearance_rfc3281>}
 * @implements {ATTRIBUTE<Clearance_rfc3281>}
 */
export const clearance_RFC3281: ATTRIBUTE<Clearance_rfc3281> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_Clearance_rfc3281,
    },
    encoderFor: {
        '&Type': _encode_Clearance_rfc3281,
    },
    '&id': id_at_clearance_rfc3281 /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION clearance_RFC3281 */

/* eslint-enable */
