/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { id_at_freeRadius } from '../RADIUSSchema/id-at-freeRadius.va';
import { radiusAcctAuthentic } from '../RADIUSSchema/radiusAcctAuthentic.oa';
import { radiusAcctInputOctets } from '../RADIUSSchema/radiusAcctInputOctets.oa';
import { radiusAcctInterval } from '../RADIUSSchema/radiusAcctInterval.oa';
import { radiusAcctOutputOctets } from '../RADIUSSchema/radiusAcctOutputOctets.oa';
import { radiusAcctSessionId } from '../RADIUSSchema/radiusAcctSessionId.oa';
import { radiusAcctSessionTime } from '../RADIUSSchema/radiusAcctSessionTime.oa';
import { radiusAcctStartTime } from '../RADIUSSchema/radiusAcctStartTime.oa';
import { radiusAcctStopTime } from '../RADIUSSchema/radiusAcctStopTime.oa';
import { radiusAcctTerminateCause } from '../RADIUSSchema/radiusAcctTerminateCause.oa';
import { radiusAcctUniqueId } from '../RADIUSSchema/radiusAcctUniqueId.oa';
import { radiusAcctUpdateTime } from '../RADIUSSchema/radiusAcctUpdateTime.oa';
import { radiusConnectInfoStart } from '../RADIUSSchema/radiusConnectInfoStart.oa';
import { radiusConnectInfoStop } from '../RADIUSSchema/radiusConnectInfoStop.oa';
import { radiusNASIdentifier } from '../RADIUSSchema/radiusNASIdentifier.oa';
import { radiusNASPort } from '../RADIUSSchema/radiusNASPort.oa';
import { radiusNASPortId } from '../RADIUSSchema/radiusNASPortId.oa';
import { radiusNASPortType } from '../RADIUSSchema/radiusNASPortType.oa';
import { radiusUserName } from '../RADIUSSchema/radiusUserName.oa';


/* START_OF_SYMBOL_DEFINITION radiusacct */
/**
 * @summary radiusacct
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * radiusacct OBJECT-CLASS ::= {
 *     SUBCLASS OF         { top }
 *     KIND                auxiliary
 *     MAY CONTAIN         {
 *         radiusAcctAuthentic
 *         | radiusAcctInputOctets
 *         | radiusAcctInterval
 *         | radiusAcctOutputOctets
 *         | radiusAcctSessionId
 *         | radiusAcctSessionTime
 *         | radiusAcctStartTime
 *         | radiusAcctStopTime
 *         | radiusAcctTerminateCause
 *         | radiusAcctUniqueId
 *         | radiusAcctUpdateTime
 *         | radiusConnectInfoStart
 *         | radiusConnectInfoStop
 *         | radiusNASIdentifier
 *         | radiusNASPort
 *         | radiusNASPortId
 *         | radiusNASPortType
 *         | radiusUserName
 *     }
 *     LDAP-NAME           { "radiusacct" }
 *     ID                  { id-at-freeRadius 4 3 2 3 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const radiusacct: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        radiusAcctAuthentic,
        radiusAcctInputOctets,
        radiusAcctInterval,
        radiusAcctOutputOctets,
        radiusAcctSessionId,
        radiusAcctSessionTime,
        radiusAcctStartTime,
        radiusAcctStopTime,
        radiusAcctTerminateCause,
        radiusAcctUniqueId,
        radiusAcctUpdateTime,
        radiusConnectInfoStart,
        radiusConnectInfoStop,
        radiusNASIdentifier,
        radiusNASPort,
        radiusNASPortId,
        radiusNASPortType,
        radiusUserName,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['radiusacct'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [4, 3, 2, 3],
        id_at_freeRadius
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION radiusacct */

/* eslint-enable */
