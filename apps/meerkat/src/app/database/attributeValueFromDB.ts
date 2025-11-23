import type { AttributeValue } from "@prisma/client";
import { BERElement, ASN1Construction } from "@wildboar/asn1";

export
interface DBAttributeValue {
    tag_class: AttributeValue["tag_class"],
    constructed: AttributeValue["constructed"],
    tag_number: AttributeValue["tag_number"],
    content_octets: AttributeValue["content_octets"],
}

export
function attributeValueFromDB (value: DBAttributeValue): BERElement {
    const el = new BERElement();
    el.tagClass = value.tag_class;
    el.construction = value.constructed
        ? ASN1Construction.constructed
        : ASN1Construction.primitive;
    el.tagNumber = value.tag_number;
    el.value = value.content_octets;
    return el;
}
