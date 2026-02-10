import type { Connection, Context } from "../../types.js";
import {
    TRUE_BIT,
    FALSE_BIT,
    unpackBits,
} from "@wildboar/asn1";
import { randomBytes } from "node:crypto";
import {
    addEntry,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    AddEntryArgument,
    _encode_AddEntryArgument,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    AddEntryArgumentData,
} from "@wildboar/x500/DirectoryAbstractService";
import type {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import destringifyDN from "../../utils/destringifyDN.js";
import {
    Attribute,
} from "@wildboar/x500/InformationFramework";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/InformationFramework";
import { attributes as selat } from "@wildboar/x500";
import { objectClasses as seloc } from "@wildboar/x500";
import {
    id_ar_collectiveAttributeSpecificArea,
} from "@wildboar/x500/InformationFramework";
import {
    subentry,
} from "@wildboar/x500/InformationFramework";
import {
    collectiveAttributeSubentry,
} from "@wildboar/x500/InformationFramework";
import {
    SubtreeSpecification,
    _encode_SubtreeSpecification,
} from "@wildboar/x500/InformationFramework";
import {
    ServiceControls,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ServiceControlOptions,
    ServiceControlOptions_manageDSAIT,
} from "@wildboar/x500/DirectoryAbstractService";
import { SecurityParameters } from "@wildboar/x500/DirectoryAbstractService";
import {
    ProtectionRequest_none,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ErrorProtectionRequest_none,
} from "@wildboar/x500/DirectoryAbstractService";
import printCode from "../../printers/Code.js";
import countries from "i18n-iso-countries";
import {
    DER,
    _encodeObjectIdentifier,
    _encodePrintableString,
    _encodeUTF8String,
    // _encodeNumericString,
} from "@wildboar/asn1/functional";
import { addHours } from "date-fns";

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
            generalizedTime: addHours(new Date(), 1),
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
    const c2 = _encodePrintableString(iso2c, DER);
    // const c3 = _encodePrintableString(countries.alpha2ToAlpha3(iso2c), DER);
    // const n = _encodeNumericString(countries.alpha2ToNumeric(iso2c), DER);
    const dn: DistinguishedName = [
        ...baseObject,
        [
            new AttributeTypeAndValue(
                selat.countryName["&id"]!,
                c2,
            ),
        ],
    ];
    const attributes: Attribute[] = [
        new Attribute(
            selat.administrativeRole["&id"]!,
            [
                _encodeObjectIdentifier(id_ar_collectiveAttributeSpecificArea, DER),
            ],
            undefined,
        ),
        new Attribute(
            selat.objectClass["&id"],
            [
                _encodeObjectIdentifier(seloc.country["&id"]!, DER),
            ],
            undefined,
        ),
        new Attribute(
            selat.countryName["&id"]!,
            [c2],
            undefined,
        ),
        // new Attribute(
        //     selat.countryCode3c["&id"]!,
        //     [c3],
        //     undefined,
        // ),
        // new Attribute(
        //     selat.countryCode3n["&id"]!,
        //     [n],
        //     undefined,
        // ),
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
    const c2 = _encodePrintableString(iso2c, DER);
    const cn = _encodeUTF8String(`${iso2c} Country Collective Attributes`, DER);
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
    const attributes: Attribute[] = [
        new Attribute(
            selat.objectClass["&id"],
            [
                _encodeObjectIdentifier(subentry["&id"], DER),
                _encodeObjectIdentifier(collectiveAttributeSubentry["&id"], DER),
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
            [
                _encode_SubtreeSpecification(new SubtreeSpecification(
                    undefined,
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
