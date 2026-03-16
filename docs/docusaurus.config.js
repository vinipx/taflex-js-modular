// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'TAFLEX JS',
  tagline: 'Enterprise Test Automation Framework in JavaScript',
  favicon: 'img/logo.svg',

  url: process.env.DOCS_URL || 'https://vinipx.github.io',
  baseUrl: process.env.DOCS_BASE_URL || '/taflex-js/',

  organizationName: 'vinipx',
  projectName: 'taflex-js',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/vinipx/taflex-js/tree/main/docs/',
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',

      mermaid: {
        theme: {
          light: "base",
          dark: "dark",
        },
        options: {
          themeVariables: {
            primaryColor: "#1a1a2e",
            primaryTextColor: "#e2e8f0",
            primaryBorderColor: "#3b82f6",
            lineColor: "#60a5fa",
            secondaryColor: "#1e1e2e",
            tertiaryColor: "#eff6ff",
          },
        },
      },

      announcementBar: {
        id: "taflex_js_v1",
        content:
          '⚡ TAFLEX JS — Unified Enterprise Test Automation for Web, API & Mobile. <a target="_blank" rel="noopener noreferrer" href="https://github.com/vinipx/taflex-js">Star us on GitHub</a>',
        backgroundColor: "#111111",
        textColor: "#d4d4d8",
        isCloseable: true,
      },

      colorMode: {
        defaultMode: "dark",
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },

      navbar: {
        title: 'TAFLEX JS',
        logo: {
          alt: 'TAFLEX JS Logo',
          src: 'img/logo.svg',
          srcDark: 'img/logo-dark.svg',
          width: 36,
          height: 36,
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docs',
            position: 'left',
            label: 'Documentation',
          },
          {
            to: "/docs/getting-started/quickstart",
            label: "Getting Started",
            position: "left",
          },
          {
            to: "/docs/architecture/overview",
            label: "Architecture",
            position: "left",
          },
          {
            type: "dropdown",
            label: "Tutorials",
            position: "left",
            items: [
              { label: "Web Testing", to: "/docs/tutorials/web-tests" },
              { label: "BDD Testing", to: "/docs/tutorials/bdd-tests" },
              { label: "API Testing", to: "/docs/tutorials/api-tests" },
              { label: "Mobile Testing", to: "/docs/tutorials/mobile-tests" },
              { label: "Contract Testing", to: "/docs/tutorials/contract-testing" },
              { label: "Testing in the Cloud", to: "/docs/tutorials/cloud-execution" },
            ],
          },
          {
            type: "dropdown",
            label: "Core Guides",
            position: "left",
            items: [
              { label: "AI-Agent Integration (MCP)", to: "/docs/guides/mcp-integration" },
              { label: "Reporting Governance", to: "/docs/guides/reporting" },
              { label: "Pact Testing", to: "/docs/guides/pact-testing" },
              { label: "Locators", to: "/docs/guides/locators" },
              { label: "API Testing", to: "/docs/guides/api-testing" },
              { label: "BDD Testing", to: "/docs/guides/bdd-testing" },
              { label: "Cloud Testing", to: "/docs/guides/cloud-testing" },
              { label: "Database", to: "/docs/guides/database" },
              { label: "Unit Testing", to: "/docs/guides/unit-testing" },
            ],
          },
          {
            to: "/docs/api/core-interfaces",
            label: "API Reference",
            position: "left",
          },
          {
            type: "dropdown",
            label: "Guides",
            position: "left",
            items: [
              {
                to: "/docs/guides/qa-engineers",
                label: "QA Engineers",
              },
              {
                to: "/docs/guides/developers",
                label: "Developers",
              },
              {
                to: "/docs/guides/managers",
                label: "Managers",
              },
            ],
          },
          {
            type: "dropdown",
            label: "Resources",
            position: "left",
            items: [
              {
                to: "/docs/best-practices/test-design",
                label: "Best Practices",
              },
              {
                to: "/docs/troubleshooting/common-issues",
                label: "Troubleshooting",
              },
              {
                to: "/docs/contributing/guidelines",
                label: "Contributing",
              },
              {
                to: "/docs/changelog",
                label: "Changelog",
              },
            ],
          },
          {
            href: 'https://github.com/vinipx/taflex-js',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentation',
            items: [
              { label: 'Getting Started', to: '/docs/getting-started/quickstart' },
              { label: 'Tutorials', to: '/docs/tutorials/web-tests' },
              { label: 'BDD Testing', to: '/docs/tutorials/bdd-tests' },
              { label: 'Architecture', to: '/docs/architecture/overview' },
              { label: 'API Reference', to: '/docs/api/core-interfaces' },
            ],
          },
          {
            title: 'Guides',
            items: [
              { label: 'QA Engineers', to: '/docs/guides/qa-engineers' },
              { label: 'Developers', to: '/docs/guides/developers' },
              { label: 'Managers', to: '/docs/guides/managers' },
            ],
          },
          {
            title: 'Resources',
            items: [
              { label: 'Best Practices', to: '/docs/best-practices/test-design' },
              { label: 'Troubleshooting', to: '/docs/troubleshooting/common-issues' },
              { label: 'Changelog', to: '/docs/changelog' },
            ],
          },
          {
            title: 'Links',
            items: [
              { label: 'GitHub', href: 'https://github.com/vinipx/taflex-js' },
              { label: 'Contributing', to: '/docs/contributing/guidelines' },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} TAFLEX JS — MIT License`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: [
          "javascript",
          "bash",
          "json",
          "yaml",
          "markdown",
        ],
      },
    }),
};

export default config;
