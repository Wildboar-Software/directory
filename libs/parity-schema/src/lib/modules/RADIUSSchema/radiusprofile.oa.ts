/* eslint-disable */
import {
    itu_t,
    itu_r,
    ccitt,
    iso,
    joint_iso_itu_t,
    joint_iso_ccitt,
    OPTIONAL,
    BOOLEAN,
    INTEGER,
    BIT_STRING,
    OCTET_STRING,
    NULL,
    OBJECT_IDENTIFIER,
    ObjectDescriptor,
    EXTERNAL,
    REAL,
    INSTANCE_OF,
    ENUMERATED,
    EMBEDDED_PDV,
    UTF8String,
    RELATIVE_OID,
    SEQUENCE,
    SEQUENCE_OF,
    SET,
    SET_OF,
    GraphicString,
    NumericString,
    VisibleString,
    PrintableString,
    ISO646String,
    TeletexString,
    GeneralString,
    T61String,
    UniversalString,
    VideotexString,
    BMPString,
    IA5String,
    CharacterString,
    UTCTime,
    GeneralizedTime,
    TIME,
    DATE,
    TIME_OF_DAY,
    DATE_TIME,
    DURATION,
    OID_IRI,
    RELATIVE_OID_IRI,
    TRUE,
    FALSE,
    TRUE_BIT,
    FALSE_BIT,
    PLUS_INFINITY,
    MINUS_INFINITY,
    NOT_A_NUMBER,
    TYPE_IDENTIFIER,
    ABSTRACT_SYNTAX,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    ASN1Construction as _Construction,
    ASN1UniversalType as _UniversalType,
    ObjectIdentifier as _OID,
    External as _External,
    EmbeddedPDV as _PDV,
    ASN1ConstructionError as _ConstructionError,
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";
import { OBJECT_CLASS } from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
export { OBJECT_CLASS } from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
import { ObjectClassKind, _enum_for_ObjectClassKind, ObjectClassKind_abstract /* IMPORTED_LONG_ENUMERATION_ITEM */, abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */, ObjectClassKind_structural /* IMPORTED_LONG_ENUMERATION_ITEM */, structural /* IMPORTED_SHORT_ENUMERATION_ITEM */, ObjectClassKind_auxiliary /* IMPORTED_LONG_ENUMERATION_ITEM */, auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */, _decode_ObjectClassKind, _encode_ObjectClassKind } from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
export { ObjectClassKind, _enum_for_ObjectClassKind, ObjectClassKind_abstract /* IMPORTED_LONG_ENUMERATION_ITEM */, abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */, ObjectClassKind_structural /* IMPORTED_LONG_ENUMERATION_ITEM */, structural /* IMPORTED_SHORT_ENUMERATION_ITEM */, ObjectClassKind_auxiliary /* IMPORTED_LONG_ENUMERATION_ITEM */, auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */, _decode_ObjectClassKind, _encode_ObjectClassKind } from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
export { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
import { top } from "@wildboar/x500/src/lib/modules/InformationFramework/top.oa";
export { top } from "@wildboar/x500/src/lib/modules/InformationFramework/top.oa";
import { radiusArapFeatures } from "../RADIUSSchema/radiusArapFeatures.oa";
export { radiusArapFeatures } from "../RADIUSSchema/radiusArapFeatures.oa";
import { radiusArapSecurity } from "../RADIUSSchema/radiusArapSecurity.oa";
export { radiusArapSecurity } from "../RADIUSSchema/radiusArapSecurity.oa";
import { radiusArapZoneAccess } from "../RADIUSSchema/radiusArapZoneAccess.oa";
export { radiusArapZoneAccess } from "../RADIUSSchema/radiusArapZoneAccess.oa";
import { radiusAuthType } from "../RADIUSSchema/radiusAuthType.oa";
export { radiusAuthType } from "../RADIUSSchema/radiusAuthType.oa";
import { radiusCallbackId } from "../RADIUSSchema/radiusCallbackId.oa";
export { radiusCallbackId } from "../RADIUSSchema/radiusCallbackId.oa";
import { radiusCallbackNumber } from "../RADIUSSchema/radiusCallbackNumber.oa";
export { radiusCallbackNumber } from "../RADIUSSchema/radiusCallbackNumber.oa";
import { radiusCalledStationId } from "../RADIUSSchema/radiusCalledStationId.oa";
export { radiusCalledStationId } from "../RADIUSSchema/radiusCalledStationId.oa";
import { radiusCallingStationId } from "../RADIUSSchema/radiusCallingStationId.oa";
export { radiusCallingStationId } from "../RADIUSSchema/radiusCallingStationId.oa";
import { radiusClass } from "../RADIUSSchema/radiusClass.oa";
export { radiusClass } from "../RADIUSSchema/radiusClass.oa";
import { radiusClientIPAddress } from "../RADIUSSchema/radiusClientIPAddress.oa";
export { radiusClientIPAddress } from "../RADIUSSchema/radiusClientIPAddress.oa";
import { radiusFilterId } from "../RADIUSSchema/radiusFilterId.oa";
export { radiusFilterId } from "../RADIUSSchema/radiusFilterId.oa";
import { radiusFramedAppleTalkLink } from "../RADIUSSchema/radiusFramedAppleTalkLink.oa";
export { radiusFramedAppleTalkLink } from "../RADIUSSchema/radiusFramedAppleTalkLink.oa";
import { radiusFramedAppleTalkNetwork } from "../RADIUSSchema/radiusFramedAppleTalkNetwork.oa";
export { radiusFramedAppleTalkNetwork } from "../RADIUSSchema/radiusFramedAppleTalkNetwork.oa";
import { radiusFramedAppleTalkZone } from "../RADIUSSchema/radiusFramedAppleTalkZone.oa";
export { radiusFramedAppleTalkZone } from "../RADIUSSchema/radiusFramedAppleTalkZone.oa";
import { radiusFramedCompression } from "../RADIUSSchema/radiusFramedCompression.oa";
export { radiusFramedCompression } from "../RADIUSSchema/radiusFramedCompression.oa";
import { radiusFramedIPAddress } from "../RADIUSSchema/radiusFramedIPAddress.oa";
export { radiusFramedIPAddress } from "../RADIUSSchema/radiusFramedIPAddress.oa";
import { radiusFramedIPNetmask } from "../RADIUSSchema/radiusFramedIPNetmask.oa";
export { radiusFramedIPNetmask } from "../RADIUSSchema/radiusFramedIPNetmask.oa";
import { radiusFramedIPXNetwork } from "../RADIUSSchema/radiusFramedIPXNetwork.oa";
export { radiusFramedIPXNetwork } from "../RADIUSSchema/radiusFramedIPXNetwork.oa";
import { radiusFramedMTU } from "../RADIUSSchema/radiusFramedMTU.oa";
export { radiusFramedMTU } from "../RADIUSSchema/radiusFramedMTU.oa";
import { radiusFramedProtocol } from "../RADIUSSchema/radiusFramedProtocol.oa";
export { radiusFramedProtocol } from "../RADIUSSchema/radiusFramedProtocol.oa";
import { radiusAttribute } from "../RADIUSSchema/radiusAttribute.oa";
export { radiusAttribute } from "../RADIUSSchema/radiusAttribute.oa";
import { radiusFramedRoute } from "../RADIUSSchema/radiusFramedRoute.oa";
export { radiusFramedRoute } from "../RADIUSSchema/radiusFramedRoute.oa";
import { radiusFramedRouting } from "../RADIUSSchema/radiusFramedRouting.oa";
export { radiusFramedRouting } from "../RADIUSSchema/radiusFramedRouting.oa";
import { radiusIdleTimeout } from "../RADIUSSchema/radiusIdleTimeout.oa";
export { radiusIdleTimeout } from "../RADIUSSchema/radiusIdleTimeout.oa";
import { radiusGroupName } from "../RADIUSSchema/radiusGroupName.oa";
export { radiusGroupName } from "../RADIUSSchema/radiusGroupName.oa";
import { radiusHint } from "../RADIUSSchema/radiusHint.oa";
export { radiusHint } from "../RADIUSSchema/radiusHint.oa";
import { radiusHuntgroupName } from "../RADIUSSchema/radiusHuntgroupName.oa";
export { radiusHuntgroupName } from "../RADIUSSchema/radiusHuntgroupName.oa";
import { radiusLoginIPHost } from "../RADIUSSchema/radiusLoginIPHost.oa";
export { radiusLoginIPHost } from "../RADIUSSchema/radiusLoginIPHost.oa";
import { radiusLoginLATGroup } from "../RADIUSSchema/radiusLoginLATGroup.oa";
export { radiusLoginLATGroup } from "../RADIUSSchema/radiusLoginLATGroup.oa";
import { radiusLoginLATNode } from "../RADIUSSchema/radiusLoginLATNode.oa";
export { radiusLoginLATNode } from "../RADIUSSchema/radiusLoginLATNode.oa";
import { radiusLoginLATPort } from "../RADIUSSchema/radiusLoginLATPort.oa";
export { radiusLoginLATPort } from "../RADIUSSchema/radiusLoginLATPort.oa";
import { radiusLoginLATService } from "../RADIUSSchema/radiusLoginLATService.oa";
export { radiusLoginLATService } from "../RADIUSSchema/radiusLoginLATService.oa";
import { radiusLoginService } from "../RADIUSSchema/radiusLoginService.oa";
export { radiusLoginService } from "../RADIUSSchema/radiusLoginService.oa";
import { radiusLoginTCPPort } from "../RADIUSSchema/radiusLoginTCPPort.oa";
export { radiusLoginTCPPort } from "../RADIUSSchema/radiusLoginTCPPort.oa";
import { radiusLoginTime } from "../RADIUSSchema/radiusLoginTime.oa";
export { radiusLoginTime } from "../RADIUSSchema/radiusLoginTime.oa";
import { radiusPasswordRetry } from "../RADIUSSchema/radiusPasswordRetry.oa";
export { radiusPasswordRetry } from "../RADIUSSchema/radiusPasswordRetry.oa";
import { radiusPortLimit } from "../RADIUSSchema/radiusPortLimit.oa";
export { radiusPortLimit } from "../RADIUSSchema/radiusPortLimit.oa";
import { radiusPrompt } from "../RADIUSSchema/radiusPrompt.oa";
export { radiusPrompt } from "../RADIUSSchema/radiusPrompt.oa";
import { radiusProxyToRealm } from "../RADIUSSchema/radiusProxyToRealm.oa";
export { radiusProxyToRealm } from "../RADIUSSchema/radiusProxyToRealm.oa";
import { radiusRealm } from "../RADIUSSchema/radiusRealm.oa";
export { radiusRealm } from "../RADIUSSchema/radiusRealm.oa";
import { radiusReplicateToRealm } from "../RADIUSSchema/radiusReplicateToRealm.oa";
export { radiusReplicateToRealm } from "../RADIUSSchema/radiusReplicateToRealm.oa";
import { radiusServiceType } from "../RADIUSSchema/radiusServiceType.oa";
export { radiusServiceType } from "../RADIUSSchema/radiusServiceType.oa";
import { radiusSessionTimeout } from "../RADIUSSchema/radiusSessionTimeout.oa";
export { radiusSessionTimeout } from "../RADIUSSchema/radiusSessionTimeout.oa";
import { radiusStripUserName } from "../RADIUSSchema/radiusStripUserName.oa";
export { radiusStripUserName } from "../RADIUSSchema/radiusStripUserName.oa";
import { radiusTerminationAction } from "../RADIUSSchema/radiusTerminationAction.oa";
export { radiusTerminationAction } from "../RADIUSSchema/radiusTerminationAction.oa";
import { radiusTunnelClientEndpoint } from "../RADIUSSchema/radiusTunnelClientEndpoint.oa";
export { radiusTunnelClientEndpoint } from "../RADIUSSchema/radiusTunnelClientEndpoint.oa";
import { radiusProfileDN } from "../RADIUSSchema/radiusProfileDN.oa";
export { radiusProfileDN } from "../RADIUSSchema/radiusProfileDN.oa";
import { radiusSimultaneousUse } from "../RADIUSSchema/radiusSimultaneousUse.oa";
export { radiusSimultaneousUse } from "../RADIUSSchema/radiusSimultaneousUse.oa";
import { radiusTunnelAssignmentId } from "../RADIUSSchema/radiusTunnelAssignmentId.oa";
export { radiusTunnelAssignmentId } from "../RADIUSSchema/radiusTunnelAssignmentId.oa";
import { radiusTunnelMediumType } from "../RADIUSSchema/radiusTunnelMediumType.oa";
export { radiusTunnelMediumType } from "../RADIUSSchema/radiusTunnelMediumType.oa";
import { radiusTunnelPassword } from "../RADIUSSchema/radiusTunnelPassword.oa";
export { radiusTunnelPassword } from "../RADIUSSchema/radiusTunnelPassword.oa";
import { radiusTunnelPreference } from "../RADIUSSchema/radiusTunnelPreference.oa";
export { radiusTunnelPreference } from "../RADIUSSchema/radiusTunnelPreference.oa";
import { radiusTunnelPrivateGroupId } from "../RADIUSSchema/radiusTunnelPrivateGroupId.oa";
export { radiusTunnelPrivateGroupId } from "../RADIUSSchema/radiusTunnelPrivateGroupId.oa";
import { radiusTunnelServerEndpoint } from "../RADIUSSchema/radiusTunnelServerEndpoint.oa";
export { radiusTunnelServerEndpoint } from "../RADIUSSchema/radiusTunnelServerEndpoint.oa";
import { radiusTunnelType } from "../RADIUSSchema/radiusTunnelType.oa";
export { radiusTunnelType } from "../RADIUSSchema/radiusTunnelType.oa";
import { radiusUserCategory } from "../RADIUSSchema/radiusUserCategory.oa";
export { radiusUserCategory } from "../RADIUSSchema/radiusUserCategory.oa";
import { radiusVSA } from "../RADIUSSchema/radiusVSA.oa";
export { radiusVSA } from "../RADIUSSchema/radiusVSA.oa";
import { radiusExpiration } from "../RADIUSSchema/radiusExpiration.oa";
export { radiusExpiration } from "../RADIUSSchema/radiusExpiration.oa";
import { dialupAccess } from "../RADIUSSchema/dialupAccess.oa";
export { dialupAccess } from "../RADIUSSchema/dialupAccess.oa";
import { radiusNASIpAddress } from "../RADIUSSchema/radiusNASIpAddress.oa";
export { radiusNASIpAddress } from "../RADIUSSchema/radiusNASIpAddress.oa";
import { radiusReplyMessage } from "../RADIUSSchema/radiusReplyMessage.oa";
export { radiusReplyMessage } from "../RADIUSSchema/radiusReplyMessage.oa";
import { radiusControlAttribute } from "../RADIUSSchema/radiusControlAttribute.oa";
export { radiusControlAttribute } from "../RADIUSSchema/radiusControlAttribute.oa";
import { radiusReplyAttribute } from "../RADIUSSchema/radiusReplyAttribute.oa";
export { radiusReplyAttribute } from "../RADIUSSchema/radiusReplyAttribute.oa";
import { radiusRequestAttribute } from "../RADIUSSchema/radiusRequestAttribute.oa";
export { radiusRequestAttribute } from "../RADIUSSchema/radiusRequestAttribute.oa";
import { id_at_freeRadius } from "../RADIUSSchema/id-at-freeRadius.va";
export { id_at_freeRadius } from "../RADIUSSchema/id-at-freeRadius.va";


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
export
const radiusprofile: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&kind": auxiliary /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ radiusArapFeatures, radiusArapSecurity, radiusArapZoneAccess, radiusAuthType, radiusCallbackId, radiusCallbackNumber, radiusCalledStationId, radiusCallingStationId, radiusClass, radiusClientIPAddress, radiusFilterId, radiusFramedAppleTalkLink, radiusFramedAppleTalkNetwork, radiusFramedAppleTalkZone, radiusFramedCompression, radiusFramedIPAddress, radiusFramedIPNetmask, radiusFramedIPXNetwork, radiusFramedMTU, radiusFramedProtocol, radiusAttribute, radiusFramedRoute, radiusFramedRouting, radiusIdleTimeout, radiusGroupName, radiusHint, radiusHuntgroupName, radiusLoginIPHost, radiusLoginLATGroup, radiusLoginLATNode, radiusLoginLATPort, radiusLoginLATService, radiusLoginService, radiusLoginTCPPort, radiusLoginTime, radiusPasswordRetry, radiusPortLimit, radiusPrompt, radiusProxyToRealm, radiusRealm, radiusReplicateToRealm, radiusServiceType, radiusSessionTimeout, radiusStripUserName, radiusTerminationAction, radiusTunnelClientEndpoint, radiusProfileDN, radiusSimultaneousUse, radiusTunnelAssignmentId, radiusTunnelMediumType, radiusTunnelPassword, radiusTunnelPreference, radiusTunnelPrivateGroupId, radiusTunnelServerEndpoint, radiusTunnelType, radiusUserCategory, radiusVSA, radiusExpiration, dialupAccess, radiusNASIpAddress, radiusReplyMessage, radiusControlAttribute, radiusReplyAttribute, radiusRequestAttribute, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["radiusprofile"] /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([4, 3, 2, 1,], id_at_freeRadius) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION radiusprofile */

/* eslint-enable */
