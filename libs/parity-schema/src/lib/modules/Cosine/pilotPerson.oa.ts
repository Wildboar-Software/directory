/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { businessCategory } from '@wildboar/x500/SelectedAttributeTypes';
import { preferredDeliveryMethod } from '@wildboar/x500/SelectedAttributeTypes';
import { uid } from '@wildboar/x500/SelectedAttributeTypes';
import { person } from '@wildboar/x500/SelectedObjectClasses';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { favouriteDrink } from '../Cosine/favouriteDrink.oa';
import { homePostalAddress } from '../Cosine/homePostalAddress.oa';
import { homeTelephoneNumber } from '../Cosine/homeTelephoneNumber.oa';
import { janetMailbox } from '../Cosine/janetMailbox.oa';
import { personalTitle } from '../Cosine/personalTitle.oa';
import { pilotObjectClass } from '../Cosine/pilotObjectClass.va';
import { roomNumber } from '../Cosine/roomNumber.oa';
import { secretary } from '../Cosine/secretary.oa';
import { textEncodedORAddress } from '../Cosine/textEncodedORAddress.oa';
import { userClass } from '../Cosine/userClass.oa';
import { mail } from './mail.oa';
import { mailPreferenceOption } from './mailPreferenceOption.oa';
import { mobileTelephoneNumber } from './mobileTelephoneNumber.oa';
import { organizationalStatus } from './organizationalStatus.oa';
import { pagerTelephoneNumber } from './pagerTelephoneNumber.oa';


/* START_OF_SYMBOL_DEFINITION pilotPerson */
/**
 * @summary pilotPerson
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * pilotPerson OBJECT-CLASS ::= {
 *     SUBCLASS OF {person}
 *     KIND structural
 *     MAY CONTAIN {
 *         uid
 *         | textEncodedORAddress
 *         | rfc822Mailbox
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
 *         -- | mailPreferenceOption
 *         -- | personalSignature
 *     }
 *     LDAP-NAME {"pilotPerson", "newPilotPerson"}
 *     ID { pilotObjectClass 4 }
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
        mobileTelephoneNumber,
        pagerTelephoneNumber,
        organizationalStatus,
        mailPreferenceOption,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['pilotPerson', 'newPilotPerson'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [4],
        pilotObjectClass
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION pilotPerson */

/* eslint-enable */
