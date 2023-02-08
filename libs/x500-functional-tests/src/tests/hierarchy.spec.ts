import {
    ASN1Element,
    FALSE_BIT,
    TRUE_BIT,
    ObjectIdentifier,
    OBJECT_IDENTIFIER,
    INTEGER,
    FALSE,
    TRUE,
    BIT_STRING,
} from "asn1-ts";
import {
    DER,
    _encodeObjectIdentifier,
} from "asn1-ts/dist/node/functional";
import {
    IDMConnection,
} from "@wildboar/idm";
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
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeProblem.ta";
import {
    connect,
    createTestNode,
    createTestRDN,
    createEntry,
    createCompoundEntry,
    createTestRootDN,
    createTestRootNode,
    utf8,
    int,
    oid,
} from "../utils";
import {
    tagOid,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/tagOid.oa";
import {
    uiiInUrn,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uiiInUrn.oa";
import { HierarchySelections_self } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/HierarchySelections.ta";

jest.setTimeout(30000);

const serviceControlOptions: ServiceControlOptions = new Uint8ClampedArray(Array(9).fill(FALSE_BIT));
// Necessary to make countries administrative points.
serviceControlOptions[ServiceControlOptions_manageDSAIT] = TRUE_BIT;

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

const parentRDN: RelativeDistinguishedName = [
    new AttributeTypeAndValue(
        organizationName["&id"],
        utf8("Wildboar Software"),
    ),
];

// TODO: You also need to test deduplication.
describe("Meerkat DSA", () => {

    let connection: IDMConnection | undefined;

    beforeEach(async () => {
        if (!connection) {
            connection = await connect();
        }
    });

    test("hierarchy selection 'self' works", async () => {
        const testId = `hierarchy-self-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const subordinates = [
            "E338ECE9-0100-4499-BEEE-2F3F766B669C",
            "837DF269-2A2A-47E6-BA19-3FC65D5D3FA7",
            "6AF6F47F-8432-4CBE-9F2F-7C8C56D4F70A",
        ];
        for (const subordinate_id of subordinates) {
            await createTestNode(connection!, dn, subordinate_id, [
                new Attribute(
                    hierarchyParent["&id"],
                    [hierarchyParent.encoderFor["&Type"]!(dn, DER)],
                ),
            ]);
        }
        const hs: BIT_STRING = new Uint8ClampedArray(10);
        hs[HierarchySelections_self] = TRUE_BIT;
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
            hs,
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

    // test("hierarchy selection 'children' works", async () => {

    // });

    // test("hierarchy selection 'parent' works", async () => {

    // });

    // test("hierarchy selection 'hierarchy' works", async () => {

    // });

    // test("hierarchy selection 'top' works", async () => {

    // });

    // test("hierarchy selection 'subtree' works", async () => {

    // });

    // test("hierarchy selection 'siblings' works", async () => {

    // });

    // test("hierarchy selection 'siblingChildren' works", async () => {

    // });

    // test("hierarchy selection 'siblingSubtree' works", async () => {

    // });

    // test("hierarchy selection 'all' works", async () => {

    // });

});
