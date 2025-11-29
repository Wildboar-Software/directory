import { Vertex, ClientAssociation, OperationReturn } from "../types/index.js";
import type { MeerkatContext } from "../ctx.js";
import { ObjectIdentifier, unpackBits } from "@wildboar/asn1";
import * as errors from "../types/index.js";
import {
    _decode_RemoveEntryArgument,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    RemoveEntryResult,
    _encode_RemoveEntryResult,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    RemoveEntryResultData,
    _encode_RemoveEntryResultData,
} from "@wildboar/x500/DirectoryAbstractService";
import deleteEntry from "../database/deleteEntry.js";
import {
    Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1 as ChainedResult,
} from "@wildboar/x500/DistributedOperations";
import {
    ChainingResults,
} from "@wildboar/x500/DistributedOperations";
import { BERElement } from "@wildboar/asn1";
import { getOptionallyProtectedValue } from "@wildboar/x500";
import { strict as assert } from "assert";
import {
    id_op_binding_hierarchical,
} from "@wildboar/x500/DirectoryOperationalBindingTypes";
import {
    HierarchicalAgreement,
    _decode_HierarchicalAgreement,
} from "@wildboar/x500/HierarchicalOperationalBindings";
import {
    AccessPoint,
    _decode_AccessPoint,
} from "@wildboar/x500/DistributedOperations";
import getDistinguishedName from "../x500/getDistinguishedName.js";
import {
    OperationalBindingID,
} from "@wildboar/x500/OperationalBindingManagement";
import type {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import { compareDistinguishedName } from "@wildboar/x500";
import terminateByTypeAndBindingID from "../dop/terminateByTypeAndBindingID.js";
import { SecurityErrorData } from "@wildboar/x500/DirectoryAbstractService";
import {
    SecurityProblem_insufficientAccessRights,
    SecurityProblem_invalidSignature,
} from "@wildboar/x500/DirectoryAbstractService";
import getRelevantSubentries from "../dit/getRelevantSubentries.js";
import { type ACDFTuple } from "@wildboar/x500";
import { type ACDFTupleExtended } from "@wildboar/x500";
import { PERMISSION_CATEGORY_REMOVE } from "@wildboar/x500";
import { getACDFTuplesFromACIItem } from "@wildboar/x500";
import getIsGroupMember from "../authz/getIsGroupMember.js";
import createSecurityParameters from "../x500/createSecurityParameters.js";
import {
    id_opcode_removeEntry,
} from "@wildboar/x500/CommonProtocolSpecification";
import {
    securityError,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ServiceProblem_timeLimitExceeded
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ServiceErrorData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    serviceError,
} from "@wildboar/x500/DirectoryAbstractService";
import { getDateFromTime } from "@wildboar/x500";
import type { OperationDispatcherState } from "./OperationDispatcher.js";
import { DER } from "@wildboar/asn1/functional";
import { codeToString } from "@wildboar/x500";
import getStatisticsFromCommonArguments from "../telemetry/getStatisticsFromCommonArguments.js";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter.js";
import failover from "../utils/failover.js";
import {
    AbandonedData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    abandoned,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    id_oc_parent,
} from "@wildboar/x500/InformationFramework";
import {
    id_oc_child,
} from "@wildboar/x500/InformationFramework";
import {
    FamilyGrouping_compoundEntry,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    UpdateErrorData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    updateError,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    UpdateProblem_notAncestor,
    UpdateProblem_notAllowedOnNonLeaf,
} from "@wildboar/x500/DirectoryAbstractService";
import getACIItems from "../authz/getACIItems.js";
import getRelevantOperationalBindings from "../dop/getRelevantOperationalBindings.js";
import updateAffectedSubordinateDSAs from "../dop/updateAffectedSubordinateDSAs.js";
import updateSuperiorDSA from "../dop/updateSuperiorDSA.js";
import bacSettings from "../authz/bacSettings.js";
import {
    NameAndOptionalUID,
} from "@wildboar/x500/SelectedAttributeTypes";
import preprocessTuples from "../authz/preprocessTuples.js";
import removeAttribute from "../database/entry/removeAttribute.js";
import {
    hierarchyParent,
} from "@wildboar/x500/InformationFramework";
import {
    ProtectionRequest_signed,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ErrorProtectionRequest_signed,
} from "@wildboar/x500/DirectoryAbstractService";
import { generateSignature } from "../pki/generateSignature.js";
import { SIGNED } from "@wildboar/x500/AuthenticationFramework";
import { stringifyDN } from "../x500/stringifyDN.js";
import { printInvokeId } from "../utils/printInvokeId.js";
import { UNTRUSTED_REQ_AUTH_LEVEL } from "../constants.js";
import { getEntryExistsFilter } from "../database/entryExistsFilter.js";
import { getShadowIncrementalSteps } from "../dop/getRelevantSOBs.js";
import {
    SubordinateChanges,
} from "@wildboar/x500/DirectoryShadowAbstractService";
import { saveIncrementalRefresh } from "../disp/saveIncrementalRefresh.js";
import { acdf } from "../authz/acdf.js";

const PARENT: string = id_oc_parent.toString();
const CHILD: string = id_oc_child.toString();

/**
 * @summary The removeEntry operation, as specified in ITU Recommendation X.511.
 * @description
 *
 * The `removeEntry` operation, as specified in ITU Recommendation X.511 (2016),
 * Section 12.2. per the recommended implementation in ITU Recommendation X.518
 * (2016), Section 19.1.2.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param state The operation dispatcher state
 *
 * @function
 * @async
 */
export
async function removeEntry (
    ctx: MeerkatContext,
    assn: ClientAssociation,
    state: OperationDispatcherState,
): Promise<OperationReturn> {
    const NAMING_MATCHER = getNamingMatcherGetter(ctx);
    const target = state.foundDSE;
    const argument = _decode_RemoveEntryArgument(state.operationArgument);
    const data = getOptionallyProtectedValue(argument);
    const signErrors: boolean = (
        (data.securityParameters?.errorProtection === ErrorProtectionRequest_signed)
        && (assn.authorizedForSignedErrors)
    );
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
    const user = requestor
        ? new NameAndOptionalUID(
            requestor,
            state.chainingArguments.uniqueIdentifier,
        )
        : undefined;
    const relevantSubentries: Vertex[] = (await Promise.all(
        state.admPoints.map((ap) => getRelevantSubentries(ctx, target, targetDN, ap)),
    )).flat();
    const accessControlScheme = [ ...state.admPoints ] // Array.reverse() works in-place, so we create a new array.
        .reverse()
        .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
    if (accessControlScheme) {
        const relevantACIItems = await getACIItems(
            ctx,
            accessControlScheme,
            target.immediateSuperior,
            target,
            relevantSubentries,
            Boolean(target.dse.subentry),
        );
        const acdfTuples: ACDFTuple[] = (relevantACIItems ?? [])
            .flatMap((aci) => getACDFTuplesFromACIItem(aci));
        const NAMING_MATCHER = getNamingMatcherGetter(ctx);
        const isMemberOfGroup = getIsGroupMember(ctx, NAMING_MATCHER);
        const relevantTuples: ACDFTupleExtended[] = await preprocessTuples(
            accessControlScheme,
            acdfTuples,
            user,
            state.chainingArguments.authenticationLevel ?? UNTRUSTED_REQ_AUTH_LEVEL,
            targetDN,
            isMemberOfGroup,
            NAMING_MATCHER,
        );
        const authorizedToRemoveEntry = acdf(
            ctx,
            accessControlScheme,
            assn,
            target,
            [ PERMISSION_CATEGORY_REMOVE ],
            relevantTuples,
            user,
            {
                entry: Array.from(target.dse.objectClass).map(ObjectIdentifier.fromString),
            },
            bacSettings,
            true,
        );
        if (!authorizedToRemoveEntry) {
            throw new errors.SecurityError(
                ctx.i18n.t("err:not_authz_remove_entry"),
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

    const nonChildSubordinate = await ctx.db.entry.findFirst({
        where: {
            immediate_superior_id: target.dse.id,
            ...getEntryExistsFilter(),
            EntryObjectClass: {
                none: {
                    object_class: CHILD,
                },
            },
        },
        select: {
            id: true,
        },
    });
    if (nonChildSubordinate) {
        throw new errors.UpdateError(
            ctx.i18n.t("err:not_allowed_on_non_leaf"),
            new UpdateErrorData(
                UpdateProblem_notAllowedOnNonLeaf,
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

    const isParent: boolean = target.dse.objectClass.has(PARENT);
    const isChild: boolean = target.dse.objectClass.has(CHILD);
    const isAncestor: boolean = (isParent && !isChild);
    if (!isAncestor && (data.familyGrouping === FamilyGrouping_compoundEntry)) {
        throw new errors.UpdateError(
            ctx.i18n.t("err:not_ancestor"),
            new UpdateErrorData(
                UpdateProblem_notAncestor,
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
    const alsoDeleteFamily: boolean = (isAncestor && (data.familyGrouping === FamilyGrouping_compoundEntry));

    checkTimeLimit();
    if (target.dse.subentry) { // Go to step 5.
        // Steps moved to run _after_ the local deletion of the DSE.
        if (target.immediateSuperior?.dse.cp) {
            ctx.log.info(ctx.i18n.t("log:updating_superior_dsa", {
                context: "subentry",
                uuid: target.dse.uuid,
            }), {
                remoteFamily: assn.socket.remoteFamily,
                remoteAddress: assn.socket.remoteAddress,
                remotePort: assn.socket.remotePort,
                association_id: assn.id,
                invokeID: printInvokeId(state.invokeId),
            });
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
    } else if (target.dse.cp) { // Go to step 6.
        // 1. Remove the naming context.
        // 2. Terminate the HOB, if applicable.
        // - a. Query the database for all active HOBs where local DSA is subordinate
        //      and immediate_superior + rdn === this entry. Include the access point (ber).
        // - c. Issue a terminate OB operation to all relevant access points.
        ctx.log.info(ctx.i18n.t("log:removing_a_context_prefix", {
            uuid: target.dse.uuid,
        }));
        const targetDN = getDistinguishedName(target);
        const relevantOperationalBindings = await getRelevantOperationalBindings(ctx, false);
        for (const ob of relevantOperationalBindings) {
            if (!ob.access_point) {
                continue;
            }
            if (ob.binding_type !== id_op_binding_hierarchical.toString()) {
                /* DEVIATION: The specifications say that an NHOB should be
                deleted once the last subordinate is deleted, but Meerkat DSA
                does not do this so that the NHOB can be re-used. */
                continue;
            }
            const argreementElement = new BERElement();
            argreementElement.fromBytes(ob.agreement_ber);
            const agreement: HierarchicalAgreement = _decode_HierarchicalAgreement(argreementElement);
            const agreementDN: DistinguishedName = [
                ...agreement.immediateSuperior,
                agreement.rdn,
            ];
            const match = compareDistinguishedName(targetDN, agreementDN, NAMING_MATCHER);
            if (!match) {
                continue;
            }
            const bindingID = new OperationalBindingID(
                ob.binding_identifier,
                ob.binding_version,
            );
            const accessPointElement = new BERElement();
            accessPointElement.fromBytes(ob.access_point.ber);
            const accessPoint: AccessPoint = _decode_AccessPoint(accessPointElement);
            ctx.log.info(ctx.i18n.t("log:terminating_ob", {
                context: "cp",
                uuid: ob.uuid,
            }));
            try {
                assert(target.immediateSuperior);
                // We do not await the return value. This can run independently
                // of returning from this operation.
                terminateByTypeAndBindingID(
                    ctx,
                    assn,
                    accessPoint,
                    id_op_binding_hierarchical,
                    bindingID,
                    state.chainingArguments.aliasDereferenced,
                )
                    .then(() => {
                        ctx.log.info(ctx.i18n.t("log:terminated_ob", {
                            context: "cp",
                            uuid: ob.uuid,
                        }));
                    })
                    .catch((e) => {
                        ctx.telemetry.trackException({
                            exception: e,
                            properties: {
                                obUUID: ob.uuid,
                                obType: id_op_binding_hierarchical.toString(),
                                obid: ob.binding_identifier,
                                obver: ob.binding_version,
                                administratorEmail: ctx.config.administratorEmail,
                                invokeID: printInvokeId(state.invokeId),
                            },
                            measurements: {
                                bytesRead: assn.socket.bytesRead,
                                bytesWritten: assn.socket.bytesWritten,
                            },
                        });
                        ctx.log.warn(ctx.i18n.t("log:failed_to_update_hob", {
                            obid: bindingID.identifier.toString(),
                            version: bindingID.version.toString(),
                            e: e.message,
                        }), {
                            remoteFamily: assn.socket.remoteFamily,
                            remoteAddress: assn.socket.remoteAddress,
                            remotePort: assn.socket.remotePort,
                            association_id: assn.id,
                            invokeID: printInvokeId(state.invokeId),
                        });
                    });
            } catch (e) {
                ctx.log.warn(ctx.i18n.t("log:failed_to_update_hob", {
                    obid: bindingID.identifier.toString(),
                    version: bindingID.version.toString(),
                    e: e.message,
                }), {
                    remoteFamily: assn.socket.remoteFamily,
                    remoteAddress: assn.socket.remoteAddress,
                    remotePort: assn.socket.remotePort,
                    association_id: assn.id,
                    invokeID: printInvokeId(state.invokeId),
                });
                continue;
            }
        }
    } else if (target.dse.entry || target.dse.alias) { // Go to step 4.
        // 1. Remove the entry or alias entry.
        // 2. Continue at step 7.
    }
    const sobs = await getShadowIncrementalSteps(ctx, target, { remove: null });
    for (const [ sob_id, sob_obid, sob_change ] of sobs) {
        const change = new SubordinateChanges(
            target.dse.rdn,
            sob_change,
        );
        saveIncrementalRefresh(ctx, sob_id, target.immediateSuperior!, change)
            .then() // INTENTIONAL_NO_AWAIT
            .catch((e) => ctx.log.error(ctx.i18n.t("log:failed_to_save_incremental_update_step", {
                sob_id: sob_obid,
                e,
            })));
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
    /** Remove the `hierarchyParent` attribute so hierarchical children are updated */
    ctx.db.$transaction(await removeAttribute(ctx, target, hierarchyParent["&id"]))
        .then()
        .catch((e) => ctx.log.error(ctx.i18n.t("log:failed_to_remove_hp"), e));
    await deleteEntry(ctx, target, alsoDeleteFamily);

    if (target.dse.subentry) {
        // 1. Remove the subentry.
        // 2. Modify the operational bindings of all relevant subordinate DSAs.
        // - a. Get the DN administrative point
        // - b. Query the database for all active HOBs where local DSA is superior
        //      and admin point is a prefix of immediate_superior. Include the access point (ber).
        // - c. Issue a modify OB operation to all relevant access points.
        // 3. Continue at step 7.
        updateAffectedSubordinateDSAs(ctx, targetDN.slice(0, -1)); // INTENTIONAL_NO_AWAIT
    }

    const signResults: boolean = (
        (data.securityParameters?.target === ProtectionRequest_signed)
        && assn.authorizedForSignedResults
    );
    const resultData: RemoveEntryResultData = new RemoveEntryResultData(
        [],
        createSecurityParameters(
            ctx,
            signResults,
            assn.boundNameAndUID?.dn,
            id_opcode_removeEntry,
        ),
        ctx.dsa.accessPoint.ae_title.rdnSequence,
        state.chainingArguments.aliasDereferenced,
        undefined,
    );
    const result: RemoveEntryResult = signResults
        ? {
            information: (() => {
                const resultDataBytes = _encode_RemoveEntryResultData(resultData, DER).toBytes();
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
                        id_opcode_removeEntry,
                    ),
                    state.chainingResults.alreadySearched,
                ),
                _encode_RemoveEntryResult(result, DER),
            ),
        },
        stats: {
            request: failover(() => ({
                operationCode: codeToString(id_opcode_removeEntry),
                ...getStatisticsFromCommonArguments(data),
                targetNameLength: targetDN.length,
            }), undefined),
        },
    };
}

export default removeEntry;
