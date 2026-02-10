import { defineConfig } from 'prisma/config';
import process from "node:process";

export default defineConfig({
    migrations: {
        path: 'prisma/migrations',
    },
    datasource: {
        url: process.env.DATABASE_URL ?? ':memory:',
    },
});
