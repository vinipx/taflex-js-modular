/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: "doc",
      id: "index",
      label: "Introduction",
    },
    {
      type: "category",
      label: "Getting Started",
      collapsed: false,
      items: ["getting-started/quickstart"],
    },
    {
      type: "category",
      label: "Architecture",
      collapsed: false,
      items: ["architecture/overview"],
    },
    {
      type: "category",
      label: "Tutorials",
      collapsed: false,
      items: [
        "tutorials/web-tests",
        "tutorials/bdd-tests",
        "tutorials/api-tests",
        "tutorials/mobile-tests",
        "tutorials/contract-testing",
        {
          type: "doc",
          id: "tutorials/cloud-execution",
          label: "Testing in the Cloud",
        },
      ],
    },
    {
      type: "category",
      label: "User Guides",
      items: [
        "guides/qa-engineers",
        "guides/developers",
        "guides/managers",
      ],
    },
    {
      type: "category",
      label: "Core Guides",
      items: [
        "guides/mcp-integration",
        {
          type: "doc",
          id: "guides/reporting",
          label: "Reporting Governance",
        },
        "guides/pact-testing",
        "guides/locators",
        "guides/api-testing",
        "guides/bdd-testing",
        "guides/cloud-testing",
        "guides/database",
        "guides/unit-testing",
      ],
    },
    {
      type: "category",
      label: "API Reference",
      items: ["api/core-interfaces"],
    },
    {
      type: "category",
      label: "Best Practices",
      items: ["best-practices/test-design"],
    },
    {
      type: "category",
      label: "Troubleshooting",
      items: ["troubleshooting/common-issues"],
    },
    {
      type: "category",
      label: "Contributing",
      items: ["contributing/guidelines"],
    },
    {
      type: "doc",
      id: "changelog",
      label: "Changelog",
    },
  ],
};

export default sidebars;
