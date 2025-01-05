package x500_go

import (
	"crypto/x509"
	"encoding/asn1"
	"time"
)

// # ASN.1 Definition:
//
//	AVMPcommonComponents ::= SEQUENCE {
//	  version    AVMPversion DEFAULT v1,
//	  timeStamp  GeneralizedTime,
//	  sequence   AVMPsequence,
//	  ... }
type AVMPcommonComponents struct {
	Version   AVMPversion `asn1:"optional"`
	TimeStamp time.Time
	Sequence  AVMPsequence
}

// # ASN.1 Definition:
//
//	AVMPversion ::= ENUMERATED { v1(1), v2(2), v3(3), ... }
type AVMPversion = asn1.Enumerated

const (
	AVMPversion_V1 AVMPversion = 1
	AVMPversion_V2 AVMPversion = 2
	AVMPversion_V3 AVMPversion = 3
)

// # ASN.1 Definition:
//
//	AVMPsequence ::= INTEGER (1..MAX)
type AVMPsequence = int64

// # ASN.1 Definition:
//
//	CertReq ::= SEQUENCE {
//	  COMPONENTS OF AVMPcommonComponents,
//	  ... }
type CertReq struct {
	Version   AVMPversion `asn1:"optional"`
	TimeStamp time.Time
	Sequence  AVMPsequence
}

// # ASN.1 Definition:
//
//	CertRsp ::= SEQUENCE {
//	  COMPONENTS OF AVMPcommonComponents,
//	  result        CHOICE {
//	    success       [0]  CertOK,
//	    failure       [1]  CertErr,
//	    ... },
//	  ... }
type CertRsp struct {
	Version   AVMPversion `asn1:"optional"`
	TimeStamp time.Time
	Sequence  AVMPsequence
	Result    CertRsp_result
}

// # ASN.1 Definition:
//
//	CertOK ::= SEQUENCE {
//	  dhCert  Certificate,
//	  ... }
type CertOK struct {
	DhCert x509.Certificate
}

// # ASN.1 Definition:
//
//	CertErr ::= SEQUENCE {
//	  notOK  CHOICE {
//	    wrErr   [0]  PkiWaError,
//	    avmpErr [1]  AVMP-error,
//	    ... },
//	  note   Notifications OPTIONAL,
//	  ... }
type CertErr struct {
	NotOK CertErr_notOK
	Note  Notifications `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	Notifications ::= SEQUENCE SIZE (1..MAX) OF Attribute {{SupportedAttributes}}
type Notifications = [](Attribute)

// # ASN.1 Definition:
//
//	AddAvlReq ::= SEQUENCE {
//	  COMPONENTS OF AVMPcommonComponents,
//	  certlist      CertAVL,
//	  ... }
type AddAvlReq struct {
	Version   AVMPversion `asn1:"optional"`
	TimeStamp time.Time
	Sequence  AVMPsequence
	Certlist  CertAVL
}

// # ASN.1 Definition:
//
//	AddAvlRsp ::= SEQUENCE {
//	  COMPONENTS OF AVMPcommonComponents,
//	  result        CHOICE {
//	    success       [0]  AddAvlOK,
//	    failure       [1]  AddAvlErr,
//	    ... },
//	  ... }
type AddAvlRsp struct {
	Version   AVMPversion `asn1:"optional"`
	TimeStamp time.Time
	Sequence  AVMPsequence
	Result    AddAvlRsp_result
}

// # ASN.1 Definition:
//
//	AddAvlOK ::= SEQUENCE {
//	  ok     NULL,
//	  ... }
type AddAvlOK struct {
	Ok asn1.RawValue
}

// # ASN.1 Definition:
//
//	AddAvlErr ::= SEQUENCE {
//	  notOK  AVMP-error,
//	  ... }
type AddAvlErr struct {
	NotOK AVMP_error
}

// # ASN.1 Definition:
//
//	ReplaceAvlReq ::= SEQUENCE {
//	  COMPONENTS OF AVMPcommonComponents,
//	  old           AvlSerialNumber OPTIONAL,
//	  new           CertAVL,
//	  ... }
type ReplaceAvlReq struct {
	Version   AVMPversion `asn1:"optional"`
	TimeStamp time.Time
	Sequence  AVMPsequence
	Old       AvlSerialNumber `asn1:"optional"`
	New       CertAVL
}

// # ASN.1 Definition:
//
//	ReplaceAvlRsp ::= SEQUENCE {
//	  COMPONENTS OF AVMPcommonComponents,
//	  result        CHOICE {
//	    success       [0]  RepAvlOK,
//	    failure       [1]  RepAvlErr,
//	    ... },
//	  ... }
type ReplaceAvlRsp struct {
	Version   AVMPversion `asn1:"optional"`
	TimeStamp time.Time
	Sequence  AVMPsequence
	Result    ReplaceAvlRsp_result
}

// # ASN.1 Definition:
//
//	RepAvlOK ::= SEQUENCE {
//	  ok     NULL,
//	  ... }
type RepAvlOK struct {
	Ok asn1.RawValue
}

// # ASN.1 Definition:
//
//	RepAvlErr ::= SEQUENCE {
//	  notOK  AVMP-error,
//	  ... }
type RepAvlErr struct {
	NotOK AVMP_error
}

// # ASN.1 Definition:
//
//	DeleteAvlReq ::= SEQUENCE {
//	  COMPONENTS OF AVMPcommonComponents,
//	  avl-Id        AvlSerialNumber OPTIONAL,
//	  ... }
type DeleteAvlReq struct {
	Version   AVMPversion `asn1:"optional"`
	TimeStamp time.Time
	Sequence  AVMPsequence
	Avl_Id    AvlSerialNumber `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	DeleteAvlRsp ::= SEQUENCE {
//	  COMPONENTS OF AVMPcommonComponents,
//	  result        CHOICE {
//	    success       [0]  DelAvlOK,
//	    failure       [1]  DelAvlErr,
//	    ... },
//	  ... }
type DeleteAvlRsp struct {
	Version   AVMPversion `asn1:"optional"`
	TimeStamp time.Time
	Sequence  AVMPsequence
	Result    DeleteAvlRsp_result
}

// # ASN.1 Definition:
//
//	DelAvlOK ::= SEQUENCE {
//	  ok     NULL,
//	  ... }
type DelAvlOK struct {
	Ok asn1.RawValue
}

// # ASN.1 Definition:
//
//	DelAvlErr ::= SEQUENCE {
//	  notOK  AVMP-error,
//	  ... }
type DelAvlErr struct {
	NotOK AVMP_error
}

// # ASN.1 Definition:
//
//	RejectAVL ::= SEQUENCE {
//	  COMPONENTS OF AVMPcommonComponents,
//	  reason        AVMP-error,
//	  ... }
type RejectAVL struct {
	Version   AVMPversion `asn1:"optional"`
	TimeStamp time.Time
	Sequence  AVMPsequence
	Reason    AVMP_error
}

// # ASN.1 Definition:
//
//	CASPcommonComponents ::= SEQUENCE {
//	  version    CASPversion DEFAULT v1,
//	  sequence   CASPsequence,
//	  ... }
type CASPcommonComponents struct {
	Version  CASPversion `asn1:"optional"`
	Sequence CASPsequence
}

// # ASN.1 Definition:
//
//	CASPversion ::= ENUMERATED { v1(1), v2(2), v3(3), ... }
type CASPversion = asn1.Enumerated

const (
	CASPversion_V1 CASPversion = 1
	CASPversion_V2 CASPversion = 2
	CASPversion_V3 CASPversion = 3
)

// # ASN.1 Definition:
//
//	CASPsequence ::= INTEGER (1..MAX)
type CASPsequence = int64

// # ASN.1 Definition:
//
//	CertSubscribeReq ::= SEQUENCE {
//	  COMPONENTS OF CASPcommonComponents,
//	  certs   SEQUENCE (SIZE (1..MAX)) OF SEQUENCE {
//	    subject      Name,
//	    serialNumber CertificateSerialNumber,
//	    ... },
//	  ... }
type CertSubscribeReq struct {
	Version  CASPversion `asn1:"optional"`
	Sequence CASPsequence
	Certs    [](CertSubscribeReq_certs_Item)
}

// # ASN.1 Definition:
//
//	CertSubscribeRsp ::= SEQUENCE {
//	  COMPONENTS OF CASPcommonComponents,
//	  result       CHOICE {
//	    success       [0]  CertSubscribeOK,
//	    failure       [1]  CertSubscribeErr,
//	    ... },
//	  ... }
type CertSubscribeRsp struct {
	Version  CASPversion `asn1:"optional"`
	Sequence CASPsequence
	Result   CertSubscribeRsp_result
}

// # ASN.1 Definition:
//
//	CertSubscribeOK ::= SEQUENCE (SIZE (1..MAX)) OF CHOICE {
//	  ok       [0] SEQUENCE {
//	    cert         Certificate,
//	    status       CertStatus,
//	    revokeReason CRLReason OPTIONAL,
//	    ... },
//	  not-ok   [1] SEQUENCE {
//	    status       CASP-CertStatusCode,
//	    ... },
//	  ... }
type CertSubscribeOK = [](CertSubscribeOK_Item)

// # ASN.1 Definition:
//
//	CertStatus ::= ENUMERATED {
//	  good    (0),
//	  revoked (1),
//	  on-hold (2),
//	  expired (3),
//	  ... }
type CertStatus = asn1.Enumerated

const (
	CertStatus_Good    CertStatus = 0
	CertStatus_Revoked CertStatus = 1
	CertStatus_On_hold CertStatus = 2
	CertStatus_Expired CertStatus = 3
)

// # ASN.1 Definition:
//
//	CASP-CertStatusCode ::= ENUMERATED {
//	  noReason       (1),
//	  unknownCert    (2),
//	  ... }
type CASP_CertStatusCode = asn1.Enumerated

const (
	CASP_CertStatusCode_NoReason    CASP_CertStatusCode = 1
	CASP_CertStatusCode_UnknownCert CASP_CertStatusCode = 2
)

// # ASN.1 Definition:
//
//	CertSubscribeErr ::= SEQUENCE {
//	  code       CASP-error,
//	  ... }
type CertSubscribeErr struct {
	Code CASP_error
}

// # ASN.1 Definition:
//
//	CertUnsubscribeReq ::= SEQUENCE {
//	  COMPONENTS OF CASPcommonComponents,
//	  certs  SEQUENCE (SIZE (1..MAX)) OF SEQUENCE {
//	    subject      Name,
//	    serialNumber CertificateSerialNumber,
//	    ... },
//	  ... }
type CertUnsubscribeReq struct {
	Version  CASPversion `asn1:"optional"`
	Sequence CASPsequence
	Certs    [](CertUnsubscribeReq_certs_Item)
}

// # ASN.1 Definition:
//
//	CertUnsubscribeRsp ::= SEQUENCE {
//	  COMPONENTS OF CASPcommonComponents,
//	  result       CHOICE {
//	    success       [0]  CertUnsubscribeOK,
//	    failure       [1]  CertUnsubscribeErr,
//	    ... },
//	  ... }
type CertUnsubscribeRsp struct {
	Version  CASPversion `asn1:"optional"`
	Sequence CASPsequence
	Result   CertUnsubscribeRsp_result
}

// # ASN.1 Definition:
//
//	CertUnsubscribeOK ::= SEQUENCE (SIZE (1..MAX)) OF CHOICE {
//	  ok       [0] SEQUENCE {
//	    subject      Name,
//	    serialNumber CertificateSerialNumber,
//	    ... },
//	  not-ok   [1] SEQUENCE {
//	    status       CASP-CertStatusCode,
//	    ... },
//	  ... }
type CertUnsubscribeOK = [](CertUnsubscribeOK_Item)

// # ASN.1 Definition:
//
//	CertUnsubscribeErr ::= SEQUENCE {
//	  code         CASP-error,
//	  ... }
type CertUnsubscribeErr struct {
	Code CASP_error
}

// # ASN.1 Definition:
//
//	CertReplaceReq ::= SEQUENCE {
//	  COMPONENTS OF CASPcommonComponents,
//	  certs         SEQUENCE (SIZE (1..MAX)) OF SEQUENCE {
//	    old           CertificateSerialNumber,
//	    new           Certificate,
//	    ... },
//	  ... }
type CertReplaceReq struct {
	Version  CASPversion `asn1:"optional"`
	Sequence CASPsequence
	Certs    [](CertReplaceReq_certs_Item)
}

// # ASN.1 Definition:
//
//	CertReplaceRsp ::= SEQUENCE {
//	  COMPONENTS OF CASPcommonComponents,
//	  result        CHOICE {
//	    success       [0]  CertReplaceOK,
//	    failure       [1]  CertReplaceErr,
//	    ... },
//	  ... }
type CertReplaceRsp struct {
	Version  CASPversion `asn1:"optional"`
	Sequence CASPsequence
	Result   CertReplaceRsp_result
}

// # ASN.1 Definition:
//
//	CertReplaceOK ::= SEQUENCE (SIZE (1..MAX)) OF CHOICE {
//	  ok        [0] SEQUENCE {
//	    issuer        Name,
//	    serialNumber  CertificateSerialNumber,
//	    ... },
//	  not-ok    [1] SEQUENCE {
//	    status        CASP-CertStatusCode,
//	    ... },
//	  ... }
type CertReplaceOK = [](CertReplaceOK_Item)

// # ASN.1 Definition:
//
//	CertReplaceErr ::= SEQUENCE {
//	  code        CHOICE {
//	    signedData     [0]  SignedData-error,
//	    envelopedData  [1]  EnvelopedData-error,
//	    casp           [2]  CASP-error,
//	    ... },
//	  ... }
type CertReplaceErr struct {
	Code CertReplaceErr_code
}

// # ASN.1 Definition:
//
//	CertUpdateReq ::= SEQUENCE {
//	  COMPONENTS OF CASPcommonComponents,
//	  certs  SEQUENCE (SIZE (1..MAX)) OF SEQUENCE {
//	    subject      Name,
//	    serialNumber CertificateSerialNumber,
//	    certStatus   CertStatus,
//	    ... },
//	  ... }
type CertUpdateReq struct {
	Version  CASPversion `asn1:"optional"`
	Sequence CASPsequence
	Certs    [](CertUpdateReq_certs_Item)
}

// # ASN.1 Definition:
//
//	CertUpdateRsp ::= SEQUENCE {
//	  COMPONENTS OF CASPcommonComponents,
//	  result        CHOICE {
//	    success       [0]  CertUpdateOK,
//	    failure       [1]  CertUpdateErr,
//	    ... },
//	  ... }
type CertUpdateRsp struct {
	Version  CASPversion `asn1:"optional"`
	Sequence CASPsequence
	Result   CertUpdateRsp_result
}

// # ASN.1 Definition:
//
//	CertUpdateOK ::= SEQUENCE (SIZE (1..MAX)) OF CHOICE {
//	  ok        [0] SEQUENCE {
//	    subject       Name,
//	    serialNumber  CertificateSerialNumber,
//	    ... },
//	  not-ok    [1] SEQUENCE {
//	    status        CASP-CertStatusCode,
//	    ... },
//	  ... }
type CertUpdateOK = [](CertUpdateOK_Item)

// # ASN.1 Definition:
//
//	CertUpdateErr ::= SEQUENCE {
//	  code          CASP-error,
//	  ... }
type CertUpdateErr struct {
	Code CASP_error
}

// # ASN.1 Definition:
//
//	RejectCAsubscribe ::= SEQUENCE {
//	  COMPONENTS OF CASPcommonComponents,
//	  reason        CASP-error,
//	  ... }
type RejectCAsubscribe struct {
	Version  CASPversion `asn1:"optional"`
	Sequence CASPsequence
	Reason   CASP_error
}

// # ASN.1 Definition:
//
//	SignedData-error ::= ENUMERATED {
//	  noReason                           (0),
//	  signedDataContectTypeExpected      (1),
//	  wrongSignedDataVersion             (2),
//	  missingContent                     (3),
//	  missingContentComponent            (4),
//	  invalidContentComponent            (5),
//	  unsupportedHashAlgorithm           (6),
//	  ... }
type SignedData_error = asn1.Enumerated

const (
	SignedData_error_NoReason                      SignedData_error = 0
	SignedData_error_SignedDataContectTypeExpected SignedData_error = 1
	SignedData_error_WrongSignedDataVersion        SignedData_error = 2
	SignedData_error_MissingContent                SignedData_error = 3
	SignedData_error_MissingContentComponent       SignedData_error = 4
	SignedData_error_InvalidContentComponent       SignedData_error = 5
	SignedData_error_UnsupportedHashAlgorithm      SignedData_error = 6
)

// # ASN.1 Definition:
//
//	EnvelopedData-error ::= ENUMERATED {
//	  noReason                           (0),
//	  ... }
type EnvelopedData_error = asn1.Enumerated

const (
	EnvelopedData_error_NoReason EnvelopedData_error = 0
)

// # ASN.1 Definition:
//
//	AVMP-error ::= ENUMERATED {
//	  noReason                           (0),
//	  unknownAvlEntity                   (1),
//	  unknownContentType                 (2),
//	  unsupportedAVMPversion             (3),
//	  missingContent                     (4),
//	  missingContentComponent            (5),
//	  invalidContentComponent            (6),
//	  sequenceError                      (7),
//	  protocolError                      (8),
//	  invalidAvlSignature                (9),
//	  duplicateAVL                       (10),
//	  missingAvlComponent                (11),
//	  invalidAvlVersion                  (12),
//	  notAllowedForConstrainedAVLEntity  (13),
//	  constrainedRequired                (14),
//	  nonConstrainedRequired             (15),
//	  unsupportedCriticalEntryExtension  (16),
//	  unsupportedCriticalExtension       (17),
//	  maxAVLsExceeded                    (18),
//	  unknownCert                        (19),
//	  unknownAVL                         (20),
//	  unsupportedScopeRestriction        (21),
//	  ... }
type AVMP_error = asn1.Enumerated

const (
	AVMP_error_NoReason                          AVMP_error = 0
	AVMP_error_UnknownAvlEntity                  AVMP_error = 1
	AVMP_error_UnknownContentType                AVMP_error = 2
	AVMP_error_UnsupportedAVMPversion            AVMP_error = 3
	AVMP_error_MissingContent                    AVMP_error = 4
	AVMP_error_MissingContentComponent           AVMP_error = 5
	AVMP_error_InvalidContentComponent           AVMP_error = 6
	AVMP_error_SequenceError                     AVMP_error = 7
	AVMP_error_ProtocolError                     AVMP_error = 8
	AVMP_error_InvalidAvlSignature               AVMP_error = 9
	AVMP_error_DuplicateAVL                      AVMP_error = 10
	AVMP_error_MissingAvlComponent               AVMP_error = 11
	AVMP_error_InvalidAvlVersion                 AVMP_error = 12
	AVMP_error_NotAllowedForConstrainedAVLEntity AVMP_error = 13
	AVMP_error_ConstrainedRequired               AVMP_error = 14
	AVMP_error_NonConstrainedRequired            AVMP_error = 15
	AVMP_error_UnsupportedCriticalEntryExtension AVMP_error = 16
	AVMP_error_UnsupportedCriticalExtension      AVMP_error = 17
	AVMP_error_MaxAVLsExceeded                   AVMP_error = 18
	AVMP_error_UnknownCert                       AVMP_error = 19
	AVMP_error_UnknownAVL                        AVMP_error = 20
	AVMP_error_UnsupportedScopeRestriction       AVMP_error = 21
)

// # ASN.1 Definition:
//
//	CASP-error ::= ENUMERATED {
//	  noReason                      (0),
//	  unknownContentType            (1),
//	  unsupportedWLMPversion        (2),
//	  missingContent                (3),
//	  missingContentComponent       (4),
//	  invalidContentComponent       (5),
//	  sequenceError                 (6),
//	  unknownSubject                (7),
//	  unknownCert                   (8),
//	  ... }
type CASP_error = asn1.Enumerated

const (
	CASP_error_NoReason                CASP_error = 0
	CASP_error_UnknownContentType      CASP_error = 1
	CASP_error_UnsupportedWLMPversion  CASP_error = 2
	CASP_error_MissingContent          CASP_error = 3
	CASP_error_MissingContentComponent CASP_error = 4
	CASP_error_InvalidContentComponent CASP_error = 5
	CASP_error_SequenceError           CASP_error = 6
	CASP_error_UnknownSubject          CASP_error = 7
	CASP_error_UnknownCert             CASP_error = 8
)

// # ASN.1 Definition:
//
//	id-signedData OBJECT IDENTIFIER ::= {iso(1) member-body(2) us(840)rsadsi(113549) pkcs(1) pkcs7(7) 2}
var Id_signedData asn1.ObjectIdentifier = []int{1, 2, 840, 113549, 1, 7, 2}

// # ASN.1 Definition:
//
//	id-envelopedData OBJECT IDENTIFIER ::= {iso(1) member-body(2) us(840) rsadsi(113549) pkcs(1) pkcs7(7) 3}
var Id_envelopedData asn1.ObjectIdentifier = []int{1, 2, 840, 113549, 1, 7, 3}

// # ASN.1 Definition:
//
//	id-certReq              OBJECT IDENTIFIER ::= {id-cmsct 0}
var Id_certReq asn1.ObjectIdentifier = []int{2, 5, 42, 0}

// # ASN.1 Definition:
//
//	id-certRsp              OBJECT IDENTIFIER ::= {id-cmsct 1}
var Id_certRsp asn1.ObjectIdentifier = []int{2, 5, 42, 1}

// # ASN.1 Definition:
//
//	id-addAvlReq            OBJECT IDENTIFIER ::= {id-cmsct 2}
var Id_addAvlReq asn1.ObjectIdentifier = []int{2, 5, 42, 2}

// # ASN.1 Definition:
//
//	id-addAvlRsp            OBJECT IDENTIFIER ::= {id-cmsct 3}
var Id_addAvlRsp asn1.ObjectIdentifier = []int{2, 5, 42, 3}

// # ASN.1 Definition:
//
//	id-replaceAvlReq        OBJECT IDENTIFIER ::= {id-cmsct 4}
var Id_replaceAvlReq asn1.ObjectIdentifier = []int{2, 5, 42, 4}

// # ASN.1 Definition:
//
//	id-replaceAvlRsp        OBJECT IDENTIFIER ::= {id-cmsct 5}
var Id_replaceAvlRsp asn1.ObjectIdentifier = []int{2, 5, 42, 5}

// # ASN.1 Definition:
//
//	id-updateAvlReq         OBJECT IDENTIFIER ::= {id-cmsct 6}
var Id_updateAvlReq asn1.ObjectIdentifier = []int{2, 5, 42, 6}

// # ASN.1 Definition:
//
//	id-updateAvlRsp         OBJECT IDENTIFIER ::= {id-cmsct 7}
var Id_updateAvlRsp asn1.ObjectIdentifier = []int{2, 5, 42, 7}

// # ASN.1 Definition:
//
//	id-deleteAvlReq         OBJECT IDENTIFIER ::= {id-cmsct 8}
var Id_deleteAvlReq asn1.ObjectIdentifier = []int{2, 5, 42, 8}

// # ASN.1 Definition:
//
//	id-deleteAvlRsp         OBJECT IDENTIFIER ::= {id-cmsct 9}
var Id_deleteAvlRsp asn1.ObjectIdentifier = []int{2, 5, 42, 9}

// # ASN.1 Definition:
//
//	id-rejectAVL            OBJECT IDENTIFIER ::= {id-cmsct 10}
var Id_rejectAVL asn1.ObjectIdentifier = []int{2, 5, 42, 10}

// # ASN.1 Definition:
//
//	id-certSubscribeReq     OBJECT IDENTIFIER ::= {id-cmsct 11}
var Id_certSubscribeReq asn1.ObjectIdentifier = []int{2, 5, 42, 11}

// # ASN.1 Definition:
//
//	id-certSubscribeRsp     OBJECT IDENTIFIER ::= {id-cmsct 12}
var Id_certSubscribeRsp asn1.ObjectIdentifier = []int{2, 5, 42, 12}

// # ASN.1 Definition:
//
//	id-certUnsubscribeReq   OBJECT IDENTIFIER ::= {id-cmsct 13}
var Id_certUnsubscribeReq asn1.ObjectIdentifier = []int{2, 5, 42, 13}

// # ASN.1 Definition:
//
//	id-certUnsubscribeRsp   OBJECT IDENTIFIER ::= {id-cmsct 14}
var Id_certUnsubscribeRsp asn1.ObjectIdentifier = []int{2, 5, 42, 14}

// # ASN.1 Definition:
//
//	id-certReplaceReq       OBJECT IDENTIFIER ::= {id-cmsct 15}
var Id_certReplaceReq asn1.ObjectIdentifier = []int{2, 5, 42, 15}

// # ASN.1 Definition:
//
//	id-certReplaceRsp       OBJECT IDENTIFIER ::= {id-cmsct 16}
var Id_certReplaceRsp asn1.ObjectIdentifier = []int{2, 5, 42, 16}

// # ASN.1 Definition:
//
//	id-certUpdateReq        OBJECT IDENTIFIER ::= {id-cmsct 17}
var Id_certUpdateReq asn1.ObjectIdentifier = []int{2, 5, 42, 17}

// # ASN.1 Definition:
//
//	id-certUpdateRsp        OBJECT IDENTIFIER ::= {id-cmsct 18}
var Id_certUpdateRsp asn1.ObjectIdentifier = []int{2, 5, 42, 18}

// # ASN.1 Definition:
//
//	id-rejectCAsubscribe    OBJECT IDENTIFIER ::= {id-cmsct 19}
var Id_rejectCAsubscribe asn1.ObjectIdentifier = []int{2, 5, 42, 19}

// # ASN.1 Definition:
//
//	TBrequest ::= CHOICE {
//	  caCert      [0] PKCertIdentifier,
//	  subjectCert [1] PKCertIdentifier,
//	  ... }
type TBrequest = asn1.RawValue

// # ASN.1 Definition:
//
//	TBresponse ::= CHOICE {
//	  success [0]  TBOK,
//	  failure [1]  TBerror,
//	  ... }
type TBresponse = asn1.RawValue

// # ASN.1 Definition:
//
//	TBOK ::= SEQUENCE {
//	  levelOfAssurance  [0]  INTEGER (0..100),
//	  confidenceLevel   [1]  INTEGER (0..100),
//	  validationTime    [2]  UTCTime,
//	  info                   UTF8String  OPTIONAL,
//	  ... }
type TBOK struct {
	LevelOfAssurance int       `asn1:"explicit,tag:0"`
	ConfidenceLevel  int       `asn1:"explicit,tag:1"`
	ValidationTime   time.Time `asn1:"explicit,tag:2"`
	Info             string    `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	TBerror ::= SEQUENCE {
//	  code        ENUMERATED {
//	    caCertInvalid        (1),
//	    unknownCert          (2),
//	    unknownCertStatus    (3),
//	    subjectCertRevoked   (4),
//	    incorrectCert        (5),
//	    contractExpired      (6),
//	    pathValidationFailed (7),
//	    timeOut              (8),
//	    other                (99),
//	    ... },
//	  diagnostic  UTF8String OPTIONAL,
//	  ... }
type TBerror struct {
	Code       TBerror_code
	Diagnostic string `asn1:"optional,utf8"`
}

// # ASN.1 Definition:
//
//	CertRsp-result ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type CertRsp_result = asn1.RawValue

// # ASN.1 Definition:
//
//	CertErr-notOK ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type CertErr_notOK = asn1.RawValue

// # ASN.1 Definition:
//
//	AddAvlRsp-result ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type AddAvlRsp_result = asn1.RawValue

// # ASN.1 Definition:
//
//	ReplaceAvlRsp-result ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type ReplaceAvlRsp_result = asn1.RawValue

// # ASN.1 Definition:
//
//	DeleteAvlRsp-result ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type DeleteAvlRsp_result = asn1.RawValue

// # ASN.1 Definition:
//
//	CertSubscribeReq-certs-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type CertSubscribeReq_certs_Item struct {
	Subject      Name
	SerialNumber CertificateSerialNumber
}

// # ASN.1 Definition:
//
//	CertSubscribeRsp-result ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type CertSubscribeRsp_result = asn1.RawValue

// # ASN.1 Definition:
//
//	CertSubscribeOK-Item-ok ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type CertSubscribeOK_Item_ok struct {
	Cert         x509.Certificate
	Status       CertStatus
	RevokeReason CRLReason `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	CertSubscribeOK-Item-not-ok ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type CertSubscribeOK_Item_not_ok struct {
	Status CASP_CertStatusCode
}

// # ASN.1 Definition:
//
//	CertSubscribeOK-Item ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type CertSubscribeOK_Item = asn1.RawValue

// # ASN.1 Definition:
//
//	CertUnsubscribeReq-certs-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type CertUnsubscribeReq_certs_Item struct {
	Subject      Name
	SerialNumber CertificateSerialNumber
}

// # ASN.1 Definition:
//
//	CertUnsubscribeRsp-result ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type CertUnsubscribeRsp_result = asn1.RawValue

// # ASN.1 Definition:
//
//	CertUnsubscribeOK-Item-ok ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type CertUnsubscribeOK_Item_ok struct {
	Subject      Name
	SerialNumber CertificateSerialNumber
}

// # ASN.1 Definition:
//
//	CertUnsubscribeOK-Item-not-ok ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type CertUnsubscribeOK_Item_not_ok struct {
	Status CASP_CertStatusCode
}

// # ASN.1 Definition:
//
//	CertUnsubscribeOK-Item ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type CertUnsubscribeOK_Item = asn1.RawValue

// # ASN.1 Definition:
//
//	CertReplaceReq-certs-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type CertReplaceReq_certs_Item struct {
	Old CertificateSerialNumber
	New x509.Certificate
}

// # ASN.1 Definition:
//
//	CertReplaceRsp-result ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type CertReplaceRsp_result = asn1.RawValue

// # ASN.1 Definition:
//
//	CertReplaceOK-Item-ok ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type CertReplaceOK_Item_ok struct {
	Issuer       Name
	SerialNumber CertificateSerialNumber
}

// # ASN.1 Definition:
//
//	CertReplaceOK-Item-not-ok ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type CertReplaceOK_Item_not_ok struct {
	Status CASP_CertStatusCode
}

// # ASN.1 Definition:
//
//	CertReplaceOK-Item ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type CertReplaceOK_Item = asn1.RawValue

// # ASN.1 Definition:
//
//	CertReplaceErr-code ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type CertReplaceErr_code = asn1.RawValue

// # ASN.1 Definition:
//
//	CertUpdateReq-certs-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type CertUpdateReq_certs_Item struct {
	Subject      Name
	SerialNumber CertificateSerialNumber
	CertStatus   CertStatus
}

// # ASN.1 Definition:
//
//	CertUpdateRsp-result ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type CertUpdateRsp_result = asn1.RawValue

// # ASN.1 Definition:
//
//	CertUpdateOK-Item-ok ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type CertUpdateOK_Item_ok struct {
	Subject      Name
	SerialNumber CertificateSerialNumber
}

// # ASN.1 Definition:
//
//	CertUpdateOK-Item-not-ok ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type CertUpdateOK_Item_not_ok struct {
	Status CASP_CertStatusCode
}

// # ASN.1 Definition:
//
//	CertUpdateOK-Item ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type CertUpdateOK_Item = asn1.RawValue

// # ASN.1 Definition:
//
//	TBerror-code ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
type TBerror_code = asn1.Enumerated

const (
	TBerror_code_CaCertInvalid        TBerror_code = 1
	TBerror_code_UnknownCert          TBerror_code = 2
	TBerror_code_UnknownCertStatus    TBerror_code = 3
	TBerror_code_SubjectCertRevoked   TBerror_code = 4
	TBerror_code_IncorrectCert        TBerror_code = 5
	TBerror_code_ContractExpired      TBerror_code = 6
	TBerror_code_PathValidationFailed TBerror_code = 7
	TBerror_code_TimeOut              TBerror_code = 8
	TBerror_code_Other                TBerror_code = 99
)
