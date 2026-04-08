# GitHub Packages Strategy — TAFLEX JS Modular

This document describes how the TAFLEX JS Modular framework publishes, distributes, and versions its packages through **GitHub Packages**, and how consuming teams can integrate these modules into their own Test Automation Frameworks (TAFs).

---

## Table of Contents

1. [GitHub Packages Overview](#1-github-packages-overview)
2. [Configuring GitHub Packages (Project Side)](#2-configuring-github-packages-project-side)
3. [Framework Publishing Configuration](#3-framework-publishing-configuration)
4. [Versioning Strategy](#4-versioning-strategy)
5. [Managing Multiple Versions](#5-managing-multiple-versions)
6. [Consumer Guide — Installing and Using TAFLEX Modules](#6-consumer-guide--installing-and-using-taflex-modules)

---

## 1. GitHub Packages Overview

### What Is It?

GitHub Packages is a built-in feature of GitHub that lets you publish, store, and consume npm packages directly within your GitHub repository — no external registry (like npmjs.com) required. Every GitHub repository can act as its own private npm registry.

### How It Works for npm

| Concept | Details |
|---------|---------|
| **Registry URL** | GitHub exposes an npm-compatible endpoint at `https://npm.pkg.github.com` |
| **Scoped packages** | Packages must use an npm scope (e.g., `@taflex/core`). The scope maps to the GitHub organization or user |
| **Authentication** | Consumers authenticate via a Personal Access Token (PAT) with `read:packages` scope, or `GITHUB_TOKEN` in Actions |
| **Visibility** | Follows the repository's visibility setting — private repos require authentication to install packages |

### Why GitHub Packages for TAFLEX?

- **No external dependency** — packages live alongside the source code on GitHub
- **Access control** — leverages existing GitHub roles and permissions; no separate npm account management
- **CI/CD integration** — the `GITHUB_TOKEN` provides automatic authentication in GitHub Actions workflows
- **Auditability** — package versions are tied directly to git tags and CI workflow runs

---

## 2. Configuring GitHub Packages (Project Side)

### 2.1 Enable GitHub Packages

GitHub Packages is enabled by default for all repositories. No additional setup is required.

### 2.2 Authentication Methods

GitHub supports two main authentication methods for npm registry access:

#### Personal Access Token (PAT) — for local development

Best for developers who need to install `@taflex` packages on their machines.

1. Go to **Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. Create a token with the **`read:packages`** scope (read-only) or **`write:packages`** scope (read + publish)
3. Configure `.npmrc`:

```ini
# ~/.npmrc (user-level) or project-level .npmrc
@taflex:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=<YOUR_PAT>
```

#### GITHUB_TOKEN — for GitHub Actions workflows

Used automatically during CI/CD. The `GITHUB_TOKEN` is automatically available in every GitHub Actions workflow with `packages: read` or `packages: write` permissions.

```yaml
# In .github/workflows/ci.yml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    registry-url: https://npm.pkg.github.com
- run: npm ci
  env:
    NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 2.3 Organization-Level vs. Repository-Level Packages

| Level | Scope | Use Case |
|-------|-------|----------|
| **Repository** | `@taflex/*` packages published from this repo | Publishing target — each package is published here |
| **Organization** | All `@taflex/*` packages across org repos | Consumers can resolve all `@taflex/*` packages from one endpoint |

> **Note:** GitHub Packages uses a single registry URL (`https://npm.pkg.github.com`) for all packages. Scoping is handled by the package name prefix (e.g., `@taflex/`).

---

## 3. Framework Publishing Configuration

### 3.1 Monorepo Structure

TAFLEX uses **npm workspaces** to manage 8 publishable packages in a single repository:

```
taflex-js-modular/
├── package.json              # Root — private, workspace manager
├── .changeset/config.json    # Changesets versioning configuration
├── .github/workflows/ci.yml  # CI/CD pipeline
└── packages/
    ├── core/                 # @taflex/core     — Config, logging, driver registry
    ├── web/                  # @taflex/web      — Playwright web automation
    ├── api/                  # @taflex/api      — Axios + Playwright API automation
    ├── mobile/               # @taflex/mobile   — WebdriverIO mobile automation
    ├── bdd/                  # @taflex/bdd      — Playwright-BDD integration
    ├── database/             # @taflex/database  — PostgreSQL + MySQL validation
    ├── reporters/            # @taflex/reporters — Allure, ReportPortal, Jira Xray
    └── contracts/            # @taflex/contracts — Pact contract testing
```

### 3.2 Registry Configuration via `.npmrc`

Registry configuration is handled entirely through `.npmrc`.

Each package's `package.json` does **not** include a `publishConfig` block. The `.npmrc` approach is the single source of truth for registry routing.

- The `@taflex:registry` line in `.npmrc` routes only `@taflex`-scoped packages to GitHub Packages
- The `"files"` field in each `package.json` controls which files are included in the published tarball (typically `["src", "index.js"]`)
- The root `.npmrc` is committed and uses `${GITHUB_TOKEN}` — npm resolves env vars at runtime, so no secrets are ever stored in the file

### 3.3 CI/CD Publish Pipeline

The publish job in `.github/workflows/ci.yml` runs **only on version tags** (e.g., `v1.2.0`):

```yaml
publish:
  runs-on: ubuntu-latest
  needs: [lint, test]
  if: startsWith(github.ref, 'refs/tags/v')
  permissions:
    packages: write
    contents: read
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
        registry-url: https://npm.pkg.github.com
    - run: npm ci
    - name: Publish packages
      env:
        NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      run: |
        for pkg in core web api mobile bdd database reporters contracts; do
          echo "Publishing @taflex/${pkg}..."
          cd packages/${pkg}
          npm publish
          cd ../..
        done
```

**Key points:**

- **`GITHUB_TOKEN`** — automatically provided by GitHub Actions; no manual secret configuration needed
- **`registry-url`** in `setup-node` — configures npm to use GitHub Packages for publishing
- **Tag-triggered** — the workflow only publishes when a git tag matching `v*.*.*` is pushed
- **Publish order does not matter** — `npm publish` creates a tarball and uploads it; it does not resolve or install dependencies

---

## 4. Versioning Strategy

### 4.1 Semantic Versioning

All TAFLEX packages follow [Semantic Versioning](https://semver.org/):

| Version Part | When to Bump | Example |
|--------------|-------------|---------|
| **Major** (`X.0.0`) | Breaking API changes (removed exports, changed method signatures) | `1.0.0 → 2.0.0` |
| **Minor** (`x.Y.0`) | New features, backward-compatible additions | `1.0.0 → 1.1.0` |
| **Patch** (`x.y.Z`) | Bug fixes, documentation, internal refactors | `1.0.0 → 1.0.1` |

### 4.2 Changesets — The Versioning Engine

TAFLEX uses **[@changesets/cli](https://github.com/changesets/changesets)** to manage versioning across the monorepo. Changesets provide an intent-based workflow: developers declare *what changed* and *how significant* the change is, and the tool handles version bumping and changelog generation.

#### Fixed Version Group

In `.changeset/config.json`, all 8 packages are in a **fixed** group:

```json
{
  "fixed": [
    [
      "@taflex/core",
      "@taflex/web",
      "@taflex/api",
      "@taflex/mobile",
      "@taflex/bdd",
      "@taflex/database",
      "@taflex/reporters",
      "@taflex/contracts"
    ]
  ],
  "access": "restricted"
}
```

**What "fixed" means:** All packages in the group always share the same version number. If any package gets a minor bump, all packages bump to the same minor version. This simplifies compatibility — consumers always know that `@taflex/core@1.3.0` and `@taflex/web@1.3.0` are guaranteed to work together.

### 4.3 Release Workflow (Step by Step)

```
Developer                         GitHub Actions
─────────                         ──────────────
1. Make code changes
2. Run: npm run changeset
   → Select affected packages
   → Choose bump type (major/minor/patch)
   → Write change summary
   → A .changeset/*.md file is created

3. Commit changeset + code changes
4. Push to main branch

5. Run: npm run version
   → Changesets reads .changeset/*.md
   → Bumps all versions (fixed group)
   → Updates CHANGELOG.md in each package
   → Deletes consumed .changeset/*.md files

6. Commit version bumps
7. Create git tag: git tag v1.1.0
8. Push tag: git push --tags
                                  9. Tag triggers publish job
                                  10. npm registry configured via setup-node
                                  11. Each package is published to
                                      GitHub Packages
                                  12. Packages available for install
```

#### Example: Creating a Changeset

```bash
# Step 1: After making changes, create a changeset
npm run changeset

# Interactive prompt:
# ? Which packages would you like to include? · @taflex/web, @taflex/core
# ? Which packages should have a major bump? · (none)
# ? Which packages should have a minor bump? · @taflex/web
# ? Summary · Added screenshot-on-failure support to web strategy

# Step 2: A markdown file is created in .changeset/
# e.g., .changeset/brave-tigers-dance.md

# Step 3: When ready to release, consume the changesets
npm run version
# → All packages bump to 1.1.0 (fixed group)
# → CHANGELOG.md files are updated

# Step 4: Commit, tag, and push
git add .
git commit -m "chore: release v1.1.0"
git tag v1.1.0
git push && git push --tags
```

---

## 5. Managing Multiple Versions

### 5.1 Dist-Tags

npm dist-tags let you publish and install specific release channels beyond the default `latest`:

| Tag | Purpose | Example Version |
|-----|---------|-----------------|
| `latest` | Stable production release (default) | `1.2.0` |
| `next` | Pre-release / upcoming version | `1.3.0-beta.1` |
| `legacy` | Previous major version (maintenance) | `1.5.2` |

#### Publishing with a dist-tag

```bash
# In CI or locally
npm publish --tag next          # publishes as @taflex/core@1.3.0-beta.1 under "next"
npm publish --tag legacy        # publishes a patch to the old major under "legacy"
```

#### Installing a specific dist-tag

```bash
npm install @taflex/core@next     # gets the latest pre-release
npm install @taflex/core@legacy   # gets the latest maintenance release
```

### 5.2 Pre-release Versions

For testing upcoming features before a stable release:

```bash
# Create a pre-release changeset
npm run changeset pre enter beta
npm run changeset
npm run version
# → versions become 1.3.0-beta.0, 1.3.0-beta.1, etc.

# Exit pre-release mode when ready for stable
npm run changeset pre exit
npm run version
# → versions become 1.3.0
```

### 5.3 Version Pinning Strategies for Consumers

| Strategy | `package.json` Syntax | Behavior |
|----------|----------------------|----------|
| **Exact** | `"1.2.0"` | Always installs exactly `1.2.0` — maximum stability |
| **Patch range** | `"~1.2.0"` | Allows `1.2.x` patches — gets bug fixes automatically |
| **Minor range** | `"^1.2.0"` | Allows `1.x.x` — gets new features automatically |
| **Pre-release** | `"1.3.0-beta.1"` | Exact pre-release version |

> **Recommendation for consuming teams:** Use **exact versions** (`"1.2.0"`) or **patch ranges** (`"~1.2.0"`) for maximum stability in test automation, where predictability is critical.

### 5.4 Deprecating Old Versions

When a version has known issues or should no longer be used:

```bash
npm deprecate @taflex/core@"< 1.2.0" "Upgrade to >= 1.2.0 for critical bug fixes"
```

Consumers will see a warning when installing deprecated versions.

### 5.5 Maintaining a Previous Major Version

When a breaking change is released (e.g., `v2.0.0`), teams still on `v1.x` may need patches:

```bash
# Create a maintenance branch from the last v1.x tag
git checkout -b maintenance/v1 v1.5.0

# Fix the bug, create changeset (patch), version, and tag
npm run changeset       # → patch bump
npm run version         # → 1.5.1
git tag v1.5.1
git push --tags         # → CI publishes 1.5.1 with dist-tag "legacy"
```

To automate this, add logic in the publish workflow:

```yaml
- name: Determine dist-tag
  id: dist-tag
  run: |
    TAG="${GITHUB_REF_NAME}"
    if echo "$TAG" | grep -qE "^v1\."; then
      echo "tag=--tag legacy" >> "$GITHUB_OUTPUT"
    elif echo "$TAG" | grep -qE "beta|alpha|rc"; then
      echo "tag=--tag next" >> "$GITHUB_OUTPUT"
    else
      echo "tag=" >> "$GITHUB_OUTPUT"
    fi
- name: Publish packages
  env:
    NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: |
    for pkg in core web api mobile bdd database reporters contracts; do
      cd packages/${pkg}
      npm publish ${{ steps.dist-tag.outputs.tag }}
      cd ../..
    done
```

---

## 6. Consumer Guide — Installing and Using TAFLEX Modules

### 6.1 Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 9 (ships with Node 20)
- Access to the TAFLEX GitHub repository
- A **Personal Access Token** with `read:packages` scope (for local development)

### 6.2 Configure the Registry

Create a `.npmrc` file in your project root (or user-level `~/.npmrc`):

```ini
@taflex:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

> **Security tip:** Use an environment variable (`${GITHUB_TOKEN}`) instead of hardcoding the token. The `.npmrc` can be safely committed since it only references environment variables.

For GitHub Actions workflows in consuming projects, the `GITHUB_TOKEN` is automatically available:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    registry-url: https://npm.pkg.github.com
- run: npm ci
  env:
    NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 6.3 Install Modules

Teams install only the modules they need:

```bash
# Web UI testing team
npm install @taflex/core @taflex/web

# API testing team
npm install @taflex/core @taflex/api

# Full-stack team with BDD and reporting
npm install @taflex/core @taflex/web @taflex/api @taflex/bdd @taflex/reporters

# Mobile testing team
npm install @taflex/core @taflex/mobile

# Contract testing
npm install @taflex/core @taflex/api @taflex/contracts

# Database validation
npm install @taflex/core @taflex/database
```

### 6.4 Example: Web UI TAF Setup

#### Project Structure

```
my-web-taf/
├── .npmrc                    # GitHub Packages registry config
├── .env                      # Environment variables
├── package.json
├── playwright.config.js
└── tests/
    ├── pages/
    │   └── login.page.js
    └── specs/
        └── login.spec.js
```

#### `package.json`

```json
{
  "name": "my-web-taf",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "test": "npx playwright test",
    "test:headed": "npx playwright test --headed"
  },
  "dependencies": {
    "@taflex/core": "~1.2.0",
    "@taflex/web": "~1.2.0",
    "@taflex/reporters": "~1.2.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.50.0"
  }
}
```

### 6.5 CI/CD Configuration for Consuming Projects

Add this to the consuming project's `.github/workflows/ci.yml`:

```yaml
name: Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: https://npm.pkg.github.com
      - run: npm ci
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - run: npm test
```

> **Note:** For cross-repository access to private packages, the consuming repository needs a PAT with `read:packages` scope stored as a repository secret (e.g., `secrets.PKG_TOKEN`), since `GITHUB_TOKEN` only has access to packages in the same repository by default.

### 6.6 Checking Available Versions

```bash
# List all published versions of a package
npm view @taflex/core versions

# Check the latest version
npm view @taflex/core version

# These commands work when .npmrc is configured with the GitHub Packages registry
```

---

## Summary

| Topic | Key Takeaway |
|-------|-------------|
| **Registry** | GitHub Packages — built-in, private, no external service needed |
| **Authentication** | PAT for developers, GITHUB_TOKEN for CI/CD workflows |
| **Publishing** | Automated via GitHub Actions on version tags (`v*.*.*`), packages published in dependency order |
| **Versioning** | Changesets with fixed version group — all 8 packages always share the same version |
| **Multiple versions** | Use dist-tags (`latest`, `next`, `legacy`) and maintenance branches |
| **Consuming** | Configure `.npmrc` with scope registry, install only the modules you need |
