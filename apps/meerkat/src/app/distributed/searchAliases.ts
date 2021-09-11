import type { Context, Vertex, AliasDSE, ClientConnection } from "../types";
import { OBJECT_IDENTIFIER, ObjectIdentifier } from "asn1-ts";
import * as errors from "../errors";
import isPrefix from "../x500/isPrefix";
import {
    SearchArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgument.ta";
import {
    SearchArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData.ta";
import {
    SearchArgumentData_subset_baseObject,
    SearchArgumentData_subset_oneLevel,
    SearchArgumentData_subset_wholeSubtree,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData-subset.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import {
    ChainingArguments,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingArguments.ta";
import OperationDispatcher from "./OperationDispatcher";

export
async function searchAliases (
    ctx: Context,
    conn: ClientConnection,
    target: Vertex,
    alias: AliasDSE,
    argument: SearchArgument,
    chaining: ChainingArguments,
): Promise<void> {
    const data = getOptionallyProtectedValue(argument);
    const subset = data.subset ?? SearchArgumentData._default_value_for_subset;
    if (subset === SearchArgumentData_subset_wholeSubtree) { // Same as !== baseObject or oneLevel
        // if (alias.aliasedEntryName)
        if (isPrefix(ctx, alias.aliasedEntryName, data.baseObject.rdnSequence)) {
            return;
        }
        if (chaining.targetObject && isPrefix(ctx, alias.aliasedEntryName, chaining.targetObject)) {
            return;
        }
        const prefixFoundInTrace = chaining.traceInformation
            .some((ti) => (
                ti.targetObject
                && isPrefix(ctx, alias.aliasedEntryName, ti.targetObject.rdnSequence)
            ));
        if (prefixFoundInTrace) {
            return;
        }
    }

    // TODO: Step 4; pending service-specific administrative area implementation.
    // FIXME: Call operation dispatcher. Pending dispatchLocalDSPRequest
}

export default searchAliases;
