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

function int (i: INTEGER): ASN1Element {
    return _encodeInteger(i, DER);
}

async function connect(): Promise<IDMConnection> {
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

const parentRDN: RelativeDistinguishedName = [
    new AttributeTypeAndValue(
        organizationName["&id"],
        utf8("Wildboar Software"),
    ),
];

/**
 * @description
 *
 * organization
 * - organizationalUnit
 *   - person
 *   - device
 * - organizationalUnit
 * - person
 * - device
 *
 * @param connection
 * @param superiorDN
 */
async function createCompoundEntry(
    connection: IDMConnection,
    superiorDN: DistinguishedName,
): Promise<void> {
    await createEntry(
        connection,
        superiorDN,
        parentRDN,
        [
            new Attribute(
                objectClass["&id"],
                [oid(organization["&id"])],
                undefined,
            ),
            new Attribute(
                organizationName["&id"],
                [utf8("Wildboar Software")],
                undefined,
            ),
        ],
    );

    const level2A_rdn: RelativeDistinguishedName = [
        new AttributeTypeAndValue(
            organizationalUnitName["&id"],
            utf8("Finance Department"),
        ),
    ];
    await createEntry(
        connection,
        [...superiorDN, parentRDN],
        level2A_rdn,
        [
            new Attribute(
                objectClass["&id"],
                [oid(organizationalUnit["&id"]), oid(child["&id"])],
                undefined,
            ),
            new Attribute(
                organizationalUnitName["&id"],
                [utf8("Finance Department")],
                undefined,
            ),
        ],
    );

    const level2B_rdn: RelativeDistinguishedName = [
        new AttributeTypeAndValue(
            organizationalUnitName["&id"],
            utf8("Fun Department"),
        ),
    ];
    await createEntry(
        connection,
        [...superiorDN, parentRDN],
        level2B_rdn,
        [
            new Attribute(
                objectClass["&id"],
                [oid(organizationalUnit["&id"]), oid(child["&id"])],
                undefined,
            ),
            new Attribute(
                organizationalUnitName["&id"],
                [utf8("Fun Department")],
                undefined,
            ),
        ],
    );

    const level2C_rdn: RelativeDistinguishedName = [
        new AttributeTypeAndValue(
            commonName["&id"],
            utf8("Chief Pain Officer Jonathan Wilbur"),
        ),
    ];
    await createEntry(
        connection,
        [...superiorDN, parentRDN],
        level2C_rdn,
        [
            new Attribute(
                objectClass["&id"],
                [oid(person["&id"]), oid(child["&id"])],
                undefined,
            ),
            new Attribute(
                commonName["&id"],
                [utf8("Chief Pain Officer Jonathan Wilbur")],
                undefined,
            ),
            new Attribute(
                surname["&id"],
                [utf8("Wilbur")],
                undefined,
            ),
        ],
    );

    const level2D_rdn: RelativeDistinguishedName = [
        new AttributeTypeAndValue(
            commonName["&id"],
            utf8("Commodore 64 (128 KB memory extension)"),
        ),
    ];
    await createEntry(
        connection,
        [...superiorDN, parentRDN],
        level2D_rdn,
        [
            new Attribute(
                objectClass["&id"],
                [oid(device["&id"]), oid(child["&id"])],
                undefined,
            ),
            new Attribute(
                commonName["&id"],
                [utf8("Commodore 64 (128 KB memory extension)")],
                undefined,
            ),
        ],
    );

    const level3A_rdn: RelativeDistinguishedName = [
        new AttributeTypeAndValue(
            commonName["&id"],
            utf8("Bigfoot"),
        ),
    ];
    await createEntry(
        connection,
        [...superiorDN, parentRDN, level2A_rdn],
        level3A_rdn,
        [
            new Attribute(
                objectClass["&id"],
                [oid(person["&id"]), oid(child["&id"])],
                undefined,
            ),
            new Attribute(
                commonName["&id"],
                [utf8("Bigfoot")],
                undefined,
            ),
            new Attribute(
                surname["&id"],
                [utf8("Garfunkel")],
                undefined,
            ),
        ],
    );

    const level3B_rdn: RelativeDistinguishedName = [
        new AttributeTypeAndValue(
            commonName["&id"],
            utf8("Bigfoot's iPhone 4"),
        ),
    ];
    await createEntry(
        connection,
        [...superiorDN, parentRDN, level2A_rdn],
        level3B_rdn,
        [
            new Attribute(
                objectClass["&id"],
                [oid(device["&id"]), oid(child["&id"])],
                undefined,
            ),
            new Attribute(
                commonName["&id"],
                [utf8("Bigfoot's iPhone 4")],
                undefined,
            ),
        ],
    );
}

const activateAccessControl = (connection: IDMConnection, dn: DistinguishedName, scheme: OBJECT_IDENTIFIER): Promise<any> => {
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

describe("Meerkat DSA Basic Access Control", () => {

    let connection: IDMConnection | undefined;

    beforeEach(async () => {
        if (!connection) {
            connection = await connect();
        }
    });

    it.skip("Read.modifyRightsRequest", async () => {

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

    it.only("Find DSE correctly applies access control for a(n) Find DSE", async () => {
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
                                        TRUE_BIT, // disclose on error
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

    // TODO:
    it.skip("Subordinate access control specific administrative points override a superior access control specific administrative point", async () => {

    });

});
