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
    establishOperationalBinding,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/establishOperationalBinding.oa";
import {
    modifyOperationalBinding,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/modifyOperationalBinding.oa";
import {
    terminateOperationalBinding,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/terminateOperationalBinding.oa";
import {
    EstablishOperationalBindingArgumentData,
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
import { ASN1Element } from "asn1-ts";
import {
    SuperiorToSubordinate,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SuperiorToSubordinate.ta";
import {
    SubordinateToSuperior,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SubordinateToSuperior.ta";
import {
    SuperiorToSubordinateModification,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SuperiorToSubordinateModification.ta";
import {
    NHOBSuperiorToSubordinate,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/NHOBSuperiorToSubordinate.ta";
import {
    NHOBSubordinateToSuperior,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/NHOBSubordinateToSuperior.ta";
import {
    HierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/HierarchicalAgreement.ta";
import {
    NonSpecificHierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/NonSpecificHierarchicalAgreement.ta";
import {
    ShadowingAgreementInfo,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/ShadowingAgreementInfo.ta";
import {
    ModificationParameter,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/ModificationParameter.ta";

export type BindArgument = typeof dSABind["&ArgumentType"];
export type BindResult = typeof dSABind["&ResultType"];
export type DOPBindParameters = BindParameters<BindArgument>;
export type DOPBindOutcome = BindOutcome<BindResult>;

export
interface EstablishOBOptions extends EstablishOperationalBindingArgumentData {

}

export
interface ModifyOBOptions extends ModifyOperationalBindingArgumentData {

}

export
interface TerminateOBOptions extends TerminateOperationalBindingArgumentData {

}

export
interface CommonEstablishOptions <AgreementType = ASN1Element, InitType = ASN1Element> {
    bindingID?: EstablishOperationalBindingArgumentData["bindingID"];
    accessPoint: EstablishOperationalBindingArgumentData["accessPoint"];
    initiator: InitType;
    agreement: AgreementType;
    valid?: EstablishOperationalBindingArgumentData["valid"];
    securityParameters?: EstablishOperationalBindingArgumentData["securityParameters"];
}

export
interface CommonModifyOptions <AgreementType = ASN1Element, InitType = ASN1Element> {
    bindingID: ModifyOperationalBindingArgumentData["bindingID"];
    accessPoint?: ModifyOperationalBindingArgumentData["accessPoint"];
    initiator: InitType;
    newAgreement: AgreementType;
    valid?: ModifyOperationalBindingArgumentData["valid"];
    securityParameters?: ModifyOperationalBindingArgumentData["securityParameters"];
}

export
interface CommonTerminateOptions <InitType = ASN1Element> {
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
interface DOPClient extends AsyncROSEClient<BindArgument, BindResult>, DOPOptions {
    rose: ROSETransport;

    // From AsyncROSEClient
    bind: (params: DOPBindParameters) => Promise<DOPBindOutcome>;
    request: (params: RequestParameters) => Promise<OperationOutcome>;
    unbind: () => Promise<UnbindOutcome>;

    // Generic operation methods
    establishOperationalBinding: (params: EstablishOBOptions) => Promise<typeof establishOperationalBinding["&ResultType"]>;
    modifyOperationalBinding: (params: ModifyOBOptions) => Promise<typeof modifyOperationalBinding["&ResultType"]>;
    terminateOperationalBinding: (params: TerminateOBOptions) => Promise<typeof terminateOperationalBinding["&ResultType"]>;

    // OB-specific methods
    establish_hob_with_superior: (params: CommonEstablishOptions<HierarchicalAgreement, SubordinateToSuperior>) => Promise<typeof establishOperationalBinding["&ResultType"]>;
    establish_hob_with_subordinate: (params: CommonEstablishOptions<HierarchicalAgreement, SuperiorToSubordinate>) => Promise<typeof establishOperationalBinding["&ResultType"]>;
    modify_hob_with_superior: (params: CommonModifyOptions<HierarchicalAgreement, SubordinateToSuperior>) => Promise<typeof modifyOperationalBinding["&ResultType"]>;
    modify_hob_with_subordinate: (params: CommonModifyOptions<HierarchicalAgreement, SuperiorToSubordinate>) => Promise<typeof modifyOperationalBinding["&ResultType"]>;
    establish_nhob_with_superior: (params: CommonEstablishOptions<NonSpecificHierarchicalAgreement, NHOBSubordinateToSuperior>) => Promise<typeof establishOperationalBinding["&ResultType"]>;
    establish_nhob_with_subordinate: (params: CommonEstablishOptions<NonSpecificHierarchicalAgreement, NHOBSuperiorToSubordinate>) => Promise<typeof establishOperationalBinding["&ResultType"]>;
    modify_nhob_with_superior: (params: CommonModifyOptions<NonSpecificHierarchicalAgreement, NHOBSubordinateToSuperior>) => Promise<typeof modifyOperationalBinding["&ResultType"]>;
    modify_nhob_with_subordinate: (params: CommonModifyOptions<NonSpecificHierarchicalAgreement, NHOBSuperiorToSubordinate>) => Promise<typeof modifyOperationalBinding["&ResultType"]>;
    establish_sob_with_supplier: (params: CommonEstablishOptions<ShadowingAgreementInfo, undefined>) => Promise<typeof establishOperationalBinding["&ResultType"]>;
    establish_sob_with_consumer: (params: CommonEstablishOptions<ShadowingAgreementInfo, undefined>) => Promise<typeof establishOperationalBinding["&ResultType"]>;
    modify_sob_with_supplier: (params: CommonModifyOptions<ShadowingAgreementInfo, undefined>) => Promise<typeof modifyOperationalBinding["&ResultType"]>;
    modify_sob_with_consumer: (params: CommonModifyOptions<ShadowingAgreementInfo, ModificationParameter>) => Promise<typeof modifyOperationalBinding["&ResultType"]>;
}

export
function create_dop_client (rose: ROSETransport): DOPClient {
    const ret: DOPClient = {
        rose,
    };
    return ret;
}
