import { defineConfig } from 'prisma/config';

export default defineConfig({
    schema: 'apps/meerkat/src/prisma/schema.prisma',
    migrations: {
        path: 'apps/meerkat/src/prisma/migrations',
    },
    datasource: {
        url: 'mysql://root:example@localhost:3306/directory',
    },
});
