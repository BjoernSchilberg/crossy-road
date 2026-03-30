import * as THREE from "three";

// webgl-node (used by jsgamelauncher) does NOT support the canvas-element overload
// of gl.texImage2D(), so THREE.CanvasTexture silently produces a black texture.
// Instead we extract pixels via getImageData() and use THREE.DataTexture.

const isLauncher = typeof globalThis._jsg !== 'undefined';

/**
 * Creates a Three.js texture backed by a 2D canvas.
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} ctx
 * @returns {THREE.Texture}
 */
export function makeTexture(canvas, ctx) {
    if (isLauncher) {
        const { width, height } = canvas;
        const imageData = ctx.getImageData(0, 0, width, height);
        const texture = new THREE.DataTexture(
            new Uint8Array(imageData.data.buffer),
            width, height,
            THREE.RGBAFormat
        );
        texture.flipY = true;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.needsUpdate = true;
        return texture;
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    return texture;
}

/**
 * Refreshes a texture after the canvas has been redrawn.
 * For launcher DataTexture: copies fresh pixel data from the canvas.
 * For browser CanvasTexture: simply flags needsUpdate.
 * @param {THREE.Texture} texture
 * @param {CanvasRenderingContext2D} ctx
 */
export function updateTexture(texture, ctx) {
    if (isLauncher) {
        const { width, height } = ctx.canvas;
        const imageData = ctx.getImageData(0, 0, width, height);
        texture.image.data.set(imageData.data);
    }
    texture.needsUpdate = true;
}
