import { Context, IndexableOID, Value, StoredContext, Vertex, ClientConnection } from "../types";
import type { InvokeId } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/InvokeId.ta";
import * as errors from "../errors";
import {
    _decode_AddEntryArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AddEntryArgument.ta";
import {
    id_at_objectClass,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-at-objectClass.va";
import {
    id_sc_subentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-sc-subentry.va";
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
import {
    UpdateProblem_objectClassViolation,
    UpdateProblem_entryAlreadyExists,
    UpdateProblem_namingViolation,
    UpdateProblem_affectsMultipleDSAs,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateProblem.ta";
import {
    AttributeProblem_undefinedAttributeType,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeProblem.ta";
import {
    ServiceControlOptions_manageDSAIT,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import {
    AttributeUsage_userApplications,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import {
    AttributeErrorData_problems_Item,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData-problems-Item.ta";
import { DERElement, ObjectIdentifier, OBJECT_IDENTIFIER, TRUE_BIT } from "asn1-ts";
import {
    EXT_BIT_USE_OF_CONTEXTS,
} from "../x500/extensions";
import { AttributeErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData.ta";
import {
    SecurityErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import {
    ServiceErrorData,
    ServiceProblem_unavailable,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    _encode_AddEntryResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AddEntryResult.ta";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
import readChildren from "../dit/readChildren";
import getRDN from "../x500/getRDN";
import {
    Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1 as ChainedArgument,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ArgumentType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1 as ChainedResult,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ResultType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    ChainingResults,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingResults.ta";
import compareRDN from "@wildboar/x500/src/lib/comparators/compareRelativeDistinguishedName";
import createEntry from "../database/createEntry";
import {
    SecurityProblem_insufficientAccessRights,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import getRelevantSubentries from "../dit/getRelevantSubentries";
import accessControlSchemesThatUseSubentryACI from "../authz/accessControlSchemesThatUseSubentryACI";
import accessControlSchemesThatUsePrescriptiveACI from "../authz/accessControlSchemesThatUsePrescriptiveACI";
import type ACDFTuple from "@wildboar/x500/src/lib/types/ACDFTuple";
import type ACDFTupleExtended from "@wildboar/x500/src/lib/types/ACDFTupleExtended";
import bacACDF, {
    PERMISSION_CATEGORY_ADD,
} from "@wildboar/x500/src/lib/bac/bacACDF";
import getACDFTuplesFromACIItem from "@wildboar/x500/src/lib/bac/getACDFTuplesFromACIItem";
import type EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import getIsGroupMember from "../bac/getIsGroupMember";
import userWithinACIUserClass from "@wildboar/x500/src/lib/bac/userWithinACIUserClass";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    updateError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/updateError.oa";
import {
    securityError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/securityError.oa";
import {
    attributeError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/attributeError.oa";
import {
    serviceError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/serviceError.oa";
import {
    id_opcode_addEntry,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-addEntry.va";

function namingViolationErrorData (
    ctx: Context,
    conn: ClientConnection,
    attributeTypes: AttributeType[],
): UpdateErrorData {
    return new UpdateErrorData(
        UpdateProblem_namingViolation,
        attributeTypes.map((at) => ({
            attributeType: at,
        })),
        [],
        createSecurityParameters(
            ctx,
            conn.boundNameAndUID?.dn,
            undefined,
            updateError["&errorCode"],
        ),
        ctx.dsa.accessPoint.ae_title.rdnSequence,
        undefined,
        undefined,
    );
}

export
async function addEntry (
    ctx: Context,
    conn: ClientConnection,
    invokeId: InvokeId,
    immediateSuperior: Vertex,
    admPoints: Vertex[],
    request: ChainedArgument,
): Promise<ChainedResult> {
    const argument = _decode_AddEntryArgument(request.argument);
    const data = getOptionallyProtectedValue(argument);
    if (immediateSuperior.dse.alias) {
        throw new UpdateError(
            "New entry inserted below an entry of a forbidden DSE type, such as an alias.",
            namingViolationErrorData(ctx, conn, []),
        );
    }
    const EQUALITY_MATCHER = (
        attributeType: OBJECT_IDENTIFIER,
    ): EqualityMatcher | undefined => ctx.attributes.get(attributeType.toString())?.equalityMatcher;
    const NAMING_MATCHER = (
        attributeType: OBJECT_IDENTIFIER,
    ) => ctx.attributes.get(attributeType.toString())?.namingMatcher;

    // TODO: use memory/valuesFromAttribute
    const attrs: Value[] = data.entry.flatMap((attr) => [
        ...attr.values.map((value): Value => ({
            id: attr.type_,
            value,
            contexts: new Map([]),
        })),
        ...attr.valuesWithContext?.map((vwc): Value => ({
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

    const objectClassValues = attrs.filter((attr) => attr.id.isEqualTo(id_at_objectClass));
    if (objectClassValues.length === 0) {
        throw new UpdateError(
            "Object class attribute not found.",
            new UpdateErrorData(
                UpdateProblem_objectClassViolation,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    conn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                undefined,
                undefined,
                undefined,
            ),
        );
    }
    const objectClasses: OBJECT_IDENTIFIER[] = objectClassValues.map((ocv) => ocv.value.objectIdentifier);

    // TODO: Check that all superclasses are present.

    /**
     * From ITU X.501 (2016), Section 13.3.2:
     *
     * > There shall be one value of the objectClass attribute for the entry's
     * > structural object class and a value for each of its superclasses. top
     * > may be omitted.
     *
     * This means that we can determine if this potential new entry is a
     * subentry by checking that the `subentry` object class is present.
     */
    const isSubentry: boolean = objectClasses.some((oc) => oc.isEqualTo(id_sc_subentry));
    if (isSubentry && !immediateSuperior.dse.admPoint) {
        throw new errors.UpdateError(
            "Cannot place a subentry below a DSE that is not an administrative point.",
            new UpdateErrorData(
                UpdateProblem_namingViolation,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    conn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                undefined,
                undefined,
                undefined,
            ),
        );
    }

    if (isSubentry && data.targetSystem) {
        throw new errors.UpdateError(
            "Cannot place a subentry in another DSA.",
            new UpdateErrorData(
                UpdateProblem_affectsMultipleDSAs,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    conn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                undefined,
                undefined,
                undefined,
            ),
        );
    }

    const targetDN = data.object.rdnSequence;
    const relevantSubentries: Vertex[] = (await Promise.all(
        admPoints.map((ap) => getRelevantSubentries(ctx, objectClasses, targetDN, ap)),
    )).flat();
    const accessControlScheme = admPoints
        .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
    const AC_SCHEME: string = accessControlScheme?.toString() ?? "";
    const relevantACIItems = isSubentry
        ? [
            ...(accessControlSchemesThatUseSubentryACI.has(AC_SCHEME)
                ? (immediateSuperior.dse.admPoint?.subentryACI ?? [])
                : []),
        ]
        : [
            ...(accessControlSchemesThatUsePrescriptiveACI.has(AC_SCHEME)
                ? relevantSubentries.flatMap((subentry) => subentry.dse.subentry!.prescriptiveACI ?? [])
                : []),
        ];
    const acdfTuples: ACDFTuple[] = (relevantACIItems ?? [])
        .flatMap((aci) => getACDFTuplesFromACIItem(aci));
    const isMemberOfGroup = getIsGroupMember(ctx, EQUALITY_MATCHER);
    const relevantTuples: ACDFTupleExtended[] = (await Promise.all(
        acdfTuples.map(async (tuple): Promise<ACDFTupleExtended> => [
            ...tuple,
            await userWithinACIUserClass(
                tuple[0],
                conn.boundNameAndUID!, // FIXME:
                targetDN,
                EQUALITY_MATCHER,
                isMemberOfGroup,
            ),
        ]),
    ))
        .filter((tuple) => (tuple[5] > 0));
    if (accessControlScheme) {
        const {
            authorized,
        } = bacACDF(
            relevantTuples,
            conn.authLevel,
            {
                entry: objectClasses,
            },
            [
                PERMISSION_CATEGORY_ADD,
            ],
            EQUALITY_MATCHER,
        );
        if (!authorized) {
            throw new errors.SecurityError(
                "Not permitted to create this entry.",
                new SecurityErrorData(
                    SecurityProblem_insufficientAccessRights,
                    undefined,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        conn.boundNameAndUID?.dn,
                        undefined,
                        securityError["&errorCode"],
                    ),
                    undefined,
                    undefined,
                    undefined,
                ),
            );
        }
    }

    const rdn = getRDN(data.object.rdnSequence);
    if (!rdn) {
        throw new UpdateError(
            "The Root DSE may not be added.",
            namingViolationErrorData(ctx, conn, []),
        );
    }
    const existingSiblings = await readChildren(ctx, immediateSuperior);
    const entryAlreadyExists: boolean = existingSiblings
        .some((xs) => compareRDN(xs.dse.rdn, rdn, NAMING_MATCHER));
    if (entryAlreadyExists) {
        throw new UpdateError(
            "Entry already exists.",
            new UpdateErrorData(
                UpdateProblem_entryAlreadyExists,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    conn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                undefined,
                undefined,
                undefined,
            ),
        );
    }

    // TODO: If TargetSystem !== this DSA, establish HOB with inferior DSA.

    const attrsFromDN: Value[] = rdn
        .map((atav): Value => ({
            id: atav.type_,
            value: atav.value,
            contexts: new Map([]),
        }));

    const attributesByType: Map<IndexableOID, Value[]> = new Map();
    if (accessControlScheme) { // FIXME: Actually check that what follows applies to this scheme.
        for (const type_ of attributesByType.keys()) {
            const typeOID = ObjectIdentifier.fromString(type_);
            const {
                authorized: authorizedToAddAttributeType,
            } = bacACDF(
                relevantTuples,
                conn.authLevel,
                {
                    attributeType: typeOID,
                },
                [
                    PERMISSION_CATEGORY_ADD,
                ],
                EQUALITY_MATCHER,
            );
            if (!authorizedToAddAttributeType) {
                throw new errors.SecurityError(
                    `Not permitted to create an attribute of type ${type_}.`,
                    new SecurityErrorData(
                        SecurityProblem_insufficientAccessRights,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            conn.boundNameAndUID?.dn,
                            undefined,
                            securityError["&errorCode"],
                        ),
                        undefined,
                        undefined,
                        undefined,
                    ),
                );
            }
        }
    }
    const nonUserApplicationAttributes: AttributeType[] = [];
    const unrecognizedAttributes: AttributeType[] = [];
    const attributesUsingContexts: AttributeType[] = [];
    for (const attr of attrs) {
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
            continue;
        }
        if (accessControlScheme) {
            const {
                authorized: authorizedToAddAttributeValue,
            } = bacACDF(
                relevantTuples,
                conn.authLevel,
                {
                    value: new AttributeTypeAndValue(
                        attr.id,
                        attr.value,
                    ),
                },
                [
                    PERMISSION_CATEGORY_ADD,
                ],
                EQUALITY_MATCHER,
            );
            if (!authorizedToAddAttributeValue) {
                throw new errors.SecurityError(
                    `Not permitted to create an attribute value of type ${attr.id.toString()}.`,
                    new SecurityErrorData(
                        SecurityProblem_insufficientAccessRights,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            conn.boundNameAndUID?.dn,
                            undefined,
                            securityError["&errorCode"],
                        ),
                        undefined,
                        undefined,
                        undefined,
                    ),
                );
            }
        }
        if (spec.usage !== AttributeUsage_userApplications) {
            nonUserApplicationAttributes.push(attr.id);
        }
        if (attr.contexts.size > 0) {
            attributesUsingContexts.push(attr.id);
        }
    }

    if (unrecognizedAttributes.length > 0) {
        throw new AttributeError(
            `Unrecognized attributes: ${unrecognizedAttributes.map((at) => at.toString()).join(", ")}.`,
            new AttributeErrorData(
                data.object,
                unrecognizedAttributes.map((at) => new AttributeErrorData_problems_Item(
                    AttributeProblem_undefinedAttributeType,
                    at,
                    undefined,
                )),
                [],
                createSecurityParameters(
                    ctx,
                    conn.boundNameAndUID?.dn,
                    undefined,
                    attributeError["&errorCode"],
                ),
                undefined,
                undefined,
                undefined,
            ),
        );
    }

    const useOfContexts = (data.criticalExtensions?.[EXT_BIT_USE_OF_CONTEXTS] === TRUE_BIT);
    if (!useOfContexts && (attributesUsingContexts.length > 0)) {
        throw new ServiceError(
            "Use of contexts was not enabled by the request.",
            new ServiceErrorData(
                ServiceProblem_unavailable,
                [],
                createSecurityParameters(
                    ctx,
                    conn.boundNameAndUID?.dn,
                    undefined,
                    serviceError["&errorCode"],
                ),
                undefined,
                undefined,
                undefined,
            ),
        );
    }

    objectClassValues
        .map((oc) => ctx.objectClasses.get(oc.value.objectIdentifier.toString()))
        .forEach((oc, i) => {
            if (!oc) {
                ctx.log.warn(
                    `Object class ${objectClassValues[i]?.value.objectIdentifier} not understood.`,
                );
                return;
            }
            const missingMandatoryAttributes: ObjectIdentifier[] = Array
                .from(oc.mandatoryAttributes.values())
                .filter((mandate): boolean => !attributesByType.has(mandate))
                .map((mandate: string) => new ObjectIdentifier(
                    mandate.split(".").map((node) => Number.parseInt(node)),
                ));
            if (missingMandatoryAttributes.length > 0) {
                throw new UpdateError(
                    `Missing mandatory attributes: ${missingMandatoryAttributes.map((ma) => ma.toString())}.`,
                    new UpdateErrorData(
                        UpdateProblem_objectClassViolation,
                        missingMandatoryAttributes.map((at) => ({
                            attributeType: at,
                        })),
                        [],
                        createSecurityParameters(
                            ctx,
                            conn.boundNameAndUID?.dn,
                            undefined,
                            updateError["&errorCode"],
                        ),
                        undefined,
                        undefined,
                        undefined,
                    ),
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
                && attr.id.isEqualTo(afdn.id)
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
            namingViolationErrorData(ctx, conn, duplicatedAFDNs),
        );
    }

    if (unrecognizedAFDNs.length > 0) {
        throw new UpdateError(
            "Attributes of the following types in the RDNs of the entry were "
            + `not recognized, and therefore cannot be used for naming: ${unrecognizedAFDNs.join(", ")}`,
            namingViolationErrorData(ctx, conn, unrecognizedAFDNs),
        );
    }

    if (cannotBeUsedInNameAFDNs.length > 0) {
        throw new UpdateError(
            "Attributes of the following types in the RDNs of the entry are "
            + `innately not suitable for naming: ${cannotBeUsedInNameAFDNs.join(", ")}`,
            namingViolationErrorData(ctx, conn, cannotBeUsedInNameAFDNs),
        );
    }

    if (unmatchedAFDNs.length > 0) {
        throw new UpdateError(
            "Attributes of the following types in the RDNs of the entry did not "
            + `have matching values in the attributes: ${unmatchedAFDNs.join(", ")}`,
            namingViolationErrorData(ctx, conn, unmatchedAFDNs),
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
     *  compound entry: A representation of an object in terms of family members that are hierarchically organized
     *  into one or more families of entries.
     *
     *  X.501, Section 14.10:
     *  If the immediately hierarchical parent is a compound entry, the value shall be the distinguished name
     *  of the ancestor. Otherwise, the Directory shall return an Update Error with problem parentNotAncestor .
     */
    // How do you insert DSEs of any non-entry type if dseType is an operational attribute?
    // X.511, Section 7.12 specifies this exactly:
    // – the manageDSAIT extension bit shall be set;
    // – the manageDSAIT option shall be set;
    // – the manageDSAITPlaneRef option shall be included if a specific replication plane is to be managed.
    const manageDSAIT: boolean = (data.serviceControls?.options?.[ServiceControlOptions_manageDSAIT] === TRUE_BIT);
    // Only necessary if a specific DSA IT is to be managed.
    // const manageDSAITPlaneRef = data.serviceControls?.manageDSAITPlaneRef;

    if (manageDSAIT) {
    // NOTE: "aliased entry exists" X.511 specifically says this does not have to be checked.
    // TODO: aliases are not allowed to point to other aliases
    } else if (nonUserApplicationAttributes.length > 0) {
        throw new SecurityError(
            "Operational attributes may not be managed without setting the manageDSAIT flag.",
            new SecurityErrorData(
                SecurityProblem_insufficientAccessRights,
                undefined,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    conn.boundNameAndUID?.dn,
                    undefined,
                    securityError["&errorCode"],
                ),
                undefined,
                undefined,
                undefined,
            ),
        );
    }
    const newEntry = await createEntry(ctx, immediateSuperior, rdn, {}, attrs, []); // FIXME: creatorName
    immediateSuperior.subordinates?.push(newEntry);
    // TODO: Schedule modification of RHOBs with subordinate DSAs.
    // TODO: Filter out more operational attributes.
    // TODO: Update shadows
    return new ChainedResult(
        new ChainingResults(
            undefined,
            undefined,
            createSecurityParameters(
                ctx,
                conn.boundNameAndUID?.dn,
                id_opcode_addEntry,
            ),
            undefined,
        ),
        _encode_AddEntryResult({
            null_: null,
        }, () => new DERElement()),
    );
}
