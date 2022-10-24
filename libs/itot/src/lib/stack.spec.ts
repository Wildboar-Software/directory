import { createConnection, createServer, Server } from "node:net";
import { create_itot_stack, ISOTransportOverTCPStack } from "./itot";
import {
    dispatch_P_DTreq,
} from "./presentation";
import {
    dispatch_A_ASCreq,
    dispatch_A_ASCrsp_accept,
    dispatch_A_RLSreq,
    dispatch_A_RLSrsp_accept,
} from "./acse";
import {
    User_data,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/User-data.ta";
import {
    PDV_list,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/PDV-list.ta";
import {
    Context_list_Item,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Context-list-Item.ta";
import {
    Result_list_Item,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Result-list-Item.ta";
import {
    Result_acceptance, Result_provider_rejection, Result_user_rejection,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Result.ta";
import {
    Result_acceptance as ACSEResult_acceptance,
} from "@wildboar/acse/src/lib/modules/ACSE-1/Result.ta";
import { ObjectIdentifier, External, INTEGER } from "asn1-ts";
import { Socket } from "node:net";
import { BER } from "asn1-ts/dist/node/functional";
import {
    AARQ_apdu,
    _encode_AARQ_apdu,
} from "@wildboar/acse/src/lib/modules/ACSE-1/AARQ-apdu.ta";
import {
    AARE_apdu,
    _encode_AARE_apdu,
} from "@wildboar/acse/src/lib/modules/ACSE-1/AARE-apdu.ta";
import {
    RLRQ_apdu,
    _encode_RLRQ_apdu,
} from "@wildboar/acse/src/lib/modules/ACSE-1/RLRQ-apdu.ta";
import {
    RLRE_apdu,
    _encode_RLRE_apdu,
} from "@wildboar/acse/src/lib/modules/ACSE-1/RLRE-apdu.ta";
import {
    _encode_ABRT_apdu,
} from "@wildboar/acse/src/lib/modules/ACSE-1/ABRT-apdu.ta";
import {
    DirectoryBindArgument,
    _encode_DirectoryBindArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/DirectoryBindArgument.ta";
import {
    DirectoryBindResult,
    _encode_DirectoryBindResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/DirectoryBindResult.ta";
import {
    ReadArgument,
    ReadArgumentData,
    _decode_ReadArgument,
    _encode_ReadArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadArgument.ta";
import {
    ReadResult,
    ReadResultData,
    _decode_ReadResult,
    _encode_ReadResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadResult.ta";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import {
    EntryInformation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation.ta";
import {
    commonName,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
import {
    _decode_OsiDirectoryOperation,
    _encode_OsiDirectoryOperation,
} from "@wildboar/x500/src/lib/modules/OSIProtocolSpecification/OsiDirectoryOperation.ta";
import {
    OsiReq,
} from "@wildboar/x500/src/lib/modules/OSIProtocolSpecification/OsiReq.ta";
import {
    OsiRes,
} from "@wildboar/x500/src/lib/modules/OSIProtocolSpecification/OsiRes.ta";
import {
    OsiRes_result,
} from "@wildboar/x500/src/lib/modules/OSIProtocolSpecification/OsiRes-result.ta";
import {
    id_opcode_read,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-read.va";
import { compareCode, directoryStringToString, getOptionallyProtectedValue } from "@wildboar/x500";
import { strict as assert } from "node:assert";
import {
    Result_list_Item_provider_reason_abstract_syntax_not_supported,
    Result_list_Item_provider_reason_proposed_transfer_syntaxes_not_supported,
    Result_list_Item_provider_reason_reason_not_specified,
} from "@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Result-list-Item-provider-reason.ta";

const id_ber = new ObjectIdentifier([2, 1, 1]);
const id_acse = new ObjectIdentifier([2, 2, 1, 0, 1]);
const id_dap = new ObjectIdentifier([2, 5, 9, 1]);
const id_random_protocol = new ObjectIdentifier([1, 2, 3, 4]);

const PORT: number = 44005;

function withSockets(test: (clientSocket: Socket, serverSocket: Socket, server: Server, cb: () => void) => void) {
    const server = createServer();
    return function (done: jest.DoneCallback) {
        server.on("listening", () => {
            server.on("connection", (c) => {
                c.setTimeout(1000);
                c.unref();
                test(client, c, server, () => {
                    c.end();
                    client.end();
                    server.close(() => {
                        server.removeAllListeners();
                        client.removeAllListeners();
                        c.removeAllListeners();
                        /**
                         * I have no idea why, but this seems to be necessary.
                         */
                        setTimeout(done, 2000);
                    });
                });
            });
            const client = createConnection({
                host: "localhost",
                port: PORT,
                timeout: 1000,
            }, () => {
                client.unref();
            });
        });
        server.unref();
        server.listen(PORT);
    };
}

function configure_itot_for_directory(stack: ISOTransportOverTCPStack): void {
    stack.acse.outgoingEvents.on("AARQ", (apdu) => {
        stack.acse.presentation.request_P_CONNECT({
            presentation_context_definition_list: [
                new Context_list_Item(
                    1,
                    id_acse,
                    [id_ber],
                ),
                new Context_list_Item(
                    3,
                    id_dap,
                    [id_ber],
                ),
            ],
            user_data: {
                fully_encoded_data: [
                    new PDV_list(
                        undefined,
                        1,
                        {
                            single_ASN1_type: _encode_AARQ_apdu(apdu, BER),
                        },
                    ),
                ],
            },
        });
    });
    stack.acse.outgoingEvents.on("AARE+", (apdu) => {
        stack.acse.presentation.respond_P_CONNECT({
            presentation_context_definition_result_list: stack
                .presentation
                .contextSets
                .proposed_for_addition_initiated_remotely
                .map((c): Result_list_Item => {
                    let result: INTEGER = Result_acceptance;
                    let reason: INTEGER | undefined;
                    if (c[1] !== Result_acceptance) {
                        result = Result_provider_rejection;
                        reason = Result_list_Item_provider_reason_reason_not_specified;
                    } else if (!c[0].transfer_syntax_name_list.some((ts) => ts.isEqualTo(id_ber))) {
                        // BER must be supported for directory services.
                        result = Result_user_rejection;
                        reason = Result_list_Item_provider_reason_proposed_transfer_syntaxes_not_supported;
                    } else if (![ id_acse, id_dap ].some((abs) => abs.isEqualTo(c[0].abstract_syntax_name))) {
                        result = Result_user_rejection;
                        reason = Result_list_Item_provider_reason_abstract_syntax_not_supported;
                    }
                    return new Result_list_Item(
                        result,
                        id_ber,
                        reason,
                    );
                }),
            user_data: {
                fully_encoded_data: [
                    new PDV_list(
                        undefined,
                        1,
                        {
                            single_ASN1_type: _encode_AARE_apdu(apdu, BER),
                        },
                    ),
                ],
            },
        });
    });
    stack.acse.outgoingEvents.on("AARE-", (apdu) => {
        stack.acse.presentation.respond_P_CONNECT({
            user_data: {
                fully_encoded_data: [
                    new PDV_list(
                        undefined,
                        1,
                        {
                            single_ASN1_type: _encode_AARE_apdu(apdu, BER),
                        },
                    ),
                ],
            },
        });
    });
    stack.acse.outgoingEvents.on("ABRT", (apdu) => {
        stack.acse.presentation.request_P_U_ABORT({
            user_data: {
                fully_encoded_data: [
                    new PDV_list(
                        undefined,
                        1, // FIXME: Use the correct PCI
                        {
                            single_ASN1_type: _encode_ABRT_apdu(apdu, BER),
                        },
                    ),
                ],
            },
        });
    });
    stack.acse.outgoingEvents.on("RLRQ", (apdu) => {
        stack.acse.presentation.request_P_RELEASE({
            user_data: {
                fully_encoded_data: [
                    new PDV_list(
                        undefined,
                        1, // FIXME: Use the correct PCI
                        {
                            single_ASN1_type: _encode_RLRQ_apdu(apdu, BER),
                        },
                    ),
                ],
            },
        });
    });
    stack.acse.outgoingEvents.on("RLRE+", (apdu) => {
        stack.acse.presentation.respond_P_RELEASE({
            user_data: {
                fully_encoded_data: [
                    new PDV_list(
                        undefined,
                        1, // FIXME: Use the correct PCI
                        {
                            single_ASN1_type: _encode_RLRE_apdu(apdu, BER),
                        },
                    ),
                ],
            },
        });
    });
    stack.acse.outgoingEvents.on("RLRE-", (apdu) => {
        stack.acse.presentation.respond_P_RELEASE({
            user_data: {
                fully_encoded_data: [
                    new PDV_list(
                        undefined,
                        1, // FIXME: Use the correct PCI
                        {
                            single_ASN1_type: _encode_RLRE_apdu(apdu, BER),
                        },
                    ),
                ],
            },
        });
    });
}

describe("The OSI network stack", () => {

    test("it works with create_itot_stack()", withSockets((socket1, socket2, server, done) => {
        const test_str: string = "Big Chungus";
        const stack1 = create_itot_stack(socket1, true, true);
        const stack2 = create_itot_stack(socket2, false, false);
        configure_itot_for_directory(stack1);
        configure_itot_for_directory(stack2);
        stack2.acse.outgoingEvents.on("A-ASCind", () => {
            const aare: AARE_apdu = new AARE_apdu(
                undefined,
                id_random_protocol,
                ACSEResult_acceptance,
                {
                    acse_service_provider: 0,
                },
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                [],
                [
                    new External(
                        id_ber,
                        3,
                        undefined,
                        _encode_DirectoryBindResult(new DirectoryBindResult(), BER),
                    ),
                ],
            );
            dispatch_A_ASCrsp_accept(stack2.acse, aare);
        });
        stack1.acse.outgoingEvents.on("A-ASCcnf+", () => {
            const read_arg: ReadArgument = {
                unsigned: new ReadArgumentData(
                    {
                        rdnSequence: [],
                    },
                ),
            };
            const user_data: User_data = {
                fully_encoded_data: [
                    new PDV_list(
                        undefined,
                        3,
                        {
                            single_ASN1_type: _encode_OsiDirectoryOperation({
                                request: new OsiReq(
                                    {
                                        present: 1,
                                    },
                                    id_opcode_read,
                                    _encode_ReadArgument(read_arg, BER),
                                ),
                            }, BER),
                        }
                    ),
                ],
            };
            dispatch_P_DTreq(stack1.presentation, user_data);
        });
        stack2.presentation.outgoingEvents.on("P-DTind", (ppdu) => {
            if ("fully_encoded_data" in ppdu) {
                if (ppdu.fully_encoded_data.length !== 1) {
                    assert(false);
                }
                const pdv = ppdu.fully_encoded_data[0];
                if (pdv.presentation_context_identifier !== 3) {
                    assert(false);
                }
                if ("single_ASN1_type" in pdv.presentation_data_values) {
                    const op = _decode_OsiDirectoryOperation(pdv.presentation_data_values.single_ASN1_type);
                    if ("request" in op) {
                        expect(compareCode(op.request.opcode, id_opcode_read)).toBe(true);
                        const arg = _decode_ReadArgument(op.request.argument);
                        const arg_data = getOptionallyProtectedValue(arg);
                        expect(arg_data.object.rdnSequence).toHaveLength(0);
                        const read_response: ReadResult = {
                            unsigned: new ReadResultData(
                                new EntryInformation(
                                    {
                                        rdnSequence: [],
                                    },
                                    true,
                                    [
                                        {
                                            attribute: new Attribute(
                                                commonName["&id"],
                                                [
                                                    commonName.encoderFor["&Type"]!({ uTF8String: test_str }, BER),
                                                ],
                                            ),
                                        },
                                    ],
                                ),
                            ),
                        };
                        const user_data: User_data = {
                            fully_encoded_data: [
                                new PDV_list(
                                    undefined,
                                    3,
                                    {
                                        single_ASN1_type: _encode_OsiDirectoryOperation({
                                            result: new OsiRes(
                                                {
                                                    present: 1,
                                                },
                                                new OsiRes_result(
                                                    id_opcode_read,
                                                    _encode_ReadResult(read_response, BER),
                                                ),
                                            ),
                                        }, BER),
                                    }
                                ),
                            ],
                        };
                        dispatch_P_DTreq(stack2.presentation, user_data);
                    } else {
                        assert(false);
                    }
                } else {
                    assert(false);
                }
            } else {
                assert(false);
            }
        });
        stack1.presentation.outgoingEvents.on("P-DTind", (ppdu) => {
            if ("fully_encoded_data" in ppdu) {
                if (ppdu.fully_encoded_data.length !== 1) {
                    assert(false);
                }
                const pdv = ppdu.fully_encoded_data[0];
                if (pdv.presentation_context_identifier !== 3) {
                    assert(false);
                }
                if ("single_ASN1_type" in pdv.presentation_data_values) {
                    const op = _decode_OsiDirectoryOperation(pdv.presentation_data_values.single_ASN1_type);
                    if ("result" in op) {
                        expect(compareCode(op.result.result.opcode, id_opcode_read)).toBe(true);
                        const res = _decode_ReadResult(op.result.result.result);
                        const res_data = getOptionallyProtectedValue(res);
                        assert(res_data.entry.information);
                        expect(res_data.entry.information).toHaveLength(1);
                        const info1 = res_data.entry.information[0];
                        assert("attribute" in info1);
                        expect(info1.attribute.type_.isEqualTo(commonName["&id"])).toBe(true);
                        expect(info1.attribute.values).toHaveLength(1);
                        const value1 = info1.attribute.values[0];
                        const str1 = directoryStringToString(commonName.decoderFor["&Type"]!(value1));
                        expect(str1).toBe(test_str);
                        const rlrq = new RLRQ_apdu(
                            0,
                            undefined,
                            undefined,
                            [],
                            undefined,
                        );
                        dispatch_A_RLSreq(stack1.acse, rlrq);
                    } else {
                        assert(false);
                    }
                } else {
                    assert(false);
                }
            } else {
                assert(false);
            }
        });
        stack2.acse.outgoingEvents.on("A-RLSind", () => {
            const rlre = new RLRE_apdu(
                0,
                undefined,
                undefined,
                [],
                undefined,
            );
            dispatch_A_RLSrsp_accept(stack2.acse, rlre);
        });

        stack1.acse.outgoingEvents.on("A-RLScnf+", () => {
            socket1.destroy();
            socket2.destroy();
            done();
            // server.close(done);
        });

        const aarq: AARQ_apdu = new AARQ_apdu(
            undefined,
            id_dap,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            [],
            [
                new External(
                    id_ber,
                    3,
                    undefined,
                    _encode_DirectoryBindArgument(new DirectoryBindArgument(undefined, undefined), BER),
                ),
            ],
        );
        dispatch_A_ASCreq(stack1.acse, aarq);
    }));
});
