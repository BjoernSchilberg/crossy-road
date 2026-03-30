import * as THREE from "three";
import { Renderer } from './components/Renderer.js';
import { Camera } from './components/Camera.js';
import { DirectionalLight } from './components/DirectionalLight.js';
import { player } from './components/Player.js';
import { map, initializeMap } from './components/Map.js';
import { animateVehicles } from './animateVehicles.js';
import { animatePlayer } from './animatePlayer.js';
import { pollGamepad } from './collectUserInput.js';
import { initScoreHUD, renderScoreHUD } from './components/ScoreDisplay.js';

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


function initializeGame() {
    initializeMap();
}

initializeGame();

const renderer = Renderer();
const canvas = document.getElementById("game");

initScoreHUD(camera);

let lastTime = performance.now();

function update(deltaTime) {
    // check for gamepad input
    pollGamepad();
    // update game logic
    animateVehicles();
    animatePlayer();
    // play sound effects
}

function render() {
    // draw the game
    renderer.render(scene, camera);
    // draw HUD overlay (score) — launcher only; browser uses DOM
    renderScoreHUD(renderer);
}

function gameLoop(time) {
    const deltaTime = performance.now() - lastTime;
    
    update(deltaTime);
    render();
    
    lastTime = time;
    requestAnimationFrame(gameLoop);
}

// start the game loop
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