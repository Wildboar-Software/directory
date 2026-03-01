import { Buffer } from "node:buffer";
import type { ASN1Element } from "@wildboar/asn1";
import type { EqualityMatcher } from "@wildboar/x500";
import {
    ORAddress,
    _decode_ORAddress,
} from "@wildboar/x400/MTSAbstractService";
import { ORAddressInfo, orAddressToInfo, recursivelyNormalize } from "./orAddressUtilities.js";
import { _encode_PresentationAddress, PresentationAddress } from "@wildboar/x500/SelectedAttributeTypes";
import _ from "lodash";
import { presentationAddressMatch } from "@wildboar/x500/matching/equality";

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
    const comparableAInfo: ORAddressInfo = recursivelyNormalize({
        ...aInfo,
        extendedNetworkAddress: undefined,
    });
    const comparableBInfo: ORAddressInfo = recursivelyNormalize({
        ...bInfo,
        extendedNetworkAddress: undefined,
    });
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
            const presaEncoded = _encode_PresentationAddress(presa);
            const presbEncoded = _encode_PresentationAddress(presb);
            return presentationAddressMatch(presaEncoded, presbEncoded);
        } else {
            return false;
        }
    }
    return true;
}

export
const oRAddressElementsMatch: EqualityMatcher = (
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

export default oRAddressElementsMatch;
