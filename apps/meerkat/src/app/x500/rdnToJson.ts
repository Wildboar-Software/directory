import type {
    RelativeDistinguishedName as RDN,
} from "@wildboar/x500/src/lib/modules/InformationFramework/RelativeDistinguishedName.ta";

export
function rdnToJson (rdn: RDN): Record<string, string> {
    return Object.fromEntries(
        rdn.map((atav) => [ atav.type_.toString(), "#" + Buffer.from(atav.value.toBytes()).toString("hex") ]),
    );
}

export default rdnToJson;
