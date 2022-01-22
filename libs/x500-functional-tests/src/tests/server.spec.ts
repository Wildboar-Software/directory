import { Readable } from "stream";
import * as net from "net";
import { strict as assert } from "assert";

// jest.setTimeout(5000);

// FIXME: It seemed like IDM v2 had some strange issue.
function *generateGiantIDMPacket (size: number = 10_000_000): IterableIterator<Buffer> {
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

const giantIDMPacket = Readable.from(generateGiantIDMPacket());

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

    it.skip("The DSA refuses an excessive number of connections from the same remote address", async () => {

    });

    it.skip("Requests are rejected when the DSA is hibernating", async () => {

    });

    it.only("Avoids denial-of-service by large IDM packets", (done) => {
        const errorHandler = jest.fn();
        const closeHandler = () => {
            expect(errorHandler).toHaveBeenCalled();
            giantIDMPacket.unpipe(client);
            done();
        };
        const client = net.createConnection({
            host: HOST,
            port: PORT,
        }, () => {
            client.on("error", errorHandler);
            client.on("close", closeHandler);
            client.on("end", () => {
                giantIDMPacket.unpipe(client);
                done();
            });
            giantIDMPacket.on("end", () => {
                assert(false);
            });
            giantIDMPacket.on("close", () => {
                assert(false);
            });
            giantIDMPacket.pipe(client);
        });
    });

    it.skip("Avoids denial-of-service by large LDAP messages", (done) => {
        const errorHandler = jest.fn();
        const closeHandler = () => {
            expect(errorHandler).toHaveBeenCalled();
            giantLDAPMessage.unpipe(client);
            done();
        };
        const client = net.createConnection({
            host: HOST,
            port: LDAP_PORT,
            allowHalfOpen: false,
        }, () => {
            client.on("error", errorHandler);
            client.on("close", closeHandler);
            client.on("end", () => {
                console.log("ENDED");
                giantLDAPMessage.unpipe(client);
                done();
            });
            giantLDAPMessage.on("end", () => {
                assert(false);
            });
            giantLDAPMessage.on("close", () => {
                assert(false);
            });
            giantLDAPMessage.pipe(client, { end: false });
        });
    });

    it.skip("Avoids denial of service by IDM-based Slow Loris Attacks", async () => {

    });

    it.skip("Avoids denial of service by LDAP-based Slow Loris Attacks", async () => {

    });

});
