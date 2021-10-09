import EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import type { ASN1Element } from "asn1-ts";
import {
    PwdEncAlg,
    _decode_PwdEncAlg,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/PwdEncAlg.ta";
import {
    UserPwd,
    _decode_UserPwd,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/UserPwd.ta";

export
const pwdEncAlgMatch: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    const a: PwdEncAlg = _decode_PwdEncAlg(assertion);
    const v: UserPwd = _decode_UserPwd(value);
    if (!("encrypted" in v)) {
        return false;
    }
    const alg = v.encrypted.algorithmIdentifier;
    return (alg.algorithm.isEqualTo(a.algorithm));
}

export default pwdEncAlgMatch;
