import * as THREE from "three";
import { tileSize } from '../constants.js';
import { Wheel } from './Wheel.js';
import { makeTexture } from './utilities/canvasTexture.js';

// Textures are the same for every car — create once and share.
let _carFrontTexture = null;
let _carSideTexture = null;
let _carLeftSideTexture = null;

function getCarFrontTexture() {
    if (_carFrontTexture) return _carFrontTexture;
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 32;
    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 64, 32);
    context.fillStyle = "#666666";
    context.fillRect(8, 4, 48, 24);
    _carFrontTexture = makeTexture(canvas, context);
    return _carFrontTexture;
}

function getCarSideTexture() {
    if (_carSideTexture) return _carSideTexture;
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 32;
    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 128, 32);
    context.fillStyle = "#666666";
    context.fillRect(10, 8, 38, 24);
    context.fillRect(58, 8, 60, 24);
    _carSideTexture = makeTexture(canvas, context);
    return _carSideTexture;
}

function getCarLeftSideTexture() {
    if (_carLeftSideTexture) return _carLeftSideTexture;
    // Clone UV-transform properties so they don't affect the shared right-side texture.
    const t = getCarSideTexture().clone();
    t.center = new THREE.Vector2(0.5, 0.5);
    t.rotation = Math.PI;
    t.flipY = false;
    t.needsUpdate = true;
    _carLeftSideTexture = t;
    return _carLeftSideTexture;
}

export function Car(initialTileIndex, direction, color) {
    const car = new THREE.Group();
    car.position.x = initialTileIndex * tileSize;
    if (!direction) {
        // 180 degree rotation (Radian)
        car.rotation.z = Math.PI;
    }

    const main = new THREE.Mesh(
        new THREE.BoxGeometry(60, 30, 15),
        new THREE.MeshLambertMaterial({ color: color, flatShading: true })
    );
    main.position.z = 12;
    main.castShadow = true;
    main.receiveShadow = true;
    car.add(main);

    const carFrontTexture = getCarFrontTexture();
    const carBackTexture = getCarFrontTexture();
    const carRightSideTexture = getCarSideTexture();
    const carLeftSideTexture = getCarLeftSideTexture();

    const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(33, 24, 12),
        [
            new THREE.MeshLambertMaterial({ map: carFrontTexture }),      // +x  front windshield
            new THREE.MeshLambertMaterial({ map: carBackTexture }),       // -x  rear window
            new THREE.MeshLambertMaterial({ map: carLeftSideTexture }),   // +y  left side
            new THREE.MeshLambertMaterial({ map: carRightSideTexture }),  // -y  right side (camera-facing)
            new THREE.MeshLambertMaterial({ color: "#ffffff", flatShading: true }), // +z  roof
            new THREE.MeshLambertMaterial({ color: "#ffffff", flatShading: true }), // -z  floor
        ]
    );


    cabin.position.x = -6;
    cabin.position.z = 25.5;
    cabin.castShadow = true;
    cabin.receiveShadow = true;
    car.add(cabin);

    const frontWheel = Wheel(18);
    car.add(frontWheel);

    const backWheel = Wheel(-18);
    car.add(backWheel);


    return car;
}