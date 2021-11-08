import type { Context } from "@wildboar/meerkat-types";
import type DOPConnection from "../DOPConnection";
import * as errors from "@wildboar/meerkat-types";
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
import { ASN1Element, BERElement, packBits } from "asn1-ts";
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
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SuperiorToSubordinateModification.ta";
import {
    SubordinateToSuperior,
    _decode_SubordinateToSuperior,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SubordinateToSuperior.ta";
import compareDistinguishedName from "@wildboar/x500/src/lib/comparators/compareDistinguishedName";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import { DER } from "asn1-ts/dist/node/functional";
import createSecurityParameters from "../../x500/createSecurityParameters";
import {
    id_err_operationalBindingError,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-err-operationalBindingError.va";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter";
import updateContextPrefix from "../modify/updateContextPrefix";
import updateSubordinate from "../modify/updateSubordinate";

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
    const NAMING_MATCHER = getNamingMatcherGetter(ctx);
    const data: ModifyOperationalBindingArgumentData = getOptionallyProtectedValue(arg);
    // const getApproval = (uuid: string): Promise<boolean> => Promise.race<boolean>([
    //     new Promise<boolean>((resolve) => {
    //         ctx.operationalBindingControlEvents.once(uuid, (approved: boolean) => {
    //             resolve(approved);
    //         });
    //     }),
    //     new Promise<boolean>(resolve => setTimeout(() => resolve(false), 30000)),
    // ]);

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
            ctx.i18n.t("err:no_ob_with_id", {
                id: data.bindingID.identifier,
            }),
            {
                unsigned: new OpBindingErrorParam(
                    OpBindingErrorParam_problem_invalidID,
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
            ctx.i18n.t("err:no_ob_with_id", {
                id: data.bindingID.identifier,
            }),
            {
                unsigned: new OpBindingErrorParam(
                    OpBindingErrorParam_problem_invalidID,
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

    // FIXME: The binding version is a revision number. I got this detail wrong.
    if ((opBinding.binding_version ?? 1) < data.newBindingID.version) {
        // Throw new Error.
    }

    const now = new Date();
    const validFrom: Date = (
        data.valid?.validFrom
        && ("time" in data.valid.validFrom)
        && !(data.valid.validFrom instanceof ASN1Element)
    )
        ? getDateFromOBTime(data.valid.validFrom.time)
        : now;
    const validUntil: Date | null | undefined = (
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
    await ctx.db.operationalBinding.create({
        data: {
            accepted: true, // REVIEW: Automatically-accepted.
            previous: {
                connect: {
                    id: opBinding.id,
                },
            },
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
        const oldAgreement: HierarchicalAgreement = (() => {
            const el = new BERElement();
            el.fromBytes(opBinding.agreement_ber);
            return _decode_HierarchicalAgreement(el);
        })();
        const newAgreement: HierarchicalAgreement = data.newAgreement
            ? _decode_HierarchicalAgreement(data.newAgreement)
            : oldAgreement;

        if (!data.initiator) {
            throw new Error(); // Required for an HOB modification. roleAssignment
        }

        if ("roleA_initiates" in data.initiator) {
            const init: SuperiorToSubordinateModification = _decode_SuperiorToSubordinateModification(data.initiator.roleA_initiates);
            // TODO: Check that the superior did not change Agreement.rdn.
            if (!compareDistinguishedName(
                newAgreement.immediateSuperior,
                init.contextPrefixInfo.map((rdn) => rdn.rdn),
                NAMING_MATCHER,
            )) {
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:hob_contextprefixinfo_did_not_match"),
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
            await updateContextPrefix(ctx, newAgreement, init);
            return {
                null_: null,
            };
        } else if ("roleB_initiates" in data.initiator) {
            const init: SubordinateToSuperior = _decode_SubordinateToSuperior(data.initiator.roleB_initiates);
            await updateSubordinate(ctx, oldAgreement, newAgreement, init);
            return {
                null_: null,
            };
        } else {
            throw new errors.OperationalBindingError(
                ctx.i18n.t("err:unrecognized_ob_initiator_syntax"),
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
    } else {
        throw NOT_SUPPORTED_ERROR;
    }
}

export default modifyOperationalBinding;
