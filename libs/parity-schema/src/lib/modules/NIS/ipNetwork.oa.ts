/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { localityName } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { manager } from '../Cosine/manager.oa';
import { id_nis_oc } from '../NIS/id-nis-oc.va';
import { ipNetmaskNumber } from '../NIS/ipNetmaskNumber.oa';
import { ipNetworkNumber } from '../NIS/ipNetworkNumber.oa';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
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
} from '@wildboar/x500/InformationFramework';
export { top } from '@wildboar/x500/InformationFramework';
export { commonName } from '@wildboar/x500/SelectedAttributeTypes';
export { description } from '@wildboar/x500/SelectedAttributeTypes';
export { localityName } from '@wildboar/x500/SelectedAttributeTypes';
export { manager } from '../Cosine/manager.oa';
export { id_nis_oc } from '../NIS/id-nis-oc.va';
export { ipNetmaskNumber } from '../NIS/ipNetmaskNumber.oa';
export { ipNetworkNumber } from '../NIS/ipNetworkNumber.oa';

/* START_OF_SYMBOL_DEFINITION ipNetwork */
/**
 * @summary ipNetwork
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ipNetwork OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            structural
 *     MUST CONTAIN    {commonName | ipNetworkNumber}
 *     MAY CONTAIN        {ipNetmaskNumber | localityName | description | manager}
 *     LDAP-NAME        {"ipNetwork"}
 *     LDAP-DESC        "Abstraction of an IP network"
 *     ID                { id-nis-oc 7 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const ipNetwork: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        commonName,
        ipNetworkNumber,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        ipNetmaskNumber,
        localityName,
        description,
        manager,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ipNetwork'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Abstraction of an IP network' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [7],
        id_nis_oc
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ipNetwork */

/* eslint-enable */
