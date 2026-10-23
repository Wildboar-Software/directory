import { createServer, type AddressInfo, type Server } from "node:net";
import { afterEach, describe, expect, it } from "vitest";
import { BERElement, ObjectIdentifier, TRUE_BIT } from "@wildboar/asn1";
import { DER, _encodeUTF8String } from "@wildboar/asn1/functional";
import { IDMConnection } from "@wildboar/idm";
import { dap_ip, dop_ip } from "@wildboar/x500/DirectoryIDMProtocols";
import {
    DirectoryBindResult,
    _decode_DirectoryBindArgument,
    _encode_DirectoryBindResult,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    DSABindArgument,
    _decode_DSABindArgument,
    _encode_DSABindResult,
} from "@wildboar/x500/DistributedOperations";
import { AttributeTypeAndValue } from "@wildboar/x500/InformationFramework";
import { read } from "@wildboar/x500/DirectoryAbstractService";
import type { Context } from "../types.js";
import connect, { DirectoryBindRejected } from "./connect.js";

const ctx = {
    log: {
        debug: () => {},
        info: () => {},
        warn: () => {},
        error: () => {},
    },
    attributes: new Map(),
    objectClasses: new Map(),
    ldapSyntaxes: new Map(),
    contextTypes: new Map(),
} as unknown as Context;

const commonName = ObjectIdentifier.fromParts([ 2, 5, 4, 3 ]);
const calledAETitle = [[
    new AttributeTypeAndValue(commonName, _encodeUTF8String("dsa", DER)),
]];
const callingAETitle = [[
    new AttributeTypeAndValue(commonName, _encodeUTF8String("client", DER)),
]];

function nullElement (): BERElement {
    const el = new BERElement();
    el.fromBytes(new Uint8Array([ 0x05, 0x00 ]));
    return el;
}

async function listen (server: Server): Promise<number> {
    await new Promise<void>((resolve) => {
        server.listen(0, "127.0.0.1", () => resolve());
    });
    const address = server.address() as AddressInfo;
    return address.port;
}

describe("connect", () => {
    const servers: Server[] = [];

    afterEach(async () => {
        await Promise.all(servers.splice(0).map((server) => new Promise<void>((resolve, reject) => {
            server.close((error) => error ? reject(error) : resolve());
        })));
    });

    it("binds with the DAP client and exchanges an operation", async () => {
        const server = createServer((socket) => {
            const idm = new IDMConnection(socket);
            idm.events.on("bind", (bind) => {
                const argument = _decode_DirectoryBindArgument(bind.argument);
                expect(argument.credentials && "simple" in argument.credentials).toBe(true);
                expect(bind.protocolID.isEqualTo(dap_ip["&id"]!)).toBe(true);
                expect(bind.calledAETitle && "directoryName" in bind.calledAETitle).toBe(true);
                expect(bind.callingAETitle && "directoryName" in bind.callingAETitle).toBe(true);
                idm.writeBindResult(
                    bind.protocolID,
                    _encode_DirectoryBindResult(new DirectoryBindResult(
                        undefined,
                        new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT ]),
                    ), DER),
                );
            });
            idm.events.on("request", (request) => {
                expect(request.opcode).toEqual(read["&operationCode"]);
                idm.writeResult(request.invokeID, request.opcode, nullElement());
            });
        });
        servers.push(server);
        const port = await listen(server);
        const connection = await connect(
            ctx,
            undefined,
            `idm://127.0.0.1:${port}`,
            "",
            undefined,
            dap_ip["&id"]!,
            undefined,
            undefined,
            calledAETitle,
            undefined,
            callingAETitle,
        );
        expect(connection).toBeDefined();
        const outcome = await connection!.writeOperation({
            opCode: read["&operationCode"]!,
            argument: nullElement(),
        });
        expect("result" in outcome).toBe(true);
        if ("result" in outcome) {
            expect(Array.from(outcome.result!.toBytes())).toEqual([ 0x05, 0x00 ]);
        }
        await connection!.close();
    });

    it("binds with the DOP client", async () => {
        const server = createServer((socket) => {
            const idm = new IDMConnection(socket);
            idm.events.on("bind", (bind) => {
                const argument = _decode_DSABindArgument(bind.argument);
                expect(argument.credentials && "simple" in argument.credentials).toBe(true);
                expect(bind.protocolID.isEqualTo(dop_ip["&id"]!)).toBe(true);
                idm.writeBindResult(
                    bind.protocolID,
                    _encode_DSABindResult(new DSABindArgument(
                        undefined,
                        new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT ]),
                    ), DER),
                );
            });
        });
        servers.push(server);
        const port = await listen(server);
        const connection = await connect(
            ctx,
            undefined,
            `idm://127.0.0.1:${port}`,
            "",
            Buffer.from("secret"),
            dop_ip["&id"]!,
        );
        expect(connection).toBeDefined();
        await connection!.close();
    });

    it("rejects a directory bind error", async () => {
        const server = createServer((socket) => {
            const idm = new IDMConnection(socket);
            idm.events.on("bind", (bind) => {
                idm.writeBindError(bind.protocolID, nullElement());
            });
        });
        servers.push(server);
        const port = await listen(server);
        await expect(connect(
            ctx,
            undefined,
            `idm://127.0.0.1:${port}`,
            "",
        )).rejects.toBeInstanceOf(DirectoryBindRejected);
    });

    it("fails when nothing is listening", async () => {
        const probe = createServer();
        const port = await listen(probe);
        await new Promise<void>((resolve, reject) => {
            probe.close((error) => error ? reject(error) : resolve());
        });
        await expect(connect(
            ctx,
            undefined,
            `idm://127.0.0.1:${port}`,
            "",
        )).rejects.toThrow();
    });
});
