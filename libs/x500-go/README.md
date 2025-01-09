# X.500 Directory Access Protocol Client in Go

## Notes for Users

You will need to set `priority` in the service controls. Golang defaults enums
to 0, even if you use the `default:1` tag on a struct member.

The `timeLimit` field of the service controls is populated by the timeout
specified with the `Context` object. If there is no such timeout specified
either in the service controls, or in the context object, the request will not
timeout unless configured to do so at the TCP or TLS layers. The `sizeLimit` and
`attributeSizeLimit` fields get populated automatically with sensible defaults
unless you supply your own values.

This library supports requesting an attribute certificate from the DSA per the
[private extension used by Meerkat DSA](https://wildboar-software.github.io/directory/docs/attr-cert).

Known issues: https://github.com/golang/go/issues/27426
Any `SEQUENCE OF SET` type will fail to be unmarshalled.

## Developer Notes

`SET OF SEQUENCE` = Just use the `set` tag
`SEQUENCE OF SET` = Not supported by Golang. See: https://github.com/golang/go/issues/27426
`SET OF SET` = I am not sure what to do here.

## TODO

### MVP

- [ ] Teletex Handling
- [ ] `DirectoryString(s str)`
- [ ] `FromDirectoryString(ds DirectoryString)`
- [ ] Even higher-level API
- [ ] Change `int64` enums to `int`
- [ ] Define and implement interfaces
  - [ ] `CommonArguments`
  - [ ] `CommonResults`
  - [ ] `AccessPoint`
  - [ ] `AVMPcommonComponents`
  - [ ] `SchemaElement`
- [ ] Use `X500OperationError`
- [ ] List and Search Result Iterator
- [ ] Test signing
- [ ] Documentation
- [ ] Break this library up into `x500` and `x500-client`

### Future

- [ ] Add types defined in newer X.500 specifications
  - I think I will wait until the newest version is released.
- [ ] Support other SASL methods:
  - [ ] `EXTERNAL`
  - [ ] `ANONYMOUS`
  - [ ] `OTP`
- [ ] Support more `DSAInfo` attributes
