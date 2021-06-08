// import {
//     Attribute,
// } from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import {
    ObjectClassKind,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import type {
    Name,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Name.ta";
import {
    AttributeUsage,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import type {
    EqualityMatcher,
} from "@wildboar/x500/src/lib/types/EqualityMatcher";
import type {
    OrderingMatcher,
} from "@wildboar/x500/src/lib/types/OrderingMatcher";
// FIXME: export non-default:
import type SubstringsMatcher from "@wildboar/x500/src/lib/types/SubstringsMatcher";
import type {
    ContextMatcher,
} from "@wildboar/x500/src/lib/types/ContextMatcher";
import { ASN1Element, OBJECT_IDENTIFIER } from "asn1-ts";

export
type UUID = string;

export
type IndexableOID = string;

export
type LDAPName = string;

export
interface AttributeInfo {
    id: IndexableOID;
    parent?: AttributeInfo;
    value: {
        write: (ctx: Context, value: ASN1Element) => Promise<void>; // eslint-disable-line
        read: (ctx: Context) => Promise<ASN1Element>; // eslint-disable-line
    };

    /**
     * From ITU Recommendation X.501 (2016), Section 8.9.5:
     *
     * > Equality matching rules for attributes used for naming shall be
     * > transitive, commutative and have an assertion syntax identical to the
     * > attribute syntax.
     *
     * From ITU Recommendation X.501 (2016), Section 9.3:
     *
     * > NOTE 1 – The equality matching rule can be used because for naming
     * > attributes, the attribute syntax and the assertion syntax of the
     * > equality matching rule are the same.
     *
     * This same footnote appears in section 9.4.
     */
    namingMatcher?: EqualityMatcher;
    equalityMatcher?: EqualityMatcher;
    orderingMatcher?: OrderingMatcher;
    substringsMatcher?: SubstringsMatcher;
    singleValued: boolean;
    collective: boolean;
    dummy: boolean;
    noUserModification: boolean;
    usage: AttributeUsage;
    ldapSyntax?: IndexableOID;
    ldapNames?: LDAPName[];
    ldapDescription?: string;
    obsolete: boolean;
}

export
interface ObjectClassInfo {
    id?: IndexableOID;
    kind: ObjectClassKind;
    mandatoryAttributes: Set<IndexableOID>;
    optionalAttributes: Set<IndexableOID>;
    ldapNames?: LDAPName[];
    ldapDescription?: string;
}

// Still necessary, because not all object classes have OIDs.
export
interface StructuralObjectClassInfo extends ObjectClassInfo {
    kind: ObjectClassKind; // Could be structural or auxiliary. This should be validated at init.
    parent?: StructuralObjectClassInfo;
    children: StructuralObjectClassInfo[];
}

export
interface StoredContext {
    id: OBJECT_IDENTIFIER;
    fallback: boolean;
    values: ASN1Element[];
}

export
interface StoredAttributeValueWithContexts {
    entry: UUID;
    id: OBJECT_IDENTIFIER;
    value: ASN1Element;
    contexts: Map<IndexableOID, StoredContext>;
}

export
interface Entry {
    id: UUID;
    dn: Name;
    parent?: UUID;
    // Managed by the DSA, and based on the aliasedEntryName operational attribute.
    aliasedEntryId?: UUID;
}

export
interface DatabaseData {
    entries: Map<UUID, Entry>;
    values: StoredAttributeValueWithContexts[];
}

export
interface Database {
    data: DatabaseData;
}

export
interface Context {
    log: typeof console;
    database: Database;
    structuralObjectClassHierarchy: StructuralObjectClassInfo;
    objectClasses: Map<IndexableOID, ObjectClassInfo>;
    attributes: Map<IndexableOID, AttributeInfo>;
    equalityMatchingRules: Map<IndexableOID, EqualityMatcher>;
    orderingMatchingRules: Map<IndexableOID, OrderingMatcher>;
    substringsMatchingRules: Map<IndexableOID, SubstringsMatcher>;
    contextMatchers: Map<IndexableOID, ContextMatcher>;
}
