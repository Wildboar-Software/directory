import { Context, Vertex } from "../types";
import * as errors from "../errors";
import { BOOLEAN } from "asn1-ts";
import readChildren from "../dit/readChildren";
import {
    Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1 as ChainedArgument,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ArgumentType-OPTIONALLY-PROTECTED-Parameter1.ta";
import { ContinuationReference } from "@wildboar/x500/src/lib/modules/DistributedOperations/ContinuationReference.ta";
import { ChainingArguments } from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingArguments.ta";
import { ServiceErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    ServiceProblem_invalidReference,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";


export
type ListItem = [ vertex: Vertex, aliasEntry?: BOOLEAN, fromEntry?: BOOLEAN ];

export
interface ListIReturn {
    listInfoSubordinates: ListItem[];
    // PartialOutcomeQualifier
    SRcontinuationList: ContinuationReference[];
}

export
async function list_ii (
    ctx: Context,
    admPoints: Vertex[],
    target: Vertex,
    request: ChainedArgument,
    fromDAP: boolean,
): Promise<ListIReturn> {
    const subordinates = await readChildren(ctx, target);
    const excludeShadows: boolean = request.chainedArgument.excludeShadows
        ?? ChainingArguments._default_value_for_excludeShadows;
    const listInfoSubordinates: ListItem[] = [];
    for (const subordinate of subordinates) {
        // TODO: Check limits
        if (!(subordinate.dse.entry) && !(subordinate.dse.alias)) {
            continue;
        }
        if (
            excludeShadows
            && (subordinate.dse.shadow) // TODO: Ignore if writeableCopy
            // writableCopy has been deprecated, but it still constitutes a "copy"
        ) {
            continue;
        }
        // TODO: Check ACI
        listInfoSubordinates.push([
            subordinate,
            Boolean(subordinate.dse.alias),
            Boolean(subordinate.dse.shadow),
        ]);
    }
    if (fromDAP && (listInfoSubordinates.length === 0)) {
        throw new errors.ServiceError(
            "Null result from DAP list operation",
            new ServiceErrorData(
                ServiceProblem_invalidReference,
                [],
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        );
    }
    return {
        listInfoSubordinates,
        SRcontinuationList: [],
    };
}

export default list_ii;

