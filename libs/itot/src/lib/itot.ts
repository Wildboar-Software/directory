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
    dispatch_TDISreq,
    DR_TPDU,
} from "./transport";
import {
    SessionServiceConnectionState,
    newSessionConnection,
    dispatch_SCONreq,
    CONNECT_SPDU,
    receiveTSDU,
    dispatch_TCONcnf,
    dispatch_TCONind,
    dispatch_TDISind,
    dispatch_SCONrsp_accept,
    ACCEPT_SPDU,
    dispatch_SDTreq,
    DATA_TRANSFER_SPDU,
    dispatch_SRELreq,
    dispatch_SRELrsp_accept,
    FINISH_SPDU,
    DISCONNECT_SPDU,
    ABORT_SPDU,
    dispatch_SUABreq,
    REFUSE_SPDU,
    dispatch_SCONrsp_reject,
    dispatch_SRELrsp_reject,
    NOT_FINISHED_SPDU,
} from "./session";
import {
    createPresentationConnection,
    PresentationConnection,
    dispatch_CP,
    dispatch_CPA,
    dispatch_TD,
    dispatch_P_CONrsp_accept,
    dispatch_P_CONrsp_reject,
    dispatch_P_CONreq,
    dispatch_P_RELreq,
    dispatch_P_RELrsp_accept,
    dispatch_P_UABreq,
    dispatch_S_PABind,
    dispatch_S_CONcnf_reject,
    dispatch_S_RELcnf_accept,
    dispatch_S_RELcnf_reject,
    dispatch_S_RELind,
    dispatch_S_PERind,
    dispatch_S_UERind,
    dispatch_S_GTind,
} from "./presentation";
import {
    createAssociationControlState,
    ACPMState,
    P_CONNECT_Request,
    P_CONNECT_Response,
    P_RELEASE_Request,
    P_RELEASE_Response,
    P_U_ABORT_Request,
    dispatch_AARQ,
    dispatch_AARE_accept,
    dispatch_AARE_reject,
    dispatch_P_PABind,
    dispatch_RLRE_accept,
    dispatch_RLRE_reject,
    dispatch_RLRQ,
} from "./acse";
import {
    CP_type,
    _decode_CP_type,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/CP-type.ta";
import {
    CPR_PPDU,
    CPR_PPDU_normal_mode_parameters,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/CPR-PPDU.ta";
import {
    CPA_PPDU,
    _decode_CPA_PPDU,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/CPA-PPDU.ta";
import {
    ARP_PPDU,
    ARU_PPDU,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Abort-type.ta";
import {
    User_data,
    _decode_User_data,
    _encode_User_data,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/User-data.ta";
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
    CPA_PPDU_normal_mode_parameters,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/CPA-PPDU-normal-mode-parameters.ta";
import {
    Result_acceptance as ACSEResult_acceptance,
} from "@wildboar/acse/src/lib/modules/ACSE-1/Result.ta";
import { BERElement, ObjectIdentifier, OPTIONAL, ASN1Element } from "asn1-ts";
import { Socket } from "node:net";
import { BER } from "asn1-ts/dist/node/functional";
import { ARU_PPDU_normal_mode_parameters } from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/ARU-PPDU-normal-mode-parameters.ta";
import { _decode_AARQ_apdu } from "@wildboar/acse/src/lib/modules/ACSE-1/AARQ-apdu.ta";
import { _decode_AARE_apdu } from "@wildboar/acse/src/lib/modules/ACSE-1/AARE-apdu.ta";
import { ABRT_apdu, _encode_ABRT_apdu } from "@wildboar/acse/src/lib/modules/ACSE-1/ABRT-apdu.ta";
import { ABRT_source_acse_service_provider } from "@wildboar/acse/src/lib/modules/ACSE-1/ABRT-source.ta";
import { ABRT_diagnostic_protocol_error } from "@wildboar/acse/src/lib/modules/ACSE-1/ABRT-diagnostic.ta";
import {
    _decode_RLRQ_apdu,
} from "@wildboar/acse/src/lib/modules/ACSE-1/RLRQ-apdu.ta";
import {
    _decode_RLRE_apdu,
} from "@wildboar/acse/src/lib/modules/ACSE-1/RLRE-apdu.ta";

const id_ber = new ObjectIdentifier([2, 1, 1]);

export
interface ISOTransportOverTCPStack {
    network: ITOTSocket;
    transport: TransportConnection;
    session: SessionServiceConnectionState;
    presentation: PresentationConnection;
    acse: ACPMState;
}

function require_acse_user_data (user_data: OPTIONAL<User_data>): [ PDV_list, ASN1Element] | null {
    if (!user_data) {
        return null;
    }
    if (!("fully_encoded_data" in user_data)) {
        return null;
    }
    if (user_data.fully_encoded_data.length !== 1) {
        return null;
    }
    const pdv = user_data.fully_encoded_data[0];
    if (!("single_ASN1_type" in pdv.presentation_data_values)) {
        return null;
    }
    // ASCE is always encoded using BER.
    if (pdv.transfer_syntax_name && !pdv.transfer_syntax_name.isEqualTo(id_ber)) {
        return null;
    }

    return [ pdv, pdv.presentation_data_values.single_ASN1_type ];
}

function get_aru (): ARU_PPDU {
    return {
        normal_mode_parameters: new ARU_PPDU_normal_mode_parameters(
            undefined, // TODO: X.519 requires this to be filled in.
            {
                fully_encoded_data: [
                    new PDV_list(
                        undefined,
                        1, // FIXME:
                        {
                            single_ASN1_type: _encode_ABRT_apdu(new ABRT_apdu(
                                ABRT_source_acse_service_provider,
                                ABRT_diagnostic_protocol_error,
                                undefined,
                                undefined,
                                [],
                                undefined,
                            ), BER),
                        },
                    ),
                ],
            },
        ),
    };
}

export
function create_itot_stack (
    socket: Socket,
    sessionCaller: boolean = true,
    transportCaller: boolean = true,
    max_nsdu_size: number = 10_000_000,
): ISOTransportOverTCPStack {
    const tpkt = new ITOTSocket(socket);
    socket.on("data", (data) => tpkt.receiveData(data));
    const transport = createTransportConnection({
        available: () => socket.writable && socket.readable,
        disconnect: () => socket.end(),
        max_nsdu_size: () => max_nsdu_size,
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
        disconnect: () => transport.network.disconnect(), // TODO: Just use TDISreq instead.
        writeTSDU: (tsdu: Buffer) => {
            stack.transport = dispatch_TDTreq(stack.transport, tsdu);
        },
    }, sessionCaller, transportCaller);
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
    stack.network.on("NSDU", (nsdu) => dispatch_NSDU(stack.transport, nsdu));
    stack.transport.outgoingEvents.on("TCONind", () => {
        stack.session = dispatch_TCONind(stack.session);
    });
    stack.session.outgoingEvents.on("TCONrsp", () => { // TODO: Should this be handled by the session layer?
        const cc: CC_TPDU = {
            cdt: 0,
            class_option: 0,
            dstRef: 0, // TODO: Properly assign random refs.
            srcRef: 0,
            user_data: Buffer.alloc(0),
        };
        stack.transport = dispatch_TCONresp(stack.transport, cc);
    });
    stack.transport.outgoingEvents.on("TCONconf", () => {
        dispatch_TCONcnf(stack.session);
    });
    stack.transport.outgoingEvents.on("TDISind", () => {
        dispatch_TDISind(stack.session);
    });
    stack.transport.outgoingEvents.on("TSDU", (tsdu) => {
        const rc = receiveTSDU(stack.session, tsdu);
        if (rc) { // TODO: Is this an appropriate action?
            const dr: DR_TPDU = {
                reason: 0,
                user_data: Buffer.alloc(0),
                dstRef: 0, // TODO: Use correct values.
                srcRef: 0,
            };
            dispatch_TDISreq(stack.transport, dr);
        }
    });
    stack.session.outgoingEvents.on("SCONind", (cn) => {
        if (cn.userData) {
            const el = new BERElement();
            el.fromBytes(cn.userData);
            const ppdu = _decode_CP_type(el);
            dispatch_CP(stack.presentation, ppdu);
        } else {
            const ac: ACCEPT_SPDU = {}; // TODO: Take this from S-user input.
            stack.session = dispatch_SCONrsp_accept(stack.session, ac);
        }
    });
    // stack.session.outgoingEvents.on("SRELind", (spdu) => {
    //     const dn: DISCONNECT_SPDU = {}; // TODO: Take this from S-user input.
    //     stack.session = dispatch_SRELrsp_accept(stack.session, dn);
    // });
    stack.session.outgoingEvents.on("SDTind", (spdu) => {
        const el = new BERElement();
        el.fromBytes(spdu.userInformation);
        const ppdu = _decode_User_data(el);
        dispatch_TD(stack.presentation, ppdu);
    });
    stack.session.outgoingEvents.on("SPABind", () => {
        const ppdu: ARP_PPDU = new ARP_PPDU(
            undefined,
            undefined,
        );
        dispatch_S_PABind(stack.presentation, ppdu);
    });
    stack.session.outgoingEvents.on("SCONcnf_accept", (spdu) => {
        if (spdu.userData) {
            const el = new BERElement();
            el.fromBytes(spdu.userData);
            const ppdu = _decode_CPA_PPDU(el);
            dispatch_CPA(stack.presentation, ppdu);
        } else {
            const ac: ACCEPT_SPDU = {}; // TODO: Take this from S-user input.
            stack.session = dispatch_SCONrsp_accept(stack.session, ac);
        }
    });
    stack.session.outgoingEvents.on("SCONcnf_reject", () => {
        const ppdu: CPR_PPDU = {
            normal_mode_parameters: new CPR_PPDU_normal_mode_parameters(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        };
        dispatch_S_CONcnf_reject(stack.presentation, ppdu);
    });
    stack.session.outgoingEvents.on("SRELcnf_accept", (spdu) => {
        spdu.userData
        if (spdu.userData) {
            const el = new BERElement();
            el.fromBytes(spdu.userData);
            const user_data = _decode_User_data(el);
            dispatch_S_RELcnf_accept(stack.presentation, user_data);
        } else {
            const user_data: User_data = {
                simply_encoded_data: new Uint8Array(),
            };
            dispatch_S_RELcnf_accept(stack.presentation, user_data);
        }
    });
    stack.session.outgoingEvents.on("SRELcnf_reject", (spdu) => {
        if (spdu.userData) {
            const el = new BERElement();
            el.fromBytes(spdu.userData);
            const user_data = _decode_User_data(el);
            dispatch_S_RELcnf_reject(stack.presentation, user_data);
        } else {
            const user_data: User_data = {
                simply_encoded_data: new Uint8Array(),
            };
            dispatch_S_RELcnf_reject(stack.presentation, user_data);
        }
    });
    stack.session.outgoingEvents.on("SRELind", (spdu) => {
        if (spdu.userData) {
            const el = new BERElement();
            el.fromBytes(spdu.userData);
            const user_data = _decode_User_data(el);
            dispatch_S_RELind(stack.presentation, user_data);
        } else {
            const user_data: User_data = {
                simply_encoded_data: new Uint8Array(),
            };
            dispatch_S_RELind(stack.presentation, user_data);
        }
    });
    stack.session.outgoingEvents.on("SPERind", () => {
        dispatch_S_PERind(stack.presentation);
    });
    stack.session.outgoingEvents.on("SUERind", () => {
        dispatch_S_UERind(stack.presentation);
    });
    stack.session.outgoingEvents.on("SGTind", () => {
        dispatch_S_GTind(stack.presentation);
    });
    stack.presentation.outgoingEvents.on("P-CONcnf+", (ppdu) => {
        const pdv = require_acse_user_data(ppdu.normal_mode_parameters?.user_data);
        if (pdv) {
            const [ , value ] = pdv;
            const aare = _decode_AARE_apdu(value);
            if (aare.result === ACSEResult_acceptance) {
                dispatch_AARE_accept(stack.acse, aare);
            } else {
                // You cannot reject an ACSE association with a P-CONNECT accept.
                dispatch_P_UABreq(stack.presentation, get_aru());
            }
        } else {
            dispatch_P_UABreq(stack.presentation, get_aru());
        }
    });
    stack.presentation.outgoingEvents.on("P-CONcnf-", (ppdu) => {
        if (!("normal_mode_parameters" in ppdu)) {
            dispatch_P_UABreq(stack.presentation, get_aru());
            return;
        }
        const pdv = require_acse_user_data(ppdu.normal_mode_parameters?.user_data);
        if (pdv) {
            const [ , value ] = pdv;
            const aare = _decode_AARE_apdu(value);
            if (aare.result === ACSEResult_acceptance) {
                // You cannot accept an ACSE connection within a P-CONNECT rejection.
                dispatch_P_UABreq(stack.presentation, get_aru());
            } else {
                dispatch_AARE_reject(stack.acse, aare);
            }
        } else {
            dispatch_P_UABreq(stack.presentation, get_aru());
        }
        // TODO: Which to dispatch?
        // dispatch_P_CONcnf_reject(stack.acse);
    });
    stack.presentation.outgoingEvents.on("P-CONind", (ppdu) => {
        const pdv = require_acse_user_data(ppdu.normal_mode_parameters?.user_data);
        if (pdv) {
            const [ , value ] = pdv;
            const aarq = _decode_AARQ_apdu(value);
            dispatch_AARQ(stack.acse, aarq);
        } else {
            dispatch_P_UABreq(stack.presentation, get_aru());
        }
    });
    // This should be handled outside of this function.
    // stack.presentation.outgoingEvents.on("P-DTind", (ppdu) => {
    //     const pdv = require_acse_user_data(ppdu);
    //     if (pdv) {
    //         const [ , value ] = pdv;
    //         const aarq = _decode_AARQ_apdu(value);
    //         dispatch_AARQ(stack.acse, aarq);
    //     } else {
    //         dispatch_P_UABreq(stack.presentation, get_aru());
    //     }
    // });
    // stack.presentation.outgoingEvents.on("P-EXind", () => {
    //     // TODO: Decode User-Data
    // });
    // stack.presentation.outgoingEvents.on("P-GTind", () => {
    // });
    stack.presentation.outgoingEvents.on("P-PABind", () => {
        dispatch_P_PABind(stack.acse);
    });
    // stack.presentation.outgoingEvents.on("P-PERind", () => {

    // });
    stack.presentation.outgoingEvents.on("P-RELcnf+", (ppdu) => {
        const pdv = require_acse_user_data(ppdu);
        if (pdv) {
            const [ , value ] = pdv;
            const rlre = _decode_RLRE_apdu(value);
            dispatch_RLRE_accept(stack.acse, rlre);
        } else {
            dispatch_P_UABreq(stack.presentation, get_aru());
        }
    });
    stack.presentation.outgoingEvents.on("P-RELcnf-", (ppdu) => {
        const pdv = require_acse_user_data(ppdu);
        if (pdv) {
            const [ , value ] = pdv;
            const rlre = _decode_RLRE_apdu(value);
            dispatch_RLRE_reject(stack.acse, rlre);
        } else {
            dispatch_P_UABreq(stack.presentation, get_aru());
        }
    });
    stack.presentation.outgoingEvents.on("P-RELind", (ppdu) => {
        const pdv = require_acse_user_data(ppdu);
        if (pdv) {
            const [ , value ] = pdv;
            const rlrq = _decode_RLRQ_apdu(value);
            dispatch_RLRQ(stack.acse, rlrq);
        } else {
            dispatch_P_UABreq(stack.presentation, get_aru());
        }
    });
    stack.presentation.outgoingEvents.on("S-RELreq", (ppdu) => {
        const spdu: FINISH_SPDU = {
            userData: Buffer.from(_encode_User_data(ppdu, BER).toBytes()),
        };
        dispatch_SRELreq(stack.session, spdu);
    });
    stack.presentation.outgoingEvents.on("S-RELrsp+", (ppdu) => {
        const spdu: DISCONNECT_SPDU = {
            userData: Buffer.from(_encode_User_data(ppdu, BER).toBytes()),
        };
        dispatch_SRELrsp_accept(stack.session, spdu);
    });
    stack.presentation.outgoingEvents.on("S-RELrsp-", (ppdu) => {
        const spdu: NOT_FINISHED_SPDU = {
            userData: Buffer.from(_encode_User_data(ppdu, BER).toBytes()),
        };
        dispatch_SRELrsp_reject(stack.session, spdu);
    });
    // stack.presentation.outgoingEvents.on("S-UERreq", (ppdu) => {});
    // stack.presentation.outgoingEvents.on("S-GTreq", (ppdu) => {});
    // TODO: What to do when socket disconnects? errors?
    return stack;
}
