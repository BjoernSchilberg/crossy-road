import * as THREE from "three";
import { metadata as rows } from "./components/Map.js";
import { player, position } from "./components/Player.js";
import { gameOver, setGameOver, playerName } from "./gameState.js";
import { showGameOver } from "./components/GameOverDisplay.js";
import { submitScore, getTopScores } from "./services/pocketbase.js";
import { getPlatform } from "./services/platform.js";

const isLauncher = typeof globalThis._jsg !== 'undefined';
const resultDOM    = isLauncher ? null : document.getElementById("result-container");
const finalScoreDOM = isLauncher ? null : document.getElementById("final-score");

const leaderboardDOM = isLauncher ? null : document.getElementById("leaderboard");

const _playerBox = new THREE.Box3();
const _vehicleBox = new THREE.Box3();

function renderLeaderboard(scores) {
  if (!leaderboardDOM) return;
  leaderboardDOM.innerHTML = scores
    .map(({ player, score }) =>
      `<li><span>${player}</span><span class="lb-score">${score}</span></li>`)
    .join('');
}

export function hitTest() {
  if (gameOver) return;

  const row = rows[position.currentRow - 1];
  if (!row) return;

  if (row.type === "car" || row.type === "truck") {
    // Use only the inner player mesh (children[0]), not the whole container
    // which also holds the camera and light and would make the box huge
    _playerBox.setFromObject(player.children[0]);

    row.vehicles.forEach(({ ref }) => {
      if (!ref) return; // disposed row

      _vehicleBox.setFromObject(ref);

      if (_playerBox.intersectsBox(_vehicleBox)) {
        setGameOver();
        const score = position.currentRow;
        showGameOver(score);                                        // launcher Three.js HUD
        if (resultDOM) resultDOM.style.visibility = "visible";     // browser DOM
        if (finalScoreDOM) finalScoreDOM.innerText = score.toString();
        // Submit score then refresh leaderboard (browser only)
        Promise.resolve(submitScore(playerName, score, getPlatform())).then(() =>
            getTopScores(20).then(renderLeaderboard)
        );
      }
    });
  }
}