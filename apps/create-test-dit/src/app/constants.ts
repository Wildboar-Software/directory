import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
import {
    commonName,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
import { DER } from "asn1-ts/dist/node/functional";

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
