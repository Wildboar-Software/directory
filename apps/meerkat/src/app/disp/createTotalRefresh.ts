import type { Context, Vertex } from "@wildboar/meerkat-types";
import {
    ShadowingAgreementInfo,
    _decode_ShadowingAgreementInfo,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/ShadowingAgreementInfo.ta";
import { Subtree } from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/Subtree.ta";
import { SDSEContent } from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/SDSEContent.ta";
import { TotalRefresh } from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/TotalRefresh.ta";
import { BERElement, BOOLEAN, FALSE, ObjectIdentifier, TRUE_BIT } from "asn1-ts";
import dnToVertex from "../dit/dnToVertex";
import readSubordinates from "../dit/readSubordinates";
import bPromise from "bluebird";
import { LocalName } from "@wildboar/x500/src/lib/modules/InformationFramework/LocalName.ta";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";
import { compareDistinguishedName, getRDN } from "@wildboar/x500";
import getSDSEContent from "./getSDSEContent";
import { objectClassesWithinRefinement } from "@wildboar/x500";
import { DSEType_glue } from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/DSEType.ta";
import { child } from "@wildboar/x500/src/lib/collections/objectClasses";

// UnitOfReplication ::= SEQUENCE {
//     area                 AreaSpecification,
//     attributes           AttributeSelection,
//     knowledge            Knowledge OPTIONAL,
//     subordinates         BOOLEAN DEFAULT FALSE,
//     contextSelection     ContextSelection OPTIONAL,
//     supplyContexts  [0]  CHOICE {
//       allContexts         NULL,
//       selectedContexts    SET SIZE (1..MAX) OF CONTEXT.&id,
//       ... } OPTIONAL }

//   AreaSpecification ::= SEQUENCE {
//     contextPrefix    DistinguishedName,
//     replicationArea  SubtreeSpecification,
//     ... }

//   Knowledge ::= SEQUENCE {
//     knowledgeType      ENUMERATED {
//       master (0),
//       shadow (1),
//       both   (2)},
//     extendedKnowledge  BOOLEAN DEFAULT FALSE,
//     ... }

//   AttributeSelection ::= SET OF ClassAttributeSelection

//   ClassAttributeSelection ::= SEQUENCE {
//     class            OBJECT IDENTIFIER OPTIONAL,
//     classAttributes  ClassAttributes DEFAULT allAttributes:NULL }

//   ClassAttributes ::= CHOICE {
//     allAttributes  NULL,
//     include        [0]  AttributeTypes,
//     exclude        [1]  AttributeTypes,
//     ... }

//   AttributeTypes ::= SET OF AttributeType

// TotalRefresh ::= SEQUENCE {
//     sDSE     SDSEContent OPTIONAL,
//     subtree  SET SIZE (1..MAX) OF Subtree OPTIONAL,
//     ...}

//   SDSEContent ::= SEQUENCE {
//     sDSEType          SDSEType,
//     subComplete       [0]  BOOLEAN DEFAULT FALSE,
//     attComplete       [1]  BOOLEAN OPTIONAL,
//     attributes        SET OF Attribute{{SupportedAttributes}},
//     attValIncomplete  SET OF AttributeType DEFAULT {},
//     ...}

//   SDSEType ::= DSEType

//   Subtree ::= SEQUENCE {
//     rdn  RelativeDistinguishedName,
//     COMPONENTS OF TotalRefresh,
//     ...}

const MAX_DEPTH: number = 10_000;

async function createTotalRefreshFromVertex (
    ctx: Context,
    vertex: Vertex,
    agreement: ShadowingAgreementInfo,
    obid: number,
    localName: LocalName,
    depth: number,
    extKnowledgeOnly: boolean = false,
    subordinatesOnly: boolean = false,
): Promise<TotalRefresh | undefined> {

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

    const getExtendedKnowledge: BOOLEAN = (agreement.shadowSubject.knowledge?.extendedKnowledge ?? FALSE);
    const getSubordinateInfo: BOOLEAN = (agreement.shadowSubject.subordinates ?? FALSE);
    let extended: boolean = extKnowledgeOnly || subordinatesOnly;

    if (is_chopped && is_chopped_before && !extKnowledgeOnly) {
        if (getExtendedKnowledge || getSubordinateInfo) {
            extended = true;
        } else {
            return; // We don't process this DSE.
        }
    }

    const content = await getSDSEContent(
        ctx,
        vertex,
        agreement,
        extended && getExtendedKnowledge,
        extended && getSubordinateInfo,
        agreement.shadowSubject.knowledge?.knowledgeType,
    );

    const refinement = agreement.shadowSubject.area.replicationArea.specificationFilter;
    const withinRefinement: boolean = refinement
        ? objectClassesWithinRefinement(Array.from(vertex.dse.objectClass).map(ObjectIdentifier.fromString), refinement)
        : true;

    const max = agreement.shadowSubject.area.replicationArea.maximum ?? MAX_DEPTH;
    const max_depth = Math.min(Number(max ?? MAX_DEPTH), MAX_DEPTH);
    if ((localName.length >= max_depth) && !extKnowledgeOnly) { // TODO: Is this supposed to be >=?
        if (getExtendedKnowledge || getSubordinateInfo) {
            extended = true;
        } else {
            if (!withinRefinement) {
                return undefined;
            }
            // We don't process this DSE's subordinates.
            return new TotalRefresh(
                content
                    ? new SDSEContent(
                        content.sDSEType,
                        FALSE,
                        content.attComplete,
                        content.attributes,
                        content.attValIncomplete,
                    )
                    : undefined,
                undefined,
            );
        }
    }

    if (is_chopped && !is_chopped_before && !extKnowledgeOnly) {
        if (getExtendedKnowledge || getSubordinateInfo) {
            extended = true;
        } else {
            if (!withinRefinement) {
                return undefined;
            }
            // We don't process this DSE's subordinates.
            return new TotalRefresh(
                content
                    ? new SDSEContent(
                        content.sDSEType,
                        FALSE,
                        content.attComplete,
                        content.attributes,
                        content.attValIncomplete,
                    )
                    : undefined,
                undefined,
            );
        }
    }

    let cursorId: number | undefined;
    // NOTE: You cannot apply a refinement here, because, even if a subordinate
    // does not match the refinement, one of its subordinates may.
    const getNextBatchOfSubordinates = () => readSubordinates(ctx, vertex, 100, undefined, cursorId, {
        /*
            ITU Recommendation X.501 (2019), Section 12.3.5 states that:
            "If a family member is excluded from a subtree by this specification,
            all its subordinate family members are also excluded."
        */
        EntryObjectClass: withinRefinement
            ? undefined
            : {
                none: {
                    object_class: child["&id"].toString(),
                },
            },
    });
    let subordinates: Vertex[] = await getNextBatchOfSubordinates();
    let subordinatesCount: number = 0;
    const subtrees: Subtree[] = [];
    while (subordinates.length > 0) {
        subordinatesCount += subordinates.length;
        const relevantSubordinates = subordinates
            .filter((sub) => (
                (getExtendedKnowledge || getSubordinateInfo)
                || (!sub.dse.subr && !sub.dse.nssr)
            ));
        /* Why not just use `.deleteMany()`? Because the subordinates also have
        to be evaluated for whether they fall within or without the specific
        exclusions of the subtree. Theoretically, this could still be done using
        their RDNs alone, but simple recursion was by far the most elegant
        solution. */
        const sub_refreshes = await bPromise
            .map(relevantSubordinates, (subordinate: Vertex) => createTotalRefreshFromVertex(
                ctx,
                subordinate,
                agreement,
                obid,
                [ ...localName, subordinate.dse.rdn ],
                depth + 1,
                extended && getExtendedKnowledge,
                extended && getSubordinateInfo,
            ), {
                concurrency: 4, // FIXME:
            });
        const last_subordinate = subordinates[subordinates.length - 1];
        cursorId = last_subordinate?.dse.id;
        for (let i = 0; i < sub_refreshes.length; i++) {
            const sr = sub_refreshes[i];
            if (!sr) {
                continue;
            }
            if ( // If the subordinate has no information.
                !sr.subtree?.length
                && (
                    !sr.sDSE
                    || (sr.sDSE.sDSEType[DSEType_glue] === TRUE_BIT)
                )
            ) {
                continue;
            }
            const rdn = subordinates[i].dse.rdn;
            subtrees.push(new Subtree(rdn, sr.sDSE, sr.subtree));
        }
        subordinates = await getNextBatchOfSubordinates();
    }
    const subComplete: boolean = (subordinatesCount === subtrees.length);

    // If this entry does not fall within the refinement, its subordinates still might.
    if (!withinRefinement) {
        return new TotalRefresh(
            undefined,
            (subtrees.length > 0) ? subtrees : undefined,
        );
    }

    return new TotalRefresh(
        content
            ? new SDSEContent(
                content.sDSEType,
                subComplete,
                content.attComplete,
                content.attributes,
                content.attValIncomplete,
            )
            : undefined,
        (subtrees.length > 0) ? subtrees : undefined,
    );
}

export
async function createTotalRefresh (
    ctx: Context,
    obid: number,
    totalRefreshOverride?: ShadowingAgreementInfo,
): Promise<TotalRefresh | undefined> {
    const ob = await ctx.db.operationalBinding.findUnique({
        where: {
            id: obid,
        },
        select: {
            binding_identifier: true,
            agreement_ber: true,
        },
    });
    if (!ob) {
        throw new Error("20d84d18-06c0-43a1-b0ed-047da92a5e98");
    }
    const agreementElement = new BERElement();
    agreementElement.fromBytes(ob.agreement_ber);
    const agreement = totalRefreshOverride ?? _decode_ShadowingAgreementInfo(agreementElement);
    const cp_dn = agreement.shadowSubject.area.contextPrefix;
    const base_dn = agreement.shadowSubject.area.replicationArea.base
        ? [ ...cp_dn, ...agreement.shadowSubject.area.replicationArea.base ]
        : cp_dn;
    const base = await dnToVertex(ctx, ctx.dit.root, base_dn);
    if (!base) {
        throw new Error("944e77fe-06ae-4872-82b1-10f3e3ae8730");
    }
    const baseRefresh = (await createTotalRefreshFromVertex(
        ctx,
        base,
        agreement,
        obid,
        [],
        base_dn.length,
    ));
    if (!baseRefresh) {
        return undefined;
    }
    const baseSubtree = new Subtree(
        getRDN(base_dn)!,
        baseRefresh.sDSE,
        baseRefresh.subtree,
    );
    let rootRefresh = baseSubtree;
    let current = base.immediateSuperior;
    while (current && !current.dse.root) {
        rootRefresh = new Subtree(
            current.dse.rdn,
            undefined,
            [rootRefresh],
        );
        current = current.immediateSuperior;
    }
    return new TotalRefresh(
        undefined,
        [rootRefresh],
    );
}
