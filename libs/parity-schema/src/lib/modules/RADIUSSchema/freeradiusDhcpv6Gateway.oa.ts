/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { freeradiusDhcpv6GatewayAddr } from '../RADIUSSchema/freeradiusDhcpv6GatewayAddr.oa';
import { freeradiusDhcpv6GatewayIdentifier } from '../RADIUSSchema/freeradiusDhcpv6GatewayIdentifier.oa';
import { freeradiusDhcpv6PoolNameNA } from '../RADIUSSchema/freeradiusDhcpv6PoolNameNA.oa';
import { freeradiusDhcpv6PoolNamePD } from '../RADIUSSchema/freeradiusDhcpv6PoolNamePD.oa';
import { freeradiusDhcpv6PoolNameTA } from '../RADIUSSchema/freeradiusDhcpv6PoolNameTA.oa';
import { id_at_freeRadius } from '../RADIUSSchema/id-at-freeRadius.va';
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
export { freeradiusDhcpv6GatewayAddr } from '../RADIUSSchema/freeradiusDhcpv6GatewayAddr.oa';
export { freeradiusDhcpv6GatewayIdentifier } from '../RADIUSSchema/freeradiusDhcpv6GatewayIdentifier.oa';
export { freeradiusDhcpv6PoolNameNA } from '../RADIUSSchema/freeradiusDhcpv6PoolNameNA.oa';
export { freeradiusDhcpv6PoolNamePD } from '../RADIUSSchema/freeradiusDhcpv6PoolNamePD.oa';
export { freeradiusDhcpv6PoolNameTA } from '../RADIUSSchema/freeradiusDhcpv6PoolNameTA.oa';
export { id_at_freeRadius } from '../RADIUSSchema/id-at-freeRadius.va';

/* START_OF_SYMBOL_DEFINITION freeradiusDhcpv6Gateway */
/**
 * @summary freeradiusDhcpv6Gateway
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * freeradiusDhcpv6Gateway OBJECT-CLASS ::= {
 *     SUBCLASS OF         { top }
 *     KIND                auxiliary
 *     MAY CONTAIN         {
 *         freeradiusDhcpv6GatewayIdentifier
 *         | freeradiusDhcpv6GatewayAddr
 *         | freeradiusDhcpv6PoolNameNA
 *         | freeradiusDhcpv6PoolNamePD
 *         | freeradiusDhcpv6PoolNameTA
 *     }
 *     LDAP-NAME           { "freeradiusDhcpv6Gateway" }
 *     LDAP-DESC           "A DHCP gateway, and attributes specific to it"
 *     ID                  { id-at-freeRadius 4 3 1 2 1 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const freeradiusDhcpv6Gateway: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        freeradiusDhcpv6GatewayIdentifier,
        freeradiusDhcpv6GatewayAddr,
        freeradiusDhcpv6PoolNameNA,
        freeradiusDhcpv6PoolNamePD,
        freeradiusDhcpv6PoolNameTA,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['freeradiusDhcpv6Gateway'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'A DHCP gateway, and attributes specific to it' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [4, 3, 1, 2, 1],
        id_at_freeRadius
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION freeradiusDhcpv6Gateway */

/* eslint-enable */
