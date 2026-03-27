import * as THREE from "three";

export function Renderer() {
    const canvas = document.getElementById("game");

    if (!canvas) {
        throw new Error("No canvas found");
    }

    // In jsgamelauncher the canvas is pre-sized to 640×480 and window.innerWidth
    // reflects the native display. In the browser we render at the full viewport.
    const isLauncher = typeof globalThis._jsg !== 'undefined';
    const width  = isLauncher ? canvas.width  : window.innerWidth;
    const height = isLauncher ? canvas.height : window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        canvas: canvas,
    });
    renderer.setPixelRatio(isLauncher ? 1 : (window.devicePixelRatio || 1));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;

    return renderer;
}
