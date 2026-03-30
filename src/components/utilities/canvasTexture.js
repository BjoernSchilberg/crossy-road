import * as THREE from "three";

// webgl-node (used by jsgamelauncher) does NOT support the canvas-element overload
// of gl.texImage2D(), so THREE.CanvasTexture silently produces a black texture.
// Instead we extract pixels via getImageData() and use THREE.DataTexture.

// UNPACK_FLIP_Y_WEBGL only works for DOM sources (Canvas element, ImageBitmap, …).
// For Uint8Array data it is silently ignored, so we must flip rows manually.
function flipY(data, width, height) {
    const stride = width * 4;
    const flipped = new Uint8Array(data.length);
    for (let row = 0; row < height; row++) {
        const src = (height - 1 - row) * stride;
        flipped.set(data.subarray(src, src + stride), row * stride);
    }
    return flipped;
}

const isLauncher = typeof globalThis._jsg !== 'undefined';

/**
 * Creates a Three.js texture backed by a 2D canvas.
 * In the launcher (webgl-node) uses DataTexture + getImageData because
 * webgl-node does not support the canvas-element overload of gl.texImage2D().
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} ctx
 * @returns {THREE.Texture}
 */
export function makeTexture(canvas, ctx) {
    if (isLauncher) {
        const { width, height } = canvas;
        const imageData = ctx.getImageData(0, 0, width, height);
        const texture = new THREE.DataTexture(
            flipY(new Uint8Array(imageData.data.buffer), width, height),
            width, height,
            THREE.RGBAFormat
        );
        texture.flipY = false; // data is already in WebGL order
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
 * For launcher DataTexture: copies fresh (flipped) pixel data from the canvas.
 * For browser CanvasTexture: simply flags needsUpdate.
 * @param {THREE.Texture} texture
 * @param {CanvasRenderingContext2D} ctx
 */
export function updateTexture(texture, ctx) {
    if (isLauncher) {
        const { width, height } = ctx.canvas;
        const imageData = ctx.getImageData(0, 0, width, height);
        texture.image.data.set(flipY(new Uint8Array(imageData.data.buffer), width, height));
    }
    texture.needsUpdate = true;
}
