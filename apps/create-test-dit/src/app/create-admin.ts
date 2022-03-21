import type { Connection, Context } from "./types";
import {
    TRUE_BIT,
    FALSE_BIT,
    unpackBits,
} from "asn1-ts";
import { randomBytes } from "crypto";
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
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
import * as selat from "@wildboar/x500/src/lib/collections/attributes";
import * as seloc from "@wildboar/x500/src/lib/collections/objectClasses";
import {
    ServiceControls,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControls.ta";
import {
    ServiceControlOptions,
    ServiceControlOptions_manageDSAIT,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import {
    SecurityParameters,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityParameters.ta";
import {
    ProtectionRequest_none,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ProtectionRequest.ta";
import {
    ErrorProtectionRequest_none,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ErrorProtectionRequest.ta";
import printCode from "./printCode";
import {
    DER,
    _encodeObjectIdentifier,
    _encodeUTF8String,
} from "asn1-ts/dist/node/functional";
import {
    id_ar_autonomousArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-autonomousArea.va";
import compareCode from "@wildboar/x500/src/lib/utils/compareCode";
import {
    updateError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/updateError.oa";
import {
    securityError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/securityError.oa";
import {
    UpdateProblem_entryAlreadyExists,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateProblem.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";

const TEMPORARY_PASSWORD: string = "asdf";

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

function addAdminArgument (
    baseObject: DistinguishedName,
    password: string,
): AddEntryArgument {
    const dn: DistinguishedName = [
        ...baseObject,
        [
            new AttributeTypeAndValue(
                selat.commonName["&id"]!,
                _encodeUTF8String("admin", DER),
            ),
        ],
    ];
    const attributes: Attribute[] = [
        new Attribute(
            selat.administrativeRole["&id"]!,
            [
                _encodeObjectIdentifier(id_ar_autonomousArea, DER),
            ],
            undefined,
        ),
        new Attribute(
            selat.objectClass["&id"],
            [
                _encodeObjectIdentifier(seloc.person["&id"]!, DER),
                _encodeObjectIdentifier(seloc.userPwdClass["&id"]!, DER),
            ],
            undefined,
        ),
        new Attribute(
            selat.commonName["&id"]!,
            [
                _encodeUTF8String("admin", DER),
            ],
            undefined,
        ),
        new Attribute(
            selat.surname["&id"]!,
            [
                _encodeUTF8String("admin", DER),
            ],
            undefined,
        ),
        new Attribute(
            selat.userPwd["&id"],
            [
                selat.userPwd.encoderFor["&Type"]!({
                    clear: password,
                }, DER),
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
        ),
    };
}

export
async function createAdmin (
    ctx: Context,
    conn: Connection,
): Promise<{ password: string }> {
    const createCountry = addAdminArgument([], TEMPORARY_PASSWORD);
    const outcome = await conn.writeOperation({
        opCode: addEntry["&operationCode"],
        argument: _encode_AddEntryArgument(createCountry, DER),
    });
    if ("error" in outcome) {
        if (outcome.errcode) {
            if (compareCode(outcome.errcode, securityError["&errorCode"]!)) {
                return {
                    password: TEMPORARY_PASSWORD,
                };
            }
            if (!compareCode(outcome.errcode, updateError["&errorCode"]!)) {
                ctx.log.error(printCode(outcome.errcode));
                process.exit(1);
            }
            const param = updateError.decoderFor["&ParameterType"]!(outcome.error);
            const data = getOptionallyProtectedValue(param);
            if (data.problem === UpdateProblem_entryAlreadyExists) {
                return {
                    password: TEMPORARY_PASSWORD,
                };
            }
            ctx.log.error(printCode(outcome.errcode));
            process.exit(1);
        } else {
            ctx.log.error("Uncoded error.");
            process.exit(1);
        }
    }
    // FIXME: You MUST add access controls to prevent others from modifying this entry.
    return {
        password: TEMPORARY_PASSWORD,
    };
}

export default createAdmin;
