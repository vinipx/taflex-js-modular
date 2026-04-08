# Package Registry

TAFLEX JS is distributed as a set of modular npm packages through the **GitHub Packages**. This guide explains how the packages are published, versioned, and consumed by client teams.

## Overview

The GitHub Packages is a private npm registry hosted alongside the TAFLEX JS repository. It allows the framework team to publish scoped `@taflex/*` packages and gives client teams a secure, token-based way to install them — without relying on the public npm registry.

Key benefits:

- **Access control** — only authenticated users with GitHub access can install packages.
- **Tight CI integration** — the `GITHUB_TOKEN` available in every GitHub Actions job provides automatic authentication.
- **Single source of truth** — package artifacts live next to the source code that produces them.

---

## Package Ecosystem

All packages are published under the `@taflex` scope. The table below lists every package, its purpose, and its internal dependencies.

| Package | Description | Internal Deps |
| :--- | :--- | :--- |
| **@taflex/core** | Core abstractions, config management, locator manager, and logging | None |
| **@taflex/web** | Playwright-based web automation driver | `@taflex/core` |
| **@taflex/api** | API automation drivers (Axios and Playwright) | `@taflex/core` |
| **@taflex/mobile** | WebdriverIO-based mobile automation driver | `@taflex/core` |
| **@taflex/bdd** | BDD integration using playwright-bdd and Gherkin | `@taflex/core` |
| **@taflex/database** | SQL database validation (PostgreSQL and MySQL) | None |
| **@taflex/reporters** | Enterprise reporting integrations (Allure, ReportPortal, Jira Xray) | `@taflex/core` |
| **@taflex/contracts** | Consumer-driven contract testing with Pact | `@taflex/core` |

Client teams install only the packages they need. For example, a team that only runs web UI tests would install `@taflex/web` (which includes `@taflex/core` as a dependency).

---

## Publishing Packages

> This section is for **framework maintainers**. Client teams can skip to [Consuming Packages](#consuming-packages).

### Changesets Workflow

TAFLEX JS uses [Changesets](https://github.com/changesets/changesets) to manage versioning and changelogs. Every meaningful code change must include a changeset file that describes what changed and the type of version bump required.

1. **Create a changeset** while working on your feature branch:

    ```bash
    npx changeset
    ```

    The interactive prompt asks which packages are affected and whether the change is a `patch`, `minor`, or `major` bump.

2. **Commit the changeset file** — it will appear as a new Markdown file inside the `.changeset/` directory.

3. **Merge to `main`** — Changesets will accumulate until a maintainer is ready to release.

4. **Version the packages** — a maintainer runs:

    ```bash
    npx changeset version
    ```

    This consumes all pending changeset files, bumps `package.json` versions, and updates `CHANGELOG.md` entries.

5. **Tag and push** — create a Git tag matching the pattern `v<major>.<minor>.<patch>` (e.g., `v1.2.0`) and push it:

    ```bash
    git tag v1.2.0
    git push origin v1.2.0
    ```

### CI Pipeline

The `.github/workflows/ci.yml` pipeline has three stages:

| Stage | Jobs | Trigger |
| :--- | :--- | :--- |
| **install** | `install` — runs `npm ci` | Every commit |
| **quality** | `lint` and `test` — run in parallel | Every commit |
| **publish** | `publish` — pushes packages to the registry | Only on version tags (`v*.*.*`) |

When the `publish` stage runs, it authenticates with `GITHUB_TOKEN` via `setup-node`. Packages are published in dependency order:

```
core → web → api → mobile → bdd → database → reporters → contracts
```

This ensures that any package depending on `@taflex/core` can resolve it from the registry at publish time.

---

## Consuming Packages

### 1. Configure Your `.npmrc`

Client projects need to tell npm where to find `@taflex` packages. Create or update the `.npmrc` file at the root of your project:

```ini
@taflex:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

### 2. Authenticate

The auth token referenced in `.npmrc` depends on the context where you are installing packages.

| Context | Token Type | How to Obtain |
| :--- | :--- | :--- |
| **GitHub Actions job** | `GITHUB_TOKEN` | Automatically available in every workflow. Use `NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}`. |
| **Developer workstation** | Personal Access Token | Generate one at **Settings > Developer settings > Personal access tokens** with the `read:packages` scope. |
| **External CI system** | Personal Access Token | Create a PAT with `read:packages` scope and store it as a CI secret. |

#### GitHub Actions Example

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    registry-url: https://npm.pkg.github.com
- run: npm ci
  env:
    NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

#### Local Development

Export the token in your shell profile or `.env` file:

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

Then `npm install` will resolve `@taflex/*` packages from the GitHub Packages registry automatically.

### 3. Install Packages

Install only what your project requires:

```bash
# Web UI testing
npm install @taflex/core @taflex/web

# API testing
npm install @taflex/core @taflex/api

# Full stack (web + API + BDD + reporting)
npm install @taflex/core @taflex/web @taflex/api @taflex/bdd @taflex/reporters

# Contract testing
npm install @taflex/core @taflex/contracts

# Database validation (no core dependency needed)
npm install @taflex/database
```

> **Node version**: TAFLEX JS requires **Node 20** or later. Ensure your project and CI environment match this requirement.

---

## Code Ownership

The `CODEOWNERS` file in the repository root controls who must approve pull requests. By default, the **TAFLEX Center of Excellence (CoE)** team owns the entire codebase:

```
* @taflex/coe
```

### Delegating Ownership to Client Teams

If a client team takes responsibility for a specific package (for example, maintaining the mobile driver package), a CoE maintainer can add a per-directory rule:

```
packages/mobile/    @taflex/coe @taflex/mobile-team
packages/reporters/ @taflex/coe @taflex/reporting-team
```

With this configuration, pull requests that touch `packages/mobile/` require approval from **both** `@taflex/coe` and `@taflex/mobile-team`. This ensures the CoE retains oversight while the owning team reviews domain-specific changes.

---

## Versioning Strategy

### Fixed Mode

All eight `@taflex/*` packages use the **fixed** versioning strategy provided by Changesets. This means every package always shares the same version number. When any package receives a bump, all packages are bumped together.

This approach was chosen because:

- Client teams can rely on a single version number across all packages.
- Internal dependency compatibility is guaranteed — there is no risk of version mismatches between, for example, `@taflex/web@1.3.0` and `@taflex/core@1.2.0`.

### Internal Dependency Resolution

Inside the monorepo, internal dependencies use `"*"` (workspace protocol). During publish, npm resolves this to the actual current version. The Changesets setting `updateInternalDependencies: "patch"` ensures that when `@taflex/core` is bumped, every package that depends on it has its dependency range updated automatically.

### How to Add a Changeset

```bash
npx changeset
```

Follow the prompts:

1. **Select packages** — choose the packages your change affects. In fixed mode, the version bump will apply to all packages regardless.
2. **Choose bump type**:
    - `patch` — bug fixes, internal refactors, documentation changes.
    - `minor` — new features, new configuration options.
    - `major` — breaking changes to public APIs.
3. **Write a summary** — describe the change in one or two sentences. This text appears in the generated changelog.

The command creates a Markdown file in `.changeset/` with a random name (e.g., `.changeset/brave-foxes-dance.md`). Commit this file along with your code changes.

---

## Troubleshooting

### `401 Unauthorized` when installing packages

- Verify that your auth token is valid and has not expired.
- For Personal Access Tokens, ensure the `read:packages` scope is granted.
- Confirm the token is exported as an environment variable that matches the name used in `.npmrc` (e.g., `GITHUB_TOKEN`).

### `404 Not Found` for a package

- Verify that the package has been published to GitHub Packages.
- Verify that the package version you are requesting has actually been published. Check the **Packages** tab in the GitHub repository.

### `npm ERR! code ERESOLVE` (dependency conflicts)

- TAFLEX packages use fixed versioning. If you pin different versions of different `@taflex/*` packages, npm may fail to resolve the tree. Always install the same version across all `@taflex/*` packages:

    ```bash
    npm install @taflex/core@1.2.0 @taflex/web@1.2.0
    ```

### `GITHUB_TOKEN` not working for cross-repo packages

- `GITHUB_TOKEN` is scoped to the repository that owns the workflow. For cross-repository package access, create a PAT with `read:packages` scope and store it as a repository secret (e.g., `PKG_TOKEN`). Use `NODE_AUTH_TOKEN: ${{ secrets.PKG_TOKEN }}` in your workflow.

### Packages install from the public npm registry instead of GitHub Packages

- Make sure the `.npmrc` is in the root of your project (next to `package.json`) and contains the `@taflex:registry` line.
- Run `npm config get @taflex:registry` to verify that npm sees the correct registry URL.
- If using a global `.npmrc`, the project-level `.npmrc` takes precedence only when you run `npm` from the project directory.

### `ENOENT` or network errors behind a corporate proxy

- Configure npm to use the proxy:

    ```bash
    npm config set proxy http://proxy.yourcompany.com:8080
    npm config set https-proxy http://proxy.yourcompany.com:8080
    ```

- If your company uses a custom CA certificate, point npm at it:

    ```bash
    npm config set cafile /path/to/corporate-ca.crt
    ```
