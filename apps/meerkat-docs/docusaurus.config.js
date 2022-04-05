// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'Meerkat DSA',
    tagline: 'An X.500 Directory Server (DSA) and LDAP Server by Wildboar Software.',
    url: 'https://docs.meerkat.wildboar.software',
    baseUrl: '/directory/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/boar-head-rune-circle.svg',
    organizationName: 'Wildboar-Software', // Usually your GitHub org/user name.
    projectName: 'directory', // Usually your repo name.
    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    // Please change this to your repo.
                    editUrl:
                        'https://github.com/Wildboar-Software/directory/edit/main/website/',
                },
                // blog: {
                //     showReadingTime: true,
                //     // Please change this to your repo.
                //     editUrl:
                //         'https://github.com/facebook/docusaurus/edit/main/website/blog/',
                // },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
                googleAnalytics: {
                    trackingID: 'UA-177382419-1',
                    anonymizeIP: true,
                },
            }),
        ],
    ],
    // Disabled for now, because this failed to build when I enabled it.
    // I got this error:
    // Module not found: Error: Can't resolve './registerSw.js' in './directory/apps/meerkat-docs/.docusaurus'
    plugins: [
        [
            '@docusaurus/plugin-pwa',
            {
                debug: false,
                offlineModeActivationStrategies: [
                    'appInstalled',
                    'standalone',
                    'queryString',
                ],
                pwaHead: [
                    {
                        tagName: 'link',
                        rel: 'icon',
                        href: '/img/docusaurus.png',
                    },
                    {
                        tagName: 'link',
                        rel: 'manifest',
                        href: '/directory/manifest.json',
                    },
                    {
                        tagName: 'meta',
                        name: 'theme-color',
                        content: 'rgb(37, 194, 160)',
                    },
                ],
            },
        ],
    ],
    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            metadata: [
                {
                    name: 'description',
                    content: 'An X.500 Directory Server (DSA) and LDAP Server by Wildboar Software.',
                },
                {
                    name: 'keywords',
                    content: 'directory, x500, x.500, ldap, database, meerkat, dsa, distributed',
                },
                {
                    name: 'copyright',
                    content: 'Copyright (c) 2021 Jonathan M. Wilbur <jonathan@wilbur.space>.',
                },
            ],
            colorMode: {
                defaultMode: 'dark',
                disableSwitch: false,
                respectPrefersColorScheme: false,
            },
            navbar: {
                title: 'Meerkat DSA',
                logo: {
                    alt: 'Wildboar Software Logo',
                    src: 'img/boar-head-rune-circle.svg',
                },
                items: [
                    {
                        type: 'doc',
                        docId: 'setup',
                        position: 'left',
                        label: 'Get Started',
                    },
                    {
                        type: 'doc',
                        docId: 'docs',
                        position: 'left',
                        label: 'Documentation',
                    },
                    // {
                    //     type: 'doc',
                    //     docId: 'intro',
                    //     position: 'left',
                    //     label: 'Tutorial',
                    // },
                    // { to: '/blog', label: 'Blog', position: 'left' },
                    {
                        href: 'https://github.com/Wildboar-Software/directory',
                        label: 'GitHub',
                        position: 'right',
                    },
                ],
            },
            footer: {
                style: 'dark',
                links: [
                    {
                        title: 'Docs',
                        items: [
                            {
                                label: 'Get Started',
                                to: '/docs/setup',
                            },
                        ],
                    },
                    // {
                    //     title: 'Community',
                    //     items: [
                    //         {
                    //             label: 'Stack Overflow',
                    //             href: 'https://stackoverflow.com/questions/tagged/docusaurus',
                    //         },
                    //         {
                    //             label: 'Discord',
                    //             href: 'https://discordapp.com/invite/docusaurus',
                    //         },
                    //         {
                    //             label: 'Twitter',
                    //             href: 'https://twitter.com/docusaurus',
                    //         },
                    //     ],
                    // },
                    // {
                    //     title: 'More',
                    //     items: [
                    //         {
                    //             label: 'Blog',
                    //             to: '/blog',
                    //         },
                    //         {
                    //             label: 'GitHub',
                    //             href: 'https://github.com/facebook/docusaurus',
                    //         },
                    //     ],
                    // },
                ],
                copyright: `Copyright © 2022 Wildboar Software. Built with Docusaurus.`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
                // This would just make the app crash. Not viable.
                // additionalLanguages: ['asn']
            },
        }),
};

module.exports = config;
