import type { Context, Vertex } from "../types";
import {
    EntryInformation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation.ta";
import getDistinguishedName from "./getDistinguishedName";

// TODO: Just delete this.
export
function entryInformationFromEntry (ctx: Context, entry: Vertex): EntryInformation {
    return new EntryInformation(
        {
            rdnSequence: getDistinguishedName(entry),
        },
        Boolean(entry.dse.shadow),
        [], // FIXME: Blocked on readAttributes
        undefined,
        undefined,
        undefined,
        undefined,
    );
}

export default entryInformationFromEntry;
