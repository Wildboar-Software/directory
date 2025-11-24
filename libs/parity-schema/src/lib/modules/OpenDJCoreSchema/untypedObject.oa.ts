/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { countryName } from '@wildboar/x500/SelectedAttributeTypes';
import { dc } from '@wildboar/x500/SelectedAttributeTypes';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { localityName } from '@wildboar/x500/SelectedAttributeTypes';
import { organizationalUnitName } from '@wildboar/x500/SelectedAttributeTypes';
import { organizationName } from '@wildboar/x500/SelectedAttributeTypes';
import { owner } from '@wildboar/x500/SelectedAttributeTypes';
import { seeAlso } from '@wildboar/x500/SelectedAttributeTypes';
import { stateOrProvinceName } from '@wildboar/x500/SelectedAttributeTypes';
import { streetAddress } from '@wildboar/x500/SelectedAttributeTypes';
import { uid } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';


/* START_OF_SYMBOL_DEFINITION untypedObject */
/**
 * @summary untypedObject
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * untypedObject OBJECT-CLASS ::= {
 *     SUBCLASS OF         {top}
 *     KIND                structural
 *     MAY CONTAIN         {
 *         countryName
 *         | commonName
 *         | dc
 *         | localityName
 *         | organizationName
 *         | organizationalUnitName
 *         | stateOrProvinceName
 *         | streetAddress
 *         | uid
 *         | description
 *         | owner
 *         | seeAlso
 *     }
 *     LDAP-NAME           { "untypedObject" }
 *     LDAP-DESC           "Entry of no particular type"
 *     ID                  { 1 3 6 1 4 1 26027 1 2 900 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const untypedObject: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        countryName,
        commonName,
        dc,
        localityName,
        organizationName,
        organizationalUnitName,
        stateOrProvinceName,
        streetAddress,
        uid,
        description,
        owner,
        seeAlso,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['untypedObject'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Entry of no particular type' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 26027, 1, 2, 900,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION untypedObject */

/* eslint-enable */
