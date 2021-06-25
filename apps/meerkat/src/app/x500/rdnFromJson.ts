import type {
    RelativeDistinguishedName as RDN,
} from "@wildboar/x500/src/lib/modules/InformationFramework/RelativeDistinguishedName.ta";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
import { ASN1Element, BERElement, ObjectIdentifier } from "asn1-ts";

export
function rdnFromJson (rdn: Record<string, string>): RDN {
    return Object.entries(rdn).map(([ oidStr, value ]) => new AttributeTypeAndValue(
        new ObjectIdentifier(oidStr.split(".").map((num) => Number.parseInt(num))),
        ((): ASN1Element => {
            const el = new BERElement();
            el.fromBytes(Buffer.from(value.slice(1), "hex"));
            return el;
        })(),
    ));
}

export default rdnFromJson;
