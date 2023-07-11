import type { Context, PendingUpdates, Vertex } from "@wildboar/meerkat-types";
import {
    HierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/HierarchicalAgreement.ta";
import type {
    SuperiorToSubordinate,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SuperiorToSubordinate.ta";
import {
    SubordinateToSuperior,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SubordinateToSuperior.ta";
import {
    MasterOrShadowAccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterOrShadowAccessPoint.ta";
import {
    MasterOrShadowAccessPoint_category_master,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterOrShadowAccessPoint-category.ta";
import dnToVertex from "../../dit/dnToVertex";
import { Knowledge } from "@prisma/client";
import { DER, _decodeObjectIdentifier } from "asn1-ts/dist/node/functional";
import createEntry from "../../database/createEntry";
import {
    superiorKnowledge,
} from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/superiorKnowledge.oa";
import {
    addValue,
} from "../../database/drivers/superiorKnowledge";
import {
    AccessPoint,
    _encode_AccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import saveAccessPoint from "../../database/saveAccessPoint";
import isFirstLevelDSA from "../../dit/isFirstLevelDSA";
import type {
    OBJECT_CLASS,
} from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
import { INTEGER, OBJECT_IDENTIFIER } from "asn1-ts";
import { SubentryInfo, Vertex as X500Vertex } from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/Vertex.ta";
import readSubordinates from "../../dit/readSubordinates";
import readAttributes from "../../database/entry/readAttributes";
import subentryEIS from "../subentryEIS";
import { MeerkatContext } from "../../ctx";
import getSubschemaSubentry from "../../dit/getSubschemaSubentry";
import { objectClass } from "@wildboar/x500/src/lib/collections/attributes";
import getStructuralObjectClass from "../../x500/getStructuralObjectClass";
import { checkNameForm } from "@wildboar/x500";
import { Attribute } from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import { governingStructureRule } from "@wildboar/x500/src/lib/modules/SchemaAdministration/governingStructureRule.oa";

export
async function createContextPrefixEntry (
    ctx: Context,
    vertex: X500Vertex,
    currentRoot: Vertex,
    last: boolean,
    signErrors: boolean,
    immediateSuperiorInfo?: Attribute[],
): Promise<Vertex> {
    const immSuprAccessPoints = vertex.accessPoints;
    const immSupr: boolean = Boolean(immSuprAccessPoints && last);
    const attributes = last
        ? (immediateSuperiorInfo ?? vertex.admPointInfo ?? [])
        : (vertex.admPointInfo ?? []);

    let gsr: number | undefined = undefined;
    // If the governing structure rule was not present in the context prefix
    // vertex, we have to calculate it.
    if (last && !attributes.some((attr) => attr.type_.isEqualTo(governingStructureRule["&id"]))) {
        const schemaSubentry = await getSubschemaSubentry(ctx, currentRoot);
        // TODO: This next section was copy-pasted a lot. Refactor.
        if (schemaSubentry && (typeof currentRoot.dse.governingStructureRule === "number")) {
            if (!schemaSubentry?.dse.subentry) {
                throw new Error("e41612c3-6239-451f-a971-a9d59bfb5183");
            }
            const objectClasses: OBJECT_IDENTIFIER[] = attributes
                .filter((attr) => attr.type_.isEqualTo(objectClass["&id"]))
                .flatMap((attr) => attr.values)
                .map(_decodeObjectIdentifier);
            const structuralObjectClass = getStructuralObjectClass(ctx, objectClasses);
            const structuralRule = (schemaSubentry.dse.subentry?.ditStructureRules ?? [])
                .find((rule) => {
                    if (rule.obsolete) {
                        return false;
                    }
                    if (!rule.superiorStructureRules?.includes(currentRoot.dse.governingStructureRule!)) {
                        return false;
                    }
                    const nf = ctx.nameForms.get(rule.nameForm.toString());
                    if (!nf) {
                        return false;
                    }
                    if (!nf.namedObjectClass.isEqualTo(structuralObjectClass)) {
                        return false;
                    }
                    if (nf.obsolete) {
                        return false;
                    }
                    return checkNameForm(vertex.rdn, nf.mandatoryAttributes, nf.optionalAttributes);
                });
            gsr = structuralRule
                ? Number(structuralRule.ruleIdentifier)
                : undefined;
        }
    }
    const createdEntry = await createEntry(
        ctx,
        currentRoot,
        vertex.rdn,
        {
            /**
             * NOTE: This defaults to `true` in `createEntry()`.
             *
             * ITU Recommendation X.518 (2019), Section 24.3.1.1 states
             * that, during the establishment of a new HOB, the
             * superior DSA shall create entries...
             *
             * > and, as appropriate, a DSE of type rhob and entry to
             * > represent the immediateSuperiorInfo .
             *
             * It is not clear when the DSE becomes of type `entry`.
             * The hypothetical DIT provided in Annex P of ITU
             * Recommendation X.501 never shows any `immSupr` having
             * type `entry`. I think `entry` should never be used for
             * any entry created in a context prefix.
             */
            entry: false,
            glue: (!immSupr && !vertex.admPointInfo && !vertex.accessPoints),
            rhob: Boolean(vertex.admPointInfo || immSupr),
            immSupr,
            governingStructureRule: gsr,
        },
        attributes,
        undefined,
        signErrors,
    );
    await Promise.all(
        vertex.accessPoints?.map((ap) => saveAccessPoint(
            ctx, ap, Knowledge.SPECIFIC, createdEntry.dse.id)) ?? [],
    );
    if (immSupr) {
        createdEntry.dse.immSupr = {
            specificKnowledge: vertex.accessPoints ?? [],
        };
    }
    for (const subentry of (vertex.subentries ?? [])) {
        await createEntry(
            ctx,
            createdEntry,
            subentry.rdn,
            {
                subentry: true,
                rhob: true,
            },
            subentry.info ?? [],
            [],
        );
    }
    return createdEntry;
}

/**
 * @summary Create the necessary DSEs to establish a new context prefix
 * @description
 *
 * This functions makes the local DSA a subordinate within a hierarchical
 * operational binding. That is, it creates all of the DSEs (or just leaves them
 * alone if they already exist) from the Root DSE all the way down to the new
 * context prefix.
 *
 * @param ctx The context object
 * @param superiorAccessPoint The superior DSA's access point
 * @param agreement The hierarchical agreement
 * @param sup2sub The `SuperiorToSubordinate` argument of the HOB
 * @param structuralObjectClass The structural object class of the context prefix
 * @param cp_gsr The governing structure rule of the context prefix
 * @param signErrors Whether to cryptographically sign errors
 * @returns A `SubordinateToSuperior` that can be returned to the superior DSA
 *  in a Directory Operational Binding Management Protocol (DOP) result
 *
 * @function
 * @async
 */
export
async function becomeSubordinate (
    ctx: MeerkatContext,
    superiorAccessPoint: AccessPoint,
    agreement: HierarchicalAgreement,
    sup2sub: SuperiorToSubordinate,
    structuralObjectClass: OBJECT_CLASS["&id"],
    cp_gsr: INTEGER | undefined,
    signErrors: boolean,
): Promise<SubordinateToSuperior> {
    let currentRoot = ctx.dit.root;
    for (let i = 0; i < sup2sub.contextPrefixInfo.length; i++) {
        const vertex = sup2sub.contextPrefixInfo[i];
        const last: boolean = (sup2sub.contextPrefixInfo.length === (i + 1));
        const existingEntry = await dnToVertex(ctx, currentRoot, [ vertex.rdn ]);
        if (!existingEntry) {
            const createdEntry = await createContextPrefixEntry(ctx, vertex, currentRoot, last, signErrors, sup2sub.immediateSuperiorInfo);
            currentRoot = createdEntry;
        } else {
            /**
             * In theory, this entry being of type "glue" should mean that it
             * has no attributes, and therefore, there should be no problem with
             * fully replacing it.
             *
             * Ideally, creating the entry and swapping it should be done as a
             * transaction, but unfortunately, this cannot be with Meerkat DSA!
             */
            if (existingEntry.dse.glue) {
                const createdEntry = await createContextPrefixEntry(ctx, vertex, currentRoot, last, signErrors, sup2sub.immediateSuperiorInfo);
                await ctx.db.entry.updateMany({
                    where: {
                        immediate_superior_id: existingEntry.dse.id,
                    },
                    data: {
                        immediate_superior_id: createdEntry.dse.id,
                    },
                });
            } else if (last) { // The superior DSA may update access points on the immSupr
                /* While we don't touch the existing DSE to avoid corrupting its
                information, we do have to set the governing structure rule, if
                it is unset, because the ability to add subordinates beneath
                this entry is contingent upon there being a governing structure
                rule. */
                const supplied_gsr: INTEGER | undefined = [
                    ...sup2sub.immediateSuperiorInfo ?? [],
                    ...vertex.admPointInfo ?? [],
                ].find((attr) => attr.type_.isEqualTo(governingStructureRule["&id"]))?.values?.[0]?.integer;
                const gsr = supplied_gsr !== undefined
                    ? Number(supplied_gsr)
                    : undefined;
                await ctx.db.entry.update({
                    where: {
                        id: existingEntry.dse.id,
                    },
                    data: {
                        immSupr: true,
                        rhob: sup2sub.immediateSuperiorInfo ? true : undefined,
                        governingStructureRule: gsr,
                    },
                });
                existingEntry.dse.immSupr = {
                    specificKnowledge: vertex.accessPoints ?? [],
                };
                if (gsr !== undefined) {
                    existingEntry.dse.governingStructureRule = gsr;
                }
                await Promise.all(
                    vertex.accessPoints
                        ?.map((ap) => saveAccessPoint(
                            ctx,
                            ap,
                            Knowledge.SPECIFIC,
                            existingEntry.dse.id,
                        )) ?? [],
                );
            }
            currentRoot = existingEntry;
        }
    }
    const itinerantDN = [ ...agreement.immediateSuperior, agreement.rdn ];
    const existing = await dnToVertex(ctx, ctx.dit.root, itinerantDN);
    const immediateSuperior = currentRoot;

    // If the governing structure rule for the new CP was not supplied in the
    // HOB attributes, we have to calculate it.
    if (cp_gsr === undefined) {
        const schemaSubentry = await getSubschemaSubentry(ctx, immediateSuperior);
        if (schemaSubentry && (typeof immediateSuperior.dse.governingStructureRule === "number")) {
            if (!schemaSubentry?.dse.subentry) {
                throw new Error("e41612c3-6239-451f-a971-a9d59bfb5183");
            }
            const objectClasses: OBJECT_IDENTIFIER[] = (sup2sub.entryInfo ?? [])
                .filter((attr) => attr.type_.isEqualTo(objectClass["&id"]))
                .flatMap((attr) => attr.values)
                .map(_decodeObjectIdentifier);
            const structuralObjectClass = getStructuralObjectClass(ctx, objectClasses);
            const structuralRule = (schemaSubentry.dse.subentry?.ditStructureRules ?? [])
                .find((rule) => {
                    if (rule.obsolete) {
                        return false;
                    }
                    if (!rule.superiorStructureRules?.includes(immediateSuperior.dse.governingStructureRule!)) {
                        return false;
                    }
                    const nf = ctx.nameForms.get(rule.nameForm.toString());
                    if (!nf) {
                        return false;
                    }
                    if (!nf.namedObjectClass.isEqualTo(structuralObjectClass)) {
                        return false;
                    }
                    if (nf.obsolete) {
                        return false;
                    }
                    return checkNameForm(agreement.rdn, nf.mandatoryAttributes, nf.optionalAttributes);
                });
            cp_gsr = structuralRule
                ? Number(structuralRule.ruleIdentifier)
                : undefined;
        }
    }
    const createdCP = await createEntry(
        ctx,
        currentRoot,
        agreement.rdn,
        {
            entry: true,
            cp: true,
            immSupr: false, // This is supposed to be on the superior of this entry.
            structuralObjectClass: structuralObjectClass.toString(),
            governingStructureRule: cp_gsr !== undefined
                ? Number(cp_gsr)
                : cp_gsr,
        },
        sup2sub.entryInfo ?? [],
        undefined,
        signErrors,
    );
    /**
     * These steps below "swap out" an existing entry with the entry created by
     * the HOB, keeping the immediate superior and the subordinates the same in
     * the process.
     *
     * Note that this does NOT throw an error when the entry already exists.
     * This is so Meerkat DSA can do what is called "Subordinate Repatriation."
     * When an HOB is terminated, the subordinate's entries are not deleted.
     * They are kept, and the HOB is simply never updated again. Once a new HOB
     * is established with the same context prefix, the existing entry, and all
     * of its subordinates are "repatriated," so that an expired or deleted HOB
     * can "pick up where it left off."
     */
    if (existing) {
        await ctx.db.$transaction([
            ctx.db.entry.updateMany({
                where: {
                    immediate_superior_id: existing.dse.id,
                },
                data: {
                    immediate_superior_id: createdCP.dse.id,
                },
            }),
            ctx.db.entry.update({
                where: {
                    id: existing.dse.id,
                },
                data: {
                    deleteTimestamp: new Date(),
                },
                select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
            }),
        ]);
        // Take on the subordinates of the existing entry.
        createdCP.subordinates = existing.subordinates;
        // Set the existing entry's subordinates to `null`, just to free up a reference.
        existing.subordinates = null;
        if (existing.immediateSuperior?.subordinates?.length) {
            // Remove the existing entry from its parent.
            existing.immediateSuperior.subordinates = existing
                .immediateSuperior
                .subordinates
                .filter((sub) => sub.dse.id !== existing.dse.id);
            // Add the new entry to the subordinates.
            existing.immediateSuperior.subordinates.push(createdCP);
        }
    }

    const firstLevel: boolean = await isFirstLevelDSA(ctx);
    if (!firstLevel) { // Update superiorKnowledge
        const pendingUpdates: PendingUpdates = {
            entryUpdate: {},
            otherWrites: [],
        };
        await addValue(ctx, ctx.dit.root, {
            type: superiorKnowledge["&id"],
            value: _encode_AccessPoint(superiorAccessPoint, DER),
        }, pendingUpdates);
        await ctx.db.$transaction([
            ctx.db.entry.update({
                where: {
                    id: ctx.dit.root.dse.id,
                },
                data: {
                    ...pendingUpdates.entryUpdate,
                },
                select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
            }),
            ...pendingUpdates.otherWrites,
        ]);
    }

    const subentryInfos: SubentryInfo[] = [];
    const subordinates = await readSubordinates(ctx, createdCP, undefined, undefined, undefined, {
        subentry: true,
    });
    subentryInfos.push(
        ...await Promise.all(
            subordinates
                .filter((sub) => sub.dse.subentry)
                .map(async (sub): Promise<SubentryInfo> => {
                    const {
                        userAttributes,
                        operationalAttributes,
                    } = await readAttributes(ctx, sub, {
                        selection: subentryEIS,
                    });
                    return new SubentryInfo(
                        sub.dse.rdn,
                        [
                            ...userAttributes,
                            ...operationalAttributes,
                        ],
                    );
                }),
        ),
    );

    const myAccessPoint = ctx.dsa.accessPoint;
    return new SubordinateToSuperior(
        [
            new MasterOrShadowAccessPoint(
                myAccessPoint.ae_title,
                myAccessPoint.address,
                myAccessPoint.protocolInformation,
                MasterOrShadowAccessPoint_category_master, // Could not be otherwise.
                false,
            ),
            /** REVIEW:
             * ITU Recommendation X.518 (2016), Section 23.1.2, says that:
             *
             * > The values of the consumerKnowledge and secondaryShadows (both
             * > held in the subordinate context prefix DSE) are used to form
             * > additional elements in accessPoints with category having the
             * > value shadow.
             *
             * But the context prefix is newly created by the operation itself,
             * so how could it possibly have shadows at that time?
             */
        ],
        Boolean(createdCP.dse.alias),
        sup2sub.entryInfo,
        /* In theory, there should be no subentries underneath a new context
        prefix, but Meerkat DSA does not delete context prefixes when an
        operational binding terminates so they can be "repatriated." That means
        that we need to check for subentry information. */
        (subentryInfos.length > 0)
            ? subentryInfos
            : undefined,
    );
}

export default becomeSubordinate;
