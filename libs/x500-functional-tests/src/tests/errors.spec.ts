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
    _encodeOctetString,
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
import { accessControlScheme } from "@wildboar/x500/src/lib/modules/BasicAccessControl/accessControlScheme.oa";
import {
    _encode_UserPwd,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/UserPwd.ta";
import {
    userPwd,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/userPwd.oa";
import {
    userPassword,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/userPassword.oa";
import {
    country,
} from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/country.oa";
import {
    countryName,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/countryName.oa";

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

    it.skip("An error is thrown when an operational binding is attempted with the configured minimum authentication", async () => {

    });

    it.todo("does not allow users to add multiple subschema subentries to a subschema administrative area");
    it.todo("does not allow users to add multiple subtrees to the subschema subentry within a subschema administrative area");
    it.todo("does not allow users to define a subschema subentry with a subtree specification that does not cover the whole administrative area");

    it("An error is thrown when an attempt is made to add a second value to a single-valued attribute", async () => {
        const rdn = [
            new AttributeTypeAndValue(
                countryName["&id"],
                utf8("ZW"),
            ),
        ];
        { // Delete the entry in case it still exists from the previous test.
            const reqData: RemoveEntryArgumentData = new RemoveEntryArgumentData(
                {
                    rdnSequence: [rdn],
                },
            );
            const arg: RemoveEntryArgument = {
                unsigned: reqData,
            };
            await writeOperation(
                connection!,
                removeEntry["&operationCode"]!,
                _encode_RemoveEntryArgument(arg, DER),
            );
        }
        await createEntry(
            connection!,
            [],
            rdn,
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
                    [oid(country["&id"])],
                    undefined,
                ),
                new Attribute(
                    countryName["&id"],
                    [utf8("ZW")],
                    undefined,
                ),
            ],
        );
        const dn = [ rdn ];
        const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
            {
                rdnSequence: dn,
            },
            [
                {
                    addValues: new Attribute(
                        countryName["&id"],
                        [utf8("SE")],
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
        expect(("error" in result) && result.error).toBeTruthy();
    });

    it.todo("throws an error when an RDN is created using more than one value of the same attribute type");

    it.todo("throws an error when a multi-valued RDN is created with duplicate values");

});
