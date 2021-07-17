import type { Vertex } from "../types";

export
function isLocalContextPrefix (entry: Vertex): boolean {
    return Boolean(
        entry.dse.cp
        && entry.dse.entry
        && !entry.dse.shadow
    );
}

export default isLocalContextPrefix;
