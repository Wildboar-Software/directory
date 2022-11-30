/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { businessCategory } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/businessCategory.oa';
import { preferredDeliveryMethod } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/preferredDeliveryMethod.oa';
import { uid } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uid.oa';
import { person } from '@wildboar/x500/src/lib/modules/SelectedObjectClasses/person.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { favouriteDrink } from '../Cosine/favouriteDrink.oa';
import { homePostalAddress } from '../Cosine/homePostalAddress.oa';
import { homeTelephoneNumber } from '../Cosine/homeTelephoneNumber.oa';
import { janetMailbox } from '../Cosine/janetMailbox.oa';
import { mail } from '../Cosine/mail.oa';
import { personalTitle } from '../Cosine/personalTitle.oa';
import { roomNumber } from '../Cosine/roomNumber.oa';
import { secretary } from '../Cosine/secretary.oa';
import { textEncodedORAddress } from '../Cosine/textEncodedORAddress.oa';
import { userClass } from '../Cosine/userClass.oa';
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
export { businessCategory } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/businessCategory.oa';
export { preferredDeliveryMethod } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/preferredDeliveryMethod.oa';
export { uid } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uid.oa';
export { person } from '@wildboar/x500/src/lib/modules/SelectedObjectClasses/person.oa';
export { favouriteDrink } from '../Cosine/favouriteDrink.oa';
export { homePostalAddress } from '../Cosine/homePostalAddress.oa';
export { janetMailbox } from '../Cosine/janetMailbox.oa';
export { mail } from '../Cosine/mail.oa';
export { personalTitle } from '../Cosine/personalTitle.oa';
export { roomNumber } from '../Cosine/roomNumber.oa';
export { secretary } from '../Cosine/secretary.oa';
export { textEncodedORAddress } from '../Cosine/textEncodedORAddress.oa';
export { userClass } from '../Cosine/userClass.oa';

/* START_OF_SYMBOL_DEFINITION pilotPerson */
/**
 * @summary pilotPerson
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * pilotPerson OBJECT-CLASS ::= {
 *     SUBCLASS OF         {person}
 *     KIND                structural
 *     MAY CONTAIN         {
 *         uid
 *         | textEncodedORAddress
 *         | mail
 *         | favouriteDrink
 *         | roomNumber
 *         | userClass
 *         | homeTelephoneNumber
 *         | homePostalAddress
 *         | secretary
 *         | personalTitle
 *         | preferredDeliveryMethod
 *         | businessCategory
 *         | janetMailbox
 *         -- | otherMailbox
 *         | mobileTelephoneNumber
 *         | pagerTelephoneNumber
 *         | organizationalStatus
 *         | mailPreferenceOption
 *         -- | personalSignature
 *     }
 *     LDAP-NAME           { "pilotPerson" }
 *     ID                  { 0 9 2342 19200300 100 4 4 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const pilotPerson: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [person] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        uid,
        textEncodedORAddress,
        mail,
        favouriteDrink,
        roomNumber,
        userClass,
        homeTelephoneNumber,
        homePostalAddress,
        secretary,
        personalTitle,
        preferredDeliveryMethod,
        businessCategory,
        janetMailbox,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['pilotPerson'] /* OBJECT_FIELD_SETTING */,
    '&id': new _OID([
        0, 9, 2342, 19200300, 100, 4, 4,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION pilotPerson */

/* eslint-enable */
