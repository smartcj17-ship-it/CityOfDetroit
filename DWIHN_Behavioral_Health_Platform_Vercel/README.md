# DWIHN Behavioral Health Executive Intelligence Prototype

This folder is a deploy-ready static site for Netlify or Vercel. It has no package installation, framework build, API, or external JavaScript dependency.

## Structure

```text
dwihn-dashboard-netlify/
├── index.html
├── netlify.toml
├── vercel.json
├── _headers
├── _redirects
├── README.md
└── assets/
    ├── favicon.svg
    ├── css/
    │   └── styles.css
    └── js/
        └── app.js
```

## Deploy with Netlify Drop

1. If you downloaded the ZIP, unzip it first.
2. Sign in to Netlify and open the manual deploy dropzone.
3. Drag the `dwihn-dashboard-netlify` folder itself into the dropzone. Do not drag the parent `outputs` folder.
4. Open the latest deploy's **Deploy File Explorer** and confirm `index.html` is at the top level, beside `netlify.toml`.
5. Netlify will serve `index.html` automatically. No build command is required.

## Deploy from Git

If this folder is the repository root, connect the repository and leave the build command empty. The included `netlify.toml` publishes the current directory (`.`).

If the repository root is the parent workspace, set the Netlify base/package directory to:

```text
outputs/dwihn-dashboard-netlify
```

The module dashboards use hash routes such as `#executive`, `#population`, and `#zero-suicide`, so they work without server redirects.
The package also includes an SPA fallback in both `_redirects` and `netlify.toml` so direct non-file routes resolve to `index.html` instead of returning a 404.

## Deploy from Git with Vercel

1. Ensure the selected Vercel **Root Directory** is the directory that directly contains `index.html` and `vercel.json`.
2. Set **Framework Preset** to `Other`.
3. Leave the **Build Command** empty.
4. Leave the **Output Directory** override disabled; `vercel.json` explicitly publishes `.`.
5. Deploy, wait for the deployment status to become **Ready**, and open the production domain shown under the project's **Domains** section.

If the repository contains this folder inside another directory, set Vercel's Root Directory to that exact nested path. Do not use an old generated deployment hostname after redeploying; use the current production domain from the Vercel project overview.

## If Netlify shows 404

The Netlify publish directory must be the directory that directly contains `index.html`.

- When this folder is deployed as a standalone project, use publish directory `.`.
- When the parent repository is connected, set the base/package directory to `outputs/dwihn-dashboard-netlify` and publish directory to `.`.
- If the Deploy File Explorer shows `dwihn-dashboard-netlify/index.html` instead of `/index.html`, the parent directory was deployed. Redeploy the inner `dwihn-dashboard-netlify` folder.

## Important prototype note

All displayed values are synthetic. The prototype must not be represented as production DWIHN data. Zero Suicide definitions follow the separately approved Zero Suicide requirement rather than the incorrect SOW appendix.
