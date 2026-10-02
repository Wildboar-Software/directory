/**
 * This is a minimal script to publish your package to "npm".
 * This is meant to be used as-is or customize as you see fit.
 *
 * This script is executed on "dist/path/to/library" as "cwd" by default.
 *
 * You might need to authenticate with NPM before running this script.
 */
import process from "node:process";
import { readCachedProjectGraph } from '@nrwl/devkit';
import { execSync } from 'child_process';
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import chalk from 'chalk';

function invariant(condition, message) {
    if (!condition) {
        console.error(chalk.bold.red(message));
        process.exit(1);
    }
}

// Executing publish script: node path/to/publish.mjs {name} --version {version} --tag {tag}
// Default "tag" to "next" so we won't publish the "latest" tag by accident.
const [, , name, version, tag = 'next'] = process.argv;

// A simple SemVer validation to validate the version
const validVersion = /^\d+\.\d+\.\d+(-\w+\.\d+)?/;
invariant(
    version && validVersion.test(version),
    `No version provided or version did not match Semantic Versioning, expected: #.#.#-tag.# or #.#.#, got ${version}.`
);

const graph = readCachedProjectGraph();
const project = graph.nodes[name];

invariant(
    project,
    `Could not find project "${name}" in the workspace. Is the project.json configured correctly?`
);

const projectRoot = resolve(project.data.root);
const configuredOutput = project.data?.targets?.build?.options?.outputPath;
const outputPath = configuredOutput
    ? resolve(configuredOutput)
    : join(projectRoot, 'dist');

process.chdir(outputPath);

// tsc --build writes declarations next to the package and leaves package.json
// at the project root. Publish the emitted directory with entry points rewritten
// to that directory.
if (!existsSync('package.json')) {
    const source = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf8'));
    const rewrite = (value) =>
        typeof value === 'string' ? value.replace(/^\.\/dist\//, './') : value;
    for (const field of ['main', 'module', 'types']) {
        if (source[field]) {
            source[field] = rewrite(source[field]);
        }
    }
    const dot = source.exports?.['.'];
    if (dot && typeof dot === 'object') {
        const published = {};
        for (const [key, value] of Object.entries(dot)) {
            if (key === 'development') {
                continue;
            }
            published[key] = rewrite(value);
        }
        source.exports['.'] = published;
    }
    writeFileSync('package.json', JSON.stringify(source, null, 2));
    for (const asset of ['README.md', 'LICENSE.txt']) {
        const from = join(projectRoot, asset);
        if (existsSync(from)) {
            copyFileSync(from, asset);
        }
    }
}

// Updating the version in "package.json" before publishing
try {
    const json = JSON.parse(readFileSync(`package.json`).toString());
    json.version = version;
    writeFileSync(`package.json`, JSON.stringify(json, null, 2));
} catch (e) {
    console.error(
        chalk.bold.red(
            `Error reading package.json file from library build output.`
        )
    );
}

// Execute "npm publish" to publish
execSync(`npm publish --access public --tag ${tag}`);
