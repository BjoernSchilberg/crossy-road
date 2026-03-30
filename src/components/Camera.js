import * as THREE from "three";
import { mobileControlsReserve } from "../mobileControlsReserve.js";

export function Camera() {
    const size = 300;
    const isLauncher = typeof globalThis._jsg !== 'undefined';
    const gameCanvas = document.getElementById('game');
    const gameWidth  = isLauncher ? gameCanvas.width  : window.innerWidth;
    const gameHeight = isLauncher ? gameCanvas.height : window.innerHeight - mobileControlsReserve();
    const viewRatio = gameWidth / gameHeight;
    const width = viewRatio < 1 ? size : size * viewRatio;
    const height = viewRatio < 1 ? size / viewRatio : size;

    // On portrait touch devices shift the frustum so the player appears in the
    // lower-left area and more of the road ahead (upper-right in iso view) is visible.
    const [ox, oy] = frustumOffset(viewRatio);

    const camera = new THREE.OrthographicCamera(
        width / -2 + ox, //left
        width /  2 + ox, //right
        height / 2 + oy, //top
        height / -2 + oy, //bottom
        100, //near
        900, //far
    );
    //z-Axis is up
    camera.up.set(0, 0, 1);

    camera.position.set(300, -300, 300);

    // look to the origin of coordinate system.
    // where the player was located
    camera.lookAt(0, 0, 0);
    return camera;
}

/** Frustum offset (ox, oy) in camera-space world units for mobile portrait. */
export function frustumOffset(viewRatio) {
    const isLauncher = typeof globalThis._jsg !== 'undefined';
    const isMobile = !isLauncher && window.matchMedia('(pointer: coarse)').matches;
    if (!isMobile || viewRatio >= 1) return [0, 0];
    // Shift frustum right (+ox) → player appears left of center
    // Shift frustum up   (+oy) → player appears below center
    // Values tuned so player lands ~35% from left and ~38% from bottom.
    return [45, 60];
}