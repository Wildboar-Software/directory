import {
    ASN1Element,
    ASN1UniversalType,
} from "asn1-ts";
import {
    Code,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";

const signedAltTagNumberByOpCode: Map<number, number> = new Map([
    [ 1, ASN1UniversalType.sequence ], // read
    [ 2, ASN1UniversalType.sequence ], // compare
    [ 3, 0 ], // abandon
    [ 4, ASN1UniversalType.sequence ], // list
    [ 5, ASN1UniversalType.sequence ], // search
    [ 6, ASN1UniversalType.sequence ], // addEntry
    [ 7, ASN1UniversalType.sequence ], // removeEntry
    [ 8, ASN1UniversalType.sequence ], // modifyEntry
    [ 9, ASN1UniversalType.sequence ], // modifyDN
    [ 10, 0 ], // changePassword
    [ 11, 0 ], // administerPassword
    [ 12, 0 ], // ldapTransport
    [ 13, 0 ], // linkedLDAP
]);

// TODO: Unit testing
export
function isArgumentSigned (
    opCode: Code,
    arg: ASN1Element,
): boolean | undefined {
    if (!("local" in opCode)) {
        return undefined;
    }
    const tagNumberOfSigned = signedAltTagNumberByOpCode.get(Number(opCode.local));
    return (arg.tagNumber === tagNumberOfSigned);
}
