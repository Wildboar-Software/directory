import { Context, IndexableOID, StoredAttributeValueWithContexts, StoredContext, Entry } from "../../types";
import {
    AddEntryArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AddEntryArgumentData.ta";
import nameToString from "@wildboar/x500/src/lib/stringifiers/nameToString";
import {
    id_at_objectClass,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-at-objectClass.va";
import type {
    AttributeType,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";
import {
    AttributeError,
    SecurityError,
    ServiceError,
    UpdateError,
} from "../errors";
import {
    UpdateErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateErrorData.ta";
import type {
    Name,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Name.ta";
import {
    UpdateProblem_noSuchSuperior,
    UpdateProblem_objectClassViolation,
    UpdateProblem_entryAlreadyExists,
    UpdateProblem_namingViolation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateProblem.ta";
import {
    AttributeProblem_undefinedAttributeType,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeProblem.ta";
import {
    id_doa_dseType,
} from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/id-doa-dseType.va";
import {
    _decode_DSEType,
    DSEType_alias,
} from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/DSEType.ta";
// import {
//     id_oa_hierarchyTop,
// } from "@wildboar/x500/src/lib/modules/InformationFramework/id-oa-hierarchyTop.va";
// import {
//     id_oa_hierarchyLevel,
// } from "@wildboar/x500/src/lib/modules/InformationFramework/id-oa-hierarchyLevel.va";
// import {
//     id_oa_hierarchyBelow,
// } from "@wildboar/x500/src/lib/modules/InformationFramework/id-oa-hierarchyBelow.va";
// import {
//     id_oa_hierarchyParent,
// } from "@wildboar/x500/src/lib/modules/InformationFramework/id-oa-hierarchyParent.va";
import {
    ServiceControlOptions_manageDSAIT,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import {
    AttributeUsage_userApplications,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import {
    AttributeErrorData_problems_Item,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData-problems-Item.ta";
import { ObjectIdentifier, TRUE_BIT } from "asn1-ts";
import { v4 as uuid } from "uuid";
import {
    EXT_BIT_MANAGE_DSA_IT,
    EXT_BIT_USE_OF_CONTEXTS,
} from "../../x500/extensions";
import { AttributeErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData.ta";
import {
    SecurityErrorData,
    SecurityProblem_insufficientAccessRights,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import {
    ServiceErrorData,
    ServiceProblem_unavailable,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    AddEntryResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AddEntryResult.ta";


const FORBIDDEN_SUPERIOR_TYPES: Set<number> = new Set([
    DSEType_alias,
]);

const OBJECT_CLASS_ATTR_OID: string = id_at_objectClass.toString();
const DSE_TYPE_ATTR_OID: string = id_doa_dseType.toString();
// const HIERARCHY_TOP_ATTR_OID: string = id_oa_hierarchyTop.toString();
// const HIERARCHY_BELOW_ATTR_OID: string = id_oa_hierarchyBelow.toString();
// const HIERARCHY_LEVEL_ATTR_OID: string = id_oa_hierarchyLevel.toString();
// const HIERARCHY_PARENT_ATTR_OID: string = id_oa_hierarchyParent.toString();

const OBJECT_CLASS_ERROR_DATA = new UpdateErrorData(
    UpdateProblem_objectClassViolation,
    undefined,
    [],
    undefined,
    undefined,
    undefined,
    undefined,
);
const NO_SUCH_SUPERIOR_ERROR_DATA = new UpdateErrorData(
    UpdateProblem_noSuchSuperior,
    undefined,
    [],
    undefined,
    undefined,
    undefined,
    undefined,
);
const ENTRY_EXISTS_ERROR_DATA = new UpdateErrorData(
    UpdateProblem_entryAlreadyExists,
    undefined,
    [],
    undefined,
    undefined,
    undefined,
    undefined,
);
const CANNOT_MANAGE_OPERATIONAL_ATTRIBUTES_ERROR_DATA = new SecurityErrorData(
    SecurityProblem_insufficientAccessRights,
    undefined,
    undefined,
    [],
    undefined,
    undefined,
    undefined,
    undefined,
);

function missingAttributeErrorData (attributeTypes: AttributeType[]): UpdateErrorData {
    return new UpdateErrorData(
        UpdateProblem_objectClassViolation,
        attributeTypes.map((at) => ({
            attributeType: at,
        })),
        [],
        undefined,
        undefined,
        undefined,
        undefined,
    );
}

function namingViolationErrorData (attributeTypes: AttributeType[]): UpdateErrorData {
    return new UpdateErrorData(
        UpdateProblem_namingViolation,
        attributeTypes.map((at) => ({
            attributeType: at,
        })),
        [],
        undefined,
        undefined,
        undefined,
        undefined,
    );
}

function unrecognizedAttributeErrorData (
    name: Name,
    attributeTypes: AttributeType[],
): AttributeErrorData {
    return new AttributeErrorData(
        name,
        attributeTypes.map((at) => new AttributeErrorData_problems_Item(
            AttributeProblem_undefinedAttributeType,
            at,
            undefined,
        )),
        [],
        undefined,
        undefined,
        undefined,
        undefined,
    );
}

export
async function addEntry (
    ctx: Context,
    data: AddEntryArgumentData,
): Promise<AddEntryResult> {
    if (data.object.rdnSequence.length === 0) {
        throw new UpdateError(
            "An entry having zero RDNs cannot be inserted. "
            + "The zero-RDN entry is the automatically-managed root DSE.",
            namingViolationErrorData([]),
        );
    }
    const entries = Array.from(ctx.database.data.entries.values());
    const entryDN = nameToString(data.object);
    if (entries.some((e) => e.dn === entryDN)) {
        throw new UpdateError(`Entry already exists: ${entryDN}`, ENTRY_EXISTS_ERROR_DATA);
    }
    const superiorDN = nameToString({
        rdnSequence: data.object.rdnSequence.slice(1),
    });
    const superior = entries.find((e) => e.dn === superiorDN);
    if (!superior) {
        throw new UpdateError(`No such superior: ${superiorDN}`, NO_SUCH_SUPERIOR_ERROR_DATA);
    }
    // Using .find() is fine here, because dseType is single-valued.
    const superiorDSETypeAttr = ctx.database.data.values.find((v) => (
        (v.entry === superior.id) // This attribute belongs to the superior.
        && (v.id.toString() === DSE_TYPE_ATTR_OID)
    ));
    if (superiorDSETypeAttr) {
        const superiorDSEType = _decode_DSEType(superiorDSETypeAttr.value);
        superiorDSEType.forEach((b, i) => {
            if (FORBIDDEN_SUPERIOR_TYPES.has(i)) {
                throw new UpdateError(
                    "New entry inserted below an entry of a forbidden DSE type, such as an alias.",
                    namingViolationErrorData([]),
                );
            }
        });
    }

    const entry = uuid();
    const attrsFromDN: StoredAttributeValueWithContexts[] = data.object
        .rdnSequence[0]
        .map((atav): StoredAttributeValueWithContexts => ({
            entry,
            id: atav.type_,
            value: atav.value,
            contexts: new Map([]),
        }));

    const attrs: StoredAttributeValueWithContexts[] = data.entry.flatMap((attr) => [
        ...attr.values.map((value): StoredAttributeValueWithContexts => ({
            entry,
            id: attr.type_,
            value,
            contexts: new Map([]),
        })),
        ...attr.valuesWithContext?.map((vwc): StoredAttributeValueWithContexts => ({
            entry,
            id: attr.type_,
            value: vwc.value,
            contexts: new Map(
                vwc.contextList.map((context): [ string, StoredContext ] => [
                    context.contextType.toString(),
                    {
                        id: context.contextType,
                        fallback: context.fallback ?? false,
                        values: context.contextValues,
                    },
                ]),
            ),
        })) ?? [],
    ]);

    const attributesByType: Map<IndexableOID, StoredAttributeValueWithContexts[]> = new Map();
    const nonUserApplicationAttributes: AttributeType[] = [];
    const unrecognizedAttributes: AttributeType[] = [];
    const attributesUsingContexts: AttributeType[] = [];
    attrs.forEach((attr) => {
        const ATTR_OID: string = attr.id.toString();
        const current = attributesByType.get(ATTR_OID);
        if (!current) {
            attributesByType.set(ATTR_OID, [ attr ]);
        } else {
            current.push(attr);
        }
        const spec = ctx.attributes.get(ATTR_OID);
        if (!spec) {
            unrecognizedAttributes.push(attr.id);
            return;
        }
        if (spec.usage !== AttributeUsage_userApplications) {
            nonUserApplicationAttributes.push(attr.id);
        }
        if (attr.contexts.size > 0) {
            attributesUsingContexts.push(attr.id);
        }
    });

    if (unrecognizedAttributes.length > 0) {
        throw new AttributeError(
            `Unrecognized attributes: ${unrecognizedAttributes.map((at) => at.toString()).join(", ")}.`,
            unrecognizedAttributeErrorData(data.object, unrecognizedAttributes),
        );
    }

    const useOfContexts = (data.criticalExtensions?.[EXT_BIT_USE_OF_CONTEXTS] === TRUE_BIT);
    if (!useOfContexts && (attributesUsingContexts.length > 0)) {
        throw new ServiceError(
            "Use of contexts was not enabled by the request.",
            new ServiceErrorData(
                ServiceProblem_unavailable,
                [],
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        );
    }

    const objectClasses = attrs.filter((attr) => attr.id.toString() === OBJECT_CLASS_ATTR_OID);
    if (objectClasses.length === 0) {
        throw new UpdateError("Object class attribute not found.", OBJECT_CLASS_ERROR_DATA);
    }

    objectClasses
        .map((oc) => ctx.objectClasses.get(oc.id.toString()))
        .forEach((oc, i) => {
            if (!oc) {
                ctx.log.warn(
                    `Object class ${objectClasses[i]?.id?.toString()} not understood.`,
                );
                return;
            }
            const missingMandatoryAttributes: ObjectIdentifier[] = Array
                .from(oc.mandatoryAttributes.values())
                .filter((mandate): boolean => !attributesByType.has(mandate))
                .map((mandate: string) => new ObjectIdentifier(
                    mandate.split(".").map(Number.parseInt),
                ));
            if (missingMandatoryAttributes.length > 0) {
                throw new UpdateError(
                    `Missing mandatory attributes: ${missingMandatoryAttributes.map((ma) => ma.toString())}.`,
                    missingAttributeErrorData(missingMandatoryAttributes),
                );
            }
            // Optional attributes are not checked.
        });

    const rdnAttributes: Set<IndexableOID> = new Set();
    const duplicatedAFDNs: AttributeType[] = [];
    const unrecognizedAFDNs: AttributeType[] = [];
    const cannotBeUsedInNameAFDNs: AttributeType[] = [];
    const unmatchedAFDNs: AttributeType[] = [];

    attrsFromDN
        .forEach((afdn): void => {
            const oid: string = afdn.id.toString();
            if (rdnAttributes.has(oid)) {
                duplicatedAFDNs.push(afdn.id);
                return;
            } else {
                rdnAttributes.add(oid);
            }
            const spec = ctx.attributes.get(afdn.id.toString());
            if (!spec) {
                unrecognizedAFDNs.push(afdn.id);
                return;
            }
            const matcher = spec.namingMatcher;
            if (!matcher) {
                cannotBeUsedInNameAFDNs.push(afdn.id);
                return;
            }
            const someAttributeMatched = attrs.some((attr) => (
                (attr.contexts.size === 0)
                && (attr.id.toString() === afdn.id.toString())
                && matcher(attr.value, afdn.value)
            ));
            if (!someAttributeMatched) {
                unmatchedAFDNs.push(afdn.id);
                return;
            }
        });

    if (duplicatedAFDNs.length > 0) {
        throw new UpdateError(
            "Attributes of the following types in the RDNs of the entry were "
            + `duplicated: ${duplicatedAFDNs.join(", ")}`,
            namingViolationErrorData(duplicatedAFDNs),
        );
    }

    if (unrecognizedAFDNs.length > 0) {
        throw new UpdateError(
            "Attributes of the following types in the RDNs of the entry were "
            + `not recognized, and therefore cannot be used for naming: ${unrecognizedAFDNs.join(", ")}`,
            namingViolationErrorData(unrecognizedAFDNs),
        );
    }

    if (cannotBeUsedInNameAFDNs.length > 0) {
        throw new UpdateError(
            "Attributes of the following types in the RDNs of the entry are "
            + `innately not suitable for naming: ${cannotBeUsedInNameAFDNs.join(", ")}`,
            namingViolationErrorData(cannotBeUsedInNameAFDNs),
        );
    }

    if (unmatchedAFDNs.length > 0) {
        throw new UpdateError(
            "Attributes of the following types in the RDNs of the entry did not "
            + `have matching values in the attributes: ${unmatchedAFDNs.join(", ")}`,
            namingViolationErrorData(unmatchedAFDNs),
        );
    }

    /**
     * throw parentNotAncestor if the parent is a part of a compound entry, but
     * it is not the ancestor of that compound entry. From what I can tell, this
     * means checking that the parent is not of object class `child`. (X.501, Section 8.11.)
     *
     * 7.1.2 ancestor: The entry at the root of the hierarchy of family members that comprise a compound entry.
     *
     * 7.1.3
compound entry: A representation of an object in terms of family members that are hierarchically organized
into one or more families of entries.

X.501, Section 14.10:
If the immediately hierarchical parent is a compound entry, the value shall be the distinguished name
of the ancestor. Otherwise, the Directory shall return an Update Error with problem parentNotAncestor .
     */
    // const hierarchyLevelAttr = attrs.find((attr) => (attr.id.toString() === HIERARCHY_LEVEL_ATTR_OID));
    // const hierarchyTopAttr = attrs.find((attr) => (attr.id.toString() === HIERARCHY_TOP_ATTR_OID));
    // const hierarchyBelowAttr = attrs.find((attr) => (attr.id.toString() === HIERARCHY_BELOW_ATTR_OID));
    // const hierarchyParentAttr = attrs.find((attr) => (attr.id.toString() === HIERARCHY_PARENT_ATTR_OID));


    // How do you insert DSEs of any non-entry type if dseType is an operational attribute?
    // const dseTypeAttr = attrs.find((v) => (v.id.toString() === DSE_TYPE_ATTR_OID));
    // X.511, Section 7.12 specifies this exactly:
    // – the manageDSAIT extension bit shall be set;
    // – the manageDSAIT option shall be set;
    // – the manageDSAITPlaneRef option shall be included if a specific replication plane is to be managed.
    const manageDSAITExtension: boolean = (data.criticalExtensions?.[EXT_BIT_MANAGE_DSA_IT] === TRUE_BIT);
    const manageDSAITSCO: boolean = (data.serviceControls?.options?.[ServiceControlOptions_manageDSAIT] === TRUE_BIT);
    // Only necessary if a specific DSA IT is to be managed.
    // const manageDSAITPlaneRef = data.serviceControls?.manageDSAITPlaneRef;
    const requestedToManageDSA: boolean = (manageDSAITExtension && manageDSAITSCO);

    if (requestedToManageDSA) {
    // TODO: aliases contain aliasedEntryName
    // TODO: aliased entry exists
    // TODO: aliases are not allowed to point to other aliases
    } else if (nonUserApplicationAttributes.length > 0) {
        throw new SecurityError(
            "Operational attributes may not be managed without setting the manageDSAIT flag.",
            CANNOT_MANAGE_OPERATIONAL_ATTRIBUTES_ERROR_DATA,
        );
    }

    const newEntry: Entry = {
        id: entry,
        dn: entryDN,
        parent: superior.id,
    };
    ctx.database.data.entries.set(entry, newEntry);
    ctx.database.data.values.push(...attrsFromDN, ...attrs);
    console.log(ctx.database.data);
    return {
        null_: null,
    };
}

export default addEntry;
