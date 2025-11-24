/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { destinationIndicator } from '@wildboar/x500/SelectedAttributeTypes';
import { facsimileTelephoneNumber } from '@wildboar/x500/SelectedAttributeTypes';
import { internationalISDNNumber } from '@wildboar/x500/SelectedAttributeTypes';
import { physicalDeliveryOfficeName } from '@wildboar/x500/SelectedAttributeTypes';
import { postalAddress } from '@wildboar/x500/SelectedAttributeTypes';
import { postalCode } from '@wildboar/x500/SelectedAttributeTypes';
import { postOfficeBox } from '@wildboar/x500/SelectedAttributeTypes';
import { preferredDeliveryMethod } from '@wildboar/x500/SelectedAttributeTypes';
import { registeredAddress } from '@wildboar/x500/SelectedAttributeTypes';
import { seeAlso } from '@wildboar/x500/SelectedAttributeTypes';
import { streetAddress } from '@wildboar/x500/SelectedAttributeTypes';
import { surname } from '@wildboar/x500/SelectedAttributeTypes';
import { telephoneNumber } from '@wildboar/x500/SelectedAttributeTypes';
import { telexNumber } from '@wildboar/x500/SelectedAttributeTypes';
import { x121Address } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { domain } from '../Cosine/domain.oa';
import { pilotObjectClass } from '../Cosine/pilotObjectClass.va';


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
    '&id': _OID.fromParts(
        [14],
        pilotObjectClass
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION rFC822localPart */

/* eslint-enable */
