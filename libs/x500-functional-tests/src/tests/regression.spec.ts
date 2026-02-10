import {
    ASN1Construction,
    ASN1Element,
    ASN1TagClass,
    ASN1UniversalType,
    BERElement,
    FALSE_BIT,
    TRUE_BIT,
} from "@wildboar/asn1";
import { BER, _encodeInteger, _encodePrintableString } from "@wildboar/asn1/functional";
import { IDMConnection } from "@wildboar/idm";
import * as crypto from "node:crypto";
import type { ResultOrError } from "@wildboar/x500";
import {
    ServiceControlOptions,
    ServiceControlOptions_manageDSAIT,
    _encode_SearchArgument,
    _decode_SearchResult,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    Code,
    _encode_Code,
} from "@wildboar/x500/CommonProtocolSpecification";
import { connect, frame, } from "../utils";
import { ListArgumentData, ListArgument, _encode_ListArgument, list } from "@wildboar/x500/DirectoryAbstractService";
import { IDM_PDU, Request, _encode_IDM_PDU } from "@wildboar/x500/IDMProtocolSpecification";

vi.setConfig({ testTimeout: 30_000 });

const serviceControlOptions: ServiceControlOptions = new Uint8ClampedArray(Array(9).fill(FALSE_BIT));
// Necessary to make countries administrative points.
serviceControlOptions[ServiceControlOptions_manageDSAIT] = TRUE_BIT;

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

describe("Meerkat DSA", () => {

    let connection: IDMConnection | undefined;

    beforeEach(async () => {
        if (!connection) {
            connection = await connect();
        }
    });

    test("does not crash after encountering a malformed invoke ID", async () => {
        const reqData = new ListArgumentData(
            {
                rdnSequence: [],
            },
        );
        const arg: ListArgument = {
            unsigned: reqData,
        };
        const iid = new BERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.integer,
            new Uint8Array([ 0x00, 0x00, 0x00, 0x06 ]),
        );
        function create_valid_request () {
            const idm: IDM_PDU = {
                request: new Request(
                    crypto.randomInt(100_000),
                    list["&operationCode"]!,
                    _encode_ListArgument(arg, BER),
                )
            };
            return _encode_IDM_PDU(idm, BER);
        }

        const invalid_pdu = new BERElement(
            ASN1TagClass.context,
            ASN1Construction.constructed,
            3,
            BERElement.fromSequence([
                iid,
                _encode_Code(list["&operationCode"]!, BER),
                _encode_ListArgument(arg, BER),
            ]),
        );
        const pdus = Buffer.concat([
            frame(create_valid_request()),
            frame(create_valid_request()),
            frame(create_valid_request()),
            frame(create_valid_request()),
            frame(create_valid_request()),
            frame(invalid_pdu),
        ]);
        connection?.socket.write(pdus);
        await new Promise((r) => setTimeout(r, 3000));
        await connect();
    });
});
