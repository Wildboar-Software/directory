import type { Socket } from "node:net";
import { TLSSocket } from "node:tls";

export
function getLogInfoFromTLSSocket (socket: TLSSocket) {
    const cipher = socket.getCipher();
    return {
        tls_alpn_protocol: socket.alpnProtocol,
        tls_authz_error: socket.authorizationError?.message,
        tls_authorized: socket.authorized,
        tls_cipher_name: cipher.name,
        tls_cipher_id: cipher.standardName,
        tls_cipher_version: cipher.version,
        tls_version: socket.getProtocol(),
        tls_session_reused: socket.isSessionReused(),
    };
}

/**
 * @summary Gets an object containing loggable key-value pairs from a socket.
 * @description
 *
 * This function takes a TCP Socket or TLS Socket and returns an object
 * containing useful contextual information that is ready to be included in
 * log events, such as the socket address and port.
 *
 * @param socket The socket from which to derive the loggable information.
 * @returns An object containing key-value pairs of loggable information.
 *
 * @function
 */
export
function getLogInfoFromSocket (socket: Socket | TLSSocket) {
    return {
        remoteAddress: socket.remoteAddress,
        remotePort: socket.remotePort,
        localAddress: socket.localAddress,
        localPort: socket.localPort,
        bytesRead: socket.bytesRead,
        bytesWritten: socket.bytesWritten,
        readable: socket.readable,
        readableAborted: socket.readableAborted,
        readableDidRead: socket.readableDidRead,
        readableEncoding: socket.readableEncoding,
        readableEnded: socket.readableEnded,
        readableFlowing: socket.readableFlowing,
        readableHighWaterMark: socket.readableHighWaterMark,
        readableLength: socket.readableLength,
        readableObjectMode: socket.readableObjectMode,
        readyState: socket.readyState,
        writable: socket.writable,
        writableCorked: socket.writableCorked,
        writableEnded: socket.writableEnded,
        writableFinished: socket.writableFinished,
        writableHighWaterMark: socket.writableHighWaterMark,
        writableLength: socket.writableLength,
        writableNeedDrain: socket.writableNeedDrain,
        writableObjectMode: socket.writableObjectMode,
        allowHalfOpen: socket.allowHalfOpen,
        closed: socket.closed,
        connecting: socket.connecting,
        destroyed: socket.destroyed,
        errored: socket.errored,
        timeout: socket.timeout,
        ...((socket instanceof TLSSocket)
            ? getLogInfoFromTLSSocket(socket)
            : {}),
    };
}
