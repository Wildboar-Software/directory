import type { IndexableOID } from "../types/index.js";
import {
    Attribute,
    Attribute_valuesWithContext_Item,
} from "@wildboar/pki-stub";
import type {
    AttributeMappings,
    AttributeMappings_Item_typeValueMappings,
} from "@wildboar/x500/AttributeCertificateDefinitions";
import {
    compareElements,
    type EqualityMatcher,
} from "@wildboar/x500";
import { ASN1Element } from "@wildboar/asn1";
import type { AttributeType } from "@wildboar/x500/InformationFramework";

// Just for shorter lines.
type ValueMap = AttributeMappings_Item_typeValueMappings;

// TODO: Move to @wildboar/x500
/**
 * @summary Map attribute types and values using X.509v3 Attribute Mappings
 * @description
 *
 * This function maps attributes from a "local" domain to a "remote" domain or
 * vice versa, according to the behavior of the `attributeMappings` X.509v3
 * extension defined for usage in X.509 attribute certificates. The newly
 * returned attributes are yielded by the returned iterator.
 *
 * The "local" domain in the context of attribute certification is the domain of
 * the issuing SOA that is issuing an attribute certificate to another SOA--the
 * "remote SOA"--which is the authority for attribute certification in the
 * remote domain. This information is embedded in the `attributeMappings`
 * extension in the attribute certificate issued to the remote SOA, so when you
 * see "local," note that it does not refer to the domain of the attribute
 * certificate in which it appears. The direction of the mapping can be
 * controlled by the `remoteToLocal` parameter.
 *
 * Note that the output attributes are not guaranteed to be unique, even if the
 * inputs are. The output may contain duplicate attribute types as well as
 * duplicate attribute values. The reason for this laziness in design is that
 * uniqueness might not be needed, so deduplicating might incur an unnecessary
 * cost.
 *
 * None of the input parameters are mutated. The `attrsByType` parameter is a
 * map instead of an array because quick random lookups of attributes are needed
 * internally. A caller can easily produce `attrsByType` from an array of
 * `Attribute`s by using `@wildboar/x500`'s `groupByOID` like so:
 *
 * ```typescript
 * const attributesMap = groupByOID(attributes, (a) => a.type_);
 * ```
 *
 * ### ASN.1 Reference
 *
 * For reference, this is the ASN.1 of the `attributeMappings` extension:
 *
 * ```asn1
 * attributeMappings EXTENSION ::= {
 *   SYNTAX         AttributeMappings
 *   IDENTIFIED BY  id-ce-attributeMappings }
 *
 * AttributeMappings ::= SET OF CHOICE {
 *   typeMappings      [0]  SEQUENCE {
 *     local             [0]  AttributeType,
 *     remote            [1]  AttributeType,
 *     ... },
 *   typeValueMappings [1]  SEQUENCE {
 *     local             [0]  AttributeTypeAndValue,
 *     remote            [1]  AttributeTypeAndValue,
 *     ... } }
 * ```
 *
 * @param attrsByType Attributes to map organized in a `Map` with the
 *  dot-delimited attribute type object identifier as the key (e.g. `2.5.4.3`)
 * @param mappings The mappings of attribute types or values to apply
 * @param attributeValueIndexer A function that generates the same string for
 *  two attribute values of the same type that match according to that type's
 *  equality matching rule
 * @param getEqualityMatcher A function that takes an attribute type object
 *  identifier and returns a function that matches values of that type according
 *  to that attribute type's equality matching rule
 * @param remoteToLocal If `true` (default), map from the remote domain to the
 *  local domain; if `false`, map from the local domain to the remote domain.
 *
 * @function
 */
export
function* applyMappingsToAttributes (
    attrsByType: Map<IndexableOID, Attribute[]>,
    mappings: AttributeMappings,
    // TODO: Implementation that compares all types byte-for-byte, but
    // normalizes strings using prepString. This should be 95% fine for things
    // that are DER encoded, such as attribute certificates.
    attributeValueIndexer: (type_: AttributeType, value: ASN1Element) => string,
    getEqualityMatcher: (attributeType: AttributeType) => EqualityMatcher | undefined,
    remoteToLocal: boolean = true,
): IterableIterator<Attribute> { // Should not return ATAVs: then you have to incur the cost of re-grouping them.
    const valueMappingsByUnmappedType: Map<IndexableOID, ValueMap[]> = new Map();
    for (const mapping of mappings) {
        if ("typeMappings" in mapping) {
            const tm = mapping.typeMappings;
            const unmappedType = remoteToLocal ? tm.remote : tm.local;
            const mappedType = remoteToLocal ? tm.local : tm.remote;
            const attrs = attrsByType.get(unmappedType.toString());
            if (!attrs?.length) {
                continue; // We don't have this attribute.
            }
            yield *attrs
                .map((a) => new Attribute(mappedType, a.values, a.valuesWithContext));
        }
        else if ("typeValueMappings" in mapping) {
            /* We don't do the mapping yet here: we just group value mappings by
            type so we can map all values of an attribute in one pass. */
            const unmappedType = remoteToLocal
                ? mapping.typeValueMappings.remote.type_
                : mapping.typeValueMappings.local.type_;
            const key = unmappedType.toString();
            if (!attrsByType.has(key)) {
                // Don't index it: we don't have values of this type anyway.
                continue;
            }
            const valueMappings = valueMappingsByUnmappedType.get(key);
            if (valueMappings) {
                valueMappings.push(mapping.typeValueMappings);
            } else {
                valueMappingsByUnmappedType.set(key, [ mapping.typeValueMappings ]);
            }
        }
    }

    for (const [key, valueMappings] of valueMappingsByUnmappedType.entries()) {
        const attrs = attrsByType.get(key);
        if (!attrs?.length) {
            continue; // This should never happen.
        }
        const unmappedType = remoteToLocal
            ? valueMappings[0].remote.type_
            : valueMappings[0].local.type_;
        const mappedType = remoteToLocal
            ? valueMappings[0].local.type_
            : valueMappings[0].remote.type_;
        if (valueMappings.length === 1) {
            const valueMapping = valueMappings[0];
            const unmappedValue = remoteToLocal
                ? valueMapping.remote.value
                : valueMapping.local.value;
            const mappedValue = remoteToLocal
                ? valueMapping.local.value
                : valueMapping.remote.value;
            const matcher = getEqualityMatcher(unmappedType) ?? compareElements;
            let newValue: ASN1Element | undefined;
            const newValuesWithContext: Attribute_valuesWithContext_Item[] = [];
            for (const attr of attrs) {
                if (!newValue) { // Idempotence.
                    for (const value of attr.values) {
                        try {
                            if (matcher(value, unmappedValue, getEqualityMatcher)) {
                                newValue = mappedValue;
                                break;
                            }
                        } catch {
                            continue;
                        }
                    }
                }
                /* The reason this is not idempotent (the same value can be
                duplicate among valuesWithContext) is that not all context
                values are absent-match: in other words, the value alone does
                not match the same value but with a context attached. */
                for (const vwc of attr.valuesWithContext ?? []) {
                    try {
                        if (matcher(vwc.value, unmappedValue, getEqualityMatcher)) {
                            const newVWC = new Attribute_valuesWithContext_Item(
                                mappedValue,
                                vwc.contextList,
                                vwc._unrecognizedExtensionsList,
                            );
                            newValuesWithContext.push(newVWC);
                        }
                    } catch {
                        continue;
                    }
                }
            }
            if (newValue || newValuesWithContext.length) {
                // Only yield the attribute if it has values.
                yield new Attribute(
                    mappedType,
                    newValue ? [ newValue ] : [],
                    newValuesWithContext.length ? newValuesWithContext : undefined,
                );
            }
        } else {
            const unmappedValuesIndex: Map<string, AttributeMappings_Item_typeValueMappings> = new Map();
            for (const mapping of valueMappings) {
                const unmappedValue = remoteToLocal
                    ? mapping.remote.value
                    : mapping.local.value;
                try {
                    const unmappedKey = attributeValueIndexer(unmappedType, unmappedValue);
                    unmappedValuesIndex.set(unmappedKey, mapping);
                } catch {
                    continue;
                }
            }
            for (const attr of attrs) {
                for (const value of attr.values) {
                    let key
                    try {
                        key = attributeValueIndexer(attr.type_, value);
                    } catch {
                        continue;
                    }
                    const mapping = unmappedValuesIndex.get(key);
                    if (!mapping) {
                        continue;
                    }
                    const newType = remoteToLocal
                        ? mapping.local.type_
                        : mapping.remote.type_;
                    const newValue = remoteToLocal
                        ? mapping.local.value
                        : mapping.remote.value;
                    yield new Attribute(
                        newType,
                        [ newValue ],
                    );
                }
                for (const vwc of attr.valuesWithContext ?? []) {
                    const key = attributeValueIndexer(attr.type_, vwc.value);
                    const mapping = unmappedValuesIndex.get(key);
                    if (!mapping) {
                        continue;
                    }
                    const newType = remoteToLocal
                        ? mapping.local.type_
                        : mapping.remote.type_;
                    const newValue = remoteToLocal
                        ? mapping.local.value
                        : mapping.remote.value;
                    yield new Attribute(
                        newType,
                        [],
                        [
                            new Attribute_valuesWithContext_Item(
                                newValue,
                                vwc.contextList,
                                vwc._unrecognizedExtensionsList,
                            ),
                        ],
                    );
                }
            }
        }
    }
}

export default applyMappingsToAttributes;
