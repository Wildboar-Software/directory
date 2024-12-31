# X.500 Directory Access Protocol Client in Go


## TODO

- [x] Fix operations other than `read`
- [ ] IDMv2
- [x] TLS
- [ ] StartTLS
- [ ] Configurable Timeouts?
- [ ] Context object?
- [ ] Documentation
- [ ] Test operation abandonment
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
- [ ] Implement `String()` for `DistinguishedName`?
