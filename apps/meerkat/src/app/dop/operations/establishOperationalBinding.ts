import { Buffer } from "node:buffer";
import type { MeerkatContext } from "../../ctx.js";
import * as errors from "../../types/index.js";
import { Vertex } from "../../types/index.js";
import DOPAssociation from "../DOPConnection.js";
import { INTEGER, FALSE, unpackBits, ASN1TagClass, ASN1Construction, OBJECT_IDENTIFIER, TRUE } from "@wildboar/asn1";
import type {
    EstablishOperationalBindingArgument,
} from "@wildboar/x500/OperationalBindingManagement";
import {
    AccessPoint,
    _decode_AccessPoint,
} from "@wildboar/x500/DistributedOperations";
import {
    EstablishOperationalBindingArgumentData, Validity,
} from "@wildboar/x500/OperationalBindingManagement";
import type {
    EstablishOperationalBindingResult,
} from "@wildboar/x500/OperationalBindingManagement";
import {
    EstablishOperationalBindingResultData,
    _encode_EstablishOperationalBindingResultData,
} from "@wildboar/x500/OperationalBindingManagement";
import {
    id_op_binding_hierarchical,
} from "@wildboar/x500/DirectoryOperationalBindingTypes";
import {
    id_op_binding_non_specific_hierarchical,
} from "@wildboar/x500/DirectoryOperationalBindingTypes";
import {
    id_op_binding_shadow,
} from "@wildboar/x500/DirectoryOperationalBindingTypes";
import {
    OpBindingErrorParam,
} from "@wildboar/x500/OperationalBindingManagement";
import {
    OpBindingErrorParam_problem_unsupportedBindingType,
    OpBindingErrorParam_problem_invalidAgreement,
    OpBindingErrorParam_problem_invalidStartTime,
    OpBindingErrorParam_problem_invalidEndTime,
    OpBindingErrorParam_problem_duplicateID,
    OpBindingErrorParam_problem_currentlyNotDecidable,
    OpBindingErrorParam_problem_parametersMissing,
    OpBindingErrorParam_problem_roleAssignment,
    OpBindingErrorParam_problem_invalidID,
} from "@wildboar/x500/OperationalBindingManagement";
import {
    HierarchicalAgreement,
    _decode_HierarchicalAgreement,
} from "@wildboar/x500/HierarchicalOperationalBindings";
import {
    SuperiorToSubordinate,
    _decode_SuperiorToSubordinate,
    _encode_SuperiorToSubordinate,
} from "@wildboar/x500/HierarchicalOperationalBindings";
import {
    SubordinateToSuperior,
    _decode_SubordinateToSuperior,
    _encode_SubordinateToSuperior,
} from "@wildboar/x500/HierarchicalOperationalBindings";
import {
    SubentryInfo,
} from "@wildboar/x500/HierarchicalOperationalBindings";
import type {
    Code,
} from "@wildboar/x500/CommonProtocolSpecification";
import {
    OperationalBindingID,
} from "@wildboar/x500/OperationalBindingManagement";
import { compareDistinguishedName } from "@wildboar/x500";
import { ASN1Element, packBits } from "@wildboar/asn1";
import becomeSubordinate from "../establish/becomeSubordinate.js";
import { OperationalBindingInitiator, Knowledge } from "../../generated/client.js";
import {
    _encode_CertificationPath,
} from "@wildboar/x500/AuthenticationFramework";
import rdnToJson from "../../x500/rdnToJson.js";
import { getDateFromTime } from "@wildboar/x500";
import { getOptionallyProtectedValue } from "@wildboar/x500";
import { DER, _encodeNull } from "@wildboar/asn1/functional";
import createSecurityParameters from "../../x500/createSecurityParameters.js";
import {
    id_err_operationalBindingError,
} from "@wildboar/x500/CommonProtocolSpecification";
import {
    id_op_establishOperationalBinding,
} from "@wildboar/x500/CommonProtocolSpecification";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter.js";
import saveAccessPoint from "../../database/saveAccessPoint.js";
import {
    _encode_AttributeCertificationPath as _encode_ACP,
} from "@wildboar/x500/AttributeCertificateDefinitions";
import {
    _encode_Token,
} from "@wildboar/x500/DirectoryAbstractService";
import { getDateFromOBTime } from "../getDateFromOBTime.js";
import { printInvokeId } from "../../utils/printInvokeId.js";
import { validateEntry, ValidateEntryReturn } from "../../x500/validateNewEntry.js";
import { randomInt, timingSafeEqual } from "node:crypto";
import {
    ErrorProtectionRequest_signed,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ProtectionRequest_signed,
} from "@wildboar/x500/DirectoryAbstractService";
import { generateSignature } from "../../pki/generateSignature.js";
import { SIGNED } from "@wildboar/x500/AuthenticationFramework";
import {
    EstablishOperationalBindingArgumentData_initiator,
} from "@wildboar/x500/OperationalBindingManagement";
// import { _decode_AgreementID } from "@wildboar/x500/DirectoryShadowAbstractService";
import {
    _decode_NonSpecificHierarchicalAgreement,
} from "@wildboar/x500/HierarchicalOperationalBindings";
// import {
//     _decode_ShadowingAgreementInfo,
// } from "@wildboar/x500/DirectoryShadowAbstractService";
import dnToVertex from "../../dit/dnToVertex.js";
import getContextPrefixInfo from "../../hob/getContextPrefixInfo.js";
import { getEntryAttributesToShareInOpBinding } from "../../dit/getEntryAttributesToShareInOpBinding.js";
import {
    Attribute,
} from "@wildboar/x500/InformationFramework";
import rdnToID from "../../dit/rdnToID.js";
import getVertexById from "../../database/getVertexById.js";
import createEntry from "../../database/createEntry.js";
import getAttributesFromSubentry from "../../dit/getAttributesFromSubentry.js";
import { bindForOBM } from "../../net/bindToOtherDSA.js";
import { SecurityErrorData } from "@wildboar/x500/DirectoryAbstractService";
import {
    SecurityProblem_insufficientAccessRights,
} from "@wildboar/x500/DirectoryAbstractService";
import { becomeNonSpecificSubordinate } from "../establish/becomeNonSpecificSubordinate.js";
import {
    _decode_NHOBSubordinateToSuperior,
    _encode_NHOBSubordinateToSuperior,
} from "@wildboar/x500/HierarchicalOperationalBindings";
import {
    _decode_NHOBSuperiorToSubordinate,
    _encode_NHOBSuperiorToSubordinate,
} from "@wildboar/x500/HierarchicalOperationalBindings";
import becomeNonSpecificSuperior from "../establish/becomeNonSpecificSuperior.js";
import becomeSuperior from "../establish/becomeSuperior.js";
import { ShadowedKnowledgeType } from "../../generated/client.js";
import stringifyDN from "../../x500/stringifyDN.js";
import {
    top,
    DistinguishedName,
    SubtreeSpecification,
} from "@wildboar/x500/InformationFramework";
import { person } from "@wildboar/x500/SelectedObjectClasses";
import terminateByTypeAndBindingID from "../terminateByTypeAndBindingID.js";
import {
    ShadowingAgreementInfo,
    UnitOfReplication,
    _decode_ShadowingAgreementInfo,
    _encode_ShadowingAgreementInfo,
} from "@wildboar/x500/DirectoryShadowAbstractService";
import { becomeShadowConsumer } from "../establish/becomeShadowConsumer.js";
import { becomeShadowSupplier } from "../establish/becomeShadowSupplier.js";
import { updateShadowConsumer } from "../../disp/createShadowUpdate.js";
import { AttributeUsage_dSAOperation } from "@wildboar/x500/InformationFramework";
import { addYears, subSeconds } from "date-fns";
import { ModificationParameter, _encode_ModificationParameter } from "@wildboar/x500/DirectoryShadowAbstractService";
import { AreaSpecification } from "@wildboar/x500/DirectoryShadowAbstractService";
import { id_op_modifyOperationalBinding } from "@wildboar/x500/CommonProtocolSpecification";
import scheduleShadowUpdates from "../../disp/scheduleShadowUpdates.js";
import { PeriodicStrategy, SchedulingParameters } from "@wildboar/x500/DirectoryShadowAbstractService";
import { cacheNamingContexts } from "../../dit/cacheNamingContexts.js";
import { clearSafeTimeout } from "@wildboar/safe-timers";
import isAutoApproved from "../isAutoApproved.js";

// TODO: Use printCode()
function codeToString (code?: Code): string | undefined {
    return (code
        ? ("global" in code)
            ? code.global.toString()
            : ("local" in code)
                ? code.local.toString()
                : undefined
        : undefined);
}

// This is just for testing purposes and should be deleted.
async function modifySOB_delete_me (
    ctx: MeerkatContext,
    binding_identifier: number,
    originalAgreement: ShadowingAgreementInfo,
    relayTo: AccessPoint,
): Promise<void> {
    ctx.log.error("TESTING CODE LEFT IN THE APPLICATION. THIS IS A BUG IF YOU SEE THIS.");
    const iAmSupplier: boolean = true;
    const dop = await bindForOBM(ctx, undefined, undefined, relayTo, undefined, false);
    if (!dop) {
        throw new Error("d4904af9-95d7-4c2a-acc5-9616c35274ac");
    }
    const last = await ctx.db.operationalBinding.findFirst({
        where: {
            next_version: {
                none: {},
            },
            binding_type: id_op_binding_shadow.toString(),
            binding_identifier: binding_identifier,
            binding_version: 0,
            accepted: true,
        },
        select: {
            id: true,
            access_point_id: true,
        },
    });
    if (!last) {
        throw new Error("4f16ca13-de5e-4a89-bf84-ed7a8718c7a7");
    }
    const newAgreement = new ShadowingAgreementInfo(
        new UnitOfReplication(
            new AreaSpecification(
                originalAgreement.shadowSubject.area.contextPrefix.slice(0, -1),
                new SubtreeSpecification(
                    originalAgreement.shadowSubject.area.replicationArea.base,
                    originalAgreement.shadowSubject.area.replicationArea.specificExclusions,
                    originalAgreement.shadowSubject.area.replicationArea.minimum,
                    originalAgreement.shadowSubject.area.replicationArea.maximum,
                    {
                        item: person["&id"],
                    },
                ),
            ),
            originalAgreement.shadowSubject.attributes,
            originalAgreement.shadowSubject.knowledge,
            TRUE,
            originalAgreement.shadowSubject.contextSelection,
            originalAgreement.shadowSubject.supplyContexts,
        ),
        // originalAgreement.shadowSubject,
        // originalAgreement.updateMode, // TODO: Test with changed update mode.
        {
            consumerInitiated: new SchedulingParameters(
                new PeriodicStrategy(
                    undefined,
                    60,
                    120,
                ),
                undefined,
            ),
        },
        originalAgreement.master,
        originalAgreement.secondaryShadows,
    );
    const sp = createSecurityParameters(
        ctx,
        true,
        relayTo.ae_title.rdnSequence,
        id_op_modifyOperationalBinding,
    );
    const outcome = iAmSupplier
        ? await dop.modifySOBWithConsumer({
            bindingID: new OperationalBindingID(
                binding_identifier,
                0,
            ),
            newAgreement,
            initiator: undefined,
            cert_path: ctx.config.signing.certPath,
            key: ctx.config.signing.key,
            securityParameters: sp,
        })
        : await dop.modifySOBWithSupplier({
            bindingID: new OperationalBindingID(
                binding_identifier,
                0,
            ),
            newAgreement,
            initiator: new ModificationParameter([]),
            cert_path: ctx.config.signing.certPath,
            key: ctx.config.signing.key,
            securityParameters: sp,
        });
    dop.unbind({ disconnectSocket: true });
    if (!("result" in outcome)) {
        return;
    }
    const agr_el = _encode_ShadowingAgreementInfo(newAgreement, DER).toBytes();

    const { id } = await ctx.db.operationalBinding.create({
        data: {
            accepted: true,
            outbound: true,
            terminated_time: null,
            binding_type: id_op_binding_shadow.toString(),
            binding_identifier: binding_identifier,
            binding_version: 1,
            agreement_ber: Buffer.from(agr_el),
            ...(last?.access_point_id
                ? {
                    access_point: {
                        connect: {
                            id: last.access_point_id,
                        },
                    },
                }
                : {}),
            initiator: iAmSupplier
                ? OperationalBindingInitiator.ROLE_A
                : OperationalBindingInitiator.ROLE_B,
            initiator_ber: iAmSupplier
                ? Buffer.from(_encodeNull(null, DER).toBytes())
                : Buffer.from(_encode_ModificationParameter(new ModificationParameter([]), DER).toBytes()),
            validity_start: new Date(),
            validity_end: addYears(new Date(), 5),
            security_certification_path: sp?.certification_path
                ? _encode_CertificationPath(sp.certification_path, DER).toBytes()
                : undefined,
            security_name: sp?.name?.map((rdn) => rdnToJson(rdn)),
            security_time: sp?.time
                ? getDateFromTime(sp.time)
                : undefined,
            security_random: sp?.random
                ? Buffer.from(packBits(sp.random))
                : undefined,
            security_target: (sp?.target !== undefined)
                ? Number (sp.target)
                : undefined,
            security_operationCode: codeToString(sp?.operationCode),
            security_errorProtection: (sp?.errorProtection !== undefined)
                ? Number(sp.errorProtection)
                : undefined,
            security_errorCode: codeToString(sp?.errorCode),
            requested_time: new Date(),
            previous: {
                connect: {
                    id: last.id,
                },
            },
        },
        select: {
            id: true,
        },
    });
    // We can delete these, supplier or not, since OBs are supposed to
    // be unique across (type, id).
    const t1 = ctx.pendingShadowingUpdateCycles.get(binding_identifier);
    const t2 = ctx.shadowUpdateCycles.get(binding_identifier);
    if (t1) {
        clearSafeTimeout(t1);
    }
    if (t2) {
        clearTimeout(t2);
    }
    ctx.pendingShadowingUpdateCycles.delete(binding_identifier);
    ctx.shadowUpdateCycles.delete(binding_identifier);
    scheduleShadowUpdates(ctx, newAgreement, id, binding_identifier, new Date(), iAmSupplier);
}

async function relayedEstablishOperationalBinding (
    ctx: MeerkatContext,
    assn: DOPAssociation,
    invokeId: INTEGER,
    bindingType: OBJECT_IDENTIFIER,
    agreement: ASN1Element,
    initiator: EstablishOperationalBindingArgumentData_initiator,
    validFrom: Date,
    validUntil: Date | undefined,
    relayTo: AccessPoint,
    signErrors: boolean,
): Promise<EstablishOperationalBindingResult> {
    const subentriesCache: Map<number, Vertex[]> = new Map();
    let relay_agreement: ASN1Element | undefined;
    let relay_init: EstablishOperationalBindingArgumentData_initiator | undefined;
    let cp: Vertex | undefined;
    let ob_entry: Vertex | undefined;
    const NAMING_MATCHER = getNamingMatcherGetter(ctx);
    if (bindingType.isEqualTo(id_op_binding_hierarchical)) {
        const agr = _decode_HierarchicalAgreement(agreement);
        if ("roleA_initiates" in initiator) {
            const init = _decode_SuperiorToSubordinate(initiator.roleA_initiates);
            const last_vertex = init.contextPrefixInfo[init.contextPrefixInfo.length - 1];
            for (const ap of last_vertex?.accessPoints ?? []) {
                if (compareDistinguishedName(
                    ap.ae_title.rdnSequence,
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    NAMING_MATCHER,
                )) {
                    throw new errors.OperationalBindingError(
                        ctx.i18n.t("err:cannot_establish_ob_with_self"),
                        new OpBindingErrorParam(
                            OpBindingErrorParam_problem_roleAssignment,
                            bindingType,
                            undefined,
                            undefined,
                            [],
                            createSecurityParameters(
                                ctx,
                                signErrors,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                id_err_operationalBindingError,
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            undefined,
                            undefined,
                        ),
                        signErrors,
                    );
                }
            }
            // This is only checked for Role A, because Role B (subordinate)
            // won't have this entry locally.
            const supr_entry = await dnToVertex(ctx, ctx.dit.root, agr.immediateSuperior);
            if (!supr_entry) {
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:agreement_entry_not_found"),
                    new OpBindingErrorParam(
                        OpBindingErrorParam_problem_invalidAgreement,
                        bindingType,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_err_operationalBindingError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                    signErrors,
                );
            }
            ob_entry = supr_entry;
            const immediateSuperiorInfo: Attribute[] = await getEntryAttributesToShareInOpBinding(ctx, supr_entry);
            const new_sup2sub = new SuperiorToSubordinate(
                await getContextPrefixInfo(ctx, supr_entry),
                init.entryInfo,
                immediateSuperiorInfo,
            );
            relay_agreement = agreement;
            relay_init = {
                roleA_initiates: _encode_SuperiorToSubordinate(new_sup2sub, DER),
            };
        } else if ("roleB_initiates"  in initiator) {
            const init = _decode_SubordinateToSuperior(initiator.roleB_initiates);
            for (const ap of init.accessPoints ?? []) {
                if (compareDistinguishedName(
                    ap.ae_title.rdnSequence,
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    NAMING_MATCHER,
                )) {
                    throw new errors.OperationalBindingError(
                        ctx.i18n.t("err:cannot_establish_ob_with_self"),
                        new OpBindingErrorParam(
                            OpBindingErrorParam_problem_roleAssignment,
                            bindingType,
                            undefined,
                            undefined,
                            [],
                            createSecurityParameters(
                                ctx,
                                signErrors,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                id_err_operationalBindingError,
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            undefined,
                            undefined,
                        ),
                        signErrors,
                    );
                }
            }
            let current: Vertex = ctx.dit.root;
            for (const rdn of agr.immediateSuperior) {
                const sub_id = await rdnToID(ctx, current.dse.id, rdn);
                // Create the missing glue DSEs from the root DSE downward
                if (sub_id) { // Entry already exists. Just read it.
                    const existing_vertex = await getVertexById(ctx, current, sub_id);
                    if (existing_vertex) {
                        current = existing_vertex;
                    } else {
                        current = await createEntry(ctx, current, rdn, {
                            glue: true,
                        }, [], undefined, signErrors);
                    }
                } else { // Entry does not exist. Create glue DSE.
                    current = await createEntry(ctx, current, rdn, {
                        glue: true,
                    }, [], undefined, signErrors);
                }
            }
            if (!init.entryInfo) {
                throw new Error(ctx.i18n.t("err:entry_info_reqd_for_relayed_hob"));
            }
            await validateEntry(
                ctx,
                assn,
                current,
                agr.immediateSuperior,
                agr.rdn,
                init.entryInfo,
                FALSE,
                TRUE,
                {
                    present: invokeId,
                },
                subentriesCache,
                false,
                signErrors,
            );

            // Create the subordinate with all attributes in `entryInfo`.
            const entry = await createEntry(ctx, current, agr.rdn, {
                entry: !init.alias,
                alias: init.alias,
                cp: true,
            }, init.entryInfo ?? [], undefined, signErrors);
            cp = entry;
            ob_entry = entry;
            const subentryInfos: SubentryInfo[] = [];
            for (const subentry of init.subentries ?? []) {
                // TODO: This does not validate that the entry is actually a subentry...
                await validateEntry(
                    ctx,
                    assn,
                    entry,
                    [ ...agr.immediateSuperior, entry.dse.rdn ],
                    subentry.rdn,
                    subentry.info,
                    FALSE,
                    TRUE,
                    {
                        present: invokeId,
                    },
                    subentriesCache,
                    false,
                    signErrors,
                );
                const sub = await createEntry(ctx, entry, subentry.rdn, {
                    subentry: true,
                }, subentry.info, undefined, signErrors);
                const info = new SubentryInfo(
                    sub.dse.rdn,
                    await getAttributesFromSubentry(ctx, sub),
                );
                subentryInfos.push(info);
            }
            const sub2sup = new SubordinateToSuperior(
                [
                    ctx.dsa.accessPoint,
                ],
                !!entry.dse.alias,
                await getEntryAttributesToShareInOpBinding(ctx, entry),
                subentryInfos,
            );
            relay_agreement = agreement;
            relay_init = {
                roleB_initiates: _encode_SubordinateToSuperior(sub2sup, DER),
            };
            // TODO: Upon receiving a result, replace the glue entries.
        } else {
            throw new errors.MistypedArgumentError(ctx.i18n.t("err:invalid_initiator"));
        }
    }
    else if (bindingType.isEqualTo(id_op_binding_non_specific_hierarchical)) {
        const agr = _decode_NonSpecificHierarchicalAgreement(agreement);
        if ("roleA_initiates" in initiator) {
            // This is only checked for Role A, because Role B (subordinate)
            // won't have this entry locally.
            const supr_entry = await dnToVertex(ctx, ctx.dit.root, agr.immediateSuperior);
            if (!supr_entry) {
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:agreement_entry_not_found"),
                    new OpBindingErrorParam(
                        OpBindingErrorParam_problem_invalidAgreement,
                        bindingType,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_err_operationalBindingError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                    signErrors,
                );
            }
            ob_entry = supr_entry;
            const immediateSuperiorInfo: Attribute[] = await getEntryAttributesToShareInOpBinding(ctx, supr_entry);
            const new_sup2sub = new SuperiorToSubordinate(
                await getContextPrefixInfo(ctx, supr_entry),
                undefined,
                immediateSuperiorInfo,
            );
            relay_agreement = agreement;
            relay_init = {
                roleA_initiates: _encode_SuperiorToSubordinate(new_sup2sub, DER),
            };
        } else if ("roleB_initiates" in initiator) {
            relay_agreement = agreement;
            relay_init = initiator;
        } else {
            throw new errors.MistypedArgumentError(ctx.i18n.t("err:invalid_initiator"));
        }
    }
    else if (bindingType.isEqualTo(id_op_binding_shadow)) {
        if (!("roleA_initiates" in initiator) && !("roleB_initiates" in initiator)) {
            throw new errors.MistypedArgumentError(ctx.i18n.t("err:invalid_initiator"));
        }
        const agr = _decode_ShadowingAgreementInfo(agreement);
        const agreementDN = agr.shadowSubject.area.contextPrefix;
        if ("roleA_initiates" in initiator) {
            cp = await dnToVertex(ctx, ctx.dit.root, agreementDN);
            if (!cp) {
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:cannot_find_local_base_entry_to_replicate"),
                    new OpBindingErrorParam(
                        OpBindingErrorParam_problem_invalidAgreement,
                        bindingType,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_err_operationalBindingError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                    signErrors,
                );
            }
        }
        // There is no validation other than checking that the CP exists.
        relay_agreement = agreement;
        if ("roleA_initiates" in initiator) {
            relay_init = {
                roleA_initiates: _encodeNull(null, DER),
            };
        }
        else {
            relay_init = {
                roleB_initiates: _encodeNull(null, DER),
            };
        }
    }
    else {
        // If bindingType is not understood, just submit the agreement and initiator unchanged.
        relay_agreement = agreement;
        relay_init = initiator;
    }
    const dop = await bindForOBM(ctx, assn, undefined, relayTo, undefined, signErrors);
    if (!dop) {
        throw new errors.OperationalBindingError(
            ctx.i18n.t("err:failed_to_bind_to_other_dsa_for_dop"),
            new OpBindingErrorParam(
                OpBindingErrorParam_problem_currentlyNotDecidable,
                bindingType,
                undefined,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    id_err_operationalBindingError,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
            signErrors,
        );
    }
    const sp = createSecurityParameters(
        ctx,
        true,
        relayTo.ae_title.rdnSequence,
        id_op_establishOperationalBinding,
    );
    try {
        const outcome = await dop.establishOperationalBinding({
            accessPoint: ctx.dsa.accessPoint,
            agreement: relay_agreement,
            initiator: relay_init,
            bindingType,
            cert_path: ctx.config.signing.certPath,
            key: ctx.config.signing.key,
            valid: new Validity(
                {
                    time: {
                        generalizedTime: validFrom,
                    },
                },
                validUntil
                    ? {
                        time: {
                            generalizedTime: validUntil,
                        },
                    }
                    : {
                        explicitTermination: null,
                    },
            ),
            bindingID: undefined,
            securityParameters: sp,
            _unrecognizedExtensionsList: [],
        });
        let err_message: string = "";
        if ("result" in outcome) {
            const result = outcome.result.parameter;
            const data = getOptionallyProtectedValue(result);
            if (!data.bindingID) {
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:other_dsa_did_not_choose_binding_id"),
                    new OpBindingErrorParam(
                        OpBindingErrorParam_problem_invalidID,
                        bindingType,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_err_operationalBindingError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                    ),
                );
            }
            if (!data.bindingType.isEqualTo(bindingType)) {
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:other_dsa_changed_ob_type"),
                    new OpBindingErrorParam(
                        OpBindingErrorParam_problem_unsupportedBindingType,
                        bindingType,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_err_operationalBindingError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                    ),
                );
            }
            const access_point_id = await saveAccessPoint(ctx, relayTo, Knowledge.OB_REQUEST);
            const ob_db_data = {
                accepted: true,
                outbound: true,
                binding_type: bindingType.toString(),
                binding_identifier: Number(data.bindingID.identifier),
                binding_version: Number(data.bindingID.version),
                agreement_ber: agreement.toBytes(),
                initiator: (() => {
                    if ("roleA_initiates" in relay_init) {
                        return OperationalBindingInitiator.ROLE_A;
                    }
                    else if ("roleB_initiates" in relay_init) {
                        return OperationalBindingInitiator.ROLE_B;
                    }
                    else {
                        return OperationalBindingInitiator.SYMMETRIC;
                    }
                })(),
                initiator_ber: (() => {
                    if ("roleA_initiates" in relay_init) {
                        return Buffer.from(relay_init.roleA_initiates.toBytes());
                    }
                    else if ("roleB_initiates" in relay_init) {
                        return Buffer.from(relay_init.roleB_initiates.toBytes());
                    }
                    else {
                        return Buffer.from(relay_init.symmetric.toBytes());
                    }
                })(),
                access_point: {
                    connect: {
                        id: access_point_id,
                    },
                },
                validity_start: validFrom,
                validity_end: validUntil,
                security_certification_path: sp?.certification_path
                    ? _encode_CertificationPath(sp.certification_path, DER).toBytes()
                    : undefined,
                security_name: sp?.name?.map((rdn) => rdnToJson(rdn)),
                security_time: sp?.time
                    ? getDateFromTime(sp.time)
                    : undefined,
                security_random: sp?.random
                    ? Buffer.from(packBits(sp.random))
                    : undefined,
                security_target: (sp?.target !== undefined)
                    ? Number(sp.target)
                    : undefined,
                security_operationCode: codeToString(sp?.operationCode),
                security_errorProtection: (sp?.errorProtection !== undefined)
                    ? Number(sp.errorProtection)
                    : undefined,
                security_errorCode: codeToString(sp?.errorCode),
                source_ip: assn.socket.remoteAddress,
                source_tcp_port: assn.socket.remotePort,
                source_credentials_type: 1,
                source_certificate_path: sp?.certification_path
                    ? _encode_CertificationPath(sp.certification_path, DER).toBytes()
                    : undefined,
                source_strong_name: ctx.dsa.accessPoint.ae_title.rdnSequence.map(rdnToJson),
                supply_contexts: null,
                requested_time: new Date(),
            };
            const new_ob = await ctx.db.operationalBinding.create({
                data: ob_db_data,
                select: {
                    id: true,
                    uuid: true,
                    binding_identifier: true,
                    responded_time: true,
                    requested_time: true,
                },
            });
            const ROLE_REVERSAL_ERROR = new errors.OperationalBindingError(
                ctx.i18n.t("err:other_dsa_reversed_ob_role", { uuid: new_ob.uuid }),
                new OpBindingErrorParam(
                    OpBindingErrorParam_problem_roleAssignment,
                    bindingType,
                    undefined,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        id_err_operationalBindingError,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    undefined,
                ),
            );
            const INVALID_INIT_SYNTAX_ERROR = new errors.OperationalBindingError(
                ctx.i18n.t("err:invalid_initiator", {
                    context: "other_dsa",
                    uuid: new_ob.uuid,
                }),
                new OpBindingErrorParam(
                    OpBindingErrorParam_problem_roleAssignment,
                    bindingType,
                    undefined,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        id_err_operationalBindingError,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    undefined,
                ),
            );
            const bindingID = data.bindingID;
            const revert_operational_binding = () => {
                terminateByTypeAndBindingID(
                    ctx,
                    assn,
                    relayTo,
                    bindingType,
                    bindingID,
                    false,
                    signErrors,
                )
                    .then(() => {
                        ctx.log.info(ctx.i18n.t("log:terminated_ob", {
                            context: "reversed",
                            uuid: new_ob.uuid,
                        }));
                    })
                    .catch((e) => {
                        ctx.telemetry.trackException({
                            exception: e,
                            properties: {
                                obUUID: new_ob.uuid,
                                obType: id_op_binding_hierarchical.toString(),
                                obid: bindingID.identifier,
                                obver: bindingID.version,
                                administratorEmail: ctx.config.administratorEmail,
                                invokeID: invokeId.toString(),
                            },
                            measurements: {
                                bytesRead: assn.socket.bytesRead,
                                bytesWritten: assn.socket.bytesWritten,
                            },
                        });
                        ctx.log.warn(ctx.i18n.t("log:failed_to_update_hob", {
                            obid: bindingID.identifier.toString(),
                            obver: bindingID.version.toString(),
                            e: e.message,
                        }), {
                            remoteFamily: assn.socket.remoteFamily,
                            remoteAddress: assn.socket.remoteAddress,
                            remotePort: assn.socket.remotePort,
                            association_id: assn.id,
                            invokeID: invokeId.toString(),
                        });
                    });
            };
            if (bindingType.isEqualTo(id_op_binding_hierarchical)) {
                if ("roleA_replies" in data.initiator) {
                    if (!("roleB_initiates" in initiator)) {
                        revert_operational_binding();
                        throw ROLE_REVERSAL_ERROR;
                    }
                    if (!cp) {
                        revert_operational_binding();
                        throw new errors.UnknownError("2b97303d-c535-4771-be8d-aa49f2bd5970");
                    }
                    const sup2sub = _decode_SuperiorToSubordinate(data.initiator.roleA_replies);
                    const agr = _decode_HierarchicalAgreement(agreement);
                    await becomeSubordinate(
                        ctx,
                        relayTo,
                        agr,
                        sup2sub,
                        cp.dse.structuralObjectClass ?? top["&id"],
                        cp.dse.governingStructureRule,
                        signErrors,
                    );
                }
                else if ("roleB_replies" in data.initiator) {
                    if (!("roleA_initiates" in initiator)) {
                        revert_operational_binding();
                        throw ROLE_REVERSAL_ERROR;
                    }
                    const sub2sup = _decode_SubordinateToSuperior(data.initiator.roleB_replies);
                    const agr = _decode_HierarchicalAgreement(agreement);
                    await becomeSuperior(
                        ctx,
                        assn,
                        { present: invokeId },
                        agr,
                        sub2sup,
                        signErrors,
                        bindingType,
                    );
                }
                else {
                    revert_operational_binding();
                    throw INVALID_INIT_SYNTAX_ERROR;
                }
            }
            else if (bindingType.isEqualTo(id_op_binding_non_specific_hierarchical)) {
                if ("roleA_replies" in data.initiator) {
                    if (!("roleB_initiates" in initiator)) {
                        revert_operational_binding();
                        throw ROLE_REVERSAL_ERROR;
                    }
                    const sup2sub = _decode_NHOBSuperiorToSubordinate(data.initiator.roleA_replies);
                    _decode_NonSpecificHierarchicalAgreement(agreement); // Just for validation.
                    await becomeNonSpecificSubordinate(
                        ctx,
                        relayTo,
                        sup2sub,
                        signErrors,
                    );
                }
                else if ("roleB_replies" in data.initiator) {
                    if (!("roleA_initiates" in initiator)) {
                        revert_operational_binding();
                        throw ROLE_REVERSAL_ERROR;
                    }
                    const sub2sup = _decode_NHOBSubordinateToSuperior(data.initiator.roleB_replies);
                    const agr = _decode_NonSpecificHierarchicalAgreement(agreement);
                    await becomeNonSpecificSuperior(
                        ctx,
                        assn,
                        agr,
                        sub2sup,
                        signErrors,
                        new_ob.binding_identifier,
                    );
                }
                else {
                    revert_operational_binding();
                    throw INVALID_INIT_SYNTAX_ERROR;
                }
            }
            else if (bindingType.isEqualTo(id_op_binding_shadow)) {
                const agr = _decode_ShadowingAgreementInfo(agreement);
                const master_ap_id = agr.master
                    ? await saveAccessPoint(ctx, agr.master, Knowledge.OB_SHADOW_MASTER)
                    : undefined;
                const updateMode = agr.updateMode ?? ShadowingAgreementInfo._default_value_for_updateMode;
                const schedule = ("supplierInitiated" in updateMode)
                    ? ("scheduled" in updateMode.supplierInitiated)
                        ? updateMode.supplierInitiated.scheduled
                        : undefined
                    : ("consumerInitiated" in updateMode)
                        ? updateMode.consumerInitiated
                        : undefined;
                await ctx.db.operationalBinding.update({
                    where: {
                        uuid: new_ob.uuid,
                    },
                    data: {
                        entry_id: cp?.dse.id,
                        shadowed_context_prefix: agr.shadowSubject.area.contextPrefix.map(rdnToJson),
                        knowledge_type: (agr.shadowSubject.knowledge === undefined)
                            ? undefined
                            : ({
                                Knowledge_knowledgeType_both: ShadowedKnowledgeType.BOTH,
                                Knowledge_knowledgeType_master: ShadowedKnowledgeType.MASTER,
                                Knowledge_knowledgeType_shadow: ShadowedKnowledgeType.SHADOW,
                            })[agr.shadowSubject.knowledge.knowledgeType],
                        subordinates: agr.shadowSubject.subordinates,
                        supply_contexts: (agr.shadowSubject.supplyContexts === undefined)
                            ? undefined
                            : (() => {
                                const sc = agr.shadowSubject.supplyContexts;
                                if ("allContexts" in sc) {
                                    return "";
                                } else if ("selectedContexts" in sc) {
                                    return sc.selectedContexts
                                        .map((s) => s.toString())
                                        .join(",");
                                }
                                return undefined;
                            })(),
                        supplier_initiated: agr.updateMode
                            ? ("supplierInitiated" in agr.updateMode)
                            : false,
                        periodic_beginTime: schedule?.periodic?.beginTime,
                        periodic_windowSize: schedule?.periodic?.windowSize
                            ? Number(schedule.periodic.windowSize)
                            : undefined,
                        periodic_updateInterval: schedule?.periodic?.updateInterval
                            ? Number(schedule.periodic.updateInterval)
                            : undefined,
                        othertimes: schedule?.othertimes,
                        master_access_point_id: master_ap_id as undefined, // TODO: This is giving me a weird type error.
                        secondary_shadows: agr.secondaryShadows,
                    },
                    select: {
                        id: true,
                    },
                });
                const ob_time: Date = new_ob.responded_time
                    ? new Date(Math.max(new_ob.requested_time.valueOf(), new_ob.responded_time.valueOf()))
                    : new_ob.requested_time;

                if ("roleA_initiates" in initiator) {
                    await becomeShadowSupplier(ctx, bindingID, cp!, relayTo, agr, new_ob.id, ob_time);
                } else {
                    await becomeShadowConsumer(
                        ctx,
                        agr,
                        data.accessPoint,
                        bindingID,
                        new_ob.id,
                        ob_time,
                    );
                }
            }
            else {
                revert_operational_binding();
                new errors.OperationalBindingError(
                    ctx.i18n.t("err:ob_type_unrecognized", { obtype: bindingType.toString() }),
                    new OpBindingErrorParam(
                        OpBindingErrorParam_problem_unsupportedBindingType,
                        bindingType,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_err_operationalBindingError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                    ),
                );
            }
            const now = new Date();
            const possibly_related_sobs = await ctx.db.operationalBinding.findMany({
                where: {
                    /**
                     * This is a hack for getting the latest version: we are selecting
                     * operational bindings that have no next version.
                     */
                    next_version: {
                        none: {},
                    },
                    binding_type: id_op_binding_shadow.toString(),
                    entry_id: {
                        in: (() => {
                            const dse_ids: number[] = [];
                            let current: Vertex | undefined = ob_entry;
                            while (current) {
                                dse_ids.push(current.dse.id);
                                current = current.immediateSuperior;
                            }
                            return dse_ids;
                        })(),
                    },
                    accepted: true,
                    terminated_time: null,
                    validity_start: {
                        lte: now,
                    },
                    AND: [
                        {
                            OR: [
                                {
                                    validity_end: null,
                                },
                                {
                                    validity_end: {
                                        gte: now,
                                    },
                                },
                            ],
                        },
                        {
                            OR: [ // This DSA is the supplier if one of these conditions are true.
                                { // This DSA initiated an OB in which it is the supplier.
                                    initiator: OperationalBindingInitiator.ROLE_A,
                                    outbound: true,
                                },
                                { // This DSA accepted an OB from a consumer.
                                    initiator: OperationalBindingInitiator.ROLE_B,
                                    outbound: false,
                                },
                            ],
                        },
                    ],
                },
                select: {
                    id: true,
                    binding_identifier: true,
                    agreement_ber: true,
                },
            });
            // TODO: Cascade the incremental updates to secondary shadows instead of performing a total refresh.
            await Promise.all(possibly_related_sobs.map((sob) => updateShadowConsumer(ctx, sob.id, true)));
            return result;
        }
        else if ("error" in outcome) {
            throw new errors.ChainedError(
                ctx.i18n.t("err:chained_error"),
                outcome.error.parameter,
                outcome.error.code,
                signErrors,
            );
        }
        else if ("reject" in outcome) {
            throw new errors.ChainedReject(
                invokeId,
                outcome.reject.problem,
            );
        }
        else if ("abort" in outcome) {
            throw new errors.ChainedAbort(outcome.abort);
        }
        else if ("timeout" in outcome) {
            err_message = ctx.i18n.t("err:relayed_dop_timeout");
        }
        else {
            err_message = ctx.i18n.t("err:relayed_dop_other_error");
        }
        throw new errors.OperationalBindingError(
            err_message,
            new OpBindingErrorParam(
                OpBindingErrorParam_problem_currentlyNotDecidable,
                bindingType,
                undefined,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    id_err_operationalBindingError,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
            signErrors,
        );
    } finally {
        // We update the cached naming contexts, which might have changed.
        cacheNamingContexts(ctx);
        dop.unbind({ disconnectSocket: true })
            .catch((e) => ctx.log.warn(ctx.i18n.t("log:dop_unbind_error", { e })));
    }
}

/**
 * @summary Establishes an operational binding, as described in ITU Recommendation X.501.
 * @description
 *
 * This function implements the `establishOperationalBinding` operation
 * described in ITU Recommendation X.501 (2016), Section 28.2.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param invokeId The InvokeId of the operation
 * @param arg The `EstablishOperationalBindingArgument` argument
 * @returns The `EstablishOperationalBindingResult` result
 *
 * @function
 * @async
 */
export
async function establishOperationalBinding (
    ctx: MeerkatContext,
    assn: DOPAssociation,
    invokeId: INTEGER,
    arg: EstablishOperationalBindingArgument,
): Promise<EstablishOperationalBindingResult> {
    const NAMING_MATCHER = getNamingMatcherGetter(ctx);
    const data: EstablishOperationalBindingArgumentData = getOptionallyProtectedValue(arg);
    // DOP associations are ALWAYS authorized to receive signed responses.
    const signResult: boolean = (data.securityParameters?.target === ProtectionRequest_signed);
    const signErrors: boolean = (data.securityParameters?.errorProtection === ErrorProtectionRequest_signed);
    if (data.valid?.validFrom instanceof ASN1Element) {
        throw new errors.OperationalBindingError(
            ctx.i18n.t("err:unrecognized_ob_start_time_syntax"),
            new OpBindingErrorParam(
                OpBindingErrorParam_problem_invalidStartTime,
                data.bindingType,
                undefined,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    id_err_operationalBindingError,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
            signErrors,
        );
    }
    if (data.valid?.validUntil instanceof ASN1Element) {
        throw new errors.OperationalBindingError(
            ctx.i18n.t("err:unrecognized_ob_end_time_syntax"),
            new OpBindingErrorParam(
                OpBindingErrorParam_problem_invalidEndTime,
                data.bindingType,
                undefined,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    id_err_operationalBindingError,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
            signErrors,
        );
    }

    const now = new Date();
    const validFrom = (data.valid?.validFrom && ("time" in data.valid.validFrom))
        ? getDateFromOBTime(data.valid.validFrom.time)
        : now;
    const validUntil = (data.valid?.validUntil && ("time" in data.valid.validUntil))
        ? getDateFromOBTime(data.valid.validUntil.time)
        : undefined;

    if (validUntil && (validUntil < validFrom)) {
        throw new errors.OperationalBindingError(
            ctx.i18n.t("err:validity_end_before_start"),
            new OpBindingErrorParam(
                OpBindingErrorParam_problem_invalidEndTime,
                data.bindingType,
                undefined,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    id_err_operationalBindingError,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
            signErrors,
        );
    }

    const relayToElement = data._unrecognizedExtensionsList.find((ext) => (
        (ext.tagClass === ASN1TagClass.private)
        && (ext.tagNumber === 0)
        && (ext.construction === ASN1Construction.constructed)
    ))?.inner;
    if (relayToElement) {
        const user_cert = data.securityParameters?.certification_path?.userCertificate;
        const dsa_cert = [ ...ctx.config.signing.certPath ?? [] ].pop();
        const user_sig = packBits(user_cert?.signature ?? new Uint8ClampedArray());
        const dsa_sig = packBits(dsa_cert?.signature ?? new Uint8ClampedArray());
        /* We check if the request was signed with the exact same certificate
        that the DSA is using for signatures. If they match, the user is
        authorized on behalf of the DSA itself to establish a new operational
        binding. We do not need to check the signatures or certification path
        here, because it was already done before this function was invoked. */
        if (
            !("signed" in arg)
            || !user_cert
            || !dsa_cert
            || (user_cert.toBeSigned.serialNumber.toString() !== dsa_cert.toBeSigned.serialNumber.toString())
            || (user_sig.length !== dsa_sig.length)
            || !timingSafeEqual(user_sig, dsa_sig)
        ) {
            throw new errors.SecurityError(
                ctx.i18n.t("err:must_have_dsa_keys_for_relayed_dop"),
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
                        id_err_operationalBindingError,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    undefined,
                    undefined,
                ),
                signErrors,
            );
        }
        const relayToAccessPoint = _decode_AccessPoint(relayToElement);
        return relayedEstablishOperationalBinding(
            ctx,
            assn,
            invokeId,
            data.bindingType,
            data.agreement,
            data.initiator,
            validFrom,
            validUntil,
            relayToAccessPoint,
            signErrors,
        );
    }

    const sp = data.securityParameters;
    let newBindingIdentifier!: number;
    if (
        typeof data.bindingID?.identifier === "number"
        || (typeof data.bindingID?.identifier === "bigint")
    ) {
        const now = new Date();
        const alreadyTakenBindingID = await ctx.db.operationalBinding.findFirst({
            where: {
                /**
                 * This is a hack for getting the latest version: we are selecting
                 * operational bindings that have no next version.
                 */
                next_version: {
                    none: {},
                },
                binding_type: id_op_binding_hierarchical.toString(),
                binding_identifier: Number(data.bindingID.identifier),
                accepted: true,
                terminated_time: null,
                validity_start: {
                    lte: now,
                },
                OR: [
                    {
                        validity_end: null,
                    },
                    {
                        validity_end: {
                            gte: now,
                        },
                    },
                ],
            },
            select: {
                uuid: true,
            },
        });
        if (alreadyTakenBindingID) {
            throw new errors.OperationalBindingError(
                ctx.i18n.t("err:ob_duplicate_identifier", {
                    id: data.bindingID.identifier,
                }),
                new OpBindingErrorParam(
                    OpBindingErrorParam_problem_duplicateID,
                    id_op_binding_hierarchical,
                    undefined,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        id_err_operationalBindingError,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    false,
                    undefined,
                ),
                signErrors,
            );
        } else {
            newBindingIdentifier = Number(data.bindingID.identifier);
        }
    } else if (typeof data.bindingID?.identifier === "undefined") {
        newBindingIdentifier = randomInt(2147483648);
        // TODO: Loop until you find an available ID.
    }

    const bindingID = new OperationalBindingID(
        newBindingIdentifier,
        0,
    );
    const logInfo = {
        remoteFamily: assn.socket.remoteFamily,
        remoteAddress: assn.socket.remoteAddress,
        remotePort: assn.socket.remotePort,
        association_id: assn.id,
        invokeID: printInvokeId({ present: invokeId }),
        binding_id: bindingID.identifier.toString(),
    };
    ctx.log.info(ctx.i18n.t("log:establishOperationalBinding", {
        context: "started",
        type: data.bindingType.toString(),
        bid: bindingID.identifier.toString(),
        aid: assn.id,
    }), logInfo);
    /**
     * @summary Wait for approval of a proposed operational binding
     * @description
     *
     * This function waits for the manual or automated approval of a proposed
     * operational binding. It also times out if no decision is made within a
     * defined time limit.
     *
     * @param uuid The UUID of the operation binding whose approval is sought.
     * @returns A promise resolving a boolean indicating whether the operational
     *  binding was accepted or rejected, or `undefined` if the decision timed
     *  out.
     *
     * @function
     */
    const getApproval = (uuid: string): Promise<boolean | undefined> => {
        const logInfo = {
            type: data.bindingType.toString(),
            obid: bindingID.identifier.toString(),
            uuid,
        };
        if (isAutoApproved(
            ctx.config.ob.autoAccept,
            sp?.certification_path,
            ctx.config.signing.certPath,
            NAMING_MATCHER,
        )) {
            ctx.log.info(ctx.i18n.t("log:auto_accepted_ob", {
                type: data.bindingType.toString(),
                obid: bindingID.identifier.toString(),
                uuid,
            }), logInfo);
            return Promise.resolve(true);
        }
        ctx.log.warn(ctx.i18n.t("log:awaiting_ob_approval", { uuid }));
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                ctx.log.warn(ctx.i18n.t("log:ob_proposal_timed_out", { uuid }), logInfo);
                resolve(undefined);
            }, 300_000);
            new Promise<boolean>((resolve2) => {
                ctx.operationalBindingControlEvents.once(uuid, (approved: boolean) => {
                    resolve2(approved);
                });
            }).then(resolve, reject);
        });
    };

    const access_point_id = await saveAccessPoint(ctx, data.accessPoint, Knowledge.OB_REQUEST);

    const ob_db_data = {
        outbound: false,
        binding_type: data.bindingType.toString(),
        binding_identifier: Number(bindingID.identifier),
        binding_version: Number(bindingID.version),
        initiator: (() => {
            if ("roleA_initiates" in data.initiator) {
                return OperationalBindingInitiator.ROLE_A;
            }
            if ("roleB_initiates" in data.initiator) {
                return OperationalBindingInitiator.ROLE_B;
            }
            return OperationalBindingInitiator.SYMMETRIC;
        })(),
        initiator_ber: (() => {
            if ("roleA_initiates" in data.initiator) {
                return Buffer.from(data.initiator.roleA_initiates.toBytes());
            }
            if ("roleB_initiates" in data.initiator) {
                return Buffer.from(data.initiator.roleB_initiates.toBytes());
            }
            return Buffer.from(data.initiator.symmetric.toBytes());
        })(),
        agreement_ber: data.agreement.toBytes(),
        access_point: {
            connect: {
                id: access_point_id,
            },
        },
        validity_start: validFrom,
        validity_end: validUntil,
        security_certification_path: sp?.certification_path
            ? _encode_CertificationPath(sp.certification_path, DER).toBytes()
            : undefined,
        security_name: sp?.name?.map((rdn) => rdnToJson(rdn)),
        security_time: sp?.time
            ? getDateFromTime(sp.time)
            : undefined,
        security_random: sp?.random
            ? Buffer.from(packBits(sp.random))
            : undefined,
        security_target: (sp?.target !== undefined)
            ? Number(sp.target)
            : undefined,
        security_operationCode: codeToString(sp?.operationCode),
        security_errorProtection: (sp?.errorProtection !== undefined)
            ? Number(sp.errorProtection)
            : undefined,
        security_errorCode: codeToString(sp?.errorCode),
        source_ip: assn.socket.remoteAddress,
        source_tcp_port: assn.socket.remotePort,
        source_credentials_type: ((): number | null => {
            if (!assn.bind) {
                return null;
            }
            if (!assn.bind.credentials) {
                return null;
            }
            if ("simple" in assn.bind.credentials) {
                return 0;
            }
            if ("strong" in assn.bind.credentials) {
                return 1;
            }
            if ("external" in assn.bind.credentials) {
                return 2;
            }
            if ("spkm" in assn.bind.credentials) {
                return 3;
            }
            return 4;
        })(),
        source_certificate_path: (
            assn.bind?.credentials
            && ("strong" in assn.bind.credentials)
            && assn.bind.credentials.strong.certification_path
        )
            ? _encode_CertificationPath(assn.bind.credentials.strong.certification_path, DER).toBytes()
            : undefined,
        source_attr_cert_path: (
            assn.bind?.credentials
            && ("strong" in assn.bind.credentials)
            && assn.bind.credentials.strong.attributeCertificationPath
        )
            ? _encode_ACP(assn.bind.credentials.strong.attributeCertificationPath, DER).toBytes()
            : undefined,
        source_bind_token: (
            assn.bind?.credentials
            && ("strong" in assn.bind.credentials)
        )
            ? _encode_Token(assn.bind.credentials.strong.bind_token, DER).toBytes()
            : undefined,
        source_strong_name: (
            assn.bind?.credentials
            && ("strong" in assn.bind.credentials)
            && assn.bind.credentials.strong.name
        )
            ? assn.bind.credentials.strong.name.map(rdnToJson)
            : undefined,
        supply_contexts: null,
        requested_time: new Date(),
    };
    if (data.bindingType.isEqualTo(id_op_binding_hierarchical)) {
        const agreement: HierarchicalAgreement = _decode_HierarchicalAgreement(data.agreement);
        if ("roleA_initiates" in data.initiator) {
            const init: SuperiorToSubordinate = _decode_SuperiorToSubordinate(data.initiator.roleA_initiates);
            const last_vertex = init.contextPrefixInfo[init.contextPrefixInfo.length - 1];
            for (const ap of last_vertex?.accessPoints ?? []) {
                if (compareDistinguishedName(
                    ap.ae_title.rdnSequence,
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    NAMING_MATCHER,
                )) {
                    throw new errors.OperationalBindingError(
                        ctx.i18n.t("err:cannot_establish_ob_with_self"),
                        new OpBindingErrorParam(
                            OpBindingErrorParam_problem_roleAssignment,
                            data.bindingType,
                            undefined,
                            undefined,
                            [],
                            createSecurityParameters(
                                ctx,
                                signErrors,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                id_err_operationalBindingError,
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            undefined,
                            undefined,
                        ),
                        signErrors,
                    );
                }
            }
            if (!init.entryInfo?.length) {
                /**
                 * Technically, a HOB allows the subordinate DSA to establish
                 * at creation time what the new context prefix DSE will be
                 * entirely. This makes logical sense, since the subordinate DSA
                 * "owns" this entry. However, it is not a good idea to do this
                 * because the subordinate DSA basically has no information as
                 * to what is to be created! So Meerkat DSA will simply reject
                 * all "blank checks" received to create a new context prefix.
                 */
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:superior_must_specify_entryInfo"),
                    new OpBindingErrorParam(
                        OpBindingErrorParam_problem_parametersMissing,
                        data.bindingType,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_err_operationalBindingError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                    signErrors,
                );
            }
            const cp_info_dn = init.contextPrefixInfo.map((rdn) => rdn.rdn);
            if (!compareDistinguishedName(
                agreement.immediateSuperior,
                cp_info_dn,
                NAMING_MATCHER,
            )) {
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:hob_contextprefixinfo_did_not_match", {
                        agreement_dn: stringifyDN(ctx, agreement.immediateSuperior),
                        cp_info_dn: stringifyDN(ctx, cp_info_dn),
                    }),
                    new OpBindingErrorParam(
                        OpBindingErrorParam_problem_invalidAgreement,
                        data.bindingType,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_err_operationalBindingError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                    signErrors,
                );
            }

            const subentriesCache: Map<number, Vertex[]> = new Map();
            let structuralObjectClass!: ValidateEntryReturn["structuralObjectClass"];
            let governingStructureRule: ValidateEntryReturn["governingStructureRule"] | undefined;
            try {
                const {
                    structuralObjectClass: soc,
                    governingStructureRule: gsr,
                } = await validateEntry(
                    ctx,
                    assn,
                    undefined,
                    [ ...agreement.immediateSuperior, agreement.rdn ],
                    agreement.rdn,
                    init.entryInfo,
                    FALSE,
                    FALSE,
                    {
                        present: invokeId,
                    },
                    subentriesCache,
                    false,
                    signErrors,
                );
                structuralObjectClass = soc;
                governingStructureRule = gsr;
            } catch (e) {
                ctx.log.warn(ctx.i18n.t("log:hob_invalid_entryInfo", { e }), logInfo);
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:hob_invalid_entryInfo", { e }),
                    new OpBindingErrorParam(
                        OpBindingErrorParam_problem_invalidAgreement,
                        data.bindingType,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_err_operationalBindingError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                    signErrors,
                );
            }

            const created = await ctx.db.operationalBinding.create({
                data: {
                    ...ob_db_data,
                    new_context_prefix_rdn: rdnToJson(agreement.rdn),
                    immediate_superior: agreement.immediateSuperior.map(rdnToJson),
                },
                select: {
                    uuid: true,
                },
            });
            const approved: boolean | undefined = await getApproval(created.uuid);
            await ctx.db.operationalBinding.update({
                where: {
                    uuid: created.uuid,
                },
                data: {
                    accepted: approved ?? null,
                },
                select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
            });
            if (approved === undefined) {
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:ob_rejected", {
                        context: "timeout",
                        uuid: created.uuid,
                    }),
                    new OpBindingErrorParam(
                        OpBindingErrorParam_problem_currentlyNotDecidable,
                        data.bindingType,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_err_operationalBindingError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                    signErrors,
                );
            } else if (approved === false) {
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:ob_rejected", {
                        uuid: created.uuid,
                    }),
                    new OpBindingErrorParam(
                        OpBindingErrorParam_problem_invalidAgreement,
                        data.bindingType,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_err_operationalBindingError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                    signErrors,
                );
            }
            try {
                const reply = await becomeSubordinate(
                    ctx,
                    data.accessPoint,
                    agreement,
                    init,
                    structuralObjectClass,
                    governingStructureRule,
                    signErrors,
                );
                ctx.log.info(ctx.i18n.t("log:establishOperationalBinding", {
                    context: "succeeded",
                    type: data.bindingType.toString(),
                    bid: bindingID.identifier.toString(),
                    aid: assn.id,
                }), {
                    remoteFamily: assn.socket.remoteFamily,
                    remoteAddress: assn.socket.remoteAddress,
                    remotePort: assn.socket.remotePort,
                    association_id: assn.id,
                    invokeID: printInvokeId({ present: invokeId }),
                });
                const resultData = new EstablishOperationalBindingResultData(
                    data.bindingType,
                    bindingID,
                    ctx.dsa.accessPoint,
                    {
                        roleB_replies: _encode_SubordinateToSuperior(reply, DER),
                    },
                    [],
                    createSecurityParameters(
                        ctx,
                        signResult,
                        assn.boundNameAndUID?.dn,
                        id_op_establishOperationalBinding,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    undefined,
                    undefined,
                );
                if (!signResult) {
                    return {
                        unsigned: resultData,
                    };
                }
                const resultDataBytes = _encode_EstablishOperationalBindingResultData(resultData, DER).toBytes();
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
            } catch (e) {
                ctx.log.error(ctx.i18n.t("log:err_establishing_ob", {
                    uuid: created.uuid,
                    e,
                }));
                if (e instanceof errors.OperationalBindingError) {
                    ctx.db.operationalBinding.update({
                        where: {
                            uuid: created.uuid,
                        },
                        data: {
                            accepted: false,
                            last_ob_problem: e.data.problem,
                        },
                        select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
                    })
                        .then()
                        .catch((e) => ctx.log.error(ctx.i18n.t("log:failed_to_cancel_ob", { e }), {
                            ...logInfo,
                            ...((typeof e === "object" && e) ? e : {}),
                        }));
                } else {
                    ctx.db.operationalBinding.update({
                        where: {
                            uuid: created.uuid,
                        },
                        data: {
                            accepted: false,
                        },
                        select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
                    })
                        .then()
                        .catch((e) => ctx.log.error(ctx.i18n.t("log:failed_to_cancel_ob", { e }), {
                            ...logInfo,
                            ...((typeof e === "object" && e) ? e : {}),
                        }));
                }
                throw e;
            }
        } else if ("roleB_initiates" in data.initiator) {
            const init: SubordinateToSuperior = _decode_SubordinateToSuperior(data.initiator.roleB_initiates);
            for (const ap of init.accessPoints ?? []) {
                if (compareDistinguishedName(
                    ap.ae_title.rdnSequence,
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    NAMING_MATCHER,
                )) {
                    throw new errors.OperationalBindingError(
                        ctx.i18n.t("err:cannot_establish_ob_with_self"),
                        new OpBindingErrorParam(
                            OpBindingErrorParam_problem_roleAssignment,
                            data.bindingType,
                            undefined,
                            undefined,
                            [],
                            createSecurityParameters(
                                ctx,
                                signErrors,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                id_err_operationalBindingError,
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            undefined,
                            undefined,
                        ),
                        signErrors,
                    );
                }
            }
            const created = await ctx.db.operationalBinding.create({
                data: {
                    ...ob_db_data,
                    new_context_prefix_rdn: rdnToJson(agreement.rdn),
                    immediate_superior: agreement.immediateSuperior.map(rdnToJson),
                },
                select: {
                    uuid: true,
                },
            });
            const approved: boolean | undefined = await getApproval(created.uuid);
            await ctx.db.operationalBinding.update({
                where: {
                    uuid: created.uuid,
                },
                data: {
                    accepted: approved ?? null,
                },
                select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
            });
            if (approved === undefined) {
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:ob_rejected", {
                        context: "timeout",
                        uuid: created.uuid,
                    }),
                    new OpBindingErrorParam(
                        OpBindingErrorParam_problem_currentlyNotDecidable,
                        data.bindingType,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_err_operationalBindingError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                    signErrors,
                );
            } else if (approved === false) {
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:ob_rejected", {
                        uuid: created.uuid,
                    }),
                    new OpBindingErrorParam(
                        OpBindingErrorParam_problem_invalidAgreement,
                        data.bindingType,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_err_operationalBindingError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                    signErrors,
                );
            }
            try {
                const reply = await becomeSuperior(
                    ctx,
                    assn,
                    { present: invokeId },
                    agreement,
                    init,
                    signErrors,
                    data.bindingType,
                );
                ctx.log.info(ctx.i18n.t("log:establishOperationalBinding", {
                    context: "succeeded",
                    type: data.bindingType.toString(),
                    bid: bindingID.identifier.toString(),
                    aid: assn.id,
                }), {
                    remoteFamily: assn.socket.remoteFamily,
                    remoteAddress: assn.socket.remoteAddress,
                    remotePort: assn.socket.remotePort,
                    association_id: assn.id,
                    invokeID: printInvokeId({ present: invokeId }),
                });
                const resultData = new EstablishOperationalBindingResultData(
                    data.bindingType,
                    bindingID,
                    ctx.dsa.accessPoint,
                    {
                        roleB_replies: _encode_SuperiorToSubordinate(reply, DER),
                    },
                    [],
                    createSecurityParameters(
                        ctx,
                        signResult,
                        assn.boundNameAndUID?.dn,
                        id_op_establishOperationalBinding,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    undefined,
                    undefined,
                );
                if (!signResult) {
                    return {
                        unsigned: resultData,
                    };
                }
                const resultDataBytes = _encode_EstablishOperationalBindingResultData(resultData, DER).toBytes();
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
            } catch (e) {
                ctx.log.error(ctx.i18n.t("log:err_establishing_ob", {
                    uuid: created.uuid,
                    e,
                }));
                if (e instanceof errors.OperationalBindingError) {
                    ctx.db.operationalBinding.update({
                        where: {
                            uuid: created.uuid,
                        },
                        data: {
                            accepted: false,
                            last_ob_problem: e.data.problem,
                        },
                        select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
                    })
                        .then()
                        .catch((e) => ctx.log.error(ctx.i18n.t("log:failed_to_cancel_ob", { e }), {
                            ...logInfo,
                            ...((typeof e === "object" && e) ? e : {}),
                        }));
                } else {
                    ctx.db.operationalBinding.update({
                        where: {
                            uuid: created.uuid,
                        },
                        data: {
                            accepted: false,
                        },
                        select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
                    })
                        .then()
                        .catch((e) => ctx.log.error(ctx.i18n.t("log:failed_to_cancel_ob", { e }), {
                            ...logInfo,
                            ...((typeof e === "object" && e) ? e : {}),
                        }));
                }
                throw e;
            }
        } else {
            throw new errors.MistypedArgumentError(ctx.i18n.t("err:unrecognized_ob_initiator_syntax"));
        }
    } else if (data.bindingType.isEqualTo(id_op_binding_non_specific_hierarchical)) {
        const agreement = _decode_NonSpecificHierarchicalAgreement(data.agreement);
        if ("roleA_initiates" in data.initiator) {
            const init = _decode_NHOBSuperiorToSubordinate(data.initiator.roleA_initiates);
            const last_vertex = init.contextPrefixInfo[init.contextPrefixInfo.length - 1];
            for (const ap of last_vertex?.accessPoints ?? []) {
                if (compareDistinguishedName(
                    ap.ae_title.rdnSequence,
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    NAMING_MATCHER,
                )) {
                    throw new errors.OperationalBindingError(
                        ctx.i18n.t("err:cannot_establish_ob_with_self"),
                        new OpBindingErrorParam(
                            OpBindingErrorParam_problem_roleAssignment,
                            data.bindingType,
                            undefined,
                            undefined,
                            [],
                            createSecurityParameters(
                                ctx,
                                signErrors,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                id_err_operationalBindingError,
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            undefined,
                            undefined,
                        ),
                        signErrors,
                    );
                }
            }
            const cp_info_dn: DistinguishedName = init.contextPrefixInfo.map((rdn) => rdn.rdn);
            if (!compareDistinguishedName(
                agreement.immediateSuperior,
                cp_info_dn,
                NAMING_MATCHER,
            )) {
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:hob_contextprefixinfo_did_not_match", {
                        agreement_dn: stringifyDN(ctx, agreement.immediateSuperior),
                        cp_info_dn: stringifyDN(ctx, cp_info_dn),
                    }),
                    new OpBindingErrorParam(
                        OpBindingErrorParam_problem_invalidAgreement,
                        data.bindingType,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_err_operationalBindingError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                    signErrors,
                );
            }
            const created = await ctx.db.operationalBinding.create({
                data: {
                    ...ob_db_data,
                    immediate_superior: agreement.immediateSuperior.map(rdnToJson),
                },
                select: {
                    uuid: true,
                },
            });
            const approved: boolean | undefined = await getApproval(created.uuid);
            await ctx.db.operationalBinding.update({
                where: {
                    uuid: created.uuid,
                },
                data: {
                    accepted: approved ?? null,
                },
                select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
            });
            if (approved === undefined) {
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:ob_rejected", {
                        context: "timeout",
                        uuid: created.uuid,
                    }),
                    new OpBindingErrorParam(
                        OpBindingErrorParam_problem_currentlyNotDecidable,
                        data.bindingType,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_err_operationalBindingError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                    signErrors,
                );
            } else if (approved === false) {
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:ob_rejected", {
                        uuid: created.uuid,
                    }),
                    new OpBindingErrorParam(
                        OpBindingErrorParam_problem_invalidAgreement,
                        data.bindingType,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_err_operationalBindingError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                    signErrors,
                );
            }
            try {
                const reply = await becomeNonSpecificSubordinate(
                    ctx,
                    data.accessPoint,
                    init,
                    signErrors,
                );
                ctx.log.info(ctx.i18n.t("log:establishOperationalBinding", {
                    context: "succeeded",
                    type: data.bindingType.toString(),
                    bid: bindingID.identifier.toString(),
                    aid: assn.id,
                }), {
                    remoteFamily: assn.socket.remoteFamily,
                    remoteAddress: assn.socket.remoteAddress,
                    remotePort: assn.socket.remotePort,
                    association_id: assn.id,
                    invokeID: printInvokeId({ present: invokeId }),
                });
                const resultData = new EstablishOperationalBindingResultData(
                    data.bindingType,
                    bindingID,
                    ctx.dsa.accessPoint,
                    {
                        roleB_replies: _encode_NHOBSubordinateToSuperior(reply, DER),
                    },
                    [],
                    createSecurityParameters(
                        ctx,
                        signResult,
                        assn.boundNameAndUID?.dn,
                        id_op_establishOperationalBinding,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    undefined,
                    undefined,
                );
                if (!signResult) {
                    return {
                        unsigned: resultData,
                    };
                }
                const resultDataBytes = _encode_EstablishOperationalBindingResultData(resultData, DER).toBytes();
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
            } catch (e) {
                ctx.log.error(ctx.i18n.t("log:err_establishing_ob", {
                    uuid: created.uuid,
                    e,
                }));
                // TODO: These error handling sections are all duplicated. You could deduplicate them.
                if (e instanceof errors.OperationalBindingError) {
                    ctx.db.operationalBinding.update({
                        where: {
                            uuid: created.uuid,
                        },
                        data: {
                            accepted: false,
                            last_ob_problem: e.data.problem,
                        },
                        select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
                    })
                        .then()
                        .catch((e) => ctx.log.error(ctx.i18n.t("log:failed_to_cancel_ob", { e }), {
                            ...logInfo,
                            ...((typeof e === "object" && e) ? e : {}),
                        }));
                } else {
                    ctx.db.operationalBinding.update({
                        where: {
                            uuid: created.uuid,
                        },
                        data: {
                            accepted: false,
                        },
                        select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
                    })
                        .then()
                        .catch((e) => ctx.log.error(ctx.i18n.t("log:failed_to_cancel_ob", { e }), {
                            ...logInfo,
                            ...((typeof e === "object" && e) ? e : {}),
                        }));
                }
                throw e;
            }
        }
        else if ("roleB_initiates" in data.initiator) {
            const init = _decode_NHOBSubordinateToSuperior(data.initiator.roleB_initiates);
            for (const ap of init.accessPoints ?? []) {
                if (compareDistinguishedName(
                    ap.ae_title.rdnSequence,
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    NAMING_MATCHER,
                )) {
                    throw new errors.OperationalBindingError(
                        ctx.i18n.t("err:cannot_establish_ob_with_self"),
                        new OpBindingErrorParam(
                            OpBindingErrorParam_problem_roleAssignment,
                            data.bindingType,
                            undefined,
                            undefined,
                            [],
                            createSecurityParameters(
                                ctx,
                                signErrors,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                id_err_operationalBindingError,
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            undefined,
                            undefined,
                        ),
                        signErrors,
                    );
                }
            }
            const created = await ctx.db.operationalBinding.create({
                data: {
                    ...ob_db_data,
                    immediate_superior: agreement.immediateSuperior.map(rdnToJson),
                },
                select: {
                    id: true,
                    uuid: true,
                    binding_identifier: true,
                },
            });
            const approved: boolean | undefined = await getApproval(created.uuid);
            await ctx.db.operationalBinding.update({
                where: {
                    uuid: created.uuid,
                },
                data: {
                    accepted: approved ?? null,
                },
                select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
            });
            if (approved === undefined) {
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:ob_rejected", {
                        context: "timeout",
                        uuid: created.uuid,
                    }),
                    new OpBindingErrorParam(
                        OpBindingErrorParam_problem_currentlyNotDecidable,
                        data.bindingType,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_err_operationalBindingError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                    signErrors,
                );
            } else if (approved === false) {
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:ob_rejected", {
                        uuid: created.uuid,
                    }),
                    new OpBindingErrorParam(
                        OpBindingErrorParam_problem_invalidAgreement,
                        data.bindingType,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_err_operationalBindingError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                    signErrors,
                );
            }
            try {
                const reply = await becomeNonSpecificSuperior(
                    ctx,
                    assn,
                    agreement,
                    init,
                    signErrors,
                    created.binding_identifier,
                );
                ctx.log.info(ctx.i18n.t("log:establishOperationalBinding", {
                    context: "succeeded",
                    type: data.bindingType.toString(),
                    bid: bindingID.identifier.toString(),
                    aid: assn.id,
                }), {
                    remoteFamily: assn.socket.remoteFamily,
                    remoteAddress: assn.socket.remoteAddress,
                    remotePort: assn.socket.remotePort,
                    association_id: assn.id,
                    invokeID: printInvokeId({ present: invokeId }),
                });
                const resultData = new EstablishOperationalBindingResultData(
                    data.bindingType,
                    bindingID,
                    ctx.dsa.accessPoint,
                    {
                        roleA_replies: _encode_NHOBSuperiorToSubordinate(reply, DER),
                    },
                    [],
                    createSecurityParameters(
                        ctx,
                        signResult,
                        assn.boundNameAndUID?.dn,
                        id_op_establishOperationalBinding,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    undefined,
                    undefined,
                );
                if (!signResult) {
                    return {
                        unsigned: resultData,
                    };
                }
                const resultDataBytes = _encode_EstablishOperationalBindingResultData(resultData, DER).toBytes();
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
            } catch (e) {
                ctx.log.error(ctx.i18n.t("log:err_establishing_ob", {
                    uuid: created.uuid,
                    e,
                }));
                if (e instanceof errors.OperationalBindingError) {
                    ctx.db.operationalBinding.update({
                        where: {
                            uuid: created.uuid,
                        },
                        data: {
                            accepted: false,
                            last_ob_problem: e.data.problem,
                        },
                        select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
                    })
                        .then()
                        .catch((e) => ctx.log.error(ctx.i18n.t("log:failed_to_cancel_ob", { e }), {
                            ...logInfo,
                            ...((typeof e === "object" && e) ? e : {}),
                        }));
                } else {
                    ctx.db.operationalBinding.update({
                        where: {
                            uuid: created.uuid,
                        },
                        data: {
                            accepted: false,
                        },
                        select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
                    })
                        .then()
                        .catch((e) => ctx.log.error(ctx.i18n.t("log:failed_to_cancel_ob", { e }), {
                            ...logInfo,
                            ...((typeof e === "object" && e) ? e : {}),
                        }));
                }
                throw e;
            }
        }
        else {
            throw new errors.MistypedArgumentError(ctx.i18n.t("err:unrecognized_ob_initiator_syntax"));
        }
    } else if (data.bindingType.isEqualTo(id_op_binding_shadow)) {
        const agreement = _decode_ShadowingAgreementInfo(data.agreement);
        if (agreement.shadowSubject.area.replicationArea.minimum) {
            throw new errors.OperationalBindingError(
                ctx.i18n.t("err:min_not_allowed_in_shadow_agreement"),
                new OpBindingErrorParam(
                    OpBindingErrorParam_problem_invalidAgreement,
                    data.bindingType,
                    undefined,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        id_err_operationalBindingError,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    undefined,
                    undefined,
                ),
                signErrors,
            );
        }
        for (const class_attr of agreement.shadowSubject.attributes) {
            if (!class_attr.classAttributes) {
                continue;
            }
            if ("include" in class_attr.classAttributes) {
                const include = class_attr.classAttributes.include;
                for (const attr of include) {
                    const ATTR_TYPE = attr.toString();
                    const usage = ctx.attributeTypes.get(ATTR_TYPE)?.usage;
                    if (usage === AttributeUsage_dSAOperation) {
                        throw new errors.OperationalBindingError(
                            ctx.i18n.t("err:not_authz_replicate_dsa_operation_attr_type", {
                                oid: ATTR_TYPE,
                            }),
                            new OpBindingErrorParam(
                                OpBindingErrorParam_problem_invalidAgreement,
                                data.bindingType,
                                undefined,
                                undefined,
                                [],
                                createSecurityParameters(
                                    ctx,
                                    signErrors,
                                    assn.boundNameAndUID?.dn,
                                    undefined,
                                    id_err_operationalBindingError,
                                ),
                                ctx.dsa.accessPoint.ae_title.rdnSequence,
                                undefined,
                                undefined,
                            ),
                            signErrors,
                        );
                    }
                }
            }
        }
        const updateMode = agreement.updateMode ?? ShadowingAgreementInfo._default_value_for_updateMode;
        const schedule = ("supplierInitiated" in updateMode)
            ? ("scheduled" in updateMode.supplierInitiated)
                ? updateMode.supplierInitiated.scheduled
                : undefined
            : ("consumerInitiated" in updateMode)
                ? updateMode.consumerInitiated
                : undefined;
        if (schedule?.periodic) {
            const period = schedule.periodic;
            if (
                !Number.isSafeInteger(period.updateInterval)
                || (period.updateInterval <= 0)
                || !Number.isSafeInteger(period.windowSize)
                || (period.windowSize <= 0)
            ) {
                throw new errors.MistypedArgumentError(ctx.i18n.t("err:nonsense_shadow_update_schedule"));
            }
            const updateInterval = Number(period.updateInterval);
            const windowSize = Number(period.windowSize);
            if (period.beginTime) {
                const tenPeriodsAgo = subSeconds(new Date(), updateInterval * 10);
                if (tenPeriodsAgo.valueOf() > period.beginTime.valueOf()) {
                    // We don't allow SOBs that start too many periods in the past.
                    throw new errors.OperationalBindingError(
                        ctx.i18n.t("err:sob_begin_time_too_far_in_past"),
                        new OpBindingErrorParam(
                            OpBindingErrorParam_problem_invalidAgreement,
                            data.bindingType,
                            undefined,
                            undefined,
                            [],
                            createSecurityParameters(
                                ctx,
                                signErrors,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                id_err_operationalBindingError,
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            undefined,
                            undefined,
                        ),
                        signErrors,
                    );
                }
            }
            if (windowSize > updateInterval) {
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:sob_window_size_gte_update_interval"),
                    new OpBindingErrorParam(
                        OpBindingErrorParam_problem_invalidAgreement,
                        data.bindingType,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_err_operationalBindingError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                    signErrors,
                );
            }
        }
        const master_ap_id = agreement.master
            ? await saveAccessPoint(ctx, agreement.master, Knowledge.OB_SHADOW_MASTER)
            : undefined;
        const created = await ctx.db.operationalBinding.create({
            data: {
                ...ob_db_data,
                shadowed_context_prefix: agreement.shadowSubject.area.contextPrefix.map(rdnToJson),
                knowledge_type: (agreement.shadowSubject.knowledge === undefined)
                    ? undefined
                    : ({
                        Knowledge_knowledgeType_both: ShadowedKnowledgeType.BOTH,
                        Knowledge_knowledgeType_master: ShadowedKnowledgeType.MASTER,
                        Knowledge_knowledgeType_shadow: ShadowedKnowledgeType.SHADOW,
                    })[agreement.shadowSubject.knowledge.knowledgeType],
                subordinates: agreement.shadowSubject.subordinates,
                supply_contexts: (agreement.shadowSubject.supplyContexts === undefined)
                    ? undefined
                    : (() => {
                        const sc = agreement.shadowSubject.supplyContexts;
                        if ("allContexts" in sc) {
                            return "";
                        } else if ("selectedContexts" in sc) {
                            return sc.selectedContexts
                                .map((s) => s.toString())
                                .join(",");
                        }
                        return undefined;
                    })(),
                supplier_initiated: agreement.updateMode
                    ? ("supplierInitiated" in agreement.updateMode)
                    : false,
                periodic_beginTime: schedule?.periodic?.beginTime,
                periodic_windowSize: schedule?.periodic?.windowSize
                    ? Number(schedule.periodic.windowSize)
                    : undefined,
                periodic_updateInterval: schedule?.periodic?.updateInterval
                    ? Number(schedule.periodic.updateInterval)
                    : undefined,
                othertimes: schedule?.othertimes,
                master_access_point_id: master_ap_id as undefined, // TODO: This is giving me a weird type error.
                secondary_shadows: agreement.secondaryShadows,
            },
            select: {
                id: true,
                uuid: true,
                responded_time: true,
                requested_time: true,
            },
        });
        if ("roleA_initiates" in data.initiator) {
            // Shadow supplier is initiating the OB.
            const approved: boolean | undefined = await getApproval(created.uuid);
            await ctx.db.operationalBinding.update({
                where: {
                    uuid: created.uuid,
                },
                data: {
                    accepted: approved ?? null,
                },
                select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
            });
            if (approved === undefined) {
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:ob_rejected", {
                        context: "timeout",
                        uuid: created.uuid,
                    }),
                    new OpBindingErrorParam(
                        OpBindingErrorParam_problem_currentlyNotDecidable,
                        data.bindingType,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_err_operationalBindingError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                    signErrors,
                );
            } else if (approved === false) {
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:ob_rejected", {
                        uuid: created.uuid,
                    }),
                    new OpBindingErrorParam(
                        OpBindingErrorParam_problem_invalidAgreement,
                        data.bindingType,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_err_operationalBindingError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                    signErrors,
                );
            }
            const ob_time: Date = created.responded_time
                ? new Date(Math.max(created.requested_time.valueOf(), created.responded_time.valueOf()))
                : created.requested_time;
            if (data.bindingID !== undefined) {
                ctx.shadowUpdateCycles.delete(Number(data.bindingID.identifier));
                ctx.pendingShadowingUpdateCycles.delete(Number(data.bindingID.identifier));
            }
            try {
                await becomeShadowConsumer(
                    ctx,
                    agreement,
                    data.accessPoint,
                    bindingID,
                    created.id,
                    ob_time,
                );
                ctx.log.info(ctx.i18n.t("log:establishOperationalBinding", {
                    context: "succeeded",
                    type: data.bindingType.toString(),
                    bid: bindingID.identifier.toString(),
                    aid: assn.id,
                }), {
                    remoteFamily: assn.socket.remoteFamily,
                    remoteAddress: assn.socket.remoteAddress,
                    remotePort: assn.socket.remotePort,
                    association_id: assn.id,
                    invokeID: printInvokeId({ present: invokeId }),
                });
                const resultData = new EstablishOperationalBindingResultData(
                    data.bindingType,
                    bindingID,
                    ctx.dsa.accessPoint,
                    {
                        roleB_replies: _encodeNull(null, DER),
                    },
                    [],
                    createSecurityParameters(
                        ctx,
                        signResult,
                        assn.boundNameAndUID?.dn,
                        id_op_establishOperationalBinding,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    undefined,
                    undefined,
                );
                if (!signResult) {
                    return {
                        unsigned: resultData,
                    };
                }
                const resultDataBytes = _encode_EstablishOperationalBindingResultData(resultData, DER).toBytes();
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
            } catch (e) {
                ctx.log.error(ctx.i18n.t("log:err_establishing_ob", {
                    uuid: created.uuid,
                    e,
                }));
                if (e instanceof errors.OperationalBindingError) {
                    ctx.db.operationalBinding.update({
                        where: {
                            uuid: created.uuid,
                        },
                        data: {
                            accepted: false,
                            last_ob_problem: e.data.problem,
                        },
                        select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
                    })
                        .then()
                        .catch((e) => ctx.log.error(ctx.i18n.t("log:failed_to_cancel_ob", { e }), {
                            ...logInfo,
                            ...((typeof e === "object" && e) ? e : {}),
                        }));
                } else {
                    ctx.db.operationalBinding.update({
                        where: {
                            uuid: created.uuid,
                        },
                        data: {
                            accepted: false,
                        },
                        select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
                    })
                        .then()
                        .catch((e) => ctx.log.error(ctx.i18n.t("log:failed_to_cancel_ob", { e }), {
                            ...logInfo,
                            ...((typeof e === "object" && e) ? e : {}),
                        }));
                }
                throw e;
            }
        } else if ("roleB_initiates" in data.initiator) {
            // Shadow consumer is initiating the OB.
            const approved: boolean | undefined = await getApproval(created.uuid);
            await ctx.db.operationalBinding.update({
                where: {
                    uuid: created.uuid,
                },
                data: {
                    accepted: approved ?? null,
                },
                select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
            });
            if (approved === undefined) {
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:ob_rejected", {
                        context: "timeout",
                        uuid: created.uuid,
                    }),
                    new OpBindingErrorParam(
                        OpBindingErrorParam_problem_currentlyNotDecidable,
                        data.bindingType,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_err_operationalBindingError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                    signErrors,
                );
            } else if (approved === false) {
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:ob_rejected", {
                        uuid: created.uuid,
                    }),
                    new OpBindingErrorParam(
                        OpBindingErrorParam_problem_invalidAgreement,
                        data.bindingType,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_err_operationalBindingError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                    signErrors,
                );
            }
            const cpVertex = await dnToVertex(ctx, ctx.dit.root, agreement.shadowSubject.area.contextPrefix);
            if (!cpVertex) {
                ctx.log.warn(ctx.i18n.t("err:no_such_object", {
                    context: "shadow_supplier_cp",
                    obid: bindingID.identifier.toString(),
                    cp: stringifyDN(ctx, agreement.shadowSubject.area.contextPrefix).slice(0, 2048),
                }));
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:no_such_object"),
                    new OpBindingErrorParam(
                        OpBindingErrorParam_problem_unsupportedBindingType,
                        data.bindingType,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_err_operationalBindingError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                    signErrors,
                );
            }
            try {
                await ctx.db.operationalBinding.update({
                    where: {
                        uuid: created.uuid,
                    },
                    data: {
                        entry_id: cpVertex.dse.id,
                    },
                    select: {
                        id: true,
                    },
                });
                const ob_time: Date = created.responded_time
                    ? new Date(Math.max(created.requested_time.valueOf(), created.responded_time.valueOf()))
                    : created.requested_time;
                await becomeShadowSupplier(
                    ctx,
                    bindingID,
                    cpVertex,
                    data.accessPoint,
                    agreement,
                    created.id,
                    ob_time,
                );
                ctx.log.info(ctx.i18n.t("log:establishOperationalBinding", {
                    context: "succeeded",
                    type: data.bindingType.toString(),
                    bid: bindingID.identifier.toString(),
                    aid: assn.id,
                }), {
                    remoteFamily: assn.socket.remoteFamily,
                    remoteAddress: assn.socket.remoteAddress,
                    remotePort: assn.socket.remotePort,
                    association_id: assn.id,
                    invokeID: printInvokeId({ present: invokeId }),
                });
                const resultData = new EstablishOperationalBindingResultData(
                    data.bindingType,
                    bindingID,
                    ctx.dsa.accessPoint,
                    {
                        roleA_replies: _encodeNull(null, DER),
                    },
                    [],
                    createSecurityParameters(
                        ctx,
                        signResult,
                        assn.boundNameAndUID?.dn,
                        id_op_establishOperationalBinding,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    undefined,
                    undefined,
                );
                if (!signResult) {
                    return {
                        unsigned: resultData,
                    };
                }
                const resultDataBytes = _encode_EstablishOperationalBindingResultData(resultData, DER).toBytes();
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
            } catch (e) {
                ctx.log.error(ctx.i18n.t("log:err_establishing_ob", {
                    uuid: created.uuid,
                    e,
                }));
                if (e instanceof errors.OperationalBindingError) {
                    ctx.db.operationalBinding.update({
                        where: {
                            uuid: created.uuid,
                        },
                        data: {
                            accepted: false,
                            last_ob_problem: e.data.problem,
                        },
                        select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
                    })
                        .then()
                        .catch((e) => ctx.log.error(ctx.i18n.t("log:failed_to_cancel_ob", { e }), {
                            ...logInfo,
                            ...((typeof e === "object" && e) ? e : {}),
                        }));
                } else {
                    ctx.db.operationalBinding.update({
                        where: {
                            uuid: created.uuid,
                        },
                        data: {
                            accepted: false,
                        },
                        select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
                    })
                        .then()
                        .catch((e) => ctx.log.error(ctx.i18n.t("log:failed_to_cancel_ob", { e }), {
                            ...logInfo,
                            ...((typeof e === "object" && e) ? e : {}),
                        }));
                }
                throw e;
            }
        } else {
            throw new errors.MistypedArgumentError(ctx.i18n.t("err:unrecognized_ob_initiator_syntax"));
        }
    } else {
        throw new errors.OperationalBindingError(
            ctx.i18n.t("err:ob_type_unrecognized", {
                obtype: data.bindingType.toString(),
            }),
            new OpBindingErrorParam(
                OpBindingErrorParam_problem_unsupportedBindingType,
                data.bindingType,
                undefined,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    id_err_operationalBindingError,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
            signErrors,
        );
    }
}

export default establishOperationalBinding;
