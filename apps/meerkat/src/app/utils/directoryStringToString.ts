import { teletexToString } from "@wildboar/x500";
import { ASN1Element, ASN1TagClass, ASN1UniversalType } from "asn1-ts";

export
function betterDS (ds: ASN1Element): string | null {
    if (ds.tagClass !== ASN1TagClass.universal) {
        return null;
    }
    switch (ds.tagNumber) {
        case (ASN1UniversalType.utf8String): return ds.utf8String;
        case (ASN1UniversalType.printableString): return ds.printableString;
        case (ASN1UniversalType.universalString): return ds.universalString;
        case (ASN1UniversalType.bmpString): return ds.bmpString;
        case (ASN1UniversalType.teletexString): return teletexToString(ds.teletexString);
        default: return null;
    }
}
