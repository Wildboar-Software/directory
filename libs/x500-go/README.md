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

- [ ] Documentation
- [ ] List and Search Result Iterator
- [ ] Break this library up into `x500` and `x500-client`
- [ ] Test signing
- [ ] Add types defined in newer X.500 specifications
  - I think I will wait until the newest version is released.
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
