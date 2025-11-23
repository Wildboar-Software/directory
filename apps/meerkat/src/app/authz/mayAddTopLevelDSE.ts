import type { Context, ClientAssociation } from "@wildboar/meerkat-types";
import {
    AuthenticationLevel_basicLevels_level_none,
} from "@wildboar/x500/BasicAccessControl";
import anyPasswordsExist from "./anyPasswordsExist.js";

/**
 * @summary Whether a bound client may add a top-level DSE.
 * @description
 *
 * Resolves a `boolean` indicating whether the bound client may add a top-level
 * DSE.
 *
 * @param ctx The context object
 * @param assn The client association
 * @returns A `boolean` indicating whether the bound client may add a top-level DSE.
 *
 * @function
 * @async
 */
export
async function mayAddTopLevelDSE (
    ctx: Context,
    assn: ClientAssociation,
): Promise<boolean> {
    if (ctx.config.openTopLevel) {
        return true;
    }
    if (!(await anyPasswordsExist(ctx))) {
        return true;
    }
    if ( // No top-level DSEs may be added without authentication.
        !assn.boundEntry?.dse
        || !assn.authLevel
        || !("basicLevels" in assn.authLevel)
        || (assn.authLevel.basicLevels.level === AuthenticationLevel_basicLevels_level_none)
    ) {
        return false;
    }
    const boundDSE = await ctx.db.entry.findUnique({
        where: {
            id: assn.boundEntry.dse.id,
        },
        select: {
            may_add_top_level_dse: true,
        },
    });
    return !!boundDSE?.may_add_top_level_dse;
}

export default mayAddTopLevelDSE;
