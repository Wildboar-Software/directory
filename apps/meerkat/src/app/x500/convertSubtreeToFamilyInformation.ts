import type { DIT, Vertex } from "@wildboar/meerkat-types";
import {
    EntryInformation_information_Item,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    FamilyEntries,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    FamilyEntry,
} from "@wildboar/x500/DirectoryAbstractService";
import groupByOID from "../utils/groupByOID";

/**
 * @summary Convert a subtree of entries into groups of `FamilyEntries`
 * @description
 *
 * This function takes a root of a subtree whose subordinates are to be grouped
 * into `FamilyEntries` values by their structural object class. The returned
 * `FamilyEntries` values can be used as values of the `family-information`
 * attribute type described in ITU Recommendation X.511 (2016), Section 7.7.2.
 *
 * @param dit The root of the subtree to be converted
 * @param getInfo A function that will take a vertex and return entry information
 * @returns An array of `FamilyEntries` as used in the X.500 `family-information` attribute
 *
 * @function
 */
export
function convertSubtreeToFamilyInformation (
    dit: DIT,
    getInfo: (vertex: Vertex) => EntryInformation_information_Item[],
): FamilyEntries[] {
    const subordinates = dit.subordinates?.filter((sub) => sub.dse.structuralObjectClass) ?? [];
    const families = groupByOID<Vertex>(subordinates, (item) => item.dse.structuralObjectClass!);
    return Object.values(families)
        .map((members) => new FamilyEntries(
            members[0].dse.structuralObjectClass!,
            members.map((member) => new FamilyEntry(
                member.dse.rdn,
                getInfo(member),
                member.subordinates?.length
                    ? convertSubtreeToFamilyInformation(member, getInfo)
                    : undefined,
            )),
        ));
}

export default convertSubtreeToFamilyInformation;
