

import type { Context, Entry } from "../types";
import type { UserPwd } from "@wildboar/x500/src/lib/modules/PasswordPolicy/UserPwd.ta";
import { UserPwd_encrypted } from "@wildboar/x500/src/lib/modules/PasswordPolicy/UserPwd-encrypted.ta";
import { AlgorithmIdentifier } from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/AlgorithmIdentifier.ta";
import { DERElement, ObjectIdentifier } from "asn1-ts";

export
async function readEntryPassword (
    ctx: Context,
    entry: Entry,
): Promise<UserPwd | null> {
    const storedEntry = await ctx.db.entry.findFirst({
        where: {
            id: entry.id,
        },
        include: {
            password: true,
        },
    });
    if (!storedEntry || !storedEntry.password) {
        return null;
    }
    const pwd = storedEntry.password;
    return {
        encrypted: new UserPwd_encrypted(
            new AlgorithmIdentifier(
                new ObjectIdentifier(pwd.algorithm_oid),
                pwd.algorithm_parameters_der
                    ? ((): DERElement => {
                        const el = new DERElement();
                        el.fromBytes(pwd.algorithm_parameters_der);
                        return el;
                    })()
                    : undefined,
            ),
            pwd.encrypted,
        ),
    };
}

export default readEntryPassword;
