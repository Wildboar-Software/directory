import { TRUE } from "@wildboar/asn1";
import {
    EntryInformationSelection,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    FamilyReturn,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    FamilyReturn_memberSelect_compoundEntry,
} from "@wildboar/x500/DirectoryAbstractService";

export
const selectAll = new EntryInformationSelection(
    {
        allUserAttributes: null,
    },
    undefined,
    {
        allOperationalAttributes: null,
    },
    {
        allContexts: null,
    },
    TRUE,
    new FamilyReturn(
        FamilyReturn_memberSelect_compoundEntry,
    ),
);

export default selectAll;
