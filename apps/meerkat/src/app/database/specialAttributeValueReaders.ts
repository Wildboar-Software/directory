import type {
    Context,
    Vertex,
    Value,
    SpecialAttributeDatabaseReader,
} from "../types";
import { BERElement, ObjectIdentifier } from "asn1-ts";
import {
    DER,
    _encodeObjectIdentifier,
} from "asn1-ts/dist/node/functional";
import { objectClass } from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
import { administrativeRole } from "@wildboar/x500/src/lib/modules/InformationFramework/administrativeRole.oa";
import { subtreeSpecification } from "@wildboar/x500/src/lib/modules/InformationFramework/subtreeSpecification.oa";
import { accessControlScheme } from "@wildboar/x500/src/lib/modules/BasicAccessControl/accessControlScheme.oa";

export const readObjectClass: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    return Array.from(vertex.dse.objectClass)
        .map(ObjectIdentifier.fromString)
        .map((oid) => _encodeObjectIdentifier(oid, DER))
        .map((value): Value => ({
            id: objectClass["&id"]!,
            value,
            contexts: new Map(),
        }));
};

export const readAdministrativeRole: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.admPoint?.administrativeRole) {
        return [];
    }
    return Array.from(vertex.dse.admPoint.administrativeRole)
        .map(ObjectIdentifier.fromString)
        .map((oid) => _encodeObjectIdentifier(oid, DER))
        .map((value): Value => ({
            id: administrativeRole["&id"]!,
            value,
            contexts: new Map(),
        }));
}

export const readAccessControlScheme: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.admPoint?.accessControlScheme) {
        return [];
    }
    return [
        {
            id: accessControlScheme["&id"],
            value: _encodeObjectIdentifier(vertex.dse.admPoint.accessControlScheme, DER),
            contexts: new Map(),
        },
    ];
}

export const readSubtreeSpecification: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const entities = await ctx.db.subtreeSpecification.findMany({
        where: {
            entry_id: vertex.dse.id,
        },
        select: {
            ber: true,
        },
    });
    return entities
        .map((entity): Value => {
            const value = new BERElement();
            value.fromBytes(entity.ber);
            return {
                id: subtreeSpecification["&id"],
                value,
                contexts: new Map(),
            };
        });
}
