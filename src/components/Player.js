import * as THREE from "three";

export const player = Player();

function Player() {
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(15, 15, 20),
        new THREE.MeshLambertMaterial({
            color: "#ffffff",
            flatShading: true
        })
    );
    body.position.z = 10;
    body.castShadow = true;
    body.receiveShadow = true;

    return body;
}


export const position = {
    currentRow: 0,
    currentTile: 0
}

export const movesQueue = [];

export function queueMove(direction) {
    movesQueue.push(direction);
}

export function stepCompleted() {
    const direction = movesQueue.shift();

    if (direction === "forward") position.currentRow++;
    if (direction === "backward") position.currentRow--;
    if (direction === "left") position.currentTile--;
    if (direction === "right") position.currentTile++;

}