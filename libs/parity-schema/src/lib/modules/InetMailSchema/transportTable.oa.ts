/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { commonName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa';
import { id_oc_transportTable } from '../InetMailSchema/id-oc-transportTable.va';
import { transport } from '../InetMailSchema/transport.oa';
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
export { id_oc_transportTable } from '../InetMailSchema/id-oc-transportTable.va';
export { transport } from '../InetMailSchema/transport.oa';

/* START_OF_SYMBOL_DEFINITION transportTable */
/**
 * @summary transportTable
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * transportTable OBJECT-CLASS ::= {
 *     KIND            structural
 *     MUST CONTAIN    {commonName | transport}
 *     LDAP-NAME       {"transportTable"}
 *     LDAP-DESC       "MTA Transport Table"
 *     ID              id-oc-transportTable
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const transportTable: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [commonName, transport] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['transportTable'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'MTA Transport Table' /* OBJECT_FIELD_SETTING */,
    '&id': id_oc_transportTable /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION transportTable */

/* eslint-enable */
