/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { description } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { displayName } from '../InetOrgPerson/displayName.oa';
import { gidNumber } from '../NIS/gidNumber.oa';
import { sambaGroupType } from '../SambaV3Schema/sambaGroupType.oa';
import { sambaSID } from '../SambaV3Schema/sambaSID.oa';
import { sambaSIDList } from '../SambaV3Schema/sambaSIDList.oa';
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
export { description } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa';
export { displayName } from '../InetOrgPerson/displayName.oa';
export { gidNumber } from '../NIS/gidNumber.oa';
export { sambaGroupType } from '../SambaV3Schema/sambaGroupType.oa';
export { sambaSID } from '../SambaV3Schema/sambaSID.oa';
export { sambaSIDList } from '../SambaV3Schema/sambaSIDList.oa';

/* START_OF_SYMBOL_DEFINITION sambaGroupMapping */
/**
 * @summary sambaGroupMapping
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * sambaGroupMapping OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            auxiliary
 *     MUST CONTAIN    {gidNumber | sambaGroupType | sambaSID}
 *     MAY CONTAIN     {description | displayName | sambaSIDList}
 *     LDAP-NAME       {"sambaGroupMapping"}
 *     LDAP-DESC       "Samba Group Mapping"
 *     ID              { 1 3 6 1 4 1 7165 2 2 4 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const sambaGroupMapping: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        gidNumber,
        sambaGroupType,
        sambaSID,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        description,
        displayName,
        sambaSIDList,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['sambaGroupMapping'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Samba Group Mapping' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID([
        1, 3, 6, 1, 4, 1, 7165, 2, 2, 4,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION sambaGroupMapping */

/* eslint-enable */
