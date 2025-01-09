package x500_go

import (
	"context"
	"crypto"
	"crypto/tls"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/asn1"
	"encoding/pem"
	"errors"
	"net"
	"os"
	"sync"
	"testing"
	"time"
)

var sensibleTimeout = time.Duration(5) * time.Second

func getDN() DistinguishedName {
	return DistinguishedName{
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
}

func getDNWithManySubs() DistinguishedName {
	return DistinguishedName{
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
}

func getMeerkatDN() DistinguishedName {
	return DistinguishedName{
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
					Bytes:      []byte("Tampa"),
				},
			},
		},
		[]pkix.AttributeTypeAndValue{
			{
				Type: Id_at_organizationName,
				Value: asn1.RawValue{
					Tag:        asn1.TagPrintableString,
					Class:      asn1.ClassUniversal,
					IsCompound: false,
					Bytes:      []byte("Wildboar"),
				},
			},
		},
		[]pkix.AttributeTypeAndValue{
			{
				Type: Id_at_commonName,
				Value: asn1.RawValue{
					Tag:        asn1.TagPrintableString,
					Class:      asn1.ClassUniversal,
					IsCompound: false,
					Bytes:      []byte("meerkat"),
				},
			},
		},
	}
}

func TestReadAnEntry(t *testing.T) {
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		t.Error(err.Error())
		return
	}
	errchan := make(chan error)
	idm := IDMClient(conn, &IDMClientConfig{
		StartTLSPolicy: StartTLSNever,
		Errchan:        errchan,
	})
	go func() {
		e := <-errchan
		t.Error(e)
	}()
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	_, err = idm.BindAnonymously(ctx)
	if err != nil {
		t.Error(err.Error())
		return
	}
	invokeId := idm.GetNextInvokeId()
	dn := getDN()
	name_bytes, err := asn1.Marshal(dn)
	if err != nil {
		t.Error(err.Error())
		return
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
		t.Error(err.Error())
		return
	}
	iidBytes, err := asn1.Marshal(invokeId)
	if err != nil {
		t.Error(err.Error())
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
		t.Error(err.Error())
		return
	}
	result := ReadResultData{}
	rest, err := asn1.UnmarshalWithParams(outcome.Parameter.FullBytes, &result, "set")
	if err != nil {
		t.Error(err.Error())
		return
	}
	if len(rest) > 0 {
		t.Error(err.Error())
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
			t.Logf("Attribute Type: %s\n", oid.String())
		} else if info.Tag == asn1.TagSequence { // Attribute
			attr := Attribute{}
			rest, err := asn1.Unmarshal(info.FullBytes, &attr)
			if err != nil {
				continue
			}
			if len(rest) > 0 {
				continue
			}
			t.Logf("Attribute Type: %s\n", attr.Type.String())
			for _, value := range attr.Values {
				str, err := ASN1RawValueToStr(value)
				if err != nil {
					t.Log(err.Error())
					continue
				}
				if len(str) == 0 {
					t.Log("  <empty>")
				} else {
					t.Logf("  %s\n", str)
				}
			}
			for _, vwc := range attr.ValuesWithContext {
				str, err := ASN1RawValueToStr(vwc.Value)
				if err != nil {
					t.Log(err.Error())
					continue
				}
				t.Logf("  %s (Has Contexts)\n", str)
			}
		} else { // Something else
			continue
		}
	}
}

func TestReadAnEntry2(t *testing.T) {
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		t.Error(err.Error())
		return
	}
	errchan := make(chan error)
	idm := IDMClient(conn, &IDMClientConfig{
		StartTLSPolicy: StartTLSNever,
		Errchan:        errchan,
	})
	go func() {
		e := <-errchan
		t.Error(e)
	}()
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	_, err = idm.BindAnonymously(ctx)
	if err != nil {
		t.Error(err.Error())
		return
	}
	dn := getDN()
	name_bytes, err := asn1.Marshal(dn)
	if err != nil {
		t.Error(err.Error())
		return
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
			Target:          idm.ResultsSigning,
			ErrorProtection: idm.ErrorSigning,
		},
	}
	ctx, cancel = context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	_, res, err := idm.Read(ctx, arg_data)
	if err != nil {
		t.Error(err.Error())
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
			t.Logf("Attribute Type: %s\n", oid.String())
		} else if info.Tag == asn1.TagSequence { // Attribute
			attr := Attribute{}
			rest, err := asn1.Unmarshal(info.FullBytes, &attr)
			if err != nil {
				continue
			}
			if len(rest) > 0 {
				continue
			}
			t.Logf("Attribute Type: %s\n", attr.Type.String())
			for _, value := range attr.Values {
				str, err := ASN1RawValueToStr(value)
				if err != nil {
					t.Log(err.Error())
					continue
				}
				if len(str) == 0 {
					t.Log("  <empty>")
				} else {
					t.Logf("  %s\n", str)
				}
			}
			for _, vwc := range attr.ValuesWithContext {
				str, err := ASN1RawValueToStr(vwc.Value)
				if err != nil {
					t.Log(err.Error())
					continue
				}
				t.Logf("  %s (Has Contexts)\n", str)
			}
		} else { // Something else
			continue
		}
	}
}

func TestManySimultaneousReads(t *testing.T) {
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		t.Error(err.Error())
		return
	}
	errchan := make(chan error)
	idm := IDMClient(conn, &IDMClientConfig{
		StartTLSPolicy: StartTLSNever,
		Errchan:        errchan,
	})
	go func() {
		e := <-errchan
		t.Error(e)
	}()
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	_, err = idm.BindAnonymously(ctx)
	if err != nil {
		t.Error(err.Error())
		return
	}
	dn := getDN()
	name_bytes, err := asn1.Marshal(dn)
	if err != nil {
		t.Error(err.Error())
		return
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
			Target:          idm.ResultsSigning,
			ErrorProtection: idm.ErrorSigning,
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
				t.Error(err.Error())
				return
			}
			if outcome.OutcomeType != OP_OUTCOME_RESULT {
				t.Error(errors.New("non-result-received"))
			}
		}()
	}
	wg.Wait()
}

func TestListAnEntry(t *testing.T) {
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		t.Error(err.Error())
		return
	}
	errchan := make(chan error)
	idm := IDMClient(conn, &IDMClientConfig{
		StartTLSPolicy: StartTLSNever,
		Errchan:        errchan,
	})
	go func() {
		e := <-errchan
		t.Error(e)
	}()
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	_, err = idm.BindAnonymously(ctx)
	if err != nil {
		t.Error(err.Error())
		return
	}
	dn := getDN()
	name_bytes, err := asn1.Marshal(dn)
	if err != nil {
		t.Error(err.Error())
		return
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
		t.Error(err.Error())
		return
	}
	for _, sub := range res.Subordinates {
		t.Logf("%v\n", sub.Rdn)
	}
}

func TestTLS(t *testing.T) {
	errchan := make(chan error)
	stop := make(chan int)
	t.Cleanup(func() {
		stop <- 1
	})
	go func() {
		// We need to clean up because it will still receive the abandoned operation.
		select {
		case e := <-errchan:
			t.Error(e)
		case <-stop:
			return
		}
	}()
	conn, err := tls.Dial("tcp", "localhost:44632", &tls.Config{
		InsecureSkipVerify: true,
	})
	if err != nil {
		t.Error(err.Error())
		return
	}
	idm := IDMClient(conn, &IDMClientConfig{
		StartTLSPolicy: StartTLSNever,
		Errchan:        errchan,
	})
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	_, err = idm.BindAnonymously(ctx)
	if err != nil {
		t.Error(err.Error())
		return
	}
	dn := getDN()
	name_bytes, err := asn1.Marshal(dn)
	if err != nil {
		t.Error(err.Error())
		return
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
		t.Error(err.Error())
		return
	}
	for _, sub := range res.Subordinates {
		t.Logf("%v\n", sub.Rdn)
	}
}

func TestAbandon(t *testing.T) {
	errchan := make(chan error)
	stop := make(chan int)
	t.Cleanup(func() {
		stop <- 1
	})
	go func() {
		// We need to clean up because it will still receive the abandoned operation.
		select {
		case e := <-errchan:
			t.Error(e)
		case <-stop:
			return
		}
	}()
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		t.Error(err.Error())
		return
	}
	idm := IDMClient(conn, &IDMClientConfig{
		StartTLSPolicy: StartTLSNever,
		Errchan:        errchan,
	})
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	_, err = idm.BindAnonymously(ctx)
	if err != nil {
		t.Error(err.Error())
		return
	}
	dn := getDNWithManySubs()
	name_bytes, err := asn1.Marshal(dn)
	if err != nil {
		t.Error(err.Error())
		return
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
			t.Error(err.Error())
			return
		}
		if outcome.OutcomeType != OP_OUTCOME_ERROR {
			t.Errorf("Did not receive error. Outcome type=%d", outcome.OutcomeType)
			return
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
		if outcome.OutcomeType != OP_OUTCOME_RESULT {
			t.Errorf("Did not receive abort result. Outcome type=%d", outcome.OutcomeType)
		}
		wg.Done()
	}()
	wg.Wait()
}

func TestStartTLS(t *testing.T) {
	errchan := make(chan error)
	stop := make(chan int)
	t.Cleanup(func() {
		stop <- 1
	})
	go func() {
		// We need to clean up because it will still receive the abandoned operation.
		select {
		case e := <-errchan:
			t.Error(e)
		case <-stop:
			return
		}
	}()
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		t.Error(err.Error())
		return
	}
	idm := IDMClient(conn, &IDMClientConfig{
		StartTLSPolicy: StartTLSDemand,
		TlsConfig: &tls.Config{
			InsecureSkipVerify: true,
		},
		Errchan: errchan,
	})
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	_, err = idm.BindAnonymously(ctx)
	if err != nil {
		t.Error(err.Error())
		return
	}
	dn := getDN()
	name_bytes, err := asn1.Marshal(dn)
	if err != nil {
		t.Error(err.Error())
		return
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
		t.Error(err.Error())
		return
	}
	for _, sub := range res.Subordinates {
		t.Logf("%v\n", sub.Rdn)
	}
}

func TestIDMv1(t *testing.T) {
	errchan := make(chan error)
	stop := make(chan int)
	t.Cleanup(func() {
		stop <- 1
	})
	go func() {
		// We need to clean up because it will still receive the abandoned operation.
		select {
		case e := <-errchan:
			t.Error(e)
		case <-stop:
			return
		}
	}()
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		t.Error(err.Error())
		return
	}
	idm := IDMClient(conn, &IDMClientConfig{
		StartTLSPolicy: StartTLSNever,
		Errchan:        errchan,
		UseIDMv1:       true,
	})
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	_, err = idm.BindAnonymously(ctx)
	if err != nil {
		t.Error(err.Error())
		return
	}
	dn := getDN()
	name_bytes, err := asn1.Marshal(dn)
	if err != nil {
		t.Error(err.Error())
		return
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
		t.Error(err.Error())
		return
	}
	for _, sub := range res.Subordinates {
		t.Logf("%v\n", sub.Rdn)
	}
}

func TestBindTimeout(t *testing.T) {
	errchan := make(chan error)
	stop := make(chan int)
	t.Cleanup(func() {
		stop <- 1
	})
	go func() {
		// We need to clean up because it will still receive the abandoned operation.
		select {
		case e := <-errchan:
			t.Error(e)
		case <-stop:
			return
		}
	}()
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		t.Error(err.Error())
		return
	}
	idm := IDMClient(conn, &IDMClientConfig{
		StartTLSPolicy: StartTLSNever,
		Errchan:        errchan,
	})
	impossibleTimeout := time.Duration(1) * time.Microsecond
	ctx, cancel := context.WithTimeout(context.Background(), impossibleTimeout)
	defer cancel()
	_, err = idm.BindAnonymously(ctx)
	if err == nil {
		t.FailNow()
	}
}

func TestRequestTimeout(t *testing.T) {
	errchan := make(chan error)
	stop := make(chan int)
	t.Cleanup(func() {
		stop <- 1
	})
	go func() {
		// We need to clean up because it will still receive the abandoned operation.
		select {
		case e := <-errchan:
			t.Error(e)
		case <-stop:
			return
		}
	}()
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		t.Error(err.Error())
		return
	}
	idm := IDMClient(conn, &IDMClientConfig{
		StartTLSPolicy: StartTLSNever,
		Errchan:        errchan,
	})
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	_, err = idm.BindAnonymously(ctx)
	if err != nil {
		t.Error(err.Error())
		return
	}
	dn := getDN()
	name_bytes, err := asn1.Marshal(dn)
	if err != nil {
		t.Error(err.Error())
		return
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
			Target:          idm.ResultsSigning,
			ErrorProtection: idm.ErrorSigning,
		},
	}
	impossibleTimeout := time.Duration(1) * time.Millisecond
	ctx, cancel = context.WithTimeout(context.Background(), impossibleTimeout)
	defer cancel()
	_, _, err = idm.Read(ctx, arg_data)
	if err == nil {
		t.FailNow()
	}
}

func TestUnbind(t *testing.T) {
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		t.Error(err.Error())
		return
	}
	errchan := make(chan error)
	idm := IDMClient(conn, &IDMClientConfig{
		StartTLSPolicy: StartTLSNever,
		Errchan:        errchan,
	})
	stop := make(chan int)
	t.Cleanup(func() {
		stop <- 1
	})
	go func() {
		select {
		case e := <-errchan:
			t.Error(e)
		case <-stop:
			return
		}
	}()
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	_, err = idm.BindAnonymously(ctx)
	if err != nil {
		t.Error(err.Error())
		return
	}
	ctx, cancel = context.WithTimeout(context.Background(), sensibleTimeout)
	req := X500UnbindRequest{}
	defer cancel()
	_, err = idm.Unbind(ctx, req)
	if err != nil {
		t.FailNow()
	}
}

func TestBindError(t *testing.T) {
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		t.Error(err.Error())
		return
	}
	idm := IDMClient(conn, &IDMClientConfig{
		StartTLSPolicy: StartTLSNever,
	})
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()

	dn := getDN()

	simpleCreds := SimpleCredentials{
		Name: dn,
		Password: asn1.RawValue{
			Class:      asn1.ClassContextSpecific,
			Tag:        2,
			IsCompound: true,
			Bytes:      []byte{4, 1, 'a'},
		},
	}

	credsEncoded, err := asn1.Marshal(simpleCreds)
	if err != nil {
		t.Error(err)
		return
	}

	arg := X500AssociateArgument{
		V1: true,
		V2: true,
		Credentials: &asn1.RawValue{
			Class:      asn1.ClassContextSpecific,
			Tag:        0,
			IsCompound: true,
			Bytes:      credsEncoded,
		},
	}

	response, err := idm.Bind(ctx, arg)
	if err != nil {
		t.Error(err.Error())
		return
	}
	if response.OutcomeType != OP_OUTCOME_ERROR {
		t.Logf("Outcome type: %v\n", response.OutcomeType)
		t.FailNow()
	}
}

// TODO: Also test closing after sending the request
func TestSocketClosure1(t *testing.T) {
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		t.Error(err.Error())
		return
	}
	errchan := make(chan error)
	idm := IDMClient(conn, &IDMClientConfig{
		StartTLSPolicy: StartTLSNever,
		Errchan:        errchan,
	})
	go func() {
		e := <-errchan
		t.Error(e)
	}()
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	response, err := idm.BindAnonymously(ctx)
	if err != nil {
		t.Error(err.Error())
		return
	}
	if response.OutcomeType != OP_OUTCOME_RESULT {
		t.Logf("Outcome type: %v\n", response.OutcomeType)
		t.FailNow()
	}
	dn := getDN()
	name_bytes, err := asn1.Marshal(dn)
	if err != nil {
		t.Error(err.Error())
		return
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
			Target:          idm.ResultsSigning,
			ErrorProtection: idm.ErrorSigning,
		},
	}
	ctx, cancel = context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	idm.socket.Close()
	_, _, err = idm.Read(ctx, arg_data)
	if err == nil {
		t.FailNow()
	}
}

// This test differs from the above by closing the socket shortly after sending
// the request.
func TestSocketClosure2(t *testing.T) {
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		t.Error(err.Error())
		return
	}
	errchan := make(chan error)
	idm := IDMClient(conn, &IDMClientConfig{
		StartTLSPolicy: StartTLSNever,
		Errchan:        errchan,
	})
	go func() {
		e := <-errchan
		t.Error(e)
	}()
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	response, err := idm.BindAnonymously(ctx)
	if err != nil {
		t.Error(err.Error())
		return
	}
	if response.OutcomeType != OP_OUTCOME_RESULT {
		t.Logf("Outcome type: %v\n", response.OutcomeType)
		t.FailNow()
	}
	dn := getDN()
	name_bytes, err := asn1.Marshal(dn)
	if err != nil {
		t.Error(err.Error())
		return
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
			Target:          idm.ResultsSigning,
			ErrorProtection: idm.ErrorSigning,
		},
	}
	ctx, cancel = context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	go func() {
		<-time.After(time.Duration(5) * time.Millisecond)
		idm.socket.Close()
	}()
	outcome, _, err := idm.Read(ctx, arg_data)
	if err == nil {
		t.FailNow()
	}
	// We don't want the request to timeout. We want it to abort immediately
	// if the socket closes. So a timeout should be considered a failure.
	// Since a timeout is carried by the context object, we just check if the
	// error is the same as that of the
	if err == ctx.Err() {
		t.Error("Failed due to timeout, but should have failed due to socket closure")
		return
	}
	if outcome.OutcomeType != OP_OUTCOME_FAILURE {
		t.Errorf("Outcome type should have been failure, but it was %d", outcome.OutcomeType)
		return
	}
	if !errors.Is(err, net.ErrClosed) {
		t.FailNow()
	}
}

func TestSocketClosure3(t *testing.T) {
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		t.Error(err.Error())
		return
	}
	errchan := make(chan error)
	idm := IDMClient(conn, &IDMClientConfig{
		StartTLSPolicy: StartTLSNever,
		Errchan:        errchan,
	})
	go func() {
		e := <-errchan
		t.Error(e)
	}()
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	idm.socket.Close()
	_, err = idm.BindAnonymously(ctx)
	if err == nil {
		t.Error("bind should have failed, since the socket was closed")
		return
	}
	if !errors.Is(err, net.ErrClosed) {
		t.Errorf("bind should have failed due to socket being closed, but instead got %v", err)
		return
	}
}

func TestSocketClosure4(t *testing.T) {
	t.SkipNow() // This test is so flaky and the timing is hard to get right, but it works.
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		t.Error(err.Error())
		return
	}
	errchan := make(chan error)
	idm := IDMClient(conn, &IDMClientConfig{
		StartTLSPolicy: StartTLSNever,
		Errchan:        errchan,
	})
	// go func() {
	// 	e := <-errchan
	// 	t.Error(e)
	// }()
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	go func() {
		<-time.After(time.Duration(1) * time.Second)
		idm.socket.Close()
	}()
	outcome, err := idm.BindAnonymously(ctx)
	if err == nil {
		t.FailNow()
	}
	// We don't want the request to timeout. We want it to abort immediately
	// if the socket closes. So a timeout should be considered a failure.
	// Since a timeout is carried by the context object, we just check if the
	// error is the same as that of the
	if err == ctx.Err() {
		t.Error("Failed due to timeout, but should have failed due to socket closure")
		return
	}
	if outcome.OutcomeType != OP_OUTCOME_FAILURE {
		t.Errorf("Outcome type should have been failure, but it was %d", outcome.OutcomeType)
		return
	}
	if !errors.Is(err, net.ErrClosed) {
		t.FailNow()
	}
}

func TestSocketClosure5(t *testing.T) {
	errchan := make(chan error)
	stop := make(chan int)
	t.Cleanup(func() {
		stop <- 1
	})
	go func() {
		// We need to clean up because it will still receive the abandoned operation.
		select {
		case e := <-errchan:
			t.Error(e)
		case <-stop:
			return
		}
	}()
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		t.Error(err.Error())
		return
	}
	idm := IDMClient(conn, &IDMClientConfig{
		StartTLSPolicy: StartTLSDemand,
		TlsConfig: &tls.Config{
			InsecureSkipVerify: true,
		},
		Errchan: errchan,
	})
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	idm.socket.Close()
	_, err = idm.BindAnonymously(ctx)
	if err == nil {
		t.FailNow()
	}
	if !errors.Is(err, net.ErrClosed) {
		t.FailNow()
	}
}

func TestSocketClosure6(t *testing.T) {
	errchan := make(chan error)
	stop := make(chan int)
	t.Cleanup(func() {
		stop <- 1
	})
	go func() {
		// We need to clean up because it will still receive the abandoned operation.
		select {
		case e := <-errchan:
			t.Error(e)
		case <-stop:
			return
		}
	}()
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		t.Error(err.Error())
		return
	}
	idm := IDMClient(conn, &IDMClientConfig{
		StartTLSPolicy: StartTLSDemand,
		TlsConfig: &tls.Config{
			InsecureSkipVerify: true,
		},
		Errchan: errchan,
	})
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	go func() {
		// Give it just enough time for the request to be sent.
		<-time.After(time.Duration(1) * time.Millisecond)
		idm.socket.Close()
	}()
	_, err = idm.BindAnonymously(ctx)
	if err == nil {
		t.FailNow()
	}
	if !errors.Is(err, net.ErrClosed) {
		t.FailNow()
	}
}

// If the library user makes a mistake in tagging an asn1.RawValue-typed field,
// does this library automatically correct that mistake correctly?
// Search for "This is the mistake" to find the mistake.
func TestTagCorrection(t *testing.T) {
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		t.Error(err.Error())
		return
	}
	errchan := make(chan error)
	idm := IDMClient(conn, &IDMClientConfig{
		StartTLSPolicy: StartTLSNever,
		Errchan:        errchan,
	})
	go func() {
		e := <-errchan
		t.Error(e)
	}()
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	_, err = idm.BindAnonymously(ctx)
	if err != nil {
		t.Error(err.Error())
		return
	}
	dn := getDN()
	name_bytes, err := asn1.Marshal(dn)
	if err != nil {
		t.Error(err.Error())
		return
	}
	name := asn1.RawValue{FullBytes: name_bytes}
	arg_data := ReadArgumentData{
		Object: name, // This is the mistake.
		SecurityParameters: SecurityParameters{
			Target:          idm.ResultsSigning,
			ErrorProtection: idm.ErrorSigning,
		},
	}
	ctx, cancel = context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	outcome, _, err := idm.Read(ctx, arg_data)
	if err != nil {
		t.Error(err.Error())
		return
	}
	if outcome.OutcomeType != OP_OUTCOME_RESULT {
		t.Error("Non-result received")
		t.FailNow()
	}
}

func TestReadSimple(t *testing.T) {
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		t.Error(err.Error())
		return
	}
	errchan := make(chan error)
	idm := IDMClient(conn, &IDMClientConfig{
		StartTLSPolicy: StartTLSNever,
		Errchan:        errchan,
	})
	go func() {
		e := <-errchan
		t.Error(e)
	}()
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	_, err = idm.BindAnonymously(ctx)
	if err != nil {
		t.Error(err.Error())
		return
	}
	dn := getDN()

	attrs := make([]asn1.ObjectIdentifier, 1)
	attrs[0] = Id_at_countryName

	ctx, cancel = context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	_, res, err := idm.ReadSimple(ctx, dn, attrs)
	if err != nil {
		t.Error(err.Error())
		return
	}
	for _, info := range res.Entry.Information {
		if info.Tag == asn1.TagSequence { // Attribute
			attr := Attribute{}
			rest, err := asn1.Unmarshal(info.FullBytes, &attr)
			if err != nil {
				continue
			}
			if len(rest) > 0 {
				continue
			}
			if !attr.Type.Equal(Id_at_countryName) {
				t.FailNow()
			}
			t.Logf("Attribute Type: %s\n", attr.Type.String())
			for _, value := range attr.Values {
				str, err := ASN1RawValueToStr(value)
				if err != nil {
					t.Log(err.Error())
					continue
				}
				if len(str) == 0 {
					t.Log("  <empty>")
				} else {
					t.Logf("  %s\n", str)
				}
			}
			for _, vwc := range attr.ValuesWithContext {
				str, err := ASN1RawValueToStr(vwc.Value)
				if err != nil {
					t.Log(err.Error())
					continue
				}
				t.Logf("  %s (Has Contexts)\n", str)
			}
		} else { // Something else
			t.FailNow()
		}
	}
}

func TestListSimple(t *testing.T) {
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		t.Error(err.Error())
		return
	}
	errchan := make(chan error)
	idm := IDMClient(conn, &IDMClientConfig{
		StartTLSPolicy: StartTLSNever,
		Errchan:        errchan,
	})
	go func() {
		e := <-errchan
		t.Error(e)
	}()
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	_, err = idm.BindAnonymously(ctx)
	if err != nil {
		t.Error(err.Error())
		return
	}
	dn := getDN()
	ctx, cancel = context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	outcome, _, err := idm.ListByDN(ctx, dn, 0)
	if err != nil {
		t.Error(err.Error())
		return
	}
	if outcome.OutcomeType != OP_OUTCOME_RESULT {
		t.FailNow()
	}
}

func TestAddEntrySimple(t *testing.T) {
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		t.Error(err.Error())
		return
	}
	errchan := make(chan error)
	idm := IDMClient(conn, &IDMClientConfig{
		StartTLSPolicy: StartTLSNever,
		Errchan:        errchan,
	})
	go func() {
		e := <-errchan
		t.Error(e)
	}()
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	_, err = idm.BindAnonymously(ctx)
	if err != nil {
		t.Error(err.Error())
		return
	}
	dn := getDNWithManySubs()
	rdn := []pkix.AttributeTypeAndValue{
		{
			Type: Id_at_commonName,
			Value: asn1.RawValue{
				Class:      asn1.ClassUniversal,
				Tag:        asn1.TagPrintableString,
				IsCompound: false,
				Bytes:      []byte("sillybilly"),
			},
		},
	}
	dn = append(dn, rdn)
	ctx, cancel = context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()

	attrs := make([]Attribute, 0)
	objectClassAttr := Attribute{
		Type: Id_at_objectClass,
		Values: []asn1.RawValue{
			{
				Class:      asn1.ClassUniversal,
				Tag:        asn1.TagOID,
				IsCompound: false,
				Bytes:      []byte{0x55, 6, 6}, // (id-oc-person / 2.5.6.6)
			},
		},
	}
	commonNameAttr := Attribute{
		Type: Id_at_commonName,
		Values: []asn1.RawValue{
			{
				Class:      asn1.ClassUniversal,
				Tag:        asn1.TagPrintableString,
				IsCompound: false,
				Bytes:      []byte("sillybilly"),
			},
		},
	}
	surnameAttr := Attribute{
		Type: Id_at_surname,
		Values: []asn1.RawValue{
			{
				Class:      asn1.ClassUniversal,
				Tag:        asn1.TagPrintableString,
				IsCompound: false,
				Bytes:      []byte("billy"),
			},
		},
	}
	attrs = append(attrs, objectClassAttr)
	attrs = append(attrs, commonNameAttr)
	attrs = append(attrs, surnameAttr)

	outcome, _, err := idm.AddEntrySimple(ctx, dn, attrs)
	if err != nil {
		t.Error(err.Error())
		return
	}
	// We probably don't have permission to do this. I just want to make
	// sure the request is well-formed.
	if outcome.OutcomeType == OP_OUTCOME_ABORT || outcome.OutcomeType == OP_OUTCOME_FAILURE || outcome.OutcomeType == OP_OUTCOME_REJECT {
		t.FailNow()
	}
}

// This test will delete the entry created from the prior test, if it succeeded.
func TestRemoveEntrySimple(t *testing.T) {
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		t.Error(err.Error())
		return
	}
	errchan := make(chan error)
	idm := IDMClient(conn, &IDMClientConfig{
		StartTLSPolicy: StartTLSNever,
		Errchan:        errchan,
	})
	go func() {
		e := <-errchan
		t.Error(e)
	}()
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	_, err = idm.BindAnonymously(ctx)
	if err != nil {
		t.Error(err.Error())
		return
	}
	dn := getDNWithManySubs()
	rdn := []pkix.AttributeTypeAndValue{
		{
			Type: Id_at_commonName,
			Value: asn1.RawValue{
				Class:      asn1.ClassUniversal,
				Tag:        asn1.TagPrintableString,
				IsCompound: false,
				Bytes:      []byte("sillybilly"),
			},
		},
	}
	dn = append(dn, rdn)
	ctx, cancel = context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	outcome, _, err := idm.RemoveEntryByDN(ctx, dn)
	if err != nil {
		t.Error(err.Error())
		return
	}
	// We probably don't have permission to do this. I just want to make
	// sure the request is well-formed.
	if outcome.OutcomeType == OP_OUTCOME_ABORT || outcome.OutcomeType == OP_OUTCOME_FAILURE || outcome.OutcomeType == OP_OUTCOME_REJECT {
		t.FailNow()
	}
}

func TestChangePasswordSimple(t *testing.T) {
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		t.Error(err.Error())
		return
	}
	errchan := make(chan error)
	idm := IDMClient(conn, &IDMClientConfig{
		StartTLSPolicy: StartTLSNever,
		Errchan:        errchan,
	})
	go func() {
		e := <-errchan
		t.Error(e)
	}()
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	_, err = idm.BindAnonymously(ctx)
	if err != nil {
		t.Error(err.Error())
		return
	}
	dn := getDN()
	ctx, cancel = context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	outcome, _, err := idm.ChangePasswordSimple(ctx, dn, "asdf", "zxcv")
	if err != nil {
		t.Error(err.Error())
		return
	}
	// We probably don't have permission to do this. I just want to make
	// sure the request is well-formed.
	if outcome.OutcomeType == OP_OUTCOME_ABORT || outcome.OutcomeType == OP_OUTCOME_FAILURE || outcome.OutcomeType == OP_OUTCOME_REJECT {
		t.FailNow()
	}
}

func TestAdministerPasswordSimple(t *testing.T) {
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		t.Error(err.Error())
		return
	}
	errchan := make(chan error)
	idm := IDMClient(conn, &IDMClientConfig{
		StartTLSPolicy: StartTLSNever,
		Errchan:        errchan,
	})
	go func() {
		e := <-errchan
		t.Error(e)
	}()
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	_, err = idm.BindAnonymously(ctx)
	if err != nil {
		t.Error(err.Error())
		return
	}
	dn := getDN()
	ctx, cancel = context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()
	outcome, _, err := idm.AdministerPasswordSimple(ctx, dn, "qwer")
	if err != nil {
		t.Error(err.Error())
		return
	}
	// We probably don't have permission to do this. I just want to make
	// sure the request is well-formed.
	if outcome.OutcomeType == OP_OUTCOME_ABORT || outcome.OutcomeType == OP_OUTCOME_FAILURE || outcome.OutcomeType == OP_OUTCOME_REJECT {
		t.FailNow()
	}
}

func TestStrongAuth(t *testing.T) {
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		t.Error(err.Error())
		return
	}
	errchan := make(chan error)

	go func() {
		e := <-errchan
		t.Error(e)
	}()
	ctx, cancel := context.WithTimeout(context.Background(), sensibleTimeout)
	defer cancel()

	// Open the PEM-encoded certificate file
	certFile, err := os.ReadFile("../../data/keypair/cert.pem")
	if err != nil {
		t.Errorf("Error reading certificate file: %v\n", err)
		return
	}

	// Decode the PEM block
	block, _ := pem.Decode(certFile)
	if block == nil || block.Type != "CERTIFICATE" {
		t.Error("Failed to decode PEM block containing the certificate")
		return
	}

	// Parse the certificate
	cert, err := x509.ParseCertificate(block.Bytes)
	if err != nil {
		t.Errorf("Error parsing certificate: %v\n", err)
		return
	}

	// Open the PEM-encoded certificate file
	keyFile, err := os.ReadFile("../../data/keypair/key.pem")
	if err != nil {
		t.Errorf("Error reading certificate file: %v\n", err)
		return
	}

	// Decode the PEM block
	keyBlock, _ := pem.Decode(keyFile)
	if keyBlock == nil || keyBlock.Type != "PRIVATE KEY" {
		t.Error("Failed to decode PEM block containing the private key")
		return
	}

	// Parse the certificate
	privKey, err := x509.ParsePKCS8PrivateKey(keyBlock.Bytes)
	if err != nil {
		t.Errorf("Error parsing certificate: %v\n", err)
		return
	}

	signer, is_signer := privKey.(crypto.Signer)
	if !is_signer {
		t.Errorf("not an signing key")
		return
	}

	idm := IDMClient(conn, &IDMClientConfig{
		StartTLSPolicy: StartTLSNever,
		Errchan:        errchan,
		SigningCert: &CertificationPath{
			UserCertificate:   *cert,
			TheCACertificates: make([]CertificatePair, 0),
		},
		SigningKey: &signer,
	})

	// C = US, ST = FL, L = Tampa, O = Wildboar, CN = meerkat
	dn := getMeerkatDN()
	_, err = idm.BindStrongly(ctx, dn, dn, nil)

	if err != nil {
		t.Error(err.Error())
		return
	}
}

func TestInterfaceImplementation(t *testing.T) {
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		t.Error(err.Error())
		return
	}
	errchan := make(chan error)
	var idm interface{} = IDMClient(conn, &IDMClientConfig{
		StartTLSPolicy: StartTLSNever,
		Errchan:        errchan,
	})
	_, ok1 := idm.(RemoteOperationServiceElement)
	_, ok2 := idm.(DirectoryAccessClient)
	if !ok1 {
		t.Error("IDM does not implement RemoteOperationServiceElement")
		return
	}
	if !ok2 {
		t.Error("IDM does not implement DirectoryAccessClient")
		return
	}
}
