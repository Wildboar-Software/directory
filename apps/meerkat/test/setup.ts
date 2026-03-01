import process from "node:process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { execSync } from "node:child_process";

export default async function() {
    const dbfile = path.join(
        fs.mkdtempSync(path.join(os.tmpdir(), 'meerkat-test-')),
        "meerkat.db",
    );
    const dburl = `file:${dbfile}`;
    console.log(`Deploying migrations to ${dburl}`);
    execSync("npx prisma migrate deploy --schema apps/meerkat/src/prisma/schema.prisma", {
        env: {
            DATABASE_URL: dburl,
            PATH: process.env.PATH,
            PRISMA_HIDE_UPDATE_MESSAGE: "1",
        },
    });
    process.env.VITE_DATABASE_URL = dburl;
}
