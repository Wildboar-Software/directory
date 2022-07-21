import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";

export
function normalizeDN (dn: DistinguishedName): DistinguishedName {
    const newDN: DistinguishedName = [];
    for (const rdn of dn) {
        const newRDN = [ ...rdn ];
        if (newRDN.length > 1) {
            newRDN.sort((a, b) => a.type_.toString().localeCompare(b.type_.toString()));
        }
        newDN.push(newRDN);
    }
    return newDN;
}
