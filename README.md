# CNC Tool Storage — Demo

Kiosk-friendly demo app for managing CNC tool storage. Built with Vite + React + TypeScript + Tailwind. Runs offline with hash-based routing.

## Run

```bash
npm install
npm run dev
```

## Routing & deep links

- Hash routes: `#scan`, `#inventory`, `#parts`, `#pick`
- Deep links:
  - Pick a part: `#pick?part=PN-1001`
  - Inventory hint by tool: `#inventory?tool=EM-0375B`

## Shortcuts

- Global: `Alt+1..4` switch pages
- Scan page: `Shift+R` simulate RFID, `Shift+L` simulate location, `Enter` save, `Esc` clear

## Features

- No backend; all state in-memory
- Inventory: table (desktop) / cards (mobile), with Breakdown, Archive, Restore
- Parts: add parts, assign/unassign tools
- Pick List: choose part, see tool locations and pick states, bulk move only READY items
- Dark mode toggle (persisted)
- Touch-friendly controls (≥44px)

## Camera scanning

- On the Scan page, tap "Scan" next to RFID or Location to open the device camera and scan barcodes/QR.
- Torch button appears when supported (typically Android Chrome over HTTPS) to turn on the camera LED.
- iOS Safari doesn’t expose torch; use the device flashlight as a fallback.
- For best results on mobile, serve over HTTPS to ensure full camera capability.

## Deploy (GitHub Pages)

1. Create a GitHub repo and push this project (default branch: `main`).
2. The workflow `.github/workflows/deploy.yml` builds and publishes to Pages.
3. In your repo: Settings → Pages → Source = GitHub Actions.
4. After the action completes, visit:
  - Project page: `https://<user>.github.io/<repo>/`
  - User page repo (if your repo is `<user>.github.io`): `https://<user>.github.io/`

Notes:
- Hash routing works on Pages without extra redirects.
- HTTPS is automatic, so camera and (where supported) torch work on phones.
