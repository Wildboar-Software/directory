/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { seeAlso } from '@wildboar/x500/SelectedAttributeTypes';
import { telephoneNumber } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { pilotObjectClass } from '../Cosine/pilotObjectClass.va';
import { roomNumber } from '../Cosine/roomNumber.oa';


/* START_OF_SYMBOL_DEFINITION room */
/**
 * @summary room
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * room OBJECT-CLASS ::= {
 *     SUBCLASS OF {top}
 *     KIND structural
 *     MUST CONTAIN {
 *         commonName
 *     }
 *     MAY CONTAIN {
 *         roomNumber
 *         | description
 *         | seeAlso
 *         | telephoneNumber
 *     }
 *     LDAP-NAME {"room"}
 *     ID { pilotObjectClass 7 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const room: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [commonName] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        roomNumber,
        description,
        seeAlso,
        telephoneNumber,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['room'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [7],
        pilotObjectClass
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION room */

/* eslint-enable */
