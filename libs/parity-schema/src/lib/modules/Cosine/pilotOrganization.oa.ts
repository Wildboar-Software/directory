/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { organization } from '@wildboar/x500/SelectedObjectClasses';
import { organizationalUnit } from '@wildboar/x500/SelectedObjectClasses';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { buildingName } from '../Cosine/buildingName.oa';
import { pilotObjectClass } from '../Cosine/pilotObjectClass.va';


/* START_OF_SYMBOL_DEFINITION pilotOrganization */
/**
 * @summary pilotOrganization
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * pilotOrganization OBJECT-CLASS ::= {
 *     SUBCLASS OF {organization | organizationalUnit}
 *     KIND structural
 *     MAY CONTAIN {
 *         buildingName
 *     }
 *     LDAP-NAME {"pilotOrganization"}
 *     ID { pilotObjectClass 20 }
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
    '&id': _OID.fromParts(
        [20],
        pilotObjectClass
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION pilotOrganization */

/* eslint-enable */
