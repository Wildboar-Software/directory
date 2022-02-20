import {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import { administrativeRole } from "@wildboar/x500/src/lib/modules/InformationFramework/administrativeRole.oa";
import { accessControlScheme } from "@wildboar/x500/src/lib/modules/BasicAccessControl/accessControlScheme.oa";
import { entryACI } from "@wildboar/x500/src/lib/modules/BasicAccessControl/entryACI.oa";
import { subentryACI } from "@wildboar/x500/src/lib/modules/BasicAccessControl/subentryACI.oa";
import { aliasedEntryName } from "@wildboar/x500/src/lib/modules/InformationFramework/aliasedEntryName.oa";
import { clearance } from "@wildboar/x500/src/lib/modules/EnhancedSecurity/clearance.oa";

/**
 * @summary Selects attributes of an administrative point that are to be shared in a hierarchical operational binding
 * @description
 *
 * This selection selects attributes of an administrative point that are to be
 * shared between DSAs that are mutually part of a hierarchical operational
 * binding.
 *
 * @constant
 */
export
const admPointEIS = new EntryInformationSelection(
    {
        select: [
            aliasedEntryName["&id"],
            clearance["&id"], // A userApplications attribute, for some stupid reason.
        ],
    },
    undefined,
    {
        select: [
            administrativeRole["&id"],
            accessControlScheme["&id"],
            subentryACI["&id"],
            entryACI["&id"],
        ],
    },
    undefined,
    undefined,
    undefined,
);

export default admPointEIS;
