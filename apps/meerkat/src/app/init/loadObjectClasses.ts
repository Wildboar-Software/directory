import { Context } from "@wildboar/meerkat-types";
import objectClassFromInformationObject from "./objectClassFromInformationObject";
import * as x500oc from "@wildboar/x500/src/lib/collections/objectClasses";
import { ObjectClassKind as PrismaObjectClassKind } from "@prisma/client";
import {
    ObjectClassKind,
    ObjectClassKind_abstract,
    ObjectClassKind_auxiliary,
    ObjectClassKind_structural,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import { ObjectIdentifier } from "asn1-ts";
import { AssertionError } from "assert";
import {
    pwdAdminSubentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/pwdAdminSubentry.oa";
import { pwdModifyEntryAllowed } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdModifyEntryAllowed.oa";
import { pwdChangeAllowed } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdChangeAllowed.oa";
import { pwdMaxAge } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMaxAge.oa";
import { pwdExpiryAge } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdExpiryAge.oa";
import { pwdMinLength } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMinLength.oa";
import { pwdVocabulary } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdVocabulary.oa";
import { pwdAlphabet } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdAlphabet.oa";
import { pwdDictionaries } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdDictionaries.oa";
import { pwdExpiryWarning } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdExpiryWarning.oa";
import { pwdGraces } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdGraces.oa";
import { pwdFailureDuration } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdFailureDuration.oa";
import { pwdLockoutDuration } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdLockoutDuration.oa";
import { pwdMaxFailures } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMaxFailures.oa";
import { pwdMaxTimeInHistory } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMaxTimeInHistory.oa";
import { pwdMinTimeInHistory } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMinTimeInHistory.oa";
import { pwdHistorySlots } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdHistorySlots.oa";
import { pwdRecentlyExpiredDuration } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdRecentlyExpiredDuration.oa";
import { pwdEncAlg } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdEncAlg.oa";

// X.400 Object Classes
import {
    mhs_distribution_list,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-distribution-list.oa";
import {
    mhs_message_store,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-message-store.oa";
import {
    mhs_message_transfer_agent,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-message-transfer-agent.oa";
import {
    mhs_user,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-user.oa";
import {
    mhs_user_agent,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-user-agent.oa";
import {
    routingCollective,
} from "@wildboar/x400/src/lib/modules/MHSRoutingDirectoryObjects/routingCollective.oa";
import {
    routingMTA,
} from "@wildboar/x400/src/lib/modules/MHSRoutingDirectoryObjects/routingMTA.oa";
import {
    connectionGroup,
} from "@wildboar/x400/src/lib/modules/MHSRoutingDirectoryObjects/connectionGroup.oa";
import {
    mTAInformation,
} from "@wildboar/x400/src/lib/modules/MHSRoutingDirectoryObjects/mTAInformation.oa";
import {
    oRAddressElement,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/oRAddressElement.oa";
import {
    oRAddressSubtreeBase,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/oRAddressSubtreeBase.oa";
import {
    mHSCountry,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSCountry.oa";
import {
    mHSADMD,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSADMD.oa";
import {
    mHSPRMD,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSPRMD.oa";
import {
    mHSOrganization,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSOrganization.oa";
import {
    mHSOrganizationalUnit,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSOrganizationalUnit.oa";
import {
    mHSCommonName,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSCommonName.oa";
import {
    mHSSurname,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSSurname.oa";
import {
    mHSGivenName,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSGivenName.oa";
import {
    mHSInitials,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSInitials.oa";
import {
    mHSGenerationQualifier,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSGenerationQualifier.oa";
import {
    mHSNetworkAddress,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSNetworkAddress.oa";
import {
    mHSExtendedNetworkAddress,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSExtendedNetworkAddress.oa";
import {
    mHSTerminalIdentifier,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSTerminalIdentifier.oa";
import {
    mHSTerminalType,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSTerminalType.oa";
import {
    mHSNumericUserIdentifier,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSNumericUserIdentifier.oa";
import {
    mHSPDSName,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSPDSName.oa";
import {
    mHSPhysicalDeliveryCountry,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSPhysicalDeliveryCountry.oa";
import {
    mHSPostalCode,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSPostalCode.oa";
import {
    edi_user,
} from "@wildboar/x400/src/lib/modules/EDIMUseOfDirectory/edi-user.oa";
import {
    edi_user_agent,
} from "@wildboar/x400/src/lib/modules/EDIMUseOfDirectory/edi-user-agent.oa";
import {
    edi_message_store,
} from "@wildboar/x400/src/lib/modules/EDIMUseOfDirectory/edi-message-store.oa";

// X.700 Object Classes
import {
    asn1Module,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/asn1Module.oa";
import {
    managementAction,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/managementAction.oa";
import {
    managementAttributeGroup,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/managementAttributeGroup.oa";
import {
    managementAttribute,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/managementAttribute.oa";
import {
    managementBehaviour,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/managementBehaviour.oa";
import {
    managementDocument,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/managementDocument.oa";
import {
    managementNameBinding,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/managementNameBinding.oa";
import {
    managementNotification,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/managementNotification.oa";
import {
    managementObjectClass,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/managementObjectClass.oa";
import {
    managementPackage,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/managementPackage.oa";
import {
    managementParameter,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/managementParameter.oa";
import {
    managementTemplate,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/managementTemplate.oa";
import {
    registeredInformation,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/registeredInformation.oa";
import {
    managementRelationshipClass,
} from "@wildboar/x700/src/lib/modules/GrmDefinitionDirectoryASN1Module/managementRelationshipClass.oa";
import {
    managementRelationshipMapping,
} from "@wildboar/x700/src/lib/modules/GrmDefinitionDirectoryASN1Module/managementRelationshipMapping.oa";
import {
    cMISE,
} from "@wildboar/x700/src/lib/modules/RepertoireDirectoryASN1Module/cMISE.oa";
import {
    sMASE,
} from "@wildboar/x700/src/lib/modules/RepertoireDirectoryASN1Module/sMASE.oa";

// PKCS #9 Object Classes
import {
    pkcsEntity,
} from "@wildboar/pkcs/src/lib/modules/PKCS-9/pkcsEntity.oa";
import {
    naturalPerson,
} from "@wildboar/pkcs/src/lib/modules/PKCS-9/naturalPerson.oa";

// IANA LDAP Parity Schema
import {
    ads_authenticationInterceptor,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-authenticationInterceptor.oa";
import {
    ads_authenticator,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-authenticator.oa";
import {
    ads_authenticatorImpl,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-authenticatorImpl.oa";
import {
    ads_base,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-base.oa";
import {
    ads_changeLog,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-changeLog.oa";
import {
    ads_changePasswordServer,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-changePasswordServer.oa";
import {
    ads_delegatingAuthenticator,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-delegatingAuthenticator.oa";
import {
    ads_dhcpServer,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-dhcpServer.oa";
import {
    ads_directoryService,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-directoryService.oa";
import {
    ads_dnsServer,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-dnsServer.oa";
import {
    ads_dsBasedServer,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-dsBasedServer.oa";
import {
    ads_extendedOpHandler,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-extendedOpHandler.oa";
import {
    ads_hashInterceptor,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-hashInterceptor.oa";
import {
    ads_httpServer,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-httpServer.oa";
import {
    ads_httpWebApp,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-httpWebApp.oa";
import {
    ads_index,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-index.oa";
import {
    ads_interceptor,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-interceptor.oa";
import {
    ads_jdbmIndex,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-jdbmIndex.oa";
import {
    ads_jdbmPartition,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-jdbmPartition.oa";
import {
    ads_journal,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-journal.oa";
import {
    ads_kdcServer,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-kdcServer.oa";
import {
    ads_ldapServer,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-ldapServer.oa";
import {
    ads_mavibotIndex,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-mavibotIndex.oa";
import {
    ads_mavibotPartition,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-mavibotPartition.oa";
import {
    ads_ntpServer,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-ntpServer.oa";
import {
    ads_partition,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-partition.oa";
import {
    ads_passwordPolicy,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-passwordPolicy.oa";
import {
    ads_replConsumer,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replConsumer.oa";
import {
    ads_replEventLog,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replEventLog.oa";
import {
    ads_saslMechHandler,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-saslMechHandler.oa";
import {
    ads_server,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-server.oa";
import {
    ads_tcpTransport,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-tcpTransport.oa";
import {
    ads_transport,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-transport.oa";
import {
    ads_udpTransport,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-udpTransport.oa";
import {
    apacheDnsAbstractRecord,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsAbstractRecord.oa";
import {
    apacheDnsAddressRecord,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsAddressRecord.oa";
import {
    apacheDnsCanonicalNameRecord,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsCanonicalNameRecord.oa";
import {
    apacheDnsMailExchangeRecord,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsMailExchangeRecord.oa";
import {
    apacheDnsNameServerRecord,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsNameServerRecord.oa";
import {
    apacheDnsPointerRecord,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsPointerRecord.oa";
import {
    apacheDnsReferralAddress,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsReferralAddress.oa";
import {
    apacheDnsReferralNameServer,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsReferralNameServer.oa";
import {
    apacheDnsServiceRecord,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsServiceRecord.oa";
import {
    apacheDnsStartOfAuthorityRecord,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsStartOfAuthorityRecord.oa";
import {
    apacheDnsTextRecord,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsTextRecord.oa";
import {
    authPasswordObject,
} from "@wildboar/parity-schema/src/lib/modules/AuthPasswordSchema/authPasswordObject.oa";
import {
    automount,
} from "@wildboar/parity-schema/src/lib/modules/AutoFS-Schema/automount.oa";
import {
    automountMap,
} from "@wildboar/parity-schema/src/lib/modules/AutoFS-Schema/automountMap.oa";
import {
    corbaContainer,
} from "@wildboar/parity-schema/src/lib/modules/CORBA/corbaContainer.oa";
import {
    corbaObject,
} from "@wildboar/parity-schema/src/lib/modules/CORBA/corbaObject.oa";
import {
    corbaObjectReference,
} from "@wildboar/parity-schema/src/lib/modules/CORBA/corbaObjectReference.oa";
import {
    account,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/account.oa";
import {
    document,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/document.oa";
import {
    documentSeries,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/documentSeries.oa";
import {
    domain,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/domain.oa";
import {
    domainRelatedObject,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/domainRelatedObject.oa";
import {
    friendlyCountry,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/friendlyCountry.oa";
import {
    pilotObject,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/pilotObject.oa";
import {
    pilotOrganization,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/pilotOrganization.oa";
import {
    pilotPerson,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/pilotPerson.oa";
import {
    rFC822localPart,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/rFC822localPart.oa";
import {
    room,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/room.oa";
import {
    dhcpClass,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpClass.oa";
import {
    dhcpGroup,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpGroup.oa";
import {
    dhcpHost,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpHost.oa";
import {
    dhcpLeases,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpLeases.oa";
import {
    dhcpLog,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpLog.oa";
import {
    dhcpOptions,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpOptions.oa";
import {
    dhcpPool,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpPool.oa";
import {
    dhcpServer,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpServer.oa";
import {
    dhcpService,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpService.oa";
import {
    dhcpSharedNetwork,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpSharedNetwork.oa";
import {
    dhcpSubClass,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpSubClass.oa";
import {
    dhcpSubnet,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpSubnet.oa";
// import {
//     glue as ds389Glue,
// } from "@wildboar/parity-schema/src/lib/modules/DS389CommonSchema/glue.oa";
import {
    changeLogEntry,
} from "@wildboar/parity-schema/src/lib/modules/DSEE/changeLogEntry.oa";
import {
    duaConfigProfile,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/duaConfigProfile.oa";
import {
    groupOfURLs,
} from "@wildboar/parity-schema/src/lib/modules/DynGroup/groupOfURLs.oa";
import {
    eduPerson,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPerson.oa";
import {
    fedfsFsl,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsFsl.oa";
import {
    fedfsFsn,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsFsn.oa";
import {
    fedfsNfsFsl,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsFsl.oa";
import {
    fedfsNsdbContainerInfo,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNsdbContainerInfo.oa";
import {
    mailGroup,
} from "@wildboar/parity-schema/src/lib/modules/InetMailSchema/mailGroup.oa";
import {
    mailUser,
} from "@wildboar/parity-schema/src/lib/modules/InetMailSchema/mailUser.oa";
import {
    transportTable,
} from "@wildboar/parity-schema/src/lib/modules/InetMailSchema/transportTable.oa";
import {
    inetOrgPerson,
} from "@wildboar/parity-schema/src/lib/modules/InetOrgPerson/inetOrgPerson.oa";
import {
    javaContainer,
} from "@wildboar/parity-schema/src/lib/modules/Java/javaContainer.oa";
import {
    javaMarshalledObject,
} from "@wildboar/parity-schema/src/lib/modules/Java/javaMarshalledObject.oa";
import {
    javaNamingReference,
} from "@wildboar/parity-schema/src/lib/modules/Java/javaNamingReference.oa";
import {
    javaObject,
} from "@wildboar/parity-schema/src/lib/modules/Java/javaObject.oa";
import {
    javaSerializedObject,
} from "@wildboar/parity-schema/src/lib/modules/Java/javaSerializedObject.oa";
import {
    krb5KDCEntry,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5KDCEntry.oa";
import {
    krb5Principal,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5Principal.oa";
import {
    krb5Realm,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5Realm.oa";
import {
    referral,
} from "@wildboar/parity-schema/src/lib/modules/LDAPReferral/referral.oa";
import {
    pgpKeyInfo,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpKeyInfo.oa";
import {
    pgpServerInfo,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpServerInfo.oa";
import {
    mozillaAbPersonObsolete,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/mozillaAbPersonObsolete.oa";
import {
    namedObject,
} from "@wildboar/parity-schema/src/lib/modules/NamedObject/namedObject.oa";
import {
    namedPolicy,
} from "@wildboar/parity-schema/src/lib/modules/NamedObject/namedPolicy.oa";
import {
    authorizedServiceObject,
} from "@wildboar/parity-schema/src/lib/modules/NameServiceAdditionalSchema/authorizedServiceObject.oa";
import {
    bootableDevice,
} from "@wildboar/parity-schema/src/lib/modules/NIS/bootableDevice.oa";
import {
    ieee802Device,
} from "@wildboar/parity-schema/src/lib/modules/NIS/ieee802Device.oa";
import {
    ipHost,
} from "@wildboar/parity-schema/src/lib/modules/NIS/ipHost.oa";
import {
    ipNetwork,
} from "@wildboar/parity-schema/src/lib/modules/NIS/ipNetwork.oa";
import {
    ipProtocol,
} from "@wildboar/parity-schema/src/lib/modules/NIS/ipProtocol.oa";
import {
    ipService,
} from "@wildboar/parity-schema/src/lib/modules/NIS/ipService.oa";
import {
    nisMap,
} from "@wildboar/parity-schema/src/lib/modules/NIS/nisMap.oa";
import {
    nisNetgroup,
} from "@wildboar/parity-schema/src/lib/modules/NIS/nisNetgroup.oa";
import {
    nisObject,
} from "@wildboar/parity-schema/src/lib/modules/NIS/nisObject.oa";
import {
    oncRpc,
} from "@wildboar/parity-schema/src/lib/modules/NIS/oncRpc.oa";
import {
    posixAccount,
} from "@wildboar/parity-schema/src/lib/modules/NIS/posixAccount.oa";
import {
    posixGroup,
} from "@wildboar/parity-schema/src/lib/modules/NIS/posixGroup.oa";
import {
    shadowAccount,
} from "@wildboar/parity-schema/src/lib/modules/NIS/shadowAccount.oa";
import {
    dNSDomain,
} from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/dNSDomain.oa";
import {
    groupOfEntries,
} from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/groupOfEntries.oa";
// import {
//     pilotObject,
// } from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/pilotObject.oa";
// import {
//     pilotOrganization,
// } from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/pilotOrganization.oa";
// import {
//     pilotPerson,
// } from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/pilotPerson.oa";
// import {
//     uidObject,
// } from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/uidObject.oa";
import {
    untypedObject,
} from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/untypedObject.oa";
// import {
//     glue as openldapGlue,
// } from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/glue.oa";
import {
    openLDAPdisplayableObject,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/openLDAPdisplayableObject.oa";
import {
    openLDAPorg,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/openLDAPorg.oa";
import {
    openLDAPou,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/openLDAPou.oa";
import {
    openLDAPperson,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/openLDAPperson.oa";
import {
    openLDAProotDSE,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/openLDAProotDSE.oa";
import {
    syncConsumerSubentry,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/syncConsumerSubentry.oa";
import {
    labeledURIObject,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAPCoreSchema/labeledURIObject.oa";
import {
    simpleSecurityObject,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAPCoreSchema/simpleSecurityObject.oa";
import {
    uidObject,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAPCoreSchema/uidObject.oa";
import {
    pamConfig,
} from "@wildboar/parity-schema/src/lib/modules/PAMSchema/pamConfig.oa";
import {
    pureFTPdUser,
} from "@wildboar/parity-schema/src/lib/modules/PureFTPdSchema/pureFTPdUser.oa";
import {
    qmailGroup,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qmailGroup.oa";
import {
    qmailUser,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qmailUser.oa";
import {
    freeradiusDhcpv4Gateway,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/freeradiusDhcpv4Gateway.oa";
import {
    freeradiusDhcpv4Profile,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/freeradiusDhcpv4Profile.oa";
import {
    freeradiusDhcpv6Gateway,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/freeradiusDhcpv6Gateway.oa";
import {
    freeradiusDhcpv6Profile,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/freeradiusDhcpv6Profile.oa";
import {
    radiusacct,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusacct.oa";
import {
    radiusClient,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusClient.oa";
import {
    radiusObjectProfile,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusObjectProfile.oa";
import {
    radiusprofile,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusprofile.oa";
import {
    nisDomainObject,
} from "@wildboar/parity-schema/src/lib/modules/RFC2307bis/nisDomainObject.oa";
import {
    nisKeyObject,
} from "@wildboar/parity-schema/src/lib/modules/RFC2307bis/nisKeyObject.oa";
import {
    dynamicObject,
} from "@wildboar/parity-schema/src/lib/modules/RFC2589DynamicDirectory/dynamicObject.oa";
import {
    calEntry,
} from "@wildboar/parity-schema/src/lib/modules/RFC2739Calendar/calEntry.oa";
import {
    slpService,
} from "@wildboar/parity-schema/src/lib/modules/RFC2926ServiceLocationProtocolSchema/slpService.oa";
import {
    ldifLocationURLObject,
} from "@wildboar/parity-schema/src/lib/modules/RFC6109CertifiedElectronicMail/ldifLocationURLObject.oa";
import {
    provider,
} from "@wildboar/parity-schema/src/lib/modules/RFC6109CertifiedElectronicMail/provider.oa";
import {
    printerAbstract,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printerAbstract.oa";
import {
    printerIPP,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printerIPP.oa";
import {
    printerLPR,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printerLPR.oa";
import {
    printerService,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printerService.oa";
import {
    printerServiceAuxClass,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printerServiceAuxClass.oa";
import {
    slpServicePrinter,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/slpServicePrinter.oa";
import {
    sabayonProfile,
} from "@wildboar/parity-schema/src/lib/modules/SabayonSchema/sabayonProfile.oa";
import {
    sabayonProfileNameObject,
} from "@wildboar/parity-schema/src/lib/modules/SabayonSchema/sabayonProfileNameObject.oa";
import {
    sabayonProfileURLObject,
} from "@wildboar/parity-schema/src/lib/modules/SabayonSchema/sabayonProfileURLObject.oa";
import {
    sambaAccount,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/sambaAccount.oa";
import {
    sambaConfig,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaConfig.oa";
import {
    sambaConfigOption,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaConfigOption.oa";
import {
    sambaDomain,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaDomain.oa";
import {
    sambaGroupMapping,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaGroupMapping.oa";
import {
    sambaIdmapEntry,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaIdmapEntry.oa";
import {
    sambaPrivilege,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaPrivilege.oa";
import {
    sambaSamAccount,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaSamAccount.oa";
import {
    sambaShare,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaShare.oa";
import {
    sambaSidEntry,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaSidEntry.oa";
import {
    sambaTrustPassword,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaTrustPassword.oa";
import {
    sambaUnixIdPool,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaUnixIdPool.oa";
import {
    inetLocalMailRecipient,
} from "@wildboar/parity-schema/src/lib/modules/SendmailSchema/inetLocalMailRecipient.oa";
import {
    sudoRole,
} from "@wildboar/parity-schema/src/lib/modules/SudoSchema/sudoRole.oa";
import {
    distinguishedNameTableEntry,
} from "@wildboar/parity-schema/src/lib/modules/TableFramework/distinguishedNameTableEntry.oa";
import {
    table,
} from "@wildboar/parity-schema/src/lib/modules/TableFramework/table.oa";
import {
    tableEntry,
} from "@wildboar/parity-schema/src/lib/modules/TableFramework/tableEntry.oa";
import {
    textTableEntry,
} from "@wildboar/parity-schema/src/lib/modules/TableFramework/textTableEntry.oa";
import {
    uddiAddress,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiAddress.oa";
import {
    uddiBindingTemplate,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiBindingTemplate.oa";
import {
    uddiBusinessEntity,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiBusinessEntity.oa";
import {
    uddiBusinessService,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiBusinessService.oa";
import {
    uddiContact,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiContact.oa";
import {
    uddiPublisherAssertion,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiPublisherAssertion.oa";
import {
    uddiTModel,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiTModel.oa";
import {
    uddiTModelInstanceInfo,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiTModelInstanceInfo.oa";
import {
    uddiv3EntityObituary,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3EntityObituary.oa";
import {
    uddiv3Subscription,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3Subscription.oa";
import {
    vPIMUser,
} from "@wildboar/parity-schema/src/lib/modules/VPIMSchema/vPIMUser.oa";
import {
    traderEntry,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/traderEntry.oa";
import {
    traderPolicyEntry,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/traderPolicyEntry.oa";
import {
    serviceOfferEntry,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/serviceOfferEntry.oa";
import {
    traderLinkEntry,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/traderLinkEntry.oa";
import {
    proxyOfferEntry,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/proxyOfferEntry.oa";
import {
    interfaceEntry,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/interfaceEntry.oa";
import {
    securityUserInfo,
} from "@wildboar/parity-schema/src/lib/modules/IN-CS3-SCF-SDF-datatypes/securityUserInfo.oa";
import {
    tokensStock,
} from "@wildboar/parity-schema/src/lib/modules/IN-CS3-SCF-SDF-datatypes/tokensStock.oa";
import {
    uptProvider,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/uptProvider.oa";
import {
    partner,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/partner.oa";
import {
    agreedService,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/agreedService.oa";
import {
    administrativeUnit,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/administrativeUnit.oa";
import {
    userProfile,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/userProfile.oa";
import {
    userProfileAlias,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/userProfileAlias.oa";
import {
    calledUptUser,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/calledUptUser.oa";
import {
    callingUptUser,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/callingUptUser.oa";
import {
    supplementaryService,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/supplementaryService.oa";
import {
    callForwarding,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/callForwarding.oa";
import {
    commObject,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/commObject.oa";
import {
    commURIObject,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/commURIObject.oa";
import {
    h323Identity,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h323Identity.oa";
import {
    h235Identity,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h235Identity.oa";
import {
    h320Identity,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h320Identity.oa";
import {
    sIPIdentity,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/sIPIdentity.oa";
import {
    genericIdentity,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/genericIdentity.oa";
import {
    callPreferenceURIObject,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/callPreferenceURIObject.oa";

function prismaOCK2OCK (ock: PrismaObjectClassKind): ObjectClassKind {
    switch (ock) {
    case (PrismaObjectClassKind.ABSTRACT): {
        return ObjectClassKind_abstract;
    }
    case (PrismaObjectClassKind.AUXILIARY): {
        return ObjectClassKind_auxiliary;
    }
    case (PrismaObjectClassKind.STRUCTURAL): {
        return ObjectClassKind_structural;
    }
    default: throw new AssertionError();
    }
}

/**
 * @summary Initialize Meerkat DSA's internal index of known object classes.
 * @description
 *
 * Initialize Meerkat DSA's internal index of known object classes.
 *
 * @param ctx The context object
 *
 * @function
 * @async
 */
export
async function loadObjectClasses (ctx: Context): Promise<void> {
    const objectClassInfoObjects = [
        ...Object.values(x500oc),
        mhs_distribution_list,
        mhs_message_store,
        mhs_message_transfer_agent,
        mhs_user,
        mhs_user_agent,
        routingCollective,
        routingMTA,
        connectionGroup,
        mTAInformation,
        oRAddressElement,
        oRAddressSubtreeBase,
        mHSCountry,
        mHSADMD,
        mHSPRMD,
        mHSOrganization,
        mHSOrganizationalUnit,
        mHSCommonName,
        mHSSurname,
        mHSGivenName,
        mHSInitials,
        mHSGenerationQualifier,
        mHSNetworkAddress,
        mHSExtendedNetworkAddress,
        mHSTerminalIdentifier,
        mHSTerminalType,
        mHSNumericUserIdentifier,
        mHSPDSName,
        mHSPhysicalDeliveryCountry,
        mHSPostalCode,
        edi_user,
        edi_user_agent,
        edi_message_store,
        asn1Module,
        managementAction,
        managementAttributeGroup,
        managementAttribute,
        managementBehaviour,
        managementDocument,
        managementNameBinding,
        managementNotification,
        managementObjectClass,
        managementPackage,
        managementParameter,
        managementTemplate,
        registeredInformation,
        managementRelationshipClass,
        managementRelationshipMapping,
        cMISE,
        sMASE,
        pkcsEntity,
        naturalPerson,

        // IANA LDAP Parity Schema
        ads_authenticationInterceptor,
        ads_authenticator,
        ads_authenticatorImpl,
        ads_base,
        ads_changeLog,
        ads_changePasswordServer,
        ads_delegatingAuthenticator,
        ads_dhcpServer,
        ads_directoryService,
        ads_dnsServer,
        ads_dsBasedServer,
        ads_extendedOpHandler,
        ads_hashInterceptor,
        ads_httpServer,
        ads_httpWebApp,
        ads_index,
        ads_interceptor,
        ads_jdbmIndex,
        ads_jdbmPartition,
        ads_journal,
        ads_kdcServer,
        ads_ldapServer,
        ads_mavibotIndex,
        ads_mavibotPartition,
        ads_ntpServer,
        ads_partition,
        ads_passwordPolicy,
        ads_replConsumer,
        ads_replEventLog,
        ads_saslMechHandler,
        ads_server,
        ads_tcpTransport,
        ads_transport,
        ads_udpTransport,
        apacheDnsAbstractRecord,
        apacheDnsAddressRecord,
        apacheDnsCanonicalNameRecord,
        apacheDnsMailExchangeRecord,
        apacheDnsNameServerRecord,
        apacheDnsPointerRecord,
        apacheDnsReferralAddress,
        apacheDnsReferralNameServer,
        apacheDnsServiceRecord,
        apacheDnsStartOfAuthorityRecord,
        apacheDnsTextRecord,
        authPasswordObject,
        automount,
        automountMap,
        corbaContainer,
        corbaObject,
        corbaObjectReference,
        account,
        document,
        documentSeries,
        domain,
        domainRelatedObject,
        friendlyCountry,
        pilotObject,
        pilotOrganization,
        pilotPerson,
        rFC822localPart,
        room,
        dhcpClass,
        dhcpGroup,
        dhcpHost,
        dhcpLeases,
        dhcpLog,
        dhcpOptions,
        dhcpPool,
        dhcpServer,
        dhcpService,
        dhcpSharedNetwork,
        dhcpSubClass,
        dhcpSubnet,
        // ds389Glue,
        // openldapGlue,
        changeLogEntry,
        duaConfigProfile,
        groupOfURLs,
        eduPerson,
        fedfsFsl,
        fedfsFsn,
        fedfsNfsFsl,
        fedfsNsdbContainerInfo,
        mailGroup,
        mailUser,
        transportTable,
        inetOrgPerson,
        javaContainer,
        javaMarshalledObject,
        javaNamingReference,
        javaObject,
        javaSerializedObject,
        krb5KDCEntry,
        krb5Principal,
        krb5Realm,
        referral,
        pgpKeyInfo,
        pgpServerInfo,
        mozillaAbPersonObsolete,
        namedObject,
        namedPolicy,
        authorizedServiceObject,
        bootableDevice,
        ieee802Device,
        ipHost,
        ipNetwork,
        ipProtocol,
        ipService,
        nisMap,
        nisNetgroup,
        nisObject,
        oncRpc,
        posixAccount,
        posixGroup,
        shadowAccount,
        dNSDomain,
        groupOfEntries,
        pilotObject,
        pilotOrganization,
        pilotPerson,
        uidObject,
        untypedObject,
        openLDAPdisplayableObject,
        openLDAPorg,
        openLDAPou,
        openLDAPperson,
        openLDAProotDSE,
        syncConsumerSubentry,
        labeledURIObject,
        simpleSecurityObject,
        uidObject,
        pamConfig,
        pureFTPdUser,
        qmailGroup,
        qmailUser,
        freeradiusDhcpv4Gateway,
        freeradiusDhcpv4Profile,
        freeradiusDhcpv6Gateway,
        freeradiusDhcpv6Profile,
        radiusacct,
        radiusClient,
        radiusObjectProfile,
        radiusprofile,
        nisDomainObject,
        nisKeyObject,
        dynamicObject,
        calEntry,
        slpService,
        ldifLocationURLObject,
        provider,
        printerAbstract,
        printerIPP,
        printerLPR,
        printerService,
        printerServiceAuxClass,
        slpServicePrinter,
        sabayonProfile,
        sabayonProfileNameObject,
        sabayonProfileURLObject,
        sambaAccount,
        sambaConfig,
        sambaConfigOption,
        sambaDomain,
        sambaGroupMapping,
        sambaIdmapEntry,
        sambaPrivilege,
        sambaSamAccount,
        sambaShare,
        sambaSidEntry,
        sambaTrustPassword,
        sambaUnixIdPool,
        inetLocalMailRecipient,
        sudoRole,
        distinguishedNameTableEntry,
        table,
        tableEntry,
        textTableEntry,
        uddiAddress,
        uddiBindingTemplate,
        uddiBusinessEntity,
        uddiBusinessService,
        uddiContact,
        uddiPublisherAssertion,
        uddiTModel,
        uddiTModelInstanceInfo,
        uddiv3EntityObituary,
        uddiv3Subscription,
        vPIMUser,

        // X.952, X.1089, H.323, UPT, and intelligent networks object classes
        traderEntry,
        traderPolicyEntry,
        serviceOfferEntry,
        traderLinkEntry,
        proxyOfferEntry,
        interfaceEntry,
        securityUserInfo,
        tokensStock,
        uptProvider,
        partner,
        agreedService,
        administrativeUnit,
        userProfile,
        userProfileAlias,
        calledUptUser,
        callingUptUser,
        supplementaryService,
        callForwarding,
        commObject,
        commURIObject,
        h323Identity,
        h235Identity,
        h320Identity,
        sIPIdentity,
        genericIdentity,
        callPreferenceURIObject,
    ];
    objectClassInfoObjects
        .map(objectClassFromInformationObject)
        .forEach((oc) => {
            ctx.objectClasses.set(oc.id.toString(), oc);
        });
    const ocs = await ctx.db.objectClassDescription.findMany({
        where: {
            entry_id: null,
        },
    });
    for (const oc of ocs) {
        ctx.objectClasses.set(oc.identifier, {
            id: ObjectIdentifier.fromString(oc.identifier),
            name: oc.ldapNames?.split(" ") ?? undefined,
            superclasses: new Set(oc.subclassOf?.split(" ")),
            kind: prismaOCK2OCK(oc.kind),
            mandatoryAttributes: new Set(oc.mandatories?.split(" ")),
            optionalAttributes: new Set(oc.optionals?.split(" ")),
            obsolete: oc.obsolete,
            ldapNames: oc.ldapNames?.split(" ") ?? undefined,
            ldapDescription: oc.ldapDescription ?? undefined,
        });
    }

    /**
     * ITU Recommendation X.501 (2019), Section 14.9 states that subentries of
     * object class `pwdAdminSubentry` may contain additional attributes that
     * are not present in the ASN.1 specification. This appears to be a mistake
     * in the specification. Here, Meerkat DSA's internal representation of the
     * `pwdAdminSubentry` is overwritten by what is believed to be a correct
     * definition.
     */
    ctx.objectClasses.set(pwdAdminSubentry["&id"].toString(), {
        ...objectClassFromInformationObject(pwdAdminSubentry),
        optionalAttributes: new Set([
            pwdModifyEntryAllowed["&id"].toString(),
            pwdChangeAllowed["&id"].toString(),
            pwdMaxAge["&id"].toString(),
            pwdExpiryAge["&id"].toString(),
            pwdMinLength["&id"].toString(),
            pwdVocabulary["&id"].toString(),
            pwdAlphabet["&id"].toString(),
            pwdDictionaries["&id"].toString(),
            pwdExpiryWarning["&id"].toString(),
            pwdGraces["&id"].toString(),
            pwdFailureDuration["&id"].toString(),
            pwdLockoutDuration["&id"].toString(),
            pwdMaxFailures["&id"].toString(),
            pwdMaxTimeInHistory["&id"].toString(),
            pwdMinTimeInHistory["&id"].toString(),
            pwdHistorySlots["&id"].toString(),
            pwdRecentlyExpiredDuration["&id"].toString(),
            pwdEncAlg["&id"].toString(),
        ]),
    });
}

export default loadObjectClasses;
