# TAFLEX JS — Documentation Site

Source for the [TAFLEX JS documentation site](https://vinipx.github.io/taflex-js-modular), built with [Docusaurus 3.9.2](https://docusaurus.io/).

## Prerequisites

- **Node.js** >= 20
- **npm** (ships with Node.js)

## Quick Start (Local Development)

The simplest way to run the docs locally is the root-level helper script:

```bash
# From the repository root
bash docs.sh
```

This installs dependencies (if needed) and starts the development server at [http://localhost:3000](http://localhost:3000).

Alternatively, run manually:

```bash
cd docs
npm install
npm start
```

Most changes are reflected live without restarting the server.

## Build

```bash
cd docs
npm run build
```

Generates static content into the `build` directory.

## Deployment

The documentation is deployed automatically via **GitHub Actions** (the `pages` stage in `.github/workflows/ci.yml`).

- **Trigger**: Any push that changes files under `docs/**/*`
- **Pipeline**: Builds the site, moves output to `public/`, and GitHub Pages serves it
- **Live URL**: [https://vinipx.github.io/taflex-js-modular](https://vinipx.github.io/taflex-js-modular)

Manual deployment is not required — the CI pipeline handles it.

## Configuration

| File | Purpose |
| :--- | :--- |
| `docusaurus.config.js` | Site metadata, navbar, footer, theme, plugins |
| `sidebars.js` | Documentation navigation structure |
| `src/css/custom.css` | Custom styling and color palette |
| `src/pages/index.js` | Custom homepage component |

Mermaid diagrams are enabled via `@docusaurus/theme-mermaid`.

Edit URL points to: [https://github.com/vinipx/taflex-js-modular/edit/main/docs/](https://github.com/vinipx/taflex-js-modular/edit/main/docs/)

## Tech Stack

| Tool | Version |
| :--- | :--- |
| Docusaurus | 3.9.2 |
| React | 19.x |
| Node.js | >= 20 |
| Mermaid | via `@docusaurus/theme-mermaid` 3.9.2 |
| Prism React Renderer | 2.x |
