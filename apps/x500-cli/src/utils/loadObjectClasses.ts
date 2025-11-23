import { Context } from "../types";
import { objectClasses as x500oc } from "@wildboar/x500";
import {
    entryTtl,
} from "@wildboar/parity-schema/src/lib/modules/RFC2589DynamicDirectory/entryTtl.oa.js";
// import { subentry } from "@wildboar/x500/InformationFramework";
// import { accessControlSubentry } from "@wildboar/x500/InformationFramework";
// import { collectiveAttributeSubentry } from "@wildboar/x500/InformationFramework";
// import { contextAssertionSubentry } from "@wildboar/x500/InformationFramework";
// import { serviceAdminSubentry } from "@wildboar/x500/InformationFramework";
// import { pwdAdminSubentry } from "@wildboar/x500/InformationFramework";
import type {
    OBJECT_CLASS,
} from "@wildboar/x500/InformationFramework";

// X.400 Object Classes
import {
    mhs_distribution_list,
    mhs_message_store,
    mhs_message_transfer_agent,
    mhs_user,
    mhs_user_agent,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
import {
    routingCollective,
    routingMTA,
    connectionGroup,
    mTAInformation,
} from "@wildboar/x400/MHSRoutingDirectoryObjects";
import {
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
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    managementRelationshipClass,
    managementRelationshipMapping,
} from "@wildboar/x700/GrmDefinitionDirectoryASN1Module";
import {
    cMISE,
    sMASE,
} from "@wildboar/x700/RepertoireDirectoryASN1Module";

// PKCS #9 Object Classes
import {
    pkcsEntity,
    naturalPerson,
} from "@wildboar/pkcs/PKCS-9";

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
} from "@wildboar/parity-schema/src/lib/modules/AuthPasswordSchema/authPasswordObject.oa.js";
import {
    automount,
} from "@wildboar/parity-schema/src/lib/modules/AutoFS-Schema/automount.oa";
import {
    automountMap,
} from "@wildboar/parity-schema/src/lib/modules/AutoFS-Schema/automountMap.oa";
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

// const additionalObjectClasses: Record<string, OBJECT_CLASS> = {
//     "subentry": subentry,
//     "accessControlSubentry": accessControlSubentry,
//     "collectiveAttributeSubentry": collectiveAttributeSubentry,
//     "contextAssertionSubentry": contextAssertionSubentry,
//     "serviceAdminSubentry": serviceAdminSubentry,
//     "pwdAdminSubentry": pwdAdminSubentry,
// };

export
async function loadObjectClasses (ctx: Context): Promise<void> {
    // const objectClassInfoObjects = {
    //     ...x500oc,
    //     ...additionalObjectClasses,
    // };
    // Object.entries(objectClassInfoObjects)
    //     .forEach(([ name, oc ]) => {
    //         ctx.objectClasses.set(oc["&id"].toString(), {
    //             id: oc["&id"],
    //             name,
    //         });
    //     });
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
    };
    Object.entries(objectClassInfoObjects)
        .map(([ name, oc ]) => {
            ctx.objectClasses.set(oc["&id"].toString(), {
                id: oc["&id"],
                name,
            });
        });
}

export default loadObjectClasses;
