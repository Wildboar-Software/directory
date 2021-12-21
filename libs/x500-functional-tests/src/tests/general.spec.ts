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
    DistinguishedName, _encode_DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import { AttributeTypeAndValue } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
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
    id_ar_subschemaAdminSpecificArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-subschemaAdminSpecificArea.va";
import * as crypto from "crypto";
import type { ResultOrError } from "@wildboar/x500/src/lib/types/ResultOrError";
import {
    ServiceControlOptions,
    ServiceControlOptions_preferChaining,
    ServiceControlOptions_chainingProhibited,
    ServiceControlOptions_localScope,
    ServiceControlOptions_dontUseCopy,
    ServiceControlOptions_dontDereferenceAliases,
    ServiceControlOptions_subentries,
    ServiceControlOptions_copyShallDo,
    ServiceControlOptions_partialNameResolution,
    ServiceControlOptions_manageDSAIT,
    ServiceControlOptions_noSubtypeMatch,
    ServiceControlOptions_noSubtypeSelection,
    ServiceControlOptions_countFamily,
    ServiceControlOptions_dontSelectFriends,
    ServiceControlOptions_dontMatchFriends,
    ServiceControlOptions_allowWriteableCopy,
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
    ReadResult,
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
    CompareResult,
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
    ListResult,
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
    RemoveEntryResult,
    _decode_RemoveEntryResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/RemoveEntryResult.ta";
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
    ModifyEntryResult,
    _decode_ModifyEntryResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyEntryResult.ta";
import {
    ModifyEntryResultData,
    _decode_ModifyEntryResultData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyEntryResultData.ta";
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
    SearchArgumentData_subset,
    SearchArgumentData_subset_baseObject,
    SearchArgumentData_subset_oneLevel,
    SearchArgumentData_subset_wholeSubtree,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData-subset.ta";
import {
    SearchResult,
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
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/TypeAndContextAssertion.ta";
import {
    TypeAndContextAssertion_contextAssertions,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/TypeAndContextAssertion-contextAssertions.ta";
import {
    localeContext,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/localeContext.oa";
import {
    LocaleContextSyntax,
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
import {
    family_information,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/family-information.oa";
import {
    FamilyReturn,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FamilyReturn.ta";
import {
    FamilyReturn_memberSelect_compoundEntry,
    FamilyReturn_memberSelect_contributingEntriesOnly,
    FamilyReturn_memberSelect_participatingEntriesOnly,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FamilyReturn-memberSelect.ta";
import {
    PagedResultsRequest,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PagedResultsRequest.ta";
import {
    PagedResultsRequest_newRequest,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PagedResultsRequest-newRequest.ta";
import {
    SortKey,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SortKey.ta";
import { aliasedEntryName } from "@wildboar/x500/src/lib/modules/InformationFramework/aliasedEntryName.oa";
import { alias } from "@wildboar/x500/src/lib/modules/InformationFramework/alias.oa";
import { subentry } from "@wildboar/x500/src/lib/modules/InformationFramework/subentry.oa";
import {
    collectiveAttributeSubentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/collectiveAttributeSubentry.oa";
import {
    subschema,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/subschema.oa";
import compareCode from "@wildboar/x500/src/lib/utils/compareCode";
import { nameError } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/nameError.oa";
import { serviceError } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/serviceError.oa";
import { securityError } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/securityError.oa";
import { updateError } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/updateError.oa";
import { attributeError } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/attributeError.oa";
import {
    NameProblem_aliasDereferencingProblem,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameProblem.ta";
import {
    SubtreeSpecification,
    _encode_SubtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/SubtreeSpecification.ta";
import {
    subtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/subtreeSpecification.oa";
import {
    nameForms,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/nameForms.oa";
import {
    NameFormDescription,
    _encode_NameFormDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/NameFormDescription.ta";
import {
    NameFormInformation,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/NameFormInformation.ta";
import { friends } from "@wildboar/x500/src/lib/modules/SchemaAdministration/friends.oa";
import {
    FriendsDescription,
    _encode_FriendsDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/FriendsDescription.ta";

jest.setTimeout(10000);

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

describe("Meerkat DSA", () => { // TODO: Bookmark

    let connection: IDMConnection | undefined;

    beforeEach(async () => {
        if (!connection) {
            connection = await connect();
        }
    });

    it("Server comes online", async () => {
        expect(connection).toBeTruthy();
    });

    it.todo("Server shuts down gracefully");
    it.todo("Server checks for updates successfully");
    it.todo("Server hibernates when the sentinel indicates a security issues");

    it("alias dereferencing works", async () => {
        const testId = `alias-deref-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const subordinateWithSubordinates: string = "1ED2AD20-A11F-42EC-81CB-4D6843CA6ACD";
        const aliasedDN: DistinguishedName = [ ...dn, createTestRDN(subordinateWithSubordinates) ];
        const subordinates = [
            subordinateWithSubordinates,
        ];
        // It's stupid to use this in the RDN, but alias is a _structural_ object class.
        const aliasRDN: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                objectClass["&id"],
                oid(alias["&id"]),
            ),
        ];
        const subordinates2 = [
            "0113FF8E-0107-4468-AE19-415DEEB0C5B7",
            "F601D2D2-9B45-4068-9A4F-55FF18E3215D",
            "201A2FE2-6D48-4E2B-A925-5275F2D56F39",
        ];
        await Promise.all(subordinates.map((id) => createTestNode(connection!, dn, id)));
        await Promise.all(subordinates2.map((id) => createTestNode(connection!, aliasedDN, id)));
        // This should be done after the aliased entry is created so you do not
        // get warnings about the aliased entry not existing.
        await createEntry( // Creates an alias that points to `subordinateWithSubordinates`.
            connection!,
            dn,
            aliasRDN,
            [
                new Attribute(
                    objectClass["&id"],
                    [oid(alias["&id"])],
                    undefined,
                ),
                new Attribute(
                    aliasedEntryName["&id"],
                    [ _encode_DistinguishedName(aliasedDN, DER) ],
                    undefined,
                ),
            ],
        );
        const reqData: ReadArgumentData = new ReadArgumentData(
            {
                rdnSequence: [ ...dn, aliasRDN, createTestRDN("F601D2D2-9B45-4068-9A4F-55FF18E3215D") ],
            },
        );
        const arg: ReadArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            read["&operationCode"]!,
            _encode_ReadArgument(arg, DER),
        );
        assert("result" in result);
        assert(result.result);
        const param = _decode_ReadResult(result.result);
        const data = getOptionallyProtectedValue(param);
        expect(data.aliasDereferenced).toBe(TRUE);
        expect(data.entry.name.rdnSequence).toHaveLength(3);
        expect(data.entry.name.rdnSequence[2]).toHaveLength(1);
        expect(data.entry.name.rdnSequence[2][0].value.utf8String).toBe("F601D2D2-9B45-4068-9A4F-55FF18E3215D");
    });

    it("Read", async () => {
        const testId = `Read-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const reqData: ReadArgumentData = new ReadArgumentData(
            {
                rdnSequence: dn,
            },
            undefined,
            undefined,
        );
        const arg: ReadArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            read["&operationCode"]!,
            _encode_ReadArgument(arg, DER),
        );
        if ("result" in result && result.result) {
            const decoded = _decode_ReadResult(result.result);
            const resData = getOptionallyProtectedValue(decoded);
            const cn: EntryInformation_information_Item | undefined = resData.entry.information
                ?.find((einfo) => ("attribute" in einfo) && einfo.attribute.type_.isEqualTo(commonName["&id"]));
            if (cn && "attribute" in cn) {
                expect(cn.attribute.values[0]?.utf8String).toBe(testId);
            } else {
                expect(false).toBeTruthy();
            }
        } else {
            expect(false).toBeTruthy();
        }
    });

    it("Compare", async () => {
        const testId = `Compare-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const encodedCN = _encode_UnboundedDirectoryString({
            uTF8String: testId,
        }, DER);
        const dn = createTestRootDN(testId);
        const do_compare = async (purported: AttributeValueAssertion) => {
            const reqData: CompareArgumentData = new CompareArgumentData(
                {
                    rdnSequence: dn,
                },
                purported,
            );
            const arg: CompareArgument = {
                unsigned: reqData,
            };
            return writeOperation(
                connection!,
                compare["&operationCode"]!,
                _encode_CompareArgument(arg, DER),
            );
        };
        {
            const shouldBeTrue: AttributeValueAssertion = new AttributeValueAssertion(
                commonName["&id"],
                encodedCN,
                undefined,
                undefined,
            );
            const result = await do_compare(shouldBeTrue);
            if ("result" in result && result.result) {
                const decoded = _decode_CompareResult(result.result);
                const resData = getOptionallyProtectedValue(decoded);
                expect(resData.matched).toBe(true);
            } else {
                expect(false).toBeTruthy();
            }
        }
        {
            const wrongCN = _encode_UnboundedDirectoryString({
                uTF8String: "DEFINITElY wroNG",
            }, DER);
            const shouldBeFalse: AttributeValueAssertion = new AttributeValueAssertion(
                commonName["&id"],
                wrongCN,
                undefined,
                undefined,
            );
            const result = await do_compare(shouldBeFalse);
            if ("result" in result && result.result) {
                const decoded = _decode_CompareResult(result.result);
                const resData = getOptionallyProtectedValue(decoded);
                expect(resData.matched).toBe(false);
            } else {
                expect(false).toBeTruthy();
            }
        }
    });

    it.skip("Abandon", async () => {

    });

    it("List", async () => {
        const testId = `List-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        await Promise.all([
            "E338ECE9-0100-4499-BEEE-2F3F766B669C",
            "837DF269-2A2A-47E6-BA19-3FC65D5D3FA7",
            "6AF6F47F-8432-4CBE-9F2F-7C8C56D4F70A",
        ].map((id) => createTestNode(connection!, dn, id)));
        const reqData: ListArgumentData = new ListArgumentData(
            {
                rdnSequence: dn,
            },
            undefined,
            undefined,
        );
        const arg: ListArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            list["&operationCode"]!,
            _encode_ListArgument(arg, DER),
        );
        if ("result" in result && result.result) {
            const decoded = _decode_ListResult(result.result);
            const resData = getOptionallyProtectedValue(decoded);
            if ("listInfo" in resData) {
                expect(resData.listInfo.subordinates.length).toBe(3);
            } else {
                expect(false).toBeFalsy();
            }
        } else {
            expect(false).toBeTruthy();
        }
    });

    it("Search", async () => {
        const testId = `Search-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const excludedResultId: string = "8DFCA253-EAE2-4C2D-AC6D-455340BF759E";
        const subordinates = [
            "E338ECE9-0100-4499-BEEE-2F3F766B669C",
            "837DF269-2A2A-47E6-BA19-3FC65D5D3FA7",
            "6AF6F47F-8432-4CBE-9F2F-7C8C56D4F70A",
            excludedResultId,
        ];
        await Promise.all(subordinates.map((id) => createTestNode(connection!, dn, id)));
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_wholeSubtree,
            { // Filter out one result.
                not: {
                    item: {
                        equality: new AttributeValueAssertion(
                            commonName["&id"],
                            utf8(excludedResultId),
                            undefined,
                        ),
                    },
                },
            },
            true,
            undefined,
            undefined,
            undefined,
            undefined,
            false,
        );
        const arg: SearchArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            search["&operationCode"]!,
            _encode_SearchArgument(arg, DER),
        );
        if ("result" in result && result.result) {
            const decoded = _decode_SearchResult(result.result);
            const resData = getOptionallyProtectedValue(decoded);
            if ("searchInfo" in resData) {
                /**
                 * You might think this search is supposed to return three
                 * results, but don't forget: you are using subtree scope, so
                 * the baseObject will be returned as a result too!
                 */
                expect(resData.searchInfo.entries.length).toBe((subordinates.length - 1) + 1); // For clarity.
            } else {
                expect(false).toBeFalsy();
            }
        } else {
            expect(false).toBeTruthy();
        }
    });

    // This test is unnecessary, because almost every test creates an entry for test data.
    it.skip("AddEntry", async () => {
        const testId = `AddEntry-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
    });

    it("RemoveEntry", async () => {
        const testId = `RemoveEntry-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const toBeDeletedId: string = "D0EFCFD1-E4B9-4C42-8B10-197B0BB3CA9B";
        await createTestNode(connection!, dn, toBeDeletedId);
        const toBeDeletedValue = _encode_UnboundedDirectoryString({
            uTF8String: toBeDeletedId,
        }, DER);
        const reqData: RemoveEntryArgumentData = new RemoveEntryArgumentData(
            {
                rdnSequence: [
                    ...dn,
                    [
                        new AttributeTypeAndValue(
                            commonName["&id"],
                            toBeDeletedValue,
                        ),
                    ],
                ],
            },
        );
        const arg: RemoveEntryArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            removeEntry["&operationCode"]!,
            _encode_RemoveEntryArgument(arg, DER),
        );
        expect(("result" in result) && result.result).toBeTruthy();
    });

    it("ModifyEntry", async () => {
        const testId = `ModifyEntry-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const desc = _encode_UnboundedDirectoryString({
            uTF8String: "Entry successfully modified",
        }, DER);
        const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
            {
                rdnSequence: dn,
            },
            [
                {
                    addValues: new Attribute(
                        description["&id"],
                        [desc],
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
        const result = await writeOperation(
            connection!,
            modifyEntry["&operationCode"]!,
            _encode_ModifyEntryArgument(arg, DER),
        );
        expect(("result" in result) && result.result).toBeTruthy();
    });

    it("ModifyDN", async () => {
        const testId = `ModifyDN-${(new Date()).toISOString()}`;
        const newdesc = utf8(`${testId}-moved`);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    description["&id"],
                    [newdesc],
                    undefined,
                ),
            ]);
        }
        const dn = createTestRootDN(testId);
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
        const result = await writeOperation(
            connection!,
            modifyDN["&operationCode"]!,
            _encode_ModifyDNArgument(arg, DER),
        );
        expect(("result" in result) && result.result).toBeTruthy();
    });

    it("AdministerPassword", async () => {
        const testId = `AdministerPassword-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const reqData: AdministerPasswordArgumentData = new AdministerPasswordArgumentData(
            dn,
            {
                clear: "asdf",
            },
        );
        const arg: AdministerPasswordArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            administerPassword["&operationCode"]!,
            _encode_AdministerPasswordArgument(arg, DER),
        );
        expect(("result" in result) && result.result).toBeTruthy();
    });

    it("ChangePassword", async () => {
        const testId = `ChangePassword-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        const INITIAL_PASSWORD: string = "asdf";
        const FINAL_PASSWORD: string = "zxcv";
        { // Setup: create an initial password
            await createTestRootNode(connection!, testId);
            const reqData: AdministerPasswordArgumentData = new AdministerPasswordArgumentData(
                dn,
                {
                    clear: INITIAL_PASSWORD,
                },
            );
            const arg: AdministerPasswordArgument = {
                unsigned: reqData,
            };
            const result = await writeOperation(
                connection!,
                administerPassword["&operationCode"]!,
                _encode_AdministerPasswordArgument(arg, DER),
            );
            expect(("result" in result) && result.result).toBeTruthy();
        }
        const reqData: ChangePasswordArgumentData = new ChangePasswordArgumentData(
            dn,
            {
                clear: INITIAL_PASSWORD,
            },
            {
                clear: FINAL_PASSWORD,
            },
        );
        const arg: ChangePasswordArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            changePassword["&operationCode"]!,
            _encode_ChangePasswordArgument(arg, DER),
        );
        expect(("result" in result) && result.result).toBeTruthy();
    });

    it.skip("Read.modifyRightsRequest", async () => {

    });

    it("Read.selection", async () => {
        const testId = `Read.selection-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const selection = new EntryInformationSelection(
            {
                select: [
                    description["&id"],
                ],
            },
            undefined,
            {
                select: [
                    createTimestamp["&id"],
                ],
            },
            undefined,
            undefined,
            undefined,
        );
        const reqData: ReadArgumentData = new ReadArgumentData(
            {
                rdnSequence: dn,
            },
            selection,
            undefined,
        );
        const arg: ReadArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            read["&operationCode"]!,
            _encode_ReadArgument(arg, DER),
        );
        if ("result" in result && result.result) {
            const decoded = _decode_ReadResult(result.result);
            const resData = getOptionallyProtectedValue(decoded);
            const cn: EntryInformation_information_Item | undefined = resData.entry.information
                ?.find((einfo) => ("attribute" in einfo) && einfo.attribute.type_.isEqualTo(commonName["&id"]));
            const d: EntryInformation_information_Item | undefined = resData.entry.information
                ?.find((einfo) => ("attribute" in einfo) && einfo.attribute.type_.isEqualTo(description["&id"]));
            const cts: EntryInformation_information_Item | undefined = resData.entry.information
                ?.find((einfo) => ("attribute" in einfo) && einfo.attribute.type_.isEqualTo(createTimestamp["&id"]));
            expect(cn).toBeUndefined();
            expect(d).toBeDefined();
            expect(cts).toBeDefined();
            expect(resData.entry.information).toHaveLength(2);
        } else {
            expect(false).toBeTruthy();
        }
    });

    it("Read.selection.infoTypes", async () => {
        const testId = `Read.selection.infoTypes-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const selection = new EntryInformationSelection(
            {
                select: [
                    commonName["&id"],
                ],
            },
            typesOnly,
            undefined,
            undefined,
            undefined,
            undefined,
        );
        const reqData: ReadArgumentData = new ReadArgumentData(
            {
                rdnSequence: dn,
            },
            selection,
            undefined,
        );
        const arg: ReadArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            read["&operationCode"]!,
            _encode_ReadArgument(arg, DER),
        );
        if ("result" in result && result.result) {
            const decoded = _decode_ReadResult(result.result);
            const resData = getOptionallyProtectedValue(decoded);
            expect(resData.entry.information?.length).toBe(1);
            const cn: EntryInformation_information_Item | undefined = resData.entry.information
                ?.find((einfo) => ("attributeType" in einfo) && einfo.attributeType.isEqualTo(commonName["&id"]));
            expect(cn).toBeDefined();
        } else {
            expect(false).toBeTruthy();
        }
    });

    it("Read.selection.contextSelection.selectedContexts.all", async () => {
        const testId = `Read.selection.contextSelection.selectedContexts.all-${(new Date()).toISOString()}`;
        const firstLocale: ASN1Element = _encode_LocaleContextSyntax({
            localeID1: new ObjectIdentifier([1, 2, 3, 4, 5]),
        }, DER);
        const secondLocale: ASN1Element = _encode_LocaleContextSyntax({
            localeID1: new ObjectIdentifier([1, 2, 3, 4, 6]),
        }, DER);
        const thirdLocale: ASN1Element = _encode_LocaleContextSyntax({
            localeID1: new ObjectIdentifier([1, 2, 3, 4, 7]),
        }, DER);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    commonName["&id"],
                    [],
                    [
                        new Attribute_valuesWithContext_Item(
                            utf8("der entry"),
                            [
                                new Context(
                                    localeContext["&id"],
                                    [secondLocale],
                                    undefined,
                                ),
                            ],
                        ),
                        new Attribute_valuesWithContext_Item(
                            utf8("el entry"),
                            [
                                new Context(
                                    localeContext["&id"],
                                    [firstLocale, thirdLocale],
                                    undefined,
                                ),
                            ],
                        ),
                    ],
                ),
            ]);
        }
        const dn = createTestRootDN(testId);
        const selection = new EntryInformationSelection(
            undefined,
            undefined,
            undefined,
            {
                selectedContexts: [
                    new TypeAndContextAssertion(
                        commonName["&id"],
                        {
                            all: [
                                new ContextAssertion(
                                    localeContext["&id"],
                                    [firstLocale],
                                ),
                                new ContextAssertion(
                                    localeContext["&id"],
                                    [thirdLocale],
                                ),
                            ],
                        },
                    ),
                ],
            },
            true,
            undefined,
        );
        const reqData: ReadArgumentData = new ReadArgumentData(
            {
                rdnSequence: dn,
            },
            selection,
            undefined,
        );
        const arg: ReadArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            read["&operationCode"]!,
            _encode_ReadArgument(arg, DER),
        );
        if ("result" in result && result.result) {
            const decoded = _decode_ReadResult(result.result);
            const resData = getOptionallyProtectedValue(decoded);
            const cn: EntryInformation_information_Item[] = resData.entry.information
                ?.filter((einfo) => ("attribute" in einfo) && einfo.attribute.type_.isEqualTo(commonName["&id"])) ?? [];
            expect(cn).toHaveLength(1);
            assert("attribute" in cn[0]);
            const valuesWithContext = cn[0].attribute.valuesWithContext ?? [];
            expect(valuesWithContext).toHaveLength(1);
            const chosenValue = valuesWithContext[0].value.utf8String;
            expect(chosenValue).toBe("el entry");
            expect(valuesWithContext[0].contextList).toHaveLength(1);
            expect(valuesWithContext[0].contextList[0].contextType.isEqualTo(localeContext["&id"])).toBeTruthy();
            expect(valuesWithContext[0].contextList[0].contextValues).toHaveLength(2);
            const chosenLocale1 = valuesWithContext[0].contextList[0].contextValues[0].objectIdentifier;
            expect(chosenLocale1.isEqualTo(new ObjectIdentifier([1, 2, 3, 4, 5]))).toBeTruthy();
            const chosenLocale2 = valuesWithContext[0].contextList[0].contextValues[1].objectIdentifier;
            expect(chosenLocale2.isEqualTo(new ObjectIdentifier([1, 2, 3, 4, 7]))).toBeTruthy();
        } else {
            expect(false).toBeTruthy();
        }
    });

    it("Read.selection.contextSelection.selectedContexts.preference", async () => {
        const testId = `Read.selection.contextSelection.selectedContexts.preference-${(new Date()).toISOString()}`;
        const firstPreferredLocale: ASN1Element = _encode_LocaleContextSyntax({
            localeID1: new ObjectIdentifier([1, 2, 3, 4, 5]),
        }, DER);
        const secondPreferredLocale: ASN1Element = _encode_LocaleContextSyntax({
            localeID1: new ObjectIdentifier([1, 2, 3, 4, 6]),
        }, DER);
        const thirdPreferredLocale: ASN1Element = _encode_LocaleContextSyntax({
            localeID1: new ObjectIdentifier([1, 2, 3, 4, 7]),
        }, DER);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    commonName["&id"],
                    [],
                    [
                        new Attribute_valuesWithContext_Item(
                            utf8("der entry"),
                            [
                                new Context(
                                    localeContext["&id"],
                                    [secondPreferredLocale],
                                    undefined,
                                ),
                            ],
                        ),
                        new Attribute_valuesWithContext_Item(
                            utf8("el entry"),
                            [
                                new Context(
                                    localeContext["&id"],
                                    [thirdPreferredLocale],
                                    undefined,
                                ),
                            ],
                        ),
                    ],
                ),
            ]);
        }
        const dn = createTestRootDN(testId);
        const selection = new EntryInformationSelection(
            undefined,
            undefined,
            undefined,
            {
                selectedContexts: [
                    new TypeAndContextAssertion(
                        commonName["&id"],
                        {
                            preference: [
                                new ContextAssertion(
                                    localeContext["&id"],
                                    [
                                        firstPreferredLocale,
                                    ],
                                ),
                                new ContextAssertion(
                                    localeContext["&id"],
                                    [
                                        secondPreferredLocale, // This should be the one that sticks.
                                    ],
                                ),
                                new ContextAssertion(
                                    localeContext["&id"],
                                    [
                                        thirdPreferredLocale,
                                    ],
                                ),
                            ],
                        },
                    ),
                ],
            },
            true,
            undefined,
        );
        const reqData: ReadArgumentData = new ReadArgumentData(
            {
                rdnSequence: dn,
            },
            selection,
            undefined,
        );
        const arg: ReadArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            read["&operationCode"]!,
            _encode_ReadArgument(arg, DER),
        );
        if ("result" in result && result.result) {
            const decoded = _decode_ReadResult(result.result);
            const resData = getOptionallyProtectedValue(decoded);
            const cn: EntryInformation_information_Item[] = resData.entry.information
                ?.filter((einfo) => ("attribute" in einfo) && einfo.attribute.type_.isEqualTo(commonName["&id"])) ?? [];
            expect(cn).toHaveLength(1);
            assert("attribute" in cn[0]);
            const valuesWithContext = cn[0].attribute.valuesWithContext ?? [];
            expect(valuesWithContext).toHaveLength(1);
            const chosenValue = valuesWithContext[0].value.utf8String;
            expect(chosenValue).toBe("der entry");
            expect(valuesWithContext[0].contextList).toHaveLength(1);
            expect(valuesWithContext[0].contextList[0].contextType.isEqualTo(localeContext["&id"])).toBeTruthy();
            expect(valuesWithContext[0].contextList[0].contextValues).toHaveLength(1);
            const chosenLocale = valuesWithContext[0].contextList[0].contextValues[0].objectIdentifier;
            expect(chosenLocale.isEqualTo(new ObjectIdentifier([1, 2, 3, 4, 6]))).toBeTruthy();
        } else {
            expect(false).toBeTruthy();
        }
    });

    it("Read.selection.returnContexts", async () => {
        const testId = `Read.selection.returnContexts-${(new Date()).toISOString()}`;
        const locale: ASN1Element = _encode_LocaleContextSyntax({
            localeID1: new ObjectIdentifier([1, 2, 3, 4, 5]),
        }, DER);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    localityName["&id"],
                    [],
                    [
                        new Attribute_valuesWithContext_Item(
                            utf8("el entry"),
                            [
                                new Context(
                                    localeContext["&id"],
                                    [locale],
                                    undefined,
                                ),
                            ],
                        ),
                    ],
                ),
            ]);
        }
        const dn = createTestRootDN(testId);
        const readEntry = (includeContexts: boolean) => {
            const selection = new EntryInformationSelection(
                undefined,
                undefined,
                undefined,
                undefined,
                includeContexts,
                undefined,
            );
            const reqData: ReadArgumentData = new ReadArgumentData(
                {
                    rdnSequence: dn,
                },
                selection,
                undefined,
            );
            const arg: ReadArgument = {
                unsigned: reqData,
            };
            return writeOperation(
                connection!,
                read["&operationCode"]!,
                _encode_ReadArgument(arg, DER),
            );
        };
        const resultWithContexts = await readEntry(true);
        assert("result" in resultWithContexts);
        assert(resultWithContexts.result);
        { // With contexts
            const decoded = _decode_ReadResult(resultWithContexts.result);
            const resData = getOptionallyProtectedValue(decoded);
            const loc: EntryInformation_information_Item[] = resData.entry.information
                ?.filter((einfo) => ("attribute" in einfo) && einfo.attribute.type_.isEqualTo(localityName["&id"])) ?? [];
            expect(loc).toHaveLength(1);
            assert("attribute" in loc[0]);
            const valuesWithContext = loc[0].attribute.valuesWithContext ?? [];
            expect(valuesWithContext).toHaveLength(1);
            const chosenValue = valuesWithContext[0].value.utf8String;
            expect(chosenValue).toBe("el entry");
            expect(valuesWithContext[0].contextList).toHaveLength(1);
            expect(valuesWithContext[0].contextList[0].contextType.isEqualTo(localeContext["&id"])).toBeTruthy();
            expect(valuesWithContext[0].contextList[0].contextValues).toHaveLength(1);
        }
        const resultWithoutContexts = await readEntry(false);
        assert("result" in resultWithoutContexts);
        assert(resultWithoutContexts.result);
        { // Without contexts
            const decoded = _decode_ReadResult(resultWithoutContexts.result);
            const resData = getOptionallyProtectedValue(decoded);
            const loc: EntryInformation_information_Item[] = resData.entry.information
                ?.filter((einfo) => ("attribute" in einfo) && einfo.attribute.type_.isEqualTo(localityName["&id"])) ?? [];
            expect(loc).toHaveLength(1);
            assert("attribute" in loc[0]);
            const values = loc[0].attribute.values;
            const valuesWithContext = loc[0].attribute.valuesWithContext ?? [];
            expect(values).toHaveLength(1);
            expect(valuesWithContext).toHaveLength(0);
            const chosenValue = values[0].utf8String;
            expect(chosenValue).toBe("el entry");
        }
    });

    it("Read.selection.familyReturn.memberSelect.contributingEntriesOnly", async () => {
        const testId = `Read...contributingEntriesOnly-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId);
            await createCompoundEntry(connection!, dn);
        }
        const selection = new EntryInformationSelection(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            new FamilyReturn(
                FamilyReturn_memberSelect_contributingEntriesOnly,
                undefined,
            ),
        );
        const reqData: ReadArgumentData = new ReadArgumentData(
            {
                rdnSequence: [...dn, parentRDN],
            },
            selection,
            undefined,
        );
        const arg: ReadArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            read["&operationCode"]!,
            _encode_ReadArgument(arg, DER),
        );
        assert("result" in result);
        assert(result.result);
        const decoded = _decode_ReadResult(result.result);
        const resData = getOptionallyProtectedValue(decoded);
        const familyAttribute: EntryInformation_information_Item | undefined = resData.entry.information
            ?.find((einfo) => ("attribute" in einfo) && einfo.attribute.type_.isEqualTo(family_information["&id"]));
        expect(familyAttribute).toBeUndefined();
    });

    it("Read.selection.familyReturn.memberSelect.participatingEntriesOnly", async () => {
        const testId = `Read...participatingEntriesOnly-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId);
            await createCompoundEntry(connection!, dn);
        }
        const selection = new EntryInformationSelection(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            new FamilyReturn(
                FamilyReturn_memberSelect_participatingEntriesOnly,
                undefined,
            ),
        );
        const reqData: ReadArgumentData = new ReadArgumentData(
            {
                rdnSequence: [...dn, parentRDN],
            },
            selection,
            undefined,
        );
        const arg: ReadArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            read["&operationCode"]!,
            _encode_ReadArgument(arg, DER),
        );
        assert("result" in result);
        assert(result.result);
        const decoded = _decode_ReadResult(result.result);
        const resData = getOptionallyProtectedValue(decoded);
        const familyAttribute: EntryInformation_information_Item | undefined = resData.entry.information
            ?.find((einfo) => ("attribute" in einfo) && einfo.attribute.type_.isEqualTo(family_information["&id"]));
        expect(familyAttribute).toBeUndefined();
    });

    it("Read.selection.familyReturn.memberSelect.compoundEntry", async () => {
        const testId = `Read...compoundEntry-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId);
            await createCompoundEntry(connection!, dn);
        }
        const selection = new EntryInformationSelection(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            new FamilyReturn(
                FamilyReturn_memberSelect_compoundEntry,
                undefined,
            ),
        );
        const reqData: ReadArgumentData = new ReadArgumentData(
            {
                rdnSequence: [...dn, parentRDN],
            },
            selection,
            undefined,
        );
        const arg: ReadArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            read["&operationCode"]!,
            _encode_ReadArgument(arg, DER),
        );
        assert("result" in result);
        assert(result.result);
        const decoded = _decode_ReadResult(result.result);
        const resData = getOptionallyProtectedValue(decoded);
        const familyAttribute: EntryInformation_information_Item | undefined = resData.entry.information
            ?.find((einfo) => ("attribute" in einfo) && einfo.attribute.type_.isEqualTo(family_information["&id"]));
        expect(familyAttribute).toBeDefined();
        assert(familyAttribute);
        assert("attribute" in familyAttribute);
        assert(familyAttribute.attribute.values[0]);
        const families = familyAttribute.attribute.values.map((f) => family_information.decoderFor["&Type"]!(f));
        const orgs = families.filter((f) => f.family_class.isEqualTo(organizationalUnit["&id"]));
        const people = families.filter((f) => f.family_class.isEqualTo(person["&id"]));
        const devices = families.filter((f) => f.family_class.isEqualTo(device["&id"]));
        expect(orgs).toHaveLength(1);
        expect(people).toHaveLength(1);
        expect(devices).toHaveLength(1);
        expect(orgs[0].familyEntries).toHaveLength(2);
        expect(people[0].familyEntries).toHaveLength(1);
        expect(devices[0].familyEntries).toHaveLength(1);
        expect(people[0].familyEntries[0].rdn[0].value.utf8String).toBe("Chief Pain Officer Jonathan Wilbur");
        expect(devices[0].familyEntries[0].rdn[0].value.utf8String).toBe("Commodore 64 (128 KB memory extension)");
        expect(orgs[0].familyEntries.some((f) => f.family_info?.some((fi) => fi.family_class.isEqualTo(person["&id"]))));
        expect(orgs[0].familyEntries.some((f) => f.family_info?.some((fi) => fi.family_class.isEqualTo(device["&id"]))));
    });

    it("Read.selection.familyReturn.familySelect", async () => {
        const testId = `Read...familySelect-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId);
            await createCompoundEntry(connection!, dn);
        }
        const selection = new EntryInformationSelection(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            new FamilyReturn(
                FamilyReturn_memberSelect_compoundEntry,
                [organizationalUnit["&id"]],
            ),
        );
        const reqData: ReadArgumentData = new ReadArgumentData(
            {
                rdnSequence: [...dn, parentRDN],
            },
            selection,
            undefined,
        );
        const arg: ReadArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            read["&operationCode"]!,
            _encode_ReadArgument(arg, DER),
        );
        assert("result" in result);
        assert(result.result);
        const decoded = _decode_ReadResult(result.result);
        const resData = getOptionallyProtectedValue(decoded);
        const familyAttribute: EntryInformation_information_Item | undefined = resData.entry.information
            ?.find((einfo) => ("attribute" in einfo) && einfo.attribute.type_.isEqualTo(family_information["&id"]));
        expect(familyAttribute).toBeDefined();
        assert(familyAttribute);
        assert("attribute" in familyAttribute);
        assert(familyAttribute.attribute.values[0]);
        const families = familyAttribute.attribute.values.map((f) => family_information.decoderFor["&Type"]!(f));
        const orgs = families.filter((f) => f.family_class.isEqualTo(organizationalUnit["&id"]));
        const people = families.filter((f) => f.family_class.isEqualTo(person["&id"]));
        const devices = families.filter((f) => f.family_class.isEqualTo(device["&id"]));
        expect(orgs).toHaveLength(1);
        expect(people).toHaveLength(0);
        expect(devices).toHaveLength(0);
        expect(orgs[0].familyEntries).toHaveLength(2);
    });

    it("Compare works with attribute subtyping", async () => {
        const testId = `CompareWithAttributeSubtyping-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const encodedCN = _encode_UnboundedDirectoryString({
            uTF8String: testId,
        }, DER);
        const dn = createTestRootDN(testId);
        const do_compare = async (purported: AttributeValueAssertion) => {
            const reqData: CompareArgumentData = new CompareArgumentData(
                {
                    rdnSequence: dn,
                },
                purported,
            );
            const arg: CompareArgument = {
                unsigned: reqData,
            };
            return writeOperation(
                connection!,
                compare["&operationCode"]!,
                _encode_CompareArgument(arg, DER),
            );
        };
        {
            const shouldBeTrue: AttributeValueAssertion = new AttributeValueAssertion(
                name["&id"],
                encodedCN,
                undefined,
                undefined,
            );
            const result = await do_compare(shouldBeTrue);
            if ("result" in result && result.result) {
                const decoded = _decode_CompareResult(result.result);
                const resData = getOptionallyProtectedValue(decoded);
                expect(resData.matched).toBe(true);
            } else {
                expect(false).toBeTruthy();
            }
        }
        {
            const wrongCN = _encode_UnboundedDirectoryString({
                uTF8String: "DEFINITElY wroNG",
            }, DER);
            const shouldBeFalse: AttributeValueAssertion = new AttributeValueAssertion(
                name["&id"],
                wrongCN,
                undefined,
                undefined,
            );
            const result = await do_compare(shouldBeFalse);
            if ("result" in result && result.result) {
                const decoded = _decode_CompareResult(result.result);
                const resData = getOptionallyProtectedValue(decoded);
                expect(resData.matched).toBe(false);
            } else {
                expect(false).toBeTruthy();
            }
        }
    });

    it("Compare disables subtype matching if noSubtypeMatch SCO set", async () => {
        const testId = `CompareWithDisabledAttributeSubtyping-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const encodedCN = _encode_UnboundedDirectoryString({
            uTF8String: testId,
        }, DER);
        const dn = createTestRootDN(testId);
        const serviceControlOptions: ServiceControlOptions = new Uint8ClampedArray(
            Array(15).fill(FALSE_BIT));
        serviceControlOptions[ServiceControlOptions_noSubtypeMatch] = TRUE_BIT;
        const serviceControls = new ServiceControls(
            serviceControlOptions,
            undefined,
            60,
        );
        const do_compare = async (purported: AttributeValueAssertion) => {
            const reqData: CompareArgumentData = new CompareArgumentData(
                {
                    rdnSequence: dn,
                },
                purported,
                [],
                serviceControls,
            );
            const arg: CompareArgument = {
                unsigned: reqData,
            };
            return writeOperation(
                connection!,
                compare["&operationCode"]!,
                _encode_CompareArgument(arg, DER),
            );
        };
        {
            const shouldBeFalse: AttributeValueAssertion = new AttributeValueAssertion(
                name["&id"],
                encodedCN,
                undefined,
                undefined,
            );
            const result = await do_compare(shouldBeFalse);
            if ("result" in result && result.result) {
                const decoded = _decode_CompareResult(result.result);
                const resData = getOptionallyProtectedValue(decoded);
                expect(resData.matched).toBe(FALSE);
            } else {
                expect(false).toBeTruthy();
            }
        }
    });

    it.skip("List.listFamily", async () => {
        const testId = `List.listFamily-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        await Promise.all([
            "E338ECE9-0100-4499-BEEE-2F3F766B669C",
            "837DF269-2A2A-47E6-BA19-3FC65D5D3FA7",
            "6AF6F47F-8432-4CBE-9F2F-7C8C56D4F70A",
        ].map((id) => createTestNode(connection!, dn, id)));
        const reqData: ListArgumentData = new ListArgumentData(
            {
                rdnSequence: dn,
            },
            undefined,
            undefined,
        );
        const arg: ListArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            list["&operationCode"]!,
            _encode_ListArgument(arg, DER),
        );
        if ("result" in result && result.result) {
            const decoded = _decode_ListResult(result.result);
            const resData = getOptionallyProtectedValue(decoded);
            if ("listInfo" in resData) {
                expect(resData.listInfo.subordinates.length).toBe(3);
            } else {
                expect(false).toBeFalsy();
            }
        } else {
            expect(false).toBeTruthy();
        }
    });

    it("List pagination works", async () => {
        const testId = `List.pagination-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const pageSize: number = 5;
        const subordinates: string[] = Array(pageSize * 4).fill("").map(() => crypto.randomUUID());
        await Promise.all(subordinates.map((id) => createTestNode(connection!, dn, id)));
        const encountered: Set<string> = new Set();
        const nextPage = async (prr: PagedResultsRequest) => {
            const reqData: ListArgumentData = new ListArgumentData(
                {
                    rdnSequence: dn,
                },
                prr,
                undefined,
            );
            const arg: ListArgument = {
                unsigned: reqData,
            };
            const result = await writeOperation(
                connection!,
                list["&operationCode"]!,
                _encode_ListArgument(arg, DER),
            );
            assert("result" in result);
            assert(result.result);
            const decoded = _decode_ListResult(result.result);
            const resData = getOptionallyProtectedValue(decoded);
            assert("listInfo" in resData);
            expect(resData.listInfo.subordinates).toHaveLength(pageSize);
            for (const sub of resData.listInfo.subordinates) {
                const foundId: string = sub.rdn[0].value.utf8String;
                expect(encountered.has(foundId)).toBeFalsy();
                encountered.add(foundId);
            }
            return resData.listInfo.partialOutcomeQualifier?.queryReference;
        };
        const qr1 = await nextPage({
            newRequest: new PagedResultsRequest_newRequest(
                pageSize,
            ),
        });
        assert(qr1);
        const qr2 = await nextPage({
            queryReference: qr1,
        });
        assert(qr2);
        const qr3 = await nextPage({
            queryReference: qr2,
        });
        assert(qr3);
        const qr4 = await nextPage({
            queryReference: qr3,
        });
        expect(qr4).toBeUndefined();
        expect(encountered.size).toBe(pageSize * 4);
    });

    it("List pagination sorting works", async () => {
        const testId = `List.pagination.sorting-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const pageSize: number = 5;
        const subordinates: string[] = Array(pageSize * 4).fill("").map(() => crypto.randomUUID());
        await Promise.all(subordinates.map((id) => createTestNode(connection!, dn, id)));
        const encountered: Set<string> = new Set();
        let lastResult: string | undefined;
        const nextPage = async (prr: PagedResultsRequest) => {
            const reqData: ListArgumentData = new ListArgumentData(
                {
                    rdnSequence: dn,
                },
                prr,
                undefined,
            );
            const arg: ListArgument = {
                unsigned: reqData,
            };
            const result = await writeOperation(
                connection!,
                list["&operationCode"]!,
                _encode_ListArgument(arg, DER),
            );
            assert("result" in result);
            assert(result.result);
            const decoded = _decode_ListResult(result.result);
            const resData = getOptionallyProtectedValue(decoded);
            assert("listInfo" in resData);
            expect(resData.listInfo.subordinates).toHaveLength(pageSize);
            for (const sub of resData.listInfo.subordinates) {
                const foundId: string = sub.rdn[0].value.utf8String;
                expect(encountered.has(foundId)).toBeFalsy();
                encountered.add(foundId);
                if (lastResult) {
                    expect([ lastResult, foundId ].sort()).toEqual([ lastResult, foundId ]);
                }
                lastResult = foundId;
            }
            return resData.listInfo.partialOutcomeQualifier?.queryReference;
        };
        const qr1 = await nextPage({
            newRequest: new PagedResultsRequest_newRequest(
                pageSize,
                [
                    new SortKey(
                        commonName["&id"],
                    ),
                ],
            ),
        });
        assert(qr1);
        const qr2 = await nextPage({
            queryReference: qr1,
        });
        assert(qr2);
        const qr3 = await nextPage({
            queryReference: qr2,
        });
        assert(qr3);
        const qr4 = await nextPage({
            queryReference: qr3,
        });
        expect(qr4).toBeUndefined();
    });

    it("List pagination reverse works", async () => {
        const testId = `List.pagination.reverse-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const pageSize: number = 5;
        const subordinates: string[] = Array(pageSize * 4).fill("").map(() => crypto.randomUUID());
        await Promise.all(subordinates.map((id) => createTestNode(connection!, dn, id)));
        const encountered: Set<string> = new Set();
        let lastResult: string | undefined;
        const nextPage = async (prr: PagedResultsRequest) => {
            const reqData: ListArgumentData = new ListArgumentData(
                {
                    rdnSequence: dn,
                },
                prr,
                undefined,
            );
            const arg: ListArgument = {
                unsigned: reqData,
            };
            const result = await writeOperation(
                connection!,
                list["&operationCode"]!,
                _encode_ListArgument(arg, DER),
            );
            assert("result" in result);
            assert(result.result);
            const decoded = _decode_ListResult(result.result);
            const resData = getOptionallyProtectedValue(decoded);
            assert("listInfo" in resData);
            expect(resData.listInfo.subordinates).toHaveLength(pageSize);
            for (const sub of resData.listInfo.subordinates) {
                const foundId: string = sub.rdn[0].value.utf8String;
                expect(encountered.has(foundId)).toBeFalsy();
                encountered.add(foundId);
                if (lastResult) {
                    expect([ lastResult, foundId ].sort()).toEqual([ foundId, lastResult ]);
                }
                lastResult = foundId;
            }
            return resData.listInfo.partialOutcomeQualifier?.queryReference;
        };
        const qr1 = await nextPage({
            newRequest: new PagedResultsRequest_newRequest(
                pageSize,
                [
                    new SortKey(
                        commonName["&id"],
                    ),
                ],
                TRUE,
            ),
        });
        assert(qr1);
        const qr2 = await nextPage({
            queryReference: qr1,
        });
        assert(qr2);
        const qr3 = await nextPage({
            queryReference: qr2,
        });
        assert(qr3);
        const qr4 = await nextPage({
            queryReference: qr3,
        });
        expect(qr4).toBeUndefined();
    });

    it("List pagination pageNumber works", async () => {
        const testId = `List.pageNumber-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const pageSize: number = 5;
        const subordinates: string[] = Array(pageSize * 4).fill("").map(() => crypto.randomUUID());
        await Promise.all(subordinates.map((id) => createTestNode(connection!, dn, id)));
        const encountered: Set<string> = new Set();
        const nextPage = async (prr: PagedResultsRequest) => {
            const reqData: ListArgumentData = new ListArgumentData(
                {
                    rdnSequence: dn,
                },
                prr,
                undefined,
            );
            const arg: ListArgument = {
                unsigned: reqData,
            };
            const result = await writeOperation(
                connection!,
                list["&operationCode"]!,
                _encode_ListArgument(arg, DER),
            );
            assert("result" in result);
            assert(result.result);
            const decoded = _decode_ListResult(result.result);
            const resData = getOptionallyProtectedValue(decoded);
            assert("listInfo" in resData);
            expect(resData.listInfo.subordinates).toHaveLength(pageSize);
            for (const sub of resData.listInfo.subordinates) {
                const foundId: string = sub.rdn[0].value.utf8String;
                expect(encountered.has(foundId)).toBeFalsy();
                encountered.add(foundId);
            }
            return resData.listInfo.partialOutcomeQualifier?.queryReference;
        };
        const qr1 = await nextPage({
            newRequest: new PagedResultsRequest_newRequest(
                pageSize,
                undefined,
                undefined,
                undefined,
                3, // Skip three pages
            ),
        });
        expect(qr1).toBeUndefined(); // There should only have been one more page to read.
    });

    test.todo("List pagination unmerged works");

    it("Search.subset.baseObject", async () => {
        const testId = `Search-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const subordinates = [
            "E338ECE9-0100-4499-BEEE-2F3F766B669C",
            "837DF269-2A2A-47E6-BA19-3FC65D5D3FA7",
            "6AF6F47F-8432-4CBE-9F2F-7C8C56D4F70A",
        ];
        await Promise.all(subordinates.map((id) => createTestNode(connection!, dn, id)));
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_baseObject,
        );
        const arg: SearchArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            search["&operationCode"]!,
            _encode_SearchArgument(arg, DER),
        );
        if ("result" in result && result.result) {
            const decoded = _decode_SearchResult(result.result);
            const resData = getOptionallyProtectedValue(decoded);
            if ("searchInfo" in resData) {
                expect(resData.searchInfo.entries.length).toBe(1);
            } else {
                expect(false).toBeFalsy();
            }
        } else {
            expect(false).toBeTruthy();
        }
    });

    it("Search.subset.oneLevel", async () => {
        const testId = `Search-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const subordinateWithSubordinates: string = "1ED2AD20-A11F-42EC-81CB-4D6843CA6ACD";
        const asdf: DistinguishedName = [ ...dn, createTestRDN(subordinateWithSubordinates) ];
        const subordinates = [
            "E338ECE9-0100-4499-BEEE-2F3F766B669C",
            "837DF269-2A2A-47E6-BA19-3FC65D5D3FA7",
            "6AF6F47F-8432-4CBE-9F2F-7C8C56D4F70A",
            subordinateWithSubordinates,
        ];
        const subordinates2 = [
            "0113FF8E-0107-4468-AE19-415DEEB0C5B7",
            "F601D2D2-9B45-4068-9A4F-55FF18E3215D",
            "201A2FE2-6D48-4E2B-A925-5275F2D56F39",
        ];
        await Promise.all(subordinates.map((id) => createTestNode(connection!, dn, id)));
        await Promise.all(subordinates2.map((id) => createTestNode(connection!, asdf, id)));
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_oneLevel,
        );
        const arg: SearchArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            search["&operationCode"]!,
            _encode_SearchArgument(arg, DER),
        );
        if ("result" in result && result.result) {
            const decoded = _decode_SearchResult(result.result);
            const resData = getOptionallyProtectedValue(decoded);
            if ("searchInfo" in resData) {
                /**
                 * You might think this search is supposed to return three
                 * results, but don't forget: you are using subtree scope, so
                 * the baseObject will be returned as a result too!
                 */
                expect(resData.searchInfo.entries.length).toBe((subordinates.length - 1) + 1); // For clarity.
            } else {
                expect(false).toBeFalsy();
            }
        } else {
            expect(false).toBeTruthy();
        }
    });

    it("Search.subset.wholeSubtree", async () => {
        const testId = `Search-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const subordinateWithSubordinates: string = "1ED2AD20-A11F-42EC-81CB-4D6843CA6ACD";
        const asdf: DistinguishedName = [ ...dn, createTestRDN(subordinateWithSubordinates) ];
        const subordinates = [
            "E338ECE9-0100-4499-BEEE-2F3F766B669C",
            "837DF269-2A2A-47E6-BA19-3FC65D5D3FA7",
            "6AF6F47F-8432-4CBE-9F2F-7C8C56D4F70A",
            subordinateWithSubordinates,
        ];
        const subordinates2 = [
            "0113FF8E-0107-4468-AE19-415DEEB0C5B7",
            "F601D2D2-9B45-4068-9A4F-55FF18E3215D",
            "201A2FE2-6D48-4E2B-A925-5275F2D56F39",
        ];
        await Promise.all(subordinates.map((id) => createTestNode(connection!, dn, id)));
        await Promise.all(subordinates2.map((id) => createTestNode(connection!, asdf, id)));
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_wholeSubtree,
        );
        const arg: SearchArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            search["&operationCode"]!,
            _encode_SearchArgument(arg, DER),
        );
        if ("result" in result && result.result) {
            const decoded = _decode_SearchResult(result.result);
            const resData = getOptionallyProtectedValue(decoded);
            if ("searchInfo" in resData) {
                expect(resData.searchInfo.entries.length).toBe(1 + subordinates.length + subordinates2.length);
            } else {
                expect(false).toBeFalsy();
            }
        } else {
            expect(false).toBeTruthy();
        }
    });

    it("Search.filter", async () => {
        const testId = `Search.filter-${(new Date()).toISOString()}`;
        const excludedResultId: string = "8DFCA253-EAE2-4C2D-AC6D-455340BF759E";
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const subordinateWithSubordinates: string = "1ED2AD20-A11F-42EC-81CB-4D6843CA6ACD";
        const asdf: DistinguishedName = [ ...dn, createTestRDN(subordinateWithSubordinates) ];
        const subordinates = [
            "E338ECE9-0100-4499-BEEE-2F3F766B669C",
            "837DF269-2A2A-47E6-BA19-3FC65D5D3FA7",
            "6AF6F47F-8432-4CBE-9F2F-7C8C56D4F70A",
            subordinateWithSubordinates,
            excludedResultId,
        ];
        const subordinates2 = [
            "0113FF8E-0107-4468-AE19-415DEEB0C5B7",
            "F601D2D2-9B45-4068-9A4F-55FF18E3215D",
            "201A2FE2-6D48-4E2B-A925-5275F2D56F39",
            excludedResultId,
        ];
        await Promise.all(subordinates.map((id) => createTestNode(connection!, dn, id)));
        await Promise.all(subordinates2.map((id) => createTestNode(connection!, asdf, id)));
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_wholeSubtree,
            { // Filter out one result.
                not: {
                    item: {
                        equality: new AttributeValueAssertion(
                            commonName["&id"],
                            utf8(excludedResultId),
                            undefined,
                        ),
                    },
                },
            },
            true,
        );
        const arg: SearchArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            search["&operationCode"]!,
            _encode_SearchArgument(arg, DER),
        );
        if ("result" in result && result.result) {
            const decoded = _decode_SearchResult(result.result);
            const resData = getOptionallyProtectedValue(decoded);
            if ("searchInfo" in resData) {
                /**
                 * You might think this search is supposed to return three
                 * results, but don't forget: you are using subtree scope, so
                 * the baseObject will be returned as a result too!
                 */
                expect(resData.searchInfo.entries.length).toBe(1 + subordinates.length + subordinates2.length - 2);
            } else {
                expect(false).toBeFalsy();
            }
        } else {
            expect(false).toBeTruthy();
        }
    });

    it.skip("Search.searchControlOptions.searchAliases", async () => {

    });

    it.skip("Search.searchControlOptions.matchedValuesOnly", async () => {

    });

    it.skip("Search.searchControlOptions.checkOverspecified", async () => {

    });

    it.skip("Search.searchControlOptions.performExactly", async () => {

    });

    it.skip("Search.searchControlOptions.includeAllAreas", async () => {

    });

    it.skip("Search.searchControlOptions.noSystemRelaxation", async () => {

    });

    it.skip("Search.searchControlOptions.dnAttribute", async () => {

    });

    it.skip("Search.searchControlOptions.matchOnResidualName", async () => {

    });

    it.skip("Search.searchControlOptions.entryCount", async () => {

    });

    it.skip("Search.searchControlOptions.useSubset", async () => {

    });

    it.skip("Search.searchControlOptions.separateFamilyMembers", async () => {

    });

    it.skip("Search.searchControlOptions.searchFamily", async () => {

    });

    it("Search.selection", async () => {
        const testId = `Search.selection-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const subordinateWithSubordinates: string = "1ED2AD20-A11F-42EC-81CB-4D6843CA6ACD";
        const asdf: DistinguishedName = [ ...dn, createTestRDN(subordinateWithSubordinates) ];
        const subordinates = [
            "E338ECE9-0100-4499-BEEE-2F3F766B669C",
            "837DF269-2A2A-47E6-BA19-3FC65D5D3FA7",
            "6AF6F47F-8432-4CBE-9F2F-7C8C56D4F70A",
            subordinateWithSubordinates,
        ];
        const subordinates2 = [
            "0113FF8E-0107-4468-AE19-415DEEB0C5B7",
            "F601D2D2-9B45-4068-9A4F-55FF18E3215D",
            "201A2FE2-6D48-4E2B-A925-5275F2D56F39",
        ];
        await Promise.all(subordinates.map((id) => createTestNode(connection!, dn, id)));
        await Promise.all(subordinates2.map((id) => createTestNode(connection!, asdf, id)));
        const selection = new EntryInformationSelection(
            {
                select: [
                    description["&id"],
                ],
            },
            undefined,
            {
                select: [
                    createTimestamp["&id"],
                ],
            },
            undefined,
            undefined,
            undefined,
        );
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_wholeSubtree,
            undefined,
            true,
            selection,
        );
        const arg: SearchArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            search["&operationCode"]!,
            _encode_SearchArgument(arg, DER),
        );
        if ("result" in result && result.result) {
            const decoded = _decode_SearchResult(result.result);
            const resData = getOptionallyProtectedValue(decoded);
            if ("searchInfo" in resData) {
                expect(resData.searchInfo.entries.length).toBe(1 + subordinates.length + subordinates2.length);
                for (const entry of resData.searchInfo.entries) {
                    for (const einfo of entry.information ?? []) {
                        assert("attribute" in einfo);
                        expect(
                            einfo.attribute.type_.isEqualTo(description["&id"])
                            || einfo.attribute.type_.isEqualTo(createTimestamp["&id"])
                        ).toBeTruthy();
                    }
                }
            } else {
                expect(false).toBeFalsy();
            }
        } else {
            expect(false).toBeTruthy();
        }
    });

    it("Search.selection.infoTypes", async () => {
        const testId = `Search.selection.infoTypes-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const subordinateWithSubordinates: string = "1ED2AD20-A11F-42EC-81CB-4D6843CA6ACD";
        const asdf: DistinguishedName = [ ...dn, createTestRDN(subordinateWithSubordinates) ];
        const subordinates = [
            "E338ECE9-0100-4499-BEEE-2F3F766B669C",
            "837DF269-2A2A-47E6-BA19-3FC65D5D3FA7",
            "6AF6F47F-8432-4CBE-9F2F-7C8C56D4F70A",
            subordinateWithSubordinates,
        ];
        const subordinates2 = [
            "0113FF8E-0107-4468-AE19-415DEEB0C5B7",
            "F601D2D2-9B45-4068-9A4F-55FF18E3215D",
            "201A2FE2-6D48-4E2B-A925-5275F2D56F39",
        ];
        await Promise.all(subordinates.map((id) => createTestNode(connection!, dn, id)));
        await Promise.all(subordinates2.map((id) => createTestNode(connection!, asdf, id)));
        const selection = new EntryInformationSelection(
            {
                select: [
                    description["&id"],
                ],
            },
            typesOnly,
            {
                select: [
                    createTimestamp["&id"],
                ],
            },
            undefined,
            undefined,
            undefined,
        );
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_wholeSubtree,
            undefined,
            true,
            selection,
        );
        const arg: SearchArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            search["&operationCode"]!,
            _encode_SearchArgument(arg, DER),
        );
        if ("result" in result && result.result) {
            const decoded = _decode_SearchResult(result.result);
            const resData = getOptionallyProtectedValue(decoded);
            if ("searchInfo" in resData) {
                expect(resData.searchInfo.entries.length).toBe(1 + subordinates.length + subordinates2.length);
                for (const entry of resData.searchInfo.entries) {
                    for (const einfo of entry.information ?? []) {
                        assert("attributeType" in einfo);
                        expect(
                            einfo.attributeType.isEqualTo(description["&id"])
                            || einfo.attributeType.isEqualTo(createTimestamp["&id"])
                        ).toBeTruthy();
                    }
                }
            } else {
                expect(false).toBeFalsy();
            }
        } else {
            expect(false).toBeTruthy();
        }
    });

    it("Search.selection.contextSelection.selectedContexts.all", async () => {
        const testId = `Search.selection.contextSelection.selectedContexts.all-${(new Date()).toISOString()}`;
        const firstLocale: ASN1Element = _encode_LocaleContextSyntax({
            localeID1: new ObjectIdentifier([1, 2, 3, 4, 5]),
        }, DER);
        const secondLocale: ASN1Element = _encode_LocaleContextSyntax({
            localeID1: new ObjectIdentifier([1, 2, 3, 4, 6]),
        }, DER);
        const thirdLocale: ASN1Element = _encode_LocaleContextSyntax({
            localeID1: new ObjectIdentifier([1, 2, 3, 4, 7]),
        }, DER);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    commonName["&id"],
                    [],
                    [
                        new Attribute_valuesWithContext_Item(
                            utf8("der entry"),
                            [
                                new Context(
                                    localeContext["&id"],
                                    [secondLocale],
                                    undefined,
                                ),
                            ],
                        ),
                        new Attribute_valuesWithContext_Item(
                            utf8("el entry"),
                            [
                                new Context(
                                    localeContext["&id"],
                                    [firstLocale, thirdLocale],
                                    undefined,
                                ),
                            ],
                        ),
                    ],
                ),
            ]);
        }
        const dn = createTestRootDN(testId);
        const selection = new EntryInformationSelection(
            undefined,
            undefined,
            undefined,
            {
                selectedContexts: [
                    new TypeAndContextAssertion(
                        commonName["&id"],
                        {
                            all: [
                                new ContextAssertion(
                                    localeContext["&id"],
                                    [firstLocale],
                                ),
                                new ContextAssertion(
                                    localeContext["&id"],
                                    [thirdLocale],
                                ),
                            ],
                        },
                    ),
                ],
            },
            true,
            undefined,
        );
        const subordinates = [
            "E338ECE9-0100-4499-BEEE-2F3F766B669C",
            "837DF269-2A2A-47E6-BA19-3FC65D5D3FA7",
            "6AF6F47F-8432-4CBE-9F2F-7C8C56D4F70A",
        ];
        await Promise.all(subordinates.map((id) => createTestNode(connection!, dn, id)));
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_baseObject,
            undefined,
            true,
            selection,
        );
        const arg: SearchArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            search["&operationCode"]!,
            _encode_SearchArgument(arg, DER),
        );
        if ("result" in result && result.result) {
            const decoded = _decode_SearchResult(result.result);
            const resData = getOptionallyProtectedValue(decoded);
            if ("searchInfo" in resData) {
                expect(resData.searchInfo.entries.length).toBe(1);
            const entry = resData.searchInfo.entries[0];
            const cn: EntryInformation_information_Item[] = entry.information
                ?.filter((einfo) => ("attribute" in einfo) && einfo.attribute.type_.isEqualTo(commonName["&id"])) ?? [];
            expect(cn).toHaveLength(1);
            assert("attribute" in cn[0]);
            const valuesWithContext = cn[0].attribute.valuesWithContext ?? [];
            expect(valuesWithContext).toHaveLength(1);
            const chosenValue = valuesWithContext[0].value.utf8String;
            expect(chosenValue).toBe("el entry");
            expect(valuesWithContext[0].contextList).toHaveLength(1);
            expect(valuesWithContext[0].contextList[0].contextType.isEqualTo(localeContext["&id"])).toBeTruthy();
            expect(valuesWithContext[0].contextList[0].contextValues).toHaveLength(2);
            const chosenLocale1 = valuesWithContext[0].contextList[0].contextValues[0].objectIdentifier;
            expect(chosenLocale1.isEqualTo(new ObjectIdentifier([1, 2, 3, 4, 5]))).toBeTruthy();
            const chosenLocale2 = valuesWithContext[0].contextList[0].contextValues[1].objectIdentifier;
            expect(chosenLocale2.isEqualTo(new ObjectIdentifier([1, 2, 3, 4, 7]))).toBeTruthy();
            } else {
                expect(false).toBeFalsy();
            }
        } else {
            expect(false).toBeTruthy();
        }
    });

    it("Search.selection.contextSelection.selectedContexts.preference", async () => {
        const testId = `Search.selection.contextSelection.selectedContexts.preference-${(new Date()).toISOString()}`;
        const firstPreferredLocale: ASN1Element = _encode_LocaleContextSyntax({
            localeID1: new ObjectIdentifier([1, 2, 3, 4, 5]),
        }, DER);
        const secondPreferredLocale: ASN1Element = _encode_LocaleContextSyntax({
            localeID1: new ObjectIdentifier([1, 2, 3, 4, 6]),
        }, DER);
        const thirdPreferredLocale: ASN1Element = _encode_LocaleContextSyntax({
            localeID1: new ObjectIdentifier([1, 2, 3, 4, 7]),
        }, DER);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    commonName["&id"],
                    [],
                    [
                        new Attribute_valuesWithContext_Item(
                            utf8("der entry"),
                            [
                                new Context(
                                    localeContext["&id"],
                                    [secondPreferredLocale],
                                    undefined,
                                ),
                            ],
                        ),
                        new Attribute_valuesWithContext_Item(
                            utf8("el entry"),
                            [
                                new Context(
                                    localeContext["&id"],
                                    [thirdPreferredLocale],
                                    undefined,
                                ),
                            ],
                        ),
                    ],
                ),
            ]);
        }
        const dn = createTestRootDN(testId);
        const selection = new EntryInformationSelection(
            undefined,
            undefined,
            undefined,
            {
                selectedContexts: [
                    new TypeAndContextAssertion(
                        commonName["&id"],
                        {
                            preference: [
                                new ContextAssertion(
                                    localeContext["&id"],
                                    [
                                        firstPreferredLocale,
                                    ],
                                ),
                                new ContextAssertion(
                                    localeContext["&id"],
                                    [
                                        secondPreferredLocale, // This should be the one that sticks.
                                    ],
                                ),
                                new ContextAssertion(
                                    localeContext["&id"],
                                    [
                                        thirdPreferredLocale,
                                    ],
                                ),
                            ],
                        },
                    ),
                ],
            },
            true,
            undefined,
        );
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_baseObject,
            undefined,
            true,
            selection,
        );
        const arg: SearchArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            search["&operationCode"]!,
            _encode_SearchArgument(arg, DER),
        );
        if ("result" in result && result.result) {
            const decoded = _decode_SearchResult(result.result);
            const resData = getOptionallyProtectedValue(decoded);
            if ("searchInfo" in resData) {
                expect(resData.searchInfo.entries.length).toBe(1);
                const entry = resData.searchInfo.entries[0];
                const cn: EntryInformation_information_Item[] = entry.information
                    ?.filter((einfo) => ("attribute" in einfo) && einfo.attribute.type_.isEqualTo(commonName["&id"])) ?? [];
                expect(cn).toHaveLength(1);
                assert("attribute" in cn[0]);
                const valuesWithContext = cn[0].attribute.valuesWithContext ?? [];
                expect(valuesWithContext).toHaveLength(1);
                const chosenValue = valuesWithContext[0].value.utf8String;
                expect(chosenValue).toBe("der entry");
                expect(valuesWithContext[0].contextList).toHaveLength(1);
                expect(valuesWithContext[0].contextList[0].contextType.isEqualTo(localeContext["&id"])).toBeTruthy();
                expect(valuesWithContext[0].contextList[0].contextValues).toHaveLength(1);
                const chosenLocale = valuesWithContext[0].contextList[0].contextValues[0].objectIdentifier;
                expect(chosenLocale.isEqualTo(new ObjectIdentifier([1, 2, 3, 4, 6]))).toBeTruthy();
            } else {
                expect(false).toBeFalsy();
            }
        } else {
            expect(false).toBeTruthy();
        }
    });

    it("Search.selection.returnContexts", async () => {
        const testId = `Search.selection.returnContexts-${(new Date()).toISOString()}`;
        const locale: ASN1Element = _encode_LocaleContextSyntax({
            localeID1: new ObjectIdentifier([1, 2, 3, 4, 5]),
        }, DER);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    localityName["&id"],
                    [],
                    [
                        new Attribute_valuesWithContext_Item(
                            utf8("el entry"),
                            [
                                new Context(
                                    localeContext["&id"],
                                    [locale],
                                    undefined,
                                ),
                            ],
                        ),
                    ],
                ),
            ]);
        }
        const dn = createTestRootDN(testId);
        const readEntry = (includeContexts: boolean) => {
            const selection = new EntryInformationSelection(
                undefined,
                undefined,
                undefined,
                undefined,
                includeContexts,
                undefined,
            );
            const reqData: SearchArgumentData = new SearchArgumentData(
                {
                    rdnSequence: dn,
                },
                SearchArgumentData_subset_baseObject,
                undefined,
                true,
                selection,
            );
            const arg: SearchArgument = {
                unsigned: reqData,
            };
            return writeOperation(
                connection!,
                search["&operationCode"]!,
                _encode_SearchArgument(arg, DER),
            );
        };
        const resultWithContexts = await readEntry(true);
        assert("result" in resultWithContexts);
        assert(resultWithContexts.result);
        { // With contexts
            const decoded = _decode_SearchResult(resultWithContexts.result);
            const resData = getOptionallyProtectedValue(decoded);
            assert("searchInfo" in resData);
            expect(resData.searchInfo.entries).toHaveLength(1);
            const entry = resData.searchInfo.entries[0];
            const loc: EntryInformation_information_Item[] = entry.information
                ?.filter((einfo) => ("attribute" in einfo) && einfo.attribute.type_.isEqualTo(localityName["&id"])) ?? [];
            expect(loc).toHaveLength(1);
            assert("attribute" in loc[0]);
            const valuesWithContext = loc[0].attribute.valuesWithContext ?? [];
            expect(valuesWithContext).toHaveLength(1);
            const chosenValue = valuesWithContext[0].value.utf8String;
            expect(chosenValue).toBe("el entry");
            expect(valuesWithContext[0].contextList).toHaveLength(1);
            expect(valuesWithContext[0].contextList[0].contextType.isEqualTo(localeContext["&id"])).toBeTruthy();
            expect(valuesWithContext[0].contextList[0].contextValues).toHaveLength(1);
        }
        const resultWithoutContexts = await readEntry(false);
        assert("result" in resultWithoutContexts);
        assert(resultWithoutContexts.result);
        { // Without contexts
            const decoded = _decode_SearchResult(resultWithoutContexts.result);
            const resData = getOptionallyProtectedValue(decoded);
            assert("searchInfo" in resData);
            expect(resData.searchInfo.entries).toHaveLength(1);
            const entry = resData.searchInfo.entries[0];
            const loc: EntryInformation_information_Item[] = entry.information
                ?.filter((einfo) => ("attribute" in einfo) && einfo.attribute.type_.isEqualTo(localityName["&id"])) ?? [];
            expect(loc).toHaveLength(1);
            assert("attribute" in loc[0]);
            const values = loc[0].attribute.values;
            const valuesWithContext = loc[0].attribute.valuesWithContext ?? [];
            expect(values).toHaveLength(1);
            expect(valuesWithContext).toHaveLength(0);
            const chosenValue = values[0].utf8String;
            expect(chosenValue).toBe("el entry");
        }
    });

    it.skip("Search.selection.familyReturn.memberSelect.contributingEntriesOnly", async () => {

    });

    it.skip("Search.selection.familyReturn.memberSelect.participatingEntriesOnly", async () => {

    });

    it.skip("Search.selection.familyReturn.memberSelect.compoundEntry", async () => {

    });

    it.skip("Search.selection.familyReturn.familySelect", async () => {

    });

    it("Search pagination works", async () => {
        const testId = `Search.pagination-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const pageSize: number = 5;
        const subordinatesLevel1: string[] = Array(pageSize * 2).fill("").map(() => crypto.randomUUID());
        const subordinatesLevel2: string[] = Array((pageSize * 2) - 1).fill("").map(() => crypto.randomUUID());
        await Promise.all(subordinatesLevel1.map((id) => createTestNode(connection!, dn, id)));
        const subordinateWithSubordinates: string = subordinatesLevel1[subordinatesLevel1.length - 1];
        const level2DN: DistinguishedName = [ ...dn, createTestRDN(subordinateWithSubordinates) ];
        await Promise.all(subordinatesLevel2.map((id) => createTestNode(connection!, level2DN, id)));
        const encountered: Set<string> = new Set();
        const nextPage = async (prr: PagedResultsRequest) => {
            const reqData: SearchArgumentData = new SearchArgumentData(
                {
                    rdnSequence: dn,
                },
                SearchArgumentData_subset_wholeSubtree,
                undefined,
                undefined,
                undefined,
                prr,
            );
            const arg: SearchArgument = {
                unsigned: reqData,
            };
            const result = await writeOperation(
                connection!,
                search["&operationCode"]!,
                _encode_SearchArgument(arg, DER),
            );
            assert("result" in result);
            assert(result.result);
            const decoded = _decode_SearchResult(result.result);
            const resData = getOptionallyProtectedValue(decoded);
            assert("searchInfo" in resData);
            expect(resData.searchInfo.entries).toHaveLength(pageSize);
            for (const entry of resData.searchInfo.entries) {
                const rdn = entry.name.rdnSequence[entry.name.rdnSequence.length - 1];
                const foundId: string = rdn[0].value.utf8String;
                expect(encountered.has(foundId)).toBeFalsy();
                encountered.add(foundId);
            }
            return resData.searchInfo.partialOutcomeQualifier?.queryReference;
        };
        const qr1 = await nextPage({
            newRequest: new PagedResultsRequest_newRequest(
                pageSize,
            ),
        });
        assert(qr1);
        const qr2 = await nextPage({
            queryReference: qr1,
        });
        assert(qr2);
        const qr3 = await nextPage({
            queryReference: qr2,
        });
        assert(qr3);
        const qr4 = await nextPage({
            queryReference: qr3,
        });
        expect(qr4).toBeUndefined();
        expect(encountered.size).toBe(pageSize * 4);
    });

    it("Search pagination pageNumber works", async () => {
        const testId = `Search.pageNumber-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const pageSize: number = 5;
        const subordinatesLevel1: string[] = Array(pageSize * 2).fill("").map(() => crypto.randomUUID());
        const subordinatesLevel2: string[] = Array((pageSize * 2) - 1).fill("").map(() => crypto.randomUUID());
        await Promise.all(subordinatesLevel1.map((id) => createTestNode(connection!, dn, id)));
        const subordinateWithSubordinates: string = subordinatesLevel1[subordinatesLevel1.length - 1];
        const level2DN: DistinguishedName = [ ...dn, createTestRDN(subordinateWithSubordinates) ];
        await Promise.all(subordinatesLevel2.map((id) => createTestNode(connection!, level2DN, id)));
        const encountered: Set<string> = new Set();
        const nextPage = async (prr: PagedResultsRequest) => {
            const reqData: SearchArgumentData = new SearchArgumentData(
                {
                    rdnSequence: dn,
                },
                SearchArgumentData_subset_wholeSubtree,
                undefined,
                undefined,
                undefined,
                prr,
            );
            const arg: SearchArgument = {
                unsigned: reqData,
            };
            const result = await writeOperation(
                connection!,
                search["&operationCode"]!,
                _encode_SearchArgument(arg, DER),
            );
            assert("result" in result);
            assert(result.result);
            const decoded = _decode_SearchResult(result.result);
            const resData = getOptionallyProtectedValue(decoded);
            assert("searchInfo" in resData);
            expect(resData.searchInfo.entries).toHaveLength(pageSize);
            for (const entry of resData.searchInfo.entries) {
                const rdn = entry.name.rdnSequence[entry.name.rdnSequence.length - 1];
                const foundId: string = rdn[0].value.utf8String;
                expect(encountered.has(foundId)).toBeFalsy();
                encountered.add(foundId);
            }
            return resData.searchInfo.partialOutcomeQualifier?.queryReference;
        };
        const qr1 = await nextPage({
            newRequest: new PagedResultsRequest_newRequest(
                pageSize,
                undefined,
                undefined,
                undefined,
                3,
            ),
        });
        expect(qr1).toBeUndefined();
        expect(encountered.size).toBe(pageSize);
    });

    it("Search pagination sorting works", async () => {
        const testId = `Search.pagination-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const pageSize: number = 5;
        const subordinatesLevel1: string[] = Array(pageSize * 2).fill("").map(() => crypto.randomUUID());
        const subordinatesLevel2: string[] = Array((pageSize * 2) - 1).fill("").map(() => crypto.randomUUID());
        await Promise.all(subordinatesLevel1.map((id) => createTestNode(connection!, dn, id)));
        const subordinateWithSubordinates: string = subordinatesLevel1[subordinatesLevel1.length - 1];
        const level2DN: DistinguishedName = [ ...dn, createTestRDN(subordinateWithSubordinates) ];
        await Promise.all(subordinatesLevel2.map((id) => createTestNode(connection!, level2DN, id)));
        const encountered: Set<string> = new Set();
        let lastResult: string | undefined;
        const nextPage = async (prr: PagedResultsRequest) => {
            const reqData: SearchArgumentData = new SearchArgumentData(
                {
                    rdnSequence: dn,
                },
                SearchArgumentData_subset_wholeSubtree,
                undefined,
                undefined,
                undefined,
                prr,
            );
            const arg: SearchArgument = {
                unsigned: reqData,
            };
            const result = await writeOperation(
                connection!,
                search["&operationCode"]!,
                _encode_SearchArgument(arg, DER),
            );
            assert("result" in result);
            assert(result.result);
            const decoded = _decode_SearchResult(result.result);
            const resData = getOptionallyProtectedValue(decoded);
            assert("searchInfo" in resData);
            expect(resData.searchInfo.entries).toHaveLength(pageSize);
            for (const entry of resData.searchInfo.entries) {
                const rdn = entry.name.rdnSequence[entry.name.rdnSequence.length - 1];
                const foundId: string = rdn[0].value.utf8String;
                if (lastResult) {
                    expect([ lastResult, foundId ].sort()).toEqual([ lastResult, foundId ]);
                }
                expect(encountered.has(foundId)).toBeFalsy();
                encountered.add(foundId);
            }
            return resData.searchInfo.partialOutcomeQualifier?.queryReference;
        };
        const qr1 = await nextPage({
            newRequest: new PagedResultsRequest_newRequest(
                pageSize,
                [
                    new SortKey(
                        commonName["&id"],
                    ),
                ],
            ),
        });
        assert(qr1);
        const qr2 = await nextPage({
            queryReference: qr1,
        });
        assert(qr2);
        const qr3 = await nextPage({
            queryReference: qr2,
        });
        assert(qr3);
        const qr4 = await nextPage({
            queryReference: qr3,
        });
        expect(qr4).toBeUndefined();
        expect(encountered.size).toBe(pageSize * 4);
    });

    it.skip("Search pagination reverse works", async () => {

    });

    it.todo("Search pagination unmerged works");

    it.todo("AddEntry.targetSystem successfully initiates an HOB");

    it("ModifyEntry.changes.addAttribute", async () => {
        const testId = `ModifyEntry.changes.addAttribute-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const desc = _encode_UnboundedDirectoryString({
            uTF8String: "Entry successfully modified",
        }, DER);
        const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
            {
                rdnSequence: dn,
            },
            [
                {
                    addAttribute: new Attribute(
                        localityName["&id"],
                        [desc],
                        undefined,
                    ),
                },
            ],
            undefined,
            [],
        );
        const arg: ModifyEntryArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            modifyEntry["&operationCode"]!,
            _encode_ModifyEntryArgument(arg, DER),
        );
        expect(("result" in result) && result.result).toBeTruthy();
    });

    it("ModifyEntry.changes.removeAttribute", async () => {
        const testId = `ModifyEntry.changes.removeAttribute-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
            {
                rdnSequence: dn,
            },
            [
                {
                    removeAttribute: description["&id"],
                },
            ],
            undefined,
            [],
        );
        const arg: ModifyEntryArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            modifyEntry["&operationCode"]!,
            _encode_ModifyEntryArgument(arg, DER),
        );
        expect(("result" in result) && result.result).toBeTruthy();
    });

    it("ModifyEntry.changes.addValues", async () => {
        const testId = `ModifyEntry.changes.addValues-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const desc = _encode_UnboundedDirectoryString({
            uTF8String: "Entry successfully modified",
        }, DER);
        const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
            {
                rdnSequence: dn,
            },
            [
                {
                    addValues: new Attribute(
                        localityName["&id"],
                        [desc],
                        undefined,
                    ),
                },
            ],
            undefined,
        );
        const arg: ModifyEntryArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            modifyEntry["&operationCode"]!,
            _encode_ModifyEntryArgument(arg, DER),
        );
        expect(("result" in result) && result.result).toBeTruthy();
    });

    it("ModifyEntry.changes.removeValues", async () => {
        const testId = `ModifyEntry.changes.removeValues-${(new Date()).toISOString()}`;
        const desc = _encode_UnboundedDirectoryString({
            uTF8String: "Entry successfully modified",
        }, DER);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    description["&id"],
                    [desc],
                    undefined,
                ),
            ]);
        }
        const dn = createTestRootDN(testId);

        const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
            {
                rdnSequence: dn,
            },
            [
                {
                    removeValues: new Attribute(
                        description["&id"],
                        [desc],
                        undefined,
                    ),
                },
            ],
            undefined,
            [],
        );
        const arg: ModifyEntryArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            modifyEntry["&operationCode"]!,
            _encode_ModifyEntryArgument(arg, DER),
        );
        expect(("result" in result) && result.result).toBeTruthy();
    });

    test.todo("ModifyEntry.changes.alterValues with REAL-typed attributes");
    test.todo("Ensure that contexts are preserved with certain entry modifications");

    it("ModifyEntry.changes.alterValues", async () => {
        const testId = `ModifyEntry.changes.alterValues-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        const newEntryRDN: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                oidC["&id"],
                int(5),
            ),
        ];
        { // Setup
            await createTestRootNode(connection!, testId);
            await createEntry(
                connection!,
                dn,
                newEntryRDN,
                [
                    new Attribute(
                        objectClass["&id"],
                        [oid(oidCobj["&id"])], // The only X.520 object class having INTEGER-typed attributes.
                        undefined,
                    ),
                    new Attribute(
                        oidC["&id"],
                        [int(5)],
                        undefined,
                    ),
                ],
            );
        }
        const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
            {
                rdnSequence: [
                    ...dn,
                    newEntryRDN,
                ],
            },
            [
                {
                    removeValues: new Attribute(
                        oidC["&id"],
                        [int(-2)],
                        undefined,
                    ),
                },
            ],
            undefined,
            [],
        );
        const arg: ModifyEntryArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            modifyEntry["&operationCode"]!,
            _encode_ModifyEntryArgument(arg, DER),
        );
        expect(("result" in result) && result.result).toBeTruthy();
    });

    it.skip("ModifyEntry.changes.resetValue", async () => {
        const testId = `ModifyEntry.changes.resetValue-${(new Date()).toISOString()}`;
        const desc1 = _encode_UnboundedDirectoryString({
            uTF8String: "Mod 1",
        }, DER);
        const desc2 = _encode_UnboundedDirectoryString({
            uTF8String: "Mod 2",
        }, DER);
        const desc3 = _encode_UnboundedDirectoryString({
            uTF8String: "Mod 3",
        }, DER);
        const locale: ASN1Element = _encode_LocaleContextSyntax({
            localeID1: new ObjectIdentifier([1, 2, 3, 4, 6]),
        }, DER);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    description["&id"],
                    [desc1],
                    [
                        new Attribute_valuesWithContext_Item(
                            desc2,
                            [
                                new Context(
                                    localeContext["&id"],
                                    [locale],
                                    FALSE, // This one should be deleted because fallback is FALSE.
                                ),
                            ],
                        ),
                        new Attribute_valuesWithContext_Item(
                            desc3,
                            [
                                new Context(
                                    localeContext["&id"],
                                    [locale],
                                    TRUE, // This one should NOT be deleted because fallback is TRUE.
                                ),
                            ],
                        ),
                    ],
                ),
            ]);
        }
        const dn = createTestRootDN(testId);
        const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
            {
                rdnSequence: dn,
            },
            [
                {
                    resetValue: description["&id"],
                },
            ],
            undefined,
            [],
        );
        const arg: ModifyEntryArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            modifyEntry["&operationCode"]!,
            _encode_ModifyEntryArgument(arg, DER),
        );
        expect(("result" in result) && result.result).toBeTruthy();
    });

    it.skip("ModifyEntry.changes.replaceValues", async () => {
        const testId = `ModifyEntry.changes.replaceValues-${(new Date()).toISOString()}`;
        const desc = _encode_UnboundedDirectoryString({
            uTF8String: "Entry successfully modified",
        }, DER);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    description["&id"],
                    [desc],
                    undefined,
                ),
            ]);
        }
        const dn = createTestRootDN(testId);
        const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
            {
                rdnSequence: dn,
            },
            [
                {
                    replaceValues: new Attribute(
                        description["&id"],
                        [desc],
                        undefined,
                    ),
                },
            ],
            undefined,
            [],
        );
        const arg: ModifyEntryArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            modifyEntry["&operationCode"]!,
            _encode_ModifyEntryArgument(arg, DER),
        );
        expect(("result" in result) && result.result).toBeTruthy();
    });

    it("ModifyEntry.selection", async () => {
        const testId = `ModifyEntry.selection-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const selection = new EntryInformationSelection(
            {
                select: [
                    description["&id"],
                ],
            },
            undefined,
            {
                select: [
                    createTimestamp["&id"],
                ],
            },
            undefined,
            undefined,
            undefined,
        );
        const desc = _encode_UnboundedDirectoryString({
            uTF8String: "Entry successfully modified",
        }, DER);
        const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
            {
                rdnSequence: dn,
            },
            [
                {
                    addValues: new Attribute(
                        localityName["&id"],
                        [desc],
                        undefined,
                    ),
                },
            ],
            selection,
            [],
        );
        const arg: ModifyEntryArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            modifyEntry["&operationCode"]!,
            _encode_ModifyEntryArgument(arg, DER),
        );
        if ("result" in result && result.result) {
            const decoded = _decode_ModifyEntryResult(result.result);
            assert("information" in decoded);
            const resData = getOptionallyProtectedValue(decoded.information);
            const entry = resData.entry;
            assert(entry);
            const cn: EntryInformation_information_Item | undefined = entry.information
                ?.find((einfo) => ("attribute" in einfo) && einfo.attribute.type_.isEqualTo(commonName["&id"]));
            const d: EntryInformation_information_Item | undefined = entry.information
                ?.find((einfo) => ("attribute" in einfo) && einfo.attribute.type_.isEqualTo(description["&id"]));
            const cts: EntryInformation_information_Item | undefined = entry.information
                ?.find((einfo) => ("attribute" in einfo) && einfo.attribute.type_.isEqualTo(createTimestamp["&id"]));
            expect(cn).toBeUndefined();
            expect(d).toBeDefined();
            expect(cts).toBeDefined();
            expect(resData.entry?.information).toHaveLength(2);
        } else {
            expect(false).toBeTruthy();
        }
    });

    it("ModifyEntry.selection.infoTypes", async () => {
        const testId = `ModifyEntry.selection.infoTypes-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const selection = new EntryInformationSelection(
            {
                select: [
                    commonName["&id"],
                ],
            },
            typesOnly,
            undefined,
            undefined,
            undefined,
            undefined,
        );
        const desc = _encode_UnboundedDirectoryString({
            uTF8String: "Entry successfully modified",
        }, DER);
        const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
            {
                rdnSequence: dn,
            },
            [
                {
                    addValues: new Attribute(
                        localityName["&id"],
                        [desc],
                        undefined,
                    ),
                },
            ],
            selection,
        );
        const arg: ModifyEntryArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            modifyEntry["&operationCode"]!,
            _encode_ModifyEntryArgument(arg, DER),
        );
        if ("result" in result && result.result) {
            const decoded = _decode_ModifyEntryResult(result.result);
            assert("information" in decoded);
            const resData = getOptionallyProtectedValue(decoded.information);
            assert(resData.entry);
            expect(resData.entry.information?.length).toBe(1);
            const cn: EntryInformation_information_Item | undefined = resData.entry.information
                ?.find((einfo) => ("attributeType" in einfo) && einfo.attributeType.isEqualTo(commonName["&id"]));
            expect(cn).toBeDefined();
        } else {
            expect(false).toBeTruthy();
        }
    });

    it("ModifyEntry.selection.contextSelection.selectedContexts.all", async () => {
        const testId = `ModifyEntry.selection.contextSelection.selectedContexts.all-${(new Date()).toISOString()}`;
        const firstLocale: ASN1Element = _encode_LocaleContextSyntax({
            localeID1: new ObjectIdentifier([1, 2, 3, 4, 5]),
        }, DER);
        const secondLocale: ASN1Element = _encode_LocaleContextSyntax({
            localeID1: new ObjectIdentifier([1, 2, 3, 4, 6]),
        }, DER);
        const thirdLocale: ASN1Element = _encode_LocaleContextSyntax({
            localeID1: new ObjectIdentifier([1, 2, 3, 4, 7]),
        }, DER);
        const desc = _encode_UnboundedDirectoryString({
            uTF8String: "Entry successfully modified",
        }, DER);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    commonName["&id"],
                    [],
                    [
                        new Attribute_valuesWithContext_Item(
                            utf8("der entry"),
                            [
                                new Context(
                                    localeContext["&id"],
                                    [secondLocale],
                                    undefined,
                                ),
                            ],
                        ),
                        new Attribute_valuesWithContext_Item(
                            utf8("el entry"),
                            [
                                new Context(
                                    localeContext["&id"],
                                    [firstLocale, thirdLocale],
                                    undefined,
                                ),
                            ],
                        ),
                    ],
                ),
            ]);
        }
        const dn = createTestRootDN(testId);
        const selection = new EntryInformationSelection(
            undefined,
            undefined,
            undefined,
            {
                selectedContexts: [
                    new TypeAndContextAssertion(
                        commonName["&id"],
                        {
                            all: [
                                new ContextAssertion(
                                    localeContext["&id"],
                                    [firstLocale],
                                ),
                                new ContextAssertion(
                                    localeContext["&id"],
                                    [thirdLocale],
                                ),
                            ],
                        },
                    ),
                ],
            },
            true,
            undefined,
        );
        const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
            {
                rdnSequence: dn,
            },
            [
                {
                    addValues: new Attribute(
                        localityName["&id"],
                        [desc],
                        undefined,
                    ),
                },
            ],
            selection,
        );
        const arg: ModifyEntryArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            modifyEntry["&operationCode"]!,
            _encode_ModifyEntryArgument(arg, DER),
        );
        if ("result" in result && result.result) {
            const decoded = _decode_ModifyEntryResult(result.result);
            assert("information" in decoded);
            const resData = getOptionallyProtectedValue(decoded.information);
            assert(resData.entry);
            const cn: EntryInformation_information_Item[] = resData.entry.information
                ?.filter((einfo) => ("attribute" in einfo) && einfo.attribute.type_.isEqualTo(commonName["&id"])) ?? [];
            expect(cn).toHaveLength(1);
            assert("attribute" in cn[0]);
            const valuesWithContext = cn[0].attribute.valuesWithContext ?? [];
            expect(valuesWithContext).toHaveLength(1);
            const chosenValue = valuesWithContext[0].value.utf8String;
            expect(chosenValue).toBe("el entry");
            expect(valuesWithContext[0].contextList).toHaveLength(1);
            expect(valuesWithContext[0].contextList[0].contextType.isEqualTo(localeContext["&id"])).toBeTruthy();
            expect(valuesWithContext[0].contextList[0].contextValues).toHaveLength(2);
            const chosenLocale1 = valuesWithContext[0].contextList[0].contextValues[0].objectIdentifier;
            expect(chosenLocale1.isEqualTo(new ObjectIdentifier([1, 2, 3, 4, 5]))).toBeTruthy();
            const chosenLocale2 = valuesWithContext[0].contextList[0].contextValues[1].objectIdentifier;
            expect(chosenLocale2.isEqualTo(new ObjectIdentifier([1, 2, 3, 4, 7]))).toBeTruthy();
        } else {
            expect(false).toBeTruthy();
        }
    });

    it("ModifyEntry.selection.contextSelection.selectedContexts.preference", async () => {
        const testId = `ModifyEntry.selection.contextSelection.selectedContexts.preference-${(new Date()).toISOString()}`;
        const firstPreferredLocale: ASN1Element = _encode_LocaleContextSyntax({
            localeID1: new ObjectIdentifier([1, 2, 3, 4, 5]),
        }, DER);
        const secondPreferredLocale: ASN1Element = _encode_LocaleContextSyntax({
            localeID1: new ObjectIdentifier([1, 2, 3, 4, 6]),
        }, DER);
        const thirdPreferredLocale: ASN1Element = _encode_LocaleContextSyntax({
            localeID1: new ObjectIdentifier([1, 2, 3, 4, 7]),
        }, DER);
        const desc = _encode_UnboundedDirectoryString({
            uTF8String: "Entry successfully modified",
        }, DER);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    commonName["&id"],
                    [],
                    [
                        new Attribute_valuesWithContext_Item(
                            utf8("der entry"),
                            [
                                new Context(
                                    localeContext["&id"],
                                    [secondPreferredLocale],
                                    undefined,
                                ),
                            ],
                        ),
                        new Attribute_valuesWithContext_Item(
                            utf8("el entry"),
                            [
                                new Context(
                                    localeContext["&id"],
                                    [thirdPreferredLocale],
                                    undefined,
                                ),
                            ],
                        ),
                    ],
                ),
            ]);
        }
        const dn = createTestRootDN(testId);
        const selection = new EntryInformationSelection(
            undefined,
            undefined,
            undefined,
            {
                selectedContexts: [
                    new TypeAndContextAssertion(
                        commonName["&id"],
                        {
                            preference: [
                                new ContextAssertion(
                                    localeContext["&id"],
                                    [
                                        firstPreferredLocale,
                                    ],
                                ),
                                new ContextAssertion(
                                    localeContext["&id"],
                                    [
                                        secondPreferredLocale, // This should be the one that sticks.
                                    ],
                                ),
                                new ContextAssertion(
                                    localeContext["&id"],
                                    [
                                        thirdPreferredLocale,
                                    ],
                                ),
                            ],
                        },
                    ),
                ],
            },
            true,
            undefined,
        );
        const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
            {
                rdnSequence: dn,
            },
            [
                {
                    addValues: new Attribute(
                        localityName["&id"],
                        [desc],
                        undefined,
                    ),
                },
            ],
            selection,
        );
        const arg: ModifyEntryArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            modifyEntry["&operationCode"]!,
            _encode_ModifyEntryArgument(arg, DER),
        );
        if ("result" in result && result.result) {
            const decoded = _decode_ModifyEntryResult(result.result);
            assert("information" in decoded);
            const resData = getOptionallyProtectedValue(decoded.information);
            assert(resData.entry);
            const cn: EntryInformation_information_Item[] = resData.entry.information
                ?.filter((einfo) => ("attribute" in einfo) && einfo.attribute.type_.isEqualTo(commonName["&id"])) ?? [];
            expect(cn).toHaveLength(1);
            assert("attribute" in cn[0]);
            const valuesWithContext = cn[0].attribute.valuesWithContext ?? [];
            expect(valuesWithContext).toHaveLength(1);
            const chosenValue = valuesWithContext[0].value.utf8String;
            expect(chosenValue).toBe("der entry");
            expect(valuesWithContext[0].contextList).toHaveLength(1);
            expect(valuesWithContext[0].contextList[0].contextType.isEqualTo(localeContext["&id"])).toBeTruthy();
            expect(valuesWithContext[0].contextList[0].contextValues).toHaveLength(1);
            const chosenLocale = valuesWithContext[0].contextList[0].contextValues[0].objectIdentifier;
            expect(chosenLocale.isEqualTo(new ObjectIdentifier([1, 2, 3, 4, 6]))).toBeTruthy();
        } else {
            expect(false).toBeTruthy();
        }
    });

    it("ModifyEntry.selection.returnContexts", async () => {
        const testId = `ModifyEntry.selection.returnContexts-${(new Date()).toISOString()}`;
        const locale: ASN1Element = _encode_LocaleContextSyntax({
            localeID1: new ObjectIdentifier([1, 2, 3, 4, 5]),
        }, DER);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    localityName["&id"],
                    [],
                    [
                        new Attribute_valuesWithContext_Item(
                            utf8("el entry"),
                            [
                                new Context(
                                    localeContext["&id"],
                                    [locale],
                                    undefined,
                                ),
                            ],
                        ),
                    ],
                ),
            ]);
        }
        const dn = createTestRootDN(testId);
        const modify = (includeContexts: boolean) => {
            const selection = new EntryInformationSelection(
                undefined,
                undefined,
                undefined,
                undefined,
                includeContexts,
                undefined,
            );
            const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
                {
                    rdnSequence: dn,
                },
                [], // Intentionally empty. We are only testing selection, not modification.
                selection,
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
        const resultWithContexts = await modify(true);
        assert("result" in resultWithContexts);
        assert(resultWithContexts.result);
        { // With contexts
            const decoded = _decode_ModifyEntryResult(resultWithContexts.result);
            assert("information" in decoded);
            const resData = getOptionallyProtectedValue(decoded.information);
            assert(resData.entry);
            const loc: EntryInformation_information_Item[] = resData.entry.information
                ?.filter((einfo) => ("attribute" in einfo) && einfo.attribute.type_.isEqualTo(localityName["&id"])) ?? [];
            expect(loc).toHaveLength(1);
            assert("attribute" in loc[0]);
            const valuesWithContext = loc[0].attribute.valuesWithContext ?? [];
            expect(valuesWithContext).toHaveLength(1);
            const chosenValue = valuesWithContext[0].value.utf8String;
            expect(chosenValue).toBe("el entry");
            expect(valuesWithContext[0].contextList).toHaveLength(1);
            expect(valuesWithContext[0].contextList[0].contextType.isEqualTo(localeContext["&id"])).toBeTruthy();
            expect(valuesWithContext[0].contextList[0].contextValues).toHaveLength(1);
        }
        const resultWithoutContexts = await modify(false);
        assert("result" in resultWithoutContexts);
        assert(resultWithoutContexts.result);
        { // Without contexts
            const decoded = _decode_ModifyEntryResult(resultWithoutContexts.result);
            assert("information" in decoded);
            const resData = getOptionallyProtectedValue(decoded.information);
            assert(resData.entry);
            const loc: EntryInformation_information_Item[] = resData.entry.information
                ?.filter((einfo) => ("attribute" in einfo) && einfo.attribute.type_.isEqualTo(localityName["&id"])) ?? [];
            expect(loc).toHaveLength(1);
            assert("attribute" in loc[0]);
            const values = loc[0].attribute.values;
            const valuesWithContext = loc[0].attribute.valuesWithContext ?? [];
            expect(values).toHaveLength(1);
            expect(valuesWithContext).toHaveLength(0);
            const chosenValue = values[0].utf8String;
            expect(chosenValue).toBe("el entry");
        }
    });

    it("ModifyEntry.selection.familyReturn.memberSelect.contributingEntriesOnly", async () => {
        const testId = `ModifyEntry...contributingEntriesOnly-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId);
            await createCompoundEntry(connection!, dn);
        }
        const desc = _encode_UnboundedDirectoryString({
            uTF8String: "Entry successfully modified",
        }, DER);
        const selection = new EntryInformationSelection(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            new FamilyReturn(
                FamilyReturn_memberSelect_contributingEntriesOnly,
                undefined,
            ),
        );
        const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
            {
                rdnSequence: dn,
            },
            [
                {
                    addValues: new Attribute(
                        localityName["&id"],
                        [desc],
                        undefined,
                    ),
                },
            ],
            selection,
        );
        const arg: ModifyEntryArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            modifyEntry["&operationCode"]!,
            _encode_ModifyEntryArgument(arg, DER),
        );
        assert("result" in result);
        assert(result.result);
        const decoded = _decode_ModifyEntryResult(result.result);
        assert("information" in decoded);
        const resData = getOptionallyProtectedValue(decoded.information);
        assert(resData.entry);
        const familyAttribute: EntryInformation_information_Item | undefined = resData.entry.information
            ?.find((einfo) => ("attribute" in einfo) && einfo.attribute.type_.isEqualTo(family_information["&id"]));
        expect(familyAttribute).toBeUndefined();
    });

    it("ModifyEntry.selection.familyReturn.memberSelect.participatingEntriesOnly", async () => {
        const testId = `ModifyEntry...participatingEntriesOnly-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId);
            await createCompoundEntry(connection!, dn);
        }
        const desc = _encode_UnboundedDirectoryString({
            uTF8String: "Entry successfully modified",
        }, DER);
        const selection = new EntryInformationSelection(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            new FamilyReturn(
                FamilyReturn_memberSelect_participatingEntriesOnly,
                undefined,
            ),
        );
        const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
            {
                rdnSequence: dn,
            },
            [
                {
                    addValues: new Attribute(
                        localityName["&id"],
                        [desc],
                        undefined,
                    ),
                },
            ],
            selection,
        );
        const arg: ModifyEntryArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            modifyEntry["&operationCode"]!,
            _encode_ModifyEntryArgument(arg, DER),
        );
        assert("result" in result);
        assert(result.result);
        const decoded = _decode_ModifyEntryResult(result.result);
        assert("information" in decoded);
        const resData = getOptionallyProtectedValue(decoded.information);
        assert(resData.entry);
        const familyAttribute: EntryInformation_information_Item | undefined = resData.entry.information
            ?.find((einfo) => ("attribute" in einfo) && einfo.attribute.type_.isEqualTo(family_information["&id"]));
        expect(familyAttribute).toBeUndefined();
    });

    it("ModifyEntry.selection.familyReturn.memberSelect.compoundEntry", async () => {
        const testId = `ModifyEntry...compoundEntry-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId);
            await createCompoundEntry(connection!, dn);
        }
        const desc = _encode_UnboundedDirectoryString({
            uTF8String: "Entry successfully modified",
        }, DER);
        const selection = new EntryInformationSelection(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            new FamilyReturn(
                FamilyReturn_memberSelect_compoundEntry,
                undefined,
            ),
        );
        const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
            {
                rdnSequence: [...dn, parentRDN],
            },
            [
                {
                    addValues: new Attribute(
                        localityName["&id"],
                        [desc],
                        undefined,
                    ),
                },
            ],
            selection,
        );
        const arg: ModifyEntryArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            modifyEntry["&operationCode"]!,
            _encode_ModifyEntryArgument(arg, DER),
        );
        assert("result" in result);
        assert(result.result);
        const decoded = _decode_ModifyEntryResult(result.result);
        assert("information" in decoded);
        const resData = getOptionallyProtectedValue(decoded.information);
        assert(resData.entry);
        const familyAttribute: EntryInformation_information_Item | undefined = resData.entry.information
            ?.find((einfo) => ("attribute" in einfo) && einfo.attribute.type_.isEqualTo(family_information["&id"]));
        expect(familyAttribute).toBeDefined();
        assert(familyAttribute);
        assert("attribute" in familyAttribute);
        assert(familyAttribute.attribute.values[0]);
        const families = familyAttribute.attribute.values.map((f) => family_information.decoderFor["&Type"]!(f));
        const orgs = families.filter((f) => f.family_class.isEqualTo(organizationalUnit["&id"]));
        const people = families.filter((f) => f.family_class.isEqualTo(person["&id"]));
        const devices = families.filter((f) => f.family_class.isEqualTo(device["&id"]));
        expect(orgs).toHaveLength(1);
        expect(people).toHaveLength(1);
        expect(devices).toHaveLength(1);
        expect(orgs[0].familyEntries).toHaveLength(2);
        expect(people[0].familyEntries).toHaveLength(1);
        expect(devices[0].familyEntries).toHaveLength(1);
        expect(people[0].familyEntries[0].rdn[0].value.utf8String).toBe("Chief Pain Officer Jonathan Wilbur");
        expect(devices[0].familyEntries[0].rdn[0].value.utf8String).toBe("Commodore 64 (128 KB memory extension)");
        expect(orgs[0].familyEntries.some((f) => f.family_info?.some((fi) => fi.family_class.isEqualTo(person["&id"]))));
        expect(orgs[0].familyEntries.some((f) => f.family_info?.some((fi) => fi.family_class.isEqualTo(device["&id"]))));
    });

    it("ModifyEntry.selection.familyReturn.familySelect", async () => {
        const testId = `ModifyEntry...familySelect-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId);
            await createCompoundEntry(connection!, dn);
        }
        const desc = _encode_UnboundedDirectoryString({
            uTF8String: "Entry successfully modified",
        }, DER);
        const selection = new EntryInformationSelection(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            new FamilyReturn(
                FamilyReturn_memberSelect_compoundEntry,
                [organizationalUnit["&id"]],
            ),
        );
        const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
            {
                rdnSequence: [...dn, parentRDN],
            },
            [
                {
                    addValues: new Attribute(
                        localityName["&id"],
                        [desc],
                        undefined,
                    ),
                },
            ],
            selection,
        );
        const arg: ModifyEntryArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            modifyEntry["&operationCode"]!,
            _encode_ModifyEntryArgument(arg, DER),
        );
        assert("result" in result);
        assert(result.result);
        const decoded = _decode_ModifyEntryResult(result.result);
        assert("information" in decoded);
        const resData = getOptionallyProtectedValue(decoded.information);
        assert(resData.entry);
        const familyAttribute: EntryInformation_information_Item | undefined = resData.entry.information
            ?.find((einfo) => ("attribute" in einfo) && einfo.attribute.type_.isEqualTo(family_information["&id"]));
        expect(familyAttribute).toBeDefined();
        assert(familyAttribute);
        assert("attribute" in familyAttribute);
        assert(familyAttribute.attribute.values[0]);
        const families = familyAttribute.attribute.values.map((f) => family_information.decoderFor["&Type"]!(f));
        const orgs = families.filter((f) => f.family_class.isEqualTo(organizationalUnit["&id"]));
        const people = families.filter((f) => f.family_class.isEqualTo(person["&id"]));
        const devices = families.filter((f) => f.family_class.isEqualTo(device["&id"]));
        expect(orgs).toHaveLength(1);
        expect(people).toHaveLength(0);
        expect(devices).toHaveLength(0);
        expect(orgs[0].familyEntries).toHaveLength(2);
    });

    it("ModifyDN.newRDN", async () => {
        const testId = `ModifyDN.newRDN-${(new Date()).toISOString()}`;
        const newdesc = utf8(`${testId}-moved`);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    description["&id"],
                    [newdesc],
                    undefined,
                ),
            ]);
        }
        const dn = createTestRootDN(testId);
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
        const result = await writeOperation(
            connection!,
            modifyDN["&operationCode"]!,
            _encode_ModifyDNArgument(arg, DER),
        );
        expect(("result" in result) && result.result).toBeTruthy();
    });

    it("ModifyDN.deleteOldRDN", async () => {
        const testId = `ModifyDN.deleteOldRDN-${(new Date()).toISOString()}`;
        const newdesc = utf8(`${testId}-moved`);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    description["&id"],
                    [newdesc],
                    undefined,
                ),
                // Additional commonName value, because commonName is required
                // and deleteOldRDN will delete the last value.
                new Attribute(
                    commonName["&id"],
                    [utf8("PlzNoDelete")],
                    undefined,
                ),
            ]);
        }
        const dn = createTestRootDN(testId);
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
        const result = await writeOperation(
            connection!,
            modifyDN["&operationCode"]!,
            _encode_ModifyDNArgument(arg, DER),
        );
        expect(("result" in result) && result.result).toBeTruthy();
    });

    it("ModifyDN.newSuperior", async () => {
        const sourceTestId = `ModifyDN.newSuperior-${(new Date()).toISOString()}`;
        const destinationTestId = `ModifyDN.newSuperior-${(new Date()).toISOString()}-newDN`;
        const newdesc = utf8(`${sourceTestId}-moved`);
        { // Setup
            await createTestRootNode(connection!, sourceTestId, [
                new Attribute(
                    description["&id"],
                    [newdesc],
                    undefined,
                ),
            ]);
            await createTestRootNode(connection!, destinationTestId, [
                new Attribute(
                    description["&id"],
                    [newdesc],
                    undefined,
                ),
            ]);
        }
        const sourceDN = createTestRootDN(sourceTestId);
        const destinationDN = createTestRootDN(destinationTestId);
        const reqData: ModifyDNArgumentData = new ModifyDNArgumentData(
            sourceDN,
            [
                new AttributeTypeAndValue(
                    description["&id"],
                    newdesc,
                ),
            ],
            false,
            destinationDN,
        );
        const arg: ModifyDNArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            modifyDN["&operationCode"]!,
            _encode_ModifyDNArgument(arg, DER),
        );
        expect(("result" in result) && result.result).toBeTruthy();
    });

    it.skip("Name resolution continues in subordinate DSAs in a HOB", async () => {

    });

    it.skip("Name resolution continues in cross-DSAs in a HOB", async () => {

    });

    it.skip("Name resolution continues in subordinate DSAs in a NHOB", async () => {

    });

    it.skip("Name resolution continues in cross-DSAs in a NHOB", async () => {

    });

    it.skip("ServiceControlOptions.chainingProhibited stops chaining", async () => {

    });

    it.skip("ServiceControlOptions.dontUseCopy stops a shadow DSE from being used", async () => {

    });

    it("ServiceControlOptions.dontDereferenceAliases", async () => {
        const testId = `ServiceControlOptions.dontDereferenceAliases-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const subordinateWithSubordinates: string = "1ED2AD20-A11F-42EC-81CB-4D6843CA6ACD";
        const aliasedDN: DistinguishedName = [ ...dn, createTestRDN(subordinateWithSubordinates) ];
        const subordinates = [
            subordinateWithSubordinates,
        ];
        // It's stupid to use this in the RDN, but alias is a _structural_ object class.
        const aliasRDN: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                objectClass["&id"],
                oid(alias["&id"]),
            ),
        ];
        const subordinates2 = [
            "0113FF8E-0107-4468-AE19-415DEEB0C5B7",
            "F601D2D2-9B45-4068-9A4F-55FF18E3215D",
            "201A2FE2-6D48-4E2B-A925-5275F2D56F39",
        ];
        await Promise.all(subordinates.map((id) => createTestNode(connection!, dn, id)));
        await Promise.all(subordinates2.map((id) => createTestNode(connection!, aliasedDN, id)));
        // This should be done after the aliased entry is created so you do not
        // get warnings about the aliased entry not existing.
        await createEntry( // Creates an alias that points to `subordinateWithSubordinates`.
            connection!,
            dn,
            aliasRDN,
            [
                new Attribute(
                    objectClass["&id"],
                    [oid(alias["&id"])],
                    undefined,
                ),
                new Attribute(
                    aliasedEntryName["&id"],
                    [ _encode_DistinguishedName(aliasedDN, DER) ],
                    undefined,
                ),
            ],
        );
        const serviceControlOptions: ServiceControlOptions = new Uint8ClampedArray(
            Array(15).fill(FALSE_BIT));
        serviceControlOptions[ServiceControlOptions_dontDereferenceAliases] = TRUE_BIT;
        const reqData: ReadArgumentData = new ReadArgumentData(
            {
                rdnSequence: [ ...dn, aliasRDN, createTestRDN("F601D2D2-9B45-4068-9A4F-55FF18E3215D") ],
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
        const result = await writeOperation(
            connection!,
            read["&operationCode"]!,
            _encode_ReadArgument(arg, DER),
        );
        assert("error" in result);
        assert(result.errcode);
        expect(compareCode(result.errcode, nameError["&errorCode"]!)).toBeTruthy();
        const param = nameError.decoderFor["&ParameterType"]!(result.error);
        const data = getOptionallyProtectedValue(param);
        expect(data.problem).toBe(NameProblem_aliasDereferencingProblem);
        // expect(data.aliasDereferenced).toBe(FALSE); // May be undefined.
        // The matched name should be the alias, not the aliased entry.
        expect(data.matched.rdnSequence).toHaveLength(2);
        expect(data.matched.rdnSequence[1]).toHaveLength(1);
        expect(data.matched.rdnSequence[1][0].type_.toString()).toBe(objectClass["&id"].toString());
    });

    it("Search ServiceControlOptions.subentries", async () => {
        const testId = `Search.ServiceControlOptions.subentries-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const subordinateWithSubordinates: string = "1ED2AD20-A11F-42EC-81CB-4D6843CA6ACD";
        const withSubordinatesDN: DistinguishedName = [ ...dn, createTestRDN(subordinateWithSubordinates) ];
        const subordinates = [
            subordinateWithSubordinates,
        ];
        const subentryRDN: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("hello"),
            ),
        ];
        const subordinates2 = [
            "0113FF8E-0107-4468-AE19-415DEEB0C5B7",
            "F601D2D2-9B45-4068-9A4F-55FF18E3215D",
            "201A2FE2-6D48-4E2B-A925-5275F2D56F39",
        ];
        await Promise.all(subordinates.map((id) => createTestNode(connection!, dn, id, [
            new Attribute(
                administrativeRole["&id"],
                [
                    _encodeObjectIdentifier(id_ar_autonomousArea, DER),
                ],
                undefined,
            ),
        ])));
        await Promise.all(subordinates2.map((id) => createTestNode(connection!, withSubordinatesDN, id)));
        await createEntry(
            connection!,
            dn,
            subentryRDN,
            [
                new Attribute(
                    objectClass["&id"],
                    [
                        oid(subentry["&id"]),
                        oid(collectiveAttributeSubentry["&id"]),
                    ],
                    undefined,
                ),
                new Attribute(
                    commonName["&id"],
                    [
                        utf8("hello"),
                    ],
                    undefined,
                ),
                new Attribute(
                    subtreeSpecification["&id"],
                    [
                        _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                    ],
                    undefined,
                ),
            ],
        );
        await createEntry(
            connection!,
            withSubordinatesDN,
            subentryRDN,
            [
                new Attribute(
                    objectClass["&id"],
                    [
                        oid(subentry["&id"]),
                        oid(collectiveAttributeSubentry["&id"]),
                    ],
                    undefined,
                ),
                new Attribute(
                    commonName["&id"],
                    [
                        utf8("hello"),
                    ],
                    undefined,
                ),
                new Attribute(
                    subtreeSpecification["&id"],
                    [
                        _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                    ],
                    undefined,
                ),
            ],
        );

        const search_ = (scope: INTEGER) => {
            const serviceControlOptions: ServiceControlOptions = new Uint8ClampedArray(
                Array(15).fill(FALSE_BIT));
            serviceControlOptions[ServiceControlOptions_subentries] = TRUE_BIT;
            const reqData: SearchArgumentData = new SearchArgumentData(
                {
                    rdnSequence: dn,
                },
                scope,
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
                new ServiceControls(
                    serviceControlOptions,
                ),
            );
            const arg: SearchArgument = {
                unsigned: reqData,
            };
            return writeOperation(
                connection!,
                search["&operationCode"]!,
                _encode_SearchArgument(arg, DER),
            );
        };
        const baseObjectResponse = await search_(SearchArgumentData_subset_baseObject);
        const singleLevelResponse = await search_(SearchArgumentData_subset_oneLevel);
        const wholeSubtreeResponse = await search_(SearchArgumentData_subset_wholeSubtree);
        assert("result" in baseObjectResponse);
        assert("result" in singleLevelResponse);
        assert("result" in wholeSubtreeResponse);
        assert(baseObjectResponse.result);
        assert(singleLevelResponse.result);
        assert(wholeSubtreeResponse.result);
        const baseObjectResult = _decode_SearchResult(baseObjectResponse.result);
        const singleLevelResult = _decode_SearchResult(singleLevelResponse.result);
        const wholeSubtreeResult = _decode_SearchResult(wholeSubtreeResponse.result);
        const baseObjectData = getOptionallyProtectedValue(baseObjectResult);
        const singleLevelData = getOptionallyProtectedValue(singleLevelResult);
        const wholeSubtreeData = getOptionallyProtectedValue(wholeSubtreeResult);
        assert("searchInfo" in baseObjectData);
        assert("searchInfo" in singleLevelData);
        assert("searchInfo" in wholeSubtreeData);
        expect(baseObjectData.searchInfo.entries).toHaveLength(0);
        expect(singleLevelData.searchInfo.entries).toHaveLength(1);
        /**
         * Even the subtree search should still only return one subentry,
         * because it should not recurse into the second level to find the
         * second subentry.
         */
        expect(wholeSubtreeData.searchInfo.entries).toHaveLength(1);
    });

    it("List ServiceControlOptions.subentries", async () => {
        const testId = `List.ServiceControlOptions.subentries-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const subordinateWithSubordinates: string = "1ED2AD20-A11F-42EC-81CB-4D6843CA6ACD";
        const withSubordinatesDN: DistinguishedName = [ ...dn, createTestRDN(subordinateWithSubordinates) ];
        const subordinates = [
            subordinateWithSubordinates,
        ];
        const subentryRDN: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("hello"),
            ),
        ];
        const subordinates2 = [
            "0113FF8E-0107-4468-AE19-415DEEB0C5B7",
            "F601D2D2-9B45-4068-9A4F-55FF18E3215D",
            "201A2FE2-6D48-4E2B-A925-5275F2D56F39",
        ];
        await Promise.all(subordinates.map((id) => createTestNode(connection!, dn, id, [
            new Attribute(
                administrativeRole["&id"],
                [
                    _encodeObjectIdentifier(id_ar_autonomousArea, DER),
                ],
                undefined,
            ),
        ])));
        await Promise.all(subordinates2.map((id) => createTestNode(connection!, withSubordinatesDN, id)));
        await createEntry(
            connection!,
            dn,
            subentryRDN,
            [
                new Attribute(
                    objectClass["&id"],
                    [
                        oid(subentry["&id"]),
                        oid(collectiveAttributeSubentry["&id"]),
                    ],
                    undefined,
                ),
                new Attribute(
                    commonName["&id"],
                    [
                        utf8("hello"),
                    ],
                    undefined,
                ),
                new Attribute(
                    subtreeSpecification["&id"],
                    [
                        _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                    ],
                    undefined,
                ),
            ],
        );
        await createEntry(
            connection!,
            withSubordinatesDN,
            subentryRDN,
            [
                new Attribute(
                    objectClass["&id"],
                    [
                        oid(subentry["&id"]),
                        oid(collectiveAttributeSubentry["&id"]),
                    ],
                    undefined,
                ),
                new Attribute(
                    commonName["&id"],
                    [
                        utf8("hello"),
                    ],
                    undefined,
                ),
                new Attribute(
                    subtreeSpecification["&id"],
                    [
                        _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                    ],
                    undefined,
                ),
            ],
        );
        const serviceControlOptions: ServiceControlOptions = new Uint8ClampedArray(
            Array(15).fill(FALSE_BIT));
        serviceControlOptions[ServiceControlOptions_subentries] = TRUE_BIT;
        const reqData: ListArgumentData = new ListArgumentData(
            {
                rdnSequence: dn,
            },
            undefined,
            undefined,
            [],
            new ServiceControls(
                serviceControlOptions,
            ),
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
        const result = _decode_ListResult(response.result);
        const data = getOptionallyProtectedValue(result);
        assert("listInfo" in data);
        expect(data.listInfo.subordinates).toHaveLength(1);
        expect(data.listInfo.subordinates[0].rdn[0].value.utf8String).toBe("hello");
    });

    it.skip("ServiceControlOptions.copyShallDo", async () => {

    });

    // NOTE: partialNameResolution only applies to search and read operations.
    it("Search ServiceControlOptions.partialNameResolution", async () => {
        const testId = `Search.partialNameResolution-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const subordinateWithSubordinates: string = "1ED2AD20-A11F-42EC-81CB-4D6843CA6ACD";
        const withSubordinatesDN: DistinguishedName = [ ...dn, createTestRDN(subordinateWithSubordinates) ];
        const subordinates = [
            subordinateWithSubordinates,
        ];
        const subordinates2 = [
            "0113FF8E-0107-4468-AE19-415DEEB0C5B7",
            "F601D2D2-9B45-4068-9A4F-55FF18E3215D",
            "201A2FE2-6D48-4E2B-A925-5275F2D56F39",
        ];
        await Promise.all(subordinates.map((id) => createTestNode(connection!, dn, id, [
            new Attribute(
                administrativeRole["&id"],
                [
                    _encodeObjectIdentifier(id_ar_autonomousArea, DER),
                ],
                undefined,
            ),
        ])));
        await Promise.all(subordinates2.map((id) => createTestNode(connection!, withSubordinatesDN, id)));
        const search_ = (scope: INTEGER) => {
            const serviceControlOptions: ServiceControlOptions = new Uint8ClampedArray(
                Array(15).fill(FALSE_BIT));
            serviceControlOptions[ServiceControlOptions_partialNameResolution] = TRUE_BIT;
            const reqData: SearchArgumentData = new SearchArgumentData(
                {
                    rdnSequence: [ ...withSubordinatesDN, createTestRDN("does not exist") ],
                },
                scope,
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
                new ServiceControls(
                    serviceControlOptions,
                ),
            );
            const arg: SearchArgument = {
                unsigned: reqData,
            };
            return writeOperation(
                connection!,
                search["&operationCode"]!,
                _encode_SearchArgument(arg, DER),
            );
        };
        const baseObjectResponse = await search_(SearchArgumentData_subset_baseObject);
        const singleLevelResponse = await search_(SearchArgumentData_subset_oneLevel);
        const wholeSubtreeResponse = await search_(SearchArgumentData_subset_wholeSubtree);
        assert("result" in baseObjectResponse);
        assert("result" in singleLevelResponse);
        assert("result" in wholeSubtreeResponse);
        assert(baseObjectResponse.result);
        assert(singleLevelResponse.result);
        assert(wholeSubtreeResponse.result);
        const baseObjectResult = _decode_SearchResult(baseObjectResponse.result);
        const singleLevelResult = _decode_SearchResult(singleLevelResponse.result);
        const wholeSubtreeResult = _decode_SearchResult(wholeSubtreeResponse.result);
        const baseObjectData = getOptionallyProtectedValue(baseObjectResult);
        const singleLevelData = getOptionallyProtectedValue(singleLevelResult);
        const wholeSubtreeData = getOptionallyProtectedValue(wholeSubtreeResult);
        assert("searchInfo" in baseObjectData);
        assert("searchInfo" in singleLevelData);
        assert("searchInfo" in wholeSubtreeData);
        expect(baseObjectData.searchInfo.entries).toHaveLength(1);
        expect(singleLevelData.searchInfo.entries).toHaveLength(3);
        expect(wholeSubtreeData.searchInfo.entries).toHaveLength(4);
    });

    // NOTE: partialNameResolution only applies to search and read operations.
    it("Read ServiceControlOptions.partialNameResolution", async () => {
        const testId = `Read.partialNameResolution-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const serviceControlOptions: ServiceControlOptions = new Uint8ClampedArray(
            Array(15).fill(FALSE_BIT));
        serviceControlOptions[ServiceControlOptions_partialNameResolution] = TRUE_BIT;
        const reqData: ReadArgumentData = new ReadArgumentData(
            {
                rdnSequence: [ ...dn, createTestRDN("does not exist") ],
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
        const resData = getOptionallyProtectedValue(decoded);
        const cn: EntryInformation_information_Item | undefined = resData.entry.information
            ?.find((einfo) => ("attribute" in einfo) && einfo.attribute.type_.isEqualTo(commonName["&id"]));
        assert(cn);
        assert("attribute" in cn);
        expect(cn.attribute.values[0]?.utf8String).toBe(testId);
    });

    it.skip("ServiceControlOptions.manageDSAIT", async () => {

    });

    it("Search ServiceControlOptions.noSubtypeMatch", async () => {
        const testId = `Search.noSubtypeMatch-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const subordinateWithSubordinates: string = "1ED2AD20-A11F-42EC-81CB-4D6843CA6ACD";
        const withSubordinatesDN: DistinguishedName = [ ...dn, createTestRDN(subordinateWithSubordinates) ];
        const subordinates = [
            subordinateWithSubordinates,
        ];
        const subordinates2 = [
            "0113FF8E-0107-4468-AE19-415DEEB0C5B7",
            "F601D2D2-9B45-4068-9A4F-55FF18E3215D",
            "201A2FE2-6D48-4E2B-A925-5275F2D56F39",
        ];
        await Promise.all(subordinates.map((id) => createTestNode(connection!, dn, id, [
            new Attribute(
                administrativeRole["&id"],
                [
                    _encodeObjectIdentifier(id_ar_autonomousArea, DER),
                ],
                undefined,
            ),
        ])));
        await Promise.all(subordinates2.map((id) => createTestNode(connection!, withSubordinatesDN, id)));
        const search_ = (noSubtypeMatch: typeof TRUE_BIT | typeof FALSE_BIT) => {
            const serviceControlOptions: ServiceControlOptions = new Uint8ClampedArray(
                Array(15).fill(FALSE_BIT));
            serviceControlOptions[ServiceControlOptions_noSubtypeMatch] = noSubtypeMatch;
            const reqData: SearchArgumentData = new SearchArgumentData(
                {
                    rdnSequence: withSubordinatesDN,
                },
                SearchArgumentData_subset_baseObject,
                {
                    item: {
                        equality: new AttributeValueAssertion(
                            name["&id"],
                            utf8(subordinateWithSubordinates),
                        ),
                    },
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
                new ServiceControls(
                    serviceControlOptions,
                ),
            );
            const arg: SearchArgument = {
                unsigned: reqData,
            };
            return writeOperation(
                connection!,
                search["&operationCode"]!,
                _encode_SearchArgument(arg, DER),
            );
        };
        const withSubtypeMatchingResponse = await search_(FALSE_BIT);
        const withoutSubtypeMatchingResponse = await search_(TRUE_BIT);
        assert("result" in withSubtypeMatchingResponse);
        assert("result" in withoutSubtypeMatchingResponse);
        assert(withSubtypeMatchingResponse.result);
        assert(withoutSubtypeMatchingResponse.result);
        const withSubtypeMatchingResult = _decode_SearchResult(withSubtypeMatchingResponse.result);
        const withoutSubtypeMatchingResult = _decode_SearchResult(withoutSubtypeMatchingResponse.result);
        const withSubtypeMatchingData = getOptionallyProtectedValue(withSubtypeMatchingResult);
        const withoutSubtypeMatchingData = getOptionallyProtectedValue(withoutSubtypeMatchingResult);
        assert("searchInfo" in withSubtypeMatchingData);
        assert("searchInfo" in withoutSubtypeMatchingData);
        expect(withSubtypeMatchingData.searchInfo.entries).toHaveLength(1);
        expect(withoutSubtypeMatchingData.searchInfo.entries).toHaveLength(0);
    });

    it("Search ServiceControlOptions.noSubtypeSelection", async () => {
        const testId = `Search.noSubtypeSelection-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const search_ = (noSubtypeSelection: typeof TRUE_BIT | typeof FALSE_BIT) => {
            const serviceControlOptions: ServiceControlOptions = new Uint8ClampedArray(
                Array(15).fill(FALSE_BIT));
            serviceControlOptions[ServiceControlOptions_noSubtypeSelection] = noSubtypeSelection;
            const reqData: SearchArgumentData = new SearchArgumentData(
                {
                    rdnSequence: dn,
                },
                SearchArgumentData_subset_baseObject,
                undefined,
                undefined,
                new EntryInformationSelection(
                    {
                        select: [ name["&id"] ],
                    },
                ),
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
                new ServiceControls(
                    serviceControlOptions,
                ),
            );
            const arg: SearchArgument = {
                unsigned: reqData,
            };
            return writeOperation(
                connection!,
                search["&operationCode"]!,
                _encode_SearchArgument(arg, DER),
            );
        };
        const withSubtypeResponse = await search_(FALSE_BIT);
        const withoutSubtypeResponse = await search_(TRUE_BIT);
        assert("result" in withSubtypeResponse);
        assert("result" in withoutSubtypeResponse);
        assert(withSubtypeResponse.result);
        assert(withoutSubtypeResponse.result);
        const withSubtypeResult = _decode_SearchResult(withSubtypeResponse.result);
        const withoutSubtypeResult = _decode_SearchResult(withoutSubtypeResponse.result);
        const withSubtypeData = getOptionallyProtectedValue(withSubtypeResult);
        const withoutSubtypeData = getOptionallyProtectedValue(withoutSubtypeResult);
        assert("searchInfo" in withSubtypeData);
        assert("searchInfo" in withoutSubtypeData);
        expect(withSubtypeData.searchInfo.entries).toHaveLength(1);
        expect(withoutSubtypeData.searchInfo.entries).toHaveLength(1);
        expect(withSubtypeData.searchInfo.entries[0].information
            ?.some((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(commonName["&id"]))).toBeTruthy();
        expect(withoutSubtypeData.searchInfo.entries[0].information
            ?.some((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(commonName["&id"]))).toBeFalsy();
    });

    it("Read ServiceControlOptions.noSubtypeSelection", async () => {
        const testId = `Read.noSubtypeSelection-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const read_ = (noSubtypeSelection: typeof TRUE_BIT | typeof FALSE_BIT) => {
            const serviceControlOptions: ServiceControlOptions = new Uint8ClampedArray(
                Array(15).fill(FALSE_BIT));
            serviceControlOptions[ServiceControlOptions_noSubtypeSelection] = noSubtypeSelection;
            const reqData: ReadArgumentData = new ReadArgumentData(
                {
                    rdnSequence: dn,
                },
                new EntryInformationSelection(
                    {
                        select: [ name["&id"] ],
                    },
                ),
                undefined,
                [],
                new ServiceControls(
                    serviceControlOptions,
                ),
            );
            const arg: ReadArgument = {
                unsigned: reqData,
            };
            return writeOperation(
                connection!,
                read["&operationCode"]!,
                _encode_ReadArgument(arg, DER),
            );
        };
        const withSubtypeResponse = await read_(FALSE_BIT);
        const withoutSubtypeResponse = await read_(TRUE_BIT);
        assert("result" in withSubtypeResponse);
        /**
         * If returned data.length === 0, read throws.
         */
        assert("error" in withoutSubtypeResponse);
        assert(withSubtypeResponse.result);
        // assert(withoutSubtypeResponse.result);
        const withSubtypeResult = _decode_ReadResult(withSubtypeResponse.result);
        // const withoutSubtypeResult = _decode_ReadResult(withoutSubtypeResponse.result);
        const withSubtypeData = getOptionallyProtectedValue(withSubtypeResult);
        // const withoutSubtypeData = getOptionallyProtectedValue(withoutSubtypeResult);
        expect(withSubtypeData.entry.information
            ?.some((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(commonName["&id"]))).toBeTruthy();
        // expect(withoutSubtypeData.entry.information
        //     ?.some((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(commonName["&id"]))).toBeFalsy();
    });

    it("ModifyEntry ServiceControlOptions.noSubtypeSelection", async () => {
        const testId = `ModifyEntry.noSubtypeSelection-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const search_ = (noSubtypeSelection: typeof TRUE_BIT | typeof FALSE_BIT) => {
            const desc = _encode_UnboundedDirectoryString({
                uTF8String: `Entry successfully modified. noSubtypeSelection = ${noSubtypeSelection}.`,
            }, DER);
            const serviceControlOptions: ServiceControlOptions = new Uint8ClampedArray(
                Array(15).fill(FALSE_BIT));
            serviceControlOptions[ServiceControlOptions_noSubtypeSelection] = noSubtypeSelection;
            const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
                {
                    rdnSequence: dn,
                },
                [
                    {
                        addValues: new Attribute(
                            description["&id"],
                            [desc],
                            undefined,
                        ),
                    },
                ],
                new EntryInformationSelection(
                    {
                        select: [ name["&id"] ],
                    },
                ),
                undefined,
                new ServiceControls(
                    serviceControlOptions,
                ),
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
        const withSubtypeResponse = await search_(FALSE_BIT);
        const withoutSubtypeResponse = await search_(TRUE_BIT);
        assert("result" in withSubtypeResponse);
        assert("result" in withoutSubtypeResponse);
        assert(withSubtypeResponse.result);
        assert(withoutSubtypeResponse.result);
        const withSubtypeResult = _decode_ModifyEntryResult(withSubtypeResponse.result);
        const withoutSubtypeResult = _decode_ModifyEntryResult(withoutSubtypeResponse.result);
        assert("information" in withSubtypeResult);
        assert("information" in withoutSubtypeResult);
        const withSubtypeData = getOptionallyProtectedValue(withSubtypeResult.information);
        const withoutSubtypeData = getOptionallyProtectedValue(withoutSubtypeResult.information);
        expect(withSubtypeData.entry?.information
            ?.some((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(commonName["&id"]))).toBeTruthy();
        expect(withoutSubtypeData.entry?.information
            ?.some((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(commonName["&id"]))).toBeFalsy();
    });

    it("ServiceControlOptions.countFamily", async () => {
        const testId = `ServiceControlOptions.countFamily-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId);
            await createCompoundEntry(connection!, dn);
        }
        const subordinates = [
            "E338ECE9-0100-4499-BEEE-2F3F766B669C",
            "837DF269-2A2A-47E6-BA19-3FC65D5D3FA7",
            "6AF6F47F-8432-4CBE-9F2F-7C8C56D4F70A",
        ];
        const sizeLimit: number = subordinates.length - 2;
        await Promise.all(subordinates.map((id) => createTestNode(connection!, dn, id)));
        const search_ = (countFamily: typeof TRUE_BIT | typeof FALSE_BIT) => {
            const serviceControlOptions: ServiceControlOptions = new Uint8ClampedArray(
                Array(15).fill(FALSE_BIT));
            serviceControlOptions[ServiceControlOptions_countFamily] = countFamily;
            const reqData: SearchArgumentData = new SearchArgumentData(
                {
                    rdnSequence: dn,
                },
                SearchArgumentData_subset_oneLevel,
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
                new ServiceControls(
                    serviceControlOptions,
                    undefined,
                    undefined,
                    sizeLimit,
                ),
            );
            const arg: SearchArgument = {
                unsigned: reqData,
            };
            return writeOperation(
                connection!,
                search["&operationCode"]!,
                _encode_SearchArgument(arg, DER),
            );
        };
        const defaultResponse = await search_(FALSE_BIT);
        const countFamilyResponse = await search_(TRUE_BIT);
        assert("result" in defaultResponse);
        assert("result" in countFamilyResponse);
        assert(defaultResponse.result);
        assert(countFamilyResponse.result);
        const defaultResult = _decode_SearchResult(defaultResponse.result);
        const countFamilyResult = _decode_SearchResult(countFamilyResponse.result);
        const defaultData = getOptionallyProtectedValue(defaultResult);
        const countFamilyData = getOptionallyProtectedValue(countFamilyResult);
        assert("searchInfo" in defaultData);
        assert("searchInfo" in countFamilyData);
        expect(defaultData.searchInfo.entries).toHaveLength(sizeLimit);
        expect(countFamilyData.searchInfo.entries).toHaveLength(1);
    });

    // TODO: Do this for read and modifyEntry too.
    it("ServiceControlOptions.dontSelectFriends", async () => {
        const testId = `ServiceControlOptions.dontSelectFriends-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_subschemaAdminSpecificArea)],
                    undefined,
                ),
            ]);
        }
        const subordinates = [
            "E338ECE9-0100-4499-BEEE-2F3F766B669C",
        ];
        await Promise.all(subordinates.map((id) => createTestNode(connection!, dn, id, [
            new Attribute(
                description["&id"],
                [utf8(`Description for ${id}`)],
                undefined,
            ),
        ])));
        const subentryRDN: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("hello"),
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
                        oid(subschema["&id"]),
                    ],
                    undefined,
                ),
                new Attribute(
                    commonName["&id"],
                    [
                        utf8("hello"),
                    ],
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
                    friends["&id"],
                    [
                        _encode_FriendsDescription(new FriendsDescription(
                            commonName["&id"],
                            [
                                {
                                    uTF8String: "DELETEME",
                                },
                            ],
                            {
                                uTF8String: "Test name-form. Please delete.",
                            },
                            false,
                            [
                                description["&id"],
                            ],
                            [],
                        ), DER),
                    ],
                    undefined,
                ),
            ],
        );
        const search_ = (dontSelectFriends: typeof TRUE_BIT | typeof FALSE_BIT) => {
            const serviceControlOptions: ServiceControlOptions = new Uint8ClampedArray(
                Array(15).fill(FALSE_BIT));
            serviceControlOptions[ServiceControlOptions_dontSelectFriends] = dontSelectFriends;
            const reqData: SearchArgumentData = new SearchArgumentData(
                {
                    rdnSequence: dn,
                    // rdnSequence: [ ...dn, createTestRDN("E338ECE9-0100-4499-BEEE-2F3F766B669C") ],
                },
                SearchArgumentData_subset_oneLevel,
                undefined,
                undefined,
                new EntryInformationSelection(
                    { // We select only commonName, but if the friendship
                        // created above works, the results should also include
                        // the description.
                        select: [ commonName["&id"] ],
                    },
                ),
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
                new ServiceControls(
                    serviceControlOptions,
                ),
            );
            const arg: SearchArgument = {
                unsigned: reqData,
            };
            return writeOperation(
                connection!,
                search["&operationCode"]!,
                _encode_SearchArgument(arg, DER),
            );
        };
        const defaultResponse = await search_(FALSE_BIT);
        const noFriendsResponse = await search_(TRUE_BIT);
        assert("result" in defaultResponse);
        assert("result" in noFriendsResponse);
        assert(defaultResponse.result);
        assert(noFriendsResponse.result);
        const defaultResult = _decode_SearchResult(defaultResponse.result);
        const noFriendsResult = _decode_SearchResult(noFriendsResponse.result);
        const defaultData = getOptionallyProtectedValue(defaultResult);
        const noFriendsData = getOptionallyProtectedValue(noFriendsResult);
        assert("searchInfo" in defaultData);
        assert("searchInfo" in noFriendsData);
        expect(defaultData.searchInfo.entries).toHaveLength(subordinates.length);
        expect(noFriendsData.searchInfo.entries).toHaveLength(subordinates.length);
        for (const entry of defaultData.searchInfo.entries) {
            const descriptionPresent: boolean = entry.information
                ?.some((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(description["&id"])) ?? false;
            expect(descriptionPresent).toBeTruthy();
        }
        for (const entry of noFriendsData.searchInfo.entries) {
            const descriptionPresent: boolean = entry.information
                ?.some((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(description["&id"])) ?? false;
            expect(descriptionPresent).toBeFalsy();
        }
    });

    // TODO:
    it.only("ServiceControlOptions.dontMatchFriends", async () => {
        const testId = `ServiceControlOptions.dontMatchFriends-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [oid(id_ar_subschemaAdminSpecificArea)],
                    undefined,
                ),
            ]);
        }
        const soughtId: string = "E338ECE9-0100-4499-BEEE-2F3F766B669C";
        const subordinates = [
            soughtId,
        ];
        await Promise.all(subordinates.map((id) => createTestNode(connection!, dn, id, [
            new Attribute(
                description["&id"],
                [utf8(`description-${id}`)],
                undefined,
            ),
        ])));
        const subentryRDN: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("hello"),
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
                        oid(subschema["&id"]),
                    ],
                    undefined,
                ),
                new Attribute(
                    commonName["&id"],
                    [
                        utf8("hello"),
                    ],
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
                    friends["&id"],
                    [
                        _encode_FriendsDescription(new FriendsDescription(
                            commonName["&id"],
                            [
                                {
                                    uTF8String: "DELETEME",
                                },
                            ],
                            {
                                uTF8String: "Test name-form. Please delete.",
                            },
                            false,
                            [
                                description["&id"],
                            ],
                            [],
                        ), DER),
                    ],
                    undefined,
                ),
            ],
        );
        const search_ = (dontMatchFriends: typeof TRUE_BIT | typeof FALSE_BIT) => {
            const serviceControlOptions: ServiceControlOptions = new Uint8ClampedArray(
                Array(15).fill(FALSE_BIT));
            serviceControlOptions[ServiceControlOptions_dontMatchFriends] = dontMatchFriends;
            const reqData: SearchArgumentData = new SearchArgumentData(
                {
                    rdnSequence: dn,
                },
                SearchArgumentData_subset_oneLevel,
                {
                    item: {
                        equality: new AttributeValueAssertion(
                            commonName["&id"],
                            utf8(`description-${soughtId}`),
                        ),
                    },
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
                new ServiceControls(
                    serviceControlOptions,
                ),
            );
            const arg: SearchArgument = {
                unsigned: reqData,
            };
            return writeOperation(
                connection!,
                search["&operationCode"]!,
                _encode_SearchArgument(arg, DER),
            );
        };
        const defaultResponse = await search_(FALSE_BIT);
        const noFriendsResponse = await search_(TRUE_BIT);
        assert("result" in defaultResponse);
        assert("result" in noFriendsResponse);
        assert(defaultResponse.result);
        assert(noFriendsResponse.result);
        const defaultResult = _decode_SearchResult(defaultResponse.result);
        const noFriendsResult = _decode_SearchResult(noFriendsResponse.result);
        const defaultData = getOptionallyProtectedValue(defaultResult);
        const noFriendsData = getOptionallyProtectedValue(noFriendsResult);
        assert("searchInfo" in defaultData);
        assert("searchInfo" in noFriendsData);
        expect(defaultData.searchInfo.entries).toHaveLength(1);
        expect(noFriendsData.searchInfo.entries).toHaveLength(0);
    });

    it.skip("ServiceControlOptions.allowWriteableCopy", async () => {

    });

    it("An entry with a multi-valued RDN can be found", async () => {
        const testId = `Find multi-valued RDN-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const mvRDN: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("asdf"),
            ),
            new AttributeTypeAndValue(
                description["&id"],
                utf8("qwer"),
            ),
        ];
        await createEntry(
            connection!,
            dn,
            mvRDN,
            [
                new Attribute(
                    objectClass["&id"],
                    [oid(applicationProcess["&id"])],
                    undefined,
                ),
                new Attribute(
                    commonName["&id"],
                    [utf8("asdf")],
                    undefined,
                ),
                new Attribute(
                    description["&id"],
                    [utf8("qwer")],
                    undefined,
                ),
            ],
        );
        const reqData: ReadArgumentData = new ReadArgumentData(
            {
                rdnSequence: [ ...dn, mvRDN ],
            },
            undefined,
            undefined,
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
    });

    it.skip("An autonomous administrative point resets all applicable administrative points", async () => {

    });

    it.skip("Context Assertion Defaults are applied from the applicable administrative points", async () => {

    });

    it.skip("Wide DITs do not take too long to search", async () => {

    });

    it.skip("Tall DITs do not take too long to search", async () => {

    });

    it.skip("Search with FamilyGrouping.entryOnly", async () => {

    });

    it.skip("Compare with FamilyGrouping.entryOnly", async () => {

    });

    it.skip("RemoveEntry with FamilyGrouping.entryOnly", async () => {

    });

    it.skip("Search with FamilyGrouping.compoundEntry", async () => {

    });

    it.skip("Compare with FamilyGrouping.compoundEntry", async () => {

    });

    it.skip("RemoveEntry with FamilyGrouping.compoundEntry", async () => {

    });

    it.skip("Search with FamilyGrouping.strands", async () => {

    });

    it.skip("Compare with FamilyGrouping.strands", async () => {

    });

    it.skip("RemoveEntry with FamilyGrouping.strands", async () => {

    });

    it.skip("Search with FamilyGrouping.multiStrand", async () => {

    });

    it.skip("Compare with FamilyGrouping.multiStrand", async () => {

    });

    it.skip("RemoveEntry with FamilyGrouping.multiStrand", async () => {

    });

    it.skip("ServiceControls.timeLimit is respected", async () => {

    });

    it.skip("ServiceControls.sizeLimit is respected by list operation", async () => {

    });

    it.skip("ServiceControls.sizeLimit is respected by search operation", async () => {

    });

    it.skip("ServiceControls.attributeSizeLimit is respected", async () => {

    });

    it.skip("EntryInformationSelection.infoTypes recurses into family information", async () => {

    });

    it.skip("Directory bind with correct simple credentials permits access", async () => {

    });

    it.skip("Directory bind with incorrect simple credentials denies access", async () => {

    });

    it.skip("Directory bind does not reveal which objects exist by displaying a different error message when the bind DN is wrong than when the password is wrong", async () => {

    });

    it.skip("Collective attributes appear in entries within a collective attribute specific area", async () => {

    });

    it.skip("Collective attributes appear in entries within a collective attribute inner area", async () => {

    });

    it.skip("Collective attributes are excluded via collectiveExclusions", async () => {

    });

    it.skip("Subordinate collective attribute specific administrative points override a superior collective attribute specific administrative point", async () => {

    });

    it.skip("Subordinate access control specific administrative points override a superior access control specific administrative point", async () => {

    });

    it.skip("Subordinate subschema administrative points override a superior subschema administrative point", async () => {

    });

    it.skip("Subordinate CAD administrative points override a superior CAD administrative point", async () => {

    });

    it.skip("Requests are rejected when the DSA is hibernating", async () => {

    });

    it.skip("A superior DSA can establish an HOB", async () => {

    });

    it.skip("A subordinate DSA can accept an HOB", async () => {

    });

    it.skip("A modification to a subordinate DSA's context prefix updates the superior DSA (Technically not required by X.500 standards)", async () => {

    });

    it.skip("A modification to a subordinate DSA's subentry under the context prefix updates the superior DSA (Technically not required by X.500 standards)", async () => {

    });

    it.skip("A modification to a context prefix's name or location results in an update to the superior DSA in an HOB", async () => {

    });

    it.skip("A modification to a context prefix's subentry's name or location results in an update to the superior DSA in an HOB", async () => {

    });

    it.skip("A modification to a context prefix results in an update to the superior DSA in an HOB", async () => {

    });

    it.skip("A modification to a context prefix's subentry results in an update to the superior DSA in an HOB", async () => {

    });

    it.skip("A deletion of a context prefix's subentries results in an update to the superior DSA in an HOB", async () => {

    });

    it.skip("A deletion of a context prefix results in a termination of the superior HOB", async () => {

    });

    it.skip("An update to an administrative point above an HOB or NHOB will correctly update the subordinate DSA(s)", async () => {

    });

    it.skip("An HOB context prefix update is rejected if the old agreement names a context prefix that cannot be found", async () => {

    });

    it.skip("An HOB context prefix update is rejected if the old agreement names a context prefix that has no superior", async () => {

    });

    it.skip("An HOB context prefix update is rejected if it updates entries from a 'grandfather' naming context that belongs to the subordinate DSA (or these updates are just ignored)", async () => {

    });

    it.skip("An HOB update that attempts to update a 'subr' DSE that is not really a 'subr' will be rejected", async () => {

    });

    it.skip("An HOB that attempts to create a context prefix that contains an alias or subentry will be automatically rejected", async () => {

    });

    it.skip("An HOB that attempts to update a context prefix such that it contains an alias or subentry will be automatically rejected", async () => {

    });

    it.skip("An HOB that attempts to create an agreement that differs from the context prefix info will be automatically rejected", async () => {

    });

    it.skip("An HOB that attempts to modify an agreement such that it differs from the context prefix info will be automatically rejected", async () => {

    });

    it.skip("Operational bindings cannot be created with identifiers that are already in use", async () => {

    });

    it.skip("Operational binding updates that use an operational binding identifier that is not in use are rejected", async () => {

    });

    it.skip("Operational binding updates with a version number that is less than the current version number are rejected automatically", async () => {

    });

    it.skip("Roles cannot be reversed in a modification HOB", async () => {

    });

    it.skip("A nefarious DSA cannot update an operational binding without authenticating as the exact same principal as the one that created the operational binding", async () => {

    });

    it.skip("A nefarious DSA cannot delete an operational binding without authenticating as the exact same principal as the one that created the operational binding", async () => {

    });

    it.skip("An entry modification is not allowed to happen to a DSE of type shadow", async () => {

    });

    it.skip("An denial of service does not happen at the IDM layer if single-byte packets are sent", async () => {

    });

    it.skip("The DSA refuses an excessive number of connections from the same remote address", async () => {

    });

    it.skip("Memory leaks do not occur", async () => {

    });

    it.skip("An idle IDM socket is eventually closed", async () => {

    });

    it.skip("An idle TCP socket is eventually closed", async () => {

    });

    it.skip("An idle LDAP connection is eventually closed", async () => {

    });

    it.skip("StartTLS cannot be used to recursively encapsulate traffic", async () => {

    });

    it.skip("An invalid password attempt increments the number of password failures", async () => {

    });

    it.skip("An valid password attempt resets the number of password failures to 0", async () => {

    });

    it.skip("An invalid password attempt updates the pwdFailureTime", async () => {

    });

    it.skip("The password is never returned in an entry", async () => {

    });

    it.skip("If an entry has hierarchical children its hierarchyBelow attribute has a value of TRUE", async () => {

    });

    it.skip("The hierarchyLevel attribute is always correct", async () => {

    });

    it.skip("A password's pwdStartTime attribute is set correctly", async () => {

    });

    it.skip("An entry's structural object class is calculated correctly", async () => {

    });

    it.skip("Chained read works", async () => {

    });

    it.skip("Chained compare works", async () => {

    });

    it.skip("Chained abandon works", async () => {

    });

    it.skip("Chained list works", async () => {

    });

    it.skip("Chained search works", async () => {

    });

    it.skip("Chained addEntry works", async () => {

    });

    it.skip("Chained removeEntry works", async () => {

    });

    it.skip("Chained modifyEntry works", async () => {

    });

    it.skip("Chained modifyDN works", async () => {

    });

    it.skip("Chained administerPassword works", async () => {

    });

    it.skip("Chained changePassword works", async () => {

    });

    it.todo("Hierarchy attributes update correctly when the hierarchy changes");
    it.todo("Alias attributes update correctly when aliases change."); // This might actually not be required.

});