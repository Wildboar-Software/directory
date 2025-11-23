import type { DistinguishedName } from "@wildboar/x500/InformationFramework";
import type { Request } from "@wildboar/x500";
import type { ChainingArguments } from "@wildboar/x500/DistributedOperations";
import { getOptionallyProtectedValue } from "@wildboar/x500";
import { compareCode } from "@wildboar/x500";
import { abandon } from "@wildboar/x500/DirectoryAbstractService";
import { administerPassword } from "@wildboar/x500/DirectoryAbstractService";
import { addEntry } from "@wildboar/x500/DirectoryAbstractService";
import { changePassword } from "@wildboar/x500/DirectoryAbstractService";
import { compare } from "@wildboar/x500/DirectoryAbstractService";
import { modifyDN } from "@wildboar/x500/DirectoryAbstractService";
import { modifyEntry } from "@wildboar/x500/DirectoryAbstractService";
import { ldapTransport } from "@wildboar/x500/DirectoryAbstractService";
import { linkedLDAP } from "@wildboar/x500/DirectoryAbstractService";
import { list } from "@wildboar/x500/DirectoryAbstractService";
import { read } from "@wildboar/x500/DirectoryAbstractService";
import { removeEntry } from "@wildboar/x500/DirectoryAbstractService";
import { search } from "@wildboar/x500/DirectoryAbstractService";

/**
 * @summary Determines the target object from operation arguments
 * @description
 *
 * Determines the target object from operation arguments, returning its
 * distinguished name if the target object could be determined, or `undefined`
 * if no target object could be determined.
 *
 * @param req The X.500 directory request
 * @param chainingArguments The chaining arguments, if the request was chained
 * @returns The distinguished name of the target object, if one could be determined, or `undefined` otherwise.
 *
 * @function
 */
export
function getSoughtObjectFromRequest (
    req: Request,
    chainingArguments?: ChainingArguments,
): DistinguishedName | undefined {
    if (chainingArguments?.targetObject) {
        return chainingArguments.targetObject;
    }
    if (!req.opCode || !req.argument) {
        return undefined;
    }
    else if (compareCode(abandon["&operationCode"]!, req.opCode)) {
        return undefined;
    }
    else if (compareCode(administerPassword["&operationCode"]!, req.opCode)) {
        const arg = administerPassword.decoderFor["&ArgumentType"]!(req.argument);
        const data = getOptionallyProtectedValue(arg);
        return data.object;
    }
    else if (compareCode(addEntry["&operationCode"]!, req.opCode)) {
        const arg = addEntry.decoderFor["&ArgumentType"]!(req.argument);
        const data = getOptionallyProtectedValue(arg);
        return data.object.rdnSequence.slice(0, -1);
    }
    else if (compareCode(changePassword["&operationCode"]!, req.opCode)) {
        const arg = changePassword.decoderFor["&ArgumentType"]!(req.argument);
        const data = getOptionallyProtectedValue(arg);
        return data.object;
    }
    else if (compareCode(compare["&operationCode"]!, req.opCode)) {
        const arg = compare.decoderFor["&ArgumentType"]!(req.argument);
        const data = getOptionallyProtectedValue(arg);
        return data.object.rdnSequence;
    }
    else if (compareCode(modifyDN["&operationCode"]!, req.opCode)) {
        const arg = modifyDN.decoderFor["&ArgumentType"]!(req.argument);
        const data = getOptionallyProtectedValue(arg);
        return data.object;
    }
    else if (compareCode(modifyEntry["&operationCode"]!, req.opCode)) {
        const arg = modifyEntry.decoderFor["&ArgumentType"]!(req.argument);
        const data = getOptionallyProtectedValue(arg);
        return data.object.rdnSequence;
    }
    else if (compareCode(ldapTransport["&operationCode"]!, req.opCode)) {
        const arg = ldapTransport.decoderFor["&ArgumentType"]!(req.argument);
        const data = getOptionallyProtectedValue(arg);
        if ("addRequest" in data.ldapMessage.protocolOp) {
            return data.object.slice(0, -1);
        }
        return data.object;
    }
    else if (compareCode(linkedLDAP["&operationCode"]!, req.opCode)) {
        const arg = linkedLDAP.decoderFor["&ArgumentType"]!(req.argument);
        const data = getOptionallyProtectedValue(arg);
        return data.object;
    }
    else if (compareCode(list["&operationCode"]!, req.opCode)) {
        const arg = list.decoderFor["&ArgumentType"]!(req.argument);
        const data = getOptionallyProtectedValue(arg);
        return data.object.rdnSequence;
    }
    else if (compareCode(read["&operationCode"]!, req.opCode)) {
        const arg = read.decoderFor["&ArgumentType"]!(req.argument);
        const data = getOptionallyProtectedValue(arg);
        return data.object.rdnSequence;
    }
    else if (compareCode(removeEntry["&operationCode"]!, req.opCode)) {
        const arg = removeEntry.decoderFor["&ArgumentType"]!(req.argument);
        const data = getOptionallyProtectedValue(arg);
        return data.object.rdnSequence;
    }
    else if (compareCode(search["&operationCode"]!, req.opCode)) {
        const arg = search.decoderFor["&ArgumentType"]!(req.argument);
        const data = getOptionallyProtectedValue(arg);
        if (chainingArguments?.relatedEntry !== undefined) {
            const relatedEntry = data.joinArguments?.[Number(chainingArguments.relatedEntry)];
            if (!relatedEntry) {
                return undefined;
            }
            return relatedEntry.joinBaseObject.rdnSequence;
        }
        return data.baseObject.rdnSequence;
    } else {
        return undefined;
    }
}

export default getSoughtObjectFromRequest;
