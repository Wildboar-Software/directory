# X.500 Directory Access Protocol Client in Go


## TODO

- [x] Fix operations other than `read`
- [x] IDMv2
- [x] TLS
- [x] StartTLS
- [x] Use `asn1.Enumerated`
- [ ] Use bigint
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
- [ ] Implement `String()` for `DistinguishedName` et al?
- [ ] Error when requests are sent unbound.
