import * as THREE from "three";
import { makeTexture, updateTexture } from './utilities/canvasTexture.js';
import { getTopScores } from '../services/pocketbase.js';
import { replaceEmoji } from '../services/emojiMap.js';

const isLauncher = typeof globalThis._jsg !== 'undefined';

const CANVAS_W = 320;
const CANVAS_H = 320;  // tall enough for 10 rows + scroll indicators + hint
const ROWS_VISIBLE = 10;
const ROW_H = 16;

let overlayCtx = null;
let overlayTexture = null;
let overlayMesh = null;
let currentScore = 0;
let topScores = [];
let _scoresLoading = false;
let _scrollOffset = 0;

function drawOverlay() {
    overlayCtx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Dark semi-transparent background
    overlayCtx.fillStyle = 'rgba(0, 0, 0, 0.88)';
    overlayCtx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    overlayCtx.textAlign = 'center';
    overlayCtx.textBaseline = 'middle';

    // "GAME OVER"
    overlayCtx.font = 'bold 32px monospace';
    overlayCtx.fillStyle = '#ff4444';
    overlayCtx.fillText('GAME OVER', CANVAS_W / 2, 28);

    // Score
    overlayCtx.font = 'bold 20px monospace';
    overlayCtx.fillStyle = 'white';
    overlayCtx.fillText(`Score: ${currentScore}`, CANVAS_W / 2, 62);

    // Leaderboard title
    overlayCtx.font = 'bold 13px monospace';
    overlayCtx.fillStyle = '#ffdd44';
    overlayCtx.fillText('TOP SCORES', CANVAS_W / 2, 92);

    // Scroll up indicator
    const canScrollUp = _scrollOffset > 0;
    const canScrollDown = _scrollOffset + ROWS_VISIBLE < topScores.length;
    overlayCtx.font = '11px monospace';
    overlayCtx.fillStyle = canScrollUp ? '#aaa' : '#333';
    overlayCtx.fillText('[ up ]', CANVAS_W / 2, 104);

    // Leaderboard rows
    overlayCtx.font = '12px monospace';
    overlayCtx.textAlign = 'left';
    overlayCtx.textBaseline = 'middle';
    const rowsToShow = topScores.slice(_scrollOffset, _scrollOffset + ROWS_VISIBLE);
    rowsToShow.forEach(({ player, score }, i) => {
        const rank = _scrollOffset + i + 1;
        const y = 114 + i * ROW_H + ROW_H / 2;
        overlayCtx.fillStyle = rank === 1 ? '#ffd700' : '#cccccc';
        overlayCtx.fillText(`${rank}.`, 24, y);
        overlayCtx.fillText(replaceEmoji(player).substring(0, 12), 52, y);
        overlayCtx.textAlign = 'right';
        overlayCtx.fillText(String(score), CANVAS_W - 24, y);
        overlayCtx.textAlign = 'left';
    });

    if (topScores.length === 0) {
        overlayCtx.fillStyle = '#555';
        overlayCtx.textAlign = 'center';
        overlayCtx.fillText(_scoresLoading ? 'loading...' : 'no scores available', CANVAS_W / 2, 114 + ROW_H * 5);
    }

    // Scroll down indicator
    overlayCtx.font = '11px monospace';
    overlayCtx.fillStyle = canScrollDown ? '#aaa' : '#333';
    overlayCtx.textAlign = 'center';
    overlayCtx.fillText('[ down ]', CANVAS_W / 2, 114 + ROWS_VISIBLE * ROW_H + 8);

    // Hint
    overlayCtx.font = '11px monospace';
    overlayCtx.fillStyle = '#aaaaaa';
    overlayCtx.fillText('other button: retry', CANVAS_W / 2, CANVAS_H - 10);

    updateTexture(overlayTexture, overlayCtx);
}

// Attaches the game-over overlay as a hidden child of `camera`.
// Only active in the launcher — the browser uses the DOM result screen.
export function initGameOverHUD(camera) {
    if (!isLauncher) return;

    // Camera frustum for 640×480, size=300: 400×300 world units
    const pxToWorld = (camera.right - camera.left) / 640;
    const worldW = CANVAS_W * pxToWorld;
    const worldH = CANVAS_H * pxToWorld;
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

export async function showGameOver(score) {
    if (!isLauncher) return;
    if (!overlayMesh) return;
    currentScore = score;
    topScores = [];
    _scoresLoading = true;
    _scrollOffset = 0;
    drawOverlay();                  // show immediately with "loading..."
    overlayMesh.visible = true;
    topScores = await getTopScores(20);
    _scoresLoading = false;
    drawOverlay();                  // redraw with actual data
}

/** Scroll the leaderboard by delta rows (+1 = down, -1 = up). */
export function scrollLeaderboard(delta) {
    if (!isLauncher || !overlayMesh?.visible) return;
    const max = Math.max(0, topScores.length - ROWS_VISIBLE);
    _scrollOffset = Math.min(max, Math.max(0, _scrollOffset + delta));
    drawOverlay();
}

export function hideGameOver() {
    if (!isLauncher) return;
    if (!overlayMesh) return;
    overlayMesh.visible = false;
}
