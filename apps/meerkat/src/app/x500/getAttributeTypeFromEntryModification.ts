import type {
    AttributeType,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";
import type {
    EntryModification,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryModification.ta";

/**
 * @summary Determine the attribute type named by an entry modification.
 * @description
 *
 * This function returns the attribute type that is to be modified by an entry
 * modification.
 *
 * @param mod The modification whose attribute type is to be extracted
 * @returns The affected attribute type, if there is one.
 *
 * @function
 */
export
function getAttributeTypeFromEntryModification (mod: EntryModification): AttributeType | undefined {
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
