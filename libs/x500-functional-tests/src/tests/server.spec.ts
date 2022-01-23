import { Readable } from "stream";
import * as net from "net";
import { strict as assert } from "assert";

jest.setTimeout(5000);

function sleep (ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// FIXME: It seemed like IDM v2 had some strange issue.
function *generateGiantIDMv1Packet (size: number = 10_000_000): IterableIterator<Buffer> {
    yield Buffer.from([
        // 0x02, // Version 2
        0x01, // Version 1
        0x01, // Final
        // 0x00, 0x00, // Supported encodings
    ]);
    const lengthBytes = (Buffer.allocUnsafe(4))
    lengthBytes.writeUInt32BE(size);
    yield lengthBytes;
    for (let i = 0; i < size; i += 1000000) {
        yield Buffer.allocUnsafe(1000000);
    }
}

const giantIDMv1Packet = Readable.from(generateGiantIDMv1Packet());

function *readSlowLorisIDMv1Packet (size: number = 10_000): IterableIterator<Buffer> {
    yield Buffer.from([
        // 0x02, // Version 2
        0x01, // Version 1
        0x01, // Final
        // 0x00, 0x00, // Supported encodings
    ]);
    const lengthBytes = (Buffer.allocUnsafe(4))
    lengthBytes.writeUInt32BE(size);
    yield lengthBytes;
    for (let i = 0; i < size; i += 1) {
        yield Buffer.alloc(1);
    }
}

function *readSlowLorisLDAPMessage (size: number = 10_000): IterableIterator<Buffer> {
    yield Buffer.from([
        0x30, // UNIVERSAL SEQUENCE
        0x84, // Definite long form: the length is encoded on the next four bytes.
    ]);
    const lengthBytes = (Buffer.allocUnsafe(4))
    lengthBytes.writeUInt32BE(size);
    yield lengthBytes;
    for (let i = 0; i < size; i += 1) {
        yield Buffer.alloc(1);
    }
}

function *generateGiantLDAPMessage (size: number = 10_000_000): IterableIterator<Buffer> {
    yield Buffer.from([
        0x30, // UNIVERSAL SEQUENCE
        0x84, // Definite long form: the length is encoded on the next four bytes.
    ]);
    const lengthBytes = (Buffer.allocUnsafe(4))
    lengthBytes.writeUInt32BE(size);
    yield lengthBytes;
    for (let i = 0; i < size; i += 1000000) {
        yield Buffer.allocUnsafe(1000000);
    }
}

const giantLDAPMessage = Readable.from(generateGiantLDAPMessage());

const HOST: string = "localhost";
const PORT: number = 4632;
const LDAP_PORT: number = 1389;

describe("Meerkat DSA", () => {

    it.todo("Server comes online");
    it.todo("Server shuts down gracefully");
    it.todo("Server checks for updates successfully");
    it.todo("Server hibernates when the sentinel indicates a security issues");

    it.skip("Memory leaks do not occur", async () => {

    });

    it.skip("An idle IDM socket is eventually closed", async () => {

    });

    it.skip("An idle TCP socket is eventually closed", async () => {

    });

    it.skip("An idle LDAP connection is eventually closed", async () => {

    });

    it.skip("StartTLS cannot be used to recursively encapsulate traffic", async () => {

    });

    // Manual-testing only.
    it.skip("The DSA refuses an excessive number of connections from the same remote address", async () => {
        for (let i = 0; i < 100; i++) {
            console.log(i);
            net.createConnection({
                host: HOST,
                port: PORT,
            }, () => {});
            await sleep(100);
        }
    });

    it.skip("Requests are rejected when the DSA is hibernating", async () => {

    });

    it("Avoids denial-of-service by large IDM packets", (done) => {
        const errorHandler = jest.fn();
        const closeHandler = () => {
            expect(errorHandler).toHaveBeenCalled();
            giantIDMv1Packet.unpipe(client);
            done();
        };
        const client = net.createConnection({
            host: HOST,
            port: PORT,
        }, () => {
            client.on("error", errorHandler);
            client.on("close", closeHandler);
            giantIDMv1Packet.on("end", () => {
                assert(false);
            });
            giantIDMv1Packet.on("close", () => {
                assert(false);
            });
            giantIDMv1Packet.pipe(client);
        });
    });

    // TODO: This was disabled because of a bug I found in asn1-ts where a
    // thrown ASN1Truncation error is not instanceof ASN1TruncationError, but
    // only an ASN1Error.
    it("Avoids denial-of-service by large LDAP messages", (done) => {
        const errorHandler = jest.fn();
        const closeHandler = () => {
            expect(errorHandler).toHaveBeenCalled();
            giantLDAPMessage.unpipe(client);
            done();
        };
        const client = net.createConnection({
            host: HOST,
            port: LDAP_PORT,
        }, () => {
            client.on("error", errorHandler);
            client.on("close", closeHandler);
            giantLDAPMessage.on("end", () => {
                assert(false);
            });
            giantLDAPMessage.on("close", () => {
                assert(false);
            });
            giantLDAPMessage.pipe(client);
        });
    });

    it("Rejects any LDAP data that does not start with 0x30 (UNIVERSAL SEQUENCE)", (done) => {
        const errorHandler = jest.fn();
        const closeHandler = () => {
            expect(errorHandler).toHaveBeenCalled();
            done();
        };
        const client = net.createConnection({
            host: HOST,
            port: LDAP_PORT,
        }, () => {
            client.on("error", errorHandler);
            client.on("close", closeHandler);
            client.on("end", () => {
                done();
            });
            client.write(Buffer.from([ 0x88 ]));
        });
    });

    it("Avoids denial of service by IDM-based Slow Loris Attacks", (done) => {
        const closeHandler = () => {
            done();
        };
        const client = net.createConnection({
            host: HOST,
            port: PORT,
        }, async () => {
            client.on("close", closeHandler);
            // Write one byte of the payload per second.
            for (const tinyChunk of readSlowLorisIDMv1Packet()) {
                client.write(tinyChunk);
                await sleep(1000);
            }
        });
    }, 90000); // Timeout greater than one minute so slow loris protection kicks in.

    it("Avoids denial of service by LDAP-based Slow Loris Attacks", (done) => {
        const closeHandler = () => {
            done();
        };
        const client = net.createConnection({
            host: HOST,
            port: LDAP_PORT,
        }, async () => {
            client.on("close", closeHandler);
            // Write one byte of the payload per second.
            for (const tinyChunk of readSlowLorisLDAPMessage()) {
                client.write(tinyChunk);
                await sleep(1000);
            }
        });
    }, 90000); // Timeout greater than one minute so slow loris protection kicks in.

    it.todo("permits recycling of a TCP socket via IDM re-binding");
    it.todo("permits recycling of a TCP socket via LDAP re-binding");

});
