import { Context, ClientAssociation, Vertex, MistypedArgumentError } from "@wildboar/meerkat-types";
import {
    UserPwd,
    UserPwd_encrypted,
    _encode_UserPwd,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/UserPwd.ta";
import encryptPassword from "../x500/encryptPassword";
import getScryptAlgorithmIdentifier from "../x500/getScryptAlgorithmIdentifier";
import { Prisma } from "@prisma/client";
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
import { pwdEncAlg, pwdExpiryAge, pwdMaxAge } from "@wildboar/x500/src/lib/collections/attributes";
import { AlgorithmIdentifier, _encode_AlgorithmIdentifier } from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/AlgorithmIdentifier.ta";
import {
    ASN1Construction,
    ASN1Element,
    ASN1TagClass,
    ASN1UniversalType,
    DERElement,
    ObjectIdentifier,
} from "asn1-ts";

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
): Promise<Prisma.PrismaPromise<any>[]> {
    /* If the entry is a shadow, we just want to create the userPwd attribute
    value only. Note that we still do not preserve the exact encoding of the
    value from the master: we still hash it, if it was presented in cleartext
    form. */
    if (vertex.dse.shadow) {
        const encAlg: AlgorithmIdentifier = ("clear" in pwd)
            ? getScryptAlgorithmIdentifier()
            : ("encrypted" in pwd)
                ? pwd.encrypted.algorithmIdentifier
                : getScryptAlgorithmIdentifier();
        const encrypted = ("clear" in pwd)
            ? encryptPassword(encAlg, Buffer.from(pwd.clear, "utf-8"))
            : ("encrypted" in pwd)
                ? pwd.encrypted.encryptedString
                : Buffer.allocUnsafe(0);
        return [ctx.db.password.upsert({
            where: {
                entry_id: vertex.dse.id,
            },
            create: {
                entry_id: vertex.dse.id,
                encrypted: Buffer.from(encrypted ?? Buffer.allocUnsafe(0)),
                algorithm_oid: encAlg.algorithm.toString(),
                algorithm_parameters_der: encAlg.parameters
                    ? Buffer.from(encAlg.parameters.toBytes())
                    : undefined,
            },
            update: {
                encrypted: Buffer.from(encrypted ?? Buffer.allocUnsafe(0)),
                algorithm_oid: encAlg.algorithm.toString(),
                algorithm_parameters_der: encAlg.parameters
                    ? Buffer.from(encAlg.parameters.toBytes())
                    : undefined,
            },
            select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
        })];
    }
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
        select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
    });
    const now = new Date();
    const nowElement = _encodeGeneralizedTime(now, DER);
    const targetDN = getDistinguishedName(vertex);
    const admPoints = getAdministrativePoints(vertex);
    const relevantSubentries: Vertex[] = (await Promise.all(
        admPoints.map((ap) => getRelevantSubentries(ctx, vertex, targetDN, ap)),
    )).flat();

    // TODO: Combine the two into a single query.
    const expiryAge: number | undefined = (await ctx.db.attributeValue.findMany({
        where: {
            entry_id: {
                in: relevantSubentries.map((s) => s.dse.id),
            },
            type_oid: pwdExpiryAge["&id"].toBytes(),
            operational: true,
        },
        select: {
            jer: true,
        },
    }))
        .map(({ jer }) => jer as number)
        // Do not reduce with initialValue = 0! Use undefined, then default to 0.
        .reduce((acc, curr) => Math.min(Number(acc ?? Infinity), Number(curr)), undefined);

    const maxAge: number | undefined = (await ctx.db.attributeValue.findMany({
        where: {
            entry_id: {
                in: relevantSubentries.map((s) => s.dse.id),
            },
            type_oid: pwdMaxAge["&id"].toBytes(),
            operational: true,
        },
        select: {
            jer: true,
        },
    }))
        .map(({ jer }) => jer as number)
        // Do not reduce with initialValue = 0! Use undefined, then default to 0.
        .reduce((acc, curr) => Math.min(Number(acc ?? Infinity), Number(curr)), undefined);


    // const pwdMaxAge: number = Number(relevantSubentries
    //     .map((sub) => sub.dse.subentry?.pwdMaxAge ?? Infinity)
    //     .reduce((acc, curr) => Math.min(Number(acc), Number(curr)), Infinity));
    const expTime: Date | null = expiryAge
        ? addSeconds(now, expiryAge)
        : null;
    const endTime: Date | null = maxAge
        ? addSeconds(now, maxAge)
        : null;

    const oldPassword = await ctx.db.password.findUnique({
        where: {
            entry_id: vertex.dse.id,
        },
        select: {
            algorithm_oid: true,
            algorithm_parameters_der: true,
            encrypted: true,
        },
    });
    const oldUserPwd: UserPwd | undefined = oldPassword
        ? {
            encrypted: new UserPwd_encrypted(
                new AlgorithmIdentifier(
                    ObjectIdentifier.fromString(oldPassword.algorithm_oid),
                    oldPassword.algorithm_parameters_der
                        ? ((): DERElement => {
                            const el = new DERElement();
                            el.fromBytes(oldPassword.algorithm_parameters_der);
                            return el;
                        })()
                        : undefined,
                ),
                oldPassword.encrypted,
            ),
        }
        : undefined;
    const encodedOldPwd: ASN1Element | undefined = oldUserPwd
        ? _encode_UserPwd(oldUserPwd, DER)
        : undefined;

    const encAlg: AlgorithmIdentifier = ("clear" in pwd)
        ? getScryptAlgorithmIdentifier()
        : ("encrypted" in pwd)
            ? pwd.encrypted.algorithmIdentifier
            : getScryptAlgorithmIdentifier();
    const encoded_enc_alg = _encode_AlgorithmIdentifier(encAlg, DER);
    const exp_time_el = expTime && _encodeGeneralizedTime(expTime, DER);
    const end_time_el = endTime && _encodeGeneralizedTime(endTime, DER);
    // We don't use `addValues()` or `removeAttribute()` in these DB commands,
    // purely because of performance. Much of what we have to do can be done
    // in two queries: delete attributes and create attributes.
    // This will obviously have to change if drivers are implemented for any of
    // the below pwd* attribute types.
    const otherUpdates: Prisma.PrismaPromise<any>[] = [
        ctx.db.attributeValue.deleteMany({
            where: {
                type_oid: {
                    in: [
                        pwdStartTime["&id"].toBytes(),
                        userPwdRecentlyExpired["&id"].toBytes(),
                        pwdGracesUsed["&id"].toBytes(),
                        pwdGraceUseTime["&id"].toBytes(),
                        pwdExpiryTime["&id"].toBytes(),
                        pwdEndTime["&id"].toBytes(),
                        pwdEncAlg["&id"].toBytes(),
                    ],
                },
            },
        }),
        ctx.db.attributeValue.createMany({
            data: [
                {
                    entry_id: vertex.dse.id,
                    type_oid: pwdStartTime["&id"].toBytes(),
                    operational: true,
                    tag_class: nowElement.tagClass,
                    constructed: false,
                    tag_number: nowElement.tagNumber,
                    content_octets: nowElement.value,
                    jer: nowElement.toJSON() as string,
                },
                {
                    entry_id: vertex.dse.id,
                    type_oid: pwdEncAlg["&id"].toBytes(),
                    operational: true,
                    tag_class: ASN1TagClass.universal,
                    constructed: true,
                    tag_number: ASN1UniversalType.sequence,
                    content_octets: encoded_enc_alg.value,
                    jer: encoded_enc_alg.toJSON() as object,
                },
                ...(exp_time_el
                    ? [{
                        entry_id: vertex.dse.id,
                        type_oid: pwdExpiryTime["&id"].toBytes(),
                        operational: true,
                        tag_class: ASN1TagClass.universal,
                        constructed: false,
                        tag_number: ASN1UniversalType.generalizedTime,
                        content_octets: exp_time_el.value,
                        jer: nowElement.toJSON() as string,
                    }]
                    : []),
                ...(end_time_el
                    ? [{
                        entry_id: vertex.dse.id,
                        type_oid: pwdEndTime["&id"].toBytes(),
                        operational: true,
                        tag_class: ASN1TagClass.universal,
                        constructed: false,
                        tag_number: ASN1UniversalType.generalizedTime,
                        content_octets: end_time_el.value,
                        jer: nowElement.toJSON() as string,
                    }]
                    : []),
                /**
                 * I think `userPwdRecentlyExpired` is a really poorly named
                 * attribute, because its real purpose is to store the previous
                 * password, which needs to stick around for a little while to
                 * compensate for replication latency.
                 */
                ...(encodedOldPwd
                    ? [{
                        entry_id: vertex.dse.id,
                        type_oid: userPwdRecentlyExpired["&id"].toBytes(),
                        operational: true,
                        tag_class: encodedOldPwd.tagClass,
                        constructed: (encodedOldPwd.construction === ASN1Construction.constructed),
                        tag_number: encodedOldPwd.tagNumber,
                        content_octets: encodedOldPwd.value,
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
        const clear = Buffer.from(pwd.clear, "utf-8");
        const encrypted = encryptPassword(encAlg, clear);
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
                    algorithm_oid: encAlg.algorithm.toString(),
                    algorithm_parameters_der: encAlg.parameters
                        ? encAlg.parameters.toBytes()
                        : undefined,
                },
                update: {
                    encrypted: Buffer.from(encrypted),
                    algorithm_oid: encAlg.algorithm.toString(),
                    algorithm_parameters_der: encAlg.parameters
                        ? encAlg.parameters.toBytes()
                        : undefined,
                },
                select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
            }),
            ctx.db.passwordHistory.upsert({
                update: {
                    entry_id: vertex.dse.id,
                },
                create: {
                    entry_id: vertex.dse.id,
                    password: Buffer.from(_encode_UserPwd({
                        encrypted: new UserPwd_encrypted(
                            encAlg,
                            encrypted,
                        ),
                    }, DER).toBytes()),
                    time: now,
                },
                where: {
                    entry_id_time: {
                        entry_id: vertex.dse.id,
                        time: now,
                    },
                },
                select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
            }),
            ...otherUpdates,
        ];
    } else if ("encrypted" in pwd) {
        // TODO: Error if the algorithm is not scrypt, and return a notification parameter, if possible.
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
                select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
            }),
            ctx.db.passwordHistory.upsert({
                update: {
                    entry_id: vertex.dse.id,
                },
                create: {
                    entry_id: vertex.dse.id,
                    password: Buffer.from(_encode_UserPwd(pwd, DER).toBytes()),
                    time: now,
                },
                where: {
                    entry_id_time: {
                        entry_id: vertex.dse.id,
                        time: now,
                    },
                },
                select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
            }),
            ...otherUpdates,
        ];
    } else {
        throw new MistypedArgumentError(ctx.i18n.t("err:unrecognized_user_pwd_alt"));
    }
}

export default setEntryPassword;
