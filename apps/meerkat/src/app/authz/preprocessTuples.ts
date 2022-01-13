import type { OBJECT_IDENTIFIER } from "asn1-ts";
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

/**
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
 * @returns
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
