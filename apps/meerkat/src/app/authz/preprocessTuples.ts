import { OBJECT_IDENTIFIER, ASN1Element, packBits, EXTERNAL } from "asn1-ts";
import type ACDFTuple from "@wildboar/x500/src/lib/types/ACDFTuple";
import type ACDFTupleExtended from "@wildboar/x500/src/lib/types/ACDFTupleExtended";
import splitGrantsAndDenials from "@wildboar/x500/src/lib/bac/splitGrantsAndDenials";
import userWithinACIUserClass from "@wildboar/x500/src/lib/bac/userWithinACIUserClass";
import type EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import type {
    AttributeType,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import type {
    NameAndOptionalUID,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/NameAndOptionalUID.ta";
import type {
    AuthenticationLevel,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel.ta";
import accessControlSchemesThatUseACIItems from "../authz/accessControlSchemesThatUseACIItems";
import compareAuthenticationLevel from "@wildboar/x500/src/lib/comparators/compareAuthenticationLevel";
import compareElements from "@wildboar/x500/src/lib/comparators/compareElements";

/**
 * @summary Compares two EXTERNALs
 * @description
 *
 * Compares two `EXTERNAL` values for equality, returning `true` if they are
 * equal.
 *
 * @param a One EXTERNAL
 * @param b Another EXTERNAL
 * @returns A `boolean` indicating whether the two `EXTERNAL`s relay the same
 *  data.
 *
 * @function
 */
function compareExternals (a: EXTERNAL, b: EXTERNAL): boolean {
    if (
        a.directReference
        && b.directReference
        && a.directReference.isEqualTo(b.directReference)
    ) {
        return false;
    }
    if (
        a.indirectReference
        && b.indirectReference
        && (a.indirectReference === b.indirectReference)
    ) {
        return false;
    }
    return (
        (
            (a.encoding instanceof ASN1Element)
            && (b.encoding instanceof ASN1Element)
            && compareElements(a.encoding, b.encoding)
        )
        || (
            (a.encoding instanceof Uint8Array)
            && (b.encoding instanceof Uint8Array)
            && (a.encoding.length === b.encoding.length)
            && !Buffer.compare(a.encoding, b.encoding)
        )
        || (
            (a.encoding instanceof Uint8ClampedArray)
            && (b.encoding instanceof Uint8ClampedArray)
            && (a.encoding.length === b.encoding.length)
            && !Buffer.compare(packBits(a.encoding), packBits(b.encoding))
        )
    );
}

/**
 * @summary Pre-processes ACDF tuples for use in the basic access control ACDF
 * @description
 *
 * This performs ITU Recommendation X.501 (2016), Section 18.8.2 and Section
 * 18.8.3, Step 1.
 *
 * @param tuples
 * @param user
 * @param authLevel
 * @param targetDN
 * @param isMemberOfGroup
 * @param namingMatcherGetter
 *
 * @function
 * @async
 */
export
async function preprocessTuples (
    accessControlScheme: OBJECT_IDENTIFIER | undefined,
    tuples: ACDFTuple[],
    user: NameAndOptionalUID | undefined | null,
    authLevel: AuthenticationLevel,
    targetDN: DistinguishedName,
    isMemberOfGroup: (userGroup: NameAndOptionalUID, user: NameAndOptionalUID) => Promise<boolean | undefined>,
    namingMatcherGetter: (attributeType: AttributeType) => EqualityMatcher | undefined,
): Promise<ACDFTupleExtended[]> {
    // We short-circuit to avoid needlessly performing these expensive computations.
    if (!accessControlScheme || !accessControlSchemesThatUseACIItems.has(accessControlScheme.toString())) {
        return [];
    }
    const tuplesSplitByGrantOrDenial: ACDFTuple[] = tuples
        .filter((tuple) => {
            const requiredAuthLevel = tuple[1];
            if (("basicLevels" in requiredAuthLevel) && ("basicLevels" in authLevel)) {
                return !compareAuthenticationLevel(requiredAuthLevel.basicLevels, authLevel.basicLevels);
            } else if (("other" in requiredAuthLevel) && ("other" in authLevel)) {
                return compareExternals(requiredAuthLevel.other, authLevel.other);
            } else {
                return false;
            }
        })
        .flatMap((tuple) => splitGrantsAndDenials(tuple[3])
            .map((gad): ACDFTuple => [ tuple[0], tuple[1], tuple[2], gad, tuple[4] ]));
    const tuplesThatApplyToUser: ACDFTupleExtended[] = (await Promise.all(
        tuplesSplitByGrantOrDenial.map(async (tuple): Promise<ACDFTupleExtended> => [
                ...tuple,
                await userWithinACIUserClass(
                    tuple,
                    user,
                    authLevel,
                    targetDN,
                    namingMatcherGetter,
                    isMemberOfGroup,
                ),
            ]),
        ))
            .filter((tuple) => (tuple[5] > 0));
    return tuplesThatApplyToUser;
}

export default preprocessTuples;
