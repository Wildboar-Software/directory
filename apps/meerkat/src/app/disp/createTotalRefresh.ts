import type { Context, Vertex } from "@wildboar/meerkat-types";
import {
    ShadowingAgreementInfo,
    _decode_ShadowingAgreementInfo,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/ShadowingAgreementInfo.ta";
import { Subtree } from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/Subtree.ta";
import { SDSEContent } from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/SDSEContent.ta";
import { TotalRefresh } from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/TotalRefresh.ta";
import { BERElement, BOOLEAN, FALSE } from "asn1-ts";
import dnToVertex from "../dit/dnToVertex";
import readSubordinates from "../dit/readSubordinates";
import { convert_refinement_to_prisma_filter } from "./operations/updateShadow";
import bPromise from "bluebird";
import { LocalName } from "@wildboar/x500/src/lib/modules/InformationFramework/LocalName.ta";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";
import { compareDistinguishedName } from "@wildboar/x500";
import getEntryExistsFilter from "../database/entryExistsFilter";
import getSDSEContent from "./getSDSEContent";

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
): Promise<[refresh: TotalRefresh, to_be_pruned: boolean] | undefined> {

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
    let extended: boolean = false;

    if (is_chopped && is_chopped_before && !extKnowledgeOnly) {
        if (getExtendedKnowledge) {
            extended = true;
        } else {
            return; // We don't process this DSE.
        }
    }

    const content = await getSDSEContent(ctx, vertex, agreement, getExtendedKnowledge);

    const max = agreement.shadowSubject.area.replicationArea.maximum;
    const max_depth = Math.min(Number(max ?? MAX_DEPTH), MAX_DEPTH);
    if ((depth >= max_depth) && !extKnowledgeOnly) {
        if (getExtendedKnowledge) {
            extended = true;
        } else {
            return;
        }
    }

    if (is_chopped && !is_chopped_before && !extKnowledgeOnly) {
        if (getExtendedKnowledge) {
            extended = true;
        } else {
            return; // We don't process this DSE's subordinates.
        }
    }

    const refinement = agreement.shadowSubject.area.replicationArea.specificationFilter;

    let cursorId: number | undefined;
    const getNextBatchOfUnmentionedSubordinates = () => {
        return readSubordinates(ctx, vertex, 100, undefined, cursorId, { // TODO: Configurable page size.
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
    const subtrees: Subtree[] = [];
    while (subordinates.length > 0) {
        /* Why not just use `.deleteMany()`? Because the subordinates also have
        to be evaluated for whether they fall within or without the specific
        exclusions of the subtree. Theoretically, this could still be done using
        their RDNs alone, but simple recursion was by far the most elegant
        solution. */
        const sub_refreshes = await bPromise.map(subordinates, (subordinate: Vertex) => createTotalRefreshFromVertex(
            ctx,
            subordinate,
            agreement,
            obid,
            [ ...localName, subordinate.dse.rdn ],
            depth + 1,
            extended,
        ), {
            concurrency: 4, // FIXME:
        });
        const last_subordinate = subordinates[subordinates.length - 1];
        cursorId = last_subordinate?.dse.id;
        subordinates = await getNextBatchOfUnmentionedSubordinates();
        for (let i = 0; i < sub_refreshes.length; i++) {
            const sr = sub_refreshes[i];
            if (!sr || sr[1]) { // If the subordinate is chopped or to be pruned...
                continue;
            }
            const rdn = subordinates[i].dse.rdn;
            subtrees.push(new Subtree(rdn, sr[0].sDSE, sr[0].subtree));
        }
    }
    const allSubordinatesCount = (await ctx.db.entry.count({
        where: {
            ...getEntryExistsFilter(),
            immediate_superior_id: vertex.dse.id,
        },
    }));
    const subComplete: boolean = (allSubordinatesCount === subtrees.length);
    /**
     * This SDSE is to be pruned from the total refresh if we are (1) just
     * fetching subordinate references per `extendedKnowledge` (see X.525) AND
     * (2) this is a leaf DSE and (3) there are no subordinate references
     * associated with it.
     *
     * Theoretically, if there are subordinate references that are beneath the
     * replicated area, but not leaf nodes, they could get cut off, but that
     * arrangement makes no sense anyway. As far as I know, a `subr` or `nssr`
     * should always be a leaf node in a valid DSAIT.
     */
    const to_be_pruned: boolean = (
        extKnowledgeOnly
        && (allSubordinatesCount === 0)
        && (content.attributes.length === 0)
    );
    return [
        new TotalRefresh(
            content
                ? new SDSEContent(
                    content.sDSEType,
                    subComplete,
                    content.attComplete,
                    content.attributes,
                    content.attValIncomplete,
                )
                : undefined,
            subtrees,
        ),
        to_be_pruned,
    ];
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
        throw new Error();
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
        throw new Error();
    }
    return (await createTotalRefreshFromVertex(
        ctx,
        base,
        agreement,
        obid,
        [],
        base_dn.length,
    ))?.[0];
}
