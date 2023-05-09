import type { Context, IndexableOID, Vertex } from "@wildboar/meerkat-types";
import {
    ShadowingAgreementInfo,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/ShadowingAgreementInfo.ta";
import { SDSEContent } from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/Subtree.ta";
import { FALSE, FALSE_BIT, ObjectIdentifier, TRUE, TRUE_BIT } from "asn1-ts";
import readAttributes from "../database/entry/readAttributes";
import {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import {
    ClassAttributeSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/ClassAttributeSelection.ta";
import valuesFromAttribute from "../x500/valuesFromAttribute";
import attributesFromValues from "../x500/attributesFromValues";

export
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
        all_user_attributes || undefined,
        attributes,
        attValIncomplete,
    );
}

export default getSDSEContent;