import { TypedEmitter } from 'tiny-typed-emitter';
import { AARQ_apdu } from '@wildboar/acse/src/lib/modules/ACSE-1/AARQ-apdu.ta';
import { AARE_apdu } from '@wildboar/acse/src/lib/modules/ACSE-1/AARE-apdu.ta';
import { RLRQ_apdu } from '@wildboar/acse/src/lib/modules/ACSE-1/RLRQ-apdu.ta';
import { RLRE_apdu } from '@wildboar/acse/src/lib/modules/ACSE-1/RLRE-apdu.ta';
import { ABRT_apdu } from '@wildboar/acse/src/lib/modules/ACSE-1/ABRT-apdu.ta';
import { Associate_result_rejected_permanent } from '@wildboar/acse/src/lib/modules/ACSE-1/Associate-result.ta';
import { Associate_source_diagnostic_acse_service_provider_no_reason_given } from '@wildboar/acse/src/lib/modules/ACSE-1/Associate-source-diagnostic-acse-service-provider.ta';
import type { AP_title } from '@wildboar/acse/src/lib/modules/ACSE-1/AP-title.ta';
import type { AE_qualifier } from '@wildboar/acse/src/lib/modules/ACSE-1/AE-qualifier.ta';
import type { AP_invocation_identifier } from '@wildboar/acse/src/lib/modules/ACSE-1/AP-invocation-identifier.ta';
import type { AE_invocation_identifier } from '@wildboar/acse/src/lib/modules/ACSE-1/AE-invocation-identifier.ta';
import { ABRT_source_acse_service_provider } from '@wildboar/acse/src/lib/modules/ACSE-1/ABRT-source.ta';
import { ABRT_diagnostic_protocol_error } from '@wildboar/acse/src/lib/modules/ACSE-1/ABRT-diagnostic.ta';
import type {
    CP_type_normal_mode_parameters,
    User_data,
} from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/CP-type-normal-mode-parameters.ta';
import type { CPA_PPDU_normal_mode_parameters } from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/CPA-PPDU-normal-mode-parameters.ta';
import type { CPR_PPDU_normal_mode_parameters } from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/CPR-PPDU-normal-mode-parameters.ta';
import { TRUE_BIT } from 'asn1-ts';

export interface P_CONNECT_Request
    extends Partial<CP_type_normal_mode_parameters> {}

export interface P_CONNECT_Response
    extends Partial<CPA_PPDU_normal_mode_parameters> {
    provider_reason?: CPR_PPDU_normal_mode_parameters['provider_reason'];
}

export interface P_RELEASE_Request {
    user_data?: User_data;
}

export interface P_RELEASE_Response {
    reject?: boolean;
    user_data?: User_data;
}

export interface P_U_ABORT_Request {
    user_data?: User_data;
}

export interface PresentationService {
    request_P_CONNECT: (args: P_CONNECT_Request) => unknown;
    respond_P_CONNECT: (args: P_CONNECT_Response) => unknown;
    request_P_RELEASE: (args: P_RELEASE_Request) => unknown;
    respond_P_RELEASE: (args: P_RELEASE_Response) => unknown;
    request_P_U_ABORT: (args: P_U_ABORT_Request) => unknown;
}

/**
 * ACPM states as defined in table A.2 of ITU Recommendation X.227 (1995),
 * Annex A.
 */
export enum TableA2AssociationState {
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

export interface ACSEOutgoingEvents {
    'A-ASCind': (apdu: AARQ_apdu) => unknown; // A-ASSOCIATE indication primitive
    'A-ASCcnf+': (apdu: AARE_apdu) => unknown; // A-ASSOCIATE confirm primitive (Result = “accepted”)
    'A-ASCcnf-': (apdu?: AARE_apdu) => unknown; // A-ASSOCIATE confirm primitive (Result = “rejected (permanent)” or “rejected (transient)”)
    AARQ: (apdu: AARQ_apdu) => unknown; // A-ASSOCIATE-REQUEST APDU The AARQ is sent as user data on a P-CONNECT request primitive
    'AARE+': (apdu: AARE_apdu) => unknown; // A-ASSOCIATE-RESPONSE APDU (Result = “accepted”) The AARE+ is sent as user data on a P-CONNECT+ response primitive (Result = “acceptance”)
    'AARE-': (apdu: AARE_apdu) => unknown; // A-ASSOCIATE-RESPONSE APDU (Result = “rejected (permanent)” or “rejected (transient)”) The AARE- is sent as user data on a P-CONNECT– response primitive (Result = “user-rejection”)
    'A-RLSind': (apdu: RLRQ_apdu) => unknown; // A-RELEASE indication primitive
    'A-RLScnf+': (apdu: RLRE_apdu) => unknown; // A-RELEASE confirm primitive // (Result = “affirmative”)
    'A-RLScnf-': (apdu: RLRE_apdu) => unknown; // A-RELEASE confirm primitive // (Result = “negative”)
    RLRQ: (apdu: RLRQ_apdu) => unknown; // A-RELEASE-REQUEST ADPU The RLRQ is sent as user data on a P-RELEASE request primitive
    'RLRE+': (apdu: RLRE_apdu) => unknown; // A-RELEASE-RESPONSE APDU The RLRE+ is sent as user data on a P-RELEASE response primitive (Result = “affirmative”)
    'RLRE-': (apdu: RLRE_apdu) => unknown; // A-RELEASE-RESPONSE APDU The RLRE- is sent as user data on a P-RELEASE response primitive (Result = “negative”)
    'A-ABRind': (apdu: ABRT_apdu) => unknown; // A-ABORT indication primitive // (Source = “ACSE service user” or “ACSE service-provider”)
    ABRT: (apdu: ABRT_apdu) => unknown; // A-ABORT APDU (Source = “ACSE service-user” or “ACSE service-provider”) The ABRT is sent as user data on a P-U-ABORT request primitive
    'P-PABind': () => unknown; // A-P-ABORT indication primitive
}

/**
 * ACPM outgoing events as defined in table A.3 of
 * ITU Recommendation X.227 (1995), Annex A.
 */
export class ACSEOutgoingEventEmitter extends TypedEmitter<ACSEOutgoingEvents> {}

export interface ACPMState {
    state: TableA2AssociationState;
    outgoingEvents: ACSEOutgoingEventEmitter;
    initiator: boolean;
    presentation: PresentationService;
    responding_AP_title?: AP_title;
    responding_AE_qualifier?: AE_qualifier;
    responding_AP_invocation_identifier?: AP_invocation_identifier;
    responding_AE_invocation_identifier?: AE_invocation_identifier;
    acse_authenticate?: (aarq: AARQ_apdu) => boolean;
}

export function createAssociationControlState(
    presentation: PresentationService,
    acse_authenticate?: (aarq: AARQ_apdu) => boolean,
): ACPMState {
    const outgoingEvents = new ACSEOutgoingEventEmitter();
    return {
        state: TableA2AssociationState.STA0,
        outgoingEvents,
        initiator: true,
        presentation,
        acse_authenticate,
    };
}

export function canSupportAssociation(aarq: AARQ_apdu): boolean {
    if (
        aarq.protocol_version?.length &&
        aarq.protocol_version[0] !== TRUE_BIT
    ) {
        return false;
    }
    if (
        aarq.sender_acse_requirements?.length &&
        aarq.sender_acse_requirements.some((bit) => bit === TRUE_BIT)
    ) {
        return false;
    }
    return true;
}

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
export function handleInvalidSequence_A(state: ACPMState): void {
    const abrt: ABRT_apdu = new ABRT_apdu(
        ABRT_source_acse_service_provider,
        ABRT_diagnostic_protocol_error,
        undefined,
        undefined,
        [],
        undefined
    );
    state.outgoingEvents.emit('A-ABRind', abrt);
    state.outgoingEvents.emit('ABRT', abrt);
}

// There is no defined way to handle invalid user input...
// Maybe you could make the request dispatchers return a number indicating
// success/failure?
export function handle_invalid_user_input(state: ACPMState): void { /* eslint-disable-line */
    /* eslint-disable-line */
    return;
}

export function dispatch_A_ASCreq(state: ACPMState, apdu: AARQ_apdu): void {
    switch (state.state) {
        case TableA2AssociationState.STA0: {
            const p1: boolean = canSupportAssociation(apdu);
            if (p1) {
                state.initiator = true;
                state.state = TableA2AssociationState.STA1;
                state.outgoingEvents.emit('AARQ', apdu);
            } else {
                return handle_invalid_user_input(state);
            }
            break;
        }
        default:
            return handle_invalid_user_input(state);
    }
}

export function dispatch_A_ASCrsp_accept(
    state: ACPMState,
    apdu: AARE_apdu
): void {
    switch (state.state) {
        case TableA2AssociationState.STA2: {
            state.initiator = false;
            state.state = TableA2AssociationState.STA5;
            state.outgoingEvents.emit('AARE+', apdu);
            break;
        }
        default:
            return handle_invalid_user_input(state);
    }
}

export function dispatch_A_ASCrsp_reject(
    state: ACPMState,
    apdu: AARE_apdu
): void {
    switch (state.state) {
        case TableA2AssociationState.STA2: {
            state.initiator = false;
            state.state = TableA2AssociationState.STA0;
            state.outgoingEvents.emit('AARE-', apdu);
            break;
        }
        default:
            return handle_invalid_user_input(state);
    }
}

export function dispatch_AARQ(state: ACPMState, apdu: AARQ_apdu): void {
    switch (state.state) {
        case TableA2AssociationState.STA0: {
            const p1: boolean = canSupportAssociation(apdu);
            if (p1) {
                state.state = TableA2AssociationState.STA2;
                state.outgoingEvents.emit('A-ASCind', apdu);
            } else {
                state.state = TableA2AssociationState.STA0;
                const aare: AARE_apdu = new AARE_apdu(
                    undefined,
                    apdu.aSO_context_name,
                    Associate_result_rejected_permanent,
                    {
                        acse_service_provider:
                            Associate_source_diagnostic_acse_service_provider_no_reason_given,
                    },
                    state.responding_AP_title,
                    state.responding_AE_qualifier,
                    state.responding_AP_invocation_identifier,
                    state.responding_AE_invocation_identifier,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    'Meerkat DSA ACSE',
                    undefined,
                    undefined,
                    undefined,
                    [],
                    undefined
                );
                state.outgoingEvents.emit('AARE-', aare);
            }
            break;
        }
        default:
            return handleInvalidSequence_A(state);
    }
}

export function dispatch_AARE_accept(state: ACPMState, apdu: AARE_apdu): void {
    switch (state.state) {
        case TableA2AssociationState.STA1: {
            state.state = TableA2AssociationState.STA5;
            state.outgoingEvents.emit('A-ASCcnf+', apdu);
            break;
        }
        default:
            return handle_invalid_user_input(state);
    }
}

export function dispatch_AARE_reject(state: ACPMState, apdu: AARE_apdu): void {
    switch (state.state) {
        case TableA2AssociationState.STA1: {
            state.state = TableA2AssociationState.STA0;
            state.outgoingEvents.emit('A-ASCcnf-', apdu);
            break;
        }
        default:
            return handle_invalid_user_input(state);
    }
}

export function dispatch_P_CONcnf_reject(
    state: ACPMState,
    apdu?: AARE_apdu
): void {
    switch (state.state) {
        case TableA2AssociationState.STA1: {
            state.state = TableA2AssociationState.STA0;
            state.outgoingEvents.emit('A-ASCcnf-', apdu);
            break;
        }
        default:
            return;
    }
}

export function dispatch_A_RLSreq(state: ACPMState, apdu: RLRQ_apdu): void {
    switch (state.state) {
        case TableA2AssociationState.STA5: {
            state.state = TableA2AssociationState.STA3;
            state.outgoingEvents.emit('RLRQ', apdu);
            break;
        }
        default:
            return handle_invalid_user_input(state);
    }
}

export function dispatch_A_RLSrsp_accept(
    state: ACPMState,
    apdu: RLRE_apdu
): void {
    switch (state.state) {
        case TableA2AssociationState.STA4: {
            state.state = TableA2AssociationState.STA0;
            state.outgoingEvents.emit('RLRE+', apdu);
            break;
        }
        case TableA2AssociationState.STA6: {
            state.state = TableA2AssociationState.STA3;
            state.outgoingEvents.emit('RLRE+', apdu);
            break;
        }
        default:
            return handle_invalid_user_input(state);
    }
}

export function dispatch_A_RLSrsp_reject(
    state: ACPMState,
    apdu: RLRE_apdu
): void {
    switch (state.state) {
        case TableA2AssociationState.STA4: {
            state.state = TableA2AssociationState.STA5;
            state.outgoingEvents.emit('RLRE-', apdu);
            break;
        }
        default:
            return handle_invalid_user_input(state);
    }
}

export function dispatch_RLRQ(state: ACPMState, apdu: RLRQ_apdu): void {
    switch (state.state) {
        case TableA2AssociationState.STA3: {
            const p2: boolean = state.initiator;
            if (p2) {
                state.state = TableA2AssociationState.STA6;
                state.outgoingEvents.emit('A-RLSind', apdu);
            } else {
                state.state = TableA2AssociationState.STA7;
                state.outgoingEvents.emit('A-RLSind', apdu);
            }
            break;
        }
        case TableA2AssociationState.STA5: {
            state.state = TableA2AssociationState.STA4;
            state.outgoingEvents.emit('A-RLSind', apdu);
            break;
        }
        default:
            return handleInvalidSequence_A(state);
    }
}

export function dispatch_RLRE_accept(state: ACPMState, apdu: RLRE_apdu): void {
    switch (state.state) {
        case TableA2AssociationState.STA3: {
            state.state = TableA2AssociationState.STA0;
            state.outgoingEvents.emit('A-RLScnf+', apdu);
            break;
        }
        case TableA2AssociationState.STA7: {
            state.state = TableA2AssociationState.STA4;
            state.outgoingEvents.emit('A-RLScnf+', apdu);
            break;
        }
        default:
            return handle_invalid_user_input(state);
    }
}

export function dispatch_RLRE_reject(state: ACPMState, apdu: RLRE_apdu): void {
    switch (state.state) {
        case TableA2AssociationState.STA3: {
            state.state = TableA2AssociationState.STA5;
            state.outgoingEvents.emit('A-RLScnf-', apdu);
            break;
        }
        default:
            return handle_invalid_user_input(state);
    }
}

export function dispatch_A_ABRreq(state: ACPMState, apdu: ABRT_apdu): void {
    switch (state.state) {
        case TableA2AssociationState.STA1:
        case TableA2AssociationState.STA2:
        case TableA2AssociationState.STA3:
        case TableA2AssociationState.STA4:
        case TableA2AssociationState.STA5:
        case TableA2AssociationState.STA6:
        case TableA2AssociationState.STA7: {
            state.state = TableA2AssociationState.STA0;
            state.outgoingEvents.emit('ABRT', apdu);
            break;
        }
        default:
            return handle_invalid_user_input(state);
    }
}

export function dispatch_ABRT(state: ACPMState, apdu: ABRT_apdu): void {
    switch (state.state) {
        case TableA2AssociationState.STA1:
        case TableA2AssociationState.STA2:
        case TableA2AssociationState.STA3:
        case TableA2AssociationState.STA4:
        case TableA2AssociationState.STA5:
        case TableA2AssociationState.STA6:
        case TableA2AssociationState.STA7: {
            state.state = TableA2AssociationState.STA0;
            state.outgoingEvents.emit('A-ABRind', apdu);
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

export function dispatch_P_PABind(state: ACPMState): void {
    // NOTE: This deviates from the specification. If you
    // handle invalid state when you respond to a presentation abort,
    // this will create an infinite loop of aborts.
    state.state = TableA2AssociationState.STA0;
    state.outgoingEvents.emit('P-PABind');
}

export function dispatch_EXTRN_1(state: ACPMState): void {
    switch (state.state) {
        case TableA2AssociationState.STA3:
        case TableA2AssociationState.STA5: {
            state.state = TableA2AssociationState.STA5;
            break;
        }
        default:
            return handleInvalidSequence_A(state);
    }
}

export function dispatch_EXTRN_2(state: ACPMState): void {
    switch (state.state) {
        case TableA2AssociationState.STA4:
        case TableA2AssociationState.STA5: {
            state.state = TableA2AssociationState.STA5;
            break;
        }
        default:
            return handleInvalidSequence_A(state);
    }
}
