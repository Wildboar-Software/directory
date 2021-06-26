import { Context } from "../types";
import * as x500at from "@wildboar/x500/src/lib/collections/attributes";
import attributeFromInformationObject from "./attributeFromInformationObject";
import {
    caseIgnoreMatch,
} from "@wildboar/x500/src/lib/matching/equality/caseIgnoreMatch";
import {
    caseExactMatch,
} from "@wildboar/x500/src/lib/matching/equality/caseExactMatch";
import {
    dnsNameMatch,
} from "@wildboar/x500/src/lib/matching/equality/dnsNameMatch";
import {
    intEmailMatch,
} from "@wildboar/x500/src/lib/matching/equality/intEmailMatch";
import {
    telephoneNumberMatch,
} from "@wildboar/x500/src/lib/matching/equality/telephoneNumberMatch";
import {
    uriMatch,
} from "@wildboar/x500/src/lib/matching/equality/uriMatch";
import {
    jidMatch,
} from "@wildboar/x500/src/lib/matching/equality/jidMatch";
import {
    uUIDPairMatch,
} from "@wildboar/x500/src/lib/matching/equality/uUIDPairMatch";

export
function loadAttributeTypes (ctx: Context): void {
    Object.values(x500at)
        .map(attributeFromInformationObject)
        .forEach((attr) => {
            ctx.attributes.set(attr.id.toString(), attr);
            attr.ldapNames?.forEach((ldapName: string): void => {
                ctx.attributes.set(ldapName.trim().toLowerCase(), attr);
                if (!attr.ldapSyntax) {
                    return;
                }
                const oidSyntax = ctx.ldapSyntaxes.get(attr.ldapSyntax.toString());
                if (!oidSyntax) {
                    return;
                }
                ctx.ldapSyntaxes.set(ldapName, oidSyntax);
            });
        });

    // Naming matchers have to be set manually, because there is no way for the
    // runtime to know if an assertion syntax is the same as the value syntax.
    ctx.attributes.get(x500at.businessCategory["&id"].toString())!.namingMatcher = caseIgnoreMatch;
    ctx.attributes.get(x500at.collectiveFacsimileTelephoneNumber["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.collectiveInternationalISDNNumber["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.collectiveLocalityName["&id"].toString())!.namingMatcher = caseIgnoreMatch;
    ctx.attributes.get(x500at.collectiveOrganizationalUnitName["&id"].toString())!.namingMatcher = caseIgnoreMatch;
    ctx.attributes.get(x500at.collectiveOrganizationName["&id"].toString())!.namingMatcher = caseIgnoreMatch;
    ctx.attributes.get(x500at.collectivePhysicalDeliveryOfficeName["&id"].toString())!.namingMatcher = caseIgnoreMatch;
    ctx.attributes.get(x500at.collectivePostalAddress["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.collectivePostalCode["&id"].toString())!.namingMatcher = caseIgnoreMatch;
    ctx.attributes.get(x500at.collectivePostOfficeBox["&id"].toString())!.namingMatcher = caseIgnoreMatch;
    ctx.attributes.get(x500at.collectiveStateOrProvinceName["&id"].toString())!.namingMatcher = caseIgnoreMatch;
    ctx.attributes.get(x500at.collectiveStreetAddress["&id"].toString())!.namingMatcher = caseIgnoreMatch;
    ctx.attributes.get(x500at.collectiveTelephoneNumber["&id"].toString())!.namingMatcher = telephoneNumberMatch;
    ctx.attributes.get(x500at.collectiveTelexNumber["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.commonName["&id"].toString())!.namingMatcher = caseIgnoreMatch;
    ctx.attributes.get(x500at.communicationsNetwork["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.communicationsService["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.contentUrl["&id"].toString())!.namingMatcher = uriMatch;
    ctx.attributes.get(x500at.countryCode3c["&id"].toString())!.namingMatcher = caseIgnoreMatch;
    ctx.attributes.get(x500at.countryCode3n["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.countryName["&id"].toString())!.namingMatcher = caseIgnoreMatch;
    ctx.attributes.get(x500at.description["&id"].toString())!.namingMatcher = caseIgnoreMatch;
    ctx.attributes.get(x500at.destinationIndicator["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.distinguishedName["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.dmdName["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.dnQualifier["&id"].toString())!.namingMatcher = caseIgnoreMatch;
    ctx.attributes.get(x500at.dnsName["&id"].toString())!.namingMatcher = dnsNameMatch;
    ctx.attributes.get(x500at.enhancedSearchGuide["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.epc["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.epcFormat["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.epcInUrn["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.facsimileTelephoneNumber["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.generationQualifier["&id"].toString())!.namingMatcher = caseIgnoreMatch;
    ctx.attributes.get(x500at.givenName["&id"].toString())!.namingMatcher = caseIgnoreMatch;
    ctx.attributes.get(x500at.houseIdentifier["&id"].toString())!.namingMatcher = caseIgnoreMatch;
    ctx.attributes.get(x500at.initials["&id"].toString())!.namingMatcher = caseIgnoreMatch;
    ctx.attributes.get(x500at.intEmail["&id"].toString())!.namingMatcher = intEmailMatch;
    ctx.attributes.get(x500at.internationalISDNNumber["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.jid["&id"].toString())!.namingMatcher = jidMatch;
    ctx.attributes.get(x500at.knowledgeInformation["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.ldapUrl["&id"].toString())!.namingMatcher = uriMatch;
    ctx.attributes.get(x500at.localityName["&id"].toString())!.namingMatcher = caseIgnoreMatch;
    ctx.attributes.get(x500at.member["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.name["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.objectIdentifier["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.organizationalUnitName["&id"].toString())!.namingMatcher = caseIgnoreMatch;
    ctx.attributes.get(x500at.organizationIdentifier["&id"].toString())!.namingMatcher = caseIgnoreMatch;
    ctx.attributes.get(x500at.organizationName["&id"].toString())!.namingMatcher = caseIgnoreMatch;
    ctx.attributes.get(x500at.owner["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.physicalDeliveryOfficeName["&id"].toString())!.namingMatcher = caseIgnoreMatch;
    ctx.attributes.get(x500at.postalAddress["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.postalCode["&id"].toString())!.namingMatcher = caseIgnoreMatch;
    ctx.attributes.get(x500at.postOfficeBox["&id"].toString())!.namingMatcher = caseIgnoreMatch;
    ctx.attributes.get(x500at.preferredDeliveryMethod["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.presentationAddress["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.protocolInformation["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.pseudonym["&id"].toString())!.namingMatcher = caseIgnoreMatch;
    ctx.attributes.get(x500at.registeredAddress["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.roleOccupant["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.searchGuide["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.seeAlso["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.serialNumber["&id"].toString())!.namingMatcher = caseIgnoreMatch;
    ctx.attributes.get(x500at.stateOrProvinceName["&id"].toString())!.namingMatcher = caseIgnoreMatch;
    ctx.attributes.get(x500at.streetAddress["&id"].toString())!.namingMatcher = caseIgnoreMatch;
    ctx.attributes.get(x500at.supportedApplicationContext["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.surname["&id"].toString())!.namingMatcher = caseIgnoreMatch;
    ctx.attributes.get(x500at.tagAfi["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.tagLocation["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.tagOid["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.telephoneNumber["&id"].toString())!.namingMatcher = telephoneNumberMatch;
    ctx.attributes.get(x500at.telexNumber["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.title["&id"].toString())!.namingMatcher = caseIgnoreMatch;
    ctx.attributes.get(x500at.uii["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.uiiFormat["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.uiiInUrn["&id"].toString())!.namingMatcher = caseExactMatch;
    ctx.attributes.get(x500at.uniqueIdentifier["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.uniqueMember["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.uri["&id"].toString())!.namingMatcher = uriMatch;
    ctx.attributes.get(x500at.url["&id"].toString())!.namingMatcher = uriMatch;
    ctx.attributes.get(x500at.urn["&id"].toString())!.namingMatcher = uriMatch;
    ctx.attributes.get(x500at.urnC["&id"].toString())!.namingMatcher = caseExactMatch;
    ctx.attributes.get(x500at.utmCoordinates["&id"].toString())!.namingMatcher = undefined;
    ctx.attributes.get(x500at.uUIDPair["&id"].toString())!.namingMatcher = uUIDPairMatch;
    ctx.attributes.get(x500at.x121Address["&id"].toString())!.namingMatcher = undefined;
}

export default loadAttributeTypes;
