import { Buffer } from "node:buffer";
import { Vertex, ServiceError, UpdateError } from "../types/index.js";
import type { MeerkatContext } from "../ctx.js";
import { BERElement, packBits } from "@wildboar/asn1";
import { DER } from "@wildboar/asn1/functional";
import { bindForOBM } from "../net/bindToOtherDSA.js";
import dnToVertex from "../dit/dnToVertex.js";
import getRelevantOperationalBindings from "./getRelevantOperationalBindings.js";
import {
    HierarchicalAgreement,
    _decode_HierarchicalAgreement,
    _encode_HierarchicalAgreement,
} from "@wildboar/x500/HierarchicalOperationalBindings";
import {
    AccessPoint,
    _decode_AccessPoint,
} from "@wildboar/x500/DistributedOperations";
import { strict as assert } from "node:assert";
import { OperationalBindingID } from "@wildboar/x500/OperationalBindingManagement";
import type {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import { compareDistinguishedName } from "@wildboar/x500";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter.js";
import { addMilliseconds, differenceInMilliseconds } from "date-fns";
import {
    modifyOperationalBinding,
} from "@wildboar/x500/OperationalBindingManagement";
import {
    SubordinateToSuperior,
    _encode_SubordinateToSuperior,
} from "@wildboar/x500/HierarchicalOperationalBindings";
import {
    MasterOrShadowAccessPoint,
} from "@wildboar/x500/DistributedOperations";
import {
    MasterOrShadowAccessPoint_category_master,
} from "@wildboar/x500/DistributedOperations";
import {
    SubentryInfo,
} from "@wildboar/x500/HierarchicalOperationalBindings";
import {
    Attribute,
} from "@wildboar/x500/InformationFramework";
import readSubordinates from "../dit/readSubordinates.js";
import getAttributesFromSubentry from "../dit/getAttributesFromSubentry.js";
import {
    id_op_binding_hierarchical,
} from "@wildboar/x500/DirectoryOperationalBindingTypes";
import createSecurityParameters from "../x500/createSecurityParameters.js";
import {
    UpdateErrorData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    UpdateProblem_affectsMultipleDSAs,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    updateError,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ServiceErrorData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ServiceProblem_unavailable,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    serviceError,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    operationalBindingError,
} from "@wildboar/x500/OperationalBindingManagement";
import {
    OpBindingErrorParam_problem_invalidNewID,
} from "@wildboar/x500/OperationalBindingManagement";
import { OperationalBindingInitiator } from "../generated/client.js";
import {
    _encode_CertificationPath,
} from "@wildboar/x500/AuthenticationFramework";
import { getDateFromTime } from "@wildboar/x500";
import { rdnToJson } from "../x500/rdnToJson.js";
import type {
    Code,
} from "@wildboar/x500/CommonProtocolSpecification";
import { compareCode } from "@wildboar/x500";
import { getOptionallyProtectedValue } from "@wildboar/x500";
import { sleep } from "../utils/sleep.js";
import { ResultParameters } from "@wildboar/rose-transport";
import {
    ModifyOperationalBindingResult,
} from "@wildboar/x500/OperationalBindingManagement";
import { getEntryAttributesToShareInOpBinding } from "../dit/getEntryAttributesToShareInOpBinding.js";
import { dSAProblem } from "@wildboar/x500/SelectedAttributeTypes";
import {
    id_pr_targetDsaUnavailable,
} from "@wildboar/x500/SelectedAttributeTypes";
import { id_op_binding_non_specific_hierarchical } from "@wildboar/x500/DirectoryOperationalBindingTypes";

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

const updateTimingBackoffInSeconds: number[] = [ 2, 4, 8 ];

export
interface UpdateSuperiorOptions {
    timeLimitInMilliseconds?: number;
    endTime?: Date;
}

// TODO: This whole function can go in a separate thread in some cases.
/**
 * @summary Update a superior DSA of changes made to the context prefix or its subentries, if present.
 * @description
 *
 * This function updates a superior DSA with changes that were made to the
 * context prefix, or one of its subentries.
 *
 * @param ctx The context object
 * @param affectedDN The distinguished name of the entry whose change warrants
 *  an update to the hierarchical operational binding
 * @param newCP The vertex representing the new context prefix
 * @param aliasDereferenced Whether an alias was dereferenced leading up to this
 * @param options Options
 * @returns A result or error
 *
 * @function
 * @async
 */
export
async function updateSuperiorDSA (
    ctx: MeerkatContext,
    affectedDN: DistinguishedName,
    newCP: Vertex,
    aliasDereferenced: boolean,
    options?: UpdateSuperiorOptions,
    signErrors: boolean = false,
): Promise<ResultParameters<ModifyOperationalBindingResult>> {
    const connectionTimeout: number | undefined = options?.timeLimitInMilliseconds;
    const startTime = new Date();
    const timeoutTime: Date | undefined = connectionTimeout
        ? addMilliseconds(startTime, connectionTimeout)
        : undefined;
    let noHOBS: boolean = true;
    const activeHOBs = await getRelevantOperationalBindings(ctx, false);
    // TODO: Make these all update in parallel.
    for (const hob of activeHOBs) {
        if (!hob.access_point) {
            continue;
        }
        if (hob.binding_type === id_op_binding_non_specific_hierarchical.toString()) {
            continue;
        }
        const argreementElement = new BERElement();
        argreementElement.fromBytes(hob.agreement_ber);
        const agreement: HierarchicalAgreement = _decode_HierarchicalAgreement(argreementElement);
        const agreementDN: DistinguishedName = [
            ...agreement.immediateSuperior,
            agreement.rdn,
        ];
        if (!compareDistinguishedName(agreementDN, affectedDN, getNamingMatcherGetter(ctx))) {
            continue;
        }
        // Beyond this point, this operational binding is definitely relevant
        // to the `affectedDN`.
        noHOBS = false;

        const newAgreement: HierarchicalAgreement = new HierarchicalAgreement(
            newCP.dse.rdn,
            agreement.immediateSuperior,
        );

        const accessPointElement = new BERElement();
        accessPointElement.fromBytes(hob.access_point.ber);
        const accessPoint: AccessPoint = _decode_AccessPoint(accessPointElement);

        try {
            const subr = await dnToVertex(ctx, ctx.dit.root, agreementDN);
            if (!subr) {
                ctx.log.warn(ctx.i18n.t("log:subr_for_hob_not_found", {
                    obid: hob.binding_identifier.toString(),
                    version: hob.binding_version.toString(),
                }));
                continue;
            }
            assert(subr.immediateSuperior);
            // const assn: Connection | null = await connect(ctx, accessPoint, dop_ip["&id"]!, {
            //     timeLimitInMilliseconds: options?.timeLimitInMilliseconds,
            //     tlsOptional: ctx.config.chaining.tlsOptional,
            //     signErrors,
            // });
            const assn = await bindForOBM(ctx, undefined, undefined, accessPoint, aliasDereferenced, signErrors);
            if (!assn) {
                throw new ServiceError(
                    ctx.i18n.t("err:could_not_connect"),
                    new ServiceErrorData(
                        ServiceProblem_unavailable,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            undefined,
                            undefined,
                            serviceError["&errorCode"]
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        aliasDereferenced,
                        [
                            new Attribute(
                                dSAProblem["&id"],
                                [dSAProblem.encoderFor["&Type"]!(id_pr_targetDsaUnavailable, DER)],
                            ),
                        ],
                    ),
                    signErrors,
                );
            }
            // TODO: Use this.
            const timeRemainingForOperation: number | undefined = timeoutTime
                ? differenceInMilliseconds(timeoutTime, new Date())
                : undefined;
            const cpInfo: Attribute[] = [];
            const subentryInfos: SubentryInfo[] = [];

            cpInfo.push(...await getEntryAttributesToShareInOpBinding(ctx, newCP));
            const subentries = await readSubordinates(ctx, newCP, undefined, undefined, undefined, {
                subentry: true,
            });
            for (const sub of subentries) {
                subentryInfos.push(new SubentryInfo(
                    sub.dse.rdn,
                    await getAttributesFromSubentry(ctx, sub),
                ));
            }
            const myAccessPoint = ctx.dsa.accessPoint;
            const sub2sup: SubordinateToSuperior = new SubordinateToSuperior(
                [
                    new MasterOrShadowAccessPoint(
                        myAccessPoint.ae_title,
                        myAccessPoint.address,
                        myAccessPoint.protocolInformation,
                        MasterOrShadowAccessPoint_category_master, // Could not be otherwise.
                        false,
                    ),
                    /** REVIEW:
                     * ITU Recommendation X.518 (2016), Section 23.1.2, says that:
                     *
                     * > The values of the consumerKnowledge and secondaryShadows (both
                     * > held in the subordinate context prefix DSE) are used to form
                     * > additional elements in accessPoints with category having the
                     * > value shadow.
                     *
                     * But the context prefix is newly created by the operation itself,
                     * so how could it possibly have shadows at that time?
                     */
                ],
                Boolean(newCP.dse.alias),
                cpInfo,
                subentryInfos.length
                    ? subentryInfos
                    : undefined,
            );
            const encodedNewAgreement = _encode_HierarchicalAgreement(newAgreement, DER);
            const encodedSub2Sup = _encode_SubordinateToSuperior(sub2sup, DER);
            const newOB = await ctx.db.operationalBinding.create({
                data: {
                    accepted: undefined,
                    outbound: true,
                    binding_type: id_op_binding_hierarchical.toString(),
                    binding_identifier: hob.binding_identifier,
                    binding_version: hob.binding_version + 1,
                    agreement_ber: encodedNewAgreement.toBytes(),
                    access_point: {
                        connect: {
                            id: hob.access_point.id,
                        },
                    },
                    initiator: OperationalBindingInitiator.ROLE_B,
                    initiator_ber: Buffer.from(encodedSub2Sup.toBytes()),
                    validity_start: hob.validity_start,
                    validity_end: hob.validity_end,
                    new_context_prefix_rdn: rdnToJson(newCP.dse.rdn),
                    immediate_superior: newAgreement.immediateSuperior.map(rdnToJson),
                    // TODO: Add more source info once signing is implemented.
                    requested_time: new Date(),
                },
                select: {
                    id: true,
                    uuid: true,
                },
            });
            // A binary exponential backoff loop for retrying failed updates.
            let bindingVersion = hob.binding_version;
            for (const backoff of updateTimingBackoffInSeconds) {
                const sp = createSecurityParameters(
                    ctx,
                    true,
                    accessPoint.ae_title.rdnSequence,
                    modifyOperationalBinding["&operationCode"]!,
                );
                const bindingID = new OperationalBindingID(
                    hob.binding_identifier,
                    bindingVersion,
                ); // The newBindingID will be implemented under the hood.
                const response = await assn.modifyHOBWithSuperior({
                    bindingID,
                    initiator: sub2sup,
                    newAgreement: newAgreement,
                    accessPoint: ctx.dsa.accessPoint,
                    securityParameters: sp,
                    cert_path: ctx.config.signing.certPath,
                    key: ctx.config.signing.key,
                });
                // const response = await assn.writeOperation({
                //     opCode: modifyOperationalBinding["&operationCode"]!,
                //     argument: _encode_ModifyOperationalBindingArgument(arg, DER),
                // }, {
                //     timeLimitInMilliseconds: timeRemainingForOperation,
                // });
                if (("result" in response)) {
                    await ctx.db.operationalBinding.update({
                        where: {
                            uuid: newOB.uuid,
                        },
                        data: {
                            accepted: true,
                            binding_version: bindingVersion + 1,
                            /**
                             * Previous is not set until the update succeeds,
                             * because `getRelevantOperationalBindings`
                             * determines which is the latest of all versions of
                             * a given operational binding based on which
                             * operational binding has no "previous"es that
                             * point to it.
                             */
                            previous: {
                                connect: {
                                    id: hob.id,
                                },
                            },
                            security_certification_path: sp?.certification_path
                                ? _encode_CertificationPath(sp.certification_path, DER).toBytes()
                                : undefined,
                            security_name: accessPoint.ae_title.rdnSequence.map(rdnToJson),
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
                        },
                        select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
                    });
                    return response.result;
                } else if ("error" in response) {
                    if (compareCode(response.error.code, operationalBindingError["&errorCode"]!)) {
                        const obError = operationalBindingError.decoderFor["&ParameterType"]!(response.error.parameter);
                        const obErrorData = getOptionallyProtectedValue(obError);
                        if (obErrorData.problem === OpBindingErrorParam_problem_invalidNewID) {
                            ctx.log.warn(ctx.i18n.t("log:invalid_new_id"));
                            // TODO: Review why I had to increment by two.
                            // I almost think it was a race condition where multiple calls to this function
                            // were interleaved.
                            bindingVersion += 2;
                            await sleep(backoff * 1000);
                            continue;
                        } else {
                            ctx.log.error(ctx.i18n.t("log:update_superior_dsa", {
                                context: "oberror",
                                problem: obErrorData.problem,
                            }));
                            break;
                        }
                    } else {
                        ctx.log.error(ctx.i18n.t("log:update_superior_dsa", {
                            context: "errcode",
                            code: codeToString(response.error.code),
                        }));
                        break;
                    }
                // FIXME: Handle reject, abort, timeout, etc.
                } else {
                    ctx.log.error(ctx.i18n.t("log:update_superior_dsa", {
                        context: "nocode",
                    }));
                    break;
                }
            }
            await ctx.db.operationalBinding.update({
                where: {
                    uuid: newOB.uuid,
                },
                data: {
                    accepted: false,
                },
            });
        } catch (e) {
            ctx.log.warn(ctx.i18n.t("log:failed_to_update_hob", {
                obid: hob.binding_identifier.toString(),
                version: hob.binding_version.toString(),
                e: e.message,
            }));
        }
    }
    throw new UpdateError(
        noHOBS
            ? ctx.i18n.t("err:failed_to_update_superior_dsa", {
                context: "no_hob",
            })
            : ctx.i18n.t("err:failed_to_update_superior_dsa", {
                context: "failed",
            }),
        new UpdateErrorData(
            UpdateProblem_affectsMultipleDSAs,
            undefined,
            [],
            createSecurityParameters(
                ctx,
                signErrors,
                undefined,
                undefined,
                updateError["&errorCode"],
            ),
            ctx.dsa.accessPoint.ae_title.rdnSequence,
            aliasDereferenced,
            undefined,
        ),
        signErrors,
    );
}

export default updateSuperiorDSA;
