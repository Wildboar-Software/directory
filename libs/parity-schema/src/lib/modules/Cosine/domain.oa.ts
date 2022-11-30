/* eslint-disable */
import { userPassword } from '@wildboar/x500/src/lib/modules/AuthenticationFramework/userPassword.oa';
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { businessCategory } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/businessCategory.oa';
import { dc } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/dc.oa';
import { description } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa';
import { destinationIndicator } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/destinationIndicator.oa';
import { facsimileTelephoneNumber } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/facsimileTelephoneNumber.oa';
import { internationalISDNNumber } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/internationalISDNNumber.oa';
import { localityName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/localityName.oa';
import { organizationName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationName.oa';
import { physicalDeliveryOfficeName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/physicalDeliveryOfficeName.oa';
import { postalAddress } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/postalAddress.oa';
import { postalCode } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/postalCode.oa';
import { postOfficeBox } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/postOfficeBox.oa';
import { preferredDeliveryMethod } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/preferredDeliveryMethod.oa';
import { registeredAddress } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/registeredAddress.oa';
import { searchGuide } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/searchGuide.oa';
import { seeAlso } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/seeAlso.oa';
import { stateOrProvinceName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/stateOrProvinceName.oa';
import { streetAddress } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/streetAddress.oa';
import { telephoneNumber } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/telephoneNumber.oa';
import { telexNumber } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/telexNumber.oa';
import { x121Address } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/x121Address.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { associatedName } from '../Cosine/associatedName.oa';
import { pilotObjectClass } from '../Cosine/pilotObjectClass.va';
export { userPassword } from '@wildboar/x500/src/lib/modules/AuthenticationFramework/userPassword.oa';
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
export { dc } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/dc.oa';
export { description } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa';
export { facsimileTelephoneNumber } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/facsimileTelephoneNumber.oa';
export { internationalISDNNumber } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/internationalISDNNumber.oa';
export { localityName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/localityName.oa';
export { organizationName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationName.oa';
export { physicalDeliveryOfficeName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/physicalDeliveryOfficeName.oa';
export { postalAddress } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/postalAddress.oa';
export { postalCode } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/postalCode.oa';
export { postOfficeBox } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/postOfficeBox.oa';
export { searchGuide } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/searchGuide.oa';
export { seeAlso } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/seeAlso.oa';
export { stateOrProvinceName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/stateOrProvinceName.oa';
export { streetAddress } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/streetAddress.oa';
export { telephoneNumber } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/telephoneNumber.oa';
export { associatedName } from '../Cosine/associatedName.oa';
export { pilotObjectClass } from '../Cosine/pilotObjectClass.va';

/* START_OF_SYMBOL_DEFINITION domain */
/**
 * @summary domain
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * domain OBJECT-CLASS ::= {
 *     SUBCLASS OF {top}
 *     KIND structural
 *     MUST CONTAIN {
 *         dc
 *     }
 *     MAY CONTAIN {
 *         associatedName
 *         | organizationName
 *         | description
 *         | businessCategory
 *         | seeAlso
 *         | searchGuide
 *         | userPassword
 *         | localityName
 *         | stateOrProvinceName
 *         | physicalDeliveryOfficeName
 *         | postalAddress
 *         | postalCode
 *         | postOfficeBox
 *         | streetAddress
 *         | facsimileTelephoneNumber
 *         | internationalISDNNumber
 *         | telephoneNumber
 *         -- | teletexTerminalIdentifier
 *         | telexNumber
 *         | preferredDeliveryMethod
 *         | destinationIndicator
 *         | registeredAddress
 *         | x121Address
 *     }
 *     LDAP-NAME {"domain"}
 *     ID { pilotObjectClass 13 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const domain: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [dc] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        associatedName,
        organizationName,
        description,
        businessCategory,
        seeAlso,
        searchGuide,
        userPassword,
        localityName,
        stateOrProvinceName,
        physicalDeliveryOfficeName,
        postalAddress,
        postalCode,
        postOfficeBox,
        streetAddress,
        facsimileTelephoneNumber,
        internationalISDNNumber,
        telephoneNumber,
        telexNumber,
        preferredDeliveryMethod,
        destinationIndicator,
        registeredAddress,
        x121Address,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['domain'] /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [13],
        pilotObjectClass
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION domain */

/* eslint-enable */
