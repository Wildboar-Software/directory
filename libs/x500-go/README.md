# X.500 Directory Access Protocol Client in Go


## TODO

- [ ] Documentation
- [ ] Implement `String()` for `DistinguishedName` et al?
- [x] Check that channels cannot get stuck
- [x] Replace `os.Exit()` and printing in tests
- [x] Race condition checks
- [x] Test Bind Errors
- [ ] Test socket closures
- [ ] List and Search Result Iterator
- [ ] Break this library up into `x500` and `x500-client`
- [ ] Any time an `asn1.RawValue` is taken from a user as a parameter, it needs
      to be marshalled so that `FullBytes` is populated.
- [ ] `.BindSimply()`
- [ ] `.BindStrongly()`
- [ ] `.BindPlainly()`
- [ ] `.CloseTransport()`
- [ ] Test signing
- [ ] Implementation data
- [ ] Request attribute certificate
- [ ] Use `asn1.RawContent`
- [ ] Failed logins just hang
