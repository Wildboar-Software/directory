import {
    ASN1Element,
    FALSE_BIT,
    TRUE_BIT,
} from "asn1-ts";
import { DER, _encodePrintableString } from "asn1-ts/dist/node/functional";
import {
    IDMConnection,
} from "@wildboar/idm";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import { AttributeTypeAndValue } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
import {
    commonName,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
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
    SearchArgumentData_subset_baseObject,
    SearchArgumentData_subset_oneLevel,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData-subset.ta";
import {
    _decode_SearchResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchResult.ta";
import {
    connect,
    createTestRootDN,
    createTestRootNode,
    utf8,
    createEntry,
    oid,
} from "../utils";
import { RelativeDistinguishedName } from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/RelativeDistinguishedName.ta";
import { countryName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/countryName.oa";
import { description, person, surname } from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/person.oa";
import { objectClass } from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
import { country } from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/country.oa";
import { stateOrProvinceName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/stateOrProvinceName.oa";
import { localityName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/localityName.oa";
import { postalCode } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/postalCode.oa";
import { residentialPerson } from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/residentialPerson.oa";
import { MRMapping, RelaxationPolicy } from "@wildboar/x500/src/lib/modules/ServiceAdministration/RelaxationPolicy.ta";
import { Mapping } from "@wildboar/x500/src/lib/modules/ServiceAdministration/Mapping.ta";
import { id_mr_zonalMatch } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-mr-zonalMatch.va";
import { AttributeValueAssertion } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeValueAssertion.ta";
import { MRSubstitution } from "@wildboar/x500/src/lib/modules/ServiceAdministration/MRSubstitution.ta";
import { wordMatch } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/wordMatch.oa";

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

    test("zonal matching works", async () => {
        const testId = `zonal-matching-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const us_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                countryName["&id"],
                _encodePrintableString("US", DER),
            ),
        ];
        const person_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                _encodePrintableString("Goobis BoBoobis", DER),
            ),
        ];
        await createEntry(connection!, dn, us_rdn, [
            new Attribute(
                objectClass["&id"],
                [oid(country["&id"])],
            ),
            new Attribute(
                countryName["&id"],
                [_encodePrintableString("US", DER)],
            ),
        ]);
        await createEntry(connection!, [...dn, us_rdn], person_rdn, [
            new Attribute(
                objectClass["&id"],
                [
                    oid(person["&id"]),
                    oid(residentialPerson["&id"]),
                ],
            ),
            new Attribute(
                commonName["&id"],
                [_encodePrintableString("Goobis BoBoobis", DER)],
            ),
            new Attribute(
                surname["&id"],
                [_encodePrintableString("BoBoobis", DER)],
            ),
            new Attribute(
                stateOrProvinceName["&id"],
                [utf8("FL")],
            ),
            new Attribute(
                localityName["&id"],
                [utf8("Lutz")],
            ),
            new Attribute(
                postalCode["&id"],
                [utf8("33549")],
            ),
        ]);
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: [...dn, us_rdn],
            },
            SearchArgumentData_subset_oneLevel,
            /* In the absence of zonal matching this filter should NOT match the
            entry we created, but because of zonal matching, the localityName
            assertion should get converted to a postal code assertion. */
            {
                and: [
                    // {
                    //     item: {
                    //         equality: new AttributeValueAssertion(
                    //             countryName["&id"],
                    //             _encodePrintableString("US", DER),
                    //         ),
                    //     },
                    // },
                    {
                        item: {
                            equality: new AttributeValueAssertion(
                                stateOrProvinceName["&id"],
                                utf8("FL"),
                            ),
                        },
                    },
                    {
                        item: {
                            equality: new AttributeValueAssertion(
                                localityName["&id"],
                                utf8("Tampa"),
                            ),
                        },
                    },
                ],
            },
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            new RelaxationPolicy(
                new MRMapping(
                    [new Mapping(
                        id_mr_zonalMatch,
                        9,
                    )],
                    undefined,
                ),
                undefined,
                undefined,
                1,
                1,
            ),
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

    test("matching rule substitution works", async () => {
        const testId = `matching-rule-substitution-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    description["&id"],
                    [utf8("Google audio recording agent installed in your smart toaster (you hereby agree to be monitored)")],
                ),
            ]);
        }
        const dn = createTestRootDN(testId);
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_baseObject,
            {
                item: {
                    equality: new AttributeValueAssertion(
                        description["&id"],
                        utf8("recording"),
                    ),
                },
            },
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            new RelaxationPolicy(
                new MRMapping(
                    undefined,
                    [
                        new MRSubstitution(
                            description["&id"],
                            undefined,
                            wordMatch["&id"],
                        ),
                    ],
                ),
                undefined,
                undefined,
                1,
                1,
            ),
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

});
