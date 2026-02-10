import process from "node:process";
import type { Connection, Context } from "../../types.js";
import { TRUE_BIT } from "@wildboar/asn1";
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
import {
    _decode_AddEntryResult,
} from "@wildboar/x500/DirectoryAbstractService";
import type {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import type {
    Attribute,
} from "@wildboar/x500/InformationFramework";
import { DER } from "@wildboar/asn1/functional";
import destringifyDN from "../../utils/destringifyDN.js";
import printError from "../../printers/Error_.js";
import {
    AccessPoint,
} from "@wildboar/x500/DistributedOperations";
import {
    PresentationAddress,
} from "@wildboar/x500/SelectedAttributeTypes";
import { uriToNSAP } from "@wildboar/x500"
import type { ArgumentsCamelCase } from "yargs";
import type { CommonAddOptions } from "../../yargs/add_common_add_opts.js";
import {
    ServiceControls,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ServiceControlOptions,
    ServiceControlOptions_preferChaining,
    ServiceControlOptions_chainingProhibited,
    ServiceControlOptions_manageDSAIT,
    ServiceControlOptions_localScope,
    ServiceControlOptions_dontDereferenceAliases,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ServiceControls_priority,
    ServiceControls_priority_low,
    ServiceControls_priority_medium,
    ServiceControls_priority_high
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ServiceControls_scopeOfReferral,
    ServiceControls_scopeOfReferral_country,
    ServiceControls_scopeOfReferral_dmd,
} from "@wildboar/x500/DirectoryAbstractService";
import { getOptionallyProtectedValue } from "@wildboar/x500";

function priorityFromString (str?: string): ServiceControls_priority {
    if (!str) {
        return ServiceControls_priority_medium;
    }
    switch (str.trim().toLowerCase()) {
        case ("low"): return ServiceControls_priority_low;
        case ("medium"): return ServiceControls_priority_medium;
        case ("high"): return ServiceControls_priority_high;
        default: return ServiceControls_priority_medium;
    }
}

function scopeOfReferralFromString (str?: string): ServiceControls_scopeOfReferral | undefined {
    if (!str) {
        return undefined;
    }
    switch (str.trim().toLowerCase()) {
        case ("dmd"): return ServiceControls_scopeOfReferral_dmd;
        case ("country"): return ServiceControls_scopeOfReferral_country;
        default: return undefined;
    }
}

const msg1 = [
    "You must provide both the `target-naddr` option and `target-ae-title` "
    + "option if you wish to use the `targetSystem` parameter to add an entry "
    + "in another DSA."
].join("");

export
async function do_addEntry (
    ctx: Context,
    conn: Connection,
    argv: ArgumentsCamelCase<CommonAddOptions> & Record<string, any>,
    attributes: Attribute[],
): Promise<void> {
    const objectName: DistinguishedName = destringifyDN(ctx, argv.object);
    if (
        (!argv["target-naddr"]?.length && argv["target-ae-title"])
        || (argv["target-naddr"]?.length && !argv["target-ae-title"])
    ) {
        ctx.log.error(msg1);
        process.exit(1);
    }
    const targetSystem: AccessPoint | undefined = (argv["target-naddr"]?.length && argv["target-ae-title"])
        ? new AccessPoint(
            {
                rdnSequence: destringifyDN(ctx, argv["target-ae-title"]),
            },
            new PresentationAddress(
                undefined,
                undefined,
                undefined,
                argv["target-naddr"].map((url: string) => uriToNSAP(url, false)),
            ),
            undefined,
        )
        : undefined;
    const serviceControlOptions: ServiceControlOptions = new Uint8ClampedArray(15);
    if (argv.preferChaining) {
        serviceControlOptions[ServiceControlOptions_preferChaining] = TRUE_BIT;
    }
    if (argv.chainingProhibited) {
        serviceControlOptions[ServiceControlOptions_chainingProhibited] = TRUE_BIT;
    }
    if (argv.localScope) {
        serviceControlOptions[ServiceControlOptions_localScope] = TRUE_BIT;
    }
    if (argv.dontDereferenceAliases) {
        serviceControlOptions[ServiceControlOptions_dontDereferenceAliases] = TRUE_BIT;
    }
    if (argv.manageDSAIT) {
        serviceControlOptions[ServiceControlOptions_manageDSAIT] = TRUE_BIT;
    }
    const reqData = new AddEntryArgumentData(
        {
            rdnSequence: objectName,
        },
        attributes,
        targetSystem,
        [],
        new ServiceControls(
            serviceControlOptions,
            priorityFromString(argv.priority),
            argv.timeLimit,
            undefined,
            scopeOfReferralFromString(argv.scopeOfReferral),
        ),
    );
    const arg: AddEntryArgument = {
        unsigned: reqData,
    };
    const outcome = await conn.writeOperation({
        opCode: addEntry["&operationCode"]!,
        argument: _encode_AddEntryArgument(arg, DER),
    });
    if ("error" in outcome) {
        printError(ctx, outcome);
        return;
    }
    if (!outcome.result) {
        ctx.log.error("Invalid server response: no result data.");
        return;
    }
    const result = _decode_AddEntryResult(outcome.result);
    if (!("information" in result)) {
        ctx.log.info("Entry created.");
        return;
    }
    const info = result.information;
    const data = getOptionallyProtectedValue(info);
    if (data.aliasDereferenced) {
        ctx.log.info("Alias dereferenced.");
    }
    ctx.log.info("Entry created.");
}

export default do_addEntry;
