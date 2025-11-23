import { IDMConnection } from "@wildboar/idm";
import { getLogInfoFromSocket } from "./getLogInfoFromSocket.js";

export
function getLogInfoFromIDM (idm: IDMConnection) {
    return {
        ...getLogInfoFromSocket(idm.socket),
        idm_frames_received: idm.getFramesReceived,
        idm_buffer_size: idm.getBufferSize(),
        idm_accumulated_pdu_size: idm.getAccumulatedPDUSize(),
        idm_segments_in_pdu: idm.getNumberOfSegmentsInPDU(),
        idm_local_status: idm.localStatus,
        idm_remote_status: idm.remoteStatus,
    };
}
