import type { ATTRIBUTE } from "@wildboar/x500/InformationFramework";
import type { OBJECT_CLASS } from "@wildboar/x500/InformationFramework";
import type { NAME_FORM } from "@wildboar/x500/InformationFramework";
import { atn_AF_address } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-AF-address.oa.mjs";
import { atn_per_certificate } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-per-certificate.oa.mjs";
import { atn_der_certificate } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-der-certificate.oa.mjs";
import { atn_amhs_direct_access } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-amhs-direct-access.oa.mjs";
import { atn_facility_name } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-facility-name.oa.mjs";
import { atn_aircraftIDName } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-aircraftIDName.oa.mjs";
import { atn_version } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-version.oa.mjs";
import { atn_ipm_heading_extensions } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-ipm-heading-extensions.oa.mjs";
import { atn_global_domain_identifier } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-global-domain-identifier.oa.mjs";
import { atn_icao_designator } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-icao-designator.oa.mjs";
import { atn_net } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-net.oa.mjs";
import { atn_amhs_addressing_scheme } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-amhs-addressing-scheme.oa.mjs";
import { atn_amhsMD_naming_context } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-amhsMD-naming-context.oa.mjs";
import { atn_maximum_number_of_body_parts } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-maximum-number-of-body-parts.oa.mjs";
import { atn_maximum_text_size } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-maximum-text-size.oa.mjs";
import { atn_maximum_file_size } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-maximum-file-size.oa.mjs";
import { atn_use_of_amhs_security } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-use-of-amhs-security.oa.mjs";
import { atn_use_of_directory } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-use-of-directory.oa.mjs";
import { atn_group_of_addresses } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-group-of-addresses.oa.mjs";
import { aa_binarySigningTime } from "./lib/modules/BinarySigningTimeModule/aa-binarySigningTime.oa.mjs";
import { at_clearanceSponsor } from "./lib/modules/ClearanceSponsorAttribute-2008/at-clearanceSponsor.oa.mjs";
import { at_deviceOwner } from "./lib/modules/DeviceOwnerAttribute-2008/at-deviceOwner.oa.mjs";
import { firmwarePackageID } from "./lib/modules/CMSFirmwareWrapper/firmwarePackageID.oa.mjs";
import { targetHardwareIDs } from "./lib/modules/CMSFirmwareWrapper/targetHardwareIDs.oa.mjs";
import { decryptKeyID } from "./lib/modules/CMSFirmwareWrapper/decryptKeyID.oa.mjs";
import { implCryptoAlgs } from "./lib/modules/CMSFirmwareWrapper/implCryptoAlgs.oa.mjs";
import { implCompressAlgs } from "./lib/modules/CMSFirmwareWrapper/implCompressAlgs.oa.mjs";
import { communityIdentifiers } from "./lib/modules/CMSFirmwareWrapper/communityIdentifiers.oa.mjs";
import { firmwarePackageInfo } from "./lib/modules/CMSFirmwareWrapper/firmwarePackageInfo.oa.mjs";
import { wrappedFirmwareKey } from "./lib/modules/CMSFirmwareWrapper/wrappedFirmwareKey.oa.mjs";
import { eduCourseOffering } from "./lib/modules/EduCourseSchema/eduCourseOffering.oa.mjs";
import { eduCourseMember } from "./lib/modules/EduCourseSchema/eduCourseMember.oa.mjs";
import { isMemberOf } from "./lib/modules/EduMemberSchema/isMemberOf.oa.mjs";
import { hasMember } from "./lib/modules/EduMemberSchema/hasMember.oa.mjs";
import { eduOrgHomePageURI } from "./lib/modules/EduOrgSchema/eduOrgHomePageURI.oa.mjs";
import { eduOrgIdentityAuthNPolicyURI } from "./lib/modules/EduOrgSchema/eduOrgIdentityAuthNPolicyURI.oa.mjs";
import { eduOrgLegalName } from "./lib/modules/EduOrgSchema/eduOrgLegalName.oa.mjs";
import { eduOrgSuperiorURI } from "./lib/modules/EduOrgSchema/eduOrgSuperiorURI.oa.mjs";
import { eduOrgWhitePagesURI } from "./lib/modules/EduOrgSchema/eduOrgWhitePagesURI.oa.mjs";
import { at_extension_req } from "./lib/modules/EnrollmentMessageSyntax-2009/at-extension-req.oa.mjs";
import { aa_cmc_unsignedData } from "./lib/modules/EnrollmentMessageSyntax-2009/aa-cmc-unsignedData.oa.mjs";
import { at_multipleSignatures } from "./lib/modules/MultipleSignatures-2010/at-multipleSignatures.oa.mjs";
import { regCtrl_regToken } from "./lib/modules/PKIXCRMF-2009/regCtrl-regToken.oa.mjs";
import { regCtrl_authenticator } from "./lib/modules/PKIXCRMF-2009/regCtrl-authenticator.oa.mjs";
import { regCtrl_pkiPublicationInfo } from "./lib/modules/PKIXCRMF-2009/regCtrl-pkiPublicationInfo.oa.mjs";
import { regCtrl_pkiArchiveOptions } from "./lib/modules/PKIXCRMF-2009/regCtrl-pkiArchiveOptions.oa.mjs";
import { regCtrl_oldCertID } from "./lib/modules/PKIXCRMF-2009/regCtrl-oldCertID.oa.mjs";
import { regCtrl_protocolEncrKey } from "./lib/modules/PKIXCRMF-2009/regCtrl-protocolEncrKey.oa.mjs";
import { regInfo_utf8Pairs } from "./lib/modules/PKIXCRMF-2009/regInfo-utf8Pairs.oa.mjs";
import { regInfo_certReq } from "./lib/modules/PKIXCRMF-2009/regInfo-certReq.oa.mjs";
import { voPersonApplicationUID } from "./lib/modules/VOPerson/voPersonApplicationUID.oa.mjs";
import { voPersonAuthorName } from "./lib/modules/VOPerson/voPersonAuthorName.oa.mjs";
import { voPersonCertificateDN } from "./lib/modules/VOPerson/voPersonCertificateDN.oa.mjs";
import { voPersonCertificateIssuerDN } from "./lib/modules/VOPerson/voPersonCertificateIssuerDN.oa.mjs";
import { voPersonExternalID } from "./lib/modules/VOPerson/voPersonExternalID.oa.mjs";
import { voPersonID } from "./lib/modules/VOPerson/voPersonID.oa.mjs";
import { voPersonPolicyAgreement } from "./lib/modules/VOPerson/voPersonPolicyAgreement.oa.mjs";
import { voPersonSoRID } from "./lib/modules/VOPerson/voPersonSoRID.oa.mjs";
import { voPersonStatus } from "./lib/modules/VOPerson/voPersonStatus.oa.mjs";
import { voPersonAffiliation } from "./lib/modules/VOPerson/voPersonAffiliation.oa.mjs";
import { voPersonExternalAffiliation } from "./lib/modules/VOPerson/voPersonExternalAffiliation.oa.mjs";
import { voPersonScopedAffiliation } from "./lib/modules/VOPerson/voPersonScopedAffiliation.oa.mjs";
import { voPersonApplicationPassword } from "./lib/modules/VOPerson/voPersonApplicationPassword.oa.mjs";
import { voPersonVerifiedEmail } from "./lib/modules/VOPerson/voPersonVerifiedEmail.oa.mjs";
import { voPersonToken } from "./lib/modules/VOPerson/voPersonToken.oa.mjs";
import { at_aca_wlanSSID } from "./lib/modules/WLANCertExtn-2010/at-aca-wlanSSID.oa.mjs";
import { atn_amhs_user } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-amhs-user.oa.mjs"
import { atn_organizational_unit } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-organizational-unit.oa.mjs"
import { atn_organizational_person } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-organizational-person.oa.mjs"
import { atn_application_entity } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-application-entity.oa.mjs"
import { atn_organizational_role } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-organizational-role.oa.mjs"
import { atn_certification_authority } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-certification-authority.oa.mjs"
import { atn_amhs_distribution_list } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-amhs-distribution-list.oa.mjs"
import { atn_amhs_user_agent } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-amhs-user-agent.oa.mjs"
import { atn_AmhsGateway } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-AmhsGateway.oa.mjs"
import { atn_aircraft } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-aircraft.oa.mjs"
import { atn_facility } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-facility.oa.mjs"
import { atn_amhsMD } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-amhsMD.oa.mjs"
import { atn_idrp_router } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-idrp-router.oa.mjs"
import { atn_dSA } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-dSA.oa.mjs"
import { atn_organization } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-organization.oa.mjs"
import { eduCourse } from "./lib/modules/EduCourseSchema/eduCourse.oa.mjs";
import { eduMember } from "./lib/modules/EduMemberSchema/eduMember.oa.mjs";
import { eduOrg } from "./lib/modules/EduOrgSchema/eduOrg.oa.mjs";
import { voPersonObjectClass } from "./lib/modules/VOPerson/voPersonObjectClass.oa.mjs";
import { atnOrgUnitNameForm } from "./lib/modules/ATNDirectoryObjectIdentifiers/atnOrgUnitNameForm.oa.mjs";
import { atnOrgPersonNameForm } from "./lib/modules/ATNDirectoryObjectIdentifiers/atnOrgPersonNameForm.oa.mjs";
import { atnOrgRoleNameForm } from "./lib/modules/ATNDirectoryObjectIdentifiers/atnOrgRoleNameForm.oa.mjs";
import { atnApplEntityNameForm } from "./lib/modules/ATNDirectoryObjectIdentifiers/atnApplEntityNameForm.oa.mjs";
import { atnAmhsDLNameForm } from "./lib/modules/ATNDirectoryObjectIdentifiers/atnAmhsDLNameForm.oa.mjs";
import { atnAmhsUANameForm } from "./lib/modules/ATNDirectoryObjectIdentifiers/atnAmhsUANameForm.oa.mjs";
import { atnAmhsGatewayNameForm } from "./lib/modules/ATNDirectoryObjectIdentifiers/atnAmhsGatewayNameForm.oa.mjs";
import { atnAmhsMDNameForm } from "./lib/modules/ATNDirectoryObjectIdentifiers/atnAmhsMDNameForm.oa.mjs";
import { atnOrgNameForm } from "./lib/modules/ATNDirectoryObjectIdentifiers/atnOrgNameForm.oa.mjs";
import { atnAircraftNameForm } from "./lib/modules/ATNDirectoryObjectIdentifiers/atnAircraftNameForm.oa.mjs";
import { atnFacilityNameForm } from "./lib/modules/ATNDirectoryObjectIdentifiers/atnFacilityNameForm.oa.mjs";
import { atnIdrpRouterNameForm } from "./lib/modules/ATNDirectoryObjectIdentifiers/atnIdrpRouterNameForm.oa.mjs";
import { atnDSANameForm } from "./lib/modules/ATNDirectoryObjectIdentifiers/atnDSANameForm.oa.mjs";

export const attributes: Record<string, ATTRIBUTE<any>> = {
    "atn-AF-address": atn_AF_address,
    "atn-per-certificate": atn_per_certificate,
    "atn-der-certificate": atn_der_certificate,
    "atn-amhs-direct-access": atn_amhs_direct_access,
    "atn-facility-name": atn_facility_name,
    "atn-aircraftIDName": atn_aircraftIDName,
    "atn-version": atn_version,
    "atn-ipm-heading-extensions": atn_ipm_heading_extensions,
    "atn-global-domain-identifier": atn_global_domain_identifier,
    "atn-icao-designator": atn_icao_designator,
    "atn-net": atn_net,
    "atn-amhs-addressing-scheme": atn_amhs_addressing_scheme,
    "atn-amhsMD-naming-context": atn_amhsMD_naming_context,
    "atn-maximum-number-of-body-parts": atn_maximum_number_of_body_parts,
    "atn-maximum-text-size": atn_maximum_text_size,
    "atn-maximum-file-size": atn_maximum_file_size,
    "atn-use-of-amhs-security": atn_use_of_amhs_security,
    "atn-use-of-directory": atn_use_of_directory,
    "atn-group-of-addresses": atn_group_of_addresses,
    "clearanceSponsor": at_clearanceSponsor,
    "deviceOwner": at_deviceOwner,
    firmwarePackageID,
    targetHardwareIDs,
    decryptKeyID,
    implCryptoAlgs,
    implCompressAlgs,
    communityIdentifiers,
    firmwarePackageInfo,
    wrappedFirmwareKey,
    eduCourseOffering,
    eduCourseMember,
    isMemberOf,
    hasMember,
    eduOrgHomePageURI,
    eduOrgIdentityAuthNPolicyURI,
    eduOrgLegalName,
    eduOrgSuperiorURI,
    eduOrgWhitePagesURI,
    "extensionReq": at_extension_req,
    "cmc-unsignedData": aa_cmc_unsignedData,
    "multipleSignatures": at_multipleSignatures,
    "regCtrl-regToken": regCtrl_regToken,
    "regCtrl-authenticator": regCtrl_authenticator,
    "regCtrl-pkiPublicationInfo": regCtrl_pkiPublicationInfo,
    "regCtrl-pkiArchiveOptions": regCtrl_pkiArchiveOptions,
    "regCtrl-oldCertID": regCtrl_oldCertID,
    "regCtrl-protocolEncrKey": regCtrl_protocolEncrKey,
    "regInfo-utf8Pairs": regInfo_utf8Pairs,
    "regInfo-certReq": regInfo_certReq,
    voPersonApplicationUID,
    voPersonAuthorName,
    voPersonCertificateDN,
    voPersonCertificateIssuerDN,
    voPersonExternalID,
    voPersonID,
    voPersonPolicyAgreement,
    voPersonSoRID,
    voPersonStatus,
    voPersonAffiliation,
    voPersonExternalAffiliation,
    voPersonScopedAffiliation,
    voPersonApplicationPassword,
    voPersonVerifiedEmail,
    voPersonToken,
    "wlanSSID": at_aca_wlanSSID,
    "binarySigningTime": aa_binarySigningTime,
};

export const objectClasses: Record<string, OBJECT_CLASS> = {
    "atn-amhs-user": atn_amhs_user,
    "atn-organizational-unit": atn_organizational_unit,
    "atn-organizational-person": atn_organizational_person,
    "atn-application-entity": atn_application_entity,
    "atn-organizational-role": atn_organizational_role,
    "atn-certification-authority": atn_certification_authority,
    "atn-amhs-distribution-list": atn_amhs_distribution_list,
    "atn-amhs-user-agent": atn_amhs_user_agent,
    "atn-AmhsGateway": atn_AmhsGateway,
    "atn-aircraft": atn_aircraft,
    "atn-facility": atn_facility,
    "atn-amhsMD": atn_amhsMD,
    "atn-idrp-router": atn_idrp_router,
    "atn-dSA": atn_dSA,
    "atn-organization": atn_organization,
    eduCourse,
    eduMember,
    eduOrg,
    voPersonObjectClass,
};

export const nameForms: Record<string, NAME_FORM> = {
    atnOrgUnitNameForm,
    atnOrgPersonNameForm,
    atnOrgRoleNameForm,
    atnApplEntityNameForm,
    atnAmhsDLNameForm,
    atnAmhsUANameForm,
    atnAmhsGatewayNameForm,
    atnAmhsMDNameForm,
    atnOrgNameForm,
    atnAircraftNameForm,
    atnFacilityNameForm,
    atnIdrpRouterNameForm,
    atnDSANameForm,
};
