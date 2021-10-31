import type { ClientConnection, ConnectionStatistics } from "@wildboar/meerkat-types";

export
function getConnectionStatistics (conn: ClientConnection): ConnectionStatistics {
    return {
        remoteFamily: conn.socket.remoteFamily,
        remoteAddress: conn.socket.remoteAddress,
        remotePort: conn.socket.remotePort,
    };
}

export default getConnectionStatistics;
