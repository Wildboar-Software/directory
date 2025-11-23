/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { sambaBoolOption } from '../SambaV3Schema/sambaBoolOption.oa';
import { sambaIntegerOption } from '../SambaV3Schema/sambaIntegerOption.oa';
import { sambaOptionName } from '../SambaV3Schema/sambaOptionName.oa';
import { sambaStringListOption } from '../SambaV3Schema/sambaStringListOption.oa';
import { sambaStringOption } from '../SambaV3Schema/sambaStringOption.oa';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
export {
    abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    ObjectClassKind,
    ObjectClassKind_abstract /* IMPORTED_LONG_ENUMERATION_ITEM */,
    ObjectClassKind_auxiliary /* IMPORTED_LONG_ENUMERATION_ITEM */,
    ObjectClassKind_structural /* IMPORTED_LONG_ENUMERATION_ITEM */,
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    _decode_ObjectClassKind,
    _encode_ObjectClassKind,
    _enum_for_ObjectClassKind,
} from '@wildboar/x500/InformationFramework';
export { top } from '@wildboar/x500/InformationFramework';
export { description } from '@wildboar/x500/SelectedAttributeTypes';
export { sambaBoolOption } from '../SambaV3Schema/sambaBoolOption.oa';
export { sambaIntegerOption } from '../SambaV3Schema/sambaIntegerOption.oa';
export { sambaOptionName } from '../SambaV3Schema/sambaOptionName.oa';
export { sambaStringListOption } from '../SambaV3Schema/sambaStringListOption.oa';
export { sambaStringOption } from '../SambaV3Schema/sambaStringOption.oa';

/* START_OF_SYMBOL_DEFINITION sambaConfigOption */
/**
 * @summary sambaConfigOption
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * sambaConfigOption OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            structural
 *     MUST CONTAIN    {sambaOptionName}
 *     MAY CONTAIN     {sambaBoolOption | sambaIntegerOption | sambaStringListOption | sambaStringOption | description}
 *     LDAP-NAME       {"sambaConfigOption"}
 *     LDAP-DESC       "Samba Configuration Option"
 *     ID              { 1 3 6 1 4 1 7165 2 2 12 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const sambaConfigOption: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [sambaOptionName] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        sambaBoolOption,
        sambaIntegerOption,
        sambaStringListOption,
        sambaStringOption,
        description,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['sambaConfigOption'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Samba Configuration Option' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 7165, 2, 2, 12,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION sambaConfigOption */

/* eslint-enable */
