import {
    AsyncROSEClient,
    ROSETransport,
    BindParameters,
    RequestParameters,
    BindOutcome,
    OperationOutcome,
    UnbindOutcome,
} from "@wildboar/rose-transport";
import {
    dSABind,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/dSABind.oa";
import { KeyObject } from "node:crypto";
import { CertPathOption } from "./utils";
import {
    requestShadowUpdate,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/requestShadowUpdate.oa";
import {
    updateShadow,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/updateShadow.oa";
import {
    coordinateShadowUpdate,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/coordinateShadowUpdate.oa";
import {
    RequestShadowUpdateArgumentData,
    _encode_RequestShadowUpdateArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/RequestShadowUpdateArgumentData.ta";
import {
    CoordinateShadowUpdateArgumentData,
    _encode_CoordinateShadowUpdateArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/CoordinateShadowUpdateArgumentData.ta";
import {
    UpdateShadowArgumentData,
    _encode_UpdateShadowArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/UpdateShadowArgumentData.ta";


export type BindArgument = typeof dSABind["&ArgumentType"];
export type BindResult = typeof dSABind["&ResultType"];
export type DISPBindParameters = BindParameters<BindArgument>;
export type DISPBindOutcome = BindOutcome<BindResult>;

export
interface RequestShadowUpdateOptions extends RequestShadowUpdateArgumentData, DISPOperationOptions {

}

export
interface CoordinateShadowUpdateOptions extends CoordinateShadowUpdateArgumentData, DISPOperationOptions {

}

export
interface UpdateShadowOptions extends UpdateShadowArgumentData, DISPOperationOptions {

}

export
interface DISPOperationOptions {
    key?: KeyObject;
    cert_path?: CertPathOption;
}

export
interface DISPOptions extends DISPOperationOptions {

}

export
interface DISPClient extends AsyncROSEClient<BindArgument, BindResult>, DISPOptions {
    rose: ROSETransport;

    // From AsyncROSEClient
    bind: (params: DISPBindParameters) => Promise<DISPBindOutcome>;
    request: (params: RequestParameters) => Promise<OperationOutcome>;
    unbind: () => Promise<UnbindOutcome>;

    requestShadowUpdate: (params: RequestShadowUpdateOptions) => Promise<typeof requestShadowUpdate["&ResultType"]>;
    updateShadow: (params: UpdateShadowOptions) => Promise<typeof updateShadow["&ResultType"]>;
    coordinateShadowUpdate: (params: CoordinateShadowUpdateOptions) => Promise<typeof coordinateShadowUpdate["&ResultType"]>;

}

export
function create_disp_client (rose: ROSETransport): DISPClient {
    const ret: DISPClient = {
        rose,
    };
    return ret;
}
