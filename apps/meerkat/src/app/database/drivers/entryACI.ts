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
import { ACIScope } from "@prisma/client";
import { DER } from "asn1-ts/dist/node/functional";
import {
    entryACI,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/entryACI.oa";
import writeSomeACI from "../writeSomeACI";
import directoryStringToString from "@wildboar/x500/src/lib/stringifiers/directoryStringToString";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    return vertex.dse.entryACI
        ?.map((aci) => entryACI.encoderFor["&Type"]!(aci, DER))
        .map((value) => ({
            type: entryACI["&id"],
            value,
        })) ?? [];
};

export
const addValue: SpecialAttributeDatabaseEditor = writeSomeACI(ACIScope.ENTRY);

export
const removeValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const decoded = entryACI.decoderFor["&Type"]!(value.value);
    pendingUpdates.otherWrites.push(ctx.db.aCIItem.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            tag: directoryStringToString(decoded.identificationTag),
            precedence: Number(decoded.precedence),
        },
    }));
};

export
const removeAttribute: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.aCIItem.deleteMany({
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
    return vertex.dse.entryACI?.length ?? 0;
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    return Boolean(vertex.dse.entryACI?.length);
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    const decoded = entryACI.decoderFor["&Type"]!(value.value);
    return vertex.dse.entryACI?.some((aci) => (
        (directoryStringToString(aci.identificationTag) === directoryStringToString(decoded.identificationTag))
        && (aci.precedence === decoded.precedence)
    )) ?? false;
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
