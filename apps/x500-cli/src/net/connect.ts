import type { Buffer } from "node:buffer";
import type { Context, Connection } from "../types.js";
import type { Request } from "@wildboar/x500";
import type { ResultOrError } from "@wildboar/x500";
import {
    SimpleCredentials,
    StrongCredentials,
    Token,
    TokenContent,
    _encode_TokenContent,
    DirectoryBindArgument,
    type Credentials,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    DSABindArgument,
    type DSACredentials,
} from "@wildboar/x500/DistributedOperations";
import {
    AttributeCertificationPath,
} from "@wildboar/x500/AttributeCertificateDefinitions";
import {
    CertificationPath,
    SIGNED,
} from "@wildboar/x500/AuthenticationFramework";
import { DistinguishedName } from "@wildboar/x500/InformationFramework";
import { dap_ip, dsp_ip, dop_ip, disp_ip } from "@wildboar/x500/DirectoryIDMProtocols";
import { TRUE_BIT, OBJECT_IDENTIFIER, unpackBits } from "@wildboar/asn1";
import { DER } from "@wildboar/asn1/functional";
import { KeyObject, randomBytes, sign, createSign } from "node:crypto";
import { readFile } from "node:fs/promises";
import { EventEmitter } from "node:events";
import type { TLSSocketOptions } from "node:tls";
import { strict as assert } from "node:assert";
import { addSeconds } from "date-fns";
import { URL } from "node:url";
import type { ConfigAccessPoint, ConfigDSA } from "@wildboar/x500-cli-config";
import {
    abortReasonToString,
    rejectReasonToString,
    type AsyncROSEClient,
    type BindOutcome,
} from "@wildboar/rose-transport";
import {
    create_dap_client,
    create_disp_client,
    create_dop_client,
    create_dsp_client,
    generateUnusedInvokeId,
    rose_from_url,
} from "@wildboar/x500-client-ts";
import destringifyDN from "../utils/destringifyDN.js";
import generateSimpleCredsValidity from "../utils/generateSimpleCredsValidity.js";
import { getAlgorithmInfoFromKey } from "../crypto/getAlgorithmInfoFromKey.js";

const ASSOCIATION_TIMEOUT_MS: number = 30_000;

/**
 * @summary A directory bind was attempted and the peer rejected it.
 * @description
 *
 * Thrown when `@wildboar/x500-client-ts` reports a bind error outcome, which
 * is how authentication failures are signaled on a directory association.
 */
export class DirectoryBindRejected extends Error {
    public constructor () {
        super("Directory bind was rejected.");
        this.name = "DirectoryBindRejected";
    }
}

function directoryAETitle (dn: DistinguishedName) {
    return {
        directoryName: {
            rdnSequence: dn,
        },
    };
}

function createBoundClient (
    protocol: OBJECT_IDENTIFIER,
    rose: NonNullable<ReturnType<typeof rose_from_url>>,
    credentials: Credentials,
    commonBind: {
        protocol_id: OBJECT_IDENTIFIER;
        calling_ae_title?: ReturnType<typeof directoryAETitle>;
        called_ae_title?: ReturnType<typeof directoryAETitle>;
        implementation_information: string;
        timeout: number;
    },
): {
    client: Pick<AsyncROSEClient, "request" | "unbind">;
    bind: Promise<BindOutcome<unknown>>;
} {
    const versions = new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT ]);
    if (protocol.isEqualTo(dsp_ip["&id"]!)) {
        const client = create_dsp_client(rose);
        return {
            client,
            bind: client.bind({
                ...commonBind,
                parameter: new DSABindArgument(credentials as DSACredentials, versions),
            }),
        };
    }
    if (protocol.isEqualTo(dop_ip["&id"]!)) {
        const client = create_dop_client(rose);
        return {
            client,
            bind: client.bind({
                ...commonBind,
                parameter: new DSABindArgument(credentials as DSACredentials, versions),
            }),
        };
    }
    if (protocol.isEqualTo(disp_ip["&id"]!)) {
        const client = create_disp_client(rose);
        return {
            client,
            bind: client.bind({
                ...commonBind,
                parameter: new DSABindArgument(credentials as DSACredentials, versions),
            }),
        };
    }
    const client = create_dap_client(rose);
    return {
        client,
        bind: client.bind({
            ...commonBind,
            parameter: new DirectoryBindArgument(credentials, versions),
        }),
    };
}

function bindFailureMessage (hostURL: string, outcome: BindOutcome<unknown>): string {
    if ("abort" in outcome) {
        return `Bind to ${hostURL} aborted (${abortReasonToString(outcome.abort)}).`;
    }
    if ("timeout" in outcome) {
        return `Bind to ${hostURL} timed out.`;
    }
    if ("other" in outcome) {
        const message = outcome.other.message;
        return `Bind to ${hostURL} failed${typeof message === "string" ? `: ${message}` : "."}`;
    }
    return `Bind to ${hostURL} failed.`;
}

export
async function connect (
    ctx: Context,
    dsa: ConfigDSA | undefined,
    hostURL: string,
    bindDN: string,
    password?: Buffer,
    protocol: OBJECT_IDENTIFIER = dap_ip["&id"]!,
    certPath?: CertificationPath,
    signingKey?: KeyObject | null,
    calledAETitle?: DistinguishedName,
    attrCertPath?: AttributeCertificationPath,
    callingAETitle?: DistinguishedName,
    accessPoint?: ConfigAccessPoint,
): Promise<Connection> {
    const url = new URL(hostURL);
    if (!url.port) {
        url.port = "102";
    }
    const bindDN_ = destringifyDN(ctx, bindDN ?? "");
    let token: Token | undefined;
    if (signingKey && certPath && calledAETitle) {
        const alg_info = getAlgorithmInfoFromKey(signingKey);
        if (alg_info) {
            const [ sig_alg_id, hash_str ] = alg_info;
            const token_content = new TokenContent(
                sig_alg_id,
                calledAETitle,
                {
                    generalizedTime: addSeconds(new Date(), 60),
                },
                unpackBits(randomBytes(4)),
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
    const credentials: Credentials = token
        ? {
            strong: new StrongCredentials(
                certPath,
                token,
                eeCert?.toBeSigned.subject.rdnSequence,
                attrCertPath,
            ),
        }
        : {
            simple: new SimpleCredentials(
                bindDN_,
                generateSimpleCredsValidity(),
                password
                    ? {
                        unprotected: password,
                    }
                    : undefined,
            ),
        };

    const tlsOptions: TLSSocketOptions = {
        rejectUnauthorized: accessPoint?.["insecure-skip-tls-verify"] !== true,
        ca: accessPoint?.["certificate-authority"] ?? dsa?.ca,
        crl: dsa?.crl,
        cert: dsa?.tlsCertChain
            ? await readFile(dsa.tlsCertChain, { encoding: "utf-8" })
            : undefined,
        key: dsa?.tlsKey
            ? await readFile(dsa.tlsKey, { encoding: "utf-8" })
            : undefined,
    };
    const rose = rose_from_url(url, undefined, undefined, tlsOptions, ASSOCIATION_TIMEOUT_MS);
    if (!rose) {
        throw new Error(`Unrecognized directory URL: ${url.toString()}`);
    }
    rose.socket?.on("error", (e: Error) => {
        ctx.log.debug(`Socket error while connecting to ${url.toString()}: ${e.message}`);
        // ROSE waits on "end" for bind and operation timeouts. A socket error
        // does not emit "end", so signal it to settle anything still in flight.
        rose.socket?.emit("end");
    });
    rose.socket?.on("lookup", (err, addr, fam, host) => {
        if (err) {
            ctx.log.debug(`Lookup error: ${err.message} ${addr} ${fam} ${host}`);
            return;
        }
        ctx.log.debug(`Resolved host '${host}' to ${addr}.`);
    });

    const { client, bind: bindPromise } = createBoundClient(protocol, rose, credentials, {
        protocol_id: protocol,
        calling_ae_title: callingAETitle ? directoryAETitle(callingAETitle) : undefined,
        called_ae_title: calledAETitle ? directoryAETitle(calledAETitle) : undefined,
        implementation_information: "@wildboar/x500-cli",
        timeout: ASSOCIATION_TIMEOUT_MS,
    });
    const abandon = (): void => {
        // `end` settles the in-flight bind and clears its timer. `destroy`
        // then releases the socket when the peer never sends a bind response.
        rose.socket?.emit("end");
        rose.socket?.destroy();
    };
    const outcome = await new Promise<BindOutcome<unknown>>((resolve, reject) => {
        const onError = (error: Error): void => {
            rose.socket?.off("error", onError);
            reject(error);
        };
        rose.socket?.once("error", onError);
        bindPromise.then((value) => {
            rose.socket?.off("error", onError);
            resolve(value);
        }, (error: unknown) => {
            rose.socket?.off("error", onError);
            reject(error);
        });
    }).catch((error: unknown) => {
        abandon();
        throw error;
    });

    if ("error" in outcome) {
        abandon();
        throw new DirectoryBindRejected();
    }
    if (!("result" in outcome)) {
        abandon();
        throw new Error(bindFailureMessage(hostURL, outcome));
    }

    const ret: Connection = {
        writeOperation: async (req: Omit<Request, "invokeId">): Promise<ResultOrError> => {
            assert(req.opCode);
            assert(req.argument);
            const invokeID: number = generateUnusedInvokeId();
            const operation = await client.request({
                invoke_id: {
                    present: invokeID,
                },
                code: req.opCode,
                parameter: req.argument,
            });
            if ("result" in operation) {
                return {
                    invokeId: {
                        present: invokeID,
                    },
                    opCode: req.opCode,
                    result: operation.result.parameter,
                };
            }
            if ("error" in operation) {
                return {
                    invokeId: operation.error.invoke_id,
                    errcode: operation.error.code,
                    error: operation.error.parameter,
                };
            }
            ret.events.emit("error", undefined);
            if ("reject" in operation) {
                throw new Error(`Directory operation rejected (${rejectReasonToString(operation.reject.problem)}).`);
            }
            if ("abort" in operation) {
                throw new Error(`Directory association aborted (${abortReasonToString(operation.abort)}).`);
            }
            if ("timeout" in operation) {
                throw new Error("Directory operation timed out.");
            }
            throw new Error("Directory operation failed.");
        },
        close: async (): Promise<void> => {
            await client.unbind({
                timeout: 2_000,
                disconnectSocket: true,
            });
            rose.socket?.destroy();
        },
        events: new EventEmitter(),
    };
    rose.events.on("abort", () => {
        ret.events.emit("error", undefined);
    });
    return ret;
}

export default connect;
