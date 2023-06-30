import {
    DSPClient,
    DOPClient,
    create_dsp_client,
    create_dop_client,
    create_disp_client,
    rose_from_presentation_address,
    DISPClient,
} from "@wildboar/x500-client-ts";
import { MeerkatContext } from "../ctx";
import {
    id_ac_directorySystemAC,
} from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/id-ac-directorySystemAC.va";
import {
    id_ac_directoryOperationalBindingManagementAC,
} from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/id-ac-directoryOperationalBindingManagementAC.va";
// import {
//     id_ac_shadowConsumerInitiatedAC,
// } from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/id-ac-shadowConsumerInitiatedAC.va";
// import {
//     id_ac_shadowConsumerInitiatedAsynchronousAC,
// } from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/id-ac-shadowConsumerInitiatedAsynchronousAC.va";
// import {
//     id_ac_shadowSupplierInitiatedAC,
// } from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/id-ac-shadowSupplierInitiatedAC.va";
// import {
//     id_ac_shadowSupplierInitiatedAsynchronousAC,
// } from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/id-ac-shadowSupplierInitiatedAsynchronousAC.va";
import {
    DSABindArgument,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/DSABindArgument.ta";
import { versions } from "../versions";
import { naddrToURI } from "@wildboar/x500";
import { BOOLEAN, OBJECT_IDENTIFIER } from "asn1-ts";
import {
    AccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import {
    ClientAssociation,
    AbandonError,
    OperationInvocationInfo,
} from "@wildboar/meerkat-types";
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    PresentationAddress,
} from "@wildboar/pki-stub/src/lib/modules/SelectedAttributeTypes/PresentationAddress.ta";
import {
    AbandonedData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonedData.ta";
import {
    abandoned,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/abandoned.oa";
import { ROSETransport, AsyncROSEClient } from "@wildboar/rose-transport";
import { createStrongCredentials } from "../authn/createStrongCredentials";
import getCredentialsForNSAP from "./getCredentialsForNSAP";
import { DSACredentials } from "@wildboar/x500/src/lib/modules/DistributedOperations/DSACredentials.ta";
import { getOnOCSPResponseCallback } from "../pki/getOnOCSPResponseCallback";
import { addMilliseconds, differenceInMilliseconds } from "date-fns";
import { URL } from "node:url";
import { Socket, createConnection } from "node:net";
import { connect as tlsConnect, TLSSocket } from "node:tls";
import isDebugging from "is-debugging";
import stringifyDN from "../x500/stringifyDN";
import { DSABindResult } from "@wildboar/x500/src/lib/modules/DistributedOperations/DSABindResult.ta";
import { createWriteStream } from "node:fs";

const DEFAULT_CONNECTION_TIMEOUT_IN_MS: number = 15 * 1000;

// Currently, only MySQL is supported, but this includes more database protocols
// just for a little future-proofing.
const DEFAULT_DBMS_PORTS: Record<string, string> = {
    "mysql": "3306",
    "postgresql": "5432",
    "postgres": "5432",
    "mssql": "1433",
    "sqlserver": "1433",
    "mongodb": "27017",
};

async function dsa_bind <ClientType extends AsyncROSEClient<DSABindArgument, DSABindResult>> (
    ctx: MeerkatContext,
    assn: ClientAssociation | undefined,
    protocol_id: OBJECT_IDENTIFIER,
    client_getter: (rose: ROSETransport) => ClientType,
    op: OperationInvocationInfo | undefined,
    accessPoint: AccessPoint,
    aliasDereferenced?: BOOLEAN,
    signErrors: boolean = false,
    timeLimit: number | Date = 30_000,
): Promise<ClientType | null> {
    const logInfo = {
        protocol_id: protocol_id.toString(),
        association_id: assn?.id,
        op: op?.invokeId.toString(),
        aliasDereferenced,
        signErrors,
        timeLimit,
        dsa_version: ctx.dsa.version,
    };
    const startTime = new Date();
    const timeoutTime: Date = (timeLimit instanceof Date)
        ? timeLimit
        : addMilliseconds(startTime, Math.max(timeLimit ?? DEFAULT_CONNECTION_TIMEOUT_IN_MS, 500));
    let timeRemaining: number = Math.abs(differenceInMilliseconds(new Date(), timeoutTime));
    for (let i = 0; i < accessPoint.address.nAddresses.length; i++) {
        const naddr = accessPoint.address.nAddresses[i];
        if (op?.abandonTime) {
            op.events.emit("abandon");
            throw new AbandonError(
                ctx.i18n.t("err:abandoned"),
                new AbandonedData(
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn?.boundNameAndUID?.dn,
                        undefined,
                        abandoned["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
        const uriString = naddrToURI(naddr);
        if (!uriString) {
            ctx.log.warn(ctx.i18n.t("log:could_not_convert_naddr_to_url", {
                aet: stringifyDN(ctx, accessPoint.ae_title.rdnSequence),
                i,
            }), logInfo);
            continue;
        }
        logInfo["destination_url"] = uriString;
        try { // We do not want a crash just for logging.
            logInfo["destination_aet"] = stringifyDN(ctx, accessPoint.ae_title.rdnSequence);
        } catch { /* NOOP */ }
        const url = new URL(uriString);
        /**
         * This section exists to prevent a security vulnerability where this
         * DSA could be tricked into chaining requests to the database. Such
         * requests will probably get interpreted by the database as corrupt
         * packets and thereby have no negative consequences, but the
         * possibility still must be addressed.
         *
         * Furthermore, Meerkat DSA cannot rely on use of network policy by
         * DSA administrators, because the database must be accessible, so there
         * is no way at the network-level to prevent chained requests from being
         * sent to the database.
         *
         * Finally, so as to avoid revealing the port of the database, this
         * implementation simply returns `null`, which will look like a normal
         * failure to connect to the caller, rather than returning an error
         * that makes it obvious that the connectivity was rejected. A TCP port
         * number is not generally a big secret, but if Meerkat DSA supports
         * multiple DBMSes in the future, the port used could reveal what DBMS
         * is in use.
         */
        if (uriString && process.env.DATABASE_URL) {
            try {
                const dbURL = new URL(process.env.DATABASE_URL);
                const dbPort = dbURL.port || DEFAULT_DBMS_PORTS[dbURL.protocol.replace(":", "").toLowerCase()];
                if (dbPort === url.port) {
                    ctx.log.warn(ctx.i18n.t("log:will_not_bind_to_db_port", {
                        aid: assn?.id ?? "?",
                        uri: uriString,
                    }), logInfo);
                    continue;
                }
            } catch {
                ctx.log.warn(ctx.i18n.t("log:will_not_bind_to_db_port", {
                    aid: assn?.id ?? "?",
                    uri: uriString,
                }), logInfo);
                continue;
            }
        }
        ctx.log.debug(ctx.i18n.t("log:trying_naddr", {
            uri: uriString ?? "<FAILED TO DECODE NETWORK ADDRESS>",
        }), logInfo);
        const paddr = new PresentationAddress(
            accessPoint.address.pSelector,
            accessPoint.address.sSelector,
            accessPoint.address.tSelector,
            [naddr],
        );
        timeRemaining = Math.abs(differenceInMilliseconds(new Date(), timeoutTime));
        const usingImplicitTLSProtocol: boolean = url
            .protocol
            .replace(":", "")
            .toLowerCase()
            .endsWith("s");

        const socket: Socket | TLSSocket = usingImplicitTLSProtocol
            ? tlsConnect({
                ...ctx.config.tls,
                pskCallback: undefined,
                rejectUnauthorized: ctx.config.tls.rejectUnauthorizedServers,
                host: url.hostname,
                port: Number.parseInt(url.port, 10),
                timeout: timeRemaining,
            })
            : createConnection({
                host: url.hostname,
                port: Number.parseInt(url.port, 10),
                timeout: timeRemaining,
            });

        if (socket instanceof TLSSocket) {
            socket.once("secureConnect", () => {
                if (!socket.authorized && ctx.config.tls.rejectUnauthorizedServers) {
                    socket.destroy(); // Destroy for immediate and complete denial.
                    ctx.log.warn(ctx.i18n.t("err:tls_auth_failure", {
                        url: uriString,
                        e: socket.authorizationError,
                    }), logInfo);
                    if (isDebugging && socket.authorizationError) {
                        console.error(socket.authorizationError);
                    }
                }
            });
            socket.once("OCSPResponse", getOnOCSPResponseCallback(ctx, (valid, code) => {
                ctx.log.warn(ctx.i18n.t("log:ocsp_response_invalid", {
                    code,
                    aet: stringifyDN(ctx, accessPoint.ae_title.rdnSequence),
                }));
                if (!valid) {
                    socket.end();
                }
            }));
            if (ctx.config.tls.log_tls_secrets) {
                socket.on("keylog", (line) => {
                    ctx.log.debug(ctx.i18n.t("log:keylog", {
                        peer: uriString,
                        key: line.toString("latin1"),
                    }));
                });
            }
            if (ctx.config.tls.sslkeylog_file) {
                const keylogFile = createWriteStream(ctx.config.tls.sslkeylog_file, { flags: "a" });
                socket.on("keylog", (line) => keylogFile.write(line));
            }
        }

        const rose = rose_from_presentation_address(paddr, socket, {
            ...ctx.config.tls,
            rejectUnauthorized: ctx.config.tls.rejectUnauthorizedServers,
            isServer: false,
        }, timeRemaining);
        if (!rose) {
            ctx.log.debug(ctx.i18n.t("log:could_not_create_rose_client", {
                url: uriString,
            }), logInfo);
            continue;
        }

        let tls_in_use: boolean = !!rose.socket && (rose.socket instanceof TLSSocket);
        if (!tls_in_use) {
            ctx.log.debug(ctx.i18n.t("log:attempting_starttls", {
                uri: uriString,
            }), logInfo);
            timeRemaining = Math.abs(differenceInMilliseconds(new Date(), timeoutTime));
            const tls_response = await rose.startTLS?.({
                timeout: timeRemaining,
            });
            if (tls_response) {
                if ("response" in tls_response) {
                    if (tls_response.response === 0) {
                        rose.events.once("tls_socket", (tlsSocket) => {
                            if (ctx.config.tls.log_tls_secrets) {
                                tlsSocket.on("keylog", (line) => {
                                    ctx.log.debug(ctx.i18n.t("log:keylog", {
                                        peer: uriString,
                                        key: line.toString("latin1"),
                                    }));
                                });
                            }
                            if (ctx.config.tls.sslkeylog_file) {
                                const keylogFile = createWriteStream(ctx.config.tls.sslkeylog_file, { flags: "a" });
                                tlsSocket.on("keylog", (line) => keylogFile.write(line));
                            }
                            tlsSocket.once("secureConnect", () => {
                                if (!tlsSocket.authorized && ctx.config.tls.rejectUnauthorizedServers) {
                                    tlsSocket.destroy(); // Destroy for immediate and complete denial.
                                    ctx.log.warn(ctx.i18n.t("err:tls_auth_failure", {
                                        url: uriString,
                                        e: tlsSocket.authorizationError,
                                    }));
                                    if (isDebugging && tlsSocket.authorizationError) {
                                        console.error(tlsSocket.authorizationError);
                                    }
                                }
                            });
                            tlsSocket.once("OCSPResponse", getOnOCSPResponseCallback(ctx, (valid, code) => {
                                ctx.log.warn(ctx.i18n.t("log:ocsp_response_invalid", {
                                    code,
                                    aet: stringifyDN(ctx, accessPoint.ae_title.rdnSequence),
                                }));
                                if (!valid) {
                                    socket.end();
                                }
                            }));
                            rose.socket = tlsSocket;
                        });
                        await new Promise<void>((resolve, reject) => {
                            rose.events.once("tls", resolve);
                            rose.events.once("error_", reject);
                        });
                        tls_in_use = true;
                        ctx.log.debug(ctx.i18n.t("log:start_tls_result_received", {
                            url: uriString,
                            context: "accepted",
                        }), logInfo);
                    } else {
                        ctx.log.debug(ctx.i18n.t("log:start_tls_result_received", {
                            url: uriString,
                            reason: tls_response.response,
                            context: "rejected",
                        }), logInfo);
                        if (!ctx.config.chaining.tlsOptional) {
                            continue;
                        }
                    }
                } else if ("not_supported_locally" in tls_response) {
                    ctx.log.debug(ctx.i18n.t("log:start_tls_not_supported_locally", {
                        url: uriString,
                    }), logInfo);
                    // Do not log a message, since this can be inferred from the URL.
                } else if ("already_in_use" in tls_response) {
                    // Do not log a message, since this can be inferred from the URL.
                    ctx.log.debug(ctx.i18n.t("log:start_tls_already_in_use", {
                        url: uriString,
                    }), logInfo);
                } else if ("abort" in tls_response) {
                    const reason = tls_response.abort;
                    ctx.log.debug(ctx.i18n.t("log:start_tls_abort_received", {
                        url: uriString,
                        reason,
                    }), logInfo);
                } else if ("timeout" in tls_response) {
                    ctx.log.debug(ctx.i18n.t("log:start_tls_timeout_received", {
                        url: uriString,
                    }), logInfo);
                    return null;
                } else {
                    ctx.log.debug(ctx.i18n.t("log:start_tls_other_received", {
                        url: uriString,
                        e: JSON.stringify(tls_response.other),
                    }), logInfo);
                    continue;
                }
            }
        }

        if (!tls_in_use && !ctx.config.chaining.tlsOptional) {
            if (!ctx.config.chaining.tlsOptional) {
                ctx.log.debug(ctx.i18n.t("log:starttls_error", {
                    uri: uriString,
                    context: "tls_required",
                }), logInfo);
                continue;
            }
        }

        const c: ClientType = client_getter(rose);
        const strongCredData = createStrongCredentials(ctx, accessPoint.ae_title.rdnSequence);
        if (!strongCredData) {
            ctx.log.warn(ctx.i18n.t("log:could_not_create_strong_creds", { url: uriString }), logInfo);
        }
        const extraCredentials: DSACredentials[] = uriString
            ? await getCredentialsForNSAP(ctx, uriString.toString())
            : [];
        const otherCreds: (DSACredentials | undefined)[] = [
            ...extraCredentials,
            // By adding `undefined` to the end of this array, we try one time without authentication.
            undefined,
        ];
        const credentials: (DSACredentials | undefined)[] = strongCredData
            ? [
                {
                    strong: strongCredData,
                },
                ...otherCreds,
            ]
            : otherCreds;
        for (const cred of credentials) {
            timeRemaining = Math.abs(differenceInMilliseconds(new Date(), timeoutTime));
            const bind_response = await c.bind({
                protocol_id,
                parameter: new DSABindArgument(
                    cred,
                    versions,
                ),
                calling_ae_title: {
                    directoryName: ctx.dsa.accessPoint.ae_title,
                },
                calling_ap_invocation_identifier: process.pid,
                called_ae_title: {
                    directoryName: accessPoint.ae_title,
                },
                implementation_information: "Meerkat DSA",
                timeout: timeRemaining,
            });
            if ("result" in bind_response) {
                ctx.log.debug(ctx.i18n.t("log:bind_result_received", {
                    url: uriString,
                }), logInfo);
                break;
            } else if ("error" in bind_response) {
                ctx.log.debug(ctx.i18n.t("log:bind_error_received", {
                    url: uriString,
                    hex: Buffer.from(bind_response.error.parameter.toBytes())
                        .subarray(0, 100)
                        .toString("hex"),
                }), logInfo);
            } else if ("timeout" in bind_response) {
                ctx.log.debug(ctx.i18n.t("log:bind_timeout_received", {
                    url: uriString,
                }), logInfo);
                return null;
            } else if ("abort" in bind_response) {
                ctx.log.debug(ctx.i18n.t("log:bind_abort_received", {
                    url: uriString,
                }), logInfo);
            } else {
                ctx.log.debug(ctx.i18n.t("log:bind_other_received", {
                    url: uriString,
                    e: JSON.stringify(bind_response.other),
                }), logInfo);
            }
        }
        if (!rose.is_bound) {
            continue;
        }
        ctx.log.info(ctx.i18n.t("log:bound_to_naddr", {
            uri: uriString,
        }), logInfo);
        return c;
    }
    return null;
}

export
async function bindForChaining (
    ctx: MeerkatContext,
    assn: ClientAssociation | undefined,
    op: OperationInvocationInfo | undefined,
    accessPoint: AccessPoint,
    aliasDereferenced?: BOOLEAN,
    signErrors: boolean = false,
): Promise<DSPClient | null> {
    return dsa_bind(
        ctx,
        assn,
        id_ac_directorySystemAC,
        create_dsp_client,
        op,
        accessPoint,
        aliasDereferenced,
        signErrors,
    );
}

export
async function bindForOBM (
    ctx: MeerkatContext,
    assn: ClientAssociation | undefined,
    op: OperationInvocationInfo | undefined,
    accessPoint: AccessPoint,
    aliasDereferenced?: BOOLEAN,
    signErrors: boolean = false,
): Promise<DOPClient | null> {
    return dsa_bind(
        ctx,
        assn,
        id_ac_directoryOperationalBindingManagementAC,
        create_dop_client,
        op,
        accessPoint,
        aliasDereferenced,
        signErrors,
    );
}

export
async function bindForDISP (
    ctx: MeerkatContext,
    assn: ClientAssociation | undefined,
    op: OperationInvocationInfo | undefined,
    accessPoint: AccessPoint,
    applicationContext: OBJECT_IDENTIFIER,
    aliasDereferenced?: BOOLEAN,
    signErrors: boolean = false,
): Promise<DISPClient | null> {
    return dsa_bind(
        ctx,
        assn,
        applicationContext,
        create_disp_client,
        op,
        accessPoint,
        aliasDereferenced,
        signErrors,
    );
}
