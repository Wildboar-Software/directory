import { TRUE } from "asn1-ts";
import {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import {
    FamilyReturn,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FamilyReturn.ta";
import {
    FamilyReturn_memberSelect_compoundEntry,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FamilyReturn-memberSelect.ta";

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
