# The Advent Project — Subscribe Form

The email signup and unsubscribe pages for [The Advent Project](https://adventproject.org). It's a small static site built with [Vite](https://vite.dev) and [PostCSS](https://postcss.org), hosted on Netlify. A Netlify Function sends signups to Sendy.

## Requirements

- Node.js and npm
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) (`npm install -g netlify-cli`)
- Access to the Netlify site. Run `netlify login`, then `netlify link` once, so that `SENDY_API_KEY` is loaded from the site's environment variables.

## Getting started

```sh
npm install
npm run dev
```

Open **http://localhost:8888**. `npm run dev` runs `netlify dev`, which starts Vite on port 5173 and serves it at port 8888 together with the Netlify Functions. Use port 8888, not 5173, or the form's `/.netlify/functions/subscribe` requests won't work.

> **Heads up:** The local function calls the live Sendy API. Anything you submit locally really subscribes that address to the list.

## Scripts

| Command             | What it does                                                   |
| ------------------- | -------------------------------------------------------------- |
| `npm run dev`       | Netlify dev server (Vite + functions) at http://localhost:8888 |
| `npm run dev:vite`  | Vite only, no functions (`netlify dev` calls this)             |
| `npm run build`     | Production build to `dist/`                                    |
| `npm run preview`   | Serve the built `dist/` locally (no functions)                 |

## Project structure

```
index.html              Subscribe page
unsubscribe.html        Unsubscribe confirmation page (inline script)
js/_index.js            Subscribe form logic and URL parameter handling
styles/
  main.css              CSS entry point; imports the files below in order
  reset.css             Base CSS reset
  base.css              Variables, typography, layout
  header.css            Logo and intro
  form.css              Form fields, buttons, status message
  fonts/                Web fonts, imported via main.css and hashed at build
public/images/          Logo, favicons, and other images, copied as-is
netlify/functions/      Serverless functions (subscribe.js → Sendy)
vite.config.mjs         Multi-page build config (both HTML pages)
postcss.config.mjs      PostCSS plugins
netlify.toml            Build and `netlify dev` settings
```

### CSS

All styles are plain CSS processed by PostCSS. Nested rules (including nested `@media`) are supported through [`postcss-nesting`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting), which flattens them at build time. To add a new stylesheet, create it in `styles/` and `@import` it in `styles/main.css`.

### Assets

- Files in `public/` are served at the site root without processing. Reference them with absolute paths, e.g. `/images/logo.svg`.
- Fonts and anything referenced through `url()` in `styles/` get fingerprinted into `dist/assets/` at build time.

## URL parameters

The subscribe page (`index.html`) reads these query parameters:

| Parameter             | Effect                                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `name`                | Prefills the name field                                                                                                        |
| `email`               | Prefills and locks the email field, and shows a note on how to change it                                                       |
| `notifications`       | Preselects the reminder dropdown (`daily,news`, `weekly,news`, or `news`)                                                      |
| `gift_recipient=true` | Gift-recipient copy: new heading and intro, daily/weekly options only, and the dropdown is required                            |

If `name` or `email` is present, the submit button reads "Update" instead of "Subscribe".

The unsubscribe page (`unsubscribe.html`) accepts `resubscribe_url`, which shows a "resubscribe instantly" link.

## Deployment

Netlify builds the site with `npm run build` and publishes `dist/`. Functions deploy from `netlify/functions/`. These settings live in `netlify.toml`.

`SENDY_API_KEY` must be set in the Netlify site's environment variables.
