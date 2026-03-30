import * as THREE from "three";
import { metadata as rows } from "./components/Map.js";
import { player, position } from "./components/Player.js";
import { gameOver, setGameOver } from "./gameState.js";
import { showGameOver } from "./components/GameOverDisplay.js";

const isLauncher = typeof globalThis._jsg !== 'undefined';
const resultDOM    = isLauncher ? null : document.getElementById("result-container");
const finalScoreDOM = isLauncher ? null : document.getElementById("final-score");

export function hitTest() {
  if (gameOver) return;

  const row = rows[position.currentRow - 1];
  if (!row) return;

  if (row.type === "car" || row.type === "truck") {
    // Use only the inner player mesh (children[0]), not the whole container
    // which also holds the camera and light and would make the box huge
    const playerBoundingBox = new THREE.Box3();
    playerBoundingBox.setFromObject(player.children[0]);

    row.vehicles.forEach(({ ref }) => {
      if (!ref) throw Error("Vehicle reference is missing");

      const vehicleBoundingBox = new THREE.Box3();
      vehicleBoundingBox.setFromObject(ref);

      if (playerBoundingBox.intersectsBox(vehicleBoundingBox)) {
        setGameOver();
        showGameOver(position.currentRow);   // launcher Three.js HUD
        if (resultDOM) resultDOM.style.visibility = "visible"; // browser DOM
        if (finalScoreDOM) finalScoreDOM.innerText = position.currentRow.toString();
      }
    });
  }
}