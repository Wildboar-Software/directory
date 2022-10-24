import { TypedEmitter } from "tiny-typed-emitter";
import {
    AARQ_apdu,
    _encode_AARQ_apdu,
} from "@wildboar/acse/src/lib/modules/ACSE-1/AARQ-apdu.ta";
import {
    AARE_apdu,
    _encode_AARE_apdu,
} from "@wildboar/acse/src/lib/modules/ACSE-1/AARE-apdu.ta";
import {
    RLRQ_apdu,
    _encode_RLRQ_apdu,
} from "@wildboar/acse/src/lib/modules/ACSE-1/RLRQ-apdu.ta";
import {
    RLRE_apdu,
    _encode_RLRE_apdu,
} from "@wildboar/acse/src/lib/modules/ACSE-1/RLRE-apdu.ta";
import {
    ABRT_apdu,
    _encode_ABRT_apdu,
} from "@wildboar/acse/src/lib/modules/ACSE-1/ABRT-apdu.ta";
import {
    Associate_result_rejected_permanent,
} from "@wildboar/acse/src/lib/modules/ACSE-1/Associate-result.ta";
import {
    Associate_source_diagnostic_acse_service_provider_no_reason_given,
} from "@wildboar/acse/src/lib/modules/ACSE-1/Associate-source-diagnostic-acse-service-provider.ta";
import type {
    AP_title,
} from "@wildboar/acse/src/lib/modules/ACSE-1/AP-title.ta";
import type {
    AE_qualifier,
} from "@wildboar/acse/src/lib/modules/ACSE-1/AE-qualifier.ta";
import type {
    AP_invocation_identifier,
} from "@wildboar/acse/src/lib/modules/ACSE-1/AP-invocation-identifier.ta";
import type {
    AE_invocation_identifier,
} from "@wildboar/acse/src/lib/modules/ACSE-1/AE-invocation-identifier.ta";
import {
    ABRT_source_acse_service_provider,
} from "@wildboar/acse/src/lib/modules/ACSE-1/ABRT-source.ta";
import {
    ABRT_diagnostic_protocol_error,
} from "@wildboar/acse/src/lib/modules/ACSE-1/ABRT-diagnostic.ta";
import type {
    CP_type_normal_mode_parameters, User_data,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/CP-type-normal-mode-parameters.ta";
import type {
    CPA_PPDU_normal_mode_parameters,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/CPA-PPDU-normal-mode-parameters.ta";
import type {
    CPR_PPDU_normal_mode_parameters,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/CPR-PPDU-normal-mode-parameters.ta";
import { TRUE_BIT, ASN1Element, ObjectIdentifier } from "asn1-ts";
import { BER } from "asn1-ts/dist/node/functional";
import { Context_list_Item } from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Context-list-Item.ta";
import { PDV_list } from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/PDV-list.ta";

const id_ber = new ObjectIdentifier([ 2, 1, 1 ]);
const id_acse = new ObjectIdentifier([ 2, 2, 1, 0, 1 ]);

export
interface P_CONNECT_Request extends Partial<CP_type_normal_mode_parameters> {

}

export
interface P_CONNECT_Response extends Partial<CPA_PPDU_normal_mode_parameters> {
    provider_reason?: CPR_PPDU_normal_mode_parameters["provider_reason"];
}

export
interface P_RELEASE_Request {
    user_data?: User_data;
}

export
interface P_RELEASE_Response {
    result?: number;
    user_data?: User_data;
}

export
interface P_U_ABORT_Request {
    user_data?: User_data;
}

// TODO: Change this to just use the PPDUs directly.
export
interface PresentationService {
    request_P_CONNECT: (args: P_CONNECT_Request) => unknown;
    respond_P_CONNECT: (args: P_CONNECT_Response) => unknown;
    request_P_RELEASE: (args: P_RELEASE_Request) => unknown;
    respond_P_RELEASE: (args: P_RELEASE_Response) => unknown;
    request_P_U_ABORT: (args: P_U_ABORT_Request) => unknown;
}

// TODO: Rename. Basically same as ACPMState.
/**
 * ACPM states as defined in table A.2 of ITU Recommendation X.227 (1995),
 * Annex A.
 */
export
enum AssociationControlProtocolMachineState {
    /** idle: unassociated */
    STA0,
    /** awaiting AARE APDU */
    STA1,
    /** awaiting A-ASSOCIATE response */
    STA2,
    /** awaiting RLRE APDU */
    STA3,
    /** awaiting A-RELEASE response */
    STA4,
    /** associated */
    STA5,
    /** awaiting A-RELEASE response (association initiator) */
    STA6,
    /** awaiting RLRE APDU (association initiator) */
    STA7,
}

export
interface ACSEOutgoingEvents {
    "A-ASCind": (apdu: AARQ_apdu) => unknown; // A-ASSOCIATE indication primitive
    "A-ASCcnf+": (apdu: AARE_apdu) => unknown; // A-ASSOCIATE confirm primitive (Result = “accepted”)
    "A-ASCcnf-": (apdu?: AARE_apdu) => unknown; // A-ASSOCIATE confirm primitive (Result = “rejected (permanent)” or “rejected (transient)”)
    "AARQ": (apdu: AARQ_apdu) => unknown; // A-ASSOCIATE-REQUEST APDU The AARQ is sent as user data on a P-CONNECT request primitive
    "AARE+": (apdu: AARE_apdu) => unknown; // A-ASSOCIATE-RESPONSE APDU (Result = “accepted”) The AARE+ is sent as user data on a P-CONNECT+ response primitive (Result = “acceptance”)
    "AARE-": (apdu: AARE_apdu) => unknown; // A-ASSOCIATE-RESPONSE APDU (Result = “rejected (permanent)” or “rejected (transient)”) The AARE- is sent as user data on a P-CONNECT– response primitive (Result = “user-rejection”)
    "A-RLSind": (apdu: RLRQ_apdu) => unknown; // A-RELEASE indication primitive
    "A-RLScnf+": (apdu: RLRE_apdu) => unknown; // A-RELEASE confirm primitive // (Result = “affirmative”)
    "A-RLScnf-": (apdu: RLRE_apdu) => unknown; // A-RELEASE confirm primitive // (Result = “negative”)
    "RLRQ": (apdu: RLRQ_apdu) => unknown; // A-RELEASE-REQUEST ADPU The RLRQ is sent as user data on a P-RELEASE request primitive
    "RLRE+": (apdu: RLRE_apdu) => unknown; // A-RELEASE-RESPONSE APDU The RLRE+ is sent as user data on a P-RELEASE response primitive (Result = “affirmative”)
    "RLRE-": (apdu: RLRE_apdu) => unknown; // A-RELEASE-RESPONSE APDU The RLRE- is sent as user data on a P-RELEASE response primitive (Result = “negative”)
    "A-ABRind": (apdu: ABRT_apdu) => unknown; // A-ABORT indication primitive // (Source = “ACSE service user” or “ACSE service-provider”)
    "ABRT": (apdu: ABRT_apdu) => unknown; // A-ABORT APDU (Source = “ACSE service-user” or “ACSE service-provider”) The ABRT is sent as user data on a P-U-ABORT request primitive
    "P-PABind": () => unknown; // A-P-ABORT indication primitive
}

/**
 * ACPM outgoing events as defined in table A.3 of
 * ITU Recommendation X.227 (1995), Annex A.
 */
export
class ACSEOutgoingEventEmitter extends TypedEmitter<ACSEOutgoingEvents> {

}

export
interface ACPMState {
    state: AssociationControlProtocolMachineState;
    outgoingEvents: ACSEOutgoingEventEmitter;
    initiator: boolean;
    presentation: PresentationService;
    responding_AP_title?: AP_title;
    responding_AE_qualifier?: AE_qualifier;
    responding_AP_invocation_identifier?: AP_invocation_identifier;
    responding_AE_invocation_identifier?: AE_invocation_identifier;
}

export
function createAssociationControlState (
    presentation: PresentationService,
): ACPMState {
    const outgoingEvents = new ACSEOutgoingEventEmitter();
    // TODO: We are going to let these get handled by the actual application.
    // outgoingEvents.on("AARQ", (apdu) => {
    //     presentation.request_P_CONNECT({
    //         presentation_context_definition_list: [
    //             new Context_list_Item(
    //                 1,
    //                 id_acse,
    //                 [id_ber],
    //             ),
    //         ],
    //         user_data: {
    //             fully_encoded_data: [
    //                 new PDV_list(
    //                     undefined,
    //                     1,
    //                     {
    //                         single_ASN1_type: _encode_AARQ_apdu(apdu, BER),
    //                     },
    //                 ),
    //             ],
    //         },
    //     });
    // });
    // outgoingEvents.on("AARE+", (apdu) => {
    //     presentation.respond_P_CONNECT({
    //         user_data: {
    //             fully_encoded_data: [
    //                 new PDV_list(
    //                     undefined,
    //                     1,
    //                     {
    //                         single_ASN1_type: _encode_AARE_apdu(apdu, BER),
    //                     },
    //                 ),
    //             ],
    //         },
    //     });
    // });
    // outgoingEvents.on("AARE-", (apdu) => {
    //     presentation.respond_P_CONNECT({
    //         user_data: {
    //             fully_encoded_data: [
    //                 new PDV_list(
    //                     undefined,
    //                     1,
    //                     {
    //                         single_ASN1_type: _encode_AARE_apdu(apdu, BER),
    //                     },
    //                 ),
    //             ],
    //         },
    //     });
    // });
    // outgoingEvents.on("ABRT", (apdu) => {
    //     presentation.request_P_U_ABORT({
    //         user_data: _encode_ABRT_apdu(apdu, BER),
    //     });
    // });
    // outgoingEvents.on("RLRQ", (apdu) => {
    //     presentation.request_P_RELEASE({
    //         user_data: _encode_RLRQ_apdu(apdu, BER),
    //     });
    // });
    // outgoingEvents.on("RLRE+", (apdu) => {
    //     presentation.respond_P_RELEASE({
    //         user_data: _encode_RLRE_apdu(apdu, BER),
    //     });
    // });
    // outgoingEvents.on("RLRE-", (apdu) => {
    //     presentation.respond_P_RELEASE({
    //         user_data: _encode_RLRE_apdu(apdu, BER),
    //     });
    // });
    return {
        state: AssociationControlProtocolMachineState.STA0,
        outgoingEvents,
        initiator: true,
        presentation,
    };
}

export
function canSupportAssociation (aarq: AARQ_apdu): boolean {
    if (
        aarq.protocol_version?.length
        && (aarq.protocol_version[0] !== TRUE_BIT)
    ) {
        return false;
    }
    if (
        aarq.sender_acse_requirements?.length
        && aarq.sender_acse_requirements.some((bit) => bit === TRUE_BIT)
    ) {
        return false;
    }
    return true;
}

// TODO: Handle invalid sequence by service user a little more gracefully.
/**
 * @summary Procedure for handling an invalid sequence
 * @description
 *
 * The procedure defined by ITU Recommendation X.227 (1995), Section A.3.1, to
 * handle an event dispatched to an application association that is not in a
 * state in which it is ready to receive that event.
 *
 * @param state The association control protocol machine state
 */
export
function handleInvalidSequence (state: ACPMState): void {
    const abrt: ABRT_apdu = new ABRT_apdu(
        ABRT_source_acse_service_provider,
        ABRT_diagnostic_protocol_error,
        undefined,
        undefined,
        [],
        undefined,
    );
    state.outgoingEvents.emit("A-ABRind", abrt);
    state.outgoingEvents.emit("ABRT", abrt);
}

export
function dispatch_A_ASCreq (state: ACPMState, apdu: AARQ_apdu): void {
    switch (state.state) {
        case (AssociationControlProtocolMachineState.STA0):
            {
                const p1: boolean = canSupportAssociation(apdu);
                if (p1) {
                    state.initiator = true;
                    state.state = AssociationControlProtocolMachineState.STA1;
                    state.outgoingEvents.emit("AARQ", apdu);
                } else {
                    return handleInvalidSequence(state);
                }
                break;
            }
        default: return handleInvalidSequence(state);
    }
}

export
function dispatch_A_ASCrsp_accept (state: ACPMState, apdu: AARE_apdu): void {
    switch (state.state) {
        case (AssociationControlProtocolMachineState.STA2):
            {
                state.initiator = false;
                state.state = AssociationControlProtocolMachineState.STA5;
                state.outgoingEvents.emit("AARE+", apdu);
                break;
            }
        default: return handleInvalidSequence(state);
    }
}

export
function dispatch_A_ASCrsp_reject (state: ACPMState, apdu: AARE_apdu): void {
    switch (state.state) {
        case (AssociationControlProtocolMachineState.STA2):
            {
                state.initiator = false;
                state.state = AssociationControlProtocolMachineState.STA0;
                state.outgoingEvents.emit("AARE-", apdu);
                break;
            }
        default: return handleInvalidSequence(state);
    }
}

export
function dispatch_AARQ (state: ACPMState, apdu: AARQ_apdu): void {
    switch (state.state) {
        case (AssociationControlProtocolMachineState.STA0):
            {
                const p1: boolean = canSupportAssociation(apdu);
                if (p1) {
                    state.state = AssociationControlProtocolMachineState.STA2;
                    state.outgoingEvents.emit("A-ASCind", apdu);
                } else {
                    state.state = AssociationControlProtocolMachineState.STA0;
                    const aare: AARE_apdu = new AARE_apdu(
                        undefined,
                        apdu.aSO_context_name,
                        Associate_result_rejected_permanent,
                        {
                            acse_service_provider: Associate_source_diagnostic_acse_service_provider_no_reason_given,
                        },
                        state.responding_AP_title,
                        state.responding_AE_qualifier,
                        state.responding_AP_invocation_identifier,
                        state.responding_AE_invocation_identifier,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        "Meerkat DSA ACSE",
                        undefined,
                        undefined,
                        undefined,
                        [],
                        undefined,
                    );
                    state.outgoingEvents.emit("AARE-", aare);
                }
                break;
            }
        default: return handleInvalidSequence(state);
    }
}

export
function dispatch_AARE_accept (state: ACPMState, apdu: AARE_apdu): void {
    switch (state.state) {
        case (AssociationControlProtocolMachineState.STA1):
            {
                state.state = AssociationControlProtocolMachineState.STA5;
                state.outgoingEvents.emit("A-ASCcnf+", apdu);
                break;
            }
        default: return handleInvalidSequence(state);
    }
}

export
function dispatch_AARE_reject (state: ACPMState, apdu: AARE_apdu): void {
    switch (state.state) {
        case (AssociationControlProtocolMachineState.STA1):
            {
                state.state = AssociationControlProtocolMachineState.STA0;
                state.outgoingEvents.emit("A-ASCcnf-", apdu);
                break;
            }
        default: return handleInvalidSequence(state);
    }
}

export
function dispatch_P_CONcnf_reject (state: ACPMState): void {
    switch (state.state) {
        case (AssociationControlProtocolMachineState.STA1):
            {
                state.state = AssociationControlProtocolMachineState.STA0;
                state.outgoingEvents.emit("A-ASCcnf-");
                break;
            }
        default: return handleInvalidSequence(state);
    }
}

export
function dispatch_A_RLSreq (state: ACPMState, apdu: RLRQ_apdu): void {
    switch (state.state) {
        case (AssociationControlProtocolMachineState.STA5):
            {
                state.state = AssociationControlProtocolMachineState.STA3;
                state.outgoingEvents.emit("RLRQ", apdu);
                break;
            }
        default: return handleInvalidSequence(state);
    }
}

export
function dispatch_A_RLSrsp_accept (state: ACPMState, apdu: RLRE_apdu): void {
    switch (state.state) {
        case (AssociationControlProtocolMachineState.STA4):
            {
                state.state = AssociationControlProtocolMachineState.STA0;
                state.outgoingEvents.emit("RLRE+", apdu);
                break;
            }
        case (AssociationControlProtocolMachineState.STA6):
            {
                state.state = AssociationControlProtocolMachineState.STA3;
                state.outgoingEvents.emit("RLRE+", apdu);
                break;
            }
        default: return handleInvalidSequence(state);
    }
}

export
function dispatch_A_RLSrsp_reject (state: ACPMState, apdu: RLRE_apdu): void {
    switch (state.state) {
        case (AssociationControlProtocolMachineState.STA4):
            {
                state.state = AssociationControlProtocolMachineState.STA5;
                state.outgoingEvents.emit("RLRE-", apdu);
                break;
            }
        default: return handleInvalidSequence(state);
    }
}

export
function dispatch_RLRQ (state: ACPMState, apdu: RLRQ_apdu): void {
    switch (state.state) {
        case (AssociationControlProtocolMachineState.STA3):
            {
                const p2: boolean = state.initiator;
                if (p2) {
                    state.state = AssociationControlProtocolMachineState.STA6;
                    state.outgoingEvents.emit("A-RLSind", apdu);
                } else {
                    state.state = AssociationControlProtocolMachineState.STA7;
                    state.outgoingEvents.emit("A-RLSind", apdu);
                }
                break;
            }
        case (AssociationControlProtocolMachineState.STA5):
            {
                state.state = AssociationControlProtocolMachineState.STA4;
                state.outgoingEvents.emit("A-RLSind", apdu);
                break;
            }
        default: return handleInvalidSequence(state);
    }
}

export
function dispatch_RLRE_accept (state: ACPMState, apdu: RLRE_apdu): void {
    switch (state.state) {
        case (AssociationControlProtocolMachineState.STA3):
            {
                state.state = AssociationControlProtocolMachineState.STA0;
                state.outgoingEvents.emit("A-RLScnf+", apdu);
                break;
            }
        case (AssociationControlProtocolMachineState.STA7):
            {
                state.state = AssociationControlProtocolMachineState.STA4;
                state.outgoingEvents.emit("A-RLScnf+", apdu);
                break;
            }
        default: return handleInvalidSequence(state);
    }
}

export
function dispatch_RLRE_reject (state: ACPMState, apdu: RLRE_apdu): void {
    switch (state.state) {
        case (AssociationControlProtocolMachineState.STA3):
            {
                state.state = AssociationControlProtocolMachineState.STA5;
                state.outgoingEvents.emit("A-RLScnf-", apdu);
                break;
            }
        default: return handleInvalidSequence(state);
    }
}

export
function dispatch_A_ABRreq (state: ACPMState, apdu: ABRT_apdu): void {
    switch (state.state) {
        case (AssociationControlProtocolMachineState.STA1):
        case (AssociationControlProtocolMachineState.STA2):
        case (AssociationControlProtocolMachineState.STA3):
        case (AssociationControlProtocolMachineState.STA4):
        case (AssociationControlProtocolMachineState.STA5):
        case (AssociationControlProtocolMachineState.STA6):
        case (AssociationControlProtocolMachineState.STA7):
            {
                state.state = AssociationControlProtocolMachineState.STA0;
                state.outgoingEvents.emit("ABRT", apdu);
                break;
            }
        default: return handleInvalidSequence(state);
    }
}

export
function dispatch_ABRT (state: ACPMState, apdu: ABRT_apdu): void {
    switch (state.state) {
        case (AssociationControlProtocolMachineState.STA1):
        case (AssociationControlProtocolMachineState.STA2):
        case (AssociationControlProtocolMachineState.STA3):
        case (AssociationControlProtocolMachineState.STA4):
        case (AssociationControlProtocolMachineState.STA5):
        case (AssociationControlProtocolMachineState.STA6):
        case (AssociationControlProtocolMachineState.STA7):
            {
                state.state = AssociationControlProtocolMachineState.STA0;
                state.outgoingEvents.emit("A-ABRind", apdu);
                break;
            }
        // default: return handleInvalidSequence(state);
        default: {
            // Do nothing so we don't create an infinite loop of aborts.
            // This is not a part of the specification.
            break;
        }
    }
}

export
function dispatch_P_PABind (state: ACPMState): void {
    switch (state.state) {
        case (AssociationControlProtocolMachineState.STA1):
        case (AssociationControlProtocolMachineState.STA2):
        case (AssociationControlProtocolMachineState.STA3):
        case (AssociationControlProtocolMachineState.STA4):
        case (AssociationControlProtocolMachineState.STA5):
        case (AssociationControlProtocolMachineState.STA6):
        case (AssociationControlProtocolMachineState.STA7):
            {
                state.state = AssociationControlProtocolMachineState.STA0;
                state.outgoingEvents.emit("P-PABind");
                break;
            }
        default: return handleInvalidSequence(state);
    }
}

export
function dispatch_EXTRN_1 (state: ACPMState): void {
    switch (state.state) {
        case (AssociationControlProtocolMachineState.STA3):
        case (AssociationControlProtocolMachineState.STA5):
            {
                state.state = AssociationControlProtocolMachineState.STA5;
                break;
            }
        default: return handleInvalidSequence(state);
    }
}

export
function dispatch_EXTRN_2 (state: ACPMState): void {
    switch (state.state) {
        case (AssociationControlProtocolMachineState.STA4):
        case (AssociationControlProtocolMachineState.STA5):
            {
                state.state = AssociationControlProtocolMachineState.STA5;
                break;
            }
        default: return handleInvalidSequence(state);
    }
}
