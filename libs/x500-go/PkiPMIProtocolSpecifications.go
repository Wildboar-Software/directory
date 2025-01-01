package x500_go

import (
	"crypto/x509"
	"encoding/asn1"
	"time"
)

/* START_OF_SYMBOL_DEFINITION AVMPcommonComponents */
// ### ASN.1 Definition:
//
// ```asn1
// AVMPcommonComponents ::= SEQUENCE {
//   version    AVMPversion DEFAULT v1,
//   timeStamp  GeneralizedTime,
//   sequence   AVMPsequence,
//   ... }
// ```
//
//
type AVMPcommonComponents struct {
	Version   AVMPversion `asn1:"optional"`
	TimeStamp time.Time
	Sequence  AVMPsequence
}

/* END_OF_SYMBOL_DEFINITION AVMPcommonComponents */ /* START_OF_SYMBOL_DEFINITION AVMPversion */
// ### ASN.1 Definition:
//
// ```asn1
// AVMPversion  ::=  ENUMERATED { v1(1), v2(2), v3(3), ... }
// ```
type AVMPversion = asn1.Enumerated

const (
	AVMPversion_V1 AVMPversion = 1 // LONG_NAMED_ENUMERATED_VALUE,
	AVMPversion_V2 AVMPversion = 2 // LONG_NAMED_ENUMERATED_VALUE,
	AVMPversion_V3 AVMPversion = 3 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION AVMPversion */ /* START_OF_SYMBOL_DEFINITION AVMPsequence */
// ### ASN.1 Definition:
//
// ```asn1
// AVMPsequence  ::=  INTEGER (1..MAX)
// ```
type AVMPsequence = int64

/* END_OF_SYMBOL_DEFINITION AVMPsequence */ /* START_OF_SYMBOL_DEFINITION CertReq */
// ### ASN.1 Definition:
//
// ```asn1
// CertReq ::= SEQUENCE {
//   COMPONENTS OF AVMPcommonComponents,
//   ... }
// ```
//
//
type CertReq struct {
	Version   AVMPversion `asn1:"optional"`
	TimeStamp time.Time
	Sequence  AVMPsequence
}

/* END_OF_SYMBOL_DEFINITION CertReq */ /* START_OF_SYMBOL_DEFINITION CertRsp */
// ### ASN.1 Definition:
//
// ```asn1
// CertRsp ::= SEQUENCE {
//   COMPONENTS OF AVMPcommonComponents,
//   result        CHOICE {
//     success       [0]  CertOK,
//     failure       [1]  CertErr,
//     ... },
//   ... }
// ```
//
//
type CertRsp struct {
	Version   AVMPversion `asn1:"optional"`
	TimeStamp time.Time
	Sequence  AVMPsequence
	Result    CertRsp_result
}

/* END_OF_SYMBOL_DEFINITION CertRsp */ /* START_OF_SYMBOL_DEFINITION CertOK */
// ### ASN.1 Definition:
//
// ```asn1
// CertOK ::= SEQUENCE {
//   dhCert  Certificate,
//   ... }
// ```
//
//
type CertOK struct {
	DhCert x509.Certificate
}

/* END_OF_SYMBOL_DEFINITION CertOK */ /* START_OF_SYMBOL_DEFINITION CertErr */
// ### ASN.1 Definition:
//
// ```asn1
// CertErr ::= SEQUENCE {
//   notOK  CHOICE {
//     wrErr   [0]  PkiWaError,
//     avmpErr [1]  AVMP-error,
//     ... },
//   note   Notifications OPTIONAL,
//   ... }
// ```
//
//
type CertErr struct {
	NotOK CertErr_notOK
	Note  Notifications `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION CertErr */ /* START_OF_SYMBOL_DEFINITION Notifications */
// ### ASN.1 Definition:
//
// ```asn1
// Notifications  ::=  SEQUENCE SIZE (1..MAX) OF Attribute {{SupportedAttributes}}
// ```
type Notifications = [](Attribute) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION Notifications */ /* START_OF_SYMBOL_DEFINITION AddAvlReq */
// ### ASN.1 Definition:
//
// ```asn1
// AddAvlReq ::= SEQUENCE {
//   COMPONENTS OF AVMPcommonComponents,
//   certlist      CertAVL,
//   ... }
// ```
//
//
type AddAvlReq struct {
	Version   AVMPversion `asn1:"optional"`
	TimeStamp time.Time
	Sequence  AVMPsequence
	Certlist  CertAVL
}

/* END_OF_SYMBOL_DEFINITION AddAvlReq */ /* START_OF_SYMBOL_DEFINITION AddAvlRsp */
// ### ASN.1 Definition:
//
// ```asn1
// AddAvlRsp ::= SEQUENCE {
//   COMPONENTS OF AVMPcommonComponents,
//   result        CHOICE {
//     success       [0]  AddAvlOK,
//     failure       [1]  AddAvlErr,
//     ... },
//   ... }
// ```
//
//
type AddAvlRsp struct {
	Version   AVMPversion `asn1:"optional"`
	TimeStamp time.Time
	Sequence  AVMPsequence
	Result    AddAvlRsp_result
}

/* END_OF_SYMBOL_DEFINITION AddAvlRsp */ /* START_OF_SYMBOL_DEFINITION AddAvlOK */
// ### ASN.1 Definition:
//
// ```asn1
// AddAvlOK ::= SEQUENCE {
//   ok     NULL,
//   ... }
// ```
//
//
type AddAvlOK struct {
	Ok asn1.RawValue
}

/* END_OF_SYMBOL_DEFINITION AddAvlOK */ /* START_OF_SYMBOL_DEFINITION AddAvlErr */
// ### ASN.1 Definition:
//
// ```asn1
// AddAvlErr ::= SEQUENCE {
//   notOK  AVMP-error,
//   ... }
// ```
//
//
type AddAvlErr struct {
	NotOK AVMP_error
}

/* END_OF_SYMBOL_DEFINITION AddAvlErr */ /* START_OF_SYMBOL_DEFINITION ReplaceAvlReq */
// ### ASN.1 Definition:
//
// ```asn1
// ReplaceAvlReq ::= SEQUENCE {
//   COMPONENTS OF AVMPcommonComponents,
//   old           AvlSerialNumber OPTIONAL,
//   new           CertAVL,
//   ... }
// ```
//
//
type ReplaceAvlReq struct {
	Version   AVMPversion `asn1:"optional"`
	TimeStamp time.Time
	Sequence  AVMPsequence
	Old       AvlSerialNumber `asn1:"optional"`
	New       CertAVL
}

/* END_OF_SYMBOL_DEFINITION ReplaceAvlReq */ /* START_OF_SYMBOL_DEFINITION ReplaceAvlRsp */
// ### ASN.1 Definition:
//
// ```asn1
// ReplaceAvlRsp ::= SEQUENCE {
//   COMPONENTS OF AVMPcommonComponents,
//   result        CHOICE {
//     success       [0]  RepAvlOK,
//     failure       [1]  RepAvlErr,
//     ... },
//   ... }
// ```
//
//
type ReplaceAvlRsp struct {
	Version   AVMPversion `asn1:"optional"`
	TimeStamp time.Time
	Sequence  AVMPsequence
	Result    ReplaceAvlRsp_result
}

/* END_OF_SYMBOL_DEFINITION ReplaceAvlRsp */ /* START_OF_SYMBOL_DEFINITION RepAvlOK */
// ### ASN.1 Definition:
//
// ```asn1
// RepAvlOK ::= SEQUENCE {
//   ok     NULL,
//   ... }
// ```
//
//
type RepAvlOK struct {
	Ok asn1.RawValue
}

/* END_OF_SYMBOL_DEFINITION RepAvlOK */ /* START_OF_SYMBOL_DEFINITION RepAvlErr */
// ### ASN.1 Definition:
//
// ```asn1
// RepAvlErr ::= SEQUENCE {
//   notOK  AVMP-error,
//   ... }
// ```
//
//
type RepAvlErr struct {
	NotOK AVMP_error
}

/* END_OF_SYMBOL_DEFINITION RepAvlErr */ /* START_OF_SYMBOL_DEFINITION DeleteAvlReq */
// ### ASN.1 Definition:
//
// ```asn1
// DeleteAvlReq ::= SEQUENCE {
//   COMPONENTS OF AVMPcommonComponents,
//   avl-Id        AvlSerialNumber OPTIONAL,
//   ... }
// ```
//
//
type DeleteAvlReq struct {
	Version   AVMPversion `asn1:"optional"`
	TimeStamp time.Time
	Sequence  AVMPsequence
	Avl_Id    AvlSerialNumber `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION DeleteAvlReq */ /* START_OF_SYMBOL_DEFINITION DeleteAvlRsp */
// ### ASN.1 Definition:
//
// ```asn1
// DeleteAvlRsp ::= SEQUENCE {
//   COMPONENTS OF AVMPcommonComponents,
//   result        CHOICE {
//     success       [0]  DelAvlOK,
//     failure       [1]  DelAvlErr,
//     ... },
//   ... }
// ```
//
//
type DeleteAvlRsp struct {
	Version   AVMPversion `asn1:"optional"`
	TimeStamp time.Time
	Sequence  AVMPsequence
	Result    DeleteAvlRsp_result
}

/* END_OF_SYMBOL_DEFINITION DeleteAvlRsp */ /* START_OF_SYMBOL_DEFINITION DelAvlOK */
// ### ASN.1 Definition:
//
// ```asn1
// DelAvlOK ::= SEQUENCE {
//   ok     NULL,
//   ... }
// ```
//
//
type DelAvlOK struct {
	Ok asn1.RawValue
}

/* END_OF_SYMBOL_DEFINITION DelAvlOK */ /* START_OF_SYMBOL_DEFINITION DelAvlErr */
// ### ASN.1 Definition:
//
// ```asn1
// DelAvlErr ::= SEQUENCE {
//   notOK  AVMP-error,
//   ... }
// ```
//
//
type DelAvlErr struct {
	NotOK AVMP_error
}

/* END_OF_SYMBOL_DEFINITION DelAvlErr */ /* START_OF_SYMBOL_DEFINITION RejectAVL */
// ### ASN.1 Definition:
//
// ```asn1
// RejectAVL ::= SEQUENCE {
//   COMPONENTS OF AVMPcommonComponents,
//   reason        AVMP-error,
//   ... }
// ```
//
//
type RejectAVL struct {
	Version   AVMPversion `asn1:"optional"`
	TimeStamp time.Time
	Sequence  AVMPsequence
	Reason    AVMP_error
}

/* END_OF_SYMBOL_DEFINITION RejectAVL */ /* START_OF_SYMBOL_DEFINITION CASPcommonComponents */
// ### ASN.1 Definition:
//
// ```asn1
// CASPcommonComponents ::= SEQUENCE {
//   version    CASPversion DEFAULT v1,
//   sequence   CASPsequence,
//   ... }
// ```
//
//
type CASPcommonComponents struct {
	Version  CASPversion `asn1:"optional"`
	Sequence CASPsequence
}

/* END_OF_SYMBOL_DEFINITION CASPcommonComponents */ /* START_OF_SYMBOL_DEFINITION CASPversion */
// ### ASN.1 Definition:
//
// ```asn1
// CASPversion  ::=  ENUMERATED { v1(1), v2(2), v3(3), ... }
// ```
type CASPversion = asn1.Enumerated

const (
	CASPversion_V1 CASPversion = 1 // LONG_NAMED_ENUMERATED_VALUE,
	CASPversion_V2 CASPversion = 2 // LONG_NAMED_ENUMERATED_VALUE,
	CASPversion_V3 CASPversion = 3 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION CASPversion */ /* START_OF_SYMBOL_DEFINITION CASPsequence */
// ### ASN.1 Definition:
//
// ```asn1
// CASPsequence  ::=  INTEGER (1..MAX)
// ```
type CASPsequence = int64

/* END_OF_SYMBOL_DEFINITION CASPsequence */ /* START_OF_SYMBOL_DEFINITION CertSubscribeReq */
// ### ASN.1 Definition:
//
// ```asn1
// CertSubscribeReq ::= SEQUENCE {
//   COMPONENTS OF CASPcommonComponents,
//   certs   SEQUENCE (SIZE (1..MAX)) OF SEQUENCE {
//     subject      Name,
//     serialNumber CertificateSerialNumber,
//     ... },
//   ... }
// ```
//
//
type CertSubscribeReq struct {
	Version  CASPversion `asn1:"optional"`
	Sequence CASPsequence
	Certs    [](CertSubscribeReq_certs_Item)
}

/* END_OF_SYMBOL_DEFINITION CertSubscribeReq */ /* START_OF_SYMBOL_DEFINITION CertSubscribeRsp */
// ### ASN.1 Definition:
//
// ```asn1
// CertSubscribeRsp ::= SEQUENCE {
//   COMPONENTS OF CASPcommonComponents,
//   result       CHOICE {
//     success       [0]  CertSubscribeOK,
//     failure       [1]  CertSubscribeErr,
//     ... },
//   ... }
// ```
//
//
type CertSubscribeRsp struct {
	Version  CASPversion `asn1:"optional"`
	Sequence CASPsequence
	Result   CertSubscribeRsp_result
}

/* END_OF_SYMBOL_DEFINITION CertSubscribeRsp */ /* START_OF_SYMBOL_DEFINITION CertSubscribeOK */
// ### ASN.1 Definition:
//
// ```asn1
// CertSubscribeOK  ::=  SEQUENCE (SIZE (1..MAX)) OF CHOICE {
//   ok       [0] SEQUENCE {
//     cert         Certificate,
//     status       CertStatus,
//     revokeReason CRLReason OPTIONAL,
//     ... },
//   not-ok   [1] SEQUENCE {
//     status       CASP-CertStatusCode,
//     ... },
//   ... }
// ```
type CertSubscribeOK = [](CertSubscribeOK_Item) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION CertSubscribeOK */ /* START_OF_SYMBOL_DEFINITION CertStatus */
// ### ASN.1 Definition:
//
// ```asn1
// CertStatus  ::=  ENUMERATED {
//   good    (0),
//   revoked (1),
//   on-hold (2),
//   expired (3),
//   ... }
// ```
type CertStatus = asn1.Enumerated

const (
	CertStatus_Good    CertStatus = 0 // LONG_NAMED_ENUMERATED_VALUE,
	CertStatus_Revoked CertStatus = 1 // LONG_NAMED_ENUMERATED_VALUE,
	CertStatus_On_hold CertStatus = 2 // LONG_NAMED_ENUMERATED_VALUE,
	CertStatus_Expired CertStatus = 3 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION CertStatus */ /* START_OF_SYMBOL_DEFINITION CASP_CertStatusCode */
// ### ASN.1 Definition:
//
// ```asn1
// CASP-CertStatusCode  ::=  ENUMERATED {
//   noReason       (1),
//   unknownCert    (2),
//   ... }
// ```
type CASP_CertStatusCode = asn1.Enumerated

const (
	CASP_CertStatusCode_NoReason    CASP_CertStatusCode = 1 // LONG_NAMED_ENUMERATED_VALUE,
	CASP_CertStatusCode_UnknownCert CASP_CertStatusCode = 2 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION CASP_CertStatusCode */ /* START_OF_SYMBOL_DEFINITION CertSubscribeErr */
// ### ASN.1 Definition:
//
// ```asn1
// CertSubscribeErr ::= SEQUENCE {
//   code       CASP-error,
//   ... }
// ```
//
//
type CertSubscribeErr struct {
	Code CASP_error
}

/* END_OF_SYMBOL_DEFINITION CertSubscribeErr */ /* START_OF_SYMBOL_DEFINITION CertUnsubscribeReq */
// ### ASN.1 Definition:
//
// ```asn1
// CertUnsubscribeReq ::= SEQUENCE {
//   COMPONENTS OF CASPcommonComponents,
//   certs  SEQUENCE (SIZE (1..MAX)) OF SEQUENCE {
//     subject      Name,
//     serialNumber CertificateSerialNumber,
//     ... },
//   ... }
// ```
//
//
type CertUnsubscribeReq struct {
	Version  CASPversion `asn1:"optional"`
	Sequence CASPsequence
	Certs    [](CertUnsubscribeReq_certs_Item)
}

/* END_OF_SYMBOL_DEFINITION CertUnsubscribeReq */ /* START_OF_SYMBOL_DEFINITION CertUnsubscribeRsp */
// ### ASN.1 Definition:
//
// ```asn1
// CertUnsubscribeRsp ::= SEQUENCE {
//   COMPONENTS OF CASPcommonComponents,
//   result       CHOICE {
//     success       [0]  CertUnsubscribeOK,
//     failure       [1]  CertUnsubscribeErr,
//     ... },
//   ... }
// ```
//
//
type CertUnsubscribeRsp struct {
	Version  CASPversion `asn1:"optional"`
	Sequence CASPsequence
	Result   CertUnsubscribeRsp_result
}

/* END_OF_SYMBOL_DEFINITION CertUnsubscribeRsp */ /* START_OF_SYMBOL_DEFINITION CertUnsubscribeOK */
// ### ASN.1 Definition:
//
// ```asn1
// CertUnsubscribeOK  ::=  SEQUENCE (SIZE (1..MAX)) OF CHOICE {
//   ok       [0] SEQUENCE {
//     subject      Name,
//     serialNumber CertificateSerialNumber,
//     ... },
//   not-ok   [1] SEQUENCE {
//     status       CASP-CertStatusCode,
//     ... },
//   ... }
// ```
type CertUnsubscribeOK = [](CertUnsubscribeOK_Item) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION CertUnsubscribeOK */ /* START_OF_SYMBOL_DEFINITION CertUnsubscribeErr */
// ### ASN.1 Definition:
//
// ```asn1
// CertUnsubscribeErr ::= SEQUENCE {
//   code         CASP-error,
//   ... }
// ```
//
//
type CertUnsubscribeErr struct {
	Code CASP_error
}

/* END_OF_SYMBOL_DEFINITION CertUnsubscribeErr */ /* START_OF_SYMBOL_DEFINITION CertReplaceReq */
// ### ASN.1 Definition:
//
// ```asn1
// CertReplaceReq ::= SEQUENCE {
//   COMPONENTS OF CASPcommonComponents,
//   certs         SEQUENCE (SIZE (1..MAX)) OF SEQUENCE {
//     old           CertificateSerialNumber,
//     new           Certificate,
//     ... },
//   ... }
// ```
//
//
type CertReplaceReq struct {
	Version  CASPversion `asn1:"optional"`
	Sequence CASPsequence
	Certs    [](CertReplaceReq_certs_Item)
}

/* END_OF_SYMBOL_DEFINITION CertReplaceReq */ /* START_OF_SYMBOL_DEFINITION CertReplaceRsp */
// ### ASN.1 Definition:
//
// ```asn1
// CertReplaceRsp ::= SEQUENCE {
//   COMPONENTS OF CASPcommonComponents,
//   result        CHOICE {
//     success       [0]  CertReplaceOK,
//     failure       [1]  CertReplaceErr,
//     ... },
//   ... }
// ```
//
//
type CertReplaceRsp struct {
	Version  CASPversion `asn1:"optional"`
	Sequence CASPsequence
	Result   CertReplaceRsp_result
}

/* END_OF_SYMBOL_DEFINITION CertReplaceRsp */ /* START_OF_SYMBOL_DEFINITION CertReplaceOK */
// ### ASN.1 Definition:
//
// ```asn1
// CertReplaceOK  ::=  SEQUENCE (SIZE (1..MAX)) OF CHOICE {
//   ok        [0] SEQUENCE {
//     issuer        Name,
//     serialNumber  CertificateSerialNumber,
//     ... },
//   not-ok    [1] SEQUENCE {
//     status        CASP-CertStatusCode,
//     ... },
//   ... }
// ```
type CertReplaceOK = [](CertReplaceOK_Item) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION CertReplaceOK */ /* START_OF_SYMBOL_DEFINITION CertReplaceErr */
// ### ASN.1 Definition:
//
// ```asn1
// CertReplaceErr ::= SEQUENCE {
//   code        CHOICE {
//     signedData     [0]  SignedData-error,
//     envelopedData  [1]  EnvelopedData-error,
//     casp           [2]  CASP-error,
//     ... },
//   ... }
// ```
//
//
type CertReplaceErr struct {
	Code CertReplaceErr_code
}

/* END_OF_SYMBOL_DEFINITION CertReplaceErr */ /* START_OF_SYMBOL_DEFINITION CertUpdateReq */
// ### ASN.1 Definition:
//
// ```asn1
// CertUpdateReq ::= SEQUENCE {
//   COMPONENTS OF CASPcommonComponents,
//   certs  SEQUENCE (SIZE (1..MAX)) OF SEQUENCE {
//     subject      Name,
//     serialNumber CertificateSerialNumber,
//     certStatus   CertStatus,
//     ... },
//   ... }
// ```
//
//
type CertUpdateReq struct {
	Version  CASPversion `asn1:"optional"`
	Sequence CASPsequence
	Certs    [](CertUpdateReq_certs_Item)
}

/* END_OF_SYMBOL_DEFINITION CertUpdateReq */ /* START_OF_SYMBOL_DEFINITION CertUpdateRsp */
// ### ASN.1 Definition:
//
// ```asn1
// CertUpdateRsp ::= SEQUENCE {
//   COMPONENTS OF CASPcommonComponents,
//   result        CHOICE {
//     success       [0]  CertUpdateOK,
//     failure       [1]  CertUpdateErr,
//     ... },
//   ... }
// ```
//
//
type CertUpdateRsp struct {
	Version  CASPversion `asn1:"optional"`
	Sequence CASPsequence
	Result   CertUpdateRsp_result
}

/* END_OF_SYMBOL_DEFINITION CertUpdateRsp */ /* START_OF_SYMBOL_DEFINITION CertUpdateOK */
// ### ASN.1 Definition:
//
// ```asn1
// CertUpdateOK  ::=  SEQUENCE (SIZE (1..MAX)) OF CHOICE {
//   ok        [0] SEQUENCE {
//     subject       Name,
//     serialNumber  CertificateSerialNumber,
//     ... },
//   not-ok    [1] SEQUENCE {
//     status        CASP-CertStatusCode,
//     ... },
//   ... }
// ```
type CertUpdateOK = [](CertUpdateOK_Item) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION CertUpdateOK */ /* START_OF_SYMBOL_DEFINITION CertUpdateErr */
// ### ASN.1 Definition:
//
// ```asn1
// CertUpdateErr ::= SEQUENCE {
//   code          CASP-error,
//   ... }
// ```
//
//
type CertUpdateErr struct {
	Code CASP_error
}

/* END_OF_SYMBOL_DEFINITION CertUpdateErr */ /* START_OF_SYMBOL_DEFINITION RejectCAsubscribe */
// ### ASN.1 Definition:
//
// ```asn1
// RejectCAsubscribe ::= SEQUENCE {
//   COMPONENTS OF CASPcommonComponents,
//   reason        CASP-error,
//   ... }
// ```
//
//
type RejectCAsubscribe struct {
	Version  CASPversion `asn1:"optional"`
	Sequence CASPsequence
	Reason   CASP_error
}

/* END_OF_SYMBOL_DEFINITION RejectCAsubscribe */ /* START_OF_SYMBOL_DEFINITION SignedData_error */
// ### ASN.1 Definition:
//
// ```asn1
// SignedData-error  ::=  ENUMERATED {
//   noReason                           (0),
//   signedDataContectTypeExpected      (1),
//   wrongSignedDataVersion             (2),
//   missingContent                     (3),
//   missingContentComponent            (4),
//   invalidContentComponent            (5),
//   unsupportedHashAlgorithm           (6),
//   ... }
// ```
type SignedData_error = asn1.Enumerated

const (
	SignedData_error_NoReason                      SignedData_error = 0 // LONG_NAMED_ENUMERATED_VALUE,
	SignedData_error_SignedDataContectTypeExpected SignedData_error = 1 // LONG_NAMED_ENUMERATED_VALUE,
	SignedData_error_WrongSignedDataVersion        SignedData_error = 2 // LONG_NAMED_ENUMERATED_VALUE,
	SignedData_error_MissingContent                SignedData_error = 3 // LONG_NAMED_ENUMERATED_VALUE,
	SignedData_error_MissingContentComponent       SignedData_error = 4 // LONG_NAMED_ENUMERATED_VALUE,
	SignedData_error_InvalidContentComponent       SignedData_error = 5 // LONG_NAMED_ENUMERATED_VALUE,
	SignedData_error_UnsupportedHashAlgorithm      SignedData_error = 6 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION SignedData_error */ /* START_OF_SYMBOL_DEFINITION EnvelopedData_error */
// ### ASN.1 Definition:
//
// ```asn1
// EnvelopedData-error  ::=  ENUMERATED {
//   noReason                           (0),
//   ... }
// ```
type EnvelopedData_error = asn1.Enumerated

const (
	EnvelopedData_error_NoReason EnvelopedData_error = 0 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION EnvelopedData_error */ /* START_OF_SYMBOL_DEFINITION AVMP_error */
// ### ASN.1 Definition:
//
// ```asn1
// AVMP-error  ::=  ENUMERATED {
//   noReason                           (0),
//   unknownAvlEntity                   (1),
//   unknownContentType                 (2),
//   unsupportedAVMPversion             (3),
//   missingContent                     (4),
//   missingContentComponent            (5),
//   invalidContentComponent            (6),
//   sequenceError                      (7),
//   protocolError                      (8),
//   invalidAvlSignature                (9),
//   duplicateAVL                       (10),
//   missingAvlComponent                (11),
//   invalidAvlVersion                  (12),
//   notAllowedForConstrainedAVLEntity  (13),
//   constrainedRequired                (14),
//   nonConstrainedRequired             (15),
//   unsupportedCriticalEntryExtension  (16),
//   unsupportedCriticalExtension       (17),
//   maxAVLsExceeded                    (18),
//   unknownCert                        (19),
//   unknownAVL                         (20),
//   unsupportedScopeRestriction        (21),
//   ... }
// ```
type AVMP_error = asn1.Enumerated

const (
	AVMP_error_NoReason                          AVMP_error = 0  // LONG_NAMED_ENUMERATED_VALUE,
	AVMP_error_UnknownAvlEntity                  AVMP_error = 1  // LONG_NAMED_ENUMERATED_VALUE,
	AVMP_error_UnknownContentType                AVMP_error = 2  // LONG_NAMED_ENUMERATED_VALUE,
	AVMP_error_UnsupportedAVMPversion            AVMP_error = 3  // LONG_NAMED_ENUMERATED_VALUE,
	AVMP_error_MissingContent                    AVMP_error = 4  // LONG_NAMED_ENUMERATED_VALUE,
	AVMP_error_MissingContentComponent           AVMP_error = 5  // LONG_NAMED_ENUMERATED_VALUE,
	AVMP_error_InvalidContentComponent           AVMP_error = 6  // LONG_NAMED_ENUMERATED_VALUE,
	AVMP_error_SequenceError                     AVMP_error = 7  // LONG_NAMED_ENUMERATED_VALUE,
	AVMP_error_ProtocolError                     AVMP_error = 8  // LONG_NAMED_ENUMERATED_VALUE,
	AVMP_error_InvalidAvlSignature               AVMP_error = 9  // LONG_NAMED_ENUMERATED_VALUE,
	AVMP_error_DuplicateAVL                      AVMP_error = 10 // LONG_NAMED_ENUMERATED_VALUE,
	AVMP_error_MissingAvlComponent               AVMP_error = 11 // LONG_NAMED_ENUMERATED_VALUE,
	AVMP_error_InvalidAvlVersion                 AVMP_error = 12 // LONG_NAMED_ENUMERATED_VALUE,
	AVMP_error_NotAllowedForConstrainedAVLEntity AVMP_error = 13 // LONG_NAMED_ENUMERATED_VALUE,
	AVMP_error_ConstrainedRequired               AVMP_error = 14 // LONG_NAMED_ENUMERATED_VALUE,
	AVMP_error_NonConstrainedRequired            AVMP_error = 15 // LONG_NAMED_ENUMERATED_VALUE,
	AVMP_error_UnsupportedCriticalEntryExtension AVMP_error = 16 // LONG_NAMED_ENUMERATED_VALUE,
	AVMP_error_UnsupportedCriticalExtension      AVMP_error = 17 // LONG_NAMED_ENUMERATED_VALUE,
	AVMP_error_MaxAVLsExceeded                   AVMP_error = 18 // LONG_NAMED_ENUMERATED_VALUE,
	AVMP_error_UnknownCert                       AVMP_error = 19 // LONG_NAMED_ENUMERATED_VALUE,
	AVMP_error_UnknownAVL                        AVMP_error = 20 // LONG_NAMED_ENUMERATED_VALUE,
	AVMP_error_UnsupportedScopeRestriction       AVMP_error = 21 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION AVMP_error */ /* START_OF_SYMBOL_DEFINITION CASP_error */
// ### ASN.1 Definition:
//
// ```asn1
// CASP-error  ::=  ENUMERATED {
//   noReason                      (0),
//   unknownContentType            (1),
//   unsupportedWLMPversion        (2),
//   missingContent                (3),
//   missingContentComponent       (4),
//   invalidContentComponent       (5),
//   sequenceError                 (6),
//   unknownSubject                (7),
//   unknownCert                   (8),
//   ... }
// ```
type CASP_error = asn1.Enumerated

const (
	CASP_error_NoReason                CASP_error = 0 // LONG_NAMED_ENUMERATED_VALUE,
	CASP_error_UnknownContentType      CASP_error = 1 // LONG_NAMED_ENUMERATED_VALUE,
	CASP_error_UnsupportedWLMPversion  CASP_error = 2 // LONG_NAMED_ENUMERATED_VALUE,
	CASP_error_MissingContent          CASP_error = 3 // LONG_NAMED_ENUMERATED_VALUE,
	CASP_error_MissingContentComponent CASP_error = 4 // LONG_NAMED_ENUMERATED_VALUE,
	CASP_error_InvalidContentComponent CASP_error = 5 // LONG_NAMED_ENUMERATED_VALUE,
	CASP_error_SequenceError           CASP_error = 6 // LONG_NAMED_ENUMERATED_VALUE,
	CASP_error_UnknownSubject          CASP_error = 7 // LONG_NAMED_ENUMERATED_VALUE,
	CASP_error_UnknownCert             CASP_error = 8 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION CASP_error */ /* START_OF_SYMBOL_DEFINITION Id_signedData */
// ### ASN.1 Definition:
//
// ```asn1
// id-signedData OBJECT IDENTIFIER ::= {iso(1) member-body(2)
// us(840)rsadsi(113549) pkcs(1) pkcs7(7) 2}
// ```
//
//
var Id_signedData asn1.ObjectIdentifier = []int{1, 2, 840, 113549, 1, 7, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_signedData */ /* START_OF_SYMBOL_DEFINITION Id_envelopedData */
// ### ASN.1 Definition:
//
// ```asn1
// id-envelopedData OBJECT IDENTIFIER ::= {iso(1) member-body(2) us(840)
// rsadsi(113549) pkcs(1) pkcs7(7) 3}
// ```
//
//
var Id_envelopedData asn1.ObjectIdentifier = []int{1, 2, 840, 113549, 1, 7, 3} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_envelopedData */ /* START_OF_SYMBOL_DEFINITION Id_certReq */
// ### ASN.1 Definition:
//
// ```asn1
// id-certReq              OBJECT IDENTIFIER ::= {id-cmsct 0}
// ```
//
//
var Id_certReq asn1.ObjectIdentifier = []int{2, 5, 42, 0} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_certReq */ /* START_OF_SYMBOL_DEFINITION Id_certRsp */
// ### ASN.1 Definition:
//
// ```asn1
// id-certRsp              OBJECT IDENTIFIER ::= {id-cmsct 1}
// ```
//
//
var Id_certRsp asn1.ObjectIdentifier = []int{2, 5, 42, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_certRsp */ /* START_OF_SYMBOL_DEFINITION Id_addAvlReq */
// ### ASN.1 Definition:
//
// ```asn1
// id-addAvlReq            OBJECT IDENTIFIER ::= {id-cmsct 2}
// ```
//
//
var Id_addAvlReq asn1.ObjectIdentifier = []int{2, 5, 42, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_addAvlReq */ /* START_OF_SYMBOL_DEFINITION Id_addAvlRsp */
// ### ASN.1 Definition:
//
// ```asn1
// id-addAvlRsp            OBJECT IDENTIFIER ::= {id-cmsct 3}
// ```
//
//
var Id_addAvlRsp asn1.ObjectIdentifier = []int{2, 5, 42, 3} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_addAvlRsp */ /* START_OF_SYMBOL_DEFINITION Id_replaceAvlReq */
// ### ASN.1 Definition:
//
// ```asn1
// id-replaceAvlReq        OBJECT IDENTIFIER ::= {id-cmsct 4}
// ```
//
//
var Id_replaceAvlReq asn1.ObjectIdentifier = []int{2, 5, 42, 4} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_replaceAvlReq */ /* START_OF_SYMBOL_DEFINITION Id_replaceAvlRsp */
// ### ASN.1 Definition:
//
// ```asn1
// id-replaceAvlRsp        OBJECT IDENTIFIER ::= {id-cmsct 5}
// ```
//
//
var Id_replaceAvlRsp asn1.ObjectIdentifier = []int{2, 5, 42, 5} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_replaceAvlRsp */ /* START_OF_SYMBOL_DEFINITION Id_updateAvlReq */
// ### ASN.1 Definition:
//
// ```asn1
// id-updateAvlReq         OBJECT IDENTIFIER ::= {id-cmsct 6}
// ```
//
//
var Id_updateAvlReq asn1.ObjectIdentifier = []int{2, 5, 42, 6} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_updateAvlReq */ /* START_OF_SYMBOL_DEFINITION Id_updateAvlRsp */
// ### ASN.1 Definition:
//
// ```asn1
// id-updateAvlRsp         OBJECT IDENTIFIER ::= {id-cmsct 7}
// ```
//
//
var Id_updateAvlRsp asn1.ObjectIdentifier = []int{2, 5, 42, 7} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_updateAvlRsp */ /* START_OF_SYMBOL_DEFINITION Id_deleteAvlReq */
// ### ASN.1 Definition:
//
// ```asn1
// id-deleteAvlReq         OBJECT IDENTIFIER ::= {id-cmsct 8}
// ```
//
//
var Id_deleteAvlReq asn1.ObjectIdentifier = []int{2, 5, 42, 8} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_deleteAvlReq */ /* START_OF_SYMBOL_DEFINITION Id_deleteAvlRsp */
// ### ASN.1 Definition:
//
// ```asn1
// id-deleteAvlRsp         OBJECT IDENTIFIER ::= {id-cmsct 9}
// ```
//
//
var Id_deleteAvlRsp asn1.ObjectIdentifier = []int{2, 5, 42, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_deleteAvlRsp */ /* START_OF_SYMBOL_DEFINITION Id_rejectAVL */
// ### ASN.1 Definition:
//
// ```asn1
// id-rejectAVL            OBJECT IDENTIFIER ::= {id-cmsct 10}
// ```
//
//
var Id_rejectAVL asn1.ObjectIdentifier = []int{2, 5, 42, 10} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_rejectAVL */ /* START_OF_SYMBOL_DEFINITION Id_certSubscribeReq */
// ### ASN.1 Definition:
//
// ```asn1
// id-certSubscribeReq     OBJECT IDENTIFIER ::= {id-cmsct 11}
// ```
//
//
var Id_certSubscribeReq asn1.ObjectIdentifier = []int{2, 5, 42, 11} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_certSubscribeReq */ /* START_OF_SYMBOL_DEFINITION Id_certSubscribeRsp */
// ### ASN.1 Definition:
//
// ```asn1
// id-certSubscribeRsp     OBJECT IDENTIFIER ::= {id-cmsct 12}
// ```
//
//
var Id_certSubscribeRsp asn1.ObjectIdentifier = []int{2, 5, 42, 12} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_certSubscribeRsp */ /* START_OF_SYMBOL_DEFINITION Id_certUnsubscribeReq */
// ### ASN.1 Definition:
//
// ```asn1
// id-certUnsubscribeReq   OBJECT IDENTIFIER ::= {id-cmsct 13}
// ```
//
//
var Id_certUnsubscribeReq asn1.ObjectIdentifier = []int{2, 5, 42, 13} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_certUnsubscribeReq */ /* START_OF_SYMBOL_DEFINITION Id_certUnsubscribeRsp */
// ### ASN.1 Definition:
//
// ```asn1
// id-certUnsubscribeRsp   OBJECT IDENTIFIER ::= {id-cmsct 14}
// ```
//
//
var Id_certUnsubscribeRsp asn1.ObjectIdentifier = []int{2, 5, 42, 14} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_certUnsubscribeRsp */ /* START_OF_SYMBOL_DEFINITION Id_certReplaceReq */
// ### ASN.1 Definition:
//
// ```asn1
// id-certReplaceReq       OBJECT IDENTIFIER ::= {id-cmsct 15}
// ```
//
//
var Id_certReplaceReq asn1.ObjectIdentifier = []int{2, 5, 42, 15} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_certReplaceReq */ /* START_OF_SYMBOL_DEFINITION Id_certReplaceRsp */
// ### ASN.1 Definition:
//
// ```asn1
// id-certReplaceRsp       OBJECT IDENTIFIER ::= {id-cmsct 16}
// ```
//
//
var Id_certReplaceRsp asn1.ObjectIdentifier = []int{2, 5, 42, 16} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_certReplaceRsp */ /* START_OF_SYMBOL_DEFINITION Id_certUpdateReq */
// ### ASN.1 Definition:
//
// ```asn1
// id-certUpdateReq        OBJECT IDENTIFIER ::= {id-cmsct 17}
// ```
//
//
var Id_certUpdateReq asn1.ObjectIdentifier = []int{2, 5, 42, 17} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_certUpdateReq */ /* START_OF_SYMBOL_DEFINITION Id_certUpdateRsp */
// ### ASN.1 Definition:
//
// ```asn1
// id-certUpdateRsp        OBJECT IDENTIFIER ::= {id-cmsct 18}
// ```
//
//
var Id_certUpdateRsp asn1.ObjectIdentifier = []int{2, 5, 42, 18} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_certUpdateRsp */ /* START_OF_SYMBOL_DEFINITION Id_rejectCAsubscribe */
// ### ASN.1 Definition:
//
// ```asn1
// id-rejectCAsubscribe    OBJECT IDENTIFIER ::= {id-cmsct 19}
// ```
//
//
var Id_rejectCAsubscribe asn1.ObjectIdentifier = []int{2, 5, 42, 19} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_rejectCAsubscribe */ /* START_OF_SYMBOL_DEFINITION TBrequest */
// ### ASN.1 Definition:
//
// ```asn1
// TBrequest  ::=  CHOICE {
//   caCert      [0] PKCertIdentifier,
//   subjectCert [1] PKCertIdentifier,
//   ... }
// ```
type TBrequest = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION TBrequest */ /* START_OF_SYMBOL_DEFINITION TBresponse */
// ### ASN.1 Definition:
//
// ```asn1
// TBresponse  ::=  CHOICE {
//   success [0]  TBOK,
//   failure [1]  TBerror,
//   ... }
// ```
type TBresponse = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION TBresponse */ /* START_OF_SYMBOL_DEFINITION TBOK */
// ### ASN.1 Definition:
//
// ```asn1
// TBOK ::= SEQUENCE {
//   levelOfAssurance  [0]  INTEGER (0..100),
//   confidenceLevel   [1]  INTEGER (0..100),
//   validationTime    [2]  UTCTime,
//   info                   UTF8String  OPTIONAL,
//   ... }
// ```
//
//
type TBOK struct {
	LevelOfAssurance int       `asn1:"explicit,tag:0"`
	ConfidenceLevel  int       `asn1:"explicit,tag:1"`
	ValidationTime   time.Time `asn1:"explicit,tag:2"`
	Info             string    `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION TBOK */ /* START_OF_SYMBOL_DEFINITION TBerror */
// ### ASN.1 Definition:
//
// ```asn1
// TBerror ::= SEQUENCE {
//   code        ENUMERATED {
//     caCertInvalid        (1),
//     unknownCert          (2),
//     unknownCertStatus    (3),
//     subjectCertRevoked   (4),
//     incorrectCert        (5),
//     contractExpired      (6),
//     pathValidationFailed (7),
//     timeOut              (8),
//     other                (99),
//     ... },
//   diagnostic  UTF8String OPTIONAL,
//   ... }
// ```
//
//
type TBerror struct {
	Code       TBerror_code
	Diagnostic string `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION TBerror */ /* START_OF_SYMBOL_DEFINITION CertRsp_result */
// ### ASN.1 Definition:
//
// ```asn1
// CertRsp-result ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type CertRsp_result = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION CertRsp_result */ /* START_OF_SYMBOL_DEFINITION CertErr_notOK */
// ### ASN.1 Definition:
//
// ```asn1
// CertErr-notOK ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type CertErr_notOK = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION CertErr_notOK */ /* START_OF_SYMBOL_DEFINITION AddAvlRsp_result */
// ### ASN.1 Definition:
//
// ```asn1
// AddAvlRsp-result ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type AddAvlRsp_result = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION AddAvlRsp_result */ /* START_OF_SYMBOL_DEFINITION ReplaceAvlRsp_result */
// ### ASN.1 Definition:
//
// ```asn1
// ReplaceAvlRsp-result ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type ReplaceAvlRsp_result = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION ReplaceAvlRsp_result */ /* START_OF_SYMBOL_DEFINITION DeleteAvlRsp_result */
// ### ASN.1 Definition:
//
// ```asn1
// DeleteAvlRsp-result ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type DeleteAvlRsp_result = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION DeleteAvlRsp_result */ /* START_OF_SYMBOL_DEFINITION CertSubscribeReq_certs_Item */
// ### ASN.1 Definition:
//
// ```asn1
// CertSubscribeReq-certs-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type CertSubscribeReq_certs_Item struct {
	Subject      Name
	SerialNumber CertificateSerialNumber
}

/* END_OF_SYMBOL_DEFINITION CertSubscribeReq_certs_Item */ /* START_OF_SYMBOL_DEFINITION CertSubscribeRsp_result */
// ### ASN.1 Definition:
//
// ```asn1
// CertSubscribeRsp-result ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type CertSubscribeRsp_result = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION CertSubscribeRsp_result */ /* START_OF_SYMBOL_DEFINITION CertSubscribeOK_Item_ok */
// ### ASN.1 Definition:
//
// ```asn1
// CertSubscribeOK-Item-ok ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type CertSubscribeOK_Item_ok struct {
	Cert         x509.Certificate
	Status       CertStatus
	RevokeReason CRLReason `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION CertSubscribeOK_Item_ok */ /* START_OF_SYMBOL_DEFINITION CertSubscribeOK_Item_not_ok */
// ### ASN.1 Definition:
//
// ```asn1
// CertSubscribeOK-Item-not-ok ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type CertSubscribeOK_Item_not_ok struct {
	Status CASP_CertStatusCode
}

/* END_OF_SYMBOL_DEFINITION CertSubscribeOK_Item_not_ok */ /* START_OF_SYMBOL_DEFINITION CertSubscribeOK_Item */
// ### ASN.1 Definition:
//
// ```asn1
// CertSubscribeOK-Item ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type CertSubscribeOK_Item = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION CertSubscribeOK_Item */ /* START_OF_SYMBOL_DEFINITION CertUnsubscribeReq_certs_Item */
// ### ASN.1 Definition:
//
// ```asn1
// CertUnsubscribeReq-certs-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type CertUnsubscribeReq_certs_Item struct {
	Subject      Name
	SerialNumber CertificateSerialNumber
}

/* END_OF_SYMBOL_DEFINITION CertUnsubscribeReq_certs_Item */ /* START_OF_SYMBOL_DEFINITION CertUnsubscribeRsp_result */
// ### ASN.1 Definition:
//
// ```asn1
// CertUnsubscribeRsp-result ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type CertUnsubscribeRsp_result = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION CertUnsubscribeRsp_result */ /* START_OF_SYMBOL_DEFINITION CertUnsubscribeOK_Item_ok */
// ### ASN.1 Definition:
//
// ```asn1
// CertUnsubscribeOK-Item-ok ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type CertUnsubscribeOK_Item_ok struct {
	Subject      Name
	SerialNumber CertificateSerialNumber
}

/* END_OF_SYMBOL_DEFINITION CertUnsubscribeOK_Item_ok */ /* START_OF_SYMBOL_DEFINITION CertUnsubscribeOK_Item_not_ok */
// ### ASN.1 Definition:
//
// ```asn1
// CertUnsubscribeOK-Item-not-ok ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type CertUnsubscribeOK_Item_not_ok struct {
	Status CASP_CertStatusCode
}

/* END_OF_SYMBOL_DEFINITION CertUnsubscribeOK_Item_not_ok */ /* START_OF_SYMBOL_DEFINITION CertUnsubscribeOK_Item */
// ### ASN.1 Definition:
//
// ```asn1
// CertUnsubscribeOK-Item ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type CertUnsubscribeOK_Item = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION CertUnsubscribeOK_Item */ /* START_OF_SYMBOL_DEFINITION CertReplaceReq_certs_Item */
// ### ASN.1 Definition:
//
// ```asn1
// CertReplaceReq-certs-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type CertReplaceReq_certs_Item struct {
	Old CertificateSerialNumber
	New x509.Certificate
}

/* END_OF_SYMBOL_DEFINITION CertReplaceReq_certs_Item */ /* START_OF_SYMBOL_DEFINITION CertReplaceRsp_result */
// ### ASN.1 Definition:
//
// ```asn1
// CertReplaceRsp-result ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type CertReplaceRsp_result = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION CertReplaceRsp_result */ /* START_OF_SYMBOL_DEFINITION CertReplaceOK_Item_ok */
// ### ASN.1 Definition:
//
// ```asn1
// CertReplaceOK-Item-ok ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type CertReplaceOK_Item_ok struct {
	Issuer       Name
	SerialNumber CertificateSerialNumber
}

/* END_OF_SYMBOL_DEFINITION CertReplaceOK_Item_ok */ /* START_OF_SYMBOL_DEFINITION CertReplaceOK_Item_not_ok */
// ### ASN.1 Definition:
//
// ```asn1
// CertReplaceOK-Item-not-ok ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type CertReplaceOK_Item_not_ok struct {
	Status CASP_CertStatusCode
}

/* END_OF_SYMBOL_DEFINITION CertReplaceOK_Item_not_ok */ /* START_OF_SYMBOL_DEFINITION CertReplaceOK_Item */
// ### ASN.1 Definition:
//
// ```asn1
// CertReplaceOK-Item ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type CertReplaceOK_Item = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION CertReplaceOK_Item */ /* START_OF_SYMBOL_DEFINITION CertReplaceErr_code */
// ### ASN.1 Definition:
//
// ```asn1
// CertReplaceErr-code ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type CertReplaceErr_code = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION CertReplaceErr_code */ /* START_OF_SYMBOL_DEFINITION CertUpdateReq_certs_Item */
// ### ASN.1 Definition:
//
// ```asn1
// CertUpdateReq-certs-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type CertUpdateReq_certs_Item struct {
	Subject      Name
	SerialNumber CertificateSerialNumber
	CertStatus   CertStatus
}

/* END_OF_SYMBOL_DEFINITION CertUpdateReq_certs_Item */ /* START_OF_SYMBOL_DEFINITION CertUpdateRsp_result */
// ### ASN.1 Definition:
//
// ```asn1
// CertUpdateRsp-result ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type CertUpdateRsp_result = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION CertUpdateRsp_result */ /* START_OF_SYMBOL_DEFINITION CertUpdateOK_Item_ok */
// ### ASN.1 Definition:
//
// ```asn1
// CertUpdateOK-Item-ok ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type CertUpdateOK_Item_ok struct {
	Subject      Name
	SerialNumber CertificateSerialNumber
}

/* END_OF_SYMBOL_DEFINITION CertUpdateOK_Item_ok */ /* START_OF_SYMBOL_DEFINITION CertUpdateOK_Item_not_ok */
// ### ASN.1 Definition:
//
// ```asn1
// CertUpdateOK-Item-not-ok ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type CertUpdateOK_Item_not_ok struct {
	Status CASP_CertStatusCode
}

/* END_OF_SYMBOL_DEFINITION CertUpdateOK_Item_not_ok */ /* START_OF_SYMBOL_DEFINITION CertUpdateOK_Item */
// ### ASN.1 Definition:
//
// ```asn1
// CertUpdateOK-Item ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type CertUpdateOK_Item = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION CertUpdateOK_Item */ /* START_OF_SYMBOL_DEFINITION TBerror_code */
// ### ASN.1 Definition:
//
// ```asn1
// TBerror-code ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
// ```
type TBerror_code = asn1.Enumerated

const (
	TBerror_code_CaCertInvalid        TBerror_code = 1  // LONG_NAMED_ENUMERATED_VALUE,
	TBerror_code_UnknownCert          TBerror_code = 2  // LONG_NAMED_ENUMERATED_VALUE,
	TBerror_code_UnknownCertStatus    TBerror_code = 3  // LONG_NAMED_ENUMERATED_VALUE,
	TBerror_code_SubjectCertRevoked   TBerror_code = 4  // LONG_NAMED_ENUMERATED_VALUE,
	TBerror_code_IncorrectCert        TBerror_code = 5  // LONG_NAMED_ENUMERATED_VALUE,
	TBerror_code_ContractExpired      TBerror_code = 6  // LONG_NAMED_ENUMERATED_VALUE,
	TBerror_code_PathValidationFailed TBerror_code = 7  // LONG_NAMED_ENUMERATED_VALUE,
	TBerror_code_TimeOut              TBerror_code = 8  // LONG_NAMED_ENUMERATED_VALUE,
	TBerror_code_Other                TBerror_code = 99 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION TBerror_code */
