# Better Theory Site

An immersive creative-technology portfolio built to outperform the reference interaction model of `activetheory.net/work`: persistent WebGL, custom cursor trail, kinetic motion, deep project routing, and Cloudflare-ready static export.

## Stack

- Next.js App Router with static export
- React 19
- Framer Motion
- React Three Fiber / Three.js
- Cloudflare Pages

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run lint
npm run build
```

The production artifact is emitted to `out/`.

## Deploy

```bash
npm run deploy
```

Cloudflare Pages settings:

- Build command: `npm run build`
- Output directory: `out`
- Production branch: `main`
