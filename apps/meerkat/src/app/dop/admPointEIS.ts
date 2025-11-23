import {
    EntryInformationSelection,
} from "@wildboar/x500/DirectoryAbstractService";
import { administrativeRole } from "@wildboar/x500/InformationFramework";
import { accessControlScheme } from "@wildboar/x500/BasicAccessControl";
import { entryACI } from "@wildboar/x500/BasicAccessControl";
import { subentryACI } from "@wildboar/x500/BasicAccessControl";
import { aliasedEntryName } from "@wildboar/x500/InformationFramework";
import { clearance } from "@wildboar/x500/EnhancedSecurity";

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
