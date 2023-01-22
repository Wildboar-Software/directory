# X.500 Directory Authentication TypeScript Library

- Designed to work with PassportJS.
- Can use Bind or Compare operations to authenticate users.

## Install

```
npm install @wildboar/x500-auth-ts
```

## How it works

- DN discovery:
  - If configured, converts a name to a search argument. The first entry, if
    present, will be returned. If no entry is returned, authentication fails.
  - Otherwise, the function should return a DN directly.
- Use the selected substrategy (bind or compare) to assert the DN and password.
  - Under the "bind" substrategy, this library will attempt to bind to the
    configured DSA with the calculated distinguished name and password.
  - Under the "compare" substrategy, this library will use its own DAP
    association to submit a `compare` operation targeting the calculated
    distinguished name and asserting the supplied password.
- If authentication succeeds, and if configured, perform a read operation on the
  entry and use the configured function to convert the read argument to user
  info.
- The client can supply a async generator function that receives the raw DAP
  client, the user, and reduces the user on each iteration. When `done` is `true`,
  the user info is finally added to the request and authentication is complete.
  - This is so users of this library can search for other entries, such as
    groups the user might be a member of, and use this information from other
    entries to modify the user info, or update a "login time" attribute or some
    other use case like that.

## How to use it

This library has one main export: `get_auth_function()`, which is a higher-order
function that (meaning a function that returns a function). This function takes
a single configuration object and returns a tuple whose first element is the
`Promise` that resolves to the initial bind outcome, and whose second element
is the "auth function."

The auth function has the exact same signature that is passed into
`PassportJS`'s `LocalStrategy` constructor.
([See docs](https://github.com/jaredhanson/passport-local).)

With that overview, review the example below:

```typescript
const [ initial_bind, x500AuthFunction ] = get_auth_function({

    // This is our logging handle. Log events will get displayed right on the
    // console in this case.
    log: console.log,

    // This is the URL of the DSA to which you want to connect.
    url: "idm://dsa01.root.mkdemo.wildboar.software:4632",

    // Step 1: We bind to the directory.
    bind_as: async () => ({
        protocol_id: id_ac_directoryAccessAC,
        timeout: 15000,
        parameter: new DirectoryBindArgument(
            {
                simple: new SimpleCredentials(
                    admin_dn,
                    undefined,
                    {
                        unprotected: Buffer.from("asdf", "utf-8"),
                    },
                ),
            },
            new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT ]),
        ),
    }),

    // Step 2: We convert an asserted username to a search operation.
    username_to_dn_or_search: async (username: string) => ({
        baseObject: search_base_name_us,
        subset: "level",
        filter: {
            item: {
                equality: new AttributeValueAssertion(
                    uid["&id"],
                    uid.encoderFor["&Type"]!({
                        uTF8String: username,
                    }, BER),
                ),
            },
        },
        sizeLimit: 1,
        copyShallDo: true,
        dontMatchFriends: true,
        noSubtypeMatch: true,
        preferChaining: true,
        requestSignedResult: true,
        requestSignedError: true,
        searchAliases: true,
        searchControls: {
            searchFamily: false,
            searchAliases: true,
        },
        selection: {
            attributes: {
                select: [
                    uid["&id"],
                    commonName["&id"],
                    telephoneNumber["&id"],
                    postalAddress["&id"],
                ],
            },
        },
        subentries: false,
        timeLimit: 15,
    }),

    // Step 3: Use the compare operation to assert the password.
    substrategy: { compare: {} },

    // Step 4: Convert a foundentry to user information.
    entry_to_user: async (entry: EntryInformation) => {
        const attributes = entry.information
            ?.flatMap((info) => "attribute" in info ? [info.attribute] : []);
        const uidAttr = attributes?.find((a) => a.type_.isEqualTo(uid["&id"]));
        const uidValue0 = uidAttr?.values[0];
        if (!uidValue0) {
            return {};
        }
        const phone = attributes
            ?.find((a) => a.type_.isEqualTo(telephoneNumber["&id"]))
            ?.values[0]?.printableString;
        const address: string[] | undefined = attributes
            ?.find((a) => a.type_.isEqualTo(postalAddress["&id"]))
            ?.values[0]?.sequence.map((e) => e.utf8String);
        const uidValue: string = directoryStringToString(uid.decoderFor["&Type"]!(uidValue0));
        return {
            uid: uidValue,
            phone,
            address,
        };
    },

    timeout_ms: 15000,
});
const bind_outcome = await initial_bind;
if (!("result" in bind_outcome)) {
    console.error(bind_outcome);
    throw new Error("Could not bind to directory!");
}
passport.use(new LocalStrategy(x500AuthFunction));
app.post("/login",
    passport.authenticate('local', { failureRedirect: '/failure' }),
    (req, res) => {
        res.redirect(`/success?uid=${req.user?.["uid"]}&phone=${req.user?.["phone"]}`);
    });
```

Now let's break that down.

### Connecting to the DSA

This library accepts many parameters into the `get_auth_function()` higher-order
function's configuration object. The first one of interest is `url`:

```typescript
url: "idm://dsa01.root.mkdemo.wildboar.software:4632",
```

Here, we configure the URL of the DSA to which we'd like to connect. The URL
scheme should usually be `idm`, which stands for Internet-Directly-Mapped (IDM),
which is defined in [ITU Recommendation X.519 (2019)](https://www.itu.int/rec/T-REC-X.519/en).
Some older DSAs do not recognized the IDM protocol, and support ISO Transport
Over TCP (ITOT) instead. You can change the URL scheme to `itot://` for this
purpose. To use implicit TLS for either, append `s` to the scheme, making them
`idms` and `itots` respectively.

Meerkat DSA will support more transports in the future, so you may see more
URL schemes, such as `lpp` (for Lightweight Presentation Protocol), or
`xot` (for X.25 Over TCP) appear.

### TLS

This is not depicted in the example.

You can supply
[all NodeJS TLS Socket options](https://nodejs.org/dist/latest-v19.x/docs/api/tls.html#new-tlstlssocketsocket-options)
in the options object under the `tlsOptions` property. These options will apply
towards StartTLS as well. If you supply `tlsOptions` and a URL whose scheme does
not end in `s`, it will be assumed that you want StartTLS. Note that only IDM
supports StartTLS; ITOT does NOT support StartTLS.

### Binding to the DSA

This is where we await the outcome of binding to the DSA.

```typescript
const bind_outcome = await initial_bind;
if (!("result" in bind_outcome)) {
    console.error(bind_outcome);
    throw new Error("Could not bind to directory!");
}
```

We await the result of the initial bind to the DSA. The bind outcome is a
[discriminated union](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions).

- If the `result` property is present, the bind succeeded and the `result`
  property contains the bind result.
- If the `error` property is present, the bind failed, and the `error` property
  contains the bind error.
- If the `abort` property is present, the bind failed (unusually badly!), and
  the `abort` property contains an abort reason enumeration.
- If the `timeout` property is present, the bind failed by timing out.
- If the `other` property is present, something else happened. The value of the
  `other` property is an open-ended object.

The discriminations above come from the `@wildboar/rose-transport` library
[here](https://github.com/Wildboar-Software/directory/tree/master/libs/rose-transport).
You can study the above types in this library.

For most purposes, merely checking that the bind operation returned a `"result"`
is sufficient for checking that your app has authenticated successfully.

By default, this library binds anonymously, but you can construct a bind
argument via the `bind_as` option. This option is an `async` function that
returns the bind argument. (This function is `async` so that you can fetch
relevant data from a database, a file, the network, etc. to construct the bind
argument, if needed).

```typescript
bind_as: async () => ({
    protocol_id: id_ac_directoryAccessAC,
    timeout: 15000,
    parameter: new DirectoryBindArgument(
        {
            simple: new SimpleCredentials(
                admin_dn,
                undefined,
                {
                    unprotected: Buffer.from("asdf", "utf-8"),
                },
            ),
        },
        // Versions 1 and 2.
        new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT ]),
    ),
}),
```

### Getting the Distinguished Name

After this library has bound to a DSA, it can submit operations to the DSA and
begin authenticating users. The first step in authenticating a user is to
convert the supplied username to a distinguished name.

This can be done in one of two ways. If the username can be inserted directly
into a distinguished name, a function can be used to transform the username to
the distinguished name directly without any DSA operation whatsoever. As an
example, if your users' distinguished names have the form of
`C=US,ST=FL,CN=<username>`, you can use a function like so, to transform the
username into the DN:

```typescript
async (username: string) => [
    [
        new AttributeTypeAndValue(
            countryName["&id"],
            countryName.encoderFor["&Type"]!("US", BER),
        ),
    ],
    [
        new AttributeTypeAndValue(
            stateOrProvinceName["&id"],
            stateOrProvinceName.encoderFor["&Type"]!({ uTF8String: "FL" }, BER),
        ),
    ],
    [
        new AttributeTypeAndValue(
            commonName["&id"],
            commonName.encoderFor["&Type"]!({ uTF8String: username }, BER),
        ),
    ],
]
```

However, our example is intentionally more complex. If your username cannot be
directly converted to a distinguished name, you need to perform a search
against the directory to find an entry that has that username.

```typescript
username_to_dn_or_search: async (username: string) => ({
    baseObject: search_base_name_us,
    subset: "level",
    filter: {
        item: {
            equality: new AttributeValueAssertion(
                uid["&id"],
                uid.encoderFor["&Type"]!({
                    uTF8String: username,
                }, BER),
            ),
        },
    },
    sizeLimit: 1,
    copyShallDo: true,
    dontMatchFriends: true,
    noSubtypeMatch: true,
    preferChaining: true,
    requestSignedResult: true,
    requestSignedError: true,
    searchAliases: true,
    searchControls: {
        searchFamily: false,
        searchAliases: true,
    },
    selection: {
        attributes: {
            select: [
                uid["&id"],
                commonName["&id"],
                telephoneNumber["&id"],
                postalAddress["&id"],
            ],
        },
    },
    subentries: false,
    timeLimit: 15,
}),
```

You might have to consult [ITU Recommendation X.511 (2019)](https://www.itu.int/rec/T-REC-X.511/en)
to understand what the above options mean. The most important parts are `filter`
and `selection`.

`filter` causes the directory to return only entries having the `uid` attribute
value equal to the username. If you're wondering what `item` means, it exists
because `filter` is a composable expression. You can combine multiple criteria
in a filter, like so:

```typescript
{
    and: [
        {
            item: {
                equality: new AttributeValueAssertion(
                    uid["&id"],
                    uid.encoderFor["&Type"]!({
                        uTF8String: username,
                    }, BER),
                ),
            },
        },
        {
            not: {
                item: {
                    equality: new AttributeValueAssertion(
                        objectClass["&id"],
                        objectClass.encoderFor["&Type"]!(id_oc_bannedPerson, BER),
                    ),
                },
            },
        },
    ],
}
```

In general, the more filtering criteria you supply, the better the performance
of the search will be. Filtering on object class is a no-brainer.

`selection` determines what attributes the search actually returns. The
selection does not have to include _any_ attributes at all, but you might want
to do this to fetch what groups a user is a member of, or what their display
name is, or other details. The returned attributes will be available later.

### Asserting the Password

This library provides two mechanisms ("substrategies") for asserting a user's
password. Using the `bind` strategy, this library will bind to the directory
using the calculated distinguished name and the supplied password. Using the
`compare` strategy, this library will merely assert the password against the
entry identified by the distinguished name via the `compare` operation.

`compare` will probably be a little more performant, but in the future `bind`
may be more secure, since the `protected` variant will be supported, if it is
configured for use.

Both of these substrategies take the form of a
[discriminated union](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions), with keys of `bind` and `compare` and empty object
values (`{}`) for both. (This is for forward compatibility.)

Here is the `compare` substrategy being chosen:

```typescript
substrategy: { compare: {} },
```

### Converting Directory Information to User Data

Attributes returned from a directory entry are not directly usable. It is much
more consumable, to say, convert the `commonName` attribute values to `string`s
instead of leaving `commonName` values as `ASN1Element`s. This library requires
a function for converting an `EntryInformation` from the `@wildboar/x500`
library into a JavaScript object containing the user information.

If the username was directly converted to a distinguished name, the
`EntryInformation` will have no attributes or values: just the distinguished
name; if the search was used instead, this `EntryInformation` will be the first
entry returned from the search.

Our example is pretty simple: we just extract the `uid`, phone number, and
postal address for this user from the attributes. Note that postal address
values are a `SEQUENCE OF UTF8String`, which is why these values are decoded
differently.

```typescript
entry_to_user: async (entry: EntryInformation) => {
    const attributes = entry.information
        ?.flatMap((info) => "attribute" in info ? [info.attribute] : []);
    const uidAttr = attributes?.find((a) => a.type_.isEqualTo(uid["&id"]));
    const uidValue0 = uidAttr?.values[0];
    if (!uidValue0) {
        return {};
    }
    const phone = attributes
        ?.find((a) => a.type_.isEqualTo(telephoneNumber["&id"]))
        ?.values[0]?.printableString;
    const address: string[] | undefined = attributes
        ?.find((a) => a.type_.isEqualTo(postalAddress["&id"]))
        ?.values[0]?.sequence.map((e) => e.utf8String);
    const uidValue: string = directoryStringToString(uid.decoderFor["&Type"]!(uidValue0));
    return {
        uid: uidValue,
        phone,
        address,
    };
},
```

Note that, if you want to decode more attributes, you probably should not
iterate over them in multiple passes using `.find()` for performance reasons.
You should save them to variables in a single pass of a `for` loop. This is the
most efficient approach, but if, for some reason, the directory returns multiple
attributes of the same type, the last attribute of that type will be used and
the others will "disappear." Directories are not supposed to do this, but it is
a good idea to expect the worst.

### Hydrating User Data with Other Directory Operations

After you have extracted user information from the directory, you may want to
perform multiple other directory operations to further "hydrate" the user
information with information from other directory entries.

Here are some use cases for this:

- Checking what groups a user is a part of by searching for entries of object
  class `groupOfNames` having a `member` value that's the same as the user's
  distinguished name, converting these group names to `string`s and adding these
  strings to the user information.
- Fetching the entry indicated by the `manager` attribute so that the user's
  manager's name can be displayed.
- Fetching a lot more attributes that we did not want to fetch for performance
  reasons before the user successfully authenticated.

This hydration takes place in the `hydrate_user_info()` function. Here is the
simplest example that does absolutely nothing:

```typescript
hydrate_user_info: async (state, user) => user,
```

Here is an example of this value where you use the DAP client to fetch some more
information on the user to populate their group memberships:

```typescript
hydrate_user_info: async (state, user) => {
    if (!state.dap_client || !state.dap_client.rose.socket?.readable) {
        state.dap_client = await create_client(options);
    }
    const socket = state.dap_client.rose.socket;
    if (!socket?.readable || !socket?.writable) {
        state.dap_client = await create_client(options);
    }
    assert(state.dap_client);
    const read_outcome = await state.dap_client.read({
        object: user.dn,
        selection: {
            attributes: {
                select: [
                    memberOf["&id"],
                ],
            },
        },
    });
    // ... Translate memberOf values to group strings and add them to the user.
    return user;
},
```
