import {
    AlgorithmIdentifier,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/AlgorithmIdentifier.ta";
import {
    Scrypt_params,
    _decode_Scrypt_params,
} from "@wildboar/scrypt-0/src/lib/modules/Scrypt-0/Scrypt-params.ta";
import { id_scrypt } from "@wildboar/scrypt-0/src/lib/modules/Scrypt-0/id-scrypt.va";

export
function validateScryptAlgorithmParameters (params: Scrypt_params): boolean {
    if (params.blockSize > 8) {
        return false;
    }
    if (params.costParameter > 32768) {
        return false;
    }
    if (params.parallelizationParameter !== 1) {
        return false;
    }
    return true;
}

export
function validateAlgorithmParameters (alg: AlgorithmIdentifier): boolean {
    if (alg.algorithm.isEqualTo(id_scrypt)) {
        if (!alg.parameters) {
            return false;
        }
        const params = _decode_Scrypt_params(alg.parameters);
        return validateScryptAlgorithmParameters(params);
    }
    else {
        return false;
    }
}
