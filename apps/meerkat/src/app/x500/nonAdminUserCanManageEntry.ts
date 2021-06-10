import type { DSEType } from "../types";

export
function nonAdminUserCanManageEntry (dseType: Partial<DSEType>): boolean {
    return Boolean(
        !dseType.root
        && !dseType.glue
        && !dseType.cp
        && dseType.entry
        && !dseType.alias
        && !dseType.subr
        && !dseType.nssr
        && !dseType.supr
        && !dseType.xr
        && !dseType.admPoint
        && !dseType.subentry // REVIEW:
        && !dseType.shadow
        && !dseType.immSupr
        && !dseType.rhob
        && !dseType.sa
        && !dseType.dsSubentry // REVIEW:
        && !dseType.familyMember // REVIEW:
        && !dseType.ditBridge
    );
}

export default nonAdminUserCanManageEntry;
