# Copilot Instructions

## What This Is

A Three.js isometric Crossy Road clone built with Vite and ES Modules. Designed for the **jsgamelauncher** platform (`npx rungame ./crossy-road.jsg`) but also runs in-browser via Vite.

## .jsg File

`crossy-road.jsg` is a configuration file for **jsgamelauncher**. It is optional and can be empty, but should be present (named the same as the game) so EmulationStation on retro gaming devices recognizes it. Run the game without a browser via:

```sh
npx rungame ./crossy-road.jsg
```

## Commands

```sh
npm run dev      # Start dev server (open the URL it prints)
npm run build    # Production bundle
npm run preview  # Preview production build locally
```

No test or lint tooling is configured.

## Architecture

`src/main.js` owns the game loop and scene. It imports components, instantiates them, collects input, and calls the animators on each frame.

```
main.js  (scene + requestAnimationFrame loop)
├── components/  (factory functions → THREE.js objects)
│   ├── Map.js        metadata array of rows + instantiates all terrain & vehicles
│   ├── Player.js     white box body + pink cap; owns position + movesQueue
│   ├── Car.js / Truck.js / Tree.js / Grass.js / Road.js / Wheel.js
│   ├── Camera.js     orthographic isometric (z-up, 300,-300,300)
│   ├── Renderer.js   WebGL + shadow mapping
│   └── DirectionalLight.js  2048×2048 shadow map
├── collectUserInput.js   queues arrow-key moves into movesQueue[]
├── animatePlayer.js      lerps player over 0.2 s per step (THREE.Clock)
├── animateVehicles.js    delta-time position updates; wraps vehicles at row edges
└── constants.js          tileSize = 42, column range −8..8
```

## Key Conventions

**Factory functions everywhere.** Every entity is a plain function (PascalCase) that builds and returns a `THREE.Group`. No classes.

```js
// Correct pattern
export function Car(initialTileIndex, direction, color) {
  const car = new THREE.Group();
  // ... add BoxGeometry meshes
  return car;
}
```

**Metadata-driven rows.** `Map.js` exports a `metadata` array where each entry describes a row (type, speed, direction, vehicle/tree refs). Animators read this array directly — vehicles store a `.ref` pointing to their Three.js group so `animateVehicles` can move them.

**Two coordinate systems.**
- Player: integer grid (`currentRow`, `currentTile`) converted to world coords inside `animatePlayer.js`.
- Vehicles: world coordinates in pixels, wrapping at `beginningOfRow`/`endOfRow` (from `constants.js`).

**Shared mutable state via module exports.** `Player.js` exports `position` and `movesQueue` as plain objects/arrays; multiple modules import and mutate them directly.

**All geometry is programmatic.** No external model files. Everything is `BoxGeometry`/`PlaneGeometry` with flat shading for the low-poly look.

**Shadows must be explicitly enabled.** Every mesh that should cast or receive shadows needs both flags set:
```js
mesh.castShadow = true;
mesh.receiveShadow = true;
```
