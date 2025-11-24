/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { freeradiusDhcpv4Attribute } from '../RADIUSSchema/freeradiusDhcpv4Attribute.oa';
import { id_at_freeRadius } from '../RADIUSSchema/id-at-freeRadius.va';


/* START_OF_SYMBOL_DEFINITION freeradiusDhcpv4Profile */
/**
 * @summary freeradiusDhcpv4Profile
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * freeradiusDhcpv4Profile OBJECT-CLASS ::= {
 *     SUBCLASS OF         { top }
 *     KIND                auxiliary
 *     MAY CONTAIN         { freeradiusDhcpv4Attribute }
 *     LDAP-NAME           { "freeradiusDhcpv4Profile" }
 *     ID                  { id-at-freeRadius 4 2 2 2 2 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const freeradiusDhcpv4Profile: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        freeradiusDhcpv4Attribute,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['freeradiusDhcpv4Profile'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [4, 2, 2, 2, 2],
        id_at_freeRadius
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION freeradiusDhcpv4Profile */

/* eslint-enable */
