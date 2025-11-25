import type { Connection, Context } from "../../types.js";
import { ObjectIdentifier, TRUE_BIT } from "@wildboar/asn1";
import { DER } from "@wildboar/asn1/functional";
import {
    list,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ListArgument,
    _encode_ListArgument,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ListArgumentData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ListResult,
    _decode_ListResult,
} from "@wildboar/x500/DirectoryAbstractService";
import type {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import {
    ServiceControls,
} from "@wildboar/x500/DirectoryAbstractService";
import destringifyDN from "../../utils/destringifyDN.js";
import printError from "../../printers/Error_.js";
import {
    PagedResultsRequest,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    PagedResultsRequest_newRequest,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ServiceControlOptions,
    ServiceControlOptions_preferChaining,
    ServiceControlOptions_chainingProhibited,
    ServiceControlOptions_localScope,
    // ServiceControlOptions_dontUseCopy,
    ServiceControlOptions_dontDereferenceAliases,
    ServiceControlOptions_subentries,
    ServiceControlOptions_copyShallDo,
    ServiceControlOptions_partialNameResolution,
    ServiceControlOptions_manageDSAIT,
    // ServiceControlOptions_noSubtypeMatch,
    // ServiceControlOptions_noSubtypeSelection,
    ServiceControlOptions_countFamily,
    // ServiceControlOptions_dontSelectFriends,
    // ServiceControlOptions_dontMatchFriends,
    // ServiceControlOptions_allowWriteableCopy,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ServiceControls_priority_low,
    ServiceControls_priority_medium,
    ServiceControls_priority_high,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ServiceControls_scopeOfReferral_country,
    ServiceControls_scopeOfReferral_dmd,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ProtectionRequest_signed,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ErrorProtectionRequest_signed,
    SecurityParameters,
} from "@wildboar/x500/DirectoryAbstractService";
import { print as printListResult } from "../../printers/ListResult.js";

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
async function do_list (
    ctx: Context,
    conn: Connection,
    argv: any,
): Promise<void> {
    const objectName: DistinguishedName = destringifyDN(ctx, argv.object);
    const prr: PagedResultsRequest | undefined = argv.pageSize
        ? {
            newRequest: new PagedResultsRequest_newRequest(
                argv.pageSize,
                argv.sortKey
                    ? argv.sortKey.map(ObjectIdentifier.fromString)
                    : undefined,
                argv.reverse,
                argv.unmerged,
                argv.pageNumber,
            ),
        }
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
    if (argv.subentries) {
        serviceControlOptions[ServiceControlOptions_subentries] = TRUE_BIT;
    }
    if (argv.copyShallDo) {
        serviceControlOptions[ServiceControlOptions_copyShallDo] = TRUE_BIT;
    }
    if (argv.partialNameResolution) {
        serviceControlOptions[ServiceControlOptions_partialNameResolution] = TRUE_BIT;
    }
    if (argv.manageDSAIT) {
        serviceControlOptions[ServiceControlOptions_manageDSAIT] = TRUE_BIT;
    }
    if (argv.countFamily) {
        serviceControlOptions[ServiceControlOptions_countFamily] = TRUE_BIT;
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
    );

    const reqData: ListArgumentData = new ListArgumentData(
        {
            rdnSequence: objectName,
        },
        prr,
        argv.listFamily,
        [],
        serviceControls,
        new SecurityParameters(
            undefined,
            undefined,
            undefined,
            undefined,
            argv.pageSize
                ? undefined
                : ProtectionRequest_signed,
            undefined,
            argv.pageSize
                ? undefined
                : ErrorProtectionRequest_signed,
        ), // TODO: Options
        undefined,
    );
    const arg: ListArgument = {
        unsigned: reqData,
    };
    const outcome = await conn.writeOperation({
        opCode: list["&operationCode"]!,
        argument: _encode_ListArgument(arg, DER),
    });
    if ("error" in outcome) {
        printError(ctx, outcome);
        return;
    }
    if (!outcome.result) {
        ctx.log.error("Invalid server response: no result data.");
        return;
    }
    const result: ListResult = _decode_ListResult(outcome.result);
    console.log(printListResult(ctx, result));
}

export default do_list;
