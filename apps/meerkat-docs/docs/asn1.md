# ASN.1 Modules

Below are all of the ASN.1 modules that are defined in or used by the X.500
directory specifications. All of them are concatenated into this single page
for ease of searching.

ASN.1 is defined in ITU Recommendations X.680 through X.683.

Here is a brief table of contents of all of the modules displayed below:

- `Lightweight-Directory-Access-Protocol-V3`
- `BasicAccessControl`
- `DSAOperationalAttributeTypes`
- `EnhancedSecurity`
- `InformationFramework`
- `LdapSystemSchema`
- `OperationalBindingManagement`
- `SchemaAdministration`
- `ServiceAdministration`
- `UsefulDefinitions`
- `MTSAbstractService`
- `PKIX1Implicit93`
- `PkiPMIProtocolSpecifications`
- `PkiPmiWrapper`
- `AlgorithmObjectIdentifiers`
- `AttributeCertificateDefinitions`
- `AuthenticationFramework`
- `CertificateExtensions`
- `ExtensionAttributes`
- `PkiPmiExternalDataTypes`
- `AVL-Management`
- `CaSubscription`
- `CryptoTools`
- `GenAlgo`
- `PKI-Stub`
- `ProtProtocols`
- `TrustBroker`
- `Wrapper`
- `DirectoryAbstractService`
- `SpkmGssTokens`
- `DistributedOperations`
- `HierarchicalOperationalBindings`
- `ProtocolObjectIdentifiers`
- `CommonProtocolSpecification`
- `DirectoryIDMProtocols`
- `DirectoryOperationalBindingTypes`
- `DirectoryOSIProtocols`
- `IDMProtocolSpecification`
- `OSIProtocolSpecification`
- `PasswordPolicy`
- `SelectedAttributeTypes`
- `UpperBounds`
- `SelectedObjectClasses`
- `DirectoryShadowAbstractService`
- `DirectoryManagement`


```asn1
-- Module Lightweight-Directory-Access-Protocol-V3 (RFC 4511:06/2006)
-- See also the README file
-- See also the index of all ASN.1 assignments needed in this Recommendation

Lightweight-Directory-Access-Protocol-V3 {1 3 6 1 1 18}
--
-- Copyright (C) The Internet Society (2006).  This version of
-- this ASN.1 module is part of RFC 4511; see the RFC itself
-- for full legal notices.
--
DEFINITIONS IMPLICIT TAGS  EXTENSIBILITY IMPLIED::=
BEGIN

LDAPMessage ::= SEQUENCE {
  messageID   MessageID,
  protocolOp
    CHOICE {bindRequest           BindRequest,
            bindResponse          BindResponse,
            unbindRequest         UnbindRequest,
            searchRequest         SearchRequest,
            searchResEntry        SearchResultEntry,
            searchResDone         SearchResultDone,
            searchResRef          SearchResultReference,
            modifyRequest         ModifyRequest,
            modifyResponse        ModifyResponse,
            addRequest            AddRequest,
            addResponse           AddResponse,
            delRequest            DelRequest,
            delResponse           DelResponse,
            modDNRequest          ModifyDNRequest,
            modDNResponse         ModifyDNResponse,
            compareRequest        CompareRequest,
            compareResponse       CompareResponse,
            abandonRequest        AbandonRequest,
            extendedReq           ExtendedRequest,
            extendedResp          ExtendedResponse,
            ...,
            intermediateResponse  IntermediateResponse},
  controls    [0]  Controls OPTIONAL
}

MessageID ::= INTEGER(0..maxInt)

maxInt INTEGER ::= 2147483647 -- (2^^31 - 1)

LDAPString ::= OCTET STRING -- UTF-8 encoded,

-- [ISO10646] characters
LDAPOID ::= OCTET STRING -- Constrained to <numericoid>

-- [RFC4512]
LDAPDN ::= LDAPString -- Constrained to <distinguishedName>

-- [RFC4514]
RelativeLDAPDN ::=
  LDAPString -- Constrained to <name-component>

-- [RFC4514]
AttributeDescription ::= LDAPString

-- Constrained to <attributedescription>
-- [RFC4512]
AttributeValue ::= OCTET STRING

AttributeValueAssertion ::= SEQUENCE {
  attributeDesc   AttributeDescription,
  assertionValue  AssertionValue
}

AssertionValue ::= OCTET STRING

PartialAttribute ::= SEQUENCE {
  type  AttributeDescription,
  vals  SET OF value AttributeValue
}

Attribute ::= PartialAttribute(WITH COMPONENTS {
                                 ...,
                                 vals  (SIZE (1..MAX))
                               })

MatchingRuleId ::= LDAPString

LDAPResult ::= SEQUENCE {
  resultCode
    ENUMERATED {success(0), operationsError(1), protocolError(2),
                timeLimitExceeded(3), sizeLimitExceeded(4), compareFalse(5),
                compareTrue(6), authMethodNotSupported(7),
                strongerAuthRequired(8),
                -- 9 reserved
                referral(10), adminLimitExceeded(11),
                unavailableCriticalExtension(12), confidentialityRequired(13),
                saslBindInProgress(14), noSuchAttribute(16),
                undefinedAttributeType(17), inappropriateMatching(18),
                constraintViolation(19), attributeOrValueExists(20),
                invalidAttributeSyntax(21),
                -- 22-31 unused
                noSuchObject(32), aliasProblem(33),
                invalidDNSyntax(34),
                -- 35 reserved for undefined isLeaf
                aliasDereferencingProblem(36),
                -- 37-47 unused
                inappropriateAuthentication(48), invalidCredentials(49),
                insufficientAccessRights(50), busy(51), unavailable(52),
                unwillingToPerform(53),
                loopDetect(54),
                -- 55-63 unused
                namingViolation(64), objectClassViolation(65),
                notAllowedOnNonLeaf(66), notAllowedOnRDN(67),
                entryAlreadyExists(68),
                objectClassModsProhibited(69),
                -- 70 reserved for CLDAP
                affectsMultipleDSAs(71),
                -- 72-79 unused
                other(80), ...
                },
  matchedDN          LDAPDN,
  diagnosticMessage  LDAPString,
  referral           [3]  Referral OPTIONAL
}

Referral ::= SEQUENCE SIZE (1..MAX) OF uri URI

URI ::= LDAPString -- limited to characters permitted in

-- URIs
Controls ::= SEQUENCE OF control Control

Control ::= SEQUENCE {
  controlType   LDAPOID,
  criticality   BOOLEAN DEFAULT FALSE,
  controlValue  OCTET STRING OPTIONAL
}

BindRequest ::= [APPLICATION 0]  SEQUENCE {
  version         INTEGER(1..127),
  name            LDAPDN,
  authentication  AuthenticationChoice
}

AuthenticationChoice ::= CHOICE {
  simple  [0]  OCTET STRING,
  -- 1 and 2 reserved
  sasl    [3]  SaslCredentials,
  ...
}

SaslCredentials ::= SEQUENCE {
  mechanism    LDAPString,
  credentials  OCTET STRING OPTIONAL
}

BindResponse ::= [APPLICATION 1]  SEQUENCE {
  COMPONENTS OF LDAPResult,
  serverSaslCreds  [7]  OCTET STRING OPTIONAL
}

UnbindRequest ::= [APPLICATION 2]  NULL

SearchRequest ::= [APPLICATION 3]  SEQUENCE {
  baseObject    LDAPDN,
  scope
    ENUMERATED {baseObject(0), singleLevel(1), wholeSubtree(2), ...
                },
  derefAliases
    ENUMERATED {neverDerefAliases(0), derefInSearching(1),
                derefFindingBaseObj(2), derefAlways(3)},
  sizeLimit     INTEGER(0..maxInt),
  timeLimit     INTEGER(0..maxInt),
  typesOnly     BOOLEAN,
  filter        Filter,
  attributes    AttributeSelection
}

AttributeSelection ::= SEQUENCE OF selector LDAPString

-- The LDAPString is constrained to
-- <attributeSelector> in Section 4.5.1.8
Filter ::= CHOICE {
  and              [0]  SET SIZE (1..MAX) OF filter Filter,
  or               [1]  SET SIZE (1..MAX) OF filter Filter,
  not              [2]  Filter,
  equalityMatch    [3]  AttributeValueAssertion,
  substrings       [4]  SubstringFilter,
  greaterOrEqual   [5]  AttributeValueAssertion,
  lessOrEqual      [6]  AttributeValueAssertion,
  present          [7]  AttributeDescription,
  approxMatch      [8]  AttributeValueAssertion,
  extensibleMatch  [9]  MatchingRuleAssertion,
  ...
}

SubstringFilter ::= SEQUENCE {
  type        AttributeDescription,
  substrings
    SEQUENCE SIZE (1..MAX) OF substring
      CHOICE {initial  [0]  AssertionValue, -- can occur at most once--
              any      [1]  AssertionValue,
              final    [2]  AssertionValue} -- can occur at most once
}

MatchingRuleAssertion ::= SEQUENCE {
  matchingRule  [1]  MatchingRuleId OPTIONAL,
  type          [2]  AttributeDescription OPTIONAL,
  matchValue    [3]  AssertionValue,
  dnAttributes  [4]  BOOLEAN DEFAULT FALSE
}

SearchResultEntry ::= [APPLICATION 4]  SEQUENCE {
  objectName  LDAPDN,
  attributes  PartialAttributeList
}

PartialAttributeList ::= SEQUENCE OF partialAttribute PartialAttribute

SearchResultReference ::= [APPLICATION 19]  SEQUENCE SIZE (1..MAX) OF uri URI

SearchResultDone ::= [APPLICATION 5]  LDAPResult

ModifyRequest ::= [APPLICATION 6]  SEQUENCE {
  object   LDAPDN,
  changes
    SEQUENCE OF change
      SEQUENCE {operation     ENUMERATED {add(0), delete(1), replace(2), ...
                                          },
                modification  PartialAttribute}
}

ModifyResponse ::= [APPLICATION 7]  LDAPResult

AddRequest ::= [APPLICATION 8]  SEQUENCE {
  entry       LDAPDN,
  attributes  AttributeList
}

AttributeList ::= SEQUENCE OF attribute Attribute

AddResponse ::= [APPLICATION 9]  LDAPResult

DelRequest ::= [APPLICATION 10]  LDAPDN

DelResponse ::= [APPLICATION 11]  LDAPResult

ModifyDNRequest ::= [APPLICATION 12]  SEQUENCE {
  entry         LDAPDN,
  newrdn        RelativeLDAPDN,
  deleteoldrdn  BOOLEAN,
  newSuperior   [0]  LDAPDN OPTIONAL
}

ModifyDNResponse ::= [APPLICATION 13]  LDAPResult

CompareRequest ::= [APPLICATION 14]  SEQUENCE {
  entry  LDAPDN,
  ava    AttributeValueAssertion
}

CompareResponse ::= [APPLICATION 15]  LDAPResult

AbandonRequest ::= [APPLICATION 16]  MessageID

ExtendedRequest ::= [APPLICATION 23]  SEQUENCE {
  requestName   [0]  LDAPOID,
  requestValue  [1]  OCTET STRING OPTIONAL
}

ExtendedResponse ::= [APPLICATION 24]  SEQUENCE {
  COMPONENTS OF LDAPResult,
  responseName   [10]  LDAPOID OPTIONAL,
  responseValue  [11]  OCTET STRING OPTIONAL
}

IntermediateResponse ::= [APPLICATION 25]  SEQUENCE {
  responseName   [0]  LDAPOID OPTIONAL,
  responseValue  [1]  OCTET STRING OPTIONAL
}

END

BasicAccessControl
  {joint-iso-itu-t ds(5) module(1) basicAccessControl(24) 9}
DEFINITIONS ::=
BEGIN

-- EXPORTS All
/*
The types and values defined in this module are exported for use in the other ASN.1
modules contained within these Directory Specifications, and for the use of other
applications which will use them to access Directory services. Other applications may
use them for their own purposes, but this will not constrain extensions and
modifications needed to maintain or improve the Directory service.
*/
IMPORTS

  -- from Rec. ITU-T X.501 | ISO/IEC 9594-2

  id-aca, id-acScheme
    FROM UsefulDefinitions
      {joint-iso-itu-t ds(5) module(1) usefulDefinitions(0) 9} WITH SUCCESSORS

  ATTRIBUTE, AttributeType, AttributeTypeAndValue, ContextAssertion, DistinguishedName,
  MATCHING-RULE, objectIdentifierMatch, Refinement, SubtreeSpecification,
  SupportedAttributes
    FROM InformationFramework
      {joint-iso-itu-t ds(5) module(1) informationFramework(1) 9} WITH SUCCESSORS

 -- from Rec. ITU-T X.511 | ISO/IEC 9594-3

  Filter
    FROM DirectoryAbstractService
      {joint-iso-itu-t ds(5) module(1) directoryAbstractService(2) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.520 | ISO/IEC 9594-6

  directoryStringFirstComponentMatch, NameAndOptionalUID,
  UnboundedDirectoryString, UniqueIdentifier
    FROM SelectedAttributeTypes
      {joint-iso-itu-t ds(5) module(1) selectedAttributeTypes(5) 9} WITH SUCCESSORS ;

accessControlScheme ATTRIBUTE ::= {
  WITH SYNTAX             OBJECT IDENTIFIER
  EQUALITY MATCHING RULE  objectIdentifierMatch
  SINGLE VALUE            TRUE
  USAGE                   directoryOperation
  ID                      id-aca-accessControlScheme }

-- types

ACIItem ::= SEQUENCE {
  identificationTag    UnboundedDirectoryString,
  precedence           Precedence,
  authenticationLevel  AuthenticationLevel,
  itemOrUserFirst      CHOICE {
    itemFirst       [0]  SEQUENCE {
      protectedItems       ProtectedItems,
      itemPermissions      SET OF ItemPermission,
      ...},
    userFirst       [1]  SEQUENCE {
      userClasses          UserClasses,
      userPermissions      SET OF UserPermission,
      ...},
    ...},
  ... }

Precedence ::= INTEGER(0..255,...)

ProtectedItems ::= SEQUENCE {
  entry                          [0]  NULL OPTIONAL,
  allUserAttributeTypes          [1]  NULL OPTIONAL,
  attributeType                  [2]  SET SIZE (1..MAX) OF AttributeType
                                        OPTIONAL,
  allAttributeValues             [3]  SET SIZE (1..MAX) OF AttributeType
                                        OPTIONAL,
  allUserAttributeTypesAndValues [4]  NULL OPTIONAL,
  attributeValue                 [5]  SET SIZE (1..MAX) OF AttributeTypeAndValue
                                        OPTIONAL,
  selfValue                      [6]  SET SIZE (1..MAX) OF AttributeType
                                        OPTIONAL,
  rangeOfValues                  [7]  Filter OPTIONAL,
  maxValueCount                  [8]  SET SIZE (1..MAX) OF MaxValueCount
                                        OPTIONAL,
  maxImmSub                      [9]  INTEGER OPTIONAL,
  restrictedBy                   [10] SET SIZE (1..MAX) OF RestrictedValue
                                        OPTIONAL,
  contexts                       [11] SET SIZE (1..MAX) OF ContextAssertion
                                        OPTIONAL,
  classes                        [12] Refinement OPTIONAL,
  ... }

MaxValueCount ::= SEQUENCE {
  type      AttributeType,
  maxCount  INTEGER,
  ... }

RestrictedValue ::= SEQUENCE {
  type      AttributeType,
  valuesIn  AttributeType,
  ... }

UserClasses ::= SEQUENCE {
  allUsers   [0]  NULL                                      OPTIONAL,
  thisEntry  [1]  NULL                                      OPTIONAL,
  name       [2]  SET SIZE (1..MAX) OF NameAndOptionalUID   OPTIONAL,
  userGroup  [3]  SET SIZE (1..MAX) OF NameAndOptionalUID   OPTIONAL,
                  -- dn component shall be the name of an
                  -- entry of GroupOfUniqueNames
  subtree    [4]  SET SIZE (1..MAX) OF SubtreeSpecification OPTIONAL,
  ... }

ItemPermission ::= SEQUENCE {
  precedence        Precedence OPTIONAL,
             -- defaults to precedence in ACIItem
  userClasses       UserClasses,
  grantsAndDenials  GrantsAndDenials,
  ... }

UserPermission ::= SEQUENCE {
  precedence        Precedence OPTIONAL,
             -- defaults to precedence in ACIItem
  protectedItems    ProtectedItems,
  grantsAndDenials  GrantsAndDenials,
  ... }

AuthenticationLevel ::= CHOICE {
  basicLevels     SEQUENCE {
    level           ENUMERATED {none(0), simple(1), strong(2),...},
    localQualifier  INTEGER OPTIONAL,
    signed          BOOLEAN DEFAULT FALSE,
    ...},
  other           EXTERNAL,
  ... }

GrantsAndDenials ::= BIT STRING {
  -- permissions that may be used in conjunction
  -- with any component of ProtectedItems
  grantAdd             (0),
  denyAdd              (1),
  grantDiscloseOnError (2),
  denyDiscloseOnError  (3),
  grantRead            (4),
  denyRead             (5),
  grantRemove          (6),
  denyRemove           (7),
  -- permissions that may be used only in conjunction
  -- with the entry component
  grantBrowse          (8),
  denyBrowse           (9),
  grantExport          (10),
  denyExport           (11),
  grantImport          (12),
  denyImport           (13),
  grantModify          (14),
  denyModify           (15),
  grantRename          (16),
  denyRename           (17),
  grantReturnDN        (18),
  denyReturnDN         (19),
  -- permissions that may be used in conjunction
  -- with any component, except entry, of ProtectedItems
  grantCompare         (20),
  denyCompare          (21),
  grantFilterMatch     (22),
  denyFilterMatch      (23),
  grantInvoke          (24),
  denyInvoke           (25) }

-- attributes

prescriptiveACI ATTRIBUTE ::= {
  WITH SYNTAX             ACIItem
  EQUALITY MATCHING RULE  directoryStringFirstComponentMatch
  USAGE                   directoryOperation
  ID                      id-aca-prescriptiveACI }

entryACI ATTRIBUTE ::= {
  WITH SYNTAX             ACIItem
  EQUALITY MATCHING RULE  directoryStringFirstComponentMatch
  USAGE                   directoryOperation
  ID                      id-aca-entryACI }

subentryACI ATTRIBUTE ::= {
  WITH SYNTAX             ACIItem
  EQUALITY MATCHING RULE  directoryStringFirstComponentMatch
  USAGE                   directoryOperation
  ID                      id-aca-subentryACI }

-- object identifier assignments

-- attributes

id-aca-accessControlScheme     OBJECT IDENTIFIER ::= {id-aca 1}
id-aca-prescriptiveACI         OBJECT IDENTIFIER ::= {id-aca 4}
id-aca-entryACI                OBJECT IDENTIFIER ::= {id-aca 5}
id-aca-subentryACI             OBJECT IDENTIFIER ::= {id-aca 6}

-- access control schemes

basicAccessControlScheme       OBJECT IDENTIFIER ::= {id-acScheme 1}
simplifiedAccessControlScheme  OBJECT IDENTIFIER ::= {id-acScheme 2}
rule-based-access-control      OBJECT IDENTIFIER ::= {id-acScheme 3}
rule-and-basic-access-control  OBJECT IDENTIFIER ::= {id-acScheme 4}
rule-and-simple-access-control OBJECT IDENTIFIER ::= {id-acScheme 5}

END -- BasicAccessControl

DSAOperationalAttributeTypes
  {joint-iso-itu-t ds(5) module(1) dsaOperationalAttributeTypes(22) 9}
DEFINITIONS ::=
BEGIN

-- EXPORTS All
/*
The types and values defined in this module are exported for use in the other ASN.1
modules contained within these Directory Specifications, and for the use of other
applications which will use them to access Directory services. Other applications may
use them for their own purposes, but this will not constrain extensions and
modifications needed to maintain or improve the Directory service.
*/
IMPORTS

  -- from Rec. ITU-T X.501 | ISO/IEC 9594-2

  id-doa, id-kmr
    FROM UsefulDefinitions
      {joint-iso-itu-t ds(5) module(1) usefulDefinitions(0) 9} WITH SUCCESSORS

  ATTRIBUTE, MATCHING-RULE, Name
    FROM InformationFramework
      {joint-iso-itu-t ds(5) module(1) informationFramework(1) 9} WITH SUCCESSORS

  OperationalBindingID
    FROM OperationalBindingManagement
      {joint-iso-itu-t ds(5) module(1) opBindingManagement(18) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.518 | ISO/IEC 9594-4

  AccessPoint, DitBridgeKnowledge, MasterAndShadowAccessPoints
    FROM DistributedOperations
      {joint-iso-itu-t ds(5) module(1) distributedOperations(3) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.520 | ISO/IEC 9594-6
  bitStringMatch, directoryStringFirstComponentMatch
    FROM SelectedAttributeTypes
      {joint-iso-itu-t ds(5) module(1) selectedAttributeTypes(5) 9} WITH SUCCESSORS ;

dseType ATTRIBUTE ::= {
  WITH SYNTAX             DSEType
  EQUALITY MATCHING RULE  bitStringMatch
  SINGLE VALUE            TRUE
  NO USER MODIFICATION    TRUE
  USAGE                   dSAOperation
  ID                      id-doa-dseType }

DSEType ::= BIT STRING {
  root           (0),  -- root DSE
  glue           (1),  -- represents knowledge of a name only
  cp             (2),  -- context prefix
  entry          (3),  -- object entry
  alias          (4),  -- alias entry
  subr           (5),  -- subordinate reference
  nssr           (6),  -- non-specific subordinate reference
  supr           (7),  -- superior reference
  xr             (8),  -- cross reference
  admPoint       (9),  -- administrative point
  subentry       (10), -- subentry
  shadow         (11), -- shadow copy
  immSupr        (13), -- immediate superior reference
  rhob           (14), -- rhob information
  sa             (15), -- subordinate reference to alias entry
  dsSubentry     (16), -- DSA Specific subentry
  familyMember   (17), -- family member
  ditBridge      (18)} -- DIT bridge reference
--writeableCopy  (19)     writeable copy (currently not used)

myAccessPoint ATTRIBUTE ::= {
  WITH SYNTAX             AccessPoint
  EQUALITY MATCHING RULE  accessPointMatch
  SINGLE VALUE            TRUE
  NO USER MODIFICATION    TRUE
  USAGE                   dSAOperation
  ID                      id-doa-myAccessPoint }

superiorKnowledge ATTRIBUTE ::= {
  WITH SYNTAX             AccessPoint
  EQUALITY MATCHING RULE  accessPointMatch
  NO USER MODIFICATION    TRUE
  USAGE                   dSAOperation
  ID                      id-doa-superiorKnowledge }

specificKnowledge ATTRIBUTE ::= {
  WITH SYNTAX             MasterAndShadowAccessPoints
  EQUALITY MATCHING RULE  masterAndShadowAccessPointsMatch
  SINGLE VALUE            TRUE
  NO USER MODIFICATION    TRUE
  USAGE                   distributedOperation
  ID                      id-doa-specificKnowledge }

nonSpecificKnowledge ATTRIBUTE ::= {
  WITH SYNTAX             MasterAndShadowAccessPoints
  EQUALITY MATCHING RULE  masterAndShadowAccessPointsMatch
  NO USER MODIFICATION    TRUE
  USAGE                   distributedOperation
  ID                      id-doa-nonSpecificKnowledge }

SupplierOrConsumer ::= SET {
  COMPONENTS OF              AccessPoint, -- supplier or consumer
  agreementID           [3]  OperationalBindingID,
  ... }

SupplierInformation ::= SET {
  COMPONENTS OF              SupplierOrConsumer, -- supplier
  supplier-is-master    [4]  BOOLEAN DEFAULT TRUE,
  non-supplying-master  [5]  AccessPoint OPTIONAL,
  ... }

supplierKnowledge ATTRIBUTE ::= {
  WITH SYNTAX             SupplierInformation
  EQUALITY MATCHING RULE  supplierOrConsumerInformationMatch
  NO USER MODIFICATION    TRUE
  USAGE                   dSAOperation
  ID                      id-doa-supplierKnowledge }

ConsumerInformation ::= SupplierOrConsumer -- consumer

consumerKnowledge ATTRIBUTE ::= {
  WITH SYNTAX             ConsumerInformation
  EQUALITY MATCHING RULE  supplierOrConsumerInformationMatch
  NO USER MODIFICATION    TRUE
  USAGE                   dSAOperation
  ID                      id-doa-consumerKnowledge }

SupplierAndConsumers ::= SET {
  COMPONENTS OF         AccessPoint, -- supplier
  consumers        [3]  SET OF AccessPoint,
  ... }

secondaryShadows ATTRIBUTE ::= {
  WITH SYNTAX             SupplierAndConsumers
  EQUALITY MATCHING RULE  supplierAndConsumersMatch
  NO USER MODIFICATION    TRUE
  USAGE                   dSAOperation
  ID                      id-doa-secondaryShadows }

ditBridgeKnowledge ATTRIBUTE ::= {
  WITH SYNTAX             DitBridgeKnowledge
  EQUALITY MATCHING RULE  directoryStringFirstComponentMatch
  NO USER MODIFICATION    TRUE
  USAGE                   dSAOperation
  ID                      id-doa-ditBridgeKnowledge }

-- matching rules

accessPointMatch MATCHING-RULE ::= {
  SYNTAX  Name
  ID      id-kmr-accessPointMatch }

masterAndShadowAccessPointsMatch MATCHING-RULE ::= {
  SYNTAX  SET OF Name
  ID      id-kmr-masterShadowMatch }

supplierOrConsumerInformationMatch MATCHING-RULE ::= {
  SYNTAX SET {
    ae-title              [0]  Name,
    agreement-identifier  [2]  INTEGER}
  ID      id-kmr-supplierConsumerMatch }

supplierAndConsumersMatch MATCHING-RULE ::= {
  SYNTAX  Name
  ID      id-kmr-supplierConsumersMatch }

-- object identifier assignments

-- dsa operational attributes

id-doa-dseType                  OBJECT IDENTIFIER ::= {id-doa 0}
id-doa-myAccessPoint            OBJECT IDENTIFIER ::= {id-doa 1}
id-doa-superiorKnowledge        OBJECT IDENTIFIER ::= {id-doa 2}
id-doa-specificKnowledge        OBJECT IDENTIFIER ::= {id-doa 3}
id-doa-nonSpecificKnowledge     OBJECT IDENTIFIER ::= {id-doa 4}
id-doa-supplierKnowledge        OBJECT IDENTIFIER ::= {id-doa 5}
id-doa-consumerKnowledge        OBJECT IDENTIFIER ::= {id-doa 6}
id-doa-secondaryShadows         OBJECT IDENTIFIER ::= {id-doa 7}
id-doa-ditBridgeKnowledge       OBJECT IDENTIFIER ::= {id-doa 8}

-- knowledge matching rules

id-kmr-accessPointMatch         OBJECT IDENTIFIER ::= {id-kmr 0}
id-kmr-masterShadowMatch        OBJECT IDENTIFIER ::= {id-kmr 1}
id-kmr-supplierConsumerMatch    OBJECT IDENTIFIER ::= {id-kmr 2}
id-kmr-supplierConsumersMatch   OBJECT IDENTIFIER ::= {id-kmr 3}

END -- DSAOperationalAttributeTypes

EnhancedSecurity
  {joint-iso-itu-t ds(5) modules(1) enhancedSecurity(28) 9}
DEFINITIONS IMPLICIT TAGS ::=
BEGIN

-- EXPORTS All

IMPORTS

  -- from Rec. ITU-T X.501 | ISO/IEC 9594-2

  id-at, id-avc, id-mr, id-oc
    FROM UsefulDefinitions
      {joint-iso-itu-t ds(5) module(1) usefulDefinitions(0) 9}  WITH SUCCESSORS

  Attribute{}, ATTRIBUTE, AttributeType, AttributeTypeAndValue, Context, CONTEXT,
  Name, OBJECT-CLASS, objectIdentifierMatch, SupportedAttributes, top
    FROM InformationFramework
      {joint-iso-itu-t ds(5) module(1) informationFramework(1) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.509 | ISO/IEC 9594-8

  CertificateSerialNumber, HASH{}, SIGNED{}
    FROM AuthenticationFramework
      {joint-iso-itu-t ds(5) module(1) authenticationFramework(7) 9} WITH SUCCESSORS

  GeneralName, KeyIdentifier
    FROM CertificateExtensions
      {joint-iso-itu-t ds(5) module(1) certificateExtensions(26) 9} WITH SUCCESSORS ;

OPTIONALLY-PROTECTED{Type} ::= CHOICE {
  unsigned       Type,
  signed         SIGNED{Type} }

OPTIONALLY-PROTECTED-SEQ{Type} ::= CHOICE {
  unsigned       Type,
  signed    [0]  SIGNED{Type} }

attributeValueSecurityLabelContext CONTEXT ::= {
  WITH SYNTAX    SignedSecurityLabel -- At most one security label context can
                                     -- be assigned to an attribute value
  ID             id-avc-attributeValueSecurityLabelContext }

SignedSecurityLabel ::= SIGNED{SignedSecurityLabelContent}

SignedSecurityLabelContent ::= SEQUENCE {
  attHash        HASH{AttributeTypeAndValue},
  issuer         Name OPTIONAL, -- name of labelling authority
  keyIdentifier  KeyIdentifier OPTIONAL,
  securityLabel  SecurityLabel,
  ... }

SecurityLabel ::= SET {
  security-policy-identifier  SecurityPolicyIdentifier OPTIONAL,
  security-classification     SecurityClassification OPTIONAL,
  privacy-mark                PrivacyMark OPTIONAL,
  security-categories         SecurityCategories OPTIONAL,
  ... }
   (ALL EXCEPT ({ -- none, at least one component shall be present --}))

SecurityPolicyIdentifier ::= OBJECT IDENTIFIER

SecurityClassification ::= INTEGER {
  unmarked      (0),
  unclassified  (1),
  restricted    (2),
  confidential  (3),
  secret        (4),
  top-secret    (5)}

PrivacyMark ::= PrintableString(SIZE (1..MAX))

SecurityCategories ::= SET SIZE (1..MAX) OF SecurityCategory

clearance ATTRIBUTE ::= {
  WITH SYNTAX  Clearance
  ID           id-at-clearance }

Clearance ::= SEQUENCE {
  policyId            OBJECT IDENTIFIER,
  classList           ClassList DEFAULT {unclassified},
  securityCategories  SET SIZE (1..MAX) OF SecurityCategory OPTIONAL,
  ... }

ClassList ::= BIT STRING {
  unmarked      (0),
  unclassified  (1),
  restricted    (2),
  confidential  (3),
  secret        (4),
  topSecret     (5)}

SecurityCategory ::= SEQUENCE {
  type   [0]  SECURITY-CATEGORY.&id({SecurityCategoriesTable}),
  value  [1]  EXPLICIT SECURITY-CATEGORY.&Type({SecurityCategoriesTable}{@type}),
  ... }

SECURITY-CATEGORY ::= TYPE-IDENTIFIER

SecurityCategoriesTable SECURITY-CATEGORY ::= {...}

attributeIntegrityInfo ATTRIBUTE ::= {
  WITH SYNTAX   AttributeIntegrityInfo
  SINGLE VALUE  TRUE
  ID            id-at-attributeIntegrityInfo }

AttributeIntegrityInfo ::= SIGNED{AttributeIntegrityInfoContent}

AttributeIntegrityInfoContent ::= SEQUENCE {
  scope        Scope,           -- Identifies the attributes protected
  signer       Signer OPTIONAL, -- Authority or data originators name
  attribsHash  AttribsHash,     -- Hash value of protected attributes
  ... }

Signer ::= CHOICE {
  thisEntry   [0]  EXPLICIT ThisEntry,
  thirdParty  [1]  SpecificallyIdentified,
  ... }

ThisEntry ::= CHOICE {
  onlyOne   NULL,
  specific  IssuerAndSerialNumber,
  ... }

IssuerAndSerialNumber ::= SEQUENCE {
  issuer  Name,
  serial  CertificateSerialNumber,
  ... }

SpecificallyIdentified ::= SEQUENCE {
  name    GeneralName,
  issuer  GeneralName OPTIONAL,
  serial  CertificateSerialNumber OPTIONAL }
  (WITH COMPONENTS { ..., issuer PRESENT, serial PRESENT } |
  (WITH COMPONENTS { ..., issuer ABSENT, serial ABSENT }))

Scope ::= CHOICE {
  wholeEntry     [0]  NULL, -- Signature protects all attribute values in this entry
  selectedTypes  [1]  SelectedTypes,
      -- Signature protects all attribute values of the selected attribute types
  ... }

SelectedTypes ::= SEQUENCE SIZE (1..MAX) OF AttributeType

AttribsHash ::= HASH{HashedAttributes}

HashedAttributes ::= SEQUENCE SIZE (1..MAX) OF Attribute{{SupportedAttributes}}
   -- Attribute type and values with associated context values for the selected Scope

integrityInfo OBJECT-CLASS ::= {
  SUBCLASS OF   {top}
  KIND          auxiliary
  MUST CONTAIN  {attributeIntegrityInfo}
  ID            id-oc-integrityInfo }

attributeValueIntegrityInfoContext CONTEXT ::= {
  WITH SYNTAX  AttributeValueIntegrityInfo
  ID           id-avc-attributeValueIntegrityInfoContext }

AttributeValueIntegrityInfo ::= SIGNED{AttributeValueIntegrityInfoContent}

AttributeValueIntegrityInfoContent ::= SEQUENCE {
  signer   Signer OPTIONAL, -- Authority or data originators name
  aVIHash  AVIHash,         -- Hash value of protected attribute
  ... }

AVIHash ::= HASH{AttributeTypeValueContexts}
  -- Attribute type and value with associated context values

AttributeTypeValueContexts ::= SEQUENCE {
  type         ATTRIBUTE.&id({SupportedAttributes}),
  value        ATTRIBUTE.&Type({SupportedAttributes}{@type}),
  contextList  SET SIZE (1..MAX) OF Context OPTIONAL,
  ... }

-- Object identifier assignments
-- object classes

id-oc-integrityInfo OBJECT IDENTIFIER ::=  {id-oc 40}

-- attributes

id-at-clearance                           OBJECT IDENTIFIER ::= {id-at 55}
-- id-at-defaultDirQop                    OBJECT IDENTIFIER ::= {id-at 56}
id-at-attributeIntegrityInfo              OBJECT IDENTIFIER ::= {id-at 57}
-- id-at-confKeyInfo                      OBJECT IDENTIFIER ::= {id-at 60}

-- matching rules

-- id-mr-readerAndKeyIDMatch              OBJECT IDENTIFIER ::= {id-mr 43}

-- contexts

id-avc-attributeValueSecurityLabelContext OBJECT IDENTIFIER ::= {id-avc 3}
id-avc-attributeValueIntegrityInfoContext OBJECT IDENTIFIER ::= {id-avc 4}

END -- EnhancedSecurity

InformationFramework
  {joint-iso-itu-t ds(5) module(1) informationFramework(1) 9}
DEFINITIONS ::=
BEGIN

-- EXPORTS All
/*
The types and values defined in this module are exported for use in the other ASN.1
modules contained within these Directory Specifications, and for the use of other
applications which will use them to access Directory services. Other applications
may use them for their own purposes, but this will not constrain extensions and
modifications needed to maintain or improve the Directory service.
*/
IMPORTS

  -- from Rec. ITU-T X.501 | ISO/IEC 9594-2

  id-ar, id-at, id-mr, id-nf, id-oa, id-oc, id-sc
    FROM UsefulDefinitions
      {joint-iso-itu-t ds(5) module(1)usefulDefinitions(0) 9} WITH SUCCESSORS

  SearchRule
    FROM ServiceAdministration
      {joint-iso-itu-t ds(5) module(1) serviceAdministration(33) 9} WITH SUCCESSORS

  -- from  Rec. ITU-T X.511 | ISO/IEC 9594-3

  TypeAndContextAssertion
    FROM DirectoryAbstractService
      {joint-iso-itu-t ds(5) module(1) directoryAbstractService(2) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.520 | ISO/IEC 9594-6

  booleanMatch, commonName, dn, generalizedTime, generalizedTimeMatch,
  generalizedTimeOrderingMatch, integerFirstComponentMatch, integerMatch,
  integerOrderingMatch,   objectIdentifierFirstComponentMatch, oid, subtreeSpec,
  UnboundedDirectoryString
    FROM SelectedAttributeTypes
      {joint-iso-itu-t ds(5) module(1) selectedAttributeTypes(5) 9} WITH SUCCESSORS ;

-- attribute data types

Attribute {ATTRIBUTE:SupportedAttributes} ::= SEQUENCE {
  type                ATTRIBUTE.&id({SupportedAttributes}),
  values              SET SIZE (0..MAX) OF ATTRIBUTE.&Type({SupportedAttributes}{@type}),
  valuesWithContext   SET SIZE (1..MAX) OF SEQUENCE {
    value               ATTRIBUTE.&Type({SupportedAttributes}{@type}),
    contextList         SET SIZE (1..MAX) OF Context,
    ...} OPTIONAL,
  ... }

AttributeType ::= ATTRIBUTE.&id

AttributeValue ::= ATTRIBUTE.&Type

Context ::= SEQUENCE {
  contextType    CONTEXT.&id({SupportedContexts}),
  contextValues
    SET SIZE (1..MAX) OF CONTEXT.&Type({SupportedContexts}{@contextType}),
  fallback       BOOLEAN DEFAULT FALSE,
  ... }

AttributeValueAssertion ::= SEQUENCE {
  type              ATTRIBUTE.&id({SupportedAttributes}),
  assertion         ATTRIBUTE.&equality-match.&AssertionType
                      ({SupportedAttributes}{@type}),
  assertedContexts  CHOICE {
    allContexts       [0]  NULL,
    selectedContexts  [1]  SET SIZE (1..MAX) OF ContextAssertion } OPTIONAL,
  ... }

ContextAssertion ::= SEQUENCE {
  contextType    CONTEXT.&id({SupportedContexts}),
  contextValues  SET SIZE (1..MAX) OF
      CONTEXT.&Assertion({SupportedContexts}{@contextType}),
  ... }

AttributeTypeAssertion ::= SEQUENCE {
  type              ATTRIBUTE.&id({SupportedAttributes}),
  assertedContexts  SEQUENCE SIZE (1..MAX) OF ContextAssertion OPTIONAL,
  ... }

-- Definition of the following information object set is deferred, perhaps to
-- standardized profiles or to protocol implementation conformance statements. The set
-- is required to specify a table constraint on the values component of Attribute, the
-- value component of AttributeTypeAndValue, and the assertion component of
-- AttributeValueAssertion.

SupportedAttributes ATTRIBUTE ::= {objectClass | aliasedEntryName, ...}

-- Definition of the following information object set is deferred, perhaps to
-- standardized profiles or to protocol implementation conformance statements. The set
-- is required to specify a table constraint on the context specifications.

SupportedContexts CONTEXT ::= {...}

-- naming data types

Name ::= CHOICE { -- only one possibility for now -- rdnSequence  RDNSequence }

RDNSequence ::= SEQUENCE OF RelativeDistinguishedName

DistinguishedName ::= RDNSequence

RelativeDistinguishedName ::= SET SIZE (1..MAX) OF AttributeTypeAndValue

AttributeTypeAndValue ::= SEQUENCE {
  type                  ATTRIBUTE.&id({SupportedAttributes}),
  value                 ATTRIBUTE.&Type({SupportedAttributes}{@type}),
  ... }

-- subtree data types

SubtreeSpecification ::= SEQUENCE {
  base                 [0]  LocalName DEFAULT {},
  COMPONENTS OF             ChopSpecification,
  specificationFilter  [4]  Refinement OPTIONAL,
  ... }
-- empty sequence specifies whole administrative area

LocalName ::= RDNSequence

ChopSpecification ::= SEQUENCE {
  specificExclusions    [1]  SET SIZE (1..MAX) OF CHOICE {
    chopBefore  [0]  LocalName,
    chopAfter   [1]  LocalName,
    ...} OPTIONAL,
  minimum       [2]  BaseDistance DEFAULT 0,
  maximum       [3]  BaseDistance OPTIONAL,
  ... }

BaseDistance ::= INTEGER(0..MAX)

Refinement ::= CHOICE {
  item  [0]  OBJECT-CLASS.&id,
  and   [1]  SET SIZE (1..MAX) OF Refinement,
  or    [2]  SET SIZE (1..MAX) OF Refinement,
  not   [3]  Refinement,
  ... }

-- OBJECT-CLASS information object class specification

OBJECT-CLASS ::= CLASS {
  &Superclasses         OBJECT-CLASS OPTIONAL,
  &kind                 ObjectClassKind DEFAULT structural,
  &MandatoryAttributes  ATTRIBUTE OPTIONAL,
  &OptionalAttributes   ATTRIBUTE OPTIONAL,
  &ldapName             SEQUENCE SIZE(1..MAX) OF UTF8String OPTIONAL,
  &ldapDesc             UTF8String OPTIONAL,
  &id                   OBJECT IDENTIFIER UNIQUE }
WITH SYNTAX {
  [SUBCLASS OF          &Superclasses]
  [KIND                 &kind]
  [MUST CONTAIN         &MandatoryAttributes]
  [MAY CONTAIN          &OptionalAttributes]
  [LDAP-NAME            &ldapName]
  [LDAP-DESC            &ldapDesc]
  ID                    &id }

ObjectClassKind ::= ENUMERATED {
  abstract   (0),
  structural (1),
  auxiliary  (2)}

-- object classes

top OBJECT-CLASS ::= {
  KIND          abstract
  MUST CONTAIN  {objectClass}
  LDAP-NAME     {"top"}
  ID            id-oc-top }

alias OBJECT-CLASS ::= {
  SUBCLASS OF   {top}
  MUST CONTAIN  {aliasedEntryName}
  LDAP-NAME     {"alias"}
  ID            id-oc-alias }

parent OBJECT-CLASS ::= {
  KIND          abstract
  ID            id-oc-parent }

child OBJECT-CLASS ::= {
  KIND          auxiliary
  ID            id-oc-child }

-- ATTRIBUTE information object class specification

ATTRIBUTE ::= CLASS {
  &derivation               ATTRIBUTE OPTIONAL,
  &Type                     OPTIONAL, -- either &Type or &derivation required
  &equality-match           MATCHING-RULE OPTIONAL,
  &ordering-match           MATCHING-RULE OPTIONAL,
  &substrings-match         MATCHING-RULE OPTIONAL,
  &single-valued            BOOLEAN DEFAULT FALSE,
  &collective               BOOLEAN DEFAULT FALSE,
  &dummy                    BOOLEAN DEFAULT FALSE,
  -- operational extensions
  &no-user-modification     BOOLEAN DEFAULT FALSE,
  &usage                    AttributeUsage DEFAULT userApplications,
  &ldapSyntax               SYNTAX-NAME.&id OPTIONAL,
  &ldapName                 SEQUENCE SIZE(1..MAX) OF UTF8String OPTIONAL,
  &ldapDesc                 UTF8String OPTIONAL,
  &obsolete                 BOOLEAN DEFAULT FALSE,
  &id                       OBJECT IDENTIFIER UNIQUE }
WITH SYNTAX {
  [SUBTYPE OF               &derivation]
  [WITH SYNTAX              &Type]
  [EQUALITY MATCHING RULE   &equality-match]
  [ORDERING MATCHING RULE   &ordering-match]
  [SUBSTRINGS MATCHING RULE &substrings-match]
  [SINGLE VALUE             &single-valued]
  [COLLECTIVE               &collective]
  [DUMMY                    &dummy]
  [NO USER MODIFICATION     &no-user-modification]
  [USAGE                    &usage]
  [LDAP-SYNTAX              &ldapSyntax]
  [LDAP-NAME                &ldapName]
  [LDAP-DESC                &ldapDesc]
  [OBSOLETE                 &obsolete]
  ID                        &id }

AttributeUsage ::= ENUMERATED {
  userApplications     (0),
  directoryOperation   (1),
  distributedOperation (2),
  dSAOperation         (3),
  ... }

-- attributes

objectClass ATTRIBUTE ::= {
  WITH SYNTAX             OBJECT IDENTIFIER
  EQUALITY MATCHING RULE  objectIdentifierMatch
  LDAP-SYNTAX             oid.&id
  LDAP-NAME               {"objectClass"}
  ID                      id-at-objectClass }

aliasedEntryName ATTRIBUTE ::= {
  WITH SYNTAX             DistinguishedName
  EQUALITY MATCHING RULE  distinguishedNameMatch
  SINGLE VALUE            TRUE
  LDAP-SYNTAX             dn.&id
  LDAP-NAME               {"aliasedObjectName"}
  ID                      id-at-aliasedEntryName }

-- MATCHING-RULE information object class specification

MATCHING-RULE ::= CLASS {
  &ParentMatchingRules    MATCHING-RULE OPTIONAL,
  &AssertionType          OPTIONAL,
  &uniqueMatchIndicator   ATTRIBUTE OPTIONAL,
  &ldapSyntax             SYNTAX-NAME.&id OPTIONAL,
  &ldapName               SEQUENCE SIZE(1..MAX) OF UTF8String OPTIONAL,
  &ldapDesc               UTF8String OPTIONAL,
  &id                     OBJECT IDENTIFIER UNIQUE }
WITH SYNTAX {
  [PARENT                 &ParentMatchingRules]
  [SYNTAX                 &AssertionType]
  [UNIQUE-MATCH-INDICATOR &uniqueMatchIndicator]
  [LDAP-SYNTAX            &ldapSyntax]
  [LDAP-NAME              &ldapName]
  [LDAP-DESC              &ldapDesc]
  ID                      &id }

-- matching rules

objectIdentifierMatch MATCHING-RULE ::= {
  SYNTAX       OBJECT IDENTIFIER
  LDAP-SYNTAX  oid.&id
  LDAP-NAME    {"objectIdentifierMatch"}
  ID           id-mr-objectIdentifierMatch }

distinguishedNameMatch MATCHING-RULE ::= {
  SYNTAX       DistinguishedName
  LDAP-SYNTAX  dn.&id
  LDAP-NAME    {"distinguishedNameMatch"}
  ID           id-mr-distinguishedNameMatch }


-- MATCHING-RULE information object class specification

MAPPING-BASED-MATCHING
  {SelectedBy, BOOLEAN:combinable, MappingResult, OBJECT IDENTIFIER:matchingRule} ::=
CLASS {
  &selectBy             SelectedBy OPTIONAL,
  &ApplicableTo         ATTRIBUTE,
  &subtypesIncluded     BOOLEAN DEFAULT TRUE,
  &combinable           BOOLEAN(combinable),
  &mappingResults       MappingResult OPTIONAL,
  &userControl          BOOLEAN DEFAULT FALSE,
  &exclusive            BOOLEAN DEFAULT TRUE,
  &matching-rule        MATCHING-RULE.&id(matchingRule),
  &id                   OBJECT IDENTIFIER UNIQUE }
WITH SYNTAX {
  [SELECT BY            &selectBy]
  APPLICABLE TO         &ApplicableTo
  [SUBTYPES INCLUDED    &subtypesIncluded]
  COMBINABLE            &combinable
  [MAPPING RESULTS      &mappingResults]
  [USER CONTROL         &userControl]
  [EXCLUSIVE            &exclusive]
  MATCHING RULE         &matching-rule
  ID                    &id }

-- NAME-FORM information object class specification

NAME-FORM ::= CLASS {
  &namedObjectClass     OBJECT-CLASS,
  &MandatoryAttributes  ATTRIBUTE,
  &OptionalAttributes   ATTRIBUTE OPTIONAL,
  &ldapName             SEQUENCE SIZE(1..MAX) OF UTF8String OPTIONAL,
  &ldapDesc             UTF8String OPTIONAL,
  &id                   OBJECT IDENTIFIER UNIQUE }
WITH SYNTAX {
  NAMES                 &namedObjectClass
  WITH ATTRIBUTES       &MandatoryAttributes
  [AND OPTIONALLY       &OptionalAttributes]
  [LDAP-NAME            &ldapName]
  [LDAP-DESC            &ldapDesc]
  ID                    &id }

-- STRUCTURE-RULE class and DIT structure rule data types

DITStructureRule ::= SEQUENCE {
  ruleIdentifier          RuleIdentifier,
                 -- shall be unique within the scope of the subschema
  nameForm                NAME-FORM.&id,
  superiorStructureRules  SET SIZE (1..MAX) OF RuleIdentifier OPTIONAL,
  ... }

RuleIdentifier ::= INTEGER

STRUCTURE-RULE ::= CLASS {
  &nameForm               NAME-FORM,
  &SuperiorStructureRules STRUCTURE-RULE.&id OPTIONAL,
  &id                     RuleIdentifier }
WITH SYNTAX {
  NAME FORM               &nameForm
  [SUPERIOR RULES         &SuperiorStructureRules]
  ID                      &id }

-- DIT content rule data type and CONTENT-RULE class

DITContentRule ::= SEQUENCE {
  structuralObjectClass       OBJECT-CLASS.&id,
  auxiliaries                 SET SIZE (1..MAX) OF OBJECT-CLASS.&id OPTIONAL,
  mandatory              [1]  SET SIZE (1..MAX) OF ATTRIBUTE.&id    OPTIONAL,
  optional               [2]  SET SIZE (1..MAX) OF ATTRIBUTE.&id    OPTIONAL,
  precluded              [3]  SET SIZE (1..MAX) OF ATTRIBUTE.&id    OPTIONAL,
  ... }

CONTENT-RULE ::= CLASS {
  &structuralClass          OBJECT-CLASS.&id UNIQUE,
  &Auxiliaries              OBJECT-CLASS OPTIONAL,
  &Mandatory                ATTRIBUTE OPTIONAL,
  &Optional                 ATTRIBUTE OPTIONAL,
  &Precluded                ATTRIBUTE OPTIONAL }
WITH SYNTAX {
  STRUCTURAL OBJECT-CLASS   &structuralClass
  [AUXILIARY OBJECT-CLASSES &Auxiliaries]
  [MUST CONTAIN             &Mandatory]
  [MAY CONTAIN              &Optional]
  [MUST-NOT CONTAIN         &Precluded] }

CONTEXT ::= CLASS {
  &Type,
  &defaultValue   &Type OPTIONAL,
  &Assertion      OPTIONAL,
  &absentMatch    BOOLEAN DEFAULT TRUE,
  &id             OBJECT IDENTIFIER UNIQUE }
WITH SYNTAX {
  WITH SYNTAX     &Type
  [DEFAULT-VALUE  &defaultValue]
  [ASSERTED AS    &Assertion]
  [ABSENT-MATCH   &absentMatch]
  ID              &id }

DITContextUse ::= SEQUENCE {
  attributeType           ATTRIBUTE.&id,
  mandatoryContexts  [1]  SET SIZE (1..MAX) OF CONTEXT.&id OPTIONAL,
  optionalContexts   [2]  SET SIZE (1..MAX) OF CONTEXT.&id OPTIONAL,
  ... }

DIT-CONTEXT-USE-RULE ::= CLASS {
  &attributeType      ATTRIBUTE.&id UNIQUE,
  &Mandatory          CONTEXT OPTIONAL,
  &Optional           CONTEXT OPTIONAL}
WITH SYNTAX {
  ATTRIBUTE TYPE      &attributeType
  [MANDATORY CONTEXTS &Mandatory]
  [OPTIONAL CONTEXTS  &Optional] }

FRIENDS ::= CLASS {
  &anchor   ATTRIBUTE.&id UNIQUE,
  &Friends  ATTRIBUTE }
WITH SYNTAX {
  ANCHOR    &anchor
  FRIENDS   &Friends }

SYNTAX-NAME ::= CLASS {
  &ldapDesc               UTF8String,
  &Type                   OPTIONAL,
  &id                     OBJECT IDENTIFIER UNIQUE }
WITH SYNTAX {
  LDAP-DESC               &ldapDesc
  [DIRECTORY SYNTAX       &Type]
  ID                      &id }

-- system schema information objects

-- object classes

subentry OBJECT-CLASS ::= {
  SUBCLASS OF      {top}
  KIND             structural
  MUST CONTAIN     {commonName |
                    subtreeSpecification}
  LDAP-NAME        {"subentry"}
  ID               id-sc-subentry }

subentryNameForm NAME-FORM ::= {
  NAMES            subentry
  WITH ATTRIBUTES  {commonName}
  ID               id-nf-subentryNameForm }

subtreeSpecification ATTRIBUTE ::= {
  WITH SYNTAX             SubtreeSpecification
  USAGE                   directoryOperation
  LDAP-SYNTAX             subtreeSpec.&id
  LDAP-NAME               {"subtreeSpecification"}
  ID                      id-oa-subtreeSpecification }

administrativeRole ATTRIBUTE ::= {
  WITH SYNTAX             OBJECT-CLASS.&id
  EQUALITY MATCHING RULE  objectIdentifierMatch
  USAGE                   directoryOperation
  LDAP-SYNTAX             oid.&id
  LDAP-NAME               {"administrativeRole"}
  ID                      id-oa-administrativeRole }

createTimestamp ATTRIBUTE ::= {
  WITH SYNTAX             GeneralizedTime
  -- as per 46.3 b) or c) of Rec. ITU-T X.680 | ISO/IEC 8824-1
  EQUALITY MATCHING RULE  generalizedTimeMatch
  ORDERING MATCHING RULE  generalizedTimeOrderingMatch
  SINGLE VALUE            TRUE
  NO USER MODIFICATION    TRUE
  USAGE                   directoryOperation
  LDAP-SYNTAX             generalizedTime.&id
  LDAP-NAME               {"createTimestamp"}
  ID                      id-oa-createTimestamp }

modifyTimestamp ATTRIBUTE ::= {
  WITH SYNTAX             GeneralizedTime
  -- as per 46.3 b) or c) of Rec. ITU-T X.680 | ISO/IEC 8824-1
  EQUALITY MATCHING RULE  generalizedTimeMatch
  ORDERING MATCHING RULE  generalizedTimeOrderingMatch
  SINGLE VALUE            TRUE
  NO USER MODIFICATION    TRUE
  USAGE                   directoryOperation
  LDAP-SYNTAX             generalizedTime.&id
  LDAP-NAME               {"modifyTimestamp"}
  ID                      id-oa-modifyTimestamp }

subschemaTimestamp ATTRIBUTE ::= {
  WITH SYNTAX             GeneralizedTime
  -- as per 46.3 b) or c) of Rec. ITU-T X.680 | ISO/IEC 8824-1
  EQUALITY MATCHING RULE  generalizedTimeMatch
  ORDERING MATCHING RULE  generalizedTimeOrderingMatch
  SINGLE VALUE            TRUE
  NO USER MODIFICATION    TRUE
  USAGE                   directoryOperation
  ID                      id-oa-subschemaTimestamp }

creatorsName ATTRIBUTE ::= {
  WITH SYNTAX             DistinguishedName
  EQUALITY MATCHING RULE  distinguishedNameMatch
  SINGLE VALUE            TRUE
  NO USER MODIFICATION    TRUE
  USAGE                   directoryOperation
  LDAP-SYNTAX             dn.&id
  LDAP-NAME               {"creatorsName"}
  ID                      id-oa-creatorsName }

modifiersName ATTRIBUTE ::= {
  WITH SYNTAX             DistinguishedName
  EQUALITY MATCHING RULE  distinguishedNameMatch
  SINGLE VALUE            TRUE
  NO USER MODIFICATION    TRUE
  USAGE                   directoryOperation
  LDAP-SYNTAX             dn.&id
  LDAP-NAME               {"modifiersName"}
  ID                      id-oa-modifiersName }

subschemaSubentryList ATTRIBUTE ::= {
  WITH SYNTAX             DistinguishedName
  EQUALITY MATCHING RULE  distinguishedNameMatch
  SINGLE VALUE            TRUE
  NO USER MODIFICATION    TRUE
  USAGE                   directoryOperation
  LDAP-SYNTAX             dn.&id
  LDAP-NAME               {"subschemaSubentry"}
  ID                      id-oa-subschemaSubentryList }

accessControlSubentryList ATTRIBUTE ::= {
  WITH SYNTAX             DistinguishedName
  EQUALITY MATCHING RULE  distinguishedNameMatch
  NO USER MODIFICATION    TRUE
  USAGE                   directoryOperation
  ID                      id-oa-accessControlSubentryList }

collectiveAttributeSubentryList ATTRIBUTE ::= {
  WITH SYNTAX             DistinguishedName
  EQUALITY MATCHING RULE  distinguishedNameMatch
  NO USER MODIFICATION    TRUE
  USAGE                   directoryOperation
  ID                      id-oa-collectiveAttributeSubentryList }

contextDefaultSubentryList ATTRIBUTE ::= {
  WITH SYNTAX             DistinguishedName
  EQUALITY MATCHING RULE  distinguishedNameMatch
  NO USER MODIFICATION    TRUE
  USAGE                   directoryOperation
  ID                      id-oa-contextDefaultSubentryList }

serviceAdminSubentryList ATTRIBUTE ::= {
  WITH SYNTAX             DistinguishedName
  EQUALITY MATCHING RULE  distinguishedNameMatch
  NO USER MODIFICATION    TRUE
  USAGE                   directoryOperation
  ID                      id-oa-serviceAdminSubentryList }

pwdAdminSubentryList  ATTRIBUTE  ::=  {
  WITH SYNTAX             DistinguishedName
  EQUALITY MATCHING RULE  distinguishedNameMatch
  SINGLE VALUE            TRUE
  NO USER MODIFICATION    TRUE
  USAGE                   directoryOperation
  LDAP-SYNTAX             dn.&id
  LDAP-NAME               {"pwdAdminSubentryList"}
  ID                      id-oa-pwdAdminSubentryList }

hasSubordinates ATTRIBUTE ::= {
  WITH SYNTAX             BOOLEAN
  EQUALITY MATCHING RULE  booleanMatch
  SINGLE VALUE            TRUE
  NO USER MODIFICATION    TRUE
  USAGE                   directoryOperation
  ID                      id-oa-hasSubordinates }

accessControlSubentry OBJECT-CLASS ::= {
  KIND          auxiliary
  ID            id-sc-accessControlSubentry }

collectiveAttributeSubentry OBJECT-CLASS ::= {
  KIND          auxiliary
  ID            id-sc-collectiveAttributeSubentry }

collectiveExclusions ATTRIBUTE ::= {
  WITH SYNTAX             OBJECT IDENTIFIER
  EQUALITY MATCHING RULE  objectIdentifierMatch
  USAGE                   directoryOperation
  ID                      id-oa-collectiveExclusions }

contextAssertionSubentry OBJECT-CLASS ::= {
  KIND          auxiliary
  MUST CONTAIN  {contextAssertionDefaults}
  ID            id-sc-contextAssertionSubentry }

contextAssertionDefaults ATTRIBUTE ::= {
  WITH SYNTAX             TypeAndContextAssertion
  EQUALITY MATCHING RULE  objectIdentifierFirstComponentMatch
  USAGE                   directoryOperation
  ID                      id-oa-contextAssertionDefault }

serviceAdminSubentry OBJECT-CLASS ::= {
  KIND          auxiliary
  MUST CONTAIN  {searchRules}
  ID            id-sc-serviceAdminSubentry }

searchRules ATTRIBUTE ::= {
  WITH SYNTAX             SearchRuleDescription
  EQUALITY MATCHING RULE  integerFirstComponentMatch
  USAGE                   directoryOperation
  ID                      id-oa-searchRules }

SearchRuleDescription ::= SEQUENCE {
  COMPONENTS OF      SearchRule,
  name         [28]  SET SIZE (1..MAX) OF UnboundedDirectoryString OPTIONAL,
  description  [29]  UnboundedDirectoryString OPTIONAL,
  ... }

pwdAdminSubentry OBJECT-CLASS ::= {
  KIND           auxiliary
  MUST CONTAIN   { pwdAttribute }
  LDAP-NAME      {"pwdAdminSubentry"}
  ID             id-sc-pwdAdminSubentry }

pwdAttribute ATTRIBUTE ::= {
  WITH SYNTAX             ATTRIBUTE.&id
  EQUALITY MATCHING RULE  objectIdentifierMatch
  SINGLE VALUE            TRUE
  LDAP-SYNTAX             oid.&id
  LDAP-NAME               {"pwdAttribute"}
  ID                      id-at-pwdAttribute }

pwdHistory{ATTRIBUTE:passwordAttribute,MATCHING-RULE:historyMatch,OBJECT IDENTIFIER:id}
ATTRIBUTE ::= {
  WITH SYNTAX             PwdHistory{passwordAttribute}
  EQUALITY MATCHING RULE  historyMatch
  USAGE                   directoryOperation
  ID                      id}

PwdHistory{ATTRIBUTE:passwordAttribute} ::= SEQUENCE {
  time       GeneralizedTime,
  password   passwordAttribute.&Type,
  ...}

pwdRecentlyExpired{ATTRIBUTE:passwordAttribute,OBJECT IDENTIFIER:id} ATTRIBUTE ::= {
  WITH SYNTAX             passwordAttribute.&Type
  EQUALITY MATCHING RULE  passwordAttribute.&equality-match
  SINGLE VALUE            TRUE
  USAGE                   directoryOperation
  ID                      id}

pwdHistoryMatch{ATTRIBUTE:passwordAttribute,OBJECT IDENTIFIER:id}
MATCHING-RULE ::= {
  SYNTAX     passwordAttribute.&Type
  ID         id}


hierarchyLevel ATTRIBUTE ::= {
  WITH SYNTAX             HierarchyLevel
  EQUALITY MATCHING RULE  integerMatch
  ORDERING MATCHING RULE  integerOrderingMatch
  SINGLE VALUE            TRUE
  NO USER MODIFICATION    TRUE
  USAGE                   directoryOperation
  ID                      id-oa-hierarchyLevel }

HierarchyLevel ::= INTEGER

hierarchyBelow ATTRIBUTE ::= {
  WITH SYNTAX             HierarchyBelow
  EQUALITY MATCHING RULE  booleanMatch
  SINGLE VALUE            TRUE
  NO USER MODIFICATION    TRUE
  USAGE                   directoryOperation
  ID                      id-oa-hierarchyBelow }

HierarchyBelow ::= BOOLEAN

hierarchyParent ATTRIBUTE ::= {
  WITH SYNTAX             DistinguishedName
  EQUALITY MATCHING RULE  distinguishedNameMatch
  SINGLE VALUE            TRUE
  USAGE                   directoryOperation
  ID                      id-oa-hierarchyParent }

hierarchyTop ATTRIBUTE ::= {
  WITH SYNTAX             DistinguishedName
  EQUALITY MATCHING RULE  distinguishedNameMatch
  SINGLE VALUE            TRUE
  USAGE                   directoryOperation
  ID                      id-oa-hierarchyTop }

-- object identifier assignments

-- object classes

id-oc-top                              OBJECT IDENTIFIER ::= {id-oc 0}
id-oc-alias                            OBJECT IDENTIFIER ::= {id-oc 1}
id-oc-parent                           OBJECT IDENTIFIER ::= {id-oc 28}
id-oc-child                            OBJECT IDENTIFIER ::= {id-oc 29}

-- attributes

id-at-objectClass                      OBJECT IDENTIFIER ::= {id-at 0}
id-at-aliasedEntryName                 OBJECT IDENTIFIER ::= {id-at 1}
id-at-pwdAttribute                     OBJECT IDENTIFIER ::= {id-at 84}

-- matching rules

id-mr-objectIdentifierMatch            OBJECT IDENTIFIER ::= {id-mr 0}
id-mr-distinguishedNameMatch           OBJECT IDENTIFIER ::= {id-mr 1}

-- operational attributes

id-oa-excludeAllCollectiveAttributes   OBJECT IDENTIFIER ::= {id-oa 0}
id-oa-createTimestamp                  OBJECT IDENTIFIER ::= {id-oa 1}
id-oa-modifyTimestamp                  OBJECT IDENTIFIER ::= {id-oa 2}
id-oa-creatorsName                     OBJECT IDENTIFIER ::= {id-oa 3}
id-oa-modifiersName                    OBJECT IDENTIFIER ::= {id-oa 4}
id-oa-administrativeRole               OBJECT IDENTIFIER ::= {id-oa 5}
id-oa-subtreeSpecification             OBJECT IDENTIFIER ::= {id-oa 6}
id-oa-collectiveExclusions             OBJECT IDENTIFIER ::= {id-oa 7}
id-oa-subschemaTimestamp               OBJECT IDENTIFIER ::= {id-oa 8}
id-oa-hasSubordinates                  OBJECT IDENTIFIER ::= {id-oa 9}
id-oa-subschemaSubentryList            OBJECT IDENTIFIER ::= {id-oa 10}
id-oa-accessControlSubentryList        OBJECT IDENTIFIER ::= {id-oa 11}
id-oa-collectiveAttributeSubentryList  OBJECT IDENTIFIER ::= {id-oa 12}
id-oa-contextDefaultSubentryList       OBJECT IDENTIFIER ::= {id-oa 13}
id-oa-contextAssertionDefault          OBJECT IDENTIFIER ::= {id-oa 14}
id-oa-serviceAdminSubentryList         OBJECT IDENTIFIER ::= {id-oa 15}
id-oa-searchRules                      OBJECT IDENTIFIER ::= {id-oa 16}
id-oa-hierarchyLevel                   OBJECT IDENTIFIER ::= {id-oa 17}
id-oa-hierarchyBelow                   OBJECT IDENTIFIER ::= {id-oa 18}
id-oa-hierarchyParent                  OBJECT IDENTIFIER ::= {id-oa 19}
id-oa-hierarchyTop                     OBJECT IDENTIFIER ::= {id-oa 20}
id-oa-pwdAdminSubentryList             OBJECT IDENTIFIER ::= {id-oa 21}
-- id-oa-pwdStartTime                  OBJECT IDENTIFIER ::= {id-oa 22} X.520|Part6
-- id-oa-pwdExpiryTime                 OBJECT IDENTIFIER ::= {id-oa 23} X.520|Part6
-- id-oa-pwdEndTime                    OBJECT IDENTIFIER ::= {id-oa 24} X.520|Part6
-- id-oa-pwdFails                      OBJECT IDENTIFIER ::= {id-oa 25} X.520|Part6
-- id-oa-pwdFailureTime                OBJECT IDENTIFIER ::= {id-oa 26} X.520|Part6
-- id-oa-pwdGracesUsed                 OBJECT IDENTIFIER ::= {id-oa 27} X.520|Part6
-- id-oa-userPwdHistory                OBJECT IDENTIFIER ::= {id-oa 28} X.520|Part6
-- id-oa-userPwdRecentlyExpired        OBJECT IDENTIFIER ::= {id-oa 29} X.520|Part6
-- id-oa-pwdModifyEntryAllowed         OBJECT IDENTIFIER ::= {id-oa 30} X.520|Part6
-- id-oa-pwdChangeAllowed              OBJECT IDENTIFIER ::= {id-oa 31} X.520|Part6
-- id-oa-pwdMaxAge                     OBJECT IDENTIFIER ::= {id-oa 32} X.520|Part6
-- id-oa-pwdExpiryAge                  OBJECT IDENTIFIER ::= {id-oa 33} X.520|Part6
-- id-oa-pwdMinLength                  OBJECT IDENTIFIER ::= {id-oa 34} X.520|Part6
-- id-oa-pwdVocabulary                 OBJECT IDENTIFIER ::= {id-oa 35} X.520|Part6
-- id-oa-pwdAlphabet                   OBJECT IDENTIFIER ::= {id-oa 36} X.520|Part6
-- id-oa-pwdDictionaries               OBJECT IDENTIFIER ::= {id-oa 37} X.520|Part6
-- id-oa-pwdExpiryWarning              OBJECT IDENTIFIER ::= {id-oa 38} X.520|Part6
-- id-oa-pwdGraces                     OBJECT IDENTIFIER ::= {id-oa 39} X.520|Part6
-- id-oa-pwdFailureDuration            OBJECT IDENTIFIER ::= {id-oa 40} X.520|Part6
-- id-oa-pwdLockoutDuration            OBJECT IDENTIFIER ::= {id-oa 41} X.520|Part6
-- id-oa-pwdMaxFailures                OBJECT IDENTIFIER ::= {id-oa 42} X.520|Part6
-- id-oa-pwdMaxTimeInHistory           OBJECT IDENTIFIER ::= {id-oa 43} X.520|Part6
-- id-oa-pwdMinTimeInHistory           OBJECT IDENTIFIER ::= {id-oa 44} X.520|Part6
-- id-oa-pwdHistorySlots               OBJECT IDENTIFIER ::= {id-oa 45} X.520|Part6
-- id-oa-pwdRecentlyExpiredDuration    OBJECT IDENTIFIER ::= {id-oa 46} X.520|Part6
-- id-oa-pwdEncAlg                     OBJECT IDENTIFIER ::= {id-oa 47} X.520|Part6
id-oa-allAttributeTypes                OBJECT IDENTIFIER ::= {id-oa 48}

-- subentry classes

id-sc-subentry                         OBJECT IDENTIFIER ::= {id-sc 0}
id-sc-accessControlSubentry            OBJECT IDENTIFIER ::= {id-sc 1}
id-sc-collectiveAttributeSubentry      OBJECT IDENTIFIER ::= {id-sc 2}
id-sc-contextAssertionSubentry         OBJECT IDENTIFIER ::= {id-sc 3}
id-sc-serviceAdminSubentry             OBJECT IDENTIFIER ::= {id-sc 4}
id-sc-pwdAdminSubentry                 OBJECT IDENTIFIER ::= {id-sc 5}

--  Name forms

id-nf-subentryNameForm                 OBJECT IDENTIFIER ::= {id-nf 16}

-- administrative roles

id-ar-autonomousArea                   OBJECT IDENTIFIER ::= {id-ar 1}
id-ar-accessControlSpecificArea        OBJECT IDENTIFIER ::= {id-ar 2}
id-ar-accessControlInnerArea           OBJECT IDENTIFIER ::= {id-ar 3}
id-ar-subschemaAdminSpecificArea       OBJECT IDENTIFIER ::= {id-ar 4}
id-ar-collectiveAttributeSpecificArea  OBJECT IDENTIFIER ::= {id-ar 5}
id-ar-collectiveAttributeInnerArea     OBJECT IDENTIFIER ::= {id-ar 6}
id-ar-contextDefaultSpecificArea       OBJECT IDENTIFIER ::= {id-ar 7}
id-ar-serviceSpecificArea              OBJECT IDENTIFIER ::= {id-ar 8}
id-ar-pwdAdminSpecificArea             OBJECT IDENTIFIER ::= {id-ar 9}

END -- InformationFramework

LdapSystemSchema
  {joint-iso-itu-t ds(5) module(1) ldapSystemSchema(38) 9}
DEFINITIONS ::=
BEGIN

-- EXPORTS All
/*
The types and values defined in this module are exported for use in the other ASN.1
modules contained within the Directory Specifications, and for the use of other
applications which will use them to access Directory services. Other applications
may use them for their own purposes, but this will not constrain extensions and
modifications needed to maintain or improve the Directory service.
*/
IMPORTS

  -- from Rec. ITU-T X.501 | ISO/IEC 9594-2

  id-lat, id-oat
    FROM UsefulDefinitions
      {joint-iso-itu-t ds(5) module(1) usefulDefinitions(0) 9} WITH SUCCESSORS

  ATTRIBUTE, DistinguishedName, SYNTAX-NAME
    FROM InformationFramework
      {joint-iso-itu-t ds(5) module(1) informationFramework(1) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.511 | ISO/IEC 9594-3

  ub-saslMechanism
    FROM  DirectoryAbstractService
      {joint-iso-itu-t ds(5) module(1) directoryAbstractService(2) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.520 | ISO/IEC 9594-6

  directoryString, DirectoryString{}, dn, ia5String, integer, ldapSyntaxDescription,
  objectIdentifierFirstComponentMatch, oid, UnboundedDirectoryString
    FROM  SelectedAttributeTypes
      {joint-iso-itu-t ds(5) module(1) selectedAttributeTypes(5) 9} WITH SUCCESSORS ;

namingContexts ATTRIBUTE ::= {
  WITH SYNTAX              DistinguishedName
  USAGE                    dSAOperation
  LDAP-SYNTAX              dn.&id
  LDAP-NAME                {"namingContexts"}
  ID                       id-lat-namingContexts }

altServer ATTRIBUTE ::= {
  WITH SYNTAX              IA5String
  USAGE                    dSAOperation
  LDAP-SYNTAX              ia5String.&id
  LDAP-NAME                {"altServer"}
  ID                       id-lat-altServer }

supportedExtension ATTRIBUTE ::= {
  WITH SYNTAX              OBJECT IDENTIFIER
  USAGE                    dSAOperation
  LDAP-SYNTAX              oid.&id
  LDAP-NAME                {"supportedExtension"}
  ID                       id-lat-supportedExtension }

supportedControl ATTRIBUTE ::= {
  WITH SYNTAX              OBJECT IDENTIFIER
  USAGE                    dSAOperation
  LDAP-SYNTAX              oid.&id
  LDAP-NAME                {"supportedControl"}
  ID                       id-lat-supportedControl }

supportedSASLMechanisms ATTRIBUTE ::= {
  WITH SYNTAX              DirectoryString{ub-saslMechanism}
  USAGE                    dSAOperation
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"supportedSASLMechanisms"}
  ID                       id-lat-supportedSASLMechanisms }

supportedLDAPVersion ATTRIBUTE ::= {
  WITH SYNTAX              INTEGER
  USAGE                    dSAOperation
  LDAP-SYNTAX              integer.&id
  LDAP-NAME                {"supportedLDAPVersion"}
  ID                       id-lat-supportedLDAPVersion }

supportedFeatures ATTRIBUTE ::= {
  WITH SYNTAX              OBJECT IDENTIFIER
  USAGE                    dSAOperation
  LDAP-SYNTAX              oid.&id
  LDAP-NAME                {"supportedFeatures"}
  ID                       id-oat-supportedFeatures }

ldapSyntaxes ATTRIBUTE ::= {
  WITH SYNTAX              LdapSyntaxDescription
  EQUALITY MATCHING RULE   objectIdentifierFirstComponentMatch
  USAGE                    directoryOperation
  LDAP-SYNTAX              ldapSyntaxDescription.&id
  LDAP-NAME                {"ldapSyntax"}
  ID                       id-soa-ldapSyntaxes }

LdapSyntaxDescription ::= SEQUENCE {
  identifier               SYNTAX-NAME.&id,
  description              UnboundedDirectoryString OPTIONAL,
  ... }

-- Attributes

id-lat-namingContexts                     OBJECT IDENTIFIER ::= {id-lat 5}
id-lat-altServer                          OBJECT IDENTIFIER ::= {id-lat 6}
id-lat-supportedExtension                 OBJECT IDENTIFIER ::= {id-lat 7}
id-lat-supportedControl                   OBJECT IDENTIFIER ::= {id-lat 13}
id-lat-supportedSASLMechanisms            OBJECT IDENTIFIER ::= {id-lat 14}
id-lat-supportedLDAPVersion               OBJECT IDENTIFIER ::= {id-lat 15}
id-soa-ldapSyntaxes                       OBJECT IDENTIFIER ::= {id-lat 16}

id-oat-supportedFeatures                  OBJECT IDENTIFIER ::= {id-oat 5}

END -- LdapSystemSchema

-- ASN module extracted from ITU-T X.501 (10/2019)

OperationalBindingManagement
  {joint-iso-itu-t ds(5) module(1) opBindingManagement(18) 9}
DEFINITIONS ::=
BEGIN

-- EXPORTS All
/*
The types and values defined in this module are exported for use in the other ASN.1
modules contained within these Directory Specifications, and for the use of other
applications which will use them to access Directory services. Other applications may
use them for their own purposes, but this will not constrain extensions and
modifications needed to maintain or improve the Directory service.
*/
IMPORTS

  -- from Rec. ITU-T X.501 | ISO/IEC 9594-2

  OPTIONALLY-PROTECTED-SEQ
    FROM EnhancedSecurity
      {joint-iso-itu-t ds(5) modules(1) enhancedSecurity(28) 9} WITH SUCCESSORS

  hierarchicalOperationalBinding, nonSpecificHierarchicalOperationalBinding
    FROM HierarchicalOperationalBindings
      {joint-iso-itu-t ds(5) module(1) hierarchicalOperationalBindings(20) 9}
       WITH SUCCESSORS

-- from Rec. ITU-T X.511 | ISO/IEC 9594-3

  CommonResultsSeq, securityError, SecurityParameters
    FROM DirectoryAbstractService
      {joint-iso-itu-t ds(5) module(1) directoryAbstractService(2) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.518 | ISO/IEC 9594-4

  AccessPoint, dSABind
    FROM DistributedOperations
      {joint-iso-itu-t ds(5) module(1) distributedOperations(3) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.519 | ISO/IEC 9594-5

  id-err-operationalBindingError, id-op-establishOperationalBinding,
  id-op-modifyOperationalBinding, id-op-terminateOperationalBinding,
  OPERATION, ERROR
    FROM CommonProtocolSpecification
      {joint-iso-itu-t ds(5) module(1) commonProtocolSpecification(35) 9} WITH SUCCESSORS

  APPLICATION-CONTEXT
    FROM DirectoryOSIProtocols
      {joint-iso-itu-t ds(5) module(1) directoryOSIProtocols(37) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.525 | ISO/IEC 9594-9

  shadowOperationalBinding
    FROM DirectoryShadowAbstractService
      {joint-iso-itu-t ds(5) module(1) directoryShadowAbstractService(15) 9}
       WITH SUCCESSORS ;

-- bind and unbind

dSAOperationalBindingManagementBind OPERATION ::= dSABind

OPERATIONAL-BINDING ::= CLASS {
  &Agreement           ,
  &Cooperation         OP-BINDING-COOP,
  &both                OP-BIND-ROLE OPTIONAL,
  &roleA               OP-BIND-ROLE OPTIONAL,
  &roleB               OP-BIND-ROLE OPTIONAL,
  &id                  OBJECT IDENTIFIER UNIQUE }
WITH SYNTAX {
  AGREEMENT            &Agreement
  APPLICATION CONTEXTS &Cooperation
  [SYMMETRIC           &both]
  [ASYMMETRIC
    [ROLE-A              &roleA]
    [ROLE-B              &roleB]]
  ID                   &id }

OP-BINDING-COOP ::= CLASS {
  &applContext  APPLICATION-CONTEXT,
  &Operations   OPERATION OPTIONAL }
WITH SYNTAX {
                &applContext
  [APPLIES TO   &Operations] }

OP-BIND-ROLE ::= CLASS {
  &establish                BOOLEAN DEFAULT FALSE,
  &EstablishParam,
  &modify                   BOOLEAN DEFAULT FALSE,
  &ModifyParam              OPTIONAL,
  &terminate                BOOLEAN DEFAULT FALSE,
  &TerminateParam           OPTIONAL }
WITH SYNTAX {
  [ESTABLISHMENT-INITIATOR  &establish]
  ESTABLISHMENT-PARAMETER   &EstablishParam
  [MODIFICATION-INITIATOR   &modify]
  [MODIFICATION-PARAMETER   &ModifyParam]
  [TERMINATION-INITIATOR    &terminate]
  [TERMINATION-PARAMETER    &TerminateParam] }

-- operations, arguments and results

establishOperationalBinding OPERATION ::= {
  ARGUMENT   EstablishOperationalBindingArgument
  RESULT     EstablishOperationalBindingResult
  ERRORS     {operationalBindingError | securityError}
  CODE       id-op-establishOperationalBinding }

EstablishOperationalBindingArgument ::=
  OPTIONALLY-PROTECTED-SEQ { EstablishOperationalBindingArgumentData }

EstablishOperationalBindingArgumentData ::= SEQUENCE {
  bindingType        [0]  OPERATIONAL-BINDING.&id({OpBindingSet}),
  bindingID          [1]  OperationalBindingID OPTIONAL,
  accessPoint        [2]  AccessPoint,
               -- symmetric, Role A initiates, or Role B initiates
  initiator               CHOICE {
    symmetric          [3]  OPERATIONAL-BINDING.&both.&EstablishParam
                            ({OpBindingSet}{@bindingType}),
    roleA-initiates    [4]  OPERATIONAL-BINDING.&roleA.&EstablishParam
                            ({OpBindingSet}{@bindingType}),
    roleB-initiates    [5]  OPERATIONAL-BINDING.&roleB.&EstablishParam
                              ({OpBindingSet}{@bindingType})},
  agreement          [6]  OPERATIONAL-BINDING.&Agreement
                            ({OpBindingSet}{@bindingType}),
  valid              [7]  Validity DEFAULT {},
  securityParameters [8]  SecurityParameters OPTIONAL,
  ... }

OpBindingSet OPERATIONAL-BINDING ::= {
  shadowOperationalBinding |
  hierarchicalOperationalBinding |
  nonSpecificHierarchicalOperationalBinding }

OperationalBindingID ::= SEQUENCE {
  identifier  INTEGER,
  version     INTEGER,
  ... }

Validity ::= SEQUENCE {
  validFrom            [0]  CHOICE {
    now                  [0]  NULL,
    time                 [1]  Time,
    ...} DEFAULT now:NULL,
  validUntil           [1]  CHOICE {
    explicitTermination  [0]  NULL,
    time                 [1]  Time,
    ... } DEFAULT explicitTermination:NULL,
  ... }

Time ::= CHOICE {
  utcTime          UTCTime,
  generalizedTime  GeneralizedTime,
  ... }

EstablishOperationalBindingResult ::= OPTIONALLY-PROTECTED-SEQ { EstablishOperationalBindingResultData }

EstablishOperationalBindingResultData ::= SEQUENCE {
  bindingType   [0]  OPERATIONAL-BINDING.&id({OpBindingSet}),
  bindingID     [1]  OperationalBindingID OPTIONAL,
  accessPoint   [2]  AccessPoint,
  -- symmetric, Role A replies, or Role B replies
  initiator          CHOICE {
    symmetric     [3]  OPERATIONAL-BINDING.&both.&EstablishParam
                         ({OpBindingSet}{@bindingType}),
    roleA-replies [4]  OPERATIONAL-BINDING.&roleA.&EstablishParam
                         ({OpBindingSet}{@bindingType}),
    roleB-replies [5]  OPERATIONAL-BINDING.&roleB.&EstablishParam
                         ({OpBindingSet}{@bindingType})},
  ...,
  ...,
  COMPONENTS OF      CommonResultsSeq }

modifyOperationalBinding OPERATION ::= {
  ARGUMENT  ModifyOperationalBindingArgument
  RESULT    ModifyOperationalBindingResult
  ERRORS    {operationalBindingError | securityError}
  CODE      id-op-modifyOperationalBinding }

ModifyOperationalBindingArgument ::=
  OPTIONALLY-PROTECTED-SEQ { ModifyOperationalBindingArgumentData }

ModifyOperationalBindingArgumentData ::= SEQUENCE {
  bindingType       [0]  OPERATIONAL-BINDING.&id({OpBindingSet}),
  bindingID         [1]  OperationalBindingID,
  accessPoint       [2]  AccessPoint OPTIONAL,
  -- symmetric, Role A initiates, or Role B initiates
  initiator              CHOICE {
    symmetric         [3]  OPERATIONAL-BINDING.&both.&ModifyParam
                          ({OpBindingSet}{@bindingType}),
    roleA-initiates   [4]  OPERATIONAL-BINDING.&roleA.&ModifyParam
                          ({OpBindingSet}{@bindingType}),
    roleB-initiates   [5]  OPERATIONAL-BINDING.&roleB.&ModifyParam
                          ({OpBindingSet}{@bindingType})} OPTIONAL,
  newBindingID      [6]  OperationalBindingID,
  newAgreement      [7]  OPERATIONAL-BINDING.&Agreement
                       ({OpBindingSet}{@bindingType}) OPTIONAL,
  valid               [8]  ModifiedValidity OPTIONAL,
  securityParameters  [9]  SecurityParameters OPTIONAL,
  ...}

ModifiedValidity ::= SEQUENCE {
  validFrom            [0]  CHOICE {
    now                  [0]  NULL,
    time                 [1]  Time,
    ...} DEFAULT now:NULL,
  validUntil           [1]  CHOICE {
    explicitTermination  [0]  NULL,
    time                 [1]  Time,
    unchanged            [2]  NULL,
    ... } DEFAULT unchanged:NULL,
  ... }

ModifyOperationalBindingResult ::= CHOICE {
  null            NULL,
  protected  [1]  OPTIONALLY-PROTECTED-SEQ{ ModifyOperationalBindingResultData },
  ... }

ModifyOperationalBindingResultData ::= SEQUENCE {
    newBindingID    OperationalBindingID,
    bindingType     OPERATIONAL-BINDING.&id({OpBindingSet}),
    newAgreement    OPERATIONAL-BINDING.&Agreement ({OpBindingSet}{@.bindingType}),
    valid           Validity OPTIONAL,
    ...,
    ...,
    COMPONENTS OF   CommonResultsSeq
    }

terminateOperationalBinding OPERATION ::= {
  ARGUMENT  TerminateOperationalBindingArgument
  RESULT    TerminateOperationalBindingResult
  ERRORS    {operationalBindingError | securityError}
  CODE      id-op-terminateOperationalBinding }

TerminateOperationalBindingArgument ::=
  OPTIONALLY-PROTECTED-SEQ { TerminateOperationalBindingArgumentData }

TerminateOperationalBindingArgumentData ::= SEQUENCE {
  bindingType         [0]  OPERATIONAL-BINDING.&id({OpBindingSet}),
  bindingID           [1]  OperationalBindingID,
  -- symmetric, Role A initiates, or Role B initiates
  initiator                CHOICE {
    symmetric           [2]  OPERATIONAL-BINDING.&both.&TerminateParam
                            ({OpBindingSet}{@bindingType}),
    roleA-initiates     [3]  OPERATIONAL-BINDING.&roleA.&TerminateParam
                            ({OpBindingSet}{@bindingType}),
    roleB-initiates     [4]  OPERATIONAL-BINDING.&roleB.&TerminateParam
                            ({OpBindingSet}{@bindingType})} OPTIONAL,
  terminateAt         [5]  Time OPTIONAL,
  securityParameters  [6]  SecurityParameters OPTIONAL,
  ...}

TerminateOperationalBindingResult ::= CHOICE {
  null            NULL,
  protected  [1]  OPTIONALLY-PROTECTED-SEQ{ TerminateOperationalBindingResultData },
  ... }

TerminateOperationalBindingResultData ::= SEQUENCE {
  bindingID       OperationalBindingID,
  bindingType     OPERATIONAL-BINDING.&id({OpBindingSet}),
  terminateAt     GeneralizedTime OPTIONAL,
  ...,
  ...,
  COMPONENTS OF   CommonResultsSeq }

-- errors and parameters

operationalBindingError ERROR ::= {
  PARAMETER OPTIONALLY-PROTECTED-SEQ  {OpBindingErrorParam}
  CODE      id-err-operationalBindingError }

OpBindingErrorParam ::= SEQUENCE {
  problem            [0]  ENUMERATED {
    invalidID              (0),
    duplicateID            (1),
    unsupportedBindingType (2),
    notAllowedForRole      (3),
    parametersMissing      (4),
    roleAssignment         (5),
    invalidStartTime       (6),
    invalidEndTime         (7),
    invalidAgreement       (8),
    currentlyNotDecidable  (9),
    modificationNotAllowed (10),
    invalidBindingType     (11),
    invalidNewID           (12),
    ... },
  bindingType        [1]  OPERATIONAL-BINDING.&id({OpBindingSet}) OPTIONAL,
  agreementProposal  [2]  OPERATIONAL-BINDING.&Agreement
                          ({OpBindingSet}{@bindingType}) OPTIONAL,
  retryAt            [3]  Time OPTIONAL,
  ...,
  ...,
  COMPONENTS OF           CommonResultsSeq }

END -- OperationalBindingManagement

SchemaAdministration
  {joint-iso-itu-t ds(5) module(1) schemaAdministration(23) 9}
DEFINITIONS ::=
BEGIN

-- EXPORTS All
/*
The types and values defined in this module are exported for use in the other ASN.1
modules contained within the Directory Specifications, and for the use of other
applications which will use them to access Directory services. Other applications may
use them for their own purposes, but this will not constrain extensions and
modifications needed to maintain or improve the Directory service.
*/
IMPORTS

  -- from Rec. ITU-T X.501 | ISO/IEC 9594-2

  id-soa, id-soc
    FROM UsefulDefinitions
      {joint-iso-itu-t ds(5) module(1) usefulDefinitions(0) 9} WITH SUCCESSORS

  ATTRIBUTE, AttributeUsage, CONTEXT, DITContentRule, DITStructureRule, MATCHING-RULE,
  NAME-FORM, OBJECT-CLASS, ObjectClassKind, objectIdentifierMatch, SYNTAX-NAME
    FROM InformationFramework
      {joint-iso-itu-t ds(5) module(1) informationFramework(1) 9} WITH SUCCESSORS

  ldapSyntaxes
    FROM LdapSystemSchema
      {joint-iso-itu-t ds(5) module(1) ldapSystemSchema(38) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.520 | ISO/IEC 9594-6

  attributeTypeDescription, dITContentRuleDescription, dITStructureRuleDescription,
  integer, integerFirstComponentMatch, integerMatch, matchingRuleDescription,
  matchingRuleUseDescription, nameFormDescription, objectClassDescription,
  objectIdentifierFirstComponentMatch, oid, UnboundedDirectoryString
    FROM SelectedAttributeTypes
      {joint-iso-itu-t ds(5) module(1) selectedAttributeTypes(5) 9} WITH SUCCESSORS ;

subschema OBJECT-CLASS ::= {
  KIND        auxiliary
  MAY CONTAIN { dITStructureRules |
                nameForms |
                dITContentRules |
                objectClasses |
                attributeTypes |
                friends |
                contextTypes |
                dITContextUse |
                matchingRules |
                matchingRuleUse |
                ldapSyntaxes }
  LDAP-NAME   {"subschema"}
  ID          id-soc-subschema }

dITStructureRules ATTRIBUTE ::= {
  WITH SYNTAX              DITStructureRuleDescription
  EQUALITY MATCHING RULE   integerFirstComponentMatch
  USAGE                    directoryOperation
  LDAP-SYNTAX              dITStructureRuleDescription.&id
  LDAP-NAME                {"dITStructureRules"}
  ID                       id-soa-dITStructureRule }

DITStructureRuleDescription ::= SEQUENCE {
  COMPONENTS OF DITStructureRule,
  name         [1]  SET SIZE (1..MAX) OF UnboundedDirectoryString OPTIONAL,
  description       UnboundedDirectoryString OPTIONAL,
  obsolete          BOOLEAN DEFAULT FALSE,
  ... }

dITContentRules ATTRIBUTE ::= {
  WITH SYNTAX              DITContentRuleDescription
  EQUALITY MATCHING RULE   objectIdentifierFirstComponentMatch
  USAGE                    directoryOperation
  LDAP-SYNTAX              dITContentRuleDescription.&id
  LDAP-NAME                {"dITContentRules"}
  ID                       id-soa-dITContentRules }

DITContentRuleDescription ::= SEQUENCE {
  COMPONENTS OF DITContentRule,
  name         [4]  SET SIZE (1..MAX) OF UnboundedDirectoryString OPTIONAL,
  description       UnboundedDirectoryString OPTIONAL,
  obsolete          BOOLEAN DEFAULT FALSE,
  ... }

matchingRules ATTRIBUTE ::= {
  WITH SYNTAX              MatchingRuleDescription
  EQUALITY MATCHING RULE   objectIdentifierFirstComponentMatch
  USAGE                    directoryOperation
  LDAP-SYNTAX              matchingRuleDescription.&id
  LDAP-NAME                {"matchingRules"}
  ID                       id-soa-matchingRules }

MatchingRuleDescription ::= SEQUENCE {
  identifier        MATCHING-RULE.&id,
  name              SET SIZE (1..MAX) OF UnboundedDirectoryString OPTIONAL,
  description       UnboundedDirectoryString OPTIONAL,
  obsolete          BOOLEAN DEFAULT FALSE,
  information  [0]  UnboundedDirectoryString OPTIONAL,
                -- describes the ASN.1 syntax
  ... }

attributeTypes ATTRIBUTE ::= {
  WITH SYNTAX              AttributeTypeDescription
  EQUALITY MATCHING RULE   objectIdentifierFirstComponentMatch
  USAGE                    directoryOperation
  LDAP-SYNTAX              attributeTypeDescription.&id
  LDAP-NAME                {"attributeTypes"}
  ID                       id-soa-attributeTypes }

AttributeTypeDescription ::= SEQUENCE {
  identifier        ATTRIBUTE.&id,
  name              SET SIZE (1..MAX) OF UnboundedDirectoryString OPTIONAL,
  description       UnboundedDirectoryString OPTIONAL,
  obsolete          BOOLEAN DEFAULT FALSE,
  information  [0]  AttributeTypeInformation,
  ... }

AttributeTypeInformation ::= SEQUENCE {
  derivation       [0]  ATTRIBUTE.&id             OPTIONAL,
  equalityMatch    [1]  MATCHING-RULE.&id         OPTIONAL,
  orderingMatch    [2]  MATCHING-RULE.&id         OPTIONAL,
  substringsMatch  [3]  MATCHING-RULE.&id         OPTIONAL,
  attributeSyntax  [4]  UnboundedDirectoryString  OPTIONAL,
  multi-valued     [5]  BOOLEAN                   DEFAULT TRUE,
  collective       [6]  BOOLEAN                   DEFAULT FALSE,
  userModifiable   [7]  BOOLEAN                   DEFAULT TRUE,
  application           AttributeUsage            DEFAULT userApplications,
  ... }

objectClasses ATTRIBUTE ::= {
  WITH SYNTAX              ObjectClassDescription
  EQUALITY MATCHING RULE   objectIdentifierFirstComponentMatch
  USAGE                    directoryOperation
  LDAP-SYNTAX              objectClassDescription.&id
  LDAP-NAME                {"objectClasses"}
  ID                       id-soa-objectClasses }

ObjectClassDescription ::= SEQUENCE {
  identifier        OBJECT-CLASS.&id,
  name              SET SIZE (1..MAX) OF UnboundedDirectoryString OPTIONAL,
  description       UnboundedDirectoryString                      OPTIONAL,
  obsolete          BOOLEAN                                       DEFAULT FALSE,
  information  [0]  ObjectClassInformation,
  ... }

ObjectClassInformation ::= SEQUENCE {
  subclassOf        SET SIZE (1..MAX) OF OBJECT-CLASS.&id OPTIONAL,
  kind              ObjectClassKind                       DEFAULT structural,
  mandatories  [3]  SET SIZE (1..MAX) OF ATTRIBUTE.&id    OPTIONAL,
  optionals    [4]  SET SIZE (1..MAX) OF ATTRIBUTE.&id    OPTIONAL,
  ... }

nameForms ATTRIBUTE ::= {
  WITH SYNTAX              NameFormDescription
  EQUALITY MATCHING RULE   objectIdentifierFirstComponentMatch
  USAGE                    directoryOperation
  LDAP-SYNTAX              nameFormDescription.&id
  LDAP-NAME                {"nameForms"}
  ID                       id-soa-nameForms }

NameFormDescription ::= SEQUENCE {
  identifier        NAME-FORM.&id,
  name              SET SIZE (1..MAX) OF UnboundedDirectoryString OPTIONAL,
  description       UnboundedDirectoryString                      OPTIONAL,
  obsolete          BOOLEAN                                       DEFAULT FALSE,
  information  [0]  NameFormInformation,
  ... }

NameFormInformation ::= SEQUENCE {
  subordinate        OBJECT-CLASS.&id,
  namingMandatories  SET OF ATTRIBUTE.&id,
  namingOptionals    SET SIZE (1..MAX) OF ATTRIBUTE.&id OPTIONAL,
  ... }

matchingRuleUse ATTRIBUTE ::= {
  WITH SYNTAX              MatchingRuleUseDescription
  EQUALITY MATCHING RULE   objectIdentifierFirstComponentMatch
  USAGE                    directoryOperation
  LDAP-SYNTAX              matchingRuleUseDescription.&id
  LDAP-NAME                {"matchingRuleUse"}
  ID                       id-soa-matchingRuleUse }

MatchingRuleUseDescription ::= SEQUENCE {
  identifier        MATCHING-RULE.&id,
  name              SET SIZE (1..MAX) OF UnboundedDirectoryString OPTIONAL,
  description       UnboundedDirectoryString                      OPTIONAL,
  obsolete          BOOLEAN                                       DEFAULT FALSE,
  information  [0]  SET OF ATTRIBUTE.&id,
  ... }

structuralObjectClass ATTRIBUTE ::= {
  WITH SYNTAX             OBJECT IDENTIFIER
  EQUALITY MATCHING RULE  objectIdentifierMatch
  SINGLE VALUE            TRUE
  NO USER MODIFICATION    TRUE
  USAGE                   directoryOperation
  LDAP-SYNTAX             oid.&id
  LDAP-NAME               {"structuralObjectClass"}
  ID                      id-soa-structuralObjectClass }

governingStructureRule ATTRIBUTE ::= {
  WITH SYNTAX             INTEGER
  EQUALITY MATCHING RULE  integerMatch
  SINGLE VALUE            TRUE
  NO USER MODIFICATION    TRUE
  USAGE                   directoryOperation
  LDAP-SYNTAX             integer.&id
  LDAP-NAME               {"governingStructureRule"}
  ID                      id-soa-governingStructureRule }

contextTypes ATTRIBUTE ::= {
  WITH SYNTAX             ContextDescription
  EQUALITY MATCHING RULE  objectIdentifierFirstComponentMatch
  USAGE                   directoryOperation
  ID                      id-soa-contextTypes }

ContextDescription ::= SEQUENCE {
  identifier        CONTEXT.&id,
  name              SET SIZE (1..MAX) OF UnboundedDirectoryString OPTIONAL,
  description       UnboundedDirectoryString                      OPTIONAL,
  obsolete          BOOLEAN                                       DEFAULT FALSE,
  information  [0]  ContextInformation,
  ... }

ContextInformation ::= SEQUENCE {
  syntax           UnboundedDirectoryString,
  assertionSyntax  UnboundedDirectoryString OPTIONAL,
  ... }

dITContextUse ATTRIBUTE ::= {
  WITH SYNTAX             DITContextUseDescription
  EQUALITY MATCHING RULE  objectIdentifierFirstComponentMatch
  USAGE                   directoryOperation
  ID                      id-soa-dITContextUse }

DITContextUseDescription ::= SEQUENCE {
  identifier        ATTRIBUTE.&id,
  name              SET SIZE (1..MAX) OF UnboundedDirectoryString OPTIONAL,
  description       UnboundedDirectoryString OPTIONAL,
  obsolete          BOOLEAN DEFAULT FALSE,
  information  [0]  DITContextUseInformation,
  ... }

DITContextUseInformation ::= SEQUENCE {
  mandatoryContexts  [1]  SET SIZE (1..MAX) OF CONTEXT.&id OPTIONAL,
  optionalContexts   [2]  SET SIZE (1..MAX) OF CONTEXT.&id OPTIONAL,
  ... }

friends ATTRIBUTE ::= {
  WITH SYNTAX             FriendsDescription
  EQUALITY MATCHING RULE  objectIdentifierFirstComponentMatch
  USAGE                   directoryOperation
  ID                      id-soa-friends }

FriendsDescription ::= SEQUENCE {
  anchor            ATTRIBUTE.&id,
  name              SET SIZE (1..MAX) OF UnboundedDirectoryString OPTIONAL,
  description       UnboundedDirectoryString OPTIONAL,
  obsolete          BOOLEAN DEFAULT FALSE,
  friends      [0]  SET SIZE (1..MAX) OF ATTRIBUTE.&id,
  ... }

-- object identifier assignments

-- schema object classes

id-soc-subschema OBJECT IDENTIFIER              ::= {id-soc 1}

-- schema operational attributes

id-soa-dITStructureRule       OBJECT IDENTIFIER ::= {id-soa 1}
id-soa-dITContentRules        OBJECT IDENTIFIER ::= {id-soa 2}
id-soa-matchingRules          OBJECT IDENTIFIER ::= {id-soa 4}
id-soa-attributeTypes         OBJECT IDENTIFIER ::= {id-soa 5}
id-soa-objectClasses          OBJECT IDENTIFIER ::= {id-soa 6}
id-soa-nameForms              OBJECT IDENTIFIER ::= {id-soa 7}
id-soa-matchingRuleUse        OBJECT IDENTIFIER ::= {id-soa 8}
id-soa-structuralObjectClass  OBJECT IDENTIFIER ::= {id-soa 9}
id-soa-governingStructureRule OBJECT IDENTIFIER ::= {id-soa 10}
id-soa-contextTypes           OBJECT IDENTIFIER ::= {id-soa 11}
id-soa-dITContextUse          OBJECT IDENTIFIER ::= {id-soa 12}
id-soa-friends                OBJECT IDENTIFIER ::= {id-soa 13}


END -- SchemaAdministration

ServiceAdministration
  {joint-iso-itu-t ds(5) module(1) serviceAdministration(33) 9}
DEFINITIONS ::=
BEGIN

-- EXPORTS All
/*
The types and values defined in this module are exported for use in the other ASN.1
modules contained within these Directory Specifications, and for the use of other
applications which will use them to access Directory services. Other applications may
use them for their own purposes, but this will not constrain extensions and
modifications needed to maintain or improve the Directory service.
*/
IMPORTS

  -- from Rec. ITU-T X.501 | ISO/IEC 9594-2

  ATTRIBUTE, AttributeType, CONTEXT, MATCHING-RULE, OBJECT-CLASS,
  SupportedAttributes, SupportedContexts
    FROM InformationFramework
      {joint-iso-itu-t ds(5) module(1) informationFramework(1) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.511 | ISO/IEC 9594-3

  FamilyGrouping, FamilyReturn, HierarchySelections, SearchControlOptions,
  ServiceControlOptions
    FROM DirectoryAbstractService
      {joint-iso-itu-t ds(5) module(1) directoryAbstractService(2) 9} WITH SUCCESSORS ;

-- types

SearchRule ::= SEQUENCE {
  COMPONENTS OF SearchRuleId,
  serviceType           [1]  OBJECT IDENTIFIER                          OPTIONAL,
  userClass             [2]  INTEGER                                    OPTIONAL,
  inputAttributeTypes   [3]  SEQUENCE SIZE (0..MAX) OF RequestAttribute OPTIONAL,
  attributeCombination  [4]  AttributeCombination                       DEFAULT and:{},
  outputAttributeTypes  [5]  SEQUENCE SIZE (1..MAX) OF ResultAttribute  OPTIONAL,
  defaultControls       [6]  ControlOptions                             OPTIONAL,
  mandatoryControls     [7]  ControlOptions                             OPTIONAL,
  searchRuleControls    [8]  ControlOptions                             OPTIONAL,
  familyGrouping        [9]  FamilyGrouping                             OPTIONAL,
  familyReturn          [10] FamilyReturn                               OPTIONAL,
  relaxation            [11] RelaxationPolicy                           OPTIONAL,
  additionalControl     [12] SEQUENCE SIZE (1..MAX) OF AttributeType    OPTIONAL,
  allowedSubset         [13] AllowedSubset                              DEFAULT '111'B,
  imposedSubset         [14] ImposedSubset                              OPTIONAL,
  entryLimit            [15] EntryLimit                                 OPTIONAL,
  ... }

SearchRuleId ::= SEQUENCE {
  id          INTEGER,
  dmdId  [0]  OBJECT IDENTIFIER }

AllowedSubset ::= BIT STRING {baseObject(0), oneLevel(1), wholeSubtree(2)}

ImposedSubset ::= ENUMERATED {baseObject(0), oneLevel(1), wholeSubtree(2),...}

RequestAttribute ::= SEQUENCE {
  attributeType            ATTRIBUTE.&id({SupportedAttributes}),
  includeSubtypes     [0]  BOOLEAN DEFAULT FALSE,
  selectedValues      [1]  SEQUENCE SIZE (0..MAX) OF ATTRIBUTE.&Type
                           ({SupportedAttributes}{@attributeType}) OPTIONAL,
  defaultValues       [2]  SEQUENCE SIZE (0..MAX) OF SEQUENCE {
    entryType                OBJECT-CLASS.&id OPTIONAL,
    values                   SEQUENCE OF ATTRIBUTE.&Type
                             ({SupportedAttributes}{@attributeType}),
                             ...} OPTIONAL,
  contexts            [3]  SEQUENCE SIZE (0..MAX) OF ContextProfile OPTIONAL,
  contextCombination  [4]  ContextCombination DEFAULT and:{},
  matchingUse         [5]  SEQUENCE SIZE (1..MAX) OF MatchingUse OPTIONAL,
  ... }

ContextProfile ::= SEQUENCE {
  contextType   CONTEXT.&id({SupportedContexts}),
  contextValue  SEQUENCE SIZE (1..MAX) OF CONTEXT.&Assertion
                 ({SupportedContexts}{@contextType}) OPTIONAL,
  ... }

ContextCombination ::= CHOICE {
  context  [0]  CONTEXT.&id({SupportedContexts}),
  and      [1]  SEQUENCE OF ContextCombination,
  or       [2]  SEQUENCE OF ContextCombination,
  not      [3]  ContextCombination,
  ... }

MatchingUse ::= SEQUENCE {
  restrictionType    MATCHING-RESTRICTION.&id({SupportedMatchingRestrictions}),
  restrictionValue   MATCHING-RESTRICTION.&Restriction
                        ({SupportedMatchingRestrictions}{@restrictionType}),
  ... }

-- Definition of the following information object set is deferred, perhaps to
-- standardized profiles or to protocol implementation conformance statements.
-- The set is required to specify a table constraint on the components of
-- SupportedMatchingRestrictions

SupportedMatchingRestrictions MATCHING-RESTRICTION ::= {...}

AttributeCombination ::= CHOICE {
  attribute  [0]  AttributeType,
  and        [1]  SEQUENCE OF AttributeCombination,
  or         [2]  SEQUENCE OF AttributeCombination,
  not        [3]  AttributeCombination,
  ... }

ResultAttribute ::= SEQUENCE {
  attributeType      ATTRIBUTE.&id({SupportedAttributes}),
  outputValues       CHOICE {
    selectedValues     SEQUENCE OF ATTRIBUTE.&Type
                       ({SupportedAttributes}{@attributeType}),
    matchedValuesOnly  NULL } OPTIONAL,
  contexts      [0]  SEQUENCE SIZE (1..MAX) OF ContextProfile OPTIONAL,
  ... }

ControlOptions ::= SEQUENCE {
  serviceControls   [0]  ServiceControlOptions DEFAULT {},
  searchOptions     [1]  SearchControlOptions  DEFAULT {searchAliases},
  hierarchyOptions  [2]  HierarchySelections   OPTIONAL,
  ... }

EntryLimit ::= SEQUENCE {
  default  INTEGER,
  max      INTEGER,
  ... }

RelaxationPolicy ::= SEQUENCE {
  basic        [0]  MRMapping DEFAULT {},
  tightenings  [1]  SEQUENCE SIZE (1..MAX) OF MRMapping OPTIONAL,
  relaxations  [2]  SEQUENCE SIZE (1..MAX) OF MRMapping OPTIONAL,
  maximum      [3]  INTEGER OPTIONAL, -- mandatory if tightenings is present
  minimum      [4]  INTEGER DEFAULT 1,
  ... }

MRMapping ::= SEQUENCE {
  mapping       [0]  SEQUENCE SIZE (1..MAX) OF Mapping OPTIONAL,
  substitution  [1]  SEQUENCE SIZE (1..MAX) OF MRSubstitution OPTIONAL,
  ... }

Mapping ::= SEQUENCE {
  mappingFunction  OBJECT IDENTIFIER (CONSTRAINED BY {-- shall be an--
                     -- object identifier of a mapping-based matching algorithm -- }),
  level            INTEGER DEFAULT 0,
  ... }

MRSubstitution ::= SEQUENCE {
  attribute             AttributeType,
  oldMatchingRule  [0]  MATCHING-RULE.&id OPTIONAL,
  newMatchingRule  [1]  MATCHING-RULE.&id OPTIONAL,
  ... }

-- ASN.1 information object classes

SEARCH-RULE ::= CLASS {
  &dmdId                 OBJECT IDENTIFIER,
  &serviceType           OBJECT IDENTIFIER               OPTIONAL,
  &userClass             INTEGER                         OPTIONAL,
  &InputAttributeTypes   REQUEST-ATTRIBUTE               OPTIONAL,
  &combination           AttributeCombination            OPTIONAL,
  &OutputAttributeTypes  RESULT-ATTRIBUTE                OPTIONAL,
  &defaultControls       ControlOptions                  OPTIONAL,
  &mandatoryControls     ControlOptions                  OPTIONAL,
  &searchRuleControls    ControlOptions                  OPTIONAL,
  &familyGrouping        FamilyGrouping                  OPTIONAL,
  &familyReturn          FamilyReturn                    OPTIONAL,
  &additionalControl     AttributeType                   OPTIONAL,
  &relaxation            RelaxationPolicy                OPTIONAL,
  &allowedSubset         AllowedSubset                   DEFAULT '111'B,
  &imposedSubset         ImposedSubset                   OPTIONAL,
  &entryLimit            EntryLimit                      OPTIONAL,
  &id                    INTEGER                         UNIQUE }
WITH SYNTAX {
  DMD ID                 &dmdId
  [SERVICE-TYPE          &serviceType]
  [USER-CLASS            &userClass]
  [INPUT ATTRIBUTES      &InputAttributeTypes]
  [COMBINATION           &combination]
  [OUTPUT ATTRIBUTES     &OutputAttributeTypes]
  [DEFAULT CONTROL       &defaultControls]
  [MANDATORY CONTROL     &mandatoryControls]
  [SEARCH-RULE CONTROL   &searchRuleControls]
  [FAMILY-GROUPING       &familyGrouping]
  [FAMILY-RETURN         &familyReturn]
  [ADDITIONAL CONTROL    &additionalControl]
  [RELAXATION            &relaxation]
  [ALLOWED SUBSET        &allowedSubset]
  [IMPOSED SUBSET        &imposedSubset]
  [ENTRY LIMIT           &entryLimit]
  ID                     &id }

REQUEST-ATTRIBUTE ::= CLASS {
  &attributeType         ATTRIBUTE.&id,
  &SelectedValues        ATTRIBUTE.&Type                 OPTIONAL,
  &DefaultValues         SEQUENCE {
    entryType              OBJECT-CLASS.&id            OPTIONAL,
    values                 SEQUENCE OF ATTRIBUTE.&Type } OPTIONAL,
  &contexts              SEQUENCE OF ContextProfile      OPTIONAL,
  &contextCombination    ContextCombination              OPTIONAL,
  &MatchingUse           MatchingUse                     OPTIONAL,
  &includeSubtypes       BOOLEAN                         DEFAULT FALSE }
WITH SYNTAX {
  ATTRIBUTE TYPE         &attributeType
  [SELECTED VALUES       &SelectedValues]
  [DEFAULT VALUES        &DefaultValues]
  [CONTEXTS              &contexts]
  [CONTEXT COMBINATION   &contextCombination]
  [MATCHING USE          &MatchingUse]
  [INCLUDE SUBTYPES      &includeSubtypes] }

RESULT-ATTRIBUTE ::= CLASS {
  &attributeType         ATTRIBUTE.&id,
  &outputValues          CHOICE {
    selectedValues         SEQUENCE OF ATTRIBUTE.&Type,
    matchedValuesOnly      NULL }                      OPTIONAL,
  &contexts              ContextProfile                  OPTIONAL }
WITH SYNTAX {
  ATTRIBUTE TYPE        &attributeType
  [OUTPUT VALUES        &outputValues]
  [CONTEXTS             &contexts] }

MATCHING-RESTRICTION ::= CLASS {
  &Restriction,
  &Rules                MATCHING-RULE.&id,
  &id                   OBJECT IDENTIFIER  UNIQUE }
WITH SYNTAX {
  RESTRICTION           &Restriction
  RULES                 &Rules
  ID                    &id }

END -- ServiceAdministration

UsefulDefinitions {joint-iso-itu-t ds(5) module(1) usefulDefinitions(0) 9}
DEFINITIONS ::=
BEGIN

-- EXPORTS All
/*
The types and values defined in this module are exported for use in the other ASN.1
modules contained within these Directory Specifications, and for the use of other
applications which will use them to access Directory services. Other applications
may use them for their own purposes, but this will not constrain extensions and
modifications needed to maintain or improve the Directory service.
*/
ID    ::= OBJECT IDENTIFIER

ds ID ::= {joint-iso-itu-t ds(5)}

-- The following definition is for ASN.1 definitions moved from
-- Rec. ITU-T X.660 | ISO/IEC 9834-1:

id ID ::= {joint-iso-itu-t registration-procedures(17) module(1) directory-defs(2)}

-- The following defition is for ASN.1 definitions of LDAP schema

internet            ID ::= {iso(1) identified-organization(3) dod(6) internet(1)}
ldap-dir            ID ::= {internet directory(1)}
intSecurity         ID ::= {internet security(5)}
ldap-enterprise     ID ::= {internet private(4) enterprise(1)}
ldap-x509           ID ::= {ldap-dir x509(15)}
ldap-openLDAP       ID ::= {ldap-enterprise openLDAP(4203) ldap(1)}
openLDAP-attributes ID ::= {ldap-openLDAP attributeType(3)}
openLDAP-controls   ID ::= {ldap-openLDAP controls(10)}
ldap-wall           ID ::= {ldap-enterprise wahl(1466)}
ldap-dynExt         ID ::= {ldap-wall 101 119}
ldap-attr           ID ::= {ldap-wall 101 120}
ldap-match          ID ::= {ldap-wall 109 114}
ldap-syntax         ID ::= {ldap-wall 115 121 1}
cosine              ID ::= {itu-t(0) data(9) pss(2342) ucl(19200300) pilot(100)}
cosineAttr          ID ::= {cosine pilotAttributeType(1)}

-- categories of information object

module                                   ID ::= {ds 1}
serviceElement                           ID ::= {ds 2}
applicationContext                       ID ::= {ds 3}
attributeType                            ID ::= {ds 4}
attributeSyntaxVendor                    ID ::= {ds 5}
-- This arc will not be used by these Directory Specifications
objectClass                              ID ::= {ds 6}
attributeSet                             ID ::= {ds 7}
algorithm                                ID ::= {ds 8}
abstractSyntax                           ID ::= {ds 9}
object                                   ID ::= {ds 10}
port                                     ID ::= {ds 11}
dsaOperationalAttribute                  ID ::= {ds 12}
matchingRule                             ID ::= {ds 13}
knowledgeMatchingRule                    ID ::= {ds 14}
nameForm                                 ID ::= {ds 15}
group                                    ID ::= {ds 16}
subentry                                 ID ::= {ds 17}
operationalAttributeType                 ID ::= {ds 18}
operationalBinding                       ID ::= {ds 19}
schemaObjectClass                        ID ::= {ds 20}
schemaOperationalAttribute               ID ::= {ds 21}
administrativeRoles                      ID ::= {ds 23}
accessControlAttribute                   ID ::= {ds 24}
rosObject                                ID ::= {ds 25}
contract                                 ID ::= {ds 26}
package                                  ID ::= {ds 27}
accessControlSchemes                     ID ::= {ds 28}
certificateExtension                     ID ::= {ds 29}
managementObject                         ID ::= {ds 30}
attributeValueContext                    ID ::= {ds 31}
securityExchange                         ID ::= {ds 32}
idmProtocol                              ID ::= {ds 33}
problem                                  ID ::= {ds 34}
notification                             ID ::= {ds 35}
matchingRestriction                      ID ::= {ds 36} -- None are currently defined
controlAttributeType                     ID ::= {ds 37}
keyPurposes                              ID ::= {ds 38}
passwordQuality                          ID ::= {ds 39}
attributeSyntax                          ID ::= {ds 40}
avRestriction                            ID ::= {ds 41}
cmsContentType                           ID ::= {ds 42}

-- modules

usefulDefinitions                        ID ::= {module usefulDefinitions(0) 9}
informationFramework                     ID ::= {module informationFramework(1) 9}
directoryAbstractService                 ID ::= {module directoryAbstractService(2) 9}
distributedOperations                    ID ::= {module distributedOperations(3) 9}
protocolObjectIdentifiers                ID ::= {module protocolObjectIdentifiers(4) 9}
selectedAttributeTypes                   ID ::= {module selectedAttributeTypes(5) 9}
selectedObjectClasses                    ID ::= {module selectedObjectClasses(6) 9}
authenticationFramework                  ID ::= {module authenticationFramework(7) 9}
algorithmObjectIdentifiers               ID ::= {module algorithmObjectIdentifiers(8) 9}
directoryObjectIdentifiers               ID ::= {module directoryObjectIdentifiers(9) 9}
upperBounds                              ID ::= {module upperBounds(10) 9}
dap                                      ID ::= {module dap(11) 9}
dsp                                      ID ::= {module dsp(12) 9}
distributedDirectoryOIDs                 ID ::= {module distributedDirectoryOIDs(13) 9}
directoryShadowOIDs                      ID ::= {module directoryShadowOIDs(14) 9}
directoryShadowAbstractService           ID ::= {module directoryShadowAbstractService(15) 9}
disp                                     ID ::= {module disp(16) 7}
dop                                      ID ::= {module dop(17) 7}
opBindingManagement                      ID ::= {module opBindingManagement(18) 9}
opBindingOIDs                            ID ::= {module opBindingOIDs(19) 9}
hierarchicalOperationalBindings          ID ::= {module hierarchicalOperationalBindings(20) 9}
dsaOperationalAttributeTypes             ID ::= {module dsaOperationalAttributeTypes(22) 9}
schemaAdministration                     ID ::= {module schemaAdministration(23) 9}
basicAccessControl                       ID ::= {module basicAccessControl(24) 9}
directoryOperationalBindingTypes         ID ::= {module directoryOperationalBindingTypes(25) 9}
certificateExtensions                    ID ::= {module certificateExtensions(26) 9}
directoryManagement                      ID ::= {module directoryManagement(27) 9}
enhancedSecurity                         ID ::= {module enhancedSecurity(28) 9}
directorySecurityExchanges               ID ::= {module directorySecurityExchanges (29) 9}
iDMProtocolSpecification                 ID ::= {module iDMProtocolSpecification(30) 9}
directoryIDMProtocols                    ID ::= {module directoryIDMProtocols(31) 9}
attributeCertificateDefinitions          ID ::= {module attributeCertificateDefinitions(32) 9}
serviceAdministration                    ID ::= {module serviceAdministration(33) 9}
ldapAttributes                           ID ::= {module ldapAttributes(34) 9}
commonProtocolSpecification              ID ::= {module commonProtocolSpecification(35) 9}
oSIProtocolSpecification                 ID ::= {module oSIProtocolSpecification(36) 9}
directoryOSIProtocols                    ID ::= {module directoryOSIProtocols(37) 9}
ldapSystemSchema                         ID ::= {module ldapSystemSchema(38) 9}
passwordPolicy                           ID ::= {module passwordPolicy(39) 9}
pkiPmiExternalDataTypes                  ID ::= {module pkiPmiExternalDataTypes(40) 9}
extensionAttributes                      ID ::= {module extensionAttributes(41) 9}
pkiPmiWrapper                            ID ::= {module pkiPmiWrapper(42) 9}
avlManagement                            ID ::= {module avlManagement(43) 9}
trustBrokerProtocol                      ID ::= {module trustBrokerProtocol(44) 9}

-- synonyms

id-oc                                    ID ::= objectClass
id-at                                    ID ::= attributeType
id-as                                    ID ::= abstractSyntax
id-mr                                    ID ::= matchingRule
id-nf                                    ID ::= nameForm
id-sc                                    ID ::= subentry
id-oa                                    ID ::= operationalAttributeType
id-ob                                    ID ::= operationalBinding
id-doa                                   ID ::= dsaOperationalAttribute
id-kmr                                   ID ::= knowledgeMatchingRule
id-soc                                   ID ::= schemaObjectClass
id-soa                                   ID ::= schemaOperationalAttribute
id-ar                                    ID ::= administrativeRoles
id-aca                                   ID ::= accessControlAttribute
id-ac                                    ID ::= applicationContext
id-rosObject                             ID ::= rosObject
id-contract                              ID ::= contract
id-package                               ID ::= package
id-acScheme                              ID ::= accessControlSchemes
id-ce                                    ID ::= certificateExtension
id-mgt                                   ID ::= managementObject
id-avc                                   ID ::= attributeValueContext
id-se                                    ID ::= securityExchange
id-idm                                   ID ::= idmProtocol
id-pr                                    ID ::= problem
id-not                                   ID ::= notification
id-mre                                   ID ::= matchingRestriction
id-cat                                   ID ::= controlAttributeType
id-kp                                    ID ::= keyPurposes
id-pq                                    ID ::= passwordQuality
id-ats                                   ID ::= attributeSyntax
-- ldapControl is not defined anywhere. Fortunately, this is never used anywhere, either.
-- id-lc                                    ID ::= ldapControl
id-asx                                   ID ::= attributeSyntax
id-lsx                                   ID ::= ldap-syntax
id-ldx                                   ID ::= ldap-x509
id-lat                                   ID ::= ldap-attr
id-lmr                                   ID ::= ldap-match
id-oat                                   ID ::= openLDAP-attributes
id-coat                                  ID ::= cosineAttr
id-avr                                   ID ::= avRestriction
id-cmsct                                 ID ::= cmsContentType

-- LDAP syntax object identifiers

userpwdMatch                           ID ::= {id-ls 0}
userPwdHisoricMatch                    ID ::= {id-ls 1}

-- LDAP control object identifiers

pwdControl                             ID ::= {id-lc 0}
pwdResponse                            ID ::= {id-lc 1}

-- obsolete module identifiers

-- usefulDefinition                      ID ::= {module 0}
-- informationFramework                  ID ::= {module 1}
-- directoryAbstractService              ID ::= {module 2}
-- distributedOperations                 ID ::= {module 3}
-- protocolObjectIdentifiers             ID ::= {module 4}
-- selectedAttributeTypes                ID ::= {module 5}
-- selectedObjectClasses                 ID ::= {module 6}
-- authenticationFramework               ID ::= {module 7}
-- algorithmObjectIdentifiers            ID ::= {module 8}
-- directoryObjectIdentifiers            ID ::= {module 9}
-- upperBounds                           ID ::= {module 10}
-- dap                                   ID ::= {module 11}
-- dsp                                   ID ::= {module 12}
distributedDirectoryObjectIdentifiers ID ::= {module 13}

-- unused module identifiers

-- directoryShadowOIDs                   ID ::= {module 14}
-- directoryShadowAbstractService        ID ::= {module 15}
-- disp                                  ID ::= {module 16}
-- dop                                   ID ::= {module 17}
-- opBindingManagement                   ID ::= {module 18}
-- opBindingOIDs                         ID ::= {module 19}
-- hierarchicalOperationalBindings       ID ::= {module 20}
-- dsaOperationalAttributeTypes          ID ::= {module 22}
-- schemaAdministration                  ID ::= {module 23}
-- basicAccessControl                    ID ::= {module 24}
operationalBindingOIDs                ID ::= {module 25}

END -- UsefulDefinitions

-- Module MTSAbstractService (X.509:10/2012)
-- See also ITU-T X.509 (10/2012)
-- See also the index of all ASN.1 assignments needed in this document

/* The follow module is an abstract of the module specified by
Rec. ITU-T Rec. X.411 | ISO/IEC 10021-4. An  import statement has been changed to only
import from the current Directory Specifications not to be dependent on modules from
previous editions.*/
MTSAbstractService {joint-iso-itu-t mhs(6) mts(3) modules(0)
  mts-abstract-service(1) version-1999(1)} DEFINITIONS IMPLICIT TAGS ::=
BEGIN

--EXPORTS All
IMPORTS
  PresentationAddress
    FROM SelectedAttributeTypes {joint-iso-itu-t ds(5) module(1)
      selectedAttributeTypes(5) 7};

G3FacsimileNonBasicParameters ::= BIT STRING {
  two-dimensional(8), -- As defined in ITU-T Recommendation T.30--
  fine-resolution(9),
  unlimited-length(20), -- These bit values are chosen such that when--
  b4-length(21), -- encoded using ASN.1 Basic Encoding Rules--
  a3-width(22), -- the resulting octets have the same values--
  b4-width(23), -- as for T.30 encoding-- t6-coding(25),
  uncompressed(30), -- Trailing zero bits are not significant--
  width-middle-864-of-1728(37), -- It is recommended that implementations--
  width-middle-1216-of-1728(38), -- should not encode more than 32 bits unless--
  resolution-type(44), -- higher numbered bits are non-zero--
  resolution-400x400(45), resolution-300x300(46), resolution-8x15(47),
  edi(49), dtm(50), bft(51), mixed-mode(58), character-mode(60),
  twelve-bits(65), preferred-huffmann(66), full-colour(67), jpeg(68),
  processable-mode-26(71)}

ORAddress ::= SEQUENCE {
  built-in-standard-attributes        BuiltInStandardAttributes,
  built-in-domain-defined-attributes  BuiltInDomainDefinedAttributes OPTIONAL,
  -- see also teletex-domain-defined-attributes
  extension-attributes                ExtensionAttributes OPTIONAL
}

--	The OR-address is semantically absent from the OR-name if the built-in-standard-attribute
--	sequence is empty and the built-in-domain-defined-attributes and extension-attributes are both omitted.
--	Built-in Standard Attributes
BuiltInStandardAttributes ::= SEQUENCE {
  country-name                CountryName OPTIONAL,
  administration-domain-name  AdministrationDomainName OPTIONAL,
  network-address             [0]  NetworkAddress OPTIONAL,
  -- see also extended-network-address
  terminal-identifier         [1]  TerminalIdentifier OPTIONAL,
  private-domain-name         [2]  PrivateDomainName OPTIONAL,
  organization-name           [3]  OrganizationName OPTIONAL,
  -- see also teletex-organization-name
  numeric-user-identifier     [4]  NumericUserIdentifier OPTIONAL,
  personal-name               [5]  PersonalName OPTIONAL,
  -- see also teletex-personal-name
  organizational-unit-names   [6]  OrganizationalUnitNames OPTIONAL
  -- see also teletex-organizational-unit-names
}

CountryName ::= [APPLICATION 1]  CHOICE {
  x121-dcc-code         NumericString(SIZE (ub-country-name-numeric-length)),
  iso-3166-alpha2-code  PrintableString(SIZE (ub-country-name-alpha-length))
}

AdministrationDomainName ::= [APPLICATION 2]  CHOICE {
  numeric    NumericString(SIZE (0..ub-domain-name-length)),
  printable  PrintableString(SIZE (0..ub-domain-name-length))
}

NetworkAddress ::= X121Address

-- see also extended-network-address
X121Address ::= NumericString(SIZE (1..ub-x121-address-length))

TerminalIdentifier ::= PrintableString(SIZE (1..ub-terminal-id-length))

PrivateDomainName ::= CHOICE {
  numeric    NumericString(SIZE (1..ub-domain-name-length)),
  printable  PrintableString(SIZE (1..ub-domain-name-length))
}

OrganizationName ::= PrintableString(SIZE (1..ub-organization-name-length))

-- see also teletex-organization-name
NumericUserIdentifier ::= NumericString(SIZE (1..ub-numeric-user-id-length))

PersonalName ::= SET {
  surname               [0]  PrintableString(SIZE (1..ub-surname-length)),
  given-name
    [1]  PrintableString(SIZE (1..ub-given-name-length)) OPTIONAL,
  initials
    [2]  PrintableString(SIZE (1..ub-initials-length)) OPTIONAL,
  generation-qualifier
    [3]  PrintableString(SIZE (1..ub-generation-qualifier-length)) OPTIONAL
}

-- see also teletex-personal-name
OrganizationalUnitNames ::=
  SEQUENCE SIZE (1..ub-organizational-units) OF OrganizationalUnitName

-- see also teletex-organizational-unit-names
OrganizationalUnitName ::=
  PrintableString(SIZE (1..ub-organizational-unit-name-length))

--	Built-in Domain-defined Attributes
BuiltInDomainDefinedAttributes ::=
  SEQUENCE SIZE (1..ub-domain-defined-attributes) OF
    BuiltInDomainDefinedAttribute

BuiltInDomainDefinedAttribute ::= SEQUENCE {
  type   PrintableString(SIZE (1..ub-domain-defined-attribute-type-length)),
  value  PrintableString(SIZE (1..ub-domain-defined-attribute-value-length))
}

--	Extension Attributes
ExtensionAttributes ::=
  SET SIZE (1..ub-extension-attributes) OF ExtensionAttribute

ExtensionAttribute ::= SEQUENCE {
  extension-attribute-type
    [0]  EXTENSION-ATTRIBUTE.&id({ExtensionAttributeTable}),
  extension-attribute-value
    [1]  EXTENSION-ATTRIBUTE.&Type
           ({ExtensionAttributeTable}{@extension-attribute-type})
}

EXTENSION-ATTRIBUTE ::= CLASS {
  &id    INTEGER(0..ub-extension-attributes) UNIQUE,
  &Type
}WITH SYNTAX {&Type
              IDENTIFIED BY &id
}

ExtensionAttributeTable EXTENSION-ATTRIBUTE ::=
  {common-name | teletex-common-name | universal-common-name |
   teletex-organization-name | universal-organization-name |
   teletex-personal-name | universal-personal-name |
   teletex-organizational-unit-names | universal-organizational-unit-names |
   teletex-domain-defined-attributes | universal-domain-defined-attributes |
   pds-name | physical-delivery-country-name | postal-code |
   physical-delivery-office-name | universal-physical-delivery-office-name |
   physical-delivery-office-number | universal-physical-delivery-office-number
   | extension-OR-address-components |
   universal-extension-OR-address-components | physical-delivery-personal-name
   | universal-physical-delivery-personal-name |
   physical-delivery-organization-name |
   universal-physical-delivery-organization-name |
   extension-physical-delivery-address-components |
   universal-extension-physical-delivery-address-components |
   unformatted-postal-address | universal-unformatted-postal-address |
   street-address | universal-street-address | post-office-box-address |
   universal-post-office-box-address | poste-restante-address |
   universal-poste-restante-address | unique-postal-name |
   universal-unique-postal-name | local-postal-attributes |
   universal-local-postal-attributes | extended-network-address | terminal-type
  }

--	Extension Standard Attributes
common-name EXTENSION-ATTRIBUTE ::= {CommonName
                                     IDENTIFIED BY  1
}

CommonName ::= PrintableString(SIZE (1..ub-common-name-length))

teletex-common-name EXTENSION-ATTRIBUTE ::= {TeletexCommonName
                                             IDENTIFIED BY  2
}

TeletexCommonName ::= TeletexString(SIZE (1..ub-common-name-length))

universal-common-name EXTENSION-ATTRIBUTE ::= {
  UniversalCommonName
  IDENTIFIED BY  24
}

UniversalCommonName ::= UniversalOrBMPString{ub-common-name-length}

teletex-organization-name EXTENSION-ATTRIBUTE ::= {
  TeletexOrganizationName
  IDENTIFIED BY  3
}

TeletexOrganizationName ::=
  TeletexString(SIZE (1..ub-organization-name-length))

universal-organization-name EXTENSION-ATTRIBUTE ::= {
  UniversalOrganizationName
  IDENTIFIED BY  25
}

UniversalOrganizationName ::= UniversalOrBMPString{ub-organization-name-length}

teletex-personal-name EXTENSION-ATTRIBUTE ::= {
  TeletexPersonalName
  IDENTIFIED BY  4
}

TeletexPersonalName ::= SET {
  surname               [0]  TeletexString(SIZE (1..ub-surname-length)),
  given-name
    [1]  TeletexString(SIZE (1..ub-given-name-length)) OPTIONAL,
  initials
    [2]  TeletexString(SIZE (1..ub-initials-length)) OPTIONAL,
  generation-qualifier
    [3]  TeletexString(SIZE (1..ub-generation-qualifier-length)) OPTIONAL
}

universal-personal-name EXTENSION-ATTRIBUTE ::= {
  UniversalPersonalName
  IDENTIFIED BY  26
}

UniversalPersonalName ::= SET {
  surname               [0]  UniversalOrBMPString{ub-universal-surname-length},
  -- If a language is specified within surname, then that language applies to each of the
  -- following optional components unless the component specifies another language.
  given-name
    [1]  UniversalOrBMPString{ub-universal-given-name-length} OPTIONAL,
  initials
    [2]  UniversalOrBMPString{ub-universal-initials-length} OPTIONAL,
  generation-qualifier
    [3]  UniversalOrBMPString{ub-universal-generation-qualifier-length}
      OPTIONAL
}

teletex-organizational-unit-names EXTENSION-ATTRIBUTE ::= {
  TeletexOrganizationalUnitNames
  IDENTIFIED BY  5
}

TeletexOrganizationalUnitNames ::=
  SEQUENCE SIZE (1..ub-organizational-units) OF TeletexOrganizationalUnitName

TeletexOrganizationalUnitName ::=
  TeletexString(SIZE (1..ub-organizational-unit-name-length))

universal-organizational-unit-names EXTENSION-ATTRIBUTE ::= {
  UniversalOrganizationalUnitNames
  IDENTIFIED BY  27
}

UniversalOrganizationalUnitNames ::=
  SEQUENCE SIZE (1..ub-organizational-units) OF UniversalOrganizationalUnitName

-- If a unit name specifies a language, then that language applies to subordinate unit
-- names unless the subordinate specifies another language.
UniversalOrganizationalUnitName ::=
  UniversalOrBMPString{ub-organizational-unit-name-length}

UniversalOrBMPString{INTEGER:ub-string-length} ::= SET {
  character-encoding
    CHOICE {two-octets   BMPString(SIZE (1..ub-string-length)),
            four-octets  UniversalString(SIZE (1..ub-string-length))},
  iso-639-language-code  PrintableString(SIZE (2 | 5)) OPTIONAL
}

pds-name EXTENSION-ATTRIBUTE ::= {PDSName
                                  IDENTIFIED BY  7
}

PDSName ::= PrintableString(SIZE (1..ub-pds-name-length))

physical-delivery-country-name EXTENSION-ATTRIBUTE ::= {
  PhysicalDeliveryCountryName
  IDENTIFIED BY  8
}

PhysicalDeliveryCountryName ::= CHOICE {
  x121-dcc-code         NumericString(SIZE (ub-country-name-numeric-length)),
  iso-3166-alpha2-code  postal-code EXTENSION-ATTRIBUTE ::= {PostalCode
                                     IDENTIFIED BY  9
}

PostalCode ::= CHOICE {
  numeric-code    NumericString(SIZE (1..ub-postal-code-length)),
  printable-code  PrintableString(SIZE (1..ub-postal-code-length))
}

physical-delivery-office-name EXTENSION-ATTRIBUTE ::= {
  PhysicalDeliveryOfficeName
  IDENTIFIED BY  10
}

PhysicalDeliveryOfficeName ::= PDSParameter

universal-physical-delivery-office-name EXTENSION-ATTRIBUTE ::= {
  UniversalPhysicalDeliveryOfficeName
  IDENTIFIED BY  29
}

UniversalPhysicalDeliveryOfficeName ::= UniversalPDSParameter

physical-delivery-office-number EXTENSION-ATTRIBUTE ::= {
  PhysicalDeliveryOfficeNumber
  IDENTIFIED BY  11
}

PhysicalDeliveryOfficeNumber ::= PDSParameter

universal-physical-delivery-office-number EXTENSION-ATTRIBUTE ::= {
  UniversalPhysicalDeliveryOfficeNumber
  IDENTIFIED BY  30
}

UniversalPhysicalDeliveryOfficeNumber ::= UniversalPDSParameter

extension-OR-address-components EXTENSION-ATTRIBUTE ::= {
  ExtensionORAddressComponents
  IDENTIFIED BY  12
}

ExtensionORAddressComponents ::= PDSParameter

universal-extension-OR-address-components EXTENSION-ATTRIBUTE ::= {
  UniversalExtensionORAddressComponents
  IDENTIFIED BY  31
}

UniversalExtensionORAddressComponents ::= UniversalPDSParameter

physical-delivery-personal-name EXTENSION-ATTRIBUTE ::= {
  PhysicalDeliveryPersonalName
  IDENTIFIED BY  13
}

PhysicalDeliveryPersonalName ::= PDSParameter

universal-physical-delivery-personal-name EXTENSION-ATTRIBUTE ::= {
  UniversalPhysicalDeliveryPersonalName
  IDENTIFIED BY  32
}

UniversalPhysicalDeliveryPersonalName ::= UniversalPDSParameter

physical-delivery-organization-name EXTENSION-ATTRIBUTE ::= {
  PhysicalDeliveryOrganizationName
  IDENTIFIED BY  14
}

PhysicalDeliveryOrganizationName ::= PDSParameter

universal-physical-delivery-organization-name EXTENSION-ATTRIBUTE ::=
{UniversalPhysicalDeliveryOrganizationName
 IDENTIFIED BY  33
}

UniversalPhysicalDeliveryOrganizationName ::= UniversalPDSParameter

extension-physical-delivery-address-components EXTENSION-ATTRIBUTE ::=
{ExtensionPhysicalDeliveryAddressComponents
 IDENTIFIED BY  15
}

ExtensionPhysicalDeliveryAddressComponents ::= PDSParameter

universal-extension-physical-delivery-address-components EXTENSION-ATTRIBUTE
  ::= {UniversalExtensionPhysicalDeliveryAddressComponents
       IDENTIFIED BY  34
}

UniversalExtensionPhysicalDeliveryAddressComponents ::= UniversalPDSParameter

unformatted-postal-address EXTENSION-ATTRIBUTE ::= {
  UnformattedPostalAddress
  IDENTIFIED BY  16
}

UnformattedPostalAddress ::= SET {
  printable-address
    SEQUENCE SIZE (1..ub-pds-physical-address-lines) OF
      PrintableString(SIZE (1..ub-pds-parameter-length)) OPTIONAL,
  teletex-string
    TeletexString(SIZE (1..ub-unformatted-address-length)) OPTIONAL
}

universal-unformatted-postal-address EXTENSION-ATTRIBUTE ::= {
  UniversalUnformattedPostalAddress
  IDENTIFIED BY  35
}

UniversalUnformattedPostalAddress ::=
  UniversalOrBMPString{ub-unformatted-address-length}

street-address EXTENSION-ATTRIBUTE ::= {StreetAddress
                                        IDENTIFIED BY  17
}

StreetAddress ::= PDSParameter

universal-street-address EXTENSION-ATTRIBUTE ::= {
  UniversalStreetAddress
  IDENTIFIED BY  36
}

UniversalStreetAddress ::= UniversalPDSParameter

post-office-box-address EXTENSION-ATTRIBUTE ::= {
  PostOfficeBoxAddress
  IDENTIFIED BY  18
}

PostOfficeBoxAddress ::= PDSParameter

universal-post-office-box-address EXTENSION-ATTRIBUTE ::= {
  UniversalPostOfficeBoxAddress
  IDENTIFIED BY  37
}

UniversalPostOfficeBoxAddress ::= UniversalPDSParameter

poste-restante-address EXTENSION-ATTRIBUTE ::= {
  PosteRestanteAddress
  IDENTIFIED BY  19
}

PosteRestanteAddress ::= PDSParameter

universal-poste-restante-address EXTENSION-ATTRIBUTE ::= {
  UniversalPosteRestanteAddress
  IDENTIFIED BY  38
}

UniversalPosteRestanteAddress ::= UniversalPDSParameter

unique-postal-name EXTENSION-ATTRIBUTE ::= {UniquePostalName
                                            IDENTIFIED BY  20
}

UniquePostalName ::= PDSParameter

universal-unique-postal-name EXTENSION-ATTRIBUTE ::= {
  UniversalUniquePostalName
  IDENTIFIED BY  39
}

UniversalUniquePostalName ::= UniversalPDSParameter

local-postal-attributes EXTENSION-ATTRIBUTE ::= {
  LocalPostalAttributes
  IDENTIFIED BY  21
}

LocalPostalAttributes ::= PDSParameter

universal-local-postal-attributes EXTENSION-ATTRIBUTE ::= {
  UniversalLocalPostalAttributes
  IDENTIFIED BY  40
}

UniversalLocalPostalAttributes ::= UniversalPDSParameter

PDSParameter ::= SET {
  printable-string  PrintableString(SIZE (1..ub-pds-parameter-length)) OPTIONAL,
  teletex-string    TeletexString(SIZE (1..ub-pds-parameter-length)) OPTIONAL
}

UniversalPDSParameter ::= UniversalOrBMPString{ub-pds-parameter-length}

extended-network-address EXTENSION-ATTRIBUTE ::= {
  ExtendedNetworkAddress
  IDENTIFIED BY  22
}

ExtendedNetworkAddress ::= CHOICE {
  e163-4-address
    SEQUENCE {number
                [0]  NumericString(SIZE (1..ub-e163-4-number-length)),
              sub-address
                [1]  NumericString(SIZE (1..ub-e163-4-sub-address-length))
                  OPTIONAL},
  psap-address    [0]  PresentationAddress
}

terminal-type EXTENSION-ATTRIBUTE ::= {TerminalType
                                       IDENTIFIED BY  23
}

TerminalType ::= INTEGER {
  telex(3), teletex(4), g3-facsimile(5), g4-facsimile(6), ia5-terminal(7),
  videotex(8)}(0..ub-integer-options)

--	Extension Domain-defined Attributes
teletex-domain-defined-attributes EXTENSION-ATTRIBUTE ::= {
  TeletexDomainDefinedAttributes
  IDENTIFIED BY  6
}

TeletexDomainDefinedAttributes ::=
  SEQUENCE SIZE (1..ub-domain-defined-attributes) OF
    TeletexDomainDefinedAttribute

TeletexDomainDefinedAttribute ::= SEQUENCE {
  type   TeletexString(SIZE (1..ub-domain-defined-attribute-type-length)),
  value  TeletexString(SIZE (1..ub-domain-defined-attribute-value-length))
}

universal-domain-defined-attributes EXTENSION-ATTRIBUTE ::= {
  UniversalDomainDefinedAttributes
  IDENTIFIED BY  28
}

UniversalDomainDefinedAttributes ::=
  SEQUENCE SIZE (1..ub-domain-defined-attributes) OF
    UniversalDomainDefinedAttribute

UniversalDomainDefinedAttribute ::= SEQUENCE {
  type   UniversalOrBMPString{ub-domain-defined-attribute-type-length},
  value  UniversalOrBMPString{ub-domain-defined-attribute-value-length}
}

ub-integer-options INTEGER ::= 256

ub-e163-4-number-length INTEGER ::= 15

ub-e163-4-sub-address-length INTEGER ::= 40

ub-unformatted-address-length INTEGER ::= 180

ub-pds-parameter-length INTEGER ::= 30

ub-pds-physical-address-lines INTEGER ::= 6

ub-postal-code-length INTEGER ::= 16

ub-pds-name-length INTEGER ::= 16

ub-universal-surname-length INTEGER ::= 64

ub-universal-given-name-length INTEGER ::= 40

ub-universal-initials-length INTEGER ::= 16

ub-universal-generation-qualifier-length INTEGER ::= 16

ub-common-name-length INTEGER ::= 64

ub-extension-attributes INTEGER ::= 256

ub-domain-defined-attribute-type-length INTEGER ::= 8

ub-domain-defined-attribute-value-length INTEGER ::= 128

ub-domain-defined-attributes INTEGER ::= 4

ub-organizational-unit-name-length INTEGER ::= 32

ub-organizational-units INTEGER ::= 4

ub-generation-qualifier-length INTEGER ::= 3

ub-initials-length INTEGER ::= 5

ub-given-name-length INTEGER ::= 16

ub-surname-length INTEGER ::= 40

ub-numeric-user-id-length INTEGER ::= 32

ub-organization-name-length INTEGER ::= 64

ub-terminal-id-length INTEGER ::= 24

ub-x121-address-length INTEGER ::= 16

ub-domain-name-length INTEGER ::= 16

ub-country-name-alpha-length INTEGER ::= 2

ub-country-name-numeric-length INTEGER ::= 3

END -- MTSAbstractService--

-- Module PKIX1Implicit93 (X.509:10/2012)
-- See also ITU-T X.509 (10/2012)
-- See also the index of all ASN.1 assignments needed in this document

PKIX1Implicit93 {iso(1) identified-organization(3) dod(6) internet(1)
  security(5) mechanisms(5) pkix(7) id-mod(0) id-pkix1-implicit-93(4)}
DEFINITIONS IMPLICIT TAGS ::=
BEGIN

UserNotice ::= SEQUENCE {
  noticeRef     NoticeReference OPTIONAL,
  explicitText  DisplayText OPTIONAL
}

NoticeReference ::= SEQUENCE {
  organization   DisplayText,
  noticeNumbers  SEQUENCE OF INTEGER
}

DisplayText ::= CHOICE {
  visibleString  VisibleString(SIZE (1..200)),
  bmpString      BMPString(SIZE (1..200)),
  utf8String     UTF8String(SIZE (1..200))
}

END -- PKIX1Implicit93--

PkiPMIProtocolSpecifications {joint-iso-itu-t ds(5) module(1) pkiPMIProtocolSpecifications(43) 8}
DEFINITIONS ::=
BEGIN

-- EXPORTS All

IMPORTS

  -- from Rec. ITU-T X.501 | ISO/IEC 9594-2

  attributeCertificateDefinitions, authenticationFramework, certificateExtensions,
  id-cmsct, informationFramework, pkiPmiWrapper, selectedAttributeTypes
    FROM UsefulDefinitions {joint-iso-itu-t ds(5) module(1) usefulDefinitions(0) 8}

  Attribute{}, ATTRIBUTE, Name, SupportedAttributes
    FROM InformationFramework informationFramework

  -- from Rec. ITU-T X.509 | ISO/IEC 9594-8

  ALGORITHM, AlgorithmIdentifier{}, Certificate, CertificateList, CertificateSerialNumber, CertAVL,
  ENCRYPTED-HASH{}, PKCertIdentifier, SIGNATURE{},   TBSCertAVL,
  Version, AvlSerialNumber, PkiPath
    FROM AuthenticationFramework authenticationFramework

  CRLReason, SubjectKeyIdentifier
    FROM CertificateExtensions certificateExtensions

  AttributeCertificate
    FROM AttributeCertificateDefinitions attributeCertificateDefinitions

  PkiWaError, WRAPPED-PDU
    FROM PkiPmiWrapper pkiPmiWrapper

  -- from Rec. ITU-T X.520 | ISO/IEC 9594-6

  objectIdentifierMatch, octetStringMatch
    FROM SelectedAttributeTypes selectedAttributeTypes ;

-- PDU types

AvlPduSet WRAPPED-PDU ::= {
  certReq |
  certRsp |
  addAvlReq |
  addAvlRsp |
  replaceAvlReq |
  replaceAvlRsp |
  deleteAvlReq |
  deleteAvlRsp |
  rejectAVL |
  certSubscribeReq |
  certSubscribeRsp |
  certUnsubscribeReq |
  certUnsubscribeRsp |
  certReplaceReq |
  certReplaceRsp |
  rejectCAsubscribe,
  ... }

-- Authorization validation list management

AVMPcommonComponents ::= SEQUENCE {
  version    AVMPversion DEFAULT v1,
  timeStamp  GeneralizedTime,
  sequence   AVMPsequence,
  ... }

AVMPversion ::= ENUMERATED { v1(1), v2(2), v3(3), ... }

AVMPsequence ::= INTEGER (1..MAX)

certReq WRAPPED-PDU ::= {
                CertReq
  IDENTIFIED BY id-certReq }

CertReq ::= SEQUENCE {
  COMPONENTS OF AVMPcommonComponents,
  ... }

certRsp WRAPPED-PDU ::= {
                CertRsp
  IDENTIFIED BY id-certRsp }

CertRsp ::= SEQUENCE {
  COMPONENTS OF AVMPcommonComponents,
  result        CHOICE {
    success       [0]  CertOK,
    failure       [1]  CertErr,
    ... },
  ... }

CertOK ::= SEQUENCE {
  dhCert  Certificate,
  ... }

CertErr ::= SEQUENCE {
  notOK  CHOICE {
    wrErr   [0]  PkiWaError,
    avmpErr [1]  AVMP-error,
    ... },
  note   Notifications OPTIONAL,
  ... }

Notifications ::= SEQUENCE SIZE (1..MAX) OF Attribute {{SupportedAttributes}}

addAvlReq WRAPPED-PDU ::= {
                AddAvlReq
  IDENTIFIED BY id-addAvlReq }

AddAvlReq ::= SEQUENCE {
  COMPONENTS OF AVMPcommonComponents,
  certlist      CertAVL,
  ... }

addAvlRsp WRAPPED-PDU ::= {
                 AddAvlRsp
  IDENTIFIED BY  id-addAvlRsp }

AddAvlRsp ::= SEQUENCE {
  COMPONENTS OF AVMPcommonComponents,
  result        CHOICE {
    success       [0]  AddAvlOK,
    failure       [1]  AddAvlErr,
    ... },
  ... }

AddAvlOK ::= SEQUENCE {
  ok     NULL,
  ... }

AddAvlErr ::= SEQUENCE {
  notOK  AVMP-error,
  ... }

replaceAvlReq WRAPPED-PDU ::= {
                 ReplaceAvlReq
  IDENTIFIED BY  id-replaceAvlReq }

ReplaceAvlReq ::= SEQUENCE {
  COMPONENTS OF AVMPcommonComponents,
  old           AvlSerialNumber OPTIONAL,
  new           CertAVL,
  ... }

replaceAvlRsp WRAPPED-PDU ::= {
                 ReplaceAvlRsp
  IDENTIFIED BY  id-replaceAvlRsp }

ReplaceAvlRsp ::= SEQUENCE {
  COMPONENTS OF AVMPcommonComponents,
  result        CHOICE {
    success       [0]  RepAvlOK,
    failure       [1]  RepAvlErr,
    ... },
  ... }

RepAvlOK ::= SEQUENCE {
  ok     NULL,
  ... }

RepAvlErr ::= SEQUENCE {
  notOK  AVMP-error,
  ... }

deleteAvlReq WRAPPED-PDU ::= {
                 DeleteAvlReq
  IDENTIFIED BY  id-deleteAvlReq }

DeleteAvlReq ::= SEQUENCE {
  COMPONENTS OF AVMPcommonComponents,
  avl-Id        AvlSerialNumber OPTIONAL,
  ... }

deleteAvlRsp WRAPPED-PDU ::= {
                 DeleteAvlRsp
  IDENTIFIED BY  id-deleteAvlRsp }

DeleteAvlRsp ::= SEQUENCE {
  COMPONENTS OF AVMPcommonComponents,
  result        CHOICE {
    success       [0]  DelAvlOK,
    failure       [1]  DelAvlErr,
    ... },
  ... }

DelAvlOK ::= SEQUENCE {
  ok     NULL,
  ... }

DelAvlErr ::= SEQUENCE {
  notOK  AVMP-error,
  ... }

rejectAVL  WRAPPED-PDU ::= {
                 RejectAVL
  IDENTIFIED BY  id-rejectAVL }

RejectAVL ::= SEQUENCE {
  COMPONENTS OF AVMPcommonComponents,
  reason        AVMP-error,
  ... }

-- CA subscription

CASPcommonComponents ::= SEQUENCE {
  version    CASPversion DEFAULT v1,
  sequence   CASPsequence,
  ... }

CASPversion ::= ENUMERATED { v1(1), v2(2), v3(3), ... }

CASPsequence ::= INTEGER (1..MAX)

certSubscribeReq WRAPPED-PDU ::= {
                 CertSubscribeReq
  IDENTIFIED BY  id-certSubscribeReq }

CertSubscribeReq ::= SEQUENCE {
  COMPONENTS OF CASPcommonComponents,
  certs   SEQUENCE (SIZE (1..MAX)) OF SEQUENCE {
    subject      Name,
    serialNumber CertificateSerialNumber,
    ... },
  ... }

certSubscribeRsp WRAPPED-PDU ::= {
                 CertSubscribeRsp
  IDENTIFIED BY  id-certSubscribeRsp }

CertSubscribeRsp ::= SEQUENCE {
  COMPONENTS OF CASPcommonComponents,
  result       CHOICE {
    success       [0]  CertSubscribeOK,
    failure       [1]  CertSubscribeErr,
    ... },
  ... }

CertSubscribeOK ::= SEQUENCE (SIZE (1..MAX)) OF CHOICE {
  ok       [0] SEQUENCE {
    cert         Certificate,
    status       CertStatus,
    revokeReason CRLReason OPTIONAL,
    ... },
  not-ok   [1] SEQUENCE {
    status       CASP-CertStatusCode,
    ... },
  ... }

CertStatus ::= ENUMERATED {
  good    (0),
  revoked (1),
  on-hold (2),
  expired (3),
  ... }

CASP-CertStatusCode ::= ENUMERATED {
  noReason       (1),
  unknownCert    (2),
  ... }

CertSubscribeErr ::= SEQUENCE {
  code       CASP-error,
  ... }

certUnsubscribeReq WRAPPED-PDU ::= {
                 CertUnsubscribeReq
  IDENTIFIED BY  id-certUnsubscribeReq }

CertUnsubscribeReq ::= SEQUENCE {
  COMPONENTS OF CASPcommonComponents,
  certs  SEQUENCE (SIZE (1..MAX)) OF SEQUENCE {
    subject      Name,
    serialNumber CertificateSerialNumber,
    ... },
  ... }

certUnsubscribeRsp WRAPPED-PDU ::= {
                 CertUnsubscribeRsp
  IDENTIFIED BY  id-certUnsubscribeRsp }

CertUnsubscribeRsp ::= SEQUENCE {
  COMPONENTS OF CASPcommonComponents,
  result       CHOICE {
    success       [0]  CertUnsubscribeOK,
    failure       [1]  CertUnsubscribeErr,
    ... },
  ... }

CertUnsubscribeOK ::= SEQUENCE (SIZE (1..MAX)) OF CHOICE {
  ok       [0] SEQUENCE {
    subject      Name,
    serialNumber CertificateSerialNumber,
    ... },
  not-ok   [1] SEQUENCE {
    status       CASP-CertStatusCode,
    ... },
  ... }

CertUnsubscribeErr ::= SEQUENCE {
  code         CASP-error,
  ... }

certReplaceReq WRAPPED-PDU ::= {
                 CertReplaceReq
  IDENTIFIED BY  id-certReplaceReq }

CertReplaceReq ::= SEQUENCE {
  COMPONENTS OF CASPcommonComponents,
  certs         SEQUENCE (SIZE (1..MAX)) OF SEQUENCE {
    old           CertificateSerialNumber,
    new           Certificate,
    ... },
  ... }

certReplaceRsp WRAPPED-PDU ::= {
                 CertReplaceRsp
  IDENTIFIED BY  id-certReplaceRsp }

CertReplaceRsp ::= SEQUENCE {
  COMPONENTS OF CASPcommonComponents,
  result        CHOICE {
    success       [0]  CertReplaceOK,
    failure       [1]  CertReplaceErr,
    ... },
  ... }

CertReplaceOK ::= SEQUENCE (SIZE (1..MAX)) OF CHOICE {
  ok        [0] SEQUENCE {
    issuer        Name,
    serialNumber  CertificateSerialNumber,
    ... },
  not-ok    [1] SEQUENCE {
    status        CASP-CertStatusCode,
    ... },
  ... }

CertReplaceErr ::= SEQUENCE {
  code        CHOICE {
    signedData     [0]  SignedData-error,
    envelopedData  [1]  EnvelopedData-error,
    casp           [2]  CASP-error,
    ... },
  ... }

certUpdateReq WRAPPED-PDU ::= {
                 CertUpdateReq
  IDENTIFIED BY  id-certUpdateReq }

CertUpdateReq ::= SEQUENCE {
  COMPONENTS OF CASPcommonComponents,
  certs  SEQUENCE (SIZE (1..MAX)) OF SEQUENCE {
    subject      Name,
    serialNumber CertificateSerialNumber,
    certStatus   CertStatus,
    ... },
  ... }

certUpdateRsp WRAPPED-PDU ::= {
                 CertUpdateRsp
  IDENTIFIED BY  id-certUpdateRsp }

CertUpdateRsp ::= SEQUENCE {
  COMPONENTS OF CASPcommonComponents,
  result        CHOICE {
    success       [0]  CertUpdateOK,
    failure       [1]  CertUpdateErr,
    ... },
  ... }

CertUpdateOK ::= SEQUENCE (SIZE (1..MAX)) OF CHOICE {
  ok        [0] SEQUENCE {
    subject       Name,
    serialNumber  CertificateSerialNumber,
    ... },
  not-ok    [1] SEQUENCE {
    status        CASP-CertStatusCode,
    ... },
  ... }

CertUpdateErr ::= SEQUENCE {
  code          CASP-error,
  ... }

rejectCAsubscribe  WRAPPED-PDU ::= {
                 RejectCAsubscribe
  IDENTIFIED BY  id-rejectCAsubscribe }

RejectCAsubscribe ::= SEQUENCE {
  COMPONENTS OF CASPcommonComponents,
  reason        CASP-error,
  ... }

SignedData-error ::= ENUMERATED {
  noReason                           (0),
  signedDataContectTypeExpected      (1),
  wrongSignedDataVersion             (2),
  missingContent                     (3),
  missingContentComponent            (4),
  invalidContentComponent            (5),
  unsupportedHashAlgorithm           (6),
  ... }

EnvelopedData-error ::= ENUMERATED {
  noReason                           (0),
  ... }

AVMP-error ::= ENUMERATED {
  noReason                           (0),
  unknownAvlEntity                   (1),
  unknownContentType                 (2),
  unsupportedAVMPversion             (3),
  missingContent                     (4),
  missingContentComponent            (5),
  invalidContentComponent            (6),
  sequenceError                      (7),
  protocolError                      (8),
  invalidAvlSignature                (9),
  duplicateAVL                       (10),
  missingAvlComponent                (11),
  invalidAvlVersion                  (12),
  notAllowedForConstrainedAVLEntity  (13),
  constrainedRequired                (14),
  nonConstrainedRequired             (15),
  unsupportedCriticalEntryExtension  (16),
  unsupportedCriticalExtension       (17),
  maxAVLsExceeded                    (18),
  unknownCert                        (19),
  unknownAVL                         (20),
  unsupportedScopeRestriction        (21),
  ... }


CASP-error ::= ENUMERATED {
  noReason                      (0),
  unknownContentType            (1),
  unsupportedWLMPversion        (2),
  missingContent                (3),
  missingContentComponent       (4),
  invalidContentComponent       (5),
  sequenceError                 (6),
  unknownSubject                (7),
  unknownCert                   (8),
  ... }

id-signedData OBJECT IDENTIFIER ::= {iso(1) member-body(2)
us(840)rsadsi(113549) pkcs(1) pkcs7(7) 2}

id-envelopedData OBJECT IDENTIFIER ::= {iso(1) member-body(2) us(840)
rsadsi(113549) pkcs(1) pkcs7(7) 3}

id-certReq              OBJECT IDENTIFIER ::= {id-cmsct 0}
id-certRsp              OBJECT IDENTIFIER ::= {id-cmsct 1}
id-addAvlReq            OBJECT IDENTIFIER ::= {id-cmsct 2}
id-addAvlRsp            OBJECT IDENTIFIER ::= {id-cmsct 3}
id-replaceAvlReq        OBJECT IDENTIFIER ::= {id-cmsct 4}
id-replaceAvlRsp        OBJECT IDENTIFIER ::= {id-cmsct 5}
id-updateAvlReq         OBJECT IDENTIFIER ::= {id-cmsct 6}
id-updateAvlRsp         OBJECT IDENTIFIER ::= {id-cmsct 7}
id-deleteAvlReq         OBJECT IDENTIFIER ::= {id-cmsct 8}
id-deleteAvlRsp         OBJECT IDENTIFIER ::= {id-cmsct 9}
id-rejectAVL            OBJECT IDENTIFIER ::= {id-cmsct 10}
id-certSubscribeReq     OBJECT IDENTIFIER ::= {id-cmsct 11}
id-certSubscribeRsp     OBJECT IDENTIFIER ::= {id-cmsct 12}
id-certUnsubscribeReq   OBJECT IDENTIFIER ::= {id-cmsct 13}
id-certUnsubscribeRsp   OBJECT IDENTIFIER ::= {id-cmsct 14}
id-certReplaceReq       OBJECT IDENTIFIER ::= {id-cmsct 15}
id-certReplaceRsp       OBJECT IDENTIFIER ::= {id-cmsct 16}
id-certUpdateReq        OBJECT IDENTIFIER ::= {id-cmsct 17}
id-certUpdateRsp        OBJECT IDENTIFIER ::= {id-cmsct 18}
id-rejectCAsubscribe    OBJECT IDENTIFIER ::= {id-cmsct 19}


-- Trust broker protocol

TBrequest ::= CHOICE {
  caCert      [0] PKCertIdentifier,
  subjectCert [1] PKCertIdentifier,
  ... }

TBresponse ::= CHOICE {
  success [0]  TBOK,
  failure [1]  TBerror,
  ... }

TBOK ::= SEQUENCE {
  levelOfAssurance  [0]  INTEGER (0..100),
  confidenceLevel   [1]  INTEGER (0..100),
  validationTime    [2]  UTCTime,
  info                   UTF8String  OPTIONAL,
  ... }

TBerror ::= SEQUENCE {
  code        ENUMERATED {
    caCertInvalid        (1),
    unknownCert          (2),
    unknownCertStatus    (3),
    subjectCertRevoked   (4),
    incorrectCert        (5),
    contractExpired      (6),
    pathValidationFailed (7),
    timeOut              (8),
    other                (99),
    ... },
  diagnostic  UTF8String OPTIONAL,
  ... }

END -- PkiPMIProtocolSpecifications

PkiPmiWrapper {joint-iso-itu-t ds(5) module(1) pkiPmiWrapper(42) 8}
DEFINITIONS ::=
BEGIN

-- EXPORTS All

IMPORTS

  -- from Rec. ITU-T X.501 | ISO/IEC 9594-2

  attributeCertificateDefinitions, authenticationFramework, certificateExtensions, id-cmsct, informationFramework, selectedAttributeTypes
    FROM UsefulDefinitions {joint-iso-itu-t ds(5) module(1) usefulDefinitions(0) 8}

  Attribute{}, ATTRIBUTE, Name
    FROM InformationFramework informationFramework

  -- from Rec. ITU-T X.509 | ISO/IEC 9594-8

  ALGORITHM, AlgorithmIdentifier{}, Certificate, CertificateList, CertificateSerialNumber, CertAVL,
  ENCRYPTED-HASH{}, PKCertIdentifier, SIGNATURE{},   TBSCertAVL,
  Version, AvlSerialNumber, PkiPath, SIGNED
    FROM AuthenticationFramework authenticationFramework

  CRLReason, SubjectKeyIdentifier
    FROM CertificateExtensions certificateExtensions

  AttributeCertificate
    FROM AttributeCertificateDefinitions attributeCertificateDefinitions

  -- from Rec. ITU-T X.520 | ISO/IEC 9594-6

  objectIdentifierMatch, octetStringMatch
    FROM SelectedAttributeTypes selectedAttributeTypes ;

WRAPPED-PDU ::= TYPE-IDENTIFIER

PDU-wrapper ::= SIGNED{TBSPDU-wrapper}

TBSPDU-wrapper ::= SEQUENCE  {
  version               Version DEFAULT v1,
  signatureAlgorithm    AlgorithmIdentifier {{SupportedSignatureAlgorithms}},
  certPath         [0]  IMPLICIT PkiPath,
  signedAttrs      [1]  IMPLICIT SignedAttributes OPTIONAL,
  conf                  CHOICE {
    clear            [2]  WrappedPDUInfo,
    protected        [3]  EncryptedInfo,
   ... },
  ... }

SupportedSignatureAlgorithms ALGORITHM ::= {...}

SignedAttributes ::= SET SIZE (1..MAX) OF Attribute{{SupportedSignedAttributes}}

SupportedSignedAttributes ATTRIBUTE ::= { contentType | messageDigest }

WrappedPDUInfo ::= SEQUENCE {
  pduType      WRAPPED-PDU.&id ({SupportedPduSet}),
  pduInfo      WRAPPED-PDU.&Type ({SupportedPduSet}{@pduType}),
  ... }

SupportedPduSet WRAPPED-PDU ::= {...}

EncryptedInfo ::= SEQUENCE {
  keyAgreement      KeyAgreement,
  encryptedPduInfo  EncryptedPduInfo,
  ... }

KeyAgreement ::= SEQUENCE {
  senderDhInfo       [0] SenderDhInfo,
  keyEncryptionAlgorithm SEQUENCE {
    algorithm    ALGORITHM.&id ({SupportedKeyEncryptionAlgorithm}),
    parameters   ALGORITHM.&Type({SupportedKeyEncryptionAlgorithm}{@.algorithm}),
    ... },
  ... }

SupportedKeyEncryptionAlgorithm ALGORITHM ::= {...}

SenderDhInfo ::= CHOICE {
  senderStaticInfo   [0] SenderStaticInfo,
  senderDhPublicKey  [1] SenderDhPublicKey,
  ... }

SenderStaticInfo::= SEQUENCE {
  issuer       Name,
  serialNumber CertificateSerialNumber,
  partyAinfo   UserKeyingMaterial,
  ... }

SenderDhPublicKey ::= SEQUENCE {
  algorithm   AlgorithmIdentifier {{SupportedDHPublicKeyAlgorithms}},
  publicKey   BIT STRING,
  ... }

SupportedDHPublicKeyAlgorithms ALGORITHM ::= {...}

UserKeyingMaterial ::= OCTET STRING (SIZE (64))

EncryptedPduInfo ::= SEQUENCE {
  pduType                 WRAPPED-PDU.&id ({SupportedPduSet}),
  encryptedKey            EncryptedKey OPTIONAL,
  pduEncryptionAlgorithm  SEQUENCE {
    algorithm               ALGORITHM.&id ({SymmetricEncryptionAlgorithms}),
    parameter               ALGORITHM.&Type
                  ({SymmetricEncryptionAlgorithms}{@.algorithm})} OPTIONAL,
  encryptedPdu        [0] EncryptedPdu,
  ... }

EncryptedKey ::= OCTET STRING

SymmetricEncryptionAlgorithms ALGORITHM ::= {...}

EncryptedPdu ::= OCTET STRING

SupportedAttributes ATTRIBUTE ::= {...}

AttributeCertificateV2 ::= AttributeCertificate

-- Attribute type specification as defined by IETF RFC 5652

contentType ATTRIBUTE ::= {
  WITH SYNTAX            WRAPPED-PDU.&id({SupportedPduSet})
  EQUALITY MATCHING RULE objectIdentifierMatch
  SINGLE VALUE           TRUE
  ID                     id-contentType }

id-contentType OBJECT IDENTIFIER ::= { iso(1) member-body(2) us(840) rsadsi(113549) pkcs(1) pkcs9(9) 3 }

messageDigest ATTRIBUTE ::= {
  WITH SYNTAX            OCTET STRING
  EQUALITY MATCHING RULE octetStringMatch
  SINGLE VALUE           TRUE
  ID                     id-messageDigest }

id-messageDigest OBJECT IDENTIFIER ::= { iso(1) member-body(2) us(840) rsadsi(113549) pkcs(1) pkcs9(9) 4 }

PkiWaError ::= ENUMERATED {
  unsupportedWrapperVersion           (0),
  unsupportedSignatureAlgorithm       (1),
  incompleteCertPath                  (2),
  certificationPathFailure            (3),
  invalidSignature                    (4),
  missingMandatoryAttributes          (5),
  unwantedAttribute                   (6),
  unsupportedPduType                  (7),
  unexpectedPduType                   (8),
  invalidPduSyntax                    (9),
  unknownDHpkCetificate               (10),
  invalidKeyingMaterial               (11),
  dhAlgorithmMismatch                 (12),
  invalideDhPublickey                 (13),
  unsupportedKeyWrappingAlgorithm     (14),
  keyEncAlgorithmParametersMissing    (15),
  keyEncAlgorithmParametersNotAllowed (16),
  invalidParmsForSymEncryptAlgorithms (17),
  decryptionFailed                    (18),
  ... }

END -- PkiPmiWrapper

AlgorithmObjectIdentifiers {joint-iso-itu-t ds(5) module(1) algorithmObjectIdentifiers(8) 9}
DEFINITIONS ::=
BEGIN

-- EXPORTS All

/*
The values defined in this module are primarily taking from various specifications and
collected here for easy reference by other specifcations.

Wen values are copied form an IETF RFC, the IETF RFC number is shown.

When values are copied from the NIST Computer Security Objects Register (CSOR),
the label CSOR is used.
*/

IMPORTS

  algorithm
    FROM UsefulDefinitions
      {joint-iso-itu-t ds(5) module(1) usefulDefinitions(0) 9} WITH SUCCESSORS

  ALGORITHM, AlgorithmIdentifier{}, SupportedAlgorithms, SupportedCurves
    FROM AuthenticationFramework
      {joint-iso-itu-t ds(5) module(1) authenticationFramework(7) 9} WITH SUCCESSORS ;

ID ::= OBJECT IDENTIFIER

-- Object identifier allocations

-- Object identifiers allocated by this Specification (but not used)

nullAlgorithm           ID ::= {algorithm 0}
encryptionAlgorithm     ID ::= {algorithm 1}
hashAlgorithm           ID ::= {algorithm 2}
signatureAlgorithm      ID ::= {algorithm 3}

-- synonyms

id-ea                   ID ::= encryptionAlgorithm
id-ha                   ID ::= hashAlgorithm
id-sa                   ID ::= signatureAlgorithm

-- the following object identifier assignments reserve values assigned to deprecated functions

id-ea-rsa               ID ::= {id-ea 1}
id-ha-sqMod-n           ID ::= {id-ha 1}
id-sa-sqMod-nWithRSA    ID ::= {id-sa 1}

-- object identifiers allocated by other organization

us-iso                  ID ::= { iso(1) member-body(2) us(840) }
ansi-x9-57              ID ::= { us-iso ansi-x9-57(10040) }
ansi-x9-62              ID ::= { us-iso ansi-x962(10045) }
ansi-x9-42              ID ::= { us-iso ansi-x942(10046) }
iso-standard            ID ::= { iso(1) standard(0) }
iso9797                 ID ::= { iso-standard message-authentication-codes(9797) }
iso-organization        ID ::= { iso(1) identified-organization(3) }
certicom                ID ::= { iso-organization certicom(132) }
certicom-curve          ID ::= { certicom curve(0) }
teletrust               ID ::= { iso-organization teletrust(36) }
ecStdCurvesAndGen       ID ::= { teletrust algorithm(3) signature-algorithm(3) ecSign(2) 8}
versionOne              ID ::= { ecStdCurvesAndGen ellipticCurve(1) versionOne(1) }

us-joint                ID ::= { joint-iso-itu-t(2) country(16) us(840) }
usgov                   ID ::= { us-joint organization(1) gov(101) }
dodAlgorithms           ID ::= { usgov dod(2) infosec(1) algorithms(1) }
csor                    ID ::= { usgov csor(3) }
nistAlgorithms          ID ::= { csor nistAlgorithm(4) } -- CSOR
aes                     ID ::= { nistAlgorithms 1 } -- CSOR
hashAlgs                ID ::= { nistAlgorithms hashalgs(2) } -- CSOR
sigAlgs                 ID ::= { nistAlgorithms 3 } -- CSOR

rsadsi                  ID ::= { iso(1) member-body(2) us(840) rsadsi(113549) }
pkcs-1                  ID ::= { rsadsi pkcs(1) pkcs-1(1) }
digestAlgorithm         ID ::= { rsadsi digestAlgorithm(2) }


-- Symmetric key algorithm object identifiers

id-aes128-CBC           ID ::= { aes 2 }  -- CSOR
id-aes192-CBC           ID ::= { aes 22 } -- CSOR
id-aes256-CBC           ID ::= { aes 42 } -- CSOR

-- AES key wrap algorithms from IETF RFC 3394

id-aes128-wrap          ID ::= { aes 5 }
id-aes192-wrap          ID ::= { aes 25 }
id-aes256-wrap          ID ::= { aes 45 }

-- Pubkic key algorithm object identifiers

rsaEncryption           ID ::= { pkcs-1 rsaEncryption(1)} -- IETF RFC 4055
id-keyExchangeAlgorithm ID ::= { dodAlgorithms id-keyExchangeAlgorithm(22)}
                                 -- IETF RFC 3279
id-dsa                  ID ::= { ansi-x9-57 x9algorithm(4) 1 }   -- IETF RFC 5480
id-ecPublicKey          ID ::= { ansi-x9-62 keyType(2) 1 }       -- IETF RFC 5480
id-ecDH                 ID ::= { certicom schemes(1) ecdh(12) }  -- IETF RFC 5480
id-ecMQV                ID ::= { certicom schemes(1) ecmqv(13) } -- IETF RFC 5480
dh-public-number        ID ::= { ansi-x9-42 number-type(2) dh-public-number(1) } --IETF RFC 2631


-- Hash algorithms object identifiers

-- The OID for SHA hash algorithms are specified in NIST FIPS PUB 180-4

id-sha1                 ID ::= {iso(1) identified-organization(3) oiw(14) secsig(3)
                                algorithms(2) 26} -- IETF RFC 3279
-- SHA-2 family
id-sha256               ID ::= { hashAlgs 1 } -- CSOR
id-sha384               ID ::= { hashAlgs 2 } -- CSOR
id-sha512               ID ::= { hashAlgs 3 } -- CSOR
id-sha224               ID ::= { hashAlgs 4 } -- CSOR
id-sha512-224           ID ::= { hashAlgs 5 } -- CSOR
id-sha512-256           ID ::= { hashAlgs 6 } -- CSOR
-- SHA-3 family
id-sha3-224             ID ::= { hashAlgs 7 } -- CSOR
id-sha3-256             ID ::= { hashAlgs 8 } -- CSOR
id-sha3-384             ID ::= { hashAlgs 9 } -- CSOR
id-sha3-512             ID ::= { hashAlgs 10 } -- CSOR
id-shake128             ID ::= { hashAlgs 11 } -- CSOR
id-shake256             ID ::= { hashAlgs 12 } -- CSOR
id-shake128-len         ID ::= { hashAlgs 17 } -- CSOR
id-shake256-len         ID ::= { hashAlgs 18 } -- CSOR

hashAlg                 ID ::= {  iso(1) identified-organization(3) dod(6) internet(1)
                                  private(4) enterprise(1) kudelski(1722)
                                  cryptography(12) 2 } -- BLAKE2, RFC 7693

-- SIGNATURE ALGORITHM IDS

-- RSASSA-PKCS1-v1_5 signature algorithm object identifiers (From IETF RFC 3447)

sha1WithRSAEncryption   ID ::= { pkcs-1 sha1WithRSAEncryption(5) }
sha256WithRSAEncryption ID ::= { pkcs-1 sha256WithRSAEncryption(11) }
sha384WithRSAEncryption ID ::= { pkcs-1 sha384WithRSAEncryption(12) }
sha512WithRSAEncryption ID ::= { pkcs-1 sha512WithRSAEncryption(13) }
sha224WithRSAEncryption ID ::= { pkcs-1 sha224WithRSAEncryption(14) }

-- RSASSA-PSS signature algorithm object identifiers (From IETF RFC 4055)

id-RSASSA-PSS           ID ::= { pkcs-1 10 }
id-mgf1                 ID ::= { pkcs-1 8 }

-- DSA algorithms object idntifiers

id-dsa-with-sha1        ID ::= {iso(1) member-body(2) us(840) x9-57(10040) x9algorithm(4)
                                dsa-with-sha1(3)}
id-dsa-with-sha224      ID ::= { sigAlgs 1 } -- CSOR
id-dsa-with-sha256      ID ::= { sigAlgs 2 } -- CSOR

-- From IETF RFC 5758
ecdsa-with-SHA224       ID ::= { ansi-x9-62 signatures(4)
                                                ecdsa-with-SHA2(3) 1 }
ecdsa-with-SHA256       ID ::= { ansi-x9-62 signatures(4)
                                                ecdsa-with-SHA2(3) 2 }
ecdsa-with-SHA384       ID ::= { ansi-x9-62 signatures(4)
                                                ecdsa-with-SHA2(3) 3 }
ecdsa-with-SHA512       ID ::= { ansi-x9-62 signatures(4) ecdsa-with-SHA2(3) 4 }

--  Object identifier for curves

-- From IETF RFC 5480

secp192r1       ID ::= { ansi-x9-62 curves(3) prime(1) 1 }
sect163k1       ID ::= { certicom-curve 1 }
sect163r2       ID ::= { certicom-curve 15 }
secp224r1       ID ::= { certicom-curve 33 }
sect233k1       ID ::= { certicom-curve 26 }
sect233r1       ID ::= { certicom-curve 27 }
secp256r1       ID ::= { ansi-x9-62 curves(3) prime(1) 7 }
sect283k1       ID ::= { certicom-curve 16 }
sect283r1       ID ::= { certicom-curve 17 }
secp384r1       ID ::= { certicom-curve 34 }
sect409k1       ID ::= { certicom-curve 36 }
sect409r1       ID ::= { certicom-curve 37 }
secp521r1       ID ::= { certicom-curve 35 }
sect571k1       ID ::= { certicom-curve 38 }
sect571r1       ID ::= { certicom-curve 39 }

-- From IETF RFC 5639

brainpoolP160r1 ID ::= { versionOne 1 }
brainpoolP160t1 ID ::= { versionOne 2 }
brainpoolP192r1 ID ::= { versionOne 3 }
brainpoolP192t1 ID ::= { versionOne 4 }
brainpoolP224r1 ID ::= { versionOne 5 }
brainpoolP224t1 ID ::= { versionOne 6 }
brainpoolP256r1 ID ::= { versionOne 7 }
brainpoolP256t1 ID ::= { versionOne 8 }
brainpoolP320r1 ID ::= { versionOne 9 }
brainpoolP320t1 ID ::= { versionOne 10 }
brainpoolP384r1 ID ::= { versionOne 11 }
brainpoolP384t1 ID ::= { versionOne 12 }
brainpoolP512r1 ID ::= { versionOne 13 }
brainpoolP512t1 ID ::= { versionOne 14 }

X509Curves OBJECT IDENTIFIER ::= { secp192r1 | sect163k1 | sect163r2 | secp224r1 | sect233k1 |
                                   sect233r1 | secp256r1 | sect283k1 | sect283r1 | secp384r1 |
                                   sect409k1 | sect409r1 | secp521r1 | sect571k1 | sect571r1 }

-- Object identifiers for Integrity Check Value (ICV) algorithms

id-hmacWithSHA224       ID ::= { digestAlgorithm 8 }  -- IETF RFC 4231
id-hmacWithSHA256       ID ::= { digestAlgorithm 9 }  -- IETF RFC 4231
id-hmacWithSHA384       ID ::= { digestAlgorithm 10 } -- IETF RFC 4231
id-hmacWithSHA512       ID ::= { digestAlgorithm 11 } -- IETF RFC 4231

id-gmac                 ID ::= { iso9797 part3(3) gmac(4) } -- ISO/IEC 9797-3

-- =============== ALGORITHMS ========================================

-- Hashing alogorithms

mD5Algorithm ALGORITHM ::= {
  PARMS          NULL
  IDENTIFIED BY {iso(1) member-body(2) us(840) rsadsi(113549) digestAlgorithm(2) md5(5)}}

-- Note that the MD5 algorithm is not considered secure

sha1Algorithm ALGORITHM ::= {
  PARMS          NULL
  IDENTIFIED BY id-sha1 }

-- Note that the SHA1 algorithm is not considered secure

-- SHA-2 family

sha256 ALGORITHM ::= { -- IETF RFC 5754
  IDENTIFIED BY id-sha256 }

sha384 ALGORITHM ::= { -- IETF RFC 5754
  IDENTIFIED BY id-sha384 }

sha512 ALGORITHM ::= { -- IETF RFC 5754
  IDENTIFIED BY id-sha512 }

sha224 ALGORITHM ::= { -- IETF RFC 5754
  IDENTIFIED BY id-sha224 }

sha512-224 ALGORITHM ::= {
  IDENTIFIED BY id-sha512-224 }

sha512-256 ALGORITHM ::= {
  IDENTIFIED BY id-sha512-256 }

-- SHA-3 family

sha3-224 ALGORITHM ::= {
  IDENTIFIED BY id-sha3-224 }

sha3-256 ALGORITHM ::= {
  IDENTIFIED BY id-sha3-256 }

sha3-384 ALGORITHM ::= {
  IDENTIFIED BY id-sha3-384 }

sha3-512 ALGORITHM ::= {
  IDENTIFIED BY id-sha3-512 }

shake128 ALGORITHM ::= {
  IDENTIFIED BY id-shake128 }

shake256 ALGORITHM ::= {
  IDENTIFIED BY id-shake256 }

shake128-len ALGORITHM ::= {
  PARMS         ShakeOutputLen
  IDENTIFIED BY id-shake128-len }

shake256-len ALGORITHM ::= {
  PARMS         ShakeOutputLen
  IDENTIFIED BY id-shake256-len }

ShakeOutputLen ::= INTEGER -- Output length in bits

HashAlgorithms ALGORITHM ::= {sha1Algorithm |
                              sha224 |
                              sha256 |
                              sha384 |
                              sha512 }

-- Symmetric encryption algorithms

aes128-CBC ALGORITHM ::= {  -- CSOR
  PARMS         AES-InitializationVector
  IDENTIFIED BY id-aes128-CBC }

aes192-CBC ALGORITHM ::= { -- CSOR
  PARMS         AES-InitializationVector
  IDENTIFIED BY id-aes192-CBC }

aes256-CBC ALGORITHM ::= { -- CSOR
  PARMS         AES-InitializationVector
  IDENTIFIED BY id-aes256-CBC }

AES-InitializationVector ::= OCTET STRING (SIZE (16))

-- Public key algorithms

rsaEncryptionAlgorithm ALGORITHM ::= { -- IETF RFC 4055
  PARMS         NULL
  IDENTIFIED BY rsaEncryption }

keyExchangeAlgorithm ALGORITHM ::= { -- IETF RFC 3279
  PARMS         KEA-Parms-Id
  IDENTIFIED BY id-keyExchangeAlgorithm }

KEA-Parms-Id ::= OCTET STRING (SIZE (10))

dsa ALGORITHM ::= { -- IETF RFC 5480
  PARMS         DSS-Parms
  IDENTIFIED BY id-dsa }

DSS-Parms ::= SEQUENCE {
  p   INTEGER,
  q   INTEGER,
  g   INTEGER,
  ... }

ecPublicKey ALGORITHM ::= { -- IETF RFC 5480
  PARMS         X509Curves
  IDENTIFIED BY id-ecPublicKey }

ecDH ALGORITHM ::= { -- IETF RFC 5480
  PARMS         X509Curves
  IDENTIFIED BY id-ecDH }

ecMQV ALGORITHM ::= { -- IETF RFC 5480
  PARMS         X509Curves
  IDENTIFIED BY id-ecMQV }

dh-public-numberAlgorithm ALGORITHM ::= {
  PARMS         DomainParameters
  IDENTIFIED BY dh-public-number }

DomainParameters ::= SEQUENCE {
  p               INTEGER, -- odd prime, p=jq+1
  g               INTEGER, -- generator, g
  q               INTEGER, -- factor of p-1
  j               INTEGER  OPTIONAL, -- subgroup factor
  validationParms ValidationParms OPTIONAL,
  ... }

ValidationParms ::= SEQUENCE {
  seed         BIT STRING,
  pgenCounter  INTEGER,
  ... }

-- SIGNATURE ALGORITHMS
-- RSASSA-PKCS1-v1_5 signature algorithms

sha1WithRSAEncryptionAlgorithm ALGORITHM ::= { -- IETF 7427
  PARMS         NULL
  IDENTIFIED BY sha1WithRSAEncryption }

sha224WithRSAEncryptionAlgorithm ALGORITHM ::= { -- IETF RFC 5754
  PARMS         NULL
  IDENTIFIED BY sha224WithRSAEncryption }

sha256WithRSAEncryptionAlgorithm ALGORITHM ::= { -- IETF RFC 7427
  PARMS         NULL
  IDENTIFIED BY sha256WithRSAEncryption }

sha384WithRSAEncryptionAlgorithm ALGORITHM ::= { -- IETF RFC 7427
  PARMS         NULL
  IDENTIFIED BY sha384WithRSAEncryption }

sha512WithRSAEncryptionAlgorithm ALGORITHM ::= { -- IETF RFC 7427
  PARMS         NULL
  IDENTIFIED BY sha512WithRSAEncryption }

-- RSASA-PSS algorithms

rSASSA-PSS ALGORITHM ::= {
  PARMS                 SEQUENCE {
    hashAlgorithm    [0]  AlgorithmIdentifier {{HashAlgorithms}},
 -- maskGenAlgorithm [1]  AlgorithmIdentifier {{MaskGenAlgorithms}},
    saltLength       [2]  INTEGER DEFAULT 20,
    trailerField     [3]  INTEGER DEFAULT 1 }
  IDENTIFIED BY         id-RSASSA-PSS }

--

-- DSA signature algorithms

dsa-with-sha224 ALGORITHM ::= { -- IETF RFC 5754
  IDENTIFIED BY id-dsa-with-sha224 }

dsa-with-sha256 ALGORITHM ::= { -- IETF RFC 5754
  IDENTIFIED BY id-dsa-with-sha256 }

-- ECDSA signature algorithms

ecdsa-with-SHA224-Algorithm ALGORITHM ::= { -- IETF RFC
  IDENTIFIED BY ecdsa-with-SHA224 }

ecdsa-with-SHA256-Algorithm ALGORITHM ::= { -- IETF RFC 5758
  IDENTIFIED BY ecdsa-with-SHA256 }

ecdsa-with-SHA384-Algorithm ALGORITHM ::= { -- IETF RFC 5758
  IDENTIFIED BY ecdsa-with-SHA384 }

ecdsa-with-SHA512-Algorithm ALGORITHM ::= { -- IETF RFC 5758
  IDENTIFIED BY ecdsa-with-SHA512 }


-- HMAC algorithms

hmacWithSHA224 ALGORITHM ::= {  -- IETF RFC 4231
  PARMS         NULL
  IDENTIFIED BY id-hmacWithSHA224 }

hmacWithSHA256 ALGORITHM ::= {  -- IETF RFC 4231
  PARMS         NULL
  IDENTIFIED BY id-hmacWithSHA256 }

hmacWithSHA384 ALGORITHM ::= {  -- IETF RFC 4231
  PARMS         NULL
  IDENTIFIED BY id-hmacWithSHA384 }

hmacWithSHA512 ALGORITHM ::= {  -- IETF RFC 4231
  PARMS         NULL
  IDENTIFIED BY id-hmacWithSHA512 }

END -- AlgorithmObjectIdentifiers

AttributeCertificateDefinitions {joint-iso-itu-t ds(5) module(1) attributeCertificateDefinitions(32) 9}
DEFINITIONS IMPLICIT TAGS ::=
BEGIN

-- EXPORTS ALL

IMPORTS

  id-at, id-ce, id-mr, id-oc
    FROM UsefulDefinitions
     {joint-iso-itu-t ds(5) module(1) usefulDefinitions(0) 9} WITH SUCCESSORS

  ATTRIBUTE, Attribute{}, AttributeType, AttributeTypeAndValue, MATCHING-RULE, Name,
  OBJECT-CLASS, RelativeDistinguishedName, SupportedAttributes, SYNTAX-NAME, top
    FROM InformationFramework
      {joint-iso-itu-t ds(5) module(1) informationFramework(1) 9} WITH SUCCESSORS

--AttributeTypeAndValue
--  FROM BasicAccessControl basicAccessControl

  AlgorithmIdentifier, Certificate, CertificateList, CertificateSerialNumber,
  EXTENSION, Extensions, InfoSyntax, PolicySyntax, SIGNED{}, SupportedAlgorithms,
  x509CertificateList
    FROM AuthenticationFramework
      {joint-iso-itu-t ds(5) module(1) authenticationFramework(7) 9} WITH SUCCESSORS

  TimeSpecification, UnboundedDirectoryString, UniqueIdentifier
    FROM SelectedAttributeTypes
      {joint-iso-itu-t ds(5) module(1) selectedAttributeTypes(5) 9} WITH SUCCESSORS

  certificateListExactMatch, GeneralName, GeneralNames, NameConstraintsSyntax
    FROM CertificateExtensions
      {joint-iso-itu-t ds(5) module(1) certificateExtensions(26) 9} WITH SUCCESSORS ;

-- Unless explicitly noted otherwise, there is no significance to the ordering
-- of components of a SEQUENCE OF construct in this Specification.

-- attribute certificate constructs

AttributeCertificate ::= SIGNED{TBSAttributeCertificate}

TBSAttributeCertificate ::= SEQUENCE {
  version                 AttCertVersion, -- version is v2
  holder                  Holder,
  issuer                  AttCertIssuer,
  signature               AlgorithmIdentifier{{SupportedAlgorithms}},
  serialNumber            CertificateSerialNumber,
  attrCertValidityPeriod  AttCertValidityPeriod,
  attributes              SEQUENCE OF Attribute{{SupportedAttributes}},
  issuerUniqueID          UniqueIdentifier OPTIONAL,
  ...,
  ...,
  extensions              Extensions OPTIONAL
 }  (CONSTRAINED BY { -- shall be DER encoded -- } )

AttCertVersion ::= INTEGER {v2(1)}

Holder ::= SEQUENCE {
  baseCertificateID  [0]  IssuerSerial OPTIONAL,
  entityName         [1]  GeneralNames OPTIONAL,
  objectDigestInfo   [2]  ObjectDigestInfo OPTIONAL }
  (WITH COMPONENTS {..., baseCertificateID  PRESENT } |
   WITH COMPONENTS {..., entityName  PRESENT } |
   WITH COMPONENTS {..., objectDigestInfo  PRESENT } )

IssuerSerial ::= SEQUENCE {
  issuer     GeneralNames,
  serial     CertificateSerialNumber,
  issuerUID  UniqueIdentifier OPTIONAL,
  ... }

ObjectDigestInfo ::= SEQUENCE {
  digestedObjectType   ENUMERATED {
    publicKey        (0),
    publicKeyCert    (1),
    otherObjectTypes (2)},
  otherObjectTypeID   OBJECT IDENTIFIER OPTIONAL,
  digestAlgorithm     AlgorithmIdentifier{{SupportedAlgorithms}},
  objectDigest        BIT STRING,
  ... }

AttCertIssuer ::= [0]  SEQUENCE {
  issuerName              GeneralNames OPTIONAL,
  baseCertificateID  [0]  IssuerSerial OPTIONAL,
  objectDigestInfo   [1]  ObjectDigestInfo OPTIONAL,
  ... }
  (WITH COMPONENTS {..., issuerName  PRESENT } |
   WITH COMPONENTS {..., baseCertificateID  PRESENT } |
   WITH COMPONENTS {..., objectDigestInfo  PRESENT } )

AttCertValidityPeriod ::= SEQUENCE {
  notBeforeTime  GeneralizedTime,
  notAfterTime   GeneralizedTime,
  ... }

AttributeCertificationPath ::= SEQUENCE {
  attributeCertificate  AttributeCertificate,
  acPath                SEQUENCE OF ACPathData OPTIONAL,
  ... }

ACPathData ::= SEQUENCE {
  certificate           [0]  Certificate OPTIONAL,
  attributeCertificate  [1]  AttributeCertificate OPTIONAL,
  ... }

PrivilegePolicy ::= OBJECT IDENTIFIER

-- privilege attributes

role ATTRIBUTE ::= {
  WITH SYNTAX  RoleSyntax
  ID           id-at-role }

RoleSyntax ::= SEQUENCE {
  roleAuthority  [0]  GeneralNames OPTIONAL,
  roleName       [1]  GeneralName,
  ... }

xmlPrivilegeInfo ATTRIBUTE ::= {
  WITH SYNTAX  UTF8String --contains XML-encoded privilege information
  ID           id-at-xMLPrivilegeInfo }

permission ATTRIBUTE ::= {
  WITH SYNTAX             DualStringSyntax
  EQUALITY MATCHING RULE  dualStringMatch
  ID                      id-at-permission }

DualStringSyntax ::= SEQUENCE {
  operation  [0]  UnboundedDirectoryString,
  object     [1]  UnboundedDirectoryString,
  ... }

dualStringMatch MATCHING-RULE ::= {
  SYNTAX  DualStringSyntax
  ID      id-mr-dualStringMatch }

timeSpecification EXTENSION ::= {
  SYNTAX         TimeSpecification
  IDENTIFIED BY  id-ce-timeSpecification }

timeSpecificationMatch MATCHING-RULE ::= {
  SYNTAX  TimeSpecification
  ID      id-mr-timeSpecMatch }

targetingInformation EXTENSION ::= {
  SYNTAX         SEQUENCE SIZE (1..MAX) OF Targets
  IDENTIFIED BY  id-ce-targetingInformation }

Targets ::= SEQUENCE SIZE (1..MAX) OF Target

Target ::= CHOICE {
  targetName   [0]  GeneralName,
  targetGroup  [1]  GeneralName,
  targetCert   [2]  TargetCert,
  ... }

TargetCert ::= SEQUENCE {
  targetCertificate  IssuerSerial,
  targetName         GeneralName OPTIONAL,
  certDigestInfo     ObjectDigestInfo OPTIONAL }

userNotice EXTENSION ::= {
  SYNTAX         SEQUENCE SIZE (1..MAX) OF UserNotice
  IDENTIFIED BY  id-ce-userNotice }

-- Copied from IETF RFC 5280

UserNotice ::= SEQUENCE {
  noticeRef     NoticeReference OPTIONAL,
  explicitText  DisplayText OPTIONAL }

NoticeReference ::= SEQUENCE {
  organization   DisplayText,
  noticeNumbers  SEQUENCE OF INTEGER }

DisplayText ::= CHOICE {
  visibleString  VisibleString(SIZE (1..200)),
  bmpString      BMPString(SIZE (1..200)),
  utf8String     UTF8String(SIZE (1..200)) }

acceptablePrivilegePolicies EXTENSION ::= {
  SYNTAX         AcceptablePrivilegePoliciesSyntax
  IDENTIFIED BY  id-ce-acceptablePrivilegePolicies }

AcceptablePrivilegePoliciesSyntax ::= SEQUENCE SIZE (1..MAX) OF PrivilegePolicy

singleUse EXTENSION ::= {
  SYNTAX         NULL
  IDENTIFIED BY  id-ce-singleUse }

groupAC EXTENSION ::= {
  SYNTAX         NULL
  IDENTIFIED BY  id-ce-groupAC }

noRevAvail EXTENSION ::= {
  SYNTAX         NULL
  IDENTIFIED BY  id-ce-noRevAvail }

sOAIdentifier EXTENSION ::= {
  SYNTAX         NULL
  IDENTIFIED BY  id-ce-sOAIdentifier }

sOAIdentifierMatch MATCHING-RULE ::= {
  SYNTAX  NULL
  ID      id-mr-sOAIdentifierMatch }

attributeDescriptor EXTENSION ::= {
  SYNTAX         AttributeDescriptorSyntax
  IDENTIFIED BY  {id-ce-attributeDescriptor} }

AttributeDescriptorSyntax ::= SEQUENCE {
  identifier             AttributeIdentifier,
  attributeSyntax        OCTET STRING(SIZE (1..MAX)),
  name              [0]  AttributeName OPTIONAL,
  description       [1]  AttributeDescription OPTIONAL,
  dominationRule         PrivilegePolicyIdentifier,
  ... }

AttributeIdentifier ::= ATTRIBUTE.&id({AttributeIDs})

AttributeIDs ATTRIBUTE ::= {...}

AttributeName ::= UTF8String(SIZE (1..MAX))

AttributeDescription ::= UTF8String(SIZE (1..MAX))

PrivilegePolicyIdentifier ::= SEQUENCE {
  privilegePolicy  PrivilegePolicy,
  privPolSyntax    InfoSyntax,
  ... }

attDescriptor MATCHING-RULE ::= {
  SYNTAX  AttributeDescriptorSyntax
  ID      id-mr-attDescriptorMatch }

roleSpecCertIdentifier EXTENSION ::= {
  SYNTAX         RoleSpecCertIdentifierSyntax
  IDENTIFIED BY  {id-ce-roleSpecCertIdentifier} }

RoleSpecCertIdentifierSyntax ::=
  SEQUENCE SIZE (1..MAX) OF RoleSpecCertIdentifier

RoleSpecCertIdentifier ::= SEQUENCE {
  roleName              [0]  GeneralName,
  roleCertIssuer        [1]  GeneralName,
  roleCertSerialNumber  [2]  CertificateSerialNumber OPTIONAL,
  roleCertLocator       [3]  GeneralNames OPTIONAL,
  ... }

roleSpecCertIdMatch MATCHING-RULE ::= {
  SYNTAX  RoleSpecCertIdentifierSyntax
  ID      id-mr-roleSpecCertIdMatch }

basicAttConstraints EXTENSION ::= {
  SYNTAX         BasicAttConstraintsSyntax
  IDENTIFIED BY  {id-ce-basicAttConstraints} }

BasicAttConstraintsSyntax ::= SEQUENCE {
  authority          BOOLEAN DEFAULT FALSE,
  pathLenConstraint  INTEGER(0..MAX) OPTIONAL,
  ... }

basicAttConstraintsMatch MATCHING-RULE ::= {
  SYNTAX  BasicAttConstraintsSyntax
  ID      id-mr-basicAttConstraintsMatch }

delegatedNameConstraints EXTENSION ::= {
  SYNTAX         NameConstraintsSyntax
  IDENTIFIED BY  id-ce-delegatedNameConstraints }

delegatedNameConstraintsMatch MATCHING-RULE ::= {
  SYNTAX  NameConstraintsSyntax
  ID      id-mr-delegatedNameConstraintsMatch }

acceptableCertPolicies EXTENSION ::= {
  SYNTAX         AcceptableCertPoliciesSyntax
  IDENTIFIED BY  id-ce-acceptableCertPolicies }

AcceptableCertPoliciesSyntax ::= SEQUENCE SIZE (1..MAX) OF CertPolicyId

CertPolicyId ::= OBJECT IDENTIFIER

acceptableCertPoliciesMatch MATCHING-RULE ::= {
  SYNTAX  AcceptableCertPoliciesSyntax
  ID      id-mr-acceptableCertPoliciesMatch }

authorityAttributeIdentifier EXTENSION ::= {
  SYNTAX         AuthorityAttributeIdentifierSyntax
  IDENTIFIED BY  {id-ce-authorityAttributeIdentifier} }

AuthorityAttributeIdentifierSyntax ::= SEQUENCE SIZE (1..MAX) OF AuthAttId

AuthAttId ::= IssuerSerial

authAttIdMatch MATCHING-RULE ::= {
  SYNTAX  AuthorityAttributeIdentifierSyntax
  ID      id-mr-authAttIdMatch }

indirectIssuer EXTENSION ::= {
  SYNTAX         NULL
  IDENTIFIED BY  id-ce-indirectIssuer }

issuedOnBehalfOf EXTENSION ::= {
  SYNTAX         GeneralName
  IDENTIFIED BY  id-ce-issuedOnBehalfOf }

noAssertion EXTENSION ::= {
  SYNTAX         NULL
  IDENTIFIED BY  id-ce-noAssertion }

allowedAttributeAssignments EXTENSION ::= {
  SYNTAX         AllowedAttributeAssignments
  IDENTIFIED BY  id-ce-allowedAttributeAssignments }

AllowedAttributeAssignments ::= SET OF SEQUENCE {
  attributes              [0]  SET OF CHOICE {
    attributeType           [0]  AttributeType,
    attributeTypeandValues  [1]  Attribute{{SupportedAttributes}},
    ... },
  holderDomain            [1]  GeneralName,
  ... }

attributeMappings EXTENSION ::= {
  SYNTAX         AttributeMappings
  IDENTIFIED BY  id-ce-attributeMappings }

AttributeMappings ::= SET OF CHOICE {
  typeMappings      [0]  SEQUENCE {
    local             [0]  AttributeType,
    remote            [1]  AttributeType,
    ... },
  typeValueMappings [1]  SEQUENCE {
    local             [0]  AttributeTypeAndValue,
    remote            [1]  AttributeTypeAndValue,
    ... } }

holderNameConstraints EXTENSION ::= {
  SYNTAX         HolderNameConstraintsSyntax
  IDENTIFIED BY  id-ce-holderNameConstraints }

HolderNameConstraintsSyntax ::= SEQUENCE {
  permittedSubtrees  [0]  GeneralSubtrees,
  excludedSubtrees   [1]  GeneralSubtrees OPTIONAL,
  ... }

GeneralSubtrees ::= SEQUENCE SIZE (1..MAX) OF GeneralSubtree

GeneralSubtree ::= SEQUENCE {
  base          GeneralName,
  minimum  [0]  BaseDistance DEFAULT 0,
  maximum  [1]  BaseDistance OPTIONAL,
  ... }

BaseDistance ::= INTEGER(0..MAX)

-- PMI object classes

pmiUser OBJECT-CLASS ::= {
  SUBCLASS OF  {top}
  KIND         auxiliary
  MAY CONTAIN  {attributeCertificateAttribute}
  ID           id-oc-pmiUser }

pmiAA OBJECT-CLASS ::= { -- a PMI AA
  SUBCLASS OF  {top}
  KIND         auxiliary
  MAY CONTAIN  {aACertificate |
                attributeCertificateRevocationList |
                eeAttrCertificateRevocationList |
                attributeAuthorityRevocationList}
  ID           id-oc-pmiAA }

pmiSOA OBJECT-CLASS ::= { -- a PMI Source of Authority
  SUBCLASS OF  {top}
  KIND         auxiliary
  MAY CONTAIN  {attributeCertificateRevocationList |
                eeAttrCertificateRevocationList |
                attributeAuthorityRevocationList |
                attributeDescriptorCertificate}
  ID           id-oc-pmiSOA }

attCertCRLDistributionPt OBJECT-CLASS ::= {
  SUBCLASS OF  {top}
  KIND         auxiliary
  MAY CONTAIN  {attributeCertificateRevocationList |
                eeAttrCertificateRevocationList |
                attributeAuthorityRevocationList}
  ID           id-oc-attCertCRLDistributionPts }

pmiDelegationPath OBJECT-CLASS ::= {
  SUBCLASS OF  {top}
  KIND         auxiliary
  MAY CONTAIN  {delegationPath}
  ID           id-oc-pmiDelegationPath }

privilegePolicy OBJECT-CLASS ::= {
  SUBCLASS OF  {top}
  KIND         auxiliary
  MAY CONTAIN  {privPolicy}
  ID           id-oc-privilegePolicy }

protectedPrivilegePolicy OBJECT-CLASS ::= {
  SUBCLASS OF  {top}
  KIND         auxiliary
  MAY CONTAIN  {protPrivPolicy}
  ID           id-oc-protectedPrivilegePolicy }

-- PMI directory attributes

attributeCertificateAttribute ATTRIBUTE ::= {
  WITH SYNTAX             AttributeCertificate
  EQUALITY MATCHING RULE  attributeCertificateExactMatch
  ID                      id-at-attributeCertificate }

aACertificate ATTRIBUTE ::= {
  WITH SYNTAX             AttributeCertificate
  EQUALITY MATCHING RULE  attributeCertificateExactMatch
  ID                      id-at-aACertificate }

attributeDescriptorCertificate ATTRIBUTE ::= {
  WITH SYNTAX             AttributeCertificate
  EQUALITY MATCHING RULE  attributeCertificateExactMatch
  ID                      id-at-attributeDescriptorCertificate }

attributeCertificateRevocationList ATTRIBUTE ::= {
  WITH SYNTAX             CertificateList
  EQUALITY MATCHING RULE  certificateListExactMatch
  LDAP-SYNTAX             x509CertificateList.&id
  LDAP-NAME               {"AttrCertificateRevocationList"}
  LDAP-DESC               "X.509 Attr certificate revocation list"
  ID                      id-at-attributeCertificateRevocationList }

eeAttrCertificateRevocationList ATTRIBUTE ::= {
  WITH SYNTAX             CertificateList
  EQUALITY MATCHING RULE  certificateListExactMatch
  LDAP-SYNTAX             x509CertificateList.&id
  LDAP-NAME               {"EEAttrCertificateRevocationList"}
  LDAP-DESC               "X.509 EEAttr certificate revocation list"
  ID                      id-at-eeAttrCertificateRevocationList }

attributeAuthorityRevocationList ATTRIBUTE ::= {
  WITH SYNTAX             CertificateList
  EQUALITY MATCHING RULE  certificateListExactMatch
  LDAP-SYNTAX             x509CertificateList.&id
  LDAP-NAME               {"AACertificateRevocationList"}
  LDAP-DESC               "X.509 AA certificate revocation list"
  ID                      id-at-attributeAuthorityRevocationList }

delegationPath ATTRIBUTE ::= {
  WITH SYNTAX  AttCertPath
  ID           id-at-delegationPath }

AttCertPath ::= SEQUENCE OF AttributeCertificate

privPolicy ATTRIBUTE ::= {
  WITH SYNTAX  PolicySyntax
  ID           id-at-privPolicy }

protPrivPolicy ATTRIBUTE ::= {
  WITH SYNTAX             AttributeCertificate
  EQUALITY MATCHING RULE  attributeCertificateExactMatch
  ID                      id-at-protPrivPolicy }

xmlPrivPolicy ATTRIBUTE ::= {
  WITH SYNTAX  UTF8String -- XML-encoded privilege policy information
  ID           id-at-xmlPrivPolicy }

-- Attribute certificate extensions and matching rules

attributeCertificateExactMatch MATCHING-RULE ::= {
  SYNTAX  AttributeCertificateExactAssertion
  ID      id-mr-attributeCertificateExactMatch }

AttributeCertificateExactAssertion ::= SEQUENCE {
  serialNumber  CertificateSerialNumber,
  issuer        AttCertIssuer,
  ... }

attributeCertificateMatch MATCHING-RULE ::= {
  SYNTAX  AttributeCertificateAssertion
  ID      id-mr-attributeCertificateMatch }

AttributeCertificateAssertion ::= SEQUENCE {
  holder             [0]  CHOICE {
    baseCertificateID  [0]  IssuerSerial,
    holderName         [1]  GeneralNames,
    ...} OPTIONAL,
  issuer             [1]  GeneralNames OPTIONAL,
  attCertValidity    [2]  GeneralizedTime OPTIONAL,
  attType            [3]  SET OF AttributeType OPTIONAL,
  ... }

-- At least one component of the sequence shall be present

holderIssuerMatch MATCHING-RULE ::= {
  SYNTAX  HolderIssuerAssertion
  ID      id-mr-holderIssuerMatch }

HolderIssuerAssertion ::= SEQUENCE {
  holder  [0]  Holder OPTIONAL,
  issuer  [1]  AttCertIssuer OPTIONAL,
  ... }

delegationPathMatch MATCHING-RULE ::= {
  SYNTAX  DelMatchSyntax
  ID      id-mr-delegationPathMatch }

DelMatchSyntax ::= SEQUENCE {
  firstIssuer  AttCertIssuer,
  lastHolder   Holder,
  ... }

extensionPresenceMatch MATCHING-RULE ::= {
  SYNTAX  EXTENSION.&id
  ID      id-mr-extensionPresenceMatch }

-- object identifier assignments

-- object classes

id-oc-pmiUser                            OBJECT IDENTIFIER ::= {id-oc 24}
id-oc-pmiAA                              OBJECT IDENTIFIER ::= {id-oc 25}
id-oc-pmiSOA                             OBJECT IDENTIFIER ::= {id-oc 26}
id-oc-attCertCRLDistributionPts          OBJECT IDENTIFIER ::= {id-oc 27}
id-oc-privilegePolicy                    OBJECT IDENTIFIER ::= {id-oc 32}
id-oc-pmiDelegationPath                  OBJECT IDENTIFIER ::= {id-oc 33}
id-oc-protectedPrivilegePolicy           OBJECT IDENTIFIER ::= {id-oc 34}

-- directory attributes

id-at-attributeCertificate               OBJECT IDENTIFIER ::= {id-at 58}
id-at-attributeCertificateRevocationList OBJECT IDENTIFIER ::= {id-at 59}
id-at-aACertificate                      OBJECT IDENTIFIER ::= {id-at 61}
id-at-attributeDescriptorCertificate     OBJECT IDENTIFIER ::= {id-at 62}
id-at-attributeAuthorityRevocationList   OBJECT IDENTIFIER ::= {id-at 63}
id-at-privPolicy                         OBJECT IDENTIFIER ::= {id-at 71}
id-at-role                               OBJECT IDENTIFIER ::= {id-at 72}
id-at-delegationPath                     OBJECT IDENTIFIER ::= {id-at 73}
id-at-protPrivPolicy                     OBJECT IDENTIFIER ::= {id-at 74}
id-at-xMLPrivilegeInfo                   OBJECT IDENTIFIER ::= {id-at 75}
id-at-xmlPrivPolicy                      OBJECT IDENTIFIER ::= {id-at 76}
id-at-permission                         OBJECT IDENTIFIER ::= {id-at 82}
id-at-eeAttrCertificateRevocationList    OBJECT IDENTIFIER ::= {id-at 102}

-- attribute certificate extensions

id-ce-authorityAttributeIdentifier       OBJECT IDENTIFIER ::= {id-ce 38}
id-ce-roleSpecCertIdentifier             OBJECT IDENTIFIER ::= {id-ce 39}
id-ce-basicAttConstraints                OBJECT IDENTIFIER ::= {id-ce 41}
id-ce-delegatedNameConstraints           OBJECT IDENTIFIER ::= {id-ce 42}
id-ce-timeSpecification                  OBJECT IDENTIFIER ::= {id-ce 43}
id-ce-attributeDescriptor                OBJECT IDENTIFIER ::= {id-ce 48}
id-ce-userNotice                         OBJECT IDENTIFIER ::= {id-ce 49}
id-ce-sOAIdentifier                      OBJECT IDENTIFIER ::= {id-ce 50}
id-ce-acceptableCertPolicies             OBJECT IDENTIFIER ::= {id-ce 52}
id-ce-targetingInformation               OBJECT IDENTIFIER ::= {id-ce 55}
id-ce-noRevAvail                         OBJECT IDENTIFIER ::= {id-ce 56}
id-ce-acceptablePrivilegePolicies        OBJECT IDENTIFIER ::= {id-ce 57}
id-ce-indirectIssuer                     OBJECT IDENTIFIER ::= {id-ce 61}
id-ce-noAssertion                        OBJECT IDENTIFIER ::= {id-ce 62}
id-ce-issuedOnBehalfOf                   OBJECT IDENTIFIER ::= {id-ce 64}
id-ce-singleUse                          OBJECT IDENTIFIER ::= {id-ce 65}
id-ce-groupAC                            OBJECT IDENTIFIER ::= {id-ce 66}
id-ce-allowedAttributeAssignments        OBJECT IDENTIFIER ::= {id-ce 67}
id-ce-attributeMappings                  OBJECT IDENTIFIER ::= {id-ce 68}
id-ce-holderNameConstraints              OBJECT IDENTIFIER ::= {id-ce 69}

-- PMI matching rules

id-mr-attributeCertificateMatch          OBJECT IDENTIFIER ::= {id-mr 42}
id-mr-attributeCertificateExactMatch     OBJECT IDENTIFIER ::= {id-mr 45}
id-mr-holderIssuerMatch                  OBJECT IDENTIFIER ::= {id-mr 46}
id-mr-authAttIdMatch                     OBJECT IDENTIFIER ::= {id-mr 53}
id-mr-roleSpecCertIdMatch                OBJECT IDENTIFIER ::= {id-mr 54}
id-mr-basicAttConstraintsMatch           OBJECT IDENTIFIER ::= {id-mr 55}
id-mr-delegatedNameConstraintsMatch      OBJECT IDENTIFIER ::= {id-mr 56}
id-mr-timeSpecMatch                      OBJECT IDENTIFIER ::= {id-mr 57}
id-mr-attDescriptorMatch                 OBJECT IDENTIFIER ::= {id-mr 58}
id-mr-acceptableCertPoliciesMatch        OBJECT IDENTIFIER ::= {id-mr 59}
id-mr-delegationPathMatch                OBJECT IDENTIFIER ::= {id-mr 61}
id-mr-sOAIdentifierMatch                 OBJECT IDENTIFIER ::= {id-mr 66}
id-mr-extensionPresenceMatch             OBJECT IDENTIFIER ::= {id-mr 67}
id-mr-dualStringMatch                    OBJECT IDENTIFIER ::= {id-mr 69}

END -- AttributeCertificateDefinitions

AuthenticationFramework {joint-iso-itu-t ds(5) module(1) authenticationFramework(7) 9}
DEFINITIONS ::=
BEGIN

-- EXPORTS All
/*
The types and values defined in this module are exported for use in the other ASN.1
modules contained within the Directory Specifications, and for the use of other
applications which will use them to access Directory services. Other applications may
use them for their own purposes, but this will not constrain extensions and
modifications needed to maintain or improve the Directory service.
*/
IMPORTS
     id-asx, id-at, id-ldx, id-lsx, id-mr, id-nf, id-oa, id-oc, id-sc
    FROM UsefulDefinitions
      {joint-iso-itu-t ds(5) module(1) usefulDefinitions(0) 9} WITH SUCCESSORS

  ATTRIBUTE, Attribute{}, DistinguishedName, distinguishedNameMatch, MATCHING-RULE, Name, NAME-FORM, OBJECT-CLASS,
  objectIdentifierMatch, RelativeDistinguishedName, SYNTAX-NAME, top
    FROM InformationFramework
      {joint-iso-itu-t ds(5) module(1) informationFramework(1) 9} WITH SUCCESSORS

  bitStringMatch, boolean, booleanMatch, caseExactMatch, commonName,
  directoryString, generalizedTime,
  generalizedTimeMatch, generalizedTimeOrderingMatch, integer, integerMatch,
  integerOrderingMatch, octetString, octetStringMatch,
  UnboundedDirectoryString, UniqueIdentifier, uri
    FROM SelectedAttributeTypes
      {joint-iso-itu-t ds(5) module(1) selectedAttributeTypes(5) 9} WITH SUCCESSORS

  algorithmIdentifierMatch, certificateExactMatch, certificateListExactMatch,
  certificatePairExactMatch, CertificatePoliciesSyntax, CertPolicyId, GeneralNames,
  KeyUsage, pkiPathMatch, policyMatch,
  CertificateAssertion, CertificateExactAssertion, CertificateListAssertion,
  CertificateListExactAssertion, CertificatePairAssertion,
  CertificatePairExactAssertion
      FROM CertificateExtensions
        {joint-iso-itu-t ds(5) module(1) certificateExtensions(26) 9} WITH SUCCESSORS ;

-- parameterized types

SIGNATURE ::= SEQUENCE {
  algorithmIdentifier  AlgorithmIdentifier{{SupportedAlgorithms}},
  signature            BIT STRING,
  ... }

SIGNED{ToBeSigned} ::= SEQUENCE {
  toBeSigned              ToBeSigned,
  algorithmIdentifier     AlgorithmIdentifier{{SupportedAlgorithms}},
  signature               BIT STRING,
  ...,
[[4:
  altAlgorithmIdentifier  AlgorithmIdentifier{{SupportedAltAlgorithms}} OPTIONAL,
  altSignature            BIT STRING OPTIONAL]]
  } (WITH COMPONENTS {..., altAlgorithmIdentifier PRESENT, altSignature PRESENT } |
     WITH COMPONENTS {..., altAlgorithmIdentifier ABSENT,  altSignature ABSENT } )

HASH{ToBeHashed} ::= SEQUENCE {
  algorithmIdentifier  AlgorithmIdentifier{{SupportedAlgorithms}},
  hashValue            BIT STRING (CONSTRAINED BY {
   -- shall be the result of applying a hashing procedure to the DER-encoded
   -- octets of a value of -- ToBeHashed } ),
  ... }

ENCRYPTED{ToBeEnciphered} ::= BIT STRING (CONSTRAINED BY {
   -- shall be the result of applying an encipherment procedure
   -- to the BER-encoded octets of a value of -- ToBeEnciphered } )

ENCRYPTED-HASH{ToBeSigned} ::= BIT STRING (CONSTRAINED BY {
  -- shall be the result of applying a hashing procedure to the DER-encoded (see 6.2)
  -- octets of a value of -- ToBeSigned -- and then applying an encipherment procedure
  -- to those octets -- } )

ALGORITHM ::= CLASS {
  &Type          OPTIONAL,
  &id            OBJECT IDENTIFIER UNIQUE }
WITH SYNTAX {
  [PARMS         &Type]
  IDENTIFIED BY  &id }

AlgorithmIdentifier{ALGORITHM:SupportedAlgorithms} ::= SEQUENCE {
  algorithm       ALGORITHM.&id({SupportedAlgorithms}),
  parameters      ALGORITHM.&Type({SupportedAlgorithms}{@algorithm}) OPTIONAL,
  ... }


/* The definitions of the following information object sets are deferred to referencing
specifications having a requirement for specific information object sets.*/

SupportedAlgorithms ALGORITHM ::= {...}
SupportedAltAlgorithms ALGORITHM ::= {...}

FingerPrint {ToBeFingerprinted} ::= SEQUENCE {
  algorithmIdentifier  AlgorithmIdentifier{{SupportedAlgorithms}},
  fingerprint          BIT STRING,
  ... }

ecPublicKey ALGORITHM ::= {  -- copied IETF RFC 5480
  PARMS       SupportedCurves
  IDENTIFIED  BY id-ecPublicKey }

id-ecPublicKey OBJECT IDENTIFIER ::= {iso(1) member-body(2) us(840) ansi-X9-62(10045)
                                      keyType(2) 1 }

/* The definitions of the following information value set is deferred to referencing
specifications having a requirement for specific value sets.*/

SupportedCurves OBJECT IDENTIFIER ::= {dummyCurv, ...}

dummyCurv OBJECT IDENTIFIER ::= {2 5 5}

-- public-key certificate definition

Certificate ::= SIGNED{TBSCertificate}

TBSCertificate ::= SEQUENCE {
  version                  [0]  Version DEFAULT v1,
  serialNumber                  CertificateSerialNumber,
  signature                     AlgorithmIdentifier{{SupportedAlgorithms}},
  issuer                        Name,
  validity                      Validity,
  subject                       Name,
  subjectPublicKeyInfo          SubjectPublicKeyInfo,
  issuerUniqueIdentifier   [1] IMPLICIT UniqueIdentifier OPTIONAL,
  ...,
  [[2:  -- if present, version shall be v2 or v3
  subjectUniqueIdentifier  [2] IMPLICIT UniqueIdentifier OPTIONAL]],
  [[3:  -- if present, version shall be v2 or v3
  extensions               [3]  Extensions OPTIONAL ]]
  -- If present, version shall be v3]]
 } (CONSTRAINED BY { -- shall be DER encoded -- } )

Version ::= INTEGER {v1(0), v2(1), v3(2)}

CertificateSerialNumber ::= INTEGER

Validity ::= SEQUENCE {
  notBefore  Time,
  notAfter   Time,
  ... }

SubjectPublicKeyInfo ::= SEQUENCE {
  algorithm         AlgorithmIdentifier{{SupportedAlgorithms}},
  subjectPublicKey  PublicKey,
  ... }

PublicKey ::= BIT STRING

Time ::= CHOICE {
  utcTime          UTCTime,
  generalizedTime  GeneralizedTime }

Extensions ::= SEQUENCE SIZE (1..MAX) OF Extension

-- For those extensions where ordering of individual extensions within the SEQUENCE is
-- significant, the specification of those individual extensions shall include the
-- rules for the significance of the order therein

Extension ::= SEQUENCE {
  extnId     EXTENSION.&id({ExtensionSet}),
  critical   BOOLEAN DEFAULT FALSE,
  extnValue  OCTET STRING
    (CONTAINING EXTENSION.&ExtnType({ExtensionSet}{@extnId})
       ENCODED BY der),
  ... }

der OBJECT IDENTIFIER ::=
  {joint-iso-itu-t asn1(1) ber-derived(2) distinguished-encoding(1)}

ExtensionSet EXTENSION ::= {...}

EXTENSION ::= CLASS {
  &id           OBJECT IDENTIFIER UNIQUE,
  &ExtnType }
WITH SYNTAX {
  SYNTAX        &ExtnType
  IDENTIFIED BY &id }

-- other PKI certificate constructs

Certificates ::= SEQUENCE {
  userCertificate    Certificate,
  certificationPath  ForwardCertificationPath OPTIONAL,
  ... }

ForwardCertificationPath ::= SEQUENCE SIZE (1..MAX) OF CrossCertificates

CrossCertificates ::= SET SIZE (1..MAX) OF Certificate

CertificationPath ::= SEQUENCE {
  userCertificate    Certificate,
  theCACertificates  SEQUENCE SIZE (1..MAX) OF CertificatePair OPTIONAL,
  ... }

PkiPath ::= SEQUENCE SIZE (1..MAX) OF Certificate

-- certificate revocation list (CRL)

CertificateList ::= SIGNED{CertificateListContent}

CertificateListContent ::= SEQUENCE {
  version              Version OPTIONAL,
  -- if present, version shall be v2
  signature            AlgorithmIdentifier{{SupportedAlgorithms}},
  issuer               Name,
  thisUpdate           Time,
  nextUpdate           Time OPTIONAL,
  revokedCertificates  SEQUENCE OF SEQUENCE {
    serialNumber         CertificateSerialNumber,
    revocationDate       Time,
    crlEntryExtensions   Extensions OPTIONAL,
    ...} OPTIONAL,
  ...,
  ...,
  crlExtensions   [0]  Extensions OPTIONAL }

CertAVL ::= SIGNED {TBSCertAVL}

TBSCertAVL ::= SEQUENCE {
  version               [0]  IMPLICIT Version DEFAULT v1,
  serialNumber               AvlSerialNumber OPTIONAL,
  signature                  AlgorithmIdentifier {{SupportedAlgorithms}},
  issuer                     Name,
  constrained                BOOLEAN,
  entries                    SEQUENCE (SIZE (1..MAX)) OF SEQUENCE {
    idType                     CHOICE {
      certIdentifier        [0]  PKCertIdentifier,
      entityGroup                DistinguishedName, -- only for constrained = FALSE
      ... },
    scope                 [0]  IMPLICIT ScopeRestrictions OPTIONAL,
    entryExtensions       [1]  IMPLICIT Extensions OPTIONAL,
    ... },
  ...,
  ...,
  avlExtensions              Extensions OPTIONAL }

AvlSerialNumber ::= INTEGER (0..MAX)

PKCertIdentifier ::= CHOICE {
  issuerSerialNumber         IssuerSerialNumber,
  fingerprintPKC        [0]  IMPLICIT FingerPrint {Certificate},
  fingerprintPK         [1]  IMPLICIT FingerPrint {PublicKey},
  ... }

IssuerSerialNumber ::= SEQUENCE {
  issuer        Name,
  serialNumber  CertificateSerialNumber,
  ... }

ScopeRestrictions ::= SEQUENCE OF ScopeRestriction

SCOPE-RESTRICTION ::= TYPE-IDENTIFIER

ScopeRestriction ::= SEQUENCE {
  id            SCOPE-RESTRICTION.&id,
  restriction   SCOPE-RESTRICTION.&Type,
  ... }

-- PKI object classes

pkiUser OBJECT-CLASS ::= {
  SUBCLASS OF         {top}
  KIND                auxiliary
  MAY CONTAIN         {userCertificate}
  LDAP-NAME           {"pkiUser"}
  LDAP-DESC           "X.509 PKI User"
  ID                  id-oc-pkiUser }

pkiCA OBJECT-CLASS ::= {
  SUBCLASS OF         {top}
  KIND                auxiliary
  MAY CONTAIN         {cACertificate |
                       certificateRevocationList |
                       eepkCertificateRevocationList |
                       authorityRevocationList |
                       crossCertificatePair}
  LDAP-NAME           {"pkiCA"}
  LDAP-DESC           "X.509 PKI Certificate Authority"
  ID                  id-oc-pkiCA }

cRLDistributionPoint OBJECT-CLASS ::= {
  SUBCLASS OF         {top}
  KIND                structural
  MUST CONTAIN        {commonName}
  MAY CONTAIN         {certificateRevocationList |
                       eepkCertificateRevocationList |
                       authorityRevocationList |
                       deltaRevocationList}
  LDAP-NAME           {"cRLDistributionPoint"}
  LDAP-DESC           "X.509 CRL distribution point"
  ID                  id-oc-cRLDistributionPoint }

cRLDistPtNameForm NAME-FORM ::= {
  NAMES               cRLDistributionPoint
  WITH ATTRIBUTES     {commonName}
  ID                  id-nf-cRLDistPtNameForm }

deltaCRL OBJECT-CLASS ::= {
  SUBCLASS OF         {top}
  KIND                auxiliary
  MAY CONTAIN         {deltaRevocationList}
  LDAP-NAME           {"deltaCRL"}
  LDAP-DESC           "X.509 delta CRL"
  ID                  id-oc-deltaCRL }

cpCps OBJECT-CLASS ::= {
  SUBCLASS OF         {top}
  KIND                auxiliary
  MAY CONTAIN         {certificatePolicy |
                       certificationPracticeStmt}
  LDAP-NAME           {"cpCps"}
  LDAP-DESC           "Certificate Policy and Certification Practice Statement"
  ID                  id-oc-cpCps }

pkiCertPath OBJECT-CLASS ::= {
  SUBCLASS OF         {top}
  KIND                auxiliary
  MAY CONTAIN         {pkiPath}
  LDAP-NAME           {"pkiCertPath"}
  LDAP-DESC           "PKI Certification Path"
  ID                  id-oc-pkiCertPath }

-- PKI directory attributes

userCertificate ATTRIBUTE ::= {
  WITH SYNTAX              Certificate
  EQUALITY MATCHING RULE   certificateExactMatch
  LDAP-SYNTAX              x509Certificate.&id
  LDAP-NAME                {"userCertificate"}
  LDAP-DESC                "X.509 user certificate"
  ID                       id-at-userCertificate }

cACertificate ATTRIBUTE ::= {
  WITH SYNTAX              Certificate
  EQUALITY MATCHING RULE   certificateExactMatch
  LDAP-SYNTAX              x509Certificate.&id
  LDAP-NAME                {"cACertificate"}
  LDAP-DESC                "X.509 CA certificate"
  ID                       id-at-cAcertificate }

crossCertificatePair ATTRIBUTE ::= {
  WITH SYNTAX              CertificatePair
  EQUALITY MATCHING RULE   certificatePairExactMatch
  LDAP-SYNTAX              x509CertificatePair.&id
  LDAP-NAME                {"crossCertificatePair"}
  LDAP-DESC                "X.509 cross certificate pair"
  ID                       id-at-crossCertificatePair }

CertificatePair ::= SEQUENCE {
  issuedToThisCA  [0]  Certificate OPTIONAL,
  issuedByThisCA  [1]  Certificate OPTIONAL,
  ... }
  (WITH COMPONENTS { ..., issuedToThisCA PRESENT} |
   WITH COMPONENTS { ..., issuedByThisCA PRESENT})

certificateRevocationList ATTRIBUTE ::= {
  WITH SYNTAX              CertificateList
  EQUALITY MATCHING RULE   certificateListExactMatch
  LDAP-SYNTAX              x509CertificateList.&id
  LDAP-NAME                {"certificateRevocationList"}
  LDAP-DESC                "X.509 certificate revocation list"
  ID                       id-at-certificateRevocationList }

eepkCertificateRevocationList ATTRIBUTE ::= {
  WITH SYNTAX              CertificateList
  EQUALITY MATCHING RULE   certificateListExactMatch
  LDAP-SYNTAX              x509CertificateList.&id
  LDAP-NAME                {"eepkCertificateRevocationList"}
  LDAP-DESC                "X.509 EEPK certificate revocation list"
  ID                       id-at-eepkCertificateRevocationList }

authorityRevocationList ATTRIBUTE ::= {
  WITH SYNTAX              CertificateList
  EQUALITY MATCHING RULE   certificateListExactMatch
  LDAP-SYNTAX              x509CertificateList.&id
  LDAP-NAME                {"authorityRevocationList"}
  LDAP-DESC                "X.509 authority revocation list"
  ID                       id-at-authorityRevocationList }

deltaRevocationList ATTRIBUTE ::= {
  WITH SYNTAX              CertificateList
  EQUALITY MATCHING RULE   certificateListExactMatch
  LDAP-SYNTAX              x509CertificateList.&id
  LDAP-NAME                {"deltaRevocationList"}
  LDAP-DESC                "X.509 delta revocation list"
  ID                       id-at-deltaRevocationList }

supportedAlgorithms ATTRIBUTE ::= {
  WITH SYNTAX              SupportedAlgorithm
  EQUALITY MATCHING RULE   algorithmIdentifierMatch
  LDAP-SYNTAX              x509SupportedAlgorithm.&id
  LDAP-NAME                {"supportedAlgorithms"}
  LDAP-DESC                "X.509 support algorithms"
  ID                       id-at-supportedAlgorithms }

SupportedAlgorithm ::= SEQUENCE {
  algorithmIdentifier              AlgorithmIdentifier{{SupportedAlgorithms}},
  intendedUsage               [0]  KeyUsage OPTIONAL,
  intendedCertificatePolicies [1]  CertificatePoliciesSyntax OPTIONAL,
  ... }

certificationPracticeStmt ATTRIBUTE ::= {
  WITH SYNTAX  InfoSyntax
  ID           id-at-certificationPracticeStmt }

InfoSyntax ::= CHOICE {
  content  UnboundedDirectoryString,
  pointer  SEQUENCE {
    name     GeneralNames,
    hash     HASH{HashedPolicyInfo} OPTIONAL,
    ... },
  ... }

POLICY ::= TYPE-IDENTIFIER

HashedPolicyInfo ::= POLICY.&Type({Policies})

Policies POLICY ::= {...} -- Defined by implementors

certificatePolicy ATTRIBUTE ::= {
  WITH SYNTAX             PolicySyntax
  EQUALITY MATCHING RULE  policyMatch
  ID                      id-at-certificatePolicy }

PolicySyntax ::= SEQUENCE {
  policyIdentifier  PolicyID,
  policySyntax      InfoSyntax,
  ... }

PolicyID ::= CertPolicyId

pkiPath ATTRIBUTE ::= {
  WITH SYNTAX              PkiPath
  EQUALITY MATCHING RULE   pkiPathMatch
  ID                       id-at-pkiPath }

supportedPublicKeyAlgorithms ATTRIBUTE ::= {
  WITH SYNTAX            SupportedPublicKeyAlgorithms
  EQUALITY MATCHING RULE algorithmIdentifierMatch
  LDAP-SYNTAX            x509SupportedPublicKeyAlgos.&id
  LDAP-NAME              {"supportedPublicKeyAlgorithms"}
  LDAP-DESC              "X.509 supported publiv key algorithms"
  ID                     id-at-supportedPublicKeyAlgorithms }

SupportedPublicKeyAlgorithms ::= SEQUENCE {
  algorithmIdentifier      AlgorithmIdentifier{{SupportedPublicKeyAlgos}},
  minKeySize               INTEGER,
  extensions          [0]  SEQUENCE SIZE (1..MAX) OF OidOrAttr OPTIONAL,
  ... }

SupportedPublicKeyAlgos ALGORITHM ::= {...}

OidOrAttr ::= CHOICE {
  oid       ATTRIBUTE.&id ({ ExtAttributes }),
  attribute Attribute {{ ExtAttributes }},
  ... }

ExtAttributes ATTRIBUTE ::= {...}

userPassword ATTRIBUTE ::= {
  WITH SYNTAX              OCTET STRING(SIZE (0..MAX))
  EQUALITY MATCHING RULE   octetStringMatch
  LDAP-SYNTAX              octetString.&id
  LDAP-NAME                {"userPassword"}
  ID                       id-at-userPassword }

-- LDAP attribute syntaxes defined by this Specification

x509SupportedPublicKeyAlgos SYNTAX-NAME ::= {
  LDAP-DESC         "X.509 supported publiv key algorithms"
  DIRECTORY SYNTAX  SupportedPublicKeyAlgorithms
  ID                id-asx-x509SupportedPublicKeyAlgos }
-- LDAP syntaxes defined by IETF RFC 4523

x509Certificate SYNTAX-NAME ::= {
  LDAP-DESC         "X.509 Certificate"
  DIRECTORY SYNTAX  Certificate
  ID                id-lsx-x509Certificate }

x509CertificateList SYNTAX-NAME ::= {
  LDAP-DESC         "X.509 Certificate List"
  DIRECTORY SYNTAX  CertificateList
  ID                id-lsx-x509CertificateList }

x509CertificatePair SYNTAX-NAME ::= {
  LDAP-DESC         "X.509 Certificate Pair"
  DIRECTORY SYNTAX  CertificatePair
  ID                id-lsx-x509CertificatePair }

x509SupportedAlgorithm SYNTAX-NAME ::= {
  LDAP-DESC         "X.509 Supported Algorithm"
  DIRECTORY SYNTAX  SupportedAlgorithm
  ID                id-lsx-x509SupportedAlgorithm }

-- object identifier assignments

-- object classes

id-oc-cRLDistributionPoint          OBJECT IDENTIFIER ::= {id-oc 19}
id-oc-pkiUser                       OBJECT IDENTIFIER ::= {id-oc 21}
id-oc-pkiCA                         OBJECT IDENTIFIER ::= {id-oc 22}
id-oc-deltaCRL                      OBJECT IDENTIFIER ::= {id-oc 23}
id-oc-cpCps                         OBJECT IDENTIFIER ::= {id-oc 30}
id-oc-pkiCertPath                   OBJECT IDENTIFIER ::= {id-oc 31}

-- name forms

id-nf-cRLDistPtNameForm             OBJECT IDENTIFIER ::= {id-nf 14}

-- directory attributes

id-at-userPassword                  OBJECT IDENTIFIER ::= {id-at 35}
id-at-userCertificate               OBJECT IDENTIFIER ::= {id-at 36}
id-at-cAcertificate                 OBJECT IDENTIFIER ::= {id-at 37}
id-at-authorityRevocationList       OBJECT IDENTIFIER ::= {id-at 38}
id-at-certificateRevocationList     OBJECT IDENTIFIER ::= {id-at 39}
id-at-crossCertificatePair          OBJECT IDENTIFIER ::= {id-at 40}
id-at-supportedAlgorithms           OBJECT IDENTIFIER ::= {id-at 52}
id-at-deltaRevocationList           OBJECT IDENTIFIER ::= {id-at 53}
id-at-certificationPracticeStmt     OBJECT IDENTIFIER ::= {id-at 68}
id-at-certificatePolicy             OBJECT IDENTIFIER ::= {id-at 69}
id-at-pkiPath                       OBJECT IDENTIFIER ::= {id-at 70}
id-at-eepkCertificateRevocationList OBJECT IDENTIFIER ::= {id-at 101}
id-at-supportedPublicKeyAlgorithms  OBJECT IDENTIFIER ::= {id-at 103}

-- Syntaxes defined by this Specification

id-asx-x509SupportedPublicKeyAlgos  OBJECT IDENTIFIER ::= {id-asx 10}

-- LDAP defined syntaxes

id-lsx-x509Certificate              OBJECT IDENTIFIER ::= {id-lsx 8}
id-lsx-x509CertificateList          OBJECT IDENTIFIER ::= {id-lsx 9}
id-lsx-x509CertificatePair          OBJECT IDENTIFIER ::= {id-lsx 10}
id-lsx-x509SupportedAlgorithm       OBJECT IDENTIFIER ::= {id-lsx 49}

END -- AuthenticationFramework

CertificateExtensions {joint-iso-itu-t ds(5) module(1) certificateExtensions(26) 9}
DEFINITIONS IMPLICIT TAGS ::=
BEGIN

-- EXPORTS ALL

IMPORTS

  id-at, id-ce, id-ldx, id-mr
    FROM UsefulDefinitions
      {joint-iso-itu-t ds(5) module(1) usefulDefinitions(0) 9} WITH SUCCESSORS

  Name, RelativeDistinguishedName, Attribute{}, MATCHING-RULE,
  SupportedAttributes, SYNTAX-NAME
    FROM InformationFramework
      {joint-iso-itu-t ds(5) module(1) informationFramework(1) 9} WITH SUCCESSORS

  AvlSerialNumber, CertificateSerialNumber, CertificateList, AlgorithmIdentifier{},
  EXTENSION, Time, PolicyID, SupportedAlgorithms
    FROM AuthenticationFramework
      {joint-iso-itu-t ds(5) module(1) authenticationFramework(7) 9} WITH SUCCESSORS

  UnboundedDirectoryString
    FROM SelectedAttributeTypes
      {joint-iso-itu-t ds(5) module(1) selectedAttributeTypes(5) 9} WITH SUCCESSORS

  ORAddress
    FROM PkiPmiExternalDataTypes
      {joint-iso-itu-t ds(5) module(1) pkiPmiExternalDataTypes(40) 9} WITH SUCCESSORS ;

-- Unless explicitly noted otherwise, there is no significance to the ordering
-- of components of a SEQUENCE OF construct in this Specification.

-- public-key certificate and CRL extensions

authorityKeyIdentifier EXTENSION ::= {
  SYNTAX         AuthorityKeyIdentifier
  IDENTIFIED BY  id-ce-authorityKeyIdentifier }

AuthorityKeyIdentifier ::= SEQUENCE {
  keyIdentifier              [0]  KeyIdentifier OPTIONAL,
  authorityCertIssuer        [1]  GeneralNames OPTIONAL,
  authorityCertSerialNumber  [2]  CertificateSerialNumber OPTIONAL,
  ... }
  (WITH COMPONENTS {..., authorityCertIssuer        PRESENT,
                         authorityCertSerialNumber  PRESENT } |
   WITH COMPONENTS {..., authorityCertIssuer        ABSENT,
                         authorityCertSerialNumber  ABSENT } )

KeyIdentifier ::= OCTET STRING

subjectKeyIdentifier EXTENSION ::= {
  SYNTAX         SubjectKeyIdentifier
  IDENTIFIED BY  id-ce-subjectKeyIdentifier }

SubjectKeyIdentifier ::= KeyIdentifier

keyUsage EXTENSION ::= {
  SYNTAX         KeyUsage
  IDENTIFIED BY  id-ce-keyUsage }

KeyUsage ::= BIT STRING {
  digitalSignature  (0),
  contentCommitment (1),
  keyEncipherment   (2),
  dataEncipherment  (3),
  keyAgreement      (4),
  keyCertSign       (5),
  cRLSign           (6),
  encipherOnly      (7),
  decipherOnly      (8) }

extKeyUsage EXTENSION ::= {
  SYNTAX         SEQUENCE SIZE (1..MAX) OF KeyPurposeId
  IDENTIFIED BY  id-ce-extKeyUsage }

KeyPurposeId ::= OBJECT IDENTIFIER

privateKeyUsagePeriod EXTENSION ::= {
  SYNTAX         PrivateKeyUsagePeriod
  IDENTIFIED BY  id-ce-privateKeyUsagePeriod }

PrivateKeyUsagePeriod ::= SEQUENCE {
  notBefore  [0]  GeneralizedTime OPTIONAL,
  notAfter   [1]  GeneralizedTime OPTIONAL,
  ... }
  (WITH COMPONENTS {..., notBefore  PRESENT } |
   WITH COMPONENTS {..., notAfter   PRESENT } )

certificatePolicies EXTENSION ::= {
  SYNTAX         CertificatePoliciesSyntax
  IDENTIFIED BY  id-ce-certificatePolicies }

CertificatePoliciesSyntax ::= SEQUENCE SIZE (1..MAX) OF PolicyInformation

PolicyInformation ::= SEQUENCE {
  policyIdentifier  CertPolicyId,
  policyQualifiers  SEQUENCE SIZE (1..MAX) OF PolicyQualifierInfo OPTIONAL,
  ... }

CertPolicyId ::= OBJECT IDENTIFIER

PolicyQualifierInfo ::= SEQUENCE {
  policyQualifierId  CERT-POLICY-QUALIFIER.&id({SupportedPolicyQualifiers}),
  qualifier          CERT-POLICY-QUALIFIER.&Qualifier
              ({SupportedPolicyQualifiers}{@policyQualifierId}) OPTIONAL,
  ... }

SupportedPolicyQualifiers CERT-POLICY-QUALIFIER ::= {...}

anyPolicy OBJECT IDENTIFIER ::= {id-ce-certificatePolicies 0}

CERT-POLICY-QUALIFIER ::= CLASS {
  &id                  OBJECT IDENTIFIER UNIQUE,
  &Qualifier           OPTIONAL }
WITH SYNTAX {
  POLICY-QUALIFIER-ID &id
  [QUALIFIER-TYPE     &Qualifier] }

policyMappings EXTENSION ::= {
  SYNTAX         PolicyMappingsSyntax
  IDENTIFIED BY  id-ce-policyMappings }

PolicyMappingsSyntax ::= SEQUENCE SIZE (1..MAX) OF SEQUENCE {
  issuerDomainPolicy   CertPolicyId,
  subjectDomainPolicy  CertPolicyId,
  ... }

authorizationValidation EXTENSION ::= {
  SYNTAX         AvlId
  IDENTIFIED BY  id-ce-authorizationValidation }

AvlId ::= SEQUENCE {
  issuer        Name,
  serialNumber  AvlSerialNumber OPTIONAL,
  ... }

subjectAltName EXTENSION ::= {
  SYNTAX         GeneralNames
  IDENTIFIED BY  id-ce-subjectAltName }

GeneralNames ::= SEQUENCE SIZE (1..MAX) OF GeneralName

GeneralName ::= CHOICE {
  otherName                  [0]  INSTANCE OF OTHER-NAME,
  rfc822Name                 [1]  IA5String,
  dNSName                    [2]  IA5String,
  x400Address                [3]  ORAddress,
  directoryName              [4]  Name,
  ediPartyName               [5]  EDIPartyName,
  uniformResourceIdentifier  [6]  IA5String,
  iPAddress                  [7]  OCTET STRING,
  registeredID               [8]  OBJECT IDENTIFIER,
  ... }

OTHER-NAME ::= TYPE-IDENTIFIER

EDIPartyName ::= SEQUENCE {
  nameAssigner  [0]  UnboundedDirectoryString OPTIONAL,
  partyName     [1]  UnboundedDirectoryString,
  ... }

issuerAltName EXTENSION ::= {
  SYNTAX         GeneralNames
  IDENTIFIED BY  id-ce-issuerAltName }

subjectDirectoryAttributes EXTENSION ::= {
  SYNTAX         AttributesSyntax
  IDENTIFIED BY  id-ce-subjectDirectoryAttributes }

AttributesSyntax ::= SEQUENCE SIZE (1..MAX) OF Attribute{{SupportedAttributes}}

associatedInformation EXTENSION ::= {
  SYNTAX         AttributesSyntax
  IDENTIFIED BY  id-ce-associatedInformation }

basicConstraints EXTENSION ::= {
  SYNTAX         BasicConstraintsSyntax
  IDENTIFIED BY  id-ce-basicConstraints }

BasicConstraintsSyntax ::= SEQUENCE {
  cA                 BOOLEAN DEFAULT FALSE,
  pathLenConstraint  INTEGER(0..MAX) OPTIONAL,
  ... }

nameConstraints EXTENSION ::= {
  SYNTAX         NameConstraintsSyntax
  IDENTIFIED BY  id-ce-nameConstraints }

NameConstraintsSyntax ::= SEQUENCE {
  permittedSubtrees  [0]  GeneralSubtrees OPTIONAL,
  excludedSubtrees   [1]  GeneralSubtrees OPTIONAL,
  ... }
  (WITH COMPONENTS {..., permittedSubtrees  PRESENT } |
   WITH COMPONENTS {..., excludedSubtrees   PRESENT } )

GeneralSubtrees ::= SEQUENCE SIZE (1..MAX) OF GeneralSubtree

GeneralSubtree ::= SEQUENCE {
  base          GeneralName,
  minimum  [0]  BaseDistance DEFAULT 0,
  maximum  [1]  BaseDistance OPTIONAL,
  ... }

BaseDistance ::= INTEGER(0..MAX)

policyConstraints EXTENSION ::= {
  SYNTAX         PolicyConstraintsSyntax
  IDENTIFIED BY  id-ce-policyConstraints }

PolicyConstraintsSyntax ::= SEQUENCE {
  requireExplicitPolicy  [0]  SkipCerts OPTIONAL,
  inhibitPolicyMapping   [1]  SkipCerts OPTIONAL,
  ... }
  (WITH COMPONENTS {..., requireExplicitPolicy PRESENT } |
   WITH COMPONENTS {..., inhibitPolicyMapping  PRESENT } )

SkipCerts ::= INTEGER(0..MAX)

inhibitAnyPolicy EXTENSION ::= {
  SYNTAX         SkipCerts
  IDENTIFIED BY  id-ce-inhibitAnyPolicy }

cRLNumber EXTENSION ::= {
  SYNTAX         CRLNumber
  IDENTIFIED BY  id-ce-cRLNumber }

CRLNumber ::= INTEGER(0..MAX)

crlScope EXTENSION ::= {
  SYNTAX         CRLScopeSyntax
  IDENTIFIED BY  id-ce-cRLScope }

CRLScopeSyntax ::= SEQUENCE SIZE (1..MAX) OF PerAuthorityScope

PerAuthorityScope ::= SEQUENCE {
  authorityName       [0]  GeneralName OPTIONAL,
  distributionPoint   [1]  DistributionPointName OPTIONAL,
  onlyContains        [2]  OnlyCertificateTypes OPTIONAL,
  onlySomeReasons     [4]  ReasonFlags OPTIONAL,
  serialNumberRange   [5]  NumberRange OPTIONAL,
  subjectKeyIdRange   [6]  NumberRange OPTIONAL,
  nameSubtrees        [7]  GeneralNames OPTIONAL,
  baseRevocationInfo  [9]  BaseRevocationInfo OPTIONAL,
  ... }

OnlyCertificateTypes ::= BIT STRING {
  user      (0),
  authority (1),
  attribute (2)}

NumberRange ::= SEQUENCE {
  startingNumber  [0]  INTEGER OPTIONAL,
  endingNumber    [1]  INTEGER OPTIONAL,
  modulus              INTEGER OPTIONAL,
  ... }

BaseRevocationInfo ::= SEQUENCE {
  cRLStreamIdentifier  [0]  CRLStreamIdentifier OPTIONAL,
  cRLNumber            [1]  CRLNumber,
  baseThisUpdate       [2]  GeneralizedTime,
  ... }

statusReferrals EXTENSION ::= {
  SYNTAX         StatusReferrals
  IDENTIFIED BY  id-ce-statusReferrals }

StatusReferrals ::= SEQUENCE SIZE (1..MAX) OF StatusReferral

StatusReferral ::= CHOICE {
  cRLReferral    [0]  CRLReferral,
  otherReferral  [1]  INSTANCE OF OTHER-REFERRAL,
  ... }

CRLReferral ::= SEQUENCE {
  issuer          [0]  GeneralName OPTIONAL,
  location        [1]  GeneralName OPTIONAL,
  deltaRefInfo    [2]  DeltaRefInfo OPTIONAL,
  cRLScope             CRLScopeSyntax,
  lastUpdate      [3]  GeneralizedTime OPTIONAL,
  lastChangedCRL  [4]  GeneralizedTime OPTIONAL,
  ...
}

DeltaRefInfo ::= SEQUENCE {
  deltaLocation  GeneralName,
  lastDelta      GeneralizedTime OPTIONAL,
  ... }

OTHER-REFERRAL ::= TYPE-IDENTIFIER

cRLStreamIdentifier EXTENSION ::= {
  SYNTAX         CRLStreamIdentifier
  IDENTIFIED BY  id-ce-cRLStreamIdentifier }

CRLStreamIdentifier ::= INTEGER (0..MAX)

orderedList EXTENSION ::= {
  SYNTAX         OrderedListSyntax
  IDENTIFIED BY  id-ce-orderedList }

OrderedListSyntax ::= ENUMERATED {
  ascSerialNum (0),
  ascRevDate   (1),
  ...}

deltaInfo EXTENSION ::= {
  SYNTAX         DeltaInformation
  IDENTIFIED BY  id-ce-deltaInfo }

DeltaInformation ::= SEQUENCE {
  deltaLocation  GeneralName,
  nextDelta      GeneralizedTime OPTIONAL,
  ... }

toBeRevoked EXTENSION ::= {
  SYNTAX         ToBeRevokedSyntax
  IDENTIFIED BY  id-ce-toBeRevoked }

ToBeRevokedSyntax ::= SEQUENCE SIZE (1..MAX) OF ToBeRevokedGroup

ToBeRevokedGroup ::= SEQUENCE {
  certificateIssuer  [0]  GeneralName OPTIONAL,
  reasonInfo         [1]  ReasonInfo OPTIONAL,
  revocationTime          GeneralizedTime,
  certificateGroup        CertificateGroup,
  ... }

ReasonInfo ::= SEQUENCE {
  reasonCode           CRLReason,
  holdInstructionCode  HoldInstruction OPTIONAL,
  ... }

CertificateGroup ::= CHOICE {
  serialNumbers      [0]  CertificateSerialNumbers,
  serialNumberRange  [1]  CertificateGroupNumberRange,
  nameSubtree        [2]  GeneralName,
  ... }

CertificateGroupNumberRange ::= SEQUENCE {
  startingNumber  [0]  INTEGER,
  endingNumber    [1]  INTEGER,
  ... }

CertificateSerialNumbers ::= SEQUENCE SIZE (1..MAX) OF CertificateSerialNumber

revokedGroups EXTENSION ::= {
  SYNTAX         RevokedGroupsSyntax
  IDENTIFIED BY  id-ce-revokedGroups }

RevokedGroupsSyntax ::= SEQUENCE SIZE (1..MAX) OF RevokedGroup

RevokedGroup ::= SEQUENCE {
  certificateIssuer        [0]  GeneralName OPTIONAL,
  reasonInfo               [1]  ReasonInfo OPTIONAL,
  invalidityDate           [2]  GeneralizedTime OPTIONAL,
  revokedcertificateGroup  [3]  RevokedCertificateGroup,
  ... }

RevokedCertificateGroup ::= CHOICE {
  serialNumberRange  NumberRange,
  nameSubtree        GeneralName }

expiredCertsOnCRL EXTENSION ::= {
  SYNTAX         ExpiredCertsOnCRL
  IDENTIFIED BY  id-ce-expiredCertsOnCRL }

ExpiredCertsOnCRL ::= GeneralizedTime

reasonCode EXTENSION ::= {
  SYNTAX         CRLReason
  IDENTIFIED BY  id-ce-reasonCode }

CRLReason ::= ENUMERATED {
  unspecified          (0),
  keyCompromise        (1),
  cACompromise         (2),
  affiliationChanged   (3),
  superseded           (4),
  cessationOfOperation (5),
  certificateHold      (6),
  removeFromCRL        (8),
  privilegeWithdrawn   (9),
  aACompromise         (10),
  ...,
  weakAlgorithmOrKey   (11) }

holdInstructionCode EXTENSION ::= {
  SYNTAX         HoldInstruction
  IDENTIFIED BY  id-ce-holdInstructionCode }

HoldInstruction ::= OBJECT IDENTIFIER

invalidityDate EXTENSION ::= {
  SYNTAX         GeneralizedTime
  IDENTIFIED BY  id-ce-invalidityDate }

cRLDistributionPoints EXTENSION ::= {
  SYNTAX         CRLDistPointsSyntax
  IDENTIFIED BY  id-ce-cRLDistributionPoints }

CRLDistPointsSyntax ::= SEQUENCE SIZE (1..MAX) OF DistributionPoint

DistributionPoint ::= SEQUENCE {
  distributionPoint  [0]  DistributionPointName OPTIONAL,
  reasons            [1]  ReasonFlags OPTIONAL,
  cRLIssuer          [2]  GeneralNames OPTIONAL,
  ... }

DistributionPointName ::= CHOICE {
  fullName                 [0]  GeneralNames,
  nameRelativeToCRLIssuer  [1]  RelativeDistinguishedName,
  ... }

ReasonFlags ::= BIT STRING {
  unused                (0),
  keyCompromise         (1),
  cACompromise          (2),
  affiliationChanged    (3),
  superseded            (4),
  cessationOfOperation  (5),
  certificateHold       (6),
  privilegeWithdrawn    (7),
  aACompromise          (8),
  weakAlgorithmOrKey    (9) }

issuingDistributionPoint EXTENSION ::= {
  SYNTAX         IssuingDistPointSyntax
  IDENTIFIED BY  id-ce-issuingDistributionPoint }

IssuingDistPointSyntax ::= SEQUENCE {
  -- If onlyContainsUserPublicKeyCerts and onlyContainsCACerts are both FALSE,
  -- the CRL covers both public-key certificate types
  distributionPoint               [0]  DistributionPointName OPTIONAL,
  onlyContainsUserPublicKeyCerts  [1]  BOOLEAN DEFAULT FALSE,
  onlyContainsCACerts             [2]  BOOLEAN DEFAULT FALSE,
  onlySomeReasons                 [3]  ReasonFlags OPTIONAL,
  indirectCRL                     [4]  BOOLEAN DEFAULT FALSE,
  onlyContainsAttributeCerts      [5]  BOOLEAN OPTIONAL, -- Use is strongly deprecated
  ... }

certificateIssuer EXTENSION ::= {
  SYNTAX         GeneralNames
  IDENTIFIED BY  id-ce-certificateIssuer }

deltaCRLIndicator EXTENSION ::= {
  SYNTAX         BaseCRLNumber
  IDENTIFIED BY  id-ce-deltaCRLIndicator }

BaseCRLNumber ::= CRLNumber

baseUpdateTime EXTENSION ::= {
  SYNTAX         GeneralizedTime
  IDENTIFIED BY  id-ce-baseUpdateTime }

freshestCRL EXTENSION ::= {
  SYNTAX         CRLDistPointsSyntax
  IDENTIFIED BY  id-ce-freshestCRL }

protRestrict EXTENSION ::= {
  SYNTAX        ProtRestriction
  IDENTIFIED BY id-ce-protRestrict }

ProtRestriction ::= SEQUENCE (SIZE (1..MAX)) OF OBJECT IDENTIFIER

subjectAltPublicKeyInfo EXTENSION ::= {
  SYNTAX           SubjectAltPublicKeyInfo
  IDENTIFIED BY    id-ce-subjectAltPublicKeyInfo }

SubjectAltPublicKeyInfo ::= SEQUENCE {
  algorithm              AlgorithmIdentifier{{SupportedAlgorithms}},
  subjectAltPublicKey    BIT STRING }

altSignatureAlgorithm EXTENSION ::= {
 SYNTAX           AltSignatureAlgorithm
 IDENTIFIED BY    id-ce-altSignatureAlgorithm }

AltSignatureAlgorithm ::= AlgorithmIdentifier{{SupportedAlgorithms}}

altSignatureValue EXTENSION ::= {
  SYNTAX           AltSignatureValue
  IDENTIFIED BY    id-ce-altSignatureValue }

AltSignatureValue ::= BIT STRING

aAissuingDistributionPoint EXTENSION ::= {
  SYNTAX         AAIssuingDistPointSyntax
  IDENTIFIED BY  id-ce-aAissuingDistributionPoint }

AAIssuingDistPointSyntax ::= SEQUENCE {
  distributionPoint           [0]  DistributionPointName OPTIONAL,
  onlySomeReasons             [1]  ReasonFlags OPTIONAL,
  indirectCRL                 [2]  BOOLEAN DEFAULT FALSE,
  containsUserAttributeCerts  [3]  BOOLEAN DEFAULT TRUE,
  containsAACerts             [4]  BOOLEAN DEFAULT TRUE,
  containsSOAPublicKeyCerts   [5]  BOOLEAN DEFAULT TRUE,
  ... }

-- PKI matching rules

certificateExactMatch MATCHING-RULE ::= {
  SYNTAX       CertificateExactAssertion
  LDAP-SYNTAX  certExactAssertion.&id
  LDAP-NAME    {"certificateExactMatch"}
  LDAP-DESC    "X.509 Certificate Exact Match"
  ID           id-mr-certificateExactMatch }

CertificateExactAssertion ::= SEQUENCE {
  serialNumber  CertificateSerialNumber,
  issuer        Name,
  ... }

certificateMatch MATCHING-RULE ::= {
  SYNTAX       CertificateAssertion
  LDAP-SYNTAX  certAssertion.&id
  LDAP-NAME    {"certificateMatch"}
  LDAP-DESC    "X.509 Certificate Match"
  ID           id-mr-certificateMatch }

CertificateAssertion ::= SEQUENCE {
  serialNumber            [0]  CertificateSerialNumber OPTIONAL,
  issuer                  [1]  Name OPTIONAL,
  subjectKeyIdentifier    [2]  SubjectKeyIdentifier OPTIONAL,
  authorityKeyIdentifier  [3]  AuthorityKeyIdentifier OPTIONAL,
  certificateValid        [4]  Time OPTIONAL,
  privateKeyValid         [5]  GeneralizedTime OPTIONAL,
  subjectPublicKeyAlgID   [6]  OBJECT IDENTIFIER OPTIONAL,
  keyUsage                [7]  KeyUsage OPTIONAL,
  subjectAltName          [8]  AltNameType OPTIONAL,
  policy                  [9]  CertPolicySet OPTIONAL,
  pathToName              [10] Name OPTIONAL,
  subject                 [11] Name OPTIONAL,
  nameConstraints         [12] NameConstraintsSyntax OPTIONAL,
  ... }

AltNameType ::= CHOICE {
  builtinNameForm  ENUMERATED {
    rfc822Name                (1),
    dNSName                   (2),
    x400Address               (3),
    directoryName             (4),
    ediPartyName              (5),
    uniformResourceIdentifier (6),
    iPAddress                 (7),
    registeredId              (8),
    ...},
  otherNameForm    OBJECT IDENTIFIER,
  ... }

CertPolicySet ::= SEQUENCE SIZE (1..MAX) OF CertPolicyId

certificatePairExactMatch MATCHING-RULE ::= {
  SYNTAX       CertificatePairExactAssertion
  LDAP-SYNTAX  certPairExactAssertion.&id
  LDAP-NAME    {"certificatePairExactMatch"}
  LDAP-DESC    "X.509 Certificate Pair Exact Match"
  ID           id-mr-certificatePairExactMatch }

CertificatePairExactAssertion ::= SEQUENCE {
  issuedToThisCAAssertion  [0]  CertificateExactAssertion OPTIONAL,
  issuedByThisCAAssertion  [1]  CertificateExactAssertion OPTIONAL,
  ... }
  (WITH COMPONENTS { ..., issuedToThisCAAssertion  PRESENT } |
   WITH COMPONENTS { ..., issuedByThisCAAssertion  PRESENT } )

certificatePairMatch MATCHING-RULE ::= {
  SYNTAX       CertificatePairAssertion
  LDAP-SYNTAX  certPairAssertion.&id
  LDAP-NAME    {"certificatePairMatch"}
  LDAP-DESC    "X.509 Certificate Pair Match"
  ID           id-mr-certificatePairMatch }

CertificatePairAssertion ::= SEQUENCE {
  issuedToThisCAAssertion  [0]  CertificateAssertion OPTIONAL,
  issuedByThisCAAssertion  [1]  CertificateAssertion OPTIONAL,
  ... }
  (WITH COMPONENTS {..., issuedToThisCAAssertion  PRESENT } |
   WITH COMPONENTS {..., issuedByThisCAAssertion  PRESENT } )

certificateListExactMatch MATCHING-RULE ::= {
  SYNTAX       CertificateListExactAssertion
  LDAP-SYNTAX  certListExactAssertion.&id
  LDAP-NAME    {"certificateListExactMatch"}
  LDAP-DESC    "X.509 Certificate List Exact Match"
  ID           id-mr-certificateListExactMatch }

CertificateListExactAssertion ::= SEQUENCE {
  issuer             Name,
  thisUpdate         Time,
  distributionPoint  DistributionPointName OPTIONAL }

certificateListMatch MATCHING-RULE ::= {
  SYNTAX  CertificateListAssertion
  LDAP-SYNTAX  certListAssertion.&id
  LDAP-NAME    {"certificateListMatch"}
  LDAP-DESC    "X.509 Certificate List Match"
  ID      id-mr-certificateListMatch }

CertificateListAssertion ::= SEQUENCE {
  issuer                       Name                   OPTIONAL,
  minCRLNumber            [0]  CRLNumber              OPTIONAL,
  maxCRLNumber            [1]  CRLNumber              OPTIONAL,
  reasonFlags                  ReasonFlags            OPTIONAL,
  dateAndTime                  Time                   OPTIONAL,
  distributionPoint       [2]  DistributionPointName  OPTIONAL,
  authorityKeyIdentifier  [3]  AuthorityKeyIdentifier OPTIONAL,
  ... }

algorithmIdentifierMatch MATCHING-RULE ::= {
  SYNTAX       AlgorithmIdentifier {{SupportedAlgorithms}}
  LDAP-SYNTAX  algorithmIdentifier.&id
  LDAP-NAME    {"algorithmIdentifierMatch"}
  LDAP-DESC    "X.509 Algorithm Identifier Match"
  ID           id-mr-algorithmIdentifierMatch }

policyMatch MATCHING-RULE ::= {
  SYNTAX  PolicyID
  ID      id-mr-policyMatch }

pkiPathMatch MATCHING-RULE ::= {
  SYNTAX  PkiPathMatchSyntax
  ID      id-mr-pkiPathMatch }

PkiPathMatchSyntax ::= SEQUENCE {
  firstIssuer  Name,
  lastSubject  Name,
  ... }

enhancedCertificateMatch MATCHING-RULE ::= {
  SYNTAX  EnhancedCertificateAssertion
  ID      id-mr-enhancedCertificateMatch }

EnhancedCertificateAssertion ::= SEQUENCE {
  serialNumber            [0]  CertificateSerialNumber OPTIONAL,
  issuer                  [1]  Name OPTIONAL,
  subjectKeyIdentifier    [2]  SubjectKeyIdentifier OPTIONAL,
  authorityKeyIdentifier  [3]  AuthorityKeyIdentifier OPTIONAL,
  certificateValid        [4]  Time OPTIONAL,
  privateKeyValid         [5]  GeneralizedTime OPTIONAL,
  subjectPublicKeyAlgID   [6]  OBJECT IDENTIFIER OPTIONAL,
  keyUsage                [7]  KeyUsage OPTIONAL,
  subjectAltName          [8]  AltName OPTIONAL,
  policy                  [9]  CertPolicySet OPTIONAL,
  pathToName              [10] GeneralNames OPTIONAL,
  subject                 [11] Name OPTIONAL,
  nameConstraints         [12] NameConstraintsSyntax OPTIONAL,
  ... }
  (ALL EXCEPT ({ -- none; at least one component shall be present --}))

AltName ::= SEQUENCE {
  altnameType   AltNameType,
  altNameValue  GeneralName OPTIONAL }

certExactAssertion SYNTAX-NAME ::= {
  LDAP-DESC         "X.509 Certificate Exact Assertion"
  DIRECTORY SYNTAX  CertificateExactAssertion
  ID                id-ldx-certExactAssertion }

certAssertion SYNTAX-NAME ::= {
  LDAP-DESC         "X.509 Certificate Assertion"
  DIRECTORY SYNTAX  CertificateAssertion
  ID                id-ldx-certAssertion }

certPairExactAssertion SYNTAX-NAME ::= {
  LDAP-DESC         "X.509 Certificate Pair Exact Assertion"
  DIRECTORY SYNTAX  CertificatePairExactAssertion
  ID                id-ldx-certPairExactAssertion }

certPairAssertion SYNTAX-NAME ::= {
  LDAP-DESC         "X.509 Certificate Pair Assertion"
  DIRECTORY SYNTAX  CertificatePairAssertion
  ID                id-ldx-certPairAssertion }

certListExactAssertion SYNTAX-NAME ::= {
  LDAP-DESC         "X.509 Certificate List Exact Assertion"
  DIRECTORY SYNTAX  CertificateListExactAssertion
  ID                id-ldx-certListExactAssertion }

certListAssertion SYNTAX-NAME ::= {
  LDAP-DESC         "X.509 Certificate List Assertion"
  DIRECTORY SYNTAX  CertificateListAssertion
  ID                id-ldx-certListAssertion }

algorithmIdentifier SYNTAX-NAME ::= {
  LDAP-DESC         "X.509 Algorithm Identifier"
  DIRECTORY SYNTAX  AlgorithmIdentifier{{SupportedAlgorithms}}
  ID                id-ldx-algorithmIdentifier }

-- Object identifier assignments

-- {id-ce 2} not used
-- {id-ce 3} not used
-- {id-ce 4} not used
-- {id-ce 5} not used
-- {id-ce 6} not used
-- {id-ce 7} not used
-- {id-ce 8} not used
id-ce-subjectDirectoryAttributes         OBJECT IDENTIFIER ::= {id-ce 9}
-- {id-ce 10} not used
-- {id-ce 11} not used
-- {id-ce 12} not used
-- {id-ce 13} not used
id-ce-subjectKeyIdentifier               OBJECT IDENTIFIER ::= {id-ce 14}
id-ce-keyUsage                           OBJECT IDENTIFIER ::= {id-ce 15}
id-ce-privateKeyUsagePeriod              OBJECT IDENTIFIER ::= {id-ce 16}
id-ce-subjectAltName                     OBJECT IDENTIFIER ::= {id-ce 17}
id-ce-issuerAltName                      OBJECT IDENTIFIER ::= {id-ce 18}
id-ce-basicConstraints                   OBJECT IDENTIFIER ::= {id-ce 19}
id-ce-cRLNumber                          OBJECT IDENTIFIER ::= {id-ce 20}
id-ce-reasonCode                         OBJECT IDENTIFIER ::= {id-ce 21}
-- {id-ce 22} not used
id-ce-holdInstructionCode                OBJECT IDENTIFIER ::= {id-ce 23}
id-ce-invalidityDate                     OBJECT IDENTIFIER ::= {id-ce 24}
-- {id-ce 25} not used
-- {id-ce 26} not used
id-ce-deltaCRLIndicator                  OBJECT IDENTIFIER ::= {id-ce 27}
id-ce-issuingDistributionPoint           OBJECT IDENTIFIER ::= {id-ce 28}
id-ce-certificateIssuer                  OBJECT IDENTIFIER ::= {id-ce 29}
id-ce-nameConstraints                    OBJECT IDENTIFIER ::= {id-ce 30}
id-ce-cRLDistributionPoints              OBJECT IDENTIFIER ::= {id-ce 31}
id-ce-certificatePolicies                OBJECT IDENTIFIER ::= {id-ce 32}
id-ce-policyMappings                     OBJECT IDENTIFIER ::= {id-ce 33}
-- deprecated                            OBJECT IDENTIFIER ::= {id-ce 34}
id-ce-authorityKeyIdentifier             OBJECT IDENTIFIER ::= {id-ce 35}
id-ce-policyConstraints                  OBJECT IDENTIFIER ::= {id-ce 36}
id-ce-extKeyUsage                        OBJECT IDENTIFIER ::= {id-ce 37}
-- id-ce-authorityAttributeIdentifier    OBJECT IDENTIFIER ::= {id-ce 38}
-- id-ce-roleSpecCertIdentifier          OBJECT IDENTIFIER ::= {id-ce 39}
id-ce-cRLStreamIdentifier                OBJECT IDENTIFIER ::= {id-ce 40}
-- id-ce-basicAttConstraints             OBJECT IDENTIFIER ::= {id-ce 41}
-- id-ce-delegatedNameConstraints        OBJECT IDENTIFIER ::= {id-ce 42}
-- id-ce-timeSpecification               OBJECT IDENTIFIER ::= {id-ce 43}
id-ce-cRLScope                           OBJECT IDENTIFIER ::= {id-ce 44}
id-ce-statusReferrals                    OBJECT IDENTIFIER ::= {id-ce 45}
id-ce-freshestCRL                        OBJECT IDENTIFIER ::= {id-ce 46}
id-ce-orderedList                        OBJECT IDENTIFIER ::= {id-ce 47}
-- id-ce-attributeDescriptor             OBJECT IDENTIFIER ::= {id-ce 48}
-- id-ce-userNotice                      OBJECT IDENTIFIER ::= {id-ce 49}
-- id-ce-sOAIdentifier                   OBJECT IDENTIFIER ::= {id-ce 50}
id-ce-baseUpdateTime                     OBJECT IDENTIFIER ::= {id-ce 51}
-- id-ce-acceptableCertPolicies          OBJECT IDENTIFIER ::= {id-ce 52}
id-ce-deltaInfo                          OBJECT IDENTIFIER ::= {id-ce 53}
id-ce-inhibitAnyPolicy                   OBJECT IDENTIFIER ::= {id-ce 54}
-- id-ce-targetingInformation            OBJECT IDENTIFIER ::= {id-ce 55}
-- id-ce-noRevAvail                      OBJECT IDENTIFIER ::= {id-ce 56}
-- id-ce-acceptablePrivilegePolicies     OBJECT IDENTIFIER ::= {id-ce 57}
id-ce-toBeRevoked                        OBJECT IDENTIFIER ::= {id-ce 58}
id-ce-revokedGroups                      OBJECT IDENTIFIER ::= {id-ce 59}
id-ce-expiredCertsOnCRL                  OBJECT IDENTIFIER ::= {id-ce 60}
-- id-ce-indirectIssuer                  OBJECT IDENTIFIER ::= {id-ce 61}
-- id-ce-noAssertion                     OBJECT IDENTIFIER ::= {id-ce 62}
id-ce-aAissuingDistributionPoint         OBJECT IDENTIFIER ::= {id-ce 63}
-- id-ce-issuedOnBehalfOf                OBJECT IDENTIFIER ::= {id-ce 64}
-- id-ce-singleUse                       OBJECT IDENTIFIER ::= {id-ce 65}
-- id-ce-groupAC                         OBJECT IDENTIFIER ::= {id-ce 66}
-- id-ce-allowedAttAss                   OBJECT IDENTIFIER ::= {id-ce 67}
-- id-ce-attributeMappings               OBJECT IDENTIFIER ::= {id-ce 68}
-- id-ce-holderNameConstraints           OBJECT IDENTIFIER ::= {id-ce 69}
id-ce-authorizationValidation            OBJECT IDENTIFIER ::= {id-ce 70}
id-ce-protRestrict                       OBJECT IDENTIFIER ::= {id-ce 71}
id-ce-subjectAltPublicKeyInfo            OBJECT IDENTIFIER ::= {id-ce 72}
id-ce-altSignatureAlgorithm              OBJECT IDENTIFIER ::= {id-ce 73}
id-ce-altSignatureValue                  OBJECT IDENTIFIER ::= {id-ce 74}
id-ce-associatedInformation              OBJECT IDENTIFIER ::= {id-ce 75}

-- matching rule OIDs

id-mr-certificateExactMatch       OBJECT IDENTIFIER ::= {id-mr 34}
id-mr-certificateMatch            OBJECT IDENTIFIER ::= {id-mr 35}
id-mr-certificatePairExactMatch   OBJECT IDENTIFIER ::= {id-mr 36}
id-mr-certificatePairMatch        OBJECT IDENTIFIER ::= {id-mr 37}
id-mr-certificateListExactMatch   OBJECT IDENTIFIER ::= {id-mr 38}
id-mr-certificateListMatch        OBJECT IDENTIFIER ::= {id-mr 39}
id-mr-algorithmIdentifierMatch    OBJECT IDENTIFIER ::= {id-mr 40}
id-mr-policyMatch                 OBJECT IDENTIFIER ::= {id-mr 60}
id-mr-pkiPathMatch                OBJECT IDENTIFIER ::= {id-mr 62}
id-mr-enhancedCertificateMatch    OBJECT IDENTIFIER ::= {id-mr 65}

-- Object identifiers for LDAP X.509 assertion syntaxes

id-ldx-certExactAssertion         OBJECT IDENTIFIER ::= {id-ldx 1}
id-ldx-certAssertion              OBJECT IDENTIFIER ::= {id-ldx 2}
id-ldx-certPairExactAssertion     OBJECT IDENTIFIER ::= {id-ldx 3}
id-ldx-certPairAssertion          OBJECT IDENTIFIER ::= {id-ldx 4}
id-ldx-certListExactAssertion     OBJECT IDENTIFIER ::= {id-ldx 5}
id-ldx-certListAssertion          OBJECT IDENTIFIER ::= {id-ldx 6}
id-ldx-algorithmIdentifier        OBJECT IDENTIFIER ::= {id-ldx 7}

END -- CertificateExtensions

ExtensionAttributes {joint-iso-itu-t ds(5) module(1) extensionAttributes(41) 9}
DEFINITIONS ::=
BEGIN

-- EXPORTS All

IMPORTS

  -- from Rec. ITU-T X.501 | ISO/IEC 9594-2

  id-ce
    FROM UsefulDefinitions
      {joint-iso-itu-t ds(5) module(1) usefulDefinitions(0) 9} WITH SUCCESSORS

  ATTRIBUTE, SYNTAX-NAME
    FROM InformationFramework
      {joint-iso-itu-t ds(5) module(1) informationFramework(1) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.509 | ISO/IEC 9594-8

  EXTENSION
     FROM AuthenticationFramework
       {joint-iso-itu-t ds(5) module(1) authenticationFramework(7) 9} WITH SUCCESSORS

  aAissuingDistributionPoint, altSignatureAlgorithm, altSignatureValue,
  authorityKeyIdentifier, authorizationValidation, baseUpdateTime, basicConstraints,
  certificateIssuer, certificatePolicies, cRLDistributionPoints, cRLNumber,
  cRLStreamIdentifier, deltaCRLIndicator, deltaInfo, expiredCertsOnCRL, extKeyUsage,
  freshestCRL, holdInstructionCode, invalidityDate, issuerAltName,
  issuingDistributionPoint, keyUsage, nameConstraints, orderedList,
  policyConstraints, policyMappings, privateKeyUsagePeriod, reasonCode, revokedGroups,
  statusReferrals, subjectAltName, subjectAltPublicKeyInfo, subjectDirectoryAttributes,
  subjectKeyIdentifier, toBeRevoked
     FROM CertificateExtensions
       {joint-iso-itu-t ds(5) module(1) certificateExtensions(26) 9} WITH SUCCESSORS

  acceptableCertPolicies, acceptablePrivilegePolicies, allowedAttributeAssignments,
  attributeDescriptor, attributeMappings, authorityAttributeIdentifier,
  basicAttConstraints, delegatedNameConstraints, groupAC, holderNameConstraints,
  issuedOnBehalfOf, noAssertion, noRevAvail, roleSpecCertIdentifier, singleUse,
  sOAIdentifier, targetingInformation, timeSpecification, userNotice
     FROM AttributeCertificateDefinitions
       {joint-iso-itu-t ds(5) module(1) attributeCertificateDefinitions(32) 9}  WITH SUCCESSORS ;

ExtensionAttribute ::= SEQUENCE {
  type            ATTRIBUTE.&id,
  value           SET SIZE (0..1) OF SEQUENCE {
    mandatory  [0]  BOOLEAN DEFAULT FALSE,
    critical   [1]  BOOLEAN DEFAULT FALSE,
    ext        [2]  EXTENSION.&ExtnType,
    ... },
  ... }

extensionSyntax {EXTENSION:extension-attribute} SYNTAX-NAME ::= {
  LDAP-DESC         extension-attribute.&ldap-description
  DIRECTORY SYNTAX  SEQUENCE {
    mandatory    [0]  BOOLEAN DEFAULT FALSE,
    critical     [1]  BOOLEAN DEFAULT FALSE,
    ext          [2]  extension-attribute.&ExtnType,
    ... }
  ID                extension-attribute.&id }

-- The list of extension attribute types

a-authorityKeyIdentifier ATTRIBUTE ::= {
  WITH SYNTAX       authorityKeyIdentifier.&ExtnType
  LDAP-SYNTAX       id-asx-authorityKeyIdentifier
  LDAP-NAME         {"Authority Key Identifier"}
  ID                id-ce-a-authorityKeyIdentifier }

a-keyUsage ATTRIBUTE ::= {
  WITH SYNTAX       keyUsage.&ExtnType
  LDAP-SYNTAX       id-asx-keyUsage
  LDAP-NAME         {"Key Usage"}
  ID                id-ce-a-keyUsage }

a-extKeyUsage ATTRIBUTE ::= {
  WITH SYNTAX       extKeyUsage.&ExtnType
  LDAP-SYNTAX       id-asx-extKeyUsage
  LDAP-NAME         {"Extended Key Usage"}
  ID                id-ce-a-extKeyUsage }

a-privateKeyUsagePeriod ATTRIBUTE ::= {
  WITH SYNTAX       privateKeyUsagePeriod.&ExtnType
  LDAP-SYNTAX       id-asx-privateKeyUsagePeriod
  LDAP-NAME         {"Private Key Usage Period"}
  ID                id-ce-a-privateKeyUsagePeriod }

a-certificatePolicies ATTRIBUTE ::= {
  WITH SYNTAX       certificatePolicies.&ExtnType
  LDAP-SYNTAX       id-asx-certificatePolicies
  LDAP-NAME         {"Certificate Policies"}
  ID                id-ce-a-certificatePolicies }

a-policyMappings ATTRIBUTE ::= {
  WITH SYNTAX       policyMappings.&ExtnType
  LDAP-SYNTAX       id-asx-policyMappings
  LDAP-NAME         {"Policy Mappings"}
  ID                id-ce-a-policyMappings }

a-authorizationValidation ATTRIBUTE ::= {
  WITH SYNTAX       authorizationValidation.&ExtnType
  LDAP-SYNTAX       id-asx-authorizationValidation
  LDAP-NAME         {"Authorization Validation"}
  ID                id-ce-a-authorizationValidation }

a-subjectAltName ATTRIBUTE ::= {
  WITH SYNTAX       subjectAltName.&ExtnType
  LDAP-SYNTAX       id-asx-subjectAltName
  LDAP-NAME         {"Subject Alternative Name"}
  ID                id-ce-a-subjectAltName }

a-issuerAltName ATTRIBUTE ::= {
  WITH SYNTAX       issuerAltName.&ExtnType
  LDAP-SYNTAX       id-asx-issuerAltName
  LDAP-NAME         {"Issuer Alternative Name"}
  ID                id-ce-a-issuerAltName }

a-subjectDirectoryAttributes ATTRIBUTE ::= {
  WITH SYNTAX       subjectDirectoryAttributes.&ExtnType
  LDAP-SYNTAX       id-asx-subjectDirectoryAttributes
  LDAP-NAME         {"Subject Directory Attributes"}
  ID                id-ce-a-subjectDirectoryAttributes }

a-basicConstraints ATTRIBUTE ::= {
  WITH SYNTAX       basicConstraints.&ExtnType
  LDAP-SYNTAX       id-asx-basicConstraints
  LDAP-NAME         {"Basic Constraints"}
  ID                id-ce-a-basicConstraints }

a-nameConstraints ATTRIBUTE ::= {
  WITH SYNTAX       policyConstraints.&ExtnType
  LDAP-SYNTAX       id-asx-nameConstraints
  LDAP-NAME         {"Name Constraints"}
  ID                id-ce-a-nameConstraints }

a-policyConstraints ATTRIBUTE ::= {
  WITH SYNTAX       policyConstraints.&ExtnType
  LDAP-SYNTAX       id-asx-policyConstraints
  LDAP-NAME         {"Policy Constraints"}
  ID                id-ce-a-policyConstraints }

a-cRLNumber ATTRIBUTE ::= {
  WITH SYNTAX       cRLNumber.&ExtnType
  LDAP-SYNTAX       id-asx-cRLNumber
  LDAP-NAME         {"CRL Number"}
  ID                id-ce-a-cRLNumber}

a-statusReferrals ATTRIBUTE ::= {
  WITH SYNTAX       statusReferrals.&ExtnType
  LDAP-SYNTAX       id-asx-statusReferrals
  LDAP-NAME         {"Status Referrals"}
  ID                id-ce-a-statusReferrals}

a-cRLStreamIdentifier ATTRIBUTE ::= {
  WITH SYNTAX       cRLStreamIdentifier.&ExtnType
  LDAP-SYNTAX       id-asx-cRLStreamIdentifier
  LDAP-NAME         {"CRL stream identifier"}
  ID                id-ce-a-cRLStreamIdentifier}

a-orderedList ATTRIBUTE ::= {
  WITH SYNTAX       orderedList.&ExtnType
  LDAP-SYNTAX       id-asx-orderedList
  LDAP-NAME         {"Ordered list"}
  ID                id-ce-a-orderedList}

a-deltaInfo ATTRIBUTE ::= {
  WITH SYNTAX       deltaInfo.&ExtnType
  LDAP-SYNTAX       id-asx-deltaInfo
  LDAP-NAME         {"Delta information"}
  ID                id-ce-a-deltaInfo}

a-toBeRevoked ATTRIBUTE ::= {
  WITH SYNTAX       toBeRevoked.&ExtnType
  LDAP-SYNTAX       id-asx-toBeRevoked
  LDAP-NAME         {"To be revoked"}
  ID                id-ce-a-toBeRevoked}

a-revokedGroups ATTRIBUTE ::= {
  WITH SYNTAX       revokedGroups.&ExtnType
  LDAP-SYNTAX       id-asx-revokedGroups
  LDAP-NAME         {"Revoked group of certificates"}
  ID                id-ce-a-revokedGroups}

a-expiredCertsOnCRL ATTRIBUTE ::= {
  WITH SYNTAX       expiredCertsOnCRL.&ExtnType
  LDAP-SYNTAX       id-asx-expiredCertsOnCRL
  LDAP-NAME         {"Expired certificates on CRL"}
  ID                id-ce-a-expiredCertsOnCRL}

a-reasonCode ATTRIBUTE ::= {
  WITH SYNTAX       reasonCode.&ExtnType
  LDAP-SYNTAX       id-asx-reasonCode
  LDAP-NAME         {"Reason code"}
  ID                id-ce-a-reasonCode}

a-holdInstructionCode ATTRIBUTE ::= {
  WITH SYNTAX       holdInstructionCode.&ExtnType
  LDAP-SYNTAX       id-asx-holdInstructionCode
  LDAP-NAME         {"Hold instruction code"}
  ID                id-ce-a-holdInstructionCode}

a-invalidityDate ATTRIBUTE ::= {
  WITH SYNTAX       invalidityDate.&ExtnType
  LDAP-SYNTAX       id-asx-invalidityDate
  LDAP-NAME         {"Invalidity date"}
  ID                id-ce-a-invalidityDate}

a-cRLDistributionPoints ATTRIBUTE ::= {
  WITH SYNTAX       cRLDistributionPoints.&ExtnType
  LDAP-SYNTAX       id-asx-cRLDistributionPoints
  LDAP-NAME         {"CRL distribution points"}
  ID                id-ce-a-cRLDistributionPoints}

a-issuingDistributionPoint ATTRIBUTE ::= {
  WITH SYNTAX       issuingDistributionPoint.&ExtnType
  LDAP-SYNTAX       id-asx-issuingDistributionPoint
  LDAP-NAME         {"Issuing distribution point"}
  ID                id-ce-a-issuingDistributionPoint}

a-certificateIssuer ATTRIBUTE ::= {
  WITH SYNTAX       certificateIssuer.&ExtnType
  LDAP-SYNTAX       id-asx-certificateIssuer
  LDAP-NAME         {"Certificate issuer"}
  ID                id-ce-a-certificateIssuer}

a-deltaCRLIndicator ATTRIBUTE ::= {
  WITH SYNTAX       deltaCRLIndicator.&ExtnType
  LDAP-SYNTAX       id-asx-deltaCRLIndicator
  LDAP-NAME         {"Delta CRL indicator"}
  ID                id-ce-a-deltaCRLIndicator}

a-baseUpdateTime ATTRIBUTE ::= {
  WITH SYNTAX       baseUpdateTime.&ExtnType
  LDAP-SYNTAX       id-asx-baseUpdateTime
  LDAP-NAME         {"Base update time"}
  ID                id-ce-a-baseUpdateTime}

a-freshestCRL ATTRIBUTE ::= {
  WITH SYNTAX       freshestCRL.&ExtnType
  LDAP-SYNTAX       id-asx-freshestCRL
  LDAP-NAME         {"Freshest CRL"}
  ID                id-ce-a-freshestCRL}

a-timeSpecification ATTRIBUTE ::= {
  WITH SYNTAX       timeSpecification.&ExtnType
  LDAP-SYNTAX       id-asx-timeSpecification
  LDAP-NAME         {"Time specification"}
  ID                id-ce-a-timeSpecification}

a-targetingInformation ATTRIBUTE ::= {
  WITH SYNTAX       targetingInformation.&ExtnType
  LDAP-SYNTAX       id-asx-targetingInformation
  LDAP-NAME         {"Targeting information"}
  ID                id-ce-a-targetingInformation}

a-userNotice ATTRIBUTE ::= {
  WITH SYNTAX       userNotice.&ExtnType
  LDAP-SYNTAX       id-asx-userNotice
  LDAP-NAME         {"User notice"}
  ID                id-ce-a-userNotice}

a-acceptablePrivilegePolicies ATTRIBUTE ::= {
  WITH SYNTAX       acceptablePrivilegePolicies.&ExtnType
  LDAP-SYNTAX       id-asx-acceptablePrivilegePolicies
  LDAP-NAME         {"Acceptable Privilege Policies"}
  ID                id-ce-a-acceptablePrivilegePolicies}

a-singleUse ATTRIBUTE ::= {
  WITH SYNTAX       singleUse.&ExtnType
  LDAP-SYNTAX       id-asx-singleUse
  LDAP-NAME         {"Single use"}
  ID                id-ce-a-singleUse}

a-groupAC ATTRIBUTE ::= {
  WITH SYNTAX       groupAC.&ExtnType
  LDAP-SYNTAX       id-asx-groupAC
  LDAP-NAME         {"Group attribute certificate"}
  ID                id-ce-a-groupAC}

a-noRevAvail ATTRIBUTE ::= {
  WITH SYNTAX       noRevAvail.&ExtnType
  LDAP-SYNTAX       id-asx-noRevAvail
  LDAP-NAME         {"No revocation information available"}
  ID                id-ce-a-noRevAvail}

a-sOAIdentifier ATTRIBUTE ::= {
  WITH SYNTAX       sOAIdentifier.&ExtnType
  LDAP-SYNTAX       id-asx-sOAIdentifier
  LDAP-NAME         {"SOA identifier"}
  ID                id-ce-a-sOAIdentifier}

a-attributeDescriptor ATTRIBUTE ::= {
  WITH SYNTAX       attributeDescriptor.&ExtnType
  LDAP-SYNTAX       id-asx-attributeDescriptor
  LDAP-NAME         {"Attribute descriptor"}
  ID                id-ce-a-attributeDescriptor}

a-roleSpecCertIdentifier ATTRIBUTE ::= {
  WITH SYNTAX       roleSpecCertIdentifier.&ExtnType
  LDAP-SYNTAX       id-asx-roleSpecCertIdentifier
  LDAP-NAME         {"Role specification certificate identifier"}
  ID                id-ce-a-roleSpecCertIdentifier}

a-basicAttConstraints ATTRIBUTE ::= {
  WITH SYNTAX       basicAttConstraints.&ExtnType
  LDAP-SYNTAX       id-asx-basicAttConstraints
  LDAP-NAME         {"Basic attribute constraints"}
  ID                id-ce-a-basicAttConstraints}

a-delegatedNameConstraints ATTRIBUTE ::= {
  WITH SYNTAX       delegatedNameConstraints.&ExtnType
  LDAP-SYNTAX       id-asx-delegatedNameConstraints
  LDAP-NAME         {"Delegated name constraints"}
  ID                id-ce-a-delegatedNameConstraints}

a-acceptableCertPolicies ATTRIBUTE ::= {
  WITH SYNTAX       acceptableCertPolicies.&ExtnType
  LDAP-SYNTAX       id-asx-acceptableCertPolicies
  LDAP-NAME         {"Acceptable certificate policiesGroup attribute certificate"}
  ID                id-ce-a-acceptableCertPolicies}

a-authorityAttributeIdentifier ATTRIBUTE ::= {
  WITH SYNTAX       authorityAttributeIdentifier.&ExtnType
  LDAP-SYNTAX       id-asx-authorityAttributeIdentifier
  LDAP-NAME         {"Authority attribute identifier"}
  ID                id-ce-a-authorityAttributeIdentifier}

a-indirectIssuer ATTRIBUTE ::= {
  WITH SYNTAX       indirectIssuer.&ExtnType
  LDAP-SYNTAX       id-asx-indirectIssuer
  LDAP-NAME         {"Indirect issuer"}
  ID                id-ce-a-indirectIssuer}

a-issuedOnBehalfOf ATTRIBUTE ::= {
  WITH SYNTAX       issuedOnBehalfOf.&ExtnType
  LDAP-SYNTAX       id-asx-issuedOnBehalfOf
  LDAP-NAME         {"Issued on behalf of"}
  ID                id-ce-a-issuedOnBehalfOf}

a-noAssertion ATTRIBUTE ::= {
  WITH SYNTAX       noAssertion.&ExtnType
  LDAP-SYNTAX       id-asx-noAssertion
  LDAP-NAME         {"No assertion"}
  ID                id-ce-a-noAssertion}

a-allowedAttributeAssignments ATTRIBUTE ::= {
  WITH SYNTAX       allowedAttributeAssignments.&ExtnType
  LDAP-SYNTAX       id-asx-allowedAttributeAssignments
  LDAP-NAME         {"Allowed attribute assignments"}
  ID                id-ce-a-allowedAttributeAssignments}

a-attributeMappings ATTRIBUTE ::= {
  WITH SYNTAX       attributeMappings.&ExtnType
  LDAP-SYNTAX       id-asx-attributeMappings
  LDAP-NAME         {"Attribute mappings"}
  ID                id-ce-a-attributeMappings}

a-holderNameConstraints ATTRIBUTE ::= {
  WITH SYNTAX       holderNameConstraints.&ExtnType
  LDAP-SYNTAX       id-asx-holderNameConstraints
  LDAP-NAME         {"Holder name constraints"}
  ID                id-ce-a-holderNameConstraints}

a-aAissuingDistributionPoint ATTRIBUTE ::= {
  WITH SYNTAX       aAissuingDistributionPoint.&ExtnType
  LDAP-SYNTAX       id-asx-aAissuingDistributionPoint
  LDAP-NAME         {"AA issuing distribution point"}
  ID                id-ce-a-aAissuingDistributionPoint}

a-protRestrict ATTRIBUTE ::= {
  WITH SYNTAX       protRestrict.&ExtnType
  LDAP-SYNTAX       id-asx-protRestrict
  LDAP-NAME         {"Protocol restriction"}
  ID                id-ce-a-protRestrict}

a-subjectAltPublicKeyInfo ATTRIBUTE ::= {
  WITH SYNTAX       subjectAltPublicKeyInfo.&ExtnType
  LDAP-SYNTAX       id-asx-subjectAltPublicKeyInfo
  LDAP-NAME         {"Subject alternative public key info"}
  ID                id-ce-a-subjectAltPublicKeyInfo}

a-altSignatureAlgorithm ATTRIBUTE ::= {
  WITH SYNTAX       altSignatureAlgorithm.&ExtnType
  LDAP-SYNTAX       id-asx-altSignatureAlgorithm
  LDAP-NAME         {"Alternative signature algorithm"}
  ID                id-ce-a-altSignatureAlgorithm}

a-altSignatureValue ATTRIBUTE ::= {
  WITH SYNTAX       altSignatureValue.&ExtnType
  LDAP-SYNTAX       id-asx-altSignatureValue
  LDAP-NAME         {"Alternative signature value"}
  ID                id-ce-a-altSignatureValue}

-- Object identifier for attribute types

id-ce-a-subjectDirectoryAttributes         OBJECT IDENTIFIER ::= {id-ce 9 1}
id-ce-a-subjectKeyIdentifier               OBJECT IDENTIFIER ::= {id-ce 14 1}
id-ce-a-keyUsage                           OBJECT IDENTIFIER ::= {id-ce 15 1}
id-ce-a-privateKeyUsagePeriod              OBJECT IDENTIFIER ::= {id-ce 16 1}
id-ce-a-subjectAltName                     OBJECT IDENTIFIER ::= {id-ce 17 1}
id-ce-a-issuerAltName                      OBJECT IDENTIFIER ::= {id-ce 18 1}
id-ce-a-basicConstraints                   OBJECT IDENTIFIER ::= {id-ce 19 1}
id-ce-a-cRLNumber                          OBJECT IDENTIFIER ::= {id-ce 20 1}
id-ce-a-reasonCode                         OBJECT IDENTIFIER ::= {id-ce 21 1}
id-ce-a-holdInstructionCode                OBJECT IDENTIFIER ::= {id-ce 23 1}
id-ce-a-invalidityDate                     OBJECT IDENTIFIER ::= {id-ce 24 1}
id-ce-a-deltaCRLIndicator                  OBJECT IDENTIFIER ::= {id-ce 27 1}
id-ce-a-issuingDistributionPoint           OBJECT IDENTIFIER ::= {id-ce 28 1}
id-ce-a-certificateIssuer                  OBJECT IDENTIFIER ::= {id-ce 29 1}
id-ce-a-nameConstraints                    OBJECT IDENTIFIER ::= {id-ce 30 1}
id-ce-a-cRLDistributionPoints              OBJECT IDENTIFIER ::= {id-ce 31 1}
id-ce-a-certificatePolicies                OBJECT IDENTIFIER ::= {id-ce 32 1}
id-ce-a-policyMappings                     OBJECT IDENTIFIER ::= {id-ce 33 1}
id-ce-a-authorityKeyIdentifier             OBJECT IDENTIFIER ::= {id-ce 35 1}
id-ce-a-policyConstraints                  OBJECT IDENTIFIER ::= {id-ce 36 1}
id-ce-a-extKeyUsage                        OBJECT IDENTIFIER ::= {id-ce 37 1}
id-ce-a-authorityAttributeIdentifier       OBJECT IDENTIFIER ::= {id-ce 38 1}
id-ce-a-roleSpecCertIdentifier             OBJECT IDENTIFIER ::= {id-ce 39 1}
id-ce-a-cRLStreamIdentifier                OBJECT IDENTIFIER ::= {id-ce 40 1}
id-ce-a-basicAttConstraints                OBJECT IDENTIFIER ::= {id-ce 41 1}
id-ce-a-delegatedNameConstraints           OBJECT IDENTIFIER ::= {id-ce 42 1}
id-ce-a-timeSpecification                  OBJECT IDENTIFIER ::= {id-ce 43 1}
id-ce-a-cRLScope                           OBJECT IDENTIFIER ::= {id-ce 44 1}
id-ce-a-statusReferrals                    OBJECT IDENTIFIER ::= {id-ce 45 1}
id-ce-a-freshestCRL                        OBJECT IDENTIFIER ::= {id-ce 46 1}
id-ce-a-orderedList                        OBJECT IDENTIFIER ::= {id-ce 47 1}
id-ce-a-attributeDescriptor                OBJECT IDENTIFIER ::= {id-ce 48 1}
id-ce-a-userNotice                         OBJECT IDENTIFIER ::= {id-ce 49 1}
id-ce-a-sOAIdentifier                      OBJECT IDENTIFIER ::= {id-ce 50 1}
id-ce-a-baseUpdateTime                     OBJECT IDENTIFIER ::= {id-ce 51 1}
id-ce-a-acceptableCertPolicies             OBJECT IDENTIFIER ::= {id-ce 52 1}
id-ce-a-deltaInfo                          OBJECT IDENTIFIER ::= {id-ce 53 1}
id-ce-a-inhibitAnyPolicy                   OBJECT IDENTIFIER ::= {id-ce 54 1}
id-ce-a-targetingInformation               OBJECT IDENTIFIER ::= {id-ce 55 1}
id-ce-a-noRevAvail                         OBJECT IDENTIFIER ::= {id-ce 56 1}
id-ce-a-acceptablePrivilegePolicies        OBJECT IDENTIFIER ::= {id-ce 57 1}
id-ce-a-toBeRevoked                        OBJECT IDENTIFIER ::= {id-ce 58 1}
id-ce-a-revokedGroups                      OBJECT IDENTIFIER ::= {id-ce 59 1}
id-ce-a-expiredCertsOnCRL                  OBJECT IDENTIFIER ::= {id-ce 60 1}
id-ce-a-indirectIssuer                     OBJECT IDENTIFIER ::= {id-ce 61 1}
id-ce-a-noAssertion                        OBJECT IDENTIFIER ::= {id-ce 62 1}
id-ce-a-aAissuingDistributionPoint         OBJECT IDENTIFIER ::= {id-ce 63 1}
id-ce-a-issuedOnBehalfOf                   OBJECT IDENTIFIER ::= {id-ce 64 1}
id-ce-a-singleUse                          OBJECT IDENTIFIER ::= {id-ce 65 1}
id-ce-a-groupAC                            OBJECT IDENTIFIER ::= {id-ce 66 1}
id-ce-a-allowedAttributeAssignments        OBJECT IDENTIFIER ::= {id-ce 67 1}
id-ce-a-attributeMappings                  OBJECT IDENTIFIER ::= {id-ce 68 1}
id-ce-a-holderNameConstraints              OBJECT IDENTIFIER ::= {id-ce 69 1}
id-ce-a-authorizationValidation            OBJECT IDENTIFIER ::= {id-ce 70 1}
id-ce-a-protRestrict                       OBJECT IDENTIFIER ::= {id-ce 71 1}
id-ce-a-subjectAltPublicKeyInfo            OBJECT IDENTIFIER ::= {id-ce 72 1}
id-ce-a-altSignatureAlgorithm              OBJECT IDENTIFIER ::= {id-ce 73 1}
id-ce-a-altSignatureValue                  OBJECT IDENTIFIER ::= {id-ce 74 1}

-- The list of object identifiers for LDAP syntaxes

id-asx-subjectDirectoryAttributes          OBJECT IDENTIFIER ::= {id-ce 9 2}
id-asx-subjectKeyIdentifier                OBJECT IDENTIFIER ::= {id-ce 14 2}
id-asx-keyUsage                            OBJECT IDENTIFIER ::= {id-ce 15 2}
id-asx-privateKeyUsagePeriod               OBJECT IDENTIFIER ::= {id-ce 16 2}
id-asx-subjectAltName                      OBJECT IDENTIFIER ::= {id-ce 17 2}
id-asx-issuerAltName                       OBJECT IDENTIFIER ::= {id-ce 18 2}
id-asx-basicConstraints                    OBJECT IDENTIFIER ::= {id-ce 19 2}
id-asx-cRLNumber                           OBJECT IDENTIFIER ::= {id-ce 20 2}
id-asx-reasonCode                          OBJECT IDENTIFIER ::= {id-ce 21 2}
id-asx-holdInstructionCode                 OBJECT IDENTIFIER ::= {id-ce 23 2}
id-asx-invalidityDate                      OBJECT IDENTIFIER ::= {id-ce 24 2}
id-asx-deltaCRLIndicator                   OBJECT IDENTIFIER ::= {id-ce 27 2}
id-asx-issuingDistributionPoint            OBJECT IDENTIFIER ::= {id-ce 28 2}
id-asx-certificateIssuer                   OBJECT IDENTIFIER ::= {id-ce 29 2}
id-asx-nameConstraints                     OBJECT IDENTIFIER ::= {id-ce 30 2}
id-asx-cRLDistributionPoints               OBJECT IDENTIFIER ::= {id-ce 31 2}
id-asx-certificatePolicies                 OBJECT IDENTIFIER ::= {id-ce 32 2}
id-asx-policyMappings                      OBJECT IDENTIFIER ::= {id-ce 33 2}
id-asx-authorityKeyIdentifier              OBJECT IDENTIFIER ::= {id-ce 35 2}
id-asx-policyConstraints                   OBJECT IDENTIFIER ::= {id-ce 36 2}
id-asx-extKeyUsage                         OBJECT IDENTIFIER ::= {id-ce 37 2}
id-asx-authorityAttributeIdentifier        OBJECT IDENTIFIER ::= {id-ce 38 2}
id-asx-roleSpecCertIdentifier              OBJECT IDENTIFIER ::= {id-ce 39 2}
id-asx-cRLStreamIdentifier                 OBJECT IDENTIFIER ::= {id-ce 40 2}
id-asx-basicAttConstraints                 OBJECT IDENTIFIER ::= {id-ce 41 2}
id-asx-delegatedNameConstraints            OBJECT IDENTIFIER ::= {id-ce 42 2}
id-asx-timeSpecification                   OBJECT IDENTIFIER ::= {id-ce 43 2}
id-asx-cRLScope                            OBJECT IDENTIFIER ::= {id-ce 44 2}
id-asx-statusReferrals                     OBJECT IDENTIFIER ::= {id-ce 45 2}
id-asx-freshestCRL                         OBJECT IDENTIFIER ::= {id-ce 46 2}
id-asx-orderedList                         OBJECT IDENTIFIER ::= {id-ce 47 2}
id-asx-attributeDescriptor                 OBJECT IDENTIFIER ::= {id-ce 48 2}
id-asx-userNotice                          OBJECT IDENTIFIER ::= {id-ce 49 2}
id-asx-sOAIdentifier                       OBJECT IDENTIFIER ::= {id-ce 50 2}
id-asx-baseUpdateTime                      OBJECT IDENTIFIER ::= {id-ce 51 2}
id-asx-acceptableCertPolicies              OBJECT IDENTIFIER ::= {id-ce 52 2}
id-asx-deltaInfo                           OBJECT IDENTIFIER ::= {id-ce 53 2}
id-asx-inhibitAnyPolicy                    OBJECT IDENTIFIER ::= {id-ce 54 2}
id-asx-targetingInformation                OBJECT IDENTIFIER ::= {id-ce 55 2}
id-asx-noRevAvail                          OBJECT IDENTIFIER ::= {id-ce 56 2}
id-asx-acceptablePrivilegePolicies         OBJECT IDENTIFIER ::= {id-ce 57 2}
id-asx-toBeRevoked                         OBJECT IDENTIFIER ::= {id-ce 58 2}
id-asx-revokedGroups                       OBJECT IDENTIFIER ::= {id-ce 59 2}
id-asx-expiredCertsOnCRL                   OBJECT IDENTIFIER ::= {id-ce 60 2}
id-asx-indirectIssuer                      OBJECT IDENTIFIER ::= {id-ce 61 2}
id-asx-noAssertion                         OBJECT IDENTIFIER ::= {id-ce 62 2}
id-asx-aAissuingDistributionPoint          OBJECT IDENTIFIER ::= {id-ce 63 2}
id-asx-issuedOnBehalfOf                    OBJECT IDENTIFIER ::= {id-ce 64 2}
id-asx-singleUse                           OBJECT IDENTIFIER ::= {id-ce 65 2}
id-asx-groupAC                             OBJECT IDENTIFIER ::= {id-ce 66 2}
id-asx-allowedAttributeAssignments         OBJECT IDENTIFIER ::= {id-ce 67 2}
id-asx-attributeMappings                   OBJECT IDENTIFIER ::= {id-ce 68 2}
id-asx-holderNameConstraints               OBJECT IDENTIFIER ::= {id-ce 69 2}
id-asx-authorizationValidation             OBJECT IDENTIFIER ::= {id-ce 70 2}
id-asx-protRestrict                        OBJECT IDENTIFIER ::= {id-ce 71 2}
id-asx-subjectAltPublicKeyInfo             OBJECT IDENTIFIER ::= {id-ce 72 2}
id-asx-altSignatureAlgorithm               OBJECT IDENTIFIER ::= {id-ce 73 2}
id-asx-altSignatureValue                   OBJECT IDENTIFIER ::= {id-ce 74 2}

END -- ExtensionAttributes

PkiPmiExternalDataTypes {joint-iso-itu-t ds(5) module(1) pkiPmiExternalDataTypes(40) 9}
DEFINITIONS ::=
BEGIN

-- EXPORTS All

IMPORTS

  intSecurity
    FROM UsefulDefinitions {joint-iso-itu-t ds(5) module(1) usefulDefinitions(0) 9}  WITH SUCCESSORS

  EXTENSION
    FROM AuthenticationFramework
      {joint-iso-itu-t ds(5) module(1) authenticationFramework(7) 9} WITH SUCCESSORS

  GeneralName
    FROM CertificateExtensions
      {joint-iso-itu-t ds(5) module(1) certificateExtensions(26) 9} WITH SUCCESSORS

  PresentationAddress
    FROM SelectedAttributeTypes
      {joint-iso-itu-t ds(5) module(1) selectedAttributeTypes(5) 9} WITH SUCCESSORS ;

/* The UserNotice data type is referenced by the userNotice extension. It is copied from IETF RFC 5280 */

UserNotice ::= SEQUENCE {
  noticeRef     NoticeReference OPTIONAL,
  explicitText  DisplayText OPTIONAL }

NoticeReference ::= SEQUENCE {
  organization   DisplayText,
  noticeNumbers  SEQUENCE OF INTEGER }

DisplayText ::= CHOICE {
  visibleString  VisibleString(SIZE (1..200)),
  bmpString      BMPString(SIZE (1..200)),
  utf8String     UTF8String(SIZE (1..200)) }

/* IETF RFC 5280 defines some extensions not copied from this Specification. The formal specification of these extensions are included here for easy reference, e.g., when using ASN.1 tools. For detailed description, see IETF 5280.*/

/* Authority information access extension*/

authorityInfoAccess EXTENSION ::= {
  SYNTAX         AuthorityInfoAccessSyntax
  IDENTIFIED BY  id-pe-authorityInfoAccess }

AuthorityInfoAccessSyntax ::= SEQUENCE SIZE (1..MAX) OF AccessDescription

AccessDescription ::= SEQUENCE {
  accessMethod    OBJECT IDENTIFIER,
  accessLocation  GeneralName }

/* Subject information access extension*/

subjectInfoAccess EXTENSION ::= {
  SYNTAX         SubjectInfoAccessSyntax
  IDENTIFIED BY  id-pe-subjectInfoAccess }

SubjectInfoAccessSyntax ::= SEQUENCE SIZE (1..MAX) OF AccessDescription

/* IETF RFC 5280 (PKIX) object identifier allocation*/

id-pkix                   OBJECT IDENTIFIER ::= { intSecurity mechanisms(5) pkix(7) }

id-pe                     OBJECT IDENTIFIER ::= { id-pkix 1 }
id-ad                     OBJECT IDENTIFIER ::= { id-pkix 48 }

id-pe-authorityInfoAccess OBJECT IDENTIFIER ::= { id-pe 1 }
id-pe-subjectInfoAccess   OBJECT IDENTIFIER ::= { id-pe 11 }
id-ad-caIssuers           OBJECT IDENTIFIER ::= { id-ad 2 }
id-ad-ocsp                OBJECT IDENTIFIER ::= { id-ad 1 }


/* The following is an abstract of the MTSAbstractService module specified by
Rec. ITU-T Rec. X.411 | ISO/IEC 10021-4.*/

G3FacsimileNonBasicParameters ::= BIT STRING {
  two-dimensional(8), -- As defined in ITU-T Recommendation T.30
  fine-resolution(9),
  unlimited-length(20), -- These bit values are chosen such that when
  b4-length(21), -- encoded using ASN.1 Basic Encoding Rules
  a3-width(22), -- the resulting octets have the same values
  b4-width(23), -- as for T.30 encoding
  t6-coding(25),
  uncompressed(30), -- Trailing zero bits are not significant
  width-middle-864-of-1728(37), -- It is recommended that implementations
  width-middle-1216-of-1728(38), -- should not encode more than 32 bits unless
  resolution-type(44), -- higher numbered bits are non-zero
  resolution-400x400(45), resolution-300x300(46), resolution-8x15(47),
  edi(49), dtm(50), bft(51), mixed-mode(58), character-mode(60),
  twelve-bits(65), preferred-huffmann(66), full-colour(67), jpeg(68),
  processable-mode-26(71)}

ORAddress ::= SEQUENCE {
  built-in-standard-attributes        BuiltInStandardAttributes,
  built-in-domain-defined-attributes  BuiltInDomainDefinedAttributes OPTIONAL,
  -- see also teletex-domain-defined-attributes
  extension-attributes                ExtensionAttributes OPTIONAL }

--	The OR-address is semantically absent from the OR-name if the built-in-standard-attribute
--	sequence is empty and the built-in-domain-defined-attributes and extension-attributes are both omitted.
--	Built-in Standard Attributes

BuiltInStandardAttributes ::= SEQUENCE {
  country-name                CountryName OPTIONAL,
  administration-domain-name  AdministrationDomainName OPTIONAL,
  network-address             [0]  NetworkAddress OPTIONAL,
  -- see also extended-network-address
  terminal-identifier         [1]  TerminalIdentifier OPTIONAL,
  private-domain-name         [2]  PrivateDomainName OPTIONAL,
  organization-name           [3]  OrganizationName OPTIONAL,
  -- see also teletex-organization-name
  numeric-user-identifier     [4]  NumericUserIdentifier OPTIONAL,
  personal-name               [5]  PersonalName OPTIONAL,
  -- see also teletex-personal-name
  organizational-unit-names   [6]  OrganizationalUnitNames OPTIONAL
  -- see also teletex-organizational-unit-names --}

CountryName ::= [APPLICATION 1]  CHOICE {
  x121-dcc-code         NumericString(SIZE (ub-country-name-numeric-length)),
  iso-3166-alpha2-code  PrintableString(SIZE (ub-country-name-alpha-length)) }

AdministrationDomainName ::= [APPLICATION 2]  CHOICE {
  numeric    NumericString(SIZE (0..ub-domain-name-length)),
  printable  PrintableString(SIZE (0..ub-domain-name-length)) }

NetworkAddress ::= X121Address

-- see also extended-network-address

X121Address ::= NumericString(SIZE (1..ub-x121-address-length))

TerminalIdentifier ::= PrintableString(SIZE (1..ub-terminal-id-length))

PrivateDomainName ::= CHOICE {
  numeric    NumericString(SIZE (1..ub-domain-name-length)),
  printable  PrintableString(SIZE (1..ub-domain-name-length)) }

OrganizationName ::= PrintableString(SIZE (1..ub-organization-name-length))

-- see also teletex-organization-name

NumericUserIdentifier ::= NumericString(SIZE (1..ub-numeric-user-id-length))

PersonalName ::= SET {
  surname               [0]  PrintableString(SIZE (1..ub-surname-length)),
  given-name
    [1]  PrintableString(SIZE (1..ub-given-name-length)) OPTIONAL,
  initials
    [2]  PrintableString(SIZE (1..ub-initials-length)) OPTIONAL,
  generation-qualifier
    [3]  PrintableString(SIZE (1..ub-generation-qualifier-length)) OPTIONAL }

-- see also teletex-personal-name

OrganizationalUnitNames ::=
  SEQUENCE SIZE (1..ub-organizational-units) OF OrganizationalUnitName

-- see also teletex-organizational-unit-names
OrganizationalUnitName ::=
  PrintableString(SIZE (1..ub-organizational-unit-name-length))

--	Built-in Domain-defined Attributes
BuiltInDomainDefinedAttributes ::=
  SEQUENCE SIZE (1..ub-domain-defined-attributes) OF
    BuiltInDomainDefinedAttribute

BuiltInDomainDefinedAttribute ::= SEQUENCE {
  type   PrintableString(SIZE (1..ub-domain-defined-attribute-type-length)),
  value  PrintableString(SIZE (1..ub-domain-defined-attribute-value-length)) }

--	Extension Attributes

ExtensionAttributes ::=
  SET SIZE (1..ub-extension-attributes) OF ExtensionAttribute

ExtensionAttribute ::= SEQUENCE {
  extension-attribute-type
    [0]  EXTENSION-ATTRIBUTE.&id({ExtensionAttributeTable}),
  extension-attribute-value
    [1]  EXTENSION-ATTRIBUTE.&Type
           ({ExtensionAttributeTable}{@extension-attribute-type}) }

EXTENSION-ATTRIBUTE ::= CLASS {
  &id           INTEGER(0..ub-extension-attributes) UNIQUE,
  &Type }
WITH SYNTAX {
                &Type
  IDENTIFIED BY &id }

ExtensionAttributeTable EXTENSION-ATTRIBUTE ::=
  {common-name | teletex-common-name | universal-common-name |
   teletex-organization-name | universal-organization-name |
   teletex-personal-name | universal-personal-name |
   teletex-organizational-unit-names | universal-organizational-unit-names |
   teletex-domain-defined-attributes | universal-domain-defined-attributes |
   pds-name | physical-delivery-country-name | postal-code |
   physical-delivery-office-name | universal-physical-delivery-office-name |
   physical-delivery-office-number | universal-physical-delivery-office-number
   | extension-OR-address-components |
   universal-extension-OR-address-components | physical-delivery-personal-name
   | universal-physical-delivery-personal-name |
   physical-delivery-organization-name |
   universal-physical-delivery-organization-name |
   extension-physical-delivery-address-components |
   universal-extension-physical-delivery-address-components |
   unformatted-postal-address | universal-unformatted-postal-address |
   street-address | universal-street-address | post-office-box-address |
   universal-post-office-box-address | poste-restante-address |
   universal-poste-restante-address | unique-postal-name |
   universal-unique-postal-name | local-postal-attributes |
   universal-local-postal-attributes | extended-network-address | terminal-type }

--	Extension Standard Attributes

common-name EXTENSION-ATTRIBUTE ::= {
                 CommonName
  IDENTIFIED BY  1 }

CommonName ::= PrintableString(SIZE (1..ub-common-name-length))

teletex-common-name EXTENSION-ATTRIBUTE ::= {
                 TeletexCommonName
  IDENTIFIED BY  2 }

TeletexCommonName ::= TeletexString(SIZE (1..ub-common-name-length))

universal-common-name EXTENSION-ATTRIBUTE ::= {
                 UniversalCommonName
  IDENTIFIED BY  24 }

UniversalCommonName ::= UniversalOrBMPString{ub-common-name-length}

teletex-organization-name EXTENSION-ATTRIBUTE ::= {
                 TeletexOrganizationName
  IDENTIFIED BY  3 }

TeletexOrganizationName ::=
  TeletexString(SIZE (1..ub-organization-name-length))

universal-organization-name EXTENSION-ATTRIBUTE ::= {
                 UniversalOrganizationName
  IDENTIFIED BY  25 }

UniversalOrganizationName ::= UniversalOrBMPString{ub-organization-name-length}

teletex-personal-name EXTENSION-ATTRIBUTE ::= {
                 TeletexPersonalName
  IDENTIFIED BY  4 }

TeletexPersonalName ::= SET {
  surname               [0]  TeletexString(SIZE (1..ub-surname-length)),
  given-name
    [1]  TeletexString(SIZE (1..ub-given-name-length)) OPTIONAL,
  initials
    [2]  TeletexString(SIZE (1..ub-initials-length)) OPTIONAL,
  generation-qualifier
    [3]  TeletexString(SIZE (1..ub-generation-qualifier-length)) OPTIONAL }

universal-personal-name EXTENSION-ATTRIBUTE ::= {
                 UniversalPersonalName
  IDENTIFIED BY  26 }

UniversalPersonalName ::= SET {
  surname
    [0]  UniversalOrBMPString{ub-universal-surname-length},
  -- If a language is specified within surname, then that language applies to each of the
  -- following optional components unless the component specifies another language.
  given-name
    [1]  UniversalOrBMPString{ub-universal-given-name-length} OPTIONAL,
  initials
    [2]  UniversalOrBMPString{ub-universal-initials-length} OPTIONAL,
  generation-qualifier
    [3]  UniversalOrBMPString{ub-universal-generation-qualifier-length} OPTIONAL }

teletex-organizational-unit-names EXTENSION-ATTRIBUTE ::= {
                 TeletexOrganizationalUnitNames
  IDENTIFIED BY  5 }

TeletexOrganizationalUnitNames ::=
  SEQUENCE SIZE (1..ub-organizational-units) OF TeletexOrganizationalUnitName

TeletexOrganizationalUnitName ::=
  TeletexString(SIZE (1..ub-organizational-unit-name-length))

universal-organizational-unit-names EXTENSION-ATTRIBUTE ::= {
                 UniversalOrganizationalUnitNames
  IDENTIFIED BY  27 }

UniversalOrganizationalUnitNames ::=
  SEQUENCE SIZE (1..ub-organizational-units) OF UniversalOrganizationalUnitName

-- If a unit name specifies a language, then that language applies to subordinate unit
-- names unless the subordinate specifies another language.
UniversalOrganizationalUnitName ::=
  UniversalOrBMPString{ub-organizational-unit-name-length}

UniversalOrBMPString{INTEGER:ub-string-length} ::= SET {
  character-encoding     CHOICE {
    two-octets             BMPString(SIZE (1..ub-string-length)),
    four-octets            UniversalString(SIZE (1..ub-string-length))},
  iso-639-language-code  PrintableString(SIZE (2 | 5)) OPTIONAL }

pds-name EXTENSION-ATTRIBUTE ::= {
                 PDSName
  IDENTIFIED BY  7 }

PDSName ::= PrintableString(SIZE (1..ub-pds-name-length))

physical-delivery-country-name EXTENSION-ATTRIBUTE ::= {
                 PhysicalDeliveryCountryName
  IDENTIFIED BY  8 }

PhysicalDeliveryCountryName ::= CHOICE {
  x121-dcc-code         NumericString(SIZE (ub-country-name-numeric-length)),
  iso-3166-alpha2-code  PrintableString(SIZE (ub-country-name-alpha-length)) }

postal-code EXTENSION-ATTRIBUTE ::= {
                 PostalCode
  IDENTIFIED BY  9 }

PostalCode ::= CHOICE {
  numeric-code    NumericString(SIZE (1..ub-postal-code-length)),
  printable-code  PrintableString(SIZE (1..ub-postal-code-length))
}

physical-delivery-office-name EXTENSION-ATTRIBUTE ::= {
                 PhysicalDeliveryOfficeName
  IDENTIFIED BY  10 }

PhysicalDeliveryOfficeName ::= PDSParameter

universal-physical-delivery-office-name EXTENSION-ATTRIBUTE ::= {
                 UniversalPhysicalDeliveryOfficeName
  IDENTIFIED BY  29 }

UniversalPhysicalDeliveryOfficeName ::= UniversalPDSParameter

physical-delivery-office-number EXTENSION-ATTRIBUTE ::= {
                 PhysicalDeliveryOfficeNumber
  IDENTIFIED BY  11 }

PhysicalDeliveryOfficeNumber ::= PDSParameter

universal-physical-delivery-office-number EXTENSION-ATTRIBUTE ::= {
                 UniversalPhysicalDeliveryOfficeNumber
  IDENTIFIED BY  30 }

UniversalPhysicalDeliveryOfficeNumber ::= UniversalPDSParameter

extension-OR-address-components EXTENSION-ATTRIBUTE ::= {
                 ExtensionORAddressComponents
  IDENTIFIED BY  12 }

ExtensionORAddressComponents ::= PDSParameter

universal-extension-OR-address-components EXTENSION-ATTRIBUTE ::= {
                 UniversalExtensionORAddressComponents
  IDENTIFIED BY  31 }

UniversalExtensionORAddressComponents ::= UniversalPDSParameter

physical-delivery-personal-name EXTENSION-ATTRIBUTE ::= {
                 PhysicalDeliveryPersonalName
  IDENTIFIED BY  13 }

PhysicalDeliveryPersonalName ::= PDSParameter

universal-physical-delivery-personal-name EXTENSION-ATTRIBUTE ::= {
                 UniversalPhysicalDeliveryPersonalName
  IDENTIFIED BY  32 }

UniversalPhysicalDeliveryPersonalName ::= UniversalPDSParameter

physical-delivery-organization-name EXTENSION-ATTRIBUTE ::= {
                 PhysicalDeliveryOrganizationName
  IDENTIFIED BY  14 }

PhysicalDeliveryOrganizationName ::= PDSParameter

universal-physical-delivery-organization-name EXTENSION-ATTRIBUTE ::= {
                 UniversalPhysicalDeliveryOrganizationName
  IDENTIFIED BY  33 }

UniversalPhysicalDeliveryOrganizationName ::= UniversalPDSParameter

extension-physical-delivery-address-components EXTENSION-ATTRIBUTE ::= {
                 ExtensionPhysicalDeliveryAddressComponents
  IDENTIFIED BY  15 }

ExtensionPhysicalDeliveryAddressComponents ::= PDSParameter

universal-extension-physical-delivery-address-components EXTENSION-ATTRIBUTE ::= {
                 UniversalExtensionPhysicalDeliveryAddressComponents
  IDENTIFIED BY  34 }

UniversalExtensionPhysicalDeliveryAddressComponents ::= UniversalPDSParameter

unformatted-postal-address EXTENSION-ATTRIBUTE ::= {
                 UnformattedPostalAddress
  IDENTIFIED BY  16 }

UnformattedPostalAddress ::= SET {
  printable-address SEQUENCE SIZE (1..ub-pds-physical-address-lines) OF
    PrintableString (SIZE (1..ub-pds-parameter-length)) OPTIONAL,
  teletex-string    TeletexString(SIZE (1..ub-unformatted-address-length)) OPTIONAL }

universal-unformatted-postal-address EXTENSION-ATTRIBUTE ::= {
                 UniversalUnformattedPostalAddress
  IDENTIFIED BY  35 }

UniversalUnformattedPostalAddress ::=
  UniversalOrBMPString{ub-unformatted-address-length}

street-address EXTENSION-ATTRIBUTE ::= {
                 StreetAddress
  IDENTIFIED BY  17 }

StreetAddress ::= PDSParameter

universal-street-address EXTENSION-ATTRIBUTE ::= {
                 UniversalStreetAddress
  IDENTIFIED BY  36 }

UniversalStreetAddress ::= UniversalPDSParameter

post-office-box-address EXTENSION-ATTRIBUTE ::= {
                 PostOfficeBoxAddress
  IDENTIFIED BY  18 }

PostOfficeBoxAddress ::= PDSParameter

universal-post-office-box-address EXTENSION-ATTRIBUTE ::= {
                 UniversalPostOfficeBoxAddress
  IDENTIFIED BY  37 }

UniversalPostOfficeBoxAddress ::= UniversalPDSParameter

poste-restante-address EXTENSION-ATTRIBUTE ::= {
                 PosteRestanteAddress
  IDENTIFIED BY  19 }

PosteRestanteAddress ::= PDSParameter

universal-poste-restante-address EXTENSION-ATTRIBUTE ::= {
                 UniversalPosteRestanteAddress
  IDENTIFIED BY  38 }

UniversalPosteRestanteAddress ::= UniversalPDSParameter

unique-postal-name EXTENSION-ATTRIBUTE ::= {
                 UniquePostalName
  IDENTIFIED BY  20 }

UniquePostalName ::= PDSParameter

universal-unique-postal-name EXTENSION-ATTRIBUTE ::= {
                 UniversalUniquePostalName
  IDENTIFIED BY  39 }

UniversalUniquePostalName ::= UniversalPDSParameter

local-postal-attributes EXTENSION-ATTRIBUTE ::= {
                 LocalPostalAttributes
  IDENTIFIED BY  21 }

LocalPostalAttributes ::= PDSParameter

universal-local-postal-attributes EXTENSION-ATTRIBUTE ::= {
                 UniversalLocalPostalAttributes
  IDENTIFIED BY  40 }

UniversalLocalPostalAttributes ::= UniversalPDSParameter

PDSParameter ::= SET {
  printable-string  PrintableString(SIZE (1..ub-pds-parameter-length)) OPTIONAL,
  teletex-string    TeletexString(SIZE (1..ub-pds-parameter-length)) OPTIONAL }

UniversalPDSParameter ::= UniversalOrBMPString{ub-pds-parameter-length}

extended-network-address EXTENSION-ATTRIBUTE ::= {
                 ExtendedNetworkAddress
  IDENTIFIED BY  22 }

ExtendedNetworkAddress ::= CHOICE {
  e163-4-address    SEQUENCE {
    number       [0]  NumericString(SIZE (1..ub-e163-4-number-length)),
    sub-address  [1]  NumericString(SIZE (1..ub-e163-4-sub-address-length))
                  OPTIONAL},
  psap-address [0]  PresentationAddress }

terminal-type EXTENSION-ATTRIBUTE ::= {
                 TerminalType
  IDENTIFIED BY  23 }

TerminalType ::= INTEGER {
  telex(3), teletex(4), g3-facsimile(5), g4-facsimile(6), ia5-terminal(7),
  videotex(8)}(0..ub-integer-options)

--	Extension Domain-defined Attributes

teletex-domain-defined-attributes EXTENSION-ATTRIBUTE ::= {
                 TeletexDomainDefinedAttributes
  IDENTIFIED BY  6 }

TeletexDomainDefinedAttributes ::=
  SEQUENCE SIZE (1..ub-domain-defined-attributes) OF
    TeletexDomainDefinedAttribute

TeletexDomainDefinedAttribute ::= SEQUENCE {
  type   TeletexString(SIZE (1..ub-domain-defined-attribute-type-length)),
  value  TeletexString(SIZE (1..ub-domain-defined-attribute-value-length)) }

universal-domain-defined-attributes EXTENSION-ATTRIBUTE ::= {
                 UniversalDomainDefinedAttributes
  IDENTIFIED BY  28 }

UniversalDomainDefinedAttributes ::=
  SEQUENCE SIZE (1..ub-domain-defined-attributes) OF
    UniversalDomainDefinedAttribute

UniversalDomainDefinedAttribute ::= SEQUENCE {
  type   UniversalOrBMPString{ub-domain-defined-attribute-type-length},
  value  UniversalOrBMPString{ub-domain-defined-attribute-value-length} }

ub-integer-options                        INTEGER ::= 256
ub-e163-4-number-length                   INTEGER ::= 15
ub-e163-4-sub-address-length              INTEGER ::= 40
ub-unformatted-address-length             INTEGER ::= 180
ub-pds-parameter-length                   INTEGER ::= 30
ub-pds-physical-address-lines             INTEGER ::= 6
ub-postal-code-length                     INTEGER ::= 16
ub-pds-name-length                        INTEGER ::= 16
ub-universal-surname-length               INTEGER ::= 64
ub-universal-given-name-length            INTEGER ::= 40
ub-universal-initials-length              INTEGER ::= 16
ub-universal-generation-qualifier-length  INTEGER ::= 16
ub-common-name-length                     INTEGER ::= 64
ub-extension-attributes                   INTEGER ::= 256
ub-domain-defined-attribute-type-length   INTEGER ::= 8
ub-domain-defined-attribute-value-length  INTEGER ::= 128
ub-domain-defined-attributes              INTEGER ::= 4
ub-organizational-unit-name-length        INTEGER ::= 32
ub-organizational-units                   INTEGER ::= 4
ub-generation-qualifier-length            INTEGER ::= 3
ub-initials-length                        INTEGER ::= 5
ub-given-name-length                      INTEGER ::= 16
ub-surname-length                         INTEGER ::= 40
ub-numeric-user-id-length                 INTEGER ::= 32
ub-organization-name-length               INTEGER ::= 64
ub-terminal-id-length                     INTEGER ::= 24
ub-x121-address-length                    INTEGER ::= 16
ub-domain-name-length                     INTEGER ::= 16
ub-country-name-alpha-length              INTEGER ::= 2
ub-country-name-numeric-length            INTEGER ::= 3

END -- PkiPmiExternalDataTypes

-- ASN module extracted from ITU-T X.510 (08/2020)

AVL-management {joint-iso-itu-t ds(5) module(1) avl-management(44) 9}
DEFINITIONS IMPLICIT TAGS ::=
BEGIN

-- EXPORTS All

IMPORTS
/*
  -- from Rec. ITU-T X.501 | ISO/IEC 9594-2

  Attribute{}, SupportedAttributes
    FROM InformationFramework
      {joint-iso-itu-t ds(5) module(1) informationFramework(1) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.509 | ISO/IEC 9594-8

  Certificate, CertAVL, AvlSerialNumber
    FROM AuthenticationFramework
      {joint-iso-itu-t ds(5) module(1) authenticationFramework(7) 9}
*/

  -- From x510-import

  Attribute{}, AvlSerialNumber, CertAVL, Certificate, SupportedAttributes
    FROM PKI-Stub
      {joint-iso-itu-t ds(5) module(1) pki-stub(999) 9} WITH SUCCESSORS

  Version
    FROM Wrapper
      {joint-iso-itu-t ds(5) module(1) wrapper(43) 9} WITH SUCCESSORS ;

-- PDU types

AvlProt ::= CHOICE {
  initReq       [0]  InitializationRec,
  initAcc       [1]  InitializationAcc,
  initRej       [2]  InitializationRej,
  initAbt       [3]  InitializationAbort,
  certReq       [4]  CertReq,
  certRsp       [5]  CertRsp,
  addAvlReq     [6]  AddAvlReq,
  addAvlRsp     [7]  AddAvlRsp,
  replaceAvlReq [8]  ReplaceAvlReq,
  replaceAvlRsp [9]  ReplaceAvlRsp,
  deleteAvlReq  [10] DeleteAvlReq,
  deleteAvlRsp  [11] DeleteAvlRsp,
  abortAVL      [12] AbortAVL,
  ... }

InitializationRec ::= SEQUENCE {
  version    Version,
  ... }

InitializationAcc ::= SEQUENCE {
  version    Version,
  ... }

InitializationRej ::= SEQUENCE {
  diag        ENUMERATED {
    unsupportedVersion     (0),
    ... },
  ... }

InitializationAbort ::= SEQUENCE {
  diag        ENUMERATED {
    unsupportedVersion       (0),
    onlySingleVersionAllowed (1),
    ... },
  ... }

CertReq ::= SEQUENCE {
  invokeID  InvokeID,
  ... }

InvokeID ::= INTEGER (0..127)

CertRsp ::= SEQUENCE {
  invokeID     InvokeID,
  result       CHOICE {
    success [0]  CertOK,
    failure [1]  CertErr,
    ... },
  ... }

CertOK ::= SEQUENCE {
  dhCert  Certificate,
  ... }

CertErr ::= SEQUENCE {
  notOK  AVMP-error,
  note   Notifications OPTIONAL,
  ... }

Notifications ::= SEQUENCE SIZE (1..MAX) OF Attribute {{SupportedAttributes}}

AddAvlReq ::= SEQUENCE {
  invokeID     InvokeID,
  certlist     CertAVL,
  ... }

AddAvlRsp ::= SEQUENCE {
  invokeID     InvokeID,
  result       CHOICE {
    success [0]  AddAvlOK,
    failure [1]  AddAvlErr,
    ... },
  ... }

AddAvlOK ::= SEQUENCE {
  ok     NULL,
  ... }

AddAvlErr ::= SEQUENCE {
  notOK  AVMP-error,
  ... }

ReplaceAvlReq ::= SEQUENCE {
  invokeID     InvokeID,
  old          AvlSerialNumber OPTIONAL,
  new          CertAVL,
  ... }

ReplaceAvlRsp ::= SEQUENCE {
  invokeID     InvokeID,
  result       CHOICE {
    success [0]  RepAvlOK,
    failure [1]  RepAvlErr,
    ... },
  ... }

RepAvlOK ::= SEQUENCE {
  ok     NULL,
  ... }

RepAvlErr ::= SEQUENCE {
  notOK  AVMP-error,
  ... }

DeleteAvlReq ::= SEQUENCE {
  invokeID     InvokeID,
  avl-Id       AvlSerialNumber OPTIONAL,
  ... }

DeleteAvlRsp ::= SEQUENCE {
  invokeID     InvokeID,
  result       CHOICE {
    success [0]  DelAvlOK,
    failure [1]  DelAvlErr,
    ... },
  ... }

DelAvlOK ::= SEQUENCE {
  ok     NULL,
  ... }

DelAvlErr ::= SEQUENCE {
  notOK  AVMP-error,
  ... }

AbortAVL ::= SEQUENCE {
  invokeID     InvokeID,
  reason       AVMP-error,
  ... }

AVMP-error ::= ENUMERATED {
  noReason                           (0),
  protocolError                      (1),
  duplicateAVL                       (2),
  missingAvlComponent                (3),
  invalidAvlVersion                  (4),
  notAllowedForConstrainedAVLEntity  (5),
  constrainedRequired                (6),
  nonConstrainedRequired             (7),
  unsupportedCriticalEntryExtenssion (8),
  unsupportedCriticalExtenssion      (9),
  maxAVLsExceeded                    (10),
  unknownAVL                         (11),
  ... }

END -- AVL-management

-- ASN module extracted from ITU-T X.510 (08/2020)

CaSubscription {joint-iso-itu-t ds(5) module(1) caSubscription(45) 9}
DEFINITIONS IMPLICIT TAGS ::=
BEGIN

-- EXPORTS All

IMPORTS
/*
  -- from Rec. ITU-T X.501 | ISO/IEC 9594-2

  Name
    FROM InformationFramework
      {joint-iso-itu-t ds(5) module(1) informationFramework(1) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.509 | ISO/IEC 9594-8

  Certificate, CertificateSerialNumber
    FROM AuthenticationFramework
      {joint-iso-itu-t ds(5) module(1) authenticationFramework(7) 9}

  CRLReason
    FROM CertificateExtensions
      {joint-iso-itu-t ds(5) module(1) certificateExtensions(26) 9}
*/

  Certificate, CertificateSerialNumber, CRLReason, Name
    FROM PKI-Stub
      {joint-iso-itu-t ds(5) module(1) pki-stub(999) 9}

  -- from Rec. ITU-T X.510 | ISO/IEC 9594-11

  Version
    FROM Wrapper
      {joint-iso-itu-t ds(5) module(1) wrapper(43) 9} WITH SUCCESSORS ;

CasubProt ::= CHOICE {
  initReq             [0]  InitializationRec,
  initAcc             [1]  InitializationAcc,
  initRej             [2]  InitializationRej,
  initAbt             [3]  InitializationAbort,
  certSubscribeReq    [4]  CertSubscribeReq,
  certSubscribeRsp    [5]  CertSubscribeRsp,
  certUnsubscribeReq  [6]  CertUnsubscribeReq,
  certUnsubscribeRsp  [7]  CertUnsubscribeRsp,
  certReplaceReq      [8]  CertReplaceReq,
  certReplaceRsp      [9]  CertReplaceRsp,
  certUpdateReq       [10] CertUpdateReq,
  certUpdateRsp       [11] CertUpdateRsp,
  cAsubscribeAbort    [12] CAsubscribeAbort,
  ... }

InitializationRec ::= SEQUENCE {
  version    Version,
  ... }

InitializationAcc ::= SEQUENCE {
  version    Version,
  ... }

InitializationRej ::= SEQUENCE {
  diag        ENUMERATED {
    unsupportedVersion     (0),
    ... },
  ... }

InitializationAbort ::= SEQUENCE {
  diag        ENUMERATED {
    unsupportedVersion       (0),
    onlySingleVersionAllowed (1),
    ... },
  ... }

CertSubscribeReq ::= SEQUENCE {
  invokeID     InvokeID,
  certs        SEQUENCE (SIZE (1..MAX)) OF SEQUENCE {
    subject      Name,
    serialNumber CertificateSerialNumber,
    ... },
  ... }

InvokeID ::= INTEGER (0..127)

CertSubscribeRsp ::= SEQUENCE {
  invokeID     InvokeID,
  result       CHOICE {
    success       [0]  CertSubscribeOK,
    failure       [1]  CertSubscribeErr,
    ... },
  ... }

CertSubscribeOK ::= SEQUENCE (SIZE (1..MAX)) OF CHOICE {
  ok       [0] SEQUENCE {
    cert         Certificate,
    status       CertStatus,
    revokeReason CRLReason OPTIONAL,
    ... },
  not-ok   [1] SEQUENCE {
    status       CASP-CertStatusCode,
    ... },
  ... }

CertStatus ::= ENUMERATED {
  good    (0),
  revoked (1),
  on-hold (2),
  expired (3),
  ... }

CASP-CertStatusCode ::= ENUMERATED {
  noReason       (1),
  unknownCert    (2),
  ... }

CertSubscribeErr ::= SEQUENCE {
  code       CASP-error,
  ... }

CertUnsubscribeReq ::= SEQUENCE {
  invokeID     InvokeID,
  certs  SEQUENCE (SIZE (1..MAX)) OF SEQUENCE {
    subject      Name,
    serialNumber CertificateSerialNumber,
    ... },
  ... }

CertUnsubscribeRsp ::= SEQUENCE {
  invokeID     InvokeID,
  result       CHOICE {
    success       [0]  CertUnsubscribeOK,
    failure       [1]  CertUnsubscribeErr,
    ... },
  ... }

CertUnsubscribeOK ::= SEQUENCE (SIZE (1..MAX)) OF CHOICE {
  ok       [0] SEQUENCE {
    subject      Name,
    serialNumber CertificateSerialNumber,
    ... },
  not-ok   [1] SEQUENCE {
    status       CASP-CertStatusCode,
    ... },
  ... }

CertUnsubscribeErr ::= SEQUENCE {
  code         CASP-error,
  ... }

CertReplaceReq ::= SEQUENCE {
  invokeID     InvokeID,
  certs         SEQUENCE (SIZE (1..MAX)) OF SEQUENCE {
    old           CertificateSerialNumber,
    new           Certificate,
    ... },
  ... }

CertReplaceRsp ::= SEQUENCE {
  invokeID     InvokeID,
  result        CHOICE {
    success       [0]  CertReplaceOK,
    failure       [1]  CertReplaceErr,
    ... },
  ... }

CertReplaceOK ::= SEQUENCE (SIZE (1..MAX)) OF CHOICE {
  ok        [0] SEQUENCE {
    issuer        Name,
    serialNumber  CertificateSerialNumber,
    ... },
  not-ok    [1] SEQUENCE {
    status        CASP-CertStatusCode,
    ... },
  ... }

CertReplaceErr ::= SEQUENCE {
  code          CASP-error,
  ... }

CertUpdateReq ::= SEQUENCE {
  invokeID     InvokeID,
  certs  SEQUENCE (SIZE (1..MAX)) OF SEQUENCE {
    subject      Name,
    serialNumber CertificateSerialNumber,
    certStatus   CertStatus,
    ... },
  ... }

CertUpdateRsp ::= SEQUENCE {
  invokeID      InvokeID,
  result        CHOICE {
    success       [0]  CertUpdateOK,
    failure       [1]  CertUpdateErr,
    ... },
  ... }

CertUpdateOK ::= SEQUENCE (SIZE (1..MAX)) OF CHOICE {
  ok        [0] SEQUENCE {
    subject       Name,
    serialNumber  CertificateSerialNumber,
    ... },
  not-ok    [1] SEQUENCE {
    status        CASP-CertStatusCode,
    ... },
  ... }

CertUpdateErr ::= SEQUENCE {
  code          CASP-error,
  ... }

CAsubscribeAbort ::= SEQUENCE {
  invokeID     InvokeID,
  reason       CASP-error,
  ... }

CASP-error ::= ENUMERATED {
  noReason                      (0),
  unknownContentType            (1),
  unsupportedWLMPversion        (2),
  missingContent                (3),
  missingContentComponent       (4),
  invalidContentComponent       (5),
  sequenceError                 (6),
  unknownSubject                (7),
  unknownCert                   (8),
  ... }

END -- CaSubsription

-- ASN module extracted from ITU-T X.510 (08/2020)

CryptoTools {joint-iso-itu-t ds(5) module(1) cryptoTools(42) 9}
DEFINITIONS IMPLICIT TAGS ::=
BEGIN

/*
Last component of object identifiers for X.510 modules
42 - CryptoTools
43 - Wrapper
44 - AVL-management
45 - CaSubscription
46 - TrustBroker
47 - ProtProtocols
48 - GenAlgo
*/

-- EXPORTS All

IMPORTS

  AlgoInvoke{}, ALGORITHM, AlgorithmIdentifier{}, AlgorithmWithInvoke{}
    FROM PKI-Stub
      {joint-iso-itu-t ds(5) module(1) pki-stub(999) 9} WITH SUCCESSORS

  id-algo-mca
    FROM GenAlgo
      {joint-iso-itu-t ds(5) module(1) genAlgo(48) 9} WITH SUCCESSORS ;


multipleSignaturesAlgo ALGORITHM ::= {
  PARMS         MultipleSignaturesAlgo
  IDENTIFIED BY id-algo-multipleSignaturesAlgo }

MultipleSignaturesAlgo ::= SEQUENCE SIZE (1..MAX) OF
  algo  AlgorithmIdentifier{{SupportedSignatureAlgorithms}}

SupportedSignatureAlgorithms ALGORITHM ::= {...}

multipleSymmetricKeyAlgo ALGORITHM ::= {
  PARMS         MultipleSymmetricKeyAlgo
  IDENTIFIED BY id-algo-multipleSymmetricKeyAlgo }

MultipleSymmetricKeyAlgo ::= SEQUENCE SIZE (1..MAX) OF
  algo  AlgorithmIdentifier{{SupportedSymmetricKeyAlgorithms}}

SupportedSymmetricKeyAlgorithms ALGORITHM ::= {...}

multiplePublicKeyAlgo ALGORITHM ::= {
  PARMS         MultiplePublicKeyAlgo
  IDENTIFIED BY id-algo-multiplePublicKeyAlgo }

MultiplePublicKeyAlgo ::= SEQUENCE SIZE (1..MAX) OF
  algo  AlgorithmIdentifier{{SupportedPublicKeyAlgorithms}}

SupportedPublicKeyAlgorithms ALGORITHM ::= {...}

multipleHashAlgo ALGORITHM ::= {
  PARMS         MultipleHashAlgo
  IDENTIFIED BY id-algo-multipleHashAlgo }

MultipleHashAlgo ::= SEQUENCE SIZE (1..MAX) OF
  algo  AlgorithmIdentifier{{SupportedHashAlgorithms}}

SupportedHashAlgorithms ALGORITHM ::= {...}

multipleAuthenEncryptAlgo ALGORITHM ::= {
  PARMS         MultipleAuthenEncryptAlgo
  IDENTIFIED BY id-algo-multipleAuthenEncryptAlgo }

MultipleAuthenEncryptAlgo ::= SEQUENCE SIZE (1..MAX) OF
  algo       AlgorithmIdentifier{{SupportedAuthenEncryptAlgorithms}}

SupportedAuthenEncryptAlgorithms ALGORITHM ::= {...}

multipleIcvAlgo ALGORITHM ::= {
  PARMS         MultipleIcvAlgo
  IDENTIFIED BY id-algo-multipleIcvAlgo }

MultipleIcvAlgo ::= SEQUENCE SIZE (1..MAX) OF
  algo  AlgorithmIdentifier{{SupportedIcvAlgorithms}}

SupportedIcvAlgorithms ALGORITHM ::= {...}


-- Auxiliary data types

MULTY-SIGNED{ToBeSigned} ::= SEQUENCE {
  toBeSigned  ToBeSigned,
  algorithm   ALGORITHM.&id({multipleSignaturesAlgo}),
  parmeters     SEQUENCE SIZE (1..MAX) OF
    sign          SEQUENCE {
      algo          AlgorithmIdentifier{{SupportedSignatureAlgorithms}},
      signature     BIT STRING,
      ... },
  ... }

Signed{ToBeSigned} ::= SEQUENCE {
  toBeSigned   ToBeSigned,
  signature    BIT STRING,
  altSignature BIT STRING OPTIONAL,
  ... }

ICV-Total{ToBeProtected} ::= SEQUENCE {
  toBeProtected               ToBeProtected,
  algorithmIdentifier         AlgorithmWithInvoke{{SupportedIcvAlgorithms}},
  icv                         BIT STRING,
  altAlgorithmIdentifier  [0] AlgorithmWithInvoke{{SupportedIcvAlgorithms}} OPTIONAL,
  altIcv                  [1] BIT STRING OPTIONAL,
  ... }
   (WITH COMPONENTS {..., altAlgorithmIdentifier PRESENT, altIcv PRESENT } |
    WITH COMPONENTS {..., altAlgorithmIdentifier ABSENT,  altIcv ABSENT } )

ICV-Invoke{ToBeProtected} ::= SEQUENCE {
  toBeProtected      ToBeProtected,
  dynParms       [0] AlgoInvoke{{SupportedIcvAlgorithms}} OPTIONAL,
  icv                BIT STRING,
  ... }

ENCIPHERED{ToBeEnciphered} ::= OCTET STRING (CONSTRAINED BY {
   -- shall be the result of applying an encipherment procedure
   -- to the BER-encoded octets of a value of -- ToBeEnciphered } )

AUTHEN-ENCRYPT{ToBeAuth, ToBeEnciphered} ::= SEQUENCE {
  aad  [0] ToBeAuth OPTIONAL,
  encr [1] ToBeEnciphered,
  ... }

-- Algorithms

id-algo-multipleSignaturesAlgo      OBJECT IDENTIFIER ::= {id-algo-mca 1}
id-algo-multipleSymmetricKeyAlgo    OBJECT IDENTIFIER ::= {id-algo-mca 2}
id-algo-multiplePublicKeyAlgo       OBJECT IDENTIFIER ::= {id-algo-mca 3}
id-algo-multipleHashAlgo            OBJECT IDENTIFIER ::= {id-algo-mca 4}
id-algo-multipleAuthenEncryptAlgo   OBJECT IDENTIFIER ::= {id-algo-mca 5}
id-algo-multipleIcvAlgo             OBJECT IDENTIFIER ::= {id-algo-mca 6}

END -- CryptoTools

-- ASN module extracted from ITU-T X.510 (08/2020)

GenAlgo {joint-iso-itu-t ds(5) module(1) genAlgo(48) 9}
DEFINITIONS IMPLICIT TAGS ::=
BEGIN

-- EXPORTS All

IMPORTS

  ALGORITHM, id-algo
    FROM
      PKI-Stub {joint-iso-itu-t ds(5) module(1) pki-stub(999) 9} WITH SUCCESSORS ;

id-algo-mca  OBJECT IDENTIFIER ::= {id-algo 1} -- multiple-cryptographic algorithms
id-algo-ska  OBJECT IDENTIFIER ::= {id-algo 2} -- symmetric-key algorithms
id-algo-aead OBJECT IDENTIFIER ::= {id-algo 3} -- authenticated encryption with asso data
id-algo-pka  OBJECT IDENTIFIER ::= {id-algo 4} -- public-key algorithms
id-algo-ha   OBJECT IDENTIFIER ::= {id-algo 5} -- hash algorithms
id-algo-dsa  OBJECT IDENTIFIER ::= {id-algo 6} -- digital dignature algorithms
id-algo-kea  OBJECT IDENTIFIER ::= {id-algo 7} -- key establishment algorithms


-- Key establishment algorithms

dhModpGr14Hkdf256Algo ALGORITHM ::= {
  PARMS         Group14
  DYN-PARMS     Payload14
  IDENTIFIED BY id-algo-dhModpGr14Hkdf256Algo }

Group14 ::= INTEGER (14)

Payload14 ::= SEQUENCE {
  dhPublicKey OCTET STRING (SIZE (256)),
  nonce       OCTET STRING (SIZE (32)),
  ... }

dhModpGr23Hkdf256Algo ALGORITHM ::= {
  PARMS         Group23
  DYN-PARMS     Payload23
  IDENTIFIED BY id-algo-dhModpGr23Hkdf256Algo }

Group23 ::= INTEGER (23)

Payload23 ::= SEQUENCE {
  dhPublicKey OCTET STRING (SIZE (512)),
  nonce       OCTET STRING (SIZE (32)),
  ... }

dhModpGr28Hkdf256Algo ALGORITHM ::= {
  PARMS         Group28
  DYN-PARMS     Payload28
  IDENTIFIED BY id-algo-dhModpGr28Hkdf256Algo }

Group28 ::= INTEGER (28)

Payload28 ::= SEQUENCE {
  dhPublicKey OCTET STRING (SIZE (512)),
  nonce       OCTET STRING (SIZE (32)),
  ... }

-- Object identifier allocation

id-algo-dhModpGr14Hkdf256Algo       OBJECT IDENTIFIER ::= {id-algo-kea 1}
id-algo-dhModpGr15Hkdf384Algo       OBJECT IDENTIFIER ::= {id-algo-kea 2}
id-algo-dhModpGr16Hkdf512Algo       OBJECT IDENTIFIER ::= {id-algo-kea 3}
id-algo-dhModpGr17Hkdf768Algo       OBJECT IDENTIFIER ::= {id-algo-kea 4}
id-algo-dhModpGr18Hkdf1024Algo      OBJECT IDENTIFIER ::= {id-algo-kea 5}

id-algo-dhModpGr23Hkdf256Algo       OBJECT IDENTIFIER ::= {id-algo-kea 10}

id-algo-dhModpGr28Hkdf256Algo       OBJECT IDENTIFIER ::= {id-algo-kea 15}

END -- GenAlgo

-- ASN module extracted from ITU-T X.510 (08/2020)

PKI-Stub {joint-iso-itu-t ds(5) module(1) pki-stub(999) 9}
DEFINITIONS ::=
BEGIN

id-wrprot            OBJECT IDENTIFIER ::= wrapperProtocolType
wrapperProtocolType  OBJECT IDENTIFIER ::= {ds 43}
ds                   OBJECT IDENTIFIER ::= {joint-iso-itu-t ds(5)}
id-algo              OBJECT IDENTIFIER ::= algorithms
algorithms           OBJECT IDENTIFIER ::= {ds 44}

ALGORITHM ::= CLASS {
  &Type          OPTIONAL,
  &DynParms      OPTIONAL,
  &id            OBJECT IDENTIFIER UNIQUE }
WITH SYNTAX {
  [PARMS         &Type]
  [DYN-PARMS     &DynParms ]
  IDENTIFIED BY  &id }

AlgorithmWithInvoke{ALGORITHM:SupportedAlgorithms} ::= SEQUENCE {
  algorithm       ALGORITHM.&id({SupportedAlgorithms}),
  parameters  [0] ALGORITHM.&Type({SupportedAlgorithms}{@algorithm}) OPTIONAL,
  dynamParms  [1] ALGORITHM.&DynParms({SupportedAlgorithms}{@algorithm}) OPTIONAL,
  ... }

AlgorithmIdentifier{ALGORITHM:SupportedAlgorithms} ::= SEQUENCE {
  algorithm       ALGORITHM.&id({SupportedAlgorithms}),
  parameters      ALGORITHM.&Type({SupportedAlgorithms}{@algorithm}) OPTIONAL,
  ... }

AlgoInvoke{ALGORITHM:SupportedAlgorithms} ::=
    ALGORITHM.&DynParms({SupportedAlgorithms})

HASH{ToBeHashed} ::= SEQUENCE {
  algorithmIdentifier  AlgorithmIdentifier{{SupportedAlgorithms}},
  hashValue            BIT STRING,
  ... }

sha224WithRSAEncryptionAlgorithm ALGORITHM ::= { -- IETF RFC 5754
  PARMS         NULL
  IDENTIFIED BY {1 2 840 113549 1 11} }

SupportedAlgorithms ALGORITHM ::= {...}

SIGNED{ToBeSigned} ::= SEQUENCE {
  toBeSigned              ToBeSigned,
  algorithmIdentifier     AlgorithmIdentifier{{SupportedAlgorithms}},
  signature               BIT STRING,
  ...,
  altAlgorithmIdentifier  AlgorithmIdentifier{{SupportedAlgorithms}} OPTIONAL,
  altSignature            BIT STRING OPTIONAL
  } (WITH COMPONENTS {..., altAlgorithmIdentifier PRESENT, altSignature PRESENT } |
     WITH COMPONENTS {..., altAlgorithmIdentifier ABSENT,  altSignature ABSENT } )

FingerPrint {ToBeFingerprinted} ::= SEQUENCE {
  algorithmIdentifier  AlgorithmIdentifier{{SupportedAlgorithms}},
  fingerprint          BIT STRING,
  ... }

PkiPath ::= SEQUENCE SIZE (1..MAX) OF Certificate

Certificate ::= SIGNED{TBSCertificate}

TBSCertificate ::= SEQUENCE {
  version                  [0]  Version DEFAULT v1,
  serialNumber                  CertificateSerialNumber,
  signature                     AlgorithmIdentifier{{SupportedAlgorithms}},
  issuer                        Name,
  validity                      Validity,
  subject                       Name,
  subjectPublicKeyInfo          SubjectPublicKeyInfo,
  issuerUniqueIdentifier   [1] IMPLICIT UniqueIdentifier OPTIONAL,
  ...,
  --[[2:  if present, version shall be v2 or v3
  subjectUniqueIdentifier  [2] IMPLICIT UniqueIdentifier OPTIONAL--]]--,
  --[[3:  if present, version shall be v2 or v3
  extensions               [3]  Extensions OPTIONAL --]]
  -- If present, version shall be v3]]
 } (CONSTRAINED BY { -- shall be DER encoded -- } )

Version ::= INTEGER {v1(0), v2(1), v3(2)}

CertificateSerialNumber ::= INTEGER

Validity ::= SEQUENCE {
  notBefore  Time,
  notAfter   Time,
  ... }

SubjectPublicKeyInfo ::= SEQUENCE {
  algorithm         AlgorithmIdentifier{{SupportedAlgorithms}},
  subjectPublicKey  PublicKey,
  ... }

PublicKey ::= BIT STRING

Time ::= CHOICE {
  utcTime          UTCTime,
  generalizedTime  GeneralizedTime }

UniqueIdentifier ::= BIT STRING

Extensions ::= SEQUENCE SIZE (1..MAX) OF Extension

-- For those extensions where ordering of individual extensions within the SEQUENCE is
-- significant, the specification of those individual extensions shall include the
-- rules for the significance of the order therein

Extension ::= SEQUENCE {
  extnId     EXTENSION.&id({ExtensionSet}),
  critical   BOOLEAN DEFAULT FALSE,
  extnValue  OCTET STRING
    (CONTAINING EXTENSION.&ExtnType({ExtensionSet}{@extnId})
       ENCODED BY der),
  ... }

der OBJECT IDENTIFIER ::=
  {joint-iso-itu-t asn1(1) ber-derived(2) distinguished-encoding(1)}

ExtensionSet EXTENSION ::= {...}

EXTENSION ::= CLASS {
  &id           OBJECT IDENTIFIER UNIQUE,
  &ExtnType }
WITH SYNTAX {
  SYNTAX        &ExtnType
  IDENTIFIED BY &id }

Name ::= CHOICE { -- only one possibility for now -- rdnSequence  RDNSequence }

RDNSequence ::= SEQUENCE OF RelativeDistinguishedName

RelativeDistinguishedName ::= SET SIZE (1..MAX) OF AttributeTypeAndValue

DistinguishedName ::= RDNSequence

AttributeTypeAndValue ::= SEQUENCE {
  type                  ATTRIBUTE.&id, --({SupportedAttributes}),
  value                 ATTRIBUTE.&type, --({SupportedAttributes}{@type}),
  ... }

SupportedAttributes ATTRIBUTE ::= {...}

ATTRIBUTE ::= CLASS {
  &type                     UTF8String,
  &id                       OBJECT IDENTIFIER UNIQUE }
WITH SYNTAX {
  WITH SYNTAX               &type
  ID                        &id }

Attribute {ATTRIBUTE:SupportedAttributes} ::= SEQUENCE {
  type                ATTRIBUTE.&id({SupportedAttributes}),
  values              SET SIZE (0..MAX) OF ATTRIBUTE.&type({SupportedAttributes}{@type}),
  ... }

AttributeCertificate ::= SIGNED{TBSAttributeCertificate}

TBSAttributeCertificate ::= SEQUENCE {
  version                 AttCertVersion, -- version is v2
  holder                  Holder,
  issuer                  AttCertIssuer,
  signature               AlgorithmIdentifier{{SupportedAlgorithms}},
  serialNumber            CertificateSerialNumber,
  attrCertValidityPeriod  AttCertValidityPeriod,
  attributes              SEQUENCE OF Attribute{{SupportedAttributes}},
  issuerUniqueID          UniqueIdentifier OPTIONAL,
  ...,
  ...,
  extensions              Extensions OPTIONAL
 }  (CONSTRAINED BY { -- shall be DER encoded -- } )

AttCertVersion ::= INTEGER {v2(1)}

Holder ::= SEQUENCE {
  baseCertificateID  [0]  IssuerSerial OPTIONAL,
  entityName         [1]  GeneralNames OPTIONAL,
  objectDigestInfo   [2]  ObjectDigestInfo OPTIONAL }
  (WITH COMPONENTS {..., baseCertificateID  PRESENT } |
   WITH COMPONENTS {..., entityName  PRESENT } |
   WITH COMPONENTS {..., objectDigestInfo  PRESENT } )

IssuerSerial ::= SEQUENCE {
  issuer     GeneralNames,
  serial     CertificateSerialNumber,
  issuerUID  UniqueIdentifier OPTIONAL,
  ... }

ObjectDigestInfo ::= SEQUENCE {
  digestedObjectType   ENUMERATED {
    publicKey        (0),
    publicKeyCert    (1),
    otherObjectTypes (2)},
  otherObjectTypeID   OBJECT IDENTIFIER OPTIONAL,
  digestAlgorithm     AlgorithmIdentifier{{SupportedAlgorithms}},
  objectDigest        BIT STRING,
  ... }

AttCertIssuer ::= [0]  SEQUENCE {
  issuerName              GeneralNames OPTIONAL,
  baseCertificateID  [0]  IssuerSerial OPTIONAL,
  objectDigestInfo   [1]  ObjectDigestInfo OPTIONAL,
  ... }
  (WITH COMPONENTS {..., issuerName  PRESENT } |
   WITH COMPONENTS {..., baseCertificateID  PRESENT } |
   WITH COMPONENTS {..., objectDigestInfo  PRESENT } )

AttCertValidityPeriod ::= SEQUENCE {
  notBeforeTime  GeneralizedTime,
  notAfterTime   GeneralizedTime,
  ... }

GeneralNames ::= SEQUENCE SIZE (1..MAX) OF GeneralName

GeneralName ::= CHOICE {
  otherName                  [0]  INSTANCE OF OTHER-NAME,
  rfc822Name                 [1]  IA5String,
  dNSName                    [2]  IA5String,
--x400Address                [3]  ORAddress,
  directoryName              [4]  Name,
--ediPartyName               [5]  EDIPartyName,
  uniformResourceIdentifier  [6]  IA5String,
  iPAddress                  [7]  OCTET STRING,
  registeredID               [8]  OBJECT IDENTIFIER,
  ... }

OTHER-NAME ::= TYPE-IDENTIFIER

CertAVL ::= SIGNED {TBSCertAVL}

TBSCertAVL ::= SEQUENCE {
  version               [0]  IMPLICIT Version DEFAULT v1,
  serialNumber               AvlSerialNumber OPTIONAL,
  signature                  AlgorithmIdentifier {{SupportedAlgorithms}},
  issuer                     Name,
  constrained                BOOLEAN,
  entries                    SEQUENCE (SIZE (1..MAX)) OF SEQUENCE {
    idType                     CHOICE {
      certIdentifier        [0]  PKCertIdentifier,
      entityGroup                DistinguishedName, -- only for constrained = FALSE
      ... },
    entryExtensions       [1]  IMPLICIT Extensions OPTIONAL,
    ... },
  ...,
  ...,
  avlExtensions              Extensions OPTIONAL }

AvlSerialNumber ::= INTEGER (0..MAX)

PKCertIdentifier ::= CHOICE {
  issuerSerialNumber         IssuerSerialNumber,
  fingerprintPKC        [0]  IMPLICIT FingerPrint {Certificate},
  fingerprintPK         [1]  IMPLICIT FingerPrint {PublicKey},
  ... }

IssuerSerialNumber ::= SEQUENCE {
  issuer        Name,
  serialNumber  CertificateSerialNumber,
  ... }

CRLReason ::= ENUMERATED {
  unspecified          (0),
  keyCompromise        (1),
  cACompromise         (2),
  affiliationChanged   (3),
  superseded           (4),
  cessationOfOperation (5),
  certificateHold      (6),
  removeFromCRL        (8),
  privilegeWithdrawn   (9),
  aACompromise         (10),
  ...,
  weakAlgorithmOrKey   (11) }

END

-- ASN module extracted from ITU-T X.510 (08/2020)

ProtProtocols {joint-iso-itu-t ds(5) module(1) protProtocols(47) 9}
DEFINITIONS IMPLICIT TAGS ::=
BEGIN

-- EXPORTS All

IMPORTS

  id-wrprot
    FROM
      PKI-Stub {joint-iso-itu-t ds(5) module(1) pki-stub(999) 9} WITH SUCCESSORS

  WRAPPED-PROT
    FROM Wrapper
      {joint-iso-itu-t ds(5) module(1) wrapper(43) 9} WITH SUCCESSORS

  AvlProt
    FROM AVL-management
      {joint-iso-itu-t ds(5) module(1) avl-management(44) 9} WITH SUCCESSORS

  CasubProt
    FROM CaSubscription
      {joint-iso-itu-t ds(5) module(1) caSubscription(45) 9} WITH SUCCESSORS

  TBprot
    FROM TrustBroker
      {joint-iso-itu-t ds(5) module(1) trustBroker(46) 9} WITH SUCCESSORS;


avlProt WRAPPED-PROT ::= {
                 AvlProt
  IDENTIFIED BY  id-avlprot }

casubProt WRAPPED-PROT ::= {
                 CasubProt
  IDENTIFIED BY  id-casubprot }

tbprot WRAPPED-PROT ::= {
                 TBprot
  IDENTIFIED BY  id-tbprot }

SupportedProtSet WRAPPED-PROT ::= {avlProt | casubProt | tbprot }

id-avlprot          OBJECT IDENTIFIER ::= {id-wrprot 0}
id-casubprot        OBJECT IDENTIFIER ::= {id-wrprot 1}
id-tbprot           OBJECT IDENTIFIER ::= {id-wrprot 2}

END -- ProtProtocols

-- ASN module extracted from ITU-T X.510 (08/2020)

TrustBroker {joint-iso-itu-t ds(5) module(1) trustBroker(46) 9}
DEFINITIONS IMPLICIT TAGS ::=
BEGIN

-- EXPORTS All

IMPORTS

  -- from Rec. ITU-T X.509 | ISO/IEC 9594-8
/*
  PKCertIdentifier
    FROM AuthenticationFramework
      {joint-iso-itu-t ds(5) module(1) authenticationFramework(7) 9} WITH SUCCESSORS
*/
  PKCertIdentifier
    FROM PKI-Stub
      {joint-iso-itu-t ds(5) module(1) pki-stub(999) 9} WITH SUCCESSORS

  Version
    FROM Wrapper
      {joint-iso-itu-t ds(5) module(1) wrapper(43) 9} WITH SUCCESSORS ;

 -- PDU types

TBprot ::= CHOICE {
  initReq     [0] InitializationReq,
  initAcc     [1] InitializationAcc,
  initRej     [2] InitializationRej,
  initAbt     [3] InitializationAbort,
  tBrequest   [4] TBrequest,
  tBresponse  [5] TBresponse,
  ... }

InitializationReq ::= SEQUENCE {
  version    Version,
  ... }

InitializationAcc ::= SEQUENCE {
  version    Version,
  ... }

InitializationRej ::= SEQUENCE {
  diag        ENUMERATED {
    unsupportedVersions     (0),
    ... },
  ... }

InitializationAbort ::= SEQUENCE {
  diag        ENUMERATED {
    unsupportedVersion       (0),
    onlySingleVersionAllowed (1),
    ... },
  ... }

TBrequest ::= CHOICE {
  caCert      [0] PKCertIdentifier,
  subjectCert [1] PKCertIdentifier,
  ... }

TBresponse ::= CHOICE {
  success [0]  TBOK,
  failure [1]  TBerror,
  ... }

TBOK ::= SEQUENCE {
  levelOfAssurance  [0]  INTEGER (0..100),
  confidenceLevel   [1]  INTEGER (0..100),
  validationTime    [2]  UTCTime,
  info              [3]  UTF8String  OPTIONAL,
  ... }

TBerror ::= SEQUENCE {
  code        ENUMERATED {
    caCertInvalid        (1),
    unknownCert          (2),
    unknownCertStatus    (3),
    subjectCertRevoked   (4),
    incorrectCert        (5),
    contractExpired      (6),
    pathValidationFailed (7),
    timeOut              (8),
    other                (99),
    ... },
  diagnostic  UTF8String OPTIONAL,
  ... }

END -- Trustbroker

-- ASN module extracted from ITU-T X.510 (08/2020)

Wrapper {joint-iso-itu-t ds(5) module(1) wrapper(43) 9}
DEFINITIONS IMPLICIT TAGS ::=
BEGIN

-- EXPORTS All

IMPORTS

  AlgoInvoke{}, ALGORITHM, AlgorithmIdentifier{}, AlgorithmWithInvoke{}, AttributeCertificate, id-wrprot, PkiPath
    FROM PKI-Stub
      {joint-iso-itu-t ds(5) module(1) pki-stub(999) 9}

  SupportedProtSet
    FROM ProtProtocols
      {joint-iso-itu-t ds(5) module(1) protProtocols(47) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.510 | ISO/IEC 9594-11

  AUTHEN-ENCRYPT{}, ENCIPHERED{}, ICV-Invoke{}, Signed{}
    FROM CryptoTools
      {joint-iso-itu-t ds(5) module(1) cryptoTools(42) 9 } WITH SUCCESSORS ;

WRAPPED-PROT ::= TYPE-IDENTIFIER

WrappedProt {WRAPPED-PROT:SupportedProtSet} ::= SEQUENCE {
  id    WRAPPED-PROT.&id({SupportedProtSet}),
  prot  WRAPPED-PROT.&Type({SupportedProtSet}{@id}),
  ... }

WrapperPDU ::= CHOICE {
  handshakeReq       [0]  HandshakeReq,
  handshakeAcc       [1]  HandshakeAcc,
  handshakeWrpRej    [2]  HandshakeWrpRej,
  handshakeProRej    [3]  HandshakeProRej,
  handshakeSecAbort  [4]  HandshakeSecAbort,
  handshakeProAbort  [5]  HandshakeProAbort,
  dtSecAbort         [6]  DtSecAbort,
  applAbort          [7]  ApplAbort,
  releaseReq         [8]  ReleaseReq,
  releaseRsp         [9]  ReleaseRsp,
  dataTransferClient [10] DataTransferClient,
  dataTransferServer [11] DataTransferServer,
  ... }

HandshakeReq ::= Signed{TbsHandshakeReq}

TbsHandshakeReq ::= SEQUENCE {
  version        Version DEFAULT {v1},
  prProt         WRAPPED-PROT.&id ({SupportedProtSet}),
  sigAlg         AlgorithmIdentifier {{SupportedSignatureAlgorithms}},
  altSigAlg  [0] AlgorithmIdentifier {{SupportedAltSignatureAlgorithms}} OPTIONAL,
  pkiPath        DER-PkiPath,
  assoID         AssoID,
  time           TimeStamp,
  keyEst         AlgorithmWithInvoke{{SupportedKeyEstablishmentAlgos}},
  altKeyEst  [1] AlgorithmWithInvoke{{SupportedAltKeyEstablishmentAlgos}} OPTIONAL,
  encr-mode      CHOICE {
    aead       [2] SEQUENCE SIZE (1..MAX) OF
      algo           AlgorithmIdentifier{{SupportedAeadAlgorithms}},
    non-aead   [3] SEQUENCE {
      encr       [0] SEQUENCE SIZE (1..MAX) OF
        algo           AlgorithmIdentifier{{SupportedSymmetricKeyAlgorithms}}
                         OPTIONAL,
      icvAlgID   [1] SEQUENCE SIZE (1..MAX) OF
        algo           AlgorithmIdentifier{{SupportedIcvAlgorithms}} },
    ... },
  attCert        DER-AttributeCertificate OPTIONAL,
  applData   [4] WrappedProt{{SupportedProtSet}} OPTIONAL,
  ... }

Version ::= BIT STRING {
  v1 (0)  -- version 1
  }

DER-PkiPath ::= OCTET STRING
  (CONTAINING PkiPath ENCODED BY der)

DER-AttributeCertificate ::= OCTET STRING
  (CONTAINING AttributeCertificate ENCODED BY der)

der OBJECT IDENTIFIER ::=
  {joint-iso-itu-t asn1(1) ber-derived(2) distinguished-encoding(1)}

AssoID ::= INTEGER (0..32767)

TimeStamp ::= GeneralizedTime

SupportedSignatureAlgorithms ALGORITHM ::= {...}

SupportedAltSignatureAlgorithms ALGORITHM ::= {...}

SupportedKeyEstablishmentAlgos ALGORITHM ::= {...}

SupportedAltKeyEstablishmentAlgos ALGORITHM ::= {...}

SupportedAeadAlgorithms ALGORITHM ::= {...}

SupportedSymmetricKeyAlgorithms ALGORITHM ::= {...}

SupportedIcvAlgorithms ALGORITHM ::= {...}

HandshakeAcc ::= Signed{TbsHandshakeAcc}

TbsHandshakeAcc ::= SEQUENCE {
  version        Version DEFAULT {v1},
  sigSel         CHOICE {
    sigAlg         AlgorithmIdentifier{{SupportedSignatureAlgorithms}},
    altSigAlg  [0] AlgorithmIdentifier{{SupportedAltSignatureAlgorithms}} },
  pkiPath        DER-PkiPath,
  assoID         AssoID,
  time           TimeStamp,
  keyEstSel      CHOICE {
    keyEst         AlgorithmWithInvoke{{SupportedKeyEstablishmentAlgos}},
    altKeyEst  [1] AlgorithmWithInvoke{{SupportedAltKeyEstablishmentAlgos}} },
  encr-mode      CHOICE {
    aead       [2] AlgorithmIdentifier{{SupportedAeadAlgorithms}},
    non-aead   [3] SEQUENCE {
      encr       [0] AlgorithmIdentifier{{SupportedSymmetricKeyAlgorithms}} OPTIONAL,
      icvAlgID   [1] AlgorithmIdentifier{{SupportedIcvAlgorithms}} },
    ... },
  attCert        DER-AttributeCertificate OPTIONAL,
  applData   [4] WrappedProt{{SupportedProtSet}} OPTIONAL,
  ... }

HandshakeWrpRej ::= Signed{TbsHandshakeWrpRej}

TbsHandshakeWrpRej ::= SEQUENCE {
  version        Version DEFAULT {v1},
  sigSel         CHOICE {
    sigAlg         AlgorithmIdentifier{{SupportedSignatureAlgorithms}},
    altSigAlg  [0] AlgorithmIdentifier{{SupportedAltSignatureAlgorithms}} },
  assoID         AssoID,
  time           TimeStamp,
  pkiPath        DER-PkiPath,
  diag           WrpError OPTIONAL,
  ... }

HandshakeProRej ::= Signed{TbsHandshakeProRej}

TbsHandshakeProRej ::= SEQUENCE {
  sigSel         CHOICE {
    sigAlg         AlgorithmIdentifier{{SupportedSignatureAlgorithms}},
    altSigAlg  [0] AlgorithmIdentifier{{SupportedAltSignatureAlgorithms}} },
  assoID         AssoID,
  time           TimeStamp,
  pkiPath        DER-PkiPath,
  applData       WrappedProt{{SupportedProtSet}},
  ... }

HandshakeSecAbort ::= Signed{TbsHandshakeSecAbort}

TbsHandshakeSecAbort ::= SEQUENCE {
  version      Version DEFAULT {v1},
  sigAlg       AlgorithmIdentifier{{SupportedSignatureAlgorithms}},
  assoID       AssoID,
  time         TimeStamp,
  pkiPath      DER-PkiPath,
  diag         WrpError OPTIONAL,
  ... }

HandshakeProAbort ::= Signed{TbsHandshakeProAbort}

TbsHandshakeProAbort ::= SEQUENCE {
  sigAlg       AlgorithmIdentifier{{SupportedSignatureAlgorithms}},
  assoID       AssoID,
  time         TimeStamp,
  pkiPath      DER-PkiPath,
  applData     WrappedProt{{SupportedProtSet}},
  ... }

DtSecAbort ::= Signed{TbsDtSecAbort}

TbsDtSecAbort ::= SEQUENCE {
  sigAlg       AlgorithmIdentifier{{SupportedSignatureAlgorithms}},
  assoID       AssoID,
  time         TimeStamp,
  pkiPath      DER-PkiPath,
  seq          SequenceNumber,
  diag         WrpError OPTIONAL,
  ... }

ApplAbort ::= Signed{TbsApplAbort}

TbsApplAbort ::= SEQUENCE {
  sigAlg       AlgorithmIdentifier{{SupportedSignatureAlgorithms}},
  assoID       AssoID,
  time         TimeStamp,
  pkiPath      DER-PkiPath,
  seq          SequenceNumber,
  applData     WrappedProt{{SupportedProtSet}},
  ... }

ReleaseReq ::= Signed{TbsReleaseReq}

TbsReleaseReq ::= SEQUENCE {
  version      Version DEFAULT {v1},
  sigAlg       AlgorithmIdentifier{{SupportedSignatureAlgorithms}},
  assoID       AssoID,
  time         TimeStamp,
  pkiPath      DER-PkiPath,
  ... }

ReleaseRsp ::= Signed{TbsReleaseRsp}

TbsReleaseRsp ::= SEQUENCE {
  version      Version DEFAULT {v1},
  sigAlg       AlgorithmIdentifier{{SupportedSignatureAlgorithms}},
  assoID       AssoID,
  time         TimeStamp,
  pkiPath      DER-PkiPath,
  ... }

DataTransferClient ::= CHOICE {
  aead     [0] DataTransferClientAE,
  non-aead [1] DataTransferClientNEA,
  ... }

DataTransferClientAE ::= AUTHEN-ENCRYPT{AadClientAE, WRAPPED-PROT.&Type}

AadClientAE ::= SEQUENCE {
  COMPONENTS OF    AadClient,
  encInvoke    [3] AlgoInvoke{{SupportedAeadAlgorithms}} OPTIONAL,
  ... }

DataTransferClientNEA ::= ICV-Invoke{TbpDataTransferClient}

TbpDataTransferClient ::= SEQUENCE {
  COMPONENTS OF    AadClient,
  encEnvoke    [3] AlgoInvoke{{SupportedSymmetricKeyAlgorithms}} OPTIONAL,
  conf             CHOICE {
    clear        [4] WrappedProt{{SupportedProtSet}},
    protected    [5] ENCIPHERED{WRAPPED-PROT.&Type},
    ... },
  ... }

AadClient ::= SEQUENCE {
  invokeID [0] InvokeID OPTIONAL,
  assoID       AssoID,
  time         TimeStamp,
  seq          SequenceNumber,
  keyEst   [2] AlgoInvoke{{SupportedKeyEstablishmentAlgos}} OPTIONAL }

InvokeID ::= OCTET STRING (SIZE (6))

SequenceNumber ::= INTEGER (0..2147483647)

DataTransferServer ::= CHOICE {
  aead     [0] DataTransferServerAE,
  non-aead [1] DataTransferServerNEA,
  ... }

DataTransferServerAE ::= AUTHEN-ENCRYPT{AadServerAE, WRAPPED-PROT.&Type}

AadServerAE ::= SEQUENCE {
  COMPONENTS OF AadServer,
  encInvoke [3] AlgoInvoke{{SupportedAeadAlgorithms}} OPTIONAL,
  ... }

DataTransferServerNEA ::= ICV-Invoke{TbpDataTransferServer}

TbpDataTransferServer ::= SEQUENCE {
  COMPONENTS OF     AadServer,
  encInvoke     [3] AlgoInvoke{{SupportedSymmetricKeyAlgorithms}} OPTIONAL,
  conf              CHOICE {
    clear         [4] WrappedProt{{SupportedProtSet}},
    protected     [5] ENCIPHERED{WRAPPED-PROT.&Type},
    ... },
  ... }

AadServer ::= SEQUENCE {
  invokeID   [0] InvokeID OPTIONAL,
  assoID         AssoID,
  time           TimeStamp,
  seq            SequenceNumber,
  reqRekey   [1] BOOLEAN DEFAULT FALSE,
  changedKey [2] BOOLEAN DEFAULT FALSE }

WrpError ::= ENUMERATED {
  protocol-error                         (0),
  invalid-signatureAlgorithm             (1),
  unexpected-version                     (2),
  protected-protocol-not-supported       (3),
  duplicate-assoID                       (4),
  invalid-time-value                     (5),
  key-estab-algorithm-not-supported      (6),
  encr-mode-aead-not-supported           (7),
  encryption-not-supported               (8),
  encryption-required                    (9),
  aead-algorithms-not-supported          (10),
  aead-is-required                       (11),
  symmetricKey-algorithms-not-supported  (12),
  icv-algorithms-not-supported           (13),
  invalid-attribute-certificate          (14),
  alt-signature-not-allowed              (15),
  only-one-version                       (16),
  invalid-key-estab-algorithm            (17),
  invalid-alt-key-estab-algorithm        (18),
  invalid-aead-algorithm                 (19),
  aead-not-allowed                       (20),
  invalid-symmetricKey-algorithm         (21),
  invalid-icv-algorithm                  (22),
  dynamic-aead-algo-parms-required       (23),
  invalid-dynamic-aead-algo-parms        (24),
  dynamic-aead-algo-parms-not-required   (25),
  dynamic-symKey-algo-parms-required     (26),
  invalid-dynamic-symKey-algo-parms      (27),
  dynamic-symKey-algo-parms-not-required (28),
  dynamic-icv-algo-parms-required        (29),
  invalid-dynamic-icv-algo-parms         (30),
  dynamic-icv-algo-parms-not-required    (31),
  unexpected-invokeID-received           (32),
  rekey-out-of-sequence                  (33),
  invalid-dynamic-keyEst-algo-parms      (34),
  changedKey-out-of-sequence             (35),
  ... }

END -- Wrapper

DirectoryAbstractService {joint-iso-itu-t ds(5) module(1) directoryAbstractService(2) 9}
DEFINITIONS ::=
BEGIN

-- EXPORTS All
/*
The types and values defined in this module are exported for use in the other ASN.1
modules contained within these Directory Specifications, and for the use of other
applications which will use them to access Directory services. Other applications may
use them for their own purposes, but this will not constrain extensions and
modifications needed to maintain or improve the Directory service.
*/
IMPORTS

  -- from Rec. ITU-T X.501 | ISO/IEC 9594-2

  id-at
    FROM UsefulDefinitions
      {joint-iso-itu-t ds(5) module(1) usefulDefinitions(0) 9} WITH SUCCESSORS

  Attribute{}, ATTRIBUTE, AttributeType, AttributeTypeAndValue, AttributeTypeAssertion,
  AttributeValue, AttributeValueAssertion, CONTEXT, ContextAssertion,
  DistinguishedName, MATCHING-RULE, Name, OBJECT-CLASS,
  RelativeDistinguishedName, SupportedAttributes, SupportedContexts
    FROM InformationFramework
      {joint-iso-itu-t ds(5) module(1) informationFramework(1) 9} WITH SUCCESSORS

  RelaxationPolicy
    FROM ServiceAdministration
      {joint-iso-itu-t ds(5) module(1) serviceAdministration(33) 9} WITH SUCCESSORS

  OPTIONALLY-PROTECTED{}, OPTIONALLY-PROTECTED-SEQ{}
    FROM EnhancedSecurity
      {joint-iso-itu-t ds(5) modules(1) enhancedSecurity(28) 9} WITH SUCCESSORS

 -- from Rec. ITU-T X.518 | ISO/IEC 9594-4

  AccessPoint, ContinuationReference, Exclusions, OperationProgress, ReferenceType
    FROM DistributedOperations
      {joint-iso-itu-t ds(5) module(1) distributedOperations(3) 9} WITH SUCCESSORS

-- from Rec. ITU-T X.519 | ISO/IEC 9594-5

  Code, ERROR, id-errcode-abandoned, id-errcode-abandonFailed,
  id-errcode-attributeError, id-errcode-nameError, id-errcode-referral,
  id-errcode-securityError, id-errcode-serviceError, id-errcode-updateError,
  id-opcode-abandon, id-opcode-addEntry, id-opcode-administerPassword,
  id-opcode-compare, id-opcode-changePassword, id-opcode-ldapTransport,
  id-opcode-linkedLDAP, id-opcode-list,   id-opcode-modifyDN,
  id-opcode-modifyEntry, id-opcode-read, id-opcode-removeEntry,
  id-opcode-search, InvokeId, OPERATION
    FROM CommonProtocolSpecification
      {joint-iso-itu-t ds(5) module(1) commonProtocolSpecification(35) 9} WITH SUCCESSORS

-- from Rec. ITU-T X.520 | ISO/IEC 9594-6

  DirectoryString{}, UnboundedDirectoryString
    FROM SelectedAttributeTypes
      {joint-iso-itu-t ds(5) module(1) selectedAttributeTypes(5) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.509 | ISO/IEC 9594-8

  AlgorithmIdentifier{}, CertificationPath, ENCRYPTED{}, HASH{}, SIGNED{},
  SupportedAlgorithms
    FROM AuthenticationFramework
      {joint-iso-itu-t ds(5) module(1) authenticationFramework(7) 9} WITH SUCCESSORS

  UserPwd
    FROM PasswordPolicy
      {joint-iso-itu-t ds(5) module(1) passwordPolicy(39) 9} WITH SUCCESSORS

  AttributeCertificationPath
    FROM AttributeCertificateDefinitions
      {joint-iso-itu-t ds(5) module(1) attributeCertificateDefinitions(32) 9}
       WITH SUCCESSORS

  -- from Rec. ITU-T X.525 | ISO/IEC 9594-9

  AgreementID
    FROM DirectoryShadowAbstractService
      {joint-iso-itu-t ds(5) module(1) directoryShadowAbstractService(15) 9}
       WITH SUCCESSORS

  -- from IETF RFC 2025

  SPKM-ERROR, SPKM-REP-TI, SPKM-REQ
    FROM SpkmGssTokens {iso(1) identified-organization(3) dod(6) internet(1)
      security(5) mechanisms(5) spkm(1) spkmGssTokens(10)}

 -- from IETF RFC 4511

  LDAPMessage
    FROM Lightweight-Directory-Access-Protocol-V3
      {iso(1) identified-organization(3) dod(6) internet(1) directory(1) ldap(18)} ;

-- Common data types

CommonArguments ::= SET {
  serviceControls      [30]  ServiceControls    DEFAULT {},
  securityParameters   [29]  SecurityParameters OPTIONAL,
  requestor            [28]  DistinguishedName  OPTIONAL,
  operationProgress    [27]  OperationProgress
                             DEFAULT {nameResolutionPhase notStarted},
  aliasedRDNs          [26]  INTEGER            OPTIONAL,
  criticalExtensions   [25]  BIT STRING         OPTIONAL,
  referenceType        [24]  ReferenceType      OPTIONAL,
  entryOnly            [23]  BOOLEAN            DEFAULT TRUE,
  exclusions           [22]  Exclusions         OPTIONAL,
  nameResolveOnMaster  [21]  BOOLEAN            DEFAULT FALSE,
  operationContexts    [20]  ContextSelection   OPTIONAL,
  familyGrouping       [19]  FamilyGrouping     DEFAULT entryOnly,
  ... }

CommonArgumentsSeq ::= SEQUENCE {
  serviceControls      [30]  ServiceControls    DEFAULT {},
  securityParameters   [29]  SecurityParameters OPTIONAL,
  requestor            [28]  DistinguishedName  OPTIONAL,
  operationProgress    [27]  OperationProgress
                             DEFAULT {nameResolutionPhase notStarted},
  aliasedRDNs          [26]  INTEGER            OPTIONAL,
  criticalExtensions   [25]  BIT STRING         OPTIONAL,
  referenceType        [24]  ReferenceType      OPTIONAL,
  entryOnly            [23]  BOOLEAN            DEFAULT TRUE,
  exclusions           [22]  Exclusions         OPTIONAL,
  nameResolveOnMaster  [21]  BOOLEAN            DEFAULT FALSE,
  operationContexts    [20]  ContextSelection   OPTIONAL,
  familyGrouping       [19]  FamilyGrouping     DEFAULT entryOnly,
  ... }

FamilyGrouping ::= ENUMERATED {
  entryOnly     (1),
  compoundEntry (2),
  strands       (3),
  multiStrand   (4),
  ... }

CommonResults ::= SET {
  securityParameters  [30]  SecurityParameters  OPTIONAL,
  performer           [29]  DistinguishedName   OPTIONAL,
  aliasDereferenced   [28]  BOOLEAN             DEFAULT FALSE,
  notification        [27]  SEQUENCE SIZE (1..MAX) OF Attribute
                            {{SupportedAttributes}} OPTIONAL,
  ... }

CommonResultsSeq ::= SEQUENCE {
  securityParameters  [30]  SecurityParameters OPTIONAL,
  performer           [29]  DistinguishedName OPTIONAL,
  aliasDereferenced   [28]  BOOLEAN DEFAULT FALSE,
  notification        [27]  SEQUENCE SIZE (1..MAX) OF Attribute
                            {{SupportedAttributes}} OPTIONAL,
  ... }

ServiceControls ::= SET {
  options              [0]  ServiceControlOptions DEFAULT {},
  priority             [1]  INTEGER {low(0), medium(1), high(2)} DEFAULT medium,
  timeLimit            [2]  INTEGER OPTIONAL,
  sizeLimit            [3]  INTEGER OPTIONAL,
  scopeOfReferral      [4]  INTEGER {dmd(0), country(1)} OPTIONAL,
  attributeSizeLimit   [5]  INTEGER OPTIONAL,
  manageDSAITPlaneRef  [6]  SEQUENCE {
    dsaName                   Name,
    agreementID               AgreementID,
    ...} OPTIONAL,
  serviceType          [7]  OBJECT IDENTIFIER OPTIONAL,
  userClass            [8]  INTEGER OPTIONAL,
  ... }

ServiceControlOptions ::= BIT STRING {
  preferChaining          (0),
  chainingProhibited      (1),
  localScope              (2),
  dontUseCopy             (3),
  dontDereferenceAliases  (4),
  subentries              (5),
  copyShallDo             (6),
  partialNameResolution   (7),
  manageDSAIT             (8),
  noSubtypeMatch          (9),
  noSubtypeSelection      (10),
  countFamily             (11),
  dontSelectFriends       (12),
  dontMatchFriends        (13),
  allowWriteableCopy      (14)}

EntryInformationSelection ::= SET {
  attributes                     CHOICE {
    allUserAttributes         [0]  NULL,
    select                    [1]  SET OF AttributeType
    -- empty set implies no attributes are requested -- } DEFAULT allUserAttributes:NULL,
    infoTypes               [2]  INTEGER {
      attributeTypesOnly        (0),
      attributeTypesAndValues   (1)} DEFAULT attributeTypesAndValues,
  extraAttributes                CHOICE {
    allOperationalAttributes  [3]  NULL,
    select                    [4]  SET SIZE (1..MAX) OF AttributeType } OPTIONAL,
  contextSelection               ContextSelection OPTIONAL,
  returnContexts                 BOOLEAN DEFAULT FALSE,
  familyReturn                   FamilyReturn DEFAULT
                                   {memberSelect contributingEntriesOnly} }

ContextSelection ::= CHOICE {
  allContexts       NULL,
  selectedContexts  SET SIZE (1..MAX) OF TypeAndContextAssertion,
  ... }

TypeAndContextAssertion ::= SEQUENCE {
  type               AttributeType,
  contextAssertions  CHOICE {
    preference         SEQUENCE OF ContextAssertion,
    all                SET OF ContextAssertion,
    ...},
  ... }

FamilyReturn ::= SEQUENCE {
  memberSelect   ENUMERATED {
    contributingEntriesOnly   (1),
    participatingEntriesOnly  (2),
    compoundEntry             (3),
    ...},
  familySelect   SEQUENCE SIZE (1..MAX) OF OBJECT-CLASS.&id OPTIONAL,
  ... }

EntryInformation ::= SEQUENCE {
  name                  Name,
  fromEntry             BOOLEAN DEFAULT TRUE,
  information           SET SIZE (1..MAX) OF CHOICE {
    attributeType         AttributeType,
    attribute             Attribute{{SupportedAttributes}},
    ...} OPTIONAL,
  incompleteEntry  [3]  BOOLEAN DEFAULT FALSE,
  partialName      [4]  BOOLEAN DEFAULT FALSE,
  derivedEntry     [5]  BOOLEAN DEFAULT FALSE,
  ... }

family-information ATTRIBUTE ::= {
  WITH SYNTAX  FamilyEntries
  USAGE        directoryOperation
  ID           id-at-family-information }

FamilyEntries ::= SEQUENCE {
  family-class   OBJECT-CLASS.&id, -- structural object class value
  familyEntries  SEQUENCE OF FamilyEntry,
  ... }

FamilyEntry ::= SEQUENCE {
  rdn            RelativeDistinguishedName,
  information    SEQUENCE OF CHOICE {
    attributeType  AttributeType,
    attribute      Attribute{{SupportedAttributes}},
    ...},
  family-info    SEQUENCE SIZE (1..MAX) OF FamilyEntries OPTIONAL,
  ... }

Filter ::= CHOICE {
  item  [0]  FilterItem,
  and   [1]  SET OF Filter,
  or    [2]  SET OF Filter,
  not   [3]  Filter,
  ... }

FilterItem ::= CHOICE {
  equality          [0]  AttributeValueAssertion,
  substrings        [1]  SEQUENCE {
    type                   ATTRIBUTE.&id({SupportedAttributes}),
    strings                SEQUENCE OF CHOICE {
      initial           [0]  ATTRIBUTE.&Type
                              ({SupportedAttributes}{@substrings.type}),
      any               [1]  ATTRIBUTE.&Type
                              ({SupportedAttributes}{@substrings.type}),
      final             [2]  ATTRIBUTE.&Type
                              ({SupportedAttributes}{@substrings.type}),
      control                Attribute{{SupportedAttributes}},
                    -- Used to specify interpretation of following items
      ... },
    ... },
  greaterOrEqual    [2]  AttributeValueAssertion,
  lessOrEqual       [3]  AttributeValueAssertion,
  present           [4]  AttributeType,
  approximateMatch  [5]  AttributeValueAssertion,
  extensibleMatch   [6]  MatchingRuleAssertion,
  contextPresent    [7]  AttributeTypeAssertion,
  ... }

MatchingRuleAssertion ::= SEQUENCE {
  matchingRule  [1]  SET SIZE (1..MAX) OF MATCHING-RULE.&id,
  type          [2]  AttributeType OPTIONAL,
  matchValue    [3]  MATCHING-RULE.&AssertionType (CONSTRAINED BY {
    -- matchValue shall be a value of  type specified by the &AssertionType field of
    -- one of the MATCHING-RULE information objects identified by matchingRule -- }),
  dnAttributes  [4]  BOOLEAN DEFAULT FALSE,
  ... }

PagedResultsRequest ::= CHOICE {
  newRequest         SEQUENCE {
    pageSize           INTEGER,
    sortKeys           SEQUENCE SIZE (1..MAX) OF SortKey OPTIONAL,
    reverse       [1]  BOOLEAN DEFAULT FALSE,
    unmerged      [2]  BOOLEAN DEFAULT FALSE,
    pageNumber    [3]  INTEGER OPTIONAL,
    ...},
  queryReference     OCTET STRING,
  abandonQuery  [0]  OCTET STRING,
  ... }

SortKey ::= SEQUENCE {
  type          AttributeType,
  orderingRule  MATCHING-RULE.&id OPTIONAL,
  ... }

SecurityParameters ::= SET {
  certification-path          [0]  CertificationPath OPTIONAL,
  name                        [1]  DistinguishedName OPTIONAL,
  time                        [2]  Time OPTIONAL,
  random                      [3]  BIT STRING OPTIONAL,
  target                      [4]  ProtectionRequest OPTIONAL,
  --                          [5]  Not to be used
  operationCode               [6]  Code OPTIONAL,
  --                          [7]  Not to be used
  errorProtection             [8]  ErrorProtectionRequest OPTIONAL,
  errorCode                   [9]  Code OPTIONAL,
  ... }

ProtectionRequest ::= INTEGER {none(0), signed(1)}

Time ::= CHOICE {
  utcTime          UTCTime,
  generalizedTime  GeneralizedTime,
  ... }

ErrorProtectionRequest ::= INTEGER {none(0), signed(1)}

--  Bind and unbind operations

directoryBind OPERATION ::= {
  ARGUMENT  DirectoryBindArgument
  RESULT    DirectoryBindResult
  ERRORS    {directoryBindError} }

DirectoryBindArgument ::= SET {
  credentials  [0]  Credentials OPTIONAL,
  versions     [1]  Versions DEFAULT {v1},
  ... }

Credentials ::= CHOICE {
  simple             [0]  SimpleCredentials,
  strong             [1]  StrongCredentials,
  externalProcedure  [2]  EXTERNAL,
  spkm               [3]  SpkmCredentials,
  sasl               [4]  SaslCredentials,
  ... }

SimpleCredentials ::= SEQUENCE {
  name      [0]  DistinguishedName,
  validity  [1]  SET {
    time1     [0]  CHOICE {
      utc            UTCTime,
      gt             GeneralizedTime} OPTIONAL,
    time2     [1]  CHOICE {
      utc            UTCTime,
      gt             GeneralizedTime} OPTIONAL,
    random1   [2]  BIT STRING OPTIONAL,
    random2   [3]  BIT STRING OPTIONAL} OPTIONAL,
  password  [2]  CHOICE {
    unprotected    OCTET STRING,
    protected      HASH{OCTET STRING},
    ...,
    userPwd   [0]  UserPwd } OPTIONAL }

StrongCredentials ::= SET {
  certification-path          [0]  CertificationPath OPTIONAL,
  bind-token                  [1]  Token,
  name                        [2]  DistinguishedName OPTIONAL,
  attributeCertificationPath  [3]  AttributeCertificationPath OPTIONAL,
  ... }

SpkmCredentials ::= CHOICE {
  req            [0]  SPKM-REQ,
  rep            [1]  SPKM-REP-TI,
  ... }

SaslCredentials ::= SEQUENCE {
  mechanism    [0]  DirectoryString{ub-saslMechanism},
  credentials  [1]  OCTET STRING OPTIONAL,
  saslAbort    [2]  BOOLEAN DEFAULT FALSE,
  ... }

ub-saslMechanism INTEGER ::= 20 -- According to RFC 2222

Token ::= SIGNED{TokenContent}

TokenContent ::= SEQUENCE {
  algorithm  [0]  AlgorithmIdentifier{{SupportedAlgorithms}},
  name       [1]  DistinguishedName,
  time       [2]  Time,
  random     [3]  BIT STRING,
  response   [4]  BIT STRING OPTIONAL,
  ... }

Versions ::= BIT STRING {v1(0), v2(1)}

DirectoryBindResult ::= SET {
  credentials       [0]  Credentials OPTIONAL,
  versions          [1]  Versions DEFAULT {v1},
  ...,
  pwdResponseValue  [2]  PwdResponseValue OPTIONAL }

PwdResponseValue ::= SEQUENCE {
  warning CHOICE {
    timeLeft        [0]  INTEGER (0..MAX),
    graceRemaining  [1]  INTEGER (0..MAX),
    ... } OPTIONAL,
  error   ENUMERATED {
    passwordExpired  (0),
    changeAfterReset (1),
    ... } OPTIONAL}

directoryBindError ERROR ::= {
  PARAMETER OPTIONALLY-PROTECTED {SET {
    versions              [0]  Versions DEFAULT {v1},
    error                      CHOICE {
      serviceError          [1]  ServiceProblem,
      securityError         [2]  SecurityProblem,
      ...},
    securityParameters    [30]  SecurityParameters OPTIONAL }}}

BindKeyInfo ::= ENCRYPTED{BIT STRING}

--  Operations, arguments, and results


read OPERATION ::= {
  ARGUMENT  ReadArgument
  RESULT    ReadResult
  ERRORS    {attributeError |
             nameError |
             serviceError |
             referral |
             abandoned |
             securityError}
  CODE      id-opcode-read }

ReadArgument ::= OPTIONALLY-PROTECTED { ReadArgumentData }

ReadArgumentData ::= SET {
  object               [0]  Name,
  selection            [1]  EntryInformationSelection DEFAULT {},
  modifyRightsRequest  [2]  BOOLEAN DEFAULT FALSE,
  ...,
  ...,
  COMPONENTS OF             CommonArguments }

ReadResult ::= OPTIONALLY-PROTECTED { ReadResultData }

ReadResultData ::= SET {
  entry         [0]  EntryInformation,
  modifyRights  [1]  ModifyRights OPTIONAL,
  ...,
  ...,
  COMPONENTS OF      CommonResults }

ModifyRights ::= SET OF SEQUENCE {
  item      CHOICE {
    entry      [0]  NULL,
    attribute  [1]  AttributeType,
    value      [2]  AttributeValueAssertion,
    ...},
  permission   [3]  BIT STRING {
    add     (0),
    remove  (1),
    rename  (2),
    move    (3)},
  ... }

compare OPERATION ::= {
  ARGUMENT  CompareArgument
  RESULT    CompareResult
  ERRORS    {attributeError |
             nameError |
             serviceError |
             referral |
             abandoned |
             securityError}
  CODE      id-opcode-compare }

CompareArgument ::= OPTIONALLY-PROTECTED { CompareArgumentData }

CompareArgumentData ::= SET {
  object       [0]  Name,
  purported    [1]  AttributeValueAssertion,
  ...,
  ...,
  COMPONENTS OF     CommonArguments }

CompareResult ::= OPTIONALLY-PROTECTED { CompareResultData }

CompareResultData ::= SET {
  name                 Name OPTIONAL,
  matched         [0]  BOOLEAN,
  fromEntry       [1]  BOOLEAN DEFAULT TRUE,
  matchedSubtype  [2]  AttributeType OPTIONAL,
  ...,
  ...,
  COMPONENTS OF        CommonResults }

abandon OPERATION ::= {
  ARGUMENT  AbandonArgument
  RESULT    AbandonResult
  ERRORS    {abandonFailed}
  CODE      id-opcode-abandon }

AbandonArgument ::=
  OPTIONALLY-PROTECTED-SEQ { AbandonArgumentData }

AbandonArgumentData ::= SEQUENCE {
  invokeID  [0]  InvokeId,
  ... }

AbandonResult ::= CHOICE {
  null          NULL,
  information   OPTIONALLY-PROTECTED-SEQ { AbandonResultData },
  ... }

AbandonResultData ::= SEQUENCE {
  invokeID      InvokeId,
  ...,
  ...,
  COMPONENTS OF CommonResultsSeq }

list OPERATION ::= {
  ARGUMENT  ListArgument
  RESULT    ListResult
  ERRORS    {nameError |
             serviceError |
             referral |
             abandoned |
             securityError}
  CODE      id-opcode-list }

ListArgument ::= OPTIONALLY-PROTECTED { ListArgumentData }

ListArgumentData ::= SET {
  object        [0]  Name,
  pagedResults  [1]  PagedResultsRequest OPTIONAL,
  listFamily    [2]  BOOLEAN DEFAULT FALSE,
  ...,
  ...,
  COMPONENTS OF      CommonArguments
  }

ListResult ::= OPTIONALLY-PROTECTED { ListResultData }

ListResultData ::= CHOICE {
  listInfo                     SET {
    name                         Name OPTIONAL,
    subordinates            [1]  SET OF SEQUENCE {
      rdn                          RelativeDistinguishedName,
      aliasEntry              [0]  BOOLEAN DEFAULT FALSE,
      fromEntry               [1]  BOOLEAN DEFAULT TRUE,
      ... },
    partialOutcomeQualifier [2]  PartialOutcomeQualifier OPTIONAL,
    ...,
    ...,
    COMPONENTS OF                CommonResults
    },
  uncorrelatedListInfo    [0]  SET OF ListResult,
  ... }

PartialOutcomeQualifier ::= SET {
  limitProblem                  [0]  LimitProblem OPTIONAL,
  unexplored                    [1]  SET SIZE (1..MAX) OF ContinuationReference OPTIONAL,
  unavailableCriticalExtensions [2]  BOOLEAN DEFAULT FALSE,
  unknownErrors                 [3]  SET SIZE (1..MAX) OF ABSTRACT-SYNTAX.&Type OPTIONAL,
  queryReference                [4]  OCTET STRING OPTIONAL,
  overspecFilter                [5]  Filter OPTIONAL,
  notification                  [6]  SEQUENCE SIZE (1..MAX) OF
                                       Attribute{{SupportedAttributes}} OPTIONAL,
  entryCount                         CHOICE {
    bestEstimate                  [7]  INTEGER,
    lowEstimate                   [8]  INTEGER,
    exact                         [9]  INTEGER,
    ...} OPTIONAL
  --                            [10] Not to be used -- }

LimitProblem ::= INTEGER {
  timeLimitExceeded           (0),
  sizeLimitExceeded           (1),
  administrativeLimitExceeded (2) }

search OPERATION ::= {
  ARGUMENT  SearchArgument
  RESULT    SearchResult
  ERRORS    {attributeError |
             nameError |
             serviceError |
             referral |
             abandoned |
             securityError}
  CODE      id-opcode-search }

SearchArgument ::= OPTIONALLY-PROTECTED { SearchArgumentData }

SearchArgumentData ::= SET {
  baseObject            [0]  Name,
  subset                [1]  INTEGER {
    baseObject    (0),
    oneLevel      (1),
    wholeSubtree  (2)} DEFAULT baseObject,
  filter                [2]  Filter DEFAULT and:{},
  searchAliases         [3]  BOOLEAN DEFAULT TRUE,
  selection             [4]  EntryInformationSelection DEFAULT {},
  pagedResults          [5]  PagedResultsRequest OPTIONAL,
  matchedValuesOnly     [6]  BOOLEAN DEFAULT FALSE,
  extendedFilter        [7]  Filter OPTIONAL,
  checkOverspecified    [8]  BOOLEAN DEFAULT FALSE,
  relaxation            [9]  RelaxationPolicy OPTIONAL,
  extendedArea          [10] INTEGER OPTIONAL,
  hierarchySelections   [11] HierarchySelections DEFAULT {self},
  searchControlOptions  [12] SearchControlOptions DEFAULT {searchAliases},
  joinArguments         [13] SEQUENCE SIZE (1..MAX) OF JoinArgument OPTIONAL,
  joinType              [14] ENUMERATED {
    innerJoin      (0),
    leftOuterJoin  (1),
    fullOuterJoin  (2)} DEFAULT leftOuterJoin,
  ...,
  ...,
  COMPONENTS OF              CommonArguments }

HierarchySelections ::= BIT STRING {
  self                  (0),
  children              (1),
  parent                (2),
  hierarchy             (3),
  top                   (4),
  subtree               (5),
  siblings              (6),
  siblingChildren       (7),
  siblingSubtree        (8),
  all                   (9) }

SearchControlOptions ::= BIT STRING {
  searchAliases         (0),
  matchedValuesOnly     (1),
  checkOverspecified    (2),
  performExactly        (3),
  includeAllAreas       (4),
  noSystemRelaxation    (5),
  dnAttribute           (6),
  matchOnResidualName   (7),
  entryCount            (8),
  useSubset             (9),
  separateFamilyMembers (10),
  searchFamily          (11) }

JoinArgument ::= SEQUENCE {
  joinBaseObject  [0]  Name,
  domainLocalID   [1]  DomainLocalID OPTIONAL,
  joinSubset      [2]  ENUMERATED {
    baseObject   (0),
    oneLevel     (1),
    wholeSubtree (2),
    ... } DEFAULT baseObject,
  joinFilter      [3]  Filter OPTIONAL,
  joinAttributes  [4]  SEQUENCE SIZE (1..MAX) OF JoinAttPair OPTIONAL,
  joinSelection   [5]  EntryInformationSelection,
  ... }

DomainLocalID ::= UnboundedDirectoryString

JoinAttPair ::= SEQUENCE {
  baseAtt      AttributeType,
  joinAtt      AttributeType,
  joinContext  SEQUENCE SIZE (1..MAX) OF JoinContextType OPTIONAL,
  ... }

JoinContextType ::= CONTEXT.&id({SupportedContexts})

SearchResult ::= OPTIONALLY-PROTECTED { SearchResultData }

SearchResultData ::= CHOICE {
  searchInfo                    SET {
    name                          Name OPTIONAL,
    entries                  [0]  SET OF EntryInformation,
    partialOutcomeQualifier  [2]  PartialOutcomeQualifier OPTIONAL,
    altMatching              [3]  BOOLEAN DEFAULT FALSE,
    ...,
    ...,
    COMPONENTS OF                 CommonResults
    },
  uncorrelatedSearchInfo   [0]  SET OF SearchResult,
  ... }

addEntry OPERATION ::= {
  ARGUMENT  AddEntryArgument
  RESULT    AddEntryResult
  ERRORS    {attributeError |
             nameError |
             serviceError |
             referral |
             securityError |
             updateError}
  CODE      id-opcode-addEntry }

AddEntryArgument ::= OPTIONALLY-PROTECTED { AddEntryArgumentData }

AddEntryArgumentData ::= SET {
  object        [0]  Name,
  entry         [1]  SET OF Attribute{{SupportedAttributes}},
  targetSystem  [2]  AccessPoint OPTIONAL,
  ...,
  ...,
  COMPONENTS OF      CommonArguments }

AddEntryResult ::= CHOICE {
  null          NULL,
  information   OPTIONALLY-PROTECTED-SEQ { AddEntryResultData },
  ... }

AddEntryResultData ::= SEQUENCE {
  ...,
  ...,
  COMPONENTS OF CommonResultsSeq }

removeEntry OPERATION ::= {
  ARGUMENT  RemoveEntryArgument
  RESULT    RemoveEntryResult
  ERRORS    {nameError |
             serviceError |
             referral |
             securityError |
             updateError}
  CODE      id-opcode-removeEntry }

RemoveEntryArgument ::= OPTIONALLY-PROTECTED { RemoveEntryArgumentData }

RemoveEntryArgumentData ::= SET {
  object     [0]  Name,
  ...,
  ...,
  COMPONENTS OF   CommonArguments
  }

RemoveEntryResult ::= CHOICE {
  null          NULL,
  information   OPTIONALLY-PROTECTED-SEQ { RemoveEntryResultData },
  ... }

RemoveEntryResultData ::= SEQUENCE {
  ...,
  ...,
  COMPONENTS OF CommonResultsSeq }

modifyEntry OPERATION ::= {
  ARGUMENT  ModifyEntryArgument
  RESULT    ModifyEntryResult
  ERRORS    {attributeError |
             nameError |
             serviceError |
             referral |
             securityError |
             updateError}
  CODE      id-opcode-modifyEntry }

ModifyEntryArgument ::= OPTIONALLY-PROTECTED { ModifyEntryArgumentData }

ModifyEntryArgumentData ::= SET {
  object     [0]  Name,
  changes    [1]  SEQUENCE OF EntryModification,
  selection  [2]  EntryInformationSelection OPTIONAL,
  ...,
  ...,
  COMPONENTS OF   CommonArguments }

ModifyEntryResult ::= CHOICE {
  null         NULL,
  information  OPTIONALLY-PROTECTED-SEQ { ModifyEntryResultData },
  ... }

ModifyEntryResultData ::= SEQUENCE {
  entry    [0]  EntryInformation OPTIONAL,
  ...,
  ...,
  COMPONENTS OF CommonResultsSeq }

EntryModification ::= CHOICE {
  addAttribute     [0]  Attribute{{SupportedAttributes}},
  removeAttribute  [1]  AttributeType,
  addValues        [2]  Attribute{{SupportedAttributes}},
  removeValues     [3]  Attribute{{SupportedAttributes}},
  alterValues      [4]  AttributeTypeAndValue,
  resetValue       [5]  AttributeType,
  replaceValues    [6]  Attribute{{SupportedAttributes}},
  ... }

modifyDN OPERATION ::= {
  ARGUMENT  ModifyDNArgument
  RESULT    ModifyDNResult
  ERRORS    {nameError |
             serviceError |
             referral |
             securityError |
             updateError}
  CODE      id-opcode-modifyDN }

ModifyDNArgument ::= OPTIONALLY-PROTECTED { ModifyDNArgumentData }

ModifyDNArgumentData ::= SET {
  object        [0]  DistinguishedName,
  newRDN        [1]  RelativeDistinguishedName,
  deleteOldRDN  [2]  BOOLEAN DEFAULT FALSE,
  newSuperior   [3]  DistinguishedName OPTIONAL,
  ...,
  ...,
  COMPONENTS OF      CommonArguments }

ModifyDNResult ::= CHOICE {
  null         NULL,
  information  OPTIONALLY-PROTECTED-SEQ { ModifyDNResultData },
  ... }

ModifyDNResultData ::= SEQUENCE {
  newRDN        RelativeDistinguishedName,
  ...,
  ...,
  COMPONENTS OF CommonResultsSeq }

changePassword OPERATION ::= {
  ARGUMENT  ChangePasswordArgument
  RESULT    ChangePasswordResult
  ERRORS    {securityError |
             updateError }
  CODE      id-opcode-changePassword }

ChangePasswordArgument ::= OPTIONALLY-PROTECTED-SEQ { ChangePasswordArgumentData }

ChangePasswordArgumentData ::= SEQUENCE {
  object   [0]  DistinguishedName,
  oldPwd   [1]  UserPwd,
  newPwd   [2]  UserPwd,
  ... }

ChangePasswordResult ::= CHOICE {
  null        NULL,
  information OPTIONALLY-PROTECTED-SEQ { ChangePasswordResultData },
  ...}

ChangePasswordResultData ::= SEQUENCE {
  ...,
  ...,
  COMPONENTS OF CommonResultsSeq }

administerPassword OPERATION ::= {
  ARGUMENT  AdministerPasswordArgument
  RESULT    AdministerPasswordResult
  ERRORS    {securityError |
             updateError}
  CODE      id-opcode-administerPassword }

AdministerPasswordArgument ::=
  OPTIONALLY-PROTECTED-SEQ { AdministerPasswordArgumentData }

AdministerPasswordArgumentData ::= SEQUENCE {
  object  [0]  DistinguishedName,
  newPwd  [1]  UserPwd,
  ... }

AdministerPasswordResult ::= CHOICE {
  null NULL,
  information OPTIONALLY-PROTECTED-SEQ { AdministerPasswordResultData },
  ...}

AdministerPasswordResultData ::= SEQUENCE {
  ...,
  ...,
  COMPONENTS OF CommonResultsSeq }

ldapTransport OPERATION ::= {
  ARGUMENT    LdapArgument
  RESULT      SEQUENCE OF LDAPMessage
  ERRORS      { abandonFailed | abandoned }
  CODE        id-opcode-ldapTransport }

LdapArgument ::= OPTIONALLY-PROTECTED-SEQ { LdapArgumentData }

LdapArgumentData ::= SEQUENCE {
  object        DistinguishedName,
  ldapMessage   LDAPMessage,
  linkId        LinkId  OPTIONAL,
  ...,
  ...,
  COMPONENTS OF CommonArgumentsSeq }

LinkId ::= INTEGER

LdapResult ::= OPTIONALLY-PROTECTED-SEQ { LdapResultData }

LdapResultData ::= SEQUENCE {
  ldapMessages   SEQUENCE SIZE (1..MAX) OF LDAPMessage OPTIONAL,
  returnToClient BOOLEAN DEFAULT FALSE,
  ...,
  ...,
  COMPONENTS OF CommonResultsSeq }

linkedLDAP OPERATION ::= {
  ARGUMENT    LinkedArgument
  RESULT      LinkedResult
  CODE        id-opcode-linkedLDAP }

LinkedArgument ::= OPTIONALLY-PROTECTED-SEQ { LinkedArgumentData }

LinkedArgumentData ::= SEQUENCE {
  object         DistinguishedName,
  ldapMessage    LDAPMessage,
  linkId         LinkId,
  returnToClient BOOLEAN DEFAULT FALSE,
  ...,
  ...,
  COMPONENTS OF  CommonArgumentsSeq }

LinkedResult ::= NULL

-- Errors and parameters

abandoned ERROR ::= {-- not literally an "error"
  PARAMETER     OPTIONALLY-PROTECTED { AbandonedData }
  CODE          id-errcode-abandoned }

AbandonedData ::= SET {
    problem       AbandonedProblem OPTIONAL,
    ...,
    ...,
    COMPONENTS OF CommonResults }

AbandonedProblem  ::= ENUMERATED {
  pagingAbandoned (0) }

abandonFailed ERROR ::= {
  PARAMETER OPTIONALLY-PROTECTED { AbandonFailedData }
  CODE      id-errcode-abandonFailed }

AbandonFailedData ::= SET {
  problem    [0]  AbandonProblem,
  operation  [1]  InvokeId,
  ...,
  ...,
  COMPONENTS OF   CommonResults }

AbandonProblem ::= INTEGER {
  noSuchOperation (1),
  tooLate         (2),
  cannotAbandon   (3) }

attributeError ERROR ::= {
  PARAMETER     OPTIONALLY-PROTECTED { AttributeErrorData }
  CODE          id-errcode-attributeError }

AttributeErrorData ::= SET {
  object   [0]  Name,
  problems [1]  SET OF SEQUENCE {
    problem  [0]  AttributeProblem,
    type     [1]  AttributeType,
    value    [2]  AttributeValue OPTIONAL,
    ...},
  ...,
  ...,
  COMPONENTS OF CommonResults }

AttributeProblem ::= INTEGER {
  noSuchAttributeOrValue        (1),
  invalidAttributeSyntax        (2),
  undefinedAttributeType        (3),
  inappropriateMatching         (4),
  constraintViolation           (5),
  attributeOrValueAlreadyExists (6),
  contextViolation              (7) }

nameError ERROR ::= {
  PARAMETER     OPTIONALLY-PROTECTED { NameErrorData }
  CODE          id-errcode-nameError }

NameErrorData ::= SET {
  problem  [0]  NameProblem,
  matched  [1]  Name,
  ...,
  ...,
  COMPONENTS OF CommonResults }

NameProblem ::= INTEGER {
  noSuchObject              (1),
  aliasProblem              (2),
  invalidAttributeSyntax    (3),
  aliasDereferencingProblem (4)
  -- not to be used         (5)-- }

referral ERROR ::= { -- not literally an "error"
  PARAMETER      OPTIONALLY-PROTECTED { ReferralData }
  CODE           id-errcode-referral }

ReferralData ::= SET {
  candidate  [0] ContinuationReference,
  ...,
  ...,
  COMPONENTS OF  CommonResults }

securityError  ERROR  ::=  {
  PARAMETER   OPTIONALLY-PROTECTED { SecurityErrorData }
  CODE        id-errcode-securityError }

SecurityErrorData ::= SET {
  problem      [0]  SecurityProblem,
  spkmInfo     [1]  SPKM-ERROR OPTIONAL,
  encPwdInfo   [2]  EncPwdInfo OPTIONAL,
  ...,
  ...,
  COMPONENTS OF CommonResults }

SecurityProblem ::= INTEGER {
  inappropriateAuthentication     (1),
  invalidCredentials              (2),
  insufficientAccessRights        (3),
  invalidSignature                (4),
  protectionRequired              (5),
  noInformation                   (6),
  blockedCredentials              (7),
  -- invalidQOPMatch              (8), obsolete
  spkmError                       (9),
  unsupportedAuthenticationMethod (10),
  passwordExpired                 (11),
  inappropriateAlgorithms         (12) }

EncPwdInfo ::= SEQUENCE {
  algorithms     [0]  SEQUENCE OF AlgorithmIdentifier
                        {{SupportedAlgorithms}} OPTIONAL,
  pwdQualityRule [1]  SEQUENCE OF AttributeTypeAndValue OPTIONAL,
  ... }

serviceError ERROR ::= {
  PARAMETER   OPTIONALLY-PROTECTED { ServiceErrorData }
  CODE        id-errcode-serviceError }

ServiceErrorData ::= SET {
  problem   [0]  ServiceProblem,
  ...,
  ...,
  COMPONENTS OF  CommonResults }

ServiceProblem ::= INTEGER {
  busy                         (1),
  unavailable                  (2),
  unwillingToPerform           (3),
  chainingRequired             (4),
  unableToProceed              (5),
  invalidReference             (6),
  timeLimitExceeded            (7),
  administrativeLimitExceeded  (8),
  loopDetected                 (9),
  unavailableCriticalExtension (10),
  outOfScope                   (11),
  ditError                     (12),
  invalidQueryReference        (13),
  requestedServiceNotAvailable (14),
  unsupportedMatchingUse       (15),
  ambiguousKeyAttributes       (16),
  saslBindInProgress           (17),
  notSupportedByLDAP           (18) }

updateError ERROR ::= {
  PARAMETER   OPTIONALLY-PROTECTED { UpdateErrorData }
  CODE        id-errcode-updateError }

UpdateErrorData ::= SET {
  problem        [0]  UpdateProblem,
  attributeInfo  [1]  SET SIZE (1..MAX) OF CHOICE {
    attributeType       AttributeType,
    attribute           Attribute{{SupportedAttributes}},
    ... } OPTIONAL,
  ...,
  ...,
  COMPONENTS OF       CommonResults }

UpdateProblem ::= INTEGER {
  namingViolation                   (1),
  objectClassViolation              (2),
  notAllowedOnNonLeaf               (3),
  notAllowedOnRDN                   (4),
  entryAlreadyExists                (5),
  affectsMultipleDSAs               (6),
  objectClassModificationProhibited (7),
  noSuchSuperior                    (8),
  notAncestor                       (9),
  parentNotAncestor                 (10),
  hierarchyRuleViolation            (11),
  familyRuleViolation               (12),
  insufficientPasswordQuality       (13),
  passwordInHistory                 (14),
  noPasswordSlot                    (15) }

-- attribute types

id-at-family-information OBJECT IDENTIFIER ::= {id-at 64}

END -- DirectoryAbstractService

SpkmGssTokens {iso(1) identified-organization(3) dod(6) internet(1) security(5) mechanisms(5) spkm(1) spkmGssTokens(10)}

DEFINITIONS IMPLICIT TAGS ::=

BEGIN

-- EXPORTS ALL

IMPORTS
  Name
    FROM InformationFramework {joint-iso-itu-t(2) ds(5) module(1)
      informationFramework(1) 9} WITH SUCCESSORS

  Certificate, CertificateList, CertificatePair, AlgorithmIdentifier{},
    SupportedAlgorithms, Validity
    FROM AuthenticationFramework {joint-iso-itu-t(2) ds(5) module(1)
      authenticationFramework(7) 9} WITH SUCCESSORS ;

-- types

SPKM-REQ ::= SEQUENCE {
  requestToken  REQ-TOKEN,
  certif-data   [0]  CertificationData OPTIONAL,
  auth-data     [1]  AuthorizationData OPTIONAL
}

CertificationData ::= SEQUENCE {
  certificationPath          [0]  CertificationPath OPTIONAL,
  certificateRevocationList  [1]  CertificateList OPTIONAL
} -- at least one of the above shall be present

CertificationPath ::= SEQUENCE {
  userKeyId          [0]  OCTET STRING OPTIONAL,
  userCertif         [1]  Certificate OPTIONAL,
  verifKeyId         [2]  OCTET STRING OPTIONAL,
  userVerifCertif    [3]  Certificate OPTIONAL,
  theCACertificates  [4]  SEQUENCE OF CertificatePair OPTIONAL
} -- Presence of [2] or [3] implies that [0] or [1] must also be
-- present.  Presence of [4] implies that at least one of [0], [1],
-- [2], and [3] must also be present.

REQ-TOKEN ::= SEQUENCE {
  req-contents   Req-contents,
  algId          AlgorithmIdentifier{{SupportedAlgorithms}},
  req-integrity  Integrity -- "token" is Req-contents
}

Integrity ::= BIT STRING

-- If corresponding algId specifies a signing algorithm,
-- "Integrity" holds the result of applying the signing procedure
-- specified in algId to the BER-encoded octet string which results
-- from applying the hashing procedure (also specified in algId) to
-- the DER-encoded octets of "token".
-- Alternatively, if corresponding algId specifies a MACing
-- algorithm, "Integrity" holds the result of applying the MACing
-- procedure specified in algId to the DER-encoded octets of
-- "token"

Req-contents ::= SEQUENCE {
  tok-id        INTEGER(256), -- shall contain 0100 (hex)
  context-id    Random-Integer,
  pvno          BIT STRING,
  timestamp     UTCTime OPTIONAL, -- mandatory for SPKM-2
  randSrc       Random-Integer,
  targ-name     Name,
  src-name      [0]  Name OPTIONAL,
  req-data      Context-Data,
  validity      [1]  Validity OPTIONAL,
  key-estb-set  Key-Estb-Algs,
  key-estb-req  BIT STRING OPTIONAL,
  key-src-bind  OCTET STRING OPTIONAL
  -- This field must be present for the case of SPKM-2
  -- unilateral authen. if the K-ALG in use does not provide
  -- such a binding (but is optional for all other cases).
  -- The octet string holds the result of applying the
  -- mandatory hashing procedure (in MANDATORY I-ALG;
  -- see Section 2.1) as follows:  MD5(src || context_key),
  -- where "src" is the DER-encoded octets of src-name,
  -- "context-key" is the symmetric key (i.e., the
  -- unprotected version of what is transmitted in
  -- key-estb-req), and "||" is the concatenation operation.
}

Random-Integer ::= BIT STRING

Context-Data ::= SEQUENCE {
  channelId   ChannelId OPTIONAL,
  seq-number  INTEGER OPTIONAL,
  options     Options,
  conf-alg    Conf-Algs,
  intg-alg    Intg-Algs,
  owf-alg     OWF-Algs
}

ChannelId ::= OCTET STRING

Options ::= BIT STRING {
  delegation-state(0), mutual-state(1), replay-det-state(2), sequence-state(3),
  conf-avail(4), integ-avail(5), target-certif-data-required(6)}

Conf-Algs ::= CHOICE {
  algs  [0]  SEQUENCE OF AlgorithmIdentifier{{SupportedAlgorithms}},
  null  [1]  NULL
}

Intg-Algs ::= SEQUENCE OF AlgorithmIdentifier{{SupportedAlgorithms}}

OWF-Algs ::= SEQUENCE OF AlgorithmIdentifier{{SupportedAlgorithms}}

Key-Estb-Algs ::= SEQUENCE OF AlgorithmIdentifier{{SupportedAlgorithms}}

SPKM-REP-TI ::= SEQUENCE {
  responseToken  REP-TI-TOKEN,
  certif-data    CertificationData OPTIONAL
  -- present if target-certif-data-required option was
} -- set to TRUE in SPKM-REQ

REP-TI-TOKEN ::= SEQUENCE {
  rep-ti-contents  Rep-ti-contents,
  algId            AlgorithmIdentifier{{SupportedAlgorithms}},
  rep-ti-integ     Integrity -- "token" is Rep-ti-contents
}

Rep-ti-contents ::= SEQUENCE {
  tok-id        INTEGER(512), -- shall contain 0200 (hex)
  context-id    Random-Integer,
  pvno          [0]  BIT STRING OPTIONAL,
  timestamp     UTCTime OPTIONAL, -- mandatory for SPKM-2
  randTarg      Random-Integer,
  src-name      [1]  Name OPTIONAL,
  targ-name     Name,
  randSrc       Random-Integer,
  rep-data      Context-Data,
  validity      [2]  Validity OPTIONAL,
  key-estb-id   AlgorithmIdentifier{{SupportedAlgorithms}} OPTIONAL,
  key-estb-str  BIT STRING OPTIONAL
}

SPKM-REP-IT ::= SEQUENCE {
  responseToken  REP-IT-TOKEN,
  algId          AlgorithmIdentifier{{SupportedAlgorithms}},
  rep-it-integ   Integrity -- "token" is REP-IT-TOKEN
}

REP-IT-TOKEN ::= SEQUENCE {
  tok-id        INTEGER(768), -- shall contain 0300 (hex)
  context-id    Random-Integer,
  randSrc       Random-Integer,
  randTarg      Random-Integer,
  targ-name     Name,
  src-name      Name OPTIONAL,
  key-estb-rep  BIT STRING OPTIONAL
}

SPKM-ERROR ::= SEQUENCE {
  errorToken  ERROR-TOKEN,
  algId       AlgorithmIdentifier{{SupportedAlgorithms}},
  integrity   Integrity -- "token" is ERROR-TOKEN
}

ERROR-TOKEN ::= SEQUENCE {
  tok-id      INTEGER(1024), -- shall contain 0400 (hex)
  context-id  Random-Integer
}

SPKM-MIC ::= SEQUENCE {mic-header  Mic-Header,
                       int-cksum   BIT STRING
}

Mic-Header ::= SEQUENCE {
  tok-id      INTEGER(257), -- shall contain 0101 (hex)
  context-id  Random-Integer,
  int-alg     [0]  AlgorithmIdentifier{{SupportedAlgorithms}} OPTIONAL,
  snd-seq     [1]  SeqNum OPTIONAL
}

SeqNum ::= SEQUENCE {num      INTEGER,
                     dir-ind  BOOLEAN
}

SPKM-WRAP ::= SEQUENCE {wrap-header  Wrap-Header,
                        wrap-body    Wrap-Body
}

Wrap-Header ::= SEQUENCE {
  tok-id      INTEGER(513), -- shall contain 0201 (hex)
  context-id  Random-Integer,
  int-alg     [0]  AlgorithmIdentifier{{SupportedAlgorithms}} OPTIONAL,
  conf-alg    [1]  Conf-Alg OPTIONAL,
  snd-seq     [2]  SeqNum OPTIONAL
}

Wrap-Body ::= SEQUENCE {int-cksum  BIT STRING,
                        data       BIT STRING
}

Conf-Alg ::= CHOICE {
  algId  [0]  AlgorithmIdentifier{{SupportedAlgorithms}},
  null   [1]  NULL
}

SPKM-DEL ::= SEQUENCE {del-header  Del-Header,
                       int-cksum   BIT STRING
}

Del-Header ::= SEQUENCE {
  tok-id      INTEGER(769), -- shall contain 0301 (hex)
  context-id  Random-Integer,
  int-alg     [0]  AlgorithmIdentifier{{SupportedAlgorithms}} OPTIONAL,
  snd-seq     [1]  SeqNum OPTIONAL
}

-- other types
-- from [RFC-1508]
MechType ::= OBJECT IDENTIFIER

InitialContextToken ::= [APPLICATION 0] IMPLICIT SEQUENCE {
  thisMech           MechType,
  innerContextToken  SPKMInnerContextToken
} -- when thisMech is SPKM-1 or SPKM-2

SPKMInnerContextToken ::= CHOICE {
  req     [0]  SPKM-REQ,
  rep-ti  [1]  SPKM-REP-TI,
  rep-it  [2]  SPKM-REP-IT,
  error   [3]  SPKM-ERROR,
  mic     [4]  SPKM-MIC,
  wrap    [5]  SPKM-WRAP,
  del     [6]  SPKM-DEL
}

-- from [RFC-1510]
AuthorizationData ::=
  SEQUENCE OF SEQUENCE {ad-type  INTEGER,
                        ad-data  OCTET STRING}

-- object identifier assignments
md5-DES-CBC OBJECT IDENTIFIER ::=
  {iso(1) identified-organization(3) dod(6) internet(1) security(5)
   integrity(3) md5-DES-CBC(1)}

sum64-DES-CBC OBJECT IDENTIFIER ::=
  {iso(1) identified-organization(3) dod(6) internet(1) security(5)
   integrity(3) sum64-DES-CBC(2)}

spkm-1 OBJECT IDENTIFIER ::=
  {iso(1) identified-organization(3) dod(6) internet(1) security(5)
   mechanisms(5) spkm(1) spkm-1(1)}

spkm-2 OBJECT IDENTIFIER ::=
  {iso(1) identified-organization(3) dod(6) internet(1) security(5)
   mechanisms(5) spkm(1) spkm-2(2)}

END -- SpkmGssTokens

DistributedOperations {joint-iso-itu-t ds(5) module(1) distributedOperations(3) 9}
DEFINITIONS ::=
BEGIN

-- EXPORTS All
/*
The types and values defined in this module are exported for use in the other ASN.1
modules contained within these Directory Specifications, and for the use of other
applications which will use them to access Directory services. Other applications may
use them for their own purposes, but this will not constrain extensions and
modifications needed to maintain or improve the Directory service.
*/
IMPORTS

  -- from Rec. ITU-T X.501 | ISO/IEC 9594-2

  DistinguishedName, Name, RDNSequence
    FROM InformationFramework
      {joint-iso-itu-t ds(5) module(1) informationFramework(1) 9} WITH SUCCESSORS

  MRMapping, SearchRuleId
    FROM ServiceAdministration
      {joint-iso-itu-t ds(5) module(1) serviceAdministration(33) 9} WITH SUCCESSORS

  AuthenticationLevel
    FROM BasicAccessControl
      {joint-iso-itu-t ds(5) module(1) basicAccessControl(24) 9} WITH SUCCESSORS

  OPTIONALLY-PROTECTED{}
    FROM EnhancedSecurity
      {joint-iso-itu-t ds(5) modules(1) enhancedSecurity(28) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.511 | ISO/IEC 9594-3

  abandon, addEntry, administerPassword, changePassword, CommonResults, compare,
  directoryBindError, ldapTransport, linkedLDAP, list, modifyDN, modifyEntry,
  read, referral, removeEntry, search, SecurityParameters, SimpleCredentials,
  SpkmCredentials, StrongCredentials, Versions
    FROM DirectoryAbstractService
      {joint-iso-itu-t ds(5) module(1) directoryAbstractService(2) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.519 | ISO/IEC 9594-5

  ERROR, id-errcode-dsaReferral, OPERATION
    FROM CommonProtocolSpecification
      {joint-iso-itu-t ds(5) module(1) commonProtocolSpecification(35) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.520 | ISO/IEC 9594-6

  PresentationAddress, ProtocolInformation, UnboundedDirectoryString,
  UniqueIdentifier
    FROM SelectedAttributeTypes
      {joint-iso-itu-t ds(5) module(1) selectedAttributeTypes(5) 9} WITH SUCCESSORS ;

-- errors and parameters

dsaReferral ERROR ::= {
  PARAMETER           OPTIONALLY-PROTECTED { DsaReferralData }
  CODE                id-errcode-dsaReferral }

DsaReferralData ::= SET {
  reference      [0]  ContinuationReference,
  contextPrefix  [1]  DistinguishedName OPTIONAL,
  ...,
  ...,
  COMPONENTS OF       CommonResults }

--  common arguments and results

ChainingArguments ::= SET {
  originator                 [0]  DistinguishedName OPTIONAL,
  targetObject               [1]  DistinguishedName OPTIONAL,
  operationProgress          [2]  OperationProgress
                               DEFAULT {nameResolutionPhase notStarted},
  traceInformation           [3]  TraceInformation,
  aliasDereferenced          [4]  BOOLEAN DEFAULT FALSE,
  aliasedRDNs                [5]  INTEGER OPTIONAL,
  returnCrossRefs            [6]  BOOLEAN DEFAULT FALSE,
  referenceType              [7]  ReferenceType DEFAULT superior,
  info                       [8]  DomainInfo OPTIONAL,
  timeLimit                  [9]  Time OPTIONAL,
  securityParameters         [10] SecurityParameters DEFAULT {},
  entryOnly                  [11] BOOLEAN DEFAULT FALSE,
  uniqueIdentifier           [12] UniqueIdentifier OPTIONAL,
  authenticationLevel        [13] AuthenticationLevel OPTIONAL,
  exclusions                 [14] Exclusions OPTIONAL,
  excludeShadows             [15] BOOLEAN DEFAULT FALSE,
  nameResolveOnMaster        [16] BOOLEAN DEFAULT FALSE,
  operationIdentifier        [17] INTEGER OPTIONAL,
  searchRuleId               [18] SearchRuleId OPTIONAL,
  chainedRelaxation          [19] MRMapping OPTIONAL,
  relatedEntry               [20] INTEGER OPTIONAL,
  dspPaging                  [21] BOOLEAN DEFAULT FALSE,
  --                         [22] Not to be used
  --                         [23] Not to be used
  excludeWriteableCopies     [24] BOOLEAN DEFAULT FALSE,
  ... }

Time ::= CHOICE {
  utcTime          UTCTime,
  generalizedTime  GeneralizedTime,
  ... }

DomainInfo ::= ABSTRACT-SYNTAX.&Type

ChainingResults ::= SET {
  info                [0]  DomainInfo OPTIONAL,
  crossReferences     [1]  SEQUENCE SIZE (1..MAX) OF CrossReference OPTIONAL,
  securityParameters  [2]  SecurityParameters DEFAULT {},
  alreadySearched     [3]  Exclusions OPTIONAL,
  ... }

CrossReference ::= SET {
  contextPrefix  [0]  DistinguishedName,
  accessPoint    [1]  AccessPointInformation,
  ... }

OperationProgress ::= SET {
  nameResolutionPhase  [0]  ENUMERATED {
    notStarted  (1),
    proceeding  (2),
    completed   (3),
    ... },
  nextRDNToBeResolved  [1]  INTEGER OPTIONAL,
  ... }

TraceInformation ::= SEQUENCE OF TraceItem

TraceItem ::= SET {
  dsa                [0]  Name,
  targetObject       [1]  Name OPTIONAL,
  operationProgress  [2]  OperationProgress,
  ... }

ReferenceType ::= ENUMERATED {
  superior               (1),
  subordinate            (2),
  cross                  (3),
  nonSpecificSubordinate (4),
  supplier               (5),
  master                 (6),
  immediateSuperior      (7),
  self                   (8),
  ditBridge              (9),
  ... }

AccessPoint ::= SET {
  ae-title             [0]  Name,
  address              [1]  PresentationAddress,
  protocolInformation  [2]  SET SIZE (1..MAX) OF ProtocolInformation OPTIONAL,
  --                   [6]  Not to be used
  ... }

MasterOrShadowAccessPoint ::= SET {
  COMPONENTS OF          AccessPoint,
  category          [3]  ENUMERATED {
    master            (0),
    shadow            (1),
    writeableCopy     (2),
    ... } DEFAULT master,
  chainingRequired  [5]  BOOLEAN DEFAULT FALSE,
  ... }

MasterAndShadowAccessPoints ::= SET SIZE (1..MAX) OF MasterOrShadowAccessPoint

AccessPointInformation ::= SET {
  COMPONENTS OF          MasterOrShadowAccessPoint,
  additionalPoints  [4]  MasterAndShadowAccessPoints OPTIONAL,
  ... }

DitBridgeKnowledge ::= SEQUENCE {
  domainLocalID  UnboundedDirectoryString OPTIONAL,
  accessPoints   MasterAndShadowAccessPoints,
  ... }

Exclusions ::= SET SIZE (1..MAX) OF RDNSequence

ContinuationReference ::= SET {
  targetObject         [0]  Name,
  aliasedRDNs          [1]  INTEGER OPTIONAL, -- only present in first edition systems
  operationProgress    [2]  OperationProgress,
  rdnsResolved         [3]  INTEGER OPTIONAL,
  referenceType        [4]  ReferenceType,
  accessPoints         [5]  SET OF AccessPointInformation,
  entryOnly            [6]  BOOLEAN DEFAULT FALSE,
  exclusions           [7]  Exclusions OPTIONAL,
  returnToDUA          [8]  BOOLEAN DEFAULT FALSE,
  nameResolveOnMaster  [9]  BOOLEAN DEFAULT FALSE,
  ... }

--  bind unbind operation

dSABind OPERATION ::= {
  ARGUMENT     DSABindArgument
  RESULT       DSABindResult
  ERRORS       { directoryBindError } }

DSABindArgument  ::=  SET  {
  credentials  [0]  DSACredentials OPTIONAL,
  versions     [1]  Versions DEFAULT {v1},
  ... }

DSACredentials  ::=  CHOICE  {
  simple             [0]  SimpleCredentials,
  strong             [1]  StrongCredentials,
  externalProcedure  [2]  EXTERNAL,
  spkm               [3]  SpkmCredentials,
  ... }

DSABindResult  ::=  DSABindArgument

 -- parameterized type for deriving chained operations

  chained{OPERATION:operation} OPERATION ::= {
    ARGUMENT             OPTIONALLY-PROTECTED {SET {
      chainedArgument      ChainingArguments,
      argument        [0]  operation.&ArgumentType } }
    RESULT OPTIONALLY-PROTECTED {SET {
      chainedResult        ChainingResults,
      result          [0]  operation.&ResultType}}
    ERRORS
      {operation.&Errors EXCEPT referral | dsaReferral}
    CODE                 operation.&operationCode }

 --  chained operations

chainedRead               OPERATION ::= chained{read}
chainedCompare            OPERATION ::= chained{compare}
chainedAbandon            OPERATION ::= abandon
chainedList               OPERATION ::= chained{list}
chainedSearch             OPERATION ::= chained{search}
chainedAddEntry           OPERATION ::= chained{addEntry}
chainedRemoveEntry        OPERATION ::= chained{removeEntry}
chainedModifyEntry        OPERATION ::= chained{modifyEntry}
chainedModifyDN           OPERATION ::= chained{modifyDN}
chainedChangePassword     OPERATION ::= chained{changePassword}
chainedAdministerPassword OPERATION ::= chained{administerPassword}
chainedLdapTransport      OPERATION ::= chained{ldapTransport}
chainedLinkedLDAP         OPERATION ::= chained{linkedLDAP}

END -- DistributedOperations

HierarchicalOperationalBindings {joint-iso-itu-t ds(5) module(1) hierarchicalOperationalBindings(20) 9}
DEFINITIONS ::=
BEGIN

-- EXPORTS All
/*
The types and values defined in this module are exported for use in the other ASN.1
modules contained within these Directory Specifications, and for the use of other
applications which will use them to access Directory services. Other applications may
use them for their own purposes, but this will not constrain extensions and
modifications needed to maintain or improve the Directory service.
*/
IMPORTS

  -- from Rec. ITU-T X.501 | ISO/IEC 9594-2

  Attribute{}, DistinguishedName, RelativeDistinguishedName, SupportedAttributes
    FROM InformationFramework
      {joint-iso-itu-t ds(5) module(1) informationFramework(1) 9} WITH SUCCESSORS

  OPERATIONAL-BINDING
    FROM OperationalBindingManagement
      {joint-iso-itu-t ds(5) module(1) opBindingManagement(18) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.518 | ISO/IEC 9594-4

  MasterAndShadowAccessPoints
    FROM DistributedOperations
      {joint-iso-itu-t ds(5) module(1) distributedOperations(3) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.519 | ISO/IEC 9594-5

  directorySystemAC
    FROM DirectoryOSIProtocols
      {joint-iso-itu-t ds(5) module(1) directoryOSIProtocols(37) 9} WITH SUCCESSORS

  id-op-binding-hierarchical, id-op-binding-non-specific-hierarchical
    FROM DirectoryOperationalBindingTypes
      {joint-iso-itu-t ds(5) module(1) directoryOperationalBindingTypes(25) 9}
       WITH SUCCESSORS ;

-- types

HierarchicalAgreement ::= SEQUENCE {
  rdn                [0]  RelativeDistinguishedName,
  immediateSuperior  [1]  DistinguishedName,
  ... }

SuperiorToSubordinate ::= SEQUENCE {
  contextPrefixInfo     [0]  DITcontext,
  entryInfo             [1]  SET SIZE (1..MAX) OF
                               Attribute{{SupportedAttributes}} OPTIONAL,
  immediateSuperiorInfo [2]  SET SIZE (1..MAX) OF
                               Attribute{{SupportedAttributes}} OPTIONAL,
  ... }

DITcontext ::= SEQUENCE OF Vertex

Vertex ::= SEQUENCE {
  rdn           [0]  RelativeDistinguishedName,
  admPointInfo  [1]  SET SIZE (1..MAX) OF Attribute{{SupportedAttributes}} OPTIONAL,
  subentries    [2]  SET SIZE (1..MAX) OF SubentryInfo OPTIONAL,
  accessPoints  [3]  MasterAndShadowAccessPoints OPTIONAL,
  ... }

SubentryInfo ::= SEQUENCE {
  rdn   [0]  RelativeDistinguishedName,
  info  [1]  SET OF Attribute{{SupportedAttributes}},
  ... }

SubordinateToSuperior ::= SEQUENCE {
  accessPoints  [0]  MasterAndShadowAccessPoints OPTIONAL,
  alias         [1]  BOOLEAN DEFAULT FALSE,
  entryInfo     [2]  SET SIZE (1..MAX) OF Attribute{{SupportedAttributes}} OPTIONAL,
  subentries    [3]  SET SIZE (1..MAX) OF SubentryInfo OPTIONAL,
  ... }

SuperiorToSubordinateModification ::= SuperiorToSubordinate (
  WITH COMPONENTS {..., entryInfo  ABSENT } )

NonSpecificHierarchicalAgreement ::= SEQUENCE {
  immediateSuperior  [1]  DistinguishedName,
  ... }

NHOBSuperiorToSubordinate ::= SuperiorToSubordinate (
  WITH COMPONENTS {..., entryInfo  ABSENT } )

NHOBSubordinateToSuperior ::= SEQUENCE {
  accessPoints  [0]  MasterAndShadowAccessPoints OPTIONAL,
  subentries    [3]  SET SIZE (1..MAX) OF SubentryInfo OPTIONAL,
  ... }

-- operational binding information objects

hierarchicalOperationalBinding OPERATIONAL-BINDING ::= {
  AGREEMENT             HierarchicalAgreement
  APPLICATION CONTEXTS  {{directorySystemAC}}
  ASYMMETRIC
    ROLE-A { -- superior DSA
      ESTABLISHMENT-INITIATOR  TRUE
      ESTABLISHMENT-PARAMETER  SuperiorToSubordinate
      MODIFICATION-INITIATOR   TRUE
      MODIFICATION-PARAMETER   SuperiorToSubordinateModification
      TERMINATION-INITIATOR    TRUE }
    ROLE-B { -- subordinate DSA
      ESTABLISHMENT-INITIATOR  TRUE
      ESTABLISHMENT-PARAMETER  SubordinateToSuperior
      MODIFICATION-INITIATOR   TRUE
      MODIFICATION-PARAMETER   SubordinateToSuperior
      TERMINATION-INITIATOR    TRUE }
  ID                    id-op-binding-hierarchical }

nonSpecificHierarchicalOperationalBinding OPERATIONAL-BINDING ::= {
  AGREEMENT             NonSpecificHierarchicalAgreement
  APPLICATION CONTEXTS  {{directorySystemAC}}
  ASYMMETRIC
    ROLE-A { -- superior DSA
      ESTABLISHMENT-PARAMETER  NHOBSuperiorToSubordinate
      MODIFICATION-INITIATOR   TRUE
      MODIFICATION-PARAMETER   NHOBSuperiorToSubordinate
      TERMINATION-INITIATOR    TRUE}
    ROLE-B { -- subordinate DSA
      ESTABLISHMENT-INITIATOR  TRUE
      ESTABLISHMENT-PARAMETER  NHOBSubordinateToSuperior
      MODIFICATION-INITIATOR   TRUE
      MODIFICATION-PARAMETER   NHOBSubordinateToSuperior
      TERMINATION-INITIATOR    TRUE}
  ID                    id-op-binding-non-specific-hierarchical }

END -- HierarchicalOperationalBindings

-- Module ProtocolObjectIdentifiers (X.519:02/2001)
-- See also ITU-T X.519 (02/2001)
-- See also the index of all ASN.1 assignments needed in this document

ProtocolObjectIdentifiers {joint-iso-itu-t ds(5) module(1)
  protocolObjectIdentifiers(4) 4} DEFINITIONS ::=
BEGIN

-- EXPORTS All
-- The types and values defined in this module are exported for use in the other ASN.1 modules contained
-- within the Directory Specifications, and for the use of other applications which will use them to access
-- Directory services. Other applications may use them for their own purposes, but this will not constrain
-- extensions and modifications needed to maintain or improve the Directory service.
IMPORTS
  -- from ITU-T Rec. X.501 | ISO/IEC 9594-2
  id-ac, id-as, id-contract, id-package, id-rosObject
    FROM UsefulDefinitions {joint-iso-itu-t ds(5) module(1)
      usefulDefinitions(0) 4};

-- ROS Objects
id-rosObject-dua OBJECT IDENTIFIER ::= {id-rosObject 1}

id-rosObject-directory OBJECT IDENTIFIER ::= {id-rosObject 2}

id-rosObject-dapDSA OBJECT IDENTIFIER ::= {id-rosObject 3}

id-rosObject-dspDSA OBJECT IDENTIFIER ::= {id-rosObject 4}

id-rosObject-dopDSA OBJECT IDENTIFIER ::= {id-rosObject 7}

id-rosObject-initiatingConsumerDSA OBJECT IDENTIFIER ::= {id-rosObject 8}

id-rosObject-respondingSupplierDSA OBJECT IDENTIFIER ::= {id-rosObject 9}

id-rosObject-initiatingSupplierDSA OBJECT IDENTIFIER ::= {id-rosObject 10}

id-rosObject-respondingConsumerDSA OBJECT IDENTIFIER ::= {id-rosObject 11}

-- contracts
id-contract-dap OBJECT IDENTIFIER ::= {id-contract 1}

id-contract-dsp OBJECT IDENTIFIER ::= {id-contract 2}

id-contract-shadowConsumer OBJECT IDENTIFIER ::= {id-contract 3}

id-contract-shadowSupplier OBJECT IDENTIFIER ::= {id-contract 4}

id-contract-dop OBJECT IDENTIFIER ::= {id-contract 5}

-- packages
id-package-read OBJECT IDENTIFIER ::= {id-package 1}

id-package-search OBJECT IDENTIFIER ::= {id-package 2}

id-package-modify OBJECT IDENTIFIER ::= {id-package 3}

id-package-chainedRead OBJECT IDENTIFIER ::= {id-package 4}

id-package-chainedSearch OBJECT IDENTIFIER ::= {id-package 5}

id-package-chainedModify OBJECT IDENTIFIER ::= {id-package 6}

id-package-shadowConsumer OBJECT IDENTIFIER ::= {id-package 7}

id-package-shadowSupplier OBJECT IDENTIFIER ::= {id-package 8}

id-package-operationalBindingManagement OBJECT IDENTIFIER ::= {id-package 9}

id-package-dapConnection OBJECT IDENTIFIER ::= {id-package 10}

id-package-dspConnection OBJECT IDENTIFIER ::= {id-package 11}

id-package-dispConnection OBJECT IDENTIFIER ::= {id-package 12}

id-package-dopConnection OBJECT IDENTIFIER ::= {id-package 13}

--  application contexts
id-ac-directoryAccessAC OBJECT IDENTIFIER ::=
  {id-ac 1}

id-ac-directorySystemAC OBJECT IDENTIFIER ::= {id-ac 2}

id-ac-directoryOperationalBindingManagementAC OBJECT IDENTIFIER ::= {id-ac 3}

id-ac-shadowConsumerInitiatedAC OBJECT IDENTIFIER ::= {id-ac 4}

id-ac-shadowSupplierInitiatedAC OBJECT IDENTIFIER ::= {id-ac 5}

id-ac-reliableShadowSupplierInitiatedAC OBJECT IDENTIFIER ::= {id-ac 6}

id-ac-reliableShadowConsumerInitiatedAC OBJECT IDENTIFIER ::= {id-ac 7}

id-ac-shadowSupplierInitiatedAsynchronousAC OBJECT IDENTIFIER ::= {id-ac 8}

id-ac-shadowConsumerInitiatedAsynchronousAC OBJECT IDENTIFIER ::= {id-ac 9}

-- id-ac-directoryAccessWith2or3seAC						OBJECT IDENTIFIER	::=	{id-ac 10}
-- id-ac-directorySystemWith2or3seAC					OBJECT IDENTIFIER	::=	{id-ac 11}
-- id-ac-shadowSupplierInitiatedWith2or3seAC				OBJECT IDENTIFIER	::=	{id-ac 12}
-- id-ac-shadowConsumerInitiatedWith2or3seAC				OBJECT IDENTIFIER	::=	{id-ac 13}
-- id-ac-reliableShadowSupplierInitiatedWith2or3seAC			OBJECT IDENTIFIER	::=	{id-ac 14}
-- id-ac-reliableShadowConsumerInitiatedWith2or3seAC			OBJECT IDENTIFIER	::=	{id-ac 15}
-- id-ac-directoryOperationalBindingManagementWith2or3seAC   	OBJECT IDENTIFIER	::=	{id-ac 16}
--  ASEs (obsolete)
--	id-ase-readASE							OBJECT IDENTIFIER	::=	{id-ase 1}
--	id-ase-searchASE   						OBJECT IDENTIFIER	::=	{id-ase 2}
--	id-ase-modifyASE   						OBJECT IDENTIFIER	::=	{id-ase 3}
--	id-ase-chainedReadASE  					OBJECT IDENTIFIER	::=	{id-ase 4}
--	id-ase-chainedSearchASE					OBJECT IDENTIFIER	::=	{id-ase 5}
--	id-ase-chainedModifyASE					OBJECT IDENTIFIER	::=	{id-ase 6}
--	id-ase-operationalBindingManagementASE    		OBJECT IDENTIFIER	::=	{id-ase 7}
--	id-ase-shadowConsumerASE					OBJECT IDENTIFIER	::=	{id-ase 8}
--	id-ase-shadowSupplierASE  					OBJECT IDENTIFIER    ::=	{id-ase 9}
--  abstract syntaxes
id-as-directoryAccessAS OBJECT IDENTIFIER ::=
  {id-as 1}

id-as-directorySystemAS OBJECT IDENTIFIER ::= {id-as 2}

id-as-directoryShadowAS OBJECT IDENTIFIER ::= {id-as 3}

id-as-directoryOperationalBindingManagementAS OBJECT IDENTIFIER ::= {id-as 4}

id-as-directoryReliableShadowAS OBJECT IDENTIFIER ::= {id-as 5}

id-as-reliableShadowBindingAS OBJECT IDENTIFIER ::= {id-as 6}

id-as-2or3se OBJECT IDENTIFIER ::= {id-as 7}

END -- ProtocolObjectIdentifiers

CommonProtocolSpecification {joint-iso-itu-t ds(5) module(1) commonProtocolSpecification(35) 9}
DEFINITIONS ::=
BEGIN

-- EXPORTS All
/*
The types and values defined in this module are exported for use in the
other ASN.1 modules contained within the Directory Specifications, and for
the use of other applications which will use them to access Directory
services. Other applications may use them for their own purposes, but this
will not constrain extensions and modifications needed to maintain or
improve the Directory service.
*/
IMPORTS

  -- from Rec. ITU-T X.501 | ISO/IEC 9594-2

  establishOperationalBinding, modifyOperationalBinding,
  terminateOperationalBinding
    FROM OperationalBindingManagement
      {joint-iso-itu-t ds(5) module(1) opBindingManagement(18) 9} WITH SUCCESSORS ;

OPERATION ::= CLASS {
  &ArgumentType   OPTIONAL,
  &ResultType     OPTIONAL,
  &Errors         ERROR OPTIONAL,
  &operationCode  Code UNIQUE OPTIONAL }
WITH SYNTAX {
  [ARGUMENT       &ArgumentType]
  [RESULT         &ResultType]
  [ERRORS         &Errors]
  [CODE           &operationCode] }

ERROR ::= CLASS {
  &ParameterType,
  &errorCode      Code UNIQUE OPTIONAL }
WITH SYNTAX {
  PARAMETER       &ParameterType
  [CODE           &errorCode] }

Code ::= CHOICE {
  local   INTEGER,
  global  OBJECT IDENTIFIER,
  ... }

InvokeId ::= CHOICE {
  present  INTEGER,
  absent   NULL,
  ... }

--  operation codes for DAP and DSP

id-opcode-read                    Code ::= local:1
id-opcode-compare                 Code ::= local:2
id-opcode-abandon                 Code ::= local:3
id-opcode-list                    Code ::= local:4
id-opcode-search                  Code ::= local:5
id-opcode-addEntry                Code ::= local:6
id-opcode-removeEntry             Code ::= local:7
id-opcode-modifyEntry             Code ::= local:8
id-opcode-modifyDN                Code ::= local:9
id-opcode-changePassword          Code ::= local:10
id-opcode-administerPassword      Code ::= local:11
id-opcode-ldapTransport           Code ::= local:12
id-opcode-linkedLDAP              Code ::= local:13

--  operation codes for DISP

id-opcode-requestShadowUpdate     Code ::= local:1
id-opcode-updateShadow            Code ::= local:2
id-opcode-coordinateShadowUpdate  Code ::= local:3

--  operation codes for DOP

id-op-establishOperationalBinding Code ::= local:100
id-op-modifyOperationalBinding    Code ::= local:102
id-op-terminateOperationalBinding Code ::= local:101

-- error codes for DAP and DSP

id-errcode-attributeError         Code ::= local:1
id-errcode-nameError              Code ::= local:2
id-errcode-serviceError           Code ::= local:3
id-errcode-referral               Code ::= local:4
id-errcode-abandoned              Code ::= local:5
id-errcode-securityError          Code ::= local:6
id-errcode-abandonFailed          Code ::= local:7
id-errcode-updateError            Code ::= local:8
id-errcode-dsaReferral            Code ::= local:9

-- error code for DISP

id-errcode-shadowError            Code ::= local:1

-- error code for DOP

id-err-operationalBindingError    Code ::= local:100

DOP-Invokable OPERATION ::=
  {establishOperationalBinding |
   modifyOperationalBinding |
   terminateOperationalBinding}

DOP-Returnable OPERATION ::=
  {establishOperationalBinding |
   modifyOperationalBinding |
   terminateOperationalBinding}

END -- CommonProtocolSpecification

DirectoryIDMProtocols {joint-iso-itu-t ds(5) module(1) directoryIDMProtocols(31) 9}
DEFINITIONS ::=
BEGIN

-- EXPORTS All
/*
The types and values defined in this module are exported for use in the other ASN.1
modules contained within these Directory Specifications, and for the use of other
applications which will use them to access Directory services. Other applications may
use them for their own purposes, but this will not constrain extensions and
modifications needed to maintain or improve the Directory service.
*/
IMPORTS

  -- from Rec. ITU-T X.501 | ISO/IEC 9594-2

  id-idm
    FROM UsefulDefinitions
      {joint-iso-itu-t ds(5) module(1) usefulDefinitions(0) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.501 | ISO/IEC 9594-2

  dSAOperationalBindingManagementBind, establishOperationalBinding,
  modifyOperationalBinding, terminateOperationalBinding
    FROM OperationalBindingManagement
      {joint-iso-itu-t ds(5) module(1) opBindingManagement(18) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.511 | ISO/IEC 9594-3

  abandon, addEntry, administerPassword, changePassword, compare, directoryBind, list,
  modifyDN, modifyEntry, read, removeEntry, search
    FROM DirectoryAbstractService
      {joint-iso-itu-t ds(5) module(1) directoryAbstractService(2) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.518 | ISO/IEC 9594-4

  chainedAbandon, chainedAddEntry, chainedAdministerPassword, chainedChangePassword,
  chainedCompare, chainedLdapTransport, chainedLinkedLDAP, chainedList, chainedModifyDN,
  chainedModifyEntry, chainedRead, chainedRemoveEntry, chainedSearch, dSABind
    FROM DistributedOperations
      {joint-iso-itu-t ds(5) module(1) distributedOperations(3) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.519 | ISO/IEC 9594-5

  IDM-PDU, IDM-PROTOCOL
    FROM IDMProtocolSpecification
      {joint-iso-itu-t ds(5) module(1) iDMProtocolSpecification(30) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.525 | ISO/IEC 9594-9

  coordinateShadowUpdate, dSAShadowBind, requestShadowUpdate, updateShadow
    FROM DirectoryShadowAbstractService
      {joint-iso-itu-t ds(5) module(1) directoryShadowAbstractService(15) 9}
       WITH SUCCESSORS ;

-- IDM protocols

DAP-IDM-PDUs ::= IDM-PDU{dap-ip}

dap-ip IDM-PROTOCOL ::= {
  BIND-OPERATION  directoryBind
  OPERATIONS      {read |
                   compare |
                   abandon |
                   list |
                   search |
                   addEntry |
                   removeEntry |
                   modifyEntry |
                   modifyDN |
                   administerPassword |
                   changePassword }
  ID              id-idm-dap }

DSP-IDM-PDUs ::= IDM-PDU{dsp-ip}

dsp-ip IDM-PROTOCOL ::= {
  BIND-OPERATION  dSABind
  OPERATIONS      {chainedRead |
                   chainedCompare |
                   chainedAbandon |
                   chainedList |
                   chainedSearch |
                   chainedAddEntry |
                   chainedRemoveEntry |
                   chainedModifyEntry |
                   chainedModifyDN |
                   chainedAdministerPassword |
                   chainedChangePassword |
                   chainedLdapTransport |
                   chainedLinkedLDAP }
  ID              id-idm-dsp }

DISP-IDM-PDUs ::= IDM-PDU{disp-ip}

disp-ip IDM-PROTOCOL ::= {
  BIND-OPERATION  dSAShadowBind
  OPERATIONS      {requestShadowUpdate |
                   updateShadow |
                   coordinateShadowUpdate}
  ID              id-idm-disp }

DOP-IDM-PDUs ::= IDM-PDU{dop-ip}

dop-ip IDM-PROTOCOL ::= {
  BIND-OPERATION  dSAOperationalBindingManagementBind
  OPERATIONS      {establishOperationalBinding |
                   modifyOperationalBinding |
                   terminateOperationalBinding}
  ID              id-idm-dop }

-- protocol object identifiers

id-idm-dap  OBJECT IDENTIFIER ::= {id-idm 0}
id-idm-dsp  OBJECT IDENTIFIER ::= {id-idm 1}
id-idm-disp OBJECT IDENTIFIER ::= {id-idm 2}
id-idm-dop  OBJECT IDENTIFIER ::= {id-idm 3}

END -- DirectoryIDMProtocols

DirectoryOperationalBindingTypes {joint-iso-itu-t ds(5) module(1) directoryOperationalBindingTypes(25) 9}
DEFINITIONS ::=
BEGIN

-- EXPORTS All
/*
The types and values defined in this module are exported for use in the other ASN.1
modules contained within the Directory Specifications, and for the use of other
applications which will use them to access Directory services. Other applications
may use them for their own purposes, but this will not constrain extensions and
modifications
*/
IMPORTS

  -- from Rec. ITU-T X.501 | ISO/IEC 9594-2

  id-ob
    FROM UsefulDefinitions
      {joint-iso-itu-t ds(5) module(1) usefulDefinitions(0) 9} WITH SUCCESSORS ;

id-op-binding-shadow                     OBJECT IDENTIFIER ::= {id-ob 1}
id-op-binding-hierarchical               OBJECT IDENTIFIER ::= {id-ob 2}
id-op-binding-non-specific-hierarchical  OBJECT IDENTIFIER ::= {id-ob 3}

END -- DirectoryOperationalBindingTypes

DirectoryOSIProtocols {joint-iso-itu-t ds(5) module(1) directoryOSIProtocols(37) 9}
DEFINITIONS ::=
BEGIN

-- EXPORTS All
/*
The types and values defined in this module are exported for use in the other ASN.1
modules contained within these Directory Specifications, and for the use of other
applications which will use them to access Directory services. Other applications may
use them for their own purposes, but this will not constrain extensions and
modifications needed to maintain or improve the Directory service.
*/
IMPORTS

  -- from Rec. ITU-T X.501 | ISO/IEC 9594-2

  id-ac, id-as, id-idm
    FROM UsefulDefinitions
      {joint-iso-itu-t ds(5) module(1) usefulDefinitions(0) 9} WITH SUCCESSORS

  dSAOperationalBindingManagementBind, establishOperationalBinding,
  modifyOperationalBinding, terminateOperationalBinding
    FROM OperationalBindingManagement
      {joint-iso-itu-t ds(5) module(1) opBindingManagement(18) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.511 | ISO/IEC 9594-3

  abandon, addEntry, administerPassword, changePassword, compare, directoryBind,
  list, modifyDN, modifyEntry, read, removeEntry, search
    FROM DirectoryAbstractService
      {joint-iso-itu-t ds(5) module(1) directoryAbstractService(2) 9} WITH SUCCESSORS

  -- from ITU-T Rec. X.518 | ISO/IEC 9594-4

  chainedAbandon, chainedAddEntry, chainedAdministerPassword, chainedChangePassword,
  chainedCompare, chainedLdapTransport, chainedLinkedLDAP, chainedList,
  chainedModifyDN, chainedModifyEntry, chainedRead,   chainedRemoveEntry, chainedSearch,
  dSABind
    FROM DistributedOperations
      {joint-iso-itu-t ds(5) module(1) distributedOperations(3) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.519 | ISO/IEC 9594-5

  OPERATION
    FROM CommonProtocolSpecification
      {joint-iso-itu-t ds(5) module(1) commonProtocolSpecification(35) 9} WITH SUCCESSORS

  OSI-PDU{}
    FROM OSIProtocolSpecification
      {joint-iso-itu-t ds(5) module(1) oSIProtocolSpecification(36) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.525 | ISO/IEC 9594-9

  coordinateShadowUpdate, dSAShadowBind, requestShadowUpdate, updateShadow
    FROM DirectoryShadowAbstractService
      {joint-iso-itu-t ds(5) module(1) directoryShadowAbstractService(15) 9}
       WITH SUCCESSORS ;

-- OSI protocols

DAP-OSI-PDUs ::= OSI-PDU{directoryAccessAC}

DSP-OSI-PDUs ::= OSI-PDU{directorySystemAC}

DOP-OSI-PDUs ::= OSI-PDU{directoryOperationalBindingManagementAC}

ShadowSupplierInitiatedDISP-OSI-PDUs ::= OSI-PDU{shadowSupplierInitiatedAC}

ShadowSupplierInitiatedAsynchronousDISP-OSI-PDUs ::=
  OSI-PDU{shadowSupplierInitiatedAsynchronousAC}

ShadowConsumerInitiatedDISP-OSI-PDUs ::= OSI-PDU{shadowConsumerInitiatedAC}

ShadowConsumerInitiatedAsynchronousDISP-OSI-PDUs ::=
  OSI-PDU{shadowConsumerInitiatedAsynchronousAC}

APPLICATION-CONTEXT ::= CLASS {
  &bind-operation          OPERATION,
  &Operations              OPERATION,
  &applicationContextName  OBJECT IDENTIFIER UNIQUE }
WITH SYNTAX {
  BIND-OPERATION &bind-operation
  OPERATIONS &Operations
  APPLICATION CONTEXT NAME &applicationContextName }

directoryAccessAC APPLICATION-CONTEXT ::= {
  BIND-OPERATION            directoryBind
  OPERATIONS                {read |
                             compare |
                             abandon |
                             list |
                             search |
                             addEntry |
                             removeEntry |
                             modifyEntry |
                             modifyDN |
                             administerPassword |
                             changePassword }
  APPLICATION CONTEXT NAME  id-ac-directoryAccessAC }

directorySystemAC APPLICATION-CONTEXT ::= {
  BIND-OPERATION            dSABind
  OPERATIONS                {chainedRead |
                             chainedCompare |
                             chainedAbandon |
                             chainedList |
                             chainedSearch |
                             chainedAddEntry |
                             chainedRemoveEntry |
                             chainedModifyEntry |
                             chainedModifyDN |
                             chainedAdministerPassword |
                             chainedChangePassword |
                             chainedLdapTransport |
                             chainedLinkedLDAP }
  APPLICATION CONTEXT NAME  id-ac-directorySystemAC }

shadowSupplierInitiatedAC APPLICATION-CONTEXT ::= {
  BIND-OPERATION            dSAShadowBind
  OPERATIONS                {updateShadow |
                             coordinateShadowUpdate}
  APPLICATION CONTEXT NAME  id-ac-shadowSupplierInitiatedAC }

shadowConsumerInitiatedAC APPLICATION-CONTEXT ::= {
  BIND-OPERATION            dSAShadowBind
  OPERATIONS                {requestShadowUpdate |
                             updateShadow}
  APPLICATION CONTEXT NAME  id-ac-shadowConsumerInitiatedAC }

shadowSupplierInitiatedAsynchronousAC APPLICATION-CONTEXT ::= {
  BIND-OPERATION            dSAShadowBind
  OPERATIONS                {updateShadow |
                             coordinateShadowUpdate}
  APPLICATION CONTEXT NAME  id-ac-shadowSupplierInitiatedAsynchronousAC }

shadowConsumerInitiatedAsynchronousAC APPLICATION-CONTEXT ::= {
  BIND-OPERATION            dSAShadowBind
  OPERATIONS                {requestShadowUpdate |
                             updateShadow}
  APPLICATION CONTEXT NAME  id-ac-shadowConsumerInitiatedAsynchronousAC }

directoryOperationalBindingManagementAC APPLICATION-CONTEXT ::= {
  BIND-OPERATION            dSAOperationalBindingManagementBind
  OPERATIONS                {establishOperationalBinding |
                             modifyOperationalBinding |
                             terminateOperationalBinding}
  APPLICATION CONTEXT NAME  id-ac-directoryOperationalBindingManagementAC }

--  abstract syntaxes

id-as-directoryAccessAS                       OBJECT IDENTIFIER ::= {id-as 1}
id-as-directorySystemAS                       OBJECT IDENTIFIER ::= {id-as 2}
id-as-directoryShadowAS                       OBJECT IDENTIFIER ::= {id-as 3}
id-as-directoryOperationalBindingManagementAS OBJECT IDENTIFIER ::= {id-as 4}
-- id-as-directoryReliableShadowAS            OBJECT IDENTIFIER ::= {id-as 5}
-- id-as-reliableShadowBindingAS              OBJECT IDENTIFIER ::= {id-as 6}
-- id-as-2or3se                               OBJECT IDENTIFIER ::= {id-as 7}
id-acseAS                                     OBJECT IDENTIFIER ::=
  {joint-iso-itu-t association-control(2) abstract-syntax(1) apdus(0) version(1)}

-- application context object identifiers

id-ac-directoryAccessAC                       OBJECT IDENTIFIER ::= {id-ac 1}
id-ac-directorySystemAC                       OBJECT IDENTIFIER ::= {id-ac 2}
id-ac-directoryOperationalBindingManagementAC OBJECT IDENTIFIER ::= {id-ac 3}
id-ac-shadowConsumerInitiatedAC               OBJECT IDENTIFIER ::= {id-ac 4}
id-ac-shadowSupplierInitiatedAC               OBJECT IDENTIFIER ::= {id-ac 5}
-- id-ac-reliableShadowSupplierInitiatedAC    OBJECT IDENTIFIER ::= {id-ac 6}
-- id-ac-reliableShadowConsumerInitiatedAC    OBJECT IDENTIFIER ::= {id-ac 7}
id-ac-shadowSupplierInitiatedAsynchronousAC   OBJECT IDENTIFIER ::= {id-ac 8}
id-ac-shadowConsumerInitiatedAsynchronousAC   OBJECT IDENTIFIER ::= {id-ac 9}
-- id-ac-directoryAccessWith2or3seAC          OBJECT IDENTIFIER ::= {id-ac 10}
-- id-ac-directorySystemWith2or3seAC          OBJECT IDENTIFIER ::= {id-ac 11}
-- id-ac-shadowSupplierInitiatedWith2or3seAC  OBJECT IDENTIFIER ::= {id-ac 12}
-- id-ac-shadowConsumerInitiatedWith2or3seAC  OBJECT IDENTIFIER ::= {id-ac 13}
-- id-ac-reliableShadowSupplierInitiatedWith2or3seAC
--                                            OBJECT IDENTIFIER ::= {id-ac 14}
-- id-ac-reliableShadowConsumerInitiatedWith2or3seAC
--                                            OBJECT IDENTIFIER ::= {id-ac 15}
-- id-ac-directoryOperationalBindingManagementWith2or3seAC
--                                            OBJECT IDENTIFIER ::= {id-ac 16}

END -- DirectoryOSIProtocols

IDMProtocolSpecification {joint-iso-itu-t ds(5) module(1) iDMProtocolSpecification(30) 9}
DEFINITIONS ::=
BEGIN

-- EXPORTS All
/*
The types and values defined in this module are exported for use in the other ASN.1
modules contained within these Directory Specifications, and for the use of other
applications which will use them to access Directory services. Other applications may
use them for their own purposes, but this will not constrain extensions and
modifications needed to maintain or improve the Directory service.
*/
IMPORTS

   -- from Rec. ITU-T X.509 | ISO/IEC 9594-8

  GeneralName
    FROM CertificateExtensions
      {joint-iso-itu-t ds(5) module(1) certificateExtensions(26) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.511 | ISO/IEC 9594-3

  SecurityProblem, ServiceProblem, Versions
    FROM DirectoryAbstractService
      {joint-iso-itu-t ds(5) module(1) directoryAbstractService(2) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.519 | ISO/IEC 9594-5

  OPERATION
    FROM CommonProtocolSpecification
      {joint-iso-itu-t ds(5) module(1) commonProtocolSpecification(35) 9}
       WITH SUCCESSORS ;

-- IDM protocol

IDM-PDU{IDM-PROTOCOL:protocol} ::= CHOICE {
  bind         [0]  IdmBind{{protocol}},
  bindResult   [1]  IdmBindResult{{protocol}},
  bindError    [2]  IdmBindError{{protocol}},
  request      [3]  Request{{protocol.&Operations}},
  result       [4]  IdmResult{{protocol.&Operations}},
  error        [5]  Error{{protocol.&Operations}},
  reject       [6]  IdmReject,
  unbind       [7]  Unbind,
  abort        [8]  Abort,
  startTLS     [9]  StartTLS,
  tLSResponse  [10] TLSResponse,
  ... }

IdmBind{IDM-PROTOCOL:Protocols} ::= SEQUENCE {
  protocolID           IDM-PROTOCOL.&id({Protocols}),
  callingAETitle  [0]  GeneralName OPTIONAL,
  calledAETitle   [1]  GeneralName OPTIONAL,
  argument        [2]  IDM-PROTOCOL.&bind-operation.&ArgumentType
                         ({Protocols}{@protocolID}),
  ... }

IdmBindResult{IDM-PROTOCOL:Protocols} ::= SEQUENCE {
  protocolID              IDM-PROTOCOL.&id({Protocols}),
  respondingAETitle  [0]  GeneralName OPTIONAL,
  result             [1]  IDM-PROTOCOL.&bind-operation.&ResultType
                            ({Protocols}{@protocolID}),
  ... }

IdmBindError{IDM-PROTOCOL:Protocols} ::= SEQUENCE {
  protocolID              IDM-PROTOCOL.&id({Protocols}),
--errcode                 IDM-PROTOCOL.&bind-operation.&Errors.&errorCode OPTIONAL
  respondingAETitle  [0]  GeneralName OPTIONAL,
  aETitleError            ENUMERATED {
    callingAETitleNotAccepted  (0),
    calledAETitleNotRecognized (1),
    ...} OPTIONAL,
  error              [1]  IDM-PROTOCOL.&bind-operation.&Errors.&ParameterType
                            ({Protocols}{@protocolID}),
  ... }

Request{OPERATION:Operations} ::= SEQUENCE {
  invokeID  INTEGER,
  opcode    OPERATION.&operationCode({Operations}),
  argument  OPERATION.&ArgumentType({Operations}{@opcode}),
  ... }

IdmResult{OPERATION:Operations} ::= SEQUENCE {
  invokeID  INTEGER,
  opcode    OPERATION.&operationCode({Operations}),
  result    OPERATION.&ResultType({Operations}{@opcode}),
  ... }

Error{OPERATION:Operations} ::= SEQUENCE {
  invokeID  INTEGER,
  errcode   OPERATION.&Errors.&errorCode({Operations}),
  error     OPERATION.&Errors.&ParameterType({Operations}{@errcode}),
  ... }

IdmReject ::= SEQUENCE {
  invokeID  INTEGER,
  reason    ENUMERATED {
    mistypedPDU                 (0),
    duplicateInvokeIDRequest    (1),
    unsupportedOperationRequest (2),
    unknownOperationRequest     (3),
    mistypedArgumentRequest     (4),
    resourceLimitationRequest   (5),
    unknownInvokeIDResult       (6),
    mistypedResultRequest       (7),
    unknownInvokeIDError        (8),
    unknownError                (9),
    mistypedParameterError      (10),
    unsupportedIdmVersion       (11),
    unsuitableIdmVersion        (12),
    invalidIdmVersion           (13),
    ...},
  ... }

Unbind ::= NULL

Abort ::= ENUMERATED {
  mistypedPDU         (0),
  unboundRequest      (1),
  invalidPDU          (2),
  resourceLimitation  (3),
  connectionFailed    (4),
  invalidProtocol     (5),
  reasonNotSpecified  (6),
  ...}

StartTLS ::= NULL

TLSResponse ::= ENUMERATED {
  success         (0),
  operationsError (1),
  protocolError   (2),
  unavailable     (3),
  ...}

-- IDM-protocol information object class

IDM-PROTOCOL ::= CLASS {
  &bind-operation  OPERATION,
  &Operations      OPERATION,
  &id              OBJECT IDENTIFIER UNIQUE }
WITH SYNTAX {
  BIND-OPERATION   &bind-operation
  OPERATIONS       &Operations
  ID               &id }

END -- IDMProtocolSpecification

OSIProtocolSpecification {joint-iso-itu-t ds(5) module(1) oSIProtocolSpecification(36) 9}
DEFINITIONS ::=
BEGIN

-- EXPORTS All
/*
The types and values defined in this module are exported for use in the other ASN.1
modules contained within the Directory Specifications, and for the use of other
applications which will use them to access Directory services. Other applications may
use them for their own purposes, but this will not constrain extensions and
modifications needed to maintain or improve the Directory service.
*/
IMPORTS

  -- from Rec. ITU-T X.501 | ISO/IEC 9594-2

  Name, RelativeDistinguishedName
    FROM InformationFramework
      {joint-iso-itu-t ds(5) module(1) informationFramework(1) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.511 | ISO/IEC 9594-3

  SecurityProblem, ServiceProblem, Versions
    FROM DirectoryAbstractService
      {joint-iso-itu-t ds(5) module(1) directoryAbstractService(2) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.519 | ISO/IEC 9594-5

  InvokeId, OPERATION
    FROM CommonProtocolSpecification
      {joint-iso-itu-t ds(5) module(1) commonProtocolSpecification(35) 9} WITH SUCCESSORS

  APPLICATION-CONTEXT
    FROM DirectoryOSIProtocols
      {joint-iso-itu-t ds(5) module(1) directoryOSIProtocols(37) 9} WITH SUCCESSORS ;

-- OSI protocol

OSI-PDU{APPLICATION-CONTEXT:protocol} ::= TYPE-IDENTIFIER.&Type (
  OsiBind{{protocol}} |
  OsiBindResult{{protocol}} |
  OsiBindError{{protocol}} |
  OsiOperation{{protocol.&Operations}} |
  OsiUnbind |
  PresentationAbort )

OsiBind{APPLICATION-CONTEXT:Protocols} ::= SET {
  mode-selector                  [0]  IMPLICIT SET {
    mode-value                     [0]  IMPLICIT INTEGER(1)},
  normal-mode-parameters         [2]  IMPLICIT SEQUENCE {
    protocol-version               [0]  IMPLICIT BIT STRING {version-1(0)}
                                          DEFAULT {version-1},
    calling-presentation-selector  [1]  IMPLICIT Presentation-selector OPTIONAL,
    called-presentation-selector   [2]  IMPLICIT Presentation-selector OPTIONAL,
    presentation-context-definition-list
                                   [4]  IMPLICIT Context-list,
    user-data                           CHOICE {
      fully-encoded-data  [APPLICATION 1] IMPLICIT SEQUENCE SIZE (1) OF SEQUENCE {
        transfer-syntax-name              Transfer-syntax-name OPTIONAL,
        presentation-context-identifier   Presentation-context-identifier,
        presentation-data-values          CHOICE {
          single-ASN1-type             [0]  ABSTRACT-SYNTAX.&Type
                                             (AARQ-apdu{{Protocols}})}}}}}

Presentation-selector ::= OCTET STRING(SIZE (1..4, ..., 5..MAX))

Context-list ::= SEQUENCE SIZE (2) OF SEQUENCE {
  presentation-context-identifier  Presentation-context-identifier,
  abstract-syntax-name             Abstract-syntax-name,
  transfer-syntax-name-list        SEQUENCE OF Transfer-syntax-name }

Presentation-context-identifier ::= INTEGER(1..127, ..., 128..MAX)

Abstract-syntax-name ::= OBJECT IDENTIFIER

Transfer-syntax-name ::= OBJECT IDENTIFIER

AARQ-apdu{APPLICATION-CONTEXT:Protocols} ::= [APPLICATION 0] IMPLICIT SEQUENCE {
  protocol-version                  [0] IMPLICIT BIT STRING {version1(0)}
                                             DEFAULT {version1},
  application-context-name          [1]  Application-context-name,
  called-AP-title                   [2]  Name OPTIONAL,
  called-AE-qualifier               [3]  RelativeDistinguishedName    OPTIONAL,
  called-AP-invocation-identifier   [4]  AP-invocation-identifier     OPTIONAL,
  called-AE-invocation-identifier   [5]  AE-invocation-identifier     OPTIONAL,
  calling-AP-title                  [6]  Name                         OPTIONAL,
  calling-AE-qualifier              [7]  RelativeDistinguishedName    OPTIONAL,
  calling-AP-invocation-identifier  [8]  AP-invocation-identifier     OPTIONAL,
  calling-AE-invocation-identifier  [9]  AE-invocation-identifier     OPTIONAL,
  implementation-information        [29] IMPLICIT Implementation-data OPTIONAL,
  user-information                  [30] IMPLICIT
                                           Association-informationBind{{Protocols}}}

Association-informationBind{APPLICATION-CONTEXT:Protocols} ::=
  SEQUENCE SIZE (1..MAX) OF
    EXTERNAL
      (WITH COMPONENTS {
         identification         (WITH COMPONENTS {..., syntax ABSENT}),
         data-value-descriptor  ABSENT,
         data-value             (CONTAINING TheOsiBind{{Protocols}})})

Application-context-name ::= OBJECT IDENTIFIER

AP-invocation-identifier ::= INTEGER

AE-invocation-identifier ::= INTEGER

Implementation-data ::= GraphicString


TheOsiBind{APPLICATION-CONTEXT:Protocols} ::=
  [16]  APPLICATION-CONTEXT.&bind-operation.&ArgumentType({Protocols})

OsiBindResult{APPLICATION-CONTEXT:Protocols} ::= SET {
  mode-selector                    [0] IMPLICIT SET {mode-value  [0] IMPLICIT INTEGER(1)},
  normal-mode-parameters           [2] IMPLICIT SEQUENCE {
    protocol-version                 [0] IMPLICIT BIT STRING {version-1(0)}
                                           DEFAULT {version-1},
    responding-presentation-selector [3] IMPLICIT Presentation-selector OPTIONAL,
    presentation-context-definition-result-list
                                     [5] IMPLICIT SEQUENCE SIZE (2) OF SEQUENCE {
      result                           [0] IMPLICIT Result(acceptance),
      transfer-syntax-name             [1] IMPLICIT Transfer-syntax-name },
    user-data                            CHOICE {
      fully-encoded-data [APPLICATION 1] IMPLICIT SEQUENCE SIZE(1) OF SEQUENCE {
        transfer-syntax-name               Transfer-syntax-name OPTIONAL,
        presentation-context-identifier    Presentation-context-identifier,
        presentation-data-values           CHOICE {
          single-ASN1-type              [0]  ABSTRACT-SYNTAX.&Type(AARE-apdu{{Protocols}}
  )}}}}}

Result ::= INTEGER {
  acceptance         (0),
  user-rejection     (1),
  provider-rejection (2)}

AARE-apdu{APPLICATION-CONTEXT:Protocols} ::= [APPLICATION 1] IMPLICIT SEQUENCE {
  protocol-version                     [0] IMPLICIT BIT STRING {version1(0)}
                                             DEFAULT {version1},
  application-context-name             [1]  Application-context-name,
  result                               [2]  Associate-result(accepted),
  result-source-diagnostic             [3]  Associate-source-diagnostic,
  responding-AP-title                  [4]  Name                          OPTIONAL,
  responding-AE-qualifier              [5]  RelativeDistinguishedName     OPTIONAL,
  responding-AP-invocation-identifier  [6]  AP-invocation-identifier      OPTIONAL,
  responding-AE-invocation-identifier  [7]  AE-invocation-identifier      OPTIONAL,
  implementation-information           [29] IMPLICIT Implementation-data  OPTIONAL,
  user-information                     [30] IMPLICIT
                                        Association-informationBindRes{{Protocols}}}

Association-informationBindRes{APPLICATION-CONTEXT:Protocols} ::=
  SEQUENCE SIZE (1) OF
    EXTERNAL (
      WITH COMPONENTS {
        identification         (WITH COMPONENTS {..., syntax ABSENT}),
        data-value-descriptor  ABSENT,
        data-value             (CONTAINING TheOsiBindRes{{Protocols}})})

Associate-result ::= INTEGER {
  accepted           (0),
  rejected-permanent (1),
  rejected-transient (2)}(0..2, ...)

Associate-source-diagnostic ::= CHOICE {
  acse-service-user     [1]  INTEGER {
    null                                            (0),
    no-reason-given                                 (1),
    application-context-name-not-supported          (2),
    calling-AP-title-not-recognized                 (3),
    calling-AP-invocation-identifier-not-recognized (4),
    calling-AE-qualifier-not-recognized             (5),
    calling-AE-invocation-identifier-not-recognized (6),
    called-AP-title-not-recognized                  (7),
    called-AP-invocation-identifier-not-recognized  (8),
    called-AE-qualifier-not-recognized              (9),
    called-AE-invocation-identifier-not-recognized  (10)}(0..10, ...),
  acse-service-provider [2]  INTEGER {
    null                                            (0),
    no-reason-given                                 (1),
    no-common-acse-version                          (2)}(0..2, ...)}

TheOsiBindRes{APPLICATION-CONTEXT:Protocols} ::=
  [17]  APPLICATION-CONTEXT.&bind-operation.&ResultType({Protocols})

OsiBindError{APPLICATION-CONTEXT:Protocols} ::= CHOICE {
  normal-mode-parameters  SEQUENCE {
    protocol-version               [0]  IMPLICIT BIT STRING {version-1(0)}
                                          DEFAULT {version-1},
    responding-presentation-selector
                                   [3]  IMPLICIT Presentation-selector OPTIONAL,
    presentation-context-definition-result-list
                                   [5]  IMPLICIT Result-list OPTIONAL,
    provider-reason                [10] IMPLICIT Provider-reason OPTIONAL,
    user-data                           CHOICE {
      fully-encoded-data  [APPLICATION 1] IMPLICIT SEQUENCE SIZE (1) OF SEQUENCE {
        transfer-syntax-name                Transfer-syntax-name   OPTIONAL,
        presentation-context-identifier     Presentation-context-identifier,
        presentation-data-values            CHOICE {
          single-ASN1-type               [0]
                     ABSTRACT-SYNTAX.&Type(AAREerr-apdu{{Protocols}})}}} OPTIONAL}}

Result-list ::=
  SEQUENCE SIZE (2) OF SEQUENCE {
    result                [0] IMPLICIT Result,
    transfer-syntax-name  [1] IMPLICIT Transfer-syntax-name   OPTIONAL,
    provider-reason       [2] IMPLICIT INTEGER {
      reason-not-specified                     (0),
      abstract-syntax-not-supported            (1),
      proposed-transfer-syntaxes-not-supported (2)} OPTIONAL}

Provider-reason ::= INTEGER {
  reason-not-specified                (0),
  temporary-congestion                (1),
  local-limit-exceeded                (2),
  called-presentation-address-unknown (3),
  protocol-version-not-supported      (4),
  default-context-not-supported       (5),
  user-data-not-readable              (6),
  no-PSAP-available                   (7)}

AAREerr-apdu{APPLICATION-CONTEXT:Protocols} ::=  [APPLICATION 1] IMPLICIT SEQUENCE {
  protocol-version                    [0]  IMPLICIT BIT STRING {version1(0)}
                                             DEFAULT {version1},
  application-context-name            [1]  Application-context-name,
  result                              [2]  Associate-result
                                             (rejected-permanent..rejected-transient),
  result-source-diagnostic            [3]  Associate-source-diagnostic,
  responding-AP-title                 [4]  Name OPTIONAL,
  responding-AE-qualifier             [5]  RelativeDistinguishedName OPTIONAL,
  responding-AP-invocation-identifier [6]  AP-invocation-identifier  OPTIONAL,
  responding-AE-invocation-identifier [7]  AE-invocation-identifier  OPTIONAL,
  implementation-information          [29] IMPLICIT Implementation-data OPTIONAL,
  user-information                    [30] IMPLICIT
                                Association-informationBindErr{{Protocols}} OPTIONAL }

Association-informationBindErr{APPLICATION-CONTEXT:Protocols} ::=
  SEQUENCE SIZE (1) OF
    EXTERNAL (
      WITH COMPONENTS {
        identification         (WITH COMPONENTS {..., syntax ABSENT}),
        data-value-descriptor  ABSENT,
        data-value             (CONTAINING TheOsiBindErr{{Protocols}})})

TheOsiBindErr{APPLICATION-CONTEXT:Protocols} ::=
  [18]  APPLICATION-CONTEXT.&bind-operation.&Errors.&ParameterType ({Protocols})

OsiUnbind ::= CHOICE {
  fully-encoded-data
    [APPLICATION 1] IMPLICIT SEQUENCE SIZE (1) OF SEQUENCE {
       presentation-context-identifier  Presentation-context-identifier,
       presentation-data-values     CHOICE {
         single-ASN1-type        [0]  ABSTRACT-SYNTAX.&Type(TheOsiUnbind)}}}

TheOsiUnbind ::= [APPLICATION 2] IMPLICIT SEQUENCE {
  reason  [0] IMPLICIT Release-request-reason OPTIONAL}

Release-request-reason ::= INTEGER {normal(0)}

OsiUnbindResult ::= CHOICE {
  fully-encoded-data  [APPLICATION 1] IMPLICIT SEQUENCE SIZE (1) OF SEQUENCE {
    presentation-context-identifier     Presentation-context-identifier,
    presentation-data-values            CHOICE {
      single-ASN1-type               [0]  ABSTRACT-SYNTAX.&Type(TheOsiUnbindRes)}}}

TheOsiUnbindRes ::= [APPLICATION 3] IMPLICIT SEQUENCE {
  reason  [0] IMPLICIT Release-response-reason OPTIONAL }

Release-response-reason ::= INTEGER {normal(0)}

OsiOperation{OPERATION:Operations} ::= CHOICE {
  fully-encoded-data [APPLICATION 1] IMPLICIT SEQUENCE SIZE (1) OF SEQUENCE {
    presentation-context-identifier    Presentation-context-identifier,
    presentation-data-values           CHOICE {
      single-ASN1-type              [0]
                     ABSTRACT-SYNTAX.&Type(OsiDirectoryOperation {{Operations}})}}}

OsiDirectoryOperation{OPERATION:Operations} ::= CHOICE {
  request  OsiReq{{Operations}},
  result   OsiRes{{Operations}},
  error    OsiErr{{Operations}},
  reject   OsiRej}

OsiReq{OPERATION:Operations} ::= [1] IMPLICIT SEQUENCE {
  invokeId  InvokeId,
  opcode    OPERATION.&operationCode({Operations}),
  argument  OPERATION.&ArgumentType({Operations}{@opcode}) }

OsiRes{OPERATION:Operations} ::= [2] IMPLICIT SEQUENCE {
  invokeId  InvokeId,
  result    SEQUENCE {
    opcode    OPERATION.&operationCode({Operations}),
    result    OPERATION.&ResultType({Operations}{@.opcode}) }}

OsiErr{OPERATION:Operations} ::= [3] IMPLICIT SEQUENCE {
  invokeID  InvokeId,
  errcode   OPERATION.&Errors.&errorCode({Operations}),
  error     OPERATION.&Errors.&ParameterType({Operations}{@.errcode}) }

OsiRej ::= [4] IMPLICIT SEQUENCE {
  invokeId          InvokeId,
  problem           CHOICE {
    general      [0]  IMPLICIT GeneralProblem,
    invoke       [1]  IMPLICIT InvokeProblem,
    returnResult [2]  IMPLICIT ReturnResultProblem,
    returnError  [3]  IMPLICIT ReturnErrorProblem,
    ... },
  ... }

GeneralProblem ::= INTEGER {
  unrecognizedPDU          (0),
  mistypedPDU              (1),
  badlyStructuredPDU       (2) }

InvokeProblem ::= INTEGER {
  duplicateInvocation      (0),
  unrecognizedOperation    (1),
  mistypedArgument         (2),
  resourceLimitation       (3),
  releaseInProgress        (4)}

ReturnResultProblem ::= INTEGER {
  unrecognizedInvocation   (0),
  resultResponseUnexpected (1),
  mistypedResult           (2)}

ReturnErrorProblem ::= INTEGER {
  unrecognizedInvocation   (0),
  errorResponseUnexpected  (1),
  unrecognizedError        (2),
  unexpectedError          (3),
  mistypedParameter        (4)}

PresentationAbort ::= CHOICE {
  aru-ppdu  ARU-PPDU,
  arp-ppdu  ARP-PPDU }

ARU-PPDU ::= CHOICE {
  normal-mode-parameters     [0] IMPLICIT SEQUENCE {
    presentation-context-identifier-list
                                    [0] IMPLICIT Presentation-context-identifier-list,
    user-data                           CHOICE {
      fully-encoded-data [APPLICATION 1]  IMPLICIT SEQUENCE SIZE(1..MAX) OF SEQUENCE {
        presentation-context-identifier     Presentation-context-identifier,
        presentation-data-values            CHOICE {
          single-ASN1-type               [0]  ABSTRACT-SYNTAX.&Type(ABRT-apdu)}}}}}

Presentation-context-identifier-list ::= SEQUENCE SIZE (1) OF SEQUENCE {
  presentation-context-identifier  Presentation-context-identifier,
  transfer-syntax-name             Transfer-syntax-name}

ABRT-apdu ::= [APPLICATION 4] IMPLICIT SEQUENCE {
  abort-source  [0] IMPLICIT ABRT-source }

ABRT-source ::= INTEGER {
  acse-service-user     (0),
  acse-service-provider (1) }

ARP-PPDU ::= SEQUENCE {
  provider-reason   [0] IMPLICIT Abort-reason OPTIONAL,
  event-identifier  [1] IMPLICIT Event-identifier OPTIONAL }

Abort-reason ::= INTEGER {
  reason-not-specified                 (0),
  unrecognized-ppdu                    (1),
  unexpected-ppdu                      (2),
  unexpected-session-service-primitive (3),
  unrecognized-ppdu-parameter          (4),
  unexpected-ppdu-parameter            (5),
  invalid-ppdu-parameter-value         (6)}

Event-identifier ::= INTEGER {
  cp-PPDU              (0),
  cpa-PPDU             (1),
  cpr-PPDU             (2),
  aru-PPDU             (3),
  arp-PPDU             (4),
  td-PPDU              (7),
  s-release-indication (14),
  s-release-confirm    (15) }

END -- OSIProtocolSpecification

PasswordPolicy {joint-iso-itu-t ds(5) module(1) passwordPolicy(39) 9}
DEFINITIONS ::=
BEGIN

-- EXPORTS All
/*
The types and values defined in this module are exported for use in the other ASN.1
modules contained within the Directory Specifications, and for the use of other
applications which will use them to access Directory services. Other applications may
use them for their own purposes, but this will not constrain extensions and
modifications needed to maintain or improve the Directory service.
*/
IMPORTS

  id-asx, id-at, id-mr, id-oa
    FROM UsefulDefinitions
      {joint-iso-itu-t ds(5) module(1) usefulDefinitions(0) 9} WITH SUCCESSORS

  AlgorithmIdentifier{}, ALGORITHM, EXTENSION, SupportedAlgorithms
    FROM AuthenticationFramework
      {joint-iso-itu-t ds(5) module(1) authenticationFramework(7) 9} WITH SUCCESSORS

  ATTRIBUTE, MATCHING-RULE, pwdHistory{}, pwdRecentlyExpired{},
  pwdHistoryMatch{}, SYNTAX-NAME
    FROM InformationFramework
      {joint-iso-itu-t ds(5) module(1) informationFramework(1) 9} WITH SUCCESSORS

  bitStringMatch, boolean, booleanMatch, directoryString, generalizedTime,
  generalizedTimeMatch,
  generalizedTimeOrderingMatch, integer, integerMatch, integerOrderingMatch, uri
    FROM SelectedAttributeTypes
      {joint-iso-itu-t ds(5) module(1) selectedAttributeTypes(5) 9} WITH SUCCESSORS ;

userPwd	ATTRIBUTE ::= {
  WITH SYNTAX              UserPwd
  EQUALITY MATCHING RULE   userPwdMatch
  SINGLE VALUE             TRUE
  LDAP-SYNTAX              userPwdDescription.&id
  LDAP-NAME                {"userPwd"}
  ID                       id-at-userPwd }

UserPwd ::= CHOICE {
  clear                 UTF8String,
  encrypted             SEQUENCE {
    algorithmIdentifier   AlgorithmIdentifier{{SupportedAlgorithms}},
    encryptedString       OCTET STRING,
    ...},
  ...}

-- Operational attributes

pwdStartTime ATTRIBUTE ::= {
  WITH SYNTAX              GeneralizedTime
  EQUALITY MATCHING RULE   generalizedTimeMatch
  ORDERING MATCHING RULE   generalizedTimeOrderingMatch
  SINGLE VALUE             TRUE
  USAGE                    directoryOperation
  LDAP-SYNTAX              generalizedTime.&id
  LDAP-NAME                {"pwdStartTime"}
  ID                       id-oa-pwdStartTime }

pwdExpiryTime ATTRIBUTE ::= {
  WITH SYNTAX              GeneralizedTime
  EQUALITY MATCHING RULE   generalizedTimeMatch
  ORDERING MATCHING RULE   generalizedTimeOrderingMatch
  SINGLE VALUE             TRUE
  USAGE                    directoryOperation
  LDAP-SYNTAX              generalizedTime.&id
  LDAP-NAME                {"pwdExpiryTime"}
  ID                       id-oa-pwdExpiryTime }

pwdEndTime ATTRIBUTE ::= {
  WITH SYNTAX              GeneralizedTime
  EQUALITY MATCHING RULE   generalizedTimeMatch
  ORDERING MATCHING RULE   generalizedTimeOrderingMatch
  SINGLE VALUE             TRUE
  USAGE                    directoryOperation
  LDAP-SYNTAX              generalizedTime.&id
  LDAP-NAME                {"pwdEndTime"}
  ID                       id-oa-pwdEndTime }

pwdFails ATTRIBUTE ::= {
  WITH SYNTAX              INTEGER (0..MAX)
  EQUALITY MATCHING RULE   integerMatch
  ORDERING MATCHING RULE   integerOrderingMatch
  SINGLE VALUE             TRUE
  USAGE                    dSAOperation
  LDAP-SYNTAX              integer.&id
  LDAP-NAME                {"pwdFails"}
  ID                       id-oa-pwdFails }

pwdFailureTime ATTRIBUTE ::= {
  WITH SYNTAX              GeneralizedTime
  EQUALITY MATCHING RULE   generalizedTimeMatch
  ORDERING MATCHING RULE   generalizedTimeOrderingMatch
  SINGLE VALUE             TRUE
  USAGE                    dSAOperation
  LDAP-SYNTAX              generalizedTime.&id
  LDAP-NAME                {"pwdFailureTime"}
  ID                       id-oa-pwdFailureTime }

pwdGracesUsed ATTRIBUTE ::= {
  WITH SYNTAX              INTEGER (0..MAX)
  EQUALITY MATCHING RULE   integerMatch
  ORDERING MATCHING RULE   integerOrderingMatch
  SINGLE VALUE             TRUE
  USAGE                    dSAOperation
  LDAP-SYNTAX              integer.&id
  LDAP-NAME                {"pwdGracesUsed"}
  ID                       id-oa-pwdGracesUsed }

userPwdHistory ATTRIBUTE ::=
                    pwdHistory{userPwd,userPwdHistoryMatch,id-oa-userPwdHistory}

userPwdRecentlyExpired ATTRIBUTE ::=
                    pwdRecentlyExpired{userPwd,id-oa-userPwdRecentlyExpired}

pwdModifyEntryAllowed ATTRIBUTE ::= {
  WITH SYNTAX              BOOLEAN
  EQUALITY MATCHING RULE   booleanMatch
  SINGLE VALUE             TRUE
  USAGE                    directoryOperation
  LDAP-SYNTAX              boolean.&id
  LDAP-NAME                {"pwdModifyEntryAllowed"}
  ID                       id-oa-pwdModifyEntryAllowed }

pwdChangeAllowed ATTRIBUTE ::= {
  WITH SYNTAX              BOOLEAN
  EQUALITY MATCHING RULE   booleanMatch
  SINGLE VALUE             TRUE
  USAGE                    directoryOperation
  LDAP-SYNTAX              boolean.&id
  LDAP-NAME                {"pwdChangeAllowed"}
  ID                       id-oa-pwdChangeAllowed }

pwdMaxAge ATTRIBUTE ::= {
  WITH SYNTAX              INTEGER (1 .. MAX)
  EQUALITY MATCHING RULE   integerMatch
  ORDERING MATCHING RULE   integerOrderingMatch
  SINGLE VALUE             TRUE
  USAGE                    directoryOperation
  LDAP-SYNTAX              integer.&id
  LDAP-NAME                {"pwdMaxAge"}
  ID                       id-oa-pwdMaxAge }

pwdExpiryAge ATTRIBUTE ::= {
  WITH SYNTAX              INTEGER (1 .. MAX)
  EQUALITY MATCHING RULE   integerMatch
  ORDERING MATCHING RULE   integerOrderingMatch
  SINGLE VALUE             TRUE
  USAGE                    directoryOperation
  LDAP-SYNTAX              integer.&id
  LDAP-NAME                {"pwdExpiryAge"}
  ID                       id-oa-pwdExpiryAge }

pwdMinLength ATTRIBUTE ::= {
  WITH SYNTAX              INTEGER (0..MAX)
  EQUALITY MATCHING RULE   integerMatch
  SINGLE VALUE             TRUE
  USAGE                    directoryOperation
  LDAP-SYNTAX              integer.&id
  LDAP-NAME                {"pwdMinLength"}
  ID                       id-oa-pwdMinLength }

pwdVocabulary ATTRIBUTE ::= {
  WITH SYNTAX              PwdVocabulary
  EQUALITY MATCHING RULE   bitStringMatch
  SINGLE VALUE             TRUE
  USAGE                    directoryOperation
  LDAP-SYNTAX              pwdVocabularyDescription.&id
  LDAP-NAME                {"pwdVocabulary"}
  ID                       id-oa-pwdVocabulary }

PwdVocabulary ::=  BIT STRING {
    noDictionaryWords   (0),
    noPersonNames       (1),
    noGeographicalNames (2) }

pwdAlphabet ATTRIBUTE ::= {
  WITH SYNTAX              PwdAlphabet
  SINGLE VALUE             TRUE
  USAGE                    directoryOperation
  LDAP-SYNTAX              pwdAlphabetDescription.&id
  LDAP-NAME                {"pwdAlphabet"}
  ID                       id-oa-pwdAlphabet }

PwdAlphabet ::= SEQUENCE OF UTF8String

pwdDictionaries ATTRIBUTE ::= {
  SUBTYPE OF               uri
  USAGE                    directoryOperation
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"pwdDictionaries"}
  ID                       id-oa-pwdDictionaries }

pwdExpiryWarning ATTRIBUTE ::= {
  WITH SYNTAX              INTEGER (1..MAX)
  EQUALITY MATCHING RULE   integerMatch
  ORDERING MATCHING RULE   integerOrderingMatch
  SINGLE VALUE             TRUE
  USAGE                    directoryOperation
  LDAP-SYNTAX              integer.&id
  LDAP-NAME                {"pwdExpiryWarning"}
  ID                       id-oa-pwdExpiryWarning }

pwdGraces ATTRIBUTE ::= {
  WITH SYNTAX              INTEGER (0..MAX)
  EQUALITY MATCHING RULE   integerMatch
  ORDERING MATCHING RULE   integerOrderingMatch
  SINGLE VALUE             TRUE
  USAGE                    directoryOperation
  LDAP-SYNTAX              integer.&id
  LDAP-NAME                {"pwdGraces"}
  ID                       id-oa-pwdGraces }

pwdFailureDuration ATTRIBUTE ::= {
  WITH SYNTAX              INTEGER (0..MAX)
  EQUALITY MATCHING RULE   integerMatch
  ORDERING MATCHING RULE   integerOrderingMatch
  SINGLE VALUE             TRUE
  USAGE                    directoryOperation
  LDAP-SYNTAX              integer.&id
  LDAP-NAME                {"pwdFailureDuration"}
  ID                       id-oa-pwdFailureDuration }

pwdLockoutDuration ATTRIBUTE ::= {
  WITH SYNTAX              INTEGER (0..MAX)
  EQUALITY MATCHING RULE   integerMatch
  ORDERING MATCHING RULE   integerOrderingMatch
  SINGLE VALUE             TRUE
  USAGE                    directoryOperation
  LDAP-SYNTAX              integer.&id
  LDAP-NAME                {"pwdLockoutDuration"}
  ID                       id-oa-pwdLockoutDuration }

pwdMaxFailures ATTRIBUTE ::= {
  WITH SYNTAX              INTEGER (1..MAX)
  EQUALITY MATCHING RULE   integerMatch
  ORDERING MATCHING RULE   integerOrderingMatch
  SINGLE VALUE             TRUE
  USAGE                    directoryOperation
  LDAP-SYNTAX              integer.&id
  LDAP-NAME                {"pwdMaxFailures"}
  ID                       id-oa-pwdMaxFailures }

pwdMaxTimeInHistory ATTRIBUTE ::= {
  WITH SYNTAX              INTEGER (1..MAX)
  EQUALITY MATCHING RULE   integerMatch
  ORDERING MATCHING RULE   integerOrderingMatch
  SINGLE VALUE             TRUE
  USAGE                    directoryOperation
  LDAP-SYNTAX              integer.&id
  LDAP-NAME                {"pwdMaxTimeInHistory"}
  ID                       id-oa-pwdMaxTimeInHistory }

pwdMinTimeInHistory ATTRIBUTE ::= {
  WITH SYNTAX              INTEGER (0..MAX)
  EQUALITY MATCHING RULE   integerMatch
  ORDERING MATCHING RULE   integerOrderingMatch
  SINGLE VALUE             TRUE
  USAGE                    directoryOperation
  LDAP-SYNTAX              integer.&id
  LDAP-NAME                {"pwdMinTimeInHistory"}
  ID                       id-oa-pwdMinTimeInHistory }

pwdHistorySlots ATTRIBUTE ::= {
  WITH SYNTAX              INTEGER (2..MAX)
  EQUALITY MATCHING RULE   integerMatch
  ORDERING MATCHING RULE   integerOrderingMatch
  SINGLE VALUE             TRUE
  USAGE                    directoryOperation
  LDAP-SYNTAX              integer.&id
  LDAP-NAME                {"pwdHistorySlots"}
  ID                       id-oa-pwdHistorySlots }

pwdRecentlyExpiredDuration ATTRIBUTE ::= {
  WITH SYNTAX              INTEGER (0..MAX)
  EQUALITY MATCHING RULE   integerMatch
  ORDERING MATCHING RULE   integerOrderingMatch
  SINGLE VALUE             TRUE
  USAGE                    directoryOperation
  LDAP-SYNTAX              integer.&id
  LDAP-NAME                {"pwdRecentlyExpiredDuration"}
  ID                       id-oa-pwdRecentlyExpiredDuration }

pwdEncAlg ATTRIBUTE ::= {
  WITH SYNTAX              PwdEncAlg
  EQUALITY MATCHING RULE   pwdEncAlgMatch
  SINGLE VALUE             TRUE
  USAGE                    directoryOperation
  LDAP-SYNTAX              pwdEncAlgDescription.&id
  LDAP-NAME                {"pwdEncAlg"}
  ID                       id-oa-pwdEncAlg }

PwdEncAlg ::= AlgorithmIdentifier{{SupportedAlgorithms}}

userPwdMatch MATCHING-RULE ::= {
  SYNTAX       UserPwd
  LDAP-SYNTAX  userPwdDescription.&id
  LDAP-NAME    {"userPwdMatch"}
  ID           id-mr-userPwdMatch }

pwdEncAlgMatch MATCHING-RULE ::= {
  SYNTAX       PwdEncAlg
  LDAP-SYNTAX  pwdEncAlgDescription.&id
  LDAP-NAME    {"pwdEncAlgMatch"}
  ID           id-mr-pwdEncAlgMatch }

userPwdHistoryMatch MATCHING-RULE ::= pwdHistoryMatch{userPwd,id-mr-userPwdHistoryMatch}

-- LDAP syntaxes defined by this Directory Specification

userPwdDescription SYNTAX-NAME ::= {
  LDAP-DESC         "User Password Description"
  DIRECTORY SYNTAX  UserPwd
  ID                id-asx-userPwdDescription }

pwdVocabularyDescription SYNTAX-NAME ::= {
  LDAP-DESC         "Password Vocabulary Description"
  DIRECTORY SYNTAX  PwdVocabulary
  ID                id-asx-pwdVocabularyDescription }

pwdAlphabetDescription SYNTAX-NAME ::= {
  LDAP-DESC         "Password Alphabet Description"
  DIRECTORY SYNTAX  PwdAlphabet
  ID                id-asx-pwdAlphabetDescription }

pwdEncAlgDescription SYNTAX-NAME ::= {
  LDAP-DESC         "Password Alphabet Description"
  DIRECTORY SYNTAX  PwdEncAlg
  ID                id-asx-pwdEncAlgDescription }

-- object identifier assignments

-- directory attributes

id-at-userPwd                    OBJECT IDENTIFIER ::= {id-at 85}

-- operational attributes --

id-oa-pwdStartTime               OBJECT IDENTIFIER ::= {id-oa 22}
id-oa-pwdExpiryTime              OBJECT IDENTIFIER ::= {id-oa 23}
id-oa-pwdEndTime                 OBJECT IDENTIFIER ::= {id-oa 24}
id-oa-pwdFails                   OBJECT IDENTIFIER ::= {id-oa 25}
id-oa-pwdFailureTime             OBJECT IDENTIFIER ::= {id-oa 26}
id-oa-pwdGracesUsed              OBJECT IDENTIFIER ::= {id-oa 27}
id-oa-userPwdHistory             OBJECT IDENTIFIER ::= {id-oa 28}
id-oa-userPwdRecentlyExpired     OBJECT IDENTIFIER ::= {id-oa 29}
id-oa-pwdModifyEntryAllowed      OBJECT IDENTIFIER ::= {id-oa 30}
id-oa-pwdChangeAllowed           OBJECT IDENTIFIER ::= {id-oa 31}
id-oa-pwdMaxAge                  OBJECT IDENTIFIER ::= {id-oa 32}
id-oa-pwdExpiryAge               OBJECT IDENTIFIER ::= {id-oa 33}
id-oa-pwdMinLength               OBJECT IDENTIFIER ::= {id-oa 34}
id-oa-pwdVocabulary              OBJECT IDENTIFIER ::= {id-oa 35}
id-oa-pwdAlphabet                OBJECT IDENTIFIER ::= {id-oa 36}
id-oa-pwdDictionaries            OBJECT IDENTIFIER ::= {id-oa 37}
id-oa-pwdExpiryWarning           OBJECT IDENTIFIER ::= {id-oa 38}
id-oa-pwdGraces                  OBJECT IDENTIFIER ::= {id-oa 39}
id-oa-pwdFailureDuration         OBJECT IDENTIFIER ::= {id-oa 40}
id-oa-pwdLockoutDuration         OBJECT IDENTIFIER ::= {id-oa 41}
id-oa-pwdMaxFailures             OBJECT IDENTIFIER ::= {id-oa 42}
id-oa-pwdMaxTimeInHistory        OBJECT IDENTIFIER ::= {id-oa 43}
id-oa-pwdMinTimeInHistory        OBJECT IDENTIFIER ::= {id-oa 44}
id-oa-pwdHistorySlots            OBJECT IDENTIFIER ::= {id-oa 45}
id-oa-pwdRecentlyExpiredDuration OBJECT IDENTIFIER ::= {id-oa 46}
id-oa-pwdEncAlg                  OBJECT IDENTIFIER ::= {id-oa 47}

-- matching rules

id-mr-userPwdMatch               OBJECT IDENTIFIER ::= {id-mr 71}
id-mr-userPwdHistoryMatch        OBJECT IDENTIFIER ::= {id-mr 72}
id-mr-pwdEncAlgMatch             OBJECT IDENTIFIER ::= {id-mr 73}

-- syntaxes

id-asx-userPwdDescription        OBJECT IDENTIFIER ::= {id-asx 0}
id-asx-pwdVocabularyDescription  OBJECT IDENTIFIER ::= {id-asx 1}
id-asx-pwdAlphabetDescription    OBJECT IDENTIFIER ::= {id-asx 2}
id-asx-pwdEncAlgDescription      OBJECT IDENTIFIER ::= {id-asx 3}

END -- Password policy

SelectedAttributeTypes {joint-iso-itu-t ds(5) module(1) selectedAttributeTypes(5) 9}
DEFINITIONS ::=
BEGIN

-- EXPORTS All
/*
The types and values defined in this module are exported for use in the other ASN.1
modules contained within the Directory Specifications, and for the use of other
applications which will use them to access Directory services. Other applications
may use them for their own purposes, but this will not constrain extensions and
modifications needed to maintain or improve the Directory service.
*/
IMPORTS

  -- from Rec. ITU-T X.501 | ISO/IEC 9594-2

  id-at, id-avc, id, id-asx, id-cat, id-coat, id-lmr, id-lsx, id-mr, id-not, id-pr
    FROM UsefulDefinitions
      {joint-iso-itu-t ds(5) module(1) usefulDefinitions(0) 9} WITH SUCCESSORS

  Attribute{}, ATTRIBUTE, AttributeType, AttributeValueAssertion, CONTEXT,
  ContextAssertion, DistinguishedName, distinguishedNameMatch,
  MAPPING-BASED-MATCHING{}, MATCHING-RULE, OBJECT-CLASS,
  objectIdentifierMatch, SubtreeSpecification, SupportedAttributes, SYNTAX-NAME
    FROM InformationFramework
      {joint-iso-itu-t ds(5) module(1) informationFramework(1) 9} WITH SUCCESSORS

  AttributeCombination, ContextCombination, MRMapping
    FROM ServiceAdministration
      {joint-iso-itu-t ds(5) module(1) serviceAdministration(33) 9} WITH SUCCESSORS

  AttributeTypeDescription, DITContentRuleDescription, DITStructureRuleDescription,
  MatchingRuleDescription, MatchingRuleUseDescription, NameFormDescription,
  ObjectClassDescription
    FROM SchemaAdministration
      {joint-iso-itu-t ds(5) module(1) schemaAdministration(23) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.509 | ISO/IEC 9594-8

  AlgorithmIdentifier{}, Certificate, CertificateList, CertificatePair,
  SupportedAlgorithm, SupportedAlgorithms
     FROM AuthenticationFramework
       {joint-iso-itu-t ds(5) module(1) authenticationFramework(7) 9} WITH SUCCESSORS

  G3FacsimileNonBasicParameters
    FROM PkiPmiExternalDataTypes
      {joint-iso-itu-t ds(5) module(1) pkiPmiExternalDataTypes(40) 9} WITH SUCCESSORS

 -- from Rec. ITU-T X.511 | ISO/IEC 9594-3

  FilterItem, HierarchySelections, SearchControlOptions, ServiceControlOptions
    FROM DirectoryAbstractService
      {joint-iso-itu-t ds(5) module(1) directoryAbstractService(2) 9} WITH SUCCESSORS

 -- from Rec. ITU-T X.520 | ISO/IEC 9594-6

  PwdAlphabet, PwdVocabulary, UserPwd
     FROM PasswordPolicy
       {joint-iso-itu-t ds(5) module(1) passwordPolicy(39) 9} WITH SUCCESSORS ;

/*from IETF RFC 3727

The following import is provided for information only (see clause 7.2.16), it is not
referenced by any ASN.1 construct within these Directory Specifications. Note that
the ASN.1 module in RFC 3727 imports from the InformationFramework module of edition
4 of Rec. ITU-T X.501 | ISO/IEC 9594-2. A specification importing from both these
Directory Specifications and from RFC 3727 should take corrective actions, e.g.,
by making a copy of the ASN.1 module of RFC 3727 and then update the IMPORT statement.

  allComponentsMatch, componentFilterMatch, directoryComponentsMatch, presentMatch, rdnMatch
    FROM ComponentMatching {iso(1) 2 36 79672281 xed(3) module (0) component-matching(4)} */

-- Directory string type

UnboundedDirectoryString ::= CHOICE {
  teletexString    TeletexString(SIZE (1..MAX)),
  printableString  PrintableString(SIZE (1..MAX)),
  bmpString        BMPString(SIZE (1..MAX)),
  universalString  UniversalString(SIZE (1..MAX)),
  uTF8String       UTF8String(SIZE (1..MAX)) }

DirectoryString{INTEGER:maxSize} ::= CHOICE {
  teletexString    TeletexString(SIZE (1..maxSize,...)),
  printableString  PrintableString(SIZE (1..maxSize,...)),
  bmpString        BMPString(SIZE (1..maxSize,...)),
  universalString  UniversalString(SIZE (1..maxSize,...)),
  uTF8String       UTF8String(SIZE (1..maxSize,...)) }

-- Attribute types

knowledgeInformation ATTRIBUTE ::= {
  WITH SYNTAX              UnboundedDirectoryString
  EQUALITY MATCHING RULE   caseIgnoreMatch
  OBSOLETE                 TRUE
  ID                       id-at-knowledgeInformation }

name ATTRIBUTE ::= {
  WITH SYNTAX              UnboundedDirectoryString
  EQUALITY MATCHING RULE   caseIgnoreMatch
  SUBSTRINGS MATCHING RULE caseIgnoreSubstringsMatch
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"name"}
  ID                       id-at-name }

commonName ATTRIBUTE ::= {
  SUBTYPE OF               name
  WITH SYNTAX              UnboundedDirectoryString
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"cn", "commonName"}
  ID                       id-at-commonName }

surname ATTRIBUTE ::= {
  SUBTYPE OF               name
  WITH SYNTAX              UnboundedDirectoryString
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"sn"}
  ID                       id-at-surname }

givenName ATTRIBUTE ::= {
  SUBTYPE OF               name
  WITH SYNTAX              UnboundedDirectoryString
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"givenName"}
  ID                       id-at-givenName }

initials ATTRIBUTE ::= {
  SUBTYPE OF               name
  WITH SYNTAX              UnboundedDirectoryString
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"initials"}
  ID                       id-at-initials }

generationQualifier ATTRIBUTE ::= {
  SUBTYPE OF               name
  WITH SYNTAX              UnboundedDirectoryString
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"generationQualifier"}
  ID                       id-at-generationQualifier }

uniqueIdentifier ATTRIBUTE ::= {
  WITH SYNTAX              UniqueIdentifier
  EQUALITY MATCHING RULE   bitStringMatch
  LDAP-SYNTAX              bitString.&id
  LDAP-NAME                {"x500UniqueIdentifier"}
  ID                       id-at-uniqueIdentifier }

UniqueIdentifier ::= BIT STRING

dnQualifier ATTRIBUTE ::= {
  WITH SYNTAX              PrintableString
  EQUALITY MATCHING RULE   caseIgnoreMatch
  ORDERING MATCHING RULE   caseIgnoreOrderingMatch
  SUBSTRINGS MATCHING RULE caseIgnoreSubstringsMatch
  LDAP-SYNTAX              printableString.&id
  LDAP-NAME                {"dnQualifier"}
  ID                       id-at-dnQualifier }

serialNumber ATTRIBUTE ::= {
  WITH SYNTAX              PrintableString(SIZE (1..MAX))
  EQUALITY MATCHING RULE   caseIgnoreMatch
  SUBSTRINGS MATCHING RULE caseIgnoreSubstringsMatch
  LDAP-SYNTAX              printableString.&id
  LDAP-NAME                {"serialNumber"}
  ID                       id-at-serialNumber }

pseudonym ATTRIBUTE ::= {
  SUBTYPE OF              name
  WITH SYNTAX             UnboundedDirectoryString
  ID                      id-at-pseudonym }

uUIDPair ATTRIBUTE ::= {
  WITH SYNTAX             UUIDPair
  EQUALITY MATCHING RULE  uUIDPairMatch
  ID                      id-at-uuidpair }

UUIDPair ::= SEQUENCE {
  issuerUUID   UUID,
  subjectUUID  UUID,
  ... }

UUID ::= OCTET STRING(SIZE (16)) -- UUID format only

uri ATTRIBUTE ::= {
  WITH SYNTAX              URI
  EQUALITY MATCHING RULE   uriMatch
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"uri"}
  ID                       id-at-uri }

URI ::= UTF8String

urn ATTRIBUTE ::= {
  SUBTYPE OF               uri
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"urn"}
  ID                       id-at-urn }

url ATTRIBUTE ::= {
  SUBTYPE OF               uri
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"url"}
  ID                       id-at-url }

dnsName ATTRIBUTE ::= {
  WITH SYNTAX             DomainName
  EQUALITY MATCHING RULE  dnsNameMatch
  LDAP-SYNTAX             dnsString.&id
  LDAP-NAME               {"DNS name"}
  ID                      id-at-dnsName }

DomainName ::= UTF8String (CONSTRAINED BY { -- Conforms to the format of a domain name. -- })

intEmail ATTRIBUTE ::= {
  WITH SYNTAX             IntEmail
  EQUALITY MATCHING RULE  intEmailMatch
  SINGLE VALUE            TRUE
  LDAP-SYNTAX             intEmailString.&id
  LDAP-NAME               {"Internationalized Email"}
  ID                      id-at-intEmail }

IntEmail ::= UTF8String (CONSTRAINED BY { -- Conforms to the format of an (internationalized) email address. -- })

jid ATTRIBUTE ::= {
  WITH SYNTAX             Jid
  EQUALITY MATCHING RULE  jidMatch
  SINGLE VALUE            TRUE
  LDAP-SYNTAX             jidString.&id
  LDAP-NAME               {"Jabber identifier"}
  ID                      id-at-jid }

Jid ::= UTF8String (CONSTRAINED BY { /* Conforms to the format of a jabber identifier. */ })

objectIdentifier ATTRIBUTE ::= {
  WITH SYNTAX             OBJECT IDENTIFIER
  EQUALITY MATCHING RULE  objectIdentifierMatch
  SINGLE VALUE            TRUE
  LDAP-SYNTAX             oid.&id
  LDAP-NAME               {"Object Identifier"}
  ID                      id-at-objectIdentifier }

countryName ATTRIBUTE ::= {
  SUBTYPE OF               name
  WITH SYNTAX              CountryName
  SINGLE VALUE             TRUE
  LDAP-SYNTAX              countryString.&id
  LDAP-NAME                {"c"}
  ID                       id-at-countryName }

CountryName ::= PrintableString(SIZE (2)) (CONSTRAINED BY { -- ISO 3166 alpha-2 codes only -- })

countryCode3c ATTRIBUTE ::= {
  SUBTYPE OF               name
  WITH SYNTAX              CountryCode3c
  SINGLE VALUE             TRUE
  LDAP-SYNTAX              countryString3c.&id
  LDAP-NAME                {"c3"}
  ID                       id-at-countryCode3c }

CountryCode3c ::= PrintableString(SIZE (3)) (CONSTRAINED BY { -- ISO 3166 alpha-3 codes only -- })

countryCode3n ATTRIBUTE ::= {
  SUBTYPE OF               name
  WITH SYNTAX              CountryCode3n
  SINGLE VALUE             TRUE
  LDAP-SYNTAX              countryString3n.&id
  LDAP-NAME                {"n3"}
  ID                       id-at-countryCode3n }

CountryCode3n ::= NumericString(SIZE (3)) (CONSTRAINED BY { -- ISO 3166 numeric-3 codes only -- })

localityName ATTRIBUTE ::= {
  SUBTYPE OF               name
  WITH SYNTAX              UnboundedDirectoryString
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"l"}
  ID                       id-at-localityName }

collectiveLocalityName ATTRIBUTE ::= {
  SUBTYPE OF              localityName
  COLLECTIVE              TRUE
  LDAP-SYNTAX             directoryString.&id
  LDAP-NAME               {"c-l"}
  ID                      id-at-collectiveLocalityName }

stateOrProvinceName ATTRIBUTE ::= {
  SUBTYPE OF               name
  WITH SYNTAX              UnboundedDirectoryString
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"st"}
  ID                       id-at-stateOrProvinceName }

collectiveStateOrProvinceName ATTRIBUTE ::= {
  SUBTYPE OF               stateOrProvinceName
  COLLECTIVE               TRUE
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"c-st"}
  ID                       id-at-collectiveStateOrProvinceName }

streetAddress ATTRIBUTE ::= {
  WITH SYNTAX              UnboundedDirectoryString
  EQUALITY MATCHING RULE   caseIgnoreMatch
  SUBSTRINGS MATCHING RULE caseIgnoreSubstringsMatch
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"street"}
  ID                       id-at-streetAddress }

collectiveStreetAddress ATTRIBUTE ::= {
  SUBTYPE OF               streetAddress
  COLLECTIVE               TRUE
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"c-street"}
  ID                       id-at-collectiveStreetAddress }

houseIdentifier ATTRIBUTE ::= {
  WITH SYNTAX              UnboundedDirectoryString
  EQUALITY MATCHING RULE   caseIgnoreMatch
  SUBSTRINGS MATCHING RULE caseIgnoreSubstringsMatch
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"houseIdentifier"}
  ID                       id-at-houseIdentifier }

utmCoordinates  ATTRIBUTE  ::=  {
  WITH SYNTAX              UtmCoordinates
  SINGLE VALUE             TRUE
  LDAP-SYNTAX              utmCoords.&id
  LDAP-NAME                {"utmCoordinates"}
  ID                       id-at-utmCoordinates }

UtmCoordinates ::= SEQUENCE {
  zone      PrintableString,
  easting   NumericString,
  northing  NumericString }

organizationName ATTRIBUTE ::= {
  SUBTYPE OF               name
  WITH SYNTAX              UnboundedDirectoryString
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"o"}
  ID                       id-at-organizationName }

collectiveOrganizationName ATTRIBUTE ::= {
  SUBTYPE OF               organizationName
  COLLECTIVE               TRUE
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"c-o"}
  ID                       id-at-collectiveOrganizationName }

organizationalUnitName ATTRIBUTE ::= {
  SUBTYPE OF               name
  WITH SYNTAX              UnboundedDirectoryString
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"ou"}
  ID                       id-at-organizationalUnitName }

collectiveOrganizationalUnitName ATTRIBUTE ::= {
  SUBTYPE OF               organizationalUnitName
  COLLECTIVE               TRUE
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"c-ou"}
  ID                       id-at-collectiveOrganizationalUnitName }

title ATTRIBUTE ::= {
  SUBTYPE OF               name
  WITH SYNTAX              UnboundedDirectoryString
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"title"}
  ID                       id-at-title }

organizationIdentifier ATTRIBUTE ::= {
  WITH SYNTAX              UnboundedDirectoryString
  EQUALITY MATCHING RULE   caseIgnoreMatch
  SUBSTRINGS MATCHING RULE caseIgnoreSubstringsMatch
  SINGLE VALUE             TRUE
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"organizationIdentifier"}
  ID                       id-at-organizationIdentifier }

description ATTRIBUTE ::= {
  WITH SYNTAX              UnboundedDirectoryString
  EQUALITY MATCHING RULE   caseIgnoreMatch
  SUBSTRINGS MATCHING RULE caseIgnoreSubstringsMatch
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"description"}
  ID                       id-at-description }

searchGuide ATTRIBUTE ::= {
  WITH SYNTAX              Guide
  LDAP-SYNTAX              guide.&id
  LDAP-NAME                {"searchGuide"}
  ID                       id-at-searchGuide }

Guide ::= SET {
  objectClass  [0]  OBJECT-CLASS.&id OPTIONAL,
  criteria     [1]  Criteria,
  ... }

Criteria ::= CHOICE {
  type  [0]  CriteriaItem,
  and   [1]  SET OF Criteria,
  or    [2]  SET OF Criteria,
  not   [3]  Criteria,
  ... }

CriteriaItem ::= CHOICE {
  equality          [0]  AttributeType,
  substrings        [1]  AttributeType,
  greaterOrEqual    [2]  AttributeType,
  lessOrEqual       [3]  AttributeType,
  approximateMatch  [4]  AttributeType,
  ... }

enhancedSearchGuide ATTRIBUTE ::= {
  WITH SYNTAX              EnhancedGuide
  LDAP-SYNTAX              enhancedGuide.&id
  LDAP-NAME                {"enhancedSearchGuide"}
  ID                       id-at-enhancedSearchGuide }

EnhancedGuide ::= SEQUENCE {
  objectClass  [0]  OBJECT-CLASS.&id,
  criteria     [1]  Criteria,
  subset       [2]  INTEGER {
    baseObject   (0),
    oneLevel     (1),
    wholeSubtree (2)} DEFAULT oneLevel,
  ... }

businessCategory ATTRIBUTE ::= {
  WITH SYNTAX              UnboundedDirectoryString
  EQUALITY MATCHING RULE   caseIgnoreMatch
  SUBSTRINGS MATCHING RULE caseIgnoreSubstringsMatch
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"businessCategory"}
  ID                       id-at-businessCategory }

postalAddress ATTRIBUTE ::= {
  WITH SYNTAX              PostalAddress
  EQUALITY MATCHING RULE   caseIgnoreListMatch
  SUBSTRINGS MATCHING RULE caseIgnoreListSubstringsMatch
  LDAP-SYNTAX              postalAddr.&id
  LDAP-NAME                {"postalAddress"}
  ID                       id-at-postalAddress }

PostalAddress ::= SEQUENCE SIZE (1..MAX) OF UnboundedDirectoryString

collectivePostalAddress ATTRIBUTE ::= {
  SUBTYPE OF               postalAddress
  COLLECTIVE               TRUE
  LDAP-SYNTAX              postalAddr.&id
  LDAP-NAME                {"c-PostalAddress"}
  ID                       id-at-collectivePostalAddress }

postalCode ATTRIBUTE ::= {
  WITH SYNTAX              UnboundedDirectoryString
  EQUALITY MATCHING RULE   caseIgnoreMatch
  SUBSTRINGS MATCHING RULE caseIgnoreSubstringsMatch
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"postalCode"}
  ID                       id-at-postalCode }

collectivePostalCode ATTRIBUTE ::= {
  SUBTYPE OF               postalCode
  COLLECTIVE               TRUE
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"c-PostalCode"}
  ID                       id-at-collectivePostalCode }

postOfficeBox ATTRIBUTE ::= {
  WITH SYNTAX              UnboundedDirectoryString
  EQUALITY MATCHING RULE   caseIgnoreMatch
  SUBSTRINGS MATCHING RULE caseIgnoreSubstringsMatch
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"postOfficeBox"}
  ID                       id-at-postOfficeBox }

collectivePostOfficeBox ATTRIBUTE ::= {
  SUBTYPE OF               postOfficeBox
  COLLECTIVE               TRUE
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"c-PostOfficeBox"}
  ID                       id-at-collectivePostOfficeBox }

physicalDeliveryOfficeName ATTRIBUTE ::= {
  WITH SYNTAX              UnboundedDirectoryString
  EQUALITY MATCHING RULE   caseIgnoreMatch
  SUBSTRINGS MATCHING RULE caseIgnoreSubstringsMatch
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"physicalDeliveryOfficeName"}
  ID                       id-at-physicalDeliveryOfficeName }

collectivePhysicalDeliveryOfficeName ATTRIBUTE ::= {
  SUBTYPE OF               physicalDeliveryOfficeName
  COLLECTIVE               TRUE
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"c-PhysicalDeliveryOfficeName"}
  ID                       id-at-collectivePhysicalDeliveryOfficeName }

telephoneNumber ATTRIBUTE ::= {
  WITH SYNTAX              TelephoneNumber
  EQUALITY MATCHING RULE   telephoneNumberMatch
  SUBSTRINGS MATCHING RULE telephoneNumberSubstringsMatch
  LDAP-SYNTAX              printableString.&id
  LDAP-NAME                {"telephoneNumber"}
  ID                       id-at-telephoneNumber }

TelephoneNumber ::= PrintableString(SIZE (1..ub-telephone-number))
-- String complying with Rec. ITU-T E.123 only

ub-telephone-number INTEGER ::= 32

collectiveTelephoneNumber ATTRIBUTE ::= {
  SUBTYPE OF               telephoneNumber
  COLLECTIVE               TRUE
  LDAP-SYNTAX              printableString.&id
  LDAP-NAME                {"c-TelephoneNumber"}
  ID                       id-at-collectiveTelephoneNumber }

telexNumber ATTRIBUTE ::= {
  WITH SYNTAX              TelexNumber
  LDAP-SYNTAX              telexNr.&id
  LDAP-NAME                {"telexNumber"}
  ID                       id-at-telexNumber }

TelexNumber ::= SEQUENCE {
  telexNumber  PrintableString(SIZE (1..ub-telex-number)),
  countryCode  PrintableString(SIZE (1..ub-country-code)),
  answerback   PrintableString(SIZE (1..ub-answerback)),
  ... }

ub-telex-number INTEGER ::= 14
ub-country-code INTEGER ::= 4
ub-answerback   INTEGER ::= 8

collectiveTelexNumber ATTRIBUTE ::= {
  SUBTYPE OF               telexNumber
  COLLECTIVE               TRUE
  LDAP-SYNTAX              telexNr.&id
  LDAP-NAME                {"c-TelexNumber"}
  ID                       id-at-collectiveTelexNumber }

facsimileTelephoneNumber ATTRIBUTE ::= {
  WITH SYNTAX              FacsimileTelephoneNumber
  EQUALITY MATCHING RULE   facsimileNumberMatch
  SUBSTRINGS MATCHING RULE facsimileNumberSubstringsMatch
  LDAP-SYNTAX              facsimileTelephoneNr.&id
  LDAP-NAME                {"facsimileTelephoneNumber"}
  ID                       id-at-facsimileTelephoneNumber }

FacsimileTelephoneNumber ::= SEQUENCE {
  telephoneNumber  TelephoneNumber,
  parameters       G3FacsimileNonBasicParameters OPTIONAL,
  ... }

collectiveFacsimileTelephoneNumber ATTRIBUTE ::= {
  SUBTYPE OF               facsimileTelephoneNumber
  COLLECTIVE               TRUE
  LDAP-SYNTAX              facsimileTelephoneNr.&id
  LDAP-NAME                {"c-FacsimileTelephoneNumber"}
  ID                       id-at-collectiveFacsimileTelephoneNumber }

x121Address ATTRIBUTE ::= {
  WITH SYNTAX              X121Address
  EQUALITY MATCHING RULE   numericStringMatch
  SUBSTRINGS MATCHING RULE numericStringSubstringsMatch
  LDAP-SYNTAX              numericString.&id
  LDAP-NAME                {"x121Address"}
  ID                       id-at-x121Address }

X121Address ::= NumericString(SIZE (1..ub-x121-address))
-- String as defined by Rec. ITU-T X.121

ub-x121-address INTEGER ::= 15

internationalISDNNumber ATTRIBUTE ::= {
  WITH SYNTAX              InternationalISDNNumber
  EQUALITY MATCHING RULE   numericStringMatch
  SUBSTRINGS MATCHING RULE numericStringSubstringsMatch
  LDAP-SYNTAX              numericString.&id
  LDAP-NAME                {"internationalISDNNumber"}
  ID                       id-at-internationalISDNNumber }

InternationalISDNNumber ::=
  NumericString(SIZE (1..ub-international-isdn-number))
-- String complying with Rec. ITU-T E.164 only

ub-international-isdn-number INTEGER ::= 16

collectiveInternationalISDNNumber ATTRIBUTE ::= {
  SUBTYPE OF               internationalISDNNumber
  COLLECTIVE               TRUE
  LDAP-SYNTAX              numericString.&id
  LDAP-NAME                {"c-InternationalISDNNumber"}
  ID                       id-at-collectiveInternationalISDNNumber }

registeredAddress ATTRIBUTE ::= {
  SUBTYPE OF               postalAddress
  WITH SYNTAX              PostalAddress
  LDAP-SYNTAX              postalAddr.&id
  LDAP-NAME                {"registeredAddress"}
  ID                       id-at-registeredAddress }

destinationIndicator ATTRIBUTE ::= {
  WITH SYNTAX              DestinationIndicator
  EQUALITY MATCHING RULE   caseIgnoreMatch
  SUBSTRINGS MATCHING RULE caseIgnoreSubstringsMatch
  LDAP-SYNTAX              printableString.&id
  LDAP-NAME                {"destinationIndicator"}
  ID                       id-at-destinationIndicator }

DestinationIndicator ::= PrintableString(SIZE (1..MAX))
-- alphabetical characters only

communicationsService ATTRIBUTE ::= {
  WITH SYNTAX              CommunicationsService
  EQUALITY MATCHING RULE   objectIdentifierMatch
  LDAP-SYNTAX              oid.&id
  LDAP-NAME                {"communicationsService"}
  ID                       id-at-communicationsService }

CommunicationsService ::= OBJECT IDENTIFIER

communicationsNetwork ATTRIBUTE ::= {
  WITH SYNTAX              CommunicationsNetwork
  EQUALITY MATCHING RULE   objectIdentifierMatch
  SINGLE VALUE             TRUE
  LDAP-SYNTAX              oid.&id
  LDAP-NAME                {"communicationsNetwork"}
  ID                       id-at-communicationsNetwork }

CommunicationsNetwork ::= OBJECT IDENTIFIER

preferredDeliveryMethod ATTRIBUTE ::= {
  WITH SYNTAX              PreferredDeliveryMethod
  SINGLE VALUE             TRUE
  LDAP-SYNTAX              deliveryMethod.&id
  LDAP-NAME                {"preferredDeliveryMethod"}
  ID                       id-at-preferredDeliveryMethod }

PreferredDeliveryMethod ::= SEQUENCE OF INTEGER {
  any-delivery-method   (0),
  mhs-delivery          (1),
  physical-delivery     (2),
  telex-delivery        (3),
  teletex-delivery      (4),
  g3-facsimile-delivery (5),
  g4-facsimile-delivery (6),
  ia5-terminal-delivery (7),
  videotex-delivery     (8),
  telephone-delivery    (9) }

presentationAddress ATTRIBUTE ::= {
  WITH SYNTAX              PresentationAddress
  EQUALITY MATCHING RULE   presentationAddressMatch
  SINGLE VALUE             TRUE
  LDAP-SYNTAX              presentationAddr.&id
  LDAP-NAME                {"presentationAddress"}
  ID                       id-at-presentationAddress }

PresentationAddress ::= SEQUENCE {
  pSelector   [0]  OCTET STRING OPTIONAL,
  sSelector   [1]  OCTET STRING OPTIONAL,
  tSelector   [2]  OCTET STRING OPTIONAL,
  nAddresses  [3]  SET SIZE (1..MAX) OF OCTET STRING,
  ... }

supportedApplicationContext ATTRIBUTE ::= {
  WITH SYNTAX              OBJECT IDENTIFIER
  EQUALITY MATCHING RULE   objectIdentifierMatch
  LDAP-SYNTAX              oid.&id
  LDAP-NAME                {"supportedApplicationContext"}
  ID                       id-at-supportedApplicationContext }

protocolInformation ATTRIBUTE ::= {
  WITH SYNTAX              ProtocolInformation
  EQUALITY MATCHING RULE   protocolInformationMatch
  ID                       id-at-protocolInformation }

ProtocolInformation ::= SEQUENCE {
  nAddress  OCTET STRING,
  profiles  SET OF OBJECT IDENTIFIER }

distinguishedName ATTRIBUTE ::= {
  WITH SYNTAX              DistinguishedName
  EQUALITY MATCHING RULE   distinguishedNameMatch
  LDAP-SYNTAX              dn.&id
  LDAP-NAME                {"distinguishedName"}
  ID                       id-at-distinguishedName }

member ATTRIBUTE ::= {
  SUBTYPE OF               distinguishedName
  LDAP-SYNTAX              dn.&id
  LDAP-NAME                {"member"}
  ID                       id-at-member }

uniqueMember ATTRIBUTE ::= {
  WITH SYNTAX              NameAndOptionalUID
  EQUALITY MATCHING RULE   uniqueMemberMatch
  LDAP-SYNTAX              nameAndOptionalUID.&id
  LDAP-NAME                {"uniqueMember"}
  ID                       id-at-uniqueMember }

NameAndOptionalUID ::= SEQUENCE {
  dn   DistinguishedName,
  uid  UniqueIdentifier OPTIONAL,
  ... }

owner ATTRIBUTE ::= {
  SUBTYPE OF               distinguishedName
  LDAP-SYNTAX              dn.&id
  LDAP-NAME                {"owner"}
  ID                       id-at-owner }

roleOccupant ATTRIBUTE ::= {
  SUBTYPE OF               distinguishedName
  LDAP-SYNTAX              dn.&id
  LDAP-NAME                {"roleOccupant"}
  ID                       id-at-roleOccupant }

seeAlso ATTRIBUTE ::= {
  SUBTYPE OF               distinguishedName
  LDAP-SYNTAX              dn.&id
  LDAP-NAME                {"seeAlso"}
  ID                       id-at-seeAlso }

dmdName ATTRIBUTE ::= {
  SUBTYPE OF               name
  WITH SYNTAX              UnboundedDirectoryString
  ID                       id-at-dmdName }

--  Hierarchical attribute types

oidC1 ATTRIBUTE ::= {
  WITH SYNTAX              INTEGER
  EQUALITY MATCHING RULE   integerMatch
  SINGLE VALUE             TRUE
  ID                       id-oidC1 }

oidC2 ATTRIBUTE ::= {
  WITH SYNTAX              INTEGER
  EQUALITY MATCHING RULE   integerMatch
  SINGLE VALUE             TRUE
  ID                       id-oidC2 }

oidC ATTRIBUTE ::= {
  WITH SYNTAX              INTEGER
  EQUALITY MATCHING RULE   integerMatch
  SINGLE VALUE             TRUE
  ID                       id-oidC }

urnC ATTRIBUTE ::= {
  WITH SYNTAX              PrintableString
  EQUALITY MATCHING RULE   caseExactMatch
  SINGLE VALUE             TRUE
  LDAP-SYNTAX              printableString.&id
  LDAP-NAME                {"urnC"}
  ID                       id-at-urnC }

--  Attribute types for tag-based identification

tagOid ATTRIBUTE ::= {
  WITH SYNTAX              OBJECT IDENTIFIER
  EQUALITY MATCHING RULE   objectIdentifierMatch
  SINGLE VALUE             TRUE
  LDAP-SYNTAX              oid.&id
  LDAP-NAME                {"tagOid"}
  ID                       id-at-tagOid }

uiiFormat ATTRIBUTE ::= {
  WITH SYNTAX              UiiFormat
  SINGLE VALUE             TRUE
  LDAP-SYNTAX              uiiForm.&id
  LDAP-NAME                {"uiiFormat"}
  ID                       id-at-uiiFormat }

UiiFormat ::= SEQUENCE {
  baseObject  URI  OPTIONAL,
  subset      ENUMERATED {
    baseObject   (0),
    oneLevel     (1),
    wholeSubtree (2) } DEFAULT baseObject,
  next        CHOICE {
    length      INTEGER,
    filter      UiiFilter } }

UiiFilter ::= CHOICE {
  item  [0]  UiiItem,
  and   [1]  SET OF UiiFilter,
  or    [2]  SET OF UiiFilter,
  not   [3]  UiiFilter }

UiiItem ::= SEQUENCE {
  type   ATTRIBUTE.&id,
  length INTEGER OPTIONAL }

uiiInUrn ATTRIBUTE ::= {
  WITH SYNTAX              UTF8String
  EQUALITY MATCHING RULE   caseExactMatch
  SINGLE VALUE             TRUE
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"uiiInUrn"}
  ID                       id-at-uiiInUrn }

contentUrl ATTRIBUTE ::= {
  SUBTYPE OF               url
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"contentUrl"}
  ID                       id-at-contentUrl }

uii ATTRIBUTE ::= {
  WITH SYNTAX              BIT STRING
  EQUALITY MATCHING RULE   bitStringMatch
  LDAP-SYNTAX              bitString.&id
  LDAP-NAME                {"uii"}
  ID                       id-at-uii }

epc ATTRIBUTE ::= {
  WITH SYNTAX              BIT STRING
  EQUALITY MATCHING RULE   bitStringMatch
  LDAP-SYNTAX              bitString.&id
  LDAP-NAME                {"epc"}
  ID                       id-at-epc }

tagAfi ATTRIBUTE ::= {
  WITH SYNTAX              OCTET STRING
  EQUALITY MATCHING RULE   octetStringMatch
  LDAP-SYNTAX              octetString.&id
  LDAP-NAME                {"tagAfi"}
  ID                       id-at-tagAfi }

epcFormat  ATTRIBUTE  ::=  {
  WITH SYNTAX              EpcFormat
  SINGLE VALUE             TRUE
  LDAP-SYNTAX              epcForm.&id
  LDAP-NAME                {"epcFormat"}
  ID                       id-at-epcFormat }

EpcFormat ::= SEQUENCE {
  fields          SEQUENCE SIZE (1..MAX) OF SEQUENCE {
    bits            INTEGER,
    charField       CHOICE {
      characters  [0] INTEGER,
      maxValue    [1] INTEGER },
    result          ENUMERATED {
      numericPad     (0),
      numeric        (1),
      alpha7bits     (2) } DEFAULT numericPad },
  digitShift  [0] INTEGER                        OPTIONAL,
  checkCalc   [1] INTEGER                        OPTIONAL,
  urnPrefix       UTF8String                     OPTIONAL }

epcInUrn ATTRIBUTE ::= {
  SUBTYPE OF               urn
  SINGLE VALUE             TRUE
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"epcInUrn"}
  ID                       id-at-epcInUrn }

ldapUrl ATTRIBUTE ::= {
  SUBTYPE OF               url
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"ldapUrl"}
  ID                       id-at-ldapUrl }

tagLocation ATTRIBUTE ::= {
  SUBTYPE OF               utmCoordinates
  SINGLE VALUE             TRUE
  LDAP-SYNTAX              utmCoords.&id
  LDAP-NAME                {"tagLocation"}
  ID                       id-at-tagLocation }

-- Notification attributes

dSAProblem ATTRIBUTE ::= {
  WITH SYNTAX              OBJECT IDENTIFIER
  EQUALITY MATCHING RULE   objectIdentifierMatch
  ID                       id-not-dSAProblem }

searchServiceProblem ATTRIBUTE ::= {
  WITH SYNTAX              OBJECT IDENTIFIER
  EQUALITY MATCHING RULE   objectIdentifierMatch
  SINGLE VALUE             TRUE
  ID                       id-not-searchServiceProblem }

serviceType ATTRIBUTE ::= {
  WITH SYNTAX              OBJECT IDENTIFIER
  EQUALITY MATCHING RULE   objectIdentifierMatch
  SINGLE VALUE             TRUE
  ID                       id-not-serviceType }

attributeTypeList ATTRIBUTE ::= {
  WITH SYNTAX              OBJECT IDENTIFIER
  EQUALITY MATCHING RULE   objectIdentifierMatch
  ID                       id-not-attributeTypeList }

matchingRuleList ATTRIBUTE ::= {
  WITH SYNTAX              OBJECT IDENTIFIER
  EQUALITY MATCHING RULE   objectIdentifierMatch
  ID                       id-not-matchingRuleList }

filterItem ATTRIBUTE ::= {
  WITH SYNTAX              FilterItem
  ID                       id-not-filterItem }

attributeCombinations ATTRIBUTE ::= {
  WITH SYNTAX              AttributeCombination
  ID                       id-not-attributeCombinations }

contextTypeList ATTRIBUTE ::= {
  WITH SYNTAX              OBJECT IDENTIFIER
  EQUALITY MATCHING RULE   objectIdentifierMatch
  ID                       id-not-contextTypeList }

contextList ATTRIBUTE ::= {
  WITH SYNTAX              ContextAssertion
  ID                       id-not-contextList }

contextCombinations ATTRIBUTE ::= {
  WITH SYNTAX              ContextCombination
  ID                       id-not-contextCombinations }

hierarchySelectList ATTRIBUTE ::= {
  WITH SYNTAX              HierarchySelections
  SINGLE VALUE             TRUE
  ID                       id-not-hierarchySelectList }

searchControlOptionsList ATTRIBUTE ::= {
  WITH SYNTAX              SearchControlOptions
  SINGLE VALUE             TRUE
  ID                       id-not-searchControlOptionsList }

serviceControlOptionsList ATTRIBUTE ::= {
  WITH SYNTAX              ServiceControlOptions
  SINGLE VALUE             TRUE
  ID                       id-not-serviceControlOptionsList }

multipleMatchingLocalities ATTRIBUTE ::= {
  WITH SYNTAX              MultipleMatchingLocalities
  ID                       id-not-multipleMatchingLocalities }

MultipleMatchingLocalities ::= SEQUENCE {
  matchingRuleUsed  MATCHING-RULE.&id OPTIONAL,
  attributeList     SEQUENCE OF AttributeValueAssertion,
  ... }

proposedRelaxation ATTRIBUTE ::= {
  WITH SYNTAX              MRMappings
  ID                       id-not-proposedRelaxation }

MRMappings ::= SEQUENCE OF MRMapping

appliedRelaxation ATTRIBUTE ::= {
  WITH SYNTAX              OBJECT IDENTIFIER
  EQUALITY MATCHING RULE   objectIdentifierMatch
  ID                       id-not-appliedRelaxation }

pwdResponseValue ATTRIBUTE ::= {
  WITH SYNTAX              PwdResponse
  ID                       id-not-pwdResponse }

PwdResponse ::= SEQUENCE {
  warning CHOICE {
    timeleft        [0] INTEGER(0..MAX),
    graceRemaining  [1] INTEGER(0..MAX),
    ... } OPTIONAL,
  error ENUMERATED {
    passwordExpired  (0),
    changeAfterReset (1),
    ... } OPTIONAL}

ldapDiagnosticMsg ATTRIBUTE ::= {
  WITH SYNTAX              UTF8String
  SINGLE VALUE             TRUE
  ID                       id-not-ldapDiagnosticMsg }

-- LDAP defined attribute types

uid ATTRIBUTE ::= {
  WITH SYNTAX              UnboundedDirectoryString
  EQUALITY MATCHING RULE   caseIgnoreMatch
  SUBSTRINGS MATCHING RULE caseIgnoreSubstringsMatch
  LDAP-SYNTAX              directoryString.&id
  LDAP-NAME                {"uid"}
  ID                       id-coat-uid }

dc ATTRIBUTE ::= {
  WITH SYNTAX              IA5String
  EQUALITY MATCHING RULE   caseIgnoreMatch
  SUBSTRINGS MATCHING RULE caseIgnoreSubstringsMatch
  LDAP-SYNTAX              ia5String.&id
  LDAP-NAME                {"dc"}
  ID                       id-coat-dc }

-- Matching rules

caseExactMatch MATCHING-RULE ::= {
  SYNTAX       UnboundedDirectoryString
  LDAP-SYNTAX  directoryString.&id
  LDAP-NAME    {"caseExactMatch"}
  ID           id-mr-caseExactMatch }

caseIgnoreMatch MATCHING-RULE ::= {
  SYNTAX       UnboundedDirectoryString
  LDAP-SYNTAX  directoryString.&id
  LDAP-NAME    {"caseIgnoreMatch"}
  ID           id-mr-caseIgnoreMatch }

caseExactOrderingMatch MATCHING-RULE ::= {
  SYNTAX       UnboundedDirectoryString
  LDAP-SYNTAX  directoryString.&id
  LDAP-NAME    {"caseExactOrderingMatch"}
  ID           id-mr-caseExactOrderingMatch }

caseIgnoreOrderingMatch MATCHING-RULE ::= {
  SYNTAX       UnboundedDirectoryString
  LDAP-SYNTAX  directoryString.&id
  LDAP-NAME    {"caseIgnoreOrderingMatch"}
  ID           id-mr-caseIgnoreOrderingMatch }

caseExactSubstringsMatch MATCHING-RULE ::= {
  SYNTAX       SubstringAssertion -- only the PrintableString choice
  LDAP-SYNTAX  substringAssertion.&id
  LDAP-NAME    {"caseExactSubstringsMatch"}
  ID           id-mr-caseExactSubstringsMatch }

caseIgnoreSubstringsMatch MATCHING-RULE ::= {
  SYNTAX       SubstringAssertion
  LDAP-SYNTAX  substringAssertion.&id
  LDAP-NAME    {"caseIgnoreSubstringsMatch"}
  ID           id-mr-caseIgnoreSubstringsMatch }

SubstringAssertion ::= SEQUENCE OF CHOICE {
  initial  [0]  UnboundedDirectoryString,
  any      [1]  UnboundedDirectoryString,
  final    [2]  UnboundedDirectoryString,
    -- at most one initial and one final component
  control       Attribute{{SupportedAttributes}},
    -- Used to specify interpretation of the following items
  ... }

numericStringMatch MATCHING-RULE ::= {
  SYNTAX       NumericString
  LDAP-SYNTAX  numericString.&id
  LDAP-NAME    {"numericStringMatch"}
  ID           id-mr-numericStringMatch }

numericStringOrderingMatch MATCHING-RULE ::= {
  SYNTAX       NumericString
  LDAP-SYNTAX  numericString.&id
  LDAP-NAME    {"numericStringOrderingMatch"}
  ID           id-mr-numericStringOrderingMatch }

numericStringSubstringsMatch MATCHING-RULE ::= {
  SYNTAX       SubstringAssertion
  LDAP-SYNTAX  substringAssertion.&id
  LDAP-NAME    {"numericStringSubstringsMatch"}
  ID           id-mr-numericStringSubstringsMatch }

caseIgnoreListMatch MATCHING-RULE ::= {
  SYNTAX       CaseIgnoreList
  LDAP-SYNTAX  postalAddr.&id
  LDAP-NAME    {"caseIgnoreListMatch"}
  ID           id-mr-caseIgnoreListMatch }

CaseIgnoreList ::= SEQUENCE OF UnboundedDirectoryString

caseIgnoreListSubstringsMatch MATCHING-RULE ::= {
  SYNTAX       SubstringAssertion
  LDAP-SYNTAX  substringAssertion.&id
  LDAP-NAME    {"caseIgnoreListSubstringsMatch"}
  ID           id-mr-caseIgnoreListSubstringsMatch }

storedPrefixMatch MATCHING-RULE ::= {
  SYNTAX       UnboundedDirectoryString
  ID           id-mr-storedPrefixMatch }

booleanMatch MATCHING-RULE ::= {
  SYNTAX       BOOLEAN
  LDAP-SYNTAX  bitString.&id
  LDAP-NAME    {"booleanMatch"}
  ID           id-mr-booleanMatch }

integerMatch MATCHING-RULE ::= {
  SYNTAX       INTEGER
  LDAP-SYNTAX  integer.&id
  LDAP-NAME    {"integerMatch"}
  ID           id-mr-integerMatch }

integerOrderingMatch MATCHING-RULE ::= {
  SYNTAX       INTEGER
  LDAP-SYNTAX  integer.&id
  LDAP-NAME    {"integerOrderingMatch"}
  ID           id-mr-integerOrderingMatch }

bitStringMatch MATCHING-RULE ::= {
  SYNTAX       BIT STRING
  LDAP-SYNTAX  bitString.&id
  LDAP-NAME    {"bitStringMatch"}
  ID           id-mr-bitStringMatch }

octetStringMatch MATCHING-RULE ::= {
  SYNTAX       OCTET STRING
  LDAP-SYNTAX  octetString.&id
  LDAP-NAME    {"octetStringMatch"}
  ID           id-mr-octetStringMatch }

octetStringOrderingMatch MATCHING-RULE ::= {
  SYNTAX       OCTET STRING
  LDAP-SYNTAX  octetString.&id
  LDAP-NAME    {"octetStringOrderingMatch"}
  ID           id-mr-octetStringOrderingMatch }

octetStringSubstringsMatch MATCHING-RULE ::= {
  SYNTAX  OctetSubstringAssertion
  ID      id-mr-octetStringSubstringsMatch }

OctetSubstringAssertion ::= SEQUENCE OF CHOICE {
  initial  [0]  OCTET STRING,
  any      [1]  OCTET STRING,
  final    [2]  OCTET STRING,
  ... } -- at most one initial and one final component

telephoneNumberMatch MATCHING-RULE ::= {
  SYNTAX       TelephoneNumber
  LDAP-SYNTAX  telephoneNr.&id
  LDAP-NAME    {"telephoneNumberMatch"}
  ID           id-mr-telephoneNumberMatch }

telephoneNumberSubstringsMatch MATCHING-RULE ::= {
  SYNTAX       SubstringAssertion
  LDAP-SYNTAX  substringAssertion.&id
  LDAP-NAME    {"telephoneNumberSubstringsMatch"}
  ID           id-mr-telephoneNumberSubstringsMatch }

presentationAddressMatch MATCHING-RULE ::= {
  SYNTAX       PresentationAddress
  ID           id-mr-presentationAddressMatch }

uniqueMemberMatch MATCHING-RULE ::= {
  SYNTAX       NameAndOptionalUID
  LDAP-SYNTAX  nameAndOptionalUID.&id
  LDAP-NAME    {"uniqueMemberMatch"}
  ID           id-mr-uniqueMemberMatch }

protocolInformationMatch MATCHING-RULE ::= {
  SYNTAX       OCTET STRING
  ID           id-mr-protocolInformationMatch }

facsimileNumberMatch MATCHING-RULE ::= {
  SYNTAX       TelephoneNumber
  ID           id-mr-facsimileNumberMatch }

facsimileNumberSubstringsMatch MATCHING-RULE ::= {
  SYNTAX       SubstringAssertion
  ID           id-mr-facsimileNumberSubstringsMatch }

uUIDPairMatch MATCHING-RULE ::= {
  SYNTAX       UUIDPair
  ID           id-mr-uuidpairmatch }

uTCTimeMatch MATCHING-RULE ::= {
  SYNTAX       UTCTime
  ID           id-mr-uTCTimeMatch }

uTCTimeOrderingMatch MATCHING-RULE ::= {
  SYNTAX       UTCTime
  ID           id-mr-uTCTimeOrderingMatch }

generalizedTimeMatch MATCHING-RULE ::= {
  SYNTAX       GeneralizedTime
  -- as per 46.3 b) or c) of Rec. ITU-T X.680 | ISO/IEC 8824-1
  LDAP-SYNTAX  generalizedTime.&id
  LDAP-NAME    {"generalizedTimeMatch"}
  ID           id-mr-generalizedTimeMatch }

generalizedTimeOrderingMatch MATCHING-RULE ::= {
  SYNTAX       GeneralizedTime
  -- as per 46.3 b) or c) of Rec. ITU-T X.680 | ISO/IEC 8824-1
  LDAP-SYNTAX  generalizedTime.&id
  LDAP-NAME    {"generalizedTimeOrderingMatch"}
  ID           id-mr-generalizedTimeOrderingMatch }

systemProposedMatch MATCHING-RULE ::= {
  ID  id-mr-systemProposedMatch }

integerFirstComponentMatch MATCHING-RULE ::= {
  SYNTAX       INTEGER
  LDAP-SYNTAX  integer.&id
  LDAP-NAME    {"integerFirstComponentMatch"}
  ID           id-mr-integerFirstComponentMatch }

objectIdentifierFirstComponentMatch MATCHING-RULE ::= {
  SYNTAX       OBJECT IDENTIFIER
  LDAP-SYNTAX  oid.&id
  LDAP-NAME    {"objectIdentifierFirstComponentMatch"}
  ID           id-mr-objectIdentifierFirstComponentMatch }

directoryStringFirstComponentMatch MATCHING-RULE ::= {
  SYNTAX       UnboundedDirectoryString
  LDAP-SYNTAX  directoryString.&id
  LDAP-NAME    {"directoryStringFirstComponentMatch"}
  ID           id-mr-directoryStringFirstComponentMatch }

wordMatch MATCHING-RULE ::= {
  SYNTAX       UnboundedDirectoryString
  LDAP-SYNTAX  directoryString.&id
  LDAP-NAME    {"wordMatch"}
  ID           id-mr-wordMatch }

keywordMatch MATCHING-RULE ::= {
  SYNTAX       UnboundedDirectoryString
  LDAP-SYNTAX  directoryString.&id
  LDAP-NAME    {"keywordMatch"}
  ID           id-mr-keywordMatch }

generalWordMatch MATCHING-RULE ::= {
  SYNTAX       SubstringAssertion
  ID           id-mr-generalWordMatch }

sequenceMatchType ATTRIBUTE ::= {
  WITH SYNTAX   SequenceMatchType
  SINGLE VALUE  TRUE
  ID            id-cat-sequenceMatchType } -- defaulting to sequenceExact

SequenceMatchType ::= ENUMERATED {
  sequenceExact                  (0),
  sequenceDeletion               (1),
  sequenceRestrictedDeletion     (2),
  sequencePermutation            (3),
  sequencePermutationAndDeletion (4),
  sequenceProviderDefined        (5),
  ... }

wordMatchTypes ATTRIBUTE ::= {
  WITH SYNTAX   WordMatchTypes
  SINGLE VALUE  TRUE
  ID            id-cat-wordMatchType } -- defaulting to wordExact

WordMatchTypes ::= ENUMERATED {
  wordExact           (0),
  wordTruncated       (1),
  wordPhonetic        (2),
  wordProviderDefined (3),
  ... }

characterMatchTypes ATTRIBUTE ::= {
  WITH SYNTAX   CharacterMatchTypes
  SINGLE VALUE  TRUE
  ID            id-cat-characterMatchTypes }

CharacterMatchTypes ::= ENUMERATED {
  characterExact      (0),
  characterCaseIgnore (1),
  characterMapped     (2),
  ... }

selectedContexts ATTRIBUTE ::= {
  WITH SYNTAX  ContextAssertion
  ID           id-cat-selectedContexts }

approximateStringMatch MATCHING-RULE ::= {
  ID      id-mr-approximateStringMatch }

ignoreIfAbsentMatch MATCHING-RULE ::= {
  ID      id-mr-ignoreIfAbsentMatch }

nullMatch MATCHING-RULE ::= {
  ID      id-mr-nullMatch }

ZONAL-MATCHING ::=
  MAPPING-BASED-MATCHING{ZonalSelect, TRUE, ZonalResult, zonalMatch.&id}

ZonalSelect ::= SEQUENCE OF AttributeType

ZonalResult ::= ENUMERATED {
  cannot-select-mapping (0),
  zero-mappings         (2),
  multiple-mappings     (3),
   ... }

zonalMatch MATCHING-RULE ::= {
  UNIQUE-MATCH-INDICATOR  multipleMatchingLocalities
  ID                      id-mr-zonalMatch }

uriMatch MATCHING-RULE ::= {
  SYNTAX       UTF8String
  LDAP-SYNTAX  directoryString.&id
  LDAP-NAME    {"uriMatch"}
  ID           id-mr-uriMatch }

dnsNameMatch MATCHING-RULE ::= {
  SYNTAX       DomainName
  LDAP-SYNTAX  dnsString.&id
  LDAP-NAME    {"dnsNameMatch"}
  ID           id-mr-dnsNameMatch }

intEmailMatch MATCHING-RULE ::= {
  SYNTAX       IntEmail
  LDAP-SYNTAX  dnsString.&id
  LDAP-NAME    {"intEmailMatch"}
  ID           id-mr-intEmailMatch }

jidMatch MATCHING-RULE ::= {
  SYNTAX       Jid
  LDAP-SYNTAX  dnsString.&id
  LDAP-NAME    {"jidMatch"}
  ID           id-mr-jidMatch }

-- LDAP defined matching rules

caseExactIA5Match MATCHING-RULE ::= {
  SYNTAX       IA5String
  LDAP-SYNTAX  ia5String.&id
  LDAP-NAME    {"caseExactIA5Match"}
  ID           id-lmr-caseExactIA5Match }

caseIgnoreIA5Match MATCHING-RULE ::= {
  SYNTAX       IA5String
  LDAP-SYNTAX  ia5String.&id
  LDAP-NAME    {"caseIgnoreIA5Match"}
  ID           id-lmr-caseIgnoreIA5Match }

caseIgnoreIA5SubstringsMatch MATCHING-RULE ::= {
  SYNTAX       SubstringAssertion
  LDAP-SYNTAX  substringAssertion.&id
  LDAP-NAME    {"caseIgnoreIA5SubstringsMatch"}
  ID           id-lmr-caseIgnoreIA5Match }

-- Syntaxes defined by this Directory Specification

utmCoords SYNTAX-NAME ::= {
  LDAP-DESC         "UTM Coordinates"
  DIRECTORY SYNTAX  UtmCoordinates
  ID                id-asx-utmCoords }

uiiForm SYNTAX-NAME ::= {
  LDAP-DESC         "UII Format"
  DIRECTORY SYNTAX  UiiFormat
  ID                id-asx-uiiForm }

epcForm SYNTAX-NAME ::= {
  LDAP-DESC         "EPC Format"
  DIRECTORY SYNTAX  EpcFormat
  ID                id-asx-epcForm }

countryString3c SYNTAX-NAME ::= {
  LDAP-DESC         "Country String 3 characters"
  DIRECTORY SYNTAX  CountryCode3c
  ID                id-asx-countryString3c }

countryString3n SYNTAX-NAME ::= {
  LDAP-DESC         "Country String 3 numeric characters"
  DIRECTORY SYNTAX  CountryCode3n
  ID                id-asx-countryString3n }

dnsString SYNTAX-NAME ::= {
  LDAP-DESC         "DNS Name String"
  DIRECTORY SYNTAX  DomainName
  ID                id-asx-dnsString }

intEmailString SYNTAX-NAME ::= {
  LDAP-DESC         "Internationalized Email"
  DIRECTORY SYNTAX  IntEmail
  ID                id-asx-intEmailString }

jidString SYNTAX-NAME ::= {
  LDAP-DESC         "Jabber identifier"
  DIRECTORY SYNTAX  Jid
  ID                id-asx-jidString }

-- Syntaxes defined under the ldap-syntax OID arc

attributeTypeDescription SYNTAX-NAME ::= {
  LDAP-DESC         "Attribute Type Description"
  DIRECTORY SYNTAX  AttributeTypeDescription
  ID                id-lsx-attributeTypeDescription }

bitString SYNTAX-NAME ::= {
  LDAP-DESC         "Bit String"
  DIRECTORY SYNTAX  BIT STRING
  ID                id-lsx-bitString }

boolean SYNTAX-NAME ::= {
  LDAP-DESC         "Boolean"
  DIRECTORY SYNTAX  BOOLEAN
  ID                id-lsx-boolean }

countryString SYNTAX-NAME ::= {
  LDAP-DESC         "Country String"
  DIRECTORY SYNTAX  CountryName
  ID                id-lsx-countryString }

dn SYNTAX-NAME ::= {
  LDAP-DESC         "DN"
  DIRECTORY SYNTAX  DistinguishedName
  ID                id-lsx-dn }

deliveryMethod SYNTAX-NAME ::= {
  LDAP-DESC         "Delevery Method"
  DIRECTORY SYNTAX  PreferredDeliveryMethod
  ID                id-lsx-deliveryMethod }

directoryString SYNTAX-NAME ::= {
  LDAP-DESC         "Directory String"
  DIRECTORY SYNTAX  UnboundedDirectoryString
  ID                id-lsx-directoryString }

dITContentRuleDescription SYNTAX-NAME ::= {
  LDAP-DESC         "DIT Content Rule Description"
  DIRECTORY SYNTAX  DITContentRuleDescription
  ID                id-lsx-dITContentRuleDescription }

dITStructureRuleDescription SYNTAX-NAME ::= {
  LDAP-DESC         "DIT StructureRule Description"
  DIRECTORY SYNTAX  DITStructureRuleDescription
  ID                id-lsx-dITStructureRuleDescription }

enhancedGuide SYNTAX-NAME ::= {
  LDAP-DESC         "Enhanced Guide"
  DIRECTORY SYNTAX  EnhancedGuide
  ID                id-lsx-enhancedGuide }

facsimileTelephoneNr SYNTAX-NAME ::= {
  LDAP-DESC         "Facsimile Telephone Number"
  DIRECTORY SYNTAX  FacsimileTelephoneNumber
  ID                id-lsx-facsimileTelephoneNr }

fax SYNTAX-NAME ::= {
  LDAP-DESC         "Fax"
  DIRECTORY SYNTAX  NULL
  ID                id-lsx-fax }

generalizedTime SYNTAX-NAME ::= {
  LDAP-DESC         "Generalized Time"
  DIRECTORY SYNTAX  GeneralizedTime
  ID                id-lsx-generalizedTime }

guide SYNTAX-NAME ::= {
  LDAP-DESC         "Guide"
  DIRECTORY SYNTAX  Guide
  ID                id-lsx-guide }

ia5String SYNTAX-NAME ::= {
  LDAP-DESC         "IA5 String"
  DIRECTORY SYNTAX  IA5String
  ID                id-lsx-ia5String }

integer SYNTAX-NAME ::= {
  LDAP-DESC         "INTEGER"
  DIRECTORY SYNTAX  INTEGER
  ID                id-lsx-integer }

jpeg SYNTAX-NAME ::= {
  LDAP-DESC         "JPEG"
  DIRECTORY SYNTAX  NULL
  ID                id-lsx-jpeg }

matchingRuleDescription SYNTAX-NAME ::= {
  LDAP-DESC         "Matching Rule Description"
  DIRECTORY SYNTAX  MatchingRuleDescription
  ID                id-lsx-matchingRuleDescription }

matchingRuleUseDescription SYNTAX-NAME ::= {
  LDAP-DESC         "Matching Rule Use Description"
  DIRECTORY SYNTAX  MatchingRuleUseDescription
  ID                id-lsx-matchingRuleUseDescription }

nameAndOptionalUID SYNTAX-NAME ::= {
  LDAP-DESC         "Name And Optional UID"
  DIRECTORY SYNTAX  NameAndOptionalUID
  ID                id-lsx-nameAndOptionalUID }

nameFormDescription SYNTAX-NAME ::= {
  LDAP-DESC         "Name Form Description"
  DIRECTORY SYNTAX  NameFormDescription
  ID                id-lsx-nameFormDescription }

numericString SYNTAX-NAME ::= {
  LDAP-DESC         "Numeric String"
  DIRECTORY SYNTAX  NumericString
  ID                id-lsx-numericString }

objectClassDescription SYNTAX-NAME ::= {
  LDAP-DESC         "Object Class Description"
  DIRECTORY SYNTAX  ObjectClassDescription
  ID                id-lsx-objectClassDescription }

oid SYNTAX-NAME ::= {
  LDAP-DESC         "OID"
  DIRECTORY SYNTAX  OBJECT IDENTIFIER
  ID                id-lsx-oid }

otherMailbox SYNTAX-NAME ::= {
  LDAP-DESC        "Other Mailbox"
  DIRECTORY SYNTAX  NULL
  ID                id-lsx-otherMailbox }

octetString SYNTAX-NAME ::= {
  LDAP-DESC         "Octet String"
  DIRECTORY SYNTAX  OCTET STRING
  ID                id-lsx-octetString }

postalAddr SYNTAX-NAME ::= {
  LDAP-DESC         "Postal Address"
  DIRECTORY SYNTAX  PostalAddress
  ID                id-lsx-postalAddr }

presentationAddr SYNTAX-NAME ::= {
  LDAP-DESC         "Presentation Address"
  DIRECTORY SYNTAX  PresentationAddress
  ID                id-lsx-presentationAddr }

printableString SYNTAX-NAME ::= {
  LDAP-DESC         "Printable String"
  DIRECTORY SYNTAX  PrintableString
  ID                id-lsx-printableString }

subtreeSpec SYNTAX-NAME ::= {
  LDAP-DESC         "SubtreeSpecification"
  DIRECTORY SYNTAX  SubtreeSpecification
  ID                id-lsx-subtreeSpec }

telephoneNr SYNTAX-NAME ::= {
  LDAP-DESC         "Telephone Number"
  DIRECTORY SYNTAX  TelephoneNumber
  ID                id-lsx-telephoneNr }

telexNr SYNTAX-NAME ::= {
  LDAP-DESC         "Telex Number"
  DIRECTORY SYNTAX  TelexNumber
  ID                id-lsx-telexNr }

utcTime SYNTAX-NAME ::= {
  LDAP-DESC         "UTC Time"
  DIRECTORY SYNTAX  UTCTime
  ID                id-lsx-utcTime }

ldapSyntaxDescription SYNTAX-NAME ::= {
  LDAP-DESC         "LDAP Syntax Description"
  DIRECTORY SYNTAX  NULL
  ID                id-lsx-ldapSyntaxDescription }

substringAssertion SYNTAX-NAME ::= {
  LDAP-DESC         "Substring Assertion"
  DIRECTORY SYNTAX  SubstringAssertion
  ID                id-lsx-substringAssertion }

-- Contexts

languageContext CONTEXT ::= {
  WITH SYNTAX  LanguageContextSyntax
  ID           id-avc-language }

LanguageContextSyntax ::= PrintableString(SIZE (2..3)) -- ISO 639-2 codes only

temporalContext CONTEXT ::= {
  WITH SYNTAX  TimeSpecification
  ASSERTED AS  TimeAssertion
  ID           id-avc-temporal }

TimeSpecification ::= SEQUENCE {
  time           CHOICE {
    absolute       SEQUENCE {
      startTime [0]  GeneralizedTime OPTIONAL,
      endTime   [1]  GeneralizedTime OPTIONAL,
      ... },
    periodic      SET SIZE (1..MAX) OF Period},
  notThisTime   BOOLEAN DEFAULT FALSE,
  timeZone      TimeZone OPTIONAL,
  ... }

Period ::= SEQUENCE {
  timesOfDay  [0]  SET SIZE (1..MAX) OF DayTimeBand OPTIONAL,
  days        [1]  CHOICE {
    intDay           SET OF INTEGER,
    bitDay           BIT STRING {
      sunday    (0),
      monday    (1),
      tuesday   (2),
      wednesday (3),
      thursday  (4),
      friday    (5),
      saturday  (6)},
    dayOf            XDayOf,
    ...} OPTIONAL,
  weeks       [2]  CHOICE {
    allWeeks         NULL,
    intWeek          SET OF INTEGER,
    bitWeek          BIT STRING {
      week1     (0),
      week2     (1),
      week3     (2),
      week4     (3),
      week5     (4)},
    ... } OPTIONAL,
  months      [3]  CHOICE {
    allMonths        NULL,
    intMonth         SET OF INTEGER,
    bitMonth         BIT STRING {
      january   (0),
      february  (1),
      march     (2),
      april     (3),
      may       (4),
      june      (5),
      july      (6),
      august    (7),
      september (8),
      october   (9),
      november  (10),
      december  (11)},
    ...} OPTIONAL,
  years       [4]  SET OF INTEGER(1000..MAX) OPTIONAL,
  ... }

XDayOf ::= CHOICE {
  first   [1]  NamedDay,
  second  [2]  NamedDay,
  third   [3]  NamedDay,
  fourth  [4]  NamedDay,
  fifth   [5]  NamedDay }

NamedDay ::= CHOICE {
  intNamedDays ENUMERATED {
    sunday      (1),
    monday      (2),
    tuesday     (3),
    wednesday   (4),
    thursday    (5),
    friday      (6),
    saturday    (7)},
  bitNamedDays BIT STRING {
    sunday      (0),
    monday      (1),
    tuesday     (2),
    wednesday   (3),
    thursday    (4),
    friday      (5),
    saturday    (6)} }

DayTimeBand ::= SEQUENCE {
  startDayTime  [0]  DayTime DEFAULT {hour 0},
  endDayTime    [1]  DayTime DEFAULT {hour 23, minute 59, second 59},
  ... }

DayTime ::= SEQUENCE {
  hour    [0]  INTEGER(0..23),
  minute  [1]  INTEGER(0..59) DEFAULT 0,
  second  [2]  INTEGER(0..59) DEFAULT 0,
  ... }

TimeZone ::= INTEGER(-12..12)

TimeAssertion ::= CHOICE {
  now             NULL,
  at              GeneralizedTime,
  between         SEQUENCE {
    startTime  [0]  GeneralizedTime,
    endTime    [1]  GeneralizedTime OPTIONAL,
    entirely        BOOLEAN DEFAULT FALSE,
    ...},
  ... }

localeContext CONTEXT ::= {
  WITH SYNTAX  LocaleContextSyntax
  ID           id-avc-locale }

LocaleContextSyntax ::= CHOICE {
  localeID1  OBJECT IDENTIFIER,
  localeID2  UnboundedDirectoryString,
  ... }

ldapAttributeOptionContext CONTEXT ::= {
  WITH SYNTAX  AttributeOptionList
  ASSERTED AS  AttributeOptionList
  ABSENT-MATCH FALSE
  ID           id-avc-ldapAttributeOption }

AttributeOptionList ::= SEQUENCE OF UTF8String

-- Object identifier assignments
-- object identifiers assigned in other modules are shown in comments

-- Attributes

-- id-at-objectClass                      OBJECT IDENTIFIER ::= {id-at 0}
-- id-at-aliasedEntryName                 OBJECT IDENTIFIER ::= {id-at 1}
-- id-at-encryptedAliasedEntryName        OBJECT IDENTIFIER ::= {id-at 1 2}
id-at-knowledgeInformation                OBJECT IDENTIFIER ::= {id-at 2}
id-at-commonName                          OBJECT IDENTIFIER ::= {id-at 3}
-- id-at-encryptedCommonName              OBJECT IDENTIFIER ::= {id-at 3 2}
id-at-surname                             OBJECT IDENTIFIER ::= {id-at 4}
-- id-at-encryptedSurname                 OBJECT IDENTIFIER ::= {id-at 4 2}
id-at-serialNumber                        OBJECT IDENTIFIER ::= {id-at 5}
-- id-at-encryptedSerialNumber            OBJECT IDENTIFIER ::= {id-at 5 2}
id-at-countryName                         OBJECT IDENTIFIER ::= {id-at 6}
-- id-at-encryptedCountryName             OBJECT IDENTIFIER ::= {id-at 6 2}
id-at-localityName                        OBJECT IDENTIFIER ::= {id-at 7}
-- id-at-encryptedLocalityName            OBJECT IDENTIFIER ::= {id-at 7 2}
id-at-collectiveLocalityName              OBJECT IDENTIFIER ::= {id-at 7 1}
-- id-at-encryptedCollectiveLocalityName  OBJECT IDENTIFIER ::= {id-at 7 1 2}
id-at-stateOrProvinceName                 OBJECT IDENTIFIER ::= {id-at 8}
-- id-at-encryptedStateOrProvinceName     OBJECT IDENTIFIER ::= {id-at 8 2}
id-at-collectiveStateOrProvinceName       OBJECT IDENTIFIER ::= {id-at 8 1}
-- id-at-encryptedCollectiveStateOrProvinceName
--                                        OBJECT IDENTIFIER ::= {id-at 8 1 2}
id-at-streetAddress                       OBJECT IDENTIFIER ::= {id-at 9}
-- id-at-encryptedStreetAddress           OBJECT IDENTIFIER ::= {id-at 9 2}
id-at-collectiveStreetAddress             OBJECT IDENTIFIER ::= {id-at 9 1}
-- id-at-encryptedCollectiveStreetAddress OBJECT IDENTIFIER ::= {id-at 9 1 2}
id-at-organizationName                    OBJECT IDENTIFIER ::= {id-at 10}
-- id-at-encryptedOrganizationName        OBJECT IDENTIFIER ::= {id-at 10 2}
id-at-collectiveOrganizationName          OBJECT IDENTIFIER ::= {id-at 10 1}
-- id-at-encryptedCollectiveOrganizationName
--                                        OBJECT IDENTIFIER ::= {id-at 10 1 2}
id-at-organizationalUnitName              OBJECT IDENTIFIER ::= {id-at 11}
-- id-at-encryptedOrganizationalUnitName  OBJECT IDENTIFIER ::= {id-at 11 2}
id-at-collectiveOrganizationalUnitName    OBJECT IDENTIFIER ::= {id-at 11 1}
-- id-at-encryptedCollectiveOrganizationalUnitNam
--                                        OBJECT IDENTIFIER ::= {id-at 11 1 2}
id-at-title                               OBJECT IDENTIFIER ::= {id-at 12}
-- id-at-encryptedTitle                   OBJECT IDENTIFIER ::= {id-at 12 2}
id-at-description                         OBJECT IDENTIFIER ::= {id-at 13}
-- id-at-encryptedDescription             OBJECT IDENTIFIER ::= {id-at 13 2}
id-at-searchGuide                         OBJECT IDENTIFIER ::= {id-at 14}
-- id-at-encryptedSearchGuide             OBJECT IDENTIFIER ::= {id-at 14 2}
id-at-businessCategory                    OBJECT IDENTIFIER ::= {id-at 15}
-- id-at-encryptedBusinessCategory        OBJECT IDENTIFIER ::= {id-at 15 2}
id-at-postalAddress                       OBJECT IDENTIFIER ::= {id-at 16}
-- id-at-encryptedPostalAddress           OBJECT IDENTIFIER ::= {id-at 16 2}
id-at-collectivePostalAddress             OBJECT IDENTIFIER ::= {id-at 16 1}
-- id-at-encryptedCollectivePostalAddress OBJECT IDENTIFIER ::= {id-at 16 1 2}
id-at-postalCode                          OBJECT IDENTIFIER ::= {id-at 17}
-- id-at-encryptedPostalCode              OBJECT IDENTIFIER ::= {id-at 17 2}
id-at-collectivePostalCode                OBJECT IDENTIFIER ::= {id-at 17 1}
-- id-at-encryptedCollectivePostalCode    OBJECT IDENTIFIER ::= {id-at 17 1 2}
id-at-postOfficeBox                       OBJECT IDENTIFIER ::= {id-at 18}
id-at-collectivePostOfficeBox             OBJECT IDENTIFIER ::= {id-at 18 1}
-- id-at-encryptedPostOfficeBox           OBJECT IDENTIFIER ::= {id-at 18 2}
-- id-at-encryptedCollectivePostOfficeBox OBJECT IDENTIFIER ::= {id-at 18 1 2}
id-at-physicalDeliveryOfficeName          OBJECT IDENTIFIER ::= {id-at 19}
id-at-collectivePhysicalDeliveryOfficeName
                                          OBJECT IDENTIFIER ::= {id-at 19 1}
-- id-at-encryptedPhysicalDeliveryOfficeName
--                                        OBJECT IDENTIFIER ::= {id-at 19 2}
-- id-at-encryptedCollectivePhysicalDeliveryOfficeName
--                                        OBJECT IDENTIFIER ::= {id-at 19 1 2}
id-at-telephoneNumber                     OBJECT IDENTIFIER ::= {id-at 20}
-- id-at-encryptedTelephoneNumber         OBJECT IDENTIFIER ::= {id-at 20 2}
id-at-collectiveTelephoneNumber           OBJECT IDENTIFIER ::= {id-at 20 1}
-- id-at-encryptedCollectiveTelephoneNumber
--                                        OBJECT IDENTIFIER ::= {id-at 20 1 2}
id-at-telexNumber                         OBJECT IDENTIFIER ::= {id-at 21}
-- id-at-encryptedTelexNumber             OBJECT IDENTIFIER ::= {id-at 21 2}
id-at-collectiveTelexNumber               OBJECT IDENTIFIER ::= {id-at 21 1}
-- id-at-encryptedCollectiveTelexNumber   OBJECT IDENTIFIER ::= {id-at 21 1 2}
-- id-at-teletexTerminalIdentifier        OBJECT IDENTIFIER ::= {id-at 22}
-- id-at-encryptedTeletexTerminalIdentifier
--                                        OBJECT IDENTIFIER ::= {id-at 22 2}
-- id-at-collectiveTeletexTerminalIdentifier
--                                        OBJECT IDENTIFIER ::= {id-at 22 1}
-- id-at-encryptedCollectiveTeletexTerminalIdentifier
--                                        OBJECT IDENTIFIER ::= {id-at 22 1 2}
id-at-facsimileTelephoneNumber            OBJECT IDENTIFIER ::= {id-at 23}

-- id-at-encryptedFacsimileTelephoneNumber
--                                        OBJECT IDENTIFIER ::= {id-at 23 2}
id-at-collectiveFacsimileTelephoneNumber  OBJECT IDENTIFIER ::= {id-at 23 1}
-- id-at-encryptedCollectiveFacsimileTelephoneNumber
--                                        OBJECT IDENTIFIER ::= {id-at 23 1 2}
id-at-x121Address                         OBJECT IDENTIFIER ::= {id-at 24}
-- id-at-encryptedX121Address             OBJECT IDENTIFIER ::= {id-at 24 2}
id-at-internationalISDNNumber             OBJECT IDENTIFIER ::= {id-at 25}
-- id-at-encryptedInternationalISDNNumber OBJECT IDENTIFIER ::= {id-at 25 2}
id-at-collectiveInternationalISDNNumber   OBJECT IDENTIFIER ::= {id-at 25 1}
-- id-at-encryptedCollectiveInternationalISDNNumber
--                                        OBJECT IDENTIFIER ::= {id-at 25 1 2}
id-at-registeredAddress                   OBJECT IDENTIFIER ::= {id-at 26}
-- id-at-encryptedRegisteredAddress       OBJECT IDENTIFIER ::= {id-at 26 2}
id-at-destinationIndicator                OBJECT IDENTIFIER ::= {id-at 27}
-- id-at-encryptedDestinationIndicator    OBJECT IDENTIFIER ::= {id-at 27 2}
id-at-preferredDeliveryMethod             OBJECT IDENTIFIER ::= {id-at 28}
-- id-at-encryptedPreferredDeliveryMethod OBJECT IDENTIFIER ::= {id-at 28 2}
id-at-presentationAddress                 OBJECT IDENTIFIER ::= {id-at 29}
-- id-at-encryptedPresentationAddress     OBJECT IDENTIFIER ::= {id-at 29 2}
id-at-supportedApplicationContext         OBJECT IDENTIFIER ::= {id-at 30}
-- id-at-encryptedSupportedApplicationContext
--                                        OBJECT IDENTIFIER ::= {id-at 30 2}
id-at-member                              OBJECT IDENTIFIER ::= {id-at 31}
-- id-at-encryptedMember                  OBJECT IDENTIFIER ::= {id-at 31 2}
id-at-owner                               OBJECT IDENTIFIER ::= {id-at 32}
-- id-at-encryptedOwner                   OBJECT IDENTIFIER ::= {id-at 32 2}
id-at-roleOccupant                        OBJECT IDENTIFIER ::= {id-at 33}
-- id-at-encryptedRoleOccupant            OBJECT IDENTIFIER ::= {id-at 33 2}
id-at-seeAlso                             OBJECT IDENTIFIER ::= {id-at 34}
-- id-at-encryptedSeeAlso                 OBJECT IDENTIFIER ::= {id-at 34 2}
-- id-at-userPassword                     OBJECT IDENTIFIER ::= {id-at 35} X.509|Part 8
-- id-at-encryptedUserPassword            OBJECT IDENTIFIER ::= {id-at 35 2}
-- id-at-userCertificate                  OBJECT IDENTIFIER ::= {id-at 36} X.509|Part 8
-- id-at-encryptedUserCertificate         OBJECT IDENTIFIER ::= {id-at 36 2}
-- id-at-cACertificate                    OBJECT IDENTIFIER ::= {id-at 37} X.509|Part 8
-- id-at-encryptedCACertificate           OBJECT IDENTIFIER ::= {id-at 37 2}
-- id-at-authorityRevocationList          OBJECT IDENTIFIER ::= {id-at 38} X.509|Part 8
-- id-at-encryptedAuthorityRevocationList OBJECT IDENTIFIER ::= {id-at 38 2}
-- id-at-certificateRevocationList        OBJECT IDENTIFIER ::= {id-at 39} X.509|Part 8
-- id-at-encryptedCertificateRevocationList
--                                        OBJECT IDENTIFIER ::= {id-at 39 2}
-- id-at-crossCertificatePair             OBJECT IDENTIFIER ::= {id-at 40} X.509|Part 8
-- id-at-encryptedCrossCertificatePair    OBJECT IDENTIFIER ::= {id-at 40 2}
id-at-name                                OBJECT IDENTIFIER ::= {id-at 41}
id-at-givenName                           OBJECT IDENTIFIER ::= {id-at 42}
-- id-at-encryptedGivenName               OBJECT IDENTIFIER ::= {id-at 42 2}
id-at-initials                            OBJECT IDENTIFIER ::= {id-at 43}
-- id-at-encryptedInitials                OBJECT IDENTIFIER ::= {id-at 43 2}
id-at-generationQualifier                 OBJECT IDENTIFIER ::= {id-at 44}
-- id-at-encryptedGenerationQualifier     OBJECT IDENTIFIER ::= {id-at 44 2}
id-at-uniqueIdentifier                    OBJECT IDENTIFIER ::= {id-at 45}
-- id-at-encryptedUniqueIdentifier        OBJECT IDENTIFIER ::= {id-at 45 2}
id-at-dnQualifier                         OBJECT IDENTIFIER ::= {id-at 46}
-- id-at-encryptedDnQualifier             OBJECT IDENTIFIER ::= {id-at 46 2}
id-at-enhancedSearchGuide                 OBJECT IDENTIFIER ::= {id-at 47}
-- id-at-encryptedEnhancedSearchGuide     OBJECT IDENTIFIER ::= {id-at 47 2}
id-at-protocolInformation                 OBJECT IDENTIFIER ::= {id-at 48}
-- id-at-encryptedProtocolInformation     OBJECT IDENTIFIER ::= {id-at 48 2}
id-at-distinguishedName                   OBJECT IDENTIFIER ::= {id-at 49}
-- id-at-encryptedDistinguishedName       OBJECT IDENTIFIER ::= {id-at 49 2}
id-at-uniqueMember                        OBJECT IDENTIFIER ::= {id-at 50}
-- id-at-encryptedUniqueMember            OBJECT IDENTIFIER ::= {id-at 50 2}
id-at-houseIdentifier                     OBJECT IDENTIFIER ::= {id-at 51}
-- id-at-encryptedHouseIdentifier         OBJECT IDENTIFIER ::= {id-at 51 2}
-- id-at-supportedAlgorithms              OBJECT IDENTIFIER ::= {id-at 52} X.509|Part 8
-- id-at-encryptedSupportedAlgorithms     OBJECT IDENTIFIER ::= {id-at 52 2}
-- id-at-deltaRevocationList              OBJECT IDENTIFIER ::= {id-at 53} X.509|Part 8
-- id-at-encryptedDeltaRevocationList     OBJECT IDENTIFIER ::= {id-at 53 2}
id-at-dmdName                             OBJECT IDENTIFIER ::= {id-at 54}
-- id-at-encryptedDmdName                 OBJECT IDENTIFIER ::= {id-at 54 2}
-- id-at-clearance                        OBJECT IDENTIFIER ::= {id-at 55}
-- id-at-encryptedClearance               OBJECT IDENTIFIER ::= {id-at 55 2}
-- id-at-defaultDirQop                    OBJECT IDENTIFIER ::= {id-at 56}
-- id-at-encryptedDefaultDirQop           OBJECT IDENTIFIER ::= {id-at 56 2}
-- id-at-attributeIntegrityInfo           OBJECT IDENTIFIER ::= {id-at 57}
-- id-at-encryptedAttributeIntegrityInfo  OBJECT IDENTIFIER ::= {id-at 57 2}
-- id-at-attributeCertificate             OBJECT IDENTIFIER ::= {id-at 58} X.509|Part 8
-- id-at-encryptedAttributeCertificate    OBJECT IDENTIFIER ::=	{id-at 58 2}
-- id-at-attributeCertificateRevocationList
--                                        OBJECT IDENTIFIER ::=	{id-at 59} X.509|Part 8
-- id-at-encryptedAttributeCertificateRevocationList
--                                        OBJECT IDENTIFIER ::= {id-at 59 2}
-- id-at-confKeyInfo                      OBJECT IDENTIFIER ::= {id-at 60}
-- id-at-encryptedConfKeyInfo             OBJECT IDENTIFIER ::= {id-at 60 2}
-- id-at-aACertificate                    OBJECT IDENTIFIER ::= {id-at 61} X.509|Part 8
-- id-at-attributeDescriptorCertificate   OBJECT IDENTIFIER ::= {id-at 62} X.509|Part 8
-- id-at-attributeAuthorityRevocationList OBJECT IDENTIFIER ::= {id-at 63} X.509|Part 8
-- id-at-family-information               OBJECT IDENTIFIER ::= {id-at 64}
id-at-pseudonym                           OBJECT IDENTIFIER ::= {id-at 65}
id-at-communicationsService               OBJECT IDENTIFIER ::= {id-at 66}
id-at-communicationsNetwork               OBJECT IDENTIFIER ::= {id-at 67}
-- id-at-certificationPracticeStmt        OBJECT IDENTIFIER ::= {id-at 68} X.509|Part 8
-- id-at-certificatePolicy                OBJECT IDENTIFIER ::= {id-at 69} X.509|Part 8
-- id-at-pkiPath                          OBJECT IDENTIFIER ::= {id-at 70} X.509|Part 8
-- id-at-privPolicy                       OBJECT IDENTIFIER ::= {id-at 71} X.509|Part 8
-- id-at-role                             OBJECT IDENTIFIER ::= {id-at 72} X.509|Part 8
-- id-at-delegationPath                   OBJECT IDENTIFIER ::= {id-at 73} X.509|Part 8
-- id-at-protPrivPolicy                   OBJECT IDENTIFIER ::= {id-at 74} X.509|Part 8
-- id-at-xMLPrivilegeInfo                 OBJECT IDENTIFIER ::= {id-at 75} X.509|Part 8
-- id-at-xmlPrivPolicy                    OBJECT IDENTIFIER ::= {id-at 76} X.509|Part 8
id-at-uuidpair                            OBJECT IDENTIFIER ::= {id-at 77}
id-at-tagOid                              OBJECT IDENTIFIER ::= {id-at 78}
id-at-uiiFormat                           OBJECT IDENTIFIER ::= {id-at 79}
id-at-uiiInUrn                            OBJECT IDENTIFIER ::= {id-at 80}
id-at-contentUrl                          OBJECT IDENTIFIER ::= {id-at 81}
-- id-at-permission                       OBJECT IDENTIFIER ::= {id-at 82} X.509|Part 8
id-at-uri                                 OBJECT IDENTIFIER ::= {id-at 83}
-- id-at-pwdAttribute                     OBJECT IDENTIFIER ::= {id-at 84} X.501|Part 2
-- id-at-userPwd                          OBJECT IDENTIFIER ::= {id-at 85} Annex B
id-at-urn                                 OBJECT IDENTIFIER ::= {id-at 86}
id-at-url                                 OBJECT IDENTIFIER ::= {id-at 87}
id-at-utmCoordinates                      OBJECT IDENTIFIER ::= {id-at 88}
id-at-urnC                                OBJECT IDENTIFIER ::= {id-at 89}
id-at-uii                                 OBJECT IDENTIFIER ::= {id-at 90}
id-at-epc                                 OBJECT IDENTIFIER ::= {id-at 91}
id-at-tagAfi                              OBJECT IDENTIFIER ::= {id-at 92}
id-at-epcFormat                           OBJECT IDENTIFIER ::= {id-at 93}
id-at-epcInUrn                            OBJECT IDENTIFIER ::= {id-at 94}
id-at-ldapUrl                             OBJECT IDENTIFIER ::= {id-at 95}
id-at-tagLocation                         OBJECT IDENTIFIER ::= {id-at 96}
id-at-organizationIdentifier              OBJECT IDENTIFIER ::= {id-at 97}
id-at-countryCode3c                       OBJECT IDENTIFIER ::= {id-at 98}
id-at-countryCode3n                       OBJECT IDENTIFIER ::= {id-at 99}
id-at-dnsName                             OBJECT IDENTIFIER ::= {id-at 100}
--id-at-eepkCertificatRevocationList      OBJECT IDENTIFIER ::= {id-at 101} X.509|Part 8
--id-at-eeAttrCertificateRevocationList   OBJECT IDENTIFIER ::= {id-at 102} X.509|Part 8
--id-at-supportedPublicKeyAlgorithms      OBJECT IDENTIFIER ::= {id-at 103} X.509|Part 8
id-at-intEmail                            OBJECT IDENTIFIER ::= {id-at 104}
id-at-jid                                 OBJECT IDENTIFIER ::= {id-at 105}
id-at-objectIdentifier                    OBJECT IDENTIFIER ::= {id-at 106}

-- id-asx-userPwdDescription              OBJECT IDENTIFIER ::= {id-asx 0}
-- id-asx-pwdVocabularyDescription        OBJECT IDENTIFIER ::= {id-asx 1}
-- id-asx-pwdAlphabetDescription          OBJECT IDENTIFIER ::= {id-asx 2}
-- id-asx-pwdEncAlgDescription            OBJECT IDENTIFIER ::= {id-asx 3}
id-asx-utmCoords                          OBJECT IDENTIFIER ::= {id-asx 4}
id-asx-uiiForm                            OBJECT IDENTIFIER ::= {id-asx 5}
id-asx-epcForm                            OBJECT IDENTIFIER ::= {id-asx 6}
id-asx-countryString3c                    OBJECT IDENTIFIER ::= {id-asx 7}
id-asx-countryString3n                    OBJECT IDENTIFIER ::= {id-asx 8}
id-asx-dnsString                          OBJECT IDENTIFIER ::= {id-asx 9}
-- id-asx-x509SupportedPublicKeyAlgorithms
--                                        OBJECT IDENTIFIER ::= {id-asx 10} X.509|Part 8
id-asx-intEmailString                     OBJECT IDENTIFIER ::= {id-asx 11}
id-asx-jidString                          OBJECT IDENTIFIER ::= {id-asx 12}

id-lsx-attributeTypeDescription           OBJECT IDENTIFIER ::= {id-lsx 3}
id-lsx-bitString                          OBJECT IDENTIFIER ::= {id-lsx 6}
id-lsx-boolean                            OBJECT IDENTIFIER ::= {id-lsx 7}
-- id-lsx-x509Certificate                 OBJECT IDENTIFIER ::= {id-lsx 8}  X.509|Part 8
-- id-lsx-x509CertificateList             OBJECT IDENTIFIER ::= {id-lsx 9}  X.509|Part 8
-- id-lsx-x509CertificatePair             OBJECT IDENTIFIER ::= {id-lsx 10} X.509|Part 8
id-lsx-countryString                      OBJECT IDENTIFIER ::= {id-lsx 11}
id-lsx-dn                                 OBJECT IDENTIFIER ::= {id-lsx 12}
id-lsx-deliveryMethod                     OBJECT IDENTIFIER ::= {id-lsx 14}
id-lsx-directoryString                    OBJECT IDENTIFIER ::= {id-lsx 15}
id-lsx-dITContentRuleDescription          OBJECT IDENTIFIER ::= {id-lsx 16}
id-lsx-dITStructureRuleDescription        OBJECT IDENTIFIER ::= {id-lsx 17}
id-lsx-enhancedGuide                      OBJECT IDENTIFIER ::= {id-lsx 21}
id-lsx-facsimileTelephoneNr               OBJECT IDENTIFIER ::= {id-lsx 22}
id-lsx-fax                                OBJECT IDENTIFIER ::= {id-lsx 23}
id-lsx-generalizedTime                    OBJECT IDENTIFIER ::= {id-lsx 24}
id-lsx-guide                              OBJECT IDENTIFIER ::= {id-lsx 25}
id-lsx-ia5String                          OBJECT IDENTIFIER ::= {id-lsx 26}
id-lsx-integer                            OBJECT IDENTIFIER ::= {id-lsx 27}
id-lsx-jpeg                               OBJECT IDENTIFIER ::= {id-lsx 28}
id-lsx-matchingRuleDescription            OBJECT IDENTIFIER ::= {id-lsx 30}
id-lsx-matchingRuleUseDescription         OBJECT IDENTIFIER ::= {id-lsx 31}
id-lsx-nameAndOptionalUID                 OBJECT IDENTIFIER ::= {id-lsx 34}
id-lsx-nameFormDescription                OBJECT IDENTIFIER ::= {id-lsx 35}
id-lsx-numericString                      OBJECT IDENTIFIER ::= {id-lsx 36}
id-lsx-objectClassDescription             OBJECT IDENTIFIER ::= {id-lsx 37}
id-lsx-oid                                OBJECT IDENTIFIER ::= {id-lsx 38}
id-lsx-otherMailbox                       OBJECT IDENTIFIER ::= {id-lsx 39}
id-lsx-octetString                        OBJECT IDENTIFIER ::= {id-lsx 40}
id-lsx-postalAddr                         OBJECT IDENTIFIER ::= {id-lsx 41}
id-lsx-presentationAddr                   OBJECT IDENTIFIER ::= {id-lsx 43}
id-lsx-printableString                    OBJECT IDENTIFIER ::= {id-lsx 44}
id-lsx-subtreeSpec                        OBJECT IDENTIFIER ::= {id-lsx 45}
-- id-lsx-x509SupportedAlgorithm          OBJECT IDENTIFIER ::= {id-lsx 49} X.509|Part 8
id-lsx-telephoneNr                        OBJECT IDENTIFIER ::= {id-lsx 50}
id-lsx-telexNr                            OBJECT IDENTIFIER ::= {id-lsx 52}
id-lsx-utcTime                            OBJECT IDENTIFIER ::= {id-lsx 53}
id-lsx-ldapSyntaxDescription              OBJECT IDENTIFIER ::= {id-lsx 54}
id-lsx-substringAssertion                 OBJECT IDENTIFIER ::= {id-lsx 58}
-- id-lsx-x509SupportedPublicKeyAlgos     OBJECT IDENTIFIER ::= {id-lsx 59}

-- Object identifiers for LDAP X.509 assertion syntaxes

-- id-ldx-certExactAssertion              OBJECT IDENTIFIER ::= {id-ldx 1} X.509|Part 8
-- id-ldx-certAssertion                   OBJECT IDENTIFIER ::= {id-ldx 2} X.509|Part 8
-- id-ldx-certPairExactAssertion          OBJECT IDENTIFIER ::= {id-ldx 3} X.509|Part 8
-- id-ldx-certPairAssertion               OBJECT IDENTIFIER ::= {id-ldx 4} X.509|Part 8
-- id-ldx-certListExactAssertion          OBJECT IDENTIFIER ::= {id-ldx 5} X.509|Part 8
-- id-ldx-certListAssertion               OBJECT IDENTIFIER ::= {id-ldx 6} X.509|Part 8
-- id-ldx-algorithmIdentifier             OBJECT IDENTIFIER ::= {id-ldx 7} X.509|Part 8
-- id-lsx-x509SupportedPublicKeyAlgorithms

id-oidC1                                  OBJECT IDENTIFIER ::= {id 0}
id-oidC2                                  OBJECT IDENTIFIER ::= {id 1}
id-oidC                                   OBJECT IDENTIFIER ::= {id 2}


-- Control  attributes

id-cat-sequenceMatchType                  OBJECT IDENTIFIER ::= {id-cat 1}
id-cat-wordMatchType                      OBJECT IDENTIFIER ::= {id-cat 2}
id-cat-characterMatchTypes                OBJECT IDENTIFIER ::= {id-cat 3}
id-cat-selectedContexts                   OBJECT IDENTIFIER ::= {id-cat 4}

-- Notification attributes

id-not-dSAProblem                         OBJECT IDENTIFIER ::= {id-not 0}
id-not-searchServiceProblem               OBJECT IDENTIFIER ::= {id-not 1}
id-not-serviceType                        OBJECT IDENTIFIER ::= {id-not 2}
id-not-attributeTypeList                  OBJECT IDENTIFIER ::= {id-not 3}
id-not-matchingRuleList                   OBJECT IDENTIFIER ::= {id-not 4}
id-not-filterItem                         OBJECT IDENTIFIER ::= {id-not 5}
id-not-attributeCombinations              OBJECT IDENTIFIER ::= {id-not 6}
id-not-contextTypeList                    OBJECT IDENTIFIER ::= {id-not 7}
id-not-contextList                        OBJECT IDENTIFIER ::= {id-not 8}
id-not-contextCombinations                OBJECT IDENTIFIER ::= {id-not 9}
id-not-hierarchySelectList                OBJECT IDENTIFIER ::= {id-not 10}
id-not-searchControlOptionsList           OBJECT IDENTIFIER ::= {id-not 11}
id-not-serviceControlOptionsList          OBJECT IDENTIFIER ::= {id-not 12}
id-not-multipleMatchingLocalities         OBJECT IDENTIFIER ::= {id-not 13}
id-not-proposedRelaxation                 OBJECT IDENTIFIER ::= {id-not 14}
id-not-appliedRelaxation                  OBJECT IDENTIFIER ::= {id-not 15}
id-not-pwdResponse                        OBJECT IDENTIFIER ::= {id-not 16}
id-not-ldapDiagnosticMsg                  OBJECT IDENTIFIER ::= {id-not 17}

-- Problem definitions

id-pr-targetDsaUnavailable                OBJECT IDENTIFIER ::= {id-pr 1}
id-pr-dataSourceUnavailable               OBJECT IDENTIFIER ::= {id-pr 2}
id-pr-unidentifiedOperation               OBJECT IDENTIFIER ::= {id-pr 3}
id-pr-unavailableOperation                OBJECT IDENTIFIER ::= {id-pr 4}
id-pr-searchAttributeViolation            OBJECT IDENTIFIER ::= {id-pr 5}
id-pr-searchAttributeCombinationViolation OBJECT IDENTIFIER ::= {id-pr 6}
id-pr-searchValueNotAllowed               OBJECT IDENTIFIER ::= {id-pr 7}
id-pr-missingSearchAttribute              OBJECT IDENTIFIER ::= {id-pr 8}
id-pr-searchValueViolation                OBJECT IDENTIFIER ::= {id-pr 9}
id-pr-attributeNegationViolation          OBJECT IDENTIFIER ::= {id-pr 10}
id-pr-searchValueRequired                 OBJECT IDENTIFIER ::= {id-pr 11}
id-pr-invalidSearchValue                  OBJECT IDENTIFIER ::= {id-pr 12}
id-pr-searchContextViolation              OBJECT IDENTIFIER ::= {id-pr 13}
id-pr-searchContextCombinationViolation   OBJECT IDENTIFIER ::= {id-pr 14}
id-pr-missingSearchContext                OBJECT IDENTIFIER ::= {id-pr 15}
id-pr-searchContextValueViolation         OBJECT IDENTIFIER ::= {id-pr 16}
id-pr-searchContextValueRequired          OBJECT IDENTIFIER ::= {id-pr 17}
id-pr-invalidContextSearchValue           OBJECT IDENTIFIER ::= {id-pr 18}
id-pr-unsupportedMatchingRule             OBJECT IDENTIFIER ::= {id-pr 19}
id-pr-attributeMatchingViolation          OBJECT IDENTIFIER ::= {id-pr 20}
id-pr-unsupportedMatchingUse              OBJECT IDENTIFIER ::= {id-pr 21}
id-pr-matchingUseViolation                OBJECT IDENTIFIER ::= {id-pr 22}
id-pr-hierarchySelectForbidden            OBJECT IDENTIFIER ::= {id-pr 23}
id-pr-invalidHierarchySelect              OBJECT IDENTIFIER ::= {id-pr 24}
id-pr-unavailableHierarchySelect          OBJECT IDENTIFIER ::= {id-pr 25}
id-pr-invalidSearchControlOptions         OBJECT IDENTIFIER ::= {id-pr 26}
id-pr-invalidServiceControlOptions        OBJECT IDENTIFIER ::= {id-pr 27}
id-pr-searchSubsetViolation               OBJECT IDENTIFIER ::= {id-pr 28}
id-pr-unmatchedKeyAttributes              OBJECT IDENTIFIER ::= {id-pr 29}
id-pr-ambiguousKeyAttributes              OBJECT IDENTIFIER ::= {id-pr 30}
id-pr-unavailableRelaxationLevel          OBJECT IDENTIFIER ::= {id-pr 31}
id-pr-emptyHierarchySelection             OBJECT IDENTIFIER ::= {id-pr 32}
id-pr-administratorImposedLimit           OBJECT IDENTIFIER ::= {id-pr 33}
id-pr-permanentRestriction                OBJECT IDENTIFIER ::= {id-pr 34}
id-pr-temporaryRestriction                OBJECT IDENTIFIER ::= {id-pr 35}
id-pr-relaxationNotSupported              OBJECT IDENTIFIER ::= {id-pr 36}

id-coat-uid                               OBJECT IDENTIFIER ::= {id-coat 1}
id-coat-dc                                OBJECT IDENTIFIER ::= {id-coat 25}

-- Matching rules

-- id-mr-objectIdentifierMatch            OBJECT IDENTIFIER ::= {id-mr 0} X.501|Part2
-- id-mr-distinguishedNameMatch           OBJECT IDENTIFIER ::= {id-mr 1} X.501|Part2
id-mr-caseIgnoreMatch                     OBJECT IDENTIFIER ::= {id-mr 2}
id-mr-caseIgnoreOrderingMatch             OBJECT IDENTIFIER ::= {id-mr 3}
id-mr-caseIgnoreSubstringsMatch           OBJECT IDENTIFIER ::= {id-mr 4}
id-mr-caseExactMatch                      OBJECT IDENTIFIER ::= {id-mr 5}
id-mr-caseExactOrderingMatch              OBJECT IDENTIFIER ::= {id-mr 6}
id-mr-caseExactSubstringsMatch            OBJECT IDENTIFIER ::= {id-mr 7}
id-mr-numericStringMatch                  OBJECT IDENTIFIER ::= {id-mr 8}
id-mr-numericStringOrderingMatch          OBJECT IDENTIFIER ::= {id-mr 9}
id-mr-numericStringSubstringsMatch        OBJECT IDENTIFIER ::= {id-mr 10}
id-mr-caseIgnoreListMatch                 OBJECT IDENTIFIER ::= {id-mr 11}
id-mr-caseIgnoreListSubstringsMatch       OBJECT IDENTIFIER ::= {id-mr 12}
id-mr-booleanMatch                        OBJECT IDENTIFIER ::= {id-mr 13}
id-mr-integerMatch                        OBJECT IDENTIFIER ::= {id-mr 14}
id-mr-integerOrderingMatch                OBJECT IDENTIFIER ::= {id-mr 15}
id-mr-bitStringMatch                      OBJECT IDENTIFIER ::= {id-mr 16}
id-mr-octetStringMatch                    OBJECT IDENTIFIER ::= {id-mr 17}
id-mr-octetStringOrderingMatch            OBJECT IDENTIFIER ::= {id-mr 18}
id-mr-octetStringSubstringsMatch          OBJECT IDENTIFIER ::= {id-mr 19}
id-mr-telephoneNumberMatch                OBJECT IDENTIFIER ::= {id-mr 20}
id-mr-telephoneNumberSubstringsMatch      OBJECT IDENTIFIER ::= {id-mr 21}
id-mr-presentationAddressMatch            OBJECT IDENTIFIER ::= {id-mr 22}
id-mr-uniqueMemberMatch                   OBJECT IDENTIFIER ::= {id-mr 23}
id-mr-protocolInformationMatch            OBJECT IDENTIFIER ::= {id-mr 24}
id-mr-uTCTimeMatch                        OBJECT IDENTIFIER ::= {id-mr 25}
id-mr-uTCTimeOrderingMatch                OBJECT IDENTIFIER ::= {id-mr 26}
id-mr-generalizedTimeMatch                OBJECT IDENTIFIER ::= {id-mr 27}
id-mr-generalizedTimeOrderingMatch        OBJECT IDENTIFIER ::= {id-mr 28}
id-mr-integerFirstComponentMatch          OBJECT IDENTIFIER ::= {id-mr 29}
id-mr-objectIdentifierFirstComponentMatch OBJECT IDENTIFIER ::= {id-mr 30}
id-mr-directoryStringFirstComponentMatch  OBJECT IDENTIFIER ::= {id-mr 31}
id-mr-wordMatch                           OBJECT IDENTIFIER ::= {id-mr 32}
id-mr-keywordMatch                        OBJECT IDENTIFIER ::= {id-mr 33}
-- id-mr-certificateExactMatch            OBJECT IDENTIFIER ::= {id-mr 34} X.509|Part8
-- id-mr-certificateMatch                 OBJECT IDENTIFIER ::= {id-mr 35} X.509|Part8
-- id-mr-certificatePairExactMatch        OBJECT IDENTIFIER ::= {id-mr 36} X.509|Part8
-- id-mr-certificatePairMatch             OBJECT IDENTIFIER ::= {id-mr 37} X.509|Part8
-- id-mr-certificateListExactMatch        OBJECT IDENTIFIER ::= {id-mr 38} X.509|Part8
-- id-mr-certificateListMatch             OBJECT IDENTIFIER ::= {id-mr 39} X.509|Part8
-- id-mr-algorithmIdentifierMatch         OBJECT IDENTIFIER ::= {id-mr 40} X.509|Part8
id-mr-storedPrefixMatch                   OBJECT IDENTIFIER ::= {id-mr 41}
-- id-mr-attributeCertificateMatch        OBJECT IDENTIFIER ::= {id-mr 42} X.509|Part8
-- id-mr-readerAndKeyIDMatch              OBJECT IDENTIFIER ::= {id-mr 43}
-- id-mr-attributeIntegrityMatch          OBJECT IDENTIFIER ::= {id-mr 44}
-- id-mr-attributeCertificateExactMatch   OBJECT IDENTIFIER ::= {id-mr 45} X.509|Part8
-- id-mr-holderIssuerMatch                OBJECT IDENTIFIER ::= {id-mr 46} X.509|Part8
id-mr-systemProposedMatch                 OBJECT IDENTIFIER ::= {id-mr 47}
id-mr-generalWordMatch                    OBJECT IDENTIFIER ::= {id-mr 48}
id-mr-approximateStringMatch              OBJECT IDENTIFIER ::= {id-mr 49}
id-mr-ignoreIfAbsentMatch                 OBJECT IDENTIFIER ::= {id-mr 50}
id-mr-nullMatch                           OBJECT IDENTIFIER ::= {id-mr 51}
id-mr-zonalMatch                          OBJECT IDENTIFIER ::= {id-mr 52}
-- id-mr-authAttIdMatch                   OBJECT IDENTIFIER ::= {id-mr 53} X.509|Part8
-- id-mr-roleSpecCertIdMatch              OBJECT IDENTIFIER ::= {id-mr 54} X.509|Part8
-- id-mr-basicAttConstraintsMatch         OBJECT IDENTIFIER ::= {id-mr 55} X.509|Part8
-- id-mr-delegatedNameConstraintsMatch    OBJECT IDENTIFIER ::= {id-mr 56} X.509|Part8
-- id-mr-timeSpecMatch                    OBJECT IDENTIFIER ::= {id-mr 57} X.509|Part8
-- id-mr-attDescriptorMatch               OBJECT IDENTIFIER ::= {id-mr 58} X.509|Part8
-- id-mr-acceptableCertPoliciesMatch      OBJECT IDENTIFIER ::= {id-mr 59} X.509|Part8
-- id-mr-policyMatch                      OBJECT IDENTIFIER ::= {id-mr 60} X.509|Part8
-- id-mr-delegationPathMatch              OBJECT IDENTIFIER ::= {id-mr 61} X.509|Part8
-- id-mr-pkiPathMatch                     OBJECT IDENTIFIER ::= {id-mr 62} X.509|Part8
id-mr-facsimileNumberMatch                OBJECT IDENTIFIER ::= {id-mr 63}
id-mr-facsimileNumberSubstringsMatch      OBJECT IDENTIFIER ::= {id-mr 64}
-- id-mr-enhancedCertificateMatch         OBJECT IDENTIFIER ::= {id-mr 65} X.509|Part8
-- id-mr-sOAIdentifierMatch               OBJECT IDENTIFIER ::= {id-mr 66} X.509|Part8
-- id-mr-extensionPresenceMatch           OBJECT IDENTIFIER ::= {id-mr 67} X.509|Part8
id-mr-uuidpairmatch                       OBJECT IDENTIFIER ::= {id-mr 68}
-- id-mr-dualStringMatch                  OBJECT IDENTIFIER ::= {id-mr 69} X.509|Part8
id-mr-uriMatch                            OBJECT IDENTIFIER ::= {id-mr 70}
-- id-mr-userPwdMatch                     OBJECT IDENTIFIER ::= {id-mr 71} Annex B
-- id-mr-pwdEncAlgMatch                   OBJECT IDENTIFIER ::= {id-mr 72} Annex B
-- id-mr-userPwdHistoryMatch              OBJECT IDENTIFIER ::= {id-mr 73} Annex B
id-mr-dnsNameMatch                        OBJECT IDENTIFIER ::= {id-mr 74}
id-mr-intEmailMatch                       OBJECT IDENTIFIER ::= {id-mr 75}
id-mr-jidMatch                            OBJECT IDENTIFIER ::= {id-mr 76}

-- LDAP defined matching rules

id-lmr-caseExactIA5Match                  OBJECT IDENTIFIER ::= {id-lmr 1}
id-lmr-caseIgnoreIA5Match                 OBJECT IDENTIFIER ::= {id-lmr 2}
id-lmr-caseIgnoreIA5SubstringsMatch       OBJECT IDENTIFIER ::= {id-lmr 3}

-- contexts

id-avc-language                           OBJECT IDENTIFIER ::= {id-avc 0}
id-avc-temporal                           OBJECT IDENTIFIER ::= {id-avc 1}
id-avc-locale                             OBJECT IDENTIFIER ::= {id-avc 2}
-- id-avc-attributeValueSecurityLabelContext
--                                        OBJECT IDENTIFIER ::= {id-avc 3}
-- id-avc-attributeValueIntegrityInfoContext
--                                        OBJECT IDENTIFIER ::= {id-avc 4}
id-avc-ldapAttributeOption                OBJECT IDENTIFIER ::= {id-avc 5}

END -- SelectedAttributeTypes

UpperBounds {joint-iso-itu-t ds(5) module(1) upperBounds(10) 7}
DEFINITIONS ::=
BEGIN

-- EXPORTS All
/*
The types and values defined in this module are exported for use in the other ASN.1
modules contained within these Directory Specifications, and for the use of other
applications which will use them to access Directory services. Other applications
may use them for their own purposes, but this will not constrain extensions and
modifications needed to maintain or improve the Directory service.
*/
ub-answerback                              INTEGER ::=  8
ub-business-category                       INTEGER ::= 128
ub-common-name                             INTEGER ::= 64
ub-content                                 INTEGER ::= 32768
ub-country-code                            INTEGER ::= 4
ub-description                             INTEGER ::= 1024
ub-destination-indicator                   INTEGER ::= 128
ub-directory-string-first-component-match  INTEGER ::= 32768
ub-domainLocalID                           INTEGER ::= 64
ub-international-isdn-number               INTEGER ::= 16
ub-knowledge-information                   INTEGER ::= 32768
ub-labeledURI                              INTEGER ::= 32768
ub-localeContextSyntax                     INTEGER ::= 128
ub-locality-name                           INTEGER ::= 128
ub-match                                   INTEGER ::= 128
ub-name                                    INTEGER ::= 128
ub-organization-name                       INTEGER ::= 64
ub-organizational-unit-name                INTEGER ::= 64
ub-physical-office-name                    INTEGER ::= 128
ub-post-office-box                         INTEGER ::= 40
ub-postal-code                             INTEGER ::= 40
ub-postal-line                             INTEGER ::= 6
ub-postal-string                           INTEGER ::= 30
ub-privacy-mark-length                     INTEGER ::= 128
ub-pseudonym                               INTEGER ::= 128
ub-saslMechanism                           INTEGER ::= 64
ub-schema                                  INTEGER ::= 1024
ub-search                                  INTEGER ::= 32768
ub-serial-number                           INTEGER ::= 64
ub-state-name                              INTEGER ::= 128
ub-street-address                          INTEGER ::= 128
ub-surname                                 INTEGER ::= 64
ub-tag                                     INTEGER ::= 64
ub-telephone-number                        INTEGER ::= 32
ub-teletex-terminal-id                     INTEGER ::= 1024
ub-telex-number                            INTEGER ::= 14
ub-title                                   INTEGER ::= 64
ub-user-password                           INTEGER ::= 128
ub-x121-address                            INTEGER ::= 15

END -- UpperBounds

SelectedObjectClasses {joint-iso-itu-t ds(5) module(1) selectedObjectClasses(6) 9}
DEFINITIONS ::=
BEGIN

--  EXPORTS All
/*
The types and values defined in this module are exported for use in the other ASN.1
modules contained within the Directory Specifications, and for the use of other
applications which will use them to access Directory services. Other applications may
use them for their own purposes, but this will not constrain extensions and
modifications needed to maintain or improve the Directory service.
*/
IMPORTS

  -- from Rec. ITU-T X.501 | ISO/IEC 9594-2

  id, id-nf, id-oc
    FROM UsefulDefinitions
      {joint-iso-itu-t ds(5) module(1) usefulDefinitions(0) 9} WITH SUCCESSORS

  alias, ATTRIBUTE, NAME-FORM, OBJECT-CLASS, top
    FROM InformationFramework
      {joint-iso-itu-t ds(5) module(1) informationFramework(1) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.520 | ISO/IEC 9594-6

  businessCategory, commonName, contentUrl, countryName, description,
  destinationIndicator, dmdName, epc, epcInUrn, facsimileTelephoneNumber,
  internationalISDNNumber, knowledgeInformation, localityName, member, oidC, oidC1,
  oidC2, organizationalUnitName, organizationName, owner, physicalDeliveryOfficeName,
  postalAddress, postalCode, postOfficeBox, preferredDeliveryMethod,
  presentationAddress, registeredAddress, roleOccupant, searchGuide, seeAlso,
  serialNumber, stateOrProvinceName, streetAddress, supportedApplicationContext,
  surname, tagAfi, tagLocation, tagOid, telephoneNumber, telexNumber, title, uii,
  uiiFormat, uiiInUrn, uniqueMember, urnC, x121Address
    FROM SelectedAttributeTypes
      {joint-iso-itu-t ds(5) module(1) selectedAttributeTypes(5) 9} WITH SUCCESSORS

-- from Rec. ITU-T X.509 | ISO/IEC 9594-8

  authorityRevocationList, cACertificate, certificateRevocationList,
  crossCertificatePair, deltaRevocationList, supportedAlgorithms,
  userCertificate, userPassword
    FROM AuthenticationFramework
      {joint-iso-itu-t ds(5) module(1) authenticationFramework(7) 9} WITH SUCCESSORS

  userPwd
    FROM PasswordPolicy
      {joint-iso-itu-t ds(5) module(1) passwordPolicy(39) 9} WITH SUCCESSORS ;

--  Attribute sets

TelecommunicationAttributeSet ATTRIBUTE ::=
  {facsimileTelephoneNumber |
   internationalISDNNumber |
   telephoneNumber |
   telexNumber |
   preferredDeliveryMethod |
   destinationIndicator |
   registeredAddress |
   x121Address}

PostalAttributeSet ATTRIBUTE ::=
  {physicalDeliveryOfficeName |
   postalAddress |
   postalCode |
   postOfficeBox |
   streetAddress}

LocaleAttributeSet ATTRIBUTE ::=
  {localityName |
   stateOrProvinceName |
   streetAddress}

OrganizationalAttributeSet ATTRIBUTE ::=
  {description |
   LocaleAttributeSet |
   PostalAttributeSet |
   TelecommunicationAttributeSet |
   businessCategory |
   seeAlso |
   searchGuide |
   userPassword}

--  Object classes

country OBJECT-CLASS ::= {
  SUBCLASS OF   {top}
  MUST CONTAIN  {countryName}
  MAY CONTAIN   {description |
                 searchGuide}
  LDAP-NAME     {"country"}  -- RFC 4519
  ID            id-oc-country }

locality OBJECT-CLASS ::= {
  SUBCLASS OF  {top}
  MAY CONTAIN  {description |
                searchGuide |
                LocaleAttributeSet |
                seeAlso}
  LDAP-NAME    {"locality"}  -- RFC 4519
  ID           id-oc-locality }

organization OBJECT-CLASS ::= {
  SUBCLASS OF   {top}
  MUST CONTAIN  {organizationName}
  MAY CONTAIN   {OrganizationalAttributeSet}
  LDAP-NAME     {"organization"}  -- RFC 4519
  ID            id-oc-organization }

organizationalUnit OBJECT-CLASS ::= {
  SUBCLASS OF   {top}
  MUST CONTAIN  {organizationalUnitName}
  MAY CONTAIN   {OrganizationalAttributeSet}
  LDAP-NAME     {"organizationalUnit"}  -- RFC 4519
  ID            id-oc-organizationalUnit }

person OBJECT-CLASS ::= {
  SUBCLASS OF   {top}
  MUST CONTAIN  {commonName |
                 surname}
  MAY CONTAIN   {description |
                 telephoneNumber |
                 userPassword |
                 seeAlso}
  LDAP-NAME     {"person"}  -- RFC 4519
  ID            id-oc-person }

organizationalPerson OBJECT-CLASS ::= {
  SUBCLASS OF  {person}
  MAY CONTAIN  {LocaleAttributeSet |
                PostalAttributeSet |
                TelecommunicationAttributeSet |
                organizationalUnitName |
                title}
  LDAP-NAME    {"organizationalPerson"}  -- RFC 4519
  ID           id-oc-organizationalPerson }

organizationalRole OBJECT-CLASS ::= {
  SUBCLASS OF   {top}
  MUST CONTAIN  {commonName}
  MAY CONTAIN   {description |
                 LocaleAttributeSet |
                 organizationalUnitName |
                 PostalAttributeSet |
                 preferredDeliveryMethod |
                 roleOccupant |
                 seeAlso |
                 TelecommunicationAttributeSet}
  LDAP-NAME      {"organizationalRole"}  -- RFC 4519
  ID            id-oc-organizationalRole }

groupOfNames OBJECT-CLASS ::= {
  SUBCLASS OF   {top}
  MUST CONTAIN  {commonName | member}
  MAY CONTAIN   {description |
                 organizationName |
                 organizationalUnitName |
                 owner |
                 seeAlso |
                 businessCategory}
  LDAP-NAME     {"groupOfNames"}  -- RFC 4519
  ID            id-oc-groupOfNames }

groupOfUniqueNames OBJECT-CLASS ::= {
  SUBCLASS OF   {top}
  MUST CONTAIN  {commonName |
                 uniqueMember}
  MAY CONTAIN   {description |
                 organizationName |
                 organizationalUnitName |
                 owner |
                 seeAlso |
                 businessCategory}
  LDAP-NAME     {"groupOfUniqueNames"}  -- RFC 4519
  ID            id-oc-groupOfUniqueNames }

residentialPerson OBJECT-CLASS ::= {
  SUBCLASS OF   {person}
  MUST CONTAIN  {localityName}
  MAY CONTAIN   {LocaleAttributeSet |
                 PostalAttributeSet |
                 preferredDeliveryMethod |
                 TelecommunicationAttributeSet |
                 businessCategory}
  LDAP-NAME     {"residentialPerson"}  -- RFC 4519
  ID            id-oc-residentialPerson }

applicationProcess OBJECT-CLASS ::= {
  SUBCLASS OF   {top}
  MUST CONTAIN  {commonName}
  MAY CONTAIN   {description |
                 localityName |
                 organizationalUnitName |
                 seeAlso}
  LDAP-NAME     {"applicationProcess"}   -- RFC 4519
  ID            id-oc-applicationProcess }

applicationEntity OBJECT-CLASS ::= {
  SUBCLASS OF   {top}
  MUST CONTAIN  {commonName |
                 presentationAddress}
  MAY CONTAIN   {description |
                 localityName |
                 organizationName |
                 organizationalUnitName |
                 seeAlso |
                 supportedApplicationContext}
  LDAP-NAME     {"applicationEntity"} -- RFC 2256
  ID            id-oc-applicationEntity }

dSA OBJECT-CLASS ::= {
  SUBCLASS OF   {applicationEntity}
  MAY CONTAIN   {knowledgeInformation}
  LDAP-NAME     {"dSA"} -- RFC 2256
  ID            id-oc-dSA }

device OBJECT-CLASS ::= {
  SUBCLASS OF   {top}
  MUST CONTAIN  {commonName}
  MAY CONTAIN   {description |
                 localityName |
                 organizationName |
                 organizationalUnitName |
                 owner |
                 seeAlso |
                 serialNumber}
  LDAP-NAME      {"device"}  -- RFC 4519
  ID            id-oc-device }

strongAuthenticationUser OBJECT-CLASS ::= {
  SUBCLASS OF   {top}
  KIND          auxiliary
  MUST CONTAIN  {userCertificate}
  LDAP-NAME     {"strongAuthenticationUser"} -- RFC 4523
  LDAP-DESC     {"X.521 strong authentication user"}
  ID            id-oc-strongAuthenticationUser }

userSecurityInformation OBJECT-CLASS ::= {
  SUBCLASS OF   {top}
  KIND          auxiliary
  MAY CONTAIN   {supportedAlgorithms}
  LDAP-NAME     {"userSecurityInformation"} -- RFC 4523
  LDAP-DESC     {"X.521 user security information"}
  ID            id-oc-userSecurityInformation }

userPwdClass  OBJECT-CLASS  ::=  {
  KIND          auxiliary
  MAY CONTAIN   { userPwd }
  ID            id-oc-userPwdClass }

certificationAuthority OBJECT-CLASS ::= {
  SUBCLASS OF   {top}
  KIND          auxiliary
  MUST CONTAIN  {cACertificate |
                 certificateRevocationList |
                 authorityRevocationList}
  MAY CONTAIN   {crossCertificatePair}
  LDAP-NAME     {"certificationAuthority"} -- RFC 4523
  LDAP-DESC     {"X.509 certificate authority"}
  ID            id-oc-certificationAuthority }

certificationAuthority-V2 OBJECT-CLASS ::= {
  SUBCLASS OF   {certificationAuthority}
  KIND          auxiliary
  MAY CONTAIN   {deltaRevocationList}
  LDAP-NAME     {"certificationAuthority-V2"}
  LDAP-DESC     {"X.509 certificate authority, version 2"} -- RFC 4523
  ID            id-oc-certificationAuthority-V2 }

dMD OBJECT-CLASS ::= {
  SUBCLASS OF   {top}
  MUST CONTAIN  {dmdName}
  MAY CONTAIN   {OrganizationalAttributeSet}
  LDAP-NAME     {"dmd"} -- RFC 2256
  ID            id-oc-dmd }

oidC1obj OBJECT-CLASS ::= {
  SUBCLASS OF   {top}
  MUST CONTAIN  {oidC}
  LDAP-NAME     {"oidC1obj"}
  ID            id-oc-oidC1obj }

oidC2obj OBJECT-CLASS ::= {
  SUBCLASS OF   {top}
  MUST CONTAIN  {oidC}
  LDAP-NAME     {"oidC2obj"}
  ID            id-oc-oidC2obj }

oidCobj OBJECT-CLASS ::= {
  SUBCLASS OF   {top}
  MUST CONTAIN  {oidC}
  LDAP-NAME     {"oidCobj"}
  ID            id-oc-oidCobj }

oidRoot OBJECT-CLASS ::= {
  SUBCLASS OF   {alias}
  MUST CONTAIN  { oidC1 | oidC2 | oidC}
  LDAP-NAME     {"oidRoot"}
  ID            id-oidRoot }

oidArc OBJECT-CLASS ::= {
  SUBCLASS OF   {alias}
  MUST CONTAIN  {oidC}
  LDAP-NAME     {"oidArc"}
  ID            id-oidArc }

urnCobj OBJECT-CLASS ::= {
  SUBCLASS OF   {top}
  MUST CONTAIN  { urnC }
  LDAP-NAME     {"urnCobj"}
  ID            id-oc-urnCobj }

isoTagInfo OBJECT-CLASS ::= {
  SUBCLASS OF  { top }
  KIND         auxiliary
  MAY CONTAIN  { tagOid |
                 tagAfi |
                 uii |
                 uiiInUrn |
                 contentUrl |
                 tagLocation }
  LDAP-NAME    {"isoTagInfo"}
  ID           id-oc-isoTagInfo }

isoTagType  OBJECT-CLASS ::= {
  SUBCLASS OF  { top }
  KIND         auxiliary
  MAY CONTAIN  { tagOid |
                 tagAfi |
                 uiiFormat }
  LDAP-NAME    {"isoTagType"}
  ID           id-oc-isoTagType }

epcTagInfoObj OBJECT-CLASS ::= {
  SUBCLASS OF  { top }
  KIND         auxiliary
  MAY CONTAIN  { epc |
                 epcInUrn |
                 contentUrl |
                 tagLocation }
  LDAP-NAME    {"epcTagInfoObj"}
  ID           id-oc-epcTagInfoObj }

epcTagTypeObj OBJECT-CLASS ::= {
  SUBCLASS OF  { top }
  KIND         auxiliary
  MAY CONTAIN  { uiiFormat }
  LDAP-NAME    {"epcTagTypeObj"}
  ID           id-oc-epcTagTypeObj }

--  Name forms

countryNameForm NAME-FORM ::= {
  NAMES            country
  WITH ATTRIBUTES  {countryName}
  ID               id-nf-countryNameForm }

locNameForm NAME-FORM ::= {
  NAMES            locality
  WITH ATTRIBUTES  {localityName}
  ID               id-nf-locNameForm }

sOPNameForm NAME-FORM ::= {
  NAMES            locality
  WITH ATTRIBUTES  {stateOrProvinceName}
  ID               id-nf-sOPNameForm }

orgNameForm NAME-FORM ::= {
  NAMES            organization
  WITH ATTRIBUTES  {organizationName}
  ID               id-nf-orgNameForm }

orgUnitNameForm NAME-FORM ::= {
  NAMES            organizationalUnit
  WITH ATTRIBUTES  {organizationalUnitName}
  ID               id-nf-orgUnitNameForm }

personNameForm NAME-FORM ::= {
  NAMES            person
  WITH ATTRIBUTES  {commonName}
  ID               id-nf-personNameForm }

orgPersonNameForm NAME-FORM ::= {
  NAMES            organizationalPerson
  WITH ATTRIBUTES  {commonName}
  AND OPTIONALLY   {organizationalUnitName}
  ID               id-nf-orgPersonNameForm }

orgRoleNameForm NAME-FORM ::= {
  NAMES            organizationalRole
  WITH ATTRIBUTES  {commonName}
  ID               id-nf-orgRoleNameForm }

gONNameForm NAME-FORM ::= {
  NAMES            groupOfNames
  WITH ATTRIBUTES  {commonName}
  ID               id-nf-gONNameForm }

resPersonNameForm NAME-FORM ::= {
  NAMES            residentialPerson
  WITH ATTRIBUTES  {commonName}
  AND OPTIONALLY   {streetAddress}
  ID               id-nf-resPersonNameForm }

applProcessNameForm NAME-FORM ::= {
  NAMES            applicationProcess
  WITH ATTRIBUTES  {commonName}
  ID               id-nf-applProcessNameForm }

applEntityNameForm NAME-FORM ::= {
  NAMES            applicationEntity
  WITH ATTRIBUTES  {commonName}
  ID               id-nf-applEntityNameForm }

dSANameForm NAME-FORM ::= {
  NAMES            dSA
  WITH ATTRIBUTES  {commonName}
  ID               id-nf-dSANameForm }

deviceNameForm NAME-FORM ::= {
  NAMES            device
  WITH ATTRIBUTES  {commonName}
  ID               id-nf-deviceNameForm }

dMDNameForm NAME-FORM ::= {
  NAMES            dMD
  WITH ATTRIBUTES  {dmdName}
  ID               id-nf-dMDNameForm }

oidC1NameForm NAME-FORM ::= {
  NAMES            oidCobj
  WITH ATTRIBUTES  {oidC}
  ID               id-nf-oidC1NameForm }

oidC2NameForm NAME-FORM ::= {
  NAMES            oidCobj
  WITH ATTRIBUTES  {oidC}
  ID               id-nf-oidC2NameForm }

oidCNameForm NAME-FORM ::= {
  NAMES            oidCobj
  WITH ATTRIBUTES  {oidC}
  ID               id-nf-oidCNameForm }

urnCNameForm NAME-FORM ::= {
  NAMES            urnCobj
  WITH ATTRIBUTES  {urnC}
  ID               id-nf-urnCNameForm }

oidRootNf NAME-FORM ::= {
  NAMES            oidRoot
  WITH ATTRIBUTES  {oidC1 | oidC2 | oidC}
  ID               id-oidRootNf }

oidArcNf NAME-FORM ::= {
  NAMES            oidArc
  WITH ATTRIBUTES  {oidC}
  ID               id-oidArcNf }

--  Object identifier assignments
--  object identifiers assigned in other modules are shown in comments

--  Object classes

--  id-oc-top                  OBJECT IDENTIFIER ::= {id-oc 0} Defined in X.501 | Part 2
--  id-oc-alias                OBJECT IDENTIFIER ::= {id-oc 1} Defined in X.501 | Part 2
id-oc-country                  OBJECT IDENTIFIER ::= {id-oc 2}
id-oc-locality                 OBJECT IDENTIFIER ::= {id-oc 3}
id-oc-organization             OBJECT IDENTIFIER ::= {id-oc 4}
id-oc-organizationalUnit       OBJECT IDENTIFIER ::= {id-oc 5}
id-oc-person                   OBJECT IDENTIFIER ::= {id-oc 6}
id-oc-organizationalPerson     OBJECT IDENTIFIER ::= {id-oc 7}
id-oc-organizationalRole       OBJECT IDENTIFIER ::= {id-oc 8}
id-oc-groupOfNames             OBJECT IDENTIFIER ::= {id-oc 9}
id-oc-residentialPerson        OBJECT IDENTIFIER ::= {id-oc 10}
id-oc-applicationProcess       OBJECT IDENTIFIER ::= {id-oc 11}
id-oc-applicationEntity        OBJECT IDENTIFIER ::= {id-oc 12}
id-oc-dSA                      OBJECT IDENTIFIER ::= {id-oc 13}
id-oc-device                   OBJECT IDENTIFIER ::= {id-oc 14}
id-oc-strongAuthenticationUser OBJECT IDENTIFIER ::= {id-oc 15} -- Deprecated, see 6.15
id-oc-certificationAuthority   OBJECT IDENTIFIER ::= {id-oc 16} -- Deprecated, see 6.17
id-oc-certificationAuthority-V2
                               OBJECT IDENTIFIER ::= {id-oc 16 2} -- Deprecated, see 6.18
id-oc-groupOfUniqueNames       OBJECT IDENTIFIER ::= {id-oc 17}
id-oc-userSecurityInformation  OBJECT IDENTIFIER ::= {id-oc 18}
-- id-oc-cRLDistributionPoint  OBJECT IDENTIFIER ::= {id-oc 19} Defined in X.509 | Part 8
id-oc-dmd                      OBJECT IDENTIFIER ::= {id-oc 20}
-- id-oc-pkiUser               OBJECT IDENTIFIER ::= {id-oc 21} Defined in X.509 | Part 8
-- id-oc-pkiCA                 OBJECT IDENTIFIER ::= {id-oc 22} Defined in X.509 | Part 8
-- id-oc-deltaCRL              OBJECT IDENTIFIER ::= {id-oc 23} Defined in X.509 | Part 8
-- id-oc-pmiUser               OBJECT IDENTIFIER ::= {id-oc 24} Defined in X.509 | Part 8
-- id-oc-pmiAA                 OBJECT IDENTIFIER ::= {id-oc 25} Defined in X.509 | Part 8
-- id-oc-pmiSOA                OBJECT IDENTIFIER ::= {id-oc 26} Defined in X.509 | Part 8
-- id-oc-attCertCRLDistributionPts
--                             OBJECT IDENTIFIER ::= {id-oc 27} Defined in X.509 | Part 8
-- id-oc-parent                OBJECT IDENTIFIER ::= {id-oc 28} Defined in X.501 | Part 2
-- id-oc-child                 OBJECT IDENTIFIER ::= {id-oc 29} Defined in X.501 | Part 2
-- id-oc-cpCps                 OBJECT IDENTIFIER ::= {id-oc 30} Defined in X.509 | Part 8
-- id-oc-pkiCertPath           OBJECT IDENTIFIER ::= {id-oc 31} Defined in X.509 | Part 8
-- id-oc-privilegePolicy       OBJECT IDENTIFIER ::= {id-oc 32} Defined in X.509 | Part 8
-- id-oc-pmiDelegationPath     OBJECT IDENTIFIER ::= {id-oc 33} Defined in X.509 | Part 8
-- id-oc-protectedPrivilegePolicy
--                             OBJECT IDENTIFIER ::= {id-oc 34} Defined in X.509 | Part 8
id-oc-oidC1obj                 OBJECT IDENTIFIER ::= {id-oc 35}
id-oc-oidC2obj                 OBJECT IDENTIFIER ::= {id-oc 36}
id-oc-oidCobj                  OBJECT IDENTIFIER ::= {id-oc 37}
id-oc-isoTagInfo               OBJECT IDENTIFIER ::= {id-oc 38}
id-oc-isoTagType               OBJECT IDENTIFIER ::= {id-oc 39}
-- id-oc-integrityInfo         OBJECT IDENTIFIER ::= {id-oc 40} Defined in X.501 | Part 2
id-oc-userPwdClass             OBJECT IDENTIFIER ::= {id-oc 41}
id-oc-urnCobj                  OBJECT IDENTIFIER ::= {id-oc 42}
id-oc-epcTagInfoObj            OBJECT IDENTIFIER ::= {id-oc 43}
id-oc-epcTagTypeObj            OBJECT IDENTIFIER ::= {id-oc 44}

id-oidRoot                     OBJECT IDENTIFIER ::= {id 3}
id-oidArc                      OBJECT IDENTIFIER ::= {id 5}

--  Name forms

id-nf-countryNameForm          OBJECT IDENTIFIER ::= {id-nf 0}
id-nf-locNameForm              OBJECT IDENTIFIER ::= {id-nf 1}
id-nf-sOPNameForm              OBJECT IDENTIFIER ::= {id-nf 2}
id-nf-orgNameForm              OBJECT IDENTIFIER ::= {id-nf 3}
id-nf-orgUnitNameForm          OBJECT IDENTIFIER ::= {id-nf 4}
id-nf-personNameForm           OBJECT IDENTIFIER ::= {id-nf 5}
id-nf-orgPersonNameForm        OBJECT IDENTIFIER ::= {id-nf 6}
id-nf-orgRoleNameForm          OBJECT IDENTIFIER ::= {id-nf 7}
id-nf-gONNameForm              OBJECT IDENTIFIER ::= {id-nf 8}
id-nf-resPersonNameForm        OBJECT IDENTIFIER ::= {id-nf 9}
id-nf-applProcessNameForm      OBJECT IDENTIFIER ::= {id-nf 10}
id-nf-applEntityNameForm       OBJECT IDENTIFIER ::= {id-nf 11}
id-nf-dSANameForm              OBJECT IDENTIFIER ::= {id-nf 12}
id-nf-deviceNameForm           OBJECT IDENTIFIER ::= {id-nf 13}
-- id-nf-cRLDistPtNameForm     OBJECT IDENTIFIER ::= {id-nf 14}
id-nf-dMDNameForm              OBJECT IDENTIFIER ::= {id-nf 15}
-- id-nf-subentryNameForm      OBJECT IDENTIFIER ::= {id-nf 16}
id-nf-oidC1NameForm            OBJECT IDENTIFIER ::= {id-nf 17}
id-nf-oidC2NameForm            OBJECT IDENTIFIER ::= {id-nf 18}
id-nf-oidCNameForm             OBJECT IDENTIFIER ::= {id-nf 19}
id-nf-urnCNameForm             OBJECT IDENTIFIER ::= {id-nf 20}

id-oidRootNf                   OBJECT IDENTIFIER ::= {id 4}
id-oidArcNf                    OBJECT IDENTIFIER ::= {id 6}

END -- SelectedObjectClasses

DirectoryShadowAbstractService {joint-iso-itu-t ds(5) module(1) directoryShadowAbstractService(15) 9}
DEFINITIONS IMPLICIT TAGS ::=
BEGIN

-- EXPORTS All
/*
The types and values defined in this module are exported for use in the other ASN.1
modules contained within the Directory Specifications, and for the use of other
applications which will use them to access directory services. Other applications
may use them for their own purposes, but this will not constrain extensions and
modifications needed to maintain or improve the directory service.
*/
IMPORTS

  -- from Rec. ITU-T X.501 | ISO/IEC 9594-2

  Attribute{}, AttributeType, CONTEXT, DistinguishedName,
  RelativeDistinguishedName, SubtreeSpecification, SupportedAttributes
    FROM InformationFramework
      {joint-iso-itu-t ds(5) module(1) informationFramework(1) 9} WITH SUCCESSORS

  OPERATIONAL-BINDING, OperationalBindingID
    FROM OperationalBindingManagement
      {joint-iso-itu-t ds(5) module(1) opBindingManagement(18) 9} WITH SUCCESSORS

  DSEType, SupplierAndConsumers
    FROM DSAOperationalAttributeTypes
      {joint-iso-itu-t ds(5) module(1) dsaOperationalAttributeTypes(22) 9} WITH SUCCESSORS

  OPTIONALLY-PROTECTED{}, OPTIONALLY-PROTECTED-SEQ{}
    FROM EnhancedSecurity
      {joint-iso-itu-t ds(5) modules(1) enhancedSecurity(28) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.511 | ISO/IEC 9594-3

  CommonResultsSeq, ContextSelection, EntryModification, SecurityParameters
    FROM DirectoryAbstractService
      {joint-iso-itu-t ds(5) module(1) directoryAbstractService(2) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.518 | ISO/IEC 9594-4

  AccessPoint, dSABind
    FROM DistributedOperations
      {joint-iso-itu-t ds(5) module(1) distributedOperations(3) 9} WITH SUCCESSORS

  -- from Rec. ITU-T X.519 | ISO/IEC 9594-5

  id-op-binding-shadow
    FROM DirectoryOperationalBindingTypes
      {joint-iso-itu-t ds(5) module(1) directoryOperationalBindingTypes(25) 9} WITH SUCCESSORS

  shadowConsumerInitiatedAC, shadowSupplierInitiatedAC
    FROM DirectoryOSIProtocols
      {joint-iso-itu-t ds(5) module(1) directoryOSIProtocols(37) 9} WITH SUCCESSORS

  ERROR, OPERATION, id-errcode-shadowError, id-opcode-coordinateShadowUpdate,
  id-opcode-requestShadowUpdate, id-opcode-updateShadow
    FROM CommonProtocolSpecification
      {joint-iso-itu-t ds(5) module(1) commonProtocolSpecification(35) 9} WITH SUCCESSORS
;

-- bind operation

dSAShadowBind OPERATION ::= dSABind

-- shadow operational binding

shadowOperationalBinding OPERATIONAL-BINDING ::= {
  AGREEMENT             ShadowingAgreementInfo
  APPLICATION CONTEXTS
    {{shadowSupplierInitiatedAC
      APPLIES TO  {All-operations-supplier-initiated}} |
    {shadowConsumerInitiatedAC
      APPLIES TO  {All-operations-consumer-initiated}}}
  ASYMMETRIC
    ROLE-A { -- shadow supplier role
      ESTABLISHMENT-INITIATOR  TRUE
      ESTABLISHMENT-PARAMETER  NULL
      MODIFICATION-INITIATOR   TRUE
      TERMINATION-INITIATOR    TRUE }
    ROLE-B { -- shadow consumer role
      ESTABLISHMENT-INITIATOR  TRUE
      ESTABLISHMENT-PARAMETER  NULL
      MODIFICATION-INITIATOR   TRUE
      MODIFICATION-PARAMETER   ModificationParameter
      TERMINATION-INITIATOR    TRUE}
  ID                    id-op-binding-shadow }

-- types

ModificationParameter ::= SEQUENCE {
  secondaryShadows  SET OF SupplierAndConsumers,
  ... }

AgreementID ::= OperationalBindingID

ShadowingAgreementInfo ::= SEQUENCE {
  shadowSubject          UnitOfReplication,
  updateMode             UpdateMode DEFAULT supplierInitiated:onChange:TRUE,
  master                 AccessPoint OPTIONAL,
  secondaryShadows  [2]  BOOLEAN DEFAULT FALSE }

UnitOfReplication ::= SEQUENCE {
  area                 AreaSpecification,
  attributes           AttributeSelection,
  knowledge            Knowledge OPTIONAL,
  subordinates         BOOLEAN DEFAULT FALSE,
  contextSelection     ContextSelection OPTIONAL,
  supplyContexts  [0]  CHOICE {
    allContexts         NULL,
    selectedContexts    SET SIZE (1..MAX) OF CONTEXT.&id,
    ... } OPTIONAL }

AreaSpecification ::= SEQUENCE {
  contextPrefix    DistinguishedName,
  replicationArea  SubtreeSpecification,
  ... }

Knowledge ::= SEQUENCE {
  knowledgeType      ENUMERATED {
    master (0),
    shadow (1),
    both   (2)},
  extendedKnowledge  BOOLEAN DEFAULT FALSE,
  ... }

AttributeSelection ::= SET OF ClassAttributeSelection

ClassAttributeSelection ::= SEQUENCE {
  class            OBJECT IDENTIFIER OPTIONAL,
  classAttributes  ClassAttributes DEFAULT allAttributes:NULL }

ClassAttributes ::= CHOICE {
  allAttributes  NULL,
  include        [0]  AttributeTypes,
  exclude        [1]  AttributeTypes,
  ... }

AttributeTypes ::= SET OF AttributeType

UpdateMode ::= CHOICE {
  supplierInitiated  [0]  SupplierUpdateMode,
  consumerInitiated  [1]  ConsumerUpdateMode,
  ... }

SupplierUpdateMode ::= CHOICE {
  onChange   BOOLEAN,
  scheduled  SchedulingParameters,
  ... }

ConsumerUpdateMode ::= SchedulingParameters

SchedulingParameters ::= SEQUENCE {
  periodic    PeriodicStrategy OPTIONAL, -- shall be present if othertimes
  --                                        is set to FALSE
  othertimes  BOOLEAN DEFAULT FALSE,
  ... }

PeriodicStrategy ::= SEQUENCE {
  beginTime       Time OPTIONAL,
  windowSize      INTEGER,
  updateInterval  INTEGER,
  ... }

Time ::= GeneralizedTime
-- as per 46.3 b) and c) of Rec. ITU-T X.680 | ISO/IEC 8824-1

-- shadow operations, arguments, and results

All-operations-consumer-initiated OPERATION ::=
  {requestShadowUpdate | updateShadow}

All-operations-supplier-initiated OPERATION ::=
  {coordinateShadowUpdate | updateShadow}

coordinateShadowUpdate OPERATION ::= {
  ARGUMENT  CoordinateShadowUpdateArgument
  RESULT    CoordinateShadowUpdateResult
  ERRORS    {shadowError}
  CODE      id-opcode-coordinateShadowUpdate
}

CoordinateShadowUpdateArgument ::=
  OPTIONALLY-PROTECTED { CoordinateShadowUpdateArgumentData }

CoordinateShadowUpdateArgumentData ::= [0]  SEQUENCE {
  agreementID         AgreementID,
  lastUpdate          Time OPTIONAL,
  updateStrategy      CHOICE {
    standard            ENUMERATED {
      noChanges   (0),
      incremental (1),
      total       (2),
      ...},
    other               EXTERNAL,
    ...},
  securityParameters  SecurityParameters OPTIONAL,
  ...}

CoordinateShadowUpdateResult ::= CHOICE {
  null         NULL,
  information  OPTIONALLY-PROTECTED{ CoordinateShadowUpdateResultData },
  ...}

CoordinateShadowUpdateResultData ::= [0]  SEQUENCE {
  agreementID  AgreementID,
  lastUpdate   Time OPTIONAL,
  ...,
  ...,
  COMPONENTS OF CommonResultsSeq }

requestShadowUpdate OPERATION ::= {
  ARGUMENT  RequestShadowUpdateArgument
  RESULT    RequestShadowUpdateResult
  ERRORS    {shadowError}
  CODE      id-opcode-requestShadowUpdate
}

RequestShadowUpdateArgument ::= OPTIONALLY-PROTECTED { RequestShadowUpdateArgumentData }

RequestShadowUpdateArgumentData ::= [0]  SEQUENCE {
  agreementID         AgreementID,
  lastUpdate          Time OPTIONAL,
  requestedStrategy   CHOICE {
    standard  ENUMERATED {
      incremental (1),
      total       (2),
      ...},
    other     EXTERNAL,
    ...},
  securityParameters  SecurityParameters OPTIONAL,
  ...}

RequestShadowUpdateResult ::= CHOICE {
  null         NULL,
  information OPTIONALLY-PROTECTED{ RequestShadowUpdateResultData },
  ...
  }

RequestShadowUpdateResultData ::= [0]  SEQUENCE {
  agreementID  AgreementID,
  lastUpdate   Time OPTIONAL,
  ...,
  ...,
  COMPONENTS OF CommonResultsSeq }

updateShadow OPERATION ::= {
  ARGUMENT  UpdateShadowArgument
  RESULT    UpdateShadowResult
  ERRORS    {shadowError}
  CODE      id-opcode-updateShadow }

UpdateShadowArgument ::= OPTIONALLY-PROTECTED {UpdateShadowArgumentData }

UpdateShadowArgumentData ::= [0]  SEQUENCE {
  agreementID         AgreementID,
  updateTime          Time,
  updateWindow        UpdateWindow OPTIONAL,
  updatedInfo         RefreshInformation,
  securityParameters  SecurityParameters OPTIONAL,
  ...}

UpdateShadowResult ::= CHOICE {
  null         NULL,
  information OPTIONALLY-PROTECTED{ UpdateShadowResultData },
  ...}

UpdateShadowResultData ::= [0]  SEQUENCE {
  agreementID  AgreementID,
  lastUpdate   Time OPTIONAL,
  ...,
  ...,
  COMPONENTS OF CommonResultsSeq }

UpdateWindow ::= SEQUENCE {
  start  Time,
  stop   Time,
  ...}

RefreshInformation ::= CHOICE {
  noRefresh      NULL,
  total          [0]  TotalRefresh,
  incremental    [1]  IncrementalRefresh,
  otherStrategy       EXTERNAL,
  ...}

TotalRefresh ::= SEQUENCE {
  sDSE     SDSEContent OPTIONAL,
  subtree  SET SIZE (1..MAX) OF Subtree OPTIONAL,
  ...}

SDSEContent ::= SEQUENCE {
  sDSEType          SDSEType,
  subComplete       [0]  BOOLEAN DEFAULT FALSE,
  attComplete       [1]  BOOLEAN OPTIONAL,
  attributes        SET OF Attribute{{SupportedAttributes}},
  attValIncomplete  SET OF AttributeType DEFAULT {},
  ...}

SDSEType ::= DSEType

Subtree ::= SEQUENCE {
  rdn  RelativeDistinguishedName,
  COMPONENTS OF TotalRefresh,
  ...}

IncrementalRefresh ::= SEQUENCE OF IncrementalStepRefresh

IncrementalStepRefresh ::= SEQUENCE {
  sDSEChanges
    CHOICE {add     [0]  SDSEContent,
            remove  NULL,
            modify  [1]  ContentChange,
            ...} OPTIONAL,
  subordinateUpdates  SEQUENCE SIZE (1..MAX) OF SubordinateChanges OPTIONAL }

ContentChange ::= SEQUENCE {
  rename
    CHOICE {newRDN  RelativeDistinguishedName,
            newDN   DistinguishedName} OPTIONAL,
  attributeChanges
    CHOICE {replace  [0]  SET SIZE (1..MAX) OF Attribute{{SupportedAttributes}},
            changes  [1]  SEQUENCE SIZE (1..MAX) OF EntryModification} OPTIONAL,
  sDSEType          SDSEType,
  subComplete       [2]  BOOLEAN DEFAULT FALSE,
  attComplete       [3]  BOOLEAN OPTIONAL,
  attValIncomplete  SET OF AttributeType DEFAULT {},
  ... }

SubordinateChanges ::= SEQUENCE {
  subordinate  RelativeDistinguishedName,
  changes      IncrementalStepRefresh,
  ... }

-- errors and parameters

shadowError ERROR ::= {
  PARAMETER OPTIONALLY-PROTECTED-SEQ { ShadowErrorData }
  CODE                               id-errcode-shadowError }

ShadowErrorData ::= SEQUENCE {
  problem       ShadowProblem,
  lastUpdate    Time OPTIONAL,
  updateWindow  UpdateWindow OPTIONAL,
  ...,
  ...,
  COMPONENTS OF CommonResultsSeq }

ShadowProblem ::= INTEGER {
  invalidAgreementID         (1),
  inactiveAgreement          (2),
  invalidInformationReceived (3),
  unsupportedStrategy        (4),
  missedPrevious             (5),
  fullUpdateRequired         (6),
  unwillingToPerform         (7),
  unsuitableTiming           (8),
  updateAlreadyReceived      (9),
  invalidSequencing          (10),
  insufficientResources      (11) }

END -- DirectoryShadowAbstractService

-- Module DirectoryManagement (X.530:11/2008)
-- See also ITU-T X.530 (11/2008)
-- See also the index of all ASN.1 assignments needed in this document

DirectoryManagement {joint-iso-itu-t ds(5) module(1) directoryManagement(27) 6}
DEFINITIONS ::=
BEGIN

--  EXPORTS All
--  The types and values defined in this module are exported for use in the other ASN.1 modules contained
--  within the Directory Specifications, and for the use of other applications which will use them to access
--  Directory Services. Other applications may use them for their own purposes, but this will not constrain
--  extensions and modifications needed to maintain or improve the Directory Service.
IMPORTS
  -- from ITU-T Rec. X.501 | ISO/IEC 9594-2
  basicAccessControl, directoryAbstractService, directoryShadowAbstractService,
    distributedOperations, dsaOperationalAttributeTypes, enhancedSecurity,
    id-mgt, informationFramework, opBindingManagement, schemaAdministration,
    selectedAttributeTypes
    FROM UsefulDefinitions {joint-iso-itu-t ds(5) module(1)
      usefulDefinitions(0) 6}
  ATTRIBUTE, AttributeType, AttributeValue, DistinguishedName, Name,
    OBJECT-CLASS, RDNSequence, SubtreeSpecification
    FROM InformationFramework informationFramework
  ACIItem
    FROM BasicAccessControl basicAccessControl
  AttributeTypeDescription, DITStructureRuleDescription,
    DITContentRuleDescription, MatchingRuleDescription,
    MatchingRuleUseDescription, NameFormDescription, ObjectClassDescription
    FROM SchemaAdministration schemaAdministration
  ConsumerInformation, DSEType, SupplierAndConsumers, SupplierInformation
    FROM DSAOperationalAttributeTypes dsaOperationalAttributeTypes
  OpBindingErrorParam, OperationalBindingID
    FROM OperationalBindingManagement opBindingManagement
  -- from ITU-T Rec. X.511 | ISO/IEC 9594-3
  AttributeProblem, Credentials, NameProblem, SecurityProblem, ServiceProblem,
    UpdateProblem
    FROM DirectoryAbstractService directoryAbstractService
  -- from ITU-T Rec. X.518 | ISO/IEC 9594-4
  AccessPoint, MasterAndShadowAccessPoints, OperationProgress, ReferenceType,
    TraceInformation
    FROM DistributedOperations distributedOperations
  -- from ITU-T Rec. X.520 | ISO/IEC 9594-6
  UnboundedDirectoryString
    FROM SelectedAttributeTypes selectedAttributeTypes
  -- from ITU-T Rec. X.525 | ISO/IEC 9594-9
  UnitOfReplication, UpdateMode, SchedulingParameters, Time, ShadowProblem,
    AgreementID
    FROM DirectoryShadowAbstractService directoryShadowAbstractService;

Accessors ::= SET OF Name

AdministrativeRole ::= OBJECT-CLASS.&id

ApplicationContext ::= OBJECT IDENTIFIER

AssociationEstablishment ::= BIT STRING {inward(0), outward(1)}

AssociationId ::= INTEGER

AuthenReasonSyntax ::= INTEGER {
  unknownUser(0), incorrectPassword(1), inaccessiblePassword(2),
  passwordVerificationLoop(3), unrecognizedUser(4)}

DirectoryInformationServiceElement ::= SEQUENCE {
  operationType
    BIT STRING {read(0), compare(1), abandon(2), list(3), search(4),
                addEntry(5), removeEntry(6), modifyEntry(7), modifyDN(8)}
      OPTIONAL,
  attributeType   AttributeType OPTIONAL,
  attributeValue  [0]  AttributeValue OPTIONAL
}

DSAScopeOfChainingValue ::= INTEGER {dmd(0), country(1), global(2)}

DSAScopeOfReferralValue ::= INTEGER {dmd(0), country(1), global(2)}

HOBRole ::= INTEGER {superior(0), subordinate(1)}

MgtBitString ::= BIT STRING

MgtBoolean ::= BOOLEAN

MgtCommonName ::= UnboundedDirectoryString

MgtGeneralizedTime ::= GeneralizedTime

MgtInteger ::= INTEGER

MgtName ::= Name

MgtOctetString ::= OCTET STRING

MgtOID ::= OBJECT IDENTIFIER

MgtPrintableString ::= PrintableString

PeerEntityAuthenticationPolicy ::= BIT STRING {
  none(0), nameOnly(1), simpleUnprotected(2), simpleProtected(3), strong(4),
  external(5)}

RemoteDSAList ::= SET OF AccessPoint

RequestAuthenticationPolicy ::= BIT STRING {none(0), simpleName(1), strong(2)}

ResourceSyntax ::= INTEGER {
  insufficientMemory(0), insufficientAssociations(1), insufficientDiskSpace(2),
  miscellaneousResourceExhausted(4)}

ResultAuthenticationPolicy ::= RequestAuthenticationPolicy

SecondaryShadows ::= SET OF SupplierAndConsumers

ShadowingRole ::= INTEGER {supplier(0), consumer(1)}

SubSchemaSyntax ::=
  SEQUENCE OF
    SEQUENCE {name       [1]  Name, --  Name of the subschema subentry for the subschema
              subSchema
                [2]  SEQUENCE {structureRules
                                 [1]  SEQUENCE OF DITStructureRuleDescription
                                   OPTIONAL,
                               contentRules
                                 [2]  SEQUENCE OF DITContentRuleDescription
                                   OPTIONAL,
                               matchingRules
                                 [3]  SEQUENCE OF MatchingRuleDescription
                                   OPTIONAL,
                               attributeTypes
                                 [4]  SEQUENCE OF AttributeTypeDescription
                                   OPTIONAL,
                               objectClasses
                                 [5]  SEQUENCE OF ObjectClassDescription
                                   OPTIONAL,
                               nameForms
                                 [6]  SEQUENCE OF NameFormDescription OPTIONAL,
                               matchRuleUses
                                 [7]  SEQUENCE OF MatchingRuleUseDescription
                                   OPTIONAL}}

SupportedApplicationContexts ::= SET OF OBJECT IDENTIFIER

zero INTEGER ::= 0

--  Object Identifier assignments
id-mac OBJECT IDENTIFIER ::= {id-mgt 0}

id-mat OBJECT IDENTIFIER ::= {id-mgt 1}

id-moc OBJECT IDENTIFIER ::= {id-mgt 2}

id-mnb OBJECT IDENTIFIER ::= {id-mgt 3}

id-mp OBJECT IDENTIFIER ::= {id-mgt 4}

id-mpa OBJECT IDENTIFIER ::= {id-mgt 5}

--  Actions
id-mac-useRemoteDSA OBJECT IDENTIFIER ::= {id-mac 0}

id-mac-useHomeDSA OBJECT IDENTIFIER ::= {id-mac 1}

id-mac-update OBJECT IDENTIFIER ::= {id-mac 2}

--  Attributes
id-mat-accessPoint OBJECT IDENTIFIER ::= {id-mat 0}

id-mat-masterEntries OBJECT IDENTIFIER ::= {id-mat 1}

id-mat-copyEntries OBJECT IDENTIFIER ::= {id-mat 2}

id-mat-loopsDetected OBJECT IDENTIFIER ::= {id-mat 3}

id-mat-securityErrors OBJECT IDENTIFIER ::= {id-mat 4}

id-mat-nameErrors OBJECT IDENTIFIER ::= {id-mat 5}

id-mat-foundLocalEntries OBJECT IDENTIFIER ::= {id-mat 6}

id-mat-referrals OBJECT IDENTIFIER ::= {id-mat 7}

id-mat-serviceErrors OBJECT IDENTIFIER ::= {id-mat 8}

id-mat-aliasDereferences OBJECT IDENTIFIER ::= {id-mat 9}

id-mat-chainings OBJECT IDENTIFIER ::= {id-mat 10}

id-mat-invalidReferences OBJECT IDENTIFIER ::= {id-mat 11}

id-mat-unableToProceed OBJECT IDENTIFIER ::= {id-mat 12}

id-mat-outOfScope OBJECT IDENTIFIER ::= {id-mat 13}

id-mat-noSuchObject OBJECT IDENTIFIER ::= {id-mat 14}

id-mat-aliasProblem OBJECT IDENTIFIER ::= {id-mat 15}

id-mat-aliasDereferencingProblem OBJECT IDENTIFIER ::= {id-mat 16}

id-mat-affectsMultipleDSAs OBJECT IDENTIFIER ::= {id-mat 17}

id-mat-unavailableCriticalExtension OBJECT IDENTIFIER ::= {id-mat 18}

id-mat-timeLimitExceeded OBJECT IDENTIFIER ::= {id-mat 19}

id-mat-sizeLimitExceeded OBJECT IDENTIFIER ::= {id-mat 20}

id-mat-adminLimitExceeded OBJECT IDENTIFIER ::= {id-mat 21}

id-mat-prohibitChaining OBJECT IDENTIFIER ::= {id-mat 24}

id-mat-readOpsProc OBJECT IDENTIFIER ::= {id-mat 25}

id-mat-compareOpsProc OBJECT IDENTIFIER ::= {id-mat 26}

id-mat-abandonOpsProc OBJECT IDENTIFIER ::= {id-mat 27}

id-mat-listOpsProc OBJECT IDENTIFIER ::= {id-mat 28}

id-mat-searchBaseOpsProc OBJECT IDENTIFIER ::= {id-mat 29}

id-mat-search1LevelOpsProc OBJECT IDENTIFIER ::= {id-mat 30}

id-mat-searchSubtreeOpsProc OBJECT IDENTIFIER ::= {id-mat 31}

id-mat-addEntryOpsProc OBJECT IDENTIFIER ::= {id-mat 32}

id-mat-removeEntryOpsProc OBJECT IDENTIFIER ::= {id-mat 33}

id-mat-modifyEntryOpsProc OBJECT IDENTIFIER ::= {id-mat 34}

id-mat-modifyDNOpsProc OBJECT IDENTIFIER ::= {id-mat 35}

id-mat-chReadOpsProc OBJECT IDENTIFIER ::= {id-mat 36}

id-mat-chCompareOpsProc OBJECT IDENTIFIER ::= {id-mat 37}

id-mat-chAbandonOpsProc OBJECT IDENTIFIER ::= {id-mat 38}

id-mat-chListOpsProc OBJECT IDENTIFIER ::= {id-mat 39}

id-mat-chSearchBaseOpsProc OBJECT IDENTIFIER ::= {id-mat 40}

id-mat-chSearch1LevelOpsProc OBJECT IDENTIFIER ::= {id-mat 41}

id-mat-chSearchSubtreeOpsProc OBJECT IDENTIFIER ::= {id-mat 42}

id-mat-chAddEntryOpsProc OBJECT IDENTIFIER ::= {id-mat 43}

id-mat-chRemoveEntryOpsProc OBJECT IDENTIFIER ::= {id-mat 44}

id-mat-chModifyEntryOpsProc OBJECT IDENTIFIER ::= {id-mat 45}

id-mat-chModifyDNOpsProc OBJECT IDENTIFIER ::= {id-mat 46}

id-mat-dSAScopeOfReferral OBJECT IDENTIFIER ::= {id-mat 47}

id-mat-dSAScopeOfChaining OBJECT IDENTIFIER ::= {id-mat 48}

id-mat-peerEntityAuthenticationPolicy OBJECT IDENTIFIER ::= {id-mat 49}

id-mat-requestAuthenticationPolicy OBJECT IDENTIFIER ::= {id-mat 50}

id-mat-resultAuthenticationPolicy OBJECT IDENTIFIER ::= {id-mat 51}

id-mat-dSPAssociationEstablishment OBJECT IDENTIFIER ::= {id-mat 52}

id-mat-dOPAssociationEstablishment OBJECT IDENTIFIER ::= {id-mat 53}

id-mat-dISPAssociationEstablishment OBJECT IDENTIFIER ::= {id-mat 54}

id-mat-maxDAPAssociations OBJECT IDENTIFIER ::= {id-mat 55}

id-mat-maxDSPAssociations OBJECT IDENTIFIER ::= {id-mat 56}

id-mat-maxDOPAssociations OBJECT IDENTIFIER ::= {id-mat 57}

id-mat-maxDISPAssociations OBJECT IDENTIFIER ::= {id-mat 58}

id-mat-dAPAssociationTimeout OBJECT IDENTIFIER ::= {id-mat 59}

id-mat-dSPAssociationTimeout OBJECT IDENTIFIER ::= {id-mat 60}

id-mat-dOPAssociationTimeout OBJECT IDENTIFIER ::= {id-mat 61}

id-mat-dISPAssociationTimeout OBJECT IDENTIFIER ::= {id-mat 62}

id-mat-dSAActiveAssociations OBJECT IDENTIFIER ::= {id-mat 63}

id-mat-pagedResultsMaxIDs OBJECT IDENTIFIER ::= {id-mat 64}

id-mat-pagedResultsTimer OBJECT IDENTIFIER ::= {id-mat 65}

id-mat-homeDSA OBJECT IDENTIFIER ::= {id-mat 66}

id-mat-dUATimeout OBJECT IDENTIFIER ::= {id-mat 68}

id-mat-supportedApplicationContexts OBJECT IDENTIFIER ::= {id-mat 69}

id-mat-reverseCredentials OBJECT IDENTIFIER ::= {id-mat 70}

id-mat-remoteAccessPoint OBJECT IDENTIFIER ::= {id-mat 71}

id-mat-maxInboundAssociations OBJECT IDENTIFIER ::= {id-mat 72}

id-mat-maxOutboundAssociations OBJECT IDENTIFIER ::= {id-mat 73}

id-mat-currentActiveAssocs OBJECT IDENTIFIER ::= {id-mat 74}

id-mat-currentActiveInboundAssocs OBJECT IDENTIFIER ::= {id-mat 75}

id-mat-currentActiveOutboundAssocs OBJECT IDENTIFIER ::= {id-mat 76}

id-mat-accumAssocs OBJECT IDENTIFIER ::= {id-mat 77}

id-mat-accumInboundAssocs OBJECT IDENTIFIER ::= {id-mat 78}

id-mat-accumOutboundAssocs OBJECT IDENTIFIER ::= {id-mat 79}

id-mat-accumFailedInboundAssocs OBJECT IDENTIFIER ::= {id-mat 80}

id-mat-accumFailedOutboundAssocs OBJECT IDENTIFIER ::= {id-mat 81}

id-mat-timeOfLastAttempt OBJECT IDENTIFIER ::= {id-mat 82}

id-mat-timeOfLastSuccess OBJECT IDENTIFIER ::= {id-mat 83}

id-mat-requestCounter OBJECT IDENTIFIER ::= {id-mat 84}

id-mat-replyCounter OBJECT IDENTIFIER ::= {id-mat 85}

id-mat-requestsFailedCounter OBJECT IDENTIFIER ::= {id-mat 86}

id-mat-timeOfLastAccess OBJECT IDENTIFIER ::= {id-mat 87}

id-mat-agreementID OBJECT IDENTIFIER ::= {id-mat 88}

id-mat-agreementVersion OBJECT IDENTIFIER ::= {id-mat 89}

id-mat-hOBRole OBJECT IDENTIFIER ::= {id-mat 90}

id-mat-shadowingSubject OBJECT IDENTIFIER ::= {id-mat 91}

id-mat-updateMode OBJECT IDENTIFIER ::= {id-mat 92}

id-mat-masterAccessPoint OBJECT IDENTIFIER ::= {id-mat 93}

id-mat-secondaryShadows OBJECT IDENTIFIER ::= {id-mat 94}

id-mat-shadowingRole OBJECT IDENTIFIER ::= {id-mat 95}

id-mat-lastUpdateTime OBJECT IDENTIFIER ::= {id-mat 96}

id-mat-shadowingSchedule OBJECT IDENTIFIER ::= {id-mat 97}

id-mat-nextUpdateTime OBJECT IDENTIFIER ::= {id-mat 98}

id-mat-useDOP OBJECT IDENTIFIER ::= {id-mat 99}

id-mat-accessor OBJECT IDENTIFIER ::= {id-mat 100}

id-mat-allowedInfoService OBJECT IDENTIFIER ::= {id-mat 101}

id-mat-applicationContextInUse OBJECT IDENTIFIER ::= {id-mat 102}

id-mat-associationId OBJECT IDENTIFIER ::= {id-mat 103}

id-mat-callingAETitle OBJECT IDENTIFIER ::= {id-mat 104}

id-mat-disAllowedInfoService OBJECT IDENTIFIER ::= {id-mat 105}

id-mat-maxEntriesReturned OBJECT IDENTIFIER ::= {id-mat 106}

id-mat-maxTimeForResult OBJECT IDENTIFIER ::= {id-mat 107}

id-mat-modifyDNRenameOnlyOpsProc OBJECT IDENTIFIER ::= {id-mat 108}

id-mat-serviceDesc OBJECT IDENTIFIER ::= {id-mat 109}

id-mat-serviceId OBJECT IDENTIFIER ::= {id-mat 110}

id-mat-subSchema OBJECT IDENTIFIER ::= {id-mat 111}

id-mat-sizeLimit OBJECT IDENTIFIER ::= {id-mat 112}

id-mat-timeLimit OBJECT IDENTIFIER ::= {id-mat 113}

id-mat-dirCustName OBJECT IDENTIFIER ::= {id-mat 114}

id-mat-dirUserName OBJECT IDENTIFIER ::= {id-mat 115}

id-mat-dirCustAddr OBJECT IDENTIFIER ::= {id-mat 116}

id-mat-dMDName OBJECT IDENTIFIER ::= {id-mat 117}

-- id-mat-dIRQOP						OBJECT IDENTIFIER	::=	{id-mat 118}
id-mat-accessControlScheme OBJECT IDENTIFIER ::=
  {id-mat 119}

id-mat-administrativeRole OBJECT IDENTIFIER ::= {id-mat 120}

id-mat-aliasedEntryName OBJECT IDENTIFIER ::= {id-mat 121}

id-mat-attributeTypes OBJECT IDENTIFIER ::= {id-mat 122}

id-mat-collectiveExclusions OBJECT IDENTIFIER ::= {id-mat 123}

id-mat-consumerKnowledge OBJECT IDENTIFIER ::= {id-mat 124}

id-mat-createTimestamp OBJECT IDENTIFIER ::= {id-mat 125}

id-mat-creatorsName OBJECT IDENTIFIER ::= {id-mat 126}

id-mat-credentials OBJECT IDENTIFIER ::= {id-mat 127}

id-mat-distName OBJECT IDENTIFIER ::= {id-mat 128}

id-mat-dITContentRules OBJECT IDENTIFIER ::= {id-mat 129}

id-mat-dITStructureRule OBJECT IDENTIFIER ::= {id-mat 130}

id-mat-dseType OBJECT IDENTIFIER ::= {id-mat 131}

id-mat-entryACI OBJECT IDENTIFIER ::= {id-mat 132}

id-mat-governingSR OBJECT IDENTIFIER ::= {id-mat 133}

id-mat-matchingRules OBJECT IDENTIFIER ::= {id-mat 134}

id-mat-matchingRuleUse OBJECT IDENTIFIER ::= {id-mat 135}

id-mat-modifiersName OBJECT IDENTIFIER ::= {id-mat 136}

id-mat-modifyTimestamp OBJECT IDENTIFIER ::= {id-mat 137}

id-mat-myAccessPoint OBJECT IDENTIFIER ::= {id-mat 138}

id-mat-nonSpecificKnowledge OBJECT IDENTIFIER ::= {id-mat 139}

id-mat-objectClass OBJECT IDENTIFIER ::= {id-mat 140}

id-mat-objectClasses OBJECT IDENTIFIER ::= {id-mat 141}

id-mat-prescriptiveACI OBJECT IDENTIFIER ::= {id-mat 142}

id-mat-nameForms OBJECT IDENTIFIER ::= {id-mat 143}

id-mat-specificKnowledge OBJECT IDENTIFIER ::= {id-mat 144}

id-mat-structuralObjectClass OBJECT IDENTIFIER ::= {id-mat 145}

id-mat-subentryACI OBJECT IDENTIFIER ::= {id-mat 146}

id-mat-subtreeSpecification OBJECT IDENTIFIER ::= {id-mat 147}

id-mat-superiorKnowledge OBJECT IDENTIFIER ::= {id-mat 148}

id-mat-supplierKnowledge OBJECT IDENTIFIER ::= {id-mat 149}

id-mat-dirCommonName OBJECT IDENTIFIER ::= {id-mat 150}

--  Managed Object Classes
id-moc-dsa OBJECT IDENTIFIER ::= {id-moc 0}

id-moc-dse OBJECT IDENTIFIER ::= {id-moc 1}

id-moc-knownDSA OBJECT IDENTIFIER ::= {id-moc 2}

id-moc-knownDUA OBJECT IDENTIFIER ::= {id-moc 3}

id-moc-dUA OBJECT IDENTIFIER ::= {id-moc 4}

id-moc-nHOBMO OBJECT IDENTIFIER ::= {id-moc 5}

id-moc-hOBMO OBJECT IDENTIFIER ::= {id-moc 6}

id-moc-shadowingAgreement OBJECT IDENTIFIER ::= {id-moc 7}

id-moc-ULconnEnd OBJECT IDENTIFIER ::= {id-moc 8}

id-moc-disManagedObject OBJECT IDENTIFIER ::= {id-moc 9}

id-moc-dirCust OBJECT IDENTIFIER ::= {id-moc 10}

id-moc-dirUser OBJECT IDENTIFIER ::= {id-moc 11}

id-moc-dMD OBJECT IDENTIFIER ::= {id-moc 12}

--  Name Bindings
id-mnb-dsa-name-binding OBJECT IDENTIFIER ::= {id-mnb 0}

id-mnb-dse-name-binding OBJECT IDENTIFIER ::= {id-mnb 1}

id-mnb-knownDSA-dSA-name-binding OBJECT IDENTIFIER ::= {id-mnb 2}

id-mnb-knownDUA-dSA-name-binding OBJECT IDENTIFIER ::= {id-mnb 3}

id-mnb-acseInvoc-knownDSA OBJECT IDENTIFIER ::= {id-mnb 4}

id-mnb-acseInvoc-knownDUA OBJECT IDENTIFIER ::= {id-mnb 5}

id-mnb-nHOB-name-binding OBJECT IDENTIFIER ::= {id-mnb 6}

id-mnb-hOB-name-binding OBJECT IDENTIFIER ::= {id-mnb 7}

id-mnb-shadowingAgreement-nb OBJECT IDENTIFIER ::= {id-mnb 8}

id-mnb-ULconnEnd-knownDSA OBJECT IDENTIFIER ::= {id-mnb 9}

id-mnb-ULconnEnd-knownDUA OBJECT IDENTIFIER ::= {id-mnb 10}

id-mnb-dis-Customer-name-binding OBJECT IDENTIFIER ::= {id-mnb 11}

id-mnb-knownDSA-dUA-name-binding OBJECT IDENTIFIER ::= {id-mnb 12}

id-mnb-DirCust-DMD OBJECT IDENTIFIER ::= {id-mnb 13}

id-mnb-DirUser-DirCust OBJECT IDENTIFIER ::= {id-mnb 14}

--  Packages
id-mp-dsaPackage OBJECT IDENTIFIER ::= {id-mp 0}

id-mp-readPackage OBJECT IDENTIFIER ::= {id-mp 1}

id-mp-comparePackage OBJECT IDENTIFIER ::= {id-mp 2}

id-mp-abandonPackage OBJECT IDENTIFIER ::= {id-mp 3}

id-mp-listPackage OBJECT IDENTIFIER ::= {id-mp 4}

id-mp-searchPackage OBJECT IDENTIFIER ::= {id-mp 5}

id-mp-addPackage OBJECT IDENTIFIER ::= {id-mp 6}

id-mp-removePackage OBJECT IDENTIFIER ::= {id-mp 7}

id-mp-modifyPackage OBJECT IDENTIFIER ::= {id-mp 8}

id-mp-modifyDNPackage OBJECT IDENTIFIER ::= {id-mp 9}

id-mp-chainedReadPackage OBJECT IDENTIFIER ::= {id-mp 10}

id-mp-chainedComparePackage OBJECT IDENTIFIER ::= {id-mp 11}

id-mp-chainedAbandonPackage OBJECT IDENTIFIER ::= {id-mp 12}

id-mp-chainedListPackage OBJECT IDENTIFIER ::= {id-mp 13}

id-mp-chainedSearchPackage OBJECT IDENTIFIER ::= {id-mp 14}

id-mp-chainedAddPackage OBJECT IDENTIFIER ::= {id-mp 15}

id-mp-chainedRemovePackage OBJECT IDENTIFIER ::= {id-mp 16}

id-mp-chainedModifyPackage OBJECT IDENTIFIER ::= {id-mp 17}

id-mp-chainedModifyDNPackage OBJECT IDENTIFIER ::= {id-mp 18}

id-mp-dsePackage OBJECT IDENTIFIER ::= {id-mp 19}

id-mp-knownDSAPackage OBJECT IDENTIFIER ::= {id-mp 20}

id-mp-knownDUAPackage OBJECT IDENTIFIER ::= {id-mp 21}

id-mp-dUAPackage OBJECT IDENTIFIER ::= {id-mp 22}

id-mp-nHOBPackage OBJECT IDENTIFIER ::= {id-mp 23}

id-mp-hOBPackage OBJECT IDENTIFIER ::= {id-mp 24}

id-mp-shadowingAgreementPackage OBJECT IDENTIFIER ::= {id-mp 25}

id-mp-ULconnEndPackage OBJECT IDENTIFIER ::= {id-mp 26}

id-mp-disPackage OBJECT IDENTIFIER ::= {id-mp 27}

id-mp-dcsPackage OBJECT IDENTIFIER ::= {id-mp 28}

id-mp-dirCust OBJECT IDENTIFIER ::= {id-mp 29}

id-mp-dirUser OBJECT IDENTIFIER ::= {id-mp 30}

id-mp-dMD OBJECT IDENTIFIER ::= {id-mp 31}

id-mp-dsPackage OBJECT IDENTIFIER ::= {id-mp 32}

--  Parameters
id-mpa-nameProblem OBJECT IDENTIFIER ::= {id-mpa 1}

id-mpa-traceInformation OBJECT IDENTIFIER ::= {id-mpa 2}

id-mpa-serviceProblem OBJECT IDENTIFIER ::= {id-mpa 3}

id-mpa-entryName OBJECT IDENTIFIER ::= {id-mpa 4}

id-mpa-operation OBJECT IDENTIFIER ::= {id-mpa 5}

id-mpa-attributeProblem OBJECT IDENTIFIER ::= {id-mpa 6}

id-mpa-attributeType OBJECT IDENTIFIER ::= {id-mpa 7}

id-mpa-shadowProblem OBJECT IDENTIFIER ::= {id-mpa 8}

id-mpa-attributeValue OBJECT IDENTIFIER ::= {id-mpa 9}

id-mpa-resource OBJECT IDENTIFIER ::= {id-mpa 10}

id-mpa-authenReason OBJECT IDENTIFIER ::= {id-mpa 11}

id-mpa-updateProblem OBJECT IDENTIFIER ::= {id-mpa 12}

id-mpa-extensions OBJECT IDENTIFIER ::= {id-mpa 15}

id-mpa-aliasedRDNs OBJECT IDENTIFIER ::= {id-mpa 16}

id-mpa-aliasDereferenced OBJECT IDENTIFIER ::= {id-mpa 17}

id-mpa-referenceType OBJECT IDENTIFIER ::= {id-mpa 18}

id-mpa-operationProgress OBJECT IDENTIFIER ::= {id-mpa 19}

id-mpa-pDU OBJECT IDENTIFIER ::= {id-mpa 20}

id-mpa-opId OBJECT IDENTIFIER ::= {id-mpa 21}

id-mpa-nhob-bind-id OBJECT IDENTIFIER ::= {id-mpa 22}

id-mpa-mhob-dop-prob OBJECT IDENTIFIER ::= {id-mpa 23}

id-mpa-hob-bind-id OBJECT IDENTIFIER ::= {id-mpa 24}

id-mpa-hob-dop-prob OBJECT IDENTIFIER ::= {id-mpa 25}

id-mpa-shadowing-dop-prob OBJECT IDENTIFIER ::= {id-mpa 26}

id-mpa-opIdDN OBJECT IDENTIFIER ::= {id-mpa 27}

END -- DirectoryManagement

```
