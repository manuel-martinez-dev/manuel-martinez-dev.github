# Manuel Martinez — Resume Site

Personal CV shown as a static site on GitHub Pages.

**Live:** https://manuel-martinez-dev.github.io/manuel-martinez-dev.github/

## How it works

The site is a single HTML page with no build step or dependencies beyond a Google Fonts.

### Passphrase-gated PDF download

Phone and email are not stored in plain text anywhere in the source. They are encrypted with **AES-GCM**.

Clicking `./download-resume.sh` opens a passphrase prompt. On success, The print version will show contact details. The contact fields are hidden on screen via CSS and only appear in the print version.

## Used

- HTML / CSS / Vanilla JS
- `crypto.subtle` (Web Crypto API) — no third-party crypto library
- GitHub Pages (no CI, no build step)
