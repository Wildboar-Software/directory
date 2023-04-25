import { MeerkatContext } from "../../ctx";
import { Vertex } from "@wildboar/meerkat-types";
import {
    RequestShadowUpdateArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/RequestShadowUpdateArgument.ta";
import {
    RequestShadowUpdateResult,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/RequestShadowUpdateResult.ta";
import DISPAssociation from "../DISPConnection";
import { InvokeId } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/InvokeId.ta";
import { Versions_v2 } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/Versions.ta";
import { TRUE_BIT } from "asn1-ts";
import { verifySIGNED } from "../../pki/verifySIGNED";
import {
    _encode_RequestShadowUpdateArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/RequestShadowUpdateArgumentData.ta";


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
    // TODO: Bind and send shadow update.
    return{
        null_: null,
    };
}

export default requestShadowUpdate;
