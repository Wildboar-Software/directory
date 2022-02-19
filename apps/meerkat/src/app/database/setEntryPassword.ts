import type { Context, ClientAssociation, Vertex } from "@wildboar/meerkat-types";
import type { UserPwd } from "@wildboar/x500/src/lib/modules/PasswordPolicy/UserPwd.ta";
import encryptPassword from "../x500/encryptPassword";
import getScryptAlgorithmIdentifier from "../x500/getScryptAlgorithmIdentifier";
import { PrismaPromise } from "@prisma/client";
import anyPasswordsExist from "../authz/anyPasswordsExist";
import { DER, _encodeGeneralizedTime } from "asn1-ts/dist/node/functional";
import {
    pwdStartTime,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdStartTime.oa";

/**
 * @summary Set the password of an entry
 * @description
 *
 * This function sets the password of an entry and also updates any relevant
 * password-policy related operational attributes, such as `pwdStartTime`.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param vertex The entry whose password is to be set
 * @param pwd The password to assign to the entry
 * @returns An array of `PrismaPromise`s that can be `await`ed or `then()`'d
 *  either separately or as a transaction to set the password.
 *
 * @function
 * @async
 */
export
async function setEntryPassword (
    ctx: Context,
    assn: ClientAssociation | undefined,
    vertex: Vertex,
    pwd: UserPwd,
): Promise<PrismaPromise<any>[]> {
    const entriesWithPasswordsExist: boolean = await anyPasswordsExist(ctx);
    // Notice that we do not await this promise here, so it does not execute.
    // (`PrismaPromise`s only run the callback when awaited.)
    const makeTopLevelAdmin = ctx.db.entry.update({
        where: {
            id: vertex.dse.id,
        },
        data: {
            may_add_top_level_dse: true,
        },
    });
    const now = new Date();
    const nowElement = _encodeGeneralizedTime(now, DER);
    if ("clear" in pwd) {
        const algid = getScryptAlgorithmIdentifier();
        const clear = Buffer.from(pwd.clear, "utf-8");
        const encrypted = encryptPassword(algid, clear);
        if (!encrypted) {
            throw new Error();
        }
        if (assn) {
            ctx.log.info(ctx.i18n.t("log:password_changed", {
                cid: assn.id,
                uuid: vertex.dse.uuid,
            }), {
                remoteFamily: assn.socket.remoteFamily,
                remoteAddress: assn.socket.remoteAddress,
                remotePort: assn.socket.remotePort,
                association_id: assn.id,
            });
        }
        return [
            /**
             * The first entry with a password added will have permission to add
             * top-level DSEs. Outside of this, this flag must be set using the
             * database.
             */
            ...(entriesWithPasswordsExist
                ? [ makeTopLevelAdmin ]
                : []),
            ctx.db.password.upsert({
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
                    encrypted: Buffer.from(encrypted),
                    algorithm_oid: algid.algorithm.toString(),
                    algorithm_parameters_der: algid.parameters
                        ? Buffer.from(algid.parameters.toBytes())
                        : undefined,
                },
            }),
            ctx.db.attributeValue.deleteMany({
                where: {
                    entry_id: vertex.dse.id,
                    type: {
                        in: [ // Using in, because we will add more attributes later.
                            pwdStartTime["&id"].toString(),
                        ],
                    },
                },
            }),
            ctx.db.attributeValue.create({
                data: {
                    entry_id: vertex.dse.id,
                    type: pwdStartTime["&id"].toString(),
                    operational: true,
                    tag_class: nowElement.tagClass,
                    constructed: false,
                    tag_number: nowElement.tagNumber,
                    ber: Buffer.from(nowElement.toBytes()),
                    jer: nowElement.toJSON() as string,
                },
            }),
        ];
    } else if ("encrypted" in pwd) {
        if (assn) {
            ctx.log.info(ctx.i18n.t("log:password_changed", {
                cid: assn.id,
                uuid: vertex.dse.uuid,
            }), {
                remoteFamily: assn.socket.remoteFamily,
                remoteAddress: assn.socket.remoteAddress,
                remotePort: assn.socket.remotePort,
                association_id: assn.id,
            });
        }
        return [
            /**
             * The first entry with a password added will have permission to add
             * top-level DSEs. Outside of this, this flag must be set using the
             * database.
             */
            ...(entriesWithPasswordsExist
                ? [ makeTopLevelAdmin ]
                : []),
            ctx.db.password.upsert({
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
                    encrypted: Buffer.from(pwd.encrypted.encryptedString),
                    algorithm_oid: pwd.encrypted.algorithmIdentifier.algorithm.toString(),
                    algorithm_parameters_der: pwd.encrypted.algorithmIdentifier.parameters
                        ? Buffer.from(pwd.encrypted.algorithmIdentifier.parameters.toBytes())
                        : undefined,
                },
            }),
            ctx.db.attributeValue.deleteMany({
                where: {
                    entry_id: vertex.dse.id,
                    type: {
                        in: [ // Using in, because we will add more attributes later.
                            pwdStartTime["&id"].toString(),
                        ],
                    },
                },
            }),
            ctx.db.attributeValue.create({
                data: {
                    entry_id: vertex.dse.id,
                    type: pwdStartTime["&id"].toString(),
                    operational: true,
                    tag_class: nowElement.tagClass,
                    constructed: false,
                    tag_number: nowElement.tagNumber,
                    ber: Buffer.from(nowElement.toBytes()),
                    jer: nowElement.toJSON() as string,
                },
            }),
        ];
    } else {
        throw new Error();
    }
}

export default setEntryPassword;
