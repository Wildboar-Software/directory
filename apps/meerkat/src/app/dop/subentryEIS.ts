import {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import { commonName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
import { subtreeSpecification } from "@wildboar/x500/src/lib/modules/InformationFramework/subtreeSpecification.oa";
import { prescriptiveACI } from "@wildboar/x500/src/lib/modules/BasicAccessControl/prescriptiveACI.oa";
import { entryACI } from "@wildboar/x500/src/lib/modules/BasicAccessControl/entryACI.oa";
import { contextAssertionDefaults } from "@wildboar/x500/src/lib/modules/InformationFramework/contextAssertionDefaults.oa";
import { searchRules } from "@wildboar/x500/src/lib/modules/InformationFramework/searchRules.oa";
import { pwdAttribute } from "@wildboar/x500/src/lib/modules/InformationFramework/pwdAttribute.oa";
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
import { aliasedEntryName } from "@wildboar/x500/src/lib/modules/InformationFramework/aliasedEntryName.oa";

/**
 * @summary Selects attributes of a subentry that are to be shared in a hierarchical operational binding
 * @description
 *
 * This selection selects attributes of a subentry that are to be
 * shared between DSAs that are mutually part of a hierarchical operational
 * binding.
 *
 * @constant
 */
export
const subentryEIS = new EntryInformationSelection(
    {
        select: [
            commonName["&id"],
            aliasedEntryName["&id"],
        ],
    },
    undefined,
    {
        select: [
            entryACI["&id"],
            prescriptiveACI["&id"],
            subtreeSpecification["&id"],
            contextAssertionDefaults["&id"],
            searchRules["&id"],
            pwdAttribute["&id"],
            pwdModifyEntryAllowed["&id"],
            pwdChangeAllowed["&id"],
            pwdMaxAge["&id"],
            pwdExpiryAge["&id"],
            pwdMinLength["&id"],
            pwdVocabulary["&id"],
            pwdAlphabet["&id"],
            pwdDictionaries["&id"],
            pwdExpiryWarning["&id"],
            pwdGraces["&id"],
            pwdFailureDuration["&id"],
            pwdLockoutDuration["&id"],
            pwdMaxFailures["&id"],
            pwdMaxTimeInHistory["&id"],
            pwdMinTimeInHistory["&id"],
            pwdHistorySlots["&id"],
            pwdRecentlyExpiredDuration["&id"],
            pwdEncAlg["&id"],
        ],
    },
    undefined,
    undefined,
    undefined,
);

export default subentryEIS;
