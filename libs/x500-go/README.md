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
- [x] Test every operation, since `encoding/asn1` is trash
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
- [ ] Any time an `asn1.RawValue` is taken from a user as a parameter, it needs
      to be marshalled so that `FullBytes` is populated.
- [ ] Test signing
- [x] Request attribute certificate (https://wildboar-software.github.io/directory/docs/attr-cert)
- [x] Use `asn1.RawContent`
- [ ] Test to make sure `IDMClient` satisfies `DirectoryAccessClient`
- [ ] I think you can make the `Time` fields `time.Time`
- [ ] Add extensions to `Name`
- [ ] Add types defined in newer ASN.1 specifications
- [ ] Even higher-level `AddEntry` API
  <!-- x500 dap add subentry <object>               Add a subentry
  x500 dap add country <object> <countryName>  Add a country
  x500 dap add locality <object>               Add a locality
  x500 dap add person <object>                 Add a person
  x500 dap add org <object>                    Add an organization
  x500 dap add ou <object>                     Add an organizational unit
  x500 dap add op <object>                     Add an organizational person
  x500 dap add or <object>                     Add an organizational role
  x500 dap add rp <object>                     Add a residential person
  x500 dap add process <object>                Add an application process
  x500 dap add device <object>                 Add a device
  x500 dap add dmd <object>                    Add a DMD
  x500 dap add iop <object>                    Add an inet organizational person -->

- [ ] Even higher-level `ModifyEntry` API
  <!-- x500 dap mod add aci <object> <type> <idtag>        Add an ACIItem to an entry
  x500 dap mod add acs <object> <scheme>              Add an accessControlScheme to an entry
  x500 dap mod add cr <object>                        Add a content rule to a subschema subentry
  x500 dap mod add cur <object> <identifier>          Add a context use rule to a subschema subentry
  x500 dap mod add friendship <object> <anchor>       Add a friendship to a subschema subentry
  x500 dap mod add mru <object> <identifier>          Add a matching rule use to a subschema
  x500 dap mod add sr <object> <id> <subordinate>     Add a name form to a subschema subentry
  x500 dap mod add oc <object> <identifier>           Add a name form to a subschema subentry
  x500 dap mod add sr <object> <ruleid> <nameform>    Add a DIT Structure Rule to a subschema -->
  <!-- x500 dap mod become acsub <object>                Make a DSE into an access control subentry
  x500 dap mod become admpoint <object>             Make a DSE an administrative point
  x500 dap mod become collectivesub <object>        Make a DSE into a collectiveAttributeSubentry
  x500 dap mod become pwdsub <object>               Make a DSE into a passwordAdminSubentry
  x500 dap mod become subschema <object>            Make a DSE into a subschema
  x500 dap mod become svcsub <object> <id> <dmdId>  Make a DSE into a serviceAdminSubentry -->
