# LernBox 2.0 – Release Notes (Kurz)
## Inhalt
- **Bereitstellung:** Cloudflare Pages (base "/"), PWA mit NetworkFirst für HTML, Assets CacheFirst.
- **Security-Hardening:**
  - RTE-HTML: zentrale Sanitization (`sanitizeHtml` via DOMPurify), verbotene Tags/Events.
  - CSV-Import: Formula-Injection entschärft (`csvSafe.ts`), `.csv` accept.
  - QR-Import: Validierung/Sanitizing & Limits (`qrValidate.ts` + `qrImport.ts`), Batch ≤ 50, HTML ≤ 5k/Seite.
  - **Zugangsschutz:** Basic Auth (PIN) via Pages Functions (`functions/_middleware.ts`), keine Identitäts-Header.
  - **CSP & Header:** `_headers` (nosniff, frame-deny, HSTS, Referrer-Policy, Permissions-Policy).
- **UX:** QR-Scan Multi-Select, RTE-Anzeige, PWA-Update-Prompt, Darkmode.
- **Aufräumen:** Debug-Logs entfernt, Prettier/ESLint durchgelaufen.
## Bekannte Punkte
- Bild-Upload (Phase 27) bleibt **pausiert**.
- Lint-Warnungen (z. B. `any`) in einigen Dateien sind nicht release-kritisch.
## Version/Build
- Version: aus `package.json` / `docs/version.json`
- Build: `npm run build` → Output `docs/`
