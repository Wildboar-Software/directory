# TypeScript X.500 Directory Services Client Library

The officially-supported TypeScript X.500 client library. This is primarily for
making Directory Access Protocol (DAP) requests to an X.500 DSA, but it can be
used for the Directory System Protocol (DSP) and Directory Operational Binding
Management Protocol (DOP) as well. It works over both
Internet Directly-Mapped (IDM) and ISO Transport Over TCP (ITOT) transports, as
defined in [ITU Recommendation X.519 (2019)](https://www.itu.int/rec/T-REC-X.519/en).

## Documentation

The JSDoc and types are the best that you'll get for now, but here is the
`DAPClient` interface for you:

```typescript
export
interface DAPClient extends AsyncROSEClient<BindArgument, BindResult>, DAPOptions, DirectoryVersioned {
    rose: ROSETransport;

    // From AsyncROSEClient
    bind: (params: DAPBindParameters) => Promise<DAPBindOutcome>;
    request: (params: RequestParameters) => Promise<OperationOutcome>;
    unbind: () => Promise<UnbindOutcome>;

    read: (arg: ReadOptions) => Promise<OperationOutcome<typeof read["&ResultType"]>>;
    compare: (arg: CompareOptions) => Promise<OperationOutcome<typeof compare["&ResultType"]>>;
    abandon: (arg: AbandonOptions) => Promise<OperationOutcome<typeof abandon["&ResultType"]>>;
    list: (arg: ListOptions) => Promise<OperationOutcome<typeof list["&ResultType"]>>;
    search: (arg: SearchOptions) => Promise<OperationOutcome<typeof search["&ResultType"]>>;
    addEntry: (arg: AddEntryOptions) => Promise<OperationOutcome<typeof addEntry["&ResultType"]>>;
    removeEntry: (arg: RemoveEntryOptions) => Promise<OperationOutcome<typeof removeEntry["&ResultType"]>>;
    modifyEntry: (arg: ModifyEntryOptions) => Promise<OperationOutcome<typeof modifyEntry["&ResultType"]>>;
    modifyDN: (arg: ModifyDNOptions) => Promise<OperationOutcome<typeof modifyDN["&ResultType"]>>;
    changePassword: (arg: ChangePasswordOptions) => Promise<OperationOutcome<typeof changePassword["&ResultType"]>>;
    administerPassword: (arg: AdministerPasswordOptions) => Promise<OperationOutcome<typeof administerPassword["&ResultType"]>>;
}
```

The above is what you'll use to interact with an X.500 directory, usually.

## Examples

### Full Example: Bind, Read the Root DSE, and Unbind

```typescript

// First, we create a TCP socket bound to a DSA that we have running locally.
const socket = createConnection({
  host: "localhost",
  port: 4632,
});

// Then, we create the IDM socket using the TCP socket.
const idm = new IDMConnection(socket);

// Then, we create a ROSE transport from the IDM socket.
const rose = rose_transport_from_idm_socket(idm);

// Then, we create the DAP client from the ROSE transport.
// (I know it seems complicated, but there are a lot of layers of indirection here out of necessity.)
const dap = create_dap_client(rose);

// We bind using the idm-dap protocol and we imply v1 and bind anonymously (no credentials).
const bind_response = await dap.bind({
  protocol_id: id_idm_dap,
  parameter: new DirectoryBindArgument(undefined, undefined),
});

if ("result" in bind_response) {
  const result = _decode_DirectoryBindResult(bind_response.result.parameter);
}
else if ("error" in bind_response) {
  console.error("Bind error.");
  process.exit(1);
}
else if ("abort" in bind_response) {
  console.error("Bind aborted.");
  process.exit(1);
}
else if ("timeout" in bind_response) {
  console.error("Bind timed out.");
  process.exit(1);
}
else if ("other") {
  console.error(bind_response.other);
  process.exit(1);
} else {
  // This should never happen.
  process.exit(2);
}

// This is a read request for the root DSE
const response = await dap.read({
  object: {
    rdnSequence: [], // Zero-length distinguished name, meaning the Root DSE.
  },
  // We want to select all operational attributes so we can guarantee that
  // there are _some_ attributes to return, otherwise, the DSA will return an
  // error as required by the X.500 specifications when a read returns an entry,
  // but no attributes.
  selection: {
    extraAttributes: {
      allOperationalAttributes: null,
    },
  },
});


if ("result" in response) {
  const resultData = getOptionallyProtectedValue(response.result.parameter);
  return expect(resultData).toBeDefined();
} else {
  assert(false);
}

// If we get a result, we find the createTimestamp attribute value and print
// the Root DSE's creation time to the console.
if ("result" in response) {
  // `parameter` does not have to be decoded. It is an already-decoded
  // `ReadResult`.
  const resultData = getOptionallyProtectedValue(response.result.parameter);
  const ctinfo = resultData.entry.information?.find((info) => ("attribute" in info) && (
    info.attribute.type_.isEqualTo(createTimestamp["&id"])
  ));
  assert(ctinfo);
  assert("attribute" in ctinfo);
  const ctattr = ctinfo.attribute;
  const ct = ctattr.values[0];
  assert(ct);
  console.log(`Root DSE created at ${ct.generalizedTime.toISOString()}`);
  dap.unbind().then(); // You _can_ await this, but you don't _have_ to.
  process.exit(0); // It worked!
}
else if ("error" in response) {
  console.error("Operation errored.");
  process.exit(1);
}
else if ("reject" in response) {
  console.error("Operation rejected.");
  process.exit(1);
}
else if ("abort" in response) {
  console.error("Operation aborted.");
  process.exit(1);
}
else if ("timeout" in response) {
  console.error("Operation timed out.");
  process.exit(1);
}
else if ("other") {
  console.error(response.other);
  process.exit(1);
} else {
  // This should never happen.
  process.exit(2);
}
```

### Bind via a URL

```typescript
const rose = rose_from_url("idm://localhost:4632");
```

### Bind via an OSI Presentation Address

```typescript
const rose = rose_from_presentation_address({
    // pSelector?: OCTET_STRING;
    // sSelector?: OCTET_STRING;
    // tSelector?: OCTET_STRING;
    nAddresses?: [
      // FYI, I am pretty sure this is NOT a valid N-address.
      Buffer.from("080808080808", "hex"),
    ];
});
```

### Bind using a protocol that uses TLS

```typescript
const rose = rose_from_url(
  "idm://localhost:4632",
  undefined, // remote presentation address
  { // TLS options, exactly as used by node:tls.
    ca: fs.readFileSync("./pki/ca.pem"),
    key: fs.readFileSync("./pki/key.pem"),
    cert: fs.readFileSync("./pki/cert.pem"),
  },
);
```
