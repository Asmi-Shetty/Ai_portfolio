# Cinematic Portfolio — Next.js Hero

A premium, immersive portfolio landing page with cinematic Three.js particle layer,
dual-layer video hero, GSAP entrance animations, and glassmorphism controls.

## Quick Start

```bash
npm install
# Place your video as: public/hero.mp4
npm run dev
```

## File Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout — loads Bebas Neue, Cormorant Garamond
│   ├── page.tsx            # Main page — imports VideoIntro + work section
│   ├── page.module.css     # Page + work section styles
│   └── globals.css         # CSS variables, reset, base styles
│
└── components/
    ├── VideoIntro/
    │   ├── VideoIntro.tsx          # Hero section (video + overlays + content)
    │   └── VideoIntro.module.css   # All hero styles
    │
    └── CinematicLayer/
        ├── CinematicLayer.tsx          # Canvas-based bokeh particle engine
        └── CinematicLayer.module.css   # Canvas overlay styles
```

## Video Setup

Place your video file at:
```
public/hero.mp4
```

The video is used twice:
- **Foreground**: right-anchored, full-height, slightly desaturated
- **Background**: full-bleed, blurred 80px, ambient color wash

## Customization

### Change the name
In `VideoIntro.tsx`, edit:
```tsx
<div ref={firstName} className={styles.nameFirst}>ALEX</div>
<div ref={lastName} className={styles.nameLast}>
  <span className={styles.nameLastInner}>MORGAN</span>
```

### Change tagline / subtitle
In `VideoIntro.tsx`, edit `.tagline` and `.subtitle` content.

### Particle colors
In `CinematicLayer.tsx`, edit the `palette` array:
```ts
const palette: [number, number, number][] = [
  [232, 101, 42],  // orange
  [58, 140, 223],  // blue
  // ...
];
```

### Particle density
Adjust in `createParticles()`:
```ts
const count = Math.min(Math.floor((width * height) / 8000), 220);
//                                              ^ lower = more particles
```

## Dependencies

| Package | Purpose |
|---------|---------|
| `next` | App Router + SSR |
| `react` | UI components |
| `three` | Listed as dep (canvas-based particle engine is custom 2D) |
| `gsap` | Entrance timeline animations |

## Design System

| Variable | Value |
|----------|-------|
| `--orange` | `#e8652a` |
| `--orange-warm` | `#f5893a` |
| `--blue-monitor` | `#3a8cdf` |
| `--cream` | `#f0e8d8` |
| `--font-display` | Bebas Neue |
| `--font-serif` | Cormorant Garamond |
| `--font-body` | Inter |

## Performance Notes

- Three.js canvas uses `screen` blend mode — GPU composited
- GSAP timeline is killed on unmount
- Videos are `playsInline` + `preload="auto"` for mobile
- CinematicLayer is `dynamic` imported (no SSR) to prevent hydration errors
- All animations use `transform` + `opacity` for GPU acceleration
