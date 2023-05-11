import { MeerkatContext } from "../../ctx";
import { ShadowError, UnknownError } from "@wildboar/meerkat-types";
import {
    CoordinateShadowUpdateArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/CoordinateShadowUpdateArgument.ta";
import {
    CoordinateShadowUpdateResult,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/CoordinateShadowUpdateResult.ta";
import DISPAssociation from "../DISPConnection";
import { InvokeId } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/InvokeId.ta";
import { Versions_v2 } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/Versions.ta";
import { BERElement, FALSE, TRUE_BIT } from "asn1-ts";
import { verifySIGNED } from "../../pki/verifySIGNED";
import {
    _encode_CoordinateShadowUpdateArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/CoordinateShadowUpdateArgumentData.ta";
import { compareDistinguishedName, getOptionallyProtectedValue } from "@wildboar/x500";
import { id_op_binding_shadow } from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-shadow.va";
import { ShadowErrorData } from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/ShadowErrorData.ta";
import { ShadowProblem_invalidAgreementID, ShadowProblem_unwillingToPerform } from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/ShadowProblem.ta";
import createSecurityParameters from "../../x500/createSecurityParameters";
import { id_errcode_shadowError } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-errcode-shadowError.va";
import { ShadowProblem_unsupportedStrategy } from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/ShadowProblem.ta";
import { differenceInSeconds } from "date-fns";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter";
import { _decode_AccessPoint } from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import stringifyDN from "../../x500/stringifyDN";

// coordinateShadowUpdate OPERATION ::= {
//     ARGUMENT  CoordinateShadowUpdateArgument
//     RESULT    CoordinateShadowUpdateResult
//     ERRORS    {shadowError}
//     CODE      id-opcode-coordinateShadowUpdate
//   }

//   CoordinateShadowUpdateArgument ::=
//     OPTIONALLY-PROTECTED { CoordinateShadowUpdateArgumentData }

//   CoordinateShadowUpdateArgumentData ::= [0]  SEQUENCE {
//     agreementID         AgreementID,
//     lastUpdate          Time OPTIONAL,
//     updateStrategy      CHOICE {
//       standard            ENUMERATED {
//         noChanges   (0),
//         incremental (1),
//         total       (2),
//         ...},
//       other               EXTERNAL,
//       ...},
//     securityParameters  SecurityParameters OPTIONAL,
//     ...}

//   CoordinateShadowUpdateResult ::= CHOICE {
//     null         NULL,
//     information  OPTIONALLY-PROTECTED{ CoordinateShadowUpdateResultData },
//     ...}

//   CoordinateShadowUpdateResultData ::= [0]  SEQUENCE {
//     agreementID  AgreementID,
//     lastUpdate   Time OPTIONAL,
//     ...,
//     ...,
//     COMPONENTS OF CommonResultsSeq }

/**
 * @summary The coordinateShadowUpdate operation defined in ITU Rec. X.525 (2019)
 * @description
 *
 * This is an implementation of the `coordinateShadowUpdate` operation defined
 * in [ITU Recommendation X.525 (2019)](https://www.itu.int/rec/T-REC-X.525/en).
 * It does absolutely nothing other than verify the argument. I don't get the
 * point of this operation entirely. Why would there be a need for supplier to
 * notify a consumer of another subsequent operation?
 *
 * @param ctx The context object
 * @param assn The client association
 * @param arg The DISP argument
 * @param invokeId The invoke ID
 * @returns A coordinateShadowUpdate result
 *
 * @async
 * @function
 */
export
async function coordinateShadowUpdate (
    ctx: MeerkatContext,
    assn: DISPAssociation,
    arg: CoordinateShadowUpdateArgument,
    invokeId: InvokeId,
): Promise<CoordinateShadowUpdateResult> {
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
            _encode_CoordinateShadowUpdateArgumentData,
            (assn.bind?.versions?.[Versions_v2] === TRUE_BIT),
            "arg",
            assn.boundNameAndUID?.dn,
        );
    }
    const data = getOptionallyProtectedValue(arg);
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
            binding_version: Number(data.agreementID.version),
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
            access_point: {
                select: {
                    ber: true,
                },
            },
        },
    });
    const signErrors: boolean = true;
    if (
        (!("standard" in data.updateStrategy))
        || (data.updateStrategy.standard < 0)
        || (data.updateStrategy.standard > 2)
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
    if (!ob.access_point) {
        throw new UnknownError(ctx.i18n.t("log:shadow_ob_with_no_access_point", {
            obid: ob.binding_identifier.toString(),
        }));
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
    if (data.lastUpdate) {
        if (!ob.last_update) {
            ctx.log.warn(ctx.i18n.t("log:no_last_update", {
                aid: assn.id,
                obid: data.agreementID.identifier.toString(),
                time: data.lastUpdate.toISOString(),
            }));
        } else if (Math.abs(differenceInSeconds(data.lastUpdate, ob.last_update)) > 60) { // TODO: Make this configurable.
            ctx.log.warn(ctx.i18n.t("log:last_shadow_update_disputed", {
                aid: assn.id,
                obid: data.agreementID.identifier.toString(),
                req_time: data.lastUpdate.toISOString(),
                local_time: ob.last_update.toISOString(),
            }));
        }
    }
    return{
        null_: null,
    };
}

export default coordinateShadowUpdate;
