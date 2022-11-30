/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { commonName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa';
import { description } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { id_nis_oc } from '../NIS/id-nis-oc.va';
import { ipServicePort } from '../NIS/ipServicePort.oa';
import { ipServiceProtocol } from '../NIS/ipServiceProtocol.oa';
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
export { id_nis_oc } from '../NIS/id-nis-oc.va';
export { ipServicePort } from '../NIS/ipServicePort.oa';
export { ipServiceProtocol } from '../NIS/ipServiceProtocol.oa';

/* START_OF_SYMBOL_DEFINITION ipService */
/**
 * @summary ipService
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ipService OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            structural
 *     MUST CONTAIN    {
 *         commonName
 *         | ipServicePort
 *         | ipServiceProtocol
 *     }
 *     MAY CONTAIN        {description}
 *     LDAP-NAME        {"ipService"}
 *     LDAP-DESC        "Abstraction an Internet Protocol service"
 *     ID                { id-nis-oc 3 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const ipService: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        commonName,
        ipServicePort,
        ipServiceProtocol,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [description] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ipService'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'Abstraction an Internet Protocol service' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [3],
        id_nis_oc
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ipService */

/* eslint-enable */
