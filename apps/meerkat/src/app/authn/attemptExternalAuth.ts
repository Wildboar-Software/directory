import type {
    BindReturn,
    Context,
    DirectoryBindError,
    DSABindError,
} from "@wildboar/meerkat-types";
import { EXTERNAL } from "asn1-ts";
import {
    DirectoryBindError_OPTIONALLY_PROTECTED_Parameter1 as DirectoryBindErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/DirectoryBindError-OPTIONALLY-PROTECTED-Parameter1.ta";
import versions from "../versions";
import {
    SecurityProblem_unsupportedAuthenticationMethod,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
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
    if (!key) {
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
