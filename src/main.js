import * as THREE from "three";
import { Renderer } from "./components/Renderer";
import { Camera } from "./components/Camera";
import { DirectionalLight } from "./components/DirectionalLight";
import { player } from "./components/Player";
import { map, initialzeMap } from "./components/Map";
import { animateVehicles } from "./animateVehicles";
import { animatePlayer } from "./animatePlayer";
import "./collectUserInput";

import './style.css'

const scene = new THREE.Scene();
scene.add(player)
scene.add(map)

const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

const dirLight = DirectionalLight();
scene.add(dirLight);

const camera = Camera();
scene.add(camera)


function initializeGame() {
    initialzeMap();
}

initializeGame();

const renderer = Renderer();
renderer.setAnimationLoop(animate);

function animate() {
    animateVehicles();
    animatePlayer();
    renderer.render(scene, camera);
}