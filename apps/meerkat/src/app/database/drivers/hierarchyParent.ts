import {
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
    UpdateError,
} from "@wildboar/meerkat-types";
import { DER } from "asn1-ts/dist/node/functional";
import rdnToJson from "../../x500/rdnToJson";
import {
    hierarchyParent,
} from "@wildboar/x500/src/lib/modules/InformationFramework/hierarchyParent.oa";
import findEntry from "../../x500/findEntry";
import getDistinguishedName from "../../x500/getDistinguishedName";
import { Prisma } from "@prisma/client";
import compareDistinguishedName from "@wildboar/x500/src/lib/comparators/compareDistinguishedName";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter";
import getRDNFromEntryId from "../getRDNFromEntryId";
import sleep from "../../utils/sleep";
import { randomInt } from "crypto";
import {
    updateError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/updateError.oa";
import {
    UpdateErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateErrorData.ta";
import {
    UpdateProblem_hierarchyRuleViolation,
    UpdateProblem_parentNotAncestor,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateProblem.ta";
import {
    id_oc_child,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oc-child.va";
import createSecurityParameters from "../../x500/createSecurityParameters";
import rdnFromJson from "../../x500/rdnFromJson";

const CHILD: string = id_oc_child.toString();

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.hierarchy?.parent) {
        return [];
    }
    return [
        {
            type: hierarchyParent["&id"],
            value: hierarchyParent.encoderFor["&Type"]!(vertex.dse.hierarchy.parent, DER),
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
    /**
     * Since there is no access control evaluation here (pertaining to the
     * users' permission to know about the hierarchical parent), we randomize
     * the response time slightly to stifle timing attacks. Despite throwing a
     * non-descript error, the timing could be used by a nefarious user to
     * enumerate entries in the database.
     */
    if (!ctx.config.bulkInsertMode) {
        await sleep(randomInt(1000));
    }
    const dn = hierarchyParent.decoderFor["&Type"]!(value.value);
    const parent = await findEntry(ctx, ctx.dit.root, dn);
    if (!parent) {
        // Hierarchical groups are required to be within a single DSA.
        throw new UpdateError(
            ctx.i18n.t("err:no_such_hierarchy_parent"),
            new UpdateErrorData(
                UpdateProblem_hierarchyRuleViolation,
                [
                    {
                        attributeType: hierarchyParent["&id"],
                    },
                ],
                [],
                createSecurityParameters(
                    ctx,
                    undefined,
                    undefined,
                    updateError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
        );
    }
    if (parent.dse.objectClass.has(CHILD)) {
        throw new UpdateError(
            ctx.i18n.t("err:parent_not_ancestor"),
            new UpdateErrorData(
                UpdateProblem_parentNotAncestor,
                [
                    {
                        attributeType: hierarchyParent["&id"],
                    },
                ],
                [],
                createSecurityParameters(
                    ctx,
                    undefined,
                    undefined,
                    updateError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
        );
    }
    if (!parent.dse.hierarchy) {
        parent.dse.hierarchy = {
            level: 0,
        };
    }
    const top = parent.dse.hierarchy?.top
        ? parent.dse.hierarchy.top
        : getDistinguishedName(parent);
    if (!vertex.dse.hierarchy) {
        vertex.dse.hierarchy = {
            top,
            parent: dn,
            level: (parent.dse.hierarchy.level + 1),
        };
    }
    const parentRow = await ctx.db.entry.findUnique({
        where: {
            id: parent.dse.id,
        },
        select: {
            hierarchyPath: true,
            hierarchyParentDN: true,
        },
    });
    pendingUpdates.entryUpdate.hierarchyParentDN = dn.map(rdnToJson);
    pendingUpdates.entryUpdate.hierarchyLevel = (parent.dse.hierarchy.level + 1);
    pendingUpdates.entryUpdate.hierarchyTopDN = top.map(rdnToJson);
    pendingUpdates.entryUpdate.hierarchyPath = parentRow?.hierarchyPath
        ? parentRow.hierarchyPath + `.${vertex.dse.id}`
        : vertex.dse.id.toString();
    pendingUpdates.otherWrites.push(ctx.db.entry.update({
        where: {
            id: parent.dse.id,
        },
        data: {
            hierarchyLevel: parent.dse.hierarchy.level ?? 0,
            hierarchyPath: parentRow?.hierarchyPath ?? parent.dse.id.toString(),
            hierarchyTopDN: top.map(rdnToJson),
            // hierarchyParentDN: Array.isArray(parent.dse.hierarchy.parent)
            //     ? parent.dse.hierarchy.parent.map(rdnToJson)
            //     : undefined,
        },
    }));
    parent.dse.hierarchy = {
        top,
        level: parent.dse.hierarchy.level ?? 0,
        parent: Array.isArray(parentRow?.hierarchyParentDN)
            ? parentRow!.hierarchyParentDN.map(rdnFromJson)
            : undefined,
    };
    pendingUpdates.entryUpdate.hierarchyParent = {
        connect: {
            id: parent.dse.id,
        },
    };
};

export
const removeValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    if (!vertex.dse.hierarchy?.parent) {
        return;
    }
    const matches: boolean = compareDistinguishedName(
        vertex.dse.hierarchy.parent,
        hierarchyParent.decoderFor["&Type"]!(value.value),
        getNamingMatcherGetter(ctx),
    );
    if (!matches) {
        return;
    }
    return removeAttribute(ctx, vertex, pendingUpdates);
};

export
const removeAttribute: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.entryUpdate.hierarchyParent = {
        disconnect: true,
    };
    pendingUpdates.entryUpdate.hierarchyParentDN = Prisma.DbNull;
    pendingUpdates.entryUpdate.hierarchyLevel = null;
    pendingUpdates.entryUpdate.hierarchyTopDN = Prisma.DbNull;
    pendingUpdates.entryUpdate.hierarchyPath = null;
    // REVIEW: Set the subordinates as tops or delete?
    // ITU X.501 says that when you remove an entry, all of its HC should be removed from the HG.
    // Still, just changing the children to hierarchical tops preserves what could be a lot of work.
    const children = await ctx.db.entry.findMany({
        where: {
            hierarchyParent_id: vertex.dse.id,
        },
        select: {
            id: true,
            hierarchyPath: true,
        },
    });
    for (const child of children) {
        // Update the immediate children materialized paths.
        pendingUpdates.otherWrites.push(ctx.db.entry.updateMany({
            where: {
                id: child.id,
            },
            data: {
                hierarchyTopDN: Prisma.DbNull,
                hierarchyParentDN: Prisma.DbNull,
                hierarchyLevel: 0,
                hierarchyParent_id: null,
                hierarchyPath: child.id.toString(),
            },
        }));
        const childRDN = await getRDNFromEntryId(ctx, child.id);
        // Find the children of the children.
        const descendants = await ctx.db.entry.findMany({
            where: {
                hierarchyPath: {
                    startsWith: `${child.hierarchyPath}.`,
                },
            },
            select: {
                id: true,
                hierarchyPath: true,
                hierarchyLevel: true,
            },
        });
        // REVIEW: Should this be done outside of the transaction, just so
        // we don't hit some limit on the number of changes in a transaction?
        // Update their materialized paths.
        pendingUpdates.otherWrites.push(
            ...descendants.map((descendant) => ctx.db.entry.updateMany({
                where: {
                    id: descendant.id,
                },
                data: {
                    hierarchyTopDN: [ rdnToJson(childRDN) ],
                    hierarchyPath: descendant.hierarchyPath
                        ?.replace(`${child.hierarchyPath}.`, `${child.id}.`),
                    hierarchyLevel: (
                        1 // The child ID itself is removed from the path in the subtraction.
                        + (descendant.hierarchyPath?.split(".").length ?? 0)
                        - (child.hierarchyPath?.split(".").length ?? 0)
                    ),
                },
            })),
        );
    }
    // Actually, below is not in the database: it is calculated on the fly, so
    // there is no need to update the database as below.
    // const vertexRow = await ctx.db.entry.findUnique({
    //     where: {
    //         id: vertex.dse.id,
    //     },
    //     select: {
    //         hierarchyParent_id: true,
    //     },
    // });
    // if (vertexRow?.hierarchyParent_id) {
    //     const siblingsCount: number = (await ctx.db.entry.count({
    //         where: {
    //             hierarchyParent_id: vertexRow.hierarchyParent_id,
    //         },
    //     })) - 1; // -1 to not count the target entry itself.
    //     if (siblingsCount === 0) {
    //         await ctx.db.entry.update({
    //             where: {
    //                 id: vertexRow.hierarchyParent_id,
    //             },
    //             data: {
    //                 hier
    //             },
    //         });
    //     }
    // } // The "else" case should never happen.
};

export
const countValues: SpecialAttributeCounter = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<number> => {
    return vertex.dse.hierarchy?.parent ? 1 : 0;
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    return Boolean(vertex.dse.hierarchy?.parent);
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    if (!vertex.dse.hierarchy?.parent) {
        return false;
    }
    return compareDistinguishedName(
        vertex.dse.hierarchy.parent,
        hierarchyParent.decoderFor["&Type"]!(value.value),
        getNamingMatcherGetter(ctx),
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
