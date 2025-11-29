import type {
    BindReturn,
    Context,
    DirectoryBindError,
    DSABindError,
} from "../types/index.js";
import { EXTERNAL } from "@wildboar/asn1";
import {
    DirectoryBindError_OPTIONALLY_PROTECTED_Parameter1 as DirectoryBindErrorData,
} from "@wildboar/x500/DirectoryAbstractService";
import versions from "../versions.js";
import {
    SecurityProblem_unsupportedAuthenticationMethod,
} from "@wildboar/x500/DirectoryAbstractService";
import type { Socket } from "node:net";
import type { TLSSocket } from "node:tls";

export
async function attemptExternalAuth (
    ctx: Context,
    BindErrorClass: (typeof DirectoryBindError) | (typeof DSABindError),
    socket: Socket | TLSSocket,
    ext: EXTERNAL,
    signErrors: boolean,
): Promise<BindReturn> {
    const key = ext.directReference?.toString();
    if (!key || (ext.indirectReference !== undefined)) {
        throw new BindErrorClass(
            ctx.i18n.t("err:unrecognized_external_auth_proc"),
            new DirectoryBindErrorData(
                versions,
                {
                    securityError: SecurityProblem_unsupportedAuthenticationMethod,
                },
            ),
            signErrors,
        );
    }
    const auth_func = ctx.externalProcedureAuthFunctions.get(key);
    if (!auth_func) {
        throw new BindErrorClass(
            ctx.i18n.t("err:unrecognized_external_auth_proc"),
            new DirectoryBindErrorData(
                versions,
                {
                    securityError: SecurityProblem_unsupportedAuthenticationMethod,
                },
            ),
            signErrors,
        );
    }
    return auth_func(ctx, socket, ext, BindErrorClass);
}

export default attemptExternalAuth;
