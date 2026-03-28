import * as THREE from "three";
import { tileSize } from '../constants.js';
import { Wheel } from './Wheel.js';

function getCarFrontTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 32;
    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 64, 32);

    context.fillStyle = "#666666";
    context.fillRect(8, 4, 48, 24);

    return new THREE.CanvasTexture(canvas);
}


function getCarSideTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 32;
    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 128, 32);

    context.fillStyle = "#666666";
    context.fillRect(10, 8, 38, 24);
    context.fillRect(58, 8, 60, 24);

    return new THREE.CanvasTexture(canvas);
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

    const carLeftSideTexture = getCarSideTexture();
    carLeftSideTexture.center = new THREE.Vector2(0.5, 0.5);
    carLeftSideTexture.rotation = Math.PI;
    carLeftSideTexture.flipY = false;

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