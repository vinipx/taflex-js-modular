# Contributing Guidelines

Thank you for your interest in contributing to TAFLEX JS!

## Development Flow

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/vinipx/taflex-js-modular.git
   cd taflex-js-modular
   npm install
   ```
2. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/my-feature
   ```
3. Implement your changes in the appropriate package under `packages/`.
4. Add or update tests in the package's `tests/` directory.
5. Ensure all checks pass:
   ```bash
   npm run lint
   npm test
   ```
6. Create a changeset describing your changes:
   ```bash
   npm run changeset
   ```
7. Submit a Pull Request to `main`.

## Package Structure

Each package follows this structure:
```text
packages/my-package/
├── src/          # Source files
├── tests/        # Test files (*.spec.js)
├── index.js      # Barrel export
└── package.json  # Package manifest
```

## Coding Standards

- Use **ESM** (`import`/`export`) — all packages set `"type": "module"`.
- Follow existing naming conventions: `kebab-case` files, `PascalCase` classes.
- Format code with Prettier and lint with ESLint:
  ```bash
  npm run lint:fix
  ```
- Add unit tests for new core framework features using **Vitest**.

## Changesets & Versioning

TAFLEX JS uses [Changesets](https://github.com/changesets/changesets) for version management. All packages are versioned together in **fixed mode**.

When your change affects consumers (new features, bug fixes, breaking changes), you must include a changeset:
```bash
npm run changeset
```
This creates a markdown file in `.changeset/` that is consumed during the release process. Do **not** manually edit version numbers in `package.json`.

## Pull Request Workflow

1. Push your feature branch to the remote.
2. Create a Pull Request targeting `main`.
3. Ensure the CI pipeline passes (lint + tests).
4. Request review from `@taflex/coe` (see `CODEOWNERS`).
5. Once approved and merged, a maintainer will handle the release.

## Publishing

Publishing is automated via GitHub Actions. When a version tag (e.g., `v1.2.0`) is pushed to the repository, the pipeline publishes all packages to the GitHub Packages in dependency order.

For details on the registry and consuming packages, see the [Package Registry Guide](../guides/package-registry).
