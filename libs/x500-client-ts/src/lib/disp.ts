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
import { KeyObject, randomBytes } from "node:crypto";
import { CertPathOption, generateSIGNED, DirectoryVersioned } from "./utils";
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
import { BER, DER } from "asn1-ts/dist/node/functional";
import { TRUE_BIT } from "asn1-ts";
import { strict as assert } from "node:assert";
import { compareCode } from "@wildboar/x500";
import {
    Versions_v1,
    Versions_v2,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/Versions.ta";

type BindArgument = typeof dSABind["&ArgumentType"];
type BindResult = typeof dSABind["&ResultType"];
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
interface DISPClient extends AsyncROSEClient<BindArgument, BindResult>, DISPOptions, DirectoryVersioned {
    rose: ROSETransport;

    // From AsyncROSEClient
    bind: (params: DISPBindParameters) => Promise<DISPBindOutcome>;
    request: (params: RequestParameters) => Promise<OperationOutcome>;
    unbind: () => Promise<UnbindOutcome>;

    requestShadowUpdate: (params: RequestShadowUpdateOptions) => Promise<OperationOutcome<typeof requestShadowUpdate["&ResultType"]>>;
    updateShadow: (params: UpdateShadowOptions) => Promise<OperationOutcome<typeof updateShadow["&ResultType"]>>;
    coordinateShadowUpdate: (params: CoordinateShadowUpdateOptions) => Promise<OperationOutcome<typeof coordinateShadowUpdate["&ResultType"]>>;

}

export
function create_disp_client (rose: ROSETransport): DISPClient {
    const ret: DISPClient = {
        rose,
        directoryVersion: 1,
        bind: async (params: DISPBindParameters): Promise<DISPBindOutcome> => {
            const parameter = dSABind.encoderFor["&ArgumentType"]!(params.parameter, BER);
            const outcome = await rose.bind({
                ...params,
                parameter,
            });
            if ("result" in outcome) {
                const parameter = dSABind.decoderFor["&ResultType"]!(outcome.result.parameter);
                if (parameter.versions?.[Versions_v2] === TRUE_BIT) {
                    ret.directoryVersion = 2;
                } else if (parameter.versions?.[Versions_v1] === TRUE_BIT) {
                    ret.directoryVersion = 1;
                } else {
                    ret.directoryVersion = 0;
                }
                return {
                    result: {
                        ...outcome.result,
                        parameter,
                    },
                };
            } else {
                return outcome;
            }
        },
        request: async (params: RequestParameters): Promise<OperationOutcome> => rose.request(params),
        unbind: async (): Promise<UnbindOutcome> => rose.unbind(),

        requestShadowUpdate: async (params: RequestShadowUpdateOptions): Promise<OperationOutcome<typeof requestShadowUpdate["&ResultType"]>> => {
            const data = new RequestShadowUpdateArgumentData(
                params.agreementID,
                params.lastUpdate,
                params.requestedStrategy,
                params.securityParameters,
            );
            const key = params.key ?? ret.key;
            const cert_path = params.cert_path ?? ret.cert_path;
            const arg: typeof requestShadowUpdate["&ArgumentType"] = (key && cert_path && (ret.directoryVersion === 2))
                ? generateSIGNED(key, data, _encode_RequestShadowUpdateArgumentData)
                : {
                    unsigned: data,
                };
            const invoke_id: number = randomBytes(4).readUint32BE();
            const outcome = await rose.request({
                code: requestShadowUpdate["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: requestShadowUpdate.encoderFor["&ArgumentType"]!(arg, DER),
            });
            if ("result" in outcome) {
                assert(compareCode(outcome.result.code, requestShadowUpdate["&operationCode"]!));
                assert("present" in outcome.result.invoke_id);
                assert(outcome.result.invoke_id.present.toString() === invoke_id.toString());
                const decoded = requestShadowUpdate.decoderFor["&ResultType"]!(outcome.result.parameter);
                return {
                    result: {
                        ...outcome.result,
                        parameter: decoded,
                    },
                };
            } else {
                return outcome;
            }
        },
        updateShadow: async (params: UpdateShadowOptions): Promise<OperationOutcome<typeof updateShadow["&ResultType"]>> => {
            const data = new UpdateShadowArgumentData(
                params.agreementID,
                params.updateTime,
                params.updateWindow,
                params.updatedInfo,
                params.securityParameters,
            );
            const key = params.key ?? ret.key;
            const cert_path = params.cert_path ?? ret.cert_path;
            const arg: typeof updateShadow["&ArgumentType"] = (key && cert_path && (ret.directoryVersion === 2))
                ? generateSIGNED(key, data, _encode_UpdateShadowArgumentData)
                : {
                    unsigned: data,
                };
            const invoke_id: number = randomBytes(4).readUint32BE();
            const outcome = await rose.request({
                code: updateShadow["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: updateShadow.encoderFor["&ArgumentType"]!(arg, DER),
            });
            if ("result" in outcome) {
                assert(compareCode(outcome.result.code, updateShadow["&operationCode"]!));
                assert("present" in outcome.result.invoke_id);
                assert(outcome.result.invoke_id.present.toString() === invoke_id.toString());
                const decoded = updateShadow.decoderFor["&ResultType"]!(outcome.result.parameter);
                return {
                    result: {
                        ...outcome.result,
                        parameter: decoded,
                    },
                };
            } else {
                return outcome;
            }
        },
        coordinateShadowUpdate: async (params: CoordinateShadowUpdateOptions): Promise<OperationOutcome<typeof coordinateShadowUpdate["&ResultType"]>> => {
            const data = new CoordinateShadowUpdateArgumentData(
                params.agreementID,
                params.lastUpdate,
                params.updateStrategy,
                params.securityParameters,
            );
            const key = params.key ?? ret.key;
            const cert_path = params.cert_path ?? ret.cert_path;
            const arg: typeof coordinateShadowUpdate["&ArgumentType"] = (key && cert_path && (ret.directoryVersion === 2))
                ? generateSIGNED(key, data, _encode_CoordinateShadowUpdateArgumentData)
                : {
                    unsigned: data,
                };
            const invoke_id: number = randomBytes(4).readUint32BE();
            const outcome = await rose.request({
                code: coordinateShadowUpdate["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: coordinateShadowUpdate.encoderFor["&ArgumentType"]!(arg, DER),
            });
            if ("result" in outcome) {
                assert(compareCode(outcome.result.code, coordinateShadowUpdate["&operationCode"]!));
                assert("present" in outcome.result.invoke_id);
                assert(outcome.result.invoke_id.present.toString() === invoke_id.toString());
                const decoded = coordinateShadowUpdate.decoderFor["&ResultType"]!(outcome.result.parameter);
                return {
                    result: {
                        ...outcome.result,
                        parameter: decoded,
                    },
                };
            } else {
                return outcome;
            }
        },
    };
    return ret;
}
