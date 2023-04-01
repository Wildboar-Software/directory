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
import {
    StrongCredentials,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/StrongCredentials.ta";
import {
    Token,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/Token.ta";
import {
    TokenContent,
    _encode_TokenContent,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/TokenContent.ta";
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
import { OBJECT_IDENTIFIER, unpackBits } from "asn1-ts";
import {
    CertificationPath,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/CertificationPath.ta";
import {
    SIGNED,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/SIGNED.ta";
import { KeyObject, sign, createSign } from "node:crypto";
import { getAlgorithmInfoFromKey } from "../crypto/getAlgorithmInfoFromKey";
import { DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";

export
async function connect (
    ctx: Context,
    hostURL: string,
    bindDN: string,
    password?: Buffer,
    protocol: OBJECT_IDENTIFIER = dap_ip["&id"]!,
    certPath?: CertificationPath,
    signingKey?: KeyObject | null,
    aeTitle?: DistinguishedName,
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
    socket.on("error", (e) => {
        console.error(e);
        process.exit(192);
    });
    socket.on("lookup", (err, addr, fam, host) => {
        if (err) {
            console.error(`Lookup error: ${err} ${addr} ${fam} ${host}`);
            process.exit(53);
        }
        ctx.log.debug(`Resolved host '${host}' to ${addr}.`);
    });
    socket.on("timeout", () => {
        console.error("Socket timeout");
        process.exit(2359);
    });
    if (url.protocol.replace(":", "").toLowerCase().endsWith("s")) {
        socket = new tls.TLSSocket(socket, {
            rejectUnauthorized: true,
        });
        // FIXME: Check .authorized!
    }
    let token: Token | undefined;
    if (signingKey && certPath && aeTitle) {
        const alg_info = getAlgorithmInfoFromKey(signingKey);
        if (alg_info) {
            const [ sig_alg_id, hash_str ] = alg_info;
            const token_content = new TokenContent(
                sig_alg_id,
                aeTitle,
                {
                    generalizedTime: new Date(),
                },
                unpackBits(crypto.randomBytes(4)),
            );
            const tbs_bytes = _encode_TokenContent(token_content, DER).toBytes();
            if (hash_str) {
                const signer = createSign(hash_str);
                signer.update(tbs_bytes);
                const signature = signer.sign(signingKey);
                token = new SIGNED(
                    token_content,
                    sig_alg_id,
                    unpackBits(signature),
                    undefined,
                    undefined,
                );
            } else {
                const signature = sign(null, tbs_bytes, signingKey);
                token = new SIGNED(
                    token_content,
                    sig_alg_id,
                    unpackBits(signature),
                    undefined,
                    undefined,
                );
            }
        }
    }

    const idm = new IDMConnection(socket);
    { // Bind
        const credentials: Credentials = token
            ? {
                strong: new StrongCredentials(
                    certPath,
                    token,
                    bindDN_,
                ),
            }
            : {
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
                             * // TODO: Expose what algorithm the DSA uses in the root DSE.
                             */
                            unprotected: password,
                        }
                        : undefined,
                ),
            };
        const pdu: IDM_PDU = {
            bind: new IdmBind(
                protocol,
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
            idm.write(encoded.toBytes());
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
