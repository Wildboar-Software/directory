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
    id_ar_collectiveAttributeSpecificArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-collectiveAttributeSpecificArea.va";
import {
    id_ar_collectiveAttributeInnerArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-collectiveAttributeInnerArea.va";
import {
    id_ar_subschemaAdminSpecificArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-subschemaAdminSpecificArea.va";
import {
    id_ar_contextDefaultSpecificArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-contextDefaultSpecificArea.va";
import * as crypto from "crypto";
import type { ResultOrError } from "@wildboar/x500/src/lib/types/ResultOrError";
import {
    ServiceControlOptions,
    // ServiceControlOptions_preferChaining,
    // ServiceControlOptions_chainingProhibited,
    // ServiceControlOptions_localScope,
    // ServiceControlOptions_dontUseCopy,
    ServiceControlOptions_dontDereferenceAliases,
    ServiceControlOptions_subentries,
    // ServiceControlOptions_copyShallDo,
    ServiceControlOptions_partialNameResolution,
    ServiceControlOptions_manageDSAIT,
    ServiceControlOptions_noSubtypeMatch,
    ServiceControlOptions_noSubtypeSelection,
    ServiceControlOptions_countFamily,
    ServiceControlOptions_dontSelectFriends,
    ServiceControlOptions_dontMatchFriends,
    // ServiceControlOptions_allowWriteableCopy,
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
import { friends } from "@wildboar/x500/src/lib/modules/SchemaAdministration/friends.oa";
import {
    FriendsDescription,
    _encode_FriendsDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/FriendsDescription.ta";
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
    collectiveOrganizationName,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/collectiveOrganizationName.oa";
import {
    collectiveOrganizationalUnitName,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/collectiveOrganizationalUnitName.oa";
import {
    collectiveLocalityName,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/collectiveLocalityName.oa";
import {
    collectiveExclusions,
} from "@wildboar/x500/src/lib/modules/InformationFramework/collectiveExclusions.oa";
import {
    contextAssertionDefaults,
} from "@wildboar/x500/src/lib/modules/InformationFramework/contextAssertionDefaults.oa";
import {
    contextAssertionSubentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/contextAssertionSubentry.oa";
import {
    hierarchyParent,
} from "@wildboar/x500/src/lib/modules/InformationFramework/hierarchyParent.oa";
import {
    hierarchyLevel,
} from "@wildboar/x500/src/lib/modules/InformationFramework/hierarchyLevel.oa";
import {
    hierarchyTop,
} from "@wildboar/x500/src/lib/modules/InformationFramework/hierarchyTop.oa";
import {
    hierarchyBelow,
} from "@wildboar/x500/src/lib/modules/InformationFramework/hierarchyBelow.oa";
import {
    caseIgnoreOrderingMatch,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/caseIgnoreOrderingMatch.oa";
import {
    userPwdClass,
} from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/userPwdClass.oa";
import {
    FamilyGrouping_compoundEntry,
    FamilyGrouping_entryOnly,
    FamilyGrouping_multiStrand,
    FamilyGrouping_strands,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FamilyGrouping.ta";

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

describe("Meerkat DSA", () => {

    let connection: IDMConnection | undefined;

    beforeEach(async () => {
        if (!connection) {
            connection = await connect();
        }
    });

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

    it("List.listFamily", async () => {
        const testId = `List.listFamily-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        const compoundEntryDN = [ ...dn, parentRDN ];
        { // Setup
            await createTestRootNode(connection!, testId);
            await createCompoundEntry(connection!, dn);
        }
        // We create subordinates that are not a part of the family.
        await Promise.all([
            "E338ECE9-0100-4499-BEEE-2F3F766B669C",
            "837DF269-2A2A-47E6-BA19-3FC65D5D3FA7",
            "6AF6F47F-8432-4CBE-9F2F-7C8C56D4F70A",
        ].map((id) => createTestNode(connection!, compoundEntryDN, id)));
        const reqData: ListArgumentData = new ListArgumentData(
            {
                rdnSequence: compoundEntryDN,
            },
            undefined,
            TRUE,
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
        const resData = getOptionallyProtectedValue(decoded);
        assert("listInfo" in resData);
        expect(resData.listInfo.subordinates.length).toBe(4);
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
                        caseIgnoreOrderingMatch["&id"], // commonName has no specified ordering rule.
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
                        caseIgnoreOrderingMatch["&id"], // commonName has no specified ordering rule.
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
                [ // pageNumber is ignored if there is no sorting.
                    new SortKey(
                        commonName["&id"],
                    ),
                ],
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

    it("Search.searchControlOptions.searchAliases", async () => {
        const testId = `searchControlOptions.searchAliases-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        // It's stupid to use this in the RDN, but alias is a _structural_ object class.
        const aliasRDN: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                objectClass["&id"],
                oid(alias["&id"]),
            ),
        ];
        const subordinateWithSubordinates: string = "1ED2AD20-A11F-42EC-81CB-4D6843CA6ACD";
        const grandchildrenDN: DistinguishedName = [
            ...dn,
            createTestRDN(subordinateWithSubordinates),
        ];
        const aliasedId: string = "E338ECE9-0100-4499-BEEE-2F3F766B669C";
        const aliasedDN: DistinguishedName = [
            ...dn,
            createTestRDN(aliasedId),
        ];
        const subordinates = [
            aliasedId,
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
        await Promise.all(subordinates2.map((id) => createTestNode(connection!, grandchildrenDN, id)));
        // This should be done after the aliased entry is created so you do not
        // get warnings about the aliased entry not existing.
        await createEntry( // Creates an alias that points to `subordinateWithSubordinates`.
            connection!,
            grandchildrenDN,
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
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: grandchildrenDN,
            },
            SearchArgumentData_subset_wholeSubtree,
            undefined,
            true,
            undefined,
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
        const resData = getOptionallyProtectedValue(decoded);
        assert("searchInfo" in resData);
        const foundAliased: boolean = resData.searchInfo.entries
            .some((e) => {
                const rdn = e.name.rdnSequence[e.name.rdnSequence.length - 1];
                return (rdn[0].value.utf8String === aliasedId);
            });
        expect(foundAliased).toBeTruthy();
    });

    it("Search.searchControlOptions.matchedValuesOnly", async () => {
        const testId = `searchControlOptions.matchedValuesOnly-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    commonName["&id"],
                    [
                        utf8("other"),
                        utf8("common"),
                        utf8("name"),
                        utf8("values"),
                    ],
                    undefined,
                ),
            ]);
        }
        const dn = createTestRootDN(testId);
        const searchControlOptions: SearchControlOptions = new Uint8ClampedArray(Array(12).fill(FALSE_BIT));
        searchControlOptions[SearchControlOptions_matchedValuesOnly] = TRUE_BIT;
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_baseObject,
            {
                item: {
                    equality: new AttributeValueAssertion(
                        commonName["&id"],
                        utf8(testId),
                    ),
                },
            },
            undefined,
            undefined,
            undefined,
            TRUE, // matchedValuesOnly
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            searchControlOptions,
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
        const resData = getOptionallyProtectedValue(decoded);
        assert("searchInfo" in resData);
        expect(resData.searchInfo.entries).toHaveLength(1);
        const entry = resData.searchInfo.entries[0];
        // Remember, matchedValuesOnly only filters out values of attributes
        // that contributed to the match, so this entry SHOULD contain more
        // attributes than just commonName.
        const cn = entry.information
            ?.find((attr) => ("attribute" in attr) && attr.attribute.type_.isEqualTo(commonName["&id"]));
        assert(cn);
        assert("attribute" in cn);
        expect(cn.attribute.values).toHaveLength(1); // Only one value matched.
    });

    it.skip("Search.searchControlOptions.checkOverspecified", async () => {

    });

    it.skip("Search.searchControlOptions.performExactly", async () => {

    });

    it.skip("Search.searchControlOptions.includeAllAreas", async () => {

    });

    it.skip("Search.searchControlOptions.noSystemRelaxation", async () => {

    });

    it("Search.searchControlOptions.dnAttribute", async () => {
        const testId = `searchControlOptions.dnAttribute-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const subordinateId: string = "E338ECE9-0100-4499-BEEE-2F3F766B669C";
        const subordinates = [
            subordinateId,
        ];
        await Promise.all(subordinates.map((id) => createTestNode(connection!, dn, id)));
        const subordinateRDN = createTestRDN(subordinateId);
        const searchControlOptions: SearchControlOptions = new Uint8ClampedArray(Array(12).fill(FALSE_BIT));
        searchControlOptions[SearchControlOptions_dnAttribute] = TRUE_BIT;
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: [ ...dn, subordinateRDN ],
            },
            SearchArgumentData_subset_baseObject,
            {
                item: {
                    equality: new AttributeValueAssertion(
                        commonName["&id"],
                        utf8(testId),
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
            searchControlOptions,
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
        const resData = getOptionallyProtectedValue(decoded);
        assert("searchInfo" in resData);
        expect(resData.searchInfo.entries).toHaveLength(1);
    });

    it("Search.searchControlOptions.matchOnResidualName", async () => {
        const testId = `searchControlOptions.matchOnResidualName-${(new Date()).toISOString()}`;
        const nonExistingSubordinateId: string = "E338ECE9-0100-4499-BEEE-2F3F766B669C";
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    commonName["&id"],
                    [utf8(nonExistingSubordinateId)],
                    undefined,
                ),
            ]);
        }
        const dn = createTestRootDN(testId);
        const subordinateRDN = createTestRDN(nonExistingSubordinateId);
        const serviceControlOptions: ServiceControlOptions = new Uint8ClampedArray(Array(15).fill(FALSE_BIT));
        serviceControlOptions[ServiceControlOptions_partialNameResolution] = TRUE_BIT;
        const searchControlOptions: SearchControlOptions = new Uint8ClampedArray(Array(12).fill(FALSE_BIT));
        searchControlOptions[SearchControlOptions_matchOnResidualName] = TRUE_BIT;
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: [ ...dn, subordinateRDN ],
            },
            SearchArgumentData_subset_baseObject,
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
            searchControlOptions,
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
        const response = await writeOperation(
            connection!,
            search["&operationCode"]!,
            _encode_SearchArgument(arg, DER),
        );
        assert("result" in response);
        assert(response.result);
        const decoded = _decode_SearchResult(response.result);
        const resData = getOptionallyProtectedValue(decoded);
        assert("searchInfo" in resData);
        expect(resData.searchInfo.entries).toHaveLength(1);
    });

    it("Search.searchControlOptions.entryCount", async () => {
        const testId = `Search.searchControlOptions.entryCount-${(new Date()).toISOString()}`;
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
        const searchControlOptions: SearchControlOptions = new Uint8ClampedArray(Array(12).fill(FALSE_BIT));
        searchControlOptions[SearchControlOptions_entryCount] = TRUE_BIT;
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_wholeSubtree,
            undefined,
            undefined,
            undefined,
            {
                newRequest: new PagedResultsRequest_newRequest(
                    pageSize,
                ),
            },
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            searchControlOptions,
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
        assert(resData.searchInfo.partialOutcomeQualifier?.entryCount);
        assert("exact" in resData.searchInfo.partialOutcomeQualifier.entryCount);
        expect(resData.searchInfo.partialOutcomeQualifier.entryCount.exact).toBe(20);
    });

    it.skip("Search.searchControlOptions.useSubset", async () => {

    });

    it("Search.searchControlOptions.separateFamilyMembers", async () => {
        const testId = `searchControlOptions.separateFamilyMembers-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId);
            await createCompoundEntry(connection!, dn);
        }
        const searchControlOptions: SearchControlOptions = new Uint8ClampedArray(Array(12).fill(FALSE_BIT));
        searchControlOptions[SearchControlOptions_separateFamilyMembers] = TRUE_BIT;
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: [ ...dn, parentRDN ],
            },
            SearchArgumentData_subset_wholeSubtree,
            undefined,
            undefined,
            new EntryInformationSelection(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                new FamilyReturn( // Without this, there will be no family information to return.
                    FamilyReturn_memberSelect_compoundEntry,
                ),
            ),
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            searchControlOptions,
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
        const resData = getOptionallyProtectedValue(decoded);
        assert("searchInfo" in resData);
        expect(resData.searchInfo.entries.length).toBeGreaterThan(1);

    });

    it("Search.searchControlOptions.searchFamily", async () => {
        const testId = `Search.searchControlOptions.entryCount-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId);
            await createCompoundEntry(connection!, dn);
        }
        const compoundDN = [...dn, parentRDN];
        const subordinatesLevel1: string[] = Array(2).fill("").map(() => crypto.randomUUID());
        await Promise.all(subordinatesLevel1.map((id) => createTestNode(connection!, compoundDN, id)));
        const encounteredOrNonFamily: Set<string> = new Set(subordinatesLevel1);
        const searchControlOptions: SearchControlOptions = new Uint8ClampedArray(Array(12).fill(FALSE_BIT));
        searchControlOptions[SearchControlOptions_searchFamily] = TRUE_BIT;
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: compoundDN,
            },
            SearchArgumentData_subset_wholeSubtree,
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
            searchControlOptions,
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
        expect(resData.searchInfo.entries.length).toBeGreaterThan(1);
        for (const entry of resData.searchInfo.entries) {
            const rdn = entry.name.rdnSequence[entry.name.rdnSequence.length - 1];
            const foundId: string = rdn[0].value.utf8String;
            expect(encounteredOrNonFamily.has(foundId)).toBeFalsy();
            encounteredOrNonFamily.add(foundId);
        }
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

    it("Search.selection.familyReturn.memberSelect.contributingEntriesOnly", async () => {
        const testId = `Search.contributingEntriesOnly-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId);
            await createCompoundEntry(connection!, dn);
        }
        const searchControlOptions: SearchControlOptions = new Uint8ClampedArray(Array(12).fill(FALSE_BIT));
        // We separate family members just to make it easier to count.
        searchControlOptions[SearchControlOptions_separateFamilyMembers] = TRUE_BIT;
        const selection = new EntryInformationSelection(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            new FamilyReturn(
                FamilyReturn_memberSelect_contributingEntriesOnly,
            ),
        );
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: [ ...dn, parentRDN ],
            },
            SearchArgumentData_subset_baseObject,
            {
                and: [
                    {
                        item: {
                            present: organizationName["&id"],
                        },
                    },
                    {
                        item: {
                            present: organizationalUnitName["&id"],
                        },
                    },
                ],
            },
            undefined,
            selection,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            searchControlOptions,
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
            undefined,
            FamilyGrouping_compoundEntry,
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
        const resData = getOptionallyProtectedValue(decoded);
        assert("searchInfo" in resData);
        expect(resData.searchInfo.entries).toHaveLength(3);
    });

    it("Search.selection.familyReturn.memberSelect.participatingEntriesOnly", async () => {
        const testId = `Search.participatingEntriesOnly-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId);
            await createCompoundEntry(connection!, dn);
        }
        const searchControlOptions: SearchControlOptions = new Uint8ClampedArray(Array(12).fill(FALSE_BIT));
        // We separate family members just to make it easier to count.
        searchControlOptions[SearchControlOptions_separateFamilyMembers] = TRUE_BIT;
        const selection = new EntryInformationSelection(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            new FamilyReturn(
                FamilyReturn_memberSelect_participatingEntriesOnly,
            ),
        );
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: [ ...dn, parentRDN ],
            },
            SearchArgumentData_subset_baseObject,
            {
                and: [
                    {
                        item: {
                            present: organizationName["&id"],
                        },
                    },
                    {
                        item: {
                            equality: new AttributeValueAssertion(
                                objectClass["&id"],
                                oid(device["&id"]),
                                undefined,
                            ),
                        },
                    },
                ],
            },
            undefined,
            selection,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            searchControlOptions,
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
            undefined,
            FamilyGrouping_strands,
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
        const resData = getOptionallyProtectedValue(decoded);
        assert("searchInfo" in resData);
        expect(resData.searchInfo.entries).toHaveLength(3);
    });

    it("Search.selection.familyReturn.memberSelect.compoundEntry", async () => {
        const testId = `Search.compoundEntry-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId);
            await createCompoundEntry(connection!, dn);
        }
        const searchControlOptions: SearchControlOptions = new Uint8ClampedArray(Array(12).fill(FALSE_BIT));
        // We separate family members just to make it easier to count.
        searchControlOptions[SearchControlOptions_separateFamilyMembers] = TRUE_BIT;
        const selection = new EntryInformationSelection(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            new FamilyReturn(
                FamilyReturn_memberSelect_compoundEntry,
            ),
        );
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: [ ...dn, parentRDN ],
            },
            SearchArgumentData_subset_baseObject,
            {
                and: [
                    {
                        item: {
                            present: organizationName["&id"],
                        },
                    },
                    {
                        item: {
                            equality: new AttributeValueAssertion(
                                objectClass["&id"],
                                oid(device["&id"]),
                                undefined,
                            ),
                        },
                    },
                ],
            },
            undefined,
            selection,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            searchControlOptions,
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
            undefined,
            FamilyGrouping_strands,
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
        const resData = getOptionallyProtectedValue(decoded);
        assert("searchInfo" in resData);
        expect(resData.searchInfo.entries).toHaveLength(7);
    });

    it("Search.selection.familyReturn.familySelect", async () => {
        const testId = `Search.selection.familyReturn.familySelect-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId);
            await createCompoundEntry(connection!, dn);
        }
        const searchControlOptions: SearchControlOptions = new Uint8ClampedArray(Array(12).fill(FALSE_BIT));
        // We separate family members just to make it easier to count.
        searchControlOptions[SearchControlOptions_separateFamilyMembers] = TRUE_BIT;
        const selection = new EntryInformationSelection(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            new FamilyReturn(
                FamilyReturn_memberSelect_contributingEntriesOnly,
                [device["&id"]],
            ),
        );
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: [ ...dn, parentRDN ],
            },
            SearchArgumentData_subset_baseObject,
            {
                and: [
                    {
                        item: {
                            present: organizationName["&id"],
                        },
                    },
                ],
            },
            undefined,
            selection,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            searchControlOptions,
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
            undefined,
            FamilyGrouping_entryOnly,
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
        const resData = getOptionallyProtectedValue(decoded);
        assert("searchInfo" in resData);
        /**
         * There should be four results: the ancestor node, which matches, the
         * two entries of class `device`, and the entry that lies between the
         * ancestor and one of the devices.
         */
        expect(resData.searchInfo.entries).toHaveLength(4);
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
                [ // pageNumber is ignored if there is no sorting.
                    new SortKey(
                        commonName["&id"],
                    ),
                ],
                undefined,
                undefined,
                3,
            ),
        });
        expect(qr1).toBeUndefined();
        expect(encountered.size).toBe(pageSize);
    });

    it("Search pagination sorting works", async () => {
        const testId = `Search.pagination.sorting-${(new Date()).toISOString()}`;
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
                const foundId: string = rdn[0].value.utf8String.toLowerCase();
                if (lastResult) {
                    expect([ lastResult, foundId ].sort()).toEqual([ lastResult, foundId ]);
                }
                expect(encountered.has(foundId)).toBeFalsy();
                encountered.add(foundId);
                lastResult = foundId;
            }
            return resData.searchInfo.partialOutcomeQualifier?.queryReference;
        };
        const qr1 = await nextPage({
            newRequest: new PagedResultsRequest_newRequest(
                pageSize,
                [
                    new SortKey(
                        commonName["&id"],
                        caseIgnoreOrderingMatch["&id"], // commonName has no specified ordering rule.
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

    it("Search pagination reverse works", async () => {
        const testId = `Search.pagination.reverse-${(new Date()).toISOString()}`;
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
                const foundId: string = rdn[0].value.utf8String.toLowerCase();
                if (lastResult) {
                    expect([ lastResult, foundId ].sort()).toEqual([ foundId, lastResult ]);
                }
                expect(encountered.has(foundId)).toBeFalsy();
                encountered.add(foundId);
                lastResult = foundId;
            }
            return resData.searchInfo.partialOutcomeQualifier?.queryReference;
        };
        const qr1 = await nextPage({
            newRequest: new PagedResultsRequest_newRequest(
                pageSize,
                [
                    new SortKey(
                        commonName["&id"],
                        caseIgnoreOrderingMatch["&id"], // commonName has no specified ordering rule.
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
        expect(encountered.size).toBe(pageSize * 4);
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

    it("ModifyEntry.changes.resetValue", async () => {
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

    it("ModifyEntry.changes.replaceValues", async () => {
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

    it("Search ServiceControlOptions.dontSelectFriends", async () => {
        const testId = `Search.dontSelectFriends-${(new Date()).toISOString()}`;
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

    it("Read ServiceControlOptions.dontSelectFriends", async () => {
        const testId = `Read.dontSelectFriends-${(new Date()).toISOString()}`;
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
        const do_ = (dontSelectFriends: typeof TRUE_BIT | typeof FALSE_BIT) => {
            const serviceControlOptions: ServiceControlOptions = new Uint8ClampedArray(
                Array(15).fill(FALSE_BIT));
            serviceControlOptions[ServiceControlOptions_dontSelectFriends] = dontSelectFriends;
            const reqData: ReadArgumentData = new ReadArgumentData(
                {
                    rdnSequence: [ ...dn, createTestRDN("E338ECE9-0100-4499-BEEE-2F3F766B669C") ],
                },
                new EntryInformationSelection(
                    {
                        select: [ commonName["&id"] ],
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
        const defaultResponse = await do_(FALSE_BIT);
        const noFriendsResponse = await do_(TRUE_BIT);
        assert("result" in defaultResponse);
        assert("result" in noFriendsResponse);
        assert(defaultResponse.result);
        assert(noFriendsResponse.result);
        const defaultResult = _decode_ReadResult(defaultResponse.result);
        const noFriendsResult = _decode_ReadResult(noFriendsResponse.result);
        const defaultData = getOptionallyProtectedValue(defaultResult);
        const noFriendsData = getOptionallyProtectedValue(noFriendsResult);
        {
            const descriptionPresent: boolean = defaultData.entry.information
                ?.some((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(description["&id"])) ?? false;
            expect(descriptionPresent).toBeTruthy();
        }
        {
            const descriptionPresent: boolean = noFriendsData.entry.information
                ?.some((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(description["&id"])) ?? false;
            expect(descriptionPresent).toBeFalsy();
        }
    });

    it("ModifyEntry ServiceControlOptions.dontSelectFriends", async () => {
        const testId = `ModifyEntry.dontSelectFriends-${(new Date()).toISOString()}`;
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
        const do_ = (dontSelectFriends: typeof TRUE_BIT | typeof FALSE_BIT) => {
            const serviceControlOptions: ServiceControlOptions = new Uint8ClampedArray(
                Array(15).fill(FALSE_BIT));
            serviceControlOptions[ServiceControlOptions_dontSelectFriends] = dontSelectFriends;
            const desc = _encode_UnboundedDirectoryString({
                uTF8String: `Entry successfully modified. dontSelectFriends: ${dontSelectFriends}`,
            }, DER);
            const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
                {
                    rdnSequence: [ ...dn, createTestRDN("E338ECE9-0100-4499-BEEE-2F3F766B669C") ],
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
                        select: [ commonName["&id"] ],
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
        const defaultResponse = await do_(FALSE_BIT);
        const noFriendsResponse = await do_(TRUE_BIT);
        assert("result" in defaultResponse);
        assert("result" in noFriendsResponse);
        assert(defaultResponse.result);
        assert(noFriendsResponse.result);
        const defaultResult = _decode_ModifyEntryResult(defaultResponse.result);
        const noFriendsResult = _decode_ModifyEntryResult(noFriendsResponse.result);
        assert("information" in defaultResult);
        assert("information" in noFriendsResult);
        const defaultData = getOptionallyProtectedValue(defaultResult.information);
        const noFriendsData = getOptionallyProtectedValue(noFriendsResult.information);
        {
            const descriptionPresent: boolean = defaultData.entry?.information
                ?.some((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(description["&id"])) ?? false;
            expect(descriptionPresent).toBeTruthy();
        }
        {
            const descriptionPresent: boolean = noFriendsData.entry?.information
                ?.some((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(description["&id"])) ?? false;
            expect(descriptionPresent).toBeFalsy();
        }
    });

    it("ServiceControlOptions.dontMatchFriends", async () => {
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

    it("An autonomous administrative point resets all applicable administrative points", async () => {
        const testId = `aap-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [
                        oid(id_ar_collectiveAttributeSpecificArea),
                    ],
                    undefined,
                ),
            ]);
        }
        const dn = createTestRootDN(testId);
        const subentryRDN: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("foo"),
            ),
        ];
        const collectiveOrgName = "Illuminati";
        const subordinatesLevel1: string[] = Array(1).fill("").map(() => crypto.randomUUID());
        const subordinatesLevel2: string[] = Array(1).fill("").map(() => crypto.randomUUID());
        const subordinatesLevel3: string[] = Array(3).fill("").map(() => crypto.randomUUID());
        await Promise.all(subordinatesLevel1.map((id) => createTestNode(connection!, dn, id)));
        const leve1Id: string = subordinatesLevel1[0];
        const leve2Id: string = subordinatesLevel2[0];
        const level2DN: DistinguishedName = [ ...dn, createTestRDN(leve1Id) ];
        const level3DN: DistinguishedName = [ ...level2DN, createTestRDN(leve2Id) ];
        await Promise.all(subordinatesLevel2.map((id) => createTestNode(connection!, level2DN, id, [
            new Attribute(
                administrativeRole["&id"],
                [
                    oid(id_ar_autonomousArea),
                ],
                undefined,
            ),
        ])));
        await Promise.all(subordinatesLevel3.map((id) => createTestNode(connection!, level3DN, id)));
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
                        utf8("foo"),
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
                    collectiveOrganizationName["&id"],
                    [utf8(collectiveOrgName)],
                    undefined,
                ),
            ],
        );
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: level3DN,
            },
            SearchArgumentData_subset_oneLevel,
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
        const resData = getOptionallyProtectedValue(decoded);
        assert("searchInfo" in resData);
        for (const entry of resData.searchInfo.entries) {
            const isTheInheritedCollectiveAttribute = (info: EntryInformation_information_Item): boolean => (
                ("attribute" in info)
                && info.attribute.type_.isEqualTo(collectiveOrganizationName["&id"])
                && info.attribute.values.some((v) => v.utf8String === collectiveOrgName)
            );
            expect(entry.information?.some(isTheInheritedCollectiveAttribute)).toBeFalsy();
        }
    });

    it("Search with FamilyGrouping.entryOnly", async () => {
        const testId = `Search.familyGrouping.entryOnly-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId);
            await createCompoundEntry(connection!, dn);
        }
        const searchControlOptions: SearchControlOptions = new Uint8ClampedArray(Array(12).fill(FALSE_BIT));
        // We separate family members just to make it easier to count.
        searchControlOptions[SearchControlOptions_separateFamilyMembers] = TRUE_BIT;
        const selection = new EntryInformationSelection(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            new FamilyReturn(
                FamilyReturn_memberSelect_contributingEntriesOnly,
            ),
        );
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: [ ...dn, parentRDN ],
            },
            SearchArgumentData_subset_baseObject,
            {
                and: [
                    {
                        item: {
                            present: organizationalUnitName["&id"],
                        },
                    },
                ],
            },
            undefined,
            selection,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            searchControlOptions,
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
            undefined,
            FamilyGrouping_entryOnly,
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
        const resData = getOptionallyProtectedValue(decoded);
        assert("searchInfo" in resData);
        expect(resData.searchInfo.entries).toHaveLength(1);
    });

    it.skip("Compare with FamilyGrouping.entryOnly", async () => {
        // Already covered, because this is default.
    });

    it.skip("RemoveEntry with FamilyGrouping.entryOnly", async () => {
        // Already covered, because this is default.
    });

    it("Search with FamilyGrouping.compoundEntry", async () => {
        const testId = `Search.familyGrouping.compoundEntry-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId);
            await createCompoundEntry(connection!, dn);
        }
        const searchControlOptions: SearchControlOptions = new Uint8ClampedArray(Array(12).fill(FALSE_BIT));
        // We separate family members just to make it easier to count.
        searchControlOptions[SearchControlOptions_separateFamilyMembers] = TRUE_BIT;
        const selection = new EntryInformationSelection(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            new FamilyReturn(
                FamilyReturn_memberSelect_contributingEntriesOnly,
            ),
        );
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: [ ...dn, parentRDN ],
            },
            SearchArgumentData_subset_baseObject,
            {
                and: [
                    {
                        item: {
                            present: organizationName["&id"],
                        },
                    },
                    {
                        item: {
                            present: organizationalUnitName["&id"],
                        },
                    },
                ],
            },
            undefined,
            selection,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            searchControlOptions,
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
            undefined,
            FamilyGrouping_compoundEntry,
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
        const resData = getOptionallyProtectedValue(decoded);
        assert("searchInfo" in resData);
        // There will be 3 results, because there are two OUs in the compound entry.
        expect(resData.searchInfo.entries).toHaveLength(3);
    });

    it("Compare with FamilyGrouping.compoundEntry", async () => {
        const testId = `Compare.familyGrouping.strands-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId);
            await createCompoundEntry(connection!, dn);
        }
        const do_compare = async (purported: AttributeValueAssertion) => {
            const reqData: CompareArgumentData = new CompareArgumentData(
                {
                    rdnSequence: [ ...dn, parentRDN ],
                },
                purported,
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
                FamilyGrouping_compoundEntry,
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
        const shouldBeTrue: AttributeValueAssertion = new AttributeValueAssertion(
            objectClass["&id"],
            oid(device["&id"]),
            undefined,
            undefined,
        );
        const response = await do_compare(shouldBeTrue);
        assert("result" in response);
        assert(response.result);
        const decoded = _decode_CompareResult(response.result);
        const resData = getOptionallyProtectedValue(decoded);
        expect(resData.matched).toBe(true);
    });

    it("RemoveEntry with FamilyGrouping.compoundEntry", async () => {
        const testId = `RemoveEntry.familyGrouping.compoundEntry-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId);
            await createCompoundEntry(connection!, dn);
        }
        const reqData: RemoveEntryArgumentData = new RemoveEntryArgumentData(
            {
                rdnSequence: [ ...dn, parentRDN ],
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
            FamilyGrouping_compoundEntry,
        );
        const arg: RemoveEntryArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            removeEntry["&operationCode"]!,
            _encode_RemoveEntryArgument(arg, DER),
        );
        assert("result" in response);
        assert(response.result);
    });

    it("Search with FamilyGrouping.strands", async () => {
        const testId = `Search.familyGrouping.strands-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId);
            await createCompoundEntry(connection!, dn);
        }
        const searchControlOptions: SearchControlOptions = new Uint8ClampedArray(Array(12).fill(FALSE_BIT));
        // We separate family members just to make it easier to count.
        searchControlOptions[SearchControlOptions_separateFamilyMembers] = TRUE_BIT;
        const selection = new EntryInformationSelection(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            new FamilyReturn(
                FamilyReturn_memberSelect_contributingEntriesOnly,
            ),
        );
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: [ ...dn, parentRDN ],
            },
            SearchArgumentData_subset_baseObject,
            {
                and: [
                    {
                        item: {
                            present: organizationName["&id"],
                        },
                    },
                    {
                        item: {
                            present: surname["&id"],
                        },
                    },
                ],
            },
            undefined,
            selection,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            searchControlOptions,
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
            undefined,
            FamilyGrouping_strands,
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
        const resData = getOptionallyProtectedValue(decoded);
        assert("searchInfo" in resData);
        expect(resData.searchInfo.entries).toHaveLength(3);
    });

    it("Compare with FamilyGrouping.strands", async () => {
        const testId = `Compare.familyGrouping.strands-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId);
            await createCompoundEntry(connection!, dn);
        }
        const do_compare = async (purported: AttributeValueAssertion) => {
            const reqData: CompareArgumentData = new CompareArgumentData(
                {
                    rdnSequence: [ ...dn, parentRDN ],
                },
                purported,
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
                FamilyGrouping_strands,
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
        const shouldBeTrue: AttributeValueAssertion = new AttributeValueAssertion(
            objectClass["&id"],
            oid(device["&id"]),
            undefined,
            undefined,
        );
        const response = await do_compare(shouldBeTrue);
        assert("result" in response);
        assert(response.result);
        const decoded = _decode_CompareResult(response.result);
        const resData = getOptionallyProtectedValue(decoded);
        expect(resData.matched).toBe(true);
    });

    it.skip("RemoveEntry with FamilyGrouping.strands", async () => {
        // This silently behaves like entryOnly.
    });

    it("Search with FamilyGrouping.multiStrand", async () => {
        const testId = `Search.familyGrouping.multiStrand-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId);
            await createCompoundEntry(connection!, dn);
        }
        const searchControlOptions: SearchControlOptions = new Uint8ClampedArray(Array(12).fill(FALSE_BIT));
        // We separate family members just to make it easier to count.
        searchControlOptions[SearchControlOptions_separateFamilyMembers] = TRUE_BIT;
        const selection = new EntryInformationSelection(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            new FamilyReturn(
                FamilyReturn_memberSelect_contributingEntriesOnly,
            ),
        );
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: [ ...dn, parentRDN ],
            },
            SearchArgumentData_subset_baseObject,
            undefined,
            undefined,
            selection,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            searchControlOptions,
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
            undefined,
            FamilyGrouping_multiStrand,
        );
        const arg: SearchArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            search["&operationCode"]!,
            _encode_SearchArgument(arg, DER),
        );
        assert("error" in response);
        assert(response.error);
    });

    it("Compare with FamilyGrouping.multiStrand", async () => {
        const testId = `Compare.familyGrouping.multiStrand-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId);
            await createCompoundEntry(connection!, dn);
        }
        const do_compare = async (purported: AttributeValueAssertion) => {
            const reqData: CompareArgumentData = new CompareArgumentData(
                {
                    rdnSequence: [ ...dn, parentRDN ],
                },
                purported,
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
                FamilyGrouping_multiStrand,
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
        const shouldBeTrue: AttributeValueAssertion = new AttributeValueAssertion(
            objectClass["&id"],
            oid(device["&id"]),
            undefined,
            undefined,
        );
        const response = await do_compare(shouldBeTrue);
        assert("error" in response);
        assert(response.error);
    });

    it.skip("RemoveEntry with FamilyGrouping.multiStrand", async () => {
        // This silently behaves like entryOnly.
    });

    it.skip("ServiceControls.timeLimit is respected", async () => {
        // Difficult to test. Let's skip this for now.
    });

    it("ServiceControls.sizeLimit is respected by list operation", async () => {
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
            undefined,
            new ServiceControls(
                undefined,
                undefined,
                undefined,
                2,
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
        const decoded = _decode_ListResult(response.result);
        const resData = getOptionallyProtectedValue(decoded);
        assert("listInfo" in resData);
        expect(resData.listInfo.subordinates.length).toBe(2);
    });

    it("ServiceControls.sizeLimit is respected by search operation", async () => {
        const testId = `Search.sizeLimit-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const sizeLimit: number = 2;
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
            new ServiceControls(
                undefined,
                undefined,
                undefined,
                sizeLimit,
            ),
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
        const resData = getOptionallyProtectedValue(decoded);
        assert("searchInfo" in resData);
        expect(resData.searchInfo.entries.length).toBe(sizeLimit);
    });

    it("ServiceControls.attributeSizeLimit is respected for search", async () => {
        const testId = `Search.attributeSizeLimit-${(new Date()).toISOString()}`;
        const attributeSizeLimit: number = 10;
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    description["&id"],
                    [utf8("a".repeat(attributeSizeLimit * 2))],
                    undefined,
                ),
            ]);
        }
        const dn = createTestRootDN(testId);
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_baseObject,
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
            undefined,
            new ServiceControls(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                attributeSizeLimit,
            ),
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
        const resData = getOptionallyProtectedValue(decoded);
        assert("searchInfo" in resData);
        expect(resData.searchInfo.entries).toHaveLength(1);
        const entry = resData.searchInfo.entries[0];
        assert(entry.information);
        for (const info of entry.information) {
            assert("attribute" in info);
            for (const value of info.attribute.values) {
                expect(value.length).toBeLessThanOrEqual(attributeSizeLimit);
            }
            for (const vwc of info.attribute.valuesWithContext ?? []) {
                expect(vwc.value.length).toBeLessThanOrEqual(attributeSizeLimit);
            }
            if (info.attribute.type_.isEqualTo(description["&id"])) {
                expect(info.attribute.values).toHaveLength(1);
            }
        }
    });

    it("ServiceControls.attributeSizeLimit is respected for read", async () => {
        const testId = `Read.attributeSizeLimit-${(new Date()).toISOString()}`;
        const attributeSizeLimit: number = 10;
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    description["&id"],
                    [utf8("a".repeat(attributeSizeLimit * 2))],
                    undefined,
                ),
            ]);
        }
        const dn = createTestRootDN(testId);
        const reqData: ReadArgumentData = new ReadArgumentData(
            {
                rdnSequence: dn,
            },
            undefined,
            undefined,
            undefined,
            new ServiceControls(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                attributeSizeLimit,
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
        const entry = resData.entry;
        assert(entry.information);
        for (const info of entry.information) {
            assert("attribute" in info);
            for (const value of info.attribute.values) {
                expect(value.length).toBeLessThanOrEqual(attributeSizeLimit);
            }
            for (const vwc of info.attribute.valuesWithContext ?? []) {
                expect(vwc.value.length).toBeLessThanOrEqual(attributeSizeLimit);
            }
            if (info.attribute.type_.isEqualTo(description["&id"])) {
                expect(info.attribute.values).toHaveLength(1);
            }
        }
    });

    it("ServiceControls.attributeSizeLimit is respected for modifyEntry", async () => {
        const testId = `ModifyEntry.attributeSizeLimit-${(new Date()).toISOString()}`;
        const attributeSizeLimit: number = 10;
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    description["&id"],
                    [utf8("a".repeat(attributeSizeLimit * 2))],
                    undefined,
                ),
            ]);
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
            new EntryInformationSelection(
                {
                    select: [ description["&id"] ],
                },
            ),
            undefined,
            new ServiceControls(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                attributeSizeLimit,
            ),
        );
        const arg: ModifyEntryArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            modifyEntry["&operationCode"]!,
            _encode_ModifyEntryArgument(arg, DER),
        );
        assert("result" in response);
        assert(response.result);
        const decoded = _decode_ModifyEntryResult(response.result);
        assert("information" in decoded);
        const resData = getOptionallyProtectedValue(decoded.information);
        const entry = resData.entry;
        assert(entry);
        assert(entry.information);
        for (const info of entry.information) {
            assert("attribute" in info);
            for (const value of info.attribute.values) {
                expect(value.length).toBeLessThanOrEqual(attributeSizeLimit);
            }
            for (const vwc of info.attribute.valuesWithContext ?? []) {
                expect(vwc.value.length).toBeLessThanOrEqual(attributeSizeLimit);
            }
            if (info.attribute.type_.isEqualTo(description["&id"])) {
                expect(info.attribute.values).toHaveLength(1);
            }
        }
    });

    it("EntryInformationSelection.infoTypes recurses into family information for read", async () => {
        const testId = `Read.infoTypes.family-information-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId);
            await createCompoundEntry(connection!, dn);
        }
        const selection = new EntryInformationSelection(
            undefined,
            typesOnly,
            undefined,
            undefined,
            undefined,
            new FamilyReturn(
                FamilyReturn_memberSelect_compoundEntry,
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
        assert(familyAttribute);
        assert("attribute" in familyAttribute);
        for (const familyValue of familyAttribute.attribute.values) {
            const family = family_information.decoderFor["&Type"]!(familyValue);
            for (const entry of family.familyEntries) {
                for (const info of entry.information ?? []) {
                    assert("attributeType" in info);
                }
            }
        }
    });

    it("EntryInformationSelection.infoTypes recurses into family information for search", async () => {
        const testId = `Search.infoTypes.family-information-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        { // Setup
            await createTestRootNode(connection!, testId);
            await createCompoundEntry(connection!, dn);
        }
        const selection = new EntryInformationSelection(
            undefined,
            typesOnly,
            undefined,
            undefined,
            undefined,
            new FamilyReturn(
                FamilyReturn_memberSelect_compoundEntry,
            ),
        );
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: [...dn, parentRDN],
            },
            SearchArgumentData_subset_baseObject,
            undefined,
            undefined,
            selection,
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
        const resData = getOptionallyProtectedValue(decoded);
        assert("searchInfo" in resData);
        expect(resData.searchInfo.entries).toHaveLength(1);
        const entry = resData.searchInfo.entries[0];
        const familyAttribute: EntryInformation_information_Item | undefined = entry.information
            ?.find((einfo) => ("attribute" in einfo) && einfo.attribute.type_.isEqualTo(family_information["&id"]));
        assert(familyAttribute);
        assert("attribute" in familyAttribute);
        for (const familyValue of familyAttribute.attribute.values) {
            const family = family_information.decoderFor["&Type"]!(familyValue);
            for (const entry of family.familyEntries) {
                for (const info of entry.information ?? []) {
                    assert("attributeType" in info);
                }
            }
        }
    });

    it("EntryInformationSelection.infoTypes recurses into family information for modifyEntry", async () => {
        const testId = `ModifyEntry.infoTypes.family-information-${(new Date()).toISOString()}`;
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
            typesOnly,
            undefined,
            undefined,
            undefined,
            new FamilyReturn(
                FamilyReturn_memberSelect_compoundEntry,
            ),
        );
        const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
            {
                rdnSequence: [...dn, parentRDN],
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
            selection,
        );
        const arg: ModifyEntryArgument = {
            unsigned: reqData,
        };
        const response = await writeOperation(
            connection!,
            modifyEntry["&operationCode"]!,
            _encode_ModifyEntryArgument(arg, DER),
        );
        assert("result" in response);
        assert(response.result);
        const decoded = _decode_ModifyEntryResult(response.result);
        assert("information" in decoded);
        const resData = getOptionallyProtectedValue(decoded.information);
        const entry = resData.entry;
        assert(entry);
        const familyAttribute: EntryInformation_information_Item | undefined = entry.information
            ?.find((einfo) => ("attribute" in einfo) && einfo.attribute.type_.isEqualTo(family_information["&id"]));
        assert(familyAttribute);
        assert("attribute" in familyAttribute);
        for (const familyValue of familyAttribute.attribute.values) {
            const family = family_information.decoderFor["&Type"]!(familyValue);
            for (const entry of family.familyEntries) {
                for (const info of entry.information ?? []) {
                    assert("attributeType" in info);
                }
            }
        }
    });

    it("Collective attributes appear in entries within a collective attribute specific area", async () => {
        const testId = `collective-attribute-specific-area-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [
                        oid(id_ar_collectiveAttributeSpecificArea),
                    ],
                    undefined,
                ),
            ]);
        }
        const dn = createTestRootDN(testId);
        const subentryRDN: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("hello"),
            ),
        ];
        const collectiveOrgName = "Illuminati";
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
                new Attribute(
                    collectiveOrganizationName["&id"],
                    [utf8(collectiveOrgName)],
                    undefined,
                ),
            ],
        );
        const subordinatesLevel1: string[] = Array(3).fill("").map(() => crypto.randomUUID());
        const subordinatesLevel2: string[] = Array(3).fill("").map(() => crypto.randomUUID());
        await Promise.all(subordinatesLevel1.map((id) => createTestNode(connection!, dn, id)));
        const subordinateWithSubordinates: string = subordinatesLevel1[subordinatesLevel1.length - 1];
        const level2DN: DistinguishedName = [ ...dn, createTestRDN(subordinateWithSubordinates) ];
        await Promise.all(subordinatesLevel2.map((id) => createTestNode(connection!, level2DN, id)));
        const reqData: SearchArgumentData = new SearchArgumentData(
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
        const resData = getOptionallyProtectedValue(decoded);
        assert("searchInfo" in resData);
        for (const entry of resData.searchInfo.entries) {
            const isTheInheritedCollectiveAttribute = (info: EntryInformation_information_Item): boolean => (
                ("attribute" in info)
                && info.attribute.type_.isEqualTo(collectiveOrganizationName["&id"])
                && info.attribute.values.some((v) => v.utf8String === collectiveOrgName)
            );
            expect(entry.information?.some(isTheInheritedCollectiveAttribute)).toBeTruthy();
        }
    });

    it("Collective attributes appear in entries within a collective attribute inner area", async () => {
        const testId = `collective-attribute-inner-area-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [
                        oid(id_ar_collectiveAttributeSpecificArea),
                    ],
                    undefined,
                ),
            ]);
        }
        const dn = createTestRootDN(testId);
        const subentryRDN: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("hello"),
            ),
        ];
        const subentry2RDN: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("world"),
            ),
        ];
        const collectiveOrgName = "Illuminati";
        const collectiveOrgUnitName = "Anime Fanatics";
        const subordinatesLevel1: string[] = Array(1).fill("").map(() => crypto.randomUUID());
        const subordinatesLevel2: string[] = Array(3).fill("").map(() => crypto.randomUUID());
        await Promise.all(subordinatesLevel1.map((id) => createTestNode(connection!, dn, id, [
            new Attribute(
                administrativeRole["&id"],
                [
                    oid(id_ar_collectiveAttributeInnerArea),
                ],
                undefined,
            ),
        ])));
        const subordinateWithSubordinates: string = subordinatesLevel1[0];
        const level2DN: DistinguishedName = [ ...dn, createTestRDN(subordinateWithSubordinates) ];
        await Promise.all(subordinatesLevel2.map((id) => createTestNode(connection!, level2DN, id)));
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
                new Attribute(
                    collectiveOrganizationName["&id"],
                    [utf8(collectiveOrgName)],
                    undefined,
                ),
            ],
        );
        await createEntry(
            connection!,
            level2DN,
            subentry2RDN,
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
                        utf8("world"),
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
                    collectiveOrganizationalUnitName["&id"],
                    [utf8(collectiveOrgUnitName)],
                    undefined,
                ),
            ],
        );
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: level2DN,
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
        const resData = getOptionallyProtectedValue(decoded);
        assert("searchInfo" in resData);
        for (const entry of resData.searchInfo.entries) {
            const isTheInheritedCollectiveAttribute1 = (info: EntryInformation_information_Item): boolean => (
                ("attribute" in info)
                && info.attribute.type_.isEqualTo(collectiveOrganizationName["&id"])
                && info.attribute.values.some((v) => v.utf8String === collectiveOrgName)
            );
            const isTheInheritedCollectiveAttribute2 = (info: EntryInformation_information_Item): boolean => (
                ("attribute" in info)
                && info.attribute.type_.isEqualTo(collectiveOrganizationalUnitName["&id"])
                && info.attribute.values.some((v) => v.utf8String === collectiveOrgUnitName)
            );
            expect(entry.information?.some(isTheInheritedCollectiveAttribute1)).toBeTruthy();
            expect(entry.information?.some(isTheInheritedCollectiveAttribute2)).toBeTruthy();
        }
    });

    it("Collective attributes from CASAs are excluded via collectiveExclusions", async () => {
        const testId = `collective-exclusions-from-casa-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [
                        oid(id_ar_collectiveAttributeSpecificArea),
                    ],
                    undefined,
                ),
            ]);
        }
        const dn = createTestRootDN(testId);
        const subentryRDN: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("hello"),
            ),
        ];
        const collectiveOrgName = "Illuminati";
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
                new Attribute(
                    collectiveOrganizationName["&id"],
                    [utf8(collectiveOrgName)],
                    undefined,
                ),
            ],
        );
        const subordinatesLevel1: string[] = Array(3).fill("").map(() => crypto.randomUUID());
        await Promise.all(subordinatesLevel1.map((id) => createTestNode(connection!, dn, id, [
            new Attribute(
                collectiveExclusions["&id"],
                [oid(collectiveOrganizationName["&id"])],
                undefined,
            ),
        ])));
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            // The admin point does not have collective exclusions, so we use
            // oneLevel search.
            SearchArgumentData_subset_oneLevel,
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
        const resData = getOptionallyProtectedValue(decoded);
        assert("searchInfo" in resData);
        for (const entry of resData.searchInfo.entries) {
            const isTheInheritedCollectiveAttribute = (info: EntryInformation_information_Item): boolean => (
                ("attribute" in info)
                && info.attribute.type_.isEqualTo(collectiveOrganizationName["&id"])
                && info.attribute.values.some((v) => v.utf8String === collectiveOrgName)
            );
            expect(entry.information?.some(isTheInheritedCollectiveAttribute)).toBeFalsy();
        }
    });

    it("Collective attributes from CAIAs are excluded via collectiveExclusions", async () => {
        const testId = `collective-exclusions-from-caia-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [
                        oid(id_ar_collectiveAttributeSpecificArea),
                    ],
                    undefined,
                ),
            ]);
        }
        const dn = createTestRootDN(testId);
        const subentryRDN: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("hello"),
            ),
        ];
        const subentry2RDN: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("world"),
            ),
        ];
        const collectiveOrgName = "Illuminati";
        const collectiveOrgUnitName = "Anime Fanatics";
        const subordinatesLevel1: string[] = Array(1).fill("").map(() => crypto.randomUUID());
        const subordinatesLevel2: string[] = Array(3).fill("").map(() => crypto.randomUUID());
        await Promise.all(subordinatesLevel1.map((id) => createTestNode(connection!, dn, id, [
            new Attribute(
                administrativeRole["&id"],
                [
                    oid(id_ar_collectiveAttributeInnerArea),
                ],
                undefined,
            ),
        ])));
        const subordinateWithSubordinates: string = subordinatesLevel1[0];
        const level2DN: DistinguishedName = [ ...dn, createTestRDN(subordinateWithSubordinates) ];
        await Promise.all(subordinatesLevel2.map((id) => createTestNode(connection!, level2DN, id, [
            new Attribute(
                collectiveExclusions["&id"],
                [oid(collectiveOrganizationalUnitName["&id"])],
                undefined,
            ),
        ])));
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
                new Attribute(
                    collectiveOrganizationName["&id"],
                    [utf8(collectiveOrgName)],
                    undefined,
                ),
            ],
        );
        await createEntry(
            connection!,
            level2DN,
            subentry2RDN,
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
                        utf8("world"),
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
                    collectiveOrganizationalUnitName["&id"],
                    [utf8(collectiveOrgUnitName)],
                    undefined,
                ),
            ],
        );
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: level2DN,
            },
            SearchArgumentData_subset_oneLevel,
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
        const resData = getOptionallyProtectedValue(decoded);
        assert("searchInfo" in resData);
        for (const entry of resData.searchInfo.entries) {
            const isTheInheritedCollectiveAttribute1 = (info: EntryInformation_information_Item): boolean => (
                ("attribute" in info)
                && info.attribute.type_.isEqualTo(collectiveOrganizationName["&id"])
                && info.attribute.values.some((v) => v.utf8String === collectiveOrgName)
            );
            const isTheInheritedCollectiveAttribute2 = (info: EntryInformation_information_Item): boolean => (
                ("attribute" in info)
                && info.attribute.type_.isEqualTo(collectiveOrganizationalUnitName["&id"])
                && info.attribute.values.some((v) => v.utf8String === collectiveOrgUnitName)
            );
            expect(entry.information?.some(isTheInheritedCollectiveAttribute1)).toBeTruthy();
            expect(entry.information?.some(isTheInheritedCollectiveAttribute2)).toBeFalsy();
        }
    });

    it("Subordinate collective attribute specific administrative points override a superior collective attribute specific administrative point", async () => {
        const testId = `casa-overrides-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [
                        oid(id_ar_collectiveAttributeSpecificArea),
                    ],
                    undefined,
                ),
            ]);
        }
        const dn = createTestRootDN(testId);
        const subentryRDN: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("foo"),
            ),
        ];
        const subentry2RDN: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("bar"),
            ),
        ];
        const subentry3RDN: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("baz"),
            ),
        ];
        const collectiveOrgName = "Illuminati";
        const collectiveOrgUnitName = "Anime Fanatics";
        const collectiveLocName = "Bananaville";
        const subordinatesLevel1: string[] = Array(1).fill("").map(() => crypto.randomUUID());
        const subordinatesLevel2: string[] = Array(1).fill("").map(() => crypto.randomUUID());
        const subordinatesLevel3: string[] = Array(3).fill("").map(() => crypto.randomUUID());
        await Promise.all(subordinatesLevel1.map((id) => createTestNode(connection!, dn, id, [
            new Attribute(
                administrativeRole["&id"],
                [
                    oid(id_ar_collectiveAttributeInnerArea),
                ],
                undefined,
            ),
        ])));
        const leve1Id: string = subordinatesLevel1[0];
        const leve2Id: string = subordinatesLevel2[0];
        const level2DN: DistinguishedName = [ ...dn, createTestRDN(leve1Id) ];
        const level3DN: DistinguishedName = [ ...level2DN, createTestRDN(leve2Id) ];
        await Promise.all(subordinatesLevel2.map((id) => createTestNode(connection!, level2DN, id, [
            new Attribute(
                administrativeRole["&id"],
                [
                    oid(id_ar_collectiveAttributeSpecificArea),
                ],
                undefined,
            ),
        ])));
        await Promise.all(subordinatesLevel3.map((id) => createTestNode(connection!, level3DN, id)));
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
                        utf8("foo"),
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
                    collectiveOrganizationName["&id"],
                    [utf8(collectiveOrgName)],
                    undefined,
                ),
            ],
        );
        await createEntry(
            connection!,
            level2DN,
            subentry2RDN,
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
                        utf8("bar"),
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
                    collectiveOrganizationalUnitName["&id"],
                    [utf8(collectiveOrgUnitName)],
                    undefined,
                ),
            ],
        );
        await createEntry(
            connection!,
            level3DN,
            subentry3RDN,
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
                        utf8("baz"),
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
                    collectiveLocalityName["&id"],
                    [utf8(collectiveLocName)],
                    undefined,
                ),
            ],
        );
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: level3DN,
            },
            SearchArgumentData_subset_oneLevel,
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
        const resData = getOptionallyProtectedValue(decoded);
        assert("searchInfo" in resData);
        for (const entry of resData.searchInfo.entries) {
            const isTheInheritedCollectiveAttribute1 = (info: EntryInformation_information_Item): boolean => (
                ("attribute" in info)
                && info.attribute.type_.isEqualTo(collectiveOrganizationName["&id"])
                && info.attribute.values.some((v) => v.utf8String === collectiveOrgName)
            );
            const isTheInheritedCollectiveAttribute2 = (info: EntryInformation_information_Item): boolean => (
                ("attribute" in info)
                && info.attribute.type_.isEqualTo(collectiveOrganizationalUnitName["&id"])
                && info.attribute.values.some((v) => v.utf8String === collectiveOrgUnitName)
            );
            const isTheInheritedCollectiveAttribute3 = (info: EntryInformation_information_Item): boolean => (
                ("attribute" in info)
                && info.attribute.type_.isEqualTo(collectiveLocalityName["&id"])
                && info.attribute.values.some((v) => v.utf8String === collectiveLocName)
            );
            expect(entry.information?.some(isTheInheritedCollectiveAttribute1)).toBeFalsy();
            expect(entry.information?.some(isTheInheritedCollectiveAttribute2)).toBeFalsy();
            expect(entry.information?.some(isTheInheritedCollectiveAttribute3)).toBeTruthy();
        }
    });

    it("Subordinate subschema administrative points override a superior subschema administrative point", async () => {
        const testId = `subschema-overrides-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const subentryRDN: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("hello"),
            ),
        ];
        const subentry2RDN: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("world"),
            ),
        ];
        const level1: string = crypto.randomUUID();
        const level2: string = crypto.randomUUID();
        const level2DN: DistinguishedName = [ ...dn, createTestRDN(level1) ];
        const level3DN: DistinguishedName = [ ...level2DN, createTestRDN(level2) ];
        await createTestNode(connection!, dn, level1, [
            new Attribute(
                administrativeRole["&id"],
                [
                    oid(id_ar_subschemaAdminSpecificArea),
                ],
                undefined,
            ),
            new Attribute(
                description["&id"],
                [utf8(`description-${level1}`)],
                undefined,
            ),
        ]);
        await createTestNode(connection!, level2DN, level2, [
            new Attribute(
                administrativeRole["&id"],
                [
                    oid(id_ar_subschemaAdminSpecificArea),
                ],
                undefined,
            ),
            new Attribute(
                description["&id"],
                [utf8(`description-${level2}`)],
                undefined,
            ),
        ]);
        const anchorType: OBJECT_IDENTIFIER = commonName["&id"];
        await createEntry(
            connection!,
            level2DN,
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
                            anchorType,
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
        await createEntry(
            connection!,
            level3DN,
            subentry2RDN,
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
                        utf8("world"),
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
        const search_ = (base: DistinguishedName) => {
            const reqData: SearchArgumentData = new SearchArgumentData(
                {
                    rdnSequence: base,
                },
                SearchArgumentData_subset_oneLevel,
                undefined,
                undefined,
                new EntryInformationSelection(
                    {
                        select: [ anchorType ],
                    },
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
        }
        /**
         * Check that description is present in superior subschema admin area,
         * because, in that subschema administrative area, description is a
         * friend of commonName.
         */
        {
            const response = await search_(dn);
            assert("result" in response);
            assert(response.result);
            const decoded = _decode_SearchResult(response.result);
            const resData = getOptionallyProtectedValue(decoded);
            assert("searchInfo" in resData);
            for (const entry of resData.searchInfo.entries) {
                const descriptionFound: boolean = entry.information?.some((info) => (
                    ("attribute" in info)
                    && info.attribute.type_.isEqualTo(description["&id"])
                )) ?? false;
                expect(descriptionFound).toBeTruthy();
            }
        }
        /**
         * Check that description is NOT present in the subordinate subschema
         * admin area, because, in that subschema administrative area,
         * description is NOT a friend of commonName.
         */
        {
            const response = await search_(level2DN);
            assert("result" in response);
            assert(response.result);
            const decoded = _decode_SearchResult(response.result);
            const resData = getOptionallyProtectedValue(decoded);
            assert("searchInfo" in resData);
            for (const entry of resData.searchInfo.entries) {
                const descriptionFound: boolean = entry.information?.some((info) => (
                    ("attribute" in info)
                    && info.attribute.type_.isEqualTo(description["&id"])
                )) ?? false;
                expect(descriptionFound).toBeFalsy();
            }
        }
    });

    it("Subordinate CAD administrative points override a superior CAD administrative point", async () => {
        const testId = `context-assertion-default-overrides-${(new Date()).toISOString()}`;
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
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const subentryRDN: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("hello"),
            ),
        ];
        const subentry2RDN: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("world"),
            ),
        ];
        const subordinatesLevel1: string[] = Array(1).fill("").map(() => crypto.randomUUID());
        const subordinatesLevel2: string[] = Array(3).fill("").map(() => crypto.randomUUID());
        await Promise.all(subordinatesLevel1.map((id) => createTestNode(connection!, dn, id, [
            new Attribute(
                administrativeRole["&id"],
                [
                    oid(id_ar_contextDefaultSpecificArea),
                ],
                undefined,
            ),
            new Attribute(
                description["&id"],
                [],
                [
                    new Attribute_valuesWithContext_Item(
                        utf8(`der description-${id}`),
                        [
                            new Context(
                                localeContext["&id"],
                                [firstLocale],
                                false,
                            ),
                        ]
                    ),
                    new Attribute_valuesWithContext_Item(
                        utf8(`el description-${id}`),
                        [
                            new Context(
                                localeContext["&id"],
                                [secondLocale],
                                false,
                            ),
                        ]
                    ),
                ],
            ),
        ])));
        const subordinateWithSubordinates: string = subordinatesLevel1[0];
        const lastAdminPoint: string = subordinatesLevel2[0];
        const level2DN: DistinguishedName = [ ...dn, createTestRDN(subordinateWithSubordinates) ];
        const level3DN: DistinguishedName = [ ...level2DN, createTestRDN(lastAdminPoint) ];
        await Promise.all(subordinatesLevel2.map((id) => createTestNode(connection!, level2DN, id, [
            new Attribute(
                administrativeRole["&id"],
                [
                    oid(id_ar_contextDefaultSpecificArea),
                ],
                undefined,
            ),
            new Attribute(
                description["&id"],
                [],
                [
                    new Attribute_valuesWithContext_Item(
                        utf8(`der description-${id}`),
                        [
                            new Context(
                                localeContext["&id"],
                                [firstLocale],
                                false,
                            ),
                        ]
                    ),
                    new Attribute_valuesWithContext_Item(
                        utf8(`le description-${id}`),
                        [
                            new Context(
                                localeContext["&id"],
                                [thirdLocale],
                                false,
                            ),
                        ]
                    ),
                ],
            ),
        ])));
        await createEntry(
            connection!,
            level2DN,
            subentryRDN,
            [
                new Attribute(
                    objectClass["&id"],
                    [
                        oid(subentry["&id"]),
                        oid(contextAssertionSubentry["&id"]),
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
                    contextAssertionDefaults["&id"],
                    [
                        _encode_TypeAndContextAssertion(new TypeAndContextAssertion(
                            description["&id"],
                            {
                                all: [
                                    new ContextAssertion(
                                        localeContext["&id"],
                                        [secondLocale],
                                    ),
                                ],
                            },
                        ), DER),
                    ],
                    undefined,
                ),
            ],
        );
        await createEntry(
            connection!,
            level3DN,
            subentry2RDN,
            [
                new Attribute(
                    objectClass["&id"],
                    [
                        oid(subentry["&id"]),
                        oid(contextAssertionSubentry["&id"]),
                    ],
                    undefined,
                ),
                new Attribute(
                    commonName["&id"],
                    [
                        utf8("world"),
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
                    contextAssertionDefaults["&id"],
                    [
                        _encode_TypeAndContextAssertion(new TypeAndContextAssertion(
                            description["&id"],
                            {
                                all: [
                                    new ContextAssertion(
                                        localeContext["&id"],
                                        [thirdLocale],
                                    ),
                                ],
                            },
                        ), DER),
                    ],
                    undefined,
                ),
            ],
        );
        const search_ = (base: DistinguishedName, scope: number) => {
            const reqData: SearchArgumentData = new SearchArgumentData(
                {
                    rdnSequence: base,
                },
                scope,
                undefined,
                undefined,
                new EntryInformationSelection(
                    {
                        select: [ description["&id"] ],
                    },
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
        }
        {
            const response = await search_(dn, SearchArgumentData_subset_oneLevel as number);
            assert("result" in response);
            assert(response.result);
            const decoded = _decode_SearchResult(response.result);
            const resData = getOptionallyProtectedValue(decoded);
            assert("searchInfo" in resData);
            for (const entry of resData.searchInfo.entries) {
                const desc = entry.information?.find((info) => (
                    ("attribute" in info)
                    && info.attribute.type_.isEqualTo(description["&id"])
                ));
                assert(desc);
                assert("attribute" in desc);
                assert(desc.attribute.values);
                expect(desc.attribute.values).toHaveLength(1);
                const value = desc.attribute.values[0];
                expect(value.utf8String.startsWith("el description-")).toBeTruthy();
            }
        }
        {
            const response = await search_(level3DN, SearchArgumentData_subset_baseObject as number);
            assert("result" in response);
            assert(response.result);
            const decoded = _decode_SearchResult(response.result);
            const resData = getOptionallyProtectedValue(decoded);
            assert("searchInfo" in resData);
            for (const entry of resData.searchInfo.entries) {
                const desc = entry.information?.find((info) => (
                    ("attribute" in info)
                    && info.attribute.type_.isEqualTo(description["&id"])
                ));
                assert(desc);
                assert("attribute" in desc);
                assert(desc.attribute.values);
                expect(desc.attribute.values).toHaveLength(1);
                const value = desc.attribute.values[0];
                expect(value.utf8String.startsWith("le description-")).toBeTruthy();
            }
        }
    });

    // it("If an entry has hierarchical children its hierarchyBelow attribute has a value of TRUE", async () => {
    it("Hierarchy attributes are correct for entries in a hierarchy", async () => {
        const testId = `hierarchy-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const level1 = "01CAD649-3E25-45E7-B5B9-71E63C79F32A";
        const level2 = "71996C80-D22B-4887-9D32-140FE3B1282D";
        const level1RDN = createTestRDN(level1);
        const level2RDN = createTestRDN(level2);
        const level1DN = [ ...dn, level1RDN ];
        const level2DN = [ ...dn, level2RDN ];
        await createTestNode(connection!, dn, level1, [
            new Attribute(
                hierarchyParent["&id"],
                [_encode_DistinguishedName(dn, DER)],
                undefined,
            ),
        ]);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await createTestNode(connection!, dn, level2, [
            new Attribute(
                hierarchyParent["&id"],
                [_encode_DistinguishedName(level1DN, DER)],
                undefined,
            ),
        ]);
        {
            const reqData: ReadArgumentData = new ReadArgumentData(
                {
                    rdnSequence: dn,
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
            const result = await writeOperation(
                connection!,
                read["&operationCode"]!,
                _encode_ReadArgument(arg, DER),
            );
            assert("result" in result);
            assert(result.result);
            const param = _decode_ReadResult(result.result);
            const data = getOptionallyProtectedValue(param);
            const top = data.entry.information
                ?.find((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(hierarchyTop["&id"]));
            const below = data.entry.information
                ?.find((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(hierarchyBelow["&id"]));
            const level = data.entry.information
                ?.find((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(hierarchyLevel["&id"]));
            assert(top);
            assert(below);
            assert(level);
            assert("attribute" in top);
            assert("attribute" in below);
            assert("attribute" in level);
            expect(top.attribute.values).toHaveLength(1);
            expect(below.attribute.values).toHaveLength(1);
            expect(level.attribute.values).toHaveLength(1);
            const topValue = top.attribute.values[0];
            const belowValue = below.attribute.values[0];
            const levelValue = level.attribute.values[0];
            const topDN = _decode_DistinguishedName(topValue);
            expect(belowValue.boolean).toBe(true);
            expect(topDN).toHaveLength(1);
            expect(topDN[0]).toHaveLength(1);
            expect(topDN[0][0].type_.isEqualTo(commonName["&id"])).toBe(true);
            expect(topDN[0][0].value.utf8String).toBe(testId);
            expect(levelValue.integer).toBe(0);
        }
        {
            const reqData: ReadArgumentData = new ReadArgumentData(
                {
                    rdnSequence: level1DN,
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
            const result = await writeOperation(
                connection!,
                read["&operationCode"]!,
                _encode_ReadArgument(arg, DER),
            );
            assert("result" in result);
            assert(result.result);
            const param = _decode_ReadResult(result.result);
            const data = getOptionallyProtectedValue(param);
            const top = data.entry.information
                ?.find((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(hierarchyTop["&id"]));
            const below = data.entry.information
                ?.find((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(hierarchyBelow["&id"]));
            const level = data.entry.information
                ?.find((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(hierarchyLevel["&id"]));
            const hparent = data.entry.information
                ?.find((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(hierarchyParent["&id"]));
            assert(top);
            assert(below);
            assert(level);
            assert(hparent);
            assert("attribute" in top);
            assert("attribute" in below);
            assert("attribute" in level);
            assert("attribute" in hparent);
            expect(top.attribute.values).toHaveLength(1);
            expect(below.attribute.values).toHaveLength(1);
            expect(level.attribute.values).toHaveLength(1);
            expect(hparent.attribute.values).toHaveLength(1);
            const topValue = top.attribute.values[0];
            const belowValue = below.attribute.values[0];
            const levelValue = level.attribute.values[0];
            const parentValue = hparent.attribute.values[0];
            const topDN = _decode_DistinguishedName(topValue);
            const parentDN = _decode_DistinguishedName(parentValue);
            expect(belowValue.boolean).toBe(true);
            expect(topDN).toHaveLength(1);
            expect(topDN[0]).toHaveLength(1);
            expect(topDN[0][0].type_.isEqualTo(commonName["&id"])).toBe(true);
            expect(topDN[0][0].value.utf8String).toBe(testId);
            expect(levelValue.integer).toBe(1);
            expect(parentDN).toHaveLength(1);
            expect(parentDN[0]).toHaveLength(1);
            // expect(parentDN[1]).toHaveLength(1);
            expect(parentDN[0][0].type_.isEqualTo(commonName["&id"])).toBe(true);
            // expect(parentDN[1][0].type_.isEqualTo(commonName["&id"])).toBe(true);
            expect(parentDN[0][0].value.utf8String).toBe(testId);
            // expect(topDN[1][0].value.utf8String).toBe(testId);
        }
        {
            const reqData: ReadArgumentData = new ReadArgumentData(
                {
                    rdnSequence: level2DN,
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
            const result = await writeOperation(
                connection!,
                read["&operationCode"]!,
                _encode_ReadArgument(arg, DER),
            );
            assert("result" in result);
            assert(result.result);
            const param = _decode_ReadResult(result.result);
            const data = getOptionallyProtectedValue(param);
            const top = data.entry.information
                ?.find((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(hierarchyTop["&id"]));
            const below = data.entry.information
                ?.find((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(hierarchyBelow["&id"]));
            const level = data.entry.information
                ?.find((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(hierarchyLevel["&id"]));
            const hparent = data.entry.information
                ?.find((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(hierarchyParent["&id"]));
            assert(top);
            assert(below);
            assert(level);
            assert(hparent);
            assert("attribute" in top);
            assert("attribute" in below);
            assert("attribute" in level);
            assert("attribute" in hparent);
            expect(top.attribute.values).toHaveLength(1);
            expect(below.attribute.values).toHaveLength(1);
            expect(level.attribute.values).toHaveLength(1);
            expect(hparent.attribute.values).toHaveLength(1);
            const topValue = top.attribute.values[0];
            const belowValue = below.attribute.values[0];
            const levelValue = level.attribute.values[0];
            const parentValue = hparent.attribute.values[0];
            const topDN = _decode_DistinguishedName(topValue);
            const parentDN = _decode_DistinguishedName(parentValue);
            expect(belowValue.boolean).toBe(false);
            expect(topDN).toHaveLength(1);
            expect(topDN[0]).toHaveLength(1);
            expect(topDN[0][0].type_.isEqualTo(commonName["&id"])).toBe(true);
            expect(topDN[0][0].value.utf8String).toBe(testId);
            expect(levelValue.integer).toBe(2);
            expect(parentDN).toHaveLength(2);
            expect(parentDN[0]).toHaveLength(1);
            expect(parentDN[1]).toHaveLength(1);
            expect(parentDN[0][0].type_.isEqualTo(commonName["&id"])).toBe(true);
            expect(parentDN[1][0].type_.isEqualTo(commonName["&id"])).toBe(true);
            expect(parentDN[0][0].value.utf8String).toBe(testId);
            expect(parentDN[1][0].value.utf8String).toBe(level1);
        }
    });

    it.todo("An entry's structural object class is calculated correctly"); // Do via unit testing instead.
    it.todo("Alias attributes update correctly when aliases change."); // This might actually not be required.
    // Can't really be tested right now, because there's no way to remotely create a shadow entry.
    it.todo("An entry modification is not allowed to happen to a DSE of type shadow");

});
