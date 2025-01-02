package x500_go

import (
	"context"
	"crypto/tls"
	"crypto/x509/pkix"
	"encoding/asn1"
	"fmt"
	"net"
	"os"
	"sync"
	"testing"
	"time"
)

var sensibleTimeout = time.Duration(5) * time.Second

func TestReadAnEntry(t *testing.T) {
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		os.Exit(53)
	}
	errchan := make(chan error)
	idm := IDMProtocolStack{
		socket:            conn,
		ReceivedData:      make([]byte, 0),
		startTLSResponse:  make(chan asn1.Enumerated, 1),
		NextInvokeId:      1,
		PendingOperations: make(map[int]chan X500OpOutcome),
		bound:             false,
		bindOutcome:       make(chan X500AssociateOutcome),
		mutex:             sync.Mutex{},
		resultSigning:     ProtectionRequest_None,
		errorSigning:      ProtectionRequest_None,
		signingKey:        nil,
		signingCert:       nil,
		errorChannel:      errchan,
		StartTLSPolicy:    StartTLSNever,
	}
	go func() {
		e := <-errchan
		fmt.Printf("Error: %v\n", e)
	}()
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	_, err = idm.BindAnonymously(ctx)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		os.Exit(2)
	}
	invokeId := idm.GetNextInvokeId()
	dn := DistinguishedName{
		[]pkix.AttributeTypeAndValue{
			{
				Type: Id_at_countryName,
				Value: asn1.RawValue{
					Tag:        asn1.TagPrintableString,
					Class:      asn1.ClassUniversal,
					IsCompound: false,
					Bytes:      []byte("US"),
				},
			},
		},
	}
	name_bytes, err := asn1.Marshal(dn)
	if err != nil {
		os.Exit(6)
	}
	name := asn1.RawValue{FullBytes: name_bytes}
	arg_data := ReadArgumentData{
		Object: asn1.RawValue{
			Tag:        0,
			Class:      asn1.ClassContextSpecific,
			IsCompound: true,
			Bytes:      name.FullBytes,
		},
	}
	arg_bytes, err := asn1.MarshalWithParams(arg_data, "set")
	if err != nil {
		os.Exit(7)
		return
	}
	iidBytes, err := asn1.Marshal(invokeId)
	if err != nil {
		os.Exit(8)
		return
	}
	req := X500Request{
		InvokeId: asn1.RawValue{
			FullBytes: iidBytes,
		},
		OpCode: asn1.RawValue{
			Tag:        asn1.TagInteger,
			Class:      asn1.ClassUniversal,
			IsCompound: false,
			Bytes:      []byte{0x01}, // Read operation
		},
		Argument: asn1.RawValue{FullBytes: arg_bytes},
	}
	ctx, cancel = context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	outcome, err := idm.Request(ctx, req)
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(9)
		return
	}
	result := ReadResultData{}
	rest, err := asn1.UnmarshalWithParams(outcome.Parameter.FullBytes, &result, "set")
	if err != nil {
		os.Exit(11)
		return
	}
	if len(rest) > 0 {
		os.Exit(12)
		return
	}
	for _, info := range result.Entry.Information {
		if info.Tag == asn1.TagOID { // AttributeType
			oid := asn1.ObjectIdentifier{}
			rest, err := asn1.Unmarshal(info.FullBytes, &oid)
			if err != nil {
				continue
			}
			if len(rest) > 0 {
				continue
			}
			fmt.Printf("Attribute Type: %s\n", oid.String())
		} else if info.Tag == asn1.TagSequence { // Attribute
			attr := Attribute{}
			rest, err := asn1.Unmarshal(info.FullBytes, &attr)
			if err != nil {
				continue
			}
			if len(rest) > 0 {
				continue
			}
			fmt.Printf("Attribute Type: %s\n", attr.Type.String())
			for _, value := range attr.Values {
				str, err := ASN1RawValueToStr(value)
				if err != nil {
					fmt.Println(err.Error())
					continue
				}
				if len(str) == 0 {
					fmt.Println("  <empty>")
				} else {
					fmt.Printf("  %s\n", str)
				}
			}
			for _, vwc := range attr.ValuesWithContext {
				str, err := ASN1RawValueToStr(vwc.Value)
				if err != nil {
					fmt.Println(err.Error())
					continue
				}
				fmt.Printf("  %s (Has Contexts)\n", str)
			}
		} else { // Something else
			continue
		}
	}
}

func TestReadAnEntry2(t *testing.T) {
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		os.Exit(53)
	}
	errchan := make(chan error)
	idm := IDMProtocolStack{
		socket:            conn,
		ReceivedData:      make([]byte, 0),
		NextInvokeId:      1,
		startTLSResponse:  make(chan asn1.Enumerated, 1),
		PendingOperations: make(map[int]chan X500OpOutcome),
		bound:             false,
		bindOutcome:       make(chan X500AssociateOutcome),
		mutex:             sync.Mutex{},
		resultSigning:     ProtectionRequest_None,
		errorSigning:      ProtectionRequest_None,
		signingKey:        nil,
		signingCert:       nil,
		errorChannel:      errchan,
		StartTLSPolicy:    StartTLSNever,
	}
	go func() {
		e := <-errchan
		fmt.Printf("Error: %v\n", e)
		os.Exit(40)
	}()
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	_, err = idm.BindAnonymously(ctx)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		os.Exit(2)
	}
	dn := DistinguishedName{
		[]pkix.AttributeTypeAndValue{
			{
				Type: Id_at_countryName,
				Value: asn1.RawValue{
					Tag:        asn1.TagPrintableString,
					Class:      asn1.ClassUniversal,
					IsCompound: false,
					Bytes:      []byte("US"),
				},
			},
		},
	}
	name_bytes, err := asn1.Marshal(dn)
	if err != nil {
		os.Exit(6)
	}
	name := asn1.RawValue{FullBytes: name_bytes}
	arg_data := ReadArgumentData{
		Object: asn1.RawValue{
			Tag:        0,
			Class:      asn1.ClassContextSpecific,
			IsCompound: true,
			Bytes:      name.FullBytes,
		},
		SecurityParameters: SecurityParameters{
			Target:          idm.resultSigning,
			ErrorProtection: idm.errorSigning,
		},
	}
	ctx, cancel = context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	_, res, err := idm.Read(ctx, arg_data)
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(9)
		return
	}
	for _, info := range res.Entry.Information {
		if info.Tag == asn1.TagOID { // AttributeType
			oid := asn1.ObjectIdentifier{}
			rest, err := asn1.Unmarshal(info.FullBytes, &oid)
			if err != nil {
				continue
			}
			if len(rest) > 0 {
				continue
			}
			fmt.Printf("Attribute Type: %s\n", oid.String())
		} else if info.Tag == asn1.TagSequence { // Attribute
			attr := Attribute{}
			rest, err := asn1.Unmarshal(info.FullBytes, &attr)
			if err != nil {
				continue
			}
			if len(rest) > 0 {
				continue
			}
			fmt.Printf("Attribute Type: %s\n", attr.Type.String())
			for _, value := range attr.Values {
				str, err := ASN1RawValueToStr(value)
				if err != nil {
					fmt.Println(err.Error())
					continue
				}
				if len(str) == 0 {
					fmt.Println("  <empty>")
				} else {
					fmt.Printf("  %s\n", str)
				}
			}
			for _, vwc := range attr.ValuesWithContext {
				str, err := ASN1RawValueToStr(vwc.Value)
				if err != nil {
					fmt.Println(err.Error())
					continue
				}
				fmt.Printf("  %s (Has Contexts)\n", str)
			}
		} else { // Something else
			continue
		}
	}
}

func TestManySimultaneousReads(t *testing.T) {
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		os.Exit(53)
	}
	errchan := make(chan error)
	idm := IDMProtocolStack{
		socket:            conn,
		ReceivedData:      make([]byte, 0),
		NextInvokeId:      1,
		startTLSResponse:  make(chan asn1.Enumerated, 1),
		PendingOperations: make(map[int]chan X500OpOutcome),
		bound:             false,
		bindOutcome:       make(chan X500AssociateOutcome),
		mutex:             sync.Mutex{},
		resultSigning:     ProtectionRequest_None,
		errorSigning:      ProtectionRequest_None,
		signingKey:        nil,
		signingCert:       nil,
		errorChannel:      errchan,
		StartTLSPolicy:    StartTLSNever,
	}
	go func() {
		e := <-errchan
		fmt.Printf("Error: %v\n", e)
		os.Exit(40)
	}()
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	_, err = idm.BindAnonymously(ctx)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		os.Exit(2)
	}
	dn := DistinguishedName{
		[]pkix.AttributeTypeAndValue{
			{
				Type: Id_at_countryName,
				Value: asn1.RawValue{
					Tag:        asn1.TagPrintableString,
					Class:      asn1.ClassUniversal,
					IsCompound: false,
					Bytes:      []byte("US"),
				},
			},
		},
	}
	name_bytes, err := asn1.Marshal(dn)
	if err != nil {
		os.Exit(6)
	}
	name := asn1.RawValue{FullBytes: name_bytes}
	arg_data := ReadArgumentData{
		Object: asn1.RawValue{
			Tag:        0,
			Class:      asn1.ClassContextSpecific,
			IsCompound: true,
			Bytes:      name.FullBytes,
		},
		SecurityParameters: SecurityParameters{
			Target:          idm.resultSigning,
			ErrorProtection: idm.errorSigning,
		},
	}
	// Spam many requests all concurrently
	var wg sync.WaitGroup
	for i := 1; i <= 10; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			ctx, cancel = context.WithTimeout(context.Background(), sensibleTimeout)
			defer cancel()
			outcome, _, err := idm.Read(ctx, arg_data)
			if err != nil {
				fmt.Println(err.Error())
				os.Exit(9)
				return
			}
			if outcome.OutcomeType != OPERATION_OUTCOME_TYPE_RESULT {
				os.Exit(41)
			}
		}()
	}
	wg.Wait()
}

func TestListAnEntry(t *testing.T) {
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		os.Exit(53)
	}
	errchan := make(chan error)
	idm := IDMProtocolStack{
		socket:            conn,
		ReceivedData:      make([]byte, 0),
		NextInvokeId:      1,
		startTLSResponse:  make(chan asn1.Enumerated, 1),
		PendingOperations: make(map[int]chan X500OpOutcome),
		bound:             false,
		bindOutcome:       make(chan X500AssociateOutcome),
		mutex:             sync.Mutex{},
		resultSigning:     ProtectionRequest_None,
		errorSigning:      ProtectionRequest_None,
		signingKey:        nil,
		signingCert:       nil,
		errorChannel:      errchan,
		StartTLSPolicy:    StartTLSNever,
	}
	go func() {
		e := <-errchan
		fmt.Printf("Error: %v\n", e)
		os.Exit(40)
	}()
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	_, err = idm.BindAnonymously(ctx)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		os.Exit(2)
	}
	dn := DistinguishedName{
		[]pkix.AttributeTypeAndValue{
			{
				Type: Id_at_countryName,
				Value: asn1.RawValue{
					Tag:        asn1.TagPrintableString,
					Class:      asn1.ClassUniversal,
					IsCompound: false,
					Bytes:      []byte("US"),
				},
			},
		},
	}
	name_bytes, err := asn1.Marshal(dn)
	if err != nil {
		os.Exit(6)
	}
	name := asn1.RawValue{FullBytes: name_bytes}
	arg_data := ListArgumentData{
		Object: asn1.RawValue{
			Tag:        0,
			Class:      asn1.ClassContextSpecific,
			IsCompound: true,
			Bytes:      name.FullBytes,
		},
		SecurityParameters: SecurityParameters{
			// No signing so we get searchInfo instead of uncorrelatedSearchInfo
			Target:          ProtectionRequest_None,
			ErrorProtection: ErrorProtectionRequest_None,
		},
	}
	ctx, cancel = context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	_, res, err := idm.List(ctx, arg_data)
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(9)
		return
	}
	for _, sub := range res.Subordinates {
		fmt.Printf("%v\n", sub.Rdn)
	}
}

func TestTLS(t *testing.T) {
	conn, err := tls.Dial("tcp", "localhost:44632", &tls.Config{
		InsecureSkipVerify: true,
	})
	if err != nil {
		os.Exit(53)
	}
	errchan := make(chan error)
	idm := IDMProtocolStack{
		socket:            conn,
		ReceivedData:      make([]byte, 0),
		NextInvokeId:      1,
		startTLSResponse:  make(chan asn1.Enumerated, 1),
		PendingOperations: make(map[int]chan X500OpOutcome),
		bound:             false,
		bindOutcome:       make(chan X500AssociateOutcome),
		mutex:             sync.Mutex{},
		resultSigning:     ProtectionRequest_None,
		errorSigning:      ProtectionRequest_None,
		signingKey:        nil,
		signingCert:       nil,
		errorChannel:      errchan,
		StartTLSPolicy:    StartTLSNever,
	}
	go func() {
		e := <-errchan
		fmt.Printf("Error: %v\n", e)
		os.Exit(40)
	}()
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	_, err = idm.BindAnonymously(ctx)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		os.Exit(2)
	}
	dn := DistinguishedName{
		[]pkix.AttributeTypeAndValue{
			{
				Type: Id_at_countryName,
				Value: asn1.RawValue{
					Tag:        asn1.TagPrintableString,
					Class:      asn1.ClassUniversal,
					IsCompound: false,
					Bytes:      []byte("US"),
				},
			},
		},
	}
	name_bytes, err := asn1.Marshal(dn)
	if err != nil {
		os.Exit(6)
	}
	name := asn1.RawValue{FullBytes: name_bytes}
	arg_data := ListArgumentData{
		Object: asn1.RawValue{
			Tag:        0,
			Class:      asn1.ClassContextSpecific,
			IsCompound: true,
			Bytes:      name.FullBytes,
		},
		SecurityParameters: SecurityParameters{
			// No signing so we get searchInfo instead of uncorrelatedSearchInfo
			Target:          ProtectionRequest_None,
			ErrorProtection: ErrorProtectionRequest_None,
		},
	}
	ctx, cancel = context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	_, res, err := idm.List(ctx, arg_data)
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(9)
		return
	}
	for _, sub := range res.Subordinates {
		fmt.Printf("%v\n", sub.Rdn)
	}
}

func TestAbandon(t *testing.T) {
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		os.Exit(53)
	}
	errchan := make(chan error)
	idm := IDMProtocolStack{
		socket:            conn,
		ReceivedData:      make([]byte, 0),
		NextInvokeId:      1,
		startTLSResponse:  make(chan asn1.Enumerated, 1),
		PendingOperations: make(map[int]chan X500OpOutcome),
		bound:             false,
		bindOutcome:       make(chan X500AssociateOutcome),
		mutex:             sync.Mutex{},
		resultSigning:     ProtectionRequest_None,
		errorSigning:      ProtectionRequest_None,
		signingKey:        nil,
		signingCert:       nil,
		errorChannel:      errchan,
		StartTLSPolicy:    StartTLSNever,
	}
	go func() {
		e := <-errchan
		fmt.Printf("Error: %v\n", e)
		os.Exit(40)
	}()
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	_, err = idm.BindAnonymously(ctx)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		os.Exit(2)
	}
	dn := DistinguishedName{
		[]pkix.AttributeTypeAndValue{
			{
				Type: Id_at_countryName,
				Value: asn1.RawValue{
					Tag:        asn1.TagPrintableString,
					Class:      asn1.ClassUniversal,
					IsCompound: false,
					Bytes:      []byte("US"),
				},
			},
		},
		// c=US,st=FL,l=HIL,l=Tampa,l=Westchase
		[]pkix.AttributeTypeAndValue{
			{
				Type: Id_at_stateOrProvinceName,
				Value: asn1.RawValue{
					Tag:        asn1.TagPrintableString,
					Class:      asn1.ClassUniversal,
					IsCompound: false,
					Bytes:      []byte("FL"),
				},
			},
		},
		[]pkix.AttributeTypeAndValue{
			{
				Type: Id_at_localityName,
				Value: asn1.RawValue{
					Tag:        asn1.TagPrintableString,
					Class:      asn1.ClassUniversal,
					IsCompound: false,
					Bytes:      []byte("HIL"),
				},
			},
		},
		[]pkix.AttributeTypeAndValue{
			{
				Type: Id_at_localityName,
				Value: asn1.RawValue{
					Tag:        asn1.TagPrintableString,
					Class:      asn1.ClassUniversal,
					IsCompound: false,
					Bytes:      []byte("Tampa"),
				},
			},
		},
		[]pkix.AttributeTypeAndValue{
			{
				Type: Id_at_localityName,
				Value: asn1.RawValue{
					Tag:        asn1.TagPrintableString,
					Class:      asn1.ClassUniversal,
					IsCompound: false,
					Bytes:      []byte("Westchase"),
				},
			},
		},
	}
	name_bytes, err := asn1.Marshal(dn)
	if err != nil {
		os.Exit(6)
	}
	name := asn1.RawValue{FullBytes: name_bytes}
	arg_data := ListArgumentData{
		Object: asn1.RawValue{
			Tag:        0,
			Class:      asn1.ClassContextSpecific,
			IsCompound: true,
			Bytes:      name.FullBytes,
		},
		SecurityParameters: SecurityParameters{
			// No signing so we get searchInfo instead of uncorrelatedSearchInfo
			Target:          ProtectionRequest_None,
			ErrorProtection: ErrorProtectionRequest_None,
		},
	}
	abandon_arg_data := AbandonArgumentData{
		InvokeID: asn1.RawValue{
			Class:      asn1.ClassContextSpecific,
			Tag:        0,
			IsCompound: true,
			Bytes:      []byte{2, 1, byte(1)},
		},
	}
	var wg sync.WaitGroup
	wg.Add(2)
	go func() {
		ctx, cancel = context.WithTimeout(context.Background(), sensibleTimeout)
		defer cancel()
		outcome, _, err := idm.List(ctx, arg_data)
		if err != nil {
			fmt.Println(err.Error())
			os.Exit(9)
			return
		}
		if outcome.OutcomeType != OPERATION_OUTCOME_TYPE_ERROR {
			t.Logf("Did not receive error. Outcome type=%d", outcome.OutcomeType)
			os.Exit(11)
		}
		wg.Done()
	}()
	go func() {
		// Abandon MUST run AFTER the list operation.
		time.Sleep(time.Duration(500) * time.Millisecond)
		ctx, cancel = context.WithTimeout(context.Background(), sensibleTimeout)
		defer cancel()
		outcome, _, err := idm.Abandon(ctx, abandon_arg_data)
		if err != nil {
			panic(err)
		}
		if outcome.OutcomeType != OPERATION_OUTCOME_TYPE_RESULT {
			t.Logf("Did not receive abort result. Outcome type=%d", outcome.OutcomeType)
			os.Exit(13)
		}
		wg.Done()
	}()
	wg.Wait()
}

func TestStartTLS(t *testing.T) {
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		os.Exit(53)
	}
	errchan := make(chan error)
	idm := IDMProtocolStack{
		socket:            conn,
		startTLSResponse:  make(chan asn1.Enumerated, 1),
		ReceivedData:      make([]byte, 0),
		NextInvokeId:      1,
		PendingOperations: make(map[int]chan X500OpOutcome),
		bound:             false,
		bindOutcome:       make(chan X500AssociateOutcome),
		mutex:             sync.Mutex{},
		resultSigning:     ProtectionRequest_None,
		errorSigning:      ProtectionRequest_None,
		signingKey:        nil,
		signingCert:       nil,
		errorChannel:      errchan,
		StartTLSPolicy:    StartTLSDemand,
		tlsConfig: &tls.Config{
			InsecureSkipVerify: true,
		},
	}
	go func() {
		e := <-errchan
		fmt.Printf("Error: %v\n", e)
		os.Exit(40)
	}()
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	_, err = idm.BindAnonymously(ctx)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		os.Exit(2)
	}
	dn := DistinguishedName{
		[]pkix.AttributeTypeAndValue{
			{
				Type: Id_at_countryName,
				Value: asn1.RawValue{
					Tag:        asn1.TagPrintableString,
					Class:      asn1.ClassUniversal,
					IsCompound: false,
					Bytes:      []byte("US"),
				},
			},
		},
	}
	name_bytes, err := asn1.Marshal(dn)
	if err != nil {
		os.Exit(6)
	}
	name := asn1.RawValue{FullBytes: name_bytes}
	arg_data := ListArgumentData{
		Object: asn1.RawValue{
			Tag:        0,
			Class:      asn1.ClassContextSpecific,
			IsCompound: true,
			Bytes:      name.FullBytes,
		},
		SecurityParameters: SecurityParameters{
			// No signing so we get searchInfo instead of uncorrelatedSearchInfo
			Target:          ProtectionRequest_None,
			ErrorProtection: ErrorProtectionRequest_None,
		},
	}
	ctx, cancel = context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	_, res, err := idm.List(ctx, arg_data)
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(9)
		return
	}
	for _, sub := range res.Subordinates {
		fmt.Printf("%v\n", sub.Rdn)
	}
}

func TestIDMv2(t *testing.T) {
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		os.Exit(53)
	}
	errchan := make(chan error)
	idm := IDMProtocolStack{
		idmVersion:        2,
		socket:            conn,
		ReceivedData:      make([]byte, 0),
		startTLSResponse:  make(chan asn1.Enumerated, 1),
		NextInvokeId:      1,
		PendingOperations: make(map[int]chan X500OpOutcome),
		bound:             false,
		bindOutcome:       make(chan X500AssociateOutcome),
		mutex:             sync.Mutex{},
		resultSigning:     ProtectionRequest_None,
		errorSigning:      ProtectionRequest_None,
		signingKey:        nil,
		signingCert:       nil,
		errorChannel:      errchan,
		StartTLSPolicy:    StartTLSNever,
	}
	go func() {
		e := <-errchan
		fmt.Printf("Error: %v\n", e)
		os.Exit(40)
	}()
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	_, err = idm.BindAnonymously(ctx)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		os.Exit(2)
	}
	dn := DistinguishedName{
		[]pkix.AttributeTypeAndValue{
			{
				Type: Id_at_countryName,
				Value: asn1.RawValue{
					Tag:        asn1.TagPrintableString,
					Class:      asn1.ClassUniversal,
					IsCompound: false,
					Bytes:      []byte("US"),
				},
			},
		},
	}
	name_bytes, err := asn1.Marshal(dn)
	if err != nil {
		os.Exit(6)
	}
	name := asn1.RawValue{FullBytes: name_bytes}
	arg_data := ListArgumentData{
		Object: asn1.RawValue{
			Tag:        0,
			Class:      asn1.ClassContextSpecific,
			IsCompound: true,
			Bytes:      name.FullBytes,
		},
		SecurityParameters: SecurityParameters{
			// No signing so we get searchInfo instead of uncorrelatedSearchInfo
			Target:          ProtectionRequest_None,
			ErrorProtection: ErrorProtectionRequest_None,
		},
	}
	ctx, cancel = context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	_, res, err := idm.List(ctx, arg_data)
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(9)
		return
	}
	for _, sub := range res.Subordinates {
		fmt.Printf("%v\n", sub.Rdn)
	}
}

func TestBindTimeout(t *testing.T) {
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		os.Exit(53)
	}
	errchan := make(chan error)
	idm := IDMProtocolStack{
		idmVersion:        2,
		socket:            conn,
		ReceivedData:      make([]byte, 0),
		startTLSResponse:  make(chan asn1.Enumerated, 1),
		NextInvokeId:      1,
		PendingOperations: make(map[int]chan X500OpOutcome),
		bound:             false,
		bindOutcome:       make(chan X500AssociateOutcome),
		mutex:             sync.Mutex{},
		resultSigning:     ProtectionRequest_None,
		errorSigning:      ProtectionRequest_None,
		signingKey:        nil,
		signingCert:       nil,
		errorChannel:      errchan,
		StartTLSPolicy:    StartTLSNever,
	}
	go func() {
		e := <-errchan
		fmt.Printf("Error: %v\n", e)
		os.Exit(40)
	}()
	impossibleTimeout := time.Duration(1) * time.Microsecond
	ctx, cancel := context.WithTimeout(context.Background(), impossibleTimeout)
	defer cancel()
	_, err = idm.BindAnonymously(ctx)
	if err == nil {
		t.Fail()
	}
}

func TestRequestTimeout(t *testing.T) {
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		os.Exit(53)
	}
	errchan := make(chan error)
	idm := IDMProtocolStack{
		socket:            conn,
		ReceivedData:      make([]byte, 0),
		NextInvokeId:      1,
		startTLSResponse:  make(chan asn1.Enumerated, 1),
		PendingOperations: make(map[int]chan X500OpOutcome),
		bound:             false,
		bindOutcome:       make(chan X500AssociateOutcome),
		mutex:             sync.Mutex{},
		resultSigning:     ProtectionRequest_None,
		errorSigning:      ProtectionRequest_None,
		signingKey:        nil,
		signingCert:       nil,
		errorChannel:      errchan,
		StartTLSPolicy:    StartTLSNever,
	}
	go func() {
		e := <-errchan
		fmt.Printf("Error: %v\n", e)
		os.Exit(40)
	}()
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	_, err = idm.BindAnonymously(ctx)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		os.Exit(2)
	}
	dn := DistinguishedName{
		[]pkix.AttributeTypeAndValue{
			{
				Type: Id_at_countryName,
				Value: asn1.RawValue{
					Tag:        asn1.TagPrintableString,
					Class:      asn1.ClassUniversal,
					IsCompound: false,
					Bytes:      []byte("US"),
				},
			},
		},
	}
	name_bytes, err := asn1.Marshal(dn)
	if err != nil {
		os.Exit(6)
	}
	name := asn1.RawValue{FullBytes: name_bytes}
	arg_data := ReadArgumentData{
		Object: asn1.RawValue{
			Tag:        0,
			Class:      asn1.ClassContextSpecific,
			IsCompound: true,
			Bytes:      name.FullBytes,
		},
		SecurityParameters: SecurityParameters{
			Target:          idm.resultSigning,
			ErrorProtection: idm.errorSigning,
		},
	}
	impossibleTimeout := time.Duration(1) * time.Millisecond
	ctx, cancel = context.WithTimeout(context.Background(), impossibleTimeout)
	defer cancel()
	_, _, err = idm.Read(ctx, arg_data)
	if err == nil {
		t.Fail()
	}
}

func TestUnbind(t *testing.T) {
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		os.Exit(53)
	}
	errchan := make(chan error)
	idm := IDMProtocolStack{
		socket:            conn,
		ReceivedData:      make([]byte, 0),
		NextInvokeId:      1,
		startTLSResponse:  make(chan asn1.Enumerated, 1),
		PendingOperations: make(map[int]chan X500OpOutcome),
		bound:             false,
		bindOutcome:       make(chan X500AssociateOutcome),
		mutex:             sync.Mutex{},
		resultSigning:     ProtectionRequest_None,
		errorSigning:      ProtectionRequest_None,
		signingKey:        nil,
		signingCert:       nil,
		errorChannel:      errchan,
		StartTLSPolicy:    StartTLSNever,
	}
	go func() {
		e := <-errchan
		fmt.Printf("Error: %v\n", e)
		os.Exit(40)
	}()
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	_, err = idm.BindAnonymously(ctx)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		os.Exit(2)
	}
	ctx, cancel = context.WithTimeout(context.Background(), sensibleTimeout)
	req := X500UnbindRequest{}
	defer cancel()
	_, err = idm.Unbind(ctx, req)
	if err != nil {
		t.Fail()
	}
}
