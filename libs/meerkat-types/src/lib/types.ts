import { randomUUID } from "crypto";
import {
    Logger,
} from "winston";
import {
    ObjectClassKind,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import type {
    Name,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Name.ta";
import type {
    RelativeDistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/RelativeDistinguishedName.ta";
import {
    AttributeUsage,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import type {
    EqualityMatcher,
} from "@wildboar/x500/src/lib/types/EqualityMatcher";
import type {
    OrderingMatcher,
} from "@wildboar/x500/src/lib/types/OrderingMatcher";
import type {
    SubstringsMatcher,
} from "@wildboar/x500/src/lib/types/SubstringsMatcher";
import type {
    ContextMatcher,
} from "@wildboar/x500/src/lib/types/ContextMatcher";
import type { ASN1Element, OBJECT_IDENTIFIER, BIT_STRING, INTEGER, BOOLEAN } from "asn1-ts";
import type {
    PagedResultsRequest_newRequest,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PagedResultsRequest-newRequest.ta";
import type {
    SubtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/SubtreeSpecification.ta";3
import type {
    ACIItem,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/ACIItem.ta";
import type {
    AccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import type {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import type {
    TypeAndContextAssertion,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/TypeAndContextAssertion.ta";
import type {
    SearchRuleDescription,
} from "@wildboar/x500/src/lib/modules/InformationFramework/SearchRuleDescription.ta";
import type {
    PwdEncAlg,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/PwdEncAlg.ta";
import type {
    AttributeType,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";
import type LDAPSyntaxDecoder from "@wildboar/ldap/src/lib/types/LDAPSyntaxDecoder";
import type LDAPSyntaxEncoder from "@wildboar/ldap/src/lib/types/LDAPSyntaxEncoder";
import type { PrismaClient, PrismaPromise, Prisma, Entry } from "@prisma/client";
import type { DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import type { SupplierInformation } from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/SupplierInformation.ta";
import type { ConsumerInformation } from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/ConsumerInformation.ta";
import type { SupplierAndConsumers } from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/SupplierAndConsumers.ta";
import type { MasterAndShadowAccessPoints } from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterAndShadowAccessPoints.ta";
import type { DitBridgeKnowledge } from "@wildboar/x500/src/lib/modules/DistributedOperations/DitBridgeKnowledge.ta";
import type { AuthenticationLevel } from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel.ta";
import {
    AuthenticationLevel_basicLevels,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels.ta";
import {
    AuthenticationLevel_basicLevels_level_none,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels-level.ta";
import type {
    NameAndOptionalUID,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/NameAndOptionalUID.ta";
import type { KeyObject } from "crypto";
import type { PkiPath } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/PkiPath.ta";
import type { Code } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import type { cpus, networkInterfaces } from "os";
import type { Socket } from "net";
import {
    OPTIONALLY_PROTECTED,
} from "@wildboar/x500/src/lib/modules/EnhancedSecurity/OPTIONALLY-PROTECTED.ta";
import {
    Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1 as ChainedResult,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ResultType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    DITStructureRuleDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITStructureRuleDescription.ta";
import {
    DITContentRuleDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITContentRuleDescription.ta";
import {
    MatchingRuleUseDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/MatchingRuleUseDescription.ta";
import {
    FriendsDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/FriendsDescription.ta";
import {
    DITContextUseDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITContextUseDescription.ta";
import { EventEmitter } from "events";
import type { i18n } from "i18next";
import {
    Context as X500Context,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Context.ta";
import type {
    Clearance,
} from "@wildboar/x500/src/lib/modules/EnhancedSecurity/Clearance.ta";
import type { TlsOptions } from "tls";

type EventReceiver<T> = (params: T) => void;

interface OperationalBindingControlEvents {
    on (eventName: string, fn: EventReceiver<boolean>): void;
    once (eventName: string, fn: EventReceiver<boolean>): void;
    emit (eventName: string, params: boolean): void;
}

export type OPCR = OPTIONALLY_PROTECTED<ChainedResult>;

export
type UUID = string;

export
type IndexableOID = string;

export
type LDAPName = string;

export
type ANY = ASN1Element;

export
type DateString = string;

/**
 * @summary The log levels used by Meerkat DSA logging
 * @description
 *
 * The log levels used by Meerkat DSA logging
 *
 */
export
enum LogLevel {
    debug = "debug",
    info = "info",
    warn = "warn",
    error = "error",
};

/**
 * @summary Something that has a uniquely-identifying object identifier
 * @description
 *
 * Something that has a uniquely-identifying object identifier
 *
 * @interface
 */
export
interface UniquelyIdentifiedByObjectIdentifier {

    /** The object identifier that uniquely identifies this thing */
    id: OBJECT_IDENTIFIER;

}

/**
 * @summary Something that has many names
 * @description
 *
 * Something that has many names
 *
 * @interface
 */
export
interface MultiNamed {

    /** The names of the thing */
    name: string[];

}

/**
 * @summary Something that is described with a textual description
 * @description
 *
 * Something that is described with a textual description
 *
 * @interface
 */
export
interface Described {

    /** The textual description of the thing */
    description: string;

}

/**
 * @summary Information about an LDAP syntax
 * @description
 *
 * Information about an LDAP syntax
 *
 * @interface
 */
export
interface LDAPSyntaxInfo
extends UniquelyIdentifiedByObjectIdentifier, Partial<Described> {

    /**
     * A function that converts the `LDAPString` value of this LDAP syntax into
     * a Basic Encoding Rules (BER) encoded value, as is used internally by
     * Meerkat DSA for representing attribute values.
     */
    decoder?: LDAPSyntaxDecoder;

    /**
     * A function that converts the `LDAPString` value of this LDAP syntax from
     * a Basic Encoding Rules (BER) encoded value, as is used internally by
     * Meerkat DSA for representing attribute values.
     */
    encoder?: LDAPSyntaxEncoder;

}

/**
 * @summary Information about an attribute type
 * @description
 *
 * Information about an attribute type
 *
 * @interface
 */
export
interface AttributeInfo
extends UniquelyIdentifiedByObjectIdentifier, Partial<MultiNamed>, Partial<Described> {

    /** `true` if this is obsolete. */
    obsolete?: boolean;

    /** The object identifier of the parent attribute type */
    parent?: OBJECT_IDENTIFIER;

    /**
     * The object identifier of the equality matching rule for this attribute
     *
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
    equalityMatchingRule?: OBJECT_IDENTIFIER;

    /** The object identifier of the ordering matching rule for this attribute */
    orderingMatchingRule?: OBJECT_IDENTIFIER;

    /** The object identifier of the substrings matching rule for this attribute */
    substringsMatchingRule?: OBJECT_IDENTIFIER;

    /** Whether this attribute type is single-valued */
    singleValued?: boolean;

    /** Whether this attribute type is collective */
    collective?: boolean;

    /** Whether this attribute type is a dummy attribute type */
    dummy?: boolean;

    /** Whether this attribute type is not user-modifiable */
    noUserModification?: boolean;

    /** The usage of this attribute type */
    usage: AttributeUsage;

    /** The object identifier of the LDAP syntax equivalent of this attribute type */
    ldapSyntax?: OBJECT_IDENTIFIER;

    /** The LDAP names of this attribute type */
    ldapNames?: LDAPName[];

    /** The LDAP description of this attribute type */
    ldapDescription?: string;

    /**
     * A set of dot-delimited string representations of object identifiers of
     * the matching rules that are compatible with this attribute type.
     */
    compatibleMatchingRules: Set<IndexableOID>;

    /**
     * The ASN.1 assertion syntax of this attribute type. This field has the
     * same semantics as the `information` field from the `matchingRules`
     * operational attribute type, which is documented in ITU Recommendation
     * X.501 (2016), Section 15.7.3:
     *
     * > The information component contains the ASN.1 definition of the
     * > assertion syntax of the rule. Such an ASN.1 definition shall be given
     * > as an optional ASN.1 Imports production, followed by optional ASN.1
     * > Assignment productions, followed by an ASN.1 Type production. All type
     * > names defined in Directory modules are implicitly imported and do not
     * > require explicit import. All type names, whether imported or defined
     * > via an Assignment, are local to the definition of this syntax. If the
     * > ASN.1 type includes a user-defined constraint and is not one of the
     * > ASN.1 types defined in the Directory modules, then the last
     * > UserDefinedConstraintParameter of the constraint shall be an actual
     * > parameter whose governing type is SyntaxConstraint and whose value is
     * > the object identifier assigned to the constraint.
     */
    syntax?: string;

    /**
     * If this attribute type is handled in some extraordinary way, rather than
     * by being stored in the `AttributeValue` table, this driver field contains
     * all of the functions necessary for reading and writing this attribute
     * type.
     */
    driver?: AttributeTypeDatabaseDriver;

    /** A function that will validate a single value of this attribute type */
    validator?: (value: ASN1Element) => unknown;

}

/**
 * @summary Information about an object class
 * @description
 *
 * Information about an object class
 *
 * @interface
 */
export
interface ObjectClassInfo
extends UniquelyIdentifiedByObjectIdentifier, Partial<MultiNamed>, Partial<Described> {

    /** `true` if this is obsolete. */
    obsolete?: boolean;

    /**
     * A set of dot-delimited string representations of object identifiers of
     * the object classes that are direct superclasses to this object class.
     */
    superclasses: Set<IndexableOID>;

    /** The kind of this object class */
    kind: ObjectClassKind;

    /**
     * A set of dot-delimited string representations of object identifiers of
     * the attribute types that are mandatory for entries of this object class.
     */
    mandatoryAttributes: Set<IndexableOID>;

    /**
     * A set of dot-delimited string representations of object identifiers of
     * the attribute types that are optional for entries of this object class.
     */
    optionalAttributes: Set<IndexableOID>;

    /** The LDAP names of this object class */
    ldapNames?: LDAPName[];

    /** The LDAP description of this object class */
    ldapDescription?: string;

}

/**
 * @summary A single attribute type and value, possibly with contexts
 * @description
 *
 * A single attribute type and value, possibly with contexts
 *
 * @interface
 */
export
interface Value {

    /** The ID of the value in the attributevalue table, if applicable */
    id?: number;

    /** The type of the attribute value */
    type: AttributeType;

    /** The attribute value itself */
    value: ANY;

    /**
     * The contexts of the attribute value. This field may be absent if there
     * are no contexts for this value.
     */
    contexts?: X500Context[];

}

/**
 * @summary Information about the hierarchical group of a DSE
 * @description
 *
 * Information about the hierarchical group of a DSE, as detailed in ITU
 * Recommendation X.501 (2016), Section 10.
 *
 * @interface
 */
export
interface HierarchyInfo {

    /**
     * The distinguished name of the top entry in the hierarchical group. This
     * should not be present in the hierarchical top.
     */
    top?: DistinguishedName;

    /**
     * The level of this entry within the hierarchical group. This starts off at
     * zero for the hierarchical top, and increments by one for each level of
     * immediate hierarchical subordinates, recursively.
     */
    level: number;

    /**
     * The distinguished name of the immediate hierarchical parent of this
     * entry.
     */
    parent?: DistinguishedName;

}

/**
 * @summary A DSA-specific entry (DSE) of type `cp`.
 * @description
 *
 * A DSA-specific entry (DSE) of type `cp`.
 *
 * @interface
 */
export
interface ContextPrefixDSE {

    /** Values of the `supplierKnowledge` operational attribute */
    supplierKnowledge?: SupplierInformation[];

    /** Values of the `consumerKnowledge` operational attribute */
    consumerKnowledge?: ConsumerInformation[];

    /** Values of the `secondaryShadows` operational attribute */
    secondaryShadows?: SupplierAndConsumers[];

}

/**
 * @summary A DSA-specific entry (DSE) of type `entry`.
 * @description
 *
 * A DSA-specific entry (DSE) of type `entry`.
 *
 * @interface
 */
export
interface EntryDSE {

    /**
     * A set of dot-delimited string representations of object identifiers of
     * the collective attribute exclusions for this entry.
     */
    collectiveExclusions: Set<IndexableOID>;

}

/**
 * @summary A DSA-specific entry (DSE) of type `alias`.
 * @description
 *
 * A DSA-specific entry (DSE) of type `alias`.
 *
 * @interface
 */
export
interface AliasDSE {

    /** The single value of the `aliasedEntryName` operational attribute */
    aliasedEntryName: DistinguishedName;
    // Implied to be of objectClass "alias"

}

/**
 * @summary A DSA-specific entry (DSE) of type `subr`.
 * @description
 *
 * A DSA-specific entry (DSE) of type `subr`.
 *
 * @interface
 */
export
interface SubordinateReferenceDSE {

    /** Values of the `specificKnowledge` attribute */
    specificKnowledge: MasterAndShadowAccessPoints;

}

/**
 * @summary A DSA-specific entry (DSE) of type `nssr`.
 * @description
 *
 * A DSA-specific entry (DSE) of type `nssr`.
 *
 * @interface
 */
export
interface NonSpecificSubordinateReferenceDSE {

    /** Values of the `nonSpecificKnowledge` attribute */
    nonSpecificKnowledge: MasterAndShadowAccessPoints[];

}

/**
 * @summary A DSA-specific entry (DSE) of type `supr`.
 * @description
 *
 * A DSA-specific entry (DSE) of type `supr`.
 *
 * @interface
 */
export
interface SuperiorReferenceDSE {

    /** Values of the `superiorKnowledge` attribute */
    superiorKnowledge: AccessPoint[];

}

/**
 * @summary A DSA-specific entry (DSE) of type `xr`.
 * @description
 *
 * A DSA-specific entry (DSE) of type `xr`.
 *
 * @interface
 */
export
interface CrossReferenceDSE {

    /** Values of the `specificKnowledge` attribute */
    specificKnowledge: MasterAndShadowAccessPoints;

}

/**
 * @summary A DSA-specific entry (DSE) of type `admPoint`.
 * @description
 *
 * A DSA-specific entry (DSE) of type `admPoint`.
 *
 * @interface
 */
export
interface AdministrativePointDSE {

    /**
     * A set of dot-delimited string representations of object identifiers of
     * the administrative roles this administrative point has. These can be used
     * directly as values of the `administrativeRole` operational attribute.
     */
    administrativeRole: Set<IndexableOID>;

    /** The object identifier of the access control scheme */
    accessControlScheme?: OBJECT_IDENTIFIER;

    /** Values of the `subentryACI` operational attribute */
    subentryACI?: ACIItem[];

}

/**
 * @summary A DSA-specific entry (DSE) of type `subentry`.
 * @description
 *
 * A DSA-specific entry (DSE) of type `subentry`.
 *
 * @interface
 */
export
interface SubentryDSE {

    /** Values of the `subtreeSpecification` operational attribute */
    subtreeSpecification: SubtreeSpecification[];

    /** Values of the `prescriptiveACI` operational attribute */
    prescriptiveACI?: ACIItem[];

    /** Values of the `collectiveAttributes` operational attribute */
    collectiveAttributes?: Attribute[];

    /** Values of the `contextAssertionDefaults` operational attribute */
    contextAssertionDefaults?: TypeAndContextAssertion[];

    /** Values of the `searchRules` operational attribute */
    searchRules?: SearchRuleDescription[];

    /** Values of the `ditStructureRules` operational attribute */
    ditStructureRules?: DITStructureRuleDescription[];

    /** Values of the `ditContentRules` operational attribute */
    ditContentRules?: DITContentRuleDescription[];

    /** Values of the `ditContextUse` operational attribute */
    ditContextUse?: DITContextUseDescription[];

    /** Values of the `matchingRuleUse` operational attribute */
    matchingRuleUse?: MatchingRuleUseDescription[];

    /** Values of the `friendships` operational attribute */
    friendships?: FriendsDescription[];

    // Password admin

    /** The single value of the `pwdAttribute` operational attribute */
    pwdAttribute?: OBJECT_IDENTIFIER;

    /** The single value of the `pwdModifyEntryAllowed` operational attribute */
    pwdModifyEntryAllowed?: BOOLEAN;

    /** The single value of the `pwdChangeAllowed` operational attribute */
    pwdChangeAllowed?: BOOLEAN;

    /** The single value of the `pwdMaxAge` operational attribute */
    pwdMaxAge?: INTEGER;

    /** The single value of the `pwdExpiryAge` operational attribute */
    pwdExpiryAge?: INTEGER;

    /** The single value of the `pwdMinLength` operational attribute */
    pwdMinLength?: INTEGER;

    /** The single value of the `pwdVocabulary` operational attribute */
    pwdVocabulary?: BIT_STRING;

    /** Values of the `pwdAlphabet` operational attribute */
    pwdAlphabet?: string[];

    /** Values of the `pwdDictionaries` operational attribute */
    pwdDictionaries?: string[];

    /** The single value of the `pwdExpiryWarning` operational attribute */
    pwdExpiryWarning?: INTEGER;

    /** The single value of the `pwdGraces` operational attribute */
    pwdGraces?: INTEGER;

    /** The single value of the `pwdFailureDuration` operational attribute */
    pwdFailureDuration?: INTEGER;

    /** The single value of the `pwdLockoutDuration` operational attribute */
    pwdLockoutDuration?: INTEGER;

    /** The single value of the `pwdMaxFailures` operational attribute */
    pwdMaxFailures?: INTEGER;

    /** The single value of the `pwdMaxTimeInHistory` operational attribute */
    pwdMaxTimeInHistory?: INTEGER;

    /** The single value of the `pwdMinTimeInHistory` operational attribute */
    pwdMinTimeInHistory?: INTEGER;

    /** The single value of the `pwdHistorySlots` operational attribute */
    pwdHistorySlots?: INTEGER;

    /** The single value of the `pwdRecentlyExpiredDuration` operational attribute */
    pwdRecentlyExpiredDuration?: INTEGER;

    /** The single value of the `pwdEncAlg` operational attribute */
    pwdEncAlg?: PwdEncAlg;

}

/**
 * @summary A DSA-specific entry (DSE) of type `shadow`.
 * @description
 *
 * A DSA-specific entry (DSE) of type `shadow`.
 *
 * @interface
 */
export
interface ShadowDSE {

    /**
     * Flag defined in ITU Recommendation X.525 (2016), Section 7.2.1.2, which
     * indicates whether all of the subordinates of this shadow DSE have been
     * replicated and are present within this DSA. This flag does not correspond
     * to any attribute. It is an internal flag.
     */
    subordinateCompleteness: boolean;

    /**
     * Flag defined in ITU Recommendation X.525 (2016), Section 7.2.1.3, which
     * indicates whether all user attributes of the entry, all relevant
     * collective attributes, all values of such user or collective attributes,
     * and all context information associated with those values, are present for
     * the SDSE. This flag does not correspond to any attribute. It is an
     * internal flag.
     */
    attributeCompleteness: boolean;

    /**
     * Flag defined in ITU Recommendation X.525 (2016), Section 7.2.1.4, which
     * indicates which attribute types have incomplete values.
     */
    attributeValuesIncomplete: Set<IndexableOID>;

}

/**
 * @summary A DSA-specific entry (DSE) of type `immSupr`.
 * @description
 *
 * A DSA-specific entry (DSE) of type `immSupr`.
 *
 * @interface
 */
export
interface ImmediateSuperiorReferenceDSE {

    /** Values of the `specificKnowledge` attribute */
    specificKnowledge: MasterAndShadowAccessPoints;

}

/**
 * @summary A DSA-specific entry (DSE) of type `rhob`.
 * @description
 *
 * A DSA-specific entry (DSE) of type `rhob`.
 *
 * @interface
 */
export
interface RelevantHierarchicalOperationalBindingDSE {
    // bindingID: number; // The specification says to store this with the DSE.
}

// sa is just a boolean
// dsSubentry is just a boolean

/**
 * @summary A DSA-specific entry (DSE) of type `ditBridge`.
 * @description
 *
 * A DSA-specific entry (DSE) of type `ditBridge`.
 *
 * @interface
 */
export
interface DITBridgeDSE {

    /** Values of the `ditBridgeKnowledge` attribute */
    ditBridgeKnowledge: DitBridgeKnowledge[];

}

/**
 * @summary A DSA-specific Entry (DSE)
 * @description
 *
 * An in-memory representation of DSA-specific Entry (DSE). This does not
 * include all attributes for the DSE--only those that are important for
 * directory, DSA, and distributed operations are kept in-memory. This is a
 * performance enhancement, because these important attributes may need to be
 * read from the database and potentially decoded thousands of times within a
 * single, simple operation if they were not kept in-memory.
 *
 * @interface
 */
export
interface DSE {

    /** The database primary key ID. */
    id: number;

    /**
     * The database IDs of all vertices starting from the root DSE, descending
     * downward toward this vertex, delimited by periods, and ending with a
     * period.
     *
     * Why do Materialized Paths end with a period? If they did not, searching
     * for `1.2.3` would also turn up results for `1.2.31`.
     *
     * Materialized Path is a common term, not something invented by the Meerkat
     * DSA authors:
     *
     * https://dzone.com/articles/materialized-paths-tree-structures-relational-database
     */
         materializedPath: string;

    /**
     * The internal UUID assigned to this DSE. This UUID is intentionally
     * different from the `entryUUID` so as to maintain a unique identifier for
     * the DSE that is independent both from the underlying database (by not
     * using the primary key ID) and directory operations. Keep in mind that,
     * in a shadowing environment, the `entryUUID` may exist in the shadow
     * supplier, but may not be replicated to a shadow consumer, in which case,
     * the shadow consumer would need a UUID to assign to the DSE.
     */
    uuid: UUID;

    /** The single value of the `entryUUID` operational attribute. */
    entryUUID?: UUID;

    /**
     * Values of the `uniqueIdentifier` attribute for this DSE. Even though
     * `uniqueIdentifier` is technically not an operational attribute, it is
     * used for some operational purposes, namely authentication.
     */
    uniqueIdentifier?: BIT_STRING[];

    /** The relative distinguished name (RDN) of the DSE. */
    rdn: RelativeDistinguishedName;

    /**
     * The set of object identifiers of the object classes this entry has, where
     * each object identifier is represented as strings in dot-delimited form.
     */
    objectClass: Set<IndexableOID>;

    /** The `ruleIdentifier` of the governing structure rule. */
    governingStructureRule?: number;

    /** The object identifier of the structural object class of the DSE. */
    structuralObjectClass?: OBJECT_IDENTIFIER;

    /**
     * Information about the hierarchical group of the DSE, as detailed in ITU
     * Recommendation X.501 (2016), Section 10.
     */
    hierarchy?: HierarchyInfo;

    /** The single value of the `creatorsName` operational attribute. */
    creatorsName?: Name;

    /** The single value of the `modifiersName` operational attribute. */
    modifiersName?: Name;

    /** The single value of the `createTimestamp` operational attribute. */
    createTimestamp?: Date;

    /** The single value of the `modifyTimestamp` operational attribute. */
    modifyTimestamp?: Date;

    /** Values of the `entryACI` operational attribute. */
    entryACI?: ACIItem[];

    /** Values of the `clearance` operational attribute. */
    clearances?: Clearance[];

    /**
     * Cached attributes, which are not limited to only operational attributes.
     * This is a performance enhancement, but it is not currently used.
     */
    cachedAttributes?: Attribute[];

    // DSE type-specific data

    /** Information about a Root DSE, specifically. */
    root?: boolean;

    /** Information about a Glue DSE, specifically. */
    glue?: boolean;

    /** Information about a Context Prefix DSE, specifically. */
    cp?: ContextPrefixDSE;

    /** Information about a Entry DSE, specifically. */
    entry?: EntryDSE;

    /** Information about an Alias DSE, specifically. */
    alias?: AliasDSE;

    /** Information about a Subordinate Reference DSE, specifically. */
    subr?: SubordinateReferenceDSE;

    /**
     * Information about a Non-Specific Subordinate Reference DSE, specifically.
     */
    nssr?: NonSpecificSubordinateReferenceDSE;

    /** Information about a Superior Reference DSE, specifically. */
    supr?: SuperiorReferenceDSE;

    /** Information about a Cross Reference DSE, specifically. */
    xr?: CrossReferenceDSE;

    /** Information about an Administrative Point DSE, specifically. */
    admPoint?: AdministrativePointDSE;

    /** Information about a Subentry DSE, specifically. */
    subentry?: SubentryDSE;

    /** Information about a Shadowed DSE, specifically. */
    shadow?: ShadowDSE;

    /** Information about an Immediate Superior DSE, specifically. */
    immSupr?: ImmediateSuperiorReferenceDSE;

    /**
     * Information about a DSE that is relevant to a hierarchical operational
     * binding, per the procedures defined in ITU Recommendation X.518 (2016),
     * Sections 24 and 25. (Whether a DSE is of type `rhob` is not well-defined
     * in the X.500 specifications, but the Annex P of ITU Recommendation X.501
     * (2016) helps clarify the intent.)
     */
    rhob?: RelevantHierarchicalOperationalBindingDSE;

    /** Whether this DSE is a subordinate reference that is also an alias. */
    sa?: boolean;

    /** Whether this DSE is a DSA-specific subentry. */
    dsSubentry?: boolean;

    /** Whether this DSE is a family member. */
    familyMember?: boolean;

    /** Information about an DIT Bridge DSE, specifically. */
    ditBridge?: DITBridgeDSE;

}

/**
 * @summary An in-memory representation of a vertex of the DIT.
 * @description
 *
 * An in-memory representation of a vertex of the Directory Information Tree
 * (DIT), which corresponds to a single DSE.
 *
 * This interface's job is primarily to group the properties that spatially
 * relate vertices to each other. Information about the DSE itself is stored
 * entirely in the `dse` field. This design is intentionally, so that the `dse`
 * object can be replaced while the vertex as a whole still persists as a
 * reference as the subordinate of it's superior and the superior of its
 * subordinates; in other words, the DSE can be entirely changed without
 * changing this DSE's position within the in-memory DIT.
 *
 * @interface
 */
export
interface Vertex {

    /** The immediately superior vertex in the DIT. */
    immediateSuperior?: Vertex;

    /**
     * The immediately subordinate vertices of this vertex in the DIT. If this
     * field is `null`, it means that the subordinates are stored in the
     * database, yet to be loaded into memory. (This is so we do not have to
     * load the entire DIT into memory just to represent a particular vertex.)
     * If there are no subordinates of this vertex, this should be represented
     * by an empty array rather than with `null`; `null` just means we haven't
     * read the subordinates from the database yet.
     */
    subordinates: Vertex[] | null;

    /**
     * The actual information on the DSA-specific Entry (DSE) itself.
     *
     * The actual contents of the DSE are very purposefully stored in a nested
     * object: it is so we can modify it by reference while still maintaining
     * the integrity of the DIT.
     */
    dse: DSE;

}

/**
 * A `DIT` is merely an alias for a Vertex, but the vertex used as a `DIT` shall
 * be the root vertex for that DIT.
 */
export
type DIT = Vertex;

/**
 * @summary Information on the Directory Information Tree (DIT).
 * @description
 *
 * Information on the Directory Information Tree (DIT).
 *
 * @interface
 */
export
interface DITInfo {

    /** The vertex of the Root DSE of the DIT. */
    root: DIT;

}

/**
 * @summary Properties of Meerkat DSA's digital signing of requests, responses, and errors.
 * @description
 *
 * Properties of Meerkat DSA's digital signing of requests, responses, and
 * errors.
 *
 * @interface
 */
export
interface SigningInfo {

    /**
     * The filepath to a private key to use for signing requests and responses
     * from the DSA. This does not affect TLS and may be a totally different key
     * than that used for TLS.
     */
    key: KeyObject;

    /**
     * The filepath to a certificate chain to use for signing requests and responses
     * from the DSA. This does not affect TLS and may be a totally different chain
     * than that used for TLS.
     */
    certPath: PkiPath;

}

/**
 * @summary Information on this Directory System Agent (DSA).
 * @description
 *
 * Information on this Directory System Agent (DSA), meaning this running
 * instance of Meerkat DSA.
 *
 * @interface
 */
export
interface DSAInfo {

    version?: string;

    /**
     * The access point of this DSA.
     *
     * NOTE: ae-title should be taken from the signing certificate. In X.518
     * (2016), section 10.8:
     *
     * > When referring to a DSA, the access point shall have a Name, that of
     * > the DSA concerned.
     */
    accessPoint: AccessPoint;

    /**
     * The time at which hibernation began. If this is `undefined`, this DSA is
     * not hibernating; if this is set, this DSA is hibernating.
     */
    hibernatingSince?: Date;

    /**
     * The time at which the sentinel-based killswitch initiated hibernation.
     * If this is `undefined`, this DSA is not hibernating; if this is set, this
     * DSA is hibernating.
     */
    sentinelTriggeredHibernation?: Date;

}

/**
 * A network service
 *
 * @interface
 */
export
interface NetworkService {

    /**
     * A network transport port on which the network service listens.
     */
    port?: number;

}

/**
 * @summary Meerkat DSA configuration
 * @description
 *
 * Meerkat DSA configuration
 *
 * @interface
 */
export
interface Configuration {

    log: {
        level: LogLevel;
        color: boolean;
        timestamp: boolean;
        json: boolean;
        console: boolean;
        http?: {
            url: string;
        };
        file?: {
            path: string;
            maxSize: number;
            maxFiles: number;
            zip: boolean;
            tailable: boolean;
        };
    };

    /**
     * The absolute maximum number of connections globally. Connections opened
     * after this maximum has been reached will be automatically closed.
     */
    maxConnections: number;

    /**
     * The absolute maximum number of connections permitted from a given
     * address. Connections by a given address opened after this maximum has
     * been reached will be automatically closed. This is important for the
     * prevention of
     * [Slow Loris attacks](https://en.wikipedia.org/wiki/Slowloris_(computer_security)).
     */
    maxConnectionsPerAddress: number;

    /**
     * The number of maximum concurrent operations per connection. If a
     * connection attempts more operations than this permits, they will be
     * automatically rejected.
     */
    maxConcurrentOperationsPerConnection: number;

    /**
     * DSA configuration pertaining to digital signing of requests, responses,
     * and errors.
     *
     * Meerkat DSA will take its AE-Title from the public key certificate.
     */
    signing?: SigningInfo;

    tcp: {

        /**
         * If true, Meerkat DSA will disable Nagle's algorithm for TCP
         * connections. This exists as a slight performance enhancement. There
         * is little reason to use this.
         */
        noDelay: boolean;

        /**
         * The amount of time (in seconds) after receiving no bytes from the TCP
         * socket after which the TCP connection will be reset.
         */
        timeoutInSeconds: number;

        /**
         * This specifies the minimum number of bytes a TCP connection is
         * expected to transfer within one minute. If the average number of
         * bytes per minute falls below this number, the TCP socket is closed.
         * This is important for the prevention of
         * [Slow Loris attacks](https://en.wikipedia.org/wiki/Slowloris_(computer_security)).
         */
        minimumTransferSpeedInBytesPerMinute: number;

    };

    /**
     * Options for the TLS socket, which is all of the options for the
     * `TLSSocket` constructor in the NodeJS standard library.
     */
    tls: TlsOptions;

    /**
     * Options for IDM transport.
     */
    idm: NetworkService & {

        /**
         * The number of bytes in size of the IDM buffer. This innately limits
         * the size of an IDM frame. This should be large enough to accomodate
         * all well-intentioned requests and responses, but small enough to
         * prohibit nefariously large requests that are intended to exhaust
         * Meerkat DSA's memory.
         */
        bufferSize: number;

        /**
         * The maximum size, in bytes, of an IDM PDU. IDM PDUs larger than this
         * will be rejected automatically, possibly before they are even fully
         * read.
         */
        maxPDUSize: number;

        /**
         * The maximum number of IDM segments into which an IDM client may split
         * an IDM PDU. This is important for preventing a denial of service.
         * Without this limit, nefarious IDM clients may submit an
         * infinitely-large number of IDM segments and exhaust memory.
         */
        maxSegments: number;

    };

    /**
     * Options for TLS-wrapped IDM.
     */
    idms: NetworkService;

    /**
     * LDAP options
     */
    ldap: NetworkService & {

        /**
         * The number of bytes in size of the LDAP buffer. This innately limits
         * the size of an LDAP message. This should be large enough to
         * accomodate all well-intentioned requests and responses, but small
         * enough to prohibit nefariously large requests that are intended to
         * exhaust Meerkat DSA's memory.
         */
        bufferSize: number;

    };

    /**
     * Options for TLS-wrapped LDAPS.
     */
    ldaps: NetworkService;

    /**
     * Options for the HTTPS-based web administration console.
     */
    webAdmin: NetworkService;

    /**
     * Options pertaining to the "points" added to a user's
     * `AuthenticationLevel.basicLevels.localQualifier`.
     */
    localQualifierPointsFor: {

        /**
         * The number of `localQualifier` "points" that Meerkat DSA grants to a
         * client for using StartTLS to secure their traffic.
         */
        usingStartTLS: number;

        /**
         * The number of `localQualifier` "points" that Meerkat DSA grants to a
         * client for using any version of Transport Layer Security (TLS) to
         * secure their traffic.
         */
        usingTLS: number;

        /**
         * The number of `localQualifier` "points" that Meerkat DSA grants to a
         * client for using SSLv3 to secure their traffic.
         */
        usingSSLv3: number;

        /**
         * The number of `localQualifier` "points" that Meerkat DSA grants to a
         * client for using TLS version 1.0 to secure their traffic. These
         * points are added on top of the points granted via the
         * `MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS` environment variable.
         */
        usingTLSv1_0: number;

        /**
         * The number of `localQualifier` "points" that Meerkat DSA grants to a
         * client for using TLS version 1.1 to secure their traffic. These
         * points are added on top of the points granted via the
         * `MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS` environment variable.
         */
        usingTLSv1_1: number;

        /**
         * The number of `localQualifier` "points" that Meerkat DSA grants to a
         * client for using TLS version 1.2 to secure their traffic. These
         * points are added on top of the points granted via the
         * `MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS` environment variable.
         */
        usingTLSv1_2: number;

        /**
         * The number of `localQualifier` "points" that Meerkat DSA grants to a
         * client for using TLS version 1.3 to secure their traffic. These
         * points are added on top of the points granted via the
         * `MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS` environment variable.
         */
        usingTLSv1_3: number;

    };
    chaining: {

        /**
         * The integer representation of the minimum authentication level required for
         * Meerkat DSA to chain requests to other DSAs. This is a security feature to
         * prevent unauthenticated (and therefore, unaccountable) users from spamming
         * the distributed directory with cumbersome (if not malicious) requests.
         *
         * This is important, because chaining can have the effect of making a request
         * "fan-out" to multiple DSAs. A nefarious request may multiply exponentially
         * without this check in place.
         *
         * This defaults to true, which corresponds to simple authentication, meaning that,
         * to utilize chaining, a user must have authenticated using simple authentication
         * or something stronger.
         */
        minAuthLevel: number;

        /**
         * The minimum `localQualifier` "points" required (on top of the minimum
         * authentication level) for Meerkat DSA to chain requests to other DSAs.
         * If the minimum authentication level--as configured by the
         * `MEERKAT_MIN_AUTH_LEVEL_FOR_CHAINING` environment variable--is exceeded, this
         * does not matter.
         *
         * This is important, because chaining can have the effect of making a request
         * "fan-out" to multiple DSAs. A nefarious request may multiply exponentially
         * without this check in place.
         */
        minAuthLocalQualifier: number;

        /**
         * Whether non-usage of TLS in chaining to other DSAs is permissible. In
         * other words, if this is set to `true`, this DSA will still chain operations to
         * other DSAs after attempting to use StartTLS, regardless of whether StartTLS
         * succeeds.
         *
         * If this is enabled, transported operations, data, errors, responses,
         * credentials, etc. are susceptible to inspection by intermediaries, which is a
         * security problem. These operations may not be susceptible to tampering (other
         * than by omission) if cryptographic signing is used.
         */
        tlsOptional: boolean;

    };

    /**
     * This is a fully-qualified DNS name. If it contains a TXT record whose text is
     * `meerkat:kill`, Meerkat DSA will exit as soon as it detects this. If this
     * record's text is `meerkat:hibernate`, Meerkat DSA will enter hibernation as
     * soon as it detects this.
     *
     * This exists so that Meerkat DSA may be remotely shut down in the event that
     * a severe security vulnerability is discovered. It is a "remote killswitch."
     */
    sentinelDomain?: string;

    /**
     * Currently unused.
     */
    administratorEmail?: string;

    /**
     * If true, this enables bulk-insert mode, where all access control checks
     * are disabled, some schema checks are disabled, and other validation is
     * disabled. This exists to speed up a bulk insertion of data when a directory is
     * still being set up.
     */
    bulkInsertMode: boolean;

    /**
     * This is the amount of time in milliseconds (at minimum) that Meerkat DSA will
     * take to respond to a failed authentication attempt. This exists to stifle
     * [timing attacks](https://en.wikipedia.org/wiki/Timing_attack).
     */
    bindMinSleepInMilliseconds: number;

    /**
     * This is the maximum amount of time in milliseconds that Meerkat DSA will
     * add to the time taken to respond to a failed authentication attempt on top of
     * the minimum as configured by the `MEERKAT_BIND_MIN_SLEEP_MS` environment
     * variable. The additional time taken in milliseconds is selected uniformly and
     * at random from 0 to this number.
     */
    bindSleepRangeInMilliseconds: number;

    /**
     * The integer representation of the minimum authentication level required for
     * Meerkat DSA to accept DOP requests.
     *
     * This defaults to true, which corresponds to simple authentication, meaning that,
     * to use DOP, a DSA must have authenticated using simple authentication
     * or something stronger.
     */
    minAuthLevelForOperationalBinding: number;

    /**
     * The minimum `localQualifier` "points" required (on top of the minimum
     * authentication level) for Meerkat DSA to accept DOP requests.
     * If the minimum authentication level--as configured by the
     * `MEERKAT_MIN_AUTH_LEVEL_FOR_OB` environment variable--is exceeded, this
     * does not matter.
     */
    minAuthLocalQualifierForOperationalBinding: number;

    /**
     * Whitespace-separated NSAP URLs that locate this DSA. This is important for
     * enabling other DSAs to chain requests to this DSA. These NSAP URLs are used to
     * populate the `myAccessPoint` attribute in the Root DSE.
     */
    myAccessPointNSAPs: Uint8Array[];

    /**
     * Even if subordinates are cached in memory, Meerkat DSA will directly query the
     * database to find a specific subordinate instead of iterating through the
     * in-memory entries when there are more than this many subordinates in memory.
     */
    useDatabaseWhenThereAreXSubordinates: number;

    /** If true, Meerkat DSA will not chain any requests. */
    prohibitChaining: boolean;

    /**
     * The number of entries that Meerkat DSA will load into memory at a time when
     * searching for a subordinate.
     *
     * Meerkat DSA searches in order of _descending_ IDs of entries, with the theory
     * being that larger IDs are entries that have been recently added, and recently
     * added entries are more likely to be requested than older entries. That said,
     * this can generally be set to a fairly low number for optimal results.
     */
    entriesPerSubordinatesPage: number;

    /** Currently unused. */
    transcodeValuesToDER: boolean;

    /** Currently unused. */
    transcodeDistinguishedValuesToDER: boolean;

    /**
     * If true, Meerkat DSA will not apply any access controls to adding new
     * entries to the top level. Note that this does not negate access controls for
     * already-existing first-level DSEs.
     */
    openTopLevel: boolean;

    /** If true, anonymous binds are declined entirely. */
    forbidAnonymousBind: boolean;

    /**
     * ITU Recommendation X.519 permits clients to submit requests after the bind
     * request has been submitted, but before the bind response or error has been
     * received. Meerkat DSA can handle this, but it is important to limit the
     * number of pre-bind requests so that unauthenticated users cannot flood the
     * queue with an unlimited number of pending requests and exhaust memory.
     *
     * It is not a security vulnerability for this to be a number greater than zero,
     * but it should be a low number. It should probably not be higher than 10.
     */
    maxPreBindRequests: number;

    /** Directory Access Protocol (DAP) options. */
    dap: {

        /** Whether DAP is enabled. */
        enabled: boolean;

    };

    /** Directory System Protocol (DSP) options. */
    dsp: {

        /** Whether DSP is enabled. */
        enabled: boolean;

    };

    /** Directory Operational Binding Management Protocol (DOP) options. */
    dop: {

        /** Whether DOP is enabled. */
        enabled: boolean;

    };

}

/**
 * @summary Information about a name form
 * @description
 *
 * Information about a name form
 *
 * @interface
 */
export
interface NameFormInfo
extends UniquelyIdentifiedByObjectIdentifier, Partial<MultiNamed>, Partial<Described> {

    /** `true` if this is obsolete. */
    obsolete?: boolean;

    /**
     * The object identifier of the structural object class to which this name
     * form applies.
     */
    namedObjectClass: OBJECT_IDENTIFIER;

    /**
     * The object identifier of the attribute types that are required to appear
     * in the relative distinguished name of the object by this name form.
     */
    mandatoryAttributes: OBJECT_IDENTIFIER[];

    /**
     * The object identifier of the attribute types that may appear
     * in the relative distinguished name of the object by this name form.
     */
    optionalAttributes: OBJECT_IDENTIFIER[];

}

/**
 * @summary Information about an attribute friendship
 * @description
 *
 * Information about an attribute friendship
 *
 * @interface
 */
export
interface FriendshipInfo {
    anchor: OBJECT_IDENTIFIER;
    friends: Set<IndexableOID>;
}

export
interface ServerStatistics {
    version?: string;
    hash?: string;
    license?: string;
    os_cpu_cores?: ReturnType<typeof cpus>;
    os_networkInterfaces?: ReturnType<typeof networkInterfaces>;
    os_arch?: string;
    os_endianness?: string;
    os_freemem?: number;
    os_homedir?: string;
    os_hostname?: string;
    os_platform?: string;
    os_release?: string;
    os_totalmem?: number;
    os_type?: string;
    os_uptime?: number;
    os_version?: string;
}

export
interface ConnectionStatistics {
    remoteFamily?: string;
    remoteAddress?: string;
    remotePort?: number;
    transport?: string; // IDMv1, IDMv2
    presentation?: string;
}

export
interface IDMTransportStatistics {
    version: number;
    presentation: number;
}

export
interface SimpleCredentialStatistics {
    nameLength: number;
    validity: {
        time1?: boolean;
        time2?: boolean;
        random1?: boolean;
        random2?: boolean;
    };
    passwordChoice?: string; // unprotected, protected, userPwd.
}

export
interface StrongCredentialStatistics {
    certPathLength?: number;
    tokenSigningAlgorithm: string;
    attributeCertPathLength?: number;
}

export
interface SaslCredentialStatus {
    mechanism?: string;
}

export
interface CredentialStatistics {
    simple?: SimpleCredentialStatistics;
    strong?: StrongCredentialStatistics;
    externalProcedure?: boolean;
    spkm?: true;
    sasl?: SaslCredentialStatus;
}

export
interface ServiceControlStatistics {
    priority?: number;
    timeLimit?: number;
    sizeLimit?: number;
    scopeOfReferral?: number;
    attributeSizeLimit?: number;
    manageDSAITPlaneRef?: boolean;
    serviceType?: IndexableOID;
    userClass?: number;
    options?: {
        preferChaining?: boolean;
        chainingProhibited?: boolean;
        localScope?: boolean;
        dontUseCopy?: boolean;
        dontDereferenceAliases?: boolean;
        subentries?: boolean;
        copyShallDo?: boolean;
        partialNameResolution?: boolean;
        manageDSAIT?: boolean;
        noSubtypeMatch?: boolean;
        noSubtypeSelection?: boolean;
        countFamily?: boolean;
        dontSelectFriends?: boolean;
        dontMatchFriends?: boolean;
        allowWriteableCopy?: boolean;
    };
}

export
interface SecurityParametersStatistics {
    certificationPathLength?: number;
    nameLength?: number;
    time?: string;
    random?: boolean;
    target?: number;
    operationCode?: boolean;
    errorProtection?: number;
    errorCode?: boolean;
}

export
interface EntryInformationStatistics {
    nameLength?: number;
    fromEntry?: boolean;
    informationLength?: number;
    incompleteEntry?: boolean;
    partialName?: boolean;
    derivedEntry?: boolean;
}

export
interface ProtocolInformationStatistics {
    nsap: string;
    profiles: IndexableOID[];
}

export
interface AccessPointStatistics {
    aeTitleLength?: number;
    nsaps?: string[];
    protocolInformation?: ProtocolInformationStatistics[];
}

export
interface MasterOrShadowAccessPointStatistics extends AccessPointStatistics {
    category?: number;
    chainingRequired?: boolean;
}

export
interface AccessPointInformationStatistics extends MasterOrShadowAccessPointStatistics {
    additionalPoints?: MasterOrShadowAccessPointStatistics[];
}

export
interface ContinuationReferenceStatistics {
    targetObjectNameLength?: number;
    aliasedRDNs?: number;
    operationProgress?: OperationProgressStatistics;
    rdnsResolved?: number;
    referenceType?: number;
    accessPoints?: AccessPointInformationStatistics[];
    entryOnly?: boolean;
    numberOfExclusions?: number;
    returnToDUA?: boolean;
    nameResolveOnMaster?: boolean;
}

export
interface PartialOutcomeQualifierStatistics {
    limitProblem?: number;
    unexplored?: ContinuationReferenceStatistics[];
    unavailableCriticalExtensions?: boolean;
    numberOfUnknownErrors?: number;
    queryReferencePresent?: boolean;
    overspecFilter?: FilterStatistics;
    notification?: IndexableOID[];
    bestEstimate?: number;
    lowEstimate?: number;
    exact?: number;
}

export
interface ListResultStatistics {
    numberOfSubordinates?: number;
    uncorrelatedListInfo?: ListResultStatistics[];
}

export
interface SearchResultStatistics {
    numberOfResults?: number;
    altMatching?: boolean;
    uncorrelatedSearchInfo?: SearchResultStatistics[];
}

export
interface ResultStatistics {
    sizeInBytes?: number;
    entry?: EntryInformationStatistics;
    numberOfModifyRights?: number;
    fromEntry?: boolean;
    numberOfUncorrelatedResults?: number;
    poq?: PartialOutcomeQualifierStatistics;
    list?: ListResultStatistics;
    search?: SearchResultStatistics;
}

export
interface AttributeErrorProblemStatistics {
    problem: number;
    type: IndexableOID;
}

export
interface ErrorStatistics {
    code?: string;
    stack?: string;
    pagingAbandoned?: boolean;
    problem?: number;
    attributeProblems?: AttributeErrorProblemStatistics[];
    matchedNameLength?: number;
    candidate?: ContinuationReferenceStatistics;
    attributeInfo?: IndexableOID[];
}

export
interface ContextAssertionStatistics {
    contextType: IndexableOID;
    contextValuesLength: number;
}

export
interface TypeAndContextAssertionStatistics {
    type: IndexableOID;
    preference?: ContextAssertionStatistics[];
    all?: ContextAssertionStatistics[];
}

export
interface OperationProgressStatistics {
    phase: number;
    next?: number;
}

export
interface CommonArgumentsStatistics {
    serviceControls?: ServiceControlStatistics;
    securityParameters?: SecurityParametersStatistics;
    requestorLength?: number;
    operationProgress?: OperationProgressStatistics;
    aliasedRDNs?: number;
    criticalExtensions?: number[];
    referenceType?: number;
    entryOnly?: boolean;
    exclusionsLength?: number;
    nameResolveOnMaster?: boolean;
    operationContextsAllContexts?: boolean;
    operationContextsSelectedContexts?: TypeAndContextAssertionStatistics[];
    familyGrouping?: number;
}

export
interface ASN1ElementStatistics {
    tagClass?: number;
    tagNumber?: number;
    valueLength?: number;
}

export
interface ContextStatistics {
    type: IndexableOID;
    values?: ASN1ElementStatistics[];
    fallback?: boolean;
}

export
interface AttributeStatistics {
    type: IndexableOID;
    values?: ASN1ElementStatistics[];
    valuesWithContext?: {
        value?: ASN1ElementStatistics;
        contextList?: ContextStatistics[];
    }[];
}

export
interface AttributeValueAssertionStatistics {
    type: IndexableOID;
    assertion?: ASN1ElementStatistics;
    allContexts?: boolean;
    selectedContexts?: ContextStatistics[];
}

export
interface SortKeyStatistics {
    type: IndexableOID;
    orderingRule?: IndexableOID;
}

export
interface PagedResultsRequestStatistics {
    newRequest?: boolean;
    queryReference?: boolean;
    abandonQuery?: boolean;
    pageSize?: number;
    sortKeysLength?: number;
    sortKeys?: SortKeyStatistics[];
    reverse?: boolean;
    unmerged?: boolean;
    pageNumber?: number;
}

export
interface EntryModificationStatistics {
    type?: string;
    attributeType?: IndexableOID;
    numberOfValues?: number;
    contextsUsed?: ContextStatistics[];
}

export
interface EntryInformationSelectionStatistics {
    allUserAttributes?: boolean;
    selectUserAttributes?: IndexableOID[];
    infoTypes?: number;
    allExtraAttributes?: boolean;
    selectExtraAttributes?: IndexableOID[];
    allContexts?: boolean;
    selectedContexts?: TypeAndContextAssertionStatistics[];
    returnContexts?: boolean;
    familyReturn?: {
        memberSelect?: number;
        familySelect?: IndexableOID[];
    };
}

export
interface FilterItemSubstringsStatistics {
    type: IndexableOID;
    strings: {
        type?: "initial" | "any" | "final" | "control" | "other";
        controlType?: IndexableOID;
    }[];
}

export
interface MatchingRuleAssertionStatistics {
    matchingRule?: IndexableOID[];
    type?: IndexableOID;
    dnAttributes?: boolean;
}

export
interface AttributeTypeAssertionStatistics {
    type: IndexableOID;
    assertionContexts?: ContextAssertionStatistics[];
}

export
type FilterItemStatistics = {
    equality: AttributeValueAssertionStatistics;
} | {
    substrings: FilterItemSubstringsStatistics;
} | {
    greaterOrEqual: AttributeValueAssertionStatistics;
} | {
    lessOrEqual: AttributeValueAssertionStatistics;
} | {
    present: IndexableOID;
} | {
    approximateMatch: AttributeValueAssertionStatistics;
} | {
    extensibleMatch: MatchingRuleAssertionStatistics;
} | {
    contextPresent: AttributeTypeAssertionStatistics;
} | {
    other: null;
}

export
type FilterStatistics = {
    item: FilterItemStatistics;
} | {
    and: FilterStatistics[];
} | {
    or: FilterStatistics[];
} | {
    not: FilterStatistics;
} | {
    other: null;
}

export
interface MappingStatistics {
    mappingFunction?: IndexableOID;
    level?: number;
}

export
interface MRSubstitution {
    attribute: IndexableOID;
    oldMatchingRule?: IndexableOID;
    newMatchingRule?: IndexableOID;
}

export
interface MRMappingStatistics {
    mapping?: MappingStatistics[];
    substitution?: MRSubstitution[];
}

export
interface RelaxationPolicy {
    basic?: MRMappingStatistics;
    tightenings?: MRMappingStatistics[];
    relaxations?: MRMappingStatistics[];
    maximum?: number;
    minimum?: number;
}

export
interface JoinAttPairStatistics {
    baseAtt: IndexableOID;
    joinAtt: IndexableOID;
    joinContext?: IndexableOID[];
}

export
interface JoinArgumentStatistics {
    joinBaseObjectNameLength?: number;
    domainLocalID?: string;
    joinSubset?: number;
    joinFilter?: FilterStatistics;
    joinAttributes?: JoinAttPairStatistics[];
    joinSelection?: EntryInformationSelectionStatistics;
}

export
interface RequestStatistics extends CommonArgumentsStatistics {
    operationCode: string;
    targetNameLength?: number;
    targetSystemNSAPs?: string[];
    attributes?: AttributeStatistics[];
    ava?: AttributeValueAssertionStatistics;
    listFamily?: boolean;
    prr?: PagedResultsRequestStatistics;
    newSuperiorNameLength?: number;
    newRDNLength?: number;
    deleteOldRDN?: boolean;
    modifications?: EntryModificationStatistics[];
    modifyRightsRequest?: boolean;
    eis?: EntryInformationSelectionStatistics;
    subset?: number;
    filter?: FilterStatistics;
    searchAliases?: boolean;
    matchedValuesOnly?: boolean;
    extendedFilter?: FilterStatistics;
    checkOverspecified?: boolean;
    relaxation?: RelaxationPolicy;
    extendedArea?: number;
    hierarchySelections?: number[];
    searchControlOptions?: number[];
    joinArguments?: JoinArgumentStatistics[];
    joinType?: number;
}

export
interface OutcomeStatistics {
    result?: ResultStatistics;
    error?: ErrorStatistics;
}

export
interface WithRequestStatistics {
    request: RequestStatistics;
}

export
interface WithOutcomeStatistics {
    outcome: OutcomeStatistics;
}

export
interface OperationStatistics extends Partial<WithRequestStatistics>, Partial<WithOutcomeStatistics> {
    type: "op";
    inbound: boolean;
    server?: ServerStatistics;
    connection?: ConnectionStatistics;
    idm?: IDMTransportStatistics;
    bind?: {
        protocol: IndexableOID | "ldap";
        callingAETitleLength?: number;
        calledAETitleLength?: number;
        credentials?: CredentialStatistics;
        versions?: number[];
    };
}

export
interface OperationReturn {
    result: OPTIONALLY_PROTECTED<ChainedResult>;
    stats: Partial<WithRequestStatistics> & Partial<WithOutcomeStatistics>;
}

/**
 * @summary An integer that may be sorted as a proxy to sorting the value from whence it was calculated.
 * @description
 *
 * An integer that may be sorted as a proxy to sorting the value from whence it
 * was calculated.
 *
 * @deprecated
 */
export
type SortKey = bigint | null;

/**
 * @summary A function that calculates a sort key from a value
 * @description
 *
 * A function that calculates a sort key from a value
 *
 * @deprecated
 */
export
type SortKeyGetter = (value: ASN1Element) => SortKey;

/**
 * @summary Information about a matching rule
 * @description
 *
 * Information about a matching rule
 *
 * @interface
 */
export
interface MatchingRuleInfo <Matcher>
extends UniquelyIdentifiedByObjectIdentifier, Partial<MultiNamed>, Partial<Described> {

    /** `true` if this is obsolete. */
    obsolete?: boolean;

    /**
     * The ASN.1 assertion syntax of this matching rule.
     *
     * From ITU Recommendation X.501 (2016), Section 15.7.3:
     *
     * > The information component contains the ASN.1 definition of the
     * > assertion syntax of the rule. Such an ASN.1 definition shall be given
     * > as an optional ASN.1 Imports production, followed by optional ASN.1
     * > Assignment productions, followed by an ASN.1 Type production. All type
     * > names defined in Directory modules are implicitly imported and do not
     * > require explicit import. All type names, whether imported or defined
     * > via an Assignment, are local to the definition of this syntax. If the
     * > ASN.1 type includes a user-defined constraint and is not one of the
     * > ASN.1 types defined in the Directory modules, then the last
     * > UserDefinedConstraintParameter of the constraint shall be an actual
     * > parameter whose governing type is SyntaxConstraint and whose value is
     * > the object identifier assigned to the constraint.
     */
    syntax?: string;

    /** An object identifier of the LDAP assertion syntax */
    ldapAssertionSyntax?: OBJECT_IDENTIFIER;

    /**
     * A function that evaluates an attribute value against an assertion with
     * this matching rule's semantics
     */
    matcher: Matcher;

    /**
     * A function that will "reduce" a value down to an integer that can be
     * sorted as a proxy for the value itself.
     *
     * @deprecated
     */
    sortKeyGetter?: SortKeyGetter;
}

/**
 * @summary Information about a context type
 * @description
 *
 * Information about a context type
 *
 * @interface
 */
export
interface ContextTypeInfo
extends UniquelyIdentifiedByObjectIdentifier, Partial<MultiNamed>, Partial<Described> {

    /** `true` if this is obsolete. */
    obsolete?: boolean;

    /**
     * The syntax for values of this context type.
     *
     * From ITU Recommendation X.501 (2016), Section 15.7.10:
     *
     * > The syntax component and the assertionSyntax component each contain a
     * > text string giving the ASN.1 definition of the context syntax and
     * > context assertion syntax respectively. Such an ASN.1 definition shall
     * > be given as an optional ASN.1 Imports production, followed by optional
     * > ASN.1 Assignment productions, followed by an ASN.1 Type production. All
     * > type names defined in Directory modules are implicitly imported and do
     * > not require explicit import. All type names, whether imported or
     * > defined via an Assignment, are local to the definition of this syntax.
     * > If the ASN.1 type includes a user-defined constraint and is not one of
     * > the ASN.1 types defined in the Directory modules, then the last
     * > UserDefinedConstraintParameter of the constraint shall be an actual
     * > parameter whose governing type is SyntaxConstraint and whose value is
     * > the object identifier assigned to the constraint.
     *
     */
    syntax: string;

    /**
     * The syntax for assertions of this context type.
     *
     * From ITU Recommendation X.501 (2016), Section 15.7.10:
     *
     * > The syntax component and the assertionSyntax component each contain a
     * > text string giving the ASN.1 definition of the context syntax and
     * > context assertion syntax respectively. Such an ASN.1 definition shall
     * > be given as an optional ASN.1 Imports production, followed by optional
     * > ASN.1 Assignment productions, followed by an ASN.1 Type production. All
     * > type names defined in Directory modules are implicitly imported and do
     * > not require explicit import. All type names, whether imported or
     * > defined via an Assignment, are local to the definition of this syntax.
     * > If the ASN.1 type includes a user-defined constraint and is not one of
     * > the ASN.1 types defined in the Directory modules, then the last
     * > UserDefinedConstraintParameter of the constraint shall be an actual
     * > parameter whose governing type is SyntaxConstraint and whose value is
     * > the object identifier assigned to the constraint.
     *
     */
    assertionSyntax?: string;

    /** A function that returns the default value of this context type */
    defaultValue?: () => ASN1Element;

    /**
     * Whether an absent context of this type should still be considered a
     * match. Note that this defaults to `TRUE`.
     */
    absentMatch: boolean;

    /** A function that evaluates values of this context type against an assertion */
    matcher: ContextMatcher;

    /**
     * A function that validates values of this context type for correct syntax.
     */
    validator?: (value: ASN1Element) => unknown;

}

/**
 * @summary Type definition for the context object
 * @description
 *
 * Meerkat DSA has an architectural pattern whereby we pass in a context object
 * into almost every function, which contains everything that would otherwise
 * be needed as imports, such as the database client, logging,
 * internationalization, and knowledge of schema.
 *
 * @interface
 */
export
interface Context {

    /** The Internationalization object from i18next */
    i18n: i18n,

    /** Information on the DIT from the perspective of this DSA */
    dit: DITInfo;

    /** Information on this DSA */
    dsa: DSAInfo;

    /** A map of TLS sockets by reference to application associations, or `null` if no association exists yet */
    associations: Map<Socket, ClientAssociation | null>, // null = the socket exists, but has not bound yet.

    /** The current configuration of the DSA */
    config: Configuration;

    /** The `winston` logger */
    log: Logger;

    /** The Prisma client (for interacting with the database) */
    db: PrismaClient;

    /**
     * LDAP often uses human-friendly names object descriptors instead of object
     * identifiers.
     *
     * This might be somewhat duplicated, since you could find the name of all
     * attributes, object classes, name forms, etc. using other fields of
     * `Context`, but it speeds up lookups, and it could contain object
     * identifiers that do not correspond to X.500-related objects.
     *
     * @example
     * ctx.objectIdentifierToName.get("2.5.4.3"); // returns "commonName"
     */
    objectIdentifierToName: Map<IndexableOID, string>;

    /**
     * A mapping of object names to object identifiers
     * @example
     * ctx.nameToObjectIdentifier.get("organization");
     */
    nameToObjectIdentifier: Map<string, OBJECT_IDENTIFIER>;

    /**
     * An index of object class information by object identifier strings and names
     * @example
     * ctx.objectClasses.get("1.2.3.4");
     */
    objectClasses: Map<IndexableOID, ObjectClassInfo>;

    /**
     * An index of attribute type information by object identifier strings and names
     * @example
     * ctx.attributeTypes.get("2.5.4.3"); // Returns information on `commonName`
     */
    attributeTypes: Map<IndexableOID, AttributeInfo>;

    /**
     * An index of LDAP syntaxes by object identifier strings and names
     * @example
     * ctx.ldapSyntaxes.get("1.2.3.4");
     * */
    ldapSyntaxes: Map<IndexableOID, LDAPSyntaxInfo>;

    /**
     * A mapping of LDAP syntaxes of ASN.1 syntaxes by object identifier string
     * @example
     * ctx.ldapSyntaxToASN1Syntax.get("1.3.6.1.4.1.1466.115.121.1.50"); // Returns "TelephoneNumber"
     */
    ldapSyntaxToASN1Syntax: Map<IndexableOID, string>;

    /** An index of equality matching rules by object identifier strings and names */
    equalityMatchingRules: Map<IndexableOID, MatchingRuleInfo<EqualityMatcher>>;

    /** An index of ordering matching rules by object identifier strings and names */
    orderingMatchingRules: Map<IndexableOID, MatchingRuleInfo<OrderingMatcher>>;

    /** An index of substrings matching rules by object identifier strings and names */
    substringsMatchingRules: Map<IndexableOID, MatchingRuleInfo<SubstringsMatcher>>;
    /**
     * An index of substrings matching rules by object identifier strings and
     * names.
     *
     * This maps the object identifiers of equality matching rules to
     * approximate matching rule, if there is one available.
     */
    approxMatchingRules: Map<IndexableOID, EqualityMatcher>;

    /**
     * An index of context type information by object identifier strings and names
     * @example
     * ctx.contextTypes.get("1.2.3.4");
     */
    contextTypes: Map<IndexableOID, ContextTypeInfo>;

    /**
     * The set of object identifier strings of matching rules that may be used
     * for equality matching in object names
     */
    matchingRulesSuitableForNaming: Set<IndexableOID>;

    /**
     * An event emitter for operational binding events.
     */
    operationalBindingControlEvents: OperationalBindingControlEvents;

    /**
     * The set of object identifier strings of attribute types that are
     * collective
     */
    collectiveAttributes: Set<IndexableOID>;

    /**
     * An index of name form information by object identifier strings and names
     * @example
     * ctx.nameForms.get("1.2.3.4");
     */
    nameForms: Map<IndexableOID, NameFormInfo>;

    /**
     * The set of all recently used invokeIDs used by this DSA for outbound
     * requests. This shall be cleared every so often so that invoke IDs are
     * not exhausted (though that would be difficult!).
     */
    usedInvokeIDs: Set<number>;

    /**
     * An index of LDAP names that are used to identify two different things.
     * If an LDAP name is used twice between two different things, its numeric
     * object identifier shall be used exclusively to identify it.
     */
    duplicatedLDAPNames: Set<IndexableOID>;
}

/**
 * @summary Accumulator for changes to be done as part of an entry modification
 * @description
 *
 * This object is mutated by reference by attribute drivers, adding changes to
 * the modified entry itself to `entryUpdate` and changes elsewhere to
 * `otherWrites`. These can then be executed elsewhere as a part of a
 * transaction.
 *
 * @interface
 */
export
interface PendingUpdates {

    /** Database updates to the entry model itself */
    readonly entryUpdate: Prisma.EntryUpdateInput,

    /** Database updates to anything else */
    readonly otherWrites: PrismaPromise<any>[],

}

/**
 * @summary The state of a paged results request
 * @description
 *
 * The state of a paged results request
 *
 * @interface
 */
export
interface PagedResultsRequestState {
    /** The original paged results request */
    request: PagedResultsRequest_newRequest;

    /**
     * This is for implementing cursor-based pagination in Prisma.
     * See this: https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination
     *
     * "Why is this an array?"
     *
     * Because, when you are doing a subtree search, each recursion of the
     * search does pagination against the database. We need an array to track
     * the cursor ID at _each level_ of the subtree.
     */
    cursorIds: number[];

    /** The entries already returned by the search or list operation. */
    alreadyReturnedById: Set<Entry["id"]>;

    /**
     * The page index of the enqueued results. `cursorIds` is used when
     * traversing the DIT to enqueue results to be returned, but `cursorId` is
     * used when paginating over those enqueued results.
     *
     * Basically, this cursor is only for the `EnqueuedSearchResult` and
     * `EnqueuedListResult` tables.
     */
    cursorId?: number;

    /** The count of all results in the entire result set, ignoring pagination. */
    totalResults?: number;
}

/**
 * @summary The status of an operation
 * @description
 *
 * The status of an operation.
 *
 * @interface
 */
export
interface OperationInvocationInfo {
    /**
     * From `InvokeId.present`.
     */
    invokeId: number;
    operationCode?: Code;
    startTime: Date;

    /**
     * Theoretically, this could be used for reporting progress, returning LDAP
     * search results, or something else, but for now, it is just used by an
     * operation to acknowledge abandonment.
     */
    events: EventEmitter;

    /**
     * This field exists to indicate the abandonment of an operation.
     */
    abandonTime?: Date;

    /**
     * Point of no return.
     */
    pointOfNoReturnTime?: Date;
}

/**
 * @summary An application association with this DSA.
 * @description
 *
 * An application association of any protocol to this DSA.
 *
 * @abstract
 * @class
 */
export
abstract class ClientAssociation {

    /** The underlying TCP socket */
    public socket!: Socket;

    /** A UUID that uniquely identifies this association */
    public readonly id = randomUUID();

    /**
     * The vertex of the DIT to which the remote host bound.
     *
     * Note that this field being set does NOT mean that the user proved with
     * any credibility that they _are_ the bound vertex. This field MUST be used
     * only in conjunction with the `authLevel` field to determine how credible
     * the remote host's claim to being this vertex is. It is entirely possible
     * that the remote host anonymously bound as this vertex.
     */
    public boundEntry: Vertex | undefined;

    /**
     * Even though this can be calculated from the `boundEntry` field, this
     * field exists so that the bound entry's DN does not have to be
     * repeatedly re-calculated.
     *
     * Note that this field being set does NOT mean that the user proved with
     * any credibility that they _are_ the bound vertex. This field MUST be used
     * only in conjunction with the `authLevel` field to determine how credible
     * the remote host's claim to being this vertex is. It is entirely possible
     * that the remote host anonymously bound as this vertex.
     */
    public boundNameAndUID: NameAndOptionalUID | undefined;

    /**
     * The credibility with which the user asserted that they were the entry to
     * which they bound. It defaults to `none` with a local qualifier of `0` and
     * `signed` set to `FALSE`, which means an anonymous bind, with no transport
     * protection and no digital signing.
     */
    public authLevel: AuthenticationLevel = {
        basicLevels: new AuthenticationLevel_basicLevels(
            AuthenticationLevel_basicLevels_level_none,
            0,
            false,
        ),
    };

    /**
     * An index of the outstanding paged results requests by base64-encoded
     * `queryReference`.
     */
    public readonly pagedResultsRequests: Map<string, PagedResultsRequestState> = new Map();
    /**
     * TODO: Eventually change this to a proper FIFO queue so that enqueuing
     * runs in O(1) time. This is not really a huge problem right now, because
     * the size of the queue will be capped at a pretty low number.
     *
     * I tried [this queue library](https://www.npmjs.com/package/yocto-queue)
     * but I got the loathesome `ERR_REQUIRE_ESM` error, because that package
     * is written using exclusively ESM modules. There might be a workaround,
     * but I think the pain-in-the-ass is not worth it. I want to wait until
     * Nx monorepos have built-in support for ESM-only builds.
     *
     * See this: https://github.com/nrwl/nx/issues/7872
     */
    // public readonly enqueuedOperations: (() => Promise<any>)[] = [];

    /**
     * An index of operation invocations by invocation ID. The key of the index
     * is the `InvokeId.present` alternative; this alternative will always be
     * used by all non-bind operations.
     *
     * When an operation is started, it is added to this map. When the operation
     * is abandoned, its `abandonTime` field is set with the current time. Each
     * operation independently will be responsible for checking, say, in every
     * iteration of a loop, if this field is set (which would mean that the
     * request has been abandoned).
     */
    public readonly invocations: Map<number, OperationInvocationInfo> = new Map();

    /**
     * A mapping of LDAP message IDs to directory protocol invocation IDs.
     *
     * This is needed in both LDAP and DAP connections, because DAP could relay
     * LDAP messages through the ldapTransport and linkedLDAP operations.
     */
    public readonly messageIDToInvokeID: Map<number, number> = new Map();

    /**
     * A mapping of directory protocol invocation IDs to LDAP message IDs.
     *
     * This is needed in both LDAP and DAP connections, because DAP could relay
     * LDAP messages through the ldapTransport and linkedLDAP operations.
     */
    public readonly invokeIDToMessageID: Map<number, number> = new Map();

    /**
     * @summary Process a bind attempt from a remote host
     * @description
     *
     * This function handles a bind attempt from a remote host. It takes a
     * single `ASN1Element` which is the bind argument. This function is
     * expected to handle sending the bind response.
     *
     * @param arg The encoded bind argument
     *
     * @abstract
     * @function
     */
    public abstract attemptBind (arg: ASN1Element): Promise<void>;
}

/**
 * @summary Information about a bind result, which may have been anonymous.
 * @description
 *
 * Information about a bind result, which may have been anonymous.
 *
 * @interface
 */
export
interface BindReturn {

    /**
     * The bound vertex, which will only be set if this DSA has the bound DSE
     * locally.
     */
    boundVertex?: Vertex;

    /**
     * The bound distinguished name and optional unique identifier. The
     * distinguished name will be set even if the user provided no credentials
     * to prove that they were that entry. The unique identifier will be set if
     * a local DSE having the bound distinguished name can be found and it has
     * at least one `uniqueIdentifier` attribute value. The first
     * `uniqueIdentifier` attribute value will be used to populate this field,
     * even though there may potentially be multiple such values.
     */
    boundNameAndUID?: NameAndOptionalUID;

    /**
     * The level of credibility with which the user claimed to be the bound
     * entry. Whether the user bound anonymously, with a password, or with a
     * asymmetric cryptography will be represented here.
     */
    authLevel: AuthenticationLevel;

}

/**
 * @summary A function that edits an attribute that is not handled normally
 * @description
 *
 * A function that edits an attribute that is not handled normally by the
 * database (such as by being stored in the `AttributeValue` table).
 *
 * @type
 */
export
type SpecialAttributeDatabaseEditor = (
    ctx: Readonly<Context>,
    entry: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
) => Promise<void>;

/**
 * @summary A function that reads value of an attribute that is not handled normally
 * @description
 *
 * A function that reads value of an attribute that is not handled normally by
 * the database (such as by being stored in the `AttributeValue` table).
 *
 * @type
 */
export
type SpecialAttributeDatabaseReader = (
    ctx: Readonly<Context>,
    entry: Vertex,
    relevantSubentries?: Vertex[],
) => Promise<Value[]>;

/**
 * @summary A function that removes an attribute that is not handled normally
 * @description
 *
 * A function that removes an attribute that is not handled normally by the
 * database (such as by being stored in the `AttributeValue` table).
 *
 * @type
 */
export
type SpecialAttributeDatabaseRemover = (
    ctx: Readonly<Context>,
    entry: Vertex,
    pendingUpdates: PendingUpdates,
) => Promise<void>;

/**
 * @summary A function that counts values of an attribute that is not handled normally
 * @description
 *
 * A function that counts values of an attribute that is not handled normally by
 * the database (such as by being stored in the `AttributeValue` table).
 *
 * @type
 */
export
type SpecialAttributeCounter = (
    ctx: Readonly<Context>,
    entry: Vertex,
    relevantSubentries?: Vertex[],
) => Promise<number>;

/**
 * @summary A function that detects the presence of an attribute that is not handled normally
 * @description
 *
 * A function that detects the presence of an attribute that is not handled
 * normally by the database (such as by being stored in the `AttributeValue`
 * table).
 *
 * @type
 */
export
type SpecialAttributeDetector = (
    ctx: Readonly<Context>,
    entry: Vertex,
    relevantSubentries?: Vertex[],
) => Promise<boolean>;

/**
 * @summary A function that detects the presence of an attribute value that is not handled normally
 * @description
 *
 * A function that detects the presence of an attribute value that is not
 * handled normally by the database (such as by being stored in the
 * `AttributeValue` table).
 *
 * @type
 */
export
type SpecialAttributeValueDetector = (
    ctx: Readonly<Context>,
    entry: Vertex,
    value: Value,
    relevantSubentries?: Vertex[],
) => Promise<boolean>;

/**
 * @summary A driver for a specially-handled attribute type
 * @description
 *
 * An object that contains functions for reading and writing values of an
 * attribute type that is handled differently than "normal" attributes, which
 * are stored in the `AttributeValue` table.
 *
 * An attribute driver is typically used internally by Meerkat DSA to store
 * important operational attributes in a more human-digestible and performant
 * manner, such as by storing values of the `objectClass` attribute in a
 * separate table with object identifier values represented as strings and a
 * unique index with a composite key of the entry ID and object identifier.
 *
 * @interface
 */
export
interface AttributeTypeDatabaseDriver {

    /** Reads values of the specially-handled attribute type */
    readonly readValues: SpecialAttributeDatabaseReader;

    /** Adds a single value of the specially-handled attribute type */
    readonly addValue: SpecialAttributeDatabaseEditor;

    /** Removes a single value of the specially-handled attribute type */
    readonly removeValue: SpecialAttributeDatabaseEditor;

    /** Removes an attribute of the specially-handled attribute type */
    readonly removeAttribute: SpecialAttributeDatabaseRemover;

    /** Counts values of the specially-handled attribute type */
    readonly countValues: SpecialAttributeCounter;

    /** Checks for the presence of the specially-handled attribute type */
    readonly isPresent: SpecialAttributeDetector;

    /** Checks for the presence of a specific value of the specially-handled attribute type */
    readonly hasValue: SpecialAttributeValueDetector;

}
