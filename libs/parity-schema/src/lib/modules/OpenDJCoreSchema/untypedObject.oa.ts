/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { commonName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa';
import { countryName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/countryName.oa';
import { dc } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/dc.oa';
import { description } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa';
import { localityName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/localityName.oa';
import { organizationalUnitName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationalUnitName.oa';
import { organizationName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationName.oa';
import { owner } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/owner.oa';
import { seeAlso } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/seeAlso.oa';
import { stateOrProvinceName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/stateOrProvinceName.oa';
import { streetAddress } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/streetAddress.oa';
import { uid } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uid.oa';
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
export { commonName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa';
export { countryName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/countryName.oa';
export { dc } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/dc.oa';
export { description } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa';
export { localityName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/localityName.oa';
export { organizationalUnitName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationalUnitName.oa';
export { organizationName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationName.oa';
export { owner } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/owner.oa';
export { seeAlso } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/seeAlso.oa';
export { stateOrProvinceName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/stateOrProvinceName.oa';
export { streetAddress } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/streetAddress.oa';
export { uid } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uid.oa';

/* START_OF_SYMBOL_DEFINITION untypedObject */
/**
 * @summary untypedObject
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * untypedObject OBJECT-CLASS ::= {
 *     SUBCLASS OF         {top}
 *     KIND                structural
 *     MAY CONTAIN         {
 *         countryName
 *         | commonName
 *         | dc
 *         | localityName
 *         | organizationName
 *         | organizationalUnitName
 *         | stateOrProvinceName
 *         | streetAddress
 *         | uid
 *         | description
 *         | owner
 *         | seeAlso
 *     }
 *     LDAP-NAME           { "untypedObject" }
 *     LDAP-DESC           "Entry of no particular type"
 *     ID                  { 1 3 6 1 4 1 26027 1 2 900 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const untypedObject: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        countryName,
        commonName,
        dc,
        localityName,
        organizationName,
        organizationalUnitName,
        stateOrProvinceName,
        streetAddress,
        uid,
        description,
        owner,
        seeAlso,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['untypedObject'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Entry of no particular type' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID([
        1, 3, 6, 1, 4, 1, 26027, 1, 2, 900,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION untypedObject */

/* eslint-enable */
