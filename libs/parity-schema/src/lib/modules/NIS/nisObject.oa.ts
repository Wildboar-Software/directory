/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { id_nis_oc } from '../NIS/id-nis-oc.va';
import { nisMapEntry } from '../NIS/nisMapEntry.oa';
import { nisMapName } from '../NIS/nisMapName.oa';


/* START_OF_SYMBOL_DEFINITION nisObject */
/**
 * @summary nisObject
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * nisObject OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            structural
 *     MUST CONTAIN    {commonName | nisMapEntry | nisMapName}
 *     MAY CONTAIN        {description}
 *     LDAP-NAME        {"nisObject"}
 *     LDAP-DESC        "An entry in a NIS map"
 *     ID                { id-nis-oc 10 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const nisObject: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        commonName,
        nisMapEntry,
        nisMapName,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [description] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['nisObject'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'An entry in a NIS map' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [10],
        id_nis_oc
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION nisObject */

/* eslint-enable */
