import { MeerkatContext } from "../../ctx.js";
import { Vertex, Context, ShadowError, Value, UnknownError, IndexableOID } from "../../types/index.js";
import {
    UpdateShadowArgument,
    UpdateShadowResult,
} from "@wildboar/x500/DirectoryShadowAbstractService";
import DISPAssociation from "../DISPConnection.js";
import { verifySIGNED } from "../../pki/verifySIGNED.js";
import {
    UpdateWindow,
    _encode_UpdateShadowArgumentData,
} from "@wildboar/x500/DirectoryShadowAbstractService";
import { InvokeId } from "@wildboar/x500/CommonProtocolSpecification";
import { Versions_v2 } from "@wildboar/x500/DirectoryAbstractService";
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
} from "@wildboar/asn1";
import {
    compareDistinguishedName,
    dnWithinSubtreeSpecification,
    getOptionallyProtectedValue,
    getRDN,
    objectClassesWithinRefinement,
} from "@wildboar/x500";
import {
    id_op_binding_shadow,
} from "@wildboar/x500/DirectoryOperationalBindingTypes";
import { ShadowErrorData } from "@wildboar/x500/DirectoryShadowAbstractService";
import {
    ShadowProblem_invalidAgreementID,
    ShadowProblem_invalidInformationReceived,
    ShadowProblem_unsuitableTiming,
    ShadowProblem_updateAlreadyReceived,
} from "@wildboar/x500/DirectoryShadowAbstractService";
import createSecurityParameters from "../../x500/createSecurityParameters.js";
import {
    id_errcode_shadowError,
} from "@wildboar/x500/CommonProtocolSpecification";
import {
    ShadowProblem_unsupportedStrategy,
    ShadowingAgreementInfo,
    _decode_ShadowingAgreementInfo,
} from "@wildboar/x500/DirectoryShadowAbstractService";
import dnToVertex from "../../dit/dnToVertex.js";
import { becomeShadowConsumer } from "../../dop/establish/becomeShadowConsumer.js";
import {
    _decode_AccessPoint,
} from "@wildboar/x500/DistributedOperations";
import {
    OperationalBindingID,
} from "@wildboar/x500/OperationalBindingManagement";
import {
    Subtree,
    TotalRefresh,
    IncrementalStepRefresh,
    SDSEType
} from "@wildboar/x500/DirectoryShadowAbstractService";
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
    DSEType_familyMember,
} from "@wildboar/x500/DSAOperationalAttributeTypes";
import deleteEntry from "../../database/deleteEntry.js";
import { Attribute } from "@wildboar/pki-stub";
import { dseType } from "@wildboar/x500/DSAOperationalAttributeTypes";
import { DER, _decodeObjectIdentifier } from "@wildboar/asn1/functional";
import addAttributes from "../../database/entry/addAttributes.js";
import { map } from "@tyler/duckhawk";
import {
    LocalName,
    createTimestamp,
    objectClass,
} from "@wildboar/x500/InformationFramework";
import { clearance } from "@wildboar/x500/EnhancedSecurity";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter.js";
import readSubordinates from "../../dit/readSubordinates.js";
import { Refinement } from "@wildboar/x500/InformationFramework";
import { OperationalBindingInitiator } from "../../generated/client.js";
import type { EntryWhereInput } from "../../generated/models/Entry.js";
import createEntry, { createDse } from "../../database/createEntry.js";
import stringifyDN from "../../x500/stringifyDN.js";
import { ContentChange } from "@wildboar/x500/DirectoryShadowAbstractService";
import rdnToID from "../../dit/rdnToID.js";
import { renameEntry } from "../../database/renameEntry.js";
import removeAttribute from "../../database/entry/removeAttribute.js";
import addValues from "../../database/entry/addValues.js";
import { EntryModification } from "@wildboar/x500/DirectoryAbstractService";
import valuesFromAttribute from "../../x500/valuesFromAttribute.js";
import removeValues from "../../database/entry/removeValues.js";
import readValuesOfType from "../../utils/readValuesOfType.js";
import { isAcceptableTypeForAlterValues } from "../../distributed/modifyEntry.js";
import subtreeIntersection from "../../x500/subtreeIntersection.js";
import { updateShadowConsumer } from "../createShadowUpdate.js";
import {
    ShadowProblem_unwillingToPerform,
    ClassAttributeSelection,
} from "@wildboar/x500/DirectoryShadowAbstractService";
import {
    AttributeUsage_userApplications,
    AttributeUsage_dSAOperation,
} from "@wildboar/x500/InformationFramework";
import { addSeconds } from "date-fns";
import { RelativeDistinguishedName } from "@wildboar/pki-stub";
import { stripEntry } from "../../database/stripEntry.js";
import getDistinguishedName from "../../x500/getDistinguishedName.js";
import { child } from "@wildboar/x500/InformationFramework";

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

/**
 * @summary Converts a `Refinement` to a Prisma Entry filter.
 * @description
 *
 * This function converts a `Refinement` to a Prisma Entry filter so that
 * entries in the database can be filtered at the database, rather than queried,
 * deserialized into memory, then evaluated within Meerkat DSA.
 *
 * @param ref The refinement
 * @returns A Prisma Entry filter
 */
function convert_refinement_to_prisma_filter (ref: Refinement): Partial<EntryWhereInput> {
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

/**
 * @summary Validate that replicated attributes adhere to the shadowing agreement.
 * @description
 *
 * This function validates that replicated attributes adhere to the shadowing
 * agreement by not including attributes of dSAOperation usage or ones not
 * authorized by the shadowing agreement, and making sure that the
 * `createTimestamp`, `modifyTimestamp`, and `objectClass` attributes are
 * present when they are required.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param agreement The shadowing agreement
 * @param attributes The attributes to be validated
 * @param signErrors Whether to cryptographically sign errors
 * @param obid The shadow operational binding identifier
 * @param currentObjectClasses A Set of numeric-form strings of object identifiers of the object classes of the entry
 * @param modification Whether the validate attributes are used in modification
 * @param dse_type The DSE type of the entry
 *
 * @function
 */
function checkPermittedAttributeTypes (
    ctx: Context,
    assn: DISPAssociation,
    agreement: ShadowingAgreementInfo,
    attributes: Attribute[],
    signErrors: boolean,
    obid: number,
    currentObjectClasses?: Set<IndexableOID>,
    modification: boolean = false,
    dse_type?: DSEType,
): void {
    // createTimestamp seems to be the only always-required attribute type.
    let createTimestampPresent: boolean = false;
    const objectClasses: Set<IndexableOID> = currentObjectClasses ?? new Set();
    for (const attr of attributes) {
        if (attr.values.length === 0) {
            continue;
        }
        if (attr.type_.isEqualTo(objectClass["&id"])) {
            attr.values.forEach((v) => objectClasses.add(v.objectIdentifier.toString()));
        }
        if (attr.type_.isEqualTo(createTimestamp["&id"])) {
            createTimestampPresent = true;
        }
    }
    const isEntry = (dse_type?.[DSEType_entry] === TRUE_BIT);
    const isSubentry = (dse_type?.[DSEType_subentry] === TRUE_BIT);
    // See ITU Recommendation X.525 (2019), Section 9.2.2.
    const mustHaveCreateTimestamp: boolean = ((isEntry || isSubentry) && !modification);
    if (mustHaveCreateTimestamp && !createTimestampPresent) {
        throw new ShadowError(
            ctx.i18n.t("err:shadow_update_missing_create_timestamp"),
            new ShadowErrorData(
                ShadowProblem_invalidInformationReceived,
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
    let all_user_attributes: boolean = false;
    const inclusions: Set<IndexableOID> = new Set();
    const exclusions: Set<IndexableOID> = new Set();
    for (const class_attrs of agreement.shadowSubject.attributes) {
        const attrs = class_attrs.classAttributes ?? ClassAttributeSelection._default_value_for_classAttributes;

        // The fact that objectClass contains superclasses implicitly satisfies
        // the application of the attribute selection to subclasses.
        const applies: boolean = !class_attrs.class_ || objectClasses.has(class_attrs.class_.toString());
        if (!applies) {
            continue;
        }
        if ("allAttributes" in attrs) {
            all_user_attributes = true;
        }
        else if ("include" in attrs) {
            for (const x of attrs.include) {
                const KEY: string = x.toString();
                inclusions.add(KEY);
                exclusions.delete(KEY);
            }
        }
        else if ("exclude" in attrs) {
            for (const x of attrs.exclude) {
                exclusions.add(x.toString());
            }
        }
        else {
            // TODO:
        }
    }
    for (const attr of attributes) {
        const ATTR_TYPE = attr.type_.toString();
        const attr_spec = ctx.attributeTypes.get(ATTR_TYPE);
        if (!attr_spec) {
            if (
                !all_user_attributes
                && !(inclusions.has(ATTR_TYPE) && !exclusions.has(ATTR_TYPE))
            ) {
                throw new ShadowError(
                    ctx.i18n.t("err:attr_type_not_authz_by_shadow_agreement", {
                        oid: ATTR_TYPE,
                        obid,
                    }),
                    new ShadowErrorData(
                        ShadowProblem_invalidInformationReceived,
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
            /* We don't recognize the attribute type, but it was allowed by
            the shadowing agreement. */
            continue;
        }
        const usage = attr_spec.usage ?? AttributeUsage_userApplications;
        if (usage === AttributeUsage_dSAOperation) {
            /* dSAOperation attribute types are never okay to replicate. */
            throw new ShadowError(
                ctx.i18n.t("err:not_authz_replicate_dsa_operation_attr_type", {
                    oid: ATTR_TYPE,
                }),
                new ShadowErrorData(
                    ShadowProblem_invalidInformationReceived,
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
        const user_attr: boolean = (usage === AttributeUsage_userApplications);
        if (!user_attr) {
            /* Directory operation and distributed operation attribute types
            are always permitted for replication, because there are some that
            are implicitly allowed even if not included in the shadowing
            agreement, such as access control-related attributes. The
            operational attribute types permitted are so broad that there is no
            point in trying to validate it. */
            continue;
        }
        /* Finally, we check if the userApplications attribute was agreed upon
        for replication in the shadowing agreement. */
        if (
            !all_user_attributes
            && !(inclusions.has(ATTR_TYPE) && !exclusions.has(ATTR_TYPE))
            && !attr.type_.isEqualTo(objectClass["&id"])
            && !attr.type_.isEqualTo(clearance["&id"])
        ) {
            throw new ShadowError(
                ctx.i18n.t("err:attr_type_not_authz_by_shadow_agreement", {
                    oid: ATTR_TYPE,
                    obid,
                }),
                new ShadowErrorData(
                    ShadowProblem_invalidInformationReceived,
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
    }
}

// TODO: Collect statistics to report in logging.
// TODO: It may be possible to separate the validation from the update.
// NOTE: minimum of subtree does not need to be checked. It is forbidden in shadowing subtrees.

/**
 * @summary Apply a TotalRefresh to a shadowed area as described in ITU Rec. X.525.
 * @description
 *
 * This is a recursive function that applies a `TotalRefresh` to a shadowed area
 * as described in
 * [ITU Recommendation X.525 (2019)](https://www.itu.int/rec/T-REC-X.525/en),
 * Section 11.3.1.1.
 *
 * In addition to being recursive, it can also parallelize; the extent to which
 * it does is controlled by the `recursion_fanout` parameter.
 *
 * In general the `vertex` argument is the vertex that is being deleted or
 * modified by the refresh provided by the `refresh` parameter. However, if the
 * `refresh` adds an entry, this function will recurse once, with `vertex` set
 * to the immediate superior of the to-be-added entry, and with `clientRDN` set
 * to the RDN of the entry to be added. Once the entry is added, this function
 * resumes recursion according to the prior statement.
 *
 * This function does not apply shadow updates outside of the shadow subtree.
 * Any refreshes that fall outside of the agreed-upon shadow subtree are
 * silently ignored. The exception is if the shadowing agreement includes the
 * replication of subordinates or subordinate knowledge, in which case, the
 * `subordinates_only` is used as a flag to instruct this function that only
 * subordinates or subordinate knowledge are to be added, since we've passed
 * the lower boundary of the shadow subtree.
 *
 * Note that the `minimum` of the shadow subtree does not need to be checked. It
 * is forbidden for use in shadowing agreements by
 * [ITU Recommendation X.525 (2019)](https://www.itu.int/rec/T-REC-X.525/en),
 * Section 9.2.1.1.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param obid The shadow operational binding identifier
 * @param vertex The vertex to which (or underneath which) this refresh is to be applied
 * @param refresh The refresh being applied currently
 * @param agreement The shadowing agreement
 * @param depth The current depth of recursion into DIT, starting from the root.
 * @param signErrors Whether to cryptographically sign errors
 * @param localName The local name, relative to the base (NOT cp) of the shadowed subtree
 * @param recursion_fanout The extent to which recursion should parallelize
 * @param subordinates_page_size The number of subordinates to fetch in a single page
 * @param subordinates_only Whether we've reached the lower boundary of the shadow subtree
 *  and we're just applying subordinate knowledge or subordinate info.
 * @param creatingRDN If a new entry is being created, this will be its RDN, and
 *  the `vertex` argument will refer to its immediate superior.
 * @returns The database ID of the entry created, if any.
 *
 * @async
 * @function
 */
async function applyTotalRefresh (
    ctx: Context,
    assn: DISPAssociation,
    obid: OperationalBindingID,
    vertex: Vertex,
    refresh: TotalRefresh,
    agreement: ShadowingAgreementInfo,
    depth: number,
    signErrors: boolean,
    localName: LocalName,
    recursion_fanout: number = 1,
    subordinates_page_size: number = 100,
    subordinates_only: boolean = false,
    creatingRDN: RelativeDistinguishedName | undefined = undefined,
): Promise<number | undefined> { // Return the ID of the created entry, if any.
    let created_dse_database_id: number | undefined;

    // Skip over everything up until we reach the base of the shadowed subtree.
    const cp_length = agreement.shadowSubject.area.contextPrefix.length;
    const base = agreement.shadowSubject.area.replicationArea.base ?? [];

    // TODO: This could be put before the subordinates loop to benefit from tail recursion.
    if (depth < (cp_length + base.length)) {
        // In the future, this may be relaxed.
        if (!refresh.subtree || (refresh.subtree.length !== 1)) {
            throw new Error("9af326e0-f1a3-448b-bdc2-e48b95464b36");
        }
        let sub = await dnToVertex(ctx, vertex, [ refresh.subtree[0].rdn ]);
        if (!sub) {
            if (depth < cp_length) {
                throw new Error("6be73719-242a-471a-a65a-e3ac05da8f74");
            }
            // If the vertex falls below the CP, we can just create glue DSEs.
            sub = await createEntry(
                ctx,
                vertex,
                refresh.subtree[0].rdn,
                {
                    glue: true,
                    lastShadowUpdate: new Date(),
                },
                [],
                undefined,
                true,
            );
        }
        return applyTotalRefresh(ctx, assn, obid, sub, refresh.subtree[0], agreement, depth + 1, signErrors, []);
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

    let start_replicating_subordinates: boolean = subordinates_only;
    const replicating_subrs: boolean = (
        (agreement.shadowSubject.knowledge?.extendedKnowledge
        || agreement.shadowSubject.subordinates)
        ?? false
    );
    if (is_chopped && is_chopped_before && !replicating_subrs) {
        if (replicating_subrs) {
            start_replicating_subordinates = true;
        } else {
            return; // We don't process this DSE.
        }
    }

    if (!refresh.sDSE && !refresh.subtree?.length) {
        if (vertex.dse.shadow || vertex.dse.glue) {
            await deleteEntry(ctx, vertex);
        }
        return;
    }
    const refinement = agreement.shadowSubject.area.replicationArea.specificationFilter;
    if (creatingRDN && refresh.sDSE) {
        const shadowingStartsAtRoot: boolean = ((cp_length + base.length) === 0);
        const creatingTopLevelDSE: boolean = depth === 1;
        const dse_type = sdse_type_to_dse_type(refresh.sDSE.sDSEType);
        checkPermittedAttributeTypes(ctx, assn, agreement, refresh.sDSE.attributes, signErrors, Number(obid.identifier));
        const isSubr: boolean       = (dse_type[DSEType_subr] === TRUE_BIT);
        const isNssr: boolean       = (dse_type[DSEType_nssr] === TRUE_BIT);
        const isCp: boolean         = (dse_type[DSEType_cp] === TRUE_BIT)
            /* This is to protect against an odd scenario: if replicating the
            whole directory starting from the root, we don't want the root DSE
            to be the context prefix (which is an illegal combination of DSE
            types per X.501 Annex O), we want the top-level DSEs to be the
            context prefixes. This should make the assertion that you'll find
            when searching this codebase for
            8eeed982-b97a-4951-86c3-c972cb472351 succeed. */
            || (shadowingStartsAtRoot && creatingTopLevelDSE);
        const isEntry: boolean      = (dse_type[DSEType_entry] === TRUE_BIT);
        const isAlias: boolean      = (dse_type[DSEType_alias] === TRUE_BIT);
        const isAdmPoint: boolean   = (dse_type[DSEType_admPoint] === TRUE_BIT);
        const isSubentry: boolean   = (dse_type[DSEType_subentry] === TRUE_BIT);
        const isSa: boolean         = (dse_type[DSEType_sa] === TRUE_BIT);
        const isGlue: boolean       = (dse_type[DSEType_glue] === TRUE_BIT);
        if (subordinates_only) {
            const isGlue: boolean = (dse_type[DSEType_glue] === TRUE_BIT);
            if (!isGlue && !isSubr && !isNssr) {
                return;
            }
        }
        const object_classes = refresh
            .sDSE
            .attributes
            .filter((attr) => attr.type_.isEqualTo(objectClass["&id"]))
            .flatMap((attr) => attr.values)
            .map((v) => _decodeObjectIdentifier(v));
        if (refinement && !objectClassesWithinRefinement(object_classes, refinement)) {
            /* Even if provided by the shadow supplier, if the entry does not
            fall within the refinement, we just create a glue entry instead. */
            vertex = await createEntry(
                ctx,
                vertex,
                creatingRDN,
                {
                    glue: true,
                    subordinate_completeness: refresh.sDSE.subComplete ?? FALSE,
                    lastShadowUpdate: new Date(),
                },
                [],
                undefined,
                true,
            );
        } else {
            // This is an optimization to avoid querying the subordinates of an
            // entry that was just created.
            if (refresh.subtree?.length) {
                vertex = await createEntry(
                    ctx,
                    vertex,
                    creatingRDN,
                    {
                        shadow: true,
                        subr: isSubr,
                        nssr: isNssr,
                        cp: isCp,
                        entry: isEntry,
                        alias: isAlias,
                        admPoint: isAdmPoint,
                        subentry: isSubentry,
                        sa: isSa,
                        glue: isGlue,
                        subordinate_completeness: refresh.sDSE.subComplete ?? FALSE,
                        attribute_completeness: refresh.sDSE.attComplete,
                        EntryAttributeValuesIncomplete: {
                            createMany: {
                                data: refresh.sDSE.attValIncomplete?.map((oid) => ({
                                    attribute_type: oid.toString(),
                                })) ?? [],
                            },
                        },
                        lastShadowUpdate: new Date(),
                    },
                    refresh.sDSE.attributes,
                    undefined,
                    true,
                );
            } else {
                return (await createDse(
                    ctx,
                    vertex,
                    creatingRDN,
                    {
                        shadow: true,
                        subr: isSubr,
                        nssr: isNssr,
                        cp: isCp,
                        entry: isEntry,
                        alias: isAlias,
                        admPoint: isAdmPoint,
                        subentry: isSubentry,
                        sa: isSa,
                        glue: isGlue,
                        subordinate_completeness: refresh.sDSE.subComplete ?? FALSE,
                        attribute_completeness: refresh.sDSE.attComplete,
                        EntryAttributeValuesIncomplete: {
                            createMany: {
                                data: refresh.sDSE.attValIncomplete?.map((oid) => ({
                                    attribute_type: oid.toString(),
                                })) ?? [],
                            },
                        },
                        lastShadowUpdate: new Date(),
                    },
                    refresh.sDSE.attributes,
                    undefined,
                    true,
                )).dse.id;
            }
        }
        created_dse_database_id = vertex.dse.id;
    }
    else if (creatingRDN && !refresh.sDSE) {
        vertex = await createEntry(
            ctx,
            vertex,
            creatingRDN,
            {
                glue: true,
                lastShadowUpdate: new Date(),
            },
            [],
            undefined,
            true,
        );
        created_dse_database_id = vertex.dse.id;
    }
    else if (refresh.sDSE) { // The subordinate exists already, and we have sDSE content defined, wipe it out and replace it.
        // TODO: Check if there is no conflict. If not, just add values.
        // This alone results in support for overlapping shadowed areas.
        const objectClasses = Array.from(vertex.dse.objectClass).map(ObjectIdentifier.fromString);
        const selectedByRefinement: boolean = !refinement || objectClassesWithinRefinement(objectClasses, refinement);
        if (selectedByRefinement && !vertex.dse.root) { // No modifications to root!
            const shadowingStartsAtRoot: boolean = ((cp_length + base.length) === 0);
            const creatingTopLevelDSE: boolean = depth === 1;
            /* Only if the entry falls within the refinement do we modify it. */
            const dse_type = sdse_type_to_dse_type(refresh.sDSE.sDSEType);
            const isFamily: boolean = dse_type[DSEType_familyMember] === TRUE_BIT;
            await stripEntry(ctx, vertex);
            const promises = await addAttributes(ctx, vertex, [
                ...refresh.sDSE.attributes,
                new Attribute(
                    dseType["&id"],
                    [dseType.encoderFor["&Type"]!(dse_type, DER)],
                ),
            ], undefined, false, signErrors);
            const isSubr: boolean       = (dse_type[DSEType_subr] === TRUE_BIT);
            const isNssr: boolean       = (dse_type[DSEType_nssr] === TRUE_BIT);
            const isCp: boolean         = (dse_type[DSEType_cp] === TRUE_BIT)
                /* This is to protect against an odd scenario: if replicating the
                whole directory starting from the root, we don't want the root DSE
                to be the context prefix (which is an illegal combination of DSE
                types per X.501 Annex O), we want the top-level DSEs to be the
                context prefixes. This should make the assertion that you'll find
                when searching this codebase for
                8eeed982-b97a-4951-86c3-c972cb472351 succeed. */
                || (shadowingStartsAtRoot && creatingTopLevelDSE);
            const isEntry: boolean      = (dse_type[DSEType_entry] === TRUE_BIT);
            const isAlias: boolean      = (dse_type[DSEType_alias] === TRUE_BIT);
            const isAdmPoint: boolean   = (dse_type[DSEType_admPoint] === TRUE_BIT);
            const isSubentry: boolean   = (dse_type[DSEType_subentry] === TRUE_BIT);
            const isSa: boolean         = (dse_type[DSEType_sa] === TRUE_BIT);
            const isGlue: boolean       = (dse_type[DSEType_glue] === TRUE_BIT);
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
                        lastShadowUpdate: new Date(),
                        // DSE types need to be set, because the DSE type driver is a NOOP.
                        shadow: true,
                        entry: isEntry && !isFamily,
                        subr: isSubr,
                        nssr: isNssr,
                        cp: (depth === cp_length) || isCp,
                        alias: isAlias,
                        admPoint: isAdmPoint,
                        subentry: isSubentry,
                        sa: isSa,
                        glue: isGlue,
                    },
                }),
                ctx.db.entryAttributeValuesIncomplete.createMany({
                    data: refresh.sDSE.attValIncomplete?.map((oid) => ({
                        entry_id: vertex.dse.id,
                        attribute_type: oid.toString(),
                    })) ?? [],
                }),
            ]);
        }
    }
    const max = agreement.shadowSubject.area.replicationArea.maximum;
    const max_depth = Math.min(Number(max ?? MAX_DEPTH), MAX_DEPTH);
    if (localName.length >= max_depth) {
        if (replicating_subrs) {
            start_replicating_subordinates = true;
        } else {
            return created_dse_database_id;
        }
    }

    if (is_chopped && !is_chopped_before) {
        if (replicating_subrs) {
            start_replicating_subordinates = true;
        } else {
            return created_dse_database_id; // We don't process this DSE's subordinates.
        }
    }

    if (!refresh.subtree || (refresh.subtree.length === 0)) {
        // Optimization: delete all subordinates.
        await ctx.db.entry.deleteMany({
            where: {
                immediate_superior_id: vertex.dse.id,
            },
        });
        return created_dse_database_id;
    }

    const processed_subordinate_ids: Set<number> = new Set();
    const possible_created_ids = await map(refresh.subtree, async (subtree: Subtree) => {
        const sub = await dnToVertex(ctx, vertex, [ subtree.rdn ]);
        if (sub) {
            processed_subordinate_ids.add(sub.dse.id);
        }
        return applyTotalRefresh(
            ctx,
            assn,
            obid,
            sub ?? vertex,
            subtree,
            agreement,
            depth + 1,
            signErrors,
            [ ...localName, sub?.dse.rdn ?? subtree.rdn ],
            Math.max(1, Math.round(recursion_fanout / 2)),
            subordinates_page_size,
            start_replicating_subordinates,
            sub ? undefined : subtree.rdn, // If undefined, we are overwriting the existing entry.
        );
    }, {
        concurrency: recursion_fanout,
    });
    for (const id of possible_created_ids) {
        if (id === undefined) {
            continue;
        }
        processed_subordinate_ids.add(id);
    }

    /* What follows is removing all shadow DSEs that fall within the agreement
    but were not explicitly mentioned in the TotalRefresh. */
    let cursorId: number | undefined;
    const getNextBatchOfUnmentionedSubordinates = () => {
        return readSubordinates(ctx, vertex, subordinates_page_size, undefined, cursorId, {
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
        await map(subordinates, (subordinate: Vertex) => applyTotalRefresh(
            ctx,
            assn,
            obid,
            subordinate,
            deletion_refresh,
            agreement,
            depth + 1,
            signErrors,
            [ ...localName, subordinate.dse.rdn ],
            Math.max(1, Math.round(recursion_fanout / 2)),
        ), {
            concurrency: recursion_fanout,
        });
        const last_subordinate = subordinates[subordinates.length - 1];
        cursorId = last_subordinate?.dse.id;
        subordinates = await getNextBatchOfUnmentionedSubordinates();
    }
    return created_dse_database_id;
}

/**
 * @summary Replace an attribute in the database
 * @description
 *
 * This simple function just replaces an attribute entirely with a new one, and
 * it does so using a database transaction.
 *
 * @param ctx The context object
 * @param vertex The vertex to be modified
 * @param attr The attribute that will be added
 * @param signErrors Whether to sign errors
 * @returns A prisma promise that will replace the attribute
 *
 * @async
 * @function
 */
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

/**
 * @summary Get a function that adds a value to another, per the alterValues modification.
 * @description
 *
 * This is a higher-order function that returns a function that alters a value
 * by adding or subtracting another value specified in an `alterValues`
 * modification from it.
 *
 * This is a modification of a similarly-named function in `modifyEntry`.
 *
 * @param toBeAddedElement The value that is to be added to the existing value.
 * @returns The new Value
 *
 * @function
 */
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

/**
 * @summary Apply an entry modification to an entry within a shadow subtree
 * @description
 *
 * This function applies a modification to an SDSE.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param agreement The shadowing agreement
 * @param vertex The vertex to be modified
 * @param mod The modification to apply
 * @param signErrors Whether to cryptographically sign errors
 * @param currentObjectClasses The object classes of the vertex being modified
 * @param obid The shadow operational binding identifier
 * @returns Data returned from the database by the Prisma ORM. Ignore it.
 *
 * @async
 * @function
 */
async function applyEntryModification (
    ctx: Context,
    assn: DISPAssociation,
    agreement: ShadowingAgreementInfo,
    vertex: Vertex,
    mod: EntryModification,
    signErrors: boolean,
    currentObjectClasses: Set<IndexableOID>,
    obid: number,
): Promise<any[]> {
    if ("addAttribute" in mod) {
        checkPermittedAttributeTypes(
            ctx,
            assn,
            agreement,
            [ mod.addAttribute ],
            signErrors,
            obid,
            currentObjectClasses,
            true,
        );
        return ctx.db.$transaction(await addAttributes(ctx, vertex, [ mod.addAttribute ], undefined, false, signErrors));
    }
    else if ("removeAttribute" in mod) {
        return ctx.db.$transaction(await removeAttribute(ctx, vertex, mod.removeAttribute));
    }
    else if ("addValues" in mod) {
        checkPermittedAttributeTypes(
            ctx,
            assn,
            agreement,
            [ mod.addValues ],
            signErrors,
            obid,
            currentObjectClasses,
            true,
        );
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
        checkPermittedAttributeTypes(
            ctx,
            assn,
            agreement,
            [ mod.replaceValues ],
            signErrors,
            obid,
            currentObjectClasses,
            true,
        );
        return ctx.db.$transaction([
            ...(await removeAttribute(ctx, vertex, mod.replaceValues.type_)),
            // Second to last argument to addValues() is false, because we don't want to check
            // if the potentially added values already exist, because we are just
            // going to wipe out all that exist and replace them.
            ...(await addValues(ctx, vertex, valuesFromAttribute(mod.replaceValues), undefined, false, signErrors)),
        ]);
    }
    else {
        return []; // Any other alternative not understood.
    }
}

/**
 * @summary Apply a content change to an SDSE.
 * @description
 *
 * Applies a content change to an SDSE as used by the incremental refresh
 * described in
 * [ITU Recommendation X.525 (2019)](https://www.itu.int/rec/T-REC-X.525/en),
 * Section 11.3.1.2.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param vertex The vertex to be changed
 * @param change The change itself
 * @param localName The local name, relative to the base (NOT cp) of the shadow subtree
 * @param agreement The shadowing agreement
 * @param obid The shadow operational binding identifier
 * @param signErrors Whether to cryptographically sign errors
 *
 * @async
 * @function
 */
async function applyContentChange (
    ctx: Context,
    assn: DISPAssociation,
    vertex: Vertex,
    change: ContentChange,
    localName: LocalName,
    agreement: ShadowingAgreementInfo,
    obid: OperationalBindingID,
    signErrors: boolean,
): Promise<void> {
    const cp = agreement.shadowSubject.area.contextPrefix;
    const oldDN = [ ...cp, ...localName ];
    if (change.rename) {
        const newDN = ("newRDN" in change.rename)
            ? [ ...cp, ...localName.slice(0, -1), change.rename.newRDN ]
            : change.rename.newDN;
        const newRDN = getRDN(newDN);
        if (!newRDN || (newRDN.length === 0)) {
            throw new ShadowError(
                ctx.i18n.t("err:shadow_rename_invalid_dn"),
                new ShadowErrorData(
                    ShadowProblem_invalidInformationReceived,
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
            );
        }
        const objectClasses = Array.from(vertex.dse.objectClass).map(ObjectIdentifier.fromString);
        const subtree = agreement.shadowSubject.area.replicationArea;
        const namingMatcher = getNamingMatcherGetter(ctx);
        if (!dnWithinSubtreeSpecification(newDN, objectClasses, subtree, cp, namingMatcher)) {
            // If the entry falls out of the shadowed subtree, just delete it.
            if (vertex.dse.shadow || vertex.dse.glue) {
                await deleteEntry(ctx, vertex);
            }
            return;
        }
        const new_superior = await dnToVertex(ctx, ctx.dit.root, newDN.slice(0, -1));
        if (!new_superior) {
            throw new Error();
        }
        const existingEntry = await rdnToID(ctx, new_superior.dse.id, newRDN);
        if (existingEntry) {
            throw new ShadowError(
                ctx.i18n.t("err:shadow_rename_already_exists"),
                new ShadowErrorData(
                    ShadowProblem_invalidInformationReceived,
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
            );
        }
        await renameEntry(ctx, vertex, new_superior, newRDN);
    }
    if (change.attributeChanges) {
        if ("replace" in change.attributeChanges) {
            const attrs = change.attributeChanges.replace;
            let currentObjectClasses = vertex.dse.objectClass;
            for (const attr of attrs) {
                if (!attr.type_.isEqualTo(objectClass["&id"])) {
                    continue;
                }
                currentObjectClasses = new Set(attr.values.map((v) => v.objectIdentifier.toString()));
            }
            checkPermittedAttributeTypes(
                ctx,
                assn,
                agreement,
                attrs,
                signErrors,
                Number(obid.identifier),
                currentObjectClasses,
                true,
            );
            await Promise.all(change.attributeChanges.replace
                .map((rep) => replaceAttribute(ctx, vertex, rep, signErrors)));
        } else {
            const modifications = change.attributeChanges.changes;
            if (modifications.length === 0) {
                ctx.log.warn(ctx.i18n.t("log:shadow_increment_zero_length_mods", {
                    obid: obid.identifier.toString(),
                    dn: stringifyDN(ctx, oldDN),
                }));
            }
            for (const mod of modifications) {
                await applyEntryModification(
                    ctx,
                    assn,
                    agreement,
                    vertex,
                    mod,
                    signErrors,
                    vertex.dse.objectClass,
                    Number(obid.identifier),
                );
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

// TODO: Collect statistics to report in logging.
// Also note: this function was partly copied from `applyTotalRefresh()`.
/**
 * @summary Apply an incremental refresh step to an SDSE
 * @description
 *
 * This function applies an incremental step refresh to an SDSE within a shadow
 * subtree, as described in
 * [ITU Recommendation X.525 (2019)](https://www.itu.int/rec/T-REC-X.525/en),
 * Section 11.3.1.2.
 *
 * In addition to being recursive, it can also parallelize; the extent to which
 * it does is controlled by the `recursion_fanout` parameter.
 *
 * In general the `vertex` argument is the vertex that is being deleted or
 * modified by the refresh provided by the `refresh` parameter. However, if the
 * `refresh` adds an entry, this function will recurse once, with `vertex` set
 * to the immediate superior of the to-be-added entry, and with `clientRDN` set
 * to the RDN of the entry to be added. Once the entry is added, this function
 * resumes recursion according to the prior statement.
 *
 * This function does not apply shadow updates outside of the shadow subtree.
 * Any refreshes that fall outside of the agreed-upon shadow subtree are
 * silently ignored. The exception is if the shadowing agreement includes the
 * replication of subordinates or subordinate knowledge, in which case, the
 * `subordinates_only` is used as a flag to instruct this function that only
 * subordinates or subordinate knowledge are to be added, since we've passed
 * the lower boundary of the shadow subtree.
 *
 * Note that the `minimum` of the shadow subtree does not need to be checked. It
 * is forbidden for use in shadowing agreements by
 * [ITU Recommendation X.525 (2019)](https://www.itu.int/rec/T-REC-X.525/en),
 * Section 9.2.1.1.
 *
 * ### Ambiguity
 *
 * There was some ambiguity in X.525 surrounding whether or not the incremental
 * steps start from the Root DSE (as is the case with TotalRefresh), or from the
 * context prefix. I found this in Chadwick's "Understanding X.500":
 *
 * > If incremental updates are transferred, then only those SDSEs that have been
 * > updated since the last Update Shadow message was sent, plus their parents up
 * > to the root.
 *
 * So that seems to answer that question, even though its not from a completely
 * authoritative source.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param vertex The vertex to which the incremental refresh step applies
 * @param refresh The refresh itself
 * @param agreement The shadowing agreement
 * @param depth The current depth of recursion into DIT, starting from the root.
 * @param signErrors Whether to cryptographically sign errors
 * @param localName The local name, relative to the base (NOT cp) of the shadowed subtree
 * @param obid The shadow operational binding identifier
 * @param recursion_fanout The extent to which recursion should parallelize
 * @param subordinates_only Whether we've reached the lower boundary of the shadow subtree
 *  and we're just applying subordinate knowledge or subordinate info.
 *
 * @async
 * @function
 */
async function applyIncrementalRefreshStep (
    ctx: Context,
    assn: DISPAssociation,
    vertex: Vertex,
    refresh: IncrementalStepRefresh,
    agreement: ShadowingAgreementInfo,
    depth: number,
    signErrors: boolean,
    localName: LocalName,
    obid: OperationalBindingID,
    recursion_fanout: number = 1,
    subordinates_only: boolean = false,
): Promise<void> {

    // Skip over everything up until we reach the base of the shadowed subtree.
    const cp_length = agreement.shadowSubject.area.contextPrefix.length;
    const base = agreement.shadowSubject.area.replicationArea.base ?? [];

    // TODO: This could be put before the subordinates loop to benefit from tail recursion.
    if (depth < (cp_length + base.length)) {
        // In the future, this may be relaxed.
        if (!refresh.subordinateUpdates || (refresh.subordinateUpdates.length !== 1)) {
            throw new Error("29a2ac56-10fe-4354-b61b-ceeca9c632e0");
        }
        const rdn = refresh.subordinateUpdates[0].subordinate;
        let sub = await dnToVertex(ctx, vertex, [ rdn ]);
        if (!sub) {
            if (depth < cp_length) {
                const dn = getDistinguishedName(vertex);
                throw new Error("c22bf8dd-f256-4245-a942-2bdc622807d1: " + stringifyDN(ctx, [ ...dn, rdn ]));
            }
            // If the vertex falls below the CP, we can just create glue DSEs.
            sub = await createEntry(
                ctx,
                vertex,
                refresh.subordinateUpdates[0].subordinate,
                {
                    glue: true,
                    lastShadowUpdate: new Date(),
                },
                [],
                undefined,
                true,
            );
        }
        return applyIncrementalRefreshStep(
            ctx,
            assn,
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

    let start_replicating_subordinates: boolean = subordinates_only;
    const replicating_subrs: boolean = (
        (agreement.shadowSubject.knowledge?.extendedKnowledge
        || agreement.shadowSubject.subordinates)
        ?? false
    );
    if (is_chopped && is_chopped_before && !replicating_subrs) {
        if (replicating_subrs) {
            start_replicating_subordinates = true;
        } else {
            return; // We don't process this DSE.
        }
    }

    const refinement = agreement.shadowSubject.area.replicationArea.specificationFilter;
    if (refresh.sDSEChanges) {
        if ("add" in refresh.sDSEChanges) {
            const change = refresh.sDSEChanges.add;
            const immediate_superior = vertex;
            const rdn = localName[localName.length - 1];
            if (!rdn) {
                return;
            }
            const existing = await dnToVertex(ctx, immediate_superior, [ rdn ]);
            if (!existing) {
                checkPermittedAttributeTypes(ctx, assn, agreement, change.attributes, signErrors, Number(obid.identifier));
                const object_classes = refresh
                    .sDSEChanges
                    .add
                    .attributes
                    .filter((attr) => attr.type_.isEqualTo(objectClass["&id"]))
                    .flatMap((attr) => attr.values)
                    .map((v) => _decodeObjectIdentifier(v));
                const withinRefinement: boolean = refinement
                    ? objectClassesWithinRefinement(object_classes, refinement)
                    : true;
                if (withinRefinement) {
                    const shadowingStartsAtRoot: boolean = ((cp_length + base.length) === 0);
                    const creatingTopLevelDSE: boolean = depth === 1;
                    const dse_type = sdse_type_to_dse_type(change.sDSEType);
                    const isSubr: boolean       = (dse_type[DSEType_subr] === TRUE_BIT);
                    const isNssr: boolean       = (dse_type[DSEType_nssr] === TRUE_BIT);
                    const isCp: boolean         = (dse_type[DSEType_cp] === TRUE_BIT)
                        /* This is to protect against an odd scenario: if replicating the
                        whole directory starting from the root, we don't want the root DSE
                        to be the context prefix (which is an illegal combination of DSE
                        types per X.501 Annex O), we want the top-level DSEs to be the
                        context prefixes. This should make the assertion that you'll find
                        when searching this codebase for
                        8eeed982-b97a-4951-86c3-c972cb472351 succeed. */
                        || (shadowingStartsAtRoot && creatingTopLevelDSE);
                    const isEntry: boolean      = (dse_type[DSEType_entry] === TRUE_BIT);
                    const isAlias: boolean      = (dse_type[DSEType_alias] === TRUE_BIT);
                    const isAdmPoint: boolean   = (dse_type[DSEType_admPoint] === TRUE_BIT);
                    const isSubentry: boolean   = (dse_type[DSEType_subentry] === TRUE_BIT);
                    const isSa: boolean         = (dse_type[DSEType_sa] === TRUE_BIT);
                    const isGlue: boolean       = (dse_type[DSEType_glue] === TRUE_BIT);
                    if (subordinates_only) {
                        if (!isGlue && !isSubr && !isNssr) {
                            return;
                        }
                    }
                    const attributes = [
                        ...change.attributes,
                        new Attribute(
                            dseType["&id"],
                            [dseType.encoderFor["&Type"]!(dse_type, DER)],
                        ),
                    ];
                    vertex = await createEntry(ctx, immediate_superior, rdn, {
                        shadow: true,
                        subr: isSubr,
                        nssr: isNssr,
                        cp: isCp,
                        entry: isEntry,
                        alias: isAlias,
                        admPoint: isAdmPoint,
                        subentry: isSubentry,
                        sa: isSa,
                        glue: isGlue,
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
                } else if (object_classes.some((oc) => oc.isEqualTo(child["&id"]))) {
                    /*
                    ITU Recommendation X.501 (2019), Section 12.3.5 states that:
                    "If a family member is excluded from a subtree by this specification,
                    all its subordinate family members are also excluded."
                    */
                    return;
                } else {
                    /* NOTE: We create a glue entry if it falls outside of the
                    refinement, if any. */
                    vertex = await createEntry(ctx, immediate_superior, rdn, {
                        glue: true,
                        lastShadowUpdate: new Date(),
                    }, [], undefined, signErrors);
                }
            } else {
                vertex = existing;
            }
        }
        else if ("remove" in refresh.sDSEChanges) {
            const objectClasses = Array.from(vertex.dse.objectClass).map(ObjectIdentifier.fromString);
            if (!refinement || !objectClassesWithinRefinement(objectClasses, refinement)) {
                if (vertex.dse.shadow || vertex.dse.glue) {
                    await deleteEntry(ctx, vertex);
                }
                return; // If the SDSE is removed, there cannot be any subordinates!
            }
        }
        else if ("modify" in refresh.sDSEChanges) {
            const objectClasses = Array.from(vertex.dse.objectClass).map(ObjectIdentifier.fromString);
            if (!refinement || !objectClassesWithinRefinement(objectClasses, refinement)) {
                const change = refresh.sDSEChanges.modify;
                await applyContentChange(ctx, assn, vertex, change, localName, agreement, obid, signErrors);
            }
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
    if (localName.length >= max_depth) {
        if (replicating_subrs) {
            start_replicating_subordinates = true;
        } else {
            return;
        }
    }

    if (is_chopped && !is_chopped_before) {
        if (replicating_subrs) {
            start_replicating_subordinates = true;
        } else {
            return; // We don't process this DSE's subordinates.
        }
    }

    await map(refresh.subordinateUpdates ?? [], async (sub_update) => {
        // If the change is add, `vertex` will be the immediate superior.
        if (sub_update.changes.sDSEChanges && "add" in sub_update.changes.sDSEChanges) {
            return applyIncrementalRefreshStep(
                ctx,
                assn,
                vertex,
                sub_update.changes,
                agreement,
                depth + 1,
                signErrors,
                [ ...localName, sub_update.subordinate ],
                obid,
            );
        }
        const sub = await dnToVertex(ctx, vertex, [ sub_update.subordinate ]);
        if (!sub) {
            return;
        }
        return applyIncrementalRefreshStep(
            ctx,
            assn,
            sub,
            sub_update.changes,
            agreement,
            depth + 1,
            signErrors,
            [ ...localName, sub.dse.rdn ],
            obid,
            recursion_fanout,
            start_replicating_subordinates,
        );
    }, {
        concurrency: recursion_fanout,
    });
}

/**
 * @summary The updateShadow operation defined in ITU Rec. X.525 (2019)
 * @description
 *
 * This function is an implementation of the `updateShadow` operation described in
 * [ITU Recommendation X.525 (2019)](https://www.itu.int/rec/T-REC-X.525/en),
 * Section 11.3.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param arg The `UpdateShadowArgument` argument
 * @param invokeId The invocation ID
 * @returns The `UpdateShadowResult` result
 *
 * @function
 * @async
 */
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
            initiator: true,
            outbound: true,
            requested_time: true,
            responded_time: true,
            local_last_update: true,
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
    if (ob.binding_version !== Number(data.agreementID.version)) {
        throw new ShadowError(
            ctx.i18n.t("err:differing_sob_versions", {
                aid: assn.id,
                obid: data.agreementID.identifier.toString(),
            }),
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
    if (!ob.access_point) {
        throw new UnknownError(ctx.i18n.t("log:shadow_ob_with_no_access_point", {
            obid: ob.binding_identifier.toString(),
        }));
    }
    const apElement = new BERElement();
    apElement.fromBytes(ob.access_point.ber);
    const remoteAccessPoint = _decode_AccessPoint(apElement);
    const namingMatcher = getNamingMatcherGetter(ctx);
    if (
        !assn.boundNameAndUID?.dn?.length
        || !compareDistinguishedName(
            assn.boundNameAndUID.dn,
            remoteAccessPoint.ae_title.rdnSequence,
            namingMatcher,
        )
    ) {
        throw new ShadowError(
            ctx.i18n.t("err:not_authz_to_update_shadow", {
                dn: assn.boundNameAndUID
                    ? stringifyDN(ctx, assn.boundNameAndUID.dn)
                    : "",
                obid: data.agreementID.identifier.toString(),
            }),
            new ShadowErrorData(
                ShadowProblem_unwillingToPerform,
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
    const iAmSupplier: boolean = (
        // The initiator was the supplier and this DSA was the initiator...
        ((ob.initiator === OperationalBindingInitiator.ROLE_A) && (ob.outbound))
        // ...or, the initiator was the consumer, and this DSA was NOT the initiator.
        || ((ob.initiator === OperationalBindingInitiator.ROLE_B) && (!ob.outbound))
    );
    if (iAmSupplier) {
        throw new ShadowError(
            ctx.i18n.t("err:shadow_role_reversal"),
            new ShadowErrorData(
                ShadowProblem_unwillingToPerform,
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

    const updateMode = agreement.updateMode ?? ShadowingAgreementInfo._default_value_for_updateMode;
    const schedule = (("supplierInitiated" in updateMode) && ("scheduled" in updateMode.supplierInitiated))
        ? updateMode.supplierInitiated.scheduled
        : (("consumerInitiated" in updateMode)
            ? updateMode.consumerInitiated
            : undefined);
    if (schedule?.periodic && !schedule.othertimes) {
        const ob_time: Date = ob.responded_time
            ? new Date(Math.max(ob.requested_time.valueOf(), ob.responded_time.valueOf()))
            : ob.requested_time;
        let period_start = schedule.periodic.beginTime ?? ob_time;
        let next_period_start = period_start;
        let i = 0;
        while (i++ < 1_000_000) {
            next_period_start = addSeconds(period_start, Number(schedule.periodic.updateInterval));
            if (next_period_start.valueOf() >= now.valueOf()) {
                break;
            }
            period_start = next_period_start;
        }
        const end_of_period = addSeconds(period_start, Number(schedule.periodic.windowSize));
        const updateWindow = new UpdateWindow(
            next_period_start,
            addSeconds(next_period_start, Number(schedule.periodic.windowSize)),
        );
        if (now.valueOf() >= end_of_period.valueOf()) {
            throw new ShadowError(
                ctx.i18n.t("err:shadow_update_outside_of_window", {
                    obid: data.agreementID.identifier.toString(),
                    start: period_start.toISOString(),
                    end: end_of_period.toISOString(),
                    now: now.toISOString(),
                }),
                new ShadowErrorData(
                    ShadowProblem_unsuitableTiming,
                    ob.local_last_update ?? undefined,
                    updateWindow,
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
    }

    const cp_dn = agreement.shadowSubject.area.contextPrefix;
    let cpVertex = await dnToVertex(ctx, ctx.dit.root, cp_dn);
    if (!cpVertex) {
        const ob_time: Date = ob.responded_time
            ? new Date(Math.max(ob.requested_time.valueOf(), ob.responded_time.valueOf()))
            : ob.requested_time;
        await becomeShadowConsumer(ctx, agreement, remoteAccessPoint, bindingID, ob.id, ob_time);
        cpVertex = await dnToVertex(ctx, ctx.dit.root, cp_dn);
        ctx.log.info(ctx.i18n.t("log:shadow_cp_created", {
            dn: stringifyDN(ctx, cp_dn),
        }));
    }
    if (!cpVertex) {
        // This should never happen. We create the CP if it does not exist.
        throw new Error("730902b2-bc68-4fbd-8e71-3f301c1c0ccd");
    }
    /* We remove the timeout on the socket altogether and set a keep-alive so
    that the socket is not closed just because the updateShadow operation takes
    a long time before returning a response. */
    if (assn.rose.socket) {
        assn.rose.socket.setTimeout(1_000_000_000);
        assn.rose.socket.setKeepAlive(true, 5000);
    }
    if ("noRefresh" in data.updatedInfo) {
        ctx.log.info(ctx.i18n.t("log:shadow_update_no_refresh", { obid: ob.binding_identifier.toString() }));
        const update_complete_time = new Date();
        await ctx.db.operationalBinding.update({
            where: {
                id: ob.id,
            },
            data: {
                last_update: update_complete_time,
                local_last_update: update_complete_time,
                remote_last_update: data.updateTime,
            },
        });
        return {
            null_: null,
        };
    }
    else if ("total" in data.updatedInfo) {
        const refresh = data.updatedInfo.total;
        if (refresh.sDSE?.attributes.length) {
            throw new ShadowError(
                ctx.i18n.t("err:shadow_update_non_empty_root_dse"),
                new ShadowErrorData(
                    ShadowProblem_invalidInformationReceived,
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
        await applyTotalRefresh(
            ctx,
            assn,
            bindingID,
            ctx.dit.root, // The refresh starts from the root.
            refresh,
            agreement,
            0,
            signErrors,
            [],
            64, // TODO: Make configurable.
            100, // TODO: Make configurable.
        );
    }
    else if ("incremental" in data.updatedInfo) {
        /*
        It is not made obvious by the specification, but it seems that
        incremental refresh steps are relative to the Root DSE.

        ITU-T Recommendation X.525 (2019), Section 7.2.2.1, seems to suggest
        this applies to all update types, but it is only said explicitly for
        the total refresh. I found a diagram in David Chadwick's
        _Understanding X.500: The Directory_ on page 206 that seems to visually
        show an incremental update extending from the root DSE. This also makes
        sense so that changes to prefix information, such as administrative points
        or subentries in the prefix can be replicated.
        */
        const refresh = data.updatedInfo.incremental;
        ctx.log.debug(ctx.i18n.t("log:shadow_incremental_steps_count", {
            obid: data.agreementID.identifier.toString(),
            steps: refresh.length,
        }));
        for (const step of refresh) {
            if (step.sDSEChanges) {
                throw new ShadowError(
                    ctx.i18n.t("err:shadow_update_non_empty_root_dse"),
                    new ShadowErrorData(
                        ShadowProblem_invalidInformationReceived,
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
        }
        for (const step of refresh) {
            await applyIncrementalRefreshStep(
                ctx,
                assn,
                ctx.dit.root,
                step,
                agreement,
                0,
                signErrors,
                [],
                bindingID,
                1,
            );
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

    const update_complete_time = new Date();
    await ctx.db.operationalBinding.update({
        where: {
            id: ob.id,
        },
        data: {
            last_update: update_complete_time,
            local_last_update: update_complete_time,
            remote_last_update: data.updateTime,
        },
    });

    const possibly_related_sobs = await ctx.db.operationalBinding.findMany({
        where: {
            /**
             * This is a hack for getting the latest version: we are selecting
             * operational bindings that have no next version.
             */
            next_version: {
                none: {},
            },
            binding_type: id_op_binding_shadow.toString(),
            entry_id: {
                in: (() => {
                    const dse_ids: number[] = [];
                    let current: Vertex | undefined = cpVertex;
                    while (current) {
                        dse_ids.push(current.dse.id);
                        current = current.immediateSuperior;
                    }
                    return dse_ids;
                })(),
            },
            accepted: true,
            terminated_time: null,
            validity_start: {
                lte: now,
            },
            AND: [
                {
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
                {
                    OR: [ // This DSA is the supplier if one of these conditions are true.
                        { // This DSA initiated an OB in which it is the supplier.
                            initiator: OperationalBindingInitiator.ROLE_A,
                            outbound: true,
                        },
                        { // This DSA accepted an OB from a consumer.
                            initiator: OperationalBindingInitiator.ROLE_B,
                            outbound: false,
                        },
                    ],
                },
            ],
        },
        select: {
            id: true,
            binding_identifier: true,
            agreement_ber: true,
        },
    });
    /*
        Maybe you could:
        1. Identify SOBs that might be affected by the context prefix.
        2. If total refresh, any SOBs that overlap will also get a total refresh.
        3. If incremental update,
            a. Identify any SOBs that overlap. For each:
                a. Find intersection of subtree specifications.
                b. Filter out incremental steps that fall outside of the intersection.
                c. Select attributes / contexts that are relevant for the
                   operational binding.
                d. Save the new incremental step.

        "Overlapping" should ignore object classes, since these cannot be known
        from the subtree specification alone.
    */
    for (const sob of possibly_related_sobs) {
        const el = new BERElement();
        el.fromBytes(sob.agreement_ber);
        const agreement1 = agreement;
        const agreement2 = _decode_ShadowingAgreementInfo(el);
        const cp_dn_1 = cp_dn;
        const cp_dn_2 = agreement2.shadowSubject.area.contextPrefix;
        const subtree1 = agreement1.shadowSubject.area.replicationArea;
        const subtree2 = agreement2.shadowSubject.area.replicationArea;
        const intersection = subtreeIntersection(ctx, subtree1, subtree2, cp_dn_1, cp_dn_2);
        if (!intersection) {
            continue; // There is no overlap in the subtree specifications. Check the next SOB for overlap.
        }
        // TODO: Cascade the incremental updates to secondary shadows instead of performing a total refresh.
        await updateShadowConsumer(ctx, sob.id, true);
    }

    return {
        null_: null,
    };
}

export default updateShadow;
