import type { ASN1Element, INTEGER } from "@wildboar/asn1";
import { teletexToString } from "@wildboar/x500";
import {
    MSString,
} from "@wildboar/x400/MSMatchingRules";
import {
    PresentationAddress,
} from "@wildboar/x500/SelectedAttributeTypes";
import {
    ORAddress,
} from "@wildboar/x400/MTSAbstractService";
import type {
    BuiltInStandardAttributes,
} from "@wildboar/x400/MTSAbstractService";
import type {
    PersonalName,
} from "@wildboar/x400/MTSAbstractService";
import {
    _decode_TeletexPersonalName,
} from "@wildboar/x400/MTSAbstractService";
import {
    _decode_UniversalPersonalName,
} from "@wildboar/x400/MTSAbstractService";
import type {
    UniversalOrBMPString,
} from "@wildboar/x400/MTSAbstractService";
import {
    _decode_TeletexOrganizationalUnitNames,
} from "@wildboar/x400/MTSAbstractService";
import {
    _decode_UniversalOrganizationalUnitNames,
} from "@wildboar/x400/MTSAbstractService";
import {
    _decode_TeletexDomainDefinedAttributes,
} from "@wildboar/x400/MTSAbstractService";
import {
    _decode_UniversalDomainDefinedAttributes,
} from "@wildboar/x400/MTSAbstractService";
import {
    _decode_PhysicalDeliveryCountryName,
} from "@wildboar/x400/MTSAbstractService";
import {
    _decode_PostalCode,
} from "@wildboar/x400/MTSAbstractService";
import {
    PDSParameter,
    _decode_PDSParameter,
} from "@wildboar/x400/MTSAbstractService";
import {
    UniversalPDSParameter,
    _decode_UniversalPDSParameter,
} from "@wildboar/x400/MTSAbstractService";
import {
    _decode_UnformattedPostalAddress,
} from "@wildboar/x400/MTSAbstractService";
import {
    _decode_UniversalUnformattedPostalAddress,
} from "@wildboar/x400/MTSAbstractService";
import {
    _decode_ExtendedNetworkAddress,
} from "@wildboar/x400/MTSAbstractService";
import {
    _decode_TerminalType,
} from "@wildboar/x400/MTSAbstractService";
import {
    common_name,
} from "@wildboar/x400/MTSAbstractService";
import {
    teletex_common_name,
} from "@wildboar/x400/MTSAbstractService";
import {
    universal_common_name,
} from "@wildboar/x400/MTSAbstractService";
import {
    teletex_organization_name,
} from "@wildboar/x400/MTSAbstractService";
import {
    universal_organization_name,
} from "@wildboar/x400/MTSAbstractService";
import {
    teletex_personal_name,
} from "@wildboar/x400/MTSAbstractService";
import {
    universal_personal_name,
} from "@wildboar/x400/MTSAbstractService";
import {
    teletex_organizational_unit_names,
} from "@wildboar/x400/MTSAbstractService";
import {
    universal_organizational_unit_names,
} from "@wildboar/x400/MTSAbstractService";
import {
    teletex_domain_defined_attributes,
} from "@wildboar/x400/MTSAbstractService";
import {
    universal_domain_defined_attributes,
} from "@wildboar/x400/MTSAbstractService";
import {
    pds_name,
} from "@wildboar/x400/MTSAbstractService";
import {
    physical_delivery_country_name,
} from "@wildboar/x400/MTSAbstractService";
import {
    postal_code,
} from "@wildboar/x400/MTSAbstractService";
import {
    physical_delivery_office_name,
} from "@wildboar/x400/MTSAbstractService";
import {
    universal_physical_delivery_office_name,
} from "@wildboar/x400/MTSAbstractService";
import {
    physical_delivery_office_number,
} from "@wildboar/x400/MTSAbstractService";
import {
    universal_physical_delivery_office_number,
} from "@wildboar/x400/MTSAbstractService";
import {
    extension_OR_address_components,
} from "@wildboar/x400/MTSAbstractService";
import {
    universal_extension_OR_address_components,
} from "@wildboar/x400/MTSAbstractService";
import {
    physical_delivery_personal_name,
} from "@wildboar/x400/MTSAbstractService";
import {
    universal_physical_delivery_personal_name,
} from "@wildboar/x400/MTSAbstractService";
import {
    physical_delivery_organization_name,
} from "@wildboar/x400/MTSAbstractService";
import {
    universal_physical_delivery_organization_name,
} from "@wildboar/x400/MTSAbstractService";
import {
    extension_physical_delivery_address_components,
} from "@wildboar/x400/MTSAbstractService";
import {
    universal_extension_physical_delivery_address_components,
} from "@wildboar/x400/MTSAbstractService";
import {
    unformatted_postal_address,
} from "@wildboar/x400/MTSAbstractService";
import {
    universal_unformatted_postal_address,
} from "@wildboar/x400/MTSAbstractService";
import {
    street_address,
} from "@wildboar/x400/MTSAbstractService";
import {
    universal_street_address,
} from "@wildboar/x400/MTSAbstractService";
import {
    post_office_box_address,
} from "@wildboar/x400/MTSAbstractService";
import {
    universal_post_office_box_address,
} from "@wildboar/x400/MTSAbstractService";
import {
    poste_restante_address,
} from "@wildboar/x400/MTSAbstractService";
import {
    universal_poste_restante_address,
} from "@wildboar/x400/MTSAbstractService";
import {
    unique_postal_name,
} from "@wildboar/x400/MTSAbstractService";
import {
    universal_unique_postal_name,
} from "@wildboar/x400/MTSAbstractService";
import {
    local_postal_attributes,
} from "@wildboar/x400/MTSAbstractService";
import {
    universal_local_postal_attributes,
} from "@wildboar/x400/MTSAbstractService";
import {
    extended_network_address,
} from "@wildboar/x400/MTSAbstractService";
import {
    terminal_type,
} from "@wildboar/x400/MTSAbstractService";
import _ from "lodash";


function process_common_name_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const newValue = value.printableString;
    if (info.commonName && (info.commonName !== newValue)) {
        return null;
    }
    info.commonName = newValue;
    return info;
}

function process_teletex_common_name_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const newValue = teletexToString(value.teletexString);
    if (info.commonName && (info.commonName !== newValue)) {
        return null;
    }
    info.commonName = newValue;
    return info;
}

function process_universal_common_name_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const newValue = value.universalString;
    if (info.commonName && (info.commonName !== newValue)) {
        return null;
    }
    info.commonName = newValue;
    return info;
}

function process_teletex_organization_name_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const newValue = teletexToString(value.teletexString);
    if (info.organizationName && (info.organizationName !== newValue)) {
        return null;
    }
    info.organizationName = newValue;
    return info;
}

function process_universal_organization_name_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const newValue = value.universalString;
    if (info.organizationName && (info.organizationName !== newValue)) {
        return null;
    }
    info.organizationName = newValue;
    return info;
}

function process_teletex_personal_name_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const pn = _decode_TeletexPersonalName(value);
    const newValue: PersonalNameInfo = {
        surname: teletexToString(pn.surname),
        givenName: pn.given_name
            ? teletexToString(pn.given_name)
            : undefined,
        generationQualifier: pn.generation_qualifier
            ? teletexToString(pn.generation_qualifier)
            : undefined,
        initials: pn.initials
            ? teletexToString(pn.initials)
            : undefined,
    };
    if (
        info.personalName
        && (
            (info.personalName.givenName !== newValue.givenName)
            || (info.personalName.surname !== newValue.surname)
            || (info.personalName.initials !== newValue.initials)
            || (info.personalName.generationQualifier !== newValue.generationQualifier)
        )
    ) {
        return null;
    }
    info.personalName = newValue;
    return info;
}

export
function univOrBmpToString (uorb: UniversalOrBMPString): string {
    if ("two_octets" in uorb.character_encoding) {
        return uorb.character_encoding.two_octets;
    } else {
        return uorb.character_encoding.four_octets;
    }
}

function pdsParamToString (pds: PDSParameter): string | null {
    if (pds.printable_string) {
        return pds.printable_string;
    } else if (pds.teletex_string) {
        return teletexToString(pds.teletex_string);
    } else {
        return null;
    }
}

function univPDSParamToString (pds: UniversalPDSParameter): string {
    return univOrBmpToString(pds);
}

function process_universal_personal_name_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const pn = _decode_UniversalPersonalName(value);
    const newValue: PersonalNameInfo = {
        surname: univOrBmpToString(pn.surname),
        givenName: pn.given_name
            ? univOrBmpToString(pn.given_name)
            : undefined,
        generationQualifier: pn.generation_qualifier
            ? univOrBmpToString(pn.generation_qualifier)
            : undefined,
        initials: pn.initials
            ? univOrBmpToString(pn.initials)
            : undefined,
    };
    if (
        info.personalName
        && (
            (info.personalName.givenName !== newValue.givenName)
            || (info.personalName.surname !== newValue.surname)
            || (info.personalName.initials !== newValue.initials)
            || (info.personalName.generationQualifier !== newValue.generationQualifier)
        )
    ) {
        return null;
    }
    info.personalName = newValue;
    return info;
}

function process_teletex_organizational_unit_names_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const ouns = _decode_TeletexOrganizationalUnitNames(value);
    const newValue = ouns.map((ou) => teletexToString(ou));
    if (info.organizationalUnitNames?.length) {
        if (info.organizationalUnitNames.length !== ouns.length) {
            return null;
        }
        for (let i = 0; i < newValue.length; i++) {
            const a = newValue[i];
            const b = info.organizationalUnitNames[i];
            if (a !== b) {
                return null;
            }
        }
    }
    info.organizationalUnitNames = newValue;
    return info;
}

function process_universal_organizational_unit_names_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const ouns = _decode_UniversalOrganizationalUnitNames(value);
    const newValue = ouns.map((ou) => univOrBmpToString(ou));
    if (info.organizationalUnitNames?.length) {
        if (info.organizationalUnitNames.length !== ouns.length) {
            return null;
        }
        for (let i = 0; i < newValue.length; i++) {
            const a = newValue[i];
            const b = info.organizationalUnitNames[i];
            if (a !== b) {
                return null;
            }
        }
    }
    info.organizationalUnitNames = newValue;
    return info;
}

function process_teletex_domain_defined_attributes_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    if (info.builtInDomainDefinedAttributes) {
        return null;
    }
    const attrs = _decode_TeletexDomainDefinedAttributes(value);
    info.builtInDomainDefinedAttributes = {};
    for (const bidda of attrs) {
        const key = teletexToString(bidda.type_).toLowerCase();
        const value = teletexToString(bidda.value);
        const existingValue = info.builtInDomainDefinedAttributes[key];
        if (existingValue && (existingValue !== value)) {
            return null; // Duplicate type
        }
        info.builtInDomainDefinedAttributes[key] = value;
    }
    return info;
}

function process_universal_domain_defined_attributes_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    if (info.builtInDomainDefinedAttributes) {
        return null;
    }
    const attrs = _decode_UniversalDomainDefinedAttributes(value);
    info.builtInDomainDefinedAttributes = {};
    for (const bidda of attrs) {
        const key = univOrBmpToString(bidda.type_).toLowerCase();
        const value = univOrBmpToString(bidda.value);
        const existingValue = info.builtInDomainDefinedAttributes[key];
        if (existingValue && (existingValue !== value)) {
            return null; // Duplicate type
        }
        info.builtInDomainDefinedAttributes[key] = value;
    }
    return info;
}

function process_pds_name_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const newValue = value.printableString;
    if (info.pdsName && (info.pdsName !== newValue)) {
        return null;
    }
    info.pdsName = newValue;
    return info;
}

function process_physical_delivery_country_name_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const pdcn = _decode_PhysicalDeliveryCountryName(value);
    const newValue = ("x121_dcc_code" in pdcn)
        ? pdcn.x121_dcc_code.trim().replace(/\s+/g, "")
        : pdcn.iso_3166_alpha2_code.slice(0, 2); // TODO: Slice(0,2) all usage of ISO-3166 codes.
    if (info.physicalDeliveryCountryName && (info.physicalDeliveryCountryName !== newValue)) {
        return null;
    }
    info.physicalDeliveryCountryName = newValue;
    return info;
}

function process_postal_code_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const pc = _decode_PostalCode(value);
    const newValue = ("numeric_code" in pc)
        ? pc.numeric_code.trim().replace(/\s+/g, "")
        : pc.printable_code.trim().slice(0, 16);
    if (info.postalCode && (info.postalCode !== newValue)) {
        return null;
    }
    return info;
}

function process_physical_delivery_office_name_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const param = pdsParamToString(_decode_PDSParameter(value));
    if (!param) {
        return null;
    }
    if (info.physicalDeliveryOfficeName && (info.physicalDeliveryOfficeName !== param)) {
        return null;
    }
    info.physicalDeliveryOfficeName = param;
    return info;
}

function process_universal_physical_delivery_office_name_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const newValue = univPDSParamToString(_decode_UniversalPDSParameter(value));
    if (info.physicalDeliveryOfficeName && (info.physicalDeliveryOfficeName !== newValue)) {
        return null;
    }
    info.physicalDeliveryOfficeName = newValue;
    return info;
}

function process_physical_delivery_office_number_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const param = pdsParamToString(_decode_PDSParameter(value));
    if (!param) {
        return null;
    }
    if (info.physicalDeliveryOfficeNumber && (info.physicalDeliveryOfficeNumber !== param)) {
        return null;
    }
    info.physicalDeliveryOfficeNumber = param;
    return info;
}

function process_universal_physical_delivery_office_number_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const param = univPDSParamToString(_decode_UniversalPDSParameter(value));
    if (!param) {
        return null;
    }
    if (info.physicalDeliveryOfficeNumber && (info.physicalDeliveryOfficeNumber !== param)) {
        return null;
    }
    info.physicalDeliveryOfficeNumber = param;
    return info;
}

function process_extension_OR_address_components_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const param = pdsParamToString(_decode_PDSParameter(value));
    if (!param) {
        return null;
    }
    if (info.extensionORAddressComponents && (info.extensionORAddressComponents !== param)) {
        return null;
    }
    info.extensionORAddressComponents = param;
    return info;
}

function process_universal_extension_OR_address_components_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const param = univPDSParamToString(_decode_UniversalPDSParameter(value));
    if (!param) {
        return null;
    }
    if (info.extensionORAddressComponents && (info.extensionORAddressComponents !== param)) {
        return null;
    }
    info.extensionORAddressComponents = param;
    return info;
}

function process_physical_delivery_personal_name_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const param = pdsParamToString(_decode_PDSParameter(value));
    if (!param) {
        return null;
    }
    if (info.physicalDeliveryPersonalName && (info.physicalDeliveryPersonalName !== param)) {
        return null;
    }
    info.physicalDeliveryPersonalName = param;
    return info;
}

function process_universal_physical_delivery_personal_name_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const param = univPDSParamToString(_decode_UniversalPDSParameter(value));
    if (!param) {
        return null;
    }
    if (info.physicalDeliveryPersonalName && (info.physicalDeliveryPersonalName !== param)) {
        return null;
    }
    info.physicalDeliveryPersonalName = param;
    return info;
}

function process_physical_delivery_organization_name_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const param = pdsParamToString(_decode_PDSParameter(value));
    if (!param) {
        return null;
    }
    if (info.physicalDeliveryOrganizationName && (info.physicalDeliveryOrganizationName !== param)) {
        return null;
    }
    info.physicalDeliveryOrganizationName = param;
    return info;
}

function process_universal_physical_delivery_organization_name_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const param = univPDSParamToString(_decode_UniversalPDSParameter(value));
    if (!param) {
        return null;
    }
    if (info.physicalDeliveryOrganizationName && (info.physicalDeliveryOrganizationName !== param)) {
        return null;
    }
    info.physicalDeliveryOrganizationName = param;
    return info;
}

function process_extension_physical_delivery_address_components_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const param = pdsParamToString(_decode_PDSParameter(value));
    if (!param) {
        return null;
    }
    if (info.physicalDeliveryAddressComponents && (info.physicalDeliveryAddressComponents !== param)) {
        return null;
    }
    info.physicalDeliveryAddressComponents = param;
    return info;
}

function process_universal_extension_physical_delivery_address_components_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const param = univPDSParamToString(_decode_UniversalPDSParameter(value));
    if (!param) {
        return null;
    }
    if (info.physicalDeliveryAddressComponents && (info.physicalDeliveryAddressComponents !== param)) {
        return null;
    }
    info.physicalDeliveryAddressComponents = param;
    return info;
}

function process_unformatted_postal_address_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const param = _decode_UnformattedPostalAddress(value);
    const newValue = param.printable_address
        ? param.printable_address.join("\r\n")
        : (param.teletex_string)
            ? teletexToString(param.teletex_string).replace(/\n\r/g, "\r\n")
            : undefined;
    if (!newValue) {
        return null;
    }
    if (info.unformattedPostalAddress && (info.unformattedPostalAddress !== newValue)) {
        return null;
    }
    info.unformattedPostalAddress = newValue;
    return info;
}

function process_universal_unformatted_postal_address_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const param = _decode_UniversalUnformattedPostalAddress(value);
    const newValue = univOrBmpToString(param);
    if (!newValue) {
        return null;
    }
    if (info.unformattedPostalAddress && (info.unformattedPostalAddress !== newValue)) {
        return null;
    }
    info.unformattedPostalAddress = newValue;
    return info;
}

function process_street_address_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const param = pdsParamToString(_decode_PDSParameter(value));
    if (!param) {
        return null;
    }
    if (info.streetAddress && (info.streetAddress !== param)) {
        return null;
    }
    info.streetAddress = param;
    return info;
}

function process_universal_street_address_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const param = univPDSParamToString(_decode_UniversalPDSParameter(value));
    if (!param) {
        return null;
    }
    if (info.streetAddress && (info.streetAddress !== param)) {
        return null;
    }
    info.streetAddress = param;
    return info;
}

function process_post_office_box_address_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const param = pdsParamToString(_decode_PDSParameter(value));
    if (!param) {
        return null;
    }
    if (info.postOfficeBoxAddress && (info.postOfficeBoxAddress !== param)) {
        return null;
    }
    info.postOfficeBoxAddress = param;
    return info;
}

function process_universal_post_office_box_address_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const param = univPDSParamToString(_decode_UniversalPDSParameter(value));
    if (!param) {
        return null;
    }
    if (info.postOfficeBoxAddress && (info.postOfficeBoxAddress !== param)) {
        return null;
    }
    info.postOfficeBoxAddress = param;
    return info;
}

function process_poste_restante_address_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const param = pdsParamToString(_decode_PDSParameter(value));
    if (!param) {
        return null;
    }
    if (info.posteRestanteAddress && (info.posteRestanteAddress !== param)) {
        return null;
    }
    info.posteRestanteAddress = param;
    return info;
}

function process_universal_poste_restante_address_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const param = univPDSParamToString(_decode_UniversalPDSParameter(value));
    if (!param) {
        return null;
    }
    if (info.posteRestanteAddress && (info.posteRestanteAddress !== param)) {
        return null;
    }
    info.posteRestanteAddress = param;
    return info;
}

function process_unique_postal_name_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const param = pdsParamToString(_decode_PDSParameter(value));
    if (!param) {
        return null;
    }
    if (info.uniquePostalName && (info.uniquePostalName !== param)) {
        return null;
    }
    info.uniquePostalName = param;
    return info;
}

function process_universal_unique_postal_name_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const param = univPDSParamToString(_decode_UniversalPDSParameter(value));
    if (!param) {
        return null;
    }
    if (info.uniquePostalName && (info.uniquePostalName !== param)) {
        return null;
    }
    info.uniquePostalName = param;
    return info;
}

function process_local_postal_attributes_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const param = pdsParamToString(_decode_PDSParameter(value));
    if (!param) {
        return null;
    }
    if (info.localPostalAttributes && (info.localPostalAttributes !== param)) {
        return null;
    }
    info.localPostalAttributes = param;
    return info;
}

function process_universal_local_postal_attributes_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const param = univPDSParamToString(_decode_UniversalPDSParameter(value));
    if (!param) {
        return null;
    }
    if (info.localPostalAttributes && (info.localPostalAttributes !== param)) {
        return null;
    }
    info.localPostalAttributes = param;
    return info;
}

function process_extended_network_address_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const param = _decode_ExtendedNetworkAddress(value);
    if ("e163_4_address" in param) {
        const numberPart = param.e163_4_address.number_.trim().replace(/\s+/g, "");
        const subaddressPart = param.e163_4_address.sub_address?.trim().replace(/\s+/g, "");
        if (info.extendedNetworkAddress) {
            if (!Array.isArray(info.extendedNetworkAddress)) {
                return null;
            }
            const existingValue = info.extendedNetworkAddress;
            if (numberPart !== existingValue[0]) {
                return null;
            }
            if (subaddressPart !== existingValue[1]) {
                return null;
            }
        }
        info.extendedNetworkAddress = [ numberPart, subaddressPart ];
    } else {
        // TODO: Needs comparePresentationAddress() function in X.500 library.
        info.extendedNetworkAddress = param.psap_address;
    }
    return info;
}

function process_terminal_type_ext (info: ORAddressInfo, value: ASN1Element): ORAddressInfo | null {
    const newValue = _decode_TerminalType(value);
    if ((info.terminalType !== undefined) && (info.terminalType !== newValue)) {
        return null;
    }
    info.terminalType = Number(newValue);
    return info;
}

const handlers: Map<INTEGER, (info: ORAddressInfo, value: ASN1Element) => (ORAddressInfo | null)> = new Map([
    [ common_name["&id"]!, process_common_name_ext ],
    [ teletex_common_name["&id"]!, process_teletex_common_name_ext ],
    [ universal_common_name["&id"]!, process_universal_common_name_ext ],
    [ teletex_organization_name["&id"]!, process_teletex_organization_name_ext ],
    [ universal_organization_name["&id"]!, process_universal_organization_name_ext ],
    [ teletex_personal_name["&id"]!, process_teletex_personal_name_ext ],
    [ universal_personal_name["&id"]!, process_universal_personal_name_ext ],
    [ teletex_organizational_unit_names["&id"]!, process_teletex_organizational_unit_names_ext ],
    [ universal_organizational_unit_names["&id"]!, process_universal_organizational_unit_names_ext ],
    [ teletex_domain_defined_attributes["&id"]!, process_teletex_domain_defined_attributes_ext ],
    [ universal_domain_defined_attributes["&id"]!, process_universal_domain_defined_attributes_ext ],
    [ pds_name["&id"]!, process_pds_name_ext ],
    [ physical_delivery_country_name["&id"]!, process_physical_delivery_country_name_ext ],
    [ postal_code["&id"]!, process_postal_code_ext ],
    [ physical_delivery_office_name["&id"]!, process_physical_delivery_office_name_ext ],
    [ universal_physical_delivery_office_name["&id"]!, process_universal_physical_delivery_office_name_ext ],
    [ physical_delivery_office_number["&id"]!, process_physical_delivery_office_number_ext ],
    [ universal_physical_delivery_office_number["&id"]!, process_universal_physical_delivery_office_number_ext ],
    [ extension_OR_address_components["&id"]!, process_extension_OR_address_components_ext ],
    [ universal_extension_OR_address_components["&id"]!, process_universal_extension_OR_address_components_ext ],
    [ physical_delivery_personal_name["&id"]!, process_physical_delivery_personal_name_ext ],
    [ universal_physical_delivery_personal_name["&id"]!, process_universal_physical_delivery_personal_name_ext ],
    [ physical_delivery_organization_name["&id"]!, process_physical_delivery_organization_name_ext ],
    [ universal_physical_delivery_organization_name["&id"]!, process_universal_physical_delivery_organization_name_ext ],
    [ extension_physical_delivery_address_components["&id"]!, process_extension_physical_delivery_address_components_ext ],
    [ universal_extension_physical_delivery_address_components["&id"]!, process_universal_extension_physical_delivery_address_components_ext ],
    [ unformatted_postal_address["&id"]!, process_unformatted_postal_address_ext ],
    [ universal_unformatted_postal_address["&id"]!, process_universal_unformatted_postal_address_ext ],
    [ street_address["&id"]!, process_street_address_ext ],
    [ universal_street_address["&id"]!, process_universal_street_address_ext ],
    [ post_office_box_address["&id"]!, process_post_office_box_address_ext ],
    [ universal_post_office_box_address["&id"]!, process_universal_post_office_box_address_ext ],
    [ poste_restante_address["&id"]!, process_poste_restante_address_ext ],
    [ universal_poste_restante_address["&id"]!, process_universal_poste_restante_address_ext ],
    [ unique_postal_name["&id"]!, process_unique_postal_name_ext ],
    [ universal_unique_postal_name["&id"]!, process_universal_unique_postal_name_ext ],
    [ local_postal_attributes["&id"]!, process_local_postal_attributes_ext ],
    [ universal_local_postal_attributes["&id"]!, process_universal_local_postal_attributes_ext ],
    [ extended_network_address["&id"]!, process_extended_network_address_ext ],
    [ terminal_type["&id"]!, process_terminal_type_ext ],
]);


// ORAddress ::= SEQUENCE {
//     built-in-standard-attributes        BuiltInStandardAttributes,
//     built-in-domain-defined-attributes  BuiltInDomainDefinedAttributes OPTIONAL,
//     -- see also teletex-domain-defined-attributes
//     extension-attributes                ExtensionAttributes OPTIONAL
//   }

//   --	The OR-address is semantically absent from the OR-name if the built-in-standard-attribute
//   --	sequence is empty and the built-in-domain-defined-attributes and extension-attributes are both omitted.
//   --	Built-in Standard Attributes
//   BuiltInStandardAttributes ::= SEQUENCE {
//     country-name                CountryName OPTIONAL,
//     administration-domain-name  AdministrationDomainName OPTIONAL,
//     network-address             [0]  NetworkAddress OPTIONAL,
//     -- see also extended-network-address
//     terminal-identifier         [1]  TerminalIdentifier OPTIONAL,
//     private-domain-name         [2]  PrivateDomainName OPTIONAL,
//     organization-name           [3]  OrganizationName OPTIONAL,
//     -- see also teletex-organization-name
//     numeric-user-identifier     [4]  NumericUserIdentifier OPTIONAL,
//     personal-name               [5]  PersonalName OPTIONAL,
//     -- see also teletex-personal-name
//     organizational-unit-names   [6]  OrganizationalUnitNames OPTIONAL
//     -- see also teletex-organizational-unit-names
//   }

//   CountryName ::= [APPLICATION 1]  CHOICE {
//     x121-dcc-code         NumericString(SIZE (ub-country-name-numeric-length)),
//     iso-3166-alpha2-code  PrintableString(SIZE (ub-country-name-alpha-length))
//   }

//   AdministrationDomainName ::= [APPLICATION 2]  CHOICE {
//     numeric    NumericString(SIZE (0..ub-domain-name-length)),
//     printable  PrintableString(SIZE (0..ub-domain-name-length))
//   }

//   NetworkAddress ::= X121Address

//   -- see also extended-network-address
//   X121Address ::= NumericString(SIZE (1..ub-x121-address-length))

//   TerminalIdentifier ::= PrintableString(SIZE (1..ub-terminal-id-length))

//   PrivateDomainName ::= CHOICE {
//     numeric    NumericString(SIZE (1..ub-domain-name-length)),
//     printable  PrintableString(SIZE (1..ub-domain-name-length))
//   }

//   OrganizationName ::= PrintableString(SIZE (1..ub-organization-name-length))

//   -- see also teletex-organization-name
//   NumericUserIdentifier ::= NumericString(SIZE (1..ub-numeric-user-id-length))

//   PersonalName ::= SET {
//     surname               [0]  PrintableString(SIZE (1..ub-surname-length)),
//     given-name
//       [1]  PrintableString(SIZE (1..ub-given-name-length)) OPTIONAL,
//     initials
//       [2]  PrintableString(SIZE (1..ub-initials-length)) OPTIONAL,
//     generation-qualifier
//       [3]  PrintableString(SIZE (1..ub-generation-qualifier-length)) OPTIONAL
//   }

//   -- see also teletex-personal-name
//   OrganizationalUnitNames ::=
//     SEQUENCE SIZE (1..ub-organizational-units) OF OrganizationalUnitName

//   -- see also teletex-organizational-unit-names
//   OrganizationalUnitName ::=
//     PrintableString(SIZE (1..ub-organizational-unit-name-length))

//   --	Built-in Domain-defined Attributes
//   BuiltInDomainDefinedAttributes ::=
//     SEQUENCE SIZE (1..ub-domain-defined-attributes) OF
//       BuiltInDomainDefinedAttribute

//   BuiltInDomainDefinedAttribute ::= SEQUENCE {
//     type   PrintableString(SIZE (1..ub-domain-defined-attribute-type-length)),
//     value  PrintableString(SIZE (1..ub-domain-defined-attribute-value-length))
//   }

//   --	Extension Attributes
//   ExtensionAttributes ::=
//     SET SIZE (1..ub-extension-attributes) OF ExtensionAttribute

//   ExtensionAttribute ::= SEQUENCE {
//     extension-attribute-type
//       [0]  EXTENSION-ATTRIBUTE.&id({ExtensionAttributeTable}),
//     extension-attribute-value
//       [1]  EXTENSION-ATTRIBUTE.&Type
//              ({ExtensionAttributeTable}{@extension-attribute-type})
//   }

export
interface PersonalNameInfo {
    surname: string;
    givenName?: string;
    generationQualifier?: string;
    initials?: string;
}

export
interface ORAddressInfo {
    countryName?: string;
    administrationDomainName?: string;
    networkAddress?: string;
    terminalIdentifier?: string;
    privateDomainName?: string;
    organizationName?: string;
    numericUserIdentifier?: string;
    personalName?: PersonalNameInfo;
    organizationalUnitNames?: string[];
    // built-in-domain-defined-attributes
    builtInDomainDefinedAttributes?: Record<string, string>;

    // From extension-attributes only
    commonName?: string;
    pdsName?: string;
    extensionORAddressComponents?: string;
    postalCode?: string;
    physicalDeliveryCountryName?: string;
    physicalDeliveryOfficeName?: string;
    physicalDeliveryOfficeNumber?: string;
    physicalDeliveryPersonalName?: string;
    physicalDeliveryOrganizationName?: string;
    physicalDeliveryAddressComponents?: string;
    unformattedPostalAddress?: string;
    streetAddress?: string;
    postOfficeBoxAddress?: string;
    posteRestanteAddress?: string;
    uniquePostalName?: string;
    localPostalAttributes?: string;
    extendedNetworkAddress?: [ string, string? ] | PresentationAddress;
    terminalType?: number;
}

export
function comparePersonalName (a: PersonalName, b: PersonalName): boolean {
    if (a.surname.toUpperCase() !== b.surname.toUpperCase()) {
        return false;
    }
    if (a.given_name?.toUpperCase() !== b.given_name?.toUpperCase()) {
        return false;
    }
    if (a.initials?.toUpperCase() !== b.initials?.toUpperCase()) {
        return false;
    }
    if (a.generation_qualifier?.toUpperCase() !== b.generation_qualifier?.toUpperCase()) {
        return false;
    }
    return true;
}

export
function compareBuiltInStandardAttributes (
    a: BuiltInStandardAttributes,
    b: BuiltInStandardAttributes,
): boolean {
    if ((!!a.country_name) !== (!!b.country_name)) {
        return false;
    }
    if ((!!a.administration_domain_name) !== (!!b.administration_domain_name)) {
        return false;
    }
    if ((!!a.network_address) !== (!!b.network_address)) {
        return false;
    }
    if ((!!a.terminal_identifier) !== (!!b.terminal_identifier)) {
        return false;
    }
    if ((!!a.private_domain_name) !== (!!b.private_domain_name)) {
        return false;
    }
    if ((!!a.organization_name) !== (!!b.organization_name)) {
        return false;
    }
    if ((!!a.numeric_user_identifier) !== (!!b.numeric_user_identifier)) {
        return false;
    }
    if ((!!a.personal_name) !== (!!b.personal_name)) {
        return false;
    }
    if ((!!a.organizational_unit_names) !== (!!b.organizational_unit_names)) {
        return false;
    }
    if (
        a.organizational_unit_names
        && (a.organizational_unit_names?.length !== b.organizational_unit_names?.length)
    ) {
        return false;
    }
    if (a.country_name) {
        if (!b.country_name) {
            return false;
        }
        if ("x121_dcc_code" in a.country_name) {
            if (!("x121_dcc_code" in b.country_name)) {
                return false;
            }
            // Technically, these codes should be comparable to their
            // equivalent ISO-3166 codes, but this will not be supported for now.
            const acc = a.country_name.x121_dcc_code.trim().replace(/\s+/g, "");
            const bcc = b.country_name.x121_dcc_code.trim().replace(/\s+/g, "");
            if (acc !== bcc) {
                return false;
            }
        } else if ("iso_3166_alpha2_code" in b.country_name) {
            const acc = a.country_name.iso_3166_alpha2_code.toUpperCase();
            const bcc = a.country_name.iso_3166_alpha2_code.toUpperCase();
            if (acc !== bcc) {
                return false;
            }
        } else {
            return false;
        }
    }
    if (a.administration_domain_name) {
        if (!b.administration_domain_name) {
            return false;
        }
        // FIXME: You can compare numeric to printable.
        if ("numeric" in a.administration_domain_name) {
            if (!("numeric" in b.administration_domain_name)) {
                return false;
            }
            const aadn = a.administration_domain_name.numeric.trim().replace(/\s+/g, "");
            const badn = b.administration_domain_name.numeric.trim().replace(/\s+/g, "");
            if (aadn !== badn) {
                return false;
            }
        } else if ("printable" in b.administration_domain_name) {
            const aadn = a.administration_domain_name.printable.trim().toUpperCase();
            const badn = b.administration_domain_name.printable.trim().toUpperCase();
            if (aadn !== badn) {
                return false;
            }
        } else {
            return false;
        }
    }
    if (a.network_address) {
        if (!b.network_address) {
            return false;
        }
        const ana = a.network_address.trim().replace(/\s+/g, "");
        const bna = b.network_address.trim().replace(/\s+/g, "");
        if (ana !== bna) {
            return false;
        }
    }
    if (a.terminal_identifier) {
        if (!b.terminal_identifier) {
            return false;
        }
        const ati = a.terminal_identifier.toUpperCase();
        const bti = b.terminal_identifier.toUpperCase();
        if (ati !== bti) {
            return false;
        }
    }
    if (a.private_domain_name) {
        if (!b.private_domain_name) {
            return false;
        }
        // FIXME: You can compare numeric to printable.
        if ("numeric" in a.private_domain_name) {
            if (!("numeric" in b.private_domain_name)) {
                return false;
            }
            const apdn = a.private_domain_name.numeric.trim().replace(/\s+/g, "");
            const bpdn = b.private_domain_name.numeric.trim().replace(/\s+/g, "");
            if (apdn !== bpdn) {
                return false;
            }
        } else if ("printable" in a.private_domain_name) {
            if (!("printable" in b.private_domain_name)) {
                return false;
            }
            const apdn = a.private_domain_name.printable.toUpperCase();
            const bpdn = b.private_domain_name.printable.toUpperCase();
            if (apdn !== bpdn) {
                return false;
            }
        } else {
            return false;
        }
    }
    if (a.organization_name) {
        if (!b.organization_name) {
            return false;
        }
        const aon = a.organization_name.toUpperCase();
        const bon = b.organization_name.toUpperCase();
        if (aon !== bon) {
            return false;
        }
    }
    if (a.numeric_user_identifier) {
        if (!b.numeric_user_identifier) {
            return false;
        }
        const anui = a.numeric_user_identifier.trim().replace(/\s+/g, "");
        const bnui = b.numeric_user_identifier.trim().replace(/\s+/g, "");
        if (anui !== bnui) {
            return false;
        }
    }
    if (a.personal_name && !comparePersonalName(a.personal_name, b.personal_name!)) {
        return false;
    }
    if (a.organizational_unit_names) {
        for (let i = 0; i < a.organizational_unit_names.length; i++) {
            const aoun = a.organizational_unit_names[i].toUpperCase();
            const boun = b.organizational_unit_names?.[i].toUpperCase();
            if (aoun !== boun) {
                return false;
            }
        }
    }
    return true;
}

// export
// function oRAddressesMatch (a: ORAddress, b: ORAddress): boolean {
//     if (a.extension_attributes?.length !== b.extension_attributes?.length) {
//         return false;
//     }
//     if (a.built_in_domain_defined_attributes?.length !== b.built_in_domain_defined_attributes?.length) {
//         return false;
//     }
//     if (!compareBuiltInStandardAttributes(a.built_in_standard_attributes, b.built_in_standard_attributes)) {
//         return false;
//     }
//     if (a.built_in_domain_defined_attributes) {
//         const abiddaIndex: Map<string, string> = new Map();
//         for (const bidda of a.built_in_domain_defined_attributes) {
//             // I can't find much information on how these are even used at all.
//             const key = bidda.type_.trim().toUpperCase();
//             if (abiddaIndex.has(key)) {
//                 return false; // Duplicate values.
//             } else {
//                 abiddaIndex.set(key, bidda.value);
//             }
//         }
//         for (const bbidda of b.built_in_domain_defined_attributes ?? []) {
//             const key = bbidda.type_.trim().toUpperCase();
//             const avalue = abiddaIndex.get(key);
//             if (avalue !== bbidda.value) {
//                 return false;
//             }
//         }
//     }


//     return true;
// }

export
function orAddressToInfo (addr: ORAddress): ORAddressInfo | null {
    let ret: ORAddressInfo = {};
    const bisa = addr.built_in_standard_attributes;
    if (bisa.country_name) {
        if ("x121_dcc_code" in bisa.country_name) {
            ret.countryName = bisa.country_name.x121_dcc_code.trim().replace(/\s+/g, "");
        } else {
            ret.countryName = bisa.country_name.iso_3166_alpha2_code.toUpperCase();
        }
    }
    if (bisa.administration_domain_name) {
        if ("printable" in bisa.administration_domain_name) {
            ret.administrationDomainName = bisa.administration_domain_name.printable;
        } else {
            ret.administrationDomainName = bisa.administration_domain_name.numeric.trim().replace(/\s+/g, "");
        }
    }
    if (bisa.network_address) {
        ret.networkAddress = bisa.network_address.trim().replace(/\s+/g, "");
    }
    if (bisa.terminal_identifier) {
        ret.terminalIdentifier = bisa.terminal_identifier;
    }
    if (bisa.private_domain_name) {
        if ("printable" in bisa.private_domain_name) {
            ret.privateDomainName = bisa.private_domain_name.printable;
        } else {
            ret.privateDomainName = bisa.private_domain_name.numeric.trim().replace(/\s+/g, "");
        }
    }
    if (bisa.organization_name) {
        ret.organizationName = bisa.organization_name;
    }
    if (bisa.numeric_user_identifier) {
        ret.numericUserIdentifier = bisa.numeric_user_identifier.trim().replace(/\s+/g, "");
    }
    if (bisa.personal_name) {
        const personalInfo: PersonalName = {
            surname: bisa.personal_name.surname,
            given_name: bisa.personal_name.given_name,
            generation_qualifier: bisa.personal_name.generation_qualifier,
            initials: bisa.personal_name.initials,
        };
        ret.personalName = personalInfo;
    }
    if (bisa.organizational_unit_names) {
        ret.organizationalUnitNames = bisa.organizational_unit_names;
    }

    if (addr.built_in_domain_defined_attributes?.length) {
        ret.builtInDomainDefinedAttributes = {};
        for (const bidda of addr.built_in_domain_defined_attributes) {
            const key = bidda.type_.toLowerCase();
            if (ret.builtInDomainDefinedAttributes[key]) {
                return null; // Duplicate type
            }
            ret.builtInDomainDefinedAttributes[key] = bidda.value;
        }
    }

    for (const ext of addr.extension_attributes ?? []) {
        const handler = handlers.get(ext.extension_attribute_type);
        if (!handler) {
            return null; // Extension not understood.
        }
        const handlerResult = handler(ret, ext.extension_attribute_value);
        if (!handlerResult) {
            return null; // Error, usually a duplicated value.
        }
        ret = handlerResult;
    }

    return ret;
}

export
function orAddressesMatch (a: ORAddress, b: ORAddress): boolean {
    const aInfo: ORAddressInfo | null = orAddressToInfo(a);
    const bInfo: ORAddressInfo | null = orAddressToInfo(b);
    if (!aInfo) {
        return false;
    }
    if (!bInfo) {
        return false;
    }
    const comparableAInfo: ORAddressInfo = recursivelyNormalize({
        ...aInfo,
        extendedNetworkAddress: undefined,
    });
    const comparableBInfo: ORAddressInfo = recursivelyNormalize({
        ...bInfo,
        extendedNetworkAddress: undefined,
    });
    if (!_.isEqual(comparableAInfo, comparableBInfo)) {
        return false;
    }
    if (!!aInfo.extendedNetworkAddress && !!bInfo.extendedNetworkAddress) {
        return false;
    }
    if (
        aInfo.extendedNetworkAddress
        && bInfo.extendedNetworkAddress
        && (aInfo.extendedNetworkAddress instanceof PresentationAddress)
    ) {
        if (!(bInfo.extendedNetworkAddress instanceof PresentationAddress)) {
            return false;
        }
        const presa = aInfo.extendedNetworkAddress;
        const presb = bInfo.extendedNetworkAddress;
        // TODO: Compare presentation addresses. Depends on implementation in X.500 Library.
    }
    return true;
}

export
function msStringToString (ms: MSString): string {
    if ("printable" in ms) {
        return ms.printable;
    } else if ("teletex" in ms) {
        return teletexToString(ms.teletex);
    } else if ("general" in ms) {
        return ms.general;
    } else if ("universal" in ms) {
        return ms.universal;
    } else if ("bmp" in ms) {
        return ms.bmp;
    } else {
        return "?";
    }
}

export
function recursivelyNormalize <T> (value: T): T {
    if (typeof value === "string") {
        return value.trim().replace(/\s+/g, " ").toUpperCase() as unknown as T;
    } else if (typeof value === "object") {
        if (!value) {
            return value;
        }
        for (const key of Object.keys(value)) {
            value[key] = recursivelyNormalize(value[key]);
        }
        return value;
    } else {
        return value;
    }
}
