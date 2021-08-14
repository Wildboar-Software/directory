import type { Connection, Context } from "../../../types";
import {
    DERElement,
    ASN1TagClass,
    ASN1Construction,
    ASN1UniversalType,
    TRUE_BIT,
    FALSE_BIT,
    OBJECT_IDENTIFIER,
    unpackBits,
} from "asn1-ts";
import { randomBytes } from "crypto";
import { DER } from "asn1-ts/dist/node/functional";
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
    AddEntryResult,
    _decode_AddEntryResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AddEntryResult.ta";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import destringifyDN from "../../../utils/destringifyDN";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
import {
    DSEType,
    DSEType_admPoint,
    DSEType_entry,
    DSEType_subentry,
} from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/DSEType.ta";
import * as selat from "@wildboar/x500/src/lib/collections/attributes";
import * as seloc from "@wildboar/x500/src/lib/collections/objectClasses";
import {
    id_ar_collectiveAttributeSpecificArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-collectiveAttributeSpecificArea.va";
import {
    subentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/subentry.oa";
import {
    collectiveAttributeSubentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/collectiveAttributeSubentry.oa";
import {
    SubtreeSpecification,
    _encode_SubtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/SubtreeSpecification.ta";
import {
    ServiceControls,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControls.ta";
import {
    ServiceControlOptions,
    ServiceControlOptions_manageDSAIT,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import { SecurityParameters } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityParameters.ta";
import {
    ProtectionRequest_none,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ProtectionRequest.ta";
import {
    ErrorProtectionRequest_none,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ErrorProtectionRequest.ta";
import printCode from "../../../printers/Code";
import countries from "i18n-iso-countries";


interface Country {
    c2: string;
    c3: string;
    n: number;
}

function printableString (str: string): DERElement {
    return new DERElement(
        ASN1TagClass.universal,
        ASN1Construction.primitive,
        ASN1UniversalType.printableString,
        str,
    );
}

function utf8String (str: string): DERElement {
    return new DERElement(
        ASN1TagClass.universal,
        ASN1Construction.primitive,
        ASN1UniversalType.utf8String,
        str,
    );
}

function numString (str: string): DERElement {
    return new DERElement(
        ASN1TagClass.universal,
        ASN1Construction.primitive,
        ASN1UniversalType.numericString,
        str,
    );
}

function oid (o: OBJECT_IDENTIFIER): DERElement {
    return new DERElement(
        ASN1TagClass.universal,
        ASN1Construction.primitive,
        ASN1UniversalType.objectIdentifier,
        o,
    );
}

// const countries: Country[] = [
//     {
//         c2: "US",
//         c3: "USA",
//         n: 840,
//     },
// ];

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

function securityParameters (): SecurityParameters {
    return new SecurityParameters(
        undefined,
        undefined, // DSA name
        {
            generalizedTime: new Date(),
        },
        unpackBits(randomBytes(16)),
        ProtectionRequest_none,
        addEntry["&operationCode"]!,
        ErrorProtectionRequest_none,
        undefined,
    );
}

function addCountryArgument (
    baseObject: DistinguishedName,
    iso2c: string,
): AddEntryArgument {
    const c2 = printableString(iso2c);
    const c3 = printableString(countries.alpha2ToAlpha3(iso2c));
    const n = numString(countries.alpha2ToNumeric(iso2c));
    const dn: DistinguishedName = [
        ...baseObject,
        [
            new AttributeTypeAndValue(
                selat.countryName["&id"]!,
                c2,
            ),
        ],
    ];
    const dseType: DSEType = new Uint8ClampedArray(Array(10).fill(FALSE_BIT));
    dseType[DSEType_entry] = TRUE_BIT;
    dseType[DSEType_admPoint] = TRUE_BIT;
    const attributes: Attribute[] = [
        new Attribute(
            selat.dseType["&id"]!,
            [selat.dseType.encoderFor["&Type"]!(dseType, DER)],
            undefined,
        ),
        new Attribute(
            selat.administrativeRole["&id"]!,
            [
                oid(id_ar_collectiveAttributeSpecificArea),
            ],
            undefined,
        ),
        new Attribute(
            selat.objectClass["&id"],
            [
                oid(seloc.country["&id"]!),
                oid(seloc.organization["&id"]!),
            ],
            undefined,
        ),
        new Attribute(
            selat.organizationName["&id"]!,
            [utf8String(iso2c + " Government")],
            undefined,
        ),
        new Attribute(
            selat.countryName["&id"]!,
            [c2],
            undefined,
        ),
        new Attribute(
            selat.countryCode3c["&id"]!,
            [c3],
            undefined,
        ),
        new Attribute(
            selat.countryCode3n["&id"]!,
            [n],
            undefined,
        ),
    ];
    return {
        unsigned: new AddEntryArgumentData(
            {
                rdnSequence: dn,
            },
            attributes,
            undefined,
            [],
            serviceControls,
            securityParameters(),
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
        ),
    };
}

function addCountrySubentryArgument (
    baseObject: DistinguishedName,
    iso2c: string,
): AddEntryArgument {
    const c2 = printableString(iso2c);
    const cn = utf8String(`${iso2c} Country Collective Attributes`);
    const dn: DistinguishedName = [
        ...baseObject,
        [
            new AttributeTypeAndValue(
                selat.countryName["&id"]!,
                c2,
            ),
        ],
        [
            new AttributeTypeAndValue(
                selat.commonName["&id"]!,
                cn,
            ),
        ],
    ];
    const dseType: DSEType = new Uint8ClampedArray(Array(10).fill(FALSE_BIT));
    dseType[DSEType_subentry] = TRUE_BIT;
    const attributes: Attribute[] = [
        new Attribute(
            selat.dseType["&id"],
            [selat.dseType.encoderFor["&Type"]!(dseType, DER)],
            undefined,
        ),
        new Attribute(
            selat.objectClass["&id"],
            [
                oid(subentry["&id"]),
                oid(collectiveAttributeSubentry["&id"]),
            ],
            undefined,
        ),
        new Attribute(
            selat.commonName["&id"],
            [cn],
            undefined,
        ),
        new Attribute(
            selat.subtreeSpecification["&id"],
            [ // TODO: X.500 everythingBelow(DN)
                _encode_SubtreeSpecification(new SubtreeSpecification(
                    dn.slice(0, -1),
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    [],
                ), DER),
            ],
            undefined,
        ),
    ];
    return {
        unsigned: new AddEntryArgumentData(
            {
                rdnSequence: dn,
            },
            attributes,
            undefined,
            [],
            serviceControls,
            securityParameters(),
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
        ),
    };
}

export
async function do_seedCountries (
    ctx: Context,
    conn: Connection,
    argv: any,
): Promise<void> {
    const baseObject: DistinguishedName = destringifyDN(ctx, argv.base);
    for (const country of Object.keys(countries.getAlpha2Codes())) {
        { // Create the country entry / administrative point.
            const createCountry = addCountryArgument(baseObject, country);
            const outcome = await conn.writeOperation({
                opCode: addEntry["&operationCode"],
                argument: _encode_AddEntryArgument(createCountry, DER),
            });
            if ("error" in outcome) {
                if (outcome.errcode) {
                    ctx.log.error(printCode(outcome.errcode));
                    process.exit(1);
                } else {
                    ctx.log.error("Uncoded error.");
                    process.exit(1);
                }
            }
            ctx.log.info(`Created country ${country}.`);
        }
        { // Create the collective attribute subentry.
            const createSubentry = addCountrySubentryArgument(baseObject, country);
            const outcome = await conn.writeOperation({
                opCode: addEntry["&operationCode"],
                argument: _encode_AddEntryArgument(createSubentry, DER),
            });
            if ("error" in outcome) {
                if (outcome.errcode) {
                    ctx.log.error(printCode(outcome.errcode));
                    process.exit(1);
                } else {
                    ctx.log.error("Uncoded error.");
                    process.exit(1);
                }
            }
            ctx.log.info(`Created subentry for country ${country}.`);
        }
    }
}

export default do_seedCountries;
