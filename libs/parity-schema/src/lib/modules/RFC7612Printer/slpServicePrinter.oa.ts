/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { slpService } from '../RFC2926ServiceLocationProtocolSchema/slpService.oa';
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

/* START_OF_SYMBOL_DEFINITION slpServicePrinter */
/**
 * @summary slpServicePrinter
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * slpServicePrinter OBJECT-CLASS ::= {
 *     SUBCLASS OF         {slpService}
 *     KIND                auxiliary
 *     LDAP-NAME           {"slpServicePrinter"}
 *     LDAP-DESC           "Service Location Protocol (SLP) information."
 *     ID                  { 1 3 18 0 2 6 254 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const slpServicePrinter: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [slpService] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['slpServicePrinter'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'Service Location Protocol (SLP) information.' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID([
        1, 3, 18, 0, 2, 6, 254,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION slpServicePrinter */

/* eslint-enable */
