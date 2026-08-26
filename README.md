# TechGnomo — Neural Night

The review build of [techgnomo.com](https://techgnomo.com/): an independent digital product studio portfolio for websites, app MVPs and practical AI automations.

This repository is the development copy. It does not replace the current public website until the review and release checklist are complete.

## Pages

- `index.html` — one-page studio introduction, services, selected work, process, founder story and project brief.
- `clearmoneypath.html` — ClearMoneyPath product page and working-MVP status.
- `appstart.html` — AppStart product case study and acceptance-testing approach.
- `mvp-scope-checker.html` — free, browser-only MVP scoping tool.
- `404.html` — branded not-found page.

## Run locally

No dependencies or build step are required. Use either command:

```bash
python -m http.server 8000
npm run dev
```

- With Python, open `http://localhost:8000`.
- With Node/npm, open `http://localhost:4173`.

## Organic visibility foundation

The review build includes:

- unique titles and descriptions;
- canonical URLs;
- Open Graph and social descriptions;
- `Organization`, `WebSite` and `SoftwareApplication` structured data;
- `robots.txt` and `sitemap.xml`;
- semantic headings, crawlable internal links and descriptive anchor text;
- fast asset-free rendering, responsive layouts and reduced-motion support;
- trackable conversion events through `window.techGnomoTrack`;
- a free, indexable utility designed to earn relevant visits and links.

Search Console, Bing Webmaster Tools and analytics require account-owned verification values. Connect them only during the release step; do not commit account secrets.

## Measurement hooks

Buttons and product links expose named `data-event` values. `script.js` sends them to `gtag` when Google Analytics is present and always emits a local `techgnomo:event` browser event. This keeps the website provider-neutral until an analytics account is selected.

Priority conversions:

- `project_brief_prepared`
- `scope_result_generated`
- `scope_copy`
- `scope_email`
- product-page and contact CTA events

## Release checklist

1. Review copy, services and product status with Fabio.
2. Validate all local links, HTML, JavaScript and structured data.
3. Test keyboard navigation, reduced motion and representative mobile/desktop widths.
4. Add the final AppStart public URL when available.
5. Add account-owned Search Console and analytics verification.
6. Merge into the public repository only after explicit approval.

## Copyright

Copyright © 2026 Fabio D’Anna / TechGnomo. See `LICENSE`.
