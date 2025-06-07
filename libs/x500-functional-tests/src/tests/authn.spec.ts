import {
    ASN1Element,
    FALSE_BIT,
    TRUE_BIT,
} from "asn1-ts";
import {
    BER,
    DER,
    _encodeObjectIdentifier,
} from "asn1-ts/dist/node/functional.js";
import * as net from "net";
import {
    DirectoryBindArgument,
    _encode_DirectoryBindArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/DirectoryBindArgument.ta.js";
import {
    IdmBind,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IdmBind.ta.js";
import {
    _encode_IDM_PDU,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IDM-PDU.ta.js";
import {
    dap_ip,
} from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dap-ip.oa.js";
import { IDMConnection } from "@wildboar/idm";
import {
    addEntry,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/addEntry.oa.js";
import {
    AddEntryArgument,
    _encode_AddEntryArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AddEntryArgument.ta.js";
import {
    AddEntryArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AddEntryArgumentData.ta.js";
import {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta.js";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta.js";
import { AttributeTypeAndValue } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta.js";
import {
    commonName,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa.js";
import {
    _encode_UnboundedDirectoryString,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/UnboundedDirectoryString.ta.js";
import {
    applicationProcess,
} from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/applicationProcess.oa.js";
import {
    description,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa.js";
import {
    administrativeRole,
} from "@wildboar/x500/src/lib/modules/InformationFramework/administrativeRole.oa.js";
import {
    objectClass,
} from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa.js";
import {
    id_ar_autonomousArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-autonomousArea.va.js";
import * as crypto from "crypto";
import type { ResultOrError } from "@wildboar/x500/src/lib/types/ResultOrError.js";
import {
    ServiceControlOptions,
    ServiceControlOptions_manageDSAIT,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta.js";
import {
    ServiceControls,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControls.ta.js";
import {
    read,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/read.oa.js";
import {
    ReadArgument,
    _encode_ReadArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadArgument.ta.js";
import {
    ReadArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadArgumentData.ta.js";
import {
    _decode_ReadResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadResult.ta.js";
import {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta.js";
import type {
    Code,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta.js";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import { strict as assert } from "assert";
import {
    RelativeDistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/RelativeDistinguishedName.ta.js";
import {
    userPwdClass,
} from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/userPwdClass.oa.js";
import {
    userPwd,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/userPwd.oa.js";
import {
    userPassword,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/userPassword.oa.js";
import type {
    Credentials,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/Credentials.ta.js";
import {
    SimpleCredentials,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SimpleCredentials.ta.js";
import {
    IdmBindError,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IdmBindError.ta.js";
import {
    IdmBindResult,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IdmBindResult.ta.js";
import {
    pwdFails,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdFails.oa.js";
import {
    pwdFailureTime,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdFailureTime.oa.js";
import {
    pwdStartTime,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdStartTime.oa.js";
import {
    directoryBindError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/directoryBindError.oa.js";
import { describe, it, before } from "node:test";

function sleep (ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const serviceControlOptions: ServiceControlOptions = new Uint8ClampedArray(
    Array(9).fill(FALSE_BIT));
// Necessary to make countries administrative points.
serviceControlOptions[ServiceControlOptions_manageDSAIT] = TRUE_BIT;
const serviceControls = new ServiceControls(
    serviceControlOptions,
    undefined,
    60,
);

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

const HOST: string = process.env.MEERKAT_TEST_HOST ?? "localhost";
const PORT: number = process.env.MEERKAT_TEST_PORT
    ? Number.parseInt(process.env.MEERKAT_TEST_PORT)
    : 4632;

const encodedDesc = _encode_UnboundedDirectoryString({
    uTF8String: "testeroo",
}, DER);

async function connect(credentials?: Credentials): Promise<IDMConnection> {
    const dba = new DirectoryBindArgument(
        credentials,
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
    const idm = new IDMConnection(client);
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

async function getBindResponse(credentials?: Credentials): Promise<IdmBindError | IdmBindResult> {
    const dba = new DirectoryBindArgument(
        credentials,
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
    const idm = new IDMConnection(client);
    return new Promise((resolve) => {
        idm.events.once("bindError", (err) => {
            resolve(err);
        });
        idm.events.once("bindResult", (result) => {
            resolve(result);
        });
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
        undefined,
        [],
        serviceControls,
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

function writeOperation(
    connection: IDMConnection,
    opCode: Code,
    argument: ASN1Element,
): Promise<ResultOrError> {
    const invokeID = crypto.randomInt(1_000_000);
    return new Promise((resolve, reject) => {
        connection.events.on("abort", (abort) => {
            reject(abort);
            return;
        });
        connection.events.on("reject", (rej) => {
            reject(rej);
            return;
        });
        connection.events.on("unbind", () => {
            reject("UNBIND");
            return;
        });
        connection.events.on("socketError", () => {
            reject("SOCKET_ERROR");
            return;
        });
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

async function createTestRootNode(
    connection: IDMConnection,
    testId: string,
    extraAttributes?: Attribute[],
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
                    _encodeObjectIdentifier(userPwdClass["&id"], DER), // So passwords can be set.
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
            new Attribute(
                description["&id"],
                [
                    encodedDesc,
                ],
                undefined,
            ),
            ...(extraAttributes ?? []),
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

describe("Meerkat DSA Authentication", { timeout: 30000 }, async (t) => {
    let connection: IDMConnection | undefined;

    before(async () => {
        if (!connection) {
            connection = await connect();
        }
    });

    await it("Directory bind does not reveal which objects exist by displaying a different error message when the bind DN is wrong than when the password is wrong", async () => {
        const loginId = `authn.invalid.password.disclosure-${(new Date()).toISOString()}-login`;
        const loginDN = createTestRootDN(loginId);
        const wrongDN = createTestRootDN("WRONG_ID");
        const password: string = "asdf";
        { // Setup
            await createTestRootNode(connection!, loginId, [
                new Attribute(
                    userPwd["&id"],
                    [userPwd.encoderFor["&Type"]!({
                        clear: password,
                    }, DER)],
                    undefined,
                ),
            ]);
        }
        await sleep(1000);
        const wrongDNResponse = await getBindResponse({
            simple: new SimpleCredentials(
                wrongDN,
                undefined,
                {
                    userPwd: {
                        clear: password,
                    },
                },
            ),
        });
        await sleep(1000);
        const wrongPasswordResponse = await getBindResponse({
            simple: new SimpleCredentials(
                loginDN,
                undefined,
                {
                    userPwd: {
                        clear: "WRONG_PASSWORD",
                    },
                },
            ),
        });
        assert("error" in wrongDNResponse);
        assert("error" in wrongPasswordResponse);
        const dnResult = directoryBindError.decoderFor["&ParameterType"]!(wrongDNResponse.error);
        const pwResult = directoryBindError.decoderFor["&ParameterType"]!(wrongPasswordResponse.error);
        const dnData = getOptionallyProtectedValue(dnResult);
        const pwData = getOptionallyProtectedValue(pwResult);
        assert("securityError" in dnData.error);
        assert("securityError" in pwData.error);
        assert.strictEqual(dnData.error.securityError, pwData.error.securityError);
    });

    await it("Operations cannot be performed if authentication fails", async () => {
        const loginId = `authn.no-request-before-bind-${(new Date()).toISOString()}-login`;
        const loginDN = createTestRootDN(loginId);
        const password: string = "asdf";
        { // Setup
            await createTestRootNode(connection!, loginId, [
                new Attribute(
                    userPwd["&id"],
                    [userPwd.encoderFor["&Type"]!({
                        clear: password,
                    }, DER)],
                    undefined,
                ),
            ]);
        }
        await sleep(1000);
        const client = net.createConnection({
            host: HOST,
            port: PORT,
        }, () => {});
        const unboundConnection = new IDMConnection(client);
        const reqData = new ReadArgumentData(
            {
                rdnSequence: loginDN,
            },
        );
        const arg: ReadArgument = {
            unsigned: reqData,
        };
        await assert.rejects(
            writeOperation(
                unboundConnection!,
                read["&operationCode"]!,
                _encode_ReadArgument(arg, DER),
            )
        );
    });
});
