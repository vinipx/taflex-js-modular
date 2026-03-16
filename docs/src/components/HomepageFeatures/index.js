import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'AI-Agent Ready (MCP)',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Built-in Model Context Protocol (MCP) server. Empower AI agents to 
        autonomously run tests, inspect locators, and debug failures in real-time.
      </>
    ),
  },
  {
    title: 'Multi-Platform Strategy',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Unify Web (Playwright), API (Axios), and Mobile (Appium) testing. 
        A single codebase for your entire testing ecosystem with robust Strategy patterns.
      </>
    ),
  },
  {
    title: 'Smart Locator Management',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Decouple tests from selectors with hierarchical JSON inheritance. 
        Maintain Global, Mode, and Page-level locators with ease and high reusability.
      </>
    ),
  },
  {
    title: 'Pact Contract Testing',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Ensure microservices compatibility with Consumer-Driven Contracts. 
        Catch breaking API changes early and reduce integration testing overhead.
      </>
    ),
  },
  {
    title: 'Reporting Governance',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Enterprise-grade visibility with Allure, ReportPortal, and Xray. 
        Bridge the gap between automation and Jira for full requirements traceability.
      </>
    ),
  },
  {
    title: 'Type-Safe Architecture',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Powered by Node.js ESM and Zod. Runtime configuration validation 
        ensures your CI/CD pipelines are robust and fail-fast when misconfigured.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
