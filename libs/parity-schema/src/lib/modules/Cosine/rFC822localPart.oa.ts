/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { commonName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa';
import { description } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa';
import { destinationIndicator } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/destinationIndicator.oa';
import { facsimileTelephoneNumber } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/facsimileTelephoneNumber.oa';
import { internationalISDNNumber } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/internationalISDNNumber.oa';
import { physicalDeliveryOfficeName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/physicalDeliveryOfficeName.oa';
import { postalAddress } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/postalAddress.oa';
import { postalCode } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/postalCode.oa';
import { postOfficeBox } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/postOfficeBox.oa';
import { preferredDeliveryMethod } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/preferredDeliveryMethod.oa';
import { registeredAddress } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/registeredAddress.oa';
import { seeAlso } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/seeAlso.oa';
import { streetAddress } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/streetAddress.oa';
import { surname } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/surname.oa';
import { telephoneNumber } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/telephoneNumber.oa';
import { telexNumber } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/telexNumber.oa';
import { x121Address } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/x121Address.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { domain } from '../Cosine/domain.oa';
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
export { commonName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa';
export { description } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa';
export { destinationIndicator } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/destinationIndicator.oa';
export { facsimileTelephoneNumber } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/facsimileTelephoneNumber.oa';
export { internationalISDNNumber } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/internationalISDNNumber.oa';
export { physicalDeliveryOfficeName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/physicalDeliveryOfficeName.oa';
export { postalAddress } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/postalAddress.oa';
export { postalCode } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/postalCode.oa';
export { postOfficeBox } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/postOfficeBox.oa';
export { preferredDeliveryMethod } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/preferredDeliveryMethod.oa';
export { registeredAddress } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/registeredAddress.oa';
export { seeAlso } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/seeAlso.oa';
export { streetAddress } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/streetAddress.oa';
export { surname } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/surname.oa';
export { telephoneNumber } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/telephoneNumber.oa';
export { domain } from '../Cosine/domain.oa';
export { pilotObjectClass } from '../Cosine/pilotObjectClass.va';

/* START_OF_SYMBOL_DEFINITION rFC822localPart */
/**
 * @summary rFC822localPart
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * rFC822localPart OBJECT-CLASS ::= {
 *     SUBCLASS OF {domain}
 *     KIND structural
 *     MAY CONTAIN {
 *         commonName
 *         | description
 *         | destinationIndicator
 *         | facsimileTelephoneNumber
 *         | internationalISDNNumber
 *         | physicalDeliveryOfficeName
 *         | postalAddress
 *         | postalCode
 *         | postOfficeBox
 *         | preferredDeliveryMethod
 *         | registeredAddress
 *         | seeAlso
 *         | streetAddress
 *         | surname
 *         | telephoneNumber
 *         -- | teletexTerminalIdentifier
 *         | telexNumber
 *         | x121Address
 *     }
 *     LDAP-NAME {"rFC822localPart"}
 *     ID { pilotObjectClass 14 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const rFC822localPart: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [domain] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        commonName,
        description,
        destinationIndicator,
        facsimileTelephoneNumber,
        internationalISDNNumber,
        physicalDeliveryOfficeName,
        postalAddress,
        postalCode,
        postOfficeBox,
        preferredDeliveryMethod,
        registeredAddress,
        seeAlso,
        streetAddress,
        surname,
        telephoneNumber,
        telexNumber,
        x121Address,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['rFC822localPart'] /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [14],
        pilotObjectClass
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION rFC822localPart */

/* eslint-enable */
