# Better Theory Site

An immersive creative-technology portfolio built around a route-aware WebGL tree: persistent branch traversal, custom cursor trail, kinetic motion, deep project routing, and Cloudflare-ready static export.

## Live Links

- Production: https://better-theory-site.pages.dev
- Latest deployment preview: https://4008ac90.better-theory-site.pages.dev
- Repository: https://github.com/kushagras1290/better-theory-site

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
