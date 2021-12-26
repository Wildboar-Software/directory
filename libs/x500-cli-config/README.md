# X.500 CLI Configuration Schema

1. Compile `index.ts` to `index.js`: `tsc ./source/index.ts`.
2. Convert `index.js` to `index.json`: `node -e 'console.log(JSON.stringify(require(\"./source/index.js\").default));' > .\source\index.json`.
3. Convert `index.json` to `index.d.ts`: `node ./tools/compileInterfaces.js`.
