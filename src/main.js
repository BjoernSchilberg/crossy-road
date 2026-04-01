import * as THREE from "three";
import { Renderer } from './components/Renderer.js';
import { Camera, frustumOffset } from './components/Camera.js';
import { DirectionalLight } from './components/DirectionalLight.js';
import { player, initializePlayer } from './components/Player.js';
import { map, initializeMap } from './components/Map.js';
import { animateVehicles } from './animateVehicles.js';
import { animatePlayer, resetAnimation } from './animatePlayer.js';
import { pollGamepad, setRestartCallback } from './collectUserInput.js';
import { initScoreHUD, renderScoreHUD } from './components/ScoreDisplay.js';
import { initGameOverHUD, hideGameOver } from './components/GameOverDisplay.js';
import { hitTest } from "./hitTest.js";
import { gameOver, resetGameOver, setPlayerName, generateRandomName } from "./gameState.js";
import { mobileControlsReserve } from "./mobileControlsReserve.js";

// import './style.css' // Not supported in the native runner

const isLauncher = typeof globalThis._jsg !== 'undefined';

const scene = new THREE.Scene();
scene.add(player)
scene.add(map)

const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

const dirLight = DirectionalLight();
dirLight.target=player;
player.add(dirLight);

const camera = Camera();
player.add(camera);

const resultDOM = isLauncher ? null : document.getElementById("result-container");

function initializeGame() {
    resetGameOver();
    hideGameOver();
    resetAnimation();
    initializePlayer();   // also resets score via updateScore(0)
    initializeMap();
    if (resultDOM) resultDOM.style.visibility = "hidden";
}

// Browser: name-entry overlay shown before first game
if (!isLauncher) {
    const nameEntryDOM = document.getElementById("name-entry");
    const nameInputDOM = document.getElementById("name-input");
    const nameConfirmDOM = document.getElementById("name-confirm");

    function confirmName() {
        setPlayerName(nameInputDOM?.value ?? '');
        if (nameEntryDOM) nameEntryDOM.style.display = "none";
    }

    nameConfirmDOM?.addEventListener("click", confirmName);
    nameInputDOM?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") confirmName();
    });

    // Retry: keep the same name, just restart the game
    document.querySelector("#retry")?.addEventListener("click", initializeGame);
} else {
    // Launcher: no keyboard — assign random name immediately
    setPlayerName(generateRandomName());
}

initializeGame();

const renderer = Renderer();

initScoreHUD(camera);
initGameOverHUD(camera);

// Launcher: restart on any gamepad button press when game over
setRestartCallback(() => {
    setPlayerName(generateRandomName());
    initializeGame();
});

let lastTime = performance.now();

function update(deltaTime) {
    pollGamepad();
    if (gameOver) return;
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

if (!isLauncher) {
    window.addEventListener('resize', () => {
        const w = window.innerWidth;
        const h = window.innerHeight - mobileControlsReserve();
        renderer.setSize(w, h);
        const size = 300;
        const ratio = w / h;
        const halfW = ratio < 1 ? size / 2         : size * ratio / 2;
        const halfH = ratio < 1 ? size / ratio / 2 : size / 2;
        const [ox, oy] = frustumOffset(ratio);
        camera.left   = -halfW + ox;
        camera.right  =  halfW + ox;
        camera.top    =  halfH + oy;
        camera.bottom = -halfH + oy;
        camera.updateProjectionMatrix();
    });
}
