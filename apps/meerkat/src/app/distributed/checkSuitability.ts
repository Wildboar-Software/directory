import type { Context, Vertex } from "@wildboar/meerkat-types";
import type { ASN1Element } from "asn1-ts";
import type { Code } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import { id_opcode_compare } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-compare.va";
import { id_opcode_list } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-list.va";
import { id_opcode_read } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-read.va";
import { id_opcode_search } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-search.va";
import compareCode from "@wildboar/x500/src/lib/utils/compareCode";
import getMatchingRulesFromFilter from "@wildboar/x500/src/lib/utils/getMatchingRulesFromFilter";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import {
    SearchArgumentData_subset_baseObject,
    SearchArgumentData_subset_oneLevel,
    SearchArgumentData_subset_wholeSubtree,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData-subset.ta";
import {
    SearchArgument,
    _decode_SearchArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgument.ta";
import { strict as assert } from "assert";
import isModificationOperation from "../x500/isModificationOperation";

export
function checkSuitabilityProcedure (
    ctx: Context,
    vertex: Vertex,
    operationType: Code,
    dontUseCopy: boolean,
    copyShallDo: boolean,
    excludeShadows: boolean,
    encodedArgument?: ASN1Element,
    searchArgument?: SearchArgument,
): boolean {
    if (!vertex.dse.shadow) {
        // TODO: Check critical extensions
        return true;
    }
    if (isModificationOperation(operationType)) {
        return false; // You cannot modify a shadow copy.
    }
    if (dontUseCopy) {
        return false; // The user specifically demanded a non-shadow copy.
    }
    if (copyShallDo) {
        // TODO: Check critical extensions
        return true;
    }
    if (compareCode(operationType, id_opcode_list)) {
        return vertex.dse.shadow.subordinateCompleteness;
    } else if (compareCode(operationType, id_opcode_read)) {
        return true; // FIXME: This might be passable for now, but it is technically incorrect.
        // I don't know how to tell if the shadow copy is missing attributes
        // that are present in the master, or if there are no such attributes at all.
    } else if (compareCode(operationType, id_opcode_search)) {
        assert(searchArgument || encodedArgument); // This should NEVER be called without passing this in if it is a search.
        const argument = searchArgument ?? _decode_SearchArgument(encodedArgument!);
        const searchArgData = getOptionallyProtectedValue(argument);
        if (searchArgData.searchAliases && vertex.dse.alias) {
            return !excludeShadows;
        }
        const mrs = searchArgData.filter
            ? getMatchingRulesFromFilter(searchArgData.filter)
            : [];
        if (mrs.map((mr) => mr.toString()).some((mr) => !(
            ctx.equalityMatchingRules.get(mr)
            ?? ctx.orderingMatchingRules.get(mr)
            ?? ctx.substringsMatchingRules.get(mr)
        ))) { // Matching rule not understood
            return false;
        }
        if (
            (searchArgData.subset === SearchArgumentData_subset_oneLevel)
            || (searchArgData.subset === SearchArgumentData_subset_wholeSubtree)
        ) {
            if (excludeShadows) {
                return false;
            }
            // TODO: Check that shadowed information can satisfy search.
            return true;
        } else if (searchArgData.subset === SearchArgumentData_subset_baseObject) {
            // TODO: Check if all attributes are present.
            return true;
        } else {
            return false; // TODO: Review. What to do?
        }
    } else if (compareCode(operationType, id_opcode_compare)) {
        // TODO: Bail out if matching rules are not supported by DSA.
        // TODO: Check if all attributes requested are present.
        return true;
    } else {
        return false; // TODO: Review. What to do?
    }
}

export default checkSuitabilityProcedure;
