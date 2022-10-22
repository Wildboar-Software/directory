import { ITOTSocket } from "./tpkt";
import {
    TransportConnection,
    createTransportConnection,
    dispatch_TCONreq,
    dispatch_TDTreq,
    dispatch_NSDU,
    CR_TPDU,
    CC_TPDU,
    dispatch_TCONresp,
    TransportConnectionState,
} from "./transport";
import {
    SessionServiceConnectionState,
    newSessionConnection,
    dispatch_SCONreq,
    CONNECT_SPDU,
    TableA2SessionConnectionState,
    receiveTSDU,
    dispatch_TCONcnf,
    dispatch_TCONind,
    dispatch_SCONrsp_accept,
    ACCEPT_SPDU,
    dispatch_SDTreq,
    DATA_TRANSFER_SPDU,
    dispatch_SRELreq,
    dispatch_SRELrsp_accept,
    FINISH_SPDU,
    DISCONNECT_SPDU,
    encode_CONNECT_SPDU,
    ABORT_ACCEPT_SPDU,
    ABORT_SPDU,
    dispatch_SUABreq,
    REFUSE_SPDU,
    dispatch_SCONrsp_reject,
} from "./session";
import {
    createPresentationConnection,
    PresentationConnection,
    dispatch_CP,
    dispatch_CPA,
    dispatch_CPR,
    dispatch_S_PABind,
    dispatch_TD,
    dispatch_P_DTreq,
    dispatch_P_CONrsp_accept,
    dispatch_P_CONrsp_reject,
    dispatch_P_CONreq,
    dispatch_P_RELreq,
    dispatch_P_RELrsp_accept,
    dispatch_P_RELrsp_reject,
    dispatch_P_UABreq,
} from "./presentation";
import {
    createAssociationControlState,
    ACPMState,
    P_CONNECT_Request,
    P_CONNECT_Response,
    P_RELEASE_Request,
    P_RELEASE_Response,
    P_U_ABORT_Request,
    dispatch_A_ASCreq,
    dispatch_A_ASCrsp_accept,
    dispatch_AARQ,
    dispatch_AARE_accept,
    dispatch_AARE_reject,
} from "./acse";
import {
    CP_type,
    _decode_CP_type,
    _encode_CP_type,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/CP-type.ta";
import {
    CPR_PPDU,
    CPR_PPDU_normal_mode_parameters,
    _decode_CPR_PPDU,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/CPR-PPDU.ta";
import {
    CPA_PPDU,
    _decode_CPA_PPDU,
    _encode_CPA_PPDU,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/CPA-PPDU.ta";
import {
    ARU_PPDU,
    _decode_Abort_type,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Abort-type.ta";
import {
    User_data,
    _decode_User_data,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/User-data.ta";
import {
    Mode_selector,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Mode-selector.ta";
import {
    Mode_selector_mode_value_normal_mode,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Mode-selector-mode-value.ta";
import {
    CP_type_normal_mode_parameters,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/CP-type-normal-mode-parameters.ta";
import {
    PDV_list,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/PDV-list.ta";
import {
    Context_list_Item,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Context-list-Item.ta";
import {
    CPA_PPDU_normal_mode_parameters,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/CPA-PPDU-normal-mode-parameters.ta";
import {
    Result_list_Item,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Result-list-Item.ta";
import {
    Result_acceptance,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Result.ta";
import {
    Result_acceptance as ACSEResult_acceptance,
} from "@wildboar/acse/src/lib/modules/ACSE-1/Result.ta";
import { BERElement, ObjectIdentifier, External } from "asn1-ts";
import { Socket } from "node:net";
import { BER, _encodeUTF8String } from "asn1-ts/dist/node/functional";
import { assert } from "node:console";
import { ARU_PPDU_normal_mode_parameters } from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/ARU-PPDU-normal-mode-parameters.ta";
import { AARQ_apdu, _decode_AARQ_apdu, _encode_AARQ_apdu } from "@wildboar/acse/src/lib/modules/ACSE-1/AARQ-apdu.ta";
import { AARE_apdu, _decode_AARE_apdu } from "@wildboar/acse/src/lib/modules/ACSE-1/AARE-apdu.ta";

// const id_ber = new ObjectIdentifier([ 2, 1, 1 ]);
// const id_acse = new ObjectIdentifier([ 2, 2, 1, 0, 1 ]);

export
interface ISOTransportOverTCPStack {
    network: ITOTSocket;
    transport: TransportConnection;
    session: SessionServiceConnectionState;
    presentation: PresentationConnection;
    acse: ACPMState;
}

export
function create_itot_stack (socket: Socket): ISOTransportOverTCPStack {
    const tpkt = new ITOTSocket(socket);
    socket.on("data", (data) => tpkt.receiveData(data));
    const transport = createTransportConnection({
        available: () => socket.writable && socket.readable,
        disconnect: () => socket.end(),
        max_nsdu_size: () => 10_000_000, // TODO: Make configurable.
        open: () => socket.writable,
        openInProgress: () => socket.connecting,
        transportConnectionsServed: () => 1,
        write_nsdu: (nsdu: Buffer) => tpkt.writeNSDU(nsdu),
    });
    const session = newSessionConnection({
        connected: () => [
            TransportConnectionState.OPEN,
            TransportConnectionState.OPEN_R,
            TransportConnectionState.OPEN_WR,
        ].includes(transport.state),
        connect: () => {
            const tpdu: CR_TPDU = {
                cdt: 0,
                class_option: 0,
                dstRef: 0,
                srcRef: 0,
                user_data: Buffer.alloc(0),
            };
            stack.transport = dispatch_TCONreq(stack.transport, tpdu);
        },
        disconnect: () => transport.network.disconnect(),
        writeTSDU: (tsdu: Buffer) => {
            stack.transport = dispatch_TDTreq(stack.transport, tsdu);
        },
    }, true, true); // FIXME: Maybe make these arguments?
    const presentation = createPresentationConnection({
        request_S_CONNECT: (req) => {
            const spdu: CONNECT_SPDU = {
                userData: req.user_data,
            };
            stack.session = dispatch_SCONreq(stack.session, spdu);
        },
        respond_S_CONNECT: (res) => {
            if (res.refuse_reason === undefined) {
                const spdu: ACCEPT_SPDU = {
                    userData: res.user_data,
                };
                stack.session = dispatch_SCONrsp_accept(stack.session, spdu);
            } else {
                const spdu: REFUSE_SPDU = {
                    userData: res.user_data,
                    reasonCode: res.refuse_reason,
                };
                stack.session = dispatch_SCONrsp_reject(stack.session, spdu);
            }
        },
        S_DATA: (req) => {
            const spdu: DATA_TRANSFER_SPDU = {
                userInformation: req.user_data,
            };
            stack.session = dispatch_SDTreq(stack.session, spdu);
        },
        S_RELEASE: (req) => {
            const spdu: FINISH_SPDU = {
                userData: req.user_data,
            };
            stack.session = dispatch_SRELreq(stack.session, spdu);
        },
        S_U_ABORT: (req) => {
            const spdu: ABORT_SPDU = {
                userData: req.user_data,
            };
            stack.session = dispatch_SUABreq(stack.session, spdu);
        },
        S_P_ABORT: () => {
            const spdu: ABORT_SPDU = {};
            stack.session = dispatch_SUABreq(stack.session, spdu);
        },
    }, () => true, (a) => a[0]);
    const acse = createAssociationControlState({
        request_P_CONNECT: (args: P_CONNECT_Request) => {
            const ppdu: CP_type = new CP_type(
                {
                    mode_value: Mode_selector_mode_value_normal_mode,
                },
                undefined,
                new CP_type_normal_mode_parameters(
                    args.protocol_version,
                    args.calling_presentation_selector,
                    args.called_presentation_selector,
                    args.presentation_context_definition_list,
                    args.default_context_name,
                    args.presentation_requirements,
                    args.user_session_requirements,
                    args.protocol_options,
                    args.initiators_nominated_context,
                    args.extensions,
                    args.user_data,
                ),
            );
            dispatch_P_CONreq(stack.presentation, ppdu);
        },
        respond_P_CONNECT: (args: P_CONNECT_Response) => {
            if (args.provider_reason === undefined) {
                const ppdu: CPA_PPDU = new CPA_PPDU(
                    {
                        mode_value: Mode_selector_mode_value_normal_mode,
                    },
                    undefined,
                    new CPA_PPDU_normal_mode_parameters(
                        args.protocol_version,
                        args.responding_presentation_selector,
                        args.presentation_context_definition_result_list,
                        args.presentation_requirements,
                        args.user_session_requirements,
                        args.protocol_options,
                        args.responders_nominated_context,
                        args.user_data,
                    ),
                );
                dispatch_P_CONrsp_accept(stack.presentation, ppdu);
            } else {
                const ppdu: CPR_PPDU = {
                    normal_mode_parameters: new CPR_PPDU_normal_mode_parameters(
                        args.protocol_version,
                        args.responding_presentation_selector,
                        args.presentation_context_definition_result_list,
                        undefined,
                        args.provider_reason,
                        args.user_data,
                    ),
                };
                dispatch_P_CONrsp_reject(stack.presentation, ppdu);
            }
        },
        request_P_RELEASE: (args: P_RELEASE_Request) => {
            if (args.user_data) {
                dispatch_P_RELreq(stack.presentation, args.user_data);
            } else {
                const user_data: User_data = {
                    simply_encoded_data: new Uint8Array(),
                };
                dispatch_P_RELreq(stack.presentation, user_data);
            }
        },
        respond_P_RELEASE: (args: P_RELEASE_Response) => {
            if (args.user_data) {
                dispatch_P_RELrsp_accept(stack.presentation, args.user_data);
            } else {
                const user_data: User_data = {
                    simply_encoded_data: new Uint8Array(),
                };
                dispatch_P_RELrsp_accept(stack.presentation, user_data);
            }
        },
        request_P_U_ABORT: (args: P_U_ABORT_Request) => {
            const ppdu: ARU_PPDU = {
                normal_mode_parameters: new ARU_PPDU_normal_mode_parameters(
                    undefined,
                    args.user_data,
                ),
            };
            dispatch_P_UABreq(stack.presentation, ppdu);
        },
    });
    const stack: ISOTransportOverTCPStack = {
        network: tpkt,
        transport,
        session,
        presentation,
        acse,
    };
    return stack;
}
