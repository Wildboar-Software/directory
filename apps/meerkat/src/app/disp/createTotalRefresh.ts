import type { Context, IndexableOID, Vertex } from "@wildboar/meerkat-types";
import {
    ShadowingAgreementInfo,
    _decode_ShadowingAgreementInfo,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/ShadowingAgreementInfo.ta";
import { SDSEContent, Subtree, TotalRefresh } from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/Subtree.ta";
import { BERElement, FALSE, FALSE_BIT, ObjectIdentifier, TRUE, TRUE_BIT } from "asn1-ts";
import dnToVertex from "../dit/dnToVertex";
import readSubordinates from "../dit/readSubordinates";
import { convert_refinement_to_prisma_filter } from "./operations/updateShadow";
import bPromise from "bluebird";
import { LocalName } from "@wildboar/x500/src/lib/modules/InformationFramework/LocalName.ta";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";
import { compareDistinguishedName } from "@wildboar/x500";
import readAttributes from "../database/entry/readAttributes";
import { EntryInformationSelection } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import { ClassAttributeSelection } from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/ClassAttributeSelection.ta";
import valuesFromAttribute from "../x500/valuesFromAttribute";
import attributesFromValues from "../x500/attributesFromValues";
import getEntryExistsFilter from "../database/entryExistsFilter";

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

async function getSDSEContent (
    ctx: Context,
    vertex: Vertex,
    agreement: ShadowingAgreementInfo,
): Promise<SDSEContent> {
    // root , glue , cp , entry , alias , subr , nssr , admPoint , subEntry and sa.
    const sdse_type = new Uint8ClampedArray([
        vertex.dse.root ? TRUE_BIT : FALSE_BIT, // root
        vertex.dse.glue ? TRUE_BIT : FALSE_BIT, // glue
        vertex.dse.cp ? TRUE_BIT : FALSE_BIT, // cp
        vertex.dse.entry ? TRUE_BIT : FALSE_BIT, // entry
        vertex.dse.alias ? TRUE_BIT : FALSE_BIT, // alias
        vertex.dse.subr ? TRUE_BIT : FALSE_BIT, // subr
        vertex.dse.nssr ? TRUE_BIT : FALSE_BIT, // nssr
        FALSE_BIT, // supr
        FALSE_BIT, // xr
        vertex.dse.admPoint ? TRUE_BIT : FALSE_BIT, // admPoint
        vertex.dse.subentry ? TRUE_BIT : FALSE_BIT, // subentry
        FALSE_BIT, // shadow
        FALSE_BIT, // immSupr
        FALSE_BIT, // rhob
        vertex.dse.sa ? TRUE_BIT : FALSE_BIT, // sa
        vertex.dse.dsSubentry ? TRUE_BIT : FALSE_BIT, // dsSubentry
        /* DEVIATION: The spec says that familyMember can't be set in SDSEType,
        but I don't see why you wouldn't do that. */
        vertex.dse.familyMember ? TRUE_BIT : FALSE_BIT, // familyMember
        FALSE_BIT, // ditBridge
    ]);

    // NOTE: operational attributes should be in `include`.
    let all_user_attributes: boolean = false;
    const inclusions: Set<IndexableOID> = new Set();
    const exclusions: Set<IndexableOID> = new Set();

    for (const class_attrs of agreement.shadowSubject.attributes) {
        const attrs = class_attrs.classAttributes ?? ClassAttributeSelection._default_value_for_classAttributes;

        // The fact that objectClass contains superclasses implicitly satisfies
        // the application of the attribute selection to subclasses.
        const applies: boolean = !class_attrs.class_ || vertex.dse.objectClass.has(class_attrs.class_.toString());
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

    const {
        userAttributes,
        operationalAttributes,
        /* DEVIATION: X.525, Section 9.2.2 states that collective attributes are
        replicated. I don't know if this means CAs within subentries, though. */
        // collectiveAttributes,
        attValIncomplete,
    } = await readAttributes(ctx, vertex, {
        selection: new EntryInformationSelection(
            all_user_attributes
                ? {
                    allUserAttributes: null,
                }
                : {
                    select: Array.from(inclusions).map(ObjectIdentifier.fromString),
                },
            undefined,
            {
                select: Array.from(inclusions).map(ObjectIdentifier.fromString),
            },
            agreement.shadowSubject.contextSelection,
            TRUE,
        ),
    });

    let attributes = [
        ...userAttributes,
        ...operationalAttributes,
    ].filter((a) => !exclusions.has(a.type_.toString()));

    if (agreement.shadowSubject.supplyContexts) {
        if ("allContexts" in agreement.shadowSubject.supplyContexts) {
            // Do nothing. Just leave the contexts.
        }
        else if ("selectedContexts" in agreement.shadowSubject.supplyContexts) {
            const sc: Set<IndexableOID> = new Set(
                agreement.shadowSubject.supplyContexts.selectedContexts
                    .map((c) => c.toString()),
            );
            const values = attributes.flatMap(valuesFromAttribute);
            for (const value of values) {
                if (value.contexts) {
                    value.contexts = value.contexts
                        .filter((c) => sc.has(c.contextType.toString()));
                    if (value.contexts.length === 0) {
                        delete value.contexts;
                    }
                }
            }
            attributes = attributesFromValues(values);
        }
    } else {
        for (const attr of attributes) {
            if (!attr.valuesWithContext?.length) {
                continue;
            }
            for (const vwc of attr.valuesWithContext) {
                attr.values.push(vwc.value);
            }
        }
    }

    return new SDSEContent(
        sdse_type,
        FALSE, // Leave this alone. It needs to be set once we've assembled the subordinates.
        all_user_attributes,
        attributes,
        attValIncomplete,
    );
}

async function createTotalRefreshFromVertex (
    ctx: Context,
    vertex: Vertex,
    agreement: ShadowingAgreementInfo,
    obid: number,
    localName: LocalName,
    depth: number,
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

    if (is_chopped && is_chopped_before) {
        return; // We don't process this DSE.
    }

    const content = await getSDSEContent(ctx, vertex, agreement);

    const max = agreement.shadowSubject.area.replicationArea.maximum;
    const max_depth = Math.min(Number(max ?? MAX_DEPTH), MAX_DEPTH);
    if (depth >= max_depth) {
        return;
    }

    if (is_chopped && !is_chopped_before) {
        return; // We don't process this DSE's subordinates.
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
        ), {
            concurrency: 4, // FIXME:
        });
        const last_subordinate = subordinates[subordinates.length - 1];
        cursorId = last_subordinate?.dse.id;
        subordinates = await getNextBatchOfUnmentionedSubordinates();
        for (let i = 0; i < sub_refreshes.length; i++) {
            const sr = sub_refreshes[i];
            if (!sr) {
                continue;
            }
            const rdn = subordinates[i].dse.rdn;
            subtrees.push(new Subtree(rdn, sr.sDSE, sr.subtree));
        }
    }
    const allSubordinatesCount = (await ctx.db.entry.count({
        where: {
            ...getEntryExistsFilter(),
            immediate_superior_id: vertex.dse.id,
        },
    }));
    const subComplete: boolean = (allSubordinatesCount === subtrees.length);
    return new TotalRefresh(
        new SDSEContent(
            content.sDSEType,
            subComplete,
            content.attComplete,
            content.attributes,
            content.attValIncomplete,
        ),
        subtrees,
    );
}

export
async function createTotalRefresh (
    ctx: Context,
    obid: number,
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
    const agreement = _decode_ShadowingAgreementInfo(agreementElement);
    const cp_dn = agreement.shadowSubject.area.contextPrefix;
    const base_dn = agreement.shadowSubject.area.replicationArea.base
        ? [ ...cp_dn, ...agreement.shadowSubject.area.replicationArea.base ]
        : cp_dn;
    const base = await dnToVertex(ctx, ctx.dit.root, base_dn);
    if (!base) {
        throw new Error();
    }
    return createTotalRefreshFromVertex(
        ctx,
        base,
        agreement,
        obid,
        [],
        base_dn.length,
    );
}
