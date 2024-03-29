import { createConnection, createServer, Server } from 'node:net';
import { create_itot_stack, ISOTransportOverTCPStack } from './itot';
import { dispatch_P_DTreq, get_acse_ber_context } from './presentation';
import {
    dispatch_A_ASCreq,
    dispatch_A_ASCrsp_accept,
    dispatch_A_ASCrsp_reject,
    dispatch_A_RLSreq,
    dispatch_A_RLSrsp_accept,
    dispatch_A_ABRreq,
    dispatch_A_RLSrsp_reject,
} from './acse';
import { User_data } from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/User-data.ta';
import { PDV_list } from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/PDV-list.ta';
import { Context_list_Item } from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Context-list-Item.ta';
import { Result_list_Item } from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Result-list-Item.ta';
import {
    Result_acceptance,
    Result_provider_rejection,
    Result_user_rejection,
} from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Result.ta';
import {
    Result_acceptance as ACSEResult_acceptance,
    Result_provider_rejection as ACSEResult_provider_rejection,
} from '@wildboar/acse/src/lib/modules/ACSE-1/Result.ta';
import { ObjectIdentifier, External, INTEGER } from 'asn1-ts';
import { Socket } from 'node:net';
import { BER, _encodeOctetString } from 'asn1-ts/dist/node/functional';
import {
    AARQ_apdu,
    _encode_AARQ_apdu,
} from '@wildboar/acse/src/lib/modules/ACSE-1/AARQ-apdu.ta';
import {
    AARE_apdu,
    _encode_AARE_apdu,
} from '@wildboar/acse/src/lib/modules/ACSE-1/AARE-apdu.ta';
import {
    RLRQ_apdu,
    _encode_RLRQ_apdu,
} from '@wildboar/acse/src/lib/modules/ACSE-1/RLRQ-apdu.ta';
import {
    Release_response_reason_not_finished,
    RLRE_apdu,
    _encode_RLRE_apdu,
} from '@wildboar/acse/src/lib/modules/ACSE-1/RLRE-apdu.ta';
import {
    ABRT_apdu,
    _encode_ABRT_apdu,
} from '@wildboar/acse/src/lib/modules/ACSE-1/ABRT-apdu.ta';
import {
    DirectoryBindArgument,
    _encode_DirectoryBindArgument,
} from '@wildboar/x500/src/lib/modules/DirectoryAbstractService/DirectoryBindArgument.ta';
import {
    DirectoryBindResult,
    _encode_DirectoryBindResult,
} from '@wildboar/x500/src/lib/modules/DirectoryAbstractService/DirectoryBindResult.ta';
import {
    directoryBindError, DirectoryBindError_OPTIONALLY_PROTECTED_Parameter1,
} from '@wildboar/x500/src/lib/modules/DirectoryAbstractService/directoryBindError.oa';
import {
    ReadArgument,
    ReadArgumentData,
    _decode_ReadArgument,
    _encode_ReadArgument,
} from '@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadArgument.ta';
import {
    ReadResult,
    ReadResultData,
    _decode_ReadResult,
    _encode_ReadResult,
} from '@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadResult.ta';
import { Attribute } from '@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta';
import { EntryInformation } from '@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation.ta';
import { commonName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa';
import {
    _decode_OsiDirectoryOperation,
    _encode_OsiDirectoryOperation,
} from '@wildboar/x500/src/lib/modules/OSIProtocolSpecification/OsiDirectoryOperation.ta';
import { OsiReq } from '@wildboar/x500/src/lib/modules/OSIProtocolSpecification/OsiReq.ta';
import { OsiRes } from '@wildboar/x500/src/lib/modules/OSIProtocolSpecification/OsiRes.ta';
import { OsiRes_result } from '@wildboar/x500/src/lib/modules/OSIProtocolSpecification/OsiRes-result.ta';
import { id_opcode_read } from '@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-read.va';
import {
    compareCode,
    directoryStringToString,
    getOptionallyProtectedValue,
} from '@wildboar/x500';
import { strict as assert } from 'node:assert';
import {
    Result_list_Item_provider_reason_abstract_syntax_not_supported,
    Result_list_Item_provider_reason_proposed_transfer_syntaxes_not_supported,
    Result_list_Item_provider_reason_reason_not_specified,
} from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Result-list-Item-provider-reason.ta';
import { _encode_TheOsiBind } from '@wildboar/x500/src/lib/modules/OSIProtocolSpecification/TheOsiBind.ta';
import { _encode_TheOsiBindRes } from '@wildboar/x500/src/lib/modules/OSIProtocolSpecification/TheOsiBindRes.ta';
import { _encode_TheOsiBindErr } from '@wildboar/x500/src/lib/modules/OSIProtocolSpecification/TheOsiBindErr.ta';
import { ABRT_source_acse_service_user } from '@wildboar/acse/src/lib/modules/ACSE-1/ABRT-source.ta';
import { ABRT_diagnostic_authentication_required } from '@wildboar/acse/src/lib/modules/ACSE-1/ABRT-diagnostic.ta';
import { randomBytes, randomInt } from 'node:crypto';
import isDebugging from 'is-debugging';
import { AttributeTypeAndValue } from '@wildboar/pki-stub/src/lib/modules/PKI-Stub/AttributeTypeAndValue.ta';
import { Provider_reason_user_data_not_readable } from '@wildboar/copp/src/lib/modules/ISO8823-PRESENTATION/Provider-reason.ta';

const id_ber = new ObjectIdentifier([2, 1, 1]);
const id_acse = new ObjectIdentifier([2, 2, 1, 0, 1]);
const id_dap = new ObjectIdentifier([2, 5, 9, 1]);

const DEFAULT_PORT: number = 44005;

function withSockets(
    test: (
        clientSocket: Socket,
        serverSocket: Socket,
        server: Server,
        cb: () => void
    ) => void
) {
    const server = createServer();
    const port: number = isDebugging ? DEFAULT_PORT : randomInt(44400, 44600);
    // const port = DEFAULT_PORT;
    return function (done: jest.DoneCallback) {
        server.on('listening', () => {
            server.on('connection', (c) => {
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
            const client = createConnection(
                {
                    host: 'localhost',
                    port,
                    timeout: 1000,
                },
                () => {
                    client.unref();
                }
            );
        });
        server.unref();
        server.listen(port);
    };
}

function configure_itot_for_directory(stack: ISOTransportOverTCPStack): void {
    stack.acse.outgoingEvents.on('AARQ', (apdu) => {
        stack.acse.presentation.request_P_CONNECT({
            presentation_context_definition_list: [
                new Context_list_Item(1, id_acse, [id_ber]),
                new Context_list_Item(3, id_dap, [id_ber]),
            ],
            user_data: {
                fully_encoded_data: [
                    new PDV_list(id_ber, 1, {
                        single_ASN1_type: _encode_AARQ_apdu(apdu, BER),
                    }),
                ],
            },
        });
    });
    stack.acse.outgoingEvents.on('AARE+', (apdu) => {
        const acse_ber_context: Context_list_Item = get_acse_ber_context(
            stack.presentation
        );
        stack.acse.presentation.respond_P_CONNECT({
            presentation_context_definition_result_list:
                stack.presentation.contextSets.proposed_for_addition_initiated_remotely.map(
                    (c): Result_list_Item => {
                        let result: INTEGER = Result_acceptance;
                        let reason: INTEGER | undefined;
                        if (c[1] !== Result_acceptance) {
                            result = Result_provider_rejection;
                            reason =
                                Result_list_Item_provider_reason_reason_not_specified;
                        } else if (
                            !c[0].transfer_syntax_name_list.some((ts) =>
                                ts.isEqualTo(id_ber)
                            )
                        ) {
                            // BER must be supported for directory services.
                            result = Result_user_rejection;
                            reason =
                                Result_list_Item_provider_reason_proposed_transfer_syntaxes_not_supported;
                        } else if (
                            ![id_acse, id_dap].some((abs) =>
                                abs.isEqualTo(c[0].abstract_syntax_name)
                            )
                        ) {
                            result = Result_user_rejection;
                            reason =
                                Result_list_Item_provider_reason_abstract_syntax_not_supported;
                        }
                        return new Result_list_Item(result, id_ber, reason);
                    }
                ),
            user_data: {
                fully_encoded_data: [
                    new PDV_list(
                        id_ber,
                        acse_ber_context.presentation_context_identifier,
                        {
                            single_ASN1_type: _encode_AARE_apdu(apdu, BER),
                        }
                    ),
                ],
            },
        });
    });
    stack.acse.outgoingEvents.on('AARE-', (apdu) => {
        const acse_ber_context: Context_list_Item = get_acse_ber_context(
            stack.presentation
        );
        stack.acse.presentation.respond_P_CONNECT({
            provider_reason: Provider_reason_user_data_not_readable,
            user_data: {
                fully_encoded_data: [
                    new PDV_list(
                        id_ber,
                        acse_ber_context.presentation_context_identifier,
                        {
                            single_ASN1_type: _encode_AARE_apdu(apdu, BER),
                        }
                    ),
                ],
            },
        });
    });
    stack.acse.outgoingEvents.on('ABRT', (apdu) => {
        const acse_ber_context: Context_list_Item = get_acse_ber_context(
            stack.presentation
        );
        stack.acse.presentation.request_P_U_ABORT({
            user_data: {
                fully_encoded_data: [
                    new PDV_list(
                        id_ber,
                        acse_ber_context.presentation_context_identifier,
                        {
                            single_ASN1_type: _encode_ABRT_apdu(apdu, BER),
                        }
                    ),
                ],
            },
        });
    });
    stack.acse.outgoingEvents.on('RLRQ', (apdu) => {
        const acse_ber_context: Context_list_Item = get_acse_ber_context(
            stack.presentation
        );
        stack.acse.presentation.request_P_RELEASE({
            user_data: {
                fully_encoded_data: [
                    new PDV_list(
                        id_ber,
                        acse_ber_context.presentation_context_identifier,
                        {
                            single_ASN1_type: _encode_RLRQ_apdu(apdu, BER),
                        }
                    ),
                ],
            },
        });
    });
    stack.acse.outgoingEvents.on('RLRE+', (apdu) => {
        const acse_ber_context: Context_list_Item = get_acse_ber_context(
            stack.presentation
        );
        stack.acse.presentation.respond_P_RELEASE({
            user_data: {
                fully_encoded_data: [
                    new PDV_list(
                        id_ber,
                        acse_ber_context.presentation_context_identifier,
                        {
                            single_ASN1_type: _encode_RLRE_apdu(apdu, BER),
                        }
                    ),
                ],
            },
        });
    });
    stack.acse.outgoingEvents.on('RLRE-', (apdu) => {
        const acse_ber_context: Context_list_Item = get_acse_ber_context(
            stack.presentation
        );
        stack.acse.presentation.respond_P_RELEASE({
            reject: true,
            user_data: {
                fully_encoded_data: [
                    new PDV_list(
                        id_ber,
                        acse_ber_context.presentation_context_identifier,
                        {
                            single_ASN1_type: _encode_RLRE_apdu(apdu, BER),
                        }
                    ),
                ],
            },
        });
    });
}

describe('The OSI network stack created with create_itot_stack()', () => {
    it(
        'can bind, handle a request, and unbind',
        withSockets((socket1, socket2, server, done) => {
            const test_str: string = 'Big Chungus';
            const stack1 = create_itot_stack(socket1, {
                sessionCaller: true,
                transportCaller: true,
                remoteAddress: {
                    nAddresses: [
                        randomBytes(10),
                    ],
                    pSelector: undefined,
                    sSelector: undefined,
                    tSelector: undefined,
                },
            });
            const stack2 = create_itot_stack(socket2, {
                sessionCaller: false,
                transportCaller: false,
            });
            configure_itot_for_directory(stack1);
            configure_itot_for_directory(stack2);
            stack2.acse.outgoingEvents.on('A-ASCind', () => {
                const aare: AARE_apdu = new AARE_apdu(
                    undefined,
                    id_dap,
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
                            _encode_TheOsiBindRes(
                                _encode_DirectoryBindResult(
                                    new DirectoryBindResult(),
                                    BER
                                ),
                                BER
                            )
                        ),
                    ]
                );
                dispatch_A_ASCrsp_accept(stack2.acse, aare);
            });
            stack1.acse.outgoingEvents.on('A-ASCcnf+', () => {
                const read_arg: ReadArgument = {
                    unsigned: new ReadArgumentData(
                        {
                            rdnSequence: [],
                        },
                        undefined,
                        undefined,
                        [],
                        undefined,
                        undefined,
                        [
                            [
                                /**
                                 * This exists so we can test session-layer
                                 * segmentation of data. This attribute value is
                                 * purposefully gigantic so that it has to get
                                 * segmented.
                                 */
                                new AttributeTypeAndValue(
                                    commonName["&id"],
                                    commonName.encoderFor["&Type"]!({
                                        uTF8String: randomBytes(10).toString("hex"),
                                    }, BER),
                                ),
                            ],
                        ],
                    ),
                };
                const user_data: User_data = {
                    fully_encoded_data: [
                        new PDV_list(undefined, 3, {
                            single_ASN1_type: _encode_OsiDirectoryOperation(
                                {
                                    request: new OsiReq(
                                        {
                                            present: 1,
                                        },
                                        id_opcode_read,
                                        _encode_ReadArgument(read_arg, BER)
                                    ),
                                },
                                BER
                            ),
                        }),
                    ],
                };
                dispatch_P_DTreq(stack1.presentation, user_data);
            });
            stack2.presentation.outgoingEvents.on('P-DTind', (ppdu) => {
                if ('fully_encoded_data' in ppdu) {
                    if (ppdu.fully_encoded_data.length !== 1) {
                        assert(false);
                    }
                    const pdv = ppdu.fully_encoded_data[0];
                    if (pdv.presentation_context_identifier !== 3) {
                        assert(false);
                    }
                    if ('single_ASN1_type' in pdv.presentation_data_values) {
                        const op = _decode_OsiDirectoryOperation(
                            pdv.presentation_data_values.single_ASN1_type
                        );
                        if ('request' in op) {
                            expect(
                                compareCode(op.request.opcode, id_opcode_read)
                            ).toBe(true);
                            const arg = _decode_ReadArgument(
                                op.request.argument
                            );
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
                                                    commonName['&id'],
                                                    [
                                                        commonName.encoderFor[
                                                            '&Type'
                                                        ]!(
                                                            {
                                                                uTF8String:
                                                                    test_str,
                                                            },
                                                            BER
                                                        ),
                                                    ]
                                                ),
                                            },
                                        ]
                                    )
                                ),
                            };
                            const user_data: User_data = {
                                fully_encoded_data: [
                                    new PDV_list(undefined, 3, {
                                        single_ASN1_type:
                                            _encode_OsiDirectoryOperation(
                                                {
                                                    result: new OsiRes(
                                                        {
                                                            present: 1,
                                                        },
                                                        new OsiRes_result(
                                                            id_opcode_read,
                                                            _encode_ReadResult(
                                                                read_response,
                                                                BER
                                                            )
                                                        )
                                                    ),
                                                },
                                                BER
                                            ),
                                    }),
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
            stack1.presentation.outgoingEvents.on('P-DTind', (ppdu) => {
                if ('fully_encoded_data' in ppdu) {
                    if (ppdu.fully_encoded_data.length !== 1) {
                        assert(false);
                    }
                    const pdv = ppdu.fully_encoded_data[0];
                    if (pdv.presentation_context_identifier !== 3) {
                        assert(false);
                    }
                    if ('single_ASN1_type' in pdv.presentation_data_values) {
                        const op = _decode_OsiDirectoryOperation(
                            pdv.presentation_data_values.single_ASN1_type
                        );
                        if ('result' in op) {
                            expect(
                                compareCode(
                                    op.result.result.opcode,
                                    id_opcode_read
                                )
                            ).toBe(true);
                            const res = _decode_ReadResult(
                                op.result.result.result
                            );
                            const res_data = getOptionallyProtectedValue(res);
                            assert(res_data.entry.information);
                            expect(res_data.entry.information).toHaveLength(1);
                            const info1 = res_data.entry.information[0];
                            assert('attribute' in info1);
                            expect(
                                info1.attribute.type_.isEqualTo(
                                    commonName['&id']
                                )
                            ).toBe(true);
                            expect(info1.attribute.values).toHaveLength(1);
                            const value1 = info1.attribute.values[0];
                            const str1 = directoryStringToString(
                                commonName.decoderFor['&Type']!(value1)
                            );
                            expect(str1).toBe(test_str);
                            const rlrq = new RLRQ_apdu(
                                0,
                                undefined,
                                undefined,
                                [
                                    // _encodeOctetString(randomBytes(70000), BER),
                                ],
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
            stack2.acse.outgoingEvents.on('A-RLSind', () => {
                const rlre = new RLRE_apdu(
                    0,
                    undefined,
                    undefined,
                    [],
                    undefined
                );
                dispatch_A_RLSrsp_accept(stack2.acse, rlre);
            });

            stack1.acse.outgoingEvents.on('A-RLScnf+', () => {
                socket1.destroy();
                socket2.destroy();
                done();
                // server.close(done);
            });

            const aarq: AARQ_apdu = new AARQ_apdu(
                undefined,
                id_dap,
                undefined,
                // {
                //     ap_title_form1: {
                //         rdnSequence: [
                //             [
                //                 new AttributeTypeAndValue(
                //                     commonName["&id"],
                //                     commonName.encoderFor["&Type"]!({
                //                         uTF8String: randomBytes(35000).toString("hex"),
                //                     }, BER),
                //                 ),
                //             ],
                //         ],
                //     },
                // },
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
                        _encode_TheOsiBind(
                            _encode_DirectoryBindArgument(
                                new DirectoryBindArgument(undefined, undefined),
                                BER
                            ),
                            BER
                        )
                    ),
                ]
            );
            dispatch_A_ASCreq(stack1.acse, aarq);
        }),
    );

    it(
        'can relay an association-layer abort',
        withSockets((socket1, socket2, server, done) => {
            const stack1 = create_itot_stack(socket1, {
                sessionCaller: true,
                transportCaller: true,
            });
            const stack2 = create_itot_stack(socket2, {
                sessionCaller: false,
                transportCaller: false,
            });
            configure_itot_for_directory(stack1);
            configure_itot_for_directory(stack2);
            stack2.acse.outgoingEvents.on('A-ASCind', () => {
                const abrt: ABRT_apdu = new ABRT_apdu(
                    ABRT_source_acse_service_user,
                    ABRT_diagnostic_authentication_required,
                    undefined,
                    undefined,
                    [],
                    undefined
                );
                dispatch_A_ABRreq(stack2.acse, abrt);
            });
            let acse_abort_received: boolean = false;
            stack1.acse.outgoingEvents.on('A-ABRind', () => {
                acse_abort_received = true;
            });
            stack2.network.socket.on('close', () => {
                expect(acse_abort_received).toBe(true);
                done();
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
                        _encode_TheOsiBind(
                            _encode_DirectoryBindArgument(
                                new DirectoryBindArgument(undefined, undefined),
                                BER
                            ),
                            BER
                        )
                    ),
                ]
            );
            dispatch_A_ASCreq(stack1.acse, aarq);
        })
    );

    it(
        'can handle a large CONNECT SSDU',
        withSockets((socket1, socket2, server, done) => {
            const stack1 = create_itot_stack(socket1, {
                sessionCaller: true,
                transportCaller: true,
            });
            const stack2 = create_itot_stack(socket2, {
                sessionCaller: false,
                transportCaller: false,
            });
            configure_itot_for_directory(stack1);
            configure_itot_for_directory(stack2);
            stack2.acse.outgoingEvents.on('A-ASCind', done);
            let acse_abort_received: boolean = false;
            stack1.acse.outgoingEvents.on('A-ABRind', () => {
                acse_abort_received = true;
            });
            stack2.network.socket.on('close', () => {
                expect(acse_abort_received).toBe(true);
                done();
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
                [
                    _encodeOctetString(randomBytes(70000), BER),
                ],
                [
                    new External(
                        id_ber,
                        3,
                        undefined,
                        _encode_TheOsiBind(
                            _encode_DirectoryBindArgument(
                                new DirectoryBindArgument(undefined, undefined),
                                BER
                            ),
                            BER
                        )
                    ),
                ]
            );
            dispatch_A_ASCreq(stack1.acse, aarq);
        })
    );

    it(
        'can handle a large FINISH SSDU',
        withSockets((socket1, socket2, server, done) => {
            const stack1 = create_itot_stack(socket1, {
                sessionCaller: true,
                transportCaller: true,
            });
            const stack2 = create_itot_stack(socket2, {
                sessionCaller: false,
                transportCaller: false,
            });
            configure_itot_for_directory(stack1);
            configure_itot_for_directory(stack2);
            stack2.acse.outgoingEvents.on('A-ASCind', () => {
                const aare: AARE_apdu = new AARE_apdu(
                    undefined,
                    id_dap,
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
                            _encode_TheOsiBindRes(
                                _encode_DirectoryBindResult(
                                    new DirectoryBindResult(),
                                    BER
                                ),
                                BER
                            )
                        ),
                    ]
                );
                dispatch_A_ASCrsp_accept(stack2.acse, aare);
            });
            stack1.acse.outgoingEvents.on('A-ASCcnf+', () => {
                const rlrq = new RLRQ_apdu(
                    0,
                    undefined,
                    undefined,
                    [
                        _encodeOctetString(randomBytes(70000), BER),
                    ],
                    undefined,
                );
                dispatch_A_RLSreq(stack1.acse, rlrq);
            });
            stack2.acse.outgoingEvents.on('A-RLSind', () => {
                const rlre = new RLRE_apdu(
                    0,
                    undefined,
                    undefined,
                    [],
                    undefined
                );
                dispatch_A_RLSrsp_accept(stack2.acse, rlre);
            });

            stack1.acse.outgoingEvents.on('A-RLScnf+', () => {
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
                        _encode_TheOsiBind(
                            _encode_DirectoryBindArgument(
                                new DirectoryBindArgument(undefined, undefined),
                                BER
                            ),
                            BER
                        )
                    ),
                ]
            );
            dispatch_A_ASCreq(stack1.acse, aarq);
        }),
    );

    it(
        'can handle a large ACCEPT SSDU',
        withSockets((socket1, socket2, server, done) => {
            const stack1 = create_itot_stack(socket1, {
                sessionCaller: true,
                transportCaller: true,
            });
            const stack2 = create_itot_stack(socket2, {
                sessionCaller: false,
                transportCaller : false,
            });
            configure_itot_for_directory(stack1);
            configure_itot_for_directory(stack2);
            stack2.acse.outgoingEvents.on('A-ASCind', () => {
                const aare: AARE_apdu = new AARE_apdu(
                    undefined,
                    id_dap,
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
                    [
                        _encodeOctetString(randomBytes(70000), BER),
                    ],
                    [
                        new External(
                            id_ber,
                            3,
                            undefined,
                            _encode_TheOsiBindRes(
                                _encode_DirectoryBindResult(
                                    new DirectoryBindResult(),
                                    BER
                                ),
                                BER
                            )
                        ),
                    ]
                );
                dispatch_A_ASCrsp_accept(stack2.acse, aare);
            });
            stack1.acse.outgoingEvents.on('A-ASCcnf+', () => {
                const rlrq = new RLRQ_apdu(
                    0,
                    undefined,
                    undefined,
                    [],
                    undefined,
                );
                dispatch_A_RLSreq(stack1.acse, rlrq);
            });
            stack2.acse.outgoingEvents.on('A-RLSind', () => {
                const rlre = new RLRE_apdu(
                    0,
                    undefined,
                    undefined,
                    [],
                    undefined
                );
                dispatch_A_RLSrsp_accept(stack2.acse, rlre);
            });

            stack1.acse.outgoingEvents.on('A-RLScnf+', () => {
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
                        _encode_TheOsiBind(
                            _encode_DirectoryBindArgument(
                                new DirectoryBindArgument(undefined, undefined),
                                BER
                            ),
                            BER
                        )
                    ),
                ]
            );
            dispatch_A_ASCreq(stack1.acse, aarq);
        }),
    );

    it(
        'can handle a large REFUSE SSDU',
        withSockets((socket1, socket2, server, done) => {
            const stack1 = create_itot_stack(socket1, {
                sessionCaller: true,
                transportCaller: true,
            });
            const stack2 = create_itot_stack(socket2, {
                sessionCaller: false,
                transportCaller: false,
            });
            configure_itot_for_directory(stack1);
            configure_itot_for_directory(stack2);
            stack2.acse.outgoingEvents.on('A-ASCind', () => {
                const aare: AARE_apdu = new AARE_apdu(
                    undefined,
                    id_dap,
                    ACSEResult_provider_rejection,
                    {
                        acse_service_provider: 1,
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
                    [
                        _encodeOctetString(randomBytes(70000), BER),
                    ],
                    [
                        new External(
                            id_ber,
                            3,
                            undefined,
                            _encode_TheOsiBindErr(
                                directoryBindError.encoderFor["&ParameterType"]!({
                                    unsigned: new DirectoryBindError_OPTIONALLY_PROTECTED_Parameter1(
                                        undefined,
                                        {
                                            serviceError: 1,
                                        },
                                        undefined,
                                    ),
                                }, BER),
                                BER
                            ),
                        ),
                    ]
                );
                dispatch_A_ASCrsp_reject(stack2.acse, aare);
            });
            stack1.acse.outgoingEvents.on('A-ASCcnf-', () => {
                socket1.destroy();
                socket2.destroy();
                done();
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
                        _encode_TheOsiBind(
                            _encode_DirectoryBindArgument(
                                new DirectoryBindArgument(undefined, undefined),
                                BER
                            ),
                            BER
                        ),
                    ),
                ]
            );
            dispatch_A_ASCreq(stack1.acse, aarq);
        }),
    );

    it(
        'can handle a large DISCONNECT SSDU',
        withSockets((socket1, socket2, server, done) => {
            const stack1 = create_itot_stack(socket1, {
                sessionCaller: true,
                transportCaller: true,
            });
            const stack2 = create_itot_stack(socket2, {
                sessionCaller: false,
                transportCaller: false,
            });
            configure_itot_for_directory(stack1);
            configure_itot_for_directory(stack2);
            stack2.acse.outgoingEvents.on('A-ASCind', () => {
                const aare: AARE_apdu = new AARE_apdu(
                    undefined,
                    id_dap,
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
                            _encode_TheOsiBindRes(
                                _encode_DirectoryBindResult(
                                    new DirectoryBindResult(),
                                    BER
                                ),
                                BER
                            )
                        ),
                    ]
                );
                dispatch_A_ASCrsp_accept(stack2.acse, aare);
            });
            stack1.acse.outgoingEvents.on('A-ASCcnf+', () => {
                const rlrq = new RLRQ_apdu(
                    0,
                    undefined,
                    undefined,
                    [],
                    undefined,
                );
                dispatch_A_RLSreq(stack1.acse, rlrq);
            });
            stack2.acse.outgoingEvents.on('A-RLSind', () => {
                const rlre = new RLRE_apdu(
                    0,
                    undefined,
                    undefined,
                    [
                        _encodeOctetString(randomBytes(70000), BER),
                    ],
                    undefined
                );
                dispatch_A_RLSrsp_accept(stack2.acse, rlre);
            });

            stack1.acse.outgoingEvents.on('A-RLScnf+', () => {
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
                        _encode_TheOsiBind(
                            _encode_DirectoryBindArgument(
                                new DirectoryBindArgument(undefined, undefined),
                                BER
                            ),
                            BER
                        )
                    ),
                ]
            );
            dispatch_A_ASCreq(stack1.acse, aarq);
        }),
    );

    it(
        'can handle a large ABORT SSDU',
        withSockets((socket1, socket2, server, done) => {
            const stack1 = create_itot_stack(socket1, {
                sessionCaller: true,
                transportCaller: true,
            });
            const stack2 = create_itot_stack(socket2, {
                sessionCaller: false,
                transportCaller: false,
            });
            configure_itot_for_directory(stack1);
            configure_itot_for_directory(stack2);
            stack2.acse.outgoingEvents.on('A-ASCind', () => {
                const abrt: ABRT_apdu = new ABRT_apdu(
                    ABRT_source_acse_service_user,
                    ABRT_diagnostic_authentication_required,
                    undefined,
                    undefined,
                    [
                        _encodeOctetString(randomBytes(70000), BER),
                    ],
                    undefined
                );
                dispatch_A_ABRreq(stack2.acse, abrt);
            });
            let acse_abort_received: boolean = false;
            stack1.acse.outgoingEvents.on('A-ABRind', () => {
                acse_abort_received = true;
            });
            stack2.network.socket.on('close', () => {
                expect(acse_abort_received).toBe(true);
                done();
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
                        _encode_TheOsiBind(
                            _encode_DirectoryBindArgument(
                                new DirectoryBindArgument(undefined, undefined),
                                BER
                            ),
                            BER
                        )
                    ),
                ]
            );
            dispatch_A_ASCreq(stack1.acse, aarq);
        })
    );

    // This test will not pass because the Negotiated Release functional unit
    // is not enabled in the session layer. Perhaps in a future release...
    it.skip(
        'can handle a large NOT FINISHED SSDU',
        withSockets((socket1, socket2, server, done) => {
            const stack1 = create_itot_stack(socket1, {
                sessionCaller: true,
                transportCaller: true,
            });
            const stack2 = create_itot_stack(socket2, {
                sessionCaller: false,
                transportCaller: false,
            });
            configure_itot_for_directory(stack1);
            configure_itot_for_directory(stack2);
            stack2.acse.outgoingEvents.on('A-ASCind', () => {
                const aare: AARE_apdu = new AARE_apdu(
                    undefined,
                    id_dap,
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
                            _encode_TheOsiBindRes(
                                _encode_DirectoryBindResult(
                                    new DirectoryBindResult(),
                                    BER
                                ),
                                BER
                            )
                        ),
                    ]
                );
                dispatch_A_ASCrsp_accept(stack2.acse, aare);
            });
            stack1.acse.outgoingEvents.on('A-ASCcnf+', () => {
                const rlrq = new RLRQ_apdu(
                    0,
                    undefined,
                    undefined,
                    [],
                    undefined,
                );
                dispatch_A_RLSreq(stack1.acse, rlrq);
            });
            stack2.acse.outgoingEvents.on('A-RLSind', () => {
                const rlre = new RLRE_apdu(
                    Release_response_reason_not_finished,
                    undefined,
                    undefined,
                    [
                        _encodeOctetString(randomBytes(70000), BER),
                    ],
                    undefined
                );
                dispatch_A_RLSrsp_reject(stack2.acse, rlre);
            });

            stack1.acse.outgoingEvents.on('A-RLScnf-', () => {
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
                        _encode_TheOsiBind(
                            _encode_DirectoryBindArgument(
                                new DirectoryBindArgument(undefined, undefined),
                                BER
                            ),
                            BER
                        )
                    ),
                ]
            );
            dispatch_A_ASCreq(stack1.acse, aarq);
        }),
    );


    it(
        'can handle a large DATA TRANSFER SSDU',
        withSockets((socket1, socket2, server, done) => {
            const test_str: string = 'Big Chungus';
            const stack1 = create_itot_stack(socket1, {
                sessionCaller: true,
                transportCaller: true,
            });
            const stack2 = create_itot_stack(socket2, {
                sessionCaller: false,
                transportCaller: false,
            });
            configure_itot_for_directory(stack1);
            configure_itot_for_directory(stack2);
            stack2.acse.outgoingEvents.on('A-ASCind', () => {
                const aare: AARE_apdu = new AARE_apdu(
                    undefined,
                    id_dap,
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
                            _encode_TheOsiBindRes(
                                _encode_DirectoryBindResult(
                                    new DirectoryBindResult(),
                                    BER
                                ),
                                BER
                            )
                        ),
                    ]
                );
                dispatch_A_ASCrsp_accept(stack2.acse, aare);
            });
            stack1.acse.outgoingEvents.on('A-ASCcnf+', () => {
                const read_arg: ReadArgument = {
                    unsigned: new ReadArgumentData(
                        {
                            rdnSequence: [],
                        },
                        undefined,
                        undefined,
                        [],
                        undefined,
                        undefined,
                        [
                            [
                                /**
                                 * This exists so we can test session-layer
                                 * segmentation of data. This attribute value is
                                 * purposefully gigantic so that it has to get
                                 * segmented.
                                 */
                                new AttributeTypeAndValue(
                                    commonName["&id"],
                                    commonName.encoderFor["&Type"]!({
                                        uTF8String: randomBytes(70000).toString("hex"),
                                    }, BER),
                                ),
                            ],
                        ],
                    ),
                };
                const user_data: User_data = {
                    fully_encoded_data: [
                        new PDV_list(undefined, 3, {
                            single_ASN1_type: _encode_OsiDirectoryOperation(
                                {
                                    request: new OsiReq(
                                        {
                                            present: 1,
                                        },
                                        id_opcode_read,
                                        _encode_ReadArgument(read_arg, BER)
                                    ),
                                },
                                BER
                            ),
                        }),
                    ],
                };
                dispatch_P_DTreq(stack1.presentation, user_data);
            });
            stack2.presentation.outgoingEvents.on('P-DTind', (ppdu) => {
                if ('fully_encoded_data' in ppdu) {
                    if (ppdu.fully_encoded_data.length !== 1) {
                        assert(false);
                    }
                    const pdv = ppdu.fully_encoded_data[0];
                    if (pdv.presentation_context_identifier !== 3) {
                        assert(false);
                    }
                    if ('single_ASN1_type' in pdv.presentation_data_values) {
                        const op = _decode_OsiDirectoryOperation(
                            pdv.presentation_data_values.single_ASN1_type
                        );
                        if ('request' in op) {
                            expect(
                                compareCode(op.request.opcode, id_opcode_read)
                            ).toBe(true);
                            const arg = _decode_ReadArgument(
                                op.request.argument
                            );
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
                                                    commonName['&id'],
                                                    [
                                                        commonName.encoderFor[
                                                            '&Type'
                                                        ]!(
                                                            {
                                                                uTF8String:
                                                                    test_str,
                                                            },
                                                            BER
                                                        ),
                                                    ]
                                                ),
                                            },
                                        ]
                                    )
                                ),
                            };
                            const user_data: User_data = {
                                fully_encoded_data: [
                                    new PDV_list(undefined, 3, {
                                        single_ASN1_type:
                                            _encode_OsiDirectoryOperation(
                                                {
                                                    result: new OsiRes(
                                                        {
                                                            present: 1,
                                                        },
                                                        new OsiRes_result(
                                                            id_opcode_read,
                                                            _encode_ReadResult(
                                                                read_response,
                                                                BER
                                                            )
                                                        )
                                                    ),
                                                },
                                                BER
                                            ),
                                    }),
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
            stack1.presentation.outgoingEvents.on('P-DTind', (ppdu) => {
                if ('fully_encoded_data' in ppdu) {
                    if (ppdu.fully_encoded_data.length !== 1) {
                        assert(false);
                    }
                    const pdv = ppdu.fully_encoded_data[0];
                    if (pdv.presentation_context_identifier !== 3) {
                        assert(false);
                    }
                    if ('single_ASN1_type' in pdv.presentation_data_values) {
                        const op = _decode_OsiDirectoryOperation(
                            pdv.presentation_data_values.single_ASN1_type
                        );
                        if ('result' in op) {
                            expect(
                                compareCode(
                                    op.result.result.opcode,
                                    id_opcode_read
                                )
                            ).toBe(true);
                            const res = _decode_ReadResult(
                                op.result.result.result
                            );
                            const res_data = getOptionallyProtectedValue(res);
                            assert(res_data.entry.information);
                            expect(res_data.entry.information).toHaveLength(1);
                            const info1 = res_data.entry.information[0];
                            assert('attribute' in info1);
                            expect(
                                info1.attribute.type_.isEqualTo(
                                    commonName['&id']
                                )
                            ).toBe(true);
                            expect(info1.attribute.values).toHaveLength(1);
                            const value1 = info1.attribute.values[0];
                            const str1 = directoryStringToString(
                                commonName.decoderFor['&Type']!(value1)
                            );
                            expect(str1).toBe(test_str);
                            const rlrq = new RLRQ_apdu(
                                0,
                                undefined,
                                undefined,
                                [
                                    // _encodeOctetString(randomBytes(70000), BER),
                                ],
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
            stack2.acse.outgoingEvents.on('A-RLSind', () => {
                const rlre = new RLRE_apdu(
                    0,
                    undefined,
                    undefined,
                    [],
                    undefined
                );
                dispatch_A_RLSrsp_accept(stack2.acse, rlre);
            });

            stack1.acse.outgoingEvents.on('A-RLScnf+', () => {
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
                        _encode_TheOsiBind(
                            _encode_DirectoryBindArgument(
                                new DirectoryBindArgument(undefined, undefined),
                                BER
                            ),
                            BER
                        )
                    ),
                ]
            );
            dispatch_A_ASCreq(stack1.acse, aarq);
        }),
    );

    // Skipped because `create_itot_stack()` automatically chooses the largest
    // TPDU size possible. You'll have to edit that code prior to running this
    // test.
    it.skip('can handle a large DATA TRANSFER SSDU despite small max TPDU size',
        withSockets((socket1, socket2, server, done) => {
            const test_str: string = 'Big Chungus';
            const stack1 = create_itot_stack(socket1, {
                sessionCaller: true,
                transportCaller: true,
            });
            const stack2 = create_itot_stack(socket2, {
                sessionCaller: false,
                transportCaller: false,
            });
            configure_itot_for_directory(stack1);
            configure_itot_for_directory(stack2);
            stack2.acse.outgoingEvents.on('A-ASCind', () => {
                const aare: AARE_apdu = new AARE_apdu(
                    undefined,
                    id_dap,
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
                            _encode_TheOsiBindRes(
                                _encode_DirectoryBindResult(
                                    new DirectoryBindResult(),
                                    BER
                                ),
                                BER
                            )
                        ),
                    ]
                );
                dispatch_A_ASCrsp_accept(stack2.acse, aare);
            });
            stack1.acse.outgoingEvents.on('A-ASCcnf+', () => {
                const read_arg: ReadArgument = {
                    unsigned: new ReadArgumentData(
                        {
                            rdnSequence: [],
                        },
                        undefined,
                        undefined,
                        [],
                        undefined,
                        undefined,
                        [
                            [
                                /**
                                 * This exists so we can test session-layer
                                 * segmentation of data. This attribute value is
                                 * purposefully gigantic so that it has to get
                                 * segmented.
                                 */
                                new AttributeTypeAndValue(
                                    commonName["&id"],
                                    commonName.encoderFor["&Type"]!({
                                        uTF8String: randomBytes(7000).toString("hex"),
                                    }, BER),
                                ),
                            ],
                        ],
                    ),
                };
                const user_data: User_data = {
                    fully_encoded_data: [
                        new PDV_list(undefined, 3, {
                            single_ASN1_type: _encode_OsiDirectoryOperation(
                                {
                                    request: new OsiReq(
                                        {
                                            present: 1,
                                        },
                                        id_opcode_read,
                                        _encode_ReadArgument(read_arg, BER)
                                    ),
                                },
                                BER
                            ),
                        }),
                    ],
                };
                dispatch_P_DTreq(stack1.presentation, user_data);
            });
            stack2.presentation.outgoingEvents.on('P-DTind', (ppdu) => {
                if ('fully_encoded_data' in ppdu) {
                    if (ppdu.fully_encoded_data.length !== 1) {
                        assert(false);
                    }
                    const pdv = ppdu.fully_encoded_data[0];
                    if (pdv.presentation_context_identifier !== 3) {
                        assert(false);
                    }
                    if ('single_ASN1_type' in pdv.presentation_data_values) {
                        const op = _decode_OsiDirectoryOperation(
                            pdv.presentation_data_values.single_ASN1_type
                        );
                        if ('request' in op) {
                            expect(
                                compareCode(op.request.opcode, id_opcode_read)
                            ).toBe(true);
                            const arg = _decode_ReadArgument(
                                op.request.argument
                            );
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
                                                    commonName['&id'],
                                                    [
                                                        commonName.encoderFor[
                                                            '&Type'
                                                        ]!(
                                                            {
                                                                uTF8String:
                                                                    test_str,
                                                            },
                                                            BER
                                                        ),
                                                    ]
                                                ),
                                            },
                                        ]
                                    )
                                ),
                            };
                            const user_data: User_data = {
                                fully_encoded_data: [
                                    new PDV_list(undefined, 3, {
                                        single_ASN1_type:
                                            _encode_OsiDirectoryOperation(
                                                {
                                                    result: new OsiRes(
                                                        {
                                                            present: 1,
                                                        },
                                                        new OsiRes_result(
                                                            id_opcode_read,
                                                            _encode_ReadResult(
                                                                read_response,
                                                                BER
                                                            )
                                                        )
                                                    ),
                                                },
                                                BER
                                            ),
                                    }),
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
            stack1.presentation.outgoingEvents.on('P-DTind', (ppdu) => {
                if ('fully_encoded_data' in ppdu) {
                    if (ppdu.fully_encoded_data.length !== 1) {
                        assert(false);
                    }
                    const pdv = ppdu.fully_encoded_data[0];
                    if (pdv.presentation_context_identifier !== 3) {
                        assert(false);
                    }
                    if ('single_ASN1_type' in pdv.presentation_data_values) {
                        const op = _decode_OsiDirectoryOperation(
                            pdv.presentation_data_values.single_ASN1_type
                        );
                        if ('result' in op) {
                            expect(
                                compareCode(
                                    op.result.result.opcode,
                                    id_opcode_read
                                )
                            ).toBe(true);
                            const res = _decode_ReadResult(
                                op.result.result.result
                            );
                            const res_data = getOptionallyProtectedValue(res);
                            assert(res_data.entry.information);
                            expect(res_data.entry.information).toHaveLength(1);
                            const info1 = res_data.entry.information[0];
                            assert('attribute' in info1);
                            expect(
                                info1.attribute.type_.isEqualTo(
                                    commonName['&id']
                                )
                            ).toBe(true);
                            expect(info1.attribute.values).toHaveLength(1);
                            const value1 = info1.attribute.values[0];
                            const str1 = directoryStringToString(
                                commonName.decoderFor['&Type']!(value1)
                            );
                            expect(str1).toBe(test_str);
                            const rlrq = new RLRQ_apdu(
                                0,
                                undefined,
                                undefined,
                                [
                                    // _encodeOctetString(randomBytes(70000), BER),
                                ],
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
            stack2.acse.outgoingEvents.on('A-RLSind', () => {
                const rlre = new RLRE_apdu(
                    0,
                    undefined,
                    undefined,
                    [],
                    undefined
                );
                dispatch_A_RLSrsp_accept(stack2.acse, rlre);
            });

            stack1.acse.outgoingEvents.on('A-RLScnf+', () => {
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
                        _encode_TheOsiBind(
                            _encode_DirectoryBindArgument(
                                new DirectoryBindArgument(undefined, undefined),
                                BER
                            ),
                            BER
                        )
                    ),
                ]
            );
            dispatch_A_ASCreq(stack1.acse, aarq);
        }),
    );

    it('can handle a client destroying the socket',
        withSockets((socket1, socket2, server, done) => {
            const stack1 = create_itot_stack(socket1, {
                sessionCaller: true,
                transportCaller: true,
            });
            const stack2 = create_itot_stack(socket2, {
                sessionCaller: false,
                transportCaller: false,
            });
            configure_itot_for_directory(stack1);
            configure_itot_for_directory(stack2);
            stack2.acse.outgoingEvents.on('A-ASCind', () => {
                const aare: AARE_apdu = new AARE_apdu(
                    undefined,
                    id_dap,
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
                            _encode_TheOsiBindRes(
                                _encode_DirectoryBindResult(
                                    new DirectoryBindResult(),
                                    BER
                                ),
                                BER
                            )
                        ),
                    ]
                );
                socket1.destroy();
                dispatch_A_ASCrsp_accept(stack2.acse, aare);
            });
            stack2.network.socket.once("close", done);
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
                        _encode_TheOsiBind(
                            _encode_DirectoryBindArgument(
                                new DirectoryBindArgument(undefined, undefined),
                                BER
                            ),
                            BER
                        )
                    ),
                ]
            );
            dispatch_A_ASCreq(stack1.acse, aarq);
        }),
    );

    it('can handle a server destroying the socket',
        withSockets((socket1, socket2, server, done) => {
            const stack1 = create_itot_stack(socket1, {
                sessionCaller: true,
                transportCaller: true,
            });
            const stack2 = create_itot_stack(socket2, {
                sessionCaller: false,
                transportCaller: false,
            });
            configure_itot_for_directory(stack1);
            configure_itot_for_directory(stack2);
            stack2.acse.outgoingEvents.on('A-ASCind', () => {
                const aare: AARE_apdu = new AARE_apdu(
                    undefined,
                    id_dap,
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
                            _encode_TheOsiBindRes(
                                _encode_DirectoryBindResult(
                                    new DirectoryBindResult(),
                                    BER
                                ),
                                BER
                            )
                        ),
                    ]
                );
                socket2.destroy();
                dispatch_A_ASCrsp_accept(stack2.acse, aare);
            });
            stack1.network.socket.once("close", done);
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
                        _encode_TheOsiBind(
                            _encode_DirectoryBindArgument(
                                new DirectoryBindArgument(undefined, undefined),
                                BER
                            ),
                            BER
                        )
                    ),
                ]
            );
            dispatch_A_ASCreq(stack1.acse, aarq);
        }),
    );

});
