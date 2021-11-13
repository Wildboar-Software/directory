import type {
    EntryInformationSelectionStatistics,
    ContextAssertionStatistics,
} from "@wildboar/meerkat-types";
import type {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";

export
function getEntryInformationSelectionStatistics (eis: EntryInformationSelection): EntryInformationSelectionStatistics {
    return {
        allUserAttributes: eis.attributes && ("allUserAttributes" in eis.attributes),
        selectUserAttributes: eis.attributes && ("select" in eis.attributes)
            ? eis.attributes.select.map((oid) => oid.toString())
            : undefined,
        infoTypes: (eis.infoTypes !== undefined)
            ? Number(eis.infoTypes)
            : undefined,
        allExtraAttributes: eis.extraAttributes && ("allOperationalAttributes" in eis.extraAttributes),
        selectExtraAttributes: eis.extraAttributes && ("select" in eis.extraAttributes)
            ? eis.extraAttributes.select.map((oid) => oid.toString())
            : undefined,
        allContexts: eis.contextSelection && ("allContexts" in eis.contextSelection),
        selectedContexts: eis.contextSelection && ("selectedContexts" in eis.contextSelection)
            ? eis.contextSelection.selectedContexts
                .map((sc) => ({
                    type: sc.type_.toString(),
                    all: ("all" in sc.contextAssertions)
                        ? sc.contextAssertions.all.map((ca): ContextAssertionStatistics => (({
                            contextType: ca.contextType.toString(),
                            contextValuesLength: ca.contextValues.length,
                        })))
                        : undefined,
                    preference: ("preference" in sc.contextAssertions)
                        ? sc.contextAssertions.preference.map((ca): ContextAssertionStatistics => (({
                            contextType: ca.contextType.toString(),
                            contextValuesLength: ca.contextValues.length,
                        })))
                        : undefined,
                }))
            : undefined,
        returnContexts: eis.returnContexts,
        familyReturn: eis.familyReturn
            ? {
                memberSelect: eis.familyReturn.memberSelect,
                familySelect: eis.familyReturn.familySelect?.map((fs) => fs.toString()),
            }
            : undefined,
    };
}

export default getEntryInformationSelectionStatistics;
