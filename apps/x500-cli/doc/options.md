
## Connection and Binding

- D - BindDN
- w - Password
- y - Password File
- W - Prompt for password
- H - URI (`idm://`, `idms://`, `itot://`, etc.)
- v - Verbose output
- z - Do NOT StartTLS (Always by default)
- TODO: Do not unbind?
- i - Start in interactive mode
- C - Configuration File

## Common Arguments

- Service Controls
  - priority
  - timeLimit
  - sizeLimit
  - scopeOfReferral
  - attributeSizeLimit
  - manageDSAITPlaneRef
  - dsaName
  - agreementID
  - serviceType
  - userClass
- Service Control Options
  - preferChaining
  - chainingProhibited
  - localScope
  - dontUseCopy
  - dontDereferenceAliases
  - subentries
  - copyShallDo
  - partialNameResolution
  - manageDSAIT
  - noSubtypeMatch
  - noSubtypeSelection
  - countFamily
  - dontSelectFriends
  - dontMatchFriends
  - allowWriteableCopy
- Security Parameters
  - certification-path (Path to file)
- familyGrouping
- Entry Information Selection
  - attributes-select
  - extraAttributes-all
  - extraAttributes-select
  - contextSelection-all (Select not supported yet.)
  - returnContexts (boolean)
  - familyReturn

## Operations

### Read

-o Object
-m modifyRightsRequest

### Compare

-o Object

### Abandon

### List

-o Object
-f List Family

### Search

-o Object
-s Subset
-a Search Aliases
-c Check Overspecified
-x Extended Area
- Search Control Options
  - searchAliases
  - matchedValuesOnly
  - checkOverspecified
  - performExactly
  - includeAllAreas
  - noSystemRelaxation
  - dnAttribute
  - matchOnResidualName
  - entryCount
  - useSubset
  - separateFamilyMembers
  - searchFamily
- Hierarchy Selections

### Add Entry

-o Object
-t Target System

Attributes are positional.

`2.5.4.3:"Jonathan Wilbur"`

Contexts are not supported.

Actually, should this be supported at all? It would be extremely complicated.

### Remove Entry

- o Object

### Modify Entry

```bash
x500 dap modify \
  -B "CN=jwilbur,C=US" \
  -w ChunkyMonkey123 \
  -H idm://localhost:102 \
  -o "CN=otheruser,C=FR" \
  -a 2.5.4.10:"Wildboar Software"
```

-o Object
-a Add
-r Remove
-R Remove All
-A Alter
-X Reset
-f Replace From
-t Replace To

### Modify DN

-o Object
-n New RDN Only
-d Delete old RDN values

### Change Password

`[object] [oldpwd] [newpwd]`

### Administer Password

`[object] [newpwd]`

### Other Subcommands

- `x500 dap add-countries`
- `x500 dap add-tlds`
- `x500 dap add-oids`
- `x500 dap add-urns`
- `x500 dap add-c-and-st`?
- `x500 dap reset`
- `x500 dap dump`
- `x500 dap shell`
