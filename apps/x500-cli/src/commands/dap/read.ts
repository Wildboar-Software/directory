import type { Connection, Context } from "../../types";
import { ASN1Construction, ASN1Element, ASN1TagClass, DERElement, ObjectIdentifier, TRUE, TRUE_BIT } from "asn1-ts";
import { DER, _encodeBoolean } from "asn1-ts/dist/node/functional";
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
    ReadResult,
    _decode_ReadResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadResult.ta";
import {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import destringifyDN from "../../utils/destringifyDN";
import stringifyDN from "../../utils/stringifyDN";
import printEntryInformation from "../../printers/EntryInformation";
import {
    AttributeValueAssertion,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeValueAssertion.ta";
import printError from "../../printers/Error_";
import {
    ProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ProtectionRequest.ta";
import {
    SecurityParameters,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityParameters.ta";
import { EOL } from "node:os";
import {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import * as sco from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import { ServiceControls } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControls.ta";
import {
    ServiceControls_priority_low,
    ServiceControls_priority_medium,
    ServiceControls_priority_high,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControls-priority.ta";
import {
    ServiceControls_scopeOfReferral_country,
    ServiceControls_scopeOfReferral_dmd,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControls-scopeOfReferral.ta";
import * as fs from "node:fs/promises";
import { PEMObject } from "pem-ts";

function priorityFromString (str: string): ServiceControls["priority"] {
    switch (str.trim().toLowerCase()) {
        case ("low"): return ServiceControls_priority_low;
        case ("medium"): return ServiceControls_priority_medium;
        case ("high"): return ServiceControls_priority_high;
        default: return ServiceControls_priority_medium;
    }
}

function scopeOfReferralFromString (str: string): ServiceControls["scopeOfReferral"] {
    switch (str.trim().toLowerCase()) {
        case ("dmd"): return ServiceControls_scopeOfReferral_dmd;
        case ("country"): return ServiceControls_scopeOfReferral_country;
        default: return undefined;
    }
}

export
async function do_read (
    ctx: Context,
    conn: Connection,
    argv: any,
): Promise<void> {
    const objectName: DistinguishedName = destringifyDN(ctx, argv.object);
    const eis = new EntryInformationSelection(
        argv.userAttribute
            ? {
                select: argv.userAttribute.map(ObjectIdentifier.fromString),
            }
            : undefined,
        argv.typesOnly,
        argv.extraAttribute
            ? {
                select: argv.extraAttribute.map(ObjectIdentifier.fromString),
            }
            : undefined,
        argv.allContexts
            ? {
                allContexts: null,
            }
            : undefined,
        argv.returnContexts,
    );
    const serviceControlOptions: sco.ServiceControlOptions = new Uint8ClampedArray(15);
    if (argv.preferChaining) {
        serviceControlOptions[sco.ServiceControlOptions_preferChaining] = TRUE_BIT;
    }
    if (argv.chainingProhibited) {
        serviceControlOptions[sco.ServiceControlOptions_chainingProhibited] = TRUE_BIT;
    }
    if (argv.localScope) {
        serviceControlOptions[sco.ServiceControlOptions_localScope] = TRUE_BIT;
    }
    if (argv.dontUseCopy) {
        serviceControlOptions[sco.ServiceControlOptions_dontUseCopy] = TRUE_BIT;
    }
    if (argv.dontDereferenceAliases) {
        serviceControlOptions[sco.ServiceControlOptions_dontDereferenceAliases] = TRUE_BIT;
    }
    if (argv.subentries) {
        serviceControlOptions[sco.ServiceControlOptions_subentries] = TRUE_BIT;
    }
    if (argv.copyShallDo) {
        serviceControlOptions[sco.ServiceControlOptions_copyShallDo] = TRUE_BIT;
    }
    if (argv.partialNameResolution) {
        serviceControlOptions[sco.ServiceControlOptions_partialNameResolution] = TRUE_BIT;
    }
    if (argv.manageDSAIT) {
        serviceControlOptions[sco.ServiceControlOptions_manageDSAIT] = TRUE_BIT;
    }
    if (argv.noSubtypeMatch) {
        serviceControlOptions[sco.ServiceControlOptions_noSubtypeMatch] = TRUE_BIT;
    }
    if (argv.noSubtypeSelection) {
        serviceControlOptions[sco.ServiceControlOptions_noSubtypeSelection] = TRUE_BIT;
    }
    if (argv.countFamily) {
        serviceControlOptions[sco.ServiceControlOptions_countFamily] = TRUE_BIT;
    }
    if (argv.dontSelectFriends) {
        serviceControlOptions[sco.ServiceControlOptions_dontSelectFriends] = TRUE_BIT;
    }
    if (argv.dontMatchFriends) {
        serviceControlOptions[sco.ServiceControlOptions_dontMatchFriends] = TRUE_BIT;
    }
    if (argv.allowWriteableCopy) {
        serviceControlOptions[sco.ServiceControlOptions_allowWriteableCopy] = TRUE_BIT;
    }
    const serviceControls = new ServiceControls(
        serviceControlOptions,
        argv.priority
            ? priorityFromString(argv.priority)
            : undefined,
        argv.timeLimit,
        argv.sizeLimit,
        argv.scopeOfReferral
            ? scopeOfReferralFromString(argv.scopeOfReferral)
            : undefined,
        argv.attributeSizeLimit,
        undefined, // FIXME:
        argv.serviceType
            ? ObjectIdentifier.fromString(argv.serviceType)
            : undefined,
        argv.userClass,
    );
    const extensions: ASN1Element[] = [];
    if (argv.attrCert) {
        const attrCert = new DERElement();
        attrCert.tagClass = ASN1TagClass.private;
        attrCert.construction = ASN1Construction.constructed;
        attrCert.tagNumber = 0;
        attrCert.value = DERElement.fromSet([
            new DERElement(
                ASN1TagClass.context,
                ASN1Construction.constructed,
                0,
                _encodeBoolean(argv.singleUse, DER),
            ),
            new DERElement(
                ASN1TagClass.context,
                ASN1Construction.constructed,
                1,
                _encodeBoolean(argv.noAssertion, DER),
            ),
        ]).toBytes();
        extensions.push(attrCert);
    }
    const reqData: ReadArgumentData = new ReadArgumentData(
        {
            rdnSequence: objectName,
        },
        eis,
        argv.modifyRights,
        extensions,
        serviceControls,
        new SecurityParameters(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            ProtectionRequest_signed,
        ),
    );
    const arg: ReadArgument = {
        unsigned: reqData,
    };
    const outcome = await conn.writeOperation({
        opCode: read["&operationCode"]!,
        argument: _encode_ReadArgument(arg, DER),
    });
    if ("error" in outcome) {
        printError(ctx, outcome);
        return;
    }
    if (!outcome.result) {
        ctx.log.error("Invalid server response: no result data.");
        return;
    }
    const result: ReadResult = _decode_ReadResult(outcome.result);
    const resData = getOptionallyProtectedValue(result);
    if ("signed" in result) {
        ctx.log.info("This response was signed.");
    }
    if (resData.aliasDereferenced === TRUE) {
        ctx.log.info("An alias was dereferenced.");
    }
    if (resData.performer) {
        console.log("Operation performed by: " + stringifyDN(ctx, resData.performer));
    }
    console.log(printEntryInformation(ctx, resData.entry) + EOL);
    if (resData.modifyRights) {
        console.log("----- Modify Rights -----");
        resData.modifyRights.forEach((mr) => {
            const add = Boolean(mr.permission[0]);
            const delete_ = Boolean(mr.permission[1]);
            const rename = Boolean(mr.permission[2]);
            const move = Boolean(mr.permission[3]);
            const permissions: string[] = [];
            if (add) {
                permissions.push("ADD");
            }
            if (delete_) {
                permissions.push("DELETE");
            }
            if (rename) {
                permissions.push("RENAME");
            }
            if (move) {
                permissions.push("MOVE");
            }
            if ("entry" in mr.item) {
                console.log(`ENTRY:\t\t${permissions.join(", ")}`);
            }
            else if ("attribute" in mr.item) {
                console.log(`Attribute ${mr.item.attribute}:\t\t${permissions.join(", ")}`);
            }
            else if ("value" in mr.item && (mr.item.value instanceof AttributeValueAssertion)) {
                console.log(`Value of type ${mr.item.value.type_}:\t\t${permissions.join(", ")}`);
            }
            else {
                console.log("Not understood item in modifyRights.");
            }
        })
    }
    const attrCertBytes = resData._unrecognizedExtensionsList.find((ext) => (
        (ext.tagClass === ASN1TagClass.private)
        && (ext.tagNumber === 0)
    ))?.octetString;
    if (argv.attrCert && attrCertBytes) {
        const pem = new PEMObject("ATTRIBUTE CERTIFICATE", attrCertBytes);
        await fs.writeFile(argv.attrCert, pem.encoded);
        console.log(`Saved attribute certificate to ${argv.attrCert}.`);
    }
}

export default do_read;
