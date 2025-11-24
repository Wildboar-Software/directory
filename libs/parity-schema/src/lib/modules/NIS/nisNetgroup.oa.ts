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
import { memberNisNetgroup } from '../NIS/memberNisNetgroup.oa';
import { nisNetgroupTriple } from '../NIS/nisNetgroupTriple.oa';


/* START_OF_SYMBOL_DEFINITION nisNetgroup */
/**
 * @summary nisNetgroup
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * nisNetgroup OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            structural
 *     MUST CONTAIN    {commonName}
 *     MAY CONTAIN        {
 *         nisNetgroupTriple
 *         | memberNisNetgroup
 *         | description
 *     }
 *     LDAP-NAME        {"nisNetgroup"}
 *     LDAP-DESC        "Abstraction of a netgroup"
 *     ID                { id-nis-oc 8 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const nisNetgroup: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [commonName] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        nisNetgroupTriple,
        memberNisNetgroup,
        description,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['nisNetgroup'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Abstraction of a netgroup' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [8],
        id_nis_oc
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION nisNetgroup */

/* eslint-enable */
