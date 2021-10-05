

import type { Context, Vertex } from "../types";
import type { UserPwd } from "@wildboar/x500/src/lib/modules/PasswordPolicy/UserPwd.ta";
import { UserPwd_encrypted } from "@wildboar/x500/src/lib/modules/PasswordPolicy/UserPwd-encrypted.ta";
import { AlgorithmIdentifier } from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/AlgorithmIdentifier.ta";
import { DERElement, ObjectIdentifier } from "asn1-ts";

export
async function readEntryPassword (
    ctx: Context,
    entry: Vertex,
): Promise<UserPwd | null> {
    const password = await ctx.db.password.findUnique({
        where: {
            id: entry.dse.id,
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
