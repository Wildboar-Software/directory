import { MeerkatContext } from "../../ctx";
import { Vertex, Context, ShadowError, Value } from "@wildboar/meerkat-types";
import {
    UpdateShadowArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/UpdateShadowArgument.ta";
import {
    UpdateShadowResult,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/UpdateShadowResult.ta";
import DISPAssociation from "../DISPConnection";
import { verifySIGNED } from "../../pki/verifySIGNED";
import {
    _encode_UpdateShadowArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/UpdateShadowArgumentData.ta";
import { InvokeId } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/InvokeId.ta";
import { Versions_v2 } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/Versions.ta";
import {
    TRUE_BIT,
    FALSE,
    BERElement,
    BIT_STRING,
    FALSE_BIT,
    ObjectIdentifier,
    DERElement,
    ASN1TagClass,
    ASN1Construction,
    ASN1UniversalType,
    ASN1Element,
} from "asn1-ts";
import {
    compareDistinguishedName,
    dnWithinSubtreeSpecification,
    getOptionallyProtectedValue,
    getRDN,
    objectClassesWithinRefinement,
} from "@wildboar/x500";
import {
    id_op_binding_shadow,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-shadow.va";
import { ShadowErrorData } from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/ShadowErrorData.ta";
import {
    ShadowProblem_invalidAgreementID,
    ShadowProblem_updateAlreadyReceived,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/ShadowProblem.ta";
import createSecurityParameters from "../../x500/createSecurityParameters";
import {
    id_errcode_shadowError,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-errcode-shadowError.va";
import {
    ShadowProblem_unsupportedStrategy,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/ShadowProblem.ta";
import {
    ShadowingAgreementInfo,
    _decode_AccessPoint,
    _decode_ShadowingAgreementInfo,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/ShadowingAgreementInfo.ta";
import dnToVertex from "../../dit/dnToVertex";
import { becomeShadowConsumer } from "../../dop/establish/becomeShadowConsumer";
import {
    OperationalBindingID,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OperationalBindingID.ta";
import {
    Subtree,
    TotalRefresh,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/TotalRefresh.ta";
import {
    IncrementalStepRefresh,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/IncrementalStepRefresh.ta";
import {
    SDSEType
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/SDSEType.ta";
import {
    DSEType,
    DSEType_shadow,
    DSEType_admPoint,
    DSEType_alias,
    DSEType_cp,
    DSEType_entry,
    DSEType_glue,
    DSEType_nssr,
    DSEType_sa,
    DSEType_subentry,
    DSEType_subr,
} from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/DSEType.ta";
import deleteEntry from "../../database/deleteEntry";
import { stripEntry } from "../../database/stripEntry";
import { Attribute } from "@wildboar/pki-stub/src/lib/modules/InformationFramework/Attribute.ta";
import { dseType } from "@wildboar/x500/src/lib/collections/attributes";
import { DER } from "asn1-ts/dist/node/functional";
import addAttributes from "../../database/entry/addAttributes";
import bPromise from "bluebird";
import { LocalName } from "@wildboar/x500/src/lib/modules/InformationFramework/LocalName.ta";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter";
import readSubordinates from "../../dit/readSubordinates";
import { Refinement } from "@wildboar/x500/src/lib/modules/InformationFramework/Refinement.ta";
import { Prisma } from "@prisma/client";
import createEntry from "../../database/createEntry";
import stringifyDN from "../../x500/stringifyDN";
import { ContentChange } from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/ContentChange.ta";
import rdnToID from "../../dit/rdnToID";
import { renameEntry } from "../../database/renameEntry";
import removeAttribute from "../../database/entry/removeAttribute";
import addValues from "../../database/entry/addValues";
import { EntryModification } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryModification.ta";
import valuesFromAttribute from "../../x500/valuesFromAttribute";
import removeValues from "../../database/entry/removeValues";
import readValuesOfType from "../../utils/readValuesOfType";
import { isAcceptableTypeForAlterValues } from "../../distributed/modifyEntry";

/**
 * @summary Convert an SDSEType into its equivalent DSEType
 * @description
 *
 * Convert an `SDSEType` into its equivalent `DSEType`.
 *
 * [ITU Recommendation X.525 (2019)](https://www.itu.int/rec/T-REC-X.525/en),
 * Section 7.2.1.1 states that SDSEType may only contain the following options:
 *
 * - `root`
 * - `glue`
 * - `cp`
 * - `entry`
 * - `alias`
 * - `subr`
 * - `nssr`
 * - `admPoint`
 * - `subentry`
 * - `sa`
 *
 * @param t The SDSE Type to be converted
 * @returns A `DSEType`
 *
 * @function
 */
function sdse_type_to_dse_type (t: SDSEType): DSEType {
    const ret: BIT_STRING = new Uint8ClampedArray(18); // 18 because this cannot be a ditBridge.
    ret[DSEType_shadow] = t[DSEType_shadow] ?? FALSE_BIT;
    // Commented out because I don't think this is supported, and those code path will ever be taken...
    // ret[DSEType_root] = t[DSEType_root] ?? FALSE_BIT;
    ret[DSEType_glue] = t[DSEType_glue] ?? FALSE_BIT;
    ret[DSEType_cp] = t[DSEType_cp] ?? FALSE_BIT;
    ret[DSEType_entry] = t[DSEType_entry] ?? FALSE_BIT;
    ret[DSEType_alias] = t[DSEType_alias] ?? FALSE_BIT;
    ret[DSEType_subr] = t[DSEType_subr] ?? FALSE_BIT;
    ret[DSEType_nssr] = t[DSEType_nssr] ?? FALSE_BIT;
    ret[DSEType_admPoint] = t[DSEType_admPoint] ?? FALSE_BIT;
    ret[DSEType_subentry] = t[DSEType_subentry] ?? FALSE_BIT;
    ret[DSEType_sa] = t[DSEType_sa] ?? FALSE_BIT;
    return ret;
}

const MAX_DEPTH: number = 10_000;

export
function convert_refinement_to_prisma_filter (ref: Refinement): Partial<Prisma.EntryWhereInput> {
    if ("item" in ref) {
        return {
            EntryObjectClass: {
                some: {
                    object_class: ref.item.toString(),
                },
            },
        };
    }
    else if ("and" in ref) {
        return {
            AND: ref.and.map(convert_refinement_to_prisma_filter),
        };
    }
    else if ("or" in ref) {
        return {
            AND: ref.or.map(convert_refinement_to_prisma_filter),
        };
    }
    else if ("not" in ref) {
        return {
            NOT: convert_refinement_to_prisma_filter(ref.not),
        };
    }
    else {
        return {};
    }
}

// TODO: It may be possible to separate the validation from the update.
// NOTE: minimum of subtree does not need to be checked. It is forbidden in shadowing subtrees.
async function applyTotalRefresh (
    ctx: Context,
    vertex: Vertex,
    refresh: TotalRefresh,
    agreement: ShadowingAgreementInfo,
    depth: number,
    signErrors: boolean,
    localName: LocalName,
): Promise<void> { // TODO: Maybe return the DN of the problematic DSE, if any?

    // Skip over everything up until we reach the base of the shadowed subtree.
    const cp_length = agreement.shadowSubject.area.contextPrefix.length;
    const base = agreement.shadowSubject.area.replicationArea.base ?? [];
    if (depth < (cp_length + base.length)) {
        // In the future, this may be relaxed.
        if (!refresh.subtree || (refresh.subtree.length !== 1)) {
            throw new Error();
        }
        const sub = await dnToVertex(ctx, vertex, [ refresh.subtree[0].rdn ]);
        if (!sub) {
            throw new Error();
        }
        return applyTotalRefresh(ctx, sub, refresh.subtree[0], agreement, depth + 1, signErrors, []);
    }

    const namingMatcher = getNamingMatcherGetter(ctx);
    let is_chopped_before: boolean = false;
    const is_chopped = agreement.shadowSubject.area.replicationArea.specificExclusions
        ?.some((chop) => {
            let chopBefore: boolean = true;
            let chopName: LocalName = [];
            if ("chopBefore" in chop) {
                chopName = chop.chopBefore;
            } else if ("chopAfter" in chop) {
                chopBefore = false;
                chopName = chop.chopAfter;
            }
            if (compareDistinguishedName(chopName, localName, namingMatcher)) {
                is_chopped_before = chopBefore;
                return true;
            }
            return false;
        })
        ?? false;

    if (is_chopped && is_chopped_before) {
        return; // We don't process this DSE.
    }

    if (!refresh.sDSE) {
        return deleteEntry(ctx, vertex, true);
    }
    await stripEntry(ctx, vertex);
    const dse_type = sdse_type_to_dse_type(refresh.sDSE.sDSEType);
    const promises = await addAttributes(ctx, vertex, [
        ...refresh.sDSE.attributes,
        new Attribute(
            dseType["&id"],
            [dseType.encoderFor["&Type"]!(dse_type, DER)],
        ),
    ], undefined, false, signErrors);
    // TODO: Can I put the promises from stripEntry() in the transaction below?
    await ctx.db.$transaction([
        ...promises,
        ctx.db.entry.update({
            where: {
                id: vertex.dse.id,
            },
            data: {
                subordinate_completeness: refresh.sDSE.subComplete ?? FALSE,
                attribute_completeness: refresh.sDSE.attComplete,
            },
        }),
        ctx.db.entryAttributeValuesIncomplete.createMany({
            data: refresh.sDSE.attValIncomplete?.map((oid) => ({
                entry_id: vertex.dse.id,
                attribute_type: oid.toString(),
            })) ?? [],
        }),
    ]);
    const max = agreement.shadowSubject.area.replicationArea.maximum;
    const max_depth = Math.min(cp_length + Number(max ?? MAX_DEPTH), MAX_DEPTH);
    if (depth >= max_depth) {
        return;
    }

    if (is_chopped && !is_chopped_before) {
        return; // We don't process this DSE's subordinates.
    }

    if (!refresh.subtree || (refresh.subtree.length === 0)) {
        // Optimization: delete all subordinates.
        await ctx.db.entry.deleteMany({
            where: {
                immediate_superior_id: vertex.dse.id,
            },
        });
        return;
    }

    const refinement = agreement.shadowSubject.area.replicationArea.specificationFilter;
    const processed_subordinate_ids: Set<number> = new Set();
    await bPromise.map(refresh.subtree, async (subtree: Subtree) => {
        const sub = await dnToVertex(ctx, vertex, [ subtree.rdn ]);
        if (!sub) {
            return;
        }
        const objectClasses = Array.from(sub.dse.objectClass).map(ObjectIdentifier.fromString);
        if (refinement && !objectClassesWithinRefinement(objectClasses, refinement)) {
            throw new Error(); // FIXME:
        }
        processed_subordinate_ids.add(sub.dse.id);
        return applyTotalRefresh(ctx, sub, subtree, agreement, depth + 1, signErrors, [ ...localName, sub.dse.rdn ]);
    }, {
        concurrency: 4, // FIXME:
    });

    /* What follows is removing all shadow DSEs that fall within the agreement
    but were not explicitly mentioned in the TotalRefresh. */
    let cursorId: number | undefined;
    const getNextBatchOfUnmentionedSubordinates = () => {
        return readSubordinates(ctx, vertex, 100, undefined, cursorId, { // TODO: Configurable page size.
            id: {
                notIn: Array.from(processed_subordinate_ids),
            },
            shadow: true,
            ...(refinement
                ? {
                    OR: [
                        { // Subentries are exempt from refinement, even though it is not said explicitly in X.525.
                            subentry: true,
                        },
                        convert_refinement_to_prisma_filter(refinement),
                    ]
                }
                : {})
        });
    }
    let subordinates: Vertex[] = await getNextBatchOfUnmentionedSubordinates();
    const deletion_refresh = new TotalRefresh(undefined, undefined);
    while (subordinates.length > 0) {
        /* Why not just use `.deleteMany()`? Because the subordinates also have
        to be evaluated for whether they fall within or without the specific
        exclusions of the subtree. Theoretically, this could still be done using
        their RDNs alone, but simple recursion was by far the most elegant
        solution. */
        await bPromise.map(subordinates, (subordinate: Vertex) => applyTotalRefresh(
            ctx,
            subordinate,
            deletion_refresh,
            agreement,
            depth + 1,
            signErrors,
            [ ...localName, subordinate.dse.rdn ],
        ), {
            concurrency: 4, // FIXME:
        });
        const last_subordinate = subordinates[subordinates.length - 1];
        cursorId = last_subordinate?.dse.id;
        subordinates = await getNextBatchOfUnmentionedSubordinates();
    }
}

async function replaceAttribute (
    ctx: Context,
    vertex: Vertex,
    attr: Attribute,
    signErrors: boolean,
): Promise<any> {
    return ctx.db.$transaction([
        ...(await removeAttribute(ctx, vertex, attr.type_)),
        ...(await addAttributes(ctx, vertex, [ attr ], undefined, false, signErrors)),
    ]);
}

// This is a modification of a similarly-named function in `modifyEntry`.
function getValueAlterer (toBeAddedElement: ASN1Element): (value: Value) => Value {
    const toBeAdded = (toBeAddedElement.tagNumber === ASN1UniversalType.integer)
        ? Number(toBeAddedElement.integer)
        : toBeAddedElement.real;
    return (value: Value): Value => {
        if (!isAcceptableTypeForAlterValues(value.value)) {
            return value;
        }
        if (value.value.tagNumber !== toBeAddedElement.tagNumber) {
            return value;
        }
        const currentValue = (value.value.tagNumber === ASN1UniversalType.integer)
            ? Number(value.value.integer)
            : value.value.real;
        return {
            ...value,
            value: new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                value.value.tagNumber,
                (currentValue + toBeAdded),
            ),
        };
    };
}

async function applyEntryModification (
    ctx: Context,
    vertex: Vertex,
    mod: EntryModification,
    signErrors: boolean,
): Promise<any[]> {
    if ("addAttribute" in mod) {
        return ctx.db.$transaction(await addAttributes(ctx, vertex, [ mod.addAttribute ], undefined, false, signErrors));
    }
    else if ("removeAttribute" in mod) {
        return ctx.db.$transaction(await removeAttribute(ctx, vertex, mod.removeAttribute));
    }
    else if ("addValues" in mod) {
        return ctx.db.$transaction(await addValues(ctx, vertex, valuesFromAttribute(mod.addValues), undefined, false, signErrors));
    }
    else if ("removeValues" in mod) {
        return ctx.db.$transaction(await removeValues(ctx, vertex, valuesFromAttribute(mod.removeValues)));
    }
    else if ("alterValues" in mod) {
        const alterer = getValueAlterer(mod.alterValues.value);
        const values = await readValuesOfType(ctx, vertex, mod.alterValues.type_);
        const newValues = values.map(alterer);
        return ctx.db.$transaction([
            ...(await removeValues(ctx, vertex, values)),
            ...(await addValues(ctx, vertex, newValues, undefined, true, signErrors)),
        ]);
    }
    else if ("resetValue" in mod) {
        // This is not incorrect. Contexts are only maintained for userApplications
        // attribute types, so this mod can just delete right from this table.
        return ctx.db.$transaction([
            ctx.db.attributeValue.deleteMany({
                where: {
                    entry_id: vertex.dse.id,
                    type_oid: mod.resetValue.toBytes(),
                    ContextValue: {
                        some: {
                            fallback: false,
                        },
                    },
                },
            }),
        ]);
    }
    else if ("replaceValues" in mod) {
        return ctx.db.$transaction([
            ...(await removeAttribute(ctx, vertex, mod.replaceValues.type_)),
            // Second to last argument to addValues() is false, because we don't want to check
            // if the potentially added values already exist, because we are just
            // going to wipe out all that exist and replace them.
            ...(await addValues(ctx, vertex, valuesFromAttribute(mod.replaceValues), undefined, false, signErrors)),
        ])
    }
    else {
        return []; // Any other alternative not understood.
    }
}

async function applyContentChange (
    ctx: Context,
    vertex: Vertex,
    change: ContentChange,
    localName: LocalName,
    agreement: ShadowingAgreementInfo,
    obid: OperationalBindingID,
    signErrors: boolean,
): Promise<void> {
    if (change.rename) {
        const cp = agreement.shadowSubject.area.contextPrefix;
        const oldDN = [ ...cp, ...localName ];
        const newDN = ("newRDN" in change.rename)
            ? [ ...cp, ...localName.slice(0, -1), change.rename.newRDN ]
            : change.rename.newDN;
        const newRDN = getRDN(newDN);
        if (!newRDN) {
            throw new Error(); // FIXME:
        }
        if (newRDN.length === 0) {
            throw new Error(); // FIXME:
        }
        const objectClasses = Array.from(vertex.dse.objectClass).map(ObjectIdentifier.fromString);
        const subtree = agreement.shadowSubject.area.replicationArea;
        const namingMatcher = getNamingMatcherGetter(ctx);
        if (!dnWithinSubtreeSpecification(newDN, objectClasses, subtree, cp, namingMatcher)) {
            ctx.log.error(ctx.i18n.t("log:sdse_rename_not_agreed_upon", {
                old_dn: stringifyDN(ctx, oldDN),
                new_dn: stringifyDN(ctx, newDN),
                obid: obid.identifier.toString(),
            }));
            throw new Error(); // FIXME:
        }
        const new_superior = await dnToVertex(ctx, ctx.dit.root, newDN.slice(0, -1));
        if (!new_superior) {
            throw new Error();
        }
        const existingEntry = await rdnToID(ctx, new_superior.dse.id, newRDN);
        if (existingEntry) {
            throw new Error(); // FIXME:
        }
        await renameEntry(ctx, vertex, new_superior, newRDN);
    }
    if (change.attributeChanges) {
        if ("replace" in change.attributeChanges) {
            await Promise.all(change.attributeChanges.replace
                .map((rep) => replaceAttribute(ctx, vertex, rep, signErrors)));
        } else {
            const modifications = change.attributeChanges.changes;
            for (const mod of modifications) {
                await applyEntryModification(ctx, vertex, mod, signErrors);
            }
        }
    }

    const is_glue: boolean = change.sDSEType[DSEType_glue] === TRUE_BIT;
    const is_cp: boolean = change.sDSEType[DSEType_cp] === TRUE_BIT;
    const is_entry: boolean = change.sDSEType[DSEType_entry] === TRUE_BIT;
    const is_alias: boolean = change.sDSEType[DSEType_alias] === TRUE_BIT;
    const is_subr: boolean = change.sDSEType[DSEType_subr] === TRUE_BIT;
    const is_nssr: boolean = change.sDSEType[DSEType_nssr] === TRUE_BIT;
    const is_admPoint: boolean = change.sDSEType[DSEType_admPoint] === TRUE_BIT;
    const is_subentry: boolean = change.sDSEType[DSEType_subentry] === TRUE_BIT;
    const is_sa: boolean = change.sDSEType[DSEType_sa] === TRUE_BIT;
    await ctx.db.entry.update({
        where: {
            id: vertex.dse.id,
        },
        data: {
            glue: is_glue,
            cp: is_cp,
            entry: is_entry,
            alias: is_alias,
            subr: is_subr,
            nssr: is_nssr,
            admPoint: is_admPoint,
            subentry: is_subentry,
            sa: is_sa,
        },
    });

    await ctx.db.$transaction([
        ctx.db.entryAttributeValuesIncomplete.deleteMany({
            where: {
                entry_id: vertex.dse.id,
            },
        }),
        ctx.db.entry.update({
            where: {
                id: vertex.dse.id,
            },
            data: {
                subordinate_completeness: change.subComplete ?? FALSE,
                attribute_completeness: change.attComplete ?? FALSE,
                EntryAttributeValuesIncomplete: {
                    createMany: {
                        data: change.attValIncomplete?.map((oid) => ({
                            attribute_type: oid.toString(),
                        })) ?? [],
                    },
                },

            },
        }),
    ]);
}

/*

There was some ambiguity in X.525 surrounding whether or not the incremental
steps start from the Root DSE (as is the case with TotalRefresh), or from the
context prefix. I found this in Chadwick's "Understanding X.500":

> If incremental updates are transferred, then only those SDSEs that have been
> updated since the last Update Shadow message was sent, plus their parents up
> to the root.

So that seems to answer that question, even though its not from a completely
authoritative source.

Also note: this function was partly copied from `applyTotalRefresh()`.

*/
async function applyIncrementalRefreshStep (
    ctx: Context,
    vertex: Vertex,
    refresh: IncrementalStepRefresh,
    agreement: ShadowingAgreementInfo,
    depth: number,
    signErrors: boolean,
    localName: LocalName,
    obid: OperationalBindingID,
): Promise<void> {

    // Skip over everything up until we reach the base of the shadowed subtree.
    const cp_length = agreement.shadowSubject.area.contextPrefix.length;
    const base = agreement.shadowSubject.area.replicationArea.base ?? [];
    if (depth < (cp_length + base.length)) {
        // In the future, this may be relaxed.
        if (!refresh.subordinateUpdates || (refresh.subordinateUpdates.length !== 1)) {
            throw new Error();
        }
        const sub = await dnToVertex(ctx, vertex, [ refresh.subordinateUpdates[0].subordinate ]);
        if (!sub) {
            throw new Error();
        }
        return applyIncrementalRefreshStep(
            ctx,
            sub,
            refresh.subordinateUpdates[0].changes,
            agreement,
            depth + 1,
            signErrors,
            [],
            obid,
        );
    }

    const namingMatcher = getNamingMatcherGetter(ctx);
    let is_chopped_before: boolean = false;
    const is_chopped = agreement.shadowSubject.area.replicationArea.specificExclusions
        ?.some((chop) => {
            let chopBefore: boolean = true;
            let chopName: LocalName = [];
            if ("chopBefore" in chop) {
                chopName = chop.chopBefore;
            } else if ("chopAfter" in chop) {
                chopBefore = false;
                chopName = chop.chopAfter;
            }
            if (compareDistinguishedName(chopName, localName, namingMatcher)) {
                is_chopped_before = chopBefore;
                return true;
            }
            return false;
        })
        ?? false;

    if (is_chopped && is_chopped_before) {
        return; // We don't process this DSE.
    }

    if (refresh.sDSEChanges) {
        if ("add" in refresh.sDSEChanges) {
            const change = refresh.sDSEChanges.add;
            const immediate_superior = vertex;
            const rdn = localName[localName.length - 1];
            if (!rdn) {
                return;
            }
            const dse_type = sdse_type_to_dse_type(change.sDSEType);
            const attributes = [
                ...change.attributes,
                new Attribute(
                    dseType["&id"],
                    [dseType.encoderFor["&Type"]!(dse_type, DER)],
                ),
            ];
            vertex = await createEntry(ctx, immediate_superior, rdn, {
                subordinate_completeness: change.subComplete ?? FALSE,
                attribute_completeness: change.attComplete,
                EntryAttributeValuesIncomplete: {
                    createMany: {
                        data: change.attValIncomplete?.map((oid) => ({
                            attribute_type: oid.toString(),
                        })) ?? [],
                    },
                },
            }, attributes, undefined, signErrors);
        }
        else if ("remove" in refresh.sDSEChanges) {
            await deleteEntry(ctx, vertex, true);
            return; // If the SDSE is removed, there cannot be any subordinates!
        }
        else if ("modify" in refresh.sDSEChanges) {
            const change = refresh.sDSEChanges.modify;
            await applyContentChange(ctx, vertex, change, localName, agreement, obid, signErrors);
        }
        else {
            const dn = [ ...agreement.shadowSubject.area.contextPrefix, ...localName ];
            ctx.log.warn(ctx.i18n.t("log:sdse_incremental_change_not_understood", {
                dn: stringifyDN(ctx, dn),
            }));
        }
    }

    const max = agreement.shadowSubject.area.replicationArea.maximum;
    const max_depth = Math.min(cp_length + Number(max ?? MAX_DEPTH), MAX_DEPTH);
    if (depth >= max_depth) {
        return;
    }

    if (is_chopped && !is_chopped_before) {
        return; // We don't process this DSE's subordinates.
    }

    const refinement = agreement.shadowSubject.area.replicationArea.specificationFilter;
    const processed_subordinate_ids: Set<number> = new Set();
    await bPromise.map(refresh.subordinateUpdates ?? [], async (sub_update) => {
        // If the change is add, `vertex` will be the immediate superior.
        if (refresh.sDSEChanges && "add" in refresh.sDSEChanges) {
            return applyIncrementalRefreshStep(
                ctx,
                vertex,
                sub_update.changes,
                agreement, depth + 1,
                signErrors,
                [ ...localName, sub_update.subordinate ],
                obid,
            );
        }
        const sub = await dnToVertex(ctx, vertex, [ sub_update.subordinate ]);
        if (!sub) {
            return;
        }
        const objectClasses = Array.from(sub.dse.objectClass).map(ObjectIdentifier.fromString);
        if (refinement && !objectClassesWithinRefinement(objectClasses, refinement)) {
            throw new Error(); // FIXME:
        }
        processed_subordinate_ids.add(sub.dse.id);
        return applyIncrementalRefreshStep(
            ctx,
            sub,
            sub_update.changes,
            agreement,
            depth + 1,
            signErrors,
            [ ...localName, sub.dse.rdn ],
            obid,
        );
    }, {
        concurrency: 4, // FIXME:
    });
}

export
async function updateShadow (
    ctx: MeerkatContext,
    assn: DISPAssociation,
    arg: UpdateShadowArgument,
    invokeId: InvokeId,
): Promise<UpdateShadowResult> {
    if ("signed" in arg) {
        const securityParameters = arg.signed.toBeSigned.securityParameters;
        const certPath = securityParameters?.certification_path;
        await verifySIGNED(
            ctx,
            assn,
            certPath,
            invokeId,
            false,
            arg.signed,
            _encode_UpdateShadowArgumentData,
            (assn.bind?.versions?.[Versions_v2] === TRUE_BIT),
            "arg",
            assn.boundNameAndUID?.dn,
        );
    }
    const data = getOptionallyProtectedValue(arg);
    const now = new Date();
    const ob = await ctx.db.operationalBinding.findFirst({
        where: {
            /**
             * This is a hack for getting the latest version: we are selecting
             * operational bindings that have no next version.
             */
            next_version: {
                none: {},
            },
            binding_type: id_op_binding_shadow.toString(),
            binding_identifier: Number(data.agreementID.identifier),
            binding_version: Number(data.agreementID.version),
            accepted: true,
            terminated_time: null,
            validity_start: {
                lte: now,
            },
            OR: [
                {
                    validity_end: null,
                },
                {
                    validity_end: {
                        gte: now,
                    },
                },
            ],
        },
        select: {
            id: true,
            last_update: true,
            agreement_ber: true,
            access_point: {
                select: {
                    ber: true,
                },
            },
            binding_identifier: true,
            binding_version: true,
        },
    });
    const signErrors: boolean = true;
    if (!ob) {
        throw new ShadowError(
            ctx.i18n.t("err:sob_not_found", { obid: data.agreementID.identifier.toString() }),
            new ShadowErrorData(
                ShadowProblem_invalidAgreementID,
                undefined,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    id_errcode_shadowError,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                FALSE,
                undefined,
            ),
            signErrors,
        );
    }
    // TODO: Validate that the roles are not reversed.
    if (ob.last_update && (ob.last_update.getTime() > data.updateTime.getTime())) {
        throw new ShadowError(
            ctx.i18n.t("err:shadow_update_time_backwards"),
            new ShadowErrorData(
                ShadowProblem_updateAlreadyReceived,
                undefined,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    id_errcode_shadowError,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                FALSE,
                undefined,
            ),
            signErrors,
        );
    }
    const bindingID = new OperationalBindingID(
        ob.binding_identifier,
        ob.binding_version,
    );
    const agreementElement = new BERElement();
    agreementElement.fromBytes(ob.agreement_ber);
    const agreement = _decode_ShadowingAgreementInfo(agreementElement);
    const cp_dn = agreement.shadowSubject.area.contextPrefix;
    let cpVertex = await dnToVertex(ctx, ctx.dit.root, cp_dn);
    if (!cpVertex) {
        if (!ob.access_point) {
            throw new Error("7a61413e-7b28-4dd8-a216-54f3c855b0e0"); // TODO:
        }
        const apElement = new BERElement();
        apElement.fromBytes(ob.access_point.ber);
        const ap = _decode_AccessPoint(apElement);
        await becomeShadowConsumer(ctx, agreement, ap, bindingID);
        cpVertex = await dnToVertex(ctx, ctx.dit.root, cp_dn);
        // TODO: Log creation of the CP.
    }
    if (!cpVertex) {
        throw new Error("730902b2-bc68-4fbd-8e71-3f301c1c0ccd"); // TODO:
    }
    if ("noRefresh" in data.updatedInfo) {
        // TODO: Log
        return {
            null_: null,
        };
    }
    else if ("total" in data.updatedInfo) {
        const refresh = data.updatedInfo.total;
        // TODO: Check that update complies with agreement.
        // - and that, if there is no SDSE, there are also no subordinates.
        // - and validate SDSEType.
        await applyTotalRefresh(ctx, cpVertex, refresh, agreement, 0, signErrors, []);
    }
    else if ("incremental" in data.updatedInfo) {
        const refresh = data.updatedInfo.incremental;
        // TODO: Check that update complies with agreement.
        for (const step of refresh) {
            await applyIncrementalRefreshStep(ctx, cpVertex, step, agreement, 0, signErrors, [], bindingID);
        }
    }
    else {
        throw new ShadowError(
            ctx.i18n.t("err:unsupported_shadow_update_strategy"),
            new ShadowErrorData(
                ShadowProblem_unsupportedStrategy,
                undefined,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    id_errcode_shadowError,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                FALSE,
                undefined,
            ),
            signErrors,
        );
    }

    return {
        null_: null,
    };
}

export default updateShadow;
