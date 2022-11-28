import { TypedEmitter } from 'tiny-typed-emitter';
import { Context_list_Item } from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Context-list-Item.ta';
import {
    CP_type,
    _encode_CP_type,
} from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/CP-type.ta';
import {
    CPR_PPDU,
    CPR_PPDU_normal_mode_parameters,
    _encode_CPR_PPDU,
} from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/CPR-PPDU.ta';
import {
    CPA_PPDU,
    _encode_CPA_PPDU,
} from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/CPA-PPDU.ta';
import {
    ARU_PPDU,
    _encode_ARU_PPDU,
} from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/ARU-PPDU.ta';
import {
    ARP_PPDU,
    _encode_ARP_PPDU,
} from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/ARP-PPDU.ta';
import {
    Result,
    Result_acceptance,
} from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Result.ta';
import {
    Abort_reason,
    Abort_reason_invalid_ppdu_parameter_value,
} from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Abort-reason.ta';
import type { Result_list } from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Result-list.ta';
import {
    User_data,
    _encode_User_data,
} from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/User-data.ta';
import type { Default_context_name } from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Default-context-name.ta';
import { OBJECT_IDENTIFIER, TRUE_BIT, ObjectIdentifier } from 'asn1-ts';
import { BER } from 'asn1-ts/dist/node/functional';
import { strict as assert } from 'node:assert';
import { randomBytes, randomInt } from 'node:crypto';
import { Mode_selector_mode_value_normal_mode } from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Mode-selector-mode-value.ta';
import { Provider_reason_reason_not_specified } from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Provider-reason.ta';

/**
 * @summary Presentation layer state
 * @description
 *
 * The presentation-layer states defined in ITU Recommendation X.226 (1994),
 * Annex A, Table A.17.
 *
 */
export enum PresentationLayerState {
    /** Idle - no connection */
    STAI0,
    /** Await CPA PPDU */
    STAI1,
    /** Await P-CONNECT response */
    STAI2,
    /** Connected - Data Transfer */
    STAt0,
    /** Await ACA PPDU */
    STAac0,
    /** Await P-ALTER-CONTEXT response */
    STAac1,
    /** Await ACA PPDU or P-ALTER-CONTEXT response */
    STAac2,
}

export interface PresentationLayerOutgoingEvents {
    AC: () => unknown; // PPDU ALTER CONTEXT
    ACA: () => unknown; // PPDU ALTER CONTEXT ACKNOWLEDGE
    ARP: (ppdu: ARP_PPDU) => unknown; // PPDU PROVIDER ABORT
    ARU: (ppdu: ARU_PPDU) => unknown; // PPDU USER ABORT
    CP: (ppdu: CP_type) => unknown; // PPDU PRESENTATION CONNECT
    CPA: (ppdu: CPA_PPDU) => unknown; // PPDU PRESENTATION CONNECT ACCEPT
    CPR: (ppdu: CPR_PPDU) => unknown; // PPDU PRESENTATION CONNECT REJECT
    'P-ACTDcnf': () => unknown; // PS primitive P-ACTIVITY-DISCARD confirm
    'P-ACTDind': () => unknown; // PS primitive P-ACTIVITY-DISCARD indication
    'P-ACTEcnf': () => unknown; // PS primitive P-ACTIVITY-END confirm
    'P-ACTEind': () => unknown; // PS primitive P-ACTIVITY-END indication
    'P-ACTIcnf': () => unknown; // PS primitive P-ACTIVITY-INTERRUPT confirm
    'P-ACTIind': () => unknown; // PS primitive P-ACTIVITY-INTERRUPT indication
    'P-ACTRind': () => unknown; // PS primitive P-ACTIVITY-RESUME indication
    'P-ACTSind': () => unknown; // PS primitive P-ACTIVITY-START indication
    'P-ALTERcnf': () => unknown; // PS primitive P-ALTER-CONTEXT confirm
    'P-ALTERind': () => unknown; // PS primitive P-ALTER-CONTEXT indication
    'P-CDcnf': () => unknown; // PS primitive P-CAPABILITY-DATA confirm
    'P-CDind': () => unknown; // PS primitive P-CAPABILITY-DATA indication
    'P-CGind': () => unknown; // PS primitive P-CONTROL-GIVE indication
    'P-CONcnf+': (ppdu: CPA_PPDU) => unknown; // PS primitive P-CONNECT confirm accept
    'P-CONcnf-': (ppdu: CPR_PPDU) => unknown; // PS primitive P-CONNECT confirm reject
    'P-CONind': (ppdu: CP_type) => unknown; // PS primitive P-CONNECT indication
    'P-DTind': (ppdu: User_data) => unknown; // PS primitive P-DATA indication
    'P-EXind': () => unknown; // PS primitive P-EXPEDITED-DATA indication
    'P-GTind': () => unknown; // PS primitive P-TOKEN-GIVE indication
    'P-PABind': (ppdu: ARP_PPDU) => unknown; // PS primitive P-P-ABORT indication
    'P-PERind': () => unknown; // PS primitive P-P-EXCEPTION-REPORT indication
    'P-PTind': () => unknown; // PS primitive P-TOKEN-PLEASE indication
    'P-RELcnf+': (ppdu: User_data) => unknown; // PS primitive P-RELEASE confirm accept
    'P-RELcnf-': (ppdu: User_data) => unknown; // PS primitive P-RELEASE confirm reject
    'P-RELind': (ppdu: User_data) => unknown; // PS primitive P-RELEASE indication
    'P-RSYNcnf': () => unknown; // PS primitive P-RESYNCHRONIZE confirm
    'P-RSYNind': () => unknown; // PS primitive P-RESYNCHRONIZE indication
    'P-SYNMcnf': () => unknown; // PS primitive P-SYNC-MAJOR confirm
    'P-SYNMind': () => unknown; // PS primitive P-SYNC-MAJOR indication
    'P-SYNmcnf': () => unknown; // PS primitive P-SYNC-MINOR confirm
    'P-SYNmind': () => unknown; // PS primitive P-SYNC-MINOR indication
    'P-TDind': () => unknown; // PS primitive P-TYPED-DATA indication
    'P-UABind': (ppdu: ARU_PPDU) => unknown; // PS primitive P-U-ABORT indication
    'P-UERind': () => unknown; // PS primitive P-U-EXCEPTION-REPORT indication
    RS: () => unknown; // PPDU RESYNCHRONIZE
    RSA: () => unknown; // PPDU RESYNCHRONIZE acknowledge
    'S-ACTDreq': () => unknown; // SS primitive S-ACTIVITY-DISCARD request
    'S-ACTDrsp': () => unknown; // SS primitive S-ACTIVITY-DISCARD response
    'S-ACTEreq': () => unknown; // SS primitive S-ACTIVITY-END request
    'S-ACTErsp': () => unknown; // SS primitive S-ACTIVITY-END response
    'S-ACTIreq': () => unknown; // SS primitive S-ACTIVITY-INTERRUPT request
    'S-ACTIrsp': () => unknown; // SS primitive S-ACTIVITY-INTERRUPT response
    'S-ACTRreq': () => unknown; // SS primitive S-ACTIVITY-RESUME request
    'S-ACTSreq': () => unknown; // SS primitive S-ACTIVITY-START request
    'S-CGreq': () => unknown; // SS primitive S-CONTROL-GIVE request
    'S-GTreq': () => unknown; // SS primitive S-TOKEN-GIVE request
    'S-PTreq': () => unknown; // SS primitive S-TOKEN-PLEASE request
    'S-RELreq': (ppdu: User_data) => unknown; // SS primitive S-RELEASE request
    'S-RELrsp+': (ppdu?: User_data) => unknown; // SS primitive S-RELEASE response accept
    'S-RELrsp-': (ppdu?: User_data) => unknown; // SS primitive S-RELEASE response reject
    'S-RSYNreq': () => unknown; // SS primitive S-RESYNCHRONIZE request
    'S-RSYNrsp': () => unknown; // SS primitive S-RESYNCHRONIZE response
    'S-SYNMreq': () => unknown; // SS primitive S-SYNCHRONIZE-MAJOR request
    'S-SYNMrsp': () => unknown; // SS primitive S-SYNCHRONIZE-MAJOR response
    'S-SYNmreq': () => unknown; // SS primitive S-SYNCHRONIZE-MINOR request
    'S-SYNmrsp': () => unknown; // SS primitive S-SYNCHRONIZE-MINOR response
    'S-UERreq': () => unknown; // SS primitive S-U-EXCEPTION-REPORT request
    TC: () => unknown; // PPDU CAPABILITY DATA
    TCC: () => unknown; // PPDU CAPABILITY DATA ACKNOWLEDGE
    TD: (ppdu: User_data) => unknown; // PPDU DATA
    TE: () => unknown; // PPDU EXPEDITED DATA
    TTD: () => unknown; // PPDU P-TYPED DATA
}

export class PresentationLayerOutgoingEventEmitter extends TypedEmitter<PresentationLayerOutgoingEvents> {}

export interface S_CONNECT_Request {
    session_connection_identifier?: Buffer;
    calling_session_address: Buffer;
    called_session_address: Buffer;
    quality_of_service: number;
    session_requirements: number;
    first_initial_synchronization_point_serial_number?: number;
    second_initial_synchronization_point_serial_number?: number;
    initial_assignment_of_tokens?: number;
    user_data?: Buffer;
}

export interface S_CONNECT_Response {
    session_connection_identifier?: Buffer;
    responding_session_address: Buffer;
    refuse_reason?: number;
    quality_of_service: number;
    session_requirements: number;
    first_initial_synchronization_point_serial_number?: number;
    second_initial_synchronization_point_serial_number?: number;
    initial_assignment_of_tokens?: number;
    user_data?: Buffer;
}

export interface S_DATA_Request {
    user_data: Buffer;
}

export interface S_RELEASE_Request {
    user_data?: Buffer;
}

export interface S_U_ABORT_Request {
    user_data?: Buffer;
}

export interface S_P_ABORT_Request {
    reason: number;
}

export interface SessionLayer {
    request_S_CONNECT: (req: S_CONNECT_Request) => void;
    respond_S_CONNECT: (res: S_CONNECT_Response) => void;
    S_DATA: (req: S_DATA_Request) => void;
    S_RELEASE: (req: S_RELEASE_Request) => void;
    S_U_ABORT: (req: S_U_ABORT_Request) => void;
    S_P_ABORT: (req: S_P_ABORT_Request) => void;
}

// I don't really know if this is the right type for this.
export type SynchronizationPoint = number;

export type PresentationContextIdentifier = string; // String to handle large integers.

/**
 * The context sets, as defined in ITU Recommendation X.226 (1994), Section
 * A.5.2.
 */
export interface ContextSets {
    proposed_for_addition_initiated_locally: Context_list_Item[];
    proposed_for_addition_initiated_remotely: [
        item: Context_list_Item,
        accepted: Result
    ][];
    proposed_for_deletion_initiated_locally: Context_list_Item[];
    proposed_for_deletion_initiated_remotely: Context_list_Item[];
    dcs_agreed_during_connection_establishment: Map<
        PresentationContextIdentifier,
        Context_list_Item
    >;
    inter_activity_dcs: Context_list_Item[];
    contents_of_the_dcs_at_synchronization_points: Map<
        SynchronizationPoint,
        Context_list_Item[]
    >;
    default_context?: Default_context_name;
}

/**
 * An OSI presentation-layer connection.
 */
export interface PresentationConnection {
    /**
     * Outgoing events.
     */
    outgoingEvents: PresentationLayerOutgoingEventEmitter;

    /**
     * Function for selecting presentation contexts.
     */
    get_preferred_context: (
        context_list: Context_list_Item[]
    ) => Context_list_Item;

    /**
     * Function for determining whether a particular presentation context is acceptable.
     */
    is_context_acceptable: (
        abstract_syntax: OBJECT_IDENTIFIER,
        transfer_syntax: OBJECT_IDENTIFIER
    ) => boolean;

    /**
     * This connection's interface to the session-layer.
     */
    session: SessionLayer;

    /**
     * The state of the connection, as defined in the state table in
     * ITU Recommendation X.226 (1994), Annex A, Table A.17.
     */
    state: PresentationLayerState;

    /**
     * Whether activity end is pending.
     */
    aep: boolean;

    /**
     * Whether the release phase has been started.
     */
    rl: boolean;

    /**
     * Whether a collision of release requests has been detected.
     */
    cr: boolean;

    /**
     * Whether the context-management function unit is enabled.
     */
    FU_CM: boolean;

    /**
     * Whether the context-restoration function unit is enabled.
     */
    FU_CR: boolean;

    /**
     * Presentation context sets defined within this presentation connection.
     */
    contextSets: ContextSets;

    /**
     * The CP PPDU issued to create this connection. (This must be preserved
     * because it is used for determining future behavior.)
     */
    cp?: CP_type;

    /**
     * The maximum number of contexts that may appear in the context definition
     * list, or which may exist in total for this presentation connection.
     */
    max_contexts: number;

    local_selector?: Buffer;

    remote_selector?: Buffer;
}

export function createPresentationConnection(
    session: SessionLayer,
    is_context_acceptable: PresentationConnection['is_context_acceptable'],
    get_preferred_context: PresentationConnection['get_preferred_context'],
    max_contexts: number = 10
): PresentationConnection {
    const outgoingEvents = new PresentationLayerOutgoingEventEmitter();
    outgoingEvents.on('CP', (ppdu) => {
        const ssdu = Buffer.from(_encode_CP_type(ppdu, BER).toBytes());
        session.request_S_CONNECT({
            called_session_address: randomBytes(16),
            calling_session_address: randomBytes(16),
            quality_of_service: 0,
            session_requirements: 0,
            user_data: ssdu,
        });
    });
    outgoingEvents.on('CPA', (ppdu) => {
        const ssdu = Buffer.from(_encode_CPA_PPDU(ppdu, BER).toBytes());
        session.respond_S_CONNECT({
            quality_of_service: 0,
            responding_session_address: randomBytes(16),
            refuse_reason: undefined,
            session_requirements: 0,
            user_data: ssdu,
        });
    });
    outgoingEvents.on('CPR', (ppdu) => {
        const ssdu = Buffer.from(_encode_CPR_PPDU(ppdu, BER).toBytes());
        session.respond_S_CONNECT({
            quality_of_service: 0,
            responding_session_address: randomBytes(16),
            refuse_reason: 0,
            session_requirements: 0,
            user_data: ssdu,
        });
    });
    outgoingEvents.on('ARP', (ppdu) => {
        const ssdu = Buffer.from(_encode_ARP_PPDU(ppdu, BER).toBytes());
        session.S_U_ABORT({
            user_data: ssdu,
        });
    });
    outgoingEvents.on('ARU', (ppdu) => {
        const ssdu = Buffer.from(_encode_ARU_PPDU(ppdu, BER).toBytes());
        session.S_U_ABORT({
            user_data: ssdu,
        });
    });
    outgoingEvents.on('TD', (ppdu) => {
        const ssdu = Buffer.from(_encode_User_data(ppdu, BER).toBytes());
        session.S_DATA({ user_data: ssdu });
    });
    return {
        outgoingEvents,
        get_preferred_context,
        is_context_acceptable,
        session,
        state: PresentationLayerState.STAI0,
        aep: false,
        rl: false,
        cr: false,
        FU_CM: false,
        FU_CR: false,
        contextSets: {
            proposed_for_addition_initiated_locally: [],
            proposed_for_addition_initiated_remotely: [],
            proposed_for_deletion_initiated_locally: [],
            proposed_for_deletion_initiated_remotely: [],
            dcs_agreed_during_connection_establishment: new Map(),
            inter_activity_dcs: [],
            contents_of_the_dcs_at_synchronization_points: new Map(),
        },
        max_contexts,
    };
}

/**
 * @summary Procedure for handling an invalid sequence
 * @description
 *
 * The procedure defined by ITU Recommendation X.226 (1994), Section A.4.1, to
 * handle an event dispatched to a presentation connection that is not in a
 * state in which it is ready to receive that event.
 *
 * @param c The presentation connection
 * @returns
 */
export function handleInvalidSequence_P(
    c: PresentationConnection,
    provider_reason?: Abort_reason,
    event_identifier?: number
): void {
    const ppdu: ARP_PPDU = {
        provider_reason,
        event_identifier,
    };
    // This is not described in the specifications, but I believe this is a
    // requirement.
    c.state = PresentationLayerState.STAI0;
    c.outgoingEvents.emit('ARP', ppdu);
    c.outgoingEvents.emit('P-PABind', ppdu);
    return;
}

export function handleInvalidPPDU(
    c: PresentationConnection,
    event_identifier?: number
): void {
    console.error('INVALID PRESENTATION PPDU.');
    const ppdu: ARP_PPDU = {
        provider_reason: Abort_reason_invalid_ppdu_parameter_value,
        event_identifier,
    };
    // This is not described in the specifications, but I believe this is a
    // requirement.
    c.state = PresentationLayerState.STAI0;
    c.outgoingEvents.emit('ARP', ppdu);
    c.outgoingEvents.emit('P-PABind', ppdu);
    return;
}

export function getDCS(
    c: PresentationConnection,
    results: Result_list,
    c_is_initiator: boolean = false
): Map<string, Context_list_Item> | null {
    const dcs: Map<string, Context_list_Item> = new Map();
    // Index the proposed contexts by PCI.
    const proposed = c_is_initiator
        ? c.contextSets.proposed_for_addition_initiated_locally
        : c.contextSets.proposed_for_addition_initiated_remotely.map(
              (p) => p[0]
          );
    for (const cli of proposed) {
        dcs.set(cli.presentation_context_identifier.toString(), cli);
    }
    // Already asserted above that they are the same length.
    // Remove non-accepted contexts from the DCS.
    for (let i = 0; i < proposed.length; i++) {
        const result = results[i];
        if (!result) {
            return null;
        }
        if (result.result === Result_acceptance) {
            const accepted_context = dcs.get(
                proposed[i].presentation_context_identifier.toString()
            );
            if (accepted_context) {
                if (
                    accepted_context.transfer_syntax_name_list.length > 1 &&
                    !result.transfer_syntax_name
                ) {
                    // If there were multiple transfer syntaxes proposed and none explicitly accepted, it is an error.
                    return null;
                }
                if (
                    result.transfer_syntax_name &&
                    !accepted_context.transfer_syntax_name_list.some((ts) =>
                        ts.isEqualTo(result.transfer_syntax_name!)
                    )
                ) {
                    // The accepted transfer syntax was never among those proposed to begin with.
                    return null;
                }
                // We narrow down the context definition to use the single accepted transfer syntax.
                dcs.set(
                    proposed[i].presentation_context_identifier.toString(),
                    new Context_list_Item(
                        accepted_context.presentation_context_identifier,
                        accepted_context.abstract_syntax_name,
                        [results[i].transfer_syntax_name!]
                    )
                );
            } else {
                assert(false, 'Presentation context disappeared from the DCS!');
            }
        } else {
            dcs.delete(proposed[i].presentation_context_identifier.toString());
        }
    }
    return dcs;
}

// This works because this implementation currently does not support context
// management, so there simply cannot be any contexts proposed for deletion.
export function get_dcs_not_proposed_for_deletion(
    c: PresentationConnection
): Map<string, Context_list_Item> {
    return c.contextSets.dcs_agreed_during_connection_establishment;
}

// p04
// Each presentation data value is from a presentations contexts of the DCS being accepted in the presentation-
// connection establishment, or from the default context if this DCS is empty.
export function data_is_from_dcs(
    default_context_name: Default_context_name | undefined,
    dcs: Map<string, Context_list_Item>,
    user_data: User_data
): boolean {
    if ('simply_encoded_data' in user_data && !default_context_name) {
        // Use of simply encoded data when no default context is defined.
        return false;
    } else if ('fully_encoded_data' in user_data) {
        for (const pdv of user_data.fully_encoded_data) {
            const dc = dcs.get(pdv.presentation_context_identifier.toString());
            if (!dc) {
                return false;
            }
            /**
             * Technically, the transfer syntax field of a PDU is supposed to be
             * for the CP PPDU only, because contexts have not been negotiated
             * yet, so the transfer syntax used needs to be made explicit.
             *
             * However, this implementation will allow this as long as the
             * named transfer syntax was listed in the chosen presentation
             * context. (Which, in this case may be "mocked" from the parameters
             * of the CP PPDU.)
             */
            if (
                pdv.transfer_syntax_name &&
                !dc.transfer_syntax_name_list.some((tsyn) =>
                    tsyn.isEqualTo(pdv.transfer_syntax_name!)
                )
            ) {
                return false;
            }
        }
    }
    return true;
}

// p01 The presentation-connection is acceptable to the PPM (local matter).
// p02 If present, the named default context can be supported.
// p03 Each presentation data value is from a presentation context of the DCS proposed in the presentation-connection
// establishment, or from the default context if this DCS is empty.
// p04 Each presentation data value is from a presentations contexts of the DCS being accepted in the presentation-
// connection establishment, or from the default context if this DCS is empty.
// p05 Each presentation data value is from presentation contexts of the DCS, or from the default context if the DCS is
// empty.
// p06 Each presentation data value is from presentation contexts of the DCS not proposed for deletion from the DCS by
// the peer PPM.
// p07 Each presentation data value is from presentation contexts of the DCS not proposed for deletion from the DCS by
// the local PPM.
// p08 The value of cr is TRUE.
// p09 Each presentation data value is from presentation contexts of the DCS not accepted for deletion from the DCS, or
// from presentation contexts accepted for addition to the DCS, or if no such presentation contexts are available,
// from the default context.
// p11 FU(CM) is TRUE.
// p13 Each presentation data value is from the default context.
// p14 FU(CM) is false, or FU(CM) is true and typed data functional unit was selected as a User session requirement.
// p15 Each presentation data value is from presentation contexts of the DCS which was agreed during presentation-
// connection establishment, or from the default context if this DCS is empty.
// p16 Each presentation data value is from presentation contexts of the DCS associated with the pair of Old activity
// identifier and Synchronization point serial number parameter values or from the default context when this DCS is
// empty.
// p17 FU(CR) is TRUE.
// p18 Each presentation data value is in presentation contexts of the DCS associated with the syncpoint identifier or
// from the default context if this DCS is empty.
// p19 Either no syncpoint identifier is associated with a DCS or the resync identifier is not associated with a DCS and is
// greater than the lowest syncpoint identifier which has an associated DCS.
// p20 The PPDU contains a Presentation context identifier list parameter.
// p21 Each presentation data value is from presentation contexts specified in the PPDU, or from the default context if no
// presentation contexts are specified in the PPDU.
// p22 For each presentation data value, an instance (chosen as a local matter) of encoding is supported by the PPM.
// p23 For each presentation data value the encoding is supported by the PPM.
// p24 Each presentation data value is from presentation contexts of the DCS, or from presentation contexts proposed for
// addition to the DCS by the local PPM, or from the default context if either the DCS is empty or all presentation
// contexts of the DCS were proposed for deletion by the local PPM.
// p25 Each presentation data value is from presentation contexts of the DCS not proposed for deletion by the peer PPM
// or from presentation contexts proposed for addition to the DCS by the local PPM.
// p26 The syncpoint identifier has an associated DCS.
// p27 Old session connection identifier parameter present.
// p28 There is a DCS associated with the pair of Old activity identifier and Synchronization point serial number
// parameters values.
// p29 Each presentation data value is from presentation contexts of the inter-activity DCS or from the default context if
// the inter-activity DCS is empty.
// p30 The value of rs is TRUE.

// [01] Mark presentation contexts proposed for definition which provider cannot support as “provider-rejection”.
// [02] Set cr and rl to FALSE.
// [03] Record abstract and transfer syntaxes for the presentation contexts of the agreed DCS and for the default context.
// [04] Propose at least one transfer syntax for each presentation context.
// [05] Propose a transfer syntax for the default context if one is named in the request service primitive.
// [06] Select one transfer syntax for each presentation context agreed for definition and include the agreed presentation
// contexts in the DCS.
// [07] Set rl to TRUE.
// [08] If rl is TRUE then set cr to TRUE.
// [09] If aep is TRUE then:
// a) set aep to FALSE; and
// b) if FU(CR) is TRUE then the synchronization points associated with the last activity no longer have associated
// DCSs.
// [10] Record selected transfer syntax for each new presentation context and include new presentation
// [11] Remove the presentation contexts agreed for deletion from the DCS.
// [12] Record FU(f) for f in fu-dom according to the presentation requirements in the CPA PPDU.
// [13] If FU(CR) then associate the DCS with the syncpoint identifier.
// [14] If FU(CR) and an activity is in progress, set the DCS to the inter-activity DCS.
// [15] Set aep to TRUE.
// [16] Set the DCS to that associated with the syncpoint identifier.
// [17] If FU(CR) then remember the DCS as the inter-activity DCS.
// [18] Set the DCS to that agreed during presentation-connection establishment.
// [19] Eliminate any associations between syncpoint serial number and the DCS for the current activity.
// [20] Set aep to FALSE.
// [21] Set the DCS as specified by the Presentation context identifier list parameter of the PPDU.
// [22] If FU(CR), then eliminate any associations between syncpoint identifiers and DCSs.

export function dispatch_AC(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_ACA(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_ARP(c: PresentationConnection, ppdu: ARP_PPDU): void {
    c.state = PresentationLayerState.STAI0;
    c.outgoingEvents.emit('P-PABind', ppdu);
}

export function dispatch_ARU(c: PresentationConnection, ppdu: ARU_PPDU): void {
    if (!c.cp) {
        return handleInvalidSequence_P(c);
    }
    const p03: boolean =
        'normal_mode_parameters' in ppdu &&
        ppdu.normal_mode_parameters.user_data &&
        'fully_encoded_data' in ppdu.normal_mode_parameters.user_data
            ? ppdu.normal_mode_parameters.user_data.fully_encoded_data.every(
                  (ud) => {
                      const dc =
                          c.cp?.normal_mode_parameters?.presentation_context_definition_list?.find(
                              (pc) =>
                                  pc.presentation_context_identifier.toString() ===
                                  ud.presentation_context_identifier.toString()
                          );
                      // No such context assigned this identifier.
                      if (!dc) {
                          return false;
                      }
                      // No transfer syntax defined for it, so no possible discrepancy.
                      if (!ud.transfer_syntax_name) {
                          return true;
                      }
                      // If the identified context actually names the used transfer syntax, it is fine.
                      return dc.transfer_syntax_name_list.some((tsn) =>
                          tsn.isEqualTo(ud.transfer_syntax_name!)
                      );
                  }
              )
            : false;
    const dcs = c.contextSets.dcs_agreed_during_connection_establishment;
    const p05: boolean =
        'normal_mode_parameters' in ppdu &&
        ppdu.normal_mode_parameters.user_data
            ? data_is_from_dcs(
                  c.contextSets.default_context,
                  dcs,
                  ppdu.normal_mode_parameters.user_data
              )
            : true;
    const p06_dcs = get_dcs_not_proposed_for_deletion(c);
    const p06: boolean =
        'normal_mode_parameters' in ppdu &&
        ppdu.normal_mode_parameters.user_data
            ? data_is_from_dcs(
                  c.contextSets.default_context,
                  p06_dcs,
                  ppdu.normal_mode_parameters.user_data
              )
            : true;
    const ppdu_dcs =
        'normal_mode_parameters' in ppdu &&
        ppdu.normal_mode_parameters.user_data
            ? new Map(
                  ppdu.normal_mode_parameters.presentation_context_identifier_list
                      ?.map((pcid) => {
                          const key =
                              pcid.presentation_context_identifier.toString();
                          pcid.transfer_syntax_name;
                          const dc =
                              c.cp?.normal_mode_parameters?.presentation_context_definition_list?.find(
                                  (pc) =>
                                      pc.presentation_context_identifier.toString() ===
                                      key
                              );
                          if (!dc) {
                              return undefined;
                          }
                          return [
                              pcid.presentation_context_identifier.toString(),
                              new Context_list_Item(
                                  dc.presentation_context_identifier,
                                  dc.abstract_syntax_name,
                                  [pcid.transfer_syntax_name]
                              ),
                          ];
                      })
                      .filter((x): x is [string, Context_list_Item] => !!x)
              )
            : undefined;
    // Each presentation data value is from presentation contexts specified in the PPDU, or from the default context if
    // no presentation contexts are specified in the PPDU.
    const p21: boolean =
        'normal_mode_parameters' in ppdu &&
        ppdu.normal_mode_parameters.user_data &&
        ppdu_dcs
            ? data_is_from_dcs(
                  c.contextSets.default_context,
                  ppdu_dcs,
                  ppdu.normal_mode_parameters.user_data
              )
            : true;
    // For each presentation data value the encoding is supported by the PPM.
    const p23: boolean = true; // This implementation just accepts every transfer syntax.
    // Each presentation data value is from presentation contexts of the DCS, or from presentation contexts proposed
    // for addition to the DCS by the local PPM, or from the default context if either the DCS is empty or all
    // presentation contexts of the DCS were proposed for deletion by the local PPM.
    // NOTE: This is just equivalent to the DCS, since context management is unsupported.
    const p24: boolean =
        'normal_mode_parameters' in ppdu &&
        ppdu.normal_mode_parameters.user_data
            ? data_is_from_dcs(
                  c.contextSets.default_context,
                  c.contextSets.dcs_agreed_during_connection_establishment,
                  ppdu.normal_mode_parameters.user_data
              )
            : true;
    // Each presentation data value is from presentation contexts of the DCS not proposed for deletion by the peer PPM
    // or from presentation contexts proposed for addition to the DCS by the local PPM.
    // NOTE: This is just equivalent to the DCS, since context management is unsupported.
    const p25: boolean =
        'normal_mode_parameters' in ppdu &&
        ppdu.normal_mode_parameters.user_data
            ? data_is_from_dcs(
                  c.contextSets.default_context,
                  c.contextSets.dcs_agreed_during_connection_establishment,
                  ppdu.normal_mode_parameters.user_data
              )
            : true;
    switch (c.state) {
        case PresentationLayerState.STAI1: {
            if (!(p03 && p21)) {
                return handleInvalidSequence_P(c);
            }
            break;
        }
        case PresentationLayerState.STAI2: {
            if (!(p03 && p21 && p23)) {
                return handleInvalidSequence_P(c);
            }
            break;
        }
        case PresentationLayerState.STAac0: {
            if (!(p21 && p24)) {
                return handleInvalidSequence_P(c);
            }
            break;
        }
        case PresentationLayerState.STAac1: {
            if (!(p06 && p21)) {
                return handleInvalidSequence_P(c);
            }
            break;
        }
        case PresentationLayerState.STAac2: {
            if (!(p21 && p25)) {
                return handleInvalidSequence_P(c);
            }
            break;
        }
        case PresentationLayerState.STAt0: {
            if (!(p05 && p21)) {
                return handleInvalidSequence_P(c);
            }
            break;
        }
        default:
            return handleInvalidSequence_P(c);
    }
    c.state = PresentationLayerState.STAI0;
    c.outgoingEvents.emit('P-UABind', ppdu);
}

export function cp_is_acceptable(
    c: PresentationConnection,
    ppdu: CP_type
): boolean {
    if (ppdu.x410_mode_parameters) {
        return false;
    }
    // Currently, selectors are totally unrecognized.
    if (ppdu.normal_mode_parameters?.called_presentation_selector) {
        return false;
    }
    if (
        ppdu.mode_selector.mode_value !== Mode_selector_mode_value_normal_mode
    ) {
        return false;
    }
    if (!ppdu.normal_mode_parameters) {
        return false;
    }
    const context_list_length =
        ppdu.normal_mode_parameters.presentation_context_definition_list
            ?.length ?? 0;
    if (context_list_length > c.max_contexts) {
        return false;
    }
    // None of the presentation layer's defined optional functional units are supported.
    const preqs = Array.from(
        ppdu.normal_mode_parameters.presentation_requirements ?? []
    );
    if (preqs.some((bit) => bit === TRUE_BIT)) {
        return false;
    }
    // None of the session layer's defined optional functional units are supported.
    const sreqs = Array.from(
        ppdu.normal_mode_parameters.user_session_requirements ?? []
    );
    if (sreqs.some((bit) => bit === TRUE_BIT)) {
        return false;
    }
    // None of the presentation layer protocol options are supported.
    // It is not even clear in the specifications what these mean.
    const protocol_opts = Array.from(
        ppdu.normal_mode_parameters.protocol_options ?? []
    );
    if (protocol_opts.some((bit) => bit === TRUE_BIT)) {
        return false;
    }
    if (ppdu.normal_mode_parameters.initiators_nominated_context) {
        return false;
    }
    return true;
}

export function dispatch_CP(c: PresentationConnection, ppdu: CP_type): void {
    c.cp = ppdu;
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            const dcs: Map<string, Context_list_Item> = new Map();
            for (const pcd of ppdu.normal_mode_parameters
                ?.presentation_context_definition_list ?? []) {
                const pci = Number(pcd.presentation_context_identifier);
                const pci_is_odd: boolean = pci % 2 > 0;
                if (!pci_is_odd) {
                    // PCIs supplied in the CP PPDU must be odd.
                    return handleInvalidPPDU(c);
                }
                if (pcd.transfer_syntax_name_list.length === 0) {
                    return handleInvalidSequence_P(c);
                }
                const key = pcd.presentation_context_identifier.toString();
                if (dcs.has(key)) {
                    // Duplicate presentation context identifiers.
                    return handleInvalidSequence_P(c);
                }
                dcs.set(key, pcd);
            }

            const p01: boolean = cp_is_acceptable(c, ppdu);
            const p02: boolean = !!(
                !ppdu.normal_mode_parameters?.default_context_name ||
                c.is_context_acceptable(
                    ppdu.normal_mode_parameters.default_context_name
                        .abstract_syntax_name,
                    ppdu.normal_mode_parameters.default_context_name
                        .transfer_syntax_name
                )
            );
            const p03: boolean =
                !ppdu.normal_mode_parameters?.user_data ||
                ('fully_encoded_data' in
                    ppdu.normal_mode_parameters.user_data &&
                    ppdu.normal_mode_parameters.user_data.fully_encoded_data.every(
                        (ud) => {
                            const dc = dcs.get(
                                ud.presentation_context_identifier.toString()
                            );
                            // No such context assigned this identifier.
                            if (!dc) {
                                return false;
                            }
                            // No transfer syntax defined for it, so no possible discrepancy.
                            if (!ud.transfer_syntax_name) {
                                return true;
                            }
                            // If the identified context actually names the used transfer syntax, it is fine.
                            return dc.transfer_syntax_name_list.some((tsn) =>
                                tsn.isEqualTo(ud.transfer_syntax_name!)
                            );
                        }
                    ));
            const p22: boolean =
                !ppdu.normal_mode_parameters?.user_data ||
                ('fully_encoded_data' in
                    ppdu.normal_mode_parameters.user_data &&
                    ppdu.normal_mode_parameters.user_data.fully_encoded_data.some(
                        (ud) => {
                            const dc = dcs.get(
                                ud.presentation_context_identifier.toString()
                            );
                            // No such context assigned this identifier.
                            if (!dc) {
                                return false;
                            }
                            const abstract_syntax = dc.abstract_syntax_name;
                            const transfer_syntax =
                                ud.transfer_syntax_name ??
                                dc.transfer_syntax_name_list[0];
                            if (!transfer_syntax) {
                                return false;
                            }
                            return c.is_context_acceptable(
                                abstract_syntax,
                                transfer_syntax
                            );
                        }
                    ));
            if (p01 && p02 && p03 && p22) {
                c.state = PresentationLayerState.STAI2;
                if (
                    ppdu.normal_mode_parameters
                        ?.presentation_context_definition_list?.length
                ) {
                    c.contextSets.proposed_for_addition_initiated_remotely =
                        ppdu.normal_mode_parameters?.presentation_context_definition_list
                            // By default, this implementation does not reject any contexts at the provider level.
                            .map((pcd) => [pcd, Result_acceptance]);
                }
                c.cr = false;
                c.rl = false;
                c.aep = false;
                if (ppdu.normal_mode_parameters?.calling_presentation_selector) {
                    c.remote_selector = Buffer.from(ppdu.normal_mode_parameters.calling_presentation_selector);
                }
                c.outgoingEvents.emit('P-CONind', ppdu);
            } else if (!p01 || !p02 || !p22) {
                c.state = PresentationLayerState.STAI0;
                if (
                    ppdu.normal_mode_parameters
                        ?.presentation_context_definition_list?.length
                ) {
                    c.contextSets.proposed_for_addition_initiated_remotely =
                        ppdu.normal_mode_parameters?.presentation_context_definition_list
                            // By default, this implementation does not reject any contexts at the provider level.
                            .map((pcd) => [pcd, Result_acceptance]);
                }
                const cpr: CPR_PPDU = {
                    normal_mode_parameters: new CPR_PPDU_normal_mode_parameters(
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        Provider_reason_reason_not_specified,
                        undefined
                    ),
                };
                c.outgoingEvents.emit('CPR', cpr);
            } else {
                return handleInvalidSequence_P(c);
            }
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_CPA(c: PresentationConnection, cpa: CPA_PPDU): void {
    const cp = c.cp;
    if (!cp) {
        return handleInvalidSequence_P(c);
    }
    switch (c.state) {
        case PresentationLayerState.STAI1: {
            const results =
                cpa.normal_mode_parameters
                    ?.presentation_context_definition_result_list ?? [];
            if (
                c.contextSets.proposed_for_addition_initiated_locally.length !==
                results.length
            ) {
                return handleInvalidPPDU(c);
            }
            const dcs = getDCS(c, results, true);
            if (!dcs) {
                return handleInvalidPPDU(c);
            }
            const default_context =
                cp.normal_mode_parameters?.default_context_name;
            const p04: boolean = cpa.normal_mode_parameters?.user_data
                ? data_is_from_dcs(
                      default_context,
                      dcs,
                      cpa.normal_mode_parameters.user_data
                  )
                : true;
            if (!p04) {
                return handleInvalidPPDU(c);
            }
            c.contextSets.proposed_for_addition_initiated_locally = [];
            c.contextSets.dcs_agreed_during_connection_establishment = dcs;
            c.contextSets.default_context =
                cp.normal_mode_parameters?.default_context_name;
            c.FU_CM = !!(
                // CM is enabled if the first bit is set both in CP and CPA.
                (
                    cp.normal_mode_parameters?.presentation_requirements &&
                    cpa.normal_mode_parameters?.presentation_requirements &&
                    cp.normal_mode_parameters.presentation_requirements[0] &&
                    cpa.normal_mode_parameters.presentation_requirements[0]
                )
            );
            c.FU_CR = !!(
                // CM is enabled if the second bit is set both in CP and CPA.
                (
                    cp.normal_mode_parameters?.presentation_requirements &&
                    cpa.normal_mode_parameters?.presentation_requirements &&
                    cp.normal_mode_parameters.presentation_requirements[1] &&
                    cpa.normal_mode_parameters.presentation_requirements[1]
                )
            );
            c.state = PresentationLayerState.STAt0;
            if (cpa.normal_mode_parameters?.responding_presentation_selector) {
                c.remote_selector = Buffer.from(cpa.normal_mode_parameters.responding_presentation_selector);
            }
            c.outgoingEvents.emit('P-CONcnf+', cpa);
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_CPR(c: PresentationConnection, cpr: CPR_PPDU): void {
    const cp = c.cp;
    if (!cp) {
        return handleInvalidSequence_P(c);
    }
    switch (c.state) {
        case PresentationLayerState.STAI1: {
            const results =
                'normal_mode_parameters' in cpr
                    ? cpr.normal_mode_parameters
                          ?.presentation_context_definition_result_list ?? []
                    : [];
            if (
                c.contextSets.proposed_for_addition_initiated_locally.length !==
                results.length
            ) {
                return handleInvalidPPDU(c);
            }
            const dcs = getDCS(c, results, true);
            if (!dcs) {
                return handleInvalidPPDU(c);
            }
            const default_context =
                cp.normal_mode_parameters?.default_context_name;
            const p04: boolean =
                'normal_mode_parameters' in cpr &&
                cpr.normal_mode_parameters?.user_data
                    ? data_is_from_dcs(
                          default_context,
                          dcs,
                          cpr.normal_mode_parameters.user_data
                      )
                    : true;
            if (!p04) {
                return handleInvalidPPDU(c);
            }
            c.state = PresentationLayerState.STAI0;
            if (('normal_mode_parameters' in cpr) && cpr.normal_mode_parameters?.responding_presentation_selector) {
                c.remote_selector = Buffer.from(cpr.normal_mode_parameters.responding_presentation_selector);
            }
            c.outgoingEvents.emit('P-CONcnf-', cpr);
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_P_ACTDreq(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_P_ACTDrsp(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_P_ACTEreq(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_P_ACTErsp(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_P_ACTIreq(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_P_ACTIrsp(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_P_ACTRreq(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_P_ACTSreq(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_P_ALTERreq(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_P_ALTERrsp(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

// export
// function dispatch_P_CDreq (c: PresentationConnection): void {
//     switch (c.state) {
//         case (PresentationLayerState.STAac0):
//         case (PresentationLayerState.STAac1):
//         case (PresentationLayerState.STAac2):
//         case (PresentationLayerState.STAt0):
//         {
//             break;
//         }
//         default: handleInvalidSequence(c);
//     }
// }

// export
// function dispatch_P_CDrsp (c: PresentationConnection): void {
//     switch (c.state) {
//         case (PresentationLayerState.STAac0):
//         case (PresentationLayerState.STAac1):
//         case (PresentationLayerState.STAac2):
//         case (PresentationLayerState.STAt0):
//         {
//             break;
//         }
//         default: handleInvalidSequence(c);
//     }
// }

export function dispatch_P_CGreq(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_P_CONreq(
    c: PresentationConnection,
    ppdu: CP_type
): void {
    c.cp = ppdu;
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            const dcs: Map<string, Context_list_Item> = new Map();
            for (const cli of ppdu.normal_mode_parameters
                ?.presentation_context_definition_list ?? []) {
                dcs.set(cli.presentation_context_identifier.toString(), cli);
            }
            const p02: boolean = !!(
                !ppdu.normal_mode_parameters?.default_context_name ||
                c.is_context_acceptable(
                    ppdu.normal_mode_parameters.default_context_name
                        .abstract_syntax_name,
                    ppdu.normal_mode_parameters.default_context_name
                        .transfer_syntax_name
                )
            );
            const p03: boolean =
                !ppdu.normal_mode_parameters?.user_data ||
                ('fully_encoded_data' in
                    ppdu.normal_mode_parameters.user_data &&
                    ppdu.normal_mode_parameters.user_data.fully_encoded_data.every(
                        (ud) => {
                            const dc = dcs.get(
                                ud.presentation_context_identifier.toString()
                            );
                            // No such context assigned this identifier.
                            if (!dc) {
                                return false;
                            }
                            // No transfer syntax defined for it, so no possible discrepancy.
                            if (!ud.transfer_syntax_name) {
                                return true;
                            }
                            // If the identified context actually names the used transfer syntax, it is fine.
                            return dc.transfer_syntax_name_list.some((tsn) =>
                                tsn.isEqualTo(ud.transfer_syntax_name!)
                            );
                        }
                    ));
            if (!p02 || !p03) {
                return handleInvalidSequence_P(c);
            }
            // [4]: Regarding this, it is assumed that the P-CONNECT argument already contains the transfer syntaxes.
            // [5]: Again, it is assumed that the P-CONNECT argument already contains whatever default context the P-user wants.
            c.cr = false;
            c.rl = false;
            c.aep = false;
            c.contextSets.proposed_for_addition_initiated_locally =
                ppdu.normal_mode_parameters
                    ?.presentation_context_definition_list ?? [];
            c.state = PresentationLayerState.STAI1;
            if (ppdu.normal_mode_parameters?.calling_presentation_selector) {
                c.local_selector = Buffer.from(ppdu.normal_mode_parameters.calling_presentation_selector);
            }
            if (ppdu.normal_mode_parameters?.called_presentation_selector) {
                c.remote_selector = Buffer.from(ppdu.normal_mode_parameters.called_presentation_selector);
            }
            c.outgoingEvents.emit('CP', ppdu);
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_P_CONrsp_accept(
    c: PresentationConnection,
    cpa: CPA_PPDU
): void {
    if (!c.cp) {
        return;
    }
    switch (c.state) {
        case PresentationLayerState.STAI2: {
            const results =
                cpa.normal_mode_parameters
                    ?.presentation_context_definition_result_list ?? [];
            if (
                c.contextSets.proposed_for_addition_initiated_remotely
                    .length !== results.length
            ) {
                return handleInvalidPPDU(c);
            }
            const dcs = getDCS(c, results, false);
            if (!dcs) {
                return handleInvalidPPDU(c);
            }
            const default_context = c.contextSets.default_context;
            const p04: boolean = cpa.normal_mode_parameters?.user_data
                ? data_is_from_dcs(
                      default_context,
                      dcs,
                      cpa.normal_mode_parameters.user_data
                  )
                : true;
            if (!p04) {
                return handleInvalidPPDU(c);
            }
            // [6]: It is assumed that the P-CONNECT argument already contains the selected transfer syntaxes.
            c.FU_CM = !!(
                // CM is enabled if the first bit is set both in CP and CPA.
                (
                    c.cp.normal_mode_parameters?.presentation_requirements &&
                    cpa.normal_mode_parameters?.presentation_requirements &&
                    c.cp.normal_mode_parameters.presentation_requirements[0] &&
                    cpa.normal_mode_parameters.presentation_requirements[0]
                )
            );
            c.FU_CR = !!(
                // CM is enabled if the second bit is set both in CP and CPA.
                (
                    c.cp.normal_mode_parameters?.presentation_requirements &&
                    cpa.normal_mode_parameters?.presentation_requirements &&
                    c.cp.normal_mode_parameters.presentation_requirements[1] &&
                    cpa.normal_mode_parameters.presentation_requirements[1]
                )
            );
            // This step is not in the spec, but required.
            c.contextSets.dcs_agreed_during_connection_establishment = dcs;
            c.state = PresentationLayerState.STAt0;
            if (cpa.normal_mode_parameters?.responding_presentation_selector) {
                c.local_selector = Buffer.from(cpa.normal_mode_parameters.responding_presentation_selector);
            }
            c.outgoingEvents.emit('CPA', cpa);
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_P_CONrsp_reject(
    c: PresentationConnection,
    cpr: CPR_PPDU
): void {
    switch (c.state) {
        case PresentationLayerState.STAI2: {
            const results =
                'normal_mode_parameters' in cpr
                    ? cpr.normal_mode_parameters
                          .presentation_context_definition_result_list ?? []
                    : [];
            if (
                c.contextSets.proposed_for_addition_initiated_locally.length !==
                results.length
            ) {
                return handleInvalidPPDU(c);
            }
            const dcs = getDCS(c, results, false);
            const default_context = c.contextSets.default_context;
            const p04: boolean = (
                'normal_mode_parameters' in cpr
                && dcs
                && cpr.normal_mode_parameters?.user_data
            )
                ? data_is_from_dcs(
                        default_context,
                        dcs,
                        cpr.normal_mode_parameters.user_data
                    )
                : true;
            if (!p04) {
                return handleInvalidPPDU(c);
            }
            // [6]: It is assumed that the P-CONNECT argument already contains the selected transfer syntaxes.
            c.state = PresentationLayerState.STAI0;
            if (("normal_mode_parameters" in cpr) && cpr.normal_mode_parameters?.responding_presentation_selector) {
                c.local_selector = Buffer.from(cpr.normal_mode_parameters.responding_presentation_selector);
            }
            c.outgoingEvents.emit('CPR', cpr);
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_P_DTreq(
    c: PresentationConnection,
    ppdu: User_data
): void {
    const dcs = c.contextSets.dcs_agreed_during_connection_establishment;
    const p05: boolean = data_is_from_dcs(
        c.contextSets.default_context,
        dcs,
        ppdu
    );
    const p07_dcs = get_dcs_not_proposed_for_deletion(c);
    const p07: boolean = data_is_from_dcs(
        c.contextSets.default_context,
        p07_dcs,
        ppdu
    );
    switch (c.state) {
        case PresentationLayerState.STAac0:
        case PresentationLayerState.STAac2: {
            if (p07) {
                c.outgoingEvents.emit('TD', ppdu);
            } else {
                return handleInvalidSequence_P(c);
            }
            break;
        }
        case PresentationLayerState.STAac1:
        case PresentationLayerState.STAt0: {
            if (p05) {
                c.outgoingEvents.emit('TD', ppdu);
            } else {
                return handleInvalidSequence_P(c);
            }
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

// export
// function dispatch_P_EXreq (c: PresentationConnection): void {
//     switch (c.state) {
//         case (PresentationLayerState.STAac0):
//         case (PresentationLayerState.STAac1):
//         case (PresentationLayerState.STAac2):
//         case (PresentationLayerState.STAt0):
//         {
//             break;
//         }
//         default: handleInvalidSequence(c);
//     }
// }

export function dispatch_P_GTreq(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_P_PTreq(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_P_RELreq(
    c: PresentationConnection,
    ppdu: User_data
): void {
    switch (c.state) {
        case PresentationLayerState.STAac0:
        case PresentationLayerState.STAac2: {
            // Each presentation data value is from presentation contexts of the DCS not proposed for deletion from the DCS by the local PPM.
            const p07_dcs = get_dcs_not_proposed_for_deletion(c);
            const p07: boolean = data_is_from_dcs(
                c.contextSets.default_context,
                p07_dcs,
                ppdu
            );
            if (p07) {
                if (c.rl) {
                    c.cr = true;
                }
                c.rl = true;
                c.outgoingEvents.emit('S-RELreq', ppdu);
            } else {
                return handleInvalidSequence_P(c);
            }
            break;
        }
        case PresentationLayerState.STAac1:
        case PresentationLayerState.STAt0: {
            // Each presentation data value is from presentation contexts of the DCS, or from the default context if the DCS is empty.
            const dcs =
                c.contextSets.dcs_agreed_during_connection_establishment;
            const p05: boolean = data_is_from_dcs(
                c.contextSets.default_context,
                dcs,
                ppdu
            );
            if (p05) {
                if (c.rl) {
                    c.cr = true;
                }
                c.rl = true;
                c.outgoingEvents.emit('S-RELreq', ppdu);
            } else {
                return handleInvalidSequence_P(c);
            }
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_P_RELrsp_accept(
    c: PresentationConnection,
    ppdu: User_data
): void {
    switch (c.state) {
        case PresentationLayerState.STAac0:
        case PresentationLayerState.STAac2: {
            // Each presentation data value is from presentation contexts of the DCS not proposed for deletion from the DCS by the local PPM.
            const p07_dcs = get_dcs_not_proposed_for_deletion(c);
            const p07: boolean = data_is_from_dcs(
                c.contextSets.default_context,
                p07_dcs,
                ppdu
            );
            if (!p07) {
                return handleInvalidSequence_P(c);
            }
            const p08: boolean = c.cr;
            if (p08) {
                c.cr = false;
                c.rl = false;
                c.state = PresentationLayerState.STAt0;
            } else {
                c.state = PresentationLayerState.STAI0;
            }
            c.outgoingEvents.emit('S-RELrsp+', ppdu);
            break;
        }
        case PresentationLayerState.STAac1:
        case PresentationLayerState.STAt0: {
            // Each presentation data value is from presentation contexts of the DCS, or from the default context if the DCS is empty.
            const dcs =
                c.contextSets.dcs_agreed_during_connection_establishment;
            const p05: boolean = data_is_from_dcs(
                c.contextSets.default_context,
                dcs,
                ppdu
            );
            if (!p05) {
                return handleInvalidSequence_P(c);
            }
            const p08: boolean = c.cr;
            if (p08) {
                c.cr = false;
                c.rl = false;
                c.state = PresentationLayerState.STAt0;
            } else {
                c.state = PresentationLayerState.STAI0;
            }
            c.outgoingEvents.emit('S-RELrsp+', ppdu);
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_P_RELrsp_reject(
    c: PresentationConnection,
    ppdu?: User_data
): void {
    switch (c.state) {
        case PresentationLayerState.STAac0:
        case PresentationLayerState.STAac2: {
            // Each presentation data value is from presentation contexts of the DCS not proposed for deletion from the DCS by the local PPM.
            const p07_dcs = get_dcs_not_proposed_for_deletion(c);
            const p07: boolean = ppdu
                ? data_is_from_dcs(
                    c.contextSets.default_context,
                    p07_dcs,
                    ppdu
                )
                : true;
            if (!p07) {
                return handleInvalidSequence_P(c);
            }
            c.cr = false;
            c.rl = false;
            c.outgoingEvents.emit('S-RELrsp-', ppdu);
            break;
        }
        case PresentationLayerState.STAac1:
        case PresentationLayerState.STAt0: {
            // Each presentation data value is from presentation contexts of the DCS, or from the default context if the DCS is empty.
            const dcs =
                c.contextSets.dcs_agreed_during_connection_establishment;
            const p05: boolean = ppdu
                ? data_is_from_dcs(
                    c.contextSets.default_context,
                    dcs,
                    ppdu
                )
                : true;
            if (!p05) {
                return handleInvalidSequence_P(c);
            }
            c.cr = false;
            c.rl = false;
            c.outgoingEvents.emit('S-RELrsp-', ppdu);
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_P_RSYNreq(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_P_RSYNrsp(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_P_SYNMreq(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_P_SYNMrsp(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_P_SYNmreq(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_P_SYNmrsp(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

// export
// function dispatch_P_TDreq (c: PresentationConnection, ): void {
//     const dcs = c.contextSets.dcs_agreed_during_connection_establishment;
//     const p05: boolean = data_is_from_dcs(
//         c.contextSets.default_context,
//         dcs,
//         ppdu,
//     );
//     const p07_dcs = get_dcs_not_proposed_for_deletion(c);
//     const p07: boolean = data_is_from_dcs(c.contextSets.default_context, p07_dcs, ppdu);
//     switch (c.state) {
//         case (PresentationLayerState.STAac0):
//         case (PresentationLayerState.STAac1):
//         case (PresentationLayerState.STAac2):
//         case (PresentationLayerState.STAt0):
//         {
//             break;
//         }
//         default: handleInvalidSequence(c);
//     }
// }

export function dispatch_P_UABreq(
    c: PresentationConnection,
    ppdu: ARU_PPDU
): void {
    switch (c.state) {
        case PresentationLayerState.STAI1:
        case PresentationLayerState.STAI2:
        case PresentationLayerState.STAac0:
        case PresentationLayerState.STAac1:
        case PresentationLayerState.STAac2:
        case PresentationLayerState.STAt0: {
            // Each presentation data value is from a presentation context of the DCS proposed in the
            // presentation-connection establishment, or from the default context if this DCS is empty.
            // NOTE: This implementation always assumes this is true. We don't want to prohibit the
            // P-user from being able to abort a connection, even if their request to do so was incorrect.
            const p03: boolean = true;
            if (p03) {
                c.state = PresentationLayerState.STAI0;
                c.outgoingEvents.emit('ARU', ppdu);
            } else {
                return handleInvalidSequence_P(c);
            }
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_P_UERreq(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_RS(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_RSA(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_S_ACTDcnf(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_S_ACTDind(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_S_ACTEcnf(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_S_ACTEind(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_S_ACTIcnf(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_S_ACTIind(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_S_ACTRind(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_S_ACTSind(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_S_CGind(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_S_CONcnf_reject(
    c: PresentationConnection,
    ppdu: CPR_PPDU
): void {
    switch (c.state) {
        case PresentationLayerState.STAI1: {
            c.state = PresentationLayerState.STAI0;
            c.outgoingEvents.emit('P-CONcnf-', ppdu);
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_S_GTind(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_S_PABind(
    c: PresentationConnection,
    ppdu: ARP_PPDU
): void {
    c.state = PresentationLayerState.STAI0;
    c.outgoingEvents.emit('P-PABind', ppdu);
}

export function dispatch_S_PERind(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_S_PTind(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_S_RELcnf_accept(
    c: PresentationConnection,
    ppdu: User_data
): void {
    switch (c.state) {
        case PresentationLayerState.STAac0:
        case PresentationLayerState.STAt0: {
            // Each presentation data value is from presentation contexts of the DCS, or from the default context if the DCS is empty.
            const dcs =
                c.contextSets.dcs_agreed_during_connection_establishment;
            const p05: boolean = data_is_from_dcs(
                c.contextSets.default_context,
                dcs,
                ppdu
            );
            if (!p05) {
                return handleInvalidSequence_P(c);
            }
            const p08: boolean = c.cr;
            if (p08) {
                c.cr = false;
                c.rl = false;
                c.state = PresentationLayerState.STAt0;
            } else {
                c.state = PresentationLayerState.STAI0;
            }
            c.outgoingEvents.emit('P-RELcnf+', ppdu);
            break;
        }
        case PresentationLayerState.STAac1:
        case PresentationLayerState.STAac2: {
            const p06_dcs = get_dcs_not_proposed_for_deletion(c);
            const p06: boolean = data_is_from_dcs(
                c.contextSets.default_context,
                p06_dcs,
                ppdu
            );
            if (!p06) {
                return handleInvalidSequence_P(c);
            }
            const p08: boolean = c.cr;
            if (p08) {
                c.cr = false;
                c.rl = false;
                c.state = PresentationLayerState.STAt0;
            } else {
                c.state = PresentationLayerState.STAI0;
            }
            c.outgoingEvents.emit('P-RELcnf+', ppdu);
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

/*
I think the use of p05 and p06 here are spec bugs, because there is no
actual P-RELEASE PPDU. X.519 says that explicitly, but it does say that
User-data is transmitted in the S-RELEASE SPDU user data.
I also noticed that in the X.400 / P772 Wireshark sample capture that the
FINISH SPDU is sent containing a User-data parameter.
Actually, I found this in the ASN.1 module:

-- The SS-user data parameter values of all other session-service
-- primitives not described above shall be of type User-data.

So there you have it.
*/
export function dispatch_S_RELcnf_reject(
    c: PresentationConnection,
    ppdu: User_data
): void {
    switch (c.state) {
        case PresentationLayerState.STAac0:
        case PresentationLayerState.STAt0: {
            // Each presentation data value is from presentation contexts of the DCS, or from the default context if the DCS is empty.
            const dcs =
                c.contextSets.dcs_agreed_during_connection_establishment;
            const p05: boolean = data_is_from_dcs(
                c.contextSets.default_context,
                dcs,
                ppdu
            );
            if (p05) {
                c.cr = false;
                c.rl = false;
                c.outgoingEvents.emit('P-RELcnf-', ppdu);
            } else {
                return handleInvalidSequence_P(c);
            }
            break;
        }
        case PresentationLayerState.STAac1:
        case PresentationLayerState.STAac2: {
            // Each presentation data value is from presentation contexts of the DCS not proposed for deletion from the DCS by the peer PPM.
            const p06_dcs = get_dcs_not_proposed_for_deletion(c);
            const p06: boolean = data_is_from_dcs(
                c.contextSets.default_context,
                p06_dcs,
                ppdu
            );
            if (p06) {
                c.cr = false;
                c.rl = false;
                c.outgoingEvents.emit('P-RELcnf-', ppdu);
            } else {
                return handleInvalidSequence_P(c);
            }
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_S_RELind(
    c: PresentationConnection,
    ppdu: User_data
): void {
    switch (c.state) {
        case PresentationLayerState.STAac0:
        case PresentationLayerState.STAt0: {
            // Each presentation data value is from presentation contexts of the DCS, or from the default context if the DCS is empty.
            const dcs =
                c.contextSets.dcs_agreed_during_connection_establishment;
            const p05: boolean = data_is_from_dcs(
                c.contextSets.default_context,
                dcs,
                ppdu
            );
            if (p05) {
                if (c.rl) {
                    c.cr = true;
                }
                c.rl = true;
                c.outgoingEvents.emit('P-RELind', ppdu);
            } else {
                return handleInvalidSequence_P(c);
            }
            break;
        }
        case PresentationLayerState.STAac1:
        case PresentationLayerState.STAac2: {
            // Each presentation data value is from presentation contexts of the DCS not proposed for deletion from the DCS by the peer PPM.
            const p06_dcs = get_dcs_not_proposed_for_deletion(c);
            const p06: boolean = data_is_from_dcs(
                c.contextSets.default_context,
                p06_dcs,
                ppdu
            );
            if (p06) {
                if (c.rl) {
                    c.cr = true;
                }
                c.rl = true;
                c.outgoingEvents.emit('P-RELind', ppdu);
            } else {
                return handleInvalidSequence_P(c);
            }
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_S_RSYNcnf(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_S_RSYNind(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_S_SYNMcnf(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_S_SYNMind(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_S_SYNmcnf(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_S_SYNmind(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

export function dispatch_S_UERind(c: PresentationConnection): void {
    switch (c.state) {
        case PresentationLayerState.STAI0: {
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

// export
// function dispatch_TC (c: PresentationConnection): void {
//     switch (c.state) {
//         case (PresentationLayerState.STAac0):
//         case (PresentationLayerState.STAac1):
//         case (PresentationLayerState.STAac2):
//         case (PresentationLayerState.STAt0):
//         {
//             break;
//         }
//         default: handleInvalidSequence(c);
//     }
// }

// export
// function dispatch_TCC (c: PresentationConnection): void {
//     switch (c.state) {
//         case (PresentationLayerState.STAac0):
//         case (PresentationLayerState.STAac1):
//         case (PresentationLayerState.STAac2):
//         case (PresentationLayerState.STAt0):
//         {
//             break;
//         }
//         default: handleInvalidSequence(c);
//     }
// }

export function dispatch_TD(c: PresentationConnection, ppdu: User_data): void {
    const dcs = c.contextSets.dcs_agreed_during_connection_establishment;
    const p05: boolean = data_is_from_dcs(
        c.contextSets.default_context,
        dcs,
        ppdu
    );
    const p06_dcs = get_dcs_not_proposed_for_deletion(c);
    const p06: boolean = data_is_from_dcs(
        c.contextSets.default_context,
        p06_dcs,
        ppdu
    );
    switch (c.state) {
        case PresentationLayerState.STAac0:
        case PresentationLayerState.STAt0: {
            if (c.state === PresentationLayerState.STAt0 && c.aep) {
                c.aep = false;
                if (c.FU_CR) {
                    // the synchronization points associated with the last activity no longer have associated DCSs.
                }
            }
            if (p05) {
                c.outgoingEvents.emit('P-DTind', ppdu);
            } else {
                return handleInvalidSequence_P(c);
            }
            break;
        }
        case PresentationLayerState.STAac1:
        case PresentationLayerState.STAac2: {
            if (p06) {
                c.outgoingEvents.emit('P-DTind', ppdu);
            } else {
                return handleInvalidSequence_P(c);
            }
            break;
        }
        default:
            handleInvalidSequence_P(c);
    }
}

// export
// function dispatch_TE (c: PresentationConnection): void {
//     switch (c.state) {
//         case (PresentationLayerState.STAac0):
//         case (PresentationLayerState.STAac1):
//         case (PresentationLayerState.STAac2):
//         case (PresentationLayerState.STAt0):
//         {
//             break;
//         }
//         default: handleInvalidSequence(c);
//     }
// }

// export
// function dispatch_TTD (c: PresentationConnection): void {
//     switch (c.state) {
//         case (PresentationLayerState.STAac0):
//         case (PresentationLayerState.STAac1):
//         case (PresentationLayerState.STAac2):
//         case (PresentationLayerState.STAt0):
//         {
//             break;
//         }
//         default: handleInvalidSequence(c);
//     }
// }

const id_ber = new ObjectIdentifier([2, 1, 1]);
const id_acse = new ObjectIdentifier([2, 2, 1, 0, 1]);

export function get_acse_ber_context(c: PresentationConnection): Context_list_Item {
    const acse_ber_context: Context_list_Item =
        [
            ...Array.from(
                c.contextSets.dcs_agreed_during_connection_establishment.values()
            ),
            ...c.contextSets.proposed_for_addition_initiated_locally,
            ...c.contextSets.proposed_for_addition_initiated_remotely.map(
                (x) => x[0]
            ),
        ].find(
            (ctx) =>
                ctx.abstract_syntax_name.isEqualTo(id_acse) &&
                ctx.transfer_syntax_name_list.some((t) => t.isEqualTo(id_ber))
        ) ??
        /*
            ITU Recommendation X.519 (2019) requires there to be a context list
            provided in the ARU PPDU. (This might be a requirement in the X.200
            series as well, but I haven't seen it.) And this context list is
            expected to contain ACSE-BER. In this implementation, if such a
            context was never defined, we produce a random new context to at
            least communicate the application context and transfer syntax, which
            deviates from the specifications. It is the hope of this
            implementation that hosts will not allocate PCIs in the range
            of 5000-5247, so these can be used for this ad-hoc contexts.
        */
        new Context_list_Item(randomInt(5000, 5247), id_acse, [id_ber]);
    return acse_ber_context;
}
