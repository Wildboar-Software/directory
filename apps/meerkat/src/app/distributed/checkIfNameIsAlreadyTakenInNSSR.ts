import type { ClientAssociation } from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../ctx";
import type {
    MasterAndShadowAccessPoints,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterAndShadowAccessPoints.ta";
import { BOOLEAN, INTEGER, FALSE } from "asn1-ts";
import * as errors from "@wildboar/meerkat-types";
import {
    UpdateErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateErrorData.ta";
import {
    UpdateProblem_entryAlreadyExists,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateProblem.ta";
import splitIntoMastersAndShadows from "@wildboar/x500/src/lib/utils/splitIntoMastersAndShadows";
import { chainedRead } from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedRead.oa";
import {
    objectClass,
} from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
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
import type {
    InvokeId,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/InvokeId.ta";
import { addMilliseconds } from "date-fns";
import { printInvokeId } from "../utils/printInvokeId";
import { randomUint } from "../utils/randomUint";
import { bindForChaining } from "../net/bindToOtherDSA";
import { stringifyDN } from "../x500/stringifyDN";

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
            try {
                const client = await bindForChaining(ctx, assn, op, accessPoint, FALSE, signErrors);
                if (!client) {
                    continue;
                }
                const operationIdentifier: INTEGER = randomUint();
                ctx.log.debug(ctx.i18n.t("log:checking_if_name_taken_in_nssr", {
                    opid: operationIdentifier,
                }), {
                    remoteFamily: assn.socket.remoteFamily,
                    remoteAddress: assn.socket.remoteAddress,
                    remotePort: assn.socket.remotePort,
                    association_id: assn.id,
                    invokeID: printInvokeId(invokeId),
                });
                const chaining = new ChainingArguments(
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    destinationDN,
                    // This differing from the OP of the DAP arg is not a
                    // mistake. The spec says to do this.
                    new OperationProgress(
                        OperationProgress_nameResolutionPhase_proceeding,
                        destinationDN.length - 1,
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
                );
                const read_response = await client.read({
                    object: destinationDN,
                    selection: {
                        attributes: {
                            select: [ objectClass["&id"] ],
                        },
                    },
                    dontDereferenceAliases: true,
                    timeLimit: (timeLimitInMilliseconds !== undefined)
                        ? (Number(timeLimitInMilliseconds) / 1000)
                        : undefined,
                    operationProgress: new OperationProgress(
                        OperationProgress_nameResolutionPhase_completed,
                        undefined,
                    ),
                    requestor: assn.boundNameAndUID?.dn,
                    chaining,
                    cert_path: ctx.config.signing.certPath,
                    // The signature wont happen in `@wildboar/x500-client-ts`
                    // if the responder is version 1, FYI.
                    key: ctx.config.chaining.signChainedRequests
                        ? ctx.config.signing.key
                        : undefined,
                });

                // TODO: Check signature on responses?
                if ("result" in read_response) {
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
                    break; // Breaks the innermost for loop.
                }
            } catch (e) {
                ctx.log.warn(ctx.i18n.t("log:failed_to_access_master", {
                    dsa: stringifyDN(ctx, accessPoint.ae_title.rdnSequence),
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
