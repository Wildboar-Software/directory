/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { businessCategory } from '@wildboar/x500/SelectedAttributeTypes';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { member } from '@wildboar/x500/SelectedAttributeTypes';
import { organizationalUnitName } from '@wildboar/x500/SelectedAttributeTypes';
import { organizationName } from '@wildboar/x500/SelectedAttributeTypes';
import { owner } from '@wildboar/x500/SelectedAttributeTypes';
import { seeAlso } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';


/* START_OF_SYMBOL_DEFINITION groupOfEntries */
/**
 * @summary groupOfEntries
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * groupOfEntries OBJECT-CLASS ::= {
 *     SUBCLASS OF         { top }
 *     KIND                structural
 *     MUST CONTAIN        { commonName }
 *     MAY CONTAIN         {
 *         member
 *         | businessCategory
 *         | seeAlso
 *         | owner
 *         | organizationalUnitName
 *         | organizationName
 *         | description
 *     }
 *     LDAP-NAME           { "groupOfEntries" }
 *     ID                  { 1 2 826 0 1 3458854 2 1 1 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const groupOfEntries: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [commonName] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        member,
        businessCategory,
        seeAlso,
        owner,
        organizationalUnitName,
        organizationName,
        description,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['groupOfEntries'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 2, 826, 0, 1, 3458854, 2, 1, 1,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION groupOfEntries */

/* eslint-enable */
