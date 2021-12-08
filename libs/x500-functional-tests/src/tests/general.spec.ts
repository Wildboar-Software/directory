import { ASN1Element, FALSE_BIT, TRUE_BIT, ObjectIdentifier, OBJECT_IDENTIFIER } from "asn1-ts";
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
import type {
    DistinguishedName,
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

jest.setTimeout(10000);

const serviceControlOptions: ServiceControlOptions = new Uint8ClampedArray(
    Array(9).fill(FALSE_BIT));
// Necessary to make countries administrative points.
serviceControlOptions[ServiceControlOptions_manageDSAIT] = TRUE_BIT;
const serviceControls = new ServiceControls(
    serviceControlOptions,
    undefined,
    60,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
);

function frame (ber: ASN1Element): Buffer {
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

async function connect (): Promise<IDMConnection> {
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

function createAddEntryArguments (
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
    );
    const arg: AddEntryArgument = {
        unsigned: reqData,
    };
    return arg;
}

function createTestRootDN (
    testId: string,
): DistinguishedName {
    const encodedCN = _encode_UnboundedDirectoryString({
        uTF8String: testId,
    }, DER);
    return [
        [
            new AttributeTypeAndValue(
                commonName["&id"]!,
                encodedCN,
            ),
        ],
    ];
}

function writeOperation (
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

async function createTestRootNode (
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

async function createTestNode (
    connection: IDMConnection,
    superiorDN: DistinguishedName,
    id: string,
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

async function createEntry (
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
async function createCompoundEntry (
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
        [ ...superiorDN, parentRDN ],
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
        [ ...superiorDN, parentRDN ],
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
        [ ...superiorDN, parentRDN ],
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
        [ ...superiorDN, parentRDN ],
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
        [ ...superiorDN, parentRDN, level2A_rdn ],
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
        [ ...superiorDN, parentRDN, level2A_rdn ],
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

describe("Meerkat DSA", () => {

    let connection: IDMConnection | undefined;

    beforeEach(async () => {
        if (!connection) {
            connection = await connect();
        }
    });

    it("Server comes online", async () => {
        expect(connection).toBeTruthy();
    });

    it.skip("Server shuts down gracefully", async () => {

    });

    it.skip("Server checks for updates successfully", async () => {

    });

    it.skip("Server hibernates when the sentinel indicates a security issues", async () => {

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
            [],
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
                [],
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
            [],
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
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            [],
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
            [],
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
            [],
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
            [],
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
        );
        const arg: ModifyDNArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            modifyDN["&operationCode"]!,
            _encode_ModifyDNArgument(arg, DER),
        );
        if ("error" in result) {
            console.log(result.errcode);
            console.log(result.error);
        }
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
        if ("error" in result) {
            console.log(result.errcode);
            console.log(result.error);
        }
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
            [],
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
            [],
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
            localeID1: new ObjectIdentifier([ 1, 2, 3, 4, 5 ]),
        }, DER);
        const secondLocale: ASN1Element = _encode_LocaleContextSyntax({
            localeID1: new ObjectIdentifier([ 1, 2, 3, 4, 6 ]),
        }, DER);
        const thirdLocale: ASN1Element = _encode_LocaleContextSyntax({
            localeID1: new ObjectIdentifier([ 1, 2, 3, 4, 7 ]),
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
            [],
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
            expect(chosenLocale1.isEqualTo(new ObjectIdentifier([ 1, 2, 3, 4, 5 ]))).toBeTruthy();
            const chosenLocale2 = valuesWithContext[0].contextList[0].contextValues[1].objectIdentifier;
            expect(chosenLocale2.isEqualTo(new ObjectIdentifier([ 1, 2, 3, 4, 7 ]))).toBeTruthy();
        } else {
            expect(false).toBeTruthy();
        }
    });

    it("Read.selection.contextSelection.selectedContexts.preference", async () => {
        const testId = `Read.selection.contextSelection.selectedContexts.preference-${(new Date()).toISOString()}`;
        const firstPreferredLocale: ASN1Element = _encode_LocaleContextSyntax({
            localeID1: new ObjectIdentifier([ 1, 2, 3, 4, 5 ]),
        }, DER);
        const secondPreferredLocale: ASN1Element = _encode_LocaleContextSyntax({
            localeID1: new ObjectIdentifier([ 1, 2, 3, 4, 6 ]),
        }, DER);
        const thirdPreferredLocale: ASN1Element = _encode_LocaleContextSyntax({
            localeID1: new ObjectIdentifier([ 1, 2, 3, 4, 7 ]),
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
            [],
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
            expect(chosenLocale.isEqualTo(new ObjectIdentifier([ 1, 2, 3, 4, 6 ]))).toBeTruthy();
        } else {
            expect(false).toBeTruthy();
        }
    });

    it("Read.selection.returnContexts", async () => {
        const testId = `Read.selection.returnContexts-${(new Date()).toISOString()}`;
        const locale: ASN1Element = _encode_LocaleContextSyntax({
            localeID1: new ObjectIdentifier([ 1, 2, 3, 4, 5 ]),
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
                [],
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
                rdnSequence: [ ...dn, parentRDN ],
            },
            selection,
            undefined,
            [],
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

    it("Read.selection.familyReturn.memberSelect.participantingEntriesOnly", async () => {
        const testId = `Read...participantingEntriesOnly-${(new Date()).toISOString()}`;
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
                rdnSequence: [ ...dn, parentRDN ],
            },
            selection,
            undefined,
            [],
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
        const families = familyAttribute.attribute.values.map((f) =>  family_information.decoderFor["&Type"]!(f));
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
                rdnSequence: [ ...dn, parentRDN ],
            },
            selection,
            undefined,
            [],
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
        const families = familyAttribute.attribute.values.map((f) =>  family_information.decoderFor["&Type"]!(f));
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

    it.skip("Read.selection.familyReturn.familySelect", async () => {
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
                [organizationalUnit["&id"]],
            ),
        );
        const reqData: ReadArgumentData = new ReadArgumentData(
            {
                rdnSequence: [ ...dn, parentRDN ],
            },
            selection,
            undefined,
            [],
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
        const families = familyAttribute.attribute.values.map((f) =>  family_information.decoderFor["&Type"]!(f));
        const orgs = families.filter((f) => f.family_class.isEqualTo(organizationalUnit["&id"]));
        const people = families.filter((f) => f.family_class.isEqualTo(person["&id"]));
        const devices = families.filter((f) => f.family_class.isEqualTo(device["&id"]));
        expect(orgs).toHaveLength(1);
        expect(people).toHaveLength(0);
        expect(devices).toHaveLength(0);
        expect(orgs[0].familyEntries).toHaveLength(2);
    });

    it.skip("Compare works with attribute subtyping", async () => {

    });

    it.skip("Compare disables subtype matching if noSubtypeMatch SCO set", async () => {

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
            [],
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

    it.skip("List pagination works", async () => {

    });

    it.skip("List pagination reverse works", async () => {

    });

    it.skip("List pagination pageNumber works", async () => {

    });

    it.skip("List pagination sorting works", async () => {

    });

    it.skip("List pagination unmerged works", async () => {

    });

    it.skip("Search.subset.baseObject", async () => {

    });

    it.skip("Search.subset.oneLevel", async () => {

    });

    it.skip("Search.subset.wholeSubtree", async () => {

    });

    it.skip("Search.filter", async () => {

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

    it.skip("Search.selection", async () => {

    });

    it.skip("Search.selection.infoTypes", async () => {

    });

    it.skip("Search.selection.contextSelection.selectedContexts.all", async () => {

    });

    it.skip("Search.selection.contextSelection.selectedContexts.preference", async () => {

    });

    it.skip("Search.selection.returnContexts", async () => {

    });

    it.skip("Search.selection.familyReturn.memberSelect.contributingEntriesOnly", async () => {

    });

    it.skip("Search.selection.familyReturn.memberSelect.participantingEntriesOnly", async () => {

    });

    it.skip("Search.selection.familyReturn.memberSelect.compoundEntry", async () => {

    });

    it.skip("Search.selection.familyReturn.familySelect", async () => {

    });

    it.skip("Search pagination works", async () => {

    });

    it.skip("Search pagination reverse works", async () => {

    });

    it.skip("Search pagination pageNumber works", async () => {

    });

    it.skip("Search pagination sorting works", async () => {

    });

    it.skip("Search pagination unmerged works", async () => {

    });

    it.skip("AddEntry.targetSystem successfully initiates an HOB", async () => {

    });

    it.skip("ModifyEntry.changes.addAttribute", async () => {

    });

    it.skip("ModifyEntry.changes.removeAttribute", async () => {

    });

    it.skip("ModifyEntry.changes.addValues", async () => {

    });

    it.skip("ModifyEntry.changes.removeValues", async () => {

    });

    it.skip("ModifyEntry.changes.alterValues", async () => {

    });

    it.skip("ModifyEntry.changes.resetValue", async () => {

    });

    it.skip("ModifyEntry.changes.replaceValues", async () => {

    });

    it.skip("ModifyEntry.selection", async () => {

    });

    it.skip("ModifyEntry.selection.infoTypes", async () => {

    });

    it.skip("ModifyEntry.selection.contextSelection.selectedContexts.all", async () => {

    });

    it.skip("ModifyEntry.selection.contextSelection.selectedContexts.preference", async () => {

    });

    it.skip("ModifyEntry.selection.returnContexts", async () => {

    });

    it.skip("ModifyEntry.selection.familyReturn.memberSelect.contributingEntriesOnly", async () => {

    });

    it.skip("ModifyEntry.selection.familyReturn.memberSelect.participantingEntriesOnly", async () => {

    });

    it.skip("ModifyEntry.selection.familyReturn.memberSelect.compoundEntry", async () => {

    });

    it.skip("ModifyEntry.selection.familyReturn.familySelect", async () => {

    });

    it.skip("ModifyDN.newRDN", async () => {

    });

    it.skip("ModifyDN.deleteOldRDN", async () => {

    });

    it.skip("ModifyDN.newSuperior", async () => {

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

    it.skip("ServiceControlOptions.dontDereferenceAliases", async () => {

    });

    it.skip("ServiceControlOptions.subentries", async () => {

    });

    it.skip("ServiceControlOptions.copyShallDo", async () => {

    });

    it.skip("ServiceControlOptions.partialNameResolution", async () => {

    });

    it.skip("ServiceControlOptions.manageDSAIT", async () => {

    });

    it.skip("ServiceControlOptions.noSubtypeMatch", async () => {

    });

    it.skip("ServiceControlOptions.noSubtypeSelection", async () => {

    });

    it.skip("ServiceControlOptions.countFamily", async () => {

    });

    it.skip("ServiceControlOptions.dontSelectFriends", async () => {

    });

    it.skip("ServiceControlOptions.dontMatchFriends", async () => {

    });

    it.skip("ServiceControlOptions.allowWriteableCopy", async () => {

    });

    it.skip("An entry with a multi-valued RDN can be found", async () => {

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

});
