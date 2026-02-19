import { Context, Vertex, Value, ClientAssociation, OperationReturn, IndexableOID } from "../types/index.js";
import { OBJECT_IDENTIFIER, ObjectIdentifier, INTEGER, unpackBits, ASN1Construction } from "@wildboar/asn1";
import type { MeerkatContext } from "../ctx.js";
import { DER, _encodeObjectIdentifier } from "@wildboar/asn1/functional";
import * as errors from "../types/index.js";
import {
    _decode_ModifyDNArgument,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ModifyDNResult,
    _encode_ModifyDNResult,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ModifyDNResultData,
    _encode_ModifyDNResultData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1 as ChainedResult,
} from "@wildboar/x500/DistributedOperations";
import {
    ChainingResults,
} from "@wildboar/x500/DistributedOperations";
import { getOptionallyProtectedValue } from "@wildboar/x500";
import {
    UpdateErrorData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    UpdateProblem_entryAlreadyExists,
    UpdateProblem_namingViolation,
    UpdateProblem_affectsMultipleDSAs,
    UpdateProblem_objectClassViolation,
    UpdateProblem_familyRuleViolation,
    UpdateProblem_noSuchSuperior,
} from "@wildboar/x500/DirectoryAbstractService";
import getDistinguishedName from "../x500/getDistinguishedName.js";
import { getRDN } from "@wildboar/x500";
import dnToVertex from "../dit/dnToVertex.js";
import { strict as assert } from "node:assert";
import { compareDistinguishedName } from "@wildboar/x500";
import removeValues from "../database/entry/removeValues.js";
import { SecurityErrorData } from "@wildboar/x500/DirectoryAbstractService";
import {
    SecurityProblem_insufficientAccessRights,
    SecurityProblem_invalidSignature,
} from "@wildboar/x500/DirectoryAbstractService";
import getRelevantSubentries from "../dit/getRelevantSubentries.js";
import { type ACDFTuple } from "@wildboar/x500";
import { type ACDFTupleExtended } from "@wildboar/x500";
import {
    bacACDF,
    PERMISSION_CATEGORY_READ,
    PERMISSION_CATEGORY_RENAME,
    PERMISSION_CATEGORY_EXPORT,
    PERMISSION_CATEGORY_IMPORT,
    PERMISSION_CATEGORY_REMOVE,
} from "@wildboar/x500";
import { getACDFTuplesFromACIItem } from "@wildboar/x500";
import getIsGroupMember from "../authz/getIsGroupMember.js";
import getAdministrativePoints from "../dit/getAdministrativePoints.js";
import createSecurityParameters from "../x500/createSecurityParameters.js";
import {
    id_opcode_modifyDN,
} from "@wildboar/x500/CommonProtocolSpecification";
import {
    updateError,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    securityError,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    serviceError,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ServiceProblem_timeLimitExceeded
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ServiceErrorData,
} from "@wildboar/x500/DirectoryAbstractService";
import { getDateFromTime } from "@wildboar/x500";
import type { OperationDispatcherState } from "./OperationDispatcher.js";
import { codeToString } from "@wildboar/x500";
import getStatisticsFromCommonArguments from "../telemetry/getStatisticsFromCommonArguments.js";
import checkIfNameIsAlreadyTakenInNSSR from "./checkIfNameIsAlreadyTakenInNSSR.js";
import getEqualityMatcherGetter from "../x500/getEqualityMatcherGetter.js";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter.js";
import { checkNameForm } from "@wildboar/x500";
import {
    ObjectClassKind_auxiliary,
} from "@wildboar/x500/InformationFramework";
import {
    DITContextUseDescription,
} from "@wildboar/x500/SchemaAdministration";
import {
    Attribute,
} from "@wildboar/x500/InformationFramework";
import {
    id_at_objectClass,
} from "@wildboar/x500/InformationFramework";
import getSubschemaSubentry from "../dit/getSubschemaSubentry.js";
import readValues from "../database/entry/readValues.js";
import { EntryInformationSelection } from "@wildboar/x500/DirectoryAbstractService";
import failover from "../utils/failover.js";
import {
    AbandonedData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    abandoned,
} from "@wildboar/x500/DirectoryAbstractService";
import extensibleObject from "../ldap/extensibleObject.js";
import {
    hierarchyParent,
} from "@wildboar/x500/InformationFramework";
import {
    id_oc_child,
} from "@wildboar/x500/InformationFramework";
import {
    AttributeErrorData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    AttributeErrorData_problems_Item,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    AttributeProblem_undefinedAttributeType,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    NameErrorData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    NameProblem_invalidAttributeSyntax,
} from "@wildboar/x500/DirectoryAbstractService";
import getACIItems from "../authz/getACIItems.js";
import { differenceInMilliseconds } from "date-fns";
import updateAffectedSubordinateDSAs from "../dop/updateAffectedSubordinateDSAs.js";
import updateSuperiorDSA from "../dop/updateSuperiorDSA.js";
import bacSettings from "../authz/bacSettings.js";
import {
    NameAndOptionalUID,
} from "@wildboar/x500/SelectedAttributeTypes";
import preprocessTuples from "../authz/preprocessTuples.js";
import permittedToFindDSE from "../authz/permittedToFindDSE.js";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/InformationFramework";
import readValuesOfType from "../utils/readValuesOfType.js";
import { attributeError } from "@wildboar/x500/DirectoryAbstractService";
import { nameError } from "@wildboar/x500/DirectoryAbstractService";
import {
    subentryNameForm,
} from "@wildboar/x500/InformationFramework";
import {
    subschema,
} from "@wildboar/x500/SchemaAdministration";
import { dseType } from "@wildboar/x500/DSAOperationalAttributeTypes";
import {
    objectClass,
} from "@wildboar/x500/InformationFramework";
import {
    aliasedEntryName,
} from "@wildboar/x500/InformationFramework";
import {
    id_oc_alias,
} from "@wildboar/x500/InformationFramework";
import {
    id_sc_subentry,
} from "@wildboar/x500/InformationFramework";
import isPrefix from "../x500/isPrefix.js";
import isOperationalAttributeType from "../x500/isOperationalAttributeType.js";
import dseFromDatabaseEntry from "../database/dseFromDatabaseEntry.js";
import {
    ProtectionRequest_signed,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ErrorProtectionRequest_signed,
} from "@wildboar/x500/DirectoryAbstractService";
import { generateSignature } from "../pki/generateSignature.js";
import { SIGNED } from "@wildboar/x500/AuthenticationFramework";
import { stringifyDN } from "../x500/stringifyDN.js";
import type {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import { printInvokeId } from "../utils/printInvokeId.js";
import { UNTRUSTED_REQ_AUTH_LEVEL } from "../constants.js";
import { getEntryExistsFilter } from "../database/entryExistsFilter.js";
import type { DistinguishedValueCreateManyInput } from "../generated/models/DistinguishedValue.js";
import getEqualityNormalizer from "../x500/getEqualityNormalizer.js";
import { getShadowIncrementalSteps } from "../dop/getRelevantSOBs.js";
import { SubordinateChanges } from "@wildboar/x500/DirectoryShadowAbstractService";
import { saveIncrementalRefresh } from "../disp/saveIncrementalRefresh.js";
import { acdf } from "../authz/acdf.js";
import { renameEntry } from "../database/renameEntry.js";

/**
 * @summary Determine whether a DSE is local to this DSA
 * @description
 *
 * This function determines whether a given is local to this DSA, meaning that
 * it is not a shadow copy, some sort of knowledge reference, or a glue entry.
 *
 * @param vertex The DSE whose locality is to be determined
 * @returns Whether the DSE in question is local to this DSA
 *
 * @function
 */
function withinThisDSA (vertex: Vertex) {
    return (
        !vertex.dse.shadow
        && !vertex.dse.immSupr
        // && !vertex.dse.supr // Goes in the root
        && !vertex.dse.subr
        && !vertex.dse.rhob
        && !vertex.dse.sa
        && !vertex.dse.xr
        && !vertex.dse.glue
    );
}

/**
 * @summary Determine whether all subordinates of a DSE are local to this DSA
 * @description
 *
 * Determines whether the entire subtree beneath a given DSE is local to this
 * DSA, meaning that each subordinate (recursively) is not a shadow copy, a
 * glue entry, or some kind of knowledge reference, or something else other
 * than an entry, subentry, or alias.
 *
 * @param ctx The context object
 * @param vertex The DSE that forms the root of the subtree whose locality to
 *  this DSA is to be determined
 * @returns Whether all subordinates are local to this DSA
 *
 * @function
 * @async
 */
async function allSubordinatesWithinThisDSA (
    ctx: Context,
    vertex: Vertex,
): Promise<boolean> {
    const externalDSEs = await ctx.db.entry.findMany({
        where: {
            materialized_path: {
                startsWith: vertex.dse.materializedPath.length
                    ? `${vertex.dse.materializedPath}.${vertex.dse.id}`
                    : vertex.dse.id.toString(),
            },
            OR: [
                {
                    subr: true,
                },
                {
                    nssr: true,
                },
                {
                    immSupr: true,
                },
                {
                    rhob: true,
                },
                {
                    shadow: true,
                },
                {
                    sa: true,
                },
                {
                    xr: true,
                },
                {
                    glue: true,
                },
            ],
        },
    });
    return (externalDSEs.length > 0);
}

/**
 * @summary The modifyDN operation, as specified in ITU Recommendation X.511.
 * @description
 *
 * The `modifyDN` operation, as specified in ITU Recommendation X.511 (2016),
 * Section 12.4. per the recommended implementation in ITU Recommendation X.518
 * (2016), Section 19.1.4.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param state The operation dispatcher state
 *
 * @function
 * @async
 */
export
async function modifyDN (
    ctx: MeerkatContext,
    assn: ClientAssociation,
    state: OperationDispatcherState,
): Promise<OperationReturn> {
    const target = state.foundDSE;
    const argument = _decode_ModifyDNArgument(state.operationArgument);
    const data = getOptionallyProtectedValue(argument);
    const signErrors: boolean = (
        (data.securityParameters?.errorProtection === ErrorProtectionRequest_signed)
        && (assn.authorizedForSignedErrors)
    );
    if (!withinThisDSA(target)) {
        throw new errors.UpdateError(
            ctx.i18n.t("err:target_not_within_this_dsa"),
            new UpdateErrorData(
                UpdateProblem_affectsMultipleDSAs,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }
    if (!target.immediateSuperior || !withinThisDSA(target.immediateSuperior)) {
        throw new errors.UpdateError(
            ctx.i18n.t("err:target_superior_not_within_this_dsa"),
            new UpdateErrorData(
                UpdateProblem_affectsMultipleDSAs,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }
    const requestor: DistinguishedName | undefined = data
        .securityParameters
        ?.certification_path
        ?.userCertificate
        .toBeSigned
        .subject
        .rdnSequence
        ?? state.chainingArguments.originator
        ?? data.requestor
        ?? assn.boundNameAndUID?.dn;

    // #region Signature validation
    /**
     * Integrity of the signature SHOULD be evaluated at operation evaluation,
     * not before. Because the operation could get chained to a DSA that has a
     * different configuration of trust anchors. To be clear, this is not a
     * requirement of the X.500 specifications--just my personal assessment.
     *
     * Meerkat DSA allows operations with invalid signatures to progress
     * through all pre-operation-evaluation procedures leading up to operation
     * evaluation, but with `AuthenticationLevel.basicLevels.signed` set to
     * `FALSE` so that access controls are still respected. Therefore, if we get
     * to this point in the code, and the argument is signed, but the
     * authentication level has the `signed` field set to `FALSE`, we throw an
     * `invalidSignature` error.
     */
    if (
        ("signed" in argument)
        && state.chainingArguments.authenticationLevel
        && ("basicLevels" in state.chainingArguments.authenticationLevel)
        && !state.chainingArguments.authenticationLevel.basicLevels.signed
    ) {
        const remoteHostIdentifier = `${assn.socket.remoteFamily}://${assn.socket.remoteAddress}/${assn.socket.remotePort}`;
        const logInfo = {
            context: "arg",
            host: remoteHostIdentifier,
            aid: assn.id,
            iid: printInvokeId(state.invokeId),
            ap: stringifyDN(ctx, requestor ?? []),
        };
        ctx.log.warn(ctx.i18n.t("log:invalid_signature", logInfo), logInfo);
        throw new errors.SecurityError(
            ctx.i18n.t("err:invalid_signature", logInfo),
            new SecurityErrorData(
                SecurityProblem_invalidSignature,
                undefined,
                undefined,
                undefined,
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn?.boundNameAndUID?.dn,
                    undefined,
                    securityError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }
    // #endregion Signature validation
    const op = ("present" in state.invokeId)
        ? assn.invocations.get(Number(state.invokeId.present))
        : undefined;
    const timeLimitEndTime: Date | undefined = state.chainingArguments.timeLimit
        ? getDateFromTime(state.chainingArguments.timeLimit)
        : undefined;
    const checkTimeLimit = () => {
        if (timeLimitEndTime && (new Date() > timeLimitEndTime)) {
            throw new errors.ServiceError(
                ctx.i18n.t("err:time_limit"),
                new ServiceErrorData(
                    ServiceProblem_timeLimitExceeded,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        serviceError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
    };
    const targetDN = getDistinguishedName(target);
    const objectClasses: OBJECT_IDENTIFIER[] = Array.from(target.dse.objectClass).map(ObjectIdentifier.fromString);
    const isExtensible: boolean = target.dse.objectClass.has(extensibleObject.toString());
    const EQUALITY_MATCHER = getEqualityMatcherGetter(ctx);
    const NAMING_MATCHER = getNamingMatcherGetter(ctx);
    if (
        target.dse.objectClass.has(id_oc_child.toString())
        && data.newSuperior // Renaming a child entry is not a problem, but moving it is.
        // It is only a problem if the new prefix is actually different than what is present.
        && !compareDistinguishedName(targetDN.slice(0, -1), data.newSuperior, NAMING_MATCHER)
    ) {
        throw new errors.UpdateError(
            ctx.i18n.t("err:cannot_move_child"),
            new UpdateErrorData(
                UpdateProblem_familyRuleViolation,
                [
                    {
                        attributeType: id_oc_child,
                    },
                ],
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }
    const relevantSubentries: Vertex[] = (await Promise.all(
        state.admPoints.map((ap) => getRelevantSubentries(ctx, target, targetDN, ap)),
    )).flat();
    const accessControlScheme = [ ...state.admPoints ] // Array.reverse() works in-place, so we create a new array.
        .reverse()
        .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
    const relevantACIItems = await getACIItems(
        ctx,
        accessControlScheme,
        target,
        relevantSubentries,
        Boolean(target.dse.subentry),
    );
    const acdfTuples: ACDFTuple[] = (relevantACIItems ?? [])
        .flatMap((aci) => getACDFTuplesFromACIItem(aci));
    const isMemberOfGroup = getIsGroupMember(ctx, NAMING_MATCHER);
    const user = requestor
        ? new NameAndOptionalUID(
            requestor,
            state.chainingArguments.uniqueIdentifier,
        )
        : undefined;
    const relevantTuples: ACDFTupleExtended[] = await preprocessTuples(
        accessControlScheme,
        acdfTuples,
        user,
        state.chainingArguments.authenticationLevel ?? UNTRUSTED_REQ_AUTH_LEVEL,
        targetDN,
        isMemberOfGroup,
        NAMING_MATCHER,
    );
    if (accessControlScheme) {
        if (data.newRDN) {
            const authorizedToEntry = acdf(
                ctx,
                accessControlScheme,
                assn,
                target,
                [
                    /**
                     * Read permission is not required by the specification, but
                     * it is necessary for preventing information disclosure,
                     * because we have to report back to the user if the values
                     * of the new RDN are not present in the entry. So we check
                     * here that the user has read access to the entry to make
                     * sure that they could legitimately read values from the
                     * entry if they wanted to. Further below, we also check
                     * that they have permission to read the attribute types and
                     * values of the new RDN.
                     *
                     * Search for this UUID to find that:
                     * 4E7AC6BB-CD58-47C8-B4DC-1B101A608C0E
                     */
                    PERMISSION_CATEGORY_READ,
                    PERMISSION_CATEGORY_RENAME,
                ],
                relevantTuples,
                user,
                { entry: objectClasses },
                bacSettings,
                true,
            );
            if (!authorizedToEntry) {
                throw new errors.SecurityError(
                    ctx.i18n.t("err:not_authz_modify_rdn"),
                    new SecurityErrorData(
                        SecurityProblem_insufficientAccessRights,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            securityError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                    signErrors,
                );
            }
            /**
             * This part is not required by the specification, but it is
             * necessary for preventing information disclosure. Basically, if
             * you rename an entry, you must have permission to read the
             * attribute types and values that are being used in the new RDN.
             *
             * If we establish that the user has these permissions here, it is
             * not a problem that we throw an error later on if those values
             * are not present in the entry, because the user would have had
             * permission to read them anyway.
             *
             * Search for this UUID for where we check for read permission to
             * the entry itself: 4E7AC6BB-CD58-47C8-B4DC-1B101A608C0E
             */
            for (const atav of data.newRDN) {
                const authorizedToReadAttributeType = acdf(
                    ctx,
                    accessControlScheme,
                    assn,
                    target,
                    [ PERMISSION_CATEGORY_READ ],
                    relevantTuples,
                    user,
                    {
                        attributeType: atav.type_,
                        operational: isOperationalAttributeType(ctx, atav.type_),
                    },
                    bacSettings,
                    true,
                );
                const authorizedToReadValue = acdf(
                    ctx,
                    accessControlScheme,
                    assn,
                    target,
                    [ PERMISSION_CATEGORY_READ ],
                    relevantTuples,
                    user,
                    {
                        value: new AttributeTypeAndValue(
                            atav.type_,
                            atav.value,
                        ),
                        operational: isOperationalAttributeType(ctx, atav.type_),
                    },
                    bacSettings,
                    true,
                );
                if (!authorizedToReadAttributeType || !authorizedToReadValue) {
                    throw new errors.SecurityError(
                        ctx.i18n.t("err:not_authz_modify_rdn"),
                        new SecurityErrorData(
                            SecurityProblem_insufficientAccessRights,
                            undefined,
                            undefined,
                            [],
                            createSecurityParameters(
                                ctx,
                                signErrors,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                securityError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            state.chainingArguments.aliasDereferenced,
                            undefined,
                        ),
                        signErrors,
                    );
                }
            }
        }
        if (data.newSuperior) {
            const authorizedToEntry = acdf(
                ctx,
                accessControlScheme,
                assn,
                target,
                [ PERMISSION_CATEGORY_EXPORT ],
                relevantTuples,
                user,
                { entry: objectClasses },
                bacSettings,
                true,
            );
            if (!authorizedToEntry) {
                throw new errors.SecurityError(
                    ctx.i18n.t("err:not_authz_export"),
                    new SecurityErrorData(
                        SecurityProblem_insufficientAccessRights,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            securityError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                    signErrors,
                );
            }
        }
    }
    const newPrefixDN = (data.newSuperior ?? targetDN.slice(0, -1));
    const oldRDN = target.dse.rdn;
    const newRDN = data.newRDN ?? getRDN(targetDN);
    const destinationDN = [
        ...newPrefixDN,
        newRDN,
    ];
    if ((data.object.length === 0) || (destinationDN.length === 0)) {
        throw new errors.UpdateError(
            ctx.i18n.t("err:root_dse_cannot_be_moved"),
            new UpdateErrorData(
                UpdateProblem_namingViolation,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }
    const newSuperior = data.newSuperior
        ? await dnToVertex(ctx, ctx.dit.root, data.newSuperior)
        : null; // `null` means we did not try.
    if (newSuperior === undefined) { // `undefined` means we tried and failed.
        throw new errors.UpdateError(
            ctx.i18n.t("err:no_such_superior"),
            new UpdateErrorData(
                UpdateProblem_noSuchSuperior,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }
    const oldImmediateSuperior = target.immediateSuperior;
    const superior = newSuperior ?? target.immediateSuperior;
    assert(superior);
    const movingToTopLevel: boolean = (data.newSuperior?.length === 0);
    const topLevelException: boolean = (movingToTopLevel && ctx.config.openTopLevel);

    // Access control for the new location.
    if (data.newSuperior) {
        const newAdmPoints = getAdministrativePoints(superior);
        const relevantSubentries: Vertex[] = (await Promise.all(
            newAdmPoints.map((ap) => getRelevantSubentries(ctx, objectClasses, destinationDN, ap)),
        )).flat();
        const newAccessControlScheme = [ ...newAdmPoints ] // Array.reverse() works in-place, so we create a new array.
            .reverse()
            .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
        if (newAccessControlScheme) {
            const relevantACIItems = await getACIItems(
                ctx,
                accessControlScheme,
                undefined,
                relevantSubentries,
                Boolean(target.dse.subentry),
            );
            const acdfTuples: ACDFTuple[] = (relevantACIItems ?? [])
                .flatMap((aci) => getACDFTuplesFromACIItem(aci));
            const relevantTuples: ACDFTupleExtended[] = await preprocessTuples(
                accessControlScheme,
                acdfTuples,
                user,
                state.chainingArguments.authenticationLevel ?? UNTRUSTED_REQ_AUTH_LEVEL,
                targetDN,
                isMemberOfGroup,
                NAMING_MATCHER,
            );
            const authorizedToEntry = acdf(
                ctx,
                newAccessControlScheme,
                assn,
                target,
                [ PERMISSION_CATEGORY_IMPORT ],
                relevantTuples,
                user,
                {
                    entry: objectClasses,
                    siblingsCount: await ctx.db.entry.count({
                        where: {
                            immediate_superior_id: target.immediateSuperior.dse.id,
                            ...getEntryExistsFilter(),
                        },
                    }),
                },
                bacSettings,
                true,
            );
            if (!authorizedToEntry && !topLevelException) {
                throw new errors.SecurityError(
                    ctx.i18n.t("err:not_authz_import"),
                    new SecurityErrorData(
                        SecurityProblem_insufficientAccessRights,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            securityError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                    signErrors,
                );
            }
        }
    }

    if (!withinThisDSA(superior)) { // `undefined` means we tried and failed.
        throw new errors.UpdateError(
            ctx.i18n.t("err:new_superior_not_within_this_dsa"),
            new UpdateErrorData(
                UpdateProblem_affectsMultipleDSAs,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }
    if (data.newSuperior) { // Step 3.
        if (!allSubordinatesWithinThisDSA(ctx, target)) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:entry_has_external_subordinates"),
                new UpdateErrorData(
                    UpdateProblem_affectsMultipleDSAs,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        updateError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
    }

    // This is, at least implicitly, a part of steps 5, 6, and 7.
    const superiorDN = getDistinguishedName(superior);
    const permittedToFindResult = await permittedToFindDSE(
        ctx,
        assn,
        ctx.dit.root,
        [ ...superiorDN, newRDN ],
        user,
        state.chainingArguments.authenticationLevel ?? UNTRUSTED_REQ_AUTH_LEVEL,
    );
    if (permittedToFindResult.exists) {
        if (permittedToFindResult.discloseOnError) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:entry_already_exists"),
                new UpdateErrorData(
                    UpdateProblem_entryAlreadyExists,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        updateError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        } else {
            throw new errors.SecurityError(
                ctx.i18n.t("err:not_authz_import"),
                new SecurityErrorData(
                    SecurityProblem_insufficientAccessRights,
                    undefined,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        securityError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
    }

    /**
     * This section checks that the immediate superior is a DSE type under which
     * we can add subordinates. If the user is not permitted to discover the DSE
     * type of the superior, we return an insufficientAccessRights error instead
     * of a namingViolation to avoid disclosing the DSE type of the immediate
     * superior.
     *
     * NOTE: This was copied over from addEntry.
     */
    if (
        superior.dse.alias
        || superior.dse.subr
        || superior.dse.subentry
        || superior.dse.shadow
        || superior.dse.sa
        || superior.dse.dsSubentry
    ) {
        if (!ctx.config.bulkInsertMode && accessControlScheme) {
            const relevantACIItemsForSuperior = await getACIItems(
                ctx,
                accessControlScheme,
                superior,
                relevantSubentries,
                !!superior.dse.subentry,
            );
            const acdfTuplesForSuperior: ACDFTuple[] = (relevantACIItemsForSuperior ?? [])
                .flatMap((aci) => getACDFTuplesFromACIItem(aci));
            const relevantTuplesForSuperior: ACDFTupleExtended[] = await preprocessTuples(
                accessControlScheme,
                acdfTuplesForSuperior,
                user,
                state.chainingArguments.authenticationLevel ?? UNTRUSTED_REQ_AUTH_LEVEL,
                targetDN.slice(0, -1),
                isMemberOfGroup,
                NAMING_MATCHER,
            );

            const superiorObjectClasses = Array
                .from(superior.dse.objectClass)
                .map(ObjectIdentifier.fromString);

            const authorizedToReadSuperior = acdf(
                ctx,
                accessControlScheme,
                assn,
                superior,
                [ PERMISSION_CATEGORY_READ ],
                relevantTuplesForSuperior,
                user,
                { entry: superiorObjectClasses },
                bacSettings,
                true,
            );

            const notAuthData = new SecurityErrorData(
                SecurityProblem_insufficientAccessRights,
                undefined,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    securityError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            );

            // If the user is not authorized to read the superior at all, just
            // throw insufficientAccessRights.
            if (!authorizedToReadSuperior) {
                throw new errors.SecurityError(
                    ctx.i18n.t("err:not_authz_to_add_entry"),
                    notAuthData,
                    signErrors,
                );
            }
            const authorizedToReadSuperiorDSEType = acdf(
                ctx,
                accessControlScheme,
                assn,
                superior,
                [ PERMISSION_CATEGORY_READ ],
                relevantTuplesForSuperior,
                user,
                {
                    attributeType: dseType["&id"],
                    operational: true,
                },
                bacSettings,
                true,
            );
            // TODO: We do not check that the user has permission to the DSEType value!
            // const superiorDSEType = await readValuesOfType(ctx, immediateSuperior, dseType["&id"])[0];
            const authorizedToReadSuperiorObjectClasses = acdf(
                ctx,
                accessControlScheme,
                assn,
                superior,
                [ PERMISSION_CATEGORY_READ ],
                relevantTuplesForSuperior,
                user,
                {
                    attributeType: objectClass["&id"],
                    operational: false,
                },
                bacSettings,
                true,
            );
            const superiorObjectClassesAuthorized = superiorObjectClasses
                .filter((oc) => acdf(
                    ctx,
                    accessControlScheme,
                    assn,
                    superior,
                    [ PERMISSION_CATEGORY_READ ],
                    relevantTuplesForSuperior,
                    user,
                    {
                        value: new AttributeTypeAndValue(
                            objectClass["&id"],
                            _encodeObjectIdentifier(oc, DER),
                        ),
                        operational: false,
                    },
                    bacSettings,
                    true,
                ));

            if (
                (superior.dse.alias || superior.dse.sa) // superior is some kind of alias, and...
                // // the user does not have one of the basic permissions that
                // // could be used to determine that it is an alias.
                && (
                    !authorizedToReadSuperiorDSEType
                    && !(
                        authorizedToReadSuperiorObjectClasses
                        && superiorObjectClassesAuthorized.some((oc) => oc.isEqualTo(id_oc_alias))
                    )
                    && !(bacACDF(
                        relevantTuplesForSuperior,
                        user,
                        {
                            attributeType: aliasedEntryName["&id"],
                            operational: false,
                        },
                        [ PERMISSION_CATEGORY_READ ],
                        bacSettings,
                        true,
                    ).authorized)
                )
            ) {
                throw new errors.SecurityError(
                    ctx.i18n.t("err:not_authz_to_add_entry"),
                    notAuthData,
                    signErrors,
                );
            }

            if (
                // superior is some kind of subentry, and...
                (superior.dse.subentry || superior.dse.dsSubentry)
                // the user does not have one of the basic permissions that
                // could be used to determine that it is a subentry.
                && (
                    !authorizedToReadSuperiorDSEType
                    && !(
                        authorizedToReadSuperiorObjectClasses
                        && superiorObjectClassesAuthorized.some((oc) => oc.isEqualTo(id_sc_subentry))
                    )
                )
                // NOTE: We don't check for other attribute types, like
                // `subtreeSpecification`, because technically, those could
                // appear in non-subentries too.
            ) {
                throw new errors.SecurityError(
                    ctx.i18n.t("err:not_authz_to_add_entry"),
                    notAuthData,
                    signErrors,
                );
            }
        }
        // If there was no authorization issue with revealing the DSE type of the
        // superior, or if the superior was of DSE type shadow or subr, we can
        // just return the true error: namingViolation.
        throw new errors.UpdateError(
            ctx.i18n.t("err:not_authz_to_add_entry"),
            new UpdateErrorData(
                UpdateProblem_namingViolation,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }

    if (isPrefix(ctx, targetDN, superiorDN)) {
        throw new errors.UpdateError(
            ctx.i18n.t("err:cannot_move_dse_below_itself"),
            new UpdateErrorData(
                UpdateProblem_namingViolation,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }

    const isFirstLevel: boolean = !!superior.dse.root;
    const isSubentry: boolean = !!target.dse.subentry;
    const isSubschemaSubentry: boolean = isSubentry && objectClasses.some((oc) => oc.isEqualTo(subschema["&id"]));
    /**
     * It would be impossible to create anything other than first-level DSEs if
     * subentries were not exempt from subschema restrictions, because they must
     * be created before the subschema can be defined!
     *
     * ITU Recommendation X.501 (2016), Section 14.2 states that:
     *
     * > Although subentry and subentryNameForm are specified using the notation
     * > of clause 13, subentries are not regulated by DIT structure or DIT
     * > content rules.
     *
     * However, regarding `subentryNameForm`, Section 14.2.2 states that:
     *
     * > No other name form shall be used for subentries.
     *
     * As such, Meerkat DSA will perform a hard-coded check that subentries have
     * this attribute type exclusively in their RDN.
     */
    const isExemptFromSubschema: boolean = (isSubentry || isFirstLevel);
    if (
        (superior.dse.governingStructureRule === undefined) // The immediate superior has no GSR, and...
        && !isExemptFromSubschema
    ) {
        throw new errors.UpdateError(
            ctx.i18n.t("err:no_gsr", { uuid: superior.dse.uuid }),
            new UpdateErrorData(
                UpdateProblem_namingViolation,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }

    if (
        isSubentry
        && !checkNameForm( // And the name is not valid for a subentry...
            data.newRDN,
            subentryNameForm["&MandatoryAttributes"].map((a) => a["&id"]),
            subentryNameForm["&OptionalAttributes"]?.map((a) => a["&id"]),
        )
    ) {
        throw new errors.UpdateError(
            ctx.i18n.t("err:name_form_invalid", {
                context: "subentry",
            }),
            new UpdateErrorData(
                UpdateProblem_namingViolation,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }

    if (isSubschemaSubentry && data.newSuperior) {
        const subschemaThatAlreadyExists = await ctx.db.entry.findFirst({
            where: {
                id: { // It's not a problem if we just move a subschema in-place.
                    not: target.dse.id,
                },
                immediate_superior_id: superior.dse.id,
                ...getEntryExistsFilter(),
                subentry: true,
                EntryObjectClass: {
                    some: {
                        object_class: subschema["&id"].toString(),
                    },
                },
            },
            select: {
                dseUUID: true,
            },
        });
        if (subschemaThatAlreadyExists) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:one_subschema", {
                    uuid: subschemaThatAlreadyExists.dseUUID,
                }),
                new UpdateErrorData(
                    UpdateProblem_namingViolation,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        updateError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
    }

    checkTimeLimit();
    const timeRemainingInMilliseconds = timeLimitEndTime
        ? differenceInMilliseconds(timeLimitEndTime, new Date())
        : undefined;
    if (isSubentry) { // Continue at step 7.
        // DEVIATION: from the specification: we update the subordinates AFTER we update the DN locally.
        if (target.immediateSuperior?.dse.cp) {
            // DEVIATION:
            // The specification does NOT say that you have to update the
            // superior's subentries for the new CP. Meerkat DSA does this
            // anyway, just without awaiting.
            updateSuperiorDSA(
                ctx,
                targetDN.slice(0, -1),
                target.immediateSuperior!,
                state.chainingArguments.aliasDereferenced ?? false,
                undefined,
                signErrors,
            ) // INTENTIONAL_NO_AWAIT
                .then(() => {
                    ctx.log.info(ctx.i18n.t("log:updated_superior_dsa"), {
                        remoteFamily: assn.socket.remoteFamily,
                        remoteAddress: assn.socket.remoteAddress,
                        remotePort: assn.socket.remotePort,
                        association_id: assn.id,
                        invokeID: printInvokeId(state.invokeId),
                    });
                })
                .catch((e) => {
                    ctx.log.error(ctx.i18n.t("log:failed_to_update_superior_dsa", { e }), {
                        remoteFamily: assn.socket.remoteFamily,
                        remoteAddress: assn.socket.remoteAddress,
                        remotePort: assn.socket.remotePort,
                        association_id: assn.id,
                        invokeID: printInvokeId(state.invokeId),
                    });
                });
        }
    } else if (target.dse.cp) { // Continue at step 6.
        try {
            // The specification says that you must wait for this to succeed
            // before returning a response. So we await this, unlike the
            // subordinate updates.
            await updateSuperiorDSA(ctx, targetDN, target, state.chainingArguments.aliasDereferenced ?? false, {
                timeLimitInMilliseconds: timeRemainingInMilliseconds,
            });
        } catch (e) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:superior_dsa_would_not_rename", {
                    e: e?.message,
                }),
                new UpdateErrorData(
                    UpdateProblem_affectsMultipleDSAs,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        updateError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
    } else if (
        (target.dse.entry || target.dse.alias)
        && superior.dse.nssr
    ) { // Continue at step 5.
        // Follow instructions in 19.1.5. These are the only steps unique to this DSE type.
        await checkIfNameIsAlreadyTakenInNSSR(
            ctx,
            assn,
            state.invokeId,
            state.chainingArguments.aliasDereferenced ?? false,
            superior.dse.nssr.nonSpecificKnowledge ?? [],
            destinationDN,
            timeRemainingInMilliseconds,
        );
        /**
         * Note that this covers the case where the entry is of type admPoint,
         * because an admPoint must always be of type entry.
         */
        updateAffectedSubordinateDSAs(ctx, targetDN);
    }

    // For checking deleteOldRDN
    const attributeTypesRequired: Set<IndexableOID> = new Set([
        ...objectClasses
            .flatMap((oc) => {
                const spec = ctx.objectClasses.get(oc.toString());
                return Array.from(spec?.mandatoryAttributes.values() ?? []);
            }),
    ]);
    const attributeTypesForbidden: Set<IndexableOID> = new Set();

    // Subschema validation
    let newGoverningStructureRule: INTEGER | undefined;
    const schemaSubentry = target.dse.subentry // Schema rules only apply to entries.
        ? undefined
        : await getSubschemaSubentry(ctx, superior, new Map());
    if (!isSubentry && schemaSubentry) { // Schema rules only apply to entries.
        const structuralRules = (schemaSubentry.dse.subentry?.ditStructureRules ?? [])
            .filter((rule) => ( // TODO: You can do better than this ugly code.
                !rule.obsolete
                && superior.dse.governingStructureRule
                && rule.superiorStructureRules?.includes(superior.dse.governingStructureRule)
            ))
            .filter((rule) => {
                const nf = ctx.nameForms.get(rule.nameForm.toString());
                if (!nf) {
                    return false;
                }
                if (
                    target.dse.structuralObjectClass // This should be known for all local DSEs.
                    && !nf.namedObjectClass.isEqualTo(target.dse.structuralObjectClass)
                ) {
                    return false;
                }
                if (nf.obsolete) {
                    return false;
                }
                return checkNameForm(newRDN, nf.mandatoryAttributes, nf.optionalAttributes);
            });
        if (structuralRules.length === 0) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:no_dit_structural_rules"),
                new UpdateErrorData(
                    UpdateProblem_namingViolation,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        updateError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
        newGoverningStructureRule = structuralRules[0].ruleIdentifier;
        const contentRule = (schemaSubentry.dse.subentry?.ditContentRules ?? [])
            // .find(), because there should only be one per SOC.
            .find((rule) => (
                !rule.obsolete
                && target.dse.structuralObjectClass
                && rule.structuralObjectClass.isEqualTo(target.dse.structuralObjectClass)
            ));
        const auxiliaryClasses = objectClasses
            .filter((oc) => ctx.objectClasses.get(oc.toString())?.kind == ObjectClassKind_auxiliary);
        if (contentRule) {
            const permittedAuxiliaries: Set<IndexableOID> = new Set(
                contentRule.auxiliaries?.map((oid) => oid.toString()));
            for (const ac of auxiliaryClasses) {
                if (!permittedAuxiliaries.has(ac.toString())) {
                    throw new errors.UpdateError(
                        ctx.i18n.t("err:aux_oc_not_permitted_by_dit_content_rule", {
                            aoc: ac.toString(),
                            soc: contentRule.structuralObjectClass.toString(),
                        }),
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
                                signErrors,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                updateError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            state.chainingArguments.aliasDereferenced,
                            undefined,
                        ),
                        signErrors,
                    );
                }
            }
            contentRule.precluded?.forEach((type_) => attributeTypesForbidden.add(type_.toString()));
            contentRule.mandatory?.forEach((type_) => attributeTypesRequired.add(type_.toString()));
        } else { // There is no content rule defined.
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
                    ctx.i18n.t("err:aux_oc_forbidden_because_no_dit_content_rules", {
                        oids: auxiliaryClasses.map((oid) => oid.toString()).join(", "),
                        soc: target.dse.structuralObjectClass?.toString(),
                    }),
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
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            updateError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                    signErrors,
                );
            }
        }
        const contextUseRules = (schemaSubentry.dse.subentry?.ditContextUse ?? [])
            .filter((rule) => !rule.obsolete);
        const contextRulesIndex: Map<IndexableOID, DITContextUseDescription> = new Map(
            contextUseRules.map((rule) => [ rule.identifier.toString(), rule ]),
        );
        for (const atav of newRDN) {
            const TYPE_OID: string = atav.type_.toString();
            const applicableContextRule = contextRulesIndex.get(TYPE_OID);
            if (!applicableContextRule) {
                continue;
            }
            // It cannot be used in a name if it has mandatory contexts, because
            // the ATAVs innately have no contexts.
            if (applicableContextRule.information.mandatoryContexts?.length) {
                throw new errors.UpdateError(
                    ctx.i18n.t("err:rdn_attribute_type_requires_contexts", {
                        oid: atav.type_.toString(),
                        oids: applicableContextRule
                            .information
                            .mandatoryContexts
                            .map((oid) => oid.toString())
                            .join(", "),
                    }),
                    new UpdateErrorData(
                        UpdateProblem_namingViolation,
                        [
                            {
                                attributeType: atav.type_,
                            },
                        ],
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            updateError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                    signErrors,
                );
            }
        }
    } // End of subschema validation

    const attributeTypesPermittedByObjectClasses: Set<IndexableOID> = new Set(
        objectClasses
            .flatMap((oc) => {
                const spec = ctx.objectClasses.get(oc.toString());
                return [
                    ...Array.from(spec?.mandatoryAttributes.values() ?? []),
                    ...Array.from(spec?.optionalAttributes.values() ?? []),
                ];
            }),
    );
    const attributesInRDN: Set<IndexableOID> = new Set();
    for (const atav of newRDN) {
        const TYPE_OID: string = atav.type_.toString();
        if (attributesInRDN.has(TYPE_OID)) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:rdn_types_duplicated", {
                    oids: Array.from(attributesInRDN.values()).join(", "),
                }),
                new UpdateErrorData(
                    UpdateProblem_namingViolation,
                    [
                        {
                            attributeType: atav.type_,
                        },
                    ],
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        updateError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
        attributesInRDN.add(TYPE_OID);
        // NOTE: This will not respect the extensibleObject OC if it was added through the RDN.
        if (!attributeTypesPermittedByObjectClasses.has(TYPE_OID) && !isExtensible) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:attribute_type_not_permitted_by_oc", {
                    oids: atav.type_.toString(),
                }),
                new UpdateErrorData(
                    UpdateProblem_objectClassViolation,
                    [
                        {
                            attributeType: atav.type_,
                        },
                    ],
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        updateError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
        if (attributeTypesForbidden.has(TYPE_OID)) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:attr_type_precluded", {
                    oid: atav.type_.toString(),
                    soc: target.dse.structuralObjectClass?.toString(),
                }),
                new UpdateErrorData(
                    UpdateProblem_objectClassViolation,
                    [
                        {
                            attributeType: atav.type_,
                        },
                    ],
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        updateError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
        if (
            atav.type_.isEqualTo(hierarchyParent["&id"])
            && (
                target.dse.objectClass.has(id_oc_child.toString())
                || newRDN.find((atav1) => (
                    atav1.type_.isEqualTo(id_at_objectClass)
                    && atav1.value.objectIdentifier.isEqualTo(id_oc_child)
                ))
            )
        ) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:child_cannot_be_in_hierarchy"),
                new UpdateErrorData(
                    UpdateProblem_familyRuleViolation,
                    [
                        {
                            attribute: new Attribute(
                                atav.type_,
                                [ atav.value ],
                                undefined,
                            ),
                        },
                        {
                            attribute: new Attribute(
                                id_at_objectClass,
                                [
                                    _encodeObjectIdentifier(id_oc_child, DER),
                                ],
                                undefined,
                            ),
                        },
                    ],
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        updateError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
        const spec = ctx.attributeTypes.get(TYPE_OID);
        if (!spec) {
            throw new errors.AttributeError(
                ctx.i18n.t("err:unrecognized_attribute_type", {
                    oids: TYPE_OID,
                }),
                new AttributeErrorData(
                    {
                        rdnSequence: targetDN,
                    },
                    [
                        new AttributeErrorData_problems_Item(
                            AttributeProblem_undefinedAttributeType,
                            atav.type_,
                            undefined,
                        ),
                    ],
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        attributeError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
        if (spec.validator) {
            try {
                spec.validator(atav.value);
            } catch {
                throw new errors.NameError(
                    ctx.i18n.t("err:invalid_attribute_syntax", {
                        type: TYPE_OID,
                    }),
                    new NameErrorData(
                        NameProblem_invalidAttributeSyntax,
                        {
                            rdnSequence: targetDN,
                        },
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            nameError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                    signErrors,
                );
            }
        }
        let hasValue: boolean = false;
        if (spec.driver?.hasValue) {
            hasValue = await spec.driver.hasValue(ctx, target, {
                type: atav.type_,
                value: atav.value,
            }, relevantSubentries);
        } else {
            hasValue = !!(await ctx.db.attributeValue.findFirst({
                where: {
                    entry_id: target.dse.id,
                    type_oid: atav.type_.toBytes(),
                    tag_class: atav.value.tagClass,
                    tag_number: atav.value.tagNumber,
                    constructed: (atav.value.construction === ASN1Construction.constructed),
                    content_octets: atav.value.value as Uint8Array<ArrayBuffer>,
                },
            }));
            if (!hasValue) {
                const matchingRule = spec.equalityMatchingRule
                    ? ctx.equalityMatchingRules.get(spec.equalityMatchingRule.toString())
                    : undefined;
                const matcher = matchingRule?.matcher;
                const values = await readValuesOfType(ctx, target, atav.type_);
                if (values.some((v) => matcher && matcher(v.value, atav.value))) {
                    hasValue = true;
                }
            }
        }
        if (!hasValue) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:rdn_values_not_present_in_entry", {
                    oids: atav.type_.toString(),
                }),
                new UpdateErrorData(
                    UpdateProblem_namingViolation,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        updateError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
    }

    const typesInNewRDN: Set<IndexableOID> = new Set(newRDN.map((atav) => atav.type_.toString()));
    // Make sure that mandatory attributes are not deleted and that user has permission to delete.
    if (data.deleteOldRDN) {
        for (const atav of oldRDN) {
            if (!ctx.config.bulkInsertMode && accessControlScheme) {
                const authorizedToRemoveOldRDNValue = acdf(
                    ctx,
                    accessControlScheme,
                    assn,
                    target,
                    [ PERMISSION_CATEGORY_REMOVE ],
                    relevantTuples,
                    user,
                    {
                        value: atav,
                        operational: isOperationalAttributeType(ctx, atav.type_),
                    },
                    bacSettings,
                    true,
                );
                if (!authorizedToRemoveOldRDNValue) {
                    throw new errors.SecurityError(
                        ctx.i18n.t("err:not_authz_delete_old_rdn"),
                        new SecurityErrorData(
                            SecurityProblem_insufficientAccessRights,
                            undefined,
                            undefined,
                            [],
                            createSecurityParameters(
                                ctx,
                                signErrors,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                securityError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            state.chainingArguments.aliasDereferenced,
                            undefined,
                        ),
                        signErrors,
                    );
                }
            }
            const TYPE_OID: string = atav.type_.toString();
            if (
                !attributeTypesRequired.has(TYPE_OID)
                || typesInNewRDN.has(TYPE_OID)
            ) {
                continue;
            }
            const matcher = EQUALITY_MATCHER(atav.type_);
            const {
                userValues: userAttributes,
                operationalValues: operationalAttributes,
            } = await readValues(ctx, target, {
                selection: new EntryInformationSelection(
                    {
                        select: [ atav.type_ ],
                    },
                    undefined,
                    {
                        select: [ atav.type_ ],
                    },
                    undefined,
                    undefined,
                    undefined,
                ),
            });
            const values = [
                ...userAttributes,
                ...operationalAttributes,
            ];
            const allValuesDeleted: boolean = matcher
                ? values
                    .filter((value) => (!value.contexts || (value.contexts.length === 0)))
                    .every((value) => matcher(value.value, atav.value))
                : (values.length <= 1);
            if (allValuesDeleted) {
                throw new errors.UpdateError(
                    ctx.i18n.t("err:deleting_old_rdn_deletes_required_attribute"),
                    new UpdateErrorData(
                        UpdateProblem_objectClassViolation,
                        [
                            {
                                attributeType: atav.type_,
                            },
                        ],
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            updateError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                    signErrors,
                );
            }
        }
    }

    if (op?.abandonTime) {
        op.events.emit("abandon");
        throw new errors.AbandonError(
            ctx.i18n.t("err:abandoned"),
            new AbandonedData(
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    abandoned["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }
    if (op) {
        op.pointOfNoReturnTime = new Date();
    }
    if (target.immediateSuperior?.subordinates?.length && (target.immediateSuperior !== superior)) {
        const entryIndex = target.immediateSuperior.subordinates
            .findIndex((child) => (child.dse.uuid === target.dse.uuid));
        target.immediateSuperior.subordinates.splice(entryIndex, 1); // Remove from the current parent.
        superior?.subordinates?.push(target); // Move to the new parent.
    }
    try {
        await renameEntry(ctx, target, superior, newRDN, newGoverningStructureRule);
    } catch (e) {
        // If the update failed, reload the entry to negate any in-memory
        // changes that took place. This same code exists in modifyEntry.
        const dbe = await ctx.db.entry.findUnique({
            where: {
                id: target.dse.id,
            },
            include: {
                RDN: {
                    select: {
                        type_oid: true,
                        tag_class: true,
                        constructed: true,
                        tag_number: true,
                        content_octets: true,
                    },
                },
                EntryObjectClass: {
                    select: {
                        object_class: true,
                    },
                },
            },
        });
        if (dbe) {
            try {
                target.dse = await dseFromDatabaseEntry(ctx, dbe);
            } catch {
                // NOOP: This succeeding is not really that critical. This can
                // silently fail.
            }
        }
        throw e;
    }

    target.dse.rdn = data.newRDN; // Update the RDN.
    target.immediateSuperior = superior;
    if (data.deleteOldRDN) {
        for (const oldATAV of oldRDN) {
            const valueInNewRDN = newRDN
                .find((newATAV) => newATAV.type_.isEqualTo(oldATAV.type_));
            if (valueInNewRDN) {
                const namingMatcher = NAMING_MATCHER(oldATAV.type_);
                if (namingMatcher?.(oldATAV.value, valueInNewRDN.value)) {
                    continue;
                }
            }
            const valueToDelete: Value = {
                type: oldATAV.type_,
                value: oldATAV.value,
            };
            try {
                await removeValues(ctx, target, [valueToDelete], assn.boundNameAndUID?.dn ?? []);
            } catch (e) {
                ctx.log.warn(ctx.i18n.t("log:failed_to_delete_old_rdn", {
                    oid: oldATAV.type_.toString(),
                    uuid: target.dse.uuid,
                }), {
                    remoteFamily: assn.socket.remoteFamily,
                    remoteAddress: assn.socket.remoteAddress,
                    remotePort: assn.socket.remotePort,
                    association_id: assn.id,
                    invokeID: printInvokeId(state.invokeId),
                });
            }
        }
    }

    if (target.dse.entry || target.dse.alias || target.dse.subentry) {
        const affectedPrefix = target.dse.subentry
            ? targetDN.slice(0, -1)
            : targetDN;
        ctx.log.info(ctx.i18n.t("log:updating_subordinate_dsas", {
            context: "moddn",
            dn: stringifyDN(ctx, targetDN),
        }));
        updateAffectedSubordinateDSAs(ctx, affectedPrefix, destinationDN); // INTENTIONAL_NO_AWAIT
    }

    const sobs = await getShadowIncrementalSteps(ctx, target, {
        rename: data.newSuperior
            ? { newDN: [ ...superiorDN, newRDN ] }
            : { newRDN },
        oldDN: targetDN,
        oldImmediateSuperior,
    });
    for (const [ sob_id, sob_obid, sob_change, step_superior ] of sobs) {
        const change = new SubordinateChanges(
            oldRDN,
            sob_change,
        );
        saveIncrementalRefresh(ctx, sob_id, step_superior ?? oldImmediateSuperior, change)
            .then() // INTENTIONAL_NO_AWAIT
            .catch((e) => ctx.log.error(ctx.i18n.t("log:failed_to_save_incremental_update_step", {
                sob_id: sob_obid,
                e,
            })));
    }

    const signResults: boolean = (
        (data.securityParameters?.target === ProtectionRequest_signed)
        && assn.authorizedForSignedResults
    );
    const resultData: ModifyDNResultData = new ModifyDNResultData(
        data.newRDN,
        [],
        createSecurityParameters(
            ctx,
            signResults,
            assn.boundNameAndUID?.dn,
            id_opcode_modifyDN,
        ),
        ctx.dsa.accessPoint.ae_title.rdnSequence,
        state.chainingArguments.aliasDereferenced,
        undefined,
    );
    const result: ModifyDNResult = signResults
        ? {
            information: (() => {
                const resultDataBytes = _encode_ModifyDNResultData(resultData, DER).toBytes();
                const key = ctx.config.signing?.key;
                if (!key) { // Signing is permitted to fail, per ITU Recommendation X.511 (2019), Section 7.10.
                    return {
                        unsigned: resultData,
                    };
                }
                const signingResult = generateSignature(key, resultDataBytes);
                if (!signingResult) {
                    return {
                        unsigned: resultData,
                    };
                }
                const [ sigAlg, sigValue ] = signingResult;
                return {
                    signed: new SIGNED(
                        resultData,
                        sigAlg,
                        unpackBits(sigValue),
                        undefined,
                        undefined,
                    ),
                };
            })(),
        }
        : {
            information: {
                unsigned: resultData,
            },
        };
    const signDSPResult: boolean = (
        (state.chainingArguments.securityParameters?.target === ProtectionRequest_signed)
        && assn.authorizedForSignedResults
    );
    return {
        result: {
            unsigned: new ChainedResult(
                new ChainingResults(
                    state.chainingResults.info,
                    state.chainingResults.crossReferences,
                    createSecurityParameters(
                        ctx,
                        signDSPResult,
                        assn.boundNameAndUID?.dn,
                        id_opcode_modifyDN,
                    ),
                    state.chainingResults.alreadySearched,
                ),
                _encode_ModifyDNResult(result, DER),
            ),
        },
        stats: {
            request: failover(() => ({
                operationCode: codeToString(id_opcode_modifyDN),
                ...getStatisticsFromCommonArguments(data),
                targetNameLength: targetDN.length,
                newRDNLength: data.newRDN.length,
                newSuperiorNameLength: data.newSuperior?.length,
                deleteOldRDN: data.deleteOldRDN,
            }), undefined),
        },
    };
}

export default modifyDN;
