import type { Context } from "../../types";
import type DOPConnection from "../DOPConnection";
import * as errors from "../../errors";
import type {
    ModifyOperationalBindingArgument,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/ModifyOperationalBindingArgument.ta";
import type {
    ModifyOperationalBindingArgumentData,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/ModifyOperationalBindingArgumentData.ta";
import type {
    ModifyOperationalBindingResult,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/ModifyOperationalBindingResult.ta";
import type {
    ModifyOperationalBindingArgumentData_initiator as Initiator,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/ModifyOperationalBindingArgumentData-initiator.ta";
import {
    OpBindingErrorParam,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OpBindingErrorParam.ta";
import {
    OpBindingErrorParam_problem_unsupportedBindingType,
    OpBindingErrorParam_problem_invalidID,
    OpBindingErrorParam_problem_invalidAgreement,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OpBindingErrorParam-problem.ta";
import {
    _decode_PresentationAddress,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/PresentationAddress.ta";
import type {
    Time,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/Time.ta";
import type {
    Code,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import { ASN1Element, BERElement, packBits, DERElement, OBJECT_IDENTIFIER } from "asn1-ts";
import { Knowledge, OperationalBindingInitiator } from "@prisma/client";
import compareSocketToNSAP from "@wildboar/x500/src/lib/distributed/compareSocketToNSAP";
import getDateFromTime from "@wildboar/x500/src/lib/utils/getDateFromTime";
import {
    _encode_CertificationPath,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/CertificationPath.ta";
import rdnToJson from "../../x500/rdnToJson";
import saveAccessPoint from "../../database/saveAccessPoint";
import {
    id_op_binding_hierarchical,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-hierarchical.va";
import {
    HierarchicalAgreement,
    _decode_HierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/HierarchicalAgreement.ta";
import {
    SuperiorToSubordinateModification,
    _decode_SuperiorToSubordinateModification,
    // _encode_SuperiorToSubordinateModification,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SuperiorToSubordinateModification.ta";
// import {
//     SubordinateToSuperior,
//     _decode_SubordinateToSuperior,
//     _encode_SubordinateToSuperior,
// } from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SubordinateToSuperior.ta";
import compareDistinguishedName from "@wildboar/x500/src/lib/comparators/compareDistinguishedName";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";

const DER = () => new DERElement();

function getDateFromOBTime (time: Time): Date {
    if ("utcTime" in time) {
        return time.utcTime;
    } else {
        return time.generalizedTime;
    }
}

function getInitiator (init: Initiator): OperationalBindingInitiator {
    // NOTE: Initiator is not extensible, so this is an exhaustive list.
    if ("symmetric" in init) {
        return OperationalBindingInitiator.SYMMETRIC;
    } else if ("roleA_initiates" in init) {
        return OperationalBindingInitiator.ROLE_A;
    } else  {
        return OperationalBindingInitiator.ROLE_B;
    }
}

function getInitiatorParam (init: Initiator): ASN1Element {
    // NOTE: Initiator is not extensible, so this is an exhaustive list.
    if ("symmetric" in init) {
        return init.symmetric;
    } else if ("roleA_initiates" in init) {
        return init.roleA_initiates;
    } else  {
        return init.roleB_initiates;
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
async function modifyOperationalBinding (
    ctx: Context,
    conn: DOPConnection,
    arg: ModifyOperationalBindingArgument,
): Promise<ModifyOperationalBindingResult> {
    const data: ModifyOperationalBindingArgumentData = getOptionallyProtectedValue(arg);
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
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        },
    );

    /**
     * We first identify all of the access points that correspond to the socket
     * that originated this request. These access points are used to filter out
     * the operational bindings that the remote DSA may modify, terminate, or
     * even know about. (Otherwise, a rogue DSA would be able to modify the
     * operational bindings of other DSAs.)
     */
    const permittedAPs = (await ctx.db.accessPoint.findMany({
        where: {
            knowledge_type: Knowledge.OB_REQUEST,
        },
    }))
        .filter((ap) => {
            const el = new BERElement();
            el.fromBytes(ap.ber);
            // This is a simpler way to get the address out of the AP type.
            const address = el.set.find((component) => (component.tagNumber === 1));
            if (!address) {
                return false;
            }
            const pa = _decode_PresentationAddress(address);
            return pa.nAddresses.some((naddr) => compareSocketToNSAP(conn.idm.s, naddr));
        })
        .map((ap) => ap.id);

    if (permittedAPs.length === 0) {
        throw new errors.OperationalBindingError(
            `No operational binding with identifier ${data.bindingID.identifier}.`,
            {
                unsigned: new OpBindingErrorParam(
                    OpBindingErrorParam_problem_invalidID,
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

    const opBinding = await ctx.db.operationalBinding.findFirst({
        where: {
            binding_identifier: data.bindingID.identifier,
            binding_type: {
                equals: data.bindingType.toString(),
            },
            access_point_id: {
                in: permittedAPs,
            },
        },
    });

    if (!opBinding) {
        throw new errors.OperationalBindingError(
            `No operational binding with identifier ${data.bindingID.identifier}.`,
            {
                unsigned: new OpBindingErrorParam(
                    OpBindingErrorParam_problem_invalidID,
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

    // FIXME: The binding version is a revision number. I got this detail wrong.
    if ((opBinding.binding_version ?? 1) < data.newBindingID.version) {
        // Throw new Error.
    }

    const now = new Date();
    const validFrom = (
        data.valid?.validFrom
        && ("time" in data.valid.validFrom)
        && !(data.valid.validFrom instanceof ASN1Element)
    )
        ? getDateFromOBTime(data.valid.validFrom.time)
        : now;
    const validUntil = (
        data.valid?.validUntil
        && ("time" in data.valid.validUntil)
        && !(data.valid.validUntil instanceof ASN1Element)
    )
        ? getDateFromOBTime(data.valid.validUntil.time)
        : ((
            data.valid?.validUntil
            && ("unchanged" in data.valid.validUntil)
        )
            ? opBinding.terminated_time
            : undefined);

    const createdAccessPoint = data.accessPoint
        ? await saveAccessPoint(ctx, data.accessPoint, Knowledge.OB_REQUEST)
        : undefined;

    const sp = data.securityParameters;
    const created = await ctx.db.operationalBinding.create({
        data: {
            supply_contexts: "", // FIXME: Make this null.
            previous_id: opBinding.id as unknown as undefined, // FIXME: WTF is going on here?
            outbound: false,
            binding_type: data.bindingType.toString(),
            binding_identifier: data.newBindingID.identifier,
            binding_version: data.newBindingID.version,
            agreement_ber: data.newAgreement
                ? Buffer.from(data.newAgreement.toBytes())
                : opBinding.agreement_ber,
            access_point: {
                connect: {
                    id: createdAccessPoint ?? opBinding.id,
                },
            },
            initiator: data.initiator
                ? getInitiator(data.initiator)
                : opBinding.initiator,
            initiator_ber: data.initiator
                ? Buffer.from(getInitiatorParam(data.initiator).toBytes())
                : opBinding.initiator_ber,
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
            // new_context_prefix_rdn: rdnToJson(agreement.rdn),
            // immediate_superior: agreement.immediateSuperior.map((rdn) => rdnToJson(rdn)),
            // TODO: Source
            requested_time: new Date(),
        },
    });

    // TODO: If any RDN in the CP changes, update the corresponding DSE.

    if (data.bindingType.isEqualTo(id_op_binding_hierarchical)) {
        const agreement: HierarchicalAgreement = data.newAgreement
            ? _decode_HierarchicalAgreement(data.newAgreement)
            : (() => {
                const el = new BERElement();
                el.fromBytes(opBinding.agreement_ber);
                return _decode_HierarchicalAgreement(el);
            })();

        if (!data.initiator) {
            throw new Error(); // Required for an HOB modification. roleAssignment
        }

        // If the agreement hasn't changed, there is nothing to do.
        if (!data.newAgreement) {
            return {
                null_: null,
            };
        }

        if ("roleA_initiates" in data.initiator) {
            const init: SuperiorToSubordinateModification = _decode_SuperiorToSubordinateModification(data.initiator.roleA_initiates);
            // TODO: Check that the superior did not change Agreement.rdn.
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
            // Delete context prefix up until and including the CP entry.
            // Create the new context, exactly like before.
            // Reparent subordinate entry.
            // TODO: const reply = await becomeSubordinate(ctx, agreement, init);
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
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                        ),
                    },
                );
            }
            return {
                null_: null,
            };
        } else if ("roleB_initiates" in data.initiator) {
            // TODO: const init: SubordinateToSuperior = _decode_SubordinateToSuperior(data.initiator.roleB_initiates);
            // TODO: const reply = await becomeSuperior(ctx, agreement, init);
            return {
                null_: null,
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

    } else {
        throw NOT_SUPPORTED_ERROR;
    }
    return {
        null_: null,
    };
}

export default modifyOperationalBinding;
