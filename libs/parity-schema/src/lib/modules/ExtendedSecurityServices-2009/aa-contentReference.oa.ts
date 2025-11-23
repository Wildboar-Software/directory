/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import {
    ContentReference,
    _decode_ContentReference,
    _encode_ContentReference,
} from '../ExtendedSecurityServices-2009/ContentReference.ta';
import { id_aa_contentReference } from '../ExtendedSecurityServices-2009/id-aa-contentReference.va';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
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
} from '@wildboar/x500/InformationFramework';
export { MATCHING_RULE } from '@wildboar/x500/InformationFramework';
export { SYNTAX_NAME } from '@wildboar/x500/InformationFramework';
export {
    ContentReference,
    _decode_ContentReference,
    _encode_ContentReference,
} from '../ExtendedSecurityServices-2009/ContentReference.ta';
export { id_aa_contentReference } from '../ExtendedSecurityServices-2009/id-aa-contentReference.va';

/* START_OF_SYMBOL_DEFINITION aa_contentReference */
/**
 * @summary aa_contentReference
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * aa-contentReference ATTRIBUTE ::= {
 *     WITH SYNTAX     ContentReference
 *     ID              id-aa-contentReference }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<ContentReference>}
 * @implements {ATTRIBUTE<ContentReference>}
 */
export const aa_contentReference: ATTRIBUTE<ContentReference> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_ContentReference,
    },
    encoderFor: {
        '&Type': _encode_ContentReference,
    },
    '&id': id_aa_contentReference /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION aa_contentReference */

/* eslint-enable */
