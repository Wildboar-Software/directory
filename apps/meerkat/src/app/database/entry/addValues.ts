import type {
    Context,
    Vertex,
    IndexableOID,
    Value,
    SpecialAttributeDatabaseEditor,
    PendingUpdates,
} from "../../types";
import { ASN1Construction } from "asn1-ts";
import type { PrismaPromise, Prisma } from "@prisma/client";
import type { DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import calculateSortKey from "../calculateSortKey";

// Special Attributes
import { objectClass } from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
import { administrativeRole } from "@wildboar/x500/src/lib/modules/InformationFramework/administrativeRole.oa";
import { subtreeSpecification } from "@wildboar/x500/src/lib/modules/InformationFramework/subtreeSpecification.oa";
import { accessControlScheme } from "@wildboar/x500/src/lib/modules/BasicAccessControl/accessControlScheme.oa";
import { pwdStartTime } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdStartTime.oa";
import { pwdExpiryTime } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdExpiryTime.oa";
import { pwdEndTime } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdEndTime.oa";
import { pwdFails } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdFails.oa";
import { pwdFailureTime } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdFailureTime.oa";
import { pwdGracesUsed } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdGracesUsed.oa";
import { userPwdHistory } from "@wildboar/x500/src/lib/modules/PasswordPolicy/userPwdHistory.oa";
import { userPwdRecentlyExpired } from "@wildboar/x500/src/lib/modules/PasswordPolicy/userPwdRecentlyExpired.oa";
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
import { userPwd } from "@wildboar/x500/src/lib/modules/PasswordPolicy/userPwd.oa";
import { userPassword } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/userPassword.oa";
import { uniqueIdentifier } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uniqueIdentifier.oa";
import { dITStructureRules } from "@wildboar/x500/src/lib/modules/SchemaAdministration/dITStructureRules.oa";
import { nameForms } from "@wildboar/x500/src/lib/modules/SchemaAdministration/nameForms.oa";
import { dITContentRules } from "@wildboar/x500/src/lib/modules/SchemaAdministration/dITContentRules.oa";
import { objectClasses } from "@wildboar/x500/src/lib/modules/SchemaAdministration/objectClasses.oa";
import { attributeTypes } from "@wildboar/x500/src/lib/modules/SchemaAdministration/attributeTypes.oa";
import { friends } from "@wildboar/x500/src/lib/modules/SchemaAdministration/friends.oa";
import { contextTypes } from "@wildboar/x500/src/lib/modules/SchemaAdministration/contextTypes.oa";
import { dITContextUse } from "@wildboar/x500/src/lib/modules/SchemaAdministration/dITContextUse.oa";
import { matchingRules } from "@wildboar/x500/src/lib/modules/SchemaAdministration/matchingRules.oa";
import { matchingRuleUse } from "@wildboar/x500/src/lib/modules/SchemaAdministration/matchingRuleUse.oa";
import { ldapSyntaxes } from "@wildboar/x500/src/lib/modules/LdapSystemSchema/ldapSyntaxes.oa";
import { governingStructureRule } from "@wildboar/x500/src/lib/modules/SchemaAdministration/governingStructureRule.oa";
import { structuralObjectClass } from "@wildboar/x500/src/lib/modules/SchemaAdministration/structuralObjectClass.oa";
import { namingContexts } from "@wildboar/x500/src/lib/modules/LdapSystemSchema/namingContexts.oa";
import { altServer } from "@wildboar/x500/src/lib/modules/LdapSystemSchema/altServer.oa";
import { supportedExtension } from "@wildboar/x500/src/lib/modules/LdapSystemSchema/supportedExtension.oa";
import { supportedControl } from "@wildboar/x500/src/lib/modules/LdapSystemSchema/supportedControl.oa";
import { supportedSASLMechanisms } from "@wildboar/x500/src/lib/modules/LdapSystemSchema/supportedSASLMechanisms.oa";
import { supportedLDAPVersion } from "@wildboar/x500/src/lib/modules/LdapSystemSchema/supportedLDAPVersion.oa";
import { supportedFeatures } from "@wildboar/x500/src/lib/modules/LdapSystemSchema/supportedFeatures.oa";

// Attribute Adders
import * as adders from "../specialAttributeAdders";
import rdnToJson from "../../x500/rdnToJson";

const specialAttributeDatabaseWriters: Map<IndexableOID, SpecialAttributeDatabaseEditor> = new Map([
    [ objectClass["&id"]!.toString(), adders.addObjectClass ],
    [ administrativeRole["&id"]!.toString(), adders.addAdministrativeRole ],
    [ subtreeSpecification["&id"]!.toString(), adders.addSubtreeSpecification ],
    [ accessControlScheme["&id"]!.toString(), adders.addAccessControlScheme ],
    // [ id_aca_entryACI.toString(), writeEntryACI ],
    // [ id_aca_prescriptiveACI.toString(), writePrescriptiveACI ],
    // [ id_aca_subentryACI.toString(), writeSubentryACI ],
    // [ pwdStartTime["&id"]!.toString(), adders.addPwdStartTime ],
    [ pwdExpiryTime["&id"]!.toString(), adders.addPwdExpiryTime ],
    [ pwdEndTime["&id"]!.toString(), adders.addPwdEndTime ],
    // [ pwdFails["&id"]!.toString(), adders.addPwdFails ],
    // [ pwdFailureTime["&id"]!.toString(), adders.addPwdFailureTime ],
    // [ pwdGracesUsed["&id"]!.toString(), adders.addPwdGracesUsed ],
    // [ userPwdHistory["&id"]!.toString(), adders.addUserPwdHistory ],
    // [ userPwdRecentlyExpired["&id"]!.toString(), adders.addUserPwdRecentlyExpired ],
    [ pwdModifyEntryAllowed["&id"]!.toString(), adders.addPwdModifyEntryAllowed ],
    [ pwdChangeAllowed["&id"]!.toString(), adders.addPwdChangeAllowed ],
    [ pwdMaxAge["&id"]!.toString(), adders.addPwdMaxAge ],
    [ pwdExpiryAge["&id"]!.toString(), adders.addPwdExpiryAge ],
    [ pwdMinLength["&id"]!.toString(), adders.addPwdMinLength ],
    // [ pwdVocabulary["&id"]!.toString(), adders.addPwdVocabulary ],
    // [ pwdAlphabet["&id"]!.toString(), adders.addPwdAlphabet ],
    [ pwdDictionaries["&id"]!.toString(), adders.addPwdDictionaries ],
    [ pwdExpiryWarning["&id"]!.toString(), adders.addPwdExpiryWarning ],
    [ pwdGraces["&id"]!.toString(), adders.addPwdGraces ],
    [ pwdFailureDuration["&id"]!.toString(), adders.addPwdFailureDuration ],
    [ pwdLockoutDuration["&id"]!.toString(), adders.addPwdLockoutDuration ],
    [ pwdMaxFailures["&id"]!.toString(), adders.addPwdMaxFailures ],
    [ pwdMaxTimeInHistory["&id"]!.toString(), adders.addPwdMaxTimeInHistory ],
    [ pwdMinTimeInHistory["&id"]!.toString(), adders.addPwdMinTimeInHistory ],
    [ pwdHistorySlots["&id"]!.toString(), adders.addPwdHistorySlots ],
    [ pwdRecentlyExpiredDuration["&id"]!.toString(), adders.addPwdRecentlyExpiredDuration ],
    // [ pwdEncAlg["&id"]!.toString(), adders.addPwdEncAlg ],

    // NOTE: These may be removed. Passwords should be administered through the
    // administerPassword and changePassword operations.
    [ userPwd["&id"]!.toString(), adders.addUserPwd ],
    [ userPassword["&id"]!.toString(), adders.addUserPassword ],

    [ uniqueIdentifier["&id"].toString(), adders.addUniqueIdentifier ], // Has significance for Basic Access Control

    [ dITStructureRules["&id"].toString(), adders.addDITStructureRules ],
    [ nameForms["&id"].toString(), adders.addNameForms ],
    [ dITContentRules["&id"].toString(), adders.addDITContentRules ],
    [ objectClasses["&id"].toString(), adders.addObjectClasses ],
    [ attributeTypes["&id"].toString(), adders.addAttributeTypes ],
    [ friends["&id"].toString(), adders.addFriends ],
    [ contextTypes["&id"].toString(), adders.addContextTypes ],
    [ dITContextUse["&id"].toString(), adders.addDITContextUse ],
    [ matchingRules["&id"].toString(), adders.addMatchingRules ],
    [ matchingRuleUse["&id"].toString(), adders.addMatchingRuleUse ],
    [ ldapSyntaxes["&id"].toString(), adders.addLdapSyntaxes ],

    [ governingStructureRule["&id"].toString(), adders.addGoverningStructureRule ],
    [ structuralObjectClass["&id"].toString(), adders.addStructuralObjectClass ],

    [ namingContexts["&id"].toString(), adders.addNamingContexts ],
    [ altServer["&id"].toString(), adders.addAltServer ],
    [ supportedExtension["&id"].toString(), adders.addSupportedExtension ],
    [ supportedControl["&id"].toString(), adders.addSupportedControl ],
    [ supportedSASLMechanisms["&id"].toString(), adders.addSupportedSASLMechanisms ],
    [ supportedLDAPVersion["&id"].toString(), adders.addSupportedLDAPVersion ],
    [ supportedFeatures["&id"].toString(), adders.addSupportedFeatures ],
]);

export
async function addValues (
    ctx: Context,
    entry: Vertex,
    attributes: Value[],
    modifier: DistinguishedName,
): Promise<PrismaPromise<any>[]> {
    const pendingUpdates: PendingUpdates = {
        entryUpdate: {
            modifyTimestamp: new Date(),
            modifiersName: modifier.map(rdnToJson),
        },
        otherWrites: [],
    };
    await Promise.all(
        attributes
            .map((attr) => specialAttributeDatabaseWriters
                .get(attr.id.toString())?.(ctx, entry, attr, pendingUpdates)),
    );
    return [
        ctx.db.entry.update({
            where: {
                id: entry.dse.id,
            },
            data: pendingUpdates.entryUpdate,
        }),
        ...pendingUpdates.otherWrites,
        ...attributes
            .filter((attr) => !specialAttributeDatabaseWriters.has(attr.id.toString()))
            .map((attr) => ctx.db.attributeValue.create({
                data: {
                    entry_id: entry.dse.id,
                    type: attr.id.toString(),
                    tag_class: attr.value.tagClass,
                    constructed: (attr.value.construction === ASN1Construction.constructed),
                    tag_number: attr.value.tagNumber,
                    ber: Buffer.from(attr.value.toBytes()),
                    sort_key: calculateSortKey(attr.value),
                    jer: attr.value.toJSON() as Prisma.InputJsonValue,
                    ContextValue: {
                        createMany: {
                            data: Array.from(attr.contexts.values())
                                .flatMap((context) => context.values.map((cv) => ({
                                    entry_id: entry.dse.id,
                                    type: context.id.toString(),
                                    tag_class: cv.tagClass,
                                    constructed: (cv.construction === ASN1Construction.constructed),
                                    tag_number: cv.tagNumber,
                                    ber: Buffer.from(cv.toBytes()),
                                    fallback: context.fallback,
                                }))),
                        },
                    },
                },
            })),
    ];
}

export default addValues;

