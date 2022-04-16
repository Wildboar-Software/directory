import {
    ASN1Element,
    FALSE_BIT,
    TRUE_BIT,
    ObjectIdentifier,
    OBJECT_IDENTIFIER,
    INTEGER,
    FALSE,
    TRUE,
    DERElement,
} from "asn1-ts";
import {
    BER,
    DER,
    _encodeObjectIdentifier,
    _encodeInteger,
    _encodePrintableString,
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
import type {
    Credentials,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/Credentials.ta";
import {
    SimpleCredentials,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SimpleCredentials.ta";
import {
    attributeError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/attributeError.oa";
import {
    AttributeProblem_noSuchAttributeOrValue,
    AttributeProblem_contextViolation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeProblem.ta";
import {
    dITStructureRules,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/dITStructureRules.oa";
import {
    DITStructureRuleDescription,
    _encode_DITStructureRuleDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITStructureRuleDescription.ta";
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
import {
    dITContentRules,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/dITContentRules.oa";
import {
    DITContentRuleDescription,
    _encode_DITContentRuleDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITContentRuleDescription.ta";
import {
    telephoneNumber,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/telephoneNumber.oa";
import {
    seeAlso,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/seeAlso.oa";
import {
    updateError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/updateError.oa";
import {
    UpdateProblem_objectClassViolation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateProblem.ta";
import {
    userSecurityInformation,
} from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/userSecurityInformation.oa";
import {
    isoTagInfo,
} from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/isoTagInfo.oa";
import {
    dITContextUse,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/dITContextUse.oa";
import {
    DITContextUseDescription,
    _encode_DITContextUseDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITContextUseDescription.ta";
import {
    DITContextUseInformation,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITContextUseInformation.ta";
import {
    languageContext,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/languageContext.oa";
import {
    temporalContext,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/temporalContext.oa";
import {
    TimeSpecification,
    _encode_TimeSpecification,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/TimeSpecification.ta";
import {
    TimeSpecification_time_absolute,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/TimeSpecification-time-absolute.ta";

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

function utf8 (str: string): ASN1Element {
    return _encode_UnboundedDirectoryString({
        uTF8String: str,
    }, DER);
}

function printable (str: string): ASN1Element {
    return _encodePrintableString(str, DER);
}

function oid (o: OBJECT_IDENTIFIER): ASN1Element {
    return _encodeObjectIdentifier(o, DER);
}

function int (i: INTEGER): ASN1Element {
    return _encodeInteger(i, DER);
}

async function connect (credentials?: Credentials): Promise<IDMConnection> {
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

    it("enforces DIT structure rules on entries in a subschema", async () => {
        const testId = `subschema.structure-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        const personNameForm = new ObjectIdentifier([ 2, 5, 100, 2345 ]);
        const processNameForm = new ObjectIdentifier([ 2, 5, 100, 6789 ]);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [
                        oid(id_ar_subschemaAdminSpecificArea),
                    ],
                    undefined,
                ),
            ]);
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8("subschema"),
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
                            utf8("subschema"),
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
                        nameForms["&id"],
                        [
                            _encode_NameFormDescription(new NameFormDescription(
                                processNameForm,
                                undefined,
                                undefined,
                                undefined,
                                new NameFormInformation(
                                    applicationProcess["&id"],
                                    [commonName["&id"]],
                                    undefined,
                                ),
                            ), DER),
                            _encode_NameFormDescription(new NameFormDescription(
                                personNameForm,
                                undefined,
                                undefined,
                                undefined,
                                new NameFormInformation(
                                    person["&id"],
                                    [surname["&id"]],
                                    undefined,
                                ),
                            ), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        dITStructureRules["&id"],
                        [
                            _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                                1,
                                processNameForm,
                            ), DER),
                            _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                                2,
                                personNameForm,
                                [1], // People may appear below a process.
                            ), DER),
                        ],
                        undefined,
                    ),
                ],
            );
        }

        { // This should fail because the subschema does not permit a process beneath a process.
            const entryName: string = "asdf";
            const reqData: AddEntryArgumentData = new AddEntryArgumentData(
                {
                    rdnSequence: [ ...dn, createTestRDN(entryName) ],
                },
                [
                    new Attribute(
                        objectClass["&id"],
                        [oid(applicationProcess["&id"])],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(entryName)],
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
            assert("errcode" in response);
            assert(response.errcode);
            assert("error" in response);
            assert(response.error);
        }

        { // This should fail because the name form for a person is wrong.
            const entryName: string = "asdf";
            const reqData: AddEntryArgumentData = new AddEntryArgumentData(
                {
                    rdnSequence: [ ...dn, createTestRDN(entryName) ],
                },
                [
                    new Attribute(
                        objectClass["&id"],
                        [oid(person["&id"])],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(entryName)],
                        undefined,
                    ),
                    new Attribute(
                        surname["&id"],
                        [utf8("asdf")],
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
            assert("errcode" in response);
            assert(response.errcode);
            assert("error" in response);
            assert(response.error);
        }

        { // This should succeed because we are able to create a person with this name form below the process.
            const entryName: string = "asdf";
            const reqData: AddEntryArgumentData = new AddEntryArgumentData(
                {
                    rdnSequence: [
                        ...dn,
                        [
                            new AttributeTypeAndValue(
                                surname["&id"],
                                utf8(entryName),
                            ),
                        ],
                    ],
                },
                [
                    new Attribute(
                        objectClass["&id"],
                        [oid(person["&id"])],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(entryName)],
                        undefined,
                    ),
                    new Attribute(
                        surname["&id"],
                        [utf8(entryName)],
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
            assert("result" in response);
            assert(response.result);
        }
    });

    it("enforces DIT content rules on entries in a subschema", async () => {
        const testId = `subschema.content-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        const personNameForm = new ObjectIdentifier([ 2, 5, 100, 6336 ]);
        const processNameForm = new ObjectIdentifier([ 2, 5, 100, 8590 ]);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [
                        oid(id_ar_subschemaAdminSpecificArea),
                    ],
                    undefined,
                ),
            ]);
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8("subschema"),
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
                            utf8("subschema"),
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
                        nameForms["&id"],
                        [
                            _encode_NameFormDescription(new NameFormDescription(
                                processNameForm,
                                undefined,
                                undefined,
                                undefined,
                                new NameFormInformation(
                                    applicationProcess["&id"],
                                    [commonName["&id"]],
                                    undefined,
                                ),
                            ), DER),
                            _encode_NameFormDescription(new NameFormDescription(
                                personNameForm,
                                undefined,
                                undefined,
                                undefined,
                                new NameFormInformation(
                                    person["&id"],
                                    [surname["&id"]],
                                    undefined,
                                ),
                            ), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        dITStructureRules["&id"],
                        [
                            _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                                1,
                                processNameForm,
                            ), DER),
                            _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                                2,
                                personNameForm,
                                [1], // People may appear below a process.
                            ), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        dITContentRules["&id"],
                        [
                            _encode_DITContentRuleDescription(new DITContentRuleDescription(
                                person["&id"],
                                [userPwdClass["&id"], isoTagInfo["&id"]], // auxiliaries
                                [telephoneNumber["&id"]], // mandatory
                                [organizationName["&id"]], // optional
                                [seeAlso["&id"]], // precluded
                            ), DER),
                        ],
                        undefined,
                    ),
                ],
            );
        }

        { // Create person with no telephoneNumber, which should fail.
            const entryName: string = "no-telephoneNumber";
            const reqData: AddEntryArgumentData = new AddEntryArgumentData(
                {
                    rdnSequence: [
                        ...dn,
                        [
                            new AttributeTypeAndValue(
                                surname["&id"],
                                utf8(entryName),
                            ),
                        ],
                    ],
                },
                [
                    new Attribute(
                        objectClass["&id"],
                        [oid(person["&id"])],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(entryName)],
                        undefined,
                    ),
                    new Attribute(
                        surname["&id"],
                        [utf8(entryName)],
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
            assert(response.error);
            assert(response.errcode);
            expect(compareCode(response.errcode, updateError["&errorCode"]!)).toBeTruthy();
            const param = updateError.decoderFor["&ParameterType"]!(response.error);
            const data = getOptionallyProtectedValue(param);
            expect(data.problem).toBe(UpdateProblem_objectClassViolation);
        }

        // Create person with seeAlso
        {
            const entryName: string = "with-seeAlso";
            const reqData: AddEntryArgumentData = new AddEntryArgumentData(
                {
                    rdnSequence: [
                        ...dn,
                        [
                            new AttributeTypeAndValue(
                                surname["&id"],
                                utf8(entryName),
                            ),
                        ],
                    ],
                },
                [
                    new Attribute(
                        objectClass["&id"],
                        [oid(person["&id"])],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(entryName)],
                        undefined,
                    ),
                    new Attribute(
                        surname["&id"],
                        [utf8(entryName)],
                        undefined,
                    ),
                    new Attribute(
                        telephoneNumber["&id"],
                        [printable("+1 (888) 111-1111")],
                        undefined,
                    ),
                    new Attribute(
                        seeAlso["&id"],
                        [DERElement.fromSequence([])],
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
            assert(response.error);
            assert(response.errcode);
            expect(compareCode(response.errcode, updateError["&errorCode"]!)).toBeTruthy();
            const param = updateError.decoderFor["&ParameterType"]!(response.error);
            const data = getOptionallyProtectedValue(param);
            expect(data.problem).toBe(UpdateProblem_objectClassViolation);
        }

        // Create person with non-permitted auxiliary object class
        {
            const entryName: string = "with-forbidden-aux-oc";
            const reqData: AddEntryArgumentData = new AddEntryArgumentData(
                {
                    rdnSequence: [
                        ...dn,
                        [
                            new AttributeTypeAndValue(
                                surname["&id"],
                                utf8(entryName),
                            ),
                        ],
                    ],
                },
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(person["&id"]),
                            oid(userSecurityInformation["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(entryName)],
                        undefined,
                    ),
                    new Attribute(
                        surname["&id"],
                        [utf8(entryName)],
                        undefined,
                    ),
                    new Attribute(
                        telephoneNumber["&id"],
                        [printable("+1 (888) 111-1111")],
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
            assert(response.error);
            assert(response.errcode);
            expect(compareCode(response.errcode, updateError["&errorCode"]!)).toBeTruthy();
            const param = updateError.decoderFor["&ParameterType"]!(response.error);
            const data = getOptionallyProtectedValue(param);
            expect(data.problem).toBe(UpdateProblem_objectClassViolation);
        }

        // Create person that complies with content rule
        const compliantEntryName: string = "compliant";
        const compliantEntryRDN: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                surname["&id"],
                utf8(compliantEntryName),
            ),
        ];
        const compliantEntryDN: DistinguishedName = [
            ...dn,
            compliantEntryRDN,
        ];
        {
            const entryName: string = compliantEntryName;
            const reqData: AddEntryArgumentData = new AddEntryArgumentData(
                {
                    rdnSequence: compliantEntryDN,
                },
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(person["&id"]),
                            oid(userPwdClass["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(entryName)],
                        undefined,
                    ),
                    new Attribute(
                        surname["&id"],
                        [utf8(entryName)],
                        undefined,
                    ),
                    new Attribute(
                        telephoneNumber["&id"],
                        [printable("+1 (888) 111-1111")],
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
            assert("result" in response);
            assert(response.result);
        }

        // Modify person to add non-permitted auxiliary object class
        {
            const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
                {
                    rdnSequence: compliantEntryDN,
                },
                [
                    {
                        addValues: new Attribute(
                            objectClass["&id"],
                            [oid(userSecurityInformation["&id"])],
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
            assert(response.error);
            assert(response.errcode);
            expect(compareCode(response.errcode, updateError["&errorCode"]!)).toBeTruthy();
            const param = updateError.decoderFor["&ParameterType"]!(response.error);
            const data = getOptionallyProtectedValue(param);
            expect(data.problem).toBe(UpdateProblem_objectClassViolation);
        }

        // Modify person to add permitted auxiliary object class
        {
            const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
                {
                    rdnSequence: compliantEntryDN,
                },
                [
                    {
                        addValues: new Attribute(
                            objectClass["&id"],
                            [oid(isoTagInfo["&id"])],
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
            assert("result" in response);
            assert(response.result);
        }

        // Modify person to add precluded attribute type
        {
            const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
                {
                    rdnSequence: compliantEntryDN,
                },
                [
                    {
                        addValues: new Attribute(
                            seeAlso["&id"],
                            [DERElement.fromSequence([])],
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
            assert(response.error);
            assert(response.errcode);
            expect(compareCode(response.errcode, updateError["&errorCode"]!)).toBeTruthy();
            const param = updateError.decoderFor["&ParameterType"]!(response.error);
            const data = getOptionallyProtectedValue(param);
            expect(data.problem).toBe(UpdateProblem_objectClassViolation);
        }

        // Modify person to remove mandatory attribute type
        {
            const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
                {
                    rdnSequence: compliantEntryDN,
                },
                [
                    {
                        removeAttribute: telephoneNumber["&id"],
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
            assert(response.error);
            assert(response.errcode);
            expect(compareCode(response.errcode, updateError["&errorCode"]!)).toBeTruthy();
            const param = updateError.decoderFor["&ParameterType"]!(response.error);
            const data = getOptionallyProtectedValue(param);
            expect(data.problem).toBe(UpdateProblem_objectClassViolation);
        }

        // Commented out because it would be a pain in the ass to test, because I have
        // to change the name, name form, and DIT structure rule.
        // Modify person to remove permitted auxiliary object class
        // {
        //     const reqData: ModifyDNArgumentData = new ModifyDNArgumentData(
        //         compliantEntryDN,
        //         [],
        //         TRUE,
        //     );
        //     const arg: ModifyDNArgument = {
        //         unsigned: reqData,
        //     };
        //     const response = await writeOperation(
        //         connection!,
        //         modifyDN["&operationCode"]!,
        //         _encode_ModifyDNArgument(arg, DER),
        //     );
        //     assert("result" in response);
        //     assert(response.result);
        // }

        // ModifyDN.deleteOldRDN cannot delete a mandatory attribute type

    });

    it("enforces DIT context use rules on entries in a subschema", async () => {
        const testId = `subschema.context-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        const personNameForm = new ObjectIdentifier([ 2, 5, 100, 26729 ]);
        const processNameForm = new ObjectIdentifier([ 2, 5, 100, 6931 ]);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [
                        oid(id_ar_subschemaAdminSpecificArea),
                    ],
                    undefined,
                ),
            ]);
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8("subschema"),
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
                            utf8("subschema"),
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
                        nameForms["&id"],
                        [
                            _encode_NameFormDescription(new NameFormDescription(
                                processNameForm,
                                undefined,
                                undefined,
                                undefined,
                                new NameFormInformation(
                                    applicationProcess["&id"],
                                    [commonName["&id"]],
                                    undefined,
                                ),
                            ), DER),
                            _encode_NameFormDescription(new NameFormDescription(
                                personNameForm,
                                undefined,
                                undefined,
                                undefined,
                                new NameFormInformation(
                                    person["&id"],
                                    [surname["&id"]],
                                    undefined,
                                ),
                            ), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        dITStructureRules["&id"],
                        [
                            _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                                1,
                                processNameForm,
                            ), DER),
                            _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                                2,
                                personNameForm,
                                [1], // People may appear below a process.
                            ), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        dITContextUse["&id"],
                        [
                            _encode_DITContextUseDescription(new DITContextUseDescription(
                                description["&id"],
                                undefined,
                                undefined,
                                undefined,
                                new DITContextUseInformation(
                                    [languageContext["&id"]],
                                    [localeContext["&id"]],
                                ),
                            ), DER),
                        ],
                        undefined,
                    ),
                ],
            );
        }

        // Create person with description with non-permitted context
        {
            const entryName: string = "asdf";
            const reqData: AddEntryArgumentData = new AddEntryArgumentData(
                {
                    rdnSequence: [
                        ...dn,
                        [
                            new AttributeTypeAndValue(
                                surname["&id"],
                                utf8(entryName),
                            ),
                        ],
                    ],
                },
                [
                    new Attribute(
                        objectClass["&id"],
                        [oid(person["&id"])],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(entryName)],
                        undefined,
                    ),
                    new Attribute(
                        surname["&id"],
                        [utf8(entryName)],
                        undefined,
                    ),
                    new Attribute(
                        description["&id"],
                        [],
                        [
                            new Attribute_valuesWithContext_Item(
                                utf8("desc"),
                                [
                                    new Context(
                                        temporalContext["&id"],
                                        [
                                            _encode_TimeSpecification(new TimeSpecification(
                                                {
                                                    absolute: new TimeSpecification_time_absolute(
                                                        new Date(),
                                                        undefined,
                                                    ),
                                                },
                                                FALSE,
                                                undefined,
                                            ), DER),
                                        ],
                                        FALSE,
                                    ),
                                ],
                            ),
                        ],
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
            assert(response.error);
            assert(response.errcode);
            if (!compareCode(response.errcode, attributeError["&errorCode"]!)) {
                console.log("ERROR CODE: ", response.errcode);
            }
            expect(compareCode(response.errcode, attributeError["&errorCode"]!)).toBeTruthy();
            const param = attributeError.decoderFor["&ParameterType"]!(response.error);
            const data = getOptionallyProtectedValue(param);
            expect(data.problems).toHaveLength(1);
            const problem = data.problems[0];
            expect(problem.problem).toBe(AttributeProblem_contextViolation);
            expect(problem.type_.toString()).toBe(description["&id"].toString());
        }

        // Create person with description without mandatory context
        {
            const entryName: string = "asdf";
            const reqData: AddEntryArgumentData = new AddEntryArgumentData(
                {
                    rdnSequence: [
                        ...dn,
                        [
                            new AttributeTypeAndValue(
                                surname["&id"],
                                utf8(entryName),
                            ),
                        ],
                    ],
                },
                [
                    new Attribute(
                        objectClass["&id"],
                        [oid(person["&id"])],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(entryName)],
                        undefined,
                    ),
                    new Attribute(
                        surname["&id"],
                        [utf8(entryName)],
                        undefined,
                    ),
                    new Attribute(
                        description["&id"],
                        [utf8("desc")],
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
            assert(response.error);
            assert(response.errcode);
            expect(compareCode(response.errcode, attributeError["&errorCode"]!)).toBeTruthy();
            const param = attributeError.decoderFor["&ParameterType"]!(response.error);
            const data = getOptionallyProtectedValue(param);
            expect(data.problems).toHaveLength(1);
            const problem = data.problems[0];
            expect(problem.problem).toBe(AttributeProblem_contextViolation);
            expect(problem.type_.toString()).toBe(description["&id"].toString());
        }

        // Create person with description that complies
        const compliantEntryName: string = "compliant";
        const compliantEntryRDN: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                surname["&id"],
                utf8(compliantEntryName),
            ),
        ];
        const compliantEntryDN: DistinguishedName = [
            ...dn,
            compliantEntryRDN,
        ];
        {
            const entryName: string = compliantEntryName;
            const reqData: AddEntryArgumentData = new AddEntryArgumentData(
                {
                    rdnSequence: compliantEntryDN,
                },
                [
                    new Attribute(
                        objectClass["&id"],
                        [oid(person["&id"])],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(entryName)],
                        undefined,
                    ),
                    new Attribute(
                        surname["&id"],
                        [utf8(entryName)],
                        undefined,
                    ),
                    new Attribute(
                        description["&id"],
                        [],
                        [
                            new Attribute_valuesWithContext_Item(
                                utf8("desc"),
                                [
                                    new Context(
                                        languageContext["&id"],
                                        [printable("EN")],
                                        FALSE,
                                    ),
                                    new Context(
                                        localeContext["&id"],
                                        [localeContext.encoderFor["&Type"]!({
                                            localeID2: {
                                                uTF8String: "en-US",
                                            },
                                        }, DER)],
                                        undefined,
                                    ),
                                ],
                            ),
                        ],
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
            assert("result" in response);
            assert(response.result);
        }

        // Add description with non-permitted context
        {
            const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
                {
                    rdnSequence: compliantEntryDN,
                },
                [
                    {
                        addValues: new Attribute(
                            description["&id"],
                            [],
                            [
                                new Attribute_valuesWithContext_Item(
                                    utf8("desc2"),
                                    [
                                        new Context(
                                            temporalContext["&id"],
                                            [
                                                _encode_TimeSpecification(new TimeSpecification(
                                                    {
                                                        absolute: new TimeSpecification_time_absolute(
                                                            new Date(),
                                                            undefined,
                                                        ),
                                                    },
                                                    FALSE,
                                                    undefined,
                                                ), DER),
                                            ],
                                            FALSE,
                                        ),
                                    ],
                                ),
                            ],
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
            assert(response.error);
            assert(response.errcode);
            expect(compareCode(response.errcode, attributeError["&errorCode"]!)).toBeTruthy();
            const param = attributeError.decoderFor["&ParameterType"]!(response.error);
            const data = getOptionallyProtectedValue(param);
            expect(data.problems).toHaveLength(1);
            const problem = data.problems[0];
            expect(problem.problem).toBe(AttributeProblem_contextViolation);
            expect(problem.type_.toString()).toBe(description["&id"].toString());
        }

        // Add description without mandatory context
        {
            const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
                {
                    rdnSequence: compliantEntryDN,
                },
                [
                    {
                        addValues: new Attribute(
                            description["&id"],
                            [utf8("desc2")],
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
            assert(response.error);
            assert(response.errcode);
            expect(compareCode(response.errcode, attributeError["&errorCode"]!)).toBeTruthy();
            const param = attributeError.decoderFor["&ParameterType"]!(response.error);
            const data = getOptionallyProtectedValue(param);
            expect(data.problems).toHaveLength(1);
            const problem = data.problems[0];
            expect(problem.problem).toBe(AttributeProblem_contextViolation);
            expect(problem.type_.toString()).toBe(description["&id"].toString());
        }

        // Add description that complies
        {
            const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
                {
                    rdnSequence: compliantEntryDN,
                },
                [
                    {
                        addValues: new Attribute(
                            description["&id"],
                            [],
                            [
                                new Attribute_valuesWithContext_Item(
                                    utf8("desc2"),
                                    [
                                        new Context(
                                            languageContext["&id"],
                                            [printable("fr")],
                                            FALSE,
                                        ),
                                    ],
                                ),
                            ],
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
            assert("result" in response);
            assert(response.result);
        }

        // ModifyDN.deleteOldRDN will not be tested, because it will require
        // changes to the name, name form, and DIT structure rules.
    });

    it.todo("Ignores obsolete DIT structure rules");
    it.todo("Ignores obsolete DIT content rules");
    it.todo("Ignores obsolete DIT context use rules");
    it.todo("Ignores obsolete friendships");
    it.todo("Observes subschema friendships"); // This is implicitly tested elsewhere, but good to double-check
    it.todo("Does not enforce DIT structure rules on subentries");
    it.todo("Enforces name forms"); // This is already implicitly tested, but good to double-check
    it.todo("Does not loop infinitely if a DIT structure rule references itself as a superior");
    it.todo("Enforces DIT matching rule use"); // Meerkat DSA will definitely fail this, but just keeping this in view.

});
