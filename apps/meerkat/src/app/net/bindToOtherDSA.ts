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


async function dsa_bind <ClientType extends AsyncROSEClient> (
    ctx: MeerkatContext,
    assn: ClientAssociation | undefined,
    protocol_id: OBJECT_IDENTIFIER,
    client_getter: (rose: ROSETransport) => ClientType,
    op: OperationInvocationInfo | undefined,
    accessPoint: AccessPoint,
    aliasDereferenced?: BOOLEAN,
    signErrors: boolean = false,
): Promise<ClientType | null> {
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
        const paddr = new PresentationAddress(
            accessPoint.address.pSelector,
            accessPoint.address.sSelector,
            accessPoint.address.tSelector,
            [naddr],
        );
        const rose = rose_from_presentation_address(paddr, ctx.config.tls);
        if (!rose) {
            continue;
        }
        const c = client_getter(rose);
        const bind_response = await c.bind({
            protocol_id,
            parameter: _encode_DSABindArgument(new DSABindArgument(
                undefined,
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
        });
        if (!("result" in bind_response)) {
            // TODO: Actual handle other outcomes. (Maybe just logging is needed.)
            continue;
        }
        let tls_in_use: boolean = !!rose.socket && (rose.socket instanceof TLSSocket);
        const tls_response = await rose.startTLS?.();
        if (tls_response) {
            if ("response" in tls_response) {
                if (tls_response.response === 0) {
                    tls_in_use = true;
                }
            } else if ("not_supported_locally" in tls_response) {
                // Do not log a message, since this can be inferred from the URL.
            } else if ("already_in_use" in tls_response) {
                // Do not log a message, since this can be inferred from the URL.
            } else if ("abort" in tls_response) {
                // tls_response.abort
                // TODO: Log abort
            } else {
                // TODO: Log other error.
            }
        }

        if (!tls_in_use) {
            const uri = naddrToURI(naddr);
            if (!ctx.config.chaining.tlsOptional) {
                ctx.log.debug(ctx.i18n.t("log:starttls_error", {
                    uri,
                    context: "tls_required",
                }), {
                    dest: uri,
                });
                continue;
            } else {
                ctx.log.debug(ctx.i18n.t("log:starttls_error", {
                    uri,
                    context: "tls_optional",
                }));
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
