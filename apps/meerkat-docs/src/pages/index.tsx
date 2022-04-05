import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className="container">
                <h1 className="hero__title">{siteConfig.title}</h1>
                <p className="hero__subtitle">{siteConfig.tagline}</p>
                <div className={styles.buttons}>
                    <Link
                        className="button button--secondary button--lg"
                        to="/docs/setup"
                    >
                        Get Started ⏱️
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default function Home(): JSX.Element {
    return (
        <Layout
            title="Meerkat DSA Docs"
            description="Documentation for the Meerkat DSA X.500 Directory Server by Wildboar Software."
        >
            <HomepageHeader />
            <main>
                <p>
                    Meerkat DSA is a full-blown X.500 Directory System Agent (DSA),
                    as described in the International Telecommunication Union's
                    X.500-series of recommendations. It runs on Node.js and is
                    written in TypeScript by&nbsp;
                    <a href="https://wildboarsoftware.com/">
                    Wildboar Software
                    </a>.
                </p>
                <p>
                    X.500 directory systems are general-purpose, distributed,
                    hierarchical databases that use human-friendly names to
                    identify entries. X.500 DSAs can cooperate to host a single
                    hierarchical database, while still maintaining ownership and
                    control over subtrees of the shared, hierarchical data
                    structure. Though general-purpose, X.500 directory systems
                    were primarily designed for storing information about
                    people and organizations.
                </p>
            </main>
        </Layout>
    );
}
