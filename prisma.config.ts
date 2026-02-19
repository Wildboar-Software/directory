import { defineConfig } from 'prisma/config';

export default defineConfig({
    schema: 'apps/meerkat/src/prisma/schema.prisma',
    migrations: {
        path: 'apps/meerkat/src/prisma/migrations',
    },
    datasource: {
        url: process.env.DATABASE_URL ?? 'file:./dev.db',
    },
});
