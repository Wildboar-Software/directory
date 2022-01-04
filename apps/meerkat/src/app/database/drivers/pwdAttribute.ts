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
import { DER, _encodeObjectIdentifier } from "asn1-ts/dist/node/functional";
import { userPwd } from "@wildboar/x500/src/lib/modules/PasswordPolicy/userPwd.oa";
import { pwdAttribute } from "@wildboar/x500/src/lib/modules/InformationFramework/pwdAttribute.oa";
import { ObjectIdentifier } from "asn1-ts";
import {
    pwdAdminSubentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/pwdAdminSubentry.oa";

const ID_PWD_SUBENTRY: string = pwdAdminSubentry["&id"].toString();
const PASSWORD_ATTRIBUTE_USED_BY_MEERKAT_DSA = userPwd["&id"];

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.subentry || !vertex.dse.objectClass.has(ID_PWD_SUBENTRY)) {
        return [];
    }
    if (vertex.dse.shadow) {
        const result = await ctx.db.pwdAttribute.findUnique({
            where: {
                entry_id: vertex.dse.id,
            },
            select: {
                pwd_attribute: true,
            },
        });
        return result
            ? [
                {
                    type: pwdAttribute["&id"],
                    value: _encodeObjectIdentifier(ObjectIdentifier.fromString(result.pwd_attribute), DER),
                },
            ]
            : [];
    }
    return [
        {
            type: pwdAttribute["&id"],
            value: _encodeObjectIdentifier(PASSWORD_ATTRIBUTE_USED_BY_MEERKAT_DSA, DER),
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
    pendingUpdates.otherWrites.push(ctx.db.pwdAttribute.create({
        data: {
            entry_id: vertex.dse.id,
            pwd_attribute: value.value.objectIdentifier.toString(),
        },
    }));
};

export
const removeValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.pwdAttribute.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            pwd_attribute: value.value.objectIdentifier.toString(),
        },
    }));
};

export
const removeAttribute: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.pwdAttribute.delete({
        where: {
            entry_id: vertex.dse.id,
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
        return ctx.db.pwdAttribute.count({
            where: {
                entry_id: vertex.dse.id,
            },
        });
    }
    return (vertex.dse.subentry && vertex.immediateSuperior?.dse.objectClass.has(ID_PWD_SUBENTRY))
        ? 1
        : 0;
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
) => {
    if (!vertex.dse.subentry) {
        return false;
    }
    if (vertex.dse.shadow) {
        return !!(await ctx.db.pwdAttribute.findFirst({
            where: {
                entry_id: vertex.dse.id,
            },
            select: {
                id: true,
            },
        }));
    }
    return !!(vertex.dse.subentry && vertex.immediateSuperior?.dse.objectClass.has(ID_PWD_SUBENTRY));
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
) => {
    if (!vertex.dse.subentry) {
        return false;
    }
    if (vertex.dse.shadow) {
        return !!(await ctx.db.pwdAttribute.findFirst({
            where: {
                entry_id: vertex.dse.id,
                pwd_attribute: value.value.objectIdentifier.toString(),
            },
            select: {
                id: true,
            },
        }));
    }
    return (vertex.dse.subentry && vertex.immediateSuperior?.dse.objectClass.has(ID_PWD_SUBENTRY))
        ? (value.value.objectIdentifier.isEqualTo(PASSWORD_ATTRIBUTE_USED_BY_MEERKAT_DSA))
        : false;
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
