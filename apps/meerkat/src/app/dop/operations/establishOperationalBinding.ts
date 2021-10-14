import type { Context } from "@wildboar/meerkat-types";
import * as errors from "@wildboar/meerkat-types";
import type {
    EstablishOperationalBindingArgument,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/EstablishOperationalBindingArgument.ta";
import type {
    EstablishOperationalBindingArgumentData,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/EstablishOperationalBindingArgumentData.ta";
import type {
    EstablishOperationalBindingResult,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/EstablishOperationalBindingResult.ta";
import {
    EstablishOperationalBindingResultData,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/EstablishOperationalBindingResultData.ta";
import {
    id_op_binding_hierarchical,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-hierarchical.va";
import {
    id_op_binding_non_specific_hierarchical,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-non-specific-hierarchical.va";
import {
    id_op_binding_shadow,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-shadow.va";
import {
    OpBindingErrorParam,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OpBindingErrorParam.ta";
import {
    OpBindingErrorParam_problem_unsupportedBindingType,
    OpBindingErrorParam_problem_invalidAgreement,
    OpBindingErrorParam_problem_invalidStartTime,
    OpBindingErrorParam_problem_invalidEndTime,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OpBindingErrorParam-problem.ta";
import {
    HierarchicalAgreement,
    _decode_HierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/HierarchicalAgreement.ta";
import {
    SuperiorToSubordinate,
    _decode_SuperiorToSubordinate,
    _encode_SuperiorToSubordinate,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SuperiorToSubordinate.ta";
import {
    SubordinateToSuperior,
    _decode_SubordinateToSuperior,
    _encode_SubordinateToSuperior,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SubordinateToSuperior.ta";
import type {
    Time,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/Time.ta";
import type {
    Code,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import {
    _encode_AccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import compareDistinguishedName from "@wildboar/x500/src/lib/comparators/compareDistinguishedName";
import { ASN1Element, OBJECT_IDENTIFIER, packBits } from "asn1-ts";
import becomeSubordinate from "../establish/becomeSubordinate";
import becomeSuperior from "../establish/becomeSuperior";
import { OperationalBindingInitiator, Knowledge } from "@prisma/client";
import {
    _encode_CertificationPath,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/CertificationPath.ta";
import rdnToJson from "../../x500/rdnToJson";
import getDateFromTime from "@wildboar/x500/src/lib/utils/getDateFromTime";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import { DER } from "asn1-ts/dist/node/functional";
import createSecurityParameters from "../../x500/createSecurityParameters";
import {
    id_err_operationalBindingError,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-err-operationalBindingError.va";
import {
    id_op_establishOperationalBinding,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-op-establishOperationalBinding.va";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter";

function getDateFromOBTime (time: Time): Date {
    if ("utcTime" in time) {
        return time.utcTime;
    } else {
        return time.generalizedTime;
    }
}

function codeToString (code?: Code): string | undefined {
    return (code
        ? ("global" in code)
            ? code.global.toString()
            : ("local" in code)
                ? code.local.toString()
                : undefined
        : undefined);
}

export
async function establishOperationalBinding (
    ctx: Context,
    arg: EstablishOperationalBindingArgument,
): Promise<EstablishOperationalBindingResult> {
    const NAMING_MATCHER = getNamingMatcherGetter(ctx);
    const data: EstablishOperationalBindingArgumentData = getOptionallyProtectedValue(arg);
    const getApproval = (uuid: string): Promise<boolean> => Promise.race<boolean>([
        new Promise<boolean>((resolve) => {
            ctx.operationalBindingControlEvents.once(uuid, (approved: boolean) => {
                resolve(approved);
            });
        }),
        new Promise<boolean>(resolve => setTimeout(() => resolve(false), 30000)),
    ]);

    const NOT_SUPPORTED_ERROR = new errors.OperationalBindingError(
        `Operational binding type ${data.bindingType.toString()} not understood.`,
        {
            unsigned: new OpBindingErrorParam(
                OpBindingErrorParam_problem_unsupportedBindingType,
                data.bindingType,
                undefined,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    undefined,
                    undefined,
                    id_err_operationalBindingError,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
        },
    );

    if (data.valid?.validFrom instanceof ASN1Element) {
        throw new errors.OperationalBindingError(
            "Unrecognized operational binding start time format. ("
            + `Tag class: ${data.valid?.validFrom.tagClass}, `
            + `Construction ${data.valid?.validFrom.construction}, `
            + `Tag number: ${data.valid?.validFrom.tagNumber}, `
            + `Value length: ${data.valid?.validFrom.length})`,
            {
                unsigned: new OpBindingErrorParam(
                    OpBindingErrorParam_problem_invalidStartTime,
                    data.bindingType,
                    undefined,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        undefined,
                        undefined,
                        id_err_operationalBindingError,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    undefined,
                    undefined,
                ),
            },
        );
    }
    if (data.valid?.validUntil instanceof ASN1Element) {
        throw new errors.OperationalBindingError(
            "Unrecognized operational binding end time format. ("
            + `Tag class: ${data.valid?.validUntil.tagClass}, `
            + `Construction ${data.valid?.validUntil.construction}, `
            + `Tag number: ${data.valid?.validUntil.tagNumber}, `
            + `Value length: ${data.valid?.validUntil.length})`,
            {
                unsigned: new OpBindingErrorParam(
                    OpBindingErrorParam_problem_invalidEndTime,
                    data.bindingType,
                    undefined,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        undefined,
                        undefined,
                        id_err_operationalBindingError,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    undefined,
                    undefined,
                ),
            },
        );
    }

    const now = new Date();
    const validFrom = (data.valid?.validFrom && ("time" in data.valid.validFrom))
        ? getDateFromOBTime(data.valid.validFrom.time)
        : now;
    const validUntil = (data.valid?.validUntil && ("time" in data.valid.validUntil))
        ? getDateFromOBTime(data.valid.validUntil.time)
        : undefined;

    if (data.bindingType.isEqualTo(id_op_binding_hierarchical)) {
        const agreement: HierarchicalAgreement = _decode_HierarchicalAgreement(data.agreement);
        if ("roleA_initiates" in data.initiator) {
            const init: SuperiorToSubordinate = _decode_SuperiorToSubordinate(data.initiator.roleA_initiates);
            if (!compareDistinguishedName(
                agreement.immediateSuperior,
                init.contextPrefixInfo.map((rdn) => rdn.rdn),
                NAMING_MATCHER,
            )) {
                throw new errors.OperationalBindingError(
                    "Operational binding contextPrefixInfo did not match immediateSuperior.",
                    {
                        unsigned: new OpBindingErrorParam(
                            OpBindingErrorParam_problem_invalidAgreement,
                            data.bindingType,
                            undefined,
                            undefined,
                            [],
                            createSecurityParameters(
                                ctx,
                                undefined,
                                undefined,
                                id_err_operationalBindingError,
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            undefined,
                            undefined,
                        ),
                    },
                );
            }
            const reply = await becomeSubordinate(ctx, agreement, init);
            const sp = data.securityParameters;
            const now = new Date();
            const alreadyTakenBindingIDs = new Set(
                (await ctx.db.operationalBinding.findMany({
                    where: {
                        binding_type: id_op_binding_hierarchical.toString(),
                        validity_start: {
                            gte: now,
                        },
                        validity_end: {
                            lte: now,
                        },
                    },
                    select: {
                        binding_identifier: true,
                    },
                }))
                    .map((ob) => ob.binding_identifier),
            );
            let newBindingIdentifier!: number;
            if (typeof data.bindingID?.identifier === "number") {
                if (alreadyTakenBindingIDs.has(data.bindingID.identifier)) {
                    throw new Error(); // FIXME:
                } else {
                    newBindingIdentifier = data.bindingID.identifier;
                }
            } else if (typeof data.bindingID?.identifier === "undefined") {
                let attemptedID: number = 0;
                while (alreadyTakenBindingIDs.has(attemptedID)) {
                    attemptedID++;
                }
                newBindingIdentifier = attemptedID;
            }

            const created = await ctx.db.operationalBinding.create({
                data: {
                    outbound: false,
                    binding_type: data.bindingType.toString(),
                    binding_identifier: newBindingIdentifier,
                    binding_version: data.bindingID?.version ?? 0,
                    agreement_ber: Buffer.from(data.agreement.toBytes()),
                    access_point: {
                        create: {
                            knowledge_type: Knowledge.OB_REQUEST,
                            ae_title: data.accessPoint.ae_title.rdnSequence.map((rdn) => rdnToJson(rdn)),
                            // ipv4: ipv4FromNSAP(data.accessPoint.address.nAddresses[0])
                            // TODO: ipv4
                            // TODO: tcp_port
                            // TODO: url
                            ber: Buffer.from(_encode_AccessPoint(data.accessPoint, DER).toBytes()),
                        },
                    },
                    initiator: OperationalBindingInitiator.ROLE_A,
                    initiator_ber: Buffer.from(data.initiator.roleA_initiates.toBytes()),
                    validity_start: validFrom,
                    validity_end: validUntil,
                    security_certification_path: sp?.certification_path
                        ? Buffer.from(_encode_CertificationPath(sp.certification_path, DER).toBytes())
                        : undefined,
                    security_name: sp?.name?.map((rdn) => rdnToJson(rdn)),
                    security_time: sp?.time
                        ? getDateFromTime(sp.time)
                        : undefined,
                    security_random: sp?.random
                        ? Buffer.from(packBits(sp.random))
                        : undefined,
                    security_target: sp?.target,
                    security_operationCode: codeToString(sp?.operationCode),
                    security_errorProtection: sp?.errorProtection,
                    security_errorCode: codeToString(sp?.errorCode),
                    new_context_prefix_rdn: rdnToJson(agreement.rdn),
                    immediate_superior: agreement.immediateSuperior.map((rdn) => rdnToJson(rdn)),
                    // TODO: Source
                    supply_contexts: "",
                    requested_time: new Date(),
                },
            });
            const approved: boolean = await getApproval(created.uuid);
            if (!approved) {
                throw new errors.OperationalBindingError(
                    "Operational binding rejected.",
                    {
                        unsigned: new OpBindingErrorParam(
                            OpBindingErrorParam_problem_invalidAgreement,
                            data.bindingType,
                            undefined,
                            undefined,
                            [],
                            createSecurityParameters(
                                ctx,
                                undefined,
                                undefined,
                                id_err_operationalBindingError,
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            undefined,
                            undefined,
                        ),
                    },
                );
            }
            return {
                unsigned: new EstablishOperationalBindingResultData(
                    data.bindingType,
                    data.bindingID,
                    ctx.dsa.accessPoint,
                    {
                        roleB_replies: _encode_SubordinateToSuperior(reply, DER),
                    },
                    [],
                    createSecurityParameters(
                        ctx,
                        undefined,
                        id_op_establishOperationalBinding,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    undefined,
                    undefined,
                ),
            };
        } else if ("roleB_initiates" in data.initiator) {
            const init: SubordinateToSuperior = _decode_SubordinateToSuperior(data.initiator.roleB_initiates);
            const reply = await becomeSuperior(ctx, agreement, init);
            return {
                unsigned: new EstablishOperationalBindingResultData(
                    data.bindingType,
                    data.bindingID,
                    ctx.dsa.accessPoint,
                    {
                        roleA_replies: _encode_SuperiorToSubordinate(reply, DER),
                    },
                    [],
                    createSecurityParameters(
                        ctx,
                        undefined,
                        id_op_establishOperationalBinding,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    undefined,
                    undefined,
                ),
            };
        } else {
            throw new errors.OperationalBindingError(
                "Operational binding initiator format unrecognized.",
                {
                    unsigned: new OpBindingErrorParam(
                        OpBindingErrorParam_problem_invalidAgreement,
                        data.bindingType,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            undefined,
                            undefined,
                            id_err_operationalBindingError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                },
            );
        }
    } else if (data.bindingType.isEqualTo(id_op_binding_non_specific_hierarchical)) {
        throw NOT_SUPPORTED_ERROR;
    } else if (data.bindingType.isEqualTo(id_op_binding_shadow)) {
        throw NOT_SUPPORTED_ERROR;
    } else {
        throw NOT_SUPPORTED_ERROR;
    }
}

export default establishOperationalBinding;
