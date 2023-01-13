import {
    ASN1Element,
    FALSE_BIT,
    TRUE_BIT,
} from "asn1-ts";
import {
    BER,
    DER,
    _encodeObjectIdentifier,
} from "asn1-ts/dist/node/functional";
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
import { IDMConnection } from "@wildboar/idm";
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
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import { AttributeTypeAndValue } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
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
    description,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa";
import {
    administrativeRole,
} from "@wildboar/x500/src/lib/modules/InformationFramework/administrativeRole.oa";
import {
    objectClass,
} from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
import {
    id_ar_autonomousArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-autonomousArea.va";
import * as crypto from "crypto";
import type { ResultOrError } from "@wildboar/x500/src/lib/types/ResultOrError";
import {
    ServiceControlOptions,
    ServiceControlOptions_manageDSAIT,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import {
    ServiceControls,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControls.ta";
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
import {
    _decode_ReadResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadResult.ta";
import {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import type {
    Code,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import { strict as assert } from "assert";
import {
    RelativeDistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/RelativeDistinguishedName.ta";
import {
    userPwdClass,
} from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/userPwdClass.oa";
import {
    userPwd,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/userPwd.oa";
import {
    userPassword,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/userPassword.oa";
import type {
    Credentials,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/Credentials.ta";
import {
    SimpleCredentials,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SimpleCredentials.ta";
import {
    IdmBindError,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IdmBindError.ta";
import {
    IdmBindResult,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IdmBindResult.ta";
import {
    pwdFails,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdFails.oa";
import {
    pwdFailureTime,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdFailureTime.oa";
import {
    pwdStartTime,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdStartTime.oa";
import {
    directoryBindError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/directoryBindError.oa";

function sleep (ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

jest.setTimeout(30000);

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

describe("Meerkat DSA Authentication", () => {

    let connection: IDMConnection | undefined;

    beforeEach(async () => {
        if (!connection) {
            connection = await connect();
        }
    });

    it.skip("Directory bind with correct simple credentials permits access", async () => {
        // Already covered elsewhere.
    });

    it("Directory bind via a password works and updates operational attributes correctly", async () => {
        const loginId = `authn.simple.password.incorrect-${(new Date()).toISOString()}-login`;
        const queryId = `authn.simple.password.incorrect-${(new Date()).toISOString()}-query`;
        const loginDN = createTestRootDN(loginId);
        const queryDN = createTestRootDN(queryId);
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
            await createTestRootNode(connection!, queryId, [
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

        expect(connect({
            simple: new SimpleCredentials(
                queryDN,
                undefined,
                {
                    userPwd: {
                        clear: "WRONG_PASSWORD",
                    },
                },
            ),
        })).rejects.toBeInstanceOf(IdmBindError);

        await sleep(2000);

        const authenticatedConnection = await connect({
            simple: new SimpleCredentials(
                loginDN,
                undefined,
                {
                    userPwd: {
                        clear: password,
                    },
                },
            ),
        });

        {
            const reqData = new ReadArgumentData(
                {
                    rdnSequence: queryDN,
                },
                new EntryInformationSelection(
                    {
                        allUserAttributes: null,
                    },
                    undefined,
                    {
                        allOperationalAttributes: null,
                    },
                ),
            );
            const arg: ReadArgument = {
                unsigned: reqData,
            };
            const response = await writeOperation(
                authenticatedConnection!,
                read["&operationCode"]!,
                _encode_ReadArgument(arg, DER),
            );
            assert("result" in response);
            assert(response.result);
            const decoded = _decode_ReadResult(response.result);
            const data = getOptionallyProtectedValue(decoded);
            const fails = data.entry.information
                ?.find((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(pwdFails["&id"]));
            const startTime = data.entry.information
                ?.find((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(pwdStartTime["&id"]));
            const failTime = data.entry.information
                ?.find((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(pwdFailureTime["&id"]));
            const upass = data.entry.information
                ?.find((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(userPassword["&id"]));
            const upwd = data.entry.information
                ?.find((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(userPwd["&id"]));
            assert(fails);
            assert(startTime);
            assert(failTime);
            assert(upass);
            assert(upwd);
            assert("attribute" in fails);
            assert("attribute" in startTime);
            assert("attribute" in failTime);
            assert("attribute" in upass);
            assert("attribute" in upwd);
            expect(fails.attribute.values).toHaveLength(1);
            expect(startTime.attribute.values).toHaveLength(1);
            expect(failTime.attribute.values).toHaveLength(1);
            expect(upass.attribute.values).toHaveLength(1);
            expect(upwd.attribute.values).toHaveLength(1);
            expect(fails.attribute.values[0].integer).toBe(1);
            const st = startTime.attribute.values[0].generalizedTime;
            const ft = failTime.attribute.values[0].generalizedTime;
            expect(ft.valueOf()).toBeGreaterThan(st.valueOf());
            const now = (new Date()).toISOString().slice(0, 15);
            expect(st.toISOString().slice(0, 15)).toBe(now);
            expect(ft.toISOString().slice(0, 15)).toBe(now);
            expect(upass.attribute.values[0].value).toHaveLength(0);
        }

        // A correct login to reset pwdFails
        await connect({
            simple: new SimpleCredentials(
                queryDN,
                undefined,
                {
                    userPwd: {
                        clear: password,
                    },
                },
            ),
        });

        {
            const reqData = new ReadArgumentData(
                {
                    rdnSequence: queryDN,
                },
                new EntryInformationSelection(
                    {
                        allUserAttributes: null,
                    },
                    undefined,
                    {
                        allOperationalAttributes: null,
                    },
                ),
            );
            const arg: ReadArgument = {
                unsigned: reqData,
            };
            const response = await writeOperation(
                authenticatedConnection!,
                read["&operationCode"]!,
                _encode_ReadArgument(arg, DER),
            );
            assert("result" in response);
            assert(response.result);
            const decoded = _decode_ReadResult(response.result);
            const data = getOptionallyProtectedValue(decoded);
            const fails = data.entry.information
                ?.find((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(pwdFails["&id"]));
            const startTime = data.entry.information
                ?.find((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(pwdStartTime["&id"]));
            const failTime = data.entry.information
                ?.find((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(pwdFailureTime["&id"]));
            assert(fails);
            assert(startTime);
            assert(failTime);
            assert("attribute" in fails);
            assert("attribute" in startTime);
            assert("attribute" in failTime);
            expect(fails.attribute.values).toHaveLength(1);
            expect(startTime.attribute.values).toHaveLength(1);
            expect(failTime.attribute.values).toHaveLength(1);
            expect(fails.attribute.values[0].integer).toBe(0);
            const st = startTime.attribute.values[0].generalizedTime;
            const ft = failTime.attribute.values[0].generalizedTime;
            expect(ft.valueOf()).toBeGreaterThan(st.valueOf());
            const now = (new Date()).toISOString().slice(0, 15);
            expect(st.toISOString().slice(0, 15)).toBe(now);
            expect(ft.toISOString().slice(0, 15)).toBe(now);
        }
    });

    it.skip("An invalid password attempt increments the number of password failures", async () => {
        // Already tested elsewhere.
    });

    it.skip("An valid password attempt resets the number of password failures to 0", async () => {
        // Already tested elsewhere
    });

    it.skip("An invalid password attempt updates the pwdFailureTime", async () => {
        // Already tested elsewhere.
    });

    it.skip("A password's pwdStartTime attribute is set correctly", async () => {
        // Already tested elsewhere.
    });

    it.skip("The password is never returned in an entry", async () => {
        // Already tested above for userPassword. Manually tested for userPwd.
    });

    it("Directory bind does not reveal which objects exist by displaying a different error message when the bind DN is wrong than when the password is wrong", async () => {
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
        expect(dnData.error.securityError).toBe(pwData.error.securityError);
    });

    it("Operations cannot be performed if authentication fails", async () => {
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
        expect(writeOperation(
            unboundConnection!,
            read["&operationCode"]!,
            _encode_ReadArgument(arg, DER),
        )).rejects.toBeTruthy();
    });

});
