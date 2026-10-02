import type { ATTRIBUTE } from "@wildboar/x500/InformationFramework";
import type { OBJECT_CLASS } from "@wildboar/x500/InformationFramework";
import type { NAME_FORM } from "@wildboar/x500/InformationFramework";
import { atn_AF_address } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-AF-address.oa.js";
import { atn_per_certificate } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-per-certificate.oa.js";
import { atn_der_certificate } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-der-certificate.oa.js";
import { atn_amhs_direct_access } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-amhs-direct-access.oa.js";
import { atn_facility_name } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-facility-name.oa.js";
import { atn_aircraftIDName } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-aircraftIDName.oa.js";
import { atn_version } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-version.oa.js";
import { atn_ipm_heading_extensions } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-ipm-heading-extensions.oa.js";
import { atn_global_domain_identifier } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-global-domain-identifier.oa.js";
import { atn_icao_designator } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-icao-designator.oa.js";
import { atn_net } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-net.oa.js";
import { atn_amhs_addressing_scheme } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-amhs-addressing-scheme.oa.js";
import { atn_amhsMD_naming_context } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-amhsMD-naming-context.oa.js";
import { atn_maximum_number_of_body_parts } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-maximum-number-of-body-parts.oa.js";
import { atn_maximum_text_size } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-maximum-text-size.oa.js";
import { atn_maximum_file_size } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-maximum-file-size.oa.js";
import { atn_use_of_amhs_security } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-use-of-amhs-security.oa.js";
import { atn_use_of_directory } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-use-of-directory.oa.js";
import { atn_group_of_addresses } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-group-of-addresses.oa.js";
import { aa_binarySigningTime } from "./lib/modules/BinarySigningTimeModule/aa-binarySigningTime.oa.js";
import { at_clearanceSponsor } from "./lib/modules/ClearanceSponsorAttribute-2008/at-clearanceSponsor.oa.js";
import { at_deviceOwner } from "./lib/modules/DeviceOwnerAttribute-2008/at-deviceOwner.oa.js";
import { firmwarePackageID } from "./lib/modules/CMSFirmwareWrapper/firmwarePackageID.oa.js";
import { targetHardwareIDs } from "./lib/modules/CMSFirmwareWrapper/targetHardwareIDs.oa.js";
import { decryptKeyID } from "./lib/modules/CMSFirmwareWrapper/decryptKeyID.oa.js";
import { implCryptoAlgs } from "./lib/modules/CMSFirmwareWrapper/implCryptoAlgs.oa.js";
import { implCompressAlgs } from "./lib/modules/CMSFirmwareWrapper/implCompressAlgs.oa.js";
import { communityIdentifiers } from "./lib/modules/CMSFirmwareWrapper/communityIdentifiers.oa.js";
import { firmwarePackageInfo } from "./lib/modules/CMSFirmwareWrapper/firmwarePackageInfo.oa.js";
import { wrappedFirmwareKey } from "./lib/modules/CMSFirmwareWrapper/wrappedFirmwareKey.oa.js";
import { eduCourseOffering } from "./lib/modules/EduCourseSchema/eduCourseOffering.oa.js";
import { eduCourseMember } from "./lib/modules/EduCourseSchema/eduCourseMember.oa.js";
import { isMemberOf } from "./lib/modules/EduMemberSchema/isMemberOf.oa.js";
import { hasMember } from "./lib/modules/EduMemberSchema/hasMember.oa.js";
import { eduOrgHomePageURI } from "./lib/modules/EduOrgSchema/eduOrgHomePageURI.oa.js";
import { eduOrgIdentityAuthNPolicyURI } from "./lib/modules/EduOrgSchema/eduOrgIdentityAuthNPolicyURI.oa.js";
import { eduOrgLegalName } from "./lib/modules/EduOrgSchema/eduOrgLegalName.oa.js";
import { eduOrgSuperiorURI } from "./lib/modules/EduOrgSchema/eduOrgSuperiorURI.oa.js";
import { eduOrgWhitePagesURI } from "./lib/modules/EduOrgSchema/eduOrgWhitePagesURI.oa.js";
import { at_extension_req } from "./lib/modules/EnrollmentMessageSyntax-2009/at-extension-req.oa.js";
import { aa_cmc_unsignedData } from "./lib/modules/EnrollmentMessageSyntax-2009/aa-cmc-unsignedData.oa.js";
import { at_multipleSignatures } from "./lib/modules/MultipleSignatures-2010/at-multipleSignatures.oa.js";
import { regCtrl_regToken } from "./lib/modules/PKIXCRMF-2009/regCtrl-regToken.oa.js";
import { regCtrl_authenticator } from "./lib/modules/PKIXCRMF-2009/regCtrl-authenticator.oa.js";
import { regCtrl_pkiPublicationInfo } from "./lib/modules/PKIXCRMF-2009/regCtrl-pkiPublicationInfo.oa.js";
import { regCtrl_pkiArchiveOptions } from "./lib/modules/PKIXCRMF-2009/regCtrl-pkiArchiveOptions.oa.js";
import { regCtrl_oldCertID } from "./lib/modules/PKIXCRMF-2009/regCtrl-oldCertID.oa.js";
import { regCtrl_protocolEncrKey } from "./lib/modules/PKIXCRMF-2009/regCtrl-protocolEncrKey.oa.js";
import { regInfo_utf8Pairs } from "./lib/modules/PKIXCRMF-2009/regInfo-utf8Pairs.oa.js";
import { regInfo_certReq } from "./lib/modules/PKIXCRMF-2009/regInfo-certReq.oa.js";
import { voPersonApplicationUID } from "./lib/modules/VOPerson/voPersonApplicationUID.oa.js";
import { voPersonAuthorName } from "./lib/modules/VOPerson/voPersonAuthorName.oa.js";
import { voPersonCertificateDN } from "./lib/modules/VOPerson/voPersonCertificateDN.oa.js";
import { voPersonCertificateIssuerDN } from "./lib/modules/VOPerson/voPersonCertificateIssuerDN.oa.js";
import { voPersonExternalID } from "./lib/modules/VOPerson/voPersonExternalID.oa.js";
import { voPersonID } from "./lib/modules/VOPerson/voPersonID.oa.js";
import { voPersonPolicyAgreement } from "./lib/modules/VOPerson/voPersonPolicyAgreement.oa.js";
import { voPersonSoRID } from "./lib/modules/VOPerson/voPersonSoRID.oa.js";
import { voPersonStatus } from "./lib/modules/VOPerson/voPersonStatus.oa.js";
import { voPersonAffiliation } from "./lib/modules/VOPerson/voPersonAffiliation.oa.js";
import { voPersonExternalAffiliation } from "./lib/modules/VOPerson/voPersonExternalAffiliation.oa.js";
import { voPersonScopedAffiliation } from "./lib/modules/VOPerson/voPersonScopedAffiliation.oa.js";
import { voPersonApplicationPassword } from "./lib/modules/VOPerson/voPersonApplicationPassword.oa.js";
import { voPersonVerifiedEmail } from "./lib/modules/VOPerson/voPersonVerifiedEmail.oa.js";
import { voPersonToken } from "./lib/modules/VOPerson/voPersonToken.oa.js";
import { at_aca_wlanSSID } from "./lib/modules/WLANCertExtn-2010/at-aca-wlanSSID.oa.js";
import { atn_amhs_user } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-amhs-user.oa.js"
import { atn_organizational_unit } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-organizational-unit.oa.js"
import { atn_organizational_person } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-organizational-person.oa.js"
import { atn_application_entity } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-application-entity.oa.js"
import { atn_organizational_role } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-organizational-role.oa.js"
import { atn_certification_authority } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-certification-authority.oa.js"
import { atn_amhs_distribution_list } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-amhs-distribution-list.oa.js"
import { atn_amhs_user_agent } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-amhs-user-agent.oa.js"
import { atn_AmhsGateway } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-AmhsGateway.oa.js"
import { atn_aircraft } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-aircraft.oa.js"
import { atn_facility } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-facility.oa.js"
import { atn_amhsMD } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-amhsMD.oa.js"
import { atn_idrp_router } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-idrp-router.oa.js"
import { atn_dSA } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-dSA.oa.js"
import { atn_organization } from "./lib/modules/ATNDirectoryObjectIdentifiers/atn-organization.oa.js"
import { eduCourse } from "./lib/modules/EduCourseSchema/eduCourse.oa.js";
import { eduMember } from "./lib/modules/EduMemberSchema/eduMember.oa.js";
import { eduOrg } from "./lib/modules/EduOrgSchema/eduOrg.oa.js";
import { voPersonObjectClass } from "./lib/modules/VOPerson/voPersonObjectClass.oa.js";
import { atnOrgUnitNameForm } from "./lib/modules/ATNDirectoryObjectIdentifiers/atnOrgUnitNameForm.oa.js";
import { atnOrgPersonNameForm } from "./lib/modules/ATNDirectoryObjectIdentifiers/atnOrgPersonNameForm.oa.js";
import { atnOrgRoleNameForm } from "./lib/modules/ATNDirectoryObjectIdentifiers/atnOrgRoleNameForm.oa.js";
import { atnApplEntityNameForm } from "./lib/modules/ATNDirectoryObjectIdentifiers/atnApplEntityNameForm.oa.js";
import { atnAmhsDLNameForm } from "./lib/modules/ATNDirectoryObjectIdentifiers/atnAmhsDLNameForm.oa.js";
import { atnAmhsUANameForm } from "./lib/modules/ATNDirectoryObjectIdentifiers/atnAmhsUANameForm.oa.js";
import { atnAmhsGatewayNameForm } from "./lib/modules/ATNDirectoryObjectIdentifiers/atnAmhsGatewayNameForm.oa.js";
import { atnAmhsMDNameForm } from "./lib/modules/ATNDirectoryObjectIdentifiers/atnAmhsMDNameForm.oa.js";
import { atnOrgNameForm } from "./lib/modules/ATNDirectoryObjectIdentifiers/atnOrgNameForm.oa.js";
import { atnAircraftNameForm } from "./lib/modules/ATNDirectoryObjectIdentifiers/atnAircraftNameForm.oa.js";
import { atnFacilityNameForm } from "./lib/modules/ATNDirectoryObjectIdentifiers/atnFacilityNameForm.oa.js";
import { atnIdrpRouterNameForm } from "./lib/modules/ATNDirectoryObjectIdentifiers/atnIdrpRouterNameForm.oa.js";
import { atnDSANameForm } from "./lib/modules/ATNDirectoryObjectIdentifiers/atnDSANameForm.oa.js";

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
