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
}

export
interface SessionServicePDUParserState {
    buffer: Buffer;
    bufferIndex: number;
}

export
interface SessionServiceConnectionState extends SessionServicePDUParserState {
    caller: boolean;
    phase: SessionServicePhase;
    dataToken?: SessionServiceTokenPossession;
    releaseToken?: SessionServiceTokenPossession;
    synchronizeMinorToken?: SessionServiceTokenPossession;
    majorActivityToken?: SessionServiceTokenPossession;
    onPDU?: (bytes: Buffer) => unknown;
    // TODO: onLength
    onCONNECT?: (pdu: CONNECT_SPDU) => unknown;
    onACCEPT?: (pdu: ACCEPT_SPDU) => unknown;
    onREFUSE?: (pdu: REFUSE_SPDU) => unknown;
    onDISCONNECT?: (pdu: DISCONNECT_SPDU) => unknown;
    onABORT?: (pdu: ABORT_SPDU) => unknown;
    onABORT_ACCEPT?: (pdu: ABORT_ACCEPT_SPDU) => unknown;
    onDATA_TRANSFER?: (pdu: DATA_TRANSFER_SPDU) => unknown;
}

export
function newSessionConnection (caller: boolean = true): SessionServiceConnectionState {
    return {
        buffer: Buffer.alloc(0),
        bufferIndex: 0,
        caller,
        phase: SessionServicePhase.establishment,
    };
}

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

export
function handleSPDU (state: SessionServiceConnectionState, spdu: SPDU): [ state: SessionServiceConnectionState, err?: number ] {
    switch (spdu.si) {
        case (SI_CN_SPDU): {
            if (state.phase !== SessionServicePhase.establishment) {
                return [ state, ERR_INVALID_SEQ ];
            }
            const cn = parse_CN_SPDU(spdu);
            if (typeof cn === "number") {
                return [ state, cn ];
            }
            if (state.onCONNECT) {
                state.onCONNECT(cn);
            }
            state.phase = SessionServicePhase.dataTransfer;
            return [ state ];
        }
        // TODO: Actually use these.
        case (SI_OA_SPDU): {
            break;
        }
        case (SI_CDO_SPDU): {
            break;
        }
        case (SI_AC_SPDU): {
            break;
        }
        case (SI_RF_SPDU): {
            break;
        }
        case (SI_FN_SPDU): {
            break;
        }
        case (SI_DN_SPDU): {
            break;
        }
        case (SI_NF_SPDU): {
            break;
        }
        case (SI_AB_SPDU): {
            break;
        }
        case (SI_AA_SPDU): {
            break;
        }
        case (SI_DT_SPDU): {
            break;
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
            break;
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
function parsePI (state: SessionServicePDUParserState): [ SessionServicePDUParserState, SessionParameter | null ] {
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
    const newState: SessionServicePDUParserState = {
        ...state,
        bufferIndex: state.bufferIndex + bytesRead + li,
    };
    const value: Buffer = state.buffer.subarray(state.bufferIndex + bytesRead, state.bufferIndex + bytesRead + li);
    return [ newState, { pi, value } ];
}

export
function parsePGIorPI (
    state: SessionServicePDUParserState,
    depth: number = 0,
): [ SessionServicePDUParserState, SessionParameter | SessionParameterGroup | null ] {
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
    const newState: SessionServicePDUParserState = {
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
        let currentState: SessionServicePDUParserState = {
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
function parseSPDU (state: SessionServicePDUParserState): [ SessionServicePDUParserState, SPDU | null ] {
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
    let currentState: SessionServicePDUParserState = {
        ...state,
        bufferIndex: startOfValue,
    };
    const spdu: SPDU = {
        si,
        parameters: [],
    };
    const encounteredParams: Set<number> = new Set();
    while ((currentState.bufferIndex - startOfValue) < li) { // eslint-disable-line
        const [ newState, param ] = parsePGIorPI(currentState, 0);
        if (!param) {
            break;
        }
        currentState = newState;
        spdu.parameters.push(param);
        const id: number = ("pgi" in param) ? param.pgi : param.pi;
        if (encounteredParams.has(id)) {
            return [ currentState, null ]; // TODO: Return error.
        }
        encounteredParams.add(id);
    }
    const retState: SessionServicePDUParserState = {
        ...state,
        bufferIndex: (state.bufferIndex + bytesRead + li),
    };
    // TODO: Parse user-information
    return [ retState, spdu ];
}

export
function receiveTSDU (conn: SessionServiceConnectionState, tsdu: Buffer): [ spdus: SPDU[], err?: number ] {
    let newConn = {
        ...conn,
        buffer: Buffer.concat([ conn.buffer, tsdu ]),
    };
    let state: SessionServicePDUParserState = newConn;
    const spdus: SPDU[] = [];
    while (state.bufferIndex < state.buffer.length) { // eslint-disable-line
        const [ newState, spdu ] = parseSPDU(state);
        if (!spdu) {
            break;
        }
        state = newState;
        if ((spdus.length > 0) && category_1_spdus.has(spdu.si)) {
            return [ [], ERR_MULTIPLE_SPDU_IN_TSDU ];
        }
        spdus.push(spdu);
    }
    if ((spdus.length === 1) && category_2_spdus.has(spdus[0].si)) {
        return [ [], ERR_SINGLE_SPDU_IN_TSDU ]; 
    }
    newConn = {
        ...newConn,
        buffer: conn.buffer.subarray(state.bufferIndex),
        bufferIndex: 0,
    };
    let connState: SessionServiceConnectionState = {
        ...conn,
        ...state,
    };
    for (const spdu of spdus) {
        const [ newConnState, errCode ] = handleSPDU(connState, spdu);
        if (errCode !== undefined) {
            return [ spdus, errCode ];
        }
        connState = newConnState;
    }
    return [ spdus ];
}

// FIXME: Don't parse PIs from PGIs that do not contain PIs (just opaque bytes).