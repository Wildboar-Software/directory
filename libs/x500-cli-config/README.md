# X.500 CLI Configuration Schema

JSONSchema and TypeScript types for the
[X.500 Client Configuration Schema](https://wildboar-software.github.io/directory/docs/client-config).

## Build

1. Compile `index.ts` to `index.js`: `tsc ./src/index.ts`.
2. Convert `index.js` to `index.json`: `node -e 'console.log(JSON.stringify(require("./src/index.js").default));' > ./src/index.json`.
3. Convert `index.json` to `index.d.ts`: `node ./tools/compileInterfaces.js`.