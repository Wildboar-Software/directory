import { TypedEmitter } from 'tiny-typed-emitter';
import { strict as assert } from 'node:assert';
import { randomBytes } from 'node:crypto';

export type ReturnCode = number;
export type ParseResult<T> = [number, T] | ReturnCode;

export const TRANSPORT_CLASS: number = 0;

export const DEFAULT_MAX_TSDU_SIZE_FOR_OSI: number = 128;
/**
 * According to [IETF RFC 1006](https://datatracker.ietf.org/doc/html/rfc1006):
 *
 * > In order to achieve good performance, the default TPDU size is 65531
 * > octets, instead of 128 octets.
 */
export const DEFAULT_MAX_TSDU_SIZE_FOR_ITOT: number = 65531;
export const DEFAULT_MAX_TSDU_SIZE: number = DEFAULT_MAX_TSDU_SIZE_FOR_ITOT;

// #region TPDU codes
// export const TPDU_CODE_CR: number = 7;
// export const TPDU_CODE_CC: number = 7;
export const TPDU_CODE_DR: number = 0b1000_0000;
// export const TPDU_CODE_DC: number = 6;
// export const TPDU_CODE_DT: number = 3; // So long as transport class is 0.
export const TPDU_CODE_ER: number = 0b0111_0000;
// #endregion TPDU codes

// #region TPDU fixed header lengths
export const CR_TPDU_FIXED_HEADER_LENGTH: number = 7;
export const CC_TPDU_FIXED_HEADER_LENGTH: number = 7;
export const DR_TPDU_FIXED_HEADER_LENGTH: number = 7;
export const DC_TPDU_FIXED_HEADER_LENGTH: number = 6;
export const DT_TPDU_FIXED_HEADER_LENGTH: number = 3; // So long as transport class is 0.
export const ER_TPDU_FIXED_HEADER_LENGTH: number = 5;
// #endregion TPDU fixed header lengths

// #region TPDU parameter codes
export const PC_CHECKSUM: number = 0b1100_0011;
export const DR_TPDU_PC_ADDITIONAL_INFO: number = 0b1110_0000;
export const PC_TRANSPORT_SELECTOR: number = 0b1100_0001;
export const PC_TPDU_SIZE: number = 0b1100_0000;
export const PC_TPDU_PREF_MAX_TPDU_SIZE: number = 0b1111_0000;
export const PC_TPDU_VERSION_NUMBER: number = 0b1100_0100;
export const PC_TPDU_PROTECTION_PARAMETERS: number = 0b1100_0101;
export const PC_TPDU_ADDITIONAL_OPTION_SELECTION: number = 0b1100_0110;
export const PC_TPDU_ALT_PROTOCOL_CLASSES: number = 0b1100_0111;
export const PC_TPDU_ACK_TIME: number = 0b1000_0101;
export const PC_TPDU_THROUGHPUT: number = 0b1000_1001;
export const PC_TPDU_RESIDUAL_ERROR_RATE: number = 0b1000_0110;
export const PC_TPDU_PRIORITY: number = 0b1000_0111;
export const PC_TPDU_TRANSIT_DELAY: number = 0b1000_1000;
export const PC_TPDU_REASSIGNMENT_TIME: number = 0b1000_1011;
export const PC_INACTIVITY_TIMER: number = 0b1111_0010;
// #endregion TPDU parameter codes

// #region DR-TPDU reason codes
export const DR_REASON_NORMAL_DISCONNECT: number = 128 + 0;
export const DR_REASON_REMOTE_CONGESTION: number = 128 + 1;
export const DR_REASON_NEGOTIATION_FAILED: number = 128 + 2;
export const DR_REASON_DUPLICATE_SRC_REF: number = 128 + 3;
export const DR_REASON_MISMATCHED_REFS: number = 128 + 4;
export const DR_REASON_PROTOCOL_ERROR: number = 128 + 5;
export const DR_REASON_REFERENCE_OVERFLOW: number = 128 + 7;
export const DR_REASON_CR_REFUSED: number = 128 + 8;
export const DR_REASON_HEADER_OR_PARAMETER_LENGTH_INVALID: number = 128 + 10;
export const DR_REASON_NOT_SPECIFIED: number = 0;
export const DR_REASON_CONGESTION_AT_TSAP: number = 1;
export const DR_REASON_SESSION_ENTITY_NOT_ATTACHED_TO_TSAP: number = 2;
export const DR_REASON_ADDRESS_UNKNOWN: number = 3;
// #endregion

// #region ER-TPDU reject cause codes
export const ER_REJECT_CAUSE_NOT_SPECIFIED: number = 0b0000_0000;
export const ER_REJECT_CAUSE_INVALID_PARAMETER_CODE: number = 0b0000_0001;
export const ER_REJECT_CAUSE_INVALID_TPDU_TYPE: number = 0b0000_0010;
export const ER_REJECT_CAUSE_INVALID_PARAMETER_VALUE: number = 0b0000_0011;
// #endregion ER-TPDU reject cause codes

// #region Return codes
export const RETURN_OK: ReturnCode = 0;
export const TPDU_PARSE_TRUNCATED: ReturnCode = 1;
export const TPDU_PARSE_UNRECOGNIZED_PARAMETER: ReturnCode = -1;
export const TPDU_PARSE_RESERVED_LI: ReturnCode = -2;
export const TPDU_PARSE_WRONG_PARSER: ReturnCode = -3;
export const TPDU_PARSE_WRONG_PARAM_LENGTH: ReturnCode = -4;
export const TPDU_PARSE_DUPLICATE_PARAMETER: ReturnCode = -5;
export const TPDU_PARSE_MALFORMED_PARAMETER: ReturnCode = -6;
export const DISPATCH_NSDU_RETURN_TOO_SHORT: ReturnCode = -7;
export const DISPATCH_NSDU_RETURN_INVALID_CONCAT: ReturnCode = -8;
export const DISPATCH_NSDU_RETURN_UNRECOGNIZED_TPDU: ReturnCode = -9;
// #endregion Return codes

// #region TPDU validation return codes
export const TPDU_VALIDATION_RC_OK: number = 0;
// Positive numbers are for errors are for negotiation failures.
export const TPDU_VALIDATION_CR_UNACCEPTABLE: number = 1;
export const TPDU_VALIDATION_CR_CANNOT_MEET_CLASS_DEMANDED: number = 2;
// Negative numbers are for protocol errors / malformed PDUs or fields.
export const TPDU_VALIDATION_CR_UNRECOGNIZED_VERSION: number = -1;
export const TPDU_VALIDATION_CR_UNRECOGNIZED_CLASS: number = -2;
export const TPDU_VALIDATION_CR_DST_REF_NOT_ZEROED: number = -3;
export const TPDU_MALFORMED: number = -4;
// #endregion TPDU validation return codes

function encodeUnsignedBigEndianInteger(value: number): Buffer {
    const bytes: Buffer = Buffer.alloc(4);
    bytes.writeUInt32BE(value);
    let startOfNonPadding: number = 0;
    for (let i: number = 0; i < bytes.length - 1; i++) {
        if (bytes[i] === 0x00) {
            startOfNonPadding++;
        } else {
            break;
        }
    }
    return bytes.subarray(startOfNonPadding);
}

function decodeUnsignedBigEndianInteger(value: Buffer): number {
    const ret = Buffer.alloc(4);
    ret.set(value, 4 - value.length);
    return ret.readUInt32BE();
}

export interface NetworkLayerService {
    available: () => boolean;
    open: () => boolean;
    openInProgress: () => boolean;
    transportConnectionsServed: () => number;
    max_nsdu_size: () => number;
    write_nsdu: (nsdu: Buffer) => unknown;
}

// From Table A.3 of ITU Recommendation X.224.
export interface TransportLayerOutgoingEvents {
    TCONind: (tpdu: CR_TPDU) => unknown;
    TCONconf: (tpdu: CC_TPDU) => unknown;
    TDTind: () => unknown;
    TEXind: () => unknown;
    TDISind: () => unknown;
    NDISreq: () => unknown;
    NRSTresp: () => unknown;
    NCONreq: () => unknown;
    CR: (tpdu: CR_TPDU) => unknown;
    CC: (tpdu: CC_TPDU) => unknown;
    DR: (tpdu: DR_TPDU) => unknown;
    DC: (tpdu: DC_TPDU) => unknown;
    AK: () => unknown;
    EA: () => unknown;
    DT: (tpdu: DT_TPDU) => unknown;
    ED: () => unknown;
    ER: (tpdu: ER_TPDU) => unknown;
    RJ: () => unknown;

    // Not specified in Table A.3, but still useful.
    TSDU: (tsdu: Buffer) => unknown;
}

export class TransportLayerOutgoingEventEmitter extends TypedEmitter<TransportLayerOutgoingEvents> {}

// From Table A.2 of ITU Recommendation X.224.
export enum TransportConnectionState {
    WFNC,
    WFCC,
    WBCL,
    OPEN,
    CLOSING,
    WFTRESP,
    CLOSED,
    WFNC_R,
    WFCC_R,
    WBCL_R,
    OPEN_R,
    OPEN_WR,
    CLOSING_R,
    CLOSING_WR,
    WFTRESP_WR,
    WBCL_WR,
    WBOC,
    WBOC_WR,
    CLOSING_BOC,
    CLOSING_BOC_WR,
    AKWAIT,
    REFWAIT,
}

export interface TransportConnection {
    state: TransportConnectionState;
    network: NetworkLayerService;
    outgoingEvents: TransportLayerOutgoingEventEmitter;
    dataBuffer: Buffer;
    src_ref: number;
    dst_ref: number;
    t_selector?: Buffer;
    max_tsdu_size: number;
}

export function createTransportConnection(
    network: NetworkLayerService,
    max_tsdu_size: number = DEFAULT_MAX_TSDU_SIZE,
): TransportConnection {
    const outgoingEvents = new TransportLayerOutgoingEventEmitter();
    outgoingEvents.on('CR', (tpdu) => network.write_nsdu(encode_CR(tpdu)));
    outgoingEvents.on('CC', (tpdu) => network.write_nsdu(encode_CC(tpdu)));
    outgoingEvents.on('DR', (tpdu) => network.write_nsdu(encode_DR(tpdu)));
    outgoingEvents.on('DC', (tpdu) => network.write_nsdu(encode_DC(tpdu)));
    outgoingEvents.on('DT', (tpdu) => network.write_nsdu(encode_DT(tpdu)));
    // outgoingEvents.on("ED", (tpdu) => network.write_nsdu(encode_ED(tpdu)));
    // outgoingEvents.on("AK", (tpdu) => network.write_nsdu(encode_AK(tpdu)));
    // outgoingEvents.on("EA", (tpdu) => network.write_nsdu(encode_EA(tpdu)));
    // outgoingEvents.on("RJ", (tpdu) => network.write_nsdu(encode_RJ(tpdu)));
    outgoingEvents.on('ER', (tpdu) => network.write_nsdu(encode_ER(tpdu)));
    return {
        // This seems to be the expected default state, but I cannot find confirmation.
        state: TransportConnectionState.CLOSED,
        network,
        outgoingEvents,
        dataBuffer: Buffer.alloc(0),
        src_ref: 0,
        dst_ref: 0,
        max_tsdu_size,
    };
}

// #region TPDU fields

export interface ResidualErrorRate {
    target: number;
    minimum_acceptable: number;
    tsdu_size_of_interest: number;
}

export interface TransitDelay {
    target_calling_to_called: number;
    max_acceptable_calling_to_called: number;
    target_called_to_calling: number;
    max_acceptable_called_to_calling: number;
}

// #endregion

// #region TPDUs

export interface Parameter {
    code: number;
    value: Buffer;
}

export interface Throughput {
    target_calling_to_called: number;
    min_acceptable_calling_to_called: number;
    target_called_to_calling: number;
    min_acceptable_called_to_calling: number;
}

export interface MinAndAverageThroughput {
    min: Throughput;
    average?: Throughput;
}

export interface WithChecksum {
    checksum?: number;
}

export interface WithUserData {
    user_data: Buffer;
}

export interface CR_TPDU extends WithChecksum, WithUserData {
    cdt: number;
    dstRef: number;
    srcRef: number;
    class_option: number;
    transport_selector?: Buffer;
    tpdu_size?: number;
    preferred_max_tpdu_size?: number;
    version_number?: number;
    protection_parameters?: Buffer;
    checksum?: number;
    additional_option_selection?: number;
    alternative_protocol_classes?: number[];
    acknowledgement_time?: number;
    throughput?: MinAndAverageThroughput;
    residual_error_rate?: ResidualErrorRate;
    priority?: number;
    transit_delay?: TransitDelay;
    reassignment_time?: number;
    inactivity_timer?: number;
}

export interface DR_TPDU extends WithChecksum, WithUserData {
    dstRef: number;
    srcRef: number;
    reason: number;
    additional_info?: Buffer;
}

export interface DC_TPDU extends WithChecksum {
    dstRef: number;
    srcRef: number;
}

export interface CC_TPDU extends CR_TPDU {}

export interface ER_TPDU extends WithChecksum {
    dstRef: number;
    reject_cause: number;
    invalid_tpdu?: Buffer;
}

export interface DT_TPDU extends WithChecksum, WithUserData {
    roa: boolean;
    dstRef?: number;
    eot: boolean;
    nr: number;
}

// #region TPDU validators

export function validate_CR(tpdu: CR_TPDU): number {
    if (tpdu.dstRef !== 0) {
        return TPDU_VALIDATION_CR_DST_REF_NOT_ZEROED;
    }
    if ((tpdu.class_option & 0b1000_0000) >> 4 > 4) {
        return TPDU_VALIDATION_CR_UNRECOGNIZED_CLASS;
    }
    if (tpdu.class_option & 0b0000_1100) {
        // These bits are supposed to be 0 always.
        return TPDU_MALFORMED;
    }
    if (tpdu.version_number && tpdu.version_number > 1) {
        return TPDU_VALIDATION_CR_UNRECOGNIZED_VERSION;
    }
    for (const apc of tpdu.alternative_protocol_classes ?? []) {
        if (apc & 0b0000_1111) {
            return TPDU_MALFORMED;
        }
    }
    // If class 0 is not acceptable in the CR...
    if (
        tpdu.class_option > 0 &&
        !tpdu.alternative_protocol_classes?.some((apc) => !(apc & 0b1111_0000))
    ) {
        return TPDU_VALIDATION_CR_CANNOT_MEET_CLASS_DEMANDED;
    }
    return TPDU_VALIDATION_RC_OK;
}

// #endregion TPDU validators

// #region TPDU decoders

export function parseParameter(
    data: Buffer,
    start_index: number = 0
): ParseResult<Parameter> {
    if (data.length - start_index < 2) {
        return TPDU_PARSE_TRUNCATED;
    }
    const code = data[start_index];
    const li = data[start_index + 1];
    if (start_index + 2 + li > data.length) {
        return TPDU_PARSE_TRUNCATED;
    }
    return [
        start_index + 2 + li,
        {
            code,
            value: data.subarray(start_index + 2, start_index + 2 + li),
        },
    ];
}

export function decode_DT(
    data: Buffer,
    start_index: number = 0
): ParseResult<DT_TPDU> {
    let i = start_index;
    const FIXED_HEADER_LENGTH: number = DT_TPDU_FIXED_HEADER_LENGTH;
    if (data.length - i < FIXED_HEADER_LENGTH) {
        return TPDU_PARSE_TRUNCATED;
    }
    // This will have to change if a class other than 0 is supported.
    const li = data[i];
    if (data.length < li) {
        return TPDU_PARSE_TRUNCATED;
    }
    if (li === 0b1111_1111) {
        return TPDU_PARSE_RESERVED_LI;
    }
    if ((data[i + 1] & 0b1111_1110) !== 0b1111_0000) {
        return TPDU_PARSE_WRONG_PARSER;
    }
    const ret: DT_TPDU = {
        roa: (data[i + 1] & 0b0000_0001) > 0,
        eot: (data[i + 2] & 0b1000_0000) > 0,
        nr: data[i + 3] & 0b0111_1111,
        user_data: data.subarray(i + 1 + li),
    };
    i = start_index + FIXED_HEADER_LENGTH;
    const encountered_params: Set<number> = new Set();
    while (i < 1 + li) {
        const param = parseParameter(data, i);
        if (typeof param === 'number') {
            return param;
        }
        i += param[0];
        if (encountered_params.has(param[1].code)) {
            return TPDU_PARSE_DUPLICATE_PARAMETER;
        }
        encountered_params.add(param[1].code);
        // No parameters are used by class 0, so they are all ignored.
    }
    return [data.length - start_index, ret];
}

export function decode_DR(
    data: Buffer,
    start_index: number = 0
): ParseResult<DR_TPDU> {
    let i = start_index;
    const FIXED_HEADER_LENGTH: number = DR_TPDU_FIXED_HEADER_LENGTH;
    if (data.length - i < FIXED_HEADER_LENGTH) {
        return TPDU_PARSE_TRUNCATED;
    }
    // This will have to change if a class other than 0 is supported.
    const li = data[i];
    if (data.length < li) {
        return TPDU_PARSE_TRUNCATED;
    }
    if (li === 0b1111_1111) {
        return TPDU_PARSE_RESERVED_LI;
    }
    if (data[i + 1] !== 0b1000_0000) {
        return TPDU_PARSE_WRONG_PARSER;
    }
    const ret: DR_TPDU = {
        dstRef: data.readUint16BE(i + 2),
        srcRef: data.readUint16BE(i + 4),
        reason: data[i + 6],
        user_data: data.subarray(i + 1 + li),
    };
    i = start_index + FIXED_HEADER_LENGTH;
    const encountered_params: Set<number> = new Set();
    while (i < 1 + li) {
        const param = parseParameter(data, i);
        if (typeof param === 'number') {
            return param;
        }
        i += param[0];
        if (encountered_params.has(param[1].code)) {
            return TPDU_PARSE_DUPLICATE_PARAMETER;
        }
        encountered_params.add(param[1].code);
        switch (param[1].code) {
            case PC_CHECKSUM: {
                if (param[1].value.length !== 2) {
                    return TPDU_PARSE_WRONG_PARAM_LENGTH;
                }
                ret.checksum = param[1].value.readUint16BE();
                break;
            }
            case DR_TPDU_PC_ADDITIONAL_INFO: {
                ret.additional_info = param[1].value;
                break;
            }
            default:
                return TPDU_PARSE_UNRECOGNIZED_PARAMETER;
        }
    }
    return [data.length - start_index, ret];
}

export function decode_DC(
    data: Buffer,
    start_index: number = 0
): ParseResult<DC_TPDU> {
    let i = start_index;
    const FIXED_HEADER_LENGTH: number = DC_TPDU_FIXED_HEADER_LENGTH;
    if (data.length - i < FIXED_HEADER_LENGTH) {
        return TPDU_PARSE_TRUNCATED;
    }
    // This will have to change if a class other than 0 is supported.
    const li = data[i];
    if (data.length < li) {
        return TPDU_PARSE_TRUNCATED;
    }
    if (li === 0b1111_1111) {
        return TPDU_PARSE_RESERVED_LI;
    }
    if (data[i + 1] !== 0b1100_0000) {
        return TPDU_PARSE_WRONG_PARSER;
    }
    const ret: DC_TPDU = {
        dstRef: data.readUint16BE(i + 2),
        srcRef: data.readUint16BE(i + 4),
    };
    i = start_index + FIXED_HEADER_LENGTH;
    const encountered_params: Set<number> = new Set();
    while (i < 1 + li) {
        const param = parseParameter(data, i);
        if (typeof param === 'number') {
            return param;
        }
        i += param[0];
        if (encountered_params.has(param[1].code)) {
            return TPDU_PARSE_DUPLICATE_PARAMETER;
        }
        encountered_params.add(param[1].code);
        switch (param[1].code) {
            case PC_CHECKSUM: {
                if (param[1].value.length !== 2) {
                    return TPDU_PARSE_WRONG_PARAM_LENGTH;
                }
                ret.checksum = param[1].value.readUint16BE();
                break;
            }
            default:
                return TPDU_PARSE_UNRECOGNIZED_PARAMETER;
        }
    }
    return [1 + li, ret];
}

export function decode_CR(
    data: Buffer,
    start_index: number = 0
): ParseResult<CR_TPDU> {
    let i = start_index;
    const FIXED_HEADER_LENGTH: number = CR_TPDU_FIXED_HEADER_LENGTH;
    if (data.length - i < FIXED_HEADER_LENGTH) {
        return TPDU_PARSE_TRUNCATED;
    }
    // This will have to change if a class other than 0 is supported.
    const li = data[i];
    if (data.length < li) {
        return TPDU_PARSE_TRUNCATED;
    }
    if (li === 0b1111_1111) {
        return TPDU_PARSE_RESERVED_LI;
    }
    if ((data[i + 1] & 0b1111_0000) !== 0b1110_0000) {
        return TPDU_PARSE_WRONG_PARSER;
    }
    const ret: CR_TPDU = {
        cdt: data[i + 1] & 0b0000_1111,
        dstRef: data.readUint16BE(i + 2),
        srcRef: data.readUint16BE(i + 4),
        class_option: data[i + 6],
        user_data: data.subarray(i + 1 + li),
    };
    i = start_index + FIXED_HEADER_LENGTH;
    const encountered_params: Set<number> = new Set();
    while (i < 1 + li) {
        const param = parseParameter(data, i);
        if (typeof param === 'number') {
            return param;
        }
        i += param[0];
        if (encountered_params.has(param[1].code)) {
            return TPDU_PARSE_DUPLICATE_PARAMETER;
        }
        encountered_params.add(param[1].code);
        switch (param[1].code) {
            case PC_TRANSPORT_SELECTOR: {
                ret.transport_selector = param[1].value;
                break;
            }
            case PC_TPDU_SIZE: {
                if (param[1].value.length !== 1) {
                    return TPDU_PARSE_WRONG_PARAM_LENGTH;
                }
                const size = {
                    [0b0000_1101]: 8192,
                    [0b0000_1100]: 4096,
                    [0b0000_1011]: 2048,
                    [0b0000_1010]: 1024,
                    [0b0000_1001]: 512,
                    [0b0000_1000]: 256,
                    [0b0000_0111]: 128,
                }[param[1].value[0]];
                if (size === undefined) {
                    return TPDU_PARSE_MALFORMED_PARAMETER;
                }
                ret.tpdu_size = size;
                break;
            }
            case PC_TPDU_PREF_MAX_TPDU_SIZE: {
                if (param[1].value.length === 0) {
                    return TPDU_PARSE_WRONG_PARAM_LENGTH;
                }
                if (param[1].value.length > 4) {
                    return TPDU_PARSE_WRONG_PARAM_LENGTH;
                }
                ret.preferred_max_tpdu_size =
                    decodeUnsignedBigEndianInteger(param[1].value) << 7;
                break;
            }
            case PC_TPDU_VERSION_NUMBER: {
                if (param[1].value.length !== 1) {
                    return TPDU_PARSE_WRONG_PARAM_LENGTH;
                }
                ret.version_number = param[1].value[0];
                break;
            }
            case PC_TPDU_PROTECTION_PARAMETERS: {
                ret.protection_parameters = param[1].value;
                break;
            }
            case PC_TPDU_ADDITIONAL_OPTION_SELECTION: {
                if (param[1].value.length !== 1) {
                    return TPDU_PARSE_WRONG_PARAM_LENGTH;
                }
                ret.additional_option_selection = param[1].value[0];
                break;
            }
            case PC_TPDU_ALT_PROTOCOL_CLASSES: {
                ret.alternative_protocol_classes = Array.from(param[1].value);
                break;
            }
            case PC_TPDU_ACK_TIME: {
                if (param[1].value.length !== 2) {
                    return TPDU_PARSE_WRONG_PARAM_LENGTH;
                }
                ret.acknowledgement_time = param[1].value.readUint16BE();
                break;
            }
            case PC_TPDU_THROUGHPUT: {
                if (
                    param[1].value.length !== 12 &&
                    param[1].value.length !== 24
                ) {
                    return TPDU_PARSE_WRONG_PARAM_LENGTH;
                }
                ret.throughput = {
                    min: {
                        target_calling_to_called: Buffer.from([
                            0,
                            param[1].value[0],
                            param[1].value[1],
                            param[1].value[2],
                        ]).readUint32BE(),
                        min_acceptable_calling_to_called: Buffer.from([
                            0,
                            param[1].value[3],
                            param[1].value[4],
                            param[1].value[5],
                        ]).readUint32BE(),
                        target_called_to_calling: Buffer.from([
                            0,
                            param[1].value[6],
                            param[1].value[7],
                            param[1].value[8],
                        ]).readUint32BE(),
                        min_acceptable_called_to_calling: Buffer.from([
                            0,
                            param[1].value[9],
                            param[1].value[10],
                            param[1].value[11],
                        ]).readUint32BE(),
                    },
                };
                if (param[1].value.length === 24) {
                    ret.throughput.average = {
                        target_calling_to_called: Buffer.from([
                            0,
                            param[1].value[12],
                            param[1].value[13],
                            param[1].value[14],
                        ]).readUint32BE(),
                        min_acceptable_calling_to_called: Buffer.from([
                            0,
                            param[1].value[15],
                            param[1].value[16],
                            param[1].value[17],
                        ]).readUint32BE(),
                        target_called_to_calling: Buffer.from([
                            0,
                            param[1].value[18],
                            param[1].value[19],
                            param[1].value[20],
                        ]).readUint32BE(),
                        min_acceptable_called_to_calling: Buffer.from([
                            0,
                            param[1].value[21],
                            param[1].value[22],
                            param[1].value[23],
                        ]).readUint32BE(),
                    };
                }
                break;
            }
            case PC_TPDU_RESIDUAL_ERROR_RATE: {
                if (param[1].value.length !== 3) {
                    return TPDU_PARSE_WRONG_PARAM_LENGTH;
                }
                ret.residual_error_rate = {
                    target: param[1].value[0],
                    minimum_acceptable: param[1].value[1],
                    tsdu_size_of_interest: param[1].value[2],
                };
                break;
            }
            case PC_TPDU_PRIORITY: {
                if (param[1].value.length !== 2) {
                    return TPDU_PARSE_WRONG_PARAM_LENGTH;
                }
                ret.priority = param[1].value.readUint16BE();
                break;
            }
            case PC_TPDU_TRANSIT_DELAY: {
                if (param[1].value.length !== 8) {
                    return TPDU_PARSE_WRONG_PARAM_LENGTH;
                }
                ret.transit_delay = {
                    target_calling_to_called: param[1].value.readUint16BE(0),
                    max_acceptable_calling_to_called:
                        param[1].value.readUint16BE(2),
                    target_called_to_calling: param[1].value.readUint16BE(4),
                    max_acceptable_called_to_calling:
                        param[1].value.readUint16BE(6),
                };
                break;
            }
            case PC_TPDU_REASSIGNMENT_TIME: {
                if (param[1].value.length !== 2) {
                    return TPDU_PARSE_WRONG_PARAM_LENGTH;
                }
                ret.reassignment_time = param[1].value.readUint16BE();
                break;
            }
            case PC_INACTIVITY_TIMER: {
                if (param[1].value.length !== 4) {
                    return TPDU_PARSE_WRONG_PARAM_LENGTH;
                }
                ret.inactivity_timer = param[1].value.readUint32BE();
                break;
            }
            case PC_CHECKSUM: {
                if (param[1].value.length !== 2) {
                    return TPDU_PARSE_WRONG_PARAM_LENGTH;
                }
                ret.checksum = param[1].value.readUint16BE();
                break;
            }
            default:
                return TPDU_PARSE_UNRECOGNIZED_PARAMETER;
        }
    }
    return [data.length - start_index, ret];
}

// NOTE: This is almost the same code as decode_CR
export function decode_CC(
    data: Buffer,
    start_index: number = 0
): ParseResult<CC_TPDU> {
    let i = start_index;
    const FIXED_HEADER_LENGTH: number = CC_TPDU_FIXED_HEADER_LENGTH;
    if (data.length - i < FIXED_HEADER_LENGTH) {
        return TPDU_PARSE_TRUNCATED;
    }
    // This will have to change if a class other than 0 is supported.
    const li = data[i];
    if (data.length < li) {
        return TPDU_PARSE_TRUNCATED;
    }
    if (li === 0b1111_1111) {
        return TPDU_PARSE_RESERVED_LI;
    }
    if ((data[i + 1] & 0b1111_0000) !== 0b1101_0000) {
        return TPDU_PARSE_WRONG_PARSER;
    }
    const ret: CC_TPDU = {
        cdt: data[i + 1] & 0b0000_1111,
        dstRef: data.readUint16BE(i + 2),
        srcRef: data.readUint16BE(i + 4),
        class_option: data[i + 6],
        user_data: data.subarray(i + 1 + li),
    };
    i = start_index + FIXED_HEADER_LENGTH;
    const encountered_params: Set<number> = new Set();
    while (i < 1 + li) {
        const param = parseParameter(data, i);
        if (typeof param === 'number') {
            return param;
        }
        i += param[0];
        if (encountered_params.has(param[1].code)) {
            return TPDU_PARSE_DUPLICATE_PARAMETER;
        }
        encountered_params.add(param[1].code);
        switch (param[1].code) {
            case PC_TRANSPORT_SELECTOR: {
                ret.transport_selector = param[1].value;
                break;
            }
            case PC_TPDU_SIZE: {
                if (param[1].value.length !== 1) {
                    return TPDU_PARSE_WRONG_PARAM_LENGTH;
                }
                const size = {
                    [0b0000_1101]: 8192,
                    [0b0000_1100]: 4096,
                    [0b0000_1011]: 2048,
                    [0b0000_1010]: 1024,
                    [0b0000_1001]: 512,
                    [0b0000_1000]: 256,
                    [0b0000_0111]: 128,
                }[param[1].value[0]];
                if (size === undefined) {
                    return TPDU_PARSE_MALFORMED_PARAMETER;
                }
                ret.tpdu_size = size;
                break;
            }
            case PC_TPDU_PREF_MAX_TPDU_SIZE: {
                if (param[1].value.length === 0) {
                    return TPDU_PARSE_WRONG_PARAM_LENGTH;
                }
                if (param[1].value.length > 4) {
                    return TPDU_PARSE_WRONG_PARAM_LENGTH;
                }
                ret.preferred_max_tpdu_size =
                    decodeUnsignedBigEndianInteger(param[1].value) << 7;
                break;
            }
            case PC_TPDU_VERSION_NUMBER: {
                if (param[1].value.length !== 1) {
                    return TPDU_PARSE_WRONG_PARAM_LENGTH;
                }
                ret.version_number = param[1].value[0];
                break;
            }
            case PC_TPDU_PROTECTION_PARAMETERS: {
                ret.protection_parameters = param[1].value;
                break;
            }
            case PC_TPDU_ADDITIONAL_OPTION_SELECTION: {
                if (param[1].value.length !== 1) {
                    return TPDU_PARSE_WRONG_PARAM_LENGTH;
                }
                ret.additional_option_selection = param[1].value[0];
                break;
            }
            case PC_TPDU_ALT_PROTOCOL_CLASSES: {
                ret.alternative_protocol_classes = Array.from(param[1].value);
                break;
            }
            case PC_TPDU_ACK_TIME: {
                if (param[1].value.length !== 2) {
                    return TPDU_PARSE_WRONG_PARAM_LENGTH;
                }
                ret.acknowledgement_time = param[1].value.readUint16BE();
                break;
            }
            case PC_TPDU_THROUGHPUT: {
                if (
                    param[1].value.length !== 12 &&
                    param[1].value.length !== 24
                ) {
                    return TPDU_PARSE_WRONG_PARAM_LENGTH;
                }
                ret.throughput = {
                    min: {
                        target_calling_to_called: Buffer.from([
                            0,
                            param[1].value[0],
                            param[1].value[1],
                            param[1].value[2],
                        ]).readUint32BE(),
                        min_acceptable_calling_to_called: Buffer.from([
                            0,
                            param[1].value[3],
                            param[1].value[4],
                            param[1].value[5],
                        ]).readUint32BE(),
                        target_called_to_calling: Buffer.from([
                            0,
                            param[1].value[6],
                            param[1].value[7],
                            param[1].value[8],
                        ]).readUint32BE(),
                        min_acceptable_called_to_calling: Buffer.from([
                            0,
                            param[1].value[9],
                            param[1].value[10],
                            param[1].value[11],
                        ]).readUint32BE(),
                    },
                };
                if (param[1].value.length === 24) {
                    ret.throughput.average = {
                        target_calling_to_called: Buffer.from([
                            0,
                            param[1].value[12],
                            param[1].value[13],
                            param[1].value[14],
                        ]).readUint32BE(),
                        min_acceptable_calling_to_called: Buffer.from([
                            0,
                            param[1].value[15],
                            param[1].value[16],
                            param[1].value[17],
                        ]).readUint32BE(),
                        target_called_to_calling: Buffer.from([
                            0,
                            param[1].value[18],
                            param[1].value[19],
                            param[1].value[20],
                        ]).readUint32BE(),
                        min_acceptable_called_to_calling: Buffer.from([
                            0,
                            param[1].value[21],
                            param[1].value[22],
                            param[1].value[23],
                        ]).readUint32BE(),
                    };
                }
                break;
            }
            case PC_TPDU_RESIDUAL_ERROR_RATE: {
                if (param[1].value.length !== 3) {
                    return TPDU_PARSE_WRONG_PARAM_LENGTH;
                }
                ret.residual_error_rate = {
                    target: param[1].value[0],
                    minimum_acceptable: param[1].value[1],
                    tsdu_size_of_interest: param[1].value[2],
                };
                break;
            }
            case PC_TPDU_PRIORITY: {
                if (param[1].value.length !== 2) {
                    return TPDU_PARSE_WRONG_PARAM_LENGTH;
                }
                ret.priority = param[1].value.readUint16BE();
                break;
            }
            case PC_TPDU_TRANSIT_DELAY: {
                if (param[1].value.length !== 8) {
                    return TPDU_PARSE_WRONG_PARAM_LENGTH;
                }
                ret.transit_delay = {
                    target_calling_to_called: param[1].value.readUint16BE(0),
                    max_acceptable_calling_to_called:
                        param[1].value.readUint16BE(2),
                    target_called_to_calling: param[1].value.readUint16BE(4),
                    max_acceptable_called_to_calling:
                        param[1].value.readUint16BE(6),
                };
                break;
            }
            case PC_TPDU_REASSIGNMENT_TIME: {
                if (param[1].value.length !== 2) {
                    return TPDU_PARSE_WRONG_PARAM_LENGTH;
                }
                ret.reassignment_time = param[1].value.readUint16BE();
                break;
            }
            case PC_INACTIVITY_TIMER: {
                if (param[1].value.length !== 4) {
                    return TPDU_PARSE_WRONG_PARAM_LENGTH;
                }
                ret.inactivity_timer = param[1].value.readUint32BE();
                break;
            }
            case PC_CHECKSUM: {
                if (param[1].value.length !== 2) {
                    return TPDU_PARSE_WRONG_PARAM_LENGTH;
                }
                ret.checksum = param[1].value.readUint16BE();
                break;
            }
            default:
                return TPDU_PARSE_UNRECOGNIZED_PARAMETER;
        }
    }
    return [data.length - start_index, ret];
}

export function decode_ER(
    data: Buffer,
    start_index: number = 0
): ParseResult<ER_TPDU> {
    let i = start_index;
    const FIXED_HEADER_LENGTH: number = ER_TPDU_FIXED_HEADER_LENGTH;
    if (data.length - i < FIXED_HEADER_LENGTH) {
        return TPDU_PARSE_TRUNCATED;
    }
    // This will have to change if a class other than 0 is supported.
    const li = data[i];
    if (data.length < li) {
        return TPDU_PARSE_TRUNCATED;
    }
    if (li === 0b1111_1111) {
        return TPDU_PARSE_RESERVED_LI;
    }
    if (data[i + 1] !== TPDU_CODE_ER) {
        return TPDU_PARSE_WRONG_PARSER;
    }
    const ret: ER_TPDU = {
        dstRef: data.readUint16BE(i + 2),
        reject_cause: data[i + 4],
    };
    i = start_index + FIXED_HEADER_LENGTH;
    const encountered_params: Set<number> = new Set();
    while (i < 1 + li) {
        const param = parseParameter(data, i);
        if (typeof param === 'number') {
            return param;
        }
        i += param[0];
        if (encountered_params.has(param[1].code)) {
            return TPDU_PARSE_DUPLICATE_PARAMETER;
        }
        encountered_params.add(param[1].code);
        switch (param[1].code) {
            case PC_CHECKSUM: {
                if (param[1].value.length !== 2) {
                    return TPDU_PARSE_WRONG_PARAM_LENGTH;
                }
                ret.checksum = param[1].value.readUint16BE();
                break;
            }
            default:
                return TPDU_PARSE_UNRECOGNIZED_PARAMETER;
        }
    }
    return [1 + li, ret];
}

// #endegion TPDU decoders

// #region TPDU encoders

export function encode_DT(tpdu: DT_TPDU): Buffer {
    const header = Buffer.from([
        0, // To be set later.
        tpdu.roa ? 0b1111_0001 : 0b1111_0000,
        tpdu.eot ? 0b1000_0000 : 0b0000_0000, // NR is always 0 in class 0.
    ]);
    header[0] = header.length - 1;
    return Buffer.concat([header, tpdu.user_data]);
}

export function encode_DR(tpdu: DR_TPDU): Buffer {
    const header = Buffer.from([
        0, // To be set later.
        0b1000_0000, // DR
        0,
        0, // DST-REF
        0,
        0, // SRC-REF
        tpdu.reason,
    ]);
    header.writeUint16BE(tpdu.dstRef, 2);
    header.writeUint16BE(tpdu.srcRef, 4);
    const parameters: Buffer[] = [];
    if (tpdu.additional_info) {
        parameters.push(
            Buffer.concat([
                Buffer.from([0b1110_0000, tpdu.additional_info.length]),
                tpdu.additional_info,
            ])
        );
    }
    header[0] =
        header.length - 1 + parameters.reduce((acc, p) => acc + p.length, 0);
    return Buffer.concat([header, ...parameters, tpdu.user_data]);
}

export function encode_DC(tpdu: DC_TPDU): Buffer {
    const header = Buffer.from([
        0, // To be set later.
        0b1100_0000, // DC
        0,
        0, // DST-REF
        0,
        0, // SRC-REF
    ]);
    header[0] = header.length - 1;
    header.writeUint16BE(tpdu.dstRef, 2);
    header.writeUint16BE(tpdu.srcRef, 4);
    return header;
}

export function encode_CR(tpdu: CR_TPDU): Buffer {
    const header = Buffer.from([
        0, // To be set later.
        0b1110_0000 | (tpdu.cdt & 0b0000_1111), // CR
        0,
        0, // DST-REF
        0,
        0, // SRC-REF
        tpdu.class_option,
    ]);
    header.writeUint16BE(tpdu.dstRef, 2);
    header.writeUint16BE(tpdu.srcRef, 4);
    const parameters: Buffer[] = [];
    if (tpdu.transport_selector) {
        parameters.push(
            Buffer.concat([
                Buffer.from([0b1100_0001, tpdu.transport_selector.length]),
                tpdu.transport_selector,
            ])
        );
    }
    if (tpdu.tpdu_size) {
        parameters.push(Buffer.from([0b1100_0000, 1, tpdu.tpdu_size]));
    }
    if (tpdu.preferred_max_tpdu_size) {
        const encodedInt = encodeUnsignedBigEndianInteger(
            tpdu.preferred_max_tpdu_size >> 7
        );
        parameters.push(
            Buffer.concat([
                Buffer.from([0b1111_0000, encodedInt.length]),
                encodedInt,
            ])
        );
    }
    if (tpdu.version_number) {
        parameters.push(Buffer.from([0b1100_0100, 1, tpdu.version_number]));
    }
    if (tpdu.protection_parameters) {
        parameters.push(
            Buffer.concat([
                Buffer.from([0b1100_0101, tpdu.protection_parameters.length]),
                tpdu.protection_parameters,
            ])
        );
    }
    // if (tpdu.checksum) {

    // }
    if (tpdu.additional_option_selection) {
        parameters.push(
            Buffer.from([0b1100_0110, 1, tpdu.additional_option_selection])
        );
    }
    header[0] =
        header.length - 1 + parameters.reduce((acc, p) => acc + p.length, 0);
    return Buffer.concat([header, ...parameters, tpdu.user_data]);
}

export function encode_CC(tpdu: CC_TPDU): Buffer {
    const ret = encode_CR(tpdu);
    ret[1] = 0b1101_0000;
    return ret;
}

export function encode_ER(tpdu: ER_TPDU): Buffer {
    const header = Buffer.from([
        0, // To be set later.
        0b1110_0000, // ER
        0,
        0, // DST-REF
        tpdu.reject_cause,
    ]);
    header.writeUint16BE(tpdu.dstRef, 2);
    const parameters: Buffer[] = [];
    if (tpdu.invalid_tpdu) {
        parameters.push(
            Buffer.concat([
                Buffer.from([0b1100_0001, tpdu.invalid_tpdu.length]),
                tpdu.invalid_tpdu,
            ])
        );
    }
    header[0] =
        header.length - 1 + parameters.reduce((acc, p) => acc + p.length, 0);
    return Buffer.concat([header, ...parameters]);
}

// export
// interface DR_TPDU extends WithChecksum {
//     dstRef: number;
//     srcRef: number;
//     reason: number;
//     additional_info?: Buffer;
// }

// export
// interface DC_TPDU extends WithChecksum {
//     dstRef: number;
//     srcRef: number;
// }

// export
// interface CC_TPDU extends CR_TPDU {

// }

// export
// interface ER_TPDU extends WithChecksum {
//     dstRef: number;
//     reject_cause: number;
//     invalid_tpdu?: Buffer;
// }

// #endregion TPDU encoders

// #endregion TPDUs

// Defined in ITU Recommendation X.224, Section 6.7.1.4
// This is the normal release procedure for class 0.
export function implicitNormalRelease(
    c: TransportConnection
): TransportConnection {
    c.outgoingEvents.emit('NDISreq');
    return c;
}

export function handleInvalidSequence(
    c: TransportConnection
): TransportConnection {
    // a) transmit an ER-TPDU;
    // b) reset or close the network connection; or
    // c) invoke the release procedures appropriate to the class.

    // This implementation will choose option B every time for now, just so we
    // can ensure that implementations are not silently producing errors.
    return implicitNormalRelease(c);
}

export function handle_invalid_ref(
    c: TransportConnection
): TransportConnection {
    return implicitNormalRelease(c);
}

export function handle_too_large_tsdu (
    c: TransportConnection,
): TransportConnection {
    return implicitNormalRelease(c);
}

// #region Incoming Events

export function dispatch_TCONreq(
    c: TransportConnection,
    tpdu: CR_TPDU
): TransportConnection {
    c.src_ref = tpdu.srcRef;
    switch (c.state) {
        case TransportConnectionState.CLOSED: {
            const p0: boolean = false; // T-CONNECT request unacceptable
            const p2: boolean = !c.network.available(); // No network connection available
            const p3: boolean = c.network.available() && c.network.open();
            const p4: boolean =
                c.network.available() && c.network.openInProgress();
            if (p0) {
                c.state = TransportConnectionState.CLOSED;
                c.outgoingEvents.emit('TDISind');
            } else if (p2) {
                c.state = TransportConnectionState.WFNC;
                c.outgoingEvents.emit('NCONreq');
            } else if (p3) {
                c.state = TransportConnectionState.WFCC;
                c.outgoingEvents.emit('CR', tpdu);
            } else if (p4) {
                c.state = TransportConnectionState.WFNC;
            } else {
                return handleInvalidSequence(c);
            }
            return c;
        }
        default:
            return handleInvalidSequence(c);
    }
}

export function dispatch_TCONresp(
    c: TransportConnection,
    tpdu: CC_TPDU
): TransportConnection {
    c.dst_ref = tpdu.dstRef;
    switch (c.state) {
        case TransportConnectionState.WFTRESP: {
            c.state = TransportConnectionState.OPEN;
            c.outgoingEvents.emit('CC', tpdu);
            return c;
        }
        default:
            return handleInvalidSequence(c);
    }
}

export function dispatch_TDTreq(
    c: TransportConnection,
    user_data: Buffer
): TransportConnection {
    switch (c.state) {
        case TransportConnectionState.OPEN: {
            const max_nsdu_size = c.network.max_nsdu_size();
            // This assumes we use no variable header parameters.
            // None are defined for use in the class 0 DT TPDU, so we're fine here.
            const chunk_length: number = Math.min(
                c.max_tsdu_size,
                max_nsdu_size - DT_TPDU_FIXED_HEADER_LENGTH
            );
            let i = 0;
            while (i < user_data.length) {
                const tpdu: DT_TPDU = {
                    eot: false,
                    roa: false,
                    nr: 0,
                    // Class 0 DT TPDU should not have a DST-REF.
                    // dstRef: c.dst_ref,
                    user_data: user_data.subarray(i, i + chunk_length),
                };
                i += chunk_length;
                if (i >= user_data.length) {
                    tpdu.eot = true;
                }
                c.network.write_nsdu(encode_DT(tpdu)); // In class 0, there is only one TPDU per NSDU.
            }
            return c;
        }
        default:
            return handleInvalidSequence(c);
    }
}

export function dispatch_TEXreq(c: TransportConnection): TransportConnection {
    // Does not exist in class 0.
    return handleInvalidSequence(c);
}

export function dispatch_TDISreq(
    c: TransportConnection,
    tpdu: DR_TPDU
): TransportConnection {
    switch (c.state) {
        case TransportConnectionState.WFNC: {
            c.state = TransportConnectionState.CLOSED;
            if (c.network.transportConnectionsServed() <= 1) {
                c.outgoingEvents.emit('NDISreq');
            }
            return c;
        }
        case TransportConnectionState.WFCC: {
            const p7: boolean = TRANSPORT_CLASS === 2;
            if (p7) {
                c.state = TransportConnectionState.WBCL;
            } else {
                c.state = TransportConnectionState.CLOSED;
                c.outgoingEvents.emit('NDISreq');
            }
            return c;
        }
        case TransportConnectionState.WBCL: {
            // Only available in class 2.
            return handleInvalidSequence(c);
        }
        case TransportConnectionState.OPEN: {
            const p5: boolean = TRANSPORT_CLASS === 0;
            const p7: boolean = TRANSPORT_CLASS === 2;
            if (p5) {
                c.state = TransportConnectionState.CLOSED;
                c.outgoingEvents.emit('NDISreq');
            } else if (p7) {
                c.state = TransportConnectionState.CLOSING;
                c.outgoingEvents.emit('DR', tpdu);
            } else {
                return handleInvalidSequence(c);
            }
            return c;
        }
        case TransportConnectionState.CLOSING: {
            // Only available in class 2.
            return handleInvalidSequence(c);
        }
        case TransportConnectionState.WFTRESP: {
            c.state = TransportConnectionState.CLOSED;
            c.outgoingEvents.emit('DR', tpdu);
            return c;
        }
        default:
            return handleInvalidSequence(c);
    }
}

export function dispatch_NDISind(c: TransportConnection): TransportConnection {
    switch (c.state) {
        case TransportConnectionState.WFNC:
        case TransportConnectionState.WFCC:
        case TransportConnectionState.OPEN:
        case TransportConnectionState.WFTRESP: {
            c.state = TransportConnectionState.CLOSED;
            c.outgoingEvents.emit('TDISind');
            return c;
        }
        case TransportConnectionState.WBCL:
        case TransportConnectionState.CLOSING: {
            // Only available in class 2.
            return c; // NOOP
        }
        default:
            return c; // NOOP
    }
}

export function dispatch_NCONconf(
    c: TransportConnection,
    tpdu: CR_TPDU
): TransportConnection {
    switch (c.state) {
        case TransportConnectionState.WFNC: {
            c.state = TransportConnectionState.WFCC;
            c.outgoingEvents.emit('CR', tpdu);
            return c;
        }
        default:
            return handleInvalidSequence(c);
    }
}

export function dispatch_NRSTind(c: TransportConnection): TransportConnection {
    switch (c.state) {
        case TransportConnectionState.WFCC:
        case TransportConnectionState.OPEN:
        case TransportConnectionState.WFTRESP: {
            c.state = TransportConnectionState.CLOSED;
            c.outgoingEvents.emit('TDISind');
            if (c.network.transportConnectionsServed() <= 1) {
                // [1]
                c.outgoingEvents.emit('NDISreq');
            }
            // REVIEW: I don't get how [5] differs from [1].
            return c;
        }
        case TransportConnectionState.WBCL:
        case TransportConnectionState.CLOSING: {
            // Only available in class 2.
            return handleInvalidSequence(c);
        }
        default:
            return handleInvalidSequence(c);
    }
}

export function dispatch_CR(
    c: TransportConnection,
    tpdu: CR_TPDU
): TransportConnection {
    switch (c.state) {
        case TransportConnectionState.OPEN:
        case TransportConnectionState.CLOSING:
        case TransportConnectionState.WFTRESP: {
            const p9: boolean = TRANSPORT_CLASS === 4;
            if (p9) {
                return c;
            } else {
                return handleInvalidSequence(c);
            }
        }
        case TransportConnectionState.CLOSED: {
            const cr_validation_result = validate_CR(tpdu);
            const p1: boolean = cr_validation_result !== TPDU_VALIDATION_RC_OK; // Unacceptable CR-TPDU
            if (p1) {
                c.state = TransportConnectionState.CLOSED;
                if (cr_validation_result > 0) {
                    // The connection parameters were unacceptable, but the TPDU was valid.
                    const dr: DR_TPDU = {
                        dstRef: tpdu.dstRef,
                        srcRef: tpdu.srcRef,
                        reason: DR_REASON_NEGOTIATION_FAILED,
                        user_data: Buffer.alloc(0),
                    };
                    c.outgoingEvents.emit('DR', dr);
                } else {
                    // Negative: The TPDU was invalid in some way.
                    const er: ER_TPDU = {
                        dstRef: tpdu.dstRef,
                        reject_cause: ER_REJECT_CAUSE_NOT_SPECIFIED,
                    };
                    c.outgoingEvents.emit('ER', er);
                }
            } else {
                c.state = TransportConnectionState.WFTRESP;
                c.src_ref = tpdu.srcRef;
                c.dst_ref = randomBytes(2).readUint16BE();
                c.outgoingEvents.emit('TCONind', tpdu);
            }
            return c;
        }
        default:
            return handleInvalidSequence(c);
    }
}

function validate_CC(c: TransportConnection, tpdu: CC_TPDU): boolean {
    if (c.src_ref !== tpdu.srcRef) {
        return false;
    }
    if (tpdu.dstRef === 0) {
        return false;
    }
    // User data is not permitted in class 0.
    if (TRANSPORT_CLASS === 0) {
        if (tpdu.user_data?.length) {
            return false;
        }
        if (tpdu.version_number !== undefined) {
            return false;
        }
        if (tpdu.protection_parameters !== undefined) {
            return false;
        }
        if (tpdu.throughput !== undefined) {
            return false;
        }
        if (tpdu.residual_error_rate !== undefined) {
            return false;
        }
        if (tpdu.priority !== undefined) {
            return false;
        }
        if (tpdu.transit_delay !== undefined) {
            return false;
        }
    } else {
        // If not class 0, it must not contain more than 32 bytes of user data.
        if ((tpdu.user_data?.length ?? 0) > 32) {
            return false;
        }
        if (tpdu.additional_option_selection !== undefined) {
            return false;
        }
        if (tpdu.alternative_protocol_classes !== undefined) {
            return false;
        }
    }
    if (TRANSPORT_CLASS !== 4) {
        if (tpdu.inactivity_timer !== undefined) {
            return false;
        }
        if (tpdu.checksum !== undefined) {
            return false;
        }
        if (tpdu.acknowledgement_time !== undefined) {
            return false;
        }
    }
    return true;
}

export function dispatch_CC(
    c: TransportConnection,
    tpdu: CC_TPDU
): TransportConnection {
    switch (c.state) {
        case TransportConnectionState.WFCC: {
            const p5: boolean = TRANSPORT_CLASS === 0;
            const p6: boolean = !validate_CC(c, tpdu); // Unacceptable CC
            const p7: boolean = TRANSPORT_CLASS === 2;
            const p8: boolean = validate_CC(c, tpdu); // Acceptable CC
            if (p8) {
                c.state = TransportConnectionState.OPEN;
                c.dst_ref = tpdu.dstRef;
                c.outgoingEvents.emit('TCONconf', tpdu);
            } else if (p6 && p5) {
                c.state = TransportConnectionState.CLOSED;
                c.outgoingEvents.emit('TDISind');
                c.outgoingEvents.emit('NDISreq');
            } else if (p6 && p7) {
                c.state = TransportConnectionState.CLOSING;
                c.outgoingEvents.emit('TDISind');
                const dr: DR_TPDU = {
                    dstRef: tpdu.dstRef,
                    srcRef: tpdu.srcRef,
                    reason: DR_REASON_NEGOTIATION_FAILED,
                    user_data: Buffer.alloc(0),
                };
                c.outgoingEvents.emit('DR', dr);
            } else {
                return handleInvalidSequence(c);
            }
            return c;
        }
        case TransportConnectionState.CLOSED: {
            const dr: DR_TPDU = {
                dstRef: tpdu.dstRef,
                srcRef: tpdu.srcRef,
                reason: DR_REASON_PROTOCOL_ERROR,
                user_data: Buffer.alloc(0),
            };
            c.outgoingEvents.emit('DR', dr);
            return c;
        }
        case TransportConnectionState.WBCL:
        case TransportConnectionState.CLOSING: {
            // Only available in class 2.
            return handleInvalidSequence(c);
        }
        default:
            return handleInvalidSequence(c);
    }
}

export function dispatch_DR(c: TransportConnection): TransportConnection {
    // For some reason, this row in the state table is bifurcated. What does this mean?
    switch (c.state) {
        case TransportConnectionState.WFCC: {
            c.state = TransportConnectionState.CLOSED;
            c.outgoingEvents.emit('TDISind');
            if (c.network.transportConnectionsServed() <= 1) {
                // [1]
                c.outgoingEvents.emit('NDISreq');
            }
            return c;
        }
        case TransportConnectionState.OPEN: {
            const p5: boolean = TRANSPORT_CLASS === 0;
            const p7: boolean = TRANSPORT_CLASS === 2;
            if (p5) {
                // Only available in class 2.
                return handleInvalidSequence(c);
            } else if (p7) {
                assert(
                    false,
                    'Class 2 OSI transport code used when class 0 is HARD-CODED!'
                );
                // c.state = TransportConnectionState.CLOSED;
                // const dr: DC_TPDU = {
                //     dstRef: tpdu.dstRef,
                //     srcRef: tpdu.srcRef,
                //     reason: DR_REASON_PROTOCOL_ERROR,
                //     user_data: Buffer.alloc(0),
                // };
                // c.outgoingEvents.emit("DC");
                // c.outgoingEvents.emit("TDISind");
            }
            return c;
        }
        case TransportConnectionState.WFTRESP: {
            // const p10: boolean = false; // Local choice.
            // if (p10) {
            //     // [6]
            //     c.outgoingEvents.emit("DC");
            // }
            c.state = TransportConnectionState.CLOSED;
            c.outgoingEvents.emit('TDISind');
            return c;
        }
        case TransportConnectionState.CLOSED: {
            // This will need to be updated if a class other than 0 is implemented.
            return c;
        }
        case TransportConnectionState.WBCL:
        case TransportConnectionState.CLOSING: {
            // Only available in class 2.
            return handleInvalidSequence(c);
        }
        default:
            return handleInvalidSequence(c);
    }
}

export function dispatch_DC(c: TransportConnection): TransportConnection {
    // Only available in class 2.
    return handleInvalidSequence(c);
}

export function dispatch_AK(c: TransportConnection): TransportConnection {
    // Only available in class 2.
    return handleInvalidSequence(c);
}

export function dispatch_EA(c: TransportConnection): TransportConnection {
    // Only available in class 2.
    return handleInvalidSequence(c);
}

export function dispatch_DT(
    c: TransportConnection,
    tpdu: DT_TPDU
): TransportConnection {
    // There shouldn't be a dstRef in a TPDU in class 0.
    // if (tpdu.dstRef !== c.dst_ref) {
    //     return handle_invalid_ref(c);
    // }
    switch (c.state) {
        case TransportConnectionState.OPEN: {
            if (c.dataBuffer.length + tpdu.user_data.length > c.max_tsdu_size) {
                return handle_too_large_tsdu(c);
            }
            c.dataBuffer = Buffer.concat([c.dataBuffer, tpdu.user_data]);
            if (tpdu.eot) {
                const oldBuf = c.dataBuffer;
                const newBuf = Buffer.alloc(0);
                c.dataBuffer = newBuf;
                c.outgoingEvents.emit('TSDU', oldBuf);
            }
            return c;
        }
        case TransportConnectionState.CLOSING: {
            // Only available in class 2.
            return handleInvalidSequence(c);
        }
        case TransportConnectionState.CLOSED: {
            return c;
        }
        default:
            return handleInvalidSequence(c);
    }
}

export function dispatch_ED(c: TransportConnection): TransportConnection {
    // Only available in class 2.
    return handleInvalidSequence(c);
}

export function dispatch_ER(c: TransportConnection): TransportConnection {
    switch (c.state) {
        case TransportConnectionState.WFNC: {
            return c;
        }
        case TransportConnectionState.WFCC: {
            c.state = TransportConnectionState.CLOSED;
            c.outgoingEvents.emit('TDISind');
            if (c.network.transportConnectionsServed() <= 1) {
                // [1]
                c.outgoingEvents.emit('NDISreq');
            }
            return c;
        }
        case TransportConnectionState.CLOSED: {
            return c;
        }
        case TransportConnectionState.WBCL:
        case TransportConnectionState.CLOSING:
        case TransportConnectionState.OPEN: {
            // Only available in class 2 or protocol error.
            return handleInvalidSequence(c);
        }
        default:
            return handleInvalidSequence(c);
    }
}

// #endregion Incoming Events

export function dispatch_NSDU(
    c: TransportConnection,
    nsdu: Buffer
): ReturnCode {
    if (nsdu.length < 2) {
        return DISPATCH_NSDU_RETURN_TOO_SHORT;
    }
    const li: number = nsdu[0];
    if (nsdu.length < 1 + li) {
        return DISPATCH_NSDU_RETURN_TOO_SHORT;
    }
    const code = nsdu[1];
    if ((code & 0b1111_1110) === 0b1111_0000) {
        const parse_result = decode_DT(nsdu);
        if (typeof parse_result === 'number') {
            return parse_result;
        }
        const [bytes_read, tpdu] = parse_result;
        if (bytes_read !== nsdu.length) {
            return DISPATCH_NSDU_RETURN_INVALID_CONCAT;
        }
        dispatch_DT(c, tpdu);
    } else if ((code & 0b1111_0000) === 0b1110_0000) {
        const parse_result = decode_CR(nsdu);
        if (typeof parse_result === 'number') {
            return parse_result;
        }
        const [bytes_read, tpdu] = parse_result;
        if (bytes_read !== nsdu.length) {
            return DISPATCH_NSDU_RETURN_INVALID_CONCAT;
        }
        dispatch_CR(c, tpdu);
    } else if ((code & 0b1111_0000) === 0b1101_0000) {
        const parse_result = decode_CC(nsdu);
        if (typeof parse_result === 'number') {
            return parse_result;
        }
        const [bytes_read, tpdu] = parse_result;
        if (bytes_read !== nsdu.length) {
            return DISPATCH_NSDU_RETURN_INVALID_CONCAT;
        }
        dispatch_CC(c, tpdu);
    } else if (code === TPDU_CODE_ER) {
        const parse_result = decode_ER(nsdu);
        if (typeof parse_result === 'number') {
            return parse_result;
        }
        const [bytes_read] = parse_result;
        if (bytes_read !== nsdu.length) {
            return DISPATCH_NSDU_RETURN_INVALID_CONCAT;
        }
        dispatch_ER(c);
    } else if (code === TPDU_CODE_DR) {
        const parse_result = decode_DR(nsdu);
        if (typeof parse_result === 'number') {
            return parse_result;
        }
        const [bytes_read] = parse_result;
        if (bytes_read !== nsdu.length) {
            return DISPATCH_NSDU_RETURN_INVALID_CONCAT;
        }
        dispatch_DR(c);
    } else {
        return DISPATCH_NSDU_RETURN_UNRECOGNIZED_TPDU;
    }
    return RETURN_OK;
}
