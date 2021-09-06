import type { Context, Vertex } from "../types";
import type {
    Credentials,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/Credentials.ta";
import findEntry from "../x500/findEntry";
import * as crypto from "crypto";
import sleep from "../utils/sleep";
import readEntryPassword from "../database/readEntryPassword";
import type {
    AuthenticationLevel,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel.ta";
import {
    AuthenticationLevel_basicLevels,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels.ta";
import {
    AuthenticationLevel_basicLevels_level_none,
    AuthenticationLevel_basicLevels_level_simple,
    // AuthenticationLevel_basicLevels_level_strong,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels-level.ta";
// import attemptPassword from "../x500/attemptPassword";
import attemptPassword from "../authn/attemptPassword";

/**
 * @summary X.500 Directory Access Protocol (DAP) bind operation
 * @description
 *
 * ## Technical Details
 *
 * This function waits a random amount of time to prevent timing attacks.
 *
 * Anonymous authentication shall always succeed, even if bound entry does not
 * actually exist. This is so anonymous authentication cannot be used to
 * enumerate directory entries.
 *
 * @param ctx
 * @param creds
 * @returns `null` if the authentication failed.
 */
export
async function bind (
    ctx: Context,
    creds: Credentials,
): Promise<[ Vertex | undefined, AuthenticationLevel ] | null> {
    // Wait a random amount of time to prevent timing attacks.
    sleep(crypto.randomInt(3000) + 1000);
    if ("simple" in creds) {
        const foundEntry = await findEntry(ctx, ctx.dit.root, creds.simple.name);
        if (!creds.simple.password) {
            return [
                foundEntry,
                {
                    basicLevels: new AuthenticationLevel_basicLevels(
                        AuthenticationLevel_basicLevels_level_none,
                        0, // TODO:
                        false, // TODO:
                    ),
                },
            ];
        }
        if (!foundEntry) {
            return null;
        }
        const pwd = await readEntryPassword(ctx, foundEntry);
        if (!pwd) {
            return null;
        }
        if (creds.simple.validity) {
            const now = new Date();
            const minimumTime = creds.simple.validity.time1
                ? ("utc" in creds.simple.validity.time1)
                    ? creds.simple.validity.time1.utc
                    : creds.simple.validity.time1.gt
                : undefined;
            const maximumTime = creds.simple.validity.time2
                ? ("utc" in creds.simple.validity.time2)
                    ? creds.simple.validity.time2.utc
                    : creds.simple.validity.time2.gt
                : undefined;
            if (minimumTime && (minimumTime.valueOf() > (now.valueOf() + 5000))) { // 5 seconds of tolerance.
                return null;
            }
            if (maximumTime && (maximumTime.valueOf() < (now.valueOf() - 5000))) { // 5 seconds of tolerance.
                return null;
            }
        }
        // NOTE: Validity has no well-established meaning.
        const passwordIsCorrect: boolean | undefined = await attemptPassword(ctx, foundEntry, creds.simple.password);
        if (passwordIsCorrect) {
            return [
                foundEntry,
                {
                    basicLevels: new AuthenticationLevel_basicLevels(
                        AuthenticationLevel_basicLevels_level_simple,
                        0, // TODO:
                        false, // TODO:
                    ),
                },
            ];
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export default bind;
