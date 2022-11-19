import {
    DSPClient,
    DOPClient,
    create_dsp_client,
    create_dop_client,
    rose_from_presentation_address,
} from "@wildboar/x500-client-ts";
import { MeerkatContext } from "../ctx";
import {
    id_ac_directorySystemAC,
} from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/id-ac-directorySystemAC.va";
import {
    id_ac_directoryOperationalBindingManagementAC,
} from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/id-ac-directoryOperationalBindingManagementAC.va";
import {
    DSABindArgument,
    _encode_DSABindArgument,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/DSABindArgument.ta";
import { versions } from "../versions";
import { TLSSocket } from "tls";
import { naddrToURI } from "@wildboar/x500";
import { BOOLEAN, OBJECT_IDENTIFIER } from "asn1-ts";
import { DER } from "asn1-ts/dist/node/functional";
import type {
    AccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import { ClientAssociation, AbandonError, OperationInvocationInfo } from "@wildboar/meerkat-types";
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

const DEFAULT_CONNECTION_TIMEOUT_IN_MS: number = 15 * 1000;

async function dsa_bind <ClientType extends AsyncROSEClient> (
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
    const startTime = new Date();
    const timeoutTime: Date = (timeLimit instanceof Date)
        ? timeLimit
        : addMilliseconds(startTime, Math.max(timeLimit ?? DEFAULT_CONNECTION_TIMEOUT_IN_MS, 500));
    let timeRemaining: number = Math.abs(differenceInMilliseconds(new Date(), timeoutTime));
    for (const naddr of accessPoint.address.nAddresses) {
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
        const uri = naddrToURI(naddr);
        ctx.log.debug(ctx.i18n.t("log:trying_naddr", {
            uri,
        }), {
            dest: uri,
        });
        const paddr = new PresentationAddress(
            accessPoint.address.pSelector,
            accessPoint.address.sSelector,
            accessPoint.address.tSelector,
            [naddr],
        );
        const rose = rose_from_presentation_address(paddr, {
            ...ctx.config.tls,
            rejectUnauthorized: ctx.config.tls.rejectUnauthorizedServers,
        });
        if (!rose) {
            continue;
        }
        rose.socket!.once("OCSPResponse", getOnOCSPResponseCallback(ctx, (valid) => {
            // TODO: Log information with code parameter.
            if (!valid) {
                rose.socket!.end();
            }
        }));

        let tls_in_use: boolean = !!rose.socket && (rose.socket instanceof TLSSocket);
        if (!tls_in_use) {
            ctx.log.debug(ctx.i18n.t("log:attempting_starttls", {
                uri,
            }), {
                dest: uri,
            });
            timeRemaining = Math.abs(differenceInMilliseconds(new Date(), timeoutTime));
            const tls_response = await rose.startTLS?.({
                timeout: timeRemaining,
            });
            if (tls_response) {
                if ("response" in tls_response) {
                    if (tls_response.response === 0) {
                        tls_in_use = true;
                        ctx.log.debug(ctx.i18n.t("log:established_starttls", {
                            uri,
                        }), {
                            dest: uri,
                        });
                    }
                } else if ("not_supported_locally" in tls_response) {
                    // Do not log a message, since this can be inferred from the URL.
                } else if ("already_in_use" in tls_response) {
                    // Do not log a message, since this can be inferred from the URL.
                } else if ("abort" in tls_response) {
                    // tls_response.abort
                    // TODO: Log abort
                } else if ("timeout" in tls_response) {
                    ctx.log.debug(ctx.i18n.t("log:timed_out_connecting_to_naddr", {
                        uri,
                    }), {
                        dest: uri,
                    });
                    return null;
                    // TODO: Log
                } else {
                    // TODO: Log other error.
                }
            }
        }

        if (!tls_in_use && !ctx.config.chaining.tlsOptional) {
            if (!ctx.config.chaining.tlsOptional) {
                ctx.log.debug(ctx.i18n.t("log:starttls_error", {
                    uri,
                    context: "tls_required",
                }), {
                    dest: uri,
                });
                continue;
            }
        } else if (!(rose.socket instanceof TLSSocket)) {
            // We can use non-null assertion here, because Meerkat does
            // not support any ROSE transport that does not involve a
            // TCP or TLS socket.
            const tls_socket = new TLSSocket(rose.socket!, {
                ...ctx.config.tls,
                rejectUnauthorized: ctx.config.tls.rejectUnauthorizedServers,
            });
            rose.socket = tls_socket;
        }

        const c: ClientType = client_getter(rose);
        const strongCredData = createStrongCredentials(ctx, accessPoint.ae_title.rdnSequence);
        const extraCredentials: DSACredentials[] = uri
            ? await getCredentialsForNSAP(ctx, uri.toString())
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
                parameter: _encode_DSABindArgument(new DSABindArgument(
                    cred,
                    versions,
                ), DER),
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
                // TODO: Actual handle other outcomes. (Maybe just logging is needed.)
                break;
            } else if ("timeout" in bind_response) {
                // TODO: Add context to inform whether this was because of StartTLS or Bind
                ctx.log.debug(ctx.i18n.t("log:timed_out_connecting_to_naddr", {
                    uri,
                }), {
                    dest: uri,
                });
                return null;
            }
        }
        if (!rose.is_bound) {
            continue;
        }
        ctx.log.info(ctx.i18n.t("log:bound_to_naddr", {
            uri,
        }), {
            dest: uri,
        });
        return c;
    }
    return null;
}

// FIXME: Implement timeouts!

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
