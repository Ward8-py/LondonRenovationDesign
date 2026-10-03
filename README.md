# London Renovation Design

React landing page with a PHP enquiry endpoint. The original generic demo is preserved in `archive/demo-before-react/`.

## Local development

Requirements: Node.js 20.19+ (or 22.12+) for Vite and PHP 8.0+. Dependencies are locked in `package-lock.json`.

```powershell
npm ci
npm run build
npm run preview
```

Open http://127.0.0.1:4174. For React live editing, run `npm run dev` separately and open http://127.0.0.1:5173. Vite proxies `/api` to the PHP preview. Rebuild after changing PHP files, because the PHP preview serves the copies in `dist`.

## Source map

- `src/App.jsx`: landing page, responsive menu, native enquiry dialog.
- `src/content.js`: business details, services and process copy.
- `src/styles.css`: responsive layout, typography and design tokens.
- `src/main.jsx`: hydration and reduced-motion-aware GSAP/Lenis lifecycle.
- `src/prerender.jsx`: renders React into the production HTML and copies PHP files.
- `server/`: PHP endpoint, page entry, local router and Apache configuration.
- `public/`: local assets and fonts.
- `research/brand-brief.md`: brand interpretation, source URLs, asset provenance and unresolved source claims.
- `research/original-site/`: 27 archived public pages and 773 downloaded image URLs/variants for later migration work.

`dist` is generated. Do not hand-edit it. Only the landing page has been built; the archived service content is available for future pages.

## Enquiries and hosting

Use a PHP-capable host with `dist` as its public document root. `index.php` serves the prerendered page; `api/enquiry.php` validates the form. The existing Sites configuration targets `dist` for static hosting, but static hosting alone **cannot execute PHP**. A later deployment must use a PHP host or an explicitly configured PHP API; no hosting change has been made here.

Mail is disabled by default. After configuring authenticated outgoing mail on the PHP host and verifying the sender `website@londonrenovationdesign.co.uk`, set the server environment variable `LRD_MAIL_ENABLED=1`. The fixed recipient is `info@londonrenovationdesign.co.uk`; user email is validated and used only as Reply-To. A successful `mail()` call means acceptance by the host's mail transport, not proof of inbox delivery. Verify a real delivery with authorisation before launch.

The endpoint limits lengths, validates fields and service names, rejects other origins, uses a honeypot, and limits requests per IP when delivery is enabled. It stores only rate-limit timestamps in the host's temporary directory, not enquiry bodies. A public launch should also configure host-level abuse protection, retention/log policies and appropriate privacy information.

In preview, submitting a valid form returns an honest unavailable response and exposes an email link containing the entered enquiry. Direct telephone/email links always work independently of the PHP mail configuration. Without JavaScript, the primary enquiry links fall back to email.

## Validation

```powershell
php -l server/enquiry.php
php -l server/router.php
php -l server/index.php
# Start preview with mail explicitly disabled before running API fixtures:
$env:LRD_MAIL_ENABLED='0'
npm run preview
# In a second terminal:
node tools/check_release.mjs
```

The release check covers prerendered content, asset references, internal anchors, PHP validation, unavailable-mail behaviour and public-root isolation. It does not send email. Results are written to `research/validation.json`.

Browser access was declined during implementation. Visual rendering at desktop/mobile sizes, keyboard interactions, hydration behaviour and assistive-technology output remain to be checked in a browser. Do not equate a passing build or backend check with those checks.
