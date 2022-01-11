import {
    ASN1Element,
    FALSE_BIT,
    TRUE_BIT,
    ObjectIdentifier,
    OBJECT_IDENTIFIER,
    INTEGER,
    FALSE,
    TRUE,
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
    DistinguishedName, _decode_DistinguishedName, _encode_DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import { AttributeTypeAndValue } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
import type { AttributeType } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";
import {
    name,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
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
    createTimestamp,
} from "@wildboar/x500/src/lib/modules/InformationFramework/createTimestamp.oa";
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
import type {
    EntryInformation_information_Item,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation-information-Item.ta";
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
    _decode_ModifyEntryResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyEntryResult.ta";
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
    EntryInformationSelection_infoTypes_attributeTypesOnly as typesOnly,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection-infoTypes.ta";
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
    SearchArgumentData_subset_baseObject,
    SearchArgumentData_subset_oneLevel,
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
    ContextAssertion,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ContextAssertion.ta";
import {
    TypeAndContextAssertion,
    _encode_TypeAndContextAssertion,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/TypeAndContextAssertion.ta";
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
import {
    oidC,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/oidC.oa";
import {
    oidCobj,
} from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/oidCobj.oa";
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
    SearchControlOptions,
    // SearchControlOptions_checkOverspecified,
    SearchControlOptions_dnAttribute,
    SearchControlOptions_entryCount,
    // SearchControlOptions_includeAllAreas,
    SearchControlOptions_matchOnResidualName,
    // SearchControlOptions_noSystemRelaxation,
    // SearchControlOptions_performExactly,
    // SearchControlOptions_searchAliases,
    SearchControlOptions_searchFamily,
    SearchControlOptions_separateFamilyMembers,
    // SearchControlOptions_useSubset,
    SearchControlOptions_matchedValuesOnly,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchControlOptions.ta";
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
import { securityError } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/securityError.oa";
import {
    SecurityProblem_insufficientAccessRights,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
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
                                null,
                                undefined,
                                // [localityName["&id"]], // FIXME: This seems to be necessary.
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

    // TODO:
    it.skip("List correctly applies access control for a(n) Entry", async () => {

    });

    // TODO:
    it.skip("Search correctly applies access control for a(n) Entry", async () => {

    });

    // TODO:
    it.skip("Search correctly applies access control for a(n) Filtered Attribute", async () => {

    });

    // TODO:
    it.skip("Search correctly applies access control for a(n) Filtered Value", async () => {

    });

    // TODO:
    it.skip("Search correctly applies access control for a(n) Selected Attribute", async () => {

    });

    // TODO:
    it.skip("Search correctly applies access control for a(n) Selected Value", async () => {

    });

    // TODO:
    it.skip("RemoveEntry correctly applies access control for a(n) Entry", async () => {

    });

    // TODO:
    it.skip("ModifyEntry correctly applies access control for a(n) Entry", async () => {

    });

    // TODO:
    it.skip("ModifyEntry correctly applies access control for a(n) addAttribute Attribute", async () => {

    });

    // TODO:
    it.skip("ModifyEntry correctly applies access control for a(n) addAttribute Value", async () => {

    });

    // TODO:
    it.skip("ModifyEntry correctly applies access control for a(n) addValues Attribute", async () => {

    });

    // TODO:
    it.skip("ModifyEntry correctly applies access control for a(n) addValues Value", async () => {

    });

    // TODO:
    it.skip("ModifyEntry correctly applies access control for a(n) removeAttribute Attribute", async () => {

    });

    // TODO:
    it.skip("ModifyEntry correctly applies access control for a(n) removeAttribute Value", async () => {

    });

    // TODO:
    it.skip("ModifyEntry correctly applies access control for a(n) removeValues Attribute", async () => {

    });

    // TODO:
    it.skip("ModifyEntry correctly applies access control for a(n) removeValues Value", async () => {

    });

    // TODO:
    it.skip("ModifyEntry correctly applies access control for a(n) alterValues Attribute", async () => {

    });

    // TODO:
    it.skip("ModifyEntry correctly applies access control for a(n) alterValues Value", async () => {

    });

    // TODO:
    it.skip("ModifyEntry correctly applies access control for a(n) resetValues Attribute", async () => {

    });

    // TODO:
    it.skip("ModifyEntry correctly applies access control for a(n) resetValues Value", async () => {

    });

    // TODO:
    it.skip("ModifyEntry correctly applies access control for a(n) replaceValues Attribute that is removed", async () => {

    });

    // TODO:
    it.skip("ModifyEntry correctly applies access control for a(n) replaceValues Value that is removed", async () => {

    });

    // TODO:
    it.skip("ModifyEntry correctly applies access control for a(n) replaceValues Attribute that is removed", async () => {

    });

    // TODO:
    it.skip("ModifyEntry correctly applies access control for a(n) replaceValues Value that is removed", async () => {

    });

    // TODO:
    it.skip("ModifyDN correctly applies access control for a(n) Rename", async () => {

    });

    // TODO:
    it.skip("ModifyDN correctly applies access control for a(n) Export", async () => {

    });

    // TODO:
    it.skip("ModifyDN correctly applies access control for a(n) Import", async () => {

    });

    // TODO:
    it.skip("Find DSE correctly applies access control for a(n) Find DSE", async () => {

    });

    // TODO:
    it.skip("Subordinate access control specific administrative points override a superior access control specific administrative point", async () => {

    });

});
