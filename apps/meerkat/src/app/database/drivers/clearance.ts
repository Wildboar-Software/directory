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
import { BOOLEAN, TRUE } from "asn1-ts";
import { DER } from "asn1-ts/dist/node/functional";
import { clearance } from "@wildboar/x500/src/lib/modules/EnhancedSecurity/clearance.oa";
import {
    _decode_Clearance,
    _encode_Clearance,
} from "@wildboar/x500/src/lib/modules/EnhancedSecurity/Clearance.ta";
import {
    ClassList_unmarked,
    ClassList_unclassified,
    ClassList_restricted,
    ClassList_confidential,
    ClassList_secret,
    ClassList_topSecret,
} from "@wildboar/x500/src/lib/modules/EnhancedSecurity/ClassList.ta";

// model Clearance {
//     id           Int     @id @default(autoincrement())
//     entry_id     Int
//     entry        Entry   @relation(fields: [entry_id], references: [id], onDelete: Cascade)
//     policy_id    OID
//     // From classList
//     unmarked     Boolean @default(false)
//     unclassified Boolean @default(false)
//     restricted   Boolean @default(false)
//     confidential Boolean @default(false)
//     secret       Boolean @default(false)
//     topSecret    Boolean @default(false)
// }

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.clearances) {
        return [];
    }
    return vertex.dse.clearances.map((c) => ({
        type: clearance["&id"],
        value: _encode_Clearance(c, DER),
    }));
};

export
const addValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const decoded = _decode_Clearance(value.value);
    const unmarked: BOOLEAN = !!decoded.classList?.[ClassList_unmarked];
    const unclassified: BOOLEAN = decoded.classList
        ? !!decoded.classList[ClassList_unclassified]
        : TRUE;
    const restricted: BOOLEAN = !!decoded.classList?.[ClassList_restricted];
    const confidential: BOOLEAN = !!decoded.classList?.[ClassList_confidential];
    const secret: BOOLEAN = !!decoded.classList?.[ClassList_secret];
    const topSecret: BOOLEAN = !!decoded.classList?.[ClassList_topSecret];
    pendingUpdates.otherWrites.push(ctx.db.clearance.create({
        data: {
            entry_id: vertex.dse.id,
            policy_id: decoded.policyId.toString(),
            unmarked,
            unclassified,
            restricted,
            confidential,
            secret,
            topSecret,
            ClearanceSecurityCategory: {
                createMany: {
                    data: decoded.securityCategories?.map((sc) => ({
                        type: sc.type_.toString(),
                        value: Buffer.from(sc.value.toBytes().buffer),
                    })) ?? [],
                },
            },
            ber: Buffer.from(value.value.toBytes().buffer),
            active: true,
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
    pendingUpdates.otherWrites.push(ctx.db.clearance.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            ber: Buffer.from(value.value.toBytes().buffer),
        },
    }));
};

export
const removeAttribute: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.clearance.deleteMany({
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
    return ctx.db.clearance.count({
        where: {
            entry_id: vertex.dse.id,
            active: true,
        },
    });
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    return !!(await ctx.db.clearance.findFirst({
        where: {
            entry_id: vertex.dse.id,
            active: true,
        },
    }));
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    return !!(await ctx.db.clearance.findFirst({
        where: {
            entry_id: vertex.dse.id,
            ber: Buffer.from(value.value.toBytes().buffer),
            active: true,
        },
    }));
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
