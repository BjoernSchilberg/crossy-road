import * as THREE from "three";

const isLauncher = typeof globalThis._jsg !== 'undefined';

let scoreCtx = null;
let scoreTexture = null;
let currentScore = 0;

const CANVAS_W = 160;
const CANVAS_H = 40;

function drawScore() {
    scoreCtx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    const text = String(currentScore);
    scoreCtx.font = 'bold 30px monospace';
    scoreCtx.textBaseline = 'middle';
    scoreCtx.lineJoin = 'round';
    scoreCtx.strokeStyle = 'rgba(0,0,0,0.85)';
    scoreCtx.lineWidth = 6;
    scoreCtx.strokeText(text, 4, CANVAS_H / 2);
    scoreCtx.fillStyle = 'white';
    scoreCtx.fillText(text, 4, CANVAS_H / 2);
    scoreTexture.needsUpdate = true;
}

// Attaches the score overlay as a child of `camera` so it is rendered in the
// normal scene pass — avoids a second renderer.render() call and autoClear hacks.
export function initScoreHUD(camera) {
    if (!isLauncher) return;

    // Camera frustum for 640×480, size=300:  left=-200, right=200, top=150, bottom=-150
    // World-units per pixel: 400/640 = 0.625 (both axes are equal for this aspect ratio)
    const pxToWorld = (camera.right - camera.left) / 640;

    const worldW  = CANVAS_W * pxToWorld;          // 100
    const worldH  = CANVAS_H * pxToWorld;          // 25
    const margin  = 20 * pxToWorld;                // 12.5

    // Position in camera-local space: top-left corner + margin + half-sprite
    const posX = camera.left  + margin + worldW / 2;   // -137.5
    const posY = camera.top   - margin - worldH / 2;   // 125
    const posZ = -(camera.near + 50);                  // -150  (inside near…far frustum)

    const texCanvas = document.createElement('canvas');
    texCanvas.width  = CANVAS_W;
    texCanvas.height = CANVAS_H;
    scoreCtx = texCanvas.getContext('2d');

    scoreTexture = new THREE.CanvasTexture(texCanvas);
    scoreTexture.minFilter = THREE.LinearFilter;
    scoreTexture.magFilter = THREE.LinearFilter;

    const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(worldW, worldH),
        new THREE.MeshBasicMaterial({
            map: scoreTexture,
            transparent: true,
            depthTest: false,
            depthWrite: false,
        })
    );
    mesh.position.set(posX, posY, posZ);
    mesh.renderOrder = 999;

    camera.add(mesh);
    drawScore();
}

export function updateScore(value) {
    currentScore = value;
    if (isLauncher) {
        if (scoreCtx) drawScore();
    } else {
        const el = document.getElementById('score');
        if (el) el.innerText = String(value);
    }
}

// No-op: HUD mesh lives in the scene graph and renders with the main pass.
export function renderScoreHUD(_renderer) {}

