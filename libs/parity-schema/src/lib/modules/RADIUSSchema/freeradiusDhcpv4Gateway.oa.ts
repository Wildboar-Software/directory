/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { freeradiusDhcpv4GatewayAddr } from '../RADIUSSchema/freeradiusDhcpv4GatewayAddr.oa';
import { freeradiusDhcpv4GatewayIdentifier } from '../RADIUSSchema/freeradiusDhcpv4GatewayIdentifier.oa';
import { freeradiusDhcpv4PoolName } from '../RADIUSSchema/freeradiusDhcpv4PoolName.oa';
import { id_at_freeRadius } from '../RADIUSSchema/id-at-freeRadius.va';
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
export { freeradiusDhcpv4GatewayAddr } from '../RADIUSSchema/freeradiusDhcpv4GatewayAddr.oa';
export { freeradiusDhcpv4GatewayIdentifier } from '../RADIUSSchema/freeradiusDhcpv4GatewayIdentifier.oa';
export { freeradiusDhcpv4PoolName } from '../RADIUSSchema/freeradiusDhcpv4PoolName.oa';
export { id_at_freeRadius } from '../RADIUSSchema/id-at-freeRadius.va';

/* START_OF_SYMBOL_DEFINITION freeradiusDhcpv4Gateway */
/**
 * @summary freeradiusDhcpv4Gateway
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * freeradiusDhcpv4Gateway OBJECT-CLASS ::= {
 *     SUBCLASS OF         { top }
 *     KIND                auxiliary
 *     MAY CONTAIN         {
 *         freeradiusDhcpv4GatewayIdentifier
 *         | freeradiusDhcpv4GatewayAddr
 *         | freeradiusDhcpv4PoolName
 *     }
 *     LDAP-NAME           { "freeradiusDhcpv4Gateway" }
 *     LDAP-DESC           "A DHCP gateway, and attributes specific to it"
 *     ID                  { id-at-freeRadius 4 2 1 2 1 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const freeradiusDhcpv4Gateway: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        freeradiusDhcpv4GatewayIdentifier,
        freeradiusDhcpv4GatewayAddr,
        freeradiusDhcpv4PoolName,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['freeradiusDhcpv4Gateway'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'A DHCP gateway, and attributes specific to it' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [4, 2, 1, 2, 1],
        id_at_freeRadius
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION freeradiusDhcpv4Gateway */

/* eslint-enable */
