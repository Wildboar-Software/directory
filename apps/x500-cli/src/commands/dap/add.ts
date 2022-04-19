import type { Connection, Context } from "../../types";
import { TRUE_BIT } from "asn1-ts";
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
import type {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import { DER } from "asn1-ts/dist/node/functional";
import destringifyDN from "../../utils/destringifyDN";
import printError from "../../printers/Error_";
import {
    AccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import {
    PresentationAddress,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/PresentationAddress.ta";
import { uriToNSAP } from "@wildboar/x500/src/lib/distributed/uri"
import type { ArgumentsCamelCase } from "yargs";
import type { CommonAddOptions } from "../../yargs/add_common_add_opts";
import {
    ServiceControls,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControls.ta";
import {
    ServiceControlOptions,
    ServiceControlOptions_preferChaining,
    ServiceControlOptions_chainingProhibited,
    ServiceControlOptions_manageDSAIT,
    ServiceControlOptions_localScope,
    ServiceControlOptions_dontDereferenceAliases,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import {
    ServiceControls_priority,
    ServiceControls_priority_low,
    ServiceControls_priority_medium,
    ServiceControls_priority_high
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControls-priority.ta";
import {
    ServiceControls_scopeOfReferral,
    ServiceControls_scopeOfReferral_country,
    ServiceControls_scopeOfReferral_dmd,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControls-scopeOfReferral.ta";

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

export
async function do_addEntry (
    ctx: Context,
    conn: Connection,
    argv: ArgumentsCamelCase<CommonAddOptions> & Record<string, any>,
    attributes: Attribute[],
): Promise<void> {
    const objectName: DistinguishedName = destringifyDN(ctx, argv.object);
    const targetSystem: AccessPoint | undefined = argv.targetSystem
        ? new AccessPoint(
            {
                rdnSequence: [],
            },
            new PresentationAddress(
                undefined,
                undefined,
                undefined,
                argv.targetSystem.map((url: string) => uriToNSAP(url, false)),
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
    ctx.log.info("Entry created.");
}

export default do_addEntry;
