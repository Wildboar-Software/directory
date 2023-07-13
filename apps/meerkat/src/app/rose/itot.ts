import {
    ROSETransport,
    new_rose_transport,
    RejectReason,
    AbortReason,
} from "@wildboar/rose-transport";
import {
    ISOTransportOverTCPStack,
    get_acse_ber_context,
    PresentationConnection,
    dispatch_A_ASCrsp_reject,
    dispatch_P_DTreq,
    dispatch_AARE_reject,
    dispatch_A_RLSrsp_accept,
    dispatch_A_RLSrsp_reject,
} from "@wildboar/osi-net";
import { BER } from "asn1-ts/dist/node/functional";
import {
    INTEGER,
    ObjectIdentifier,
    External,
    OBJECT_IDENTIFIER,
    GeneralString,
    BERElement,
    CERElement,
    DERElement,
    packBits,
    ASN1Element,
} from "asn1-ts";
import type {
    OsiRej_problem,
} from "@wildboar/x500/src/lib/modules/OSIProtocolSpecification/OsiRej-problem.ta";
import {
    AARQ_apdu,
    _encode_AARQ_apdu,
} from '@wildboar/acse/src/lib/modules/ACSE-1/AARQ-apdu.ta';
import {
    AARE_apdu,
    _encode_AARE_apdu,
} from '@wildboar/acse/src/lib/modules/ACSE-1/AARE-apdu.ta';
import {
    RLRQ_apdu,
    _encode_RLRQ_apdu,
} from '@wildboar/acse/src/lib/modules/ACSE-1/RLRQ-apdu.ta';
import {
    Release_response_reason_normal,
    Release_response_reason_not_finished,
    RLRE_apdu,
    _encode_RLRE_apdu,
} from '@wildboar/acse/src/lib/modules/ACSE-1/RLRE-apdu.ta';
import {
    ABRT_apdu,
    _encode_ABRT_apdu,
} from '@wildboar/acse/src/lib/modules/ACSE-1/ABRT-apdu.ta';
import {
    Result_list_Item_provider_reason_abstract_syntax_not_supported,
    Result_list_Item_provider_reason_proposed_transfer_syntaxes_not_supported,
    Result_list_Item_provider_reason_reason_not_specified,
} from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Result-list-Item-provider-reason.ta';
import {
    dispatch_A_ASCreq,
    dispatch_A_ASCrsp_accept,
    dispatch_A_RLSreq,
    dispatch_A_ABRreq,
} from '@wildboar/osi-net';
import { User_data } from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/User-data.ta';
import { PDV_list } from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/PDV-list.ta';
import { Context_list_Item } from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Context-list-Item.ta';
import { Result_list_Item } from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Result-list-Item.ta';
import {
    Result_acceptance,
    Result_provider_rejection,
    Result_user_rejection,
} from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Result.ta';
import {
    id_acseAS,
} from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/id-acseAS.va";
import {
    id_as_directoryAccessAS,
} from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/id-as-directoryAccessAS.va";
import {
    id_as_directorySystemAS,
} from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/id-as-directorySystemAS.va";
import {
    id_as_directoryOperationalBindingManagementAS,
} from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/id-as-directoryOperationalBindingManagementAS.va";
import {
    id_as_directoryShadowAS,
} from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/id-as-directoryShadowAS.va";
import {
    id_ac_directoryAccessAC,
} from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/id-ac-directoryAccessAC.va";
import {
    id_ac_directorySystemAC,
} from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/id-ac-directorySystemAC.va";
import {
    id_ac_directoryOperationalBindingManagementAC,
} from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/id-ac-directoryOperationalBindingManagementAC.va";
import {
    id_ac_shadowConsumerInitiatedAC,
} from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/id-ac-shadowConsumerInitiatedAC.va";
import {
    id_ac_shadowSupplierInitiatedAC,
} from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/id-ac-shadowSupplierInitiatedAC.va";
import {
    id_ac_shadowSupplierInitiatedAsynchronousAC,
} from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/id-ac-shadowSupplierInitiatedAsynchronousAC.va";
import {
    id_ac_shadowConsumerInitiatedAsynchronousAC,
} from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/id-ac-shadowConsumerInitiatedAsynchronousAC.va";
import {
    _decode_TheOsiBind,
    _encode_TheOsiBind,
} from '@wildboar/x500/src/lib/modules/OSIProtocolSpecification/TheOsiBind.ta';
import {
    _decode_TheOsiBindRes,
    _encode_TheOsiBindRes,
} from '@wildboar/x500/src/lib/modules/OSIProtocolSpecification/TheOsiBindRes.ta';
import {
    _decode_TheOsiBindErr,
} from '@wildboar/x500/src/lib/modules/OSIProtocolSpecification/TheOsiBindErr.ta';
import {
    Result_acceptance as ACSEResult_acceptance,
    Result_user_rejection as ACSEResult_user_rejection,
} from '@wildboar/acse/src/lib/modules/ACSE-1/Result.ta';
import {
    OsiDirectoryOperation,
    OsiErr,
    _decode_OsiDirectoryOperation,
    _encode_OsiDirectoryOperation,
} from '@wildboar/x500/src/lib/modules/OSIProtocolSpecification/OsiDirectoryOperation.ta';
import { OsiReq } from '@wildboar/x500/src/lib/modules/OSIProtocolSpecification/OsiReq.ta';
import { OsiRes } from '@wildboar/x500/src/lib/modules/OSIProtocolSpecification/OsiRes.ta';
import { OsiRes_result } from '@wildboar/x500/src/lib/modules/OSIProtocolSpecification/OsiRes-result.ta';
import { OsiRej } from '@wildboar/x500/src/lib/modules/OSIProtocolSpecification/OsiRej.ta';
import {
    GeneralProblem_unrecognizedPDU,
    GeneralProblem_badlyStructuredPDU,
    GeneralProblem_mistypedPDU,
} from '@wildboar/x500/src/lib/modules/OSIProtocolSpecification/GeneralProblem.ta';
import {
    InvokeProblem_duplicateInvocation,
    InvokeProblem_mistypedArgument,
    InvokeProblem_releaseInProgress,
    InvokeProblem_resourceLimitation,
    InvokeProblem_unrecognizedOperation,
} from '@wildboar/x500/src/lib/modules/OSIProtocolSpecification/InvokeProblem.ta';
import {
    ReturnResultProblem_mistypedResult,
    ReturnResultProblem_resultResponseUnexpected,
    ReturnResultProblem_unrecognizedInvocation,
} from '@wildboar/x500/src/lib/modules/OSIProtocolSpecification/ReturnResultProblem.ta';
import {
    ReturnErrorProblem_errorResponseUnexpected,
    ReturnErrorProblem_mistypedParameter,
    ReturnErrorProblem_unexpectedError,
    ReturnErrorProblem_unrecognizedError,
    ReturnErrorProblem_unrecognizedInvocation,
} from '@wildboar/x500/src/lib/modules/OSIProtocolSpecification/ReturnErrorProblem.ta';
import { ABRT_source_acse_service_provider, ABRT_source_acse_service_user } from '@wildboar/acse/src/lib/modules/ACSE-1/ABRT-source.ta';
import {
    ABRT_diagnostic,
    ABRT_diagnostic_no_reason_given,
    ABRT_diagnostic_authentication_failure,
    ABRT_diagnostic_authentication_mechanism_name_not_recognized,
    ABRT_diagnostic_authentication_mechanism_name_required,
    ABRT_diagnostic_authentication_required,
    ABRT_diagnostic_protocol_error,
} from '@wildboar/acse/src/lib/modules/ACSE-1/ABRT-diagnostic.ta';
import type {
    GeneralName,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/GeneralName.ta";
import type {
    AP_title,
} from "@wildboar/acse/src/lib/modules/ACSE-1/AP-title.ta";
import type {
    AE_qualifier,
} from "@wildboar/acse/src/lib/modules/ACSE-1/AE-qualifier.ta";
import {
    Release_request_reason_normal,
} from "@wildboar/acse/src/lib/modules/ACSE-1/Release-request-reason.ta";
import { getRDN } from "@wildboar/x500";
import { IndexableOID } from "@wildboar/meerkat-types";
import {
    Associate_source_diagnostic_acse_service_user_null_,
    Associate_source_diagnostic_acse_service_user_no_reason_given,
    Associate_source_diagnostic_acse_service_user_application_context_name_not_supported,
} from "@wildboar/acse/src/lib/modules/ACSE-1/Associate-source-diagnostic-acse-service-user.ta";
import {
    dap_ip,
} from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dap-ip.oa";
import {
    dsp_ip,
} from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dsp-ip.oa";
import {
    dop_ip,
} from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dop-ip.oa";
import { Provider_reason_reason_not_specified } from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Provider-reason.ta";
import { MeerkatContext } from "../ctx";
// import {
//     disp_ip,
// } from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/disp-ip.oa";
import { getLogInfoFromITOTStack } from "../log/getLogInfoFromITOTStack";
import { _encode_Code } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";

const id_ber = new ObjectIdentifier([2, 1, 1]);
const id_cer = new ObjectIdentifier([2, 1, 2, 0]);
const id_der = new ObjectIdentifier([2, 1, 2, 1]);
const implementation_data: GeneralString = "Meerkat DSA";
const default_reject: OsiRej_problem = {
    general: GeneralProblem_unrecognizedPDU,
};

const supported_contexts: OBJECT_IDENTIFIER[] = [
    id_ac_directoryAccessAC,
    id_ac_directorySystemAC,
    id_ac_directoryOperationalBindingManagementAC,
];

const app_context_to_abstract_syntax_pci: Map<IndexableOID, number> = new Map([
    [ id_ac_directoryAccessAC.toString(), 3 ],
    [ id_ac_directorySystemAC.toString(), 5 ],
    [ id_ac_directoryOperationalBindingManagementAC.toString(), 7 ],
]);

const protocol_id_to_app_context: Map<IndexableOID, OBJECT_IDENTIFIER> = new Map([
    [ dap_ip["&id"]!.toString(), id_ac_directoryAccessAC ],
    [ dsp_ip["&id"]!.toString(), id_ac_directorySystemAC ],
    [ dop_ip["&id"]!.toString(), id_ac_directoryOperationalBindingManagementAC ],
    // [ disp_ip["&id"]!.toString(), ], // I don't know how to map this one...
    [ id_ac_directoryAccessAC.toString(), id_ac_directoryAccessAC ],
    [ id_ac_directorySystemAC.toString(), id_ac_directorySystemAC ],
    [ id_ac_directoryOperationalBindingManagementAC.toString(), id_ac_directoryOperationalBindingManagementAC ],
    [ id_ac_shadowConsumerInitiatedAC.toString(), id_ac_shadowConsumerInitiatedAC ],
    [ id_ac_shadowSupplierInitiatedAC.toString(), id_ac_shadowSupplierInitiatedAC ],
    [ id_ac_shadowSupplierInitiatedAsynchronousAC.toString(), id_ac_shadowSupplierInitiatedAsynchronousAC ],
    [ id_ac_shadowConsumerInitiatedAsynchronousAC.toString(), id_ac_shadowConsumerInitiatedAsynchronousAC ],
]);

const oid_to_codec = new Map<string, (() => typeof BERElement | typeof CERElement | typeof DERElement)>([
    [ id_ber.toString(), () => BERElement ],
    [ id_cer.toString(), () => CERElement ],
    [ id_der.toString(), () => DERElement ],
]);

const rose_reject_to_osi_reject: Map<RejectReason, OsiRej_problem> = new Map([
    [ RejectReason.mistyped_pdu, { general: GeneralProblem_mistypedPDU } ],
    [ RejectReason.duplicate_invoke_id_request, { invoke: InvokeProblem_duplicateInvocation } ],
    [ RejectReason.unsupported_operation_request, { invoke: InvokeProblem_unrecognizedOperation } ],
    [ RejectReason.unknown_operation_request, { invoke: InvokeProblem_unrecognizedOperation } ],
    [ RejectReason.mistyped_argument_request, { invoke: InvokeProblem_mistypedArgument } ],
    [ RejectReason.resource_limitation_request, { invoke: InvokeProblem_resourceLimitation } ],
    [ RejectReason.unknown_invoke_id_result, { returnResult: ReturnResultProblem_unrecognizedInvocation } ],
    [ RejectReason.mistyped_result_request, { returnResult: ReturnResultProblem_mistypedResult } ],
    [ RejectReason.unknown_invoke_id_error, { returnError: ReturnErrorProblem_unrecognizedInvocation } ],
    [ RejectReason.unknown_error, { returnError: ReturnErrorProblem_unrecognizedError } ],
    [ RejectReason.mistyped_parameter_error, { returnError: ReturnErrorProblem_mistypedParameter } ],
]);


const osi_abort_to_rose_abort: Map<ABRT_diagnostic, AbortReason> = new Map([
    [ ABRT_diagnostic_no_reason_given, AbortReason.reason_not_specified ],
    [ ABRT_diagnostic_authentication_failure, AbortReason.authentication_failure ],
    [
        ABRT_diagnostic_authentication_mechanism_name_not_recognized,
        AbortReason.authentication_mechanism_name_not_recognized,
    ],
    [
        ABRT_diagnostic_authentication_mechanism_name_required,
        AbortReason.authentication_mechanism_name_required,
    ],
    [ ABRT_diagnostic_authentication_required, AbortReason.authentication_required ],
    [ ABRT_diagnostic_protocol_error, AbortReason.protocol_error ],
]);

const rose_abort_to_osi_abort: Map<AbortReason, ABRT_diagnostic> = new Map([
    [ AbortReason.reason_not_specified, ABRT_diagnostic_no_reason_given ],
    [ AbortReason.authentication_failure, ABRT_diagnostic_authentication_failure ],
    [ AbortReason.authentication_mechanism_name_not_recognized, ABRT_diagnostic_authentication_mechanism_name_not_recognized ],
    [ AbortReason.authentication_mechanism_name_required, ABRT_diagnostic_authentication_mechanism_name_required ],
    [ AbortReason.authentication_required, ABRT_diagnostic_authentication_required ],
    [ AbortReason.protocol_error, ABRT_diagnostic_protocol_error ],
]);

const app_context_to_abstract_syntax: Map<IndexableOID, OBJECT_IDENTIFIER> = new Map([
    [ id_ac_directoryAccessAC.toString(), id_as_directoryAccessAS ],
    [ id_ac_directorySystemAC.toString(), id_as_directorySystemAS ],
    [
        id_ac_directoryOperationalBindingManagementAC.toString(),
        id_as_directoryOperationalBindingManagementAS,
    ],
    [ id_ac_shadowConsumerInitiatedAC.toString(), id_as_directoryShadowAS ],
    [ id_ac_shadowSupplierInitiatedAC.toString(), id_as_directoryShadowAS ],
    [ id_ac_shadowSupplierInitiatedAsynchronousAC.toString(), id_as_directoryShadowAS ],
    [ id_ac_shadowConsumerInitiatedAsynchronousAC.toString(), id_as_directoryShadowAS ],
]);

function get_pc (
    itot: ISOTransportOverTCPStack,
    rose: ROSETransport,
    from_bind: boolean = false
): Context_list_Item | undefined {
    if (!rose.protocol) {
        return;
    }
    const abstract_syntax = app_context_to_abstract_syntax.get(rose.protocol.toString());
    if (!abstract_syntax) {
        return;
    }
    const contexts = from_bind
        ? itot
            .presentation
            .contextSets
            .proposed_for_addition_initiated_remotely
            .map(([c]) => c)
        : Array.from(itot
            .presentation
            .contextSets
            .dcs_agreed_during_connection_establishment
            .values());
    return contexts
        .find((dc) => (
            dc.abstract_syntax_name.isEqualTo(abstract_syntax)
            && dc.transfer_syntax_name_list.some((ts) => ts.isEqualTo(id_ber))
        ));
}

export function get_ber_context_by_abstract_syntax (
    c: PresentationConnection,
    a: OBJECT_IDENTIFIER,
): Context_list_Item | undefined {
    return [
            ...Array.from(c.contextSets.dcs_agreed_during_connection_establishment.values()),
            ...c.contextSets.proposed_for_addition_initiated_locally,
            ...c.contextSets.proposed_for_addition_initiated_remotely.map((x) => x[0]),
        ].find(
            (ctx) =>
                ctx.abstract_syntax_name.isEqualTo(a) &&
                ctx.transfer_syntax_name_list.some((t) => t.isEqualTo(id_ber))
        );
        // /*
        //     ITU Recommendation X.519 (2019) requires there to be a context list
        //     provided in the ARU PPDU. (This might be a requirement in the X.200
        //     series as well, but I haven't seen it.) And this context list is
        //     expected to contain ACSE-BER. In this implementation, if such a
        //     context was never defined, we produce a random new context to at
        //     least communicate the application context and transfer syntax, which
        //     deviates from the specifications. It is the hope of this
        //     implementation that hosts will not allocate PCIs in the range
        //     of 5000-5247, so these can be used for this ad-hoc contexts.
        // */
        // ?? new Context_list_Item(randomInt(5000, 5247), id_acse, [id_ber]);
}

// const osi_reject_to_rose_reject: Map<string, RejectReason> = new Map([
//     [ "0.1", RejectReason.mistyped_pdu ],
//     [ "1.0", RejectReason.duplicate_invoke_id_request ],
//     [ "1.1", RejectReason.unsupported_operation_request ],
//     [ "1.1", RejectReason.unknown_operation_request ],
//     [ "1.2", RejectReason.mistyped_argument_request ],
//     [ "1.3", RejectReason.resource_limitation_request ],
//     [ "2.0", RejectReason.unknown_invoke_id_result ],
//     [ "2.2", RejectReason.mistyped_result_request ],
//     [ "3.0", RejectReason.unknown_invoke_id_error ],
//     [ "3.2", RejectReason.unknown_error ],
//     [ "3.4", RejectReason.mistyped_parameter_error ],
// ]);

function osi_reject_to_rose_reject (rej: OsiRej_problem): RejectReason | undefined {
    if ("general" in rej) {
        switch (rej.general) {
            case GeneralProblem_unrecognizedPDU: return RejectReason.unrecognized_pdu;
            case GeneralProblem_mistypedPDU: return RejectReason.mistyped_pdu;
            case GeneralProblem_badlyStructuredPDU: return RejectReason.badly_structured_pdu;
            default: return undefined;
        }
    }
    else if ("invoke" in rej) {
        switch (rej.invoke) {
            case InvokeProblem_duplicateInvocation: return RejectReason.duplicate_invoke_id_request;
            case InvokeProblem_unrecognizedOperation: return RejectReason.unknown_operation_request;
            case InvokeProblem_mistypedArgument: return RejectReason.mistyped_argument_request;
            case InvokeProblem_resourceLimitation: return RejectReason.resource_limitation_request;
            case InvokeProblem_releaseInProgress: return RejectReason.release_in_progress;
            default: return undefined;
        }
    }
    else if ("returnResult" in rej) {
        switch (rej.returnResult) {
            case ReturnResultProblem_unrecognizedInvocation: return RejectReason.unknown_invoke_id_result;
            case ReturnResultProblem_resultResponseUnexpected: return RejectReason.other;
            case ReturnResultProblem_mistypedResult: return RejectReason.mistyped_result_request;
            default: return undefined;
        }
    }
    else if ("returnError" in rej) {
        switch (rej.returnError) {
            case ReturnErrorProblem_unrecognizedInvocation: return RejectReason.unknown_invoke_id_error;
            case ReturnErrorProblem_errorResponseUnexpected: return RejectReason.other;
            case ReturnErrorProblem_unrecognizedError: return RejectReason.unknown_error;
            case ReturnErrorProblem_unexpectedError: return RejectReason.other;
            case ReturnErrorProblem_mistypedParameter: return RejectReason.mistyped_parameter_error;
            default: return undefined;
        }
    }
    else {
        return undefined;
    }
}

function break_down_ae_title (aet?: GeneralName): [ AP_title | undefined, AE_qualifier | undefined ] {
    if (!aet) {
        return [ undefined, undefined ];
    }
    if ("directoryName" in aet) {
        if (aet.directoryName.rdnSequence.length <= 1) {
            // It's not clear which is the qualifier when there are 0 or 1 RDNs.
            return [ undefined, undefined ];
        }
        const rdn = getRDN(aet.directoryName.rdnSequence);
        const prefix = aet.directoryName.rdnSequence.slice(0, -1);
        return [
            {
                ap_title_form1: {
                    rdnSequence: prefix,
                },
            },
            {
                aso_qualifier_form1: rdn!,
            },
        ];
    }
    else if ("registeredID" in aet) {
        const len = aet.registeredID._nodes.length;
        if (len <= 2) {
            // OIDs must be at least two nodes, so we cannot break it down
            // further if it is 2 nodes or fewer.
            return [ undefined, undefined ];
        }
        const last_arc = aet.registeredID._nodes[len - 1];
        const prefix = aet.registeredID._nodes.slice(0, -1);
        return [
            {
                ap_title_form2: new ObjectIdentifier(prefix),
            },
            {
                aso_qualifier_form2: last_arc,
            },
        ];
    }
    else if ("rfc822Name" in aet) {
        return [
            {
                ap_title_form3: aet.rfc822Name,
            },
            undefined,
        ];
    }
    else if ("dNSName" in aet) {
        return [
            {
                ap_title_form3: aet.dNSName,
            },
            undefined,
        ];
    }
    else if ("uniformResourceIdentifier" in aet) {
        return [
            {
                ap_title_form3: aet.uniformResourceIdentifier,
            },
            undefined,
        ];
    }
    else {
        return [ undefined, undefined ];
    }
}

// AP-title-form1 ::= Name
// ASO-qualifier-form1 ::= RelativeDistinguishedName
// AP-title-form2 ::= OBJECT IDENTIFIER
// ASO-qualifier-form2 ::= INTEGER
// AP-title-form3 ::= PrintableString
// ASO-qualifier-form3 ::= PrintableString
// AP-title-form4 ::= [0] IMPLICIT RELATIVE-OID
// ASO-qualifier-form4 ::= [0] IMPLICIT RELATIVE-OID

function merge_ap_and_ae (ap?: AP_title, ae?: AE_qualifier): GeneralName | null {
    if (!ap) {
        return null;
    }
    if ("ap_title_form1" in ap) {
        if (ae) {
            if ("aso_qualifier_form1" in ae) {
                return {
                    directoryName: {
                        rdnSequence: [
                            ...ap.ap_title_form1.rdnSequence,
                            ae.aso_qualifier_form1,
                        ],
                    },
                };
            } else {
                return null;
            }
        } else {
            return {
                directoryName: ap.ap_title_form1,
            };
        }
    }
    else if ("ap_title_form2" in ap) {
        if (ae) {
            if ("aso_qualifier_form2" in ae) {
                const arc = Number(ae.aso_qualifier_form2);
                if (!Number.isSafeInteger(arc) || (arc < 0)) {
                    return null;
                }
                const oid = new ObjectIdentifier([ arc ], ap.ap_title_form2);
                return {
                    registeredID: oid,
                };
            }
            if ("aso_qualifier_form4" in ae) {
                const oid = new ObjectIdentifier(ae.aso_qualifier_form4, ap.ap_title_form2);
                return {
                    registeredID: oid,
                };
            }
            else {
                return null;
            }
        } else {
            return {
                registeredID: ap.ap_title_form2,
            };
        }
    }
    else {
        return null;
    }
}

function handle_osi_operation (rose: ROSETransport, op: OsiDirectoryOperation): void {
    if ("request" in op) {
        rose.events.emit("request", {
            code: op.request.opcode,
            invoke_id: op.request.invokeId,
            parameter: op.request.argument,
        });
    }
    else if ("result" in op) {
        rose.events.emit("result", {
            code: op.result.result.opcode,
            invoke_id: op.result.invokeId,
            parameter: op.result.result.result,
        });
    }
    else if ("error" in op) {
        rose.events.emit("error_", {
            code: op.error.errcode,
            invoke_id: op.error.invokeID,
            parameter: op.error.error,
        });
    }
    else if ("reject" in op) {
        rose.events.emit("reject", {
            invoke_id: op.reject.invokeId,
            problem: osi_reject_to_rose_reject(op.reject.problem) ?? RejectReason.other,
        });
    }
    else {
        rose.write_abort(AbortReason.protocol_error);
    }
}

function abort (itot: ISOTransportOverTCPStack) {
    const abrt = new ABRT_apdu(
        ABRT_source_acse_service_provider,
        ABRT_diagnostic_protocol_error,
        undefined,
        undefined,
        [],
        undefined,
    );
    dispatch_A_ABRreq(itot.acse, abrt);
}

function asn1_value_from_external (
    itot: ISOTransportOverTCPStack,
    ext: External,
    from_bind: boolean = false, // Before P-CONNECT response, there are no established contexts.
): ASN1Element | null {
    if (ext.indirectReference === undefined) {
        return null;
    }
    const contexts = from_bind
        ? new Map(itot
            .presentation
            .contextSets
            .proposed_for_addition_initiated_remotely
            .map(([ c ]) => [ c.presentation_context_identifier.toString(), c ]))
        : itot
            .presentation
            .contextSets
            .dcs_agreed_during_connection_establishment;
    const pc = contexts.get(ext.indirectReference.toString());
    if (!pc) {
        return null;
    }
    const ts = pc.transfer_syntax_name_list[0];
    if (
        ext.directReference
        && !ts?.isEqualTo(ext.directReference)
    ) {
        return null;
    }
    if (ext.encoding instanceof ASN1Element) {
        return ext.encoding;
    }
    const codec = oid_to_codec.get(ts.toString());
    if (!codec) {
        return null;
    }
    const el = new (codec())();
    const bytes = (ext.encoding instanceof Uint8Array)
        ? ext.encoding
        : packBits(ext.encoding);
    el.fromBytes(bytes);
    return el;
}

export
function rose_transport_from_itot_stack (
    ctx: MeerkatContext,
    itot: ISOTransportOverTCPStack,
): ROSETransport {
    const peer: string = `itot://${itot.network.socket.remoteAddress}:${itot.network.socket.remotePort}`;
    const rose = new_rose_transport(itot.network.socket);
    itot.acse.outgoingEvents.on('AARQ', (apdu) => {
        itot.acse.presentation.request_P_CONNECT({
            presentation_context_definition_list: [
                new Context_list_Item(1, id_acseAS, [id_ber]),
                new Context_list_Item(3, id_as_directoryAccessAS, [id_ber]),
                new Context_list_Item(5, id_as_directorySystemAS, [id_ber]),
                new Context_list_Item(7, id_as_directoryOperationalBindingManagementAS, [id_ber]),
            ],
            user_data: {
                fully_encoded_data: [
                    new PDV_list(id_ber, 1, {
                        single_ASN1_type: _encode_AARQ_apdu(apdu, BER),
                    }),
                ],
            },
        });
    });
    itot.acse.outgoingEvents.on('AARE+', (apdu) => {
        const acse_ber_context = get_acse_ber_context(itot.presentation);
        itot.acse.presentation.respond_P_CONNECT({
            presentation_context_definition_result_list:
                itot.presentation.contextSets.proposed_for_addition_initiated_remotely.map(
                    (c): Result_list_Item => {
                        let result: INTEGER = Result_acceptance;
                        let reason: INTEGER | undefined;
                        if (c[1] !== Result_acceptance) {
                            result = Result_provider_rejection;
                            reason =
                                Result_list_Item_provider_reason_reason_not_specified;
                        } else if (!c[0].transfer_syntax_name_list.some((ts) => ts.isEqualTo(id_ber))) {
                            // BER must be supported for directory services.
                            result = Result_user_rejection;
                            reason =
                                Result_list_Item_provider_reason_proposed_transfer_syntaxes_not_supported;
                        } else if (
                            ![
                                id_acseAS,
                                id_as_directoryAccessAS,
                                id_as_directorySystemAS,
                                id_as_directoryOperationalBindingManagementAS,
                            ].some((abs) => abs.isEqualTo(c[0].abstract_syntax_name))
                        ) {
                            result = Result_user_rejection;
                            reason = Result_list_Item_provider_reason_abstract_syntax_not_supported;
                        }
                        return new Result_list_Item(result, id_ber, reason);
                    }
                ),
            user_data: {
                fully_encoded_data: [
                    new PDV_list(
                        id_ber,
                        acse_ber_context.presentation_context_identifier,
                        {
                            single_ASN1_type: _encode_AARE_apdu(apdu, BER),
                        }
                    ),
                ],
            },
        });
    });
    itot.acse.outgoingEvents.on('AARE-', (apdu) => {
        const logInfo = getLogInfoFromITOTStack(itot);
        ctx.log.warn(ctx.i18n.t("log:acse_aare_reject", {
            appcontext: apdu.aSO_context_name.toString(),
            result: apdu.result,
            diag: ("acse_service_user" in apdu.result_source_diagnostic)
                ? `USER:${apdu.result_source_diagnostic.acse_service_user.toString()}`
                : `PROVIDER:${apdu.result_source_diagnostic.acse_service_provider.toString()}`,
            peer,
        }), logInfo);
        const acse_ber_context = get_acse_ber_context(itot.presentation);
        itot.acse.presentation.respond_P_CONNECT({
            provider_reason: Provider_reason_reason_not_specified,
            user_data: {
                fully_encoded_data: [
                    new PDV_list(
                        id_ber,
                        acse_ber_context.presentation_context_identifier,
                        {
                            single_ASN1_type: _encode_AARE_apdu(apdu, BER),
                        }
                    ),
                ],
            },
        });
    });
    itot.acse.outgoingEvents.on('ABRT', (apdu) => {
        const logInfo = getLogInfoFromITOTStack(itot);
        ctx.log.warn(ctx.i18n.t("log:acse_abrt", {
            source: apdu.abort_source.toString(),
            diag: apdu.abort_diagnostic?.toString() ?? "1", // 1 = no-reason-given.
            asoiid: apdu.asoi_identifier?.toString(),
            peer,
        }), logInfo);
        const acse_ber_context = get_acse_ber_context(itot.presentation);
        itot.acse.presentation.request_P_U_ABORT({
            user_data: {
                fully_encoded_data: [
                    new PDV_list(
                        id_ber,
                        acse_ber_context.presentation_context_identifier,
                        {
                            single_ASN1_type: _encode_ABRT_apdu(apdu, BER),
                        }
                    ),
                ],
            },
        });
    });
    itot.acse.outgoingEvents.on('RLRQ', (apdu) => {
        const acse_ber_context = get_acse_ber_context(itot.presentation);
        itot.acse.presentation.request_P_RELEASE({
            user_data: {
                fully_encoded_data: [
                    new PDV_list(
                        id_ber,
                        acse_ber_context.presentation_context_identifier,
                        {
                            single_ASN1_type: _encode_RLRQ_apdu(apdu, BER),
                        }
                    ),
                ],
            },
        });
    });
    itot.acse.outgoingEvents.on('RLRE+', (apdu) => {
        const acse_ber_context = get_acse_ber_context(itot.presentation);
        itot.acse.presentation.respond_P_RELEASE({
            user_data: {
                fully_encoded_data: [
                    new PDV_list(
                        id_ber,
                        acse_ber_context.presentation_context_identifier,
                        {
                            single_ASN1_type: _encode_RLRE_apdu(apdu, BER),
                        }
                    ),
                ],
            },
        });
    });
    itot.acse.outgoingEvents.on('RLRE-', (apdu) => {
        const logInfo = getLogInfoFromITOTStack(itot);
        ctx.log.warn(ctx.i18n.t("log:acse_rlre_reject", {
            reason: apdu.reason?.toString(),
            asoiid: apdu.asoi_identifier?.toString(),
            peer,
        }), logInfo);
        const acse_ber_context = get_acse_ber_context(itot.presentation);
        itot.acse.presentation.respond_P_RELEASE({
            reject: true,
            user_data: {
                fully_encoded_data: [
                    new PDV_list(
                        id_ber,
                        acse_ber_context.presentation_context_identifier,
                        {
                            single_ASN1_type: _encode_RLRE_apdu(apdu, BER),
                        }
                    ),
                ],
            },
        });
    });

    itot.acse.outgoingEvents.on("A-ASCind", (apdu) => {
        if (!supported_contexts.some((sc) => sc.isEqualTo(apdu.aSO_context_name))) {
            const logInfo = getLogInfoFromITOTStack(itot);
            ctx.log.warn(ctx.i18n.t("log:acse_unsupported_context", {
                appcontext: apdu.aSO_context_name.toString(),
                peer,
            }), logInfo);
            const aare = new AARE_apdu(
                undefined,
                apdu.aSO_context_name,
                ACSEResult_user_rejection,
                {
                    acse_service_user: Associate_source_diagnostic_acse_service_user_application_context_name_not_supported,
                },
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                implementation_data,
                undefined,
                undefined,
                undefined,
                [],
                undefined,
            );
            dispatch_AARE_reject(itot.acse, aare);
            return;
        }
        if (apdu.user_information?.length !== 1) {
            const logInfo = getLogInfoFromITOTStack(itot);
            ctx.log.warn(ctx.i18n.t("log:acse_not_one_user_info", { peer }), logInfo);
            abort(itot);
            return;
        }
        const external = apdu.user_information[0];
        const value = asn1_value_from_external(itot, external, true);
        if (!value) {
            const logInfo = getLogInfoFromITOTStack(itot);
            ctx.log.warn(ctx.i18n.t("log:acse_no_acse_user_data", { peer }), logInfo);
            abort(itot);
            return;
        }
        const bind = _decode_TheOsiBind(value);
        const called_aet = merge_ap_and_ae(apdu.called_AP_title, apdu.called_AE_qualifier);
        const calling_aet = merge_ap_and_ae(apdu.calling_AP_title, apdu.calling_AE_qualifier);
        rose.events.emit("bind", {
            parameter: bind,
            protocol_id: apdu.aSO_context_name,
            called_ae_title: called_aet ?? undefined,
            calling_ae_title: calling_aet ?? undefined,
            called_ap_invocation_identifier: apdu.called_AP_invocation_identifier,
            called_ae_invocation_identifier: apdu.called_AE_invocation_identifier,
            calling_ap_invocation_identifier: apdu.calling_AP_invocation_identifier,
            calling_ae_invocation_identifier: apdu.called_AE_invocation_identifier,
            implementation_information: apdu.implementation_information,
        });
    });

    itot.acse.outgoingEvents.on("A-ASCcnf+", (apdu) => {
        if (apdu.user_information?.length !== 1) {
            const logInfo = getLogInfoFromITOTStack(itot);
            ctx.log.warn(ctx.i18n.t("log:acse_not_one_user_info", { peer }), logInfo);
            abort(itot);
            return;
        }
        const external = apdu.user_information[0];
        const value = asn1_value_from_external(itot, external);
        if (!value) {
            const logInfo = getLogInfoFromITOTStack(itot);
            ctx.log.warn(ctx.i18n.t("log:acse_no_acse_user_data", { peer }), logInfo);
            abort(itot);
            return;
        }
        const bind = _decode_TheOsiBindRes(value);
        const raet = merge_ap_and_ae(apdu.responding_AP_title, apdu.responding_AE_qualifier);
        rose.events.emit("bind_result", {
            parameter: bind,
            protocol_id: apdu.aSO_context_name,
            responding_ae_title: raet ?? undefined,
            responding_ap_invocation_identifier: apdu.responding_AP_invocation_identifier,
            responding_ae_invocation_identifier: apdu.responding_AE_invocation_identifier,
        });
    });

    itot.acse.outgoingEvents.on("A-ASCcnf-", (apdu) => {
        if (!apdu) {
            // TODO: I don't know what to do here. This can happen in a
            // presentation abort.
            return;
        }
        if (apdu.user_information?.length !== 1) {
            const logInfo = getLogInfoFromITOTStack(itot);
            ctx.log.warn(ctx.i18n.t("log:acse_not_one_user_info", { peer }), logInfo);
            abort(itot);
            return;
        }
        const external = apdu.user_information[0];
        const value = asn1_value_from_external(itot, external);
        if (!value) {
            const logInfo = getLogInfoFromITOTStack(itot);
            ctx.log.warn(ctx.i18n.t("log:acse_no_acse_user_data", { peer }), logInfo);
            abort(itot);
            return;
        }
        const bind = _decode_TheOsiBindErr(value);
        const raet = merge_ap_and_ae(apdu.responding_AP_title, apdu.responding_AE_qualifier);
        rose.events.emit("bind_error", {
            parameter: bind,
            protocol_id: apdu?.aSO_context_name,
            responding_ae_title: raet ?? undefined,
            responding_ap_invocation_identifier: apdu.responding_AP_invocation_identifier,
            responding_ae_invocation_identifier: apdu.responding_AE_invocation_identifier,
        });
    });

    itot.acse.outgoingEvents.on("A-RLSind", () => {
        rose.events.emit("unbind");
    });

    itot.acse.outgoingEvents.on("A-RLScnf+", () => {
        rose.events.emit("unbind_result");
    });

    itot.acse.outgoingEvents.on("A-RLScnf-", () => {
        rose.events.emit("unbind_error");
    });

    itot.acse.outgoingEvents.on("A-ABRind", (apdu) => {
        const reason = apdu.abort_diagnostic
            ? osi_abort_to_rose_abort.get(apdu.abort_diagnostic)
                ?? AbortReason.other
            : AbortReason.reason_not_specified;
        rose.events.emit("abort", reason);
    });

    itot.acse.outgoingEvents.on("P-PABind", () => {
        const logInfo = getLogInfoFromITOTStack(itot);
        ctx.log.warn(ctx.i18n.t("log:presentation_abort", { peer }), logInfo);
        rose.events.emit("abort", AbortReason.other);
    });

    itot.presentation.outgoingEvents.on("P-DTind", (ppdu) => {
        if ("simply_encoded_data" in ppdu) {
            const default_context = itot.presentation.cp?.normal_mode_parameters?.default_context_name;
            if (!default_context) {
                const logInfo = getLogInfoFromITOTStack(itot);
                ctx.log.warn(ctx.i18n.t("log:osi_net_no_default_context_with_simply_encoded_data", { peer }), logInfo);
                abort(itot);
                return;
            }
            const codec = oid_to_codec.get(default_context.transfer_syntax_name.toString());
            if (!codec) {
                const logInfo = getLogInfoFromITOTStack(itot);
                ctx.log.warn(ctx.i18n.t("log:osi_presentation_transfer_syntax_not_supported", {
                    peer,
                    ts: default_context.transfer_syntax_name.toString(),
                }), logInfo);
                abort(itot);
                return;
            }
            const el = new (codec())();
            el.fromBytes(ppdu.simply_encoded_data);
            const op = _decode_OsiDirectoryOperation(el);
            handle_osi_operation(rose, op);
        } else if ("fully_encoded_data" in ppdu) {
            for (const pdv of ppdu.fully_encoded_data) {
                const pc = itot
                    .presentation
                    .contextSets
                    .dcs_agreed_during_connection_establishment
                    .get(pdv.presentation_context_identifier.toString());
                if (!pc) {
                    const logInfo = getLogInfoFromITOTStack(itot);
                    ctx.log.warn(ctx.i18n.t("log:osi_presentation_context_undefined", {
                        peer,
                        pci: pdv.presentation_context_identifier.toString(),
                    }), logInfo);
                    abort(itot);
                    return;
                }
                if (pc.transfer_syntax_name_list.length !== 1) {
                    const logInfo = getLogInfoFromITOTStack(itot);
                    ctx.log.warn(ctx.i18n.t("log:osi_pdv_multiple_transfer_syntaxes", { peer }), logInfo);
                    abort(itot);
                    return;
                }
                const transfer_syntax = pc.transfer_syntax_name_list[0];
                if ("single_ASN1_type" in pdv.presentation_data_values) {
                    const op = _decode_OsiDirectoryOperation(pdv.presentation_data_values.single_ASN1_type);
                    handle_osi_operation(rose, op);
                }
                else if ("octet_aligned" in pdv.presentation_data_values) {
                    const codec = oid_to_codec.get(transfer_syntax.toString());
                    if (!codec) {
                        const logInfo = getLogInfoFromITOTStack(itot);
                        ctx.log.warn(ctx.i18n.t("log:osi_presentation_transfer_syntax_not_supported", {
                            peer,
                            ts: transfer_syntax.toString(),
                        }), logInfo);
                        abort(itot);
                        return;
                    }
                    const el = new (codec())();
                    el.fromBytes(pdv.presentation_data_values.octet_aligned);
                    const op = _decode_OsiDirectoryOperation(el);
                    handle_osi_operation(rose, op);
                }
                else if ("arbitrary" in pdv.presentation_data_values) {
                    if (pdv.presentation_data_values.arbitrary.length % 8) {
                        const logInfo = getLogInfoFromITOTStack(itot);
                        ctx.log.warn(ctx.i18n.t("log:osi_presentation_transfer_syntax_not_supported", {
                            peer,
                            ts: transfer_syntax.toString(),
                        }), logInfo);
                        abort(itot);
                        return;
                    }
                    const bytes = packBits(pdv.presentation_data_values.arbitrary);
                    const codec = oid_to_codec.get(transfer_syntax.toString());
                    if (!codec) {
                        const logInfo = getLogInfoFromITOTStack(itot);
                        ctx.log.warn(ctx.i18n.t("log:osi_presentation_transfer_syntax_not_supported", {
                            peer,
                            ts: transfer_syntax.toString(),
                        }), logInfo);
                        abort(itot);
                        return;
                    }
                    const el = new (codec())();
                    el.fromBytes(bytes);
                    const op = _decode_OsiDirectoryOperation(el);
                    handle_osi_operation(rose, op);
                }
                else {
                    const logInfo = getLogInfoFromITOTStack(itot);
                    ctx.log.warn(ctx.i18n.t("log:osi_presentation_transfer_syntax_not_supported", {
                        peer,
                        ts: transfer_syntax.toString(),
                    }), logInfo);
                    abort(itot);
                    return;
                }
            }
        } else {
            const logInfo = getLogInfoFromITOTStack(itot);
            ctx.log.warn(ctx.i18n.t("log:unrecognized_osi_presentation_user_data_format", {
                peer,
            }), logInfo);
            abort(itot);
            return;
        }
    });

    rose.write_bind = (params) => {
        rose.protocol = protocol_id_to_app_context.get(params.protocol_id.toString())
            ?? params.protocol_id;
        // This is needed because we haven't established presentation contexts
        // yet, so we have to get the PCI that we _will_ define.
        const pci = app_context_to_abstract_syntax_pci.get(params.protocol_id.toString());
        if (!pci) {
            const logInfo = getLogInfoFromITOTStack(itot);
            ctx.log.error(ctx.i18n.t("log:osi_net_no_pci", {
                context: "bind",
                peer,
                appcontext: params.protocol_id.toString(),
            }), logInfo);
            return;
        }
        const [ called_apt, called_aeq ] = break_down_ae_title(params.called_ae_title);
        const [ calling_apt, calling_aeq ] = break_down_ae_title(params.calling_ae_title);
        const aarq: AARQ_apdu = new AARQ_apdu(
            undefined,
            rose.protocol,
            called_apt,
            called_aeq,
            params.called_ap_invocation_identifier,
            params.called_ae_invocation_identifier,
            calling_apt,
            calling_aeq,
            params.calling_ap_invocation_identifier,
            params.calling_ae_invocation_identifier,
            undefined,
            undefined,
            undefined,
            undefined,
            implementation_data,
            undefined,
            undefined,
            undefined,
            [],
            [
                new External(
                    id_ber,
                    pci,
                    undefined,
                    _encode_TheOsiBind(
                        params.parameter,
                        BER
                    ),
                ),
            ]
        );
        dispatch_A_ASCreq(itot.acse, aarq);
    };

    rose.write_bind_result = (params) => {
        rose.is_bound = true;
        rose.protocol = protocol_id_to_app_context.get(params.protocol_id.toString())
            ?? params.protocol_id;
        const pc = get_pc(itot, rose, true);
        if (!pc) {
            const logInfo = getLogInfoFromITOTStack(itot);
            ctx.log.error(ctx.i18n.t("log:osi_net_no_pci", {
                context: "bind_result",
                peer,
                appcontext: params.protocol_id.toString(),
            }), logInfo);
            return;
        }
        const [ rapt, raeq ] = break_down_ae_title(params.responding_ae_title);
        const aare: AARE_apdu = new AARE_apdu(
            undefined,
            rose.protocol,
            ACSEResult_acceptance,
            {
                acse_service_user: Associate_source_diagnostic_acse_service_user_null_,
            },
            rapt,
            raeq,
            params.responding_ap_invocation_identifier,
            params.responding_ae_invocation_identifier,
            undefined,
            undefined,
            undefined,
            undefined,
            implementation_data,
            undefined,
            undefined,
            undefined,
            [],
            [
                new External(
                    id_ber,
                    pc.presentation_context_identifier,
                    undefined,
                    _encode_TheOsiBindRes(
                        params.parameter,
                        BER
                    )
                ),
            ]
        );
        dispatch_A_ASCrsp_accept(itot.acse, aare);
    };

    rose.write_bind_error = (params) => {
        rose.is_bound = false;
        rose.protocol = protocol_id_to_app_context.get(params.protocol_id.toString())
            ?? params.protocol_id;
        const pc = get_pc(itot, rose, true);
        if (!pc) {
            const logInfo = getLogInfoFromITOTStack(itot);
            ctx.log.error(ctx.i18n.t("log:osi_net_no_pci", {
                context: "bind_error",
                peer,
                appcontext: params.protocol_id.toString(),
            }), logInfo);
            return;
        }
        const [ rapt, raeq ] = break_down_ae_title(params.responding_ae_title);
        const aare: AARE_apdu = new AARE_apdu(
            undefined,
            rose.protocol,
            ACSEResult_user_rejection,
            {
                acse_service_user: Associate_source_diagnostic_acse_service_user_no_reason_given,
            },
            rapt,
            raeq,
            params.responding_ap_invocation_identifier,
            params.responding_ae_invocation_identifier,
            undefined,
            undefined,
            undefined,
            undefined,
            implementation_data,
            undefined,
            undefined,
            undefined,
            [],
            [
                new External(
                    id_ber,
                    pc.presentation_context_identifier,
                    undefined,
                    _encode_TheOsiBindRes(
                        params.parameter,
                        BER,
                    ),
                ),
            ]
        );
        dispatch_A_ASCrsp_reject(itot.acse, aare);
    };

    rose.write_request = (params) => {
        const pc = get_pc(itot, rose);
        if (!pc) {
            const logInfo = getLogInfoFromITOTStack(itot);
            ctx.log.error(ctx.i18n.t("log:osi_net_no_pci", {
                context: "op",
                peer,
                appcontext: rose.protocol?.toString(),
            }), logInfo);
            return;
        }
        const user_data: User_data = {
            fully_encoded_data: [
                new PDV_list(
                    undefined,
                    pc.presentation_context_identifier,
                    {
                        single_ASN1_type: _encode_OsiDirectoryOperation(
                            {
                                request: new OsiReq(
                                    params.invoke_id,
                                    params.code,
                                    params.parameter,
                                ),
                            },
                            BER,
                        ),
                    },
                ),
            ],
        };
        dispatch_P_DTreq(itot.presentation, user_data);
    };

    rose.write_result = (params) => {
        const pc = get_pc(itot, rose);
        if (!pc) {
            const logInfo = getLogInfoFromITOTStack(itot);
            ctx.log.error(ctx.i18n.t("log:osi_net_no_pci", {
                context: "op",
                peer,
                appcontext: rose.protocol?.toString(),
            }), logInfo);
            return;
        }
        const user_data: User_data = {
            fully_encoded_data: [
                new PDV_list(
                    undefined,
                    pc.presentation_context_identifier,
                    {
                        single_ASN1_type: _encode_OsiDirectoryOperation(
                            {
                                result: new OsiRes(
                                    params.invoke_id,
                                    new OsiRes_result(
                                        params.code,
                                        params.parameter,
                                    ),
                                ),
                            },
                            BER,
                        ),
                    }
                ),
            ],
        };
        dispatch_P_DTreq(itot.presentation, user_data);
    };

    rose.write_error = (params) => {
        const pc = get_pc(itot, rose);
        if (!pc) {
            const logInfo = getLogInfoFromITOTStack(itot);
            ctx.log.error(ctx.i18n.t("log:osi_net_no_pci", {
                context: "op",
                peer,
                appcontext: rose.protocol?.toString(),
            }), logInfo);
            return;
        }
        const user_data: User_data = {
            fully_encoded_data: [
                new PDV_list(
                    undefined,
                    pc.presentation_context_identifier,
                    {
                        single_ASN1_type: _encode_OsiDirectoryOperation(
                            {
                                error: new OsiErr(
                                    params.invoke_id,
                                    _encode_Code(params.code, BER),
                                    params.parameter,
                                ),
                            },
                            BER,
                        ),
                    },
                ),
            ],
        };
        dispatch_P_DTreq(itot.presentation, user_data);
    };

    rose.write_reject = (params) => {
        const pc = get_pc(itot, rose);
        if (!pc) {
            const logInfo = getLogInfoFromITOTStack(itot);
            ctx.log.error(ctx.i18n.t("log:osi_net_no_pci", {
                context: "op",
                peer,
                appcontext: rose.protocol?.toString(),
            }), logInfo);
            return;
        }
        const user_data: User_data = {
            fully_encoded_data: [
                new PDV_list(
                    undefined,
                    pc.presentation_context_identifier,
                    {
                        single_ASN1_type: _encode_OsiDirectoryOperation(
                            {
                                reject: new OsiRej(
                                    params.invoke_id,
                                    rose_reject_to_osi_reject.get(params.problem) ?? default_reject,
                                ),
                            },
                            BER,
                        ),
                    },
                ),
            ],
        };
        dispatch_P_DTreq(itot.presentation, user_data);
    };

    rose.write_unbind = () => {
        rose.is_bound = false;
        const rlrq = new RLRQ_apdu(
            Release_request_reason_normal,
            undefined,
            undefined,
            [],
            undefined
        );
        dispatch_A_RLSreq(itot.acse, rlrq);
    };

    rose.write_unbind_result = () => {
        rose.is_bound = false;
        const rlre = new RLRE_apdu(
            Release_response_reason_normal,
            undefined,
            undefined,
            [],
            undefined,
        );
        dispatch_A_RLSrsp_accept(itot.acse, rlre);
    };

    rose.write_unbind_error = () => {
        const rlre = new RLRE_apdu(
            Release_response_reason_not_finished,
            undefined,
            undefined,
            [],
            undefined,
        );
        dispatch_A_RLSrsp_reject(itot.acse, rlre);
    };

    rose.write_abort = (reason) => {
        rose.is_bound = false;
        const abrt: ABRT_apdu = new ABRT_apdu(
            ABRT_source_acse_service_user,
            rose_abort_to_osi_abort.get(reason)
                ?? ABRT_diagnostic_no_reason_given,
            undefined,
            undefined,
            [],
            undefined
        );
        dispatch_A_ABRreq(itot.acse, abrt);
    };

    itot.transport.outgoingEvents.prependListener("ER", (tpdu) => {
        const logInfo = getLogInfoFromITOTStack(itot);
        ctx.log.warn(ctx.i18n.t("log:osi_transport_error", {
            peer,
            dst: tpdu.dstRef,
            reason: tpdu.reject_cause,
        }), logInfo);
    });

    itot.session.outgoingEvents.prependListener("SPABind", () => {
        const logInfo = getLogInfoFromITOTStack(itot);
        ctx.log.warn(ctx.i18n.t("log:osi_session_abort", { peer }), logInfo);
    });

    itot.presentation.outgoingEvents.prependListener("P-PABind", (ppdu) => {
        const logInfo = getLogInfoFromITOTStack(itot);
        ctx.log.warn(ctx.i18n.t("log:osi_presentation_abort", {
            peer,
            eid: ppdu.event_identifier?.toString() ?? "?",
            reason: ppdu.provider_reason?.toString() ?? "?",
        }), logInfo);
    });

    return rose;
}
