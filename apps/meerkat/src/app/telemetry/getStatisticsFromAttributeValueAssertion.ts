import type {
    AttributeValueAssertion,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeValueAssertion.ta";
import type {
    AttributeValueAssertionStatistics,
    ContextStatistics,
} from "@wildboar/meerkat-types";

export
function getStatisticsFromAttributeValueAssertion (ava: AttributeValueAssertion): AttributeValueAssertionStatistics {
    return {
        type: ava.type_.toString(),
        allContexts: (ava.assertedContexts && ("allContexts" in ava.assertedContexts)),
        selectedContexts: (
            ava.assertedContexts
            && ("selectedContexts" in ava.assertedContexts)
        )
            ? ava.assertedContexts.selectedContexts
                .map((sc): ContextStatistics => ({
                    type: sc.contextType.toString(),
                }))
            : undefined,
    };
}

export default getStatisticsFromAttributeValueAssertion;
