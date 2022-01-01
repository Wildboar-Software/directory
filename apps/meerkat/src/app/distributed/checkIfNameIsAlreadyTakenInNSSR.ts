import type { Context, ClientConnection } from "@wildboar/meerkat-types";
import type {
    MasterAndShadowAccessPoints,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterAndShadowAccessPoints.ta";
import { TRUE_BIT, BOOLEAN, INTEGER, FALSE } from "asn1-ts";
import { DER } from "asn1-ts/dist/node/functional";
import * as errors from "@wildboar/meerkat-types";
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

export
async function checkIfNameIsAlreadyTakenInNSSR (
    ctx: Context,
    conn: ClientConnection,
    invokeId: InvokeId,
    aliasDereferenced: BOOLEAN,
    nonSpecificKnowledges: MasterAndShadowAccessPoints[],
    destinationDN: DistinguishedName,
    timeLimitInMilliseconds?: INTEGER,
): Promise<void> {
    const op = ("present" in invokeId)
        ? conn.invocations.get(Number(invokeId.present))
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
                            conn.boundNameAndUID?.dn,
                            undefined,
                            abandoned["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        aliasDereferenced,
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
                        accessPoint.ae_title.rdnSequence,
                        chainedRead["&operationCode"],
                    ),
                    conn.boundNameAndUID?.dn,
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
            }));
            const chained: ChainedArgument = new ChainedArgument(
                new ChainingArguments(
                    conn.boundNameAndUID?.dn,
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
                        accessPoint.ae_title.rdnSequence,
                        chainedRead["&operationCode"],
                    ),
                    undefined,
                    conn.boundNameAndUID?.uid,
                    conn.authLevel,
                    undefined,
                    undefined,
                    undefined,
                    operationIdentifier,
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
                        ctx.i18n.t("err:entry_already_exists_in_nssr"),
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
                ctx.log.warn(ctx.i18n.t("log:failed_to_access_master", {
                    dsa: encodeLDAPDN(ctx, accessPoint.ae_title.rdnSequence),
                    e: e.message,
                }));
                continue;
            }
        }
    }
}

export default checkIfNameIsAlreadyTakenInNSSR;
