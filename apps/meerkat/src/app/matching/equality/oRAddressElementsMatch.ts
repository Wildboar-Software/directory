import type { ASN1Element } from "asn1-ts";
import { EqualityMatcher } from "@wildboar/x500";
import {
    ORAddress,
    _decode_ORAddress,
} from "@wildboar/x400/src/lib/modules/MTSAbstractService/ORAddress.ta";
import { ORAddressInfo, orAddressToInfo } from "./orAddressUtilities";
import { PresentationAddress } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/PresentationAddress.ta";
import _ from "lodash";

export
function orAddressIsSubset (asserted: ORAddress, value: ORAddress): boolean {
    const aInfo: ORAddressInfo | null = orAddressToInfo(asserted);
    const bInfo: ORAddressInfo | null = orAddressToInfo(value);
    if (!aInfo) {
        return false;
    }
    if (!bInfo) {
        return false;
    }
    const comparableAInfo: ORAddressInfo = {
        ...aInfo,
        extendedNetworkAddress: undefined,
    };
    const comparableBInfo: ORAddressInfo = {
        ...bInfo,
        extendedNetworkAddress: undefined,
    };
    if (!_.isMatch(comparableBInfo, comparableAInfo)) { // Intentionally swapped.
        return false;
    }
    if (aInfo.extendedNetworkAddress) {
        if (!bInfo.extendedNetworkAddress) {
            return false;
        }
        if (Array.isArray(aInfo.extendedNetworkAddress)) {
            if (!Array.isArray(bInfo.extendedNetworkAddress)) {
                return false;
            }
            if (!_.isEqual(aInfo.extendedNetworkAddress, bInfo.extendedNetworkAddress)) {
                return false;
            }
        } else if (aInfo.extendedNetworkAddress instanceof PresentationAddress) {
            if (!(bInfo.extendedNetworkAddress instanceof PresentationAddress)) {
                return false;
            }
            const presa = aInfo.extendedNetworkAddress;
            const presb = bInfo.extendedNetworkAddress;
            // TODO: Compare presentation addresses. Depends on implementation in X.500 Library.
        } else {
            return false;
        }
    }
    return true;
}

export
const oRAddressMatch: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    // If the two values are byte-for-byte equal, return.
    if (!Buffer.compare(assertion.value, value.value)) {
        return true;
    }
    const a = _decode_ORAddress(assertion);
    const v = _decode_ORAddress(value);
    return orAddressIsSubset(a, v);
}

export default oRAddressMatch;
