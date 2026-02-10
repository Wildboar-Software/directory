import type { Buffer } from "node:buffer";
import type { Context, Connection } from "../types.js";
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
import {
    StrongCredentials,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    AttributeCertificationPath,
} from "@wildboar/x500/AttributeCertificateDefinitions";
import {
    CertificationData,
    SPKM_REQ,
} from "@wildboar/x500/SpkmGssTokens";
import {
    REQ_TOKEN, Req_contents, _encode_Req_contents,
} from "@wildboar/x500/SpkmGssTokens";
import {
    Token,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    TokenContent,
    _encode_TokenContent,
} from "@wildboar/x500/DirectoryAbstractService";
import type { Request } from "@wildboar/x500";
import type { ResultOrError } from "@wildboar/x500";
import * as net from "node:net";
import * as tls from "node:tls";
import { EventEmitter } from "node:events";
import { IDMConnection } from "@wildboar/idm";
import { URL } from "node:url";
import * as crypto from "node:crypto";
import destringifyDN from "../utils/destringifyDN.js";
import generateSimpleCredsValidity from "../utils/generateSimpleCredsValidity.js";
import { dap_ip } from "@wildboar/x500/DirectoryIDMProtocols";
import { strict as assert } from "node:assert";
import { DER } from "@wildboar/asn1/functional";
import { OBJECT_IDENTIFIER, TRUE_BIT, unpackBits } from "@wildboar/asn1";
import {
    CertificationPath,
} from "@wildboar/x500/AuthenticationFramework";
import {
    SIGNED,
} from "@wildboar/x500/AuthenticationFramework";
import { KeyObject, sign, createSign } from "node:crypto";
import { getAlgorithmInfoFromKey } from "../crypto/getAlgorithmInfoFromKey.js";
import { DistinguishedName } from "@wildboar/x500/InformationFramework";
import { addSeconds, addYears } from "date-fns";
import { Name } from "@wildboar/pki-stub";
import { Context_Data } from "@wildboar/x500/SpkmGssTokens";
import { Validity } from "@wildboar/pki-stub";
import {
    CertificationPath as SpkmCertificationPath,
} from "@wildboar/x500/SpkmGssTokens";
import { ConfigDSA } from "@wildboar/x500-cli-config";
import { readFile } from "node:fs/promises";

// I created this function for testing SPKM auth. Tested and works.
// I am keeping this around in case I want to integrate it later.
function createSpkmCreds (
    certPath: CertificationPath,
    signingKey: KeyObject,
    targ_name: Name,
): SPKM_REQ | null {
    const subjectName = certPath.userCertificate.toBeSigned.subject;
    const alg_info = getAlgorithmInfoFromKey(signingKey);
    if (!alg_info) {
        return null;
    }
    const req_contents = new Req_contents(
        256,
        unpackBits(crypto.randomBytes(4)),
        new Uint8ClampedArray([ TRUE_BIT ]),
        new Date(),
        unpackBits(crypto.randomBytes(4)),
        targ_name,
        subjectName,
        new Context_Data(
            undefined,
            undefined,
            new Uint8ClampedArray([

            ]),
            {
                null_: null,
            },
            [],
            [],
        ),
        new Validity(
            { generalizedTime: new Date() },
            { generalizedTime: addYears(new Date(), 1) },
        ),
        [],
        undefined,
        undefined,
    );

    const [ sig_alg_id, hash_str ] = alg_info;
    const tbs_bytes = _encode_Req_contents(req_contents, DER).toBytes();
    let token: REQ_TOKEN | undefined;
    if (hash_str) {
        const signer = createSign(hash_str);
        signer.update(tbs_bytes);
        const signature = signer.sign(signingKey);
        token = new REQ_TOKEN(
            req_contents,
            sig_alg_id,
            unpackBits(signature),
        );
    } else {
        const signature = sign(null, tbs_bytes, signingKey);
        token = new REQ_TOKEN(
            req_contents,
            sig_alg_id,
            unpackBits(signature),
        );
    }
    if (!token) {
        return null;
    }
    return new SPKM_REQ(
        token,
        new CertificationData(
            new SpkmCertificationPath(
                undefined,
                certPath.userCertificate,
                undefined,
                undefined,
                certPath.theCACertificates,
            ),
        ),
        undefined,
    );
}

export
async function connect (
    ctx: Context,
    dsa: ConfigDSA,
    hostURL: string,
    bindDN: string,
    password?: Buffer,
    protocol: OBJECT_IDENTIFIER = dap_ip["&id"]!,
    certPath?: CertificationPath,
    signingKey?: KeyObject | null,
    aeTitle?: DistinguishedName,
    attrCertPath?: AttributeCertificationPath,
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
            ca: dsa.ca,
            crl: dsa.crl,
            cert: dsa.tlsCertChain
                ? await readFile(dsa.tlsCertChain, { encoding: "utf-8" })
                : undefined,
            key: dsa.tlsKey
                ? await readFile(dsa.tlsKey, { encoding: "utf-8" })
                : undefined,
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
                    generalizedTime: addSeconds(new Date(), 60),
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

    const eeCert = certPath?.userCertificate;
    const idm = new IDMConnection(socket);
    { // Bind
        // const spkmCreds = certPath
        //     && signingKey
        //     && aeTitle
        //     && createSpkmCreds(certPath, signingKey, { rdnSequence: aeTitle });
        const credentials: Credentials = token
            ? {
                strong: new StrongCredentials(
                    certPath,
                    token,
                    eeCert?.toBeSigned.subject.rdnSequence,
                    attrCertPath,
                ),
                // spkm: {
                //     req: spkmCreds,
                // }
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
                    // {
                    //     externalProcedure: new External(
                    //         ObjectIdentifier.fromParts([ 1, 3, 6, 1, 4, 1, 56490, 401, 1 ]),
                    //         undefined,
                    //         undefined,
                    //         _encodeNull(null, DER),
                    //     ),
                    // },
                    new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT ]), // v1 and v2
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
