/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { organization } from '@wildboar/x500/src/lib/modules/SelectedObjectClasses/organization.oa';
import { organizationalUnit } from '@wildboar/x500/src/lib/modules/SelectedObjectClasses/organizationalUnit.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { buildingName } from '../Cosine/buildingName.oa';
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
export { organization } from '@wildboar/x500/src/lib/modules/SelectedObjectClasses/organization.oa';
export { organizationalUnit } from '@wildboar/x500/src/lib/modules/SelectedObjectClasses/organizationalUnit.oa';
export { buildingName } from '../Cosine/buildingName.oa';

/* START_OF_SYMBOL_DEFINITION pilotOrganization */
/**
 * @summary pilotOrganization
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * pilotOrganization OBJECT-CLASS ::= {
 *     SUBCLASS OF         { organization | organizationalUnit }
 *     KIND                structural
 *     MAY CONTAIN         { buildingName }
 *     LDAP-NAME           { "pilotOrganization" }
 *     ID                  { 0 9 2342 19200300 100 4 20 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const pilotOrganization: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [
        organization,
        organizationalUnit,
    ] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [buildingName] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['pilotOrganization'] /* OBJECT_FIELD_SETTING */,
    '&id': new _OID([
        0, 9, 2342, 19200300, 100, 4, 20,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION pilotOrganization */

/* eslint-enable */
