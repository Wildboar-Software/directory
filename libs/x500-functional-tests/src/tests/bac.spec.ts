import { describe, it } from "node:test";
import {
    ASN1Element,
    FALSE_BIT,
    TRUE_BIT,
    ObjectIdentifier,
    OBJECT_IDENTIFIER,
    FALSE,
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
import {
    IDMConnection,
} from "@wildboar/idm";
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
import type { AttributeType } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta.js";
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
    localityName,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/localityName.oa.js";
import {
    administrativeRole,
} from "@wildboar/x500/src/lib/modules/InformationFramework/administrativeRole.oa.js";
import {
    objectClass,
} from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa.js";
import {
    id_ar_autonomousArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-autonomousArea.va.js";
import {
    id_ar_accessControlSpecificArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-accessControlSpecificArea.va.js";
import {
    id_ar_accessControlInnerArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-accessControlInnerArea.va.js";
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
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue.js";
import {
    compare,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/compare.oa.js";
import {
    CompareArgument,
    _encode_CompareArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareArgument.ta.js";
import {
    CompareArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareArgumentData.ta.js";
import {
    _decode_CompareResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareResult.ta.js";
import {
    AttributeValueAssertion,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeValueAssertion.ta.js";
import {
    list,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/list.oa.js";
import {
    ListArgument,
    _encode_ListArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListArgument.ta.js";
import {
    ListArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListArgumentData.ta.js";
import {
    _decode_ListResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResult.ta.js";
import {
    removeEntry,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/removeEntry.oa.js";
import {
    RemoveEntryArgument,
    _encode_RemoveEntryArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/RemoveEntryArgument.ta.js";
import {
    RemoveEntryArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/RemoveEntryArgumentData.ta.js";
import {
    modifyEntry,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/modifyEntry.oa.js";
import {
    ModifyEntryArgument,
    _encode_ModifyEntryArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyEntryArgument.ta.js";
import {
    ModifyEntryArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyEntryArgumentData.ta.js";
import {
    modifyDN,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/modifyDN.oa.js";
import {
    ModifyDNArgument,
    _encode_ModifyDNArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyDNArgument.ta.js";
import {
    ModifyDNArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyDNArgumentData.ta.js";
import {
    administerPassword,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/administerPassword.oa.js";
import {
    AdministerPasswordArgument,
    _encode_AdministerPasswordArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AdministerPasswordArgument.ta.js";
import {
    AdministerPasswordArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AdministerPasswordArgumentData.ta.js";
import {
    changePassword,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/changePassword.oa.js";
import {
    ChangePasswordArgument,
    _encode_ChangePasswordArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ChangePasswordArgument.ta.js";
import {
    ChangePasswordArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ChangePasswordArgumentData.ta.js";
import {
    search,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/search.oa.js";
import {
    SearchArgument,
    _encode_SearchArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgument.ta.js";
import {
    SearchArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData.ta.js";
import {
    SearchArgumentData_subset_wholeSubtree,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData-subset.ta.js";
import {
    _decode_SearchResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchResult.ta.js";
import {
    Attribute_valuesWithContext_Item,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute-valuesWithContext-Item.ta.js";
import {
    Context,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Context.ta.js";
import {
    localeContext,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/localeContext.oa.js";
import {
    _encode_LocaleContextSyntax,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/LocaleContextSyntax.ta.js";
import { strict as assert } from "assert";
import {
    RelativeDistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/RelativeDistinguishedName.ta.js";
import {
    person,
} from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/person.oa.js";
import {
    surname,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/surname.oa.js";
import { subentry } from "@wildboar/x500/src/lib/modules/InformationFramework/subentry.oa.js";
import {
    accessControlSubentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/accessControlSubentry.oa.js";
import {
    SubtreeSpecification,
    _encode_SubtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/SubtreeSpecification.ta.js";
import {
    subtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/subtreeSpecification.oa.js";
import {
    userPwdClass,
} from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/userPwdClass.oa.js";
import {
    ACIItem,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/ACIItem.ta.js";
import {
    ACIItem_itemOrUserFirst_itemFirst,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/ACIItem-itemOrUserFirst-itemFirst.ta.js";
import {
    AuthenticationLevel_basicLevels,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels.ta.js";
import {
    AuthenticationLevel_basicLevels_level_none,
    AuthenticationLevel_basicLevels_level_simple,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels-level.ta.js";
import {
    ItemPermission,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/ItemPermission.ta.js";
import {
    ProtectedItems,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/ProtectedItems.ta.js";
import {
    UserClasses,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/UserClasses.ta.js";
import {
    prescriptiveACI,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/prescriptiveACI.oa.js";
import {
    subentryACI,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/subentryACI.oa.js";
import {
    entryACI,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/entryACI.oa.js";
import { nameError } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/nameError.oa.js";
import { securityError } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/securityError.oa.js";
import {
    SecurityProblem_insufficientAccessRights,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta.js";
import {
    NameProblem_noSuchObject,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameProblem.ta.js";
import compareCode from "@wildboar/x500/src/lib/utils/compareCode.js";
import {
    accessControlScheme,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/accessControlScheme.oa.js";
import {
    basicAccessControlScheme,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/basicAccessControlScheme.va.js";
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
    NameAndOptionalUID,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/NameAndOptionalUID.ta.js";
import {
    ModifyRights_Item_permission_add,
    ModifyRights_Item_permission_remove,
    ModifyRights_Item_permission_rename,
    ModifyRights_Item_permission_move,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyRights-Item-permission.ta.js";
import {
    createTestRootDN,
    createTestRootNode,
    utf8,
    oid,
} from "../utils.js";

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

const activateAccessControl = (
    connection: IDMConnection,
    dn: DistinguishedName,
    scheme: OBJECT_IDENTIFIER,
): Promise<ResultOrError> => {
    const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
        {
            rdnSequence: dn,
        },
        [
            {
                addValues: new Attribute(
                    accessControlScheme["&id"],
                    [oid(scheme)],
                    undefined,
                ),
            },
        ],
        undefined,
        undefined,
    );
    const arg: ModifyEntryArgument = {
        unsigned: reqData,
    };
    return writeOperation(
        connection!,
        modifyEntry["&operationCode"]!,
        _encode_ModifyEntryArgument(arg, DER),
    );
};

const AC_SUBENTRY_NAME: string = "access control";
// This covers all attribute types used in the test root node and subentry.
const TEST_RELATED_ATTRIBUTES: AttributeType[] = [
    administrativeRole["&id"],
    accessControlScheme["&id"],
    entryACI["&id"],
    subentryACI["&id"],
    prescriptiveACI["&id"],
    commonName["&id"],
    description["&id"],
    subtreeSpecification["&id"],
    objectClass["&id"],
];

/**
 * ACIItems that will be needed for each test to modify administrative points,
 * create subentries, change the access control scheme, etc.
 */
const aciForTesting: ACIItem[] = [
    new ACIItem(
        {
            uTF8String: "Grant Access to Administrative Attributes and Subentries",
        },
        128,
        {
            basicLevels: new AuthenticationLevel_basicLevels(
                AuthenticationLevel_basicLevels_level_none,
                undefined,
                undefined,
            ),
        },
        {
            itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                new ProtectedItems(
                    undefined,
                    undefined,
                    TEST_RELATED_ATTRIBUTES,
                    TEST_RELATED_ATTRIBUTES,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    {
                        or: [
                            {
                                item: subentry["&id"],
                            },
                            {
                                item: accessControlSubentry["&id"],
                            },
                            {
                                item: applicationProcess["&id"],
                            },
                            {
                                item: userPwdClass["&id"],
                            },
                        ],
                    },
                ),
                [
                    new ItemPermission(
                        undefined,
                        new UserClasses(
                            null,
                        ),
                        new Uint8ClampedArray([
                            TRUE_BIT,
                            FALSE_BIT, // denyAdd.
                            // TRUE_BIT, // disclose on error
                            // FALSE_BIT,
                            // TRUE_BIT, // grantRead
                            // FALSE_BIT,
                            // FALSE_BIT,
                            // FALSE_BIT,
                            // TRUE_BIT, // grantBrowse
                            // FALSE_BIT,
                            // FALSE_BIT, // grantExport
                            // FALSE_BIT,
                            // FALSE_BIT, // grantImport
                            // FALSE_BIT,
                            // TRUE_BIT, // grantModify
                            // FALSE_BIT,
                            // FALSE_BIT, // grantRename
                            // FALSE_BIT,
                            // TRUE_BIT, // grantReturnDN
                        ]),
                    ),
                ],
            ),
        },
    ),
];

const permitReadAndDiscover = new ACIItem(
    {
        uTF8String: "Permit reading entry",
    },
    1,
    {
        basicLevels: new AuthenticationLevel_basicLevels(
            AuthenticationLevel_basicLevels_level_none,
            undefined,
            undefined,
        ),
    },
    {
        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
            new ProtectedItems(
                null,
                undefined,
                undefined,
                undefined,
                null,
            ),
            [
                new ItemPermission(
                    undefined,
                    new UserClasses(
                        null,
                    ),
                    new Uint8ClampedArray([
                        FALSE_BIT,
                        FALSE_BIT, // denyAdd.
                        TRUE_BIT, // disclose on error
                        FALSE_BIT,
                        TRUE_BIT, // grantRead
                        FALSE_BIT, // denyRead
                        FALSE_BIT,
                        FALSE_BIT,
                        TRUE_BIT, // grantBrowse
                        FALSE_BIT,
                        FALSE_BIT, // grantExport
                        FALSE_BIT,
                        FALSE_BIT, // grantImport
                        FALSE_BIT,
                        FALSE_BIT, // grantModify
                        FALSE_BIT,
                        FALSE_BIT, // grantRename
                        FALSE_BIT,
                        TRUE_BIT, // grantReturnDN
                    ]),
                ),
            ],
        ),
    },
);

describe("Meerkat DSA Basic Access Control", () => {

    let connection: IDMConnection | undefined;

    beforeEach(async () => {
        if (!connection) {
            connection = await connect();
        }
    });

    it("Read.modifyRightsRequest", async () => {
        const testId = `bac.authLevel-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        const password: string = "asdf";
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
                new Attribute(
                    userPwd["&id"],
                    [userPwd.encoderFor["&Type"]!({
                        clear: password,
                    }, DER)],
                    undefined,
                ),
            ]);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Permit reading the entry",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                undefined,
                                undefined,
                                undefined,
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantRead
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRemove
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        TRUE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantModify
                                        FALSE_BIT,
                                        TRUE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
                new ACIItem(
                    {
                        uTF8String: "Prohibit reading description for non-authenticated users",
                    },
                    2,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                undefined,
                                undefined,
                                [description["&id"]],
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // denyRead
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
                new ACIItem(
                    {
                        uTF8String: "Permit reading description for authenticated users",
                    },
                    3,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_simple,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                undefined,
                                undefined,
                                [description["&id"]],
                                [description["&id"]],
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantRead
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const authenticatedConnection = await connect({
            simple: new SimpleCredentials(
                dn,
                undefined,
                {
                    userPwd: {
                        clear: password,
                    },
                },
            ),
        });
        const reqData = new ReadArgumentData(
            {
                rdnSequence: dn,
            },
            undefined,
            true,
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
        assert(data.modifyRights);
        const itemRights = data.modifyRights.find((mr) => ("entry" in mr.item));
        expect(itemRights).toBeDefined();
        expect(itemRights?.permission[ModifyRights_Item_permission_add]).toBe(TRUE_BIT);
        expect(itemRights?.permission[ModifyRights_Item_permission_remove]).toBe(FALSE_BIT);
        expect(itemRights?.permission[ModifyRights_Item_permission_rename]).toBe(TRUE_BIT);
        expect(itemRights?.permission[ModifyRights_Item_permission_move]).toBe(TRUE_BIT);
        const desc = data.entry.information
            ?.find((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(description["&id"]));
        expect(desc).toBeDefined();
    });

    it("AddEntry correctly applies access control for a(n) Entry", async () => {
        const testId = `bac.addentry.entry-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "asdf",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        TRUE_BIT, // denyAdd.
                                        TRUE_BIT, // disclose on error
                                        FALSE_BIT,
                                        TRUE_BIT, // grantRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        TRUE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData: AddEntryArgumentData = new AddEntryArgumentData(
            {
                rdnSequence: [ ...dn, createTestRDN("F601D2D2-9B45-4068-9A4F-55FF18E3215D") ],
            },
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
                    [utf8("F601D2D2-9B45-4068-9A4F-55FF18E3215D")],
                    undefined,
                ),
                new Attribute(
                    surname["&id"],
                    [utf8("F601D2D2-9B45-4068-9A4F-55FF18E3215D")],
                    undefined,
                ),
            ],
        );
        const arg: AddEntryArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            addEntry["&operationCode"]!,
            _encode_AddEntryArgument(arg, DER),
        );
        assert("error" in response);
        assert(response.errcode);
        assert(response.error);
        assert(compareCode(response.errcode, securityError["&errorCode"]!));
        const decoded = securityError.decoderFor["&ParameterType"]!(response.error);
        const data = getOptionallyProtectedValue(decoded);
        expect(data.problem).toBe(SecurityProblem_insufficientAccessRights);
    });

    it("AddEntry correctly applies access control for a(n) Attribute", async () => {
        const testId = `bac.addentry.attribute-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Allow user to create entry",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        TRUE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        TRUE_BIT, // disclose on error
                                        FALSE_BIT,
                                        TRUE_BIT, // grantRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        TRUE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
                new ACIItem(
                    {
                        uTF8String: "Prohibit addition of localityName attribute.",
                    },
                    2,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                undefined,
                                undefined,
                                [localityName["&id"]],
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        TRUE_BIT, // denyAdd.
                                        TRUE_BIT, // disclose on error
                                        FALSE_BIT,
                                        TRUE_BIT, // grantRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData: AddEntryArgumentData = new AddEntryArgumentData(
            {
                rdnSequence: [ ...dn, createTestRDN("F601D2D2-9B45-4068-9A4F-55FF18E3215D") ],
            },
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
                    [utf8("F601D2D2-9B45-4068-9A4F-55FF18E3215D")],
                    undefined,
                ),
                new Attribute(
                    localityName["&id"],
                    [utf8("Should not be allowed to create this value.")],
                    undefined,
                ),
            ],
        );
        const arg: AddEntryArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            addEntry["&operationCode"]!,
            _encode_AddEntryArgument(arg, DER),
        );
        assert("error" in response);
        assert(response.errcode);
        assert(response.error);
        assert(compareCode(response.errcode, securityError["&errorCode"]!));
        const decoded = securityError.decoderFor["&ParameterType"]!(response.error);
        const data = getOptionallyProtectedValue(decoded);
        expect(data.problem).toBe(SecurityProblem_insufficientAccessRights);
    });

    it("AddEntry correctly applies access control for a(n) Value", async () => {
        const testId = `bac.addentry.value-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        const THE_FORBIDDEN_VALUE: string = "Should not be allowed to create this value.";
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Allow user to create entry with localityName",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        TRUE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        TRUE_BIT, // disclose on error
                                        FALSE_BIT,
                                        TRUE_BIT, // grantRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        TRUE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
                new ACIItem(
                    {
                        uTF8String: "Prohibit addition of the forbidden localityName value.",
                    },
                    2,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                                [
                                    new AttributeTypeAndValue(
                                        localityName["&id"],
                                        utf8(THE_FORBIDDEN_VALUE),
                                    ),
                                ],
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        TRUE_BIT, // denyAdd.
                                        TRUE_BIT, // disclose on error
                                        FALSE_BIT,
                                        TRUE_BIT, // grantRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData: AddEntryArgumentData = new AddEntryArgumentData(
            {
                rdnSequence: [ ...dn, createTestRDN("F601D2D2-9B45-4068-9A4F-55FF18E3215D") ],
            },
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
                    [utf8("F601D2D2-9B45-4068-9A4F-55FF18E3215D")],
                    undefined,
                ),
                new Attribute(
                    localityName["&id"],
                    [utf8(THE_FORBIDDEN_VALUE)],
                    undefined,
                ),
            ],
        );
        const arg: AddEntryArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            addEntry["&operationCode"]!,
            _encode_AddEntryArgument(arg, DER),
        );
        assert("error" in response);
        assert(response.errcode);
        assert(response.error);
        assert(compareCode(response.errcode, securityError["&errorCode"]!));
        const decoded = securityError.decoderFor["&ParameterType"]!(response.error);
        const data = getOptionallyProtectedValue(decoded);
        expect(data.problem).toBe(SecurityProblem_insufficientAccessRights);
    });

    it("Read correctly applies access control for a(n) Entry", async () => {
        const testId = `bac.read.entry-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Prohibit reading entry",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        TRUE_BIT, // denyAdd.
                                        TRUE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        TRUE_BIT, // denyRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        TRUE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new ReadArgumentData(
            {
                rdnSequence: dn,
            },
        );
        const arg: ReadArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            read["&operationCode"]!,
            _encode_ReadArgument(arg, DER),
        );
        assert("error" in response);
        assert(response.errcode);
        assert(response.error);
        assert(compareCode(response.errcode, securityError["&errorCode"]!));
        const decoded = securityError.decoderFor["&ParameterType"]!(response.error);
        const data = getOptionallyProtectedValue(decoded);
        expect(data.problem).toBe(SecurityProblem_insufficientAccessRights);
    });

    it("Read correctly applies access control for a(n) Attribute", async () => {
        const testId = `bac.read.attribute-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Permit reading the entry",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        TRUE_BIT, // denyAdd.
                                        TRUE_BIT, // disclose on error
                                        FALSE_BIT,
                                        TRUE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        TRUE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
                new ACIItem(
                    {
                        uTF8String: "Prohibit reading description",
                    },
                    2,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                undefined,
                                undefined,
                                undefined,
                                [description["&id"]],
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        TRUE_BIT, // denyAdd.
                                        TRUE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        TRUE_BIT, // denyRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        TRUE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new ReadArgumentData(
            {
                rdnSequence: dn,
            },
        );
        const arg: ReadArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            read["&operationCode"]!,
            _encode_ReadArgument(arg, DER),
        );
        assert("result" in response);
        assert(response.result);
        const decoded = _decode_ReadResult(response.result);
        const data = getOptionallyProtectedValue(decoded);
        const desc = data.entry.information
            ?.find((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(description["&id"]));
        expect(desc).toBeUndefined();
    });

    it("Read correctly applies access control for a(n) Value", async () => {
        const testId = `bac.read.value-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        const FORBIDDEN_VALUE: string = "EXODIA";
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
                new Attribute(
                    localityName["&id"],
                    [
                        utf8(FORBIDDEN_VALUE),
                        utf8("Not forbidden value"),
                    ],
                    undefined,
                ),
            ]);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Permit reading the entry and all values",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                null,
                                undefined,
                                undefined,
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        TRUE_BIT, // denyAdd.
                                        TRUE_BIT, // disclose on error
                                        FALSE_BIT,
                                        TRUE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        TRUE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
                new ACIItem(
                    {
                        uTF8String: "Prohibit reading forbidden localityName",
                    },
                    2,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                                [
                                    new AttributeTypeAndValue(
                                        localityName["&id"],
                                        utf8(FORBIDDEN_VALUE),
                                    ),
                                ],
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        TRUE_BIT, // denyRead
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new ReadArgumentData(
            {
                rdnSequence: dn,
            },
            new EntryInformationSelection(
                {
                    select: [ localityName["&id"] ],
                },
            ),
        );
        const arg: ReadArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            read["&operationCode"]!,
            _encode_ReadArgument(arg, DER),
        );
        assert("result" in response);
        assert(response.result);
        const decoded = _decode_ReadResult(response.result);
        const data = getOptionallyProtectedValue(decoded);
        const loc = data.entry.information
            ?.find((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(localityName["&id"]));
        assert(loc);
        assert("attribute" in loc);
        expect(loc.attribute.values.some((d) => d.utf8String === FORBIDDEN_VALUE)).toBeFalsy();
    });

    it("Compare correctly applies access control for a(n) Entry", async () => {
        const testId = `bac.compare.entry-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Prohibit reading entry",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        TRUE_BIT, // denyAdd.
                                        TRUE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        TRUE_BIT, // denyRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        TRUE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new CompareArgumentData(
            {
                rdnSequence: dn,
            },
            new AttributeValueAssertion(
                commonName["&id"],
                utf8(testId),
            ),
        );
        const arg: CompareArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            compare["&operationCode"]!,
            _encode_CompareArgument(arg, DER),
        );
        assert("error" in response);
        assert(response.errcode);
        assert(response.error);
        assert(compareCode(response.errcode, securityError["&errorCode"]!));
        const decoded = securityError.decoderFor["&ParameterType"]!(response.error);
        const data = getOptionallyProtectedValue(decoded);
        expect(data.problem).toBe(SecurityProblem_insufficientAccessRights);
    });

    it("Compare correctly applies access control for a(n) Attribute", async () => {
        const testId = `bac.compare.attribute-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        const COMPARED_VALUE: string = "asdf";
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
                new Attribute(
                    description["&id"],
                    [utf8(COMPARED_VALUE)],
                    undefined,
                ),
            ]);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Permit reading the entry",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        TRUE_BIT, // denyAdd.
                                        TRUE_BIT, // disclose on error
                                        FALSE_BIT,
                                        TRUE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        TRUE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
                new ACIItem(
                    {
                        uTF8String: "Prohibit comparing description",
                    },
                    2,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                undefined,
                                undefined,
                                undefined,
                                [description["&id"]],
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        TRUE_BIT, // denyAdd.
                                        TRUE_BIT, // disclose on error
                                        FALSE_BIT,
                                        TRUE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        TRUE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                        FALSE_BIT,
                                        FALSE_BIT, // grantCompare
                                        TRUE_BIT, // denyCompare
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new CompareArgumentData(
            {
                rdnSequence: dn,
            },
            new AttributeValueAssertion(
                description["&id"],
                utf8(COMPARED_VALUE),
            ),
        );
        const arg: CompareArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            compare["&operationCode"]!,
            _encode_CompareArgument(arg, DER),
        );
        assert("error" in response);
        assert(response.errcode);
        assert(response.error);
        assert(compareCode(response.errcode, securityError["&errorCode"]!));
        const decoded = securityError.decoderFor["&ParameterType"]!(response.error);
        const data = getOptionallyProtectedValue(decoded);
        expect(data.problem).toBe(SecurityProblem_insufficientAccessRights);
    });

    it("Compare correctly applies access control for a(n) Value", async () => {
        const testId = `bac.compare.value-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        const COMPARED_VALUE: string = "asdf";
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
                new Attribute(
                    localityName["&id"],
                    [utf8(COMPARED_VALUE)],
                    undefined,
                ),
            ]);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Permit reading the entry and all values",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                undefined,
                                undefined,
                                undefined,
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        TRUE_BIT, // denyAdd.
                                        TRUE_BIT, // disclose on error
                                        FALSE_BIT,
                                        TRUE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        TRUE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                        FALSE_BIT,
                                        TRUE_BIT, // grantCompare
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
                new ACIItem(
                    {
                        uTF8String: "Prohibit comparing the localityName value",
                    },
                    2,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                                [
                                    new AttributeTypeAndValue(
                                        localityName["&id"],
                                        utf8(COMPARED_VALUE),
                                    ),
                                ],
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        TRUE_BIT, // denyAdd.
                                        TRUE_BIT, // disclose on error
                                        FALSE_BIT,
                                        TRUE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        TRUE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                        FALSE_BIT,
                                        FALSE_BIT, // grantCompare
                                        TRUE_BIT, // denyCompare
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new CompareArgumentData(
            {
                rdnSequence: dn,
            },
            new AttributeValueAssertion(
                localityName["&id"],
                utf8(COMPARED_VALUE),
            ),
        );
        const arg: CompareArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            compare["&operationCode"]!,
            _encode_CompareArgument(arg, DER),
        );
        assert("result" in response);
        assert(response.result);
        const decoded = _decode_CompareResult(response.result);
        const data = getOptionallyProtectedValue(decoded);
        expect(data.matched).toBe(FALSE);
    });

    it("List correctly applies access control for a(n) Entry", async () => {
        const testId = `bac.list.entry-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            const subordinates = [
                "0113FF8E-0107-4468-AE19-415DEEB0C5B7",
                "A1CAA20F-6C19-46E6-8DC0-3622A291565B",
                "F601D2D2-9B45-4068-9A4F-55FF18E3215D",
                "181EC113-5DB3-4AE4-8ED7-AF45781DD354",
                "201A2FE2-6D48-4E2B-A925-5275F2D56F39",
            ];
            await Promise.all(subordinates.map((id, i) => (i % 2)
                ? createTestPerson(connection!, dn, id)
                : createTestNode(connection!, dn, id)));
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Prohibit reading people",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
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
                                {
                                    item: person["&id"],
                                },
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT, // grantBrowse
                                        TRUE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        FALSE_BIT, // grantReturnDN
                                        TRUE_BIT,
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
                new ACIItem(
                    {
                        uTF8String: "Permit reading processes",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
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
                                {
                                    item: applicationProcess["&id"],
                                },
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new ListArgumentData(
            {
                rdnSequence: dn,
            },
        );
        const arg: ListArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            list["&operationCode"]!,
            _encode_ListArgument(arg, DER),
        );
        assert("result" in response);
        assert(response.result);
        const decoded = _decode_ListResult(response.result);
        const data = getOptionallyProtectedValue(decoded);
        assert("listInfo" in data);
        expect(data.listInfo.subordinates).toHaveLength(3);
    });

    it("Search correctly applies access control for a(n) Entry", async () => {
        const testId = `bac.search.entry-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            const subordinates = [
                "0113FF8E-0107-4468-AE19-415DEEB0C5B7",
                "A1CAA20F-6C19-46E6-8DC0-3622A291565B",
                "F601D2D2-9B45-4068-9A4F-55FF18E3215D",
                "181EC113-5DB3-4AE4-8ED7-AF45781DD354",
                "201A2FE2-6D48-4E2B-A925-5275F2D56F39",
            ];
            await Promise.all(subordinates.map((id, i) => (i % 2)
                ? createTestPerson(connection!, dn, id)
                : createTestNode(connection!, dn, id)));
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Prohibit reading people",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
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
                                {
                                    item: person["&id"],
                                },
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT, // grantBrowse
                                        TRUE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        FALSE_BIT, // grantReturnDN
                                        TRUE_BIT,
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
                new ACIItem(
                    {
                        uTF8String: "Permit reading processes",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
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
                                {
                                    item: applicationProcess["&id"],
                                },
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_wholeSubtree,
        );
        const arg: SearchArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            search["&operationCode"]!,
            _encode_SearchArgument(arg, DER),
        );
        assert("result" in response);
        assert(response.result);
        const decoded = _decode_SearchResult(response.result);
        const data = getOptionallyProtectedValue(decoded);
        assert("searchInfo" in data);
        expect(data.searchInfo.entries).toHaveLength(4); // Remember, +1 for the base entry.
    });

    it("Search correctly applies access control for a Filtered Attribute", async () => {
        const testId = `bac.search.attribute.filtered-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            const soughtId: string = "F601D2D2-9B45-4068-9A4F-55FF18E3215D";
            const subordinates = [
                "0113FF8E-0107-4468-AE19-415DEEB0C5B7",
                "A1CAA20F-6C19-46E6-8DC0-3622A291565B",
                soughtId,
                "181EC113-5DB3-4AE4-8ED7-AF45781DD354",
                "201A2FE2-6D48-4E2B-A925-5275F2D56F39",
            ];
            await Promise.all(subordinates.map((id) => createTestNode(connection!, dn, id)));
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Permit reading everything",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                undefined,
                                undefined,
                                undefined,
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        TRUE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                        FALSE_BIT,
                                        TRUE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantFilterMatch
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
                new ACIItem(
                    {
                        uTF8String: "Prohibit filtering by common name",
                    },
                    2,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                undefined,
                                undefined,
                                [commonName["&id"]],
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        FALSE_BIT, // grantReturnDN
                                        FALSE_BIT,
                                        FALSE_BIT, // grantCompare
                                        FALSE_BIT,
                                        FALSE_BIT, // grantFilterMatch
                                        TRUE_BIT,
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_wholeSubtree,
            {
                item: {
                    present: commonName["&id"],
                },
            },
        );
        const arg: SearchArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            search["&operationCode"]!,
            _encode_SearchArgument(arg, DER),
        );
        assert("result" in response);
        assert(response.result);
        const decoded = _decode_SearchResult(response.result);
        const data = getOptionallyProtectedValue(decoded);
        assert("searchInfo" in data);
        /**
         * There should be 0 matches, because the filter should return UNDEFINED
         * for every entry in the search scope.
         */
        expect(data.searchInfo.entries).toHaveLength(0);
    });

    it("Search correctly applies access control for a(n) Filtered Value", async () => {
        const testId = `bac.search.value.filtered-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        const soughtId1: string = "F601D2D2-9B45-4068-9A4F-55FF18E3215D";
        const soughtId2: string = "181EC113-5DB3-4AE4-8ED7-AF45781DD354";
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            const subordinates = [
                "0113FF8E-0107-4468-AE19-415DEEB0C5B7",
                "A1CAA20F-6C19-46E6-8DC0-3622A291565B",
                soughtId1,
                soughtId2,
                "201A2FE2-6D48-4E2B-A925-5275F2D56F39",
            ];
            await Promise.all(subordinates.map((id) => createTestNode(connection!, dn, id)));
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Permit reading everything",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                undefined,
                                undefined,
                                undefined,
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        TRUE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                        FALSE_BIT,
                                        TRUE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantFilterMatch
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
                new ACIItem(
                    {
                        uTF8String: "Prohibit filtering by common name",
                    },
                    2,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                                [
                                    new AttributeTypeAndValue(
                                        commonName["&id"],
                                        utf8(soughtId1),
                                    ),
                                ],
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        FALSE_BIT, // grantReturnDN
                                        FALSE_BIT,
                                        FALSE_BIT, // grantCompare
                                        FALSE_BIT,
                                        FALSE_BIT, // grantFilterMatch
                                        TRUE_BIT,
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_wholeSubtree,
            {
                or: [
                    {
                        item: {
                            equality: new AttributeValueAssertion(
                                commonName["&id"],
                                utf8(soughtId1),
                            ),
                        },
                    },
                    {
                        item: {
                            equality: new AttributeValueAssertion(
                                commonName["&id"],
                                utf8(soughtId2),
                            ),
                        },
                    },
                ],
            },
        );
        const arg: SearchArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            search["&operationCode"]!,
            _encode_SearchArgument(arg, DER),
        );
        assert("result" in response);
        assert(response.result);
        const decoded = _decode_SearchResult(response.result);
        const data = getOptionallyProtectedValue(decoded);
        assert("searchInfo" in data);
        /**
         * There should be 1 match, because the filter should return UNDEFINED
         * for the one prohibited filter alternative, and TRUE for the other.
         */
        expect(data.searchInfo.entries).toHaveLength(1);
    });

    it("Search correctly applies access control for a(n) Selected Attribute", async () => {
        const testId = `bac.search.attribute.selected-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            const subordinates = [
                "0113FF8E-0107-4468-AE19-415DEEB0C5B7",
                "A1CAA20F-6C19-46E6-8DC0-3622A291565B",
                "F601D2D2-9B45-4068-9A4F-55FF18E3215D",
                "181EC113-5DB3-4AE4-8ED7-AF45781DD354",
                "201A2FE2-6D48-4E2B-A925-5275F2D56F39",
            ];
            await Promise.all(subordinates.map((id) => createTestNode(connection!, dn, id)));
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Enable reading everything",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                undefined,
                                undefined,
                                undefined,
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        TRUE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
                new ACIItem(
                    {
                        uTF8String: "Prohibit reading the description",
                    },
                    2,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                undefined,
                                undefined,
                                [description["&id"]],
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        TRUE_BIT, // denyRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        FALSE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_wholeSubtree,
        );
        const arg: SearchArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            search["&operationCode"]!,
            _encode_SearchArgument(arg, DER),
        );
        assert("result" in response);
        assert(response.result);
        const decoded = _decode_SearchResult(response.result);
        const data = getOptionallyProtectedValue(decoded);
        assert("searchInfo" in data);
        for (const entry of data.searchInfo.entries) {
            const desc = entry.information?.some((info) => (
                (("attribute" in info) && info.attribute.type_.isEqualTo(description["&id"]))
                || (("attributeType" in info) && info.attributeType.isEqualTo(description["&id"]))
            ));
            expect(desc).toBeFalsy();
        }
    });

    it("Search correctly applies access control for a(n) Selected Value", async () => {
        const testId = `bac.search.value.selected-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            const subordinates = [
                "0113FF8E-0107-4468-AE19-415DEEB0C5B7",
                "A1CAA20F-6C19-46E6-8DC0-3622A291565B",
                "F601D2D2-9B45-4068-9A4F-55FF18E3215D",
                "181EC113-5DB3-4AE4-8ED7-AF45781DD354",
                "201A2FE2-6D48-4E2B-A925-5275F2D56F39",
            ];
            await Promise.all(subordinates.map((id) => createTestNode(connection!, dn, id)));
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Enable reading everything",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                undefined,
                                undefined,
                                undefined,
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        TRUE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
                new ACIItem(
                    {
                        uTF8String: "Prohibit reading the objectClass value 'applicationProcess'",
                    },
                    2,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                                [
                                    new AttributeTypeAndValue(
                                        objectClass["&id"],
                                        oid(applicationProcess["&id"]),
                                    ),
                                ],
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        TRUE_BIT, // denyRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        FALSE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_wholeSubtree,
        );
        const arg: SearchArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            search["&operationCode"]!,
            _encode_SearchArgument(arg, DER),
        );
        assert("result" in response);
        assert(response.result);
        const decoded = _decode_SearchResult(response.result);
        const data = getOptionallyProtectedValue(decoded);
        assert("searchInfo" in data);
        for (const entry of data.searchInfo.entries) {
            const desc = entry.information?.some((info) =>
                ("attribute" in info)
                && info.attribute.type_.isEqualTo(objectClass["&id"])
                && (
                    info.attribute.values
                        .some((value) => value.objectIdentifier.isEqualTo(applicationProcess["&id"]))
                    || info.attribute.valuesWithContext
                        ?.some((vwc) => vwc.value.objectIdentifier.isEqualTo(applicationProcess["&id"]))
                ));
            expect(desc).toBe(false);
        }
    });

    it("RemoveEntry correctly applies access control for a(n) Entry", async () => {
        const testId = `bac.removeEntry.entry-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Prohibit deleting entry",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        TRUE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new RemoveEntryArgumentData(
            {
                rdnSequence: dn,
            },
        );
        const arg: RemoveEntryArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            removeEntry["&operationCode"]!,
            _encode_RemoveEntryArgument(arg, DER),
        );
        assert("error" in response);
        assert(response.errcode);
        assert(response.error);
        assert(compareCode(response.errcode, securityError["&errorCode"]!));
        const decoded = securityError.decoderFor["&ParameterType"]!(response.error);
        const data = getOptionallyProtectedValue(decoded);
        expect(data.problem).toBe(SecurityProblem_insufficientAccessRights);
    });

    it("ModifyEntry correctly applies access control for a(n) Entry", async () => {
        const testId = `bac.modifyEntry.entry-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Permit finding and reading the entry, but not modifying it",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                undefined,
                                undefined,
                                undefined,
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        TRUE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantModify
                                        TRUE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new ModifyEntryArgumentData(
            {
                rdnSequence: dn,
            },
            [],
            undefined,
        );
        const arg: ModifyEntryArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            modifyEntry["&operationCode"]!,
            _encode_ModifyEntryArgument(arg, DER),
        );
        assert("error" in response);
        assert(response.errcode);
        assert(response.error);
        assert(compareCode(response.errcode, securityError["&errorCode"]!));
        const decoded = securityError.decoderFor["&ParameterType"]!(response.error);
        const data = getOptionallyProtectedValue(decoded);
        expect(data.problem).toBe(SecurityProblem_insufficientAccessRights);
    });

    it("ModifyEntry correctly applies access control for a(n) addAttribute Attribute", async () => {
        const testId = `bac.modifyEntry.addAttribute.attribute-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Permit finding, reading, and modifying the entry",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                undefined,
                                undefined,
                                undefined,
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        TRUE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        TRUE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
                new ACIItem(
                    {
                        uTF8String: "Prohibit adding commonName",
                    },
                    2,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                undefined,
                                undefined,
                                [localityName["&id"]],
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        TRUE_BIT, // denyAdd.
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new ModifyEntryArgumentData(
            {
                rdnSequence: dn,
            },
            [
                {
                    addAttribute: new Attribute(
                        localityName["&id"],
                        [utf8("Not to be added")],
                        undefined,
                    ),
                },
            ],
            undefined,
        );
        const arg: ModifyEntryArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            modifyEntry["&operationCode"]!,
            _encode_ModifyEntryArgument(arg, DER),
        );
        assert("error" in response);
        assert(response.errcode);
        assert(response.error);
        assert(compareCode(response.errcode, securityError["&errorCode"]!));
        const decoded = securityError.decoderFor["&ParameterType"]!(response.error);
        const data = getOptionallyProtectedValue(decoded);
        expect(data.problem).toBe(SecurityProblem_insufficientAccessRights);
    });

    it("ModifyEntry correctly applies access control for a(n) addAttribute Value", async () => {
        const testId = `bac.modifyEntry.addAttribute.value-${(new Date()).toISOString()}`;
        const notToBeAddedValue: string = "Not to be added";
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Permit finding and reading the entry, but not modifying it", // FIXME: Duplicated string
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                undefined,
                                undefined,
                                undefined,
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        TRUE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        TRUE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
                new ACIItem(
                    {
                        uTF8String: "Prohibit adding commonName value",
                    },
                    2,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                                [
                                    new AttributeTypeAndValue(
                                        localityName["&id"],
                                        utf8(notToBeAddedValue),
                                    ),
                                ],
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        TRUE_BIT, // denyAdd.
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new ModifyEntryArgumentData(
            {
                rdnSequence: dn,
            },
            [
                {
                    addAttribute: new Attribute(
                        localityName["&id"],
                        [utf8(notToBeAddedValue)],
                        undefined,
                    ),
                },
            ],
            undefined,
        );
        const arg: ModifyEntryArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            modifyEntry["&operationCode"]!,
            _encode_ModifyEntryArgument(arg, DER),
        );
        assert("error" in response);
        assert(response.errcode);
        assert(response.error);
        assert(compareCode(response.errcode, securityError["&errorCode"]!));
        const decoded = securityError.decoderFor["&ParameterType"]!(response.error);
        const data = getOptionallyProtectedValue(decoded);
        expect(data.problem).toBe(SecurityProblem_insufficientAccessRights);
    });

    it("ModifyEntry correctly applies access control for a(n) addValues Attribute", async () => {
        const testId = `bac.modifyEntry.addValues.attribute-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Permit finding, reading, and modifying the entry", // FIXME: Copy these to the other descriptions
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                undefined,
                                undefined,
                                undefined,
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        TRUE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        TRUE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
                new ACIItem(
                    {
                        uTF8String: "Prohibit adding commonName",
                    },
                    2,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                undefined,
                                undefined,
                                [localityName["&id"]],
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        TRUE_BIT, // denyAdd.
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new ModifyEntryArgumentData(
            {
                rdnSequence: dn,
            },
            [
                {
                    addValues: new Attribute(
                        localityName["&id"],
                        [utf8("Not to be added")],
                        undefined,
                    ),
                },
            ],
            undefined,
        );
        const arg: ModifyEntryArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            modifyEntry["&operationCode"]!,
            _encode_ModifyEntryArgument(arg, DER),
        );
        assert("error" in response);
        assert(response.errcode);
        assert(response.error);
        assert(compareCode(response.errcode, securityError["&errorCode"]!));
        const decoded = securityError.decoderFor["&ParameterType"]!(response.error);
        const data = getOptionallyProtectedValue(decoded);
        expect(data.problem).toBe(SecurityProblem_insufficientAccessRights);
    });

    it("ModifyEntry correctly applies access control for a(n) addValues Value", async () => {
        const testId = `bac.modifyEntry.addValues.value-${(new Date()).toISOString()}`;
        const notToBeAddedValue: string = "Not to be added";
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Permit finding and reading the entry, but not modifying it", // FIXME: Duplicated string
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                undefined,
                                undefined,
                                undefined,
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        TRUE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        TRUE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
                new ACIItem(
                    {
                        uTF8String: "Prohibit adding commonName value",
                    },
                    2,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                                [
                                    new AttributeTypeAndValue(
                                        localityName["&id"],
                                        utf8(notToBeAddedValue),
                                    ),
                                ],
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        TRUE_BIT, // denyAdd.
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new ModifyEntryArgumentData(
            {
                rdnSequence: dn,
            },
            [
                {
                    addValues: new Attribute(
                        localityName["&id"],
                        [utf8(notToBeAddedValue)],
                        undefined,
                    ),
                },
            ],
            undefined,
        );
        const arg: ModifyEntryArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            modifyEntry["&operationCode"]!,
            _encode_ModifyEntryArgument(arg, DER),
        );
        assert("error" in response);
        assert(response.errcode);
        assert(response.error);
        assert(compareCode(response.errcode, securityError["&errorCode"]!));
        const decoded = securityError.decoderFor["&ParameterType"]!(response.error);
        const data = getOptionallyProtectedValue(decoded);
        expect(data.problem).toBe(SecurityProblem_insufficientAccessRights);
    });

    it("ModifyEntry correctly applies access control for a(n) removeAttribute Attribute", async () => {
        const testId = `bac.modifyEntry.removeAttribute.attribute-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Permit finding and reading the entry, but not modifying it", // FIXME: Duplicated string
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                undefined,
                                undefined,
                                undefined,
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        TRUE_BIT, // grantRemove
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        TRUE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
                new ACIItem(
                    {
                        uTF8String: "Prohibit removing description",
                    },
                    2,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                undefined,
                                [description["&id"]],
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRemove
                                        TRUE_BIT,
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new ModifyEntryArgumentData(
            {
                rdnSequence: dn,
            },
            [
                {
                    removeAttribute: description["&id"],
                },
            ],
            undefined,
        );
        const arg: ModifyEntryArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            modifyEntry["&operationCode"]!,
            _encode_ModifyEntryArgument(arg, DER),
        );
        assert("error" in response);
        assert(response.errcode);
        assert(response.error);
        assert(compareCode(response.errcode, securityError["&errorCode"]!));
        const decoded = securityError.decoderFor["&ParameterType"]!(response.error);
        const data = getOptionallyProtectedValue(decoded);
        expect(data.problem).toBe(SecurityProblem_insufficientAccessRights);
    });

    // This test is wrong. You do not need per-value permissions to remove the whole attribute.
    // it("ModifyEntry correctly applies access control for a(n) removeAttribute Value", async () => {
    //     const testId = `bac.modifyEntry.removeAttribute.value-${(new Date()).toISOString()}`;
    //     const dn = createTestRootDN(testId);
    //     const cannotBeRemoved: string = "asdf";
    //     { // Setup
    //         await createTestRootNode(connection!, testId, [
    //             new Attribute(
    //                 administrativeRole["&id"],
    //                 [oid(id_ar_accessControlSpecificArea)],
    //                 undefined,
    //             ),
    //             new Attribute(
    //                 description["&id"],
    //                 [utf8(cannotBeRemoved)],
    //                 undefined,
    //             ),
    //         ]);
    //         const acis: ACIItem[] = [
    //             ...aciForTesting,
    //             new ACIItem(
    //                 {
    //                     uTF8String: "Permit finding and reading the entry, but not modifying it", // FIXME: Duplicated string
    //                 },
    //                 1,
    //                 {
    //                     basicLevels: new AuthenticationLevel_basicLevels(
    //                         AuthenticationLevel_basicLevels_level_none,
    //                         undefined,
    //                         undefined,
    //                     ),
    //                 },
    //                 {
    //                     itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
    //                         new ProtectedItems(
    //                             null,
    //                             undefined,
    //                             undefined,
    //                             undefined,
    //                             null,
    //                         ),
    //                         [
    //                             new ItemPermission(
    //                                 undefined,
    //                                 new UserClasses(
    //                                     null,
    //                                 ),
    //                                 new Uint8ClampedArray([
    //                                     FALSE_BIT,
    //                                     FALSE_BIT, // denyAdd.
    //                                     FALSE_BIT, // disclose on error
    //                                     FALSE_BIT,
    //                                     FALSE_BIT, // grantRead
    //                                     FALSE_BIT, // denyRead
    //                                     TRUE_BIT, // grantRemove
    //                                     FALSE_BIT,
    //                                     TRUE_BIT, // grantBrowse
    //                                     FALSE_BIT,
    //                                     FALSE_BIT, // grantExport
    //                                     FALSE_BIT,
    //                                     FALSE_BIT, // grantImport
    //                                     FALSE_BIT,
    //                                     TRUE_BIT, // grantModify
    //                                     FALSE_BIT,
    //                                     FALSE_BIT, // grantRename
    //                                     FALSE_BIT,
    //                                     TRUE_BIT, // grantReturnDN
    //                                 ]),
    //                             ),
    //                         ],
    //                     ),
    //                 },
    //             ),
    //             new ACIItem(
    //                 {
    //                     uTF8String: "Prohibit removing description value",
    //                 },
    //                 2,
    //                 {
    //                     basicLevels: new AuthenticationLevel_basicLevels(
    //                         AuthenticationLevel_basicLevels_level_none,
    //                         undefined,
    //                         undefined,
    //                     ),
    //                 },
    //                 {
    //                     itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
    //                         new ProtectedItems(
    //                             null,
    //                             undefined,
    //                             undefined,
    //                             undefined,
    //                             undefined,
    //                             [
    //                                 new AttributeTypeAndValue(
    //                                     description["&id"],
    //                                     utf8(cannotBeRemoved),
    //                                 ),
    //                             ],
    //                         ),
    //                         [
    //                             new ItemPermission(
    //                                 undefined,
    //                                 new UserClasses(
    //                                     null,
    //                                 ),
    //                                 new Uint8ClampedArray([
    //                                     FALSE_BIT,
    //                                     FALSE_BIT, // denyAdd.
    //                                     FALSE_BIT,
    //                                     FALSE_BIT,
    //                                     FALSE_BIT,
    //                                     FALSE_BIT,
    //                                     FALSE_BIT, // grantRemove
    //                                     TRUE_BIT,
    //                                 ]),
    //                             ),
    //                         ],
    //                     ),
    //                 },
    //             ),
    //         ];
    //         const subentryRDN: RelativeDistinguishedName = [
    //             new AttributeTypeAndValue(
    //                 commonName["&id"],
    //                 utf8(AC_SUBENTRY_NAME),
    //             ),
    //         ];
    //         await createEntry(
    //             connection!,
    //             dn,
    //             subentryRDN,
    //             [
    //                 new Attribute(
    //                     objectClass["&id"],
    //                     [
    //                         oid(subentry["&id"]),
    //                         oid(accessControlSubentry["&id"]),
    //                     ],
    //                     undefined,
    //                 ),
    //                 new Attribute(
    //                     commonName["&id"],
    //                     [utf8(AC_SUBENTRY_NAME)],
    //                     undefined,
    //                 ),
    //                 new Attribute(
    //                     subtreeSpecification["&id"],
    //                     [
    //                         _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
    //                     ],
    //                     undefined,
    //                 ),
    //                 new Attribute(
    //                     prescriptiveACI["&id"],
    //                     acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
    //                     undefined,
    //                 ),
    //             ],
    //         );
    //         await activateAccessControl(connection!, dn, basicAccessControlScheme);
    //     }
    //     const reqData = new ModifyEntryArgumentData(
    //         {
    //             rdnSequence: dn,
    //         },
    //         [
    //             {
    //                 removeAttribute: description["&id"],
    //             },
    //         ],
    //         undefined,
    //     );
    //     const arg: ModifyEntryArgument = {
    //         unsigned: reqData,
    //     };
    //     const response = await writeOperation(
    //         connection!,
    //         modifyEntry["&operationCode"]!,
    //         _encode_ModifyEntryArgument(arg, DER),
    //     );
    //     assert("error" in response);
    //     assert(response.errcode);
    //     assert(response.error);
    //     assert(compareCode(response.errcode, securityError["&errorCode"]!));
    //     const decoded = securityError.decoderFor["&ParameterType"]!(response.error);
    //     const data = getOptionallyProtectedValue(decoded);
    //     expect(data.problem).toBe(SecurityProblem_insufficientAccessRights);
    // });

    it("ModifyEntry correctly applies access control for a(n) removeValues Attribute", async () => {
        const testId = `bac.modifyEntry.removeValues.attribute-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        const cannotBeRemoved: string = "asdf";
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
                new Attribute(
                    description["&id"],
                    [utf8(cannotBeRemoved)],
                    undefined,
                ),
            ]);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Permit finding and reading the entry, but not modifying it", // FIXME: Duplicated string
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                undefined,
                                undefined,
                                undefined,
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        TRUE_BIT, // grantRemove
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        TRUE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
                new ACIItem(
                    {
                        uTF8String: "Prohibit removing description value",
                    },
                    2,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                undefined,
                                [description["&id"]],
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRemove
                                        TRUE_BIT,
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new ModifyEntryArgumentData(
            {
                rdnSequence: dn,
            },
            [
                {
                    removeValues: new Attribute(
                        description["&id"],
                        [utf8(cannotBeRemoved)],
                        undefined,
                    ),
                },
            ],
            undefined,
        );
        const arg: ModifyEntryArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            modifyEntry["&operationCode"]!,
            _encode_ModifyEntryArgument(arg, DER),
        );
        assert("error" in response);
        assert(response.errcode);
        assert(response.error);
        assert(compareCode(response.errcode, securityError["&errorCode"]!));
        const decoded = securityError.decoderFor["&ParameterType"]!(response.error);
        const data = getOptionallyProtectedValue(decoded);
        expect(data.problem).toBe(SecurityProblem_insufficientAccessRights);
    });

    it("ModifyEntry correctly applies access control for a(n) removeValues Value", async () => {
        const testId = `bac.modifyEntry.removeValues.value-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        const cannotBeRemoved: string = "asdf";
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
                new Attribute(
                    description["&id"],
                    [utf8(cannotBeRemoved)],
                    undefined,
                ),
            ]);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Permit finding and reading the entry, but not modifying it", // FIXME: Duplicated string
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                undefined,
                                undefined,
                                undefined,
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        TRUE_BIT, // grantRemove
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        TRUE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
                new ACIItem(
                    {
                        uTF8String: "Prohibit removing description value",
                    },
                    2,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                                [
                                    new AttributeTypeAndValue(
                                        description["&id"],
                                        utf8(cannotBeRemoved),
                                    ),
                                ],
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRemove
                                        TRUE_BIT,
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new ModifyEntryArgumentData(
            {
                rdnSequence: dn,
            },
            [
                {
                    removeValues: new Attribute(
                        description["&id"],
                        [utf8(cannotBeRemoved)],
                        undefined,
                    ),
                },
            ],
            undefined,
        );
        const arg: ModifyEntryArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            modifyEntry["&operationCode"]!,
            _encode_ModifyEntryArgument(arg, DER),
        );
        assert("error" in response);
        assert(response.errcode);
        assert(response.error);
        assert(compareCode(response.errcode, securityError["&errorCode"]!));
        const decoded = securityError.decoderFor["&ParameterType"]!(response.error);
        const data = getOptionallyProtectedValue(decoded);
        expect(data.problem).toBe(SecurityProblem_insufficientAccessRights);
    });

    it.todo("ModifyEntry correctly applies access control for a(n) alterValues Attribute");
    it.todo("ModifyEntry correctly applies access control for a(n) alterValues Value");

    it("ModifyEntry correctly applies access control for a(n) resetValues Attribute", async () => {
        const testId = `bac.modifyEntry.resetValues.attribute-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
                new Attribute(
                    description["&id"],
                    [],
                    [
                        new Attribute_valuesWithContext_Item( // This value should be removed by the reset.
                            utf8("asdf"),
                            [
                                new Context(
                                    localeContext["&id"],
                                    [
                                        _encode_LocaleContextSyntax({
                                            localeID1: new ObjectIdentifier([1, 2, 3, 4, 5]),
                                        }, DER),
                                    ],
                                    undefined,
                                ),
                            ],
                        ),
                    ],
                ),
            ]);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Permit finding and reading the entry, but not modifying it", // FIXME: Duplicated string
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                undefined,
                                undefined,
                                undefined,
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        TRUE_BIT, // grantRemove
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        TRUE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
                new ACIItem(
                    {
                        uTF8String: "Prohibit resetting description value",
                    },
                    2,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                undefined,
                                undefined,
                                [description["&id"]],
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRemove
                                        TRUE_BIT,
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new ModifyEntryArgumentData(
            {
                rdnSequence: dn,
            },
            [
                {
                    resetValue: description["&id"],
                },
            ],
            undefined,
        );
        const arg: ModifyEntryArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            modifyEntry["&operationCode"]!,
            _encode_ModifyEntryArgument(arg, DER),
        );
        assert("error" in response);
        assert(response.errcode);
        assert(response.error);
        assert(compareCode(response.errcode, securityError["&errorCode"]!));
        const decoded = securityError.decoderFor["&ParameterType"]!(response.error);
        const data = getOptionallyProtectedValue(decoded);
        expect(data.problem).toBe(SecurityProblem_insufficientAccessRights);
    });

    it("ModifyEntry correctly applies access control for a(n) resetValues Value", async () => {
        const testId = `bac.modifyEntry.resetValues.value-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        const cannotBeRemoved: string = "asdf";
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
                new Attribute(
                    description["&id"],
                    [],
                    [
                        new Attribute_valuesWithContext_Item( // This value should be removed by the reset.
                            utf8(cannotBeRemoved),
                            [
                                new Context(
                                    localeContext["&id"],
                                    [
                                        _encode_LocaleContextSyntax({
                                            localeID1: new ObjectIdentifier([1, 2, 3, 4, 5]),
                                        }, DER),
                                    ],
                                    undefined,
                                ),
                            ],
                        ),
                    ],
                ),
            ]);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Permit finding and reading the entry, but not modifying it", // FIXME: Duplicated string
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                undefined,
                                undefined,
                                undefined,
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        TRUE_BIT, // grantRemove
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        TRUE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
                new ACIItem(
                    {
                        uTF8String: "Prohibit resetting description value",
                    },
                    2,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                                [
                                    new AttributeTypeAndValue(
                                        description["&id"],
                                        utf8(cannotBeRemoved),
                                        undefined,
                                    ),
                                ],
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRemove
                                        TRUE_BIT,
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new ModifyEntryArgumentData(
            {
                rdnSequence: dn,
            },
            [
                {
                    resetValue: description["&id"],
                },
            ],
            undefined,
        );
        const arg: ModifyEntryArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            modifyEntry["&operationCode"]!,
            _encode_ModifyEntryArgument(arg, DER),
        );
        assert("error" in response);
        assert(response.errcode);
        assert(response.error);
        assert(compareCode(response.errcode, securityError["&errorCode"]!));
        const decoded = securityError.decoderFor["&ParameterType"]!(response.error);
        const data = getOptionallyProtectedValue(decoded);
        expect(data.problem).toBe(SecurityProblem_insufficientAccessRights);
    });

    it("ModifyEntry correctly applies access control for a(n) replaceValues Attribute that is removed", async () => {
        const testId = `bac.modifyEntry.replaceValues.attribute-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Permit finding and reading the entry, but not modifying it",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                undefined,
                                undefined,
                                undefined,
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        TRUE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantModify
                                        TRUE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
                new ACIItem(
                    {
                        uTF8String: "Prohibit adding commonName",
                    },
                    2,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                undefined,
                                [commonName["&id"]],
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        TRUE_BIT, // denyAdd.
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new ModifyEntryArgumentData(
            {
                rdnSequence: dn,
            },
            [
                {
                    replaceValues: new Attribute(
                        commonName["&id"],
                        [utf8("Not to be added")],
                        undefined,
                    ),
                },
            ],
            undefined,
        );
        const arg: ModifyEntryArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            modifyEntry["&operationCode"]!,
            _encode_ModifyEntryArgument(arg, DER),
        );
        assert("error" in response);
        assert(response.errcode);
        assert(response.error);
        assert(compareCode(response.errcode, securityError["&errorCode"]!));
        const decoded = securityError.decoderFor["&ParameterType"]!(response.error);
        const data = getOptionallyProtectedValue(decoded);
        expect(data.problem).toBe(SecurityProblem_insufficientAccessRights);
    });

    it("ModifyEntry correctly applies access control for a(n) replaceValues Value that is removed", async () => {
        const testId = `bac.modifyEntry.replaceValues.value-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        const cannotBeRemoved: string = "asdf";
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
                new Attribute(
                    description["&id"],
                    [utf8(cannotBeRemoved)],
                    undefined,
                ),
            ]);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Permit finding, reading, and modifying the entry",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                undefined,
                                undefined,
                                undefined,
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        TRUE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantModify
                                        TRUE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
                new ACIItem(
                    {
                        uTF8String: "Prohibit removing a description value",
                    },
                    2,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                                [
                                    new AttributeTypeAndValue(
                                        description["&id"],
                                        utf8(cannotBeRemoved),
                                    ),
                                ],
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        TRUE_BIT, // denyAdd.
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new ModifyEntryArgumentData(
            {
                rdnSequence: dn,
            },
            [
                {
                    replaceValues: new Attribute(
                        description["&id"],
                        [utf8("Not to be added")],
                        undefined,
                    ),
                },
            ],
            undefined,
        );
        const arg: ModifyEntryArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            modifyEntry["&operationCode"]!,
            _encode_ModifyEntryArgument(arg, DER),
        );
        assert("error" in response);
        assert(response.errcode);
        assert(response.error);
        assert(compareCode(response.errcode, securityError["&errorCode"]!));
        const decoded = securityError.decoderFor["&ParameterType"]!(response.error);
        const data = getOptionallyProtectedValue(decoded);
        expect(data.problem).toBe(SecurityProblem_insufficientAccessRights);
    });

    it("ModifyDN correctly applies access control for a(n) Rename", async () => {
        const testId = `bac.modifyDN.rename-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        const newdesc = utf8(`${testId}-moved`);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
                new Attribute(
                    description["&id"],
                    [newdesc],
                    undefined,
                ),
            ]);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Prohibit renaming the entry",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        TRUE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantModify
                                        TRUE_BIT,
                                        FALSE_BIT, // grantRename
                                        TRUE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData: ModifyDNArgumentData = new ModifyDNArgumentData(
            dn,
            [
                new AttributeTypeAndValue(
                    description["&id"],
                    newdesc,
                ),
            ],
            false,
            undefined,
        );
        const arg: ModifyDNArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            modifyDN["&operationCode"]!,
            _encode_ModifyDNArgument(arg, DER),
        );
        assert("error" in response);
        assert(response.errcode);
        assert(response.error);
        assert(compareCode(response.errcode, securityError["&errorCode"]!));
        const decoded = securityError.decoderFor["&ParameterType"]!(response.error);
        const data = getOptionallyProtectedValue(decoded);
        expect(data.problem).toBe(SecurityProblem_insufficientAccessRights);
    });

    it("ModifyDN correctly applies access control for a(n) Export", async () => {
        const testId = `bac.modifyDN.export-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        const srcId: string = "asdf";
        const srcRDN = createTestRDN(srcId);
        const srcDN = [ ...dn, srcRDN ];
        const destId: string = "zxcv";
        const destRDN = createTestRDN(destId);
        const destDN = [ ...dn, destRDN ];
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            await createTestNode(connection!, dn, srcId);
            await createTestNode(connection!, dn, destId);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Prohibit everything except exporting the entry",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        TRUE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        TRUE_BIT,
                                        TRUE_BIT, // grantImport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantModify
                                        TRUE_BIT,
                                        TRUE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData: ModifyDNArgumentData = new ModifyDNArgumentData(
            srcDN,
            srcRDN,
            false,
            destDN,
        );
        const arg: ModifyDNArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            modifyDN["&operationCode"]!,
            _encode_ModifyDNArgument(arg, DER),
        );
        assert("error" in response);
        assert(response.errcode);
        assert(response.error);
        assert(compareCode(response.errcode, securityError["&errorCode"]!));
        const decoded = securityError.decoderFor["&ParameterType"]!(response.error);
        const data = getOptionallyProtectedValue(decoded);
        expect(data.problem).toBe(SecurityProblem_insufficientAccessRights);
    });

    it("ModifyDN correctly applies access control for a(n) Import", async () => {
        const testId = `bac.modifyDN.import-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        const srcId: string = "asdf";
        const srcRDN = createTestRDN(srcId);
        const srcDN = [ ...dn, srcRDN ];
        const destId: string = "zxcv";
        const destRDN = createTestRDN(destId);
        const destDN = [ ...dn, destRDN ];
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            await createTestNode(connection!, dn, srcId);
            await createTestNode(connection!, dn, destId);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Prohibit everything except importing the entry",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        TRUE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        TRUE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        TRUE_BIT,
                                        FALSE_BIT, // grantModify
                                        TRUE_BIT,
                                        TRUE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData: ModifyDNArgumentData = new ModifyDNArgumentData(
            srcDN,
            srcRDN,
            false,
            destDN,
        );
        const arg: ModifyDNArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            modifyDN["&operationCode"]!,
            _encode_ModifyDNArgument(arg, DER),
        );
        assert("error" in response);
        assert(response.errcode);
        assert(response.error);
        assert(compareCode(response.errcode, securityError["&errorCode"]!));
        const decoded = securityError.decoderFor["&ParameterType"]!(response.error);
        const data = getOptionallyProtectedValue(decoded);
        expect(data.problem).toBe(SecurityProblem_insufficientAccessRights);
    });

    // Skipped because this test is now broken because of previous entry caching.
    // TODO: Redo this test where you reconnect so the cache is cleared.
    it.skip("Find DSE correctly applies access control for a(n) Find DSE", async () => {
        const testId = `bac.findDSE-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Prohibit finding the entry",
                    },
                    140,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        TRUE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT, // grantBrowse
                                        TRUE_BIT,
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new ReadArgumentData(
            {
                rdnSequence: dn,
            },
        );
        const arg: ReadArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            read["&operationCode"]!,
            _encode_ReadArgument(arg, DER),
        );
        assert("error" in response);
        assert(response.errcode);
        assert(response.error);
        assert(compareCode(response.errcode, nameError["&errorCode"]!));
        const decoded = nameError.decoderFor["&ParameterType"]!(response.error);
        const data = getOptionallyProtectedValue(decoded);
        expect(data.problem).toBe(NameProblem_noSuchObject);
    });

    it("AdministerPassword correctly applies access control for a(n) Entry", async () => {
        const testId = `bac.apw.entry-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Prohibit modifying entry",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        TRUE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantModify
                                        TRUE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new AdministerPasswordArgumentData(
            dn,
            {
                clear: "asdf",
            },
        );
        const arg: AdministerPasswordArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            administerPassword["&operationCode"]!,
            _encode_AdministerPasswordArgument(arg, DER),
        );
        assert("error" in response);
        assert(response.errcode);
        assert(response.error);
        assert(compareCode(response.errcode, securityError["&errorCode"]!));
        const decoded = securityError.decoderFor["&ParameterType"]!(response.error);
        const data = getOptionallyProtectedValue(decoded);
        expect(data.problem).toBe(SecurityProblem_insufficientAccessRights);
    });

    it("AdministerPassword correctly applies access control for the userPwd attribute", async () => {
        const testId = `bac.apw.userPwd-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Permit reading and modifying the entry",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                undefined,
                                undefined,
                                undefined,
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        TRUE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        TRUE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        TRUE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
                new ACIItem(
                    {
                        uTF8String: "Prohibit modifying the userPwd attribute",
                    },
                    2,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                undefined,
                                undefined,
                                [userPwd["&id"]],
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantModify
                                        TRUE_BIT,
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new AdministerPasswordArgumentData(
            dn,
            {
                clear: "asdf",
            },
        );
        const arg: AdministerPasswordArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            administerPassword["&operationCode"]!,
            _encode_AdministerPasswordArgument(arg, DER),
        );
        assert("error" in response);
        assert(response.errcode);
        assert(response.error);
        assert(compareCode(response.errcode, securityError["&errorCode"]!));
        const decoded = securityError.decoderFor["&ParameterType"]!(response.error);
        const data = getOptionallyProtectedValue(decoded);
        expect(data.problem).toBe(SecurityProblem_insufficientAccessRights);
    });

    it("AdministerPassword correctly applies access control for the userPassword attribute", async () => {
        const testId = `bac.apw.userPassword-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Permit reading and modifying the entry",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                undefined,
                                undefined,
                                undefined,
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        TRUE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        TRUE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        TRUE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
                new ACIItem(
                    {
                        uTF8String: "Prohibit modifying the userPassword attribute",
                    },
                    2,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                undefined,
                                undefined,
                                [userPassword["&id"]],
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        TRUE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        TRUE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        TRUE_BIT, // grantModify
                                        FALSE_BIT,
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new AdministerPasswordArgumentData(
            dn,
            {
                clear: "asdf",
            },
        );
        const arg: AdministerPasswordArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            administerPassword["&operationCode"]!,
            _encode_AdministerPasswordArgument(arg, DER),
        );
        assert("error" in response);
        assert(response.errcode);
        assert(response.error);
        assert(compareCode(response.errcode, securityError["&errorCode"]!));
        const decoded = securityError.decoderFor["&ParameterType"]!(response.error);
        const data = getOptionallyProtectedValue(decoded);
        expect(data.problem).toBe(SecurityProblem_insufficientAccessRights);
    });

    it("ChangePassword correctly applies access control for a(n) Entry", async () => {
        const testId = `bac.cpw.entry-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        const oldPassword: string = "asdf";
        const newPassword: string = "zxcv";
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
                new Attribute(
                    userPwd["&id"],
                    [userPwd.encoderFor["&Type"]!({
                        clear: oldPassword,
                    }, DER)],
                    undefined,
                ),
            ]);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Prohibit modifying entry",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        TRUE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantModify
                                        TRUE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new ChangePasswordArgumentData(
            dn,
            {
                clear: oldPassword,
            },
            {
                clear: newPassword,
            },
        );
        const arg: ChangePasswordArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            changePassword["&operationCode"]!,
            _encode_ChangePasswordArgument(arg, DER),
        );
        assert("error" in response);
        assert(response.errcode);
        assert(response.error);
        assert(compareCode(response.errcode, securityError["&errorCode"]!));
        const decoded = securityError.decoderFor["&ParameterType"]!(response.error);
        const data = getOptionallyProtectedValue(decoded);
        expect(data.problem).toBe(SecurityProblem_insufficientAccessRights);
    });

    it("AdministerPassword correctly applies access control for the userPwd attribute", async () => {
        const testId = `bac.apw.userPwd-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        const oldPassword: string = "asdf";
        const newPassword: string = "zxcv";
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Permit reading and modifying the entry",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                undefined,
                                undefined,
                                undefined,
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        TRUE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        TRUE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        TRUE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
                new ACIItem(
                    {
                        uTF8String: "Prohibit modifying the userPwd attribute",
                    },
                    2,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                undefined,
                                undefined,
                                [userPwd["&id"]],
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantModify
                                        TRUE_BIT,
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new ChangePasswordArgumentData(
            dn,
            {
                clear: oldPassword,
            },
            {
                clear: newPassword,
            },
        );
        const arg: ChangePasswordArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            changePassword["&operationCode"]!,
            _encode_ChangePasswordArgument(arg, DER),
        );
        assert("error" in response);
        assert(response.errcode);
        assert(response.error);
        assert(compareCode(response.errcode, securityError["&errorCode"]!));
        const decoded = securityError.decoderFor["&ParameterType"]!(response.error);
        const data = getOptionallyProtectedValue(decoded);
        expect(data.problem).toBe(SecurityProblem_insufficientAccessRights);
    });

    it("AdministerPassword correctly applies access control for the userPassword attribute", async () => {
        const testId = `bac.apw.userPassword-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        const oldPassword: string = "asdf";
        const newPassword: string = "zxcv";
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Permit reading and modifying the entry",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                undefined,
                                undefined,
                                undefined,
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        TRUE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        TRUE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        TRUE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
                new ACIItem(
                    {
                        uTF8String: "Prohibit modifying the userPassword attribute",
                    },
                    2,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                undefined,
                                undefined,
                                [userPassword["&id"]],
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        TRUE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        TRUE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        TRUE_BIT, // grantModify
                                        FALSE_BIT,
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new ChangePasswordArgumentData(
            dn,
            {
                clear: oldPassword,
            },
            {
                clear: newPassword,
            },
        );
        const arg: ChangePasswordArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            changePassword["&operationCode"]!,
            _encode_ChangePasswordArgument(arg, DER),
        );
        assert("error" in response);
        assert(response.errcode);
        assert(response.error);
        assert(compareCode(response.errcode, securityError["&errorCode"]!));
        const decoded = securityError.decoderFor["&ParameterType"]!(response.error);
        const data = getOptionallyProtectedValue(decoded);
        expect(data.problem).toBe(SecurityProblem_insufficientAccessRights);
    });

    it("Subordinate access control specific administrative points override a superior access control specific administrative point", async () => {
        const testId = `bac.acsa.override-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        const subordinateId: string = "12D89DCF-78E5-44FC-AB43-274888A4106D";
        const subordinateRDN = createTestRDN(subordinateId);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            await createTestNode(connection!, dn, subordinateId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            const superiorACIs: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Prohibit reading",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        TRUE_BIT, // denyRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subordinateACIs: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Permit reading",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                undefined,
                                undefined,
                                undefined,
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        TRUE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        superiorACIs.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await createEntry(
                connection!,
                [ ...dn, subordinateRDN ],
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        subordinateACIs.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, [ ...dn, subordinateRDN ], basicAccessControlScheme);
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new ReadArgumentData(
            {
                rdnSequence: [ ...dn, subordinateRDN ],
            },
        );
        const arg: ReadArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            read["&operationCode"]!,
            _encode_ReadArgument(arg, DER),
        );
        assert("result" in response);
        assert(response.result);
        const decoded = _decode_ReadResult(response.result);
        const data = getOptionallyProtectedValue(decoded);
        const cn = data.entry.information
            ?.find((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(commonName["&id"]));
        expect(cn).toBeDefined();
    });

    it("Access control inner administrative areas augment an access control specific administrative areas", async () => {
        const testId = `bac.acia.override-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        const subordinateId: string = "12D89DCF-78E5-44FC-AB43-274888A4106D";
        const subordinateRDN = createTestRDN(subordinateId);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            await createTestNode(connection!, dn, subordinateId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlInnerArea)],
                    undefined,
                ),
            ]);
            const superiorACIs: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Prohibit reading",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        TRUE_BIT, // denyRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subordinateACIs: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Permit reading",
                    },
                    2,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                undefined,
                                undefined,
                                undefined,
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        TRUE_BIT, // grantRead
                                        FALSE_BIT, // denyRead
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        superiorACIs.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await createEntry(
                connection!,
                [ ...dn, subordinateRDN ],
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        subordinateACIs.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, [ ...dn, subordinateRDN ], basicAccessControlScheme);
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new ReadArgumentData(
            {
                rdnSequence: [ ...dn, subordinateRDN ],
            },
        );
        const arg: ReadArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            read["&operationCode"]!,
            _encode_ReadArgument(arg, DER),
        );
        assert("result" in response);
        assert(response.result);
        const decoded = _decode_ReadResult(response.result);
        const data = getOptionallyProtectedValue(decoded);
        const cn = data.entry.information
            ?.find((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(commonName["&id"]));
        expect(cn).toBeDefined();
    });

    it("Auth level can be used to determine access", async () => {
        const testId = `bac.authLevel-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        const password: string = "asdf";
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
                new Attribute(
                    userPwd["&id"],
                    [userPwd.encoderFor["&Type"]!({
                        clear: password,
                    }, DER)],
                    undefined,
                ),
            ]);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Permit reading the entry",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                undefined,
                                undefined,
                                undefined,
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantRead
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRemove
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
                new ACIItem(
                    {
                        uTF8String: "Prohibit reading description for non-authenticated users",
                    },
                    2,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                undefined,
                                undefined,
                                [description["&id"]],
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // denyRead
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
                new ACIItem(
                    {
                        uTF8String: "Permit reading description for authenticated users",
                    },
                    3,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_simple,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                undefined,
                                undefined,
                                [description["&id"]],
                                [description["&id"]],
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantRead
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }

        { // Unauthenticated attempt
            const unauthenticatedConnection = await connect({
                simple: new SimpleCredentials(
                    dn,
                ),
            });
            const reqData = new ReadArgumentData(
                {
                    rdnSequence: dn,
                },
            );
            const arg: ReadArgument = {
                unsigned: reqData,
            };
            const response = await writeOperation(
                unauthenticatedConnection!,
                read["&operationCode"]!,
                _encode_ReadArgument(arg, DER),
            );
            assert("result" in response);
            assert(response.result);
            const decoded = _decode_ReadResult(response.result);
            const data = getOptionallyProtectedValue(decoded);
            const desc = data.entry.information
                ?.find((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(description["&id"]));
            expect(desc).toBeUndefined();
        }

        { // Authenticated attempt
            const authenticatedConnection = await connect({
                simple: new SimpleCredentials(
                    dn,
                    undefined,
                    {
                        userPwd: {
                            clear: password,
                        },
                    },
                ),
            });
            const reqData = new ReadArgumentData(
                {
                    rdnSequence: dn,
                },
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
            const desc = data.entry.information
                ?.find((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(description["&id"]));
            expect(desc).toBeDefined();
        }
    });

    it("User class specificity can be used to decide between two equally precedent ACI items", async () => {
        const testId = `bac.userClass.precedence-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            const acis: ACIItem[] = [
                ...aciForTesting,
                new ACIItem(
                    {
                        uTF8String: "Permit reading the entry",
                    },
                    1,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                null,
                                undefined,
                                undefined,
                                undefined,
                                null,
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantRead
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRemove
                                        FALSE_BIT,
                                        TRUE_BIT, // grantBrowse
                                        FALSE_BIT,
                                        FALSE_BIT, // grantExport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantImport
                                        FALSE_BIT,
                                        FALSE_BIT, // grantModify
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRename
                                        FALSE_BIT,
                                        TRUE_BIT, // grantReturnDN
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
                new ACIItem(
                    {
                        uTF8String: "Prohibit reading description for non-authenticated users",
                    },
                    2,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                undefined,
                                undefined,
                                [description["&id"]],
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // denyRead
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
                new ACIItem(
                    {
                        uTF8String: "Permit reading description for authenticated users",
                    },
                    2,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                undefined,
                                undefined,
                                [description["&id"]],
                                [description["&id"]],
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        undefined,
                                        undefined,
                                        [new NameAndOptionalUID(
                                            dn,
                                            undefined,
                                        )],
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        FALSE_BIT,
                                        TRUE_BIT, // grantRead
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const authenticatedConnection = await connect({
            simple: new SimpleCredentials(
                dn,
            ),
        });
        const reqData = new ReadArgumentData(
            {
                rdnSequence: dn,
            },
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
        const desc = data.entry.information
            ?.find((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(description["&id"]));
        expect(desc).toBeDefined();
    });

    it("can use the subentryACI attributes to protect subentries", async () => {
        const testId = `bac.subentryACI-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        const subentryRDN: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8(AC_SUBENTRY_NAME),
            ),
        ];
        { // Setup
            const acis: ACIItem[] = [
                ...aciForTesting,
                permitReadAndDiscover,
            ];
            const subentryACIs = [
                ...aciForTesting, // Remember, prescriptiveACI does NOT apply to subentries, so we have to duplicate.
                permitReadAndDiscover,
                new ACIItem(
                    {
                        uTF8String: "Prohibit reading subtreeSpecification",
                    },
                    2,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                undefined,
                                undefined,
                                undefined,
                                [subtreeSpecification["&id"]],
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        TRUE_BIT, // denyRead
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
                new Attribute(
                    subentryACI["&id"],
                    subentryACIs.map((aci) => subentryACI.encoderFor["&Type"]!(aci, DER)),
                    undefined,
                ),
            ]);
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const serviceControlOptions: ServiceControlOptions = new Uint8ClampedArray(Array(15).fill(FALSE_BIT));
        // serviceControlOptions[ServiceControlOptions_subentries] = TRUE_BIT;
        const reqData = new ReadArgumentData(
            {
                rdnSequence: [ ...dn, subentryRDN ],
            },
            undefined,
            undefined,
            [],
            new ServiceControls(
                serviceControlOptions,
            ),
        );
        const arg: ReadArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            read["&operationCode"]!,
            _encode_ReadArgument(arg, DER),
        );
        assert("result" in response);
        assert(response.result);
        const decoded = _decode_ReadResult(response.result);
        const data = getOptionallyProtectedValue(decoded);
        const ss = data.entry.information
            ?.find((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(subtreeSpecification["&id"]));
        expect(ss).toBeUndefined();
    });

    it("can use the entryACI attributes to protect entries", async () => {
        const testId = `bac.entryACI.entry-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        const subentryRDN: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8(AC_SUBENTRY_NAME),
            ),
        ];
        { // Setup
            const acis: ACIItem[] = [
                ...aciForTesting,
                permitReadAndDiscover,
            ];
            const entryACIs = [
                ...aciForTesting, // Remember, prescriptiveACI does NOT apply to subentries, so we have to duplicate.
                permitReadAndDiscover,
                new ACIItem(
                    {
                        uTF8String: "Prohibit reading localityName",
                    },
                    2,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                undefined,
                                undefined,
                                undefined,
                                [localityName["&id"]],
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        TRUE_BIT, // denyRead
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
                new Attribute(
                    entryACI["&id"],
                    entryACIs.map((aci) => entryACI.encoderFor["&Type"]!(aci, DER)),
                    undefined,
                ),
                new Attribute(
                    localityName["&id"],
                    [utf8("asdf")],
                    undefined,
                ),
            ]);
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new ReadArgumentData(
            {
                rdnSequence: dn,
            },
        );
        const arg: ReadArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            read["&operationCode"]!,
            _encode_ReadArgument(arg, DER),
        );
        assert("result" in response);
        assert(response.result);
        const decoded = _decode_ReadResult(response.result);
        const data = getOptionallyProtectedValue(decoded);
        const loc = data.entry.information
            ?.find((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(localityName["&id"]));
        expect(loc).toBeUndefined();
    });

    it("can use the entryACI attributes to protect subentries", async () => {
        const testId = `bac.entryACI.subentries-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        const subentryRDN: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8(AC_SUBENTRY_NAME),
            ),
        ];
        { // Setup
            const acis: ACIItem[] = [
                ...aciForTesting,
                permitReadAndDiscover,
            ];
            const subentryACIs = [
                ...aciForTesting, // Remember, prescriptiveACI does NOT apply to subentries, so we have to duplicate.
                permitReadAndDiscover,
                new ACIItem(
                    {
                        uTF8String: "Prohibit reading subtreeSpecification",
                    },
                    2,
                    {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            undefined,
                            undefined,
                        ),
                    },
                    {
                        itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                            new ProtectedItems(
                                undefined,
                                undefined,
                                undefined,
                                [subtreeSpecification["&id"]],
                            ),
                            [
                                new ItemPermission(
                                    undefined,
                                    new UserClasses(
                                        null,
                                    ),
                                    new Uint8ClampedArray([
                                        FALSE_BIT,
                                        FALSE_BIT, // denyAdd.
                                        FALSE_BIT, // disclose on error
                                        FALSE_BIT,
                                        FALSE_BIT, // grantRead
                                        TRUE_BIT, // denyRead
                                    ]),
                                ),
                            ],
                        ),
                    },
                ),
            ];
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                    new Attribute(
                        entryACI["&id"],
                        subentryACIs.map((aci) => entryACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const serviceControlOptions: ServiceControlOptions = new Uint8ClampedArray(Array(15).fill(FALSE_BIT));
        // serviceControlOptions[ServiceControlOptions_subentries] = TRUE_BIT;
        const reqData = new ReadArgumentData(
            {
                rdnSequence: [ ...dn, subentryRDN ],
            },
            undefined,
            undefined,
            [],
            new ServiceControls(
                serviceControlOptions,
            ),
        );
        const arg: ReadArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            read["&operationCode"]!,
            _encode_ReadArgument(arg, DER),
        );
        assert("result" in response);
        assert(response.result);
        const decoded = _decode_ReadResult(response.result);
        const data = getOptionallyProtectedValue(decoded);
        const ss = data.entry.information
            ?.find((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(subtreeSpecification["&id"]));
        expect(ss).toBeUndefined();
    });

    it("List uses the access controls of the subordinates to determine what is revealed", async () => {
        const testId = `bac.list.subordinate-acsa-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            // A subordinate in a new ACSA with no ACI items. Should be hidden.
            const withAcsaId: string = "with-acsa";
            // A subordinate in an ACIA with ACI items that deny access. Should be hidden.
            const withAciaId: string = "with-acia";
            // A subordinate in a new AAP with no access control at all. Should be visible.
            const withAapId: string = "with-aap";
            // A subordinate within the same ACSA as the superior. Should be visible.
            const sameAcsaId: string = "same-acsa"

            await createTestNode(connection!, dn, withAcsaId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlSpecificArea)],
                    undefined,
                ),
            ]);
            await activateAccessControl(connection!, [ ...dn, createTestRDN(withAcsaId) ], basicAccessControlScheme);

            await createTestNode(connection!, dn, withAciaId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_accessControlInnerArea)],
                    undefined,
                ),
            ]);

            await createTestNode(connection!, dn, withAapId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_autonomousArea)],
                    undefined,
                ),
            ]);

            await createTestNode(connection!, dn, sameAcsaId);

            const prohibitDiscoveryACI = new ACIItem(
                {
                    uTF8String: "Prohibit discovery",
                },
                1,
                {
                    basicLevels: new AuthenticationLevel_basicLevels(
                        AuthenticationLevel_basicLevels_level_none,
                        undefined,
                        undefined,
                    ),
                },
                {
                    itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                        new ProtectedItems(
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
                            {
                                item: applicationProcess["&id"],
                            },
                        ),
                        [
                            new ItemPermission(
                                undefined,
                                new UserClasses(
                                    null,
                                ),
                                new Uint8ClampedArray([
                                    FALSE_BIT,
                                    FALSE_BIT, // denyAdd.
                                    FALSE_BIT, // disclose on error
                                    FALSE_BIT,
                                    FALSE_BIT, // grantRead
                                    FALSE_BIT, // denyRead
                                    FALSE_BIT,
                                    FALSE_BIT,
                                    FALSE_BIT, // grantBrowse
                                    TRUE_BIT,
                                    FALSE_BIT, // grantExport
                                    FALSE_BIT,
                                    FALSE_BIT, // grantImport
                                    FALSE_BIT,
                                    FALSE_BIT, // grantModify
                                    FALSE_BIT,
                                    FALSE_BIT, // grantRename
                                    FALSE_BIT,
                                    FALSE_BIT, // grantReturnDN
                                    TRUE_BIT,
                                ]),
                            ),
                        ],
                    ),
                },
            );

            const permitDiscoveryACI = new ACIItem(
                {
                    uTF8String: "Permit discovery",
                },
                5,
                {
                    basicLevels: new AuthenticationLevel_basicLevels(
                        AuthenticationLevel_basicLevels_level_none,
                        undefined,
                        undefined,
                    ),
                },
                {
                    itemFirst: new ACIItem_itemOrUserFirst_itemFirst(
                        new ProtectedItems(
                            null,
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
                        ),
                        [
                            new ItemPermission(
                                undefined,
                                new UserClasses(
                                    null,
                                ),
                                new Uint8ClampedArray([
                                    FALSE_BIT,
                                    FALSE_BIT, // denyAdd.
                                    TRUE_BIT, // disclose on error
                                    FALSE_BIT,
                                    FALSE_BIT, // grantRead
                                    FALSE_BIT, // denyRead
                                    FALSE_BIT,
                                    FALSE_BIT,
                                    TRUE_BIT, // grantBrowse
                                    FALSE_BIT,
                                    FALSE_BIT, // grantExport
                                    FALSE_BIT,
                                    FALSE_BIT, // grantImport
                                    FALSE_BIT,
                                    FALSE_BIT, // grantModify
                                    FALSE_BIT,
                                    FALSE_BIT, // grantRename
                                    FALSE_BIT,
                                    TRUE_BIT, // grantReturnDN
                                ]),
                            ),
                        ],
                    ),
                },
            );

            const acis: ACIItem[] = [
                ...aciForTesting,
                permitDiscoveryACI,
            ];
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8(AC_SUBENTRY_NAME),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        acis.map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await createEntry(
                connection!,
                [ ...dn, createTestRDN(withAciaId) ],
                subentryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(subentry["&id"]),
                            oid(accessControlSubentry["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(AC_SUBENTRY_NAME)],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        prescriptiveACI["&id"],
                        [
                            prohibitDiscoveryACI,
                        ].map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
                        undefined,
                    ),
                ],
            );
            await activateAccessControl(connection!, dn, basicAccessControlScheme);
        }
        const reqData = new ListArgumentData(
            {
                rdnSequence: dn,
            },
        );
        const arg: ListArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            list["&operationCode"]!,
            _encode_ListArgument(arg, DER),
        );
        assert("result" in response);
        assert(response.result);
        const decoded = _decode_ListResult(response.result);
        const data = getOptionallyProtectedValue(decoded);
        assert("listInfo" in data);
        expect(data.listInfo.subordinates).toHaveLength(2);
    });

    it.todo("Controls access to values deleted by deleteOldRDN");

    it.todo("simplifiedAccessControl");

});
