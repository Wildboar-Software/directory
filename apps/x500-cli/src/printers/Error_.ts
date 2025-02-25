import type { Context } from "../types";
import type { ASN1Element, OBJECT_IDENTIFIER } from "asn1-ts";
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
import stringifyDN from "../utils/stringifyDN";
import printAttributeValue from "./AttributeValue";
import naddrToURI from "@wildboar/x500/src/lib/distributed/naddrToURI";
import {
    MasterOrShadowAccessPoint_category_master,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterOrShadowAccessPoint-category.ta";
import {
    AbandonedProblem_pagingAbandoned,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonedProblem.ta";
import chalk from "chalk";

const colorize: (str: string) => string = process.env.NO_COLOR
    ? (str: string): string => str
    : chalk.red;

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
const abandonFailedProblemNames: Map<number, string> = new Map(
    Object.entries(abfp)
        .filter(([ name, value ]) => (name.indexOf("_") === -1) && (typeof value === "number"))
        .map(([ name, value ]) => [ value as number, name ]),
);

const UNKNOWN_PROBLEM: string = "UNKNOWN PROBLEM";
const ALIAS_DEREFED: string = "An alias was dereferenced in the operation that produced this error.";

export
function printError (ctx: Context, e: { errcode?: Code, error: ASN1Element }): void {
    if (!e.errcode) {
        ctx.log.error("Error with no error code.");
        return;
    }

    if (compareCode(e.errcode, securityError["&errorCode"]!)) {
        const param = securityError.decoderFor["&ParameterType"]!(e.error);
        const data = getOptionallyProtectedValue(param);
        console.error(colorize(
            "SECURITY ERROR: "
            + (securityErrorProblemNames.get(data.problem as number) ?? UNKNOWN_PROBLEM),
        ));
        if (data.aliasDereferenced) {
            console.error(colorize(ALIAS_DEREFED));
        }
        if (data.performer) {
            console.error(colorize("This error was produced by: " + stringifyDN(ctx, data.performer)));
        }
        // This is never explained in the X.511 specifications.
        // if (data.encPwdInfo?.algorithms?.length) {

        // }
        if ("signed" in param) {
            const alg = param.signed.algorithmIdentifier.algorithm.toString();
            console.log(`This error was digitally signed with algorithm ${alg}.`);
        }
        return;
    }
    if (compareCode(e.errcode, serviceError["&errorCode"]!)) {
        const param = serviceError.decoderFor["&ParameterType"]!(e.error);
        const data = getOptionallyProtectedValue(param);
        console.error(colorize(
            "SERVICE ERROR: "
            + (serviceErrorProblemNames.get(data.problem as number) ?? UNKNOWN_PROBLEM),
        ));
        if (data.aliasDereferenced) {
            console.error(colorize(ALIAS_DEREFED));
        }
        if (data.performer) {
            console.error(colorize("This error was produced by: " + stringifyDN(ctx, data.performer)));
        }
        if ("signed" in param) {
            const alg = param.signed.algorithmIdentifier.algorithm.toString();
            console.log(`This error was digitally signed with algorithm ${alg}.`);
        }
        return;
    }
    if (compareCode(e.errcode, nameError["&errorCode"]!)) {
        const param = nameError.decoderFor["&ParameterType"]!(e.error);
        const data = getOptionallyProtectedValue(param);
        console.error(colorize(
            "NAME ERROR: "
            + (nameErrorProblemNames.get(data.problem as number) ?? UNKNOWN_PROBLEM),
        ));
        if (data.matched.rdnSequence.length) {
            console.error(colorize("This is the name that matched: " + stringifyDN(ctx, data.matched.rdnSequence)));
        } else {
            console.error(colorize("This is the name that matched: <Root DSE>"));
        }
        if (data.aliasDereferenced) {
            console.error(colorize(ALIAS_DEREFED));
        }
        if (data.performer) {
            console.error(colorize("This error was produced by: " + stringifyDN(ctx, data.performer)));
        }
        if ("signed" in param) {
            const alg = param.signed.algorithmIdentifier.algorithm.toString();
            console.log(`This error was digitally signed with algorithm ${alg}.`);
        }
        return;
    }
    if (compareCode(e.errcode, attributeError["&errorCode"]!)) {
        const param = attributeError.decoderFor["&ParameterType"]!(e.error);
        const data = getOptionallyProtectedValue(param);
        console.error(colorize(
            "This is the object to which the operation applied: "
            + stringifyDN(ctx, data.object.rdnSequence),
        ));
        for (let i = 0; i < data.problems.length; i++) {
            const problem = data.problems[i];
            const probStr: string = (attributeErrorProblemNames.get(problem.problem as number) ?? UNKNOWN_PROBLEM);
            const TYPE_OID: string = problem.type_.toString();
            const spec = ctx.attributes.get(TYPE_OID);
            if (spec?.name) {
                console.error(`${spec.name} (${TYPE_OID})`);
            } else {
                console.error(TYPE_OID);
            }
            const type_: string = (spec?.name) ? `${spec.name} (${TYPE_OID})` : TYPE_OID;
            if (problem.value) {
                console.error(colorize(
                    `Problem #${(i + 1)}: ${probStr} for this value of attribute type ${type_}: `
                    + printAttributeValue(ctx, problem.value, spec),
                ));
            } else {
                console.error(`Problem #${(i + 1)}: ${probStr} for attribute type ${type_}`);
            }
        }
        if (data.aliasDereferenced) {
            console.error(colorize(ALIAS_DEREFED));
        }
        if (data.performer) {
            console.error(colorize("This error was produced by: " + stringifyDN(ctx, data.performer)));
        }
        if ("signed" in param) {
            const alg = param.signed.algorithmIdentifier.algorithm.toString();
            console.log(`This error was digitally signed with algorithm ${alg}.`);
        }
        return;
    }
    if (compareCode(e.errcode, updateError["&errorCode"]!)) {
        const param = updateError.decoderFor["&ParameterType"]!(e.error);
        const data = getOptionallyProtectedValue(param);
        console.error(colorize(
            "UPDATE ERROR: "
            + (updateErrorProblemNames.get(data.problem as number) ?? UNKNOWN_PROBLEM),
        ));
        const attributeInfo = data.attributeInfo ?? [];
        for (let i = 0; i < attributeInfo.length; i++) {
            const info = attributeInfo[i];
            const type_: OBJECT_IDENTIFIER | undefined = ("attributeType" in info)
                ? info.attributeType
                : ("attribute" in info)
                    ? info.attribute.type_
                    : undefined;
            if (type_) {
                console.error(`Problem #${(i + 1)}: Attribute type ${type_}`);
            } else {
                console.error(`Problem #${(i + 1)}: Syntax not understood.`);
            }
        }
        if (data.aliasDereferenced) {
            console.error(colorize(ALIAS_DEREFED));
        }
        if (data.performer) {
            console.error(colorize("This error was produced by: " + stringifyDN(ctx, data.performer)));
        }
        if ("signed" in param) {
            const alg = param.signed.algorithmIdentifier.algorithm.toString();
            console.log(`This error was digitally signed with algorithm ${alg}.`);
        }
        return;
    }
    if (compareCode(e.errcode, referral["&errorCode"]!)) {
        const param = referral.decoderFor["&ParameterType"]!(e.error);
        const data = getOptionallyProtectedValue(param);
        console.error(colorize("The performing DSA has referred you to the following DSA(s) to continue your request: "));
        for (const api of data.candidate.accessPoints) {
            console.error(colorize(`DSA Application Entity: ${stringifyDN(ctx, api.ae_title.rdnSequence)}`));
            console.error(colorize("Network access points:"));
            for (let i = 0; i < api.address.nAddresses.length; i++) {
                const naddr = api.address.nAddresses[i];
                const uri: string | undefined = naddrToURI(naddr);
                if (!uri) {
                    console.error(colorize("\t" + `${i + 1}. ${Buffer.from(naddr).toString("hex")}`));
                    continue;
                }
                console.error(colorize("\t" + `${i + 1}. ${uri}`));
            }
            if (api.chainingRequired) {
                console.error(colorize("The referring DSA has reported that chaining is required for use of this DSA."));
            }
            if (api.category && (api.category !== MasterOrShadowAccessPoint_category_master)) {
                console.error(colorize("The referring DSA has reported that this DSA is not a master DSA."));
            }
            if (!api.additionalPoints?.length) {
                continue;
            }
            console.error(colorize("Additional access points:"));
            for (const aap of api.additionalPoints ?? []) {
                console.error(colorize("\t" + `DSA Application Entity: ${stringifyDN(ctx, aap.ae_title.rdnSequence)}`));
                console.error(colorize("\tNetwork access points:"));
                for (let i = 0; i < aap.address.nAddresses.length; i++) {
                    const naddr = aap.address.nAddresses[i];
                    const uri: string | undefined = naddrToURI(naddr);
                    if (!uri) {
                        console.error(colorize("\t\t" + `${i + 1}. ${Buffer.from(naddr).toString("hex")}`));
                        continue;
                    }
                    console.error(colorize("\t\t" + `${i + 1}. ${uri}`));
                }
                if (aap.chainingRequired) {
                    console.error(colorize("\tThe referring DSA has reported that chaining is required for use of this DSA."));
                }
                if (aap.category && (aap.category !== MasterOrShadowAccessPoint_category_master)) {
                    console.error(colorize("\tThe referring DSA has reported that this DSA is not a master DSA."));
                }
                console.error(colorize("\t-----"));
            }
            console.error(colorize("-----"));
        }
        if (data.aliasDereferenced) {
            console.error(colorize(ALIAS_DEREFED));
        }
        if (data.performer) {
            console.error(colorize("This error was produced by: " + stringifyDN(ctx, data.performer)));
        }
        if ("signed" in param) {
            const alg = param.signed.algorithmIdentifier.algorithm.toString();
            console.log(`This error was digitally signed with algorithm ${alg}.`);
        }
        return;
    }
    if (compareCode(e.errcode, abandoned["&errorCode"]!)) {
        const param = abandoned.decoderFor["&ParameterType"]!(e.error);
        const data = getOptionallyProtectedValue(param);
        if (data.problem === AbandonedProblem_pagingAbandoned) {
            console.error(colorize("Paging abandoned."));
        } else {
            console.error(colorize("Abandoned."));
        }
        if (data.aliasDereferenced) {
            console.error(colorize(ALIAS_DEREFED));
        }
        if (data.performer) {
            console.error(colorize("This error was produced by: " + stringifyDN(ctx, data.performer)));
        }
        if ("signed" in param) {
            const alg = param.signed.algorithmIdentifier.algorithm.toString();
            console.log(`This error was digitally signed with algorithm ${alg}.`);
        }
        return;
    }
    if (compareCode(e.errcode, abandonFailed["&errorCode"]!)) {
        const param = abandonFailed.decoderFor["&ParameterType"]!(e.error);
        const data = getOptionallyProtectedValue(param);
        console.error(colorize(
            "ABANDON FAILED ERROR: "
            + (abandonFailedProblemNames.get(data.problem as number) ?? UNKNOWN_PROBLEM),
        ));
        if (data.aliasDereferenced) {
            console.error(colorize(ALIAS_DEREFED));
        }
        if (data.performer) {
            console.error(colorize("This error was produced by: " + stringifyDN(ctx, data.performer)));
        }
        if ("signed" in param) {
            const alg = param.signed.algorithmIdentifier.algorithm.toString();
            console.log(`This error was digitally signed with algorithm ${alg}.`);
        }
        return;
    }
    // TODO: Support DOP, DSP, and DISP errors
    ctx.log.error("UNRECOGNIZED ERROR");
}

export default printError;
