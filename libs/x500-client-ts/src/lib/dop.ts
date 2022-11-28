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
import type { KeyObject } from "node:crypto";
import {
    CertPathOption,
    generateSIGNED,
    DirectoryVersioned,
    generateUnusedInvokeId,
} from "./utils";
import {
    establishOperationalBinding, EstablishOperationalBindingArgument,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/establishOperationalBinding.oa";
import {
    modifyOperationalBinding, ModifyOperationalBindingArgument,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/modifyOperationalBinding.oa";
import {
    terminateOperationalBinding, TerminateOperationalBindingArgument,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/terminateOperationalBinding.oa";
import {
    EstablishOperationalBindingArgumentData,
    OperationalBindingID,
    _encode_EstablishOperationalBindingArgumentData,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/EstablishOperationalBindingArgumentData.ta";
import {
    ModifyOperationalBindingArgumentData,
    _encode_ModifyOperationalBindingArgumentData,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/ModifyOperationalBindingArgumentData.ta";
import {
    TerminateOperationalBindingArgumentData,
    _encode_TerminateOperationalBindingArgumentData,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/TerminateOperationalBindingArgumentData.ta";
import {
    EstablishOperationalBindingArgumentData_initiator,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/EstablishOperationalBindingArgumentData-initiator.ta";
import {
    ModifyOperationalBindingArgumentData_initiator,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/ModifyOperationalBindingArgumentData-initiator.ta";
import { ASN1Element, TRUE_BIT } from "asn1-ts";
import {
    SuperiorToSubordinate, _encode_SuperiorToSubordinate,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SuperiorToSubordinate.ta";
import {
    SubordinateToSuperior, _encode_SubordinateToSuperior,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SubordinateToSuperior.ta";
import {
    SuperiorToSubordinateModification,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SuperiorToSubordinateModification.ta";
import {
    NHOBSuperiorToSubordinate, _encode_NHOBSuperiorToSubordinate,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/NHOBSuperiorToSubordinate.ta";
import {
    NHOBSubordinateToSuperior, _encode_NHOBSubordinateToSuperior,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/NHOBSubordinateToSuperior.ta";
import {
    HierarchicalAgreement, _encode_HierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/HierarchicalAgreement.ta";
import {
    NonSpecificHierarchicalAgreement, _encode_NonSpecificHierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/NonSpecificHierarchicalAgreement.ta";
import {
    ShadowingAgreementInfo, _encode_ShadowingAgreementInfo,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/ShadowingAgreementInfo.ta";
import {
    ModificationParameter, _encode_ModificationParameter,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/ModificationParameter.ta";
import { BER, DER, _encodeNull } from "asn1-ts/dist/node/functional";
import { strict as assert } from "node:assert";
import { compareCode } from "@wildboar/x500";
import {
    id_op_binding_hierarchical,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-hierarchical.va";
import {
    id_op_binding_non_specific_hierarchical,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-non-specific-hierarchical.va";
import {
    id_op_binding_shadow,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-shadow.va";
import {
    Versions_v1,
    Versions_v2,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/Versions.ta";

type BindArgument = typeof dSABind["&ArgumentType"];
type BindResult = typeof dSABind["&ResultType"];
export type DOPBindParameters = BindParameters<BindArgument>;
export type DOPBindOutcome = BindOutcome<BindResult>;

export
interface EstablishOBOptions extends EstablishOperationalBindingArgumentData, DOPOperationOptions {

}

export
interface ModifyOBOptions extends ModifyOperationalBindingArgumentData, DOPOperationOptions {

}

export
interface TerminateOBOptions extends TerminateOperationalBindingArgumentData, DOPOperationOptions {

}

export
interface CommonEstablishOptions <AgreementType = ASN1Element, InitType = ASN1Element> extends DOPOperationOptions {
    bindingID?: EstablishOperationalBindingArgumentData["bindingID"];
    accessPoint: EstablishOperationalBindingArgumentData["accessPoint"];
    initiator: InitType;
    agreement: AgreementType;
    valid?: EstablishOperationalBindingArgumentData["valid"];
    securityParameters?: EstablishOperationalBindingArgumentData["securityParameters"];
}

export
interface CommonModifyOptions <AgreementType = ASN1Element, InitType = ASN1Element> extends DOPOperationOptions {
    bindingID: ModifyOperationalBindingArgumentData["bindingID"];
    accessPoint?: ModifyOperationalBindingArgumentData["accessPoint"];
    initiator: InitType;
    newAgreement: AgreementType;
    valid?: ModifyOperationalBindingArgumentData["valid"];
    securityParameters?: ModifyOperationalBindingArgumentData["securityParameters"];
}

export
interface CommonTerminateOptions <InitType = ASN1Element> extends DOPOperationOptions {
    bindingID: TerminateOperationalBindingArgumentData["bindingID"];
    initiator: InitType;
    terminateAt?: TerminateOperationalBindingArgumentData["terminateAt"];
    securityParameters?: ModifyOperationalBindingArgumentData["securityParameters"];
}

export
interface DOPOperationOptions {
    key?: KeyObject;
    cert_path?: CertPathOption;
}

export
interface DOPOptions extends DOPOperationOptions {

}

export
interface DOPClient extends AsyncROSEClient<BindArgument, BindResult>, DOPOptions, DirectoryVersioned {
    rose: ROSETransport;

    // From AsyncROSEClient
    bind: (params: DOPBindParameters) => Promise<DOPBindOutcome>;
    request: (params: RequestParameters) => Promise<OperationOutcome>;
    unbind: () => Promise<UnbindOutcome>;

    // Generic operation methods
    establishOperationalBinding: (params: EstablishOBOptions) => Promise<OperationOutcome<typeof establishOperationalBinding["&ResultType"]>>;
    modifyOperationalBinding: (params: ModifyOBOptions) => Promise<OperationOutcome<typeof modifyOperationalBinding["&ResultType"]>>;
    terminateOperationalBinding: (params: TerminateOBOptions) => Promise<OperationOutcome<typeof terminateOperationalBinding["&ResultType"]>>;

    // OB-specific methods
    establishHOBWithSuperior: (params: CommonEstablishOptions<HierarchicalAgreement, SubordinateToSuperior>) => Promise<OperationOutcome<typeof establishOperationalBinding["&ResultType"]>>;
    establishHOBWithSubordinate: (params: CommonEstablishOptions<HierarchicalAgreement, SuperiorToSubordinate>) => Promise<OperationOutcome<typeof establishOperationalBinding["&ResultType"]>>;
    modifyHOBWithSuperior: (params: CommonModifyOptions<HierarchicalAgreement, SubordinateToSuperior>) => Promise<OperationOutcome<typeof modifyOperationalBinding["&ResultType"]>>;
    modifyHOBWithSubordinate: (params: CommonModifyOptions<HierarchicalAgreement, SuperiorToSubordinateModification>) => Promise<OperationOutcome<typeof modifyOperationalBinding["&ResultType"]>>;
    establishNHOBWithSuperior: (params: CommonEstablishOptions<NonSpecificHierarchicalAgreement, NHOBSubordinateToSuperior>) => Promise<OperationOutcome<typeof establishOperationalBinding["&ResultType"]>>;
    establishNHOBWithSubordinate: (params: CommonEstablishOptions<NonSpecificHierarchicalAgreement, NHOBSuperiorToSubordinate>) => Promise<OperationOutcome<typeof establishOperationalBinding["&ResultType"]>>;
    modifyNHOBWithSuperior: (params: CommonModifyOptions<NonSpecificHierarchicalAgreement, NHOBSubordinateToSuperior>) => Promise<OperationOutcome<typeof modifyOperationalBinding["&ResultType"]>>;
    modifyNHOBWithSubordinate: (params: CommonModifyOptions<NonSpecificHierarchicalAgreement, NHOBSuperiorToSubordinate>) => Promise<OperationOutcome<typeof modifyOperationalBinding["&ResultType"]>>;
    establishSOBWithSupplier: (params: CommonEstablishOptions<ShadowingAgreementInfo, undefined>) => Promise<OperationOutcome<typeof establishOperationalBinding["&ResultType"]>>;
    establishSOBWithConsumer: (params: CommonEstablishOptions<ShadowingAgreementInfo, undefined>) => Promise<OperationOutcome<typeof establishOperationalBinding["&ResultType"]>>;
    modifySOBWithSupplier: (params: CommonModifyOptions<ShadowingAgreementInfo, ModificationParameter>) => Promise<OperationOutcome<typeof modifyOperationalBinding["&ResultType"]>>;
    modifySOBWithConsumer: (params: CommonModifyOptions<ShadowingAgreementInfo, undefined>) => Promise<OperationOutcome<typeof modifyOperationalBinding["&ResultType"]>>;
}

export
function create_dop_client (rose: ROSETransport): DOPClient {
    const establishOperationalBinding_ = async (params: EstablishOBOptions): Promise<OperationOutcome<typeof establishOperationalBinding["&ResultType"]>> => {
        const data = new EstablishOperationalBindingArgumentData(
            params.bindingType,
            params.bindingID,
            params.accessPoint,
            params.initiator,
            params.agreement,
            params.valid,
            params.securityParameters,
        );
        const key = params.key ?? ret.key;
        const cert_path = params.cert_path ?? ret.cert_path;
        const arg: EstablishOperationalBindingArgument = (key && cert_path && (ret.directoryVersion === 2))
            ? generateSIGNED(key, data, _encode_EstablishOperationalBindingArgumentData)
            : {
                unsigned: data,
            };
        const invoke_id: number = generateUnusedInvokeId();
        const outcome = await rose.request({
            code: establishOperationalBinding["&operationCode"]!,
            invoke_id: {
                present: invoke_id,
            },
            parameter: establishOperationalBinding.encoderFor["&ArgumentType"]!(arg, DER),
        });
        if ("result" in outcome) {
            assert(compareCode(outcome.result.code, establishOperationalBinding["&operationCode"]!));
            assert("present" in outcome.result.invoke_id);
            assert(outcome.result.invoke_id.present.toString() === invoke_id.toString());
            const decoded = establishOperationalBinding.decoderFor["&ResultType"]!(outcome.result.parameter);
            return {
                result: {
                    ...outcome.result,
                    parameter: decoded,
                },
            };
        } else {
            return outcome;
        }
    };
    const modifyOperationalBinding_ = async (params: ModifyOBOptions): Promise<OperationOutcome<typeof modifyOperationalBinding["&ResultType"]>> => {
        const data = new ModifyOperationalBindingArgumentData(
            params.bindingType,
            params.bindingID,
            params.accessPoint,
            params.initiator,
            params.newBindingID,
            params.newAgreement,
            params.valid,
            params.securityParameters,
        );
        const key = params.key ?? ret.key;
        const cert_path = params.cert_path ?? ret.cert_path;
        const arg: ModifyOperationalBindingArgument = (key && cert_path && (ret.directoryVersion === 2))
            ? generateSIGNED(key, data, _encode_ModifyOperationalBindingArgumentData)
            : {
                unsigned: data,
            };
        const invoke_id: number = generateUnusedInvokeId();
        const outcome = await rose.request({
            code: modifyOperationalBinding["&operationCode"]!,
            invoke_id: {
                present: invoke_id,
            },
            parameter: modifyOperationalBinding.encoderFor["&ArgumentType"]!(arg, DER),
        });
        if ("result" in outcome) {
            assert(compareCode(outcome.result.code, modifyOperationalBinding["&operationCode"]!));
            assert("present" in outcome.result.invoke_id);
            assert(outcome.result.invoke_id.present.toString() === invoke_id.toString());
            const decoded = modifyOperationalBinding.decoderFor["&ResultType"]!(outcome.result.parameter);
            return {
                result: {
                    ...outcome.result,
                    parameter: decoded,
                },
            };
        } else {
            return outcome;
        }
    };
    const terminateOperationalBinding_ = async (params: TerminateOBOptions): Promise<OperationOutcome<typeof terminateOperationalBinding["&ResultType"]>> => {
        const data = new TerminateOperationalBindingArgumentData(
            params.bindingType,
            params.bindingID,
            params.initiator,
            params.terminateAt,
            params.securityParameters,
        );
        const key = params.key ?? ret.key;
        const cert_path = params.cert_path ?? ret.cert_path;
        const arg: TerminateOperationalBindingArgument = (key && cert_path && (ret.directoryVersion === 2))
            ? generateSIGNED(key, data, _encode_TerminateOperationalBindingArgumentData)
            : {
                unsigned: data,
            };
        const invoke_id: number = generateUnusedInvokeId();
        const outcome = await rose.request({
            code: terminateOperationalBinding["&operationCode"]!,
            invoke_id: {
                present: invoke_id,
            },
            parameter: terminateOperationalBinding.encoderFor["&ArgumentType"]!(arg, DER),
        });
        if ("result" in outcome) {
            assert(compareCode(outcome.result.code, terminateOperationalBinding["&operationCode"]!));
            assert("present" in outcome.result.invoke_id);
            assert(outcome.result.invoke_id.present.toString() === invoke_id.toString());
            const decoded = terminateOperationalBinding.decoderFor["&ResultType"]!(outcome.result.parameter);
            return {
                result: {
                    ...outcome.result,
                    parameter: decoded,
                },
            };
        } else {
            return outcome;
        }
    };
    const establishHOBWithSuperior = async (params: CommonEstablishOptions<HierarchicalAgreement, SubordinateToSuperior>): Promise<OperationOutcome<typeof establishOperationalBinding["&ResultType"]>> => {
        const agreement = _encode_HierarchicalAgreement(params.agreement, DER);
        const initiator: EstablishOperationalBindingArgumentData_initiator = {
            roleB_initiates: _encode_SubordinateToSuperior(params.initiator, DER),
        };
        return establishOperationalBinding_({
            ...params,
            bindingType: id_op_binding_hierarchical,
            bindingID: undefined,
            agreement,
            initiator,
            _unrecognizedExtensionsList: [],
        });
    };
    const establish_hob_with_subordinate = async (params: CommonEstablishOptions<HierarchicalAgreement, SuperiorToSubordinate>): Promise<OperationOutcome<typeof establishOperationalBinding["&ResultType"]>> => {
        const agreement = _encode_HierarchicalAgreement(params.agreement, DER);
        const initiator: EstablishOperationalBindingArgumentData_initiator = {
            roleA_initiates: _encode_SuperiorToSubordinate(params.initiator, DER),
        };
        return establishOperationalBinding_({
            ...params,
            bindingType: id_op_binding_hierarchical,
            bindingID: undefined,
            agreement,
            initiator,
            _unrecognizedExtensionsList: [],
        });
    };
    const modify_hob_with_superior = async (params: CommonModifyOptions<HierarchicalAgreement, SubordinateToSuperior>): Promise<OperationOutcome<typeof modifyOperationalBinding["&ResultType"]>> => {
        const newAgreement = _encode_HierarchicalAgreement(params.newAgreement, DER);
        const initiator: EstablishOperationalBindingArgumentData_initiator = {
            roleB_initiates: _encode_SubordinateToSuperior(params.initiator, DER),
        };
        return modifyOperationalBinding_({
            ...params,
            bindingType: id_op_binding_hierarchical,
            accessPoint: undefined,
            newAgreement,
            initiator,
            newBindingID: new OperationalBindingID(
                params.bindingID.identifier,
                Number(params.bindingID.version ?? 0) + 1,
            ),
            _unrecognizedExtensionsList: [],
        });
    };
    const modify_hob_with_subordinate = async (params: CommonModifyOptions<HierarchicalAgreement, SuperiorToSubordinate>): Promise<OperationOutcome<typeof modifyOperationalBinding["&ResultType"]>> => {
        const newAgreement = _encode_HierarchicalAgreement(params.newAgreement, DER);
        const initiator: EstablishOperationalBindingArgumentData_initiator = {
            roleA_initiates: _encode_SuperiorToSubordinate(params.initiator, DER),
        };
        return modifyOperationalBinding_({
            ...params,
            bindingType: id_op_binding_hierarchical,
            accessPoint: undefined,
            newAgreement,
            initiator,
            newBindingID: new OperationalBindingID(
                params.bindingID.identifier,
                Number(params.bindingID.version ?? 0) + 1,
            ),
            _unrecognizedExtensionsList: [],
        });
    };
    const establish_nhob_with_superior = async (params: CommonEstablishOptions<NonSpecificHierarchicalAgreement, NHOBSubordinateToSuperior>): Promise<OperationOutcome<typeof establishOperationalBinding["&ResultType"]>> => {
        const agreement = _encode_NonSpecificHierarchicalAgreement(params.agreement, DER);
        const initiator: EstablishOperationalBindingArgumentData_initiator = {
            roleB_initiates: _encode_NHOBSubordinateToSuperior(params.initiator, DER),
        };
        return establishOperationalBinding_({
            ...params,
            bindingType: id_op_binding_non_specific_hierarchical,
            bindingID: undefined,
            agreement,
            initiator,
            _unrecognizedExtensionsList: [],
        });
    };
    const establish_nhob_with_subordinate = async (params: CommonEstablishOptions<NonSpecificHierarchicalAgreement, NHOBSuperiorToSubordinate>): Promise<OperationOutcome<typeof establishOperationalBinding["&ResultType"]>> => {
        const agreement = _encode_NonSpecificHierarchicalAgreement(params.agreement, DER);
        const initiator: EstablishOperationalBindingArgumentData_initiator = {
            roleB_initiates: _encode_NHOBSuperiorToSubordinate(params.initiator, DER),
        };
        return establishOperationalBinding_({
            ...params,
            bindingType: id_op_binding_non_specific_hierarchical,
            bindingID: undefined,
            agreement,
            initiator,
            _unrecognizedExtensionsList: [],
        });
    };
    const modify_nhob_with_superior = async (params: CommonModifyOptions<NonSpecificHierarchicalAgreement, NHOBSubordinateToSuperior>): Promise<OperationOutcome<typeof modifyOperationalBinding["&ResultType"]>> => {
        const newAgreement = _encode_NonSpecificHierarchicalAgreement(params.newAgreement, DER);
        const initiator: ModifyOperationalBindingArgumentData_initiator = {
            roleB_initiates: _encode_NHOBSubordinateToSuperior(params.initiator, DER),
        };
        return modifyOperationalBinding_({
            ...params,
            bindingType: id_op_binding_non_specific_hierarchical,
            accessPoint: undefined,
            newBindingID: new OperationalBindingID(
                params.bindingID.identifier,
                Number(params.bindingID.version ?? 0) + 1,
            ),
            newAgreement,
            initiator,
            _unrecognizedExtensionsList: [],
        });
    };
    const modify_nhob_with_subordinate = async (params: CommonModifyOptions<NonSpecificHierarchicalAgreement, NHOBSuperiorToSubordinate>): Promise<OperationOutcome<typeof modifyOperationalBinding["&ResultType"]>> => {
        const newAgreement = _encode_NonSpecificHierarchicalAgreement(params.newAgreement, DER);
        const initiator: ModifyOperationalBindingArgumentData_initiator = {
            roleA_initiates: _encode_NHOBSuperiorToSubordinate(params.initiator, DER),
        };
        return modifyOperationalBinding_({
            ...params,
            bindingType: id_op_binding_non_specific_hierarchical,
            accessPoint: undefined,
            newBindingID: new OperationalBindingID(
                params.bindingID.identifier,
                Number(params.bindingID.version ?? 0) + 1,
            ),
            newAgreement,
            initiator,
            _unrecognizedExtensionsList: [],
        });
    };
    const establish_sob_with_supplier = async (params: CommonEstablishOptions<ShadowingAgreementInfo, undefined>): Promise<OperationOutcome<typeof establishOperationalBinding["&ResultType"]>> => {
        const agreement = _encode_ShadowingAgreementInfo(params.agreement, DER);
        return establishOperationalBinding_({
            ...params,
            bindingType: id_op_binding_shadow,
            bindingID: undefined,
            agreement,
            initiator: {
                roleB_initiates: _encodeNull(null, BER),
            },
            _unrecognizedExtensionsList: [],
        });
    };
    const establish_sob_with_consumer = async (params: CommonEstablishOptions<ShadowingAgreementInfo, undefined>): Promise<OperationOutcome<typeof establishOperationalBinding["&ResultType"]>> => {
        const agreement = _encode_ShadowingAgreementInfo(params.agreement, DER);
        return establishOperationalBinding_({
            ...params,
            bindingType: id_op_binding_shadow,
            bindingID: undefined,
            agreement,
            initiator: {
                roleA_initiates: _encodeNull(null, BER),
            },
            _unrecognizedExtensionsList: [],
        });
    };
    const modify_sob_with_supplier = async (params: CommonModifyOptions<ShadowingAgreementInfo, ModificationParameter>): Promise<OperationOutcome<typeof modifyOperationalBinding["&ResultType"]>> => {
        const newAgreement = _encode_ShadowingAgreementInfo(params.newAgreement, DER);
        return modifyOperationalBinding_({
            ...params,
            bindingType: id_op_binding_shadow,
            accessPoint: undefined,
            newBindingID: new OperationalBindingID(
                params.bindingID.identifier,
                Number(params.bindingID.version ?? 0) + 1,
            ),
            newAgreement,
            initiator: {
                roleB_initiates: _encode_ModificationParameter(params.initiator, BER),
            },
            _unrecognizedExtensionsList: [],
        });
    };
    const modify_sob_with_consumer = async (params: CommonModifyOptions<ShadowingAgreementInfo, undefined>): Promise<OperationOutcome<typeof modifyOperationalBinding["&ResultType"]>> => {
        const newAgreement = _encode_ShadowingAgreementInfo(params.newAgreement, DER);
        return modifyOperationalBinding_({
            ...params,
            bindingType: id_op_binding_shadow,
            accessPoint: undefined,
            newBindingID: new OperationalBindingID(
                params.bindingID.identifier,
                Number(params.bindingID.version ?? 0) + 1,
            ),
            newAgreement,
            _unrecognizedExtensionsList: [],
        });
    };
    const ret: DOPClient = {
        rose,
        directoryVersion: 1,
        bind: async (params: DOPBindParameters): Promise<DOPBindOutcome> => {
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
        establishOperationalBinding: establishOperationalBinding_,
        modifyOperationalBinding: modifyOperationalBinding_,
        terminateOperationalBinding: terminateOperationalBinding_,
        establishHOBWithSuperior: establishHOBWithSuperior,
        establishHOBWithSubordinate: establish_hob_with_subordinate,
        modifyHOBWithSuperior: modify_hob_with_superior,
        modifyHOBWithSubordinate: modify_hob_with_subordinate,
        establishNHOBWithSuperior: establish_nhob_with_superior,
        establishNHOBWithSubordinate: establish_nhob_with_subordinate,
        modifyNHOBWithSuperior: modify_nhob_with_superior,
        modifyNHOBWithSubordinate: modify_nhob_with_subordinate,
        establishSOBWithSupplier: establish_sob_with_supplier,
        establishSOBWithConsumer: establish_sob_with_consumer,
        modifySOBWithSupplier: modify_sob_with_supplier,
        modifySOBWithConsumer: modify_sob_with_consumer,
    };
    return ret;
}
