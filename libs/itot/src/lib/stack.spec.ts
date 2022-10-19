import { ITOTSocket } from "./itot";
import {
    TransportConnection,
    createTransportConnection,
    dispatch_TCONreq,
    dispatch_TDTreq,
    dispatch_NSDU,
    CR_TPDU,
    CC_TPDU,
    dispatch_TCONresp,
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
    dispatch_P_CONreq,
} from "./presentation";
import {
    CP_type,
    _decode_CP_type,
    _encode_CP_type,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/CP-type.ta";
import {
    _decode_CPR_PPDU,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/CPR-PPDU.ta";
import {
    CPA_PPDU,
    _decode_CPA_PPDU,
    _encode_CPA_PPDU,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/CPA-PPDU.ta";
import {
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
import { BERElement, ObjectIdentifier } from "asn1-ts";
import { Socket } from "node:net";
import { BER, _encodeUTF8String } from "asn1-ts/dist/node/functional";
import { assert } from "node:console";

jest.mock("node:net");

const id_ber = new ObjectIdentifier([ 2, 1, 1 ]);
const id_acse = new ObjectIdentifier([ 2, 2, 1, 0, 1 ]);
const id_random_protocol = new ObjectIdentifier([ 1, 2, 3, 4 ]);

export
interface OSINetworkStack {
    network: ITOTSocket,
    transport: TransportConnection,
    session: SessionServiceConnectionState,
    presentation: PresentationConnection,
}

describe("The OSI network stack", () => {
    test("it works", () => {
        const socket1 = new Socket();
        const socket1write = jest.spyOn(socket1, "write");
        socket1write.mockImplementation((data: any, ...args: any[]): any => {
            n2.receiveData(data);
        });
        const n1 = new ITOTSocket(socket1);
        // socket1.on("data", n1.receiveData);
        const t1 = createTransportConnection({
            available: () => true,
            disconnect: jest.fn(),
            max_nsdu_size: () => 10_000_000,
            open: () => true,
            openInProgress: () => false,
            transportConnectionsServed: () => 1,
            write_nsdu: (nsdu: Buffer) => n1.writeNSDU(nsdu),
        }, "CLIENT");
        const s1 = newSessionConnection({
            connected: () => false,
            connect: () => {
                const tpdu: CR_TPDU = {
                    cdt: 0,
                    class_option: 0,
                    dstRef: 0,
                    srcRef: 0,
                    user_data: Buffer.alloc(0),
                };
                stack1.transport = dispatch_TCONreq(stack1.transport, tpdu);
            },
            disconnect: jest.fn(),
            writeTSDU: (tsdu: Buffer) => {
                stack1.transport = dispatch_TDTreq(stack1.transport, tsdu);
            },
        }, true, true);
        const p1 = createPresentationConnection({
            request_S_CONNECT: (req) => {
                const spdu: CONNECT_SPDU = {
                    userData: req.user_data,
                };
                stack1.session = dispatch_SCONreq(stack1.session, spdu);
            },
            respond_S_CONNECT: (res) => {
                if (res.refuse_reason === undefined) {
                    const spdu: ACCEPT_SPDU = {
                        userData: res.user_data,
                    };
                    stack1.session = dispatch_SCONrsp_accept(stack1.session, spdu, {}); // FIXME: Use a valid CONNECT SPDU.
                } else {
                    const spdu: REFUSE_SPDU = {
                        userData: res.user_data,
                        reasonCode: res.refuse_reason,
                    };
                    stack1.session = dispatch_SCONrsp_reject(stack1.session, spdu);
                }
            },
            S_DATA: (req) => {
                const spdu: DATA_TRANSFER_SPDU = {
                    userInformation: req.user_data,
                };
                stack1.session = dispatch_SDTreq(stack1.session, spdu);
            },
            S_RELEASE: (req) => {
                const spdu: FINISH_SPDU = {
                    userData: req.user_data,
                };
                stack1.session = dispatch_SRELreq(stack1.session, spdu);
            },
            S_U_ABORT: (req) => {
                const spdu: ABORT_SPDU = {
                    userData: req.user_data,
                };
                stack1.session = dispatch_SUABreq(stack1.session, spdu);
            },
            S_P_ABORT: (req) => {
                const spdu: ABORT_SPDU = {};
                stack1.session = dispatch_SUABreq(stack1.session, spdu);
            },
        }, () => true, (a) => a[0]);
        const cp_ppdu: CP_type = new CP_type(
            new Mode_selector(Mode_selector_mode_value_normal_mode),
            undefined,
            new CP_type_normal_mode_parameters(
                undefined,
                undefined,
                undefined,
                [
                    new Context_list_Item(
                        1,
                        id_acse,
                        [
                            id_ber,
                        ],
                    ),
                    new Context_list_Item(
                        3,
                        id_random_protocol,
                        [
                            id_ber,
                        ],
                    ),
                ],
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                {
                    fully_encoded_data: [
                        new PDV_list(
                            id_ber,
                            1,
                            { // Later, this will be the ACSE APDU.
                                single_ASN1_type: new BERElement(),
                            },
                        ),
                    ],
                },
            ),
        );
        const cpa_ppdu: CPA_PPDU = new CPA_PPDU(
            new Mode_selector(Mode_selector_mode_value_normal_mode),
            undefined,
            new CPA_PPDU_normal_mode_parameters(
                undefined,
                undefined,
                [
                    new Result_list_Item(
                        Result_acceptance,
                        id_ber,
                        undefined,
                    ),
                    new Result_list_Item(
                        Result_acceptance,
                        id_ber,
                        undefined,
                    ),
                ],
                undefined,
                undefined,
                undefined,
                undefined,
                {
                    fully_encoded_data: [
                        new PDV_list(
                            undefined,
                            1,
                            { // Later, this will be the ACSE APDU.
                                single_ASN1_type: new BERElement(),
                            },
                        ),
                    ],
                },
            ),
        );
        // s1.outgoingEvents.on("CN", (spdu) => {
        //     if (spdu.userData) {
        //         const el = new BERElement();
        //         el.fromBytes(spdu.userData);
        //         const ppdu = _decode_CP_type(el);
        //         dispatch_CP(stack1.presentation, ppdu);
        //     }
        // });
        // s1.outgoingEvents.on("AC", (spdu) => {
        //     if (spdu.userData) {
        //         const el = new BERElement();
        //         el.fromBytes(spdu.userData);
        //         const ppdu = _decode_CPA_PPDU(el);
        //         dispatch_CPA(p1, cp_ppdu, ppdu);
        //     }
        // });
        // s1.outgoingEvents.on("RF_r", (spdu) => {
        //     if (spdu.userData) {
        //         const el = new BERElement();
        //         el.fromBytes(spdu.userData);
        //         const ppdu = _decode_CPR_PPDU(el);
        //         dispatch_CPR(stack1.presentation, cp_ppdu, ppdu);
        //     }
        // });
        // s1.outgoingEvents.on("RF_nr", (spdu) => {
        //     if (spdu.userData) {
        //         const el = new BERElement();
        //         el.fromBytes(spdu.userData);
        //         const ppdu = _decode_CPR_PPDU(el);
        //         dispatch_CPR(stack1.presentation, cp_ppdu, ppdu);
        //     }
        // });
        // s1.outgoingEvents.on("DT", (spdu) => {
        //     const el = new BERElement();
        //     el.fromBytes(spdu.userInformation);
        //     const ppdu = _decode_User_data(el);
        //     dispatch_TD(stack1.presentation, ppdu);
        // });
        s1.outgoingEvents.on("FN_r", (spdu) => {

        });
        s1.outgoingEvents.on("FN_r", (spdu) => {

        });
        s1.outgoingEvents.on("AB_nr", (spdu) => {

        });
        s1.outgoingEvents.on("AB_r", (spdu) => {

        });
        p1.outgoingEvents.on("P-CONind", (ppdu) => {
            dispatch_P_CONrsp_accept(stack1.presentation, ppdu, cpa_ppdu);
        });
        const stack1: OSINetworkStack = {
            network: n1,
            transport: t1,
            session: s1,
            presentation: p1,
        };

        stack1.network.on("NSDU", (nsdu) => dispatch_NSDU(stack1.transport, nsdu));
        t1.outgoingEvents.on("TSDU", (tsdu) => {
            const rc = receiveTSDU(stack1.session, tsdu);
            if (rc) {
                throw rc;
            }
        });
        t1.outgoingEvents.on("TCONind", (cr) => {
            stack1.session = dispatch_TCONind(stack1.session);
        });
        s1.outgoingEvents.on("TCONrsp", () => {
            const cc: CC_TPDU = {
                cdt: 0,
                class_option: 0,
                dstRef: 0,
                srcRef: 0,
                user_data: Buffer.alloc(0),
            };
            stack1.transport = dispatch_TCONresp(stack1.transport, cc);
        });
        s1.outgoingEvents.on("SCONind", (cn) => {
            if (cn.userData) {
                const el = new BERElement();
                el.fromBytes(cn.userData);
                const ppdu = _decode_CP_type(el);
                dispatch_CP(stack1.presentation, ppdu);
            } else {
                const ac: ACCEPT_SPDU = {};
                stack1.session = dispatch_SCONrsp_accept(stack1.session, ac, cn);
            }
        });
        s1.outgoingEvents.on("SRELind", () => {
            const dn: DISCONNECT_SPDU = {};
            stack1.session = dispatch_SRELrsp_accept(stack1.session, dn);
        });

        const socket2 = new Socket();
        const socket2write = jest.spyOn(socket2, "write");
        socket2write.mockImplementation((data: any, ...args: any[]): any => {
            n1.receiveData(data);
        });
        const n2 = new ITOTSocket(socket2);
        const t2 = createTransportConnection({
            available: () => true,
            disconnect: jest.fn(),
            max_nsdu_size: () => 10_000_000,
            open: () => true,
            openInProgress: () => false,
            transportConnectionsServed: () => 1,
            write_nsdu: (nsdu: Buffer) => n2.writeNSDU(nsdu),
        }, "SERVER");
        const s2 = newSessionConnection({
            connected: () => false,
            connect: () => {
                const tpdu: CR_TPDU = {
                    cdt: 0,
                    class_option: 0,
                    dstRef: 0,
                    srcRef: 0,
                    user_data: Buffer.alloc(0),
                };
                // const nsdu = encode_CR(tpdu);
                // t2.network.write_nsdu(nsdu);
                dispatch_TCONreq(t2, tpdu);
            },
            disconnect: jest.fn(),
            writeTSDU: (tsdu: Buffer) => dispatch_TDTreq(t2, tsdu),
        }, false, false);
        const p2 = createPresentationConnection({
            request_S_CONNECT: (req) => {
                const spdu: CONNECT_SPDU = {
                    userData: req.user_data,
                };
                stack2.session = dispatch_SCONreq(stack2.session, spdu);
            },
            respond_S_CONNECT: (res) => {
                if (res.refuse_reason === undefined) {
                    const spdu: ACCEPT_SPDU = {
                        userData: res.user_data,
                    };
                    stack2.session = dispatch_SCONrsp_accept(stack2.session, spdu, {}); // FIXME: Use a valid CONNECT SPDU.
                } else {
                    const spdu: REFUSE_SPDU = {
                        userData: res.user_data,
                        reasonCode: res.refuse_reason,
                    };
                    stack2.session = dispatch_SCONrsp_reject(stack2.session, spdu);
                }
            },
            S_DATA: (req) => {
                const spdu: DATA_TRANSFER_SPDU = {
                    userInformation: req.user_data,
                };
                stack2.session = dispatch_SDTreq(stack2.session, spdu);
            },
            S_RELEASE: (req) => {
                const spdu: FINISH_SPDU = {
                    userData: req.user_data,
                };
                stack2.session = dispatch_SRELreq(stack2.session, spdu);
            },
            S_U_ABORT: (req) => {
                const spdu: ABORT_SPDU = {
                    userData: req.user_data,
                };
                stack2.session = dispatch_SUABreq(stack2.session, spdu);
            },
            S_P_ABORT: (req) => {
                const spdu: ABORT_SPDU = {};
                stack2.session = dispatch_SUABreq(stack2.session, spdu);
            },
        }, () => true, (a) => a[0]);
        // s2.outgoingEvents.on("CN", (spdu) => {
        //     if (spdu.userData) {
        //         const el = new BERElement();
        //         el.fromBytes(spdu.userData);
        //         const ppdu = _decode_CP_type(el);
        //         dispatch_CP(stack2.presentation, ppdu);
        //     }
        // });
        // s2.outgoingEvents.on("AC", (spdu) => {
        //     if (spdu.userData) {
        //         const el = new BERElement();
        //         el.fromBytes(spdu.userData);
        //         const ppdu = _decode_CPA_PPDU(el);
        //         dispatch_CPA(stack2.presentation, cp_ppdu, ppdu);
        //     }
        // });
        // s2.outgoingEvents.on("RF_r", (spdu) => {
        //     if (spdu.userData) {
        //         const el = new BERElement();
        //         el.fromBytes(spdu.userData);
        //         const ppdu = _decode_CPR_PPDU(el);
        //         dispatch_CPR(stack2.presentation, cp_ppdu, ppdu);
        //     }
        // });
        // s2.outgoingEvents.on("RF_nr", (spdu) => {
        //     if (spdu.userData) {
        //         const el = new BERElement();
        //         el.fromBytes(spdu.userData);
        //         const ppdu = _decode_CPR_PPDU(el);
        //         dispatch_CPR(stack2.presentation, cp_ppdu, ppdu);
        //     }
        // });
        // s2.outgoingEvents.on("DT", (spdu) => {
        //     const el = new BERElement();
        //     el.fromBytes(spdu.userInformation);
        //     const ppdu = _decode_User_data(el);
        //     dispatch_TD(p2, ppdu);
        // });
        s2.outgoingEvents.on("SDTind", (spdu) => {
            const el = new BERElement();
            el.fromBytes(spdu.userInformation);
            const ppdu = _decode_User_data(el);
            dispatch_TD(stack2.presentation, ppdu);
        });
        s2.outgoingEvents.on("FN_r", (spdu) => {

        });
        s2.outgoingEvents.on("FN_r", (spdu) => {

        });
        s2.outgoingEvents.on("AB_nr", (spdu) => {

        });
        s2.outgoingEvents.on("AB_r", (spdu) => {

        });
        p2.outgoingEvents.on("P-CONind", (ppdu) => {
            dispatch_P_CONrsp_accept(stack2.presentation, ppdu, cpa_ppdu);
        });
        const stack2: OSINetworkStack = {
            network: n2,
            transport: t2,
            session: s2,
            presentation: p2,
        };

        stack2.network.on("NSDU", (nsdu) => dispatch_NSDU(stack2.transport, nsdu));
        t2.outgoingEvents.on("TSDU", (tsdu) => {
            const rc = receiveTSDU(stack2.session, tsdu);
            if (rc) {
                throw rc;
            }
        });
        t2.outgoingEvents.on("TCONind", (cr) => {
            stack2.session = dispatch_TCONind(stack2.session);
        });
        s2.outgoingEvents.on("TCONrsp", () => {
            const cc: CC_TPDU = {
                cdt: 0,
                class_option: 0,
                dstRef: 0,
                srcRef: 0,
                user_data: Buffer.alloc(0),
            };
            stack2.transport = dispatch_TCONresp(stack2.transport, cc);
        });
        s2.outgoingEvents.on("SCONind", (cn) => {
            if (cn.userData) {
                const el = new BERElement();
                el.fromBytes(cn.userData);
                const ppdu = _decode_CP_type(el);
                dispatch_CP(stack2.presentation, ppdu);
            } else {
                const ac: ACCEPT_SPDU = {};
                stack2.session = dispatch_SCONrsp_accept(stack2.session, ac, cn);
            }
        });
        s2.outgoingEvents.on("SRELind", () => {
            const dn: DISCONNECT_SPDU = {};
            stack2.session = dispatch_SRELrsp_accept(stack2.session, dn);
        });

        const cn: CONNECT_SPDU = {
            userData: Buffer.from(_encode_CP_type(cp_ppdu, BER).toBytes()),
        };
        stack2.transport.outgoingEvents.on("TCONconf", (cc) => {
            stack2.session.transport = {
                ...stack2.session.transport,
                connected: () => true,
            };
            stack2.session = dispatch_TCONcnf(stack2.session, cn);
            expect(stack2.session.state).toBe(TableA2SessionConnectionState.STA08);
        });
        stack1.transport.outgoingEvents.on("TCONconf", (cc) => {
            stack1.session.transport = {
                ...stack1.session.transport,
                connected: () => true,
            };
            stack1.session = dispatch_TCONcnf(stack1.session, cn);
            // expect(stack2.session.state).toBe(TableA2SessionConnectionState.STA01);
        });
        // stack2.session.outgoingEvents.on("SDTind", (spdu) => {
        //     const fn: FINISH_SPDU = {};
        //     stack2.session = dispatch_SRELreq(stack2.session, fn);
        // });
        stack1.session.outgoingEvents.on("SCONcnf_accept", (spdu) => {
            if (spdu.userData) {
                const el = new BERElement();
                el.fromBytes(spdu.userData);
                const ppdu = _decode_CPA_PPDU(el);
                dispatch_CPA(stack1.presentation, cp_ppdu, ppdu);
            } else {
                assert(false, "hey big boi");
            }
            // const data: DATA_TRANSFER_SPDU = {
            //     userInformation: Buffer.from(test_str),
            // };
            // stack1.session = dispatch_SDTreq(stack1.session, data);
        });
        stack1.session.outgoingEvents.once("SRELcnf_accept", () => {
            console.log("Session connection released.");
            expect(stack1.session.state).toBe(TableA2SessionConnectionState.STA01C);
            expect(stack2.session.state).toBe(TableA2SessionConnectionState.STA01C);
        });
        stack1.presentation.outgoingEvents.on("P-CONcnf+", () => {
            const ppdu: User_data = {
                fully_encoded_data: [
                    new PDV_list(
                        undefined,
                        3,
                        {
                            single_ASN1_type: _encodeUTF8String("Hi mom", BER),
                        },
                    ),
                ],
            };
            dispatch_P_DTreq(stack1.presentation, ppdu);
        });
        stack2.presentation.outgoingEvents.on("P-DTind", (ppdu) => {
            if ("fully_encoded_data" in ppdu) {
                for (const pdv of ppdu.fully_encoded_data) {
                    if ("single_ASN1_type" in pdv.presentation_data_values) {
                        console.log("Presentation layer received " +
                            pdv.presentation_data_values.single_ASN1_type.utf8String);
                    }
                }
            }
        });
        // stack1.session = dispatch_SCONreq(stack1.session, cn);
        dispatch_P_CONreq(stack1.presentation, cp_ppdu);
    });
});
