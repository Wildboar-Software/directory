import process from "node:process";
import { MeerkatContext } from "../../ctx.js";
import { ShadowError, UnknownError } from "../../types/index.js";
import {
    RequestShadowUpdateArgument,
} from "@wildboar/x500/DirectoryShadowAbstractService";
import {
    RequestShadowUpdateResult,
} from "@wildboar/x500/DirectoryShadowAbstractService";
import DISPAssociation from "../DISPConnection.js";
import { InvokeId } from "@wildboar/x500/CommonProtocolSpecification";
import { Versions_v2 } from "@wildboar/x500/DirectoryAbstractService";
import { BERElement, FALSE, TRUE_BIT } from "@wildboar/asn1";
import { verifySIGNED } from "../../pki/verifySIGNED.js";
import {
    _encode_RequestShadowUpdateArgumentData,
} from "@wildboar/x500/DirectoryShadowAbstractService";
import { ShadowErrorData } from "@wildboar/x500/DirectoryShadowAbstractService";
import { ShadowProblem_invalidAgreementID, ShadowProblem_invalidSequencing, ShadowProblem_unsuitableTiming, ShadowProblem_unsupportedStrategy, ShadowProblem_unwillingToPerform } from "@wildboar/x500/DirectoryShadowAbstractService";
import createSecurityParameters from "../../x500/createSecurityParameters.js";
import { id_errcode_shadowError } from "@wildboar/x500/CommonProtocolSpecification";
import { _decode_AccessPoint } from "@wildboar/x500/DistributedOperations";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter.js";
import { compareDistinguishedName, getOptionallyProtectedValue } from "@wildboar/x500";
import stringifyDN from "../../x500/stringifyDN.js";
import { id_op_binding_shadow } from "@wildboar/x500/DirectoryOperationalBindingTypes";
import { updateShadowConsumer } from "../createShadowUpdate.js";
import { ShadowingAgreementInfo, _decode_ShadowingAgreementInfo } from "@wildboar/x500/DirectoryShadowAbstractService";
import { addSeconds } from "date-fns";
import { UpdateWindow } from "@wildboar/x500/DirectoryShadowAbstractService";
import { OperationalBindingInitiator } from "../../generated/client.js";
import * as util from "node:util";

/**
 * @summary The requestShadowUpdate operation defined in ITU Rec. X.525 (2019)
 * @description
 *
 * This function is an implementation of the `requestShadowUpdate` operation described in
 * [ITU Recommendation X.525 (2019)](https://www.itu.int/rec/T-REC-X.525/en),
 * Section 11.2.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param arg The `RequestShadowUpdateArgument` argument
 * @param invokeId The invocation ID
 * @returns The `RequestShadowUpdateResult` result
 *
 * @function
 * @async
 */
export
async function requestShadowUpdate (
    ctx: MeerkatContext,
    assn: DISPAssociation,
    arg: RequestShadowUpdateArgument,
    invokeId: InvokeId,
): Promise<RequestShadowUpdateResult> {
    if ("signed" in arg) {
        const securityParameters = arg.signed.toBeSigned.securityParameters;
        const certPath = securityParameters?.certification_path;
        await verifySIGNED(
            ctx,
            assn,
            certPath,
            invokeId,
            false,
            arg.signed,
            _encode_RequestShadowUpdateArgumentData,
            (assn.bind?.versions?.[Versions_v2] === TRUE_BIT),
            "arg",
            assn.boundNameAndUID?.dn,
        );
    }
    const data = getOptionallyProtectedValue(arg);
    const signErrors: boolean = true;
    if (
        (!("standard" in data.requestedStrategy))
        || (data.requestedStrategy.standard < 0)
        || (data.requestedStrategy.standard > 2)
    ) {
        throw new ShadowError(
            ctx.i18n.t("err:unsupported_shadow_update_strategy"),
            new ShadowErrorData(
                ShadowProblem_unsupportedStrategy,
                undefined,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    id_errcode_shadowError,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                FALSE,
                undefined,
            ),
            signErrors,
        );
    }
    const now = new Date();
    const ob = await ctx.db.operationalBinding.findFirst({
        where: {
            /**
             * This is a hack for getting the latest version: we are selecting
             * operational bindings that have no next version.
             */
            next_version: {
                none: {},
            },
            binding_type: id_op_binding_shadow.toString(),
            binding_identifier: Number(data.agreementID.identifier),
            accepted: true,
            terminated_time: null,
            validity_start: {
                lte: now,
            },
            OR: [
                {
                    validity_end: null,
                },
                {
                    validity_end: {
                        gte: now,
                    },
                },
            ],
        },
        select: {
            id: true,
            last_update: true,
            binding_identifier: true,
            binding_version: true,
            agreement_ber: true,
            requested_time: true,
            responded_time: true,
            local_last_update: true,
            outbound: true,
            initiator: true,
            access_point: {
                select: {
                    ber: true,
                },
            },
        },
    });
    if (!ob) {
        throw new ShadowError(
            ctx.i18n.t("err:sob_not_found", { obid: data.agreementID.identifier.toString() }),
            new ShadowErrorData(
                ShadowProblem_invalidAgreementID,
                undefined,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    id_errcode_shadowError,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                FALSE,
                undefined,
            ),
            signErrors,
        );
    }
    if (ob.binding_version !== Number(data.agreementID.version)) {
        throw new ShadowError(
            ctx.i18n.t("err:differing_sob_versions", {
                aid: assn.id,
                obid: data.agreementID.identifier.toString(),
            }),
            new ShadowErrorData(
                ShadowProblem_invalidAgreementID,
                undefined,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    id_errcode_shadowError,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                FALSE,
                undefined,
            ),
            signErrors,
        );
    }
    if (!ob.access_point) {
        throw new UnknownError(ctx.i18n.t("log:shadow_ob_with_no_access_point", {
            obid: ob.binding_identifier.toString(),
        }));
    }
    const iAmSupplier: boolean = (
        // The initiator was the supplier and this DSA was the initiator...
        ((ob.initiator === OperationalBindingInitiator.ROLE_A) && (ob.outbound))
        // ...or, the initiator was the consumer, and this DSA was NOT the initiator.
        || ((ob.initiator === OperationalBindingInitiator.ROLE_B) && (!ob.outbound))
    );
    if (!iAmSupplier) {
        throw new ShadowError(
            ctx.i18n.t("err:shadow_role_reversal"),
            new ShadowErrorData(
                ShadowProblem_unwillingToPerform,
                undefined,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    id_errcode_shadowError,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                FALSE,
                undefined,
            ),
            signErrors,
        );
    }
    const apElement = new BERElement();
    apElement.fromBytes(ob.access_point.ber);
    const remoteAccessPoint = _decode_AccessPoint(apElement);
    const namingMatcher = getNamingMatcherGetter(ctx);
    if (
        !assn.boundNameAndUID?.dn?.length
        || !compareDistinguishedName(
            assn.boundNameAndUID.dn,
            remoteAccessPoint.ae_title.rdnSequence,
            namingMatcher,
        )
    ) {
        throw new ShadowError(
            ctx.i18n.t("err:not_authz_to_update_shadow", {
                dn: assn.boundNameAndUID
                    ? stringifyDN(ctx, assn.boundNameAndUID.dn)
                    : "",
                obid: data.agreementID.identifier.toString(),
            }),
            new ShadowErrorData(
                ShadowProblem_unwillingToPerform,
                undefined,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    id_errcode_shadowError,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                FALSE,
                undefined,
            ),
            signErrors,
        );
    }

    const agreementElement = new BERElement();
    agreementElement.fromBytes(ob.agreement_ber);
    const agreement = _decode_ShadowingAgreementInfo(agreementElement);
    const updateMode = agreement.updateMode ?? ShadowingAgreementInfo._default_value_for_updateMode;
    if (!("consumerInitiated" in updateMode)) {
        throw new ShadowError(
            ctx.i18n.t("err:sob_consumer_initiated_op_not_authz", {
                obid: data.agreementID.identifier.toString(),
            }),
            new ShadowErrorData(
                ShadowProblem_invalidSequencing, // The spec is not clear what this error should be thrown.
                ob.local_last_update ?? undefined,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    id_errcode_shadowError,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                FALSE,
                undefined,
            ),
            signErrors,
        );
    }
    const schedule = updateMode.consumerInitiated;
    if (schedule?.periodic && !schedule.othertimes) {
        const ob_time: Date = ob.responded_time
            ? new Date(Math.max(ob.requested_time.valueOf(), ob.responded_time.valueOf()))
            : ob.requested_time;
        let period_start = schedule.periodic.beginTime ?? ob_time;
        let next_period_start = period_start;
        let i = 0;
        while (i++ < 1_000_000) {
            next_period_start = addSeconds(period_start, Number(schedule.periodic.updateInterval));
            if (next_period_start.valueOf() >= now.valueOf()) {
                break;
            }
            period_start = next_period_start;
        }
        const end_of_period = addSeconds(period_start, Number(schedule.periodic.windowSize));
        const updateWindow = new UpdateWindow(
            next_period_start,
            addSeconds(next_period_start, Number(schedule.periodic.windowSize)),
        );
        if (now.valueOf() >= end_of_period.valueOf()) {
            throw new ShadowError(
                ctx.i18n.t("err:shadow_update_outside_of_window", {
                    obid: data.agreementID.identifier.toString(),
                    start: period_start.toISOString(),
                    end: end_of_period.toISOString(),
                    now: now.toISOString(),
                }),
                new ShadowErrorData(
                    ShadowProblem_unsuitableTiming,
                    ob.local_last_update ?? undefined,
                    updateWindow,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        id_errcode_shadowError,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    FALSE,
                    undefined,
                ),
                signErrors,
            );
        }
    }

    /* Bind and send shadow update. We schedule this update for one second in
    the future to give the remote DSA time to receive the requestShadowUpdate
    response first. */
    setTimeout(() => {
        updateShadowConsumer(ctx, ob.id)
            .then()
            .catch((e) => {
                if (process.env.MEERKAT_LOG_JSON !== "1") {
                    ctx.log.error(util.inspect(e));
                }
                ctx.log.error(ctx.i18n.t("err:shadow_update_failure", {
                    e,
                    obid: ob.id.toString(),
                }));
            });
    }, 1000);
    return {
        null_: null,
    };
}

export default requestShadowUpdate;
