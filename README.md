# WAKENS Demo (Next.js + Tailwind + React Three Fiber)

Frontend-only hotel booking demo featuring 3D room preview and dummy IoT-like metrics. Built with Next.js (App Router), Tailwind CSS, react-three-fiber, and drei. All data is static (JSON) and the 3D model loads from `/public/models/room.glb` so it works fully offline.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Structure
- `app/` – pages (home, search, hotel, room 3d/metrics, booking)
- `components/` – shared UI (nav, cards, search)
- `data/` – static hotel, room, and metrics JSON
- `public/models/room.glb` – lightweight placeholder glTF model used by the 3D viewer

## Notes
- Image optimization allows Unsplash: configured in `next.config.js`.
- 3D page controls: rotate, zoom, toggle lights, day/night environment.
