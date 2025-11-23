import { LDAPResult } from "@wildboar/ldap";
import {
    LDAPResult_resultCode_noSuchObject,
} from "@wildboar/ldap";

// LDAPResult ::= SEQUENCE {
//     resultCode         ENUMERATED {
//          success                      (0),
//          operationsError              (1),
//          protocolError                (2),
//          timeLimitExceeded            (3),
//          sizeLimitExceeded            (4),
//          compareFalse                 (5),
//          compareTrue                  (6),
//          authMethodNotSupported       (7),
//          strongerAuthRequired         (8),
//               -- 9 reserved --
//          referral                     (10),
//          adminLimitExceeded           (11),
//          unavailableCriticalExtension (12),
//          confidentialityRequired      (13),
//          saslBindInProgress           (14),
//          noSuchAttribute              (16),
//          undefinedAttributeType       (17),
//          inappropriateMatching        (18),
//          constraintViolation          (19),
//          attributeOrValueExists       (20),
//          invalidAttributeSyntax       (21),
//               -- 22-31 unused --
//          noSuchObject                 (32),
//          aliasProblem                 (33),
//          invalidDNSyntax              (34),
//               -- 35 reserved for undefined isLeaf --
//          aliasDereferencingProblem    (36),
//               -- 37-47 unused --
//          inappropriateAuthentication  (48),
//          invalidCredentials           (49),
//          insufficientAccessRights     (50),
//          busy                         (51),
//          unavailable                  (52),
//          unwillingToPerform           (53),
//          loopDetect                   (54),
//               -- 55-63 unused --
//          namingViolation              (64),
//          objectClassViolation         (65),
//          notAllowedOnNonLeaf          (66),
//          notAllowedOnRDN              (67),
//          entryAlreadyExists           (68),
//          objectClassModsProhibited    (69),
//               -- 70 reserved for CLDAP --
//          affectsMultipleDSAs          (71),
//               -- 72-79 unused --
//          other                        (80),
//          ...  },
//     matchedDN          LDAPDN,
//     diagnosticMessage  LDAPString,
//     referral           [3] Referral OPTIONAL }

export
const objectNotFound = new LDAPResult(
    LDAPResult_resultCode_noSuchObject,
    Buffer.alloc(0), // Technically, this should be the highest DSE that matched the DN, but blank is fine.
    Buffer.from("No such object.", "utf-8"),
    undefined,
);
