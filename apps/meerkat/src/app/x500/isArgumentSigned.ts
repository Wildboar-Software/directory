import {
    ASN1Element,
    ASN1UniversalType,
} from "asn1-ts";
import {
    Code,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";

const signedAltTagNumberByOpCode: Map<number, number> = new Map([
    [1, ASN1UniversalType.sequence], // read
    [2, ASN1UniversalType.sequence], // compare
    [3, 0], // abandon
    [4, ASN1UniversalType.sequence], // list
    [5, ASN1UniversalType.sequence], // search
    [6, ASN1UniversalType.sequence], // addEntry
    [7, ASN1UniversalType.sequence], // removeEntry
    [8, ASN1UniversalType.sequence], // modifyEntry
    [9, ASN1UniversalType.sequence], // modifyDN
    [10, 0], // changePassword
    [11, 0], // administerPassword
    [12, 0], // ldapTransport
    [13, 0], // linkedLDAP
]);

/**
 * @summary Determine whether a DAP argument is signed (without decoding it)
 * @description
 *
 * Repeatedly encoding and decoding a DAP argument can be computationally
 * expensive. If you just need to determine whether a DAP argument is signed,
 * you can look at the outermost tag without decoding it, which is what this
 * function does.
 *
 * @param opCode The opCode of the operation
 * @param arg The un-decoded DAP argument
 * @returns Whether the DAP argument is signed
 *
 * @function
 */
export
    function isArgumentSigned(
        opCode: Code,
        arg: ASN1Element,
): boolean | undefined {
    if (!("local" in opCode)) {
        return undefined;
    }
    const tagNumberOfSigned = signedAltTagNumberByOpCode.get(Number(opCode.local));
    return (arg.tagNumber === tagNumberOfSigned);
}
