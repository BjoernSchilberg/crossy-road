import * as THREE from "three";
import { endsUpInValidPosition } from "./utilities/endsUpInValidPosition.js";
import { updateScore } from "./ScoreDisplay.js";

export const player = Player();

function Player() {

    const player = new THREE.Group()
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
    player.add(body)

    const cap = new THREE.Mesh(
        new THREE.BoxGeometry(2, 4, 2),
        new THREE.MeshLambertMaterial(
            { color: "#f0619a", flatShading: true }
        )
    );
    cap.position.z = 21;
    cap.castShadow = true;
    cap.receiveShadow = true;
    player.add(cap);


    const playerContainer = new THREE.Group();
    playerContainer.add(player);

    return playerContainer;
}


export const position = {
    currentRow: 0,
    currentTile: 0
}

export const movesQueue = [];

export function queueMove(direction) {
    const isValidMove = endsUpInValidPosition(
        {
            rowIndex: position.currentRow,
            tileIndex: position.currentTile
        },
        [...movesQueue, direction]
    );

    if (!isValidMove) return;
    movesQueue.push(direction);
}

export function stepCompleted() {
    const direction = movesQueue.shift();

    if (direction === "forward") position.currentRow++;
    if (direction === "backward") position.currentRow--;
    if (direction === "left") position.currentTile--;
    if (direction === "right") position.currentTile++;

    updateScore(position.currentRow);

}