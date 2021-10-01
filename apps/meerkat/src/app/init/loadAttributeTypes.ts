import type { Context, AttributeInfo } from "../types";
import * as x500at from "@wildboar/x500/src/lib/collections/attributes";
import * as x500mr from "@wildboar/x500/src/lib/collections/matchingRules";
import attributeFromInformationObject from "./attributeFromInformationObject";
import { ObjectIdentifier } from "asn1-ts";
import { AttributeUsage, AttributeTypeDescription } from "@prisma/client";
import {
    AttributeUsage_userApplications,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";

function attributeTypeFromDatabaseEntry (dbe: AttributeTypeDescription): AttributeInfo {
    return {
        id: ObjectIdentifier.fromString(dbe.identifier),
        parent: dbe.derivation
            ? ObjectIdentifier.fromString(dbe.derivation)
            : undefined,
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
                });
                break;
            }
            case ("INTEGER"): {
                ctx.attributes.set(storedType.identifier, {
                    ...attributeTypeFromDatabaseEntry(storedType),
                });
                break;
            }
            case ("BIT STRING"): {
                ctx.attributes.set(storedType.identifier, {
                    ...attributeTypeFromDatabaseEntry(storedType),
                });
                break;
            }
            case ("OCTET STRING"): {
                ctx.attributes.set(storedType.identifier, {
                    ...attributeTypeFromDatabaseEntry(storedType),
                });
                break;
            }
            case ("NULL"): {
                ctx.attributes.set(storedType.identifier, {
                    ...attributeTypeFromDatabaseEntry(storedType),
                });
                break;
            }
            case ("OBJECT IDENTIFIER"): {
                ctx.attributes.set(storedType.identifier, {
                    ...attributeTypeFromDatabaseEntry(storedType),
                });
                break;
            }
            case ("GeneralizedTime"): {
                ctx.attributes.set(storedType.identifier, {
                    ...attributeTypeFromDatabaseEntry(storedType),
                });
                break;
            }
            case ("UTCTime"): {
                ctx.attributes.set(storedType.identifier, {
                    ...attributeTypeFromDatabaseEntry(storedType),
                });
                break;
            }
            case ("IA5String"): {
                ctx.attributes.set(storedType.identifier, {
                    ...attributeTypeFromDatabaseEntry(storedType),
                });
                break;
            }
            case ("NumericString"): {
                ctx.attributes.set(storedType.identifier, {
                    ...attributeTypeFromDatabaseEntry(storedType),
                });
                break;
            }
            case ("PrintableString"): {
                ctx.attributes.set(storedType.identifier, {
                    ...attributeTypeFromDatabaseEntry(storedType),
                });
                break;
            }
            case ("TelephoneNumber"): {
                ctx.attributes.set(storedType.identifier, {
                    ...attributeTypeFromDatabaseEntry(storedType),
                });
                break;
            }
            case ("DistinguishedName"): {
                ctx.attributes.set(storedType.identifier, {
                    ...attributeTypeFromDatabaseEntry(storedType),
                });
                break;
            }
            case ("UnboundedDirectoryString"):
            case ("DirectoryString"): {
                ctx.attributes.set(storedType.identifier, {
                    ...attributeTypeFromDatabaseEntry(storedType),
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

    Object.entries(x500at).forEach(([ name, attr ]) => {
        ctx.nameToObjectIdentifier.set(name, attr["&id"]);
        attr["&ldapName"]?.map((ldapName) => {
            ctx.nameToObjectIdentifier.set(ldapName, attr["&id"]);
        });
        ctx.objectIdentifierToName.set(attr["&id"].toString(), name);
    });

    ctx.matchingRulesSuitableForNaming.add(x500mr.bitStringMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.booleanMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.caseExactIA5Match["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.caseExactMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.caseIgnoreIA5Match["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.caseIgnoreMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.dnsNameMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.generalizedTimeMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.integerMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.intEmailMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.jidMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.numericStringMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.octetStringMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.presentationAddressMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.telephoneNumberMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.uniqueMemberMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.uriMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.uTCTimeMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.uUIDPairMatch["&id"].toString());
}

export default loadAttributeTypes;
