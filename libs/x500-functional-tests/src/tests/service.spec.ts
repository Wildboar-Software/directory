import {
    ASN1Element,
    FALSE_BIT,
    ObjectIdentifier,
    TRUE_BIT,
} from "asn1-ts";
import { DER } from "asn1-ts/dist/node/functional";
import {
    IDMConnection,
} from "@wildboar/idm";
import * as crypto from "crypto";
import type { ResultOrError } from "@wildboar/x500/src/lib/types/ResultOrError";
import {
    ServiceControlOptions,
    ServiceControlOptions_manageDSAIT,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import type {
    Code,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
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
    SearchArgumentData_subset_oneLevel,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData-subset.ta";
import {
    _decode_SearchResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchResult.ta";
import {
    connect,
    createTestNode,
    createTestRootDN,
    createTestRootNode,
    utf8,
    createEntry,
    oid,
} from "../utils";
import { RelativeDistinguishedName } from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/RelativeDistinguishedName.ta";
import { AttributeTypeAndValue } from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/AttributeTypeAndValue.ta";
import { commonName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
import { Attribute } from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import { searchRules } from "@wildboar/x500/src/lib/modules/InformationFramework/searchRules.oa";
import { SearchRuleDescription } from "@wildboar/x500/src/lib/modules/InformationFramework/SearchRuleDescription.ta";
import { objectClass } from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
import { subentry, subtreeSpecification } from "@wildboar/x500/src/lib/modules/InformationFramework/subentry.oa";
import { serviceAdminSubentry } from "@wildboar/x500/src/lib/modules/InformationFramework/serviceAdminSubentry.oa";
import { SubtreeSpecification } from "@wildboar/x500/src/lib/modules/InformationFramework/SubtreeSpecification.ta";

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

describe("Meerkat DSA", () => {

    let connection: IDMConnection | undefined;

    beforeEach(async () => {
        if (!connection) {
            connection = await connect();
        }
    });

    test("search rules can allow certain searches", async () => {
        const testId = `search-rule-allowed-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, undefined, undefined, true);
        }
        const dn = createTestRootDN(testId);

        const service_subentry_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("Service Admin"),
            ),
        ];
        await createEntry(
            connection!,
            dn,
            service_subentry_rdn,
            [
                new Attribute(
                    objectClass["&id"],
                    [
                        oid(subentry["&id"]),
                        oid(serviceAdminSubentry["&id"]),
                    ],
                ),
                new Attribute(
                    commonName["&id"],
                    [utf8("Service Admin")],
                ),
                new Attribute(
                    subtreeSpecification["&id"],
                    [subtreeSpecification.encoderFor["&Type"]!(new SubtreeSpecification(), DER)],
                ),
                new Attribute(
                    searchRules["&id"],
                    [
                        searchRules.encoderFor["&Type"]!(new SearchRuleDescription(
                            1,
                            new ObjectIdentifier([ 1, 3, 4, 6, 1 ]),
                            new ObjectIdentifier([ 1, 3, 4, 6, 1, 4, 555 ]),
                            4,
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
                            new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, FALSE_BIT ]), // baseObject and oneLevel
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                        ), DER),
                    ],
                ),
            ],
        );

        const subordinates = [
            "E338ECE9-0100-4499-BEEE-2F3F766B669C",
            "837DF269-2A2A-47E6-BA19-3FC65D5D3FA7",
            "6AF6F47F-8432-4CBE-9F2F-7C8C56D4F70A",
        ];
        for (const subordinate_id of subordinates) {
            await createTestNode(connection!, dn, subordinate_id);
        }
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
                expect(resData.searchInfo.entries.length).toBe(3);
            } else {
                expect(false).toBeFalsy();
            }
        } else {
            expect(false).toBeTruthy();
        }
    });

});
