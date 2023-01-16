# X.500 Directory Authentication TypeScript Library

- Designed to work with PassportJS.
- Can use Bind or Compare operations to authenticate users.
- Positive and Negative Caching
- Role-Based Access Control (RBAC)

## How to works

- DN discovery:
  - If configured, converts a name to a search argument. The first entry, if
    present, will be returned.
  - Otherwise, the function should return a DN directly.
- Use the selected substrategy (bind or compare) to assert the DN and password.
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
