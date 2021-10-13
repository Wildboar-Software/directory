import { Context, IndexableOID, Value, Vertex, ClientConnection, OperationReturn } from "../types";
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
    UpdateErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateErrorData.ta";
import {
    UpdateProblem_objectClassViolation,
    UpdateProblem_entryAlreadyExists,
    UpdateProblem_namingViolation,
    UpdateProblem_affectsMultipleDSAs,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateProblem.ta";
import {
    AttributeProblem_contextViolation,
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
import { ObjectIdentifier, OBJECT_IDENTIFIER, TRUE_BIT, BERElement } from "asn1-ts";
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
    Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1 as ChainedResult,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ResultType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    ChainingResults,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingResults.ta";
import compareRDN from "@wildboar/x500/src/lib/comparators/compareRelativeDistinguishedName";
import createEntry from "../database/createEntry";
import {
    ServiceProblem_unwillingToPerform,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
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
import getIsGroupMember from "../authz/getIsGroupMember";
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
import establishSubordinate from "../dop/establishSubordinate";
import { chainedAddEntry } from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedAddEntry.oa";
import { strict as assert } from "assert";
import getDistinguishedName from "../x500/getDistinguishedName";
import {
    id_op_binding_hierarchical,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-hierarchical.va";
import { OperationalBindingInitiator } from "@prisma/client";
import {
    HierarchicalAgreement,
    _decode_HierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/HierarchicalAgreement.ta";
import {
    AccessPoint,
    _decode_AccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import isPrefix from "../x500/isPrefix";
import updateSubordinate from "../dop/updateSubordinate";
import { OperationalBindingID } from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OperationalBindingID.ta";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import findEntry from "../x500/findEntry";
import { differenceInMilliseconds } from "date-fns";
import {
    ServiceProblem_timeLimitExceeded
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import getDateFromTime from "@wildboar/x500/src/lib/utils/getDateFromTime";
import type { OperationDispatcherState } from "./OperationDispatcher";
import { DER, _encodeObjectIdentifier } from "asn1-ts/dist/node/functional";
import codeToString from "../x500/codeToString";
import getStatisticsFromCommonArguments from "../telemetry/getStatisticsFromCommonArguments";
import accessPointToNSAPStrings from "../x500/accessPointToNSAPStrings";
import checkIfNameIsAlreadyTakenInNSSR from "./checkIfNameIsAlreadyTakenInNSSR";
import validateObjectClasses from "../x500/validateObjectClasses";
import valuesFromAttribute from "../x500/valuesFromAttribute";
import getEqualityMatcherGetter from "../x500/getEqualityMatcherGetter";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";
import {
    subschema,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/subschema.oa";
import getStructuralObjectClass from "../x500/getStructuralObjectClass";
import checkNameForm from "../x500/checkNameForm";
import {
    ObjectClassKind_auxiliary,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import {
    DITContextUseDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITContextUseDescription.ta";
import {
    id_oa_allAttributeTypes,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oa-allAttributeTypes.va";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import getSubschemaSubentry from "../dit/getSubschemaSubentry";
import failover from "../utils/failover";
import {
    AbandonedData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonedData.ta";
import {
    abandoned,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/abandoned.oa";
import {
    administrativeRole,
} from "@wildboar/x500/src/lib/modules/InformationFramework/administrativeRole.oa";

const ALL_ATTRIBUTE_TYPES: string = id_oa_allAttributeTypes.toString();

function namingViolationErrorData ( // FIXME: Remove.
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
    state: OperationDispatcherState,
): Promise<OperationReturn> {
    const argument = _decode_AddEntryArgument(state.operationArgument);
    const data = getOptionallyProtectedValue(argument);
    const op = ("present" in state.invokeId)
        ? conn.invocations.get(state.invokeId.present)
        : undefined;
    const timeLimitEndTime: Date | undefined = state.chainingArguments.timeLimit
        ? getDateFromTime(state.chainingArguments.timeLimit)
        : undefined;
    const immediateSuperior = state.foundDSE;
    if (immediateSuperior.dse.alias) {
        throw new errors.UpdateError(
            "New entry inserted below an entry of a forbidden DSE type, such as an alias.",
            namingViolationErrorData(ctx, conn, []),
        );
    }
    const EQUALITY_MATCHER = getEqualityMatcherGetter(ctx);
    const NAMING_MATCHER = getNamingMatcherGetter(ctx);
    const attrs: Value[] = data.entry.flatMap(valuesFromAttribute);
    const objectClassValues = attrs.filter((attr) => attr.id.isEqualTo(id_at_objectClass));
    if (objectClassValues.length === 0) {
        throw new errors.UpdateError(
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
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
        );
    }
    const objectClasses: OBJECT_IDENTIFIER[] = objectClassValues.map((ocv) => ocv.value.objectIdentifier);
    if (!validateObjectClasses(ctx, objectClasses)) {
        throw new errors.UpdateError(
            `Invalid object classes: ${objectClasses.map((oc) => oc.toString()).join(" ")}`,
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
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
        );
    }
    const structuralObjectClass = getStructuralObjectClass(ctx, objectClasses);

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
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
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
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
        );
    }

    const targetDN = data.object.rdnSequence;
    const relevantSubentries: Vertex[] = (await Promise.all(
        state.admPoints.map((ap) => getRelevantSubentries(ctx, objectClasses, targetDN, ap)),
    )).flat();
    const accessControlScheme = state.admPoints
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
                conn.boundNameAndUID!, // This request is not allowed if the connection is not bound.
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
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
            );
        }
    }

    const rdn = getRDN(data.object.rdnSequence);
    if (!rdn) {
        throw new errors.UpdateError(
            "The Root DSE may not be added.",
            namingViolationErrorData(ctx, conn, []),
        );
    }
    const existingSiblings = await readChildren(ctx, immediateSuperior);
    const entryAlreadyExists: boolean = existingSiblings
        .some((xs) => compareRDN(xs.dse.rdn, rdn, NAMING_MATCHER));
    if (entryAlreadyExists) {
        throw new errors.UpdateError(
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
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
        );
    }
    if (immediateSuperior.dse.nssr) {
        await checkIfNameIsAlreadyTakenInNSSR(
            ctx,
            conn,
            state,
            immediateSuperior.dse.nssr?.nonSpecificKnowledge ?? [],
            targetDN,
        );
    }
    if (timeLimitEndTime && (new Date() > timeLimitEndTime)) {
        throw new errors.ServiceError(
            "Could not complete operation in time.",
            new ServiceErrorData(
                ServiceProblem_timeLimitExceeded,
                [],
                createSecurityParameters(
                    ctx,
                    conn.boundNameAndUID?.dn,
                    undefined,
                    serviceError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
        );
    }
    const timeRemainingInMilliseconds = timeLimitEndTime
        ? differenceInMilliseconds(timeLimitEndTime, new Date())
        : undefined;
    // NOTE: This does not actually check if targetSystem is the current DSA.
    if (data.targetSystem) {
        const obResponse = await establishSubordinate(
            ctx,
            immediateSuperior,
            undefined,
            rdn,
            data.entry,
            data.targetSystem,
            {
                timeLimitInMilliseconds: timeRemainingInMilliseconds,
            },
        );
        if (("result" in obResponse) && obResponse.result) {
            const chainedResult = chainedAddEntry.decoderFor["&ResultType"]!(obResponse.result);
            return {
                result: chainedResult,
                stats: {},
            }; // TODO: This strips the remote DSA's signature!
        } else {
            throw new errors.ServiceError(
                "Could not add entry to remote DSA via targetSystem.",
                new ServiceErrorData(
                    ServiceProblem_unwillingToPerform,
                    [],
                    createSecurityParameters(
                        ctx,
                        conn.boundNameAndUID?.dn,
                        undefined,
                        serviceError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
            );
        }
    }

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
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
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
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
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
        throw new errors.AttributeError(
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
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
        );
    }

    const useOfContexts = (data.criticalExtensions?.[EXT_BIT_USE_OF_CONTEXTS] === TRUE_BIT);
    if (!useOfContexts && (attributesUsingContexts.length > 0)) {
        throw new errors.ServiceError(
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
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
        );
    }

    objectClasses
        .map((oc) => ctx.objectClasses.get(oc.toString()))
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
                throw new errors.UpdateError(
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
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
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
            const matcher = getNamingMatcherGetter(ctx)(afdn.id);
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
        throw new errors.UpdateError(
            "Attributes of the following types in the RDNs of the entry were "
            + `duplicated: ${duplicatedAFDNs.join(", ")}`,
            namingViolationErrorData(ctx, conn, duplicatedAFDNs),
        );
    }

    if (unrecognizedAFDNs.length > 0) {
        throw new errors.UpdateError(
            "Attributes of the following types in the RDNs of the entry were "
            + `not recognized, and therefore cannot be used for naming: ${unrecognizedAFDNs.join(", ")}`,
            namingViolationErrorData(ctx, conn, unrecognizedAFDNs),
        );
    }

    if (cannotBeUsedInNameAFDNs.length > 0) {
        throw new errors.UpdateError(
            "Attributes of the following types in the RDNs of the entry are "
            + `innately not suitable for naming: ${cannotBeUsedInNameAFDNs.join(", ")}`,
            namingViolationErrorData(ctx, conn, cannotBeUsedInNameAFDNs),
        );
    }

    if (unmatchedAFDNs.length > 0) {
        throw new errors.UpdateError(
            "Attributes of the following types in the RDNs of the entry did not "
            + `have matching values in the attributes: ${unmatchedAFDNs.join(", ")}`,
            namingViolationErrorData(ctx, conn, unmatchedAFDNs),
        );
    }

    // Subschema validation
    let governingStructureRule: number | undefined;
    const schemaSubentry = isSubentry // Schema rules only apply to entries.
        ? undefined
        : await getSubschemaSubentry(ctx, immediateSuperior);
    if (!isSubentry && schemaSubentry) { // Schema rules only apply to entries.
        const newEntryIsANewSubschema = objectClasses.some((oc) => oc.isEqualTo(subschema["&id"]));
        const structuralRules = (schemaSubentry.dse.subentry?.ditStructureRules ?? [])
            .filter((rule) => !rule.obsolete)
            .filter((rule) => (
                (
                    newEntryIsANewSubschema
                    && (rule.superiorStructureRules === undefined)
                )
                || (
                    !newEntryIsANewSubschema
                    && (rule.superiorStructureRules === immediateSuperior.dse.governingStructureRule)
                )
            ))
            .filter((rule) => {
                const nf = ctx.nameForms.get(rule.nameForm.toString());
                if (!nf) {
                    return false;
                }
                if (!nf.namedObjectClass.isEqualTo(structuralObjectClass)) {
                    return false;
                }
                return checkNameForm(rdn, nf.mandatoryAttributes, nf.optionalAttributes);
            });
        if (structuralRules.length === 0) {
            throw new errors.UpdateError(
                "Entry not permitted here by any DIT structural rules.",
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
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
            );
        }
        governingStructureRule = structuralRules[0].ruleIdentifier;
        const contentRule = (schemaSubentry.dse.subentry?.ditContentRules ?? [])
            .filter((rule) => !rule.obsolete)
            // .find(), because there should only be one per SOC.
            .find((rule) => rule.structuralObjectClass.isEqualTo(structuralObjectClass));
        const auxiliaryClasses = objectClasses
            .filter((oc) => ctx.objectClasses.get(oc.toString())?.kind == ObjectClassKind_auxiliary);
        if (contentRule) {
            const permittedAuxiliaries: Set<IndexableOID> = new Set(
                contentRule.auxiliaries?.map((oid) => oid.toString()));
            for (const ac of auxiliaryClasses) {
                if (!permittedAuxiliaries.has(ac.toString())) {
                    throw new errors.UpdateError(
                        `Auxiliary class ${ac.toString()} not permitted by `
                        + "DIT content rule for structural object class "
                        + `${contentRule.structuralObjectClass.toString()}.`,
                        new UpdateErrorData(
                            UpdateProblem_objectClassViolation,
                            [
                                {
                                    attribute: new Attribute(
                                        id_at_objectClass,
                                        [
                                            _encodeObjectIdentifier(ac, DER),
                                        ],
                                        undefined,
                                    ),
                                },
                            ],
                            [],
                            createSecurityParameters(
                                ctx,
                                conn.boundNameAndUID?.dn,
                                undefined,
                                updateError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            state.chainingArguments.aliasDereferenced,
                            undefined,
                        ),
                    );
                }
            }
            /**
             * According to ITU Recommendation X.501 (2016), Section 13.8.2:
             *
             * > the optional components specify user attribute types which an
             * > entry to which the DIT content rule applies may contain in
             * > addition to those which it may contain according to its
             * > structural and auxiliary object classes;
             *
             * Meerkat DSA knowingly will not observe this feature.
             * Circumstantially allowing attributes to be added in spite of the
             * object class constraints would make it difficult to enforce
             * schema. What happens when you move the entry? What happens when
             * you move, change, or remove the content rule? Meerkat DSA does
             * not have to handle these tricky cases, because it will not permit
             * additional attribute types.
             */
            // const optionalAttributes: Set<IndexableOID> = new Set(
            //     contentRule.optional?.map((oid) => oid.toString()));
            const mandatoryAttributesRemaining: Set<IndexableOID> = new Set(
                contentRule.mandatory?.map((oid) => oid.toString()));
            const precludedAttributes: Set<IndexableOID> = new Set(
                contentRule.precluded?.map((oid) => oid.toString()));
            let administrativeRolePresent: boolean = false;
            for (const attr of data.entry) {
                if (attr.type_.isEqualTo(administrativeRole["&id"]) && (attr.values.length > 0)) {
                    administrativeRolePresent = true;
                }
                mandatoryAttributesRemaining.delete(attr.type_.toString());
                if (precludedAttributes.has(attr.type_.toString())) {
                    throw new errors.UpdateError(
                        `Attribute type ${attr.type_.toString()} precluded by relevant the relevant DIT content rule.`,
                        new UpdateErrorData(
                            UpdateProblem_objectClassViolation,
                            [
                                {
                                    attributeType: attr.type_,
                                },
                            ],
                            [],
                            createSecurityParameters(
                                ctx,
                                conn.boundNameAndUID?.dn,
                                undefined,
                                updateError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            state.chainingArguments.aliasDereferenced,
                            undefined,
                        ),
                    );
                }
            }
            if (
                ( // If this is a first-level entry.
                    immediateSuperior.dse.root
                    || (immediateSuperior.dse.rdn.length === 0)
                )
                && !administrativeRolePresent
            ) {
                throw new errors.UpdateError(
                    "First-level entries must be administrative points.",
                    new UpdateErrorData(
                        UpdateProblem_namingViolation,
                        [
                            {
                                attributeType: administrativeRole["&id"],
                            },
                        ],
                        [],
                        createSecurityParameters(
                            ctx,
                            conn.boundNameAndUID?.dn,
                            undefined,
                            updateError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                );
            }
            if (mandatoryAttributesRemaining.size > 0) {
                throw new errors.UpdateError(
                    "Missing these mandatory attributes, which are required by "
                    + "relevant DIT content rules: "
                    + Array.from(mandatoryAttributesRemaining.values())
                        .join(" "),
                    new UpdateErrorData(
                        UpdateProblem_objectClassViolation,
                        Array.from(mandatoryAttributesRemaining.values())
                            .map(ObjectIdentifier.fromString)
                            .map((oid) => ({
                                attributeType: oid,
                            })),
                        [],
                        createSecurityParameters(
                            ctx,
                            conn.boundNameAndUID?.dn,
                            undefined,
                            updateError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                );
            }
        } else {
            /**
             * From ITU Recommendation X.501 (2016), Section 13.8.1:
             *
             * > If no DIT content rule is present for a structural object
             * > class, then entries of that class shall contain only the
             * > attributes permitted by the structural object class definition.
             *
             * This implementation will simply check that there are no
             * auxiliary classes at all. Theoretically, this could exclude
             * auxiliary classes that have only optional attributes that overlap
             * with those of the structural object class, but at that point,
             * there is almost no point in including the auxiliary object class.
             */

            if (auxiliaryClasses.length > 0) {
                throw new errors.UpdateError(
                    "Auxiliary object classes are forbidden entirely, because "
                    + "there are no relevant DIT content rules to permit them.",
                    new UpdateErrorData(
                        UpdateProblem_objectClassViolation,
                        [
                            {
                                attribute: new Attribute(
                                    id_at_objectClass,
                                    auxiliaryClasses
                                        .map((ac) => _encodeObjectIdentifier(ac, DER)),
                                    undefined,
                                ),
                            },
                        ],
                        [],
                        createSecurityParameters(
                            ctx,
                            conn.boundNameAndUID?.dn,
                            undefined,
                            updateError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                );
            }
        }

        const contextUseRules = (schemaSubentry.dse.subentry?.ditContextUse ?? [])
            .filter((rule) => !rule.obsolete);
        const contextRulesIndex: Map<IndexableOID, DITContextUseDescription> = new Map(
            contextUseRules.map((rule) => [ rule.identifier.toString(), rule ]),
        );
        for (const attr of attrs) {
            const applicableRule = contextRulesIndex.get(attr.id.toString())
                ?? contextRulesIndex.get(ALL_ATTRIBUTE_TYPES);
            /**
             * From ITU Recommendation X.501 (2016), Section 13.10.1:
             *
             * > If no DIT Context Use definition is present for a given
             * > attribute type, then values of attributes of that type shall
             * > contain no context lists.
             */
            if (!applicableRule) {
                if (attr.contexts.size > 0) {
                    throw new errors.AttributeError(
                        "No contexts are permitted due to an absence of DIT "
                        + "context use rules that permit them.",
                        new AttributeErrorData(
                            {
                                rdnSequence: targetDN,
                            },
                            [
                                new AttributeErrorData_problems_Item(
                                    AttributeProblem_contextViolation,
                                    attr.id,
                                    attr.value,
                                ),
                            ],
                            [],
                            createSecurityParameters(
                                ctx,
                                conn.boundNameAndUID?.dn,
                                undefined,
                                attributeError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            state.chainingArguments.aliasDereferenced,
                            undefined,
                        ),
                    );
                } else {
                    continue;
                }
            }
            const mandatoryContextsRemaining: Set<IndexableOID> = new Set(
                applicableRule.information.mandatoryContexts?.map((con) => con.toString()),
            );
            const permittedContexts: OBJECT_IDENTIFIER[] = [
                ...applicableRule.information.mandatoryContexts ?? [],
                ...applicableRule.information.optionalContexts ?? [],
            ];
            const permittedContextsIndex: Set<IndexableOID> = new Set(permittedContexts.map((con) => con.toString()));
            for (const context of attr.contexts.values()) {
                const ID: string = context.id.toString();
                mandatoryContextsRemaining.delete(ID);
                if (!permittedContextsIndex.has(ID)) {
                    throw new errors.AttributeError(
                        `Context type ${ID} not permitted by applicable DIT context use rules.`,
                        new AttributeErrorData(
                            {
                                rdnSequence: targetDN,
                            },
                            [
                                new AttributeErrorData_problems_Item(
                                    AttributeProblem_contextViolation,
                                    attr.id,
                                    attr.value,
                                ),
                            ],
                            [],
                            createSecurityParameters(
                                ctx,
                                conn.boundNameAndUID?.dn,
                                undefined,
                                attributeError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            state.chainingArguments.aliasDereferenced,
                            undefined,
                        ),
                    );
                }
            }
            if (mandatoryContextsRemaining.size > 0) {
                /**
                 * If every mandatory context has a default value defined, we do not
                 * need to fail: the default value will be applied and this
                 * requirement will be satisfied.
                 */
                const everyRequiredContextHasADefaultValue: boolean = applicableRule
                    .information
                    .mandatoryContexts
                    ?.every((mc) => !!ctx.contextTypes.get(mc.toString())?.defaultValue) ?? true;
                if (!everyRequiredContextHasADefaultValue) {
                    throw new errors.AttributeError(
                        "These context types are required by applicable DIT "
                        + "context use rules are missing the following context "
                        + "types: "
                        + Array.from(mandatoryContextsRemaining.values()),
                        new AttributeErrorData(
                            {
                                rdnSequence: targetDN,
                            },
                            [
                                new AttributeErrorData_problems_Item(
                                    AttributeProblem_contextViolation,
                                    attr.id,
                                    attr.value,
                                ),
                            ],
                            [],
                            createSecurityParameters(
                                ctx,
                                conn.boundNameAndUID?.dn,
                                undefined,
                                attributeError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            state.chainingArguments.aliasDereferenced,
                            undefined,
                        ),
                    );
                }
            }
            // Add default context values.
            for (const ct of permittedContexts) { // TODO: This is O(n^2).
                const CTYPE_OID: string = ct.toString();
                const spec = ctx.contextTypes.get(CTYPE_OID);
                if (!spec) {
                    throw new Error(); // FIXME: Context type not understood.
                }
                if (!spec.defaultValue) {
                    continue;
                }
                const defaultValueGetter = spec.defaultValue;
                if (!attr.contexts.has(CTYPE_OID)) {
                    attr.contexts.set(CTYPE_OID, {
                        id: ct,
                        fallback: true,
                        values: [ defaultValueGetter() ],
                    });
                }
            }
        }
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
    // aliases are not allowed to point to other aliases
    // NOTE: "aliased entry exists" X.511 specifically says this does not have to be checked.
    } else if (nonUserApplicationAttributes.length > 0) {
        throw new errors.SecurityError(
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
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
        );
    }
    if (timeLimitEndTime && (new Date() > timeLimitEndTime)) {
        throw new errors.ServiceError(
            "Could not complete operation in time.",
            new ServiceErrorData(
                ServiceProblem_timeLimitExceeded,
                [],
                createSecurityParameters(
                    ctx,
                    conn.boundNameAndUID?.dn,
                    undefined,
                    serviceError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
        );
    }

    if (op?.abandonTime) {
        op.events.emit("abandon");
        throw new errors.AbandonError(
            "Abandoned.",
            new AbandonedData(
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    conn.boundNameAndUID?.dn,
                    undefined,
                    abandoned["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
        );
    }
    if (op) {
        op.pointOfNoReturnTime = new Date();
    }

    const newEntry = await createEntry(ctx, immediateSuperior, rdn, {
        governingStructureRule,
        structuralObjectClass: structuralObjectClass.toString(),
    }, attrs, conn.boundNameAndUID?.dn);
    immediateSuperior.subordinates?.push(newEntry);

    // Update relevant hierarchical operational bindings
    if (newEntry.dse.admPoint || newEntry.dse.subentry) {
        const admPoint: Vertex | undefined = newEntry.dse.admPoint
            ? newEntry
            : newEntry.immediateSuperior;
        assert(admPoint?.dse.admPoint);
        const admPointDN = getDistinguishedName(admPoint);
        const now = new Date();
        const relevantOperationalBindings = await ctx.db.operationalBinding.findMany({
            where: {
                binding_type: id_op_binding_hierarchical.toString(),
                validity_start: {
                    gte: now,
                },
                validity_end: {
                    lte: now,
                },
                accepted: true,
                OR: [
                    { // Local DSA initiated role A (meaning local DSA is superior.)
                        initiator: OperationalBindingInitiator.ROLE_A,
                        outbound: true,
                    },
                    { // Remote DSA initiated role B (meaning local DSA is superior again.)
                        initiator: OperationalBindingInitiator.ROLE_B,
                        outbound: false,
                    },
                ],
            },
            select: {
                binding_identifier: true,
                binding_version: true,
                access_point: true,
                agreement_ber: true,
            },
        });
        for (const ob of relevantOperationalBindings) {
            const argreementElement = new BERElement();
            argreementElement.fromBytes(ob.agreement_ber);
            const agreement: HierarchicalAgreement = _decode_HierarchicalAgreement(argreementElement);
            if (!isPrefix(ctx, admPointDN, agreement.immediateSuperior)) {
                continue;
            }
            const bindingID = new OperationalBindingID(
                ob.binding_identifier,
                ob.binding_version,
            );
            const accessPointElement = new BERElement();
            accessPointElement.fromBytes(ob.access_point.ber);
            const accessPoint: AccessPoint = _decode_AccessPoint(accessPointElement);
            try {
                const subrDN: DistinguishedName = [
                    ...agreement.immediateSuperior,
                    agreement.rdn,
                ];
                const subr = await findEntry(ctx, ctx.dit.root, subrDN);
                if (!subr) {
                    ctx.log.warn(`Subordinate entry for agreement ${bindingID.identifier} (version ${bindingID.version}) not found.`);
                    continue;
                }
                assert(subr.immediateSuperior);
                // We do not await the return value. This can run independently
                // of returning from this operation.
                updateSubordinate(
                    ctx,
                    bindingID,
                    subr.immediateSuperior,
                    undefined,
                    subr.dse.rdn,
                    accessPoint,
                )
                    .catch((e) => {
                        ctx.log.warn(`Failed to update HOB for agreement ${bindingID.identifier} (version ${bindingID.version}). ${e}`);
                    });
            } catch (e) {
                ctx.log.warn(`Failed to update HOB for agreement ${bindingID.identifier} (version ${bindingID.version}).`);
                continue;
            }
        }
    }

    // TODO: Update shadows
    return {
        result: {
            unsigned: new ChainedResult(
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
                }, DER),
            ),
        },
        stats: {
            request: failover(() => ({
                operationCode: codeToString(id_opcode_addEntry),
                ...getStatisticsFromCommonArguments(data),
                targetNameLength: targetDN.length,
                targetSystemNSAPs: data.targetSystem
                    ? Array.from(accessPointToNSAPStrings(data.targetSystem))
                    : undefined,
            }), undefined),
        },
    };
}
