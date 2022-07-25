import type { ClientAssociation } from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../ctx";
import type {
    MasterAndShadowAccessPoints,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterAndShadowAccessPoints.ta";
import { TRUE_BIT, BOOLEAN, INTEGER, FALSE } from "asn1-ts";
import { DER } from "asn1-ts/dist/node/functional";
import * as errors from "@wildboar/meerkat-types";
import {
    Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1 as ChainedArgument,
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
import {
    AbandonedData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonedData.ta";
import {
    abandoned,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/abandoned.oa";
import encodeLDAPDN from "../ldap/encodeLDAPDN";
import type {
    InvokeId,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/InvokeId.ta";
import { addMilliseconds } from "date-fns";
import { randomInt } from "crypto";
import { printInvokeId } from "../utils/printInvokeId";
import { signChainedArgument } from "../pki/signChainedArgument";

/**
 * @summary Check if name is already taken among NSSR.
 * @description
 *
 * The distributed procedure to check if a name is already taken among a
 * non-specific subordinate reference (NSSR), per ITU Recommendation X.518
 * (2016), Section 19.1.5.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param invokeId The InvokeId of the current operation
 * @param aliasDereferenced A boolean indicating whether an alias has been dereferenced
 * @param nonSpecificKnowledges The DSAs that participate in the NSSR, whose access points are to be interrogated
 * @param destinationDN The distinguished name whose existence is being determined
 * @param timeLimitInMilliseconds The remaining time for the operation to complete in milliseconds
 *
 * @function
 * @async
 */
export
async function checkIfNameIsAlreadyTakenInNSSR (
    ctx: MeerkatContext,
    assn: ClientAssociation,
    invokeId: InvokeId,
    aliasDereferenced: BOOLEAN,
    nonSpecificKnowledges: MasterAndShadowAccessPoints[],
    destinationDN: DistinguishedName,
    timeLimitInMilliseconds?: INTEGER,
    signErrors: boolean = false,
): Promise<void> {
    const op = ("present" in invokeId)
        ? assn.invocations.get(Number(invokeId.present))
        : undefined;
    for (const nsk of nonSpecificKnowledges) {
        const [ masters ] = splitIntoMastersAndShadows(nsk);
        for (const accessPoint of masters) {
            if (op?.abandonTime) {
                op.events.emit("abandon");
                throw new errors.AbandonError(
                    ctx.i18n.t("err:abandoned"),
                    new AbandonedData(
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            abandoned["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        aliasDereferenced,
                        undefined,
                    ),
                    signErrors,
                );
            }
            const client: Connection | null = await connect(ctx, accessPoint, dsp_ip["&id"]!, {
                timeLimitInMilliseconds: 15000, // FIXME:
                tlsOptional: ctx.config.chaining.tlsOptional,
                signErrors,
            });
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
                        (timeLimitInMilliseconds !== undefined)
                            ? (Number(timeLimitInMilliseconds) / 1000)
                            : undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                    ),
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        accessPoint.ae_title.rdnSequence,
                        chainedRead["&operationCode"],
                    ),
                    assn.boundNameAndUID?.dn,
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
            const operationIdentifier: INTEGER = randomInt(2147483648);
            ctx.log.debug(ctx.i18n.t("log:checking_if_name_taken_in_nssr", {
                opid: operationIdentifier,
            }), {
                remoteFamily: assn.socket.remoteFamily,
                remoteAddress: assn.socket.remoteAddress,
                remotePort: assn.socket.remotePort,
                association_id: assn.id,
                invokeID: printInvokeId(invokeId),
            });
            const chained: ChainedArgument = new ChainedArgument(
                new ChainingArguments(
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    destinationDN,
                    new OperationProgress(
                        OperationProgress_nameResolutionPhase_proceeding,
                        undefined,
                    ),
                    [],
                    aliasDereferenced,
                    undefined,
                    FALSE, // returnCrossRefs
                    ReferenceType_nonSpecificSubordinate,
                    undefined,
                    timeLimitInMilliseconds
                        ? {
                            generalizedTime: addMilliseconds(new Date(), Number(timeLimitInMilliseconds))
                        }
                        : undefined,
                    createSecurityParameters(
                        ctx,
                        true,
                        accessPoint.ae_title.rdnSequence,
                        chainedRead["&operationCode"],
                    ),
                    undefined,
                    assn.boundNameAndUID?.uid,
                    assn.authLevel,
                    undefined,
                    undefined,
                    undefined,
                    operationIdentifier,
                ),
                _encode_ReadArgument(readArg, DER),
            );
            const signArguments: boolean = true; // TODO: Make configurable.
            const payload = signArguments
                ? signChainedArgument(ctx, { unsigned: chained })
                : { unsigned: chained };
            try {
                const response = await client.writeOperation({
                    opCode: chainedRead["&operationCode"]!,
                    argument: chainedRead.encoderFor["&ArgumentType"]!(payload, DER),
                });
                if ("result" in response) {
                    throw new errors.UpdateError(
                        ctx.i18n.t("err:entry_already_exists_in_nssr"),
                        new UpdateErrorData(
                            UpdateProblem_entryAlreadyExists,
                            undefined,
                            [],
                            createSecurityParameters(
                                ctx,
                                signErrors,
                                accessPoint.ae_title.rdnSequence,
                                undefined,
                                updateError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            undefined,
                            undefined,
                        ),
                        signErrors,
                    );
                } else {
                    break; // Breaks the inner for loop.
                }
            } catch (e) {
                ctx.log.warn(ctx.i18n.t("log:failed_to_access_master", {
                    dsa: encodeLDAPDN(ctx, accessPoint.ae_title.rdnSequence),
                    e: e.message,
                }), {
                    remoteFamily: assn.socket.remoteFamily,
                    remoteAddress: assn.socket.remoteAddress,
                    remotePort: assn.socket.remotePort,
                    association_id: assn.id,
                    invokeID: printInvokeId(invokeId),
                });
                continue;
            }
        }
    }
}

export default checkIfNameIsAlreadyTakenInNSSR;
