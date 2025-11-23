import type { Connection } from "./types";
import {
    IDM_PDU,
    _encode_IDM_PDU,
} from "@wildboar/x500/IDMProtocolSpecification";
import {
    IdmBind,
} from "@wildboar/x500/IDMProtocolSpecification";
import {
    Request as IdmRequest,
} from "@wildboar/x500/IDMProtocolSpecification";
import {
    DSABindArgument,
    _encode_DSABindArgument,
} from "@wildboar/x500/DistributedOperations";
import type {
    Credentials,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    SimpleCredentials,
} from "@wildboar/x500/DirectoryAbstractService";
import type {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import type { Request } from "@wildboar/x500";
import type { ResultOrError } from "@wildboar/x500";
import * as net from "net";
import * as tls from "tls";
import { EventEmitter } from "node:events";
import { IDMConnection } from "@wildboar/idm";
import { URL } from "url";
import * as crypto from "crypto";
import { dap_ip } from "@wildboar/x500/DirectoryIDMProtocols";
import { strict as assert } from "assert";
import { DER } from "@wildboar/asn1/functional";
import printCode from "./printCode";

export
async function connect (
    hostURL: string,
    bindDN: DistinguishedName,
    password?: Buffer,
): Promise<Connection | undefined> {
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
                bindDN,
                undefined,
                password
                    ? {
                        unprotected: password,
                    }
                    : undefined,
            ),
        };
        await new Promise((resolve, reject) => {
            idm.events.once("bindError", (err) => {
                reject(err);
            });
            idm.events.once("bindResult", (result) => {
                resolve(result);
            });
            idm.writeBind(
                dap_ip["&id"]!,
                _encode_DSABindArgument(new DSABindArgument(
                    credentials,
                    undefined, // v1
                ), DER),
            );
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
                idm.write(encoded.toBytes());
            });
        },
        close: async (): Promise<void> => {
            idm.close();
        },
        events: new EventEmitter(),
    };
    idm.events.on("error_", (e) => {
        console.error(`Invocation ${e.invokeID} returned an error with code ${printCode(e.errcode)}`);
        console.error(`Error parameter: ${Buffer.from(e.error.toBytes()).toString("hex")}`);
        // process.exit(34);
    });
    idm.events.on("reject", (r) => {
        console.error(`Invocation ${r.invokeID} rejected with reason: ${r.reason}`);
        process.exit(46);
    });
    idm.events.on("abort", (a) => {
        console.error(`Association aborted with reason: ${a}`);
        process.exit(57);
    });
    return ret;
}

export default connect;
