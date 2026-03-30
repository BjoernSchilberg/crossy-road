import * as THREE from "three";
import { makeTexture, updateTexture } from './utilities/canvasTexture.js';

const isLauncher = typeof globalThis._jsg !== 'undefined';

const CANVAS_W = 320;
const CANVAS_H = 160;

let overlayCtx = null;
let overlayTexture = null;
let overlayMesh = null;
let currentScore = 0;

function drawOverlay() {
    overlayCtx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Dark semi-transparent background
    overlayCtx.fillStyle = 'rgba(0, 0, 0, 0.82)';
    overlayCtx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    overlayCtx.textAlign = 'center';
    overlayCtx.textBaseline = 'middle';

    // "GAME OVER"
    overlayCtx.font = 'bold 38px monospace';
    overlayCtx.fillStyle = '#ff4444';
    overlayCtx.fillText('GAME OVER', CANVAS_W / 2, 48);

    // Score
    overlayCtx.font = 'bold 24px monospace';
    overlayCtx.fillStyle = 'white';
    overlayCtx.fillText(`Score: ${currentScore}`, CANVAS_W / 2, 96);

    // Hint
    overlayCtx.font = '14px monospace';
    overlayCtx.fillStyle = '#aaaaaa';
    overlayCtx.fillText('Press any button to retry', CANVAS_W / 2, 140);

    updateTexture(overlayTexture, overlayCtx);
}

// Attaches the game-over overlay as a hidden child of `camera`.
// Only active in the launcher — the browser uses the DOM result screen.
export function initGameOverHUD(camera) {
    if (!isLauncher) return;

    // Camera frustum for 640×480, size=300: 400×300 world units
    const pxToWorld = (camera.right - camera.left) / 640;
    const worldW = CANVAS_W * pxToWorld;   // 200
    const worldH = CANVAS_H * pxToWorld;   // 100
    const posZ   = -(camera.near + 50);    // -150

    const texCanvas = document.createElement('canvas');
    texCanvas.width  = CANVAS_W;
    texCanvas.height = CANVAS_H;
    overlayCtx = texCanvas.getContext('2d');

    // Draw once so makeTexture captures valid pixel data
    overlayCtx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    overlayTexture = makeTexture(texCanvas, overlayCtx);

    overlayMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(worldW, worldH),
        new THREE.MeshBasicMaterial({
            map: overlayTexture,
            transparent: true,
            depthTest: false,
            depthWrite: false,
        })
    );
    overlayMesh.position.set(0, 0, posZ);
    overlayMesh.renderOrder = 1000;
    overlayMesh.visible = false;

    camera.add(overlayMesh);
}

export function showGameOver(score) {
    if (!isLauncher) return;
    if (!overlayMesh) return;
    currentScore = score;
    drawOverlay();
    overlayMesh.visible = true;
}

export function hideGameOver() {
    if (!isLauncher) return;
    if (!overlayMesh) return;
    overlayMesh.visible = false;
}
