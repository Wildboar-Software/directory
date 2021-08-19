import type { Context, Vertex } from "../types";
import type { Request } from "@wildboar/x500/src/lib/types/Request";
import type {
    AuthenticationLevel,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel.ta";
import type {
    UniqueIdentifier,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/UniqueIdentifier.ta";
import * as errors from "../errors";
import requestValidationProcedure from "./requestValidationProcedure";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import getSoughtObjectFromRequest from "./getSoughtObjectFromRequest";
import findDSE from "./findDSE";
import {
    ContinuationReference,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ContinuationReference.ta";
import {
    TraceItem,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/TraceItem.ta";
import nrcrProcedure from "./nrcrProcedure";
import { ASN1TagClass, TRUE_BIT } from "asn1-ts";
import {
    ServiceControlOptions_chainingProhibited as chainingProhibitedBit,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import {
    ChainedResultOrError,
} from "@wildboar/x500/src/lib/types/ChainedResultOrError";
import { compareCode } from "@wildboar/x500/src/lib/utils/compareCode";
import { abandon } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/abandon.oa";
import { administerPassword } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/administerPassword.oa";
import { addEntry } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/addEntry.oa";
import { changePassword } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/changePassword.oa";
import { compare } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/compare.oa";
import { modifyDN } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/modifyDN.oa";
import { modifyEntry } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/modifyEntry.oa";
import { list } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/list.oa";
import { read } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/read.oa";
import { removeEntry } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/removeEntry.oa";
import { search } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/search.oa";
import { strict as assert } from "assert";
import { addEntry as doAddEntry } from "./addEntry";
import list_i from "./list_i";
import list_ii from "./list_ii";
import resultsMergingProcedureForList from "./resultsMergingProcedureForList";
import {
    OperationProgress_nameResolutionPhase_completed as completed,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress-nameResolutionPhase.ta";
import {
    ListResult,
    _decode_ListResult,
    _encode_ListResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResult.ta";
import { DER } from "asn1-ts/dist/node/functional";

interface OperationDispatcherState {
    NRcontinuationList: ContinuationReference[];
    SRcontinuationList: ContinuationReference[];
    admPoints: Vertex[];
    referralRequests: TraceItem[];
    emptyHierarchySelect: boolean;
}

export
class OperationDispatcher {

    public static async dispatchDAPRequest (
        ctx: Context,
        req: Request,
        authLevel: AuthenticationLevel,
        uniqueIdentifier?: UniqueIdentifier,
    ): Promise<ChainedResultOrError> {
        assert(req.opCode);
        assert(req.argument);
        const preparedRequest = await requestValidationProcedure(
            ctx,
            req,
            false,
            authLevel,
            uniqueIdentifier,
        );
        const reqData = getOptionallyProtectedValue(preparedRequest);
        const targetObject = getSoughtObjectFromRequest(req);
        if (!targetObject) {
            throw errors.invalidRequestError("No discernable targeted object.");
        }
        const state: OperationDispatcherState = {
            NRcontinuationList: [],
            SRcontinuationList: [],
            admPoints: [],
            referralRequests: [],
            emptyHierarchySelect: false,
        };
        const foundDSE: Vertex | undefined = await findDSE(
            ctx,
            ctx.dit.root,
            targetObject,
            reqData.chainedArgument,
            undefined,
            reqData.argument,
            req.opCode!,
            state.NRcontinuationList,
            state.admPoints,
        );
        if (!foundDSE) {
            const serviceControls = reqData.argument.set
                .find((el) => (
                    (el.tagClass === ASN1TagClass.context)
                    && (el.tagNumber === 30)
                ));
            const serviceControlOptions = serviceControls?.set
                .find((el) => (
                    (el.tagClass === ASN1TagClass.context)
                    && (el.tagNumber === 0)
                ));
            const chainingProhibited = (serviceControlOptions?.bitString?.[chainingProhibitedBit] === TRUE_BIT);
            const nrcrResult = await nrcrProcedure(
                ctx,
                state.NRcontinuationList,
                {
                    ...req,
                    opCode: req.opCode!,
                    chaining: reqData.chainedArgument,
                },
                chainingProhibited,
            );
            // This will need to change if parallel requests are implemented,
            // because only one response can be returned when the strategy is serial.
            return nrcrResult.responses[0];
        }
        if (compareCode(req.opCode, abandon["&operationCode"]!)) {
            throw new errors.UnknownOperationError();
        }
        else if (compareCode(req.opCode, administerPassword["&operationCode"]!)) {
            throw new errors.UnknownOperationError();
        }
        else if (compareCode(req.opCode, addEntry["&operationCode"]!)) {
            const result = await doAddEntry(ctx, foundDSE, state.admPoints, reqData);
            return {
                invokeId: req.invokeId,
                opCode: req.opCode,
                result: result.result,
                chaining: result.chainedResult,
            };
        }
        else if (compareCode(req.opCode, changePassword["&operationCode"]!)) {
            throw new errors.UnknownOperationError();
        }
        else if (compareCode(req.opCode, compare["&operationCode"]!)) {
            throw new errors.UnknownOperationError();
        }
        else if (compareCode(req.opCode, modifyDN["&operationCode"]!)) {
            throw new errors.UnknownOperationError();
        }
        else if (compareCode(req.opCode, modifyEntry["&operationCode"]!)) {
            throw new errors.UnknownOperationError();
        }
        else if (compareCode(req.opCode, list["&operationCode"]!)) {
            const op = reqData.chainedArgument.operationProgress;
            if (op?.nameResolutionPhase === completed) { // List (II)
                const result = await list_ii(ctx, state.admPoints, foundDSE, reqData, true);
                return {
                    invokeId: req.invokeId,
                    opCode: req.opCode,
                    result: result.result,
                    chaining: result.chainedResult,
                };
            } else { // List (I)
                // Only List (I) results in results merging.
                const response = await list_i(ctx, state.admPoints, foundDSE, reqData);
                const result = _decode_ListResult(response.result);
                const data = getOptionallyProtectedValue(result);
                const newData = await resultsMergingProcedureForList(
                    ctx,
                    data,
                    false, // FIXME:
                    state.NRcontinuationList,
                    state.SRcontinuationList,
                );
                const newResult: ListResult = {
                    unsigned: newData,
                };
                return {
                    invokeId: req.invokeId,
                    opCode: req.opCode,
                    result: _encode_ListResult(newResult, DER),
                    chaining: response.chainedResult,
                };
            }
        }
        else if (compareCode(req.opCode, read["&operationCode"]!)) {
            throw new errors.UnknownOperationError();
        }
        else if (compareCode(req.opCode, removeEntry["&operationCode"]!)) {
            throw new errors.UnknownOperationError();
        }
        else if (compareCode(req.opCode, search["&operationCode"]!)) {
            throw new errors.UnknownOperationError();
        }
        throw new Error();
    }

}

export default OperationDispatcher;
