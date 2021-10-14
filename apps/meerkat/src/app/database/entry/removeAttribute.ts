import type {
    Context,
    Vertex,
    IndexableOID,
    SpecialAttributeDatabaseRemover,
    PendingUpdates,
} from "@wildboar/meerkat-types";
import type { PrismaPromise } from "@prisma/client";
import type { DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import type { AttributeType } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";

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

// Attribute Removers
import * as removers from "../specialAttributeRemovers";
import rdnToJson from "../../x500/rdnToJson";

const specialAttributeDatabaseRemovers: Map<IndexableOID, SpecialAttributeDatabaseRemover> = new Map([
    [ objectClass["&id"]!.toString(), removers.removeObjectClass ],
    [ administrativeRole["&id"]!.toString(), removers.removeAdministrativeRole ],
    [ subtreeSpecification["&id"]!.toString(), removers.removeSubtreeSpecification ],
    [ accessControlScheme["&id"]!.toString(), removers.removeAccessControlScheme ],
    // [ id_aca_entryACI.toString(), writeEntryACI ],
    // [ id_aca_prescriptiveACI.toString(), writePrescriptiveACI ],
    // [ id_aca_subentryACI.toString(), writeSubentryACI ],

    // [ pwdStartTime["&id"]!.toString(), removers.removePwdStartTime ],
    [ pwdExpiryTime["&id"]!.toString(), removers.removePwdExpiryTime ],
    [ pwdEndTime["&id"]!.toString(), removers.removePwdEndTime ],
    // [ pwdFails["&id"]!.toString(), removers.removePwdFails ],
    // [ pwdFailureTime["&id"]!.toString(), removers.removePwdFailureTime ],
    // [ pwdGracesUsed["&id"]!.toString(), removers.removePwdGracesUsed ],
    // [ userPwdHistory["&id"]!.toString(), removers.removeUserPwdHistory ],
    // [ userPwdRecentlyExpired["&id"]!.toString(), removers.removeUserPwdRecentlyExpired ],
    [ pwdModifyEntryAllowed["&id"]!.toString(), removers.removePwdModifyEntryAllowed ],
    [ pwdChangeAllowed["&id"]!.toString(), removers.removePwdChangeAllowed ],
    [ pwdMaxAge["&id"]!.toString(), removers.removePwdMaxAge ],
    [ pwdExpiryAge["&id"]!.toString(), removers.removePwdExpiryAge ],
    [ pwdMinLength["&id"]!.toString(), removers.removePwdMinLength ],
    // [ pwdVocabulary["&id"]!.toString(), removers.removePwdVocabulary ],
    // [ pwdAlphabet["&id"]!.toString(), removers.removePwdAlphabet ],
    [ pwdDictionaries["&id"]!.toString(), removers.removePwdDictionaries ],
    [ pwdExpiryWarning["&id"]!.toString(), removers.removePwdExpiryWarning ],
    [ pwdGraces["&id"]!.toString(), removers.removePwdGraces ],
    [ pwdFailureDuration["&id"]!.toString(), removers.removePwdFailureDuration ],
    [ pwdLockoutDuration["&id"]!.toString(), removers.removePwdLockoutDuration ],
    [ pwdMaxFailures["&id"]!.toString(), removers.removePwdMaxFailures ],
    [ pwdMaxTimeInHistory["&id"]!.toString(), removers.removePwdMaxTimeInHistory ],
    [ pwdMinTimeInHistory["&id"]!.toString(), removers.removePwdMinTimeInHistory ],
    [ pwdHistorySlots["&id"]!.toString(), removers.removePwdHistorySlots ],
    [ pwdRecentlyExpiredDuration["&id"]!.toString(), removers.removePwdRecentlyExpiredDuration ],
    // [ pwdEncAlg["&id"]!.toString(), removers.removePwdEncAlg ],

    [ userPwd["&id"]!.toString(), removers.removeUserPwd ],
    [ userPassword["&id"]!.toString(), removers.removeUserPassword ],

    [ uniqueIdentifier["&id"].toString(), removers.removeUniqueIdentifier ], // Has significance for BAC

    [ dITStructureRules["&id"].toString(), removers.removeDITStructureRules ],
    [ nameForms["&id"].toString(), removers.removeNameForms ],
    [ dITContentRules["&id"].toString(), removers.removeDITContentRules ],
    [ objectClasses["&id"].toString(), removers.removeObjectClasses ],
    [ attributeTypes["&id"].toString(), removers.removeAttributeTypes ],
    [ friends["&id"].toString(), removers.removeFriends ],
    [ contextTypes["&id"].toString(), removers.removeContextTypes ],
    [ dITContextUse["&id"].toString(), removers.removeDITContextUse ],
    [ matchingRules["&id"].toString(), removers.removeMatchingRules ],
    [ matchingRuleUse["&id"].toString(), removers.removeMatchingRuleUse ],
    [ ldapSyntaxes["&id"].toString(), removers.removeLdapSyntaxes ],

    [ governingStructureRule["&id"].toString(), removers.removeGoverningStructureRule ],
    [ structuralObjectClass["&id"].toString(), removers.removeStructuralObjectClass ],

    [ namingContexts["&id"].toString(), removers.removeNamingContexts ],
    [ altServer["&id"].toString(), removers.removeAltServer ],
    [ supportedExtension["&id"].toString(), removers.removeSupportedExtension ],
    [ supportedControl["&id"].toString(), removers.removeSupportedControl ],
    [ supportedSASLMechanisms["&id"].toString(), removers.removeSupportedSASLMechanisms ],
    [ supportedLDAPVersion["&id"].toString(), removers.removeSupportedLDAPVersion ],
    [ supportedFeatures["&id"].toString(), removers.removeSupportedFeatures ],
]);

export
async function removeAttribute (
    ctx: Context,
    entry: Vertex,
    type_: AttributeType,
    modifier: DistinguishedName,
): Promise<PrismaPromise<any>[]> {
    const pendingUpdates: PendingUpdates = {
        entryUpdate: {
            modifyTimestamp: new Date(),
            modifiersName: modifier.map(rdnToJson),
        },
        otherWrites: [],
    };
    const remover = specialAttributeDatabaseRemovers.get(type_.toString());
    if (remover) {
        await remover(ctx, entry, pendingUpdates);
        return [
            ctx.db.entry.update({
                where: {
                    id: entry.dse.id,
                },
                data: pendingUpdates.entryUpdate,
            }),
            ...pendingUpdates.otherWrites,
        ];
    } else {
        return [
            ctx.db.entry.update({
                where: {
                    id: entry.dse.id,
                },
                data: pendingUpdates.entryUpdate,
            }),
            ctx.db.attributeValue.deleteMany({
                where: {
                    entry_id: entry.dse.id,
                    type: type_.toString(),
                },
            }),
        ]
    }
}

export default removeAttribute;
