import type { Context } from "@wildboar/meerkat-types";
import type { ASN1Element } from "asn1-ts";
import { DER } from "asn1-ts/dist/node/functional";
import {
    PartialAttribute,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/PartialAttribute.ta";
import encodeLDAPOID from "@wildboar/ldap/src/lib/encodeLDAPOID";
import {
    EntryInformation_information_Item,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation-information-Item.ta";
import {
    ldapAttributeOptionContext,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/ldapAttributeOptionContext.oa";
import {
    temporalContext,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/temporalContext.oa";
import {
    Attribute_valuesWithContext_Item,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute-valuesWithContext-Item.ta";
import {
    TimeAssertion,
    _encode_TimeAssertion,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/TimeAssertion.ta";
import evaluateTemporalContext from "@wildboar/x500/src/lib/matching/context/temporalContext";

const now: TimeAssertion = {
    now: null,
};
const encodedTimeAssertion = _encode_TimeAssertion(now, DER);

export
function getPartialAttributesFromEntryInformation (
    ctx: Context,
    infoItems: EntryInformation_information_Item[],
): PartialAttribute[] {
    return infoItems.flatMap((einfo) => {
        if ("attributeType" in einfo) {
            const attrType = einfo.attributeType;
            const attrSpec = ctx.attributeTypes.get(attrType.toString());
            if (!attrSpec) {
                return undefined;
            }
            return new PartialAttribute(
                (attrSpec.ldapNames && attrSpec.ldapNames.length > 0)
                    ? Buffer.from(attrSpec.ldapNames[0], "utf-8")
                    : encodeLDAPOID(attrType),
                [],
            );
        } else if ("attribute" in einfo) {
            const attrType = einfo.attribute.type_;
            const attrSpec = ctx.attributeTypes.get(attrType.toString());
            if (!attrSpec?.ldapSyntax) {
                // ctx.log.warn(`No LDAP syntax defined for attribute ${attrType.toString()}.`);
                return undefined;
            }
            const ldapSyntax = ctx.ldapSyntaxes.get(attrSpec.ldapSyntax.toString());
            if (!ldapSyntax?.encoder) {
                // ctx.log.warn(`LDAP Syntax ${attrSpec.ldapSyntax} not understood or had no encoder.`);
                return undefined;
            }
            const encoder = ldapSyntax.encoder;
            // Note: some LDAP programs will not display the value if the attribute description is an OID.
            // ^Source? Details? I used Apache Directory Studio for testing. Was that it?

            // Filter out all values with a temporal context for which "now" does not match.
            const valuesWithContextToReturn: Attribute_valuesWithContext_Item[] =
                (einfo.attribute.valuesWithContext ?? [])
                .filter((vwc) => {
                    const temporalContexts = vwc.contextList
                        .filter((c) => (c.contextType.isEqualTo(temporalContext["&id"])));
                    if (temporalContexts.length === 0) {
                        return true;
                    }
                    // Otherwise, make sure one of the temporal contexts applies to now.
                    return temporalContexts
                        .some((tc) => tc.contextValues
                            .some((cv) => {
                                try {
                                    return evaluateTemporalContext(encodedTimeAssertion, cv);
                                } catch {
                                    return false;
                                }
                            }));
                });

            /**
             * This is used to group attribute values by their unique set of
             * LDAP attribute options so they can be returned as separate
             * `PartialAttribute`s.
             */
            const valuesByOptions: Map<string, ASN1Element[]> = new Map();
            const valuesWithoutOptions = valuesWithContextToReturn
                .filter((vwc) => {
                    const optionsContexts = (vwc.contextList
                        .filter((c) => (c.contextType.isEqualTo(ldapAttributeOptionContext["&id"]))));
                    if (optionsContexts.length) {
                        optionsContexts
                            .forEach((oc) => oc.contextValues
                                .forEach((cv) => {
                                    const list = ldapAttributeOptionContext.decoderFor["&Type"]!(cv);
                                    const key: string = list
                                        .map((item) => item.trim().toLowerCase())
                                        .sort()
                                        .join(";");
                                    const valuesOfSameOptions = valuesByOptions.get(key);
                                    if (valuesOfSameOptions) {
                                        valuesOfSameOptions.push(vwc.value);
                                    } else {
                                        valuesByOptions.set(key, [ vwc.value ]);
                                    }
                                }));
                        return false;
                    } else {
                        return true;
                    }
                });

            const descriptor: Uint8Array = (attrSpec.ldapNames && attrSpec.ldapNames.length > 0)
                ? Buffer.from(attrSpec.ldapNames[0], "utf-8")
                : encodeLDAPOID(attrType);
            return [
                new PartialAttribute(
                    descriptor,
                    [
                        ...einfo.attribute.values
                            .map(encoder),
                        ...valuesWithoutOptions
                            .map((vwc) => encoder(vwc.value)),
                    ],
                ),
                ...Array.from(valuesByOptions.entries())
                    .map(([ options, values ]) => new PartialAttribute(
                        Buffer.concat([
                            descriptor,
                            Buffer.from(";", "utf-8"),
                            Buffer.from(options, "utf-8"),
                        ]),
                        values.map(encoder),
                    )),
            ];
        } else {
            return undefined;
        }
    })
        .filter((attr): attr is PartialAttribute => !!attr);
}

export default getPartialAttributesFromEntryInformation;
