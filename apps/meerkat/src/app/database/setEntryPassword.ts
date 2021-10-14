

import type { Context, Vertex } from "@wildboar/meerkat-types";
import type { UserPwd } from "@wildboar/x500/src/lib/modules/PasswordPolicy/UserPwd.ta";
import encryptPassword from "../x500/encryptPassword";
import getScryptAlgorithmIdentifier from "../x500/getScryptAlgorithmIdentifier";

export
async function setEntryPassword (
    ctx: Context,
    vertex: Vertex,
    pwd: UserPwd,
): Promise<void> {
    if ("clear" in pwd) {
        const algid = getScryptAlgorithmIdentifier();
        const clear = Buffer.from(pwd.clear, "utf-8");
        const encrypted = encryptPassword(algid, clear);
        if (!encrypted) {
            throw new Error();
        }
        await ctx.db.password.upsert({
            where: {
                entry_id: vertex.dse.id,
            },
            create: {
                entry_id: vertex.dse.id,
                encrypted: Buffer.from(encrypted),
                algorithm_oid: algid.algorithm.toString(),
                algorithm_parameters_der: algid.parameters
                    ? Buffer.from(algid.parameters.toBytes())
                    : undefined,
            },
            update: {
                entry_id: vertex.dse.id,
                encrypted: Buffer.from(encrypted),
                algorithm_oid: algid.algorithm.toString(),
                algorithm_parameters_der: algid.parameters
                    ? Buffer.from(algid.parameters.toBytes())
                    : undefined,
            },
        });
    } else if ("encrypted" in pwd) {
        await ctx.db.password.upsert({
            where: {
                entry_id: vertex.dse.id,
            },
            create: {
                entry_id: vertex.dse.id,
                encrypted: Buffer.from(pwd.encrypted.encryptedString),
                algorithm_oid: pwd.encrypted.algorithmIdentifier.algorithm.toString(),
                algorithm_parameters_der: pwd.encrypted.algorithmIdentifier.parameters
                    ? Buffer.from(pwd.encrypted.algorithmIdentifier.parameters.toBytes())
                    : undefined,
            },
            update: {
                entry_id: vertex.dse.id,
                encrypted: Buffer.from(pwd.encrypted.encryptedString),
                algorithm_oid: pwd.encrypted.algorithmIdentifier.algorithm.toString(),
                algorithm_parameters_der: pwd.encrypted.algorithmIdentifier.parameters
                    ? Buffer.from(pwd.encrypted.algorithmIdentifier.parameters.toBytes())
                    : undefined,
            },
        });
    } else {
        throw new Error();
    }
}

export default setEntryPassword;
