# X.500 Directory Libraries

The following are libraries / software modules / SDKs that are designed to
interface with the X.500 directory using directory-oriented protocols other than
LDAP.

| Library Name        | Language   | Status | Link                               |
|---------------------|------------|--------|------------------------------------|
| x500-client-ts      | TypeScript | Done   | https://www.npmjs.com/package/@wildboar/x500-client-ts |
| x500-dap-client     | Go         | Done   | https://github.com/Wildboar-Software/x500-go |
| x500-client         | Rust       | WIP    | https://github.com/JonathanWilbur/asn1.rs (will change) |

After the Rust client is completed, libraries for the following languages will
be prioritized and officially supported:

- Python
- C (great for FFI / integration with other languages)
- Zig
- Dart (great for mobile development via Flutter)
- Kotlin (great for mobile development on Android)

The following languages will never be officially supported, unless somebody else
does the bulk of the work up front, then gives me the reins:

- C#
- Java
- C++
- Ruby
- D
- Nim
- Odin
- Objective C
- Any Lisp Dialect

For most of the above, you will be able to use FFI to call functions defined in
the C library.
