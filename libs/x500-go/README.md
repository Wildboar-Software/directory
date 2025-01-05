# X.500 Directory Access Protocol Client in Go

## Notes for Users

You will need to set `priority` in the service controls. Golang defaults enums
to 0, even if you use the `default:1` tag on a struct member.

Known issues: https://github.com/golang/go/issues/27426
Any `SEQUENCE OF SET` type will fail to be unmarshalled.

## Developer Notes

`SET OF SEQUENCE` = Just use the `set` tag
`SEQUENCE OF SET` = Not supported by Golang. See: https://github.com/golang/go/issues/27426
`SET OF SET` = I am not sure what to do here.

## TODO

- [x] Fix encoding of set members
- [x] Handle `SEQUENCE OF SET` specially
- [x] ~~Use the `utf8` tag~~
  - I think you only have to do this when using the `IMPLICIT` tag
- [ ] Test every operation, since `encoding/asn1` is trash
- [ ] Documentation
- [x] ~~Implement `String()` for `DistinguishedName` et al?~~
  - Not doing this because the extensibility means I have to also print anything
    else that could appear.
- [x] Check that channels cannot get stuck
- [x] Replace `os.Exit()` and printing in tests
- [x] Race condition checks
- [x] Test Bind Errors
- [x] Test socket closures
- [x] Fix encoding of `asn1.RawValue`-typed fields to include tag
- [ ] List and Search Result Iterator
- [ ] Break this library up into `x500` and `x500-client`
- [x] Populate `timeLimit` from the context objects
- [x] Any time an `asn1.RawValue` is taken from a user as a parameter, it needs
      to be marshalled so that `FullBytes` is populated.
- [ ] `.BindSimply()`
- [ ] `.BindStrongly()`
- [ ] `.BindPlainly()`
- [ ] `.CloseTransport()`
- [ ] `.RemoveEntryDN()`
- [ ] `.AbandonById()`
- [ ] `.ListByDN(ctx, name, limit)`
- [ ] `.AddEntrySimple(ctx, name, attrs)`
- [ ] `.Move(ctx, olddn, newdn)`
- [ ] `.ChangePasswordSimple(ctx, name, old, new)`
- [ ] `.AdministerPasswordSimple(ctx, name, new)`
- [ ] `.ReadSimple(ctx, dn, userattrs)`
- [ ] Test signing
- [ ] Implementation data
- [ ] Request attribute certificate
- [ ] Use `asn1.RawContent`
