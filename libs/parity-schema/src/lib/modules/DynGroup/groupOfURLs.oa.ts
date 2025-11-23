/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { businessCategory } from '@wildboar/x500/SelectedAttributeTypes';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { organizationalUnitName } from '@wildboar/x500/SelectedAttributeTypes';
import { organizationName } from '@wildboar/x500/SelectedAttributeTypes';
import { owner } from '@wildboar/x500/SelectedAttributeTypes';
import { seeAlso } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { id_nsdsoc } from '../DynGroup/id-nsdsoc.va';
import { memberURL } from '../DynGroup/memberURL.oa';
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
export { businessCategory } from '@wildboar/x500/SelectedAttributeTypes';
export { commonName } from '@wildboar/x500/SelectedAttributeTypes';
export { description } from '@wildboar/x500/SelectedAttributeTypes';
export { organizationalUnitName } from '@wildboar/x500/SelectedAttributeTypes';
export { organizationName } from '@wildboar/x500/SelectedAttributeTypes';
export { owner } from '@wildboar/x500/SelectedAttributeTypes';
export { seeAlso } from '@wildboar/x500/SelectedAttributeTypes';
export { id_nsdsoc } from '../DynGroup/id-nsdsoc.va';
export { memberURL } from '../DynGroup/memberURL.oa';

/* START_OF_SYMBOL_DEFINITION groupOfURLs */
/**
 * @summary groupOfURLs
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * groupOfURLs OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            structural
 *     MUST CONTAIN    {commonName}
 *     MAY CONTAIN        {
 *         memberURL
 *         | businessCategory
 *         | description
 *         | organizationName
 *         | organizationalUnitName
 *         | owner
 *         | seeAlso
 *     }
 *     LDAP-NAME        {"groupOfURLs"}
 *     ID                { id-nsdsoc 33 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const groupOfURLs: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [commonName] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        memberURL,
        businessCategory,
        description,
        organizationName,
        organizationalUnitName,
        owner,
        seeAlso,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['groupOfURLs'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [33],
        id_nsdsoc
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION groupOfURLs */

/* eslint-enable */
