const { getJestProjects } = require('@nrwl/jest');

export default {
    projects: [
        ...getJestProjects(),
        '<rootDir>/apps/meerkat',
        '<rootDir>/libs/idm',
        '<rootDir>/apps/x500-cli',
        '<rootDir>/libs/ldap-socket',
        '<rootDir>/libs/meerkat-types',
    ],
};
