import type { GeneralName } from "@wildboar/pki-stub";
import { domainToASCII } from "node:url";
import { getDistinguishedValueKey } from "../x500/getDistinguishedValueKey.js";

// In my opinion, this is the appropriate ASCII character for separating
// hierarchical elements.
const ASCII_UNIT_SEPARATOR = "\x1F";

// TODO: subset checking
/*
One GeneralNameTrie<AllowedAttributeAssignments> is a subset of another IFF:

Iterate over every node in the "subset" trie. All of the attributes in each
node must be present in that node's analog (or one of its ancestors) in the
"superset" trie.

AllowedAttributeAssignments  ::=  SET OF SEQUENCE {
    attributes              [0]  SET OF CHOICE {
        attributeType           [0]  AttributeType,
        attributeTypeandValues  [1]  Attribute{{SupportedAttributes}},
        ... },
    holderDomain            [1]  GeneralName,
    ... }
*/

export class GeneralNameTrie<V> {
    protected dnsRoot: Map<string, V> = new Map();
    protected x500Root: Map<string, V> = new Map();
    protected oidRoot: Map<string, V> = new Map();

    // TODO: Handle root DNS node.
    // TODO: Handle root X.500 node.
    private getNeedleAndHaystack(gn: GeneralName): [ string[], Map<string, V> ] | null {
        if ("dNSName" in gn) {
            if (gn.dNSName.indexOf("\x1F") > -1) {
                return null;
            }
            let dnsName = gn.dNSName.trim();
            if (dnsName.endsWith(".")) {
                dnsName = dnsName.slice(0, -1);
            }
            const needle = domainToASCII(dnsName)
                .toLowerCase()
                .split(".")
                .reverse();
            return [ needle, this.dnsRoot ];
        } else if ("directoryName" in gn) {
            const rdns = gn.directoryName.rdnSequence;
            const needle: string[] = [];
            for (const rdn of rdns) {
                const s: string[] = [];
                for (const atav of rdn) {
                    const v = getDistinguishedValueKey(atav.type_, atav.value);
                    if (!v) {
                        return null;
                    }
                    s.push(`${atav.type_.toString()}=${v}`);
                }
                s.sort();
                needle.push(JSON.stringify(s));
            }
            return [ needle, this.x500Root ];
        } else if ("registeredID" in gn) {
            const needle = gn.registeredID.nodes.map((n) => n.toString());
            return [ needle, this.oidRoot ];
        } else {
            return null;
        }
    }

    /**
     * @summary Insert a general name and its associated value into the trie
     * @description
     *
     * This only inserts `GeneralName`s having these variants:
     *
     * - `dNSName`
     * - `directoryName`
     * - `registeredID` (an object identifier)
     *
     * @param gn The general name to index, which must have a variant that has a
     *  well-defined hierarchical structure.
     * @param value The value to set for the given general name.
     *
     * @returns `true` if the general name was inserted, or `false` if it did
     *  not have a known, hierarchical variant.
     */
    public setValue (gn: GeneralName, value: V): boolean {
        const needleAndHaystack = this.getNeedleAndHaystack(gn);
        if (!needleAndHaystack) {
            return false;
        }
        const [ needle, haystack ] = needleAndHaystack;
        const key = needle.join(ASCII_UNIT_SEPARATOR);
        haystack.set(key, value);
        return true;
    }

    public getValue(gn: GeneralName): V | undefined {
        const maybe = this.getNeedleAndHaystack(gn);
        if (!maybe) {
            return undefined;
        }
        const [ needle, haystack ] = maybe;
        const key = needle.join(ASCII_UNIT_SEPARATOR);
        return haystack.get(key);
    }

    public* descendOptionalValues(gn: GeneralName): IterableIterator<V | undefined> {
        const maybe = this.getNeedleAndHaystack(gn);
        if (!maybe) {
            return undefined;
        }
        const [ needle, haystack ] = maybe;
        let key = "";
        const first = haystack.get(key);
        first && (yield first);
        for (let i = 0; i < needle.length; i++) {
            if (i > 0) {
                key += (ASCII_UNIT_SEPARATOR + needle[i]);
            } else {
                key += needle[i];
            }
            yield haystack.get(key);
        }
    }

    public* descendValues(gn: GeneralName): IterableIterator<V> {
        for (const maybeValue of this.descendOptionalValues(gn)) {
            if (typeof maybeValue !== "undefined") {
                yield maybeValue;
            }
        }
    }

    /**
     * @internal
     */
    public z__testingInternals(): Map<string, V>[] {
        return [
            this.dnsRoot,
            this.x500Root,
            this.oidRoot,
        ];
    }

}

export default GeneralNameTrie;
