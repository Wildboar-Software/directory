import type { Context } from "../../types";
import * as errors from "../errors";
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
import { ASN1Element, DERElement, OBJECT_IDENTIFIER, packBits } from "asn1-ts";
import becomeSubordinate from "../establish/becomeSubordinate";
import becomeSuperior from "../establish/becomeSuperior";
import { OperationalBindingInitiator, Knowledge } from "@prisma/client";
import {
    _encode_CertificationPath,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/CertificationPath.ta";
import rdnToJson from "../../x500/rdnToJson";
import getDateFromTime from "@wildboar/x500/src/lib/utils/getDateFromTime";

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

const DER = () => new DERElement();

export
async function establishOperationalBinding (
    ctx: Context,
    arg: EstablishOperationalBindingArgument,
): Promise<EstablishOperationalBindingResult> {
    const data: EstablishOperationalBindingArgumentData = ("signed" in arg)
        ? arg.signed.toBeSigned
        : arg.unsigned;

    // TODO: Wait for approval.

    const NOT_SUPPORTED_ERROR = new errors.OperationalBindingError(
        `Operational binding type ${data.bindingType.toString()} not understood.`,
        {
            unsigned: new OpBindingErrorParam(
                OpBindingErrorParam_problem_unsupportedBindingType,
                data.bindingType,
                undefined,
                undefined,
                [],
                undefined,
                undefined,
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
                    undefined,
                    undefined,
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
                    undefined,
                    undefined,
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
                (attributeType: OBJECT_IDENTIFIER) => ctx.attributes.get(attributeType.toString())?.namingMatcher,
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
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                        ),
                    },
                );
            }
            const reply = await becomeSubordinate(ctx, agreement, init);
            const sp = data.securityParameters;
            await ctx.db.operationalBinding.create({
                data: {
                    binding_type: data.bindingType.nodes,
                    binding_identifier: data.bindingID?.identifier,
                    binding_version: data.bindingID?.version,
                    agreement_ber: Buffer.from(data.agreement.toBytes()),
                    access_point: {
                        create: {
                            knowledge_type: Knowledge.OB_REQUEST,
                            ae_title: data.accessPoint.ae_title.rdnSequence.map((rdn) => rdnToJson(rdn)),
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
                    requested_time: new Date(),
                },
            });
            return {
                unsigned: new EstablishOperationalBindingResultData(
                    data.bindingType,
                    data.bindingID,
                    ctx.dsa.accessPoint,
                    {
                        roleB_replies: _encode_SubordinateToSuperior(reply, DER),
                    },
                    [],
                    undefined,
                    undefined,
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
                    undefined,
                    undefined,
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
                        undefined,
                        undefined,
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
