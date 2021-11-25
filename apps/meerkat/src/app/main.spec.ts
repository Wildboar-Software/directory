import { ASN1Element } from "asn1-ts";
import { BER } from "asn1-ts/dist/node/functional";
import main from "./main";
import * as net from "net";
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

function frame (ber: ASN1Element): Buffer {
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

describe("Meerkat directory server", () => {
    it.skip("starts successfully", (done) => {
        const PORT: number = 23230;
        Object.assign(process.env, {
            PORT: PORT.toString(10),
        });
        main()
            .then(() => {
                const client = net.createConnection({
                    host: "localhost",
                    port: PORT,
                }, () => {
                    client.on("data", (data) => {
                        done();
                    });
                    client.on("error", (err) => {
                        done(err);
                    });
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
                    client.write(frame(_encode_IDM_PDU(dapBind, BER)));
                });
            });
    });
});
