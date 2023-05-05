import type {
    AttributeType,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";
import type {
    EntryModification,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryModification.ta";

export
async function getAttributeTypeFromEntryModification (mod: EntryModification): Promise<AttributeType | undefined> {
    if ("addAttribute" in mod) {
        return mod.addAttribute.type_;
    }
    if ("removeAttribute" in mod) {
        return mod.removeAttribute;
    }
    if ("addValues" in mod) {
        return mod.addValues.type_;
    }
    if ("removeValues" in mod) {
        return mod.removeValues.type_;
    }
    if ("alterValues" in mod) {
        return mod.alterValues.type_;
    }
    if ("resetValue" in mod) {
        return mod.resetValue;
    }
    if ("replaceValues" in mod) {
        return mod.replaceValues.type_;
    }
    return undefined;
}

export default getAttributeTypeFromEntryModification;
