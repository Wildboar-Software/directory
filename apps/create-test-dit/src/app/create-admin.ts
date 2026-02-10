import process from "node:process";
import type { Connection, Context } from "./types.js";
import {
    TRUE_BIT,
    FALSE_BIT,
    unpackBits,
    BERElement,
} from "@wildboar/asn1";
import * as fs from "node:fs";
import * as path from "node:path";
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
import {
    Attribute,
} from "@wildboar/x500/InformationFramework";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/InformationFramework";
import { attributes as selat } from "@wildboar/x500";
import { objectClasses as seloc } from "@wildboar/x500";
import {
    ServiceControls,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ServiceControlOptions,
    ServiceControlOptions_manageDSAIT,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    SecurityParameters,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ProtectionRequest_none,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ErrorProtectionRequest_none,
} from "@wildboar/x500/DirectoryAbstractService";
import printCode from "./printCode.js";
import {
    DER,
    _encodeObjectIdentifier,
    _encodeUTF8String,
} from "@wildboar/asn1/functional";
import {
    id_ar_autonomousArea,
} from "@wildboar/x500/InformationFramework";
import { compareCode } from "@wildboar/x500";
import {
    updateError,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    securityError,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    UpdateProblem_entryAlreadyExists,
} from "@wildboar/x500/DirectoryAbstractService";
import { getOptionallyProtectedValue } from "@wildboar/x500";
import {
    _decode_Certificate,
} from "@wildboar/x500/AuthenticationFramework";
import { PEMObject } from "@wildboar/pem";
import { addHours } from "date-fns";

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
            generalizedTime: addHours(new Date(), 1),
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
    const certFilePath: string = path.resolve(path.join("data", "keypair", "cert.pem"));
    const certFile: string = fs.readFileSync(certFilePath, { encoding: "utf-8" });
    const certPems = PEMObject.parse(certFile);
    const certs = certPems.map((certPem) => {
        const el = new BERElement();
        el.fromBytes(certPem.data);
        return _decode_Certificate(el);
    });
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
                _encodeObjectIdentifier(seloc.pkiCertPath["&id"]!, DER),
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
    if (certs.length) {
        attributes.push(new Attribute(
            selat.pkiPath["&id"],
            [
                selat.pkiPath.encoderFor["&Type"]!(certs.reverse(), DER),
            ],
        ));
    }
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
    const createAdminArg = addAdminArgument([], TEMPORARY_PASSWORD);
    const outcome = await conn.writeOperation({
        opCode: addEntry["&operationCode"],
        argument: _encode_AddEntryArgument(createAdminArg, DER),
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
                process.exit(6642);
            }
            const param = updateError.decoderFor["&ParameterType"]!(outcome.error);
            const data = getOptionallyProtectedValue(param);
            if (data.problem === UpdateProblem_entryAlreadyExists) {
                return {
                    password: TEMPORARY_PASSWORD,
                };
            }
            ctx.log.error(printCode(outcome.errcode));
            process.exit(747);
        } else {
            ctx.log.error("Uncoded error.");
            process.exit(787);
        }
    }
    // FIXME: You MUST add access controls to prevent others from modifying this entry.
    return {
        password: TEMPORARY_PASSWORD,
    };
}

export default createAdmin;
