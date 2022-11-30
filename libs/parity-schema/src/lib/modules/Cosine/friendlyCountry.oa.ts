/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { country } from '@wildboar/x500/src/lib/modules/SelectedObjectClasses/country.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { friendlyCountryName } from '../Cosine/friendlyCountryName.oa';
import { pilotObjectClass } from '../Cosine/pilotObjectClass.va';
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
export { country } from '@wildboar/x500/src/lib/modules/SelectedObjectClasses/country.oa';
export { friendlyCountryName } from '../Cosine/friendlyCountryName.oa';
export { pilotObjectClass } from '../Cosine/pilotObjectClass.va';

/* START_OF_SYMBOL_DEFINITION friendlyCountry */
/**
 * @summary friendlyCountry
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * friendlyCountry OBJECT-CLASS ::= {
 *     SUBCLASS OF {country}
 *     KIND structural
 *     MUST CONTAIN {
 *         friendlyCountryName
 *     }
 *     LDAP-NAME {"friendlyCountry"}
 *     ID { pilotObjectClass 18 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const friendlyCountry: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [country] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [friendlyCountryName] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['friendlyCountry'] /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [18],
        pilotObjectClass
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION friendlyCountry */

/* eslint-enable */
