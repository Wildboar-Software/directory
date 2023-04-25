import { MeerkatContext } from "../../ctx";
import { Vertex } from "@wildboar/meerkat-types";
import {
    UpdateShadowArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/UpdateShadowArgument.ta";
import {
    UpdateShadowResult,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/UpdateShadowResult.ta";
import DISPAssociation from "../DISPConnection";
import { verifySIGNED } from "../../pki/verifySIGNED";
import {
    _encode_UpdateShadowArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/UpdateShadowArgumentData.ta";
import { InvokeId } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/InvokeId.ta";
import { Versions_v2 } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/Versions.ta";
import { TRUE_BIT } from "asn1-ts";

// updateShadow OPERATION ::= {
//     ARGUMENT  UpdateShadowArgument
//     RESULT    UpdateShadowResult
//     ERRORS    {shadowError}
//     CODE      id-opcode-updateShadow }

//   UpdateShadowArgument ::= OPTIONALLY-PROTECTED {UpdateShadowArgumentData }

//   UpdateShadowArgumentData ::= [0]  SEQUENCE {
//     agreementID         AgreementID,
//     updateTime          Time,
//     updateWindow        UpdateWindow OPTIONAL,
//     updatedInfo         RefreshInformation,
//     securityParameters  SecurityParameters OPTIONAL,
//     ...}

//   UpdateShadowResult ::= CHOICE {
//     null         NULL,
//     information OPTIONALLY-PROTECTED{ UpdateShadowResultData },
//     ...}

//   UpdateShadowResultData ::= [0]  SEQUENCE {
//     agreementID  AgreementID,
//     lastUpdate   Time OPTIONAL,
//     ...,
//     ...,
//     COMPONENTS OF CommonResultsSeq }

export
async function updateShadow (
    ctx: MeerkatContext,
    assn: DISPAssociation,
    arg: UpdateShadowArgument,
    invokeId: InvokeId,
): Promise<UpdateShadowResult> {
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
            _encode_UpdateShadowArgumentData,
            (assn.bind?.versions?.[Versions_v2] === TRUE_BIT),
            "arg",
            assn.boundNameAndUID?.dn,
        );
    }
    return{
        null_: null,
    };
}

export default updateShadow;
