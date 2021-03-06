import { Vertex, ServiceError, UpdateError } from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../ctx";
import {
    ASN1Construction,
    ASN1TagClass,
    ASN1UniversalType,
    DERElement,
    BERElement,
    ObjectIdentifier,
    packBits,
} from "asn1-ts";
import { DER } from "asn1-ts/dist/node/functional";
import { connect, ConnectOptions } from "../net/connect";
import type {
    Connection,
    WriteOperationOptions,
} from "../net/Connection";
import dnToVertex from "../dit/dnToVertex";
import getRelevantOperationalBindings from "./getRelevantOperationalBindings";
import {
    HierarchicalAgreement,
    _decode_HierarchicalAgreement,
    _encode_HierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/HierarchicalAgreement.ta";
import {
    AccessPoint,
    _decode_AccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import { strict as assert } from "assert";
import { OperationalBindingID } from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OperationalBindingID.ta";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import compareDistinguishedName from "@wildboar/x500/src/lib/comparators/compareDistinguishedName";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";
import { dop_ip } from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dop-ip.oa";
import { addMilliseconds, differenceInMilliseconds } from "date-fns";
import type { ResultOrError } from "@wildboar/x500/src/lib/types/ResultOrError";
import {
    modifyOperationalBinding,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/modifyOperationalBinding.oa";
import {
    ModifyOperationalBindingArgument,
    _encode_ModifyOperationalBindingArgument,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/ModifyOperationalBindingArgument.ta";
import {
    ModifyOperationalBindingArgumentData,
    _encode_ModifyOperationalBindingArgumentData,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/ModifyOperationalBindingArgumentData.ta";
import {
    SubordinateToSuperior,
    _encode_SubordinateToSuperior,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SubordinateToSuperior.ta";
import {
    MasterOrShadowAccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterOrShadowAccessPoint.ta";
import {
    MasterOrShadowAccessPoint_category_master,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterOrShadowAccessPoint-category.ta";
import {
    SubentryInfo,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/Vertex.ta";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import {
    administrativeRole,
} from "@wildboar/x500/src/lib/modules/InformationFramework/administrativeRole.oa";
import {
    accessControlScheme,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/accessControlScheme.oa";
import {
    subentryACI,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/subentryACI.oa";
import {
    entryACI,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/entryACI.oa";
import {
    _encode_ACIItem,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/ACIItem.ta";
import readSubordinates from "../dit/readSubordinates";
import getAttributesFromSubentry from "../dit/getAttributesFromSubentry";
import {
    id_op_binding_hierarchical,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-hierarchical.va";
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    UpdateErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateErrorData.ta";
import {
    UpdateProblem_affectsMultipleDSAs,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateProblem.ta";
import {
    updateError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/updateError.oa";
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    ServiceProblem_unavailable,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import {
    serviceError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/serviceError.oa";
import {
    operationalBindingError,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/operationalBindingError.oa";
import {
    OpBindingErrorParam_problem_invalidNewID,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OpBindingErrorParam-problem.ta";
import { OperationalBindingInitiator } from "@prisma/client";
import {
    _encode_CertificationPath,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/CertificationPath.ta";
import getDateFromTime from "@wildboar/x500/src/lib/utils/getDateFromTime";
import { rdnToJson } from "../x500/rdnToJson";
import type {
    Code,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import type {
    SecurityParameters,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityParameters.ta";
import compareCode from "@wildboar/x500/src/lib/utils/compareCode";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import { sleep } from "../utils/sleep";
import { generateSIGNED } from "../pki/generateSIGNED";

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

const updateTimingBackoffInSeconds: number[] = [ 1, 2 ];

export
interface UpdateSuperiorOptions extends ConnectOptions, WriteOperationOptions {
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
): Promise<ResultOrError> {
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
        const bindingID = new OperationalBindingID(
            hob.binding_identifier,
            hob.binding_version,
        );
        // Beyond this point, this operational binding is definitely relevant
        // to the `affectedDN`.
        noHOBS = false;

        let bindingVersion: number = Number(bindingID.version) + 1;
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
                    obid: bindingID.identifier.toString(),
                    version: bindingID.version.toString(),
                }));
                continue;
            }
            assert(subr.immediateSuperior);
            const assn: Connection | null = await connect(ctx, accessPoint, dop_ip["&id"]!, {
                timeLimitInMilliseconds: options?.timeLimitInMilliseconds,
                tlsOptional: ctx.config.chaining.tlsOptional,
                signErrors,
            });
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
                    ),
                    signErrors,
                );
            }
            const timeRemainingForOperation: number | undefined = timeoutTime
                ? differenceInMilliseconds(timeoutTime, new Date())
                : undefined;
            const cpInfo: Attribute[] = [];
            const subentryInfos: SubentryInfo[] = [];
            if (newCP.dse.admPoint?.accessControlScheme) {
                cpInfo.push(new Attribute(
                    accessControlScheme["&id"],
                    [
                        new DERElement(
                            ASN1TagClass.universal,
                            ASN1Construction.primitive,
                            ASN1UniversalType.objectIdentifier,
                            newCP.dse.admPoint.accessControlScheme,
                        ),
                    ],
                    undefined,
                ));
            }
            if (newCP.dse.admPoint?.administrativeRole) {
                cpInfo.push(new Attribute(
                    administrativeRole["&id"],
                    Array.from(newCP.dse.admPoint.administrativeRole)
                        .map((oidStr) => ObjectIdentifier.fromString(oidStr))
                        .map((oid) => new DERElement(
                            ASN1TagClass.universal,
                            ASN1Construction.primitive,
                            ASN1UniversalType.objectIdentifier,
                            oid,
                        )),
                    undefined,
                ));
            }
            if (newCP.dse.admPoint?.subentryACI) {
                cpInfo.push(new Attribute(
                    subentryACI["&id"],
                    newCP.dse.admPoint.subentryACI
                        .map((aci) => _encode_ACIItem(aci, DER)),
                    undefined,
                ));
            }
            if (newCP.dse.entryACI) {
                cpInfo.push(new Attribute(
                    entryACI["&id"],
                    newCP.dse.entryACI
                        .map((aci) => _encode_ACIItem(aci, DER)),
                    undefined,
                ));
            }
            (await readSubordinates(ctx, newCP, undefined, undefined, undefined, {
                subentry: true,
            }))
                .filter((sub) => sub.dse.subentry)
                .forEach((sub): void => {
                    subentryInfos.push(new SubentryInfo(
                        sub.dse.rdn,
                        getAttributesFromSubentry(sub),
                    ));
                });
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
                    accepted: false,
                    outbound: true,
                    binding_type: id_op_binding_hierarchical.toString(),
                    binding_identifier: Number(bindingID.identifier),
                    binding_version: Number(bindingID.version) + 1,
                    agreement_ber: Buffer.from(encodedNewAgreement.toBytes()),
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
            const createArg = (securityParameters?: SecurityParameters): ModifyOperationalBindingArgument => {
                const argData = new ModifyOperationalBindingArgumentData(
                    id_op_binding_hierarchical,
                    new OperationalBindingID(
                        bindingID.identifier,
                        Number(bindingID.version) + 1,
                    ),
                    ctx.dsa.accessPoint,
                    {
                        roleB_initiates: encodedSub2Sup,
                    },
                    new OperationalBindingID(
                        bindingID.identifier,
                        bindingVersion,
                    ),
                    encodedNewAgreement,
                    undefined, // Validity remains the same.
                    securityParameters,
                );
                const signArgument: boolean = true; // TODO: Make configurable.
                return (signArgument
                    ? generateSIGNED(ctx, argData, _encode_ModifyOperationalBindingArgumentData)
                    : {
                        unsigned: argData,
                    });
            };
            // A binary exponential backoff loop for retrying failed updates.
            for (const backoff of updateTimingBackoffInSeconds) {
                const sp = createSecurityParameters(
                    ctx,
                    true,
                    accessPoint.ae_title.rdnSequence,
                    modifyOperationalBinding["&operationCode"]!,
                );
                const arg = createArg(sp);
                const response = await assn.writeOperation({
                    opCode: modifyOperationalBinding["&operationCode"]!,
                    argument: _encode_ModifyOperationalBindingArgument(arg, DER),
                }, {
                    timeLimitInMilliseconds: timeRemainingForOperation,
                });
                if (("result" in response)) {
                    await ctx.db.operationalBinding.update({
                        where: {
                            uuid: newOB.uuid,
                        },
                        data: {
                            accepted: true,
                            binding_version: bindingVersion,
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
                                ? Buffer.from(_encode_CertificationPath(sp.certification_path, DER).toBytes())
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
                    });
                    assn.close();
                    return response;
                } else if (("errcode" in response) && response.errcode) {
                    if (compareCode(response.errcode, operationalBindingError["&errorCode"]!)) {
                        const obError = operationalBindingError.decoderFor["&ParameterType"]!(response.error);
                        const obErrorData = getOptionallyProtectedValue(obError);
                        if (obErrorData.problem === OpBindingErrorParam_problem_invalidNewID) {
                            ctx.log.warn(ctx.i18n.t("log:invalid_new_id"));
                            bindingVersion++;
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
                            code: codeToString(response.errcode),
                        }));
                        break;
                    }
                } else {
                    ctx.log.error(ctx.i18n.t("log:update_superior_dsa", {
                        context: "nocode",
                    }));
                    break;
                }
            }
        } catch (e) {
            ctx.log.warn(ctx.i18n.t("log:failed_to_update_hob", {
                obid: bindingID.identifier.toString(),
                version: bindingID.version.toString(),
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
