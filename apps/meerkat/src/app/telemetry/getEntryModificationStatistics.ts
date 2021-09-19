import type { EntryModificationStatistics, ContextStatistics } from "../types";
import type { EntryModification } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryModification.ta";
import type { Attribute } from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";

function fromAttribute (attr: Attribute): EntryModificationStatistics {
    return {
        attributeType: attr.type_.toString(),
        numberOfValues: (
            attr.values.length
            + (attr.valuesWithContext?.length ?? 0)
        ),
        contextsUsed: attr
            ?.valuesWithContext
            ?.flatMap((vwc): ContextStatistics[] => vwc.contextList
                .map((c): ContextStatistics => ({
                    type: c.contextType.toString(),
                    fallback: c.fallback,
                }))),
    };
}

export
function getEntryModificationStatistics (mod: EntryModification): EntryModificationStatistics {
    if ("addAttribute" in mod) {
        return {
            type: "addAttribute",
            ...fromAttribute(mod.addAttribute),
        };
    }
    else if ("removeAttribute" in mod) {
        return {
            type: "removeAttribute",
            attributeType: mod.removeAttribute.toString(),
        };
    }
    else if ("addValues" in mod) {
        return {
            type: "addValues",
            ...fromAttribute(mod.addValues),
        };
    }
    else if ("removeValues" in mod) {
        return {
            type: "removeValues",
            ...fromAttribute(mod.removeValues),
        };
    }
    else if ("alterValues" in mod) {
        return {
            type: "alterValues",
            attributeType: mod.alterValues.type_.toString(),
        };
    }
    else if ("resetValue" in mod) {
        return {
            type: "resetValue",
            attributeType: mod.resetValue.toString(),
        };
    }
    else if ("replaceValues" in mod) {
        return {
            type: "replaceValues",
            ...fromAttribute(mod.replaceValues),
        };
    } else {
        return {};
    }
}

export default getEntryModificationStatistics;
