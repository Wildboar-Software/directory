import { defineConfig } from 'prisma/config';

export default defineConfig({
    schema: 'apps/meerkat/src/prisma/schema.prisma',
    migrations: {
        path: 'apps/meerkat/src/prisma/migrations',
    },
    datasource: {
        url: 'file:./dev.db',
    },
});
