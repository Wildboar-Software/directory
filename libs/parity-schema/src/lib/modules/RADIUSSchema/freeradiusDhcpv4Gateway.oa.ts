/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { freeradiusDhcpv4GatewayAddr } from '../RADIUSSchema/freeradiusDhcpv4GatewayAddr.oa';
import { freeradiusDhcpv4GatewayIdentifier } from '../RADIUSSchema/freeradiusDhcpv4GatewayIdentifier.oa';
import { freeradiusDhcpv4PoolName } from '../RADIUSSchema/freeradiusDhcpv4PoolName.oa';
import { id_at_freeRadius } from '../RADIUSSchema/id-at-freeRadius.va';


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
    '&id': _OID.fromParts(
        [4, 2, 1, 2, 1],
        id_at_freeRadius
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION freeradiusDhcpv4Gateway */

/* eslint-enable */
