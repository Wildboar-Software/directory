# X.500 Authentication Example App

This application uses
[`@wildboar/x500-auth`](https://github.com/Wildboar-Software/directory/tree/master/libs/x500-auth-ts)
to provide basic (username and password) authentication to an express-based web
application.

Run it using `nx run x500-auth-ts-example-express:serve`. It will listen on your
loopback address (`127.0.0.1` or `localhost`) on port `3001`. It does not use
HTTPS, so the URL would be: `http://localhost:3001`.

It authenticates using the Meerkat DSA
[Demo environment](https://wildboar-software.github.io/directory/docs/demo),
specifically performing a `oneLevel` search beneath
`C=US,ST=FL,L=HIL,L=Tampa,L=Westchase`.
