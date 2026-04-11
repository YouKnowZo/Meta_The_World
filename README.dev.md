# Dev setup (PowerShell)

This file shows a minimal set of commands to get the project running for development on Windows PowerShell.

## Prerequisites

- Install Node.js LTS 18.x. Recommended: <https://nodejs.org/en/download/>
- (Optional) Install `nvm-windows` and use `nvm install 18` + `nvm use 18`.

From repository root:

```powershell
# Install root deps (npm workspaces will install packages for subpackages)
npm install

# Start the server in one terminal
cd .\server
npm install
npm run dev

# Start the web app in another terminal
cd ..\apps\web
npm install
npm run dev

# Alternatively, start everything from the repo root (runs 'lerna run dev --parallel')
# This requires that packages expose a 'dev' script (server now has one).
npm start
```

## Notes on Lerna bootstrap

- Recent Lerna versions (v7+) removed the `bootstrap` command. If you were following older docs that use `npx lerna bootstrap`, replace that step with `npm install` (or your package manager's workspace install). If you specifically need legacy `bootstrap` behavior, install Lerna v6 globally or in devDependencies: `npm i -D lerna@6`.

## Notes

- `.nvmrc` contains the recommended Node major version (18). The root `package.json` includes an `engines.node` entry to help tools and CI use the correct Node version.
- The root `start` script runs the existing `dev` script (which uses `lerna run dev --parallel`). This will start all packages that expose a `dev` script.
- If you prefer `yarn` or `pnpm`, replace `npm install` with your package manager of choice and run workspace bootstrap accordingly.

If you'd like, I can also:

- Add a `concurrently`-based single-command dev runner in `package.json`.
- Add a simple PM2/Nodemon dev dependency for auto-reload of the server.

Tell me which of these you'd like next.
