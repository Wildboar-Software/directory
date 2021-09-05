import type {
    Context,
    Vertex,
    SpecialAttributeDatabaseRemover,
    PendingUpdates,
} from "../types";

export const removeObjectClass: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    // Note that schema validation must occur elsewhere.
    vertex.dse.objectClass.clear();
    pendingUpdates.entryUpdate.objectClass = "";
};

export const removeAccessControlScheme: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.entryUpdate.accessControlScheme = null;
};

export const removeAdministrativeRole: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.entryUpdate.administrativeRole = null;
};

export const removeSubtreeSpecification: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.subtreeSpecification.deleteMany({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};
