/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { localityName } from '@wildboar/x500/SelectedAttributeTypes';
import { organizationalUnitName } from '@wildboar/x500/SelectedAttributeTypes';
import { organizationName } from '@wildboar/x500/SelectedAttributeTypes';
import { seeAlso } from '@wildboar/x500/SelectedAttributeTypes';
import { uid } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { host } from '../Cosine/host.oa';
import { pilotObjectClass } from '../Cosine/pilotObjectClass.va';
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
export { description } from '@wildboar/x500/SelectedAttributeTypes';
export { localityName } from '@wildboar/x500/SelectedAttributeTypes';
export { organizationalUnitName } from '@wildboar/x500/SelectedAttributeTypes';
export { organizationName } from '@wildboar/x500/SelectedAttributeTypes';
export { seeAlso } from '@wildboar/x500/SelectedAttributeTypes';
export { uid } from '@wildboar/x500/SelectedAttributeTypes';
export { host } from '../Cosine/host.oa';
export { pilotObjectClass } from '../Cosine/pilotObjectClass.va';

/* START_OF_SYMBOL_DEFINITION account */
/**
 * @summary account
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * account OBJECT-CLASS ::= {
 *     SUBCLASS OF {top}
 *     KIND structural
 *     MUST CONTAIN {uid}
 *     MAY CONTAIN {
 *         description
 *         | seeAlso
 *         | localityName
 *         | organizationName
 *         | organizationalUnitName
 *         | host
 *     }
 *     LDAP-NAME {"account"}
 *     ID { pilotObjectClass 5 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const account: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [uid] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        description,
        seeAlso,
        localityName,
        organizationName,
        organizationalUnitName,
        host,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['account'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [5],
        pilotObjectClass
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION account */

/* eslint-enable */
