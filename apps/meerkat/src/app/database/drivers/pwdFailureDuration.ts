import type {
    Context,
    Vertex,
    Value,
    PendingUpdates,
    AttributeTypeDatabaseDriver,
    SpecialAttributeDatabaseReader,
    SpecialAttributeDatabaseEditor,
    SpecialAttributeDatabaseRemover,
    SpecialAttributeCounter,
    SpecialAttributeDetector,
    SpecialAttributeValueDetector,
} from "@wildboar/meerkat-types";
import { BERElement, ASN1Construction } from "asn1-ts";
import { DER, _encodeInteger } from "asn1-ts/dist/node/functional";
import {
    pwdFailureDuration,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdFailureDuration.oa";
import {
    pwdAdminSubentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/pwdAdminSubentry.oa";
import type { Prisma } from "@prisma/client";

const ID_PWD_SUBENTRY: string = pwdAdminSubentry["&id"].toString();
const TYPE_OID: string = pwdFailureDuration["&id"].toString();

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.subentry || !vertex.dse.objectClass.has(ID_PWD_SUBENTRY)) {
        return [];
    }
    if (vertex.dse.shadow) {
        const row = await ctx.db.attributeValue.findFirst({
            where: {
                entry_id: vertex.dse.id,
                type: TYPE_OID,
            },
            select: {
                ber: true,
            },
        });
        if (!row) {
            return [];
        }
        const el = new BERElement();
        el.fromBytes(row.ber);
        return [
            {
                type: pwdFailureDuration["&id"],
                value: el,
            },
        ];
    }
    const seconds: number = Math.round(
        (
            ctx.config.bindMinSleepInMilliseconds
            + ctx.config.bindSleepRangeInMilliseconds
        ) / 1000
    );
    return [
        {
            type: pwdFailureDuration["&id"],
            value: _encodeInteger(seconds, DER),
        },
    ];
};

export
const addValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    if (!vertex.dse.shadow) {
        return;
    }
    pendingUpdates.otherWrites.push(ctx.db.attributeValue.create({
        data: {
            entry_id: vertex.dse.id,
            type: TYPE_OID,
            operational: true,
            tag_class: value.value.tagClass,
            constructed: (value.value.construction === ASN1Construction.constructed),
            tag_number: value.value.tagNumber,
            ber: Buffer.from(value.value.toBytes()),
            jer: value.value.toJSON() as Prisma.InputJsonValue,
        },
    }));
}

export
const removeValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    if (!vertex.dse.shadow) {
        return;
    }
    pendingUpdates.otherWrites.push(ctx.db.attributeValue.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            type: TYPE_OID,
            ber: Buffer.from(value.value.toBytes()),
        },
    }));
}

export
const removeAttribute: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    if (!vertex.dse.shadow) {
        return;
    }
    pendingUpdates.otherWrites.push(ctx.db.attributeValue.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            type: TYPE_OID,
        },
    }));
};

export
const countValues: SpecialAttributeCounter = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<number> => {
    if (!vertex.dse.subentry) {
        return 0;
    }
    if (vertex.dse.shadow) {
        return ctx.db.attributeValue.count({
            where: {
                entry_id: vertex.dse.id,
                type: TYPE_OID,
            },
        });
    }
    return (vertex.dse.subentry && vertex.dse.objectClass.has(ID_PWD_SUBENTRY))
        ? 1
        : 0;
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    if (!vertex.dse.subentry) {
        return false;
    }
    if (vertex.dse.shadow) {
        return !!(await ctx.db.passwordEncryptionAlgorithm.findFirst({
            where: {
                entry_id: vertex.dse.id,
            },
            select: {
                id: true,
            },
        }));
    }
    return !!(vertex.dse.subentry && vertex.dse.objectClass.has(ID_PWD_SUBENTRY));
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    if (!vertex.dse.subentry) {
        return false;
    }
    if (vertex.dse.shadow) {
        return !!(await ctx.db.attributeValue.findFirst({
            where: {
                entry_id: vertex.dse.id,
                type: TYPE_OID,
                ber: Buffer.from(value.value.toBytes()),
            },
            select: {
                id: true,
            },
        }));
    }
    const seconds: number = Math.round(
        (
            ctx.config.bindMinSleepInMilliseconds
            + ctx.config.bindSleepRangeInMilliseconds
        ) / 1000
    );
    return (
        vertex.dse.subentry
        && vertex.dse.objectClass.has(ID_PWD_SUBENTRY)
        && (seconds === value.value.integer)
    );
};

export
const driver: AttributeTypeDatabaseDriver = {
    readValues,
    addValue,
    removeValue,
    removeAttribute,
    countValues,
    isPresent,
    hasValue,
};

export default driver;
