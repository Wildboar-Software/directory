import { ITOTSocket } from "./tpkt";
import {
    TransportConnection,
    createTransportConnection,
    dispatch_TCONreq,
    dispatch_TDTreq,
    dispatch_NSDU,
    CR_TPDU,
    CC_TPDU,
    dispatch_TCONresp,
} from "./transport";
import {
    SessionServiceConnectionState,
    newSessionConnection,
    dispatch_SCONreq,
    CONNECT_SPDU,
    TableA2SessionConnectionState,
    receiveTSDU,
    dispatch_TCONcnf,
    dispatch_TCONind,
    dispatch_SCONrsp_accept,
    ACCEPT_SPDU,
    dispatch_SDTreq,
    DATA_TRANSFER_SPDU,
    dispatch_SRELreq,
    dispatch_SRELrsp_accept,
    FINISH_SPDU,
    DISCONNECT_SPDU,
    encode_CONNECT_SPDU,
    ABORT_ACCEPT_SPDU,
    ABORT_SPDU,
    dispatch_SUABreq,
    REFUSE_SPDU,
    dispatch_SCONrsp_reject,
} from "./session";
import {
    createPresentationConnection,
    PresentationConnection,
    dispatch_CP,
    dispatch_CPA,
    dispatch_CPR,
    dispatch_S_PABind,
    dispatch_TD,
    dispatch_P_DTreq,
    dispatch_P_CONrsp_accept,
    dispatch_P_CONrsp_reject,
    dispatch_P_CONreq,
    dispatch_P_RELreq,
    dispatch_P_RELrsp_accept,
    dispatch_P_RELrsp_reject,
    dispatch_P_UABreq,
} from "./presentation";
import {
    createAssociationControlState,
    ACPMState,
    P_CONNECT_Request,
    P_CONNECT_Response,
    P_RELEASE_Request,
    P_RELEASE_Response,
    P_U_ABORT_Request,
    dispatch_A_ASCreq,
    dispatch_A_ASCrsp_accept,
    dispatch_AARQ,
    dispatch_AARE_accept,
    dispatch_AARE_reject,
} from "./acse";
import {
    CP_type,
    _decode_CP_type,
    _encode_CP_type,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/CP-type.ta";
import {
    CPR_PPDU,
    CPR_PPDU_normal_mode_parameters,
    _decode_CPR_PPDU,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/CPR-PPDU.ta";
import {
    CPA_PPDU,
    _decode_CPA_PPDU,
    _encode_CPA_PPDU,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/CPA-PPDU.ta";
import {
    ARU_PPDU,
    _decode_Abort_type,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Abort-type.ta";
import {
    User_data,
    _decode_User_data,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/User-data.ta";
import {
    Mode_selector,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Mode-selector.ta";
import {
    Mode_selector_mode_value_normal_mode,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Mode-selector-mode-value.ta";
import {
    CP_type_normal_mode_parameters,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/CP-type-normal-mode-parameters.ta";
import {
    PDV_list,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/PDV-list.ta";
import {
    Context_list_Item,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Context-list-Item.ta";
import {
    CPA_PPDU_normal_mode_parameters,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/CPA-PPDU-normal-mode-parameters.ta";
import {
    Result_list_Item,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Result-list-Item.ta";
import {
    Result_acceptance,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Result.ta";
import {
    Result_acceptance as ACSEResult_acceptance,
} from "@wildboar/acse/src/lib/modules/ACSE-1/Result.ta";
import { BERElement, ObjectIdentifier, External } from "asn1-ts";
import { Socket } from "node:net";
import { BER, _encodeUTF8String } from "asn1-ts/dist/node/functional";
import { assert } from "node:console";
import { ARU_PPDU_normal_mode_parameters } from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/ARU-PPDU-normal-mode-parameters.ta";
import { AARQ_apdu, _decode_AARQ_apdu, _encode_AARQ_apdu } from "@wildboar/acse/src/lib/modules/ACSE-1/AARQ-apdu.ta";
import { AARE_apdu, _decode_AARE_apdu } from "@wildboar/acse/src/lib/modules/ACSE-1/AARE-apdu.ta";

export
interface ISOTransportOverTCPStack {
    network: ITOTSocket;
    transport: TransportConnection;
    session: SessionServiceConnectionState;
    presentation: PresentationConnection;
    acse: ACPMState;
}
