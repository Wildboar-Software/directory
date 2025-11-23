import type { AlgorithmIdentifier } from "@wildboar/x500/AuthenticationFramework";
import {
    Scrypt_params,
    _decode_Scrypt_params,
    id_scrypt,
} from "@wildboar/scrypt-0";

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
