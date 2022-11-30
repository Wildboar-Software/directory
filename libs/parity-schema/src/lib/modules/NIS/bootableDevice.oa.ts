/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { bootFile } from '../NIS/bootFile.oa';
import { bootParameter } from '../NIS/bootParameter.oa';
import { id_nis_oc } from '../NIS/id-nis-oc.va';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
export {
    abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    ObjectClassKind,
    ObjectClassKind_abstract /* IMPORTED_LONG_ENUMERATION_ITEM */,
    ObjectClassKind_auxiliary /* IMPORTED_LONG_ENUMERATION_ITEM */,
    ObjectClassKind_structural /* IMPORTED_LONG_ENUMERATION_ITEM */,
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    _decode_ObjectClassKind,
    _encode_ObjectClassKind,
    _enum_for_ObjectClassKind,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
export { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
export { bootFile } from '../NIS/bootFile.oa';
export { bootParameter } from '../NIS/bootParameter.oa';
export { id_nis_oc } from '../NIS/id-nis-oc.va';

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
    '&id': new _OID(
        [12],
        id_nis_oc
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION bootableDevice */

/* eslint-enable */
