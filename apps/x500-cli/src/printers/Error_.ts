import type { Context } from "../types";
import type { ASN1Element } from "asn1-ts";
import type {
    Code,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import compareCode from "@wildboar/x500/src/lib/utils/compareCode";
import { securityError } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/securityError.oa";
import { serviceError } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/serviceError.oa";
import { nameError } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/nameError.oa";
import { attributeError } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/attributeError.oa";
import { updateError } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/updateError.oa";
import { referral } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/referral.oa";
import { abandoned } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/abandoned.oa";
import { abandonFailed } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/abandonFailed.oa";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import * as secp from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import * as serp from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import * as attp from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeProblem.ta";
import * as updp from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateProblem.ta";
import * as namp from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameProblem.ta";
import * as abfp from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonProblem.ta";

const securityErrorProblemNames: Map<number, string> = new Map(
    Object.entries(secp)
        .filter(([ name, value ]) => (name.indexOf("_") === -1) && (typeof value === "number"))
        .map(([ name, value ]) => [ value as number, name ]),
);
const serviceErrorProblemNames: Map<number, string> = new Map(
    Object.entries(serp)
        .filter(([ name, value ]) => (name.indexOf("_") === -1) && (typeof value === "number"))
        .map(([ name, value ]) => [ value as number, name ]),
);
const nameErrorProblemNames: Map<number, string> = new Map(
    Object.entries(namp)
        .filter(([ name, value ]) => (name.indexOf("_") === -1) && (typeof value === "number"))
        .map(([ name, value ]) => [ value as number, name ]),
);
const attributeErrorProblemNames: Map<number, string> = new Map(
    Object.entries(attp)
        .filter(([ name, value ]) => (name.indexOf("_") === -1) && (typeof value === "number"))
        .map(([ name, value ]) => [ value as number, name ]),
);
const updateErrorProblemNames: Map<number, string> = new Map(
    Object.entries(updp)
        .filter(([ name, value ]) => (name.indexOf("_") === -1) && (typeof value === "number"))
        .map(([ name, value ]) => [ value as number, name ]),
);
const referralProblemNames: Map<number, string> = new Map(
    Object.entries(secp)
        .filter(([ name, value ]) => (name.indexOf("_") === -1) && (typeof value === "number"))
        .map(([ name, value ]) => [ value as number, name ]),
);
// const abandonedProblemNames: Map<number, string> = new Map(
//     Object.entries(abfp)
//         .filter(([ name, value ]) => (name.indexOf("_") === -1) && (typeof value === "number"))
//         .map(([ name, value ]) => [ value as number, name ]),
// );
const abandonFailedProblemNames: Map<number, string> = new Map(
    Object.entries(abfp)
        .filter(([ name, value ]) => (name.indexOf("_") === -1) && (typeof value === "number"))
        .map(([ name, value ]) => [ value as number, name ]),
);

const UNKNOWN_PROBLEM: string = "UNKNOWN PROBLEM";

export
function printError (ctx: Context, e: { errcode?: Code, error: ASN1Element }): void {
    if (!e.errcode) {
        ctx.log.error("Error with no error code.");
        return;
    }
    if (compareCode(e.errcode, securityError["&errorCode"]!)) {
        const param = securityError.decoderFor["&ParameterType"]!(e.error);
        const data = getOptionallyProtectedValue(param);
        ctx.log.error(
            "SECURITY ERROR: "
            + securityErrorProblemNames.get(data.problem as number) ?? UNKNOWN_PROBLEM,
        );
        return;
    }
    if (compareCode(e.errcode, serviceError["&errorCode"]!)) {
        const param = serviceError.decoderFor["&ParameterType"]!(e.error);
        const data = getOptionallyProtectedValue(param);
        ctx.log.error(
            "SERVICE ERROR: "
            + serviceErrorProblemNames.get(data.problem as number) ?? UNKNOWN_PROBLEM,
        );
        return;
    }
    if (compareCode(e.errcode, nameError["&errorCode"]!)) {
        const param = nameError.decoderFor["&ParameterType"]!(e.error);
        const data = getOptionallyProtectedValue(param);
        ctx.log.error(
            "NAME ERROR: "
            + nameErrorProblemNames.get(data.problem as number) ?? UNKNOWN_PROBLEM,
        );
        return;
    }
    if (compareCode(e.errcode, attributeError["&errorCode"]!)) {
        const param = attributeError.decoderFor["&ParameterType"]!(e.error);
        const data = getOptionallyProtectedValue(param);
        // ctx.log.error(
        //     "ATTRIBUTE ERROR: "
        //     + nameErrorProblemNames.get(data.problem as number) ?? UNKNOWN_PROBLEM,
        // );
        return;
    }
    if (compareCode(e.errcode, updateError["&errorCode"]!)) {
        const param = updateError.decoderFor["&ParameterType"]!(e.error);
        const data = getOptionallyProtectedValue(param);
        ctx.log.error(
            "UPDATE ERROR: "
            + updateErrorProblemNames.get(data.problem as number) ?? UNKNOWN_PROBLEM,
        );
        return;
    }
    if (compareCode(e.errcode, referral["&errorCode"]!)) {
        const param = referral.decoderFor["&ParameterType"]!(e.error);
        const data = getOptionallyProtectedValue(param);
        return;
    }
    if (compareCode(e.errcode, abandoned["&errorCode"]!)) {
        const param = securityError.decoderFor["&ParameterType"]!(e.error);
        const data = getOptionallyProtectedValue(param);
        // ctx.log.error(
        //     "ABANDONED E: "
        //     + updateErrorProblemNames.get(data.problem as number) ?? UNKNOWN_PROBLEM,
        // );
        return;
    }
    if (compareCode(e.errcode, abandonFailed["&errorCode"]!)) {
        const param = abandonFailed.decoderFor["&ParameterType"]!(e.error);
        const data = getOptionallyProtectedValue(param);
        ctx.log.error(
            "ABANDON FAILED ERROR: "
            + abandonFailedProblemNames.get(data.problem as number) ?? UNKNOWN_PROBLEM,
        );
        return;
    }
    ctx.log.error("UNRECOGNIZED ERROR");
}

export default printError;
