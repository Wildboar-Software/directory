/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { slpService } from '../RFC2926ServiceLocationProtocolSchema/slpService.oa';


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
    '&id': _OID.fromParts([
        1, 3, 18, 0, 2, 6, 254,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION slpServicePrinter */

/* eslint-enable */
