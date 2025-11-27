

import type { Context, Vertex } from "../types/index.js";
import type { UserPwd } from "@wildboar/x500/PasswordPolicy";
import { UserPwd_encrypted } from "@wildboar/x500/PasswordPolicy";
import { AlgorithmIdentifier } from "@wildboar/pki-stub";
import { DERElement, ObjectIdentifier } from "@wildboar/asn1";

/**
 * @summary Read the password of an entry from the database
 * @description
 *
 * This function reads the password for an entry from the database into memory.
 * Note that passwords in Meerkat DSA (at least when using the `userPassword` or
 * `userPwd` attribute, as intended) will be salted and hashed in the database.
 * Reading them into memory cannot reverse this; they will be salted and hashed
 * in memory. This function is still useful, because this in-memory object
 * representing the hashed password can be compared for equality to another
 * hashed and salted password generated from a password submitted during
 * authentication.
 *
 * @param ctx The context object
 * @param entry The vertex whose password is to be read
 * @returns The password as a `UserPwd` if one is defined, or `null` otherwise.
 *
 * @function
 * @async
 */
export
async function readEntryPassword (
    ctx: Context,
    entry: Vertex,
): Promise<UserPwd | null> {
    const password = await ctx.db.password.findFirst({
        where: {
            entry_id: entry.dse.id,
        },
    });
    if (!password) {
        return null;
    }
    return {
        encrypted: new UserPwd_encrypted(
            new AlgorithmIdentifier(
                ObjectIdentifier.fromString(password.algorithm_oid),
                password.algorithm_parameters_der
                    ? ((): DERElement => {
                        const el = new DERElement();
                        el.fromBytes(password.algorithm_parameters_der);
                        return el;
                    })()
                    : undefined,
            ),
            password.encrypted,
        ),
    };
}

export default readEntryPassword;
