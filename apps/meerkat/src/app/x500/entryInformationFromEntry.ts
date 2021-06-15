import type { Context, Entry } from "../types";
import {
    EntryInformation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation.ta";
import getDistinguishedName from "./getDistinguishedName";

export
function entryInformationFromEntry (ctx: Context, entry: Entry): EntryInformation {
    return new EntryInformation(
        {
            rdnSequence: getDistinguishedName(entry),
        },
        entry.dseType.shadow,
        [], // FIXME: Blocked on readAttributes
        undefined,
        undefined,
        undefined,
        undefined,
    );
}

export default entryInformationFromEntry;
