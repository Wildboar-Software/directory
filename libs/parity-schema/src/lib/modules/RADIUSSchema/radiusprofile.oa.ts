/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { dialupAccess } from '../RADIUSSchema/dialupAccess.oa';
import { id_at_freeRadius } from '../RADIUSSchema/id-at-freeRadius.va';
import { radiusArapFeatures } from '../RADIUSSchema/radiusArapFeatures.oa';
import { radiusArapSecurity } from '../RADIUSSchema/radiusArapSecurity.oa';
import { radiusArapZoneAccess } from '../RADIUSSchema/radiusArapZoneAccess.oa';
import { radiusAttribute } from '../RADIUSSchema/radiusAttribute.oa';
import { radiusAuthType } from '../RADIUSSchema/radiusAuthType.oa';
import { radiusCallbackId } from '../RADIUSSchema/radiusCallbackId.oa';
import { radiusCallbackNumber } from '../RADIUSSchema/radiusCallbackNumber.oa';
import { radiusCalledStationId } from '../RADIUSSchema/radiusCalledStationId.oa';
import { radiusCallingStationId } from '../RADIUSSchema/radiusCallingStationId.oa';
import { radiusClass } from '../RADIUSSchema/radiusClass.oa';
import { radiusClientIPAddress } from '../RADIUSSchema/radiusClientIPAddress.oa';
import { radiusControlAttribute } from '../RADIUSSchema/radiusControlAttribute.oa';
import { radiusExpiration } from '../RADIUSSchema/radiusExpiration.oa';
import { radiusFilterId } from '../RADIUSSchema/radiusFilterId.oa';
import { radiusFramedAppleTalkLink } from '../RADIUSSchema/radiusFramedAppleTalkLink.oa';
import { radiusFramedAppleTalkNetwork } from '../RADIUSSchema/radiusFramedAppleTalkNetwork.oa';
import { radiusFramedAppleTalkZone } from '../RADIUSSchema/radiusFramedAppleTalkZone.oa';
import { radiusFramedCompression } from '../RADIUSSchema/radiusFramedCompression.oa';
import { radiusFramedIPAddress } from '../RADIUSSchema/radiusFramedIPAddress.oa';
import { radiusFramedIPNetmask } from '../RADIUSSchema/radiusFramedIPNetmask.oa';
import { radiusFramedIPXNetwork } from '../RADIUSSchema/radiusFramedIPXNetwork.oa';
import { radiusFramedMTU } from '../RADIUSSchema/radiusFramedMTU.oa';
import { radiusFramedProtocol } from '../RADIUSSchema/radiusFramedProtocol.oa';
import { radiusFramedRoute } from '../RADIUSSchema/radiusFramedRoute.oa';
import { radiusFramedRouting } from '../RADIUSSchema/radiusFramedRouting.oa';
import { radiusGroupName } from '../RADIUSSchema/radiusGroupName.oa';
import { radiusHint } from '../RADIUSSchema/radiusHint.oa';
import { radiusHuntgroupName } from '../RADIUSSchema/radiusHuntgroupName.oa';
import { radiusIdleTimeout } from '../RADIUSSchema/radiusIdleTimeout.oa';
import { radiusLoginIPHost } from '../RADIUSSchema/radiusLoginIPHost.oa';
import { radiusLoginLATGroup } from '../RADIUSSchema/radiusLoginLATGroup.oa';
import { radiusLoginLATNode } from '../RADIUSSchema/radiusLoginLATNode.oa';
import { radiusLoginLATPort } from '../RADIUSSchema/radiusLoginLATPort.oa';
import { radiusLoginLATService } from '../RADIUSSchema/radiusLoginLATService.oa';
import { radiusLoginService } from '../RADIUSSchema/radiusLoginService.oa';
import { radiusLoginTCPPort } from '../RADIUSSchema/radiusLoginTCPPort.oa';
import { radiusLoginTime } from '../RADIUSSchema/radiusLoginTime.oa';
import { radiusNASIpAddress } from '../RADIUSSchema/radiusNASIpAddress.oa';
import { radiusPasswordRetry } from '../RADIUSSchema/radiusPasswordRetry.oa';
import { radiusPortLimit } from '../RADIUSSchema/radiusPortLimit.oa';
import { radiusProfileDN } from '../RADIUSSchema/radiusProfileDN.oa';
import { radiusPrompt } from '../RADIUSSchema/radiusPrompt.oa';
import { radiusProxyToRealm } from '../RADIUSSchema/radiusProxyToRealm.oa';
import { radiusRealm } from '../RADIUSSchema/radiusRealm.oa';
import { radiusReplicateToRealm } from '../RADIUSSchema/radiusReplicateToRealm.oa';
import { radiusReplyAttribute } from '../RADIUSSchema/radiusReplyAttribute.oa';
import { radiusReplyMessage } from '../RADIUSSchema/radiusReplyMessage.oa';
import { radiusRequestAttribute } from '../RADIUSSchema/radiusRequestAttribute.oa';
import { radiusServiceType } from '../RADIUSSchema/radiusServiceType.oa';
import { radiusSessionTimeout } from '../RADIUSSchema/radiusSessionTimeout.oa';
import { radiusSimultaneousUse } from '../RADIUSSchema/radiusSimultaneousUse.oa';
import { radiusStripUserName } from '../RADIUSSchema/radiusStripUserName.oa';
import { radiusTerminationAction } from '../RADIUSSchema/radiusTerminationAction.oa';
import { radiusTunnelAssignmentId } from '../RADIUSSchema/radiusTunnelAssignmentId.oa';
import { radiusTunnelClientEndpoint } from '../RADIUSSchema/radiusTunnelClientEndpoint.oa';
import { radiusTunnelMediumType } from '../RADIUSSchema/radiusTunnelMediumType.oa';
import { radiusTunnelPassword } from '../RADIUSSchema/radiusTunnelPassword.oa';
import { radiusTunnelPreference } from '../RADIUSSchema/radiusTunnelPreference.oa';
import { radiusTunnelPrivateGroupId } from '../RADIUSSchema/radiusTunnelPrivateGroupId.oa';
import { radiusTunnelServerEndpoint } from '../RADIUSSchema/radiusTunnelServerEndpoint.oa';
import { radiusTunnelType } from '../RADIUSSchema/radiusTunnelType.oa';
import { radiusUserCategory } from '../RADIUSSchema/radiusUserCategory.oa';
import { radiusVSA } from '../RADIUSSchema/radiusVSA.oa';


/* START_OF_SYMBOL_DEFINITION radiusprofile */
/**
 * @summary radiusprofile
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * radiusprofile OBJECT-CLASS ::= {
 *     SUBCLASS OF         { top }
 *     KIND                auxiliary
 *     MAY CONTAIN         {
 *         radiusArapFeatures
 *         | radiusArapSecurity
 *         | radiusArapZoneAccess
 *         | radiusAuthType
 *         | radiusCallbackId
 *         | radiusCallbackNumber
 *         | radiusCalledStationId
 *         | radiusCallingStationId
 *         | radiusClass
 *         | radiusClientIPAddress
 *         | radiusFilterId
 *         | radiusFramedAppleTalkLink
 *         | radiusFramedAppleTalkNetwork
 *         | radiusFramedAppleTalkZone
 *         | radiusFramedCompression
 *         | radiusFramedIPAddress
 *         | radiusFramedIPNetmask
 *         | radiusFramedIPXNetwork
 *         | radiusFramedMTU
 *         | radiusFramedProtocol
 *         | radiusAttribute
 *         | radiusFramedRoute
 *         | radiusFramedRouting
 *         | radiusIdleTimeout
 *         | radiusGroupName
 *         | radiusHint
 *         | radiusHuntgroupName
 *         | radiusLoginIPHost
 *         | radiusLoginLATGroup
 *         | radiusLoginLATNode
 *         | radiusLoginLATPort
 *         | radiusLoginLATService
 *         | radiusLoginService
 *         | radiusLoginTCPPort
 *         | radiusLoginTime
 *         | radiusPasswordRetry
 *         | radiusPortLimit
 *         | radiusPrompt
 *         | radiusProxyToRealm
 *         | radiusRealm
 *         | radiusReplicateToRealm
 *         | radiusServiceType
 *         | radiusSessionTimeout
 *         | radiusStripUserName
 *         | radiusTerminationAction
 *         | radiusTunnelClientEndpoint
 *         | radiusProfileDN
 *         | radiusSimultaneousUse
 *         | radiusTunnelAssignmentId
 *         | radiusTunnelMediumType
 *         | radiusTunnelPassword
 *         | radiusTunnelPreference
 *         | radiusTunnelPrivateGroupId
 *         | radiusTunnelServerEndpoint
 *         | radiusTunnelType
 *         | radiusUserCategory
 *         | radiusVSA
 *         | radiusExpiration
 *         | dialupAccess
 *         | radiusNASIpAddress
 *         | radiusReplyMessage
 *         | radiusControlAttribute
 *         | radiusReplyAttribute
 *         | radiusRequestAttribute
 *     }
 *     LDAP-NAME           { "radiusprofile" }
 *     ID                  { id-at-freeRadius 4 3 2 1 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const radiusprofile: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        radiusArapFeatures,
        radiusArapSecurity,
        radiusArapZoneAccess,
        radiusAuthType,
        radiusCallbackId,
        radiusCallbackNumber,
        radiusCalledStationId,
        radiusCallingStationId,
        radiusClass,
        radiusClientIPAddress,
        radiusFilterId,
        radiusFramedAppleTalkLink,
        radiusFramedAppleTalkNetwork,
        radiusFramedAppleTalkZone,
        radiusFramedCompression,
        radiusFramedIPAddress,
        radiusFramedIPNetmask,
        radiusFramedIPXNetwork,
        radiusFramedMTU,
        radiusFramedProtocol,
        radiusAttribute,
        radiusFramedRoute,
        radiusFramedRouting,
        radiusIdleTimeout,
        radiusGroupName,
        radiusHint,
        radiusHuntgroupName,
        radiusLoginIPHost,
        radiusLoginLATGroup,
        radiusLoginLATNode,
        radiusLoginLATPort,
        radiusLoginLATService,
        radiusLoginService,
        radiusLoginTCPPort,
        radiusLoginTime,
        radiusPasswordRetry,
        radiusPortLimit,
        radiusPrompt,
        radiusProxyToRealm,
        radiusRealm,
        radiusReplicateToRealm,
        radiusServiceType,
        radiusSessionTimeout,
        radiusStripUserName,
        radiusTerminationAction,
        radiusTunnelClientEndpoint,
        radiusProfileDN,
        radiusSimultaneousUse,
        radiusTunnelAssignmentId,
        radiusTunnelMediumType,
        radiusTunnelPassword,
        radiusTunnelPreference,
        radiusTunnelPrivateGroupId,
        radiusTunnelServerEndpoint,
        radiusTunnelType,
        radiusUserCategory,
        radiusVSA,
        radiusExpiration,
        dialupAccess,
        radiusNASIpAddress,
        radiusReplyMessage,
        radiusControlAttribute,
        radiusReplyAttribute,
        radiusRequestAttribute,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['radiusprofile'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [4, 3, 2, 1],
        id_at_freeRadius
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION radiusprofile */

/* eslint-enable */
