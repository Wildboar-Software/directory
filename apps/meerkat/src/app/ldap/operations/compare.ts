import type { Context } from "../../types";
import type {
    CompareRequest,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/CompareRequest.ta";
import type {
    CompareResponse,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/CompareResponse.ta";
import {
    LDAPResult,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult.ta";
import {
    LDAPResult_resultCode_compareFalse,
    LDAPResult_resultCode_compareTrue,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult-resultCode.ta";
import decodeLDAPDN from "../decodeLDAPDN";
import findEntry from "../../x500/findEntry";

export
async function compare (
    ctx: Context,
    req: CompareRequest,
): Promise<CompareResponse> {
    const dn = decodeLDAPDN(ctx, req.entry);
    const entry = findEntry(ctx, ctx.database.data.dit, dn, true);
    if (!entry) {
        throw new Error(); // FIXME:
    }

    const match = true;
    return new LDAPResult(
        match
            ? LDAPResult_resultCode_compareTrue
            : LDAPResult_resultCode_compareFalse,
        req.entry,
        match
            ? Buffer.from("Match", "utf-8")
            : Buffer.from("Non-Match", "utf-8"),
        undefined,
    );
}

export default compare;
