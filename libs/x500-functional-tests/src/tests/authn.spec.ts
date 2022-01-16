import {
    ASN1Element,
    FALSE_BIT,
    TRUE_BIT,
    ObjectIdentifier,
    OBJECT_IDENTIFIER,
    INTEGER,
    FALSE,
} from "asn1-ts";
import {
    BER,
    DER,
    _encodeObjectIdentifier,
    _encodeInteger,
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
import {
    IDMConnection,
} from "@wildboar/idm";
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
import type { AttributeType } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";
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
    localityName,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/localityName.oa";
import {
    administrativeRole,
} from "@wildboar/x500/src/lib/modules/InformationFramework/administrativeRole.oa";
import {
    objectClass,
} from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
import {
    id_ar_autonomousArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-autonomousArea.va";
import {
    id_ar_accessControlSpecificArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-accessControlSpecificArea.va";
import {
    id_ar_accessControlInnerArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-accessControlInnerArea.va";
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
import {
    compare,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/compare.oa";
import {
    CompareArgument,
    _encode_CompareArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareArgument.ta";
import {
    CompareArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareArgumentData.ta";
import {
    _decode_CompareResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareResult.ta";
import {
    AttributeValueAssertion,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeValueAssertion.ta";
import {
    list,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/list.oa";
import {
    ListArgument,
    _encode_ListArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListArgument.ta";
import {
    ListArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListArgumentData.ta";
import {
    _decode_ListResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResult.ta";
import {
    removeEntry,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/removeEntry.oa";
import {
    RemoveEntryArgument,
    _encode_RemoveEntryArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/RemoveEntryArgument.ta";
import {
    RemoveEntryArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/RemoveEntryArgumentData.ta";
import {
    modifyEntry,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/modifyEntry.oa";
import {
    ModifyEntryArgument,
    _encode_ModifyEntryArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyEntryArgument.ta";
import {
    ModifyEntryArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyEntryArgumentData.ta";
import {
    modifyDN,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/modifyDN.oa";
import {
    ModifyDNArgument,
    _encode_ModifyDNArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyDNArgument.ta";
import {
    ModifyDNArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyDNArgumentData.ta";
import {
    administerPassword,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/administerPassword.oa";
import {
    AdministerPasswordArgument,
    _encode_AdministerPasswordArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AdministerPasswordArgument.ta";
import {
    AdministerPasswordArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AdministerPasswordArgumentData.ta";
import {
    changePassword,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/changePassword.oa";
import {
    ChangePasswordArgument,
    _encode_ChangePasswordArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ChangePasswordArgument.ta";
import {
    ChangePasswordArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ChangePasswordArgumentData.ta";
import {
    search,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/search.oa";
import {
    SearchArgument,
    _encode_SearchArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgument.ta";
import {
    SearchArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData.ta";
import {
    SearchArgumentData_subset_wholeSubtree,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData-subset.ta";
import {
    _decode_SearchResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchResult.ta";
import {
    Attribute_valuesWithContext_Item,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute-valuesWithContext-Item.ta";
import {
    Context,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Context.ta";
import {
    localeContext,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/localeContext.oa";
import {
    _encode_LocaleContextSyntax,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/LocaleContextSyntax.ta";
import { strict as assert } from "assert";
import {
    RelativeDistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/RelativeDistinguishedName.ta";
import {
    organization,
} from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/organization.oa";
import {
    organizationalUnit,
} from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/organizationalUnit.oa";
import {
    person,
} from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/person.oa";
import {
    device,
} from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/device.oa";
import {
    organizationName,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationName.oa";
import {
    organizationalUnitName,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationalUnitName.oa";
import {
    surname,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/surname.oa";
import { child } from "@wildboar/x500/src/lib/modules/InformationFramework/child.oa";
import { subentry } from "@wildboar/x500/src/lib/modules/InformationFramework/subentry.oa";
import {
    accessControlSubentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/accessControlSubentry.oa";
import {
    SubtreeSpecification,
    _encode_SubtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/SubtreeSpecification.ta";
import {
    subtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/subtreeSpecification.oa";
import {
    userPwdClass,
} from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/userPwdClass.oa";
import {
    ACIItem,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/ACIItem.ta";
import {
    ACIItem_itemOrUserFirst_itemFirst,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/ACIItem-itemOrUserFirst-itemFirst.ta";
import {
    AuthenticationLevel_basicLevels,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels.ta";
import {
    AuthenticationLevel_basicLevels_level_none,
    AuthenticationLevel_basicLevels_level_simple,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels-level.ta";
import {
    ItemPermission,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/ItemPermission.ta";
import {
    ProtectedItems,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/ProtectedItems.ta";
import {
    UserClasses,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/UserClasses.ta";
import {
    prescriptiveACI,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/prescriptiveACI.oa";
import {
    subentryACI,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/subentryACI.oa";
import {
    entryACI,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/entryACI.oa";
import { nameError } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/nameError.oa";
import { securityError } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/securityError.oa";
import {
    SecurityProblem_insufficientAccessRights,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import {
    NameProblem_noSuchObject,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameProblem.ta";
import compareCode from "@wildboar/x500/src/lib/utils/compareCode";
import {
    accessControlScheme,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/accessControlScheme.oa";
import {
    basicAccessControlScheme,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/basicAccessControlScheme.va";
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
    NameAndOptionalUID,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/NameAndOptionalUID.ta";
import {
    ModifyRights_Item_permission_add,
    ModifyRights_Item_permission_remove,
    ModifyRights_Item_permission_rename,
    ModifyRights_Item_permission_move,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyRights-Item-permission.ta";
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
    _decode_DirectoryBindResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/DirectoryBindResult.ta";
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

const HOST: string = "localhost";
const PORT: number = 4632;

const encodedDesc = _encode_UnboundedDirectoryString({
    uTF8String: "testeroo",
}, DER);

function utf8 (str: string): ASN1Element {
    return _encode_UnboundedDirectoryString({
        uTF8String: str,
    }, DER);
}

function oid (o: OBJECT_IDENTIFIER): ASN1Element {
    return _encodeObjectIdentifier(o, DER);
}

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

async function createTestNode(
    connection: IDMConnection,
    superiorDN: DistinguishedName,
    id: string,
    extraAttributes?: Attribute[],
): Promise<ResultOrError> {
    const encodedCN = _encode_UnboundedDirectoryString({
        uTF8String: id,
    }, DER);
    const addTestNode = createAddEntryArguments(
        [
            ...superiorDN,
            [
                new AttributeTypeAndValue(
                    commonName["&id"]!,
                    encodedCN,
                ),
            ],
        ],
        [
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
            _encode_AddEntryArgument(addTestNode, DER),
        );
    });
}

async function createTestPerson(
    connection: IDMConnection,
    superiorDN: DistinguishedName,
    id: string,
    extraAttributes?: Attribute[],
): Promise<ResultOrError> {
    const encodedCN = _encode_UnboundedDirectoryString({
        uTF8String: id,
    }, DER);
    const addTestNode = createAddEntryArguments(
        [
            ...superiorDN,
            [
                new AttributeTypeAndValue(
                    commonName["&id"]!,
                    encodedCN,
                ),
            ],
        ],
        [
            new Attribute(
                objectClass["&id"],
                [
                    _encodeObjectIdentifier(person["&id"], DER),
                ],
                undefined,
            ),
            new Attribute(
                commonName["&id"],
                [encodedCN],
                undefined,
            ),
            new Attribute(
                surname["&id"],
                [encodedCN],
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
            _encode_AddEntryArgument(addTestNode, DER),
        );
    });
}

async function createEntry(
    connection: IDMConnection,
    superiorDN: DistinguishedName,
    rdn: RelativeDistinguishedName,
    attributes: Attribute[],
): Promise<ResultOrError> {
    const addTestNode = createAddEntryArguments(
        [
            ...superiorDN,
            rdn,
        ],
        attributes,
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
            _encode_AddEntryArgument(addTestNode, DER),
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

        await sleep(1000);

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
