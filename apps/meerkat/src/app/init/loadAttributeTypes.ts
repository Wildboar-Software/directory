import type { Context } from "@wildboar/meerkat-types";
import * as x500at from "@wildboar/x500/src/lib/collections/attributes";
import * as x500mr from "@wildboar/x500/src/lib/collections/matchingRules";
import attributeFromInformationObject from "./attributeFromInformationObject";
import { AttributeUsage } from "@prisma/client";
import entryUUID from "../schema/attributes/entryUUID";

export
async function loadAttributeTypes (ctx: Context): Promise<void> {
    Object.values(x500at)
        .map(attributeFromInformationObject)
        .forEach((attr) => {
            ctx.attributeTypes.set(attr.id.toString(), attr);
            attr.ldapNames?.forEach((ldapName: string): void => {
                ctx.attributeTypes.set(ldapName.trim(), attr);
                ctx.attributeTypes.set(ldapName.trim().toLowerCase(), attr);
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
    }

    Array.from(ctx.attributeTypes.values())
        .filter((attr) => attr.collective)
        .forEach((attr) => {
            ctx.collectiveAttributes.add(attr.id.toString());
        });

    ctx.attributeTypes.set(entryUUID.id.toString(), entryUUID);
    ctx.attributeTypes.set("entryUUID", entryUUID);

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
