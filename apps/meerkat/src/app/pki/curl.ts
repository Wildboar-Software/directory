import { Buffer } from "node:buffer";
import { BERElement, ASN1TruncationError } from "@wildboar/asn1";
import { DER } from "@wildboar/asn1/functional";
import { URL } from "node:url";
import * as net from "node:net";
import { randomInt, randomUUID } from "node:crypto";
import { connect, TlsOptions } from "node:tls";
import {
    LDAPMessage,
    _decode_LDAPMessage,
    _encode_LDAPMessage,
    BindRequest,
    SearchRequest,
    SearchRequest_scope_baseObject,
    SearchRequest_derefAliases_derefFindingBaseObj,
    SearchResultEntry,
    resultCodes,
} from "@wildboar/ldap";
import * as ftp from "basic-ftp";
import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";

const { success } = resultCodes;

// Yes, I realize I could have done this with .reduce(), but for loops are more performant.
function getReceivedDataSize (chunks: Buffer[]) {
    let sum: number = 0;
    for (const chunk in chunks) {
        sum += chunk.length;
    }
    return sum;
}

/**
 * @summary Fetch a blob using LDAP
 * @description
 *
 * Fetches a blob using the Lightweight Directory Access Protocol (LDAP).
 *
 * @param url The URL of the thing to be fetched using a `search` operation with scope of `baseObject`
 * @param attributes The attributes to be fetched
 * @param tlsOptions Options pertaining to TLS, if it is used
 * @param timeoutInMilliseconds The number of milliseconds before the fetch times out
 * @param sizeLimit The maximum size of the body, beyond which this fetch will be abandoned.
 * @returns A buffer representing the fetched blob, or `null` if it could not be obtained.
 *
 * @async
 * @function
 */
export
function curlLDAP (
    url: URL,
    attributes: string[],
    tlsOptions?: TlsOptions,
    timeoutInMilliseconds: number = 5000,
    sizeLimit: number = 1_000_000,
): Promise<Buffer[] | null> {
    const firstMessageId: number = randomInt(1, 100_000_000);
    let messageId: number = firstMessageId;
    const bind: LDAPMessage = new LDAPMessage(
        messageId,
        {
            bindRequest: new BindRequest(
                3,
                new Uint8Array(),
                {
                    simple: new Uint8Array(),
                },
            ),
        },
        undefined,
    );
    messageId++;
    const read: LDAPMessage = new LDAPMessage(
        messageId,
        {
            searchRequest: new SearchRequest(
                Buffer.from(decodeURIComponent(url.pathname.slice(1))),
                SearchRequest_scope_baseObject,
                SearchRequest_derefAliases_derefFindingBaseObj,
                1,
                Math.max(Math.floor(timeoutInMilliseconds / 1000), 1),
                false,
                {
                    present: Buffer.from("objectClass"),
                },
                attributes.map((attr) => Buffer.from(attr)),
            ),
        },
        undefined,
    );
    messageId++;
    const unbind: LDAPMessage = new LDAPMessage(
        messageId,
        {
            unbindRequest: null,
        },
        undefined,
    );

    messageId++;
    const conn = (url.protocol.toLowerCase() === "ldaps:")
        ? connect({
            ...(tlsOptions ?? {}),
            host: url.hostname,
            port: Number.parseInt(url.port, 10),
            timeout: timeoutInMilliseconds,
            pskCallback: undefined,
        })
        : net.createConnection({
            host: url.hostname,
            port: Number.parseInt(url.port, 10),
            timeout: timeoutInMilliseconds,
        });

    let receivedData: Buffer = Buffer.allocUnsafe(0);
    return new Promise((resolve, reject) => {
        const canceler = setTimeout(() => {
            reject("7c443498-a75c-4192-8ce4-2d6c68861874");
            conn.removeAllListeners();
            messageId++;
            conn.end();
        }, timeoutInMilliseconds);
        let entry: SearchResultEntry | undefined;
        function onFail (uuid: string) {
            reject(uuid);
            conn.removeAllListeners();
            conn.write(_encode_LDAPMessage(unbind, DER).toBytes());
            conn.end();
        }
        function onMessage (msg: LDAPMessage) {
            if ("bindResponse" in msg.protocolOp) {
                if (msg.protocolOp.bindResponse.resultCode !== success) {
                    onFail("4250a2d1-3e71-48d8-8121-40225d921060");
                    return;
                }
                conn.write(_encode_LDAPMessage(read, DER).toBytes());
            } else if ("searchResEntry" in msg.protocolOp) {
                if (entry) { // There should only be one entry.
                    onFail("9887a562-4eba-4b67-9f10-e64b2050afcc");
                    return;
                }
                entry = msg.protocolOp.searchResEntry;
            } else if ("searchResDone" in msg.protocolOp) {
                if (entry) {
                    resolve(entry.attributes.flatMap((attr) => attr
                        .vals
                        .map((val) => Buffer.from(val))));
                    clearTimeout(canceler);
                    conn.removeAllListeners();
                    conn.write(_encode_LDAPMessage(unbind, DER).toBytes());
                    conn.end();
                } else {
                    onFail("37448a44-8fe3-4e70-9ee4-5bc521ef36a8");
                }
                return;
            } else { // Unexpected response.
                onFail("364cf9fa-a741-4601-83a0-61c60cda6f7b");
                return;
            }
        }
        conn.on("connect", () => {
            conn.write(_encode_LDAPMessage(bind, DER).toBytes());
        });
        conn.on("data", (chunk: Buffer) => {
            receivedData = Buffer.concat([ receivedData, chunk ]);
            if (receivedData.length > sizeLimit) {
                reject("b51f9a39-8419-4db4-895d-deb724cb4949");
                conn.removeAllListeners();
                conn.end();
                return;
            }
            let bytesRead = 0;
            while (bytesRead < receivedData.length) {
                const el = new BERElement();
                try {
                    bytesRead += el.fromBytes(receivedData);
                } catch (e) {
                    if (e instanceof ASN1TruncationError) {
                        break;
                    } else {
                        reject("34b787df-f85e-4db2-912c-b8b4c0d58eb8");
                        conn.removeAllListeners();
                        conn.end();
                        return;
                    }
                }
                const receivedMessage: LDAPMessage = _decode_LDAPMessage(el);
                onMessage(receivedMessage);
                receivedData = receivedData.subarray(bytesRead);
                bytesRead = 0;
            }
        });
    });
}

/**
 * @summary Fetch a blob using LDAP
 * @description
 *
 * Fetches a blob using the File Transfer Protocol (FTP).
 *
 * Unfortunately, it does not seem like the `basic-ftp` NPM package supports
 * downloads into an in-memory buffer, so this implementation saves the download
 * to a temporary location on disk, then immediately reads it into memory.
 *
 * @param url The URL of the thing to be fetched using a `search` operation with scope of `baseObject`
 * @param tlsOptions Options pertaining to TLS, if it is used
 * @param timeoutInMilliseconds The number of milliseconds before the fetch times out
 * @param sizeLimit The maximum size of the body, beyond which this fetch will be abandoned.
 * @param debugLog A function that logs debug-level log messages
 * @returns A buffer representing the fetched blob, or `null` if it could not be obtained.
 *
 * @async
 * @function
 */
export
async function curlFTP (
    url: URL,
    tlsOptions?: TlsOptions,
    timeoutInMilliseconds: number = 5000,
    sizeLimit: number = 1_000_000,
    debugLog?: (message: string) => void,
): Promise<Buffer | null> {
    const client = new ftp.Client(timeoutInMilliseconds);
    const tempDir = await mkdtemp(path.join(os.tmpdir(), "ftp_dl_"));
    const randomBaseName: string = randomUUID();
    const fileName: string = `${randomBaseName}.crl`;
    const localFilePath: string = path.join(tempDir, fileName);
    try {
        await client.access({
            host: url.hostname,
            port: url.port?.length
                ? Number.parseInt(url.port, 10)
                : undefined,
            user: url.username,
            password: url.password,
            secure: url.protocol.toLowerCase().startsWith("ftps:"),
            secureOptions: {
                ...tlsOptions,
                pskCallback: undefined,
            },
        });
        if (debugLog) {
            client.ftp.log = debugLog;
        }
        const res = await client.size(url.pathname);
        if (res > sizeLimit) {
            return null;
        }
        client.trackProgress((info) => {
            // REVIEW: I am not 100% sure this will work.
            // It might throw from somewhere else.
            if (info.bytesOverall > sizeLimit) {
                throw new Error();
            }
        });
        await client.downloadTo(localFilePath, url.pathname);
        const stats = await stat(localFilePath);
        if (stats.size > sizeLimit) {
            return null;
        }
        const ret = await readFile(localFilePath);
        return ret;
    } catch (e) {
        return null;
    } finally {
        client.close();
        rm(localFilePath)
            .then()
            .catch((e) => console.error(e));
    }
}
