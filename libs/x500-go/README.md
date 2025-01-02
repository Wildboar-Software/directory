# X.500 Directory Access Protocol Client in Go


## TODO

- [x] Fix operations other than `read`
- [x] IDMv2
- [x] TLS
- [x] StartTLS
- [x] Use `asn1.Enumerated`
- [x] Use `big.Int`
- [x] Configurable Timeouts
- [x] Context object
- [x] Make some functions private
- [x] Handle bind errors correctly
- [ ] Documentation
- [x] Simpler way to create an IDM connection (`New()` function)
- [x] Test operation abandonment
- [x] Update `DirectoryAccessStack` interface to match implementations
- [x] Test list operation
- [x] Replace with types from `crypto/x509/pkix`
- [ ] Implement `String()` for `DistinguishedName` et al?
- [ ] Error when requests are sent unbound.
- [ ] Format generated ASN.1 comments
- [ ] Check that channels cannot get stuck
- [ ] Race condition checks
- [ ] Test Bind Errors
- [ ] Test socket closures
- [ ] List and Search Result Iterator
