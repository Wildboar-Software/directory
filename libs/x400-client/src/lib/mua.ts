import {
    AsyncROSEClient,
    ROSETransport,
    BindParameters,
    RequestParameters,
    BindOutcome,
    OperationOutcome,
    UnbindOutcome,
} from "@wildboar/rose-transport";
import {
    MessageSubmissionArgument,
} from "@wildboar/x400/src/lib/modules/MTSAbstractService/MessageSubmissionArgument.ta";
import {
    MessageSubmissionResult,
} from "@wildboar/x400/src/lib/modules/MTSAbstractService/MessageSubmissionResult.ta";
import {
    message_submission,
} from "@wildboar/x400/src/lib/modules/MTSAbstractService/message-submission.oa";
import {
    mta_bind,
} from "@wildboar/x400/src/lib/modules/MTAAbstractService/mta-bind.oa";
import { BER, DER } from "asn1-ts/dist/node/functional";
import {
    DirectoryVersioned,
    generateUnusedInvokeId,
} from "./utils";
import { strict as assert } from "node:assert";
import { compareCode } from "@wildboar/x500";

export type BindArgument = typeof mta_bind["&ArgumentType"];
export type BindResult = typeof mta_bind["&ResultType"];
export type MHSBindParameters = BindParameters<BindArgument>;
export type MHSBindOutcome = BindOutcome<BindResult>;

export
interface MUAOptions {}

export
interface MUAClient extends AsyncROSEClient<BindArgument, BindResult>, MUAOptions, DirectoryVersioned {
    rose: ROSETransport;

    // From AsyncROSEClient
    bind: (params: MHSBindParameters) => Promise<MHSBindOutcome>;
    request: (params: RequestParameters) => Promise<OperationOutcome>;
    unbind: () => Promise<UnbindOutcome>;

    submit: (arg: MessageSubmissionArgument) => Promise<OperationOutcome<typeof message_submission["&ResultType"]>>;
}

export
function create_mua_client (rose: ROSETransport): MUAClient {
    const dap: MUAClient = {
        rose,
        directoryVersion: 1,
        bind: async (params: MHSBindParameters): Promise<MHSBindOutcome> => {
            const parameter = mta_bind.encoderFor["&ArgumentType"]!(params.parameter, BER);
            const outcome = await rose.bind({
                ...params,
                parameter,
            });
            if ("result" in outcome) {
                const parameter = mta_bind.decoderFor["&ResultType"]!(outcome.result.parameter);
                return {
                    result: {
                        ...outcome.result,
                        parameter,
                    },
                };
            } else {
                return outcome;
            }
        },
        request: (params: RequestParameters): Promise<OperationOutcome> => rose.request(params),
        unbind: (): Promise<UnbindOutcome> => rose.unbind(),

        submit: async (params: MessageSubmissionArgument): Promise<OperationOutcome<typeof message_submission["&ResultType"]>> => {
            const invoke_id: number = generateUnusedInvokeId();
            const outcome = await rose.request({
                code: message_submission["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: message_submission.encoderFor["&ArgumentType"]!(params, DER),
                timeout: 10000,
            });
            if ("result" in outcome) {
                assert(compareCode(outcome.result.code, message_submission["&operationCode"]!));
                assert("present" in outcome.result.invoke_id);
                assert(outcome.result.invoke_id.present.toString() === invoke_id.toString());
                const decoded = message_submission.decoderFor["&ResultType"]!(outcome.result.parameter);
                return {
                    result: {
                        ...outcome.result,
                        parameter: decoded,
                    },
                };
            } else {
                return outcome;
            }
        },
    };
    return dap;
}
