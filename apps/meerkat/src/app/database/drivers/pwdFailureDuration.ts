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
import { ASN1Construction } from "asn1-ts";
import { DER, _encodeInteger } from "asn1-ts/dist/node/functional";
import {
    pwdFailureDuration,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdFailureDuration.oa";
import {
    pwdAdminSubentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/pwdAdminSubentry.oa";
import type { Prisma } from "@prisma/client";
import { attributeValueFromDB } from "../attributeValueFromDB";

const ID_PWD_SUBENTRY: string = pwdAdminSubentry["&id"].toString();
const TYPE_OID = pwdFailureDuration["&id"].toBytes();

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
                type_oid: TYPE_OID,
            },
            select: {
                tag_class: true,
                constructed: true,
                tag_number: true,
                content_octets: true,
            },
        });
        if (!row) {
            return [];
        }
        const el = attributeValueFromDB(row);
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
            type_oid: TYPE_OID,
            operational: true,
            tag_class: value.value.tagClass,
            constructed: (value.value.construction === ASN1Construction.constructed),
            tag_number: value.value.tagNumber,
            content_octets: Buffer.from(
                value.value.value.buffer,
                value.value.value.byteOffset,
                value.value.value.byteLength,
            ),
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
            type_oid: TYPE_OID,
            content_octets: Buffer.from(
                value.value.value.buffer,
                value.value.value.byteOffset,
                value.value.value.byteLength,
            ),
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
            type_oid: TYPE_OID,
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
                type_oid: TYPE_OID,
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
        return !!(await ctx.db.attributeValue.findFirst({
            where: {
                entry_id: vertex.dse.id,
                type_oid: TYPE_OID,
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
                type_oid: TYPE_OID,
                content_octets: Buffer.from(
                    value.value.value.buffer,
                    value.value.value.byteOffset,
                    value.value.value.byteLength,
                ),
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
