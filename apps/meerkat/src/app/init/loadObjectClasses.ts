import { Context } from "../types/index.js";
import objectClassFromInformationObject from "./objectClassFromInformationObject.js";
import { objectClasses as x500oc } from "@wildboar/x500";
import { ObjectClassKind as PrismaObjectClassKind } from "../generated/client.js";
import {
    ObjectClassKind,
    ObjectClassKind_abstract,
    ObjectClassKind_auxiliary,
    ObjectClassKind_structural,
} from "@wildboar/x500/InformationFramework";
import {
    entryTtl,
} from "@wildboar/parity-schema/src/lib/modules/RFC2589DynamicDirectory/entryTtl.oa.js";
import { ObjectIdentifier } from "@wildboar/asn1";
import { AssertionError } from "assert";
import {
    pwdAdminSubentry,
} from "@wildboar/x500/InformationFramework";
import { pwdModifyEntryAllowed } from "@wildboar/x500/PasswordPolicy";
import { pwdChangeAllowed } from "@wildboar/x500/PasswordPolicy";
import { pwdMaxAge } from "@wildboar/x500/PasswordPolicy";
import { pwdExpiryAge } from "@wildboar/x500/PasswordPolicy";
import { pwdMinLength } from "@wildboar/x500/PasswordPolicy";
import { pwdVocabulary } from "@wildboar/x500/PasswordPolicy";
import { pwdAlphabet } from "@wildboar/x500/PasswordPolicy";
import { pwdDictionaries } from "@wildboar/x500/PasswordPolicy";
import { pwdExpiryWarning } from "@wildboar/x500/PasswordPolicy";
import { pwdGraces } from "@wildboar/x500/PasswordPolicy";
import { pwdFailureDuration } from "@wildboar/x500/PasswordPolicy";
import { pwdLockoutDuration } from "@wildboar/x500/PasswordPolicy";
import { pwdMaxFailures } from "@wildboar/x500/PasswordPolicy";
import { pwdMaxTimeInHistory } from "@wildboar/x500/PasswordPolicy";
import { pwdMinTimeInHistory } from "@wildboar/x500/PasswordPolicy";
import { pwdHistorySlots } from "@wildboar/x500/PasswordPolicy";
import { pwdRecentlyExpiredDuration } from "@wildboar/x500/PasswordPolicy";
import { pwdEncAlg } from "@wildboar/x500/PasswordPolicy";

// X.400 Object Classes
import {
    mhs_distribution_list,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
import {
    mhs_message_store,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
import {
    mhs_message_transfer_agent,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
import {
    mhs_user,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
import {
    mhs_user_agent,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
import {
    routingCollective,
} from "@wildboar/x400/MHSRoutingDirectoryObjects";
import {
    routingMTA,
} from "@wildboar/x400/MHSRoutingDirectoryObjects";
import {
    connectionGroup,
} from "@wildboar/x400/MHSRoutingDirectoryObjects";
import {
    mTAInformation,
} from "@wildboar/x400/MHSRoutingDirectoryObjects";
import {
    oRAddressElement,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    oRAddressSubtreeBase,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSCountry,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSADMD,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSPRMD,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSOrganization,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSOrganizationalUnit,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSCommonName,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSSurname,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSGivenName,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSInitials,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSGenerationQualifier,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSNetworkAddress,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSExtendedNetworkAddress,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSTerminalIdentifier,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSTerminalType,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSNumericUserIdentifier,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSPDSName,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSPhysicalDeliveryCountry,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSPostalCode,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    edi_user,
} from "@wildboar/x400/EDIMUseOfDirectory";
import {
    edi_user_agent,
} from "@wildboar/x400/EDIMUseOfDirectory";
import {
    edi_message_store,
} from "@wildboar/x400/EDIMUseOfDirectory";

// X.700 Object Classes
import {
    asn1Module,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    managementAction,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    managementAttributeGroup,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    managementAttribute,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    managementBehaviour,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    managementDocument,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    managementNameBinding,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    managementNotification,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    managementObjectClass,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    managementPackage,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    managementParameter,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    managementTemplate,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    registeredInformation,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    managementRelationshipClass,
} from "@wildboar/x700/GrmDefinitionDirectoryASN1Module";
import {
    managementRelationshipMapping,
} from "@wildboar/x700/GrmDefinitionDirectoryASN1Module";
import {
    cMISE,
} from "@wildboar/x700/RepertoireDirectoryASN1Module";
import {
    sMASE,
} from "@wildboar/x700/RepertoireDirectoryASN1Module";

// PKCS #9 Object Classes
import {
    pkcsEntity,
} from "@wildboar/pkcs/PKCS-9";
import {
    naturalPerson,
} from "@wildboar/pkcs/PKCS-9";

// IANA LDAP Parity Schema
import {
    ads_authenticationInterceptor,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-authenticationInterceptor.oa.js"
import {
    ads_authenticator,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-authenticator.oa.js"
import {
    ads_authenticatorImpl,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-authenticatorImpl.oa.js"
import {
    ads_base,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-base.oa.js"
import {
    ads_changeLog,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-changeLog.oa.js"
import {
    ads_changePasswordServer,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-changePasswordServer.oa.js"
import {
    ads_delegatingAuthenticator,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-delegatingAuthenticator.oa.js"
import {
    ads_dhcpServer,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-dhcpServer.oa.js"
import {
    ads_directoryService,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-directoryService.oa.js"
import {
    ads_dnsServer,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-dnsServer.oa.js"
import {
    ads_dsBasedServer,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-dsBasedServer.oa.js"
import {
    ads_extendedOpHandler,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-extendedOpHandler.oa.js"
import {
    ads_hashInterceptor,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-hashInterceptor.oa.js"
import {
    ads_httpServer,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-httpServer.oa.js"
import {
    ads_httpWebApp,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-httpWebApp.oa.js"
import {
    ads_index,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-index.oa.js"
import {
    ads_interceptor,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-interceptor.oa.js"
import {
    ads_jdbmIndex,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-jdbmIndex.oa.js"
import {
    ads_jdbmPartition,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-jdbmPartition.oa.js"
import {
    ads_journal,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-journal.oa.js"
import {
    ads_kdcServer,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-kdcServer.oa.js"
import {
    ads_ldapServer,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-ldapServer.oa.js"
import {
    ads_mavibotIndex,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-mavibotIndex.oa.js"
import {
    ads_mavibotPartition,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-mavibotPartition.oa.js"
import {
    ads_ntpServer,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-ntpServer.oa.js"
import {
    ads_partition,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-partition.oa.js"
import {
    ads_passwordPolicy,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-passwordPolicy.oa.js"
import {
    ads_replConsumer,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replConsumer.oa.js"
import {
    ads_replEventLog,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replEventLog.oa.js"
import {
    ads_saslMechHandler,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-saslMechHandler.oa.js"
import {
    ads_server,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-server.oa.js"
import {
    ads_tcpTransport,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-tcpTransport.oa.js"
import {
    ads_transport,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-transport.oa.js"
import {
    ads_udpTransport,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-udpTransport.oa.js"
import {
    apacheDnsAbstractRecord,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsAbstractRecord.oa.js"
import {
    apacheDnsAddressRecord,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsAddressRecord.oa.js"
import {
    apacheDnsCanonicalNameRecord,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsCanonicalNameRecord.oa.js"
import {
    apacheDnsMailExchangeRecord,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsMailExchangeRecord.oa.js"
import {
    apacheDnsNameServerRecord,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsNameServerRecord.oa.js"
import {
    apacheDnsPointerRecord,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsPointerRecord.oa.js"
import {
    apacheDnsReferralAddress,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsReferralAddress.oa.js"
import {
    apacheDnsReferralNameServer,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsReferralNameServer.oa.js"
import {
    apacheDnsServiceRecord,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsServiceRecord.oa.js"
import {
    apacheDnsStartOfAuthorityRecord,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsStartOfAuthorityRecord.oa.js"
import {
    apacheDnsTextRecord,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsTextRecord.oa.js"
import {
    authPasswordObject,
} from "@wildboar/parity-schema/src/lib/modules/AuthPasswordSchema/authPasswordObject.oa.js";
import {
    automount,
} from "@wildboar/parity-schema/src/lib/modules/AutoFS-Schema/automount.oa.js"
import {
    automountMap,
} from "@wildboar/parity-schema/src/lib/modules/AutoFS-Schema/automountMap.oa.js"
import {
    corbaContainer,
} from "@wildboar/parity-schema/src/lib/modules/CORBA/corbaContainer.oa.js";
import {
    corbaObject,
} from "@wildboar/parity-schema/src/lib/modules/CORBA/corbaObject.oa.js";
import {
    corbaObjectReference,
} from "@wildboar/parity-schema/src/lib/modules/CORBA/corbaObjectReference.oa.js";
import {
    account,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/account.oa.js";
import {
    document,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/document.oa.js";
import {
    documentSeries,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/documentSeries.oa.js";
import {
    domain,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/domain.oa.js";
import {
    domainRelatedObject,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/domainRelatedObject.oa.js";
import {
    friendlyCountry,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/friendlyCountry.oa.js";
import {
    pilotObject,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/pilotObject.oa.js";
import {
    pilotOrganization,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/pilotOrganization.oa.js";
import {
    pilotPerson,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/pilotPerson.oa.js";
import {
    rFC822localPart,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/rFC822localPart.oa.js";
import {
    room,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/room.oa.js";
import {
    dhcpClass,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpClass.oa.js"
import {
    dhcpGroup,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpGroup.oa.js"
import {
    dhcpHost,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpHost.oa.js"
import {
    dhcpLeases,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpLeases.oa.js"
import {
    dhcpLog,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpLog.oa.js"
import {
    dhcpOptions,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpOptions.oa.js"
import {
    dhcpPool,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpPool.oa.js"
import {
    dhcpServer,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpServer.oa.js"
import {
    dhcpService,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpService.oa.js"
import {
    dhcpSharedNetwork,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpSharedNetwork.oa.js"
import {
    dhcpSubClass,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpSubClass.oa.js"
import {
    dhcpSubnet,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpSubnet.oa.js"
// import {
//     glue as ds389Glue,
// } from "@wildboar/parity-schema/src/lib/modules/DS389CommonSchema/glue.oa.js";
import {
    changeLogEntry,
} from "@wildboar/parity-schema/src/lib/modules/DSEE/changeLogEntry.oa.js";
import {
    duaConfigProfile,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/duaConfigProfile.oa.js";
import {
    groupOfURLs,
} from "@wildboar/parity-schema/src/lib/modules/DynGroup/groupOfURLs.oa.js";
import {
    eduPerson,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPerson.oa.js";
import {
    fedfsFsl,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsFsl.oa.js";
import {
    fedfsFsn,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsFsn.oa.js";
import {
    fedfsNfsFsl,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsFsl.oa.js";
import {
    fedfsNsdbContainerInfo,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNsdbContainerInfo.oa.js";
import {
    mailGroup,
} from "@wildboar/parity-schema/src/lib/modules/InetMailSchema/mailGroup.oa.js";
import {
    mailUser,
} from "@wildboar/parity-schema/src/lib/modules/InetMailSchema/mailUser.oa.js";
import {
    transportTable,
} from "@wildboar/parity-schema/src/lib/modules/InetMailSchema/transportTable.oa.js";
import {
    inetOrgPerson,
} from "@wildboar/parity-schema/src/lib/modules/InetOrgPerson/inetOrgPerson.oa.js";
import {
    javaContainer,
} from "@wildboar/parity-schema/src/lib/modules/Java/javaContainer.oa.js";
import {
    javaMarshalledObject,
} from "@wildboar/parity-schema/src/lib/modules/Java/javaMarshalledObject.oa.js";
import {
    javaNamingReference,
} from "@wildboar/parity-schema/src/lib/modules/Java/javaNamingReference.oa.js";
import {
    javaObject,
} from "@wildboar/parity-schema/src/lib/modules/Java/javaObject.oa.js";
import {
    javaSerializedObject,
} from "@wildboar/parity-schema/src/lib/modules/Java/javaSerializedObject.oa.js";
import {
    krb5KDCEntry,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5KDCEntry.oa.js";
import {
    krb5Principal,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5Principal.oa.js";
import {
    krb5Realm,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5Realm.oa.js";
// import {
//     referral,
// } from "@wildboar/parity-schema/src/lib/modules/LDAPReferral/referral.oa.js";
import {
    pgpKeyInfo,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpKeyInfo.oa.js";
import {
    pgpServerInfo,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpServerInfo.oa.js";
import {
    mozillaAbPersonObsolete,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/mozillaAbPersonObsolete.oa.js";
import {
    namedObject,
} from "@wildboar/parity-schema/src/lib/modules/NamedObject/namedObject.oa.js";
import {
    namedPolicy,
} from "@wildboar/parity-schema/src/lib/modules/NamedObject/namedPolicy.oa.js";
import {
    authorizedServiceObject,
} from "@wildboar/parity-schema/src/lib/modules/NameServiceAdditionalSchema/authorizedServiceObject.oa.js";
import {
    bootableDevice,
} from "@wildboar/parity-schema/src/lib/modules/NIS/bootableDevice.oa.js";
import {
    ieee802Device,
} from "@wildboar/parity-schema/src/lib/modules/NIS/ieee802Device.oa.js";
import {
    ipHost,
} from "@wildboar/parity-schema/src/lib/modules/NIS/ipHost.oa.js";
import {
    ipNetwork,
} from "@wildboar/parity-schema/src/lib/modules/NIS/ipNetwork.oa.js";
import {
    ipProtocol,
} from "@wildboar/parity-schema/src/lib/modules/NIS/ipProtocol.oa.js";
import {
    ipService,
} from "@wildboar/parity-schema/src/lib/modules/NIS/ipService.oa.js";
import {
    nisMap,
} from "@wildboar/parity-schema/src/lib/modules/NIS/nisMap.oa.js";
import {
    nisNetgroup,
} from "@wildboar/parity-schema/src/lib/modules/NIS/nisNetgroup.oa.js";
import {
    nisObject,
} from "@wildboar/parity-schema/src/lib/modules/NIS/nisObject.oa.js";
import {
    oncRpc,
} from "@wildboar/parity-schema/src/lib/modules/NIS/oncRpc.oa.js";
import {
    posixAccount,
} from "@wildboar/parity-schema/src/lib/modules/NIS/posixAccount.oa.js";
import {
    posixGroup,
} from "@wildboar/parity-schema/src/lib/modules/NIS/posixGroup.oa.js";
import {
    shadowAccount,
} from "@wildboar/parity-schema/src/lib/modules/NIS/shadowAccount.oa.js";
import {
    dNSDomain,
} from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/dNSDomain.oa.js";
import {
    groupOfEntries,
} from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/groupOfEntries.oa.js";
// import {
//     pilotObject,
// } from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/pilotObject.oa.js";
// import {
//     pilotOrganization,
// } from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/pilotOrganization.oa.js";
// import {
//     pilotPerson,
// } from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/pilotPerson.oa.js";
// import {
//     uidObject,
// } from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/uidObject.oa.js";
import {
    untypedObject,
} from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/untypedObject.oa.js";
// import {
//     glue as openldapGlue,
// } from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/glue.oa.js";
import {
    openLDAPdisplayableObject,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/openLDAPdisplayableObject.oa.js";
import {
    openLDAPorg,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/openLDAPorg.oa.js";
import {
    openLDAPou,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/openLDAPou.oa.js";
import {
    openLDAPperson,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/openLDAPperson.oa.js";
import {
    openLDAProotDSE,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/openLDAProotDSE.oa.js";
import {
    syncConsumerSubentry,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/syncConsumerSubentry.oa.js";
import {
    labeledURIObject,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAPCoreSchema/labeledURIObject.oa.js";
import {
    simpleSecurityObject,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAPCoreSchema/simpleSecurityObject.oa.js";
import {
    uidObject,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAPCoreSchema/uidObject.oa.js";
import {
    pamConfig,
} from "@wildboar/parity-schema/src/lib/modules/PAMSchema/pamConfig.oa.js";
import {
    pureFTPdUser,
} from "@wildboar/parity-schema/src/lib/modules/PureFTPdSchema/pureFTPdUser.oa.js";
import {
    qmailGroup,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qmailGroup.oa.js";
import {
    qmailUser,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qmailUser.oa.js";
import {
    freeradiusDhcpv4Gateway,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/freeradiusDhcpv4Gateway.oa.js";
import {
    freeradiusDhcpv4Profile,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/freeradiusDhcpv4Profile.oa.js";
import {
    freeradiusDhcpv6Gateway,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/freeradiusDhcpv6Gateway.oa.js";
import {
    freeradiusDhcpv6Profile,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/freeradiusDhcpv6Profile.oa.js";
import {
    radiusacct,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusacct.oa.js";
import {
    radiusClient,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusClient.oa.js";
import {
    radiusObjectProfile,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusObjectProfile.oa.js";
import {
    radiusprofile,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusprofile.oa.js";
import {
    nisDomainObject,
} from "@wildboar/parity-schema/src/lib/modules/RFC2307bis/nisDomainObject.oa.js";
import {
    nisKeyObject,
} from "@wildboar/parity-schema/src/lib/modules/RFC2307bis/nisKeyObject.oa.js";
import {
    dynamicObject,
} from "@wildboar/parity-schema/src/lib/modules/RFC2589DynamicDirectory/dynamicObject.oa.js";
import {
    calEntry,
} from "@wildboar/parity-schema/src/lib/modules/RFC2739Calendar/calEntry.oa.js";
import {
    slpService,
} from "@wildboar/parity-schema/src/lib/modules/RFC2926ServiceLocationProtocolSchema/slpService.oa.js";
import {
    ldifLocationURLObject,
} from "@wildboar/parity-schema/src/lib/modules/RFC6109CertifiedElectronicMail/ldifLocationURLObject.oa.js";
import {
    provider,
} from "@wildboar/parity-schema/src/lib/modules/RFC6109CertifiedElectronicMail/provider.oa.js";
import {
    printerAbstract,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printerAbstract.oa.js";
import {
    printerIPP,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printerIPP.oa.js";
import {
    printerLPR,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printerLPR.oa.js";
import {
    printerService,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printerService.oa.js";
import {
    printerServiceAuxClass,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printerServiceAuxClass.oa.js";
import {
    slpServicePrinter,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/slpServicePrinter.oa.js";
import {
    sabayonProfile,
} from "@wildboar/parity-schema/src/lib/modules/SabayonSchema/sabayonProfile.oa.js";
import {
    sabayonProfileNameObject,
} from "@wildboar/parity-schema/src/lib/modules/SabayonSchema/sabayonProfileNameObject.oa.js";
import {
    sabayonProfileURLObject,
} from "@wildboar/parity-schema/src/lib/modules/SabayonSchema/sabayonProfileURLObject.oa.js";
import {
    sambaAccount,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/sambaAccount.oa.js";
import {
    sambaConfig,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaConfig.oa.js";
import {
    sambaConfigOption,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaConfigOption.oa.js";
import {
    sambaDomain,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaDomain.oa.js";
import {
    sambaGroupMapping,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaGroupMapping.oa.js";
import {
    sambaIdmapEntry,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaIdmapEntry.oa.js";
import {
    sambaPrivilege,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaPrivilege.oa.js";
import {
    sambaSamAccount,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaSamAccount.oa.js";
import {
    sambaShare,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaShare.oa.js";
import {
    sambaSidEntry,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaSidEntry.oa.js";
import {
    sambaTrustPassword,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaTrustPassword.oa.js";
import {
    sambaUnixIdPool,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaUnixIdPool.oa.js";
import {
    inetLocalMailRecipient,
} from "@wildboar/parity-schema/src/lib/modules/SendmailSchema/inetLocalMailRecipient.oa.js";
import {
    sudoRole,
} from "@wildboar/parity-schema/src/lib/modules/SudoSchema/sudoRole.oa.js";
import {
    distinguishedNameTableEntry,
} from "@wildboar/parity-schema/src/lib/modules/TableFramework/distinguishedNameTableEntry.oa.js";
import {
    table,
} from "@wildboar/parity-schema/src/lib/modules/TableFramework/table.oa.js";
import {
    tableEntry,
} from "@wildboar/parity-schema/src/lib/modules/TableFramework/tableEntry.oa.js";
import {
    textTableEntry,
} from "@wildboar/parity-schema/src/lib/modules/TableFramework/textTableEntry.oa.js";
import {
    uddiAddress,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiAddress.oa.js"
import {
    uddiBindingTemplate,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiBindingTemplate.oa.js"
import {
    uddiBusinessEntity,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiBusinessEntity.oa.js"
import {
    uddiBusinessService,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiBusinessService.oa.js"
import {
    uddiContact,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiContact.oa.js"
import {
    uddiPublisherAssertion,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiPublisherAssertion.oa.js"
import {
    uddiTModel,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiTModel.oa.js"
import {
    uddiTModelInstanceInfo,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiTModelInstanceInfo.oa.js"
import {
    uddiv3EntityObituary,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3EntityObituary.oa.js"
import {
    uddiv3Subscription,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3Subscription.oa.js"
import {
    vPIMUser,
} from "@wildboar/parity-schema/src/lib/modules/VPIMSchema/vPIMUser.oa.js";
import {
    traderEntry,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/traderEntry.oa.js";
import {
    traderPolicyEntry,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/traderPolicyEntry.oa.js";
import {
    serviceOfferEntry,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/serviceOfferEntry.oa.js";
import {
    traderLinkEntry,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/traderLinkEntry.oa.js";
import {
    proxyOfferEntry,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/proxyOfferEntry.oa.js";
import {
    interfaceEntry,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/interfaceEntry.oa.js";
import {
    securityUserInfo,
} from "@wildboar/parity-schema/src/lib/modules/IN-CS3-SCF-SDF-datatypes/securityUserInfo.oa.js"
import {
    tokensStock,
} from "@wildboar/parity-schema/src/lib/modules/IN-CS3-SCF-SDF-datatypes/tokensStock.oa.js"
import {
    uptProvider,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/uptProvider.oa.js"
import {
    partner,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/partner.oa.js"
import {
    agreedService,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/agreedService.oa.js"
import {
    administrativeUnit,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/administrativeUnit.oa.js"
import {
    userProfile,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/userProfile.oa.js"
import {
    userProfileAlias,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/userProfileAlias.oa.js"
import {
    calledUptUser,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/calledUptUser.oa.js"
import {
    callingUptUser,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/callingUptUser.oa.js"
import {
    supplementaryService,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/supplementaryService.oa.js"
import {
    callForwarding,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/callForwarding.oa.js"
import {
    commObject,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/commObject.oa.js"
import {
    commURIObject,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/commURIObject.oa.js"
import {
    h323Identity,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h323Identity.oa.js"
import {
    h235Identity,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h235Identity.oa.js"
import {
    h320Identity,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h320Identity.oa.js"
import {
    sIPIdentity,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/sIPIdentity.oa.js"
import {
    genericIdentity,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/genericIdentity.oa.js"
import {
    callPreferenceURIObject,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/callPreferenceURIObject.oa.js"
import { objectClasses as schemaLevelIIObjectClasses } from "@wildboar/schema-level-ii";
import { strict as assert } from "node:assert";

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
    default: throw new Error();
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
    const objectClassInfoObjects = {
        ...x500oc,
        "mhs-distribution-list": mhs_distribution_list,
        "mhs-message-store": mhs_message_store,
        "mhs-message-transfer-agent": mhs_message_transfer_agent,
        "mhs-user": mhs_user,
        "mhs-user-agent": mhs_user_agent,
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
        "edi-user": edi_user,
        "edi-user-agent": edi_user_agent,
        "edi-message-store": edi_message_store,
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
        "ads-authenticationInterceptor": ads_authenticationInterceptor,
        "ads-authenticator": ads_authenticator,
        "ads-authenticatorImpl": ads_authenticatorImpl,
        "ads-base": ads_base,
        "ads-changeLog": ads_changeLog,
        "ads-changePasswordServer": ads_changePasswordServer,
        "ads-delegatingAuthenticator": ads_delegatingAuthenticator,
        "ads-dhcpServer": ads_dhcpServer,
        "ads-directoryService": ads_directoryService,
        "ads-dnsServer": ads_dnsServer,
        "ads-dsBasedServer": ads_dsBasedServer,
        "ads-extendedOpHandler": ads_extendedOpHandler,
        "ads-hashInterceptor": ads_hashInterceptor,
        "ads-httpServer": ads_httpServer,
        "ads-httpWebApp": ads_httpWebApp,
        "ads-index": ads_index,
        "ads-interceptor": ads_interceptor,
        "ads-jdbmIndex": ads_jdbmIndex,
        "ads-jdbmPartition": ads_jdbmPartition,
        "ads-journal": ads_journal,
        "ads-kdcServer": ads_kdcServer,
        "ads-ldapServer": ads_ldapServer,
        "ads-mavibotIndex": ads_mavibotIndex,
        "ads-mavibotPartition": ads_mavibotPartition,
        "ads-ntpServer": ads_ntpServer,
        "ads-partition": ads_partition,
        "ads-passwordPolicy": ads_passwordPolicy,
        "ads-replConsumer": ads_replConsumer,
        "ads-replEventLog": ads_replEventLog,
        "ads-saslMechHandler": ads_saslMechHandler,
        "ads-server": ads_server,
        "ads-tcpTransport": ads_tcpTransport,
        "ads-transport": ads_transport,
        "ads-udpTransport": ads_udpTransport,
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
        // referral,
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
        dynamicObject: { // I believe it was an error in the spec for this not to permit `entryTtl` as an optional attribute.
            ...dynamicObject,
            "&OptionalAttributes": [ entryTtl ],
        },
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
        ...schemaLevelIIObjectClasses,
    };
    Object.entries(objectClassInfoObjects)
        .map(([ name, oc ]) => objectClassFromInformationObject(oc, name))
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
        ...objectClassFromInformationObject(pwdAdminSubentry, "pwdAdminSubentry"),
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
