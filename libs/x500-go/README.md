# X.500 Directory Access Protocol Client in Go


## TODO

- [x] Fix operations other than `read`
- [ ] IDMv2
- [x] TLS
- [x] StartTLS
- [ ] Configurable Timeouts?
- [ ] Context object?
- [ ] Make some functions private
- [ ] Handle bind errors correctly
- [ ] Documentation
- [ ] Simpler way to create an IDM connection (`New()` function)
- [x] Test operation abandonment
- [ ] Update `DirectoryAccessStack` interface to match implementations
- [x] Test list operation
- [x] Replace with types from `crypto/x509/pkix`
  - [x] `AlgorithmIdentifier`
  - [x] `AttributeTypeAndValue`
  - [ ] `AttributeTypeAndValueSET`
  - [x] `CertificateList`
  - [x] `Extension`
  - [x] ~~`Name`~~ (Does not support the new alternatives.)
  - [x] `RDNSequence`
  - [x] `RelativeDistinguishedNameSET`
  - [x] `RevokedCertificate`
  - [x] `TBSCertificateList`
- [ ] Implement `String()` for `DistinguishedName` et al?
