import { queueMove } from './components/Player.js';
import { gameOver } from './gameState.js';

// Touch controls — only in browser, not in jsgamelauncher.
// (The launcher's document.getElementById returns the canvas for any id,
// so we must guard against accidentally binding to it.)
if (typeof globalThis._jsg === 'undefined') {
  document
    .getElementById("forward")
    ?.addEventListener("click", () => queueMove("forward"));

  document
    .getElementById("backward")
    ?.addEventListener("click", () => queueMove("backward"));

  document
    .getElementById("left")
    ?.addEventListener("click", () => queueMove("left"));

  document
    .getElementById("right")
    ?.addEventListener("click", () => queueMove("right"));
}


// Note: preventDefault() is used to prevent the default 
// behavior of the arrow keys, which is to scroll the page.
window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
        queueMove("forward");
    }
    if (event.key === "ArrowDown") {
        queueMove("backward");
    }
    if (event.key === "ArrowLeft") {
        queueMove("left");
    }
    if (event.key === "ArrowRight") {
        queueMove("right");
    }
});

// Track previous gamepad button/axis states for edge detection (press, not hold)
const prevState = {};
// Separate edge-detection state for the game-over restart check
const prevGameOverState = {};
// Callback invoked when a button is pressed during game-over
let _restartCallback = null;

export function setRestartCallback(cb) {
    _restartCallback = cb;
}

export function pollGamepad() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const gp = gamepads[0];
    if (!gp) return;

    // Skip game input when the launcher hotkey (button 16) is held
    const hotkey = gp.buttons[16]?.pressed;

    if (gameOver) {
        if (!hotkey && _restartCallback) {
            // Any button press (edge: was not pressed last frame) restarts the game
            for (let i = 0; i < gp.buttons.length; i++) {
                if (i === 16) continue;
                const pressed = gp.buttons[i]?.pressed ?? false;
                if (pressed && !prevGameOverState[i]) {
                    // Clear state so it doesn't fire again immediately after restart
                    for (const k in prevGameOverState) delete prevGameOverState[k];
                    _restartCallback();
                    return;
                }
                prevGameOverState[i] = pressed;
            }
        }
        return;
    }

    // Leaving game-over: clear the separate state
    for (const k in prevGameOverState) delete prevGameOverState[k];

    if (hotkey) return;

    const checkButton = (index, action) => {
        const pressed = gp.buttons[index]?.pressed ?? false;
        if (pressed && !prevState[index]) queueMove(action);
        prevState[index] = pressed;
    };

    // D-pad
    checkButton(12, 'forward');
    checkButton(13, 'backward');
    checkButton(14, 'left');
    checkButton(15, 'right');

    // Left analog stick
    const THRESHOLD = 0.5;
    const stickLeft  = gp.axes[0] < -THRESHOLD;
    const stickRight = gp.axes[0] >  THRESHOLD;
    const stickUp    = gp.axes[1] < -THRESHOLD;
    const stickDown  = gp.axes[1] >  THRESHOLD;

    if (stickLeft  && !prevState.stickLeft)  queueMove('left');
    if (stickRight && !prevState.stickRight) queueMove('right');
    if (stickUp    && !prevState.stickUp)    queueMove('forward');
    if (stickDown  && !prevState.stickDown)  queueMove('backward');

    prevState.stickLeft  = stickLeft;
    prevState.stickRight = stickRight;
    prevState.stickUp    = stickUp;
    prevState.stickDown  = stickDown;
}