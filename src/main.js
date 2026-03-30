import * as THREE from "three";
import { Renderer } from './components/Renderer.js';
import { Camera } from './components/Camera.js';
import { DirectionalLight } from './components/DirectionalLight.js';
import { player, initializePlayer } from './components/Player.js';
import { map, initializeMap } from './components/Map.js';
import { animateVehicles } from './animateVehicles.js';
import { animatePlayer, resetAnimation } from './animatePlayer.js';
import { pollGamepad, setRestartCallback } from './collectUserInput.js';
import { initScoreHUD, renderScoreHUD } from './components/ScoreDisplay.js';
import { initGameOverHUD, hideGameOver } from './components/GameOverDisplay.js';
import { hitTest } from "./hitTest.js";
import { gameOver, resetGameOver } from "./gameState.js";

// import './style.css' // Not supported in the native runner

const scene = new THREE.Scene();
scene.add(player)
scene.add(map)

const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

const dirLight = DirectionalLight();
//scene.add(dirLight);
dirLight.target=player;
player.add(dirLight);

const camera = Camera();
//scene.add(camera)
player.add(camera);

const resultDOM = typeof globalThis._jsg === 'undefined'
    ? document.getElementById("result-container")
    : null;

function initializeGame() {
    resetGameOver();
    hideGameOver();
    resetAnimation();
    initializePlayer();   // also resets score via updateScore(0)
    initializeMap();
    if (resultDOM) resultDOM.style.visibility = "hidden";
}

// Browser: retry button
if (typeof globalThis._jsg === 'undefined') {
    document.querySelector("#retry")?.addEventListener("click", initializeGame);
}

initializeGame();

const renderer = Renderer();

initScoreHUD(camera);
initGameOverHUD(camera);

// Launcher: restart on any gamepad button press when game over
setRestartCallback(initializeGame);

let lastTime = performance.now();

function update(deltaTime) {
    // check for gamepad input (also handles restart when game over)
    pollGamepad();
    if (gameOver) return;
    // update game logic
    animateVehicles();
    animatePlayer();
    hitTest();
}

function render() {
    renderer.render(scene, camera);
    renderScoreHUD(renderer);
}

function gameLoop(time) {
    const deltaTime = performance.now() - lastTime;
    update(deltaTime);
    render();
    lastTime = time;
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

if (typeof globalThis._jsg === 'undefined') {
    window.addEventListener('resize', () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        renderer.setSize(w, h);
        const size = 300;
        const ratio = w / h;
        camera.left   = ratio < 1 ? -size / 2            : -size * ratio / 2;
        camera.right  = ratio < 1 ?  size / 2            :  size * ratio / 2;
        camera.top    = ratio < 1 ?  size / ratio / 2    :  size / 2;
        camera.bottom = ratio < 1 ? -size / ratio / 2    : -size / 2;
        camera.updateProjectionMatrix();
    });
}