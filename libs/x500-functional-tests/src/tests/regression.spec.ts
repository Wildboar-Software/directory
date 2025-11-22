import {
    ASN1Construction,
    ASN1Element,
    ASN1TagClass,
    ASN1UniversalType,
    BERElement,
    FALSE_BIT,
    TRUE_BIT,
} from "asn1-ts";
import { BER, DER, _encodeInteger, _encodePrintableString } from "asn1-ts/dist/node/functional";
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
    SearchArgumentData_subset_wholeSubtree,
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
    frame,
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
import { id_mr_systemProposedMatch } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-mr-systemProposedMatch.va";
import { caseExactMatch } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/caseExactMatch.oa";
import { SearchControlOptions, SearchControlOptions_includeAllAreas } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchControlOptions.ta";
import { ListArgumentData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListArgumentData.ta";
import { ListArgument, _encode_ListArgument } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListArgument.ta";
import { _encode_Code, list } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/list.oa";
import { IDM_PDU, Request, _encode_IDM_PDU } from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IDM-PDU.ta";

vi.setConfig({ testTimeout: 30_000 });

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

    test("does not crash after encountering a malformed invoke ID", async () => {
        const reqData = new ListArgumentData(
            {
                rdnSequence: [],
            },
        );
        const arg: ListArgument = {
            unsigned: reqData,
        };
        const iid = new BERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.integer,
            new Uint8Array([ 0x00, 0x00, 0x00, 0x06 ]),
        );
        function create_valid_request () {
            const idm: IDM_PDU = {
                request: new Request(
                    crypto.randomInt(100_000),
                    list["&operationCode"]!,
                    _encode_ListArgument(arg, BER),
                )
            };
            return _encode_IDM_PDU(idm, BER);
        }

        const invalid_pdu = new BERElement(
            ASN1TagClass.context,
            ASN1Construction.constructed,
            3,
            BERElement.fromSequence([
                iid,
                _encode_Code(list["&operationCode"]!, BER),
                _encode_ListArgument(arg, BER),
            ]),
        );
        const pdus = Buffer.concat([
            frame(create_valid_request()),
            frame(create_valid_request()),
            frame(create_valid_request()),
            frame(create_valid_request()),
            frame(create_valid_request()),
            frame(invalid_pdu),
        ]);
        connection?.socket.write(pdus);
        await new Promise((r) => setTimeout(r, 3000));
        await connect();
    });
});
