import { ITOTSocket } from './tpkt';
import { OSINetworkingOptions, WithOSINetworkingOptions } from "../index";
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
    DR_REASON_NOT_SPECIFIED,
    dispatch_NDISind,
    DEFAULT_MAX_TSDU_SIZE_FOR_ITOT,
    RETURN_OK,
    handle_transport_protocol_error,
} from './transport';
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
    TRANSPORT_DISCONNECT_RELEASED,
    SUR_DUPLEX,
    SUR_HALF_DUPLEX,
} from './session';
import {
    createPresentationConnection,
    PresentationConnection,
    dispatch_CP,
    dispatch_CPA,
    dispatch_TD,
    dispatch_ARP,
    dispatch_ARU,
    dispatch_P_CONrsp_accept,
    dispatch_P_CONrsp_reject,
    dispatch_P_CONreq,
    dispatch_P_RELreq,
    dispatch_P_RELrsp_accept,
    dispatch_P_RELrsp_reject,
    dispatch_P_UABreq,
    dispatch_S_PABind,
    dispatch_S_CONcnf_reject,
    dispatch_S_RELcnf_accept,
    dispatch_S_RELcnf_reject,
    dispatch_S_RELind,
    dispatch_S_PERind,
    dispatch_S_UERind,
    dispatch_S_GTind,
    get_acse_ber_context,
} from './presentation';
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
    dispatch_P_PABind,
    dispatch_RLRE_accept,
    dispatch_RLRE_reject,
    dispatch_RLRQ,
    dispatch_P_CONcnf_reject,
    dispatch_ABRT,
} from './acse';
import {
    CP_type,
    _decode_CP_type,
} from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/CP-type.ta';
import {
    CPR_PPDU,
    CPR_PPDU_normal_mode_parameters,
} from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/CPR-PPDU.ta';
import {
    CPA_PPDU,
    _decode_CPA_PPDU,
} from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/CPA-PPDU.ta';
import {
    ARP_PPDU,
    ARU_PPDU,
    _decode_Abort_type,
} from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Abort-type.ta';
import {
    User_data,
    _decode_User_data,
    _encode_User_data,
} from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/User-data.ta';
import { Mode_selector_mode_value_normal_mode } from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Mode-selector-mode-value.ta';
import { CP_type_normal_mode_parameters } from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/CP-type-normal-mode-parameters.ta';
import { PDV_list } from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/PDV-list.ta';
import { CPA_PPDU_normal_mode_parameters } from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/CPA-PPDU-normal-mode-parameters.ta';
import { Result_acceptance as ACSEResult_acceptance } from '@wildboar/acse/src/lib/modules/ACSE-1/Result.ta';
import { BERElement, ObjectIdentifier, OPTIONAL, ASN1Element } from 'asn1-ts';
import { Socket } from 'node:net';
import { BER } from 'asn1-ts/dist/node/functional';
import { ARU_PPDU_normal_mode_parameters } from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/ARU-PPDU-normal-mode-parameters.ta';
import { _decode_AARQ_apdu } from '@wildboar/acse/src/lib/modules/ACSE-1/AARQ-apdu.ta';
import { _decode_AARE_apdu } from '@wildboar/acse/src/lib/modules/ACSE-1/AARE-apdu.ta';
import {
    ABRT_apdu,
    _encode_ABRT_apdu,
    _decode_ABRT_apdu,
} from '@wildboar/acse/src/lib/modules/ACSE-1/ABRT-apdu.ta';
import { ABRT_source_acse_service_provider } from '@wildboar/acse/src/lib/modules/ACSE-1/ABRT-source.ta';
import { ABRT_diagnostic_protocol_error } from '@wildboar/acse/src/lib/modules/ACSE-1/ABRT-diagnostic.ta';
import { _decode_RLRQ_apdu } from '@wildboar/acse/src/lib/modules/ACSE-1/RLRQ-apdu.ta';
import { _decode_RLRE_apdu } from '@wildboar/acse/src/lib/modules/ACSE-1/RLRE-apdu.ta';
import { Context_list_Item } from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Context-list-Item.ta';
import { Presentation_context_identifier_list_Item } from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Presentation-context-identifier-list-Item.ta';
import { randomBytes, randomInt } from 'node:crypto';

const id_ber = new ObjectIdentifier([2, 1, 1]);
const id_acse = new ObjectIdentifier([2, 2, 1, 0, 1]);

export const TIMER_TIME_IN_MS: number = 3000;
export const UUID_LENGTH_BYTES: number = 16;

export interface ISOTransportOverTCPStack extends WithOSINetworkingOptions {
    network: ITOTSocket;
    transport: TransportConnection;
    session: SessionServiceConnectionState;
    presentation: PresentationConnection;
    acse: ACPMState;
}

function require_acse_user_data(
    user_data: OPTIONAL<User_data>
): [PDV_list, ASN1Element] | null {
    if (!user_data) {
        return null;
    }
    if (!('fully_encoded_data' in user_data)) {
        return null;
    }
    if (user_data.fully_encoded_data.length !== 1) {
        return null;
    }
    const pdv = user_data.fully_encoded_data[0];
    if (!('single_ASN1_type' in pdv.presentation_data_values)) {
        return null;
    }
    // ASCE is always encoded using BER.
    if (
        pdv.transfer_syntax_name &&
        !pdv.transfer_syntax_name.isEqualTo(id_ber)
    ) {
        return null;
    }

    return [pdv, pdv.presentation_data_values.single_ASN1_type];
}

function get_aru(c: PresentationConnection): ARU_PPDU {
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
    return {
        normal_mode_parameters: new ARU_PPDU_normal_mode_parameters(
            [
                new Presentation_context_identifier_list_Item(
                    acse_ber_context.presentation_context_identifier,
                    id_ber
                ),
            ],
            {
                fully_encoded_data: [
                    new PDV_list(
                        undefined,
                        acse_ber_context.presentation_context_identifier,
                        {
                            single_ASN1_type: _encode_ABRT_apdu(
                                new ABRT_apdu(
                                    ABRT_source_acse_service_provider,
                                    ABRT_diagnostic_protocol_error,
                                    undefined,
                                    undefined,
                                    [],
                                    undefined
                                ),
                                BER
                            ),
                        }
                    ),
                ],
            }
        ),
    };
}

export function create_itot_stack(
    socket: Socket,
    options?: OSINetworkingOptions,
): ISOTransportOverTCPStack {
    const tpkt = new ITOTSocket(socket);
    if (options?.max_nsdu_size) {
        tpkt.max_nsdu_size = options.max_nsdu_size;
    }
    socket.on('data', (data) => tpkt.receiveData(data));
    const transport = createTransportConnection(
        {
            available: () => socket.writable && socket.readable,
            max_nsdu_size: () => options?.max_nsdu_size ?? 65531, // See IETF RFC 1006, Section 6.
            open: () => socket.writable,
            openInProgress: () => socket.connecting,
            transportConnectionsServed: () => 1,
            write_nsdu: (nsdu: Buffer) => tpkt.writeNSDU(nsdu),
        },
        options?.max_tsdu_size ?? DEFAULT_MAX_TSDU_SIZE_FOR_ITOT,
        options?.max_tpdu_size
            ? Math.min(options.max_tpdu_size, 65531)
            : 65530,
    );
    const session = newSessionConnection(
        {
            connected: () =>
                [
                    TransportConnectionState.OPEN,
                    TransportConnectionState.OPEN_R,
                    TransportConnectionState.OPEN_WR,
                ].includes(transport.state),
            writeTSDU: (tsdu: Buffer) => dispatch_TDTreq(stack.transport, tsdu),
        },
        options?.sessionCaller ?? true,
        options?.transportCaller ?? true,
        options?.abort_timeout_ms,
        options?.max_ssdu_size,
    );
    const presentation = createPresentationConnection(
        {
            request_S_CONNECT: (req) => {
                const spdu: CONNECT_SPDU = {
                    userData: req.user_data,
                    connectAcceptItem: {
                        protocolOptions: 0,
                        versionNumber: 2,
                        tsduMaximumSize: options?.max_tsdu_size
                            ? {
                                responder_to_initiator: options.max_tsdu_size,
                                initiator_to_responder: options.max_tsdu_size,
                            }
                            : undefined,
                    },
                    calledSessionSelector: options?.remoteAddress?.sSelector
                        ? Buffer.from(options.remoteAddress.sSelector)
                        : stack.session.remote_selector,
                    callingSessionSelector: options?.localAddress?.sSelector
                        ? Buffer.from(options.localAddress.sSelector)
                        : stack.session.local_selector,
                    sessionUserRequirements: SUR_DUPLEX | SUR_HALF_DUPLEX,
                };
                dispatch_SCONreq(stack.session, spdu);
            },
            respond_S_CONNECT: (res) => {

                if (res.refuse_reason === undefined) {
                    const spdu: ACCEPT_SPDU = {
                        userData: res.user_data,
                        callingSessionSelector: options?.remoteAddress?.sSelector
                            ? Buffer.from(options.remoteAddress.sSelector)
                            : undefined,
                        respondingSessionSelector: options?.localAddress?.sSelector
                            ? Buffer.from(options.localAddress.sSelector)
                            : stack.session.local_selector,
                        connectAcceptItem: {
                            protocolOptions: 0,
                            versionNumber: 2,
                            tsduMaximumSize: options?.max_tsdu_size
                                ? {
                                    responder_to_initiator: options.max_tsdu_size,
                                    initiator_to_responder: options.max_tsdu_size,
                                }
                                : undefined,
                        },
                        sessionUserRequirements: (
                            stack.session.cn?.sessionUserRequirements
                            && (stack.session.cn.sessionUserRequirements & SUR_DUPLEX)
                        )
                            ? SUR_DUPLEX
                            : SUR_HALF_DUPLEX,
                    };
                    dispatch_SCONrsp_accept(
                        stack.session,
                        spdu
                    );
                } else {
                    const spdu: REFUSE_SPDU = {
                        reasonData: res.user_data,
                        reasonCode: res.refuse_reason,
                        sessionUserRequirements: (
                            stack.session.cn?.sessionUserRequirements
                            && (stack.session.cn.sessionUserRequirements & SUR_DUPLEX)
                        )
                            ? SUR_DUPLEX
                            : SUR_HALF_DUPLEX,
                        transportDisconnect: TRANSPORT_DISCONNECT_RELEASED,
                        versionNumber: 2,
                    };
                    dispatch_SCONrsp_reject(
                        stack.session,
                        spdu
                    );
                }
            },
            S_DATA: (req) => {
                const spdu: DATA_TRANSFER_SPDU = {
                    userInformation: req.user_data,
                };
                dispatch_SDTreq(stack.session, spdu);
            },
            S_RELEASE: (req) => {
                const spdu: FINISH_SPDU = {
                    userData: req.user_data,
                };
                dispatch_SRELreq(stack.session, spdu);
            },
            S_U_ABORT: (req) => {
                const spdu: ABORT_SPDU = {
                    userData: req.user_data,
                };
                dispatch_SUABreq(stack.session, spdu);
            },
            S_P_ABORT: () => {
                const spdu: ABORT_SPDU = {};
                dispatch_SUABreq(stack.session, spdu);
            },
        },
        () => true,
        (a) => a[0],
        options?.max_presentation_contexts,
    );
    const acse = createAssociationControlState({
        request_P_CONNECT: (args: P_CONNECT_Request) => {
            const ppdu: CP_type = new CP_type(
                {
                    mode_value: Mode_selector_mode_value_normal_mode,
                },
                undefined,
                new CP_type_normal_mode_parameters(
                    args.protocol_version,
                    args.calling_presentation_selector
                        ?? options?.localAddress?.pSelector
                        ?? stack.presentation.local_selector,
                    args.called_presentation_selector ?? options?.remoteAddress?.pSelector,
                    args.presentation_context_definition_list,
                    args.default_context_name,
                    args.presentation_requirements,
                    args.user_session_requirements,
                    args.protocol_options,
                    args.initiators_nominated_context,
                    args.extensions,
                    args.user_data
                )
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
                        args.responding_presentation_selector
                            ?? options?.localAddress?.pSelector
                            ?? stack.presentation.local_selector,
                        args.presentation_context_definition_result_list,
                        args.presentation_requirements,
                        args.user_session_requirements,
                        args.protocol_options,
                        args.responders_nominated_context,
                        args.user_data
                    )
                );
                dispatch_P_CONrsp_accept(stack.presentation, ppdu);
            } else {
                const ppdu: CPR_PPDU = {
                    normal_mode_parameters: new CPR_PPDU_normal_mode_parameters(
                        args.protocol_version,
                        args.responding_presentation_selector
                            ?? options?.localAddress?.pSelector
                            ?? stack.presentation.local_selector,
                        args.presentation_context_definition_result_list,
                        undefined,
                        args.provider_reason,
                        args.user_data
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
            const user_data: User_data = args.user_data ?? {
                simply_encoded_data: new Uint8Array(),
            };
            if (args.reject) {
                dispatch_P_RELrsp_reject(stack.presentation, user_data);
            } else {
                dispatch_P_RELrsp_accept(stack.presentation, user_data);
            }
        },
        request_P_U_ABORT: (args: P_U_ABORT_Request) => {
            const acse_ber_context = get_acse_ber_context(stack.presentation);
            const ppdu: ARU_PPDU = {
                normal_mode_parameters: new ARU_PPDU_normal_mode_parameters(
                    [
                        new Presentation_context_identifier_list_Item(
                            acse_ber_context.presentation_context_identifier,
                            id_ber
                        ),
                    ],
                    args.user_data
                ),
            };
            dispatch_P_UABreq(stack.presentation, ppdu);
        },
    });
    const stack: ISOTransportOverTCPStack = {
        options,
        network: tpkt,
        transport,
        session,
        presentation,
        acse,
    };
    stack.network.on('NSDU', (nsdu) => {
        const rc = dispatch_NSDU(stack.transport, nsdu);
        if (rc !== RETURN_OK) {
            handle_transport_protocol_error(stack.transport);
        }
    });
    stack.transport.outgoingEvents.on('TCONind', () => dispatch_TCONind(stack.session));
    stack.session.outgoingEvents.on('TCONreq', () => {
        const tpdu: CR_TPDU = {
            cdt: 0,
            class_option: 0,
            dstRef: 0,
            srcRef: randomBytes(2).readUint16BE(),
            user_data: Buffer.alloc(0),
            calling_transport_selector: options?.localAddress?.tSelector
                ? Buffer.from(options.localAddress.tSelector)
                : stack.transport.local_t_selector,
            called_or_responding_transport_selector: options?.remoteAddress?.tSelector
                ? Buffer.from(options.remoteAddress.tSelector)
                : undefined,
        };
        dispatch_TCONreq(stack.transport, tpdu);
    });
    stack.session.outgoingEvents.on('TCONrsp', () => {
        const cc: CC_TPDU = {
            cdt: 0,
            class_option: 0,
            dstRef: stack.transport.remote_ref,
            srcRef: stack.transport.local_ref,
            user_data: Buffer.alloc(0),
            called_or_responding_transport_selector: options?.localAddress?.tSelector
                ? Buffer.from(options.localAddress.tSelector)
                : undefined,
            calling_transport_selector: stack.transport.remote_t_selector,
            tpdu_size: undefined, // Intentionally omitted.
            preferred_max_tpdu_size: undefined,
        };
        dispatch_TCONresp(stack.transport, cc);
    });
    stack.transport.outgoingEvents.on('TCONconf', () => {
        dispatch_TCONcnf(stack.session);
    });
    stack.transport.outgoingEvents.on('TDISind', () => {
        dispatch_TDISind(stack.session);
    });
    stack.transport.outgoingEvents.on('TSDU', (tsdu) => {
        const rc = receiveTSDU(stack.session, tsdu);
        if (rc) {
            // X.519 implies that it is okay to not transport a PPDU when the
            // abort was caused by a session-layer problem.
            const response: ABORT_SPDU = {};
            stack.session.outgoingEvents.emit('AB_nr', response);
            stack.session.TIM = setTimeout(
                () => stack.session.outgoingEvents.emit('TDISreq'),
                options?.abort_timeout_ms ?? TIMER_TIME_IN_MS
            );
        }
    });
    stack.transport.outgoingEvents.on('NDISreq', () => socket.end());
    stack.session.outgoingEvents.on('TDISreq', () => {
        dispatch_TDISreq(stack.transport, {
            dstRef: stack.transport.remote_ref,
            srcRef: stack.transport.local_ref,
            reason: DR_REASON_NOT_SPECIFIED, // This is actually an approriate value.
            user_data: Buffer.alloc(0),
        });
    });
    // stack.transport.outgoingEvents.on("NRSTresp", () => {});
    // It is not clear to me how this would even be implemented: how would this
    // even get the network address unless it is passed in from the upper layers?
    // stack.transport.outgoingEvents.on("NCONreq", () => {});
    stack.session.outgoingEvents.on('SCONind', (cn) => {
        const user_data = cn.extendedUserData ?? cn.userData;
        if (user_data) {
            const el = new BERElement();
            el.fromBytes(user_data);
            const ppdu = _decode_CP_type(el);
            dispatch_CP(stack.presentation, ppdu);
        } else {
            const ac: ACCEPT_SPDU = {
                callingSessionSelector: cn.callingSessionSelector?.subarray(0, 16),
                respondingSessionSelector: options?.localAddress?.sSelector
                    ? Buffer.from(options.localAddress.sSelector)
                    : undefined,
                connectAcceptItem: {
                    tsduMaximumSize: options?.max_tsdu_size
                        ? {
                            initiator_to_responder: options.max_tsdu_size,
                            responder_to_initiator: options.max_tsdu_size,
                        }
                        : undefined,
                    versionNumber: 2,
                    protocolOptions: 0,
                },
                sessionUserRequirements: (
                    stack.session.cn?.sessionUserRequirements
                    && (stack.session.cn.sessionUserRequirements & SUR_DUPLEX)
                )
                    ? SUR_DUPLEX
                    : SUR_HALF_DUPLEX,
            };
            dispatch_SCONrsp_accept(stack.session, ac);
        }
    });
    stack.session.outgoingEvents.on('SDTind', (ssdu: Buffer) => {
        const el = new BERElement();
        el.fromBytes(ssdu);
        const ppdu = _decode_User_data(el);
        dispatch_TD(stack.presentation, ppdu);
    });
    stack.session.outgoingEvents.on('SPABind', () => {
        const ppdu: ARP_PPDU = new ARP_PPDU(undefined, undefined);
        dispatch_S_PABind(stack.presentation, ppdu);
    });
    stack.session.outgoingEvents.on('SCONcnf_accept', (spdu) => {
        if (spdu.userData) {
            const el = new BERElement();
            el.fromBytes(spdu.userData);
            const ppdu = _decode_CPA_PPDU(el);
            dispatch_CPA(stack.presentation, ppdu);
        } else {
            const ab: ABORT_SPDU = {};
            dispatch_SUABreq(stack.session, ab);
        }
    });
    stack.session.outgoingEvents.on('SCONcnf_reject', () => {
        const ppdu: CPR_PPDU = {
            normal_mode_parameters: new CPR_PPDU_normal_mode_parameters(
                undefined,
                options?.localAddress?.pSelector,
                undefined,
                undefined,
                undefined,
                undefined
            ),
        };
        dispatch_S_CONcnf_reject(stack.presentation, ppdu);
    });
    stack.session.outgoingEvents.on('SRELcnf_accept', (spdu) => {
        spdu.userData;
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
    stack.session.outgoingEvents.on('SRELcnf_reject', (spdu) => {
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
    stack.session.outgoingEvents.on('SRELind', (spdu) => {
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
    stack.session.outgoingEvents.on('SUABind', (spdu) => {
        if (spdu.userData) {
            const el = new BERElement();
            el.fromBytes(spdu.userData);
            const ppdu = _decode_Abort_type(el);
            if ('aru_ppdu' in ppdu) {
                dispatch_ARU(stack.presentation, ppdu.aru_ppdu);
            } else if ('arp_ppdu' in ppdu) {
                dispatch_ARP(stack.presentation, ppdu.arp_ppdu);
            }
        } // Otherwise, do nothing so we don't cause an infinite loop of aborts.
    });
    stack.session.outgoingEvents.on('SPERind', () => {
        dispatch_S_PERind(stack.presentation);
    });
    stack.session.outgoingEvents.on('SUERind', () => {
        dispatch_S_UERind(stack.presentation);
    });
    stack.session.outgoingEvents.on('SGTind', () => {
        dispatch_S_GTind(stack.presentation);
    });
    stack.presentation.outgoingEvents.on('P-CONcnf+', (ppdu) => {
        const pdv = require_acse_user_data(
            ppdu.normal_mode_parameters?.user_data
        );
        if (pdv) {
            const [, value] = pdv;
            const aare = _decode_AARE_apdu(value);
            if (aare.result === ACSEResult_acceptance) {
                dispatch_AARE_accept(stack.acse, aare);
            } else {
                // You cannot reject an ACSE association with a P-CONNECT accept.
                dispatch_P_UABreq(
                    stack.presentation,
                    get_aru(stack.presentation)
                );
            }
        } else {
            dispatch_P_UABreq(stack.presentation, get_aru(stack.presentation));
        }
    });
    stack.presentation.outgoingEvents.on('P-CONcnf-', (ppdu) => {
        if (!('normal_mode_parameters' in ppdu)) {
            dispatch_P_UABreq(stack.presentation, get_aru(stack.presentation));
            return;
        }
        const pdv = require_acse_user_data(
            ppdu.normal_mode_parameters?.user_data
        );
        if (pdv) {
            const [, value] = pdv;
            const aare = _decode_AARE_apdu(value);
            if (aare.result === ACSEResult_acceptance) {
                // Do nothing: you cannot accept an ACSE connection within a P-CONNECT rejection.
            } else {
                dispatch_P_CONcnf_reject(stack.acse, aare);
            }
        } else {
            dispatch_P_CONcnf_reject(stack.acse);
        }
    });
    stack.presentation.outgoingEvents.on('P-CONind', (ppdu) => {
        const pdv = require_acse_user_data(
            ppdu.normal_mode_parameters?.user_data
        );
        if (pdv) {
            const [, value] = pdv;
            const aarq = _decode_AARQ_apdu(value);
            dispatch_AARQ(stack.acse, aarq);
        } else {
            dispatch_P_UABreq(stack.presentation, get_aru(stack.presentation));
        }
    });
    // stack.presentation.outgoingEvents.on("P-EXind", () => {});
    // stack.presentation.outgoingEvents.on("P-GTind", () => {});
    stack.presentation.outgoingEvents.on('P-PABind', () => {
        dispatch_P_PABind(stack.acse);
    });
    stack.presentation.outgoingEvents.on('P-UABind', (ppdu) => {
        if (!('normal_mode_parameters' in ppdu)) {
            return;
        }
        const pdv = require_acse_user_data(
            ppdu.normal_mode_parameters?.user_data
        );
        if (pdv) {
            const [, value] = pdv;
            const abrt = _decode_ABRT_apdu(value);
            dispatch_ABRT(stack.acse, abrt);
        } else {
            /* NOOP: To prevent infinite abort loop. */
        }
    });
    // stack.presentation.outgoingEvents.on("P-PERind", () => {});
    stack.presentation.outgoingEvents.on('P-RELcnf+', (ppdu) => {
        const pdv = require_acse_user_data(ppdu);
        if (pdv) {
            const [, value] = pdv;
            const rlre = _decode_RLRE_apdu(value);
            dispatch_RLRE_accept(stack.acse, rlre);
        } else {
            dispatch_P_UABreq(stack.presentation, get_aru(stack.presentation));
        }
    });
    stack.presentation.outgoingEvents.on('P-RELcnf-', (ppdu) => {
        const pdv = require_acse_user_data(ppdu);
        if (pdv) {
            const [, value] = pdv;
            const rlre = _decode_RLRE_apdu(value);
            dispatch_RLRE_reject(stack.acse, rlre);
        } else {
            dispatch_P_UABreq(stack.presentation, get_aru(stack.presentation));
        }
    });
    stack.presentation.outgoingEvents.on('P-RELind', (ppdu) => {
        const pdv = require_acse_user_data(ppdu);
        if (pdv) {
            const [, value] = pdv;
            const rlrq = _decode_RLRQ_apdu(value);
            dispatch_RLRQ(stack.acse, rlrq);
        } else {
            dispatch_P_UABreq(stack.presentation, get_aru(stack.presentation));
        }
    });
    stack.presentation.outgoingEvents.on('S-RELreq', (ppdu) => {
        const spdu: FINISH_SPDU = {
            userData: Buffer.from(_encode_User_data(ppdu, BER).toBytes()),
        };
        dispatch_SRELreq(stack.session, spdu);
    });
    stack.presentation.outgoingEvents.on('S-RELrsp+', (ppdu) => {
        const spdu: DISCONNECT_SPDU = {
            userData: ppdu
                ? Buffer.from(_encode_User_data(ppdu, BER).toBytes())
                : undefined,
        };
        dispatch_SRELrsp_accept(stack.session, spdu);
    });
    stack.presentation.outgoingEvents.on('S-RELrsp-', (ppdu) => {
        const spdu: NOT_FINISHED_SPDU = {
            userData: ppdu
                ? Buffer.from(_encode_User_data(ppdu, BER).toBytes())
                : undefined,
        };
        dispatch_SRELrsp_reject(stack.session, spdu);
    });
    socket.on('error', () => socket.destroy());
    socket.on('end', () => socket.end());
    socket.on('close', () => dispatch_NDISind(stack.transport));
    socket.on('timeout', () => socket.end());
    // stack.presentation.outgoingEvents.on("S-UERreq", (ppdu) => {});
    // stack.presentation.outgoingEvents.on("S-GTreq", (ppdu) => {});
    return stack;
}
