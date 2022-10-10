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
} from "./session";
import { Socket } from "node:net";

jest.mock("node:net");

export
interface OSINetworkStack {
    network: ITOTSocket,
    transport: TransportConnection,
    session: SessionServiceConnectionState,
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
        const stack1: OSINetworkStack = {
            network: n1,
            transport: t1,
            session: s1,
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
            const ac: ACCEPT_SPDU = {};
            stack1.session = dispatch_SCONrsp_accept(stack1.session, ac, cn);
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
        const stack2: OSINetworkStack = {
            network: n2,
            transport: t2,
            session: s2,
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
            const ac: ACCEPT_SPDU = {};
            stack2.session = dispatch_SCONrsp_accept(stack2.session, ac, cn);
        });
        s2.outgoingEvents.on("SRELind", () => {
            const dn: DISCONNECT_SPDU = {};
            stack2.session = dispatch_SRELrsp_accept(stack2.session, dn);
        });

        const cn: CONNECT_SPDU = {};
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
            expect(stack2.session.state).toBe(TableA2SessionConnectionState.STA01);
        });
        const test_str = "Hello world";
        stack2.session.outgoingEvents.on("SDTind", (spdu) => {
            const received = spdu.userInformation.toString("utf-8");
            console.log(received);
            expect(received).toBe(test_str);
            const fn: FINISH_SPDU = {};
            stack2.session = dispatch_SRELreq(stack2.session, fn);
        });
        stack1.session.outgoingEvents.on("SCONcnf_accept", () => {
            const data: DATA_TRANSFER_SPDU = {
                userInformation: Buffer.from(test_str),
            };
            stack1.session = dispatch_SDTreq(stack1.session, data);
        });
        stack1.session.outgoingEvents.once("SRELcnf_accept", () => {
            console.log("Session connection released.");
            expect(stack1.session.state).toBe(TableA2SessionConnectionState.STA01C);
            expect(stack2.session.state).toBe(TableA2SessionConnectionState.STA01C);
        });
        stack1.session = dispatch_SCONreq(stack1.session, cn);
    });
});
