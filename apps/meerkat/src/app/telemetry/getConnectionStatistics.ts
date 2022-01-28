import type { ClientAssociation, ConnectionStatistics } from "@wildboar/meerkat-types";

export
function getConnectionStatistics (conn: ClientAssociation): ConnectionStatistics {
    return {
        remoteFamily: conn.socket.remoteFamily,
        remoteAddress: conn.socket.remoteAddress,
        remotePort: conn.socket.remotePort,
    };
}

export default getConnectionStatistics;
