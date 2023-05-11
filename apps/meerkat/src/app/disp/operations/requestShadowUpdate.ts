import { MeerkatContext } from "../../ctx";
import { ShadowError, UnknownError } from "@wildboar/meerkat-types";
import {
    RequestShadowUpdateArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/RequestShadowUpdateArgument.ta";
import {
    RequestShadowUpdateResult,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/RequestShadowUpdateResult.ta";
import DISPAssociation from "../DISPConnection";
import { InvokeId } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/InvokeId.ta";
import { Versions_v2 } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/Versions.ta";
import { BERElement, FALSE, TRUE_BIT } from "asn1-ts";
import { verifySIGNED } from "../../pki/verifySIGNED";
import {
    _encode_RequestShadowUpdateArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/RequestShadowUpdateArgumentData.ta";
import { ShadowErrorData } from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/ShadowErrorData.ta";
import { ShadowProblem_invalidAgreementID, ShadowProblem_unsupportedStrategy, ShadowProblem_unwillingToPerform } from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/ShadowProblem.ta";
import createSecurityParameters from "../../x500/createSecurityParameters";
import { id_errcode_shadowError } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-errcode-shadowError.va";
import { _decode_AccessPoint } from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter";
import { compareDistinguishedName, getOptionallyProtectedValue } from "@wildboar/x500";
import stringifyDN from "../../x500/stringifyDN";
import { id_op_binding_shadow } from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-shadow.va";
import { updateShadowConsumer } from "../createShadowUpdate";


// requestShadowUpdate OPERATION ::= {
//     ARGUMENT  RequestShadowUpdateArgument
//     RESULT    RequestShadowUpdateResult
//     ERRORS    {shadowError}
//     CODE      id-opcode-requestShadowUpdate
//   }

//   RequestShadowUpdateArgument ::= OPTIONALLY-PROTECTED { RequestShadowUpdateArgumentData }

//   RequestShadowUpdateArgumentData ::= [0]  SEQUENCE {
//     agreementID         AgreementID,
//     lastUpdate          Time OPTIONAL,
//     requestedStrategy   CHOICE {
//       standard  ENUMERATED {
//         incremental (1),
//         total       (2),
//         ...},
//       other     EXTERNAL,
//       ...},
//     securityParameters  SecurityParameters OPTIONAL,
//     ...}

//   RequestShadowUpdateResult ::= CHOICE {
//     null         NULL,
//     information OPTIONALLY-PROTECTED{ RequestShadowUpdateResultData },
//     ...
//     }

//   RequestShadowUpdateResultData ::= [0]  SEQUENCE {
//     agreementID  AgreementID,
//     lastUpdate   Time OPTIONAL,
//     ...,
//     ...,
//     COMPONENTS OF CommonResultsSeq }

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
    /* Bind and send shadow update. We schedule this update for one second in
    the future to give the remote DSA time to receive the requestShadowUpdate
    response first. */
    setTimeout(() => {
        updateShadowConsumer(ctx, ob.id)
            .then()
            .catch((e) => {
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
