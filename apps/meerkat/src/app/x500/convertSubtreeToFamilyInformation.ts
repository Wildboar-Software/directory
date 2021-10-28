import type { DIT, Vertex } from "@wildboar/meerkat-types";
import {
    EntryInformation_information_Item,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation-information-Item.ta";
import {
    FamilyEntries,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FamilyEntries.ta";
import {
    FamilyEntry,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FamilyEntry.ta";
import groupByOID from "../utils/groupByOID";

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
