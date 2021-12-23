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
import { DER } from "asn1-ts/dist/node/functional";
import { alias } from "@wildboar/x500/src/lib/modules/InformationFramework/alias.oa";
import {
    _decode_DistinguishedName,
    _encode_DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import rdnToJson from "../../x500/rdnToJson";
import findEntry from "../../x500/findEntry";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.alias?.aliasedEntryName) {
        return [];
    }
    return [
        {
            type: alias["&id"],
            value: _encode_DistinguishedName(vertex.dse.alias.aliasedEntryName, DER),
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
    const decodedName = _decode_DistinguishedName(value.value);
    const aliasedEntry = await findEntry(ctx, ctx.dit.root, decodedName, true);
    if (!aliasedEntry) {
        ctx.log.warn(ctx.i18n.t("log:aliased_does_not_exist", {
            id: vertex.dse.uuid ?? vertex.dse.id,
        }));
    }
    pendingUpdates.otherWrites.push(ctx.db.alias.create({
        data: {
            alias_entry_id: vertex.dse.id,
            aliased_entry_name: decodedName.map(rdnToJson),
            aliased_entry_id: aliasedEntry?.dse.id,
        },
    }));
    pendingUpdates.entryUpdate.alias = true;
};

export
const removeValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const decodedName = _decode_DistinguishedName(value.value);
    const aliasedEntry = await findEntry(ctx, ctx.dit.root, decodedName, true);
    if (aliasedEntry) {
        pendingUpdates.otherWrites.push(ctx.db.alias.delete({
            where: {
                alias_entry_id: vertex.dse.id,
                aliased_entry_id: aliasedEntry.dse.id,
            },
        }));
    } else {
        pendingUpdates.otherWrites.push(ctx.db.alias.deleteMany({
            where: {
                alias_entry_id: vertex.dse.id,
                aliased_entry_name: {
                    equals: decodedName.map(rdnToJson),
                },
            },
        }));
    }
};

export
const removeAttribute: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.alias.deleteMany({
        where: {
            alias_entry_id: vertex.dse.id,
        },
    }));
};

export
const countValues: SpecialAttributeCounter = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<number> => {
    return ctx.db.alias.count({
        where: {
            alias_entry_id: vertex.dse.id,
        },
    });
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    return !!(await ctx.db.alias.findFirst({
        where: {
            alias_entry_id: vertex.dse.id,
        },
    }));
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    const decodedName = _decode_DistinguishedName(value.value);
    const aliasedEntry = await findEntry(ctx, ctx.dit.root, decodedName, true);
    if (aliasedEntry) {
        return !!(await ctx.db.alias.findFirst({
            where: {
                alias_entry_id: vertex.dse.id,
                aliased_entry_id: aliasedEntry.dse.id,
            },
        }))
    } else {
        return !!(await ctx.db.alias.findFirst({
            where: {
                alias_entry_id: vertex.dse.id,
                aliased_entry_name: {
                    equals: decodedName.map(rdnToJson),
                },
            },
        }))
    }
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
