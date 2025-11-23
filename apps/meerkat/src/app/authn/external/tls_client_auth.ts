import { Context, BindReturn, DirectoryBindError, DSABindError } from "@wildboar/meerkat-types";
import { TLSSocket } from "node:tls";
import { Socket } from "node:net";
import { BERElement, EXTERNAL, ObjectIdentifier } from "@wildboar/asn1";
import {
    AuthenticationLevel_basicLevels,
    AuthenticationLevel_basicLevels_level_none,
    AuthenticationLevel_basicLevels_level_strong,
} from "@wildboar/x500/BasicAccessControl";
import {
    _decode_Certificate,
} from "@wildboar/x500/AuthenticationFramework";
import { NameAndOptionalUID } from "@wildboar/x500/SelectedAttributeTypes";
import dnToVertex from "../../dit/dnToVertex.js";
import { read_clearance } from "../../database/utils.js";
import {
    DirectoryBindError_OPTIONALLY_PROTECTED_Parameter1 as DirectoryBindErrorData,
} from "@wildboar/x500/DirectoryAbstractService";
import versions from "../../versions.js";
import {
    SecurityProblem_invalidCredentials,
} from "@wildboar/x500/DirectoryAbstractService";
import { ds } from "@wildboar/parity-schema/src/lib/modules/Wildboar/ds.va.js";

export const id_tls_client_auth = ObjectIdentifier.fromParts([ 401, 1 ], ds);

export
async function tls_client_auth (
    ctx: Context,
    socket: Socket | TLSSocket,
    ext: EXTERNAL,
    BindErrorClass: (typeof DirectoryBindError) | (typeof DSABindError),
): Promise<BindReturn> {
    if (!(socket instanceof TLSSocket)) {
        return {
            authLevel: {
                basicLevels: new AuthenticationLevel_basicLevels(
                    AuthenticationLevel_basicLevels_level_none,
                    0,
                    undefined,
                ),
            },
            clearances: [],
        };
    }
    const tlsProtocol: string | null = socket.getProtocol();
    const localQualifierPoints: number = (
        ctx.config.localQualifierPointsFor.usingTLS
        + ((tlsProtocol === "SSLv3") ? ctx.config.localQualifierPointsFor.usingSSLv3 : 0)
        + ((tlsProtocol === "TLSv1") ? ctx.config.localQualifierPointsFor.usingTLSv1_0 : 0)
        + ((tlsProtocol === "TLSv1.1") ? ctx.config.localQualifierPointsFor.usingTLSv1_1 : 0)
        + ((tlsProtocol === "TLSv1.2") ? ctx.config.localQualifierPointsFor.usingTLSv1_2 : 0)
        + ((tlsProtocol === "TLSv1.3") ? ctx.config.localQualifierPointsFor.usingTLSv1_3 : 0)
    );
    const nodejs_cert = socket.getPeerX509Certificate();
    if (!nodejs_cert) {
        return {
            authLevel: {
                basicLevels: new AuthenticationLevel_basicLevels(
                    AuthenticationLevel_basicLevels_level_none,
                    localQualifierPoints,
                    undefined,
                ),
            },
            clearances: [],
        };
    }
    if (!socket.authorized) {
        if (nodejs_cert) {
            throw new BindErrorClass(
                ctx.i18n.t("err:ext_auth_invalid_peer_cert", { e: socket.authorizationError }),
                new DirectoryBindErrorData(
                    versions,
                    {
                        securityError: SecurityProblem_invalidCredentials,
                    },
                ),
                false,
            );
        }
        return {
            authLevel: {
                basicLevels: new AuthenticationLevel_basicLevels(
                    AuthenticationLevel_basicLevels_level_none,
                    localQualifierPoints,
                    undefined,
                ),
            },
            clearances: [],
        };
    }
    const certEl = new BERElement();
    certEl.fromBytes(nodejs_cert.raw);
    const cert = _decode_Certificate(certEl);
    const boundVertex = await dnToVertex(ctx, ctx.dit.root, cert.toBeSigned.subject.rdnSequence);
    const clearances = boundVertex
        ? await read_clearance(ctx, boundVertex)
        : [];
    return {
        boundNameAndUID: new NameAndOptionalUID(
            cert.toBeSigned.subject.rdnSequence,
            cert.toBeSigned.subjectUniqueIdentifier,
        ),
        authLevel: {
            basicLevels: new AuthenticationLevel_basicLevels(
                AuthenticationLevel_basicLevels_level_strong,
                localQualifierPoints,
                undefined,
            ),
        },
        boundVertex,
        clearances,
    };
}
