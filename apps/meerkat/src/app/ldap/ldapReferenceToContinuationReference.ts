import {
    ContinuationReference,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ContinuationReference.ta";
import {
    OperationProgress,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress.ta";
import {
    OperationProgress_nameResolutionPhase_notStarted,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress-nameResolutionPhase.ta";
import {
    AccessPointInformation,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPointInformation.ta";
import {
    PresentationAddress,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/PresentationAddress.ta";
import {
    ReferenceType_cross,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ReferenceType.ta";
import { uriToNSAP } from "@wildboar/x500/src/lib/distributed/uri";
import type { URI } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/URI.ta";

/**
 * @summary Converts LDAP referral URIs into an X.500 `ContinuationReference`
 * @description
 *
 * Converts LDAP referral URIs into an X.500 `ContinuationReference`
 *
 * @param uris The LDAP referral URIs to be converted
 * @returns An X.500 `ContinuationReference`
 *
 * @function
 */
export
function ldapReferenceToContinuationReference (
    uris: URI[],
): ContinuationReference {
    return new ContinuationReference(
        {
            rdnSequence: [], // ITU X.518 (2016), Section 20.7.2, says this can be empty.
        },
        undefined,
        new OperationProgress(
            OperationProgress_nameResolutionPhase_notStarted,
            undefined,
        ),
        undefined,
        ReferenceType_cross,
        [
            new AccessPointInformation(
                {
                    rdnSequence: [], // ITU X.518 (2016), Section 20.7.2, says this can be empty.
                },
                new PresentationAddress(
                    undefined,
                    undefined,
                    undefined,
                    uris
                        .map((ref) => Buffer.from(ref).toString("utf-8"))
                        .map((uri) => {
                            try {
                                return uriToNSAP(uri, false);
                            } catch {
                                return undefined;
                            }
                        })
                        .filter((nsap): nsap is Uint8Array => !!nsap),
                ),
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        ],
        undefined,
        undefined,
        false,
        undefined,
    );
}

export default ldapReferenceToContinuationReference;
