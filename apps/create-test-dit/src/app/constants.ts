import type {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/InformationFramework";
import {
    commonName,
} from "@wildboar/x500/SelectedAttributeTypes";
import { DER } from "@wildboar/asn1/functional";

export const adminDN: DistinguishedName = [
    [
        new AttributeTypeAndValue(
            commonName["&id"],
            commonName.encoderFor["&Type"]!({
                uTF8String: "admin",
            }, DER),
        ),
    ],
];
