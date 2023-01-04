import type { Context, ClientAssociation, Vertex } from "@wildboar/meerkat-types";
import {
    UserPwd,
    UserPwd_encrypted,
    _encode_UserPwd,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/UserPwd.ta";
import encryptPassword from "../x500/encryptPassword";
import getScryptAlgorithmIdentifier from "../x500/getScryptAlgorithmIdentifier";
import { PrismaPromise } from "@prisma/client";
import anyPasswordsExist from "../authz/anyPasswordsExist";
import { DER, _encodeGeneralizedTime } from "asn1-ts/dist/node/functional";
import {
    pwdStartTime,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdStartTime.oa";
import {
    userPwdRecentlyExpired,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/userPwdRecentlyExpired.oa";
import {
    pwdGracesUsed,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdGracesUsed.oa";
import {
    pwdExpiryTime,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdExpiryTime.oa";
import {
    pwdEndTime,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdEndTime.oa";
import {
    pwdGraceUseTime,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdGraceUseTime.oa";
import { getAdministrativePoints } from "../dit/getAdministrativePoints";
import { getRelevantSubentries } from "../dit/getRelevantSubentries";
import { getDistinguishedName } from "../x500/getDistinguishedName";
import { addSeconds } from "date-fns";

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
    const targetDN = getDistinguishedName(vertex);
    const admPoints = getAdministrativePoints(vertex);
    const relevantSubentries: Vertex[] = (await Promise.all(
        admPoints.map((ap) => getRelevantSubentries(ctx, vertex, targetDN, ap)),
    )).flat();
    const pwdExpiryAge: number = Number(relevantSubentries
        .map((sub) => sub.dse.subentry?.pwdExpiryAge ?? Infinity)
        .reduce((acc, curr) => Math.min(Number(acc), Number(curr)), Infinity));
    const pwdMaxAge: number = Number(relevantSubentries
        .map((sub) => sub.dse.subentry?.pwdMaxAge ?? Infinity)
        .reduce((acc, curr) => Math.min(Number(acc), Number(curr)), Infinity));
    const expTime: Date | null = (Number.isSafeInteger(pwdExpiryAge))
        ? addSeconds(now, pwdExpiryAge)
        : null;
    const endTime: Date | null = (Number.isSafeInteger(pwdMaxAge))
        ? addSeconds(now, pwdMaxAge)
        : null;

    // We don't use `addValues()` or `removeAttribute()` in these DB commands,
    // purely because of performance. Much of what we have to do can be done
    // in two queries: delete attributes and create attributes.
    // This will obviously have to change if drivers are implemented for any of
    // the below pwd* attribute types.
    const otherUpdates: PrismaPromise<any>[] = [
        ctx.db.attributeValue.deleteMany({
            where: {
                type: {
                    in: [
                        pwdStartTime["&id"].toString(),
                        userPwdRecentlyExpired["&id"].toString(),
                        pwdGracesUsed["&id"].toString(),
                        pwdGraceUseTime["&id"].toString(),
                        pwdExpiryTime["&id"].toString(),
                        pwdEndTime["&id"].toString(),
                    ],
                },
            },
        }),
        ctx.db.attributeValue.createMany({
            data: [
                {
                    entry_id: vertex.dse.id,
                    type: pwdStartTime["&id"].toString(),
                    operational: true,
                    tag_class: nowElement.tagClass,
                    constructed: false,
                    tag_number: nowElement.tagNumber,
                    ber: Buffer.from(nowElement.toBytes().buffer),
                    jer: nowElement.toJSON() as string,
                },
                {
                    entry_id: vertex.dse.id,
                    type: pwdStartTime["&id"].toString(),
                    operational: true,
                    tag_class: nowElement.tagClass,
                    constructed: false,
                    tag_number: nowElement.tagNumber,
                    ber: Buffer.from(nowElement.toBytes().buffer),
                    jer: nowElement.toJSON() as string,
                },
                ...(expTime
                    ? [{
                        entry_id: vertex.dse.id,
                        type: pwdExpiryTime["&id"].toString(),
                        operational: true,
                        tag_class: nowElement.tagClass,
                        constructed: false,
                        tag_number: nowElement.tagNumber,
                        ber: Buffer.from(_encodeGeneralizedTime(expTime, DER).toBytes().buffer),
                        jer: nowElement.toJSON() as string,
                    }]
                    : []),
                ...(endTime
                    ? [{
                        entry_id: vertex.dse.id,
                        type: pwdEndTime["&id"].toString(),
                        operational: true,
                        tag_class: nowElement.tagClass,
                        constructed: false,
                        tag_number: nowElement.tagNumber,
                        ber: Buffer.from(_encodeGeneralizedTime(endTime, DER).toBytes().buffer),
                        jer: nowElement.toJSON() as string,
                    }]
                    : []),
            ],
        }),
        /**
         * The first entry with a password added will have permission to add
         * top-level DSEs. Outside of this, this flag must be set using the
         * database.
        */
        ...(entriesWithPasswordsExist
            ? []
            : [ makeTopLevelAdmin ]),
    ];
    if ("clear" in pwd) {
        const algid = getScryptAlgorithmIdentifier();
        const clear = Buffer.from(pwd.clear, "utf-8");
        const encrypted = encryptPassword(algid, clear);
        if (!encrypted) {
            throw new Error("fc8872c3-067e-4d91-995a-28c94ed8ec08");
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
            ctx.db.password.upsert({
                where: {
                    entry_id: vertex.dse.id,
                },
                create: {
                    entry_id: vertex.dse.id,
                    encrypted: Buffer.from(encrypted),
                    algorithm_oid: algid.algorithm.toString(),
                    algorithm_parameters_der: algid.parameters
                        ? Buffer.from(algid.parameters.toBytes().buffer)
                        : undefined,
                },
                update: {
                    encrypted: Buffer.from(encrypted),
                    algorithm_oid: algid.algorithm.toString(),
                    algorithm_parameters_der: algid.parameters
                        ? Buffer.from(algid.parameters.toBytes().buffer)
                        : undefined,
                },
            }),
            ctx.db.passwordHistory.create({
                data: {
                    entry_id: vertex.dse.id,
                    password: Buffer.from(_encode_UserPwd({
                        encrypted: new UserPwd_encrypted(
                            algid,
                            encrypted,
                        ),
                    }, DER).toBytes().buffer),
                    time: new Date(),
                },
            }),
            ...otherUpdates,
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
            ctx.db.password.upsert({
                where: {
                    entry_id: vertex.dse.id,
                },
                create: {
                    entry_id: vertex.dse.id,
                    encrypted: Buffer.from(pwd.encrypted.encryptedString),
                    algorithm_oid: pwd.encrypted.algorithmIdentifier.algorithm.toString(),
                    algorithm_parameters_der: pwd.encrypted.algorithmIdentifier.parameters
                        ? Buffer.from(pwd.encrypted.algorithmIdentifier.parameters.toBytes().buffer)
                        : undefined,
                },
                update: {
                    encrypted: Buffer.from(pwd.encrypted.encryptedString),
                    algorithm_oid: pwd.encrypted.algorithmIdentifier.algorithm.toString(),
                    algorithm_parameters_der: pwd.encrypted.algorithmIdentifier.parameters
                        ? Buffer.from(pwd.encrypted.algorithmIdentifier.parameters.toBytes().buffer)
                        : undefined,
                },
            }),
            ctx.db.passwordHistory.create({
                data: {
                    entry_id: vertex.dse.id,
                    password: Buffer.from(_encode_UserPwd(pwd, DER).toBytes().buffer),
                    time: new Date(),
                },
            }),
            ...otherUpdates,
        ];
    } else {
        throw new Error("f69e3540-7629-478f-957d-c2957ee42655");
    }
}

export default setEntryPassword;
