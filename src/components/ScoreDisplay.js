import * as THREE from "three";

const isLauncher = typeof globalThis._jsg !== 'undefined';

let hudScene = null;
let hudCamera = null;
let scoreTexture = null;
let scoreCtx = null;
let currentScore = 0;

function drawScoreToCanvas() {
    const w = scoreCtx.canvas.width;
    const h = scoreCtx.canvas.height;
    scoreCtx.clearRect(0, 0, w, h);

    // black outline for readability against any background
    scoreCtx.font = 'bold 28px monospace';
    scoreCtx.textBaseline = 'top';
    scoreCtx.strokeStyle = 'black';
    scoreCtx.lineWidth = 4;
    scoreCtx.strokeText(String(currentScore), 4, 4);
    scoreCtx.fillStyle = 'white';
    scoreCtx.fillText(String(currentScore), 4, 4);

    scoreTexture.needsUpdate = true;
}

export function initScoreHUD(renderer) {
    if (!isLauncher) return;

    const canvas = renderer.domElement;
    const w = canvas.width;   // 640
    const h = canvas.height;  // 480

    hudScene = new THREE.Scene();
    // y increases upward; (0,0) = bottom-left, (w,h) = top-right
    hudCamera = new THREE.OrthographicCamera(0, w, h, 0, -1, 1);

    const texCanvas = document.createElement('canvas');
    texCanvas.width = 200;
    texCanvas.height = 50;
    scoreCtx = texCanvas.getContext('2d');

    scoreTexture = new THREE.CanvasTexture(texCanvas);
    scoreTexture.minFilter = THREE.LinearFilter;

    const material = new THREE.MeshBasicMaterial({
        map: scoreTexture,
        transparent: true,
        depthTest: false,
    });
    const geometry = new THREE.PlaneGeometry(200, 50);
    const mesh = new THREE.Mesh(geometry, material);
    // top-left: margin 20px → mesh center at x=120, y = h-20-25
    mesh.position.set(120, h - 45, 0);
    hudScene.add(mesh);

    drawScoreToCanvas();
}

export function updateScore(value) {
    currentScore = value;
    if (isLauncher) {
        if (scoreCtx) drawScoreToCanvas();
    } else {
        const el = document.getElementById('score');
        if (el) el.innerText = String(value);
    }
}

export function renderScoreHUD(renderer) {
    if (!isLauncher || !hudScene) return;
    const prevAutoClear = renderer.autoClear;
    renderer.autoClear = false;
    renderer.render(hudScene, hudCamera);
    renderer.autoClear = prevAutoClear;
}
