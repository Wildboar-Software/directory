const jsonSchemaToTypescript = require("json-schema-to-typescript");
const compileFromFile = jsonSchemaToTypescript.compileFromFile;
const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.join(__dirname, "..");

(async () => {
    const typescriptInterfacesSource = await compileFromFile(
        path.join(ROOT_DIR, "libs", "x500-cli-config", "src", "index.json"),
        {
            unreachableDefinitions: true,
        },
    );
    fs.writeFileSync(
        path.join(ROOT_DIR, "libs", "x500-cli-config", "src", "index.d.ts"),
        typescriptInterfacesSource,
    );
})();
