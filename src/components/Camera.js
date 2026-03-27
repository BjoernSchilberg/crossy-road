import * as THREE from "three";

export function Camera() {
    const size = 300;
    const isLauncher = typeof globalThis._jsg !== 'undefined';
    const gameCanvas = document.getElementById('game');
    const gameWidth  = isLauncher ? gameCanvas.width  : window.innerWidth;
    const gameHeight = isLauncher ? gameCanvas.height : window.innerHeight;
    const viewRatio = gameWidth / gameHeight;
    const width = viewRatio < 1 ? size : size * viewRatio;
    const height = viewRatio < 1 ? size / viewRatio : size;

    const camera = new THREE.OrthographicCamera(
        width / -2, //left
        width / 2, //right
        height / 2, //top
        height / -2, //bottom
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