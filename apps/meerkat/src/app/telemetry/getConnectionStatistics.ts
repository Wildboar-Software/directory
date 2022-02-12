import type { ClientAssociation, ConnectionStatistics } from "@wildboar/meerkat-types";

export
function getConnectionStatistics (assn: ClientAssociation): ConnectionStatistics {
    return {
        remoteFamily: assn.socket.remoteFamily,
        remoteAddress: assn.socket.remoteAddress,
        remotePort: assn.socket.remotePort,
    };
}

export default getConnectionStatistics;
