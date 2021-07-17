import type { Entry } from "../types";

export
function isLocalContextPrefix (entry: Entry): boolean {
    return Boolean(
        entry.dseType.cp
        && entry.dseType.entry
        && !entry.dseType.shadow
    );
}

export default isLocalContextPrefix;
