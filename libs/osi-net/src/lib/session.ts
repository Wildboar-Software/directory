import { TypedEmitter } from 'tiny-typed-emitter';

type SerialNumber = number;

export const DEFAULT_MAX_SSDU_SIZE: number = 10_000_000;
/**
 * There is technically no limit on TSDU size if none is specified, but still,
 * I believe ITOT and the full OSI protocol stack only support up to 64K-ish
 * bytes per TSDU, so this implementation will use an implicit default of
 * 64K (minus a few bytes to avoid bugs).
 */
export const DEFAULT_MAX_TSDU_SIZE: number = 65500;

// #region protocol_version

export const SESSION_PROTOCOL_VERSION_1: number = 1;
export const SESSION_PROTOCOL_VERSION_2: number = 2;

// #endregion

// #region connection states

// Table A.2 in Annex A of ITU Rec. X.225.
// Yes, there are some numbers missing from the sequence, such as STA07 and STA17.
export enum TableA2SessionConnectionState {
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
export const ERR_SSDU_TOO_LARGE: number = -12;

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
export const SI_AB_SPDU: number = 25; // ABORT // WARNING: DUPLICATE
export const SI_AA_SPDU: number = 26; // ABORT ACCEPT // WARNING: DUPLICATE
export const SI_DT_SPDU: number = 1; // DATA TRANSFER // WARNING: DUPLICATE
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

export const category_0_spdus: Set<number> = new Set([SI_GT_SPDU, SI_PT_SPDU]);

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
    // SI_AI_SPDU, // Same as ABORT
    // SI_AIA_SPDU, // Same as ABORT ACCEPT
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

export const pgis: Set<number> = new Set([
    PGI_CONNECTION_ID,
    PGI_CONNECT_ACCEPT,
    PGI_USER_DATA,
    PGI_EXTENDED_USER_DATA,
    PGI_LINKING_INFO,
]);

// PGIs that only contain a value, not PIs.
export const valueOnlyPGIs: Set<number> = new Set([
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

export const serialNumberDigitToStrDigit: Map<number, string> = new Map([
    [SERIAL_NUMBER_DIGIT_0, '0'],
    [SERIAL_NUMBER_DIGIT_1, '1'],
    [SERIAL_NUMBER_DIGIT_2, '2'],
    [SERIAL_NUMBER_DIGIT_3, '3'],
    [SERIAL_NUMBER_DIGIT_4, '4'],
    [SERIAL_NUMBER_DIGIT_5, '5'],
    [SERIAL_NUMBER_DIGIT_6, '6'],
    [SERIAL_NUMBER_DIGIT_7, '7'],
    [SERIAL_NUMBER_DIGIT_8, '8'],
    [SERIAL_NUMBER_DIGIT_9, '9'],
]);

export const strDigitToSerialNumberDigit: Map<number, number> = new Map([
    ['0'.charCodeAt(0), SERIAL_NUMBER_DIGIT_0],
    ['1'.charCodeAt(0), SERIAL_NUMBER_DIGIT_1],
    ['2'.charCodeAt(0), SERIAL_NUMBER_DIGIT_2],
    ['3'.charCodeAt(0), SERIAL_NUMBER_DIGIT_3],
    ['4'.charCodeAt(0), SERIAL_NUMBER_DIGIT_4],
    ['5'.charCodeAt(0), SERIAL_NUMBER_DIGIT_5],
    ['6'.charCodeAt(0), SERIAL_NUMBER_DIGIT_6],
    ['7'.charCodeAt(0), SERIAL_NUMBER_DIGIT_7],
    ['8'.charCodeAt(0), SERIAL_NUMBER_DIGIT_8],
    ['9'.charCodeAt(0), SERIAL_NUMBER_DIGIT_9],
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
export const RC_REJECTION_BY_SPM_IMPLEMENTATION_RESTRICTION_STATED_IN_PICS: number =
    128 + 6;
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

export interface SessionLayerKernelFunctionalUnitEvents {
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

export interface SessionLayerEvents
    extends SessionLayerKernelFunctionalUnitEvents {
    TSDU: (bytes: Buffer) => unknown;
}

export class SessionLayerEventEmitter extends TypedEmitter<SessionLayerEvents> {}

export interface SessionLayerOutgoingEvents {
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
    SDTind: (ssdu: Buffer) => unknown;
    SEXind: () => unknown;
    SGTind: () => unknown;
    SPABind: (spdu?: ABORT_SPDU) => unknown;
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
    SUABind: (spdu: ABORT_SPDU) => unknown;
    SUERind: () => unknown;
    TCONreq: () => unknown;
    TCONrsp: () => unknown;
    TDISreq: () => unknown;
    AA: () => unknown;
    AB_nr: (spdu: ABORT_SPDU) => unknown;
    AB_r: (spdu: ABORT_SPDU) => unknown;
    AC: (spdu: ACCEPT_SPDU) => unknown;
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
    CDO: (spdu: CONNECT_DATA_OVERFLOW_SPDU) => unknown;
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
    OA: (spdu: OVERFLOW_ACCEPT_SPDU) => unknown;
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
}

export class SessionLayerOutgoingEventEmitter extends TypedEmitter<SessionLayerOutgoingEvents> {}

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

export function dispatch_SCONreq(
    state: SessionServiceConnectionState,
    cn: CONNECT_SPDU
): SessionServiceConnectionState {
    if (cn.userData && cn.extendedUserData) {
        return handleInvalidSPDU(state);
    }
    const user_data = cn.userData ?? cn.extendedUserData;
    // This if block is not part of the specification.
    if (user_data) {
        if (user_data.length < 512) {
            cn.userData = user_data;
            cn.extendedUserData = undefined;
            cn.dataOverflow = undefined;
        } else if (user_data.length < 10240) {
            cn.userData = undefined;
            cn.extendedUserData = user_data;
            cn.dataOverflow = undefined;
        } else {
            cn.userData = undefined;
            cn.extendedUserData = user_data.subarray(0, 10240);
            cn.dataOverflow = 1; // Yes, there is overflow.
            state.connectData = user_data;
        }
        if (user_data.length > 512) {
            if (!cn.connectAcceptItem) {
                cn.connectAcceptItem = {
                    versionNumber: 2,
                    protocolOptions: 0,
                };
            }
            if (
                (cn.connectAcceptItem.versionNumber === undefined)
                || (cn.connectAcceptItem.versionNumber % 2)
            ) {
                cn.connectAcceptItem.versionNumber = 2;
            }
        }
    }
    if (!cn.connectAcceptItem) {
        cn.connectAcceptItem = {
            protocolOptions: 0,
            versionNumber: 0b0000_0011,
            tsduMaximumSize: {
                initiator_to_responder: DEFAULT_MAX_TSDU_SIZE,
                responder_to_initiator: DEFAULT_MAX_TSDU_SIZE,
            },
        };
    }
    state.cn = cn;
    switch (state.state) {
        case TableA2SessionConnectionState.STA01: {
            state.Vtca = false;
            state.state = TableA2SessionConnectionState.STA01B;
            state.transport.connect(); // FIXME: Get rid of this method entirely.
            state.outgoingEvents.emit('TCONreq');
            break;
        }
        case TableA2SessionConnectionState.STA01C: {
            const p01: boolean = !state.Vtca;
            const p204: boolean = (cn.dataOverflow ?? 0) > 0; // More than 10240 octets of SS-user data to be transferred.
            if (p01) {
                if (p204) {
                    state.state = TableA2SessionConnectionState.STA02B; // Await OA
                } else {
                    state.state = TableA2SessionConnectionState.STA02A; // Await AC
                }
                if (cn.callingSessionSelector) {
                    state.local_selector = cn.calledSessionSelector;
                }
                state.outgoingEvents.emit('CN', cn);
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

export function dispatch_SCONrsp_accept(
    state: SessionServiceConnectionState,
    spdu: ACCEPT_SPDU
): SessionServiceConnectionState {
    if (!state.cn) {
        return state;
    }
    switch (state.state) {
        case TableA2SessionConnectionState.STA08: {
            // NOTE: It is not clear what to do if this is unset.
            state.V_A = spdu.connectAcceptItem?.initialSerialNumber ?? 0;
            state.V_M = spdu.connectAcceptItem?.initialSerialNumber ?? 0;
            state.V_R = 0;
            state.Vcoll = false;
            state.Vrsp = 'no';
            state.Vsc = false;
            state.Vado = -1;
            state.Vadi = -1;
            state.TEXP =
                ((state.cn.sessionUserRequirements ?? 0) & SUR_EXPEDITED_DATA) >
                0;
            state.FU =
                ((spdu.sessionUserRequirements ?? 0) &
                    (state.cn.sessionUserRequirements ?? 0)) %
                65535;
            state.Vact = false; // This is supposed to get set to false if FU(ACT), but it defaults to that...
            state.Vdnr = false;
            if (spdu.tokenItem) {
                const dataTokenSetting: number = spdu.tokenItem & 0b0000_0011;
                const syncMinorTokenSetting: number =
                    (spdu.tokenItem & 0b0000_1100) >> 2;
                const activityTokenSetting: number =
                    (spdu.tokenItem & 0b0011_0000) >> 4;
                const releaseTokenSetting: number =
                    (spdu.tokenItem & 0b1100_0000) >> 6;
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
                state.synchronizeMinorToken =
                    SessionServiceTokenPossession.remote;
                state.majorActivityToken = SessionServiceTokenPossession.remote;
                state.releaseToken = SessionServiceTokenPossession.remote;
            }
            state.state = TableA2SessionConnectionState.STA713;
            if (!spdu.callingSessionSelector && state.remote_selector) {
                spdu.callingSessionSelector = state.remote_selector;
            }
            if (spdu.respondingSessionSelector) {
                state.local_selector = spdu.respondingSessionSelector;
            }
            state.outgoingEvents.emit('AC', spdu);
            break;
        }
        case TableA2SessionConnectionState.STA15D: {
            // This seems like a NOOP.
            break;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
    return state;
}

export function dispatch_SCONrsp_reject(
    state: SessionServiceConnectionState,
    spdu: REFUSE_SPDU
): SessionServiceConnectionState {
    switch (state.state) {
        case TableA2SessionConnectionState.STA08: {
            const p02_local_choice: boolean = false;
            const p02: boolean = p02_local_choice && !state.TEXP;
            if (p02) {
                state.state = TableA2SessionConnectionState.STA16;
                state.TIM = setTimeout(() => {
                    state.outgoingEvents.emit('TDISreq');
                }, state.timer_timeout);
                state.outgoingEvents.emit('RF_r', {
                    ...spdu,
                    transportDisconnect: TRANSPORT_DISCONNECT_KEPT,
                });
            } else {
                state.state = TableA2SessionConnectionState.STA01C;
                state.outgoingEvents.emit('RF_nr', {
                    ...spdu,
                    transportDisconnect: TRANSPORT_DISCONNECT_RELEASED,
                });
            }
            return state;
        }
        case TableA2SessionConnectionState.STA15D: {
            state.TIM = setTimeout(() => {
                state.outgoingEvents.emit('TDISreq');
            }, state.timer_timeout);
            state.state = TableA2SessionConnectionState.STA16;
            return state;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
}

// NOTE: Data is already segmented within `writeTSDU()`.
export function dispatch_SDTreq(
    state: SessionServiceConnectionState,
    dt: DATA_TRANSFER_SPDU
): SessionServiceConnectionState {
    switch (state.state) {
        case TableA2SessionConnectionState.STA09: {
            const p04: boolean = (state.FU & SUR_DUPLEX) > 0 && !state.Vcoll;
            if (p04) {
                state.outgoingEvents.emit("DT", dt);
            } else {
                return handleInvalidSequence(state);
            }
            break;
        }
        case TableA2SessionConnectionState.STA10A:
        case TableA2SessionConnectionState.STA10B:
        case TableA2SessionConnectionState.STA713: {
            const p03: boolean = // I(dk) = !AV(dk) OR OWNED(dk) = !FU(HD) OR OWNED(dk)
                !(state.FU & SUR_HALF_DUPLEX) ||
                state.dataToken === SessionServiceTokenPossession.local;
            if (p03) {
                state.outgoingEvents.emit("DT", dt);
            } else {
                return handleInvalidSequence(state);
            }
            break;
        }
        case TableA2SessionConnectionState.STA15B: {
            const p03: boolean = // I(dk) = !AV(dk) OR OWNED(dk) = !FU(HD) OR OWNED(dk)
                !(state.FU & SUR_HALF_DUPLEX) ||
                state.dataToken === SessionServiceTokenPossession.local;
            if (!p03) {
                return handleInvalidSequence(state);
            }
            break;
        }
        case TableA2SessionConnectionState.STA15D: {
            // NOOP
            break;
        }
        case TableA2SessionConnectionState.STA18: {
            const p70: boolean = (state.FU & SUR_DUPLEX) > 0;
            if (p70) {
                state.state = TableA2SessionConnectionState.STA18;
                state.outgoingEvents.emit("DT", dt);
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

export function dispatch_SRELreq(
    state: SessionServiceConnectionState,
    fn: FINISH_SPDU
): SessionServiceConnectionState {
    switch (state.state) {
        case TableA2SessionConnectionState.STA09: {
            const p65: boolean =
                (state.FU & SUR_MINOR_SYNC ||
                    state.FU & SUR_HALF_DUPLEX ||
                    state.FU & SUR_NEGOTIATED_RELEASE ||
                    state.FU & SUR_MAJOR_SYNC ||
                    state.FU & SUR_ACTIVITY_MANAGEMENT) > 0; // ANY(AV, tk-dom)
            if (p65) {
                return handleInvalidSequence(state);
            } else {
                state.Vtrr = false;
                state.Vcoll = true;
                state.state = TableA2SessionConnectionState.STA09;
                state.outgoingEvents.emit('FN_nr', {
                    ...fn,
                    transportDisconnect: TRANSPORT_DISCONNECT_RELEASED,
                });
            }
            break;
        }
        case TableA2SessionConnectionState.STA15B: {
            const p63: boolean = // ALL(I, tk-dom) & [¬FU(ACT) OR ¬Vact]
                // ALL(I, tk-dom) = ¬AV(t) OR OWNED(t) for all tokens
                (!(state.FU & SUR_MINOR_SYNC) ||
                    state.synchronizeMinorToken ===
                        SessionServiceTokenPossession.local) &&
                (!(state.FU & SUR_HALF_DUPLEX) ||
                    state.dataToken === SessionServiceTokenPossession.local) &&
                (!(state.FU & SUR_NEGOTIATED_RELEASE) ||
                    state.releaseToken ===
                        SessionServiceTokenPossession.local) &&
                (!(state.FU & SUR_MAJOR_SYNC) ||
                    state.majorActivityToken ===
                        SessionServiceTokenPossession.local) &&
                (!(state.FU & SUR_ACTIVITY_MANAGEMENT) ||
                    state.majorActivityToken ===
                        SessionServiceTokenPossession.local) && // [¬FU(ACT) OR ¬Vact]
                ((state.FU & SUR_ACTIVITY_MANAGEMENT) === 0 || // ¬FU(ACT)
                    !state.Vact);
            if (!p63) {
                return handleInvalidSequence(state);
            }
            break;
        }
        case TableA2SessionConnectionState.STA15D: {
            // NOOP
            break;
        }
        case TableA2SessionConnectionState.STA713: {
            const p63: boolean = // ALL(I, tk-dom) & [¬FU(ACT) OR ¬Vact]
                // ALL(I, tk-dom) = ¬AV(t) OR OWNED(t) for all tokens
                (!(state.FU & SUR_MINOR_SYNC) ||
                    state.synchronizeMinorToken ===
                        SessionServiceTokenPossession.local) &&
                (!(state.FU & SUR_HALF_DUPLEX) ||
                    state.dataToken === SessionServiceTokenPossession.local) &&
                (!(state.FU & SUR_NEGOTIATED_RELEASE) ||
                    state.releaseToken ===
                        SessionServiceTokenPossession.local) &&
                (!(state.FU & SUR_MAJOR_SYNC) ||
                    state.majorActivityToken ===
                        SessionServiceTokenPossession.local) &&
                (!(state.FU & SUR_ACTIVITY_MANAGEMENT) ||
                    state.majorActivityToken ===
                        SessionServiceTokenPossession.local) && // [¬FU(ACT) OR ¬Vact]
                ((state.FU & SUR_ACTIVITY_MANAGEMENT) === 0 || // ¬FU(ACT)
                    !state.Vact);
            const p64_local_choice: boolean = false;
            const p64: boolean = p64_local_choice && !state.Vtca && !state.TEXP;
            if (p63) {
                state.state = TableA2SessionConnectionState.STA03;
                if (p64) {
                    state.Vtrr = true;
                    state.outgoingEvents.emit('FN_r', {
                        ...fn,
                        transportDisconnect: TRANSPORT_DISCONNECT_KEPT,
                    });
                } else {
                    state.Vtrr = false;
                    state.outgoingEvents.emit('FN_nr', {
                        ...fn,
                        transportDisconnect: TRANSPORT_DISCONNECT_RELEASED,
                    });
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

export function dispatch_SRELrsp_accept(
    state: SessionServiceConnectionState,
    dn: DISCONNECT_SPDU
): SessionServiceConnectionState {
    switch (state.state) {
        case TableA2SessionConnectionState.STA09: {
            const p66: boolean = state.Vtrr;
            const p75: boolean = (state.Vcoll && state.Vdnr) || !state.Vcoll; // (Vcoll & Vdnr) OR ¬Vcoll
            const p69: boolean = state.Vcoll;
            const p01: boolean = !state.Vtca;
            if (p66) {
                state.state = TableA2SessionConnectionState.STA01C;
                state.outgoingEvents.emit('DN', dn);
            } else if (!p66 && p75) {
                state.TIM = setTimeout(() => {
                    state.outgoingEvents.emit('TDISreq');
                }, state.timer_timeout);
                state.state = TableA2SessionConnectionState.STA16;
                state.outgoingEvents.emit('DN', dn);
            } else if (p69 && p01) {
                state.state = TableA2SessionConnectionState.STA03;
                state.outgoingEvents.emit('DN', dn);
            } else {
                return handleInvalidSequence(state);
            }
            break;
        }
        case TableA2SessionConnectionState.STA15D: {
            state.TIM = setTimeout(() => {
                state.outgoingEvents.emit('TDISreq');
            }, state.timer_timeout);
            state.state = TableA2SessionConnectionState.STA16;
            break;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
    return state;
}

export function dispatch_SRELrsp_reject(
    state: SessionServiceConnectionState,
    nf: NOT_FINISHED_SPDU
): SessionServiceConnectionState {
    switch (state.state) {
        case TableA2SessionConnectionState.STA09: {
            const p67: boolean = (state.FU & SUR_NEGOTIATED_RELEASE) > 0;
            if (p67) {
                state.state = TableA2SessionConnectionState.STA713;
                state.outgoingEvents.emit('NF', nf);
            } else {
                // If Negotiated Release is not available, we just accept the release.
                return dispatch_SRELrsp_accept(state, {});
            }
            break;
        }
        case TableA2SessionConnectionState.STA15D: {
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

export function dispatch_SUABreq(
    state: SessionServiceConnectionState,
    ab: ABORT_SPDU
): SessionServiceConnectionState {
    const p02_local_choice: boolean = false;
    const p02: boolean = p02_local_choice && !state.TEXP;
    /// See ITU Rec. X.225 (1995), page 161, footnote 4.
    const send_prepare_spdu: boolean =
        state.TEXP && (ab.userData?.length ?? 0) > 9;
    switch (state.state) {
        case TableA2SessionConnectionState.STA06:
        case TableA2SessionConnectionState.STA15A:
        case TableA2SessionConnectionState.STA15B:
        case TableA2SessionConnectionState.STA15C: {
            if (!p02) {
                // const pr: PREPARE_SPDU = {
                //     prepareType: PREPARE_TYPE_ABORT,
                // };
                // const pr_tsdu = encode_PREPARE_SPDU(pr);
                state.TIM = setTimeout(() => {
                    state.outgoingEvents.emit('TDISreq');
                }, state.timer_timeout);
                state.state = TableA2SessionConnectionState.STA16;
                if (send_prepare_spdu) {
                    // PREPARE is only sent over the EXPEDITED DATA transport.
                    // TODO: state.transport.writeExpeditedTSDU(pr_tsdu);
                }
                state.outgoingEvents.emit('AB_nr', {
                    ...ab,
                    transportDisconnect: TRANSPORT_DISCONNECT_RELEASED,
                });
            } else {
                return handleInvalidSequence(state);
            }
            break;
        }
        case TableA2SessionConnectionState.STA15D: {
            state.state = TableA2SessionConnectionState.STA16;
            state.TIM = setTimeout(() => {
                state.outgoingEvents.emit('TDISreq');
            }, state.timer_timeout);
            break;
        }
        case TableA2SessionConnectionState.STA01B: {
            state.state = TableA2SessionConnectionState.STA01;
            state.outgoingEvents.emit('TDISreq');
            break;
        }
        case TableA2SessionConnectionState.STA02A:
        case TableA2SessionConnectionState.STA02B:
        case TableA2SessionConnectionState.STA03:
        case TableA2SessionConnectionState.STA04A:
        case TableA2SessionConnectionState.STA04B:
        case TableA2SessionConnectionState.STA05A:
        case TableA2SessionConnectionState.STA05B:
        case TableA2SessionConnectionState.STA05C:
        case TableA2SessionConnectionState.STA08:
        case TableA2SessionConnectionState.STA09:
        case TableA2SessionConnectionState.STA10A:
        case TableA2SessionConnectionState.STA10B:
        case TableA2SessionConnectionState.STA11A:
        case TableA2SessionConnectionState.STA11B:
        case TableA2SessionConnectionState.STA11C:
        case TableA2SessionConnectionState.STA18:
        case TableA2SessionConnectionState.STA19:
        case TableA2SessionConnectionState.STA20:
        case TableA2SessionConnectionState.STA21:
        case TableA2SessionConnectionState.STA22:
        case TableA2SessionConnectionState.STA713: {
            if (p02) {
                state.TIM = setTimeout(() => {
                    state.outgoingEvents.emit('TDISreq');
                }, state.timer_timeout);
                state.state = TableA2SessionConnectionState.STA01A;
                state.outgoingEvents.emit('AB_r', {
                    ...ab,
                    transportDisconnect: TRANSPORT_DISCONNECT_KEPT,
                });
            } else {
                // const pr: PREPARE_SPDU = {
                //     prepareType: PREPARE_TYPE_ABORT,
                // };
                // const pr_tsdu = encode_PREPARE_SPDU(pr);
                state.TIM = setTimeout(() => {
                    state.outgoingEvents.emit('TDISreq');
                }, state.timer_timeout);
                state.state = TableA2SessionConnectionState.STA16;
                if (send_prepare_spdu) {
                    // PREPARE is only sent over the EXPEDITED DATA transport.
                    // TODO: state.transport.writeExpeditedTSDU(pr_tsdu);
                }
                state.outgoingEvents.emit('AB_nr', {
                    ...ab,
                    transportDisconnect: TRANSPORT_DISCONNECT_RELEASED,
                });
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

export function dispatch_TCONind(
    state: SessionServiceConnectionState
): SessionServiceConnectionState {
    if (state.state !== TableA2SessionConnectionState.STA01) {
        return handleInvalidSequence(state);
    }
    state.Vtca = true;
    state.state = TableA2SessionConnectionState.STA01C;
    state.outgoingEvents.emit('TCONrsp');
    return state;
}

export function dispatch_TCONcnf(
    state: SessionServiceConnectionState
): SessionServiceConnectionState {
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
    state.outgoingEvents.emit('CN', state.cn);
    return state;
}

export function dispatch_TDISind(
    state: SessionServiceConnectionState
): SessionServiceConnectionState {
    switch (state.state) {
        case TableA2SessionConnectionState.STA01A:
        case TableA2SessionConnectionState.STA16: {
            if (state.TIM) {
                // [3]
                clearTimeout(state.TIM);
            }
            state.cn = undefined;
            state.state = TableA2SessionConnectionState.STA01;
            break;
        }
        case TableA2SessionConnectionState.STA01B: {
            state.state = TableA2SessionConnectionState.STA01;
            state.cn = undefined;
            state.outgoingEvents.emit('SPABind');
            break;
        }
        case TableA2SessionConnectionState.STA01C:
        case TableA2SessionConnectionState.STA01D: {
            state.cn = undefined;
            state.state = TableA2SessionConnectionState.STA01;
            break;
        }
        case TableA2SessionConnectionState.STA02A:
        case TableA2SessionConnectionState.STA02B:
        case TableA2SessionConnectionState.STA03:
        case TableA2SessionConnectionState.STA04A:
        case TableA2SessionConnectionState.STA04B:
        case TableA2SessionConnectionState.STA05A:
        case TableA2SessionConnectionState.STA05B:
        case TableA2SessionConnectionState.STA05C:
        case TableA2SessionConnectionState.STA06:
        case TableA2SessionConnectionState.STA08:
        case TableA2SessionConnectionState.STA09:
        case TableA2SessionConnectionState.STA10A:
        case TableA2SessionConnectionState.STA10B:
        case TableA2SessionConnectionState.STA11A:
        case TableA2SessionConnectionState.STA11B:
        case TableA2SessionConnectionState.STA11C:
        case TableA2SessionConnectionState.STA15A:
        case TableA2SessionConnectionState.STA15B:
        case TableA2SessionConnectionState.STA15C:
        case TableA2SessionConnectionState.STA15D:
        case TableA2SessionConnectionState.STA18:
        case TableA2SessionConnectionState.STA19:
        case TableA2SessionConnectionState.STA20:
        case TableA2SessionConnectionState.STA21:
        case TableA2SessionConnectionState.STA22:
        case TableA2SessionConnectionState.STA713: {
            state.state = TableA2SessionConnectionState.STA01;
            state.cn = undefined;
            state.outgoingEvents.emit('SPABind');
            break;
        }
        default: {
            return state; /* NOOP */
        }
    }
    return state;
}

export function dispatch_TIM_Timer(
    state: SessionServiceConnectionState
): SessionServiceConnectionState {
    switch (state.state) {
        case TableA2SessionConnectionState.STA01A:
        case TableA2SessionConnectionState.STA15D:
        case TableA2SessionConnectionState.STA16: {
            state.state = TableA2SessionConnectionState.STA01;
            state.outgoingEvents.emit('TDISreq');
            break;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
    return state;
}

export function dispatch_AA(
    state: SessionServiceConnectionState
): SessionServiceConnectionState {
    switch (state.state) {
        case TableA2SessionConnectionState.STA01A: {
            if (state.TIM) {
                clearTimeout(state.TIM);
            }
            state.state = TableA2SessionConnectionState.STA01C;
            break;
        }
        case TableA2SessionConnectionState.STA01C:
        case TableA2SessionConnectionState.STA01D: {
            state.state = TableA2SessionConnectionState.STA01;
            state.outgoingEvents.emit('TDISreq');
            break;
        }
        case TableA2SessionConnectionState.STA16: {
            if (state.TIM) {
                clearTimeout(state.TIM);
            }
            state.state = TableA2SessionConnectionState.STA01;
            state.outgoingEvents.emit('TDISreq');
            break;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
    return state;
}

export function dispatch_AB_nr(
    state: SessionServiceConnectionState,
    spdu: ABORT_SPDU
): SessionServiceConnectionState {
    state.cn = undefined;
    const p02_local_choice: boolean = false;
    const p02: boolean = p02_local_choice && !state.TEXP;
    switch (state.state) {
        case TableA2SessionConnectionState.STA01A:
        case TableA2SessionConnectionState.STA16: {
            if (state.TIM) {
                clearTimeout(state.TIM);
            }
            state.state = TableA2SessionConnectionState.STA01;
            state.outgoingEvents.emit('TDISreq');
            break;
        }
        case TableA2SessionConnectionState.STA01C:
        case TableA2SessionConnectionState.STA01D: {
            state.state = TableA2SessionConnectionState.STA01;
            state.outgoingEvents.emit('TDISreq');
            break;
        }
        case TableA2SessionConnectionState.STA02A:
        case TableA2SessionConnectionState.STA03:
        case TableA2SessionConnectionState.STA04A:
        case TableA2SessionConnectionState.STA04B:
        case TableA2SessionConnectionState.STA05A:
        case TableA2SessionConnectionState.STA05B:
        case TableA2SessionConnectionState.STA05C:
        case TableA2SessionConnectionState.STA08:
        case TableA2SessionConnectionState.STA09:
        case TableA2SessionConnectionState.STA10A:
        case TableA2SessionConnectionState.STA10B:
        case TableA2SessionConnectionState.STA11A:
        case TableA2SessionConnectionState.STA11B:
        case TableA2SessionConnectionState.STA11C:
        case TableA2SessionConnectionState.STA18:
        case TableA2SessionConnectionState.STA19:
        case TableA2SessionConnectionState.STA20:
        case TableA2SessionConnectionState.STA21:
        case TableA2SessionConnectionState.STA22:
        case TableA2SessionConnectionState.STA713: {
            state.state = p02
                ? TableA2SessionConnectionState.STA16
                : TableA2SessionConnectionState.STA01;
            if (
                spdu.transportDisconnect !== undefined &&
                spdu.transportDisconnect & 0b10 // user abort
            ) {
                state.outgoingEvents.emit('SUABind', spdu);
            } else {
                state.outgoingEvents.emit('SPABind', spdu);
            }
            if (p02) {
                state.TIM = setTimeout(() => {
                    state.outgoingEvents.emit('TDISreq');
                }, state.timer_timeout);
                state.outgoingEvents.emit('AA');
            } else {
                state.outgoingEvents.emit('TDISreq');
            }
            break;
        }
        case TableA2SessionConnectionState.STA02B:
        case TableA2SessionConnectionState.STA06:
        case TableA2SessionConnectionState.STA15A:
        case TableA2SessionConnectionState.STA15B:
        case TableA2SessionConnectionState.STA15C:
        case TableA2SessionConnectionState.STA15D: {
            state.state = TableA2SessionConnectionState.STA01;
            if (
                spdu.transportDisconnect !== undefined &&
                spdu.transportDisconnect & 0b10 // user abort
            ) {
                state.outgoingEvents.emit('SUABind', spdu);
            } else {
                state.outgoingEvents.emit('SPABind');
            }
            state.outgoingEvents.emit('TDISreq');
            break;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
    return state;
}

export function dispatch_AB_r(
    state: SessionServiceConnectionState,
    spdu: ABORT_SPDU
): SessionServiceConnectionState {
    state.cn = undefined;
    const p02_local_choice: boolean = false;
    const p02: boolean = p02_local_choice && !state.TEXP;
    switch (state.state) {
        case TableA2SessionConnectionState.STA01A: {
            if (state.TIM) {
                clearTimeout(state.TIM);
            }
            state.state = TableA2SessionConnectionState.STA01C;
            break;
        }
        case TableA2SessionConnectionState.STA01C:
        case TableA2SessionConnectionState.STA01D: {
            if (p02) {
                state.state = TableA2SessionConnectionState.STA01C;
                state.outgoingEvents.emit('AA');
            } else {
                state.state = TableA2SessionConnectionState.STA01;
                state.outgoingEvents.emit('TDISreq');
            }
            break;
        }
        case TableA2SessionConnectionState.STA02A:
        case TableA2SessionConnectionState.STA02B:
        case TableA2SessionConnectionState.STA03:
        case TableA2SessionConnectionState.STA04A:
        case TableA2SessionConnectionState.STA04B:
        case TableA2SessionConnectionState.STA05A:
        case TableA2SessionConnectionState.STA05B:
        case TableA2SessionConnectionState.STA05C:
        case TableA2SessionConnectionState.STA08:
        case TableA2SessionConnectionState.STA09:
        case TableA2SessionConnectionState.STA10A:
        case TableA2SessionConnectionState.STA10B:
        case TableA2SessionConnectionState.STA11A:
        case TableA2SessionConnectionState.STA11B:
        case TableA2SessionConnectionState.STA11C:
        case TableA2SessionConnectionState.STA18:
        case TableA2SessionConnectionState.STA19:
        case TableA2SessionConnectionState.STA20:
        case TableA2SessionConnectionState.STA21:
        case TableA2SessionConnectionState.STA22:
        case TableA2SessionConnectionState.STA713: {
            state.state = p02
                ? TableA2SessionConnectionState.STA01C
                : TableA2SessionConnectionState.STA01;
            if (
                spdu.transportDisconnect !== undefined &&
                spdu.transportDisconnect & 0b10 // user abort
            ) {
                state.outgoingEvents.emit('SUABind', spdu);
            } else {
                state.outgoingEvents.emit('SPABind');
            }
            if (p02) {
                state.outgoingEvents.emit('AA');
            } else {
                state.outgoingEvents.emit('TDISreq');
            }
            break;
        }
        case TableA2SessionConnectionState.STA16: {
            if (state.TIM) {
                clearTimeout(state.TIM);
            }
            state.state = TableA2SessionConnectionState.STA01;
            state.outgoingEvents.emit('TDISreq');
            break;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
    return state;
}

export function dispatch_AC(
    state: SessionServiceConnectionState,
    spdu: ACCEPT_SPDU
): SessionServiceConnectionState {
    if (!state.cn) {
        return handleInvalidSequence(state);
    }
    state.version =
        (spdu.connectAcceptItem?.versionNumber ?? 0b0000_0001) & 0b0000_0010
            ? 2
            : 1;

    if (spdu.connectAcceptItem?.tsduMaximumSize) {
        const tsduMaximumSize = spdu.connectAcceptItem?.tsduMaximumSize;
        if (state.caller) {
            state.inbound_max_tsdu_size = Math.min(
                state.inbound_max_tsdu_size,
                tsduMaximumSize.responder_to_initiator,
            );
            state.outbound_max_tsdu_size = Math.min(
                state.outbound_max_tsdu_size,
                tsduMaximumSize.initiator_to_responder,
            );
        } else {
            state.inbound_max_tsdu_size = Math.min(
                state.inbound_max_tsdu_size,
                tsduMaximumSize.initiator_to_responder,
            );
            state.outbound_max_tsdu_size = Math.min(
                state.outbound_max_tsdu_size,
                tsduMaximumSize.responder_to_initiator,
            );
        }
    }

    switch (state.state) {
        case TableA2SessionConnectionState.STA01A: {
            // NOOP.
            break;
        }
        case TableA2SessionConnectionState.STA01C: {
            state.state = TableA2SessionConnectionState.STA01;
            state.outgoingEvents.emit('TDISreq');
            break;
        }
        case TableA2SessionConnectionState.STA02A: {
            // NOTE: It is not clear what to do if this is unset.
            state.V_A = spdu.connectAcceptItem?.initialSerialNumber ?? 0;
            state.V_M = spdu.connectAcceptItem?.initialSerialNumber ?? 0;
            state.V_R = 0;
            state.Vcoll = false;
            state.Vrsp = 'no';
            state.Vsc = false;
            state.Vado = -1;
            state.Vadi = -1;
            state.TEXP =
                ((state.cn.sessionUserRequirements ?? 0) & SUR_EXPEDITED_DATA) >
                0;
            state.FU =
                ((spdu.sessionUserRequirements ?? 0) &
                    (spdu.sessionUserRequirements ?? 0)) %
                65535;
            state.Vact = false; // This is supposed to get set to false if FU(ACT), but it defaults to that...
            state.Vdnr = false;
            if (spdu.tokenItem) {
                const dataTokenSetting: number = spdu.tokenItem & 0b0000_0011;
                const syncMinorTokenSetting: number =
                    (spdu.tokenItem & 0b0000_1100) >> 2;
                const activityTokenSetting: number =
                    (spdu.tokenItem & 0b0011_0000) >> 4;
                const releaseTokenSetting: number =
                    (spdu.tokenItem & 0b1100_0000) >> 6;
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
                state.synchronizeMinorToken =
                    SessionServiceTokenPossession.local;
                state.majorActivityToken = SessionServiceTokenPossession.local;
                state.releaseToken = SessionServiceTokenPossession.local;
            }
            state.state = TableA2SessionConnectionState.STA713;
            state.outgoingEvents.emit('SCONcnf_accept', spdu);
            break;
        }
        case TableA2SessionConnectionState.STA15D: {
            // NOOP.
            break;
        }
        case TableA2SessionConnectionState.STA16: {
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

export function dispatch_CDO(
    state: SessionServiceConnectionState,
    cn: CONNECT_SPDU,
    spdu: CONNECT_DATA_OVERFLOW_SPDU
): SessionServiceConnectionState {
    switch (state.state) {
        case TableA2SessionConnectionState.STA01C: {
            state.state = TableA2SessionConnectionState.STA01;
            state.outgoingEvents.emit('TDISreq');
            break;
        }
        case TableA2SessionConnectionState.STA01D: {
            const p202: boolean = (spdu.enclosureItem & 0b10) > 0; // End of user data.
            // [50: Preserve user data for subsequent SCONind]
            if (spdu.userData) {
                if ((state.userDataBuffer.length + spdu.userData.length) > state.max_ssdu_size) {
                    return handle_too_large_ssdu(state);
                }
                state.userDataBuffer = Buffer.concat([
                    state.userDataBuffer,
                    spdu.userData,
                ]);
            }
            if (p202) {
                state.state = TableA2SessionConnectionState.STA08;
                const oldBuffer = state.userDataBuffer;
                state.userDataBuffer = Buffer.alloc(0);
                state.outgoingEvents.emit('SCONind', {
                    ...cn,
                    userData: oldBuffer,
                    extendedUserData: undefined,
                    dataOverflow: 1,
                });
            } // The else condition is effectively a NOOP.
            break;
        }
        case TableA2SessionConnectionState.STA15D: {
            // NOOP
            break;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
    return state;
}

export function dispatch_CN(
    state: SessionServiceConnectionState,
    spdu: CONNECT_SPDU
): SessionServiceConnectionState {
    /* ITU Recommendation X.225 (1995), Section 8.3.1.21. Only one or the other
    may be present. */
    if (spdu.userData && spdu.extendedUserData) {
        return handleInvalidSPDU(state);
    }
    state.cn = spdu;
    switch (state.state) {
        case TableA2SessionConnectionState.STA01A: {
            if (state.TIM) {
                clearTimeout(state.TIM);
            }
            state.state = TableA2SessionConnectionState.STA01;
            state.outgoingEvents.emit('TDISreq');
            break;
        }
        case TableA2SessionConnectionState.STA01C: {
            const p02_local_choice: boolean = false;
            const p76_temporary_congestion: boolean = false;
            const p76_version_not_supported: boolean =
                spdu.connectAcceptItem?.versionNumber !== undefined &&
                spdu.connectAcceptItem.versionNumber > 2;
            const p01: boolean = !state.Vtca;
            const p02: boolean = p02_local_choice && !state.TEXP;
            const p76: boolean =
                p76_temporary_congestion
                || p76_version_not_supported
                // || !!spdu.calledSessionSelector // Any session selector is unrecognized.
                ;
            // TODO: Configurable temporary congestion.
            const p204: boolean = spdu.dataOverflow !== undefined; // More than 10 240 octets of SS-user data to be transferred

            if (p01) {
                // If this SPM initiated this transport.
                state.state = TableA2SessionConnectionState.STA01;
                state.outgoingEvents.emit('TDISreq'); // TDISreq
                return state;
            }

            // If this SPM did not initiate the transport, and there is no problem with the CN SPDU.
            if (!p76) {
                if (p204) {
                    // [50]: Preserve user data for subsequent SCONind
                    state.userDataBuffer =
                        spdu.extendedUserData ??
                        spdu.userData ??
                        Buffer.alloc(0);
                    if (state.userDataBuffer.length > state.max_ssdu_size) {
                        return handle_too_large_ssdu(state);
                    }
                    state.state = TableA2SessionConnectionState.STA01D;
                    state.outgoingEvents.emit('OA', {
                        versionNumber: 0b0000_0010,
                        tsduMaximumSize: {
                            initiator_to_responder: state.inbound_max_tsdu_size,
                            responder_to_initiator: state.outbound_max_tsdu_size,
                        },
                    });
                } else {
                    state.state = TableA2SessionConnectionState.STA08;
                    if (spdu.callingSessionSelector) {
                        state.remote_selector = spdu.callingSessionSelector;
                    }
                    state.outgoingEvents.emit('SCONind', spdu);
                }
            } else { // There was a problem.
                const reasonCode: number = (
                    (spdu.calledSessionSelector
                        ? RC_SESSION_SELECTOR_UNKNOWN
                        : p76_version_not_supported
                            ? RC_PROPOSED_PROTOCOL_VERSIONS_NOT_SUPPORTED
                            : p76_temporary_congestion
                                ? RC_TEMPORARY_CONGESTION
                                : RC_NO_REASON)
                )
                const rf: REFUSE_SPDU = {
                    reasonCode,
                };
                if (!p02) {
                    // ...and we are using expedited transport...
                    state.outgoingEvents.emit('RF_nr', {
                        ...rf,
                        transportDisconnect: TRANSPORT_DISCONNECT_RELEASED,
                    });
                    state.TIM = setTimeout(() => {
                        // [4]
                        state.outgoingEvents.emit('TDISreq');
                    }, state.timer_timeout);
                    state.state = TableA2SessionConnectionState.STA16;
                } else {
                    state.outgoingEvents.emit('RF_r', {
                        ...rf,
                        transportDisconnect: TRANSPORT_DISCONNECT_KEPT,
                    });
                    state.state = TableA2SessionConnectionState.STA01C;
                }
            }
            break;
        }
        case TableA2SessionConnectionState.STA16: {
            if (state.TIM) {
                clearTimeout(state.TIM);
            }
            state.outgoingEvents.emit('TDISreq');
            state.state = TableA2SessionConnectionState.STA01;
            break;
        }
        default: {
            /* NOOP or Not Possible. */
        }
    }
    return state;
}

export function dispatch_DN(
    state: SessionServiceConnectionState,
    spdu: DISCONNECT_SPDU
): SessionServiceConnectionState {
    switch (state.state) {
        case TableA2SessionConnectionState.STA01A: {
            // NOOP
            break;
        }
        case TableA2SessionConnectionState.STA01C:
        case TableA2SessionConnectionState.STA01D: {
            state.state = TableA2SessionConnectionState.STA01;
            state.outgoingEvents.emit('TDISreq');
            break;
        }
        case TableA2SessionConnectionState.STA03: {
            const p66: boolean = state.Vtrr;
            if (p66) {
                state.state = TableA2SessionConnectionState.STA01C;
                state.cn = undefined;
                state.outgoingEvents.emit('SRELcnf_accept', spdu);
            } else {
                state.state = TableA2SessionConnectionState.STA01;
                state.cn = undefined;
                state.outgoingEvents.emit('SRELcnf_accept', spdu);
                state.outgoingEvents.emit('TDISreq');
            }
            break;
        }
        case TableA2SessionConnectionState.STA09: {
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
            state.cn = undefined;
            state.outgoingEvents.emit('SRELcnf_accept', spdu);
            break;
        }
        case TableA2SessionConnectionState.STA16: {
            // NOOP
            break;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
    return state;
}

export function dispatch_DT(
    state: SessionServiceConnectionState,
    spdu: DATA_TRANSFER_SPDU
): SessionServiceConnectionState {
    const p05: boolean =
        (state.FU & SUR_HALF_DUPLEX) === 0 || // !AV(dk)
        state.dataToken !== SessionServiceTokenPossession.local; // !OWNED(dk) // A(dk)
    const p81: boolean =
        // ¬FU(SS) & V(Ado) ≥ V(A
        ((state.FU & SUR_SYMMETRIC_SYNC) === 0 && // ¬FU(SS)
            state.Vado >= state.V_A) || // V(Ado) ≥ V(A) // FU(SS) & V(Ado) ≥ V(As)
        ((state.FU & SUR_SYMMETRIC_SYNC) > 0 && // FU(SS)
            state.Vado >= state.VAs); // V(Ado) ≥ V(As)
    const p185: boolean = state.Discard_rcv_flow && !p81;
    switch (state.state) {
        case TableA2SessionConnectionState.STA01A: {
            // NOOP
            break;
        }
        case TableA2SessionConnectionState.STA01C:
        case TableA2SessionConnectionState.STA01D: {
            state.state = TableA2SessionConnectionState.STA01;
            state.outgoingEvents.emit('TDISreq');
            break;
        }
        case TableA2SessionConnectionState.STA03: {
            const p10: boolean = !state.Vcoll;
            if (p05 && p10) {
                state.outgoingEvents.emit('SDTind', spdu.userInformation);
            } else {
                return handleInvalidSequence(state);
            }
            break;
        }
        case TableA2SessionConnectionState.STA04A:
        case TableA2SessionConnectionState.STA04B:
        case TableA2SessionConnectionState.STA15A:
        case TableA2SessionConnectionState.STA713: {
            if (p05) {
                state.outgoingEvents.emit('SDTind', spdu.userInformation);
            } else {
                return handleInvalidSequence(state);
            }
            break;
        }
        case TableA2SessionConnectionState.STA05A:
        case TableA2SessionConnectionState.STA06:
        case TableA2SessionConnectionState.STA15B:
        case TableA2SessionConnectionState.STA15C: {
            if (p05) {
                if (p185) {
                    // NOOP
                } else {
                    state.outgoingEvents.emit('SDTind', spdu.userInformation);
                }
            } else {
                return handleInvalidSequence(state);
            }
            break;
        }
        case TableA2SessionConnectionState.STA05B:
        case TableA2SessionConnectionState.STA05C:
        case TableA2SessionConnectionState.STA20: {
            if (p05) {
                // NOOP
            } else {
                return handleInvalidSequence(state);
            }
            break;
        }
        case TableA2SessionConnectionState.STA11A: {
            if (p05 && !p185) {
                state.outgoingEvents.emit('SDTind', spdu.userInformation);
            } else {
                return handleInvalidSequence(state);
            }
            break;
        }
        case TableA2SessionConnectionState.STA15D: {
            // NOOP
            break;
        }
        case TableA2SessionConnectionState.STA16: {
            // NOOP
            break;
        }
        case TableA2SessionConnectionState.STA18:
        case TableA2SessionConnectionState.STA21: {
            const p70: boolean = (state.FU & SUR_DUPLEX) > 0;
            if (p70) {
                state.outgoingEvents.emit('SDTind', spdu.userInformation);
            } else {
                return handleInvalidSequence(state);
            }
            break;
        }
        case TableA2SessionConnectionState.STA19: {
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

export function dispatch_FN_nr(
    state: SessionServiceConnectionState,
    spdu: FINISH_SPDU
): SessionServiceConnectionState {
    switch (state.state) {
        case TableA2SessionConnectionState.STA01A: {
            // NOOP
            break;
        }
        case TableA2SessionConnectionState.STA01C:
        case TableA2SessionConnectionState.STA01D: {
            state.state = TableA2SessionConnectionState.STA01;
            state.outgoingEvents.emit('TDISreq');
            break;
        }
        case TableA2SessionConnectionState.STA03: {
            const p65: boolean = !!(
                state.FU & SUR_MINOR_SYNC ||
                state.FU & SUR_HALF_DUPLEX ||
                state.FU & SUR_NEGOTIATED_RELEASE ||
                state.FU & SUR_MAJOR_SYNC ||
                state.FU & SUR_ACTIVITY_MANAGEMENT
            ); // ANY(AV, tk-dom)
            if (!p65) {
                state.state = TableA2SessionConnectionState.STA09;
                state.Vtrr = false;
                state.Vcoll = true;
                state.outgoingEvents.emit('SRELind', spdu);
            }
            break;
        }
        case TableA2SessionConnectionState.STA05A:
        case TableA2SessionConnectionState.STA06: {
            // ALL(A, tk-dom) = none of the available tokens are owned
            // And (the activity management FU is not supported OR an activity is not in  progress)
            const p68: boolean =
                // ALL(A, tk-dom)
                (!(state.FU & SUR_MINOR_SYNC) ||
                    state.synchronizeMinorToken !==
                        SessionServiceTokenPossession.local) &&
                (!(state.FU & SUR_HALF_DUPLEX) ||
                    state.synchronizeMinorToken !==
                        SessionServiceTokenPossession.local) &&
                (!(state.FU & SUR_NEGOTIATED_RELEASE) ||
                    state.synchronizeMinorToken !==
                        SessionServiceTokenPossession.local) &&
                (!(
                    state.FU & SUR_MAJOR_SYNC ||
                    state.FU & SUR_ACTIVITY_MANAGEMENT
                ) ||
                    state.synchronizeMinorToken !==
                        SessionServiceTokenPossession.local) && // [¬FU(ACT) OR ¬Vact]
                (!(state.FU & SUR_ACTIVITY_MANAGEMENT) || !state.Vact);
            if (!p68) {
                return handleInvalidSequence(state);
            }
            break;
        }
        case TableA2SessionConnectionState.STA15C: {
            // ALL(A, tk-dom) = none of the available tokens are owned
            // And (the activity management FU is not supported OR an activity is not in  progress)
            const p68: boolean =
                // ALL(A, tk-dom)
                (!(state.FU & SUR_MINOR_SYNC) ||
                    state.synchronizeMinorToken !==
                        SessionServiceTokenPossession.local) &&
                (!(state.FU & SUR_HALF_DUPLEX) ||
                    state.synchronizeMinorToken !==
                        SessionServiceTokenPossession.local) &&
                (!(state.FU & SUR_NEGOTIATED_RELEASE) ||
                    state.synchronizeMinorToken !==
                        SessionServiceTokenPossession.local) &&
                (!(
                    state.FU & SUR_MAJOR_SYNC ||
                    state.FU & SUR_ACTIVITY_MANAGEMENT
                ) ||
                    state.synchronizeMinorToken !==
                        SessionServiceTokenPossession.local) && // [¬FU(ACT) OR ¬Vact]
                (!(state.FU & SUR_ACTIVITY_MANAGEMENT) || !state.Vact);
            if (!p68) {
                // REVIEW: Not sure how to interpret this cell.
                return handleInvalidSequence(state);
            }
            break;
        }
        case TableA2SessionConnectionState.STA15D: {
            // NOOP
            break;
        }
        case TableA2SessionConnectionState.STA16: {
            // NOOP
            break;
        }
        case TableA2SessionConnectionState.STA19:
        case TableA2SessionConnectionState.STA20: {
            // ALL(A, tk-dom) = none of the available tokens are owned
            // And (the activity management FU is not supported OR an activity is not in  progress)
            const p68: boolean =
                // ALL(A, tk-dom)
                (!(state.FU & SUR_MINOR_SYNC) ||
                    state.synchronizeMinorToken !==
                        SessionServiceTokenPossession.local) &&
                (!(state.FU & SUR_HALF_DUPLEX) ||
                    state.synchronizeMinorToken !==
                        SessionServiceTokenPossession.local) &&
                (!(state.FU & SUR_NEGOTIATED_RELEASE) ||
                    state.synchronizeMinorToken !==
                        SessionServiceTokenPossession.local) &&
                (!(
                    state.FU & SUR_MAJOR_SYNC ||
                    state.FU & SUR_ACTIVITY_MANAGEMENT
                ) ||
                    state.synchronizeMinorToken !==
                        SessionServiceTokenPossession.local) && // [¬FU(ACT) OR ¬Vact]
                (!(state.FU & SUR_ACTIVITY_MANAGEMENT) || !state.Vact);
            if (!p68) {
                return handleInvalidSequence(state);
            }
            break;
        }
        case TableA2SessionConnectionState.STA713: {
            // ALL(A, tk-dom) = none of the available tokens are owned
            // And (the activity management FU is not supported OR an activity is not in  progress)
            const p68: boolean =
                // ALL(A, tk-dom)
                (!(state.FU & SUR_MINOR_SYNC) ||
                    state.synchronizeMinorToken !==
                        SessionServiceTokenPossession.local) &&
                (!(state.FU & SUR_HALF_DUPLEX) ||
                    state.synchronizeMinorToken !==
                        SessionServiceTokenPossession.local) &&
                (!(state.FU & SUR_NEGOTIATED_RELEASE) ||
                    state.synchronizeMinorToken !==
                        SessionServiceTokenPossession.local) &&
                (!(
                    state.FU & SUR_MAJOR_SYNC ||
                    state.FU & SUR_ACTIVITY_MANAGEMENT
                ) ||
                    state.synchronizeMinorToken !==
                        SessionServiceTokenPossession.local) && // [¬FU(ACT) OR ¬Vact]
                (!(state.FU & SUR_ACTIVITY_MANAGEMENT) || !state.Vact);
            if (p68) {
                state.state = TableA2SessionConnectionState.STA09;
                state.Vtrr = false;
                state.outgoingEvents.emit('SRELind', spdu);
            }
            break;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
    return state;
}

export function dispatch_FN_r(
    state: SessionServiceConnectionState,
    spdu: FINISH_SPDU
): SessionServiceConnectionState {
    switch (state.state) {
        case TableA2SessionConnectionState.STA01A: {
            // NOOP
            break;
        }
        case TableA2SessionConnectionState.STA01C:
        case TableA2SessionConnectionState.STA01D: {
            state.outgoingEvents.emit('TDISreq');
            state.state = TableA2SessionConnectionState.STA01;
            break;
        }
        case TableA2SessionConnectionState.STA03: {
            const p65: boolean = !!(
                state.FU & SUR_MINOR_SYNC ||
                state.FU & SUR_HALF_DUPLEX ||
                state.FU & SUR_NEGOTIATED_RELEASE ||
                state.FU & SUR_MAJOR_SYNC ||
                state.FU & SUR_ACTIVITY_MANAGEMENT
            ); // ANY(AV, tk-dom)
            const p01: boolean = !state.Vtca;
            const p16: boolean = !state.TEXP;
            if (!p65 && !p01 && p16) {
                state.state = TableA2SessionConnectionState.STA09;
                state.Vtrr = false;
                state.Vcoll = true;
                state.outgoingEvents.emit('SRELind', spdu);
            }
            break;
        }
        case TableA2SessionConnectionState.STA05A: {
            // ALL(A, tk-dom) = none of the available tokens are owned
            // And (the activity management FU is not supported OR an activity is not in  progress)
            const p68: boolean =
                // ALL(A, tk-dom)
                (!(state.FU & SUR_MINOR_SYNC) ||
                    state.synchronizeMinorToken !==
                        SessionServiceTokenPossession.local) &&
                (!(state.FU & SUR_HALF_DUPLEX) ||
                    state.synchronizeMinorToken !==
                        SessionServiceTokenPossession.local) &&
                (!(state.FU & SUR_NEGOTIATED_RELEASE) ||
                    state.synchronizeMinorToken !==
                        SessionServiceTokenPossession.local) &&
                (!(
                    state.FU & SUR_MAJOR_SYNC ||
                    state.FU & SUR_ACTIVITY_MANAGEMENT
                ) ||
                    state.synchronizeMinorToken !==
                        SessionServiceTokenPossession.local) && // [¬FU(ACT) OR ¬Vact]
                (!(state.FU & SUR_ACTIVITY_MANAGEMENT) || !state.Vact);
            const p01: boolean = !state.Vtca;
            const p16: boolean = !state.TEXP;
            if (!p68 || p01 || !p16) {
                return handleInvalidSequence(state);
            }
            break;
        }
        case TableA2SessionConnectionState.STA15C: {
            // ALL(A, tk-dom) = none of the available tokens are owned
            // And (the activity management FU is not supported OR an activity is not in  progress)
            const p68: boolean =
                // ALL(A, tk-dom)
                (!(state.FU & SUR_MINOR_SYNC) ||
                    state.synchronizeMinorToken !==
                        SessionServiceTokenPossession.local) &&
                (!(state.FU & SUR_HALF_DUPLEX) ||
                    state.synchronizeMinorToken !==
                        SessionServiceTokenPossession.local) &&
                (!(state.FU & SUR_NEGOTIATED_RELEASE) ||
                    state.synchronizeMinorToken !==
                        SessionServiceTokenPossession.local) &&
                (!(
                    state.FU & SUR_MAJOR_SYNC ||
                    state.FU & SUR_ACTIVITY_MANAGEMENT
                ) ||
                    state.synchronizeMinorToken !==
                        SessionServiceTokenPossession.local) && // [¬FU(ACT) OR ¬Vact]
                (!(state.FU & SUR_ACTIVITY_MANAGEMENT) || !state.Vact);
            const p01: boolean = !state.Vtca;
            const p16: boolean = !state.TEXP;
            if (!(p68 && !p01 && p16)) {
                // REVIEW: Not sure how to interpret this cell.
                return handleInvalidSequence(state);
            }
            break;
        }
        case TableA2SessionConnectionState.STA16: {
            // NOOP
            break;
        }
        case TableA2SessionConnectionState.STA19:
        case TableA2SessionConnectionState.STA20: {
            // ALL(A, tk-dom) = none of the available tokens are owned
            // And (the activity management FU is not supported OR an activity is not in  progress)
            const p68: boolean =
                // ALL(A, tk-dom)
                (!(state.FU & SUR_MINOR_SYNC) ||
                    state.synchronizeMinorToken !==
                        SessionServiceTokenPossession.local) &&
                (!(state.FU & SUR_HALF_DUPLEX) ||
                    state.synchronizeMinorToken !==
                        SessionServiceTokenPossession.local) &&
                (!(state.FU & SUR_NEGOTIATED_RELEASE) ||
                    state.synchronizeMinorToken !==
                        SessionServiceTokenPossession.local) &&
                (!(
                    state.FU & SUR_MAJOR_SYNC ||
                    state.FU & SUR_ACTIVITY_MANAGEMENT
                ) ||
                    state.synchronizeMinorToken !==
                        SessionServiceTokenPossession.local) && // [¬FU(ACT) OR ¬Vact]
                (!(state.FU & SUR_ACTIVITY_MANAGEMENT) || !state.Vact);
            const p01: boolean = !state.Vtca;
            const p16: boolean = !state.TEXP;
            if (!(p68 && !p01 && p16)) {
                // REVIEW: Not sure how to interpret this cell.
                return handleInvalidSequence(state);
            }
            break;
        }
        case TableA2SessionConnectionState.STA713: {
            // ALL(A, tk-dom) = none of the available tokens are owned
            // And (the activity management FU is not supported OR an activity is not in  progress)
            const p68: boolean =
                // ALL(A, tk-dom)
                (!(state.FU & SUR_MINOR_SYNC) ||
                    state.synchronizeMinorToken !==
                        SessionServiceTokenPossession.local) &&
                (!(state.FU & SUR_HALF_DUPLEX) ||
                    state.synchronizeMinorToken !==
                        SessionServiceTokenPossession.local) &&
                (!(state.FU & SUR_NEGOTIATED_RELEASE) ||
                    state.synchronizeMinorToken !==
                        SessionServiceTokenPossession.local) &&
                (!(
                    state.FU & SUR_MAJOR_SYNC ||
                    state.FU & SUR_ACTIVITY_MANAGEMENT
                ) ||
                    state.synchronizeMinorToken !==
                        SessionServiceTokenPossession.local) && // [¬FU(ACT) OR ¬Vact]
                (!(state.FU & SUR_ACTIVITY_MANAGEMENT) || !state.Vact);
            if (p68) {
                state.Vtrr =
                    spdu.transportDisconnect === TRANSPORT_DISCONNECT_KEPT;
                state.state = TableA2SessionConnectionState.STA09;
                state.outgoingEvents.emit('SRELind', spdu);
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

export function dispatch_NF(
    state: SessionServiceConnectionState,
    spdu: NOT_FINISHED_SPDU
): SessionServiceConnectionState {
    switch (state.state) {
        case TableA2SessionConnectionState.STA01A: {
            // NOOP
            break;
        }
        case TableA2SessionConnectionState.STA01C:
        case TableA2SessionConnectionState.STA01D: {
            state.state = TableA2SessionConnectionState.STA01;
            state.outgoingEvents.emit('TDISreq');
            break;
        }
        case TableA2SessionConnectionState.STA03: {
            const p67: boolean = false;
            if (p67) {
                state.state = TableA2SessionConnectionState.STA713;
                state.outgoingEvents.emit('SRELcnf_reject', spdu);
            } else {
                return handleInvalidSequence(state);
            }
            break;
        }
        case TableA2SessionConnectionState.STA05A: {
            const p67: boolean = false;
            if (p67) {
                state.state = TableA2SessionConnectionState.STA15B;
                state.outgoingEvents.emit('SRELcnf_reject', spdu);
            } else {
                return handleInvalidSequence(state);
            }
            break;
        }
        case TableA2SessionConnectionState.STA15D:
        case TableA2SessionConnectionState.STA16: {
            // NOOP
            break;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
    return state;
}

export function dispatch_OA(
    state: SessionServiceConnectionState,
    spdu: OVERFLOW_ACCEPT_SPDU,
    userData: Buffer // This should include the first 10240 octets that should have already been sent.
): SessionServiceConnectionState {
    switch (state.state) {
        case TableA2SessionConnectionState.STA01C: {
            state.state = TableA2SessionConnectionState.STA01;
            state.outgoingEvents.emit('TDISreq');
            break;
        }
        case TableA2SessionConnectionState.STA02B: {
            if (spdu.tsduMaximumSize) {
                if (state.caller) {
                    state.inbound_max_tsdu_size = Math.min(
                        state.inbound_max_tsdu_size,
                        spdu.tsduMaximumSize.responder_to_initiator,
                    );
                    state.outbound_max_tsdu_size = Math.min(
                        state.outbound_max_tsdu_size,
                        spdu.tsduMaximumSize.initiator_to_responder,
                    );
                } else {
                    state.inbound_max_tsdu_size = Math.min(
                        state.inbound_max_tsdu_size,
                        spdu.tsduMaximumSize.initiator_to_responder,
                    );
                    state.outbound_max_tsdu_size = Math.min(
                        state.outbound_max_tsdu_size,
                        spdu.tsduMaximumSize.responder_to_initiator,
                    );
                }
            }
            state.state = TableA2SessionConnectionState.STA02A;
            const size_without_user_data = encode_CONNECT_DATA_OVERFLOW_SPDU({
                enclosureItem: 1, // The value doesn't matter. This is just for calculating SPDU size.
                userData: undefined,
            }).length + 2; // +2 to account for change to long-form LI, plus a little error margin.
            const max_tsdu_size = state.outbound_max_tsdu_size ?? DEFAULT_MAX_TSDU_SIZE;
            const space_left_for_user_data = max_tsdu_size - size_without_user_data;
            if (space_left_for_user_data <= 0) {
                return handleInvalidSPDU(state); // FIXME: Abort, or something else.
            }
            let i = 10240;
            while (i < userData.length) {
                const final = (i + space_left_for_user_data) >= userData.length;
                const encoded = encode_CONNECT_DATA_OVERFLOW_SPDU({
                    ...spdu,
                    enclosureItem: (final ? 0b10 : 0b00), // Never going to be first in SSDU, which was sent in CN SPDU.
                    userData: userData.subarray(i, i + space_left_for_user_data),
                });
                state.transport.writeTSDU(encoded);
                i += space_left_for_user_data;
            }
            break;
        }
        case TableA2SessionConnectionState.STA15D: {
            // This seems to be a NOOP.
            break;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
    return state;
}

export function dispatch_PR_AB(
    state: SessionServiceConnectionState
): SessionServiceConnectionState {
    switch (state.state) {
        case TableA2SessionConnectionState.STA01C: {
            state.state = TableA2SessionConnectionState.STA01;
            state.outgoingEvents.emit('TDISreq');
            break;
        }
        case TableA2SessionConnectionState.STA16: {
            if (state.TIM) {
                clearTimeout(state.TIM);
            }
            state.state = TableA2SessionConnectionState.STA01;
            state.outgoingEvents.emit('TDISreq');
            break;
        }
        case TableA2SessionConnectionState.STA02A:
        case TableA2SessionConnectionState.STA03:
        case TableA2SessionConnectionState.STA04A:
        case TableA2SessionConnectionState.STA04B:
        case TableA2SessionConnectionState.STA05A:
        case TableA2SessionConnectionState.STA05B:
        case TableA2SessionConnectionState.STA05C:
        case TableA2SessionConnectionState.STA06:
        case TableA2SessionConnectionState.STA08:
        case TableA2SessionConnectionState.STA09:
        case TableA2SessionConnectionState.STA10A:
        case TableA2SessionConnectionState.STA10B:
        case TableA2SessionConnectionState.STA11A:
        case TableA2SessionConnectionState.STA11B:
        case TableA2SessionConnectionState.STA11C:
        case TableA2SessionConnectionState.STA15A:
        case TableA2SessionConnectionState.STA15B:
        case TableA2SessionConnectionState.STA15C:
        case TableA2SessionConnectionState.STA18:
        case TableA2SessionConnectionState.STA19:
        case TableA2SessionConnectionState.STA20:
        case TableA2SessionConnectionState.STA22:
        case TableA2SessionConnectionState.STA713: {
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

export function dispatch_RF_nr(
    state: SessionServiceConnectionState,
    spdu: REFUSE_SPDU
): SessionServiceConnectionState {
    switch (state.state) {
        case TableA2SessionConnectionState.STA01A: {
            // NOOP.
            break;
        }
        case TableA2SessionConnectionState.STA01C: {
            state.state = TableA2SessionConnectionState.STA01;
            state.outgoingEvents.emit('TDISreq');
            break;
        }
        case TableA2SessionConnectionState.STA02A: {
            state.state = TableA2SessionConnectionState.STA01;
            state.outgoingEvents.emit('SCONcnf_reject', spdu);
            state.outgoingEvents.emit('TDISreq');
            break;
        }
        case TableA2SessionConnectionState.STA02B: {
            state.state = TableA2SessionConnectionState.STA01;
            state.outgoingEvents.emit('SCONcnf_reject', spdu);
            state.outgoingEvents.emit('TDISreq');
            break;
        }
        case TableA2SessionConnectionState.STA16: {
            // NOOP.
            break;
        }
        default: {
            return handleInvalidSequence(state);
        }
    }
    return state;
}

export function dispatch_RF_r(
    state: SessionServiceConnectionState,
    spdu: REFUSE_SPDU
): SessionServiceConnectionState {
    switch (state.state) {
        case TableA2SessionConnectionState.STA01A: {
            // NOOP.
            break;
        }
        case TableA2SessionConnectionState.STA01C: {
            state.state = TableA2SessionConnectionState.STA01;
            state.outgoingEvents.emit('TDISreq');
            break;
        }
        case TableA2SessionConnectionState.STA02A:
        case TableA2SessionConnectionState.STA02B: {
            const p02_local_choice: boolean = true;
            const p02: boolean = p02_local_choice && !state.TEXP;
            if (p02) {
                state.state = TableA2SessionConnectionState.STA01C;
            } else {
                state.state = TableA2SessionConnectionState.STA01;
                state.outgoingEvents.emit('TDISreq');
            }
            state.outgoingEvents.emit('SCONcnf_reject', spdu);
            break;
        }
        case TableA2SessionConnectionState.STA16: {
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

export interface ConnectionIdentifier {
    calledSSUserReference?: Buffer; // 64 octets maximum.
    callingSSUserReference?: Buffer; // 64 octets maximum.
    commonReference?: Buffer; // 64 octets maximum.
    additionalReferenceInformation?: Buffer; // 4 octets maximum.
}

export interface TSDUMaximumSize {
    initiator_to_responder: number;
    responder_to_initiator: number;
}

export interface ConnectAcceptItem {
    protocolOptions: number; // bit field
    tsduMaximumSize?: TSDUMaximumSize; // limited to 2^32-1.
    versionNumber: number;
    initialSerialNumber?: number; // limited to 2^48-1.
    tokenSettingItem?: number; // bit field
    secondInitialSerialNumber?: number; // limited to 2^48-1.
    upperLimitSerialNumber?: number;
    largeInitialSerialNumber?: bigint;
    largeSecondInitialSerialNumber?: bigint;
}

export interface CONNECT_SPDU {
    connectionIdentifier?: ConnectionIdentifier;
    connectAcceptItem?: ConnectAcceptItem;
    sessionUserRequirements?: number; // bit field
    callingSessionSelector?: Buffer;
    calledSessionSelector?: Buffer;
    dataOverflow?: number;
    userData?: Buffer; // 512 octets maximum
    extendedUserData?: Buffer; // 10240 octets maximum
}

export interface OVERFLOW_ACCEPT_SPDU {
    tsduMaximumSize?: TSDUMaximumSize;
    versionNumber: number;
}

export interface CONNECT_DATA_OVERFLOW_SPDU {
    enclosureItem: number;
    userData?: Buffer;
}

export interface ACCEPT_SPDU {
    connectionIdentifier?: ConnectionIdentifier;
    connectAcceptItem?: ConnectAcceptItem;
    tokenItem?: number;
    sessionUserRequirements?: number;
    enclosureItem?: number;
    callingSessionSelector?: Buffer;
    respondingSessionSelector?: Buffer;
    userData?: Buffer;
}

export interface REFUSE_SPDU {
    connectionIdentifier?: ConnectionIdentifier;
    transportDisconnect?: number;
    sessionUserRequirements?: number;
    versionNumber?: number;
    enclosureItem?: number;
    reasonCode?: number;
    reasonData?: Buffer;
}

export interface FINISH_SPDU {
    transportDisconnect?: number;
    enclosureItem?: number;
    userData?: Buffer;
}

export interface DISCONNECT_SPDU {
    enclosureItem?: number;
    userData?: Buffer;
}

export interface NOT_FINISHED_SPDU {
    enclosureItem?: number;
    userData?: Buffer;
}

export interface ABORT_SPDU {
    transportDisconnect?: number;
    enclosureItem?: number;
    reflectParameterValues?: Buffer; // 9 octets maximum
    userData?: Buffer;
}

export interface ABORT_ACCEPT_SPDU {}

export interface DATA_TRANSFER_SPDU {
    enclosureItem?: number;
    userInformation: Buffer;
}

export interface PREPARE_SPDU {
    prepareType: number;
    resyncType?: number;
    secondResyncType?: number;
}

// #endregion PDUs

// #region PDU structure

export interface SessionParameter {
    pi: number;
    value: Buffer;
}

export interface SessionParameterGroup {
    pgi: number;
    parameters: SessionParameter[];
    value?: Buffer;
}

export interface SPDU {
    si: number;
    parameters: (SessionParameter | SessionParameterGroup)[];
    userInformation?: Buffer;
}

// #endregion PDU structure

// #region connection state

export enum SessionServiceTokenPossession {
    local, // See ITU Recommendation X.215 (1995), Section 7.2, bullet point e.
    remote, // See ITU Recommendation X.215 (1995), Section 7.2, bullet point e.
}

export enum SessionServicePhase {
    establishment,
    dataTransfer,
    release,
    disconnected,
}

export interface SessionServicePDUParserState {
    buffer: Buffer;
    bufferIndex: number;
}

export interface AnnexASessionState {
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
    Vrsp: 'no' | 'a' | 'r' | 's' | 'dsc' | 'int';

    /**
     * The serial number in case of resynchronize restart.
     */
    Vrspnb: number;

    /**
     * The resync type of the sending flow.
     */
    Vrsps: AnnexASessionState['Vrsp'];

    /**
     * The resync type of the receiving flow.
     */
    Vrspr: AnnexASessionState['Vrsp'];

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

export interface TransportLayer {
    connected: () => boolean;
    writeTSDU: (tsdu: Buffer) => unknown;
    connect: () => unknown;
}

export interface SessionServiceConnectionState
    extends SessionServicePDUParserState,
        AnnexASessionState {
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
    inbound_max_tsdu_size: number;
    outbound_max_tsdu_size: number;
    local_selector?: Buffer;
    remote_selector?: Buffer;

    timer_timeout: number;
    cn?: CONNECT_SPDU;

    /**
     * Detailed in [ITU Recommendation X.225 (1995)](https://www.itu.int/rec/T-REC-X.225/en),
     * Section 7.9.2. This timeout is used to control when the SPM "gives up"
     * waiting for an ABORT ACCEPT or a T-DISCONNECT.
     */
    TIM?: NodeJS.Timeout;

    /**
     * Used for buffering connect data both inbound and outbound.
     */
    connectData: Buffer;
    userDataBuffer: Buffer;
    outgoingEvents: SessionLayerOutgoingEventEmitter;
    max_ssdu_size: number;

    /**
     * This field exists because, according to
     * [ITU Recommendation X.225 (1995)](https://www.itu.int/rec/T-REC-X.225/en),
     * Section 7.37.1:
     *
     * > Where an SSDU is segmented, the first SPDU contains all the parameters
     * > which would have been present in the SPDU if the SSDU had not been
     * > segmented...
     *
     * To handle the above requirement, this implementation preserves the first
     * received SPDU when the Enclosure Item parameter indicates that an SPDU
     * is the first of multiple segments.
     */
    in_progress_spdu?: { cn: CONNECT_SPDU }
        | { oa: OVERFLOW_ACCEPT_SPDU }
        | { cdo: CONNECT_DATA_OVERFLOW_SPDU }
        | { ac: ACCEPT_SPDU }
        | { rf: REFUSE_SPDU }
        | { fn: FINISH_SPDU }
        | { nf: NOT_FINISHED_SPDU }
        | { dn: DISCONNECT_SPDU }
        | { dt: DATA_TRANSFER_SPDU }
        | { ab: ABORT_SPDU }
        | { aa: ABORT_ACCEPT_SPDU }
        ;
}

export function newSessionConnection(
    transport: TransportLayer,
    caller: boolean = true,
    transportCaller: boolean = false,
    timer_timeout_in_ms: number = 3000,
    max_ssdu_size: number = DEFAULT_MAX_SSDU_SIZE,
): SessionServiceConnectionState {
    const outgoingEvents = new SessionLayerOutgoingEventEmitter();
    const ret: SessionServiceConnectionState = {
        version: SESSION_PROTOCOL_VERSION_2, // Default, per ITU Rec. X.225 (1995), Section 8.3.1.9.
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
        Vrsp: 'no',
        Vrspnb: 0,
        Vrsps: 'no',
        Vrspr: 'no',
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
        timer_timeout: timer_timeout_in_ms,
        max_ssdu_size,
        inbound_max_tsdu_size: DEFAULT_MAX_TSDU_SIZE,
        outbound_max_tsdu_size: DEFAULT_MAX_TSDU_SIZE,
    };
    const emit_ac = (spdu: ACCEPT_SPDU): void => {
        const size_without_user_data = encode_ACCEPT_SPDU({
            ...spdu,
            enclosureItem: 1,
            userData: undefined,
        }).length + 2; // +2 to account for change to long-form LI, plus a little error margin.
        if (!spdu.userData) {
            transport.writeTSDU(encode_ACCEPT_SPDU(spdu));
            return;
        }
        const max_tsdu_size = ret.outbound_max_tsdu_size ?? DEFAULT_MAX_TSDU_SIZE;
        const space_left_for_user_data = max_tsdu_size - size_without_user_data;
        if (space_left_for_user_data <= 0) {
            return; // FIXME: Abort, or something else.
        }
        let i = 0;
        let first: boolean = true;
        while (i < spdu.userData.length) {
            const final = (i + space_left_for_user_data) >= spdu.userData.length;
            const encoded = encode_ACCEPT_SPDU({
                ...spdu,
                enclosureItem: (final ? 0b10 : 0b00) | (first ? 0b1 : 0b0),
                userData: spdu.userData.subarray(i, i + space_left_for_user_data),
            });
            transport.writeTSDU(encoded);
            first = false;
            i += space_left_for_user_data;
        }
    };
    const emit_rf = (spdu: REFUSE_SPDU): void => {
        const size_without_user_data = encode_REFUSE_SPDU({
            ...spdu,
            enclosureItem: 1,
            reasonData: undefined,
        }).length + 2; // +2 to account for change to long-form LI, plus a little error margin.
        if (!spdu.reasonData) {
            transport.writeTSDU(encode_REFUSE_SPDU(spdu));
            return;
        }
        const max_tsdu_size = ret.outbound_max_tsdu_size ?? DEFAULT_MAX_TSDU_SIZE;
        const space_left_for_user_data = max_tsdu_size - size_without_user_data;
        if (space_left_for_user_data <= 0) {
            return; // FIXME: Abort, or something else.
        }
        let i = 0;
        let first: boolean = true;
        while (i < spdu.reasonData.length) {
            const final = (i + space_left_for_user_data) >= spdu.reasonData.length;
            const encoded = encode_REFUSE_SPDU({
                ...spdu,
                enclosureItem: (final ? 0b10 : 0b00) | (first ? 0b1 : 0b0),
                reasonData: spdu.reasonData.subarray(i, i + space_left_for_user_data),
            });
            transport.writeTSDU(encoded);
            first = false;
            i += space_left_for_user_data;
        }
    };
    const emit_fn = (spdu: FINISH_SPDU): void => {
        if (!spdu.userData) {
            transport.writeTSDU(encode_FINISH_SPDU(spdu));
            return;
        }
        const size_without_user_data = encode_FINISH_SPDU({
            ...spdu,
            enclosureItem: 1, // Value doesn't matter. We just want to make sure this is defined.
            userData: undefined,
        }).length + 2; // +2 to account for change to long-form LI, plus a little error margin.
        const max_tsdu_size = ret.outbound_max_tsdu_size ?? DEFAULT_MAX_TSDU_SIZE;
        const space_left_for_user_data = max_tsdu_size - size_without_user_data;
        if (space_left_for_user_data <= 0) {
            return; // FIXME: Abort, or something else.
        }
        let i = 0;
        let first: boolean = true;
        while (i < spdu.userData.length) {
            const final = (i + space_left_for_user_data) >= spdu.userData.length;
            const encoded = encode_FINISH_SPDU({
                ...spdu,
                enclosureItem: (final ? 0b10 : 0b00) | (first ? 0b1 : 0b0),
                userData: spdu.userData.subarray(i, i + space_left_for_user_data),
            });
            transport.writeTSDU(encoded);
            first = false;
            i += space_left_for_user_data;
        }
    };
    const emit_dt = (spdu: DATA_TRANSFER_SPDU): void => {
        const size_without_user_data = 7; // 2 for GT, 2 for DT, 3 for enclosure item.
        const max_tsdu_size = ret.outbound_max_tsdu_size ?? DEFAULT_MAX_TSDU_SIZE;
        const space_left_for_user_data = max_tsdu_size - size_without_user_data;
        if (space_left_for_user_data <= 0) {
            return; // FIXME: Abort, or something else.
        }
        let i = 0;
        let first: boolean = true;
        while (i < spdu.userInformation.length) {
            const final = (i + space_left_for_user_data) >= spdu.userInformation.length;
            const encoded = encode_DATA_TRANSFER_SPDU({
                ...spdu,
                enclosureItem: (final ? 0b10 : 0b00) | (first ? 0b1 : 0b0),
                userInformation: spdu.userInformation.subarray(i, i + space_left_for_user_data),
            });
            transport.writeTSDU(Buffer.concat([
                Buffer.from([ 1, 0 ]), // GIVE TOKENS SPDU
                encoded,
            ]));
            first = false;
            i += space_left_for_user_data;
        }
    };
    const emit_dn = (spdu: DISCONNECT_SPDU): void => {
        const size_without_user_data = encode_DISCONNECT_SPDU({
            enclosureItem: 1,
        }).length + 2; // +2 to account for change to long-form LI, plus a little error margin.
        if (!spdu.userData) {
            transport.writeTSDU(encode_DISCONNECT_SPDU(spdu));
            return;
        }
        const max_tsdu_size = ret.outbound_max_tsdu_size ?? DEFAULT_MAX_TSDU_SIZE;
        const space_left_for_user_data = max_tsdu_size - size_without_user_data;
        if (space_left_for_user_data <= 0) {
            return; // FIXME: Abort, or something else.
        }
        let i = 0;
        let first: boolean = true;
        while (i < spdu.userData.length) {
            const final = (i + space_left_for_user_data) >= spdu.userData.length;
            const encoded = encode_DISCONNECT_SPDU({
                ...spdu,
                enclosureItem: (final ? 0b10 : 0b00) | (first ? 0b1 : 0b0),
                userData: spdu.userData.subarray(i, i + space_left_for_user_data),
            });
            transport.writeTSDU(encoded);
            first = false;
            i += space_left_for_user_data;
        }
    };
    const emit_nf = (spdu: NOT_FINISHED_SPDU): void => {
        const size_without_user_data = encode_NOT_FINISHED_SPDU({
            enclosureItem: 1,
        }).length + 2; // +2 to account for change to long-form LI, plus a little error margin.
        if (!spdu.userData) {
            transport.writeTSDU(encode_NOT_FINISHED_SPDU(spdu));
            return;
        }
        const max_tsdu_size = ret.outbound_max_tsdu_size ?? DEFAULT_MAX_TSDU_SIZE;
        const space_left_for_user_data = max_tsdu_size - size_without_user_data;
        if (space_left_for_user_data <= 0) {
            return; // FIXME: Abort, or something else.
        }
        let i = 0;
        let first: boolean = true;
        while (i < spdu.userData.length) {
            const final = (i + space_left_for_user_data) >= spdu.userData.length;
            const encoded = encode_NOT_FINISHED_SPDU({
                ...spdu,
                enclosureItem: (final ? 0b10 : 0b00) | (first ? 0b1 : 0b0),
                userData: spdu.userData.subarray(i, i + space_left_for_user_data),
            });
            transport.writeTSDU(encoded);
            first = false;
            i += space_left_for_user_data;
        }
    };
    const emit_ab = (spdu: ABORT_SPDU): void => {
        const size_without_user_data = encode_ABORT_SPDU({
            ...spdu,
            enclosureItem: 1,
            userData: undefined,
        }).length + 2; // +2 to account for change to long-form LI, plus a little error margin.
        if (!spdu.userData) {
            transport.writeTSDU(encode_ABORT_SPDU(spdu));
            return;
        }
        const max_tsdu_size = ret.outbound_max_tsdu_size ?? DEFAULT_MAX_TSDU_SIZE;
        const space_left_for_user_data = max_tsdu_size - size_without_user_data;
        if (space_left_for_user_data <= 0) {
            return; // FIXME: Abort, or something else.
        }
        let i = 0;
        let first: boolean = true;
        while (i < spdu.userData.length) {
            const final = (i + space_left_for_user_data) >= spdu.userData.length;
            const encoded = encode_ABORT_SPDU({
                ...spdu,
                enclosureItem: (final ? 0b10 : 0b00) | (first ? 0b1 : 0b0),
                userData: spdu.userData.subarray(i, i + space_left_for_user_data),
            });
            transport.writeTSDU(encoded);
            first = false;
            i += space_left_for_user_data;
        }
    };
    outgoingEvents.on('CN', (spdu) =>
        transport.writeTSDU(encode_CONNECT_SPDU(spdu))
    );
    outgoingEvents.on('CDO', (spdu) =>
        transport.writeTSDU(encode_CONNECT_DATA_OVERFLOW_SPDU(spdu))
    );
    outgoingEvents.on('OA', (spdu) =>
        transport.writeTSDU(encode_OVERFLOW_ACCEPT_SPDU(spdu))
    );
    outgoingEvents.on('AC', emit_ac);
    outgoingEvents.on('RF_nr', emit_rf);
    outgoingEvents.on('RF_r', emit_rf);
    outgoingEvents.on('FN_nr', emit_fn);
    outgoingEvents.on('FN_r', emit_fn);
    outgoingEvents.on('AB_nr', emit_ab);
    outgoingEvents.on('AB_r', emit_ab);
    outgoingEvents.on('DT', emit_dt);
    outgoingEvents.on('DN', emit_dn);
    outgoingEvents.on('AA', () => transport.writeTSDU(Buffer.from([SI_AA_SPDU, 0])));
    outgoingEvents.on('NF', emit_nf);
    return ret;
}

// #region encoders

// function encodeParameter (param: SessionParameter): Buffer

function encodeSPDU(spdu: SPDU): Buffer {
    const bufs: Buffer[] = [];
    for (const param of spdu.parameters) {
        if ('pgi' in param) {
            // Parameter Group
            const pgi_bufs: Buffer[] = [];
            for (const pgiparam of param.parameters) {
                if (pgiparam.value.length > 254) {
                    const pi_and_li = Buffer.from([pgiparam.pi, 0xff, 0, 0]);
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
                const pgi_and_li = Buffer.from([param.pgi, 0xff, 0, 0]);
                pgi_and_li.writeUint16BE(pg_len, 2);
                bufs.push(pgi_and_li);
                bufs.push(...pgi_bufs);
            } else {
                const pgi_and_li = Buffer.from([param.pgi, pg_len]);
                bufs.push(pgi_and_li);
                bufs.push(...pgi_bufs);
            }
        } else {
            // Single Parameter
            if (param.value.length > 254) {
                const pi_and_li = Buffer.from([param.pi, 0xff, 0, 0]);
                pi_and_li.writeUint16BE(param.value.length, 2);
                bufs.push(pi_and_li);
                bufs.push(param.value);
            } else {
                const pi_and_li = Buffer.from([param.pi, param.value.length]);
                bufs.push(pi_and_li);
                bufs.push(param.value);
            }
        }
    }
    let len: number = 0;
    for (const b of bufs) {
        len += b.length;
    }
    if (spdu.userInformation) {
        bufs.push(spdu.userInformation);
    }
    if (len > 65535) {
        // This was the best I could do without massive changes.
        throw new Error(
            'SPDU cannot have more than 65535 bytes of header information.'
        );
    }
    if (len > 254) {
        const si_and_li = Buffer.from([spdu.si, 0xff, 0, 0]);
        si_and_li.writeUint16BE(len, 2);
        return Buffer.concat([si_and_li, ...bufs]);
    } else {
        const si_and_li = Buffer.from([spdu.si, len]);
        return Buffer.concat([si_and_li, ...bufs]);
    }
}

function encode_serial_number(sn: SerialNumber | bigint): Buffer {
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

function encodeConnectionIdentifier(
    cid: ConnectionIdentifier
): SessionParameterGroup {
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

function encodeConnectAcceptItem(
    cai: ConnectAcceptItem
): SessionParameterGroup {
    const ret: SessionParameterGroup = {
        pgi: PGI_CONNECT_ACCEPT,
        parameters: [],
    };
    if (cai.protocolOptions !== undefined) {
        ret.parameters.push({
            pi: PI_PROTOCOL_OPTIONS,
            value: Buffer.from([cai.protocolOptions]),
        });
    }
    if (cai.tsduMaximumSize) {
        const value = Buffer.allocUnsafe(4);
        value.writeUint16BE(cai.tsduMaximumSize.initiator_to_responder);
        value.writeUint16BE(cai.tsduMaximumSize.responder_to_initiator);
        ret.parameters.push({
            pi: PI_TSDU_MAX_SIZE,
            value,
        });
    }
    if (cai.versionNumber !== undefined) {
        ret.parameters.push({
            pi: PI_VERSION_NUMBER,
            value: Buffer.from([cai.versionNumber]),
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
            value: Buffer.from([cai.tokenSettingItem]),
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

export function encode_CONNECT_SPDU(pdu: CONNECT_SPDU): Buffer {
    const ret: SPDU = {
        si: SI_CN_SPDU,
        parameters: [],
    };
    if (pdu.connectionIdentifier) {
        ret.parameters.push(
            encodeConnectionIdentifier(pdu.connectionIdentifier)
        );
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
            value: Buffer.from([pdu.dataOverflow]),
        });
    }
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

export function encode_ACCEPT_SPDU(pdu: ACCEPT_SPDU): Buffer {
    const ret: SPDU = {
        si: SI_AC_SPDU,
        parameters: [],
    };
    if (pdu.connectionIdentifier) {
        ret.parameters.push(
            encodeConnectionIdentifier(pdu.connectionIdentifier)
        );
    }
    if (pdu.connectAcceptItem) {
        ret.parameters.push(encodeConnectAcceptItem(pdu.connectAcceptItem));
    }
    if (pdu.tokenItem !== undefined) {
        ret.parameters.push({
            pi: PI_TOKEN_ITEM,
            value: Buffer.from([pdu.tokenItem]),
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
            value: Buffer.from([pdu.enclosureItem]),
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

export function encode_REFUSE_SPDU(pdu: REFUSE_SPDU): Buffer {
    const ret: SPDU = {
        si: SI_RF_SPDU,
        parameters: [],
    };
    if (pdu.connectionIdentifier) {
        ret.parameters.push(
            encodeConnectionIdentifier(pdu.connectionIdentifier)
        );
    }
    if (pdu.transportDisconnect !== undefined) {
        ret.parameters.push({
            pi: PI_TRANSPORT_DISCONNECT,
            value: Buffer.from([pdu.transportDisconnect]),
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
    if (pdu.versionNumber !== undefined) {
        ret.parameters.push({
            pi: PI_VERSION_NUMBER,
            value: Buffer.from([pdu.versionNumber]),
        });
    }
    if (pdu.enclosureItem !== undefined) {
        ret.parameters.push({
            pi: PI_ENCLOSURE_ITEM,
            value: Buffer.from([pdu.enclosureItem]),
        });
    }
    if (pdu.reasonCode !== undefined) {
        if (pdu.reasonData) {
            ret.parameters.push({
                pi: PI_REASON_CODE,
                value: Buffer.concat([
                    Buffer.from([pdu.reasonCode]),
                    pdu.reasonData,
                ]),
            });
        } else {
            ret.parameters.push({
                pi: PI_REASON_CODE,
                value: Buffer.from([pdu.reasonCode]),
            });
        }
    }
    return encodeSPDU(ret);
}

export function encode_CONNECT_DATA_OVERFLOW_SPDU(
    pdu: CONNECT_DATA_OVERFLOW_SPDU
): Buffer {
    const ret: SPDU = {
        si: SI_CDO_SPDU,
        parameters: [],
    };
    if (pdu.enclosureItem !== undefined) {
        ret.parameters.push({
            pi: PI_ENCLOSURE_ITEM,
            value: Buffer.from([pdu.enclosureItem]),
        });
    }
    if (pdu.userData !== undefined) {
        /**
         * I believe this was a result of an error in the specification. I
         * cannot find confirmation of this anywhere, but I have some evidence
         * that it is an error:
         *
         * 1. Wireshark decodes CDO incorrectly if you use the following.
         * 2. Every other SPDU uses PGI/PI 193 as a value-only parameter.
         * 3. There is not an n/nm in the box in the spec next to the 22.
         *
         * Unfortunately, ISODE does not seem to support CDO, so I could not
         * test with that. There is also not a technicall corrigendum that
         * addresses this.
         */
        // ret.parameters.push({
        //     pgi: PGI_USER_DATA,
        //     parameters: [
        //         {
        //             pi: PI_USER_DATA,
        //             value: pdu.userData,
        //         },
        //     ],
        // });
        ret.parameters.push({
            pi: PGI_USER_DATA,
            value: pdu.userData,
        });
    }
    return encodeSPDU(ret);
}

export function encode_OVERFLOW_ACCEPT_SPDU(pdu: OVERFLOW_ACCEPT_SPDU): Buffer {
    const ret: SPDU = {
        si: SI_OA_SPDU,
        parameters: [],
    };
    if (pdu.tsduMaximumSize) {
        const value = Buffer.allocUnsafe(4);
        value.writeUint16BE(pdu.tsduMaximumSize.initiator_to_responder, 0);
        value.writeUint16BE(pdu.tsduMaximumSize.responder_to_initiator, 2);
        ret.parameters.push({
            pi: PI_TSDU_MAX_SIZE,
            value,
        });
    }
    if (pdu.versionNumber !== undefined) {
        ret.parameters.push({
            pi: PI_VERSION_NUMBER,
            value: Buffer.from([pdu.versionNumber]),
        });
    }
    return encodeSPDU(ret);
}

export function encode_DATA_TRANSFER_SPDU(pdu: DATA_TRANSFER_SPDU): Buffer {
    const ret: SPDU = {
        si: SI_DT_SPDU,
        parameters: [],
        userInformation: pdu.userInformation,
    };
    if (pdu.enclosureItem !== undefined) {
        ret.parameters.push({
            pi: PI_ENCLOSURE_ITEM,
            value: Buffer.from([pdu.enclosureItem]),
        });
    }
    return encodeSPDU(ret);
}

export function encode_ABORT_SPDU(pdu: ABORT_SPDU): Buffer {
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
            value: Buffer.from([pdu.transportDisconnect]),
        });
    }
    if (pdu.enclosureItem !== undefined) {
        ret.parameters.push({
            pi: PI_ENCLOSURE_ITEM,
            value: Buffer.from([pdu.enclosureItem]),
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

export function encode_FINISH_SPDU(pdu: FINISH_SPDU): Buffer {
    const ret: SPDU = {
        si: SI_FN_SPDU,
        parameters: [],
    };
    if (pdu.transportDisconnect !== undefined) {
        ret.parameters.push({
            pi: PI_TRANSPORT_DISCONNECT,
            value: Buffer.from([pdu.transportDisconnect]),
        });
    }
    if (pdu.enclosureItem !== undefined) {
        ret.parameters.push({
            pi: PI_ENCLOSURE_ITEM,
            value: Buffer.from([pdu.enclosureItem]),
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

export function encode_NOT_FINISHED_SPDU(pdu: NOT_FINISHED_SPDU): Buffer {
    const ret: SPDU = {
        si: SI_NF_SPDU,
        parameters: [],
    };
    if (pdu.enclosureItem !== undefined) {
        ret.parameters.push({
            pi: PI_ENCLOSURE_ITEM,
            value: Buffer.from([pdu.enclosureItem]),
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

export function encode_DISCONNECT_SPDU(pdu: DISCONNECT_SPDU): Buffer {
    const ret: SPDU = {
        si: SI_DN_SPDU,
        parameters: [],
    };
    if (pdu.enclosureItem !== undefined) {
        ret.parameters.push({
            pi: PI_ENCLOSURE_ITEM,
            value: Buffer.from([pdu.enclosureItem]),
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

export function encode_PREPARE_SPDU(pdu: PREPARE_SPDU): Buffer {
    const ret: SPDU = {
        si: SI_PR_SPDU,
        parameters: [],
    };
    ret.parameters.push({
        pi: PI_PREPARE_TYPE,
        value: Buffer.from([pdu.prepareType]),
    });
    if (pdu.resyncType) {
        ret.parameters.push({
            pi: PI_RESYNC_TYPE,
            value: Buffer.from([pdu.resyncType]),
        });
    }
    if (pdu.secondResyncType) {
        ret.parameters.push({
            pi: PI_SECOND_RESYNC_TYPE,
            value: Buffer.from([pdu.secondResyncType]),
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

export function parseSerialNumber(sn: Buffer): number {
    let acc: string = '';
    for (const byte of sn) {
        const dig = serialNumberDigitToStrDigit.get(byte);
        if (!dig) {
            return -1;
        }
        acc += dig;
    }
    return Number.parseInt(acc, 10); // The theory is that parseInt is faster than multiplying by 10 multiple times.
}

export function parseLargeSerialNumber(sn: Buffer): bigint | null {
    let acc: string = '';
    for (const byte of sn) {
        const dig = serialNumberDigitToStrDigit.get(byte);
        if (!dig) {
            return null;
        }
        acc += dig;
    }
    return BigInt(acc);
}

export function parseConnectionIdentifier(
    pg: SessionParameterGroup
): ConnectionIdentifier | number {
    const ci: ConnectionIdentifier = {};
    for (const param of pg.parameters) {
        switch (param.pi) {
            case PI_CALLED_SS_USER_REF: {
                if (param.value.length > 64) {
                    return ERR_PI_LENGTH;
                }
                ci.calledSSUserReference = param.value;
                break;
            }
            case PI_CALLING_SS_USER_REF: {
                if (param.value.length > 64) {
                    return ERR_PI_LENGTH;
                }
                ci.callingSSUserReference = param.value;
                break;
            }
            case PI_COMMON_REFERENCE: {
                if (param.value.length > 64) {
                    return ERR_PI_LENGTH;
                }
                ci.commonReference = param.value;
                break;
            }
            case PI_ADDITIONAL_REF_INFO: {
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

export function parseConnectAcceptItem(
    pg: SessionParameterGroup
): ConnectAcceptItem | number {
    const cai: Partial<ConnectAcceptItem> = {};
    for (const param of pg.parameters) {
        switch (param.pi) {
            case PI_PROTOCOL_OPTIONS: {
                if (param.value.length !== 1) {
                    return ERR_PI_LENGTH;
                }
                cai.protocolOptions = param.value[0];
                break;
            }
            case PI_TSDU_MAX_SIZE: {
                if (param.value.length !== 4) {
                    return ERR_PI_LENGTH;
                }
                const initiator_to_responder = param.value.readUint16BE(0);
                const responder_to_initiator = param.value.readUint16BE(2);
                cai.tsduMaximumSize = {
                    initiator_to_responder,
                    responder_to_initiator,
                };
                break;
            }
            case PI_VERSION_NUMBER: {
                if (param.value.length !== 1) {
                    return ERR_PI_LENGTH;
                }
                cai.versionNumber = param.value[0];
                break;
            }
            case PI_INITIAL_SERIAL_NUMBER: {
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
            case PI_TOKEN_SETTING_ITEM: {
                if (param.value.length !== 1) {
                    return ERR_PI_LENGTH;
                }
                cai.tokenSettingItem = param.value[0];
                break;
            }
            case PI_SECOND_INITIAL_SERIAL_NUMBER: {
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
            case PI_UPPER_LIMIT_SERIAL_NUMBER: {
                if (param.value.length !== 1) {
                    return ERR_PI_LENGTH;
                }
                cai.upperLimitSerialNumber = param.value[0];
                break;
            }
            case PI_LARGE_INITIAL_SERIAL_NUMBER: {
                const sn = parseLargeSerialNumber(param.value);
                if (sn === null) {
                    return ERR_MALFORMED_PARAM;
                }
                cai.largeInitialSerialNumber = sn;
                break;
            }
            case PI_LARGE_SECOND_INITIAL_SERIAL_NUMBER: {
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
    if (cai.protocolOptions === undefined) {
        return ERR_MISSING_REQ_PARAM;
    }
    const ret: ConnectAcceptItem = {
        ...cai,
        versionNumber: cai.versionNumber,
        protocolOptions: cai.protocolOptions,
    };
    return ret;
}

export function parse_CN_SPDU(spdu: SPDU): CONNECT_SPDU | number {
    const ret: CONNECT_SPDU = {};
    for (const p of spdu.parameters) {
        if ('pgi' in p) {
            switch (p.pgi) {
                case PGI_CONNECTION_ID: {
                    const ciOrError = parseConnectionIdentifier(p);
                    if (typeof ciOrError === 'number') {
                        return ciOrError;
                    }
                    ret.connectionIdentifier = ciOrError;
                    break;
                }
                case PGI_CONNECT_ACCEPT: {
                    const caiOrError = parseConnectAcceptItem(p);
                    if (typeof caiOrError === 'number') {
                        return caiOrError;
                    }
                    ret.connectAcceptItem = caiOrError;
                    break;
                }
                case PGI_USER_DATA: {
                    ret.userData = p.value;
                    break;
                }
                case PGI_EXTENDED_USER_DATA: {
                    ret.extendedUserData = p.value;
                    break;
                }
                default: {
                    return ERR_UNRECOGNIZED_PI;
                }
            }
        } else {
            switch (p.pi) {
                case PI_SESSION_USER_REQUIREMENTS: {
                    if (p.value.length !== 2) {
                        return ERR_PI_LENGTH;
                    }
                    ret.sessionUserRequirements = p.value.readUint16BE();
                    break;
                }
                case PI_CALLING_SESSION_SELECTOR: {
                    if (p.value.length > 16) {
                        return ERR_PI_LENGTH;
                    }
                    ret.callingSessionSelector = p.value;
                    break;
                }
                case PI_CALLED_SESSION_SELECTOR: {
                    if (p.value.length > 16) {
                        return ERR_PI_LENGTH;
                    }
                    ret.calledSessionSelector = p.value;
                    break;
                }
                case PI_DATA_OVERFLOW: {
                    if (p.value.length !== 1) {
                        return ERR_PI_LENGTH;
                    }
                    ret.dataOverflow = p.value[0];
                    break;
                }
                default: {
                    return ERR_UNRECOGNIZED_PI;
                }
            }
        }
    }
    return ret;
}

export function parse_AC_SPDU(spdu: SPDU): ACCEPT_SPDU | number {
    const ret: ACCEPT_SPDU = {};
    for (const p of spdu.parameters) {
        if ('pgi' in p) {
            switch (p.pgi) {
                case PGI_CONNECTION_ID: {
                    const ciOrError = parseConnectionIdentifier(p);
                    if (typeof ciOrError === 'number') {
                        return ciOrError;
                    }
                    ret.connectionIdentifier = ciOrError;
                    break;
                }
                case PGI_CONNECT_ACCEPT: {
                    const caiOrError = parseConnectAcceptItem(p);
                    if (typeof caiOrError === 'number') {
                        return caiOrError;
                    }
                    ret.connectAcceptItem = caiOrError;
                    break;
                }
                case PGI_USER_DATA: {
                    ret.userData = p.value;
                    break;
                }
                default: {
                    return ERR_UNRECOGNIZED_PI;
                }
            }
        } else {
            switch (p.pi) {
                case PI_TOKEN_ITEM: {
                    if (p.value.length !== 1) {
                        return ERR_PI_LENGTH;
                    }
                    ret.tokenItem = p.value[0];
                    break;
                }
                case PI_SESSION_USER_REQUIREMENTS: {
                    if (p.value.length !== 2) {
                        return ERR_PI_LENGTH;
                    }
                    ret.sessionUserRequirements = p.value.readUint16BE();
                    break;
                }
                case PI_ENCLOSURE_ITEM: {
                    if (p.value.length !== 1) {
                        return ERR_PI_LENGTH;
                    }
                    ret.enclosureItem = p.value[0];
                    break;
                }
                case PI_CALLING_SESSION_SELECTOR: {
                    if (p.value.length > 16) {
                        return ERR_PI_LENGTH;
                    }
                    ret.callingSessionSelector = p.value;
                    break;
                }
                case PI_RESPONDING_SESSION_SELECTOR: {
                    if (p.value.length > 16) {
                        return ERR_PI_LENGTH;
                    }
                    ret.respondingSessionSelector = p.value;
                    break;
                }
                default: {
                    return ERR_UNRECOGNIZED_PI;
                }
            }
        }
    }
    return ret;
}

export function parse_OA_SPDU(spdu: SPDU): OVERFLOW_ACCEPT_SPDU | number {
    const ret: OVERFLOW_ACCEPT_SPDU = {
        versionNumber: 0b0000_0010, // This is what the value is mandated to be anyway.
    };
    for (const p of spdu.parameters) {
        if ('pgi' in p) {
            return ERR_UNRECOGNIZED_PI;
        } else {
            switch (p.pi) {
                case PI_TSDU_MAX_SIZE: {
                    if (p.value.length !== 4) {
                        return ERR_PI_LENGTH;
                    }
                    // ret.tsduMaximumSize = p.value.readUint32BE();
                    const initiator_to_responder = p.value.readUint16BE(0);
                    const responder_to_initiator = p.value.readUint16BE(2);
                    ret.tsduMaximumSize = {
                        initiator_to_responder,
                        responder_to_initiator,
                    };
                    break;
                }
                case PI_VERSION_NUMBER: {
                    if (p.value.length !== 1) {
                        return ERR_PI_LENGTH;
                    }
                    ret.versionNumber = p.value[0];
                    break;
                }
                default: {
                    return ERR_UNRECOGNIZED_PI;
                }
            }
        }
    }
    return ret;
}

export function parse_CDO_SPDU(
    spdu: SPDU
): CONNECT_DATA_OVERFLOW_SPDU | number {
    const ret: Partial<CONNECT_DATA_OVERFLOW_SPDU> = {};
    for (const p of spdu.parameters) {
        if ('pgi' in p) {
            if (p.pgi !== PGI_USER_DATA) {
                return ERR_UNRECOGNIZED_PI;
            }
            ret.userData = p.value;
        } else {
            switch (p.pi) {
                case PI_ENCLOSURE_ITEM: {
                    if (p.value.length !== 1) {
                        return ERR_PI_LENGTH;
                    }
                    ret.enclosureItem = p.value[0];
                    break;
                }
                default: {
                    return ERR_UNRECOGNIZED_PI;
                }
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

export function parse_RF_SPDU(spdu: SPDU): REFUSE_SPDU | number {
    const ret: REFUSE_SPDU = {};
    for (const p of spdu.parameters) {
        if ('pgi' in p) {
            if (p.pgi !== PGI_CONNECTION_ID) {
                return ERR_UNRECOGNIZED_PI;
            }
            const ci = parseConnectionIdentifier(p);
            if (typeof ci === 'number') {
                return ci;
            }
            ret.connectionIdentifier = ci;
        } else {
            switch (p.pi) {
                case PI_TRANSPORT_DISCONNECT: {
                    if (p.value.length !== 1) {
                        return ERR_PI_LENGTH;
                    }
                    ret.transportDisconnect = p.value[0];
                    break;
                }
                case PI_SESSION_USER_REQUIREMENTS: {
                    if (p.value.length !== 2) {
                        return ERR_PI_LENGTH;
                    }
                    ret.sessionUserRequirements = p.value.readUint16BE();
                    break;
                }
                case PI_VERSION_NUMBER: {
                    if (p.value.length !== 1) {
                        return ERR_PI_LENGTH;
                    }
                    ret.versionNumber = p.value[0];
                    break;
                }
                case PI_ENCLOSURE_ITEM: {
                    if (p.value.length !== 1) {
                        return ERR_PI_LENGTH;
                    }
                    ret.enclosureItem = p.value[0];
                    break;
                }
                case PI_REASON_CODE: {
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
                }
            }
        }
    }
    return ret;
}

export function parse_FN_SPDU(spdu: SPDU): FINISH_SPDU | number {
    const ret: FINISH_SPDU = {};
    for (const p of spdu.parameters) {
        if ('pgi' in p) {
            if (p.pgi !== PGI_USER_DATA) {
                return ERR_UNRECOGNIZED_PI;
            }
            ret.userData = p.value;
        } else {
            switch (p.pi) {
                case PI_TRANSPORT_DISCONNECT: {
                    if (p.value.length !== 1) {
                        return ERR_PI_LENGTH;
                    }
                    ret.transportDisconnect = p.value[0];
                    break;
                }
                case PI_ENCLOSURE_ITEM: {
                    if (p.value.length !== 1) {
                        return ERR_PI_LENGTH;
                    }
                    ret.enclosureItem = p.value[0];
                    break;
                }
                default: {
                    return ERR_UNRECOGNIZED_PI;
                }
            }
        }
    }
    return ret;
}

export function parse_DN_SPDU(spdu: SPDU): DISCONNECT_SPDU | number {
    const ret: DISCONNECT_SPDU = {};
    for (const p of spdu.parameters) {
        if ('pgi' in p) {
            if (p.pgi !== PGI_USER_DATA) {
                return ERR_UNRECOGNIZED_PI;
            }
            ret.userData = p.value;
        } else {
            switch (p.pi) {
                case PI_ENCLOSURE_ITEM: {
                    if (p.value.length !== 1) {
                        return ERR_PI_LENGTH;
                    }
                    ret.enclosureItem = p.value[0];
                    break;
                }
                default: {
                    return ERR_UNRECOGNIZED_PI;
                }
            }
        }
    }
    return ret;
}

export function parse_NF_SPDU(spdu: SPDU): NOT_FINISHED_SPDU | number {
    const ret: NOT_FINISHED_SPDU = {};
    for (const p of spdu.parameters) {
        if ('pgi' in p) {
            if (p.pgi !== PGI_USER_DATA) {
                return ERR_UNRECOGNIZED_PI;
            }
            ret.userData = p.value;
        } else {
            switch (p.pi) {
                case PI_ENCLOSURE_ITEM: {
                    if (p.value.length !== 1) {
                        return ERR_PI_LENGTH;
                    }
                    ret.enclosureItem = p.value[0];
                    break;
                }
                default: {
                    return ERR_UNRECOGNIZED_PI;
                }
            }
        }
    }
    return ret;
}

export function parse_AB_SPDU(spdu: SPDU): ABORT_SPDU | number {
    const ret: ABORT_SPDU = {};
    for (const p of spdu.parameters) {
        if ('pgi' in p) {
            if (p.pgi !== PGI_USER_DATA) {
                return ERR_UNRECOGNIZED_PI;
            }
            ret.userData = p.value;
        } else {
            switch (p.pi) {
                case PI_TRANSPORT_DISCONNECT: {
                    if (p.value.length !== 1) {
                        return ERR_PI_LENGTH;
                    }
                    ret.transportDisconnect = p.value[0];
                    break;
                }
                case PI_ENCLOSURE_ITEM: {
                    if (p.value.length !== 1) {
                        return ERR_PI_LENGTH;
                    }
                    ret.enclosureItem = p.value[0];
                    break;
                }
                case PI_REFLECT_PARAMETER_VALUES: {
                    if (p.value.length > 9) {
                        return ERR_PI_LENGTH;
                    }
                    ret.reflectParameterValues = p.value;
                    break;
                }
                default: {
                    return ERR_UNRECOGNIZED_PI;
                }
            }
        }
    }
    return ret;
}

export function parse_AA_SPDU(spdu: SPDU): ABORT_ACCEPT_SPDU | number {
    const ret: ABORT_ACCEPT_SPDU = {};
    if (spdu.parameters.length > 1) {
        return ERR_UNRECOGNIZED_PI;
    }
    return ret;
}

export function parse_DT_SPDU(spdu: SPDU): DATA_TRANSFER_SPDU | number {
    const ret: DATA_TRANSFER_SPDU = {
        userInformation: spdu.userInformation ?? Buffer.alloc(0),
    };
    for (const p of spdu.parameters) {
        if ('pgi' in p) {
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

export function parse_PR_SPDU(spdu: SPDU): PREPARE_SPDU | number {
    const ret: Partial<PREPARE_SPDU> = {};
    for (const p of spdu.parameters) {
        if ('pgi' in p) {
            return ERR_UNRECOGNIZED_PI;
        } else {
            switch (p.pi) {
                case PI_PREPARE_TYPE: {
                    if (p.value.length !== 1) {
                        return ERR_PI_LENGTH;
                    }
                    ret.prepareType = p.value[0];
                    break;
                }
                case PI_RESYNC_TYPE: {
                    if (p.value.length !== 1) {
                        return ERR_PI_LENGTH;
                    }
                    ret.resyncType = p.value[0];
                    break;
                }
                case PI_SECOND_RESYNC_TYPE: {
                    if (p.value.length !== 1) {
                        return ERR_PI_LENGTH;
                    }
                    ret.secondResyncType = p.value[0];
                    break;
                }
                default: {
                    return ERR_UNRECOGNIZED_PI;
                }
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
export function handleInvalidSequence(
    state: SessionServiceConnectionState
): SessionServiceConnectionState {
    if (!state.transport.connected()) {
        return state;
    }
    // Section A.4.1.1 is unhandled.
    const response: ABORT_SPDU = {};
    state.outgoingEvents.emit('AB_nr', response);
    state.TIM = setTimeout(
        () => state.outgoingEvents.emit('TDISreq'),
        state.timer_timeout
    );
    return state;
}

export function handleInvalidSPDU(
    state: SessionServiceConnectionState
): SessionServiceConnectionState {
    if (!state.transport.connected()) {
        return state;
    }
    // Section A.4.1.1 is unhandled.
    const response: ABORT_SPDU = {};
    state.outgoingEvents.emit('AB_nr', response);
    state.TIM = setTimeout(
        () => state.outgoingEvents.emit('TDISreq'),
        state.timer_timeout
    );
    return state;
}

export function handle_too_large_ssdu(
    state: SessionServiceConnectionState
): SessionServiceConnectionState {
    if (!state.transport.connected()) {
        return state;
    }
    // Section A.4.1.1 is unhandled.
    const response: ABORT_SPDU = {};
    state.outgoingEvents.emit('AB_nr', response);
    state.TIM = setTimeout(
        () => state.outgoingEvents.emit('TDISreq'),
        state.timer_timeout
    );
    return state;
}

function spdu_is_complete (enclosure: ACCEPT_SPDU["enclosureItem"]): boolean {
    return (enclosure === undefined) || ((enclosure & 0b10) > 0);
}

export function handleSPDU(
    state: SessionServiceConnectionState,
    spdu: SPDU
): [state: SessionServiceConnectionState, err?: number] {
    switch (spdu.si) {
        case SI_CN_SPDU: {
            const cn = parse_CN_SPDU(spdu);
            if (typeof cn === 'number') {
                return [state, cn];
            }
            const newState = dispatch_CN(state, cn);
            return [newState];
        }
        case SI_OA_SPDU: {
            const oa = parse_OA_SPDU(spdu);
            if (typeof oa === 'number') {
                return [state, oa];
            }
            const newState = dispatch_OA(state, oa, state.connectData);
            return [newState];
        }
        case SI_CDO_SPDU: {
            1 + 1; // Needed to avoid some weird Typescript parsing error.
            if (!state.cn) {
                return [state, ERR_INVALID_SEQ];
            }
            const cdo = parse_CDO_SPDU(spdu);
            if (typeof cdo === 'number') {
                return [state, cdo];
            }
            const newState = dispatch_CDO(state, state.cn, cdo);
            return [newState];
        }
        case SI_AC_SPDU: {
            if (state.in_progress_spdu && !("ac" in state.in_progress_spdu)) {
                return [state, ERR_INVALID_SEQ];
            }
            const ac = parse_AC_SPDU(spdu);
            if (typeof ac === 'number') {
                return [state, ac];
            }
            if (state.in_progress_spdu) {
                const buffer = state.in_progress_spdu.ac.userData ?? Buffer.alloc(0);
                const chunk = ac.userData ?? Buffer.alloc(0);
                if (buffer.length + chunk.length > state.max_ssdu_size) {
                    return [state, ERR_SSDU_TOO_LARGE];
                }
                state.in_progress_spdu.ac.userData = Buffer.concat([
                    state.in_progress_spdu.ac.userData ?? Buffer.alloc(0),
                    ac.userData ?? Buffer.alloc(0),
                ]);
            } else {
                state.in_progress_spdu = { ac };
            }
            if (spdu_is_complete(ac.enclosureItem)) {
                const spdu = state.in_progress_spdu.ac;
                state.in_progress_spdu = undefined;
                const newState = dispatch_AC(state, spdu);
                return [newState];
            }
            return [state];
        }
        case SI_RF_SPDU: {
            if (state.in_progress_spdu && !("rf" in state.in_progress_spdu)) {
                return [state, ERR_INVALID_SEQ];
            }
            const rf = parse_RF_SPDU(spdu);
            if (typeof rf === 'number') {
                return [state, rf];
            }
            if (state.in_progress_spdu) {
                const buffer = state.in_progress_spdu.rf.reasonData ?? Buffer.alloc(0);
                const chunk = rf.reasonData ?? Buffer.alloc(0);
                if (buffer.length + chunk.length > state.max_ssdu_size) {
                    return [state, ERR_SSDU_TOO_LARGE];
                }
                state.in_progress_spdu.rf.reasonData = Buffer.concat([
                    state.in_progress_spdu.rf.reasonData ?? Buffer.alloc(0),
                    rf.reasonData ?? Buffer.alloc(0),
                ]);
            } else {
                state.in_progress_spdu = { rf };
            }
            if (spdu_is_complete(rf.enclosureItem)) {
                const spdu = state.in_progress_spdu.rf;
                state.in_progress_spdu = undefined;
                const r: boolean = rf.transportDisconnect === TRANSPORT_DISCONNECT_KEPT;
                if (r) {
                    const newState = dispatch_RF_r(state, spdu);
                    return [newState];
                } else {
                    const newState = dispatch_RF_nr(state, spdu);
                    return [newState];
                }
            }
            return [state];
        }
        case SI_FN_SPDU: {
            if (state.in_progress_spdu && !("fn" in state.in_progress_spdu)) {
                return [state, ERR_INVALID_SEQ];
            }
            const fn = parse_FN_SPDU(spdu);
            if (typeof fn === 'number') {
                return [state, fn];
            }
            if (state.in_progress_spdu) {
                const buffer = state.in_progress_spdu.fn.userData ?? Buffer.alloc(0);
                const chunk = fn.userData ?? Buffer.alloc(0);
                if (buffer.length + chunk.length > state.max_ssdu_size) {
                    return [state, ERR_SSDU_TOO_LARGE];
                }
                state.in_progress_spdu.fn.userData = Buffer.concat([ buffer, chunk ]);
            } else {
                state.in_progress_spdu = { fn };
            }
            if (spdu_is_complete(fn.enclosureItem)) {
                const spdu: FINISH_SPDU = {
                    ...state.in_progress_spdu.fn,
                    enclosureItem: 0b11,
                };
                state.in_progress_spdu = undefined;
                const r: boolean = fn.transportDisconnect === TRANSPORT_DISCONNECT_KEPT;
                if (r) {
                    const newState = dispatch_FN_r(state, spdu);
                    return [newState];
                } else {
                    const newState = dispatch_FN_nr(state, spdu);
                    return [newState];
                }
            }
            return [state];
        }
        case SI_DN_SPDU: {
            if (state.in_progress_spdu && !("dn" in state.in_progress_spdu)) {
                return [state, ERR_INVALID_SEQ];
            }
            const dn = parse_DN_SPDU(spdu);
            if (typeof dn === 'number') {
                return [state, dn];
            }
            if (state.in_progress_spdu) {
                const buffer = state.in_progress_spdu.dn.userData ?? Buffer.alloc(0);
                const chunk = dn.userData ?? Buffer.alloc(0);
                if (buffer.length + chunk.length > state.max_ssdu_size) {
                    return [state, ERR_SSDU_TOO_LARGE];
                }
                state.in_progress_spdu.dn.userData = Buffer.concat([ buffer, chunk ]);
            } else {
                state.in_progress_spdu = { dn };
            }
            if (spdu_is_complete(dn.enclosureItem)) {
                const spdu: DISCONNECT_SPDU = {
                    ...state.in_progress_spdu.dn,
                    enclosureItem: 0b11,
                };
                state.in_progress_spdu = undefined;
                const newState = dispatch_DN(state, spdu);
                return [newState];
            }
            return [state];
        }
        case SI_NF_SPDU: {
            if (state.in_progress_spdu && !("nf" in state.in_progress_spdu)) {
                return [state, ERR_INVALID_SEQ];
            }
            const nf = parse_NF_SPDU(spdu);
            if (typeof nf === 'number') {
                return [state, nf];
            }
            if (state.in_progress_spdu) {
                const buffer = state.in_progress_spdu.nf.userData ?? Buffer.alloc(0);
                const chunk = nf.userData ?? Buffer.alloc(0);
                if (buffer.length + chunk.length > state.max_ssdu_size) {
                    return [state, ERR_SSDU_TOO_LARGE];
                }
                state.in_progress_spdu.nf.userData = Buffer.concat([ buffer, chunk ]);
            } else {
                state.in_progress_spdu = { nf };
            }
            if (spdu_is_complete(nf.enclosureItem)) {
                const spdu: NOT_FINISHED_SPDU = {
                    ...state.in_progress_spdu.nf,
                    enclosureItem: 0b11,
                };
                state.in_progress_spdu = undefined;
                const newState = dispatch_NF(state, spdu);
                return [newState];
            }
            return [state];
        }
        case SI_AB_SPDU: {
            if (state.in_progress_spdu && !("ab" in state.in_progress_spdu)) {
                return [state, ERR_INVALID_SEQ];
            }
            const ab = parse_AB_SPDU(spdu);
            if (typeof ab === 'number') {
                return [state, ab];
            }
            if (state.in_progress_spdu) {
                const buffer = state.in_progress_spdu.ab.userData ?? Buffer.alloc(0);
                const chunk = ab.userData ?? Buffer.alloc(0);
                if (buffer.length + chunk.length > state.max_ssdu_size) {
                    return [state, ERR_SSDU_TOO_LARGE];
                }
                state.in_progress_spdu.ab.userData = Buffer.concat([ buffer, chunk ]);
            } else {
                state.in_progress_spdu = { ab };
            }
            if (spdu_is_complete(ab.enclosureItem)) {
                const spdu: ABORT_SPDU = {
                    ...state.in_progress_spdu.ab,
                    enclosureItem: 0b11,
                };
                state.in_progress_spdu = undefined;
                const r: boolean = ab.transportDisconnect === TRANSPORT_DISCONNECT_KEPT;
                if (r) {
                    const newState = dispatch_AB_r(state, spdu);
                    return [newState];
                } else {
                    const newState = dispatch_AB_nr(state, spdu);
                    return [newState];
                }
            }
            return [state];

        }
        case SI_AA_SPDU: {
            const aa = parse_AA_SPDU(spdu);
            if (typeof aa === 'number') {
                return [state, aa];
            }
            // state.peerEvents.emit("", nf);
            const newState = dispatch_AA(state);
            return [newState];
        }
        case SI_DT_SPDU: {
            if (state.in_progress_spdu && !("dt" in state.in_progress_spdu)) {
                return [state, ERR_INVALID_SEQ];
            }
            const dt = parse_DT_SPDU(spdu);
            if (typeof dt === 'number') {
                return [state, dt];
            }
            if (state.in_progress_spdu) {
                const buffer = state.in_progress_spdu.dt.userInformation ?? Buffer.alloc(0);
                const chunk = dt.userInformation ?? Buffer.alloc(0);
                if (buffer.length + chunk.length > state.max_ssdu_size) {
                    return [state, ERR_SSDU_TOO_LARGE];
                }
                state.in_progress_spdu.dt.userInformation = Buffer.concat([ buffer, chunk ]);
            } else {
                state.in_progress_spdu = { dt };
            }
            if (spdu_is_complete(dt.enclosureItem)) {
                const spdu: DATA_TRANSFER_SPDU = {
                    ...state.in_progress_spdu.dt,
                    enclosureItem: 0b11,
                };
                state.in_progress_spdu = undefined;
                const newState = dispatch_DT(state, spdu);
                return [newState];
            }
            // const newState = dispatch_DT(state, dt);
            return [state];
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
        case SI_PR_SPDU: {
            const pr = parse_PR_SPDU(spdu);
            if (typeof pr === 'number') {
                return [state, pr];
            }
            if (pr.prepareType === PREPARE_TYPE_ABORT) {
                const newState = dispatch_PR_AB(state);
                return [newState];
            } else {
                return [state, ERR_UNSUPPORTED_PREPARE_TYPE];
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
            return [state, ERR_UNRECOGNIZED_SPDU];
        }
    }
}

export function parsePI(
    state: SessionServiceConnectionState
): [SessionServiceConnectionState, SessionParameter | null] {
    if (state.bufferIndex + 2 > state.buffer.length) {
        return [state, null];
    }
    const pi = state.buffer[state.bufferIndex];
    let li = state.buffer[state.bufferIndex + 1];
    let bytesRead: number = 2;
    if (li === 0xff) {
        if (state.bufferIndex + 4 > state.buffer.length) {
            return [state, null];
        }
        li = state.buffer.readUint16BE(2);
        bytesRead += 2;
    }
    if (state.bufferIndex + bytesRead + li > state.buffer.length) {
        return [state, null];
    }
    const value: Buffer = state.buffer.subarray(
        state.bufferIndex + bytesRead,
        state.bufferIndex + bytesRead + li
    );
    state.bufferIndex = state.bufferIndex + bytesRead + li;
    return [state, { pi, value }];
}

export function parsePGIorPI(
    state: SessionServiceConnectionState,
    depth: number = 0
):
    | [
          SessionServiceConnectionState,
          SessionParameter | SessionParameterGroup | null
      ]
    | number {
    if (state.bufferIndex + 2 > state.buffer.length) {
        return [state, null];
    }
    const pi = state.buffer[state.bufferIndex];
    let li = state.buffer[state.bufferIndex + 1];
    let bytesRead: number = 2;
    if (li === 0xff) {
        if (state.bufferIndex + 4 > state.buffer.length) {
            return [state, null];
        }
        li = state.buffer.readUint16BE(state.bufferIndex + 2);
        bytesRead += 2;
    }
    if (state.bufferIndex + bytesRead + li > state.buffer.length) {
        return [state, null];
    }
    if (depth === 0 && pgis.has(pi)) {
        const paramGroup: SessionParameterGroup = {
            pgi: pi,
            parameters: [],
        };
        if (valueOnlyPGIs.has(pi)) {
            paramGroup.value = state.buffer.subarray(
                state.bufferIndex + bytesRead,
                state.bufferIndex + bytesRead + li
            );
            state.bufferIndex = state.bufferIndex + bytesRead + li;
            return [state, paramGroup];
        }
        const startOfValue: number = state.bufferIndex + bytesRead;
        let currentState: SessionServiceConnectionState = {
            ...state,
            bufferIndex: startOfValue,
        };
        const encounteredParams: Set<number> = new Set();
        while (currentState.bufferIndex - startOfValue < li) {
            // eslint-disable-line
            const [newState, param] = parsePI(currentState);
            if (!param) {
                break;
            }
            currentState = newState;
            paramGroup.parameters.push(param);
            const id: number = param.pi;
            if (encounteredParams.has(id)) {
                return ERR_DUPLICATE_PARAM;
            }
            encounteredParams.add(id);
        }
        state.bufferIndex = currentState.bufferIndex;
        return [state, paramGroup];
    } else {
        const value: Buffer = state.buffer.subarray(
            state.bufferIndex + bytesRead,
            state.bufferIndex + bytesRead + li
        );
        state.bufferIndex = state.bufferIndex + bytesRead + li;
        return [state, { pi, value }];
    }
}

export function parseSPDU(
    state: SessionServiceConnectionState,
    prior_spdus: SPDU[]
): [SessionServiceConnectionState, SPDU | null] | number {
    if (state.bufferIndex + 2 > state.buffer.length) {
        return [state, null];
    }
    const si = state.buffer[state.bufferIndex];
    let li = state.buffer[state.bufferIndex + 1];
    let bytesRead: number = 2;
    if (li === 0xff) {
        if (state.bufferIndex + 4 > state.buffer.length) {
            return [state, null];
        }
        li = state.buffer.readUint16BE(2);
        bytesRead += 2;
    }
    if (state.bufferIndex + bytesRead + li > state.buffer.length) {
        return [state, null];
    }
    const startOfValue: number = state.bufferIndex + bytesRead;
    state.bufferIndex = startOfValue;
    const spdu: SPDU = {
        si,
        parameters: [],
    };
    const encounteredParams: Set<number> = new Set();
    while (state.bufferIndex - startOfValue < li) {
        // eslint-disable-line
        const parsePGIorPIResult = parsePGIorPI(state, 0);
        if (typeof parsePGIorPIResult === 'number') {
            return parsePGIorPIResult;
        }
        const [newState, param] = parsePGIorPIResult;
        if (!param) {
            break;
        }
        Object.assign(state, newState);
        spdu.parameters.push(param);
        const id: number = 'pgi' in param ? param.pgi : param.pi;
        if (encounteredParams.has(id)) {
            return ERR_DUPLICATE_PARAM;
        }
        encounteredParams.add(id);
    }
    // TODO: Check that originalIndex + li === state.bufferIndex (or something like that)
    if (
        prior_spdus.length === 1 &&
        prior_spdus[0].si === SI_GT_SPDU &&
        si === SI_DT_SPDU // Hint: SI_DT_SPDU === SI_GT_SPDU.
    ) {
        // Parse user-information
        spdu.userInformation = state.buffer.subarray(state.bufferIndex);
        state.bufferIndex = state.buffer.length;
    }
    return [state, spdu];
}

export function receiveTSDU(
    state: SessionServiceConnectionState,
    tsdu: Buffer
): number {
    // This should be a FULL reset every time.
    state.buffer = tsdu;
    state.bufferIndex = 0;
    const spdus: SPDU[] = [];
    while (state.bufferIndex < state.buffer.length) {
        // eslint-disable-line
        const parse_spdu_result = parseSPDU(state, spdus);
        if (typeof parse_spdu_result === 'number') {
            handleInvalidSPDU(state);
            return 0;
        }
        const [newState, spdu] = parse_spdu_result;
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
    if (spdus.length === 1 && category_2_spdus.has(spdus[0].si)) {
        return ERR_SINGLE_SPDU_IN_TSDU;
    }
    // if (spdus.length === 1 && category_2_spdus.has(spdus[0].si)) {
    //     return ERR_SINGLE_SPDU_IN_TSDU;
    // }
    state.buffer = state.buffer.subarray(state.bufferIndex);
    state.bufferIndex = 0;

    if ((spdus.length > 1) && (spdus[0].si === SI_GT_SPDU)) {
        spdus.shift();
    }

    for (const spdu of spdus) {
        const [newConnState, errCode] = handleSPDU(state, spdu);
        if (errCode !== undefined) {
            return errCode;
        }
        Object.assign(state, newConnState); // So we can keep the same reference.
    }
    return 0;
}

/*

Design mistakes in this library:

- Just mutate the state object by reference. Don't bother returning it. This was
  a real big pain, because the event handlers would run to completion before the
  updated state would be returned, meaning that the event handlers themselves
  would have a outdated state to work with.
- Several SPDUs have identical SIs. There really should be an enum or something
  so you can differential the different SPDUs. The SI alone should not be used.

*/
