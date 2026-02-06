import {
    ASN1Element,
    ASN1TagClass,
    ASN1UniversalType,
} from "@wildboar/asn1";
import {
    Code,
} from "@wildboar/x500/CommonProtocolSpecification";

const signedAltTagNumberByOpCode: Map<number, number> = new Map([
    [1, ASN1UniversalType.sequence], // read / requestShadowUpdate
    [2, ASN1UniversalType.sequence], // compare / updateShadow
    [3, 0], // abandon (WARNING: This conflicts with coordinateShadowUpdate, handled below)
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
    [100, 0], // establishOperationalBinding
    [102, 0], // modifyOperationalBinding
    [101, 0], // terminateOperationalBinding
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
        is_disp?: boolean,
): boolean | undefined {
    if (!("local" in opCode)) {
        return undefined;
    }
    /* This is a special case that MUST be handled: abandon and
    coordinateShadowUpdate both have the same op-code, but one uses
    OPTIONALLY-PROTECTED and the other uses OPTIONALLY-PROTECTED-SEQ. */
    if (is_disp && Number(opCode.local) === 3) {
        return (
            arg.tagClass === ASN1TagClass.universal // This really should be checked for all cases...
            && arg.tagNumber === ASN1UniversalType.sequence
        );
    }
    const tagNumberOfSigned = signedAltTagNumberByOpCode.get(Number(opCode.local));
    return (arg.tagNumber === tagNumberOfSigned);
}
