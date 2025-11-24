/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { bootFile } from '../NIS/bootFile.oa';
import { bootParameter } from '../NIS/bootParameter.oa';
import { id_nis_oc } from '../NIS/id-nis-oc.va';


/* START_OF_SYMBOL_DEFINITION bootableDevice */
/**
 * @summary bootableDevice
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * bootableDevice OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            auxiliary
 *     MAY CONTAIN        {bootFile | bootParameter}
 *     LDAP-NAME        {"bootableDevice"}
 *     LDAP-DESC        "A device with boot parameters"
 *     ID                { id-nis-oc 12 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const bootableDevice: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [bootFile, bootParameter] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['bootableDevice'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'A device with boot parameters' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [12],
        id_nis_oc
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION bootableDevice */

/* eslint-enable */
