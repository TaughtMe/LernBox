# LernBox – Betrieb (Ops)
## PIN verwalten (Basic Auth)
- Pages → *Settings → Environment variables*
  - `BASIC_AUTH_USER` (z. B. `lernbox`)
  - `BASIC_AUTH_PASS` (PIN). Änderung → neuer Deploy → alter PIN sofort ungültig.
## Access (optional)
- Falls wieder E-Mail/OAuth nötig: Zero Trust → Access App neu anlegen. Header-Injection **aus** lassen.
## Cache/Service Worker
- Nutzer hängt im alten Stand: DevTools → Application → *Unregister SW* + *Clear site data* → Reload.
## Deployment
- Auto-Build bei jedem `git push` auf `main`.
- Lokal: `npm ci && npm run build` → Output `docs/` → ZIP erstellbar.
## Datenschutz
- Keine Nutzerkonten. Daten bleiben lokal (IndexedDB/LocalStorage).
- Keine Identitäts-Header an die App (nur PIN-Gate).
