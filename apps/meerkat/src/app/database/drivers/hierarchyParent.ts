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
import { Prisma } from "@prisma/client";
import compareDistinguishedName from "@wildboar/x500/src/lib/comparators/compareDistinguishedName";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter";
import getRDNFromEntryId from "../getRDNFromEntryId";
import {
    UpdateErrorData, _encode_DistinguishedName,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateErrorData.ta";
import {
    UpdateProblem_hierarchyRuleViolation,
    UpdateProblem_parentNotAncestor,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateProblem.ta";
import {
    id_oc_child,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oc-child.va";
import dnToVertex from "../../dit/dnToVertex";
import { stringifyDN } from "../../x500/stringifyDN";
import { distinguishedNameMatch as normalizeDN } from "../../matching/normalizers";
import {
    id_ar_serviceSpecificArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-serviceSpecificArea.va";
import {
    id_ar_autonomousArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-autonomousArea.va";

const CHILD: string = id_oc_child.toString();
const ID_AR_SVC: string = id_ar_serviceSpecificArea.toString();
const ID_AR_AUTONOMOUS: string = id_ar_autonomousArea.toString();

function getServiceAdminPrefix (target: Vertex): Vertex | undefined {
    let i = 0;
    let curr: Vertex | undefined = target;
    while (curr && i < 100_000) {
        i++;
        if (
            curr.dse.admPoint
            && (
                curr.dse.admPoint.administrativeRole.has(ID_AR_SVC)
                || curr.dse.admPoint.administrativeRole.has(ID_AR_AUTONOMOUS)
            )
        ) {
            return curr;
        }
        curr = curr.immediateSuperior;
    }
}

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
    const dn = hierarchyParent.decoderFor["&Type"]!(value.value);
    const parent = await dnToVertex(ctx, ctx.dit.root, dn);
    const signErrors: boolean = false;
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
                undefined,
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
            signErrors,
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
                undefined,
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
        );
    }
    const childsSAA = getServiceAdminPrefix(vertex);
    const parentsSAA = getServiceAdminPrefix(parent);
    if (
        (!!childsSAA !== !!parentsSAA) // parent XOR child is in a service administrative area...
        || ( // ...or both are, but not the same service administrative areas...
            (childsSAA && parentsSAA)
            && (childsSAA.dse.id !== parentsSAA.dse.id)
        )
    ) { // Throw an error, because this is not permitted by ITU Rec. X.501 (2019), Section 10.2.
        throw new UpdateError(
            ctx.i18n.t("err:hierarchy_spans_service_admin_areas"),
            new UpdateErrorData(
                UpdateProblem_hierarchyRuleViolation,
                [
                    {
                        attributeType: hierarchyParent["&id"],
                    },
                ],
                [],
                undefined,
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
        );
    }

    if (!parent.dse.hierarchy) {
        parent.dse.hierarchy = {
            level: 0,
            top_id: parent.dse.id,
            path: `${parent.dse.id}.`,
            top: dn,
        };
    }
    const top = parent.dse.hierarchy.top;
    if (!vertex.dse.hierarchy) {
        vertex.dse.hierarchy = {
            top,
            top_id: parent.dse.hierarchy.top_id,
            parent: dn,
            parent_id: parent.dse.id,
            level: (parent.dse.hierarchy.level + 1),
            path: parent.dse.hierarchy.path + `${vertex.dse.id}.`,
        };
    }

    const top_dn_str: string = normalizeDN(ctx, _encode_DistinguishedName(parent.dse.hierarchy.top, DER))
        ?? stringifyDN(ctx, parent.dse.hierarchy.top);
    const parent_parent_dn_str: string | undefined = parent.dse.hierarchy.parent
        ? normalizeDN(ctx, _encode_DistinguishedName(parent.dse.hierarchy.parent, DER))
            ?? stringifyDN(ctx, parent.dse.hierarchy.parent)
        : undefined;
    const parent_dn_str: string = normalizeDN(ctx, _encode_DistinguishedName(dn, DER))
        ?? stringifyDN(ctx, parent.dse.hierarchy.top);

    pendingUpdates.otherWrites.push(ctx.db.entry.update({
        where: {
            id: parent.dse.id,
        },
        data: {
            hierarchyPath: parent.dse.hierarchy.path,
            hierarchyTopDN: parent.dse.hierarchy.top.map(rdnToJson),
            hierarchyLevel: parent.dse.hierarchy.level,
            hierarchyParent_id: parent.dse.hierarchy.parent_id,
            hierarchyTop_id: parent.dse.hierarchy.top_id,
            hierarchyParentDN: parent.dse.hierarchy.parent?.map(rdnToJson),
            hierarchyParentStr: parent_parent_dn_str,
            hierarchyTopStr: top_dn_str,
        },
        select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
    }));
    pendingUpdates.entryUpdate.hierarchyPath = vertex.dse.hierarchy.path;
    pendingUpdates.entryUpdate.hierarchyTopDN = vertex.dse.hierarchy.top.map(rdnToJson);
    pendingUpdates.entryUpdate.hierarchyLevel = vertex.dse.hierarchy.level;
    pendingUpdates.entryUpdate.hierarchyParent = {
        connect: {
            id: vertex.dse.hierarchy.parent_id,
        },
    };
    pendingUpdates.entryUpdate.hierarchyTop = {
        connect: {
            id: vertex.dse.hierarchy.top_id,
        },
    };
    pendingUpdates.entryUpdate.hierarchyParentDN = vertex.dse.hierarchy.parent?.map(rdnToJson);
    pendingUpdates.entryUpdate.hierarchyParentStr = parent_dn_str;
    pendingUpdates.entryUpdate.hierarchyTopStr = top_dn_str;

    /**
     * If the `hierarchyParent` refers to an in-memory cached DSE for the
     * association that is adding this attribute, it will get added in the
     * database, but the in-memory cache will not be updated.
     *
     * This loop will iterate through the in-memory superiors of `vertex` and
     * update their hierarchy information, which will fix this problem if the
     * vertex is cached for the entry that is adding this attribute. In all
     * other cases, it is assumed that this transient inconsistency is
     * acceptable.
     */
    let v = vertex;
    while (v.immediateSuperior) {
        v = v.immediateSuperior;
        if (v.dse.id === parent.dse.id) {
            v.dse.hierarchy = parent.dse.hierarchy;
            break;
        }
    }
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
    pendingUpdates.entryUpdate.hierarchyTopDN = Prisma.DbNull;
    pendingUpdates.entryUpdate.hierarchyPath = null;
    /**
     * ITU Recommendation X.501 (2016), Section 14.10 states that, when a
     * hierarchical parent is removed, its children are to be removed from _the_
     * hierarchical group. The specification does not make it clear whether they
     * should now belong to separate hierarchical groups with themselves at the top
     * or if we should recursively remove all hierarchical group attributes for all
     * hierarchical descendants. Meerkat DSA puts the children in their own separate
     * hierarchical groups. It is not clear whether this is a deviation from the
     * specification at all. This was chosen because it is the most performant,
     * easiest to implement, and preserves potentially a lot of work from accidental
     * deletion.
     */
    const children = await ctx.db.entry.findMany({
        where: {
            hierarchyParent_id: vertex.dse.id,
            hierarchyPath: {
                not: null,
            },
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
                hierarchyParent_id: null,
                hierarchyPath: child.id.toString() + ".",
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
                        ?.replace(child.hierarchyPath!, `${child.id}.`),
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
