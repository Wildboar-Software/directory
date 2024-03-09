import { IDMConnection } from "@wildboar/idm";
import { create_mua_client } from "./mua";
import { createConnection } from "node:net";
import { rose_transport_from_itot_stack } from "./itot";
import { create_itot_stack } from "@wildboar/osi-net";
import { getOptionallyProtectedValue } from "@wildboar/x500";
import { strict as assert } from "node:assert";
import {
    DirectoryBindArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/DirectoryBindArgument.ta";
import {
    createTimestamp,
} from "@wildboar/x500/src/lib/modules/InformationFramework/createTimestamp.oa";
import { TLSSocket } from "node:tls";
import { SimpleCredentials } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SimpleCredentials.ta";
import {
    MTABindArgument, MTABindArgument_authenticated,
} from "@wildboar/x400/src/lib/modules/MTAAbstractService/MTABindArgument.ta";
import {
    MTABindResult,
} from "@wildboar/x400/src/lib/modules/MTAAbstractService/MTABindResult.ta";
import {
    ORName,
} from "@wildboar/x400/src/lib/modules/MTSAbstractService/ORName.ta";
import {
    BuiltInStandardAttributes,
} from "@wildboar/x400/src/lib/modules/MTSAbstractService/BuiltInStandardAttributes.ta";
import {
    MessageSubmissionArgument,
} from "@wildboar/x400/src/lib/modules/MTSAbstractService/MessageSubmissionArgument.ta";
import {
    MessageSubmissionResult,
} from "@wildboar/x400/src/lib/modules/MTSAbstractService/MessageSubmissionResult.ta";
import {
    MessageSubmissionEnvelope,
} from "@wildboar/x400/src/lib/modules/MTSAbstractService/MessageSubmissionEnvelope.ta";
import {
    EncodedInformationTypes,
    BuiltInEncodedInformationTypes_ia5_text,
} from "@wildboar/x400/src/lib/modules/MTSAbstractService/EncodedInformationTypes.ta";
import {
    BuiltInContentType_interpersonal_messaging_1988,
} from "@wildboar/x400/src/lib/modules/MTSAbstractService/BuiltInContentType.ta";
import {
    PerRecipientMessageSubmissionFields,
} from "@wildboar/x400/src/lib/modules/MTSAbstractService/PerRecipientMessageSubmissionFields.ta";
import { IPM } from "@wildboar/x400/src/lib/modules/IPMSInformationObjects/IPM.ta";
import { Heading } from "@wildboar/x400/src/lib/modules/IPMSInformationObjects/Heading.ta";
import { BodyPart_basic } from "@wildboar/x400/src/lib/modules/IPMSInformationObjects/BodyPart-basic.ta";
import { IA5TextBodyPart } from "@wildboar/x400/src/lib/modules/IPMSInformationObjects/IA5TextBodyPart.ta";
import { IA5TextParameters } from "@wildboar/x400/src/lib/modules/IPMSInformationObjects/IA5TextParameters.ta";
import { IPMIdentifier } from "@wildboar/x400/src/lib/modules/IPMSInformationObjects/IPMIdentifier.ta";
import { RecipientSpecifier } from "@wildboar/x400/src/lib/modules/IPMSInformationObjects/RecipientSpecifier.ta";
import { ORDescriptor } from "@wildboar/x400/src/lib/modules/IPMSInformationObjects/ORDescriptor.ta";
import { InformationObject, _encode_InformationObject } from "@wildboar/x400/src/lib/modules/IPMSInformationObjects/InformationObject.ta";
import { DER } from "asn1-ts/dist/node/functional";
import {
    mts_access_94,
} from "@wildboar/x400/src/lib/modules/MTSAccessProtocol/mts-access-94.oa";
import {
    id_as_mtse,
} from "@wildboar/x400/src/lib/modules/MHSProtocolObjectIdentifiers/id-as-mtse.va";
import {
    id_ac_mts_transfer,
} from "@wildboar/x400/src/lib/modules/MHSProtocolObjectIdentifiers/id-ac-mts-transfer.va";
import { PresentationAddress } from "@wildboar/pki-stub/src/lib/modules/SelectedAttributeTypes/PresentationAddress.ta";
import {
    Credentials,
} from "@wildboar/x400/src/lib/modules/MTSAbstractService/Credentials.ta";

/* // TODO:
I discovered that this won't work with ISODE/PP because this OSI networking
implementation does not support the required session-layer features. I found
this in the PP logs at /usr/spool/pp/logs/norm via this message:

RtInit: [Protocol error] desired session requirements unavailable

This means that I cannot even get past authentication. So I have to end this
little experiment at the moment. Bummer!
*/
describe("MUA Client", () => {

    it("works with ITOT transport", async () => {
        const socket = createConnection({
            host: "127.0.0.1",
            port: 20001,
        });
        socket.on("error", (e) => console.error(e));
        socket.on("end", () => console.error("SOCKET ENDED"));
        await new Promise((resolve) => socket.on("connect", resolve));
        const tsel = Buffer.from("X400");
        // const tsel = Buffer.allocUnsafe(2);
        // tsel.writeUint16BE(20001);
        const itot = create_itot_stack(socket, {
            sessionCaller: true,
            transportCaller: true,
            remoteAddress: new PresentationAddress(
                undefined,
                undefined,
                tsel,
                [],
            ),
        });
        const rose = rose_transport_from_itot_stack(itot);
        const mua = create_mua_client(rose);
        const originator = new ORName(
            new BuiltInStandardAttributes(
                { iso_3166_alpha2_code: "US" },
                { printable: "Wildboar" },
                undefined,
                "24682986",
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
            ),
            undefined,
            undefined,
            undefined,
        );
        const recipient = new ORName(
            new BuiltInStandardAttributes(
                { iso_3166_alpha2_code: "US" },
                { printable: "Wildboar" },
                undefined,
                "512011",
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
            ),
            undefined,
            undefined,
            undefined,
        );
        console.log("About to bind");
        const bind_response = await mua.bind({
            protocol_id: id_ac_mts_transfer,
            parameter: {
                // unauthenticated: null,
                authenticated: new MTABindArgument_authenticated(
                    "asdf",
                    {
                        simple: {
                            ia5_string: "asdf",
                        },
                    },
                    undefined,
                ),
            },
            // parameter: new MTABindArgument(
            //     {
            //         user_agent: originator,
            //     },
            //     undefined,
            //     {
            //         simple: {
            //             ia5_string: "datboi",
            //         },
            //     },
            //     undefined,
            //     undefined,
            //     undefined,
            // ),

        });
        if ("result" in bind_response) {
            expect(bind_response.result.parameter).toBeDefined();
        } else {
            assert(false);
        }
        const ipm: InformationObject = {
            ipm: new IPM(
                new Heading(
                    new IPMIdentifier(
                        originator,
                        "2258025082",
                    ),
                    undefined,
                    undefined,
                    [
                        new RecipientSpecifier(
                            new ORDescriptor(
                                recipient,
                                undefined,
                                undefined,
                            ),
                            undefined,
                            undefined,
                            undefined,
                        ),
                    ],
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    Buffer.from("hey youu"),
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ),
                [
                    {
                        basic: {
                            ia5_text: new IA5TextBodyPart(
                                new IA5TextParameters(undefined),
                                "have no money??? eat sand",
                            )
                        },
                    },
                ],
            ),
        };
        const submitArg = new MessageSubmissionArgument(
            new MessageSubmissionEnvelope(
                originator,
                new EncodedInformationTypes(
                    new Uint8ClampedArray(),
                    undefined,
                    undefined,
                    undefined,
                ),
                {
                    built_in: BuiltInContentType_interpersonal_messaging_1988,
                },
                "gigachad",
                undefined,
                undefined,
                undefined,
                undefined,
                [
                    new PerRecipientMessageSubmissionFields(
                        recipient,
                        new Uint8ClampedArray(),
                        undefined,
                        undefined,
                    ),
                ],
            ),
            _encode_InformationObject(ipm, DER).toBytes(),
        );
        const response = await mua.submit(submitArg);
        if ("result" in response) {
            console.log("Successfully submitted.");
        } else {
            assert(false);
        }
    });

    // it.skip("works with ITOT transport (2)", async () => {
    //     const socket = createConnection({
    //         host: "localhost",
    //         port: 17003,
    //     });
    //     await new Promise((resolve) => socket.on("connect", resolve));
    //     const itot = create_itot_stack(socket, {
    //         sessionCaller: true,
    //         transportCaller: true,
    //     });
    //     const rose = rose_transport_from_itot_stack(itot);
    //     const dap = create_mua_client(rose);
    //     const bind_response = await dap.bind({
    //         protocol_id: id_idm_dap,
    //         parameter: new DirectoryBindArgument(undefined, undefined),
    //     });
    //     if ("result" in bind_response) {
    //         expect(bind_response.result.parameter).toBeDefined();
    //     } else {
    //         assert(false);
    //     }
    //     const op1_response = await dap.list({
    //         object: {
    //             rdnSequence: [],
    //         },
    //     });
    //     if ("result" in op1_response) {
    //         const resultData = getOptionallyProtectedValue(op1_response.result.parameter);
    //         assert("listInfo" in resultData);
    //     } else {
    //         assert(false);
    //     }
    //     const op2_response = await dap.search({
    //         object: {
    //             rdnSequence: [],
    //         },
    //         subset: "level",
    //     });
    //     if ("result" in op2_response) {
    //         const resultData = getOptionallyProtectedValue(op2_response.result.parameter);
    //         assert("searchInfo" in resultData);
    //     } else {
    //         assert(false);
    //     }
    //     const unbind_response = await dap.unbind();
    //     assert("result" in unbind_response);
    // });
});
