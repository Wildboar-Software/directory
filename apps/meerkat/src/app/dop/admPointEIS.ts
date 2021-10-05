import {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import { administrativeRole } from "@wildboar/x500/src/lib/modules/InformationFramework/administrativeRole.oa";
import { accessControlScheme } from "@wildboar/x500/src/lib/modules/BasicAccessControl/accessControlScheme.oa";
import { entryACI } from "@wildboar/x500/src/lib/modules/BasicAccessControl/entryACI.oa";
import { subentryACI } from "@wildboar/x500/src/lib/modules/BasicAccessControl/subentryACI.oa";
import { aliasedEntryName } from "@wildboar/x500/src/lib/modules/InformationFramework/aliasedEntryName.oa";

export
const admPointEIS = new EntryInformationSelection(
    {
        select: [
            aliasedEntryName["&id"],
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
