import type { Context, ClientConnection } from "../types";
import type {
    MasterAndShadowAccessPoints,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterAndShadowAccessPoints.ta";
import { TRUE_BIT } from "asn1-ts";
import { DER } from "asn1-ts/dist/node/functional";
import * as errors from "../errors";
import {
    Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1 as ChainedArgument,
    _encode_Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1 as _encode_ChainedArgument,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ArgumentType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    UpdateErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateErrorData.ta";
import {
    UpdateProblem_entryAlreadyExists,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateProblem.ta";
import splitIntoMastersAndShadows from "@wildboar/x500/src/lib/utils/splitIntoMastersAndShadows";
import connect from "../net/connect";
import type Connection from "../net/Connection";
import { dsp_ip } from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dsp-ip.oa";
import { chainedRead } from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedRead.oa";
import {
    ReadArgument,
    _encode_ReadArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadArgument.ta";
import {
    ReadArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadArgumentData.ta";
import {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import {
    objectClass,
} from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
import {
    ServiceControls,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControls.ta";
import {
    ServiceControlOptions_dontDereferenceAliases,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import {
    OperationProgress,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress.ta";
import {
    OperationProgress_nameResolutionPhase_proceeding,
    OperationProgress_nameResolutionPhase_completed,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress-nameResolutionPhase.ta";
import {
    ChainingArguments,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingArguments.ta";
import {
    ReferenceType_nonSpecificSubordinate,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ReferenceType.ta";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    updateError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/updateError.oa";
import type { OperationDispatcherState } from "./OperationDispatcher";
import {
    AbandonedData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonedData.ta";
import {
    abandoned,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/abandoned.oa";

export
async function checkIfNameIsAlreadyTakenInNSSR (
    ctx: Context,
    conn: ClientConnection,
    state: OperationDispatcherState,
    nonSpecificKnowledges: MasterAndShadowAccessPoints[],
    destinationDN: DistinguishedName,
): Promise<void> {
    const op = ("present" in state.invokeId)
        ? conn.invocations.get(state.invokeId.present)
        : undefined;
    for (const nsk of nonSpecificKnowledges) {
        const [ masters ] = splitIntoMastersAndShadows(nsk);
        // TODO: Use only IDM endpoints.
        for (const accessPoint of masters) {
            if (op?.abandonTime) {
                op.events.emit("abandon");
                throw new errors.AbandonError(
                    "Abandoned.",
                    new AbandonedData(
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            conn.boundNameAndUID?.dn,
                            undefined,
                            abandoned["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                );
            }
            const client: Connection | null = await connect(ctx, accessPoint, dsp_ip["&id"]!, undefined);
            if (!client) {
                continue;
            }
            const serviceControlOptions: Uint8ClampedArray = new Uint8ClampedArray(5);
            serviceControlOptions[ServiceControlOptions_dontDereferenceAliases] = TRUE_BIT;
            const readArg: ReadArgument = {
                unsigned: new ReadArgumentData(
                    {
                        rdnSequence: destinationDN,
                    },
                    new EntryInformationSelection(
                        {
                            select: [ objectClass["&id"] ],
                        },
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                    ),
                    undefined,
                    [],
                    new ServiceControls(
                        serviceControlOptions,
                        undefined,
                        undefined, // TODO:
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                    ),
                    createSecurityParameters(
                        ctx,
                        accessPoint.ae_title.rdnSequence,
                        chainedRead["&operationCode"],
                    ),
                    undefined, // TODO:
                    new OperationProgress(
                        OperationProgress_nameResolutionPhase_completed,
                        undefined,
                    ),
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ),
            };
            const chained: ChainedArgument = new ChainedArgument(
                new ChainingArguments(
                    undefined, // TODO:
                    undefined,
                    new OperationProgress(
                        OperationProgress_nameResolutionPhase_proceeding,
                        undefined,
                    ),
                    [],
                    undefined,
                    undefined,
                    undefined,
                    ReferenceType_nonSpecificSubordinate,
                    undefined,
                    undefined, // TODO:
                    createSecurityParameters(
                        ctx,
                        accessPoint.ae_title.rdnSequence,
                        chainedRead["&operationCode"],
                    ),
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ),
                _encode_ReadArgument(readArg, DER),
            );
            try {
                const response = await client.writeOperation({
                    opCode: chainedRead["&operationCode"]!,
                    argument: _encode_ChainedArgument(chained, DER),
                });
                if ("result" in response) {
                    throw new errors.UpdateError(
                        "Entry already exists (among an NSSR).",
                        new UpdateErrorData(
                            UpdateProblem_entryAlreadyExists,
                            undefined,
                            [],
                            createSecurityParameters(
                                ctx,
                                accessPoint.ae_title.rdnSequence,
                                undefined,
                                updateError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            undefined,
                            undefined,
                        ),
                    );
                } else {
                    break; // Breaks the inner for loop.
                }
            } catch (e) {
                ctx.log.warn(`Failed to access master access point: ${e}`);
                continue;
            }
        }
    }
}

export default checkIfNameIsAlreadyTakenInNSSR;
