import type { Context, AttributeInfo } from "../types";
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
    uriMatch,
} from "@wildboar/x500/src/lib/matching/equality/uriMatch";
import {
    jidMatch,
} from "@wildboar/x500/src/lib/matching/equality/jidMatch";
import {
    uUIDPairMatch,
} from "@wildboar/x500/src/lib/matching/equality/uUIDPairMatch";
import { ObjectIdentifier } from "asn1-ts";
import { AttributeUsage, AttributeTypeDescription } from "@prisma/client";
import {
    AttributeUsage_userApplications,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import { booleanMatch } from "@wildboar/x500/src/lib/matching/equality/booleanMatch";
import { integerMatch } from "@wildboar/x500/src/lib/matching/equality/integerMatch";
import { bitStringMatch } from "@wildboar/x500/src/lib/matching/equality/bitStringMatch";
import { octetStringMatch } from "@wildboar/x500/src/lib/matching/equality/octetStringMatch";
import { objectIdentifierMatch } from "@wildboar/x500/src/lib/matching/equality/objectIdentifierMatch";
import { generalizedTimeMatch } from "@wildboar/x500/src/lib/matching/equality/generalizedTimeMatch";
import { uTCTimeMatch } from "@wildboar/x500/src/lib/matching/equality/uTCTimeMatch";
import { caseIgnoreIA5Match } from "@wildboar/x500/src/lib/matching/equality/caseIgnoreIA5Match";
import { numeringStringMatch } from "@wildboar/x500/src/lib/matching/equality/numericStringMatch"; // FIXME: Typo
import { telephoneNumberMatch } from "@wildboar/x500/src/lib/matching/equality/telephoneNumberMatch";
import { distinguishedNameMatch } from "@wildboar/x500/src/lib/matching/equality/distinguishedNameMatch";
import { integerOrderingMatch } from "@wildboar/x500/src/lib/matching/ordering/integerOrderingMatch";
import { octetStringOrderingMatch } from "@wildboar/x500/src/lib/matching/ordering/octetStringOrderingMatch";
import { generalizedTimeOrderingMatch } from "@wildboar/x500/src/lib/matching/ordering/generalizedTimeOrderingMatch";
import { uTCTimeOrderingMatch } from "@wildboar/x500/src/lib/matching/ordering/uTCTimeOrderingMatch";
import { caseIgnoreOrderingMatch } from "@wildboar/x500/src/lib/matching/ordering/caseIgnoreOrderingMatch";
import { numericStringOrderingMatch } from "@wildboar/x500/src/lib/matching/ordering/numericStringOrderingMatch";
import { octetStringSubstringsMatch } from "@wildboar/x500/src/lib/matching/substring/octetStringSubstringsMatch";
import { caseIgnoreIA5SubstringsMatch } from "@wildboar/x500/src/lib/matching/substring/caseIgnoreIA5SubstringsMatch";
import { caseIgnoreSubstringsMatch } from "@wildboar/x500/src/lib/matching/substring/caseIgnoreSubstringsMatch";
import { numericStringSubstringsMatch } from "@wildboar/x500/src/lib/matching/substring/numericStringSubstringsMatch";
import { telephoneNumberSubstringsMatch } from "@wildboar/x500/src/lib/matching/substring/telephoneNumberSubstringsMatch";

function attributeTypeFromDatabaseEntry (dbe: AttributeTypeDescription): AttributeInfo {
    return {
        id: ObjectIdentifier.fromString(dbe.identifier),
        parent: dbe.derivation
            ? ObjectIdentifier.fromString(dbe.derivation)
            : undefined,
        // namingMatcher?: EqualityMatcher;
        // equalityMatcher?: EqualityMatcher;
        // orderingMatcher?: OrderingMatcher;
        // substringsMatcher?: SubstringsMatcher;
        // approxMatcher?: EqualityMatcher;
        singleValued: !dbe.multiValued,
        collective: dbe.collective,
        dummy: dbe.dummy,
        noUserModification: !dbe.userModifiable,
        usage: AttributeUsage_userApplications,
        obsolete: dbe.obsolete,
        ldapSyntax: dbe.ldapSyntax
            ? ObjectIdentifier.fromString(dbe.ldapSyntax)
            : undefined,
        ldapNames: dbe.ldapNames
            ? dbe.ldapNames.split(" ")
            : undefined,
        ldapDescription: dbe.ldapDescription ?? undefined,
        compatibleMatchingRules: new Set(),
    };
}

export
async function loadAttributeTypes (ctx: Context): Promise<void> {
    Object.values(x500at)
        .map(attributeFromInformationObject)
        .forEach((attr) => {
            ctx.attributes.set(attr.id.toString(), attr);
            attr.ldapNames?.forEach((ldapName: string): void => {
                ctx.attributes.set(ldapName.trim(), attr);
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

    const storedTypes = await ctx.db.attributeTypeDescription.findMany();
    for (const storedType of storedTypes) {
        if (
            !storedType.attributeSyntax
            || !storedType.userModifiable
            || (storedType.application !== AttributeUsage.USER_APPLICATIONS)
        ) {
            continue;
        }
        switch (storedType.attributeSyntax.trim()) {
            case ("BOOLEAN"): {
                ctx.attributes.set(storedType.identifier, {
                    ...attributeTypeFromDatabaseEntry(storedType),
                    namingMatcher: booleanMatch,
                    equalityMatcher: booleanMatch,
                    orderingMatcher: undefined,
                    substringsMatcher: undefined,
                    approxMatcher: undefined,
                });
                break;
            }
            case ("INTEGER"): {
                ctx.attributes.set(storedType.identifier, {
                    ...attributeTypeFromDatabaseEntry(storedType),
                    namingMatcher: integerMatch,
                    equalityMatcher: integerMatch,
                    orderingMatcher: integerOrderingMatch,
                    substringsMatcher: undefined,
                    approxMatcher: undefined,
                });
                break;
            }
            case ("BIT STRING"): {
                ctx.attributes.set(storedType.identifier, {
                    ...attributeTypeFromDatabaseEntry(storedType),
                    namingMatcher: bitStringMatch,
                    equalityMatcher: bitStringMatch,
                    orderingMatcher: integerOrderingMatch,
                    substringsMatcher: undefined,
                    approxMatcher: undefined,
                });
                break;
            }
            case ("OCTET STRING"): {
                ctx.attributes.set(storedType.identifier, {
                    ...attributeTypeFromDatabaseEntry(storedType),
                    namingMatcher: octetStringMatch,
                    equalityMatcher: octetStringMatch,
                    orderingMatcher: octetStringOrderingMatch,
                    substringsMatcher: octetStringSubstringsMatch,
                    approxMatcher: undefined,
                });
                break;
            }
            case ("NULL"): {
                ctx.attributes.set(storedType.identifier, {
                    ...attributeTypeFromDatabaseEntry(storedType),
                    namingMatcher: undefined,
                    equalityMatcher: undefined,
                    orderingMatcher: undefined,
                    substringsMatcher: undefined,
                    approxMatcher: undefined,
                });
                break;
            }
            case ("OBJECT IDENTIFIER"): {
                ctx.attributes.set(storedType.identifier, {
                    ...attributeTypeFromDatabaseEntry(storedType),
                    namingMatcher: objectIdentifierMatch,
                    equalityMatcher: objectIdentifierMatch,
                    orderingMatcher: undefined,
                    substringsMatcher: undefined,
                    approxMatcher: undefined,
                });
                break;
            }
            case ("GeneralizedTime"): {
                ctx.attributes.set(storedType.identifier, {
                    ...attributeTypeFromDatabaseEntry(storedType),
                    namingMatcher: generalizedTimeMatch,
                    equalityMatcher: generalizedTimeMatch,
                    orderingMatcher: generalizedTimeOrderingMatch,
                    substringsMatcher: undefined,
                    approxMatcher: undefined,
                });
                break;
            }
            case ("UTCTime"): {
                ctx.attributes.set(storedType.identifier, {
                    ...attributeTypeFromDatabaseEntry(storedType),
                    namingMatcher: uTCTimeMatch,
                    equalityMatcher: uTCTimeMatch,
                    orderingMatcher: uTCTimeOrderingMatch,
                    substringsMatcher: undefined,
                    approxMatcher: undefined,
                });
                break;
            }
            case ("IA5String"): {
                ctx.attributes.set(storedType.identifier, {
                    ...attributeTypeFromDatabaseEntry(storedType),
                    namingMatcher: caseIgnoreIA5Match,
                    equalityMatcher: caseIgnoreIA5Match,
                    orderingMatcher: caseIgnoreOrderingMatch,
                    substringsMatcher: caseIgnoreIA5SubstringsMatch,
                    approxMatcher: undefined,
                });
                break;
            }
            case ("NumericString"): {
                ctx.attributes.set(storedType.identifier, {
                    ...attributeTypeFromDatabaseEntry(storedType),
                    namingMatcher: numeringStringMatch,
                    equalityMatcher: numeringStringMatch,
                    orderingMatcher: numericStringOrderingMatch,
                    substringsMatcher: numericStringSubstringsMatch,
                    approxMatcher: undefined,
                });
                break;
            }
            case ("PrintableString"): {
                ctx.attributes.set(storedType.identifier, {
                    ...attributeTypeFromDatabaseEntry(storedType),
                    namingMatcher: caseIgnoreMatch,
                    equalityMatcher: caseIgnoreMatch,
                    orderingMatcher: caseIgnoreOrderingMatch,
                    substringsMatcher: caseIgnoreSubstringsMatch,
                    approxMatcher: undefined,
                });
                break;
            }
            case ("TelephoneNumber"): {
                ctx.attributes.set(storedType.identifier, {
                    ...attributeTypeFromDatabaseEntry(storedType),
                    namingMatcher: telephoneNumberMatch,
                    equalityMatcher: telephoneNumberMatch,
                    orderingMatcher: undefined,
                    substringsMatcher: telephoneNumberSubstringsMatch,
                    approxMatcher: undefined,
                });
                break;
            }
            case ("DistinguishedName"): {
                ctx.attributes.set(storedType.identifier, {
                    ...attributeTypeFromDatabaseEntry(storedType),
                    namingMatcher: distinguishedNameMatch,
                    equalityMatcher: distinguishedNameMatch,
                    orderingMatcher: undefined,
                    substringsMatcher: undefined,
                    approxMatcher: undefined,
                });
                break;
            }
            case ("UnboundedDirectoryString"):
            case ("DirectoryString"): {
                ctx.attributes.set(storedType.identifier, {
                    ...attributeTypeFromDatabaseEntry(storedType),
                    namingMatcher: distinguishedNameMatch,
                    equalityMatcher: distinguishedNameMatch,
                    orderingMatcher: undefined,
                    substringsMatcher: undefined,
                    approxMatcher: undefined,
                });
                break;
            }
            default: {
                continue;
            }
        }
    }

    Array.from(ctx.attributes.values())
        .filter((attr) => attr.collective)
        .forEach((attr) => {
            ctx.collectiveAttributes.add(attr.id.toString());
        });
}

export default loadAttributeTypes;
