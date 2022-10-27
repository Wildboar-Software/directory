import { TypedEmitter } from "tiny-typed-emitter";

type SerialNumber = number;

export const TIMER_TIME_IN_MS: number = 3000;

// #region protocol_version

export const SESSION_PROTOCOL_VERSION_1: number = 1;
export const SESSION_PROTOCOL_VERSION_2: number = 2;

// #endregion

// #region connection states

// Table A.2 in Annex A of ITU Rec. X.225.
// Yes, there are some numbers missing from the sequence, such as STA07 and STA17.
export
enum TableA2SessionConnectionState {
    STA01, // Idle, no transport connection
    STA01A, // Wait for the ABORT ACCEPT SPDU
    STA01B, // Wait for the T-CONNECT confirm
    STA01C, // Idle, transport connected
    STA01D, // Wait for the CONNECT DATA OVERFLOW SPDU
    STA02A, // Wait for the ACCEPT SPDU
    STA02B, // Wait for the OVERFLOW ACCEPT SPDU
    STA03, // Wait for the DISCONNECT SPDU
    STA04A, // Wait for the MAJOR SYNC ACK SPDU or PREPARE SPDU
    STA04B, // Wait for the ACTIVITY END ACK SPDU or PREPARE SPDU
    STA05A, // Wait for the RESYNCHRONIZE ACK SPDU or PREPARE SPDU
    STA05B, // Wait for the ACTIVITY INTERRUPT ACK SPDU or PREPARE SPDU
    STA05C, // Wait for the ACTIVITY DISCARD ACK SPDU or PREPARE SPDU
    STA06, // Wait for the RESYNCHRONIZE SPDU
    STA08, // Wait for S-CONNECT response
    STA09, // Wait for S-RELEASE response
    STA10A, // Wait for S-SYNC-MAJOR response
    STA10B, // Wait for S-ACTIVITY-END response
    STA11A, // Wait for S-RESYNCHRONIZE response
    STA11B, // Wait for S-ACTIVITY-INTERRUPT response
    STA11C, // Wait for S-ACTIVITY-DISCARD response
    STA15A, // After PREPARE, wait for MAJOR SYNC ACK SPDU or ACTIVITY END ACK SPDU
    STA15B, // After PREPARE, wait for RESYNCHRONIZE SPDU or ACTIVITY INTERRUPT SPDU or ACTIVITY DISCARD SPDU
    STA15C, // After PREPARE, wait for RESYNCHRONIZE ACK SPDU or ACTIVITY INTERRUPT ACK SPDU or ACTIVITY DISCARD ACK SPDU
    STA15D, // After PREPARE, wait for the ABORT SPDU
    STA16, // Wait for T-DISCONNECT indication
    STA18, // Wait for the GIVE TOKENS ACK SPDU
    STA19, // Wait for a recovery request or SPDU
    STA20, // Wait for a recovery SPDU or request
    STA21, // Wait for the CAPABILITY DATA ACK SPDU
    STA22, // Wait for S-CAPABILITY-DATA response
    STA713, // Data transfer state
}

// #endregion

// #region error_code

export const ERR_MULTIPLE_SPDU_IN_TSDU: number = -1;
export const ERR_SINGLE_SPDU_IN_TSDU: number = -2;
export const ERR_UNRECOGNIZED_SPDU: number = -3;
export const ERR_INVALID_SEQ: number = -4;
export const ERR_UNRECOGNIZED_PI: number = -5;
export const ERR_PI_LENGTH: number = -6;
export const ERR_DUPLICATE_PARAM: number = -7;
export const ERR_MISSING_REQ_PARAM: number = -8;
export const ERR_MALFORMED_PARAM: number = -9;
export const ERR_UNSUPPORTED_SPDU: number = -10;
export const ERR_UNSUPPORTED_PREPARE_TYPE: number = -11;

// #endregion error_code

// #region si

export const SI_CN_SPDU: number = 13; // CONNECT
export const SI_OA_SPDU: number = 16; // OVERFLOW ACCEPT
export const SI_CDO_SPDU: number = 15; // CONNECT DATA OVERFLOW
export const SI_AC_SPDU: number = 14; // ACCEPT
export const SI_RF_SPDU: number = 12; // REFUSE
export const SI_FN_SPDU: number = 9; // FINISH
export const SI_DN_SPDU: number = 10; // DISCONNECT
export const SI_NF_SPDU: number = 8; // NOT FINISHED
export const SI_AB_SPDU: number = 25; // ABORT
export const SI_AA_SPDU: number = 26; // ABORT ACCEPT
export const SI_DT_SPDU: number = 1; // DATA TRANSFER
export const SI_EX_SPDU: number = 5; // EXPEDITED DATA
export const SI_TD_SPDU: number = 33; // TYPED DATA
export const SI_CD_SPDU: number = 61; // CAPABILITY DATA
export const SI_CDA_SPDU: number = 62; // CAPABILITY DATA ACK
export const SI_GT_SPDU: number = 1; // GIVE TOKENS
export const SI_PT_SPDU: number = 2; // PLEASE TOKENS
export const SI_GTC_SPDU: number = 3; // GIVE TOKENS CONFIRM
export const SI_GTA_SPDU: number = 22; // GIVE TOKENS ACK
export const SI_MIP_SPDU: number = 49; // MINOR SYNC POINT
export const SI_MIA_SPDU: number = 50; // MINOR SYNC ACK
export const SI_MAP_SPDU: number = 41; // MAJOR SYNC POINT
export const SI_MAA_SPDU: number = 42; // MAJOR SYNC ACK
export const SI_RS_SPDU: number = 53; // RESYNCHRONIZE
export const SI_RA_SPDU: number = 34; // RESYNCHRONIZE ACK
export const SI_PR_SPDU: number = 7; // PREPARE
export const SI_ER_SPDU: number = 0; // EXCEPTION REPORT
export const SI_ED_SPDU: number = 48; // EXCEPTION DATA
export const SI_AS_SPDU: number = 45; // ACTIVITY START
export const SI_AR_SPDU: number = 29; // ACTIVITY RESUME
export const SI_AI_SPDU: number = 25; // ACTIVITY INTERRUPT
export const SI_AIA_SPDU: number = 26; // ACTIVITY INTERRUPT ACK
export const SI_AD_SPDU: number = 57; // ACTIVITY DISCARD
export const SI_ADA_SPDU: number = 58; // ACTIVITY DISCARD ACK
export const SI_AE_SPDU: number = SI_MAP_SPDU; // ACTIVITY END
export const SI_AEA_SPDU: number = SI_MAA_SPDU; // ACTIVITY END ACK

// Warning: GT_SPDU_SI = DT_SPDU_SI.
// Warning: AI_SPDU_SI = AB_SPDU_SI.
// Warning: AA_SPDU_SI = AIA_SPDU_SI.

export const category_0_spdus: Set<number> = new Set([
    SI_GT_SPDU,
    SI_PT_SPDU,
]);

export const category_1_spdus: Set<number> = new Set([
    SI_CN_SPDU,
    SI_OA_SPDU,
    SI_CDO_SPDU,
    SI_AC_SPDU,
    SI_RF_SPDU,
    SI_FN_SPDU,
    SI_DN_SPDU,
    SI_NF_SPDU,
    SI_AB_SPDU,
    SI_AA_SPDU,
    SI_GTC_SPDU,
    SI_GTA_SPDU,
    SI_PR_SPDU,
    SI_TD_SPDU,
]);

export const category_2_spdus: Set<number> = new Set([
    SI_DT_SPDU,
    SI_MIP_SPDU,
    SI_MIA_SPDU,
    SI_MAP_SPDU,
    SI_MAA_SPDU,
    SI_RS_SPDU,
    SI_RA_SPDU,
    SI_AS_SPDU,
    SI_AR_SPDU,
    SI_AD_SPDU,
    SI_ADA_SPDU,
    SI_AI_SPDU,
    SI_AIA_SPDU,
    SI_AE_SPDU,
    SI_AEA_SPDU,
    SI_CD_SPDU,
    SI_CDA_SPDU,
    SI_ER_SPDU,
    SI_ED_SPDU,
]);

// #endregion si

// #region pgi

export const PGI_CONNECTION_ID: number = 1;
export const PGI_CONNECT_ACCEPT: number = 5;
export const PGI_USER_DATA: number = 193;
export const PGI_EXTENDED_USER_DATA: number = 194;
export const PGI_LINKING_INFO: number = 33;

export
const pgis: Set<number> = new Set([
    PGI_CONNECTION_ID,
    PGI_CONNECT_ACCEPT,
    PGI_USER_DATA,
    PGI_EXTENDED_USER_DATA,
    PGI_LINKING_INFO,
]);

// PGIs that only contain a value, not PIs.
export
const valueOnlyPGIs: Set<number> = new Set([
    PGI_USER_DATA,
    PGI_EXTENDED_USER_DATA,
]);

// #endregion pgi

// #region

export const PI_CALLING_SS_USER_REF: number = 10;
export const PI_COMMON_REFERENCE: number = 11;
export const PI_ADDITIONAL_REF_INFO: number = 12;
export const PI_PROTOCOL_OPTIONS: number = 19;
export const PI_TSDU_MAX_SIZE: number = 21;
export const PI_VERSION_NUMBER: number = 22;
export const PI_INITIAL_SERIAL_NUMBER: number = 23;
export const PI_TOKEN_SETTING_ITEM: number = 26;
export const PI_SECOND_INITIAL_SERIAL_NUMBER: number = 55;
export const PI_UPPER_LIMIT_SERIAL_NUMBER: number = 56;
export const PI_LARGE_INITIAL_SERIAL_NUMBER: number = 57;
export const PI_LARGE_SECOND_INITIAL_SERIAL_NUMBER: number = 58;
export const PI_SESSION_USER_REQUIREMENTS: number = 20;
export const PI_CALLING_SESSION_SELECTOR: number = 51;
export const PI_CALLED_SESSION_SELECTOR: number = 52;
export const PI_RESPONDING_SESSION_SELECTOR: number = 52; // Same as PI_CALLED_SESSION_SELECTOR.
export const PI_DATA_OVERFLOW: number = 60;
export const PI_ENCLOSURE_ITEM: number = 25;
export const PI_USER_DATA: number = 22;
export const PI_CALLED_SS_USER_REF: number = 9;
export const PI_TOKEN_ITEM: number = 16;
export const PI_TRANSPORT_DISCONNECT: number = 17;
export const PI_REASON_CODE: number = 50;
export const PI_REFLECT_PARAMETER_VALUES: number = 49;
export const PI_SYNC_TYPE_ITEM: number = 15;
export const PI_SERIAL_NUMBER: number = 42;
export const PI_USER_DATA_2: number = 46;
export const PI_SECOND_SERIAL_NUMBER: number = 54;
export const PI_RESYNC_TYPE: number = 27;
export const PI_SECOND_RESYNC_TYPE: number = 53;
export const PI_PREPARE_TYPE: number = 24;
export const PI_ACTIVITY_IDENTIFIER: number = 41;
export const PI_OLD_ACTIVITY_IDENTIFIER: number = 41;
export const PI_NEW_ACTIVITY_IDENTIFIER: number = 41; // Same as PI_OLD_ACTIVITY_IDENTIFIER.

// #endregion

// #region serial_number_digits

export const SERIAL_NUMBER_DIGIT_0: number = 0b0011_0000;
export const SERIAL_NUMBER_DIGIT_1: number = 0b0011_0001;
export const SERIAL_NUMBER_DIGIT_2: number = 0b0011_0010;
export const SERIAL_NUMBER_DIGIT_3: number = 0b0011_0011;
export const SERIAL_NUMBER_DIGIT_4: number = 0b0011_0100;
export const SERIAL_NUMBER_DIGIT_5: number = 0b0011_0101;
export const SERIAL_NUMBER_DIGIT_6: number = 0b0011_0110;
export const SERIAL_NUMBER_DIGIT_7: number = 0b0011_0111;
export const SERIAL_NUMBER_DIGIT_8: number = 0b0011_1000;
export const SERIAL_NUMBER_DIGIT_9: number = 0b0011_1001;

export
const serialNumberDigitToStrDigit: Map<number, string> = new Map([
    [ SERIAL_NUMBER_DIGIT_0, "0" ],
    [ SERIAL_NUMBER_DIGIT_1, "1" ],
    [ SERIAL_NUMBER_DIGIT_2, "2" ],
    [ SERIAL_NUMBER_DIGIT_3, "3" ],
    [ SERIAL_NUMBER_DIGIT_4, "4" ],
    [ SERIAL_NUMBER_DIGIT_5, "5" ],
    [ SERIAL_NUMBER_DIGIT_6, "6" ],
    [ SERIAL_NUMBER_DIGIT_7, "7" ],
    [ SERIAL_NUMBER_DIGIT_8, "8" ],
    [ SERIAL_NUMBER_DIGIT_9, "9" ],
]);

export
const strDigitToSerialNumberDigit: Map<number, number> = new Map([
    [ "0".charCodeAt(0), SERIAL_NUMBER_DIGIT_0 ],
    [ "1".charCodeAt(0), SERIAL_NUMBER_DIGIT_1 ],
    [ "2".charCodeAt(0), SERIAL_NUMBER_DIGIT_2 ],
    [ "3".charCodeAt(0), SERIAL_NUMBER_DIGIT_3 ],
    [ "4".charCodeAt(0), SERIAL_NUMBER_DIGIT_4 ],
    [ "5".charCodeAt(0), SERIAL_NUMBER_DIGIT_5 ],
    [ "6".charCodeAt(0), SERIAL_NUMBER_DIGIT_6 ],
    [ "7".charCodeAt(0), SERIAL_NUMBER_DIGIT_7 ],
    [ "8".charCodeAt(0), SERIAL_NUMBER_DIGIT_8 ],
    [ "9".charCodeAt(0), SERIAL_NUMBER_DIGIT_9 ],
]);

// #endregion

// #region token_setting

export const TOKEN_SETTING_INITIATOR_SIDE: number = 0b00;
export const TOKEN_SETTING_RESPONDER_SIDE: number = 0b01;
export const TOKEN_SETTING_CALLED_SS_USER_CHOICE: number = 0b10;
export const TOKEN_SETTING_RESERVED: number = 0b11;

// #endregion

// #region session_user_reqs

export const SUR_HALF_DUPLEX: number = 1 << 0;
export const SUR_DUPLEX: number = 1 << 1;
export const SUR_EXPEDITED_DATA: number = 1 << 2;
export const SUR_MINOR_SYNC: number = 1 << 3;
export const SUR_MAJOR_SYNC: number = 1 << 4;
export const SUR_RESYNC: number = 1 << 5;
export const SUR_ACTIVITY_MANAGEMENT: number = 1 << 6;
export const SUR_NEGOTIATED_RELEASE: number = 1 << 7;
export const SUR_CAPABILITY_EXCHANGE: number = 1 << 8;
export const SUR_EXCEPTIONS: number = 1 << 9;
export const SUR_TYPED_DATA: number = 1 << 10;
export const SUR_SYMMETRIC_SYNC: number = 1 << 11;
export const SUR_DATA_SEPARATION: number = 1 << 12;

// #endregion session_user_reqs

// #region ABORT_transport_disconnect

export const TRANSPORT_DISCONNECT_KEPT: number = 1 << 0;
export const TRANSPORT_DISCONNECT_RELEASED: number = 1 << 1;
export const TRANSPORT_DISCONNECT_USER_ABORT: number = 1 << 2;
export const TRANSPORT_DISCONNECT_PROTOCOL_ERROR: number = 1 << 3;
export const TRANSPORT_DISCONNECT_NO_REASON: number = 1 << 4;
export const TRANSPORT_DISCONNECT_IMPLEMENTATION_RESTRICTED: number = 1 << 5;

// #endregion

// #region RESYNC_TYPE

export const RESYNC_TYPE_RESTART: number = 0;
export const RESYNC_TYPE_ABANDON: number = 1;
export const RESYNC_TYPE_SET: number = 2;

// #endregion RESYNC_TYPE

// #region PREPARE_TYPE

export const PREPARE_TYPE_MAJOR_SYNC_ACK: number = 1;
export const PREPARE_TYPE_RESYNC: number = 2;
export const PREPARE_TYPE_RESYNC_ACK: number = 3;
export const PREPARE_TYPE_ABORT: number = 4;

// #endregion

// #region reason_code

export const RC_REASON_NOT_SPECIFIED: number = 0;
export const RC_TEMPORARY_CONGESTION: number = 1;
export const RC_REJECTED_BY_CALLED_SS_USER: number = 2;
export const RC_SESSION_SELECTOR_UNKNOWN: number = 128 + 1;
export const RC_SS_USER_NOT_ATTACHED_SSAP: number = 128 + 2;
export const RC_SPM_CONGESTION_AT_CONNECT: number = 128 + 3;
export const RC_PROPOSED_PROTOCOL_VERSIONS_NOT_SUPPORTED: number = 128 + 4;
export const RC_REJECTION_BY_SPM_REASON_NOT_SPECIFIED: number = 128 + 5;
export const RC_REJECTION_BY_SPM_IMPLEMENTATION_RESTRICTION_STATED_IN_PICS: number = 128 + 6;
export const RC_NO_REASON: number = 0;
export const RC_TEMPORARILY_UNABLE_TO_CONTINUE: number = 1;
export const RC_RESERVED_2: number = 2;
export const RC_USER_SEQ_ERROR: number = 3;
export const RC_RESERVED_4: number = 4;
export const RC_LOCAL_SS_USER_ERROR: number = 5;
export const RC_UNRECOVERABLE_PROCEDURAL_ERROR: number = 6;
export const RC_DEMAND_DATA_TOKEN: number = 128;

// #endregion reason_code

// #region events

export
interface SessionLayerKernelFunctionalUnitEvents {
    CONNECT: (pdu: CONNECT_SPDU) => unknown;
    OVERFLOW_ACCEPT: (pdu: OVERFLOW_ACCEPT_SPDU) => unknown;
    CONNECT_DATA_OVERFLOW: (pdu: CONNECT_DATA_OVERFLOW_SPDU) => unknown;
    ACCEPT: (pdu: ACCEPT_SPDU) => unknown;
    REFUSE: (pdu: REFUSE_SPDU) => unknown;
    FINISH: (pdu: FINISH_SPDU) => unknown;
    DISCONNECT: (pdu: DISCONNECT_SPDU) => unknown;
    ABORT: (pdu: ABORT_SPDU) => unknown;
    ABORT_ACCEPT: (pdu: ABORT_ACCEPT_SPDU) => unknown;
    DATA_TRANSFER: (pdu: DATA_TRANSFER_SPDU) => unknown;
    PREPARE: (pdu: PREPARE_SPDU) => unknown;
}

export
interface SessionLayerEvents extends SessionLayerKernelFunctionalUnitEvents {
    TSDU: (bytes: Buffer) => unknown;
}

export
class SessionLayerEventEmitter extends TypedEmitter<SessionLayerEvents> {

}

export
interface SessionLayerIncomingEvents {
    SACTDreq: () => unknown;
    SACTDrsp: () => unknown;
    SACTEreq: () => unknown;
    SACTErsp: () => unknown;
    SACTIreq: () => unknown;
    SACTIrsp: () => unknown;
    SACTRreq: () => unknown;
    SACTSreq: () => unknown;
    SCDreq: () => unknown;
    SCDrsp: () => unknown;
    SCGreq: () => unknown;
    SCONreq: (spdu: CONNECT_SPDU) => unknown;
    SCONrsp_accept: (spdu: ACCEPT_SPDU) => unknown;
    SCONrsp_reject: () => unknown;
    SDTreq: () => unknown;
    SEXreq: () => unknown;
    SGTreq: () => unknown;
    SPTreq: () => unknown;
    SRELreq: () => unknown;
    SRELrsp_accept: () => unknown;
    SRELrsp_reject: () => unknown;
    SRSYNreq_a: () => unknown;
    SRSYNreq_r: () => unknown;
    SRSYNreq_s: () => unknown;
    SRSYNrsp: () => unknown;
    SSYNMreq: () => unknown;
    SSYNMrsp: () => unknown;
    SSYNmreq: () => unknown;
    SSYNmdreq: () => unknown;
    SSYNmrsp: () => unknown;
    STDreq: () => unknown;
    SUABreq: () => unknown;
    SUERreq: () => unknown;
    TCONind: () => unknown;
    TCONcnf: () => unknown;
    TDISind: () => unknown;
    TIM_Timer: () => unknown;
    AA: () => unknown;
    AB_nr: () => unknown;
    AB_r: () => unknown;
    AC: () => unknown;
    AD: () => unknown;
    ADA: () => unknown;
    AE: () => unknown;
    AEA: () => unknown;
    AI: () => unknown;
    AIA: () => unknown;
    AR: () => unknown;
    AS: () => unknown;
    CD: () => unknown;
    CDA: () => unknown;
    CDO: () => unknown;
    CN: () => unknown;
    DN: () => unknown;
    DT: () => unknown;
    ED: () => unknown;
    ER: () => unknown;
    EX: () => unknown;
    FN_nr: () => unknown;
    FN_r: () => unknown;
    GT: () => unknown;
    GTA: () => unknown;
    GTC: () => unknown;
    MAA: () => unknown;
    MAP: () => unknown;
    MIA: () => unknown;
    MIP: () => unknown;
    MIP_d: () => unknown;
    NF: () => unknown;
    OA: () => unknown;
    PR_AB: () => unknown;
    PR_MAA: () => unknown;
    PR_RA: () => unknown;
    PR_RS: () => unknown;
    PT: () => unknown;
    RA: () => unknown;
    RF_nr: () => unknown;
    RF_r: () => unknown;
    RS_a: () => unknown;
    RS_r: () => unknown;
    RS_s: () => unknown;
    TD: () => unknown;
}

export
interface SessionLayerOutgoingEvents {
    SACTDind: () => unknown;
    SACTDcnf: () => unknown;
    SACTEind: () => unknown;
    SACTEcnf: () => unknown;
    SACTIind: () => unknown;
    SACTIcnf: () => unknown;
    SACTRind: () => unknown;
    SACTSind: () => unknown;
    SCDind: () => unknown;
    SCDcnf: () => unknown;
    SCGind: () => unknown;
    SCONind: (cn: CONNECT_SPDU) => unknown;
    SCONcnf_accept: (spdu: ACCEPT_SPDU) => unknown;
    SCONcnf_reject: (spdu: REFUSE_SPDU) => unknown;
    SDTind: (spdu: DATA_TRANSFER_SPDU) => unknown;
    SEXind: () => unknown;
    SGTind: () => unknown;
    SPABind: () => unknown;
    SPERind: () => unknown;
    SPTind: () => unknown;
    SRELind: (spdu: FINISH_SPDU) => unknown;
    SRELcnf_accept: (spdu: DISCONNECT_SPDU) => unknown;
    SRELcnf_reject: (spdu: NOT_FINISHED_SPDU) => unknown;
    SRSYNind: () => unknown;
    SRSYNcnf: () => unknown;
    SSYNMind: () => unknown;
    SSYNMcnf: () => unknown;
    SSYNmind: () => unknown;
    SSYNmdind: () => unknown;
    SSYNmcnf: () => unknown;
    STDind: () => unknown;
    SUABind: () => unknown;
    SUERind: () => unknown;
    TCONreq: () => unknown;
    TCONrsp: () => unknown;
    TDISreq: () => unknown;
    AA: () => unknown;
    AB_nr: (spdu: ABORT_SPDU) => unknown;
    AB_r: (spdu: ABORT_SPDU) => unknown;
    AC: (spdu: ACCEPT_SPDU) => unknown; // FIXME: This appears to be unused.
    AD: () => unknown;
    ADA: () => unknown;
    AE: () => unknown;
    AEA: () => unknown;
    AI: () => unknown;
    AIA: () => unknown;
    AR: () => unknown;
    AS: () => unknown;
    CD: () => unknown;
    CDA: () => unknown;
    CDO: () => unknown;
    CN: (spdu: CONNECT_SPDU) => unknown;
    DN: (spdu: DISCONNECT_SPDU) => unknown;
    DT: (spdu: DATA_TRANSFER_SPDU) => unknown;
    ED: () => unknown;
    EX: () => unknown;
    FN_nr: (spdu: FINISH_SPDU) => unknown;
    FN_r: (spdu: FINISH_SPDU) => unknown;
    GT: () => unknown;
    GTA: () => unknown;
    GTC: () => unknown;
    MAA: () => unknown;
    MAP: () => unknown;
    MIA: () => unknown;
    MIP: () => unknown;
    MIP_d: () => unknown;
    NF: (spdu: NOT_FINISHED_SPDU) => unknown;
    OA: () => unknown;
    PR_AB: () => unknown;
    PR_MAA: () => unknown;
    PR_RA: () => unknown;
    PR_RS: () => unknown;
    PT: () => unknown;
    RA: () => unknown;
    RF_nr: (spdu: REFUSE_SPDU) => unknown;
    RF_r: (spdu: REFUSE_SPDU) => unknown;
    RS_a: () => unknown;
    RS_r: () => unknown;
    RS_s: () => unknown;
    TD: () => unknown;
    // TODO: SSDU event
}

export
class SessionLayerIncomingEventEmitter extends TypedEmitter<SessionLayerIncomingEvents> {

}

export
class SessionLayerOutgoingEventEmitter extends TypedEmitter<SessionLayerOutgoingEvents> {

}

// export
// function dispatch_SACTDreq (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_SACTDrsp (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_SACTEreq (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_SACTErsp (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_SACTIreq (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_SACTIrsp (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_SACTRreq (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_SACTSreq (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_SCDreq (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_SCDrsp (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_SCGreq (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

export
function dispatch_SCONreq (state: SessionServiceConnectionState, cn: CONNECT_SPDU): SessionServiceConnectionState {
    state.cn = cn;
    switch (state.state) {
        case (TableA2SessionConnectionState.STA01): {
            state.Vtca = false;
            state.state = TableA2SessionConnectionState.STA01B;
            state.transport.connect();
            state.outgoingEvents.emit("TCONreq");
            break;
        }
        case (TableA2SessionConnectionState.STA01C): {
            const p01: boolean = !state.Vtca;
            const p204: boolean = (cn.dataOverflow ?? 0) > 0; // More than 10240 octets of SS-user data to be transferred.
            if (p01) {
                if (p204) {
                    state.state = TableA2SessionConnectionState.STA02B; // Await OA
                } else {
                    state.state = TableA2SessionConnectionState.STA02A; // Await AC
                }
                const tsdu = encode_CONNECT_SPDU(cn);
                state.transport.writeTSDU(tsdu);
            } else {
                return handleInvalidSequence(state);
            }
            break;
        }
        default: {
            return handleInvalidSequence(state); // TODO: Will this work if not already connected?
        }
    }
    return state;
}

export
function dispatch_SCONrsp_accept (state: SessionServiceConnectionState, spdu: ACCEPT_SPDU): SessionServiceConnectionState {
    if (!state.cn) {
        return state;
    }
    switch (state.state) {
        case (TableA2SessionConnectionState.STA08): {
            // NOTE: It is not clear what to do if this is unset.
            state.V_A = spdu.connectAcceptItem?.initialSerialNumber ?? 0;
            state.V_M = spdu.connectAcceptItem?.initialSerialNumber ?? 0;
            state.V_R = 0;
            state.Vcoll = false;
            state.Vrsp = "no";
            state.Vsc = false;
            state.Vado = -1;
            state.Vadi = -1;
            state.TEXP = true; // TODO: I think this has to be set based on the connect PDU...
            state.FU = ((spdu.sessionUserRequirements ?? 0) & (state.cn.sessionUserRequirements ?? 0)) % 65535;
            state.Vact = false; // This is supposed to get set to false if FU(ACT), but it defaults to that...
            state.Vdnr = false;
            if (spdu.tokenItem) {
                const dataTokenSetting: number = (spdu.tokenItem & 0b0000_0011);
                const syncMinorTokenSetting: number = (spdu.tokenItem & 0b0000_1100) >> 2;
                const activityTokenSetting: number = (spdu.tokenItem & 0b0011_0000) >> 4;
                const releaseTokenSetting: number = (spdu.tokenItem & 0b1100_0000) >> 6;
                const settings: SessionServiceTokenPossession[] = [
                    SessionServiceTokenPossession.remote,
                    SessionServiceTokenPossession.local,
                    SessionServiceTokenPossession.remote, // TODO: Make configurable.
                    SessionServiceTokenPossession.local,
                ];
                state.dataToken = settings[dataTokenSetting];
                state.synchronizeMinorToken = settings[syncMinorTokenSetting];
                state.majorActivityToken = settings[activityTokenSetting];
                state.releaseToken = settings[releaseTokenSetting];
            } else {
                state.dataToken = SessionServiceTokenPossession.remote;
                state.synchronizeMinorToken = SessionServiceTokenPossession.remote;
                state.majorActivityToken = SessionServiceTokenPossession.remote;
                state.releaseToken = SessionServiceTokenPossession.remote;
            }
            state.state = TableA2SessionConnectionState.STA713;
            const tsdu = encode_ACCEPT_SPDU(spdu);
            state.transport.writeTSDU(tsdu);
            break;
        }
        case (TableA2SessionConnectionState.STA15D): {
            // This seems like a NOOP.
            break;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
    return state;
}

export
function dispatch_SCONrsp_reject (state: SessionServiceConnectionState, spdu: REFUSE_SPDU): SessionServiceConnectionState {
    switch (state.state) {
        case (TableA2SessionConnectionState.STA08): {
            const p02_local_choice: boolean = false;
            const p02: boolean = (p02_local_choice && !state.TEXP);
            if (p02) {
                state.state = TableA2SessionConnectionState.STA16;
                state.TIM = setTimeout(() => {
                    state.transport.disconnect();
                }, TIMER_TIME_IN_MS);
                const tsdu = encode_REFUSE_SPDU({
                    ...spdu,
                    transportDisconnect: TRANSPORT_DISCONNECT_KEPT,
                }); // RF-r
                state.transport.writeTSDU(tsdu);
            } else {
                state.state = TableA2SessionConnectionState.STA01C;
                const tsdu = encode_REFUSE_SPDU({
                    ...spdu,
                    transportDisconnect: TRANSPORT_DISCONNECT_RELEASED,
                }); // RF-nr
                state.transport.writeTSDU(tsdu);
            }
            return state;
        }
        case (TableA2SessionConnectionState.STA15D): {
            state.TIM = setTimeout(() => {
                state.transport.disconnect();
            }, TIMER_TIME_IN_MS);
            state.state = TableA2SessionConnectionState.STA16;
            return state;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
}

// TODO: Segment data?
export
function dispatch_SDTreq (state: SessionServiceConnectionState, dt: DATA_TRANSFER_SPDU): SessionServiceConnectionState {
    switch (state.state) {
        case (TableA2SessionConnectionState.STA09): {
            const p04: boolean = (
                ((state.FU & SUR_DUPLEX) > 0)
                && !state.Vcoll
            );
            if (p04) {
                const tsdu = encode_DATA_TRANSFER_SPDU(dt);
                state.transport.writeTSDU(Buffer.concat([ // TODO: REVIEW
                    Buffer.from([ 1, 0 ]), // GIVE TOKENS (GT) SPDU
                    tsdu,
                ]));
            } else {
                return handleInvalidSequence(state);
            }
            break;
        }
        case (TableA2SessionConnectionState.STA10A):
        case (TableA2SessionConnectionState.STA10B):
        case (TableA2SessionConnectionState.STA713):
        {
            const p03: boolean = ( // I(dk) = !AV(dk) OR OWNED(dk) = !FU(HD) OR OWNED(dk)
                !(state.FU & SUR_HALF_DUPLEX)
                || (state.dataToken === SessionServiceTokenPossession.local)
            );
            if (p03) {
                const tsdu = encode_DATA_TRANSFER_SPDU(dt);
                state.transport.writeTSDU(Buffer.concat([ // TODO: REVIEW
                    Buffer.from([ 1, 0 ]), // GIVE TOKENS (GT) SPDU
                    tsdu,
                ]));
            } else {
                return handleInvalidSequence(state);
            }
            break;
        }
        case (TableA2SessionConnectionState.STA15B): {
            const p03: boolean = ( // I(dk) = !AV(dk) OR OWNED(dk) = !FU(HD) OR OWNED(dk)
                !(state.FU & SUR_HALF_DUPLEX)
                || (state.dataToken === SessionServiceTokenPossession.local)
            );
            if (!p03) {
                return handleInvalidSequence(state);
            }
            break;
        }
        case (TableA2SessionConnectionState.STA15D): {
            // NOOP
            break;
        }
        case (TableA2SessionConnectionState.STA18): {
            const p70: boolean = (state.FU & SUR_DUPLEX) > 0;
            if (p70) {
                state.state = TableA2SessionConnectionState.STA18;
                const tsdu = encode_DATA_TRANSFER_SPDU(dt);
                state.transport.writeTSDU(Buffer.concat([ // TODO: REVIEW
                    Buffer.from([ 1, 0 ]), // GIVE TOKENS (GT) SPDU
                    tsdu,
                ]));
            } else {
                return handleInvalidSequence(state);
            }
            break;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
    return state;
}

// export
// function dispatch_SEXreq (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_SGTreq (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_SPTreq (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

export
function dispatch_SRELreq (state: SessionServiceConnectionState, fn: FINISH_SPDU): SessionServiceConnectionState {
    switch (state.state) {
        case (TableA2SessionConnectionState.STA09): {
            const p65: boolean = (
                (state.FU & SUR_MINOR_SYNC)
                || (state.FU & SUR_HALF_DUPLEX)
                || (state.FU & SUR_NEGOTIATED_RELEASE)
                || (state.FU & SUR_MAJOR_SYNC)
                || (state.FU & SUR_ACTIVITY_MANAGEMENT)
            ) > 0; // ANY(AV, tk-dom)
            if (p65) {
                return handleInvalidSequence(state);
            } else {
                state.Vtrr = false;
                state.Vcoll = true;
                state.state = TableA2SessionConnectionState.STA09;
                const tsdu = encode_FINISH_SPDU(fn);
                state.transport.writeTSDU(tsdu);
            }
            break;
        }
        case (TableA2SessionConnectionState.STA15B): {
            const p63: boolean = ( // ALL(I, tk-dom) & [¬FU(ACT) OR ¬Vact]
                ( // ALL(I, tk-dom) = ¬AV(t) OR OWNED(t) for all tokens
                    (!(state.FU & SUR_MINOR_SYNC) || (state.synchronizeMinorToken === SessionServiceTokenPossession.local))
                    && (!(state.FU & SUR_HALF_DUPLEX) || (state.dataToken === SessionServiceTokenPossession.local))
                    && (!(state.FU & SUR_NEGOTIATED_RELEASE) || (state.releaseToken === SessionServiceTokenPossession.local))
                    && (!(state.FU & SUR_MAJOR_SYNC) || (state.majorActivityToken === SessionServiceTokenPossession.local))
                    && (!(state.FU & SUR_ACTIVITY_MANAGEMENT) || (state.majorActivityToken === SessionServiceTokenPossession.local))
                )
                && ( // [¬FU(ACT) OR ¬Vact]
                    ((state.FU & SUR_ACTIVITY_MANAGEMENT) === 0) // ¬FU(ACT)
                    || !state.Vact
                )
            );
            if (!p63) {
                return handleInvalidSequence(state);
            }
            break;
        }
        case (TableA2SessionConnectionState.STA15D): {
            // NOOP
            break;
        }
        case (TableA2SessionConnectionState.STA713): {
            const p63: boolean = ( // ALL(I, tk-dom) & [¬FU(ACT) OR ¬Vact]
                ( // ALL(I, tk-dom) = ¬AV(t) OR OWNED(t) for all tokens
                    (!(state.FU & SUR_MINOR_SYNC) || (state.synchronizeMinorToken === SessionServiceTokenPossession.local))
                    && (!(state.FU & SUR_HALF_DUPLEX) || (state.dataToken === SessionServiceTokenPossession.local))
                    && (!(state.FU & SUR_NEGOTIATED_RELEASE) || (state.releaseToken === SessionServiceTokenPossession.local))
                    && (!(state.FU & SUR_MAJOR_SYNC) || (state.majorActivityToken === SessionServiceTokenPossession.local))
                    && (!(state.FU & SUR_ACTIVITY_MANAGEMENT) || (state.majorActivityToken === SessionServiceTokenPossession.local))
                )
                && ( // [¬FU(ACT) OR ¬Vact]
                    ((state.FU & SUR_ACTIVITY_MANAGEMENT) === 0) // ¬FU(ACT)
                    || !state.Vact
                )
            );
            const p64_local_choice: boolean = false; // TODO: Make configurable.
            const p64: boolean = (
                p64_local_choice
                && !state.Vtca
                && !state.TEXP
            );
            if (p63) {
                state.state = TableA2SessionConnectionState.STA03;
                if (p64) {
                    state.Vtrr = true;
                    const tsdu = encode_FINISH_SPDU({
                        ...fn,
                        transportDisconnect: TRANSPORT_DISCONNECT_KEPT,
                    });
                    state.transport.writeTSDU(tsdu);
                } else {
                    state.Vtrr = false;
                    const tsdu = encode_FINISH_SPDU({
                        ...fn,
                        transportDisconnect: TRANSPORT_DISCONNECT_RELEASED,
                    });
                    state.transport.writeTSDU(tsdu);
                }
            } else {
                return handleInvalidSequence(state);
            }
            break;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
    return state;
}

export
function dispatch_SRELrsp_accept (state: SessionServiceConnectionState, dn: DISCONNECT_SPDU): SessionServiceConnectionState {
    switch (state.state) {
        case (TableA2SessionConnectionState.STA09): {
            const p66: boolean = state.Vtrr;
            const p75: boolean = (state.Vcoll && state.Vdnr) || !state.Vcoll; // (Vcoll & Vdnr) OR ¬Vcoll
            const p69: boolean = state.Vcoll;
            const p01: boolean = !state.Vtca;
            if (p66) {
                state.state = TableA2SessionConnectionState.STA01C;
                const tsdu = encode_DISCONNECT_SPDU(dn);
                state.transport.writeTSDU(tsdu);
            } else if (!p66 && p75) {
                const tsdu = encode_DISCONNECT_SPDU(dn);
                state.TIM = setTimeout(() => {
                    state.transport.disconnect();
                }, TIMER_TIME_IN_MS);
                state.state = TableA2SessionConnectionState.STA16;
                state.transport.writeTSDU(tsdu);
            } else if (p69 && p01) {
                const tsdu = encode_DISCONNECT_SPDU(dn);
                state.state = TableA2SessionConnectionState.STA03;
                state.transport.writeTSDU(tsdu);
            } else {
                return handleInvalidSequence(state);
            }
            break;
        }
        case (TableA2SessionConnectionState.STA15D): {
            state.TIM = setTimeout(() => {
                state.transport.disconnect();
            }, TIMER_TIME_IN_MS);
            state.state = TableA2SessionConnectionState.STA16;
            break;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
    return state;
}

export
function dispatch_SRELrsp_reject (state: SessionServiceConnectionState, nf: NOT_FINISHED_SPDU): SessionServiceConnectionState {
    switch (state.state) {
        case (TableA2SessionConnectionState.STA09): {
            const p67: boolean = (state.FU & SUR_NEGOTIATED_RELEASE) > 0;
            if (p67) {
                state.state = TableA2SessionConnectionState.STA713;
                const tsdu = encode_NOT_FINISHED_SPDU(nf);
                state.transport.writeTSDU(tsdu);
            } else {
                return handleInvalidSequence(state);
            }
            break;
        }
        case (TableA2SessionConnectionState.STA15D): {
            // NOOP
            break;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
    return state;
}

// export
// function dispatch_SRSYNreq_a (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_SRSYNreq_r (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_SRSYNreq_s (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_SRSYNrsp (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_SSYNMreq (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_SSYNMrsp (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_SSYNmreq (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_SSYNmdreq (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_SSYNmrsp (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_STDreq (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

export
function dispatch_SUABreq (state: SessionServiceConnectionState, ab: ABORT_SPDU): SessionServiceConnectionState {
    const p02_local_choice: boolean = false;
    const p02: boolean = p02_local_choice && !state.TEXP;
    switch (state.state) {
        case (TableA2SessionConnectionState.STA06):
        case (TableA2SessionConnectionState.STA15A):
        case (TableA2SessionConnectionState.STA15B):
        case (TableA2SessionConnectionState.STA15C):
        {
            if (!p02) {
                const pr: PREPARE_SPDU = {
                    prepareType: PREPARE_TYPE_ABORT,
                };
                const pr_tsdu = encode_PREPARE_SPDU(pr);
                const ab_tsdu = encode_ABORT_SPDU({
                    ...ab,
                    transportDisconnect: TRANSPORT_DISCONNECT_RELEASED,
                });
                state.TIM = setTimeout(() => {
                    state.transport.disconnect();
                }, TIMER_TIME_IN_MS);
                state.state = TableA2SessionConnectionState.STA16;
                state.transport.writeTSDU(pr_tsdu);
                state.transport.writeTSDU(ab_tsdu);
            }
            break;
        }
        case (TableA2SessionConnectionState.STA15D): {
            state.state = TableA2SessionConnectionState.STA16;
            state.TIM = setTimeout(() => {
                state.transport.disconnect();
            }, TIMER_TIME_IN_MS);
            break;
        }
        case (TableA2SessionConnectionState.STA01B): {
            state.state = TableA2SessionConnectionState.STA01;
            state.transport.disconnect();
            break;
        }
        case (TableA2SessionConnectionState.STA02A):
        case (TableA2SessionConnectionState.STA02B):
        case (TableA2SessionConnectionState.STA03):
        case (TableA2SessionConnectionState.STA04A):
        case (TableA2SessionConnectionState.STA04B):
        case (TableA2SessionConnectionState.STA05A):
        case (TableA2SessionConnectionState.STA05B):
        case (TableA2SessionConnectionState.STA05C):
        case (TableA2SessionConnectionState.STA08):
        case (TableA2SessionConnectionState.STA09):
        case (TableA2SessionConnectionState.STA10A):
        case (TableA2SessionConnectionState.STA10B):
        case (TableA2SessionConnectionState.STA11A):
        case (TableA2SessionConnectionState.STA11B):
        case (TableA2SessionConnectionState.STA11C):
        case (TableA2SessionConnectionState.STA18):
        case (TableA2SessionConnectionState.STA19):
        case (TableA2SessionConnectionState.STA20):
        case (TableA2SessionConnectionState.STA21):
        case (TableA2SessionConnectionState.STA22):
        case (TableA2SessionConnectionState.STA713): {
            if (p02) {
                const ab_tsdu = encode_ABORT_SPDU({
                    ...ab,
                    transportDisconnect: TRANSPORT_DISCONNECT_KEPT,
                });
                state.TIM = setTimeout(() => {
                    state.transport.disconnect();
                }, TIMER_TIME_IN_MS);
                state.state = TableA2SessionConnectionState.STA01A;
                state.transport.writeTSDU(ab_tsdu);
            } else {
                const pr: PREPARE_SPDU = {
                    prepareType: PREPARE_TYPE_ABORT,
                };
                const pr_tsdu = encode_PREPARE_SPDU(pr);
                const ab_tsdu = encode_ABORT_SPDU({
                    ...ab,
                    transportDisconnect: TRANSPORT_DISCONNECT_RELEASED,
                });
                state.TIM = setTimeout(() => {
                    state.transport.disconnect();
                }, TIMER_TIME_IN_MS);
                state.state = TableA2SessionConnectionState.STA16;
                state.transport.writeTSDU(pr_tsdu);
                state.transport.writeTSDU(ab_tsdu);
            }
            break;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
    return state;
}

// export
// function dispatch_SUERreq (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

export
function dispatch_TCONind (state: SessionServiceConnectionState): SessionServiceConnectionState {
    if (state.state !== TableA2SessionConnectionState.STA01) {
        return handleInvalidSequence(state);
    }
    state.Vtca = true;
    state.state = TableA2SessionConnectionState.STA01C;
    state.outgoingEvents.emit("TCONrsp");
    return state;
}

export
function dispatch_TCONcnf (state: SessionServiceConnectionState): SessionServiceConnectionState {
    if (state.state !== TableA2SessionConnectionState.STA01B) {
        return handleInvalidSequence(state);
    }
    if (!state.cn) {
        return handleInvalidSequence(state);
    }
    const p204: boolean = (state.cn.dataOverflow ?? 0) > 0;
    if (p204) {
        state.state = TableA2SessionConnectionState.STA02B;
    } else {
        state.state = TableA2SessionConnectionState.STA02A;
    }
    state.outgoingEvents.emit("CN", state.cn);
    return state;
}

export
function dispatch_TDISind (state: SessionServiceConnectionState): SessionServiceConnectionState {
    switch (state.state) {
        case (TableA2SessionConnectionState.STA01A):
        case (TableA2SessionConnectionState.STA16):
        {
            if (state.TIM) { // [3]
                clearTimeout(state.TIM);
            }
            state.state = TableA2SessionConnectionState.STA01;
            break;
        }
        case (TableA2SessionConnectionState.STA01B): {
            state.state = TableA2SessionConnectionState.STA01;
            state.outgoingEvents.emit("SPABind");
            break;
        }
        case (TableA2SessionConnectionState.STA01C):
        case (TableA2SessionConnectionState.STA01D):
        {
            state.state = TableA2SessionConnectionState.STA01;
            break;
        }
        case (TableA2SessionConnectionState.STA02A):
        case (TableA2SessionConnectionState.STA02B):
        case (TableA2SessionConnectionState.STA03):
        case (TableA2SessionConnectionState.STA04A):
        case (TableA2SessionConnectionState.STA04B):
        case (TableA2SessionConnectionState.STA05A):
        case (TableA2SessionConnectionState.STA05B):
        case (TableA2SessionConnectionState.STA05C):
        case (TableA2SessionConnectionState.STA06):
        case (TableA2SessionConnectionState.STA08):
        case (TableA2SessionConnectionState.STA09):
        case (TableA2SessionConnectionState.STA10A):
        case (TableA2SessionConnectionState.STA10B):
        case (TableA2SessionConnectionState.STA11A):
        case (TableA2SessionConnectionState.STA11B):
        case (TableA2SessionConnectionState.STA11C):
        case (TableA2SessionConnectionState.STA15A):
        case (TableA2SessionConnectionState.STA15B):
        case (TableA2SessionConnectionState.STA15C):
        case (TableA2SessionConnectionState.STA15D):
        case (TableA2SessionConnectionState.STA18):
        case (TableA2SessionConnectionState.STA19):
        case (TableA2SessionConnectionState.STA20):
        case (TableA2SessionConnectionState.STA21):
        case (TableA2SessionConnectionState.STA22):
        case (TableA2SessionConnectionState.STA713): {
            state.state = TableA2SessionConnectionState.STA01;
            state.outgoingEvents.emit("SPABind");
            break;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
    return state;
}

export
function dispatch_TIM_Timer (state: SessionServiceConnectionState): SessionServiceConnectionState {
    switch (state.state) {
        case (TableA2SessionConnectionState.STA01A):
        case (TableA2SessionConnectionState.STA15D):
        case (TableA2SessionConnectionState.STA16):
        {
            state.state = TableA2SessionConnectionState.STA01;
            state.transport.disconnect();
            break;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
    return state;
}

export
function dispatch_AA (state: SessionServiceConnectionState): SessionServiceConnectionState {
    switch (state.state) {
        case (TableA2SessionConnectionState.STA01A): {
            if (state.TIM) {
                clearTimeout(state.TIM);
            }
            state.state = TableA2SessionConnectionState.STA01C;
            break;
        }
        case (TableA2SessionConnectionState.STA01C):
        case (TableA2SessionConnectionState.STA01D): {
            state.state = TableA2SessionConnectionState.STA01;
            state.transport.disconnect();
            break;
        }
        case (TableA2SessionConnectionState.STA16): {
            if (state.TIM) {
                clearTimeout(state.TIM);
            }
            state.state = TableA2SessionConnectionState.STA01;
            state.transport.disconnect();
            break;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
    return state;
}

export
function dispatch_AB_nr (state: SessionServiceConnectionState, spdu: ABORT_SPDU): SessionServiceConnectionState {
    const p02_local_choice: boolean = false;
    const p02: boolean = (p02_local_choice && !state.TEXP);
    switch (state.state) {
        case (TableA2SessionConnectionState.STA01A):
        case (TableA2SessionConnectionState.STA16):
        {
            if (state.TIM) {
                clearTimeout(state.TIM);
            }
            state.state = TableA2SessionConnectionState.STA01;
            state.transport.disconnect();
            break;
        }
        case (TableA2SessionConnectionState.STA01C):
        case (TableA2SessionConnectionState.STA01D): {
            state.state = TableA2SessionConnectionState.STA01;
            state.transport.disconnect();
            break;
        }
        case (TableA2SessionConnectionState.STA02A):
        case (TableA2SessionConnectionState.STA03):
        case (TableA2SessionConnectionState.STA04A):
        case (TableA2SessionConnectionState.STA04B):
        case (TableA2SessionConnectionState.STA05A):
        case (TableA2SessionConnectionState.STA05B):
        case (TableA2SessionConnectionState.STA05C):
        case (TableA2SessionConnectionState.STA08):
        case (TableA2SessionConnectionState.STA09):
        case (TableA2SessionConnectionState.STA10A):
        case (TableA2SessionConnectionState.STA10B):
        case (TableA2SessionConnectionState.STA11A):
        case (TableA2SessionConnectionState.STA11B):
        case (TableA2SessionConnectionState.STA11C):
        case (TableA2SessionConnectionState.STA18):
        case (TableA2SessionConnectionState.STA19):
        case (TableA2SessionConnectionState.STA20):
        case (TableA2SessionConnectionState.STA21):
        case (TableA2SessionConnectionState.STA22):
        case (TableA2SessionConnectionState.STA713):
        {
            if (p02) {
                state.state = TableA2SessionConnectionState.STA16;
                state.TIM = setTimeout(() => {
                    state.transport.disconnect();
                }, TIMER_TIME_IN_MS);
                state.transport.writeTSDU(Buffer.from([
                    SI_AA_SPDU,
                    0,
                ]));
            } else {
                // TODO: Emit TDISreq instead of just disconnecting.
                state.state = TableA2SessionConnectionState.STA01;
                state.transport.disconnect();
            }
            if (
                (spdu.transportDisconnect !== undefined)
                && (spdu.transportDisconnect & 0b10) // user abort
            ) {
                state.outgoingEvents.emit("SUABind");
            } else {
                state.outgoingEvents.emit("SPABind");
            }
            break;
        }
        case (TableA2SessionConnectionState.STA02B):
        case (TableA2SessionConnectionState.STA06):
        case (TableA2SessionConnectionState.STA15A):
        case (TableA2SessionConnectionState.STA15B):
        case (TableA2SessionConnectionState.STA15C):
            case (TableA2SessionConnectionState.STA15D):
        {
            state.state = TableA2SessionConnectionState.STA01;
            if (
                (spdu.transportDisconnect !== undefined)
                && (spdu.transportDisconnect & 0b10) // user abort
            ) {
                state.outgoingEvents.emit("SUABind");
            } else {
                state.outgoingEvents.emit("SPABind");
            }
            state.transport.disconnect();
            break;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
    return state;
}

export
function dispatch_AB_r (state: SessionServiceConnectionState, spdu: ABORT_SPDU): SessionServiceConnectionState {
    const p02_local_choice: boolean = false;
    const p02: boolean = (p02_local_choice && !state.TEXP);
    switch (state.state) {
        case (TableA2SessionConnectionState.STA01A): {
            if (state.TIM) {
                clearTimeout(state.TIM);
            }
            state.state = TableA2SessionConnectionState.STA01C;
            break;
        }
        case (TableA2SessionConnectionState.STA01C):
        case (TableA2SessionConnectionState.STA01D):
        {
            if (p02) {
                state.state = TableA2SessionConnectionState.STA01C;
                state.transport.writeTSDU(Buffer.from([
                    SI_AA_SPDU,
                    0,
                ]));
            } else {
                state.state = TableA2SessionConnectionState.STA01;
                state.transport.disconnect();
            }
            break;
        }
        case (TableA2SessionConnectionState.STA02A):
        case (TableA2SessionConnectionState.STA02B):
        case (TableA2SessionConnectionState.STA03):
        case (TableA2SessionConnectionState.STA04A):
        case (TableA2SessionConnectionState.STA04B):
        case (TableA2SessionConnectionState.STA05A):
        case (TableA2SessionConnectionState.STA05B):
        case (TableA2SessionConnectionState.STA05C):
        case (TableA2SessionConnectionState.STA08):
        case (TableA2SessionConnectionState.STA09):
        case (TableA2SessionConnectionState.STA10A):
        case (TableA2SessionConnectionState.STA10B):
        case (TableA2SessionConnectionState.STA11A):
        case (TableA2SessionConnectionState.STA11B):
        case (TableA2SessionConnectionState.STA11C):
        case (TableA2SessionConnectionState.STA18):
        case (TableA2SessionConnectionState.STA19):
        case (TableA2SessionConnectionState.STA20):
        case (TableA2SessionConnectionState.STA21):
        case (TableA2SessionConnectionState.STA22):
        case (TableA2SessionConnectionState.STA713):
        {
            if (p02) {
                state.state = TableA2SessionConnectionState.STA01C;
                state.transport.writeTSDU(Buffer.from([
                    SI_AA_SPDU,
                    0,
                ]));
            } else {
                state.state = TableA2SessionConnectionState.STA01;
                state.transport.disconnect();
            }
            if (
                (spdu.transportDisconnect !== undefined)
                && (spdu.transportDisconnect & 0b10) // user abort
            ) {
                state.outgoingEvents.emit("SUABind");
            } else {
                state.outgoingEvents.emit("SPABind");
            }
            break;
        }
        case (TableA2SessionConnectionState.STA16): {
            if (state.TIM) {
                clearTimeout(state.TIM);
            }
            state.state = TableA2SessionConnectionState.STA01;
            state.transport.disconnect();
            break;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
    return state;
}

export
function dispatch_AC (
    state: SessionServiceConnectionState,
    spdu: ACCEPT_SPDU,
): SessionServiceConnectionState {
    switch (state.state) {
        case (TableA2SessionConnectionState.STA01A): {
            // NOOP.
            break;
        }
        case (TableA2SessionConnectionState.STA01C): {
            state.state = TableA2SessionConnectionState.STA01;
            state.transport.disconnect();
            break;
        }
        case (TableA2SessionConnectionState.STA02A): {
            // NOTE: It is not clear what to do if this is unset.
            state.V_A = spdu.connectAcceptItem?.initialSerialNumber ?? 0;
            state.V_M = spdu.connectAcceptItem?.initialSerialNumber ?? 0;
            state.V_R = 0;
            state.Vcoll = false;
            state.Vrsp = "no";
            state.Vsc = false;
            state.Vado = -1;
            state.Vadi = -1;
            state.TEXP = true; // TODO: I think this has to be set based on the connect PDU...
            state.FU = ((spdu.sessionUserRequirements ?? 0) & (spdu.sessionUserRequirements ?? 0)) % 65535;
            state.Vact = false; // This is supposed to get set to false if FU(ACT), but it defaults to that...
            state.Vdnr = false;
            if (spdu.tokenItem) {
                const dataTokenSetting: number = (spdu.tokenItem & 0b0000_0011);
                const syncMinorTokenSetting: number = (spdu.tokenItem & 0b0000_1100) >> 2;
                const activityTokenSetting: number = (spdu.tokenItem & 0b0011_0000) >> 4;
                const releaseTokenSetting: number = (spdu.tokenItem & 0b1100_0000) >> 6;
                const settings: SessionServiceTokenPossession[] = [
                    SessionServiceTokenPossession.remote,
                    SessionServiceTokenPossession.local,
                    SessionServiceTokenPossession.local, // This should not happen.
                    SessionServiceTokenPossession.local,
                ];
                state.dataToken = settings[dataTokenSetting];
                state.synchronizeMinorToken = settings[syncMinorTokenSetting];
                state.majorActivityToken = settings[activityTokenSetting];
                state.releaseToken = settings[releaseTokenSetting];
            } else {
                state.dataToken = SessionServiceTokenPossession.local;
                state.synchronizeMinorToken = SessionServiceTokenPossession.local;
                state.majorActivityToken = SessionServiceTokenPossession.local;
                state.releaseToken = SessionServiceTokenPossession.local;
            }
            state.state = TableA2SessionConnectionState.STA713;
            state.outgoingEvents.emit("SCONcnf_accept", spdu);
            break;
        }
        case (TableA2SessionConnectionState.STA15D): {
            // NOOP.
            break;
        }
        case (TableA2SessionConnectionState.STA16): {
            // NOOP.
            break;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
    return state;
}

// export
// function dispatch_AD (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_ADA (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_AE (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_AEA (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_AI (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_AIA (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_AR (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_AS (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_CD (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_CDA (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

export
function dispatch_CDO (
    state: SessionServiceConnectionState,
    cn: CONNECT_SPDU,
    spdu: CONNECT_DATA_OVERFLOW_SPDU,
): SessionServiceConnectionState {
    switch (state.state) {
        case (TableA2SessionConnectionState.STA01C): {
            state.state = TableA2SessionConnectionState.STA01;
            state.transport.disconnect();
            break;
        }
        case (TableA2SessionConnectionState.STA01D): {
            const p202: boolean = ((spdu.enclosureItem & 0b10) > 0); // End of user data.
            // TODO: [50: Preserve user data for subsequent SCONind]
            if (p202) {
                state.state = TableA2SessionConnectionState.STA08;
                state.outgoingEvents.emit("SCONind", cn);
            } // The else condition is effectively a NOOP.
            break;
        }
        case (TableA2SessionConnectionState.STA15D): {
            // NOOP
            break;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
    return state;
}

export
function dispatch_CN (state: SessionServiceConnectionState, spdu: CONNECT_SPDU): SessionServiceConnectionState {
    state.cn = spdu;
    switch (state.state) {
        case (TableA2SessionConnectionState.STA01A): {
            if (state.TIM) {
                clearTimeout(state.TIM);
            }
            state.state = TableA2SessionConnectionState.STA01;
            state.transport.disconnect();
            break;
        }
        case (TableA2SessionConnectionState.STA01C): {
            const p02_local_choice: boolean = true; // TODO: Make this configurable.
            const p76_temporary_congestion: boolean = false;
            const p76_version_not_supported: boolean = (
                (spdu.connectAcceptItem?.versionNumber !== undefined)
                && (spdu.connectAcceptItem.versionNumber > 2)
            );
            const p01: boolean = (!state.Vtca);
            const p02: boolean = (p02_local_choice && !state.TEXP);
            const p76: boolean = (
                p76_temporary_congestion
                || p76_version_not_supported
            );
            // TODO: Configurable temporary congestion.
            // TODO: Session selector unknown?
            const p204: boolean = (spdu.dataOverflow !== undefined); // More than 10 240 octets of SS-user data to be transferred

            if (p01) { // If this SPM initiated this transport.
                state.state = TableA2SessionConnectionState.STA01;
                state.transport.disconnect(); // TDISreq
                return state;
            }

            // If this SPM did not initiate the transport, and there is no problem with the CN SPDU.
            if (!p76) {
                if (p204) { // ...and there is more than 10240 octets to transfer.
                    // FIXME: Send OA SPDU.
                    // FIXME: Specific Action 50: Preserve user data for subsequent SCONind
                    state.userDataBuffer = spdu.extendedUserData ?? spdu.userData ?? Buffer.alloc(0);
                    state.state = TableA2SessionConnectionState.STA01D;
                } else {
                    state.state = TableA2SessionConnectionState.STA08;
                    state.outgoingEvents.emit("SCONind", spdu);
                }
            } else { // There was a problem.
                if (!p02) { // ...and we are using expedited transport...
                    // FIXME: RF-nr (not reuse)
                    // FIXME: Specific Action [4]: Start timer.
                    state.state = TableA2SessionConnectionState.STA16;
                } else {
                    // FIXME: RF-r (reuse)
                    state.state = TableA2SessionConnectionState.STA01C;
                }
            }
            break;
        }
        case (TableA2SessionConnectionState.STA16): {
            if (state.TIM) {
                clearTimeout(state.TIM);
            }
            state.transport.disconnect();
            state.state = TableA2SessionConnectionState.STA01;
            break;
        }
        default: { /* NOOP or Not Possible. */}
    }
    return state;
}

export
function dispatch_DN (state: SessionServiceConnectionState, spdu: DISCONNECT_SPDU): SessionServiceConnectionState {
    switch (state.state) {
        case (TableA2SessionConnectionState.STA01A): {
            // NOOP
            break;
        }
        case (TableA2SessionConnectionState.STA01C):
        case (TableA2SessionConnectionState.STA01D): {
            state.state = TableA2SessionConnectionState.STA01;
            state.transport.disconnect();
            break;
        }
        case (TableA2SessionConnectionState.STA03): {
            const p66: boolean = state.Vtrr;
            if (p66) {
                state.state = TableA2SessionConnectionState.STA01C;
                state.outgoingEvents.emit("SRELcnf_accept", spdu);
            } else {
                state.state = TableA2SessionConnectionState.STA01;
                state.outgoingEvents.emit("SRELcnf_accept", spdu);
                state.transport.disconnect();
            }
            break;
        }
        case (TableA2SessionConnectionState.STA09): {
            const p69: boolean = state.Vcoll;
            const p01: boolean = !state.Vtca;
            if (!p69 || p01) {
                return handleInvalidSequence(state);
            }
            state.state = TableA2SessionConnectionState.STA09;
            if (!state.Vsc) {
                state.V_A = state.V_M;
            }
            state.V_M++;
            state.outgoingEvents.emit("SRELcnf_accept", spdu);
            break;
        }
        case (TableA2SessionConnectionState.STA16): {
            // NOOP
            break;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
    return state;
}

export
function dispatch_DT (state: SessionServiceConnectionState, spdu: DATA_TRANSFER_SPDU): SessionServiceConnectionState {
    const p05: boolean = (
        ((state.FU & SUR_HALF_DUPLEX) === 0) // !AV(dk)
        || (state.dataToken !== SessionServiceTokenPossession.local) // !OWNED(dk)
    ); // A(dk)
    const p81: boolean = (
        ( // ¬FU(SS) & V(Ado) ≥ V(A
            ((state.FU & SUR_SYMMETRIC_SYNC) === 0) // ¬FU(SS)
            && (state.Vado >= state.V_A) // V(Ado) ≥ V(A)
        )
        || ( // FU(SS) & V(Ado) ≥ V(As)
            ((state.FU & SUR_SYMMETRIC_SYNC) > 0) // FU(SS)
            && (state.Vado >= state.VAs) // V(Ado) ≥ V(As)
        )
    );
    const p185: boolean = state.Discard_rcv_flow && !p81;
    switch (state.state) {
        case (TableA2SessionConnectionState.STA01A): {
            // NOOP
            break;
        }
        case (TableA2SessionConnectionState.STA01C):
        case (TableA2SessionConnectionState.STA01D): {
            state.state = TableA2SessionConnectionState.STA01;
            state.transport.disconnect();
            break;
        }
        case (TableA2SessionConnectionState.STA03): {
            const p10: boolean = !state.Vcoll;
            if (p05 && p10) {
                state.outgoingEvents.emit("SDTind", spdu);
            } else {
                return handleInvalidSequence(state);
            }
            break;
        }
        case (TableA2SessionConnectionState.STA04A):
        case (TableA2SessionConnectionState.STA04B):
        case (TableA2SessionConnectionState.STA15A):
        case (TableA2SessionConnectionState.STA713):
        {
            if (p05) {
                state.outgoingEvents.emit("SDTind", spdu);
            } else {
                return handleInvalidSequence(state);
            }
            break;
        }
        case (TableA2SessionConnectionState.STA05A):
        case (TableA2SessionConnectionState.STA06):
        case (TableA2SessionConnectionState.STA15B):
        case (TableA2SessionConnectionState.STA15C):
        {
            if (p05) {
                if (p185) {
                    // NOOP
                } else {
                    state.outgoingEvents.emit("SDTind", spdu);
                }
            } else {
                return handleInvalidSequence(state);
            }
            break;
        }
        case (TableA2SessionConnectionState.STA05B):
        case (TableA2SessionConnectionState.STA05C):
        case (TableA2SessionConnectionState.STA20):
        {
            if (p05) {
                // NOOP
            } else {
                return handleInvalidSequence(state);
            }
            break;
        }
        case (TableA2SessionConnectionState.STA11A): {
            if (p05 && !p185) {
                state.outgoingEvents.emit("SDTind", spdu);
            } else {
                return handleInvalidSequence(state);
            }
            break;
        }
        case (TableA2SessionConnectionState.STA15D): {
            // NOOP
            break;
        }
        case (TableA2SessionConnectionState.STA16): {
            // NOOP
            break;
        }
        case (TableA2SessionConnectionState.STA18):
        case (TableA2SessionConnectionState.STA21):
        {
            const p70: boolean = (state.FU & SUR_DUPLEX) > 0;
            if (p70) {
                state.outgoingEvents.emit("SDTind", spdu);
            } else {
                return handleInvalidSequence(state);
            }
            break;
        }
        case (TableA2SessionConnectionState.STA19): {
            // NOOP
            break;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
    return state;
}

// export
// function dispatch_ED (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_ER (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_EX (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

export
function dispatch_FN_nr (state: SessionServiceConnectionState, spdu: FINISH_SPDU): SessionServiceConnectionState {
    switch (state.state) {
        case (TableA2SessionConnectionState.STA01A): {
            // NOOP
            break;
        }
        case (TableA2SessionConnectionState.STA01C):
        case (TableA2SessionConnectionState.STA01D): {
            state.state = TableA2SessionConnectionState.STA01;
            state.transport.disconnect();
            break;
        }
        case (TableA2SessionConnectionState.STA03): {
            const p65: boolean = !!(
                (state.FU & SUR_MINOR_SYNC)
                || (state.FU & SUR_HALF_DUPLEX)
                || (state.FU & SUR_NEGOTIATED_RELEASE)
                || (state.FU & SUR_MAJOR_SYNC)
                || (state.FU & SUR_ACTIVITY_MANAGEMENT)
            ); // ANY(AV, tk-dom)
            if (!p65) {
                state.state = TableA2SessionConnectionState.STA09;
                state.Vtrr = false;
                state.Vcoll = true;
                state.outgoingEvents.emit("SRELind", spdu);
            }
            break;
        }
        case (TableA2SessionConnectionState.STA05A):
        case (TableA2SessionConnectionState.STA06): {
            // ALL(A, tk-dom) = none of the available tokens are owned
            // And (the activity management FU is not supported OR an activity is not in  progress)
            const p68: boolean = (
                ( // ALL(A, tk-dom)
                    (!(state.FU & SUR_MINOR_SYNC) || (state.synchronizeMinorToken !== SessionServiceTokenPossession.local))
                    && (!(state.FU & SUR_HALF_DUPLEX) || (state.synchronizeMinorToken !== SessionServiceTokenPossession.local))
                    && (!(state.FU & SUR_NEGOTIATED_RELEASE) || (state.synchronizeMinorToken !== SessionServiceTokenPossession.local))
                    && (!(
                        (state.FU & SUR_MAJOR_SYNC)
                        || (state.FU & SUR_ACTIVITY_MANAGEMENT)
                    ) || (state.synchronizeMinorToken !== SessionServiceTokenPossession.local))
                )
                && ( // [¬FU(ACT) OR ¬Vact]
                    !(state.FU & SUR_ACTIVITY_MANAGEMENT)
                    || !state.Vact
                )
            );
            if (!p68) {
                return handleInvalidSequence(state);
            }
            break;
        }
        case (TableA2SessionConnectionState.STA15C): {
            // ALL(A, tk-dom) = none of the available tokens are owned
            // And (the activity management FU is not supported OR an activity is not in  progress)
            const p68: boolean = (
                ( // ALL(A, tk-dom)
                    (!(state.FU & SUR_MINOR_SYNC) || (state.synchronizeMinorToken !== SessionServiceTokenPossession.local))
                    && (!(state.FU & SUR_HALF_DUPLEX) || (state.synchronizeMinorToken !== SessionServiceTokenPossession.local))
                    && (!(state.FU & SUR_NEGOTIATED_RELEASE) || (state.synchronizeMinorToken !== SessionServiceTokenPossession.local))
                    && (!(
                        (state.FU & SUR_MAJOR_SYNC)
                        || (state.FU & SUR_ACTIVITY_MANAGEMENT)
                    ) || (state.synchronizeMinorToken !== SessionServiceTokenPossession.local))
                )
                && ( // [¬FU(ACT) OR ¬Vact]
                    !(state.FU & SUR_ACTIVITY_MANAGEMENT)
                    || !state.Vact
                )
            );
            if (!p68) { // REVIEW: Not sure how to interpret this cell.
                return handleInvalidSequence(state);
            }
            break;
        }
        case (TableA2SessionConnectionState.STA15D): {
            // NOOP
            break;
        }
        case (TableA2SessionConnectionState.STA16): {
            // NOOP
            break;
        }
        case (TableA2SessionConnectionState.STA19):
            case (TableA2SessionConnectionState.STA20):{
            // ALL(A, tk-dom) = none of the available tokens are owned
            // And (the activity management FU is not supported OR an activity is not in  progress)
            const p68: boolean = (
                ( // ALL(A, tk-dom)
                    (!(state.FU & SUR_MINOR_SYNC) || (state.synchronizeMinorToken !== SessionServiceTokenPossession.local))
                    && (!(state.FU & SUR_HALF_DUPLEX) || (state.synchronizeMinorToken !== SessionServiceTokenPossession.local))
                    && (!(state.FU & SUR_NEGOTIATED_RELEASE) || (state.synchronizeMinorToken !== SessionServiceTokenPossession.local))
                    && (!(
                        (state.FU & SUR_MAJOR_SYNC)
                        || (state.FU & SUR_ACTIVITY_MANAGEMENT)
                    ) || (state.synchronizeMinorToken !== SessionServiceTokenPossession.local))
                )
                && ( // [¬FU(ACT) OR ¬Vact]
                    !(state.FU & SUR_ACTIVITY_MANAGEMENT)
                    || !state.Vact
                )
            );
            if (!p68) {
                return handleInvalidSequence(state);
            }
            break;
        }
        case (TableA2SessionConnectionState.STA713): {
            // ALL(A, tk-dom) = none of the available tokens are owned
            // And (the activity management FU is not supported OR an activity is not in  progress)
            const p68: boolean = (
                ( // ALL(A, tk-dom)
                    (!(state.FU & SUR_MINOR_SYNC) || (state.synchronizeMinorToken !== SessionServiceTokenPossession.local))
                    && (!(state.FU & SUR_HALF_DUPLEX) || (state.synchronizeMinorToken !== SessionServiceTokenPossession.local))
                    && (!(state.FU & SUR_NEGOTIATED_RELEASE) || (state.synchronizeMinorToken !== SessionServiceTokenPossession.local))
                    && (!(
                        (state.FU & SUR_MAJOR_SYNC)
                        || (state.FU & SUR_ACTIVITY_MANAGEMENT)
                    ) || (state.synchronizeMinorToken !== SessionServiceTokenPossession.local))
                )
                && ( // [¬FU(ACT) OR ¬Vact]
                    !(state.FU & SUR_ACTIVITY_MANAGEMENT)
                    || !state.Vact
                )
            );
            if (p68) {
                state.state = TableA2SessionConnectionState.STA09;
                state.Vtrr = false;
                state.outgoingEvents.emit("SRELind", spdu);
            }
            break;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
    return state;
}

export
function dispatch_FN_r (state: SessionServiceConnectionState, spdu: FINISH_SPDU): SessionServiceConnectionState {
    switch (state.state) {
        case (TableA2SessionConnectionState.STA01A): {
            // NOOP
            break;
        }
        case (TableA2SessionConnectionState.STA01C):
        case (TableA2SessionConnectionState.STA01D): {
            state.transport.disconnect();
            state.state = TableA2SessionConnectionState.STA01;
            break;
        }
        case (TableA2SessionConnectionState.STA03): {
            const p65: boolean = !!(
                (state.FU & SUR_MINOR_SYNC)
                || (state.FU & SUR_HALF_DUPLEX)
                || (state.FU & SUR_NEGOTIATED_RELEASE)
                || (state.FU & SUR_MAJOR_SYNC)
                || (state.FU & SUR_ACTIVITY_MANAGEMENT)
            ); // ANY(AV, tk-dom)
            const p01: boolean = !state.Vtca;
            const p16: boolean = !state.TEXP;
            if (!p65 && !p01 && p16) {
                state.state = TableA2SessionConnectionState.STA09;
                state.Vtrr = false;
                state.Vcoll = true;
                state.outgoingEvents.emit("SRELind", spdu);
            }
            break;
        }
        case (TableA2SessionConnectionState.STA05A): {
            // ALL(A, tk-dom) = none of the available tokens are owned
            // And (the activity management FU is not supported OR an activity is not in  progress)
            const p68: boolean = (
                ( // ALL(A, tk-dom)
                    (!(state.FU & SUR_MINOR_SYNC) || (state.synchronizeMinorToken !== SessionServiceTokenPossession.local))
                    && (!(state.FU & SUR_HALF_DUPLEX) || (state.synchronizeMinorToken !== SessionServiceTokenPossession.local))
                    && (!(state.FU & SUR_NEGOTIATED_RELEASE) || (state.synchronizeMinorToken !== SessionServiceTokenPossession.local))
                    && (!(
                        (state.FU & SUR_MAJOR_SYNC)
                        || (state.FU & SUR_ACTIVITY_MANAGEMENT)
                    ) || (state.synchronizeMinorToken !== SessionServiceTokenPossession.local))
                )
                && ( // [¬FU(ACT) OR ¬Vact]
                    !(state.FU & SUR_ACTIVITY_MANAGEMENT)
                    || !state.Vact
                )
            );
            const p01: boolean = !state.Vtca;
            const p16: boolean = !state.TEXP;
            if (!p68 || p01 || !p16) {
                return handleInvalidSequence(state);
            }
            break;
        }
        case (TableA2SessionConnectionState.STA15C): {
            // ALL(A, tk-dom) = none of the available tokens are owned
            // And (the activity management FU is not supported OR an activity is not in  progress)
            const p68: boolean = (
                ( // ALL(A, tk-dom)
                    (!(state.FU & SUR_MINOR_SYNC) || (state.synchronizeMinorToken !== SessionServiceTokenPossession.local))
                    && (!(state.FU & SUR_HALF_DUPLEX) || (state.synchronizeMinorToken !== SessionServiceTokenPossession.local))
                    && (!(state.FU & SUR_NEGOTIATED_RELEASE) || (state.synchronizeMinorToken !== SessionServiceTokenPossession.local))
                    && (!(
                        (state.FU & SUR_MAJOR_SYNC)
                        || (state.FU & SUR_ACTIVITY_MANAGEMENT)
                    ) || (state.synchronizeMinorToken !== SessionServiceTokenPossession.local))
                )
                && ( // [¬FU(ACT) OR ¬Vact]
                    !(state.FU & SUR_ACTIVITY_MANAGEMENT)
                    || !state.Vact
                )
            );
            const p01: boolean = !state.Vtca;
            const p16: boolean = !state.TEXP;
            if (!(p68 && !p01 && p16)) { // REVIEW: Not sure how to interpret this cell.
                return handleInvalidSequence(state);
            }
            break;
        }
        case (TableA2SessionConnectionState.STA16): {
            // NOOP
            break;
        }
        case (TableA2SessionConnectionState.STA19):
            case (TableA2SessionConnectionState.STA20):{
            // ALL(A, tk-dom) = none of the available tokens are owned
            // And (the activity management FU is not supported OR an activity is not in  progress)
            const p68: boolean = (
                ( // ALL(A, tk-dom)
                    (!(state.FU & SUR_MINOR_SYNC) || (state.synchronizeMinorToken !== SessionServiceTokenPossession.local))
                    && (!(state.FU & SUR_HALF_DUPLEX) || (state.synchronizeMinorToken !== SessionServiceTokenPossession.local))
                    && (!(state.FU & SUR_NEGOTIATED_RELEASE) || (state.synchronizeMinorToken !== SessionServiceTokenPossession.local))
                    && (!(
                        (state.FU & SUR_MAJOR_SYNC)
                        || (state.FU & SUR_ACTIVITY_MANAGEMENT)
                    ) || (state.synchronizeMinorToken !== SessionServiceTokenPossession.local))
                )
                && ( // [¬FU(ACT) OR ¬Vact]
                    !(state.FU & SUR_ACTIVITY_MANAGEMENT)
                    || !state.Vact
                )
            );
            const p01: boolean = !state.Vtca;
            const p16: boolean = !state.TEXP;
            if (!(p68 && !p01 && p16)) { // REVIEW: Not sure how to interpret this cell.
                return handleInvalidSequence(state);
            }
            break;
        }
        case (TableA2SessionConnectionState.STA713): {
            // ALL(A, tk-dom) = none of the available tokens are owned
            // And (the activity management FU is not supported OR an activity is not in  progress)
            const p68: boolean = (
                ( // ALL(A, tk-dom)
                    (!(state.FU & SUR_MINOR_SYNC) || (state.synchronizeMinorToken !== SessionServiceTokenPossession.local))
                    && (!(state.FU & SUR_HALF_DUPLEX) || (state.synchronizeMinorToken !== SessionServiceTokenPossession.local))
                    && (!(state.FU & SUR_NEGOTIATED_RELEASE) || (state.synchronizeMinorToken !== SessionServiceTokenPossession.local))
                    && (!(
                        (state.FU & SUR_MAJOR_SYNC)
                        || (state.FU & SUR_ACTIVITY_MANAGEMENT)
                    ) || (state.synchronizeMinorToken !== SessionServiceTokenPossession.local))
                )
                && ( // [¬FU(ACT) OR ¬Vact]
                    !(state.FU & SUR_ACTIVITY_MANAGEMENT)
                    || !state.Vact
                )
            );
            if (p68) {
                state.Vtrr = (spdu.transportDisconnect === TRANSPORT_DISCONNECT_KEPT);
                state.state = TableA2SessionConnectionState.STA09;
                state.outgoingEvents.emit("SRELind", spdu);
            }
            break;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
    return state;
}

// export
// function dispatch_GT (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_GTA (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_GTC (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_MAA (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_MAP (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_MIA (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_MIP (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_MIP_d (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

export
function dispatch_NF (state: SessionServiceConnectionState, spdu: NOT_FINISHED_SPDU): SessionServiceConnectionState {
    switch (state.state) {
        case (TableA2SessionConnectionState.STA01A): {
            // NOOP
            break;
        }
        case (TableA2SessionConnectionState.STA01C):
        case (TableA2SessionConnectionState.STA01D): {
            state.state = TableA2SessionConnectionState.STA01;
            state.transport.disconnect();
            break;
        }
        case (TableA2SessionConnectionState.STA03): {
            const p67: boolean = false;
            if (p67) {
                state.state = TableA2SessionConnectionState.STA713;
                state.outgoingEvents.emit("SRELcnf_reject", spdu);
            }
            // TODO: Else?
            break;
        }
        case (TableA2SessionConnectionState.STA05A): {
            const p67: boolean = false;
            if (p67) {
                state.state = TableA2SessionConnectionState.STA15B;
                state.outgoingEvents.emit("SRELcnf_reject", spdu);
            }
            // TODO: Else?
            break;
        }
        case (TableA2SessionConnectionState.STA15D):
        case (TableA2SessionConnectionState.STA16): {
            // NOOP
            break;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
    return state;
}

export
function dispatch_OA (
    state: SessionServiceConnectionState,
    spdu: OVERFLOW_ACCEPT_SPDU,
    userData: Buffer, // This should include the first 10240 octets that should have already been sent.
): SessionServiceConnectionState {
    switch (state.state) {
        case (TableA2SessionConnectionState.STA01C): {
            state.state = TableA2SessionConnectionState.STA01;
            state.transport.disconnect();
            break;
        }
        case (TableA2SessionConnectionState.STA02B): {
            const tsduMaximumSize = state.tsduMaximumSize ?? 65500;
            let octetsSent: number = 10240;
            let p201: boolean = (octetsSent < userData.length);
            let first: boolean = true;
            state.state = TableA2SessionConnectionState.STA02A;
            while (p201) {
                const nextSegment = userData.subarray(octetsSent, octetsSent + tsduMaximumSize);
                octetsSent += tsduMaximumSize;
                p201 = (octetsSent < userData.length);
                const tsdu = encode_CONNECT_DATA_OVERFLOW_SPDU({
                    enclosureItem: (
                        (!p201 ? 0b10 : 0b00)
                        | (first ? 0b1 : 0b0)
                    ),
                    userData: nextSegment,
                });
                state.transport.writeTSDU(tsdu);
                first = false;
            }
            break;
        }
        case (TableA2SessionConnectionState.STA15D): {
            // This seems to be a NOOP.
            break;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
    return state;
}

export
function dispatch_PR_AB (state: SessionServiceConnectionState): SessionServiceConnectionState {
    switch (state.state) {
        case (TableA2SessionConnectionState.STA01C): {
            state.state = TableA2SessionConnectionState.STA01;
            state.transport.disconnect();
            break;
        }
        case (TableA2SessionConnectionState.STA16): {
            if (state.TIM) {
                clearTimeout(state.TIM);
            }
            state.state = TableA2SessionConnectionState.STA01;
            state.transport.disconnect();
            break;
        }
        case (TableA2SessionConnectionState.STA02A):
        case (TableA2SessionConnectionState.STA03):
        case (TableA2SessionConnectionState.STA04A):
        case (TableA2SessionConnectionState.STA04B):
        case (TableA2SessionConnectionState.STA05A):
        case (TableA2SessionConnectionState.STA05B):
        case (TableA2SessionConnectionState.STA05C):
        case (TableA2SessionConnectionState.STA06):
        case (TableA2SessionConnectionState.STA08):
        case (TableA2SessionConnectionState.STA09):
        case (TableA2SessionConnectionState.STA10A):
        case (TableA2SessionConnectionState.STA10B):
        case (TableA2SessionConnectionState.STA11A):
        case (TableA2SessionConnectionState.STA11B):
        case (TableA2SessionConnectionState.STA11C):
        case (TableA2SessionConnectionState.STA15A):
        case (TableA2SessionConnectionState.STA15B):
        case (TableA2SessionConnectionState.STA15C):
        case (TableA2SessionConnectionState.STA18):
        case (TableA2SessionConnectionState.STA19):
        case (TableA2SessionConnectionState.STA20):
        case (TableA2SessionConnectionState.STA22):
        case (TableA2SessionConnectionState.STA713):
        {
            state.state = TableA2SessionConnectionState.STA15D;
            break;
        }
    }
    return state;
}

// export
// function dispatch_PR_MAA (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_PR_RA (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_PR_RS (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_PT (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_RA (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

export
function dispatch_RF_nr (state: SessionServiceConnectionState, spdu: REFUSE_SPDU): SessionServiceConnectionState {
    switch (state.state) {
        case (TableA2SessionConnectionState.STA01A): {
            // NOOP.
            break;
        }
        case (TableA2SessionConnectionState.STA01C): {
            state.state = TableA2SessionConnectionState.STA01;
            state.transport.disconnect();
            break;
        }
        case (TableA2SessionConnectionState.STA02A): {
            state.state = TableA2SessionConnectionState.STA01;
            state.outgoingEvents.emit("SCONcnf_reject", spdu);
            state.transport.disconnect();
            break;
        }
        case (TableA2SessionConnectionState.STA02B): {
            state.state = TableA2SessionConnectionState.STA01;
            state.outgoingEvents.emit("SCONcnf_reject", spdu);
            state.transport.disconnect();
            break;
        }
        case (TableA2SessionConnectionState.STA16): {
            // NOOP.
            break;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
    return state;
}

export
function dispatch_RF_r (state: SessionServiceConnectionState, spdu: REFUSE_SPDU): SessionServiceConnectionState {
    switch (state.state) {
        case (TableA2SessionConnectionState.STA01A): {
            // NOOP.
            break;
        }
        case (TableA2SessionConnectionState.STA01C): {
            state.state = TableA2SessionConnectionState.STA01;
            state.transport.disconnect();
            break;
        }
        case (TableA2SessionConnectionState.STA02A):
        case (TableA2SessionConnectionState.STA02B): {
            const p02_local_choice: boolean = true;
            const p02: boolean = (p02_local_choice && !state.TEXP);
            if (p02) {
                state.state = TableA2SessionConnectionState.STA01C;
            } else {
                state.state = TableA2SessionConnectionState.STA01;
                state.transport.disconnect();
            }
            state.outgoingEvents.emit("SCONcnf_reject", spdu);
            break;
        }
        case (TableA2SessionConnectionState.STA16): {
            // NOOP.
            break;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
    return state;
}

// export
// function dispatch_RS_a (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_RS_r (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_RS_s (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// export
// function dispatch_TD (state: SessionServiceConnectionState): SessionServiceConnectionState {

// }

// #endregion events

// #region PDUs

export
interface ConnectionIdentifier {
    calledSSUserReference?: Buffer; // 64 octets maximum.
    callingSSUserReference?: Buffer; // 64 octets maximum.
    commonReference?: Buffer; // 64 octets maximum.
    additionalReferenceInformation?: Buffer; // 4 octets maximum.
}

export
interface ConnectAcceptItem {
    protocolOptions: number; // bit field
    tsduMaximumSize?: number; // limited to 2^32-1.
    versionNumber: number;
    initialSerialNumber?: number; // limited to 2^48-1.
    tokenSettingItem?: number; // bit field
    secondInitialSerialNumber?: number; // limited to 2^48-1.
    upperLimitSerialNumber?: number;
    largeInitialSerialNumber?: bigint;
    largeSecondInitialSerialNumber?: bigint;
}

export
interface CONNECT_SPDU {
    connectionIdentifier?: ConnectionIdentifier;
    connectAcceptItem?: ConnectAcceptItem;
    sessionUserRequirements?: number; // bit field
    callingSessionSelector?: Buffer;
    calledSessionSelector?: Buffer;
    dataOverflow?: number;
    userData?: Buffer; // 512 octets maximum
    extendedUserData?: Buffer; // 10240 octets maximum
}

export
interface OVERFLOW_ACCEPT_SPDU {
    tsduMaximumSize?: number; // 4 octets
    versionNumber: number;
}

// TODO: Forbid this SPDU if version 1 protocol is in use.
export
interface CONNECT_DATA_OVERFLOW_SPDU {
    enclosureItem: number;
    userData?: Buffer;
}

export
interface ACCEPT_SPDU {
    connectionIdentifier?: ConnectionIdentifier;
    connectAcceptItem?: ConnectAcceptItem;
    tokenItem?: number;
    sessionUserRequirements?: number;
    enclosureItem?: number;
    callingSessionSelector?: Buffer;
    respondingSessionSelector?: Buffer;
    userData?: Buffer;
}

export
interface REFUSE_SPDU {
    connectionIdentifier?: ConnectionIdentifier;
    transportDisconnect?: number;
    sessionUserRequirements?: number;
    versionNumber?: number;
    enclosureItem?: number;
    reasonCode?: number;
    reasonData?: Buffer;
    userData?: Buffer; // Can follow in certain circumstances.
}

export
interface FINISH_SPDU {
    transportDisconnect?: number;
    enclosureItem?: number;
    userData?: Buffer;
}

export
interface DISCONNECT_SPDU {
    enclosureItem?: number;
    userData?: Buffer;
}

export
interface NOT_FINISHED_SPDU {
    enclosureItem?: number;
    userData?: Buffer;
}

export
interface ABORT_SPDU {
    transportDisconnect?: number;
    enclosureItem?: number;
    reflectParameterValues?: Buffer; // 9 octets maximum
    userData?: Buffer;
}

export
interface ABORT_ACCEPT_SPDU {

}

export
interface DATA_TRANSFER_SPDU {
    enclosureItem?: number;
    userInformation: Buffer;
}

export
interface PREPARE_SPDU {
    prepareType: number;
    resyncType?: number;
    secondResyncType?: number;
}


// #endregion PDUs

// #region PDU structure

export
interface SessionParameter {
    pi: number;
    value: Buffer;
}

export
interface SessionParameterGroup {
    pgi: number;
    parameters: SessionParameter[];
    value?: Buffer;
}

export
interface SPDU {
    si: number;
    parameters: (SessionParameter | SessionParameterGroup)[];
    userInformation?: Buffer;
}

// #endregion PDU structure

// #region connection state

export
enum SessionServiceTokenPossession {
    local, // See ITU Recommendation X.215 (1995), Section 7.2, bullet point e.
    remote, // See ITU Recommendation X.215 (1995), Section 7.2, bullet point e.
}

export
enum SessionServicePhase {
    establishment,
    dataTransfer,
    release,
    disconnected,
}

export
interface SessionServicePDUParserState {
    buffer: Buffer;
    bufferIndex: number;
}

export
interface AnnexASessionState {
    /**
     * An 16-bit field for the supported functional units.
     */
    FU: number;

    /**
     * If true, use of transport expedited service is selected for use on this
     * session connection.
     */
    TEXP: boolean;

    /**
     * If true, an activity is in progress.
     */
    Vact: boolean;

    /**
     * The next value of Vact when a MAJOR SYNC ACK SPDU or an ACTIVITY END ACK
     * SPDU is sent or received.
     */
    Vnextact: boolean;

    /**
     * Indicates what kind of resynchronization is currently in progress.
     */
    Vrsp: "no" | "a" | "r" | "s" | "dsc" | "int";

    /**
     * The serial number in case of resynchronize restart.
     */
    Vrspnb: number;

    /**
     * The resync type of the sending flow.
     */
    Vrsps: AnnexASessionState["Vrsp"];

    /**
     * The resync type of the receiving flow.
     */
    Vrspr: AnnexASessionState["Vrsp"];

    /**
     * The serial number for the SPM's receiving flow in the case of
     * resynchronize restart.
     */
    Vrspnbr: number;

    /**
     * The serial number for the SPM's sending flow in the case of
     * resynchronize restart.
     */
    Vrspnbs: number;

    /**
     * Which SPM wins in a collision.
     */
    SPMWinner: boolean;

    /**
     * If true, the SPM received the T-CONNECT indication; if false, the SPM
     * initiated the T-CONNECT indication. In other words, if this is false,
     * the local SPM created the transport connection.
     */
    Vtca: boolean;

    /**
     * Whether the transport connection can be reused by the SPM for another
     * session connection.
     */
    Vtrr: boolean;

    /**
     * Whether there has been a collision of FINISH SPDUs.
     */
    Vcoll: boolean;

    /**
     * Whether a DISCONNECT SPDU has been received in STA09 (collision of
     * FINISH SPDUs).
     */
    Vdnr: boolean;

    /**
     * The lowest serial number to which a sync point confirmation is expected.
     */
    V_A: SerialNumber;

    /**
     * The next serial number to be used.
     */
    V_M: SerialNumber;

    /**
     * The lowest serial number to which resynchronization restart is permitted.
     */
    V_R: SerialNumber;

    /**
     * Whether the SS-user has the right to issue minor sync point responses
     * when V(A) is less than V(M).
     */
    Vsc: boolean;

    /**
     * The highest sync point serial number which was sent in a MINOR
     * SYNCHRONIZATION POINT SPDU with the data separation parameter set to
     * true.
     */
    Vado: SerialNumber;

    /**
     * The highest sync point serial number which was received in a MINOR
     * SYNCHRONIZATION POINT SPDU with the data separation parameter set to
     * true.
     */
    Vadi: SerialNumber;

    /**
     * The lowest serial number on the SPM's sending data flow to which a
     * sync point confirmation is expected to be received.
     */
    VAs: SerialNumber;

    /**
     * The lowest serial number on the SPM's receiving data flow for which a
     * confirmation has not yet been sent.
     */
    VAr: SerialNumber;

    /**
     * The serial number of the next sync point to be sent.
     */
    VMs: SerialNumber;

    /**
     * The serial number of the next sync point to be received.
     */
    VMr: SerialNumber;

    /**
     * The lowest serial number on the SPM's sending data flow to which resync
     * restart is permitted.
     */
    VRs: SerialNumber;

    /**
     * The lowest serial number on the SPM's receiving data flow to which resync
     * restart is permitted.
     */
    VRr: SerialNumber;

    /**
     * Whether the receiving flow is in the process of resynchronization.
     */
    Discard_rcv_flow: boolean;

    /**
     * Whether the sending flow is in the process of resynchronization.
     */
    Discard_snd_flow: boolean;
}

export
interface TransportLayer {
    connected: () => boolean,
    writeTSDU: (tsdu: Buffer) => unknown;
    connect: () => unknown;
    disconnect: () => unknown;
}

export
interface SessionServiceConnectionState extends SessionServicePDUParserState, AnnexASessionState {
    version: number;
    caller: boolean;
    state: TableA2SessionConnectionState;
    phase: SessionServicePhase;
    disconnectReason?: number;
    dataToken?: SessionServiceTokenPossession;
    releaseToken?: SessionServiceTokenPossession;
    synchronizeMinorToken?: SessionServiceTokenPossession;
    majorActivityToken?: SessionServiceTokenPossession;
    transport: TransportLayer;
    tsduMaximumSize?: number;
    cn?: CONNECT_SPDU; // FIXME: Clean up after disconnect.

    /**
     * Detailed in [ITU Recommendation X.225 (1995)](https://www.itu.int/rec/T-REC-X.225/en),
     * Section 7.9.2. This timeout is used to control when the SPM "gives up"
     * waiting for an ABORT ACCEPT or a T-DISCONNECT.
     */
    TIM?: NodeJS.Timeout;

    connectData: Buffer;
    userDataBuffer: Buffer;
    outgoingEvents: SessionLayerOutgoingEventEmitter;
}

export
function newSessionConnection (
    transport: TransportLayer,
    caller: boolean = true,
    transportCaller: boolean = false,
): SessionServiceConnectionState {
    const outgoingEvents = new SessionLayerOutgoingEventEmitter();
    outgoingEvents.on("CN", (spdu) => transport.writeTSDU(encode_CONNECT_SPDU(spdu)));
    // outgoingEvents.on("OA", (cn) => transport.writeTSDU(encode_O(cn)));
    outgoingEvents.on("AC", (spdu) => transport.writeTSDU(encode_ACCEPT_SPDU(spdu)));
    outgoingEvents.on("RF_nr", (spdu) => transport.writeTSDU(encode_REFUSE_SPDU(spdu)));
    outgoingEvents.on("RF_r", (spdu) => transport.writeTSDU(encode_REFUSE_SPDU(spdu)));
    outgoingEvents.on("FN_nr", (spdu) => transport.writeTSDU(encode_FINISH_SPDU(spdu)));
    outgoingEvents.on("FN_r", (spdu) => transport.writeTSDU(encode_FINISH_SPDU(spdu)));
    outgoingEvents.on("AB_nr", (spdu) => transport.writeTSDU(encode_ABORT_SPDU(spdu)));
    outgoingEvents.on("AB_r", (spdu) => transport.writeTSDU(encode_ABORT_SPDU(spdu)));
    outgoingEvents.on("DT", (spdu) => transport.writeTSDU(encode_DATA_TRANSFER_SPDU(spdu)));
    outgoingEvents.on("DN", (spdu) => transport.writeTSDU(encode_DISCONNECT_SPDU(spdu)));
    return {
        version: SESSION_PROTOCOL_VERSION_1, // Default, per ITU Rec. X.225 (1995), Section 8.3.1.9.
        buffer: Buffer.alloc(0),
        bufferIndex: 0,
        caller,
        phase: SessionServicePhase.establishment,
        state: transport.connected()
            ? TableA2SessionConnectionState.STA01C // This is the default state after transport is established.
            : TableA2SessionConnectionState.STA01,
        FU: 0,
        TEXP: false,
        Vact: false,
        Vnextact: false,
        Vrsp: "no",
        Vrspnb: 0,
        Vrsps: "no",
        Vrspr: "no",
        Vrspnbr: 0,
        Vrspnbs: 0,
        SPMWinner: false,
        Vtca: !transportCaller,
        Vtrr: false, // No specified default value, but better safe than sorry.
        Vcoll: false,
        Vdnr: false,
        V_A: 0,
        V_M: 0,
        V_R: 0,
        Vsc: false,
        Vado: 0,
        Vadi: 0,
        VAs: 0,
        VAr: 0,
        VMs: 0,
        VMr: 0,
        VRs: 0,
        VRr: 0,
        Discard_rcv_flow: false,
        Discard_snd_flow: false,
        transport,
        connectData: Buffer.alloc(0),
        userDataBuffer: Buffer.alloc(0),
        outgoingEvents,
    };
}

// #region encoders

// function encodeParameter (param: SessionParameter): Buffer

function encodeSPDU (spdu: SPDU): Buffer {
    const bufs: Buffer[] = [];
    for (const param of spdu.parameters) {
        if ("pgi" in param) { // Parameter Group
            const pgi_bufs: Buffer[] = [];
            for (const pgiparam of param.parameters) {
                if (pgiparam.value.length > 254) {
                    const pi_and_li = Buffer.from([
                        pgiparam.pi,
                        0xFF,
                        0,
                        0,
                    ]);
                    pi_and_li.writeUint16BE(pgiparam.value.length, 2);
                    pgi_bufs.push(pi_and_li);
                    pgi_bufs.push(pgiparam.value);
                } else {
                    const pi_and_li = Buffer.from([
                        pgiparam.pi,
                        pgiparam.value.length,
                    ]);
                    pgi_bufs.push(pi_and_li);
                    pgi_bufs.push(pgiparam.value);
                }
            }
            let pg_len: number = 0;
            for (const pgb of pgi_bufs) {
                pg_len += pgb.length;
            }
            if (pg_len > 254) {
                const pgi_and_li = Buffer.from([
                    param.pgi,
                    0xFF,
                    0,
                    0,
                ]);
                pgi_and_li.writeUint16BE(pg_len, 2);
                bufs.push(pgi_and_li);
                bufs.push(...pgi_bufs);
            } else {
                const pgi_and_li = Buffer.from([
                    param.pgi,
                    pg_len,
                ]);
                bufs.push(pgi_and_li);
                bufs.push(...pgi_bufs);
            }
        } else { // Single Parameter
            if (param.value.length > 254) {
                const pi_and_li = Buffer.from([
                    param.pi,
                    0xFF,
                    0,
                    0,
                ]);
                pi_and_li.writeUint16BE(param.value.length, 2);
                bufs.push(pi_and_li);
                bufs.push(param.value);
            } else {
                const pi_and_li = Buffer.from([
                    param.pi,
                    param.value.length,
                ]);
                bufs.push(pi_and_li);
                bufs.push(param.value);
            }
        }
    }
    let len: number = 0;
    for (const b of bufs) {
        len += b.length;
    }
    // FIXME: The SPDU did not send at all until I added this.
    if (spdu.userInformation) {
        bufs.push(spdu.userInformation);
    }
    // TODO: If len > 65535, return null or something.
    if (len > 254) {
        const si_and_li = Buffer.from([
            spdu.si,
            0xFF,
            0,
            0,
        ]);
        si_and_li.writeUint16BE(len, 2);
        return Buffer.concat([
            si_and_li,
            ...bufs,
        ]);
    } else {
        const si_and_li = Buffer.from([
            spdu.si,
            len,
        ]);
        return Buffer.concat([
            si_and_li,
            ...bufs,
        ]);
    }
}

function encode_serial_number (sn: SerialNumber | bigint): Buffer {
    const str = sn.toString(10);
    const ret = Buffer.allocUnsafe(str.length);
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        const digit = strDigitToSerialNumberDigit.get(charCode);
        if (digit === undefined) {
            ret[i] = 0x00;
        } else {
            ret[i] = digit;
        }
    }
    return ret;
}

function encodeConnectionIdentifier (cid: ConnectionIdentifier): SessionParameterGroup {
    const ret: SessionParameterGroup = {
        pgi: PGI_CONNECTION_ID,
        parameters: [],
    };
    if (cid.callingSSUserReference) {
        ret.parameters.push({
            pi: PI_CALLING_SS_USER_REF,
            value: cid.callingSSUserReference,
        });
    }
    if (cid.calledSSUserReference) {
        ret.parameters.push({
            pi: PI_CALLED_SS_USER_REF,
            value: cid.calledSSUserReference,
        });
    }
    if (cid.commonReference) {
        ret.parameters.push({
            pi: PI_COMMON_REFERENCE,
            value: cid.commonReference,
        });
    }
    if (cid.additionalReferenceInformation) {
        ret.parameters.push({
            pi: PI_ADDITIONAL_REF_INFO,
            value: cid.additionalReferenceInformation,
        });
    }
    return ret;
}

function encodeConnectAcceptItem (cai: ConnectAcceptItem): SessionParameterGroup {
    const ret: SessionParameterGroup = {
        pgi: PGI_CONNECT_ACCEPT,
        parameters: [],
    };
    if (cai.protocolOptions !== undefined) {
        ret.parameters.push({
            pi: PI_PROTOCOL_OPTIONS,
            value: Buffer.from([ cai.protocolOptions ]),
        });
    }
    if (cai.tsduMaximumSize !== undefined) {
        const value = Buffer.allocUnsafe(4);
        value.writeUint32BE(cai.tsduMaximumSize);
        ret.parameters.push({
            pi: PI_TSDU_MAX_SIZE,
            value,
        });
    }
    if (cai.versionNumber !== undefined) {
        ret.parameters.push({
            pi: PI_VERSION_NUMBER,
            value: Buffer.from([ cai.versionNumber ]),
        });
    }
    if (cai.initialSerialNumber !== undefined) {
        const value = encode_serial_number(cai.initialSerialNumber);
        ret.parameters.push({
            pi: PI_INITIAL_SERIAL_NUMBER,
            value,
        });
    }
    if (cai.tokenSettingItem !== undefined) {
        ret.parameters.push({
            pi: PI_TOKEN_SETTING_ITEM,
            value: Buffer.from([ cai.tokenSettingItem ]),
        });
    }
    if (cai.secondInitialSerialNumber !== undefined) {
        const value = encode_serial_number(cai.secondInitialSerialNumber);
        ret.parameters.push({
            pi: PI_SECOND_INITIAL_SERIAL_NUMBER,
            value,
        });
    }
    if (cai.upperLimitSerialNumber) {
        const value = encode_serial_number(cai.upperLimitSerialNumber);
        ret.parameters.push({
            pi: PI_UPPER_LIMIT_SERIAL_NUMBER,
            value,
        });
    }
    if (cai.largeInitialSerialNumber) {
        const value = encode_serial_number(cai.largeInitialSerialNumber);
        ret.parameters.push({
            pi: PI_LARGE_INITIAL_SERIAL_NUMBER,
            value,
        });
    }
    if (cai.largeSecondInitialSerialNumber) {
        const value = encode_serial_number(cai.largeSecondInitialSerialNumber);
        ret.parameters.push({
            pi: PI_LARGE_SECOND_INITIAL_SERIAL_NUMBER,
            value,
        });
    }
    return ret;
}

export
function encode_CONNECT_SPDU (pdu: CONNECT_SPDU): Buffer {
    const ret: SPDU = {
        si: SI_CN_SPDU,
        parameters: [],
    };
    if (pdu.connectionIdentifier) {
        ret.parameters.push(encodeConnectionIdentifier(pdu.connectionIdentifier));
    }
    if (pdu.connectAcceptItem) {
        ret.parameters.push(encodeConnectAcceptItem(pdu.connectAcceptItem));
    }
    if (pdu.sessionUserRequirements !== undefined) {
        const value = Buffer.allocUnsafe(2);
        value.writeUint16BE(pdu.sessionUserRequirements);
        ret.parameters.push({
            pi: PI_SESSION_USER_REQUIREMENTS,
            value,
        });
    }
    if (pdu.callingSessionSelector) {
        ret.parameters.push({
            pi: PI_CALLING_SESSION_SELECTOR,
            value: pdu.callingSessionSelector,
        });
    }
    if (pdu.calledSessionSelector) {
        ret.parameters.push({
            pi: PI_CALLED_SESSION_SELECTOR,
            value: pdu.calledSessionSelector,
        });
    }
    if (pdu.dataOverflow) {
        ret.parameters.push({
            pi: PI_DATA_OVERFLOW,
            value: Buffer.from([ pdu.dataOverflow ]),
        });
    }
    // FIXME: The way user data is encoded is very different between SPDUs.
    if (pdu.userData) {
        ret.parameters.push({
            pi: PGI_USER_DATA,
            value: pdu.userData,
        });
    }
    if (pdu.extendedUserData) {
        ret.parameters.push({
            pi: PGI_EXTENDED_USER_DATA,
            value: pdu.extendedUserData,
        });
    }
    return encodeSPDU(ret);
}

export
function encode_ACCEPT_SPDU (pdu: ACCEPT_SPDU): Buffer {
    const ret: SPDU = {
        si: SI_AC_SPDU,
        parameters: [],
    };
    if (pdu.connectionIdentifier) {
        ret.parameters.push(encodeConnectionIdentifier(pdu.connectionIdentifier));
    }
    if (pdu.connectAcceptItem) {
        ret.parameters.push(encodeConnectAcceptItem(pdu.connectAcceptItem));
    }
    if (pdu.tokenItem !== undefined) {
        ret.parameters.push({
            pi: PI_TOKEN_ITEM,
            value: Buffer.from([ pdu.tokenItem ]),
        });
    }
    if (pdu.sessionUserRequirements !== undefined) {
        const value = Buffer.allocUnsafe(2);
        value.writeUint16BE(pdu.sessionUserRequirements);
        ret.parameters.push({
            pi: PI_SESSION_USER_REQUIREMENTS,
            value,
        });
    }
    if (pdu.enclosureItem !== undefined) {
        ret.parameters.push({
            pi: PI_ENCLOSURE_ITEM,
            value: Buffer.from([ pdu.enclosureItem ]),
        });
    }
    if (pdu.callingSessionSelector) {
        ret.parameters.push({
            pi: PI_CALLING_SESSION_SELECTOR,
            value: pdu.callingSessionSelector,
        });
    }
    if (pdu.respondingSessionSelector) {
        ret.parameters.push({
            pi: PI_RESPONDING_SESSION_SELECTOR,
            value: pdu.respondingSessionSelector,
        });
    }
    if (pdu.userData) {
        ret.parameters.push({
            pi: PGI_USER_DATA,
            value: pdu.userData,
        });
    }
    return encodeSPDU(ret);
}

export
function encode_REFUSE_SPDU (pdu: REFUSE_SPDU): Buffer {
    const ret: SPDU = {
        si: SI_RF_SPDU,
        parameters: [],
    };
    if (pdu.connectionIdentifier) {
        ret.parameters.push(encodeConnectionIdentifier(pdu.connectionIdentifier));
    }
    if (pdu.transportDisconnect !== undefined) {
        ret.parameters.push({
            pi: PI_TRANSPORT_DISCONNECT,
            value: Buffer.from([ pdu.transportDisconnect ]),
        });
    }
    if (pdu.sessionUserRequirements !== undefined) {
        const value = Buffer.allocUnsafe(0);
        value.writeUint16BE(pdu.sessionUserRequirements);
        ret.parameters.push({
            pi: PI_SESSION_USER_REQUIREMENTS,
            value,
        });
    }
    if (pdu.versionNumber !== undefined) {
        ret.parameters.push({
            pi: PI_VERSION_NUMBER,
            value: Buffer.from([ pdu.versionNumber ]),
        });
    }
    if (pdu.enclosureItem !== undefined) {
        ret.parameters.push({
            pi: PI_ENCLOSURE_ITEM,
            value: Buffer.from([ pdu.enclosureItem ]),
        });
    }
    if (pdu.reasonCode !== undefined) {
        ret.parameters.push({
            pi: PI_REASON_CODE,
            value: Buffer.from([ pdu.reasonCode ]),
        });
    }
    return encodeSPDU(ret);
}

export
function encode_CONNECT_DATA_OVERFLOW_SPDU (pdu: CONNECT_DATA_OVERFLOW_SPDU): Buffer {
    const ret: SPDU = {
        si: SI_CDO_SPDU,
        parameters: [],
    };
    if (pdu.enclosureItem !== undefined) {
        ret.parameters.push({
            pi: PI_ENCLOSURE_ITEM,
            value: Buffer.from([ pdu.enclosureItem ]),
        });
    }
    if (pdu.userData !== undefined) {
        ret.parameters.push({
            pi: PI_USER_DATA,
            value: pdu.userData,
        });
    }
    return encodeSPDU(ret);
}

export
function encode_DATA_TRANSFER_SPDU (pdu: DATA_TRANSFER_SPDU): Buffer {
    const ret: SPDU = {
        si: SI_DT_SPDU,
        parameters: [],
        userInformation: pdu.userInformation,
    };
    if (pdu.enclosureItem !== undefined) {
        ret.parameters.push({
            pi: PI_ENCLOSURE_ITEM,
            value: Buffer.from([ pdu.enclosureItem ]),
        });
    }
    return encodeSPDU(ret);
}

export
function encode_ABORT_SPDU (pdu: ABORT_SPDU): Buffer {
    const ret: SPDU = {
        si: SI_AB_SPDU,
        parameters: [],
    };
    if (pdu.reflectParameterValues) {
        ret.parameters.push({
            pi: PI_REFLECT_PARAMETER_VALUES,
            value: pdu.reflectParameterValues,
        });
    }
    if (pdu.transportDisconnect !== undefined) {
        ret.parameters.push({
            pi: PI_TRANSPORT_DISCONNECT,
            value: Buffer.from([ pdu.transportDisconnect ]),
        });
    }
    if (pdu.enclosureItem !== undefined) {
        ret.parameters.push({
            pi: PI_ENCLOSURE_ITEM,
            value: Buffer.from([ pdu.enclosureItem ]),
        });
    }
    if (pdu.userData) {
        ret.parameters.push({
            pi: PI_USER_DATA,
            value: pdu.userData,
        });
    }
    return encodeSPDU(ret);
}

export
function encode_FINISH_SPDU (pdu: FINISH_SPDU): Buffer {
    const ret: SPDU = {
        si: SI_FN_SPDU,
        parameters: [],
    };
    if (pdu.transportDisconnect !== undefined) {
        ret.parameters.push({
            pi: PI_TRANSPORT_DISCONNECT,
            value: Buffer.from([ pdu.transportDisconnect ]),
        });
    }
    if (pdu.enclosureItem !== undefined) {
        ret.parameters.push({
            pi: PI_ENCLOSURE_ITEM,
            value: Buffer.from([ pdu.enclosureItem ]),
        });
    }
    if (pdu.userData) {
        ret.parameters.push({
            pi: PGI_USER_DATA,
            value: pdu.userData,
        });
    }
    return encodeSPDU(ret);
}

export
function encode_NOT_FINISHED_SPDU (pdu: NOT_FINISHED_SPDU): Buffer {
    const ret: SPDU = {
        si: SI_NF_SPDU,
        parameters: [],
    };
    if (pdu.enclosureItem !== undefined) {
        ret.parameters.push({
            pi: PI_ENCLOSURE_ITEM,
            value: Buffer.from([ pdu.enclosureItem ]),
        });
    }
    if (pdu.userData) {
        ret.parameters.push({
            pi: PGI_USER_DATA,
            value: pdu.userData,
        });
    }
    return encodeSPDU(ret);
}

export
function encode_DISCONNECT_SPDU (pdu: DISCONNECT_SPDU): Buffer {
    const ret: SPDU = {
        si: SI_DN_SPDU,
        parameters: [],
    };
    if (pdu.enclosureItem !== undefined) {
        ret.parameters.push({
            pi: PI_ENCLOSURE_ITEM,
            value: Buffer.from([ pdu.enclosureItem ]),
        });
    }
    if (pdu.userData) {
        ret.parameters.push({
            pi: PGI_USER_DATA,
            value: pdu.userData,
        });
    }
    return encodeSPDU(ret);
}

export
function encode_PREPARE_SPDU (pdu: PREPARE_SPDU): Buffer {
    const ret: SPDU = {
        si: SI_PR_SPDU,
        parameters: [],
    };
    ret.parameters.push({
        pi: PI_PREPARE_TYPE,
        value: Buffer.from([ pdu.prepareType ]),
    });
    if (pdu.resyncType) {
        ret.parameters.push({
            pi: PI_RESYNC_TYPE,
            value: Buffer.from([ pdu.resyncType ]),
        });
    }
    if (pdu.secondResyncType) {
        ret.parameters.push({
            pi: PI_SECOND_RESYNC_TYPE,
            value: Buffer.from([ pdu.secondResyncType ]),
        });
    }
    return encodeSPDU(ret);
}

// #endregion encoders

// #endregion connection state

// export
// function parse_CONNECT_SPDU (bytes: Buffer): CONNECT_SPDU {

// }

// export
// function receive_CONNECT_SPDU (state: SessionServiceConnectionState, spdu: CONNECT_SPDU): SessionServiceConnectionState {

// }

export
function parseSerialNumber (sn: Buffer): number {
    let acc: string = "";
    for (const byte of sn) {
        const dig = serialNumberDigitToStrDigit.get(byte);
        if (!dig) {
            return -1;
        }
        acc += dig;
    }
    return Number.parseInt(acc, 10); // The theory is that parseInt is faster than multiplying by 10 multiple times.
}

export
function parseLargeSerialNumber (sn: Buffer): bigint | null {
    let acc: string = "";
    for (const byte of sn) {
        const dig = serialNumberDigitToStrDigit.get(byte);
        if (!dig) {
            return null;
        }
        acc += dig;
    }
    return BigInt(acc);
}

export
function parseConnectionIdentifier (pg: SessionParameterGroup): ConnectionIdentifier | number {
    const ci: ConnectionIdentifier = {};
    for (const param of pg.parameters) {
        switch (param.pi) {
            case (PI_CALLED_SS_USER_REF): {
                if (param.value.length > 64) {
                    return ERR_PI_LENGTH;
                }
                ci.calledSSUserReference = param.value;
                break;
            }
            case (PI_CALLING_SS_USER_REF): {
                if (param.value.length > 64) {
                    return ERR_PI_LENGTH;
                }
                ci.callingSSUserReference = param.value;
                break;
            }
            case (PI_COMMON_REFERENCE): {
                if (param.value.length > 64) {
                    return ERR_PI_LENGTH;
                }
                ci.commonReference = param.value;
                break;
            }
            case (PI_ADDITIONAL_REF_INFO): {
                if (param.value.length > 4) {
                    return ERR_PI_LENGTH;
                }
                ci.additionalReferenceInformation = param.value;
                break;
            }
            default: {
                return ERR_UNRECOGNIZED_PI;
            }
        }
    }
    return ci;
}

export
function parseConnectAcceptItem (pg: SessionParameterGroup): ConnectAcceptItem | number {
    const cai: Partial<ConnectAcceptItem> = {};
    for (const param of pg.parameters) {
        switch (param.pi) {
            case (PI_PROTOCOL_OPTIONS): {
                if (param.value.length !== 1) {
                    return ERR_PI_LENGTH;
                }
                cai.protocolOptions = param.value[0];
                break;
            }
            case (PI_TSDU_MAX_SIZE): {
                if (param.value.length !== 4) {
                    return ERR_PI_LENGTH;
                }
                cai.tsduMaximumSize = param.value.readUint32BE();
                break;
            }
            case (PI_VERSION_NUMBER): {
                if (param.value.length !== 1) {
                    return ERR_PI_LENGTH;
                }
                cai.versionNumber = param.value[0];
                break;
            }
            case (PI_INITIAL_SERIAL_NUMBER): {
                if (param.value.length > 6) {
                    return ERR_PI_LENGTH;
                }
                const sn = parseSerialNumber(param.value);
                if (sn < 0) {
                    return ERR_MALFORMED_PARAM;
                }
                cai.initialSerialNumber = parseSerialNumber(param.value);
                break;
            }
            case (PI_TOKEN_SETTING_ITEM): {
                if (param.value.length !== 1) {
                    return ERR_PI_LENGTH;
                }
                cai.tokenSettingItem = param.value[0];
                break;
            }
            case (PI_SECOND_INITIAL_SERIAL_NUMBER): {
                if (param.value.length > 6) {
                    return ERR_PI_LENGTH;
                }
                const sn = parseSerialNumber(param.value);
                if (sn < 0) {
                    return ERR_MALFORMED_PARAM;
                }
                cai.secondInitialSerialNumber = parseSerialNumber(param.value);
                break;
            }
            case (PI_UPPER_LIMIT_SERIAL_NUMBER): {
                if (param.value.length !== 1) {
                    return ERR_PI_LENGTH;
                }
                cai.upperLimitSerialNumber = param.value[0];
                break;
            }
            case (PI_LARGE_INITIAL_SERIAL_NUMBER): {
                const sn = parseLargeSerialNumber(param.value);
                if (sn === null) {
                    return ERR_MALFORMED_PARAM;
                }
                cai.largeInitialSerialNumber = sn;
                break;
            }
            case (PI_LARGE_SECOND_INITIAL_SERIAL_NUMBER): {
                const sn = parseLargeSerialNumber(param.value);
                if (sn === null) {
                    return ERR_MALFORMED_PARAM;
                }
                cai.largeSecondInitialSerialNumber = sn;
                break;
            }
        }
    }
    if (!cai.versionNumber) {
        return ERR_MISSING_REQ_PARAM;
    }
    if (!cai.protocolOptions) {
        return ERR_MISSING_REQ_PARAM;
    }
    const ret: ConnectAcceptItem = {
        ...cai,
        versionNumber: cai.versionNumber,
        protocolOptions: cai.protocolOptions,
    };
    return ret;
}

export
function parse_CN_SPDU (spdu: SPDU): CONNECT_SPDU | number {
    const ret: CONNECT_SPDU = {};
    for (const p of spdu.parameters) {
        if ("pgi" in p) {
            switch (p.pgi) {
                case (PGI_CONNECTION_ID): {
                    const ciOrError = parseConnectionIdentifier(p);
                    if (typeof ciOrError === "number") {
                        return ciOrError;
                    }
                    ret.connectionIdentifier = ciOrError;
                    break;
                }
                case (PGI_CONNECT_ACCEPT): {
                    const caiOrError = parseConnectAcceptItem(p);
                    if (typeof caiOrError === "number") {
                        return caiOrError;
                    }
                    ret.connectAcceptItem = caiOrError;
                    break;
                }
                case (PGI_USER_DATA): {
                    ret.userData = p.value;
                    break;
                }
                case (PGI_EXTENDED_USER_DATA): {
                    ret.extendedUserData = p.value;
                    break;
                }
                default: {
                    return ERR_UNRECOGNIZED_PI;
                }
            }
        } else {
            switch (p.pi) {
                case (PI_SESSION_USER_REQUIREMENTS): {
                    if (p.value.length !== 2) {
                        return ERR_PI_LENGTH;
                    }
                    ret.sessionUserRequirements = p.value.readUint16BE();
                    break;
                }
                case (PI_CALLING_SESSION_SELECTOR): {
                    if (p.value.length > 16) {
                        return ERR_PI_LENGTH;
                    }
                    ret.callingSessionSelector = p.value;
                    break;
                }
                case (PI_CALLED_SESSION_SELECTOR): {
                    if (p.value.length > 16) {
                        return ERR_PI_LENGTH;
                    }
                    ret.calledSessionSelector = p.value;
                    break;
                }
                case (PI_DATA_OVERFLOW): {
                    if (p.value.length !== 1) {
                        return ERR_PI_LENGTH;
                    }
                    ret.dataOverflow = p.value[0];
                    break;
                }
                default: {
                    return ERR_UNRECOGNIZED_PI;
                };
            }
        }
    }
    return ret;
}

export
function parse_AC_SPDU (spdu: SPDU): ACCEPT_SPDU | number {
    const ret: ACCEPT_SPDU = {};
    for (const p of spdu.parameters) {
        if ("pgi" in p) {
            switch (p.pgi) {
                case (PGI_CONNECTION_ID): {
                    const ciOrError = parseConnectionIdentifier(p);
                    if (typeof ciOrError === "number") {
                        return ciOrError;
                    }
                    ret.connectionIdentifier = ciOrError;
                    break;
                }
                case (PGI_CONNECT_ACCEPT): {
                    const caiOrError = parseConnectAcceptItem(p);
                    if (typeof caiOrError === "number") {
                        return caiOrError;
                    }
                    ret.connectAcceptItem = caiOrError;
                    break;
                }
                case (PGI_USER_DATA): {
                    ret.userData = p.value;
                    break;
                }
                default: {
                    return ERR_UNRECOGNIZED_PI;
                }
            }
        } else {
            switch (p.pi) {
                case (PI_TOKEN_ITEM): {
                    if (p.value.length !== 1) {
                        return ERR_PI_LENGTH;
                    }
                    ret.tokenItem = p.value[0];
                    break;
                }
                case (PI_SESSION_USER_REQUIREMENTS): {
                    if (p.value.length !== 2) {
                        return ERR_PI_LENGTH;
                    }
                    ret.sessionUserRequirements = p.value.readUint16BE();
                    break;
                }
                case (PI_ENCLOSURE_ITEM): {
                    if (p.value.length !== 1) {
                        return ERR_PI_LENGTH;
                    }
                    ret.enclosureItem = p.value[0];
                    break;
                }
                case (PI_CALLING_SESSION_SELECTOR): {
                    if (p.value.length > 16) {
                        return ERR_PI_LENGTH;
                    }
                    ret.callingSessionSelector = p.value;
                    break;
                }
                case (PI_RESPONDING_SESSION_SELECTOR): {
                    if (p.value.length > 16) {
                        return ERR_PI_LENGTH;
                    }
                    ret.respondingSessionSelector = p.value;
                    break;
                }
                default: {
                    return ERR_UNRECOGNIZED_PI;
                };
            }
        }
    }
    return ret;
}

export
function parse_OA_SPDU (spdu: SPDU): OVERFLOW_ACCEPT_SPDU | number {
    const ret: OVERFLOW_ACCEPT_SPDU = {
        versionNumber: 0b0000_0010, // This is what the value is mandated to be anyway.
    };
    for (const p of spdu.parameters) {
        if ("pgi" in p) {
            return ERR_UNRECOGNIZED_PI;
        } else {
            switch (p.pi) {
                case (PI_TSDU_MAX_SIZE): {
                    if (p.value.length !== 4) {
                        return ERR_PI_LENGTH;
                    }
                    ret.tsduMaximumSize = p.value.readUint32BE();
                    break;
                }
                case (PI_VERSION_NUMBER): {
                    if (p.value.length !== 1) {
                        return ERR_PI_LENGTH;
                    }
                    ret.versionNumber = p.value[0];
                    break;
                }
                default: {
                    return ERR_UNRECOGNIZED_PI;
                };
            }
        }
    }
    return ret;
}

export
function parse_CDO_SPDU (spdu: SPDU): CONNECT_DATA_OVERFLOW_SPDU | number {
    const ret: Partial<CONNECT_DATA_OVERFLOW_SPDU> = {};
    for (const p of spdu.parameters) {
        if ("pgi" in p) {
            if (p.pgi !== PGI_USER_DATA) {
                return ERR_UNRECOGNIZED_PI;
            }
            ret.userData = p.value;
        } else {
            switch (p.pi) {
                case (PI_ENCLOSURE_ITEM): {
                    if (p.value.length !== 1) {
                        return ERR_PI_LENGTH;
                    }
                    ret.enclosureItem = p.value[0];
                    break;
                }
                default: {
                    return ERR_UNRECOGNIZED_PI;
                };
            }
        }
    }
    if (!ret.enclosureItem) {
        return ERR_MISSING_REQ_PARAM;
    }
    return {
        ...ret,
        enclosureItem: ret.enclosureItem,
    };
}

export
function parse_RF_SPDU (spdu: SPDU): REFUSE_SPDU | number {
    const ret: REFUSE_SPDU = {};
    for (const p of spdu.parameters) {
        if ("pgi" in p) {
            if (p.pgi !== PGI_CONNECTION_ID) {
                return ERR_UNRECOGNIZED_PI;
            }
            const ci = parseConnectionIdentifier(p);
            if (typeof ci === "number") {
                return ci;
            }
            ret.connectionIdentifier = ci;
        } else {
            switch (p.pi) {
                case (PI_TRANSPORT_DISCONNECT): {
                    if (p.value.length !== 1) {
                        return ERR_PI_LENGTH;
                    }
                    ret.transportDisconnect = p.value[0];
                    break;
                }
                case (PI_SESSION_USER_REQUIREMENTS): {
                    if (p.value.length !== 2) {
                        return ERR_PI_LENGTH;
                    }
                    ret.sessionUserRequirements = p.value.readUint16BE();
                    break;
                }
                case (PI_VERSION_NUMBER): {
                    if (p.value.length !== 1) {
                        return ERR_PI_LENGTH;
                    }
                    ret.versionNumber = p.value[0];
                    break;
                }
                case (PI_ENCLOSURE_ITEM): {
                    if (p.value.length !== 1) {
                        return ERR_PI_LENGTH;
                    }
                    ret.enclosureItem = p.value[0];
                    break;
                }
                case (PI_REASON_CODE): {
                    if (p.value.length === 0) {
                        return ERR_PI_LENGTH;
                    }
                    if (p.value.length > 1) {
                        ret.reasonData = p.value.subarray(1);
                    }
                    ret.reasonCode = p.value[0];
                    break;
                }

                default: {
                    return ERR_UNRECOGNIZED_PI;
                };
            }
        }
    }
    return ret;
}

export
function parse_FN_SPDU (spdu: SPDU): FINISH_SPDU | number {
    const ret: FINISH_SPDU = {};
    for (const p of spdu.parameters) {
        if ("pgi" in p) {
            if (p.pgi !== PGI_USER_DATA) {
                return ERR_UNRECOGNIZED_PI;
            }
            ret.userData = p.value;
        } else {
            switch (p.pi) {
                case (PI_TRANSPORT_DISCONNECT): {
                    if (p.value.length !== 1) {
                        return ERR_PI_LENGTH;
                    }
                    ret.transportDisconnect = p.value[0];
                    break;
                }
                case (PI_ENCLOSURE_ITEM): {
                    if (p.value.length !== 1) {
                        return ERR_PI_LENGTH;
                    }
                    ret.enclosureItem = p.value[0];
                    break;
                }
                default: {
                    return ERR_UNRECOGNIZED_PI;
                };
            }
        }
    }
    return ret;
}

export
function parse_DN_SPDU (spdu: SPDU): DISCONNECT_SPDU | number {
    const ret: DISCONNECT_SPDU = {};
    for (const p of spdu.parameters) {
        if ("pgi" in p) {
            if (p.pgi !== PGI_USER_DATA) {
                return ERR_UNRECOGNIZED_PI;
            }
            ret.userData = p.value;
        } else {
            switch (p.pi) {
                case (PI_ENCLOSURE_ITEM): {
                    if (p.value.length !== 1) {
                        return ERR_PI_LENGTH;
                    }
                    ret.enclosureItem = p.value[0];
                    break;
                }
                default: {
                    return ERR_UNRECOGNIZED_PI;
                };
            }
        }
    }
    return ret;
}

export
function parse_NF_SPDU (spdu: SPDU): NOT_FINISHED_SPDU | number {
    const ret: NOT_FINISHED_SPDU = {};
    for (const p of spdu.parameters) {
        if ("pgi" in p) {
            if (p.pgi !== PGI_USER_DATA) {
                return ERR_UNRECOGNIZED_PI;
            }
            ret.userData = p.value;
        } else {
            switch (p.pi) {
                case (PI_ENCLOSURE_ITEM): {
                    if (p.value.length !== 1) {
                        return ERR_PI_LENGTH;
                    }
                    ret.enclosureItem = p.value[0];
                    break;
                }
                default: {
                    return ERR_UNRECOGNIZED_PI;
                };
            }
        }
    }
    return ret;
}

export
function parse_AB_SPDU (spdu: SPDU): ABORT_SPDU | number {
    const ret: ABORT_SPDU = {};
    for (const p of spdu.parameters) {
        if ("pgi" in p) {
            if (p.pgi !== PGI_USER_DATA) {
                return ERR_UNRECOGNIZED_PI;
            }
            ret.userData = p.value;
        } else {
            switch (p.pi) {
                case (PI_TRANSPORT_DISCONNECT): {
                    if (p.value.length !== 1) {
                        return ERR_PI_LENGTH;
                    }
                    ret.transportDisconnect = p.value[0];
                    break;
                }
                case (PI_ENCLOSURE_ITEM): {
                    if (p.value.length !== 1) {
                        return ERR_PI_LENGTH;
                    }
                    ret.enclosureItem = p.value[0];
                    break;
                }
                case (PI_REFLECT_PARAMETER_VALUES): {
                    if (p.value.length > 9) {
                        return ERR_PI_LENGTH;
                    }
                    ret.reflectParameterValues = p.value;
                    break;
                }
                default: {
                    return ERR_UNRECOGNIZED_PI;
                };
            }
        }
    }
    return ret;
}

export
function parse_AA_SPDU (spdu: SPDU): ABORT_ACCEPT_SPDU | number {
    const ret: ABORT_ACCEPT_SPDU = {};
    if (spdu.parameters.length > 1) {
        return ERR_UNRECOGNIZED_PI;
    }
    return ret;
}

export
function parse_DT_SPDU (spdu: SPDU): DATA_TRANSFER_SPDU | number {
    const ret: DATA_TRANSFER_SPDU = {
        userInformation: spdu.userInformation ?? Buffer.alloc(0),
    };
    for (const p of spdu.parameters) {
        if ("pgi" in p) {
            return ERR_UNRECOGNIZED_PI;
        } else {
            if (p.pi !== PI_ENCLOSURE_ITEM) {
                return ERR_UNRECOGNIZED_PI;
            }
            if (p.value.length !== 1) {
                return ERR_PI_LENGTH;
            }
            ret.enclosureItem = p.value[0];
        }
    }
    return ret;
}

export
function parse_PR_SPDU (spdu: SPDU): PREPARE_SPDU | number {
    const ret: Partial<PREPARE_SPDU> = {};
    for (const p of spdu.parameters) {
        if ("pgi" in p) {
            return ERR_UNRECOGNIZED_PI;
        } else {
            switch (p.pi) {
                case (PI_PREPARE_TYPE): {
                    if (p.value.length !== 1) {
                        return ERR_PI_LENGTH;
                    }
                    ret.prepareType = p.value[0];
                    break;
                }
                case (PI_RESYNC_TYPE): {
                    if (p.value.length !== 1) {
                        return ERR_PI_LENGTH;
                    }
                    ret.resyncType = p.value[0];
                    break;
                }
                case (PI_SECOND_RESYNC_TYPE): {
                    if (p.value.length !== 1) {
                        return ERR_PI_LENGTH;
                    }
                    ret.secondResyncType = p.value[0];
                    break;
                }
                default: {
                    return ERR_UNRECOGNIZED_PI;
                };
            }
        }
    }
    if (!ret.prepareType) {
        return ERR_MISSING_REQ_PARAM;
    }
    return {
        ...ret,
        prepareType: ret.prepareType,
    };
}

/**
 * @summary Handle an "invalid intersection" between the SPM state and an event.
 * @description
 *
 * This function handles an "invalid intersection" between the Session Protocol
 * Machine (SPM) state and an event received. This can be thought of as an
 * "invalid sequence" handler. An example of an invalid sequence would be
 * sending an ABORT before a connection was ever established.
 *
 * This procedure is described in
 * [ITU Recommendation X.225 (1995)](https://www.itu.int/rec/T-REC-X.225/en),
 * Annex A, Section A.4.1.
 *
 * @param state The input state
 * @returns The new state
 */
export
function handleInvalidSequence (state: SessionServiceConnectionState): SessionServiceConnectionState {
    // Section A.4.1.1 is unhandled.
    const response: ABORT_SPDU = {};
    state.outgoingEvents.emit("AB_nr", response);
    state.TIM = setTimeout(() => state.transport.disconnect(), TIMER_TIME_IN_MS); // TODO: Make this configurable.
    return state;
}

export
function handleSPDU (state: SessionServiceConnectionState, spdu: SPDU): [ state: SessionServiceConnectionState, err?: number ] {
    switch (spdu.si) {
        case (SI_CN_SPDU): {
            const cn = parse_CN_SPDU(spdu);
            if (typeof cn === "number") {
                return [ state, cn ];
            }
            const newState = dispatch_CN(state, cn);
            return [ newState ];
        }
        case (SI_OA_SPDU): {
            // TODO: Abort if protocol is version 1.
            const oa = parse_OA_SPDU(spdu);
            if (typeof oa === "number") {
                return [ state, oa ];
            }
            const newState = dispatch_OA(state, oa, state.connectData);
            return [ newState ];
        }
        case (SI_CDO_SPDU): {
            1 + 1; // Needed to avoid some weird Typescript parsing error.
            if (!state.cn) {
                return [ state, ERR_INVALID_SEQ ];
            }
            const cdo = parse_CDO_SPDU(spdu);
            if (typeof cdo === "number") {
                return [ state, cdo ];
            }
            const newState = dispatch_CDO(state, state.cn, cdo);
            return [ newState ];
        }
        case (SI_AC_SPDU): {
            const ac = parse_AC_SPDU(spdu);
            if (typeof ac === "number") {
                return [ state, ac ];
            }
            const newState = dispatch_AC(state, ac);
            return [ newState ];
        }
        case (SI_RF_SPDU): {
            const rf = parse_RF_SPDU(spdu);
            if (typeof rf === "number") {
                return [ state, rf ];
            }
            const r: boolean = (rf.transportDisconnect === TRANSPORT_DISCONNECT_KEPT);
            if (r) {
                const newState = dispatch_RF_r(state, rf);
                return [ newState ];
            } else {
                const newState = dispatch_RF_nr(state, rf);
                return [ newState ];
            }
        }
        case (SI_FN_SPDU): {
            const fn = parse_FN_SPDU(spdu);
            if (typeof fn === "number") {
                return [ state, fn ];
            }
            const r: boolean = (fn.transportDisconnect === TRANSPORT_DISCONNECT_KEPT);
            if (r) {
                const newState = dispatch_FN_r(state, fn);
                return [ newState ];
            } else {
                const newState = dispatch_FN_nr(state, fn);
                return [ newState ];
            }
        }
        case (SI_DN_SPDU): {
            const dn = parse_DN_SPDU(spdu);
            if (typeof dn === "number") {
                return [ state, dn ];
            }
            const newState = dispatch_DN(state, dn);
            return [ newState ];
        }
        case (SI_NF_SPDU): {
            const nf = parse_NF_SPDU(spdu);
            if (typeof nf === "number") {
                return [ state, nf ];
            }
            const newState = dispatch_NF(state, nf);
            return [ newState ];
        }
        case (SI_AB_SPDU): {
            const ab = parse_AB_SPDU(spdu);
            if (typeof ab === "number") {
                return [ state, ab ];
            }
            const r: boolean = (ab.transportDisconnect === TRANSPORT_DISCONNECT_KEPT);
            if (r) {
                const newState = dispatch_AB_r(state, ab);
                return [ newState ];
            } else {
                const newState = dispatch_AB_nr(state, ab);
                return [ newState ];
            }
        }
        case (SI_AA_SPDU): {
            const aa = parse_AA_SPDU(spdu);
            if (typeof aa === "number") {
                return [ state, aa ];
            }
            // state.peerEvents.emit("", nf);
            const newState = dispatch_AA(state);
            return [ newState ];
        }
        case (SI_DT_SPDU): {
            1 + 1; // To avoid some weird typescript parsing issue.
            if (!spdu.userInformation?.length) {
                return [ state ];
            }
            const dt = parse_DT_SPDU(spdu);
            if (typeof dt === "number") {
                return [ state, dt ];
            }
            const newState = dispatch_DT(state, dt);
            return [ newState ];
        }
        // case (SI_EX_SPDU): {
        //     break;
        // }
        // case (SI_TD_SPDU): {
        //     break;
        // }
        // case (SI_CD_SPDU): {
        //     break;
        // }
        // case (SI_CDA_SPDU): {
        //     break;
        // }
        // case (SI_GT_SPDU): {
        //     break;
        // }
        // case (SI_PT_SPDU): {
        //     break;
        // }
        // case (SI_GTC_SPDU): {
        //     break;
        // }
        // case (SI_GTA_SPDU): {
        //     break;
        // }
        // case (SI_MIP_SPDU): {
        //     break;
        // }
        // case (SI_MIA_SPDU): {
        //     break;
        // }
        // case (SI_MAP_SPDU): {
        //     break;
        // }
        // case (SI_MAA_SPDU): {
        //     break;
        // }
        // case (SI_RS_SPDU): {
        //     break;
        // }
        // case (SI_RA_SPDU): {
        //     break;
        // }
        case (SI_PR_SPDU): {
            const pr = parse_PR_SPDU(spdu);
            if (typeof pr === "number") {
                return [ state, pr ];
            }
            if (pr.prepareType === PREPARE_TYPE_ABORT) {
                const newState = dispatch_PR_AB(state);
                return [ newState ];
            } else {
                return [ state, ERR_UNSUPPORTED_PREPARE_TYPE ];
            }
        }
        // case (SI_ER_SPDU): {
        //     break;
        // }
        // case (SI_ED_SPDU): {
        //     break;
        // }
        // case (SI_AS_SPDU): {
        //     break;
        // }
        // case (SI_AR_SPDU): {
        //     break;
        // }
        // case (SI_AI_SPDU): {
        //     break;
        // }
        // case (SI_AIA_SPDU): {
        //     break;
        // }
        // case (SI_AD_SPDU): {
        //     break;
        // }
        // case (SI_ADA_SPDU): {
        //     break;
        // }
        // case (SI_AE_SPDU): {
        //     break;
        // }
        // case (SI_AEA_SPDU): {
        //     break;
        // }
        default: {
            return [ state, ERR_UNRECOGNIZED_SPDU ];
        }
    }
}

export
function parsePI (state: SessionServiceConnectionState): [ SessionServiceConnectionState, SessionParameter | null ] {
    if ((state.bufferIndex + 2) > state.buffer.length) {
        return [ state, null ];
    }
    const pi = state.buffer[state.bufferIndex];
    let li = state.buffer[state.bufferIndex + 1];
    let bytesRead: number = 2;
    if (li === 0xFF) {
        if ((state.bufferIndex + 4) > state.buffer.length) {
            return [ state, null ];
        }
        li = state.buffer.readUint16BE(2);
        bytesRead += 2;
    }
    if ((state.bufferIndex + bytesRead + li) > state.buffer.length) {
        return [ state, null ];
    }
    const newState: SessionServiceConnectionState = {
        ...state,
        bufferIndex: state.bufferIndex + bytesRead + li,
    };
    const value: Buffer = state.buffer.subarray(state.bufferIndex + bytesRead, state.bufferIndex + bytesRead + li);
    return [ newState, { pi, value } ];
}

export
function parsePGIorPI (
    state: SessionServiceConnectionState,
    depth: number = 0,
): [ SessionServiceConnectionState, SessionParameter | SessionParameterGroup | null ] {
    if ((state.bufferIndex + 2) > state.buffer.length) {
        return [ state, null ];
    }
    const pi = state.buffer[state.bufferIndex];
    let li = state.buffer[state.bufferIndex + 1];
    let bytesRead: number = 2;
    if (li === 0xFF) {
        if ((state.bufferIndex + 4) > state.buffer.length) {
            return [ state, null ];
        }
        li = state.buffer.readUint16BE(2);
        bytesRead += 2;
    }
    if ((state.bufferIndex + bytesRead + li) > state.buffer.length) {
        return [ state, null ];
    }
    const newState: SessionServiceConnectionState = {
        ...state,
        bufferIndex: state.bufferIndex + bytesRead + li,
    };
    if ((depth === 0) && pgis.has(pi)) {
        const paramGroup: SessionParameterGroup = {
            pgi: pi,
            parameters: [],
        };
        if (valueOnlyPGIs.has(pi)) {
            paramGroup.value = state.buffer.subarray(
                state.bufferIndex + bytesRead,
                state.bufferIndex + bytesRead + li,
            );
            return [ newState, paramGroup ];
        }
        const startOfValue: number = state.bufferIndex + bytesRead;
        let currentState: SessionServiceConnectionState = {
            ...state,
            bufferIndex: startOfValue,
        };
        const encounteredParams: Set<number> = new Set();
        while ((currentState.bufferIndex - startOfValue) < li) { // eslint-disable-line
            const [ newState, param ] = parsePI(currentState);
            if (!param) {
                break;
            }
            currentState = newState;
            paramGroup.parameters.push(param);
            const id: number = param.pi;
            if (encounteredParams.has(id)) {
                return [ currentState, null ]; // TODO: Return error.
            }
            encounteredParams.add(id);
        }
        return [ newState, paramGroup ];
    } else {
        const value: Buffer = state.buffer.subarray(state.bufferIndex + bytesRead, state.bufferIndex + bytesRead + li);
        return [ newState, { pi, value } ];
    }
}

export
function parseSPDU (state: SessionServiceConnectionState, prior_spdus: SPDU[]): [ SessionServiceConnectionState, SPDU | null ] {
    if ((state.bufferIndex + 2) > state.buffer.length) {
        return [ state, null ];
    }
    const si = state.buffer[state.bufferIndex];
    let li = state.buffer[state.bufferIndex + 1];
    let bytesRead: number = 2;
    if (li === 0xFF) {
        if ((state.bufferIndex + 4) > state.buffer.length) {
            return [ state, null ];
        }
        li = state.buffer.readUint16BE(2);
        bytesRead += 2;
    }
    if ((state.bufferIndex + bytesRead + li) > state.buffer.length) {
        return [ state, null ];
    }
    const startOfValue: number = state.bufferIndex + bytesRead;
    state.bufferIndex = startOfValue;
    const spdu: SPDU = {
        si,
        parameters: [],
    };
    const encounteredParams: Set<number> = new Set();
    while ((state.bufferIndex - startOfValue) < li) { // eslint-disable-line
        const [ newState, param ] = parsePGIorPI(state, 0);
        if (!param) {
            break;
        }
        Object.assign(state, newState);
        spdu.parameters.push(param);
        const id: number = ("pgi" in param) ? param.pgi : param.pi;
        if (encounteredParams.has(id)) {
            return [ state, null ]; // TODO: Return error.
        }
        encounteredParams.add(id);
    }
    state.bufferIndex = (state.bufferIndex + li);
    if (
        (prior_spdus.length === 1)
        && (prior_spdus[0].si === SI_GT_SPDU)
        && (si === SI_DT_SPDU) // Hint: SI_DT_SPDU === SI_GT_SPDU.
    ) {
        // Parse user-information
        spdu.userInformation = state.buffer.subarray(state.bufferIndex);
        state.bufferIndex = state.buffer.length;
    }
    return [ state, spdu ];
}

export
function receiveTSDU (state: SessionServiceConnectionState, tsdu: Buffer): number {
    // This should be a FULL reset every time.
    state.buffer = tsdu;
    state.bufferIndex = 0;
    const spdus: SPDU[] = [];
    while (state.bufferIndex < state.buffer.length) { // eslint-disable-line
        const [ newState, spdu ] = parseSPDU(state, spdus);
        if (!spdu) {
            break;
        }
        state = newState;
        if (category_1_spdus.has(spdu.si)) {
            // return ERR_MULTIPLE_SPDU_IN_TSDU;
            spdu.userInformation = state.buffer.subarray(state.bufferIndex);
            state.bufferIndex = state.buffer.length;
        }
        spdus.push(spdu);
    }
    if ((spdus.length === 1) && category_2_spdus.has(spdus[0].si)) {
        return ERR_SINGLE_SPDU_IN_TSDU;
    }
    state.buffer = state.buffer.subarray(state.bufferIndex);
    state.bufferIndex = 0;
    for (const spdu of spdus) {
        const [ newConnState, errCode ] = handleSPDU(state, spdu);
        if (errCode !== undefined) {
            return errCode;
        }
        Object.assign(state, newConnState); // So we can keep the same reference.
    }
    return 0;
}

// FIXME: Don't parse PIs from PGIs that do not contain PIs (just opaque bytes).

/*

Design mistakes in this library:

- Just mutate the state object by reference. Don't bother returning it. This was
  a real big pain, because the event handlers would run to completion before the
  updated state would be returned, meaning that the event handlers themselves
  would have a outdated state to work with.
- Several SPDUs have identical SIs. There really should be an enum or something
  so you can differential the different SPDUs. The SI alone should not be used.

*/
