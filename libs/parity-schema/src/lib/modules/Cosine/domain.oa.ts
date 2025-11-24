/* eslint-disable */
import { userPassword } from '@wildboar/x500/AuthenticationFramework';
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { businessCategory } from '@wildboar/x500/SelectedAttributeTypes';
import { dc } from '@wildboar/x500/SelectedAttributeTypes';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { destinationIndicator } from '@wildboar/x500/SelectedAttributeTypes';
import { facsimileTelephoneNumber } from '@wildboar/x500/SelectedAttributeTypes';
import { internationalISDNNumber } from '@wildboar/x500/SelectedAttributeTypes';
import { localityName } from '@wildboar/x500/SelectedAttributeTypes';
import { organizationName } from '@wildboar/x500/SelectedAttributeTypes';
import { physicalDeliveryOfficeName } from '@wildboar/x500/SelectedAttributeTypes';
import { postalAddress } from '@wildboar/x500/SelectedAttributeTypes';
import { postalCode } from '@wildboar/x500/SelectedAttributeTypes';
import { postOfficeBox } from '@wildboar/x500/SelectedAttributeTypes';
import { preferredDeliveryMethod } from '@wildboar/x500/SelectedAttributeTypes';
import { registeredAddress } from '@wildboar/x500/SelectedAttributeTypes';
import { searchGuide } from '@wildboar/x500/SelectedAttributeTypes';
import { seeAlso } from '@wildboar/x500/SelectedAttributeTypes';
import { stateOrProvinceName } from '@wildboar/x500/SelectedAttributeTypes';
import { streetAddress } from '@wildboar/x500/SelectedAttributeTypes';
import { telephoneNumber } from '@wildboar/x500/SelectedAttributeTypes';
import { telexNumber } from '@wildboar/x500/SelectedAttributeTypes';
import { x121Address } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { associatedName } from '../Cosine/associatedName.oa';
import { pilotObjectClass } from '../Cosine/pilotObjectClass.va';


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
    '&id': _OID.fromParts(
        [13],
        pilotObjectClass
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION domain */

/* eslint-enable */
