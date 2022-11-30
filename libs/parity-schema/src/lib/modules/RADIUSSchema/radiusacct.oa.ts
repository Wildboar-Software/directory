/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
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
export { id_at_freeRadius } from '../RADIUSSchema/id-at-freeRadius.va';
export { radiusAcctAuthentic } from '../RADIUSSchema/radiusAcctAuthentic.oa';
export { radiusAcctInputOctets } from '../RADIUSSchema/radiusAcctInputOctets.oa';
export { radiusAcctInterval } from '../RADIUSSchema/radiusAcctInterval.oa';
export { radiusAcctOutputOctets } from '../RADIUSSchema/radiusAcctOutputOctets.oa';
export { radiusAcctSessionId } from '../RADIUSSchema/radiusAcctSessionId.oa';
export { radiusAcctSessionTime } from '../RADIUSSchema/radiusAcctSessionTime.oa';
export { radiusAcctStartTime } from '../RADIUSSchema/radiusAcctStartTime.oa';
export { radiusAcctStopTime } from '../RADIUSSchema/radiusAcctStopTime.oa';
export { radiusAcctTerminateCause } from '../RADIUSSchema/radiusAcctTerminateCause.oa';
export { radiusAcctUniqueId } from '../RADIUSSchema/radiusAcctUniqueId.oa';
export { radiusAcctUpdateTime } from '../RADIUSSchema/radiusAcctUpdateTime.oa';
export { radiusConnectInfoStart } from '../RADIUSSchema/radiusConnectInfoStart.oa';
export { radiusConnectInfoStop } from '../RADIUSSchema/radiusConnectInfoStop.oa';
export { radiusNASIdentifier } from '../RADIUSSchema/radiusNASIdentifier.oa';
export { radiusNASPort } from '../RADIUSSchema/radiusNASPort.oa';
export { radiusNASPortId } from '../RADIUSSchema/radiusNASPortId.oa';
export { radiusNASPortType } from '../RADIUSSchema/radiusNASPortType.oa';
export { radiusUserName } from '../RADIUSSchema/radiusUserName.oa';

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
    '&id': new _OID(
        [4, 3, 2, 3],
        id_at_freeRadius
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION radiusacct */

/* eslint-enable */
