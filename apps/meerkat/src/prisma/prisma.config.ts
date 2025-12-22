import { defineConfig } from 'prisma/config';

export default defineConfig({
    migrations: {
        path: 'prisma/migrations',
    },
    datasource: {
        url: process.env.DATABASE_URL ?? ':memory:',
    },
});
