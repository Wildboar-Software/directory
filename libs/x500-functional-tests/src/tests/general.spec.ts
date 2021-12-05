import { ASN1Element, FALSE_BIT, TRUE_BIT, ObjectIdentifier } from "asn1-ts";
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

    it.skip("Search", async () => {

    });

    // This test is unnecessary, because almost every test creates an entry for test data.
    it.skip("AddEntry", async () => {
        const testId = "498B3BC2-71F1-4B62-81B4-0E889D897A94";
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

    it.skip("ModifyEntry", async () => {
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

    it.skip("ModifyDN", async () => {
        const testId = `ModifyDN-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const newTestId = `ModifyDN-${(new Date()).toISOString()}`;
        const newDN = createTestRootDN(newTestId);
        const reqData: ModifyDNArgumentData = new ModifyDNArgumentData(
            dn,
            newDN[0],
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
        expect(("result" in result) && result.result).toBeTruthy();
    });

    // TODO: Bookmark
    it.skip("AdministerPassword", async () => {

    });

    it.skip("ChangePassword", async () => {

    });

    it.skip("Read.modifyRightsRequest", async () => {

    });

    it.skip("Read.selection", async () => {

    });

    it.skip("Read.selection.infoTypes", async () => {
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

    it.skip("Read.selection.contextSelection.selectedContexts.all", async () => {

    });

    it.skip("Read.selection.contextSelection.selectedContexts.preference", async () => {

    });

    it.skip("Read.selection.returnContexts", async () => {

    });

    it.skip("Read.selection.familyReturn.memberSelect.contributingEntriesOnly", async () => {

    });

    it.skip("Read.selection.familyReturn.memberSelect.participantingEntriesOnly", async () => {

    });

    it.skip("Read.selection.familyReturn.memberSelect.compoundEntry", async () => {

    });

    it.skip("Read.selection.familyReturn.familySelect", async () => {

    });

    it.skip("Compare works with attribute subtyping", async () => {

    });

    it.skip("Compare disables subtype matching if noSubtypeMatch SCO set", async () => {

    });

    it.skip("List.listFamily", async () => {

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

    it.skip("All protocol messages appear correct in Wireshark", async () => {

    });

    it.skip("An error is thrown when the hierarchyParent attribute refers to a DSE that is not within the same DSA", async () => {

    });

    it.skip("An error is thrown when the hierarchyParent attribute refers to a DSE that is not the ancestor of a compound entry", async () => {

    });

    it.skip("An error is thrown if an attribute is submitted with invalid syntax", async () => {

    });

    it.skip("An error is thrown if a value is added to an entry for which it already exists", async () => {

    });

    it.skip("An error is thrown when a context's syntax is invalid", async () => {

    });

    it.skip("An error is thrown if no invoke ID is specified in an abandon request", async () => {

    });

    it.skip("An error is thrown when a non-existent invocation is abandoned", async () => {

    });

    it.skip("An error is thrown when an operation is too far along to be abandoned (too late)", async () => {

    });

    it.skip("An error is thrown when an addEntry is attempted with no objectClass attribute specified", async () => {

    });

    it.skip("An error is thrown when an addEntry is attempted with an invalid set of object classes", async () => {

    });

    it.skip("An error is thrown when an addEntry is attempted with an object class of parent", async () => {

    });

    it.skip("An error is thrown if an added entry is of object class alias and child", async () => {

    });

    it.skip("An error is thrown if an added entry is of object class alias and parent", async () => {

    });

    it.skip("An error is thrown if an added entry is beneath an alias", async () => {

    });

    it.skip("An error is thrown if a subentry is added below a non-administrative point DSE", async () => {

    });

    it.skip("An error is thrown if a subentry is added to another DSA with the targetSystem option", async () => {

    });

    it.skip("An error is thrown if the Root DSE is attempted to be added", async () => {

    });

    it.skip("An error is thrown if an added entry is attempted to be added when it already exists", async () => {

    });

    it.skip("An error is thrown if an added entry has a hierarchyParent attribute and is a child of a compound entry", async () => {

    });

    it.skip("An error is thrown if an added entry contains unrecognized attribute types", async () => {

    });

    it.skip("An error is thrown if an added entry attempts to add an attribute type that is NO-USER-MODIFICATION", async () => {

    });

    it.skip("An error is thrown if an added entry attempts to add an attribute type that is DUMMY", async () => {

    });

    it.skip("An error is thrown if an added entry attempts to add an attribute type that is COLLECTIVE", async () => {

    });

    it.skip("An error is thrown if an added entry attempts to add an attribute type that is OBSOLETE", async () => {

    });

    it.skip("An error is thrown if an added entry has an unrecognized object class", async () => {

    });

    it.skip("An error is thrown if an added entry has an attribute not permitted by its object classes", async () => {

    });

    it.skip("An error is thrown if an added entry is missing a required attribute", async () => {

    });

    it.skip("An error is thrown when an added entry has a distinguished value with an invalid syntax", async () => {

    });

    it.skip("An error is thrown when an added entry's RDN has duplicated attribute types (not values)", async () => {

    });

    it.skip("An error is thrown when an added entry's RDN has an unrecognized attribute type", async () => {

    });

    it.skip("An error is thrown when an added entry's RDN has an attribute type that is prohibited in naming", async () => {

    });

    it.skip("An error is thrown when an added entry's RDN has values not actually present in the entry (Technically, the X.500 standards says the DSA can add these)", async () => {

    });

    it.skip("An error is thrown when an added entry is not permitted by any structural rules", async () => {

    });

    it.skip("An error is thrown when an added entry has an auxiliary object class not permitted by any DIT content rule", async () => {

    });

    it.skip("An error is thrown when an added entry has an attribute precluded by the relevant DIT content rules", async () => {

    });

    it.skip("An error is thrown when an added entry at the first level is not an administrative point", async () => {

    });

    it.skip("An error is thrown when an added entry is missing mandatory attributes required by DIT content rules", async () => {

    });

    it.skip("An error is thrown when an added entry has an auxiliary object class not explicitly permitted by any DIT content rules", async () => {

    });

    it.skip("An error is thrown when an added entry has contexts for an attribute type when there are no context use rules to permit it", async () => {

    });

    it.skip("An error is thrown when an added entry has contexts for an attribute type when there are no context use rules", async () => {

    });

    it.skip("An error is thrown when an added entry has an attribute value that is missing contexts required by context use rules", async () => {

    });

    it.skip("An error is thrown when an added entry contains non-userApplications attributes but the manageDSAIT flag is not set", async () => {

    });

    it.skip("An error is thrown when a loop is detected in distributed processing", async () => {

    });

    it.skip("An error is thrown when an added entry already exists within an NSSR", async () => {

    });

    it.skip("An error is thrown when a renamed entry already exists within an NSSR", async () => {

    });

    it.skip("An error is thrown if there is an unmet critical extension (See check suitability procedure)", async () => {

    });

    it.skip("An error is thrown when a compare operation is attempted on an attribute type having no equality matching rule defined", async () => {

    });

    it.skip("An error is thrown when a target object is not found", async () => {

    });

    it.skip("An error is thrown when an operation other than list or search targets the Root DSE", async () => {

    });

    it.skip("An error is thrown when some prefix of the target object is an alias and dontDereferenceAliases is set", async () => {

    });

    it.skip("An error is thrown when a subentry is encountered above the target object", async () => {

    });

    it.skip("An error is thrown when an invalid pageNumber is supplied for pagination in a list operation", async () => {

    });

    it.skip("An error is thrown when an invalid pageSize is supplied for pagination in a list operation", async () => {

    });

    it.skip("An error is thrown when an invalid queryReference is supplied for pagination in a list operation", async () => {

    });

    it.skip("An error is thrown when an invalid pageNumber is supplied for pagination in a search operation", async () => {

    });

    it.skip("An error is thrown when an invalid pageSize is supplied for pagination in a search operation", async () => {

    });

    it.skip("An error is thrown when an invalid queryReference is supplied for pagination in a search operation", async () => {

    });

    it.skip("An error is thrown when an entry is moved outside of the DSA", async () => {

    });

    it.skip("An error is thrown when an entry is moved under a new superior that is outside of the DSA", async () => {

    });

    it.skip("An error is thrown when a child entry is moved", async () => {

    });

    it.skip("An error is thrown when an attempt is made to move the Root DSE", async () => {

    });

    it.skip("An error is thrown when an attempt is made to move an entry under a non-existent new superior", async () => {

    });

    it.skip("An error is thrown when an attempt is made to move an entry that has subordinates not within this DSA", async () => {

    });

    it.skip("An error is thrown when an entry is renamed to have the DN of an entry that already exists", async () => {

    });

    it.skip("An error is thrown when a superior DSA refuses to rename a context prefix", async () => {

    });

    it.skip("An error is thrown when no DIT structural rules permit a rename", async () => {

    });

    it.skip("An error is thrown when an entry is moved to a section of the DIT in which one of its auxiliary object classes are not permitted", async () => {

    });

    it.skip("An error is thrown when an entry with auxiliary object classes is moved to a section of the DIT in which one no DIT content rules are defined", async () => {

    });

    it.skip("An error is thrown when an RDN attribute type requires contexts per the context use rules of the new DIT location after a rename", async () => {

    });

    it.skip("An error is thrown when attribute type of entry's new RDN after a rename is not permitted by one of its object classes", async () => {

    });

    it.skip("An error is thrown when attribute type of entry's new RDN after a rename is precluded by relevant DIT content rules", async () => {

    });

    it.skip("An error is thrown when a rename makes an entry both a hierarchical child and a child of a compound entry", async () => {

    });

    it.skip("An error is thrown when a rename adds an unrecognized attribute type to an entry's RDN", async () => {

    });

    it.skip("An error is thrown when a rename adds a value to an entry's RDN that has an invalid syntax for its type", async () => {

    });

    it.skip("An error is thrown when a rename uses a distinguished value that is not present in the entry", async () => {

    });

    it.skip("An error is thrown when a rename deletes the last value of a required attribute", async () => {

    });

    it.skip("An error is thrown when an entry modification adds an unrecognized attribute", async () => {

    });

    it.skip("An error is thrown when an entry modification adds an attribute value with an invalid syntax", async () => {

    });

    it.skip("An error is thrown when an entry modification adds an attribute that is precluded by DIT content rules", async () => {

    });

    it.skip("An error is thrown when an entry modification adds an attribute that is not permitted by object classes", async () => {

    });

    it.skip("An error is thrown when an entry modification deletes the last value of an attribute required by object classes", async () => {

    });

    it.skip("An error is thrown when an entry modification deletes the last value of an attribute required by DIT content rules", async () => {

    });

    it.skip("An error is thrown if a modified entry attempts to add an attribute type that is NO-USER-MODIFICATION", async () => {

    });

    it.skip("An error is thrown if a modified entry attempts to add an attribute type that is DUMMY", async () => {

    });

    it.skip("An error is thrown if a modified entry attempts to add an attribute type that is COLLECTIVE", async () => {

    });

    it.skip("An error is thrown if a modified entry attempts to add an attribute type that is OBSOLETE", async () => {

    });

    it.skip("An error is thrown when an entry modification deletes an attribute value used in the entry's RDN", async () => {

    });

    it.skip("An error is thrown when an entry modification adds an attribute value without contexts (and no default value for said contexts) when the DIT context rules require those contexts", async () => {

    });

    it.skip("An error is thrown when an entry modification adds an attribute value with contexts that are not permitted by DIT context rules", async () => {

    });

    it.skip("An error is thrown when an entry modification adds an unrecognized object class", async () => {

    });

    it.skip("An error is thrown when an entry modification would change an entry's structural object class", async () => {

    });

    it.skip("An error is thrown when an entry modification adds an auxiliary object class not permitted by DIT content rules", async () => {

    });

    it.skip("An error is thrown when an entry modification adds an object class that is invalid with respect to the other object classes", async () => {

    });

    it.skip("An error is thrown when an entry modification adds an object class of 'parent'", async () => {

    });

    it.skip("An error is thrown when an entry modification would make the entry have object classes of 'alias' and 'child'", async () => {

    });

    it.skip("An error is thrown when an entry modification would make the entry have object classes of 'alias' and 'parent'", async () => {

    });

    it.skip("An error is thrown when an entry modification would make the entry both a child of a compound entry and a member of a hierarchical group", async () => {

    });

    it.skip("An error is thrown when a read operation reads no attribute values", async () => {

    });

    it.skip("An error is thrown when a removeEntry operation would remove an entry that has non-child subordinates", async () => {

    });

    it.skip("An error is thrown when a removeEntry operation targets a non-ancestor of a compound entry when familyGrouping is set to compoundEntry", async () => {

    });

    it.skip("Requests are rejected when the DSA is hibernating", async () => {

    });

    it.skip("An error is thrown when an operational binding is attempted with the configured minimum authentication", async () => {

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
