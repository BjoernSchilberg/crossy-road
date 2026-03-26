import { queueMove } from "./components/Player";


// Note: preventDefault() is used to prevent the default 
// behavior of the arrow keys, which is to scroll the page.
window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
        event.preventDefault();
        queueMove("forward");
    }
    if (event.key === "ArrowDown") {
        event.preventDefault();
        queueMove("backward");
    }
    if (event.key === "ArrowLeft") {
        event.preventDefault();
        queueMove("left");
    }
    if (event.key === "ArrowRight") {
        event.preventDefault();
        queueMove("right");
    }
});