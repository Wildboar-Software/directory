/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { commonName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa';
import { description } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa';
import { localityName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/localityName.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { manager } from '../Cosine/manager.oa';
import { id_nis_oc } from '../NIS/id-nis-oc.va';
import { ipHostNumber } from '../NIS/ipHostNumber.oa';
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
export { commonName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa';
export { description } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa';
export { localityName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/localityName.oa';
export { manager } from '../Cosine/manager.oa';
export { id_nis_oc } from '../NIS/id-nis-oc.va';
export { ipHostNumber } from '../NIS/ipHostNumber.oa';

/* START_OF_SYMBOL_DEFINITION ipHost */
/**
 * @summary ipHost
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ipHost OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            auxiliary
 *     MUST CONTAIN    {commonName | ipHostNumber}
 *     MAY CONTAIN        {localityName | description | manager}
 *     LDAP-NAME        {"ipHost"}
 *     LDAP-DESC        "Abstraction of a host, an IP device"
 *     ID                { id-nis-oc 6 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const ipHost: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        commonName,
        ipHostNumber,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        localityName,
        description,
        manager,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ipHost'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'Abstraction of a host, an IP device' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [6],
        id_nis_oc
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ipHost */

/* eslint-enable */
