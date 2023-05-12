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
import * as x500at from "@wildboar/x500/src/lib/collections/attributes";
import { userPwdHistory } from "@wildboar/x500/src/lib/modules/PasswordPolicy/userPwdHistory.oa";
import { userPwdRecentlyExpired } from "@wildboar/x500/src/lib/modules/PasswordPolicy/userPwdRecentlyExpired.oa";
import {
    entryUUID,
} from "@wildboar/parity-schema/src/lib/modules/UUID/entryUUID.oa";
import {
    superiorUUID,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/superiorUUID.oa";

export
const mandatoryReplicatedAttributeTypes: string[] = [
    x500at.createTimestamp["&id"].toString(),
    x500at.modifyTimestamp["&id"].toString(),
    x500at.pwdModifyEntryAllowed["&id"].toString(),
    x500at.pwdChangeAllowed["&id"].toString(),
    x500at.pwdMaxAge["&id"].toString(),
    x500at.pwdExpiryAge["&id"].toString(),
    x500at.pwdMinLength["&id"].toString(),
    x500at.pwdVocabulary["&id"].toString(),
    x500at.pwdAlphabet["&id"].toString(),
    x500at.pwdDictionaries["&id"].toString(),
    x500at.pwdExpiryWarning["&id"].toString(),
    x500at.pwdGraces["&id"].toString(),
    x500at.pwdFailureDuration["&id"].toString(),
    x500at.pwdLockoutDuration["&id"].toString(),
    x500at.pwdMaxFailures["&id"].toString(),
    x500at.pwdMaxTimeInHistory["&id"].toString(),
    x500at.pwdMinTimeInHistory["&id"].toString(),
    x500at.pwdHistorySlots["&id"].toString(),
    x500at.pwdRecentlyExpiredDuration["&id"].toString(),
    x500at.pwdEncAlg["&id"].toString(),
    x500at.pwdStartTime["&id"].toString(),
    x500at.pwdExpiryTime["&id"].toString(),
    x500at.pwdEndTime["&id"].toString(),
    x500at.pwdAttribute["&id"].toString(),
    userPwdHistory["&id"].toString(),
    userPwdRecentlyExpired["&id"].toString(),
    x500at.pwdAdminSubentryList["&id"].toString(),
    x500at.subentryACI["&id"].toString(),
    x500at.entryACI["&id"].toString(),
    x500at.subentryACI["&id"].toString(),
    x500at.accessControlScheme["&id"].toString(),
    x500at.clearance["&id"].toString(),
    x500at.specificKnowledge["&id"].toString(),
    x500at.nonSpecificKnowledge["&id"].toString(),
    x500at.objectClasses["&id"].toString(),
    x500at.administrativeRole["&id"].toString(),
    x500at.governingStructureRule["&id"].toString(),
    x500at.structuralObjectClass["&id"].toString(),
    x500at.subschemaTimestamp["&id"].toString(),
    entryUUID["&id"].toString(),
    superiorUUID["&id"].toString(),
    x500at.searchRules["&id"].toString(),
    x500at.subtreeSpecification["&id"].toString(),
];

export
async function getSDSEContent (
    ctx: Context,
    vertex: Vertex,
    agreement: ShadowingAgreementInfo,
    knowledgeOnly: boolean = false,
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

    if (knowledgeOnly) {
        const {
            operationalAttributes: attributes,
        } = await readAttributes(ctx, vertex, {
            selection: new EntryInformationSelection(
                undefined,
                undefined,
                {
                    select: [
                        x500at.specificKnowledge["&id"],
                        x500at.nonSpecificKnowledge["&id"],
                    ],
                },
            ),
        });
        return new SDSEContent(
            sdse_type,
            FALSE, // Leave this alone. It needs to be set once we've assembled the subordinates.
            FALSE,
            attributes,
            undefined,
        );
    }

    // NOTE: operational attributes should be in `include`.
    let all_user_attributes: boolean = false;
    const inclusions: Set<IndexableOID> = new Set(mandatoryReplicatedAttributeTypes);
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
