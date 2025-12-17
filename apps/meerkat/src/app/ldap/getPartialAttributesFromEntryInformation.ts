import type { Context } from "../types/index.js";
import type { ASN1Element } from "@wildboar/asn1";
import { DER } from "@wildboar/asn1/functional";
import {
    PartialAttribute,
} from "@wildboar/ldap";
import { encodeLDAPOID } from "@wildboar/ldap";
import {
    EntryInformation_information_Item,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ldapAttributeOptionContext,
} from "@wildboar/x500/SelectedAttributeTypes";
import {
    temporalContext,
} from "@wildboar/x500/SelectedAttributeTypes";
import {
    Attribute_valuesWithContext_Item,
} from "@wildboar/x500/InformationFramework";
import {
    TimeAssertion,
    _encode_TimeAssertion,
} from "@wildboar/x500/SelectedAttributeTypes";
import { evaluateTemporalContext } from "@wildboar/x500/matching/context";

const now: TimeAssertion = {
    now: null,
};
const encodedTimeAssertion = _encode_TimeAssertion(now, DER);

/**
 * @summary Convert X.500 entry information into LDAP `PartialAttribute`s
 * @description
 *
 * This function converts X.500 entry information item into LDAP
 * `PartialAttribute`s. Entry information items that cannot be converted are
 * silently omitted from the return value.
 *
 * The LDAP `PartialAttribute` type is defined in IETF RFC 4511, Section 4.1.7.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4511#section-4.1.7
 *
 * @param ctx The context object
 * @param infoItems The X.500 entry information to be converted to LDAP `PartialAttribute`s
 * @returns An array of LDAP `PartialAttribute`s
 *
 * @function
 */
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
            const nonDupedName = attrSpec.ldapNames?.find((name) => !ctx.duplicatedLDAPNames.has(name));
            const descriptor: Uint8Array = nonDupedName
                ? Buffer.from(nonDupedName, "utf-8")
                : encodeLDAPOID(attrType);
            return new PartialAttribute(
                descriptor,
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

            // Wrap the encoder in error handling so we can ignore attributes that don't encode successfully.
            const encoder = (
                ...args: Parameters<typeof ldapSyntax.encoder>
            ): ReturnType<typeof ldapSyntax.encoder> | null => {
                try {
                    return ldapSyntax.encoder!(...args);
                } catch {
                    return null;
                }
            };
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

            const nonDupedName = attrSpec.ldapNames?.find((name) => !ctx.duplicatedLDAPNames.has(name));
            const descriptor: Uint8Array = nonDupedName
                ? Buffer.from(nonDupedName, "utf-8")
                : encodeLDAPOID(attrType);
            return [
                new PartialAttribute(
                    descriptor,
                    [
                        ...einfo.attribute.values
                            .map(encoder)
                            .filter((v): v is Uint8Array => !!v),
                        ...valuesWithoutOptions
                            .map((vwc) => encoder(vwc.value))
                            .filter((v): v is Uint8Array => !!v),
                    ],
                ),
                ...Array.from(valuesByOptions.entries())
                    .map(([ options, values ]) => new PartialAttribute(
                        Buffer.concat([
                            descriptor,
                            Buffer.from(";", "utf-8"),
                            Buffer.from(options, "utf-8"),
                        ]),
                        values.map(encoder).filter((v): v is Uint8Array => !!v),
                    )),
            ];
        } else {
            return undefined;
        }
    })
        .filter((attr): attr is PartialAttribute => !!attr);
}

export default getPartialAttributesFromEntryInformation;
