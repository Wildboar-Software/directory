import type { Context, Connection } from "../types";
import {
    IDM_PDU,
    _encode_IDM_PDU,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IDM-PDU.ta";
import {
    IdmBind,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IdmBind.ta";
import {
    Request as IdmRequest,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/Request.ta";
import {
    DSABindArgument,
    _encode_DSABindArgument,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/DSABindArgument.ta";
import type {
    Credentials,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/Credentials.ta";
import {
    SimpleCredentials,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SimpleCredentials.ta";
import type { Request } from "@wildboar/x500/src/lib/types/Request";
import type { ResultOrError } from "@wildboar/x500/src/lib/types/ResultOrError";
import * as net from "net";
import * as tls from "tls";
import { EventEmitter } from "stream";
import { IDMConnection } from "@wildboar/idm";
import { URL } from "url";
import * as crypto from "crypto";
import destringifyDN from "../utils/destringifyDN";
import generateSimpleCredsValidity from "../utils/generateSimpleCredsValidity";
import { dap_ip } from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dap-ip.oa";
import { strict as assert } from "assert";
import { DER } from "asn1-ts/dist/node/functional";

export
async function connect (
    ctx: Context,
    hostURL: string,
    bindDN: string,
    password?: Buffer,
    // TODO: Config file
): Promise<Connection | undefined> {
    const bindDN_ = destringifyDN(ctx, bindDN ?? "");
    const url = new URL(hostURL);
    let socket = net.createConnection({
        host: url.hostname,
        port: url.port
            ? Number.parseInt(url.port)
            : 102,
    });
    if (url.protocol.toLowerCase().endsWith("s")) {
        socket = new tls.TLSSocket(socket);
    }
    const idm = new IDMConnection(socket);
    { // Bind
        const credentials: Credentials = {
            simple: new SimpleCredentials(
                bindDN_,
                generateSimpleCredsValidity(),
                password
                    ? {
                        /**
                         * It seems like the password must be transmitted in the
                         * clear, because there is no way for us to know how the
                         * DSA stores passwords.
                         *
                         * // TODO: Allow user to specify hashing algorithm.
                         * // TODO: Expose what algorithm the DSA users in the root DSE.
                         */
                        unprotected: password,
                    }
                    : undefined,
            ),
        };
        const pdu: IDM_PDU = {
            bind: new IdmBind(
                dap_ip["&id"]!,
                {
                    directoryName: {
                        rdnSequence: [], // FIXME:
                    },
                },
                {
                    directoryName: {
                        rdnSequence: [], // FIXME:
                    },
                },
                _encode_DSABindArgument(new DSABindArgument(
                    credentials,
                    undefined, // v1
                ), DER),
            ),
        };
        const encoded = _encode_IDM_PDU(pdu, DER);
        await new Promise((resolve, reject) => {
            idm.events.once("bindError", (err) => {
                reject(err);
            });
            idm.events.once("bindResult", (result) => {
                resolve(result);
            });
            idm.write(encoded.toBytes(), 0);
        });
    }
    const ret: Connection = {
        writeOperation: async (req: Omit<Request, "invokeId">): Promise<ResultOrError> => {
            assert(req.opCode);
            assert(req.argument);
            const invokeID: number = crypto.randomInt(2147483648);
            const pdu: IDM_PDU = {
                request: new IdmRequest(invokeID, req.opCode, req.argument),
            };
            const encoded = _encode_IDM_PDU(pdu, DER);
            return new Promise((resolve) => {
                idm.events.on(invokeID.toString(), (roe: ResultOrError) => {
                    if ("error" in roe) {
                        resolve(roe);
                    } else {
                        resolve({
                            invokeId: {
                                present: invokeID,
                            },
                            opCode: req.opCode,
                            result: roe.result,
                        });
                    }
                });
                idm.write(encoded.toBytes(), 0);
            });
        },
        close: async (): Promise<void> => {
            idm.close();
        },
        events: new EventEmitter(),
    };
    // idm.events.on("error_", (e) => {
    //     console.error(e);
    //     ret.events.emit("error", undefined);
    // });
    idm.events.on("reject", () => {
        ret.events.emit("error", undefined);
        // console.log("REJECTED.");
    });
    idm.events.on("abort", () => {
        ret.events.emit("error", undefined);
        // console.log("ABORTED.");
    });
    return ret;
}

export default connect;
