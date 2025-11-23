/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { apacheDnsTtl } from '../ApacheDNS-Schema/apacheDnsTtl.oa';
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
export { apacheDnsTtl } from '../ApacheDNS-Schema/apacheDnsTtl.oa';

/* START_OF_SYMBOL_DEFINITION apacheDnsAbstractRecord */
/**
 * @summary apacheDnsAbstractRecord
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * apacheDnsAbstractRecord OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            abstract
 *     MUST CONTAIN    {commonName}
 *     MAY CONTAIN     {apacheDnsTtl | description}
 *     LDAP-NAME       {"apacheDnsAbstractRecord"}
 *     LDAP-DESC       "An abstract DNS record objectClass used to build other specific structural objectclasses for di"
 *     ID              { 1 3 6 1 4 1 18060 0 4 2 3 1 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const apacheDnsAbstractRecord: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': abstract /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [commonName] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        apacheDnsTtl,
        description,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['apacheDnsAbstractRecord'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'An abstract DNS record objectClass used to build other specific structural objectclasses for di' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 2, 3, 1,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION apacheDnsAbstractRecord */

/* eslint-enable */
