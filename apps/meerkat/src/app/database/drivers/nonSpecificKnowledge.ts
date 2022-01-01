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
import {
    nonSpecificKnowledge,
} from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/nonSpecificKnowledge.oa";
import { DER } from "asn1-ts/dist/node/functional";
import { Prisma, Knowledge } from "@prisma/client";
import { randomInt } from "crypto";
import rdnToJson from "../../x500/rdnToJson";
import rdnFromJson from "../../x500/rdnFromJson";
import compareRDNSequence from "@wildboar/x500/src/lib/comparators/compareRDNSequence";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter";
import saveAccessPoint from "../saveAccessPoint";

const MAX_RANDOM_INT: number = (2 ** 48) - 1; // -1 just to be safe.

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.nssr?.nonSpecificKnowledge?.length) {
        return [];
    }
    return vertex.dse.nssr.nonSpecificKnowledge.map((k) => ({
        type: nonSpecificKnowledge["&id"],
        value: nonSpecificKnowledge.encoderFor["&Type"]!(k, DER),
    }));
};

export
const addValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const decoded = nonSpecificKnowledge.decoderFor["&Type"]!(value.value);
    if (vertex.dse.nssr) {
        vertex.dse.nssr.nonSpecificKnowledge.push(decoded);
    } else {
        vertex.dse.nssr = {
            nonSpecificKnowledge: [ decoded ],
        };
    }
    const nsk_group: bigint = BigInt(randomInt(MAX_RANDOM_INT));
    pendingUpdates.entryUpdate.nssr = true;
    // We create the access points now...
    const createdAccessPointIds = await Promise.all(
        decoded.map((mosap) => saveAccessPoint(ctx, mosap, Knowledge.NON_SPECIFIC, undefined, undefined, nsk_group)));
    // But within the transaction, we associate them with this DSE.
    pendingUpdates.otherWrites.push(ctx.db.accessPoint.updateMany({
        where: {
            id: {
                in: createdAccessPointIds,
            },
        },
        data: {
            entry_id: vertex.dse.id,
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
    const decoded = nonSpecificKnowledge.decoderFor["&Type"]!(value.value);
    if (!decoded.length) {
        return;
    }
    const results = await ctx.db.accessPoint.findMany({
        where: {
            entry_id: vertex.dse.id,
            knowledge_type: Knowledge.NON_SPECIFIC,
            OR: decoded.map((mosap) => ({
                ae_title: {
                    equals: mosap.ae_title.rdnSequence.map(rdnToJson),
                },
            })),
        },
        select: {
            // ber: true,
            ae_title: true,
            nsk_group: true,
        },
        distinct: ["nsk_group"],
    });
    let nsk_group: bigint | null = null;
    if (results.length !== 1) {
        // Figure out which NSK group is _the_ target.
        for (const result of results) {
            const possible_nsk_group = result.nsk_group;
            // await ctx.db.accessPoint.
            const nsk = await ctx.db.accessPoint.findMany({
                where: {
                    entry_id: vertex.dse.id,
                    knowledge_type: Knowledge.NON_SPECIFIC,
                    nsk_group: possible_nsk_group,
                },
                select: {
                    // ber: true,
                    ae_title: true,
                    nsk_group: true,
                },
            });
            if (nsk.length !== decoded.length) { // Must have same number of APs.
                continue;
            }
            const everyAETitleMatches: boolean = nsk
                .every((n) => (
                    Array.isArray(n.ae_title)
                    && decoded.some((mosap) => compareRDNSequence(
                        mosap.ae_title.rdnSequence,
                        (n.ae_title as Prisma.JsonArray).map(rdnFromJson),
                        getNamingMatcherGetter(ctx),
                    ))
                ));
            if (everyAETitleMatches) {
                nsk_group = nsk[0].nsk_group;
                break;
            }
        }
    } else {
        nsk_group = results[0].nsk_group;
    }
    if (nsk_group === null) {
        return;
    }
    pendingUpdates.otherWrites.push(ctx.db.accessPoint.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            knowledge_type: Knowledge.NON_SPECIFIC,
            nsk_group,
        },
    }));
    if (vertex.dse.nssr?.nonSpecificKnowledge.length === 1) {
        delete vertex.dse.nssr;
        pendingUpdates.entryUpdate.nssr = false;
    }
};

export
const removeAttribute: SpecialAttributeDatabaseRemover  = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    delete vertex.dse.nssr;
    pendingUpdates.entryUpdate.nssr = false;
    pendingUpdates.otherWrites.push(ctx.db.accessPoint.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            knowledge_type: Knowledge.NON_SPECIFIC,
        },
    }));
};

export
const countValues: SpecialAttributeCounter = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<number> => {
    return vertex.dse.nssr?.nonSpecificKnowledge?.length ?? 0;
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    return Boolean(vertex.dse.nssr?.nonSpecificKnowledge?.length);
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    const asserted = nonSpecificKnowledge.decoderFor["&Type"]!(value.value);
    if (!asserted.length) {
        return false;
    }
    const possibleMatches = vertex.dse.nssr?.nonSpecificKnowledge
        ?.filter((nsk) => (nsk.length === asserted.length));
    if (!possibleMatches) {
        return false;
    }
    return possibleMatches
        .some((pm) => pm // If there is any possible value for which...
            .every((mosap) => asserted // every access point
                .some((ass) => compareRDNSequence( // is present in the assertion.
                    mosap.ae_title.rdnSequence,
                    ass.ae_title.rdnSequence,
                    getNamingMatcherGetter(ctx),
                ))));
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
