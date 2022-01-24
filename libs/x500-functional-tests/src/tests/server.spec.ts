import { Readable } from "stream";
import * as net from "net";
import { strict as assert } from "assert";
import { ASN1Element } from "asn1-ts";
import { BER, DER, _encodeObjectIdentifier } from "asn1-ts/dist/node/functional";
import { IDMConnection } from "@wildboar/idm";
import {
    DirectoryBindArgument,
    _encode_DirectoryBindArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/DirectoryBindArgument.ta";
import {
    IdmBind,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IdmBind.ta";
import {
    _encode_IDM_PDU,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IDM-PDU.ta";
import {
    dap_ip,
} from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dap-ip.oa";
import {
    TLSResponse_success,
    TLSResponse_operationsError,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/TLSResponse.ta";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import {
    commonName,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
import {
    _encode_UnboundedDirectoryString,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/UnboundedDirectoryString.ta";
import {
    applicationProcess,
} from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/applicationProcess.oa";
import {
    administrativeRole,
} from "@wildboar/x500/src/lib/modules/InformationFramework/administrativeRole.oa";
import {
    objectClass,
} from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
import {
    id_ar_autonomousArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-autonomousArea.va";
import type {
    Code,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import * as crypto from "crypto";
import type { ResultOrError } from "@wildboar/x500/src/lib/types/ResultOrError";
import {
    addEntry,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/addEntry.oa";
import {
    AddEntryArgument,
    _encode_AddEntryArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AddEntryArgument.ta";
import {
    AddEntryArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AddEntryArgumentData.ta";
import {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import {
    RelativeDistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/RelativeDistinguishedName.ta";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
import {
    read,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/read.oa";
import {
    ReadArgument,
    _encode_ReadArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadArgument.ta";
import {
    ReadArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadArgumentData.ta";
import { LDAPSocket } from "@wildboar/ldap-socket";
import {
    LDAPMessage,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPMessage.ta";
import {
    LDAPResult_resultCode_success,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult-resultCode.ta";
import {
    BindRequest,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/BindRequest.ta";
import {
    SearchRequest,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/SearchRequest.ta";
import {
    SearchRequest_scope_baseObject,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/SearchRequest-scope.ta";
import {
    SearchRequest_derefAliases_neverDerefAliases,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/SearchRequest-derefAliases.ta";

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

function frame(ber: ASN1Element): Buffer {
    const data = ber.toBytes();
    const lengthBytes = Buffer.allocUnsafe(4);
    lengthBytes.writeUInt32BE(data.length);
    return Buffer.from([
        0x01, // Version 1
        0x01, // Final packet
        ...lengthBytes,
        ...Buffer.from(data),
    ]);
}

async function connect (): Promise<IDMConnection> {
    const dba = new DirectoryBindArgument(
        undefined,
        undefined,
    );
    const dapBind = {
        bind: new IdmBind(
            dap_ip["&id"]!,
            undefined,
            undefined,
            _encode_DirectoryBindArgument(dba, BER),
        ),
    };
    const client = net.createConnection({
        host: HOST,
        port: PORT,
    }, () => {
        client.write(frame(_encode_IDM_PDU(dapBind, BER)));
    });
    const idm = new IDMConnection(client, {
        rejectUnauthorized: false, // Just to ignore cert issues for the moment.
    });
    await new Promise((resolve, reject) => {
        idm.events.once("bindError", (err) => {
            reject(err);
        });
        idm.events.once("bindResult", (result) => {
            resolve(result);
        });
    });
    return idm;
}

async function reconnect (socket: net.Socket): Promise<IDMConnection> {
    const dba = new DirectoryBindArgument(
        undefined,
        undefined,
    );
    const dapBind = {
        bind: new IdmBind(
            dap_ip["&id"]!,
            undefined,
            undefined,
            _encode_DirectoryBindArgument(dba, BER),
        ),
    };
    socket.write(frame(_encode_IDM_PDU(dapBind, BER)));
    const idm = new IDMConnection(socket, {
        rejectUnauthorized: false, // Just to ignore cert issues for the moment.
    });
    await new Promise((resolve, reject) => {
        idm.events.once("bindError", (err) => {
            reject(err);
        });
        idm.events.once("bindResult", (result) => {
            resolve(result);
        });
    });
    return idm;
}

function writeOperation(
    connection: IDMConnection,
    opCode: Code,
    argument: ASN1Element,
): Promise<ResultOrError> {
    const invokeID = crypto.randomInt(1_000_000);
    return new Promise((resolve) => {
        connection.events.on(invokeID.toString(), (roe: ResultOrError) => {
            if ("error" in roe) {
                resolve(roe);
            } else {
                resolve({
                    invokeId: {
                        present: invokeID,
                    },
                    opCode: opCode,
                    result: roe.result,
                });
            }
        });
        connection.writeRequest(
            invokeID,
            opCode,
            argument,
        );
    });
}


function createAddEntryArguments(
    dn: DistinguishedName,
    attributes: Attribute[],
): AddEntryArgument {
    const reqData = new AddEntryArgumentData(
        {
            rdnSequence: dn,
        },
        attributes,
    );
    const arg: AddEntryArgument = {
        unsigned: reqData,
    };
    return arg;
}

function createTestRDN (str: string): RelativeDistinguishedName {
    const encodedCN = _encode_UnboundedDirectoryString({
        uTF8String: str,
    }, DER);
    return [
        new AttributeTypeAndValue(
            commonName["&id"]!,
            encodedCN,
        ),
    ];
}

function createTestRootDN(
    testId: string,
): DistinguishedName {
    return [
        createTestRDN(testId),
    ];
}

async function createTestRootNode(
    connection: IDMConnection,
    testId: string,
): Promise<ResultOrError> {
    const encodedCN = _encode_UnboundedDirectoryString({
        uTF8String: testId,
    }, DER);

    const addTestRoot = createAddEntryArguments(
        createTestRootDN(testId),
        [
            new Attribute(
                administrativeRole["&id"],
                [
                    _encodeObjectIdentifier(id_ar_autonomousArea, DER),
                ],
                undefined,
            ),
            new Attribute(
                objectClass["&id"],
                [
                    _encodeObjectIdentifier(applicationProcess["&id"], DER),
                ],
                undefined,
            ),
            new Attribute(
                commonName["&id"],
                [
                    encodedCN,
                ],
                undefined,
            ),
        ],
    );
    const invokeID = crypto.randomInt(1_000_000);
    return new Promise((resolve) => {
        connection.events.on(invokeID.toString(), (roe: ResultOrError) => {
            if ("error" in roe) {
                resolve(roe);
            } else {
                resolve({
                    invokeId: {
                        present: invokeID,
                    },
                    opCode: addEntry["&operationCode"]!,
                    result: roe.result,
                });
            }
        });
        connection!.writeRequest(
            invokeID,
            addEntry["&operationCode"]!,
            _encode_AddEntryArgument(addTestRoot, DER),
        );
    });
}

describe("Meerkat DSA", () => {

    it.todo("Memory leaks do not occur");
    it.todo("Requests are rejected when the DSA is hibernating");

    it("An idle TCP socket is eventually closed", (done) => {
        const client = net.createConnection({
            host: HOST,
            port: PORT,
        }, () => {});
        // We need to make sure that TCP keep alive cannot be used to circumvent this, too!
        client.setKeepAlive(true);
        client.on("close", () => {
            done();
        });
    }, 60000); // Meerkat DSA's default TCP timeout is 30s.

    it("StartTLS cannot be used to recursively encapsulate traffic", async () => {
        const idm = await connect();
        const response1 = await new Promise<number>((resolve) => {
            idm.events.once("tLSResponse", resolve);
            idm.writeStartTLS();
        });
        expect(response1).toBe(TLSResponse_success);
        await sleep(1000);
        const response2 = await new Promise<number>((resolve, reject) => {
            idm.events.on("error_", reject);
            idm.events.on("abort", reject);
            idm.events.on("reject", reject);
            idm.events.once("tLSResponse", resolve);
            idm.writeStartTLS();
        });
        expect(response2).toBe(TLSResponse_operationsError);
        // TODO: Try a request here.
    }, 8000);

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

    it.only("Avoids denial of service by IDM-based Slow Loris Attacks", (done) => {
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

    it("permits recycling of a TCP socket via IDM re-binding", async () => {
        const idm = await connect();
        idm.writeUnbind();
        await sleep(1000);
        const idm2 = await reconnect(idm.s);
        const testId = `idm.rebinding-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(idm2!, testId);
        }
        const dn = createTestRootDN(testId);
        const reqData: ReadArgumentData = new ReadArgumentData(
            {
                rdnSequence: dn,
            },
        );
        const arg: ReadArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            idm2!,
            read["&operationCode"]!,
            _encode_ReadArgument(arg, DER),
        );
        assert("result" in result);
        assert(result.result);
    });

    it("permits recycling of a TCP socket via LDAP re-binding", async () => {
        const socket = net.createConnection({
            host: HOST,
            port: LDAP_PORT,
        });
        const ldapSocket = new LDAPSocket(socket);
        await new Promise<void>((resolve, reject) => {
            ldapSocket.on("connect", () => {
                ldapSocket.on("1", (message: LDAPMessage) => {
                    if (
                        ("bindResponse" in message.protocolOp)
                        && (message.protocolOp.bindResponse.resultCode === LDAPResult_resultCode_success)
                    ) {
                        resolve();
                    } else {
                        reject();
                    }
                });
                ldapSocket.writeMessage(new LDAPMessage(
                    1,
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
                ));
            });
        });

        ldapSocket.writeMessage(new LDAPMessage(
            2,
            {
                unbindRequest: null,
            },
            undefined,
        ));

        await sleep(1000); // There is no response for unbind.

        await new Promise<void>((resolve, reject) => {
            ldapSocket.on("3", (message: LDAPMessage) => {
                if (
                    ("bindResponse" in message.protocolOp)
                    && (message.protocolOp.bindResponse.resultCode === LDAPResult_resultCode_success)
                ) {
                    resolve();
                } else {
                    reject();
                }
            });
            ldapSocket.writeMessage(new LDAPMessage(
                3,
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
            ));
        });

        await new Promise<void>((resolve, reject) => {
            ldapSocket.on("4", (message: LDAPMessage) => {
                if (
                    ("searchResDone" in message.protocolOp)
                    || ("searchResEntry" in message.protocolOp)
                    // && (message.protocolOp.searchResDone.resultCode === LDAPResult_resultCode_success)
                ) {
                    resolve();
                } else {
                    reject();
                }
            });
            ldapSocket.writeMessage(new LDAPMessage(
                4,
                {
                    searchRequest: new SearchRequest(
                        Buffer.from("cn=subschema", "utf-8"),
                        SearchRequest_scope_baseObject,
                        SearchRequest_derefAliases_neverDerefAliases,
                        1,
                        0,
                        false,
                        {
                            and: [],
                        },
                        [Buffer.from("*", "utf-8")],
                    ),
                },
                undefined,
            ));
        });

        // If it made it this far, the test passed.
    });

});
