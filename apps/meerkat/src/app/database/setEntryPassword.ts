

import type { Context, Entry, StoredAttributeValueWithContexts } from "../types";
import type { UserPwd } from "@wildboar/x500/src/lib/modules/PasswordPolicy/UserPwd.ta";
import encryptPassword from "../x500/encryptPassword";
import { AlgorithmIdentifier } from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/AlgorithmIdentifier.ta";
import { scrypt, Scrypt_params } from "@wildboar/scrypt-0";
import { DERElement } from "asn1-ts";
import * as crypto from "crypto";

const scryptAlgId = new AlgorithmIdentifier(
    scrypt["&id"]!,
    scrypt.encoderFor["&Type"]!(new Scrypt_params(
        crypto.randomBytes(32),
        16384,
        8,
        1,
        128,
    ), () => new DERElement())
);

export
async function setEntryPassword (
    ctx: Context,
    entry: Entry,
    pwd: UserPwd,
): Promise<void> {
    if ("clear" in pwd) {
        const encryptedPassword = encryptPassword(scryptAlgId, Buffer.from(pwd.clear, "utf-8"));
        if (!encryptedPassword) {
            throw new Error();
        }
        await ctx.db.entry.update({
            where: {
                id: entry.id,
            },
            data: {
                password: {
                    create: {
                        encrypted: Buffer.from(encryptedPassword),
                        algorithm_oid: scryptAlgId.algorithm.nodes,
                        algorithm_parameters_der: scryptAlgId.parameters
                            ? Buffer.from(scryptAlgId.parameters.toBytes())
                            : undefined,
                    },
                },
            },
        });
    } else if ("encrypted" in pwd) {
        const alg = pwd.encrypted.algorithmIdentifier;
        await ctx.db.entry.update({
            where: {
                id: entry.id,
            },
            data: {
                password: {
                    create: {
                        encrypted: Buffer.from(pwd.encrypted.encryptedString),
                        algorithm_oid: alg.algorithm.nodes,
                        algorithm_parameters_der: alg.parameters
                            ? Buffer.from(alg.parameters.toBytes())
                            : undefined,
                    },
                },
            },
        });
    } else {
        throw new Error();
    }
}

export default setEntryPassword;
