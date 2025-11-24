/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { localityName } from '@wildboar/x500/SelectedAttributeTypes';
import { organizationalUnitName } from '@wildboar/x500/SelectedAttributeTypes';
import { organizationName } from '@wildboar/x500/SelectedAttributeTypes';
import { seeAlso } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { documentAuthor } from '../Cosine/documentAuthor.oa';
import { documentIdentifier } from '../Cosine/documentIdentifier.oa';
import { documentLocation } from '../Cosine/documentLocation.oa';
import { documentPublisher } from '../Cosine/documentPublisher.oa';
import { documentTitle } from '../Cosine/documentTitle.oa';
import { documentVersion } from '../Cosine/documentVersion.oa';
import { pilotObjectClass } from '../Cosine/pilotObjectClass.va';


/* START_OF_SYMBOL_DEFINITION document */
/**
 * @summary document
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * document OBJECT-CLASS ::= {
 *     SUBCLASS OF {top}
 *     KIND structural
 *     MUST CONTAIN {
 *         documentIdentifier
 *     }
 *     MAY CONTAIN {
 *         commonName
 *         | description
 *         | seeAlso
 *         | localityName
 *         | organizationName
 *         | organizationalUnitName
 *         | documentTitle
 *         | documentVersion
 *         | documentAuthor
 *         | documentLocation
 *         | documentPublisher
 *     }
 *     LDAP-NAME {"document"}
 *     ID { pilotObjectClass 6 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const document: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [documentIdentifier] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        commonName,
        description,
        seeAlso,
        localityName,
        organizationName,
        organizationalUnitName,
        documentTitle,
        documentVersion,
        documentAuthor,
        documentLocation,
        documentPublisher,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['document'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [6],
        pilotObjectClass
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION document */

/* eslint-enable */
