/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { businessCategory } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/businessCategory.oa';
import { commonName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa';
import { description } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa';
import { member } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/member.oa';
import { organizationalUnitName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationalUnitName.oa';
import { organizationName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationName.oa';
import { owner } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/owner.oa';
import { seeAlso } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/seeAlso.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
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
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
export { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
export { businessCategory } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/businessCategory.oa';
export { commonName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa';
export { description } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa';
export { member } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/member.oa';
export { organizationalUnitName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationalUnitName.oa';
export { organizationName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationName.oa';
export { owner } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/owner.oa';
export { seeAlso } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/seeAlso.oa';

/* START_OF_SYMBOL_DEFINITION groupOfEntries */
/**
 * @summary groupOfEntries
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * groupOfEntries OBJECT-CLASS ::= {
 *     SUBCLASS OF         { top }
 *     KIND                structural
 *     MUST CONTAIN        { commonName }
 *     MAY CONTAIN         {
 *         member
 *         | businessCategory
 *         | seeAlso
 *         | owner
 *         | organizationalUnitName
 *         | organizationName
 *         | description
 *     }
 *     LDAP-NAME           { "groupOfEntries" }
 *     ID                  { 1 2 826 0 1 3458854 2 1 1 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const groupOfEntries: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [commonName] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        member,
        businessCategory,
        seeAlso,
        owner,
        organizationalUnitName,
        organizationName,
        description,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['groupOfEntries'] /* OBJECT_FIELD_SETTING */,
    '&id': new _OID([
        1, 2, 826, 0, 1, 3458854, 2, 1, 1,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION groupOfEntries */

/* eslint-enable */
