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
} from "../../types/index.js";
import { DER } from "@wildboar/asn1/functional";
import { alias } from "@wildboar/x500/InformationFramework";
import {
    _decode_DistinguishedName,
    _encode_DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import rdnToJson from "../../x500/rdnToJson.js";
import dnToID from "../../dit/dnToID.js";
import { DbNull } from "../../generated/internal/prismaNamespace.js";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter.js";
import { compareDistinguishedName } from "@wildboar/x500";

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
    const aliasedEntryId = await dnToID(ctx, ctx.dit.root.dse.id, decodedName);
    if (!aliasedEntryId) {
        ctx.log.warn(ctx.i18n.t("log:aliased_does_not_exist", {
            id: vertex.dse.uuid ?? vertex.dse.id,
        }));
    }
    vertex.dse.alias = {
        aliasedEntryName: decodedName,
    };
    pendingUpdates.entryUpdate.alias = true;
    pendingUpdates.entryUpdate.aliased_entry_name = decodedName.map(rdnToJson);
    if (typeof aliasedEntryId === "number") {
        pendingUpdates.entryUpdate.aliased_entry = {
            connect: {
                id: aliasedEntryId,
            },
        };
    }
};

export
const removeValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    return removeAttribute(ctx, vertex, pendingUpdates);
};

export
const removeAttribute: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.entryUpdate.aliased_entry_name = DbNull;
    pendingUpdates.entryUpdate.aliased_entry = {
        disconnect: true,
    };
};

export
const countValues: SpecialAttributeCounter = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<number> => {
    return vertex.dse.alias?.aliasedEntryName
        ? 1
        : 0;
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    return !!vertex.dse.alias?.aliasedEntryName;
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    if (!vertex.dse.alias?.aliasedEntryName) {
        return false;
    }
    const storedName = vertex.dse.alias?.aliasedEntryName;
    const assertedName = _decode_DistinguishedName(value.value);
    const namingMatcher = getNamingMatcherGetter(ctx);
    return compareDistinguishedName(assertedName, storedName, namingMatcher);
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
